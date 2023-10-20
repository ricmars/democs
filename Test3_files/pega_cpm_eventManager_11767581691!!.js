//CPMToolsNavigation.js -- Functions used in the Tools Rule Navigation.

/* Added for globalisation of units */
if (!pega)
  	var pega = {};
if (!pega.cpm)
  	pega.cpm = {};
if(!pega.cpm.UNITS)
           pega.cpm.UNITS = "px";
/* End */

var strPrimaryPageName = pega.u.d.primaryPageName;

var sThread;

function setThread(oObj) {
  if(typeof(oObj) != "undefined" && typeof(oObj.Thread) != "undefined" ) {
    sThread = oObj.Thread;
    sourceTabObj = oObj;
  }
}

function onInit() {
  /* registerForCPMEvent(TABBEDNAVIGATION_TAB_IN_FOCUS,setThread,null);*/
}

function onUnload() { 
/*  cancelEventListener(TABBEDNAVIGATION_TAB_IN_FOCUS, setThread);*/
  pega.util.Event.removeListener("unload", onUnload);
}

pega.util.Event.onDOMReady(onInit);
pega.util.Event.addListener(window, "unload", onUnload);

function CPMshowHistory(event) {
	var ev  = event || window.event;
	setUserStart('HISTORY');

	CPMToolsNav_setReqURI();

	openUrlInWindow(pxReqURI +'?pyActivity=HistoryAndAttachments&HistoryOrAttach=History&CustomFrameName=historyFrame&pzPrimaryPageName=pyWorkPage&PageName='+strPrimaryPageName,'HistoryAndAttachments','','',ev);

	// restore the thread and uri
	if (typeof(restoreURIs) != "undefined") {
    		restoreURIs();
	}
}

function CPMshowAttachment(event) {
	var ev  = event || window.event; 
	setUserStart('ATTACHMENTS');

	CPMToolsNav_setReqURI();

	openUrlInWindow(pxReqURI +'?pyActivity=HistoryAndAttachments&HistoryOrAttach=Attach&CustomFrameName=historyFrame&pzPrimaryPageName=pyWorkPage&PageName='+strPrimaryPageName,'HistoryAndAttachments','','',ev);

	// restore the thread and uri
	if (typeof(restoreURIs) != "undefined") {
    		restoreURIs();
	}	
}

function CPMshowPrint(event) {
	var ev  = event || window.event; 
	setUserStart('customActivityInPopup');

	CPMToolsNav_setReqURI();

	customActivityInPopup(pxReqURI+'?pyActivity=PrintWork&Prompt=false&PrintHarness=CAPrintHarness&pzPrimaryPageName=pyWorkPage','82','80',ev);

	// restore the thread and uri
	if (typeof(restoreURIs) != "undefined") {
    		restoreURIs();
	}
}

function CPMshowWhereAmI(event) {
	var ev  = event || window.event; 
	setUserStart('FLOWLOCATION');

	CPMToolsNav_setReqURI();

	openUrlInWindow(pxReqURI +'?pyActivity=GetLocationInFlow&pzPrimaryPageName=pyWorkPage','FlowLocation','','',ev);

	// restore the thread and uri
	if (typeof(restoreURIs) != "undefined") {
    		restoreURIs();
	}
}

function CPMshowExpandAll(event) {
	var ev  = event || window.event; 
	setUserStart('EXPANDCOLLAPSE');
	toggleExpandCollapse(ev);
}

function CPMshowSpellChecker(event) {
	var ev  = event || window.event;
	setUserStart('SPELLCHECKER');
	runSpellChecker(ev);
}

function CPMShowTranferCallPopup()
{
	CPMToolsNav_setReqURI();
    var applicationSettings=CPMGetDynamicReference();
	var strURL = pxReqURI + "?pyActivity="+applicationSettings.CallInteractionClass+".CPMOpenTranferCallPopup";
	openUrlInWindow(strURL, 'transfercall', "location=no,resizable=no,titlebar=no,status=no,scroll=no,help=no,height=250"+pega.cpm.UNITS+",width=350"+pega.cpm.UNITS,true);

	// restore the thread and uri
	if (typeof(restoreURIs) != "undefined") {
    		restoreURIs();
	}
} 

function openInteractionLogItem(strHandle, strActivity, nTop, nLeft, nHeight , nWidth) {
    var nWndTop = nTop;
    var nWndLeft = nLeft;
    var nWndHeight = window.screen.height * nHeight / 100 ;
    var nWndWidth = window.screen.width * nWidth  / 100 ;

    var strWindowName = "ReviewInteractionLogItem";
    var strWindowFeatures = "status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes";
    var strFeatures = "left=" + nWndLeft +pega.cpm.UNITS+ ",top="+ nWndTop  + pega.cpm.UNITS+",height=" + nWndHeight + pega.cpm.UNITS  + ",width=" + nWndWidth+pega.cpm.UNITS;

    var applicationSettings=CPMGetDynamicReference();
    strActivity = applicationSettings.SiteSpecificClassGroup+"." + strActivity;
    var strUrl =  "?pyActivity=" + strActivity + "&InsHandle=" + strHandle;

    var objWnd = window.open(strUrl, "ReviewInteractionLogItem", strWindowFeatures + "," + strFeatures);

    objWnd.focus();
    return;
}

function CPMTearOffComposite() {
pega.cpm.tabbedInterface.createCompositeTearoffDisplay();
}

function CPMToolsNav_setReqURI() {

	// for tabNavigationGadget, have to change the thread to which ever tab is selected
	if (typeof(setOverridingURIs) != "undefined") {
    		setOverridingURIs();
		
		if (sThread && !(pxReqURI.match(sThread+"$")==sThread)) {
			// restore the thread and uri
			if (typeof(restoreURIs) != "undefined") {
    				restoreURIs();
			}	

			var _cpmURI =  pega.d.pxReqURI.replace(pega.u.d.baseThreadName, sThread);
			var _cpmURILong = pega.u.d.url.replace(pega.u.d.baseThreadName, sThread);
			var oURIObj = new Object();
			oURIObj.CPMURI = _cpmURI;
			oURIObj.CPMURILong = _cpmURILong;
			
			setURIs(oURIObj);

			if (typeof(setOverridingURIs) != "undefined") {
    				setOverridingURIs();
			}
		}
	}
}

//Dynamic Class Reference by getting the JSON object of Declare_CAApplicationSettings Data page
function CPMGetDynamicReference() {
  var recentUrl = new SafeURL("@baseclass.CPMGetDynamicReferenceActivity");
  pega.u.d.asyncRequest('GET', SafeURL_createFromURL(recentUrl.toURL()), {
  success: function (respObject) {
    var applicationSettings = JSON.parse(respObject.responseText);
    return applicationSettings;
  },
  failure: function () {
    console.log("failed");
  },
  scope: this
  }, null);
}

//returns the xmlhttpobject dpending upon different browsers
function returnXMLHttpObj(){
	var request = null;
	if (window.XMLHttpRequest) {
		//For Non IE Browser
		request = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		//For IE Browser
		try{
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e1){
			try{
				request = new ActiveXObject("MSXML2.XMLHTTP");
			}
			catch (e2){
				try {
					request = new ActiveXObject("MSXML3.XMLHTTP");
				}
				catch (e3) {
					alert("Create Ajax Failed!" + e3)
				}
			}
		}
	}
	return request; 
}
//static-content-hash-trigger-YUI
/*

The variable sCPMEventContextId is used to seperate events that fire from one tab context from affecting another.  
In the composite portal world different tabs share the same event management context.  


*/

/* Added for globalisation of units */
if (!pega)
  	var pega = {};
if (!pega.cpm)
  	pega.cpm = {};
if(!pega.cpm.UNITS)
           pega.cpm.UNITS = "px";
/* End */


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
function CPMEventListener(objFunction, objData ,scope) 
{
	this.eventFunction= objFunction;
	this.data= objData;
	this.execute= CPMEventListener_executeFunction;
	this.scope= scope;
}

/*@protected
 * Executes a listening function 
 * @param objEventData - data about the event (passed from sendEvent)
 * @param curEventName– parameter description goes here.
 * @param objEventData– parameter description goes here.
 * @return $boolean$ false if calling function failed, otherwise true
 **/


function CPMEventListener_executeFunction(objEventData) {
	var result= true;
	try {
		if(this.scope){
			this.eventFunction.call(this.scope,objEventData,this.data);
		}else this.eventFunction(objEventData,this.data);
	}
	catch (exception) {
		result= false;
	}
	return result;
}



function determineCPMEventContextId() {


	// if calling from a popup window, the tab contexts is in the window.opener.
	if (window.opener) {
		if (window.opener.pega.cpm ) {
   			if( window.opener.pega.cpm.tabbedInterface ){ 
     				return window.opener.pega.cpm.tabbedInterface.getCorrespondingTabIdFromInteraction(window.opener.document.body);
  			} 
			else {
    				return "";
   			}
		} 
		else {
  			return "";
		}

	}
	else {

		if ( pega.cpm ) {
   			if( pega.cpm.tabbedInterface ){ 
     				return pega.cpm.tabbedInterface.getCorrespondingTabIdFromInteraction(document.body);
   			} 
			else {
    				return "";
   			}
		} 
		else {
  			return "";
		}

	}

}

function filterEvent(oEventData, oEventListenerContainer) {

    if(oEventData) 
       if(oEventData.sCPMEventContextId == oEventListenerContainer.sContextId)
           oEventListenerContainer.oEventListener.execute(oEventData.oParams);
}

var eventsRegistered = new Array();

function registerForCPMEvent(strEventName, objFunction, objData ,scope  ) {

var tobj = {};
    tobj.sContextId = determineCPMEventContextId();
    tobj.oEventListener = new CPMEventListener(objFunction,objData,scope);
eventsRegistered.push( strEventName );

registerEventListener (strEventName, filterEvent, tobj)

}



function sendCPMEvent (strEventName, objEventData,mode,delay) {

var oTObj = {};
    oTObj.sCPMEventContextId = determineCPMEventContextId();
    oTObj.oParams = objEventData;


    sendEvent(strEventName,oTObj,mode,delay);    
}



/*********************
 * Event Types
 *********************/
var LOAD_INTERACTIONDRIVER = "pega.framework.cpm.6.interactiondriver.load";
var CLOSETAB_TABBEDNAVIGATION = "pega.framework.cpm.6.tabbednavigation.closetab";
var UPDATETABLABEL_TABBEDNAVIGATION = "pega.framework.cpm.6.tabbednavigation.updatetablabel";

var TABBEDNAVIGATION_PROCESSTABCLOSED= "pega.framework.cpm.6.tabbednavigation.processtabclosed";
var TABBEDNAVIGATION_PROCESSTABLOADED= "pega.framework.cpm.6.tabbednavigation.processtabloaded";

var TABBEDNAVIGATION_OPENCOMPOSITETAB= "pega.framework.cpm.6.tabbednavigation.opencompositetab";
var TABBEDNAVIGATION_OPENASSIGNMENT= "pega.framework.cpm.6.tabbednavigation.openassignment";

var TABBEDNAVIGATION_STARTNEWPROCESS_SPECIFICTASK= "pega.framework.cpm.6.tabbednavigation.startprocess.specifictask";
var TABBEDNAVIGATION_STARTTASK_BY_KEYS= "pega.framework.cpm.6.tabbednavigation.starttask.bykeys";
var TABBEDNAVIGATION_REVIEW_ITEM= "pega.framework.cpm.6.tabbednavigation.reviewworkitem";
var TABBEDNAVIGATION_REVIEW_CURRENT_ITEM= "pega.framework.cpm.6.tabbednavigation.reviewcurrentworkitem";
var TABBEDNAVIGATION_REVIEW_OR_PROCESS_ITEM= "pega.framework.cpm.6.tabbednavigation.revieworprocessworkitem";
var TABBEDNAVIGATION_TAB_IN_FOCUS = "pega.framework.cpm.6.tabbednavigation.tabinfocus";
var TABBEDNAVIGATION_TRIGGER_TAB_IN_FOCUS_EVENT = "pega.framework.cpm.6.tabbednavigation.trigger.tabinfocus";
var TABBEDNAVIGATION_ACTIONLOADED = "pega.framework.cpm.6.tabbednavigation.actionloaded";
var TABBEDNAVIGATION_FOCUS_TAB_BY_TABID ="pega.framework.cpm.6.tabbednavigation.focustabbytabid";
var TABBEDNAVIGATION_END_INTERACTION ="pega.framework.cpm.6.tabbednavigation.endinteraction";
var TABBEDNAVIGATION_NPROCESSTABS ="pega.framework.cpm.6.tabbednavigation.nprocesstabs";
var TABBEDNAVIGATION_FORCE_TABCOUNT_EVENT="pega.framework.cpm.6.tabbednavigation.forcetabcountevent";

var TABBEDNAVIGATION_NCOMPOSITETABS ="pega.framework.cpm.6.tabbednavigation.ncompositetabs";
var TABBEDNAVIGATION_FORCE_COMPOSITETABCOUNT_EVENT="pega.framework.cpm.6.tabbednavigation.forcecompositetabcountevent";
var CPM_HARNESS_LOADED = "pega.framework.cpm.harness.loaded";

var NAVIGATION_SETTING_CHANGE ="pega.framework.cpm.6.navigation.navigationsettingchanged";


var REFRESH_COMPOSITE = "pega.framework.cpm.customercomposite.refresh";
var RELOAD_COMPOSITE  = "pega.framework.cpm.customercomposite.reload";
var COMPOSITE_LOADED  = "pega.framework.cpm.customercomposite.loaded";
var COMPOSITE_SHRINK  = "pega.framework.cpm.customercomposite.minimize";
var COMPOSITE_ENLARGE = "pega.framework.cpm.customercomposite.maximize";
var COMPOSITE_RESET   = "pega.framework.cpm.customercomposite.defaultsize";

var INTERACTIONDRIVER_LOADED = "pega.framework.cpm.interactiondriver.loaded";
var INTERACTIONDRIVER_UNLOADED = "pega.framework.cpm.interactiondriver.unloaded";
var INTERACTIONDRIVER_INVALIDATE_TASKS = "pega.framework.cpm.interactiondriver.invalidate";
var INTERACTIONDRIVER_CHECKIFEXISTS = "pega.framework.cpm.interactiondriver.checkexists";
var INTERACTIONDRIVER_EXISTS = "pega.framework.cpm.interactiondriver.exists";
var INTERACTIONDRIVER_CATEGORIESLOADED = "pega.framework.cpm.interactiondriver.categoriesloaded";
var INTERACTIONDRIVER_PAUSE = "pega.framework.cpm.interactiondriver.pause";

var CLEAR_INTERACTIONDRIVER = "pega.framework.cpm.6.interactiondriver.clear";
var START_TABBEDTASK ="pega.framework.cpm.6.interactiondriver.starttabbedtask";
var START_TABDEPENDANTTASK ="pega.framework.cpm.6.interactiondriver.starttabdependanttask";

var REFRESH_CONTACTINFORMATION = "pega.framework.cpm.contactinformation.refresh";
var REFRESH_INTERACTIONLOG = "pega.framework.cpm.runtimeinteractionlog.refresh";

var KNOWLEDGECONTENT_LOADED = "pega.framework.cpm.knowledgecontent.loaded";
var DIALOG_REFRESH = "pega.framework.cpm.6.dialog.refresh";
var COACHINGTIP_REFRESH = "pega.framework.cpm.6.cochingtip.refresh";

var HOTKEY_TASK_EVENT = "pega.framework.cpm.hotkey";
var RELOAD_DRIVERANDSUGGESTIONS="pega.framework.cpm.customercomposite.reloaddriverandsuggestion";

function EventMGMT_TaskHotKey(sTaskCategory,sTaskName){
   sendCPMEvent(HOTKEY_TASK_EVENT,{TaskCategory:sTaskCategory,TaskName:sTaskName},SYNC);
}

function EventMGMT_ForceTabCountEvent() {
  sendCPMEvent(TABBEDNAVIGATION_FORCE_TABCOUNT_EVENT,null,ASYNC,15);
}

function EventMGMT_ForceCompositeTabCountEvent() {
  sendCPMEvent(TABBEDNAVIGATION_FORCE_COMPOSITETABCOUNT_EVENT,null,ASYNC,15);
}

function EventMGMT_NProcessTabs(oParams){
  sendCPMEvent(TABBEDNAVIGATION_NPROCESSTABS,oParams,ASYNC,15);
}

function EventMGMT_NCompositeTabs(oParams){
  sendCPMEvent(TABBEDNAVIGATION_NCOMPOSITETABS,oParams,ASYNC,15);
}


function EventMGMT_EndInteraction(oParams) {
  sendCPMEvent(TABBEDNAVIGATION_END_INTERACTION,oParams,ASYNC,15);
}

function EventMGMT_NavSettingChanged(oSettings) {
  sendCPMEvent(NAVIGATION_SETTING_CHANGE,oSettings,ASYNC,15);
} 

function EventMGMT_Trigger_FocusTabByID(sID) {
   sendCPMEvent(TABBEDNAVIGATION_FOCUS_TAB_BY_TABID,sID,ASYNC,15);
}

//used to determine which tab if anyu is currently in focus
function EventMGMT_Trigger_TabInFocus() {
   
   sendCPMEvent(TABBEDNAVIGATION_TRIGGER_TAB_IN_FOCUS_EVENT,null,ASYNC,15);
}

function EventMGMT_ActionLoaded(oTabData) {

    if (oTabData != null) {
	var oBody = document.body;
	var sInteractionId = pega.cpm.tabbedInterface.getCorrespondingTabIdFromInteraction(oBody);
	oTabData.TabInteractionId = sInteractionId;
    }

    /*
     oTabData is expected to contain
     This opens a new tab or refreshes the current tab

     {TabDesc: "blah",TabID:"?",TabType:"process/composite",TabTaskName:""}     
    */
   sendCPMEvent(TABBEDNAVIGATION_ACTIONLOADED,oTabData,ASYNC,15);
}

function EventMGMT_HarnessLoaded(oTabData) {
    /*
     oTabData is expected to contain
     This opens a new tab or refreshes the current tab
     {CPMURL, CPMURLLong }     
    */
 
  sendCPMEvent(CPM_HARNESS_LOADED,oTabData,ASYNC,15);
}



function EventMGMT_TabInFocus(oTabData) {
    /*
     oTabData is expected to contain
     This opens a new tab or refreshes the current tab

     {TabDesc: "blah",TabID:"?",TabType:"process/composite",TabTaskName:""}     
    */
 
  sendCPMEvent(TABBEDNAVIGATION_TAB_IN_FOCUS,oTabData,ASYNC,15);
}



function EventMGMT_OpenCompositeTab(oTabData) {
    /*
     oTabData is expected to contain
     This opens a new tab or refreshes the current tab

     {CategoryName: "blah",KeyOfItem:"key"}     
    */
   sendCPMEvent(TABBEDNAVIGATION_OPENCOMPOSITETAB,oTabData,SYNC,15);
}

function EventMGMT_OpenAssignment(oTabData) {
  sendCPMEvent(TABBEDNAVIGATION_OPENASSIGNMENT,oTabData,ASYNC,15);

}

function EventMGMT_StartNewProcessTab_SpecificTask(oTabData) {
/*
  oTabData is expected to 
  {TaskClass:"Category of task", TaskControlPage:"Page Name", TaskName:"Name of Task" }
*/
  sendCPMEvent(TABBEDNAVIGATION_STARTNEWPROCESS_SPECIFICTASK,oTabData,ASYNC,15);
}

function EventMGMT_StartNewTaskTab_ByKeys(oTabData) {
/*
  oTabData is expected to 
  {TaskClass:"Category of task", TaskControlPage:"Page Name", TaskName:"Name of Task" }
*/
  sendCPMEvent(TABBEDNAVIGATION_STARTTASK_BY_KEYS, oTabData, ASYNC, 15);
}

function EventMGMT_StartNewProcessTab_ReviewCurrentItem(oTabData) {
/*
  oTabData is expected to 
*/
  sendCPMEvent(TABBEDNAVIGATION_REVIEW_CURRENT_ITEM,oTabData,ASYNC,15);
}


function EventMGMT_StartNewProcessTab_ReviewItem(oTabData) {
/*
  oTabData is expected to 
  {Class:"Class of Item to Open", KeyOfItem:"", KeyIsHandle:"true/false" }
*/
  sendCPMEvent(TABBEDNAVIGATION_REVIEW_ITEM,oTabData,ASYNC,15);
}

function EventMGMT_StartNewProcessTab_ReviewOrProcess(oTabData) {
/*
  oTabData is expected to 
  {Class:"Class of Item to Open", KeyOfItem:"", KeyIsHandle:"true/false",Label:"tab label" }
*/
  sendCPMEvent(TABBEDNAVIGATION_REVIEW_OR_PROCESS_ITEM,oTabData,ASYNC,15);
}


function EventMGMT_StartTabDependantTask(oParams) {
    sendCPMEvent(START_TABDEPENDANTTASK,oParams,ASYNC,15);
}

function EventMGMT_ProcessTabLoaded(sSrcID,tabid, sThread) {
    if ( typeof(sSrcID) != "undefined") {
         var local_sSrcID = sSrcID;
	sendCPMEvent(TABBEDNAVIGATION_PROCESSTABLOADED,{sSrcID:local_sSrcID,TabUniqueID:tabid,  ThreadName: sThread},SYNC);
    } 
}

function EventMGMT_ProcessTabClosed(sSrcID,tabid) {
    if ( typeof(sSrcID) != "undefined") {
         var local_sSrcID = sSrcID;
	sendCPMEvent(TABBEDNAVIGATION_PROCESSTABCLOSED,{sSrcID:local_sSrcID,TabUniqueID:tabid },SYNC);
    } 
}

function EventMGMT_CloseTab(sGadgetID,sTabSubGroup) {

    if ( typeof(sGadgetID) != "undefined") {

	var sJSON = '{"EventType": "Busy"}';
	sendEvent("pega_ui_busyIndicator", sJSON, SYNC);

          var local_sGadgetID = sGadgetID;
	sendCPMEvent(CLOSETAB_TABBEDNAVIGATION,{sGadgetID:local_sGadgetID,SRC:sTabSubGroup}, ASYNC,15);
    }
}

function EventMGMT_UpdateTabLabel(oParams) {
sendCPMEvent(UPDATETABLABEL_TABBEDNAVIGATION,oParams, ASYNC,15);

}

function EventMGMT_KnowledgeContentLoaded(){
	sendCPMEvent(KNOWLEDGECONTENT_LOADED,null,ASYNC,15);
}

function EventMGMT_RefreshDialog(oParams){
	sendCPMEvent(DIALOG_REFRESH ,oParams, ASYNC,15);
}

function EventMGMT_RefreshCoachingTip(oParams){
	sendCPMEvent(COACHINGTIP_REFRESH ,oParams, ASYNC,15);
}


function EventMGMT_StartTabbedTask(oParams) {
  sendCPMEvent(START_TABBEDTASK ,oParams, ASYNC,10);
}

function EventMGMT_ClearInteractionDriver() {
  sendCPMEvent(CLEAR_INTERACTIONDRIVER,null,ASYNC,10);
}

function EventMGMT_LoadInteractionDriver() {
  sendCPMEvent(LOAD_INTERACTIONDRIVER,null,ASYNC,10);
}

// sMyID is used for targeted events
function EventMGMT_InteractionDriverCheckExists(sMyId) { 
  sendCPMEvent(INTERACTIONDRIVER_CHECKIFEXISTS, sMyId, ASYNC,10);
}

// sMyID is used for targeted events
function EventMGMT_InteractionDriverExists(sMyId) {
 sendCPMEvent(INTERACTIONDRIVER_EXISTS,sMyId,ASYNC,10);
}
//Syncronous event
function EventMGMT_InteractionDriverPause() {
  sendCPMEvent(INTERACTIONDRIVER_PAUSE,null,SYNC,10);
}

function EventMGMT_InteractionDriverLoaded() {
  sendCPMEvent(INTERACTIONDRIVER_LOADED,null,ASYNC,10);
}

function EventMGMT_InteractionDriverUnloaded() {
  sendCPMEvent(INTERACTIONDRIVER_UNLOADED,null,ASYNC,10);
}

function EventMGMT_InteractionDriverInvalidate() {
  sendCPMEvent(INTERACTIONDRIVER_INVALIDATE_TASKS ,null,ASYNC,10);
}

function EventMGMT_RefreshComposite() {
  sendCPMEvent(REFRESH_COMPOSITE,{bReload:false},ASYNC,10);
}

function EventMGMT_ReloadComposite() {
  sendCPMEvent(RELOAD_COMPOSITE,{bReload:true},ASYNC,10);
}


function EventMGMT_CompositeLoaded() {
  sendCPMEvent(COMPOSITE_LOADED,null,ASYNC,10);
}

function EventMGMT_RefreshContactInformation(){
  sendCPMEvent(REFRESH_CONTACTINFORMATION,null,ASYNC,10);
}

function EventMGMT_RefreshRuntimeInteractionLog(){
  sendCPMEvent(REFRESH_INTERACTIONLOG,null,ASYNC,10);
}

function cancelCPMEvents( eventName ) {
    if (eventName == null) {
       for (var i=0; i<eventsRegistered.length; i++) {
           cancelEventListener(eventsRegistered[i],filterEvent);
       }
    } else {
       cancelEventListener(eventName, filterEvent);
    }
}

function EventMGMT_ReloadTakeActionDriverAndSuggestions() {
  sendCPMEvent(RELOAD_DRIVERANDSUGGESTIONS,null,ASYNC,10);
}
//static-content-hash-trigger-YUI
/* start of CSmdcswitch */
/* register events for ajax container switch */

pega.ui.EventsEmitter.subscribe("onACSwitch", CSOnMdcSwitch, null, null, null, true);
pega.ui.EventsEmitter.subscribe("postMDCRender", CSOnMdcPost, null, null, null, true);
pega.ui.EventsEmitter.subscribe("preMDCRender", CSOnMdcPre, null, null, null, true);

function hideActionAreaInner() {
    scrollWorkAreaToTop();
    //hide the docs in ajax container
    var ajaxDocs = pega.redux.Utils.getAjaxContainerState().mdcDocs;
    for (var i = 0; i < ajaxDocs.length; ++i) {
        var recordId = ajaxDocs[i].recordId;
        if (ajaxDocs[i].isStatic !== "true") {
            document.querySelector("div[data-mdc-recordid=" + recordId + "]").setAttribute("class", "hide");
        }
        else {
            document.querySelector("div[data-mdc-recordid=" + recordId + "]").setAttribute("class", "show");
        }
    }
    $("div").find(".wrap-up-visibility").css("display", "block");
}

function refreshKMView() {

    //updating the harness context for interaction
    var currentInteractionContext = pega.ctxmgr.getContextByProperty("strPyID", pega.redux.Utils.getAjaxContainerState().parentKey);
    pega.ctxmgr.setContext(currentInteractionContext);

    var sectionKMNode = pega.u.d.getSectionByName("CSKMArticlesDisplayWrapper", "", document.body);
    if (sectionKMNode) {
        pega.u.d.reloadSection(sectionKMNode, "", "", false, true, "", false);
    }
    var KMSuggestionCount = pega.u.d.getSectionByName("SuggestedArticleCountForIntentTask", "", document.body);
    if (KMSuggestionCount) {
        pega.u.d.reloadSection(KMSuggestionCount, "", "", false, true, "", false);
    }
    var sectionKMHNode = pega.u.d.getSectionByName("CSKMHeader", "", document.body);
    if (sectionKMHNode) {
        pega.u.d.reloadSection(sectionKMHNode, "", "", false, true, "", false);
    }

    pega.ctxmgr.resetContext();

}

function CSOnMdcPre() {
    scrollWorkAreaToTop();
    //updating the harness context for interaction
    var currentInteractionContext = pega.ctxmgr.getContextByProperty("strPyID", pega.redux.Utils.getAjaxContainerState().parentKey);
    pega.ctxmgr.setContext(currentInteractionContext);

    var sectionTasksNode = pega.u.d.getSectionByName("CPMInteractionTasksWrapper", "", document.body);
    if (sectionTasksNode) {
        pega.u.d.reloadSection(sectionTasksNode, "", "", false, true, "", false);
    }
  
    var sectionAddTaskNode = pega.u.d.getSectionByName("CSInteractionDriverAddTask", "", document.body);
    if (sectionAddTaskNode) {
        pega.u.d.reloadSection(sectionAddTaskNode, "", "", false, true, "", false);
    }
  
    var sectionWrapUpNode = pega.u.d.getSectionByName("InteractionWrapUp", "", document.body);
    if (sectionWrapUpNode) {
        pega.u.d.reloadSection(sectionWrapUpNode, "", "", false, true, "", false);
    }

    var sectionSuggestionsNode = pega.u.d.getSectionByName("CSSuggestionsWrapper", "", document.body);
    if (sectionSuggestionsNode) {
        pega.u.d.reloadSection(sectionSuggestionsNode, "", "", false, true, "", false);
    }

    var sectionKMNode = pega.u.d.getSectionByName("CSKMArticlesDisplayWrapper", "", document.body);
    if (sectionKMNode) {
        pega.u.d.reloadSection(sectionKMNode, "", "", false, true, "", false);
    }
    var KMSuggestionCount = pega.u.d.getSectionByName("SuggestedArticleCountForIntentTask", "", document.body);
    if (KMSuggestionCount) {
        pega.u.d.reloadSection(KMSuggestionCount, "", "", false, true, "", false);
    }
    var sectionKMHNode = pega.u.d.getSectionByName("CSKMHeader", "", document.body);
    if (sectionKMHNode) {
        pega.u.d.reloadSection(sectionKMHNode, "", "", false, true, "", false);
    }
    var sectionCompHeaderNode = pega.u.d.getSectionByName("CPMcompositesHeader", "", document.body);
    if (sectionCompHeaderNode) {
        pega.u.d.reloadSection(sectionCompHeaderNode, "", "", false, true, "", false);
    }
    var sectionCaseactionNode = pega.u.d.getSectionByName("pyCaseActionArea", "", document.body);
    var compositesNode = pega.u.d.getSectionByName("CPMCompositesContainer", "", document.body);
    var activeDocsLen = pega.redux.Utils.getAjaxContainerState().activeDocs.length;
    var activeDocInd = pega.redux.Utils.getAjaxContainerState().activeDocs[activeDocsLen - 1];
    if (activeDocInd > 0 && !sectionCaseactionNode.contains(compositesNode)) {
        $("div").find(".wrap-up-visibility").css("display", "none");

        if (activeDocInd > 0) {
            var ajaxDocs = pega.redux.Utils.getAjaxContainerState().mdcDocs;
            var recordId = ajaxDocs[0].recordId;
            document.querySelector("div[data-mdc-recordid=" + recordId + "]").setAttribute("class", "hide");
        }
    }
    else
        $("div").find(".wrap-up-visibility").css("display", "block");

    pega.ctxmgr.resetContext();

}

function CSOnMdcPost() {
    scrollWorkAreaToTop();
    var oSafeURL = new SafeURL("System-User-Recents.CSRecentContextSwitch");
    if (pega.ctx.strPyID !== null)
        oSafeURL.put("pyRecordID", pega.ctx.strPyID);
    if (pega.ctx.recordId !== null && pega.ctx.recordId !== undefined)
        oSafeURL.put("pyDomID", pega.ctx.recordId);
    if (pega.ctx.strHarnessClass !== null && pega.ctx.strHarnessClass !== undefined)
        oSafeURL.put("pyClassName", pega.ctx.strHarnessClass);
    if (pega.ctx.strKey !== null && pega.ctx.strKey != undefined)
        oSafeURL.put("pyRecordKey", pega.ctx.strKey);
    if (pega.ctx.strHarnessPurpose !== null && pega.ctx.strHarnessPurpose !== undefined) {
        oSafeURL.put("HarnessPurpose", pega.ctx.strHarnessPurpose);
        if (pega.ctx.strHarnessPurpose == "New") {
            var mdcDocsLen = pega.redux.Utils.getAjaxContainerState().mdcDocs.length;
            oSafeURL.put("pyRecordKey", pega.redux.Utils.getAjaxContainerState().mdcDocs[mdcDocsLen - 1].recordKey);
        }
    }

    if (pega.redux.Utils.getAjaxContainerState().parentKey !== null && pega.redux.Utils.getAjaxContainerState().parentKey !== undefined)
        oSafeURL.put("pyParentKey", pega.redux.Utils.getAjaxContainerState().parentKey);

    if (pega.ctx.strPyLabel !== null && pega.ctx.strPyLabel != undefined)
        oSafeURL.put("pyLabel", pega.ctx.strPyLabel);
    oSafeURL.put("MdcAction", "MDCPost");

    pega.u.d.asyncRequest('GET', SafeURL_createFromURL(oSafeURL.toURL()), {
        success: function (oResponse) {
            //updating the harness context for interaction
            var currentInteractionContext = pega.ctxmgr.getContextByProperty("strPyID", pega.redux.Utils.getAjaxContainerState().parentKey);
            pega.ctxmgr.setContext(currentInteractionContext);

            var sectionKMNode = pega.u.d.getSectionByName("CSKMArticlesDisplayWrapper", "", document.body);
            if (sectionKMNode) {
                pega.u.d.reloadSection(sectionKMNode, "", "", false, true, "", false);
            }
            //Start --- US-211310. Refresh the count section in post MDC
            var KMSuggestionCount = pega.u.d.getSectionByName("SuggestedArticleCountForIntentTask", "", document.body);
            if (KMSuggestionCount) {
                pega.u.d.reloadSection(KMSuggestionCount, "", "", false, true, "", false);
            }
            //END --- US-211310. Refresh the count section in post MDC
            var sectionKMHNode = pega.u.d.getSectionByName("CSKMHeader", "", document.body);
            if (sectionKMHNode) {
                pega.u.d.reloadSection(sectionKMHNode, "", "", false, true, "", false);
            }
            var sectionCompHeaderNode = pega.u.d.getSectionByName("CPMcompositesHeader", "", document.body);
            if (sectionCompHeaderNode) {
                pega.u.d.reloadSection(sectionCompHeaderNode, "", "", false, true, "", false);
            }

            var ShowCustomerWrapper = pega.u.d.getSectionByName("ShowCustomerWrapper", "", document.body);
            if (ShowCustomerWrapper) {
                pega.u.d.reloadSection(pega.u.d.getSectionByName("ShowCustomerWrapper", "", ""));
            }
            /* Hide the interaction dialog */
            var ajaxDocs = pega.redux.Utils.getAjaxContainerState().mdcDocs;
            if (ajaxDocs.length > 0) {
                var recordId = ajaxDocs[0].recordId;
                document.querySelector("div[data-mdc-recordid=" + recordId + "]").setAttribute("class", "hide");
            }
        },
        failure: function () {
            //Start --- US-211310. Need to Refresh the count section even on failure
            var KMSuggestionCount = pega.u.d.getSectionByName("SuggestedArticleCountForIntentTask", "", document.body);
            if (KMSuggestionCount) {
                pega.u.d.reloadSection(KMSuggestionCount, "", "", false, true, "", false);
            }
            //US-211310. Need to Refresh the count section even on failure --- END
            console.log("Unable to update the list for record " + pega.ctx.strPyID);
        }
    }, '');
    pega.ctxmgr.resetContext();
    if (pega.chat !== undefined && pega.chat.ChatComponentEventHandler !== undefined) {
        pega.chat.ChatComponentEventHandler.publishChatEvents("UpdateServiceCaseID", {
            'id': pega.ctx.strPyID,
            'type': 'SERVICE CASE IN-PROGRESS'
        });
    }
    /* Auto map any detected entities */
    if (typeof autoMapDetectedEntities == "function") {
        autoMapDetectedEntities();
    }
}


function CSOnMdcSwitch() {
    scrollWorkAreaToTop();
    var oSafeURL = new SafeURL("System-User-Recents.CSRecentContextSwitch");
    if (pega.ctx.strPyID !== null)
        oSafeURL.put("pyRecordID", pega.ctx.strPyID);
    if (pega.ctx.recordId !== null && pega.ctx.recordId !== undefined)
        oSafeURL.put("pyDomID", pega.ctx.recordId);
    if (pega.ctx.strHarnessClass !== null && pega.ctx.strHarnessClass !== undefined)
        oSafeURL.put("pyClassName", pega.ctx.strHarnessClass);
    if (pega.ctx.strKey !== null && pega.ctx.strKey != undefined)
        oSafeURL.put("pyRecordKey", pega.ctx.strKey);
    if (pega.ctx.strHarnessPurpose !== null && pega.ctx.strHarnessPurpose !== undefined) {
        oSafeURL.put("HarnessPurpose", pega.ctx.strHarnessPurpose);
        if (pega.ctx.strHarnessPurpose == "New") {
            var mdcDocsLen = pega.redux.Utils.getAjaxContainerState().mdcDocs.length;
            oSafeURL.put("pyRecordKey", pega.redux.Utils.getAjaxContainerState().mdcDocs[mdcDocsLen - 1].recordKey);
        }
    }
    if (pega.redux.Utils.getAjaxContainerState().parentKey !== null && pega.redux.Utils.getAjaxContainerState().parentKey !== undefined)
        oSafeURL.put("pyParentKey", pega.redux.Utils.getAjaxContainerState().parentKey);

    if (pega.ctx.strPyLabel !== null && pega.ctx.strPyLabel != undefined)
        oSafeURL.put("pyLabel", pega.ctx.strPyLabel);
    oSafeURL.put("MdcAction", "MDCSwitch");
    pega.u.d.asyncRequest('GET', SafeURL_createFromURL(oSafeURL.toURL()), {
        success: function (oResponse) {
            //updating the harness context for interaction
            var currentInteractionContext = pega.ctxmgr.getContextByProperty("strPyID", pega.redux.Utils.getAjaxContainerState().parentKey);
            pega.ctxmgr.setContext(currentInteractionContext);

            var sectionTasksNode = pega.u.d.getSectionByName("CPMInteractionTasksWrapper", "", document.body);
            if (sectionTasksNode) {
                pega.u.d.reloadSection(sectionTasksNode, "", "", false, true, "", false);
            }
          
            var sectionAddTaskNode = pega.u.d.getSectionByName("CSInteractionDriverAddTask", "", document.body);
            if (sectionAddTaskNode) {
                pega.u.d.reloadSection(sectionAddTaskNode, "", "", false, true, "", false);
            }

            var sectionWrapUpNode = pega.u.d.getSectionByName("InteractionWrapUp", "", document.body);
            if (sectionWrapUpNode) {
                pega.u.d.reloadSection(sectionWrapUpNode, "", "", false, true, "", false);
            }

            var sectionKMNode = pega.u.d.getSectionByName("CSKMArticlesDisplayWrapper", "", document.body);
            if (sectionKMNode) {
                pega.u.d.reloadSection(sectionKMNode, "", "", false, true, "", false);
            }
            var KMSuggestionCount = pega.u.d.getSectionByName("SuggestedArticleCountForIntentTask", "", document.body);
            if (KMSuggestionCount) {
                pega.u.d.reloadSection(KMSuggestionCount, "", "", false, true, "", false);
            }
            var sectionKMHNode = pega.u.d.getSectionByName("CSKMHeader", "", document.body);
            if (sectionKMHNode) {
                pega.u.d.reloadSection(sectionKMHNode, "", "", false, true, "", false);
            }
            var sectionCompHeaderNode = pega.u.d.getSectionByName("CPMcompositesHeader", "", document.body);
            if (sectionCompHeaderNode) {
                pega.u.d.reloadSection(sectionCompHeaderNode, "", "", false, true, "", false);
            }

            var sectionCaseactionNode = pega.u.d.getSectionByName("pyCaseActionArea", "", document.body);
            var compositesNode = pega.u.d.getSectionByName("CPMCompositesContainer", "", document.body);
            var activeDocsLen = pega.redux.Utils.getAjaxContainerState().activeDocs.length;
            var activeDocInd = pega.redux.Utils.getAjaxContainerState().activeDocs[activeDocsLen - 1];

            if (activeDocsLen == 1) {
                var sectionCoachingTipDialog = pega.u.d.getSectionByName("CPMCoachingTipDialogWrapper", "", document.body);
                if (sectionCoachingTipDialog) {
                    pega.u.d.reloadSection(sectionCoachingTipDialog, "", "", false, true, "", false);
                }
                //display search box when service case is opened and cancelled for anonymous caller
                var sectionWrapUpNode = pega.u.d.getSectionByName("CAWrapUp", "", document.body);
                if (!sectionWrapUpNode)
                    if (!sectionCaseactionNode.contains(compositesNode)) {
                        if (compositesNode) {
                            $("div").find(".wrap-up-visibility").css("display", "none");
                        } else {
                            $("div").find(".wrap-up-visibility").css("display", "block");
                        }
                    }
                /******** SE-56520 fix starts****************/
                var sectionWrapUpNode = pega.u.d.getSectionByName("CAWrapUp", "", document.body);
                if (!sectionWrapUpNode)
                    if (!sectionCaseactionNode.contains(compositesNode)) {
                        $("div").find(".wrap-up-visibility").css("display", "block");
                    }
                /******** SE-56520 fix ends****************/
            }
            if (activeDocInd > 0 && !sectionCaseactionNode.contains(compositesNode)) {
                $("div").find(".wrap-up-visibility").css("display", "none");
                if (activeDocInd > 0) {
                    var ajaxDocs = pega.redux.Utils.getAjaxContainerState().mdcDocs;
                    var recordId = ajaxDocs[0].recordId;
                    document.querySelector("div[data-mdc-recordid=" + recordId + "]").setAttribute("class", "hide");
                }
            }
            else {
                // Commented out so the wrap-up is only displayed after clicking. This allows for refresh of the section. 
                // $("div").find(".wrap-up-visibility").css("display","block");

                if ($(".cpmsearch-visibility input#OfferAccepted").val() == "Declined") {
                    $("div").find(".wrap-up-visibility").css("display", "block");
                }
            }
        },
        failure: function () {
            console.log("Unable to update the list for record " + pega.ctx.strPyID);
        }
    }, '');
    pega.ctxmgr.resetContext();
    if (pega.chat !== undefined && pega.chat.ChatComponentEventHandler !== undefined) {
        pega.chat.ChatComponentEventHandler.publishChatEvents("UpdateServiceCaseID", {
            'id': pega.ctx.strPyID,
            'type': 'SERVICE CASE ENDED'
        });
    }

    /* Auto map any detected entities */
    if (typeof autoMapDetectedEntities == "function") {
        autoMapDetectedEntities();
    }
}

function CSCloseRecent(activeMDCIndex) {
    if (activeMDCIndex != "") {
        var nextHarnessContext = pega.ctxmgr.getContextByProperty("recordId", activeMDCIndex);

        //switch the harness context to next active context  
        pega.ctxmgr.setContext(nextHarnessContext);
        pega.ctx.gDirtyOverride = false;
        pega.u.d.doClose();
        pega.ctxmgr.resetContext();
        /******** SE-56520 fix starts****************/
        var sectionCaseactionNode = pega.u.d.getSectionByName("pyCaseActionArea", "", document.body);
        var sectionWrapUpNode = pega.u.d.getSectionByName("CAWrapUp", "", document.body);

        if (!sectionWrapUpNode) {
            if (!sectionCaseactionNode.contains(compositesNode)) {
                pega.ctx.gDirtyOverride = false;
            }
        }
        else
            pega.ctx.gDirtyOverride = true;
        /******** SE-56520 fix ends****************/
    }
}

function switchToThisServiceCase(event) {
    if (event && event.target) {
        $(".task-selected").removeClass("task-selected");
        $(event.target).closest(".service-case-wrapper").find(".service-case-task").addClass("task-selected")
    }
}

/* end of csmdcswitch */

/* used to evalaute verification questions when display one questionat a time is selected */
function checkIfVerficationIsEvaluated(eventtype) {
    if (eventtype == "fail")
        $('.VerificationFail button')[0].blur();
    var oSafeURL = new SafeURL("@baseclass.czShowProperyResponse");
    oSafeURL.put("pzPrimaryPageName", "pyWorkPage");
    oSafeURL.put("ShowProperty", "Verified");
    pega.util.Connect.initHeader('Content-Type', "application/x-www-form-urlencoded");
    var transaction = pega.u.d.asyncRequest('POST', oSafeURL, {
        success: function (respObject) {
            Verified1 = respObject.responseText;
            if (Verified1 != "true" && Verified1 != "false") {
                return;
            }
            else
                doFormSubmit('pyActivity=FinishAssignment');
        },
        failure: function () { },
        scope: this
    }, null);

}

if (!pega)
    var pega = {};

if (!pega.cpm)
    pega.cpm = {};

if (!pega.cpm.IP)
    pega.cpm.IP = {};


if (!pega.cpm.IP.NonNativeCase)
    pega.cpm.IP.NonNativeCase = {};


pega.cpm.IP.closeChatInteraction = function (sid) {
    if (sid) {
        window.parent.oPegaChatAgentConnection.leaveChat(sid);
    }

}

pega.cpm.IP.doClientClose = function (paramRecordID) {
    if (typeof (paramRecordID) != 'undefined') {
        oChatTabEventHandler._endChatInteraction(paramRecordID);
    }

    /* if what we are closing is the monitoring of a chat, tell the chat server */
    if (typeof (parent.channelIDObj) != 'undefined' && typeof (parent.channelIDObj[paramRecordID]) != 'undefined') {
        parent.oPegaChatAgentConnection.leaveChat(parent.channelIDObj[paramRecordID]);
        delete parent.channelIDObj[paramRecordID];
    }
}

/* End Event Raisers */




/* Invokes the finish assignment on the given iframe - this is called on confirm button of confirm screen when we've to submit an assignment in interaction thread to take it cpminteraction driver from a service case context*/
pega.cpm.IP.submitAssignmentInInteractionThread = function (interactionThreadName) {
    /* Find iframes */
    var iframes = $(window.parent.document).find("iframe");
    for (i = 0; i < iframes.length; i++) {
        /* Check thread name to find corresponding iframe */
        /* BUG-358499 changed indexof to strict comparision */
        if ($(iframes[i].parentNode).attr("pegathread") == interactionThreadName) {

            iframes[i].contentWindow.doFormSubmit('pyActivity=FinishAssignment', this, "Submitting", null);

            break;
        }
    }
    delete iframes; /* Cleaning object */
}

/*Invoking Application Guides scripts*/
pega.cpm.toggleAppGuide = function () {
    var composerWinCtx = pega.ui.composer.getCurrentComposerWindow();
    composerWinCtx.pega.ui.guide.toggle();
    var guidePanel = composerWinCtx.document.querySelector(".pz-guide-panel");
    if (guidePanel) {
        guidePanel.style.height = null;
    }
}
/*End of App guide scripts*/

/* For closing remote cases */
pega.cpm.IP.close = function (ThreadName) {
    /* Find iframes */
    var iframes = $(window.parent.document).find("iframe");
    var ifrIndx = 0
    for (; ifrIndx < iframes.length; ifrIndx++) {
        /* Check thread name to find corresponding iframe */
        var thread = $(iframes[ifrIndx].parentNode).attr("pegathread");
        if (ThreadName.indexOf(thread) != -1) {
            /* get iframe document and link */
            var iframeDoc = iframes[ifrIndx].contentWindow.document;
            var closeLink = iframeDoc.getElementsByClassName("CloseLayout")[0].getElementsByTagName("a")[0];
            /* Trigerring click on the hidden link for closing the item */
            pega.control.actionSequencer.fireTopPriorityEvent(closeLink, "click");
            break;
        }
    }
    delete iframes; /* Cleaning object */
}



pega.cpm.IP.NonNativeCase.cancel = function (event) {
    if (event.caseKey == pega.cpm.IP.NonNativeCase.caseKey) /* checking whether event is intended for this document */ {
        pega.cpm.IP.close(caseKey);
    }
};

pega.cpm.IP.NonNativeCase.close = function (event) {
    if (event.caseKey == pega.cpm.IP.NonNativeCase.caseKey) /* checking whether event is intended for this document */ {
        pega.cpm.IP.close(caseKey);
    }
};

/* This will be called after the remote case body onload */
pega.cpm.IP.NonNativeCase.resizeIframe = function (ThreadName, height) {

    /* loop iframes */
    try {
        var iframes = $(window.parent.document).find("iframe"),
            targetIframe, nonNativeframe;

        for (var i = 0; i < iframes.length; i++) {
            /* Check thread name to find corresponding iframe */
            if ($(iframes[i].parentNode).attr("pegathread") == ThreadName) {
                targetIframe = iframes[i];
                nonNativeframe = window.document.getElementsByTagName("iframe")[0]; //this will take the caseframe
                break;
            }
        }

        if (height && height <= 800) {
            nonNativeframe.style.height = height + 'px';
        } else if (height && height > 800) {
            nonNativeframe.style.overflow = 'auto';
            nonNativeframe.style.height = '800px';
        } else {
            nonNativeframe.style.height = '430px';
        }

    } catch (e) {
        // console.log(e);
    }

};


/* Start utility functions */

//To handle multiple select for the Add Task button in interaction
function queueIntentTask(param_TaskName, param_TaskClass, param_TaskFlow, label, RemoteCaseType, IsNonNativeCase, event) {

    var UniqueTaskId = new Date().getTime();
    gSelectedTasksStack.push({ TaskName: param_TaskName, TaskClass: param_TaskClass, TaskFlow: param_TaskFlow, label: label, RemoteCaseType: RemoteCaseType, UniqueTaskId: UniqueTaskId, IsNonNativeCase: IsNonNativeCase });
    /* set unique attribute for the element */
    var currentDomElement = pega.util.Event.getTarget(event);
    $(currentDomElement).parents().eq(4).attr("UniqueTaskId", UniqueTaskId);
}

function removeIntentTask(event) {

    /* get unique attribute for the element */
    var currentDomElement = pega.util.Event.getTarget(event);
    var selectedUniqueTaskId = $(currentDomElement).parents().eq(4).attr("UniqueTaskId");
    for (i = 0; i < gSelectedTasksStack.length; i++) {
        if (gSelectedTasksStack[i].UniqueTaskId == selectedUniqueTaskId) {
            gSelectedTasksStack.splice(i, 1);
            break;
        }
    }
}

function launchTasksSelected(interactionID) {
  
    pega.u.d.gBusyInd && pega.u.d.gBusyInd.show(true,true);
    gSelectedTaskListSize = gSelectedTasksStack.length;

    if (gSelectedTaskListSize == 0) {
        return;
    }
    else if (gSelectedTaskListSize > 0) {

        copySelectedTasksStack = gSelectedTasksStack.slice();

        var thisTask = copySelectedTasksStack.shift();
        var thisTaskClass = thisTask.TaskClass;
        var thisTaskFlow = thisTask.TaskFlow;
        var flowParams = "";

        if (thisTask.RemoteCaseType != "")
            flowParams += "&RemoteCaseType=" + thisTask.RemoteCaseType;
        if (thisTask.IsNonNativeCase != "")
            flowParams += "&IsNonNativeCase=" + thisTask.IsNonNativeCase;

        queueselectedtasks(gSelectedTasksStack, interactionID, function () {
            window.createNewWork(thisTaskClass, "", thisTaskFlow, flowParams, "", "", "", { target: "microdc" });
        });

    }
}



function queueselectedtasks(copySelectedTasksStack, interactionID, createWorkCall) {

    var QueuedTasks = "";
    for (var selectedTaskIndex in copySelectedTasksStack) {
        var selectedTask = copySelectedTasksStack[selectedTaskIndex];
        if (!selectedTask) continue;

        QueuedTasks += selectedTask.TaskName + ":" + selectedTask.TaskClass + ":" + selectedTask.TaskFlow + ":" + selectedTask.label;
        /*SE-69136:Intent with comma in desc/id is not Launching from Add Task*/
        QueuedTasks += ";;";
    }

    var oSafeURL = new SafeURL("PegaCA-Work-Interaction.CSQueueTasks");

    oSafeURL.put("QueuedTasks", QueuedTasks);
    oSafeURL.put("InteractionID", interactionID);

    pega.u.d.asyncRequest('POST', SafeURL_createFromURL(oSafeURL.toURL()), {
        success: function (oResponse) {
            /* Display the busy indicator */
            /*SE-63028 commented below line*/
            //parent.showCPMBusyIndicator("driver");
            createWorkCall();
        },
        failure: function () {
        }
    }, "");

}


function initializeTasks() {
    gSelectedTasksStack = new Array();
    copySelectedTasksStack = new Array();

}

function initializeTasksMenu() {
    gSelectedTasksStack = new Array();
    copySelectedTasksStack = new Array();
}


function launchResearchItem() {
    var flowParams = "";
    var CPMResearchIntClass = arguments[0];
    var CPMResearchIntFlow = arguments[1];
    var CPMDataSource = arguments[2];
    flowParams = flowParams + "&CPMDataSource=" + CPMDataSource;
    //iterating over the additional parameters that will be passed to the param page of the flow's data transform
    for (var i = 3; i < arguments.length; i++) {
        //as the first two parameters are pre-fixed rectifying the argument number for additional parameters.
        var k = i - 2;
        flowParams = flowParams + "&Parameter" + k + "=" + arguments[i];
    }

    pega.desktop.createNewWork(CPMResearchIntClass, "", CPMResearchIntFlow, flowParams, "", "", "", "");
}

function CPMGetDetailsOfDataSource() {
    var CPMDataSource = arguments[0];
    var parameter = arguments[1];
    var oSafeURL = new SafeURL("CPMGetDetailsOfDataSource");
    var recentUrl = SafeURL_createFromURL(oSafeURL.toURL())
    recentUrl.put("DataSource", CPMDataSource);

    var transaction1 = pega.u.d.asyncRequest('GET', recentUrl, {
        success: function (oResponse) {
            var result = oResponse.responseText;
            var resultarr = result.split(";");
            launchResearchItem(resultarr[0], resultarr[1], CPMDataSource, parameter);
        },
        failure: function () { },
        scope: this
    },
        "");

}



/* The below function is custom implementation of CS for PRPC Skip to content feature */
/* SE-23159 */
function cpm_skipToContent(contentType) {
    var activeFrame = $("#moduleGroupDiv").children(".iframe-wrapper").filter(function () {
        return ($(this).css('display') == 'block');
    }).find('iframe')[0];
    if (!activeFrame) {
        return;
    }
    var activeWindow = activeFrame.contentWindow;

    var selectorForTarget = "[data-skip-target='" + contentType + "']" //this should ideally get the inner Dynamic Layout  
    //If you need to go for custom areas then use a css class at which point modify the pattern
    //var selectorForTarget = ".CPMTarget_" + contentType; //contentType = main, navigation, search, etc
    if (activeWindow) {
        var contentDiv = activeWindow.$(selectorForTarget)[0];
    }


    if (contentDiv) {
        contentDiv.setAttribute('tabindex', '-1');
        try {
            //contentDiv.focus();
            var focusableElements = $($(contentDiv).find('a[href], button, input[type!="hidden"], select, textarea, img[tabindex]').filter(":visible").toArray());
            var firstElement = focusableElements.eq(0);
            firstElement = (firstElement.length > 0) ? firstElement[0] : null;
            var focusElement = firstElement;
            if (focusElement != null) {
                var keyupAttr = focusElement.getAttribute("data-keyup");

                if (keyupAttr) {
                    focusElement.removeAttribute("data-keyup");
                }
                setTimeout(function () { focusElement.focus(); }, 500);
                if (keyupAttr) {
                    setTimeout(function () { focusElement.setAttribute("data-keyup", keyupAttr); }, 500);
                }
            }
            else { pega.u.d.getNextFocusableElement(null, contentDiv).focus(); }

            return;
        } catch (e) {
            //console.log(e);
        }
    }
}

/* This function is used to call Skip To Content in an Interaction tab.*/
function pega_cpm_IP_skipToMainContent(interactionThreadName) {

    /*  console.log("incoming thread name is "+interactionThreadName);*/

    /* Find iframes */
    var iframes = $(window.parent.document).find("iframe");
    /*  for(i=0;i<iframes.length;i++) 
    {
      console.log("for frame with thread "+$(iframes[i].parentNode).attr("pegathread")+", function type is "+typeof iframes[i].contentWindow.cpm_skipToMainContent);
    } */

    for (i = 0; i < iframes.length; i++) {
        if ($(iframes[i].parentNode).attr("pegathread") == interactionThreadName) {
            /*  console.log("Calling skiptomaincontent in iframe "+$(iframes[i].parentNode).attr("pegathread"));*/
            iframes[i].contentWindow.cpm_skipToMainContent();
            break;
        }
    }
    delete iframes; /* Cleaning object */
}

/* End PRPC Skip to content feature */

/* switch portal utilities */
function switchPortal(strNewPortal, ownerName, ExpressPortal) {
    var strConfirmMsg = "Re-display the Desktop using the '" + trim(strNewPortal) + "' layout?";
    var con = false;

    con = confirm(strConfirmMsg);


    if (con) {
        var bSafeURL = new SafeURL("@baseclass.CPMSwitchPortal");
        pega.u.d.asyncRequest('GET', SafeURL_createFromURL(bSafeURL.toURL()), '');
        var strURL = "";
        /*pass expressportal as some value to force the thread context to standard*/
        if (ExpressPortal === 'true') {
            strURL = new SafeURL("Data-Portal.ShowSelectedPortal");
            strURL.put("pxReqURI", requestHomeURI + "/!STANDARD");
            strURL.put("portal", strNewPortal);
            strURL.put("developer", ownerName);
            pega.u.d.convertToRunActivityAction(strURL);
        } else {
            strURL = new SafeURL("Data-Portal.ShowSelectedPortal");
            strURL.put("pxReqURI", requestURI);
            strURL.put("portal", strNewPortal);
            strURL.put("developer", ownerName);
            pega.u.d.convertToRunActivityAction(strURL);
        }

        var objParent = window.parent;
        while (objParent != objParent.parent) {
            try {
                objParent = objParent.parent;
            } catch (e) { }
        }
        gCurrentPortal = strNewPortal;
        desktopsharedscript_setURL(objParent, strURL.toURL());

    }
}
function desktopsharedscript_setURL(windowObject, strURL) {
    if (windowObject.navigate) {

        windowObject.navigate(strURL);
    } else {

        windowObject.location = strURL;
    }

}
/* switch portal end utilities */

/**************** KM Toggling - START *****************/

function showKM() {
    $("body").addClass("km-expanded");
    $(".int-ui-right-pane-wrapper").removeClass("collapsed").find(":focusable").first().focus();
    $(".int-ui-right-pane-wrapper").attr("data-expanded", "true");
    $(".cs-home-right-pane").find(":focusable").first().focus();
    $(window).trigger('resize');
}

function hideKM(collapseRightPane) {
    var kmPaneCurrentScrollPos = $(".int-ui-right-pane>div.item-2").scrollTop();
    $("body").removeClass("km-expanded");
    if ($("body").hasClass("scroll-chat-to-bottom")) {
        $("body").removeClass("scroll-chat-to-bottom");
        scrollRightPaneToBottom("Chat");
    }
    if (collapseRightPane != null && (collapseRightPane == 'true' || collapseRightPane == true)) {
        /* If the collapseRightPage is true, only collapse if there's no other div under int-ui-right-pane-header. 
           If there's more than 1, that means this is a chat or email interaction and collapsing the pane will hide the content */
        if (HasOnlyKMPane) {
            $(".int-ui-right-pane-wrapper").addClass("collapsed");
            $(".km-floating-button").focus();
        }
    }
    $(window).trigger('resize');
}

/**************** KM Toggling - END ********************/

/* For triggering composite refresh */
function TriggerCompositeRefresh(Thread) {
    /* Find iframes */
    var iframes = $(window.parent.document).find("iframe");
    for (i = 0; i < iframes.length; i++) {
        var parNode = $(iframes[i].parentNode);
        var pegathrd = parNode.attr("pegathread");
        /* Check thread name to find corresponding iframe */
        /* BUG-358499 changed indexof to strict comparision  */
        if ($(iframes[i].parentNode).attr("pegathread") == Thread) {
            var iframeDoc = iframes[i].contentWindow.document;
            var refreshLink = iframeDoc.getElementById("CompositeRefreshTrigger");
            refreshLink.click();
            break;
        }
    }
    delete iframes; /* Cleaning object */
}
/* End triggering composite refresh */


/* End utilities */

/* Hide internal content in KM articles when PegaKM:Internal role is not available*/

/** to remove all elements having class for internal content **/
function removeInternalContent() {
    $(".internalKC").remove();
}

/** displays all elements having class for internal content **/
function showInternalContent() {

    $(".internalKC").show();
}

/*End Hide internal content in KM articles when PegaKM:Internal role is not available*/

/** Function to fetch article from article link within the content**/

function openArticleReference() {

    $('.clickableKC').attr('onClick', 'articleLink(event);');
}

/*Fetch article*/

function articleLink(event) {

    var id = event.target.id;

    var params = "ContentID=" + id;

    handleClientEvent('SERVER', 'CSKMFetchLatestKCPforKC', params, '-1', event);

}

/** End of function to fetch article from article link within the content**/


/* function to simulate click when account is selected from overview tab*/
function switchCompositeFocus() {

    $("[node_name='CPMCompositesContainer'] .layout.count-3:nth-child(1)").trigger("click");
}

/** Launch service cases from troubleshooter articles **/
function launchServiceCase() {
    $('.case-type-link').attr('onClick', 'showServiceCase(event);');
}

function showServiceCase(event) {
    var caseTypeMeta = $('.case-type-link').attr("casetypemeta");
    var caseTypeMetaJS = JSON.parse(caseTypeMeta);
    var strClassName = caseTypeMetaJS.id;
    var harnessVersion = "";
    var strFlowName = "pyStartCase";
    var strFlowParams = "";
    var contentID = "";
    var dynamicContainerID = "";
    var skipConflictCheck = "";

    createTaskFromArticle(strClassName, harnessVersion, strFlowName, strFlowParams, contentID, dynamicContainerID,
        skipConflictCheck);
}
/** EO: Launch service cases from troubleshooter articles **/
//static-content-hash-trigger-YUI

/* Event handler function for entity drop-down controller - START */
function entitydropdowneventhandler(event) {
    var target = $('[data-mdc-id="acprimary"] div.show');
    if (target.length > 0) {
        var container = $(event.target).closest(".int-ui-right-pane-content");
        if (!container || container.length === 0) {
            container = $(event.target).closest(".ai-found-entities");
        }
        pega.cs.formfiller.invokeformfiller({ "scope": target, "event": event, "container": container, mapCallback: trainEmailNLP });
        event.preventDefault();
        event.stopPropagation();
    }
}

function entitydropdowneventhandlerForSelection(event) {
    var selection = window.getSelection();
    if (selection && selection.focusNode && selection.focusNode.data && selection.focusNode.data.trim().length > 0) {
        var textSelected = selection.focusNode.data.substring(selection.anchorOffset, selection.focusOffset);

        /* getting the class name of parent node */
        var parentEleClassName = selection.focusNode.parentElement.className;
        /* parent class name has "entity" in it continue */
        if (textSelected.length > 0 || (parentEleClassName.includes("entity"))) {
            var target = $('[data-mdc-id="acprimary"] div.show');
            var duplicateCases = $(target).find('.duplicatecasesinfo');
            if (textSelected.length <= 0) {
                textSelected = selection.focusNode.data
            }
            else {
                textSelected = selection.toString();
            }
            if (target.length > 0 && duplicateCases.length < 1) {
                event.preventDefault();
                event.stopPropagation();
                var container = $(event.target).closest(".int-ui-right-pane-content");
                if (!container || container.length === 0) {
                    container = $(event.target).closest(".ai-found-entities");
                }
                pega.cs.formfiller.invokeformfiller({ "scope": target, "event": event, "container": container, textSelected: textSelected, mapCallback: trainEmailNLP });
            }

        }
    }

}

function trainEmailNLP(mapping) {
    pega.api.ui.actions.runDataTransform({
        name: "SetMappedEntities",
        parameters: [
            { name: "SelectedProperty", value: mapping.propertyMappedToField, isProperty: false },
            { name: "SelectedText", value: mapping.selectedText, isProperty: false }
        ],
        event: mapping.event
    });
}

/* Event handler function for entity drop-down controller - END */

/*********************** Smart Email - Floating email composer - START *******************/

pega.namespace("pega.cs.smartemail");
pega.cs.smartemail = (function () {

    function toggleCollapse(event) {
        var smartEmailReplyPane = event.target.closest(".floating-email-composer");
        smartEmailReplyPane.classList.toggle("collapsed");
    }

    function toggleMaximize(event) {
        var smartEmailReplyPane = event.target.closest(".floating-email-composer");
        smartEmailReplyPane.classList.toggle("maximized");
        if (smartEmailReplyPane.classList.contains("maximized")) {
            smartEmailReplyPane.classList.remove("collapsed");
        }
    }

    return {
        toggleCollapse: toggleCollapse,
        toggleMaximize: toggleMaximize
    }
})();

/*********************** Smart Email - Floating email composer - END *********************/

//static-content-hash-trigger-YUI

function closeInteraction() {
    console.log("Event received for closing interaction");
    pega.u.d.doClose();
}
//static-content-hash-trigger-YUI
//BUG-583957
function clearDirtyFlag() {
    pega.ctxmgr.setRootDocumentContext();
    pega.ctx.gDirtyOverride = false;
}

/** Functions for Knowledge component **/
/* Called from Run script action of Pega UI controls */
function publishReloadKMEvent(id, event, data) {
    var articleId
    if (data != "") {
        var strArr = data.split(" ");
        if (strArr.length > 1) {
            articleId = data.split(" ")[1];
        } else {
            articleId = data.split(" ")[0];
        }

    }

    pega.desktop.support.getDesktopWindow().knowledge.publishKMEvent(id, event, articleId);
}

/* Used to remove all events for interaction and service cases launched in that interaction */
function unsubscribeCSPubSubEvents(id) {
    var interactionIdCases = id + "_cases";
    var csPubSubObj = pega.desktop.support.getDesktopWindow().CSPubSub;
    if (null != csPubSubObj.subscribers[interactionIdCases] && null != csPubSubObj.subscribers[interactionIdCases]["CLEANUP CASES"]) {
        var svcPubSubArr = csPubSubObj.subscribers[interactionIdCases]["CLEANUP CASES"].split(",");
        for (var i = 0; i < svcPubSubArr.length; i++) {
            if (null != csPubSubObj.subscribers[svcPubSubArr[i]])
                csPubSubObj.unsubscribe(svcPubSubArr[i], null);
        }
        csPubSubObj.unsubscribe(interactionIdCases, null);
    }
    csPubSubObj.unsubscribe(id, null);
}

//static-content-hash-trigger-GCC
$(document).ready(function() {
  $('.layout-noheader-next_best_action').css('bottom', '0');
});
//static-content-hash-trigger-YUI
function controlLink(action, link, linkHandle, linkType, soapUrl, useDotNet){

   var yes = confirm("Are you sure you wish to "+action+" link: " + link + "?");
   var statusMessage = "";

   if(yes){
   if("stop" == action ){
   	statusMessage= stopLink(link, linkHandle, linkType, soapUrl, useDotNet);
   }
   else if("start" == action){
   	statusMessage= startLink(link, linkHandle, linkType, soapUrl, useDotNet);
   }
   else if("restart" == action){
   	statusMessage= restartLink(linkHandle);
   }
   else if("failover" == action){
   	statusMessage= failoverLink(link);
   }

   updatePageList(linkHandle, linkType);

   if(statusMessage == "GOOD"){
   	// window.location.reload(true);
    }
   }
}




function startLink(link, linkHandle, linkType, soapUrl, useDotNet)
{
        var activityUrl = new SafeURL("ChannelServices-Admin-CTILink.StartLink");
        activityUrl.put("LinkHandle", linkHandle);
        activityUrl.put("LinkType", linkType);
        activityUrl.put("SoapUrl", soapUrl);
        activityUrl.put("UseDotNet", useDotNet);
        
        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        return statusMessage;
}

function stopLink(link, linkHandle, linkType, soapUrl, useDotNet)
{
  
        var activityUrl = new SafeURL("ChannelServices-Admin-CTILink.StopLink");
        activityUrl.put("LinkHandle", linkHandle);
        activityUrl.put("LinkType", linkType);
        activityUrl.put("SoapUrl", soapUrl);
        activityUrl.put("UseDotNet", useDotNet);
        
        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        return statusMessage;
}

function restartLink(linkHandle)
{
        var activityUrl = new SafeURL("ChannelServices-Admin-CTILink.RestartLink");
        activityUrl.put("LinkHandle", linkHandle);
             
        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        return statusMessage;
}

function addCTILink(linkClass)
{
  var objRMAction = new pega.rf.RMAction();
  objRMAction.put("DefaultClass",linkClass);
  var bSuccess=objRMAction.newRule(function(){}); 
}

function failoverLink(link)
{
  
        var activityUrl = new SafeURL("ChannelServices-Admin-CTILink.UIFailoverLink");
        activityUrl.put("LinkName", link);

        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        return statusMessage;
}

function refreshStatus(link, type)
{

  var activityUrl = new SafeURL("ChannelServices-Admin-CTILink.GetLinkStatusInfo");
  activityUrl.put("LinkName", link );
  activityUrl.put("LinkType", type );

  var temp = activityUrl.toURL();
  var request = invokeRequest(temp);
  //var statusMessage = request.responseText;

  //return statusMessage;
}


function updatePageList(linkHandle, type)
{
  var activityUrl = new SafeURL("ChannelServices-Landing-PegaCTI.GetLinkDefinitionStatusUpdates"); 
  activityUrl.put("LinkHandle", linkHandle );
  activityUrl.put("LinkType", type );

  var temp = activityUrl.toURL();
  var request = invokeRequest(temp);
  var statusMessage = request.responseText;

  //window.location.reload(true);

  return statusMessage;
}

function logoutAgent(link, session, device, agent, insKey)
{
    var yes = confirm("Are you sure you wish to logout agent " + agent + "?");
    if(yes)
    {    
        var activityUrl = new SafeURL("ChannelServices-Embed-Device-Phone.LogoutAgent");
        activityUrl.put("Link", link);
        activityUrl.put("Session", session);
        activityUrl.put("Device", device);
        activityUrl.put("Agent", agent);
        activityUrl.put("Queue", "");
        activityUrl.put("ConfigKey", insKey);

        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        //window.parent.location.reload(true);
    }
}


function closeDevice(link, session, device, insKey)
{
    var yes = confirm("Are you sure you wish to close device " + device + "?");
    if(yes)
    {    
        var activityUrl = new SafeURL("ChannelServices-Embed-Device-Phone.CloseDevice");
        activityUrl.put("Link", link);
        activityUrl.put("Session", session);
        activityUrl.put("Device", device);
        activityUrl.put("ConfigKey", insKey);
        var temp = activityUrl.toURL();
        var request = invokeRequest(temp);
        var statusMessage = request.responseText;
        if(statusMessage != "GOOD")
        {
            alert(statusMessage);
        }
        //window.parent.location.reload(true);
    }
}

function invokeRequest(url) 
{
  var request; 
  var requestReturnCopy;
  if(window.XMLHttpRequest) 
  { 

    request = new XMLHttpRequest();
  } 
  else if(window.ActiveXObject) 
  {

    request = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (request != null) 
  {

    request.onreadystatechange = function() 
    {  
      if(request.readyState == 4) 
      { 
        requestReturnCopy = request;
      }  
    };

    request.open("POST", url, false);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    request.send(null);

  }

  return requestReturnCopy;
}

//this method is used to give fade in fadeout effect once the connection is ok
function fadeInFadeOutText(status){
  		
  $("div[data-ui-meta*='TestConnectivity'] i").remove(); //remove the icon;
  
  if(status && status.toLowerCase().indexOf("success") > -1){
     $("div[data-ui-meta*='TestConnectivity'] span").addClass("pegaCallSuccessText").css("color","#0EEA0E").append(status);
  }else{
     $("div[data-ui-meta*='TestConnectivity'] span").addClass("pegaCallSuccessText pegaCallAlertMessageRed").append(status);
  }
  
  $("div[data-ui-meta*='TestConnectivity'] span").fadeIn(3000);
  	  
}

function repositionCallOverlay(e){
  console.log("repositionCallOverlay->level");
  try{
    var target = pega.util.Event.getTarget(e),
        level = pega.u.d.getPopOverLevel(target);
    console.log("repositionCallOverlay->level" + level);
    if (level >= 0) {
      var popOver = pega.u.d.getPopOver(level);
      $(pega.u.d.getPopOver(0).getActivePopOverElement()).css('visibility','hidden');
      setTimeout(function(){
        popOver.reposit();
        $(pega.u.d.getPopOver(0).getActivePopOverElement()).css('visibility','visible');
      },500);
    }
  }catch(ex){
    console.log(ex);
  }
}
//static-content-hash-trigger-YUI
/* This script block will handle the driver toggle behaviour*/
pega.CSDriverUtil = (function() {
    var collapsedSection = '';
    var expandedSection = '';
    var winLocal = window;
    var dlFormat = '.home-header-main';
    var inlineWrapper = "";
    var driverArea = "";
    $(document).ready(function() {
        initSection();
        winLocal = $(window) || window;
        inlineWrapper = $(dlFormat);
        driverArea = inlineWrapper.children()[0];
        mainContent = inlineWrapper.children()[1];
        $('.layout-noheader-next_best_action').css('bottom', '0');
        winLocal.resize(debounce(adjustwidth, 250));
        registerHotKeyListerForButton();
        setTimeout(function() {
            adjustwidth();
        }, 0);
    });

    function initSection() {
        collapsedSection = $("[node_name='CPMInteractionDriverCollapsed']");
        expandedSection = $("[node_name='CPMInteractionDriver']");
        inlineWrapper = $(dlFormat);
        driverArea = inlineWrapper.children()[0];
        mainContent = inlineWrapper.children()[1];
        $('.layout-noheader-next_best_action').css('bottom', '0');
    }

    function adjustwidth() {
        expandDriver();
    }
    /* Method to expand the driver area*/
    function expandDriver() {
        initSection();
        collapsedSection.css('display', 'none');
        $(driverArea).find(".layout-noheader-driver_left_nav").children().removeClass("csLeftdriverCollapsed");
        expandedSection.css('display', 'flex');
    }
    /* Method to collapse the driver area*/
    function collapseDriver() {
        
    }
  
   /***
   *This is to register hot key support ALT+T and ALT+W for add task and wrapup in collapsed mode.
   * Note- for icon button accesskey support is not there in PRPC.
   **/
    function registerHotKeyListerForButton() {
      document.onkeyup = function(e) {
        e = e || window.event;
        if (e.altKey && e.which === 84) {
          $(".add-task-button button").click();
        }
      }
    }

    return {
        collapseDriver: collapseDriver,
        expandDriver: expandDriver,
        adjustwidth: adjustwidth
    };
})();
/* Made this function global*/
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/*BUG-330781 Fix - Start 
Resolution : Disabling scroll for body such that, driver & content always has 100% of iframe's height. 
For coposite, scroll will be handled internally so that driver doesn't scroll while coposite scrolls.
*/
$(document).ready(function(){
  try{
    if(window.self !== window.top){
      $("body").css("overflow-y","hidden");
    }
  }catch(ex){

  }
});
/*BUG-330781 Fix - End */
//static-content-hash-trigger-YUI
/*! nanoScrollerJS - v0.8.7 - (c) 2015 James Florentino; Licensed MIT */ ! function(a) {
    return "function" == typeof define && define.amd ? define(["jquery"], function(b) {
        return a(b, window, document)
    }) : "object" == typeof exports ? module.exports = a(require("jquery"), window, document) : a(jQuery, window,
        document)
}(function(a, b, c) {
    "use strict";
    var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H;
    z = {
            paneClass: "nano-pane",
            sliderClass: "nano-slider",
            contentClass: "nano-content",
            enabledClass: "has-scrollbar",
            flashedClass: "flashed",
            activeClass: "active",
            iOSNativeScrolling: !1,
            preventPageScrolling: !1,
            disableResize: !1,
            alwaysVisible: !1,
            flashDelay: 1500,
            sliderMinHeight: 20,
            sliderMaxHeight: null,
            documentContext: null,
            windowContext: null
        }, u = "scrollbar", t = "scroll", l = "mousedown", m = "mouseenter", n = "mousemove", p = "mousewheel", o =
        "mouseup", s = "resize", h = "drag", i = "enter", w = "up", r = "panedown", f = "DOMMouseScroll", g = "down",
        x = "wheel", j = "keydown", k = "keyup", v = "touchmove", d = "Microsoft Internet Explorer" === b.navigator.appName &&
        /msie 7./i.test(b.navigator.appVersion) && b.ActiveXObject, e = null, D = b.requestAnimationFrame, y = b.cancelAnimationFrame,
        F = c.createElement("div").style, H = function() {
            var a, b, c, d, e, f;
            for (d = ["t", "webkitT", "MozT", "msT", "OT"], a = e = 0, f = d.length; f > e; a = ++e)
                if (c = d[a], b = d[a] + "ransform", b in F) return d[a].substr(0, d[a].length - 1);
            return !1
        }(), G = function(a) {
            return H === !1 ? !1 : "" === H ? a : H + a.charAt(0).toUpperCase() + a.substr(1)
        }, E = G("transform"), B = E !== !1, A = function() {
            var a, b, d;
            return a = c.createElement("div"), b = a.style, b.position = "absolute", b.width = "100px", b.height =
                "100px", b.overflow = t, b.top = "-9999px", c.body.appendChild(a), d = a.offsetWidth - a.clientWidth,
                c.body.removeChild(a), d
        }, C = function() {
            var a, c, d;
            return c = b.navigator.userAgent, (a = /(?=.+Mac OS X)(?=.+Firefox)/.test(c)) ? (d = /Firefox\/\d{2}\./.exec(
                c), d && (d = d[0].replace(/\D+/g, "")), a && +d > 23) : !1
        }, q = function() {
            function j(d, f) {
                this.el = d, this.options = f, e || (e = A()), this.$el = a(this.el), this.doc = a(this.options.documentContext ||
                        c), this.win = a(this.options.windowContext || b), this.body = this.doc.find("body"), this.$content =
                    this.$el.children("." + this.options.contentClass), this.$content.attr("tabindex", this.options.tabIndex ||
                        0), this.content = this.$content[0], this.previousPosition = 0, this.options.iOSNativeScrolling &&
                    null != this.el.style.WebkitOverflowScrolling ? this.nativeScrolling() : this.generate(), this.createEvents(),
                    this.addEvents(), this.reset()
            }
            return j.prototype.preventScrolling = function(a, b) {
                if (this.isActive)
                    if (a.type === f)(b === g && a.originalEvent.detail > 0 || b === w && a.originalEvent.detail <
                        0) && a.preventDefault();
                    else if (a.type === p) {
                    if (!a.originalEvent || !a.originalEvent.wheelDelta) return;
                    (b === g && a.originalEvent.wheelDelta < 0 || b === w && a.originalEvent.wheelDelta > 0) &&
                    a.preventDefault()
                }
            }, j.prototype.nativeScrolling = function() {
                this.$content.css({
                    WebkitOverflowScrolling: "touch"
                }), this.iOSNativeScrolling = !0, this.isActive = !0
            }, j.prototype.updateScrollValues = function() {
                var a, b;
                a = this.content, this.maxScrollTop = a.scrollHeight - a.clientHeight, this.prevScrollTop = this
                    .contentScrollTop || 0, this.contentScrollTop = a.scrollTop, b = this.contentScrollTop >
                    this.previousPosition ? "down" : this.contentScrollTop < this.previousPosition ? "up" :
                    "same", this.previousPosition = this.contentScrollTop, "same" !== b && this.$el.trigger(
                        "update", {
                            position: this.contentScrollTop,
                            maximum: this.maxScrollTop,
                            direction: b
                        }), this.iOSNativeScrolling || (this.maxSliderTop = this.paneHeight - this.sliderHeight,
                        this.sliderTop = 0 === this.maxScrollTop ? 0 : this.contentScrollTop * this.maxSliderTop /
                        this.maxScrollTop)
            }, j.prototype.setOnScrollStyles = function() {
                var a;
                B ? (a = {}, a[E] = "translate(0, " + this.sliderTop + "px)") : a = {
                    top: this.sliderTop
                }, D ? (y && this.scrollRAF && y(this.scrollRAF), this.scrollRAF = D(function(b) {
                    return function() {
                        return b.scrollRAF = null, b.slider.css(a)
                    }
                }(this))) : this.slider.css(a)
            }, j.prototype.createEvents = function() {
                this.events = {
                    down: function(a) {
                        return function(b) {
                            return a.isBeingDragged = !0, a.offsetY = b.pageY - a.slider.offset().top,
                                a.slider.is(b.target) || (a.offsetY = 0), a.pane.addClass(a.options.activeClass),
                                a.doc.bind(n, a.events[h]).bind(o, a.events[w]), a.body.bind(m, a.events[
                                    i]), !1
                        }
                    }(this),
                    drag: function(a) {
                        return function(b) {
                            return a.sliderY = b.pageY - a.$el.offset().top - a.paneTop - (a.offsetY ||
                                    .5 * a.sliderHeight), a.scroll(), a.contentScrollTop >= a.maxScrollTop &&
                                a.prevScrollTop !== a.maxScrollTop ? a.$el.trigger("scrollend") : 0 ===
                                a.contentScrollTop && 0 !== a.prevScrollTop && a.$el.trigger(
                                    "scrolltop"), !1
                        }
                    }(this),
                    up: function(a) {
                        return function(b) {
                            return a.isBeingDragged = !1, a.pane.removeClass(a.options.activeClass),
                                a.doc.unbind(n, a.events[h]).unbind(o, a.events[w]), a.body.unbind(m,
                                    a.events[i]), !1
                        }
                    }(this),
                    resize: function(a) {
                        return function(b) {
                            a.reset()
                        }
                    }(this),
                    panedown: function(a) {
                        return function(b) {
                            return a.sliderY = (b.offsetY || b.originalEvent.layerY) - .5 * a.sliderHeight,
                                a.scroll(), a.events.down(b), !1
                        }
                    }(this),
                    scroll: function(a) {
                        return function(b) {
                            a.updateScrollValues(), a.isBeingDragged || (a.iOSNativeScrolling || (a.sliderY =
                                a.sliderTop, a.setOnScrollStyles()), null != b && (a.contentScrollTop >=
                                a.maxScrollTop ? (a.options.preventPageScrolling && a.preventScrolling(
                                    b, g), a.prevScrollTop !== a.maxScrollTop && a.$el.trigger(
                                    "scrollend")) : 0 === a.contentScrollTop && (a.options.preventPageScrolling &&
                                    a.preventScrolling(b, w), 0 !== a.prevScrollTop && a.$el
                                    .trigger("scrolltop"))))
                        }
                    }(this),
                    wheel: function(a) {
                        return function(b) {
                            var c;
                            if (null != b) return c = b.delta || b.wheelDelta || b.originalEvent &&
                                b.originalEvent.wheelDelta || -b.detail || b.originalEvent && -b
                                .originalEvent.detail, c && (a.sliderY += -c / 3), a.scroll(), !
                                1
                        }
                    }(this),
                    enter: function(a) {
                        return function(b) {
                            var c;
                            if (a.isBeingDragged) return 1 !== (b.buttons || b.which) ? (c = a.events)[
                                w].apply(c, arguments) : void 0
                        }
                    }(this)
                }
            }, j.prototype.addEvents = function() {
                var a;
                this.removeEvents(), a = this.events, this.options.disableResize || this.win.bind(s, a[s]), this
                    .iOSNativeScrolling || (this.slider.bind(l, a[g]), this.pane.bind(l, a[r]).bind("" + p + " " +
                        f, a[x])), this.$content.bind("" + t + " " + p + " " + f + " " + v, a[t])
            }, j.prototype.removeEvents = function() {
                var a;
                a = this.events, this.win.unbind(s, a[s]), this.iOSNativeScrolling || (this.slider.unbind(),
                    this.pane.unbind()), this.$content.unbind("" + t + " " + p + " " + f + " " + v, a[t])
            }, j.prototype.generate = function() {
                var a, c, d, f, g, h, i;
                return f = this.options, h = f.paneClass, i = f.sliderClass, a = f.contentClass, (g = this.$el.children(
                        "." + h)).length || g.children("." + i).length || this.$el.append('<div class="' + h +
                        '"><div class="' + i + '" /></div>'), this.pane = this.$el.children("." + h), this.slider =
                    this.pane.find("." + i), 0 === e && C() ? (d = b.getComputedStyle(this.content, null).getPropertyValue(
                        "padding-right").replace(/[^0-9.]+/g, ""), c = {
                        right: -14,
                        paddingRight: +d + 14
                    }) : e && (c = {
                        right: -e
                    }, this.$el.addClass(f.enabledClass)), null != c && this.$content.css(c), this
            }, j.prototype.restore = function() {
                this.stopped = !1, this.iOSNativeScrolling || this.pane.show(), this.addEvents()
            }, j.prototype.reset = function() {
                var a, b, c, f, g, h, i, j, k, l, m, n;
                return this.iOSNativeScrolling ? void(this.contentHeight = this.content.scrollHeight) : (this.$el
                    .find("." + this.options.paneClass).length || this.generate().stop(), this.stopped &&
                    this.restore(), a = this.content, f = a.style, g = f.overflowY, d && this.$content.css({
                        height: this.$content.height()
                    }), b = a.scrollHeight + e, l = parseInt(this.$el.css("max-height"), 10), l > 0 && (this
                        .$el.height(""), this.$el.height(a.scrollHeight > l ? l : a.scrollHeight)), i = this
                    .pane.outerHeight(!1), k = parseInt(this.pane.css("top"), 10), h = parseInt(this.pane.css(
                        "bottom"), 10), j = i + k + h, n = Math.round(j / b * i), n < this.options.sliderMinHeight ?
                    n = this.options.sliderMinHeight : null != this.options.sliderMaxHeight && n > this.options
                    .sliderMaxHeight && (n = this.options.sliderMaxHeight), g === t && f.overflowX !== t &&
                    (n += e), this.maxSliderTop = j - n, this.contentHeight = b, this.paneHeight = i, this.paneOuterHeight =
                    j, this.sliderHeight = n, this.paneTop = k, this.slider.height(n), this.events.scroll(),
                    this.pane.show(), this.isActive = !0, a.scrollHeight === a.clientHeight || this.pane.outerHeight(!
                        0) >= a.scrollHeight && g !== t ? (this.pane.hide(), this.isActive = !1) : this.el.clientHeight ===
                    a.scrollHeight && g === t ? this.slider.hide() : this.slider.show(), this.pane.css({
                        opacity: this.options.alwaysVisible ? 1 : "",
                        visibility: this.options.alwaysVisible ? "visible" : ""
                    }), c = this.$content.css("position"), ("static" === c || "relative" === c) && (m =
                        parseInt(this.$content.css("right"), 10), m && this.$content.css({
                            right: "",
                            marginRight: m
                        })), this)
            }, j.prototype.scroll = function() {
                return this.isActive ? (this.sliderY = Math.max(0, this.sliderY), this.sliderY = Math.min(this.maxSliderTop,
                            this.sliderY), this.$content.scrollTop(this.maxScrollTop * this.sliderY / this.maxSliderTop),
                        this.iOSNativeScrolling || (this.updateScrollValues(), this.setOnScrollStyles()), this) :
                    void 0
            }, j.prototype.scrollBottom = function(a) {
                return this.isActive ? (this.$content.scrollTop(this.contentHeight - this.$content.height() - a)
                    .trigger(p), this.stop().restore(), this) : void 0
            }, j.prototype.scrollTop = function(a) {
                return this.isActive ? (this.$content.scrollTop(+a).trigger(p), this.stop().restore(), this) :
                    void 0
            }, j.prototype.scrollTo = function(a) {
                return this.isActive ? (this.scrollTop(this.$el.find(a).get(0).offsetTop), this) : void 0
            }, j.prototype.stop = function() {
                return y && this.scrollRAF && (y(this.scrollRAF), this.scrollRAF = null), this.stopped = !0,
                    this.removeEvents(), this.iOSNativeScrolling || this.pane.hide(), this
            }, j.prototype.destroy = function() {
                return this.stopped || this.stop(), !this.iOSNativeScrolling && this.pane.length && this.pane.remove(),
                    d && this.$content.height(""), this.$content.removeAttr("tabindex"), this.$el.hasClass(this.options
                        .enabledClass) && (this.$el.removeClass(this.options.enabledClass), this.$content.css({
                        right: ""
                    })), this
            }, j.prototype.flash = function() {
                return !this.iOSNativeScrolling && this.isActive ? (this.reset(), this.pane.addClass(this.options
                    .flashedClass), setTimeout(function(a) {
                    return function() {
                        a.pane.removeClass(a.options.flashedClass)
                    }
                }(this), this.options.flashDelay), this) : void 0
            }, j
        }(), a.fn.nanoScroller = function(b) {
            return this.each(function() {
                var c, d;
                if ((d = this.nanoscroller) || (c = a.extend({}, z, b), this.nanoscroller = d = new q(this,
                        c)), b && "object" == typeof b) {
                    if (a.extend(d.options, b), null != b.scrollBottom) return d.scrollBottom(b.scrollBottom);
                    if (null != b.scrollTop) return d.scrollTop(b.scrollTop);
                    if (b.scrollTo) return d.scrollTo(b.scrollTo);
                    if ("bottom" === b.scroll) return d.scrollBottom(0);
                    if ("top" === b.scroll) return d.scrollTop(0);
                    if (b.scroll && b.scroll instanceof a) return d.scrollTo(b.scroll);
                    if (b.stop) return d.stop();
                    if (b.destroy) return d.destroy();
                    if (b.flash) return d.flash()
                }
                return d.reset()
            })
        }, a.fn.nanoScroller.Constructor = q
});

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
 function loggingToasterPopActivityIP(MessageToLog,Reason,OfferID,postdata){
      if (OfferID=="" || OfferID==undefined)
   {return;}
     
   if(postdata.detail.response.pyPurpose === 'expiredChat')
     { return;
     }
     var oSafeURL = new SafeURL("ChannelServices-Interaction-Chat.ToasterPopForChat");
     oSafeURL.put("MessageToLog", MessageToLog);
     oSafeURL.put("LoggingLevel", "Error");
    oSafeURL.put("Action", "Logging");
    oSafeURL.put("Reason", Reason);
       oSafeURL.put("OfferID", OfferID);
     var writetolog = pega.u.d.asyncRequest(
        "POST",
        SafeURL_createFromURL(oSafeURL.toURL()),
        {
          success: function () { },
          failure: function () {},
          scope: this,
        },
        null
      );
  };
/**
 * This jQuery plugin resizes a textarea to adapt it automatically to the content.
 * @author Amaury Carrade
 * @version 1.1
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lessier General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lessier General Public License for more details.
 *
 * You should have received a copy of the GNU Lessier General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function($) {
    $(document).ready(function() {
        $('body').append(
            '<div id="autoResizeTextareaCopy" style="box-sizing: border-box; -moz-box-sizing: border-box;  -ms-box-sizing: border-box; -webkit-box-sizing: border-box; visibility: hidden;"></div>'
        );
        var $copy = $('#autoResizeTextareaCopy');

        function autoSize($textarea, options) {
            $copy.css({
                fontFamily: $textarea.css('fontFamily'),
                fontSize: $textarea.css('fontSize'),
                padding: $textarea.css('padding'),
                paddingLeft: $textarea.css('paddingLeft'),
                paddingRight: $textarea.css('paddingRight'),
                paddingTop: $textarea.css('paddingTop'),
                paddingBottom: $textarea.css('paddingBottom'),
                width: $textarea.css('width')
            });
            $textarea.css('overflow', 'hidden');
            var text = $textarea.val().replace(/\n/g, '<br/>').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(
                /"/g, '&quot;'); /***Changed as part of HFIX-48009***/
            $copy.html(text + '<br />');
            var newHeight = $copy.css('height');
            $copy.html('');
            if (parseInt(newHeight) != 0) {
                if ((options.maxHeight != null && parseInt(newHeight) < parseInt(options.maxHeight)) ||
                    options.maxHeight == null) {
                    if (options.animate.enabled) {
                        $textarea.animate({
                            height: newHeight
                        }, {
                            duration: options.animate.duration,
                            complete: options.animate.complete,
                            step: options.animate.step,
                            queue: false
                        });
                    } else {
                        $textarea.css('height', newHeight);
                    }
                    $textarea.css('overflow-y', 'hidden');
                } else {
                    $textarea.css('overflow-y', 'scroll');
                }
            }
        }
        $.fn.autoResize = function(options) {
            var $this = $(this),
                defaultOptions = {
                    animate: {
                        enabled: false,
                        duration: 100,
                        complete: null,
                        step: null
                    },
                    maxHeight: null
                };
            options = (options == undefined) ? {} : options;
            options = $.extend(true, defaultOptions, options);
            $this.change(function() {
                autoSize($this, options);
            }).keydown(function() {
                autoSize($this, options);
            }).keyup(function() {
                autoSize($this, options);
            }).focus(function() {
                autoSize($this, options);
            });
            $this.on("input propertychange", function() {
                autoSize($this, options);
            });
            startupOptions = options;
            startupOptions.animate.enabled = options.animate.enabled;
            autoSize($this, startupOptions);
        };
    });
})(jQuery);
/***************** Config for Common Utils - START ***********************/
var overlapRuntimeToolBar = true;
/***************** Config for Common Utils - END *************************/
/* this will resize the DC height */
function resizeInteractionPortalDcHeight() {
    var runTimeToolBarHeight = 0;
    var runTimeToolBar = $('[node_name="pzRuntimeToolsTopBar"]');
    if (runTimeToolBar.length > 0 && !overlapRuntimeToolBar) {
        runTimeToolBarHeight = runTimeToolBar.height();
    }
    var footer = $("footer");
    var finalHeight = $("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0) -
        runTimeToolBarHeight;
  if (finalHeight!=0){
     $("#workarea").height(finalHeight);
  }
   
    $(".cs-social-panel").height(finalHeight);
    $(".inbound-email-pane").height(finalHeight);
    adjustChatContentArea();
}

function toggleKBSection(event) {
    var kbSection = $(".CpmKmwrapper");
    var kbToggleBtn = $(".cskm-toggle-button i.icons");
    kbSection.slideToggle("slow", function() {
        kbToggleBtn.toggleClass("cskm-toggle-button-blue");
        resizeInteractionPortalDcHeight();
        adjustChatContentArea();
    });
}

function toggleKMWidget() {
    $("body").toggleClass("KM-Expanded");
    /*if($("body").hasClass("KM-Expanded")){
     $(".km-toggle-icon").removeClass("cs-icon-status-warm").addClass("cs-icon-status-positive");
    }else{
      $(".km-toggle-icon").removeClass("cs-icon-status-positive").addClass("cs-icon-status-warm");
    }*/
}
/* this will be called from interaction context to toggle others*/
function setWorkAreaFullWidth() {
    var dcwrapper = $(".dc-wrapper");
    var chatWrapper = $(".chat-wrapper");
    var inboundWrapper = $(".inbound-wrapper");
    var socialWrapper = $(".social-wrapper");
    var footer = $("footer");
    var runTimeToolBar = $('[node_name="pzRuntimeToolsTopBar"]');
    var runTimeToolBarHeight = 0;
    if (runTimeToolBar.length > 0 && !overlapRuntimeToolBar) {
        runTimeToolBarHeight = runTimeToolBar.height();
    }
    if (dcwrapper.length && chatWrapper.length) {
        $(dcwrapper[0]).css("width", "100%");
        $(chatWrapper[0]).css("display", "none");
        $(inboundWrapper[0]).css("display", "none");
        $(socialWrapper[0]).css("display", "none");
        $("#workarea").height($("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0) -
            runTimeToolBarHeight);
        if (pega.u.d.resizeHarness != null) {
            pega.u.d.resizeHarness();
        }
    }
}
/* this will be called from Inbound Corr context to toggle others*/
function configureInboundCorrSection(cpmSearchHeaderDisp, headerVisible, showEmailContent) {
    var dcwrapper = $(".dc-wrapper");
    var chatWrapper = $(".chat-wrapper");
    var inboundWrapper = $(".inbound-wrapper");
    var socialWrapper = $(".social-wrapper");
    var runTimeToolBar = $('[node_name="pzRuntimeToolsTopBar"]');
    var runTimeToolBarHeight = 0;
    var footer = $("footer");
    if (runTimeToolBar.length > 0 && !overlapRuntimeToolBar) {
        runTimeToolBarHeight = runTimeToolBar.height();
    }
    if (dcwrapper.length && chatWrapper.length) {
        $(dcwrapper).css("flex", 1).css("width", "100%");
        $(chatWrapper[0]).css("display", "none");
        $(socialWrapper[0]).css("display", "none");
        if ((cpmSearchHeaderDisp && headerVisible) || showEmailContent) {
            $(inboundWrapper[0]).css({
                "display": "flex",
                "flex": "0 1 600px",
                "width": "600px"
            });
        } else {
            $(inboundWrapper[0]).css("display", "none");
        }
        console.log("runtime tool bar height " + runTimeToolBarHeight)
        $("#workarea").height($("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0) -
            runTimeToolBarHeight);
        if (pega.u.d.resizeHarness != null) {
            pega.u.d.resizeHarness();
        }
    }
}
/* this will be called from CHAT context to toggle others*/
function configureChatSection(cpmSearchHeaderDisp, headerVisible) {
    var dcwrapper = $(".dc-wrapper");
    var chatWrapper = $(".chat-wrapper");
    var inboundWrapper = $(".inbound-wrapper");
    var socialWrapper = $(".social-wrapper");
    var footer = $("footer");
    var runTimeToolBar = $('[node_name="pzRuntimeToolsTopBar"]');
    var runTimeToolBarHeight = 0;
    if (runTimeToolBar.length > 0 && overlapRuntimeToolBar) {
        runTimeToolBarHeight = runTimeToolBar.height();
    }
    if (dcwrapper.length && chatWrapper.length) {
        $(dcwrapper).css("flex", 1).css("width", "100%");
        $(inboundWrapper[0]).css("display", "none");
        $(socialWrapper[0]).css("display", "none");
        if (cpmSearchHeaderDisp == "true" && headerVisible == "true") {
            $(chatWrapper[0]).css({
                "display": "flex",
                "flex": "0 1 350px"
            });
        } else {
            $(chatWrapper[0]).css("display", "none");
        }
        $("#workarea").height($("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0) -
            runTimeToolBarHeight);
        if (pega.u.d.resizeHarness != null) {
            pega.u.d.resizeHarness();
        }
    }
}
/* this will be called from CHAT context to toggle others*/
function adjustSocialSection(cpmSearchHeaderDisp, headerVisible) {
    var dcwrapper = $(".dc-wrapper");
    var chatWrapper = $(".chat-wrapper");
    var inboundWrapper = $(".inbound-wrapper");
    var socialWrapper = $(".social-wrapper");
    var footer = $("footer");
    if (dcwrapper.length && socialWrapper.length) {
        $(dcwrapper).css("flex", 1).css("width", "100%");
        $(inboundWrapper[0]).css("display", "none");
        $(chatWrapper[0]).css("display", "none");
        if (cpmSearchHeaderDisp == "true" && headerVisible == "true") {
            $(socialWrapper[0]).css({
                "display": "flex",
                "flex": "0 1 600px"
            });
        } else {
            $(socialWrapper[0]).css("display", "none");
        }
        $("#workarea").height($("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0));
        if (pega.u.d.resizeHarness != null) {
            pega.u.d.resizeHarness();
        }
    }
}
/* this function will calculate the height we need to set for the chat content or the nano pane */
function adjustChatContentArea() {
    var cpmChatWrapper = $(".chat-wrapper");
    var footer = $("footer");
    if (cpmChatWrapper && cpmChatWrapper.length) {
        var totalHeight = $("body").height() - $("header").height() - (footer.height() != null ? footer.height() : 0);
        cpmChatWrapper.height(totalHeight);
        var chatHeaderHeight = $(".chat-header-wrapper").outerHeight();
        var cmpChatStackChildren = $(".chat-stack").children();
        var cmpChatStackitem1 = $(cmpChatStackChildren[0]),
            cmpChatStackitem2 = $(cmpChatStackChildren[1]);
        /* removed the -20 from the end of this calculation. It seems like it was there to account for the express header,
           but that should not be there for an end user anyway, so it's not needed */
        var finalHeight = totalHeight - cmpChatStackitem2.height() - chatHeaderHeight;
        cmpChatStackitem1.css("height", finalHeight);
        $(".nano .nano-content").prepend($(".chat-bot-area").detach());
        $(".nano").height(finalHeight);
        $(".nano").nanoScroller();
    }
}
/* this function will resize the chat text area based on typing */
function autoReziseChatTextArea() {
    $("textarea.cpm-chat-area").autoResize({
        animate: {
            enabled: true,
            duration: 'fast',
            complete: function() {
                adjustChatContentArea();
            }
        },
        maxHeight: '100px'
    });
}
/* this function will be called when we click the edit icon in chat text */
function pushChatDialog() {
    var editor = document.getElementsByClassName("cke_contents")[0];
    if (editor != null) {
        var editorframe = editor.getElementsByTagName("iframe")[0];
        var body = editorframe.contentDocument || editorframe.contentWindow.document;
        var bodytext = body.getElementsByTagName("body")[0];
        /* This changes the text from placeholder to editable */
        $(bodytext).removeClass("placeholder");
        bodytext.focus();
        typeof showTextLimit =='function' && showTextLimit();
    }
}
function getMessageLength(message) {        
  if (!message){           
    message = '';
  }
  return message.replace(/<\/?[^>]+(>|$)/g, "").replace(/(\&nbsp;)+/g, '').replace(/\u200B/g,'').trim().length;
}

function pushDialog(dialogText, pushType) {
    var editor;
    var editorlength;
    /* If suggested disposition is used */
    if (pushType == "used") {
        editor = document.querySelector("[name$=TabChatEntry]")
        editor.value = dialogText.replace(/[\s\n\r]+/g, ' ').replace(/&nbsp;/gi, '');
        editor.focus();
    } else {
        /*BUG-613772 - appending the dialog text where the cursor is located instead of appending it at the end*/
        var textAreaId;	     
  	    var ckeditors = document.getElementsByClassName("PEGACKEDITOR textAreaStyle");
	      editorlength = ckeditors.length;
        if (editorlength>0){
          editor = ckeditors[editorlength-1];
        } else {
          editor = ckeditors[0];
        }
  	    if(editor != null){
  	      textAreaId = editor.id;    
 		      var ckeditorInstance = CKEDITOR.instances[textAreaId];  
		      var textAreaElem = ckeditorInstance.element.$;  
          var dialogTextFinal = dialogText.replace(/[\s\n\r]+/g, ' ').replace(/&nbsp;/gi, '');
	      	$(textAreaElem).trigger("insertTextOn", dialogTextFinal);
      	}
    }
   typeof showTextLimit =='function' && showTextLimit();
}

/* Toggle search and close icon based on text value */
function handleAdvancedSearch(event) {
    if (!event) {
        return;
    }
    var txtInput = $(event.target);
    var advWrapper = $(txtInput).closest(".advanced-search-wrapper");
    var searchIcon = $(advWrapper).find(".item-2");
    var closeIcon = $(advWrapper).find(".item-3");
    var dInput = txtInput.val();
    if (dInput) {
        searchIcon.css("display", "none");
        closeIcon.css("display", "block");
    } else {
        searchIcon.css("display", "block");
        closeIcon.css("display", "none");
    }
}
/* Clear the typed text value */
function clearAdvancedSearchText(event) {
    if (!event) {
        return;
    }
    var advWrapper = $(event.target).closest(".advanced-search-wrapper");
    var txtInput = $(advWrapper).find("input[type='text']");
    var searchIcon = $(advWrapper).find(".item-2");
    var closeIcon = $(advWrapper).find(".item-3");
    if (txtInput.val()) {
        txtInput.val('');
        searchIcon.css("display", "none");
        closeIcon.css("display", "block");
    } else {
        searchIcon.css("display", "block");
        closeIcon.css("display", "none");
    }
}
/**************** this IIFE block will help us to configure the chat toaster pop **************/
/*************** function to close ovarlay which is already opened - Start **********************/
function closeOverlays() {
    $("#modalOverlay").trigger("click");
}
/*************** function to close ovarlay which is already opened - End**********************/
(function(pega) {
    if (!pega) var pega = {};
    if (!pega.cpm) pega.cpm = {};
    if (!pega.cpm.toasterpop) pega.cpm.toasterpop = {};
    /* Start Toaster popup utility functions */
    pega.cpm.toasterpop.hideToasterPop = function() {
        if ($("#toasterpop").length > 0) {
            $("#toasterpop").removeClass("alerting");
        }
    }
    pega.cpm.toasterpop.loadToasterPop = function(url, cb, offerId,postdata) {
        var safeURL = SafeURL_createFromURL(url);
        pega.u.d.asyncRequest("POST", safeURL, {
            success: function(oResponse) {
                var toasterpop = $("#toasterpop");
                toasterpop.addClass("alerting").html(oResponse.responseText);
               if(document.querySelector('#toasterpop').offsetHeight>0)
                {
                  var msg="In loadToasterPop function after addclass when offsetHeight is greaterthan 0 "+offerId;
                  loggingToasterPopActivityIP(msg,"success",offerId,postdata);
                }
              else
                {
                  var msg="In loadToasterPop function after addclass when offsetHeight is not created"+offerId;
                  loggingToasterPopActivityIP(msg,"fail",offerId,postdata);
                }
                /* toasterpop.attr("tabindex", -1).focus().css("outline", "none");*/
                cb && cb(true);
            },
            failure: function() {
                alert("Request from server failed.");
                cb && cb(false);
            }
        }, null);
    }
})(pega);
/*Start -- Functions referred from CPMHistory control*/
function addHistory(strCategory, historyMemo, reasonFieldValue, fieldValue, interactionClassName) {
    var oSafeURL = new SafeURL(interactionClassName + ".CPMAddHistory");
    var recentUrl = SafeURL_createFromURL(oSafeURL.toURL());
    recentUrl.put("pzPrimaryPageName", "pyWorkPage");
    recentUrl.put("strMessageKey", historyMemo);
    recentUrl.put("strCategory", strCategory);
    recentUrl.put("strReasonFieldValue", reasonFieldValue);
    recentUrl.put("strFieldValue", fieldValue);
    var bHistoryAdded = false;
    var transaction1 = pega.u.d.asyncRequest('GET', recentUrl, {
        success: function(oResponse) {
            bHistoryAdded = oResponse.responseText;
        },
        failure: function() {},
        scope: this
    }, "");
}

function showHistory(strCategory, historyMemo, interactionClassName) {
    var oSafeURL = new SafeURL(interactionClassName + ".CPMGetLocalizedTextForFieldValue");
    var recentUrl = SafeURL_createFromURL(oSafeURL.toURL());
    recentUrl.put("PropertyReference", strCategory);
    recentUrl.put("StringToLocalize", historyMemo);
    var transaction2 = pega.u.d.asyncRequest('GET', recentUrl, {
        success: function(oResponse) {
            alert(oResponse.responseText);
        },
        failure: function() {},
        scope: this
    }, "");
}
/*End -- Functions referred from CPMHistory control*/
/********************************* Driver Script - Start **********************************/
function adjustDriver() {
    var targetedHeight = $(".workarea-view-scroll-wrapper").height() - 200;
    var CPMInteractionTasksDiv = $('div[node_name="CPMInteractionTasks"]');
    var CPMInteractionTasksDivContent = $('div[node_name="CPMInteractionTasks"]>div>div>div');
    $(CPMInteractionTasksDiv).addClass("nano has-scrollbar");
    if (targetedHeight >= $(CPMInteractionTasksDivContent).height()) {
        $(CPMInteractionTasksDiv).css("height", $(CPMInteractionTasksDivContent).height());
    } else {
        $(CPMInteractionTasksDiv).css("height", targetedHeight);
    }
    $('div[node_name="CPMInteractionTasks"]>div').addClass("nano-content content");
    $(CPMInteractionTasksDiv).nanoScroller();
  
    var CPMInteractionTasksChildDiv = $('div[node_name="CPMInteractionTasks"]>div');
    $(CPMInteractionTasksChildDiv).attr('tabindex','-1');
}
/********************************* Driver Script - END ****************************/
/********************************* Express Toggle History - Scripts - START ******************************/
function toggleExpressHistory(element, interactionClassName) {
    var isExpressToggleHistoryEnabled;
    isExpressToggleHistoryEnabled = $(element).is(":checked");
    $(".cpm-history-checkbox[data-is-express-history-enabled]").attr("data-is-express-history-enabled",
        isExpressToggleHistoryEnabled);
    var oSafeURL = new SafeURL(interactionClassName + ".CheckExpressHistoryStatus");
    var recentUrl = SafeURL_createFromURL(oSafeURL.toURL());
    recentUrl.put("PropertyReference", isExpressToggleHistoryEnabled);
    var transaction2 = pega.u.d.asyncRequest('GET', recentUrl, {
        success: function(oResponse) {},
        failure: function() {},
        scope: this
    }, "");
}

function markFieldAsReviewed(ele, FieldName, historyMemo, printableHistoryMemo, ReasonValue, FieldValue,
    interactionClassName, checkedToolTip) {
    if (!$(ele).is('[readonly]')) {
        $(ele).prop('checked', true);
        $(ele).prop('readonly', true);
        $(ele).prop('title', checkedToolTip);
        addHistory(FieldName, historyMemo, ReasonValue, FieldValue, interactionClassName);
       console.log("interaction clas name ",interactionClassName);
        if (printableHistoryMemo != "") {
            if (typeof pushDialog == 'function') {
                /* Added as part of react chat work*/
                if(pega.chat!== undefined && pega.chat.ChatComponentEventHandler!==undefined )
                  {
                    var pushData = {"dialogText" : printableHistoryMemo};
                    pega.chat.ChatComponentEventHandler.publishEvent("CHAT COMPOSER EVENT", "PUSH DIALOG", pushData);
                  }
                else
                  {
                    pushDialog(printableHistoryMemo);
                  }
               
                
                /* Added as part of react chat work*/
            }
        }
        return true;
    } else {
        return false;
    }
}
/********************************* Express Toggle History - Scripts - END ******************************/
/******************************** Utility Scripts for Actions - Start **********************************/
/******************************** Script to toggle a css class for an item in RDL - Start **********************************/
function toggleCssClassForListItem(event, containerSelector, itemSelector, classToBeToggled, resetIfAlreadySelected) {
    var target = event.target;
    var container = $(target).closest(containerSelector);
    var currentSelectedItem = $(container).find(itemSelector + "." + classToBeToggled);
    var itemToBeSelected = $(target).closest(itemSelector);
    if (currentSelectedItem.is(itemToBeSelected) && resetIfAlreadySelected === 'true') {
        currentSelectedItem.removeClass(classToBeToggled);
        return;
    }
    if (!currentSelectedItem.is(itemToBeSelected)) {
        currentSelectedItem.removeClass(classToBeToggled);
    }
    $(itemToBeSelected).addClass(classToBeToggled);
}

function toggleCssClass(elementSelector, cssClass) {
    $(elementSelector).toggleClass(cssClass);
}

function scrollRightPaneToBottom(pane){
  /** BUG-438757 - START **/
  //If no Pane is passed, considering the default pane as Chat pane
  pane = pane || "Chat";
  var scrollPos = 0;
  if(pane === "Chat"){
    if($("body").hasClass("km-expanded")){
      $("body").addClass("km-expanded scroll-chat-to-bottom");
    }
     var IsTabInFocus = pega.cs.notificationmanager.isCurrentDCTabInFocus();
    if(IsTabInFocus){
      scrollPos = $(".int-ui-right-pane .int-ui-right-pane-chat-content>div").height();
      $(".int-ui-right-pane .int-ui-right-pane-chat-content").animate({scrollTop: scrollPos}, 'slow');
    }
  }else if(pane === "KM"){
    scrollPos = $(".int-ui-right-pane .int-ui-right-pane-km-content>div").height();
    $(".int-ui-right-pane .int-ui-right-pane-km-content").animate({scrollTop: scrollPos}, 'slow');
  }else if(pane === "Email"){
    scrollPos = $(".int-ui-right-pane .int-ui-right-pane-email-content>div").height();
    $(".int-ui-right-pane .int-ui-right-pane-email-content").animate({scrollTop: scrollPos}, 'slow');
  }
  /** BUG-438757 - END **/
}

function scrollWorkAreaToTop() {
    $(".workarea-view-content").animate({
        scrollTop: 0
    }, 'slow');
}
/******************************** Script to toggle a css class for an item in RDL - End **********************************/
/******************************** Script to scroll to bottom of the element - START **************************************/
function scrollToBottom(elementSelector, animate, duration) {
    var ele = $(elementSelector);
    if (ele.length > 0) {
        ele = ele[0];
        var elementHeight = ele.scrollHeight;
        if (animate == 'true') {
            if (duration == null) {
                duration = 1000;
            }
            $(ele).animate({
                scrollTop: elementHeight
            }, duration);
        } else {
            $(ele).scrollTop(elementHeight);
        }
    }
}

function ShowSmartInfo() {
    $("#_popOversContainer").show();
}

function HideSmartInfo() {
    $("#_popOversContainer").hide();
}
/******************************** Script to scroll to bottom of the element - END **************************************/
/******************************** Script to attach a css file - START ************************************/
function attachCssFile(filename, foldername) {
    if ($("link[ref-id='" + filename + "']").length == 0) {
        var cssLinkEle = document.createElement("link");
        $(cssLinkEle).attr({
            "href": foldername + "/" + filename + ".css",
            "rel": "stylesheet",
            "type": "text/css",
            "ref-id": filename
        });
        $("head").append(cssLinkEle);
    }
}
/******************************** Script to attach a css file - END **************************************/
/******************************** Script to disable a element - START ************************************/
function disableElement(event) {
    if (event && event.target) {
        $(event.target).prop('disabled', true);
    }
}
/******************************** Script to disable a element - END **************************************/
/******************************** Utility Scripts for Actions - End **********************************/
/**************************************************** Poly Fills - Start ****************************************************/
/******* Polyfill to support String.includes method  - Start *********************/
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
/******* Polyfill to support String.includes method  - END *********************/
/*********************** Pega.CS.Textchannel--NamespacedFunctions - START *******************/
pega.namespace("pega.cs.textchannel");
pega.cs.textchannel = (function() {
    /*start of US-259627 Always display the anchor text for the article not the URL */
    function pushArticleLink(url, title, abstract, leadintext, setleadintext, setshareabstract, event, articleID) {
        var LeadIntText = (setleadintext === 'true') ? leadintext : "";
        var Abstract = (setshareabstract === 'true') ? abstract : "";
        var finalurl = "<a class=\"articlelink\" data-articleid=\"" + articleID + "\"href=" + url + " target = '_blank'>" + title + "</a>";
        var KMArticleLink = (Abstract !== "") ? (LeadIntText + "<br>" + Abstract + "<br>" + finalurl) : (
            LeadIntText + "<br>" + finalurl);
        pega.cs.textchannel.pushTextToRTEContent(KMArticleLink, event);
    }
    /*end of US-259627 Always display the anchor text for the article not the URL */
    function pushArticleText(event) {
        var KMArticleContainer = $('.KMContent').clone();
        KMArticleContainer.find("img").remove();
        KMArticleContainer.find(".internal").remove();
        var KMArticleContent = KMArticleContainer[0].innerHTML;
        KMArticleContent = KMArticleContent.replace(/\<\/p\>/gi, "\n");
        KMArticleContent = KMArticleContent.replace(/\<br\>/gi, "\n");
        pega.cs.textchannel.pushTextToRTEContent(KMArticleContent, event);
    }
    /*For new KM react UI, as the div used is different */
 var contextData = {
    leadInText: "",
    setLeadInText: "",
    setShareAbstract: "",
    event: null
};
 function pushArticleTextKMReact(event,articleContainerDiv) {
       var KMArticleContainer = $("."+articleContainerDiv).clone();
        KMArticleContainer.find(".internal").remove();
        var KMArticleContent = KMArticleContainer[0].innerHTML;
        KMArticleContent = KMArticleContent.replace(/\<\/p\>/gi, "\n");
        KMArticleContent = KMArticleContent.replace(/\<br\>/gi, "\n");
        pega.cs.textchannel.pushTextToRTEContent(KMArticleContent, event);
    }

function setContextData(response) {
    response.ArticleAbstract = response.ArticleAbstract.replace(/(?:\\[rn])+/g, "");
    var sectionData = {
        section: "",
        event: event,
        dataTransform: {
            name: "",
            parameters: []
        },
        activity: null,
        submitOnRefresh: true
    }
    pega.cs.textchannel.pushArticleLink(response.ShareableURL, response.ArticleTitle, response.ArticleAbstract, contextData.leadInText, contextData.setLeadInText,
        contextData.setShareAbstract, contextData.event, response.pxInsName);
    if (response.IsInteractionSocial == "true") {
        sectionData.section = "SocialResponseTextArea";
        sectionData.dataTransform.name = "CopyArticleLinkIntoSocialArea";
        sectionData.dataTransform.parameters = [{ name: "LinkURL", value: url }, { name: "abstract", value: abstract }];
        pega.api.ui.actions.refreshSection(sectionData);
    }
    sectionData.section = "LoadSocialUIContext";
    sectionData.dataTransform = null;
    pega.api.ui.actions.refreshSection(sectionData);
    sectionData.section = "SocialResponseTextArea"
    sectionData.submitOnRefresh = false;
    pega.api.ui.actions.refreshSection(sectionData);
}

function handleArtilclePushKMReact(event, leadInText, contextPage, setLeadInText, setShareAbstract,pushContentLabel,pushLinkLabel,channelType) {
  if(channelType !== "chat"){
    contextData.leadInText = leadInText;
    contextData.setLeadInText = setLeadInText;
    contextData.setShareAbstract = setShareAbstract;
    contextData.event = event;
    if (event.srcElement.innerText !== null && event.srcElement.innerText !== undefined && event.srcElement.innerText.toLowerCase() === pushLinkLabel.toLowerCase()) {
        var dataPageOptions = {
            name: contextPage,
            parameters: [],
            callback: setContextData,
            event: event
        }
        pega.api.ui.actions.getDataPage(dataPageOptions);
    }
    if (event.srcElement.innerText !== null && event.srcElement.innerText !== undefined 
        && event.srcElement.innerText.toLowerCase() === pushContentLabel.toLowerCase()) {
        pega.cs.textchannel.pushArticleTextKMReact(event, "article-content-container")
    }
  }
}
    
/**************************************************end of KM react scripts*************************************************************/  
 function pushTextToRTEContent(TextValue, event) {
        var textAreaElem = pega.cs.textchannel.getCKEditorTextArea(event);
        if (textAreaElem) {
          $(textAreaElem).trigger("insertTextOn", [TextValue]);
          /*BUG-575826 -  .trigger is not working when RTE visibility is hidden. Text value is appended to iframe body instead of textArea
          $(textAreaElem).parent().find('iframe').contents().find('body').append(TextValue);*/
        }
    }
  
  
    function getCKEditorInstance(event) {
        var textAreaId = $(event.currentTarget.getElementsByClassName("cpm-textchannel-rte-component")).find(
            "textarea").attr("id");
        if (!textAreaId) {
          /* for chat, the class name comes from application settings, but it might not be defined,
             so look for it a different way */
          textAreaId = $(event.currentTarget.getElementsByClassName("PEGACKEDITOR textAreaStyle"))[0].id;
        }
        if (textAreaId) return CKEDITOR.instances[textAreaId];
    }

    function getCKEditorTextArea(event) {
        var ckeditorInstance = pega.cs.textchannel.getCKEditorInstance(event);
        if (ckeditorInstance) return ckeditorInstance.element.$;
    }

    function getDOMContext(e) {
        return e.currentTarget;
    }
    return {
        pushArticleLink: pushArticleLink,
        pushArticleText: pushArticleText,
        pushArticleTextKMReact:pushArticleTextKMReact,
        pushTextToRTEContent: pushTextToRTEContent,
        getCKEditorInstance: getCKEditorInstance,
        getCKEditorTextArea: getCKEditorTextArea,
        handleArtilclePushKMReact:handleArtilclePushKMReact,
        getDOMContext: getDOMContext
    }
})();
/*********************** Pega.CS.Textchannel--NamespacedFunctions - END *******************/
/************************************************ Poly Fills - End *********************************************************/
//static-content-hash-trigger-YUI
/* pega.cs.managertools - named space functions start*/
pega.namespace("pega.cs.managertools");
pega.cs.managertools = (function() {
    var chatQueueMonitorRefreshIntervalId, chatCsrMonitorRefreshIntervalId;
    /* below functions are used to start and stop auto refresh in queue monitor section  */
    function manageAutoRefreshForQueueMonitor() {
        chatQueueMonitorRefreshIntervalId && clearInterval(chatQueueMonitorRefreshIntervalId);
        chatCsrMonitorRefreshIntervalId && clearInterval(chatCsrMonitorRefreshIntervalId);
        var options = {
            section: "MonitoringQueues",
            event: window.event,
            activity: {
                name: "FlushMonitorDataPage"
            }
        };
        chatQueueMonitorRefreshIntervalId = setInterval(function() {
            var isElementVisible = document.getElementsByClassName("monitoringQueuesObserverClass").length ==
                0 ? false : true;
            if (isElementVisible) {
                pega.api.ui.actions.refreshSection(options);
            } else { 
                chatQueueMonitorRefreshIntervalId && clearInterval(chatQueueMonitorRefreshIntervalId);
                chatQueueMonitorRefreshIntervalId = null;
            }
        }, 30000);
    }

    function manageAutoRefreshForCsrMonitor() {
        chatQueueMonitorRefreshIntervalId && clearInterval(chatQueueMonitorRefreshIntervalId);
        chatCsrMonitorRefreshIntervalId && clearInterval(chatCsrMonitorRefreshIntervalId);
        var options = {
            section: "MonitoringCsrs",
            event: window.event,
            activity: {
                name: "FlushMonitorCSRDataPage"
            }
        };
        chatCsrMonitorRefreshIntervalId = setInterval(function() {
            var isElementVisible = document.getElementsByClassName("monitoringCsrsObserverClass").length ==
                0 ? false : true;
            if (isElementVisible) {
                pega.api.ui.actions.refreshSection(options);
            } else {
                chatCsrMonitorRefreshIntervalId && clearInterval(chatCsrMonitorRefreshIntervalId);
                chatCsrMonitorRefreshIntervalId = null;
            }
        }, 90000);
    }
    return {
        manageAutoRefreshForQueueMonitor: manageAutoRefreshForQueueMonitor,
        manageAutoRefreshForCsrMonitor: manageAutoRefreshForCsrMonitor
    }
})();
/* pega.cs.managertools - named space functions end */
//static-content-hash-trigger-YUI


/* pega.cs.commonutils - named space functions start*/
pega.namespace("pega.cs.commonutils");
pega.cs.commonutils = (function() {
    
  function _setCookie(cookieName, cookieValue, nDays) {		
		var today = new Date();		
		var expire = new Date();		
		if(nDays === null || nDays === 0)		
			nDays=1;		
		expire.setTime(today.getTime() + 3600000*24*nDays);		
		document.cookie = cookieName+"="+escape(cookieValue) + 		
			";expires="+expire.toGMTString();		
	}
	function _downloadTranscript(objClass) {
    if (typeof(objClass) == "undefined") {
      objClass = "PegaCA-Work-Interaction";
    }
    var sourceurl = new SafeURL(objClass+".DownloadCsrTranscript");
    //sourceurl.put("pzPrimaryPageName","pyWorkPage");   	
	  pega.u.d.asyncRequest("POST", SafeURL_createFromURL(sourceurl.toURL()), {
		success: function(o) {
      console.log("success");
       // parent.postMessage(JSON.stringify({command: "downloadBotTranscript", transcript:o.responseText}),sourceurl);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(o.responseText));
        element.setAttribute('download', "Transcript.txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
		},
	  failure: function(o) {
		  console.log("Failed get chatbot transcript");
	  },
	  scope:this
	});
    }	
	function _readCookie(cookieName) {		
		var theCookie= "" + document.cookie;		
		var ind = theCookie.indexOf(cookieName);		
		if (ind === -1 || cookieName === "") 		
			return ""; 		
		var ind1 = theCookie.indexOf(';', ind);		
		if (ind1 === -1) 		
			ind1 = theCookie.length; 		
		return unescape(theCookie.substring(ind + cookieName.length+1, ind1));		
	}
  
  function _removeCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
    return {
        setCookie: _setCookie,
        readCookie: _readCookie,
        removeCookie: _removeCookie,
        downloadTranscript:_downloadTranscript
    }
})();
/* pega.cs.managertools - named space functions end */

/********************* pega.cs.interactionguidance namespaced functions *******************/
pega.namespace("pega.cs.interactionguidance");
pega.cs.interactionguidance = (function() {
  function hideGuidance() {
    if ($("#interactionguidance").length > 0) {
      $("#interactionguidance").removeClass("alerting");
      window.setTimeout(function(){ 
        $("#interactionguidance").hide();
      },600);
    }
  }

  function showGuidance() {     
    var id = pega.ctx.strPyID;       
    var guidanceDiv = document.getElementById("interactionguidance");
    /* BUG-636869 :Perf CS 86: Memory leak observed during soak test - added check for service case context 
    to avoid loading interaction page with service case id */
    var recordid=pega.ctx.recordId;
    if (id === "" || guidanceDiv == null || (typeof recordid !== 'undefined' && recordid.includes("acprimary"))){  
      /* Not in a valid interaction or the interactionguidance placeholder is not present (dialogs disabled), 
         don't show the interaction guidance */
      return;
    }

    var oSafeURL = new SafeURL("PegaCA-Work-Interaction.GetInteractionGuidanceMessage");
    oSafeURL.put("interactionId", id);
    pega.u.d.asyncRequest("POST", oSafeURL, {
      success: function(oResponse) {
        if (oResponse.responseText != "NoInteractionGuidance") { 
          var guidance = $("#interactionguidance");
          $("#interactionguidance").show();
          guidance.addClass("alerting").html(oResponse.responseText);      
        }
      },
      failure: function() {
        /*console.log("Failure while getting interaction guidance");*/
      }
    }, null);
  }

  return {
    showGuidance: showGuidance,
    hideGuidance: hideGuidance
  }
})();

/****************** pega.cs.interactionguidance namespaced functions - End ****************/

/* Invoke the populate harness page to ensure it's ready for phrase search*/
$( document ).ready(function() {
  var interactionTypeEl = document.querySelector("[name$=InteractionType]");
  if (interactionTypeEl) {
    var recentUrl = new SafeURL("PegaCA-Work-Interaction.PopulateHarnessPage");
    recentUrl.put("channelType", interactionTypeEl.value);
    var transaction1 = pega.u.d.asyncRequest('POST', recentUrl, {
      success: function(oResponse) {
        /*
        console.log("set the harness page");
        */
      },
      failure: function() {},
        scope: this
      }, "");
  } else {
    /*
    console.log("No identifiable interaction");
    */
  }
  /* Trigger the showing of Interaction guidance after one second and remove it after 15 addl */
  /* This value is not configurable at the time, but can be made so in the future */
  window.setTimeout(pega.cs.interactionguidance.showGuidance,1000);
  window.setTimeout(pega.cs.interactionguidance.hideGuidance, 16000);
});
//static-content-hash-trigger-GCC
if (typeof(cti) == "undefined") {
    cti = {};
}
if (typeof(cti.util) == "undefined") {
    cti.util = {};
}
cti.util.bind = function(fn, obj) {
    return function() {
        fn.call(obj, [].slice.call(arguments, 2));
    }
}
cti.util.Timer = function(lStartTime, sTimerContainerDivName, bStartTimer, refreshRate, oThresholds, oActionHandler) {
    // Setting the active time to display only for active timer
    cti.ActiveTimer = this;
    this._lStartTime = lStartTime;
    if ((this._lStartTime == -1) || (isNaN(this._lStartTime))) {
        this._lStartTime = new Date().getTime();
    }
    this._lEndTime = -1;
    this._sTimerContainerDivName = sTimerContainerDivName;
    this._oTimerContainerDiv = pega.util.Dom.get(sTimerContainerDivName);
    this._oThresholds = oThresholds;
    if (typeof oActionHandler != "undefined") this._oActionHandler = oActionHandler;
    else this._oActionHandler = new DefaultTimerActionHandler();
    this._oActionHandler.setTimerContainerDiv(this._oTimerContainerDiv);
    this._oActionHandler.setThresholds(this._oThresholds);
    this._oActionHandler.setId(sTimerContainerDivName);
    this._oActionHandler.setRefreshRate(refreshRate);
    this._timer = null;
    if (bStartTimer) this._timer = setInterval(cti.util.bind(this.handleTimer, this), refreshRate);
}
cti.util.Timer.prototype.init = function() {
    if (typeof(this._timer) == "undefined") this._timer = setInterval(cti.util.bind(this.handleTimer, this),
        refreshRate);
    else {
        this._timer = setInterval(cti.util.bind(this.handleTimer, this), refreshRate);
    }
}
cti.util.Timer.prototype.setEndTime = function(lEndTime) {
    this._lEndTime = lEndTime;
}
cti.util.Timer.prototype.cancelTimer = function() {
    clearInterval(this._timer);
}
cti.util.Timer.getTimeComponents = function(lMilliseconds) {
    var seconds = Math.floor(lMilliseconds / 1000);
    var d = Math.floor(seconds / 86400);
    var h = Math.floor((seconds - (d * 86400)) / (3600));
    var m = Math.floor((seconds - (d * 86400) - (h * 3600)) / 60);
    var s = seconds - (d * 86400) - (h * 3600) - (m * 60);
    var oTime = new Object();
    oTime.days = d;
    oTime.hours = h;
    oTime.minutes = m;
    oTime.seconds = s;
    oTime.totalTime = seconds;
    return (oTime);
}
cti.util.pad0 = function(lSeconds) {
    if (isNaN(lSeconds)) {
        lSeconds = 0;
    }
    return (lSeconds < 10 ? (lSeconds <= 0 ? "00" : "0" + lSeconds) : "" + lSeconds);
}
cti.util.Timer.prototype.handleTimer = function() {
  /** BUG-344824 - START **/
  if(window.parent != null && window.frameElement && window.frameElement.parentElement && window.frameElement.parentElement.style && window.frameElement.parentElement.style.display === 'none'){
    return;
  }
  /** BUG-344824 - END **/
  var oTimeComponents = null;
  var lCurrTime = this._lEndTime;
  if (lCurrTime == -1) lCurrTime = new Date().getTime();
  if (typeof serverClientTimeDifference != "undefined" && serverClientTimeDifference) oTimeComponents = cti.util.Timer
    .getTimeComponents(lCurrTime - this._lStartTime + (serverClientTimeDifference));
  else oTimeComponents = cti.util.Timer.getTimeComponents(lCurrTime - this._lStartTime);
  this._oActionHandler.handleTimer(oTimeComponents);
  if (this._lEndTime != -1) this.cancelTimer();
}
    /*
      Assumes Timer format as so:
      oTimerContainerDiv:<div> 
                            <elem id=timerIcon/>
                            <elem id=elapseTime/>
                            <elem id=goalTime/>
                          <div>
    */
DefaultTimerActionHandler = function() {
    this._oTimerContainerDiv = null;
    this._sTimerId;
    this._sIconElem = "timerIcon";
    this._sElapsed = "elapsedTime";
    this._sGoalTime = "goalTime";
    this._iconClassGoal = 'iconCTITimerGoal';
    this._iconClassDeadline = 'iconCTITimerDeadline';
    this._iconClassLate = 'iconCTITimerLate';
    this._elapsedClassGoal = 'elapsedCTITimerGoal';
    this._elapsedClassDeadline = 'elapsedCTITimerDeadline';
    this._elapsedClassLate = 'elapsedCTITimerLate';
    this._goalClass = "timerGoal";
}
DefaultTimerActionHandler.prototype.setTimerContainerDiv = function(oTimerContainerDiv) {
    this._oTimerContainerDiv = oTimerContainerDiv;
}
DefaultTimerActionHandler.prototype.setThresholds = function(oThresholds) {
    this._oThresholds = oThresholds;
}
DefaultTimerActionHandler.prototype.setId = function(sId) {
    this._sTimerId = sId;
}
DefaultTimerActionHandler.prototype.setRefreshRate = function(refreshRate) {
        this._refreshRate = refreshRate;
    }
    /*
      oTimeComponents: {days: d, hours: h,minutes:m,seconds:s, totalSeconds:seconds};
    */
DefaultTimerActionHandler.prototype.handleTimer = function(oTimeComponents) {
    if (cti && cti.ActiveTimer && cti.ActiveTimer._oActionHandler == this) {
        if (oTimeComponents.totalTime <= this._oThresholds.goal) {
            this.setGoalDisplay(oTimeComponents);
            this.setAngleTimeCircle(oTimeComponents.totalTime, this._oThresholds.goal);
        } else if (oTimeComponents.totalTime < this._oThresholds.deadline) {
            this.setDeadlineDisplay(oTimeComponents);
            this.setAngleTimeCircle(oTimeComponents.totalTime - this._oThresholds.goal, this._oThresholds.deadline -
                this._oThresholds.goal);
        } else {
            this.setLateDisplay(oTimeComponents);
            this.setAngleTimeCircle(oTimeComponents.totalTime, this._oThresholds.deadline);
        }
    }
}
DefaultTimerActionHandler.prototype.setGoalDisplay = function(oTimeComponents) {
    var sId = this._oTimerContainerDiv.id;
    var oDiv = document.getElementById(this._sTimerId);
    if (oDiv != null) {
        var oTimerIcon = pega.util.Dom.getElementsById(this._sIconElem, oDiv)[0];
        var oElapsedContainer = pega.util.Dom.getElementsById(this._sElapsed, oDiv)[0];
        var oGoalContainer = pega.util.Dom.getElementsById(this._sGoalTime, oDiv)[0];
        oTimerIcon.className = this._iconClassGoal;
        if (oTimeComponents.days != 0) {
            var sTime = oTimeComponents.days+"d " + cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else if (oTimeComponents.hours != 0) {
            var sTime = cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else {
            var sTime = cti.util.pad0(oTimeComponents.minutes) + ":" + cti.util.pad0(oTimeComponents.seconds);
        }
        pega.util.Dom.setInnerText(oElapsedContainer, sTime);
        oElapsedContainer.className = this._elapsedClassGoal;
        oElapsedContainer.style.display = "inline-block";
    }
  $(".cs_timer_control").removeClass("cs_timer_on_goal cs_timer_on_deadline cs_timer_deadline_exceed").addClass("cs_timer_on_goal");
//Adding change to not show tooltip when sla timer is hidden for BUG-559150
  if(typeof document.getElementById("showTimer") !== "undefined" && document.getElementById("showTimer") !== null){
      var title =   document.getElementById("showTimer").value;
      if(title.includes("showTimer"))
         $(".cs_timer_control").attr('title',$(oElapsedContainer).text()+"/"+$(oGoalContainer).text());
  }
      var csTimerTotal = document.getElementById('cs-timer-total');
      if(csTimerTotal != null) {
        csTimerTotal.setAttribute("stroke", "#6DDDC2");
     
  }
}
DefaultTimerActionHandler.prototype.setDeadlineDisplay = function(oTimeComponents) {
    var sId = this._oTimerContainerDiv.id;
    var oDiv = document.getElementById(this._sTimerId);
    if (oDiv != null) {
        var oTimerIcon = pega.util.Dom.getElementsById(this._sIconElem, oDiv)[0];
        var oElapsedContainer = pega.util.Dom.getElementsById(this._sElapsed, oDiv)[0];
        var oGoalContainer = pega.util.Dom.getElementsById(this._sGoalTime, oDiv)[0];
        oTimerIcon.className = this._iconClassDeadline;
        if (oTimeComponents.days != 0) {
            var sTime = oTimeComponents.days+"d " + cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else if (oTimeComponents.hours != 0) {
            var sTime = cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else {
            var sTime = cti.util.pad0(oTimeComponents.minutes) + ":" + cti.util.pad0(oTimeComponents.seconds);
        }
        pega.util.Dom.setInnerText(oElapsedContainer, sTime);
        oElapsedContainer.className = this._elapsedClassDeadline;
        oElapsedContainer.style.display = "inline-block";
    }
    $(".cs_timer_control").removeClass("cs_timer_on_goal cs_timer_on_deadline cs_timer_deadline_exceed").addClass("cs_timer_on_deadline");
  //Adding change to not show tooltip when sla timer is hidden for BUG-559150
  if(typeof document.getElementById("showTimer") !== "undefined" && document.getElementById("showTimer") !== null){
      var title =   document.getElementById("showTimer").value;
      if(title.includes("showTimer"))
         $(".cs_timer_control").attr('title',$(oElapsedContainer).text()+"/"+$(oGoalContainer).text());
  }
      var csTimerTotal = document.getElementById('cs-timer-total');
      if(csTimerTotal != null) {
        csTimerTotal.setAttribute("stroke", "#F4BF7E");
      
    }
}
DefaultTimerActionHandler.prototype.setAngleTimeCircle = function(currentTime, totalTime) {
    var circle = document.getElementById('cs-timer-circle');
    if (circle !== null) {
        var radius = circle.getAttribute('r');
        var circum = Math.PI * (radius * 2);
        var angle_increment = 100 / (totalTime / (this._refreshRate / 1000));
        var angle = 100 - currentTime * angle_increment;
        circle.setAttribute("stroke-dasharray", ((100 - angle) / 100) * circum + ", 20000");
    }
}
DefaultTimerActionHandler.prototype.setLateDisplay = function(oTimeComponents) {
    var sId = this._oTimerContainerDiv.id;
    var oDiv = document.getElementById(this._sTimerId);
    if (oDiv != null) {
        var oTimerIcon = pega.util.Dom.getElementsById(this._sIconElem, oDiv)[0];
        var oElapsedContainer = pega.util.Dom.getElementsById(this._sElapsed, oDiv)[0];
        var oGoalContainer = pega.util.Dom.getElementsById(this._sGoalTime, oDiv)[0];
        oTimerIcon.className = this._iconClassLate;
        if (oTimeComponents.days != 0) {
            var sTime = oTimeComponents.days+"d " + cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else if (oTimeComponents.hours != 0) {
            var sTime = cti.util.pad0(oTimeComponents.hours) + ":" + cti.util.pad0(oTimeComponents.minutes) + ":" +
                cti.util.pad0(oTimeComponents.seconds);
        } else {
            var sTime = cti.util.pad0(oTimeComponents.minutes) + ":" + cti.util.pad0(oTimeComponents.seconds);
        }
        pega.util.Dom.setInnerText(oElapsedContainer, sTime);
        oElapsedContainer.className = this._elapsedClassLate;
        oElapsedContainer.style.display = "inline-block";
    }
    $(".cs_timer_control").removeClass("cs_timer_on_goal cs_timer_on_deadline cs_timer_deadline_exceed").addClass("cs_timer_deadline_exceed");
  //Adding change to not show tooltip when sla timer is hidden for BUG-559150
  if(typeof document.getElementById("showTimer") !== "undefined" && document.getElementById("showTimer") !== null){
     var title =   document.getElementById("showTimer").value;
     if(title.includes("showTimer"))
//Making change to show proper tooltip value past reaching the deadline of the CTI call timer for Bug-755361
        $(".cs_timer_control").attr('title',$(oElapsedContainer).text()+"/"+$(oGoalContainer).text());
  }
    var csTimerTotal = document.getElementById('cs-timer-total');
    if(csTimerTotal!= null){
      csTimerTotal.setAttribute("stroke", "#EF85B3");
    
    }
}
//static-content-hash-trigger-YUI
var socialwindow;
var loadwindow;

function resetLoadScriptFlag(){
  loadwindow="openwindow";
 }

function OpenNewWindow() {

    if (socialwindow == null) {

        socialwindow = window.open(URL, "social", "toolbar=yes,scrollbars=yes,resizable=yes,top=250,left=1150,width=1000,height=500");

    } else {


        if (socialwindow.closed) {
            socialwindow = window.open(URL, "social", "toolbar=yes,scrollbars=yes,resizable=yes,top=250,left=1150,width=1000,height=500");
        } else {
            socialwindow.location.href = URL;
        }

    }
}
function forwardSocialEvent(event) {
 /* 
console.log("Response from "+ event.detail.response.AuthorID);
console.log(event.detail.response.pyText); */
  
  var payload= event.detail.response.pyText;
  /* Show the slide-in message */
  	toastr.slideIn(payload, {timeOut: 5000, extendedTimeOut: 1000 });   
    /* Extract the case id */
  	var caseIDIndex = payload.indexOf("#CASEID#");
    var subString1 = payload.substr(caseIDIndex);
 	var caseid = subString1.replace(/(.*#@)(.*)(@#.*)/, '$2');
	
    /* for debugging
  	console.log("caseIDIndex :: "+ caseIDIndex);
    console.log("subString1 ::  "+ subString1);
    console.log("caseid ::  "+ caseid);
    */
   
    
    var oSafeURL = new SafeURL("PegaCA-Work-Interaction-Social.CSSocialRefreshSocialMessages");
    oSafeURL.put("CaseID",caseid);
    pega.u.d.asyncRequest("POST", oSafeURL); 
}

/*enable reply button for private twitter messages*/
function enableTweetReply() {  
  //var selectedButton = $("input[class='Radio rb_']:checked");
  var selectedButton = $("input[type=radio][class='Radio rb_ ']:checked").attr('value');  
  var replyButton = $(".twitter-submit-tweet-button button");  
  if(selectedButton == "Private")
   	 replyButton.removeAttr("disabled");
  
}
//static-content-hash-trigger-YUI
pega.namespace("pega.cs");
pega.namespace("pega.cs.notificationmanager");
pega.cs.notificationmanager = (function(){
  
  var audioNotificationSound = null;
  var audioNotificationSoundRepeatCount = null;
  var allowAudioNotifications = null;
  
  function _setAudioConfig(file,count,allow){
    audioNotificationSound = new Audio(file);
    audioNotificationSoundRepeatCount = count;
    allowAudioNotifications = allow;
  }
  
  function _isCurrentDCTabInFocus(){
    var desktopWin = pega.desktop.support.getDesktopWindow();
    var tabViewMap = desktopWin.pega.u.d.tabViewMap;
    for (var tabViewName in tabViewMap) {
      var tabViewObj = tabViewMap[tabViewName];
      //if it is a DC tabview
      if (tabViewObj.isDCTabView) {
        //if the activetab thread is same as current tab threadname (stripping off, if necessary, extra like /microdc_1)
        if (tabViewObj.get("activeTab").ThreadName === pega.u.d.getThreadName().split('/')[0]) {
          return true;   
        } else {
          return false;
        }
      }else{
        return false;
      }
    }
  }
  
  function _isKmInFocus(){
    return $("body").hasClass("km-expanded");
  }
  
  function _isTextChannelInFocus(){
    return !_isKmInFocus();
  }
  
  function tabSwitchHandler(){
    console.log("Switched to Tab " + pega.u.d.getThreadName().split('/')[0]);
    var oSafeURL = new SafeURL("Work-.ResetNotificationMessageCounter");
    oSafeURL.put("IsTabInFocus", pega.cs.notificationmanager.isCurrentDCTabInFocus());
    oSafeURL.put("IsChannelInFocus", pega.cs.notificationmanager.isTextChannelInFocus());
    oSafeURL.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
    pega.util.Connect.initHeader('Content-Type', "application/x-www-form-urlencoded");
    var transaction = pega.u.d.asyncRequest('POST', oSafeURL, {
      success: function(respObject) {
        var currentCT = pega.ui.ChangeTrackerMap.getTracker();
        currentCT.parseForChangeTrackerDiv(respObject.responseText, false);
        if(currentCT.changedPropertiesList.length > 0) {
          pega.u.d.evaluateClientConditions('TCL');
        }
        scrollRightPaneToBottom("Chat");
      },
      failure: function() {},
      scope: this
    }, null);
  }
  
  function _incrementMessage(){
    console.log("New message increment counter");
    var oSafeURL = new SafeURL("Work-.IncrementNotificationMessageCounter");
    var IsTabInFocus = pega.cs.notificationmanager.isCurrentDCTabInFocus();
    var IsChannelInFocus = pega.cs.notificationmanager.isTextChannelInFocus();
    oSafeURL.put("IsTabInFocus", IsTabInFocus);
    oSafeURL.put("IsChannelInFocus", IsChannelInFocus);
    if(!IsTabInFocus || !IsChannelInFocus){
      _initiateNotificationSoundRequest();
    }
    oSafeURL.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
    pega.util.Connect.initHeader('Content-Type', "application/x-www-form-urlencoded");
    var transaction = pega.u.d.asyncRequest('POST', oSafeURL, {
      success: function(respObject) {
        var currentCT = pega.ui.ChangeTrackerMap.getTracker();
        currentCT.parseForChangeTrackerDiv(respObject.responseText, false);
        if(currentCT.changedPropertiesList.length > 0) {
          pega.u.d.evaluateClientConditions('TCL');
        }
      },
      failure: function() {},
      scope: this
    }, null);
  }
  
  pega.u.d.attachOnload(function() {
    pega.ui.EventsEmitter.subscribe("onTabSwitch", tabSwitchHandler, null, null, null, true);
  });
  
  function _isInteractionLoadedInDC(interactionId){
    var interactionWindowFound = false;
    window.top.$(".dc-main .iframe-wrapper>iframe").each(function(i,iframe){
      //BUG-588722 - Get the current harness context
      var currentCTX = iframe.contentWindow.window.pega.ctx;    
      //Set the context to root document to get the interaction ID
      iframe.contentWindow.window.pega.ctxmgr.setRootDocumentContext();      
      if(iframe.contentWindow.window.pega.u.d.getID() === interactionId){
        interactionWindowFound = true;
      }
      //Reset the current harness context
      iframe.contentWindow.window.pega.ctxmgr.setContext(currentCTX);      
    });
    return interactionWindowFound;
  }
  
  function _playNotificationSound(){
    if(allowAudioNotifications && !isNaN(audioNotificationSound.duration)){
      var notificationDuration = audioNotificationSound.duration * audioNotificationSoundRepeatCount * 1000;
      audioNotificationSound.pause();
      audioNotificationSound.loop = true; 
      audioNotificationSound.currentTime = 0;
      setTimeout(function(){
        audioNotificationSound.pause();
      },notificationDuration);
      audioNotificationSound.play();
    }
  }
  function _pushCSRNotification(event){
    var payloadObj= event.detail.response;
    var oSafeURL = new SafeURL("Application-Notifications.PushCSRNotificationDetails");
    oSafeURL.put("Message", payloadObj.pyMessage);
    pega.u.d.asyncRequest('POST', oSafeURL, {
      success: function(respObject) {
        var rdlNode = $('.csr-notification').removeClass("rdlHasNoRows");
        if(rdlNode.length > 0){
          pega.u.RDL.fetchAndAppend(null, {"fetchLastRow" : true, rdlNode: rdlNode.get(0)}); 
        }
      },
      failure: function() {},
      scope: this
    }, null);
  }
 
  function _initiateNotificationSoundRequest(){
    if(window.top === window.self){
      _playNotificationSound();
    }else{
      window.top.postMessage("NotifictionSound","*");
    }
  }
  
  window.addEventListener("message",function(event){
    if(event.data === "NotifictionSound"){
      _playNotificationSound(); 
    }
  });
  
  return {
    setAudioConfig: _setAudioConfig,
    isCurrentDCTabInFocus : _isCurrentDCTabInFocus,
    isKmInFocus : _isKmInFocus,
    isTextChannelInFocus : _isTextChannelInFocus,
    resetNotificationCounter : tabSwitchHandler,
    incrementMessage : _incrementMessage,
    isInteractionLoadedInDC: _isInteractionLoadedInDC,
    playNotificationSound: _initiateNotificationSoundRequest,
    pushCSRNotification: _pushCSRNotification
  }
})();
//static-content-hash-trigger-GCC
pega.namespace("pega.ui.commandpalette");

pega.ui.commandpalette = (function() {
    var publicAPI = {};
 
    /////////////////////////////////////////////////////////////////////////////////
    //                              CONSTANTS                                      //
    /////////////////////////////////////////////////////////////////////////////////
    var SEPARATOR = " > ";
    var STATES = {
        READY: "ready", // Have data from server
        INACTIVE: "inactive", // Before it has data from server
        ACTIVE: "active" // Is showing
    };
    var VISIBLE = false;

    /////////////////////////////////////////////////////////////////////////////////
    //                              GLOBALS                                        //
    /////////////////////////////////////////////////////////////////////////////////
    /* -- PRIVATE GLOBALS -- */
    var _state = STATES.INACTIVE;
    var _canTurnOn = true;

    var _listOfActionsFromServer; // JSON list of action from the server
    var _srchTerms; // Text that is entered in input as an array
    var _commandPaletteInput; // The autocomplete input
    var _commandPaletteInputValue; // The autocomplete input value
    var _isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    var _isFirefox = $('html').hasClass('ff');
  
    /* -- PUBLIC GLOBALS -- */

    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @private this function is called to get a regular expression object. This is 
     * needed to make sure that the string is a valid regular expression
     * @param  $String$ searchText - String of regEx to use for search
     * @return $RegExp$ The regular expression object or null
     */
    function _getRegExp(searchText) {
        var regExObj = null;
        try {
            regExObj = new RegExp(searchText, 'i');
        } catch(e) {
            // The regular expression is invalid so return null
        }
        return regExObj;
    }

    /**
     * @private called to match text in a string of HTML and replace the match with
     * a highlight span. Also updates the index of where it is found and the string
     * that was passed in
     * @param  $String$ searchText - String of regEx to use for search
     * @param  $String$ stringToSearch - The The string of HTML to look through
     * @param  $Integer$ indexToStart - Where to start looking
     * @return $Object$ A object that returns the new index and new string or null
     */
    function _highlightMatchedText(searchText, stringToSearch, indexToStart) {
        // Make regEx object and search portion of the string that is specified by index
        var newReg = _getRegExp(searchText);
        if (newReg !== null) {
            var matches = stringToSearch.substring(indexToStart, stringToSearch.length).match(newReg);

            // If a match was found then modify the string
            if (matches && matches.length > 0) {
                // Split the string into two parts, before the starting index and after
                // This is so that the replace is only done on the second half
                var beforeMatchString = stringToSearch.substring(0, indexToStart);
                var afterMatchString = stringToSearch.substring(indexToStart, stringToSearch.length);

                // Generate the replacement string and then reconstruct the string by:
                // 1. Replace match only in second half of string
                // 2. Add first half back to the begining
                var replacement = "<span class='palette-match-highlight' data-click='..'>" + matches[0] + "</span>";
                stringToSearch = beforeMatchString + afterMatchString.replace(newReg, replacement);

                // Increment the index and return the new index and string
                indexToStart += matches.index + replacement.length;
                return { index: indexToStart, newString: stringToSearch };
            }
        }

        // If no match was found then return false
        return null;
    }

    /**
     * @private clean up function is called when turned off to destroy all elements to
     * clean up the dom
     */
    function _cleanUp() {
        // BUG-322474: Make sure our command palette is defined before destroying
        if($('#command-palette-input').data('ui-autocomplete') !== undefined) {
            _state = STATES.READY;
            $('#command-palette-input').autocomplete("destroy");

            setTimeout(function() {
                $(".command-palette").remove();
                _commandPaletteInput = null;
                _commandPaletteInputValue = null;
            }, 500);

            $('.command-palette').removeClass('command-palette-visible');

            // remove the resize listener to close out
            window.removeEventListener("resize", _cleanUp);  
        } 	
    }

    /**
     * @private Event handler for keyDown events. Used for hot keys, checks if they are both down at the same time
     *
     * @param $Event$ e - The event object for the event
     */
    function _handleKeyDown(e) {
        var preventDefault = false;

        // Determine browser to set the appropriate keypress (cmd for Mac, ctrl for Windows)
        var ctrlCmdKey;
        if (_isMac) {
            ctrlCmdKey = e.metaKey;
        } else {
            ctrlCmdKey = e.ctrlKey;
        }

        //p Key with ctrl / cmd and shift was hit
        //in firefox the ctrl shift p is already bound to private browsing.  For firefox the alt key is also required.
        if (_canTurnOn && e.keyCode === 80 && ctrlCmdKey && e.shiftKey && (!_isFirefox || e.altKey)) {
            preventDefault = true;
            _canTurnOn = false;
            //toggle the command palette
            pega.ui.commandpalette.toggle();
        } else if (e.keyCode === 27) { //escape key closes command palette
            preventDefault = true;

            if (publicAPI.isActive()) {
                pega.ui.commandpalette.toggle();
            }
        }

        //prevent any dialogs that share the hotkey from showing (ie print dialog)
        if (preventDefault) {
            e.preventDefault();
            return false;
        }
    }

    /**
     * @private Event handler for keyUp events. Used for hot keys, checks if 
     *
     * @param $Event$ e - The event object for the event
     */
    function _handleKeyUp(e) {
        var ctrlCmdKey;
        if (_isMac) {
            ctrlCmdKey = e.metaKey;
        } else {
            ctrlCmdKey = e.ctrlKey;
        }

        if ((!_canTurnOn) && (e.keyCode === 80 || ctrlCmdKey || e.shiftKey || (_isFirefox && e.altKey))) {
            _canTurnOn = true;
        } 
    }
  
    /**
     * @private Change the style of the keyboard-activated search results
     */
    function _styleResults() {
        if ($(".command-palette-results").length > 0) {
            $(".command-palette-results")[0].style.top = "0px";
            $(".command-palette-results")[0].style.height = "100%";
/*  removed this because scrollbar was not appearing, but leaving this comment in case there was some other reason it was here
            $(".command-palette-results")[0].style.overflowY = "hidden"; */
            if ($(".command-palette-visible").length > 0) {
                $(".command-palette-visible")[0].style.border = "1px solid black";
            }
        }
    }
  
    /**
     * @private For Chat only, lower the palette to just above the Phrases button
     */
    function _adjustPalettePosition() {
        if ($(".command-palette-results").length > 0) {
            if ($(".command-palette-visible").length > 0) {
               if (pega.u.d.workLabel.includes("Chat")) {
                  var oldTop = $(".command-palette-visible.command-palette")[0].style.top;
                  var oldTopInt = parseInt(oldTop.split("px")[0]);
                  var newTopInt = 10 + oldTopInt;
                  var newTop = "" + newTopInt + "px";
                  $(".command-palette-visible.command-palette")[0].style.top = newTop;
               }
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @public called from pzpega_ui_command_palette_load.js which is loaded in every frame.
     * Takes in a frame to evaluate if its the desktopWindow and if so retrieves list of actions
     * otherwise it adds the hot key event listener
     *
     * @param  $Window$ frame - The window where this function is called from
     */
    publicAPI.init = function(frame) {
       

        // Add the key down event listener to all frames for hot keys
        frame.addEventListener("keydown", _handleKeyDown, true);
        frame.addEventListener("keyup", _handleKeyUp, true);

        // Add frame unload listener to clean up ket event
        frame.pega.u.d.attachOnUnload(function() {
            frame.removeEventListener("keydown", _handleKeyDown, true);
            frame.removeEventListener("keyup", _handleKeyUp, true);
        });
    };

    /**
     * @public called to toggle on and off the command palette
     */
    publicAPI.toggle = function() {
     var postURL = new SafeURL("Pega-UI-CommandPalette.pzGetPaletteOptions");
      pega.u.d.asyncRequest("POST", SafeURL_createFromURL(postURL.toURL()), {
       success: function(o) {
         var elem = document.createElement('textarea');
         elem.innerHTML = o.responseText;
         var decoded = elem.value;
         elem = null;
         // Store off the list of actions from the server
         _listOfActionsFromServer = JSON.parse(decoded);
         
         // If the palette is not active then activate it
         if (!publicAPI.isActive()) {
            _state = STATES.ACTIVE;
          
            // Create the Input for the auto complete
            _commandPaletteInput = document.createElement('input');
            _commandPaletteInput.id = "command-palette-input";
            _commandPaletteInput.type = "text";
            _commandPaletteInput.placeholder = getSearchPlaceHolder(publicAPI.getHotKey());

            // Create the command palette wrapper div
            var commandPaletteDiv = document.createElement('div');
            var commandPaletteNewDiv = document.createElement('div');
            commandPaletteDiv.className = 'command-palette';
            commandPaletteDiv.appendChild(commandPaletteNewDiv);
            commandPaletteNewDiv.appendChild(_commandPaletteInput);
            commandPaletteNewDiv.className = "command-palette-input-field";
            document.body.appendChild(commandPaletteDiv);
            //Load search control relative to chat section
            Setcontrolposition();

            // let user exit with the ESCAPE key
            $(_commandPaletteInput).on('keyup', function(e) {
                if (e.keyCode === 27) {
                    if (pega.ui.commandpalette.isActive()) {
                        pega.ui.commandpalette.toggle();
                    }
                }
            });
           
            // Append the mask to the screen
            var commandPaletteMask = document.createElement('div');
            commandPaletteMask.className = 'command-palette-mask';
            commandPaletteDiv.appendChild(commandPaletteMask);

           // New up the autocomplete for the search field
            var autoCompleteElem = $("#command-palette-input").autocomplete({
                appendTo: ".command-palette",
               // autoFocus: true,
                minLength: 0,
                delay: 0,
                position: {
                    my: "left+0 top+7"
                },
                create: function(event, ui) {
                    setTimeout(function() {
                        $(event.target).focus(function(e) {
                            $(e.target).autocomplete("search", "");                          
                        });
                        $(event.target).focus();
                        $('.command-palette').addClass('command-palette-visible');
                        _adjustPalettePosition();
                    }, 0);
                },
                source: function(request, response) {
                    // Look at what words are in the search field and set search terms
                    _srchTerms = $.trim(request.term).split(/\s+/);

                    // Call helper method to filter all the actions from the server
                    var list = publicAPI.filterList(_srchTerms, _listOfActionsFromServer.pxResults);
                    // Separate the arrays into key match and text match
                    var listKey = [];
                    var listText = [];
                    for (var i = 0; i < list.length; i++) {
                      if (list[i].reason == "key") 
                        listKey.push(list[i]);
                      else 
                        listText.push(list[i]);
                    }

                    // Bubble sort the returned lists
                    listKey.sort(function(a, b) {
                        var aText = JSON.parse(a.pyName).join(SEPARATOR);
                        var bText = JSON.parse(b.pyName).join(SEPARATOR);
                        return aText.localeCompare(bText);
                    });
                    listText.sort(function(a, b) {
                        var aText = a.pyLabelRef;
                        var bText = b.pyLabelRef;
                        return aText.localeCompare(bText);
                    });
                    // Combine the two lists into a single one. Key based first and text based second.
                    var responseList = listKey.concat(listText);

                    response(responseList);
                },
                search: function(e,ui) {
                  /* Mem leak in jquery ui - see https://bugs.jqueryui.com/ticket/10050#comment:6 */
	                  autoCompleteElem.data("ui-autocomplete").menu.bindings = $();
  				      }, 
                select: function(event, ui) {
                    // force a click when enter key is pressed to select
                    if (event.keyCode === 13) {
                        $('.ui-autocomplete .ui-state-active')[0].click();
                    } else {
                      	$('.command-palette').removeClass('command-palette-visible');
                        setTimeout(_cleanUp, 500);
                    }
                    event.preventDefault();
                    return false;
                },
                response: function(event, ui) {
                    if (ui.content.length === 0) {
                        if ($(".no-results").length < 1) {
                            var noResults = document.createElement('div');
                            noResults.className = "command-palette-no-results";
                            noResults.innerHTML = '<div class="missing-glasses"></div><p class="no-results-message">No matched results</p>';
                            commandPaletteDiv.appendChild(noResults);
                        }
                    } else {
                        $('.no-results').remove();
                    }
                }
            });

            autoCompleteElem.data("ui-autocomplete")._renderItem = function(ul, item) {
                $(ul).addClass("command-palette-results");
                // save off the command palette inputs value
                _commandPaletteInputValue = $(_commandPaletteInput).val();

                // Create the new LI and wrapper DIV that has click event for the individual row
                var newListItem = document.createElement("LI");
                newListItem.className = "command-palette-row";
                var itemDiv = document.createElement("DIV");
                itemDiv.addEventListener("click", pd);
                itemDiv.dataset.click = item.pyValue;
                itemDiv.className = "command-palette-action";
                newListItem.appendChild(itemDiv);
                // render the category > phrase items first
                if (item.reason == "key") { 
                  newListItem.className += " " + "key-phrase";
                  // Create the first half of the row that is the left portion of the row that is grey
                  var lessImportantItem = document.createElement("SPAN");
                  lessImportantItem.className = "less-important";
                  lessImportantItem.dataset.click = ".";
                  itemDiv.appendChild(lessImportantItem);
                  // Create the first half of the row that is the left portion of the row that is grey
                  var moreImportantItem = document.createElement("SPAN");
                  moreImportantItem.className = "more-important";
                  moreImportantItem.dataset.click = ".";
                  itemDiv.appendChild(moreImportantItem);
                  //Append tooltip to autocomplete results
                  span = document.createElement("span");
                  span.setAttribute("class", "command-palette-tooltiptext");
                  //Convert &quot; to '
                  item.pyLabelRef  =item.pyLabelRef.replace("&quot;","’");
                  span.textContent =JSON.parse(item.pyLabelRef);
                  itemDiv.appendChild(span);
                  // Call the helper to get the row HTML
                  var rowResponse = publicAPI.getRowHTML(JSON.parse(item.pyName), _srchTerms);
                  // Add the highlighted HTML to the elements and append to UL
                  lessImportantItem.innerHTML = rowResponse.lessImportant;
                  moreImportantItem.innerHTML += rowResponse.moreImportant;  
                } else { 
                  // Render the phrase based search results
                  newListItem.className += " " + "text-phrase";
                  // if the count of key phrase is more than 0 and count of phrase text is 0m then this is the start
                  if ($(ul).find("li.command-palette-row.key-phrase").length > 0 && 
                      $(ul).find("li.command-palette-row.text-phrase").length == 0){ 
                    // append the text-phrase-start class so that it can be used to draw a separator border
                    newListItem.className += " " + "text-phrase-start";
                  }
                  var phraseText = document.createElement("SPAN");
                  phraseText.className = "phrase-text";
                  phraseText.dataset.click = ".";
                  var highlightIndex = 0;
                  var highlightedText = JSON.parse(item.pyLabelRef)[0][0];
                  for(var i=0; i<_srchTerms.length; i++) {
                    if (_srchTerms[i] === "") continue;
                    highlightedText = _highlightMatchedText(_srchTerms[i], highlightedText, highlightIndex);
                    highlightIndex = highlightedText.index;
                    highlightedText = highlightedText.newString;
                  }

                  phraseText.innerHTML = highlightedText;
                  itemDiv.appendChild(phraseText);
                }
                return $(newListItem).appendTo(ul);
            };

          	// BUG-322466: Override the close so the selected content is not cleared until the _cleanUp() function
          	autoCompleteElem.data("ui-autocomplete").close = function(e) {};

            // Cache off the autoComplete
            _commandPaletteInput = $("#command-palette-input")[0];

            // bind a keydown event to the command palette input for the up and down keys to persist the value the user has typed in
            $(_commandPaletteInput).on("keydown", function(e) {
                if (e.keyCode == 38 || e.keyCode == 40) {
                    $(_commandPaletteInput).val(_commandPaletteInputValue);
                }
            });
            $(_commandPaletteInput).on("blur", function(e) {
               /* close the palette if the user clicks away from it */
               /* On IE and Edge, clicking on a scrollbar also triggers the blur event */
               if (pega.util.Event.isIE) {
                 if (document.activeElement.className.includes("command-palette-results")) {
                   return;
                 }
               }
               if (pega.util.Event.isEdge) {
                  setTimeout(function() {
                     if (document.activeElement.id !== "command-palette-input") {
                       _cleanUp();
                     }
                  }, 10);
                  return;
               }
               _cleanUp();
            });

            // Add a resize listener to close out
            window.addEventListener("resize", _cleanUp);
        } else {
            // Toggle off and clean up
            _cleanUp();
        }
      }
     });
    };

    /**
     * @public called to search for phrases in place, upon user entering the configured hotkey
     */
    publicAPI.phraseSearchInPlaceOn = function(triggeringEvent, searchText) {
      var postURL = new SafeURL("Pega-UI-CommandPalette.pzGetPaletteOptions");
      pega.u.d.asyncRequest("POST", SafeURL_createFromURL(postURL.toURL()), {
         success: function(o) {
            var elem = document.createElement('textarea');
            elem.innerHTML = o.responseText;
            var decoded = elem.value;
            elem = null;
            // Store off the list of actions from the server
            _listOfActionsFromServer = JSON.parse(decoded);
         
           // Activate the palette
            _state = STATES.ACTIVE;
          
            // Create the Input for the auto complete
            _commandPaletteInput = document.createElement('input');
            _commandPaletteInput.id = "command-palette-input";
            _commandPaletteInput.type = "text";
            _commandPaletteInput.style.opacity = "0%";

            // Create the command palette wrapper div
            var commandPaletteDiv = document.createElement('div');
            var commandPaletteNewDiv = document.createElement('div');
            commandPaletteDiv.className = 'command-palette';
           
            commandPaletteDiv.appendChild(commandPaletteNewDiv);
            commandPaletteNewDiv.appendChild(_commandPaletteInput);
            commandPaletteNewDiv.className = "command-palette-input-field";
            document.body.appendChild(commandPaletteDiv);
           //Load search control relative to chat section
            SetInPlaceSearchPosition(triggeringEvent.editor);
          
           // Append the mask to the screen
            var commandPaletteMask = document.createElement('div');
            commandPaletteMask.className = 'command-palette-mask';
            commandPaletteDiv.appendChild(commandPaletteMask);

           // New up the autocomplete for the search field
            var autoCompleteElem = $("#command-palette-input").autocomplete({
                appendTo: ".command-palette",
               // autoFocus: true,
                minLength: 0,
                delay: 0,
                position: {
                    my: "left+0 top+7"
                },
                create: function(event, ui) {
                    setTimeout(function() {
                        $('.command-palette').addClass('command-palette-visible');
                        $(_commandPaletteInput).val(searchText);
                        $("#command-palette-input").autocomplete("search");
                        _styleResults();
                        _adjustPalettePosition();
                    }, 0);
                },
                source: function(request, response) {
                    // Look at what words are in the search field and set search terms
                    _srchTerms = $.trim(request.term).split(/\s+/);

                    // Call helper method to filter all the actions from the server
                    var list = publicAPI.filterList(_srchTerms, _listOfActionsFromServer.pxResults);
                    // Separate the arrays into key match and text match
                    var listKey = [];
                    var listText = [];
                    for (var i = 0; i < list.length; i++) {
                      if (list[i].reason == "key") 
                        listKey.push(list[i]);
                      else 
                        listText.push(list[i]);
                    }

                    // Bubble sort the returned lists
                    listKey.sort(function(a, b) {
                        var aText = JSON.parse(a.pyName).join(SEPARATOR);
                        var bText = JSON.parse(b.pyName).join(SEPARATOR);
                        return aText.localeCompare(bText);
                    });
                    listText.sort(function(a, b) {
                        var aText = a.pyLabelRef;
                        var bText = b.pyLabelRef;
                        return aText.localeCompare(bText);
                    });
                    // Combine the two lists into a single one. Key based first and text based second.
                    var responseList = listKey.concat(listText);

                    response(responseList);
                },
                search: function(e,ui) {
                  /* Mem leak in jquery ui - see https://bugs.jqueryui.com/ticket/10050#comment:6 */
	                  autoCompleteElem.data("ui-autocomplete").menu.bindings = $();
  				      }, 
                select: function(event, ui) {
                    // force a click when enter key is pressed to select
                    if (event.keyCode === 13) {
                        var activeNodes = $('.ui-autocomplete .ui-state-active');
                        if (activeNodes && activeNodes.length > 0) {
                            activeNodes[0].click();
                        }
                    } else {
                      	$('.command-palette').removeClass('command-palette-visible');
                        setTimeout(_cleanUp, 500);
                    }
                    event.preventDefault();
                    return false;
                },
                response: function(event, ui) {
                    /* for the keyboard-activated one, we hide the results if there are no matches */
                    if (ui.content.length === 0) {
                        commandPaletteDiv.style.display = "none";
                        commandPaletteNewDiv.style.display = "none";
                        VISIBLE = false;
                    } else {
                        commandPaletteDiv.style.display = "inherit";
                        commandPaletteNewDiv.style.display = "inherit";
                        VISIBLE = true;
                    }
                }
            });
           
            autoCompleteElem.data("ui-autocomplete")._renderItem = function(ul, item) {
                $(ul).addClass("command-palette-results");
                // save off the command palette inputs value
                _commandPaletteInputValue = $(_commandPaletteInput).val();

                // Create the new LI and wrapper DIV that has click event for the individual row
                var newListItem = document.createElement("LI");
                newListItem.className = "command-palette-row";
                var itemDiv = document.createElement("DIV");
                itemDiv.addEventListener("click", pd);
                itemDiv.dataset.click = item.pyValue;
                itemDiv.className = "command-palette-action";
                newListItem.appendChild(itemDiv);
                // render the category > phrase items first
                if (item.reason == "key") { 
                  newListItem.className += " " + "key-phrase";
                  // Create the first half of the row that is the left portion of the row that is grey
                  var lessImportantItem = document.createElement("SPAN");
                  lessImportantItem.className = "less-important";
                  lessImportantItem.dataset.click = ".";
                  itemDiv.appendChild(lessImportantItem);
                  // Create the first half of the row that is the left portion of the row that is grey
                  var moreImportantItem = document.createElement("SPAN");
                  moreImportantItem.className = "more-important";
                  moreImportantItem.dataset.click = ".";
                  itemDiv.appendChild(moreImportantItem);
                  //Append tooltip to autocomplete results
                  span = document.createElement("span");
                  span.setAttribute("class", "command-palette-tooltiptext");
                  //Convert &quot; to '
                  item.pyLabelRef  =item.pyLabelRef.replace("&quot;","’");
                  span.textContent =JSON.parse(item.pyLabelRef);
                  itemDiv.appendChild(span);
                  // Call the helper to get the row HTML
                  var rowResponse = publicAPI.getRowHTML(JSON.parse(item.pyName), _srchTerms);
                  // Add the highlighted HTML to the elements and append to UL
                  lessImportantItem.innerHTML = rowResponse.lessImportant;
                  moreImportantItem.innerHTML += rowResponse.moreImportant;  
                } else { 
                  // Render the phrase based search results
                  newListItem.className += " " + "text-phrase";
                  // if the count of key phrase is more than 0 and count of phrase text is 0m then this is the start
                  if ($(ul).find("li.command-palette-row.key-phrase").length > 0 && 
                      $(ul).find("li.command-palette-row.text-phrase").length == 0){ 
                    // append the text-phrase-start class so that it can be used to draw a separator border
                    newListItem.className += " " + "text-phrase-start";
                  }
                  var phraseText = document.createElement("SPAN");
                  phraseText.className = "phrase-text";
                  phraseText.dataset.click = ".";
                  var highlightIndex = 0;
                  var highlightedText = JSON.parse(item.pyLabelRef)[0][0];
                  for(var i=0; i<_srchTerms.length; i++) {
                    if (_srchTerms[i] === "") continue;
                    highlightedText = _highlightMatchedText(_srchTerms[i], highlightedText, highlightIndex);
                    highlightIndex = highlightedText.index;
                    highlightedText = highlightedText.newString;
                  }

                  phraseText.innerHTML = highlightedText;
                  itemDiv.appendChild(phraseText);
                }
                return $(newListItem).appendTo(ul);
            };

          	// BUG-322466: Override the close so the selected content is not cleared until the _cleanUp() function
          	autoCompleteElem.data("ui-autocomplete").close = function(e) {};

            // Cache off the autoComplete
            _commandPaletteInput = $("#command-palette-input")[0];

            // bind a keydown event to the command palette input for the up and down keys to persist the value the user has typed in
            $(_commandPaletteInput).on("keydown", function(e) {
                if (e.keyCode == 38 || e.keyCode == 40) {
                    $(_commandPaletteInput).val(_commandPaletteInputValue);
                }
            });
            /* no clean up on blur for the keyboard-activated palette, but still clean up on resize */
            window.addEventListener("resize", _cleanUp);
         }
      });
    };
  

    /**
     * @public called to turn off the search for phrases in place
     */
    publicAPI.phraseSearchInPlaceOff = function() {
      setTimeout(_cleanUp, 10);
    };
  
    /**
     * @public Set the text in the search box and trigger search
     */
    publicAPI.setSearchText = function(searchText) {
        $(_commandPaletteInput).val(searchText);
        $("#command-palette-input").autocomplete("search");
        _styleResults();
    };
  
    /**
     * @public Process UP or DOWN
     */
    publicAPI.navigate = function(key) {
        $(_commandPaletteInput).trigger(jQuery.Event( "keydown", { keyCode: key } ));
    };

    /**
     * @public called to check if the command palette is ready for use.
     * @return True if state is ready
     */
    publicAPI.isActive = function() {
        return _state == STATES.ACTIVE;
    };

    /**
     * @public called to check if the command palette is visible
     * @return True if active and visible; false means there is a search open with no matches
     */
    publicAPI.isVisible = function() {
        return VISIBLE;
    };

    /**
     * @public this fuction is called to filter a list of actions based on search terms
     * @param  $Array$ searchTerms - Array of search terms to check
     * @param  $Array$ actionsList - Array of actions
     * @return $Array$ the filtered list
     */
    publicAPI.filterList = function(searchTerms, actionsList) {
        var list = [];
        var regEx = '.*';
        for (var i = 0; i < searchTerms.length; i++) {
            regEx += searchTerms[i] + '.*';
        }

        // Check all results to see if they contains all the search terms combined
        // only return the matched results
        var regExObj = _getRegExp(regEx);
        if (regExObj !== null) {
            for (var j = 0; j < actionsList.length; j++) {
                var item = actionsList[j];
                var itemKey = JSON.parse(item.pyName).join(SEPARATOR); 
                var itemText = JSON.parse(item.pyLabelRef);
              
                if (regExObj.test(itemKey)) {
                    item.reason = "key";
                    list.push(item);
                    continue;
                } else if (regExObj.test(itemText)) { 
                    item.reason = "text";
                    list.push(item);
                }
            }
        }

        return list;
    };

    /**
     * @public this function is called to get the row html for each item in the list
     * @param  $JSON$ itemNameObj - Object for an item
     * @param  $Array$ searchTerms - List of terms to search on
     * @return $Object$ both the less important and more important text
     */
    publicAPI.getRowHTML = function(itemNameObj, searchTerms) {
        // Look at the item array and get the less vs more import text for searching
        var moreImportantHTML = itemNameObj.pop().toString();
        var lessImportantHTML = "";
        if (itemNameObj.length > 0) {
            lessImportantHTML = itemNameObj.join(SEPARATOR) + SEPARATOR;
        }

        // Loop over the search terms that were entered in the input
        var whereToSearchLessImportant = 0;
        var whereToSearchMoreImportant = 0;
        for(var i=0; i<searchTerms.length; i++) {
            if (searchTerms[i] === "") continue;

            // FIRST: Check the left of the row first to see if there is a match
            // if it matches update the index and string
            var lessImportantResponse = _highlightMatchedText(searchTerms[i], lessImportantHTML, whereToSearchLessImportant);
            if (lessImportantResponse !== null) {
                whereToSearchLessImportant = lessImportantResponse.index;
                lessImportantHTML = lessImportantResponse.newString;
                continue;
            }

            // SECOND: Check the right of the row to see if there is a match
            // if there is update the index of the less important text to the lengh so it is not searched again
            // also update the more important html and index
            var moreImportantResponse = _highlightMatchedText(searchTerms[i], moreImportantHTML, whereToSearchMoreImportant);
            if (moreImportantResponse !== null) {
                whereToSearchLessImportant = lessImportantHTML.length;
                whereToSearchMoreImportant = moreImportantResponse.index;
                moreImportantHTML = moreImportantResponse.newString;
            }
        }

        return {lessImportant: lessImportantHTML , moreImportant: moreImportantHTML};
    };

    /**
     * @public Return the string that triggers a search from the keyboard
     * @return string containing the hotkey sequence
     */
    publicAPI.getHotKey = function() {
      var hotKeyEl = document.querySelector("[name$=CommonPhraseQuickNavTrigger]");
      if (hotKeyEl) 
        return hotKeyEl.value;
      else 
        return "";
    }
        
    return publicAPI;
}());
//static-content-hash-trigger-YUI
// Placing command palette position relative to header
var Setcontrolposition = function() {
    var chatposition = $('.TypeaheadSearchchat').offset();
    if (typeof chatposition != "undefined") {
        chatposition.top = chatposition.top - 450;
        $('.command-palette').css({
            'top': chatposition.top,
            'left': chatposition.left,
        }).show();
    }
    var socialposition = $('.TypeaheadSearchsocial').offset();
    if (typeof socialposition != "undefined") {
        socialposition.top = socialposition.top - 250;
        $('.command-palette').css({
            'top': socialposition.top,
            'left': socialposition.left,
        }).show();
    }
    var emailposition = $('.TypeaheadSearchIncorr').offset();
    if (typeof emailposition != "undefined") {
        emailposition.top = emailposition.top - 450;
        emailposition.left = emailposition.left - 150;
        $('.command-palette').css({
            'top': emailposition.top,
            'left': emailposition.left,
        }).show();
    }
}
var SetInPlaceSearchPosition = function(element) {
        /*  console.log('element = ', element); */
        var cursorPosition = $(element).prop("selectionStart");
        /* console.log('pos = ', cursorPosition); */
        var chatposition = $('.TypeaheadSearchchat').offset();
        if (typeof chatposition != "undefined") {
            chatposition.top = chatposition.top - 450;
            $('.command-palette').css({
                'top': chatposition.top,
                'left': chatposition.left,
            }).show();
        }
        var socialposition = $('.TypeaheadSearchsocial').offset();
        if (typeof socialposition != "undefined") {
            socialposition.top = socialposition.top - 250;
            $('.command-palette').css({
                'top': socialposition.top,
                'left': socialposition.left,
            }).show();
        }
        var emailposition = $('.TypeaheadSearchIncorr').offset();
        if (typeof emailposition != "undefined") {
            emailposition.top = emailposition.top - 450;
            emailposition.left = emailposition.left - 150;
            $('.command-palette').css({
                'top': emailposition.top,
                'left': emailposition.left,
            }).show();
        }
    }
    //static-content-hash-trigger-YUI
/*@package
pega_cpm_localization.js
CPM Localization functions
*/

 
if (!pega)
  	var pega = {};


if (!pega.cpm)
  	pega.cpm = {};



// singleton functions
// This package provides localization for JS (alerts, messages, etc.)
// The array "pega_cpm_arLocalization" must already exist somewhere.  Generally this is found in a fragment (like CPMPortalLocalization), that is stream 
// processed with some default values (so don't have to go to server to get them.)
// If doesn't exist in your code, then you need to declare it (var pega_cpm_arLocalization = new Array();)
pega.cpm.localization = {
	

	/*
	@public - Get a localized string value.  Will see if in cache (array) first, if not, call the server.  Because may need to call server, this function is asynchronous and you will get the data back via a callback. If you are coding with packages (prototype, etc.), pass in "this" to the scope.
	@param $String$sClass - class of the field value, will default to CPM-Portal if none provided.
	@param $String$sProperty - property of the field value (pyMessageLabel, pyActionPrompt, etc.)
	@param $String$sValue - the string to be localized. Include "\t" if using parameters.
	@param $reference$oCallback - call back function.  Function should have one parameter (sLocalized) which will be the localized string
	@param $reference$scope - will generally be "this", so in packages and instantiation, "this.xxx" will work.
	@return $void$
	*/
	getLocalizedValue : function(sClass, sProperty, sValue, oCallback, scope) {


		if (sClass == null) {
			sClass = "CPM-Portal";
		}

		if (scope == null) {
			scope = window;
		}

		var sReturn = "";
		var sIndex = sClass + ":" + sProperty + ":" + sValue;


		// need the array "pega_cpm_arLocalization" to exist, generally put in a fragment that will be stream processed
		// with some default values.
		if (pega_cpm_arLocalization != null) {
			sReturn = pega_cpm_arLocalization[sIndex];

			if (sReturn == null) {

				arValues = sValue.split("\t");

				var oSafeUrl = new SafeURL("@baseclass.CPMGetLocalizedTextForString");
				oSafeUrl.put("AppliesTo", sClass);
				oSafeUrl.put("PropertyName", sProperty);
				oSafeUrl.put("StringToLocalize", arValues[0]);

				for (var el=1; el < arValues.length; el++) {
					oSafeUrl.put("s" + el, arValues[el]);
				}

				var _this = this;
				pega.u.d.asyncRequest("POST",
					oSafeUrl,
						{
							success:function(oResponse){
								sReturn = oResponse.responseText;
									// add to cache
								pega_cpm_arLocalization[sIndex] = sReturn;

								oCallback.call(scope, this._removeWhiteSpace(sReturn));


								},
							failure: function(){
								console.log("An error was encoutered while getting the localized version of "+arValues[0]+";Returning the non-localized version instead");
                                sReturn = arValues[0];
                                for (var el=1; el < arValues.length; el++) {
					                sReturn = sReturn.replace("{"+el+"}", arValues[el]);
				                }
                                oCallback.call(scope, this._removeWhiteSpace(sReturn));
						    },
							scope:this
						},
				"");



			}
			else {
				oCallback.call(scope, this._removeWhiteSpace(sReturn));

			}
			

		}


	},



	/*
	@private - Remove extra white spaces from a string.
	@param $String$str - string to remove the whitespaces.
	@return $String$ - string free of extra whitespaces.  
	*/
	_removeWhiteSpace: function (str) {
  		str = str.replace(/\s+/g, " ");
  		str = str.replace(/^\s(.*)/, "$1");
  		str = str.replace(/(.*)\s$/, "$1");		
		return (str);
	},




	_lastFunction: function() {


	}

}
//static-content-hash-trigger-YUI
pega.namespace("pega.cs");  
if(pega.cs.formfiller === undefined || pega.cs.formfiller === null) {
 
  pega.namespace("pega.cs.formfiller");
  pega.cs.formfiller = (function(){
 
    var selected_text = null;
    var formJson = null;
    var container = null;
    var mapCallback = null;
    var fieldValues = {
      "CopyTo":"Copy to :",
      "NoDropDownOption" : "Selected dropdown doesn't have an option with "
    };
    
    //Register onResize function to window resize event -- attach it to the action area if possible
    function onResize(){
      const caseContainer = $(document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0]);
      const autoPopulatedFields = caseContainer.find("[class*=auto-fill-border]");
      for (var i=0;i<autoPopulatedFields.length;i++)
        {
          var autoField = autoPopulatedFields[i];
          $(caseContainer[0].querySelector("#ACC_" + autoField.id)).remove();
          $(caseContainer[0].querySelector("#REJ_" + autoField.id)).remove();
          addIconsToField(autoField);      
      } 
    }
    var resizeTarget = $("[node_name='pyCaseActionArea']");
    if (resizeTarget.length > 0) {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(resizeTarget[0]);
    } else {
      $(window).resize(onResize);
    }
    
    /* START OF RELOAD SECTION BLOCK */
    function onReload(element) {
      var nonCase = false;
      var caseContainers = document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]");
      if (caseContainers.length == 0) {
        /* Use the interaction action area instead of service process */
        caseContainers = document.querySelectorAll("[class*=show]");
        nonCase = true;
      }
      if(caseContainers.length > 0){
        var activeMDC = caseContainers[0];
        if (nonCase || (activeMDC.contains(element)) || (element.contains(activeMDC))) {
            var caseID;
            if (nonCase) {
              caseID = "OneCase";
            } else {
              caseID = pega.ctx.strPyID;
            }
            var autoPopulatedList = sessionStorage.getItem(caseID);
            
            //Loop over the unreviewed autopopulated fields and add the css class and accept & reject icons. 
            while ((autoPopulatedList!=null)&&(autoPopulatedList!=""))
              {
                var fieldID=autoPopulatedList.substr(0,autoPopulatedList.indexOf(':'));
                autoPopulatedList = autoPopulatedList.replace(fieldID+":","");
                var field = activeMDC.querySelector("[id='"+fieldID+"']");
                if (field == null) {
                  var field = document.querySelector("[id='"+fieldID+"']");
                }
                if(field) {
                  if(!$(field).hasClass("auto-fill-border"))
                  {
                    //Set the css class to highlight the field to be reviwed.
                    $(field).addClass("auto-fill-border");
                    addIconsToField(field);
                  }
                }
              }
        }
      }
    }
    
    /* END OF RELOAD SECTION BLOCK */
    
    function initFieldValues(localizedFieldValues){
      for(var key in localizedFieldValues){
        fieldValues[key] = localizedFieldValues[key];
      }
    }
 
    function _generateFormJson(options) {
      var result = [];
      var node = {};
      container = (options.scope ? $(options.scope) : $("body")).get(0);
      var fields = container.getElementsByTagName("*");
      var labels = container.getElementsByTagName("LABEL");
      radioNodes = [];
      var dateRangeNodes = {};
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (field.style.display === "hidden") {
          continue;
        }
        /* we don't support date ranges; so we show them unselectable on the list */
        if (field.getAttribute("data-ctl") === '["DateRange"]' && field.tagName === "INPUT" && field.type === "hidden") {
          var id = field.id;
          if (!dateRangeNodes["id_" + id]) {
            dateRangeNodes["id_" + id] = true;
            node = {};
            node.disabled = true;
            node.prompt = "[Date range not passable]";
            result.push(node);
          }
        }
        if ((field.tagName === "INPUT" || field.tagName === "SELECT" || field.tagName === "CHECKBOX" || field.tagName === "TEXTAREA") && 
            field.type !== "hidden" && field.id !== "" && $(field).is(":visible")) {
          if (field.type === "radio") {
            var radioGroup = field.parentElement;
            while (radioGroup && radioGroup.getAttribute("role") !== "radiogroup") {
              radioGroup = radioGroup.parentElement;
            }
            node = getRadioNode(radioGroup);
            /* if this is part of a new radio group, retrieve a node that looks like a dropdown */
            if (field.getAttribute("validationtype") === "required") {
              if (node) {
                node.sending = true;
              }
            }
            if (node) {
              if (node.prompt === "") {
                node.prompt = "Unidentified radio";
                node.disabled = true;
                node.sending = false;
              } else {
                node.disabled = false;
              }
              result.push(node);
            }
          } else {
            /* not a radio button */
            node = {};
            node.disabled = false;
            if (field.getAttribute("validationtype") === "required") {
              node.sending = true;
            }
            node.id = field.id;
            node.title = field.title;
            if (field.type === "checkbox") {
              node.prevValue = field.checked ? "true" : "false";
            } else {
              node.prevValue = field.value;
            }
            node.type = field.type;
            node.prompt = node.title;
            if (field.options) {
              node.options = [];
              for (var j = 0; j < field.options.length; j++) {
                node.options[j] = {
                  value: field.options[j].value,
                  text: field.options[j].innerHTML
                };
              }
            }
            for (var k = 0; k < labels.length; k++) {
              /* find the label */
              if (labels[k].htmlFor === node.id) {
                if (labels[k].innerHTML !== "") {
                  node.prompt = labels[k].innerHTML;
                }
              }
            }
            /* prompt is the backup tooltip and vice versa */
            if (node.title === "") {
              node.title = node.prompt;
            }
            /* for fields without prompts (e.g., checkboxes in repeating grids), look for relevant information */
            if (node.prompt === "") {
              var tr = field.closest("tr");
              var tds = tr.getElementsByTagName("td");
              for (var t = 0; t < tds.length; t++) {
                var text = tds[t].innerText;
                if (text !== "") {
                  if (node.prompt !== "") {
                    node.prompt += " | ";
                  }
                  node.prompt += text;
                }
              }
            }
            if (node.prompt === "") {
              node.prompt = "Unidentified " + node.type;
              node.disabled = true;
              node.sending = false;
            }
            result.push(node);
          }
        }
      }
      return result;
    }
 
    /************************************************************************/
 
    /* function to create entity drop-down */
 
    function _showDropdown(options){
      formJson = _generateFormJson(options);
      $(".form-filler-dropdown").remove();
      if((formJson && formJson.length > 0)){
        options.event.preventDefault();
        $(options.container).append(_constructDropdown($(options.container).offset()));
        _positionDropDown(options.event);
      }
    }
 
    /*************************************************************************************************/
 
    /* construct dropdown */
    function _constructDropdown(offset){
      var navmenu = $("<nav offsetX=offset.left' offsetY='offset.top'>").addClass("form-filler-dropdown").attr({
        offsetX : offset.left,
        offsetY : offset.top
      });      
      var menuul = $("<ul>").addClass("form-filler-dropdown-items-list");
      var heading = $("<h3>").addClass("form-filler-dropdown-heading padding-l-2x padding-r-2x padding-t-1x padding-b-2x").text(fieldValues.CopyTo);
      menuul.append(heading);
 
      for(var i=0; i<formJson.length; i++) {
        var elementInfo = formJson[i];
        switch(elementInfo.type){
          case "text":
          case "select-one":
          case "tel":
          case "email":
          case "number":
            menuul.append(_generateMenuEntry(elementInfo));
            break;
        }
      }
      navmenu.append(menuul);
      return navmenu;
    }
 
    function _generateMenuEntry(input){      
      // Sanitize the input prompt
      var div = document.createElement("div");
      div.innerHTML = input.prompt;
      input.prompt = div.textContent || div.innerText || "";
      
      var menudiv = $("<div>").addClass("padding-l-2x padding-r-2x padding-b-1x");
      var menuli = $("<li>");
      var button = $("<button type='button' onclick = 'pega.cs.formfiller.mapToForm(event)'>");
      button.addClass("form-filler-menu-button");
      button.attr({
        targetId : input.id,
        title: input.prompt
      }); 
      //BUG-564325: Helper text of the fields also coming in the input prompt, that is removed...
      var promptData = input.prompt;
      var innerTagIndex = promptData.indexOf("<i");
      if(innerTagIndex >= 0)
        promptData = promptData.substring(0,innerTagIndex);
      //menuli.text(input.prompt);
      menuli.text(promptData);
      //...BUG-564325
      menudiv.append(menuli);
      menudiv.append(button);
      if(input.prevValue && input.prevValue !== ""){
        button.addClass("coloured");
      }
      return menudiv;
    }
 
    function mapToForm(e){
      var target = e.target;
      var targetId = $(target).attr("targetId");
      if(targetId && targetId !== ""){
        var targetedFormEle = $(container).find("#"+$.escapeSelector(targetId));
        if(targetedFormEle.length > 0){
          var mappedValue = true;
          if(targetedFormEle.is("select")){
            var possibleOptions = targetedFormEle.find("option").filter(function(){
              return (
                $(this).attr('value').toLowerCase() === selected_text.toLowerCase() || 
                $(this).attr('title').toLowerCase() === selected_text.toLowerCase() || 
                $(this).text().toLowerCase() === selected_text.toLowerCase()
              );
            });
            if(possibleOptions.length > 0){
              $(targetedFormEle).val($(possibleOptions[0]).attr("value"));
            }else{
              mappedValue = false;
              alert(fieldValues.NoDropDownOption+" "+selected_text);
            }
          }else{
            if ($(targetedFormEle)[0].getAttribute("validationtype") && ($(targetedFormEle)[0].getAttribute("validationtype").includes("date")) && (selected_text.match(/^\d{8}$/))) {
              selected_text = convertDate(selected_text);
            } else if ($(targetedFormEle)[0].getAttribute("data-format-method") && ($(targetedFormEle)[0].getAttribute("data-format-method").includes("date")) && (selected_text.match(/^\d{8}$/))) {
              selected_text = convertDate(selected_text);
            } else if ($(targetedFormEle)[0].parentElement.getAttribute("data-calendar") && ($(targetedFormEle)[0].parentElement.getAttribute("data-calendar") != "") && (selected_text.match(/^\d{8}$/))) {
              selected_text = convertDate(selected_text);
            }
            $(targetedFormEle).val(selected_text); 
          }
          $(targetedFormEle)[0].dispatchEvent(new window.Event("change", { bubbles: true }));  /* trigger any onchange actions */
          if(mapCallback && mappedValue){
            var propertyMappedToField = ($(targetedFormEle).attr("name") || "" ).replace("$PpyWorkPage","").replace(/\$p/g,".")
            mapCallback({
              event: e,
              selectedText: selected_text,
              propertyMappedToField: propertyMappedToField
            });
            var id = targetedFormEle[0].id;
            pega.cs.formfiller.validateAutoFill(id, false);
          }
        }
      }
      _dropDownCloseHandler(e,true);
    }
 
    function convertDate(inDate) {
      var month = inDate.substring(4, 5) == "0" ? inDate.substring(5, 6) : inDate.substring(4, 6);
      var day = inDate.substring(6, 7) == "0" ? inDate.substring(7, 8) : inDate.substring(6, 8);
      var year = inDate.substring(0, 4);
      return "" + month + "/" + day + "/" + year;
    }
 
    /**************************************************************/
 
    /* function to launch dropdown at right clicked position */
 
    function _positionDropDown(e){
 
      var menuWidth;
      var menuHeight;
      var windowWidth;
      var windowHeight;
      var clickCoords;
      var clickCoordsX;
      var clickCoordsY;
 
      var menuPositionX;
      var menuPositionY;
 
      clickCoords = _getPosition(e);
      clickCoordsX = clickCoords.x;
      clickCoordsY = clickCoords.y;
 
      menuWidth = $(".form-filler-dropdown").width();
      menuHeight = $(".form-filler-dropdown").height();
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      
      var entityWin = $(e.target).closest(".ai-found-entities");
      
      if (entityWin.length > 0) { 
        var p = $(e.target).closest("#po0").first();
        if (p != null) { 
          /* 20 is for padding around modal */
          windowWidth =(p.position().left+p.width()+20);
          windowHeight = p.position().top+p.height();
        }        
      }
 
      if((windowWidth - clickCoords.clickX) < menuWidth){
          menuPositionX = (clickCoordsX - menuWidth)
          if(menuPositionX < 0){
            menuPositionX = 0;
          }
          menuPositionX = menuPositionX +"px";
      }
      else{
        menuPositionX = clickCoordsX+"px";
      }
 
      if((windowHeight - clickCoords.clickY) < menuHeight){
        menuPositionY = (clickCoordsY - menuHeight)+"px";
      }
      else{
        menuPositionY = clickCoordsY+"px";
      }
 
      $(".form-filler-dropdown").addClass("show");
      $(".form-filler-dropdown").css({
        'position':'absolute',
        'top':menuPositionY,
        'left':menuPositionX,
        'z-index':'100',
        'height':$(".form-filler-dropdown-items-list").outerHeight()+4
      });
    }
 
    /**************************************************************/
 
    /* function to get right clicked (on entity) position */
 
    function _getPosition(e){
      var posX = 0;
      var posY = 0;
 
      if(e.pageX || e.pageY){
        posX = e.pageX;
        posY = e.pageY;
      }
      else if(e.clientX || e.clientY){
        posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
 
      var formFiller = $(".form-filler-dropdown");
      var containerOffset = {
        x : parseInt(formFiller.attr("offsetX")),
        y : parseInt(formFiller.attr("offsetY"))
      }
      return {
        clickX:posX,
        clickY:posY,
        x:posX - containerOffset.x,
        y:posY - containerOffset.y
      }
    }
 
    /**************************************************************/
 
    /* function to handle click on window */
 
    function _dropDownCloseHandler(event,forceClose){
      if($(event.target).closest('.form-filler-dropdown').length === 0 || forceClose){
        $(".form-filler-dropdown").removeClass("show");
        formJson = null;
        $(window).off('click',_dropDownCloseHandler);
        $(window).off('resize',_dropDownCloseHandler);
        container = null;
        mapCallback = null
      }
    }
 
    /**************************************************************/
 
    /* function to handle right click on target element */
 
    function invokeformfiller(options){
      if(options.textSelected){
        selected_text = options.textSelected;
      }else{
        selected_text = $(options.event.target).text(); 
      }
      mapCallback = options.mapCallback;
      _showDropdown(options);
      $(window).on('click',_dropDownCloseHandler);
      $(window).on('resize',_dropDownCloseHandler);
    }
 
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right ==0 )
          return false;
      else
        {
          return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
 
          );
        }
    }
 
 
    function autoFillDetectedEntities(detectedEntities,configuredEntities){
      var nonCase = false;
      var caseContainers = document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]");
      if (caseContainers.length == 0) {
        /* Use the interaction action area instead of service process */
        caseContainers = document.querySelectorAll("[class*=show]");
      }
      if(caseContainers.length > 0){
        var activeMDC = caseContainers[0];
        
        //Detach & attach the listener for every section refresh. 
        pega.u.d.detachOnload(onReload);
        pega.u.d.attachOnload(onReload, true);
        
        if(!detectedEntities){
           return;
        }
        if(!configuredEntities){
          configuredEntities = JSON.parse(activeMDC.querySelectorAll("[name$=czCaseEntityMap]")[0].value);
        }
        var configuredEntitiesByKey = {};
        var configuredEntitiesByProperty = {};
        configuredEntities.pxResults.forEach(entity => {
          configuredEntitiesByKey[entity["pyEntityName"]] = 0;
          if (configuredEntitiesByProperty[entity["pyEntityName"]] == undefined) {
            configuredEntitiesByProperty[entity["pyEntityName"]] = [];
          }
          configuredEntitiesByProperty[entity["pyEntityName"]].push((entity["pyParent"] === undefined) || (entity["pyParent"] === "") ? 
            entity["pyPropertyIdentifier"] : entity["pyParent"] + "." + entity["pyPropertyIdentifier"]);
        });
        detectedEntities.pxResults.reverse().forEach(detectedEntity => {
        if(configuredEntitiesByKey[detectedEntity.pyName.toLowerCase()] === 0){
            configuredEntitiesByKey[detectedEntity.pyName.toLowerCase()] = detectedEntity;
          }
        if(configuredEntitiesByKey[detectedEntity.pyName] === 0){
            configuredEntitiesByKey[detectedEntity.pyName] = detectedEntity;
          }
        });
        var iconIDs = [];
        for(const key in configuredEntitiesByKey){
          if(configuredEntitiesByKey[key] !== 0){
            const entityToBeMapped = configuredEntitiesByKey[key];
            var entityComplete = false;
            configuredEntitiesByProperty[key].forEach(propertyEntity => {
              if (entityComplete) {
               return;  // break out of forEach if this value has already been placed
              }
            var formElementList = null;
            /* if there is an active modal overlay, use that; otherwise look for any visible fields that can be populated */
            var modals = document.getElementsByClassName("modal-overlay");
            for (var i = 0; i < modals.length; i++) {
              if ($(modals[i]).is(":visible")) {
                formElementList = $(modals[i]);
                break;
              }
            }
            if (!formElementList) {
              formElementList = $(document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0]);
            }
            if (!formElementList || formElementList.length == 0) {
              nonCase = true;
              formElementList = $(document.querySelectorAll("[class*=show]")[0]);
            }
            var formElements = formElementList.find(`[name$="$p${propertyEntity}"]`);
            if (formElements.length == 0) {
              formElements = formElementList.find(`[name$="$p` + propertyEntity + `"]`);
            }
            if (formElements.length == 0) {
              try {
                formElements = $(document.querySelectorAll(`[name$="$p` + propertyEntity + `"]`));
              } catch(e) {
                console.log("Query selector didn't work");
              }
            }
            if(formElements.length > 0 && (typeof $(formElements[0]).val() == undefined || !$(formElements[0]).val()  ) ){
                var newText = entityToBeMapped["pyValue"];
                markSuggested(entityToBeMapped["pyName"], newText, entityToBeMapped["pxCreateDateTime"]);
                if ($(formElements)[0].getAttribute("validationtype") && ($(formElements)[0].getAttribute("validationtype").includes("date")) && (newText.match(/^\d{8}$/))) {
                  newText = convertDate(newText);
                } else if ($(formElements)[0].getAttribute("data-format-method") && ($(formElements)[0].getAttribute("data-format-method").includes("date")) && (newText.match(/^\d{8}$/))) {
                  newText = convertDate(newText);
                } else if ($(formElements)[0].parentElement.getAttribute("data-calendar") && ($(formElements)[0].parentElement.getAttribute("data-calendar") != "") && (newText.match(/^\d{8}$/))) {
                  newText = convertDate(newText);
                }
                var autoField = $(formElements[0]).val(newText);
                if ($(formElements)[0].getAttribute("data-ctl") && $(formElements)[0].type.includes("select")) {
                  /* for dropdowns, we might have to substitute a resolved value */
                  var result = $(formElements[0]).val();
                  if (result == "" || result == null) {
                    var newValue = entityToBeMapped["pyResolvedValue"];
                    if (typeof newValue != "undefined") {
                      autoField = $(formElements[0]).val(newValue);
                    }
                  }
                }
                autoField.addClass("auto-fill-border");
                /* add the accept and reject buttons */
                autoField = autoField[0];
                addIconsToField(autoField);
                iconIDs.push(autoField.id);
              /*
                if (nonCase) {
                  $(autoField).focus();
                  $(autoField)[0].dispatchEvent(new window.Event("change", { bubbles: true }));  // trigger any onchange actions 
                }
                */
                var caseID = "";
                //Retrieve the case ID from hidden content 
                var caseIDField = activeMDC.querySelectorAll("[name$='pyID'][type='hidden']");
                if (caseIDField.length > 0)
                {
                 caseID = caseIDField[0].value;
                }
                if (caseID == "") 
                {
                  console.log("No case ID; assuming we are outside a case");
                  caseID = "OneCase";
                }
        
               //Keep track of service cases in session storage with key as AIcontextID:serviceCases. This is used in clearUnReviewedEntityList().           
               var AIcontextID;
               var interactionTypeField = activeMDC.querySelectorAll("[name$='InteractionType'][type='hidden']");
               var interactionType;
               if (interactionTypeField.length > 0)
               {
                interactionType = interactionTypeField[0].value;
               }
               //For chat, use interaction ID as AIcontextID. 
               if (interactionType == "chat")
               {
                 var interactionIDField = activeMDC.querySelectorAll("[name$='CurrentInteractionID'][type='hidden']");
                 var interactionID;
                 if (interactionIDField.length > 0)
                 {
                   interactionID = interactionIDField[0].value;
                   AIcontextID = interactionID;
                  }
               }
               //For call, use AISessionID as AIcontextID. 
               else 
               {
                 var sesionIDField = activeMDC.querySelectorAll("[name$='AISessionID'][type='hidden']");
                 var sesionID;
                 if (sesionIDField.length > 0)
                {
                  sesionID = sesionIDField[0].value;
                  AIcontextID = sesionID;
                }
               }
              var caseIDList = sessionStorage.getItem(AIcontextID + ":serviceCases");
              if (caseIDList === null)
              {
               caseIDList = "";
              }
             if (!caseIDList.includes(caseID + ":")) 
             {
              sessionStorage.setItem(AIcontextID + ":serviceCases", caseIDList + caseID + ":");
             }
              
              //Add the field to the sessionStorage item which keeps track of what all fields were auto-populated but not reviewed.
              var autoPopulatedList = sessionStorage.getItem(caseID);
              autoPopulatedList= autoPopulatedList == null ? (autoField.id + ":") : ((!autoPopulatedList.includes(autoField.id + ":"))? (autoPopulatedList + autoField.id + ":"):autoPopulatedList);
              sessionStorage.setItem(caseID,autoPopulatedList);
                 entityComplete = true; // set flag so we don't place the same value into more than one field
            }
            });
          }
        }
        /* localize the tooltips for the buttons, first accept, then reject */
        if (typeof pega_cpm_arLocalization == "undefined") {
          pega_cpm_arLocalization = [];
        }
        pega.cpm.localization.getLocalizedValue("@baseclass", "pyToolTip", "Accept this value",
          function(sMessage) {
          for (var i = 0; i < iconIDs.length; i++) {
            var obj = $(caseContainers[0].querySelector("#ACC_" + iconIDs[i]));
            if (obj) {
              obj.title = sMessage;
            }
          }
        });
        pega.cpm.localization.getLocalizedValue("@baseclass", "pyToolTip", "Reject this value",
          function(sMessage) {
          for (var i = 0; i < iconIDs.length; i++) {
            var obj = $(caseContainers[0].querySelector("#REJ_" + iconIDs[i]));
            if (obj) {
              obj.title = sMessage;
            }
          }
        });
        if (iconIDs.length > 0) {
          /* if have anything to validate, prevent submission of the form without making sure validations have been done */
          /* 1. retrieve the section containing the submit button, for the context */
          var element = $(caseContainers[0].querySelector("#ACC_" + iconIDs[0]));
          var container = null;
          if (element) {
            container = element[0];
          }
          if (!container || container.length < 1) {
            /* nothing here */
            return;
          }
          var submitButton;
          container = $(container);
          while (container.parent() && container.parent().length > 0) {
            container = container.parent();
            submitButton = container.find("button[data-click*='FinishAssignment']");
            if (submitButton.length > 0) {
              /* we've found the container we need */
              break;
            }
          }
          var activeServiceCase = document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0];
         if (activeServiceCase) { 
            var submitSection = pega.u.d.getSectionByName("pyCaseActionAreaButtons","", activeServiceCase);
            if (submitSection) {
              var submitSectionID = pega.u.d.getSectionId(submitSection);
              if (submitSectionID) {
                /* 2. register a before-submit handler that will (if the trigger was our submit button) check for any unvalidated autofills */
                pega.u.d.registerOnBeforeSubmit((context)=> {
                  var clickID = pega.u.d.getSectionDiv(pega.u.d.focusElement).getAttribute("uniqueid");
                  if (clickID != context.sectionId) {
                    /* this event was not triggered by the submit button */
                    return true;
                  }
                
                  if (unvalidatedFields(iconIDs[0], container)) {
                    pega.cpm.localization.getLocalizedValue("@baseclass", "pyToolTip", "Autofilled fields must be validated before submission",
                      function(sMessage) {
                        alert(sMessage);
                      });
                    return false;
                  }
            
                  //Detach the function attached to OnLoad
                  pega.u.d.detachOnload(onReload);
                  return true;
                }, {sectionId : submitSectionID});
              }
            }
          }
        }
      }
    }
 
    function addIconsToField(autoField) {
        var labelFields = $(document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0]).find("label[for=" + autoField.id + "]");
        if (labelFields.length == 0) {
          /* not in a service case */
          labelFields = $(document.querySelectorAll("label[for='" + autoField.id + "']"));
        }
        var labelField = null;
        var noLabel = false;
        if (labelFields.length > 0) {
          for (i=0;i <labelFields.length;i++)
            {
              if (isInViewport($(labelFields[i]).parent()[0].firstElementChild))
                {
                  labelField = $(labelFields[i]).parent()[0].firstElementChild;
                  break;
                }
            }
        }
        if (labelField == null) {
          /* if there is no label for the field, create some space for the icons */
          labelField = document.createElement("DIV");
          autoField.parentElement.insertAdjacentElement("afterBegin", labelField);
          noLabel = true;
        }
        var acceptIcon = document.createElement("A");
        acceptIcon.className = "pi pi-check acceptAutoFill";
        /* positioning is tricky -- it depends on the width of the field, the width of the label, whether there a required indicator */
        var req = labelField.className.includes("icon-required");
        var reqOffset = req ? 20 : 0;
        var fieldWidth = parseInt(autoField.offsetWidth);
        acceptIcon.id = "ACC_" + autoField.id;
        acceptIcon.title = "Accept this value";
        labelField.insertAdjacentElement("beforeend", acceptIcon);
        var rejectIcon = document.createElement("A");
        rejectIcon.className = "pi pi-close rejectAutoFill";
        rejectIcon.id = "REJ_" + autoField.id;
        rejectIcon.title = "Reject this value";
        labelField.insertAdjacentElement("beforeend", rejectIcon);
        labelField.originalWidth = "none";
        var labelWidth = parseInt(acceptIcon.offsetLeft) - parseInt(labelField.offsetLeft) + 10;
        labelField.baseWidth = labelWidth;
        if (req) {
          acceptIcon.style.marginLeft = "-20px";
        }
        if (req || noLabel) {
          rejectIcon.style.marginLeft = "-20px";
        }
        if (fieldWidth > (labelWidth + 30 + reqOffset)) {
          acceptIcon.style.left = (fieldWidth - labelWidth - 40 + reqOffset) + "px";
          acceptIcon.style.position = "relative";
          rejectIcon.style.left = (fieldWidth - labelWidth - 15 + reqOffset) + "px";
          rejectIcon.style.position = "relative";
        } else {
          labelField.originalWidth = labelField.style.width;
          labelField.style.width = (labelWidth + 30 + reqOffset) + "px";
          acceptIcon.style.left = (25 + reqOffset) + "px";
          acceptIcon.style.position = "relative";
          rejectIcon.style.left = (45 + reqOffset) + "px";
          rejectIcon.style.position = "relative";
        }
        acceptIcon.href = "javascript:pega.cs.formfiller.validateAutoFill('" + autoField.id + "', false)";
        rejectIcon.href = "javascript:pega.cs.formfiller.validateAutoFill('" + autoField.id + "', true)";
    }
    
    function markSuggested(entityName, entityValue, entityTimestamp) {
          var oSafeURL = new SafeURL("PegaCA-Work-Interaction.MarkSuggestedEntity");
          oSafeURL.put("pzPrimaryPageName", "pyWorkPage");
          oSafeURL.put("name", entityName);
          oSafeURL.put("value", entityValue);
          oSafeURL.put("timestamp", entityTimestamp);
          pega.util.Connect.initHeader('Content-Type', "application/x-www-form-urlencoded");
          var transaction = pega.u.d.asyncRequest('POST', oSafeURL, {
              success: function() {
              },
              failure: function() {},
              scope: this
          }, null);
    }
    
    function validateAutoFill(id, rejectFlag) {
      var activeMDC = document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0];
      var nonCase = false;
      if (activeMDC == undefined) {
        /* no service case */
        activeMDC = document;
        nonCase = true;
      }
      var field = activeMDC.querySelector("[id='"+id+"']");
      if (rejectFlag) {
        field.value = '';
      }
      activeMDC.querySelector("#ACC_" + id).remove();
      activeMDC.querySelector("#REJ_" + id).remove();
      var caseID;
      if (nonCase) {
        caseID = "OneCase";
      } else {
        var caseIDField = activeMDC.querySelectorAll("[name$='pyID'][type='hidden']");
        if (caseIDField.length > 0)
        {
           caseID = caseIDField[0].value;
         }
      }
      
      //Get the list from sessionStorage
      var autoPopulatedList = sessionStorage.getItem(caseID);
      var removeField = id + ":";
      //Remove the field accept or reject from the sessionStorage list as it is reviewed. 
      if (autoPopulatedList == null) {
        autoPopulatedList = sessionStorage.getItem("OneCase");
      }
      autoPopulatedList = autoPopulatedList.replace(removeField,"");
      sessionStorage.setItem(caseID,autoPopulatedList);
      
      /* if we widened the label field to place the icons, we need to reset it */
      var labelFields = activeMDC.querySelector("label[for='" + id + "']");
      var labelField;
      if (labelFields.length > 0) {
        labelField = $(labelFields[0]).parent()[0].firstElementChild;
      } else {
        labelField = field;
      }
      if (labelField.originalWidth != "none") {
        labelField.style.width = labelField.originalWidth;
      }
      $(field).removeClass('auto-fill-border');
      $(field).focus();
      $(field)[0].dispatchEvent(new window.Event("change", { bubbles: true }));  /* trigger any onchange actions */
    }
    
    function unvalidatedFields(id, container) {
      /* return true if there are fields left to be validated */
      var submitButton;
      var caseID;
      var caseIDField;
      var counter=0;
      var autoFields = 0;
      container = $(container);
      var activeServiceCase = document.querySelectorAll("[data-mdc-recordid*=acprimary][class*=show]")[0];
      while (container.parent() && container.parent().length > 0) {
        container = container.parent();
        submitButton = container.find("button[data-click*='FinishAssignment']");
        if (submitButton.length > 0) {
          autoFields = container.find(".auto-fill-border").length;
          caseIDField = activeServiceCase.querySelectorAll("[name$='pyID'][type='hidden']");
          if (caseIDField.length > 0) {
            caseID = caseIDField[0].value;
          } else {
            caseID = "OneCase";
          }
            var autoPopulatedList = sessionStorage.getItem(caseID);
   
            //Loop over the list to get fields which are unreviewed yet
            while ((counter < autoFields) && autoPopulatedList!="")
              { counter ++;
                var autoPopulatedField =autoPopulatedList.substr(0,autoPopulatedList.indexOf(':'));
                var field = document.getElementById(autoPopulatedField);
                //If the field is not visible, remove the icons and css class added while auto-populating. Also, blank out the value that was auto-populated.
                if(!(isInViewport(field)))
                  { 
                    autoPopulatedList = autoPopulatedList.replace(autoPopulatedField+":","");
                    activeServiceCase.querySelector("#ACC_" + field.id).remove();
                    activeServiceCase.querySelector("#REJ_" + field.id).remove();
                    $(field).removeClass('auto-fill-border');
                    field.value = '';
                    
                  }
              }
             
            sessionStorage.setItem(caseID,autoPopulatedList);
            //Get the length now as invisible fields have been cleared out
            autoFields = container.find(".auto-fill-border").length;
          
          break;
        }
      }
      
      if (autoFields == 0) {
         return false;
      } else {
         return true;
      }
    }
    
    /**************************************************************/
 
    return {
      invokeformfiller : invokeformfiller,
      mapToForm : mapToForm,
      initFieldValues : initFieldValues,
      autoFillDetectedEntities : autoFillDetectedEntities,
      validateAutoFill: validateAutoFill
    }
  })();
}
//static-content-hash-trigger-GCC
finishCoBrowsingAssignment = function(action) {
    var cobrowseACHarnessId = $("div[data-mdc-id='acprimary']> div.show[data-harness-id]").attr("data-harness-id");
    if (cobrowseACHarnessId) {
      pega.ui.HarnessContextMgr.setCurrentHarnessContext(cobrowseACHarnessId);
      setTimeout(function(){
        doFormSubmit('pyActivity=FinishAssignment');
      }, action === 'accept' ? 0 : 2000);
    }
  };
//static-content-hash-trigger-YUI
(function() {
    var keyupListen = false;  /* whether listener has already been launched */
    var searchString = "";    /* phrase search string, including the hotkey */
    var hotKey = pega.ui.commandpalette.getHotKey();
    var closeOnBlur = function(e) {
       /* blur listener */
       if (pega.util.Event.isIE) {
          /* IE is special */
          if (document.activeElement.className.includes("command-palette-results")) {
             return;
          }
       }
       if (pega.util.Event.isEdge) {
          /* Edge is even more special */
          setTimeout(function() {
             if (document.activeElement.id == "command-palette-input") {
                 /* now the active element is the palette itself, so attach the blur listener here as well */
                 $(document.activeElement).on('blur', closeOnBlur);
             } else {
                 if (pega.ui.commandpalette.isActive()) {
                     pega.ui.commandpalette.phraseSearchInPlaceOff();
                 }
             }
          }, 10);
          return;
       }
       if (document.activeElement.id == "command-palette-input") {
           /* now the active element is the palette itself, so attach the blur listener here as well */
           $(document.activeElement).on('blur', closeOnBlur);
       } else {
           if (pega.ui.commandpalette.isActive()) {
               pega.ui.commandpalette.phraseSearchInPlaceOff();
           }
       }
    };
    pega.ctx.customRTEPlugins = pega.ctx.customRTEPlugins || {};
    pega.ctx.customRTEPlugins["InsertText"] = {
        icon: "InsertText",
        init: function(editor) {
            editor.on('instanceReady', function(e) {
                var editor = e.editor;
                $(editor.element.$).off("insertTextOn").on("insertTextOn", function(e, insertContent) {
                    var editor = CKEDITOR.instances[$(e.target).attr("id")];
                    var data = editor.getData();
                    data = $('<div>').html(data).text();
                    if (searchString != "") {
                       /* this is a keyboard-triggered search; replace the search string with the selected phrase */
                       editor.setData(editor.getData().replace(searchString.trim(), insertContent));
                       setTimeout(function() {
                           editor.focus();
                           /* move the cursor to the end -- since I don't know how to move to the end of the inserted text */
                           var range = editor.createRange();
                           range.moveToPosition( range.root, CKEDITOR.POSITION_BEFORE_END );
                           range.collapse(false);
                           editor.getSelection().selectRanges([ range ]);
                        }, 50);
                        searchString = "";   /* signal there is no search in progress */
                    } else {
                       /* called from Phrases button */
                       editor.insertHtml(insertContent);
                    }
                });
            });
        }
    }
    pega.ctx.customRTEPlugins["PhraseSearch"] = {
        icon: "",
        init: function(editor) {
            if (hotKey == "") { 
              /* if the hotKey is "", it means this functionality is not enabled. Do not register the listener */
              return;
            }
            /* if the text starts with the hotKey, it's a search */
            editor.on("key", function(e) {
                /* if we are in search and user presses ENTER, trigger a click on the selected item, if there is one */
                if (e.data.keyCode === 13) {
                    if (pega.ui.commandpalette.isActive() && pega.ui.commandpalette.isVisible()) {
                        var activeNodes = $('.ui-autocomplete .ui-state-active');
                        if (activeNodes && activeNodes.length > 0) {
                          activeNodes[0].click();
                        }
                        return false;
                    } 
                 } else if (e.data.keyCode === 38 || e.data.keyCode === 40) {
                    /* if we are already in search and user enters a navigation key (UP or DOWN), 
                       pass it onto the autocomplete element but do not process it in the text area */
                    if (pega.ui.commandpalette.isActive() && pega.ui.commandpalette.isVisible()) {
                        pega.ui.commandpalette.navigate(e.data.keyCode);
                        return false;
                    }
                } else {
                  setTimeout(function() {
                    var data = e.editor.getData();
                    data = $('<div>').html(data).text();
                    searchString = "";
                    var searchText = "";
                    var triggerIndex = -1;
                    var textArray = data.split(String.fromCharCode(10));
                    for (var i = 0; i < textArray.length; i++) {
                        if (textArray[i].startsWith(hotKey)) {
                            searchString = textArray[i];
                            searchText = searchString.substring(hotKey.length);
                            break;
                        }
                    }
                    if (searchString != "") {
                        /* search common phrases */
                        if (!pega.ui.commandpalette.isActive()) {
                            /* launch the search panel with the search text set */
                            pega.ui.commandpalette.phraseSearchInPlaceOn(e, searchText, editor);
                            if (!keyupListen) {
                                /* if not already set, add a keyup listener to detect an escape to close;
                                CKEditor does not support keyup, and its key event does not include a press of
                                the escape key, so we attach this listener to the DOM object containing the editor */
                                editor.document.on('keyup', function(e) {
                                    if (e.data.$.keyCode === 27) {
                                        if (pega.ui.commandpalette.isActive()) {
                                            pega.ui.commandpalette.phraseSearchInPlaceOff();
                                        }
                                    }
                                });
                                /* if the user clicks off (other than to select), then close the panel */
                                editor.on('blur', closeOnBlur);
                                keyupListen = true;
                            }
                        } else {
                            /* already active -- just update the search text */
                            pega.ui.commandpalette.setSearchText(searchText);
                        }
                    } else {
                        if (pega.ui.commandpalette.isActive()) {
                            /* no longer searching -- close the search panel */
                            pega.ui.commandpalette.phraseSearchInPlaceOff();
                        }                  
                    }
                  }, 10);
                }
            });
        }
    }
})();
//static-content-hash-trigger-GCC
if (!pega)
	var pega = {};

if (!pega.chat)
  	pega.chat = {};

pega.CSPubSub = function() {
   this.subscribers = {};
};
pega.CSPubSub.prototype = {
  publish: function(id,event, data){
    if(!this.subscribers[id][event]) return;
    this.subscribers[id][event](data);
  },
  subscribe: function(id,event,callback){
    if(!this.subscribers[id]){
      this.subscribers[id] = {};
    }
    this.subscribers[id][event] = callback;   
    
  },
  unsubscribe: function(id,event){
    if(this.subscribers[id]){
      if(event){
        delete this.subscribers[id][event];
      }else{
        delete this.subscribers[id];
      }      
    }
  }
}


window.CSPubSub = new pega.CSPubSub();
//static-content-hash-trigger-GCC
//static-content-hash-trigger-GCC

if (!pega)
	var pega = {};

if (!pega.knowledge)
  	pega.knowledge = {};

/**
Object to handle 
**/
pega.knowledge.KnowledgeComponentEventHandler = function(){
  this.subscribers = [];
  
}
pega.knowledge.KnowledgeComponentEventHandler.prototype = {
   subscribeEvents: function(interactionId){
       pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(interactionId, "RELOAD", this.sendMessage);
       pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(interactionId, "PUSH ARTICLE LINK", this.pushKMArticleLink);
       pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(interactionId, "PUSH ARTICLE CONTENT", this.pushKMArticleContent);
   },
   unsubscribeEvents: function(interactionId){
       pega.desktop.support.getDesktopWindow().CSPubSub.unsubscribe(interactionId, "RELOAD");
       pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(interactionId, "PUSH ARTICLE LINK");
       pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(interactionId, "PUSH ARTICLE CONTENT");
   },
  pushKMArticleLink: function(data) {
    if(data.channelType == "email"){      
      //pega.cs.textchannel.handleArtilclePushKMReact(data.event, data.leadInText,"D_SelectedArticle", data.setLeadInText, data.setShareAbstract,data.pushArticleContentLabel,data.pushArticleLinkLabel);
    }
    else{
        data.articleAbstract = data.articleAbstract.replace(/(?:\\[rn])+/g, "");
	      var LeadInText = (data.setLeadInText === 'true') ? data.leadInText: "";
        var Abstract = (data.setShareAbstract === 'true') ? data.articleAbstract : "";
        if(data.articleTitle.length>36){
          data.articleTitle=data.articleTitle.substr(0,33);
          data.articleTitle=data.articleTitle + "..."
        }
        var finalurl = "<a class=\"articlelink\" data-articleid=\"" + data.articleID + "\" href=\"" + data.shareableURL + "\">" + data.articleTitle + "</a>";
        var KMArticleLink = (Abstract !== "") ? (LeadInText + Abstract + finalurl) : (LeadInText + finalurl);
	      var linkData = { "KMArticleLink" : KMArticleLink,
                          "isLinkAttached" : true,
                          "linkTitle":data.articleTitle,
                          "linkHref":data.shareableURL,
                          "linkText":LeadInText==""?data.articleTitle:LeadInText
                       }
	      pega.desktop.support.getDesktopWindow().CSPubSub.publish(data.interactionID, "PUSH KM ARTICLE LINK",linkData);
    }
   },
  pushKMArticleContent: function(data) {
       	pega.desktop.support.getDesktopWindow().CSPubSub.publish(data.interactionID, "PUSH KM ARTICLE CONTENT",data);

  },
   publishKMEvent:function(id,event,data){
     switch(event){
       case "SHOW ARTICLE":
         pega.desktop.support.getDesktopWindow().CSPubSub.publish(id,"SHOW ARTICLE",data);
         break;
       case "CHANGE CONTEXT":
         pega.desktop.support.getDesktopWindow().CSPubSub.publish(id,"CHANGE CONTEXT",data);
         break;
       case "PUSH ARTICLE":
         pega.desktop.support.getDesktopWindow().CSPubSub.publish(id,"PUSH ARTICLE",data);
         break;
     }
     
   }
}

window.knowledge = new pega.knowledge.KnowledgeComponentEventHandler();
//static-content-hash-trigger-GCC