beforeEach(function () {
  this.addMatchers({
    toBeEmpty : function () {
      var mixed = this.actual;
      var isEmpty = false, checked = false;

      // is undefined
      if(typeof mixed === "undefined"){
        checked = true;
        isEmpty = true;
      }

      // is string
      if(checked === false && typeof mixed === "string") {
        checked = true;
        isEmpty = mixed ? false : true;
      }

      // is array
      if( checked === false && Object.prototype.toString.call( mixed ) === '[object Array]' ) {
        checked = true;
        isEmpty = mixed.length === 0;
      }

      // is number
      if ( checked === false && typeof mixed === 'number') {
        checked = true;
        isEmpty = mixed <= 0;
      }

      // is boolean
      if( checked === false && typeof mixed === 'boolean') {
        checked = true;
        isEmpty = mixed === false;
      }

      // is function -> not empty
      if ( checked === false && typeof mixed === 'function') {
        checked = true;
        isEmpty = false;
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
    },
    toBeFunction : function () {
      var isFunction = typeof this.actual === 'function';

      this.message = function () {
        var basemessage = 'Expected ' + this.actual + ' to be a Function.';

        if(isFunction) {
          return basemessage;
        }
        return basemessage + 'But actually is ' + (typeof this.actual);
      };

      return isFunction;
    },
    toBeObject : function () {
      return typeof this.actual === 'object';
    },
    toBePromiseLike : function () {
      return this.actual && typeof this.actual.then === 'function';
    }
  })
});
