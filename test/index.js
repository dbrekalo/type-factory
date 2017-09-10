var assert = require("chai").assert;
var typeFactory = require("../");

var Person = typeFactory({
    initialize: function(name, surname) {
        this.name = name;
        this.surname = surname;
    },

    sayHi: function() {
    },

    }, {
    staticProperty: function() {
    }
});

describe("typeFactory", function() {

    it('defines constructor function', function () {

        assert.equal(Person.prototype.constructor, Person);

    });

    it("attaches prototype methods to constructor", function() {

        assert.isFunction(Person.prototype.sayHi);

    });

    it("attaches static methods to constructor", function() {

        assert.isFunction(Person.staticProperty);

    });

    it("passes arguments to initialize function", function() {

        var person = new Person('John', 'Doe');
        assert.equal(person.name, 'John');
        assert.equal(person.surname, 'Doe');

    });

    it("creates objects as instance of constructor function", function() {

        var peter = new Person();
        assert.instanceOf(peter, Person);

    });

});

describe("typeFactory extend", function() {

    var Musician = Person.extend({sayHi: function() {}});
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

    it("enables extending types", function() {

        assert.instanceOf(jimmi, Person);
        assert.instanceOf(jimmi, Musician);

        assert.instanceOf(george, Person);
        assert.instanceOf(george, Musician);
        assert.instanceOf(george, Guitarist);

    });

    it("assigns parent methods to types", function() {

        assert.isFunction(Musician.prototype.initialize);

    });

    it("assigns new instance methods to types", function() {

        assert.isFunction(george.playSolo);

    });

    it("allows types to inherit parent static properties", function() {

        assert.isFunction(Musician.staticProperty);
        assert.isFunction(Guitarist.staticProperty);

    });

    it("assigns new static properties", function() {

        assert.isFunction(Guitarist.gatherOnStage);

    });

    it("allows overridden methods", function() {

        assert.notEqual(jimmi.sayHi, Person.prototype.sayHi);

    });

    it("allows overriding constructor property", function() {

        assert.equal(jimmi.name, 'Jimmi');
        assert.isUndefined(george.name);
        assert.equal(george.nickname, 'George');

    });

});

describe("typeFactory defaults", function() {

    it("can be defined vith object literal", function() {

        var Musician = Person.extend({
            assignOptions: true,
            defaults: {isFrontMen: false}
        });

        assert.isDefined(new Musician().options);
        assert.isFalse(new Musician().options.isFrontMen);

        assert.deepEqual(new Musician({
            isFrontMen: true,
            playsInstrument: 'guitar'
        }).options, {
            isFrontMen: true,
            playsInstrument: 'guitar'
        });

        assert.deepEqual(new Musician({
            isFrontMen: undefined,
            foo: {bar: 'test'}
        }).options, {
            isFrontMen: false,
            foo: {bar: 'test'}
        });

    });

    it("can be defined vith function returning object literal", function() {

        var Musician = Person.extend({
            assignOptions: true,
            defaults: function() {
              return {isFrontMen: false};
            }
        });

        assert.isFalse(new Musician().options.isFrontMen);

    });

});

describe("typeFactory option rules", function() {

    it('type check provided options', function() {

        var Guitarist = Person.extend({
            assignOptions: true,
            optionRules: {
                name: {type: 'string'},
                instrument: {type: 'string', required: false},
            }
        });

        assert.throws(function() {
            new Guitarist();
        }, 'Option "name" is undefined, expected string.');

        assert.throws(function() {
            new Guitarist({
                name: 'George',
                instrument: 42
            });
        }, 'Option "instrument" is number, expected string.');

    });

    it('validate options with rule callback', function() {

        var Guitarist = typeFactory({
            assignOptions: true,
            optionRules: {
                age: {type: 'number', rule: function(age) {
                    return age > 18;
                }}
            }
        });

        var GuitarPro = Guitarist.extend();

        assert.throws(function() {
            new Guitarist({
                age: 'teen'
            });
        }, 'Option "age" is string, expected number. Option "age" breaks defined rule.');

        assert.throws(function() {
            new GuitarPro({
                age: 15
            });
        }, 'Option "age" breaks defined rule.');

    });

    it('do option instance of checks', function() {

        var Guitarist = Person.extend({
            assignOptions: true,
            optionRules: {
                mentor: {instanceOf: Person}
            }
        });

        var mentor = new Person();

        assert.throws(function() {
            new Guitarist({
                mentor: 'pero'
            });
        }, 'Option "mentor" is not instance of defined constructor.');

        assert.throws(function() {
            new Guitarist({
                mentor: new Date()
            });
        }, 'Option "mentor" is not instance of defined constructor.');

        assert.throws(function() {
            new Guitarist();
        }, 'Option "mentor" is not instance of defined constructor.');

    });

    it('merge default values', function() {

        var Guitarist = Person.extend({
            assignOptions: true,
            defaults: {
                instrument: 'guitar'
            },
            optionRules: {
                name: {type: 'string', default: ''},
                instrument: {type: 'string'},
                age: {type: 'number', default: 18}
            }
        });

        assert.deepEqual(new Guitarist().options, {
            name: '',
            instrument: 'guitar',
            age: 18
        });

    });

});
