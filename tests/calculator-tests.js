var display = {text: ""};

QUnit.test("Calculator Object Creation", function( assert ) {
  var calc = new Calculator(8, function(displayString) {
    $("#display").text(displayString);
  });
  assert.notEqual(typeof calc, "undefined", "A Calculator object can be created.");
});

//Set up a series of tests to demonstrate calculator behavior in response to
//sequences of command inputs.
QUnit.module("Calculator Input Sequences", {
  beforeEach: function() {
    display.text = "";
    this.calc = new Calculator(8, function(displayString) {
      display.text = displayString;
    });
  }});

//Demonstrate restriction on entering multiple zeros
QUnit.test("Zero Entry Functionality", function( assert ) {
  this.calc.Command(0);
  assert.strictEqual(display.text, "0", "Enter 0");
  this.calc.Command(0);
  assert.strictEqual(display.text, "0", "Only one zero should be displayed");
});

//Demonstrate addition
QUnit.test("Test 1 + 2 =", function( assert ) {
  assert.expect(4);
  this.calc.Command(1);
  assert.strictEqual(display.text, "1", "Enter 1, display 1");
  this.calc.Command("+");
  assert.strictEqual(display.text, "1", "Enter +, display 1");
  this.calc.Command(2);
  assert.strictEqual(display.text, "2", "Enter 2, display 2");
  this.calc.Command("=");
  assert.strictEqual(display.text, "3", "Enter =, display 3");
});

//Demonstrate simple operator chaining and two digit display
QUnit.test("Test 1 + 2 + 3 + 4 =", function( assert ) {
  assert.expect(8);
  this.calc.Command(1);
  assert.strictEqual(display.text, "1", "Enter 1, display 1");
  this.calc.Command("+");
  assert.strictEqual(display.text, "1", "Enter +, display 1");
  this.calc.Command(2);
  assert.strictEqual(display.text, "2", "Enter 2, display 2");
  this.calc.Command("+");
  assert.strictEqual(display.text, "3", "Enter +, display 3");
  this.calc.Command(3);
  assert.strictEqual(display.text, "3", "Enter 3, display 3");
  this.calc.Command("+");
  assert.strictEqual(display.text, "6", "Enter +, display 6");
  this.calc.Command(4);
  assert.strictEqual(display.text, "4", "Enter 4, display 4");
  this.calc.Command("=");
  assert.strictEqual(display.text, "10", "Enter =, display 10");
});
