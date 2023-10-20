//
//<script>
//
/* @package Used by harnesses for client side experssions calculations
*/

var TargetID = "CV";
//Map to store the expression meta data
var rule_declare_expressions_ValidationTypes = new Array(); 
var select_elements_name_target_array = new Array();
var select_elements_name_value_array = new Array();

//Type declaration
{
	//Create the validation type object with empty default function
	var calculateExpression = new validation_ValidationType("calculateexpression");

	//Set onchange event to call the function
	calculateExpression.addEventFunction("onchange", calculateExpressions);

	//Set onclick event to call the function
	calculateExpression.addEventFunction("onclick", calculateExpressions);
}

var disableLUOnChange = false;

/*@protected-	This function creates the validation type element	
  @param- $object$input_name - DOM input object
  @param- $object$targets - tartet properties
  @return- $void$
*/
function rule_declare_expression(input_name, targets ){
	rule_declare_expressions_ValidationTypes[input_name] = targets;
}

/*@protected- This function is adding "expressioncalculation"to the validationType attribute.
@param $object$anInput- DOM input object element that the event occurs
@return- $boolean$
*/

function init_expression_calculation(anInput){

	//Get the targets by passing the entry handle to the map
	var targets = rule_declare_expressions_ValidationTypes[anInput.name];

	//Check the target
	if(targets==null){
		
		//Get the targets by passing the entry handle for page properties to the map
		targets = rule_declare_expressions_ValidationTypes[validation_getEntryHandleForPageProperties(anInput.name)];
	}

	//Check the target
	if(targets!=null){

		//Create a validation type array
		var valTypeArray = validation_removeSpaces(anInput.getAttribute("validationType")).split(",");

		//Loop through the validation type array
		for(var j=0; j<valTypeArray.length; j++){
			
			// If calculateexpression is already added, return the function
			if(valTypeArray[j] == "calculateexpression"){
				return;
			}
		}
		//Check for empty validation type
		if(anInput.getAttribute("validationType") == ""){

			//Added calculateexpression with no preceding comma
			anInput.setAttribute("validationType", "calculateexpression");
		}
		else{

			//Added calculateexpression with preceding comma
			anInput.setAttribute("validationType", anInput.getAttribute("validationType") + ",calculateexpression");
		}
		return true;
	}
	return;
}

/*@protected- This function form the URL to pass to the server and call to the getFromServer function using a timeout.    
  @param $object$anInput- DOM input object element that the event occurs
  @return $String$
*/

function calculateExpressions(anInput, eventType){
	if(disableLUOnChange) {
		return;
	}
  if((eventType == "onchange") && ((anInput.type == "checkbox") || (anInput.type == "radio"))){
		return "terminate";
	}
	else if((eventType == "onclick") && !((anInput.type == "checkbox") || (anInput.type == "radio"))){
		return "terminate";
	}
	if(!pega.util.Dom.getElementsById(TargetID,document)){
		return;
	}	
  
	//Get the target by passing the entry handle to the map
	var targetsObj = rule_declare_expressions_ValidationTypes[anInput.name];

	//Get the target by passing the entry handle for page properties to the map
	var pageTargetsObj = rule_declare_expressions_ValidationTypes[validation_getEntryHandleForPageProperties(anInput.name)];
	
	//If normal property targtes are not found and page property targets are found, use page targets only
	if(!targetsObj && pageTargetsObj){
		targetsObj = pageTargetsObj
	}else if(targetsObj && pageTargetsObj){// If both, normal property targets and  page property targets are found then append page type properties to usual property target array

		var newTargObj = new Hashtable();		
		var tempLen = newTargObj.length;
		for(var i=0;i<tempLen ;i++){
			newTargObj.put(targetsObj[i],"true");
		}		
		tempLen = pageTargetsObj.length;
		for(var i=0;i<tempLen;i++){
			newTargObj.put(pageTargetsObj[i],"true");
		}
		targetsObj = new Array();
		tempLen = newTargObj.size();
		for(var i=0;i<tempLen;i++){
			targetsObj.push(newTargObj.keys()[i]);
		}
		newTargObj = null;		
	}
	
	//Check the target
	if(targetsObj!=null){
		//Call to target matching function with the input and the targets
		var returnString = matchTargets(anInput, targetsObj);
		var format;
		
		//Check for targets
		if(returnString==""){
			
			//If no target present, return the function
			return;
		}else{
			var tmp = returnString.split("~~");
			returnString = tmp[0];
			format = tmp[1];
		}

		// Go to the server and compute targets
		var strPostData = new SafeURL();
		if(anInput.type == "checkbox"){
			strPostData.put(anInput.name, anInput.checked);
		}
		else{
			var _anInputValue = anInput.value;
      if (anInput.tagName && anInput.tagName.match(/^(input)$/gi) && anInput.getAttribute("data-formatting") && anInput.getAttribute("data-formatting") === "done") {
        _anInputValue = anInput.getAttribute("data-value");
      }
			strPostData.put(anInput.name, _anInputValue);
		} 


		var selectElements = document.getElementsByTagName("select");
		
		for(var i=0; i<selectElements.length;i++){
			if(rule_declare_expressions_ValidationTypes[validation_getEntryHandleForPageProperties(selectElements[i].name)]!=null){
				strPostData.put(selectElements[i].name, selectElements[i].value);
			}
		}
    if(returnString){
      callGetTargets(returnString, strPostData,anInput,format); 
    }
	}
}

/*@private- This function calculates and sets the target values of the given input.
The URL is passed to the function and the corresponding matches are taken from the map. The corresponding targets in the DOM are formed using matchTargets function.
The input property, value, primary page and targets are passed to the GetTargets activity and a XML of changed properties with
their entryHandles and values and error messages from the server are returned to the script. The script loop over the DOM and set the new value. The error messages are set in the FormErrorMarker html fragment and content is added to the RULE_KEY div. This function does not call to the server if another call from the client is initiated.
@param- $String$strUrl -parameter for AJAX call
@param- $String$strPostData- parameter for AJAX call
@return- $void$
*/

function getFromServer(strUrl, strPostData, srcInput){
	if(srcInput) {		
		/*BUG-38756 Start
		 *window.rowDeleted is defined only when delete icon is clicked in repeating layouts
		 *it's undefined in other cases. window.rowDeleted is set in 'RemoveFromList()' & 'doGridAction()'
		 */
		if((typeof window.rowDeleted)== 'undefined')
			window.rowDeleted = false;		
		if(!pega.util.Dom.inDocument(srcInput)){
			/*BUG-25841 :don't call getTargets if the src Input element which triggered the expression calc is no longer present in the DOM*/
			if(window.rowDeleted){
				if (pega.c && pega.c.actionSequencer && !pega.u.d.isAjaxInProgress()){
					pega.c.actionSequencer.resume();
				}
				return;
			}
			else{
				var newDomEle = document.getElementsByName(srcInput.name);
				if (!newDomEle) {
					if (pega.c && pega.c.actionSequencer && !pega.u.d.isAjaxInProgress()){
						pega.c.actionSequencer.resume();
					}
					return;
				}
				var i = 0;
				if(srcInput.type == "radio"){
					var newEleLength = newDomEle.length;
					while (i < newEleLength) {
						if (newDomEle[i].id == srcInput.id) {
							break;
						}
						i++;
					}
				} else {
					i = newDomEle.length - 1;
				}
				if(!pega.util.Dom.inDocument(newDomEle[i])){
					if (pega.c && pega.c.actionSequencer && !pega.u.d.isAjaxInProgress()){
						pega.c.actionSequencer.resume();
					}
					return;
				}
				srcInput = newDomEle[i];				
			}			
		}
		window.rowDeleted = false; /*reset this property.*/
		/*BUG-38756 End*/
		/*BUG-25841 :if an ajax request is already in progress and the src Input element is a child of the element being refreshed, don't call getTargets*/
		if(typeof pega != "undefined" && typeof pega.u != "undefined" && typeof pega.u.d != "undefined" && pega.u.d.preReloadEle && pega.util.Dom.isAncestor(pega.u.d.preReloadEle,input[0])) {
			if (pega.c && pega.c.actionSequencer && !pega.u.d.isAjaxInProgress()){
				pega.c.actionSequencer.resume();
			}
			return;		
		}

	}
	if (pega.c && pega.c.actionSequencer){
		pega.c.actionSequencer.pause();
	}
	var callbackArgs = new Array();

  //Get the harness id of the harness in which input element present
    var inputHarnessId = (srcInput && srcInput!="")?$(srcInput).closest("*[data-harness-id]")[0].getAttribute("data-harness-id"): pega.ctx.pzHarnessID;
  if(inputHarnessId){
      callbackArgs["inputHarnessId"]= inputHarnessId;
    }
  
	var callback = {success:this.setTargetValuesSuccess, failure: this.setTargetValuesFail, scope:this, argument: callbackArgs};  
	//chens3 add Change Tracker Id to request if present 
	if(pega.ui.ChangeTrackerMap.getTracker().id)
 	   strUrl += "&AJAXTrackID="+pega.ui.ChangeTrackerMap.getTracker().id;
		// Get the stream from the server
	responseObj = pega.u.d.asyncRequest('POST', SafeURL_createFromURL(strUrl), callback, strPostData);

	//var newStream = httpRequestAsynch(strUrl,strPostData, 50, 100);
	
}
function updateExpressionTargetsFromList(ct_changedPropertiesList){
	var isAllNAG = true;
	var isFormat = false;	
	var tmpFormat = "";
	var targetString = "";
	var format = "";	
	var elementList = pega.util.Dom.getElementsById(TargetID,document);
	if(elementList==null)return;
	
	for(var k=0;k<elementList.length; k++){
		var elementName = elementList[k].getAttribute("name");	
		for(var i=0;i< ct_changedPropertiesList.length;i++){
			if(pega.u.property.toReference(elementName) == ct_changedPropertiesList[i] ){
				targetString += getTargetString(elementList[k]);
				tmpFormat = getTargetFormat(elementList[k]);
				if(tmpFormat!=""){
					isAllNAG = false;
				}

				if(tmpFormat && tmpFormat!="NF"){
					isFormat = true;
				}
				if(tmpFormat=="")
					tmpFormat = "-";
				format += tmpFormat + "|"; 
				break;
			}
		}
		
	}
	
	targetString = targetString.substring(0, targetString.length - 1);
	
	if(isAllNAG){
		format = "";
	}else if(!isAllNAG && !isFormat){
		format = "NF";
	}
  /* BUG-390316: Check for targets. If no target present, return the function */
  if(targetString === "") {
    return;
  }
	callGetTargets(targetString,"","",format);
}

function setTargetValuesSuccess(responseObj){
	if (pega.c && pega.c.actionSequencer && !pega.u.d.gIsScriptsLoading && !pega.u.d.isAjaxInProgress()) {
		pega.c.actionSequencer.resume();
	}
	var newStream = responseObj.responseText;
	var targetPropertyXml = pega.tools.XMLDocument.get();
	
	//load the xml
	targetPropertyXml.loadXML(newStream);
  var inputHarnessId = responseObj.argument["inputHarnessId"];
	
	//Get the XML element
	/*
	var targetElement = targetPropertyXml.documentElement.selectNodes("target");


	//Check for the target element
	if(targetElement == null){
		//Return if target element is not present
		
		
		return;
	}
	*/
	
	
	if(targetPropertyXml.documentElement != null){
		// chens3 call ChangeTrackerJSON parser BUG-620675
		if(newStream){
			pega.ui.ChangeTrackerMap.getTracker().parseForChangeTrackerDiv(newStream , true);
		}
		//Get the targets from the target element
		var targets = targetPropertyXml.documentElement.selectNodes("target");	
		//Check for targets
		if(targets != null){
		
			//Loop through the targets
			for(var j=0; j<targets.length; j++){

				//Get the target property and target value
				//var targetProperty = targets[j].selectSingleNode("targetProperty").nodeTypedValue;
				//var targetValue = targets[j].selectSingleNode("value").nodeTypedValue;
				
				var targetProperty = targets[j].childNodes[0].text;
				var targetValue = targets[j].childNodes[1].text;
				//Get the target elements
				var elementList=[];
        var checkHarnessID = false;
        if(inputHarnessId){
          var harnessArr = document.querySelectorAll("[data-harness-id = '"+inputHarnessId+"']");
          for(var index=0; index<harnessArr.length;index++){
            var _element = pega.util.Dom.getElementsById(TargetID,harnessArr[index]);
            if(_element) {
              elementList = elementList.concat(_element);
            }
          }
      		checkHarnessID = true;
    	}
        if(!inputHarnessId || elementList.length===0){
            elementList= pega.util.Dom.getElementsById(TargetID,document);
        }
        
				if((Array.isArray(elementList) && elementList.length!==0) || (!Array.isArray(elementList) && elementList)){
					for(var k=0;k<elementList.length; k++){
            var closestHarnessArray = $(elementList[k]).closest("*[data-harness-id]");
						var closestHarness = (checkHarnessID && closestHarnessArray && closestHarnessArray.length)?closestHarnessArray[0].getAttribute("data-harness-id"):null;
						//Check for the element name with the target property
						if(targetProperty == elementList[k].getAttribute("name") && closestHarness == inputHarnessId){
							//Set the target value to the element						
							if(targetValue.indexOf("<SPAN") > -1){
								elementList[k].parentNode.innerHTML = targetValue;
							}else{
								if(elementList[k].innerHTML != targetValue){
									elementList[k].innerHTML = targetValue;
								}
							}
						}
					}
				}else{
          var closestHarnessArray = $(elementList).closest("*[data-harness-id]");
					var closestHarness = (checkHarnessID && closestHarnessArray && closestHarnessArray.length)?closestHarnessArray[0].getAttribute("data-harness-id"):null;
					//Check for the element name with the target property					
					if(elementList && targetProperty == elementList.getAttribute("name") && closestHarness == inputHarnessId ){
								
						//Set the target value to the element
						elementList.parentNode.innerHTML = targetValue;
					}
				
				}
				
			}
		}
		
		// Getting the trimmed string from the error node 
		//var errorFromServer = trim(targetElement.selectSingleNode("errors").nodeTypedValue);
		var errorFromServer = trim(targetPropertyXml.documentElement.selectNodes("errors")[0].text);
		if(!errorFromServer) return; // SE-28220 fix bajaj
		if(pega.u.d.formErrorType == "NONE"){
			//To refresh the custom error section
			var errorDiv =	document.createElement("DIV");
			pega.u.d.loadDOMObject(errorDiv,errorFromServer);
			pega.u.d.updateErrorSection(errorDiv);
		}else {
		// Display error messages using error table
			var errorMarkers = pega.util.Dom.getElementsById("PegaRULESErrorFlag",document); 	
			if (!errorMarkers){
				displayFormErrors(errorFromServer);
			}
		}
	}
}

function setTargetValuesFail(responseObj){
	if (pega.c && pega.c.actionSequencer && !pega.u.d.gIsScriptsLoading && !pega.u.d.isAjaxInProgress()) {
		pega.c.actionSequencer.resume();
	}
}

/*@private- This function get the inputElement and corresponding targets without line numbers.
By looking at the input property entry handle a new string of full entry handles are formed.
@param $Object$inputElement- DOM input object element that the event occurs
@param $Array$outputs- array of target properties
@return $String$ targetString
*/

function matchTargets(inputElement, outputs){

	//Get the entry handle of the input element
	//For e.g. "$PpyWorkPage$pOrders$l1$pOrderItems$l1$pQuantity"
	input = inputElement.name;

	var targetString = "";
	
	//Format for each target
	var format = "";
	
	var isAllNAG = true;
	var isAllAG = true;
	var isFormat = false;
	
	var tmpFormat = "";
	
	//Loop through the outputs array
	for(var j= 0; j<outputs.length; j++){
		
		//Get element fron the outputs array
		//For e.g. "$PpyWorkPage$pOrders$l$pOrderTotal"
		var output = outputs[j];

		//Split the output using $p
		//For e.g. {$PpyWorkPage, Orders$l, OrderTotal}
		var splitOutput = output.split("$p");
		
		//Split the input using $p
		//For e.g. {$PpyWorkPage, Orders$l1, OrderItems$l1, Quantity}
		var tempSplitInput = input.split("$p");

		//Call to match target function with two splitted array
		//For e.g. $PpyWorkPage$pOrders$l1$pOrderTotal
		var targetToMatch = getMatchedTarget(tempSplitInput, splitOutput);

    //Get the harness id of the harness in which input element present
    var inputHarnessId = $(inputElement).closest("*[data-harness-id]")[0].getAttribute("data-harness-id");
    var checkHarnessID = false;

		//Get the target elements
		var elementList;
    
    if(inputHarnessId){
      		elementList = pega.util.Dom.getElementsById(TargetID, pega.ctx.dom.querySelectorAll("[data-harness-id = '"+inputHarnessId+"']")[0]);
      		checkHarnessID = true;
    	}
        if(!inputHarnessId || !elementList){
            elementList= pega.util.Dom.getElementsById(TargetID,document);
        }
    
		if(elementList){
			for(var k=0;k<elementList.length; k++){
				var closestHarness = checkHarnessID?$(elementList[k]).closest("*[data-harness-id]")[0].getAttribute("data-harness-id"):null;
				//Check for the element name with the formatted target
				if(targetToMatch == elementList[k].getAttribute("name") && closestHarness == inputHarnessId){
					//Added them to a string with html property name
					targetString += getTargetString(elementList[k]);
					tmpFormat = getTargetFormat(elementList[k]);
					if(tmpFormat!=""){
						isAllNAG = false;
					}

					if(tmpFormat && tmpFormat!="NF"){
						isFormat = true;
					}	
					if(tmpFormat=="")
						tmpFormat = "-"
					format += tmpFormat + "|";
				}
			}
		}else{
			//Check for the element name with the formatted target
			if(targetToMatch == elementList.getAttribute("name")){
				//Added them to a string with html property name
				targetString += getTargetString(elementList);
				tmpFormat = getTargetFormat(elementList);
				if(tmpFormat!=""){
					isAllNAG = false;
				}

				if(tmpFormat && tmpFormat!="NF"){
					isFormat = true;
				}
				if(tmpFormat=="")
					tmpFormat = "-"

				format += tmpFormat + "|";
			}
		}
		
	}

	//Remove the last comma
	//For e.g. $PpyWorkPage$pOrderTotal,$PpyWorkPage$pOrders$l1$pOrderTotal,$PpyWorkPage$pOrders$l1$pOrderItems$l1$pItemCost,
	targetString = targetString.substring(0, targetString.length - 1);

	//Return the target
	//For e.g. $PpyWorkPage$pOrderTotal,$PpyWorkPage$pOrders$l1$pOrderTotal,$PpyWorkPage$pOrders$l1$pOrderItems$l1$pItemCost
	if(isAllNAG){
		format = "";
	}else if(!isAllNAG && !isFormat){
		format = "NF";
	}
	return targetString+"~~"+format;
}

/*@private- This function gets the entry handles of input and target property and returned the full entry handle of the target property
@param $Array$tempSplitInput - temp splitted input
@param $Array$tempSplitOutput - temp splitted output 
@return $String$formattedTarget- the formatted target entry handle
*/

function getMatchedTarget(tempSplitInput, tempSplitOutput){

	//Loop through the split input array
	while(tempSplitInput.length>0){
	
		//Check the length of the split arrays
		if(tempSplitInput.length == tempSplitOutput.length){

			//Loop through the element of the splitted output array
			for(var i=0;i<tempSplitOutput.length-1;i++){

				//Get the length of the element in splitted output array
				//For e.g. when i=1 the element is Orders$l and length is 8
				var charLength = tempSplitOutput[i].length;

				//Substring the splitted input element using splitted output element length and check
				if(tempSplitOutput[i]==tempSplitInput[i].substring(0,charLength)){

					//Assign the splitted input element to splitted output element to add the subscript
					//For e.g. both elements will be Orders$l1 with the subscript
					// Finally the splitted output array will be {$PpyWorkPage, Orders$l1, Quantity}
					tempSplitOutput[i] = tempSplitInput[i];
				}
			}
			break;
		}
		else{
			//If the lengths of the two arrays are not equal, remove the second last element
			//For e.g. splitted input array = {$PpyWorkPage, Orders$l1, OrderItems$l1, Quantity}
			//and  splitted output array = {$PpyWorkPage, Orders$l, OrderTotal}
			//Remove the OrderItems$l1 from splitted input array
			//Then splitted input array = {$PpyWorkPage, Orders$l1, Quantity}
			//(Which will be having equal elements to the splitted output array)
			tempSplitInput.splice(tempSplitInput.length - 1, 1);
		}
	}

	//Check the equality of the length of two arrays
	if(tempSplitInput.length == tempSplitOutput.length){

		//Create variable to form the target with the first element of the splitted output array
		//For e.g. $PpyWorkPage
		var formattedTarget = tempSplitOutput[0];

		//Loop through the splitted output array
		for(var i=1;i<tempSplitOutput.length;i++){

			//Added elements of the splitted output array to the variable with $p
			formattedTarget+="$p"+tempSplitOutput[i];
		}
		//Return the formatted target entry handle
		//For e.g. $PpyWorkPage$pOrders$l1$pOrderTotal
		return formattedTarget;
	}
	return;
}

/*@private- This api gets the latest values from server irrespective of input change. 
This function gets called from handlePartialSuccess callback.
*/
function fireExpression(){
	var isAllNAG = true;
	var isFormat = false;
	
	var tmpFormat = "";
	
	var targets = pega.util.Dom.getElementsById(TargetID, document);
	if(targets==null)return;
	var targetString = "";
	var len = targets.length;
	var format = "";
	for(var i=0;i<len;i++){
		targetString += getTargetString(targets[i]);
		
		tmpFormat = getTargetFormat(targets[i]);
		if(tmpFormat!=""){
			isAllNAG = false;
		}

		if(tmpFormat && tmpFormat!="NF"){
			isFormat = true;
		}
		if(tmpFormat=="")
			tmpFormat = "-";
		format += tmpFormat + "|"; 
		
	}
	targetString = targetString.substring(0, targetString.length - 1);
	
	if(isAllNAG){
		format = "";
	}else if(!isAllNAG && !isFormat){
		format = "NF";
	}
	if(targetString){
    callGetTargets(targetString,"","",format); 
  }
	
}

/*@private- Helper function to get target string in the desired fashion(EntryHandle!HPName).
*/
function getTargetString(target){
	return target.getAttribute("name")+'!'+target.getAttribute("RHP_NAME")+",";
}

function getTargetFormat(target){
	var format = target.getAttribute("data-ctlformat");
	return format?format:"";
}

/*@private- Helper function which makes a call to GetTargets activity.
@param $String$targetString - Comma seperated targets info.
*/
function callGetTargets(targetString,strPostData, anInput,ctlFormat){
	/*Construct the query string.*/
	var _puiURL = SafeURL_createFromURL(pega.u.d.url);
	if(strPostData == null || !strPostData)
		var strPostData = new SafeURL();
	_puiURL.put("pyActivity","GetTargets");
  	_puiURL.put("pzKeepPageMessages","true");
	strPostData.put("Targets", targetString);
	strPostData.put("CtlFormat",ctlFormat);
	strPostData.put("bClientValidation", pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty('bClientValidation'));
	strPostData.put("FormError",pega.u.d.formErrorType);
	strPostData.put("FieldError",pega.u.d.fieldErrorType);
	strPostData.put("pyCustomError",pega.u.d.pyCustomError);
    strPostData.put("FormError",pega.u.d.formErrorType);
    //BUG-184370 Added empty FromFrame 
   	strPostData.put("pzFromFrame"," ");
	if (pega.c && pega.c.actionSequencer){
		pega.c.actionSequencer.pause();
	}
	gTimeout = window.setTimeout(function(){
      	if(pega.u.d.fixBaseThreadTxnId){
            pega.u.d.fixBaseThreadTxnId(_puiURL);
        }
		getFromServer(_puiURL.toURL(), strPostData.toQueryString(),anInput);
	}, 500); // add time out to fix the submit button issue.
}
//static-content-hash-trigger-YUI