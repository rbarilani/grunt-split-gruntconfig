var fs      = require('fs-extra');
var Promise = require('promise');

/**
 * Write data to file
 *
 * @param {String} path
 * @param {String} data
 * @returns {Promise}
 */
function outputFilePromise(path, data) {
  return new Promise(function(resolve, reject) {
    fs.outputFile(path, data, function (err) {
      if(err) {
        reject(err);
      }else{
        resolve({
          path : path,
          data : data
        });
      }
    });
  });
}

module.exports = outputFilePromise;
