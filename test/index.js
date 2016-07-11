var expect = require("chai").expect;
var assert = require("chai").assert;

var typeFactory = require("../");

var Person = typeFactory({
  initialize: function(name) {
  },
  sayHi: function() {
  },
  play: function() {
  }
  }, {
  staticProperty: function() {
  }
});

var Musician = Person.extend({
  play: function() { }
});

describe("constructor", function() {

  it('sets constructor as the children', function () {

    assert.equal(Person.prototype.constructor, Person);

  });

  it("assigns prototype methods to constructor", function() {

    assert.ok(Person.prototype.sayHi);

  });

  it("assigns static property to constructor", function() {

    assert.ok(Person.staticProperty);

  });

});

describe("extending types", function() {

  it("creates type that is instance of constructor function", function() {

    var peter = new Person('Peter');
    assert.instanceOf(peter, Person);

  });

  it('assigns prototype methods to extended type', function () {

    var peter = new Person('peter');
    assert.instanceOf(peter, Person);
    assert.equal(Person.prototype.sayHi, peter.sayHi);

  });

  it('does not pass static method to extended type', function () {

    var peter = new Person('peter');
    assert.notOk(peter.staticProperty);

  });

  it("creates further extended type", function() {

    var jimmi = new Musician('Jimmi');

    assert.instanceOf(jimmi, Person);
    assert.instanceOf(jimmi, Musician);
    assert.equal(jimmi.sayHi, Person.prototype.sayHi);
    assert.property(jimmi, 'play');
    assert.notEqual(Person.prototype.play, jimmi.play);

  });

});