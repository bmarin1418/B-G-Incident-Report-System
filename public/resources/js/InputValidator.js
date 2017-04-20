////////////////////////////////////////////////////////////////
//  InputValidator Class
////////////////////////////////////////////////////////////////

/* --- Example Usage --- */

/*
        // Create an object. For the JSON, fields are referenced by name attribute
        // see validator.js for the complete JSON format specification
        
        var inputValidator = new InputValidator('#myform_id', {
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
function InputValidator(form_id, constraints) {
    this.constraints = constraints;
    this.form_id = form_id;
    this.allowDateTimeValidation();
    
    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select")
    for (var i = 0; i < inputs.length; i++) {
        var objref = this;
        inputs.item(i).addEventListener("change", function(ev) {
            form_inputs = $(objref.form_id).serializeArray();
            form_inputs = objref.objectifyForm(form_inputs);
            var errors = validate(form_inputs, objref.constraints) || {};
            objref.showErrorsForInput(this, errors[this.name]);
        });
      }
}

//Returns a true/false value if the form is valid and shows any error messages
InputValidator.prototype.validate = function() {
    form_inputs = $(this.form_id).serializeArray();
    form_inputs = this.objectifyForm(form_inputs);
    var errors = validate(form_inputs, this.constraints);
    if (!errors) {
        return true;
    } else {
        this.showErrors($(this.form_id)[0], errors);
        return false;
    }
}

/////////////////////////////////////////////////////////////////
// Begin Private Functions
/////////////////////////////////////////////////////////////////

// Show all errors
InputValidator.prototype.showErrors = function (form, errors) {
    // We loop through all the inputs and show the errors for that input
    var objref = this;
    _.each(form.querySelectorAll("input[name], select[name]"), function (input) {
        // Since the errors can be null if no errors were found we need to handle that
        objref.showErrorsForInput(input, errors && errors[input.name]);
    });
}

// Shows the errors for a specific input field
InputValidator.prototype.showErrorsForInput = function (input, errors) {
    // This is the root of the input
    var formGroup = this.closestParent(input.parentNode, "form-group")
    // Find where the error messages will be insert into
    var messages = formGroup.querySelector(".messages");
    // First we remove any old messages and resets the classes
    this.resetFormGroup(formGroup);
    // If we have errors
    if (errors) {
        // we first mark the group has having errors
        formGroup.classList.add("has-error");
        // then we append all the errors
        var objref = this;
        _.each(errors, function (error) {
            objref.addError(messages, error);
        });
    } else {
        // otherwise we simply mark it as success
        formGroup.classList.add("has-success");
    }
}

// Recusively finds the closest parent that has the specified class
InputValidator.prototype.closestParent = function (child, className) {
    if (!child || child == document) {
        return null;
    }
    if (child.classList.contains(className)) {
        return child;
    } else {
        return this.closestParent(child.parentNode, className);
    }
}

//Get rid of any old success and error messages
InputValidator.prototype.resetFormGroup = function (formGroup) {
    // Remove the success and error classes
    //formGroup.classList.remove("has-error");
    //formGroup.classList.remove("has-success");
    // and remove any old messages
    //_.each(formGroup.querySelectorAll(".help-block.error"), function (el) {
    //    el.parentNode.removeChild(el);
    //});
}

// Adds the specified error with the following markup
// <p class="help-block error">[message]</p>
InputValidator.prototype.addError = function(messages, error) {
    var block = document.createElement("p");
    block.classList.add("help-block");
    block.classList.add("error");
    block.innerText = error;
    messages.appendChild(block);
}

//Change array of key-value ojects to a key-value map
InputValidator.prototype.objectifyForm = function(formArray) {
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
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