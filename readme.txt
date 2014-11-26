This is the "Glob" engine.

It's based on the idea of "globs" -- aggregate objects that combine the behavior
of a "flat class" and composite objects.

"Flat class" means a class with static and instance members, but no support for
inheritance.

********************************************************************************
Creating New Glob Types ("classes")
********************************************************************************
To create a new glob type, you must define the behaviors it will use. You define
these as basic javascript objects, like so:

module01 = {
	addTwo: function(a, b) { return a + b },
	area: function(r) { return r * r * test.TestClass.CONSTANT_01; },
	init: function() { this.msg01 = "My message:"; },
	update: function() { document.writeln("" + this.msg01 + " "); }
};

module02 = {
   init: function() { this.myColor = "green"; },
   update: function() { document.writeln("I am " + this.myColor + ".<br>"); },
};

Then, you define the new "glob" as follows:

var myGlobType = glob.NewGlobType(null, [module01, module02]);

Then, you can create globs of this type using the 'new' operator:

var myGlob = new myGlobType();


********************************************************************************
Static Members
********************************************************************************
Like classes, globs have "class-level" properties and methods. You define these
as you do the "instance-level" properties and methods (shown above).

staticModule01 = {CONSTANT_01: 3.14159265359, CONSTANT_02: "Fred ate bread."};
staticModule02 = {CONSTANT_03: 3};

var myGlobType2 = glob.NewGlobType([staticModule01, staticModule02], [module01, module02]);

When defining a new glob type, the first argument is the list of modules that
will become static properties and methods. The second argument is the list of
modules that will become instance-level properties and methods.

To access static members, use the class like so:

console.log("My static constant is " + myGlobType2.CONSTANT_01);


********************************************************************************
Conveniences
********************************************************************************
If you have only 1 static module or class module, you can construct the new
glob type without using lists:

var myShortGlob = glob.NewGlobType(null, {myVal: 42});

You can add new instance modules to a class after construction using the
'extend' method:

var module03 = {val: 6, str: "Yup!"};

myGlobType2.extend(module03);

Similarly, you can add static modules using 'extendStatic':

var staticModule03 = {CONSTANT_04: "Pretty panda"};

myGlobType2.extendStatic(staticModule03);


********************************************************************************
Overrides, init(), and update()
********************************************************************************
Normally, if more than one module defines the same symbol, the latest definition
will override all others. For example, if you have:

module01 = {myName: "Korra", ...};
module02 = {myName: "Bolin", ...};
module03 = {myName: "Asami", ...};

and you define

var myChar = glob.NewGlobType(null, [module01, module02, module03]);

myChar.myName will be "Asami".

If you look in the console during creation, you will see warning messages that
'myName' is being overridden:

	Overriding member 'myName'!

There are two exceptions to the 'override' behavior: init(), and update().
Globs collect all 'init' and 'update' functions into a list, and call them all
in sequential order when you issue init() and update() commands.

In addition, globs automatically execute init() as part of the construction
process, so when you create a new glob:

var myGlob = new MyGlobType("Fred", "Wilma", 6 * 9);

init() gets executed with the arguments you passed into the constructor (in this
case, "Fred", "Wilma", and 54).

