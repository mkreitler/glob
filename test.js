test = {};

test.TestClass = new glob.NewGlob({CONSTANT_01: 3.14159265359, CONSTANT_02: "Fred ate bread."},
                                 {
                                    addTwo: function(a, b) { return a + b },
                                    area: function(r) { return r * r * test.TestClass.CONSTANT_01; },
                                    init: function() { this.msg01 = "Message 01"; },
                                    update: function(dt, dtMS) { document.writeln("" + this.msg01 + "<br>"); }
                                 });

// Test of static properties ///////////////////////////////////////////////////
test.TestClass.extendStatic({CONSTANT_03: 3});

document.writeln("1) " + test.TestClass.CONSTANT_01);
document.writeln("<br>");
document.writeln("2) " + test.TestClass.CONSTANT_02);
document.writeln("<br>");
document.writeln("3) " + test.TestClass.CONSTANT_03);
document.writeln("<br>");

testObj = new test.TestClass();
testObj.init();

// Test of instance properties /////////////////////////////////////////////////
test.TestClass.extend({color: function(c) { document.writeln("I am " + c + "."); } });

document.writeln("4) 7 + -2 = " + testObj.addTwo(7, -2));
document.writeln("<br>");
document.writeln("5) Area of circle radius 3 = " + testObj.area(3));
document.writeln("<br>");
document.writeln("6) ");
testObj.update(0, 0);
document.writeln("7) ");
testObj.color("green");
document.writeln("<br>");

// Test of init() and update() behaviors ///////////////////////////////////////

