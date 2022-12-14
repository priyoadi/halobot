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
exports.extensionForMediaMessage = exports.decryptMediaMessageBuffer = exports.downloadContentFromMessage = exports.encryptedStream = exports.getGotStream = exports.generateThumbnail = exports.getStream = exports.toBuffer = exports.toReadable = exports.getAudioDuration = exports.mediaMessageSHA256B64 = exports.generateProfilePicture = exports.compressImage = exports.getMediaKeys = exports.hkdfInfoKey = void 0;
const boom_1 = require("@hapi/boom");
const Crypto = __importStar(require("crypto"));
const stream_1 = require("stream");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const os_1 = require("os");
const path_1 = require("path");
const events_1 = require("events");
const got_1 = __importDefault(require("got"));
const generics_1 = require("./generics");
const crypto_1 = require("./crypto");
const Defaults_1 = require("../Defaults");
const hkdfInfoKey = (type) => {
    let str = type;
    if (type === 'sticker')
        str = 'image';
    if (type === 'md-app-state')
        str = 'App State';
    let hkdfInfo = str[0].toUpperCase() + str.slice(1);
    return `WhatsApp ${hkdfInfo} Keys`;
};
exports.hkdfInfoKey = hkdfInfoKey;
/** generates all the keys required to encrypt/decrypt & sign a media message */
function getMediaKeys(buffer, mediaType) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer.replace('data:;base64,', ''), 'base64');
    }
    // expand using HKDF to 112 bytes, also pass in the relevant app info
    const expandedMediaKey = (0, crypto_1.hkdf)(buffer, 112, { info: (0, exports.hkdfInfoKey)(mediaType) });
    return {
        iv: expandedMediaKey.slice(0, 16),
        cipherKey: expandedMediaKey.slice(16, 48),
        macKey: expandedMediaKey.slice(48, 80),
    };
}
exports.getMediaKeys = getMediaKeys;
/** Extracts video thumb using FFMPEG */
const extractVideoThumb = async (path, destPath, time, size) => new Promise((resolve, reject) => {
    const cmd = `ffmpeg -ss ${time} -i ${path} -y -s ${size.width}x${size.height} -vframes 1 -f image2 ${destPath}`;
    (0, child_process_1.exec)(cmd, (err) => {
        if (err)
            reject(err);
        else
            resolve();
    });
});
const compressImage = async (bufferOrFilePath) => {
    if (bufferOrFilePath instanceof stream_1.Readable) {
        bufferOrFilePath = await (0, exports.toBuffer)(bufferOrFilePath);
    }
    const { read, MIME_JPEG, RESIZE_BILINEAR } = await Promise.resolve().then(() => __importStar(require('jimp')));
    const jimp = await read(bufferOrFilePath);
    const result = await jimp
        .quality(50)
        .resize(32, 32, RESIZE_BILINEAR)
        .getBufferAsync(MIME_JPEG);
    return result;
};
exports.compressImage = compressImage;
const generateProfilePicture = async (mediaUpload) => {
    let bufferOrFilePath;
    if (Buffer.isBuffer(mediaUpload)) {
        bufferOrFilePath = mediaUpload;
    }
    else if ('url' in mediaUpload) {
        bufferOrFilePath = mediaUpload.url.toString();
    }
    else {
        bufferOrFilePath = await (0, exports.toBuffer)(mediaUpload.stream);
    }
    const { read, MIME_JPEG, RESIZE_BILINEAR } = await Promise.resolve().then(() => __importStar(require('jimp')));
    const jimp = await read(bufferOrFilePath);
    const min = Math.min(jimp.getWidth(), jimp.getHeight());
    const cropped = jimp.crop(0, 0, min, min);
    return {
        img: await cropped
            .quality(50)
            .resize(640, 640, RESIZE_BILINEAR)
            .getBufferAsync(MIME_JPEG),
    };
};
exports.generateProfilePicture = generateProfilePicture;
/** gets the SHA256 of the given media message */
const mediaMessageSHA256B64 = (message) => {
    const media = Object.values(message)[0];
    return (media === null || media === void 0 ? void 0 : media.fileSha256) && Buffer.from(media.fileSha256).toString('base64');
};
exports.mediaMessageSHA256B64 = mediaMessageSHA256B64;
async function getAudioDuration(buffer) {
    const musicMetadata = await Promise.resolve().then(() => __importStar(require('music-metadata')));
    let metadata;
    if (Buffer.isBuffer(buffer)) {
        metadata = await musicMetadata.parseBuffer(buffer, null, { duration: true });
    }
    else {
        const rStream = (0, fs_1.createReadStream)(buffer);
        metadata = await musicMetadata.parseStream(rStream, null, { duration: true });
        rStream.close();
    }
    return metadata.format.duration;
}
exports.getAudioDuration = getAudioDuration;
const toReadable = (buffer) => {
    const readable = new stream_1.Readable({ read: () => { } });
    readable.push(buffer);
    readable.push(null);
    return readable;
};
exports.toReadable = toReadable;
const toBuffer = async (stream) => {
    let buff = Buffer.alloc(0);
    for await (const chunk of stream) {
        buff = Buffer.concat([buff, chunk]);
    }
    return buff;
};
exports.toBuffer = toBuffer;
const getStream = async (item) => {
    if (Buffer.isBuffer(item))
        return { stream: (0, exports.toReadable)(item), type: 'buffer' };
    if ('stream' in item)
        return { stream: item.stream, type: 'readable' };
    if (item.url.toString().startsWith('http://') || item.url.toString().startsWith('https://')) {
        return { stream: await (0, exports.getGotStream)(item.url), type: 'remote' };
    }
    return { stream: (0, fs_1.createReadStream)(item.url), type: 'file' };
};
exports.getStream = getStream;
/** generates a thumbnail for a given media, if required */
async function generateThumbnail(file, mediaType, options) {
    var _a;
    let thumbnail;
    if (mediaType === 'image') {
        const buff = await (0, exports.compressImage)(file);
        thumbnail = buff.toString('base64');
    }
    else if (mediaType === 'video') {
        const imgFilename = (0, path_1.join)((0, os_1.tmpdir)(), (0, generics_1.generateMessageID)() + '.jpg');
        try {
            await extractVideoThumb(file, imgFilename, '00:00:00', { width: 32, height: 32 });
            const buff = await fs_1.promises.readFile(imgFilename);
            thumbnail = buff.toString('base64');
            await fs_1.promises.unlink(imgFilename);
        }
        catch (err) {
            (_a = options.logger) === null || _a === void 0 ? void 0 : _a.debug('could not generate video thumb: ' + err);
        }
    }
    return thumbnail;
}
exports.generateThumbnail = generateThumbnail;
const getGotStream = async (url, options = {}) => {
    const fetched = got_1.default.stream(url, { ...options, isStream: true });
    await new Promise((resolve, reject) => {
        fetched.once('error', reject);
        fetched.once('response', ({ statusCode }) => {
            if (statusCode >= 400) {
                reject(new boom_1.Boom('Invalid code (' + statusCode + ') returned', { statusCode }));
            }
            else {
                resolve(undefined);
            }
        });
    });
    return fetched;
};
exports.getGotStream = getGotStream;
const encryptedStream = async (media, mediaType, saveOriginalFileIfRequired = true) => {
    const { stream, type } = await (0, exports.getStream)(media);
    const mediaKey = Crypto.randomBytes(32);
    const { cipherKey, iv, macKey } = getMediaKeys(mediaKey, mediaType);
    // random name
    const encBodyPath = (0, path_1.join)((0, os_1.tmpdir)(), mediaType + (0, generics_1.generateMessageID)() + '.enc');
    const encWriteStream = (0, fs_1.createWriteStream)(encBodyPath);
    let bodyPath;
    let writeStream;
    let didSaveToTmpPath = false;
    if (type === 'file') {
        bodyPath = media.url;
    }
    else if (saveOriginalFileIfRequired) {
        bodyPath = (0, path_1.join)((0, os_1.tmpdir)(), mediaType + (0, generics_1.generateMessageID)());
        writeStream = (0, fs_1.createWriteStream)(bodyPath);
        didSaveToTmpPath = true;
    }
    let fileLength = 0;
    const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
    let hmac = Crypto.createHmac('sha256', macKey).update(iv);
    let sha256Plain = Crypto.createHash('sha256');
    let sha256Enc = Crypto.createHash('sha256');
    const onChunk = (buff) => {
        sha256Enc = sha256Enc.update(buff);
        hmac = hmac.update(buff);
        encWriteStream.write(buff);
    };
    for await (const data of stream) {
        fileLength += data.length;
        sha256Plain = sha256Plain.update(data);
        if (writeStream) {
            if (!writeStream.write(data))
                await (0, events_1.once)(writeStream, 'drain');
        }
        onChunk(aes.update(data));
    }
    onChunk(aes.final());
    const mac = hmac.digest().slice(0, 10);
    sha256Enc = sha256Enc.update(mac);
    const fileSha256 = sha256Plain.digest();
    const fileEncSha256 = sha256Enc.digest();
    encWriteStream.write(mac);
    encWriteStream.end();
    writeStream && writeStream.end();
    return {
        mediaKey,
        encBodyPath,
        bodyPath,
        mac,
        fileEncSha256,
        fileSha256,
        fileLength,
        didSaveToTmpPath
    };
};
exports.encryptedStream = encryptedStream;
const DEF_HOST = 'mmg.whatsapp.net';
const AES_CHUNK_SIZE = 16;
const toSmallestChunkSize = (num) => {
    return Math.floor(num / AES_CHUNK_SIZE) * AES_CHUNK_SIZE;
};
const downloadContentFromMessage = async ({ mediaKey, directPath, url }, type, { startByte, endByte } = {}) => {
    const downloadUrl = url || `https://${DEF_HOST}${directPath}`;
    let bytesFetched = 0;
    let startChunk = 0;
    let firstBlockIsIV = false;
    // if a start byte is specified -- then we need to fetch the previous chunk as that will form the IV
    if (startByte) {
        const chunk = toSmallestChunkSize(startByte || 0);
        if (chunk) {
            startChunk = chunk - AES_CHUNK_SIZE;
            bytesFetched = chunk;
            firstBlockIsIV = true;
        }
    }
    const endChunk = endByte ? toSmallestChunkSize(endByte || 0) + AES_CHUNK_SIZE : undefined;
    let rangeHeader = undefined;
    if (startChunk || endChunk) {
        rangeHeader = `bytes=${startChunk}-`;
        if (endChunk)
            rangeHeader += endChunk;
    }
    // download the message
    const fetched = await (0, exports.getGotStream)(downloadUrl, {
        headers: {
            Origin: Defaults_1.DEFAULT_ORIGIN,
            Range: rangeHeader
        }
    });
    let remainingBytes = Buffer.from([]);
    const { cipherKey, iv } = getMediaKeys(mediaKey, type);
    let aes;
    const pushBytes = (bytes, push) => {
        if (startByte || endByte) {
            const start = bytesFetched >= startByte ? undefined : Math.max(startByte - bytesFetched, 0);
            const end = bytesFetched + bytes.length < endByte ? undefined : Math.max(endByte - bytesFetched, 0);
            push(bytes.slice(start, end));
            bytesFetched += bytes.length;
        }
        else {
            push(bytes);
        }
    };
    const output = new stream_1.Transform({
        transform(chunk, _, callback) {
            let data = Buffer.concat([remainingBytes, chunk]);
            const decryptLength = toSmallestChunkSize(data.length);
            remainingBytes = data.slice(decryptLength);
            data = data.slice(0, decryptLength);
            if (!aes) {
                let ivValue = iv;
                if (firstBlockIsIV) {
                    ivValue = data.slice(0, AES_CHUNK_SIZE);
                    data = data.slice(AES_CHUNK_SIZE);
                }
                aes = Crypto.createDecipheriv("aes-256-cbc", cipherKey, ivValue);
                // if an end byte that is not EOF is specified
                // stop auto padding (PKCS7) -- otherwise throws an error for decryption
                if (endByte) {
                    aes.setAutoPadding(false);
                }
            }
            try {
                pushBytes(aes.update(data), b => this.push(b));
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
        final(callback) {
            try {
                pushBytes(aes.final(), b => this.push(b));
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
    return fetched.pipe(output, { end: true });
};
exports.downloadContentFromMessage = downloadContentFromMessage;
/**
 * Decode a media message (video, image, document, audio) & return decrypted buffer
 * @param message the media message you want to decode
 */
async function decryptMediaMessageBuffer(message) {
    var _a;
    /*
        One can infer media type from the key in the message
        it is usually written as [mediaType]Message. Eg. imageMessage, audioMessage etc.
    */
    const type = Object.keys(message)[0];
    if (!type ||
        type === 'conversation' ||
        type === 'extendedTextMessage') {
        throw new boom_1.Boom(`no media message for "${type}"`, { statusCode: 400 });
    }
    if (type === 'locationMessage' || type === 'liveLocationMessage') {
        const buffer = Buffer.from(message[type].jpegThumbnail);
        const readable = new stream_1.Readable({ read: () => { } });
        readable.push(buffer);
        readable.push(null);
        return readable;
    }
    let messageContent;
    if (message.productMessage) {
        const product = (_a = message.productMessage.product) === null || _a === void 0 ? void 0 : _a.productImage;
        if (!product)
            throw new boom_1.Boom('product has no image', { statusCode: 400 });
        messageContent = product;
    }
    else {
        messageContent = message[type];
    }
    return (0, exports.downloadContentFromMessage)(messageContent, type.replace('Message', ''));
}
exports.decryptMediaMessageBuffer = decryptMediaMessageBuffer;
function extensionForMediaMessage(message) {
    const getExtension = (mimetype) => mimetype.split(';')[0].split('/')[1];
    const type = Object.keys(message)[0];
    let extension;
    if (type === 'locationMessage' ||
        type === 'liveLocationMessage' ||
        type === 'productMessage') {
        extension = '.jpeg';
    }
    else {
        const messageContent = message[type];
        extension = getExtension(messageContent.mimetype);
    }
    return extension;
}
exports.extensionForMediaMessage = extensionForMediaMessage;
