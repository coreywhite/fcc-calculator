var Calculator = function (maxDigits, displayCallback) {
  this.maxDigits = maxDigits;
  this.displayCallback = displayCallback;
  this.prevValue = 0;
  this.inBinaryOp = false;
  this.curOp = "";

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
    if(str.length <= this.maxDigits && parseInt(str, 10) != NaN) {
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

//Send the calculator a command
Calculator.prototype.Command = function(action) {
  //this.setDisplayString(this.getDisplayString() + action);
  switch(action) {
    case 'CE':
      this.prevValue = 0;
      this.curOp = "";
    case 'C':
      this.setDisplayString('');
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
      this.setDisplayString(this.getDisplayString() + action);
      break;
    case "+/-":
      this.setValue(this.getValue() * -1);
      break;
    case "sqrt":
      this.setValue(Math.sqrt(this.getValue()));
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
