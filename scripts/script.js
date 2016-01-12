var Calculator = function (maxDigits, displayCallback) {
  this.maxDigits = maxDigits;
  this.displayCallback = displayCallback;
  this.storedVal = 0;
  this.curOp = null;
  this.equalOp = function(val) {return val;};
  this.needsOperand = false;
  this.allowAppend = true;
  this.isError = false;
  this.isNegative = false;
  var digits = [0];
  var decimalOffset;

  this.initState = function() {
    digits = [0];
    decimalOffset = (function () { return; })();
    this.isNegative = false;
    this.isError = false;
  }

  //Attempt to set the current display value
  this.setValue = function(newVal) {
    //Check for a valid value
    if (typeof newVal !== "number" || isNaN(newVal)
      || Math.abs(newVal) >= Math.pow(10, this.maxDigits) ) {
      this.isError = true;
      return false;
    }
    this.isNegative = (newVal < 0);
    newVal = Math.abs(newVal);
    //Find the length of the number before the decimal point
    decimalOffset = newVal.toFixed(this.maxDigits).indexOf('.');
    //Get value as string, limiting to no more than maxDigits characters
    var valAsString = newVal.toString(10).replace(/\D/g,'')
    //Split the first maxDigit characters of the string into an integer array
    digits = valAsString.substr(0, this.maxDigits).split('').map(Number);
    this.allowAppend = false;
    return (typeof digits === "object");
  };

  //Convert the current display digits to a numeric value and return it
  this.getValue = function() {
    var retVal = 0;
    //Determine decimal offset to use (default to after the number if none set)
    var offset = decimalOffset || digits.length;
    //Convert digits to base 10 number
    for (var i = 0; i < digits.length; i++) {
      retVal += digits[i] * Math.pow(10, offset - i - 1);
    }
    //Make negative if required
    if(this.isNegative) {
      retVal *= -1;
    }
    return retVal;
  };

  //Attempt to add a decimal place to the current display value
  this.addDecimal = function() {
    //Check that decimalOffset has not already been set.
    if(typeof decimalOffset !== "undefined") {
      return false;
    }
    decimalOffset = digits.length;
    return true;
  };

  //Attempt to add a digit to the current display value
  this.addDigit = function(digit) {
    //Check for invalid digit parameter
    if(digit !== parseInt(digit) || digit < 0 || digit > 9) {
      return false;
    }
    //Check if already at or exceeding maximum number of digits
    if(digits.length >= this.maxDigits){
      return false;
    }
    //Zero requires special handling when there is no set decimal point
    if(digits[0] === 0 && typeof decimalOffset === "undefined"){
      digits[0] = digit;
    } else {
      digits.push(digit);
    }
    return true;
  };

  //Update the display
  this.Display = function() {
    this.displayCallback(digits, decimalOffset || digits.length, this.isNegative, this.isError);
  };

};

//Function to clear the display
Calculator.prototype.ClearDisplay = function() {
  this.initState();
  this.allowAppend = true;
};

//Function to truncate a value
Calculator.prototype.GetTruncatedValue = function(value) {
  return Number(value.toFixed(this.maxDigits).slice(0, -1));
};


Calculator.prototype.ExecuteBinaryOp = function() {
  var stored = this.storedVal;
  var cur = this.GetTruncatedValue(this.getValue());
  switch (this.curOp) {
    case "+":
      var result = stored + cur;
      this.equalOp = function(val) {return val + cur;};
      break;
    case "-":
      var result = stored - cur;
      this.equalOp = function(val) {return val - cur;};
      break;
    case "*":
      var result = stored * cur;
      this.equalOp = function(val) {return stored * val;};
      break;
    case "/":
      var result = stored / cur;
      this.equalOp = function(val) {return val / cur;};
      break;
    default:
      return false;
  }
  this.storedVal = this.GetTruncatedValue(result);
  this.setValue(this.storedVal);
  this.curOp = null;
};
//
// Calculator.prototype.BinaryOperation = function(op) {
//   if(!this.needsOperand) {
//     this.storedVal = this.Calculate();
//     this.needsOperand = true;
//   }
//   switch (op) {
//     case "+":
//       this.curOperation = function(a, b) {return a + b;};
//       break;
//     case "-":
//       this.curOperation = function(a, b) {return a - b;};
//       break;
//     case "*":
//       this.curOperation = function(a, b) {return a * b;};
//       break;
//     case "/":
//       this.curOperation = function(a, b) {return a / b;};
//       break;
//   }
//   this.lastOp = op;
// };

//Function to execute the current operation
Calculator.prototype.Calculate = function() {
  var result = this.GetTruncatedValue(this.curOperation(this.storedVal, this.getValue()));
  this.setValue(result);
  this.allowAppend = false;
  return result;
};

//Send the calculator a command
Calculator.prototype.Command = function(action) {
  switch(action) {

    //Handle clears:
    case 'C':
      this.curOp = null;
      this.storedVal = 0;
    case 'CE':
      this.ClearDisplay();
      break;

    //Handle numeric entries:
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      if(!this.allowAppend) {
        this.ClearDisplay();
      }
      this.addDigit(parseInt(action));
      this.allowAppend = true;
      this.needsOperand = false;
      break;

    case ".":
      if(!this.allowAppend) {
        this.ClearDisplay();
      }
      this.addDecimal()
      this.allowAppend = true;
      this.needsOperand = false;
      break;

    //Handle unary operations:
    case "+/-":
      this.needsOperand = false;
      this.isNegative = !this.isNegative;
      break;
    case "sqrt":
      this.setValue(this.GetTruncatedValue(Math.sqrt(this.getValue())));
      this.needsOperand = false;
      this.allowAppend = false;
      break;

    //Handle binary operators. If the calculator currently needs an operand,
    //repeated binary operators should replace the current operator without
    //calculating. Otherwise, perform the calculation with the current value.
    case "+":
    case "-":
    case "*":
    case "/":
      if(this.curOp === null) {
        this.storedVal = this.getValue();
      } else if (!this.needsOperand) {
        this.ExecuteBinaryOp();
      }
      this.needsOperand = true;
      this.curOp = action;
      this.allowAppend = false;
      break;

    //Handle equality:
    case "=":
      if (this.curOp) {
        this.ExecuteBinaryOp();
      } else {
        this.setValue(this.GetTruncatedValue(this.equalOp(this.getValue())));
      }
      break;
  }
  this.Display();
};


//*********************************************************************
//* Run code when page is ready
//*********************************************************************
$(document).ready(function() {

  calc = new Calculator(8, function(digitsArray, decimalOffset, isNeg, isErr) {
    if (isErr) {
      var displayString = "Err"
    } else {
      var displayString = isNeg ? "-" : "";
      displayString += digitsArray.slice(0, decimalOffset).join('');
      displayString += '<span class="decimal">.</span>';
      displayString += digitsArray.slice(decimalOffset, digitsArray.length).join('');
    }
    $("#display").html(displayString);
  });

  calc.Display();

  //Bind button clicks to calculator commands
  $(".btn-calculator").click(function() {
    console.log($(this).attr("data-action"));
    calc.Command($(this).attr("data-action"));
  });
});
