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

  it('should work as expected', function () {
    splitGruntconfig.__set__('Promise', {
      all : function (promises) {
        return promises;
      }
    });

    splitGruntconfig.__set__('outputFilePromise', function (filepath, data) {
      expect(filepath.indexOf('.tmp-test/jshint.js') > -1).toBe(true);
      expect(data.indexOf('"foo": "bar"') > -1).toBe(true);
      return 'jshint';
    });

    var result = splitGruntconfig({jshint: {foo:'bar'}}, {
      dest : '.tmp-test'
    });

    expect(result).toEqual(['jshint']);
  });

  it('should skip existing files', function () {
    splitGruntconfig.__set__('Promise', {
      all : function (promises) {
        return promises;
      }
    });

    splitGruntconfig.__set__('outputFilePromise', function (filepath, data) {
      expect(filepath.indexOf('.tmp-test/jshint.js') > -1).toBe(true);
      expect(data.indexOf('"foo": "bar"') > -1).toBe(true);
      return 'jshint';
    });

    splitGruntconfig.__set__('fs', {
      existsSync: function (filePath) {
        return filePath.indexOf('existent.js') > -1;
      }
    });

    var logCalled = false;
    var result = splitGruntconfig({
      existent : { foo : 'bar'},
      jshint: { foo : 'bar'}
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

  describe('.TASK_DESCRIPTION, .TASK_NAME, .TASK_CONFIG_KEY, .load', function () {
    it('should be defined', function () {
      expect(splitGruntconfig.TASK_DESCRIPTION).toBeDefined();
      expect(splitGruntconfig.TASK_CONFIG_KEY).toBeDefined();
      expect(splitGruntconfig.TASK_NAME).toBeDefined();
      expect(splitGruntconfig.load).toBeDefined();
    });
  });
});
