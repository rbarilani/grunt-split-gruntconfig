var splitGruntconfig = require('../src/index.js');

module.exports = function (grunt) {

  grunt.registerTask(splitGruntconfig.TASK_NAME, splitGruntconfig.TASK_DESCRIPTION, function () {

    var done    = this.async();

    splitGruntconfig(grunt.config.getRaw(), this.options())
      .then(function (){
        grunt.log.ok('Files were created!'); done();
      })
      .catch(function (error) {
        grunt.log.error(error); done(false);
      });
  });
};
