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

    function transferProperties(destination, source) {

        for (var key in source) {
            source.hasOwnProperty(key) && (destination[key] = source[key]);
        }

        return destination;

    }

    function factory(parentType, prototypeProperties, staticProperties) {

        var generatedType = prototypeProperties.hasOwnProperty('constructor') ? prototypeProperties.constructor : function() {

            if (parentType) {
                parentType.apply(this, arguments);
            } else {
                this.initialize && this.initialize.apply(this, arguments);
            }

        };

        if (parentType) {

            var Surrogate = function() { this.constructor = generatedType; };
            Surrogate.prototype = parentType.prototype;
            generatedType.prototype = new Surrogate();

            transferProperties(generatedType, parentType);
        }

        staticProperties && transferProperties(generatedType, staticProperties);
        prototypeProperties && transferProperties(generatedType.prototype, prototypeProperties);

        return generatedType;

    }

    return function(prototypeProperties, staticProperties) {

        var createdType = factory(null, prototypeProperties, staticProperties);

        createdType.extend = function(prototypeProperties, staticProperties) {

            return factory(this, prototypeProperties, staticProperties);

        };

        return createdType;

    };

}));
