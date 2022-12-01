"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFft = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _array = require("../../utils/array.js");

var _factory = require("../../utils/factory.js");

var name = 'fft';
var dependencies = ['typed', 'matrix', 'addScalar', 'multiplyScalar', 'divideScalar', 'exp', 'tau', 'i'];
var createFft = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix,
      addScalar = _ref.addScalar,
      multiplyScalar = _ref.multiplyScalar,
      divideScalar = _ref.divideScalar,
      exp = _ref.exp,
      tau = _ref.tau,
      I = _ref.i;

  /**
   * Calculate N-dimensional fourier transform
   *
   * Syntax:
   *
   *     math.fft(arr)
   *
   * Examples:
   *
   *    math.fft([[1, 0], [1, 0]]) // returns [[{re:2, im:0}, {re:2, im:0}], [{re:0, im:0}, {re:0, im:0}]]
   *
   *
   * See Also:
   *
   *      ifft
   *
   * @param {Array | Matrix} arr    An array or matrix
   * @return {Array | Matrix}       N-dimensional fourier transformation of the array
   */
  return typed(name, {
    Array: _ndFft,
    Matrix: function Matrix(matrix) {
      return matrix.create(_ndFft(matrix.toArray()));
    }
  });
  /**
   * Perform an N-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @return {Array}         resulting array
   */

  function _ndFft(arr) {
    var size = (0, _array.arraySize)(arr);
    if (size.length === 1) return _fft(arr, size[0]); // ndFft along dimension 1,...,N-1 then 1dFft along dimension 0

    return _1dFft(arr.map(function (slice) {
      return _ndFft(slice, size.slice(1));
    }), 0);
  }
  /**
   * Perform an 1-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @param {number} dim     dimension of the array to perform on
   * @return {Array}         resulting array
   */


  function _1dFft(arr, dim) {
    var size = (0, _array.arraySize)(arr);
    if (dim !== 0) return new Array(size[0]).fill(0).map(function (_, i) {
      return _1dFft(arr[i], dim - 1);
    });
    if (size.length === 1) return _fft(arr);

    function _transpose(arr) {
      // Swap first 2 dimensions
      var size = (0, _array.arraySize)(arr);
      return new Array(size[1]).fill(0).map(function (_, j) {
        return new Array(size[0]).fill(0).map(function (_, i) {
          return arr[i][j];
        });
      });
    }

    return _transpose(_1dFft(_transpose(arr), 1));
  }
  /**
   * Perform an 1-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @return {Array}         resulting array
   */


  function _fft(arr) {
    var len = arr.length;
    if (len === 1) return [arr[0]];

    if (len % 2 === 0) {
      var ret = [].concat((0, _toConsumableArray2.default)(_fft(arr.filter(function (_, i) {
        return i % 2 === 0;
      }), len / 2)), (0, _toConsumableArray2.default)(_fft(arr.filter(function (_, i) {
        return i % 2 === 1;
      }), len / 2)));

      for (var k = 0; k < len / 2; k++) {
        var p = ret[k];
        var q = multiplyScalar(ret[k + len / 2], exp(multiplyScalar(multiplyScalar(tau, I), divideScalar(-k, len))));
        ret[k] = addScalar(p, q);
        ret[k + len / 2] = addScalar(p, multiplyScalar(-1, q));
      }

      return ret;
    }

    throw new Error('Can only calculate FFT of power-of-two size');
  }
});
exports.createFft = createFft;