//
//<script>
//
/* @package Validators corresponding to property data types and stand rule edit validates
 */
/***************************************************************
 *  Title: Validators corresponding to property data types
 *
 ***************************************************************/
/**
    Type declarations 
 */
{
    /* Decimal */
    var numeric_decimal = new validation_ValidationType("decimal", numeric_isDecimal);
    numeric_decimal.addEventFunction("onchange", numeric_isDecimal);
  
    /* Uncomment this code to enable filtering
    numeric_decimal.addEventFunction("onkeypress", numeric_filterKeyPress);
    */

    /* Integer */
    var numeric_integer = new validation_ValidationType("integer", numeric_isInteger);
    numeric_integer.addEventFunction("onchange", numeric_isInteger);

    /* Uncomment this code to enable filtering
    numeric_integer.addEventFunction("onkeypress", numeric_filterKeyPress);
    */

    /* Double */

    var numeric_double = new validation_ValidationType("double", numeric_isDouble);
    numeric_double.addEventFunction("onchange", numeric_isDouble);

    /* Uncomment this code to enable filtering
    numeric_double.addEventFunction("onkeypress", numeric_filterKeyPress);
    */

    /* Text */
    var text_text = new validation_ValidationType("text", text_isText);

    /* Password */
    var text_password = new validation_ValidationType("password", text_isPassword);

    /* Identifier */
    var text_identifier = new validation_ValidationType("identifier", text_isIdentifier);

    /* Boolean */
    var boolean_truefalse = new validation_ValidationType("truefalse", boolean_isTruefalse);
    boolean_truefalse.addEventFunction("onchange", boolean_isTruefalse);

    /*banea1 - BUG-43671 - start*/
    /* Date */
    var date_date = new validation_ValidationType("date", date_isDate);
    date_date.addEventFunction("onchange", date_isDate);
    var date_dateDD = new validation_ValidationType("datedd", date_isDateDropDown);

    /* Uncomment this code to enable filtering
    date_date.addEventFunction("onkeypress", date_filterKeyPress);
    */

    /* Time of Day */
    var date_timeofday = new validation_ValidationType("timeofday", time_isTimeOfDay);
    date_timeofday.addEventFunction("onchange", time_isTimeOfDay);
    var date_timeofdayDD = new validation_ValidationType("timeofdaydd", time_isTimeOfDayDropDown);

    /* Uncomment this code to enable filtering
    date_timeofday.addEventFunction("onkeypress", time_filterKeyPress);
    */

    /* Date Time */
    var date_datetime = new validation_ValidationType("datetime", date_isDateTime);
    date_datetime.addEventFunction("onchange", date_isDateTime);

    var time_mininterval = new validation_ValidationType("mininterval", time_validateMinInterval);
    time_mininterval.addEventFunction("onchange", time_validateMinInterval);

    var day_disabledWeekend = new validation_ValidationType("disabledweekend", day_validateDisabledWeekend);
    day_disabledWeekend.addEventFunction("onchange", day_validateDisabledWeekend);

    var date_datetimeDD = new validation_ValidationType("datetimedd", date_isDateTimeDropDown);

    /* File */
    var file_file = new validation_ValidationType("file", file_isFile);
    file_file.addEventFunction("onchange", file_isFile);

    /* Uncomment this code to enable filtering
    date_datetime.addEventFunction("onkeypress", time_filterKeyPress);
    */

    /* Required */
    var required_required = new validation_ValidationType("required", required_isFilled);

    required_required.addEventFunction("onblur", required_isFilled);
    required_required.addEventFunction("onchange", required_isFilled);

    /* Phone Number */
    var phone_phone = new validation_ValidationType("phone", phone_isPhone);
    phone_phone.addEventFunction("onchange", phone_isPhone);
    phone_phone.addEventFunction("onkeypress", phone_filterKeyPress);

    /** Rule-Edit-Validate error messages */

    /* IsPosDecimal */
    var ruleEditValidate_posDecimal = new validation_ValidationType("isposdecimal", ruleEditValidate_isPosDecimal);
    ruleEditValidate_posDecimal.addEventFunction("onblur", ruleEditValidate_isPosDecimal);
    ruleEditValidate_posDecimal.addEventFunction("onchange", ruleEditValidate_isPosDecimal);

    /* IsNonNegative */
    var ruleEditValidate_nonNegative = new validation_ValidationType("isnonnegative", ruleEditValidate_isNonNegative);
    ruleEditValidate_nonNegative.addEventFunction("onchange", ruleEditValidate_isNonNegative);

    /* IsNonNegativeInteger */
    var ruleEditValidate_nonNegativeInteger = new validation_ValidationType("isnonnegativeinteger", ruleEditValidate_isNonNegativeInteger);
    ruleEditValidate_nonNegativeInteger.addEventFunction("onchange", ruleEditValidate_isNonNegativeInteger);

    /* IsUrgencyValue */
    var ruleEditValidate_urgencyValue = new validation_ValidationType("isurgencyvalue", ruleEditValidate_isUrgencyValue);
    ruleEditValidate_urgencyValue.addEventFunction("onchange", ruleEditValidate_isUrgencyValue);

    /* ValidEmailAddress */
    var ruleEditValidate_validEmailAddress = new validation_ValidationType("validemailaddress", ruleEditValidate_isValidEmailAddress);
    ruleEditValidate_validEmailAddress.addEventFunction("onchange", ruleEditValidate_isValidEmailAddress);

    /* ValidPhoneNubmer */
    var ruleEditValidate_validPhoneNumber = new validation_ValidationType("validphonenumber", ruleEditValidate_isValidPhoneNumber);
    ruleEditValidate_validPhoneNumber.addEventFunction("onchange", ruleEditValidate_isValidPhoneNumber);

    /* IsFutureDate */
    var ruleEditValidate_futureDate = new validation_ValidationType("isfuturedate", ruleEditValidate_isFutureDate);
    ruleEditValidate_futureDate.addEventFunction("onchange", ruleEditValidate_isFutureDate);

    /* IsNotFutureDate */
    var ruleEditValidate_notFutureDate = new validation_ValidationType("notfuturedate", ruleEditValidate_isNotFutureDate);
    ruleEditValidate_notFutureDate.addEventFunction("onchange", ruleEditValidate_isNotFutureDate);

    /* AlphabeticValidation */
    var ruleEditValidate_alphabetic = new validation_ValidationType("alphabeticvalidation", ruleEditValidate_isAlphabetic);
    ruleEditValidate_alphabetic.addEventFunction("onchange", ruleEditValidate_isAlphabetic);

    /* AlphaNumericValidation */
    var ruleEditValidate_alphaNumeric = new validation_ValidationType("alphanumericvalidation", ruleEditValidate_isAlphaNumeric);
    ruleEditValidate_alphaNumeric.addEventFunction("onchange", ruleEditValidate_isAlphaNumeric);

    /* AlphaNumericSpaceValidation */
    var ruleEditValidate_alphaNumericSpace = new validation_ValidationType("alphanumericspacevalidation", ruleEditValidate_isAlphaNumericSpace);
    ruleEditValidate_alphaNumericSpace.addEventFunction("onchange", ruleEditValidate_isAlphaNumericSpace);
}

// These messages are copied from csvalid fragment to reduce the size of the fragment

//<%--=====================NUMERIC========================
// error message strings for min --%>

var numeric_minMsgStr1 = "The field '";
var numeric_minMsgStr2 = "' should be greater than ";
var numeric_minMsgStr3 = ".";

//<%-- error message strings for max --%>

var numeric_maxMsgStr1 = "The field '";
var numeric_maxMsgStr2 = "' should be less than ";
var numeric_maxMsgStr3 = ".";
//<%-- error message strings for lessThan --%>

var numeric_lessThanMsgStr1 = "The field '";
var numeric_lessThanMsgStr2 = "' should be less than the field '";
var numeric_lessThanMsgStr3 = "'.";

//<%-- error message strings for less than equal --%>

var numeric_lessThanEqualMsgStr1 = "The field '";
var numeric_lessThanEqualMsgStr2 = "' should be less than or equal to the field '";
var numeric_lessThanEqualMsgStr3 = "'.";

//<%-- error message strings for less than equal --%>

var numeric_greaterThanMsgStr1 = "The field '";
var numeric_greaterThanMsgStr2 = "' should be greater than the field '";
var numeric_greaterThanMsgStr3 = "'.";

//<%-- error message strings for less than equal --%>

var numeric_greaterThanEqualMsgStr1 = "The field '";
var numeric_greaterThanEqualMsgStr2 = "' should be greater than or equal to the field '";
var numeric_greaterThanEqualMsgStr3 = "'.";

//<%--=====================FILE========================
// error message strings for file --%>

var file_FileMsgStr1 = "";
var file_FileMsgStr2 = "Please choose a file of type: ";

//<%--=====================SELECT========================
// error meessage string for required selections --%>

var select_reqSelMsgStr1 = " The field '";
var select_reqSelMsgStr2 = "' must have exactly ";
var select_reqSelMsgStr3 = " options selected.";

//<%-- error meessage string for minimum selections --%>

var select_minSelMsgStr1 = " The field '";
var select_minSelMsgStr2 = "' must have a minimum of ";
var select_minSelMsgStr3 = " options selected.";

//<%--error meessage string for maximum selections --%>

var select_maxSelMsgStr1 = " The field '";
var select_maxSelMsgStr2 = "' must have not have more than ";
var select_maxSelMsgStr3 = " options selected.";

//<%--==================LENGTH================================
// error message strings for length --%>

var length_lengthMsgStr1 = "The field '";
var length_lengthMsgStr2 = "' should be ";
var length_lengthMsgStr3 = " characters long.";

// var length_minCharsMsg1 = "The field '";
// var length_minCharsMsg2 = "' should be atleast ";
// var length_minCharsMsg3 = " characters long.";

//<%--=====================PHONE========================
// error message strings for phone --%>


var phone_phoneMsgStr1 = "The field '";
var phone_phoneMsgStr2 = "' is not a valid phone number.";

//<%-- error meessage string for beforedate --%>

var date_beforeDateMsgStr1 = "The field '";
var date_beforeDateMsgStr2 = "' should be earlier than the field '";
var date_beforeDateMsgStr3 = "'.";

//<%-- error meessage string for afterdate --%>

var date_afterDateMsgStr1 = "The field '";
var date_afterDateMsgStr2 = "' should be later than the field '";
var date_afterDateMsgStr3 = "'.";

//<%-- error meessage string for time after --%>

var time_afterTimeMsgStr1 = "The field '";
var time_afterTimeMsgStr2 = "' should be later than the field '";
var time_afterTimeMsgStr3 = "'.";

//<%-- error meessage string for time before --%>

var time_beforeTimeMsgStr1 = "The field '";
var time_beforeTimeMsgStr2 = "' should be earlier than the field '";
var time_beforeTimeMsgStr3 = "'.";

/*
@private- Validate Integer
@param $String$val - Input Value
@return $Boolean$ - The given value is integer or not
  - Utility functions for validate integer  
*/

function validate_isInteger(val) {
    var digits = "1234567890";
    for (var i = 0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

/*
@private- Utility functions for check the numbers are non-latin
@param $String$val - Input Value
@return $Boolean$ - The given value is a latin number or not 
*/

function validate_containsNonLatinNumbers(val) {
    var regNonLatin = /^[\u0000-\u0600\u06FF-\u0900\u097F-\u9FFF]+$/;
    if (regNonLatin.test(val)) {
        return false;
    }
    return true;
}

/*
@private- Get the corresponding integer based on str and index
This function returns the corresponding integer value from the str and index
@param $String$str - Input Value
@param $int$i - Index
@param $String$minlength - Minimum length
@param $String$maxlength - Maximum length
@return $String$token - Integer value from the str and index 
*/

function validate_getInt(str, i, minlength, maxlength) {
    for (var x = maxlength; x >= minlength; x--) {
        var token = str.substring(i, i + x);
        if (token.length < minlength) {
            return null;
        }
        if (validate_isInteger(token)) {
            return token;
        }
    }
    return null;
}

/*
@private- Get the date format
This function takes a date string and a format string. It matches If the date string matches the format string, it returns true.If it does not match, it returns false.
@param $String$val - Date String
@param $String$format - Date format
@return $boolean$ - Valid date time
*/

function getDateFromFormat(val, format, reqDateObj) {
    // Some of the locales are using different characters for numbers
    // In this case client validation will not happen
    if (validate_containsNonLatinNumbers(val)) {
        return true;
    }

    // Convert val and format to string
    val = val + "";
    format = format + "";

    // Index values to locate the value and format
    var i_val = 0;
    var i_format = 0;

    // Character and token to compare
    var c = "";
    var token = "";

    // Minimum and maximum digits of the year
    var x, y;

    // Store the day of week
    var day_name = "";
    var month_name = "";

    // Date instance to initialize date variables, not for validation
    var now = new Date();

    // Initialize date varibales
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = 1;
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var milliSec = now.getMilliseconds();
    var ampm = "";

    // Loop through the format string
    while (i_format < format.length) {
        // Get next token from format string
        // For e.g. : 'y'
        c = format.charAt(i_format);

        // Reset the token
        token = "";

        // Scan the format string until it finds the full token
        while (format.charAt(i_format) == c && i_format < format.length) {
            // Collect the format
            // For e.g. 
            // c = 'y'
            // token = 'y' - next character = 'y' - ok
            // token = 'yy' - next character = 'y' - ok
            // token = 'yyy' - next character = 'y' - ok
            // token = 'yyyy' - next character = ' ' - return the token 'yyyy'
            token += format.charAt(i_format++);
        }

        // Extract contents of value based on format token

        // Compare the token with the corresponding value part
        if (val.substring(i_val, i_val + token.length) == token && val.substring(i_val, i_val + token.length) != "a") {
            // Increase the index to get the next token if the year is valid
            i_val += token.length;
        }

        // Format for year
        else if (token == "yyyy" || token == "yy" || token == "y") {
                // Long year
                if (token == "yyyy") {
                    x = 4;
                    y = 4;
                }

                // Short year
                if (token == "yy") {
                    x = 2;
                    y = 2;
                }

                // Long year or short year
                if (token == "y") {
                    x = 2;
                    y = 4;
                }

                // Get the year as an integer value
                year = validate_getInt(val, i_val, x, y);

                /* Subtract 543 if the locale is Thai (th_TH) - HFIX-4964, BUG-203013 */
                if (typeof pega.u.d.Locale != 'undefined' && pega.u.d.Locale == 'th_TH') {
                    year -= 543;
                }

                // For invalid years, return false
                if (year == null) {
                    return false;
                }

                // Increase the index to get the next token if the year is valid
                i_val += year.toString().length;

                // Reformat the year
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    } else {
                        year = 2000 + (year - 0);
                    }
                }
            }

            // Format for month
            else if (token == "MMMM" || token == "MMM") {
                    // Initialize the month
                    month = 0;

                    // Scan through the months array to match the month
                    for (var i = 0; i < months.length; i++) {
                        // Get the long month from the array
                        if (token == "MMMM") {
                            month_name = months[i];
                        }

                        // Get the short month from the array
                        else if (token == "MMM") {
                                var month_name = months[i].substring(0, 3);
                            }

                        // Compare the user entered month with the array
                        if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                            // Set the month
                            month = i + 1;

                            // Set the month value properly
                            if (month > 12) {
                                month -= 12;
                            }

                            // Increase the index to get the next token if the month is valid
                            i_val += month_name.length;
                            break;
                        }
                    }
                    // For invalid months return false
                    if (month < 1 || month > 12) {
                        return false;
                    }
                }

                // Format the day of week
                else if (token == "EEEE" || token == "EE" || token == "E") {
                        // Scan through the weekdays array to match the day of week
                        for (var i = 0; i < weekdays.length; i++) {
                            // Get the day of week from array
                            day_name = weekdays[i];

                            // Check for empty day names
                            if (day_name != "") {
                                // Compare the user entered day of week with the array
                                if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                    // Increase the index to get the next token if the day of week is valid
                                    i_val += day_name.length;
                                    break;
                                }
                            }
                        }
                    }

                    // Format for short month
                    else if (token == "MM" || token == "M") {
                            // Get the numeric value of the month
                            month = validate_getInt(val, i_val, 1, 2);

                            // Validate the month
                            if (month == null || month < 1 || month > 12) {
                                return false;
                            }

                            // Increase the index to get the next token if the month is valid
                            i_val += month.length;
                        }

                        // Format for date
                        else if (token == "dd" || token == "d") {
                                // Get the numeric value of the date
                                date = validate_getInt(val, i_val, 1, 2);

                                // Validate the date
                                if (date == null || date < 1 || date > 31) {
                                    return false;
                                }

                                // Increase the index to get the next token if the date is valid
                                i_val += date.length;
                            }

                            // Format for hours (1-12)
                            else if (token == "hh" || token == "h") {
                                    // Get the numeric value of the hours
                                    hh = validate_getInt(val, i_val, 1, 2);

                                    // Validate the hour
                                    if (hh == null || hh < 0 || hh > 12) {
                                        return false;
                                    }

                                    // Increase the index to get the next token if the hours is valid
                                    i_val += hh.length;
                                }

                                // Format for hours (0-23)
                                else if (token == "HH" || token == "H") {
                                        // Get the numeric value of the hours
                                        hh = validate_getInt(val, i_val, 1, 2);

                                        // Validate the hour
                                        if (hh == null || hh < 0 || hh > 23) {
                                            return false;
                                        }

                                        // Increase the index to get the next token if the hours is valid
                                        i_val += hh.length;
                                    }

                                    // Format for hours (0-11)
                                    else if (token == "KK" || token == "K") {
                                            // Get the numeric value of the hours
                                            hh = validate_getInt(val, i_val, token.length, 2);

                                            // Validate the hour
                                            if (hh == null || hh < 0 || hh > 11) {
                                                return false;
                                            }

                                            // Increase the index to get the next token if the hours is valid
                                            i_val += hh.length;
                                        }

                                        // Format for hours (1-24)
                                        else if (token == "kk" || token == "k") {
                                                // Get the numeric value of the hours
                                                hh = validate_getInt(val, i_val, token.length, 2);

                                                // Validate the hour
                                                if (hh == null || hh < 1 || hh > 24) {
                                                    return false;
                                                }

                                                // Increase the index to get the next token if the hours is valid
                                                i_val += hh.length;
                                                hh--;
                                            }

                                            // Format for minutes
                                            else if (token == "mm" || token == "m") {
                                                    // Get the numeric value of the minutes
                                                    mm = validate_getInt(val, i_val, 1, 2);

                                                    // Validate the minutes
                                                    if (mm == null || mm < 0 || mm > 59) {
                                                        return false;
                                                    }

                                                    // Increase the index to get the next token if the minutes is valid
                                                    i_val += mm.length;
                                                }

                                                // Format for seconds
                                                else if (token == "ss" || token == "s") {
                                                        // Get the numeric value of the seconds
                                                        ss = validate_getInt(val, i_val, 1, 2);

                                                        // Validate the seconds
                                                        if (ss == null || ss < 0 || ss > 59) {
                                                            return false;
                                                        }

                                                        // Increase the index to get the next token if the seconds is valid
                                                        i_val += ss.length;
                                                    }

                                                    // Format for AM/PM
                                                    else if (token == "a") {
                                                            // Check for AM value with the array
                                                            if(amPmStrings && amPmStrings[1] && typeof amPmStrings[1] === "string" && amPmStrings[1].indexOf(".") !== -1) {
                                                              if (val.substring(i_val, i_val + 5).toLowerCase() == amPmStrings[0].toLowerCase()) {
                                                              ;
                                                                ampm = amPmStrings[0];
                                                              } else if (val.substring(i_val, i_val + 5).toLowerCase() == amPmStrings[1].toLowerCase()) {
                                                              ;
                                                                ampm = amPmStrings[1];
                                                              }
                                                            }
                                                            else if (val.substring(i_val, i_val + amPmStrings[0].length).toLowerCase() == amPmStrings[0].toLowerCase()) {
                                                                ampm = amPmStrings[0];
                                                            }

                                                            // Check from PM value with the array
                                                            else if (val.substring(i_val, i_val + amPmStrings[1].length).toLowerCase() == amPmStrings[1].toLowerCase()) {
                                                                    ampm = amPmStrings[1];
                                                                }

                                                                // Invalid AM/PM value return false
                                                                else {
                                                                        return false;
                                                                    }

                                                            // Increase the index to get the next token if the AM/PM is valid
                                                        if(amPmStrings && amPmStrings[1] && typeof amPmStrings[1] === "string" && amPmStrings[1].indexOf(".") !== -1)
                                                           i_val += 5;
                                                         else 
                                                           i_val += ampm.length;
                                                        }

                                                        // Format for timezone
                                                        else if (token == "z") {
                                                                // If the value is containing 
                                                                i_val = val.length;
                                                            }
      
                                                        else if(token === "SSS"){
                                                            // Get the numeric value of the seconds
                                                        milliSec = validate_getInt(val, i_val, 1, 3);

                                                        // Validate the seconds
                                                        if (milliSec == null || milliSec < 0 || milliSec > 999) {
                                                            return false;
                                                        }

                                                        // Increase the index to get the next token if the seconds is valid
                                                        i_val += milliSec.length;
                                                        }

                                                            // Format for other characters
                                                            else {
                                                                    // Compare the token with the corresponding value part
                                                                    if (val.substring(i_val, i_val + token.length) != token) {
                                                                        return false;
                                                                    }

                                                                    // Increase the index to get the next token if the year is valid
                                                                    // else {i_val+=token.length;}
                                                                }
    }

    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) {
        // Check for trailing extra space
        if (trim(val.substring(i_val, val.length)) != "") {
            return false;
        }
    }

    // Validation month
    // Check february
    if (month == 2) {
        // Check for leap year

        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            // Leap year
            if (date > 29) {
                return false;
            }
        }

        // Not a Leap year
        else {
                if (date > 28) {
                    return false;
                }
            }
    }

    // Other months which dont have 31 days
    if (month == 4 || month == 6 || month == 9 || month == 11) {
        // Invalid month
        if (date > 30) {
            return false;
        }
    }

    // Check the validity of day of week
    if (day_name != "" && month_name != "") {
        // Create a date string using month, date and year
        var dateString = month + "/" + date + "/" + year;

        // Create a date object
        var validDate = new Date(dateString);

        // Get the day of week from the date object
        var dayOfWeek = validDate.getDay();

        // Validate the day of week
        if (weekdays[dayOfWeek + 1] != day_name) {
            return false;
        }
    }

    if (reqDateObj) {
        var dateObj = new Date(year + "/" + month + "/" + date + " " + hh + ":" + mm + ":" + ss + " " + ampm);
        return dateObj;
    }
    // Valid date/time/datetime format
    return true;
}
// End of getDateFromFormat function


//=====================REQUIRED=============================


/*
@public- Validate for required fields
This function returns the validation error object if the field contains no value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function required_isFilled(object, eventType) {
       if (object.type.toLowerCase() === "text" && object.hasAttribute("data-editable") && object.hasAttribute("readonly") && eventType === 'onblur') {
        if(object.hasAttribute("data-overlay")){
            object.removeAttribute("data-overlay");
          } else { return "terminate"; }
        }
    /*BUG-552509 : don't validate require onblur of there is server validation*/
    var errorDivs = pega.ctx.dom.getElementById(object.name + "Error");
    if(errorDivs && eventType && eventType === 'onblur'){
      var field = trim(pega.control.PlaceHolder.getValue(object));
      if("" !== field && required_requiredMsgStr !== errorDivs.text) {
         return "terminate";
      }
    }
    if (object.type.toLowerCase() == "radio") {
        var radio_group = pega.ctx.dom.$("[name='" + object.name + "'][type!='hidden']");

        var checked = false;
        for (var j = 0; j < radio_group.length; j++) {
            if (radio_group[j].checked != false && (radio_group[j].checked == true || radio_group[j].getAttribute("checked") == "")) {
                checked = true;
                break;
            }
        }
        //No radio item selected
        if (checked == false) {
            if (object.displayName == null || object.displayName == "") {
                object.displayName = validation_getDisplayName(object);
            }

            var errorMessage = required_requiredMsgStr;
            return new validation_Error(radio_group[0], errorMessage);
        } else {
            var errorList = new Array();
            var successList = new Array();
            successList.push(radio_group[0]);

            if (typeof validation_displayFieldError == 'function') {
                validation_displayFieldError(errorList, successList);
            }
        }
    } else if (object.className.indexOf("multiselect-list") > -1) {
        /* If the control is a multiselect control*/
        var multiselectValue = $(object).siblings("[type='hidden']");
        if (multiselectValue.val() != "" && multiselectValue.val() != ",") {
            var errorList = new Array();
            var successList = new Array();
            successList.push(object);

            if (typeof validation_displayFieldError == 'function') {
                validation_displayFieldError(errorList, successList);
            }
        } else {
            var errorMessage = required_requiredMsgStr;
            if(object.value != ""){
              /* control is multiselect + we have a required + token value is empty + there is some text entered then enter a valid message */
              errorMessage = required_invalidMsgStr;
            }
            return new validation_Error(object, errorMessage);
        }
    } else {
        //Noraml processing for all input elements.
        var field = trim(pega.control.PlaceHolder.getValue(object));

        if (null == field || "" == field) {

            if (object.displayName == null || object.displayName == "") {
                object.displayName = validation_getDisplayName(object);
            }

            var errorMessage = required_requiredMsgStr;
            return new validation_Error(object, errorMessage);
        }
    }
}

/*
@private- Removes commas
This function returns the validation error object if the field contains invalid decimal.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function removeCommas(strValue) {

    var spcRegExp = /\s/g;

    strValue = strValue.replace(spcRegExp, '');

    var objRegExp = /,/g; //search for commas globally

    //replace all matches with empty strings
    return strValue.replace(objRegExp, '');
}

function removeSeparator(strValue, strSeparator) {

    var spcRegExp = /\s/g;
    strValue = strValue.replace(spcRegExp, ''); //remove spaces

    var objRegExp = new RegExp("\\" + strSeparator, "g"); //search for Separator
    //replace all matches with empty strings
    return strValue.replace(objRegExp, '');
}

//=====================INTEGER TYPE=============================

/*
@public- Validation function for decimal
This function returns the validation error object if the field is not a valid decimal value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function numeric_isDecimal(object) {

    //var x = removeCommas(object.value);
    
    //BUG-374737 : Decimal validation for values like: 45,null,null,null,5434 , 45....5423 , 43.3,2354 , 54,.42324
  	var actual_input = pega.control.PlaceHolder.getValue(object);
  	var improperGroupingAndDecimalCheck = new RegExp("(\\" + grouping_separator + "){2,}" + "|(\\" + decimal_separator + "){2,}" + "|(\\" +decimal_separator+".*\\,)\\1+" + "|(\\"+grouping_separator + "\\"+decimal_separator+")\\1+", "g");
  	var illegalGrouping = actual_input.match(improperGroupingAndDecimalCheck);
	  if (illegalGrouping) {
        return display_getValidationError(object, "", numeric_decimalMsgStr);
    }
  
    
    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x) {
        return;
    }
    // var x = object.value; 

    //  var decimals = numeric_occurence(x, ".");
    var decimals = numeric_occurence(x, decimal_separator); //

    // Regular expression for numbers
    // The value can have numbers between 0-9 and '-', ',' and '.' symbols

    //var nonNumbersMatch = /[^0-9-.,]/g;
    var nonNumbersMatch = new RegExp("[^0-9-" + grouping_separator + decimal_separator + "]", "g");
    //bug-136333 porting of Hfix-8615
    var illegalminussignsign = false;
    if (x.lastIndexOf('-') > 0) illegalminussignsign = true;

    var illegalChars = x.match(nonNumbersMatch);

    
    var isValidExponential = isNaN(x);
        if (isValidExponential && (null != illegalChars || decimals > 1 || illegalminussignsign)) {
            return display_getValidationError(object, "", numeric_decimalMsgStr);
        }
    if (object.decimalPlaces != undefined) {
        var decimalPlaces = parseInt(object.decimalPlaces);
        if (!isNaN(decimalPlaces)) {
            x = numeric_ensureDecimalPlaces(x, decimalPlaces);
        }
    }

    // If the value should be reformatted enable this line
    //object.value = numeric_reformat(x);
}

//=====================INTEGER TYPE=============================

/*
@public- Validation function for integer
This function returns the validation error object if the field is not a valid integer value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function numeric_isInteger(object) {

    //var x = removeCommas(object.value);
    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x || validate_containsNonLatinNumbers(x)) {
        //BUG-245179 : added nonlatin check
        return;
    }

    // Regular expression for integers
    // The value can have '-' item 0 or 1 time ((\-)?) and any number of digits afterwards (d+)
    var reInteger = /^(\-)?\d+$/;

    var legalInteger = x.match(reInteger);

    var isValidExponential = isNaN(x);
        if (isValidExponential && legalInteger == null) {

            return display_getValidationError(object, "", numeric_integerMsgStr);
        }

    //If the integer should be reformatted, enable the following line
    //object.value = numeric_reformat(x);
}

//=====================DOUBLE TYPE=============================

/*
@public- Validation function for double
This function returns the validation error object if the field is not a valid double value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function numeric_isDouble(object) {

    //var x = removeCommas(object.value);
    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for doubles
    // (\-)? - Value can have preceeding "-"
    // \d+(\.\d*)? - One or more number, optional period and zero or more numbers afterwards
    // (\d*\.)?\d+ - Optional zero or more number and period and one or more numbers afterwards
    //var reDouble = /^(((\-)?\d+(\.\d*)?)|((\-)?(\d*\.)?\d+))$/
    var reDouble = new RegExp("^(((\\-)?\\d+(\\" + decimal_separator + "\\d*)?)|((\\-)?(\\d*\\" + decimal_separator + ")?\\d+))$");

    var legalDouble = x.match(reDouble),
        isValidExponential = isNaN(x);
    // check for valid number values for example :- 123e+1, 123e-2, 123.32 etc..
    if (legalDouble == null && isValidExponential) {

        return display_getValidationError(object, "", numeric_doubleMsgStr);
    }
}

//=====================TEXT TYPE=============================

/*
@public- Dummy function for text validation
@return $void$
*/

function text_isText(object) {

    return;
}

//=====================PASSWORD TYPE=============================

/*
@public- Dummy function for password validation
@return $void$
*/

function text_isPassword(object) {

    return;
}

//=====================IDENTIFIER TYPE=============================

/*
@public- Dummy function for identifier validation
@return $void$
*/

function text_isIdentifier(object) {

    return;
}

//=====================TRUEFALSE TYPE=============================

/*
@public- Dummy function for true false validation
@return $void$
*/

function boolean_isTruefalse(object) {

    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }

    if (x.toLowerCase() != "true" && x.toLowerCase() != "false") {

        return display_getValidationError(object, "", boolean_truefalseMsgStr);
    }
    return;
}

//=====================DATE TYPE=============================

/*
@public- Validates datestr as per format and get date object from date string if needed 
@param $elem - The object which represents the input field
@param $patterns - $patterns array in case of time control validation
@param $additionalPatterns - use additionalPatterns array in case of offline
@return $Date - Date object
		$boolean - returns true if the dateStr is valid
*/

function validateAndGetDateObj(elem, reqDateObj, patterns, additionalPatterns) {
    var dateString = pega.control.PlaceHolder.getValue(elem);
    if (!dateString) {
        return true;
    }
    patterns = patterns || date_patterns;
    if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
        additionalPatterns = additionalPatterns || additional_date_patterns;
        if (pega.DateTimeUtil.defaultLocale !== pega.u.d.Locale) {
            patterns = additionalPatterns[pega.u.d.Locale];
        }
    }

    // Loop through the datePattern array to match the pattern
    // datePattern /timePattern array is populated dynamically as per to the locale
    for (var i = 0; i < patterns.length; i++) {
        var dateObj = getDateFromFormat(trim(dateString), patterns[i], reqDateObj);
        if (dateObj) {
            return dateObj;
        }
    }
}

/*
@public- Validation function for date
This function returns the validation error object if the field is not a valid date value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function date_isDate(object) {
    var isValid = validateAndGetDateObj(object);
    if (isValid) return;

    return display_getValidationError(object, "", date_dateMsgStr);
}

/*Validator for new Date Time control in Dropdown Mode*/
function date_isDateDropDown(object) {
    return date_isDate(object);
}

//=====================TIMEOFDAY TYPE=============================

/*
@public- Validation function for time of day
This function returns the validation error object if the field is not a valid time of day value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function time_isTimeOfDay(object) {
    var additional_time_patterns = typeof additional_time_patterns !== 'undefined' ? additional_time_patterns : {};
    var isValid = validateAndGetDateObj(object, false, time_patterns, additional_time_patterns);
    if (isValid) return;

    return display_getValidationError(object, "", time_timeMsgStr);
}

/*Validator for new Date Time control in Dropdown Mode*/
function time_isTimeOfDayDropDown(object) {
    return time_isTimeOfDay(object);
}

//=====================DATETIME TYPE=============================

/*
@public- Validation function for date time
This function returns the validation error object if the field is not a valid date time value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function date_isDateTime(object) {
    var additional_datetime_patterns = typeof additional_datetime_patterns !== 'undefined' ? additional_datetime_patterns : {};
    var isValid = validateAndGetDateObj(object, false, datetime_patterns, additional_datetime_patterns);
    if (isValid) return;
    return display_getValidationError(object, "", date_DateTimeMsgStr);
}

/*Validator for new Date Time control in Dropdown Mode*/
function date_isDateTimeDropDown(object) {
    return date_isDateTime(object);
}

//Validation for disabled weekends
function day_validateDisabledWeekend(object) {
    var calWrapper = object.parentNode;
    if (calWrapper) {
        var patterns, additionalPatterns;
        var calConfig = pega.control.eventParser.parseJSON(calWrapper.getAttribute('data-calendar'));
        if (calConfig && calConfig.disabledWeekends) {
            var additional_time_patterns = typeof additional_time_patterns !== 'undefined' ? additional_time_patterns : {};
            var additional_datetime_patterns = typeof additional_datetime_patterns !== 'undefined' ? additional_datetime_patterns : {};
            var type = calConfig.d[1];
            if (type == "1") {
                //dateTime
                patterns = datetime_patterns;
                additionalPatterns = additional_datetime_patterns;
            } else if (type == "2") {
                //time
                patterns = time_patterns;
                additionalPatterns = additional_time_patterns;
            }

            var dateObj = validateAndGetDateObj(object, true, patterns, additionalPatterns);
            if (dateObj && dateObj instanceof Date) {
              var dateObjCopy = new Date(dateObj.getTime());
              if (typeof pega.u.d.Locale != 'undefined' && pega.u.d.Locale === 'th_TH' && !(typeof pegaUtils==="object" && pegaUtils.useBuddhistThaiSolarCalendar)) {
                dateObjCopy.setFullYear(dateObjCopy.getFullYear()+543);
              }
              var dayOfWeekForDate = dateObjCopy.getDay();
              var disabledWeekends = calConfig.disabledWeekends;
              for (var i = 0; i < disabledWeekends.length; i++) {
                if (dayOfWeekForDate == disabledWeekends[i] - 1) {
                  return display_getValidationError(object, "", day_disabledWeekendMsgStr);
                }
              }
            }
        }
    }
}

//Validation for min interval in time
function time_validateMinInterval(object) {
    var calWrapper = object.parentNode;
    if (calWrapper) {
        var patterns, additionalPatterns;
        var calConfig = pega.control.eventParser.parseJSON(calWrapper.getAttribute('data-calendar'));
        if (calConfig) {
            var type = calConfig.d[1];
            if (type == 0) //Date
                return;

            var additional_time_patterns = typeof additional_time_patterns !== 'undefined' ? additional_time_patterns : {};
            var additional_datetime_patterns = typeof additional_datetime_patterns !== 'undefined' ? additional_datetime_patterns : {};
            if (type == "1") {
                //dateTime
                patterns = datetime_patterns;
                additionalPatterns = additional_datetime_patterns;
            } else if (type == "2") {
                //time
                patterns = time_patterns;
                additionalPatterns = additional_time_patterns;
            }

            var dateObj = validateAndGetDateObj(object, true, patterns, additionalPatterns);
            if (dateObj && dateObj instanceof Date) {
                var min = dateObj.getMinutes();
                if(min < 10)
                   min = "0" + min; 
                var minArr = pega.u.d.CalendarUtil.getMinuteOpts('', true, calConfig.minInterval);
                if (minArr.indexOf(min.toString()) == -1) {
                    var msg = time_MinIntervalMsgStr.replace("<<minInterval>>", calConfig.minInterval);
                    return display_getValidationError(object, "", msg, true);
                }
            }
        }
    }
}

//=====================ISFUTUREDATE=============================

/*
@public- Validation function for for IsFutureDate Rule-Edit-Validate
This function returns the validation error object if the field is not a valid future date.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isFutureDate(object) {
    var additional_datetime_patterns = typeof additional_datetime_patterns !== 'undefined' ? additional_datetime_patterns : {};
    var validatedDateObj = validateAndGetDateObj(object, true, datetime_patterns, additional_datetime_patterns);
    if (validatedDateObj) {
      var Timezone = object.dataset.customTimezone || pega.u.d.TimeZone;
      var today;
      var browserAttr = pega.util && pega.util.Event && pega.util.Event.isIE;
      if(Timezone && typeof browserAttr != 'undefined' && browserAttr !== 11) {
             validatedDateObj = validatedDateObj.toLocaleString("en", {timeZone: Timezone});
             validatedDateObj = new Date(validatedDateObj);
             today = new Date(new Date().toLocaleString("en", {timeZone: Timezone}));
             today.setMilliseconds(today.getMilliseconds()+200);
      } else {
             today = new Date();
      }        
      if (today > validatedDateObj && validatedDateObj != true) {
            return display_getValidationError(object, ruleEditValidate_isFutureDateMsgStr, "", true);
        } else {
            return;
        }
    } else {
        return display_getValidationError(object, "", date_dateMsgStr);
    }
}

//=====================ISNOTFUTUREDATE=============================

/*
@public- Validation function for for IsNotFutureDate Rule-Edit-Validate
This function returns the validation error object if the field is a valid future date.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isNotFutureDate(object) {
    var additional_datetime_patterns = typeof additional_datetime_patterns !== 'undefined' ? additional_datetime_patterns : {};
    var validatedDateObj = validateAndGetDateObj(object, true, datetime_patterns, additional_datetime_patterns);
    if (validatedDateObj) {
        var today = new Date();
        // Compare two dates
        if (today <= validatedDateObj && validatedDateObj != true) {
            // Invalid past date
            return display_getValidationError(object, ruleEditValidate_isNotFutureDateMsgStr, "", true);
        } else {
            return;
        }
    } else {
        return display_getValidationError(object, "", date_dateMsgStr);
    }
}

//=====================FILE TYPE=============================
/*
@public- Validation function for file name
This function returns the validation error object if the field is not a valid file name.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function file_isFile(object) {
    var fileType = object.fileType;
    if (null == fileType) fileType = "";

    var file = pega.control.PlaceHolder.getValue(object);
    if (null == file) file = "";

    if ("" == fileType) {
        return;
    }

    var fileExt = file.substring(file.lastIndexOf(".") + 1).toLowerCase();
    var strFileExtnsArray = fileType.split(' or ');
    var matchedFileType = false;
    for (var i = 0; i < strFileExtnsArray.length; i++) {
        if (fileExt == strFileExtnsArray[i].toLowerCase()) {
            matchedFileType = true;
            break;
        }
    }
    if (!matchedFileType) {
        //return display_getValidationError(object, file_FileMsgStr1, file_FileMsgStr2 + fileType);
        return display_getValidationError(object, file_FileMsgStr1, file_FileMsgStrFull + fileType);
    }
}

/******************************************************************
    The Functions corresponding to Rule-Edit-Validate instances

******************************************************************/

//=====================ISPOSDECIMAL=============================

/*
@public- Validation function for for IsPosDecimal Rule-Edit-Validate
This function returns the validation error object if the field is not a valid positive decimal.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isPosDecimal(object) {

    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x) {
        return;
    }

    //var decimals = numeric_occurence(x, ".");
    var decimals = numeric_occurence(x, decimal_separator);

    // Regular expression for numbers
    // The value can have numbers between 0-9 and '-', ',' and '.' symbols
    //var nonNumbersMatch = /[^0-9-.,]/g;
    var nonNumbersMatch = new RegExp("[^0-9-" + grouping_separator + decimal_separator + "]", "g");

    var illegalChars = x.match(nonNumbersMatch);

    if (null != illegalChars || decimals > 1) {
        return display_getValidationError(object, "", numeric_decimalMsgStr);
    } else if (x <= 0) {

        return display_getValidationError(object, ruleEditValidate_isPosDecimalMsgStr, "", true);
    }

    if (object.decimalPlaces != undefined) {

        var decimalPlaces = parseInt(object.decimalPlaces);
        if (!isNaN(decimalPlaces)) {
            x = numeric_ensureDecimalPlaces(x, decimalPlaces);
        }
    }
}

//=====================ISNONNEGATIVE=============================
/*
@public- Validation function for for IsNonNegative Rule-Edit-Validate
This function returns the validation error object if the field is not a valid non negative.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isNonNegative(object) {

    //var x = object.value;
    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for doubles
    // (\-)? - Value can have preceeding "-"
    // \d+(\.\d*)? - One or more number, optional period and zero or more numbers afterwards
    // (\d*\.)?\d+ - Optional zero or more number and period and one or more numbers afterwards
    //var reDouble = /^(((\-)?\d+(\.\d*)?)|((\-)?(\d*\.)?\d+))$/
    var reDouble = new RegExp("^(((\\-)?\\d+(\\" + decimal_separator + "\\d*)?)|((\\-)?(\\d*\\" + decimal_separator + ")?\\d+))$");

    var legalDouble = x.match(reDouble),
        isValidExponential = isNaN(x);

    if (isValidExponential && legalDouble == null) {

        return display_getValidationError(object, "", numeric_doubleMsgStr);
    } else if (x < 0) {

        return display_getValidationError(object, ruleEditValidate_isNonNegativeMsgStr, "", true);
    }
}

//=====================ISNONNEGATIVEINTEGER=============================
/*
@public- Validation function for for ISNONNEGATIVEINTEGER Rule-Edit-Validate
This function returns the validation error object if the field is not a valid non negative integer.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isNonNegativeInteger(object) {

    //var x = removeCommas(object.value);
    var x = removeSeparator(pega.control.PlaceHolder.getValue(object), grouping_separator);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for integers
    // The value can have '-' item 0 or 1 time ((\-)?) and any number of digits afterwards (d+)
    var reInteger = /^(\-)?\d+$/;

    var legalInteger = x.match(reInteger);

    if (legalInteger == null) {

        return display_getValidationError(object, "", numeric_integerMsgStr);
    } else if (x < 0) {

        return display_getValidationError(object, ruleEditValidate_isNonNegativeMsgStr, "", true);
    }
}

//=====================ISURGENCYVALUE=============================

/*
@public- Validation function for for IsUrgencyValue Rule-Edit-Validate
This function returns the validation error object if the field is not a valid urgency value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isUrgencyValue(object) {

    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }

    //var decimals = numeric_occurence(x, ".");
    var decimals = numeric_occurence(x, decimal_separator);

    // Regular expression for numbers
    // The value can have numbers between 0-9 and '-', ',' and '.' symbols
    //var nonNumbersMatch = /[^0-9-.,]/g;
    var nonNumbersMatch = new RegExp("[^0-9-" + grouping_separator + decimal_separator + "]", "g");

    var illegalChars = x.match(nonNumbersMatch);

    if (null != illegalChars || decimals > 1) {
        return display_getValidationError(object, ruleEditValidate_isUrgencyValueMsgStr, "", true);
    }

    // Check value for the range 0-100
    if (x < 0 || x > 100) {
        return display_getValidationError(object, ruleEditValidate_isUrgencyValueMsgStr, "", true);
    }
}

//=====================VALIDEMAILADDRESS=============================
/*
@public- Validation function for for IsValidEmailAddress Rule-Edit-Validate
This function returns the validation error object if the field is not a valid email address.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isValidEmailAddress(object) {

    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for email address
    // RFC822 regular expression
    var emailReg = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

    var validEmailAddress = emailReg.test(x);

    if (!validEmailAddress) {
        return display_getValidationError(object, ruleEditValidate_isValidEmailAddressMsgStr, "", true);
    }
}

//=====================VALIDPHONENUMBER=============================

/*
@public- Validation function for for IsValidPhoneNumber Rule-Edit-Validate
This function returns the validation error object if the field is not a valid phone number.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isValidPhoneNumber(object) {

    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for phone number
    var nonPhoneNumbersMatch = /[^0-9-x,X]/g;

    var illegalChars = x.match(nonPhoneNumbersMatch);

    if (null != illegalChars) {
        return display_getValidationError(object, ruleEditValidate_isValidPhoneNumberMsgStr, "", true);
    }
}

//=====================ALPHABETICVALIDATION=============================

/*
@public- Validation function for for AlphabeticValidation Rule-Edit-Validate
This function returns the validation error object if the field is not a valid alphabetic value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isAlphabetic(object) {

    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }

    // Regular expression for alphabetic value
    var nonAlphaMatch = /[^a-zA-Z]/;

    // Match against the regular expression
    var illegalChars = x.match(nonAlphaMatch);

    if (null != illegalChars) {
        return display_getValidationError(object, ruleEditValidate_isAlphabeticMsgStr, "", true);
    }
}

//=====================ALPHANUMERICVALIDATION=============================
/*
@public- Validation function for for isAlphaNumeric Rule-Edit-Validate
This function returns the validation error object if the field is not a valid alphanumeric value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isAlphaNumeric(object) {
    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }
    // Regular expression for alpha numeric value
    var nonAlphaMatch = /[^a-zA-Z0-9]/;
    var illegalChars = x.match(nonAlphaMatch);

    if (null != illegalChars) {
        return display_getValidationError(object, ruleEditValidate_isAlphaNumericMsgStr, "", true);
    }
}

//======================ALPHANUMERICSPACEVALIDATION============================
/*
@public- Validation function for for isAlphaNumericSpace Rule-Edit-Validate
This function returns the validation error object if the field is not a valid alphanumeric or space value.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function ruleEditValidate_isAlphaNumericSpace(object) {
    var x = pega.control.PlaceHolder.getValue(object);

    if (null == x || "" == x) {
        return;
    }
    // Regular expression for alpha numeric and space value
    var nonAlphaMatch = /[^a-zA-Z0-9\s]/;
    var illegalChars = x.match(nonAlphaMatch);

    if (null != illegalChars) {
        return display_getValidationError(object, ruleEditValidate_isAlphaNumericSpaceMsgStr, "", true);
    }
}

//======================END OF RULE-EDIT-VALIDATE-FUNCTIONS=====================

var phone_DIGITS_IN_US = 10;

/*
@public- Validate for phone number
This function returns the validation error object if the field is not a valid phone number.  
@param $object$object- The object which represents the input field
@return $object$validation_Error - Validation Error object
*/

function phone_isPhone(object) {
    var phoneString = pega.control.PlaceHolder.getValue(object);
    var errorMessage = phone_phoneMsgStrFull;
    if (null == phoneString || "" == phoneString) {
        return;
    }

    var numbersMatch = /[0-9]/g;
    var numbers = phoneString.match(numbersMatch);
    if (null == numbers || "" == numbers) {
        //var errorMessage = phone_phoneMsgStr1 + object.displayName + phone_phoneMsgStr2;  
        return new validation_Error(object, errorMessage);
    }

    var digitsExpected = phone_DIGITS_IN_US;
    if ("1" == numbers[0]) {
        numbers.splice(0, 1);
    }

    // should have the correct number of digits - first digit shouldn't be 1
    if (phone_DIGITS_IN_US != numbers.length || numbers[0] == 1) {
        //var errorMessage = phone_phoneMsgStr1 + object.displayName + phone_phoneMsgStr2;  
        return new validation_Error(object, errorMessage);
    } else {
        pega.control.PlaceHolder.setValue(object, "(" + phone_createString(numbers, 0, 2) + ")" + " " + phone_createString(numbers, 3, 5) + "-" + phone_createString(numbers, 6, 9));
    }
}

/*
@private- Utility function for create string from the phone string
@param $array$anArray- The array of numbers
@param $int$startIndex- Start index to be extracted from the array
@param $int$endIndex- End index to be extracted from the array
@return $int$retVal - Integer value from array
*/

function phone_createString(anArray, startIndex, endIndex) {
    var retVal = "";
    for (var i = startIndex; i <= endIndex; i++) {
        retVal += anArray[i];
    }
    return retVal;
}

/*
@private- Function for keypress filtering
This function allow anything except for alphabetic characters.  
@return $void$
*/

function phone_filterKeyPress() {
    var allowKey = !valutility_isAlphabetic();
    if (!allowKey) {
        valutility_cancelKeyPress();
    }
    return null;
}

/****************** Error Display Handler ******************
 *
 *  This file handles the display of the errors. There are different
 *  functions which can be used to display the errors in a different 
 *  manner. 
 *
 *  There are two different types of validation.
 *      1. Validation on all fields - usually called before submit
 *      2. Validation on one field - usually called on an event, like onchange
 *  These two validations can have different display functions.
 *  
 *  There are currently three functions to show errors. The types are as follows:
 *      1. display_showImageErrors -Shows an image in front of the field 
 *          in error. The image has an alt tag with the error description.
 *      2. display_displayHTML - Shows a list of errors in the html. For 
 *          this an id of an element where the errors are shown must be provided.
 *      3. display_displayAlert - Shows the errors in an alert dialog box.
 *          
 *  New display functions can be added. All function receive a list
 *  of errors and elements that were validated successfully.
 *
 **********************************************************/

//=====================PUBLIC========================

// function used to show all errors - usually called before submit
validation_displayErrors = display_showImageErrors;

// function used to show one error - usually called by an event
validation_displayFieldError = display_showImageErrors;

var errorHolderId = "errorHolder";

//=====================PRIVATE========================

/*
@public- Displays the errors in an alert dialog box.
This function displays the errors in an alert dialog box.  
@param $object$errorList- The object which represents the error list
@param $object$successList- The object which represents the success list
@return $void$
*/

function display_displayAlert(errorList, successList) {
    var errorString = "";
    if (0 < errorList.length) {
        for (var i = 0; i < errorList.length; i++) {
            errorString += errorList[i].errorMessage + "\n";
        }
        alert(errorString);
    }
}

/*
@public- Displays the errors in HTML.
This function displays the errors in HTML.  
@param $object$errorList- The object which represents the error list
@param $object$successList- The object which represents the success list
@return $void$
*/

function display_displayHTML(errorList, successList) {
    var errorHolder = pega.ctx.dom.getElementById("errorHolder");
    errorHolder.innerHTML = "";
    if (0 < errorList.length) {
        for (var i = 0; i < errorList.length; i++) {
            var div = document.createElement("div");
            div.className = "text";
            div.style.color = "red";
            div.style.fontWeight = "bold";
            div.innerHTML = errorList[i].errorMessage;
            errorHolder.appendChild(div);
        }
        errorHolder.style.display = "";
    } else {
        errorHolder.style.display = "none";
    }
}

/*
@protected- Displays the errors with image with alt tags.
This function displays the errors with image with alt tags.  
@param $object$errorList- The object which represents the error list
@param $object$successList- The object which represents the success list
@return $void$
*/

function display_showImageErrors(errorList, successList, serverErrors, flag) {
    var display_removeErrorImageRef = display_removeErrorImage;
    var display_addImageErrorRef = display_addImageError;

    if (serverErrors != true && serverErrors) {
        var serverErrorvalidationType
        var errorImageElement, ariaDescribedbyAttr;
        if(serverErrors.target){
          serverErrorvalidationType = serverErrors.target.getAttribute("validationType");
          ariaDescribedbyAttr = serverErrors.target.getAttribute("aria-describedby");
          if(ariaDescribedbyAttr){
            errorImageElement = document.getElementById(ariaDescribedbyAttr);
          }
        }
        var successListLength = successList.length;
        for (var i = 0; i < successListLength; i++) {
            //SE-55290 skip the removal if the field already have validtion and calculate expression on the field doesnothave any error
			      if(!(flag && serverErrorvalidationType && serverErrorvalidationType.indexOf("calculateexpression") > -1 && errorImageElement && errorImageElement.style && errorImageElement.style.display != "none")){
               display_removeErrorImageRef(successList[i]);
             }
            // only call if we have tab group included
            if (typeof pega.u.d.handleErrorsInTabgroupLayout == "function") {
                pega.u.d.handleErrorsInTabgroupLayout(successList[i], "clear");
            }
            if (window.LayoutGroupModule) 
          		LayoutGroupModule.handleErrorsInLayoutgroupLayout(successList[i], "clear");
        }
    }
    var errorListLength = errorList.length;
    for (var i = 0; i < errorListLength; i++) {
        display_removeErrorImageRef(errorList[i].element);
    }

    for (var i = 0; i < errorListLength; i++) {
        display_addImageErrorRef(errorList[i]);

        // only call if we have tab group included
        if (typeof pega.u.d.handleErrorsInTabgroupLayout == "function") {
            pega.u.d.handleErrorsInTabgroupLayout(errorList[i].element, "add");
        }
    }
    if (window.LayoutGroupModule) {
        LayoutGroupModule.checkForErrors();
    }
}

function createErrorMarker(error, errorElementName) {
    var divClassName = 'iconErrorDiv';
    var spanClassName = 'iconError';
    if (pega.u.d.fieldErrorType === "ERRORTEXT") {
        divClassName = 'inputErrorDiv';
        spanClassName = 'inputError';
    }

    var mark = document.createElement('div');
    mark.className = divClassName;
    /* The following is added because multiselect does not have a name attribute and so id needs to be used*/
    if (error.element.className.indexOf("multiselect-list") > -1) 
      mark.id = error.element.id + 'Error';
    else {
      if(errorElementName){
        mark.id = errorElementName + 'Error';
        error.element.setAttribute("aria-describedby",error.element.getAttribute("aria-describedby")  + " " +  mark.id);
      }
      else
        mark.id = error.element.name + 'Error';
    }
    for (var i = 0; i < error.errorMessage.length; i++) {
        var span = document.createElement('span');
        span.className = spanClassName;
        span.setAttribute('title', error.errorMessage[i]);
        span.setAttribute('errid', '');
        /*HFIX-9485: Adding the below attributes for AT screen readers.*/
        //BUG-429039 Remove role=alert attribute
        //span.setAttribute('role', 'alert');
        //BUG-78066 Added alert for radio becuase on tab is not reading error message
        if(error.element.type == "radio") {
          span.setAttribute('role', 'alert');
        }
        span.setAttribute('aria-live', 'assertive');
        span.setAttribute('aria-relevant', 'text');
        span.setAttribute('aria-atomic', 'true');

        mark.appendChild(span);
    }
    return mark;
}

/*
@protected- Adds the image for error containing element
This function adds the image for error containing element.  
@param $object$error- The object which represents the error containing element
@return $void$
*/

function display_addImageError(error) {
    var errorElement = error.element;
    var hiddenErrorElement = (errorElement.nextElementSibling && errorElement.nextElementSibling.type && errorElement.nextElementSibling.type === "hidden") ? errorElement.nextElementSibling : null;
    var errorDivs;
    var errorElementName;
    var offlineError = error.errorMessage && error.errorMessage.constructor == Array;
    if (!offlineError) {
      if(typeof(pega.u.d.isDateTimeDropdownElement)=='function' && pega.u.d.isDateTimeDropdownElement(errorElement)) {
        var dropdownTitle = errorElement.getAttribute("data-fieldname");
        if(pega.u.d.displayFieldNameInValidationMsg) {
            var elementLabel = findLabelFor($(errorElement).siblings("[type='hidden']")[0]);
            var label = (elementLabel && elementLabel.innerText) ? elementLabel.innerText + " " + dropdownTitle.toLowerCase() : dropdownTitle;
            error.errorMessage = [errorLabelString + " : " + label + " " + error.errorMessage.toLowerCase()];
          } else {
            error.errorMessage = [dropdownTitle + " " + error.errorMessage.toLowerCase()];
          }    
      }
      else {
        var elementLabel = findLabelFor(errorElement);
        if(elementLabel && elementLabel.innerText && pega.u.d.displayFieldNameInValidationMsg) {
          error.errorMessage = [errorLabelString + " : " + elementLabel.innerText + " " + error.errorMessage.toLowerCase()];
        } else {
          error.errorMessage = [error.errorMessage];
        }     
      }
    }
    var inDynLayout = false;
    if(hiddenErrorElement) {
      errorDivs = pega.ctx.dom.getElementById(hiddenErrorElement.name + "Error");
      errorElementName = hiddenErrorElement.name;
    } else {
      errorDivs = pega.ctx.dom.getElementById(errorElement.name + "Error");
    }
    var currentCtx = pega.ctx;
    pega.ctxmgr.setContext(pega.ctxmgr.getContextByTarget(errorElement));
    var isMultiSelect = errorElement.className.indexOf("multiselect-list") > -1;
    if (!errorElement.name && isMultiSelect) errorDivs = pega.ctx.dom.getElementById(errorElement.id + "Error");
    pega.ctxmgr.setContext(currentCtx);
    if (errorDivs != null) {
        toggleErrorMessage(errorDivs, error, true);
    } else {
        var errorDiv = createErrorMarker(error, errorElementName),
            errorSpan = errorDiv.getElementsByTagName('span');
        //errorSpan = pega.util.Dom.getFirstChild(errorDiv);
        var firstChildElem = pega.util.Dom.getFirstChild(errorElement.parentNode);
        /*var firstChildElemTemp = pega.util.Dom.getFirstChild(errorElement.parentNode);*/
        var parentElemNode = errorElement.parentNode.nodeName.toLowerCase();
        var contentItemElement = $(errorElement).closest(".content-item.content-field");
        // display error message below controls in a dynamic layout

        /* Changes made as part of BUG-299866- Removed the while loop which has a constant number of iterations and fails in the case of some components*/
        if (contentItemElement.length > 0) {
            var contentItemEleDiv = contentItemElement[0];
            errorDiv.className += " dynamic-icon-error-div";
            //var iconError= pega.util.Dom.getFirstChild(errorDiv);
            //iconError.className += " dynamic-icon-error";
            //errorSpan.innerHTML=error.errorMessage;
            for (var i = 0; i < errorSpan.length; i++) {
                errorSpan[i].className += " dynamic-icon-error";
                errorSpan[i]["innerText" in errorSpan[i] ? "innerText" : "textContent"] = error.errorMessage[i];
                errorSpan[i].title = '';
            }

            if (firstChildElem.className.indexOf("textAreaStyle") > -1 || firstChildElem.className.indexOf("TextAreaEC") > -1) {
                pega.util.Dom.insertAfter(errorDiv, firstChildElem.parentNode);
            } else {
                if (errorElement.type == "radio") {
                    pega.util.Dom.insertAfter(errorDiv, pega.util.Dom.getLastChild(errorElement.parentNode.parentNode.parentNode));
                } else if (isMultiSelect) {
                    pega.util.Dom.insertAfter(errorDiv, pega.util.Dom.getLastChild(errorElement.parentNode.parentNode));
                } else {
                    pega.util.Dom.insertAfter(errorDiv, pega.util.Dom.getLastChild(errorElement.parentNode));
                }
            }
            inDynLayout = true;
        } else {
            pega.util.Dom.insertBefore(errorDiv, firstChildElem);
        }

        toggleErrorMessage(errorDiv, error, true);
    }
    setLabelStyle(errorElement);
}

function toggleErrorMessage(errorDiv, error, show) {
    var offlineError = error.errorMessage && error.errorMessage.constructor === Array;
    if (!offlineError) {
        error.errorMessage = [error.errorMessage];
    }
    var errorDivFirstSpan = pega.ctx.dom.getElementsByTagName("SPAN", errorDiv)[0];
    var errorDivSpanElements = pega.ctx.dom.getElementsByTagName("SPAN", errorDiv);
    if(!errorDivFirstSpan || !errorDiv) return;
    if (show) {
        var errorElement = error.element;
        errorElement.setAttribute('aria-invalid', 'true');
        errorDiv.style.display = "";
        if (errorDivFirstSpan.title.indexOf(error.errorMessage[0]) === -1) {

        /* whenever we have "dynamic-icon-error" class show the text else show error-icon only. */
        if(errorDivFirstSpan.classList.contains("dynamic-icon-error")) {
            errorDivFirstSpan["innerText" in errorDivFirstSpan ? "innerText" : "textContent"] = error.errorMessage[0];
        }else if (errorDivFirstSpan.title === "") {
            errorDivFirstSpan.title = error.errorMessage[0];
          }  else {
            errorDivFirstSpan.title += "\n" + error.errorMessage[0]
          }
        }
        if (errorDivFirstSpan.className === "inputError") {
            pega.util.Dom.setInnerText(errorDivFirstSpan, errorDivFirstSpan.title);
            if (error.element.tagName.toLowerCase() === 'textarea' && error.element.className.indexOf("textAreaStyle") > -1) {
                if (error.element.parentNode.tagName.toLowerCase() === "td") {
                    pega.util.Dom.addClass(pega.util.Dom.getAncestorByTagName(error.element, "TABLE"), "errorShade");
                } else {
                    pega.util.Dom.addClass(error.element.parentNode, "errorShade");
                }
            } else {
                pega.util.Dom.addClass(error.element, "errorShade");
            }
        }
        if (errorElement.parentNode.id === "highlight") {
            errorElement.prevClassName = errorElement.className;
            errorElement.className = "inputHighlight";
        }
    } else {
        var element = error;
        element.setAttribute('aria-invalid', 'false')
        errorDiv.style.display = "none";
        errorDivFirstSpan.title = "";
        errorDivFirstSpan.text = "";
        for(var i = 1; i < errorDivSpanElements.length; i++ ){
          var currentErrorDivSpan = errorDivSpanElements[i];
          currentErrorDivSpan.title = "";
          currentErrorDivSpan.text = "";
       }
        if (errorDivFirstSpan.className === "inputError") {
            pega.util.Dom.setInnerText(errorDivFirstSpan, errorDivFirstSpan.title);
            if (element.tagName.toLowerCase() === 'textarea' && element.className.indexOf("textAreaStyle") > -1) {
                if (element.parentNode.tagName.toLowerCase() === "td") {
                    pega.util.Dom.removeClass(pega.util.Dom.getAncestorByTagName(element, "TABLE"), "errorShade");
                } else {
                    pega.util.Dom.removeClass(element.parentNode, "errorShade");
                }
            } else {
                pega.util.Dom.removeClass(element, "errorShade");
            }
        }
        if (element.parentNode.id === "highlight") {
            element.className = element.prevClassName;
        }

        var labelForElement = findLabelFor(error);

        if (labelForElement) {
            pega.u.d.removeClass(labelForElement, "labelError");
        }
    }
    //BUG-172584 : Calling resizeHarness for Dynamic layouts not triggering harness resize 
    pega.ui.d.resizeHarness();
}
/*
@protected- Removes the image for error containing element
This function removes the image for error containing element.  
@param $object$element- The object which represents the error containing element
@return $void$
*/

function display_removeErrorImage(ele) {
    /*BUG-224451: no need to get all elements by id as only the first element is used, just use document.getElementById*/
    var errorElement = "";
    if (ele.className.indexOf("multiselect-list") > -1){
      errorElement = ele.id + "Error";
    } 
    else {
      var hiddenErrorElement = (ele.nextElementSibling && ele.nextElementSibling.type && ele.nextElementSibling.type === "hidden") ? ele.nextElementSibling : null;
      if(hiddenErrorElement) 
        errorElement = hiddenErrorElement.name + "Error";
      else
        errorElement = ele.name + "Error";
    }
    var currentCtx = pega.ctx;
    pega.ctxmgr.setContext(pega.ctxmgr.getContextByTarget(ele));
    var errorDiv = pega.ctx.dom.getElementById(errorElement);
    pega.ctxmgr.setContext(currentCtx);
    if (typeof errorDiv != 'undefined' && errorDiv != null) {
      toggleErrorMessage(errorDiv, ele, false);
    }
  // BUG-811778: hide errormessage associated to the hiddeninput of datetime dropdowns
    if(typeof(pega.u.d.isDateTimeDropdownElement)=='function' && pega.u.d.isDateTimeDropdownElement(ele)) {
      var hiddenDTInput = $(ele.parentNode).find('input[type=hidden]')[0];
      errorElement = hiddenDTInput.name + "Error";
      var errorDiv = pega.ctx.dom.getElementById(errorElement);
      if (typeof errorDiv != 'undefined' && errorDiv != null) {
        toggleErrorMessage(errorDiv, hiddenDTInput, false);
      }
    }
}

/*
@protected- Create validation error object
@param $object$object- The object which represents the error containing element
@param $String$errMsgStr1- The error message part 1
@param $String$errMsgStr2- The error message part 2
@param $boolean$noValueDisplay- To display or not to display the value in the error message
@return $object$validation_Error - Validation Error object
*/

function display_getValidationError(object, errMsgStr1, errMsgStr2, noValueDisplay) {
    if (object.getAttribute("errMessage") != null) {
        var errorMessage = object.getAttribute("errMessage");
    } else {
        if (noValueDisplay) {
            var errorMessage = errMsgStr1 + errMsgStr2;
        } else {
            if (errMsgStr1 != null && errMsgStr1 != "") {
                var errorMessage = errMsgStr1 + " " + pega.control.PlaceHolder.getValue(object) + " " + errMsgStr2;
            } else {
                var errorMessage = pega.control.PlaceHolder.getValue(object) + " " + errMsgStr2;
            }
        }
    }
    return new validation_Error(object, errorMessage);
}

/*
If there is an error in a field, find the label for that field, and set the style for the label text.

*/

function setLabelStyle(errorElement) {

    var labelForElement = findLabelFor(errorElement);

    if (labelForElement) {
        pega.u.d.addClass(labelForElement, "labelError");
    }
}

//Find label for RTE inase marked required
function findLabelForRTE(errorElement) {
  var parentElementNode = errorElement.parentNode;
  while(parentElementNode.className.indexOf('required') === -1){
    parentElementNode = parentElementNode.parentNode
  }
  var rteLabel = pega.ctx.dom.querySelector('LABEL',parentElementNode);
  return rteLabel;
}

function findLabelFor(errorElement) {
    var errorElemParent = errorElement.parentNode;
    var isRadioCtrl = false;
    var isRadioAG = false;
    var errorElementClass = errorElement.className;
    if (errorElementClass.indexOf("Radio") == 0){
        isRadioCtrl = true;
    }
    if (errorElement.id.indexOf('PEGACKEDITOR') !== -1 && pega.u.d.displayFieldNameInValidationMsg){
      return findLabelForRTE(errorElement);
    }
    var parentTable = errorElement;
    while (parentTable != null && (parentTable.tagName != "TABLE" || parentTable.className.indexOf("textAreaExpandStyle") > -1) && !parentTable.hasAttribute("bsimplelayout")) {
        /* BUG-195268: Checking for Auto Generated Radio button(check for class name "radioTable") */
        if (isRadioCtrl && !isRadioAG && parentTable.tagName && parentTable.tagName.toLowerCase() == "div" && pega.util.Dom.hasClass(parentTable, "radioTable") > -1) {
            if (parentTable.getAttribute("data-ctl") == "RadioGroup") {
                isRadioAG = true;
            }
        }
        parentTable = parentTable.parentNode;
    }

    if (!isRadioAG && (errorElement.className == "Radio" || errorElement.className == "autocomplete_input")) {
        var parentTable = parentTable.parentNode;
        while (parentTable != null && parentTable.tagName != "TABLE") {
            parentTable = parentTable.parentNode;
        }
    }

    if (!parentTable) return "";

    var labelList = pega.ctx.dom.getElementsByTagName("LABEL", parentTable);
    var labelForElement = null;
    var elemId = errorElement.id;

    /* BUG-195268: START */
    if (isRadioAG && elemId.lastIndexOf(errorElement.value) > 0) {
        /* radio input id = field label id + input element value */
        try {
            elemId = elemId.substr(0, elemId.lastIndexOf(errorElement.value));
        } catch (e) {}
    }
    /* BUG-195268: END */

    /*HFix-30073 Start : As part of the hotfix, the label for attribute in case of the grid, never equals error elements id
    hence added condition in case of the grid, find the closest label associated with the error element.
    In other scenarios the label associated with the error element would take the normal code flow.
    */
    if (elemId == "EXPAND" && errorElement.tagName.toLowerCase() == "textarea" && errorElement.DisplayedProperty) elemId = errorElement.DisplayedProperty;
    var duplicateElementsFound = pega.ctx.dom.$("[id='" + elemId + "']").length > 1;
    for (var el = 0; el < labelList.length; el++) {
        /*BUG-542127*/
        /*if (labelList[el].htmlFor.substring(labelList[el].htmlFor.indexOf(".") + 1) !== "") {
            labelList[el].htmlFor = labelList[el].htmlFor.substring(labelList[el].htmlFor.indexOf(".") + 1);
        }*/
        /*Code inside the below if condition has been presicely written to address SE-30073 */
        if (window.Grids && Grids.getElementsGrid(errorElement)) {
            if (labelList[el].innerText != "") {
                var closestLabel = $(errorElement).closest(labelList[el].parentNode).children('label');
                //BUG-216627: If there are more than one element with the same id, look for the closest
                if (duplicateElementsFound && closestLabel.length == 0) continue;
                labelForElement = closestLabel;
                if (labelForElement[0] != null) break;
            }
        } else {
            /* Normal code flow for non-grid cases*/
            /*SE-34164 fix*/
            if (labelList[el].htmlFor.toLowerCase() == elemId.toLowerCase() && labelList[el].innerText != "") {
                //BUG-216627: If there are more than one element with the same id, look for the closest
                if (duplicateElementsFound && $(errorElement).closest(labelList[el].parentNode).length == 0) continue;
                labelForElement = labelList[el];
                break;
            }
        }
    } /*HFix-30073: End*/

    return labelForElement;
}
//static-content-hash-trigger-GCC
/* @package Used by harnesses for format inputs based on their HTML properties
*/
//<script>

if(pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty("bClientValidation")){
	// Formatter for SSN
    var ruleEditValidate_SSN = new validation_ValidationType("ssn", SSN_Formatter);
    ruleEditValidate_SSN.addEventFunction("onchange", SSN_Formatter);
    
	// Formatter for date type MM/DD/YYYY
    var ruleEditValidate_DateMMDDYYYY = new validation_ValidationType("datemmddyyyy", DateMMDDYYYY_Formatter);
    ruleEditValidate_DateMMDDYYYY.addEventFunction("onchange", DateMMDDYYYY_Formatter); 
    
	// Formatter for TIN
    var ruleEditValidate_TIN = new validation_ValidationType("tin", TIN_Formatter);
    ruleEditValidate_TIN.addEventFunction("onchange", TIN_Formatter);

	// Formatter for International Phone
    var ruleEditValidate_InternationalPhone = new validation_ValidationType("internationalphone", InternationalPhone_Formatter);
    ruleEditValidate_InternationalPhone.addEventFunction("onchange", InternationalPhone_Formatter);

	// Formatter for US Phone
    var ruleEditValidate_USPhone = new validation_ValidationType("usphone", USPhone_Formatter);
    ruleEditValidate_USPhone.addEventFunction("onchange", USPhone_Formatter);

	// Formatter for US Zip Code
    var ruleEditValidate_USZipCode = new validation_ValidationType("uszipcode", USZipCode_Formatter);
    ruleEditValidate_USZipCode.addEventFunction("onchange", USZipCode_Formatter);


	// Formatter for US Zip Code Extended
    var ruleEditValidate_USZipCodeExtended = new validation_ValidationType("USZipCodeExtended", USZipCodeExtended_Formatter);
    ruleEditValidate_USZipCodeExtended.addEventFunction("onchange", USZipCodeExtended_Formatter);

	// Auto Input Formatter
    var auto_input = new validation_ValidationType("auto_format", auto_InputFormat);
    auto_input.addEventFunction("onchange", auto_InputFormat);
}

var ssn_validateMsgStr = "SSN must have 9 digits and can not start with 000";
var gPreviousValue = "";


/*
@public- Validation for SSN
@param- $object$ DOM input object element that the event occurs
@return- $object$ possible validation errors if any
*/
function SSN_Validation(object){
	var ssn = object.value;
	if(null == ssn || "" == ssn){
		return;
	}
	var ssnArr = ssn.match(/^(\d{3})-?\d{2}-?\d{4}$/);
	var numDashes = ssn.split('-').length - 1;
	if (ssnArr == null || numDashes == 1) {
		return display_getValidationError(object,"",ssn_validateMsgStr, true);	
	}
	else if (parseInt(ssnArr[1],10)==0) {
		return display_getValidationError(object,"",ssn_validateMsgStr, true);	
	}
}

/*
@public- Formatter for SSN
@param- $object$ DOM input object
@return- $void$
*/
function SSN_Formatter_Old(object){
	var valEntered = object.value;
	var noOfDigits = parseInt(valEntered.length);
	if((window.event.keyCode != 8) && ((noOfDigits == 3) || (noOfDigits == 6))){
		object.value = object.value + "-";
	}
}

function SSN_Formatter(object){
	var format = "###-##-####";
	if(object.value.length == 9){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}

function DateMMDDYYYY_Formatter(object){
	var format = "##/##/####";
	if(object.value.length == 8){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}

function TIN_Formatter(object){
	var format = "##-#######";
	if(object.value.length == 9){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}
function InternationalPhone_Formatter(object){
	var format = "+### ### #### ###";
	if(object.value.length == 13){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}

function USPhone_Formatter(object){
	var format = "(###) ###-####";
	if(object.value.length == 10){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}

function USZipCode_Formatter(object){
	var format = "#####";
	if(object.value.length == 5){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}
function USZipCodeExtended_Formatter(object){
	var format = "#####-#####";
	if(object.value.length == 10){
		dFilter(object,format);
	}
	return Format_Validation(object,format);
}


function Format_Validation(object, format){
	var regExpSTR = format;
	var inputValue = object.value;
	if(null == inputValue || "" == inputValue){
		return;	
	}
	regExpSTR = regExpSTR.replace(/#/g,"\\\d");
	regExpSTR = regExpSTR.replace(/-/g,"\-?");
	regExpSTR = regExpSTR.replace(/\(/g,"\\\(");
	regExpSTR = regExpSTR.replace(/\)/g,"\\\)");
	regExpSTR = regExpSTR.replace(/\+/g,"\\\+");
	var inputRegExp = new RegExp('^' + regExpSTR + '$');
	var inputArr = inputValue.match(inputRegExp);

	if (inputArr == null) {
		return display_getValidationError(object,"",ruleEditValidate_invalidFormatMsgStr + " " +format , true);	
	}
	else{
		return;	
	}
}

/*
@public - This function calls to setFormat function in order to redraw the property according to the Rule-HTML-Property
@param- $object$ DOM input object element that the event occurs
@return- $void$
*/

function auto_InputFormat(anInput, eventType){
	if((anInput.getAttribute("format") == null) || (anInput.getAttribute("format") == "")){
		return;
	}
	if((eventType == "onclick") || (anInput.type == "checkbox") || (anInput.type == "radio") || (anInput.type == "select-one")){
		return;
	}

	//Call to target matching function with the input and the targets
	var returnString = anInput.name + "!" + anInput.getAttribute("format");
	var _puiURL = SafeURL_createFromURL(pega.u.d.url);
	_puiURL.put("pyActivity","GetTargets");	
	// Go to the server and compute targets
	var strPostData = new SafeURL();
	strPostData.put(anInput.name, anInput.value);
	strPostData.put("bClientValidation", bClientValidation);
	strPostData.put("Targets", returnString);
	strPostData.put("aWantInput", "true");
	strPostData.put("FormError",pega.u.d.formErrorType);
	strPostData.put("FieldError",pega.u.d.fieldErrorType);
	strPostData.put("pyCustomError",pega.u.d.pyCustomError);
	var htmlParams = "";
	if(anInput.getAttribute("HTMLParams") != null){
		htmlParams = "&" + anInput.getAttribute("HTMLParams");
	}
		
	// Call to the server
	gTimeout = window.setTimeout("setFormat('"+ _puiURL.toURL() +"', '"+strPostData.toQueryString() + htmlParams +"')", 500); // add time out to fix the submit button issue
}


/*
@protected- This function sets target values of the given input. 
The error messages are set in the FormErrorMarker html fragment and content is added to the RULE_KEY div.
This function does not call to the server if another call from the client is initiated.
@param- $String$ strUrl -parameter for AJAX call
@param- $String$ strPostData- parameter for AJAX call
@return- $void$
*/

function setFormat(strUrl, strPostData){

	var callbackArgs = new Array();

	var callback = {success:this.setFormatValuesSuccess, failure: this.setFormatValuesFail, scope:this, argument: callbackArgs};  
	
	// Get the stream from the server
	responseObj = pega.u.d.asyncRequest('POST', strUrl, callback, strPostData);
}

function setFormatValuesFail(responseObj){

}

function setFormatValuesSuccess(responseObj){

	var newStream = responseObj.responseText;
	
	var targetPropertyXml = pega.tools.XMLDocument.get();
	
	//load the xml
	targetPropertyXml.loadXML(newStream);

	//Get the XML element
    var targetElement = null;
  	if(targetPropertyXml && targetPropertyXml.documentElement){
		targetElement = targetPropertyXml.documentElement.selectNodes("target");
    }
	//Check for the target element
	if(targetElement == null || targetElement.length ==0){
		//Return if target element is not present
		return;
	}

	//Get the targets from the target element
	var targets = targetElement[0].childNodes;

	//Get the target property and target value
	var targetProperty = targets[0].text;
	var targetValue = targets[1].text;
	
	//Get the target elements
	var targetToFormat = pega.util.Dom.getElementsByName(targetProperty);
	for(var i=0; i<targetToFormat.length; i++){
		targetToFormat[i].parentNode.innerHTML = trim(targetValue);
		pega.u.d.processOnloads(targetToFormat[i].parentNode);
	}

	// Getting the trimmed string from the error node 
	var errorFromServer = trim(targetPropertyXml.documentElement.selectNodes("errors")[0].text);

	if(pega.u.d.formErrorType == "NONE"){
		//To refresh the custom error section
		var errorDiv =	document.createElement("DIV");
		pega.u.d.loadDOMObject(errorDiv,errorFromServer);
		pega.u.d.updateErrorSection(errorDiv);
	}else {
	// Display error messages using error table
		displayFormErrors(errorFromServer);
	}
}

function dFilter (objElement,dFilterMask){
	if(!objElement)
		return;
	if(!dFilterMask || dFilterMask=="")
		return;
	if(objElement.value.length == 0)
		return;
	dFilterNum = dFilterStrip(objElement.value, dFilterMask);
	var dFilterFinal='';
    for (dFilterStep = 0; dFilterStep < dFilterMask.length; dFilterStep++){
		if (dFilterMask.charAt(dFilterStep)=='#'){
			if (dFilterNum.length!=0){
				dFilterFinal = dFilterFinal + dFilterNum.charAt(0);
				dFilterNum = dFilterNum.substring(1,dFilterNum.length);
			}
			else{
				dFilterFinal = dFilterFinal + "";
			}
		}
		else if (dFilterMask.charAt(dFilterStep)!='#' && objElement.value.length >= dFilterStep){
			dFilterFinal = dFilterFinal + dFilterMask.charAt(dFilterStep); 			
		}
	}
	if(objElement.value != dFilterFinal)
		objElement.value = dFilterFinal;
	return false;
}

function dFilterStrip (dFilterTemp, dFilterMask){
	dFilterMask = replace(dFilterMask,'#','');
	for (dFilterStep = 0; dFilterStep < dFilterMask.length++; dFilterStep++)
		{
			dFilterTemp = replace(dFilterTemp,dFilterMask.substring(dFilterStep,dFilterStep+1),'');
		}
		return dFilterTemp;
}

function dFilterMax (dFilterMask){
	dFilterTemp = dFilterMask;
	for (dFilterStep = 0; dFilterStep < (dFilterMask.length+1); dFilterStep++){
		if (dFilterMask.charAt(dFilterStep)!='#'){
			dFilterTemp = replace(dFilterTemp,dFilterMask.charAt(dFilterStep),'');
		}
	}
	return dFilterTemp.length;
}


function replace(fullString,text,by) {
	var strLength = fullString.length, txtLength = text.length;
	if ((strLength == 0) || (txtLength == 0)) return fullString;
	var i = fullString.indexOf(text);
	if ((!i) && (text != fullString.substring(0,txtLength))) return fullString;
	if (i == -1) return fullString;
	var newstr = fullString.substring(0,i) + by;
	if (i+txtLength < strLength)
		newstr += replace(fullString.substring(i+txtLength,strLength),text,by);
	return newstr;
}
//static-content-hash-trigger-GCC
