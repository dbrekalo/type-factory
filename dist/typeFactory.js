(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.typeFactory = factory();
    }

}(this, function() {

    function extend(extendingObject) {

        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                arguments[i].hasOwnProperty(key) && (extendingObject[key] = arguments[i][key]);
            }
        }

        return extendingObject;

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

            extend(generatedType, parentType);
        }

        extend(generatedType, staticProperties);
        extend(generatedType.prototype, prototypeProperties);

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
