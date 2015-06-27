var rewire = require('rewire');
require('../jasmine/matchers');

describe('split-gruntconfig', function () {
  var splitGruntconfig;

  beforeEach(function () {
    splitGruntconfig = rewire('../../src/index.js');
  });

  afterEach(function () {
    splitGruntconfig = null;
  });

  it('it should be a function', function () {
    expect(typeof splitGruntconfig).toBe('function');
  });

  it('should work as expected with default options', function () {
    splitGruntconfig.__set__('Promise', {
      all : function (promises) {
        return promises;
      }
    });

    splitGruntconfig.__set__('outputFilePromise', function (filepath, data) {
      expect(filepath.indexOf('grunt/jshint.js') > -1).toBe(true);
      expect(data.indexOf('foo: "bar"') > -1).toBe(true);
      return 'jshint';
    });

    var result = splitGruntconfig({jshint: {foo:'bar'}});
    expect(result).toEqual(['jshint']);
  });

  it('should skip existing files and evaluate exclude option as expected', function () {
    splitGruntconfig.__set__('Promise', {
      all : function (promises) {
        return promises;
      }
    });

    var outputFilePromiseCalled = 0;
    splitGruntconfig.__set__('outputFilePromise', function (filepath, data) {
      expect(filepath.indexOf('.tmp-test/jshint.js') > -1).toBe(true);
      expect(data.indexOf('foo: "bar"') > -1).toBe(true);
      outputFilePromiseCalled = outputFilePromiseCalled + 1;

      if(outputFilePromiseCalled === 1) {
        return 'jshint';
      }
      throw new Error('Output file promise called too many times');
    });

    splitGruntconfig.__set__('fs', {
      existsSync: function (filePath) {
        return filePath.indexOf('existent.js') > -1;
      }
    });

    var logCalled = false;
    var result = splitGruntconfig({
      existent : { foo : 'bar'},
      jshint: { foo : 'bar'},
      splitGruntconfig : {
        options : {}
      }
    }, {
      dest : '.tmp-test',
      log : function (message) {
        logCalled = true;
        expect(message.indexOf('.tmp-test/existent.js". file exists.') > -1).toBe(true);
      }
    });

    expect(logCalled).toBe(true);
    expect(result).toEqual(['jshint']);
  });

  describe('.TASK_DESCRIPTION, .TASK_NAME, .TASK_CONFIG_KEY', function () {
    it('should be defined', function () {
      expect(splitGruntconfig.TASK_DESCRIPTION).toBeDefined();
      expect(splitGruntconfig.TASK_CONFIG_KEY).toBeDefined();
      expect(splitGruntconfig.TASK_NAME).toBeDefined();
    });
  });
});
