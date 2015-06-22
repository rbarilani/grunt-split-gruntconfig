var fs      = require('fs-extra');
var Promise = require('promise');

/**
 * Write data to file
 *
 * @param {String} file
 * @param {String} data
 * @returns {Promise}
 */
function outputFilePromise(file, data) {
  return new Promise(function(resolve, reject) {
    fs.outputFile(file, data, function (err) {
      if(err) {
        reject(err);
      }else{
        resolve({
          file : file,
          data : data
        });
      }
    });
  });
}

module.exports = outputFilePromise;
