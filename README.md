# Type factory

[![Build Status](https://travis-ci.org/dbrekalo/type-factory.svg?branch=master)](https://travis-ci.org/dbrekalo/type-factory)
[![NPM Status](https://img.shields.io/npm/v/type-factory.svg)](https://www.npmjs.com/package/type-factory)

Type factory is a convenient generator of javascript prototype based constructor functions with simple and easy to use syntax.
Types can be easily extended and used as basis for modules of any purpose.
It weighs less than 2KB.

[Visit documentation site](http://dbrekalo.github.io/type-factory/).

Type factory is a small helper function by which a constructor function can be defined without the usual verbosity.
Each generated type can be easily extended with no need for manual setup of prototype chain.
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
    constructor: function(name) {
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

## Installation

Type factory is packaged as UMD library so you can use it both on client and server (CommonJS and AMD environment) or with browser globals.

```js
// install via npm
npm install type-factory --save

// if you use bundler
var typeFactory = require('type-factory');

// or use browser globals
var typeFactory = window.typeFactory;
```
