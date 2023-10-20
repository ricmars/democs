/***************************** MDC INITIALIZATION LOGIC *****************************/
pega = pega || {};
pega.ui = pega.ui || {};
(function () {
    pega.namespace('ui.MDCUtil');
    pega.ui.MDCUtil = {};
    var MDC_ACTION = "MDCAction";
    var isAttached = false;
    var initialize = function () {
        if (!isAttached) {
            isAttached = true;
        }
        if (document.querySelector("div[data-mdc-id]")) {
            pega.ui.hasAjaxContainer = true;
        }
        pega.ui.EventsEmitter.subscribe(MDC_ACTION, onMicroDCAction, null, null, null, true); //register only once
    };
    /**
       * @method onMicroDCAction
       * @param {Object} actiondata
       *
       * Handler function for "MDCAction" event which eventually dispatches a redux action.
       */
    var onMicroDCAction = function (actiondata) {
        try {
            // onMDCAction will be deprecated in future.
            pega.ui.EventsEmitter.publishSync("onMDCAction");
            pega.ui.EventsEmitter.publishSync("onACAction");
        }
        catch (e) { }
        var task = actiondata.get("api").toLowerCase();
        switch (task) {
            case "opensection":
                actiondata.put("api", "openSection");
                actiondata.put("action", "openSection");
                break;
            case "display":
            case "showharness":
                actiondata.put("api", "display");
                actiondata.put("action", "display");
                if (pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
                    var accessFromServer = actiondata.get("accessFromServer");
                    if (accessFromServer === "true") {
                        pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
                    }
                    else {
                        pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.LOCAL);
                    }
                }
                break;
            case "openbyassignment":
                actiondata.put("api", "openAssignment");
                actiondata.put("action", "openAssignment");
                break;
            case "enternewworkfromflow":
            case "enternewwork":
                actiondata.put("api", "createNewWork");
                actiondata.put("action", "createNewWork");
                break;
            case "openbyworkhandle":
                actiondata.put("key", actiondata.get("param"));
                actiondata.put("api", "openWorkByHandle");
                actiondata.put("action", "openWorkByHandle");
                actiondata.remove("param");
                break;
            case "openbyworkitem":
                actiondata.put("api", "openWorkItem");
                actiondata.put("action", "openWorkItem");
                break;
            case "openlanding":
                actiondata.put("api", actiondata.get("api"));
                actiondata.put("action", actiondata.get("Action"));
                var oActionParams = actiondata.get("ActionParams");
                actiondata.remove("ActionParams");
                var strLandingName = actiondata.get("Name");
                var navigationParams = actiondata.get("Navigation");
                actiondata.remove("Navigation");
                if (strLandingName) {
                    actiondata.put("label", strLandingName);
                }
                for (var i in oActionParams) {
                    if (oActionParams[i]) {
                        actiondata.put(i, oActionParams[i]);
                    }
                }
                for (var i in navigationParams) {
                    if (navigationParams[i]) {
                        actiondata.put(i, navigationParams[i]);
                    }
                }
                break;
        }
        var handler = {
            online: pega.u.d.UIActionRouter.onlineHandler,
            offline: pega.u.d.UIActionRouter.offlineHandler,
            scope: this
        };
        pega.u.d.ServerProxy.doAction(actiondata, null, handler, null);
        return true;
    };
    if (pega.u.d.gIsScriptsLoading) {
        pega.u.d.attachOnload(function () {
            isAttached = true;
            initialize();
        }, true);
    }
    else {
        pega.u.d.attachOnload(function () {
            initialize();
        }, true);
    }
    pega.ui.DCUtil = pega.ui.DCUtil || new function () {
        this.setActiveDocumentType = function () { };
    };
})();
/***************************** MDC RENDER MECHANISM *****************************/
(function () {
    var getParentThreadName = function () {
        var parentThreadName = pega.u.d.getThreadName();
        var currThreadName = pega.redux.Utils.getThreadNameFromAcName(pega.ctx.mdcName);
        if (currThreadName && parentThreadName.indexOf(currThreadName + "_") !== -1) {
            return parentThreadName.slice(0, parentThreadName.indexOf("/" + currThreadName + "_"));
        }
        return parentThreadName;
    };
    var getActiveACDoc = function (mdcTarget) {
        var nextIndex;
        var currentACState = pega.redux.Utils.getAjaxContainerState(mdcTarget);
        if (!currentACState) {
            return mdcTarget + "_0";
        }
        var unUsedDocs = currentACState.unUsedDocs.slice();
        if (unUsedDocs.length > 0) {
            nextIndex = unUsedDocs.slice(-1)[0];
        }
        else {
            nextIndex = currentACState.activeDocs.length;
        }
        return mdcTarget + "_" + nextIndex;
    };
    var finalizeNavURL = function (metaObject) {
        var mdcName = metaObject.mdcTarget;
        var currentThread = pega.u.d.getThreadName();
        var harCtxMgr = pega.ui.HarnessContextMgr;
        var parentThreadName = getParentThreadName();
        var mdcThreadName = metaObject.recordId || mdcName;
        // Thread names are in upper case E.g.: ACPRIMARY_0
        mdcThreadName = mdcThreadName.toUpperCase();
        //pega.u.d.switchThread(currentThread+"/"+mdcName);
        var currentURL = harCtxMgr.get('url');
        currentURL = currentURL.replace(/!.*\?/, "!" + parentThreadName + "/" + mdcThreadName + "?");
        var metaValue, oURL = new SafeURL_createFromEncryptedURL(currentURL), portalThread;
        //var oUrl = pega.ctx.url;
        if (metaObject.pyThreadName && metaObject.pyThreadName != "" && metaObject.api == "openSection") {
            //oUrl = metaObject.pyThreadId
            context = pega.ctxmgr.getContextByThreadName(metaObject.pyThreadName);
            pega.ctxmgr.setContext(context);
        }
        var metadata = new SafeURL_createFromEncryptedURL(pega.ctx.url);
        if (metaObject.api == "openSection") {
            for (var key in metaObject) {
                metadata.put(key, metaObject[key]);
            }
            metadata.put("isMDC", "true");
            metadata.put("parentThreadName", parentThreadName);
            metadata.put("portalThread", pega.u.d.getPortalThreadName());
            metadata.put("portalName", harCtxMgr.get('portalName'));
            metadata.put("mdcRecordId", metaObject.recordId);
            var tabIndex = metaObject.tabIndex || pega.redux.Utils.getAjaxContainerState(metaObject.mdcTarget).mdcDocs.length;
            metadata.put("tabIndex", tabIndex);
            return metadata;
        }
        oURL.remove('pzPrimaryPageName');
        oURL.remove('AJAXTrackID');
        oURL.remove('pzTransactionId');
        oURL.remove('pzFromFrame');
        oURL.put("pyActivity", "@baseclass.doUIAction");
        var action = metaObject.action.toLowerCase();
        if (metaObject.landingAction && metaObject.landingAction == "openlanding") {
            oURL.put("landingAction", action);
        }
        else if (action.toLowerCase() != "openworkbyurl") {
            oURL.put("action", action);
        }
        for (var key in metaObject) {
            metaValue = metaObject[key];
            if (metaValue == "" || metaValue == undefined || key == "pxReqURI") {
                metaObject[key] = "";
                continue;
            }
            oURL.put(key, metaValue);
        }
        oURL.put("portalName", harCtxMgr.get('portalName'));
        oURL.put("portalThreadName", pega.u.d.getPortalThreadName());
        oURL.put("parentThreadName", parentThreadName);
        oURL.put("mdcRecordId", metaObject.recordId);
        var tabIndex = metaObject.tabIndex || pega.redux.Utils.getAjaxContainerState(mdcName).mdcDocs.length;
        oURL.put("tabIndex", tabIndex);
        //oURL.put("skipDCDataModelUpdation", "true");
        oURL.put("isMDC", "true");
        if (harCtxMgr.get('bIsDCSPA')) {
            oURL.put("pyIsSPA", "true");
        }
        return oURL;
    };
    function microDCRender(actionMetadata, postData, unloadCurrent) {
        /* This will be invoked for the first time for building container for static section */
        var mdcContainer = document.querySelector("div[data-mdc-recordid='" + actionMetadata.recordId + "']");
        var currentState = pega.redux.Utils.getAjaxContainerState(actionMetadata.mdcTarget);
        var isTabbedMDC = typeof currentState.isTabbedMDC == "boolean" && currentState.isTabbedMDC;
        if (actionMetadata.action === "static") {
            if (!mdcContainer) {
                console.error("NODE Not Added For Static Content");
            }
            var wrapperSec = document.querySelector("[data-static-section]");
            if (!wrapperSec) {
                console.error("Static Content wrapper section not exists on the DOM");
            }
            /*In Case Non-Auto section multiple child nodes can exist */
            var staticDOMNodes = Array.prototype.slice.call(wrapperSec.childNodes);
            /* MDC Tabs */
            if (mdcContainer && isTabbedMDC) {
                pega.ui.Tabs.handleStaticTab(wrapperSec, staticDOMNodes, mdcContainer);
            }
            else {
                for (var i = 0; i < staticDOMNodes.length; i++) {
                    mdcContainer.appendChild(staticDOMNodes[i]);
                }
            }
            /** TASK-894778: Adding static tab to change tracker **/
            if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal() && actionMetadata.recordId) {
                pega.ui.ChangeTrackerMap.addTracker("STANDARD/" + actionMetadata.recordId.toUpperCase(), new pega.ui.ChangeTracker());
                if (actionMetadata.isHarnessInclude === "true") {
                    pega.u.d.switchThread("STANDARD/" + actionMetadata.recordId.toUpperCase());
                }
            }
            wrapperSec.parentNode.removeChild(wrapperSec);
            return;
        }
        else if (mdcContainer && isTabbedMDC) {
            var containerId = actionMetadata.mdcTarget || actionMetadata.pyACName;
            var mdcTabContainer = document.querySelector("div[data-mdc-id='" + containerId + "']");
            /* Call handleMdcTabs for actions */
            var actionName = actionMetadata.action;
            switch (actionName) {
                case 'displayOnPage':
                case 'openWorkByHandle':
                case 'openAssignment':
                    actionMetadata.tabName = actionMetadata.recordKey && actionMetadata.recordKey.split(" ").pop(-1);
                    pega.ui.Tabs.handleMdcTabs(actionMetadata, mdcTabContainer);
                    break;
                case 'display':
                    if ((actionMetadata.isStatic && actionMetadata.isStatic == "true") || (actionMetadata.loadStatus &&
                        actionMetadata.loadStatus == "deferred")) {
                        /* handling static tab name after opening a non static tab and refresh */
                        var dashBoardInfoJSON = JSON.parse(mdcTabContainer.getAttribute("data-mdc-dashboardinfo"));
                        var shortDescriptionSec = dashBoardInfoJSON && dashBoardInfoJSON.shortDescription ?
                            dashBoardInfoJSON.shortDescription : '';
                        pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setTabName(shortDescriptionSec, containerId);
                        break;
                    }
                case 'openSection':
                case 'Display':
                case 'createNewWork':
                case 'getnextwork':
                    pega.ui.Tabs.handleMdcTabs(actionMetadata, mdcTabContainer);
                    break;
                case 'openWorkItem':
                    actionMetadata.tabName = actionMetadata.workID;
                    pega.ui.Tabs.handleMdcTabs(actionMetadata, mdcTabContainer);
                    break;
                default:
                    // statements_def
                    break;
            }
        }
        var harCtxMgr = pega.ui.HarnessContextMgr;
        var currentURL = harCtxMgr.get("url");
        var parentThreadName = getParentThreadName();
        var serverURL, mdcName;
        if (typeof actionMetadata == "object" && actionMetadata.name == "safeURL") {
            serverURL = actionMetadata;
            serverURL.put("isMDC", "true");
            mdcName = harCtxMgr.get("mdcName");
            serverURL.put("mdcTarget", mdcName);
            // if mdc action is triggered from mdc (or)
            // if mdc submit case
            if (pega.ctx.recordId) {
                serverURL.put("recordId", pega.ctx.recordId);
                actionMetadata.recordId = pega.ctx.recordId;
            }
            /**
             US-316101: Extracting harnessName and className, which are required parameters for fetching harness from client store.
            **/
            if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal()) {
                actionMetadata.harnessName = actionMetadata.get("harnessName");
                actionMetadata.className = actionMetadata.get("className");
                actionMetadata.callback = actionMetadata.get("callback");
                actionMetadata.mdcTarget = actionMetadata.get("mdcTarget");
            }
        }
        else {
            serverURL = finalizeNavURL(actionMetadata);
            mdcName = serverURL.get("mdcTarget");
        }
        var mdcRecordId = actionMetadata.recordId;
        var callBack = {};
        var getDummyDiv = function (res) {
            var dummyDiv = document.createElement("div");
            dummyDiv.innerHTML = res;
            return dummyDiv;
        };
        var getMDCContainer = function () {
            var mdcContainer = document.querySelector("div[data-mdc-recordid='" + mdcRecordId + "']");
            if (!mdcContainer) {
                mdcContainer = document.querySelector("div[data-mdc-id='" + mdcName + "']");
            }
            return mdcContainer;
        };
        var switchToMDCContext = function (mdcContainer) {
            var _currentHarnessCtx;
            // To execute repaint in the correct context.
            if (mdcContainer && mdcContainer.getAttribute("data-harness-id")) {
                _currentHarnessCtx = pega.ctx;
                var harnessContextMap = pega.ctxmgr.getHarnessContextMap();
                var harnessId = mdcContainer.getAttribute("data-harness-id");
                pega.ctxmgr.setContext(harnessContextMap[harnessId]);
            }
            return _currentHarnessCtx;
        };
        var rePaint = function (contentToRepaint) {
            //get MDC container
            var mdcContainer = getMDCContainer();
            if (mdcContainer) {
                /* SE-57437 - Start */
                if (mdcContainer.parentNode) {
                    var currentAciveAC = mdcContainer.parentNode.querySelector("[data-mdc-recordid].show");
                    if (currentAciveAC)
                        pega.ui.EventsEmitter.publishSync("onACHide", { "recordDIV": currentAciveAC });
                }
                /* SE-57437 - End */
                //pega.u.d.cleanUpHarnessElements(null,[mdcContainer]);
                pega.u.d.loadDOMObject(mdcContainer, contentToRepaint, function () {
                    var _currentHarnessCtx = switchToMDCContext(mdcContainer);
                    pega.u.d.loadHTMLEleCallback(mdcContainer, true);
                    if (actionMetadata.api == null || actionMetadata.action == "getnextwork" || (actionMetadata.action == "createNewWork" && pega.ctx.strHarnessMode ==
                        "ACTION")) {
                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.UPDATE, actionMetadata));
                        var currentState = pega.redux.Utils.getAjaxContainerState(actionMetadata.mdcTarget);
                        if (currentState && currentState.actionObj && currentState.actionObj.closingOnRefresh) {
                            if (!currentState.actionObj.recordId) {
                                var activeDocs = currentState.activeDocs;
                                /* TODO: Need to go through below commented code */
                                /*let sortedArray = activeDocs.slice();
                                              let activeTab = activeDocs[activeDocs.length - 1];
                                              sortedArray.sort();
                                              let keyToClose = sortedArray.indexOf(activeTab);
                                              let toCloseMDCDoc = currentState.mdcDocs[keyToClose];
                                              */
                                var keyToClose = activeDocs[activeDocs.length - 1];
                                var lastActiveIndex = activeDocs[activeDocs.length - 1];
                                var tabIndex;
                                for (var i = 0; i < state.mdcDocs.length; ++i) {
                                    var currRecord = state.mdcDocs[i].recordId;
                                    var currIndex = parseInt(currRecord.split("_")[1]);
                                    if (currIndex === lastActiveIndex) {
                                        tabIndex = i;
                                        break;
                                    }
                                }
                                var toCloseMDCDoc_1 = currentState.mdcDocs[keyToClose];
                                currentState.actionObj.recordId = toCloseMDCDoc_1.recordId;
                            }
                            var oSafeURL = new SafeURL();
                            oSafeURL.put("pyActivity", "DoClose");
                            oSafeURL.put("isMDC", true);
                            oSafeURL.put("recordId", currentState.actionObj.recordId);
                            pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSE, oSafeURL));
                        }
                        else {
                            var mdcs = currentState.mdcDocs;
                            var prevMDCs = mdcs.length - 1;
                            var updatedHandle = pega.u.d.getHandle();
                            for (var i = 0; i < prevMDCs; i++) {
                                if (mdcs[i].recordKey == updatedHandle && mdcs[i].recordId != actionMetadata
                                    .recordId) {
                                    var toCloseMDCDoc = mdcs[i];
                                    var toKeepMDCDoc = actionMetadata;
                                    var oSafeURL = new SafeURL();
                                    oSafeURL.put("pyActivity", "DoClose");
                                    if (pega.ui.ChangeTrackerMap.getTracker().id) {
                                        oSafeURL.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
                                    }
                                    oSafeURL.put("isMDC", true);
                                    var isClosingDocDirty = pega.u.d.isContainerDirty(document.querySelector("div[data-mdc-recordid=" + toCloseMDCDoc.recordId + "]"));
                                    if (isClosingDocDirty) {
                                        var temp = toCloseMDCDoc;
                                        toCloseMDCDoc = toKeepMDCDoc;
                                        toKeepMDCDoc = temp;
                                    }
                                    oSafeURL.put("recordId", toCloseMDCDoc.recordId);
                                    if (isClosingDocDirty) {
                                        oSafeURL.put("closeDocCallback", function () {
                                            pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes
                                                .SWITCH, toKeepMDCDoc));
                                        });
                                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSE, oSafeURL));
                                    }
                                    else {
                                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, toCloseMDCDoc));
                                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSE, oSafeURL));
                                    }
                                    break;
                                }
                            }
                        }
                        var tabbedACName = function (actionMetadata) {
                            var mdcContName = actionMetadata.mdcTarget ? actionMetadata.mdcTarget : ACNAMEPREFIX + DEFAULTACNAME;
                            //TODO: hardcoded for primary secondry case need to handle
                            var currentState = pega.redux.Utils.getAjaxContainerState(mdcContName);
                            if (currentState && currentState.activeDocs) {
                                var activeDocs = currentState.activeDocs;
                                var keyToActivate = activeDocs[activeDocs.length - 1];
                                var activeRecordId = void 0, recordKey = void 0, activeMDCDoc = void 0;
                                for (var i = 0; i < currentState.mdcDocs.length; ++i) {
                                    var currRecord = currentState.mdcDocs[i].recordId;
                                    var currRecordKey = currentState.mdcDocs[i].recordKey;
                                    var currIndex = parseInt(currRecord.split("_")[1]);
                                    if (currIndex === keyToActivate) {
                                        activeMDCDoc = currentState.mdcDocs[i];
                                        break;
                                    }
                                }
                            }
                            if (activeMDCDoc.action == "createNewWork" && pega.ctx.strPyID != "" && pega.ctx.isMDC) {
                                activeMDCDoc.finalTabName = pega.ctx.strPyID;
                            }
                            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setTabName(activeMDCDoc.finalTabName, actionMetadata.mdcTarget);
                        };
                    }
                    if (actionMetadata.action == "openSection") {
                        mdcContainer.setAttribute("action", "openSection");
                    }
                    pega.redux.Utils.setVisibileState(mdcName);
                    //INC-248044 - To fix harness resizing issue in Mashup.
                    if (pega.Mashup) {
                        pega.u.d.doHarnessResize();
                    }
                    //do not trigger postMDCRender for 'AutoClose' response
                    if (pega.ctx.strHarnessPurpose !== 'AutoClose') {
                        try {
                            // postMDCRender will be deprecated in future.
                            if (!pega.util.Event.isIE)
                                pega.u.d.focusFirstElement(undefined, mdcContainer, true);
                            pega.ui.EventsEmitter.publishSync("postMDCRender", {
                                "acName": mdcName,
                                "pzHarnessID": pega.ctx.pzHarnessID,
                                "AcRecordId": mdcRecordId
                            });
                            pega.ui.EventsEmitter.publishSync("postACRender", {
                                "acName": mdcName,
                                "pzHarnessID": pega.ctx.pzHarnessID,
                                "AcRecordId": mdcRecordId
                            });
                            if (pega.util.Event.isIE)
                                pega.u.d.focusFirstElement(undefined, mdcContainer, true);
                        }
                        catch (e) {
                            console.error("Caught exception: " + e);
                        }
                    }
                    pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
                    pega.u.d.resetBusyState();
                    if (_currentHarnessCtx) {
                        pega.ctxmgr.setContext(_currentHarnessCtx);
                    }
                });
            }
        };
        //MDC TODO
        //should use this once harnesscontext switching is implemented
        callBack.preRenderer = function (response) {
            var isDCSPA = pega.ctx.bIsDCSPA;
            var mdcContainer = getMDCContainer();
            if (mdcContainer) {
                pega.u.d.cleanUpHarnessElements(null, [mdcContainer]);
            }
            /* BUG-418889: calling busy indicator hide */
            if (pega.u.d.hideBusyIndicatorForMDCRefresh && pega.ctx.isMDC) {
                delete pega.u.d.hideBusyIndicatorForMDCRefresh;
                pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide(null, null, true);
                // BUG-695489 (INC-199953) On "Refresh-Current Harness" action, pega.ui.actions.refresh will call
                // pega.u.d.submitWhenFail and call pega.ui.statetracking.setNavigationBusy if there are any forms
                // We have to call setNavigationDone so that the document-statetracker dom element updates back to "none"
                pega.ui.statetracking.setNavigationDone(window);
            }
            // fire onHarnessUnload for current microdc
            // in case of submit
            if (unloadCurrent && pega.ctx.isMDC) {
                pega.ui.EventsEmitter.publishSync("onHarnessUnload");
                pega.ui.HarnessContextMgr.unloadHarnessContext(pega.ctx.pzHarnessID);
            }
            var dummyDiv = document.createElement("div");
            dummyDiv.innerHTML = response.responseText;
            if (actionMetadata.api == "openSection") {
                try {
                    // preMDCRender will be deprecated in future.
                    pega.ui.EventsEmitter.publishSync("preMDCRender", {
                        "acName": mdcName,
                        "pzHarnessID": pega.ctx.pzHarnessID,
                        "AcRecordId": mdcRecordId
                    });
                    pega.ui.EventsEmitter.publishSync("preACRender", {
                        "acName": mdcName,
                        "pzHarnessID": pega.ctx.pzHarnessID,
                        "AcRecordId": mdcRecordId
                    });
                    pega.ctxmgr.registerContextSwitching(getMDCContainer());
                }
                catch (e) { }
                return;
            }
            var scriptEle = document.createElement("script");
            var intialVars = dummyDiv.querySelector("script#harnessvars");
            scriptEle.innerHTML = intialVars.innerHTML;
            intialVars.parentNode.removeChild(intialVars);
            document.head.appendChild(scriptEle);
            evaluateJSONVariables();
            deferredFieldValues();
            // Added for BUG-578515
            pega.ctx.bIsDCSPA = !!isDCSPA;
            /**
             US-316101: we are setting context in case of offline, as offline does not package harness in ajax container context.
            **/
            var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
            if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal()) {
                harnessContext.setProperty('isMDC', true);
                harnessContext.setProperty('isACContext', true);
                harnessContext.setProperty('mdcName', actionMetadata.mdcTarget);
                harnessContext.setProperty('acName', actionMetadata.mdcTarget);
                harnessContext.setProperty('recordId', actionMetadata.recordId);
                // This is required in case of create new work.
                var pzInsKeyRef = pega.ui.ClientCache.find("newAssignPage.pzInsKey");
                if (pzInsKeyRef) {
                    var pzInsKey = pzInsKeyRef.getValue();
                    harnessContext.setProperty('strKey', pzInsKey);
                }
                var threadContext = pega.ctx.url.match(/\!.+\?/);
                if (!threadContext) {
                    harnessContext.setProperty('url', pega.ctx.url + "?");
                }
                pega.u.d.switchThread("STANDARD/" + actionMetadata.recordId.toUpperCase());
            }
            // Populating parentThreadName here instead of rePaint method.
            pega.ctx.parentThreadName = parentThreadName;
            // register for microdc context switching
            pega.ctxmgr.registerContextSwitching(getMDCContainer());
            var ajaxctDIV = dummyDiv.querySelector("div#AJAXCT");
            var threadName;
            if (ajaxctDIV) {
                threadName = ajaxctDIV.getAttribute("CTTHREAD");
                pega.u.d.initChangeTracker(dummyDiv);
            }
            //}
            // preMDCRender will be deprecated in future.
            try {
                pega.ctx.baseFrameName = SafeURL_createFromURL(pega.ctx.url).get('pzFromFrame');
                pega.ui.EventsEmitter.publishSync("preMDCRender", {
                    "acName": mdcName,
                    "pzHarnessID": pega.ctx.pzHarnessID,
                    "AcRecordId": mdcRecordId
                });
                pega.ui.EventsEmitter.publishSync("preACRender", {
                    "acName": mdcName,
                    "pzHarnessID": pega.ctx.pzHarnessID,
                    "AcRecordId": mdcRecordId
                });
            }
            catch (e) { }
            response.responseText = dummyDiv.innerHTML;
            dummyDiv.innerHTML = null;
            dummyDiv = undefined;
        };
        callBack.success = function (response) {
            var dummyDiv = getDummyDiv(response.responseText);
            var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", dummyDiv, "div");
            var _currentHarnessCtx = switchToMDCContext(getMDCContainer());
            var state = pega.redux.Utils.getAjaxContainerState(actionMetadata.mdcTarget);
            var tabNameFinal;
            var modalOverlayinDoc = document.getElementById("modalOverlay");
            if (modalOverlayinDoc) {
                var modalOverlayEle = dummyDiv.querySelector("#modalOverlay");
                if (modalOverlayEle) {
                    modalOverlayEle.parentNode.removeChild(modalOverlayEle);
                }
            }
            if (onlyOnceEle && onlyOnceEle[0]) {
                pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
                dummyDiv.removeChild(onlyOnceEle[0]);
            }
            if (actionMetadata.api == "openSection") {
                rePaint(dummyDiv);
                if (pega.Mashup) {
                    pega.u.d.doHarnessResize();
                }
                var scope = this;
                if (actionMetadata.mdcTarget && actionMetadata.mdcTarget != this.mdcName) {
                    /* on first refresh of mdc with primary and secondary static tab */
                    scope.mdcName = actionMetadata.mdcTarget;
                    scope.recordId = actionMetadata.recordId;
                }
                if (pega.ui.Tabs && pega.ui.Tabs.renderTabs && pega.ui.Tabs.setTabName && (state.isTabbedMDC == "true" || state.isTabbedMDC == true)) {
                    if (actionMetadata.action == "createNewWork" && pega.ctx.strPyID != "" && pega.ctx.isMDC) {
                        actionMetadata.finalTabName = pega.ctx.strPyID;
                    }
                    tabNameFinal = actionMetadata.finalTabName;
                    pega.ui.Tabs.renderTabs('success', scope);
                    pega.ui.Tabs.setTabName(tabNameFinal, scope.mdcName);
                }
                return;
            }
            var harnessDiv = pega.util.Dom.getElementsById("PEGA_HARNESS", dummyDiv, "div");
            if (!harnessDiv) {
                harnessDiv = dummyDiv.querySelectorAll("main div.screen-layout-region-content>div");
            }
            if (harnessDiv && harnessDiv.length > 0) {
                harnessDiv = harnessDiv[0];
                var formErrorMarker = dummyDiv.querySelector("div#FormErrorMarker_Div");
                if (formErrorMarker) {
                    harnessDiv.insertBefore(formErrorMarker, harnessDiv.firstChild);
                }
                var scriptArray = dummyDiv.querySelectorAll("script");
                var linkArray = dummyDiv.querySelectorAll("link[rel='stylesheet'],style");
                var count = scriptArray.length;
                for (var index = 0; index < count; index++) {
                    harnessDiv.appendChild(scriptArray[index]);
                }
                count = linkArray.length;
                for (var index = 0; index < count; index++) {
                    harnessDiv.appendChild(linkArray[index]);
                }
                scriptArray = linkArray = null;
                dummyDiv = document.createElement("div");
                dummyDiv.appendChild(harnessDiv);
                rePaint(dummyDiv);
                var scope = this;
                if (actionMetadata.mdcTarget && actionMetadata.mdcTarget != this.mdcName) {
                    /* on first refresh of mdc with primary and secondary static tab */
                    scope.mdcName = actionMetadata.mdcTarget;
                    scope.recordId = actionMetadata.recordId;
                }
                if (pega.ui.Tabs && pega.ui.Tabs.renderTabs && pega.ui.Tabs.setTabName && (state.isTabbedMDC == "true" || state.isTabbedMDC == true)) {
                    if ((actionMetadata.action == "createNewWork" || actionMetadata.action == "getnextwork") && pega.ctx.strPyID != "" && pega.ctx.isMDC) {
                        actionMetadata.finalTabName = pega.ctx.strPyID;
                    }
                    // Show harness replace current use case
                    var actionType = actionMetadata.action;
                    var finalTabName = actionMetadata.finalTabName;
                    var harnessName = actionMetadata.harnessName;
                    if (typeof actionMetadata === "object" && actionMetadata.name === "safeURL") {
                        actionType = actionMetadata.get("action");
                        finalTabName = actionMetadata.get("finalTabName");
                        harnessName = actionMetadata.get("harnessName");
                    }
                    if (actionType === "display" && !finalTabName) {
                        actionMetadata.finalTabName = harnessName;
                    }
                    tabNameFinal = actionMetadata.finalTabName;
                    pega.ui.Tabs.renderTabs('success', scope);
                    pega.ui.Tabs.setTabName(tabNameFinal, scope.mdcName);
                }
            }
            if (_currentHarnessCtx) {
                pega.ctxmgr.setContext(_currentHarnessCtx);
            }
            if (actionMetadata.callback && actionMetadata.callback.success) {
                actionMetadata.callback.success();
            }
        };
        if (pega.ctx.isUITemplatized) {
            serverURL.put("UITemplatingStatus", "Y");
        }
        else {
            serverURL.put("UITemplatingStatus", "N");
        }
        var bKeepPageMessages = harCtxMgr.get("KeepPageMessages") ? harCtxMgr.get("KeepPageMessages") : "false";
        serverURL.put("pzKeepPageMessages", bKeepPageMessages);
        if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal()) {
            callBack.offlineCallback = function (response) {
                callBack.preRenderer(response);
                callBack.success(response);
            };
            pega.u.d.ServerProxy.displayHarness(actionMetadata.harnessName, actionMetadata.className, callBack.offlineCallback);
        }
        else {
            pega.u.d.asyncRequest('POST', serverURL, callBack, postData);
        }
    }
    function activateACStaticContent(staticContentDiv, forceActivate) {
        var acName = staticContentDiv.getAttribute("data-mdc-id");
        var state = pega.redux.Utils.getAjaxContainerState(acName);
        if (pega.redux) {
            if (state) {
                if (state.mdcDocs.length > 0 && !forceActivate) {
                    pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.RESET, {}));
                }
            }
        }
        var staticDocInfo = JSON.parse(staticContentDiv.getAttribute("data-mdc-dashboardinfo"));
        if (staticDocInfo.pyRuleType != "None") {
            if (staticDocInfo.isHarnessInclude === "true") {
                // if default view is harness
                pega.desktop.showHarnessWrapper("microDC_static", staticDocInfo.streamClass, staticDocInfo.streamName, "", "", staticDocInfo.usingPage || "pyDisplayHarness", staticDocInfo.pyACName, "", "", staticDocInfo.DT ? staticDocInfo.DT : "", {});
            }
            else {
                // if default view is section
                staticDocInfo.api = "static";
                staticDocInfo.action = "static";
                staticDocInfo.recordKey = staticDocInfo.recordKey || "StaticSection_" + Date.now();
                staticDocInfo.isStatic = "true";
                staticDocInfo.mdcTarget = staticDocInfo.pyACName;
                pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, staticDocInfo));
                staticContentDiv.setAttribute("data-mdc-dashboardinfo", JSON.stringify(staticDocInfo));
            }
        }
        else if (forceActivate && staticDocInfo.pyRuleType == "None" && state && state.mdcDocs.length > 0) {
            var docToFocus = state.mdcDocs[0];
            if (docToFocus && docToFocus.recordId) {
                pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                    "recordId": docToFocus.recordId
                }));
            }
        }
        else if (staticDocInfo.pyRuleType === "None" && !state) {
            pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CREATESTORE, { "mdcTarget": acName }));
        }
        //remove the static info, to prevent re-render
        //staticContentDiv.removeAttribute("data-mdc-dashboardinfo");
        staticContentDiv.setAttribute("data-mdc-rendered", true);
    }
    function activateStaticContent(event, reloadElement, forceActivate, acName) {
        var mdcName = pega.ctx.mdcName;
        var fromOpenSection = false;
        if (acName) {
            mdcName = acName;
            fromOpenSection = true;
        }
        if (event && null != event) {
            var target = pega.util.Event.getTarget(event);
            /* Open section MDC code */
            if (target && target.closest) {
                var mdcTarget = target.closest("div[data-mdc-recordid]");
                if (mdcTarget && mdcTarget.getAttribute("action") === "openSection") {
                    fromOpenSection = true;
                    mdcName = mdcTarget.closest("div[data-mdc-id]").getAttribute("data-mdc-id");
                }
            }
        }
        //setting reloadElement when called from runScript, as reloadElement is undefined.
        if (!reloadElement) {
            // ISSUE-27313 : In multiple Ajax containers case we need to check for the current Ajax container context we are in.
            if ((pega.ctx.isMDC || fromOpenSection) && mdcName) {
                reloadElement = document.querySelector("[data-mdc-id='" + mdcName + "']");
                if (reloadElement) {
                    reloadElement = reloadElement.parentElement;
                }
            }
            if (!reloadElement) {
                reloadElement = document;
            }
        }
        //setting to true if activateStaticContent is called forcefully i.e from runscript
        forceActivate = (typeof (forceActivate) == "undefined") ? true : forceActivate;
        if (!forceActivate) {
            var isRendered = reloadElement.querySelector("[data-mdc-rendered]");
            //skipping the activation for async calls.
            if (isRendered) {
                return;
            }
        }
        var staticContentDivs = reloadElement.querySelectorAll("[data-mdc-dashboardinfo]");
        if (staticContentDivs && staticContentDivs.length > 0) {
            for (var i = 0; i < staticContentDivs.length; ++i) {
                activateACStaticContent(staticContentDivs[i], forceActivate);
            }
        }
    }
    function loadStaticContent(reloadElement) {
        //page load case
        if (reloadElement == null || reloadElement.type == "load") {
            activateStaticContent(null, document, false);
        }
        else if (reloadElement.getAttribute && !reloadElement.getAttribute("data-mdc-recordid")) {
            //async case
            activateStaticContent(null, reloadElement, false);
        }
        //To recreate micro DC docs
        recreateMDCDocs();
    }
    function updateActiveDocsOrder(lastActiveAndDocIdxArray, acName) {
        function Comparator(a, b) {
            if (a[1] < b[1])
                return -1;
            if (a[1] > b[1])
                return 1;
            return 0;
        }
        lastActiveAndDocIdxArray = lastActiveAndDocIdxArray.sort(Comparator);
        //For static doc, pyLastActiveTimeinMS is always 1
        var islastActiveDocStatic = lastActiveAndDocIdxArray[0][0] == 0 ? lastActiveAndDocIdxArray[0][1] : 0;
        if (islastActiveDocStatic === "1") {
            var lastActiveDocStatic = lastActiveAndDocIdxArray[0];
            lastActiveAndDocIdxArray.shift();
            lastActiveAndDocIdxArray.push(lastActiveDocStatic);
        }
        var state = pega.redux.Utils.getAjaxContainerState(acName);
        if (!state)
            return;
        if (islastActiveDocStatic !== "1" && state.mdcDocs[0].isStatic === "true") {
            state.activeDocs = [0];
        }
        else {
            state.activeDocs = [];
        }
        for (var i = 0; i < lastActiveAndDocIdxArray.length; ++i) {
            state.activeDocs = state.activeDocs.concat(parseInt(lastActiveAndDocIdxArray[i][0]));
        }
    }
    function recreateMDCDocs() {
        var mdcdocsRecreateInfoTextAreas = document.querySelectorAll("[data-ac-name]");
        if (!mdcdocsRecreateInfoTextAreas || mdcdocsRecreateInfoTextAreas.length == 0) {
            return;
        }
        for (var count = 0; count < mdcdocsRecreateInfoTextAreas.length; count++) {
            var mdcdocsRecreateInfo = mdcdocsRecreateInfoTextAreas[count];
            /* if (document.querySelector('[data-mdc-id="'+mdcdocsRecreateInfo.getAttribute('ac-name')+'"] [data-mdc-recordid]') == null) {
                    break;
                  }*/
            var mdcdocsJSON = {};
            if (mdcdocsRecreateInfo && mdcdocsRecreateInfo.textContent) {
                mdcdocsJSON = JSON.parse(mdcdocsRecreateInfo.textContent);
            }
            if (!mdcdocsJSON || Object.keys(mdcdocsJSON).length === 0) {
                break;
            }
            var mdcDocsCount = mdcdocsJSON.length;
            var activeDoc, docObj;
            var lastActiveAndDocIdxArray = [];
            for (index = 0; index < mdcDocsCount; index++) {
                docObj = mdcdocsJSON[index];
                if (docObj["pyIsStatic"] == "false") {
                    updateStateElemModel(docObj);
                    var currentIndex = docObj.pyMDCRecordId.split("_");
                    var pyLastActiveTimeinMS = docObj.pyLastActiveTimeinMS;
                    lastActiveAndDocIdxArray.push([currentIndex[1], pyLastActiveTimeinMS]);
                    if (docObj["pyIsActive"] == "true") {
                        activeDoc = docObj;
                    }
                    else {
                        docObj.pyStatus = "Deferred";
                    }
                }
                else if (docObj["pyIsStatic"] == "true" && docObj["pyIsActive"] == "true") {
                    var currentIndex = docObj.pyMDCRecordId.split("_");
                    var pyLastActiveTimeinMS = docObj.pyLastActiveTimeinMS;
                    lastActiveAndDocIdxArray.push([currentIndex[1], pyLastActiveTimeinMS]);
                    activeDoc = docObj;
                }
            }
            // TODO : Handle multiple Ajax Containers case.
            updateActiveDocsOrder(lastActiveAndDocIdxArray, docObj.pyMDCTarget);
            var state = pega.redux.Utils.getAjaxContainerState(docObj.pyMDCTarget);
            if (state && state.maxRecordId) {
                for (var index = state.maxRecordId; index >= 0; index--) {
                    if (state.activeDocs.indexOf(index) == -1) {
                        state.unUsedDocs.push(index);
                    }
                }
                delete state.maxRecordId;
            }
            if (!activeDoc && state) {
                state.defActionObj = docObj;
                activeDoc = docObj;
            }
            if (activeDoc) {
                //for non-static docs create the doc
                if (!(activeDoc["pyIsStatic"] == "true")) {
                    createMDCDocs(activeDoc);
                }
                else if (activeDoc["pyIsStatic"] == "true" && activeDoc["pyIsActive"] == "true") {
                    pega.redux.Utils.setVisibileState(activeDoc.pyMDCTarget);
                }
            }
        }
        //Removing mdcdocsRecreateInfo textarea at end
        for (var i = 0; i < mdcdocsRecreateInfoTextAreas.length; ++i) {
            mdcdocsRecreateInfoTextAreas[i].remove();
        }
    }
    function generateKeyByAction(docObj) {
        if (docObj) {
            var action = docObj.pyAction;
            if ("display" == action) {
                var actionApi = docObj.pyActionAPI;
                if (actionApi) {
                    docObj.recordKey = actionApi.pyHarnessName + ":" + actionApi.pyCoverClass + ":" + actionApi.pyTitle;
                }
            }
        }
    }
    //To update State and to create dummy div for deferred docs
    function updateStateElemModel(docObj) {
        var state = pega.redux.Utils.getAjaxContainerState(docObj.pyMDCTarget);
        if (!state)
            return;
        var docParams = docObj.pyParameters || {};
        var currentIndex = docObj.pyMDCRecordId.split("_");
        var unUsedMDCIds = docObj.pyUnUsedMDCIds;
        docObj.loadStatus = "deferred";
        if (docObj["pyIsActive"] == "true") {
            docObj.loadStatus = "loaded";
            state.defActionObj = docObj;
        }
        if (unUsedMDCIds) {
            state.unUsedDocs = state.unUsedDocs.concat(JSON.parse(unUsedMDCIds));
        }
        state.mdcDocs = state.mdcDocs.concat(docObj);
        var recordIndex = parseInt(currentIndex[1]);
        state.activeDocs = state.activeDocs.concat(recordIndex);
        if (isNaN(state.maxRecordId)) {
            state.maxRecordId = recordIndex;
        }
        else if (state.maxRecordId < recordIndex) {
            state.maxRecordId = recordIndex;
        }
        var mircodcElem = document.querySelector("div[data-mdc-id=" + docObj.pyMDCTarget + "]");
        //Creating dummy div
        var dummyDiv = document.createElement("div");
        dummyDiv.setAttribute("aria-live", "assertive");
        dummyDiv.setAttribute("data-mdc-recordid", docObj.pyMDCRecordId);
        if (docObj.pyAction == "openSection") {
            dummyDiv.setAttribute("action", "openSection");
        }
        docObj.recordId = docObj.pyMDCRecordId;
        docObj.isMDC = "true";
        docObj.mdcTarget = docObj.pyMDCTarget;
        docObj.recordKey = docObj.pyRecordKey || docObj.pyKey;
        generateKeyByAction(docObj);
        //Attaching dummy div to microdc for deferred microdcs
        if (pega.ui.Tabs && typeof state.isTabbedMDC == "boolean" && state.isTabbedMDC) {
            pega.ui.Tabs.updateMdcState(docObj, dummyDiv, mircodcElem);
        }
        else {
            dummyDiv.setAttribute("class", "show");
            mircodcElem.appendChild(dummyDiv);
        }
        //Dsipatching ADDDEFERDOC action to load already deferred docs
        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADDDEFERDOC, docObj));
    }
    function createMDCDocs(docObj) {
        var state = pega.redux.Utils.getAjaxContainerState(docObj.pyMDCTarget);
        if (!state)
            return;
        var metaData = {};
        docObj.fromMDCDoc = "true";
        metaData.recordId = docObj.pyMDCRecordId;
        metaData.mdcTarget = docObj.pyMDCTarget;
        /* var docParams = docObj.pyParameters || {};
              metaData.action = "displayOnPage";
              metaData.pzPrimaryPage = docObj.pzPrimaryHarnessPageName;
              metaData.pageClass = docObj.pzPrimaryHarnessPageClass;
              metaData.threadID = docObj.pyThreadId;
              metaData.harnessName = docObj.pyStreamName;
              metaData.recordId = docObj.pyMDCRecordId;
              metaData.isMDC = docParams.isMDC;
              metaData.mdcTarget = docParams.mdcTarget;
              metaData.recordKey = docObj.pyRecordKey;
              metaData.isRefresh = true;
    
              delete docParams.pyActivity;
              delete docParams.pzTransactionId;*/
        //Object.assign(metaData, docParams);
        //Dispatching LOADDEFERDOC actionfor loading the deferred docs
        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.LOADDEFERDOC, metaData));
    }
    //augment the API
    Object.assign(pega.ui.MDCUtil, {
        microDCRenderer: microDCRender,
        activateStaticContent: activateStaticContent,
        loadStaticContent: loadStaticContent,
        getParentThreadName: getParentThreadName,
        getActiveACDoc: getActiveACDoc
    });
    // Code to support swipe gestures on Micro-DC to navigate among records 
    // TODO this needs to be optimized by listening to some micro-dc ready API, instead of relying on JQuery's late binding 
    $(function () {
        $('body').on("swipeleft", "[data-mdc-id]", function (event) {
            pega.control.UIElement.Actions.goNext("", event);
        });
        $('body').on("swiperight", "[data-mdc-id]", function (event) {
            pega.control.UIElement.Actions.goPrev("", event);
        });
        /*function resizeMDC(){
          var mdc;
          var activeDoc;
          var activeDocHeight;
          
          mdc = $('body').find("[data-mdc-id]");
          if(mdc){
            activeDoc = mdc.children('.show');
            if(activeDoc){
              activeDocHeight = activeDoc.height();
              mdc.css({"min-height" : activeDocHeight});
            }
          }
        }
        
        pega.ui.EventsEmitter.subscribe("postMDCRender", function(){
          resizeMDC();
        });
        
        pega.ui.EventsEmitter.subscribe("onACSwitch", function(){
          resizeMDC();
        });
        
        pega.ui.EventsEmitter.subscribe("postACRender", function(){
          resizeMDC();
        });*/
    });
})();
pega.u.d.attachOnload(pega.ui.MDCUtil.loadStaticContent, true);
//static-content-hash-trigger-GCC
pega = pega || {};
pega.redux = pega.redux || {};
pega.redux.Utils = (function () {
    // helper to return new state object, based on the current state and modified properties.
    function updateObject(oldObject, newValues) {
        return Object.assign({}, oldObject, newValues);
    }
    function getThreadNameFromAcName(acName) {
        if (typeof acName === "undefined") {
            acName = pega.ctx.acName;
        }
        if (acName) {
            return acName.toUpperCase();
        }
    }
    function updateItemInArray(array, propName, propValue, updateItemCallback) {
        var updatedItems = array.map(function (item) {
            if (item[propName] !== propValue) {
                // Since we only want to update one item, preserve all others as they are now
                return item;
            }
            // Use the provided callback to create an updated item
            var updatedItem = updateItemCallback(item);
            return updatedItem;
        });
        return updatedItems;
    }
    function setVisibileState(mdcName) {
        var currentState = this.getAjaxContainerState(mdcName);
        if (!currentState) {
            return;
        }
        var activeDocs = currentState.activeDocs;
        if (activeDocs && activeDocs.length > 1) {
            var recordDiv = document.querySelector("div[data-mdc-recordid='" + mdcName + "_" + activeDocs[activeDocs.length - 2] + "']");
            /* Skip in case of mdc tabs */
            if (recordDiv && recordDiv.parentElement && (recordDiv.parentElement.classList.contains('mdc-tab-container') || recordDiv.parentElement.classList.contains('mdc-tabs'))) {
                return;
            }
            if (recordDiv) {
                pega.ui.EventsEmitter.publishSync("onACHide", { recordDIV: recordDiv }); /* SE-57437 */
                var classList = recordDiv.classList;
                classList.remove("show");
                if (!classList.contains("hide")) {
                    classList.add("hide");
                }
            }
        }
        if (activeDocs && activeDocs.length > 0) {
            recordDiv = document.querySelector("div[data-mdc-recordid='" + mdcName + "_" + activeDocs[activeDocs.length - 1] + "']");
            /* Skip in case of mdc tabs */
            if (recordDiv && recordDiv.parentElement && (recordDiv.parentElement.classList.contains('mdc-tab-container') || recordDiv.parentElement.classList.contains('mdc-tabs'))) {
                return;
            }
            if (recordDiv) {
                pega.ui.EventsEmitter.publishSync("onACShow", { recordDIV: recordDiv }); /* SE-57437 */
                var classList = recordDiv.classList;
                classList.remove("hide");
                if (!classList.contains("show")) {
                    classList.add("show");
                }
            }
        }
    }
    /**
       * @method getAjaxContainerState
       * @param {String} acTarget
       *
       * Returns the state object of given AjaxContainer.
       */
    function getAjaxContainerState(acTarget) {
        if (typeof acTarget === "undefined") {
            if (pega.ctx.isACContext) {
                acTarget = pega.ctx.mdcName;
            }
            else {
                acTarget = "acprimary";
            }
        }
        return pega.redux.store.getState()[acTarget];
    }
    function checkDocDirty(actionObj) {
        var isMdcDocDirty;
        isMdcDocDirty = pega.u.d.isContainerDirty(document.querySelector("div[data-mdc-recordid=" + actionObj.recordId + "]"));
        var contentMsg = pega.u.d.fieldValuesList.get("DISCARD_YOUR_UNSAVED_CHANGES");
        if (isMdcDocDirty) {
            var bClose = confirm(contentMsg);
            isMdcDocDirty = false;
            return !bClose;
        }
        return isMdcDocDirty;
    }
    /*
      Get ajax container names in the current document. This method will skip Ajax container configured in SPA portal header.
    */
    function getACNames() {
        var state = pega.redux.store.getState();
        var mainTag = document.getElementsByTagName("main");
        if (pega.u.d.bIsDCSPA && pega.u.d.replaceWorkArea) {
            mainTag = document.querySelectorAll("#workarea");
        }
        var acDivList = [];
        var acNamesList = [];
        if (mainTag && mainTag.length == 1) {
            // DC SPA scenario.
            mainTag = mainTag[0];
            acDivList = mainTag.querySelectorAll("div[data-mdc-id]");
        }
        else {
            acDivList = document.querySelectorAll("div[data-mdc-id]");
        }
        for (var i = 0; i < acDivList.length; ++i) {
            var acname = acDivList[i].getAttribute("data-mdc-id");
            if (state[acname]) {
                acNamesList.push(acname);
            }
        }
        return acNamesList;
    }
    function switchToParentContext(acName) {
        if (pega.ctx.bIsDCSPA) {
            if (acName) {
                pega.ctxmgr.setContext(pega.ctxmgr.getContextByTarget(document.querySelector("div[data-mdc-id='" + acName + "']")));
            }
            else {
                pega.ctxmgr.setContext(pega.ctxmgr.getDCSPAContext());
            }
        }
        else {
            pega.ctxmgr.setRootDocumentContext();
        }
    }
    return {
        updateObject: updateObject,
        getThreadNameFromAcName: getThreadNameFromAcName,
        updateItemInArray: updateItemInArray,
        setVisibileState: setVisibileState,
        getAjaxContainerState: getAjaxContainerState,
        checkDocDirty: checkDocDirty,
        getACNames: getACNames,
        switchToParentContext: switchToParentContext
    };
})();
//static-content-hash-trigger-GCC
pega = pega || {};
pega.redux = pega.redux || {};
var cnwNewCounter = 100;
pega.redux.actionTypes = {
    "ADD": "ADDDOCUMENT",
    "CLOSE": "CLOSEDOCUMENT",
    "CLOSEALL": "CLOSEALLDOCUMENTS",
    "SWITCH": "SWITCHDOCUMENT",
    "UPDATE": "UPDATEDOCUMENT",
    "ADDDEFERDOC": "ADDDEFERREDDOCUMENT",
    "LOADDEFERDOC": "LOADDEFERREDDOCUMENT",
    "RESET": "RESETSTATE",
    "CLOSETOCLAIM": "CLOSETOCLAIM",
    "CREATESTORE": "CREATESTORE"
};
pega.redux.ActionUtils = (function () {
    var uuidQuadruplet = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    var generateRecordKey = function (actionObj) {
        if (!actionObj)
            return;
        var recordKey;
        if (actionObj.recordKey) {
            recordKey = actionObj.recordKey;
        }
        var threadName = pega.u.d.getThreadName();
        /* Set tabName to actionObj.label used in case of showHarness in runscript */
        if (actionObj.label) {
            actionObj.tabName = actionObj.label;
        }
        switch (actionObj.action) {
            case "openSection":
                var parentKey = pega.redux.Utils.getAjaxContainerState(actionObj.mdcTarget).parentKey;
                if (!actionObj.recordKey) {
                    recordKey = actionObj.api + "_" + actionObj.StreamName + "_" + actionObj.pzPrimaryPageName + "_" + parentKey + "_" + threadName;
                }
                else {
                    recordKey = actionObj.api + "_" + actionObj.recordKey;
                }
                break;
            case "CreateNewWork":
                recordKey = actionObj.api;
                break;
            case "createNewWork":
                if (actionObj.contentID) {
                    var state = pega.redux.Utils.getAjaxContainerState(actionObj.mdcTarget);
                    var mdcDocs = state.mdcDocs || [];
                    if (mdcDocs.length > 0) {
                        var mdcDocsLength = mdcDocs.length;
                        for (var index = 0; index < mdcDocsLength; index++) {
                            var mdcDoc = mdcDocs[index];
                            if (mdcDoc.contentID === actionObj.contentID) {
                                recordKey = mdcDoc.recordKey;
                            }
                            else if (mdcDoc.pyElementName == actionObj.contentID) {
                                recordKey = mdcDoc.pyKey;
                            }
                        }
                    }
                }
                else {
                    actionObj.contentID = (uuidQuadruplet() + uuidQuadruplet() + "-" + uuidQuadruplet() + "-" + uuidQuadruplet()
                        + "-" + uuidQuadruplet() + "-" + uuidQuadruplet() + uuidQuadruplet() + uuidQuadruplet());
                }
                if (!recordKey) {
                    recordKey = ++(cnwNewCounter) + 'T';
                }
                break;
            case "openAssignment":
                var insHandle = actionObj.key;
                var idx_start = insHandle.indexOf(' '), idx_end = insHandle.indexOf('!'), hostKey = insHandle.substring(idx_start + 1, idx_end);
                recordKey = hostKey;
                delete actionObj.pzHarnessID;
                break;
            case "openWorkByHandle":
                recordKey = actionObj.key;
                break;
            case "getnextwork":
                recordKey = "getnextwork";
                break;
            case "Display":
            case "display":
                if (!actionObj.landingAction) {
                    actionObj.label = pega.ctx.strPyLabel;
                }
                recordKey = actionObj.harnessName + ":" + actionObj.className + ":" + actionObj.label;
                break;
            case "openlanding":
                break;
            case "openWorkItem":
                var workID = actionObj.workID;
                var workPool = actionObj.workPool;
                var hostKey = workPool + " " + workID;
                recordKey = hostKey;
                break;
        }
        return recordKey;
    };
    var checkDocAvailability = function (actionObj, keyValue, keyName) {
        if (keyName === void 0) { keyName = "recordKey"; }
        var state = pega.redux.Utils.getAjaxContainerState(actionObj.mdcTarget);
        if (!state)
            return;
        var mdcDocs = state.mdcDocs || [];
        var recordId;
        if (mdcDocs.length) {
            var mdcDocsLength = mdcDocs.length;
            for (var index = 0; index < mdcDocsLength; index++) {
                var mdcDoc = mdcDocs[index];
                if (mdcDoc[keyName].toLowerCase() == keyValue.toLowerCase()) {
                    recordId = mdcDoc.recordId;
                    if (mdcDoc.loadStatus == "deferred") {
                        actionObj.loadStatus = mdcDoc.loadStatus;
                        mdcDoc.loadStatus = "loaded";
                        state.defActionObj = mdcDoc;
                    }
                    break;
                }
            }
        }
        return recordId;
    };
    return {
        generateRecordKey: generateRecordKey,
        checkDocAvailability: checkDocAvailability
    };
})();
pega.redux.actions = function (type, actionObj) {
    // if actionObj is a safeURL object
    if (actionObj.name == "safeURL") {
        var safeURLHashTable = actionObj.hashtable;
        var newActionObj = {};
        for (var key in safeURLHashTable) {
            if (key && key != "") {
                newActionObj[key] = safeURLHashTable[key];
            }
        }
        // reassign to new actionObj
        actionObj = newActionObj;
    }
    function processActionInfo(recordKey) {
        if (actionObj) {
            // update actionObj with recordKey  
            if (recordKey) {
                actionObj.recordKey = recordKey;
            }
            //TODO we can eliminate following switch case
            var recordId;
            switch (actionObj.action) {
                case "openSection":
                case "createNewWork":
                case "openWorkItem":
                case "CreateNewWork":
                case "getnextwork":
                case "openWorkByHandle":
                case "openAssignment":
                case "display":
                case "Display":
                case "static":
                    recordId = pega.redux.ActionUtils.checkDocAvailability(actionObj, recordKey);
                    break;
                case "switchDocument":
                    if (actionObj.recordId) {
                        recordId = pega.redux.ActionUtils.checkDocAvailability(actionObj, actionObj.recordId, "recordId");
                    }
                    break;
            }
            if (recordId) {
                actionObj.recordId = recordId;
                if (actionObj.loadStatus == "deferred") {
                    type = pega.redux.actionTypes.LOADDEFERDOC;
                }
                else if (actionObj.reload == "true") {
                    actionObj.reload = true;
                    var isDocDirty = pega.redux.Utils.checkDocDirty(actionObj);
                    if (isDocDirty) {
                        type = "SWITCHDOCUMENT";
                    }
                    else {
                        type = "CLOSETOCLAIM";
                    }
                }
                else {
                    type = "SWITCHDOCUMENT";
                }
            }
            else {
                var state = pega.redux.Utils.getAjaxContainerState(actionObj.mdcTarget);
                if (state && state.activeDocs.length === state.maxDocs) {
                    if (state.isTabbedMDC) {
                        _showMaxDocsAlert(actionObj.mdcTarget);
                        //alert("Reached maximum limit.");
                        type = "";
                        return;
                    }
                    type = "CLOSETOCLAIM";
                }
            }
        }
    }
    function _showMaxDocsAlert(acName) {
        acName = acName || pega.ctx.acName;
        var acDiv = document.querySelector("[data-mdc-id=" + acName + "]");
        if (acDiv) {
            var maxDocsWarning = acDiv.getAttribute("data-maxdocs-msg");
            alert(maxDocsWarning);
        }
    }
    if (type == pega.redux.actionTypes.ADD) {
        var recordKey = pega.redux.ActionUtils.generateRecordKey(actionObj);
        processActionInfo(recordKey);
    }
    else if (type == pega.redux.actionTypes.SWITCH) {
        actionObj.action = "switchDocument";
        processActionInfo();
    }
    return Object.assign({}, actionObj, { type: type });
};
//static-content-hash-trigger-GCC
pega = pega || {};
pega.redux = pega.redux || {};
pega.redux.reducers = (function () {
    var ActionTypes = pega.redux.actionTypes;
    var Utils = pega.redux.Utils;
    var PegaReducers = {};
    function updateHistory(state, actionObj, newState) {
        var recordId = actionObj.recordId;
        var docsHistory = state.docsHistory.slice();
        if (actionObj.fromBackButtonClick || state.type === ActionTypes.CLOSE) {
            docsHistory.pop();
        }
        else if (state.type === ActionTypes.ADD) {
            docsHistory.push(recordId);
        }
        else if (state.type === ActionTypes.SWITCH) {
            var index = state.docsHistory.indexOf(recordId);
            if (index === -1) {
                // If we are switching to a document which is not in navigation stack but in mdcDocs list.
                docsHistory.push(recordId);
            }
            else {
                // If we are switching to a document we already visited, we will remove all the docs next to it from the history.
                docsHistory.splice(index + 1);
            }
        }
        newState.docsHistory = docsHistory;
    }
    function getActionObjByProperty(state, prop) {
        var mdcDocs = state.mdcDocs;
        var actionObj = mdcDocs.filter(function (i) { return i.recordId == prop; });
        return actionObj[0];
    }
    function closeDocument(state, actionObj, newState) {
        var recordId = actionObj.recordId;
        var documentIndexToClose = parseInt(recordId.split("_")[1]);
        var documentFound = false;
        var activeDocs = state.activeDocs.slice();
        var unUsedDocs = state.unUsedDocs.slice();
        var activeDocsLen = activeDocs.length;
        for (var index = 0; index < activeDocsLen; index++) {
            if (documentIndexToClose == activeDocs[index]) {
                activeDocs.splice(index, 1);
                unUsedDocs.push(documentIndexToClose);
                unUsedDocs.sort(function (a, b) { return b - a; });
                updateHistory(state, actionObj, newState);
                newState.activeDocs = activeDocs;
                newState.unUsedDocs = unUsedDocs;
                documentFound = true;
                break;
            }
        }
        if (documentFound) {
            var mdcDocs = state.mdcDocs.slice();
            var mdcDocsLen = mdcDocs.length;
            if (mdcDocsLen > 0) {
                for (var index = 0; index < mdcDocsLen; index++) {
                    if (recordId == mdcDocs[index].recordId) {
                        mdcDocs.splice(index, 1);
                        newState.mdcDocs = mdcDocs;
                        newState.docToClose = actionObj;
                        newState.docToClose.tabIndex = index + 1;
                        break;
                    }
                }
            }
        }
    }
    function closeAllDocuments(state, actionObj, newState) {
        var docsMetaData = {
            "docsToClose": [],
            "sectionsToClose": []
        };
        var activeDocs = state.activeDocs.slice();
        var unUsedDocs = state.unUsedDocs.slice();
        var mdcDocs = state.mdcDocs.slice();
        var forceClose = actionObj.forceClose;
        var recordIdsToClose = [];
        function canCloseDoc(mdcDocument) {
            if (forceClose)
                return true;
            if (mdcDocument.isStatic === "true")
                return false;
            return true;
        }
        function isThreadCloseRequired(mdcDocument) {
            if ((mdcDocument.isStatic === "true" && mdcDocument.isHarnessInclude === "false") || mdcDocument.action === "openSection") {
                // We don't have separate thread in this case.
                return false;
            }
            return true;
        }
        for (var i = mdcDocs.length - 1; i >= 0; --i) {
            var mdcDocument = mdcDocs[i];
            if (canCloseDoc(mdcDocument)) {
                var recordIdIndex = parseInt(mdcDocument.recordId.split("_")[1]);
                var index = activeDocs.indexOf(recordIdIndex);
                activeDocs.splice(index, 1);
                unUsedDocs.push(recordIdIndex);
                unUsedDocs.sort(function (a, b) { return b - a; });
                if (mdcDocument.action == "openSection") {
                    var mdcDocCtx = pega.ctxmgr.getContextByProperty("recordId", mdcDocs[i].recordId);
                    mdcDocument.threadName = pega.u.d.getThreadName(mdcDocCtx);
                    mdcDocument.pzPrimaryPageName = mdcDocCtx.primaryPageName;
                    docsMetaData.sectionsToClose.push(mdcDocument);
                }
                else if (isThreadCloseRequired(mdcDocument)) {
                    var docMetaData = {};
                    var threadName = pega.ctx.baseThreadName || pega.ctx.parentThreadName;
                    if (pega.ctx.bIsDCSPA) {
                        threadName = pega.ctxmgr.getDCSPAThreadName();
                    }
                    // TODO: Change threadname this logic later.   
                    var mdcDocCtx = pega.ctxmgr.getContextByProperty("recordId", mdcDocs[i].recordId);
                    if (mdcDocCtx) {
                        docMetaData.threadName = pega.u.d.getThreadName(mdcDocCtx);
                        docMetaData.pzPrimaryPageName = mdcDocCtx.primaryPageName;
                    }
                    docsMetaData.docsToClose.push(docMetaData);
                    recordIdsToClose.push(mdcDocument.recordId);
                }
                mdcDocs.splice(i, 1);
            }
        }
        /*if (actionObj.closeSynchronously) {
          var docMetaData = {};
          docMetaData.threadName = pega.ctx.baseThreadName;
          docMetaData.pzPrimaryPageName = actionObj.pzPrimaryPageName;
          docsMetaData.docsToClose.push(docMetaData);
        }*/
        if (actionObj.closeAllDocsCallback) {
            newState.closeAllDocsCallback = actionObj.closeAllDocsCallback;
        }
        else {
            newState.closeAllDocsCallback = function () { };
        }
        //TODO - need to update these if they have been really modified
        newState.mdcDocs = mdcDocs;
        newState.activeDocs = activeDocs;
        newState.unUsedDocs = unUsedDocs;
        newState.docsToCloseMetaData = docsMetaData;
        newState.recordIdsToClose = recordIdsToClose;
        newState.forceClose = forceClose;
        newState.closeSynchronously = actionObj.closeSynchronously;
    }
    function reorderActiveDocs(state, actionObj, newState) {
        var recordId = actionObj.recordId;
        if (recordId) {
            var documentIndex = parseInt(recordId.split("_")[1]);
            var activeDocs = state.activeDocs.slice();
            var count = activeDocs.length;
            for (var index = 0; index < count; index++) {
                if (documentIndex == activeDocs[index]) {
                    activeDocs.splice(index, 1);
                    activeDocs.push(documentIndex);
                    newState.activeDocs = activeDocs;
                    updateHistory(state, actionObj, newState);
                    break;
                }
            }
            ;
        }
    }
    /**
     * Updates record key with the handle in cases like
     * - openWorkByHandle followed-by openAssignment
     * - New followed-by done(submit) which creates work object
     \\\
     **/
    function updateRecordKey(state, actionObj, newState) {
        //update matching mdc document based on the recordId
        var newMdcDocs = Utils.updateItemInArray(state.mdcDocs, "recordId", actionObj.recordId, function (mdcDoc) {
            var updatedRecordKey;
            if (pega.u.d.getHandle() != null && mdcDoc.recordKey != pega.u.d.getHandle()) {
                updatedRecordKey = pega.tools.Security.decodeCrossScriptingFilter(pega.u.d.getHandle());
                return Utils.updateObject(mdcDoc, { recordKey: updatedRecordKey });
            }
            return mdcDoc;
        });
        newState.mdcDocs = newMdcDocs;
    }
    function getParentKey() {
        if (pega.ctx.strPyID) {
            return pega.ctx.strPyID;
        }
        else {
            return pega.ctx.strHarnessClass + "!" + pega.ctx.strHarnessPurpose;
        }
    }
    function getCurrentIndex(state, newState) {
        var currentIndex;
        var unUsedDocs = state.unUsedDocs.slice();
        //if any unused docs, reuse the index.
        if (unUsedDocs.length > 0) {
            currentIndex = unUsedDocs.pop();
            newState.unUsedDocs = unUsedDocs;
        }
        else {
            if (pega.redux.PMC) {
                currentIndex = pmcPortalConfiguration.navigation.items.length + state.activeDocs.length;
            }
            else {
                currentIndex = state.activeDocs.length;
            }
        }
        return currentIndex;
    }
    function updateUnusedDocs(state, newState, currentIndex) {
        var unUsedDocs = state.unUsedDocs.slice();
        //if any unused docs, reuse the index.
        if (unUsedDocs.length > 0) {
            for (var index = 0; index < unUsedDocs.length; index++) {
                if (currentIndex == unUsedDocs[index]) {
                    unUsedDocs.splice(index, 1);
                    newState.unUsedDocs = unUsedDocs;
                }
            }
        }
    }
    function getLRUIndexToReplace(state, acName, action) {
        var toReplaceIndex = -1;
        var activeDocs = state.activeDocs;
        var mdcDocs = state.mdcDocs;
        var priorityOrder = ["openSection", "Confirm", "Review", "None", "New", "Perform"];
        var lruPriorityIndex = Infinity;
        for (var i = 0; i < activeDocs.length; i++) {
            var currentDocId = activeDocs[i];
            var isDocDirty = pega.u.d.isContainerDirty(document.querySelector("div[data-mdc-recordid=" + acName + "_" + currentDocId + "]"));
            if (isDocDirty || (currentDocId == 0 && mdcDocs[0].isStatic === "true")) {
                continue;
            }
            var harnessType = "";
            var current = -1;
            if (action === "openSection") {
                harnessType = "openSection";
            }
            else {
                harnessType = pega.ctxmgr.getContextByProperty("recordId", acName + "_" + currentDocId).strHarnessPurpose;
            }
            current = priorityOrder.indexOf(harnessType);
            if (lruPriorityIndex > current) {
                lruPriorityIndex = current;
                toReplaceIndex = activeDocs[i];
            }
        }
        return toReplaceIndex;
    }
    function _showMaxDocsAlert(acName) {
        acName = acName || pega.ctx.acName;
        var acDiv = document.querySelector("[data-mdc-id=" + acName + "]");
        if (acDiv) {
            var maxDocsWarning = acDiv.getAttribute("data-maxdocs-msg");
            alert(maxDocsWarning);
        }
    }
    var initialState = {
        "mdcDocs": [],
        "activeDocs": [],
        "unUsedDocs": [],
        "docsHistory": [],
        "maxDocs": -1
    };
    function ACReducer(state, actionObj) {
        var newState = {};
        if (state.maxDocs === -1) {
            var mdcElem = document.querySelector("[data-mdc-id=" + actionObj.mdcTarget + "]");
            if (mdcElem) {
                newState.maxDocs = parseInt(mdcElem.getAttribute("data-mdc-maxdocs"));
                if (pega.mobile && pega.mobile.isMultiWebViewPegaMobileClient && pega.redux.PMC && pega.redux.PMC.windows) {
                    newState.maxDocs = -1;
                }
            }
        }
        //common state updation
        newState.type = actionObj.type;
        //Below condition is for CASEWORKER spa portal case.
        if (actionObj.isStatic === "true" && (pega.ctx.bIsDCSPA || actionObj.type === ActionTypes.ADD)) {
            newState.parentKey = getParentKey();
        }
        switch (actionObj.type) {
            case ActionTypes.ADD:
                var currentIndex = void 0;
                if (!actionObj.addFromCloseToClaim || !actionObj.recordId) {
                    currentIndex = getCurrentIndex(state, newState);
                }
                if (actionObj.isRefresh) {
                    actionObj.recordId = actionObj.recordId;
                }
                else if (actionObj.pmcOptions) {
                    actionObj.recordId = actionObj.pmcOptions.navigationId;
                }
                else {
                    //generate recordId for the new mdc document
                    if (!actionObj.addFromCloseToClaim || !actionObj.recordId) {
                        actionObj.recordId = actionObj.mdcTarget + "_" + currentIndex;
                    }
                    else {
                        currentIndex = parseInt(actionObj.recordId.split("_")[1]);
                        updateUnusedDocs(state, newState, currentIndex);
                    }
                }
                delete actionObj.addFromCloseToClaim;
                newState.activeDocs = state.activeDocs.concat(currentIndex);
                if (!actionObj.tabIndex)
                    newState.mdcDocs = state.mdcDocs.concat(actionObj);
                else {
                    state.mdcDocs.splice(actionObj.tabIndex - 1, 0, actionObj);
                    newState.mdcDocs = state.mdcDocs;
                    newState.fromCloseToAdd = true;
                    newState.tabIndex = actionObj.tabIndex - 1;
                }
                updateHistory(state, actionObj, newState);
                break;
            case ActionTypes.CLOSETOCLAIM:
                var toReplaceIndex;
                // BUG-410476 : We need to check for true explicitly here as sometimes we get "false" value for actionObj.reload
                if (actionObj.reload == true) {
                    toReplaceIndex = actionObj.recordId.split("_")[1];
                }
                else {
                    toReplaceIndex = getLRUIndexToReplace(state, actionObj.mdcTarget, actionObj.action);
                }
                if (toReplaceIndex == -1) {
                    // We need to change the action type here as subscribers will be called after this.
                    newState.type = "NONE";
                    _showMaxDocsAlert(actionObj.mdcTarget);
                }
                else {
                    newState.docToCreate = actionObj;
                    var docToClose = getActionObjByProperty(state, actionObj.mdcTarget + "_" + toReplaceIndex);
                    var closeActionObj = Object.assign({
                        "clearThreadState": "true",
                        "skipSwitchDocument": "true",
                        "fromCloseToAdd": true,
                        "recordId": actionObj.mdcTarget + "_" + toReplaceIndex,
                        "pyActivity": "DoClose" //DoClose not required for opensection
                    }, docToClose);
                    closeDocument(state, closeActionObj, newState);
                }
                break;
            case ActionTypes.SWITCH:
                reorderActiveDocs(state, actionObj, newState);
                newState.actionObj = actionObj;
                break;
            case ActionTypes.CLOSE:
                closeDocument(state, actionObj, newState);
                break;
            case ActionTypes.CLOSEALL:
                closeAllDocuments(state, actionObj, newState);
                break;
            case ActionTypes.UPDATE:
                // Show Harness Replace Current use case
                if (actionObj.type === pega.redux.actionTypes.UPDATE && actionObj.action === "display") {
                    newState.mdcDocs = state.mdcDocs.map(function (mdcDoc) {
                        if (mdcDoc.recordId === actionObj.recordId) {
                            return Object.assign({}, mdcDoc, actionObj);
                        }
                        return mdcDoc;
                    });
                }
                else {
                    updateRecordKey(state, actionObj, newState);
                }
                break;
            case ActionTypes.ADDDEFERDOC:
                break;
            case ActionTypes.LOADDEFERDOC:
                reorderActiveDocs(state, actionObj, newState);
                break;
            case ActionTypes.CREATESTORE:
                break;
        }
        return Utils.updateObject(state, newState);
    }
    var MDCAction = function (state, actionObj) {
        if (state === void 0) { state = {}; }
        var acName = actionObj.mdcTarget || pega.ctx.mdcName;
        var isOuterDocClose = actionObj.isOuterDocClose;
        var dashboardInfo = {};
        if (actionObj.type === ActionTypes.RESET) {
            return {};
        }
        // During redux initialization we don't have mdcTarget, so querying dom to get acName.
        if (actionObj.type === "@@redux/INIT") {
            var newState = {};
            var acDivs = document.querySelectorAll("[data-mdc-id]");
            for (var i = 0; i < acDivs.length; ++i) {
                acName = acDivs[i].getAttribute("data-mdc-id");
                var dashboardInfo = JSON.parse(acDivs[i].getAttribute("data-mdc-dashboardinfo"));
                var isTabbedMDC = dashboardInfo && dashboardInfo.showTabs ? dashboardInfo.showTabs : '';
                newState[acName] = Object.assign({}, initialState);
                newState[acName].parentKey = getParentKey();
                newState[acName].isTabbedMDC = isTabbedMDC;
            }
            return Utils.updateObject(state, newState);
        }
        // Fallback code to primary "microdc".
        if (!acName) {
            acName = "acprimary";
        }
        if (actionObj.type === ActionTypes.CLOSEALL && isOuterDocClose) {
            var newState = {};
            var acNames = Utils.getACNames();
            for (var i = 0; i < acNames.length; ++i) {
                newState[acNames[i]] = ACReducer(state[acNames[i]], actionObj);
            }
            return Utils.updateObject(state, newState);
        }
        if (!state[acName]) {
            state[acName] = initialState;
            var acDiv = document.querySelector("[data-mdc-id='" + acName + "']");
            ;
            var dashboardInfo = JSON.parse(acDiv.getAttribute("data-mdc-dashboardinfo"));
            var isTabbedAC = dashboardInfo && dashboardInfo.showTabs ? dashboardInfo.showTabs : '';
            state[acName].isTabbedMDC = isTabbedAC;
        }
        return Utils.updateObject(state, (_a = {},
            _a[acName] = ACReducer(state[acName], actionObj),
            _a
        ));
        var _a;
    };
    return {
        MDCAction: MDCAction
    };
})();
//static-content-hash-trigger-GCC
pega = pega || {};
pega.redux = pega.redux || {};
pega.redux.MDCImpl = pega.redux.MDCImpl || {};
pega.redux.store = (function () {
    var Actions = pega.redux.actions;
    var ActionTypes = pega.redux.actionTypes;
    var Reducers = pega.redux.reducers;
    var Utils = pega.redux.Utils;
    var subscriber = function (store) { return function (next) { return function (action) {
        var result = next(action);
        var currentState = Utils.getAjaxContainerState(action.mdcTarget);
        var actionType;
        if (action.type === ActionTypes.RESET) {
            return result;
        }
        if (action.type === ActionTypes.CLOSEALL && action.isOuterDocClose) {
            actionType = action.type;
        }
        else {
            actionType = currentState.type;
        }
        switch (actionType) {
            case ActionTypes.ADD:
                var currentAction = void 0;
                if (currentState.fromCloseToAdd && currentState.tabIndex >= 0) {
                    currentAction = currentState.mdcDocs[currentState.tabIndex];
                    delete currentState.tabIndex;
                    delete currentState.fromCloseToAdd;
                }
                else {
                    currentAction = currentState.mdcDocs[currentState.mdcDocs.length - 1];
                    var recordId = currentAction.recordId;
                    var mdcElem = document.querySelector("[data-mdc-id=" + recordId.split("_")[0] + "]");
                    var mdeRecordElem = document.createElement("div");
                    mdeRecordElem.setAttribute("data-mdc-recordid", recordId);
                    if (currentAction.action == "openSection") {
                        mdeRecordElem.setAttribute("action", currentAction.action);
                    }
                    /* keep tabs visible for mdc tabs */
                    var mdcTabs = mdcElem.querySelector(".mdc-tabs");
                    if (mdcTabs) {
                        mdcTabs.appendChild(mdeRecordElem);
                    }
                    else {
                        if (currentAction.action != "static") {
                            mdeRecordElem.setAttribute("class", "hide");
                        }
                        mdcElem.appendChild(mdeRecordElem);
                    }
                }
                /* US-316101: Callback that should be called after mdcRender is done */
                if (action.callback) {
                    currentAction.callback = action.callback;
                }
                if (currentAction && currentState.parentKey) {
                    currentAction.parentKey = currentState.parentKey;
                }
                // Utils.setVisibileState(currentAction.mdcTarget);
                pega.ui.MDCUtil.microDCRenderer(currentAction);
                break;
            case ActionTypes.CLOSETOCLAIM:
                if (currentState.docToClose) {
                    var nextActiveMDCIndex_1 = currentState.docToClose.recordId;
                    var nextHarnessContext_1 = pega.ctxmgr.getContextByProperty("recordId", nextActiveMDCIndex_1);
                    if (currentState.docToClose.api == "openSection" || currentState.docToClose.action === "openSection") {
                        currentState.docToClose.isFromOpenSection = true;
                        currentState.docToClose.isFromCloseToadd = true;
                    }
                    else {
                        pega.ctxmgr.setContext(nextHarnessContext_1);
                    }
                    closeDocument(currentState.docToClose.mdcTarget);
                }
                break;
            case ActionTypes.SWITCH:
                var currentAction = void 0;
                var mdcTarget = void 0;
                var parentThreadName = pega.u.MDCUtil.getParentThreadName();
                if (action.clientSwitch) {
                    for (var key in currentState.mdcDocs) {
                        if (currentState.mdcDocs[key].recordId === action.recordId) {
                            currentAction = currentState.mdcDocs[key];
                            break;
                        }
                    }
                }
                else if (currentState.mdcDocs.length > 0) {
                    // currentAction = currentState.mdcDocs[currentState.mdcDocs.length - 1];
                    var lastActiveIndex = currentState.activeDocs[currentState.activeDocs.length - 1];
                    for (var i = 0; i < currentState.mdcDocs.length; ++i) {
                        var currRecord = currentState.mdcDocs[i].recordId;
                        var currIndex = parseInt(currRecord.split("_")[1]);
                        if (currIndex === lastActiveIndex) {
                            currentAction = currentState.mdcDocs[i];
                            break;
                        }
                    }
                }
                mdcTarget = currentAction ? currentAction.mdcTarget : currentState.actionObj ? currentState.actionObj.mdcTarget : "";
                if (currentAction && currentAction.pyStatus == "Deferred" && (!action.dataLoaded && !(currentAction.loadStatus == "loaded"))) {
                    currentAction.closingOnRefresh = action.closingOnRefresh;
                    currentState.defActionObj = currentAction;
                    loadDeferredDocument(action.mdcTarget);
                    break;
                }
                var nextActiveMDCIndex = void 0;
                var activeDocs = currentState.activeDocs;
                var mdcContainerElem = document.querySelector("[data-mdc-id=" + (currentState.actionObj.mdcTarget ? currentState.actionObj.mdcTarget : mdcTarget) +
                    "]");
                if (typeof currentState.isTabbedMDC == "boolean" && currentState.isTabbedMDC && activeDocs.length === 0) {
                    mdcContainerElem.style.display = 'none';
                }
                var switchToDoc = action.recordId;
                var isLastChildSection = false;
                if (currentAction && currentAction.pyRuleType == "Section" && activeDocs && activeDocs.length ==
                    1) {
                    isLastChildSection = true;
                }
                if (isLastChildSection) {
                    // if there is only one last doc, which is 
                    // 1. default view with section
                    // 2. non-default view , but last doc is open secion document
                    nextActiveMDCIndex = currentState.actionObj.mdcTarget + "_" + activeDocs[activeDocs.length -
                        1];
                    Utils.switchToParentContext(currentState.actionObj.mdcTarget);
                }
                else if (!switchToDoc && activeDocs && activeDocs.length > 0) {
                    // regular use case if there are more than one doc left
                    nextActiveMDCIndex = currentState.actionObj.mdcTarget + "_" + activeDocs[activeDocs.length -
                        1];
                }
                else if (switchToDoc) {
                    nextActiveMDCIndex = switchToDoc;
                }
                // if there is no default view    
                if (activeDocs && activeDocs.length == 0) {
                    Utils.switchToParentContext(mdcTarget);
                }
                else if (!isLastChildSection && nextActiveMDCIndex) {
                    // tabbed usecase                        
                    if (typeof currentState.isTabbedMDC == "boolean" && currentState.isTabbedMDC) {
                        /* Skip activateTabs in case of tab click */
                        if (currentState.actionObj && !action.clientSwitch) {
                            pega.ui.Tabs.activateTabs(nextActiveMDCIndex, mdcContainerElem);
                        }
                        var activeLI = mdcContainerElem.querySelector("[data-mdc-tab-id='" +
                            nextActiveMDCIndex + "']");
                        if (activeLI) {
                            var harnessIdToSet = activeLI.getAttribute("data-harness-id");
                            if (harnessIdToSet && harnessIdToSet != "null") {
                                var nextHarnessContext_2 = pega.ctxmgr.getHarnessContext(harnessIdToSet);
                                pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setPortalName(nextHarnessContext_2);
                                pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext_2);
                            }
                            else {
                                var nextHarnessContext_3 = pega.ctxmgr.getContextByProperty("recordId", nextActiveMDCIndex);
                                pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setPortalName(nextHarnessContext_3);
                                pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext_3);
                            }
                        }
                    }
                    else {
                        // tabless usecase
                        var nextHarnessContext;
                        // BUG-488476: Getting the harness context of the body as we dont have the harnessID for static document.
                        // parentHarnessId is passed from the "pega.control.Actions.prototype.showHome" 
                        if (currentState.actionObj.parentHarnessId) {
                            nextHarnessContext = pega.ctxmgr.getHarnessContextMap()[currentState.actionObj.parentHarnessId];
                        }
                        else {
                            nextHarnessContext = pega.ctxmgr.getContextByProperty("recordId", nextActiveMDCIndex);
                        }
                        if (action.fromCloseToAdd) {
                            pega.ctxmgr.setContext(nextHarnessContext);
                        }
                        else {
                            //switch the harness context to next active context
                            pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext);
                        }
                    }
                }
                else if (typeof currentState.isTabbedMDC == "boolean" && currentState.isTabbedMDC && currentState.actionObj) {
                    var mdcContainerElem_1 = document.querySelector("[data-mdc-id=" + currentState.actionObj.mdcTarget +
                        "]");
                    pega.ui.Tabs.activateTabs(nextActiveMDCIndex, mdcContainerElem_1);
                }
                /*
                   US-316101: In case of offline we are not suppose to make any data model update call.
                   Adding !(pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal()) check to skip this step.
                */
                if (currentState.actionObj && !(pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal())) {
                    var actionObj = currentState.actionObj;
                    if (actionObj.fromClose && !action.fromCloseToAdd) {
                        if (actionObj.action !== "openSection") {
                            pega.u.d.sendReqToUpdateElementModal({
                                key: actionObj.recordKey,
                                isMDC: true,
                                action: actionObj.action,
                                mdcTarget: actionObj.mdcTarget,
                                parentThreadName: parentThreadName
                            }, "CLOSE");
                        }
                    }
                    else {
                        var acTarget = actionObj.mdcTarget ? actionObj.mdcTarget : currentAction ? currentAction.mdcTarget : "";
                        if (currentState.actionObj.parentHarnessId && pega.ctx.bIsDCSPA) {
                            pega.u.d.sendReqToUpdateElementModal({
                                key: actionObj.recordKey,
                                isMDC: true,
                                action: actionObj.action,
                                mdcTarget: acTarget,
                                parentThreadName: parentThreadName
                            }, "ACTIVE");
                        }
                        else {
                            pega.u.d.sendReqToUpdateElementModal({
                                key: actionObj.recordKey,
                                isMDC: true,
                                action: actionObj.action,
                                mdcTarget: acTarget
                            }, "ACTIVE");
                        }
                    }
                }
                /** US-324619 : Change Tracker support for ajax container case in offline **/
                if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal() && currentState.actionObj.recordId) {
                    var index = parseInt(currentState.actionObj.recordId.split("_")[1]);
                    if (currentState.mdcDocs[index] && currentState.mdcDocs[index].isHarnessInclude === "true") {
                        pega.u.d.switchThread("STANDARD/" + actionMetadata.recordId.toUpperCase());
                    }
                }
                if (currentState.actionObj) {
                    delete currentState.actionObj;
                }
                Utils.setVisibileState(mdcTarget);
                if (pega.Mashup) {
                    pega.u.d.doHarnessResize();
                }
                pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton && pega.control
                    .Actions.prototype.hideSkeleton();
                // onMDCSwitch will be deprecated in future.
                pega.ui.EventsEmitter.publishSync("onMDCSwitch", {
                    "acName": mdcTarget
                });
                pega.ui.EventsEmitter.publishSync("onACSwitch", {
                    "acName": mdcTarget
                });
                break;
            case ActionTypes.CLOSE:
                closeDocument(action.mdcTarget);
                break;
            case ActionTypes.CLOSEALL:
                closeAllDocuments(action.mdcTarget, action.isOuterDocClose);
                break;
            case ActionTypes.UPDATE:
                //Utils.setVisibileState(currentState.mdcTarget);
                break;
            case ActionTypes.ADDDEFERDOC:
                var currAction = currentState.mdcDocs[currentState.mdcDocs.length - 1];
                var pyMDCRecordId = currAction.pyMDCRecordId.split("_");
                Utils.setVisibileState(pyMDCRecordId[0]);
                break;
            case ActionTypes.LOADDEFERDOC:
                loadDeferredDocument(action.mdcTarget);
                break;
        }
        return result;
    }; }; };
    // create pega store
    var pegaStore;
    if (pega.redux.PMC) {
        pegaStore = Redux.createStore(Reducers.MDCAction);
        pegaStore.subscribe(pega.redux.PMC.subscriber);
    }
    else {
        pegaStore = Redux.createStore(Reducers.MDCAction, Redux.applyMiddleware(subscriber));
    }
    function createSafeURL(actionObj, isParentChildCase) {
        var safeURL;
        if (actionObj) {
            safeURL = new SafeURL();
            if (!isParentChildCase && pega.ctx.primaryPageName) {
                safeURL.put("pzPrimaryPageName", pega.ctx.primaryPageName);
            }
            for (var key in actionObj) {
                if (actionObj.hasOwnProperty(key) && actionObj[key]) {
                    safeURL.put(key, actionObj[key]);
                }
            }
        }
        return safeURL;
    }
    function checkIfParentChildCase(currentState) {
        if (currentState && currentState.mdcDocs) {
            for (var i = 0; i < currentState.mdcDocs.length; ++i) {
                var key = currentState.mdcDocs[i].key;
                var recordKey = currentState.mdcDocs[i].recordKey ? currentState.mdcDocs[i].recordKey.split(' ').pop() : undefined;
                if (key && recordKey && !key.includes(recordKey)) {
                    return true;
                }
            }
        }
        return false;
    }
    function closeDocument(acName) {
        var currentState = Utils.getAjaxContainerState(acName);
        var docToClose = currentState.docToClose;
        var docToCreate = currentState.docToCreate;
        if (docToClose.isFromOpenSection) {
            if (docToClose.isFromCloseToadd) {
                if (docToCreate.action !== "openSection") {
                    var mdcDocDiv = document.querySelector("div[data-mdc-id='" + acName + "'] div[data-mdc-recordid='" + docToClose.recordId + "']");
                    if (mdcDocDiv) {
                        mdcDocDiv.removeAttribute("action");
                    }
                }
                docToCreate.tabIndex = docToClose.tabIndex;
                delete currentState.docToClose;
                delete currentState.docToCreate;
                pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, docToCreate, docToClose.tabIndex));
            }
            else {
                removeDocumentElement(acName, docToClose.recordId);
                /*pega.u.d.sendReqToUpdateElementModal({
                    mdcRecordId: docToClose.recordId,
                    isMDC: true,
                    action: "openSection",
                    mdcTarget: docToClose.mdcTarget
                }, "CLOSE");*/
                pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                    "fromClose": true,
                    "mdcTarget": acName,
                    "action": "openSection"
                }));
            }
            return;
        }
        var closeDocCallback = docToClose.closeDocCallback;
        docToClose.closeDocCallback = null;
        var isParentChildCase = checkIfParentChildCase(currentState);
        var oSafeURL = createSafeURL(docToClose, isParentChildCase);
        var skipSWITCH = oSafeURL.get("skipSwitchDocument");
        var fromCloseToAdd = oSafeURL.get("fromCloseToAdd");
        function removeDocumentElement(mdcName, recordId) {
            var mdcDocDiv = document.querySelector("div[data-mdc-id='" + mdcName + "'] div[data-mdc-recordid='" +
                recordId + "']");
            if (mdcDocDiv) {
                mdcDocDiv.remove();
            }
            var mdcDocli = document.querySelector("div[data-mdc-id='" + mdcName +
                ("'] li[data-mdc-tab-id='" + recordId + "']"));
            if (mdcDocli) {
                mdcDocli.remove();
                var liNodes = document.querySelectorAll("div[data-mdc-id='" + mdcName + "'] li.mdc-tab-item");
                var currentActiveHarnessId = void 0;
                for (var i = 0; i < liNodes.length; i++) {
                    if (liNodes[i].classList.contains("active")) {
                        currentActiveHarnessId = liNodes[i].getAttribute("data-harness-id");
                        if (currentActiveHarnessId && currentActiveHarnessId != "null") {
                            var nextHarnessContext = pega.ctxmgr.getHarnessContext(currentActiveHarnessId);
                            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setPortalName(nextHarnessContext);
                            pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext);
                        }
                        break;
                    }
                }
            }
        }
        function hideDirtyModal() {
            if (pega.u.d.modalDialog && typeof pega.u.d.modalDialog.hide == 'function') {
                pega.u.d.modalDialog.hide();
            }
        }
        var doCloseContext = pega.ctx;
        if (typeof docToCreate === "undefined") {
            try {
                pega.ui.EventsEmitter.publishSync("preACClose");
            }
            catch (e) { }
        }
        var callback = {
            argument: [doCloseContext, skipSWITCH, docToCreate, docToClose, fromCloseToAdd],
            success: function (response) {
                var skipSWITCH = response.argument[1];
                var context = response.argument[0];
                var docToCreate = response.argument[2];
                var docToClose = response.argument[3];
                var fromCloseToAdd = response.argument[4];
                // if dataLoaded == false then this is my case. We need to call loadDeferDocument
                var dataLoaded = docToClose && docToClose.dataLoaded ? docToClose.dataLoaded : '';
                var mdcContName = docToClose.mdcTarget;
                //Cleaning the document before removing it from the div
                pega.u.d.cleanUpHarnessElements(null, document.querySelectorAll("[data-harness-id='" + context.pzHarnessID + "']"));
                if (!fromCloseToAdd)
                    removeDocumentElement((context.mdcName ? context.mdcName :
                        mdcContName), (context.recordId ? context.recordId : docToClose.recordId));
                var unloadHarnessId = docToClose.pzHarnessID ? docToClose.pzHarnessID : context.pzHarnessID;
                if (skipSWITCH != "true") {
                    if (skipSWITCH == "false") {
                        var currentState_1 = Utils.getAjaxContainerState(mdcContName);
                        var activeDocs = currentState_1.activeDocs;
                        /* TODO: Need to go through below commented code */
                        /*let sortedArray = activeDocs.slice();
                        let whomToActive = activeDocs[activeDocs.length - 1];
                        sortedArray.sort();
                        let keyToActivate = sortedArray.indexOf(whomToActive);
                        let activeRecordId = currentState.mdcDocs[keyToActivate].recordId;
                        */
                        //let keyToActivate = activeDocs.length - 1;
                        var keyToActivate = activeDocs[activeDocs.length - 1];
                        var activeRecordId = void 0;
                        for (var i = 0; i < currentState_1.mdcDocs.length; ++i) {
                            var currRecord = currentState_1.mdcDocs[i].recordId;
                            var currIndex = parseInt(currRecord.split("_")[1]);
                            if (currIndex === keyToActivate) {
                                activeRecordId = currRecord;
                                break;
                            }
                        }
                        //let activeRecordId = currentState.mdcDocs[keyToActivate].recordId;
                        if (dataLoaded === "" || dataLoaded === "true") {
                            context = pega.ctxmgr.getContextByProperty("recordId", activeRecordId);
                            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setPortalName(context);
                            pega.ctxmgr.setCurrentHarnessContext(context);
                        }
                    }
                    if (dataLoaded === "" || dataLoaded === "true") {
                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                            "fromClose": true,
                            "mdcTarget": context.mdcName,
                            "fromCloseToAdd": fromCloseToAdd
                        }));
                    }
                    else {
                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                            "mdcTarget": context.mdcName,
                            "fromClose": true,
                            "recordId": activeRecordId,
                            "clientSwitch": true
                        }));
                    }
                }
                else {
                    var mdcDocDiv_1 = document.querySelector("div[data-mdc-id='" + mdcContName + "']");
                    var liNodes = mdcDocDiv_1.querySelectorAll("li.mdc-tab-item");
                    var indexOfActiveLi = 0;
                    if (liNodes.length > 0) {
                        for (var i_1 = 0; i_1 < liNodes.length; i_1++) {
                            if (liNodes[i_1].classList.contains("active")) {
                                break;
                            }
                            indexOfActiveLi++;
                        }
                    }
                }
                pega.ui.HarnessContextMgr.unloadHarnessContext(unloadHarnessId, true);
                pega.u.d.resetBusyState();
                hideDirtyModal();
                if (typeof closeDocCallback === "function") {
                    closeDocCallback();
                }
                if (typeof docToCreate === "object") {
                    docToCreate.tabIndex = docToClose.tabIndex;
                    docToCreate.addFromCloseToClaim = true;
                    pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, docToCreate, docToClose.tabIndex));
                }
                // Don't publish onACClose event during 'submit' use case.
                if (typeof docToCreate === "undefined") {
                    try {
                        pega.ui.EventsEmitter.publishSync("onACClose", {
                            "acName": context.mdcName
                        });
                    }
                    catch (e) { }
                }
            },
            failure: function (o) {
                pega.u.d.resetBusyState();
                hideDirtyModal();
                console.log("doClose activity failed");
            }
        };
        oSafeURL.put("dcCleanup", "true");
        oSafeURL.put("retainLock", "false");
        if (oSafeURL && !oSafeURL.get("pyActivity")) {
            oSafeURL.put("pyActivity", "DoClose");
        }
        if (pega.u.d.isAppOfflineEnabled() && pega.u.d.ServerProxy.isDestinationLocal()) {
            removeDocumentElement(pega.ctx.mdcName, pega.ctx.recordId);
            var response = {};
            response.argument = [pega.ctx, skipSWITCH, docToCreate, docToClose, fromCloseToAdd];
            callback.success(response);
            delete currentState.docToCreate;
        }
        else {
            pega.u.d.asyncRequest('POST', oSafeURL, callback);
            delete currentState.docToCreate;
        }
    }
    function makeSyncCall(oSafeURL, callback) {
        /*jQuery.ajax({
            url: oSafeURL.toURL(),
            success: callback.success,
            failure: callback.failure,
            async: false
        });*/
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", oSafeURL.toURL(), false);
        xhttp.send();
        if (xhttp.status === 200) {
            callback.success();
        }
        else {
            callback.failure();
        }
    }
    function handleTabCloseIcon(oSafeURL, callback) {
        if (window != top) {
            var oWnd = pega.desktop.support.getDesktopWindow();
            if (!oWnd) {
                oWnd = window;
            }
            oWnd.pega.u.d.asyncRequest('POST', oSafeURL, callback);
        }
    }
    function closeAllDocuments(acName, isOuterDocClose) {
        var docsMetaData;
        var mdcDocs = [];
        var closeSynchronously;
        var forceClose;
        var recordIdsToClose = [];
        var closeAllDocsCallback;
        var sectionsToClose = [];
        var isOpenSection = false;
        if (isOuterDocClose) {
            var state = pegaStore.getState();
            var acNames = Utils.getACNames();
            var docsToClose = [];
            for (var i = 0; i < acNames.length; ++i) {
                var currACState = state[acNames[i]];
                docsToClose = docsToClose.concat(currACState.docsToCloseMetaData.docsToClose);
                recordIdsToClose = recordIdsToClose.concat(currACState.recordIdsToClose);
                if (currACState.docsToCloseMetaData.sectionsToClose.length > 0) {
                    sectionsToClose = sectionsToClose.concat(currACState.docsToCloseMetaData.sectionsToClose);
                    closeSections(acNames[i]);
                }
            }
            docsMetaData = {
                "docsToClose": docsToClose,
                "sectionsToClose": sectionsToClose
            };
            /* BUG TO FIX FOR *8.3 */
            if (acNames.length > 0) {
                closeSynchronously = state[acNames[0]].closeSynchronously;
                forceClose = state[acNames[0]].forceClose;
                closeAllDocsCallback = state[acNames[0]].closeAllDocsCallback;
            }
        }
        else {
            var currentState = Utils.getAjaxContainerState(acName);
            docsMetaData = currentState.docsToCloseMetaData;
            mdcDocs = currentState.mdcDocs;
            closeSynchronously = currentState.closeSynchronously;
            forceClose = currentState.forceClose;
            recordIdsToClose = currentState.recordIdsToClose;
            closeAllDocsCallback = currentState.closeAllDocsCallback;
            if (currentState.docsToCloseMetaData.sectionsToClose.length > 0) {
                sectionsToClose = sectionsToClose.concat(currentState.docsToCloseMetaData.sectionsToClose);
                closeSections(acName);
            }
        }
        function closeSections(acName) {
            var state = pegaStore.getState();
            isOpenSection = true;
            var currentState = state[acName];
            var isTabbedMDC = currentState.isTabbedMDC;
            if (currentState.docsToCloseMetaData.sectionsToClose.length > 0) {
                for (var i = 0; i < currentState.docsToCloseMetaData.sectionsToClose.length; i++) {
                    var sectionToClose = currentState.docsToCloseMetaData.sectionsToClose[i];
                    var mdcDocDiv = document.querySelector("div[data-mdc-id='" + acName +
                        "'] div[data-mdc-recordid='" + sectionToClose.recordId + "']");
                    if (currentState.docsToCloseMetaData.docsToClose.length == 0 && currentState.mdcDocs.length >
                        0)
                        pega.ui.MDCUtil.activateStaticContent(null, null, true, acName);
                    if (mdcDocDiv) {
                        mdcDocDiv.remove();
                        if (isTabbedMDC) {
                            removeTab(acName, sectionToClose.recordId, currentState);
                        }
                    }
                    //pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, { "mdcTarget":acName}));
                    delete currentState.sectionToClose;
                }
            }
        }
        function removeTab(acName, recordId, currentState) {
            var mdcDocli = document.querySelector("div[data-mdc-id='" + acName +
                ("'] li[data-mdc-tab-id='" + recordId + "']"));
            if (mdcDocli) {
                mdcDocli.remove();
                var liNodes = document.querySelectorAll("div[data-mdc-id='" + acName + "'] li.mdc-tab-item");
                var currentActiveHarnessId = void 0;
                for (var i = 0; i < liNodes.length; i++) {
                    if (liNodes[i].classList.contains("active")) {
                        currentActiveHarnessId = liNodes[i].getAttribute("data-harness-id");
                        if (currentActiveHarnessId && currentActiveHarnessId != "null") {
                            var nextHarnessContext = pega.ctxmgr.getHarnessContext(currentActiveHarnessId);
                            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setPortalName(nextHarnessContext);
                            pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext);
                        }
                        break;
                    }
                }
            }
            if (typeof currentState.isTabbedMDC == "boolean" && currentState.isTabbedMDC && currentState.activeDocs.length === 0) {
                var mdcContainerElem = document.querySelector("[data-mdc-id=" + acName +
                    "]");
                mdcContainerElem.style.display = 'none';
            }
        }
        var callback = {
            success: function () {
                var allMDCContainers = pega.u.d.getAllMDCContainers();
                var state = pegaStore.getState();
                function canDeleteDoc(mdcDocument) {
                    if (forceClose)
                        return true;
                    var recordId = mdcDocument.getAttribute("data-mdc-recordid");
                    if (recordIdsToClose.indexOf(recordId) == -1) {
                        return false;
                    }
                    return true;
                }
                function highlightDocument(acName) {
                    var state = pegaStore.getState();
                    // If we have a static document
                    if (state[acName].mdcDocs.length > 0) {
                        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                            "mdcTarget": acName
                        }));
                    }
                }
                for (var i = 0; i < allMDCContainers.length; ++i) {
                    var microDCDivId = allMDCContainers[i].getAttribute("data-mdc-id");
                    var microDCDocs = pega.u.d.getMicroDCDocs(microDCDivId);
                    if (state[microDCDivId] && state[microDCDivId].isTabbedMDC) {
                        microDCDocs = document.querySelectorAll("div[data-mdc-id='" + microDCDivId + "'] .mdc-content-body .mdc-tabs>div");
                    }
                    for (var j = microDCDocs.length - 1; j >= 0; j--) {
                        var pzHarnessID = microDCDocs[j].getAttribute("data-harness-id");
                        var recordId = microDCDocs[j].getAttribute("data-mdc-recordid");
                        //skip if it is a dummy MDC container
                        if (!pzHarnessID) {
                            if (forceClose) {
                                /*This is to handle static doc for section include*/
                                microDCDocs[j].remove();
                            }
                            continue;
                        }
                        if (canDeleteDoc(microDCDocs[j])) {
                            /*BUG-733184 cleanHarnessElements */
                            if (pzHarnessID) {
                                pega.u.d.cleanUpHarnessElements(null, document.querySelectorAll("[data-harness-id='" + pzHarnessID + "']"));
                            }
                            microDCDocs[j].remove();
                            removeTab(microDCDivId, recordId, state[microDCDivId]);
                            pega.ui.HarnessContextMgr.unloadHarnessContext(pzHarnessID);
                            highlightDocument(microDCDivId);
                        }
                    }
                }
                //highlightDocument();
                pega.u.d.resetBusyState();
                if (typeof closeAllDocsCallback === "function") {
                    closeAllDocsCallback();
                    closeAllDocsCallback = null;
                }
            },
            failure: function () {
                pega.u.d.resetBusyState();
                console.log("pzPooledDoClose activity failed");
            }
        };
        //skip pzPooledDoClose call when docsToClose is empty
        if ((!docsMetaData.docsToClose || !docsMetaData.docsToClose.length) && (!docsMetaData.sectionsToClose || !docsMetaData.sectionsToClose.length)) {
            if (typeof closeAllDocsCallback === "function") {
                closeAllDocsCallback();
                closeAllDocsCallback = null;
            }
            return;
        }
        if (isOuterDocClose) {
            Utils.switchToParentContext();
        }
        var oSafeURL = new SafeURL("pzPooledDoClose");
        // parentThreadName will be used in pzPooledDoClose to remove datamodel.
        if (pega.ctx.parentThreadName && pega.ctx.parentThreadName !== "") {
            docsMetaData.parentThreadName = pega.ctx.parentThreadName;
        }
        else if (pega.ctx.bIsDCSPA) {
            docsMetaData.parentThreadName = pega.ctxmgr.getDCSPAThreadName();
        }
        if (docsMetaData.docsToClose && docsMetaData.docsToClose.length > 0) {
            delete docsMetaData.sectionsToClose;
            oSafeURL.put("docsMetaData", JSON.stringify(docsMetaData));
        }
        else if (docsMetaData.sectionsToClose && docsMetaData.sectionsToClose.length > 0) {
            oSafeURL.put("action", "openSection");
        }
        if ((mdcDocs.length > 0) || (isOuterDocClose && !forceClose)) {
            oSafeURL.put("keepStaticTab", "true");
        }
        var originalCtx = pega.ctx;
        if (pega.ctx.parentThreadName) {
            pega.ctxmgr.setContext(pega.ctxmgr.getContextByThreadName(pega.ctx.parentThreadName));
        }
        if (closeSynchronously) {
            //handleTabCloseIcon(oSafeURL, callback);
            makeSyncCall(oSafeURL, callback);
        }
        else {
            pega.u.d.asyncRequest('POST', oSafeURL, callback);
        }
        pega.ctxmgr.resetContext(originalCtx);
    }
    function loadDeferredDocument(acName) {
        var currentState = Utils.getAjaxContainerState(acName);
        var docObj = currentState.defActionObj || {};
        var metaData = {};
        var docParams = {};
        if (docObj && docObj.pyParameters)
            docParams = docObj.pyParameters;
        var pyRecordKeyExist = docObj.pyRecordKeyExist;
        var action = docObj.pyAction;
        if (action == "display" || action == "Display") {
            var pyActionAPI = docObj.pyActionAPI, hostName = docObj.pyLabel, readOnly = pyActionAPI.pyReadOnly, keyValue = pyActionAPI.pyKey, preActivity = pyActionAPI.pyActivity, preActivityParams = pyActionAPI.preActivityParams, model = pyActionAPI.model, harnessClass = pyActionAPI.pyCoverClass, harnessName = pyActionAPI.pyHarnessName, isLanding = docObj.openlanding, params = {};
            if (model) {
                try {
                    var dynamicParams = pyActionAPI.pyDataTransformDynamicParams;
                    if (dynamicParams) {
                        metaData.pyDataTransformDynamicParams = encodeURIComponent(dynamicParams);
                    }
                }
                catch (e) {
                }
                model = encodeURIComponent(model);
            }
            if (preActivityParams) {
                try {
                    var dynamicParams = pyActionAPI.preActivityDynamicParams;
                    if (dynamicParams) {
                        metaData.preActivityDynamicParams = encodeURIComponent(dynamicParams);
                    }
                }
                catch (e) {
                }
                preActivityParams = encodeURIComponent(preActivityParams);
            }
            readOnly = (("0" == readOnly || "false" == readOnly) ? "false" : "true");
            metaData.action = action;
            metaData.api = action;
            metaData.model = model;
            metaData.readOnly = readOnly;
            metaData.label = hostName;
            metaData.className = harnessClass;
            metaData.harnessName = harnessName;
            metaData.loadStatus = docObj.loadStatus;
            if (isLanding == "" || isLanding == null) {
                metaData.preActivity = preActivity;
                metaData.preActivityParams = preActivityParams;
            }
            else {
                metaData.action = "Display";
                metaData.api = "Display";
                metaData.readOnly = pyActionAPI.pyReadOnly;
                metaData.landingAction = isLanding;
                metaData.levelA = pyActionAPI.levelA || "";
                metaData.levelB = pyActionAPI.levelB || "";
                metaData.levelC = pyActionAPI.levelC || "";
                var paramKeys = pyActionAPI.paramKeys;
                if (typeof paramKeys != "undefined" && paramKeys) {
                    paramKeys = paramKeys.replace(/&amp;/g, '&');
                    metaData.paramKeys = paramKeys;
                    var ar_paramKeys = paramKeys.split('&');
                    for (var i = 0; i < ar_paramKeys.length; i++) {
                        var value = docObj.pyActionAPI[ar_paramKeys[i]];
                        metaData[ar_paramKeys[i]] = value;
                    }
                }
            }
        }
        else if (pyRecordKeyExist == "true") {
            metaData.action = "openWorkByHandle";
            metaData.key = docObj.pyRecordKey;
        }
        else if (action == "openSection") {
            for (key in docParams) {
                metaData[key] = docParams[key];
            }
            metaData["pyThreadId"] = docObj.pyThreadId;
            metaData["pyThreadName"] = docObj.pyThreadName;
        }
        else {
            if (docParams) {
                var readOnly = docParams.ReadOnly;
                readOnly = (("0" == readOnly || "false" == readOnly) ? "false" : "true");
                metaData.readOnly = readOnly;
            }
            metaData.action = "displayOnPage";
            metaData.pzPrimaryPage = docObj.pzPrimaryHarnessPageName;
            metaData.className = docObj.pzPrimaryHarnessPageClass;
            metaData.harnessName = docObj.pyStreamName;
            metaData.renderAction = "displayOnPage";
        }
        if (action != "openSection") {
            metaData.threadID = docObj.pyThreadId;
            metaData.tabName = docObj.tabName;
            metaData.fromMDCDoc = docObj.fromMDCDoc;
            metaData.recordId = docObj.pyMDCRecordId;
            metaData.isMDC = docParams.isMDC;
            metaData.mdcTarget = docObj.pyMDCTarget;
            metaData.recordKey = docObj.pyRecordKey;
            metaData.tabIndex = docObj.pyIndex;
            if (currentState.parentKey) {
                metaData.parentKey = currentState.parentKey;
            }
            delete docParams.pyActivity;
            delete docParams.pzTransactionId;
        }
        if (currentState.defActionObj && currentState.defActionObj.pyParameters && currentState.defActionObj.pyParameters.NewTaskStatus && currentState.defActionObj.pyParameters.TaskIndex) {
            metaData.NewTaskStatus = currentState.defActionObj.pyParameters.NewTaskStatus;
            metaData.TaskIndex = currentState.defActionObj.pyParameters.TaskIndex;
        }
        //Utils.setVisibileState(metaData.mdcTarget);
        pega.ui.MDCUtil.microDCRenderer(metaData);
        //Object.assign(metaData, docParams);
        //pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaData));
        delete currentState.defActionObj;
    }
    return pegaStore;
})();
//static-content-hash-trigger-GCC
/***************************** Start of MDC Tabs *****************************/
(function () {
    pega.namespace("ui.Tabs");
    pega.ui.Tabs = pega.ui.Tabs || {};
    var ACNAMEPREFIX = "ac";
    var DEFAULTACNAME = "primary";
    var DEFAULTACSECNAME = "secondary";
    var setPortalName = function (harnessContext) {
        if (harnessContext.portalName == "Developer") {
            if (pega.u && pega.u.d && pega.u.d.portalName.toLowerCase() != "developer") {
                harnessContext.portalName = pega.u.d.portalName;
            }
            else {
                pega.ctxmgr.setRootDocumentContext();
                harnessContext.portalName = pega.ui.HarnessContextMgr.get("portalName");
            }
        }
    };
    var handleStaticTab = function (wrapperSec, staticDOMNodes, mdcContainer) {
        var mdcWrapper = mdcContainer.parentElement; // mdc-tabs
        var mdcNodes = Array.prototype.slice.call(mdcWrapper.children);
        /* Bring static tab inside assertive */
        for (var i = 0; i < mdcNodes.length; i++) {
            //if (mdcNodes[i].getAttribute("aria-live") != "assertive" ||(i == 0 && staticDOMNodes[i].getAttribute("aria-live") == "assertive")) {
            if (!mdcNodes[i].getAttribute("data-mdc-recordid")) {
                mdcContainer.appendChild(mdcNodes[i]);
            }
        }
        for (var i = 0; i < staticDOMNodes.length; i++) {
            wrapperSec.parentNode.appendChild(staticDOMNodes[i]);
        }
        /* Call renderTabs for static tab
        TODO: optimise if there are other tabs open other than static tab
        */
        /* short description */
        var dashBoardInfoJSON = JSON.parse(wrapperSec.parentNode.getAttribute("data-mdc-dashboardinfo"));
        var shortDescriptionSec = dashBoardInfoJSON && dashBoardInfoJSON.shortDescription ? dashBoardInfoJSON.shortDescription :
            '';
        pega.ui.Tabs.renderTabs('static', undefined, wrapperSec.parentNode.getAttribute("data-mdc-id"));
        if (shortDescriptionSec)
            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setTabName(shortDescriptionSec, wrapperSec.parentNode.getAttribute("data-mdc-id"));
        else
            pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setTabName();
    };
    var renderTabs = function (eType, scope, mdcId) {
        var mdcInPage = document.querySelectorAll(".mdc-tab-container");
        if (!mdcInPage.length)
            return;
        /* Instantiate all mdc in Page from mdcInPage array */
        //for (const mdc of mdcInPage) {
        /* set Icon Path for cases - start */
        /*let activeRecordId = pega.ctx.recordId ? pega.ctx.recordId : ""; for fixing the first tab icon rendering issue */
        var mdcContName = scope && scope.mdcName ? scope.mdcName : (mdcId ? mdcId : ACNAMEPREFIX + DEFAULTACNAME);
        var currState = pega.redux.Utils.getAjaxContainerState(mdcContName);
        if (currState && typeof currState.isTabbedMDC == "boolean" && !currState.isTabbedMDC)
            return;
        var mdc = document.querySelector(".mdc-tab-container[data-mdc-id='" + mdcContName + "']");
        var activeID = 0;
        //TODO: hardcoded for primary secondry case need to handle
        var currentState = pega.redux.Utils.getAjaxContainerState(mdcContName);
        var activeDocs = currentState.activeDocs;
        /* TODO: Need to go through below commented code */
        /*let sortedArray = activeDocs.slice();
        let activeTab = activeDocs[activeDocs.length - 1];
        sortedArray.sort();
        let keyToActivate = sortedArray.indexOf(activeTab);
        let activeRecordId = currentState.mdcDocs[keyToActivate].recordId;
        */
        var keyToActivate = activeDocs[activeDocs.length - 1];
        var activeRecordId, tabIndex;
        for (var i = 0; i < currentState.mdcDocs.length; ++i) {
            var currRecord = currentState.mdcDocs[i].recordId;
            var currIndex = parseInt(currRecord.split("_")[1]);
            if (currIndex === keyToActivate) {
                activeRecordId = currRecord;
                tabIndex = i;
                break;
            }
        }
        if (activeRecordId) {
            //let mdcCont = mdc.querySelector(`[data-mdc-id='${mdcContName}']`);
            var headerLi = mdc.querySelector(".mdc-header [data-mdc-tab-id='" + activeRecordId + "']");
            if (pega.ctx.iconPath && pega.ctx.iconPath != "null" && headerLi && headerLi.querySelector('img.open-work')) {
                headerLi.querySelector('img.open-work').src = pega.ctx.iconPath;
            }
            else if ((!pega.ctx.iconPath || pega.ctx.iconPath == "null") && scope && scope.recordId &&
                activeRecordId == scope.recordId && scope.iconPath && scope.iconPath != "null" && headerLi &&
                headerLi.querySelector('img.open-work')) {
                headerLi.querySelector('img.open-work').src = scope.iconPath;
            }
            else if ((!pega.ctx.iconPath || pega.ctx.iconPath == "null") && scope && scope.recordId &&
                activeRecordId == scope.recordId && (scope.iconPath == "" || scope.iconPath == "null") &&
                headerLi && headerLi.querySelector('img.open-work')) {
                /* remove the img tag */
                headerLi.removeChild(headerLi.querySelector('img.open-work'));
            }
            else if ((!pega.ctx.iconPath || pega.ctx.iconPath == "null") && headerLi && currentState.mdcDocs[tabIndex].pyIconPath && currentState.mdcDocs[tabIndex].pyIconPath != "") {
                /* remove the img tag */
                if (headerLi.querySelector('img.open-work')) {
                    headerLi.querySelector('img.open-work').src = currentState.mdcDocs[tabIndex].pyIconPath;
                }
                else {
                    var imgTag = document.createElement("img");
                    imgTag.setAttribute("class", "open-work");
                    imgTag.setAttribute("src", currentState.mdcDocs[tabIndex].pyIconPath);
                    headerLi.insertBefore(imgTag, headerLi.querySelector(".mdc-tab-close"));
                }
            }
        }
        /* set Icon Path for cases - end */
        /* that is undefined for static tab */
        if (eType === "success" || eType === "process" || eType === "static") {
            var allTabItems = mdc.querySelectorAll(".mdc-tab-item");
            for (var i_1 = 0; i_1 < allTabItems.length; i_1++) {
                allTabItems[i_1] && allTabItems[i_1].classList && allTabItems[i_1].classList.remove("blur-tab-name");
            }
            //activeID = allTabItems.length - 1;
            /* Handling activate tabs after refresh First time when a tab gets added it does not have a loadStatus. After refresh this gets populated hence we can distinguish using this attribute*/
            //let state = pega.redux.store.getState();
            //let mdcDocs = (state.microdc && state.microdc.mdcDocs) || [];
            /*for (let i = 0; i < mdcDocs.length; i++) {
                // || mdcDocs[i].loadStatus == "loaded" this was there previosly
                if (scope && (scope.recordId == mdcDocs[i].recordId)) {
                    activeID = i;
                    break;
                }
            }*/
            //commenting above code, no need to iterate, active id is taken from activesDocs
            activeID = tabIndex;
        }
        else if (eType === "close") {
            activeID = tabIndex;
        }
        /* Set activeID for each mdc and get the activeID in mdc node
                 let activeID = mdc.getAttribute('data-active-tab');
                 which gives me an integer
                */
        instantiateTabs(mdc, activeID);
        //}
    };
    var handleMdcTabs = function (actionMetadata, mdcContainer) {
        var wrapperSec = mdcContainer.querySelector(".mdc-tabs");
        var wrapperUl = mdcContainer.querySelector(".mdc-header > ul");
        var tabName = "";
        var actionName = actionMetadata && actionMetadata.action ? actionMetadata.action : "";
        switch (actionName) {
            case "display":
            case "openWorkByHandle":
                tabName = actionMetadata.tabName;
                break;
            case "openWorkItem":
                /*tabName = actionMetadata && actionMetadata.tabname ? actionMetadata.tabname : "New Work Item";*/
                tabName = actionMetadata.tabName;
                break;
            case "openAssignment":
                tabName = actionMetadata.tabName ? actionMetadata.tabName : mdc_openAssignment;
                break;
            case "getnextwork":
                tabName = mdc_getNext;
                break;
            case "createNewWork":
                tabName = mdc_createNewWork;
                break;
            case "displayOnPage":
                tabName = actionMetadata.tabName;
                break;
            case "openSection":
                tabName = actionMetadata.tabName ? actionMetadata.tabName : actionMetadata.StreamName;
                break;
            case "Display":
                tabName = actionMetadata.tabName ? actionMetadata.tabName : "";
                break;
            default:
                console.log("No case found!! - actionMetaData: " + actionMetadata);
        }
        /* removed the tab name for empty tabname */
        if (actionName != "displayOnPage" && (!document.getElementById(_generateID(tabName + '_' +
            actionMetadata.recordId)) || actionName === 'createNewWork') && _checkMaxDocs(mdcContainer)) {
            var params = {
                tabName: tabName,
                actionName: actionName,
                attr: {
                    class: "mdc-tab-item blur-tab-name",
                    "data-name": tabName,
                    "data-record-key": actionMetadata.pyRecordKey,
                    "role": "tab",
                    "id": _generateID(tabName + '_' + actionMetadata.recordId),
                    "data-mdc-tab-id": actionMetadata.recordId
                },
                iconPath: actionMetadata.pyIconPath
            };
            var HTMLforTab = _generateHTMLForTab(params);
            /* Set ul width to auto before appending new tabs */
            wrapperUl.style.width = "auto";
            if (wrapperUl.children.length == 0 && mdcContainer.style.display === "none") {
                mdcContainer.style.display = "";
            }
            wrapperUl.appendChild(HTMLforTab);
        }
        var tabNameFinal = (params && params.tabName) ? params.tabName : tabName;
        if (tabNameFinal)
            actionMetadata.finalTabName = tabNameFinal;
        if (pega.ui.EventsEmitter) {
            pega.ui.EventsEmitter.subscribeOnce("postMDCRender", function () {
                var mdcContName = pega.ctx.acName;
                //TODO: hardcoded for primary secondry case need to handle
                var currentState = pega.redux.Utils.getAjaxContainerState(mdcContName);
                if (currentState && currentState.activeDocs) {
                    var activeDocs = currentState.activeDocs;
                    var keyToActivate = activeDocs[activeDocs.length - 1];
                    var activeRecordId = void 0, recordKey = void 0, activeMDCDoc = void 0;
                    for (var i = 0; i < currentState.mdcDocs.length; ++i) {
                        var currRecord = currentState.mdcDocs[i].recordId;
                        var currRecordKey = currentState.mdcDocs[i].recordKey;
                        var currIndex = parseInt(currRecord.split("_")[1]);
                        if (currIndex === keyToActivate) {
                            activeMDCDoc = currentState.mdcDocs[i];
                            break;
                        }
                    }
                }
                if (activeMDCDoc && activeMDCDoc.tabName && activeMDCDoc.tabName != "") {
                    activeMDCDoc.finalTabName = activeMDCDoc.tabName;
                }
                if (activeMDCDoc.action == "createNewWork" && pega.ctx.strPyID != "" && pega.ctx.isMDC) {
                    activeMDCDoc.finalTabName = pega.ctx.strPyID;
                }
                pega && pega.ui && pega.ui.Tabs && pega.ui.Tabs.setTabName(activeMDCDoc.finalTabName, mdcContName);
            });
        }
    };
    var updateTabNameOnRefresh = function (docObj) {
        /* TODO----Try to use setTabName method. Do not have separate method */
        var action = docObj && docObj.pyAction;
        if (!action)
            action = docObj.action;
        var tabName = "";
        /* In the case of open work item action on refresh action/pyAction is not populated in clipboard. This is a temporary fix*/
        if (!action) {
            tabName = docObj.pyLabel;
            return tabName;
        }
        switch (action) {
            case "display":
            case "displayOnPage":
            case "displayonpage":
            case "openworkbyhandle":
            case "openWorkItem":
            case "openassignment":
            case "openSection":
            case "openlanding":
            case "Display":
                /* For some cases like openLanding tabInfo is not present but docObj.tabName has the value*/
                if (!tabName) {
                    if (docObj.tabName) {
                        tabName = docObj.tabName;
                    }
                    else if (docObj.pyParameters.tabName) {
                        tabName = docObj.pyParameters.tabName;
                    }
                    else if (docObj.StreamName) {
                        /* BUG-406150-In the case of open section tabname is not mandatory in such cases stream name for the section will be shown*/
                        tabName = docObj.StreamName;
                    }
                    else {
                        tabName = "";
                    }
                }
                break;
            case "getnextwork":
            case "createnewwork":
                tabName = docObj.pyLabel;
                break;
        }
        return tabName;
    };
    var updateMdcState = function (docObj, dummyDiv, mircodcElem) {
        /* Called from updateStateElemModel in case of first load */
        var wrapperSec = mircodcElem.querySelector(".mdc-tabs");
        var wrapperUl = mircodcElem.querySelector(".mdc-header > ul");
        var action = docObj && docObj.pyAction;
        if (!action)
            action = docObj.action;
        var tabName = updateTabNameOnRefresh(docObj);
        var harnessId = docObj && docObj.pyParameters && docObj.pyParameters.pzHarnessID ? docObj.pyParameters
            .pzHarnessID : "";
        var isActive = docObj.pyIsActive && docObj.pyIsActive == "true";
        if (action != "displayOnPage" && !document.getElementById(_generateID(tabName + '_' + docObj.recordId)) &&
            _checkMaxDocs(mircodcElem)) {
            var params = {
                "tabName": tabName,
                "attr": {
                    "class": "mdc-tab-item",
                    "role": "tab",
                    "data-name": tabName,
                    "data-harness-id": harnessId,
                    "id": _generateID(tabName + '_' + docObj.recordId),
                    "data-mdc-tab-id": docObj.recordId
                },
                iconPath: docObj.pyIconPath
            };
            var HTMLforTab = _generateHTMLForTab(params);
            isActive ? HTMLforTab.classList.add("active") : "";
            /* mdc-tab-id is a unique identifier which matches body to header. TODO-Generate from harness-id*/
            HTMLforTab.setAttribute("data-mdc-tab-id", docObj.pyMDCRecordId);
            wrapperUl.style.width = "auto";
            wrapperUl.appendChild(HTMLforTab);
        }
        wrapperSec.appendChild(dummyDiv);
    };
    var activateTabs = function (activeRecordId, mdcElem) {
        /*This function activates an already existing tab */
        var headerLi = mdcElem.querySelectorAll(".mdc-header > ul>li");
        /* var mdcRecord=mdcElem.querySelector("[data-mdc-recordId='"+activeRecordId+"']");
            var harnessId=mdcRecord.getAttribute("data-harness-id");*/
        for (var _i = 0; _i < headerLi.length; _i++) {
            if (headerLi[_i].getAttribute("data-mdc-tab-id") == activeRecordId) {
                instantiateTabs(mdcElem, _i);
            }
        }
    };
    var _generateHTMLForTab = function (params) {
        var arrActionIcon = ["openWorkByHandle", "openWorkItem", "openAssignment", "getnextwork",
            "createNewWork", "displayOnPage"];
        var actionName = params && params.actionName ? params.actionName : "";
        var attr = params && params.attr ? params.attr : "";
        var tabName = params && params.tabName ? params.tabName : "";
        var dummyli = document.createElement("li");
        var closeTag = document.createElement("img");
        closeTag.setAttribute("class", "close mdc-tab-close");
        closeTag.setAttribute("aria-label", "Close this tab");
        closeTag.setAttribute("title", "Close this tab");
        closeTag.setAttribute("tabindex", "0");
        closeTag.setAttribute("src", "webwb/images/pzpega-pi-close.svg");
        closeTag.setAttribute("data-click", "[[\"runScript\",[\"pega.ui.Tabs.closeMicroDcTab(event)\"]]]");
        closeTag.setAttribute("data-keydown", "[[\"runScript\", [\"pega.ui.Tabs.closeMicroDcTab(event)\"],,\"enter\"]]");
        attr && Object.keys(attr).forEach(function (key) {
            dummyli.setAttribute(key, attr[key]);
        });
        dummyli.setAttribute("data-click", "[[\"runScript\",[\"pega.ui.Tabs.loadContent(event)\"]]]");
        dummyli.innerHTML = tabName;
        dummyli.setAttribute("title", tabName);
        if (arrActionIcon.reduce(function (acc, curr) { return (curr == actionName || acc) ? true : false; }, false) || params.iconPath) {
            var imgTag = document.createElement("img");
            imgTag.setAttribute("class", "open-work");
            if (actionName == "displayOnPage" || params.iconPath)
                imgTag.setAttribute("src", params.iconPath);
            dummyli.appendChild(imgTag);
        }
        dummyli.appendChild(closeTag);
        return dummyli;
    };
    var loadContent = function (event) {
        var args = [];
        for (var _a = 1; _a < arguments.length; _a++) {
            args[_a - 1] = arguments[_a];
        }
        /*This function contains the logic to prevent calling XHR request again and again*/
        var mdcTabID = event && event.target ? event.target.getAttribute("data-mdc-tab-id") : "";
        var recordKey = event && event.target ? event.target.getAttribute("data-record-key") : "";
        var tabBodyHtml = mdcTabID && document.querySelector(".mdc-tabs div[data-mdc-recordid='" + mdcTabID + "']");
        var mdcContName = mdcTabID.split("_")[0];
        var configObj = {};
        if (!tabBodyHtml.getAttribute("data-harness-id")) {
            configObj = {
                "mdcTarget": mdcContName,
                "recordId": mdcTabID,
                "clientSwitch": true,
                "dataLoaded": false
            };
        }
        else {
            configObj = {
                "mdcTarget": mdcContName,
                "recordId": mdcTabID,
                "clientSwitch": true,
                "dataLoaded": true
            };
        }
        pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, configObj));
    };
    var closeMicroDcTab = function (event) {
        var mdcTabID = event && event.target && event.target.parentElement ? event.target.parentElement.getAttribute("data-mdc-tab-id") : "";
        var lielm = pega.ctx.dom.closest(event.target, "li");
        var recordId = lielm.getAttribute("data-mdc-tab-id");
        //var mdcContName = recordId.indexOf(DEFAULTACNAME) != -1 ? ACNAMEPREFIX+DEFAULTACNAME : ACNAMEPREFIX+DEFAULTACSECNAME;
        var mdcContName = recordId.split("_")[0];
        var isClosingSection = false;
        var recordKey = lielm.getAttribute("data-record-key");
        if (recordKey && recordKey.indexOf('openSection') != -1) {
            isClosingSection = true;
        }
        if (lielm.getAttribute("data-harness-id") === 'null' && !isClosingSection) {
            console.warn('No data-harness-id');
            return;
        }
        var oSafeURL = new SafeURL();
        oSafeURL.put("mdcTarget", mdcContName);
        oSafeURL.put("recordId", recordId);
        oSafeURL.put("isMDC", true);
        oSafeURL.put("skipSwitchDocument", "false");
        oSafeURL.put("UITemplatingStatus", "Y");
        var tabId = lielm.getAttribute("id");
        if (!isClosingSection) {
            oSafeURL.put("pyActivity", "DoClose");
            if (lielm.getAttribute("data-harness-id")) {
                oSafeURL.put("pzHarnessID", lielm.getAttribute("data-harness-id"));
            }
            if (lielm.classList.contains("active")) {
                var currentState = pega.redux.Utils.getAjaxContainerState(mdcContName);
                var activeDocs = currentState.activeDocs;
                var nextActiveMDCIndex = void 0;
                if (activeDocs && activeDocs.length > 1) {
                    nextActiveMDCIndex = mdcContName + "_" + activeDocs[activeDocs.length - 2];
                }
                var tabBodyHtml = mdcTabID && document.querySelector(".mdc-tabs div[data-mdc-recordid='" + nextActiveMDCIndex + "']");
                //let dataLoaded = tabBodyHtml.getAttribute("data-harness-id") ? "true" : "false";
                var dataLoaded = (tabBodyHtml && tabBodyHtml.childElementCount > 0) ? "true" : "false";
                oSafeURL.put("dataLoaded", dataLoaded);
            }
            /* set the con*/
            var harnessIdToMakeActive = lielm.getAttribute("data-harness-id");
            var harnessContextToLoad = pega.ctxmgr.getHarnessContext(harnessIdToMakeActive);
            if (harnessContextToLoad) {
                pega.ctxmgr.setCurrentHarnessContext(harnessContextToLoad);
            }
            else {
                /* On refresh the context does not exist so we need to get the correct context*/
                pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {
                    "mdcTarget": mdcContName,
                    "fromClose": true,
                    "recordId": recordId,
                    "clientSwitch": true,
                    "closingOnRefresh": true
                }));
            }
        }
        else {
            oSafeURL.put("isFromOpenSection", true);
        }
        if (harnessContextToLoad || isClosingSection) {
            pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSE, oSafeURL));
        }
    };
    var showMDCMenu = function (event) {
        var menuJSON = {};
        var nodeElements = [];
        var targetElement = event.target;
        var configElement = targetElement.getAttribute("data-menu-config");
        if (configElement) {
            var configJSON = JSON.parse(configElement);
        }
        var microDCElement = pega.ctx.dom.closest(targetElement, ".mdc-tab-container").querySelectorAll(".mdc-header ul .mdc-tab-item");
        var activeMenuItem = 0;
        microDCElement.forEach(function (tabItem, key) {
            var menuNode = {};
            var mdcItemId = tabItem.getAttribute("data-mdc-tab-id");
            var activeTab = tabItem.classList.contains("active");
            if (activeTab) {
                activeMenuItem = key + 1;
            }
            var leftImg = tabItem.querySelector("img:not(.close)");
            if (leftImg) {
                menuNode["pyImageSource"] = "image";
                menuNode["pySimpleImage"] = leftImg.getAttribute("src");
            }
            menuNode["pyCaption"] = tabItem.innerText;
            //menuNode["data-click"] = [["activateMDCFromMenu", [mdcItemId, ":event"]]];
            menuNode["data-click"] = [
                [
                    "runScript",
                    [("pega.ui.Tabs.activateMDCFromMenu(\"" + mdcItemId + "\",event)")]
                ]
            ];
            menuNode["nodes"] = [];
            menuNode["data-tab"] = "abcde";
            nodeElements.push(menuNode);
        });
        menuJSON["menuid"] = "microdc_menu";
        menuJSON["nodes"] = nodeElements;
        pega.control.menu.showMenuTarget = targetElement;
        if (document.querySelectorAll("#microdc_menu")) {
            document.querySelectorAll("#microdc_menu").forEach(function (ele) {
                ele.remove();
            });
        }
        pega.control.menu.createAndRenderContextMenu(menuJSON, configJSON, $(targetElement), event);
        document.querySelectorAll("#microdc_menu li").forEach(function (ele) {
            ele.classList.remove("menu-item-active");
        });
        document.querySelector("#microdc_menu li:nth-child(" + activeMenuItem + ")").classList.add("menu-item-active");
    };
    var getNameBasedOnAction = function (activeRecordId, mdcContName, activeMDCDoc) {
        if (!activeRecordId)
            return "";
        var nameOfTab = "";
        if (activeMDCDoc) {
            var action = activeMDCDoc && activeMDCDoc.action;
            /* If unresolved create new work is reloaded then action comes populated as pyAction*/
            if (!action)
                action = activeMDCDoc && activeMDCDoc.pyAction;
            switch (action) {
                case "static":
                    nameOfTab = pega.ctx.pySectionShortDesc ? pega.tools.Security.decodeCrossScriptingFilter(pega.ctx.pySectionShortDesc) : "";
                    break;
                case "display":
                    if (activeMDCDoc.isStatic) {
                        nameOfTab = pega.ctx.pyHarnessShortDesc ? pega.tools.Security.decodeCrossScriptingFilter(pega.ctx.pyHarnessShortDesc) : "";
                    }
                    else {
                        nameOfTab = activeMDCDoc.tabName;
                        /*If no name was configured for the launch harness action then pick from harness short description */
                        if (!nameOfTab && nameOfTab == "")
                            nameOfTab = pega.ctx.pyHarnessShortDesc ? pega.tools.Security
                                .decodeCrossScriptingFilter(pega.ctx.pyHarnessShortDesc) : "";
                    }
                    break;
                case "openWorkItem":
                    nameOfTab = activeMDCDoc.workID ? activeMDCDoc.workID : "";
                    break;
                case "openWorkByHandle":
                case "openAssignment":
                case "getnextwork":
                case "createNewWork":
                case "createnewwork":
                    /*Set the work id from ctx */
                    nameOfTab = pega.ctx.strPyID ? pega.tools.Security.decodeCrossScriptingFilter(pega.ctx.strPyID) :
                        "";
                    nameOfTab = (!nameOfTab && nameOfTab == "" && action.toLowerCase() === "createnewwork") ?
                        "New" : nameOfTab;
                    /* If work id is not present then set the harness short description*/
                    if (!nameOfTab && nameOfTab == "")
                        nameOfTab = pega.ctx.pyHarnessShortDesc ? pega.tools.Security
                            .decodeCrossScriptingFilter(pega.ctx.pyHarnessShortDesc) : "";
                    break;
                case "openSection":
                    /*set the tab name as defined on action configuration*/
                    nameOfTab = activeMDCDoc.tabName;
                    /*set section short description
                    nameOfTab = pega.ctx.pySectionShortDesc ? pega.tools.Security.decodeCrossScriptingFilter(
                        pega.ctx.pySectionShortDesc) : "";*/
                    break;
                case "Display":
                    /* set the label configured in action*/
                    nameOfTab = activeMDCDoc.tabName;
                    break;
            }
        }
        return nameOfTab;
    };
    var setTabName = function (nameOfTab, mdcId) {
        /* Check to see if show as Tabs is enabled. success callback case*/
        var mdcInPage = document.querySelectorAll(".mdc-tab-container");
        if (!mdcInPage)
            return;
        /*let activeRecordId = pega.ctx.recordId ? pega.ctx.recordId : "";
        let mdcContName = pega.ctx.mdcName ? pega.ctx.mdcName : "";*/
        var mdcContName = mdcId ? mdcId : ACNAMEPREFIX + DEFAULTACNAME;
        //TODO: hardcoded for primary secondry case need to handle
        var currentState = pega.redux.Utils.getAjaxContainerState(mdcContName);
        if (currentState && currentState.activeDocs) {
            var activeDocs = currentState.activeDocs;
            /* TODO: Need to go through below commented code */
            /*let sortedArray = activeDocs.slice();
            let activeTab = activeDocs[activeDocs.length - 1];
            sortedArray.sort();
            let keyToActivate = sortedArray.indexOf(activeTab);
            let activeMDCDoc = currentState.mdcDocs[keyToActivate];
            let activeRecordId = activeMDCDoc.recordId;
            let recordKey = activeMDCDoc.recordKey;
             */
            var keyToActivate = activeDocs[activeDocs.length - 1];
            var activeRecordId = void 0, recordKey = void 0, activeMDCDoc = void 0;
            for (var i = 0; i < currentState.mdcDocs.length; ++i) {
                var currRecord = currentState.mdcDocs[i].recordId;
                var currRecordKey = currentState.mdcDocs[i].recordKey;
                var currIndex = parseInt(currRecord.split("_")[1]);
                if (currIndex === keyToActivate) {
                    activeRecordId = currRecord;
                    recordKey = currRecordKey;
                    activeMDCDoc = currentState.mdcDocs[i];
                    break;
                }
            }
            if (activeRecordId && mdcContName) {
                var mdcCont = document.querySelector("[data-mdc-id='" + mdcContName + "']");
                var headerLi = mdcCont.querySelector(".mdc-header [data-mdc-tab-id='" + activeRecordId + "']");
                var correspondingContentDiv = mdcCont.querySelector(".mdc-tabs [data-mdc-recordid='" + activeRecordId + "']");
                if (headerLi) {
                    /* strpyId will either hold a value or return empty*/
                    var tabName = nameOfTab;
                    /* If no tab name is specified then get based on action*/
                    if (correspondingContentDiv && correspondingContentDiv.getAttribute("data-harness-id")) {
                        pega.ctxmgr.setCurrentHarnessContext(pega.ctxmgr.getHarnessContext(correspondingContentDiv.getAttribute("data-harness-id")));
                    }
                    else {
                        var nextHarnessContext = pega.ctxmgr.getContextByProperty("recordId", activeRecordId);
                        if (nextHarnessContext) {
                            pega.ctxmgr.setCurrentHarnessContext(nextHarnessContext);
                        }
                    }
                    if (!tabName)
                        tabName = getNameBasedOnAction(activeRecordId, mdcContName, activeMDCDoc);
                    if (tabName && tabName != "") {
                        /* code to replace the inner text only */
                        var el = headerLi, child = el.firstChild, texts = [], bIsSet = false;
                        while (child) {
                            if (child.nodeType == 3 && !bIsSet) {
                                var htmlEntityDecoder = document.createElement('div');
                                htmlEntityDecoder.innerHTML = tabName;
                                child.data = htmlEntityDecoder.innerHTML;
                                bIsSet = true;
                            }
                            else if (child.nodeType == 3 && bIsSet) {
                                child.data = "";
                            }
                            child = child.nextSibling;
                        }
                        activeMDCDoc.finalTabName = tabName;
                        headerLi.setAttribute("id", _generateID(tabName + '_' + activeRecordId));
                        headerLi.setAttribute("title", tabName);
                        pega.ui.Tabs.renderTabs("process", undefined, mdcContName);
                    }
                    if (correspondingContentDiv) {
                        headerLi.setAttribute("data-harness-id", correspondingContentDiv.getAttribute("data-harness-id"));
                        headerLi.setAttribute("data-mdc-tab-id", correspondingContentDiv.getAttribute("data-mdc-recordid"));
                        headerLi.setAttribute("data-record-key", recordKey);
                    }
                }
            }
        }
    };
    /*  const addTab = (mdcContainerId, tabName, tabInfo) => {
        if (!mdcContainerId || !tabName) return;
        let mdcCont = document.querySelector(`[data-mdc-id='${mdcContName}']`);
        let wrapperUl = mdcCont.querySelector(".mdc-header>ul");
        let params = {
          tabInfo,
          tabName
        };
        let HTMLforTab = _generateHTMLForTab(params);
        HTMLforTab.classList.add("active");
        wrapperUl.style.width = "auto";
        wrapperUl.appendChild(HTMLforTab);
      };

      const removeTab = (mdcContainerId, mdcTabId) => {
        if (!mdcContainerId || !mdcTabId) return;
        let mdcCont = document.querySelector(`[data-mdc-id='${mdcContName}']`);
        let wrapperUl = mdcCont.querySelector(".mdc-header>ul");
        let headerLi = mdcCont.querySelector(
          `.mdc-header [data-mdc-tab-id='${mdcTabId}']`
        );
        if (headerLi) {
          wrapperUl.removeChild(headerLi);
        }
      };
    */
    var activateMDCFromMenu = function (itemId, event) {
        var targetMDC = pega.ctx.dom.closest(event.target, ".mdc-tab-container").querySelector("li[data-mdc-tab-id=\"" + itemId + "\"");
        // targetMDC.classList.add('active');
        pega.u.d.focusElement = {};
        targetMDC.click();
    };
    var _generateID = function (name) {
        return name && typeof name == "string" ? name.replace(/[^\w\s]/gi, function (splChar) {
            return splChar[0].charCodeAt(0);
        }).replace(/[^\w]/gi, '_').toLowerCase() : '';
    };
    var _isValidJSONStr = function (text) {
        return (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) ? true : false;
    };
    var _checkMaxDocs = function (mdc) {
        var mdcMaxDocs = mdc.getAttribute("data-mdc-maxdocs");
        var nAssertive = mdc.querySelectorAll(".mdc-tabs>div").length;
        var bHeader = mdc.querySelectorAll(".mdc-header > ul > li").length;
        return true;
        /*if (parseInt(mdcMaxDocs) >= nAssertive && nAssertive > bHeader) {
          // allow to create new tab
          return true;
        } else {
          alert("Reached max documents");
          return false;
        }*/
    };
    var instantiateTabs = function (mdc, activeID) {
        var params = {
            main: mdc,
            header: mdc.querySelector(".mdc-header ul"),
            headerWrap: mdc.querySelector(".mdc-header"),
            content: mdc.querySelector(".mdc-content-body"),
            tabcontainer: mdc.querySelector(".mdc-tabs"),
            //BUG-490862 Nested ajax container is not supported. Fixing it without breaking the AC.
            //headers: mdc.querySelectorAll(".mdc-header ul li"),
            headers: mdc.querySelector(".mdc-header").querySelectorAll("ul li"),
            tabs: mdc.querySelectorAll(".mdc-content-body > .mdc-tabs > div[data-mdc-recordid]"),
            line: mdc.querySelector(".underline"),
            lh: mdc.querySelector(".arrow[class*='left']"),
            rh: mdc.querySelector(".arrow[class*='right']"),
            dn: mdc.querySelector(".arrow[class*='down']"),
            navArrows: mdc.querySelectorAll(".arrow"),
            active: activeID
        };
        /* get id from mdc container */
        /*
        mdc.dataset.mdcId will be microdc and secondaryac
        */
        mdc.id = mdc.dataset.mdcId;
        var existingObject = pega.ui.Tabs.tabOverflowIns.sts[mdc.id];
        if (existingObject) {
            pega.ui.Tabs.tabOverflowIns.refreshTabsInstance(existingObject, params);
        }
        else {
            new pega.ui.Tabs.tabOverflowIns(mdc, {
                active: activeID
            });
        }
    };
    Object.assign(pega.ui.Tabs, {
        handleStaticTab: handleStaticTab,
        renderTabs: renderTabs,
        handleMdcTabs: handleMdcTabs,
        updateMdcState: updateMdcState,
        activateTabs: activateTabs,
        loadContent: loadContent,
        closeMicroDcTab: closeMicroDcTab,
        showMDCMenu: showMDCMenu,
        setTabName: setTabName,
        activateMDCFromMenu: activateMDCFromMenu,
        setPortalName: setPortalName,
        instantiateTabs: instantiateTabs
    });
})();
/***************************** End of MDC Tabs *****************************/
//static-content-hash-trigger-GCC
(function () {
    pega.namespace("ui.Tabs");
    pega.ui.Tabs = pega.ui.Tabs || {};
    /* Main tab overflow class */
    var tabOverflowIns = (function () {
        /* Constructor class to create instance of tabs container */
        function tabOverflowIns(main, params) {
            this.main = main;
            this.id = main.id;
            var defaultParams = {
                header: main.querySelector(".mdc-header ul"),
                headerWrap: main.querySelector(".mdc-header"),
                content: main.querySelector(".mdc-content-body"),
                tabcontainer: main.querySelector(".mdc-tabs"),
                /* scoped to find only children */
                //BUG-490862 Nested ajax container is not supported. Fixing it without breaking the AC.
                //headers: main.querySelectorAll(".mdc-header ul li"),
                headers: main.querySelector(".mdc-header").querySelectorAll("ul li"),
                tabs: main.querySelectorAll(".mdc-content-body > .mdc-tabs > div[data-mdc-recordid]"),
                line: main.querySelector(".underline"),
                lh: main.querySelector(".arrow[class*='left']"),
                rh: main.querySelector(".arrow[class*='right']"),
                dn: main.querySelector(".arrow[class*='down']"),
                navArrows: main.querySelectorAll(".arrow"),
                num: 1,
                step: 1,
                active: 0
            };
            /* Object.assign to merge the values from params Object  */
            Object.assign(defaultParams, params);
            this.animations = this.animations();
            this.setWindowResizeEvent();
            this.refresh(defaultParams);
            this.setClickEvents();
            this.hideInvisibleContent();
            /* Add into tabOverflowIns Main */
            tabOverflowIns.addInstance(this.id, this);
            this.showContent();
            this.keyBoardNavigation();
        }
        tabOverflowIns.prototype.refresh = function (params) {
            if (params === void 0) { params = {}; }
            Object.assign(this, params);
            if (this.tabs.length < 1)
                return;
            if (!params.skip) {
                this.active = params.active || this.active || 0;
            }
            this.setProps();
            this.enableArrows();
            this.showContent();
        };
        Object.defineProperty(tabOverflowIns.prototype, "active", {
            get: function () {
                return this._active;
            },
            set: function (i) {
                i = this.getTabNumber(i);
                this._active = i;
                this.animate(this.content, 'scrollLeft', i * this.width, 50);
                /* Adjust animation time based on screen refresh rate */
                this.addTabClasses(i);
                this.enableArrows();
                var that = this;
                setTimeout(function () {
                    that.hideInvisibleContent();
                }, 300);
                this.showVisibleContent();
            },
            enumerable: true,
            configurable: true
        });
        tabOverflowIns.prototype.isTouch = function () {
            var isTouch = ("ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && (navigator.userAgent.toLowerCase().includes("mobile") || navigator.userAgent.toLowerCase().includes("tablet") && !window.MSInputMethodContext && !document.documentMode);
            return isTouch;
        };
        /* Method to toggle header arrow state in case header item has reached beginning or ending */
        tabOverflowIns.prototype.enableArrows = function () {
            if ((this.main.offsetWidth < this.header.offsetWidth) && !this.isTouch()) {
                // this.dn.style.display = 'inline-block';
                this.dn.style.display = 'flex';
                if (this.active === 0) {
                    this.lh.style.display = 'none';
                }
                else {
                    //  this.lh.style.display = 'inline-block';
                    this.lh.style.display = 'flex';
                }
                if (this.active == this.tabs.length - this.num) {
                    this.rh.style.display = 'none';
                }
                else {
                    // this.rh.style.display = 'inline-block';
                    this.rh.style.display = 'flex';
                }
            }
            else {
                this.dn.style.display = 'none';
            }
        };
        tabOverflowIns.prototype.next = function () {
            if (this.hasNext()) {
                this.active = this._active + this.step;
                this.headers[this.active].click();
            }
        };
        tabOverflowIns.prototype.scrollHeader = function (hscroll) {
            /* Make content visible on arrow navigation */
            this.showVisibleContent();
            if (this.hasNext() && hscroll === 'right') {
                this.active = this._active + this.step;
            }
            if (this.hasPrev() && hscroll === 'left') {
                this.active = this._active - this.step;
            }
            this.enableArrows();
        };
        tabOverflowIns.prototype.hasNext = function () {
            if (this.active == this.tabs.length - this.num) {
                return false;
            }
            return true;
        };
        tabOverflowIns.prototype.prev = function () {
            if (this.hasPrev()) {
                this.active = this._active - this.step;
                this.headers[this.active].click();
            }
        };
        tabOverflowIns.prototype.hasPrev = function () {
            if (this.active == 0) {
                return false;
            }
            return true;
        };
        tabOverflowIns.prototype.getTabNumber = function (i) {
            var l = this.tabs.length - this.num + 1;
            /*return i < 0 ? i + l : i % l;*/
            return i < 0 ? i + l : i;
        };
        tabOverflowIns.prototype.setProps = function () {
            var _this = this;
            /* Set width in main container to fix table width issue */
            //this.main.style.width = `${this.main.offsetParent.offsetWidth}px`;
            this.main.style.width = this.main.offsetWidth + "px";
            this.width = parseInt(this.main.style.width);
            if (this.headers && this.headers[0]) {
                /* Accomodate arrow widths */
                this.tabcontainer.style.width = this.tabs.length * this.width + "px";
                this.line.style.width = (this.headers[this._active] && this.headers[this._active].offsetWidth) + "px";
            }
            this.setheaderProps();
            this.tabcontainer.style.height = 'auto';
            this.setScrollEvent();
            /* Create array from tabs and add widths */
            var that = this;
            setTimeout(function () {
                Array.prototype.slice.call(that.tabs).forEach(function (e) { return e.style.width = _this.width + "px"; });
                that.active = that.active;
            }, 1);
        };
        tabOverflowIns.prototype.setheaderProps = function () {
            var _this = this;
            var me = this;
            var left = 0;
            this.headerProps = {};
            /* Create array from headers and add widths */
            Array.prototype.slice.call(this.headers).forEach(function (elem, i) {
                _this.headerProps[i] = {
                    width: elem.offsetWidth,
                    left: left
                };
                left += elem.offsetWidth;
                elem.addEventListener("click", function (event) {
                    if (!event.target.classList.contains("mdc-tab-close")) {
                        _this.showVisibleContent();
                        me.active = i;
                    }
                });
            });
            var last = this.headerProps[this.headers.length - 1];
            /*  40 px is added to handle tab overflow arrows in the header */
            this.header.style.width = (last.left + last.width + 2 + 40) + "px";
            /* show header arrows in case of overflow */
            if (!this.isTouch()) {
                if (this.width > this.header.offsetWidth) {
                    this.lh.style.display = 'none';
                    this.rh.style.display = 'none';
                }
                else {
                    this.lh.style.display = 'inline-block';
                    this.rh.style.display = 'inline-block';
                }
            }
        };
        tabOverflowIns.prototype.setClickEvents = function () {
            var me = this;
            var hscroll;
            /* event listeners for header arrow navigation */
            if (this.lh) {
                this.lh.addEventListener('click', function () {
                    hscroll = 'left';
                    me.scrollHeader(hscroll);
                }, {
                    passive: true,
                    capture: false
                });
            }
            if (this.rh) {
                this.rh.addEventListener('click', function () {
                    hscroll = 'right';
                    me.scrollHeader(hscroll);
                }, {
                    passive: true,
                    capture: false
                });
            }
        };
        tabOverflowIns.prototype.setScrollEvent = function () {
            var me = this;
            var isScrolling;
            var startX = 0;
            var startY = 0;
            var direction = "";
            me.content.addEventListener("scroll", function (event) {
                event.preventDefault();
                event.stopPropagation();
                onScroll();
            });
            if (this.isTouch()) {
                me.content.addEventListener("touchmove", function (event) {
                    var touchPos = getTouchPoint(event);
                    var xDisplacement = touchPos.X - startX;
                    var yDisplacement = touchPos.Y - startY;
                    var swipeLength = Math.round(Math.sqrt(Math.pow((touchPos.X - startX), 2)));
                    var left = 0;
                    var width = 0;
                    var t = me.active;
                    if (xDisplacement < 0 && Math.abs(xDisplacement) > (me.width / 3)) {
                        direction = "right";
                        t = me.active ? (me.active + 1) : 1;
                    }
                    else if (Math.abs(xDisplacement) > (me.width / 3)) {
                        direction = "left";
                        t = me.active ? (me.active - 1) : 1;
                    }
                    else {
                        direction = "";
                    }
                    if (me.headerProps[t]) {
                        left = me.headerProps[t].left;
                        width = me.headerProps[t].width;
                    }
                    if (swipeLength > 4) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    swipeLength += left;
                    me.line.style.left = swipeLength + "px";
                    me.line.style.width = width + "px";
                    me.header.parentElement.scrollLeft = swipeLength - (me.width - width) / 2;
                    clearTimeout(isScrolling);
                    isScrolling = setTimeout(function () {
                        me.active = t;
                    }, 100);
                    if (Math.abs(xDisplacement) > Math.abs(yDisplacement)) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
                me.content.addEventListener("touchend", function (event) {
                    if (direction == "right") {
                        requestAnimationFrame(onTouchStartRight);
                    }
                    else if (direction == "left") {
                        requestAnimationFrame(onTouchStartLeft);
                    }
                }, false);
                me.content.addEventListener("touchstart", function (event) {
                    if (event.touches && event.touches[0]) {
                        startX = event.touches[0].clientX;
                        startY = event.touches[0].clientY;
                    }
                }, false);
                function onTouchStartRight() {
                    var t = me.active ? (me.active + 1) : 1;
                    if (me.headerProps[t]) {
                        clearTimeout(isScrolling);
                        isScrolling = setTimeout(function () {
                            me.active += 1;
                        }, 100);
                    }
                }
                function onTouchStartLeft() {
                    if (me.active > 0) {
                        var t = me.active ? (me.active - 1) : 1;
                        var left = me.headerProps[t].left;
                        var width = me.headerProps[t].width;
                        me.line.style.left = left + "px";
                        me.line.style.width = width + "px";
                        me.header.parentElement.scrollLeft = left - (me.width - width) / 2;
                        clearTimeout(isScrolling);
                        isScrolling = setTimeout(function () {
                            me.active -= 1;
                        }, 100);
                    }
                }
            }
            function onScroll() {
                var per = (me.content.scrollLeft % me.width) / me.width;
                var t = Math.floor(me.content.scrollLeft / me.width);
                var hleft = 0;
                var hwidth = 0;
                /* left and width for the last tab calculated to 0 */
                if (me.headerProps[t + 1] !== undefined) {
                    hleft = me.headerProps[t + 1].left;
                    hwidth = me.headerProps[t + 1].width;
                }
                try {
                    var left = me.headerProps[t].left * (1 - per) + hleft * per;
                    var width = me.headerProps[t].width * (1 - per) + hwidth * per;
                    /*
                    if(me._active === 0 && t ===0){
                    } else if(me._active !== t+1){
                      return;
                    }
                    */
                    if (pega.u.d.isOrientationRTL()) {
                        me.line.style.right = left + "px";
                    }
                    else {
                        me.line.style.left = left + "px";
                    }
                    me.line.style.width = width + "px";
                    me.header.parentElement.scrollLeft = left - (me.width - width) / 2;
                }
                catch (e) { }
            }
        };
        tabOverflowIns.prototype.setWindowResizeEvent = function () {
            var me = this;
            function resizeFunc() {
                var tIns = pega.ui.Tabs.tabOverflowIns.sts;
                for (var ins in tIns) {
                    /* refresh visible ACs on resize */
                    if (tIns.hasOwnProperty(ins) && tIns[ins].main.offsetWidth > 0) {
                        tIns[ins].refresh({ skip: true });
                    }
                }
            }
            var sTimer;
            window.onresize = function () {
                clearTimeout(sTimer);
                /* wait till resize drag/maximize/minimize is completed */
                sTimer = setTimeout(resizeFunc, 800);
            };
        };
        tabOverflowIns.prototype.animate = function (who, what, to, time, type) {
            if (type === void 0) { type = 'linear'; }
            var from = who[what];
            var diff = to - from;
            var step = 1 / Math.round(time / 16) * diff;
            var me = this;
            var pos = 0;
            var raf;
            var startTime = performance.now();
            function frame(currentTime) {
                if (currentTime - startTime > time) {
                    who[what] = to;
                    return;
                }
                var percent = (currentTime - startTime) / time;
                who[what] = Math.round(me.animations[type].call(this, percent) * diff + from);
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        };
        tabOverflowIns.prototype.animations = function () {
            return {
                linear: function (i) { return i; },
                easeOut: function (i) { return i * (2 - i); }
            };
        };
        tabOverflowIns.new = function (main, params) {
            if (params === void 0) { params = {}; }
            return new tabOverflowIns(main, params);
        };
        tabOverflowIns.addInstance = function (key, value) {
            var tIns = this.sts[key];
            tIns = undefined;
            this.sts[key] = value;
        };
        tabOverflowIns.prototype.showContent = function () {
            /* Make mdc visible once rendering is complete
  
                setTimeout buffer to allow scroll animation to complete
                */
            var that = this;
            setTimeout(function () {
                that.content.style.visibility = "visible";
                that.headerWrap.style.visibility = "visible";
                for (var _i = 0, _a = that.navArrows; _i < _a.length; _i++) {
                    var arrow = _a[_i];
                    arrow.style.visibility = "visible";
                }
            }, 500);
        };
        tabOverflowIns.prototype.keyBoardNavigation = function () {
            var me = this;
            Array.prototype.slice.call(me.headers).forEach(function (headerItem) {
                //$(headerItem).off("keydown").on("keydown", pega.ui.Tabs.tabOverflowIns.prototype.handleKeyPress);
                Array.prototype.slice.call(document.querySelectorAll(".mdc-tabs>div")).forEach(function (item) {
                    item.removeEventListener("keydown", pega.ui.Tabs.tabOverflowIns.prototype.disableArrowKey, false);
                    item.addEventListener("keydown", pega.ui.Tabs.tabOverflowIns.prototype.disableArrowKey, false);
                });
                headerItem.removeEventListener("keydown", pega.ui.Tabs.tabOverflowIns.prototype.handleKeyPress, false);
                headerItem.addEventListener('keydown', pega.ui.Tabs.tabOverflowIns.prototype.handleKeyPress, false);
            });
        };
        tabOverflowIns.prototype.handleKeyPress = function (event) {
            var headerLi = event.target.classList.contains("mdc-tab-close") ? event.target.parentElement : event.target;
            // for secondary mdc/ siblings we need to handle it.
            var me = headerLi.getAttribute("data-mdc-tab-id").split("_")[0] === "acsecondary" ? pega.ui.Tabs.tabOverflowIns.sts.acsecondary : pega.ui.Tabs.tabOverflowIns.sts.acprimary;
            var key = event.keyCode; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
            switch (event.keyCode) {
                case 37:
                    // Left pressed
                    me.showVisibleContent();
                    me.prev();
                    break;
                case 39:
                    // Right pressed
                    me.showVisibleContent();
                    me.next();
                    break;
                /*
                 case "ArrowUp":
                 // Up pressed
                 me.prev();
                 break;
                 case "ArrowDown":
                 // Down pressed
                 me.next();
                 break;
                  */
                case 9:
                    // Tab pressed
                    if (!event.shiftKey) {
                        if (event.target.classList.contains("mdc-tab-item")) {
                            return false;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                        var mdcTabId = me.getActiveTab(me, this.dataset);
                        var focusContent = me.tabcontainer.querySelector('[data-mdc-recordid="' + mdcTabId + '"]');
                        pega.u.d && pega.u.d.focusFirstElement(undefined, focusContent, false);
                    }
                    break;
            }
        };
        ;
        tabOverflowIns.prototype.disableArrowKey = function (event) {
            /* BUG-708117 fix: adding check for attr data-mdc-recordid */
            if (event.target.hasAttribute("data-mdc-recordid") && (event.keyCode == 37 || event.keyCode == 39)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        tabOverflowIns.prototype.addTabClasses = function (index) {
            var prev_i = this.getTabNumber(index - 1);
            var next_i = this.getTabNumber(index + 1);
            var headers = this.headers;
            var tabs = this.tabs;
            /* tabs and headers have same length so utlizing same loop */
            if (headers.length === tabs.length) {
                for (var j = 0; j < headers.length; j++) {
                    if (j !== index && headers[j] !== index) {
                        tabs[j].classList.remove("active");
                        headers[j].classList.remove("active");
                        headers[j].removeAttribute('aria-selected');
                        headers[j].setAttribute('tabindex', -1);
                        tabs[j].setAttribute('tabindex', -1);
                    }
                    else {
                        tabs[j].classList.add("active");
                        headers[j].classList.add("active");
                        headers[j].setAttribute('aria-selected', true);
                        headers[j].setAttribute('tabindex', 0);
                        tabs[j].setAttribute('tabindex', 0);
                        headers[j].focus();
                    }
                    if (j !== prev_i && headers[j] !== prev_i) {
                        tabs[j].classList.remove("prev");
                        headers[j].classList.remove("prev");
                    }
                    else {
                        tabs[j].classList.add("prev");
                        headers[j].classList.add("prev");
                    }
                    if (j !== next_i && headers[j] !== next_i) {
                        tabs[j].classList.remove("next");
                        headers[j].classList.remove("next");
                    }
                    else {
                        tabs[j].classList.add("next");
                        headers[j].classList.add("next");
                    }
                }
            }
        };
        tabOverflowIns.prototype.hideInvisibleContent = function () {
            var me = this;
            for (var _i = 0, _a = me.tabs; _i < _a.length; _i++) {
                var tab = _a[_i];
                if (!tab.classList.contains("active")) {
                    tab.classList.add('mdc-hidden');
                    tab.classList.remove('mdc-visible');
                }
            }
        };
        tabOverflowIns.prototype.showVisibleContent = function () {
            var me = this;
            for (var _i = 0, _a = me.tabs; _i < _a.length; _i++) {
                var tab = _a[_i];
                tab.classList.add('mdc-visible');
                tab.classList.remove('mdc-hidden');
            }
        };
        /*
          This method returns active tab information.
          It is written for US-380607.
        */
        tabOverflowIns.prototype.getActiveTab = function (container, dataset) {
            if (!container.tabs)
                return dataset.mdcTabId;
            var mdcTabId = null;
            for (var i = 0; i < container.tabs.length; i++) {
                var tab = container.tabs[i];
                if (tab.classList.contains('active'))
                    mdcTabId = tab.dataset.mdcRecordid;
            }
            return (mdcTabId || dataset.mdcTabId);
        };
        tabOverflowIns.refreshTabsInstance = function (tabIns, params) {
            var me = tabIns;
            Object.assign(me, params);
            if (me.tabs.length < 1)
                return;
            me.width = me.main.offsetWidth || me.width;
            me.setProps();
            me.keyBoardNavigation();
            me.active = params.active || me.active || 0;
            me.showContent();
        };
        return tabOverflowIns;
    }());
    function getTouchPoint(e) {
        var xPos;
        var yPos;
        if (e.touches && e.touches[0]) {
            xPos = e.touches[0].clientX;
            yPos = e.touches[0].clientY;
        }
        return {
            X: xPos,
            Y: yPos
        };
    }
    Object.assign(pega.ui.Tabs, {
        tabOverflowIns: tabOverflowIns
    });
})();
/* Create NS array */
pega.ui.Tabs.tabOverflowIns.sts = pega.ui.Tabs.tabOverflowIns.sts || [];
/******************* end of tab overflow **********************/
//static-content-hash-trigger-GCC
pega.control.Actions.prototype.opensection = function () {
  var target = arguments[0];
  var section = arguments[1];
  var preActivity = arguments[2];

  var usingPage = arguments[4];
  var preDataTransform = arguments[5];
  var metadata = new SafeURL();
  var recordkey = arguments[5];
  var tabName=arguments[6];
  var dataPageParams = arguments[7];
  var sectionParams = arguments[8];
  metadata.put("mdcTarget", target);
  metadata.put("api", "openSection");
  metadata.put("action", "openSection");
  metadata.put("BaseReference",usingPage);
  metadata.put("UsingPage","true");
  metadata.put("recordKey",recordkey);
  metadata.put("tabName",tabName);
  if(usingPage && usingPage != ""){
    metadata.put("pzPrimaryPageName", usingPage);
  }else{
    metadata.put("pzPrimaryPageName", pega.ctx.primaryPageName);
  }
  metadata.put("pyActivity", "pzShowSection");
  // send the harness name and harness class, used by personalized template grid - start
  var strPHarnessClass = pega.ctx.strHarnessClass || "";
  var strPHarnessPurpose = pega.ctx.strHarnessPurpose || "";
  metadata.put("strPHarnessClass", strPHarnessClass);
  metadata.put("strPHarnessPurpose", strPHarnessPurpose);
  // send the harness name and harness class, used by personalized template grid - end
  metadata.put("StreamName", section);
  metadata.put("StreamClass", "Rule-HTML-Section");
  metadata.put("ReadOnly", "true");
  metadata.put("pyDataPage", usingPage);
  
  if(sectionParams && sectionParams.pySectionParams){
    for(var key in sectionParams.pySectionParams){
      metadata.put(key,sectionParams.pySectionParams[key]);
    }
  }
  if(dataPageParams && dataPageParams.pyDataPageParams){
    metadata.put("pyDataPageParams", dataPageParams);
    for(var key in dataPageParams.pyDataPageParams){
      metadata.put(key,dataPageParams.pyDataPageParams[key]);
    }
  }
  if (pega.ui.ChangeTrackerMap.getTracker().id) {
    metadata.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
  }
  if (pega.ui.hasAjaxContainer) {
    //pega.ui.EventsEmitter.publishSync("MDCAction", metadata);
    pega.control && pega.control.Actions && pega.control.Actions.prototype.showSkeleton && pega.control.Actions.prototype.showSkeleton();
    pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metadata));
  }
};
//static-content-hash-trigger-YUI