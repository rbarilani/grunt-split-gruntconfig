'use strict';
var beautify = require('js-beautify').js_beautify;
var toSource = require('tosource');

module.exports = {
  /**
   * Converts JavaScript objects back to source code
   *
   * @param {object} obj
   * @param {object} [options]
   * @returns {string}
   */
  toSource : function (obj, options) {
    return this.beautify(toSource(obj), options || {});
  },
  /**
   * Beautifies Javascript code
   *
   * @param {object|string} obj
   * @param {object} [options]
   * @returns {object|string}
   */
  beautify : function (obj, options) {
    return beautify(obj, options || {});
  }
};
