//<!-- <HTML> -->
// <SCRIPT>
//safeurl.js


/* 
@package Safe URL provides functions to assemble, encode and return URLs and Query strings.  Query string parameters are added to the Safe URL as individual name/value pairs or by parsing an existing query string.  A clone function is provided to copy a safe URL to the current window.  To avoid multiple encloding Safe URL expects all input parameters are unencoded.
*/

SafeURL.prototype= new Hashtable;	

/*
@constructor
@api - This function is used to create a safeURL object.
@param $String$ActivityName - Optional name of the activity to use when building full URL via toURL() method. The activity name should include any required class prefix.
@param $String$reqURI - Optional requestURI.
@return $void$
*/
function SafeURL(ActivityName, reqURI) {	
    this.hashtable= {};
    this.name= 'safeURL';

    if(ActivityName != undefined && ActivityName != null && ActivityName != "") {
        this.setActivityAction(ActivityName);
    }
    if(arguments.length > 1 && reqURI != "") {
        this.put("pxReqURI", reqURI);
    }
}

/* 
@api - This function will copy the name/value pairs of another SafeURL into the safeURL object.  The bClear parameter defines if the existing values in the SafeURL object are cleared before the copy.
@param $Object$oSafeURL Target SafeURL object.
@param $boolean$bClear If true clear the target SafeURL before copy.  Default is false.
@return $void$
*/
SafeURL.prototype.copy = function(oSafeURL, bClear) {
    if (arguments.length > 1 && bClear) {
        for(var i in oSafeURL.hashtable) {
			var value = oSafeURL.get(i);
			if(value != null && typeof value != "undefined") {
		        this.put(i, value);
		    }    
        }
    }
    for(var i in oSafeURL.hashtable) {
		var value = oSafeURL.get(i);
		if(value != null && typeof value != "undefined") {
			this.put(i, value);
		}	
    }
}

/*
@api - This function is used to convert the object into a string of key - value pairs(Excluding the pyActivity or pyStream). Each separated by "&" that will be used in URL concatenation and then returns the encoded result.
@return $String$ - Query String with escape.
*/
SafeURL.prototype.toQueryStringWithEscape= function(){
    return this.toQueryString(false);
}

/*
@api - This function is used to convert the object into a string with encoding.
@return $String$ - Query String with out escape.
*/
SafeURL.prototype.toQueryStringWithoutEscape= function(){
    return this.toQueryString(true);
}

/*
@api - This method is to nullify the safe url object to avoid memory leaks when value contained object references.
@return $void$
*/
SafeURL.prototype.nullify= function(){
    var size= this.size();
    var keys= this.keys();
    for(var i=0; i <size; i++){
        this.hashtable[keys[i]]= null;
    }
}

/*
@private - apply heuristic rule to find out if the string is encoded for HTTP.
@param value - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - URL string.
@return $Boolean$ - true if escaped, false otherwise.
*/
SafeURL.prototype.mayBeEscaped= function (value) {
	if(value == null || value == "")
		return false;
	if(value.indexOf("%20") != -1 
	|| value.indexOf("%22") != -1 
	|| value.indexOf("%23") != -1 
	|| value.indexOf("%24") != -1 
	|| value.indexOf("%25") != -1 
	|| value.indexOf("%26") != -1 
	|| value.indexOf("%27") != -1 
	|| value.indexOf("%2B") != -1 
	|| value.indexOf("%2C") != -1 
	|| value.indexOf("%2F") != -1 
	|| value.indexOf("%3A") != -1 
	|| value.indexOf("%3B") != -1
	|| value.indexOf("%3C") != -1
	|| value.indexOf("%3D") != -1
	|| value.indexOf("%3E") != -1
	|| value.indexOf("%3F") != -1
	|| value.indexOf("%40") != -1
	|| value.indexOf("%5B") != -1
	|| value.indexOf("%5C") != -1
	|| value.indexOf("%5D") != -1
	|| value.indexOf("%5E") != -1
	|| value.indexOf("%60") != -1
	|| value.indexOf("%7B") != -1
	|| value.indexOf("%7C") != -1
	|| value.indexOf("%7D") != -1
	|| value.indexOf("%7E") != -1
	) 
	{
		return true;
	}
	return false;
}
              
/*
@api - Convert SafeURL object into an encoded UN-encrypted string for HTTP post body.
@return $String$ - encoded un-encrypted POST body string.
*/
SafeURL.prototype.toEncodedPostBody= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(false, false);
//	return this.toQueryString(false, true);
}
              
/*
@api - Convert SafeURL object into an EN-coded UN-encrypted query string.
@return $String$ - un-encoded, un-encrypted URL string.
*/
SafeURL.prototype.toEncodedQueryString= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(false, false);
//	return this.toQueryString(false, true);
}
              
/*
@api - Convert SafeURL object into an UN-encoded UN-encrypted query string.
@return $String$ - un-encoded, un-encrypted URL string.
*/
SafeURL.prototype.toUnencodedQueryString= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(true, false);
//	return this.toQueryString(true, true);
}

/*
@api - This function is used to convert the object into a query string. It takes a parameter that specifies to escape the result or not.
@param bDisableEscape - Boolean that specifies if the values should be escaped. The default is true.
@param bUnEscapeBefore - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - Equivalent query String of the object.
*/
SafeURL.prototype.toQueryString= function(bDisableEncode, bUnEscapeBefore){
    var result1= "";
    var result2= "";
    var bEncode= true;
    var bUnEscape= true;
    if (arguments.length > 0) {
        bEncode= !bDisableEncode;
    }
    if (arguments.length > 1) {
        bUnEscape= bUnEscapeBefore;
    }
    // ensure pzHarnessID is in the request if it's possible to obtain 
    // it from the DOM and if this request is an activity or stream request
    if (document && 
        ('pyActivity' in this.hashtable 
        || 'pyStream' in this.hashtable)) {
        var reqURI = this.hashtable["pxReqURI"];
        // insert Harness ID if no absolute external URI is specified
        if (!reqURI // no URI specified, must be local
            || reqURI[0] == ' ' || reqURI[0] == '/' // URI is relative to this host
            || (reqURI.indexOf(document.location.host) > -1)  // URI specifies this host
            ) {
            var idFromDOM = document.getElementById("pzHarnessID");
            if (idFromDOM && !this.hashtable.pzHarnessID) {
                this.hashtable.pzHarnessID = idFromDOM.value;
            }
        }
    }

    for (var i in this.hashtable) {
        if (i != "pxReqURI") {
            var value= this.hashtable[i];
            if(typeof(value)== 'string') {
// itkis, 11/24/08. unescape call commented out - was wrecking havoc with URL encryption. For
// example string %80% would get converted into %80 into %. Consequent encoding would convert it
// into %C2%80%25 - an error.
//				if(this.mayBeEscaped(value)) {
//debugger;
//				}
				if(bUnEscape) {
          //Added below code as part of BUG-664452 Fix and added unit test case for below code changes in pega_ui_template_icon_unit_test.js file
					try{
            value = decodeURIComponent(escape(unescape(value)));
          }
        catch(err){
            value = unescape(value);
          }
				}
                if (bEncode) {
                    value = encodeURIComponent(value); //all values are encoded only once
                }
            }
            if (i== "pyActivity" || i== "pyStream") {
                //result1= i + "=" + this.hashtable[i]; 
                result1= i + "=" + value; 
            }
            else if (this.hashtable[i] != null) {
                //result2 += "&" + i + "=" + this.hashtable[i];   
                if(typeof(value)== "object" && value.name== "safeURL") {
                    value= value.toURL();
                }
                result2 += "&" + i + "=" + value;   
            }
        }
    }
    if (result1== "") {
        if (result2== "" ) {
            return "";
        }
        else {
            return result2.substring(1, result2.length); //remove the leading '&'
        }
    }
    else {
        return result1 + result2;
    }
}
              
/*
@api - Convert SafeURL object into an encoded and then conditionally encrypted URL string.
@return $String$ - URL string.
*/
SafeURL.prototype.toEncryptedURL= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toURL(false, false);
//	return this.toURL(false, true);
}
              
/*
@api - Calculate absolute URL from  document.location.href. Absolute URL is typically passed 
to ActiveX controls for use in AJAX requests by the controls or companion PRPC processes such
as MS Office applications. This method is preferred to calculating absolute URL based on 
pxRequestor and pxThread Clipboard objects properties. 
For explanation see PMF Bug-59718.
@return $String$ - Absolute URL string.
*/
SafeURL.prototype.toAbsoluteURL= function () {
	var href = document.location.href;

	// Search for ?pyActivity= or ?pyStream=
	var iAct = href.indexOf("?pyActivity=");
	var iStm = href.indexOf("?pyStream=");
	if(iAct > 0) {
		return href.substr(0, iAct);
	} else if(iStm > 0) {
		return href.substr(0, iStm);
	} else {
		// Find right-most '/' in URL
		for( var i=href.length-1; i>=0; --i) {
			if( href.charAt(i) == "/") {
				return href.substr(0, i);	
			}
		}
	}
	return "ABSOLUTE_URL_NOT_FOUND";
}

SafeURL.prototype.addEventSource = function(){
  try{
    var evObj = window.event;
    /*if(window.pega && pega.util && pega.util.Event && pega.util.Event.getEvent()){
      evObj = pega.util.Event.getEvent();
    }*/
    if(evObj && evObj.target){
        var closestSec = pega.ctx.dom.closest(evObj.target, "div[node_name][class*=sectionDivStyle]");
        if(closestSec){
          var secName = closestSec.getAttribute("pyclassname") +"."+ closestSec.getAttribute("node_name");
          if(secName){
            this.put("eventSrcSection", secName);
          }
        }
    }
  }catch(e){}
}

/*
@api - This function is used to convert the object into a string of key, value pairs(Including the pyActivity or pyStream), each separated by "&" that will be used in URL concatenation and then returns the encoded result.
@param bDisableEscape - Boolean that specifies if the values should be escaped. The default is true.
@param bUnEscapeBefore - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - URL form of the object.
*/
              
SafeURL.prototype.toURL= function (bDisableEscape, bUnEscapeBefore) {
	var bNoEscape = false;
  var bUnEscapePrior = true;
  var bEncryptURLs = window.pega && pega.ctx && pega.ctx.bEncryptURLs;
     
    if (arguments.length > 0) {
        bNoEscape= bDisableEscape;
    }
    if (arguments.length > 1) {
        bUnEscapePrior= bUnEscapeBefore;
    }
    
    if(window.pega && !pega.disableEventSource){
      this.addEventSource();
    } 
	  var reqURI= "";
    if (this.hashtable["pxReqURI"]) {
        reqURI= this.hashtable["pxReqURI"];
    }
    else if (typeof pega.ctx.pxReqURI != "undefined" && pega.ctx.pxReqURI !== "") {
       reqURI = pega.ctx.pxReqURI;
    }
    else if (typeof safeUrlRequestURI != "undefined") {
        reqURI= safeUrlRequestURI;
    }
    else if (typeof gRuleFormManager != "undefined" && 
             typeof gRuleFormManager.wrapperAPI== "object" &&
             typeof gRuleFormManager.wrapperAPI.safeUrlRequestURI != "undefined") {
        reqURI= gRuleFormManager.wrapperAPI.safeUrlRequestURI;
    }
	
    var queryString= this.toQueryString(bNoEscape, bUnEscapePrior);

    if (queryString== null || queryString== "")
        return reqURI;
    else {
	var delim = "?";
	var index = reqURI.indexOf("?");
	/*itkis, 3/24/10, protect against double ? in URL in all cases, not just the portlet case.
	if (index > -1)*/
	if (index > -1 && typeof(pega) !="undefined" && typeof(pega.d) !="undefined" && typeof(pega.d.isPortlet) !="undefined" && pega.d.isPortlet == true)
	{		
		delim = "&"; // in a portlet, the url can't have more than one "?". 
	}

        if (bEncryptURLs && (queryString.indexOf("pyActivity") > -1 || queryString.indexOf("pyStream") > -1)) {
            return reqURI + delim + URLObfuscation.encrypt(queryString);
        }
        else {
            return reqURI + delim + queryString;
        }
    }
}

/*
@api - This function is used to insert an entry in the HashTable object. 
@param $String$key  Specifies the key of the entry.
@param $String$key  Specifies the corresponding value to the key of the entry.
@return $Boolean$ - True if the value is put into hash table otherwise return false.
*/
SafeURL.prototype.put= function (key, value){
    try {
        if (key== undefined || key== null || value== undefined || value== null) {

            throw "NullPointerException in SafeURL.put(key,value) {" + key + "}, {" + value + "}";
       
        }else {//if(typeof(value)== 'string' || ( typeof(value)== 'object' && value.name== 'safeURL') ){ 
           
            this.hashtable[key]= value;
            return true;
        
        }/*else {
           
            throw "InvalidArgumentException :: SafeURL only accepts strings and SafeURL objects -  {" + key + "}, {" + value + "}"; 
        }*/
    }
    catch (exception) {

        window.alert(exception);
        return false;
    }
}

/*
@api - This function is used to get a value given a name.
@param $String$key  Specifies the key.
@param $String$key  Specifies the corresponding value to the key.
@return $Boolean$ - True if the value is put into hash table otherwise return false.
*/
SafeURL.prototype.get= function (key, value){
    return this.hashtable[key];
}


/*
@private - This function is used to insert a pyStream entry in the HashTable object.
@param $String$strStreamName  Stream name.
@return $void$
*/
SafeURL.prototype.setStreamAction= function(strStreamName) {
    this.put("pyStream", strStreamName);
}

/*
@public - This function is used to insert a pyActivity entry in the HashTable object.
@param $String$strActivityName  Activity name.
@return $void$
*/
SafeURL.prototype.setActivityAction= function (strActivityName) {
    // BUG-661513 using indexOf instead of startsWith API for IE compatibility.
    if(strActivityName.indexOf("pzuiactionzzz") === 0){
      this.put("pzuiactionzzz",strActivityName.substring(14));
    }else{
      this.put("pyActivity", strActivityName);
    }
}

/***********************************************************************************************
                    Global safeURL Functions
*/

//Removed isPureEncryptedURL as it is not used.

/*
@api - This function accepts a string URL - no escaped - and returns back a safeURL object. strURL can be of format http://ht-sdevserver:9090/prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format /prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format pyActivity=abc&param1=value1... the complete string 
or it can also be of the format http://www.yahoo.com/index.htm  and have no "?" chars at all
before the last "?" will be stored in a single element in hashtable with key "pxReqURI"
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/
function SafeURL_createFromURL(strURL) {
  	if (!strURL) { //TODO MDC
      strURL = window.pega && pega.ctx && pega.ctx.url;
    }
    
  	// Decode URL if needed
	var encryptedActivityParam = "pyactivitypzZZZ=",
		indexOfActivityParam = strURL.indexOf(encryptedActivityParam);
    if (indexOfActivityParam != -1) {
		var urlFirstPart = strURL.substr(0,indexOfActivityParam),
			urlSecondPart = strURL.substr(indexOfActivityParam+encryptedActivityParam.length),
			indexOfStar = urlSecondPart.indexOf("*"),
			urlThirdPart = urlSecondPart.substr(indexOfStar+1);
			
		urlSecondPart = URLObfuscation.decrypt(urlSecondPart.substr(0,indexOfStar));
		strURL = urlFirstPart + urlSecondPart + urlThirdPart;
    }
   /*HFix-9619:end*/
	/*RAIDV(BUG-136099) - Use indexOf instead of lastIndexOf to determine query string*/	
    var index= strURL.indexOf("?");
    var reqURI;
    var oSafeURL= new SafeURL();
    if (index > -1) {     
        reqURI= strURL.substr(0, index);
        oSafeURL.put("pxReqURI", reqURI);
    }

    var myParamArray= SafeURL_getNameValuePairsAsObject(strURL.substr(index + 1, strURL.length));
    for (var i in myParamArray ) {
        // if no name/value pairs in the entire url, just put the whole thing into pxReqURI
        if (myParamArray[i]== "NoNVFound") {
            oSafeURL.put("pxReqURI", strURL);
        }
        else {
            oSafeURL.put(i, myParamArray[i]);
        }
    }
    return oSafeURL;
}


/*
@api - This function accepts a obfuscated string URL - no escaped -decodes it and returns back a safeURL object.
@deprecated
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/
function SafeURL_createFromEncryptedURL(strURL) {
    return SafeURL_createFromURL(strURL)
}

/*
@api - This function accepts a Encrypted String URL with QueryString - no escaped - and returns back a safeURL object. strURL can be of format http://ht-sdevserver:9090/prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format /prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format pyActivity=abc&param1=value1... the complete string 
or it can also be of the format http://www.yahoo.com/index.htm  and have no "?" chars at all
before the last "?" will be stored in a single element in hashtable with key "pxReqURI"
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/

function SafeURL_createFromEncryptedURLwithQueryString(strURL) {
    var strDecodeUrl = "";
    var unEncryptedQueryString="";
    if (strURL.indexOf("pyactivitypzZZZ=") != -1) { 
        //Handling encrypted URL with query string 
        if (strURL.indexOf("*&") != -1) {
		var unencryptedindex= strURL.lastIndexOf("*&");
                   if (unencryptedindex> -1) {
                      var unEncryptedQueryString=strURL.substr(unencryptedindex+ 1, strURL.length - (unencryptedindex+ 2));
                      //handle encrypted string
                      var index= strURL.lastIndexOf("pyactivitypzZZZ=");
                      if (index > -1) {
                        strDecodeUrl = strURL.substr(index+16, unencryptedindex-(index+16));
                        strURL = URLObfuscation.decrypt(strDecodeUrl );

                      }
                   }
        
        
        }else{

        var index= strURL.lastIndexOf("=");
 	if (index > -1) {
            strURL = URLObfuscation.decrypt(strURL.substr(index + 1, strURL.length - (index + 2)));
         } 
      }      
   }

   if(unEncryptedQueryString!="")
   {
      strURL =strURL +unEncryptedQueryString;
   }
    var index= strURL.indexOf("?");
    var reqURI;
    var oSafeURL= new SafeURL();
    if (index > -1) {     
        reqURI= strURL.substr(0, index);
        oSafeURL.put("pxReqURI", reqURI);
    }

    var myParamArray= SafeURL_getNameValuePairsAsObject(strURL.substr(index + 1, strURL.length));
    for (var i in myParamArray ) {
        // if no name/value pairs in the entire url, just put the whole thing into pxReqURI
        if (myParamArray[i]== null) {
            oSafeURL.put("pxReqURI", i);
        }
        else {
            oSafeURL.put(i, myParamArray[i]);
        }
    }
    return oSafeURL;

          
}



/* 
@private - This function will return an array of parameter names from a string of Parameter/Values sent to activities.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Array Name/value pairs in the collection.
*/
function SafeURL_getParameterParamNameList(strParameterValue) {
    var arNames = new Array();
	try {
		var oPars = SafeURL_getNameValuePairsAsObject(strParameterValue);
		var i=0;
		for(var oP in oPars)
			arNames[i++] = oP;
	} catch(e) {}
	return arNames;

/* itkis, 01/16/09: old code preserved for reference  
    var paramNameArray= new Array;
    if (strParameterValue != null ){
        var separateParamArray= strParameterValue.split("&");
        var count= 0;
        for (var el=0; el < separateParamArray.length; el++) {
            if (separateParamArray[el] != "") {
                var splitArray= separateParamArray[el].split("=");
                // name is the first value
                paramNameArray[count]= splitArray[0];
                count += 1;
            }
        }
    }
    return(paramNameArray);
*/
}


/* 
@private - This function will return an array of Parameter Values from a string of Parameter/Values sent to activities.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Parameter list as an array.
*/
function SafeURL_getParameterParamValueList(strParameterValue) {
    var arVals = new Array();
	try {
		var oPars = SafeURL_getNameValuePairsAsObject(strParameterValue);
	    var i=0;
	    for(var oP in oPars)
	    	arVals[i++] = oPars[oP];
	} catch(e) {}
	return arVals;

/* itkis, 01/16/09: old code preserved for reference  
    var paramValueArray= new Array;
    if(strParameterValue != null){
        var separateParamArray= strParameterValue.split("&");
        var count= 0;
        for (var el=0; el < separateParamArray.length; el++) {
            if (separateParamArray[el] != "") {
                var splitArray= separateParamArray[el].split("=");
                // value is the second value
                paramValueArray[count]= splitArray[1];
                count += 1;
            }
        }
    }
    return(paramValueArray); 
*/
}

/* 
@private - This function will return  an Object with name and value.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Object which contains name and value.
*/
function SafeURL_getNameValuePairsAsObject(strParameterValue) {
	var sParV = strParameterValue;
    var oPars = new Object();
	try {
		var sN = "";
		var sV = "";
	    if(sParV == null || sParV == "")
			return oPars;
		var arPar = sParV.split("&");
		for(var i=0; i<arPar.length; ++i) {
			var sNV = arPar[i];
			if(sNV != "") {
                var seperatorIndex = sNV.indexOf("=");
				if(seperatorIndex != -1) {
					sN = sNV.substring(0, seperatorIndex);
					sV = sNV.substring(seperatorIndex+1, sNV.length);
					oPars[sN] = sV;
				}
				else if(sParV == sNV) {
					/*No name-value pairs found.*/
					/*BUG-145095: In case no name-value pairs are found, return an unique string.*/
					oPars[sNV] = "NoNVFound";
				}
				else {
					oPars[sN] = ((typeof(oPars[sN]) != "undefined") ? oPars[sN].toString() : "") + "&" + sNV;
				}
			}
			else {
				//oPars[sN] = ((typeof(oPars[sN]) != "undefined") ? oPars[sN].toString() : "") + "&";
			}
		}
	} catch(e) {}
	return oPars;

/* itkis, 01/16/09: old code preserved for reference  
    var paramObject= new Object();
    if (strParameterValue != null ){
        var separateParamArray= strParameterValue.split("&");

        for (var el=0; el < separateParamArray.length; el++) {
            if(separateParamArray[el] != "") {
                if (separateParamArray[el].indexOf("=")!=-1) {
                    var splitArray= separateParamArray[el].split("=");
                    paramObject[splitArray[0]] = splitArray[1];
                }
                else if (strParameterValue == separateParamArray[el]) {
                    paramObject[separateParamArray[el]] = null;
                }
            }
        }
    }
    return paramObject;
*/
}

/* 
@api - This function will create a clone of a safeURL. This function should be used to clone a safeURL that is passed between IE windows where the safeURL object reference is saved and the calling window closed.
@param $Object$objSafeURL - SafeURL object.
@return $Object$ - SafeURL clone object.
*/
function SafeURL_clone (objSafeURL) {

     var  myClone= new SafeURL();
     for (var i in objSafeURL.hashtable) {
       if (objSafeURL.hashtable[i] != null) {
          if(typeof(objSafeURL.hashtable[i])== "object" && objSafeURL.hashtable[i].name== "safeURL") {
             objSafeURL.hashtable[i]= SafeURL_clone(objSafeURL.hashtable[i]);
          }
          myClone.put(i, objSafeURL.hashtable[i]);
       }
     }

     return myClone;
}

/*
@api - This method serializes a safeURL object into its equivalent xml string. 
@param $Object$objSafeURL - The safeURL object to be serialized.
@return $Object$ - Serialized safe url object.
*/
function serializeSafeURL(objSafeURL) {
    var xmlString= "<SafeURL>";
    for (var i in objSafeURL.hashtable) {
        var value= objSafeURL.hashtable[i];
        if(typeof(value)== "object" && value.name== "safeURL") {
            value= serializeSafeURL(value);
            xmlString += "<param name='safeURL' key='" + i + "'>" + value + "</param>";
        } else{
            xmlString += "<param key='" + i + "'>" + value + "</param>";
        }
    }
    xmlString += "</SafeURL>";
    return xmlString;
}

/*
@api - This method deserializes an xml string into its equivalent safeURL object.
@param $String$xmlString - The xml string to be deserialized.
@return $Object$ - Safe url object.
*/
function deserializeSafeURL(xmlString) {
    var objSafeURL= new SafeURL();
	var objXmlDom= new ActiveXObject("microsoft.xmldom");
	if (objXmlDom.loadXML(xmlString)) {
        var objChildren= objXmlDom.firstChild.childNodes;
        var maxLength= objChildren.length;
        for(var i=0; i<maxLength; i++) {
            var key= objChildren[i].getAttribute("key");
            var name= objChildren[i].getAttribute("name");
            var value= objChildren[i].text;
            if(name=="safeURL") {
                value= deserializeSafeURL(objChildren[i].firstChild.xml);
            }
	   if (value != null && typeof value != "undefined"){
	            objSafeURL.put(key, value);
	   }
        }
        return objSafeURL;
    }
    return null;
}


/****************************************************************************************
* Hashtable - included with safeURL to reduce Js include 304 response latency with server
*             (Martt - 01-18-06)
*           - Any changes to this code should be reflected in hashtable.js
*****************************************************************************************/

/**
    @constructor

    This is a Javascript implementation of the Java Hashtable object.
                    
   
     Hashtable()
              Creates a new, empty hashtable
                    
    Method(s):
     void clear() 
              Clears this hashtable so that it contains no keys. 
     boolean containsKey(String key) 
              Tests if the specified object is a key in this hashtable. 
     boolean containsValue(Object value) 
              Returns true if this Hashtable maps one or more keys to this value. 
     Object get(String key) 
              Returns the value to which the specified key is mapped in this hashtable. 
     boolean isEmpty() 
              Tests if this hashtable maps no keys to values. 
     Array keys() 
              Returns an array of the keys in this hashtable. 
     void put(String key, Object value) 
              Maps the specified key to the specified value in this hashtable. A NullPointerException is thrown is the key or value is null.
     Object remove(String key) 
              Removes the key (and its corresponding value) from this hashtable. Returns the value of the key that was removed
     int size() 
              Returns the number of keys in this hashtable. 
     Array values() 
              Returns a array view of the values contained in this Hashtable. 
                            
*/
/*
@private - Describes hastable object.
@hide
*/               

function Hashtable(){
    this.clear= hashtable_clear;
    this.containsKey= hashtable_containsKey;
    this.containsValue= hashtable_containsValue;
    this.get= hashtable_get;
    this.isEmpty= hashtable_isEmpty;
    this.keys= hashtable_keys;
    this.put= hashtable_put;
    this.remove= hashtable_remove;
    this.size= hashtable_size;
    this.toString= hashtable_toString;
    this.values= hashtable_values;
    this.hashtable= new Object();
}                
/*=======Private methods for internal use only========*/
           
/*
@public - Clears the hashtable.
@return $void$
*/     
function hashtable_clear(){
    this.hashtable= new Object();
}
                
/*
@protected
@hide - Checks if hashtable contains the passed key.
@param $String$key - Specifies key.
@return $Boolean$ - True if exists, else false.
*/               
function hashtable_containsKey(key){
    var exists= false;
    for (var i in this.hashtable) {
        if (i== key && this.hashtable[i] != null) {
            exists= true;
            break;
        }
    }
    return exists;
}
                
/*
@public - Checks if hashtable contains the passed value.
@param $String$key - Specifies value.
@return $Boolean$ - True if exists, else false.
*/
function hashtable_containsValue(value){
    var contains= false;
    if (value != null) {
        for (var i in this.hashtable) {
            if (this.hashtable[i]== value) {
                contains= true;
                break;
            }
        }
    }
    return contains;
}
              
/*
@protected
@hide - Gets the hashtable entry for passed key.
@param $String$key - Specifies key.
@return $Object$ - Returns the hashtable entry.
*/               
function hashtable_get(key){
    return this.hashtable[key];
}
 
/*
@public
@hide - Checks if hashtable is empty.
@return $Boolean$ - True if empty else false.
*/               
function hashtable_isEmpty(){
    return (this.size() == 0) ? true : false;
}

/*
@private
@hide - Gets all hashtable keys.
@return $Object$ - Returns hashtable keys as an array.
*/               
function hashtable_keys(){
    var keys= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            keys.push(i);
    }
    return keys;
}

/*
@public
@hide - Adds entries (key-value) to hashtable.
@param $String$key - Specifies key.
@param $String$value - Specifies value.
@return $Object$ - True if added succesfully.
*/               
           
function hashtable_put(key, value){
	if (key== null || value== null) {

		throw "NullPointerException {" + key + "}, {" + value + "}";
	}else{
		this.hashtable[key]= value;
		return true;
	}
}
 
/*
@public
@hide - Removes the hashtable entry given the key.
@param $String$key - Specifies key.
@return $Object$ - Entry removed from hashtable.
*/               
function hashtable_remove(key){
    var rtn= this.hashtable[key];
    this.hashtable[key]= null;
    return rtn;
}

/*
@private
@hide - Function that calculates the hashtable size.
@return $Integer$ - Returns hashtable size.
*/                
function hashtable_size(){
    var size= 0;
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            size ++;
    }
    return size;
}
  
/*
@protected
@hide - Converts the hashtable values to string type.
@return $String$ - Returns the converted values.
*/              
function hashtable_toString(){
    var result= "";
    for (var i in this.hashtable)
    {      
        if (this.hashtable[i] != null) 
            result += "{" + i + "},{" + this.hashtable[i] + "}\n";   
    }
    return result;
}
              
/*
@protected
@hide - Function that returns hashtable values.
@return $Object$ - Returns set of values.
*/  
function hashtable_values(){
    var values= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            values.push(this.hashtable[i]);
    }
    return values;
}

/**
*
*  URL encryption logic
*
**/

var URLObfuscation = {

	/* private property */
	/* tweaked to match com.pega.pegarules.util.URLObfuscation */
	_keyStr : "-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[",

	/* public method for encrypting */
	encrypt : function(input) {
	//var key = getCookie();
                   var key = getObfuscationKey();
		if (key == null) {
			return URLObfuscation.encode(input);
		}
		var bkey = stringToByteArray(key);
		var ba = rijndaelEncrypt(input, formatKey(bkey));
		var str = byteArrayToHex(ba);
		var res = "pyactivitypzZZZ=" + str + "*";
		return res;
	},
	
	/* public method for decrypting */
	decrypt : function(input) {
		//var key = getCookie();
    var key = null;
    if(input.startsWith("CXtnbH0%3D")){
      key = pega.d.globalobfuscateKey;
      input = input.substring(10);
    }else{
      key = getObfuscationKey();
    }
		if (key == null) {
			return URLObfuscation.decode(input);
		}
		var bkey = stringToByteArray(key);
		var ba = rijndaelDecrypt(hexToByteArray(input), formatKey(bkey));
	  return decodeURI(byteArrayToString(ba));
	},

	/* public method for encoding */
	encode : function (input) {
		/* alert("base64 encode: " + input); */
		if (input.indexOf("pyactivitypzZZZ=") == 0) {
			/* alert("string already encoded, returning"); */
			return input;
		}
		var xorConst=0x5a;
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = URLObfuscation._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++) ^ xorConst;
			chr2 = input.charCodeAt(i++) ^ xorConst;
			chr3 = input.charCodeAt(i++) ^ xorConst;

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			/* note that this algorithm, unlike many, does NOT
			   insert newline characters to limit the length of a line
			   to 72 characters. For our purposes, the omission of newline
			   characters is ESSENTIAL so this is a good thing! */
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		/* insert the marker used by the server to recognized obfuscated segments */
		var res = "pyactivitypzZZZ=" + output + "*";
		/* alert("URLObfuscation output: " + res); */
		return res;
	},

	/* public method for decoding */
	decode : function (input) {
		var xorConst=0x5a;
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		/* tweaked to match encoding used above */
		input = input.replace(/[^\-\_0-9a-zA-Z\[]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			chr1 ^= xorConst;
			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				chr2 ^= xorConst;
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				chr3 ^= xorConst;
				output = output + String.fromCharCode(chr3);
			}

		}

		output = URLObfuscation._utf8_decode(output);

		return output;

	},

	/* private method for UTF-8 encoding */
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	/* private method for UTF-8 decoding */
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c, c1, c2, c3;
		c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	}
}

/* 
   The following encryption logic is a modified version of the javascript copied from 

   http://javascript.about.com/library/blencrypt.htm

   which is itself a modification of the original implementation of encryption
   in javascript.

   The copyright notice from the original is shown here:

   rijndael.js      Rijndael Reference Implementation
   Copyright (c) 2001 Fritz Schneider

 This software is provided as-is, without express or implied warranty.
 Permission to use, copy, modify, distribute or sell this software, with or
 without fee, for any purpose and by any individual or organization, is hereby
 granted, provided that the above copyright notice and this paragraph appear
 in all copies. Distribution as a part of an application or binary must
 include the above copyright notice in the documentation and/or other materials
 provided with the application or distribution.

 Note that the following code is a compressed version of Fritz's code
 and is only about one third the size of his original
 compressed version courtesy of Stephen Chapman (javascript.about.com)

 */

// key size & block size, respectively
var BS=128;
var BB=128;

//RoundsArray
var RA=[,null,null,null,[,null,null,null,10,null,12,null,14],null,
						[,null,null,null,12,null,12,null,14],null,
						[,null,null,null,14,null,14,null,14]];

// ShiftOffsets
var SO=[,null,null,null,[,1,2,3],null,[,1,2,3],null,[,1,3,4]];

//Round Constants
var RC=[0x01,0x02,0x04, 0x08,0x10,0x20,0x40,0x80,0x1b,0x36,0x6c,
				0xd8,0xab,0x4d,0x9a,0x2f,0x5e,0xbc,0x63,0xc6,0x97,0x35,0x6a,0xd4,
				0xb3,0x7d,0xfa,0xef,0xc5,0x91];

//Precomputed lookup table for the SBox
var SB=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
				118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,
				114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,
				216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,
				235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,
				179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,
				190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,
				249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
				188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,
				23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,
				144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,
				6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,
				141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,
				46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,
				181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,
				248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,
				140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,
				22];
				
// Precomputed lookup table for the inverse SBox
var SBI=[82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,
				251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,
				233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,
				250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,
				109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,
				204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,
				70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,
				228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,
				193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,
				234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,
				53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,
				41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,
				198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,
				51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,
				127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,
				224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,
				23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,
				125];

// key obfuscation
var xorMask=[0xe2, 0xc8, 0xf5, 0x32, 0x5c, 0x26, 
		0xb9, 0x65, 0x37, 0x41, 0x30, 0x52, 0xf5, 0xa4, 0x89, 0xd5, 0x73, 0x16, 
		0xcc, 0x45, 0xaf, 0x8e, 0x16, 0x3f, 0xf1, 0x27, 0x1c, 0xe7, 0x86, 0x07, 
		0x3c, 0xaa, 0xde, 0x8c, 0x5c, 0xed, 0x45, 0xe4, 0xe6, 0xdc, 0x7c, 0xf0, 
		0x00, 0xf0, 0xe7, 0x01, 0x48, 0x4e, 0xf6, 0x22, 0x0f, 0xf7, 0x56, 0x11, 
		0xb9, 0xc8, 0x58, 0x90, 0xe8, 0xcf, 0xfe, 0x6b, 0xd5, 0x04, 0xb1, 0x0b, 
		0xee, 0x0e, 0x0c, 0x2d, 0x23, 0x3a, 0x64, 0x12, 0x59, 0x9b, 0x55, 0xe4, 
		0x76, 0xcc, 0x2f, 0xec, 0x15, 0xce, 0x34, 0x13, 0xc1, 0x50, 0x80, 0xe6, 
		0xf6, 0x77, 0xe9, 0x10, 0x03, 0x8e, 0xfc, 0xed, 0xe4, 0x78, 0x32, 0x43, 
		0x58, 0x27, 0x72, 0x07, 0x0a, 0x1e, 0x41, 0x99, 0x80, 0x88, 0x91, 0x31, 
		0x92, 0xd7, 0x36, 0x3a, 0xe6, 0x26, 0x0d, 0x1b, 0x95, 0x5a, 0xc2, 0x2d, 
		0x0f, 0x55, 0x20, 0x65, 0x6b, 0xd6, 0xac, 0xbc, 0xfd, 0x8a, 0x8f, 0xf0, 
		0xfb, 0x89, 0x41, 0x30, 0x89, 0xf1, 0x91, 0x83, 0x8e, 0x0a, 0xf8, 0xc2, 
		0x2a, 0x56, 0x4b, 0x01, 0x29, 0xbb, 0xda, 0xd1, 0x3e, 0x38, 0xc7, 0xff, 
		0xd1, 0x20, 0x63, 0xfd, 0x5b, 0xfc, 0x87, 0xd7, 0xf7, 0x47, 0xff, 0xb9, 
		0xe4, 0xef, 0x27, 0xe0, 0xed, 0x6e, 0x50, 0x23, 0xcc, 0xf5, 0xa7, 0x7f, 
		0xa4, 0x1b, 0xd3, 0x8a, 0xdd, 0x6d, 0x59, 0x8e, 0x1c, 0xef, 0xb2, 0x81, 
		0xd4, 0xdd, 0x8a, 0x67, 0x5e, 0xe9, 0xb8, 0xd6, 0xa6, 0x6f, 0x50, 0x5f, 
		0x92, 0x74, 0xc1, 0x7c, 0xb5, 0x09, 0x33, 0x50, 0x1f, 0x2e, 0x26, 0x5b, 
		0xa7, 0xfb, 0x88, 0x17, 0x97, 0xbf, 0xeb, 0xf8, 0xf8, 0xea, 0xac, 0x35, 
		0xcd, 0xd7, 0xbe, 0x94, 0x25, 0x7f, 0x8e, 0xef, 0xfc, 0xa2, 0x08, 0xdf, 
		0xdd, 0x92, 0x26, 0x51, 0xb8, 0xca, 0x9e, 0x00, 0x0b, 0x0c];

function cSL(TA,PO){
	var T=TA.slice(0,PO);
	TA=TA.slice(PO).concat(T);
	return TA;
}

// Cipher parameters ... do not change these
var Nk=BS/32;
var Nb=BB/32;
var Nr=RA[Nk][Nb];

// XTime
function XT(P){
	P<<=1;
	return((P&0x100) ? (P^0x11B) : (P));
}

//mult_GF256
function GF(x, y) {
	var B,R=0;
	for(B=1; B<256; B*=2,y=XT(y)) {
		if(x&B)
			R^=y;
	}
	return R;
}

// byteSub, DR=e for encrypt or DR=d for decrypt
function bS(SE,DR){
	var S;
	if(DR=="e")
		S=SB;
	else 
		S=SBI;
	for(var i=0; i<4; i++)
		for(var j=0; j<Nb; j++)
			SE[i][j]=S[SE[i][j]];
}

// shiftRow
function sR(SE,DR) {
	for(var i=1; i<4; i++)
		if (DR=="e")
			SE[i]=cSL(SE[i],SO[Nb][i]);
		else
			SE[i]=cSL(SE[i],Nb-SO[Nb][i]);
}

// mixColumn
function mC(SE,DR) {
	var b=[];
	for(var j=0; j<Nb; j++) {
		for(var i=0; i<4; i++) {
			if (DR=="e")
				b[i]=GF(SE[i][j],2)^GF(SE[(i+1)%4][j],3)^SE[(i+2)%4][j]^SE[(i+3)%4][j];
			else
				b[i]=GF(SE[i][j],0xE)^GF(SE[(i+1)%4][j],0xB)^GF(SE[(i+2)%4][j],0xD)^GF(SE[(i+3)%4][j],9);
		}
		for(var i=0; i<4; i++)
			SE[i][j]=b[i];
	}
}

// addRoundKey
function aRK(SE,RK) {
	for(var j=0; j<Nb; j++) {
		SE[0][j]^=(RK[j]&0xFF);
		SE[1][j]^=((RK[j]>>8)&0xFF);
		SE[2][j]^=((RK[j]>>16)&0xFF);
		SE[3][j]^=((RK[j]>>24)&0xFF);
	}
}

// key obfuscation
function OY(Y) {
	var numBytes = Y.length;
  var output = [];
  // process segment so that remaining length is multiple of 256 bytes
	var nOdd = numBytes % 256;
	var idx,jdx;
  for (idx = 0; idx < nOdd; idx++) {
  	output[idx] = Y[idx] ^ xorMask[idx];
  }
  // now process blocks of 256 bytes
  while (idx < numBytes) {
	 	for (jdx = 0; jdx < 256; jdx++) {
	    output[idx] = Y[idx] ^ xorMask[jdx];
	    idx++;
	  }
  }
  return output;
}

// keyExpansion
function YE(Y) {
	var EY=[];
	var T;
	Nk=BS/32;
	Nb=BB/32;
	Nr=RA[Nk][Nb];
	for(var j=0; j<Nk; j++)
		EY[j]=(Y[4*j])|(Y[4*j+1]<<8)|(Y[4*j+2]<<16)|(Y[4*j+3]<<24);
	for(j=Nk; j<Nb*(Nr+1); j++) {
		T=EY[j-1];
		if (j%Nk==0)
			T=((SB[(T>>8)&0xFF])|(SB[(T>>16)&0xFF]<<8)|(SB[(T>>24)&0xFF]<<16)|(SB[T&0xFF]<<24))^RC[Math.floor(j/Nk)-1];
		else if (Nk>6&&j%Nk==4)
			T=(SB[(T>>24)&0xFF]<<24)|(SB[(T>>16)&0xFF]<<16)|(SB[(T>>8)&0xFF]<<8)|(SB[T&0xFF]);
		EY[j]=EY[j-Nk]^T;
	}
	return EY;
}

// Round
function Rd(SE,RK) {
	bS(SE,"e");
	sR(SE,"e");
	mC(SE,"e");
	aRK(SE,RK);
}

// InverseRound
function iRd(SE,RK) {
	aRK(SE,RK);
	mC(SE,"d");
	sR(SE,"d");
	bS(SE, "d");
}

// FinalRound
function FRd(SE,RK) {
	bS(SE,"e");
	sR(SE,"e");
	aRK(SE,RK);
}

// InverseFinalRound
function iFRd(SE,RK) {
	aRK(SE,RK);
	sR(SE,"d");
	bS(SE,"d");
}

// basic encryption function
function encrypt(bk,EY) {
	var i;
	if (!bk||bk.length*8!=BB)
		return;
	if (!EY)
		return;
	bk=pB(bk);
	aRK(bk,EY);
	for(i=1; i<Nr; i++)
		Rd(bk,EY.slice(Nb*i,Nb*(i+1)));
	FRd(bk,EY.slice(Nb*Nr));
	return uPB(bk);
}

// basic decryption function
function decrypt(bk,EY) {
	var i;
	if (!bk||bk.length*8!=BB)
		return;
	if (!EY)
		return;
	bk=pB(bk);
	iFRd(bk,EY.slice(Nb*Nr));
	for(i=Nr-1; i>0; i--)
		iRd(bk,EY.slice(Nb*i,Nb*(i+1)));
	aRK(bk,EY);
	return uPB(bk);
}

// packBytes
function pB(OT) {
	var SE = [];
	if (!OT||OT.length%4)
		return;
	SE[0]=[];
	SE[1]=[];
	SE[2]=[];
	SE[3]=[];
	for(var j=0;  j<OT.length; j+=4) {
		SE[0][j/4]=OT[j];
		SE[1][j/4]=OT[j+1];
		SE[2][j/4]=OT[j+2];
		SE[3][j/4]=OT[j+3];
	}
	return SE;
}

// unpackBytes
function uPB(PK) {
	var R=[];
	for(var j=0; j<PK[0].length; j++) {
		R[R.length]=PK[0][j];
		R[R.length]=PK[1][j];
		R[R.length]=PK[2][j];
		R[R.length]=PK[3][j];
	}
	return R;
}

// formatPlaintext
function fPT(PT) {
	var bpb=BB/8;
	var i;
	if(typeof PT=="string"||PT.indexOf) {
		PT=PT.split("");
		for(i=0; i<PT.length; i++)
			PT[i]=PT[i].charCodeAt(0)&0xFF;
	}
	for(i=bpb-(PT.length%bpb); i>0&&i<bpb; i--)
		PT[PT.length]=0;
	return PT;
}

// encryption entry point
function rijndaelEncrypt(PT,Y) {
	var EY,i,abk;
	var bpb=BB/8;
	var ct;
	if(!PT||!Y)
		return;
	if(Y.length*8!=BS)
		return;
	ct=[];
	PT=fPT(PT);
	
	Y=OY(Y);
	EY=YE(Y);
	
	for (var bk=0; bk<PT.length/bpb; bk++){
		abk=PT.slice(bk*bpb,(bk+1)*bpb);
		ct=ct.concat(encrypt(abk,EY));
	}
	return ct;
}

// decryption entry point
function rijndaelDecrypt(CT,Y) {
	var EY;
	var bpb=BB/8;
	var pt=[];
	var abk;
	var bk;
	if(!CT||!Y||typeof CT=="string")
		return;
	if(Y.length*8!=BS)
		return;
	Y=OY(Y);
	EY=YE(Y);
	for(bk=(CT.length/bpb)-1; bk>0; bk--){
		abk=decrypt(CT.slice(bk*bpb,(bk+1)*bpb),EY);
		pt=abk.concat(pt);
	}
	pt=decrypt(CT.slice(0,bpb),EY).concat(pt)
	return pt
}

function stringToByteArray(st) {
	var bA=[];
	for(var i=0; i<st.length; i++)
		bA[i]=st.charCodeAt(i);
	return bA;
}

function byteArrayToString(bA) {
	var R="";
          if(!bA)
             return;
	for(var i=0; i<bA.length; i++)
	if (bA[i]!=0) 
		R+=String.fromCharCode(bA[i]);
	return R;
}
 
function byteArrayToHex(bA) {
 	var R="";
 	if(!bA)
 		return;
 	for(var i=0; i<bA.length; i++)
 		R+=((bA[i]<16)?"0":"")+bA[i].toString(16);
 	return R;
}
 
function hexToByteArray(hS) {
	var bA=[];
	if(hS.length%2)
 		return;
	if(hS.indexOf("0x")==0||hS.indexOf("0X")==0)
		hS = hS.substring(2);
	for (var i=0; i<hS.length; i+=2)
		bA[Math.floor(i/2)]=parseInt(hS.slice(i,i+2),16);
	return bA;
}

// build key in reverse order of byte array passed in
// take maximum of 'size' number of bytes
function formatKey(ba) {
	var i;
	var j = 0;
	var size = BS / 8;
	var bakey = [];
	for (i = ba.length - 1; i > -1; i--) {
		bakey[j++] = ba[i];
		if (j == size) {
			break;
		}
	}
	
	// if not big enough, append bytes to exact size
	if (j < size) {
		for (var k = j; k < size; k++) {
			bakey[k] = j + 60;
		}
	}
	return bakey;
}	

// Retrieve the value of the cookie with the specified name.  
// If operating in the GadgetManager document obtain the cookie from the gadget manager object.
// other obtain the cookie from prGatewaySESSIONID.  As a default use JSESSIONID
function getCookie() {
	try {
		var strJSESSIONID = "";
		if (typeof(pega) !="undefined" && pega && pega.web && pega.web.mgr && !pega.web.mgr._bDirectPRPC) {
			return pega.web.mgr.getCookie();
		}
		else {
			var aCookie = window.document.cookie.split("; ");
			for (var i=0; i < aCookie.length; i++) {
				// a name/value pair (a crumb) is separated by an equal sign
				var aCrumb = aCookie[i].split("=");
				if ("prGatewaySESSIONID" == aCrumb[0]) {
// itkis, 11/24/08. unescape call commented out per SOLOM.    			
//         			return unescape(aCrumb[1]).toLowerCase();
		     		return aCrumb[1].toLowerCase();
				} 
				else if ("JSESSIONID" == aCrumb[0]) {
//					strJSESSIONID = unescape(aCrumb[1]).toLowerCase();
					strJSESSIONID = aCrumb[1].toLowerCase();
				}
			}
		} 
	}
	catch(exception) {}
	return strJSESSIONID;
}


// Retrieve the value of the cookie with the specified name.  
// If operating in the GadgetManager document obtain the cookie from the gadget manager object.
// other obtain the cookie from prGatewaySESSIONID.  As a default use Pega-RULES
function getObfuscationKey() {
	try {
		var strJSESSIONID = "";
		if (typeof(pega) !="undefined" && pega && pega.web && pega.web.mgr && !pega.web.mgr._bDirectPRPC) {
			return pega.web.mgr.getCookie();
		}
		else {
			strJSESSIONID = pega.d.obfuscateKey;	
		} 
	}
	catch(exception) {}
	//This block of code is necessary when gadget is deployed without gateway
    if(strJSESSIONID==null || strJSESSIONID==""){
		var cookie = pega.web.mgr.getCookie().toLowerCase();
		strJSESSIONID = cookie;
	}
	return strJSESSIONID;
}
//static-content-hash-trigger-GCC