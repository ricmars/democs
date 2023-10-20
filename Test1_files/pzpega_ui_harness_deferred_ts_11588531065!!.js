// webwb/pzpega_ui_appview.js
// See also: webwb/pzpega_ui_screenlayout.js
//
// pega.ui.appview is configurationaly aware presenter
// pega.ui.screenlayout is view
var pega;
(function (pega) {
    var ui;
    (function (ui) {
        ui.AppView = pega.ui.appview;
        var appview;
        (function (appview) {
            var nativeConfig = {};
            var navToggleOneId = "appview-nav-toggle-one";
            var navToggleTwoId = "appview-nav-toggle-two";
            var navToggleOneClass = "nav-toggle-one";
            var navToggleTwoClass = "nav-toggle-two";
            var lastShownViaCSS = false; //it is possible for a CSS show to happen prior to native launch
            var screenLayoutAPI = null;
            var navToggleOneRegistered = false;
            var navToggleTwoRegistered = false;
            var maskToggleRegistered = false;
            var modalDialogInterval = null;
            var popOverInterval = null;
            // These constants will hold query selectors for each region and will be used by the API
            appview.REGION_TOP = "TOP";
            appview.REGION_LEFT = "LEFT";
            appview.REGION_RIGHT = "RIGHT";
            appview.REGION_BOTTOM = "BOTTOM";
            var shown = {}; // State if the given region is visible
            shown[appview.REGION_TOP] = false;
            shown[appview.REGION_LEFT] = false;
            shown[appview.REGION_RIGHT] = false;
            shown[appview.REGION_BOTTOM] = false;
            var nativeBackId = -1; // EPIC-28896 - bajaa
            var useNativeTransition = {}; // State if native configuration exists for region
            useNativeTransition[appview.REGION_TOP] = false;
            useNativeTransition[appview.REGION_LEFT] = false;
            useNativeTransition[appview.REGION_RIGHT] = false;
            useNativeTransition[appview.REGION_BOTTOM] = false;
            function _getEventParent(event) {
                var returnElement = $('.nav-toggle-one'); // default if all else fails
                if (event && event.srcElement) {
                    var searchElement = event.srcElement;
                    while (searchElement) {
                        if (searchElement.tagName == 'LI') {
                            returnElement = searchElement;
                            break;
                        }
                        searchElement = searchElement.parentNode;
                    }
                }
                return returnElement;
            }
            // This gets called in pzpega_ui_screenlayout
            appview.onScreenLayoutLoad = function (screenLayoutInterface) {
                screenLayoutAPI = screenLayoutInterface;
                $(".nav-toggle-one").click(function () {
                    pega.ui.appview.showRegion(pega.ui.appview.REGION_LEFT);
                });
                $(".nav-toggle-two").click(function () {
                    pega.ui.appview.showRegion(pega.ui.appview.REGION_RIGHT);
                });
                $("#screen-layout-mask").click(function () {
                    pega.ui.appview.hideRegion(pega.ui.appview.REGION_LEFT);
                });
                this.determineNavToggleState();
                $(window).resize(function () {
                    pega.ui.appview.determineNavToggleState();
                });
                this.subscribeToModalDialog();
                this.subscribeToPopOver();
                //configure native animation
                //by now, pega.mobile library should be loaded and any native configurations registered
                if (pega.mobile && pega.mobile.isHybridClient && window.localeDirection === "ltr") {
                    //if header_left screen layout, default left navigation
                    //move css-based logic to screenlayoutAPI
                    if ($('.screen-layout').hasClass('screen-layout-header_left') && !nativeConfig[this.REGION_LEFT]) {
                        //default HEADER_LEFT screen layouts to use native
                        this.setAnimationConfig(this.REGION_LEFT, { 'width': $('#sidebar-region-one').css('width') });
                    }
                    //if no native configuration, do not bother registering
                    if (Object.keys(nativeConfig).length) {
                        pega.mobile.hybrid.callWhenLaunchboxLoaded(function () {
                            pega.ui.appview.launch();
                        });
                    }
                }
            };
            // This will be called once launchbox is available
            // It will communicate the animation configuration to launchbox.SideBar.configure()
            appview.launch = function () {
                if (window.launchbox && window.launchbox.SideBar) {
                    //console.debug("Sidebar: configure, onbeforeshow.bind, onafterhide.bind");
                    window.launchbox.SideBar.configure(nativeConfig);
                    window.launchbox.SideBar.onBeforeShow.bind(function (region) {
                        pega.ui.appview.onBeforeShow(region);
                    });
                    window.launchbox.SideBar.onAfterHide.bind(function (region) {
                        pega.ui.appview.onAfterHide(region);
                    });
                    // enable native transitions for configured regions
                    for (var i in useNativeTransition) {
                        if (nativeConfig[i]) {
                            useNativeTransition[i] = true;
                        }
                    }
                    this.determineNavToggleState(); // initialize gesture state, must be after above commands
                }
                else {
                    console.error("SideBar not defined!");
                }
            };
            appview.subscribeToPopOver = function () {
                // check if available yet...
                if (pega.u.d && pega.u.d.addPopOverListener) {
                    pega.u.d.addPopOverListener({
                        onContentReady: function () {
                            pega.ui.appview.disableNavToggle();
                            var topLaunchBox = pega.mobile.hybrid.getLaunchBox();
                            if (topLaunchBox && topLaunchBox.SideBar) {
                                topLaunchBox.SideBar.hide();
                            }
                        },
                        onClose: function () {
                            pega.ui.appview.determineNavToggleState();
                        }
                    });
                    clearInterval(popOverInterval);
                }
                else {
                    if (!popOverInterval) {
                        popOverInterval = setInterval(function () { pega.ui.appview.subscribeToPopOver(); }, 10);
                    }
                }
            };
            appview.subscribeToModalDialog = function () {
                // check if available yet...
                if (pega.u.d && pega.u.d.modalDialog && pega.u.d.modalDialog.subscribe) {
                    //subscribe...
                    pega.u.d.modalDialog.subscribe("beforeShow", function () {
                        pega.ui.appview.disableNavToggle();
                    });
                    pega.u.d.modalDialog.subscribe("hide", function () {
                        pega.ui.appview.determineNavToggleState();
                    });
                    clearInterval(modalDialogInterval); // do not reset var, only subscribe once
                }
                else {
                    if (!modalDialogInterval) {
                        modalDialogInterval = setInterval(function () { pega.ui.appview.subscribeToModalDialog(); }, 10);
                    }
                }
            };
            appview.enableNavToggle = function () {
                if (useNativeTransition[this.REGION_LEFT]) {
                    //console.debug("Sidebar: presentsWithGesture=true");
                    window.launchbox.SideBar.presentsWithGesture = true;
                }
            };
            appview.disableNavToggle = function () {
                if (useNativeTransition[this.REGION_LEFT]) {
                    //console.debug("Sidebar: presentsWithGesture=false");
                    window.launchbox.SideBar.presentsWithGesture = false;
                }
            };
            // This will be called to trigger showing the left menu
            // It will call launchbox.SideBar.show() when in HC
            // It will apply CSS transitions when not in HC
            appview.showRegion = function (region, event) {
                //console.debug('showRegion');
                //console.debug(arguments);
                if (!region)
                    region = this.REGION_LEFT;
                //try to do native show first
                if (useNativeTransition[region]) {
                    //console.debug("Sidebar: show");
                    window.launchbox.SideBar.show(region);
                    lastShownViaCSS = false;
                    nativeBackId = pega.mobile.nativenav ? pega.mobile.nativenav.addToHistory(this.hideRegion, this) : -1;
                }
                else {
                    //fallback to css show for browsers
                    if (screenLayoutAPI) {
                        screenLayoutAPI.showPanel(region);
                    }
                    lastShownViaCSS = true;
                }
                shown[region] = true; //mark state
                $(_getEventParent(event)).addClass('appview-menu-shown'); //toggle icon css
            };
            // This will be called to trigger hiding the left menu
            // It will call launchbox.NativeMenu.hide() when in HC
            // It will apply CSS transitions when not in HC
            appview.hideRegion = function (region, event) {
                //console.debug('hideRegion');
                //console.debug(arguments);
                if (!region)
                    region = this.REGION_LEFT;
                //try to do native hide first
                if (useNativeTransition[this.REGION_LEFT] && !lastShownViaCSS) {
                    window.launchbox.SideBar.hide(region);
                }
                else {
                    //fallback to css hide for browsers
                    if (screenLayoutAPI) {
                        screenLayoutAPI.hidePanel(region);
                    }
                    lastShownViaCSS = false;
                }
                shown[region] = false; //mark state
                $(_getEventParent(event)).removeClass('appview-menu-shown'); //toggle icon css
            };
            // This is called to determine the current visibility state of a given region
            appview.isRegionShown = function (region) {
                return shown[region];
            };
            appview.toggle = function (region, event) {
                //console.debug('toggle');
                //console.debug(arguments);
                if (!region)
                    region = this.REGION_LEFT;
                if (this.isRegionShown(region)) {
                    this.hideRegion(region, event);
                }
                else {
                    this.showRegion(region, event);
                }
            };
            // Event handler to be mapped to corresponding launchbox.NativeMenu events
            // method will trigger visibility
            appview.onBeforeShow = function (region) {
                shown[region] = true;
                //console.debug("Sidebar : onBeforeShow");
                $(".screen-layout").addClass("screen-layout-expanded-s1 screen-layout-expanded-s1-animated screen-layout-expanded-s1-animate");
                document.elementFromPoint(0, 0).nodeName;
                window.launchbox.SideBar.notifyContentReady();
            };
            // Event handler to be mapped to corresponding launchbox.NativeMenu events
            // method will trigger visibility
            appview.onAfterHide = function (region) {
                shown[region] = false;
                //console.debug("Sidebar : onAfterHide");
                $(".screen-layout").removeClass("screen-layout-expanded-s1 screen-layout-expanded-s1-animated screen-layout-expanded-s1-animate");
                document.elementFromPoint(0, 0).nodeName;
                if (pega.ui && pega.ui.DCUtil) {
                    if (pega.ui.DCUtil.isLoadingInProgress) {
                        pega.ui.DCUtil.onLoadingFinished = window.launchbox.SideBar.notifyContentReady;
                    }
                    else {
                        window.launchbox.SideBar.notifyContentReady();
                    }
                }
                (pega.mobile && pega.mobile.nativenav) ? pega.mobile.nativenav.removeFromHistory(nativeBackId) : null;
                nativeBackId = "-1";
            };
            // This will be called by the Appview template harnesses
            appview.setAnimationConfig = function (region, config) {
                nativeConfig[region] = config; //do not remove!
                nativeConfig["width"] = config.width;
                nativeConfig["regionId"] = region;
            };
            //This function is used to turn on/off the hybrid client's gesturing feature.
            //If the nav-toggle icon is visible, then we want to allow the gesturing.
            //input: navTag = id of the nav-toggle element
            appview.determineNavToggleState = function () {
                var nav_toggle_state = $("." + navToggleOneClass).last().css("display");
                if (nav_toggle_state != "none" && nav_toggle_state != undefined) {
                    //console.log ("this is visible, display = " + nav_toggle_state);
                    this.enableNavToggle();
                }
                else {
                    //console.log ("this is not visible, display = " + nav_toggle_state);
                    this.disableNavToggle();
                }
            };
        })(appview = ui.appview || (ui.appview = {}));
    })(ui = pega.ui || (pega.ui = {}));
})(pega || (pega = {}));
//static-content-hash-trigger-YUI
var legacyConditionEngine = {
    ClientEventAPI: {
        parTRObject: null,
        CTDivs: null,
        returnArray: null,
        srcValue: null,
        srcIdvalue: null,
        inRepeat: false,
        elValues: [],
        srcValueURL: new SafeURL(),
        at_sectionsTable: new Array(),
        rw_preActivities: new Array(),
        dataTransforms: new Array(),
        serverRefresh: false,
        onload: function () {
            this.SWArray = [];
            this.RWArray = [];
            /* Begin: BUG-42618 Fixed: Naira */
            this.srcValueURL = new SafeURL();
            /* END: BUG-42618 Fixed: Naira */
            var isPropertyInError = false;
            if (typeof window.getErrorDB == 'function' && this.src && this.src.getAttribute)
                isPropertyInError = getErrorDB().isHavingError(this.src.getAttribute("name"));
            if (this.eventType == "SERVER" && !isPropertyInError) {
                if (this.dataTransformName && this.dataTransformName != "") {
                    this.dataTransforms.push(this.dataTransformName);
                }
                pega.u.d.reloadSection(null, this.activityName, this.activityParams, false, true, this.index, false, this.ev, this.dataTransformName ? this.dataTransforms : null);
                this.dataTransforms = [];
            }
            else if (this.eventType == "POSTCELL" && !isPropertyInError) {
                pega.control.postValue.initiatePost(this, "clientEvent");
            }
            else if (this.eventType == "CLIENT" && !isPropertyInError) {
                pega.u.d.evaluateClientConditions('ELEM', pega.u.property.toReference(this.src.getAttribute("name")), undefined, undefined, this.src);
                if (!this.serverRefresh) {
                    pega.u.d.resizeHarness();
                }
                this.serverRefresh = false;
                this.isClientEvent = false;
            }
        },
        applyConditions: function () {
            var harCtxMgr = pega.ui.HarnessContextMgr;
            pega.ctx.temp_currentCT = pega.ui.ChangeTrackerMap.getTracker();
            pega.ctx.temp_currentCT.tempPropMap = {};
            pega.ctx.temp_currentCT.tempPropValuesMap = {};
            if (harCtxMgr.get('isUITemplatized')) {
                pega.ctx.ignoreCachingSectionList = true;
                if (this.src) {
                    pega.ui.ExpressionEvaluator.handlePropertyChange(this.src);
                }
                pega.ui.ExpressionEvaluator.handleChangedProperties(pega.ctx.temp_currentCT);
                pega.ctx.ignoreCachingSectionList = false;
                if (!pega.ui.ExpressionEvaluator.getNTExpressionStatus()) {
                    pega.ctx.temp_currentCT.clearChanges();
                    pega.ctx.ct_sectionsList = new Array();
                    //Publishing event after all expressions handled on property changes
                    pega.ui.EventsEmitter.publishSync(pega.ctx.AFTER_EXPRESSIONS_HANDLED_ON_PROPERTY_CHANGES);
                    /*BUG-303230: clearing some arrays for backwards compatibility*/
                    this.at_sectionsTable = new Array();
                    this.rw_preActivities = [];
                    this.dataTransforms = [];
                    return;
                }
            }
            this.initializeVariables();
            this.findClientTargetDivs();
            var rmThreadCTs = false;
            if (!pega.ui.ChangeTrackerMap.isSingleTracker()) {
                if (pega.ctx.temp_currentCT.isPrimary) {
                    this.CTDivs = pega.ctx.dom.$("DIV#CT");
                    rmThreadCTs = true;
                }
                else {
                    if (pega.u.d.bModalDialogOpen && pega.u.d.modalDialog.body) {
                        this.CTDivs = pega.ctx.dom.$(pega.u.d.modalDialog.body).find("DIV#CT");
                    }
                    else if (pega.ctx.isMDC) {
                        this.CTDivs = pega.ctx.dom.$("DIV#CT");
                    }
                    else if (pega.u.d.ServerProxy.isDestinationRemote()) {
                        var PHDiv = document.getElementById("PEGA_HARNESS");
                        if (PHDiv && pega.ctx.temp_currentCT.threadName === PHDiv.getAttribute("thread_name")) {
                            this.CTDivs = $(PHDiv).find("DIV#CT");
                        }
                    }
                    else {
                        var FADivs = pega.ctx.dom.$("DIV#pyFlowActionHTML");
                        if (FADivs && FADivs.length > 0) {
                            for (var i = 0; i < FADivs.length; i++) {
                                if (pega.ctx.temp_currentCT.threadName === FADivs[i].getAttribute("THREAD_NAME")) {
                                    this.CTDivs = $(FADivs[i]).find("DIV#CT");
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (this.CTDivs) {
                var divTagsLength = this.CTDivs.length;
                var tempObj;
                for (var count = 0; count < divTagsLength; count++) {
                    tempObj = this.CTDivs[count];
                    if (rmThreadCTs && tempObj.getAttribute("thread_name")) {
                        this.CTDivs.splice(count, 1);
                        count--;
                        divTagsLength--;
                        continue;
                    }
                    if (tempObj.getAttribute("SWP") || tempObj.getAttribute("SHOW_WHEN") || tempObj.getAttribute("DISABLE_WHEN"))
                        this.SWArray.push(tempObj);
                    if (tempObj.getAttribute("RWP"))
                        this.RWArray.push(tempObj);
                }
            }
            this.executeVisibleWhen();
            pega.u.d.evaluateRequiredWhens();
            pega.u.d.evaluateActiveWhens();
            this.executeRefreshWhen();
            this.executeReloadCellWhen();
            this.executeReloadLayoutWhen();
            if (!this.serverRefresh) {
                pega.u.d.resizeHarness();
            }
            this.serverRefresh = false;
            this.isClientEvent = false;
            // reset
            pega.ctx.temp_currentCT.clearChanges();
            pega.ctx.temp_currentCT.tempPropMap = undefined;
            pega.ctx.temp_currentCT.tempPropValuesMap = undefined;
            pega.ctx.temp_currentCT = undefined;
            pega.ctx.ct_postedProp = undefined;
            if (!pega.u.d.isAjaxInProgress()) {
                pega.ctx.ct_sectionsList = new Array();
                //Publishing event after all expressions handled on property changes
                pega.ui.EventsEmitter.publishSync(pega.ctx.AFTER_EXPRESSIONS_HANDLED_ON_PROPERTY_CHANGES);
            }
        },
        initializeVariables: function () {
            this.activityName = undefined;
            this.activityParams = undefined;
            this.srcValueURL = new SafeURL();
            if (this && this.src) {
                if (this.src.tagName == "A") {
                    this.srcValue = this.src.value;
                }
                else {
                    /* BUG-100950: Added this condition to avoid posting textarea value whenever it is not in DOM : START */
                    if ((this.src.tagName === "TEXTAREA" || this.src.tagName === "SELECT") && !pega.ctx.dom.isInContext(this.src) && pega.ctx.dom.getElementsByName(this.src.name) && pega.ctx.dom.getElementsByName(this.src.name).length > 0) {
                        this.src = pega.ctx.dom.getElementsByName(this.src.name)[0];
                    }
                    /* BUG-100950: Added this condition to avoid posting textarea value whenever it is not in DOM : END */
                    this.srcValue = pega.u.d.getDOMElementValue(this.src);
                }
                this.srcIdvalue = this.src.getAttribute("PN");
                if (this.index && this.index != -1) {
                    this.inRepeat = true;
                }
                else {
                    // index might not be defined when repeat includes a section
                    if (typeof pega.u.d.isInRepeat === 'function') {
                        this.inRepeat = pega.u.d.isInRepeat(this.src);
                        if (this.inRepeat) {
                            this.index = pega.u.d.getRepeatRow(this.src);
                        }
                    }
                }
                /* BUG-73462 - Fix - Start */
                /* This logic will work in repeat layouts,
                where we will get same "PN" value for ui element in each row. */
                var elemList = pega.ctx.dom.$("*[name='" + this.src.name + "']");
                if (this.inRepeat && elemList && elemList.length && elemList.length > 1) {
                    /* This will skip the old executeVisibleWhen logic and
                    new Visible when logic will use FULLProps while evaluate expressions */
                    if (this.src.id == this.srcIdvalue) {
                        this.srcIdvalue = this.src.id + (this.index ? this.index : "");
                    }
                    else {
                        this.srcIdvalue = this.src.id;
                    }
                }
            }
        },
        findClientTargetDivs: function () {
            var targetDivs = null;
            var newTargetDivs = null;
            if (this.index != -1) {
                this.parTRObject = pega.u.d.getRepeatRow(this.src, true); // getRepeatRow to be defined for ClientEventAPI
                if (!this.parTRObject) {
                    this.parTRObject = pega.ctx.dom.getContextRoot();
                }
                if (this.srcIdvalue) {
                    targetDivs = $(this.parTRObject).find("DIV#" + this.srcIdvalue.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&"));
                }
                newTargetDivs = $(this.parTRObject).find("DIV#CT");
                if (newTargetDivs == null && this.parTRObject.tagName == 'TD') {
                    newTargetDivs = new Array();
                    var index = this.parTRObject.getAttribute("PL_INDEX");
                    var repeatTable = pega.u.d.findParentTable(this.parTRObject);
                    var noOfRows = repeatTable.rows.length;
                    for (var i = 0, cnt = 0; i < noOfRows; i++) {
                        var repeatColumn = repeatTable.rows[i].cells[index];
                        var hasCT = $(repeatColumn).find("DIV#CT");
                        if (hasCT)
                            newTargetDivs[cnt++] = hasCT[0];
                    }
                }
            }
            else if (this.index == -1) {
                if (this.srcIdvalue) {
                    targetDivs = pega.ctx.dom.$("DIV#" + this.srcIdvalue.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&"));
                }
                newTargetDivs = pega.ctx.dom.$("DIV#CT");
            }
            if (targetDivs && targetDivs.length > 0 && newTargetDivs) {
                targetDivs = targetDivs.concat(newTargetDivs);
            }
            else if (newTargetDivs) {
                targetDivs = newTargetDivs;
            }
            this.CTDivs = targetDivs;
        },
        executeVisibleWhen: function () {
            var divLength = this.SWArray.length;
            var tempObj;
            pega.ctx.elementsMadeVisible = []; //tracks is a element has been made visible by the old expression evaluation
            pega.ctx.elementsDisabled = []; //tracks is a element had been disabled by the old expression evaluation
            /*Code for New Evaluation Engine - Autobots - start*/
            if (pega.u.property.toReference) {
                var completeName = pega.u.property.toReference(this.src.name);
                var ctDivs = this.SWArray;
                if (ctDivs) {
                    for (var i = 0; i < ctDivs.length; i++) {
                        var currDiv = ctDivs[i];
                        /*Get Configured Expression*/
                        var configuredCondition = currDiv.getAttribute('SHOW_WHEN');
                        var reserveSpace = currDiv.getAttribute('RESERVE_SPACE');
                        var stringType = currDiv.getAttribute('STRING_TYPE');
                        var isVisibleWhen = true;
                        if (!configuredCondition) {
                            configuredCondition = currDiv.getAttribute('DISABLE_WHEN');
                            if (!configuredCondition)
                                continue;
                            else
                                isVisibleWhen = false;
                        }
                        /*Get Section's Base Reference and included section*/
                        var sectionBaseRef = null;
                        if (isVisibleWhen) {
                            var sectionData = "";
                            if (currDiv.getAttribute("data-simplelayout")) {
                                sectionData = pega.u.d.calcAndAttachSectionBaseRef(currDiv, true);
                            }
                            else {
                                sectionData = pega.u.d.calcAndAttachSectionBaseRef(currDiv);
                            }
                            sectionBaseRef = sectionData.sectionBaseRef;
                            if (sectionBaseRef == 'nosection') {
                                var gridObj = null;
                                if (typeof (Grids) != 'undefined') {
                                    gridObj = Grids.getElementsGrid(currDiv);
                                }
                                sectionBaseRef = pega.u.d.getBaseRef(currDiv, null, gridObj);
                                if (sectionBaseRef == '') {
                                    sectionBaseRef = pega.u.d.getElementRowPageRef(currDiv);
                                }
                                sectionData.baseRef4ConditionEval = sectionBaseRef;
                            }
                        }
                        else {
                            sectionBaseRef = pega.u.d.getBaseRef(currDiv);
                            if (sectionBaseRef == '') {
                                sectionBaseRef = pega.u.d.getElementRowPageRef(currDiv);
                            }
                            var sectionData = {};
                            sectionData.baseRef4ConditionEval = sectionBaseRef;
                        }
                        /*The DIV has ct div configuration is messed up*/
                        if (sectionBaseRef == null || sectionBaseRef == 'nosection')
                            continue;
                        var conditionTokensNOperator = pega.u.d.getConditionTokensAndOperator(configuredCondition);
                        var conditionTokens = conditionTokensNOperator.conditionTokens;
                        var combOperator = conditionTokensNOperator.combOperator;
                        var resultsArr = [];
                        for (var j = 0; j < conditionTokens.length; j++) {
                            var currentToken = pega.lang.trim(conditionTokens[j]);
                            resultsArr[j] = pega.u.d.isRegularTarget(currentToken, sectionData.baseRef4ConditionEval, currDiv);
                        }
                        var rwcpValue = currDiv.getAttribute("FULLPROPS");
                        var executeExpression = false;
                        if (rwcpValue) {
                            var rwcpArray = rwcpValue.split(",");
                            for (var l = 0; l < rwcpArray.length; l++) {
                                if (pega.u.d.isExpressionMatching(null, completeName, rwcpArray[l], rwcpArray[l])) {
                                    executeExpression = true;
                                    break;
                                }
                                else if (pega.u.d.temp_currentCT.isExpressionMatchingWithTrackedProps(rwcpArray[l])) {
                                    executeExpression = true;
                                    break;
                                }
                            }
                        }
                        if (executeExpression) {
                            var expression = "";
                            for (var k = 0; k < resultsArr.length; k++) {
                                if (k == 0)
                                    expression = resultsArr[k];
                                else
                                    expression = expression + combOperator + resultsArr[k];
                            }
                            if (eval(expression)) {
                                if (isVisibleWhen && reserveSpace == "true") {
                                    currDiv.style.visibility = "visible";
                                    currDiv.setAttribute("aria-hidden", "false");
                                }
                                else if (isVisibleWhen) {
                                    // make sure we are not looking at the run on client wrapper div
                                    var isWrapperDiv = "false";
                                    var child = $(currDiv).children().first()[0];
                                    if (child) {
                                        var wrapperClass = child.className.replace("layout-content", "");
                                        if (wrapperClass != child.className)
                                            isWrapperDiv = "true";
                                    }
                                    conditionEngine.columnLayout_show(currDiv);
                                    if (currDiv.className == "" && child && child.className == "content-inner" && isWrapperDiv == "false") {
                                        var prevClass = 1;
                                        //get content item number from previous sibling
                                        if ($(currDiv).prev()) {
                                            prevClass = $(currDiv).prev().className.match(/\d+/);
                                            prevClass++;
                                            currDiv.className = "content-item content-" + stringType + " item-" + prevClass;
                                        }
                                        else
                                            currDiv.className = "content-item content-" + stringType + " item-" + prevClass;
                                        // update content-item numbers for any content-items after the current one
                                        var tempDiv = currDiv;
                                        while ($(tempDiv).next()) {
                                            if ($(tempDiv).next().className != "") {
                                                prevClass++;
                                                $(tempDiv).next().className = $(tempDiv).next().className.replace(/\d+/, "");
                                                $(tempDiv).next().className = $(tempDiv).next().className.replace("item-", "item-" + prevClass.toString());
                                            }
                                            tempDiv = $(tempDiv).next();
                                        }
                                        currDiv.style.display = "";
                                    }
                                    else {
                                        /* Handle layout group - if all layout are hidden - we need to activate this layout */
                                        if (currDiv.parentNode && currDiv.parentNode.className.indexOf("content-layout-group") != -1 &&
                                            currDiv.className.indexOf("layout") == 0) {
                                            var bNoVisibleLayout = true;
                                            var layoutGroupNode = currDiv.parentNode;
                                            var layoutchild = $(layoutGroupNode).children().first()[0];
                                            while ($(layoutchild).next()) {
                                                layoutchild = $(layoutchild).next()[0];
                                                // look if layout is visible
                                                if (layoutchild && layoutchild.style.display != "none" &&
                                                    layoutchild.className.indexOf("layout") == 0) {
                                                    bNoVisibleLayout = false;
                                                    break;
                                                }
                                            }
                                            if (bNoVisibleLayout)
                                                LayoutGroupModule.setLayoutActive(currDiv);
                                        }
                                        currDiv.style.display = "";
                                    }
                                }
                                else
                                    pega.u.d.controlDisabler(currDiv);
                            }
                            else {
                                if (isVisibleWhen) {
                                    /*Element will be hidden only if it was not made visible by the old expression evaluation logic*/
                                    var madeVisible = false;
                                    for (var k = 0; k < pega.ctx.elementsMadeVisible.length; k++) {
                                        if (pega.ctx.elementsMadeVisible[k] == currDiv)
                                            madeVisible = true;
                                    }
                                    if (!madeVisible && reserveSpace == "true") {
                                        currDiv.style.visibility = "hidden";
                                        currDiv.setAttribute("aria-hidden", "true");
                                    }
                                    else if (!madeVisible) {
                                        // make sure we are not looking at the run on client wrapper div
                                        var isWrapperDiv = "false";
                                        var child = $(currDiv).children().first()[0];
                                        if (child) {
                                            var wrapperClass = child.className.replace("layout-content", "");
                                            if (wrapperClass != child.className)
                                                isWrapperDiv = "true";
                                        }
                                        conditionEngine.columnLayout_hide(currDiv);
                                        if (child && child.className == "content-inner" && isWrapperDiv == "false") {
                                            var classNum = "1";
                                            if (currDiv.className != "") {
                                                classNum = currDiv.className.match(/\d+/);
                                            }
                                            else {
                                                // get previous content item number
                                                var tempDiv = $(currDiv).prev();
                                                while (tempDiv && tempDiv.className == "")
                                                    tempDiv = $(tempDiv).prev();
                                                if (tempDiv && tempDiv.className != "") {
                                                    classNum = tempDiv.className.match(/\d+/);
                                                    classNum++;
                                                }
                                            }
                                            currDiv.className = "";
                                            currDiv.style.display = "none";
                                            // renumber content items
                                            while ($(currDiv).next()) {
                                                currDiv = $(currDiv).next();
                                                var nextClass = currDiv.className;
                                                if (nextClass != "") {
                                                    currDiv.className = currDiv.className.replace(/\d+/, "");
                                                    currDiv.className = currDiv.className.replace("item-", "item-" + classNum.toString());
                                                    classNum++;
                                                }
                                            }
                                        }
                                        else {
                                            currDiv.style.display = "none";
                                            /* Handle layout group - if this is the active layout we need to switch to another layout */
                                            if (currDiv.parentNode && currDiv.parentNode.className.indexOf("content-layout-group") != -1 &&
                                                currDiv.className.indexOf("layout") == 0 && currDiv.className.indexOf(" active") != -1) {
                                                LayoutGroupModule.setLayoutInactive(currDiv);
                                                var layoutGroupNode = currDiv.parentNode;
                                                var layoutchild = $(layoutGroupNode).children().first()[0];
                                                while ($(layoutchild).next()) {
                                                    layoutchild = $(layoutchild).next()[0];
                                                    // look for the first visible layout
                                                    if (layoutchild && layoutchild.style.display != "none" &&
                                                        layoutchild.className.indexOf("layout") == 0) {
                                                        LayoutGroupModule.setLayoutActive(layoutchild);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    /*Element will be enabled only if it was not disabled by the old expression evaluation logic*/
                                    var madeDisabled = false;
                                    for (var k = 0; k < pega.u.d.elementsDisabled.length; k++) {
                                        if (pega.u.d.elementsDisabled[k] == currDiv)
                                            madeDisabled = true;
                                    }
                                    if (!madeDisabled)
                                        pega.u.d.controlEnabler(currDiv);
                                }
                            }
                        }
                    }
                    if (typeof LayoutGroupModule != "undefined")
                        LayoutGroupModule.updateStretchTabWidths();
                }
            }
            /*Code for New Evaluation Engine - Autobots - End*/
        },
        getElementValues: function () {
            if (this.clientTargets.length == 1) {
                this.elValues[0] = this.srcValue;
                this.srcValueURL.put(this.src.name, this.srcValue);
            }
            else {
                for (var j = 0; j < this.clientTargets.length; j++) {
                    if (this.inRepeat) {
                        var targetId = this.clientTargets[j].split(".");
                        if (targetId)
                            var inputElt = $(this.parTRObject).find("#" + targetId[targetId.length - 1].replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&"));
                        else
                            var inputElt = $(this.parTRObject).find("#" + this.clientTargets[j].substring(1).replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&"));
                        if (inputElt)
                            inputElt = inputElt[0];
                    }
                    else {
                        var targetId = this.clientTargets[j].split(".");
                        if (targetId)
                            var inputElt = pega.ctx.dom.getElementById(targetId[targetId.length - 1]);
                        else
                            var inputElt = pega.ctx.dom.getElementById(this.clientTargets[j].substring(1));
                    }
                    if (inputElt) {
                        this.elValues[j] = pega.u.d.getDOMElementValue(inputElt);
                        if (inputElt.name && this.elValues[j] != null)
                            this.srcValueURL.put(inputElt.name, this.elValues[j]);
                    }
                    else {
                        this.elValues[j] = null;
                    }
                }
            }
        },
        executeReloadCellWhen: function () {
            var refreshTargets = pega.u.d.getRefreshableTargets("changes", this.src, true);
            pega.u.d.reloadCells(refreshTargets);
        },
        executeReloadLayoutWhen: function () {
            this.at_sectionsTable = new Array();
            this.rw_preActivities = [];
            this.dataTransforms = [];
            this.at_layouts2refresh = null;
            if (pega.u.property.toReference) {
                var refreshTargets = pega.u.d.getRefreshableTargets("changes", this.src, false, true);
                var sections = null;
                var preActivities = null;
                var dataTransforms = null;
                var declarePageParams = null;
                var layouts2refresh = null;
                if (refreshTargets) {
                    sections = refreshTargets.sections;
                    if ((pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) && sections) {
                        var sectionsMsgStr = "";
                        for (var i = 0; i < sections.length; i++) {
                            sectionsMsgStr += "'" + sections[i].getAttribute("node_name") + "'";
                            if (i != sections.length - 1) {
                                sectionsMsgStr += ",";
                            }
                        }
                        alert("Refresh when configured on layout(s) in " + sectionsMsgStr + " section(s) is not supported in offline");
                        return;
                    }
                    preActivities = refreshTargets.preActivities;
                    dataTransforms = refreshTargets.dataTransforms;
                    declarePageParams = refreshTargets.declarePageParams;
                    layouts2refresh = refreshTargets.cells2refresh;
                }
                if (layouts2refresh) {
                    this.at_layouts2refresh = new Array();
                }
                if (sections) {
                    var elementValue = pega.u.d.getDOMElementValue(this.src);
                    this.srcValueURL.put(this.src.name, elementValue);
                    for (var i = 0; i < sections.length; i++) {
                        var isSectionPresent = false;
                        for (var j = 0; j < this.at_sectionsTable.length; j++) {
                            if (this.at_sectionsTable[j] == sections[i] && this.at_layouts2refresh[j].getAttribute('data-methodName') == layouts2refresh[i].getAttribute('data-methodName')) {
                                isSectionPresent = true;
                                break;
                            }
                        }
                        if (!isSectionPresent) {
                            this.at_sectionsTable.push(sections[i]);
                            this.at_layouts2refresh.push(layouts2refresh[i]);
                        }
                    }
                }
                if (preActivities) {
                    for (var i = 0; i < preActivities.length; i++) {
                        var isActivityPresent = false;
                        for (var j = 0; j < this.rw_preActivities.length; j++) {
                            if (this.rw_preActivities[j] == preActivities[i]) {
                                isActivityPresent = true;
                                break;
                            }
                        }
                        if (!isActivityPresent) {
                            this.rw_preActivities.push(preActivities[i]);
                        }
                    }
                }
                if (dataTransforms) {
                    for (var i = 0; i < dataTransforms.length; i++) {
                        var isDataTransformPresent = false;
                        for (var j = 0; j < this.dataTransforms.length; j++) {
                            if (this.dataTransforms[j] == dataTransforms[i]) {
                                isDataTransformPresent = true;
                                break;
                            }
                        }
                        if (!isDataTransformPresent) {
                            this.dataTransforms.push(dataTransforms[i]);
                        }
                    }
                }
            }
            /*Code for New Evaluation Engine - Autobots - end*/
            if (this.at_sectionsTable.length > 0) {
                var srcString = this.srcValueURL;
                // ETCHASKETCH
                pega.u.d.reloadSections(srcString, this.at_sectionsTable, this.activityName, this.activityParams, this.index, this.ev, this.rw_preActivities, this.dataTransforms, declarePageParams, this.at_layouts2refresh);
                this.serverRefresh = true;
            }
        },
        executeRefreshWhen: function () {
            this.at_sectionsTable = new Array();
            this.rw_preActivities = [];
            this.dataTransforms = [];
            var divLength = this.RWArray.length;
            /*for (var i = 0; i < divLength; i++) {
              var clientTarget = this.RWArray[i].getAttribute("RWP");

              this.clientTargets = clientTarget.split(",");
              this.getElementValues();

              for (var j = 0; j < this.clientTargets.length; j++) {
                //Fetching only those div tags whose id is equal to the id of the source Property
                if (this.clientTargets[j] == this.srcIdvalue) {
                  this.refresh(this.RWArray[i]);
                }
              }
            }*/
            /*Code for New Evaluation Engine - Autobots - start*/
            if (pega.u.property.toReference) {
                var refreshTargets = pega.u.d.getRefreshableTargets("changes", this.src);
                var sections = null;
                var preActivities = null;
                var dataTransforms = null;
                var declarePageParams = null;
                var gridsWithRowsToRefresh = null;
                var grids = null;
                if (refreshTargets) {
                    sections = refreshTargets.sections;
                    preActivities = refreshTargets.preActivities;
                    dataTransforms = refreshTargets.dataTransforms;
                    declarePageParams = refreshTargets.declarePageParams;
                    grids = refreshTargets.gridsToRefresh;
                    gridsWithRowsToRefresh = refreshTargets.gridsWithRowsToRefresh;
                }
                if (sections) {
                    var elementValue = pega.u.d.getDOMElementValue(this.src);
                    this.srcValueURL.put(this.src.name, elementValue);
                    for (var i = 0; i < sections.length; i++) {
                        var isSectionPresent = false;
                        for (var j = 0; j < this.at_sectionsTable.length; j++) {
                            if (this.at_sectionsTable[j] == sections[i]) {
                                isSectionPresent = true;
                                break;
                            }
                        }
                        if (!isSectionPresent) {
                            this.at_sectionsTable.push(sections[i]);
                        }
                    }
                }
                if (preActivities) {
                    for (var i = 0; i < preActivities.length; i++) {
                        var isActivityPresent = false;
                        for (var j = 0; j < this.rw_preActivities.length; j++) {
                            if (this.rw_preActivities[j] == preActivities[i]) {
                                isActivityPresent = true;
                                break;
                            }
                        }
                        if (!isActivityPresent) {
                            this.rw_preActivities.push(preActivities[i]);
                        }
                    }
                }
                if (dataTransforms) {
                    for (var i = 0; i < dataTransforms.length; i++) {
                        var isDataTransformPresent = false;
                        for (var j = 0; j < this.dataTransforms.length; j++) {
                            if (this.dataTransforms[j] == dataTransforms[i]) {
                                isDataTransformPresent = true;
                                break;
                            }
                        }
                        if (!isDataTransformPresent) {
                            this.dataTransforms.push(dataTransforms[i]);
                        }
                    }
                }
                if (grids) {
                    for (var gridID in grids) {
                        var dpParams = grids[gridID];
                        var gridObj = Grids.map[gridID];
                        var params = null;
                        if (dpParams.length !== 0) {
                            var urlDPParams = new SafeURL();
                            try {
                                /*BUG-105947: DECODING THE PARAMS BEFORE SENDING THEM TO SERVER*/
                                urlDPParams.put("declarePageParams", decodeURIComponent(JSON.stringify(dpParams)));
                            }
                            catch (decErr) {
                                urlDPParams.put("declarePageParams", JSON.stringify(dpParams));
                            }
                            params = {
                                "dpParams": urlDPParams
                            };
                        }
                        gridObj.doGridAction({
                            target: gridObj.gridDiv
                        }, "REFRESHLIST", null, params);
                    }
                }
                if (gridsWithRowsToRefresh) {
                    var gridQueue = null;
                    for (var i = 0; i < gridsWithRowsToRefresh.length; i++) {
                        if (i == 0)
                            gridQueue = new pega.tools.Queue();
                        if (gridsWithRowsToRefresh[i].rowsToRefresh) {
                            gridQueue.enqueue({
                                GridToRefresh: gridsWithRowsToRefresh[i]
                            });
                        }
                    }
                    if (gridQueue) {
                        pega.u.d.gridLoadManager = new pega.ui.GridRowsLoadManager({
                            "loadQueue": gridQueue
                        });
                        pega.u.d.gridLoadManager.startLoading();
                    }
                }
            }
            /*Code for New Evaluation Engine - Autobots - end*/
            if (this.at_sectionsTable.length > 0) {
                var srcString = this.srcValueURL;
                // ETCHASKETCH
                pega.u.d.reloadSections(srcString, this.at_sectionsTable, this.activityName, this.activityParams, this.index, this.ev, this.rw_preActivities, this.dataTransforms, declarePageParams);
                this.serverRefresh = true;
            }
        },
        refresh: function (targetDiv) {
            var finalArray = [];
            var expValue = targetDiv.getAttribute("RW");
            //ETCHASKETCH
            var expPreAcValue = targetDiv.getAttribute("RWA");
            var expDataTransform = targetDiv.getAttribute("PDT");
            var idxValue = targetDiv.index;
            var returnval = false;
            if (this.inRepeat == true) {
                idxValue = pega.u.d.getRepeatRow(targetDiv);
            }
            if (!idxValue && !(this.inRepeat == true)) {
                idxValue = -1;
            }
            if (idxValue == this.index) {
                returnval = pega.u.d.evaluate(expValue, this.clientTargets, this.elValues);
            }
            if (returnval) {
                finalArray.push(targetDiv);
            }
            var Len = finalArray.length;
            if (Len > 0) {
                /****** Get the rule_key of included section ********/
                for (var count = 0; count < Len; count++) {
                    var iter = finalArray[count];
                    var sectionNode = null;
                    while (sectionNode == null && iter != null) {
                        sectionNode = pega.u.d.getIncludedSection(finalArray[count]);
                        iter = iter.parentNode;
                    }
                    if (sectionNode != null) {
                        var sectionName = sectionNode.getAttribute("node_name");
                        this.at_sectionsTable.push(sectionNode);
                        //ETCHASKETCH
                        if (expPreAcValue && expPreAcValue != '') {
                            this.rw_preActivities.push(expPreAcValue + "<||>" + pega.u.d.getBaseRef(sectionNode));
                        }
                        //ETCHASKETCH
                        if (expDataTransform && expDataTransform != '') {
                            this.dataTransforms.push(expDataTransform + "<||>" + pega.u.d.getBaseRef(sectionNode));
                        }
                    }
                }
            }
        },
        executeDisableWhen: function (targetDiv) {
            var nameval = targetDiv.getAttribute("name");
            if (nameval == this.srcIdvalue) {
                pega.u.d.enableDisable(targetDiv, this.index, this.srcValue, this.srcIdvalue, this.inRepeat);
            }
        }
    },
    getRefreshableTargets: function (origin, data, rcw, layoutrefresh) {
        var sections2refresh = null;
        var preActivities = null;
        var dataTransforms = null;
        var cells2refresh = null;
        var completeName = null;
        var secDeclarePageParams = null;
        var gridsToRefresh = null;
        var gridsWithRowsToRefresh = [];
        var rwAttrList = (rcw ? ["RC"] : ["RW", "data-dprw", "IRW", "RRW"]);
        var ctDivs = null;
        if (origin == "changes") {
            completeName = pega.u.property.toReference(data.name);
        }
        if (layoutrefresh) {
            rcw = true;
            ctDivs = pega.ctx.dom.$("div[data-refresh='true']");
        }
        else {
            ctDivs = pega.ctx.dom.$("DIV#CT");
        }
        if (ctDivs) {
            for (var i = 0; i < ctDivs.length; i++) {
                var currDiv = ctDivs[i];
                var isGrid = false;
                if (currDiv.getAttribute("RLW")) {
                    isGrid = true;
                }
                // Refresh Rows : Start
                var gridMixed = false;
                if (currDiv.getAttribute("RRW") && currDiv.getAttribute("type") != "allGlobals") {
                    this.addGridRowsToCTDivs(ctDivs, currDiv, gridsWithRowsToRefresh, data);
                    /* BUG-148250: If CT div has attribute other than RRW from rwAttrList then don't skip the iteration. example a div may have both RRW and IRW and in this case IRW gets skipped. */
                    var skipIteration = true;
                    for (var k = 0; k < rwAttrList.length; k++) {
                        if (rwAttrList[k] != "RRW") {
                            if (currDiv.getAttribute(rwAttrList[k]) != undefined) {
                                skipIteration = false;
                                break;
                            }
                        }
                    }
                    if (skipIteration) {
                        continue;
                    }
                }
                if (currDiv.rowRef && currDiv.rowRef != "") {
                    isGrid = true;
                    gridMixed = true;
                }
                // Refresh Rows : end
                /*Get Section's Base Reference and included section*/
                if (!isGrid) {
                    var sectionData = pega.u.d.calcAndAttachSectionBaseRef(currDiv, rcw);
                    var sectionBaseRef = sectionData.sectionBaseRef;
                    /*The DIV has ct div configuration, but has no section inside it*/
                    if (sectionBaseRef == 'nosection')
                        continue;
                    var baseRef4ConditionEval = sectionData.baseRef4ConditionEval;
                }
                else {
                    if (gridMixed) {
                        var baseRef4ConditionEval = currDiv.rowRef;
                        var sectionBaseRef = currDiv.rowRef;
                    }
                    else {
                        var baseRef4ConditionEval = this.getBaseRef(currDiv);
                        var sectionBaseRef = baseRef4ConditionEval;
                    }
                }
                for (var idx = 0; idx < rwAttrList.length; idx++) {
                    /*Get Configured Expression*/
                    if (gridMixed && rwAttrList[idx] == "RRW") {
                        var configuredCondition = currDiv.configuredCondition;
                    }
                    else {
                        var configuredCondition = currDiv.getAttribute(rwAttrList[idx]);
                    }
                    if (!configuredCondition)
                        continue;
                    /*Break the condition into tokens at the combimation operators*/
                    var conditionTokensNOperator = this.getConditionTokensAndOperator(configuredCondition);
                    var conditionTokens = conditionTokensNOperator.conditionTokens;
                    var combOperator = conditionTokensNOperator.combOperator;
                    var resultsArr = [];
                    var changesRegEx = /\s+changes/i;
                    var addDelRegEx = /\s+adddelete/i;
                    for (var j = 0; j < conditionTokens.length; j++) {
                        var currentToken = pega.lang.trim(conditionTokens[j]);
                        if (changesRegEx.test(currentToken)) {
                            if (origin == "changes") {
                                resultsArr[j] = this.isChangesTarget(completeName, currentToken, baseRef4ConditionEval, currDiv);
                            }
                            else {
                                resultsArr[j] = false;
                            }
                        }
                        else if (addDelRegEx.test(currentToken)) {
                            if (origin == "adddelete") {
                                resultsArr[j] = this.isAddDeleteTarget(data, currentToken, baseRef4ConditionEval, currDiv);
                            }
                            else {
                                resultsArr[j] = false;
                            }
                        }
                        else {
                            resultsArr[j] = this.isRegularTarget(currentToken, baseRef4ConditionEval, currDiv);
                        }
                    }
                    var rwcpValue = currDiv.getAttribute("FULLPROPS");
                    var executeExpression = false;
                    if (rwcpValue) {
                        var rwcpArray = rwcpValue.split(",");
                        for (var l = 0; l < rwcpArray.length; l++) {
                            if (origin == "adddelete") {
                                if (rwcpArray[l].indexOf("-A$D")) {
                                    var correctConfig = rwcpArray[l].replace("-A$D", "");
                                    if (pega.u.d.isExpressionMatching(data, this.getCompleteListName(data), correctConfig, correctConfig)) {
                                        executeExpression = true;
                                        break;
                                    }
                                    else if (pega.u.d.temp_currentCT.isExpressionMatchingWithTrackedProps(correctConfig, true)) {
                                        executeExpression = true;
                                        break;
                                    }
                                }
                                else if (pega.u.d.temp_currentCT.isExpressionMatchingWithTrackedProps(correctConfig)) {
                                    executeExpression = true;
                                    break;
                                }
                            }
                            else {
                                if (pega.u.d.isExpressionMatching(null, completeName, rwcpArray[l], rwcpArray[l])) {
                                    executeExpression = true;
                                    break;
                                }
                                else if (pega.u.d.temp_currentCT.isExpressionMatchingWithTrackedProps(rwcpArray[l])) {
                                    executeExpression = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (executeExpression) {
                        var expression = "";
                        for (var k = 0; k < resultsArr.length; k++) {
                            if (k == 0)
                                expression = resultsArr[k];
                            else
                                expression = expression + combOperator + resultsArr[k];
                        }
                        if (!isGrid && eval(expression) && !pega.u.d.isDuplicateRefresh(sectionData.includedSec.getAttribute('node_name'), sectionBaseRef, currDiv)) {
                            if (!sections2refresh)
                                sections2refresh = [];
                            var preActivity = currDiv.getAttribute("RWA");
                            if (preActivity) {
                                if (!preActivities)
                                    preActivities = [];
                                preActivities.push(preActivity + "<||>" + sectionBaseRef);
                            }
                            var dataTransform = currDiv.getAttribute("PDT");
                            if (dataTransform) {
                                if (!dataTransforms)
                                    dataTransforms = [];
                                dataTransforms.push(dataTransform + "<||>" + sectionBaseRef);
                            }
                            var declarePageParams = sectionData.includedSec.getAttribute("data-declare-params");
                            if (declarePageParams && declarePageParams != "") {
                                if (secDeclarePageParams == null) {
                                    secDeclarePageParams = {};
                                }
                                try {
                                    declarePageParams = pega.c.eventParser.replaceTokensWrapper(declarePageParams, "", "", false, false);
                                    var paramsList = eval("(" + declarePageParams + ")");
                                    if (paramsList) {
                                        //var sectionName = sectionData.includedSec.getAttribute('node_name');
                                        var uniqueId = sectionData.includedSec.getAttribute('uniqueid'); /*changed sectionname to unique id as same section can be used elsewhere, but uniqueid is unique*/
                                        secDeclarePageParams[uniqueId] = {};
                                        var key = "";
                                        for (key in paramsList) {
                                            secDeclarePageParams[uniqueId][key] = paramsList[key];
                                        }
                                    }
                                }
                                catch (e) { }
                            }
                            sections2refresh.push(sectionData.includedSec);
                            if (!cells2refresh)
                                cells2refresh = [];
                            cells2refresh.push(currDiv);
                        }
                        if (isGrid && eval(expression)) {
                            if (!gridsToRefresh) {
                                gridsToRefresh = {};
                            }
                            if (!gridMixed && $(currDiv).children().first()[0]) {
                                var gridID = $(currDiv).children().first()[0].id;
                                var gridObj = Grids.map[gridID];
                                gridsToRefresh[gridID] = {};
                                if (rwAttrList[idx] == "IRW") {
                                    var gridDatasrc = gridObj.gridDiv.getAttribute("dataSource");
                                    var configuredPage = gridObj.getConfiguredPLPGProperty();
                                    configuredPage = configuredPage.substr(0, configuredPage.indexOf("."));
                                    var pageWithHash = gridDatasrc.substr(0, gridDatasrc.indexOf("."));
                                    /* BUG-109717: replace "." with "_" as it is causing exception when passed to adoptToJSON() */
                                    gridDatasrc = gridDatasrc.replace(pageWithHash, configuredPage).replace(/\./g, "_");
                                    var declarePageParams = currDiv.getAttribute("data-declare-params");
                                    if (declarePageParams && declarePageParams != "") {
                                        declarePageParams = pega.c.eventParser.replaceTokensWrapper(declarePageParams, "", "", true, false);
                                        var paramsList = eval("(" + declarePageParams + ")");
                                        if (paramsList) {
                                            //gridsToRefresh[gridID] = {};
                                            gridsToRefresh[gridID][gridDatasrc] = {};
                                            for (key in paramsList) {
                                                gridsToRefresh[gridID][gridDatasrc][key] = paramsList[key];
                                            }
                                        }
                                    }
                                }
                            }
                            if (gridMixed && currDiv.gridObj) {
                                if (!currDiv.gridObj.rowsToRefresh) {
                                    currDiv.gridObj.rowsToRefresh = [];
                                }
                                currDiv.gridObj.rowsToRefresh.push(currDiv.rowRef);
                                this.cleanGridRow(currDiv);
                            }
                        }
                    }
                }
            }
        }
        return {
            "sections": sections2refresh,
            "preActivities": preActivities,
            "dataTransforms": dataTransforms,
            "cells2refresh": cells2refresh,
            "gridsToRefresh": gridsToRefresh,
            "declarePageParams": secDeclarePageParams,
            "gridsWithRowsToRefresh": gridsWithRowsToRefresh
        };
    }
};
pega.lang.augmentObject(pega.ui.Doc.prototype, legacyConditionEngine);
if (!pega.control) {
    pega.c = pega.namespace("pega.control");
}
var pega;
(function (pega) {
    var c;
    (function (c) {
        var eventPreProcessor;
        (function (eventPreProcessor) {
            var refreshThisSection = function (e, action) {
                if (action && action[1] && action[1][0] && action[1][0] === 'thisSection') {
                    var reloadElement = e.target;
                    if (!reloadElement) {
                        return;
                    }
                    while ((reloadElement.id !== "RULE_KEY") || (reloadElement.getAttribute("node_type") !== "MAIN_RULE")) {
                        reloadElement = reloadElement.parentNode;
                        if (!reloadElement) {
                            return;
                        }
                    }
                    if (reloadElement && action[1] && action[1][6] && action[1][6]) {
                        action[1][6].RefreshSectionNode = reloadElement;
                    }
                }
            };
            var doGridActionPreProcess = function (e, action) {
                if (action && action[1] && (action[1][1] === "REFRESHLIST" || action[1][1] === "REFRESHROWS")) {
                    if (typeof Grids !== 'undefined') {
                        var gridObj = Grids.getActiveGrid(e);
                        if (gridObj) {
                            action[1][0]["cachedGridObj"] = gridObj;
                        }
                    }
                }
            };
            var doListActionPreProcess = function (e, action) {
                if (action && action[1] && action[1][2] && (action[1][2][0] === "REFRESHLIST")) {
                    if (typeof Grids !== 'undefined') {
                        var gridObj = Grids.getActiveGrid(e);
                        if (gridObj) {
                            action[1][0]["cachedGridObj"] = gridObj;
                        }
                    }
                }
            };
            var preprocessorMap = {
                'refresh': refreshThisSection,
                'doGridAction': doGridActionPreProcess,
                'doListAction': doListActionPreProcess
            };
            eventPreProcessor.preprocess = function (e, executable) {
                var actionName = executable[0];
                if (preprocessorMap[actionName]) {
                    preprocessorMap[actionName].apply(window, [e, executable]);
                }
            };
        })(eventPreProcessor = c.eventPreProcessor || (c.eventPreProcessor = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
var pega;
(function (pega) {
    var c;
    (function (c) {
        var eventCONSTANTS;
        (function (eventCONSTANTS) {
            eventCONSTANTS.EVENT_CLICK = function (eventType) {
                if (eventType === "click") {
                    return true;
                }
                return false;
            };
            eventCONSTANTS.EVENT_FOCUS = function (eventType) {
                if (eventType === "focus" || eventType === "focusin") {
                    return true;
                }
                return false;
            };
            eventCONSTANTS.EVENT_CHANGE = function (eventType) {
                if (eventType === "change") {
                    return true;
                }
                return false;
            };
            eventCONSTANTS.EVENT_RIGHT_CLICK = function (eventType) {
                if (eventType === "contextmenu") {
                    return true;
                }
                return false;
            };
            eventCONSTANTS.EVENT_DOUBLE_CLICK = function (eventType) {
                if (eventType === "dblclick") {
                    return true;
                }
                return false;
            };
        })(eventCONSTANTS = c.eventCONSTANTS || (c.eventCONSTANTS = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
/*Component Name: ClientConditionExecutor
 Responsibility: Execute the "Apply Conditions"
 Usage: This component registers itself to the Event Controller's event notification and executes the behavior for that conrol
*/
var pega;
(function (pega) {
    var c;
    (function (c) {
        var ClientConditionExecutor;
        (function (ClientConditionExecutor) {
            var hasDataAttribute = function (elem) {
                var attr = elem.getAttribute("data-change");
                return !!attr && (attr !== "[]") && attr.length > 0;
            };
            var isConfiguredOnEvent = function (elem, type) {
                var attr = elem.getAttribute(type);
                return attr && attr.toString().indexOf("handleClientEvent(") != -1;
            };
            //PRIVATE: This method checks if "Client Events" are explicitly configured on the control
            var isExplicitConfig = function (target) {
                return isConfiguredOnEvent(target, 'onchange') || isConfiguredOnEvent(target, 'onchange_custom') || isConfiguredOnEvent(target, 'onblur') || isConfiguredOnEvent(target, 'onclick') || hasDataAttribute(target);
            };
            ClientConditionExecutor.processEvent = function (e) {
                var target = e.target;
                if (target == null || !target.getAttribute) {
                    return;
                }
                var nameAttr = target.getAttribute("name");
                if (e && pega.c.eventCONSTANTS.EVENT_CLICK(e.type) && pega.u.EventUtils.isElementDisabled(target, e)) {
                    return;
                }
                if (nameAttr == null || nameAttr.lastIndexOf('$p') == -1) {
                    return;
                }
                //If  NO explicit client event is configured on the control and the event type and target type is as per the advised table, perform apply conditions.
                if (isExplicitConfig(target) || e.type !== "change") {
                    return;
                }
                var currentCtx = pega.ctx;
                pega.ctxmgr.setContext(pega.ctxmgr.getContextByTarget(target));
                pega.c.UIElement.Actions.fireACOnElem(e);
                pega.ctxmgr.setContext(currentCtx);
            };
        })(ClientConditionExecutor = c.ClientConditionExecutor || (c.ClientConditionExecutor = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
var pega;
(function (pega) {
    var c;
    (function (c) {
        var eventParser;
        (function (eventParser) {
            var performObjectConversion = function (objArray, e) {
                var length = objArray.length;
                for (var i = 0; i < length; i++) {
                    var currentItem = objArray[i];
                    if (typeof (currentItem) != 'string')
                        continue;
                    // If the string does not begin with ":", it does not hold an object reference.
                    if (currentItem.charAt(0) != ':') {
                        continue;
                    }
                    // If the string begins with "::", it is an escaped string value beginning with ":".
                    // E.g. ":firstname" is escaped as "::firstname".
                    // In such cases, remove the first ":" from the parameter value.
                    if (currentItem.charAt(1) == ':') {
                        objArray[i] = objArray[i].slice(1);
                        continue;
                    }
                    var objName = currentItem.slice(1);
                    if (objName.length > 1) {
                        //check if event object is required.
                        if (objName.toLowerCase() == 'event')
                            objArray[i] = e;
                        else if (objName.toLowerCase() == 'this') {
                            objArray[i] = e.target;
                        }
                        else if (objName.toLowerCase() == 'message' && e.type === 'message') {
                            objArray[i] = e.detail;
                        }
                        else
                            objArray[i] = pega.c.eventParser.pegaStringToObject(objName);
                    }
                }
                return objArray;
            };
            var escapedPropValue = function (propValueText) {
                var divEle = document.createElement("div");
                divEle["innerText" in divEle ? "innerText" : "textContent"] = propValueText;
                /*BUG-186774:honouring \n for smarttip in firefox*/
                var propval = divEle.innerHTML;
                if (navigator.userAgent.lastIndexOf('Firefox/') > 0) {
                    if (propval.indexOf("\n") != -1) {
                        propval = propval.replace(/\n/g, "<br>");
                    }
                }
                return propval;
            };
            var replaceControlActionTokens = function (jsonDesc, gridRowRef, gargs, encodeParams, replaceAmpTokens, skinDomForDateTime, escapeDoubleQuotes, target) {
                if (!jsonDesc) {
                    return jsonDesc;
                }
                var regexFn = function () {
                    var encodeHtml = (arguments[1] === "^");
                    var newPropName = arguments[2];
                    if (newPropName.indexOf('$') > 0) {
                        var temparr = newPropName.split('$');
                        newPropName = temparr[0];
                        if (temparr.length > 1)
                            var argindx = temparr[1];
                    }
                    if (newPropName.indexOf('.') == 0)
                        newPropName = gridRowRef + newPropName;
                    var propValue = "";
                    if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal() && target && (newPropName.indexOf("D_") == 0 || newPropName.indexOf("Declare_") == 0)) {
                        var correctBaseRef = pega.u.d.getBaseRef(target);
                        if (correctBaseRef) {
                            var correctDPName = correctBaseRef.substring(0, correctBaseRef.indexOf("."));
                            var nonHashDPName = newPropName.substring(0, newPropName.indexOf("."));
                            if (correctDPName && nonHashDPName && correctDPName.indexOf(nonHashDPName) != -1) {
                                newPropName = newPropName.replace(nonHashDPName, correctDPName);
                            }
                        }
                    }
                    var propRef = pega.u.property.toHandle(newPropName);
                    var propDomArr = pega.u.d.getCorrectPropertyElemFromDOM(propRef, pega.ui.ChangeTrackerMap.getTracker());
                    /*BEGIN FIX FOR BUG-195716*/
                    pega.ui.template.DataBinder.bindData(propDomArr); /*bindData would leave the input unaltered if it does not find any data-bindprops attribute on it*/
                    /*END FIX FOR BUG-195716*/
                    if (propDomArr && propDomArr.length > 0 && propDomArr[0].id != 'CV') {
                        propValue = pega.u.d.getGroupElementValue(propDomArr);
                        if (skinDomForDateTime && propDomArr[0].getAttribute("data-ctl") && typeof (propDomArr[0].getAttribute("data-ctl")) === "string" &&
                            pega.c.eventParser.parseJSON(propDomArr[0].getAttribute('data-ctl'))[0] == "DatePicker") {
                            propValue = null;
                        }
                        if (propValue != null) {
                            if (encodeHtml) {
                                propValue = escapedPropValue(propValue);
                            }
                            if (encodeParams) {
                                if (replaceAmpTokens && propValue.replace) {
                                    propValue = propValue.replace(/&/g, "~!");
                                }
                                else {
                                    //propValue = encodeURIComponent(propValue);
                                    /*BUG-187842:escaping ampersand in propvalue*/
                                    propValue = encodeURIComponent(propValue).replace(/'|&/g, window.escape);
                                }
                            }
                            else if (escapeDoubleQuotes && typeof propValue === 'string') {
                                propValue = propValue.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
                            }
                            return propValue;
                        }
                    }
                    /* ISSUE-67426: With ajax container support in offline we are supporting threads in offline for each ajax conatiner document.
                          All the pages will be present in STANDARD thread. If we try to get the data using changetracker which will try to get data
                          from current tracker it will be null. So always use ClientCache API's to get data in case of ajax container in offline.
                    */
                    var parentWindow;
                    if (pega.mobile && pega.mobile.isPegaMobileClient && typeof pmcRuntimeFeatures !== "undefined" && pmcRuntimeFeatures.pxUsesMultiWebView === "true") {
                        parentWindow = pega.mobile.support.getPortalWindow();
                    }
                    if (pega.u.d.ServerProxy.isDestinationLocal() && parentWindow && parentWindow.pega.ctx.isMDC) {
                        /* Multi WebView PMC ajax container */
                        try {
                            var propertyRef = pega.ui.ClientCache.find(newPropName);
                            if (propertyRef) {
                                propValue = propertyRef.getValue();
                            }
                            else {
                                propValue = null;
                            }
                        }
                        catch (e) {
                            console.info("Couldn't get value for handle " + newPropName + " from the ClientCache.");
                            propValue = null;
                        }
                    }
                    else {
                        propValue = pega.ui.ChangeTrackerMap.getTracker().getPropertyValue(newPropName);
                    }
                    if (propValue == null) {
                        propValue = '';
                    }
                    if (escapeDoubleQuotes && typeof propValue === 'string') {
                        propValue = propValue.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"');
                    }
                    if (encodeHtml) {
                        propValue = escapedPropValue(propValue);
                    }
                    if (encodeParams) {
                        if (replaceAmpTokens) {
                            propValue = propValue.replace(/&/g, "~!");
                        }
                        else {
                            propValue = encodeURIComponent(propValue).replace(/'/g, window.escape);
                        }
                    }
                    return propValue;
                };
                //jsonDesc = jsonDesc.replace(/(#|\^)~([-a-z.0-9_()$]+)~(#|\^)/gi, regexFn);
                /*HFix-39192:property name is allowing unicode characters*/
                jsonDesc = jsonDesc.replace(/(#|\^)~([^#~\^]+)~(#|\^)/gi, regexFn);
                return jsonDesc;
            };
            eventParser.correctActionArgs = function (arrayArg, gridRowRef, gargs, encodeParams, replaceAmpTokens, target, escapeDoubleQuotes) {
                if (arrayArg && arrayArg.length > 0) {
                    var repeatLayoutInfo = arrayArg[arrayArg.length - 1];
                    if (typeof repeatLayoutInfo === "object" && repeatLayoutInfo.nodeType === "repeatObject") {
                        gridRowRef = repeatLayoutInfo.rowRef;
                    }
                }
                try {
                    escapeDoubleQuotes = escapeDoubleQuotes ? escapeDoubleQuotes : null;
                }
                catch (e) {
                    escapeDoubleQuotes = null;
                }
                for (var loopex = 0; loopex < arrayArg.length; loopex++) {
                    if (typeof (arrayArg[loopex]) === 'string')
                        arrayArg[loopex] = replaceControlActionTokens(arrayArg[loopex], gridRowRef, gargs, encodeParams, replaceAmpTokens, null, escapeDoubleQuotes, target);
                    else if (typeof (arrayArg[loopex]) != 'undefined' && arrayArg[loopex] != null) {
                        if (typeof (arrayArg[loopex].length) != 'undefined' && arrayArg[loopex].length > 0) {
                            pega.c.eventParser.correctActionArgs(arrayArg[loopex], gridRowRef, gargs, encodeParams, replaceAmpTokens, target, escapeDoubleQuotes);
                        }
                        else if (typeof (arrayArg[loopex].$ev) == 'undefined' && !arrayArg[loopex].nodeType) {
                            try {
                                if (arrayArg[loopex] && typeof arrayArg[loopex] == "object" && arrayArg[loopex].name == "safeURL") {
                                    for (var key in arrayArg[loopex].hashtable) {
                                        var value = arrayArg[loopex].get(key);
                                        if (value.indexOf("#~") >= 0) {
                                            arrayArg[loopex].put(key, replaceControlActionTokens(value, gridRowRef, gargs, encodeParams, replaceAmpTokens, null, true, target));
                                        }
                                    }
                                }
                                else {
                                    var tempString = JSON.stringify(arrayArg[loopex]);
                                    var replacedTokens = replaceControlActionTokens(tempString, gridRowRef, gargs, encodeParams, replaceAmpTokens, null, true, target);
                                    try {
                                        arrayArg[loopex] = pega.c.eventParser.parseJSON(replacedTokens);
                                    }
                                    catch (e) {
                                        if (replacedTokens.indexOf('\\') > -1 && (!(replacedTokens.indexOf('{\\\"') > -1)) || replacedTokens.indexOf('{\\\\\"') > -1) {
                                            var rawString = (_a = ["", ""], _a.raw = ["", ""], String.raw(_a, replacedTokens));
                                            rawString = rawString.replace(/\\/ig, "\\\\");
                                            rawString = rawString.replace(/\\\\\"/ig, "\\\"");
                                            arrayArg[loopex] = pega.c.eventParser.parseJSON(rawString);
                                        }
                                    }
                                    finally {
                                        var rawString = (_b = ["", ""], _b.raw = ["", ""], String.raw(_b, replacedTokens));
                                        if (replacedTokens.indexOf('\\') > -1 && (!(replacedTokens.indexOf('{\\\"') > -1)) || replacedTokens.indexOf('{\\\\\"') > -1) {
                                            rawString = rawString.replace(/\\/ig, "\\\\");
                                            rawString = rawString.replace(/\\\\\"/ig, "\\\"");
                                        }
                                        if (replacedTokens.indexOf('\n') !== -1 || replacedTokens.indexOf('\r') !== -1) {
                                            rawString = rawString.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                                        }
                                        arrayArg[loopex] = pega.c.eventParser.parseJSON(rawString);
                                    }
                                }
                            }
                            catch (error1) { }
                        }
                    }
                }
                var _a, _b;
            };
            eventParser.hasTokens = function (jsonDesc) {
                return (/(#|\^)~([-a-z.0-9_()$]+)~(#|\^)/gi).test(jsonDesc);
            };
            eventParser.replaceTokensWrapper = function (jsonDesc, gridRowRef, gargs, encodeParams, skinDomForDateTime) {
                return replaceControlActionTokens(jsonDesc, gridRowRef, gargs, encodeParams, false, skinDomForDateTime, null, null);
            };
            /*
            *  @Public API
            *  Parses a JSON string and returns the object created
            *  @param JSONString: The JSON string to parse
            *  @throws An error if the string to parse is not valid
            * @return The javascript object created by parsing the JSON string
            */
            eventParser.parseJSON = function (JSONString) {
                //If nothing was passed, return null;
                if (!JSONString)
                    return null;
                //Since the JSON parser can throw an error, wraping it in try / catch
                if (JSONString && typeof (JSONString) === "string") {
                    JSONString = JSONString.replace(/,,/g, ',null,');
                    JSONString = JSONString.replace(/\t/g, "\\t");
                }
                var args = JSON.parse(JSONString);
                return args;
            };
            /*
            *  @Public API
            *  Parses the event handlers in JSON Notation and returns them  after converting any required string to javascript references
            *  @param
            e: the event object <Required if the pegaHandlerNotation contains ":event">
            pegaHandlerNotation: The event handlers in JSON notation
            *  @throws An error if the string to parse is not a valid JSON notation
            * @return An array of executor objects
            */
            eventParser.parseExecutables = function (e, pegaHandlerNotation) {
                var parsedArgs;
                //Perform JSON parsing of the handler string first to get the array of executor objects
                try {
                    parsedArgs = this.parseJSON(pegaHandlerNotation);
                }
                catch (e) { }
                ;
                //Perform any string to javascript reference conversion if required to the arguments property of the executors
                var noExecutable = parsedArgs == null ? 0 : parsedArgs.length;
                //makenote
                for (var i = 0; i < noExecutable; i++) {
                    //Perform object conversion for the arguments
                    if (parsedArgs[i]) {
                        if (parsedArgs[i].length < 2 || !parsedArgs[i][0]) {
                            parsedArgs.splice(i, 1);
                            noExecutable--;
                            i--;
                        }
                        else {
                            parsedArgs[i][1] = performObjectConversion(parsedArgs[i][1], e);
                        }
                    }
                }
                return parsedArgs;
            };
            /*
            *  @Public API
            *  Given a fully qualified name of a javascript object in string, returns the actual javascript object
            *  @param objectName: The fully qualified name of the javascript object in string format
            *  @return The javascript object if that name was valid and present else returns null
            */
            eventParser.pegaStringToObject = function (objectName) {
                //If nothing was passed, return null;
                if (!objectName)
                    return null;
                //Trace the final object in the window object starting from the name space and narrowing down on the final object
                var parts = objectName.split(".");
                var size = parts.length;
                var globalObj = window;
                for (var i = 0; i < size; i++) {
                    if (!globalObj)
                        return null;
                    globalObj = globalObj[parts[i]];
                }
                return globalObj;
            };
        })(eventParser = c.eventParser || (c.eventParser = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
var pega;
(function (pega) {
    var c;
    (function (c) {
        var actionSequencer;
        (function (actionSequencer) {
            var _NULL = null;
            var _pud = pega.u.d;
            var _paused = false;
            var _queue = [];
            var _modalqueue = [];
            var _messagequeue = [];
            var _pendingQueue = [];
            var _pendingModalQueue = [];
            var _pendingEventValues = {};
            var topPriorityEvent = null;
            var topPriorityAction = null;
            var topPriorityActionArgs = null;
            var topPriorityActionContext = null;
            actionSequencer.addToPendingEventValues = function (e) {
                var target = e.target;
                var entryHandle = (target && target.name) ? target.name : null;
                var value = target ? pega.u.d.getDOMElementValue(target) : null;
                if (entryHandle != null && value != null && (!actionSequencer.isQueueEmpty() || !actionSequencer.isPendingQueueEmpty())) {
                    if (!pega.c.actionSequencer.isControlTemplatized(e)) {
                        if (target.type == "checkbox" || target.type == "radio")
                            value = target.checked;
                        if (target.type == "radio") {
                            entryHandle = entryHandle + "|" + target.id;
                        }
                    }
                    _pendingEventValues[entryHandle] = value;
                }
            };
            actionSequencer.emptyPendingEventValues = function () {
                _pendingEventValues = {};
            };
            /*
            *
            *  Executes an "executable" object passed to it.
            *  @param
            *  e : Event object instance
            *  controlDescriptor : Singleton control instance
            *  executable: The executable to be executed
            * @return undefined
            */
            var executeAction = function (e, controlDescriptor, executable, cP, rP) {
                // web analytics, namespace won't exist unless using web analytics
                if (pega.webanalytics) {
                    pega.webanalytics.actionTrace(e, executable);
                }
                var methodName, action, scopeObj = null, lastNSIndex, parentObjectName;
                if (executable[2] && executable[2].length > 1 && !pega.c.conditionEngine.validateCondition({
                    op: executable[2][0],
                    conditions: executable[2].slice(1),
                    target: e.target
                })) {
                    return;
                }
                /* setting harness context */
                var prevContext = pega.ui.HarnessContextMap.getCurrentHarnessContext();
                if (e.harnessContext) {
                    pega.ctxmgr.setContext(e.harnessContext);
                }
                try {
                    if (executable[1] && executable[1].length > 0) {
                        var isEncryptedURL = false;
                        if (pega && pega.ctx && pega.ctx.bEncryptURLs && executable[0] == "openUrlInWindow" && executable[1].length > 5 && typeof executable[1][0] == "string" && executable[1][5] == "false") {
                            isEncryptedURL = true;
                            executable[1][0] = SafeURL_createFromURL(executable[1][0]);
                        }
                        pega.c.eventParser.correctActionArgs(executable[1], rP, null, /^(runActivity|createNewWork|refresh|runDataTransform)$/.test(executable[0]), null, e.target, /^(runScript)$/.test(executable[0]));
                        if (isEncryptedURL) {
                            executable[1][0] = executable[1][0].toURL();
                        }
                    }
                }
                catch (ignore) { }
                methodName = executable[0];
                var contextPage = cP;
                if (controlDescriptor) {
                    if ("runDataTransform" == methodName || "runActivity" == methodName) {
                        if (e && e.type == "mouseover") {
                            if (rP) {
                                contextPage = rP;
                            }
                        }
                        executable[1].splice(executable[1].length, 0, contextPage);
                    }
                    action = controlDescriptor.Actions[methodName];
                    var uiComponentDef = null;
                    // Checking to see if JitJLoader has been initialized
                    // If so, try to look for the UIComponentDef that corresponds to the Action
                    if (pega.ui.JitJLoader) {
                        uiComponentDef = pega.ui.actionsToUIComponents[methodName];
                    }
                    // When JitJLoader is initialized, we may need to load the component before the action is defined
                    // Therefore, if action or uiComponentDefinition are defined, we will want to apply the action
                    if (action || uiComponentDef) {
                        //NOTE: Indexes needs to be changed if the order of the parameters changes
                        var dcActionList = { "createNewWork": 7, "openAssignment": 6, "getNextWorkItem": 3, "openWorkByHandle": 6, "openWorkItem": 4, "openLandingPage": 2 };
                        if (pega.ui.hasAjaxContainer && !pega.ctx.isMDC && dcActionList[executable[0]]) {
                            processDesktopActionTarget(e, executable, dcActionList[executable[0]]);
                        }
                        if (!uiComponentDef) {
                            /* Hook to call a pre-action-processing function */
                            if (typeof pega.desktop.preExecuteAction === "function") {
                                pega.desktop.preExecuteAction(executable, e);
                            }
                            /* need to pass in "e", even though not used, becasue gcc compressor for preflight optimization */
                            /* will re-use "e" as another variable, and "apply" function if it looks at "caller.aguements", will */
                            /* get the reused "e" instead of the original "e".  To prevent, "e" needs to look like it is being used */
                            /* hence, passing it in, so it won't be re-allocated during compression */
                            action.apply(scopeObj, executable[1], e);
                        }
                        else {
                            // Pause the execution of actions until the given UIComponentDefinition is successfully loaded
                            pega.c.actionSequencer.pause();
                            // console.warn("**** Loading UIComDef for: " + uiComponentDef);
                            pega.ui.JitJLoader.loadComponent("Action", uiComponentDef, null, "runtime", function (error, category, componentName, feature) {
                                // UIComponentDefinition's JS has been loaded, resume the action queue and apply the action
                                pega.c.actionSequencer.resume();
                                if (error != null) {
                                    console.error(error);
                                }
                                else {
                                    action = controlDescriptor.Actions[methodName];
                                    action.apply(scopeObj, executable[1], e);
                                }
                            });
                        }
                    }
                }
                /* re-setting harness context */
                if (e.harnessContext && pega.ctxmgr) {
                    pega.ctxmgr.resetContext(prevContext);
                }
            };
            var processDesktopActionTarget = function (e, executable, targetIndex) {
                try {
                    if (e.target && e.target.closest) {
                        var acName = e.target.closest("div[data-mdc-id]").getAttribute("data-mdc-id");
                        if (!executable[1][targetIndex].target) {
                            executable[1][targetIndex].target = acName;
                        }
                    }
                }
                catch (e) {
                }
            };
            var isCurrentEventTopPriority = function (currEv) {
                if (topPriorityEvent) {
                    var currTarget = currEv.target;
                    if (topPriorityEvent.target === currTarget) {
                        /* current event is triggered from same DOM element
                         * as registered for top priority event;
                         */
                        for (var prop in topPriorityEvent) {
                            if (prop != "target") {
                                if (topPriorityEvent[prop] !== currEv[prop]) {
                                    /* current event has some property whose value
                                     * is not same as that for top priority event;
                                     */
                                    return false;
                                }
                            }
                        }
                        /* current event has same values for all the
                         * properties present in top priority event;
                         */
                        return true;
                    }
                }
                return false;
            };
            actionSequencer.getActionInQueue = function (actionName) {
                try {
                    var queue = getCurrentQueue("execute");
                    for (var i = 0; i < queue.length; i++) {
                        if (queue[i].action[0] == actionName) {
                            return queue[i].action[1][0];
                        }
                    }
                    return "";
                }
                catch (e) {
                    return "";
                }
            };
            actionSequencer.setTopPriorityEvent = function (dummyEvent) {
                topPriorityEvent = dummyEvent;
            };
            actionSequencer.fireTopPriorityEvent = function (target, type) {
                if (target) {
                    this.setTopPriorityEvent({
                        target: target,
                        type: type,
                        harnessContext: pega.ctx /* cache current harness context for later use in callback handlers */
                    });
                    if (type === 'change') {
                        pega.c.ec.fireEventHandler(target, type, null);
                    }
                    else {
                        pega.u.EventUtils.fireEvent(target, type, null);
                    }
                    this.setTopPriorityEvent(null);
                }
            };
            /*topPriorityAction can be an implicit action which needs an Ajax interaction and until the action is completed, we don't want
            other actions in the event queue to be executed.*/
            actionSequencer.setTopPriorityAction = function (action, argsObj) {
                if (topPriorityAction && topPriorityActionArgs) {
                    setTimeout(function () {
                        pega.c.actionSequencer.setTopPriorityAction(action, argsObj);
                    }, 100);
                }
                else {
                    topPriorityAction = action;
                    topPriorityActionArgs = argsObj;
                    topPriorityActionContext = pega.ctx;
                }
            };
            var getCurrentQueue = function (queueType) {
                var _currentQueue = _queue;
                /* var currentQueueType = "_queue"; */
                if (queueType === "message") {
                    /* US-151675: message/notification actions adding to _messagequeue */
                    _currentQueue = _messagequeue;
                }
                else if (_pud.bModalDialogOpen || _modalqueue.length > 0) {
                    /* BUG-314981: when modal dialog is opened and modal dialog queue becomes zero, message queue should continue execution  */
                    if (queueType === "execute" && _modalqueue.length <= 0 && _messagequeue.length > 0) {
                        _currentQueue = _messagequeue;
                    }
                    else {
                        _currentQueue = _modalqueue;
                    }
                }
                else if (queueType === "execute" && _currentQueue.length <= 0 && _messagequeue.length > 0) {
                    /* US-151675: User actions to take preference over Notification actions */
                    _currentQueue = _messagequeue;
                }
                /* console.log("In getCurrentQueue... returning " + currentQueueType + " as _currentQueue... queueType = " + queueType + " -- _queue.length = " + _queue.length + " -- _messagequeue.length = " + _messagequeue.length); */
                return _currentQueue;
            };
            var getCurrentPendingQueue = function () {
                return _pud.bModalDialogOpen ? _pendingModalQueue : _pendingQueue;
            };
            actionSequencer.isQueueEmpty = function () {
                if (!_pud.isAjaxInProgress()) {
                    if (_pud.bModalDialogOpen && _modalqueue.length == 0) {
                        return true;
                    }
                    else if (_queue.length == 0) {
                        return true;
                    }
                }
                return false;
            };
            actionSequencer.isPendingQueueEmpty = function () {
                var queue = _pud.bModalDialogOpen ? _pendingModalQueue : _pendingQueue;
                return (queue.length == 0) ? true : false;
            };
            actionSequencer.getEventsQueueLength = function () {
                if (!_pud.isAjaxInProgress()) {
                    if (_pud.bModalDialogOpen) {
                        return _modalqueue.length;
                    }
                    else {
                        return _queue.length;
                    }
                }
                return 0;
            };
            actionSequencer.clearQueue = function () {
                if (_pud.bModalDialogOpen) {
                    _modalqueue = [];
                }
                else {
                    _queue = [];
                }
                pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
            };
            actionSequencer.getValueFromPendingEventValues = function (entryhandle) {
                var value = null;
                if (_pendingEventValues.hasOwnProperty(entryhandle))
                    value = _pendingEventValues[entryhandle];
                return value;
            };
            actionSequencer.removePendingActionValue = function (propertyName) {
                if (propertyName) {
                    var entryhandle = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle(propertyName);
                    delete _pendingEventValues[entryhandle];
                }
            };
            actionSequencer.getPendingQueueLength = function () {
                var queue = _pud.bModalDialogOpen ? _pendingModalQueue : _pendingQueue;
                return queue.length;
            };
            actionSequencer.processPendingEvents = function () {
                var pendingQueue = getCurrentPendingQueue();
                var eventDescriptor = null;
                if (pendingQueue.length > 0) {
                    var _eventObj = pendingQueue.shift();
                    if (_eventObj) {
                        var _entryHandle = _eventObj.targetEntryHandle;
                        if (_eventObj.evt && _eventObj.evt.harnessContext) {
                            pega.ctxmgr.setContext(_eventObj.evt.harnessContext);
                        }
                        if (_entryHandle != null) {
                            var _newTargetObj = pega.ctx.dom.getElementsByName(_entryHandle);
                            if (_newTargetObj) {
                                _newTargetObj = _newTargetObj[0];
                            }
                            if (_eventObj.evt.target && !pega.util.Dom.isAncestor(document.body, _eventObj.evt.target)) {
                                _eventObj.evt.target = _newTargetObj;
                            }
                            if (!_newTargetObj || pega.u.EventUtils.isElementDisabled(_newTargetObj, _eventObj.evt)) {
                                /* skip action execution as the element is not available / invisible / disabled */
                                if (pendingQueue.length > 0) {
                                    actionSequencer.processPendingEvents();
                                }
                                return;
                            }
                        }
                        /* To set value from pending queue for non template controls*/
                        if (!pega.c.actionSequencer.isControlTemplatized(_eventObj.evt)) {
                            var target = _eventObj.evt.target;
                            if (target && target.type) {
                                var name = target.name;
                                var entryHandleKey = target.type == "radio" ? name + "|" + target.id : name;
                                if (entryHandleKey) {
                                    var prevValue = pega.c.actionSequencer.getValueFromPendingEventValues(entryHandleKey);
                                    if (prevValue != null && isInputControl(target)) {
                                        var nodes = pega.ctx.dom.getElementsByName(name);
                                        if (nodes.length > 0) {
                                            if (target.type == "checkbox" && nodes.length == 2) {
                                                if (nodes[0].type == "hidden") {
                                                    nodes[1].checked = prevValue;
                                                }
                                                else {
                                                    nodes[0].checked = prevValue;
                                                }
                                            }
                                            else if (target.type == "radio") {
                                                for (var i = 0; i < nodes.length; i++) {
                                                    if (nodes[i].id == target.id) {
                                                        nodes[i].checked = prevValue;
                                                        break;
                                                    }
                                                }
                                            }
                                            else {
                                                nodes[0].value = prevValue;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (target && !target.name && !target.id && !document.body.contains(target)) {
                                if (pendingQueue.length > 0) {
                                    actionSequencer.processPendingEvents();
                                }
                                return;
                            }
                        }
                        /* SE-67064 : perform change event very fast */
                        if (_eventObj.evt && _eventObj.evt.target && _eventObj.evt.target.dataset && _eventObj.evt.target.dataset.customChange && _eventObj.evt.$ev === "change") {
                            eventDescriptor = "data-custom-change";
                        }
                        pega.c.ControlBehaviorExecutor.processBehavior(_eventObj.evt, eventDescriptor);
                    }
                }
            };
            var addImplicitActions = function (e, actionsArray) {
                if (e.type === "change") {
                    actionsArray.push(["fireACOnElem", [pega.u.EventUtils.cloneEvent(e, true)]]);
                }
                else {
                    actionsArray.push(["evaluateClientConditions", []]);
                }
                actionsArray.push(["publishEndOfQueue", [pega.u.EventUtils.cloneEvent(e, true)]]);
            };
            var appendToQueue = function (array, modalBit, ev, controlDescriptor) {
                /*
                    This method adds new actions to the top of the queue.
                    */
                var index = 0;
                var _currentQueue = getCurrentQueue((ev ? ev.type : undefined));
                if (!isCurrentEventTopPriority(ev) && _currentQueue.length > 0) {
                    var isDblClick = (pega.c.eventCONSTANTS.EVENT_DOUBLE_CLICK(ev.type)) ? true : ((ev.type === "keyup") ? false : undefined);
                    for (var i = 0; i < _currentQueue.length; i++) {
                        if (isDblClick && !pega.c.eventCONSTANTS.EVENT_CLICK(_currentQueue[i].e.type)) {
                            break;
                        }
                        else if (isDblClick === false && _currentQueue[i].e.type !== "keyup") {
                            break;
                        }
                        index += 1;
                    }
                }
                addImplicitActions(ev, array);
                var gridContext = pega.u.EventUtils.getContextPagesFromGrid(ev);
                //Get the baseref from the event and pass it to currentQueue
                var base_ref = pega.u.d.getBaseRef(null, ev, null);
                var length = array.length;
                for (var i = length - 1; i >= 0; i--) {
                    var queueElement = {
                        action: array[i],
                        modal: modalBit,
                        e: ev,
                        cd: controlDescriptor,
                        cP: gridContext.cP ? gridContext.cP : base_ref,
                        rP: gridContext.rP ? gridContext.rP : base_ref
                    };
                    _currentQueue.splice(index, 0, queueElement);
                }
            };
            var enqueueExecuteOne = function () {
                /*
                This method unconditionally schedules one executeOne call. Queue length check is deferred to the executeOne method,
                to ensure no race conflicts if there is a call to enqueueExecuteOne with an empty queue followed by a call to schedule.
                */
                if (!_paused) {
                    /*Added for executing implicit top priority actions arised while executing an action in the queue.
                    Until the action is over, the next actions in the queue shouldn't be invoked.
                    If the topPriorityAction is not sending any Ajax, then it should take the responsibility of re-invoking the queue by calling actionsequencer.resume()*/
                    if (topPriorityAction) {
                        var currentContext = pega.ctx;
                        pega.ctxmgr.setContext(topPriorityActionContext);
                        topPriorityAction.call(topPriorityActionArgs.refObj, topPriorityActionArgs);
                        topPriorityAction = null;
                        topPriorityActionArgs = null;
                        topPriorityActionContext = null;
                        pega.ctxmgr.resetContext(currentContext);
                    }
                    else {
                        executeOne();
                    }
                }
            };
            var executeOne = function () {
                var _currentQueue = getCurrentQueue("execute");
                if (_currentQueue.length == 0) {
                    pega.ui.statetracking.setActionBusy("publishEndOfQueue"); // in MDC child iframe can be closed while queue processing in flight leaving dst showing actionprocessor busy
                    return;
                }
                var actionItem = _currentQueue.shift();
                if (_currentQueue.length == 0) {
                    actionItem.e.harnessContext = null;
                }
                try {
                    pega.ui.statetracking.setActionBusy(actionItem.action[0], actionItem.e.timeStamp);
                    executeAction(actionItem.e, actionItem.cd, actionItem.action, actionItem.cP, actionItem.rP);
                }
                catch (e) {
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
                _currentQueue = getCurrentQueue("execute");
                if (_currentQueue.length > 0 && !_paused) {
                    enqueueExecuteOne();
                }
                else if (actionSequencer.getPendingQueueLength() > 0 && !_paused) {
                    actionSequencer.processPendingEvents();
                }
                if (_currentQueue.length == 0 && actionSequencer.getPendingQueueLength() == 0) {
                    if (pega.ctx.SubmitInProgress !== true) {
                        pega.u.d && pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
                    }
                }
            };
            actionSequencer.isControlTemplatized = function (e) {
                var controlTemplatized = false;
                var traversalLevel = 0;
                var target = e.target;
                while (target != null && traversalLevel <= 3) {
                    if (target.getAttribute("data-ctl") == "non-auto") {
                        return false;
                    }
                    if (target.getAttribute('data-template') != null) {
                        if (!$(target).hasClass("content-item")) {
                            controlTemplatized = true;
                        }
                        break;
                    }
                    traversalLevel++;
                    target = target.parentElement;
                }
                return controlTemplatized;
            };
            var isInputControl = function (target) {
                return ["INPUT", "TEXTAREA", "SELECT"].indexOf(target.nodeName) > -1 ? true : false;
            };
            var isEventQueueable = function (e) {
                var _queue = getCurrentQueue((e ? e.type : undefined)), $EC = pega.c.eventCONSTANTS, currentEvent = e.type, firstEvent, lastEvent;
                /*
                    1. Queue is Empty
                    2. Event type is message
                    3. Event is Top Priority Event
                */
                if (_queue.length == 0 || currentEvent === 'message' || isCurrentEventTopPriority(e)) {
                    return true;
                }
                return false;
            };
            var isElementEditable = function (elem) {
                var nodeName = elem.nodeName.toLowerCase();
                if (elem.nodeType == 1 && (nodeName == "textarea" || (nodeName == "input" && /^(?:text|email|number|search|tel|url|password|radio|checkbox)$/i.test(elem.type)))) {
                    return true;
                }
                return false;
            };
            actionSequencer.schedule = function (e, controlDescriptor, actionsArray) {
                if (isEventQueueable(e) || (e.status && e.status == "pending")) {
                    appendToQueue(actionsArray, _pud.bModalDialogOpen, e, controlDescriptor);
                    if (!_paused) {
                        enqueueExecuteOne();
                    }
                    return true;
                }
                else {
                    /*if(isPendingQueueEmpty()){
                      emptyPendingEventValues();
                    }*/
                    /* add event target and event type to pending queue */
                    var target = e.target;
                    var currentQueue = getCurrentQueue(e ? e.type : undefined);
                    var pendingQueue = getCurrentPendingQueue();
                    var queue = pendingQueue.length > 0 ? pendingQueue : currentQueue;
                    if (queue.length > 0) {
                        var prevQueue = queue[queue.length - 1];
                        var prevEvent = pendingQueue.length > 0 ? prevQueue.evt : prevQueue.e;
                        var prevType = prevEvent.type;
                        var prevTarget = prevEvent.target;
                        if (e.type == "click" && target == prevTarget && e.type == prevType && !isElementEditable(prevTarget)) {
                            return false;
                        }
                    }
                    if (target.type && target.type == "radio") {
                        /*
                        BUG-380270 : MP-Able to select both radio buttons in select winning price
                        Solution: If setOtherRadioToFalse is configurred on click for a radio button inside grid and refresh section is configurred on data-change, we shouldn't push it to pending queue.
                         */
                        var onClickAction = target.getAttribute("onclick");
                        var dataOnChangeAction = target.getAttribute("data-change");
                        if (!(onClickAction && dataOnChangeAction && onClickAction.indexOf("Grids.getActiveGrid(event).setOtherRadioToFalse") != -1 && dataOnChangeAction.indexOf("refresh") != -1)) {
                            pendingQueue.push({
                                evt: e,
                                id: (target && target.id ? target.id : null),
                                value: (target ? pega.u.d.getDOMElementValue(target) : null)
                            });
                        }
                    }
                    else {
                        pendingQueue.push({
                            evt: e,
                            targetEntryHandle: (target && target.name ? target.name : null),
                            value: (target ? pega.u.d.getDOMElementValue(target) : null)
                        });
                    }
                    if (pendingQueue.length != 0) {
                        pendingQueue[pendingQueue.length - 1].evt.status = "pending";
                        actionSequencer.addToPendingEventValues(e);
                    }
                }
                return false;
            };
            actionSequencer.pause = function (fromModal) {
                /*
                    1. Set paused = true.
                    2. If Modal Dialog is open, set _modalPaused to true, else false.
               */
                _paused = true;
                if (fromModal && _queue.length > 0) {
                    pega.u.ce.publish(pega.u.ce.EQ_PAUSED_FOR_MODAL, _queue[0].e);
                }
            };
            actionSequencer.resume = function () {
                _paused = false;
                setTimeout(enqueueExecuteOne, 0);
            };
        })(actionSequencer = c.actionSequencer || (c.actionSequencer = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
/*Component Name: ControlBehaviorExecutor
 Responsibility: Execute Behavior for controls
 Usage: This component registers itself to the Event Controller's event notification and executes the behavior for that conrol
*/
var pega;
(function (pega) {
    var c;
    (function (c) {
        var ControlBehaviorExecutor;
        (function (ControlBehaviorExecutor) {
            var _backupEvent;
            //The hash which maps a event type to a attribute-name that the control will have to describe (using JSON) its behavior
            var descriptors = {};
            descriptors["click"] = "data-click";
            descriptors["dblclick"] = "data-dblclick";
            descriptors["focusin"] = "data-focus";
            descriptors["focus"] = "data-focus";
            descriptors["focusout"] = "data-blur";
            descriptors["blur"] = "data-blur";
            descriptors["keypress"] = "data-keypress";
            descriptors["keyup"] = "data-keyup";
            descriptors["mouseover"] = "data-hover";
            descriptors["keydown"] = "data-keydown";
            descriptors["mousedown"] = "data-msdwn";
            descriptors["paste"] = "data-paste";
            descriptors["cut"] = "data-cut";
            descriptors["change"] = "data-change";
            descriptors["contextmenu"] = "data-rightclick"; /*contextmenu event mapped to data-rtclick attribute - delta touch*/
            descriptors["playing"] = "data-playing"; // video element events
            descriptors["pause"] = "data-pause";
            descriptors["ended"] = "data-ended";
            //PRIVATE This method parses the JSON description of behavior using the "pega.c.eventParser" and then passes them to "pega.c.eventExecutor" for execution.
            var performExecution = function (e, controlDescriptor, jsonDesc, repeatLayoutInfo) {
                //Perform JSON parsing first
                var executorArray = pega.c.eventParser.parseExecutables(e, jsonDesc);
                if (!executorArray)
                    return;
                var length, executable, configKey, i;
                for (i = 0, length = executorArray.length; i < length; i++) {
                    if (executorArray[i]) {
                        pega.c.eventPreProcessor.preprocess(e, executorArray[i]);
                        if (e.type.indexOf("key") === 0) {
                            executable = executorArray[i];
                            configKey = executable[executable.length - 1];
                            if (!pega.c.conditionEngine.validateKeyCode(configKey, e.keyCode, e)) {
                                executorArray.splice(i, 1);
                                length--;
                                i--;
                            }
                        }
                    }
                }
                if (executorArray.length == 0) {
                    return;
                }
                for (i = 0, length = executorArray.length; i < length; i++) {
                    if (repeatLayoutInfo || executorArray[i][0] && executorArray[i][0] == "doListAction") {
                        executorArray[i][1].push(repeatLayoutInfo);
                    }
                }
                if (pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen) {
                    executorArray.push(["runScript", ["pega.ui.rdlMasterDetails.dismissRDLMasterDetail(event, '" + jsonDesc + "')"]]);
                }
                executorArray.push(["runScript", ["pega.u.EventUtils.clear()"]]);
                e.harnessContext = pega.ctxmgr.getContextByTarget(e.target); /* cache current harness context for later use in callback handlers */
                // Send the actions to the Action Sequencer.
                pega.c.actionSequencer.schedule(e, controlDescriptor, executorArray);
            };
            /*
            *  @Private API
            *  Returns the Control instance for the specified Control descriptor string, e.g. Pega.Control.TextArea for "TextArea".
            *  Returns Pega.Control.UIElement if empty string is passed.
            *  @param
            controlDescriptor: The string describing the control object in Pega.Control namespace.
            */
            function resolveControl(controlDescriptor) {
                if (controlDescriptor.length == 0) {
                    return pega.c.UIElement;
                }
                var result = pega.c[controlDescriptor];
                if (typeof result == 'object' && typeof result.type == 'string') {
                    return result;
                }
                return pega.c.UIElement;
            }
            /*
              Uses the "descriptor" hash to return the attribute name for that specific event type.
            */
            function getDescriptionForEvent(e) {
                return descriptors[e.type];
            }
            function fireImplicitControlBehavior(target, e, eventType, isControlElem) {
                var controlDescriptor = null;
                var ctlDescAttrName = "data-ctl";
                if (pega.u.EventUtils.isControl(ctlDescAttrName, target)) {
                    controlDescriptor = pega.lang.trim(target.getAttribute(ctlDescAttrName));
                    if (controlDescriptor.indexOf("[") == 0) {
                        var parsedArray = pega.c.eventParser.parseJSON(controlDescriptor);
                        controlDescriptor = parsedArray[0] ? parsedArray[0] : controlDescriptor;
                    }
                }
                else if (isControlElem == true) {
                    return false;
                }
                if (controlDescriptor != null) {
                    var ctl = resolveControl(controlDescriptor);
                    if (typeof ctl[eventType] == 'function') {
                        ctl[eventType].call(ctl, e);
                        if (e.cancelBehavior == true) {
                            return false;
                        }
                    }
                }
            }
            function processOtherBehaviors(e, eventType, target, jsonDesc, eventDescriptor) {
                if (pega.ui && pega.ui.DataRepeaterUtils) {
                    var drUtils = pega.ui.DataRepeaterUtils;
                    var layoutInfo = drUtils.getLayoutInfo(e, eventDescriptor);
                    var gridObj = null;
                }
                if (layoutInfo) {
                    // do not propagate to parent level when we have target level event attached in the leaf node
                    if (!jsonDesc && e && e.keyCode === 13 && target.hasAttribute('data-click')) {
                        return;
                    }
                    var tempLayoutDiv = layoutInfo.domNode;
                    if (layoutInfo.type == drUtils.TEMPLATE_GRID) {
                        if (layoutInfo.rowNode) {
                            jsonDesc = tempLayoutDiv.getAttribute(eventDescriptor);
                            processBehaviorsOnElem(tempLayoutDiv, e, eventType, jsonDesc, false, layoutInfo);
                        }
                    }
                    else if (layoutInfo.type == drUtils.SIMPLE_LAYOUT || layoutInfo.type == drUtils.SECTION_INCLUDE) {
                        if (target.getAttribute("data-formatting") == "yes" && tempLayoutDiv.getAttribute("data-change")) {
                            target.setAttribute("data-value", target.value);
                            target.setAttribute('data-changed', 'true');
                        }
                        jsonDesc = tempLayoutDiv.getAttribute(eventDescriptor);
                        if (jsonDesc && eventType != "message") {
                            processBehaviorsOnElem(tempLayoutDiv, e, eventType, jsonDesc, null, null);
                        }
                    }
                    else if (layoutInfo.type == drUtils.NONTEMPLATE_GRID) {
                        if (typeof (Grids) != 'undefined') {
                            gridObj = Grids.getElementsGrid(tempLayoutDiv);
                        }
                    }
                }
                var details = pega.u.EventUtils.processGridBehaviors(e, eventType, target, jsonDesc, eventDescriptor, gridObj);
                if (details.execute) {
                    processBehaviorsOnElem.apply(this, details.args);
                }
            }
            function processBehaviorsOnElem(target, e, eventType, jsonDesc, isControlElem, repeatLayoutInfo) {
                var ctl, cancelBehavior = false;
                /* Prevent the default browser context menu display when the control/grid has right click behavior configured on it - delta touch*/
                if (pega.c.eventCONSTANTS.EVENT_RIGHT_CLICK(eventType) && jsonDesc) {
                    e.preventDefault();
                }
                cancelBehavior = fireImplicitControlBehavior(target, e, eventType, isControlElem);
                if (cancelBehavior != true && typeof jsonDesc == 'string') {
                    ctl = pega.c.UIElement;
                    if (eventType.indexOf("key") === 0) {
                        if (pega.c.conditionEngine.validateKeyCode("any", e.keyCode, e)) {
                            pega.u.EventUtils.executeFunctionWithDelay(performExecution, [e, ctl, jsonDesc, repeatLayoutInfo], this, 250);
                        }
                        else {
                            performExecution(e, ctl, jsonDesc, repeatLayoutInfo);
                        }
                    }
                    else {
                        var evt = pega.u.EventUtils.correctEventForMenu(target, e);
                        performExecution(evt, ctl, jsonDesc, repeatLayoutInfo);
                    }
                }
                else if (!jsonDesc && !pega.c.actionSequencer.isPendingQueueEmpty() && e.status && e.status == "pending") {
                    pega.c.actionSequencer.processPendingEvents();
                }
                else {
                    if (e.type != "focus") {
                        if (e.type == "change" && e.isTrusted) {
                            pega.c.actionSequencer.addToPendingEventValues(e);
                        }
                    }
                }
            }
            ControlBehaviorExecutor.getBackupEvent = function () {
                return _backupEvent;
            };
            ControlBehaviorExecutor.clearBackupEvent = function () {
                _backupEvent = undefined;
            };
            ControlBehaviorExecutor.processHoverEvent = function (ev) {
                var target = ev.target;
                if (target.nodeName === undefined) {
                    return;
                }
                var changedCtx = pega.ui.HarnessContextMgr.getContextByTarget(target);
                if (changedCtx && pega.ctx != changedCtx) {
                    pega.ui.HarnessContextMgr.setContext(changedCtx);
                }
                pega.c.cbe.processBehavior(ev, "data-hover");
            };
            /*
             *  @Public API
             *  The ControlBehaviorExecutor registers this method with the event notification provided by Event Controller.
             *  @param : Receives the event object
             */
            ControlBehaviorExecutor.processBehavior = function (ev, eventDescriptor) {
                var e = ev;
                e.cancelBehavior = false;
                if (!ev.$cloned) {
                    e = pega.u.EventUtils.cloneEvent(ev);
                }
                /**Emptying pending event value queue if no events present in current queue and pending queue */
                if (pega.c.actionSequencer.isQueueEmpty() && pega.c.actionSequencer.isPendingQueueEmpty()) {
                    pega.c.actionSequencer.emptyPendingEventValues();
                }
                /* if harness is not initialized backing up event to fire later*/
                if (!pega.u.d.isHarnessInitialized() && e && e.type != 'focus' && e.type != 'blur') {
                    _backupEvent = {
                        'e': e,
                        'ed': eventDescriptor
                    };
                    return;
                }
                var target = e.target;
                if (target.nodeName === undefined) {
                    return;
                }
                if (e.type == "change") {
                    var lazyonchange = target.getAttribute("data-change-lazy");
                    if (target.type == "hidden" && target.id && document.getElementById(target.id).getAttribute("data-ctl") && document.getElementById(target.id).getAttribute("data-ctl").indexOf("AutoCompleteAG") != -1) {
                        var tempTarget = document.getElementById(target.id);
                        lazyonchange = tempTarget.getAttribute("data-change-lazy");
                    }
                    if (lazyonchange && lazyonchange == "true") {
                        return;
                    }
                }
                if (navigator.userAgent.lastIndexOf('Chrome/') < 0) {
                    if (e.type == "keyup") {
                        if (target.fromComposition) {
                            target.fromComposition = false;
                            e.preventDefault();
                            return false;
                        }
                    }
                }
                if (!eventDescriptor) {
                    eventDescriptor = getDescriptionForEvent(e);
                }
                if (pega.c.eventCONSTANTS.EVENT_FOCUS(e.type) || (pega.util.Event.isSafari && pega.c.eventCONSTANTS.EVENT_CLICK(e.type) && (target.type === "radio" || target.type === "checkbox" || (target && typeof (target.type) === "undefined" && (target.parentNode && (target.parentNode.className == "signature-clear-action" || target.parentNode.className == "signature-actions")))))) {
                    /* BUG-257067: Added check for signature capture control clear button */
                    if (target.id != "pega_ui_load") {
                        pega.u.d.focusElement = target;
                        pega.u.d.gFocusElement = target;
                        if (pega.c.eventCONSTANTS.EVENT_FOCUS(e.type)) {
                            pega.u.d.gFocusTimeStamp = performance.now();
                        }
                    }
                }
                var jsonDesc = target.getAttribute(eventDescriptor);
                //Check if the descriptor is for a parent delegation [. notation]. Every dot (.) indicates a single parent traversal.
                if ((typeof jsonDesc == 'string') && (jsonDesc.charAt(0) == '.')) {
                    var delegateLevels = jsonDesc.length;
                    var count = jsonDesc.length;
                    for (; delegateLevels; delegateLevels--) {
                        //SE-63498 handle when target is null in IE
                        if (target == null) {
                            var baseEle = pega.ctx.dom.getElementById(ev.target.id);
                            var parNode = baseEle.parentNode;
                            while (count > 0) {
                                target = parNode;
                                parNode = parNode.parentNode;
                                count--;
                            }
                            break;
                        }
                        else {
                            target = target.parentNode;
                        }
                    }
                }
                if (e.type == "mousedown") {
                    var currentTimeStamp = performance.now();
                    if (pega.u.d.gFocusTimeStamp) {
                        var timeStampDiff = currentTimeStamp - pega.u.d.gFocusTimeStamp;
                        if (timeStampDiff > 900) {
                            pega.u.d.gFocusElement = target;
                        }
                    }
                    else {
                        pega.u.d.gFocusElement = target;
                    }
                }
                if (pega.u.EventUtils.isElementDisabled(target, e)) {
                    return;
                }
                var eventType = e.type;
                eventType = (eventType == "focusin") ? "focus" : eventType;
                eventType = (eventType == "focusout") ? "blur" : eventType;
                jsonDesc = target.getAttribute(eventDescriptor);
                if (eventType == "keyup" && e.keyCode == 13 && jsonDesc == null && target.getAttribute("data-click") &&
                    ((target.nodeName.toLowerCase() == "img" && target.parentNode.nodeName.toLowerCase() == "i") || (target.nodeName.toLowerCase() == "i" && target.parentNode.nodeName.toLowerCase() == "span"))) {
                    target.click();
                    return;
                }
                if ((eventType == "focus" || pega.c.eventCONSTANTS.EVENT_CLICK(eventType)) && pega.ctx.Grid) {
                    pega.u.EventUtils.queueFocusGridEvent(eventType, target);
                }
                // BUG-544011 discarding action processing for Chrome specific incorrect behavior where it fires click on 'select' when we try to select an option from dropdown
                if ((navigator.userAgent.lastIndexOf('Chrome/') > 0) && (target.nodeName.toLowerCase() === "select") && (eventType === "click")) {
                    return;
                }
                /* BUG-357917 : BUG-351651 in case of DL avoid this call,only for click , BUG-484605*/
                if (!(target.getAttribute("bsimplelayout") && (eventType == "click" || eventType == "keydown" || eventType == "focus"))) {
                    processBehaviorsOnElem(target, e, eventType, jsonDesc, true, null);
                }
                if (!e.skipOtherBehavior) {
                    processOtherBehaviors(e, eventType, target, jsonDesc, eventDescriptor);
                }
            };
        })(ControlBehaviorExecutor = c.ControlBehaviorExecutor || (c.ControlBehaviorExecutor = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
var pega;
(function (pega) {
    var c;
    (function (c) {
        var eventController;
        (function (eventController) {
            var timer;
            var validationAttacher = function (e) {
                if (window.validation_validateFromUIEvent) {
                    window.validation_validateFromUIEvent(e, e.target);
                }
            };
            var switchOSCOThread = function (e) {
                var target = e.target;
                if (target && pega && pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.setContextThread) {
                    pega.ui.DCUtil.setContextThread(target, e.type);
                }
            };
            var fireImplicitEventSubscribers = function (e) {
                switchOSCOThread(e);
                validationAttacher(e);
                pega.c.ClientConditionExecutor.processEvent(e);
                pega.c.ControlBehaviorExecutor.processBehavior(e, null);
            };
            var fireACIfRequired = function (e) {
                if (e.isTrusted == false && e.bubbles !== true) {
                    setTimeout(function () {
                        pega.c.ClientConditionExecutor.processEvent(e);
                    }, 0);
                }
            };
            // PRIVATE The name-callback pair of subscribers for event notification.
            var eventSubscribers = {};
            var handlers = {
                "click": "clickHandler",
                "focus": "focusHandler",
                "blur": "blurHandler",
                "change": "changeHandler"
            };
            // PRIVATE The method called by handler component to notify all interested subscribers about an event.
            function notifyEventToAll(e) {
                var ev = pega.u.EventUtils.cloneEvent(e);
                fireImplicitEventSubscribers(ev);
                for (var name in eventSubscribers) {
                    if (eventSubscribers.hasOwnProperty(name) && typeof eventSubscribers[name] == 'function') {
                        eventSubscribers[name](ev);
                    }
                }
            }
            eventController.ON_BEFORE_EVENT_PROCESSING = "onBeforeEventProcessing";
            //BEGIN: Public interface of "pega.c.eventController"
            /*
             *  @Public API
          
             * The method which serves as the listener for any event on the harness and then notifies all subscribers
             *  @param e: Event object instance
          
             */
            eventController.handler = function (e) {
                if (!pega.u.EventUtils.isElementDisabled(e.target, e)) {
                    pega.ui && pega.ui.EventsEmitter && pega.ui.EventsEmitter.publishSync(eventController.ON_BEFORE_EVENT_PROCESSING, e);
                    notifyEventToAll(e);
                }
            };
            eventController.rightClickHandler = function (e) {
                var target = e.target;
                if ((target.nodeName.toUpperCase() == "INPUT" || target.nodeName.toUpperCase() == "TEXTAREA")) {
                    /* BUG-128107 */
                    if (!(target.getAttribute("data-rightclick") && target.getAttribute("data-rightclick").length > 0)) {
                        return;
                    }
                }
                pega.c.eventController.handler(e);
            };
            eventController.clickHandler = function (e) {
                //ignore the click handler if ctrl-clicked/command-clicked
                if (pega.desktop.infinity && e.target.tagName === 'A' && e.target.href !== '' && e.target.href !== '#' && (e.metaKey || e.ctrlKey)) {
                    window.open(e.target.href);
                    e.preventDefault();
                    return;
                }
                /* BUG-53415 Rightclick is firing single click on firefox */
                if (e.button === 2) {
                    return;
                }
                /* BUG-133257: START
                 * In Chrome and firefox browsers it is not considering disabled as state for links
                 */
                var target = e.target;
                if (/^a$/gi.test(target.nodeName) && target.getAttribute("disabled") === "disabled") {
                    e.preventDefault();
                    return;
                }
                if (/^label$/gi.test(target.nodeName)) {
                    if (target.control || (target.htmlFor && document.getElementById(target.htmlFor)))
                        return;
                }
                /* BUG-133257: END */
                /* SE-28298 BEGIN bajaj */
                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && (target.tagName && target.tagName == "SPAN") && (target.hasAttribute && (target.hasAttribute("data-ctl") && target.getAttribute && target.getAttribute("data-ctl") == "Checkbox") && target.hasAttribute("data-click"))) {
                    pega.util.Event.preventDefault(e);
                    return;
                }
                /* SE-28298 END */
                /* BUG-93194 : START
                 * In IE8 after uploading file we are getting the innerHTML of a iframe, in IE8 it when we read innerHTML it removes type="button" so after using this HTML button is doing form submit.
                 * To avoid this we are preventing the default behavior of the button.
                 */
                if (/^button$/gi.test(target.nodeName) && ((target.hasAttribute && target.hasAttribute("data-ctl")) || typeof target.getAttribute("data-ctl") === "string")) {
                    e.preventDefault();
                }
                /* BUG-93194 : END */
                //BUG-120265 Starts.This is added for handling Dirty Handling on Picking a date from Date Time Picker,basically for click events.
                if ((e && pega.c.eventCONSTANTS.EVENT_CLICK(e.type) && target.tagName === "A" && (target.hasAttribute && target.hasAttribute("href") && /^javascript:[\s]*void[\(][a-z0-9\'\"]*[\)](|;)$/i.test(window.trim(target.getAttribute("href")))))) {
                    e.preventDefault();
                }
                // web analytics, namespace won't exist unless using web analytics
                if (pega.webanalytics) {
                    var sEventList = pega.c.eventController.eventListString(e);
                    pega.webanalytics.clickTrace(e, sEventList);
                }
                //BUG-120265 Ends.
                pega.c.eventController.handler(e);
            };
            // used for web analytics
            eventController.eventListString = function (e) {
                var targetJSON = null;
                var eventTarget = e.target;
                var sTarget = eventTarget.getAttribute("data-click");
                var targetList = "";
                var bFirst = true;
                if ((sTarget !== null) && (sTarget !== "")) {
                    try {
                        while (sTarget === ".." || sTarget === ".") {
                            eventTarget = eventTarget.parentNode;
                            sTarget = eventTarget.getAttribute("data-click");
                        }
                        targetJSON = pega.c.eventParser.parseJSON(sTarget);
                        for (topLevel in targetJSON) {
                            var action = targetJSON[topLevel];
                            for (actionLevel in action) {
                                if (bFirst) {
                                    bFirst = false;
                                }
                                else {
                                    targetList += ", ";
                                }
                                targetList += action[actionLevel];
                            }
                        }
                    }
                    catch (ex) {
                    }
                }
                return (targetList);
            };
            eventController.focusHandler = function (e) {
                var target = e.target;
                if (target.tagName && target.tagName.match(/^(input)$/gi)) {
                    pega.c.formatter.setSubmitValue(target);
                    target.setAttribute('data-changed', 'false');
                }
                if (target.tagName && target.tagName.match(/^(input|select|textarea)$/gi) && !(target.type && target.type.match(/^(checkbox|radio)$/gi))) {
                    clearTimeout(timer);
                    target.removeEventListener("change", fireACIfRequired);
                    target.addEventListener("change", fireACIfRequired);
                }
                if (navigator.userAgent.lastIndexOf('Chrome/') < 0 && target.tagName.toLowerCase() == "input") {
                    target.addEventListener("compositionend", pega.c.eventController.compositionEndHandler);
                }
                pega.c.eventController.handler(e);
            };
            eventController.blurHandler = function (e) {
                var target = e.target;
                if (navigator.userAgent.lastIndexOf('Chrome/') < 0 && target.tagName.toLowerCase() == "input") {
                    $(target).off("compositionend", pega.c.eventController.compositionEndHandler);
                }
                if (target.tagName && target.tagName.match(/^(input)$/gi) && target.getAttribute("data-formatting")) {
                    if (target.type == "hidden" && target.getAttribute('data-ctl') && pega.c.eventParser.parseJSON(target.getAttribute('data-ctl'))[0] == "DatePicker") {
                        pega.c.formatter.getReadOnlyFormatting(e, "true");
                    }
                    else {
                        pega.c.formatter.getReadOnlyFormatting(e, "");
                    }
                    target.setAttribute('data-changed', 'false');
                }
                if (target.tagName && target.tagName.match(/^(input|select|textarea)$/gi) && !(target.type && target.type.match(/^(checkbox|radio)$/gi))) {
                    timer = setTimeout(function () { target.removeEventListener("change", fireACIfRequired); }, 50);
                }
                pega.c.eventController.handler(e);
            };
            eventController.changeHandler = function (e) {
                var target = e.target;
                if (target.getAttribute("data-formatting") == "yes" && target.getAttribute("data-change")) {
                    if (!(target.getAttribute("data-custom-timezone") && target.getAttribute("data-value") && target.type == "hidden")) {
                        target.setAttribute("data-value", target.value);
                    }
                    target.setAttribute('data-changed', 'true');
                }
                pega.c.eventController.handler(e);
            };
            eventController.keyDownHandler = function (e) {
                var target = e.target;
                var type = target.getAttribute('type');
                //  BUG-159709: Excluding if the type is button or file - BUG-388092, BUG-498348
                if (e.keyCode == 13 && target.tagName && target.tagName.match(/^(input)$/gi) && (!target.getAttribute("type") || ("button" !== target.getAttribute("type").toLowerCase() && "file" !== target.getAttribute("type").toLowerCase()))) {
                    e.preventDefault();
                }
                pega.c.eventController.handler(e);
            };
            eventController.inputHandler = function (e) {
                if (pega.u.d.isMobile() || (pega.cl && pega.cl.isTouchAble())) {
                    var target = e.target;
                    var type = target.getAttribute('type');
                    if (e.keyCode == 13 && target.tagName && target.tagName.match(/^(input)$/gi) && (!target.getAttribute("type") || ("button" !== target.getAttribute("type").toLowerCase() && "file" !== target.getAttribute("type").toLowerCase()))) {
                        e.preventDefault();
                    }
                    pega.c.eventController.handler(e);
                }
            };
            eventController.fireEventHandler = function (target, type, data) {
                if (type === "message") {
                    if (document.body.contains(target)) {
                        if (target.getAttribute("data-ack-enabled") == "true") {
                            var acknowledgementCallback = function () {
                                pega.u.MessagingManager.sendClientAcknowledgements(data, target.getAttribute("data-subscription-id"), data.websocketId, "Callback-Executed");
                                pega.u.ce.unsubscribe(pega.u.ce.EQ_COMPLETED, acknowledgementCallback);
                            };
                            // subcribe to end of queue
                            pega.u.ce.subscribe(pega.u.ce.EQ_COMPLETED, acknowledgementCallback);
                        }
                        pega.c.ControlBehaviorExecutor.processBehavior({
                            type: "message",
                            target: target,
                            detail: data
                        }, "data-message");
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                var handler = handlers[type] || "handler";
                target.addEventListener(type, pega.control.eventController[handler]);
                pega.u.EventUtils.fireEvent(target, type, null);
                target.removeEventListener(type, pega.control.eventController[handler]);
            };
            /*In japanese ime, enter key is used to confirm characters, this handler is to differentiate between that enter and normal enter*/
            eventController.compositionEndHandler = function (e) {
                var target = e.target;
                target.fromComposition = true;
                e.preventDefault();
                return false;
            };
            /*
             *  @Public API
             * The method used by subscribers to register for event notification
             *  @param name: The name used to identify a particular SUBSCRIBER [          *  @param fn: The callback function which will be called for noitifying the event occurance. The Event Controller passes the event object to this callback.
             */
            eventController.registerEventNotification = function (name, fn) {
                if (!eventSubscribers[name])
                    eventSubscribers[name] = fn;
            };
            /*
             *  @Public API
             * The method used by subscribers to de-register from event notification
             *  @param name: The name used to identify a particular SUBSCRIBER (used while subscribing)
             */
            eventController.unregisterEventNotification = function (name) {
                delete eventSubscribers[name];
            };
            /*
             *  @Public API
             * The method used set data-change-lazy attribute on control
             */
            eventController.setLazyOnchange = function (elem, lazyFlag, fireChange) {
                if (elem) {
                    var attrVal = elem.getAttribute("data-change-lazy");
                    if (attrVal) {
                        elem.setAttribute("data-change-lazy", lazyFlag);
                        if (attrVal != "false" && lazyFlag == "false" && fireChange) {
                            var oldVal = elem.getAttribute("data-old-value");
                            if (typeof oldVal != 'undefined' && oldVal != null) {
                                if (oldVal == elem.value) {
                                    //SE-34206: Commented the code which removes data-old-value attribute.
                                    //elem.removeAttribute("data-old-value");
                                    return;
                                }
                            }
                            pega.control.actionSequencer.fireTopPriorityEvent(elem, "change");
                            if (typeof oldVal != 'undefined' && oldVal != null) {
                                elem.removeAttribute("data-old-value");
                            }
                        }
                    }
                }
            };
        })(eventController = c.eventController || (c.eventController = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
var pega;
(function (pega) {
    var c;
    (function (c) {
        var ec1 = pega.c.eventController;
        var cbe1 = pega.c.ControlBehaviorExecutor;
        c.ec = ec1;
        c.cbe = cbe1;
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
(function () {
    var $d = document, $b, $ec = pega.c.eventController, $h = $ec.handler, $e = pega.util.Event;
    /* Moved click , contextmenu and dblclick event addListener from here to pzpega_ui_events_infra.js to make it conditional - Delta Touch */
    // focusin needs to be attached to the body. Using onDomReady since firefox executes this before parsing HTML
    $(window).on("load", function () {
        $b = document.body;
        $b.addEventListener("focus", $ec.focusHandler, true);
        $b.addEventListener("blur", $ec.blurHandler, true);
        $b.addEventListener("change", $ec.changeHandler);
        $b.addEventListener("paste", $h);
        $b.addEventListener("cut", $h);
        $b.addEventListener("playing", $h, true); // Video element event
        $b.addEventListener("pause", $h, true); // Video element event
        $b.addEventListener("ended", $h, true); // Video element event
    });
    $d.addEventListener("keypress", $h);
    $d.addEventListener("keyup", $h);
    $d.addEventListener("keydown", $ec.keyDownHandler);
    $d.addEventListener("mousedown", $h);
    $d.addEventListener("click", $ec.clickHandler);
    $d.addEventListener("dblclick", $ec.handler);
    $d.addEventListener("contextmenu", $ec.rightClickHandler);
    $d.addEventListener("input", $ec.inputHandler);
}());
//static-content-hash-trigger-YUI
if (!pega.control) {
    pega.c = pega.namespace("pega.control");
}
var pega;
(function (pega) {
    var c;
    (function (c) {
        var validator;
        (function (validator) {
            validator.isActive = function (args) {
                var controlElem = args.trgt;
                if (controlElem && controlElem.tagName && controlElem.tagName.toLowerCase() === 'label') {
                    controlElem = controlElem.control;
                    if (!controlElem && args.trgt.getAttribute) {
                        controlElem = $("#" + args.trgt.getAttribute("for")).get(0);
                    }
                }
                if (controlElem === undefined || !controlElem) {
                    controlElem = args.trgt;
                }
                return (document.activeElement === controlElem);
            };
            validator.isInActive = function (args) {
                return !this.isActive(args);
            };
            validator.isEmpty = function (args) {
                //Check if it is a label
                if (args.trgt && args.trgt.tagName == "P")
                    return (args.trgt.innerHTML == "");
                return (!args.trgt.value || pega.lang.trim(args.trgt.value) == "");
            };
            validator.isPopulated = function (args) {
                return !this.isEmpty(args);
            };
            validator.isReadOnly = function (args) {
                var el = args.trgt;
                if (typeof el.readOnly != 'undefined') {
                    return el.readOnly;
                }
                return null;
            };
            validator.isReadWrite = function (args) {
                var readOnly = pega.c.validator.isReadOnly(args);
                if (typeof readOnly == "boolean") {
                    return !readOnly;
                }
                return null;
            };
            validator.isRequired = function (args) {
                var el = args.trgt;
                var validationType = el.getAttribute("validationType");
                return ((typeof validationType == "string") && (validationType.indexOf("required") != -1));
            };
            validator.isOptional = function (args) {
                return !pega.c.validator.isRequired(args);
            };
            validator.propertyRefCondition = function (args) {
                if (!args.param || !args.param.length || !args.param[0] || !args.param[1]) {
                    return false;
                }
                var property = args.param[0];
                var isTargetLabel = false;
                var labelValue = "";
                var htmlEle;
                var rHhtmlEle;
                if (args.trgt && args.trgt.tagName && args.trgt.tagName.toLowerCase() == 'p') {
                    isTargetLabel = true;
                    labelValue = args.trgt.innerText;
                }
                htmlEle = pega.ctx.dom.getElementsByName(property);
                if (!htmlEle.length && !isTargetLabel) {
                    return (args.param[3] == "true");
                }
                if (htmlEle[0].type === "hidden" && htmlEle[1] && htmlEle[1].type === "checkbox") {
                    htmlEle = htmlEle[1];
                }
                else {
                    htmlEle = htmlEle[0];
                }
                var rgtOperand = args.param[2];
                if (rgtOperand && rgtOperand.indexOf("h:") == 0 && rgtOperand.length > 2) {
                    rgtOperand = rgtOperand.substring(2);
                    rHhtmlEle = pega.ctx.dom.getElementsByName(rgtOperand);
                    if (!rHhtmlEle.length) {
                        return (args.param[3] == "true");
                    }
                    if (rHhtmlEle[0].type === "hidden" && rHhtmlEle[1] && rHhtmlEle[1].type === "checkbox") {
                        rgtOperand = pega.u.d.getDOMElementValue(rHhtmlEle[1]);
                    }
                    else {
                        rgtOperand = pega.u.d.getDOMElementValue(rHhtmlEle[0]);
                    }
                }
                var actualValue = "";
                if (isTargetLabel) {
                    actualValue = labelValue;
                }
                else {
                    actualValue = pega.u.d.getDOMElementValue(htmlEle);
                }
                if (args.param[1] == pega.c.conditionEngine.opGTR || args.param[1] == pega.c.conditionEngine.opLSS ||
                    args.param[1] == pega.c.conditionEngine.opGTREQ || args.param[1] == pega.c.conditionEngine.opLSSEQ) {
                    if (!isNaN(actualValue) && !isNaN(rgtOperand)) {
                        actualValue = parseFloat(actualValue);
                        rgtOperand = parseFloat(rgtOperand);
                    }
                }
                switch (args.param[1]) {
                    case pega.c.conditionEngine.opEQ:
                        if (typeof actualValue === "boolean") {
                            actualValue = actualValue.toString();
                        }
                        return (actualValue == rgtOperand);
                    case pega.c.conditionEngine.opNotEQ:
                        if (typeof actualValue === "boolean") {
                            actualValue = actualValue.toString();
                        }
                        return (actualValue != rgtOperand);
                    case pega.c.conditionEngine.opGTR:
                        return (actualValue > rgtOperand);
                    case pega.c.conditionEngine.opLSS:
                        return (actualValue < rgtOperand);
                    case pega.c.conditionEngine.opIS:
                        return pega.c.conditionEngine.validateCondition({
                            op: "",
                            conditions: [
                                [rgtOperand]
                            ],
                            target: htmlEle
                        });
                    case pega.c.conditionEngine.opGTREQ:
                        return (actualValue >= rgtOperand);
                    case pega.c.conditionEngine.opLSSEQ:
                        return (actualValue <= rgtOperand);
                    default:
                        return true;
                }
            };
        })(validator = c.validator || (c.validator = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
;
var pega;
(function (pega) {
    var c;
    (function (c) {
        var conditionEngine;
        (function (conditionEngine) {
            //Built on the validator object. Maps a condition name to a validator function
            var validatorHash = {
                "Act": pega.c.validator.isActive,
                "Emp": pega.c.validator.isEmpty,
                "IAct": pega.c.validator.isInActive,
                "Pop": pega.c.validator.isPopulated,
                "ReadOnly": pega.c.validator.isReadOnly,
                "Editable": pega.c.validator.isReadWrite,
                "Req": pega.c.validator.isRequired,
                "NReq": pega.c.validator.isOptional,
                "OP": pega.c.validator.propertyRefCondition,
                "AP": pega.c.validator.propertyRefCondition
            };
            var keyCodes = {
                enter: 13,
                up: 38,
                down: 40,
                left: 37,
                right: 39,
                esc: 27,
                tab: 9
            };
            conditionEngine.opAND = "&", conditionEngine.opOR = "|", conditionEngine.opEQ = "=", conditionEngine.opNotEQ = "!=", conditionEngine.opGTR = ">", conditionEngine.opLSS = "<", conditionEngine.opIS = "is", conditionEngine.opGTREQ = ">=", conditionEngine.opLSSEQ = "<=";
            ;
            /*
             *condSpec parameter has the following structure
             *condSpec.op: The operator between conditions
             *condSpec.conditions: An array of conditions
             *condSpec.target: The target on which this condition has to be tested
             */
            function validateCondition(condSpec) {
                var currStatus = false, currValidator, operator, noConditions;
                if (!condSpec || !(condSpec.conditions.length > 0)) {
                    return true;
                }
                operator = condSpec.op;
                noConditions = condSpec.conditions.length;
                for (var i = 0; i < noConditions; i++) {
                    currValidator = validatorHash[condSpec.conditions[i][0]];
                    if (currValidator)
                        currStatus = currValidator.apply(pega.c.validator, [{
                                trgt: condSpec.target,
                                param: condSpec.conditions[i][1]
                            }]);
                    else
                        currStatus = true;
                    //Check for short circuit condition
                    if (operator === pega.c.conditionEngine.opAND && !currStatus) {
                        return false;
                    }
                    else if (operator === pega.c.conditionEngine.opOR && currStatus) {
                        return true;
                    }
                }
                if (operator == pega.c.conditionEngine.opAND)
                    return true;
                else if (operator == pega.c.conditionEngine.opOR)
                    return false;
                else
                    return currStatus;
            }
            conditionEngine.validateCondition = validateCondition;
            ;
            /*
             *key: allowed values enter, up, down, left, right, esc, tab, any
             *keyCode: Event keyCode
             *condSpec.conditions: An array of conditions
             *condSpec.target: The target on which this condition has to be tested
             */
            function validateKeyCode(key, keyCode, e) {
                if (key !== "any" && keyCodes[key || "enter"] !== keyCode) {
                    return false;
                }
                else if ((navigator.userAgent.toLowerCase().indexOf("ipad") !== -1 || navigator.userAgent.toLowerCase().indexOf("iphone") !== -1) && key === "any" && e && keyCode === 0) {
                    return true;
                }
                else if (key === "any" && ((e && (e.ctrlKey && !(/^(86|88|8|46|90)$/.test(keyCode)))) || (keyCode <= 45 && !(/^(8|16)$/.test(keyCode))))) {
                    return false;
                }
                return true;
            }
            conditionEngine.validateKeyCode = validateKeyCode;
            ;
        })(conditionEngine = c.conditionEngine || (c.conditionEngine = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
;
//static-content-hash-trigger-YUI
var pega;
(function (pega) {
    var u;
    (function (u) {
        var EventUtils;
        (function (EventUtils) {
            var timerObj = {
                eventTimer: null
            };
            var cachedGridObj = null;
            function replaceGridTokens(jsonDesc, rowRef, gargs) {
                if (!jsonDesc) {
                    return jsonDesc;
                }
                var locGargs;
                var regexFn = function () {
                    var prop, propRef, propDomArr, propArr, index;
                    propArr = arguments[0].split("$");
                    prop = propArr[1] || ""; /* SE-40805: If prop is undefined, initialize it to empty string */
                    ;
                    prop = prop.substring(0, prop.length - 1);
                    propRef = pega.u.property.toHandle(rowRef + "." + prop);
                    propDomArr = document.getElementsByName(propRef);
                    if (propDomArr && propDomArr[0]) {
                        return pega.control.PlaceHolder.getValue(propDomArr[0]).replace(/\"/g, '\\\"');
                    }
                    var rValue = pega.u.d.getPropertyValueFromCT(rowRef + "." + prop);
                    if (rValue)
                        return rValue;
                    return prop;
                }, regexFn1 = function () {
                    return rowRef + ".";
                };
                return jsonDesc.replace(/~!./g, regexFn1);
            }
            function focusGridEventActual(eventType, target) {
                var activeGrid = Grids.getElementsGrid(target);
                if (activeGrid && ((activeGrid.isLastEventFromRow || (pega.c.eventCONSTANTS.EVENT_CLICK(eventType) && activeGrid.isLastEventFromFlowAction(target))) || (activeGrid = Grids.getElementsGrid(activeGrid.gridDiv.parentNode)))) {
                    if (pega.ctx.Grid.focusedGrid && activeGrid != pega.ctx.Grid.focusedGrid) {
                        pega.ctx.Grid.focusedGrid.focusGrid(false);
                    }
                    activeGrid.focusGrid(true);
                    pega.ctx.Grid.focusedGrid = activeGrid;
                }
                else {
                    /* BUG-407950: Adding a null check for pega.ctx.Grid */
                    if (pega.ctx.Grid && pega.ctx.Grid.focusedGrid && !(activeGrid && target.id == "gridBody_left")) {
                        pega.ctx.Grid.focusedGrid.focusGrid(false);
                        pega.ctx.Grid.focusedGrid = null;
                    }
                    // bug-142042
                    if (target && target.nodeName == "BODY") {
                        setTimeout(function () {
                            // reflow main document body after modal callback on target.nodeName
                            document.body.className = document.body.className;
                        }, 50);
                    }
                }
            }
            ;
            EventUtils.isControl = function (ctlDescAttrName, el) {
                if (el.hasAttribute) {
                    return el.hasAttribute(ctlDescAttrName);
                }
                return ((typeof el.getAttribute(ctlDescAttrName)) == "string");
            };
            EventUtils.clear = function () {
                cachedGridObj = null;
            };
            EventUtils.cloneEvent = function (eventToClone, createDuplicateClone) {
                var x, result;
                createDuplicateClone = (createDuplicateClone == null || createDuplicateClone == undefined || createDuplicateClone == false) ? false : true;
                if (eventToClone.$cloned && !createDuplicateClone) {
                    return eventToClone;
                }
                result = {
                    $cloned: true,
                    $ev: eventToClone
                };
                for (x in eventToClone) {
                    result[x] = eventToClone[x];
                }
                result.preventDefault = function () {
                    var ev = this.$ev;
                    if (ev && typeof ev.preventDefault === 'function') {
                        try {
                            ev.preventDefault();
                        }
                        catch (exc) { }
                    }
                };
                result.stopPropagation = function () {
                    var ev = this.$ev;
                    if (ev && typeof ev.stopPropagation === 'function') {
                        try {
                            ev.stopPropagation();
                        }
                        catch (exc) { }
                    }
                };
                return result;
            };
            EventUtils.correctEventForMenu = function (target, e) {
                var evt = e;
                // if the menu is floating then only set the target to parent, else don't update the event.target.
                if (!target.closest("[node_name]") && $(target).hasClass("menu-item-anchor") && pega.c.eventCONSTANTS.EVENT_CLICK(e.type)) {
                    var menuItem = $(target).parent();
                    if (menuItem.length > 0) {
                        try {
                            if (pega.control.menu && pega.control.menu.showMenuTarget && $(target).parents("body > div > ul.menu").get(0) && pega.control.menu.showMenuTarget.getAttribute("data-menuid") == $(target).parents("body > div > ul.menu").get(0).getAttribute("id")) {
                                target = pega.control.menu.showMenuTarget;
                            }
                            else {
                                target = pega.control.menu.getMenuBarNode(menuItem.parent())[0];
                            }
                            evt = pega.u.EventUtils.cloneEvent(e.$ev);
                            evt.target = target;
                        }
                        catch (ex) { }
                    }
                }
                return evt;
            };
            EventUtils.executeFunctionWithDelay = function (func, args, scope, delay) {
                if (timerObj.eventTimer) {
                    clearTimeout(timerObj.eventTimer);
                    timerObj.eventTimer = setTimeout(function () {
                        func.apply(scope, args);
                        timerObj.eventTimer = null;
                    }, delay);
                }
                else {
                    func.apply(scope, args);
                    timerObj.eventTimer = setTimeout(function () {
                        timerObj.eventTimer = null;
                    }, delay);
                }
            };
            EventUtils.queueFocusGridEvent = function (eventType, target) {
                if (pega.util.Event.isIE || pega.util.Event.isSafari) {
                    clearTimeout(pega.ctx.Grid.focusTimeoutId);
                    if (pega.c.eventCONSTANTS.EVENT_CLICK(eventType)) {
                        focusGridEventActual(eventType, target);
                    }
                    else {
                        pega.ctx.Grid.focusTimeoutId = setTimeout(function () {
                            focusGridEventActual(eventType, target);
                        }, 100);
                    }
                }
                else {
                    focusGridEventActual(eventType, target);
                }
            };
            EventUtils.processGridBehaviors = function (e, eventType, target, jsonDesc, eventDescriptor, gridObj) {
                var retObj = {
                    'execute': false,
                    'args': null
                };
                if (eventType == "keyup" || pega.c.eventCONSTANTS.EVENT_CLICK(eventType) || pega.c.eventCONSTANTS.EVENT_DOUBLE_CLICK(eventType) || pega.c.eventCONSTANTS.EVENT_RIGHT_CLICK(eventType)) {
                    /* this is to fire grid events incase of expand/coolapse icons */
                    if (eventType == "keyup") {
                        var eventKeyCode = e.keyCode;
                    }
                    /* BUG-247242: The hiddenExpColl anchor doesn't have any action, let the tree grid handle it. ** TODO: This is a temporary measure. Once keyboard accessibility is supported
                     * for tree grids, there will be proper focus for rows, which can then handle actions configured on tree grids, similar to how expand icon in expand pane grid works ** */
                    if ((eventType == "keyup" && (eventKeyCode == 38 || eventKeyCode == 40)) || !pega.control.isActionableElement(target) || $(target).hasClass("hiddenExpColl") || pega.c.eventCONSTANTS.EVENT_RIGHT_CLICK(eventType)) {
                        /*For Non-Auto controls inside grid row, don't perform the keypress actions configured on Grid. For Auto control, check if the control has
                        any behavior matching the keycode. Then, don't proceed with Grid's key board actions.*/
                        var isNonAutoControl = false;
                        if (target.tagName && target.tagName.toUpperCase() != "TD" && (target.tagName.toUpperCase() != "UL")) {
                            isNonAutoControl = !(EventUtils.isControl("data-ctl", target) && target.getAttribute("data-ctl") != "non-auto");
                        }
                        if (eventType != "keyup" || (eventType == "keyup" && !isNonAutoControl && !pega.control.hasKeyUpActions(target, eventKeyCode) && !pega.control.hasImplicitKeyBehaviorsForAuto(target, eventKeyCode)) || (eventType == "keyup" && isNonAutoControl && pega.control.isNonAutoControlAllowed(target, eventKeyCode))) {
                            /* Grid Actions */
                            if (typeof (Grids) != 'undefined') {
                                //var gridObj = Grids.getActiveGrid(e);
                                if (pega.c.eventCONSTANTS.EVENT_DOUBLE_CLICK(eventType) && !gridObj && cachedGridObj) {
                                    gridObj = cachedGridObj;
                                    e["cachedGridObj"] = cachedGridObj;
                                    cachedGridObj = null;
                                }
                                else {
                                    cachedGridObj = gridObj;
                                }
                                if (gridObj) {
                                    var gridRow = gridObj.getRightRow();
                                    var gridDiv = gridObj.gridDiv;
                                    if (gridRow && gridDiv && gridObj.isLastEventFromRow) {
                                        //makenote
                                        jsonDesc = replaceGridTokens(gridDiv.getAttribute(eventDescriptor), gridObj.getEntryHandle(), gridRow.getAttribute("data-gargs"));
                                        if (jsonDesc) {
                                            /* Row markup gets refreshed when row details are submitted which makes the event's target element orphan.
                                               Hence setting the cachedGridObj in event object which is checked in window.doGridAction api */
                                            var parsedJson = pega.c.eventParser.parseJSON(jsonDesc);
                                            if (parsedJson.length > 1) {
                                                var len = parsedJson.length;
                                                for (var i = 0; i < len - 1; i++) {
                                                    if ((parsedJson[i][1][1] &&
                                                        (parsedJson[i][1][1] == "EDITITEM" ||
                                                            parsedJson[i][1][1] == "REFRESHROWS" ||
                                                            parsedJson[i][1][1] == "FLOWACTION" ||
                                                            parsedJson[i][1][1] == "REFRESHLIST")) ||
                                                        (parsedJson[i][0] && parsedJson[i][0] == "refresh" &&
                                                            parsedJson[i][1][0] && parsedJson[i][1][0] == "thisSection")) {
                                                        e["cachedGridObj"] = gridObj;
                                                        e["cachedGridRowId"] = gridRow.getAttribute("id");
                                                        var containerEle = (gridObj.rightBodyTbl && gridObj.rightBodyTbl.contains(target)) ?
                                                            gridObj.rightBodyTbl : gridObj.leftBodyUL;
                                                        var cell = gridObj.findCell(null, containerEle, target);
                                                        e["cachedGridCellIndex"] = (cell && cell.cellIndex) ?
                                                            cell.cellIndex : -1; /* set cellIndex to -1 if the cell is not a <td/> */
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        retObj.execute = true;
                                        retObj.args = [gridDiv, e, eventType, jsonDesc, null, null];
                                    }
                                }
                            }
                        }
                    }
                }
                else if (eventType == "keydown") {
                    var eventKeyCode = e.keyCode;
                    if (typeof (Grids) != 'undefined' && (eventKeyCode == 38 || eventKeyCode == 40)) {
                        var gridObj = Grids.getActiveGrid(e);
                        if (gridObj && gridObj.pageMode === "Progressive Load") {
                            var gridDiv = gridObj.gridDiv;
                            if (pega.c.hasKeyUpActions(gridDiv, eventKeyCode, true) && target.tagName.toUpperCase() != "SELECT" && target.tagName.toUpperCase() != "TEXTAREA") {
                                e.preventDefault();
                            }
                        }
                    }
                }
                return retObj;
            };
            EventUtils.fireEvent = function (target, type, args) {
                pega.util.Event.fireEvent(target, type, args);
            };
            EventUtils.getContextPagesFromGrid = function (e) {
                var grid, contextPage = "", gridRowRef, index, target, container, rtRow;
                if (typeof (Grids) != 'undefined') {
                    grid = Grids.getActiveGrid(e);
                    if (grid != null) {
                        if (!grid.isLastEventFromRow) {
                            contextPage = grid.gridReferencePage;
                        }
                        else {
                            /* BUG-387848: Get the grid row from event rather than the active row; active row can change in previous actions */
                            var rtRow;
                            if ((grid.bTree || grid.bTreegrid) && grid.leftBodyDiv && grid.leftBodyDiv.contains(e.target)) {
                                rtRow = jQuery(e.target).closest("li.gridRow").get(0);
                            }
                            else {
                                rtRow = jQuery(e.target).closest("tr.cellCont").get(0);
                            }
                            if (rtRow) {
                                var rowPage = rtRow.hpref ? rtRow.hpref : rtRow.id;
                                contextPage = pega.u.property.toReference(rowPage);
                            }
                        }
                    }
                    else {
                        grid = e["cachedGridObj"];
                    }
                    if (grid) {
                        index = -1;
                        target = e.target;
                        container;
                        if (grid.leftBodyUL && grid.leftBodyUL.contains(target))
                            container = grid.leftBodyUL;
                        else if (grid.rightBodyTbl && grid.rightBodyTbl.contains(target))
                            container = grid.rightBodyTbl;
                        if (container) {
                            var cell = grid.findCell(e, container);
                            if (cell) {
                                index = grid.getRowIndex(cell);
                                /* BUG-129357: Changed to exclude categorized rows : START */
                                index = grid.getActiveRowIndexFromRowIndex(index);
                            }
                            if (index != -1) {
                                gridRowRef = grid.getEntryHandle(index);
                            }
                        }
                        if (gridRowRef == undefined) {
                            gridRowRef = grid.getEntryHandle();
                        }
                        if (gridRowRef) {
                            var gridRow = rtRow || grid.getRightRow();
                            if (index != -1 && (!gridRow)) {
                                gridRow = grid.getRightRow(index);
                            }
                            /* BUG-126756 : added to correct grid index in case of categorization with filtering ---chens3*/
                            if (!grid.bPageGroup && gridRow && pega.c.AutoCompleteAG && pega.c.AutoCompleteAG.isElementInsideAutoComPO(e)) {
                                gridRowRef = gridRowRef.replace(/\([0-9]\)$/, "(" + gridRow.getAttribute('PL_INDEX') + ")");
                            }
                        }
                    }
                }
                return {
                    cP: contextPage,
                    rP: gridRowRef
                };
            };
            EventUtils.isElementDisabled = function (el, eventObj) {
                if (el.getAttribute && (el.getAttribute('data-ctl') == 'RadioGroup' || el.getAttribute('data-ctl') == 'Checkbox')) {
                    var sourceElem = eventObj.target;
                    if (sourceElem && (sourceElem.type == "radio" || sourceElem.type == "checkbox")) {
                        if (sourceElem.disabled) {
                            return true;
                        }
                    }
                    else if (sourceElem && sourceElem.tagName && sourceElem.tagName.toLowerCase() == 'label') {
                        sourceElem = sourceElem.control;
                        if (sourceElem && sourceElem.disabled) {
                            return true;
                        }
                    }
                    else {
                        var inputArr = $(el).find('input');
                        if (inputArr && inputArr.length > 0) {
                            return ($(el).find('input')[0]).disabled;
                        }
                    }
                }
                if (typeof el.disabled === 'boolean') {
                    return el.disabled;
                }
                return typeof el.attributes["disabled"] !== 'undefined';
            };
        })(EventUtils = u.EventUtils || (u.EventUtils = {}));
    })(u = pega.u || (pega.u = {}));
})(pega || (pega = {}));
//static-content-hash-trigger-YUI
if (!pega.control) {
    pega.c = pega.namespace("pega.control");
}
var pega;
(function (pega) {
    var c;
    (function (c) {
        var formatter;
        (function (formatter) {
            formatter.getReadOnlyFormatting = function (e, hiddenInputCalendar) {
                var target = e.target;
                var propEntryHandle = target.name;
                if (hiddenInputCalendar == "true") {
                    if (target.parentNode.hasAttribute("data-template") && pega.ui.Formatter && pega.ui.Formatter.formatDateTime) {
                        var nextSpan = target.nextElementSibling;
                        var readonlyModePage = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name")).pyCell.pyModes[1];
                        var editableModePage = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name")).pyCell.pyModes[0];
                        var formatType = readonlyModePage.pyFormatType;
                        if (editableModePage.pyDateTime == 'time') {
                            formatType = 'time';
                        }
                        var dateTimeFrame = {};
                        if (readonlyModePage.pyDateTimeFormat == "DateTime-Frame" || readonlyModePage.pyDateTimeFormat == "DateTime-Frame-Short") {
                            dateTimeFrame.fromNow = true;
                            dateTimeFrame.secNoCutoff = readonlyModePage.pyDateTimeSecondCutoff;
                            dateTimeFrame.propType = readonlyModePage.pyPropertyType;
                            dateTimeFrame.type = readonlyModePage.pyFormatType;
                            dateTimeFrame.formatType = readonlyModePage.pyDateTimeFormat;
                            if (readonlyModePage.pyDateTimeFormat == "DateTime-Frame-Short") {
                                dateTimeFrame.pyDontShowPastFuture = readonlyModePage.pyDontShowPastFuture;
                            }
                        }
                        else if (readonlyModePage.pyDateFormat == "DateTime-Frame" || readonlyModePage.pyDateFormat == "DateTime-Frame-Short") {
                            dateTimeFrame.fromNow = true;
                            dateTimeFrame.secNoCutoff = readonlyModePage.pyDateTimeSecondCutoff;
                            dateTimeFrame.propType = readonlyModePage.pyPropertyType;
                            dateTimeFrame.type = readonlyModePage.pyFormatType;
                            dateTimeFrame.formatType = readonlyModePage.pyDateFormat;
                            if (readonlyModePage.pyDateFormat == "DateTime-Frame-Short") {
                                dateTimeFrame.pyDontShowPastFuture = readonlyModePage.pyDontShowPastFuture;
                            }
                        }
                        var setText = "innerText" in nextSpan ? "innerText" : "textContent";
                        if (formatType == "datetime") {
                            var customTimeZone = target.getAttribute("data-custom-timezone") || pega.u.d.TimeZone;
                            var targetValue = target.value;
                            var dataValue = target.getAttribute("data-value");
                            var valueToBeFormatted = targetValue;
                            if (target.type == "hidden") {
                                if (target.getAttribute("data-custom-timezone")) {
                                    valueToBeFormatted = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(targetValue, pega.u.d.TimeZone || pega.u.d.serverTimeZone, customTimeZone);
                                }
                            }
                            if (dateTimeFrame && dateTimeFrame.fromNow) {
                                // from now considers system time to compare, so we should convert time to local system time
                                valueToBeFormatted = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(valueToBeFormatted, customTimeZone, moment.tz.guess(true));
                            }
                            nextSpan[setText] = (valueToBeFormatted) ? pega.ui.Formatter.formatDateTime(valueToBeFormatted, readonlyModePage.pyCustDateTime, dateTimeFrame, readonlyModePage.pyDateTimeHourFormat, "", "1", null, customTimeZone) : "";
                        }
                        else if (formatType == "date") {
                            nextSpan[setText] = (target.value) ? pega.ui.Formatter.formatDateTime(target.value, readonlyModePage.pyCustDateTime, dateTimeFrame, "", "", "0") : "";
                        }
                        else if (formatType == "time") {
                            nextSpan[setText] = (target.value) ? pega.ui.Formatter.formatDateTime(target.value, readonlyModePage.pyCustDateTime, dateTimeFrame, readonlyModePage.pyDateTimeHourFormat, "", "2") : "";
                        }
                    }
                    else if (target.getAttribute("data-format-method")) {
                        pega.c.postValue.initiatePost(e, "controlEventReadOnly");
                    }
                }
                else {
                    if (target && target.getAttribute("data-formatting") === "yes") {
                        var originalValueStr = target.getAttribute("data-value");
                        var bValChanged = target.getAttribute("data-changed") == 'true';
                        var bPrevValEqualsTargetVal = target.hasOwnProperty("prevValue") && target.prevValue !== target.value;
                        var bOrigValEqualsTargetVal = originalValueStr != null && typeof (originalValueStr) != "undefined" && originalValueStr != target.value;
                        var nameControl = null;
                        var readonlyModePage = null;
                        if (pega && pega.ui && pega.ui.controlMetadataMapper) {
                            nameControl = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name"));
                        }
                        if (nameControl && nameControl.pyCell && nameControl.pyCell.pyModes) {
                            readonlyModePage = nameControl.pyCell.pyModes[1];
                        }
                        var bDecimalPrecision = target.value !== "" && readonlyModePage && readonlyModePage.pyDecimalPlaces != 0 ? true : false;
                        /* if(target.getAttribute("data-auto-formatting") === "true"){
                            bOrigValEqualsTargetVal = pega.u.d.formatNumberWithSeparators(originalValueStr) != target.value;
                        }
                        BUG-670743:commenting, fixing trancation of decimals precisions.
                        */
                        if (bValChanged || bPrevValEqualsTargetVal || bOrigValEqualsTargetVal || bDecimalPrecision) {
                            if (target.type === "text" && target.getAttribute("data-auto-formatting") && target.getAttribute("data-auto-formatting") === "true") {
                                var formattedVal = pega.u.d.formatNumberWithSeparators(originalValueStr);
                                var checFormattedValEqualsTargetVal = formattedVal === target.value;
                                var numeric_separator = window.numeric_separator ? window.numeric_separator : ",";
                                var decimal_separator = window.decimal_separator ? window.decimal_separator : ".";
                                if (!checFormattedValEqualsTargetVal && typeof target.value === 'string' && (target.value.endsWith(numeric_separator) || target.value.endsWith(decimal_separator))) {
                                    target.setAttribute("data-value", formattedVal);
                                    target.value = formattedVal;
                                }
                                else if (!checFormattedValEqualsTargetVal) {
                                    target.setAttribute("data-value", target.value);
                                }
                            }
                            else {
                                target.setAttribute("data-value", target.value);
                            }
                            if (target.hasAttribute("data-template") || target.parentNode.hasAttribute("data-template")) {
                                if (target.getAttribute("data-ctl") == '["DatePicker"]' && pega.ui.Formatter && pega.ui.Formatter.formatDateTime) {
                                    if (propEntryHandle && window.getErrorDB && window.getErrorDB().isHavingError(propEntryHandle)) {
                                        return;
                                    }
                                    target.setAttribute("data-value", target.value);
                                    var readonlyModePage = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name")).pyCell.pyModes[1];
                                    var editableModePage = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name")).pyCell.pyModes[0];
                                    var formatType = readonlyModePage.pyFormatType;
                                    if (editableModePage.pyDateTime == 'time') {
                                        formatType = 'time';
                                    }
                                    var dateTimeFrame = {};
                                    if (readonlyModePage.pyDateTimeFormat == "DateTime-Frame" || readonlyModePage.pyDateTimeFormat == "DateTime-Frame-Short") {
                                        dateTimeFrame.fromNow = true;
                                        dateTimeFrame.secNoCutoff = readonlyModePage.pyDateTimeSecondCutoff;
                                        dateTimeFrame.propType = readonlyModePage.pyPropertyType;
                                        dateTimeFrame.type = readonlyModePage.pyFormatType;
                                        dateTimeFrame.formatType = readonlyModePage.pyDateTimeFormat;
                                        if (readonlyModePage.pyDateTimeFormat == "DateTime-Frame-Short") {
                                            dateTimeFrame.pyDontShowPastFuture = readonlyModePage.pyDontShowPastFuture;
                                        }
                                    }
                                    else if (readonlyModePage.pyDateFormat == "DateTime-Frame" || readonlyModePage.pyDateFormat == "DateTime-Frame-Short") {
                                        dateTimeFrame.fromNow = true;
                                        dateTimeFrame.secNoCutoff = readonlyModePage.pyDateTimeSecondCutoff;
                                        dateTimeFrame.propType = readonlyModePage.pyPropertyType;
                                        dateTimeFrame.type = readonlyModePage.pyFormatType;
                                        dateTimeFrame.formatType = readonlyModePage.pyDateFormat;
                                        if (readonlyModePage.pyDateFormat == "DateTime-Frame-Short") {
                                            dateTimeFrame.pyDontShowPastFuture = readonlyModePage.pyDontShowPastFuture;
                                        }
                                    }
                                    if (target.getAttribute("data-editinput") && target.getAttribute("data-editinput") != "") {
                                        pega.c.postValue.initiatePost(e, "controlEventReadOnly");
                                    }
                                    else if (formatType == "datetime") {
                                        var customTimeZone = target.getAttribute("data-custom-timezone") || pega.u.d.TimeZone;
                                        var targetValue = target.value;
                                        var dataValue = target.getAttribute("data-value");
                                        var valueToBeFormatted = targetValue;
                                        if (target.type == "hidden") {
                                            if (target.getAttribute("data-custom-timezone")) {
                                                valueToBeFormatted = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(targetValue, pega.u.d.TimeZone || pega.u.d.serverTimeZone, customTimeZone);
                                            }
                                        }
                                        if (dateTimeFrame && dateTimeFrame.fromNow) {
                                            // from now considers system time to compare, so we should convert time to local system time
                                            valueToBeFormatted = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(valueToBeFormatted, customTimeZone, moment.tz.guess(true));
                                        }
                                        target.value = (valueToBeFormatted) ? pega.ui.Formatter.formatDateTime(valueToBeFormatted, readonlyModePage.pyCustDateTime, dateTimeFrame, readonlyModePage.pyDateTimeHourFormat, "", "1", null, customTimeZone) : "";
                                    }
                                    else if (formatType == "date") {
                                        target.value = (target.value) ? pega.ui.Formatter.formatDateTime(target.value, readonlyModePage.pyCustDateTime, dateTimeFrame, "", "", "0") : "";
                                    }
                                    else if (formatType == "time") {
                                        target.value = (target.value) ? pega.ui.Formatter.formatDateTime(target.value, readonlyModePage.pyCustDateTime, dateTimeFrame, readonlyModePage.pyDateTimeHourFormat, "", "2") : "";
                                    }
                                    target.setAttribute("data-formatting", "done");
                                }
                                else if (target.getAttribute("data-ctl") == '["TextInput"]' && pega.ui.Formatter && pega.ui.Formatter.formatNumber) {
                                    try {
                                        if (!(pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) && target.getAttribute("validationtype")) {
                                            pega.c.postValue.initiatePost(e, "controlEventReadOnly");
                                        }
                                        else {
                                            if (propEntryHandle && window.getErrorDB && window.getErrorDB().isHavingError(propEntryHandle)) {
                                                return;
                                            }
                                            var readonlyModePage = pega.ui.controlMetadataMapper.getTemplatePage(target.getAttribute("name")).pyCell.pyModes[1];
                                            target.setAttribute("data-value", target.value);
                                            target.value = pega.ui.Formatter.formatNumber(target.value, readonlyModePage, true);
                                            target.setAttribute("data-formatting", "done");
                                        }
                                    }
                                    catch (e) {
                                    }
                                }
                            }
                            else if (target.getAttribute("data-format-method")) {
                                pega.c.postValue.initiatePost(e, "controlEventReadOnly");
                            }
                        }
                        else {
                            if (target.value != "") {
                                try {
                                    var targetErrorDiv = document.getElementById(target.name + "Error");
                                    if (!targetErrorDiv || (targetErrorDiv && targetErrorDiv.style.display == "none")) {
                                        target.value = target.getAttribute("data-display-value");
                                        target.removeAttribute("data-display-value");
                                        target.setAttribute("data-formatting", "done");
                                    }
                                }
                                catch (e) { }
                            }
                            else {
                                target.setAttribute("data-formatting", "done");
                            }
                        }
                    }
                }
            };
            formatter.setSubmitValue = function (target) {
                if (target.getAttribute("data-formatting") === "done") {
                    target.setAttribute("data-formatting", "yes");
                    var originalValueStr = target.getAttribute("data-value");
                    if (originalValueStr != null && typeof (originalValueStr) != "undefined" && originalValueStr != "") {
                        target.setAttribute("data-display-value", target.value);
                        target.value = originalValueStr;
                    }
                    if (target.getAttribute("data-auto-formatting") && target.getAttribute("data-auto-formatting") == "true") {
                        target.value = pega.u.d.formatNumberWithSeparators(originalValueStr);
                    }
                }
            };
        })(formatter = c.formatter || (c.formatter = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
//static-content-hash-trigger-YUI
/*
Infrastructure for Post Value of the controls
*/
if (!pega.control) {
    pega.c = pega.namespace("pega.control");
}
var pega;
(function (pega) {
    var c;
    (function (c) {
        var postValue;
        (function (postValue) {
            var origin, src, propValue, eventSrcObj, replaceEle, isInGrid;
            var callApplyConditions = function () {
                var i, newEleLength, newElement = document.getElementsByName(src.name);
                if (newElement) {
                    i = 0;
                    newEleLength = newElement.length;
                    while (i < newEleLength) {
                        if (eventSrcObj.src && eventSrcObj.src.type === "radio") {
                            if (newElement[i].id === eventSrcObj.src.id) {
                                break;
                            }
                        }
                        else if (newElement[i].getAttribute('PN')) {
                            break;
                        }
                        i = i + 1;
                    }
                    if (i < newEleLength) {
                        var target = null;
                        if (newElement[i] && newElement[i].name) {
                            target = pega.u.property.toReference(newElement[i].name);
                        }
                        pega.u.d.evaluateClientConditions('ELEM', target, undefined, undefined, newElement[i]);
                    }
                }
                /*pega.u.d.loadHTMLEleCallback(replaceEle);*/
            };
            var readOnlyFormattingHandler = function (responseObj) {
                var actualSrc = responseObj.argument;
                var newDiv, errorDivName = actualSrc.name + "Error", divObjs, error = false, errorDiv, idx, readonlyStr, textElem, newStream = responseObj.responseText;
                if (newStream && typeof (newStream) === "string" &&
                    newStream.indexOf("<html>") !== -1 || newStream.indexOf("<html lang=") !== -1 || newStream.indexOf("<!DOCTYPE html>") !== -1) {
                    if (actualSrc.type === "text" && actualSrc.getAttribute("data-auto-formatting") && actualSrc.getAttribute("data-auto-formatting") == "true") {
                        actualSrc.setAttribute("data-value", actualSrc.value);
                        actualSrc.setAttribute("data-formatting", "done");
                        actualSrc.removeAttribute("data-display-value");
                    }
                    return;
                }
                newDiv = document.createElement("div");
                newDiv.innerHTML = responseObj.responseText;
                divObjs = newDiv.getElementsByTagName("DIV");
                if (divObjs && divObjs.length >= 1) {
                    for (idx = 0; idx < divObjs.length; idx += 1) {
                        if (divObjs[idx].id === errorDivName) {
                            error = true;
                        }
                        if (divObjs[idx].id && typeof (divObjs[idx].id) === "string" && divObjs[idx].id.indexOf("AJAXCT") !== -1) {
                            newDiv.removeChild(divObjs[idx]);
                        }
                    }
                }
                if (!error) {
                    readonlyStr = newDiv.textContent || newDiv.innerText;
                    readonlyStr = readonlyStr.replace(/(\t)|(\n)|(^\s+)|(\s+$)/gm, "");
                    if (actualSrc.type === "hidden" && actualSrc.getAttribute('data-ctl') && JSON.parse(actualSrc.getAttribute('data-ctl'))[0] === "DatePicker") {
                        textElem = actualSrc.nextSibling;
                        pega.control.PlaceHolder.removeClass(textElem);
                        textElem.innerHTML = readonlyStr;
                    }
                    else {
                        /*Added below code as part of BUG-742965 Fix*/
                        if (actualSrc.type === "text" && actualSrc.getAttribute("data-auto-formatting") && actualSrc.getAttribute("data-auto-formatting") == "true") {
                            var checFormattedValEqualsTargetVal = pega.u.d.formatNumberWithSeparators(actualSrc.value) === actualSrc.value;
                            if (!checFormattedValEqualsTargetVal) {
                                actualSrc.setAttribute("data-value", actualSrc.value);
                            }
                        }
                        else {
                            actualSrc.setAttribute("data-value", actualSrc.value);
                        }
                        /**End*/
                        actualSrc.value = readonlyStr;
                        actualSrc.setAttribute("data-formatting", "done");
                        actualSrc.removeAttribute("data-display-value");
                        try {
                            if (!(pega.cl && pega.cl.isTouchAble()) && pega.u.d.focusElement && document.activeElement !== pega.u.d.focusElement) {
                                pega.u.d.focusDomElement(pega.u.d.focusElement);
                            }
                        }
                        catch (ignore) { }
                    }
                    errorDiv = document.getElementById(errorDivName);
                    if (errorDiv) {
                        errorDiv.style.display = "none";
                    }
                }
                else {
                    onPostSuccess(responseObj);
                }
            };
            var resetDefaultChecked = function (src) {
                var domElement = $(src).closest("div[data-ctl='RadioGroup']");
                if (domElement && domElement.length > 0 && domElement[0]) {
                    var radioInputs = pega.util.Dom.getElementsByAttribute("type", "radio", "INPUT", domElement[0]);
                    for (var i = 0; i < radioInputs.length; i++) {
                        var elem = radioInputs[i];
                        if (src.name === elem.name) {
                            elem.defaultChecked = false;
                        }
                    }
                }
            };
            var onPostSuccess = function (responseObj) {
                var controlMarkUp = responseObj.responseText;
                if (src.value !== propValue) {
                    return;
                }
                var wrapper = document.createElement("div");
                wrapper.innerHTML = controlMarkUp;
                var parentNode = src.parentNode;
                //remove error div correctly on post value
                var selector, srcParent;
                if (src.type == "checkbox") {
                    selector = "[data-ctl='Checkbox']";
                }
                else if (src.type == "radio") {
                    selector = "[data-ctl='RadioGroup']";
                }
                else if (src.type == "textarea") {
                    selector = ".TextAreaContainer";
                }
                if (src.type == "checkbox" || src.type == "radio" || src.type == "textarea") {
                    srcParent = $(src).closest(selector);
                    if (srcParent.length > 0) {
                        if (src.type == "textarea" || src.type == "radio") {
                            parentNode = srcParent[0];
                        }
                        else
                            parentNode = srcParent[0].parentNode;
                    }
                }
                var name = src.name;
                var errSelector = "[id='" + name + "Error']";
                var oldErrorDiv = null;
                if (parentNode) {
                    oldErrorDiv = parentNode.querySelector(errSelector);
                }
                //BUG-574808
                if (oldErrorDiv == null && src.type == "radio") {
                    parentNode = parentNode.parentNode;
                    oldErrorDiv = parentNode.querySelector(errSelector);
                }
                if (oldErrorDiv) {
                    oldErrorDiv.remove(); /*BUG-603173 Fix*/
                    /* Remove labelError class on the label */
                    if (typeof (findLabelFor) == "function" && findLabelFor) {
                        var labelForElement = findLabelFor(src);
                        if (labelForElement) {
                            pega.u.d.removeClass(labelForElement, "labelError");
                        }
                    }
                    src.hasAttribute("aria-invalid") && src.setAttribute("aria-invalid", "false");
                }
                var errorDiv = wrapper.querySelector(errSelector);
                if (errorDiv) {
                    parentNode.appendChild(errorDiv);
                    /* add labelError class on the label */
                    if (typeof (findLabelFor) == "function" && findLabelFor) {
                        var labelForElement = findLabelFor(src);
                        if (labelForElement) {
                            pega.u.d.addClass(labelForElement, "labelError");
                        }
                    }
                    src.hasAttribute("aria-invalid") && src.setAttribute("aria-invalid", "true");
                }
                if (!errorDiv) {
                    if (src.getAttribute("readOnly") !== "true") {
                        var isContainerDirty = pega.u.d.isContainerDirty(src.parentNode);
                        if (isContainerDirty && !pega.u.d.bModalDialogOpen)
                            pega.ctx.gSectionReloaded = isContainerDirty;
                    }
                    var type = src.type;
                    //BUG-483955 Start - escape apostrophe
                    var elemSelector = (type == "checkbox") ? "[name='" + name + "'][type='" + type + "']" : ((type == "radio") ? "[id='" + src.id.replace(/\'/g, "\\'") + "']" : "[name='" + name + "']");
                    //BUG-483955 End
                    var elem = wrapper.querySelector(elemSelector);
                    var value = elem ? elem.value : src.value;
                    if (type === "radio") {
                        resetDefaultChecked(src);
                    }
                    if (type == "checkbox" || type == "radio")
                        src.defaultChecked = src.checked;
                    else if (type == "text" || type == "textarea")
                        src.defaultValue = value;
                    /* Setting selected attribute as there are some specs using this*/
                    if (src.tagName.toLowerCase() == "select") {
                        var options = src.options;
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].value === value) {
                                options[i].setAttribute("selected", "selected");
                            }
                            else {
                                options[i].removeAttribute("selected");
                            }
                        }
                    }
                    /*src.value = value;*/
                    /* BUG-504334 - Post Value on TextInput and TextArea with toUpperCase in Edit Input for the property, on posting the value we should update the element with response value */
                    var dataCtlJSON;
                    if (src.hasAttribute('data-ctl')) {
                        try {
                            dataCtlJSON = JSON.parse(src.getAttribute('data-ctl'));
                        }
                        catch (e) {
                        }
                    }
                    if (dataCtlJSON && Array.isArray(dataCtlJSON) && ((dataCtlJSON.indexOf("TextInput") != -1 && !src.hasAttribute("data-formatting")) || dataCtlJSON.indexOf("TextArea") != -1)) {
                        src.value = value;
                    }
                    src.setAttribute("value", value); /*Setting attribute also as we have specs using attribute*/
                    src.removeAttribute("data-old-value");
                    //BUG-486987 Update src element attribute 'data-formatting' with whatever is sent by server
                    //BUG-499073 Added condition because we should not update data-formatting attribute for date picker.
                    if (!(src.dataset.ctl && src.dataset.ctl.indexOf("DatePicker") != -1) && src.hasAttribute("data-formatting") && elem.hasAttribute("data-formatting")) {
                        src.setAttribute("data-formatting", elem.getAttribute("data-formatting"));
                    }
                }
                if (origin === "clientEvent") {
                    callApplyConditions();
                }
            };
            var emptyFunction = function () { };
            var getContextPage = function (eventObj, src, propEntryHandle) {
                var contextPage = "", rtRow, srcEle, containerEle, cell, gridObj, index, rowPage, secDiv;
                if (eventObj && typeof Grids !== 'undefined') {
                    gridObj = Grids.getActiveGrid(eventObj);
                }
                secDiv = pega.u.d.getSectionDiv(src);
                /*BUG-297484 - Need to get ContextPage for ThreadProcessing Grid also. Removing check !gridObj.threadProcessing */
                if (gridObj && gridObj.gridcontDiv && gridObj.gridcontDiv.contains(src) && secDiv && secDiv.contains(gridObj.gridcontDiv)) {
                    isInGrid = true;
                    srcEle = eventObj.target;
                    containerEle = gridObj.rightBodyTbl.contains(srcEle) ? gridObj.rightBodyTbl : gridObj.leftBodyUL;
                    cell = gridObj.findCell(null, containerEle, srcEle);
                    if (cell && cell.tagName !== 'TH' && !cell.classList.contains('headerCell')) {
                        /*BUG-560508: applies the same to TreeGrid*/
                        window.doGridAction(eventObj, "SETFOCUS"); /*BUG-281862:active row is not set, so correct index is not returned*/
                    }
                    index = gridObj.getActiveRowIndex();
                    if (!index) {
                        index = "";
                    }
                    if (!(index === "" || (gridObj.rightBodyTbl && gridObj.rightBodyTbl.rows && index > gridObj.rightBodyTbl.rows.length - 1))) {
                        //window.doGridAction(eventObj, "SETFOCUS");
                        rtRow = null;
                        if (gridObj.bCategorizedGrid) {
                            if (!(cell && !cell.parentNode.id)) {
                                rtRow = gridObj.getRightRow();
                            }
                        }
                        else {
                            if (cell.tagName !== 'TH') {
                                rtRow = gridObj.getRightRow();
                            }
                        }
                        if (rtRow) {
                            rowPage = rtRow.hpref || rtRow.id;
                            contextPage = { "contextPage": pega.u.property.toReference(rowPage), "pegaRLIndex": index };
                        }
                    }
                }
                else if (gridObj == null && pega.u.d.getRepeatObject(src, true)) {
                    rtRow = pega.u.d.getRepeatRow(src, true);
                    if (secDiv.contains(rtRow) && rtRow.hPref) {
                        contextPage = pega.u.property.toReference(rtRow.hPref);
                    }
                    else {
                        contextPage = pega.u.property.toReference(propEntryHandle.substring(0, propEntryHandle.lastIndexOf("$")));
                    }
                }
                return contextPage;
            };
            /*
             * Posts the value of the cell and refreshs the cell markup from server
             * @param event: Event or pega.u.d.ClientEventAPI object
             * @param strOrigin: controlEvent (control's post value behaviour) or clientEvent (triggered from ClientEventAPI)
             */
            postValue.initiatePost = function (event, strOrigin, updateDOM) {
                var srcValue, eventObj, propEntryHandle, reloadElement, contextPage, reloadFail = false, strUrlSF, queryString, postSuccess = onPostSuccess, index, rteElem, tempSrc, callBack;
                origin = strOrigin;
                eventSrcObj = isInGrid = replaceEle = undefined;
                updateDOM = (typeof updateDOM === "undefined") ? true : updateDOM;
                if (origin === "clientEvent") {
                    src = event.src;
                    eventObj = event.ev;
                    eventSrcObj = event;
                }
                else {
                    src = event.target;
                    eventObj = event;
                }
                var currentContext = pega.ctxmgr.getCurrentHarnessContext();
                pega.ctxmgr.setContext(pega.ctxmgr.getContextByTarget(event.target));
                /* BUG-386655: START - if event.target is stale element, initialise with updated dom */
                if (typeof (src) != "undefined" && src != null && !src.parentNode && src.name) {
                    var srcList = pega.ctx.dom.getElementsByName(src.name);
                    if (srcList && srcList.length >= 1) {
                        src = srcList[0];
                    }
                }
                /* BUG-386655: END */
                var isMultiSelectControl = src.classList.contains("multiselect-list") ? true : false;
                var isDateRangeControl = false;
                var srcOtherElem;
                if (src.hasAttribute("data-datetype")) {
                    var insId = JSON.parse(src.parentNode.dataset.daterange).id;
                    var qs = "[data-daterange*='" + insId + "'] > [data-datetype='end']";
                    var srcOtherElem = $(src).closest(".content-item")[0].parentNode.querySelector(qs);
                    isDateRangeControl = true;
                }
                if (src.tagName.toLowerCase() === "label") {
                    src = src.control;
                    if (!src) {
                        return;
                    }
                }
                else if (src.tagName.toLowerCase() === "textarea" && src.id.indexOf('PEGACKEDITOR') > -1) {
                    $.each(pega.u.d.harnessElements, function (ind, ele) {
                        if (ele.element && ele.element.txtAreaId === src.id) {
                            index = ind;
                            return false;
                        }
                    });
                    rteElem = pega.u.d.harnessElements[index].element;
                    if (rteElem) {
                        rteElem.preSubmitFunction(rteElem, true);
                    }
                }
                else if (src.tagName.toLowerCase() === "span" && src.childNodes && src.childNodes[1] && src.childNodes[1].type === "checkbox") {
                    src = src.childNodes[1];
                }
                else if (src.tagName.toLowerCase() == "button") {
                    tempSrc = $(src).find("div.pzbtn-mid");
                    if (tempSrc.length)
                        src = tempSrc;
                }
                propEntryHandle = src.name;
                if ((!propEntryHandle && !isMultiSelectControl) || (typeof window.getErrorDB == 'function' && window.getErrorDB().isHavingError(propEntryHandle))) {
                    return;
                }
                propValue = src.value;
                if (src.getAttribute("data-ctl") == "non-auto" || isMultiSelectControl) {
                    updateDOM = false;
                }
                reloadElement = src;
                if (reloadElement && reloadElement.name) {
                    var elem = pega.ctx.dom.getElementsByName(reloadElement.name)[0];
                    if (elem) {
                        reloadElement = elem;
                        if (elem.type == "text" || elem.type == "textarea") {
                            src = elem;
                        }
                    }
                }
                while ((reloadElement.id !== "RULE_KEY") || (reloadElement.getAttribute("node_type") !== "MAIN_RULE")) {
                    reloadElement = reloadElement.parentNode;
                    if (reloadElement === null) {
                        reloadFail = true;
                        break;
                    }
                }
                if (origin === "clientEvent") {
                    eventSrcObj.initializeVariables();
                    srcValue = eventSrcObj.srcValue;
                }
                else {
                    srcValue = pega.u.d.getDOMElementValue(src);
                    var customTimeZone = src.getAttribute("data-custom-timezone");
                    if (customTimeZone) {
                        if (src.type !== "hidden") {
                            srcValue = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(src.getAttribute("data-value"), customTimeZone, pega.u.d.TimeZone);
                        }
                    }
                }
                if (typeof srcValue === "undefined" || srcValue === null) {
                    reloadFail = true;
                }
                if (!reloadFail) {
                    var stepPageContext = getContextPage(eventObj, src, propEntryHandle);
                    var pegaRLIndex = null;
                    try {
                        if (typeof (stepPageContext) === "object") {
                            pegaRLIndex = stepPageContext.pegaRLIndex;
                            contextPage = stepPageContext.contextPage;
                        }
                        else {
                            contextPage = stepPageContext;
                        }
                    }
                    catch (e) { }
                    strUrlSF = window.SafeURL_createFromURL(pega.u.d.url);
                    queryString = new SafeURL();
                    var postvalueurl = reloadElement.getAttribute("data-postvalue-url");
                    if (!postvalueurl) {
                        var nodeName = reloadElement.getAttribute("node_name");
                        var postvalueurldiv = reloadElement.querySelector("div[node_name='" + nodeName + "'] > div[data-postvalue-url]");
                        if (postvalueurldiv) {
                            postvalueurl = postvalueurldiv.getAttribute("data-postvalue-url");
                        }
                    }
                    if (postvalueurl) {
                        strUrlSF.put(postvalueurl, "");
                        pega.u.d.ct_postedProp = propEntryHandle;
                    }
                    else {
                        strUrlSF.put("pyActivity", "ReloadCell");
                        strUrlSF.put("StreamName", reloadElement.getAttribute("node_name"));
                    }
                    strUrlSF.put("pyPropertyTarget", propEntryHandle);
                    strUrlSF.put("updateDOM", updateDOM);
                    strUrlSF.put("BaseReference", pega.u.d.getBaseRef(reloadElement));
                    strUrlSF.put("ContextPage", contextPage);
                    strUrlSF.put("pzKeepPageMessages", "true");
                    /* BUG-304902: setting pega_RLindex for the elements inside grid */
                    if (pegaRLIndex != null) {
                        strUrlSF.put("pega_RLindex", pegaRLIndex);
                    }
                    if (origin !== "clientEvent" && event) {
                        /* BUG-270058 - START - send rdl index during post value so that id is generated as expected. */
                        var targetEle = event.target || event.srcElement;
                        var unique_id = "";
                        if (targetEle && targetEle.tagName.toUpperCase() == "INPUT") {
                            unique_id = targetEle.getAttribute("id");
                        }
                        else if (targetEle && targetEle.tagName.toUpperCase() == "LABEL") {
                            unique_id = targetEle.getAttribute("for");
                        }
                        if (unique_id && unique_id.indexOf("_rdi_") != -1) {
                            var rdl_index = unique_id.split("_rdi_")[1];
                            if (rdl_index) {
                                strUrlSF.put("RepeatDynamicIndex", rdl_index);
                            }
                        }
                    }
                    if (origin === "controlEventReadOnly") {
                        strUrlSF.put("getReadonlyFormat", "true");
                        if (event.target.getAttribute("data-auto-formatting") && event.target.getAttribute("data-auto-formatting") == "true") {
                            strUrlSF.put("doAutoFormatting", "true");
                        }
                        if (event.relatedTarget) {
                            pega.u.d.focusElement = event.relatedTarget;
                        }
                        else {
                            pega.u.d.focusElement = document.body;
                        }
                        postSuccess = readOnlyFormattingHandler;
                    }
                    if (src.hasAttribute('data-template')) {
                        strUrlSF.put("UITemplatingStatus", "Y");
                    }
                    if (window.bClientValidation) {
                        strUrlSF.put("PVClientVal", true);
                    }
                    if (isMultiSelectControl) {
                        queryString = pega.u.d.getQueryString(reloadElement);
                        pega.control.MultiSelect.removeHandlesAndMakeTokenDirty(true, reloadElement);
                    }
                    else if (isDateRangeControl) {
                        queryString.put(propEntryHandle, srcValue);
                        queryString.put(srcOtherElem.name, srcOtherElem.value);
                    }
                    else {
                        queryString.put(propEntryHandle, srcValue);
                    }
                    if (src.type === "hidden") {
                        if (!(origin === "controlEventReadOnly" && src.getAttribute('data-ctl') && JSON.parse(src.getAttribute('data-ctl'))[0] === "DatePicker")) {
                            postSuccess = emptyFunction;
                        }
                    }
                    if (src.value !== propValue || !updateDOM) {
                        postSuccess = emptyFunction;
                    }
                    callBack = {
                        success: postSuccess,
                        failure: emptyFunction,
                        argument: src
                    };
                    pega.u.d.asyncRequest('POST', strUrlSF, callBack, queryString);
                }
                if (currentContext) {
                    pega.ctxmgr.setContext(currentContext);
                }
            };
        })(postValue = c.postValue || (c.postValue = {}));
    })(c = pega.c || (pega.c = {}));
})(pega || (pega = {}));
;
//static-content-hash-trigger-GCC