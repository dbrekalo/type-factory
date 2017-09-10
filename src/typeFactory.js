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

    function each(obj, callback) {

        for (var key in obj) {
            obj.hasOwnProperty(key) && callback(obj[key], key);
        }

    }

    function transferProperties(out) {

        for (var i = 1; i < arguments.length; i++) {

            each(arguments[i], function(value, key) {
                typeof value !== 'undefined' && (out[key] = value);
            });

        }

        return out;

    }

    var optionsApi = {

        writeOptions: function(options) {

            var defaults = typeof this.defaults === 'function' ? this.defaults() : this.defaults;
            var ruleDefaults = {};

            this.optionRules && each(this.optionRules, function(data, optionName) {
                ruleDefaults[optionName] = data.default;
            });

            this.options = transferProperties({}, defaults, ruleDefaults, options);

        },

        validateOptions: function(options, rules) {

            var errors = [];

            each(rules, function(data, optionName) {

                var optionValue = options[optionName];
                var optionValueType = typeof optionValue;

                if (data.required !== false || optionValueType !== 'undefined') {

                    if (data.type && optionValueType !== data.type) {
                        errors.push('Option "' + optionName +'" is ' + optionValueType + ', expected ' + data.type + '.');
                    }

                    if (data.rule && !data.rule(optionValue)) {
                        errors.push('Option "' + optionName +'" breaks defined rule.');
                    }

                    if (data.instanceOf && !(optionValue instanceof data.instanceOf)) {
                        errors.push('Option "' + optionName +'" is not instance of defined constructor.');
                    }

                }

            });

            if (errors.length) {
                throw new Error(errors.join(' '));
            } else {
                return this;
            }

        }

    };

    function factory(parentType, prototypeProperties, staticProperties) {

        prototypeProperties = prototypeProperties || {};

        var generatedType = prototypeProperties.hasOwnProperty('constructor') ? prototypeProperties.constructor : function() {

            if (parentType) {

                parentType.apply(this, arguments);

            } else {

                if (this.assignOptions) {
                    this.writeOptions.apply(this, arguments);
                    this.optionRules && this.validateOptions(this.options, this.optionRules);
                }
                this.initialize && this.initialize.apply(this, arguments);

            }

        };

        if (parentType) {

            var Surrogate = function() { this.constructor = generatedType; };
            Surrogate.prototype = parentType.prototype;
            generatedType.prototype = new Surrogate();

            transferProperties(generatedType, parentType);

        } else {

            transferProperties(prototypeProperties, optionsApi);

        }

        staticProperties && transferProperties(generatedType, staticProperties);
        transferProperties(generatedType.prototype, prototypeProperties);

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
