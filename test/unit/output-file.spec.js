var rewire = require('rewire');
require('../jasmine/matchers');

describe('output-file', function () {
  var outputFile;

  beforeEach(function () {
    outputFile = rewire('../../src/output-file.js');
  });

  afterEach(function (){
    outputFile = null;
  });

  it('should be a function', function () {
    expect(outputFile).toBeFunction();
  });

  it('should work as expected and return a successful Promise', function (done) {
    var data = {foo:'bar'};
    var path = './file.js';

    outputFile.__set__('fs', {
      outputFile : function (_path, _data, cb) {
        expect(_path).toEqual(path);
        expect(_data).toEqual(data);
        cb();
      }
    });

    var result = outputFile(path, data);

    expect(result).toBePromiseLike();

    result.then(function (res) {
      expect(res.path).toEqual(path);
      expect(res.data).toEqual(data);
      done();
    });
  });

  it('should return a rejected promise when fs fails to write', function (done) {
    var errorMsg = 'ERROR!';
    outputFile.__set__('fs', {
      outputFile : function (path, data, cb) {
        cb(errorMsg);
      }
    });

    var result = outputFile('./path', {foo:'bar'});

    expect(result).toBePromiseLike();

    result.catch(function (error) {
      expect(error).toEqual(errorMsg);
      done();
    });
  });
});
