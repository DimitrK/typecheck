//     --
//     TypeCheck.js 0.0.1.α
//     Copyright (c) 2013 Dimitris Kyriazopoulos, http://www.dimitrisk.info
//     MIT Lincesed
//     -
//     Permission is hereby granted, free of charge, to any person obtaining
//     a copy of this software and associated documentation files (the "Software"),
//     to deal in the Software without restriction, including without limitation
//     the rights to use, copy, modify, merge, publish, distribute, sublicense,
//     and/or sell copies of the Software, and to permit persons to whom the
//     Software is furnished to do so, subject to the following conditions:
//     -
//     The above copyright notice and this permission notice shall be included in
//     all copies or substantial portions of the Software.
//     -
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
//     IN THE SOFTWARE.
//     --
var TypeCheck = TypeCheck || {options: {custom: {types: {}, plugins: {}}}};
var window = window;
(function (options) {
    "use strict";

    /**
    * Iterates in each object enumerable property and executes the given function for each of them.
    * @param {object} object The object which is wanted to expose its properties.
    * @param {function} iteraction The function which will be executed in each enumerable property found.
    * @param {object=} context The context the iteraction will be executed in.
    */
    function objectOwnPropertiesIterator(object, iteraction, context) {
        var prop;
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                iteraction.apply(context, [prop, object[prop]]);
            }
        }
    }

    /**
    * Given two objects, makes a shallow copy of any property of the first object to the second in case that doesnt exist in it.
    * @param {object} source The source object which its properties will be copied.
    * @param {object} target The target object which will get the missing properties.
    * @param {boolean=} overwritte Specifies if properties on target object should be overwritten from `source` object in case they exist already.
    * @param {object=} typeCheckKind If this optional parameter is set then it will be done a deep copy of the `source` object
    */
    function setSamePropertiesFrom(source, target, overwritte, typeCheckKind) {
        target = target || {};
        // Iterates though the available source object's properties and passes them to the defined function.
        objectOwnPropertiesIterator(source, function (propName, propVal) {
            if (typeCheckKind && typeCheckKind.object(propVal)) {
                target[propName] = target[propName] || {};
                setSamePropertiesFrom(propVal, target[propName], overwritte, typeCheckKind);
            }
            // if target object doesn't have the property or `overwritte` is set to true then assign that property.
            if (overwritte || !target.hasOwnProperty(propName)) {
                target[propName] = propVal;
            }
        });
        return target;
    }


    /**
    * Given a `typeCheck` instance of any Kind (`TypeCheckPrime`,`TypeCheckSimpleLengthComparer`) this plugin injects the `many` object as property to that instance which makes it able to handle bulk checks in multiple variables against the same type. Tha variables should be passed as array.
    * @param {object} typeCheckKind The kind of `typeCheck` instance.
    */
    function includeTheManyPlugin(typeCheckKind) {
        // If the property is not there set an empty object
        typeCheckKind.many = typeCheckKind.many || {};
        // Iterates through the given TypeCheck kind's properties and passes them to the function
        objectOwnPropertiesIterator(typeCheckKind, function (propKey, propVal) {
            // For each of these properties sets another property pre-pluralized, to the `many` object as a function which takes as argument an array of variables (`collection`) and an optional `length`
            typeCheckKind.many[propKey + 's'] = function (collection, length) {
                var index;
                // Ensures that the collection is array and the property of the TypeCheck Kind is a function in order to avoid to call as functions objects like `empty`,`filled` and `many`
                if (typeCheckKind.array(collection) && typeCheckKind.function(typeCheckKind[propKey])) {
                    // Iterates through all the elements of the array and on each one calls the type check with or without length
                    for (index = 0; index < collection.length; index++) {
                        // On the first fail of the check for a variable during the iteration return false.
                        if (arguments.length === 2 && !typeCheckKind[propKey](collection[index], length)) { return false; }
                        if (arguments.length < 2 && !typeCheckKind[propKey](collection[index])) { return false; }
                    }
                    // In other cases return true
                    return true;
                }
            };
        });
    }

    /**
    * Given a `typeCheck` instance of any Kind (`TypeCheckPrime`,`TypeCheckSimpleLengthComparer`) this plugin injects the `empty` and `filled` objects as properties to that instance which makes it able to handle checks regarding if the var of a given type is having a value or not. Supports check for the following types: `array`, `string`, and `object`.
    * @param {object} typeCheckKind The kind of `typeCheck` instance.
    */
    function includeTheEmptyFilledPlugins(typeCheckKind) {
        typeCheckKind.empty = typeCheckKind.empty || {};
        typeCheckKind.filled = typeCheckKind.filled || {};
        objectOwnPropertiesIterator(typeCheckKind, function (propKey, propVal) {
            var emptyCheck;
            // all the functions for the available data types are wrapped in `emptyCheck`
            emptyCheck = {
                'object': function (token) {
                    var exists = false;
                    objectOwnPropertiesIterator(token, function (existsKey, existsVal) { exists = true; });
                    return !exists;
                },
                'string': function (token) {
                    return !token.length;
                },
                'array': function (token) {
                    return !token.length;
                },
                'function': function (token) {
                    return !token.length;
                }
            };
            //If there is actually a method in the `emmptyCheck` object that can handle this key
            if (emptyCheck[propKey]) {
                //Set a key in the `empty` property as a function
                typeCheckKind.empty[propKey] = function (token) {
                    //That checks the variable against the `typeCheck` and `emptyCheck` functions for this key .
                    return typeCheckKind[propKey](token) && emptyCheck[propKey](token);
                };
                //Set the `filled` property which is the oposite of `empty`, sugar.
                typeCheckKind.filled[propKey] = !typeCheckKind.empty[propKey];
            }
        });
    }

    /**
    * Given a `typeCheck` instance of any Kind (`TypeCheckPrime`,`TypeCheckSimpleLengthComparer`) this plugin injects any custom defined plugins.
    * @param {object} typeCheckKind The kind of `typeCheck` instance.
    * @param {object} plugins The the custom plugins defined in `TypeCheck.options.custom.plugins` object.
    */
    function includeCustomPlugins(typeCheckKind, plugins) {
        // Iterate through the available custom plugins of `options.custom.plugins` and for each of these:
        objectOwnPropertiesIterator(plugins, function (pluginName, pluginFn) {
            // * Initialize it if is not initialized
            typeCheckKind[pluginName] = typeCheckKind[pluginName] || {};
            // * Then Iterate through the properties of the instance of the kind of TypeCheck chosen and
            objectOwnPropertiesIterator(typeCheckKind, function (propName, propVal) {
                // -if the property is not an object, which means is not another plugin,
                if (!typeCheckKind.object(propVal) && typeCheckKind.function(pluginFn)) {
                    // Assign it as custom plugin and Call the it with parameters the property name, value, and the name of the plugin
                    typeCheckKind[pluginName][propName] = pluginFn.bind(pluginFn, propName);
                }
            });
        });
    }

    /**
    * Given a `typeCheck` instance of any Kind (`TypeCheckPrime`,`TypeCheckSimpleLengthComparer`) this plugin manages user choices as declared in `TypeCheck.options` object.
    * @param {object} typeCheckKind The kind of `typeCheck` instance.
    */
    function includeCustomChoices(typeCheckKind) {
        var defaults;
        defaults = {
            kind: "length",
            custom: {
                // The custom type checks object
                types: {},
                 // Declaration of custom plugins which will be injected in the TypeCheck object.
                plugins: {}
            },
            // Declaration of plugins should be included. Gets an object with names of the available plugins as keys and a boolean which defines if a plugin should be included or not as value : `many`,`filled`,`empty`
            plugins: {
                many: true,
                empty: true // `filled` plugin is going in pair with empty so modification to one affects both.
            },
            // If set to true user can overwritte existing type checks with custom.
            overwritte: false
        };
        // Mixing options with defaults and return the result to options instead of supporting deep copy.
        setSamePropertiesFrom(defaults, options, false, typeCheckKind);
        // Setting custom types checks
        setSamePropertiesFrom(options.custom.types, typeCheckKind, options.overwritte);
        // Setting custom plugins
        includeCustomPlugins(typeCheckKind, options.custom.plugins);
    }

    /**
    * The core TypeCheck Kind. Handles the basic checks against every javascript type
    */
    function TypeCheckPrime() {
        var typeCheck;
        typeCheck = this;
        this['function'] = function (token) {
            return token instanceof Function;
        };
        this['object'] = function (token) {
            return Object.prototype.toString.call(token) === '[object Object]';
        };
        this['array'] = function (token) {
            return token && !typeCheck.null(token.length) && token.push === Array.prototype.push;
        };
        this['number'] = function (token) {
            //Even if a bit slower I prefer to check numbers with parseFloat because empty array return NaN, The second check is used for digit zero and lastly Infinity check
            return parseFloat(token) + 1 && (+token === 0 || !!(+token / +token));
        };
        this['numeric'] = function (token) {
            return typeof token === 'number';
        };
        this['string'] = function (token) {
            return !typeCheck.null(token) && !!token.toLowerCase;
        };
        this['any'] = function (token, types) {
            var index;
            types = typeCheck.array(types) ? types : typeCheck.string(types) ? types.split(" ") : [];
            for (index in types) {
                // There is a property set in the array and it exists a typeCheck method for the value of the types array's index
                if (types.hasOwnProperty(index) && typeCheck[types[index]]) {
                    // If the value of the token satisfies the typeCheck method for first time return true
                    if (typeCheck[types[index]](token)) {
                        //In case of undefined applies the first check t, in other cases the second
                        return typeCheck[types[index]](token) || !!token;
                    }
                }
            }
            // In any other cases just make sure the token is not null
            return !token;
        };
        this['undefined'] = function (token) {
            return token === null || token === undefined;
        };
        this['null'] = function (token) {
            return typeCheck.undefined(token);
        };
        this['infinity'] = function (token) {
            return +token / 0 === token && !(+token / +token);
        };
        //Integrating custom types.
        setSamePropertiesFrom(options.custom.types, this, options.overwritte);
        return this;
    }

    /**
    * This TypeCheck Kind handles validation of variables of certain types between their length or value against a given length or a wanted number. Supports : `array`, `string`, `number` types.
    */
    function TypeCheckSimpleLengthComparer() {
        var typeCheckPrime, numericComparator;
        typeCheckPrime = new TypeCheckPrime();
        numericComparator = {
            'compare': function (leftNumber, rightConditional) {
                var condition;
                if (typeCheckPrime.undefined(rightConditional)) {
                    return false;
                }
                rightConditional = rightConditional.toString(); //make sure is a string before replace anything
                condition = rightConditional.replace(/(\d|\-|\+|\.|e)/g, '') || '='; // match digits, negatives, positives and decimals
                return this[condition] && this[condition](leftNumber, rightConditional.replace(condition, ''));

            },
            '>': function (leftNumber, rightNumber) { return +leftNumber > +rightNumber; },
            '<': function (leftNumber, rightNumber) { return +leftNumber < +rightNumber; },
            '=': function (leftNumber, rightNumber) { return +leftNumber === +rightNumber; },
            '!': function (leftNumber, rightNumber) { return +leftNumber !== +rightNumber; },
            '>=': function (leftNumber, rightNumber) { return +leftNumber >= +rightNumber; },
            '<=': function (leftNumber, rightNumber) { return +leftNumber <= +rightNumber; }
        };

        this['array'] = function (token, length) {
            return typeCheckPrime.array(token) && (arguments.length < 2 ||  numericComparator.compare(token.length, length));
        };
        this['string'] = function (token, length) {
            return typeCheckPrime.string(token) && (arguments.length < 2  || numericComparator.compare(token.length, length));
        };
        this['number'] = function (token, wanted) {
            return typeCheckPrime.number(token) && (arguments.length < 2  || numericComparator.compare(token, wanted));
        };
        setSamePropertiesFrom(typeCheckPrime, this);
        return this;
    }


    // Checks the options for the corresponding `TypeCheck` kind
    window.TypeCheck = (options && options.kind === "basic") ? new TypeCheckPrime() : new TypeCheckSimpleLengthComparer();
    // Is good first to include the custom choices since this will allow the custom types to be extended by other plugins.
    includeCustomChoices(window.TypeCheck);
    // Later the rest of the plugins.
    includeTheEmptyFilledPlugins(window.TypeCheck);
    includeTheManyPlugin(window.TypeCheck);

    return window.TypeCheck;
})(TypeCheck.options);


// Customization
// -------------
// In case there is a need of custom plugins or custom types there is the way to inject them.
// Before you include the library to your code create an object named `TypeCheck` and later declare a property `options` :
//
//      var TypeCheck = TypeCheck || {options: {}};
//
// Now you can adjust the library to your needs. The available options are :
//
// * `TypeCheck.options.kind` Which takes a string. Possible values are  `"basic"` or `"length"` and specifies which Kind of TypeCheck to use. In case of `basic`, TypeCheck is limited only on checking types while `length` TypeCheck compares the input against types and length whenever it is supported.
//
// * `TypeCheck.options.custom.types` Which allows you to declare custom types which then will be reusable through the library.
//
//      TypeCheck.options.custom.types.binary = function (atom) {
//          "use strict";
//          return atom === 0 || atom === 1;
//      };
//
// * `TypeCheck.options.custom.plugins` Which allows you to declare custom plugins which are able to filter and process all the available types that TypeCheck currently checks. The first parameter of each custom plugin function will always be the names of each declared type and will be set automatically. During call of the plugin this argument should not be included, it is there to assist you on declaring different handlers for different types.
//
//      TypeCheck.options.custom.plugins.lessthan = function (typeName, atom, maximum){
//         "use strict";
//         this['number'] = function() { return +atom <= +maximum };
//         this['array'] = function() { return atom.length <= +maximum };
//         this['string'] = function() { return atom.length <= +maximum };
//         return TypeCheck[typeName] && TypeCheck[typeName](atom) && this[typeName]();
//      };
//
// When `lessthan` plugin will be called will only accept as arguments any decalred argument except the first one. e.g. `TypeCheck.lessthan.string("length",7)`
//
// * `TypeCheck.options.overwrittte` Accepts `true` or `false` and allows the user to overwritte existing plugins and type checking functions with custom ones
