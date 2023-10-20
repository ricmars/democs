//<script>
pega.desktop.nextSpace = "";
pega.desktop.nextGadget = "";


pega.desktop.showNextInSpace = function(strSpaceName,strGadgetName) {
	pega.desktop.nextSpace = strSpaceName;
	if (strGadgetName) pega.desktop.nextGadget = strGadgetName;
}

pega.desktop.showNextInGadget = function(strGadgetName) {
	pega.desktop.nextGadget = strGadgetName;
}

pega.desktop.compositeOpenSpace = function(spaceName, sourceString, sourceType) {
	

//bug-72730 Check for gadget actions in individual gadgets, not just once for the entire page
//Commenting out temporarily , because getPegaWebGadgetManager doesn't give the correct gadget, and hence multi inter-gadget communication cannot be acheived, and also breaking the code of normal workarea

    /*   if(pega.desktop.support && typeof(pega.desktop.support.getPegaWebGadgetManager)!="undefined" && pega.desktop.support.getPegaWebGadgetManager()!=null && pega.web && pega.web.mgr && typeof(pega.web.mgr._getActionMappingName)!="undefined")
     {

  
       var gadgetDivElement = pega.desktop.support.getPegaWebGadgetManager();
       var gadgetName       = gadgetDivElement.oDiv.attributes.PegaGadget.nodeValue;
       var gadget           = pega.web.mgr._htGadgets.get(gadgetName);
       var mappedActionName = pega.web.mgr._getActionMappingName(sourceType);       
       if(gadget!=null && gadget._oGdtActions!=null && mappedActionName!="")
	{
	
	for(var j=0;j<gadget._oGdtActions.length;j++)
	{
	if(gadget._oGdtActions[j].action==mappedActionName)
	{
	 if (pega.desktop.support.openSpaceInGadget(spaceName, sourceString, sourceType)) 
	    {
              return true
              }
		
	}
	}
	
	
	}

     }*/

	var task = sourceType.toLowerCase();
	/** pop up these desktop tasks */
	switch(task) {
		case "rulebyurl":
		case "spacehomewithurl":
		case "listbybasket":
		case "listbyurl":
		case "listbyuser":
		return false;
	}

	//ShowSpace use case.  If we want to show Space and the spaces are the same, noop
	if (sourceType == "" && pega.desktop.nextSpace != "" && (pega.desktop.nextSpace == pega.desktop.getCurrentSpaceName())) {
		return true;

	}

	//If there is a user defined space, route this command to that space
	else if (pega.desktop.nextSpace != "" && pega.desktop.nextSpace != pega.desktop.getCurrentSpaceName()) {
			pega.desktop.doDesktopAction(pega.desktop.nextSpace, sourceString, sourceType);
			pega.desktop.nextSpace = "";
			return true;
	}
	
	var app = pega.desktop.support.getDesktopApplication();

	//If there is a gadget defined on this space, use that gadget
	var objGadget = app.gadgetPool.findAvailableGadget(pega.desktop.nextGadget);
	
	if (!objGadget) {
		
		//if there isn't a gadget, check if there's a work space
		if (pega.desktop.support.isSpaceAvailable("work") && pega.desktop.getCurrentSpaceName().toLowerCase() != "work") {
			pega.desktop.doDesktopAction("work", sourceString, sourceType);
			return true;
		}		

		//if there's no work space, pop up
		return false;
	}

	// BUG-113426 GUJAS1 09/03/2013 If the gadget is old workarea and task requested is Rule related, return false.
	if (!objGadget.gadgetAvailable &&
		(task == "rulebykeys" || task == "rulebyclassandname" || task =="rulespecific")){
		return false;
	}

	var configObj = {};

	configObj.appName = sourceString.get("appName");
	configObj.systemID = sourceString.get("systemID");
	var bNavigateSpace = false;
	if(task.indexOf("rule")!=-1 && pega.desktop.PopupCtrl.PopupOpener(sourceString, sourceType)){
	   return true;
	}

	switch(task) {
	case "display":
	case "showharness":
		sourceString.put("api","display");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "rulebykeys":
			sourceString.put("api","openRuleByKeys");
			pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
			break;
	case "rulebyclassandname":
			sourceString.put("api","openRuleByClassAndName");
			pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
			break;		
	case "rulespecific":
			sourceString.put("api","openRuleSpecific");
			pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
			break;		
	case "formbyurl":
			sourceString.put("api","openWorkByURL");
			pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
			break;
	case "getnextwork":
		sourceString.put("api","getNextWork");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "openbyassignment":
		sourceString.put("api","openAssignment");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;

	case "openbyworkhandle":
		sourceString.put("api","openWorkByHandle");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;

	case "openbyworkitem":
		sourceString.put("api","openWorkItem");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "openwizard":
		sourceString.put("api","openWizard");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "enternewworkfromflow":
	case "enternewwork":
		sourceString.put("api","createNewWork");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "reportdefinition":
		sourceString.put("api","reportDefinition");
		pega.desktop.sendEvent("DesktopAction",sourceString,SYNC);
		break;
	case "openlanding":
		var oActionParams = sourceString.get("ActionParams");
		var oNavParams = sourceString.get("Navigation");
		var strLandingName= sourceString.get("Name"); 
    var action = sourceString.get("Action");
		var name = sourceString.get("Name");
		var mdcTarget = sourceString.get("mdcTarget");
    
		if (oActionParams) {
			var strThread = oActionParams.thread;
			if(strThread  & strThread != "") {
				strLandingName = strThread;
			}
		}

		oSafeUrl = new SafeURL();
		for( i in oActionParams) {
			oSafeUrl.put(i, oActionParams[i]);
		}
		for( i in oNavParams) {
			oSafeUrl.put(i, oNavParams[i]);
		}
		oSafeUrl.put("api","openLanding");
		oSafeUrl.put("Name",strLandingName);
		oSafeUrl.put("Action",action);
		oSafeUrl.put("landingPageTitle",name);
    if(mdcTarget){
        oSafeUrl.put("mdcTarget",mdcTarget);
      }
    
		

		pega.desktop.sendEvent("DesktopAction",oSafeUrl,SYNC);
		break;		
	default: bNavigateSpace = true;
	}


	return true;
}

pega.desktop.compositeOpenUrlInSpace = function(objURL, space) {
	if (space != pega.desktop.getCurrentSpaceName()) {
		pega.desktop.doDesktopAction(space,objURL.toURL(),"openURL");
		//NavigateSpace
	}
	//gadget type is suspect
	var app = pega.desktop.support.getDesktopApplication();

	var objGadget = app.gadgetPool.findAvailableGadget(pega.desktop.nextGadget);
	if (objGadget) objGadget.openURL(objURL.toURL());
	else {
		pega.desktop.doDesktopAction(space,objURL.toURL(),"openURL");
	}



}


pega.desktop.doDesktopAction = function(spaceName, sourceString, sourceType){

	if (sourceType.toLowerCase() == "openurl") {
		var newURL = new SafeURL("DoDesktopAction");
		newURL.put("sourceType",sourceType);
		newURL.put("navURL",sourceString);
	}

	else if (sourceType != null && sourceType != "") {
		var newURL = pega.desktop.support.constructUrl(sourceString,sourceType);
		newURL.put("pyActivity","DoDesktopAction");
		newURL.put("sourceType",sourceType);
		newURL.put("spaceName",spaceName);
		if (newURL.get("pyClassName") != null) newURL.put("pyClassName","@baseclass");
	}
	else {
		var newURL = new SafeURL("Data-Portal.ShowSpaceHarness");
		newURL.put("spaceName",spaceName);
		newURL.put("pzPrimaryPageName","pyPortal");

	}
	newURL.put("nextGadget", pega.desktop.nextGadget);
	if (sourceString.get("systemID")) newURL.put("systemID", sourceString.get("systemID"));
	if (sourceString.get("appName")) newURL.put("appName",sourceString.get("appName"));
	pega.desktop.nextGadget = "";

	var oWin = pega.desktop.support.getDesktopWindow();

	oWin.location.href = newURL.toURL();
	// oWin.navigate(newURL.toURL());  Not compatible with Mozilla FF
	oWin.focus();
}

pega.desktop.display = function(className, harnessName) {
	var args = arguments[0];
    	if (typeof args == "object" && args.name == "safeURL") {
		var sourceString = SafeURL_clone(args);
    	}



	if (!sourceString) {
		var sourceString = new SafeURL();
		sourceString.put("ClassName",className);
		sourceString.put("HarnessName",harnessName);
	}

	var spacename = pega.desktop.getCurrentSpaceName();

	pega.desktop.compositeOpenSpace(spacename,sourceString,"display");

}

pega.desktop.registerDocumentGadget = function (objGadget) {
	//pega.desktop.gadgetPool.addGadget(objGadget);
	
	var app = pega.desktop.support.getDesktopApplication();
	app.gadgetPool.addGadget(objGadget);

}

pega.desktop.setStartupCommand = function() {
	var _startupCommand = top.startupCommand;
	var oSafeURL= SafeURL_clone(_startupCommand);
	var sourceType= top.sourceType;
	var defaultSpaceName= "Work";
	pega.desktop.compositeOpenSpace(defaultSpaceName,oSafeURL,sourceType);
}

pega.desktop.attachStartupCommand = function() {
	if(pega.u.d) {
		pega.u.d.attachOnload(pega.desktop.invokeStartupCommand); 
	}else {
		setTimeout("pega.desktop.attachStartupCommand()",100);
	}
}

pega.desktop.invokeStartupCommand = function() {
	//bug-72128:removing setTimeout by attachOnLoad as it will pause for the entire harness to load; esp needed for Cm portal
	pega.u.d.attachOnload(pega.desktop.setStartupCommand,true);
}

pega.desktop.PopupCtrl = (function(){
	var p_freeThreads = [], p_usedThreads = [],MAXPOPUPS = 8,skipReload  = false,popupKey = "";
	var ruleFormType = new Hashtable(),openedPopups = new Array();
  //, popupWin = new Object();
	return {
	skipReload : skipReload ,
	p_freeThreads:p_freeThreads,
	p_usedThreads:p_usedThreads,
	
	initializeThreadBuckets: function(){
	for (var i = 0; i < MAXPOPUPS; i++) {
				p_freeThreads.push(i);
			}
	},
	
	getDocumentKeyFromCTAPI: function(myWindowObj,primaryPg){
		var documentKey = null;
		var keyToGetDocKey = primaryPg+".pzDocumentKey";
		return myWindowObj.pega.ui.ChangeTrackerMap.getTracker().getPropertyValue(keyToGetDocKey);
	},

	handlePopupLoad: function (popupWind, strKey) {
		var windowAlreadyAdded = false;
        if(popupWind){
		var currentKey = pega.desktop.PopupCtrl.getDocumentKeyFromCTAPI(popupWind,popupWind.strPrimaryPage);
		if(currentKey == "")
			currentKey = strKey;
		if(openedPopups.length >0){ // If there are any existing windows open
			for(var i=0; i<openedPopups.length;i++){
				var tempWind = openedPopups[i];	 
				var myDocumentKey = pega.desktop.PopupCtrl.getDocumentKeyFromCTAPI(tempWind,tempWind.strPrimaryPage);
				if(currentKey == myDocumentKey){ 
				   windowAlreadyAdded = true;
				}
			
			}
		}		
		if(windowAlreadyAdded == false){
		   openedPopups.push(popupWind);
		}
		pega.desktop.PopupCtrl.skipReload = false;	
		if(self == top && popupWind.strPyLabel)/*Only for popups*/
			popupWind.document.title = popupWind.strPyLabel;
            }
	},
	
	handlePopupUnLoad: function (args) {
		setTimeout(function(){pega.desktop.PopupCtrl.releaseThreadId(args);},400);			  	
	},

	getFreeThreadName : function () {
		var threadName = "PopupThread" + pega.desktop.PopupCtrl.getFreeThreadId();
		return threadName;
	},

	getFreeThreadId : function () {
                  
		var thread = p_freeThreads.shift();
		if (typeof (thread) == undefined || thread.length == -1) {
			thread = -1;
		} else {
			p_usedThreads[thread] = thread;
		}
		return thread;
	},
	
	isWindowPopped : function (winName) {     
		if(winName!="" && winName.indexOf("POPRWin")> 0) 
			return true;
		else
			return false;
	},
	
	releaseThreadId : function (args) {
		if(pega.desktop.PopupCtrl.skipReload) 
			return;
		var myArgs = args.split('|');	
		var threadName = myArgs[0];// insKey = myArgs[1], myDocumentKey = myArgs[2];
		var indexToBeRemoved = -1;
		for(var index = 0; index < openedPopups.length;index++){
			var tempWind = openedPopups[index];	                					
			if(tempWind.closed){
				indexToBeRemoved = index;
				break;
			}
		}
        var currentThreadName = pega.u.d.getThreadName();
		/*Start cleanup*/
        /*BUG-278222:Thread will be cleared only when Current document thread should not be the popup window thread*/
		if(indexToBeRemoved > -1 && currentThreadName != threadName ){
			var indexOfThread = threadName.substring(threadName.length-1);
			p_freeThreads.unshift(indexOfThread);
			delete p_usedThreads[indexOfThread];
			openedPopups.splice(indexToBeRemoved,1);			
			/*Call DoClose api*/
			pega.u.d.switchThread(threadName);
			var oSafeURL = SafeURL_createFromURL(pega.u.d.url); 
			pega.u.d.switchThread(currentThreadName);
			oSafeURL.put("pyActivity", "DoClose");
			oSafeURL.put("dcCleanup", "true");				
			var response = httpRequestAsynch(oSafeURL.toURL(), null, 50, 100);			
		}	

	},
	
	PopupOpener : function(sourceString,sourceType){
		var className = sourceString.get("objClass");
		if(className == undefined || className == ""){
			className = sourceString.get("pxObjClass");
		}
		var currentKey = sourceString.get("Handle");
		var strName = sourceString.get("insName");
		var action ="Open", paramToSend = "", ruleInfoJson = new Object();
		var jsonObj = new Object();
		var JSONKeys = "";
		if(sourceType == "rulebykeys"){ //Open rule by keys
				for(var key in sourceString.hashtable){
                 jsonObj[key] = sourceString.hashtable[key];
			    }
			    JSONKeys = JSON.stringify(jsonObj);
		}
		if(currentKey == undefined || currentKey == ""){
				strName = sourceString.get("insName");
				//sourceString.put("api","openRuleByClassAndName");
				//action = "openRuleByClassAndName";
				paramToSend = "insName";
	    }
		else{
			//sourceString.put("api","openRuleSpecific");
			//action= "openRuleSpecific";
			//paramToSend = "openHandle";				 
		}		  

		if((currentKey!= undefined && currentKey!= "") && className == undefined || className=="" )
			className = currentKey.substring(0,currentKey.indexOf(" "));	
			
		if(currentKey !=undefined && currentKey!="" && currentKey.indexOf("HISTORY-")==0){
			var tempArr = currentKey.split(" ");
			className = tempArr[1];			
		}
		var formType = ruleFormType.get(className);
		if(formType == undefined || formType == ""){ /*Check if it already exists in the map.*/
			className = className.toUpperCase();
			var oSafeURL= new SafeURL("@baseclass.pzGetFormType");
			oSafeURL.put("ClassName",className);
			formType = httpRequestAsynch(oSafeURL.toURL(), null, 50, 100);
		}

		if(formType=="Form"){
			if(currentKey == undefined || currentKey == "") /*Make a call if you dont have inskey*/
			{
				var oSafeURL= new SafeURL("@baseclass.pzGetRuleInfo");
				var skipThreadCreation = false;
				oSafeURL.put("ClassName",className);
				oSafeURL.put("JSONKeys",JSONKeys);
				if(strName != undefined && strName !="")
					oSafeURL.put("InsName",strName);
				ruleInfoJson = httpRequestAsynch(oSafeURL.toURL(), null, 50, 100);
				var  ruleInfoJsonText =  JSON.parse(ruleInfoJson).output
				if(ruleInfoJsonText.indexOf("Error:")>=0){
					skipThreadCreation = true;    
				}
				currentKey = ruleInfoJsonText;
			}
			if(openedPopups.length >0){ // If there are any existing windows open
				for(var i=0; i<openedPopups.length;i++){
					var tempWind = openedPopups[i];	 
					var myDocumentKey = pega.desktop.PopupCtrl.getDocumentKeyFromCTAPI(tempWind,tempWind.strPrimaryPage);
					if(myDocumentKey=="")
						myDocumentKey = tempWind.pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty('strKey');
					if(currentKey == myDocumentKey){ /*Trying to open an existing window. So just focus and return*/
					   tempWind.focus();
					   return true;
					}
				
				}
			}
		   
			if(openedPopups.length >= MAXPOPUPS ){
				alert("You have crossed the limit of maximum number of pop up windows.");
				return true;
			}
			
			var currentThreadName = pega.u.d.getThreadName();	
			var freeThreadName = currentThreadName;			
			if(!skipThreadCreation)
				freeThreadName = pega.desktop.PopupCtrl.getFreeThreadName();
						
		   
		   pega.u.d.switchThread(freeThreadName);
		   oSafeURL = SafeURL_createFromURL(pega.u.d.url); 				
		   pega.u.d.switchThread(currentThreadName);		
		   oSafeURL.put("objClass",className);
		   oSafeURL.put("pyActivity","WBOpen");
		   oSafeURL.put("openHandle",currentKey);
//		   oSafeURL.put("action", action);
		   oSafeURL.put("Format", "Harness");
		   if (sourceType != undefined) {
			   oSafeURL.put("SourceType",sourceType);
			}
			currentKey = "POPRWin"+currentKey + new Date().getTime(); /*Added to have unique window name as same rule can be opened from more than 1 sessions.*/
			//popupWin = pega.desktop.support.openUrlInWindow(oSafeURL, currentKey, RuleFormSize + PopupWindowFeatures);
      pega.desktop.support.openUrlInWindow(oSafeURL, currentKey, RuleFormSize + PopupWindowFeatures);
			ruleFormType.put(className,"Form");
			return true;		  
		 }
		else {
			ruleFormType.put(className,"Harness");
			return false;
		}
		}

	};
	
	})();

try{
	if(top.startupCommand){
		pega.desktop.attachStartupCommand();
	}
	pega.desktop.PopupCtrl.initializeThreadBuckets();
}
catch(e){
}
//static-content-hash-trigger-GCC
// <script>

pega.namespace("pega.desktop");

var gModEM = "EventManager";

/*
* @constructor
* @protected - Event Manager Object that is used for sendEvent API.
* @return $void$
*/
pega.desktop.EventManager = function () {
	this.eventControllers = new Array();
	this.eventObjects = new Array();
	this.eventId = 1;
	this.currentEventName = "";
}

pega.desktop.EventManager.prototype = {

	/*@protected* Unregisters a function from being invoked whenever a named event occurs.
	 *  @param strEventName - name of the event (matches name registered with registerEventListener)
	 *  @param objFunction  - function to stop invoking when event occurs
	 *  @return $void$
	 **/
	cancelEventListener: function (strEventName, objFunction) {
		logEvent("EventName=" + strEventName, gModEM, "cancelEventListener");
		var objEventController = this.getEventController(strEventName);
		if (objEventController) {
			for (var i = 0; i < objEventController.eventListeners.length; i++) {
				if (objEventController.eventListeners[i].eventFunction == objFunction) {
					/* null the references before removing */
					objEventController.eventListeners[i].eventFunction = null;
					objEventController.eventListeners[i].data = null;
					objEventController.eventListeners.splice(i, 1);
					break;
				}
			}
		}
	},

	/*@protected
	 * Clears the timeout on all the buffered events with Name : strEventName
	 *  @param strEventName -  name of the event (matches name in registerEventListener)
	 * @return $void$
	 */
	clearEventTimeout: function (strEventName) {
		var i = 0;
		while (i < this.eventObjects.length) {
			if (this.eventObjects[i].eventName == strEventName) {
				window.clearTimeout(this.eventObjects[i].timeoutId);
				this.eventObjects.splice(i, 1);
			}
		}
	},

	/* @protected
	 * This method is to get the current event
	 * @return $String$ the name of the current event
	 */
	getCurrentEvent: function () {
		return this.currentEventName;
	},

	/* @protected  Find the event controller with that name or create a new
	 *  one if it doesn't exist
	 *  @param strEventName - name of the event type
	 *  @return $Object$ an EventController object
	 */
	getEventController: function (strEventName) {
		for (var i = 0; i < this.eventControllers.length; i++) {
			if (this.eventControllers[i].eventName == strEventName) {
				return this.eventControllers[i];
			}
		}
		var objEventController = new EventController(strEventName);
		this.eventControllers.push(objEventController);
		return objEventController;
	},

	/*@protected
	 * This method invokes the required methods
	 * @param strEventName -  name of the event (matches name in registerEventListener)
	 * @param timeStamp  -  used as a unique key for the event
	 * @param $Object$objEventData– to be passed as parameter to all the listeners.
	@return $void$
	 */
	invokeEvent: function (strEventName, objEventData) {
		var badListeners = new Array();
		var objEventController = this.getEventController(strEventName);
		var arListeners = objEventController.eventListeners.slice(0);

		for (var i = 0; i < arListeners.length; i++) {
			if (!arListeners[i].execute(objEventData)) {
				try {
					/* null out the references */
					arListeners[i].eventFunction = null;
					arListeners[i].data = null;
				} catch (e) {}

				badListeners.push(i);

				/* Failed Listener extension point */
				try {
					if (typeof listenerFailed == 'function') {
						listenerFailed(strEventName);
					}

				} catch (e) {
					logEvent("EventName=" + strEventName + " Exception: " + e.name + " Message: " + e.message, gModEM, "invokeEvent");
				}
			}
		}

		var nLength = badListeners.length;
		// Remove all the bad listeners
		for (var i = nLength - 1; i >= 0; i--) {
			var removePos = badListeners[i];
			arListeners.splice(removePos, 1);
		}
    objEventController.eventListeners = arListeners;
	},

	/*@protected* Registers a function to be invoked whenever a named event occurs. When
	 *  invoked, the function will be passed two parameters: the data about the
	 *  event (supplied by sendEvent)and objData (unchanged)
	 *  @param strEventName - name of the event (matches name sent by sendEvent)
	 *  @param objFunction - function to invoke when event occurs
	 *  @param objData - data to pass along to the function, for example, the
	 *  id of the div that the function will update
	 * @return $void$
	 **/
	registerEventListener: function (strEventName, objFunction, objData, scope) {
		logEvent("EventName=" + strEventName, gModEM, "registerEventListener");
		var objEventController = this.getEventController(strEventName);
		var objEventListener = new EventListener(objFunction, objData, scope);
		objEventController.eventListeners.push(objEventListener);
	},

	/* @protected
	 *  This method registers a handler that takes the objData and the new
	 *  value of the work pool as a string as the first and second arguments
	 *  respectively. The provided handler will be invoked on each change of
	 *  the current work pool, and will be removed from the handler queue should
	 *  any exception be posted to the caller.
	 * @param objHandler - function that takes an object as the first argument
	 *                      and a string representation of the work pool as the
	 *                      second argument. Does not return a value.
	 * @param objData - the user data to be passed to the handler when it is
	 *                   invoked.
	 * @return $void$
	 **/
	registerWorkPoolChangeListener: function (objHandler, objData) {
		this.registerEventListener(AppChange, objHandler, objData);
	},

	/*@protected* Sends an event, which causes all registered listeners to the event to be invoked.
	 *  @param strEventName - name of the event (matches name in registerEventListener)
	 *  @param objEventData - data about the event that should be passed to the
	 *  listening functions
	 * @param $String$mode– SYNC or ASYNC.
	@param $int$delay– time duration for the delay.
	@return $void$
	 **/
	sendEvent: function (strEventName, objEventData, mode, delay) {

		//preparing teh event name from the object.
		if (typeof strEventName == "object") {
			strEventName = strEventName.domain + "$" + strEventName.ruleSet + "$" + strEventName.name;
		}

		if (mode == undefined || mode == null) {
			mode = ASYNC;
		}
		if (delay == undefined || delay == null || isNaN(delay)) {
			delay = 1;
		}
		this.setCurrentEvent(strEventName);
		switch (mode) {
			case SYNC:
				this.invokeEvent(strEventName, objEventData);
				break;
			case ASYNC_COPY_REPLACE:
				if (typeof objEventData != 'string') {
					var valueHash = new Array();
					valueHash["$(mode)"] = mode;
					alert(getLocalString("pyMessageLabel", "Event Data sent using $(mode) mode must be passed as a serialized string", valueHash));
					return false;
				}
				objEventData = deserialize(objEventData);
			case ASYNC_REPLACE:
				this.clearEventTimeout(strEventName);
				this.sendEvent(strEventName, this.getFormData(), ASYNC, delay);
				break;
			case ASYNC_COPY:
				if (typeof objEventData != 'string') {
					var valueHash = new Array();
					valueHash["$(mode)"] = mode;
					alert(getLocalString("pyMessageLabel", "Event Data sent using $(mode) mode must be passed as a serialized string", valueHash));
					return false;
				}
				objEventData = deserialize(objEventData);
			case ASYNC:
				var timeStamp = (new Date()).getTime();
				var eventId = timeStamp + "_" + this.eventId;
				var timeoutId = window.setTimeout("EventManager_eventTimeoutHandler('" + strEventName + "','" + eventId + "')", delay);
				var eventObj = new EventObj(strEventName, eventId, timeoutId, objEventData);
				this.eventObjects.push(eventObj);
				this.eventId++;
				break;
		}
	},

	/*@protected  This method is to set the current event.
	 * @param $String$curEventName– name of the current event.
	@return $void$
	 */
	setCurrentEvent: function (curEventName) {
		this.currentEventName = curEventName;
	}
};

/** This method is called from window.setTimeout in sendEvent
 *  @param strEventName -  name of the event (matches name in registerEventListener)
 *  @param timeStamp  -  used as a unique key for the event
 * @return $void$
 */
EventManager_eventTimeoutHandler = function (strEventName, timeStamp) {
	var eventMgr = this.application.getEventManager();
	for (var i = 0; i < eventMgr.eventObjects.length; i++) {
		if (eventMgr.eventObjects[i].eventName == strEventName && eventMgr.eventObjects[i].timeStamp == timeStamp) {
			eventMgr.invokeEvent(eventMgr.eventObjects[i].eventName, eventMgr.eventObjects[i].eventData);
			eventMgr.eventObjects.splice(i, 1);
			break;
		}
	}
}

/**
*  @constructor  Wrapper Object for the Event
*  @param strEventName -  name of the event (matches name in registerEventListener)
*  @param timeStamp  -  used as a unique key for the event
*  @param timeoutId -  return value of window.setTimeout
*  @param eventData -  eventData which is passed to sendEvent
**/
function EventObj (eventName, timeStamp, timeoutId, eventData) {
	this.eventName = eventName;
	this.timeStamp = timeStamp;
	this.timeoutId = timeoutId;
	this.eventData = eventData;
}

//***********************************************************
// Event Controller Object
//***********************************************************

/*@protected
 *  @constructor  Object representing a controller for a named event. It contains an
 *  array of listeners to the event.
 *  @param strEventName - name of the event (used by both
 *  registerEventListener and sendEvent)
 */
function EventController (strEventName) {
	this.eventName = strEventName;
	this.eventListeners = new Array();
}

//***********************************************************
// Event Listener Object
//***********************************************************

/*
@constructor
@protected - Object representing a single listener to an event.
@param $Object$objFunction – function to invoke when event occurs.
@param $Object$objData – data to pass along to the function.
@return $void$- .
*/
function EventListener (objFunction, objData, scope) {
	this.eventFunction = objFunction;
	this.data = objData;
	this.execute = EventListener_executeFunction;
	this.scope = scope;
}

/*@protected
 * Executes a listening function
 * @param objEventData - data about the event (passed from sendEvent)
 * @param curEventName– parameter description goes here.
 * @param objEventData– parameter description goes here.
 * @return $boolean$ false if calling function failed, otherwise true
 **/
function EventListener_executeFunction (objEventData) {
	var result = true;
	try {
		if (this.scope) {
			this.eventFunction.call(this.scope, objEventData, this.data);
		} else {
			this.eventFunction(objEventData, this.data);
		}
	}
	catch (exception) {
		var subscriberName = this && this.eventFunction && this.eventFunction.name;
        console.warn("EventManager: Subscriber function " + subscriberName + " throwed exceptions. It will not be executed next time for the subscribed event.");
        console.warn(exception);
		result = false;
	}
	return result;
}
//static-content-hash-trigger-GCC
pega.namespace("pega.desktop");

pega.desktop.AppControllerLite = function() {
	this.name= "PegaDesktopApplicationController";
	this.eventManager= new pega.desktop.EventManager();
	
	this.model= new pega.desktop.AppModelLite();
	this.openedWindows= new Array();
  this.crossDomainPopupWindowNames = new Array();

	this.portalType = "Composite";
	this.gadgetPool = new pega.desktop.gadgetPoolImpl();
}

pega.desktop.AppControllerLite.prototype = {

   getEventManager:function() {
	return this.eventManager;

   },

   getModel: function() {
		return this.model;
   },

   getView: function(view) {
		return null;
   },

   getUserSessionInfo:function () {

	return this.model.getUserSessionInfo();
   }

}



pega.desktop.AppModelLite = function() {

    this.userSessionInfo= new pega.desktop.UserSessionInfo();
}



pega.desktop.AppModelLite.prototype = {


	getUserSessionInfo: function() {
		return this.userSessionInfo;
	},

	getPreferences: function() {
		return null;
	}
}



pega.desktop.UserSessionInfo = function() {
	this.operatorId = DesktopUserSessionInfo_gStrOperatorId;
	this.userName = DesktopUserSessionInfo_gStrUserName ;
	this.currentWorkPool = DesktopUserSessionInfo_gStrCurrentWorkPool;
	this.startPage = pega.ui.HarnessContextMgr.get("DesktopUserSessionInfo_gStrStartPage");
}



pega.desktop.UserSessionInfo.prototype = {
	setOperatorID: function(strId) {
		this.operatorId = strId;
	},


	getOperatorId: function() {
		return this.operatorId;
	},

	setUserName: function(userName) {
		this.userName = userName;
	},

	getUserName: function() {
		return this.userName;
	},

	setStartPage: function(startpage) {
		this.startPage = startpage;
	},

	getStartPage: function() {
		if(DesktopUserSessionInfo_gStrStartPage) return DesktopUserSessionInfo_gStrStartPage;
		else return "";

	},

	getCurrentWorkPool: function() {
		
		return DesktopUserSessionInfo_gStrCurrentWorkPool;
	},
	setCurrentWorkPool: function(wp) {
		this.currentWorkPool = wp;
	}
}


/*
function framesetscript_restartTimeoutWarningTimer(){
	return null;
}
*/

/*@protected
 * When a timeout time is set, restarts the countdown before showTimeoutWarning is called
 * Used by pega.desktop.support.
 * @return $void$
 */
function desktop_restartTimeoutWarningTimer(){
	if (pega.desktop.TimeoutTime && pega.desktop.TimeoutTime > 0) {
		// Calculate the time to initial warning in milliseconds
		var nTimeoutWarningTime= (pega.desktop.TimeoutTime - pega.desktop.TimeoutWarningWindow) * 60000;

		// Clear the existing countdown
		clearTimeout(pega.desktop.TimeoutWarningCountdown);
		if (nTimeoutWarningTime >= 0) {
				pega.desktop.TimeoutWarningCountdown = self.setTimeout("desktop_showTimeoutWarning('"+pega.desktop.TimeoutWarningWindow+"')", 
                                                               nTimeoutWarningTime);
		}
	}	
}


/*@protected
 * Shows user a warning when their session is about to timeout so they can have the option to 
 * extend their session.  Logs the user off if they do not extend.  
 * @return $void$
 */
function desktop_showTimeoutLogoffDialog(strTime) {
	var iTime = parseInt(strTime);
	iTime = iTime * 60000;
	var oSafeURL = new SafeURL("@baseclass.ShowLogoffTimer");
	oSafeURL.put("time",iTime);
  pega.u.d.convertToRunActivityAction(oSafeURL);
	pega.openUrlInModal.showModalDialog(oSafeURL,iTime, 236, 620, function(ret){	
		if (ret === null || ret === "ok") {
			desktop_restartTimeoutWarningTimer();
		} else {
          	pega.ui.HarnessContextMgr.set("gDirtyOverride",false);
			try {
        logOff();
			} catch(e) {
				pega.u.d.replace('pyActivity=LogOff&pzPrimaryPageName=pyDisplayHarness', null);
			}
		}
	});
}

/*@protected
 * Shows user a warning when their session is about to timeout so they can have the option to 
 * extend their session or relogin.  
 * @return $void$
 */
function desktop_showTimeoutWarning(strTime) {
    var iTime = parseInt(strTime);
    iTime = iTime * 60000;
    var oSafeURL = new SafeURL("@baseclass.ShowLogoffTimer");
    oSafeURL.put("time", iTime);
    pega.u.d.convertToRunActivityAction(oSafeURL);
    pega.openUrlInModal.showModalDialog(oSafeURL, iTime, 200, 400, function(ret) {
        if (ret === null || ret === "ok") {
            desktop_restartTimeoutWarningTimer();
        } else {
            pega.u.d.gDirtyOverride = false;
            try {
                closeAllPRPCChildWindows();
                logOff();
            } catch (e) {
                pega.u.d.replace('pyActivity=LogOff&pzPrimaryPageName=pyDisplayHarness', null);
            }
        }
    });
    self.setTimeout(function() {
        clearTimeout(pega.desktop.TimeoutWarningCountdown);
    }, 5000);
}

function closeAllPRPCChildWindows() {
    var currWin = null;
    var app = pega.desktop.support.getDesktopApplication();
    if (app && app.openedWindows) {
     while (((currWin = app.openedWindows.pop()) !== null) && currWin) {
        currWin.close();
     }
    }
}

function logOff() {
  if (pega && pega.control && pega.control.Actions && pega.control.Actions.prototype) {
    pega.control.Actions.prototype.logOff();
  }
}

function logEvent() {
	return null;
}


pega.desktop.gadgetPoolImpl = function() {
	this._pool = new Array();
}

pega.desktop.gadgetPoolImpl.prototype = {

	addGadget:function(objGadget) {
		this._pool.push(objGadget);
	},

	findAvailableGadget:function(gdtName) {
		if (this._pool.length >= 1) return this._pool[0];
		else return null;
		/*
		for (var i = this._pool.length-1;i>=0 ; i--) {

			var g = this._pool[i];

			if (g.isMultiView()) {
				return g;
			}
			else if (!g.isOccupied()) {
				//if a gadgetname is defined then check its name
				if (gdtName != null & gdtName != "" & gdtName == g.getID()) {
					return g;
				}
				//no gadgetname parameter, just return first available.
				else if (gdtName == null || gdtName == "") {
					return g;
				}
			}

		}

		return null;
		*/

	},

	findGadgetByID:function(strGadgetID) {
		for (var i = 0; i < this._pool.length; i++) {
			var g = this._pool[i];
			if (g.getID() == strGadgetID) {
				return g;
			}
		}

		return null;
	}



}


/* BUG-80446  - clean clipboard onbeforeunload */
pega_desktop_onbeforeunloadHandler = function(e){
        /* BUG-109795 - Added by Delta Touch*/
		var parentWindow = pega.desktop.support.getDesktopWindow();
		if(parentWindow != null && parentWindow.logout == true){
		   return;
		}
		if(!pega.u.NavigateTopHandler) {
			desktop_setProcessWindowName("");
		}
};

function desktop_resetProcessName() {
        desktop_setProcessWindowName(pega.d.TempProcessWindowName);
}

function desktop_setProcessWindowName( name ){
    // flag busy to performance monitor
    pega.ui.statetracking.setHttpBusy("desktop_setProcessWindowName");

        function createXHR(){
		if (typeof XMLHttpRequest != "undefined"){
			return new XMLHttpRequest();
		} 
        //Below ActiveX object removed for BUG-320164 "Due to vulnerability issue!"
         /*
          else if (typeof ActiveXObject != "undefined"){
			if (typeof arguments.callee.activeXString != "string"){
				var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",	"MSXML2.XMLHttp"];
				for (var i=0,len=versions.length; i < len; i++){
					try {
						var xhr = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return xhr;
					} catch (ex){
			
					}
				}
			}
			return new ActiveXObject(arguments.callee.activeXString);
		}
        */
          
        else {
			throw new Error("No XHR object available.");
		}
	}
	if(typeof pega != "undefined" && pega.u && pega.u.d && pega.u.d.redirectingToLoginScreen) { return; }
	var xhr = createXHR();
	var oSafeUrl= new SafeURL("SetProcessWindowName");
	oSafeUrl.put("processWindowName",window.name );
	oSafeUrl.put("returnWindowName","true");
oSafeUrl.put("pzAuth","guest");
  
	if(pega.util.Event.isIE){
	    xhr.open("GET",oSafeUrl.toURL(), true);
             xhr.onreadystatechange = function() 
             { 
               if (xhr.readyState == 4 &&  xhr.status == 200) 
               {
                 pega.d.TempProcessWindowName=xhr.responseText; 
                 if(name=="") self.setTimeout("desktop_resetProcessName()", 3000);
               }
               pega.ui.statetracking.setHttpDone("desktop_setProcessWindowName");
             }
	}else{
	    xhr.open("GET",oSafeUrl.toURL(), true);
             xhr.onload = function()
             { 
                 pega.d.TempProcessWindowName=xhr.responseText; 
                 if(name=="") self.setTimeout("desktop_resetProcessName()", 3000);

                 pega.ui.statetracking.setHttpDone("desktop_setProcessWindowName");
             };
	}

    xhr.send();	
}

pega.util.Event.addListener(window,"beforeunload",pega_desktop_onbeforeunloadHandler );


pega.d.desktopType = "Composite";
var DesktopUserSessionInfo_gStrDesktopType = "Composite";
//var gDesktop = top;
pega.d.TempProcessWindowName="";



var application = new pega.desktop.AppControllerLite();
pega.d.CompositeAppController = application;
//static-content-hash-trigger-GCC
function displayPopoverWhenSwitchfails(){
  var popover = pega.u.d.getPopOver();
       /* popover.open({ 
          content: { type: 'section', name: 'pzSwitchAppDisplayLoginScreen'}, 
          buttons: { ok: false, cancel: false },
          visual: { displayLoader: false, customShowLoader: null, customHideLoader: null, contentClass: '' }, 
          position: { fieldAttach: 'leftBottom', popOverAttach: 'leftTop'}, 
          extraParams: { refresh: false, bIsDisableClickaway: "false", bIsCenterOverlay: "true" } });*/
  
  popover.open({
        content: {
          type: 'section', 
        name: 'pzSwitchAppDisplayLoginScreen'
        },
        bindings: {
            associatedElement: pega.u.d.insertButton
        },
        buttons: {
            ok: false,
            cancel: false
        },
        callbacks: {
            onContentDisplayed: [pega.u.d.focusOverlay, '', pega.u.d],
            onClose: [pega.u.d.closeOverlay, '', pega.u.d],
            onContentReady: [pega.u.d.handleOverlayContentReady, '', pega.u.d]
        },
        position: {
            fieldAttach: 'leftBottom',
            popOverAttach: 'leftTop',
            size: {
                min: {
                    y: 20
                }
            }
        },
        visual: {
            displayLoader: false,
            contentClass: 'overlayPO'
        },
        extraParams: {
            refresh: true,
            setMaxHeightAndWidth: true,
            bIsDisableClickaway: 'true',
            bIsCenterOverlay: 'true'
        }
    });
}

function switchApplication(accessGroup) {
    /* BUG-236225 moved redirectandrun call to the activity so F5 refresh would work */
    if (accessGroup == null) {
        accessGroup = document.getElementById('<pega:reference name="$this-Definition(pyPropertyName)"/>').value;
    }
    var  safeURL=new SafeURL();
  safeURL.put("pzActivity","pzRunActionWrapper");
  safeURL.put("pyActivity","Code-Security.pyValidateSwitchApplication");
 safeURL.put('AccessGroup',accessGroup);
pega.u.d.asyncRequest("POST",SafeURL_createFromURL(safeURL.toURL()) ,{
success: function (o) {
  var responseVal=o.responseText;
  try { 
      responseVal= JSON.parse(o.responseText);
    } catch(e) {}
    if(responseVal === "Success" || responseVal.status === "Success"){
    var oShowDesktopUrl;
  var oLocationUrl = SafeURL_createFromURL(pega.desktop.showDesktop);
    var topWinTmp;
    if (pega.ui.composer && pega.ui.composer.isComposerPreviewFrame()) {
        topWinTmp = pega.ui.composer.getCurrentComposerWindow();
        oShowDesktopUrl = topWinTmp.SafeURL_createFromURL(pega.desktop.pzProcessApplicationSwitch);
    } else {
        oShowDesktopUrl = SafeURL_createFromURL(pega.desktop.pzProcessApplicationSwitch);
    }
    oShowDesktopUrl.put("AccessGroupName", accessGroup);
    oShowDesktopUrl.put("Location",oLocationUrl.toQueryString());
      var portalWindow = pega.desktop.support.getDesktopWindow();
    /*BUG-487945 portalWindow.logout setting to true for not to trigger unload request(pyDeleterDocumentPg) which is creating the thread.
     On application switch, we are removing/cleanup all threads created on the current application, before switihing to new application. Unload requests(pyDeleterDocumentPg) are recreating thread and causing to skin issues.
    */
    if(portalWindow){
       portalWindow.logout = true;
    }
    if (pega.ui.composer && pega.ui.composer.isComposerPreviewFrame()) {
        topWinTmp = pega.ui.composer.getCurrentComposerWindow();
        topWinTmp.location.href = responseVal.url ? responseVal.url : oShowDesktopUrl.toURL();
    } else {
        window.location.href = responseVal.url ? responseVal.url : oShowDesktopUrl.toURL();
    }
      }else{
   displayPopoverWhenSwitchfails();
  }
  },

failure: function (o) {

 displayPopoverWhenSwitchfails();

 
}
},undefined);
}



function changePortal(strNewPortal, currentPortal, strNewPortalLabel) {
    if (strNewPortal !== currentPortal) {
        if (strNewPortalLabel == null || typeof strNewPortalLabel === undefined || strNewPortalLabel.length <= 0) {
            strNewPortalLabel = strNewPortal;
        }
        var strportalname = pega.u.d.fieldValuesList.get(strNewPortalLabel);
        if (typeof strportalname === "undefined") {
            strportalname = strNewPortalLabel;
        }
        var strConfirmMsg = pega.u.d.fieldValuesList.get("SwitchPortal") + " " + strportalname + " " + pega.u.d.fieldValuesList
            .get("PortalText");
        if (confirm(strConfirmMsg)) {
            var oSafeURLTmp = SafeURL_createFromURL(pega.desktop.pzProcessPortalSwitch);
            oSafeURLTmp.put("portal", strNewPortal);
            oSafeURLTmp.put("Name", currentPortal);
            oSafeURLTmp.put("developer", false);
            if (pega.ui.composer && pega.ui.composer.isComposerPreviewFrame()) {
                oSafeURLTmp.put("isPreviewFrame", true)
            }
          var portalWindow = pega.desktop.support.getDesktopWindow();
          /*BUG-487944 portalWindow.logout setting to true for not to trigger unload request(pyDeleterDocumentPg) which is creating the thread.
     On portal switch, we are removing/cleanup all threads created on the current application, before switihing to new portal. Unload requests(pyDeleterDocumentPg) are recreating thread and csuing to skin issues.
    */
          if(portalWindow){
            portalWindow.logout = true;
          }
            window.location.href = oSafeURLTmp.toURL();
        }
    }
}
/**
 * @public Displays a given harness in the current window 
 * @param $String$ className - "Applies to" class of the harness to be shown
 * @param $String$ harnessName - pyStreamName of the harness to be shown
 * @param $String$ harnessLabel - pyLabel of the harness to be shown
 * @param $Event$ event - The event to be passed when harness is launched
 */
function showPortalPage(className, harnessName, harnessLabel, event) {
    if (!event) {
        event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
    }
    var params = {
        harness: harnessName,
        harnessClass: className,
        displayMode: pega.api.ui.constants.NEW_DOCUMENT,
        tabName: {
            value: harnessLabel,
            isProperty: false
        },
        windowName: harnessLabel,
        readOnly: false,
        doSubmit: false,
        event: event
    };
    pega.api.ui.actions.launchHarness(params);
}

function getNextWorkItem(strUserId) {
    var args = arguments[0];
    var oSafeURLTmp;
    if (typeof args === "object" && args.name === "safeURL") {
        oSafeURLTmp = SafeURL_clone(args);
        strUserId = oSafeURLTmp.get("strUserId");
    }
    if (!oSafeURLTmp) {
        oSafeURLTmp = new SafeURL();
    }
    oSafeURLTmp.put("param", strUserId);
    if (!pega.desktop.support.openSpace("Work", oSafeURLTmp, "getnextwork")) {
        strUserId = oSafeURLTmp.toQueryString();
        var strURL = pega.desktop.support.constructUrl(strUserId, "getnextwork");
        pega.desktop.openUrlInWindow(strURL, "pyWorkPage", WorkFormSize + PopupWindowFeatures);
    }
}

function pzCaseMgrLogOff(event) {
    pega.control && pega.control.menu && pega.control.menu.clearState();
    setUserStart('replace');
    pega.u.d.replace('pyActivity=LogOff&pzPrimaryPageName=pyDisplayHarness', event);
}
if (!(pega && pega.desktop && pega.desktop.wks)) {
    pega.namespace("pega.desktop");
    pega.desktop.wks = (function() {
        /////////////////////////////////////////////////////////////////////////////////
        //                          PRIVATE GLOBALS                                    //
        /////////////////////////////////////////////////////////////////////////////////
        var _ind = null;
      
        /////////////////////////////////////////////////////////////////////////////////
        //                              PRIVATE FUNCTIONS                              //
        /////////////////////////////////////////////////////////////////////////////////
        var _deleteBackButton = function() {
            var fixedElem = top.document.getElementsByClassName("wks-back");
            if (fixedElem.length > 0) {
                fixedElem[0].parentNode.removeChild(fixedElem[0]);
            }
        }
        var _showBackButton = function() {
            var fixedElem = top.document.getElementsByClassName("wks-back");
            if (fixedElem.length > 0) {
                fixedElem[0].classList.add("visible");
            }
        }
        var _createNewRule = function(ruletype, rulename, classname, isObject, objRuleInfo) {
            var extraInfo = ""
            if (!isObject) {
                if (ruletype.toUpperCase() === "RULE-OBJ-WHEN") {
                    extraInfo += "&KeypyBlockName=" + rulename;
                } else if (ruletype.toUpperCase() === "RULE-OBJ-VALIDATE") {
                    extraInfo += "&KeypyActivityName=" + rulename;
                } else if (ruletype.toUpperCase() === "RULE-OBJ-MODEL") {
                    extraInfo += "&KeypyModelName=" + rulename;
                } else {
                    extraInfo += "&KeypyPurpose=" + rulename;
                }
                pega.desktop.createNewWork("Work-ProjectManagement-New", "", "NewModalFlow", "&newObjClass=" +
                    ruletype + "&newClassName=" + classname + "&KeypyClassName=" + classname +
                    "&newLabel=" + rulename + extraInfo);
            } else {
                for (var key in objRuleInfo) {
                    if (key !== "pxObjClass") {
                        extraInfo += "&Key" + key + "=" + objRuleInfo[key];
                    }
                }
                pega.desktop.createNewWork("Work-ProjectManagement-New", "", "NewModalFlow", "&newObjClass=" +
                    ruletype + "&newClassName=" + classname + "&KeypyClassName=" + classname + extraInfo
                );
            }
        };
        var _switchWindowInner = function(fromElIframe, portalEl, portalName) {
            if (_ind != null) {
                _ind.hide();
                _ind = null;
            }
            if (fromElIframe.length > 0) {
                fromElIframe.css('display', 'none');
            } else {
                $('body').addClass('hide-main-doc');
            }
            portalEl.css('display', 'block');
            setTimeout(function() {
                if (portalEl.length > 0 && portalEl[0].contentWindow.document.body && portalEl[0].contentWindow
                    .document.body.classList) {
                    portalEl[0].contentWindow.document.body.classList.remove("wks-switch");
                    setTimeout(function() {
                        var ev;
                        if (typeof(Event) === 'function') {
                            ev = new Event('');
                        } else {
                            ev = document.createEvent('Event');
                            ev.initEvent('', true, true);
                        }
                        Object.defineProperty(ev, 'target', {
                            writable: false,
                            value: portalEl[0].contentWindow
                        });
                        portalEl[0].contentWindow.pega.u.d.getTrackerChanges(ev);
                        portalEl[0].contentWindow.document.body.classList.remove(
                            "wks-preswitch");
                        if (portalName === "Developer") {
                            portalEl[0].contentWindow.pega.ui.screenLayout.resizeScreenLayout();
                        }
                    }, 800);
                }
            }, 10);
            if(typeof this._wksTitle === "undefined") {
              this._wksTitle = {};
            }
            if(typeof this._wksTitle[portalEl[0].contentWindow.name] === "undefined" ) {
              this._wksTitle[portalEl[0].contentWindow.name] = portalEl[0].contentWindow.document.title
            } 
            document.title = this._wksTitle[portalEl[0].contentWindow.name];
            //BUG-559791: switching the focus to the current window
            portalEl[0].contentWindow.focus();
        };
        var _dismissBackButton = function(portalName) {
            _deleteBackButton();
            if (typeof portalName !== "undefined") {
                top.pega.desktop.wks.injectIframe("", portalName);
            }
        };
        var _generateBackButton = function(portalName, actionObj) {
            var fixedElem = top.document.getElementsByClassName("wks-back");
            if (fixedElem.length > 0) {
                fixedElem[0].parentNode.removeChild(fixedElem[0]);
            }
            var mainElem = top.document.createElement("DIV");
            mainElem.classList.add("wks-back");
            mainElem.setAttribute("data-fromportal", pega.desktop.portalName);
            mainElem.setAttribute("data-toportal", portalName);
            top.document.body.insertBefore(mainElem, top.document.getElementsByClassName("screen-layout")[0]
                .nextSibling);
            $(mainElem).draggable({
                containment: "parent",
                scroll: false
            });
            $(mainElem).click(function(e) {
                var el = e.target;
                if (el.tagName === 'I') {
                    el = el.parentNode;
                }
                if (el.className === 'back' || el.className === 'back-full' || el.tagName === "SPAN" ||
                    el.tagName === "CANVAS") {
                    _dismissBackButton(pega.desktop.portalName);
                } else if (el.className === 'minimize') {
                    $(this).removeClass("expanded").addClass("minimized");
                } else if (el.className === 'expand') {
                    $(this).addClass("expanded").removeClass("minimized");
                }
            });
            if (typeof html2canvas == "function") {
                mainElem.innerHTML = "<div class='info'><span>" + pega.u.d.fieldValuesList.get("Home") +
                    "</span><span>" + document.title + "</span></div>" +
                    "<div class='actions'><a class='back' title='" + gStrBack +
                    "'><i class='pz-pi pi-arrow-bend-left'></i>" + gStrBack + "</a>" +
                    "<a class='back-full' title='" + gStrBack + "'><i class='pz-pi pi-arrow-bend-left'></i>" +
                    pega.u.d.fieldValuesList.get("BackTo") + " " + document.title + "</a>" + "<a title='" +
                    pega.u.d.fieldValuesList.get("Minimize") + "' class='minimize'>" + pega.u.d.fieldValuesList
                    .get("Minimize") + "</a><a title='" + pega.u.d.fieldValuesList.get("pzExpandPreview") +
                    "' class='expand'><i class='pi pi-arrows-ne-sw-join'></i></a></div>";
                try {
                    html2canvas(document.body, {
                        logging: "false"
                    }).then(function(canvas) {
                        mainElem.insertBefore(canvas, mainElem.firstElementChild);
                        if (!mainElem.classList.contains("minimized")) {
                            mainElem.classList.add("expanded");
                        }
                        pega.desktop.wks.switchWorkspace(portalName, actionObj);
                    });
                } catch (e) {
                    pega.desktop.wks.switchWorkspace(portalName, actionObj);
                }
            } else {
                mainElem.innerHTML = "<div class='actions'><a class='back-full' title='" + gStrBack +
                    "'><i class='pz-pi pi-arrow-bend-left'></i>" + pega.u.d.fieldValuesList.get("BackTo") +
                    " " + document.title + "</a></div>";
                pega.desktop.wks.switchWorkspace(portalName, actionObj);
            }
        };
        /////////////////////////////////////////////////////////////////////////////////
        //                                 PUBLIC API                                  //
        /////////////////////////////////////////////////////////////////////////////////
        return {
            /**
             * injectIframe PRIVATE METHOD called on load of the iframe
             * Inject iframe with a workspace
             * fromportalName - name of the from portal
             * portalName - portal Name
             * url - url
             * actionObj - action to execute after switching the workspace
             */
            injectIframe: function(fromportalName, portalName, url, actionObj) {
                var fromElIframe;
                if (!this._title) {
                    this._title = document.title;
                }
                if (!actionObj && this._actionObj && this._actionObj != null) {
                    actionObj = this._actionObj;
                    this._actionObj = null;
                }
                if (fromportalName === "") {
                    /* if the fromportalName is not set - then used the last one that was switched to */
                    fromportalName = this._portalName;
                }
                this._portalName = portalName;
                /* If the back button is visible and the portalName is the same that back is pointing to, then delete the back button */
                var fixedElem = top.document.getElementsByClassName("wks-back");
                if (fixedElem.length > 0) {
                    var fromportal = fixedElem[0].getAttribute("data-fromportal");
                    if (fromportal != null && fromportal === portalName) {
                        _deleteBackButton();
                    }
                }
                var portalEl = $('iframe#' + portalName);
                if (typeof portalName === 'undefined' || portalName === "" || pega.desktop.portalName ===
                    portalName) {
                    // top level for the destination
                    fromElIframe = $('iframe#' + fromportalName);
                    if (fromElIframe.length > 0) {
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-preswitch");
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-switch");
                    }
                    document.body.classList.add("wks-preswitch");
                    document.body.classList.add("wks-switch");
                    document.title = this._title;
                    setTimeout(function() {
                        fromElIframe.css('display', 'none');
                        $('body').removeClass('hide-main-doc');
                        setTimeout(function() {
                            document.body.classList.remove("wks-switch");
                            setTimeout(function() {
                                var ev;
                                if (typeof(Event) === 'function') {
                                    ev = new Event('');
                                } else {
                                    ev = document.createEvent('Event');
                                    ev.initEvent('', true, true);
                                }
                                Object.defineProperty(ev, 'target', {
                                    writable: false,
                                    value: window
                                });
                                pega.u.d.getTrackerChanges(ev);
                                document.body.classList.remove("wks-preswitch");
                                if (portalName === "Developer") {
                                    pega.ui.screenLayout.resizeScreenLayout();
                                }
                            }, 800);
                        }, 10);
                    }, 800);
                } else if (portalEl.length > 0) {
                    // portal already loaded - just switch to it
                    fromElIframe = $('iframe#' + fromportalName);
                    portalEl[0].contentWindow.document.body.classList.add("wks-preswitch");
                    portalEl[0].contentWindow.document.body.classList.add("wks-switch");
                    if (fromElIframe.length > 0) {
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-preswitch");
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-switch");
                    } else {
                        document.body.classList.add("wks-preswitch");
                        document.body.classList.add("wks-switch");
                    }
                    setTimeout(function() {
                        _switchWindowInner(fromElIframe, portalEl, portalName);
                    }, 800);
                } else if (url) {
                    if (fromportalName && pega.desktop.portalName === fromportalName) {
                        document.body.classList.add("wks-preswitch");
                        document.body.classList.add("wks-switch");
                        setTimeout(function() {
                            _ind = pega.u.d.setBusyIndicator(document.body, true);
                        }, 200);
                    } else {
                        fromElIframe = $('iframe#' + fromportalName);
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-preswitch");
                        fromElIframe[0].contentWindow.document.body.classList.add("wks-switch");
                        setTimeout(function() {
                            _ind = fromElIframe[0].contentWindow.pega.u.d.setBusyIndicator(
                                fromElIframe[0].contentWindow.document.body, true);
                        }, 200);
                    }
                    this._actionObj = actionObj;
                    $('<iframe src="' + url + '" title="' + portalName + '" id="' +
                        portalName + '"  name="' + portalName +
                        '" onload="try { if(pega && pega.desktop && pega.desktop.wks) { pega.desktop.wks.injectIframe(\'' +
                        fromportalName + '\',\'' + portalName + '\');} }catch(e) {}"/>').css({
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'none',
                        background: '#FFF',
                        border: 'none'
                    }).appendTo('body');
                    return;
                }
                if (typeof actionObj !== "undefined" && actionObj !== "" && actionObj !== "undefined") {
                    var actionArray = actionObj;
                    if (actionArray[0] === 'openharness') {
                        if (portalEl.length > 0) {
                            portalEl[0].contentWindow.pega.desktop.wks.openHarness(actionArray[1],
                                actionArray[2], actionArray[3], actionArray[4], actionArray[5]);
                        } else {
                            parent.pega.desktop.wks.openHarness(actionArray[1], actionArray[2], actionArray[
                                3], actionArray[4], actionArray[5]);
                        }
                    } else if (actionArray[0] === 'openrule') {
                        if (portalEl.length > 0) {
                            portalEl[0].contentWindow.pega.desktop.wks.openRule(actionArray[1], actionArray[
                                2], actionArray[3], actionArray[4], actionArray[5], actionArray[6]);
                        } else {
                            parent.pega.desktop.wks.openRule(actionArray[1], actionArray[2], actionArray[3],
                                actionArray[4], actionArray[5], actionArray[6]);
                        }
                    } else if (actionArray[0] === 'openworkbyhandle') {
                        if (portalEl.length > 0) {
                            portalEl[0].contentWindow.pega.desktop.wks.openWorkByHandle(actionArray[1],
                                actionArray[2], actionArray[3]);
                        } else {
                            parent.pega.desktop.wks.openWorkByHandle(actionArray[1], actionArray[2],
                                actionArray[3]);
                        }
                    }
                }
            },
            /**
             * switchWorkspace - PRIVATE METHOD called by the top level menu switch
             * switch the workspace
             * portalName - portal Name.
             * actionObj - action to execute after switching the workspace
             */
            switchWorkspace: function(portalName, actionObj) {
                var fixedElem = document.getElementsByClassName("workspace-menu");
                if (fixedElem.length > 0) {
                    fixedElem[0].classList.remove('visible');
                }
                // Build the base RedirectAndRun url to show the portal
                var redirectAndRunURL = new SafeURL("Embed-PortalLayout.RedirectAndRun");
                redirectAndRunURL.put("ThreadName", "OpenPortal_" + portalName);
                redirectAndRunURL.put("bPurgeTargetThread", true);
                redirectAndRunURL.put("bEncodeLocation", true);
                // Build up the Location param for RedirectAndRun which is really a url for a
                // show selected portal URL, which shows the portal that is specified in portalName param
                var showSelectedPortalURL = new SafeURL("Data-Portal.ShowSelectedPortal");
                showSelectedPortalURL.put("ThreadName", "OpenPortal_" + portalName);
                showSelectedPortalURL.put("portal", portalName);
                showSelectedPortalURL.put("Name", portalName);
                showSelectedPortalURL.put("developer", false);
                // Add the query string of the ShowSelectedPortal url to the location param for redirect and run
                redirectAndRunURL.put("Location", showSelectedPortalURL.toQueryString());
                pega.u.d.convertToRunActivityAction(redirectAndRunURL);
                parent.pega.desktop.wks.injectIframe(pega.desktop.portalName, portalName, redirectAndRunURL.toURL(),
                    actionObj);
            },
            /**
             * openRule - PUBLIC METHOD
             * open a rule in a specific workspace - if the rule is not present, display the new rule harness -  
                 it is possible to display a back button to go back to our current portal. 
                 set rulename and classname to "" and pass the pzInskey to open the rule by InsKey
             * portalName - string - workspace name to transition to.
             * ruletype - string - rule type or pzInsKey (if rulename and classname are empty)
             * rulename - string or object - rule Name. optional if open rule by inskey - 
             * classname - string - class Name. optional - for some rules, set it to ""
             * showBackButton - string - set to "true" to show the backbutton
             * forceCreate - string - set to "true" to force creating a new rule
             */
            openRule: function(portalName, ruletype, rulename, classname, showBackButton, forceCreate) {
                if (typeof portalName === "undefined") return;
                if (typeof ruletype === "undefined") return;
                if (typeof rulename === "undefined") rulename = "";
                if (typeof classname === "undefined") classname = "";
                if (typeof showBackButton === "undefined") showBackButton = "false";
                if (typeof forceCreate == "undefined") forceCreate = "false";
                ruletype = ruletype.trim();
                if (typeof rulename === "string") rulename = rulename.trim();
                classname = classname.trim();
                if (pega.desktop.portalName !== portalName) {
                    var actionObj = ["openrule", portalName, ruletype, rulename, classname, showBackButton,
                        forceCreate];
                    _deleteBackButton();
                    if (showBackButton && showBackButton === "true") {
                        _generateBackButton(portalName, actionObj);
                    } else {
                        pega.desktop.wks.switchWorkspace(portalName, actionObj);
                    }
                } else {
                    var isObject = false;
                    var objRuleInfo;
                    try {
                        /* If rulename is a stringified object- convert back to object */
                        if (typeof rulename == "string" && rulename !== "") {
                            objRuleInfo = JSON.parse(rulename);
                            if (typeof objRuleInfo == "object") {
                                rulename = objRuleInfo;
                            }
                        }
                        if (typeof rulename === "object") {
                            rulename.pxObjClass = ruletype;
                            objRuleInfo = rulename;
                            rulename = JSON.stringify(objRuleInfo);
                            isObject = true;
                        }
                    } catch (e) {}
                    if (forceCreate === "false" && (rulename !== "" || ruletype.indexOf(" ")!==-1)) {
                        var oSafeURLTmp = new SafeURL("@baseclass.pzGetRuleInfo", getReqURI());
                        if (rulename === "") { /* open by InsHandle - we should not open this specific rule */
                            pega.desktop.openRule(ruletype, true);
                            _showBackButton();
                            return;
                        } else {
                            if (isObject) {
                                oSafeURLTmp.put("JSONKeys", rulename);
                            } else {
                                if (classname && classname !== "" && classname !== "undefined") {
                                    oSafeURLTmp.put("InsName", classname.toUpperCase() + "!" + rulename.toUpperCase());
                                } else {
                                    oSafeURLTmp.put("InsName", rulename.toUpperCase());
                                }
                                oSafeURLTmp.put("ClassName", ruletype);
                            }
                        }
                        var strUrl = oSafeURLTmp.toURL();
                        var callback = {
                            success: function(oResponse) {
                                var ruleInfoJsonText = JSON.parse(oResponse.responseText).output;
                                if (ruleInfoJsonText === "" || ruleInfoJsonText.indexOf("Error:") >=
                                    0) {
                                    _createNewRule(ruletype, rulename, classname, isObject,
                                        objRuleInfo);
                                } else {
                                    pega.desktop.openRule(ruleInfoJsonText, true);
                                }
                                _showBackButton();
                            },
                            failure: function(oResponse) {}
                        };
                        pega.util.Connect.asyncRequest('GET', strUrl, callback);
                    } else {
                        _createNewRule(ruletype, rulename, classname, isObject, objRuleInfo);
                        _showBackButton();
                    }
                }
            },
            /**
             * openWorkByHandle - PUBLIC METHOD
             * open an work object in a specific workspace - it is possible to display a back button to go back to our current portal. 
             * portalName - string - workspace name to transition to.
             * pzInskey - string - pzInsKey of the assignment
             * showBackButton - string - set to "true" to show the backbutton
             */
            openWorkByHandle: function(portalName, pzInskey, showBackButton) {
                if (typeof portalName === "undefined") return;
                if (typeof pzInskey === "undefined") return;
                if (typeof showBackButton === "undefined") showBackButton = "false";
                if (pega.desktop.portalName !== portalName) {
                    var actionObj = ["openworkbyhandle", portalName, pzInskey, showBackButton];
                    _deleteBackButton();
                    if (showBackButton && showBackButton === "true") {
                        _generateBackButton(portalName, actionObj);
                    } else {
                        pega.desktop.wks.switchWorkspace(portalName, actionObj);
                    }
                } else {
                    pega.desktop.openWorkByHandle(pzInskey);
                    _showBackButton();
                }
            },
            /**
             * openHarness - PUBLIC METHOD
             * show a harness in a specific workspace - it is possible to display a back button to go back to our current portal
             * portalName - string - workspace name to transition to.
             * rulename - string - name of the harness rule.
             * classname - string - className of the harness to open.
             * harnesslabel - string - label of the harness to show in the browser title.
             * showBackButton - string - set to true to show the backbutton
             */
            openHarness: function(portalName, rulename, classname, harnesslabel, showBackButton) {
                if (typeof portalName === "undefined") return;
                if (typeof rulename === "undefined") return;
                if (typeof classname === "undefined") return;
                if (typeof harnesslabel === "undefined") harnesslabel = "";
                if (typeof showBackButton === "undefined") showBackButton = "false";
                if (pega.desktop.portalName !== portalName) {
                    var actionObj = ["openharness", portalName, rulename, classname, harnesslabel,
                        showBackButton];
                    _deleteBackButton();
                    if (showBackButton && showBackButton === "true") {
                        _generateBackButton(portalName, actionObj);
                    } else {
                        pega.desktop.wks.switchWorkspace(portalName, actionObj);
                    }
                } else {
                    var params = {
                        harness: rulename,
                        harnessClass: classname,
                        displayMode: "3",
                        tabName: {
                            value: harnesslabel,
                            isProperty: false
                        },
                        windowName: harnesslabel,
                        readOnly: false,
                        doSubmit: false
                    };
                    if (pega && pega.api && pega.api.ui && pega.api.ui.actions) {
                        pega.api.ui.actions.launchHarness(params);
                    }
                    _showBackButton();
                }
            }
        }
    })();
}
//static-content-hash-trigger-GCC