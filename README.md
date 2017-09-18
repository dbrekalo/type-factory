# Type factory

[![Build Status](https://travis-ci.org/dbrekalo/type-factory.svg?branch=master)](https://travis-ci.org/dbrekalo/type-factory)
[![Coverage Status](https://coveralls.io/repos/github/dbrekalo/type-factory/badge.svg?branch=master)](https://coveralls.io/github/dbrekalo/type-factory?branch=master)
[![NPM Status](https://img.shields.io/npm/v/type-factory.svg)](https://www.npmjs.com/package/type-factory)

Type factory is a convenient generator of javascript prototype based constructor functions with simple and easy to use syntax.
Types can be easily extended and used as basis for modules of any purpose.
It weighs less than 2KB.

[Visit documentation site](http://dbrekalo.github.io/type-factory/).

Type factory is a small helper function by which a constructor function can be defined without the usual verbosity.
Each generated type can be easily extended with no need for manual setup of prototype chain.
Parameters passed to constructor can be merged with defaults, type checked and validated.
Type factory can be used with bundlers or browser globals.

## Examples

Without Type factory you could define a type with code similar to one bellow.

```js
// first we define a constructor function
var Person = function(name) {
    this.name = name;
};

// then we add methods to function prototype (instance methods)
Person.prototype.sayHi = function() {
    console.log('Hello, my name is ' + this.name);
};

// now lets make a new person...
var john = new Person('John');

// ...and make them do something
john.sayHi(); // outputs 'Hello, my name is John'
```

Same functionality with typeFactory would be achieved like so:
```js
var Person = typeFactory({
    initialize: function(name) {
        this.name = name;
    },
    sayHi: function() {
        console.log('Hello, my name is ' + this.name);
    }
});

var george = new Person('George');
george.sayHi(); // outputs 'Hello, my name is George'
```

---

### Extending type

Every type produced with Type factory receives convenient extend method for all your extending needs. Consider next example:

```js
var Musician = Person.extend({
    play: function() {
        console.log(this.name + ' is playing!');
    }
});

var peter = new Musician('Peter');

peter.sayHi(); // outputs 'Hello, my name is Peter'
peter.play(); // outputs 'Peter is playing!'
```
---

### Setting option defaults
Default options can be set when defining type. Defaults will be merged with options provided to constructor.
Sometimes it is convenient to list all parameters your type depends on:

```js
var Musician = Person.extend({
    assignOptions: true,
    defaults: {
        instrument: 'guitar'
        age: undefined
        mentor: undefined
    }
});

var peter = new Musician({age: 18});

console.log(peter.options); // outputs {instrument: 'guitar', age: 18}
```
---

### Options type checking and validation
Options provided by type defaults and and constructor parameters can be type checked.

```js
var Musician = Person.extend({
    assignOptions: true,
    optionRules: {
        instrument: String,
        age: {type: Number, default: 18, validator: function(age) {
            return age >= 18;
        }},
        mentor: {type: Musician, required: false}
        url: [String, Function]
    }
});

// will throw error -> age should be a number
new Musician({age: 'adult'});

```
Option rules can be configured to do following:
* set expectations for parameter type check via "type" key.
* define default value via "default" property
* require option to be set via "required" key
* defined custom validation logic via callback under "validator" key

## Installation

Type factory is packaged as UMD library so you can use it both on client and server (CommonJS and AMD environment) or with browser globals.

````js
// install via npm
npm install type-factory --save

// if you use bundler
var typeFactory = require('type-factory');

// or use browser globals
var typeFactory = window.typeFactory;
```