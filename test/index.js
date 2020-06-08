var assert = require('chai').assert;
var typeFactory = require('../');

var Person = typeFactory({
    constructor: function(name, surname) {
        this.name = name;
        this.surname = surname;
    },

    sayHi: function() {
    }
}, {
    staticProperty: function() {}
});

describe('typeFactory', function() {

    it('defines constructor function', function() {

        assert.equal(Person.prototype.constructor, Person);

    });

    it('attaches prototype methods to constructor', function() {

        assert.isFunction(Person.prototype.sayHi);

    });

    it('attaches static methods to constructor', function() {

        assert.isFunction(Person.staticProperty);

    });

    it('passes arguments to constructor function', function() {

        var person = new Person('John', 'Doe');
        assert.equal(person.name, 'John');
        assert.equal(person.surname, 'Doe');

    });

    it('creates objects as instance of constructor function', function() {

        var peter = new Person();
        assert.instanceOf(peter, Person);

    });

});

describe('typeFactory extend', function() {

    var Musician = Person.extend({sayHi: function() {}});
    var JustAnotherPerson = Person.extend();
    var Guitarist = Musician.extend({
        constructor: function(nickname) {
            this.nickname = nickname;
        },
        playSolo: function() {}
    }, {
        gatherOnStage: function() {}
    });

    var jimmi = new Musician('Jimmi');
    var george = new Guitarist('George');
    var nobody = new JustAnotherPerson();

    it('enables extending types', function() {

        assert.instanceOf(jimmi, Person);
        assert.instanceOf(jimmi, Musician);

        assert.instanceOf(nobody, Person);
        assert.instanceOf(nobody, JustAnotherPerson);

        assert.instanceOf(george, Person);
        assert.instanceOf(george, Musician);
        assert.instanceOf(george, Guitarist);

    });

    it('assigns parent methods to types', function() {

        assert.isFunction(Musician.prototype.constructor);

    });

    it('assigns new instance methods to types', function() {

        assert.isFunction(george.playSolo);

    });

    it('allows types to inherit parent static properties', function() {

        assert.isFunction(Musician.staticProperty);
        assert.isFunction(Guitarist.staticProperty);

    });

    it('assigns new static properties', function() {

        assert.isFunction(Guitarist.gatherOnStage);

    });

    it('allows overridden methods', function() {

        assert.notEqual(jimmi.sayHi, Person.prototype.sayHi);

    });

    it('allows overriding constructor property', function() {

        assert.equal(jimmi.name, 'Jimmi');
        assert.isUndefined(george.name);
        assert.equal(george.nickname, 'George');

    });

});
