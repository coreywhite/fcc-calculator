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
      this.calc.Command("1");
      assert.strictEqual(display.text, "1", "Enter 1, display 1");
      this.calc.Command("2");
      assert.strictEqual(display.text, "12", "Enter 2, display 12");
      this.calc.Command("3");
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

    QUnit.test("Plus/Minus Entry with Decimals", function(assert) {
      assert.expect(1);
      this.calc.Command("+/-");
      this.calc.Command("3");
      this.calc.Command(".");
      this.calc.Command("1");
      this.calc.Command("4");
      this.calc.Command("1");
      this.calc.Command("5");
      this.calc.Command("9");
      assert.strictEqual(display.text, "-3.14159", "Entry of negative numbers with decimals works");
    });

    QUnit.test("Clear Entry", function(assert) {
      assert.expect(1);
      this.calc.Command("1");
      this.calc.Command("0");
      this.calc.Command("CE");
      assert.strictEqual(display.text, "0", "0 after clearing entry");
    });

    QUnit.test("Clear", function(assert) {
      assert.expect(1);
      this.calc.Command("1");
      this.calc.Command("0");
      this.calc.Command("C");
      assert.strictEqual(display.text, "0", "0 after clearing");
    });

  });

  //Demonstrate individual arithmetic operators
  QUnit.module("Operators", function(hooks) {

    QUnit.test("Addition", function(assert) {
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

    QUnit.test("Subtraction with Decimals", function(assert) {
      assert.expect(4);
      this.calc.Command("9");
      this.calc.Command("9");
      this.calc.Command(".");
      this.calc.Command("9");
      assert.strictEqual(display.text, "99.9", "Enter 99.9, display 99.9");
      this.calc.Command("-");
      assert.strictEqual(display.text, "99.9", "Enter -, display 99.9");
      this.calc.Command("1");
      this.calc.Command("0");
      this.calc.Command("0");
      assert.strictEqual(display.text, "100", "Enter 100, display 100");
      this.calc.Command("=");
      assert.strictEqual(display.text, "-0.1", "Enter =, display -0.1");
    });

    QUnit.test("Multiplication with Negatives", function(assert) {
      assert.expect(5);
      this.calc.Command("1");
      this.calc.Command("6");
      assert.strictEqual(display.text, "16", "Enter 16, display 16");
      this.calc.Command("+/-");
      assert.strictEqual(display.text, "-16", "Enter +/-, display -16");
      this.calc.Command("*");
      assert.strictEqual(display.text, "-16", "Enter *, display -16");
      this.calc.Command("2");
      assert.strictEqual(display.text, "2", "Enter 2, display 2");
      this.calc.Command("=");
      assert.strictEqual(display.text, "-32", "Enter =, display -32");
    });

    QUnit.test("Integer Division", function(assert) {
      assert.expect(4);
      this.calc.Command("1");
      this.calc.Command("0");
      assert.strictEqual(display.text, "10", "Enter 10, display 10");
      this.calc.Command("/");
      assert.strictEqual(display.text, "10", "Enter /, display 10");
      this.calc.Command("5");
      assert.strictEqual(display.text, "5", "Enter 5, display 5");
      this.calc.Command("=");
      assert.strictEqual(display.text, "2", "Enter =, display 2");
    });

    QUnit.test("Division with non-Integer Results", function(assert) {
      assert.expect(4);
      this.calc.Command("1");
      this.calc.Command("0");
      assert.strictEqual(display.text, "10", "Enter 10, display 10");
      this.calc.Command("/");
      assert.strictEqual(display.text, "10", "Enter /, display 10");
      this.calc.Command("7");
      assert.strictEqual(display.text, "7", "Enter 7, display 7");
      this.calc.Command("=");
      //TODO: VERIFY THIS CALCULATOR RESULT
      assert.strictEqual(display.text, "1.4285714", "Enter =, display 1.428574");
    });

    QUnit.test("Division of Decimals", function(assert) {
      assert.expect(4);
      this.calc.Command(".");
      this.calc.Command("6");
      this.calc.Command("4");
      assert.strictEqual(display.text, "0.64", "Enter .64, display 0.64");
      this.calc.Command("/");
      assert.strictEqual(display.text, "0.64", "Enter /, display 0.64");
      this.calc.Command(".");
      this.calc.Command("4");
      assert.strictEqual(display.text, "0.4", "Enter .4, display 0.4");
      this.calc.Command("=");
      assert.strictEqual(display.text, "1.6", "Enter =, display 1.6");
    });

    QUnit.test("Square Root", function(assert) {
      assert.expect(2);
      this.calc.Command("6");
      this.calc.Command("4");
      assert.strictEqual(display.text, "64", "Enter 64, display 64");
      this.calc.Command("sqrt");
      assert.strictEqual(display.text, "8", "Enter sqrt, display 8");
    });

    QUnit.test("Square Root of Negative", function(assert) {
      assert.expect(3);
      this.calc.Command("3");
      assert.strictEqual(display.text, "3", "Enter 3, display 3");
      this.calc.Command("+/-");
      assert.strictEqual(display.text, "-3", "Enter +/-, display -3");
      this.calc.Command("sqrt");
      assert.strictEqual(display.text, "ERR", "Enter sqrt, display ERR");
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
