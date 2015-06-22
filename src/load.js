var glob = require('glob');
var path = require('path');
var requirer = {
  load : function (file) {
    return require(file);
  }
};

function load(cwd) {
  var object = {};
  var key;

  glob.sync('*', { cwd: cwd }).forEach(function(option) {
    key = propertyNameFromFileName(option);
    object[key] = requirer.load(path.resolve(cwd, option));
  });
  return object;
}

function propertyNameFromFileName(fileName) {
  return fileName.replace(/\.js$/,'');
}

module.exports = load;
