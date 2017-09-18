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

    it("enables extending types", function() {

        assert.instanceOf(jimmi, Person);
        assert.instanceOf(jimmi, Musician);

        assert.instanceOf(nobody, Person);
        assert.instanceOf(nobody, JustAnotherPerson);

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

    it("can be defined with object literal", function() {

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

describe('typeFactory option rules', function() {

    var TypedView = typeFactory({
        assignOptions: true
    });

    it('type checks string options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            name: String
        }});

        assert.throws(function() {
            new Guitarist();
        }, 'Invalid type for option "name" ("undefined").');

    });

    it('type checks respect rquired attribyte', function() {

        var Guitarist = TypedView.extend({optionRules: {
            name: {type: String, required: false}
        }});

        assert.doesNotThrow(function() {
            new Guitarist({foo: 'bar'});
        });

        assert.throws(function() {
            new Guitarist({name: 47});
        }, 'Invalid type for option "name" ("number").');

    });

    it('type checks number options with custom validator', function() {

        var Guitarist = TypedView.extend({optionRules: {
            age: {type: Number, validator: function(age) {
                return age > 18;
            }}}
        });

        assert.throws(function() {
            new Guitarist({age: '17'});
        }, 'Invalid type for option "age" ("string").');

        assert.throws(function() {
            new Guitarist({age: 15});
        }, 'Validation of option "age" failed.');

        assert.doesNotThrow(function() {
            new Guitarist({age: 20});
        });

    });

    it('type checks boolean options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            published: Boolean
        }});

        assert.throws(function() {
            new Guitarist({published: 'yes'});
        }, 'Invalid type for option "published" ("string").');

    });

    it('type checks function options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            afterGig: Function
        }});

        assert.throws(function() {
            new Guitarist();
        }, 'Invalid type for option "afterGig" ("undefined").');

        assert.doesNotThrow(function() {
            new Guitarist({afterGig: function() {}});
        });

    });

    it('type checks object options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            data: Object
        }});

        assert.throws(function() {
            new Guitarist({data: ''});
        }, 'Invalid type for option "data" ("string").');

        assert.doesNotThrow(function() {
            new Guitarist({data: {}});
        });

    });

    it('type checks array options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            data: Array
        }});

        assert.throws(function() {
            new Guitarist({data: {}});
        }, 'Invalid type for option "data" ("object").');

        assert.doesNotThrow(function() {
            new Guitarist({data: [1, 2, 3]});
        });

    });

    it('type checks date options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            dateOfBirth: Date
        }});

        assert.throws(function() {
            new Guitarist({dateOfBirth: '2017-05-05'});
        }, 'Invalid type for option "dateOfBirth" ("string").');

        assert.doesNotThrow(function() {
            new Guitarist({dateOfBirth: new Date()});
        });

    });

    it('type checks custom constructors options', function() {

        var Guitarist = TypedView.extend({optionRules: {
            mentor: TypedView
        }});

        assert.throws(function() {
            new Guitarist({mentor: {}});
        }, 'Invalid type for option "mentor" ("object").');

        assert.doesNotThrow(function() {
            new Guitarist({mentor: new TypedView()});
        });

        assert.doesNotThrow(function() {
            var ExtendedView = TypedView.extend({});
            new Guitarist({mentor: new ExtendedView()});
        });

    });

    it('type checks multiple alowed types', function() {

        var Guitarist = TypedView.extend({optionRules: {
            url: {type: [String, Function]}
        }});

        var Lead = TypedView.extend({optionRules: {
            url: [String, Function]
        }});

        assert.throws(function() {
            new Guitarist({url: false});
        }, 'Invalid type for option "url" ("boolean").');

        assert.throws(function() {
            new Lead({url: false});
        }, 'Invalid type for option "url" ("boolean").');

        assert.doesNotThrow(function() {
            new Guitarist({url: 'test'});
            new Guitarist({url: function() { return 'test'; }});
            new Lead({url: 'test'});
            new Lead({url: function() { return 'test'; }});
        });

    });

    it('merges default values with rule options defaults', function() {

        var Guitarist = TypedView.extend({
            defaults: {
                instrument: 'guitar',
                dateOfBirth: '1985-01-01'
            },
            optionRules: {
                name: {type: String, default: ''},
                instrument: {type: String},
                age: {type: Number, default: 18}
            }
        });

        assert.deepEqual(new Guitarist().options, {
            name: '',
            instrument: 'guitar',
            age: 18,
            dateOfBirth: '1985-01-01'
        });

    });

});