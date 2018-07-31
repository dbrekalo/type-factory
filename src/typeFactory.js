(function(root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.typeFactory = factory();
    }

}(this, function() {

    function factory(parentType, prototypeProperties, staticProperties) {

        var generatedType = prototypeProperties && prototypeProperties.hasOwnProperty('constructor')
            ? prototypeProperties.constructor
            : function() {

                if (parentType) {
                    parentType.apply(this, arguments);
                }

            }
        ;

        if (parentType) {

            var Surrogate = function() { this.constructor = generatedType; };
            Surrogate.prototype = parentType.prototype;
            generatedType.prototype = new Surrogate();

            assign(generatedType, parentType);
        }

        staticProperties && assign(generatedType, staticProperties);
        prototypeProperties && assign(generatedType.prototype, prototypeProperties);

        return generatedType;

    }

    function assign(target, from) {

        if (from) {
            for (var key in from) {
                if (from.hasOwnProperty(key) && typeof from[key] !== 'undefined') {
                    target[key] = from[key];
                }
            }
        }

        return target;

    }

    return function(prototypeProperties, staticProperties) {

        var createdType = factory(null, prototypeProperties, staticProperties);

        createdType.extend = function(prototypeProperties, staticProperties) {

            return factory(this, prototypeProperties, staticProperties);

        };

        return createdType;

    };

}));
