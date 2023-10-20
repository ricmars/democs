// <SCRIPT>
/*@package
AutomationManager (Guided Tour) Internal APIs  
@asis
- Find a tour
- Start/continue a tour
- Handle next, previous, finish actions
- Handle redisplay on screen change
@endasis
AutomationManager api calls provide internal functions for the tour guide functionality.  Calls to these should be made to AutomationSupport, not directly.
*/

if (!pega.desktop) {
    pega.d = pega.namespace("pega.desktop");
}
pega.desktop.AutomationManager = (function() {
    /* private */
    var aCleanUpQ = [],
        /* list of actions needed to "cleanup" any preprocessing tasks  (future - not implemented yet*/
		/* holds the details of the last run tour, including what step we are on */
        oAutomationScript = {},
 
        /* current tour step*/ 
        iActivePreprocessActionIdx = -1,

		/* are we waiting for an asynch request to return */
        isReqPending = false,
        /* asynch request we sent to PRPC*/       
        asyncReq = null,
		
        /* Name of the frame where the original tour script was run ('_top' if in top level window)*/
        //sOriginatingFrameID = "",

        /* object that holds the pop over*/
        _oPopOver = null,

        /* list of scripts we have run during this user session*/
        oRegisteredScripts = {},

		/* holds the context of the last action or '_top' if no frame (i.e. the main window) */
		oContextOfLastAction = null,
		
		/* are we writing log file lines to the broswer console? */
        isLogEnabled = false,
        
        defaultTourContainer = "pxTourStopContainer",
        tourContainer = null;
    /* 
     *   Write log information to the browser console
     */
    var _log = function(sMethod, sNote) {
        if (isLogEnabled) {
            console.log(sMethod.concat(": ", sNote));
        }
    };
    /*
     *  Asynchronous Handlers
     *  These functions are meant to allow the process context from which these methods are called to continue processing.
     *  Without these we will bump heads with other Pega Events on the controls.
     */
    var async_ProcessNextStep = function() {
        try {
            _log("async_ProcessNextStep", "called");
            window.setTimeout($.proxy(processNextStep, this), 10);
        } catch (e) {
            _log("async_ProcessNextStep failure: ", e)
        }
    };
    var async_ProcessSameStep = function() {
        try {
            _log("async_ProcessSameStep", "called");
            window.setTimeout($.proxy(processSameStep, this), 10);
        } catch (e) {
            _log("async_ProcessSameStep failure: ", e)
        }
    };
    var async_ProcessPreviousStep = function() {
        try {
            _log("async_ProcessPreviousStep", "called");
            window.setTimeout($.proxy(processPreviousStep, this), 10);
        } catch (e) {
            _log("async_ProcessPreviousStep failure: ", e)
        }
    };
    //var async_ProcessStep = function(oStep) {
    //    try {
    //        _log("async_ProcessStep", "called");
    //        window.setTimeout($.proxy(processStep, this, oStep), 10);
    //    } catch (e) {
    //        _log("async_ProcessStep failure: ", e)
    //    }
    //};
    var async_ProcessAction = function(oStep) {
        try {
            _log("async_ProcessAction", "called");
            window.setTimeout($.proxy(processAction, this, oStep), 10);
        } catch (e) {}
    };
    var async_ProcessScript = function(oScript, sStep, sFrameID) {
        try {
            _log("async_ProcessScript", "called");
            window.setTimeout($.proxy(processScript, this, oScript, sStep, sFrameID), 10);
        } catch (e) {}
    };
    var async_ContinueScript = function(oScript, sStep, sFrameID) {
        try {
            _log("async_ContinueScript", "called");
            window.setTimeout($.proxy(continueScript, this, oScript, sStep, sFrameID), 10);
        } catch (e) {}
    };
    /* 
     *   Step processing
     */
    /* 
     *   Function processStep
     *   - Set oStep object
     *   - Process clean up actions from previous step (future)
     *   @return false if step is skipped
     */
    var processStep = function(oStep) {
        _log("processStep", "called");
        oAutomationScript.pyCurrentStep = oStep; //cache the current step for convenience
        /* 
         *   Ensure the that the clean up actions are processed
         *   Actions are not yet supported - future enhancement
         */
        return continueStep();
    };
    /*
     *  Function shouldStepBeDisplayed 
     *  @param oStep step object
     *  @return false if preconditions are not met; true if no precondition or if preconditions are met
     */
    var shouldStepBeDisplayed = function(oStep) {
            _log("shouldStepBeDisplayed", "called");
            retVal = pega.desktop.AutomationManager.preConditionProcessor.shouldStepBeDisplayed(oStep);
            _log("shouldStepBeDisplayed result: ", retVal);
            return retVal;
        }
    /*
    *  Function shouldStepBeSkipped 
    *  @param oStep step object
    *  @return false if preconditions are not met; true if no precondition or if preconditions are met
    */
    var shouldStepBeSkipped = function(oStep) {
      _log("shouldStepBeSkipped", "called");
      retVal = pega.desktop.AutomationManager.preConditionProcessor.shouldStepBeSkipped(oStep);
      _log("shouldStepBeSkipped result: ", retVal);
      return retVal;
    }
    /* 
    *   Function continueStep
    *   - Call update AutomationManagerModel
    *   - Call processAction (either directly or via asynch)
    *   @return false if step is skipped
    */
    var continueStep = function() {
        _log("continueStep", "called");      
        // Handle situation where oStep is not valid (all steps are set to be skipped)
        if (typeof oAutomationScript.pyCurrentStep == 'undefined') return false;
        // process preconditions if there are any
        if (!shouldStepBeDisplayed(oAutomationScript.pyCurrentStep)) {
            oAutomationScript.pyCurrentStep.pySkipped = true;
            return false;
        }
        var process = function() {
            var oStep = oAutomationScript.pyCurrentStep;
            if (oStep.pySteps && oStep.pySteps.length > 0 && oStep.pySteps.length >
                iActivePreprocessActionIdx) {
                async_ProcessAction(oStep.pySteps[++iActivePreprocessActionIdx]);
                return;
            } else {
                processAction(oStep, true);
            }
        };
        var callback = {
            success: process
        };
        updateAutomationManagerModel(callback);
        // return true if we processed.
        return true;
    };
    /*
     *  function processNextStep
     *  - call processStep with current index + 1
     *  - if we are at the end of the steps just stop - should not happen (next should not be an option to the user)
     */
    var processNextStep = function() {
        _log("processNextStep", "called");
        _log("processNextStep", "oAutomationScript.pyActiveStepIdx: " + oAutomationScript.pyActiveStepIdx);
        _log("processNextStep", "oAutomationScript.pySteps.length: " + oAutomationScript.pySteps.length);
        if (oAutomationScript.pyActiveStepIdx < oAutomationScript.pySteps.length) {
            if (!processStep(oAutomationScript.pySteps[++oAutomationScript.pyActiveStepIdx])) {
            // processStep returned false, which means the step was not displayed.
            // Call via public api so we are in correct context
              	_log("processNextStep", "processStep returned false, which means the step was not displayed. -- calling nextStep()");
                pega.desktop.automation.support.nextStep();
               	_log("processNextStep", "call to pega.desktop.automation.support.nextStep() complete");
              	return true
            } else {
              _log("processNextStep", "processStep returned true, which means the step was displayed -- exiting");
	          _log("processNextStep", "complete");
              return true;
            }
        } else {
            /* there is nothing more to process so ignore this call. */
          _log("processNextStep", "oAutomationScript.pyActiveStepIdx < oAutomationScript.pySteps.length is FALSE -- exiting");
	      _log("processNextStep", "complete");
          return false;
        }
       _log("processNextStep", "complete");
     };
    /*
     *  function processSameStep
     *  - Used to handle redisplay of pop up when user changes screen size or orientation 
     *  - call processStep with current index
     *  - if we are at the end of the steps just stop - should not happen (next should not be an option to the user)
     */
    var processSameStep = function() {
        _log("processSameStep", "called");
        if (typeof oAutomationScript.pySteps !== "undefined") {
            var oSmartInfoContainer = findTargetElement(".smartInfoContainer");
            _log("processSameStep", "oSmartInfoContainer.bSuccess: " + oSmartInfoContainer.bSuccess);
            var bSmartInfoContainerFound = oSmartInfoContainer.bSuccess 
          							   && typeof oSmartInfoContainer.$TargetElement.selector !== "undefined"
                                       && oSmartInfoContainer.$TargetElement.selector !== 'body';
            /*  
             *  Selector 'body' check needed so we don't redisplay a canceled tour on window resize. The function findTargetElement returns
             *  the body of the document when the specific element is not found so that when a user references a invalid selector in the
             *  tour rule the popup will still appear (just not linked to a specific element - it will be centered on the doc).  in this case
             *  if the selector changes to 'body' from '.smartInfoContainer' then the tour was not found and we should not redisplay
             */
            if (bSmartInfoContainerFound) {
                $Target = oSmartInfoContainer.$TargetElement;
                if (typeof $Target !== 'undefined') {
                  var bElementIsVisible = $Target.is(':visible');
                  if (bElementIsVisible && oAutomationScript.pyActiveStepIdx < oAutomationScript.pySteps.length) {
                      processStep(oAutomationScript.pySteps[oAutomationScript.pyActiveStepIdx]);
                  } else {
                      /* there is nothing more to process so ignore this call.  */
                  }
                }
            }
        } else {
          _log("processSameStep", "oAutomationScript.pySteps is undefined");
        }
    };
    /*
     *  function processPreviousStep
     *  - call processStep with current index - 1
     *  - if we are at the end of the steps just stop - should not happen (next should not be an option to the user)
     */
    var processPreviousStep = function() {
        _log("processPreviousStep", "called");
        if (oAutomationScript.pyActiveStepIdx !== 0) {
            if (!processStep(oAutomationScript.pySteps[--oAutomationScript.pyActiveStepIdx])) {
                // processStep returned false, so need to attept to display next previous step
                pega.desktop.automation.support.previousStep();
            }
        } else {
            /* there is nothing more to process so ignore this call.  */
        }
    };
	
	/**
	 * function getPotentialElements
	 *   Given a cssselector and a root element add elements that match in the current document and any visible iframes.
	 *   It searches depth first.
	 *
	 */	
    function getPotentialElements(selector, $root, $collection) {

	    _log("getPotentialElements", "called");
		
        if (!$root) $root = $(document);
        if (!$collection) $collection = $();

        // Loop through all frames
        $root.find('iframe').filter(":visible").each(function() {
            // Recursively call the function, setting "$root" to the frame's document
			try {
            $collection = getPotentialElements(selector, $(this).contents(), $collection);
			} catch(e) { 
			  //ignore error as we probably don't have access to the contents of the ifram
			}
        });

        // Select all elements matching the selector under the root
        $collection = $collection.add($root.find(selector));

   	    _log("getPotentialElements", "complete");
        return $collection;
    };
	
	
    /*
     *  function findElement 
     *  Given a css selector, find the element and return a JSON object:
     *      bSuccess: true/false 
     *      $TargetElement : Target element (JQuery array)
     *      oContext : the containing window;
     */
    var findElement = function(sCSSSelector) {
        _log("findElement", "called");
		
		var oReturn = {};		
		
		// list of potential matches to the css selector
		var $collection = getPotentialElements(sCSSSelector);

      	_log("findElement", "$collection.length: " + $collection.length);
		//attempt to narrow down the target
		if ($collection.length > 1 ) {
           	_log("findElement", "using first element found");
			// attempt to see if originating iframe is one of the matches else pick the top of the list
			// sOriginatingFrameID
			oReturn.bSuccess = true;
			oReturn.$TargetElement = $collection.eq(0);		
			oReturn.oContext = oReturn.$TargetElement[0].ownerDocument.defaultView;		
		} 
		// if we only have on target easy peasey
		else if ( $collection.length == 1 ) {
            _log("findElement", "using only element found");
			// use the top of the list
			oReturn.bSuccess = true;
			oReturn.$TargetElement = $collection.eq(0);		
			oReturn.oContext = oReturn.$TargetElement[0].ownerDocument.defaultView;
		} 
		// we didn't find it :(
		else {
          	_log("findElement", "found no elements, bSuccess is false");
			oReturn.bSuccess = false;
			oReturn.sErrorCode = "FoundImproperNumberOfElements\t0";
		}
       _log("findElement", "complete");
        return oReturn;
    };
    

    /*
     *  function findTargetElement
     *  Given a css selector, find the element in the current document or its children; If it is not found the body element is returned 
	 *   returned:
     *      bSuccess: true/false 
     *      $TargetElement : Target element (JQuery array)
     *      oContext : the containing window;
     */
    var findTargetElement = function(sCSSSelector) {

		_log("findTargetElement", "called");
      	_log("findTargetElement", "sCSSSelector: " + sCSSSelector);
	    var oReturn = findElement(sCSSSelector);
      	_log("findTargetElement", "oReturn.bSuccess" + oReturn.bSuccess);
      	
        var isVisible = false;
      	if (typeof oReturn.$TargetElement !== 'undefined') {
          	isVisible = oReturn.$TargetElement.is(':visible');
        }
      
        if (!isVisible || !oReturn.bSuccess) {
   	      	_log("findTargetElement", "element is either not found or is not visible - redirecting to display centered on the document body");
		    oReturn.$TargetElement =  $("body");
           
            if (oReturn.$TargetElement.length >= 1) {
                oReturn.bSuccess = true;
				oReturn.oContext = oReturn.$TargetElement[0].ownerDocument.defaultView;
            }		
			
		}
		_log("findTargetElement", "complete");
         return oReturn;
    };
    /*
     *  function processAction
     *  Given a step, find the element and return a JSON object:
     *      bSuccess: true/false 
     *            $TargetElement : Target element (JQuery array)
     *      oContext : the frame where we found the element (or _top if not in a frame)
     */
    var processAction = function(oStep, bSuppressStepContinuation) {
        _log("processAction", "called");
        var sAction = oStep.pyAction;
        var oProcessingStatus;
        // clean up possible existing pop over;   
        findAndClosePopOver();
        if (typeof sAction == "undefined" || sAction === "") {
            sAction = "showSmartInfo";
        }
        if (sAction === "showSmartInfo") {
            return oProcessingStatus = processAction_ShowInfo(oStep);
        }
        /*  actions other then showSmartInfo are not yet supported 
        						
        if (sAction === "click" || sAction === "hover") {
        	return oProcessingStatus = processAction_MouseEvent(oStep.pyActionParams.pyTarget, sAction);
        } else if (sAction === "showSmartInfo") {
        	return oProcessingStatus = processAction_ShowInfo(oStep);  
        } else if (sAction === "unwrap") {
        	return oProcessingStatus = processAction_Unwrap(oStep.pyActionParams);
        }
        						
        */
        /* if processing clean up don't want to continue step */
        if (bSuppressStepContinuation !== true) {
            continueStep();
        }
    };
    /*
     *  function processAction_MouseEvent
     *  (Not yet supported - leave for future)
     *
    var processAction_MouseEvent = function(sSelector, sEvent) {
        _log("processAction_MouseEvent", "called");
        var $Target = $(sSelector);
        if ($Target.length != 1) {
            return {
                bSuccess: false,
                sErrorCode: "FoundImproperNumberOfElements\t" + $Target.length
            };
        }
        if (sEvent === "click") {
            $Target[0].click();
        }
        if (sEvent === "hover") {
            $Target.mouseover();
        }
        return {
            bSuccess: true
        };
    };
    */
  
    /*
     *  function processAction_ShowInfo
     *  Given an object holding the params for a showInfo step
     *  - find the target element
     *  - determine its visibility and location
     *  - call function to actually display the pop over
     */
    var processAction_ShowInfo = function(oParams) {
        _log("processAction_ShowInfo", "called");
        var oElemSearch = findTargetElement(oParams.pyTarget),
            $Target = null;
        //exit b/c we could not find anything
        if (!oElemSearch.bSuccess) {
          _log("processAction_ShowInfo", "oElemSearch.bSuccess == false  Exiting");
          return;
        }
        _log("processAction_ShowInfo", "oElemSearch.$TargetElement.prop('tagName'): " + oElemSearch.$TargetElement.prop("tagName"));

      
        $Target = oElemSearch.$TargetElement;
        var domElement = null;
        var targetElementIsOnScreen = false;      	
        var targetElementIsVisible = false;
        var targetElementIsHidden = false;
        var leftPanelHidden = true;
      
      	if (typeof $Target !== 'undefined') {
          domElement = $Target.get(0);
          targetElementIsOnScreen = isElementOnScreen(domElement);      	
          targetElementIsVisible = $Target.is(':visible');
          targetElementIsHidden = $Target.is(':hidden');
        }
      
        if ($(".screen-layout-region-main-middle").css("left") !== "0px") {
            leftPanelHidden = false;
        }
        var isElementInLeftPanel = true;
        if ($Target.parents("[node_name = 'pzAppConfigNavigation']").length === 0) {
            isElementInLeftPanel = false;
        }
        if (leftPanelHidden && isElementInLeftPanel) {
            /* 
             * The element is in the left panel and the panel is currently hidden
             * Simulate a click to the "hamburger icon" to expand the left panel
             */
           	_log("processAction_ShowInfo", "left Panel is Hidden and element is in left panel");
            //var hamburgerIcon = $(".nav-toggle-one").click();
          	if ($(".nav-toggle-one").length === 1) {
              _log("processAction_ShowInfo", "Clicking Hamburger Icon");
              $(".nav-toggle-one").click();
              $(".nav-toggle-one").promise().done();
            }
            if ($(".toggle-runtime-edit").length === 1) {
               _log("processAction_ShowInfo", "Clicking Runtime Edit Icon");
              $(".toggle-runtime-edit").click();
              $(".toggle-runtime-edit").promise().done();
            }
          
          
        }
        if (!isElementInLeftPanel) {
            /* 
             * Click the main section to make sure that the left panel goes back
             * to hidden if necessary.  Otherwise the click does nothing.
             */
            var rightSideOfScreen = $("#screen-layout-mask").click();
        }
		
      	// Output some vars for console debugging
      	_log("processAction_ShowInfo", "targetElementIsOnScreen: " + targetElementIsOnScreen);
      	_log("processAction_ShowInfo", "targetElementIsVisible: " + targetElementIsVisible);
      	_log("processAction_ShowInfo", "targetElementIsHidden: " + targetElementIsHidden);
      	_log("processAction_ShowInfo", "leftPanelHidden: " + leftPanelHidden);
      	_log("processAction_ShowInfo", "isElementInLeftPanel: " + isElementInLeftPanel);
      
		if (oElemSearch.oContext === window ) {
			           /* 
             * Anchor element is not in a frame, call the showInfo function directly
             */
			oContextOfLastAction = window;
            $(".screen-layout-region-main-middle").promise().done(function() {
                // TODO - make pxTourStopContainer a constant?
                //showInfo($Target[0], getTourStopContainer());
              	showInfo($Target, getTourStopContainer());
            });
			
			
		} else {
			oContextOfLastAction = oElemSearch.oContext;
			$(".screen-layout-region-main-middle").promise().done(function() {
			    //oElemSearch.oContext.pega.desktop.AutomationManager.showInfoOnElement($Target[0], getTourStopContainer());
              	oElemSearch.oContext.pega.desktop.AutomationManager.showInfoOnElement($Target, getTourStopContainer());
            });			
		}
	};
		
    /*
     * function to get tour stop container        
     */
    var getTourStopContainer = function() {
        _log("getTourStopContainer", "returning: " + tourContainer);
        return tourContainer;
    };
    /*
     * function to set tour stop container
     * @param sTourStopContainer
     */
    var setTourStopContainer = function(sTourStopContainer) {
        _log("setTourStopContainer", "called")
        if (sTourStopContainer == null || sTourStopContainer == '') {
            _log("setTourStopContainer", "override is null/blank - using default container: " +
                defaultTourContainer);
            tourContainer = defaultTourContainer;
        } else {
            _log("setTourStopContainer", "setting override container to: " + sTourStopContainer);
            tourContainer = sTourStopContainer;
        }
    };
    /*
     *  function isElementOnScreen
     *  Is the element actually in the user viewport
     */
    var isElementOnScreen = function(el) {
        _log("isElementOnScreen", "called");

        var rect = el.getBoundingClientRect();
        var html = document.documentElement;
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || html.clientHeight) &&
          rect.right <= (window.innerWidth || html.clientWidth)
        );
      	/*
        var eap,
            rect = el.getBoundingClientRect(),
            docEl = document.documentElement,
            vWidth = window.innerWidth || docEl.clientWidth,
            vHeight = window.innerHeight || docEl.clientHeight,
            efp = function(x, y) {
                return document.elementFromPoint(x, y)
            },
            contains = "contains" in el ? "contains" : "compareDocumentPosition",
            has = contains == "contains" ? 1 : 0x14;
        // Return false if it's not in the viewport
        if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
        // Return true if any of its four corners are visible
        
      	var a = (eap = efp(rect.left, rect.top)) == el,
        	b = el[contains](eap) == has,
      		c = (eap = efp(rect.right,
                rect.top)) == el,
            d = el[contains](eap) == has,
            e = (eap = efp(rect.right, rect.bottom)) ==
            el,
            f = el[contains](eap) == has,
            g = (eap = efp(rect.left, rect.bottom)) == el,
            h =  el[contains](
                eap) == has;     	
      
      	// just return true if EDGE 
      	// this is becuase of a bug in EDGE where elementFromPoint doesnt return correct results when in iframe
       	if (/Edge\/\d./i.test(navigator.userAgent)){
           // This is Microsoft Edge
           //window.alert('Microsoft Edge');
         	return true;
        }
      	return (a || b || c || d || e || f || g || h)
        
        /*return (
            (eap = efp(rect.left, rect.top)) == el || el[contains](eap) == has || (eap = efp(rect.right,
                rect.top)) == el || el[contains](eap) == has || (eap = efp(rect.right, rect.bottom)) ==
            el || el[contains](eap) == has || (eap = efp(rect.left, rect.bottom)) == el || el[contains](
                eap) == has);
        */
      	
    };
    /*
     *  function openPopOver
     *  Inspired by the smart info section load
     *  - determine pop over attribs based on being linked to an anchor or floating
     *  - open the pop over
     *  - Set focus to the pop over button so user can <enter> though a tour without touching mouse.
     */
    var openPopOver = function(oTargetElem, sDivContents) {
        _log("openPopOver", "called");
        // When element not visible or attached to the body we will center the popup
        // SE-57046 -> Handling for languages using RTL for screen display
        var isScreenFlipped = document.querySelector("html").dir === "rtl";
        var fieldAttach = isScreenFlipped ? "rightBottom" : "leftBottom";
        var popOverAttach = isScreenFlipped ? "rightTop" : "leftTop";
        if (oTargetElem.tagName == "BODY") {
            fieldAttach = "centerMiddle";
            popOverAttach = "centerMiddle";
        }
        // container element
        var contElem = document.createElement("div");
        contElem.id = "smartInfoMain";
        pega.util.Dom.addClass(contElem, 'smartInfoMain');
        var format = getPopoverFormat();
        if (format != "") {
            pega.util.Dom.addClass(contElem, "smartInfoMain-" + format);
        }
        var sContentClass = "smartInfoContainer smartInfoContainer-" + format + " smartInfoMain-" + format;
        var bodyElem = document.createElement("div");
        bodyElem.id = "sInfoBodyDiv";
        bodyElem.innerHTML = sDivContents;
        bodyElem.className = "sInfoBody";
        contElem.appendChild(bodyElem);
        var tempElem = document.createElement("div");
        tempElem.appendChild(contElem);
        // if element is visible, make sure popup has border arrows pointing to said element
        var oVisuals = {
            displayLoader: false,
            contentClass: sContentClass,
            arrowDivClasses: ['arrow top', 'arrow bottom', 'arrow right', 'arrow left']
        };
        // When element is not visible we can't point to the anchor element.
        if (oTargetElem.tagName == "BODY") {
        //if (oTargetElem.prop("tagName") === "BODY") {
            oVisuals = {
                displayLoader: false,
                contentClass: sContentClass,
                arrowDivClasses: ['', '', '', '']
            };
        }
        // The remainder of the function (except the last function call) is copied from smart info section load
        var _popOver = pega.u.d.getPopOver(oTargetElem);
        _popOver.open({
            content: {
                type: 'domElement',
                element: tempElem
            },
            buttons: {
                ok: false,
                cancel: false
            },
            bindings: {
                associatedElement: oTargetElem
            },
            visual: oVisuals,
            position: {
                fieldAttach: fieldAttach,
                popOverAttach: popOverAttach,
                size: {
                    min: {
                        x: 20,
                        y: 20
                    }
                },
                offsetAttach: {
                    y: 7
                }
            },
            extraParams: {
                refresh: false,
                overflow: false
            },
            callbacks: {
                onBeforeClose: beforePopoverClose
            }
        });
        var oDL = new pega.tools.EvalDOMScripts();
        if (pega.u && pega.u.d) {
            pega.u.d.loadDOMObject(bodyElem, sDivContents);
        } else {
            oDL.loadHTMLElement(bodyElem, sDivContents);
        }
        var popOverContainerElem = _popOver.getContentContainerElement();
        /* set popover height again if any miss match */
        var sInfoMainDiv = pega.util.Dom.getElementsById("smartInfoMain", popOverContainerElem);
        if (sInfoMainDiv != null && sInfoMainDiv[0].offsetHeight != popOverContainerElem.offsetHeight) {
            popOverContainerElem.style.height = sInfoMainDiv[0].offsetHeight + "px";
        }
        var sInfoBodyDivObj = pega.util.Dom.getElementsById("sInfoBodyDiv", popOverContainerElem, "DIV");
        if (sInfoBodyDivObj != null && sInfoBodyDivObj.length > 0) {
            var sInfoHeaderDivObj = pega.util.Dom.getElementsById("sInfoHeader", popOverContainerElem, "DIV");
            if (sInfoHeaderDivObj != null && sInfoHeaderDivObj.length > 0) {
                sInfoHeaderDivObj[0].style.width = sInfoBodyDivObj[0].offsetWidth + "px";
            }
            sInfoBodyDivObj[0].setAttribute("data-clickable", "-1");
        }
        _oPopOver = _popOver;
        // Set the focus to the appropriate tour button so user can navigate with enter key
        setTourContainterButtonFocus();
    };
    /*
     *  function setTourContainterButtonFocus
     *  Set focus to the appropriate tour button
     *  - if Next exists, focus on that
     *  - otherwise focus on Finish button
     *  - Set focus to the pop over button so user can <enter> though a tour without touching mouse.
     */
    var setTourContainterButtonFocus = function() {
            _log("setTourContainterButtonFocus", "called");
            // Set focus on the appropriate popup button
            // to allow users to "space bar" or "enter" there way through a tour
            // If we have a next button, set the focus to that.
            // If we don't then don't set focus for now
            if ($("[data-tour-id='pega-tourcontainer-button-next'] button").length > 0) {
                $("[data-tour-id='pega-tourcontainer-button-next'] button").focus();
            } else {
                // Focusing on X to close the tour when at the end.
                if ($("[data-tour-id='pega-tourcontainer-button-finish'] button").length > 0) {
                    $("[data-tour-id='pega-tourcontainer-button-finish'] button").focus();
                }
            }
        }
        /*
         *  function closePopOverDiv
         *  Close an existing pop over that is in the main window
         *  You should be calling findAndClosePopOver which will close the pop over
         *  regardless of current frame
         */
    var closePopOverDiv = function() {
            _log("closePopOverDiv", "called");
            if (_oPopOver) {
                _oPopOver.close("", "", true);
            }
        }
        /*
         *  function closePopOverDiv
         *  Wrapper function around closePopOverDiv that calls it in the correct frame or window
         */
    var findAndClosePopOver = function() {
            _log("findAndClosePopOver", "called");

      		try {
              if (oContextOfLastAction == null)
                  oContextOfLastAction = window;

              if (oContextOfLastAction === window) {
                  closePopOverDiv();
              } else {
                  if (oContextOfLastAction && oContextOfLastAction.pega.desktop.AutomationManager) {
                      oContextOfLastAction.pega.desktop.AutomationManager.closePopOver();
                  }
              }
            } catch(err) {
              // Sometimes IE throws a permission error when trying to access a window object that is no longer there
              // When this happens the popover should already be gone
            }
    }
        /*
         *  function showInfo
         *  Wrapper function around openPopOver
         *  - close existing pop over
         *  - scroll the element into view if off screen
         *  - get html to display from server
         *  - call openPopOver to do the actual display
         */
    var showInfo = function(oTargetElement, strSectioName) {
        _log("showInfo", "called");
        findAndClosePopOver();
      	var targetElemIsVisible = oTargetElement.is(':visible');
		_log("showInfo", "targetElemIsVisible: " + targetElemIsVisible);
      	var strURL = null;
        var targetElem = oTargetElement[0];
        // check visibility and scroll to it if necessary
      	var targetElementIsOnScreen = false;
      	if (targetElemIsVisible) {
        	targetElementIsOnScreen = isElementOnScreen(targetElem);
        }
      	_log("showInfo", "targetElementIsOnScreen: " + targetElementIsOnScreen);
        
        if (targetElemIsVisible && !targetElementIsOnScreen) {
            targetElem.scrollIntoView();
        }
        if (strSectioName != "") {
            strURL = SafeURL_createFromURL(pega.u.d.url);
            strURL.put("pyActivity", "ReloadSection");
            strURL.put("StreamName", strSectioName);
            strURL.put("StreamClass", "Rule-HTML-Section");
            if (pega.ui.onlyOnce) {
                var oOSafeUrl = SafeURL_createFromURL(pega.ui.onlyOnce.getAsPostString());
                strURL.copy(oOSafeUrl);
            }
        } else {
            strURL = "";
        }
        pega.u.d.fixBaseThreadTxnId(strURL);
        var onSuccess = function(responseObj) {
            _log("showInfo onSuccess", "called");
            isReqPending = false;
            var reponseText = responseObj.responseText;
            if (reponseText.indexOf("<table width='100%'>") != -1) reponseText = reponseText.replace(
                "<table width='100%'>", "<table>");
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = reponseText;
            openPopOver(targetElem, tempDiv.innerHTML);
        }
        var onFailure = function(responseObj) {
            _log("showInfo onFailure", "called");
            //show failure message
            isReqPending = false;
            var reponseText = responseObj.responseText;
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = reponseText;
            openPopOver(targetElem, tempDiv.innerHTML);
        };
        var abortRequest = function() {
            _log("showInfo abortRequest", "called");
            if (asyncReq) {
                if (isReqPending) {
                    pega.u.d.decrementAsyncRequestCount();
                }
                try {
                    // Aborting previous requests since they are on stale search terms
                    asyncReq.conn.abort();
                } catch (ex) {}
            }
        };
        var sendRequest = function() {
            _log("sendRequest", "called");
            if (isReqPending) {
                abortRequest();
            } else {
                isReqPending = true;
            }
            var callBack = {
                success: onSuccess,
                failure: onFailure
            };
            asyncReq = pega.u.d.asyncRequest('POST', strURL, callBack);
        }
        sendRequest();
    };
    /*
     *  function getPopoverFormat
     *  Gets the format for the pop over as defined in the tour rule
     */
    var getPopoverFormat = function() {
        _log("getPopoverFormat", "called");
        var oWin = pega.desktop.automation.support.getAutomationMainWindow();
        var sFormat = oWin.pega.desktop.AutomationManager.getPopoverFormat().trim();
        sFormat = sFormat.replace(" ", "_");
        if (sFormat == "") {
            sFormat = "Standard";
        }
        _log("getPopoverFormat", "complete");
        return sFormat.toLowerCase();
    };
    /*
     *  function beforePopoverClose
     *  Future - if we need to take actions before we close a pop over, this is where they will live
     */
    var beforePopoverClose = function() {
        return false;
    };
    /*
     *  function processActionInFrame
     */
    var processActionInFrame = function(sAction, oContext) {
        _log("processActionInFrame", "called");
        var oExecutionContext = null;
        try {
            if (oContext) {
                oExecutionContext = oContext.pega.desktop.AutomationManager;
            }
            if (sAction == "reset") {
		        _log("processActionInFrame", "action is reset...calling oExecutionContext.resetState()");
                oExecutionContext.resetState();
		        _log("processActionInFrame", "call to oExecutionContext.resetState() returned");
            }
        } catch (e) {
          _log("processActionInFrame", "exception e: " + e);
        }
    };
    /*
     *  function continueScript
     *  Try to continue a running script from where it was last left off.
     *  - if step provided, always start at that step
     *  - if we are not on the same script name as last time, start at the first step
     *  - if on same script and at the last step then start over at first step
     *  - otherwise display the "next" step from the previously displayed step.
     */
    var continueScript = function(oScript, sStep, sFrameID) {
            _log("continueScript", oScript.pzInsKey);
            // First, if we are passed a step, we must try to start there, so
            // we will just go through the normal processScript function
            if (sStep && sStep != "") {
                processScript(oScript, 0, sFrameID);
                return;
            }
            // Next, lets determine if we are continuing the previous script
            if (oAutomationScript && oScript.pzInsKey === oAutomationScript.pzInsKey) {
                // We are on the same script as the last time run
             	_log("continueScript", "We are processing the same script as the last run, see if we can continue");
                 if (oAutomationScript.pyActiveStepIdx + 1 === oAutomationScript.pySteps.length) {
                    // We were on the last step when we finished, start over
                    _log("continueScript", "We were on the last step, can't continue...start over");
                     processScript(oScript, 0, sFrameID);
                  } else {
                  	// We are not on last step, but we need to check if we have a displayable next step to display
                  	_log("continueScript", "We need to check if any step forward is displayable");
                  	var bHaveStepToNextTo = false;
                    var intIndexToDisplay = 0;
                    for (var nextI = oAutomationScript.pyActiveStepIdx + 1; nextI < oAutomationScript.pySteps.length; nextI++) {
          			  _log("continueScript", "Checking if step should be displayed - step number: " + nextI);
            		  if (shouldStepBeDisplayed(oAutomationScript.pySteps[nextI])) {
                	    _log("continueScript", "Found a step to display - step number: " + nextI);
                		bHaveStepToNextTo = true;
                        intIndexToDisplay = nextI;
                		break;
            		   }
                    }
                  	if (bHaveStepToNextTo) {
                      // We are go for "continue"
                      _log("continueScript", "We are going to processScript with sStep set to: " + intIndexToDisplay);
                      processScript(oScript, intIndexToDisplay, sFrameID);
                    } else {
                      _log("continueScript", "We had nothing displayable forward, so we will start over with processScript");
                      processScript(oScript, 0, sFrameID);
                    }
                 }  
            } else {
                // We are on a different script, just call processScript
             	_log("continueScript", "We are processing a different script, just run it from the start");
                processScript(oScript, 0, sFrameID);
            }
            _log("continueScript", "complete");
        }
        /*
         *  function processScript
         *  Start processing a tour
         *  - determine which step to start at (based on sStep param)
         *  - call processNextStep
         */
    var processScript = function(oScript, sStep, sFrameID) {
       	_log("processScript", "called");
        _log("processScript", oScript.pzInsKey);
        //sOriginatingFrameID = sFrameID;
        oAutomationScript = oScript;
        /* If sStep is provided, we need to determine if it is valid
         * when not valid, just start script at beginning
         *
         * sStep can be either the step number to start on, section name
         * or the header value. 
         */
        var iStepIndex = 0;
        if (typeof sStep !== "undefined") {
            if ($.isNumeric(sStep)) {
                // sStep is a number...lets see if it is a valid step for the
                // given tour.
                iStepIndex = sStep - 1;
                if (!(iStepIndex > -1 && iStepIndex < oAutomationScript.pySteps.length)) {
                    // Invalid step index, default to 0 to start script from beginning
                    iStepIndex = 0;
                }
            } else {
                // sStep was not a number
                // Since the order of steps can be easily changed, we will allow referencing
                // the step by Header Value or Section Name.
                for (var i = 0; i < oAutomationScript.pySteps.length; i++) {
                    if (sStep == oAutomationScript.pySteps[i].pyHeaderValue || sStep == oAutomationScript.pySteps[
                            i].pySectionName || sStep == oAutomationScript.pySteps[i].pyTarget) {
                        iStepIndex = i;
                        break;
                    }
                }
            }
        }
        oAutomationScript.pyActiveStepIdx = iStepIndex - 1; // decrement by 1 since we are processing "next" step
        _log("processScript", "Setting oAutomationScript.pyActiveStepIdx to: " + oAutomationScript.pyActiveStepIdx);
        oAutomationScript.pyActiveStepNumber = iStepIndex; // 1-based for pega UI
        _log("processScript", "Setting oAutomationScript.pyActiveStepNumber to: " + oAutomationScript.pyActiveStepNumber);
        oAutomationScript.pyNumberOfSteps = oAutomationScript.pySteps.length; 
        _log("processScript", "Setting oAutomationScript.pyNumberOfSteps to: " + oAutomationScript.pyNumberOfSteps);
      	_log("processScript", "Calling processNextStep()");
        processNextStep();
       	_log("processScript", "Call to processNextStep() is complete");
       	_log("processScript", "complete");
    };
    /*
     *   function processCleanupActions 
     *   If items are in the aCleanUpQ then call them to clean them up.
     */
    var processCleanupActions = function() {
        _log("processCleanupActions", "");
        var oCleanupStep = null;
        for (var i in aCleanUpQ) {
            oCleanupStep = aCleanUpQ.pop();
            processAction(oCleanupStep, true);
        }
    };
    /*
     *   function retrieveScript 
     *   Retrieve the tour script from the appropriate Rule-Automation-Tour instance
     */
    var retrieveScript = function(sToken, sClass, sStep, sFrameID) {
        _log("retrieveScript", "called");
        if (typeof sClass === "undefined" || sClass == "") {
            sClass = "@baseclass";
        }
        var strURL = null;
        strURL = SafeURL_createFromURL(pega.u.d.url);
        strURL.put("pyActivity", "pxGetTour");
        strURL.put("TourName", sToken);
        strURL.put("TourClass", sClass);
        if (pega.ui.onlyOnce) {
            var oOSafeUrl = SafeURL_createFromURL(pega.ui.onlyOnce.getAsPostString());
            strURL.copy(oOSafeUrl);
        }
        pega.u.d.fixBaseThreadTxnId(strURL);
        var abortRequest = function() {
            _log("retrieveScript", "abortRequest");
            if (asyncReq) {
                if (isReqPending) {
                    pega.u.d.decrementAsyncRequestCount();
                }
                try {
                    // Aborting previous requests since they are on stale search terms
                    asyncReq.conn.abort();
                } catch (ex) {}
            }
        };
        var onSuccess = function(responseObj) {
            _log("retrieveScript", "onSuccess");
            isReqPending = false;
            var response = pega.lang.JSON.parse(responseObj.responseText);
            if (typeof response.pzInsKey === "undefined" || response.pzInsKey === "") {
                // No tour found.
            } else {
                registerScriptObject(sToken, response);
            }
            if (oRegisteredScripts[sToken]) {
                async_ProcessScript(oRegisteredScripts[sToken], sStep, sFrameID);
            }
        }
        var onFailure = function(responseObj) {
            _log("retrieveScript", "onFailure");
            isReqPending = false;
        }
        var sendRequest = function() {
            _log("retrieveScript", "sendRequest");
            if (isReqPending) {
                abortRequest();
            } else {
                isReqPending = true;
            }
            var callBack = {
                success: onSuccess,
                failure: onFailure
            };
            asyncReq = pega.u.d.asyncRequest('POST', strURL, callBack);
        }
        sendRequest();
    };
    /* 
     * function updateAutomationManagerModel 
     * Update the D_pzAutomationTour clipboard page with details of script and 
     * where we are in it. This allows when conditions on the server to drive correct 
     * buttons to display (next, previous, finish) 
     */
    var updateAutomationManagerModel = function(oCallback) {
        _log("updateAutomationManagerModel", "called");
        var oPostData = new SafeURL();
        if (typeof oAutomationScript.pySteps === "undefined") return;
        oAutomationScript.pyShowNext = false;
        oAutomationScript.pyShowPrevious = false;
        _log("updateAutomationManagerModel", "oAutomationScript.pyActiveStepIdx: " + oAutomationScript.pyActiveStepIdx);
        //  Iterate from current step going forwards to find a step that is displayable
        //  if we find one, set the pyShowNext to true which will enable the Next button in the tour container
        for (var nextI = oAutomationScript.pyActiveStepIdx + 1; nextI < oAutomationScript.pySteps.length; nextI++) {
          	_log("updateAutomationManagerModel", "Checking if step should be displayed - step number: " + nextI);
            if (shouldStepBeDisplayed(oAutomationScript.pySteps[nextI])) {
                _log("updateAutomationManagerModel", "pyShowNext set to true because of step: " + nextI);
                oAutomationScript.pyShowNext = true;
                break;
            }
        }
        //  Iterate from current step going backwards to find a step that is displayable
        //  if we find one, set the pyShowPrevious to true which will enable the Previous button in the tour container
        for (var prevI = oAutomationScript.pyActiveStepIdx - 1; prevI >= 0; prevI--) {
            if (shouldStepBeDisplayed(oAutomationScript.pySteps[prevI])) {
                _log("updateAutomationManagerModel", "pyShowPrevious set to true because of step: " + prevI);
                oAutomationScript.pyShowPrevious = true;
                break;
            }
        }
      
        oAutomationScript.pyActiveStepNumber = oAutomationScript.pyActiveStepIdx + 1;
        oPostData.put("AutomationStateJSON", pega.lang.JSON.stringify(oAutomationScript));
        var strURL = null;
        strURL = SafeURL_createFromURL(pega.u.d.url);
        strURL.put("pyActivity", "pzUpdateAutomationRuntimeClipboard");
        strURL.put("pzPrimaryPageName", "D_pzAutomationTour");
        if (pega.ui.onlyOnce) {
            var oOSafeUrl = SafeURL_createFromURL(pega.ui.onlyOnce.getAsPostString());
            strURL.copy(oOSafeUrl);
        }
        pega.u.d.fixBaseThreadTxnId(strURL);
        try {
            pega.u.d.asyncRequest('POST', strURL, oCallback, oPostData);
        } catch (e) {
            _log("updateAutomationManagerModel try/catch failed: ", e);
        }
    };
    /*
     *   function dismissScript 
     *   Perform clean up actions when a user closes a script
     */
    var dismissScript = function() {
        _log("dismissScript", "called");
        _log("dismissScript", "oContextOfLastAction: " + oContextOfLastAction);
        if (! (oContextOfLastAction === window) ) {
	        _log("dismissScript", "processActionInFrame being called with reset");
            processActionInFrame("reset", oContextOfLastAction);
	        _log("dismissScript", "processActionInFrame returned");
        }
        // Click on the right (main) panel to make left hidden when it should be (hamburger icon)
        $("#screen-layout-mask").click();
        // clear out internal state 
      	_log("dismissScript", "before call to resetState()");
        resetState();
      	_log("dismissScript", "after call to resetState()");
        /* inform the server of the new state */
        //updateAutomationManagerModel();
      	_log("dismissScript", "dismissScript ending");
    };
    /*
     *   function resetState 
     *   Reset the script state and close the pop over
     */
    var resetState = function() {
        _log("resetState", "called");
        //ensure the that the clean up actions are processed
        processCleanupActions();
        //reset state variables
        iActivePreprocessActionIdx = -1;
        sActiveScriptKey = "";
        findAndClosePopOver();
      
      	// Stop listening for a window resize
      	pega.desktop.AutomationManager.TourResizeManager.stopListeningForWindowResize();
    };
    /*
     *   function registerScriptObject 
     *   Adds the script to the array of scripts we have already
     *   retrieved from the server
     */
    var registerScriptObject = function(sToken, oJSON) {
        _log("registerScriptObject", "called");
        oRegisteredScripts[sToken] = oJSON;
    };
    /*
     *   Public functions
     */
    return {
        /*
         *   function findElement 
         *   Returns jquery result finding elements mathing cssSelector
         */
        findElement: function(cssSelector) {
            return findElement(cssSelector);
        },
        /*
         *   function isElementOnScreen 
         *   Returns true if given element is on screen and we can anchor a tour stop to it
         */
        isElementOnScreen: function(elem) {
            return isElementOnScreen(elem);
        },
        /*
         *   function dismiss 
         *   Closes the pop over and ends the tour
         */
        dismiss: function() {
            _log('dismiss', 'called');
            dismissScript();
        },
        /*
         *   function resetState 
         *   Resets the tour engine so if a user "continues" it will start at beginning
         */
        resetState: function() {
            _log("reset", "called");
            resetState();
        },
        /*
         *   function next 
         *   Display the next tour step
         */
        next: function() {
            _log("next", "called");
            async_ProcessNextStep();
        },
        eventNotified: function() {
            _log("eventNotified", "called");
            alert("eventNotified");
        },
        /*
         *   function previous 
         *   Display the previous tour step
         */
        previous: function() {
            _log("previous", "called");
            async_ProcessPreviousStep();
        },
        /*
         *   function startTour
         *   Start a tour at the beginning
         */
        startTour: function(sToken, sClass, sStep, sFrameID, sContainer) {
            _log("startTour", "called");
          	pega.desktop.AutomationManager.TourResizeManager.startListeningForWindowResize();
            setTourStopContainer(sContainer);
            if (oRegisteredScripts[sToken] && oRegisteredScripts[sToken].pyClassName === sClass) {
                async_ProcessScript(oRegisteredScripts[sToken], sStep, sFrameID);
            } else {
                retrieveScript(sToken, sClass, sStep, sFrameID);
            }
            return true;
        },
        /*
         *   function continueTour 
         *   Start a tour at the previous step or at beginning if 
         *   either you were at the last step or are processing a different script
         */
        continueTour: function(sToken, sClass, sStep, sFrameID, sContainer) {
            _log("continueTour (public)", "called");
          	pega.desktop.AutomationManager.TourResizeManager.startListeningForWindowResize();
            setTourStopContainer(sContainer);
            if (oRegisteredScripts[sToken] && oRegisteredScripts[sToken].pyClassName === sClass) {
   	            _log("continueTour (public)", "class name of script matches last run, calling async_ContinueScript");
                async_ContinueScript(oRegisteredScripts[sToken], sStep, sFrameID);
            } else {
   	            _log("continueTour (public)", "class name of script does not match last run, calling retrieveScript");
                retrieveScript(sToken, sClass, sStep, sFrameID);
            }
            _log("continueTour (public)", "complete");
        },
        /*
         *   function registerTour 
         *   Add a tour to the list of registered tours (oRegisteredScripts) 
         */
        registerTour: function(sToken, oJSON) {
            _log("registerTour", "called");
            registerScriptObject(sToken, oJSON);
        },
        /*
         *   function showInfoOnElement 
         *   Display the pop over
         *   In the public functions as when the pop over is in a frame, the top level
         *   automation manager needs to call this in the correct context                
         */
        showInfoOnElement: function(oTarget, sDisplaySection) {
            _log("showInfoOnElement", "called");
            showInfo(oTarget, sDisplaySection);
        },
        /*
         *
         *
         */
        getPopoverFormat: function() {
            _log("getPopoverFormat", "called");
            return oAutomationScript.pyFormat;
        },
        /*
         *   function closePopOver 
         *   Close the pop over 
         */
        closePopOver: function() {
            _log("closePopOver", "called");
            closePopOverDiv();
        },
        /*
         *   function listTours 
         *   Returns a list of registered tours.  Useful for debugging in the browser console.
         */
        listTours: function() {
            _log("listTours", "called");
            var strScriptList = "";
            var key;
            for (key in oRegisteredScripts) {
                if (oRegisteredScripts.hasOwnProperty(key)) strScriptList = strScriptList + key + ", ";
            }
            return strScriptList;
        },
        /*
         *   function clearRegistered tours
         *   Returns a list of registered tours.  Useful for debugging in the browser console.
         */
        clearRegisteredTours: function() {
            oRegisteredScripts = {};
        },
        /*
         *   function countTours 
         *   Returns a count of registered tours.  Useful for debugging in the browser console.
         */
        countTours: function() {
            _log("countTours", "called");
            var size = 0;
            var key;
            for (key in oRegisteredScripts) {
                if (oRegisteredScripts.hasOwnProperty(key)) size++;
            }
            return size;
        },
        /*
         *   function automationWindowResize 
         *   Redisplays the pop over currently visible.  Used primarily when the browser window 
         *   changes size or orientation
         */
        automationWindowResize: function() {
            _log("automationWindowResize", "called");
          	if (typeof jQuery !== 'undefined') {
            	$(window).promise().done(async_ProcessSameStep());
            }
        },
        /*
         *   function enableLogging
         *   Enables the logging of debug infomation to the browser console
         */
        enableLogging: function() {
            isLogEnabled = true;
            console.log("desktop.AutomationManger browser console logging is enabled");
        },
        /*
         *   function disableLogging
         *   Disable the logging of debug infomation to the browser console
         */
        disableLogging: function() {
            isLogEnabled = false;
            console.log("desktop.AutomationManger browser console logging is disabled");
        },
        getElem: getPotentialElements
    }
})();
/*
 *	Pre condition processer
 *	Used to determine if a step passes its prereq requiements for display
 */
pega.desktop.AutomationManager.preConditionProcessor = (function() {
    var isFieldNotVisible = function(cssSelector) {
        return !isFieldVisible(cssSelector);
    }
    var isFieldVisible = function(cssSelector) {
        var oElemSearch = pega.desktop.AutomationManager.findElement(cssSelector);
        if (!oElemSearch.bSuccess) return false;
        $Target = oElemSearch.$TargetElement;
        var targetElementIsVisible = $Target.is(':visible');
        var targetElementIsHidden = $Target.is(':hidden');
        if (!targetElementIsVisible || targetElementIsHidden) {
            return false;
        } else {
            var domElement = $Target.get(0);
            var targetElementIsOnScreen = pega.desktop.AutomationManager.isElementOnScreen(domElement);
            return targetElementIsOnScreen;
        }
    }
    var publicAPI = {};
    publicAPI.shouldStepBeSkipped = function(oStep) {
        return !shouldStepBeDisplayed;
    }
    publicAPI.shouldStepBeDisplayed = function(oStep) {      	
        // Assuming we are only dealing with preconditions now, if pyPreconditions doesn't exist return true
        // so that we continue processing
      	
      	// temporarily the tour stop invisible in case it is covering the element we are looking for
      
        if($(".smartInfoContainer").length>0){                
        	$(".smartInfoContainer")[0].style.visibility='hidden' ;
        }
      
        if (typeof oStep == "undefined" || typeof oStep.pyPreconditions == "undefined" || oStep.pyPreconditions[
                0] == null) return true;
        var boolReturnValue = true;
        var condition = oStep.pyPreconditions[0];
        switch (condition.pyConditionType) {
            case 'always':
                break;
            case 'isTourStopVisible':
                boolReturnValue = isFieldVisible(oStep.pyTarget);
                //boolReturnValue = isFieldNotVisible(oStep.pyTarget);
                break;
            case 'isFieldNotVisible':
                boolReturnValue = isFieldNotVisible(condition.pyTarget);
                break;
            case 'isFieldVisible':
                boolReturnValue = isFieldVisible(condition.pyTarget);
                break;
            default:
                _log("stepConditionProcessor", "pyConditionType invalid: " + condition.pyConditionType);
        }
      	//making the the tour stop visible again      	
      	if($(".smartInfoContainer").length>0){            		
        	$(".smartInfoContainer")[0].style.visibility='visible';
        }
        return boolReturnValue;
    }
    return publicAPI;
})();

/*
 *	Tour resize manager
 *	Used to start listening for window resizes so we can redraw the tour popup
 *	
 *	The startTour and continueTour methods will start the listening process
 *	The resetState method will stop listening
 */
pega.desktop.AutomationManager.TourResizeManager = (function() {
    
    var publicAPI = {};
    var boolResizeEventAttachedToWindow = false;

  	/*
     *	Are we currently listening for a window resize?
     */
    publicAPI.isListeningForWindowResize = function() {
        return boolResizeEventAttachedToWindow;
    }

  	/*
     *	The method we attach to the window resize event
     */
    publicAPI.redrawTourPopupOnWindowResize = function() {
      var automationSizeTimeoutId;
      var oWin = pega.desktop.automation.support.getAutomationMainWindow();
      if (oWin) {
        clearTimeout(automationSizeTimeoutId);
        automationSizeTimeoutId = setTimeout(pega.desktop.AutomationManager.automationWindowResize, 200);
      }
    }
    
  	/*
     *	Start the listening process 
     */
    publicAPI.startListeningForWindowResize = function() {
      	//console.log("startListeningForWindowResize called");
		if (!this.isListeningForWindowResize()) {     
          pega.util.Event.addListener(window, 'resize', pega.desktop.AutomationManager.TourResizeManager.redrawTourPopupOnWindowResize);
          boolResizeEventAttachedToWindow = true;
        }
    }
    
  	/*
     *	Stop the lsitening process
     */
    publicAPI.stopListeningForWindowResize = function() {
      	//console.log("stopListeningForWindowResize called");
    	pega.util.Event.removeListener(window, 'resize', pega.desktop.AutomationManager.TourResizeManager.redrawTourPopupOnWindowResize);
      	boolResizeEventAttachedToWindow = false;
    }

    return publicAPI;

})();
//static-content-hash-trigger-YUI
pega.namespace("pega.desktop.automation.support");

<!-- Start a tour -->
pega.desktop.automation.support.startTour = function( sTour, sClass, sStep, sTourContainer ) {
  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  var oFrameID = null;
  if ( frameElement ) oFrameID = frameElement.id;
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.startTour ( sTour, sClass, sStep, oFrameID, sTourContainer );  
  }

}

<!-- Continue a tour -->
pega.desktop.automation.support.continueTour = function( sTour, sClass, sStep, sTourContainer ) {	
  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  var oFrameID = null;
  if ( frameElement ) oFrameID = frameElement.id;
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.continueTour ( sTour, sClass, sStep, oFrameID, sTourContainer );  
  }

}

<!-- Dismiss a tour -->
pega.desktop.automation.support.dismissTour = function() {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.dismiss();     
  }

}

<!-- Navigate to the next step in the tour -->
pega.desktop.automation.support.nextStep = function() {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.next();     
  }

}

<!-- Navigate to the previous step in the tour -->
pega.desktop.automation.support.previousStep = function() {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.previous();     
  }

}

<!-- Displays list of registered tours (For debugging purposes) -->
pega.desktop.automation.support.listTours = function( boolAlert ) {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  
  if ( oWin ) {
      var strList = oWin.pega.desktop.AutomationManager.listTours();     
      if (boolAlert) {
           alert(strList);
      } else {
           return strList;
      }
  }

}

<!-- Displays count of registered tours (For debugging purposes) -->
pega.desktop.automation.support.countTours = function( boolAlert ) {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  if ( oWin ) {
      var strCount = oWin.pega.desktop.AutomationManager.countTours();
      if (boolAlert) {
           alert(strCount);
      } else {
           return strCount;
      }
  }
  
}

<!-- Enables the logging of debug infomation to the browser console -->
pega.desktop.automation.support.enableLogging = function() {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.enableLogging();
  }

}

<!-- Disable the logging of debug infomation to the browser console -->
pega.desktop.automation.support.disableLogging = function() {

  var oWin = pega.desktop.automation.support.getAutomationMainWindow();
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.disableLogging();
  }
  
}

<!-- Directly register a tour json object  -- useful for debugging -->
pega.desktop.automation.support.registerTour = function(sToken, oJSON) {

  var oWin = pega.desktop.AutomationManager.registerTour(sToken, oJSON);
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.registerTour(sToken, oJSON);
  }
  
}

<!-- Directlt clear registered tours -- useful for debugging -->
pega.desktop.automation.support.clearRegisteredTours = function() {

  var oWin = pega.desktop.AutomationManager.clearRegisteredTours();
  if ( oWin ) {
      oWin.pega.desktop.AutomationManager.clearRegisteredTours();
  }
  
}
pega.desktop.automation.support.getAutomationMainWindow = function () {
  var oWin = pega.desktop.support.getDesktopWindow();
  return oWin;
};
//static-content-hash-trigger-YUI