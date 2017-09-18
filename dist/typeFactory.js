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

    function each(collection, callback) {

        if (isArray(collection)) {
            for (var i = 0; i < collection.length; i++) {
                if (callback(collection[i], i) === false) { break; }
            }
        } else {
            for (var key in collection) {
                collection.hasOwnProperty(key) && callback(collection[key], key);
            }
        }

    }

    function isArray(obj) {

        return obj && obj.constructor === Array;

    }

    function isPlainObject(obj) {

        return Object.prototype.toString.call(obj) === '[object Object]';

    }

    function result(ref, context) {

        return typeof ref === 'function' ? ref.call(context) : ref;

    }

    function transferProperties(out) {

        for (var i = 1; i < arguments.length; i++) {

            each(arguments[i], function(value, key) {
                typeof value !== 'undefined' && (out[key] = value);
            });

        }

        return out;

    }

    var simpleTypes = [String, Number, Boolean, Function, Object, Array];
    var simpleTypeNames = ['string', 'number', 'boolean', 'function', 'object', 'array'];

    function isOfValidType(value, Type, errorCallback) {

        var isValid;

        if (isArray(Type)) {

            isValid = false;

            each(Type, function(SingleType) {
                if (isOfValidType(value, SingleType)) {
                    isValid = true;
                    return false;
                }
            });

            return isValid;

        } else {

            isValid = true;

            var simpleTypeIndex = simpleTypes.indexOf(Type);
            var isComplexType = simpleTypeIndex < 0;
            var typeName = simpleTypeIndex >= 0 && simpleTypeNames[simpleTypeIndex];

            if (isComplexType) {
                if (!(value instanceof Type)) {
                    isValid = false;
                }
            } else {
                if (typeName === 'array') {
                    !isArray(value) && (isValid = false);
                } else if (typeof value !== typeName) {
                    isValid = false;
                }
            }

            return isValid;

        }

    }

    var optionsApi = {

        writeOptions: function(options) {

            var defaults = result(this.defaults, this);
            var ruleDefaults = {};
            var self = this;

            this.optionRules && each(this.optionRules, function(data, optionName) {
                ruleDefaults[optionName] = data.default;
            });

            this.optionRules && each(this.optionRules, function(data, optionName) {
                if (isPlainObject(data) && typeof data.default !== 'undefined') {
                    ruleDefaults[optionName] = result(data.default, self);
                }
            });

            this.options = transferProperties({}, defaults, ruleDefaults, options);

        },

        validateOptions: function(options, rules) {

            var errorMessages = [];

            each(rules, function(optionRules, optionName) {

                var optionValue = options[optionName];
                var optionValueType = typeof optionValue;

                if (optionRules.required !== false || optionValueType !== 'undefined') {

                    var userType = isPlainObject(optionRules) ? optionRules.type : optionRules;

                    if (userType && !isOfValidType(optionValue, userType)) {
                        errorMessages.push('Invalid type for option "' + optionName +'" ("' + optionValueType + '").');
                    }

                    if (optionRules.validator && !optionRules.validator(optionValue)) {
                        errorMessages.push('Validation of option "' + optionName + '" failed.');
                    }

                }

            });

            return this.handleValidateOptionsErrors(errorMessages);

        },

        handleValidateOptionsErrors: function(errorMessages) {

            if (errorMessages.length) {
                throw new Error(errorMessages.join(' '));
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
