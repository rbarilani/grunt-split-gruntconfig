require('./matchers');

describe('matchers', function () {

  describe('.toBeEmpty() custom jasmine matcher', function () {

    it('should work as expected when function', function () {
      expect(function () {}).not.toBeEmpty();
    });

    it('should work as expected when undefined', function () {
      expect().toBeEmpty();
    });

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

  describe('toBeFunction()', function () {
    it('should work as expected', function () {
      var noop = function () {};
      var string = '';
      expect(noop).toBeFunction();
      expect(string).not.toBeFunction();
    });
  });
});
