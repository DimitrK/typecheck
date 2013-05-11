### TypecheckJS
***

#### Description

>Typecheck is a small library that checks the type of the variables that are passed in against a selected type. I actually wrote it mainly to explore design patterns and library creation in JavaScript while it always comes in handy when I need to resolve some tricky variable type checks.

>Currently handles check for the following types:

 >* arrays
 >* strings
 >* numbers (both stringified or not)
 >* numerics (only actuall numbers)
 >* undefined & null
 >* Inifinity
 >* functions
 >* objects

 ####Use

> In order to use typecheck include it on the head or body part of the html in a ```script``` tag once. Make sure to be included before a reference to code that needs it. You can use it to:

>* Check the type of a single variable. e.g:
```
var myObject = { someprop: "example"};
```
```
typecheck.object(myObject); //true
typecheck.array(myObject) //false
```

>* Check the the type of the variable and the length if it is an `string`, `array` or the value of a`number` or `numeric`. e.g:
```
var nameList = ['dim', 'nick', 'john'];
```
```
typecheck.array(nameList, 3); //true
typecheck.array(nameList, '<5'); //true
typecheck.array(nameList, undefined); //false
typecheck.array(6, '>5'); //true
```

>* Check the type of many variables. Also all of them can be checked against a length similar to above. e.g:
```
var myObjects = [{ someprop: "first"}, {anotherprop: "second"}];
var myStrings = ["string1", "string2", "string3"]
```
```
typecheck.many.objects(myObjects); //true
typecheck.many.arrays(myObjects) //false
```
```
typecheck.many.strings(myStrings,'>3') //length of each>3 true
typecheck.many.strings(myStrings,'!5') //true
typecheck.many.strings(myStrings,'!7') //false
```

>* Check if an object is of specific type and is empty/filled. e.g:
```
var emptyObject = {};
```
```
typecheck.empty.object(emptyObject); //true
typecheck.empty.array(emptyObject); //false
typecheck.filled.object(emptyObject); //false
```

#####Customization
>You can easily add your own types and typechecks, customize existing checks and add your own plugins like `empty`, `filled` and `many`. For this , please take a look at `docs/typecheck.html`
