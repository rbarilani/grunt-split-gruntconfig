var _       = require('lodash');
var path    = require('path');
var fs      = require('fs-extra');
var Promise = require('promise');
var format  = require('string-template');
var extend  = _.extend;
var glob    = require('glob');

var DEFAULT_OPTIONS  = {
  dest : 'grunt-config',
  exclude : [splitGruntconfig.TASK_CONFIG_KEY],
  template : "/**" +
  "\n * '{taskName}' grunt task configuration" +
  "\n **/" +
  "\nvar {taskName} = {taskConfig};" +
  "\n\nmodule.exports = {taskName};"
};

/**
 * Split config in multiple files (modules)
 *
 * @param {Object} gruntConfig
 * @param {Object} options
 * @param {String} options.dest
 * @param {Array}  options.exclude
 * @param {String} options.template
 *
 * @returns {Promise}
 */
function splitGruntconfig (gruntConfig, options) {

  var opt = extend({}, DEFAULT_OPTIONS, options || {});
  var log = opt.log || console.log || function () {};
  var taskNames = Object.getOwnPropertyNames(gruntConfig);
  var resolvePath = function (taskName) {
    return path.resolve(opt.dest, taskName + '.js');
  };

  var promises = taskNames.filter(function (taskName) {
    var filePath;

    // exclude
    if(opt.exclude.indexOf(taskName) != -1) {
      return false;
    }

    filePath = resolvePath(taskName);
    // skip if file exists
    if( fs.existsSync(filePath) ) {
      log('Skip "' + filePath + '". file exists.');
      return false;
    }

    return true;

  }).map(function (taskName) {

    var data = format(opt.template, {
      taskName : taskName,
      taskConfig :JSON.stringify(gruntConfig[taskName], null, 2)
    });

    return outputFilePromise(resolvePath(taskName), data);
  });

  return Promise.all(promises);
}

splitGruntconfig.TASK_DESCRIPTION = 'Utility task to split existing "long" grunt config into multiple files';
splitGruntconfig.TASK_NAME = 'split-gruntconfig';
splitGruntconfig.TASK_CONFIG_KEY = 'splitGruntconfig';
splitGruntconfig.load = loadConfig;

function loadConfig(_path) {
  var object = {};
  var key;

  glob.sync('*', {cwd: _path}).forEach(function(option) {
    key = option.replace(/\.js$/,'');
    object[key] = require(path.resolve(_path, option));
  });
  return object;
}

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

module.exports = splitGruntconfig;
