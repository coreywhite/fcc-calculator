var display = {text: ""};

QUnit.test("Calculator Object Creation", function( assert ) {
  var calc = new Calculator(8, function(displayString) {
    $("#display").text(displayString);
  });
  assert.notEqual(typeof calc, "undefined", "A Calculator object can be created.");
});

//Set up a series of tests to demonstrate calculator behavior in response to
//sequences of command inputs.
QUnit.module("Calculator Input Sequences", function(hooks) {

  hooks.beforeEach(function(assert) {
    display.text = "";
    this.calc = new Calculator(8, function(displayString) {
      display.text = displayString;
    });
  });

  QUnit.module("Numeric Entry", function(hooks) {

    QUnit.test("Basic Numeric Entry", function(assert) {
      assert.expect(1);
      this.calc.Command("1");
      assert.strictEqual(display.text, "1", "Enter 1, display 1");
    });

    QUnit.test("Multiple Digit Entry", function(assert) {
      assert.expect(3);
      this.calc.Command(1);
      assert.strictEqual(display.text, "1", "Enter 1, display 1");
      this.calc.Command(2);
      assert.strictEqual(display.text, "12", "Enter 2, display 12");
      this.calc.Command(3);
      assert.strictEqual(display.text, "123", "Enter 3, display 123");
    });

    QUnit.test("Maximum digit restriction", function(assert) {
      assert.expect(1);
      this.calc.Command("1");
      this.calc.Command("2");
      this.calc.Command("3");
      this.calc.Command("4");
      this.calc.Command("5");
      this.calc.Command("6");
      this.calc.Command("7");
      this.calc.Command("8");
      this.calc.Command("9");
      assert.strictEqual(display.text, "12345678", "Display first 8 digits");
    });

    QUnit.test("Multiple Zero Entry Restriction", function(assert) {
      assert.expect(2);
      this.calc.Command("0");
      assert.strictEqual(display.text, "0", "Enter 0, Display 0");
      this.calc.Command("0");
      assert.strictEqual(display.text, "0", "Only one zero should be displayed");
    });

    QUnit.test("Decimal Entry", function(assert) {
      assert.expect(1);
      this.calc.Command(".");
      this.calc.Command("1");
      this.calc.Command(".");
      this.calc.Command("2");
      this.calc.Command(".");
      this.calc.Command("3");
      this.calc.Command(".");
      this.calc.Command("4");
      this.calc.Command(".");
      this.calc.Command("5");
      this.calc.Command(".");
      this.calc.Command("6");
      this.calc.Command(".");
      this.calc.Command("7");
      this.calc.Command(".");
      this.calc.Command("8");
      this.calc.Command(".");
      this.calc.Command("9");
      assert.strictEqual(display.text, "0.1234567", "Display only a single decimal point and up to MaxDigits - 1 digits to the right");
    });

    QUnit.test("Plus/Minus Entry", function(assert) {
      assert.expect(2);
      this.calc.Command("1");
      this.calc.Command("0");
      this.calc.Command("+/-");
      this.calc.Command("+/-");
      assert.strictEqual(display.text, "10", "Entry of negative numbers works correctly");
      this.calc.Command("+/-");
      this.calc.Command("0");
      assert.strictEqual(display.text, "-100", "Entry of negative numbers works correctly");
    });



  });

  QUnit.module("Operators", function(hooks) {

    //Demonstrate addition
    QUnit.test("Test 1 + 2 =", function(assert) {
      assert.expect(4);
      this.calc.Command("1");
      assert.strictEqual(display.text, "1", "Enter 1, display 1");
      this.calc.Command("+");
      assert.strictEqual(display.text, "1", "Enter +, display 1");
      this.calc.Command("2");
      assert.strictEqual(display.text, "2", "Enter 2, display 2");
      this.calc.Command("=");
      assert.strictEqual(display.text, "3", "Enter =, display 3");
    });
  });

  QUnit.module("Binary Operator Chains", function(hooks) {
    //Demonstrate simple operator chaining and two digit display
    QUnit.test("Test 1 + 2 + 3 + 4 =", function(assert) {
      assert.expect(8);
      this.calc.Command("1");
      assert.strictEqual(display.text, "1", "Enter 1, display 1");
      this.calc.Command("+");
      assert.strictEqual(display.text, "1", "Enter +, display 1");
      this.calc.Command("2");
      assert.strictEqual(display.text, "2", "Enter 2, display 2");
      this.calc.Command("+");
      assert.strictEqual(display.text, "3", "Enter +, display 3");
      this.calc.Command("3");
      assert.strictEqual(display.text, "3", "Enter 3, display 3");
      this.calc.Command("+");
      assert.strictEqual(display.text, "6", "Enter +, display 6");
      this.calc.Command("4");
      assert.strictEqual(display.text, "4", "Enter 4, display 4");
      this.calc.Command("=");
      assert.strictEqual(display.text, "10", "Enter =, display 10");
    });
  });
});
