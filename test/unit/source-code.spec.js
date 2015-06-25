var rewire = require('rewire');
require('../jasmine/matchers');

describe('source-code', function () {
  var sourceCode;

  beforeEach(function () {
    sourceCode = rewire('../../src/source-code.js');
  });

  afterEach(function() {
    sourceCode = null;
  });

  it('should be an object with a toSource method', function () {
    expect(sourceCode).toBeObject();
    expect(sourceCode.toSource).toBeDefined();
    expect(sourceCode.toSource).toBeFunction();
  });

  describe('.toSource(obj)', function () {

    it('should return a string thar represents the original code', function () {
      var globalVar = 1;
      var code = {
        hello: function(hello){
          return hello;
        },
        regExp : /[A-Z].*/,
        hello2: function (ciao) {
          return ciao + globalVar;
        },
        regExp2 : /^(.*?)[,-]$/
      };
      var expected = '{\n' +
          '    hello: function(hello) {\n' +
          '        return hello;\n' +
          '    },\n' +
          '    regExp: /[A-Z].*/,\n' +
          '    hello2: function(ciao) {\n' +
          '        return ciao + globalVar;\n' +
          '    },\n' +
          '    regExp2: /^(.*?)[,-]$/\n' +
          '}';
      expect(sourceCode.toSource(code)).toEqual(expected);
    });
  });

  it('should works as expected also with complex regexps', function () {
    expect(sourceCode.toSource(/\.\.\//)).toBe('/\\.\\.\\//');
    expect(sourceCode.toSource(/(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi))
      .toBe('/(([\\s\\t]*)\\/{2}\\s*?bower:\\s*?(\\S*))(\\n|\\r|.)*?(\\/{2}\\s*endbower)/gi');
  });

});
