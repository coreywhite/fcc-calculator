var Calculator = function (maxDigits, displayCallback) {
  this.maxDigits = maxDigits;
  this.displayCallback = displayCallback;
  this.curFunction = function(val) {return val;};
  this.isResult = false;
  this.isEditable = true;

  //Track the calculator's current value and display string.
  //These are private member variables to keep them tied together.
  var _value = 0;
  var _display = "";
  this.getDisplayString = function() {return _display;};
  this.getValue = function() {return _value;};

  //Helper method to set the value, as long as the number fits in the display.
  this.setValue = function(val) {
    var valSize = Math.round(Math.abs(val)).toString(10).length;
    if(isNaN(val)) {
      _value = NaN;
      _display = "ERR";
      return _value;
    } else if(valSize <= this.maxDigits) {
      _value = val;
      var charsToDisplay  = this.maxDigits;
      charsToDisplay += (_value < 0) ? 1 : 0;
      charsToDisplay += (_value != Math.round(_value) && valSize < this.maxDigits) ? 1 : 0;
      _display = val.toString(10).substring(0, charsToDisplay);
      return _value;
    } else {
      return false;
    }
  };

  //Helper method to set the display string to an integer and update the value
  this.setDisplayString = function(str) {
    if(str.length <= this.maxDigits && !isNaN(parseInt(str, 10))) {
      _value = parseInt(str, 10);
      _display = str;
      return _display;
    } else if(str === "") {
      _value = 0;
      _display = str;
      return _display;
    } else {
      return false;
    }
  };
};

//Update the display
Calculator.prototype.Display = function() {
  this.displayCallback(this.getDisplayString());
};

//Clear the display
Calculator.prototype.ClearDisplay = function() {
  this.setDisplayString('');
  this.isEditable = true;
};

//Add a digit or decimal place
Calculator.prototype.AddDigit = function(digit) {
  if(!isNaN(parseInt(digit, 10))) {
    this.setDisplayString(this.getDisplayString() + digit);
  } else if(digit === "." && this.getDisplayString().indexOf('.') == -1){
    this.setDisplayString(this.getDisplayString() + digit);
  } else {
    return false;
  }
  return true;
};

//Replace the current value with the result of the current function
Calculator.prototype.Calculate = function() {
  this.setValue(this.curFunction(this.getValue()));
  this.isResult = true;
  this.isEditable = false;
  return this.getValue();
}

//Send the calculator a command
Calculator.prototype.Command = function(action) {
  var _val = this.getValue();
  switch(action) {
    case 'C':
      this.curFunction = function(val) {return val;};
    case 'CE':
      this.ClearDisplay();
      break;
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case ".":
      if(!this.isEditable) {
        this.ClearDisplay();
      }
      this.isResult = false;
      this.AddDigit(action);
      break;
    case "+/-":
      this.isResult = false;
      this.setValue(_val * -1);
      break;
    case "sqrt":
      this.setValue(Math.sqrt(_val));
      this.isEditable = false;
      this.isResult = false;
      break;
    //Handle binary operators:
    case "+":
      var opFunc = function(a, b) {return a + b;};
    case "-":
      if(typeof opFunc === "undefined"){var opFunc = function(a, b) {return a - b;};}
    case "*":
      if(typeof opFunc === "undefined"){var opFunc = function(a, b) {return a * b;};}
    case "/":
      if(typeof opFunc === "undefined"){var opFunc = function(a, b) {return a / b;};}
      if(!this.isResult) {
        _val = this.Calculate();
      }
      this.curFunction = (function() {return function(val) {return opFunc(_val, val);};})();
      break;
    //Handle equality:
    case "=":
      _val = this.Calculate();
      break;
  }
  this.Display();
};


//*********************************************************************
//* Run code when page is ready
//*********************************************************************
$(document).ready(function() {

  //Create object for the calculator
  calc = new Calculator(8, function(displayString) {
    $("#display").text(displayString);
  });

  calc.Display();

  //Bind button clicks to calculator commands
  $(".btn-calculator").click(function() {
    console.log($(this).data("action"));
    calc.Command($(this).data("action"));
  });
});
