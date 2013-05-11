// Just for linter to leave me alone
var expect = expect;
var describe = describe;
var it = it;
var TypeCheck = TypeCheck;
var beforeEach = beforeEach ;
describe("TypeCheck", function () {
    var arrayEmpty = [] ,
        stringEmpty = '',
        objectEmpty = {},
        functionEmpty = function(){},
        numberZero = '0',
        numericZero = 0;
    var arrayUnit = new Array('arrayAtom1'),
        objectUnit = { objectAtom: 'aval' },
        stringUnit = 'astring',
        functionUnit = function (a) {return a;},
        numericUnit = 1,
        numberUnit = '1',
        nullUnit = null,
        undefinedUnit,
        infinityUnit = numericUnit / 0;

    it("should be initialized as a variable", function () {

        //demonstrates use of custom matcher
        expect(TypeCheck).toBeTruthy();
    });
    describe("is checking for array,", function () {
        beforeEach(function () {});

        it("is expected to be valid for an empty array", function () {
            var arrayEmpty = [];
            expect(TypeCheck.array(arrayEmpty)).toBeTruthy();
        });

        it("is expected to be valid for a filled array", function () {
            var arrayIndexed;
            arrayIndexed = [];
            arrayIndexed[9] = 'arrayAtom99';
            expect(TypeCheck.array(arrayIndexed)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed an Object", function () {
                expect(TypeCheck.array(objectUnit)).toBeFalsy();
            });
            it("is passed a Function", function () {
                expect(TypeCheck.array(functionUnit)).toBeFalsy();
            });
            it("is passed a Number", function () {
                expect(TypeCheck.array(numericUnit)).toBeFalsy();
            });
            it("is passed a Null", function () {
                expect(TypeCheck.array(nullUnit)).toBeFalsy();
            });
            it("is passed undefined", function () {
                expect(TypeCheck.array(undefinedUnit)).toBeFalsy();
            });
            it("is passed infinite", function () {
                expect(TypeCheck.array(infinityUnit)).toBeFalsy();
            });
        });

        describe("and it validates the array's length", function () {

            describe("as valid whenever it", function () {

                it("is empty and checks for length equals 0", function () {
                    var arrayEmpty = [];
                    expect(TypeCheck.array(arrayEmpty, 0)).toBeTruthy();
                });

                it("holds one element and checks for length equals 1", function () {
                    expect(TypeCheck.array(arrayUnit, 1)).toBeTruthy();
                });

                it("holds one element and checks for length less or equal to 1", function () {
                    expect(TypeCheck.array(arrayUnit, '<=1')).toBeTruthy();
                });

                it("holds one element and checks for length less than 2", function () {
                    expect(TypeCheck.array(arrayUnit, '<2')).toBeTruthy();
                });
            });

            describe("as invalid whenever it", function () {

                it("holds one element and checks for length with a negative number", function () {
                    expect(TypeCheck.array(arrayUnit, -1)).toBeFalsy();
                });

                it("is empty and checks for length with a negative number", function () {
                    var arrayEmpty;
                    arrayEmpty = [];
                    expect(TypeCheck.array(arrayEmpty, -1)).toBeFalsy();
                });

                it("is undefined and checks for length with a negative number", function(){
                    expect(TypeCheck.array(undefined,-1));
                });

                it("is an array with one element and checks for length other than 1", function () {
                    var index;
                    for (index = -5; index < 1; index += 0.1) {
                        expect(TypeCheck.array(arrayUnit, index)).toBeFalsy();
                    }
                    for (index = 2; index < 5; index += 0.1) {
                        expect(TypeCheck.array(arrayUnit, index)).toBeFalsy();
                    }
                });

                it("is an array with one element and checks for length null value", function () {
                    expect(TypeCheck.array(arrayUnit, null)).toBeFalsy();
                });

                it("is an array with one element and checks for length string value", function () {
                    expect(TypeCheck.array(arrayUnit, stringUnit)).toBeFalsy();
                });

                it("holds one element and checks for length equal to 1", function () {
                    expect(TypeCheck.array(arrayUnit, '<1')).toBeFalsy();
                });

                it("holds one element and checks for length less than 0", function () {
                    expect(TypeCheck.array(arrayUnit, '<0')).toBeFalsy();
                });

                it("holds one element and checks for length less than undefined", function () {
                    expect(TypeCheck.array(arrayUnit, '<undefined')).toBeFalsy();
                });

                it("holds one element and checks for length less than null", function () {
                    expect(TypeCheck.array(arrayUnit, '<null')).toBeFalsy();

                });
                it("holds one element and checks for length less than -1", function () {
                    expect(TypeCheck.array(arrayUnit, '<-1')).toBeFalsy();
                });
            });
        });

    });

    describe("is checking for many arrays and it", function () {
        it("should be valid in case it is passed a group[] of arrays ", function () {
            var manyArrays = [arrayUnit,arrayUnit,arrayUnit];
            expect(TypeCheck.many.arrays(manyArrays)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed a group[] of mixed elements arrays with strings", function () {
                var manyMixed = [arrayUnit,stringUnit,arrayUnit];
                expect(TypeCheck.many.arrays(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements arrays with undefined", function () {
                var manyMixed = [arrayUnit,stringUnit,undefinedUnit];
                expect(TypeCheck.many.arrays(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements arrays with numbers", function () {
                var manyMixed = [numericUnit,arrayUnit,numericUnit];
                expect(TypeCheck.many.arrays(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements arrays with objects", function () {
                var manyMixed = [objectUnit,objectUnit,arrayUnit];
                expect(TypeCheck.many.arrays(manyMixed)).toBeFalsy();
            });
        });

        describe("and it validates their length", function () {
            describe("as valid in case it", function () {
                it("is passed a group[] of single element arrays with length 1", function () {
                    var manyArrays = [arrayUnit,arrayUnit,arrayUnit];
                    expect(TypeCheck.many.arrays(manyArrays)).toBeTruthy();
                });
                it("is passed a group[] of empty arrays with length 0", function () {
                    var manyArrays = [[],[],[]];
                    expect(TypeCheck.many.arrays(manyArrays,0)).toBeTruthy();
                });
                it("is passed a group[] of single element arrays with length '1' as string", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays,'1')).toBeTruthy();
                });

            });
            describe("as invalid in case it", function() {
                it("is passed a group[] of empty arrays with length 1", function () {
                    var manyArrays = [[],[],[]];
                    expect(TypeCheck.many.arrays(manyArrays,1)).toBeFalsy();
                });
                it("is passed a group[] of single element arrays with length 0", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays,0)).toBeFalsy();
                });
                it("is passed a group[] of single element arrays with length an array", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays,arrayUnit)).toBeFalsy();
                });
                it("is passed a group[] of single element arrays with length a text string", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays,stringUnit)).toBeFalsy();
                });
                it("is passed a group[] of single element arrays with negative length -1", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays,-1)).toBeFalsy();
                });
                it("is passed a group[] of single element arrays with undefined length", function () {
                    var manyArrays = [[1],arrayUnit,['15']];
                    expect(TypeCheck.many.arrays(manyArrays, undefined)).toBeFalsy();
                });
            });
        });
    });

    describe("is checking if an array is empty and it", function () {
        describe("should be valid whenever it", function() {
            it("checks an empty array", function(){
                expect(TypeCheck.empty.array(arrayEmpty)).toBeTruthy();
            });
            it("checks an empty array and length with any value such as 1 ", function(){
                expect(TypeCheck.empty.array(arrayEmpty,1)).toBeTruthy();
            });
            it("checks an empty array and length with any value such as null", function(){
                expect(TypeCheck.empty.array(arrayEmpty,nullUnit)).toBeTruthy();
            });
            it("checks an empty array and length with any value such as an object", function(){
                expect(TypeCheck.empty.array(arrayEmpty,objectUnit)).toBeTruthy();
            });
        });
        describe("should be invalid whenever it", function() {
            it("checks an empty string", function(){
                expect(TypeCheck.empty.array(stringEmpty)).toBeFalsy();
            });
            it("checks an empty object", function(){
                expect(TypeCheck.empty.array(objectEmpty)).toBeFalsy();
            });
            it("checks an empty function", function(){
                expect(TypeCheck.empty.array(functionEmpty)).toBeFalsy();
            });
            it("checks a number", function(){
                expect(TypeCheck.empty.array(numberUnit)).toBeFalsy();
            });
            it("checks a non empty string", function(){
                expect(TypeCheck.empty.array(stringUnit)).toBeFalsy();
            });
        });
    });

    describe("is checking for string,", function () {
        beforeEach(function () {});

        it("is expected to be valid for an empty string", function () {
            var stringEmpty = "";
            expect(TypeCheck.string(stringEmpty)).toBeTruthy();
        });

        it("is expected to be valid for a filled string", function () {
            expect(TypeCheck.string(stringUnit)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed an Object", function () {
                expect(TypeCheck.string(objectUnit)).toBeFalsy();
            });
            it("is passed a Function", function () {
                expect(TypeCheck.string(functionUnit)).toBeFalsy();
            });
            it("is passed a Number", function () {
                expect(TypeCheck.string(numericUnit)).toBeFalsy();
            });
            it("is passed a Null", function () {
                expect(TypeCheck.string(nullUnit)).toBeFalsy();
            });
            it("is passed undefined", function () {
                expect(TypeCheck.string(undefinedUnit)).toBeFalsy();
            });
            it("is passed infinite", function () {
                expect(TypeCheck.string(infinityUnit)).toBeFalsy();
            });
            it("is passed Array", function () {
                expect(TypeCheck.string(arrayUnit)).toBeFalsy();
            });
        });

        describe("and it validates the string's length", function () {

            describe("as valid whenever it", function () {

                it("is empty and checks for length equals 0", function () {
                    var stringEmpty = "";
                    expect(TypeCheck.string(stringEmpty, 0)).toBeTruthy();
                });

                it("holds one element and checks for length equals 1", function () {
                    var stringAtom = "a";
                    expect(TypeCheck.string(stringAtom, 1)).toBeTruthy();
                });
            });

            describe("as invalid whenever it", function () {

                it("holds one element and checks for length with a negative number", function () {
                    expect(TypeCheck.string(stringUnit, -1)).toBeFalsy();
                });

                it("is empty and checks for length with a negative number", function () {
                    expect(TypeCheck.string(stringEmpty, -1)).toBeFalsy();
                });

                it("is undefined and checks for length with a negative number", function(){
                    expect(TypeCheck.string(undefined,-1));
                });

                it("is an string with one element and checks for length null value", function () {
                    expect(TypeCheck.string(stringUnit, null)).toBeFalsy();
                });

                it("is an string with one element and checks for length string value", function () {
                    expect(TypeCheck.string(stringUnit, stringUnit)).toBeFalsy();
                });
            });
        });
    });

    describe("is checking for many Strings and it", function () {
        it("should be valid in case it is passed a group[] of Strings ", function () {
            var manyStrings = [stringUnit, stringUnit, stringUnit];
            expect(TypeCheck.many.strings(manyStrings)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed a group[] of mixed elements Strings with arrays instead of length", function () {
                var manyMixed = [arrayUnit, arrayUnit, arrayUnit];
                expect(TypeCheck.many.strings(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements Strings with undefined instead of length", function () {
                var manyMixed = [stringUnit, stringUnit, undefinedUnit];
                expect(TypeCheck.many.strings(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements Strings with numbers instead of length", function () {
                var manyMixed = [numericUnit, stringUnit, numericUnit];
                expect(TypeCheck.many.strings(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements Strings with objects instead of length", function () {
                var manyMixed = [objectUnit, objectUnit, stringUnit];
                expect(TypeCheck.many.strings(manyMixed)).toBeFalsy();
            });
        });

        describe("and it validates their length", function () {
            describe("as valid in case it", function () {
                it("is passed a group[] of single element Strings with length 1", function () {
                    var manyStrings = [stringUnit, stringUnit, stringUnit];
                    expect(TypeCheck.many.strings(manyStrings)).toBeTruthy();
                });
                it("is passed a group[] of empty Strings with length 0", function () {
                    var manyStrings = ["","",""];
                    expect(TypeCheck.many.strings(manyStrings,0)).toBeTruthy();
                });
                it("is passed a group[] of single element Strings with length '1' as string", function () {
                    var manyStrings = ['1','a'];
                    expect(TypeCheck.many.strings(manyStrings,'1')).toBeTruthy();
                });

            });
            describe("as invalid in case it", function() {
                it("is passed a group[] of empty Strings with length 1", function () {
                    var manyStrings = ["","",""];
                    expect(TypeCheck.many.strings(manyStrings,1)).toBeFalsy();
                });
                it("is passed a group[] of single element Strings with length 0", function () {
                    var manyStrings = ['1',stringUnit,'15'];
                    expect(TypeCheck.many.strings(manyStrings,0)).toBeFalsy();
                });
                it("is passed a group[] of single element Strings with length a text string", function () {
                    var manyStrings = ['1',stringUnit,'15'];
                    expect(TypeCheck.many.strings(manyStrings,stringUnit)).toBeFalsy();
                });
                it("is passed a group[] of single element Strings with negative length -1", function () {
                    var manyStrings = ['1',stringUnit,'15'];
                    expect(TypeCheck.many.strings(manyStrings,-1)).toBeFalsy();
                });
                it("is passed a group[] of single element Strings with undefined length", function () {
                    var manyStrings = ['1',stringUnit,'15'];
                    expect(TypeCheck.many.strings(manyStrings, undefined)).toBeFalsy();
                });
            });
        });
    });

    describe("is checking if an string is empty and it", function () {
        describe("should be valid whenever it", function() {
            it("checks an empty string", function(){
                expect(TypeCheck.empty.string(stringEmpty)).toBeTruthy();
            });
            it("checks an empty string and length with any value such as 1 ", function(){
                expect(TypeCheck.empty.string(stringEmpty,1)).toBeTruthy();
            });
            it("checks an empty string and length with any value such as null", function(){
                expect(TypeCheck.empty.string(stringEmpty,nullUnit)).toBeTruthy();
            });
            it("checks an empty string and length with any value such as an object", function(){
                expect(TypeCheck.empty.string(stringEmpty,objectUnit)).toBeTruthy();
            });
        });
        describe("should be invalid whenever it", function() {
            it("checks an empty array", function(){
                expect(TypeCheck.empty.string(arrayEmpty)).toBeFalsy();
            });
            it("checks an empty object", function(){
                expect(TypeCheck.empty.string(objectEmpty)).toBeFalsy();
            });
            it("checks an empty function", function(){
                expect(TypeCheck.empty.string(functionEmpty)).toBeFalsy();
            });
            it("checks a number", function(){
                expect(TypeCheck.empty.string(numberUnit)).toBeFalsy();
            });
            it("checks a non empty string", function(){
                expect(TypeCheck.empty.string(stringUnit)).toBeFalsy();
            });
        });
    });

    describe("is checking for object,", function () {
        beforeEach(function () {});

        it("is expected to be valid for an empty object", function () {
            expect(TypeCheck.object(objectEmpty)).toBeTruthy();
        });

        it("is expected to be valid for a filled object", function () {
            expect(TypeCheck.object(objectUnit)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed an Array", function () {
                expect(TypeCheck.object(arrayUnit)).toBeFalsy();
            });
            it("is passed a Function", function () {
                expect(TypeCheck.object(functionUnit)).toBeFalsy();
            });
            it("is passed a Number", function () {
                expect(TypeCheck.object(numericUnit)).toBeFalsy();
            });
            it("is passed a Null", function () {
                expect(TypeCheck.object(nullUnit)).toBeFalsy();
            });
            it("is passed undefined", function () {
                expect(TypeCheck.object(undefinedUnit)).toBeFalsy();
            });
            it("is passed infinite", function () {
                expect(TypeCheck.object(infinityUnit)).toBeFalsy();
            });
            it("is passed Array", function () {
                expect(TypeCheck.object(arrayUnit)).toBeFalsy();
            });
        });

        describe("and it validates the object's length", function () {

            describe("as valid whenever it", function () {

                it("is empty and checks for length equals 0", function () {
                    expect(TypeCheck.object(objectEmpty, 0)).toBeTruthy();
                });

                it("holds one element and checks for length equals 1", function () {
                    expect(TypeCheck.object(objectUnit, 1)).toBeTruthy();
                });

                it("holds one element and checks any length such as a negative number", function () {
                    expect(TypeCheck.object(objectUnit, -1)).toBeTruthy();
                });

                it("is empty and checks for any length such as q negative number", function () {
                    expect(TypeCheck.object(objectEmpty, -1)).toBeTruthy();
                });
            });
        });
    });

    describe("is checking for many objects and it", function () {
        it("should be valid in case it is passed a group[] of objects ", function () {
            var manyobjects = [objectUnit, objectUnit, objectUnit];
            expect(TypeCheck.many.objects(manyobjects)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed a group[] of mixed elements objects with arrays instead of length", function () {
                var manyMixed = [arrayUnit, arrayUnit, arrayUnit];
                expect(TypeCheck.many.objects(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements objects with undefined instead of length", function () {
                var manyMixed = [objectUnit, objectUnit, undefinedUnit];
                expect(TypeCheck.many.objects(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements objects with numbers instead of length", function () {
                var manyMixed = [numericUnit, objectUnit, numericUnit];
                expect(TypeCheck.many.objects(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements objects with strings instead of length", function () {
                var manyMixed = [stringUnit, stringUnit, stringUnit];
                expect(TypeCheck.many.objects(manyMixed)).toBeFalsy();
            });
        });

        describe("and it doesn't validates their length in any case such as ", function () {
            describe("as valid in case it", function () {
                it("is passed a group[] of empty objects for length 1", function () {
                    var manyobjects = [objectEmpty, objectEmpty, objectEmpty];
                    expect(TypeCheck.many.objects(manyobjects,1)).toBeTruthy();
                });
                it("is passed a group[] of single element objects for length 0", function () {
                    var manyobjects = [objectUnit, objectUnit, objectUnit];
                    expect(TypeCheck.many.objects(manyobjects,0)).toBeTruthy();
                });
                it("is passed a group[] of single element objects for length a text object", function () {
                    var manyobjects = [objectUnit ,objectUnit, objectUnit];
                    expect(TypeCheck.many.objects(manyobjects,objectUnit)).toBeTruthy();
                });
                it("is passed a group[] of single element objects for negative length -1", function () {
                    var manyobjects = [objectUnit ,objectUnit, objectUnit];
                    expect(TypeCheck.many.objects(manyobjects,-1)).toBeTruthy();
                });
                it("is passed a group[] of single element objects for undefined length", function () {
                    var manyobjects = [objectUnit ,objectUnit, objectUnit];
                    expect(TypeCheck.many.objects(manyobjects, undefined)).toBeTruthy();
                });
            });
        });
    });

    describe("is checking if an object is empty and it", function () {
        describe("should be valid whenever it", function() {
            it("checks an empty object", function(){
                expect(TypeCheck.empty.object(objectEmpty)).toBeTruthy();
            });
            it("checks an empty object and length with any value such as 1 ", function(){
                expect(TypeCheck.empty.object(objectEmpty,1)).toBeTruthy();
            });
            it("checks an empty object and length with any value such as null", function(){
                expect(TypeCheck.empty.object(objectEmpty,nullUnit)).toBeTruthy();
            });
            it("checks an empty object and length with any value such as an object", function(){
                expect(TypeCheck.empty.object(objectEmpty,objectUnit)).toBeTruthy();
            });
        });
        describe("should be invalid whenever it", function() {
            it("checks an empty array", function(){
                expect(TypeCheck.empty.object(arrayEmpty)).toBeFalsy();
            });
            it("checks an empty string", function(){
                expect(TypeCheck.empty.object(stringEmpty)).toBeFalsy();
            });
            it("checks an empty function", function(){
                expect(TypeCheck.empty.object(functionEmpty)).toBeFalsy();
            });
            it("checks a number", function(){
                expect(TypeCheck.empty.object(numberUnit)).toBeFalsy();
            });
            it("checks a non empty object", function(){
                expect(TypeCheck.empty.object(objectUnit)).toBeFalsy();
            });
        });
    });

    describe("is checking for number,", function () {
        beforeEach(function () {});

        it("is expected to be valid for an empty number", function () {
            expect(TypeCheck.number(numberZero)).toBeTruthy();
        });

        it("is expected to be valid for a filled number", function () {
            expect(TypeCheck.number(numberUnit)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed an Array", function () {
                expect(TypeCheck.number(arrayUnit)).toBeFalsy();
            });
            it("is passed a Function", function () {
                expect(TypeCheck.number(functionUnit)).toBeFalsy();
            });
            it("is passed a Object", function () {
                expect(TypeCheck.number(objectUnit)).toBeFalsy();
            });
            it("is passed a Null", function () {
                expect(TypeCheck.number(nullUnit)).toBeFalsy();
            });
            it("is passed undefined", function () {
                expect(TypeCheck.number(undefinedUnit)).toBeFalsy();
            });
            it("is passed infinite", function () {
                expect(TypeCheck.number(infinityUnit)).toBeFalsy();
            });
            it("is passed Array", function () {
                expect(TypeCheck.number(arrayUnit)).toBeFalsy();
            });
        });

        describe("and it validates the number's wanted value", function () {

            describe("as valid whenever it", function () {

                it("is empty and checks for wanted value equals 0", function () {
                    expect(TypeCheck.number(numberZero, 0)).toBeTruthy();
                });

                it("holds one element and checks for wanted value equals 1", function () {
                    expect(TypeCheck.number(numberUnit, 1)).toBeTruthy();
                });

                it("is an number with one element and checks for the wanted number value", function () {
                    expect(TypeCheck.number(numberUnit, numberUnit)).toBeTruthy();
                });
            });

            describe("as invalid whenever it", function () {

                it("holds one element and checks for wanted value with a negative number", function () {
                    expect(TypeCheck.number(numberUnit, -1)).toBeFalsy();
                });

                it("is empty and checks for wanted value with a negative number", function () {
                    expect(TypeCheck.number(numberZero, -1)).toBeFalsy();
                });

                it("is undefined and checks for wanted value with a negative number", function(){
                    expect(TypeCheck.number(undefined,-1));
                });

                it("is an number with one element and checks for wanted  null value", function () {
                    expect(TypeCheck.number(numberUnit, null)).toBeFalsy();
                });
            });
        });
    });

    describe("is checking for many numbers and it", function () {
        it("should be valid in case it is passed a group[] of numbers ", function () {
            var manyNumbers = [numberUnit,numberUnit,numberUnit];
            expect(TypeCheck.many.numbers(manyNumbers)).toBeTruthy();
        });
        describe("is expected to be invalid in case it", function () {
            it("is passed a group[] of mixed elements numbers with strings", function () {
                var manyMixed = [numberUnit,stringUnit,numberUnit];
                expect(TypeCheck.many.numbers(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements numbers with undefined", function () {
                var manyMixed = [numberUnit,stringUnit,undefinedUnit];
                expect(TypeCheck.many.numbers(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements numbers with arrays", function () {
                var manyMixed = [arrayUnit,numberUnit,numericUnit];
                expect(TypeCheck.many.numbers(manyMixed)).toBeFalsy();
            });
            it("is passed a group[] of mixed elements numbers with objects", function () {
                var manyMixed = [objectUnit,objectUnit,numberUnit];
                expect(TypeCheck.many.numbers(manyMixed)).toBeFalsy();
            });
        });

        describe("and it validates their length", function () {
            describe("as valid in case it", function () {
                it("is passed a group[] of single element numbers with length 1", function () {
                    var manyNumbers = [numberUnit,numberUnit,numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers)).toBeTruthy();
                });
                it("is passed a group[] of empty numbers with length 0", function () {
                    var manyNumbers = [numericZero, numericZero, numericZero];
                    expect(TypeCheck.many.numbers(manyNumbers,0)).toBeTruthy();
                });
                it("is passed a group[] of single element numbers with length '1' as string", function () {
                    var manyNumbers = [numericUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,'1')).toBeTruthy();
                });

                it("is passed a group[] of single element numbers with length '1' as string", function () {
                    var manyNumbers = [numericUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,'1')).toBeTruthy();
                });

            });
            describe("as invalid in case it", function() {
                it("is passed a group[] of empty numbers with wanted value 11", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,11)).toBeFalsy();
                });
                it("is passed a group[] of single element numbers with wanted value 0", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,0)).toBeFalsy();
                });
                it("is passed a group[] of single element numbers with wanted value an array", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers, arrayUnit)).toBeFalsy();
                });
                it("is passed a group[] of single element numbers with wanted value a text string", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,stringUnit)).toBeFalsy();
                });
                it("is passed a group[] of single element numbers with negative lwanted value -1", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers,-1)).toBeFalsy();
                });
                it("is passed a group[] of single element numbers with undefined wanted value", function () {
                    var manyNumbers = [numberUnit, numberUnit, numberUnit];
                    expect(TypeCheck.many.numbers(manyNumbers, undefined)).toBeFalsy();
                });
            });
        });
    });
});
