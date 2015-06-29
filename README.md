grunt-split-config 
==================

Utility task to split existing 'long' grunt config into multiple files (node modules).

[![Build Status](https://travis-ci.org/rbarilani/grunt-split-gruntconfig.svg?branch=master)](https://travis-ci.org/rbarilani/grunt-split-gruntconfig?branch=master)
[![Coverage Status](https://coveralls.io/repos/rbarilani/grunt-split-gruntconfig/badge.svg?branch=master)](https://coveralls.io/r/rbarilani/grunt-split-gruntconfig?branch=master)

To load resultant modules, please take a look at: [load-grunt-config](https://github.com/firstandthird/load-grunt-config)

## Install

```npm install git+https://github.com/rbarilani/grunt-split-gruntconfig --save-dev```

## Usage

```grunt split-gruntconfig```

this command would split a "long" grunt config, example:
 
```js
// Gruntfile.js

module.exports = function (grunt) {
  // ...
  
  // Define the configuration for all the tasks
  grunt.initConfig({
    // ...
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    }  
    // ...
  });
};
```  

into multiple files

```
|_ grunt/
  |__ jshint.js
  |__ clean.js
  |__ imagemin.js
  |__ ...
|_ Gruntfile.js
|- package.json
```  

where every file is a node module that exports the configuration object, example:
  
```js
// grunt/jshint.js

/**
 * 'jshint' grunt task configuration
**/
var jshint = {
  "options": {
    "jshintrc": ".jshintrc",
    "reporter": require('jshint-stylish')
  },
  "all": {
    "src": [
      "Gruntfile.js",
      "<%= yeoman.app %>/scripts/{,*/}*.js"
    ]
  },
  "test": {
    "options": {
      "jshintrc": "test/.jshintrc"
    },
    "src": [
      "test/spec/{,*/}*.js"
    ]
  }
};

module.exports = jshint;
```

## Configuration

Those are defaults.

```js
//...
grunt.initConfig({
  // ...
  splitGruntconfig: {
    options: {
      dest: 'grunt',
      exclude: ['splitGruntconfig'],
      beautify: {
        indent_size: 2
      }
    }
  }
});
```

  

### Development

```git clone https://github.com/rbarilani/grunt-split-gruntconfig```

to run tests

```npm test```

to generate coverage reports (html, lcov...)

```npm run coverage```
