/* Function used to highlight the first menu on load - since the menu is defer loaded, need to try until it is present in the DOM */
function setActiveMenuOnLoad() {
  var elems = $(".menu-format-primary-navigation > li");
  if (elems.length > 0) {
    elems.first().addClass("menu-item-active");
  } else {
    setTimeout(setActiveMenuOnLoad, 300);
  }
}
$(document).ready(function() {
  $(window).scroll(function() {
    var y = $(window).scrollTop();
    if (y > 0) {
      $("body").addClass("scrolling");
    } else {
      $("body").removeClass("scrolling");
    }
  });
  setActiveMenuOnLoad();
});

/* this will be called from interaction context to toggle others*/
function setWorkAreaFullWidth() {

    var dcwrapper = $(".dc-wrapper");
    var chatWrapper = $(".chat-wrapper");
    var inboundWrapper = $(".inbound-wrapper");
    var socialWrapper = $(".social-wrapper");
  
    if (dcwrapper.length && chatWrapper.length) {
        $(dcwrapper[0]).css("width", "100%");
        $(chatWrapper[0]).css("display", "none");
        $(inboundWrapper[0]).css("display", "none");
        $(socialWrapper[0]).css("display", "none");
        $("#workarea").height($("body").height() - $("header").height());
        pega.u.d.resizeHarness();
    }
}
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
