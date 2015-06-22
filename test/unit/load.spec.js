var rewire = require('rewire');
require('../jasmine/matchers');

describe('load', function () {
  var load;

  beforeEach(function () {
    load = rewire('../../src/load.js');
  });

  afterEach(function () {
    load = null;
  });

  it('should be a Function', function () {
    expect(typeof load).toBe('function');
  });

  it('should return an empty object when path is empty', function () {
    var cwd = './path';
    var globStub = {
      sync : function (globPattern, options) {
        expect(globPattern).toBe('*');
        expect(options.cwd).toBe(cwd);
        return [];
      }
    };
    var config;

    load.__set__('glob', globStub);

    config = load(cwd);

    expect(config).toBeEmpty();
  });

  it('should return an object with the expected properties', function () {
    var globStub = {
      sync : function () {
        return ['jshint.js','watch.js'];
      }
    };
    var requirerStub = {
      load : function (/*file*/) {
        return { foo : 'bar' };
      }
    };
    var config;

    load.__set__('glob', globStub);
    load.__set__('requirer', requirerStub);

    config = load('./foo');

    expect(Object.keys(config).length).toBe(2);

    expect(config.jshint).toBeDefined();
    expect(config.watch).toBeDefined();

    expect(config.jshint).toEqual({foo:'bar'});
  });
});
