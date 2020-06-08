(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.typeFactory = factory());
}(this, (function () { 'use strict';

    function factory(ParentType, prototypeProperties, staticProperties) {

        var GeneratedType = prototypeProperties && hasOwn(prototypeProperties, 'constructor')
            ? prototypeProperties.constructor
            : function() { ParentType && ParentType.apply(this, arguments); }
        ;

        if (ParentType) {
            var Surrogate = function() { this.constructor = GeneratedType; };
            Surrogate.prototype = ParentType.prototype;
            GeneratedType.prototype = new Surrogate();
            assign(GeneratedType, ParentType);
        }

        staticProperties && assign(GeneratedType, staticProperties);
        prototypeProperties && assign(GeneratedType.prototype, prototypeProperties);

        return GeneratedType;
    }

    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function assign(target, from) {
        if (from) {
            for (var key in from) {
                if (hasOwn(from, key) && typeof from[key] !== 'undefined') {
                    target[key] = from[key];
                }
            }
        }
        return target;
    }

    var typeFactory = function typeFactory(prototypeProperties, staticProperties) {

        var CreatedType = factory(null, prototypeProperties, staticProperties);

        CreatedType.extend = function(prototypeProperties, staticProperties) {
            return factory(this, prototypeProperties, staticProperties);
        };

        return CreatedType;

    };

    return typeFactory;

})));
