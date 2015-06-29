require('../jasmine/matchers');

var rewire = require('rewire');
var _ = require('lodash');

describe('split-gruntconfig grunt task', function () {
  var taskModule,
    gruntMock, splitGruntconfigMockFactory, doneMock,
    noopFn;

  beforeEach(function () {
    noopFn = function () {};
    taskModule = rewire('../../tasks/split-gruntconfig.js');


    gruntMock = {
      options : noopFn,
      config : {
        getRaw : noopFn
      },
      log : {
        ok : noopFn,
        error : noopFn
      },
      async: function () {
        doneMock = jasmine.createSpy();
        return doneMock;
      },
      registerTask : function (name, description, fn) {

        expect(name).toEqual(splitGruntconfigMockFactory.TASK_NAME);
        expect(description).toEqual(splitGruntconfigMockFactory.TASK_DESCRIPTION);
        expect(fn).toBeDefined();
        expect(fn).toBeFunction();

        fn.apply(this);
      }
    };
    splitGruntconfigMockFactory = function (rejection) {
      var promiseMock =  {
        then : function (cb) {
          var cbRes;
          if(!rejection) {
            cbRes = cb(); // sync?
          }
          return this;
        },
        'catch' : function (cb) {
          var cbRes;
          if(rejection) {
            cbRes = cb(rejection);
          }
          return this;
        }
      };

      spyOn(promiseMock, 'then').andCallThrough();
      spyOn(promiseMock, 'catch').andCallThrough();

      var mock = function (/* config, options */) {
        return promiseMock;
      };

      mock.promiseMock = promiseMock;
      return _.extend(mock, splitGruntconfigMockFactory)
    };
    splitGruntconfigMockFactory.TASK_NAME = 'bar';
    splitGruntconfigMockFactory.TASK_DESCRIPTION = 'foo';

    // adds jasmine spy capabilities
    spyOn(gruntMock, 'registerTask').andCallThrough();
    spyOn(gruntMock, 'async').andCallThrough();
    spyOn(gruntMock.config, 'getRaw').andCallThrough();
    spyOn(gruntMock, 'options').andCallThrough();
    spyOn(gruntMock.log, 'ok').andCallThrough();
    spyOn(gruntMock.log, 'error').andCallThrough();
  });

  afterEach(function () {
    taskModule = null;
    gruntMock = null;
  });

  it('should exists and is a function', function () {
    expect(taskModule).toBeFunction();
  });

  it('should register the task and then execute without errors', function () {
    var splitGruntConfigMock = splitGruntconfigMockFactory();
    taskModule.__set__('splitGruntconfig', splitGruntConfigMock);

    taskModule(gruntMock);

    expect(gruntMock.registerTask).toHaveBeenCalled();
    expect(gruntMock.async).toHaveBeenCalled();
    expect(gruntMock.config.getRaw).toHaveBeenCalled();
    expect(gruntMock.options).toHaveBeenCalled();
    expect(splitGruntConfigMock.promiseMock.then).toHaveBeenCalled();
    expect(gruntMock.log.ok).toHaveBeenCalled();
    expect(gruntMock.log.error).not.toHaveBeenCalled();
    expect(doneMock).toHaveBeenCalledWith();

  });

  it('should handle a failure when error', function () {
    var splitGruntConfigMock = splitGruntconfigMockFactory('foo error');
    taskModule.__set__('splitGruntconfig', splitGruntConfigMock);

    taskModule(gruntMock);

    expect(splitGruntConfigMock.promiseMock.catch).toHaveBeenCalled();
    expect(gruntMock.log.error).toHaveBeenCalledWith('foo error');
    expect(doneMock).toHaveBeenCalledWith(false);
  });
});
