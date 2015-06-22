var rewire = require('rewire');

describe('load', function () {

  var load;

  beforeEach(function () {
    load = rewire('../../src/load.js');
    this.addMatchers({
      toBeEmpty : function () {
        var mixed = this.actual;
        var isEmpty = false, checked = false;

        // is string
        if(typeof mixed === "string") {
          checked = true;
          isEmpty = mixed ? false : true;
        }

        // is array
        if( Object.prototype.toString.call( mixed ) === '[object Array]' ) {
          checked = true;
          isEmpty = mixed.length === 0;
        }

        // is number
        if ( typeof mixed === 'number') {
          checked = true;
          isEmpty = mixed <= 0;
        }

        // is boolean
        if( typeof mixed === 'boolean') {
          checked = true;
          isEmpty = mixed === false;
        }

        // is function -> throw error
        if ( typeof mixed === 'function') {
          throw 'Can\'t check if a function is empty';
        }

        // is object
        if(checked === false && typeof mixed === 'object') {
          if(!mixed) {
            checked = true;
            isEmpty = true;
          }else{
            checked = true;
            isEmpty = Object.keys(mixed).length === 0;
          }
        }

        //Jasmine will look for this function and utilize it for custom error messages
        this.message = function () {

          if (checked && isEmpty === true) {
            return "Expected " + this.actual + " to be Empty";
          }

          if(checked && !isEmpty) {
            return "Expected " + this.actual + ":" + JSON.stringify(this.actual) + " to be Empty, but it's not.";
          }

          return "Unexpected error";
        };

        return isEmpty;
      }
    })
  });

  describe('.toBeEmpty() custom jasmine matcher', function () {
    it('should work as expected when null', function () {
      expect(null).toBeEmpty();
    });

    it('should work as expected when number', function () {
      expect(0).toBeEmpty();
      expect(1).not.toBeEmpty();
    });

    it('should work as expected when string', function () {
      expect("").toBeEmpty();
      expect("ciao").not.toBeEmpty();
    });

    it('should work as expected when object', function () {
      expect({}).toBeEmpty();
      expect({foo:'bar'}).not.toBeEmpty();
    });

    it('should work as expected when array', function () {
      expect([]).toBeEmpty();
      expect(['hello']).not.toBeEmpty();
    });

    it('should work as expected when boolean', function () {
      expect(true).not.toBeEmpty();
      expect(false).toBeEmpty();
    });
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
