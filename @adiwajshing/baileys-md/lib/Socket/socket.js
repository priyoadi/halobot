"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSocket = void 0;
const boom_1 = require("@hapi/boom");
const events_1 = __importDefault(require("events"));
const util_1 = require("util");
const ws_1 = __importDefault(require("ws"));
const crypto_1 = require("crypto");
const WAProto_1 = require("../../WAProto");
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const Defaults_1 = require("../Defaults");
const WABinary_1 = require("../WABinary");
/**
 * Connects to WA servers and performs:
 * - simple queries (no retry mechanism, wait for connection establishment)
 * - listen to messages and emit events
 * - query phone connection
 */
const makeSocket = ({ waWebSocketUrl, connectTimeoutMs, logger, agent, keepAliveIntervalMs, version, browser, auth: initialAuthState, printQRInTerminal, defaultQueryTimeoutMs }) => {
    const ws = new ws_1.default(waWebSocketUrl, undefined, {
        origin: Defaults_1.DEFAULT_ORIGIN,
        timeout: connectTimeoutMs,
        agent,
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Host': 'web.whatsapp.com',
            'Pragma': 'no-cache',
            'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits'
        }
    });
    ws.setMaxListeners(0);
    const ev = new events_1.default();
    /** ephemeral key pair used to encrypt/decrypt communication. Unique for each connection */
    const ephemeralKeyPair = Utils_1.Curve.generateKeyPair();
    /** WA noise protocol wrapper */
    const noise = (0, Utils_1.makeNoiseHandler)(ephemeralKeyPair);
    let authState = initialAuthState;
    if (!authState) {
        authState = (0, Utils_1.useSingleFileAuthState)('./auth-info-multi.json').state;
        logger.warn(`
            Baileys just created a single file state for your credentials. 
            This will not be supported soon.
            Please pass the credentials in the config itself
        `);
    }
    const { creds } = authState;
    let lastDateRecv;
    let epoch = 0;
    let keepAliveReq;
    let qrTimer;
    const uqTagId = `${(0, crypto_1.randomBytes)(1).toString('hex')[0]}.${(0, crypto_1.randomBytes)(1).toString('hex')[0]}-`;
    const generateMessageTag = () => `${uqTagId}${epoch++}`;
    const sendPromise = (0, util_1.promisify)(ws.send);
    /** send a raw buffer */
    const sendRawMessage = (data) => {
        const bytes = noise.encodeFrame(data);
        return sendPromise.call(ws, bytes);
    };
    /** send a binary node */
    const sendNode = (node) => {
        let buff = (0, WABinary_1.encodeBinaryNode)(node);
        return sendRawMessage(buff);
    };
    /** await the next incoming message */
    const awaitNextMessage = async (sendMsg) => {
        if (ws.readyState !== ws.OPEN) {
            throw new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed });
        }
        let onOpen;
        let onClose;
        const result = new Promise((resolve, reject) => {
            onOpen = (data) => resolve(data);
            onClose = reject;
            ws.on('frame', onOpen);
            ws.on('close', onClose);
            ws.on('error', onClose);
        })
            .finally(() => {
            ws.off('frame', onOpen);
            ws.off('close', onClose);
            ws.off('error', onClose);
        });
        if (sendMsg) {
            sendRawMessage(sendMsg).catch(onClose);
        }
        return result;
    };
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    const waitForMessage = async (msgId, timeoutMs = defaultQueryTimeoutMs) => {
        let onRecv;
        let onErr;
        try {
            const result = await (0, Utils_1.promiseTimeout)(timeoutMs, (resolve, reject) => {
                onRecv = resolve;
                onErr = err => {
                    reject(err || new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed }));
                };
                ws.on(`TAG:${msgId}`, onRecv);
                ws.on('close', onErr); // if the socket closes, you'll never receive the message
                ws.off('error', onErr);
            });
            return result;
        }
        finally {
            ws.off(`TAG:${msgId}`, onRecv);
            ws.off('close', onErr); // if the socket closes, you'll never receive the message
            ws.off('error', onErr);
        }
    };
    /** send a query, and wait for its response. auto-generates message ID if not provided */
    const query = async (node, timeoutMs) => {
        if (!node.attrs.id)
            node.attrs.id = generateMessageTag();
        const msgId = node.attrs.id;
        const wait = waitForMessage(msgId, timeoutMs);
        await sendNode(node);
        const result = await wait;
        if ('tag' in result) {
            (0, WABinary_1.assertNodeErrorFree)(result);
        }
        return result;
    };
    /** connection handshake */
    const validateConnection = async () => {
        logger.info('connected to WA Web');
        const init = WAProto_1.proto.HandshakeMessage.encode({
            clientHello: { ephemeral: ephemeralKeyPair.public }
        }).finish();
        const result = await awaitNextMessage(init);
        const handshake = WAProto_1.proto.HandshakeMessage.decode(result);
        logger.debug('handshake recv from WA Web');
        const keyEnc = noise.processHandshake(handshake, creds.noiseKey);
        logger.info('handshake complete');
        let node;
        if (!creds.me) {
            logger.info('not logged in, attempting registration...');
            node = (0, Utils_1.generateRegistrationNode)(creds, { version, browser });
        }
        else {
            logger.info('logging in...');
            node = (0, Utils_1.generateLoginNode)(creds.me.id, { version, browser });
        }
        const payloadEnc = noise.encrypt(node);
        await sendRawMessage(WAProto_1.proto.HandshakeMessage.encode({
            clientFinish: {
                static: new Uint8Array(keyEnc),
                payload: new Uint8Array(payloadEnc),
            },
        }).finish());
        noise.finishInit();
        startKeepAliveRequest();
    };
    /** get some pre-keys and do something with them */
    const assertingPreKeys = async (range, execute) => {
        const { newPreKeys, lastPreKeyId, preKeysRange } = (0, Utils_1.generateOrGetPreKeys)(authState.creds, range);
        const update = {
            nextPreKeyId: Math.max(lastPreKeyId + 1, creds.nextPreKeyId),
            firstUnuploadedPreKeyId: Math.max(creds.firstUnuploadedPreKeyId, lastPreKeyId + 1)
        };
        if (!creds.serverHasPreKeys) {
            update.serverHasPreKeys = true;
        }
        await Promise.all(Object.keys(newPreKeys).map(k => authState.keys.setPreKey(+k, newPreKeys[+k])));
        const preKeys = await (0, Utils_1.getPreKeys)(authState.keys, preKeysRange[0], preKeysRange[0] + preKeysRange[1]);
        await execute(preKeys);
        ev.emit('creds.update', update);
    };
    /** generates and uploads a set of pre-keys */
    const uploadPreKeys = async () => {
        await assertingPreKeys(30, async (preKeys) => {
            const node = {
                tag: 'iq',
                attrs: {
                    id: generateMessageTag(),
                    xmlns: 'encrypt',
                    type: 'set',
                    to: WABinary_1.S_WHATSAPP_NET,
                },
                content: [
                    { tag: 'registration', attrs: {}, content: (0, Utils_1.encodeBigEndian)(creds.registrationId) },
                    { tag: 'type', attrs: {}, content: Defaults_1.KEY_BUNDLE_TYPE },
                    { tag: 'identity', attrs: {}, content: creds.signedIdentityKey.public },
                    { tag: 'list', attrs: {}, content: Object.keys(preKeys).map(k => (0, Utils_1.xmppPreKey)(preKeys[+k], +k)) },
                    (0, Utils_1.xmppSignedPreKey)(creds.signedPreKey)
                ]
            };
            await sendNode(node);
            logger.info('uploaded pre-keys');
        });
    };
    const onMessageRecieved = (data) => {
        noise.decodeFrame(data, frame => {
            var _a;
            ws.emit('frame', frame);
            // if it's a binary node
            if (!(frame instanceof Uint8Array)) {
                const msgId = frame.attrs.id;
                if (logger.level === 'trace') {
                    logger.trace({ msgId, fromMe: false, frame }, 'communication');
                }
                let anyTriggered = false;
                /* Check if this is a response to a message we sent */
                anyTriggered = ws.emit(`${Defaults_1.DEF_TAG_PREFIX}${msgId}`, frame);
                /* Check if this is a response to a message we are expecting */
                const l0 = frame.tag;
                const l1 = frame.attrs || {};
                const l2 = Array.isArray(frame.content) ? (_a = frame.content[0]) === null || _a === void 0 ? void 0 : _a.tag : '';
                Object.keys(l1).forEach(key => {
                    anyTriggered = ws.emit(`${Defaults_1.DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]},${l2}`, frame) || anyTriggered;
                    anyTriggered = ws.emit(`${Defaults_1.DEF_CALLBACK_PREFIX}${l0},${key}:${l1[key]}`, frame) || anyTriggered;
                    anyTriggered = ws.emit(`${Defaults_1.DEF_CALLBACK_PREFIX}${l0},${key}`, frame) || anyTriggered;
                });
                anyTriggered = ws.emit(`${Defaults_1.DEF_CALLBACK_PREFIX}${l0},,${l2}`, frame) || anyTriggered;
                anyTriggered = ws.emit(`${Defaults_1.DEF_CALLBACK_PREFIX}${l0}`, frame) || anyTriggered;
                anyTriggered = ws.emit('frame', frame) || anyTriggered;
                if (!anyTriggered && logger.level === 'debug') {
                    logger.debug({ unhandled: true, msgId, fromMe: false, frame }, 'communication recv');
                }
            }
        });
    };
    const end = (error) => {
        logger.info({ error }, 'connection closed');
        clearInterval(keepAliveReq);
        clearInterval(qrTimer);
        ws.removeAllListeners('close');
        ws.removeAllListeners('error');
        ws.removeAllListeners('open');
        ws.removeAllListeners('message');
        if (ws.readyState !== ws.CLOSED && ws.readyState !== ws.CLOSING) {
            try {
                ws.close();
            }
            catch (_a) { }
        }
        ev.emit('connection.update', {
            connection: 'close',
            lastDisconnect: {
                error,
                date: new Date()
            }
        });
        ev.removeAllListeners('connection.update');
    };
    const waitForSocketOpen = async () => {
        if (ws.readyState === ws.OPEN)
            return;
        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
            throw new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed });
        }
        let onOpen;
        let onClose;
        await new Promise((resolve, reject) => {
            onOpen = () => resolve(undefined);
            onClose = reject;
            ws.on('open', onOpen);
            ws.on('close', onClose);
            ws.on('error', onClose);
        })
            .finally(() => {
            ws.off('open', onOpen);
            ws.off('close', onClose);
            ws.off('error', onClose);
        });
    };
    const startKeepAliveRequest = () => (keepAliveReq = setInterval(() => {
        if (!lastDateRecv)
            lastDateRecv = new Date();
        const diff = Date.now() - lastDateRecv.getTime();
        /*
            check if it's been a suspicious amount of time since the server responded with our last seen
            it could be that the network is down
        */
        if (diff > keepAliveIntervalMs + 5000) {
            end(new boom_1.Boom('Connection was lost', { statusCode: Types_1.DisconnectReason.connectionLost }));
        }
        else if (ws.readyState === ws.OPEN) {
            // if its all good, send a keep alive request
            query({
                tag: 'iq',
                attrs: {
                    id: generateMessageTag(),
                    to: WABinary_1.S_WHATSAPP_NET,
                    type: 'get',
                    xmlns: 'w:p',
                },
                content: [{ tag: 'ping', attrs: {} }]
            }, keepAliveIntervalMs)
                .then(() => {
                lastDateRecv = new Date();
                logger.trace('recv keep alive');
            })
                .catch(err => end(err));
        }
        else {
            logger.warn('keep alive called when WS not open');
        }
    }, keepAliveIntervalMs));
    /** i have no idea why this exists. pls enlighten me */
    const sendPassiveIq = (tag) => (sendNode({
        tag: 'iq',
        attrs: {
            to: WABinary_1.S_WHATSAPP_NET,
            xmlns: 'passive',
            type: 'set',
            id: generateMessageTag(),
        },
        content: [
            { tag, attrs: {} }
        ]
    }));
    /** logout & invalidate connection */
    const logout = async () => {
        var _a;
        const jid = (_a = authState.creds.me) === null || _a === void 0 ? void 0 : _a.id;
        if (jid) {
            await sendNode({
                tag: 'iq',
                attrs: {
                    to: WABinary_1.S_WHATSAPP_NET,
                    type: 'set',
                    id: generateMessageTag(),
                    xmlns: 'md'
                },
                content: [
                    {
                        tag: 'remove-companion-device',
                        attrs: {
                            jid: jid,
                            reason: 'user_initiated'
                        }
                    }
                ]
            });
        }
        end(new boom_1.Boom('Intentional Logout', { statusCode: Types_1.DisconnectReason.loggedOut }));
    };
    /** Waits for the connection to WA to reach a state */
    const waitForConnectionUpdate = async (check, timeoutMs) => {
        let listener;
        await ((0, Utils_1.promiseTimeout)(timeoutMs, (resolve, reject) => {
            listener = (update) => {
                var _a;
                if (check(update)) {
                    resolve();
                }
                else if (update.connection == 'close') {
                    reject(((_a = update.lastDisconnect) === null || _a === void 0 ? void 0 : _a.error) || new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed }));
                }
            };
            ev.on('connection.update', listener);
        })
            .finally(() => (ev.off('connection.update', listener))));
    };
    ws.on('message', onMessageRecieved);
    ws.on('open', validateConnection);
    ws.on('error', end);
    ws.on('close', () => end(new boom_1.Boom('Connection Terminated', { statusCode: Types_1.DisconnectReason.connectionClosed })));
    // the server terminated the connection
    ws.on('CB:xmlstreamend', () => {
        end(new boom_1.Boom('Connection Terminated by Server', { statusCode: Types_1.DisconnectReason.connectionClosed }));
    });
    // QR gen
    ws.on('CB:iq,type:set,pair-device', async (stanza) => {
        const postQR = async (qr) => {
            if (printQRInTerminal) {
                const QR = await Promise.resolve().then(() => __importStar(require('qrcode-terminal'))).catch(err => {
                    logger.error('add `qrcode-terminal` as a dependency to auto-print QR');
                });
                QR === null || QR === void 0 ? void 0 : QR.generate(qr, { small: true });
            }
        };
        const iq = {
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'result',
                id: stanza.attrs.id,
            }
        };
        await sendNode(iq);
        const refs = stanza.content[0].content.map(n => n.content);
        const noiseKeyB64 = Buffer.from(creds.noiseKey.public).toString('base64');
        const identityKeyB64 = Buffer.from(creds.signedIdentityKey.public).toString('base64');
        const advB64 = creds.advSecretKey;
        let qrMs = 60000; // time to let a QR live
        const genPairQR = () => {
            const ref = refs.shift();
            if (!ref) {
                end(new boom_1.Boom('QR refs attempts ended', { statusCode: Types_1.DisconnectReason.restartRequired }));
                return;
            }
            const qr = [ref, noiseKeyB64, identityKeyB64, advB64].join(',');
            ev.emit('connection.update', { qr });
            postQR(qr);
            qrTimer = setTimeout(genPairQR, qrMs);
            qrMs = 20000; // shorter subsequent qrs
        };
        genPairQR();
    });
    // device paired for the first time
    // if device pairs successfully, the server asks to restart the connection
    ws.on('CB:iq,,pair-success', async (stanza) => {
        var _a;
        logger.debug('pair success recv');
        try {
            const { reply, creds: updatedCreds } = (0, Utils_1.configureSuccessfulPairing)(stanza, creds);
            logger.debug('pairing configured successfully');
            const waiting = awaitNextMessage();
            await sendNode(reply);
            const value = (await waiting);
            if (value.tag === 'stream:error') {
                if (((_a = value.attrs) === null || _a === void 0 ? void 0 : _a.code) !== '515') {
                    throw new boom_1.Boom('Authentication failed', { statusCode: +(value.attrs.code || 500) });
                }
            }
            logger.info({ jid: updatedCreds.me.id }, 'registered connection, restart server');
            ev.emit('creds.update', updatedCreds);
            ev.emit('connection.update', { isNewLogin: true, qr: undefined });
            end(new boom_1.Boom('Restart Required', { statusCode: Types_1.DisconnectReason.restartRequired }));
        }
        catch (error) {
            logger.info({ trace: error.stack }, 'error in pairing');
            end(error);
        }
    });
    // login complete
    ws.on('CB:success', async () => {
        if (!creds.serverHasPreKeys) {
            await uploadPreKeys();
        }
        await sendPassiveIq('active');
        logger.info('opened connection to WA');
        clearTimeout(qrTimer); // will never happen in all likelyhood -- but just in case WA sends success on first try
        ev.emit('connection.update', { connection: 'open' });
    });
    ws.on('CB:ib,,offline', (node) => {
        const child = (0, WABinary_1.getBinaryNodeChild)(node, 'offline');
        const offlineCount = +child.attrs.count;
        logger.info(`got ${offlineCount} offline messages/notifications`);
        ev.emit('connection.update', { receivedPendingNotifications: true });
    });
    ws.on('CB:stream:error', (node) => {
        logger.error({ error: node }, `stream errored out`);
        const statusCode = +(node.attrs.code || Types_1.DisconnectReason.restartRequired);
        end(new boom_1.Boom('Stream Errored', { statusCode, data: node }));
    });
    // stream fail, possible logout
    ws.on('CB:failure', (node) => {
        const reason = +(node.attrs.reason || 500);
        end(new boom_1.Boom('Connection Failure', { statusCode: reason, data: node.attrs }));
    });
    ws.on('CB:ib,,downgrade_webclient', () => {
        end(new boom_1.Boom('Multi-device beta not joined', { statusCode: Types_1.DisconnectReason.notJoinedBeta }));
    });
    process.nextTick(() => {
        ev.emit('connection.update', { connection: 'connecting', receivedPendingNotifications: false, qr: undefined });
    });
    // update credentials when required
    ev.on('creds.update', update => Object.assign(creds, update));
    return {
        ws,
        ev,
        authState,
        get user() {
            return authState.creds.me;
        },
        assertingPreKeys,
        generateMessageTag,
        query,
        waitForMessage,
        waitForSocketOpen,
        sendRawMessage,
        sendNode,
        logout,
        end,
        waitForConnectionUpdate
    };
};
exports.makeSocket = makeSocket;
