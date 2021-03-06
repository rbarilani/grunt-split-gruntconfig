var extend = require('lodash').extend;
var fs = require('fs-extra');
var path = require('path');
var Promise = require('promise');
var format = require('string-template');
var outputFilePromise = require('./output-file');
var sourceCode = require('./source-code');

splitGruntconfig.TASK_DESCRIPTION = 'Utility task to split existing "long" grunt config into multiple files';
splitGruntconfig.TASK_NAME = 'split-gruntconfig';
splitGruntconfig.TASK_CONFIG_KEY = 'splitGruntconfig';
splitGruntconfig.DEFAULT_OPTIONS = {
  dest : 'grunt',
  exclude : [splitGruntconfig.TASK_CONFIG_KEY],
  template : "/**" +
  "\n * '{taskName}' grunt task configuration" +
  "\n **/" +
  "\nvar {taskName} = {taskConfig};" +
  "\n\nmodule.exports = {taskName};",
  beautify : {
    'indent_size': 2
  }
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

  var opt = extend({}, splitGruntconfig.DEFAULT_OPTIONS, options || {});
  var log = opt.log || console.log;
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
      taskName   : taskName,
      taskConfig : sourceCode.toSource(gruntConfig[taskName], splitGruntconfig.DEFAULT_OPTIONS.beautify)
    });

    data = sourceCode.beautify(data);

    return outputFilePromise(resolvePath(taskName), data);
  });

  return Promise.all(promises);
}


module.exports = splitGruntconfig;
