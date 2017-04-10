////////////////////////////////////////////////////////////////
//  InputValidator Class
////////////////////////////////////////////////////////////////

/* --- Example Usage --- */

/*
        // Create an object. For the JSON, fields are referenced by name attribute
        // see validator.js for the complete JSON format specification
        
        var inputValidator = new InputValidator({
            name: {
              presence: true
            },
            date: {
              presence: true,
              date: {dateTime: true}
            },
            staff: {
              presence: true
            }
        });
        
        if (inputValidator.validate()) {
            //send the form to the server
        }
*/

////////////////////////////////////////////////////////////////
// Begin Public Functions
////////////////////////////////////////////////////////////////

//See validation.js for the JSON format of constraints
function InputValidator(constraints) {
    this.constraints = constraints;
    this.allowDateTimeValidation();
}

//Returns a true/false value if the form is valid and shows any error messages
InputValidator.prototype.validate = function() {
    form_inputs = $(FORM_ID).serializeArray();
    form_inputs = this.objectifyForm(form_inputs);
    var errors = validate(form_inputs, this.constraints);
    if (!errors) {
        return true;
    } else {
        this.displayInputHints(errors);
        return false;
    }
}

/////////////////////////////////////////////////////////////////
// Begin Private Functions
/////////////////////////////////////////////////////////////////

//Change array of key-value ojects to a key-value map
InputValidator.prototype.objectifyForm = function(formArray) {
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
} 

//Displays messages about bad inputs
InputValidator.prototype.displayInputHints = function(errors) {
    if (errors) {
        console.log('TODO: Display hints');
    } else {
        console.log('Unable to display input hints, no validation issues detected');
    }
}

//Extends input validator.js to to include dates
InputValidator.prototype.allowDateTimeValidation = function() {
    validate.extend(validate.validators.datetime, {
        // The value is guaranteed not to be null or undefined but otherwise it
        // could be anything.
        parse: function(value, options) {
            return +moment.utc(value);
        },
    
        // Input is a unix timestamp
        format: function(value, options) {
            var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
            return moment.utc(value).format(format);
        }
    });
}