// OnlyOnce names management class.
var OnlyOnceMgr = (function () {
    function OnlyOnceMgr() {
        this.oNewNames = null;
        this.oAllNames = {};
    }
    /*
    @public- Function to get merged set of OnlyOnce names for the document
    @param $none
    @return $object$
    */
    OnlyOnceMgr.prototype.getAllNamesObject = function () {
        return this.oAllNames;
    };
    /*
    @public- Function to get merged set of OnlyOnce and add to an existing SafeUrl
    @param $object$ Safe Url instance
    @return $object$ Safe Url instance
    */
    OnlyOnceMgr.prototype.addToSafeURL = function (oSafeUrl) {
        for (var i in this.oAllNames) {
            oSafeUrl.put("$O" + i, "");
        }
        return oSafeUrl;
    };
    /*
    @public- Function to get ready to POST set of OnlyOnce names
    @param $none
    @return $string$ formatted as "&$OFoo=&$OGoo="
    */
    OnlyOnceMgr.prototype.getAsPostString = function () {
        var sPost = "";
        for (var i in this.oAllNames) {
            sPost += ("&$O" + i + "=");
        }
        return sPost;
    };
    /*
    @public- Function to merge new OnlyOnce names with full set
    @param $object$ new names returned by the AJAX request.
    @return $void$
    */
    OnlyOnceMgr.prototype.mergeNewNames = function (oNewNames) {
        if (oNewNames && oNewNames != null) {
            this.oNewNames = oNewNames;
            for (var i = 0; i < oNewNames.length; i++) {
                var name_1 = oNewNames[i];
                this.oAllNames[name_1] = name_1;
            }
        }
    };
    return OnlyOnceMgr;
}());
//<script>
// Desktop alerts and other notifications manager scripts.
try {
	pega.ui = pega.namespace("pega.ui");
	pega.desktop = pega.namespace("pega.desktop");
//	pega.util.Event.addListener(window, "load", _initDesktopNotifyMgr, null, false);
} 
catch(e) {}

function _initDesktopNotifyMgr() {
	if(typeof(pega.ui.dnmgr) == "undefined") {

		pega.ui.dnmgr = new pega.ui.DesktopNotifyMgr();
		var iSysAl = window.setTimeout("pega.ui.dnmgr._initAlertNotify();", 10);
	}
}			
try {
pega.ui.DesktopNotifyMgr = function() {
	this._oSysAlDiv = null;
	this._oSysAlPan = null;
	this._iSysAlTotal = 0;
	this._iSysAlShowing = 0;
	this._iSysAlTmOut = 5000;
	this._iSysAlTimer = -1;
	this._bSysAlVis = false;
}
} 
catch(e) {}

try {
pega.ui.DesktopNotifyMgr.prototype = {

    _initAlertNotify: function() {
    try {
		this._oSysAlDiv = document.createElement("DIV");

		this._oSysAlDiv.innerHTML = 
			'<div id="SystemAlertsPopup">'
			+ '<div class="hd" style="font-size:4; background-color:#ced7ff;" align="center"><b>o o o o o o</b></div>'
			+ '<div style="font-size:4" class="container-close">X</div>'
			+ '<div class="bd" id="SystemAlertsBody" style="font-family:tacoma; font-size:12;"></div></div>';	
		document.body.appendChild(this._oSysAlDiv);

		this._oSysAlPan = new pega.widget.Panel("SystemAlertsPopup", 
			{ 
				xy:[600,0],
				visible:false,
				constraintoviewport:true,
				close:true,  
				draggable:true,
				width:"200",
				effect:[
					{effect:pega.widget.ContainerEffect.FADE,duration:1.2}
				] 
			} 
		);
//	<div class="hd" align="center" style="font-size:4">. . . . .<div style="font-size:9" class="container-close">x</div></div>
//		this._oSysAlPan.setHeader('<div class="hd" align="center" style="font-size:4">. . . . .<div style="font-size:4" class="container-close">x</div></div>');
//		this._oSysAlPan.setFooter('<div style="font-size:9">footer text</div>');
		this._oSysAlPan.render();

		pega.util.Event.addListener("SystemAlertsBody", "click", pega.ui.dnmgr._openAlertsWindow);
//		pega.util.Event.addListener("SystemAlertsBody", "click", pega.ui.DesktopNotifyMgr.prototype._openAlertsWindow);
   	} catch(e) {}
	},
    
    _openAlertsWindow: function() {
    try {
		var oSafeURL = new SafeURL();
		oSafeURL.put("pyStream", "MyAlerts");
		oSafeURL.put("initDisplay", true);
		var sURL = oSafeURL.toURL();
		var newWindow = window.open(sURL, "Alerts", "", true);
		this._hideSysAlPopup();
	} catch(e) {}
	},

    _showSysAlPopup: function(iAlertsNew) {
	try {
		if(iAlertsNew == 0)
			return;
		var iSysAl = window.setTimeout("pega.ui.dnmgr._doShowSysAlPopup(" + iAlertsNew + ");", 50);
//		var iSysAl = window.setTimeout("pega.ui.DesktopNotifyMgr.prototype._doShowSysAlPopup(" + iAlertsNew + ");", 50);
	} catch(e) {}
	},

    _doShowSysAlPopup: function(iAlertsNew) {
	try {		
		// Based on counters, show popup if not already showing.
		if(this._oSysAlPan.cfg.config.visible.value) {
			this._iSysAlShowing += iAlertsNew;
		} else {
			this._iSysAlShowing = iAlertsNew;
			this._oSysAlPan.show();	
		}
		
		// Set body of the system alerts DIV
		this._oSysAlPan.setBody('<table cellpadding="0" cellspacing="0"><tr><td>' 
			+ '<span class="alertPopupIcon"></span></td>'
			+ '<td><span class="bd" id="SystemAlertsBody" class="alertCounterPopupText"><b>' 
			+ this._iSysAlShowing + ' new system alert' + (this._iSysAlShowing > 1 ? 's' : '') 
			+ '</b></span></td></tr></table>');

		// Reset hide timer.
		if(this._iSysAlTimer > -1)
			window.clearTimeout(this._iSysAlTimer);	
		var iTmOut = this._iSysAlTmOut;
		
		// Test timeout override.
		try { iTmOut = PPTimeout.value; } catch(e) {}
		
		this._iSysAlTimer = window.setTimeout("pega.ui.dnmgr._hideSysAlPopup();", iTmOut);
//		this._iSysAlTimer = window.setTimeout("pega.ui.DesktopNotifyMgr.prototype._hideSysAlPopup();", iTmOut);

		// Update counters.
		this._iSysAlTotal += iAlertsNew;
		return false;
	} catch(e) {}
    },
    
    _hideSysAlPopup: function() {
		this._oSysAlPan.hide();
	}	
}
} 
catch(e) {}
//static-content-hash-trigger-GCC
pega.namespace("pega.ui");

/*
 loadInfo is an object with keys as below
 1. loadQueue : an instance of pega.tools.Queue ; if not passed, a new instance will be created
 2. queuePopulator : a function , if mentioned , will be invoked to populate the loadQueue ; mandatory if loadQueue is not passed

 */
pega.ui.LoadManager = function(loadInfo) {
	this.loadQ = "loadQueue" in loadInfo ? loadInfo.loadQueue : new pega.tools.Queue();
	this.adpBoundSections = new Array();
	this.adpRequestQ = new Array();
	this.lazyLoadedElements = new Array();
	this.lazyLoadedInfo = false;
	if (!"loadQueue" in loadInfo && !"queuePopulator" in loadInfo) {
		throw new Error("queuePopulator is mandatory in absence of loadQueue");
	}

	this.QPopulator = "queuePopulator" in loadInfo ? loadInfo.queuePopulator : null;

	this.isScreenLayoutPanelDeferLoaded = false;
	this.screenLayoutPanelsCount = 0;

};

(function() {

	var lm = pega.ui.LoadManager;

	lm.prototype = {

		/*
		 * populates the load Queue by invoking QPopulator and then starts processing the elements in the loadQ
		 */
		startLoading: function() {
			if (this.processBeforeLoad() === false) {
				return;
			}

			// flag to test tooling LoadManager active - ideally this call should be made iin LoadManager clients, before delay and threadbreak to here; see
			pega.ui.statetracking.setLoadMgrBusy();

			if (this.QPopulator) {
				this.QPopulator.call(null, this.loadQ, this.adpBoundSections);
				var lazyLoadedElements = this.lazyLoadedElements;
				var adpBoundSections = this.adpBoundSections;
				this.lazyLoadedInfo = false;
				var that = this;
				pega.ctx.dom.$('.lazyload-layout').each(function() {
					var isADP = this.getAttribute("data-isadp") == "true";
					var sectionDiv = pega.u.d.getSectionDiv(this);
					if (isADP && adpBoundSections) {
						var lazyInfo = "";//decodeURIComponent(this.getAttribute("data-adpparameterpage")).split(",");
						var tempSpan = document.createElement("span");
						tempSpan.innerHTML = this.getAttribute("data-adpparameterpage");
						lazyInfo = tempSpan.innerText.split(",");
						var lazyParams = null;

						/* the lazy load place holder div should have time stamp as its id i.e. they should be a number */
						/*
						if (lazyInfo[0] == "" || isNaN(lazyInfo[0]) || lazyInfo[0]in lazyElts) {
	
						} else {
							/* keep track of all the lazy portions to avoid duplicate entries in the queue 
							lazyElts[lazyInfo[0]] = 1;
						}*/

						lazyParams = that.getParams(tempSpan.innerText);

						//lazyParams = new SafeURL();
						lazyParams.put("pyUsingPage", this.getAttribute("data-pyusingpage"));
						lazyParams.put("pyDPScope", this.getAttribute("data-pydpscope"));
						lazyParams.put("UITemplatingStatus", "N");
						if (this.getAttribute("data-pydpparams"))
							lazyParams.put("pyDPParams", this.getAttribute("data-pydpparams"));
						this.setAttribute("id", this.getAttribute("data-lazyloaddivid"));
						adpBoundSections.push({
							reloadElement: sectionDiv,
							layoutId: this.getAttribute("data-pysectionid"),
							qParamsSafeURL: lazyParams,
							harnessId: pega.ctx.pzHarnessID,
							isAssociateRequestor: (this.getAttribute("data-isassociaterequestor") == "true")
						});
					} else {
						/* BUG-302028: Making use of loadQ instead of lazyloadedelements array */
						//lazyLoadedElements.push({section: sectionDiv, layoutDiv: this, type: 'layout'});
						that.loadQ.enqueue({section: sectionDiv, layoutDiv: this, type: 'layout', harnessId: pega.ctx.pzHarnessID});
					}

					$(this).removeClass('lazyload-layout');/* BUG-272751: Changed removeAttr("class") to removeClass() */
				});

				pega.ctx.dom.$('.lazyload-harness').each(function() {
					var sectionDiv = this;
					lazyLoadedElements.push({section: sectionDiv, layoutDiv: this, type: 'harness'});
					$(this).removeClass('lazyload-harness');/* BUG-272751: Changed removeAttr("class") to removeClass() */
					var bIsScreenlayout = $(sectionDiv).attr('bIsScreenlayout');
					if (bIsScreenlayout == "true") {
						that.isScreenLayoutPanelDeferLoaded = true;
						that.screenLayoutPanelsCount++;
						//console.log('loadmanager: SLRender: incrementing count - Current count:' + that.screenLayoutPanelsCount);
					}
				});

			}

			this.processADPQ();
			this.processFirstInQ();
			this.processLazyLoadedElements();
			this.processFlowActionLazyLoad();
			pega.ui.statetracking.setLoadMgrDone();
		},

		getParams: function(paramStr) {
			var lazyInfo = paramStr.split(",");
			var lazyInfoLen = lazyInfo.length;
			var lazyParams = new SafeURL();
			var lazyParam = [];
			var isADP = false;
			for (var j = 0; j < lazyInfoLen; j++) {
				if (lazyInfo[j].indexOf("=") > 0) {
					/* name=value pair found */
					lazyParam = lazyInfo[j].split("=");
					if (lazyParam.length == 2) {
						/* name and value both found */
						if ((!isADP && lazyParam[0] == "isADP" && lazyParam[1] == "1") || !lazyParam[1]) {
							isADP = true;
							continue;
							/* This field not required in request parameters */
						}
						lazyParams.put(lazyParam[0], decodeURIComponent(lazyParam[1]));
					}
				}
			}
			return lazyParams;
		},

		processADPQ: function() {
			var q = this.adpBoundSections;
			if (q.length > 0) {
				var requestSent = this.ADPload(q.pop());
				if (!requestSent) {
					this.processADPQ();
				}
			} else {
				if (this.adpRequestQ.length > 0) {
					pega.u.NonBlockingAjax.addRequests(this.adpRequestQ);

					/* Reset adp queue after add to service queue */
					this.adpRequestQ = new Array();
					/*
					 var jsonstr = JSON.stringify(this.adpRequestQ);
					 var jsonDiv = document.createElement('DIV');
					 jsonDiv.innerHTML = jsonstr;
					 var insNode =  document.body.firstChild;
					 if (insNode != null) document.body.insertBefore(jsonDiv,insNode);
					 */
				}
			}
		},

		handleADPResponse: function(respObj) {
		},

		ADPload: function(reloadInfo) {
			var CT_DIV_STRINGS = ["id=\"CT\"", "id='CT'", "data-refresh", "data-required", "layout-active-when"];
			if (!("reloadElement" in reloadInfo && "layoutId" in reloadInfo)) {
				return false;
			}
			var reloadElement = reloadInfo.reloadElement;
			if (typeof reloadElement === "string") {
				reloadElement = pega.ctx.dom.getElementById(reloadElement);
			}
			if (!(reloadElement && typeof reloadElement === "object")) {
				return false;
			}
			/*Epic-7677*/
			var safeParamURL = reloadInfo.qParamsSafeURL;

			var domChange = "no";
			if ("D_LongPoll" == safeParamURL.hashtable["pyUsingPage"]) {
				domChange = "yes";
			}

			var isAssociateRequestor = reloadInfo.isAssociateRequestor;
			if (reloadInfo.qParamsSafeURL.hashtable["pyAssociateRequestor"]) {
				isAssociateRequestor = (reloadInfo.qParamsSafeURL.hashtable["pyAssociateRequestor"] == "true");
				delete reloadInfo.qParamsSafeURL.hashtable.pyAssociateRequestor;
			}

			/* invoke pega.u.d.reLoad API where our success, failure and loadDOMObject callbacks will be registered */
			//BUG-128568 : Added isADP:True for not showing dirty warning on ADP.
			var reloadSectionRequestObj = pega.u.d.reload({
				reloadElement: reloadElement,
				bSectionSubmit: false,
				strReloadType: "Queued",
				queueParams: {
					domElement: reloadElement,
					domAction: "replace",
					domChange: domChange,
					adpReload: "ADPLoad",
					beforeDomActionContext: this,
					beforeDomAction: this.loadQueuedContent,
					layoutId: reloadInfo.layoutId,
					qParamsSafeURL: reloadInfo.qParamsSafeURL
				},
				isADP: "true"
			});

			if (reloadSectionRequestObj === "unsafeToReload") {
				/* reload of the lazy content failed as the container section is getting reloaded.
				 * put the info in the queue to process again.
				 * our startLoading is registered as AJAX onLoad function which will resume
				 * queue processing after the refresh of container section is over.
				 */
				this.loadQ.enqueue(reloadInfo);
			} else if (reloadSectionRequestObj) {
				var callback = reloadSectionRequestObj.callback;
				var originalCallback = callback;
				if (!callback) {
					callback = {};
				}
				//perform scope handling
				var calleeScope;
				if (callback.scope) {
					calleeScope = callback.scope;
				} else {
					calleeScope = this;
				}
				/* store value of original callback. */
				var originalSuccessCallback = callback.success;

				/* over ride the 'success' case callback */
				callback.success = function(args) {
					pega.ui.statetracking.setLoadMgrBusy("callback.success");

					/* process/parse response object and call original call back success */
					var respObj = {}
					var resp = arguments[7];
					respObj.format = resp ? resp.format : "";
					/* BUG-137747: Removed xss decoding to avoid decoding the escaped characters at cell level */
					respObj.responseText = resp ? resp.response : "";

					if (pega.ui.ExpressionEvaluator && !pega.ui.ExpressionEvaluator.getNTExpressionStatus() && pega.isUITemplatized && respObj.responseText) {
						//Checking for non template CT divs (expressions) and setting boolean
						for (var i = 0; i < CT_DIV_STRINGS.length; i++) {
							if (respObj.responseText.indexOf(CT_DIV_STRINGS[i]) != -1) {
								pega.ui.ExpressionEvaluator.setNTExpressionStatus(true)
								break;
							}

						}
					}

					respObj.successful = arguments[8];
					respObj.argument = arguments;
					var trackersMap = pega.ui.ChangeTrackerMap.getTrackers();
					for (var threadName in trackersMap) {
						var currentTracker = trackersMap[threadName];
						currentTracker.parseForChangeTrackerDiv(respObj.responseText, false);
						/* handle cross-threadChanges for other active documents*/
						currentTracker.handleXThreadChanges();

						// 05/30/2013 GUJAS1 Invoke DC CT callback if provided
						pega.u.d.notifyDCForCTChanges(currentTracker);

					}

					var puma = pega.namespace("pega.ui.maps.addressmap");
					if (puma && typeof puma.notifyMapsOnCT == "function") {
						var crnttrackerAM = pega.ui.ChangeTrackerMap.getTracker();
						puma.notifyMapsOnCT(crnttrackerAM);
					}
					var putm = pega.namespace("pega.ui.trackingmaps");
					if (putm && typeof putm.notifyMapsOnCT == "function") {
						var crnttrackerTM = pega.ui.ChangeTrackerMap.getTracker();
						putm.notifyMapsOnCT(crnttrackerTM);
					}

					pega.u.d.parseLazyLoadSpan(respObj.responseText);

					pega.u.d.initRenderingEngine(respObj, function(replaceResponseText, tempDiv) {

						/* Invoking resetClientCacheTracker() will reset the context to the original thread */
						pega.ui.ClientCache.reset();

						if (replaceResponseText) {/*RE found atleast one template in the stream, therefore in its own callback, databinder will already have been invoked in this case*/
							respObj.responseText = tempDiv.innerHTML;
						}
						else {/*RE will return right away without processing if it doesn't find any template markers, thus databinder will never have been invoked in this case, therefore invoke it ourselves*/
							var docFragm = document.createDocumentFragment();
							docFragm.appendChild($("<div></div>").html(respObj.responseText).get(0));
							pega.ui.template.DataBinder.bindData(docFragm);
							tempDiv = docFragm.firstChild;
							respObj.responseText = tempDiv.innerHTML;
						}
						if (respObj.argument && respObj.argument.length > 7) {
							var reloadElem = respObj.argument[0];
							var adpArgs = respObj.argument[6];
							if (adpArgs.adpReload == "ADPLoad") {
								var layoutToBeLoaded = pega.ctx.dom.$(reloadElem).find("div[data-pysectionid='" + adpArgs.layoutId + "']");
								if (layoutToBeLoaded && $(layoutToBeLoaded).hasClass("lazyload-layout")) {
									respObj.argument[0] = layoutToBeLoaded[0];
									//respObj.argument[6].domElement = layoutToBeLoaded[0];
								}
							}
						}
						/* calling original "success" case callback. */
						if (typeof originalSuccessCallback == "function") {
							originalSuccessCallback.call(calleeScope, respObj);
						}

					});

					pega.ui.statetracking.setLoadMgrDone();
				}

				/* Data Preprocessor to update OONames */
				var dataPreProcessor = function(postData) {
					if (pega.ui.onlyOnce) {
						var onlyOnceTags = pega.ui.onlyOnce.getAsPostString();
						var onlyOnceTags = SafeURL_createFromURL(onlyOnceTags);

						var ooNamesList = new Array();
						for (var prop in onlyOnceTags.hashtable) {
							if (prop == "") {
								continue;
							}
							ooNamesList.push(prop);
						}

						postData.activity["OONames"] = ooNamesList;
					}
				}

				var updateParameters = function(requestObj, adpParamsString) {
					var adpParamsJson = JSON.parse(adpParamsString);
					for (var paramProp in adpParamsJson) {
						adpParamsJson[paramProp] = pega.c.eventParser.replaceTokensWrapper(adpParamsJson[paramProp], "", "", false);
					}
					requestObj.data.adpParameters = adpParamsJson;
				}

				var safeUrl = reloadSectionRequestObj.strURLSF;
				var postData = reloadSectionRequestObj.queryString;

				var hID = pega.ctx.pzHarnessID;
				if (hID) {
					safeUrl.put("pzHarnessID", hID);
				}

				/*var headerButtonIndicator = pega.util.Dom.getElementsBy(function(ele) {
				  return ele.id == 'HeaderButtonSectionIndicator';
				}, 'input');*/
				var headerButtonIndicator = pega.ctx.dom.querySelector("input#HeaderButtonSectionIndicator");
				if (headerButtonIndicator) {
					safeUrl.put('HeaderButtonSectionName', headerButtonIndicator.value);
				}

				if (postData && typeof (postData) == "string") {
					postData = SafeURL_createFromURL(postData);
				}
				var requestObj = {}
				requestObj.serviceName = "adp";
				requestObj.mode = "initiate";
				requestObj.data = {};
				requestObj.data.threadId = pega.u.d.getThreadName();
				requestObj.data.isAssociateRequestor = isAssociateRequestor;
				requestObj.data.pxReqURI = pega.ctx.pxReqURI;
				requestObj.data.adp = "";
				requestObj.data.adpScope = "";
				requestObj.data.adpParameters = {};
				requestObj.data.activity = {};
				requestObj.DataPreProcessor = {functions: [{funcRef: dataPreProcessor, args: [], scope: this}]};
				requestObj.Callbacks = {functions: [{funcRef: callback.success, args: callback.argument, scope: this}]};
				for (var prop in safeUrl.hashtable) {
					/* BUG-90871,Bug-90440,BUG-91901: Entry handles are passed in JSON, due to which Json parser is throwing exception at server. Added "prop.indexOf("$") == 0" in below if condition */

					if (prop == "" || prop.indexOf("$") == 0) {
						continue;
					}
					requestObj.data.activity[prop] = safeUrl.hashtable[prop];
				}
				for (var prop in postData.hashtable) {
					if (prop == "") {
						continue;
					}
					if (prop == "pyUsingPage") {
						requestObj.data.adp = postData.hashtable[prop];
					}
					if (prop == "pyDPScope") {
						requestObj.data.adpScope = postData.hashtable[prop];
					}
					if (prop == "pyDPParams") {
						var adpParamsString = postData.hashtable[prop].replace(/\;/g, ',').replace(/\'/g, '"');
						requestObj.DataPreProcessor.functions.push({funcRef: updateParameters, args: [requestObj, adpParamsString], scope: this});
						var adpParamsJson = JSON.parse(adpParamsString);
						for (var paramProp in adpParamsJson) {
							adpParamsJson[paramProp] = pega.c.eventParser.replaceTokensWrapper(adpParamsJson[paramProp], "", "", false);
						}
						requestObj.data.adpParameters = adpParamsJson;
					}
					else if (prop == "OONames") {
						requestObj.data.activity[prop] = [].concat(postData.hashtable[prop]);
					}
					else {
						requestObj.data.activity[prop] = postData.hashtable[prop];
					}
				}
				this.adpRequestQ.push(requestObj);
				return false;
			}
			return true;
		},
		processLazyLoadedElements: function() {
			if (this.lazyLoadedElements.length > 0) {
				//US-79389 changing from stack to queue to ensure that sections get processed in the same order they are packaged
				var dl = this.lazyLoadedElements.shift();
				this.loadLazyLoadedElements(dl.section, dl.layoutDiv, dl.type, null, dl.harnessId);
			}
		},

		loadLazyLoadedElements: function(reloadElement, bodyElement, type, bUsesLoadQ, harnessId) {
			var currentHarnessId = pega.ctx.pzHarnessID;
			var resetHarnessContext = false;
			if (harnessId != currentHarnessId) {
				pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(harnessId));
				resetHarnessContext = true;
			}
			var strUrlSF;
			//var harCtxMgr = pega.ui.HarnessContextMgr;
			strUrlSF = SafeURL_createFromURL(pega.ctx.url);
			var readOnly = pega.u.d.getReadOnlyValue("", bodyElement);
			strUrlSF.put("ReadOnly", readOnly);
			if (type == "harness") {
				strUrlSF.put("pyActivity", "Rule-HTML-Harness.GetContainerHTML");
				strUrlSF.put("ClassName", pega.ctx.strHarnessClass);
				strUrlSF.put("StreamName", pega.ctx.strHarnessPurpose);
				strUrlSF.put("PrimaryPage", pega.ctx.strPrimaryPage);
				if (pega.ctx.dom.$(bodyElement).parents(".screen-layout-region-main-middle").length > 0 && !pega.u.d.centerPanelHarness) {
					pega.u.d.centerPanelHarness = bodyElement.getAttribute("data-localstoreid");
				}
			} else {
				strUrlSF.put("pyActivity", "ReloadSection");
        var streamName = reloadElement.getAttribute("node_name")?reloadElement.getAttribute("node_name"): reloadElement.getAttribute("data-node-id");
				strUrlSF.put("StreamName", streamName);
				strUrlSF.put("StreamClass", reloadElement.getAttribute("objclass"));
				strUrlSF.put("ReadOnly", readOnly);
				// send the harness name and harness class, used by personalized template grid - start
				var strPHarnessClass = pega.ctx.strHarnessClass || "";
				var strPHarnessPurpose = pega.ctx.strHarnessPurpose || "";
				strUrlSF.put("strPHarnessClass", strPHarnessClass);
				strUrlSF.put("strPHarnessPurpose", strPHarnessPurpose);
				// send the harness name and harness class, used by personalized template grid - end
				var baseRef = pega.u.d.getBaseRef(reloadElement);
				strUrlSF.put("BaseReference", baseRef);
				if (typeof (pega.ctx.bClientValidation) != 'undefined') {
					strUrlSF.put("bClientValidation", pega.ctx.bClientValidation);
				}
				/*BUG-514027 : Fixed NullPointerException in safeURL.put in case of setting undefined values */
				strUrlSF.put("FieldError", pega.ctx.fieldErrorType || "");
				strUrlSF.put("FormError", pega.ctx.formErrorType || "");
				strUrlSF.put("pyCustomError", pega.ctx.pyCustomError || "");
				strUrlSF.put("pzKeepPageMessages", "true");
			}
			strUrlSF.put("pyCallStreamMethod", $(bodyElement).attr('data-deferinvoke'));
			strUrlSF.put("pyLayoutMethodName", $(bodyElement).attr('data-deferinvoke'));
			var bIsScreenLayout = $(bodyElement).attr('bIsScreenlayout');
			var sectionsDetails = $(bodyElement).attr('sectionsDetails');
			var strIncludedScripts = $(bodyElement).attr('strIncludedScripts');
			if (bIsScreenLayout && bIsScreenLayout != "")
				strUrlSF.put("bIsScreenLayout", bIsScreenLayout);
			if (sectionsDetails && sectionsDetails != "")
				strUrlSF.put("sectionsDetails", sectionsDetails);
			if (strIncludedScripts && strIncludedScripts != "")
				strUrlSF.put("strIncludedScripts", strIncludedScripts);

			var lazyLoadElm = pega.ctx.dom.$(bodyElement)[0];
			//var tempPathStr = pega.u.d.getTemplatePath(lazyLoadElm.children("[data-rel-path]:first"));

			/*      if(lazyLoadElm && $(lazyLoadElm).find("[data-template]:first")[0]){
					if(lazyLoadElm.getAttribute('data-deferinvoke').indexOf("pzLayoutContainer_") == 0){
						tempPathStr = pega.u.d.getTemplatePath(lazyLoadElm);
					}else{
						tempPathStr = pega.u.d.getTemplatePath($(lazyLoadElm).find("[data-rel-path]:first")[0]);
					}
					relPath = tempPathStr
				  }*/
			/*if (lazyLoadElm && lazyLoadElm.children[0]) {
			  relPath = lazyLoadElm.children[0].getAttribute("data-rel-path");
			}*/
			//var parentRoot = lazyLoadElm;

			/* while (parentRoot && parentRoot != reloadElement && pega.util.Dom.isAncestor(reloadElement, parentRoot)) {
			   tempPathStr += parentRoot.getAttribute("data-rel-path") ? parentRoot.getAttribute("data-rel-path") : "";
			   parentRoot = pega.u.d.findParentWithAtrribute(parentRoot, "data-rel-path");
			 }*/

			var childIndex = "";
			var templatingStatus = "N";
			if (lazyLoadElm && lazyLoadElm.children[0]) {
				templatingStatus = lazyLoadElm.children[0].hasAttribute("data-template") ? "Y" : "N";
			}
			strUrlSF.put("UITemplatingStatus", templatingStatus);
			pega.u.d.setBusyIndicator(bodyElement);
			var that = this;
			var callbackArgs = new Array(bodyElement);

			var postDataParams = null;
			if (bodyElement && bodyElement.hasAttribute("data-parampage")) {
				postDataParams = new SafeURL();
				postDataParams = this.getParams(bodyElement.getAttribute("data-parampage"));
				/* BUG-433400: Explicilty remove PreDataTransform as it is not a valid defer load config */
				postDataParams.remove("PreDataTransform");
				if (postDataParams.get("PreActivitiesList")) {/* BUG-317335: xml(PreActivitiesList param value) is encoded so html-decode it */
					var tempSpan = document.createElement("span");
					tempSpan.innerHTML = postDataParams.get("PreActivitiesList");
					postDataParams.put("PreActivitiesList", tempSpan.innerText);
					tempSpan = null;
				}
			}

			var viewCallback = {
				success: function(responseObj) {
					var newStream = responseObj.responseText;
					if (newStream.indexOf("data-propref") != -1) {
						pega.clientTools.putParamValue("bRDLShowDetails", false);
					}
					var reloadElement = responseObj.argument[0];
					if (newStream.indexOf("<html>") >= 0 ||
						newStream.indexOf("PegaServErr") > 0 ||
						pega.u.d.checkExceptions(newStream, reloadElement)) {
						pega.u.d.inCall = false;
						if (pega.u.d.changeInEventsArray) {
							pega.u.d.changeInEventsArray.fire();
						}
						pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
						return;
					}

					/* Set the stream to the innerHTML of the reload element*/
					var documentFragment = document.createDocumentFragment();
					var newElement = document.createElement("DIV");
					newElement.style.display = "none";
					documentFragment.appendChild(newElement);
					newElement.innerHTML = newStream;
					var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", newElement);
					if (onlyOnceEle && onlyOnceEle[0]) {
						pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
						onlyOnceEle[0].parentNode.removeChild(onlyOnceEle[0]);
					}
					if (pega.c && pega.c.t)
						pega.c.t.processControlTemplates(newElement);
					/******************/
					var errorTable = newElement.getElementsByClassName("error-table");
					if (errorTable.length > 0) {
						var newElementCopy = newElement.cloneNode(true);
						errorTable[0].parentNode.removeChild(errorTable[0]);
						newStream = newElement.innerHTML;
					}
					/******************/
					//pega.u.d.processOnloads(newElement);/* BUG-297665: Unnecessary invocation. processOnloads should be invoked after writing response to DOM. Due to this multiple defer load requests are fired, so commented. */
					/* BUG-398701: Handling of pyCustomErrorDiv will be done by handleFormErrors. Removing it from the lazyloaded layout's response that is loadded into the DOM. */
					var pyCustomErrorDiv = newElement.querySelector("div#pyCustomError");
					if (pyCustomErrorDiv && pyCustomErrorDiv.parentElement) {
						/* BUG-405304: The pyCustomErrorDiv might not be the direct child of the response DIV */
						pyCustomErrorDiv.parentElement.removeChild(pyCustomErrorDiv);
						newStream = newElement.innerHTML;
					}
					newElement.innerHTML = null;
					documentFragment.removeChild(newElement);
					documentFragment = null;

					/*For lazyLoaded elements in HC, we wrap a div with localstoreid and other meta data required for lazyload. Hence, css for direct children were not applied because of the extra div. Hence, passing parentNode as the div to be replaced. Bug-174203*/
					if ($(reloadElement).is("[data-localstoreid]")) {
						if ($(reloadElement.parentNode).children().length > 1) {
							$.each($(reloadElement.parentNode).children().not(reloadElement), function(index, data) {
								newStream = data.outerHTML + newStream;
							});
						}
						reloadElement = reloadElement.parentNode;
					}


					var paramsObj = {
						domObj: reloadElement,
						newHTML: newStream,
						//US-79389 moved processLazyLoadedElements call to callback to ensure that elements processing is complete and added to dom before sending next process request.
						callback: function(element) {
							pega.u.d.loadHTMLEleCallback(element);
							if (bIsScreenLayout == "true") {
								//console.log('loadmanager: SLRender- decrementing count. Current count:' + that.screenLayoutPanelsCount);
								that.screenLayoutPanelsCount--;
								if (pega && pega.offline && that.isScreenLayoutPanelDeferLoaded && that.screenLayoutPanelsCount <= 0) {
									//console.log('loadmanager: SLRender- Setting flag in HCLoadmanager. Current count:' + that.screenLayoutPanelsCount);
									pega.u.d.HCLoadManager.setScreenLayoutLoaded();
									if (pega.u.d.WebViewManager) {
										pega.u.d.WebViewManager.setScreenLayoutLoaded();
									}
									that.isScreenLayoutPanelDeferLoaded = false;
								}
							}
							if (bUsesLoadQ && bUsesLoadQ === true) {
								that.afterLoad();
							} else {
								that.processLazyLoadedElements();
							}
						}
					};
					pega.u.d.handleDOMLoad(paramsObj);
					/***********************/
					/* BUG-535209: removing the "BUG-361108's change" if condition as handleFormErrors has to be executed, BUG-361108: check if newElementCop y is empty before calling handleFormErrors */
          if (newElementCopy) {
					  pega.u.d.handleFormErrors(newElementCopy);
          }
					/**********************/
					if (pega && pega.offline && pega.offline.Indicator) {
						pega.offline.Indicator.refreshNetworkStatusIndicator();
						pega.offline.Indicator.refreshSynchronizationStatusIndicator();
					}
					pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
				},
				failure: function(oResponse) {
					//handle an unsuccessful request
					pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
					pega.clientTools.putParamValue("bRDLShowDetails", false);
					//do Nothing
				},
				argument: callbackArgs
			}
			var parentRDL = null;
			if (reloadElement)
				parentRDL = pega.ctx.dom.closest(reloadElement, "[data-repeat-source]");
			if (parentRDL && parentRDL.hasAttribute("data-details-flowaction")) {
				pega.clientTools.putParamValue("bRDLShowDetails", true);
			}
			if (type == "harness") {
				var OSCOHandler = {
					offline: function(url, postData, SPCallback) {
						var lazyloadid = $(bodyElement).attr('data-localStoreId');
						// bug-228139; use clientstorehelper that uses rule cache
						pega.offline.clientstorehelper.getSectionStream(null, lazyloadid, SPCallback.success, SPCallback.failure);
					}
				};
				var serverProxy = pega.u.d.ServerProxy;
				if (serverProxy.isHybridClient() && !serverProxy.isDestinationLocal()) {
					serverProxy.setDestination(serverProxy.DESTINATION.LOCAL);
				}
				serverProxy.doAction(strUrlSF, null, OSCOHandler, viewCallback);
			} else {
				var request = pega.u.d.asyncRequest('POST', strUrlSF, viewCallback, postDataParams);
			}


			if (resetHarnessContext) {
				/*BUG-514207 : resetting it to currentHarnessId instead of harnessId*/
				pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(currentHarnessId));
			}
		},

		processFirstInQ: function() {
			var q = this.loadQ;
			if (!q.isEmpty() && !q.isDequeueLocked()) {
				var requestSent = this.load(q.dequeueAndLock());
				if (!requestSent) {
					this.afterLoad();
					return;
				}
			} else {
				/*alert("Nothing to process");*/
			}
		},

		/*
		 * load the container section of the reloadElement bringing back the layout/ section identified by layoutId
		 * reloadInfo object needs -
		 * 	1. reloadElement : the DOM element or id of the DOM element to be loaded
		 *	2. layoutId : the identifier of layout/ section dropped in a section
		 */

		load: function(reloadInfo) {
			/* BUG-302028: Route all the (non ADP)deferload requests through the loadQ */
			var directMethodInvokation = false;
			var layoutInfo;
			if (reloadInfo.hasOwnProperty("layoutDiv")) {
				var lazyParams;
				if (reloadInfo.layoutDiv.hasAttribute("data-parampage")) {
					lazyParams = this.getParams(reloadInfo.layoutDiv.getAttribute("data-parampage"));
				}
				if (!lazyParams) {
					lazyParams = new SafeURL();
				}
				if (reloadInfo.layoutDiv.hasAttribute("data-deferinvoke")) {
					directMethodInvokation = true;
				} else {
					lazyParams.put("UITemplatingStatus", "N");
					reloadInfo["reloadElement"] = reloadInfo.layoutDiv;
					reloadInfo["layoutId"] = reloadInfo.layoutDiv.getAttribute("data-layoutid");
					reloadInfo["qParamsSafeURL"] = lazyParams;
					reloadInfo.layoutDiv.setAttribute("id", reloadInfo.layoutDiv.getAttribute("data-lazyloaddivid"));
					delete reloadInfo.layoutDiv;
					delete reloadInfo.section;
					delete reloadInfo.type;
				}
			}
			if (directMethodInvokation) {
        if(!document.body.contains(reloadInfo.layoutDiv) || !document.body.contains(reloadInfo.section)) {
          return false;
        }
				this.loadLazyLoadedElements(reloadInfo.section, reloadInfo.layoutDiv, reloadInfo.type, true, reloadInfo.harnessId);
			} else {
				if (!("reloadElement" in reloadInfo && "layoutId" in reloadInfo)) {
					return false;
				}
				var reloadElement = reloadInfo.reloadElement;
				if (typeof reloadElement === "string") {
					reloadElement = pega.ctx.dom.getElementById(reloadElement);
				}
				/* BUG-307398: Additionally check if the reloadelement is present in the DOM */
				if (!(reloadElement && typeof reloadElement === "object" && document.body.contains(reloadElement))) {
					return false;
				}
				/*Epic-7677*/
				var safeParamURL1 = reloadInfo.qParamsSafeURL;
				var domChange = "no";
				if ("D_LongPoll" == safeParamURL1.hashtable["pyUsingPage"]) {
					domChange = "yes";
				}
				var currentHarnessId = pega.ctx.pzHarnessID;
				var resetHarnessContext = false;
				if (reloadInfo.harnessId != currentHarnessId) {
					pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(reloadInfo.harnessId));
					resetHarnessContext = true;
				}
				/* invoke pega.u.d.reLoad API where our success, failure and loadDOMObject callbacks will be registered */
				var reloadStatus = pega.u.d.reload({
					reloadElement: reloadElement,
					bSectionSubmit: false,
					strReloadType: "Queued",
					queueParams: {
						domElement: reloadElement,
						domAction: "replace",
						domChange: domChange,
						beforeDomActionContext: this,
						beforeDomAction: this.loadQueuedContent,
						layoutId: reloadInfo.layoutId,
						qParamsSafeURL: reloadInfo.qParamsSafeURL
					}
				});
				if (resetHarnessContext) {
					pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(currentHarnessId));
				}
				if (reloadStatus === "unsafeToReload") {
					/* reload of the lazy content failed as the container section is getting reloaded.
					 * put the info back in the queue to process again.
					 * our startLoading is registered as AJAX onLoad function which will resume
					 * queue processing after the refresh of container section is over.
					 */
					this.loadQ.putInFront(reloadInfo);
					this.loadQ.unlockDequeue();
				}
				pega.u.d.clearReloadedStatus();
			}
			return true;
		},

		loadQueuedContent: function(responseObj) {
			if (!responseObj) {
				return false;
			}

			// add to doc count for test tooling
			pega.ui.statetracking.setLoadMgrBusy();

			var lazyContent = this.getLazyContent(responseObj.responseText);
			if (responseObj.successful && (responseObj.successful == "false" || responseObj.successful == false)) {
				if (lazyContent == null || lazyContent == "") {
					lazyContent = responseObj.responseText;
				}
			}

			var reloadElement = responseObj.argument[0];
			var QParams = responseObj.argument[6];
			/*BUG-494060 : Properly checking for domelement in dom */
			var isPartOfDom = pega.ctx.dom.$(QParams.domElement);
			if (QParams.adpReload == "ADPLoad") {
				var reloadDivForADP = pega.ctx.dom.$(QParams.domElement).find("div[data-pysectionid='" + QParams.layoutId + "']")[0];
				if (reloadDivForADP)
					QParams.domElement = reloadDivForADP;
			}
			if (isPartOfDom) {
				this.parseContentAndLoadDOM(reloadElement, lazyContent, QParams);
			} else {
				this.afterLoad();
			}

			// add to doc count for test tooling
			pega.ui.statetracking.setLoadMgrDone();

			return false;
		},

		getLazyContent: function(newStream) {

			if (!newStream) {
				return null;
			}
			var tempDiv = document.createElement("div");
			tempDiv.innerHTML = "&nbsp;" + newStream;
			var lazyDiv = pega.util.Dom.getElementsById("lazyContent", tempDiv, "DIV");
			if (lazyDiv && lazyDiv.length > 0) {
				lazyDiv = lazyDiv[0];
			}
			else {
				return null;
			}
			var lazyContent = lazyDiv.innerHTML;

			tempDiv.innerHTML = "";
			tempDiv = null;
			lazyDiv.innerHTML = "";
			lazyDiv = null;
			return lazyContent;
		},

		parseContentAndLoadDOM: function(reloadElement, lazyContent, QParams) {
			var Dom = pega.util.Dom;
			var _this = this;
			var tempDiv = document.createElement("div");
			var processAfterLoad = function(relEle) {
				pega.u.d.loadHTMLEleCallback(relEle);
				_this.afterLoad();
			};

			if (!lazyContent) {
				QParams.domAction = "remove";
				pega.u.d.loadDOMObject(reloadElement, tempDiv.innerHTML, processAfterLoad, QParams);
				return;
			}
			tempDiv.innerHTML = "&nbsp;" + lazyContent;
			var childNodes = null;
			var ldoCallBack = null;
			while ((childNodes = Dom.getChildren(tempDiv)).length > 0) {

				if (childNodes.length == 1) {
					/*Epic-7677*/
					if (QParams.domChange != "yes") {
						QParams.domAction = "replace";
					} else {
						QParams.domAction = null;
					}
					ldoCallBack = processAfterLoad;
				} else {
					QParams.domAction = "insert";
				}
				pega.u.d.loadDOMObject(reloadElement, tempDiv.innerHTML, ldoCallBack, QParams);
				tempDiv.removeChild(childNodes[0]);
			}
		},

		afterLoad: function() {
			var _this = this;
			setTimeout(function() {
				_this.loadQ.unlockDequeue();
				_this.processFirstInQ();
			}, 10
			);
		},

		beforeLoad: [],

		attachBeforeLoad: function(beforeLoadFunc) {
			for (var i = 0; i < this.beforeLoad.length; i++) {
				if (this.beforeLoad[i] == beforeLoadFunc) {
					return;
				}
			}

			this.beforeLoad.push(beforeLoadFunc);
		},

		detachBeforeLoad: function(beforeLoadFunc) {
			for (var i = 0; i < this.beforeLoad.length; i++) {
				if (this.beforeLoad[i] == beforeLoadFunc) {
					this.beforeLoad.splice(i, 1);
					return;
				}
			}
		},

		processBeforeLoad: function() {
			var returnVal = true;
			for (var i = 0; i < this.beforeLoad.length; i++) {
				var beforeLoadFunc = this.beforeLoad[i];
				try {
					if (beforeLoadFunc() === false) {
						returnVal = false;
					}
				} catch (excep) {
				}
			}
			return returnVal;
		},

		processFlowActionLazyLoad: function() {
			var lazyLoad = function(sectionMethodname, preAutomationDiv, response) {
				var baseRef = pega.u.d.getBaseRef(preAutomationDiv);
				var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
				strUrlSF.put("pyActivity", "ReloadSection");
				strUrlSF.put("StreamList", sectionMethodname);
				strUrlSF.put("StreamClass", "Rule-HTML-Section");
				strUrlSF.put("BaseReference", baseRef);
				strUrlSF.put("pzKeepPageMessages", "true");
				if (typeof (pega.ctx.bClientValidation) != 'undefined') {
					strUrlSF.put("bClientValidation", pega.ctx.bClientValidation);
				}
				pega.u.d.setBusyIndicator(preAutomationDiv);
				var callbackArgs = new Array(preAutomationDiv);
				var callback = {
					success: function(o) {
						if (pega.ui.roboticAutomation) {
							pega.ui.roboticAutomation.showHideBusyIndicator(null, "hide");
						}
						preAutomationDiv.removeAttribute("id");
						preAutomationDiv.removeAttribute("data-section-methodname");
						preAutomationDiv.removeAttribute("data-automation-meta");
						preAutomationDiv.removeAttribute("data-lazyloadInvoked");
						var targetDiv = o.argument[0];
						var newDiv = document.createElement("div");
						newDiv.innerHTML = o.responseText;
						var returnedDivs = pega.util.Dom.getElementsById("SECGRP", newDiv, "DIV");
						if (returnedDivs != null && returnedDivs.length >= 1) {
							var propDivs = pega.util.Dom.getElementsById("RULE_KEY", returnedDivs[0], "DIV");
							if (propDivs) {
								pega.u.d.loadDOMObject(targetDiv, returnedDivs[0].innerHTML);
							}
						}
					},
					failure: pega.u.d.handleFailure,
					scope: pega.u.d,
					argument: callbackArgs
				};
				var postData = "";
				try {
					if (response) {
						//var responseData = JSON.parse(response.responseText);
						var autoPrimaryPage = preAutomationDiv.getAttribute("data-automation-primaryPage");
						var _data = response;
						var postData = new SafeURL();
						var responseJson = JSON.stringify(response);
						if (responseJson.length > 2) {
							//var responseJson = JSON.stringify(response);
							var preActivityData = "<pagedata><preActivities REPEATINGTYPE=\"PageList\">" +
								"<rowdata REPEATINGINDEX=\"1\"><activity>pzUpdateClipboardWithAutomationValues</activity>" +
								"<params REPEATINGTYPE=\"PageList\">" +
								"<rowdata REPEATINGINDEX=\"1\"><name></name><value>undefined</value></rowdata>" +
								"<rowdata REPEATINGINDEX=\"2\"><name>clipboardPageName</name><value>" + autoPrimaryPage + "</value></rowdata>" +
								"<rowdata REPEATINGINDEX=\"3\"><name>jsonString</name><value>" + responseJson + "</value></rowdata>" +
								"</params>" +
								"</rowdata>" +
								"</preActivities></pagedata>";
							postData.put("PreActivitiesList", preActivityData);
						}
						for (var key in _data) {
							if (_data[key] != null && _data[key] != undefined) {
								postData.put(pega.u.property.toHandle(autoPrimaryPage + "." + key), _data[key]);
							}
						}
					}
				} catch (e) {}
				pega.u.d.asyncRequest('POST', strUrlSF, callback, postData);
			};
			//var preAutomationDiv = $(document).find("#preAutomationMeta")[0];
			var preAutomationDiv = pega.ctx.dom.getElementById("preAutomationMeta");
			if (preAutomationDiv) {
				if (preAutomationDiv.hasAttribute("data-lazyloadInvoked")) {
					return;
				}
				preAutomationDiv.setAttribute("data-lazyloadInvoked", true);
				var flowActionDiv = pega.u.d.findParent(preAutomationDiv, "pyFlowActionHTML");
				if (pega.ui.roboticAutomation) {
					if (pega.ui.roboticAutomation.isAutomationConfigured("preLoad", flowActionDiv)) {
						pega.ui.roboticAutomation.runAutomation("preLoad", flowActionDiv, lazyLoad);
					}
				}
			}

		}
	};
})();
//static-content-hash-trigger-GCC
/*
 * RowsLoadManager for loading multiple grids REFRESHROWS Scenario.
 */

pega.ui.GridRowsLoadManager=function(loadInfo){
	pega.ui.GridRowsLoadManager.superclass.constructor.call(this,loadInfo);
};
pega.extend(pega.ui.GridRowsLoadManager, pega.ui.LoadManager); 

pega.ui.GridRowsLoadManager.prototype.load = function(gridWithRowsToRefresh) {
	if(gridWithRowsToRefresh && gridWithRowsToRefresh.GridToRefresh){
		var GridToRefresh = gridWithRowsToRefresh.GridToRefresh;
		if(GridToRefresh.rowsToRefresh){
			GridToRefresh.refreshRows({rowsArray:GridToRefresh.rowsToRefresh});
			GridToRefresh.rowsToRefresh = null;
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
};
//static-content-hash-trigger-GCC
pega.ui.accessibility = {};

pega.ui.accessibility.AccessKeyMap = {
    'PREVIOUS_TAB_HORIZONTAL': {
        'keyCode': '37' //LEFT ARROW
    },
    'PREVIOUS_TAB_VERTICAL': {
        'keyCode': '38' //UP ARROW
    },
    'PREVIOUS_TAB_CONTENT': {
        'modifier1': 'ctrlKey',
        'keyCode': '33' //PAGE UP
    },
    'NEXT_TAB_HORIZONTAL': {
        'keyCode': '39' //RIGHT ARROW
    },
    'NEXT_TAB_VERTICAL': {
        'keyCode': '40' //DOWN ARROW
    },
    'NEXT_TAB_CONTENT': {
        'modifier1': 'ctrlKey',
        'keyCode': '34' //PAGE DOWN
    },
    'CLOSE_TAB': {
        'modifier1': 'altKey',
        'modifier2': 'ctrlKey',
        'keyCode': '46' //DEL
    },
    'CLOSE_TAB_BY_ACTIONKEY': {
        'keyCode': '13' //RETURN
    },
  	'SPACE': {
         'keyCode': '32' /* SPACE BAR: Added as part of SE-29717, hitting spacebar on the JAWS form field dialog, does not activate the tab */
    },
    'DELETE': {
         'keyCode': '8' // DELETE / BACKSPACE for Mac
    }
};
//static-content-hash-trigger-GCC
pega.ui.Doc.prototype.HeavyOperations = (function() {
	/*
	 * Array of heavyOperations which are not to be invoked directly by any other JS function.
	 * The operation has to be scheduled using HeavyOperations.registerOnceOnInit() API.
	 * Harness infra will take care of calling the function.
	 */
	var _heavyOperations = [];
	var _heavyOperationsMap = {};
	var _doOnceOnInit = function() {
		var heavyOps = _heavyOperations;
		for(var operationIndex in heavyOps) {
				var opearationName = heavyOps[operationIndex];
				try {
					pega.u.d[opearationName].call(pega.u.d);
				}catch(e){}
		}
		_heavyOperations = [];
		_heavyOperationsMap = {};
	}
	pega.ui.Doc.prototype.doOnceOnInit = _doOnceOnInit;
	/*
	 *	private function to insert an operation in the _heavyOperations array
	 */
	var _insertInHeavyOperationsArray = function(opearationName) {
		if(!_heavyOperationsMap[opearationName]) {
			_heavyOperationsMap[opearationName] = true; /* maintain in Map to keep track of which operations are already scheduled so as to avoid duplicates in the _heavyOperations array */
			_heavyOperations.push(opearationName);
		}
	}
	
	return {
		registerOnceOnInit : _insertInHeavyOperationsArray /* the API to be invoked by the users to registerOnceOnInit an operation only once */
	};

})();
//static-content-hash-trigger-GCC
var pega = pega || {};
pega.ui = pega.ui || {};

pega.ui.AutopopulateSupport = (function() {
	
  var _hasAutoPopulateProperties;
 
	/*
	 *  Model of an autopopulate property
	 */
	function AutopopulateProperty(propRuleData) {
		// Direct init
		this.dpName = propRuleData["pyDataObject"];
		this.dpClass = propRuleData["pyDataObjectClass"];
		this.pageClass = propRuleData["pyPageClass"];
		this.propertyMode = propRuleData["pyPropertyMode"];
		this.linkType = propRuleData["pyDataRetrievalType"];

		// Derived init
		this.isPageList = this.propertyMode === "PageList";
		this.isPage =  this.propertyMode === "Page";
		this.isReferDP = this.linkType === "AUTOMATIC";
		this.isCopyDP = this.linkType === "AUTOMATICNONREF";

		// Init DO Param Map
		this.DOParamMap = {};
		if(Array.isArray(propRuleData.pyDOParamList)) {
			for(var i = 0; i < propRuleData.pyDOParamList.length; i++) {
				this.DOParamMap[propRuleData.pyDOParamList[i].pyName] = this.getDOParamValue(propRuleData.pyDOParamList[i].pyValue);
			}
		}
	}

	AutopopulateProperty.prototype.getDOParamValue = function(value) {
		//Literal
		if(value.indexOf('"') == 0 && value.lastIndexOf('"') == value.length - 1) {
			return value.replace(/"/g, '');
		} else {
			if(value.indexOf('.') == 0) {
				value = "pyWorkPage" + value;
			}
			var prop = pega.ui.ClientCache.find(value);
			return prop ? prop.getValue() : '';
		}
		return '';
	}

	/*
	 * Map that holds all autopopulated properties
	 */
	var autopopulatePropertyMap = {};

	/*
	 * Given a classname and property name, returns an instance of Autopopulateproperty from the rule cache
	 * 
	 */
	var _getIfAutopopulatePropertyInstance = function(className, propName) {
      	//BUG-201368 : added pega offline check
      	//added additional check for destinationremote/online
      	if(typeof pega.offline == 'undefined' || (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationRemote())){
          return null;
        }
		// Remove subscripts from input propName - consider only numeric subscripts as only pagelists are supported
		propName = propName.replace(/(\w*?)\(\d+\)/g, '$1');

		if(className && className.length > 0 && propName && propName.length > 0) {
			className = className.toUpperCase();
			propName = propName.toUpperCase();
			
			if(! autopopulatePropertyMap[className + "!" + propName]) {
				// Query rule cache
              	var propRuleData = pega.offline.rulecache.getRuleFromCache("RULE-OBJ-PROPERTY", className + "!" + propName);
                
				// Did not find in the rule cache - return null
				if(! propRuleData) {
					return null;
				}
				
				if((propRuleData["pyDataRetrievalType"] ==="AUTOMATIC" || propRuleData["pyDataRetrievalType"] === "AUTOMATICNONREF") 
					&& (propRuleData["pyPropertyMode"] === "PageList" ||  propRuleData["pyPropertyMode"] === "Page")) {
					autopopulatePropertyMap[className + "!" + propName] = new AutopopulateProperty(propRuleData);
				} else {
					// Not a auto-populate property - return null
					return null;
				}
			}

			return autopopulatePropertyMap[className + "!" + propName];
		}
		// Invalid inputs - return null
		return null;
	}

	var _resolveRef = function(propertyReference, changetracker, parentPage, copyOverride) {

    // No autopopulate properties exist so ignore processing
    if (!pega.ui.AutopopulateSupport.hasAutoPopulateProperties) {
      return propertyReference;
    }
    
		var prop,
			nextPropName,
			className,
			propMetadata,
			propSplitIdx,
			autoPopulateRef,
			autoPropName,
			originalSubscript,
			nextPropValue,
			nextPropKeys,
			returnRef = '';  

		var propSplit = propertyReference.split(".");

		if(propSplit && propSplit.length >= 1) {
			// Initialize prop
			prop = parentPage || changetracker.trackedPropertiesList;

			for(propSplitIdx = 0; propSplitIdx < propSplit.length; propSplitIdx ++) {
				
				nextPropName = propSplit[propSplitIdx];             
				className = prop["pxObjClass"];
				autoPopulateRef = _getIfAutopopulatePropertyInstance(className, nextPropName);
				nextPropKeys = changetracker.returnListOrGroupProp(nextPropName);
				nextPropValue = (nextPropName == nextPropKeys) ? prop[nextPropName] : prop[nextPropKeys.key]&&prop[nextPropKeys.key][nextPropKeys.index];
				if(typeof nextPropValue != 'undefined' && nextPropValue != null || autoPopulateRef != null) {
					if(autoPopulateRef) {
						Object.keys(autoPopulateRef.DOParamMap).forEach(function(key) {
							pega.clientTools.putParamValue(key, autoPopulateRef.DOParamMap[key]);
						});
						if (autoPopulateRef.isReferDP && !copyOverride) {
							returnRef = _referencePage(autoPopulateRef, changetracker, nextPropName);
						} else {                            
							_copyPage(autoPopulateRef, changetracker, prop, nextPropName);
							if(returnRef != '') returnRef += ".";
							returnRef += nextPropName;
							prop = nextPropValue;
						}                   
					} else {
						// Navigate to the next property
						prop = nextPropValue;
						if(returnRef != '') returnRef += ".";
						returnRef += nextPropName;
					}               
					
				} else {

					// In case of non-exist reference, copy all further parts of the references.
					for(;propSplitIdx < propSplit.length; propSplitIdx ++) {
						nextPropName = propSplit[propSplitIdx];
						if(returnRef != '') returnRef += ".";
						returnRef += nextPropName;
					}                    
					break;
				}
			}
		}

		return returnRef;
	};

	var _referencePage = function (autoPopulateRef, changetracker, propertyName) {

		var subscriptRe = /\w*?(\(\d+\))/g,
			originalSubscript;
		
		var autoPropName = pega.ui.ParametrizedDPUtils.createDPInstance(autoPopulateRef.dpName, changetracker);
		
		if(autoPopulateRef.isPageList && subscriptRe.test(propertyName)) { //Is pagelist and original reference has subscripts(eg. pyWorkPage.parts(1))
			// Extract the original subscripts part from propertyName
			originalSubscript = propertyName.replace(subscriptRe, '$1');
			// Slide over to pxResults with subscipts
			autoPropName += "." + "pxResults" + originalSubscript;
		} else if (autoPopulateRef.isPageList) {
			autoPropName += "." + "pxResults";
		} // In case of page do nothing

		return autoPropName;
	};

  var _isPageExist = function (propertyName, groupIndex, targetPage) {
    
    if (groupIndex) {
        return !!(targetPage[propertyName] && targetPage[propertyName][groupIndex]);
    }
    return !!(targetPage[propertyName]);
  };
  
	var _copyPage = function (autoPopulateRef, changetracker, copyTo, propertyName) {

		var dPage = pega.ui.ParametrizedDPUtils.createDPInstance(autoPopulateRef.dpName, changetracker);
		dPage = pega.ui.ClientCache.find(dPage);
		var copyToPage = copyTo;

    // Trim index
    var groupIndex = propertyName.lastIndexOf(')');
    if (groupIndex !== -1 && propertyName.length === (groupIndex+1)) {
      groupIndex = propertyName.substring(propertyName.lastIndexOf('(')+1, propertyName.lastIndexOf(')'));
      isNaN(groupIndex) ? (groupIndex = null):(propertyName = propertyName.substring(0, propertyName.lastIndexOf('(')));
    }
    
		// return if the property contains values
		if (_isPageExist(propertyName, groupIndex, copyTo)) {
			return;
		}

		if (autoPopulateRef.isPageList) {
			
			var results = dPage.get("pxResults").iterator();
			var i = 0 ;
			while(results.hasNext()){
			  var resultPage = results.next(); 
              if(!copyToPage[propertyName]){
                copyToPage[propertyName] = [];
              }
			  copyToPage[propertyName] [i]  = JSON.parse(resultPage.getJSON());
			  i++;
			}
		  
		} else {
			// clone and copy
			copyToPage[propertyName]  = JSON.parse(dPage.getJSON());
		}
	};

	return {
		resolveReference : _resolveRef,
		get hasAutoPopulateProperties() {
			if (_hasAutoPopulateProperties === undefined) {
				var portalWindow;
				if (pega && pega.mobile && pega.mobile.support) {
					portalWindow = pega.mobile.support.getPortalWindow();
				}
				// The !portalWindow.pega condition is required for unit tests which mocks portalWindow without pega object defined
				if (!portalWindow || portalWindow === window || !portalWindow.pega) {
					_hasAutoPopulateProperties = true;
				} else {
					// Reuse value from shared webview, as the code which calculates this flag 
					// is loading and executing only in that webview.
					_hasAutoPopulateProperties = portalWindow.pega.ui.AutopopulateSupport.hasAutoPopulateProperties;
				}
			}
			return _hasAutoPopulateProperties;
		},
		set hasAutoPopulateProperties(value) {
			_hasAutoPopulateProperties = value;
		}
	};
	
})();
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui");

/**
 * Panel creates an element that can be shown and hidden
 *
 * WARNING : Internal API for Live Composer library. This library is
 * subject to change.
 *
 * @param panelName - unique name of the panel
 * @param container - container HTML element to load the panel into
 * @param options - object of optional configurations
 *		  options.className - class name to add the the panel
 *	      options.enableTransition - boolean to add default transitions to panel
 */
pega.ui.Panel = function(panelName, container, options) {
  	options = options || {};
    if (options.className == null)	options.className = "";
    if (options.enableTransition == null)	options.enableTransition = true;
  
  	// Create new section element and add to the container
  	var newPanelSection = document.createElement("DIV");
   
  	// TODO: Loading the panel should not be dependent on ui inspector being loaded
  	//       The code should directly set the div attribute without the dependency with pega.ui.inspector.utilities
 
  	// If a container is given and the inspector is available load the section into the DOM
  	if (pega.ui.inspector != null && container != null) {
      	// Append the new div that will be the section into the container
  		$(newPanelSection).appendTo(container);
      
      	// Call utility to load the panel section into the DOM
  		pega.ui.inspector.utilities.loadSectionIntoDom("pzPega_UI_Panel", "@baseclass", newPanelSection, function(){}, "", "pzClearPegaUIPanel", "&panelName=" + panelName); 
    }
  
  
    $(newPanelSection).addClass("ui-panel");
    this.panelElement = newPanelSection;
    this.state = "hidden";
    this.panelClass = "";

    //add a userdefined classname if it is passed in
    $(newPanelSection).addClass(options.className);
  
  	// If the option to animate is set then add animation class
  	if (options.enableTransition === true) {
      	$(newPanelSection).addClass("transition-panel");
    }
  
    /**
     * Handles the animation effects for showing the panel
     */
    this.show = function() {
        $(this.panelElement).addClass("show-ui-panel");
        this.state = "showing";
    };

    /**
     * Handles the animation effects for hiding the panel
     */
    this.hide = function() {
        $(this.panelElement).removeClass("show-ui-panel");
        this.state = "hidden";
    };

    /**
     * Getter for the width of the panel.
     *
     * @return int The width of the panel element.
     */
    this.getWidth = function() {
        return $(this.panelElement).width();
    };

    /**
     * Whether the panel is showing.
     *
     * @return boolean Whether the panel is showing.
     */
    this.isOpen = function() {
        return this.state == "showing";
    };

    /**
     * Handles calling the panel Load Activity to load the content based on the given class
     *
     * @param panelClass - The class of the panel to show (ex. Pega-UI-Panel-LayoutEditor)
     * @param key - A key value to be stored on clipboard for panel
     * @param callback - A callback function to be run after the reload occurs
     * @param params - Additional array of parameters to be sent to server (ex. { param: "name" , value: "something"})
     */
    this.load = function(panelClass, key, callback, params) {      
        // Try to find the section element to reload
        var sectionNode = pega.u.d.getSectionByName("pzPanel", "", this.panelElement);
        if (sectionNode != null) {
            this.panelClass = panelClass;
           
           // key can be passed as undefined, if so set to blank and handle in pzPreLoad
           if(key === null || key === undefined) {
             key = "";
           }
            // Build up URL for preActivity
            var reloadURL = new SafeURL();
            reloadURL.put("panelClass", panelClass);
            reloadURL.put("key", key);        

            // Add all additional parameters to the request
            if (params) {
              for (var x = 0; x < params.length; x++) {
                reloadURL.put(params[x].param, params[x].value);
              }
            }

            // Refresh pzPanel section
            pega.u.d.reloadSection(sectionNode, "pzLoadPanel", reloadURL.toQueryString(), false, false, -1, false, null, null, null, callback);
        }      
    };
};
//static-content-hash-trigger-GCC
pega.ui.rdlMasterDetails = {
	
	RDL_MD_THREAD: "$WorkProcessing",
	RDLMDDismissibleActions: ["showHarnessWrapper", "createNewWork", "openWorkByHandle"],
  
	isWOBound: function(targetRDL) {
		if(!targetRDL)
			return;
      if(this.getRDLClassFamily(targetRDL) == "Work"){ 
				return true;
      }
	},

  isOnlineWOBound: function(targetRDL) {
    var bOnlineWOBound = false;
    if(this.isWOBound(targetRDL)){
      if(pega.u.d.ServerProxy.isHybridClient()){
        if(!this.isRDLCaseOfflinable(targetRDL)){
          bOnlineWOBound = true;
        }
      }else{
        bOnlineWOBound = true;
      }
    }
    return bOnlineWOBound ;
  },
    
  /*This method cleans up the RDL masterdetail variables
     */
  cleanup: function(thisObj){
    thisObj.__oResponse = null;
    thisObj.__responseReceived = null;
    thisObj.__responseLoaded = null;
    //thisObj.__showDetailsTransiting = null;
    //thisObj.__activeRDLRowObject = null;
    //thisObj.__activeDetailsNode = null;
  },
  
  /*
     *This method returns the work processing thread name relative to the current thread context.
     */
  getWorkProcessingThread: function(){
    var threadName;
    if(pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen){
      var activeRDLMetaInfo = this.getActiveRDLMetaInfo();
      if(!activeRDLMetaInfo.isOnlineWOBound)
        return;

      var primaryThread = pega.u.d.getThreadName();
      if(primaryThread.indexOf(pega.ui.rdlMasterDetails.RDL_MD_THREAD)==-1){
        threadName = primaryThread + "/" + pega.ui.rdlMasterDetails.RDL_MD_THREAD;
      }else{
        threadName = primaryThread;
      }         
    }
    return threadName;
  },

  
	/* This method returns the active RDL metadata 
     */
	getActiveRDLMetaInfo: function() {
		var row = this.getActiveRow();
        if(!row || !pega.util.Dom.isAncestor(document.body, row)) {
          return;
        }
		var rowPage = row.getAttribute("base_ref");
		var resArr = rowPage.match(/\(\d+\)/g);
        var rowIndex = parseInt(resArr[resArr.length - 1].replace("(", "").replace(")", ""), 10);
        var rdlNode = this.getEnclosingRL(row);
		var rdlSource = rdlNode.getAttribute("data-repeat-source");
		var detailsNode = pega.ctx.dom.$(".RDLShowDetails.open").get(0) || pega.ctx.dom.$(rdlNode).siblings(".RDLShowDetails").get(0);
		var methodName;
        if(detailsNode){
        	methodName = detailsNode.getAttribute("data-methodname");          
        }
		var sectionNode = pega.ctx.dom.$(rdlNode).closest("[node_name]").get(0);
		var sectionName = (sectionNode ? sectionNode.getAttribute("node_name") : "");
		var isOnlineWOBound = this.isOnlineWOBound(rdlNode);
		var isWOBound = this.isWOBound(rdlNode);
		var RDLClassFamily = this.getRDLClassFamily(rdlNode);
      	var RDLSectionContext = pega.u.d.getBaseRef(pega.u.d.getEnclosingSection(row)) || pega.u.d.primaryPageName;/* BUG-231230: Added OR condition to fix the context */
		
		return {
			rowNode: row,
			rowPage: rowPage,
			rowIndex: rowIndex,
			RDLNode: rdlNode,
			RDLSource: rdlSource,
			showDetailsNode: detailsNode,
			rowMethodName: methodName,
			RDLSectionName: sectionName,
			isOnlineWOBound: isOnlineWOBound,
			isWOBound: isWOBound,
			RDLClassFamily: RDLClassFamily,
          	RDLSectionContext: RDLSectionContext
		};
	},

	/* 
	This method is used to refresh the sections containing RDLs bound to the given dataSource
	@param $String dataSource
	@param $Integer index (Optional)
	 */
    refreshRDLSections: function(dataSource, index){
		/*
		* Example: dataSource = .SolutionPL(1).Parts(2) then dataSource.match(/\(\d+\)/g) returns ['(1)','(2)']
		*/
      /*SE-62886 : Fixing RDL delete if its inside modal*/
      var isSourceNested = dataSource.match(/\(\d+\)/g) && dataSource.match(/\(\d+\)/g).length > 0;
      var isNestedRDL = false;
      if(isSourceNested){
        var parentSource= dataSource.substring(0, dataSource.indexOf("("));
        if(pega.ctx.dom.querySelector("[data-repeat-source='" + dataSource + "']").closest("[data-repeat-source='" + parentSource + "']")) 
          isNestedRDL= true;
      }  
      /* BUG-377458: Hfix-44840 Also check if masterdetails is open */
		  if(isNestedRDL  && !pega.ui.rdlMasterDetails.isShowDetailsOpen) {/* Check if nested RDL */
			  /* In case of nested RDL change the dataSource to parent RDL, to refresh parent RDL sections */
			  dataSource = dataSource.substring(0, dataSource.indexOf("("));
		  }
          var arrSectionsWithRDL = [];
		  //var sectionFromEventTarget = pega.util.Dom.getChildren(sectionParentFromEventTarget)[0];
		  pega.ctx.dom.$("[data-repeat-source='" + dataSource + "']").each(function(index,element) {
			 var sectionDiv = pega.u.d.getSectionDiv(element);
			 if(sectionDiv && /*sectionFromEventTarget != sectionDiv  &&*/ arrSectionsWithRDL.indexOf(sectionDiv) == -1) {
				arrSectionsWithRDL.push(sectionDiv);
			 }
		  });
          /*if(arrSectionsWithRDL.length > 0) {
				pega.u.d.reloadSections(new SafeURL(), arrSectionsWithRDL, null, null, null, event, [], [], null);
			}*/
          for(var i = 0; i < arrSectionsWithRDL.length; i++) {
          /* TODO: When refresh multiple sections is supported then use above commented block and comment this block. */
             pega.u.d.reloadSection(arrSectionsWithRDL[i],'','',false,false,'',false);
          }

    },
    
	/*
	This API is the trigger point for displaying the row details.
	@param $Object event - click event on the RDL row
	*/
    showDetails: function(event){
      // Disable native menu swipe gesture
      pega.ui.appview.disableNavToggle();

      var refreshShowDetails = event && event.refreshShowDetails;
      var target,primaryPgName,detailsNode;
      if (!pega.ctx.RDL) {
         pega.ctx.RDL={};  
      }
      if(!pega.ctx.RDL.masterDetailsParams){
        pega.ctx.RDL.masterDetailsParams = {}
      }
      if(!pega.ctx.RDL.masterDetailsParams.showDetailsLoading || (pega.ctx.RDL.masterDetailsParams.showDetailsLoading && refreshShowDetails))
        pega.ctx.RDL.masterDetailsParams.showDetailsLoading = true;
      else
        return;

      if(event.refreshShowDetails){
        target = event.target;
        primaryPgName = target.getAttribute("base_ref");
        //detailsNode = this.getActiveRDLMetaInfo().showDetailsNode;
      }
      else{
        target = pega.util.Event.getTarget(event);
        primaryPgName = pega.u.d.getBaseRef(target);
        //BUG-391744: [base_ref] is changed to .content-item 
        pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject = pega.ctx.dom.$(target).closest("[data-repeat-source] > .content-item")[0] || pega.ctx.dom.$(target).closest("[data-repeat-source] .rdl-category-rows > .content-item")[0];
        if(!pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject){ /* When we click on category header, activeRDLRowObject will be empty, so just return */
          pega.ctx.RDL.masterDetailsParams.showDetailsLoading = false;
          return;
        }
        //detailsNode = this.getActiveRDLMetaInfo().showDetailsNode;
        //this.__activeDetailsNode = detailsNode;
      }
      primaryPgName = pega.u.d.getBaseRef(pega.util.Dom.getFirstChild(target) || target);/* BUG-231049: Always use getBaseRef to compute primaryPgName */
      var targetRDL = this.getEnclosingRL(target);
      var flowaction = targetRDL.getAttribute("data-details-flowaction");

      /* Return of the target of the event is the RDL and not the row */
      /* BUG-373773: Check if the RDL has the class "rdlHasNoRows" and return */
      if(target == targetRDL || (targetRDL && targetRDL.classList.contains("rdlHasNoRows"))){
        pega.ctx.RDL.masterDetailsParams.showDetailsLoading = false;
        return;
      }

      if(!event.refreshShowDetails) {

        // Save the current destination
        pega.ctx.RDL.masterDetailsParams.__destination = (pega.u.d.ServerProxy.isDestinationRemote() ? pega.u.d.ServerProxy.DESTINATION.REMOTE: pega.u.d.ServerProxy.DESTINATION.LOCAL);

        detailsNode = pega.ctx.dom.$(targetRDL).siblings(".RDLShowDetails").get(0);

        // TASK-343417: Add RDLShowDetails as sibling of #modalOverlay
        var modalOverlay$Node = pega.ctx.dom.$("#modalOverlay");
        if(modalOverlay$Node[0]){
          modalOverlay$Node.after(detailsNode);
        } else {
          // Move the details node out to body
          // US-200613: Move the details node out to the Harness Div
          //$("body").append(detailsNode);
          var harnessDiv = pega.ctx.dom.getContextRoot();
          harnessDiv.appendChild(detailsNode); /*BUG-373830: Used appendChild method instead of append to support IE */
        }
        $.data(detailsNode, "targetRDL", targetRDL );

        // Show the details area
        detailsNode.style.display = "block";

        // Chromium bug: Trigger a reflow - https://code.google.com/p/chromium/issues/detail?id=121340
        // BUG-224583: Reflow is required in desktop browser
        detailsNode.offsetWidth;
        //detailsNode.style.right = 0;

        /* BUG-228696 - Setting up the details UI for scrollability */

        var fixMDScrolling = function() {
          var headerElement = pega.ctx.dom.$(detailsNode).find("> .sectionDivStyle > .layout:nth-child(1), .sectionDivStyle > #pega_ui_mask ~ .layout:nth-child(2)");
          var contentElement = pega.ctx.dom.$(detailsNode).find("> .sectionDivStyle > .layout:nth-child(2), .sectionDivStyle > #pega_ui_mask ~ .layout:nth-child(3)");
          /*BUG-396774 Content element should be the last element in case the length of the content element is more than 1 */
          if(headerElement && headerElement.get(0) && contentElement && contentElement.get(0)) {
            pega.ctx.dom.$(contentElement.get(contentElement.length-1)).css({height: "calc(100% - " + headerElement.get(0).offsetHeight + "px)"});
          }
        };

        fixMDScrolling();

        /* End: BUG-228696 */

        // Set Transition in progress
        var that = this;

        var showDetails_TransitionEnd = function() {
          detailsNode.removeEventListener("transitionend", _showDetails_TransitionEnd, false);
          pega.ctx.dom.$(detailsNode).addClass("md-loaded");
          that.getFlowAction(event, flowaction, primaryPgName, detailsNode);
        };

        var _showDetails_TransitionEnd = function() {
          setTimeout(showDetails_TransitionEnd, 500);
        };

        detailsNode.addEventListener("transitionend", _showDetails_TransitionEnd, false);
        if(!pega.ctx.RDL.masterDetailsParams){
          pega.ctx.RDL.masterDetailsParams = {};
        }
        pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen = true;
      } else {
        detailsNode =  pega.ctx.dom.$("div.RDLShowDetails.open").get(0);

        /*Fixing the entry handles in the refreshed RDL row*/
        var rowHandle = pega.ui.property.toHandle(primaryPgName);
        var packagedContext = "$P"+pega.ui.DataRepeaterUtils.getPackagedPageName();
        var targetElements = target.querySelectorAll('[data-propref]');

        for(var i=0;i<targetElements.length;i++){
          var propRefVal = targetElements[i].getAttribute("data-propref");
          if(propRefVal && propRefVal.indexOf(pega.ui.DataRepeaterUtils.getPackagedPageName())>-1){
            propRefVal = propRefVal.replace(packagedContext,rowHandle);
            targetElements[i].setAttribute("data-propref",propRefVal);
          }
        }              
      }

      this.setMasterDetailContext(detailsNode, primaryPgName);
      // TASK-332645: Local data binding story. Sending the primary page to determine which row was clicked
      this.bindLocalData(targetRDL, detailsNode, primaryPgName);

      // Set the runtime context for the RDL Details div
      detailsNode.setAttribute("base_ref", primaryPgName);
      detailsNode.removeAttribute("full_base_ref");/* when base_ref is set explictly then remove full_base_ref attribute, otherwise getBaseref() will return one in full_base_ref(which is stale ) */

      /* Post changes due to BUG-290008, the row details template section is also having a base_ref */
      detailsNode.firstElementChild.setAttribute("base_ref", primaryPgName);
      detailsNode.firstElementChild.removeAttribute("full_base_ref");


      //	BUG-305084: copy data from context tree to change tracker for expr evaluation
      this.copyContextTreeOnToChangeTracker(primaryPgName);

      // Cleaning sec_baseref and fullprops attribute for div's with client side visible whens
      var visibleWhenDivs = detailsNode.querySelectorAll('div#CT[swp]');
      var visibleWhenDivsLen = visibleWhenDivs.length;
      for(var i=0; i<visibleWhenDivsLen; i++){
        var visibleWhenDiv = visibleWhenDivs[i];
        visibleWhenDiv.removeAttribute("sec_baseref");
        visibleWhenDiv.removeAttribute("fullprops");
        visibleWhenDiv.style.display = "none";
      }

      // Evaluating client conditions
      if(visibleWhenDivsLen) {
        if(pega.u.d.ServerProxy.isDestinationLocal()){
          pega.u.d.evaluateAllVisibleWhens();
        }
        else{
          pega.u.d.evaluateClientConditions("ALL",null,true,false);
        }
      }

      // TASK-343423: Save ref to RDL active row
      pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject = pega.ctx.dom.$(target).closest("[data-repeat-source] > [base_ref]")[0] || pega.ctx.dom.$(target).closest("[data-repeat-source] .rdl-category-rows > [base_ref]")[0];		

      pega.ctx.RDL.masterDetailsParams.__activeDetailsNode = detailsNode;

      var transitionStart = function() {
        pega.ctx.dom.$(detailsNode).addClass("open");
      };

      if(!event.refreshShowDetails){
        window.setTimeout(transitionStart, 1);
      }
      else{
        this.getFlowAction(event, flowaction, primaryPgName, detailsNode);
      }
    },
	
	  // Convert pega notation to dot notation
	_convertToDotNotation: function(reference) {
        if (!reference)
            return "";

        return reference.replace(/\(([^)]+)\)/g, function(a, b) {
            if (!isNaN(b)) {
                b--;
            }
            return "." + b;
        });
    },
	
    // Convert . notation to object reference
    _index: function(obj, i) {
        if (obj) {
            if (/^'.*'$/.test(i)) {
                i = i.substring(1, i.length - 1);
            }
            return obj[i];
        }
    },
	
	copyContextTreeOnToChangeTracker: function(pageReference) {
		if(!pageReference)
			return;
		
		var isHCOnline = (pega.mobile && pega.mobile.isHybridClient) && pega.u.d.ServerProxy.isDestinationRemote();
		if(!isHCOnline)
			return;

		var changeTrackerMap = pega.ui.ChangeTrackerMap;
		var clientDataProvider = pega.ui.ClientDataProvider;

		// No ChangeTracker found, quit
		if (!changeTrackerMap || !changeTrackerMap.getTracker())
			return;

		// No ClientDataProvider found, quit (Non-Template case)
		if (!clientDataProvider || !clientDataProvider.getTracker())
			return;

		var threadName = clientDataProvider.getTracker().threadName;
		var clientDataProviderObject = clientDataProvider.getTrackerByThread(threadName);
		var changeTrackerObject = changeTrackerMap.getTrackerByThread(threadName);

		// Check for existence
		if ((!clientDataProviderObject || !changeTrackerObject) || (!clientDataProviderObject.trackedPropertiesList || !changeTrackerObject.trackedPropertiesList))
			return;
		
		pageReference = this._convertToDotNotation(pageReference);

		var CDPObject = pageReference.split(".").reduce(this._index, clientDataProviderObject.trackedPropertiesList);
		var CTObject = pageReference.split(".").reduce(this._index, changeTrackerObject.trackedPropertiesList);
		
		if((!CDPObject || !CTObject) || (typeof CDPObject !="object" || typeof CTObject !="object"))
			return;
		
		for(var property in CDPObject) {
			if(!CDPObject.hasOwnProperty(property))
				continue;
			// Skip $pxSections, $pxLocalized,..
			if(property.startsWith("$"))
				continue;
			// Skip if property already exists in CT
			if(property in CTObject)
				continue;
			// Skip non-leaf properties
			if(typeof CDPObject[property] == "object")
				continue;
			
			CTObject[property] = CDPObject[property];
		}
	},
  
    /*
	This method is used to dismiss the RDL row details.
	@param $Object event
	*/
	/*Ignoring the following method as it requires DOM manipulation ans uses defined APIs*/
  hideDetails: /*istanbul ignore next*/ function(event, bForced) {

    // Hide the details area
    var target = pega.util.Event.getTarget(event);
    var detailsNode = pega.ctx.dom.$(target).closest(".RDLShowDetails.open").get(0) || pega.ctx.dom.$("div.RDLShowDetails.open").get(0);
    if(!detailsNode)
      return;

    // Refresh the row section from ClientCache
    var activeRDLMetaInfo = this.getActiveRDLMetaInfo();
    var row = activeRDLMetaInfo.rowNode;
    var rowPage = activeRDLMetaInfo.rowPage;
    var rdlNode = activeRDLMetaInfo.rdlNode;
    var isOnlineWOBound = activeRDLMetaInfo.isOnlineWOBound;

    // Restore swipe gesture to its original state
    pega.ui.appview.determineNavToggleState();

    //detailsNode.style.right = "-100%";
    var that = this;
    var harnessID = pega.ctx.pzHarnessID;
    var hideDetails_TransitionEnd = function() {
      var harnessSwitched = false;
      var currentHarnessId = pega.ctx.pzHarnessID;
      if(harnessID && harnessID != currentHarnessId){
        pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(harnessID));
        harnessSwitched = true;
      }
      pega.ctx.dom.$(detailsNode).removeClass("md-loaded");

      if(!bForced)
        detailsNode.style.display = "none";


      pega.ctx.dom.$(detailsNode).insertAfter($.data(detailsNode, "targetRDL"));
      //$("div.secondarySection").remove();
      pega.ctx.dom.$(detailsNode).find(".secondarySection").html("");
      pega.ctx.dom.$(detailsNode).find("div[node_name='pyRDLRowDetailsPlaceHolderSection']").removeClass("hide");
      pega.ctx.RDL.masterDetailsParams.showDetailsLoading = false;
      pega.u.d.gBusyInd.hide();
      if(pega.u.d.ServerProxy.isHybridClient()){
        // Reset dest state
        if(that.__destination == pega.u.d.ServerProxy.DESTINATION.REMOTE)
          pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
        else
          pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.LOCAL);
      }
      detailsNode.removeEventListener("transitionend", _hideDetails_TransitionEnd, false);
      /* BUG-285722: Reset clientools */
      if(isOnlineWOBound){
        pega.clientTools.reset();          
      }
      // Calling cleanup
      that.cleanup(that);
      if(harnessSwitched){
        pega.ctxmgr.setContext(pega.ctxmgr.getHarnessContext(currentHarnessId));
      }
    };

    var _hideDetails_TransitionEnd = function() {
      setTimeout(hideDetails_TransitionEnd, 500);
    };


    if(bForced)	{// Dismiss immediately
      if(isOnlineWOBound /*&& pega.u.d.ServerProxy.isDestinationRemote()*/) {
        // Remove WorkProcessing Thread
        this.removeThread(this.RDL_MD_THREAD);
      }
      hideDetails_TransitionEnd();
    }
    else
      detailsNode.addEventListener("transitionend", _hideDetails_TransitionEnd, false);

    if(!bForced)		
      pega.ctx.dom.$(detailsNode).removeClass("open");
    if(!pega.ctx.RDL.masterDetailsParams){
      pega.ctx.RDL.masterDetailsParams = {};
    }
    pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen = false;

    if(!bForced)
      this.bindLocalData(null, row, rowPage);
    //var dataSource = rdlNode.getAttribute("data-repeat-source");
    //pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList.push(dataSource);
    //pega.u.d.evaluateRefreshWhenOSCO(false,true)

    if(isOnlineWOBound && !bForced /*&& pega.u.d.ServerProxy.isDestinationRemote()*/) {
      // Remove WorkProcessing Thread
      this.removeThread(this.RDL_MD_THREAD);
    }
    
    pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject = null; /* Clear __activeRDLRowObject otherwise getActiveRDLMetaInfo returns info even after closing master details. */
    
  },	

	/* 
	This method is used to copy control data(innterHTML) from the row markup to the row-details markup
	@param $Object fromNode - row node
	@param $Object toNode - rdl row details node
	@param $String primaryPage - absolute path of the row page
	*/
	/*TODO: Method to be refactored*/
	bindLocalData: /*istanbul ignore next*/ function(fromNode, toNode, primaryPage) {
		var targetElements = [];
        if(toNode) {
            targetElements = toNode.querySelectorAll('[data-propref]');
        }
        
		for(var counter = 0; counter < targetElements.length; counter++) {

			var tempPropRef = targetElements[counter].getAttribute('data-propref');

			var propertyName;
			var propertyReference;

			var propertyRef = pega.ui.property.toReference(tempPropRef);

			if(pega.u.d.ServerProxy.isDestinationLocal()) { // offline
				var ppName = pega.ui.DataRepeaterUtils.getPackagedPageName();
				if(propertyRef.indexOf(ppName) == 0) {
					propertyName = propertyRef.split(ppName)[1];
				}
			} else { // Desktop
				var primaryPagePrefix = primaryPage.substring(0, primaryPage.lastIndexOf("("));
				if(propertyRef.indexOf(primaryPagePrefix) == 0) {
					propertyName = propertyRef.split(primaryPagePrefix)[1];
					propertyName = propertyName.substr(propertyName.indexOf(")") + 1);
				} else {
                  var packagedPageName = pega.ui.DataRepeaterUtils.getPackagedPageName();
                  if(propertyRef.indexOf(packagedPageName) == 0) {
                    propertyName = propertyRef.split(packagedPageName)[1];
                  }
                }
			}

			if(propertyName) {
				propertyReference = pega.ui.property.toHandle(primaryPage + propertyName);
					if(!fromNode)
						return;
				var sourceElement = fromNode.querySelector("[data-propref='" + propertyReference + "']");
					var targetElement = targetElements[counter];
					if(targetElement && sourceElement) {
						targetElement.innerHTML = sourceElement.innerHTML;
					} else {
						if(!sourceElement && targetElement) {
							targetElement.innerHTML = "";
						}
						if(pega.ui.debug) console.log("pega.ui.DataRepeaterUtils: Cannot find element with entry handle " + propertyReference);
					}
				}
			
			/* Rebdinding on RDL row
			if(pega.u.d.ServerProxy.isDestinationLocal() && propertyRef) {
				var ccProp = pega.ui.ClientCache.find(propertyRef);
					if(ccProp){
						targetElements[counter].innerText = ccProp.getValue();
					}else{
						if(pega.ui.debug) console.log("pega.ui.DataRepeaterUtils: Cannot find element with entry handle " + propertyRef);
					}
			}*/
		}
	},
		
	setMasterDetailContext: function(rdl_details, currentContext) {
        var detailsStr = rdl_details.innerHTML;
        var previousContext = "#~" + rdl_details.getAttribute("base_ref");
      	if(!previousContext)
        	return;
      
        previousContext = previousContext.replace(new RegExp("\\(", 'g'), "\\(").replace(new RegExp("\\)", 'g'), "\\)");
        detailsStr = detailsStr.replace(new RegExp(previousContext, 'g'), "#~" + currentContext);
        rdl_details.innerHTML = detailsStr;
    },
		
	/*
	This method return the active Row node.
	*/
	getActiveRow: function() {
    var activeRow = null;
    if(pega.ctx.RDL && pega.ctx.RDL.masterDetailsParams){
      /*BUG-329199:Return __activeRDLRowObject only when it is not stale */
      if(!document.body.contains(pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject)){
        pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject=null;
      }
      activeRow = pega.ctx.RDL.masterDetailsParams.__activeRDLRowObject;
    }
		return activeRow;
	},
	
    /* 
	This method is used to get the Full data path from DS and baseref
	@param $Object srcElement - the target element
	@return $Object enclosing RDL node
	 */
	/*Ignoring the following method as it requires DOM manipulation ans uses defined APIs*/
	getEnclosingRL: /* istanbul ignore next */ function(srcElement) {
    /* BUG-377458: HFix-44840 The srcElement may be inside an RDL which is itself present inside the masterdetails DIV */
    var enclosingRL = $(srcElement).closest("div[data-repeat-source]")[0];
		if(this.isElementInShowDetails(srcElement)) {
			// get row node form cached eventObject
			var target = this.getActiveRow();
			srcElement = pega.ctx.dom.$(target).closest("[base_ref='"+pega.u.d.getBaseRef(target)+"']").get(0);
      enclosingRL = $(srcElement).closest("div[data-repeat-source]")[0];
		}
		return enclosingRL;
	},

	
	getRDLClassFamily: function(RDLNode) {
		if(!RDLNode)
			return;
		var classInfo = RDLNode.getAttribute("data-classinfo");
		if(classInfo)
			return JSON.parse(classInfo).classFamily;
	},
	
	isRDLCaseOfflinable: function(RDLNode) {
		if(!RDLNode)
			return;
		var classInfo = RDLNode.getAttribute("data-classinfo");
		if(!classInfo)
			return false;
		return (JSON.parse(classInfo).isCaseOfflinable == "true");
	},
	
	isElementInShowDetails: function(element) {
		var detailsNode = pega.ctx.dom.$(element).closest(".RDLShowDetails.open").get(0);
		if(detailsNode)
			return true;
	},
	
	/*
	This method is used by showDetails to fetch and display the secondary details flowaction.
	*/
    getFlowAction: function(event, flowactionName, primaryPgName){
      // TASK-337708: Modifying the getFlowAction API to use processAction instead of serverproxy.doAction

      // Packaged page name = "PackagedPage" + JAVA hashCode of "PackagedPage"
      var packagedPageName = pega.ui.DataRepeaterUtils.getPackagedPageName();

      var clientCacheObj = pega.ui.ClientCache.find(primaryPgName);

      if(clientCacheObj){
        var pxObjClassProp = clientCacheObj.get("pxObjClass"),
            pzInsKeyProp = clientCacheObj.get("pzInsKey"),
            pxRefObjectKeyProp = clientCacheObj.get("pxRefObjectKey"),
            pxRefObjectClassProp = clientCacheObj.get("pxRefObjectClass"),
            pxObjClass = pxObjClassProp ? pxObjClassProp.getValue() : "",
            pzInsKey = pzInsKeyProp ? pzInsKeyProp.getValue() : "",
            pxRefObjectKey = pxRefObjectKeyProp ? pxRefObjectKeyProp.getValue() : "",
            pxRefObjectClass = pxRefObjectClassProp ? pxRefObjectClassProp.getValue() : "";
      }

      var RDLMetaInfo = pega.ui.rdlMasterDetails.getActiveRDLMetaInfo();
      var rdlSource = RDLMetaInfo.RDLSource;	// D_crmConRecentWorkItems_Mobile_pa1460390496863pz.pxResults to D_crmConRecentWorkItems_Mobile_pa1460390496863pz
      rdlSource = rdlSource.split(".")[0];

      /*var target;
		if(event.refreshShowDetails){
			target = event.target;
		}
		else{
			target = pega.util.Event.getTarget(event);
		}*/
      var targetRDL = RDLMetaInfo.RDLNode;

      var bRDLWOBound = (this.getRDLClassFamily(targetRDL) === "Work" && pzInsKey && pxObjClass) ? true : false;
      var bAssignmentList = (this.getRDLClassFamily(targetRDL) === "Assign" && pxRefObjectKey && pxRefObjectClass) ? true : false;
      var isOnlineWOBound = RDLMetaInfo.isOnlineWOBound;

      if(isOnlineWOBound && !(pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.__RDLWOThreadInitialized)){
        pega.ctx.RDL.masterDetailsParams.__RDLThreadSetup = true;
      }
      // The Options object	
      var options = {
        mTObjClass : "@baseclass",
        fAObjClass : primaryPgName,
        isShowDetails : true,
        isCenterOverlay : "false",
        isLocalAction : "true",
        doNotRefresh : true,
        doNotSubmit: true,
        modalSection: "pzModalAction",
        taskStatus: flowactionName,
        pxObjClass: clientCacheObj!=null ? pxObjClass : "",
        isOnlineWOBound: isOnlineWOBound,
        noThreadProcess: true,
        bRODetails: true
      };
      var target;
      if(event.refreshShowDetails){
        target = event.target;
      }
      else{
        target = pega.util.Event.getTarget(event);
      }

      var targetRDL = this.getEnclosingRL(target);
      var isWorkBound = bRDLWOBound || bAssignmentList;
      if(!isWorkBound){	
        /* BUG-301892 Conditional Checks are being added because even the RDL is work object bound after edit details the api for check work object bound is returning false as a result client cache is being returned null hence adding null checks */
        if(clientCacheObj){
          var resultProp = clientCacheObj.getName();		
          resultProp = resultProp.substring(0,resultProp.indexOf("("));		
          clientCacheObj.getParent().put("$partialListProperty$"+resultProp,true);	
        }
      }
      // HC and WorkProcessing
      /* BUG-317024: Removed the check for refreshShowDetails */
      if(pega.u.d.ServerProxy.isHybridClient() && (bRDLWOBound || bAssignmentList)){
        var workHandle = bRDLWOBound ? pzInsKey : pxRefObjectKey;
        var classNameOfCase = bRDLWOBound ? pxObjClass : pxRefObjectClass;

        var loadWO_Success = function(ccPage) { // work item is cached in client store
          pega.ui.rdlMasterDetails.callProcessAction(options, event);

          // Invoke onActionComplete
          var actionInfo = new SafeURL();
          actionInfo.put("pzInsKey", workHandle);
          actionInfo.put("api", "RDLShowDetails");
          actionInfo.put("rdl-source", rdlSource);
          pega.u.d.ServerProxy.onActionComplete(actionInfo.toURL());
        };

        var loadWO_Failure = function(result){ // work item not available
          pega.ui.rdlMasterDetails.showErrorOnSecondaryFA(pega.u.d.fieldValuesList.get("CannotLoadItem"));
        };
        /*
			var callback = {
				offlineCase : function(){

				},
				onlineCase : function(){

				}
			};
            pega.offline.clientstorehelper.getCaseType(classNameOfCase, callback.offlineCase, callback.onlineCase);	
            */
        /* CaseCache optimization */
        if(pega.process.metadata.caseCache[classNameOfCase]) {
          pega.ui.rdlMasterDetails.loadWorkObject(workHandle, loadWO_Success, loadWO_Failure);
        } else {
          var isServerAvailable = pega.ui.ClientCache.find("pxRequestor.pzIsPegaServerAvailable");
          if(!isServerAvailable || (isServerAvailable && isServerAvailable.getValue()=="false")){
            var cannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");
            if(pega.ui.DCUtil.isActionFromNonOsco){
              pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
            }	
            pega.ui.rdlMasterDetails.showErrorOnSecondaryFA(cannotPerformWhenOffline);
            return;
          } 
          options.contextParams = {
            packagedContext : packagedPageName,
            runtimeContext : primaryPgName
          };
          pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
          pega.ui.rdlMasterDetails.callProcessAction(options, event);
        }
      }
      else{
        // Desktop / HC Non-Work Processing scenarios
        options.contextParams = {
          packagedContext : packagedPageName,
          runtimeContext : primaryPgName
        };

        this.callProcessAction(options, event);
      }

     },

	/* 
	Invoked on success callback of processAction.
	*/
	/*Ignoring the following method as it deals with thread switching, cleanup and is depended on DOM*/
	showDetailsFlowAction_Success: /*istanbul ignore next*/ function(oResponse){
		
		// If Master Details is already dismissed, quit
		if(!(pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen))
			return;
		
		// Switch context to secondary for online WO RDL
		var activeRDLMetaInfo = this.getActiveRDLMetaInfo();
		var row = activeRDLMetaInfo.rowNode;
		var rowPage = activeRDLMetaInfo.rowPage;
		var rdlNode = activeRDLMetaInfo.RDLNode;
		var rdlSource = activeRDLMetaInfo.RDLSource;	// D_crmConRecentWorkItems_Mobile_pa1460390496863pz.pxResults to D_crmConRecentWorkItems_Mobile_pa1460390496863pz
		rdlSource = rdlSource.split(".")[0]; 		
        var cc_rowPage = pega.ui.ClientCache.find(rowPage);	
        /* BUG-301892 Conditional Checks are being added because even the RDL is work object bound after edit details the api for check work object bound is returning false as a result client cache is being returned null hence adding null checks, also removed the templating check after the codereview */
        if(cc_rowPage){
            var resultProp = cc_rowPage.getName();		
        	resultProp = resultProp.substring(0,resultProp.indexOf("("));		
        	cc_rowPage.getParent().remove("$partialListProperty$"+resultProp);
        }
		var isOnlineWOBound = activeRDLMetaInfo.isOnlineWOBound;
      	var baseRowPage = pega.clientTools.find(rowPage);
		var baseRowPageJSON;
		if(baseRowPage)
			baseRowPageJSON = baseRowPage.getJSON();
		var pzInsKey;
		
		// BUG-320028: Copy row page from Standard to WorkProcessing for HC online also
		if(pega.mobile.isHybridClient && pega.u.d.ServerProxy.isDestinationRemote()) {
			// Though pega.u.d.getThreadName() would return "STANDATD", CC has already switched bcoz renderUI has called cc.init(WP).
			// TODO: Also applicable to HC offline?
			if(!baseRowPageJSON) {
				// Read directly from ChangeTracker
				var baseRowPageJSONObject = pega.ui.TemplateEngine.getValueFromChangeTracker(rowPage);
				if(baseRowPageJSONObject) {
					// pzInsKey = baseRowPageJSONObject["pzInsKey"];
					baseRowPageJSON = JSON.stringify(baseRowPageJSONObject);
				}
			}
		}
		
		if (isOnlineWOBound) {
      
      if(!pega.ctx.RDL.masterDetailsParams){
        pega.ctx.RDL.masterDetailsParams = {};
      }
			pega.ctx.RDL.masterDetailsParams.__RDLThreadSetup = false;
			pega.ctx.RDL.masterDetailsParams.__RDLWOThreadInitialized = true;
			var primaryThread = pega.u.d.baseThreadName;
			var qualifiedThreadName = primaryThread + "/" + this.RDL_MD_THREAD;
			//console.debug("<<<<<<<<<qualifiedThreadName>>>>>>>>>>>:"+qualifiedThreadName);
			//pega.u.d.switchThread(qualifiedThreadName);

			// HC - Offline
			if(pega.u.d.ServerProxy.isHybridClient()) {
				/* copy pxRequestor to workprocessing thread as it is used in getFromServer() method - START */
				var dummyDiv = document.createElement("div");
				dummyDiv.innerHTML = oResponse.responseText;
				pega.u.d.initChangeTracker(dummyDiv);
				oResponse.responseText = dummyDiv.innerHTML;

				pega.ui.updatePegaServerAvailability(1);
				/* END */
				/* BUG-268319: updatePegaServerAvailability always switches to base thread */
				pega.u.d.switchThread(qualifiedThreadName);
			}
			
			// Copy rowpage for HC
			if (pega.mobile.isHybridClient) {
				/* copy row page to new thread to make actions in primary details work - START */
				var splitStr = rowPage.split(".");
				/* BUG-285722: Initialize clientools with the work-processing threadname */
				pega.clientTools.init(qualifiedThreadName);
				var page = pega.clientTools.createPage(splitStr[0]);
				for (var i = 1; i < splitStr.length; i++) {
					page.put(splitStr[i], {});
					page = page.get(splitStr[i]);
				}
				page.adoptJSON(baseRowPageJSON);
			}

			// Invoke onActionComplete
			var pzInsKeyProp;
			if (baseRowPage)
				pzInsKeyProp = baseRowPage.get("pzInsKey");
			if (pzInsKeyProp)
				pzInsKey = pzInsKeyProp.getValue();
			if (pzInsKey) {
				var actionInfo = new SafeURL();
				actionInfo.put("pzInsKey", pzInsKey);
				actionInfo.put("api", "RDLShowDetails");
				actionInfo.put("rdl-source", rdlSource);
				pega.u.d.ServerProxy.onActionComplete(actionInfo.toURL());
			}
		}
		
        if(activeRDLMetaInfo.showDetailsNode){
			this.showDetailsFA(oResponse);          
        }
	},
    /* BUG-324470: Defining a pre-renderer to switchthread for RDL secondary details */
	showDetails_PreSuccess : function(oResponse){
      var strResponse = oResponse.responseText;

      if(!pega.u.d.baseThreadName){
        pega.u.d.baseThreadName = pega.u.d.getThreadName();
      }
      var dummyDiv = document.createElement("div");
      dummyDiv.innerHTML = strResponse;
      var MODAL_THREAD_NAME = pega.u.d.initChangeTracker(dummyDiv);
      dummyDiv.innerHTML = null;
      dummyDiv = undefined;      
      pega.u.d.switchThread(MODAL_THREAD_NAME);
      pega.ui.ClientCache.init(MODAL_THREAD_NAME);
    },	
	/*
	Display the FlowAction on the UI via loadDOMObject.
	*/
	/*Ignoring the following method as it requires DOM manipulation ans uses defined APIs*/
	showDetailsFA: /*istanbul ignore next*/ function(oResponse) {
		var detailsNode = this.getActiveRDLMetaInfo().showDetailsNode;
		var rdlContentPlaceholder$Node = detailsNode.querySelector("div[node_name='pyRDLRowDetailsPlaceHolderSection']");
    // If the secondary details div exists remove it
		var sec = detailsNode.querySelector(".secondarySection");
		if(sec) 
        sec.parentNode.removeChild(sec);
    
    // Create a fresh div for secondary section
		var secondarySectionContent = document.createElement("div");
    secondarySectionContent.className = "secondarySection hide";
    
    // Hide the place holder div
		rdlContentPlaceholder$Node.parentElement.appendChild(secondarySectionContent); /*BUG-373830: Used appendChild method instead of append to support IE */
		rdlContentPlaceholder$Node.className+=" hide";
    
    // Display the newly added secondary details div and load the response into it
		pega.ctx.dom.$(detailsNode).find("div.secondarySection").removeClass("hide");
		pega.u.d.loadDOMObject(secondarySectionContent, oResponse.responseText, function() {
			pega.u.d.loadHTMLEleCallback(secondarySectionContent);
          	pega.u.d.gBusyInd.hide();
		});
	},
  
    /*Ignoring the following method as it a wrapper API*/
    showErrorOnSecondaryFA: /*istanbul ignore next*/ function(errorMessage) {
        pega.ui.rdlMasterDetails.showDetailsFA({responseText: "<div class='layout-noheader-errors'><div class='dataValueRead'>" + errorMessage + "</div></div>"});
    },
    
    /*
	Calls the objOpenByHandle method.
	*/
    loadWorkObject: function(workHandle, loadWO_Success, loadWO_Failure){
         var options = {
           "priority": "client-first",
         }
         pega.clientTools.objOpenByHandle(workHandle, pega.ui.DataRepeaterUtils.getPackagedPageName(), loadWO_Success, loadWO_Failure, options);
    },
	 
    callProcessAction: function(options, event){
      var reloadElement = null;
      reloadElement = this.getActiveRDLMetaInfo().showDetailsNode;
      if(event.isOnlineWOBound){ // Desktop: WO bound RDL requires reloadElement to load the secondary FA in right context
        var detailsNode =  pega.ctx.dom.$("div.RDLShowDetails.open").get(0);
     	// Set the runtime context for the RDL Details div
        detailsNode.setAttribute("base_ref", "pyWorkPage");
        detailsNode.removeAttribute("full_base_ref");/* when base_ref is set explictly then remove full_base_ref attribute, otherwise getBaseref() will return one in full_base_ref(which is stale ) */
      }
      // Call processAction to display the flowaction in the masterdetail
      pega.u.d.processAction(options.taskStatus, "", "Rule-Obj-FlowAction", "", "", "masterdetail", event, "pzModalAction", null, reloadElement, null, "", null, options, false);
    },
  	 	
	/*Ignoring the following method as it deals with thread manipulation*/
	removeThread: /*istanbul ignore next*/ function(threadName) {
		if(!threadName)
			return;

		var primaryThread = pega.u.d.baseThreadName;
		var qualifiedThreadName = primaryThread + "/" + threadName;	
		// Switch to Primary Context
		pega.u.d.switchThread(primaryThread);

		var callbackObj = {
			success: function(responseObj) {
        // Delete thread related properties.
        delete pega.ctx.RDL.masterDetailsParams.__RDLWOThreadInitialized;
        delete pega.ctx.RDL.masterDetailsParams.__RDLThreadSetup;
              
				if(responseObj.responseText == "FAIL") {
					if(pega.ui.debug) 
						console.log("An error has occurred deleting thread " + qualifiedThreadName);
				}
			},
			
			failure: function(responseObj) {
				if(pega.ui.debug) 
					console.log("An error has occurred deleting thread " + qualifiedThreadName + ": " + responseObj);
			}
		};
		
		var pegaUD = pega.u.d;
		var oSafeURL = SafeURL_createFromURL(pega.u.d.url);
		oSafeURL.put("pyActivity","removeThead");
		oSafeURL.put("threadName", qualifiedThreadName);
		//pegaUD.asyncRequest('POST', oSafeURL, callbackObj);
		pega.util.Connect.asyncRequest('POST', oSafeURL.toURL(), callbackObj);
	},
	
	/*Ignoring the following method as it requires DOM manipulation ans uses defined APIs*/
	dismissRDLMasterDetail: /*istanbul ignore next*/ function(eventObject, jsonDesc) {
        if(pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen) {
            var srcElement = pega.util.Event.getTarget(eventObject);
            if(!srcElement)
                return;
            var RLNode = this.getActiveRDLMetaInfo() ? this.getActiveRDLMetaInfo().RDLNode : undefined;
            if(!RLNode)
                return;
            var parsedJSONArray = JSON.parse(jsonDesc);
            if(!parsedJSONArray)
                return;
            for(var i=0; i<parsedJSONArray.length; i++)	{
                var action = parsedJSONArray[i][0];
                if(this.RDLMDDismissibleActions.indexOf(action) !=-1) {
                    // Dismissible action
                    this.hideDetails(eventObject, true);
                    break;
                }
            }
        }
	},
  	
  	invokePostMasterDetailEdit: function(rowPage) {
      var DPName = rowPage.getReference();
      var reference = rowPage.getReference();
      if (reference.indexOf("D_") == 0 || reference.indexOf("Declare_") == 0) {
        	if(reference.indexOf(".") > 0) {
              DPName = reference.substring(0, reference.indexOf("."));
            }
        	if(pega.ui.ParametrizedDPUtils.isParametrizedDataPageInstance(rowPage.getReference())) {
              DPName = rowPage.getParent().get("pzPageNameBase").getValue();
            }
	  }
      if(DPName) {/* Invoke post master detail edit function */
        var postMasterDetailEditFn = window["postMasterDetailEdit$" + DPName];
        if(postMasterDetailEditFn && typeof postMasterDetailEditFn == 'function') {
          try {
            postMasterDetailEditFn(rowPage);
          } catch(e) {
            pega.clientTools.log("Error encountered while invoking post master detail edit function: " + "postMasterDetailEdit$" + DPName + "(). " + "Error: " + e.message);
          }
        }
      }
    }
	
};
//static-content-hash-trigger-GCC
pega.desktop.DataRepeater = {

  /*
  	Algorithm:
  	   Arguments: data-source, row context page JSON
  	1. Compute PL name from DS
  	2. Invoke appendPage activity
  	3. Refresh the layout
  */
  add: function (dataSource, rowPage) {
    // Step1: Get PL from DS
    // If No dataSource or pageJSON, return
    if (!dataSource || !rowPage) return;
    var dsObject = pega.ui.DataRepeaterUtils.getAbsoluteDataSourceFromDataSource(dataSource);
    dataSource = dsObject.dataSource;
    // No valid datasource found, quit
    if (!dataSource) return;

    /*BUG-197150: Getting all the RDLs with the same data-repeat-source*/
    var RLNodes = pega.ctx.dom.querySelectorAll("[data-repeat-source='" + dataSource + "']");

    var preActivity = "pzAddToDataRepeater";
    var preActivityParams = "PageListProperty=" + dataSource + "&PageName=" + rowPage;

    // Step3: Refresh section(s) and in preactivity add page to PL - Invoke appendPage activity
    //pega.u.d.reloadSection(RLNode, preActivity, preActivityParams, false, false, '', false);

    /*BUG-197150: Getting all the sections of all the RDLs for the call to reloadSections*/
    var sectionsToReload = [];
    for (var i = 0; i < RLNodes.length; i++) {
      sectionsToReload.push(pega.u.d.getSectionDiv(RLNodes[i]));
    }
    pega.u.d.reloadSections('', sectionsToReload, preActivity, preActivityParams, null, null, [], [], null, null);
  },

  /*
  	Algorithm:
  	   Arguments: eventObject
  	1. Get RL Node from eventObject
  	2. Compute PL name from eventObject
  	3. Invoke removePage activity
  	4. Refresh the layout
  */
  remove: function (event) {
    // Step1: Get RL Node from eventObject
    var srcElement = pega.util.Event.getTarget(event);
    var RLNode = pega.ui.rdlMasterDetails.getEnclosingRL(srcElement);

    // Step2: Get PL from eventObject
    var dsObject = pega.ui.DataRepeaterUtils.getAbsoluteDataSourceFromEvent(event);
    var dataSource = dsObject.dataSource;
    var rowIndex = dsObject.rowIndex;
    // No data source / row index found, quit
    if (!dataSource || !rowIndex) return;

    // Step3: Remove page at specified index from PL - Call removePage activity
    var preActivity = "pzRemoveFromDataRepeater";
    var preActivityParams = "PageListProperty=" + dataSource + "&Index=" + rowIndex;

    var dataSource = RLNode.getAttribute("data-repeat-source");

    /*BUG-197150: Getting all the RDLs with the same data-repeat-source*/
    var RLNodes = pega.ctx.dom.querySelectorAll("[data-repeat-source='" + dataSource + "']");

    // Step4: Refresh RL
    //pega.u.d.reloadSections(RLNodes, preActivity, preActivityParams, false, false, '', false);
    /*BUG-197150: Getting all the sections of all the RDLs for the call to reloadSections*/
    var sectionsToReload = [];
    for (var i = 0; i < RLNodes.length; i++) {
      sectionsToReload.push(pega.u.d.getSectionDiv(RLNodes[i]));
    }
    pega.u.d.reloadSections('', sectionsToReload, preActivity, preActivityParams, null, null, [], [], null, null);
  },
  // US-200634 Provide add button on layout group header for DLG changes
  addToRepeatSourceWithoutLA: function (event, datasource, position, rowClass, bSkipLocalAction, pageListProp) {
    var parentTab = pega.ctx.dom.$(event.target).closest(".content-layout-group");
    var urlObj = new SafeURL();
    /* url tampering */
    urlObj.put("pzActivity", "@baseclass.pzAddToRepeatSource");
    urlObj.put("pyActivity", "pzRunActionWrapper");
    urlObj.put("skipReturnResponse", "true");
    urlObj.put("pySubAction", "runAct");
    /* url tampering */
    urlObj.put("rowClass", rowClass);
    urlObj.put("datasource", pageListProp);
    urlObj.put("position", position);
    urlObj.put("listAction", "ADD");
    urlObj.put("pzPrimaryPageName", datasource.substring(0, datasource.lastIndexOf(".")));
    urlObj.put("bSkipLocalAction", bSkipLocalAction);

    var dlgDiv = pega.ctx.dom.$("[data-lg-repeatsource='" + datasource + "']");
    if (dlgDiv.length > 0) {
      pega.ctx.dom.$("[data-lg-repeatsource='" + datasource + "']").addClass("active");
      event.srcElement = pega.ctx.dom.$("[data-lg-repeatsource='" + datasource + "']");
      LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "ADD" + position);
      dlgDiv.append("<input type='hidden' name='addDeletePos' value='ADD" + position + "' />");
    } else {
      dlgDiv = pega.ctx.dom.$("[data-lg-repeatsource='" + pageListProp + "']");
      if (dlgDiv.length > 0) {
        pega.ctx.dom.$("[data-lg-repeatsource='" + pageListProp + "']").addClass("active");
        event.srcElement = pega.ctx.dom.$("[data-lg-repeatsource='" + pageListProp + "']");
        LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "ADD" + position);
        dlgDiv.append("<input type='hidden' name='addDeletePos' value='ADD" + position + "' />");
      }
    }
    clickedAddTabEvent = event;

    var divWrapperLG = pega.ctx.dom.$(parentTab).closest("div[data-repeat-id]");
    var tabIndName = divWrapperLG.attr("data-repeat-id");
    var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + tabIndName, divWrapperLG[0]);

    //Login to set the active tabindex to newly added tab
    var lastIndex = pega.ctx.dom.$(divWrapperLG).children("div[base_ref]").length;
    pega.ctx.dom.$(divWrapperLG).children("div[base_ref]").each(function () {
      if (pega.ctx.dom.$(this).attr("base_ref")) {
        lastIndex = pega.ctx.dom.$(this).attr("data-lg-child-id");
      }
    });
    lastIndex = parseInt(lastIndex) + 1;
    pega.ctx.dom.$("input[name='EXPANDED" + tabIndName + "']").val(lastIndex);

    pega.u.d.asyncRequest("POST", urlObj);

    /*BUG-350106 if datasource is property*/
    if (datasource && pageListProp && pageListProp.startsWith(".")) {
      pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList.push(datasource);
      // Remove from CDP
      pega.ui.TemplateEngine.invalidateDataSource(datasource);

      /* Update the pagination status */
      pega.desktop.DataRepeater.updatePaginationClass(datasource);
    } else if (pageListProp) {
      /* To trigger implicit refresh for data repeat add action */
      pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList.push(pageListProp);
      // Remove from CDP
      pega.ui.TemplateEngine.invalidateDataSource(pageListProp);

      /* Update the pagination status */
      pega.desktop.DataRepeater.updatePaginationClass(pageListProp);
    }
  },

  addToRepeatSourceUsingLA: function (event, datasource, position, localAction, templateName, rowClass, packagedPageName) {
    var urlObj = new SafeURL();
    urlObj.put("pyActivity", "@baseclass.pzAddToRepeatSource");
    urlObj.put("rowClass", rowClass);
    urlObj.put("datasource", datasource);
    urlObj.put("position", position);
    urlObj.put("listAction", "ADD");
    urlObj.put("pzPrimaryPageName", datasource.substring(0, datasource.lastIndexOf(".")));

    var options = {
      mTObjClass: rowClass,
      fAObjClass: rowClass,
      isLocalAction: "true",
      doNotRefresh: true,
      doNotSubmit: true,
      isAddingNewRow: true,
      cancelModalActivity: "pzDataRepeaterModalCancel",
      datasource: datasource,
      position: position
    };
    if (position === "INSERTFIRST") {
          pega.ui.RDL && pega.ui.RDL.getAndUpdateAllRDLsForPartialRefresh(datasource,true);
          
        }
    var dlgDiv = pega.ctx.dom.$("[data-lg-repeatsource='" + datasource + "']");
    if (dlgDiv.length > 0) {
      LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "ADD" + position);
      dlgDiv.append("<input type='hidden' name='addDeletePos' value='ADD" + position + "' />");
    }
    var callbackObj = {
      submit: function (oResponse) {
        if (pega.u.d.submitModalDlgParam) {
          pega.u.d.submitModalDlgParam.isAddingNewRow = false;
        }
        if (position === "INSERTFIRST") {
          /* Update entry handles post successful addition */
          pega.ui.DataRepeaterUtils.updateEntryHandles(datasource, "INSERT", 0);
          
          
        }

        if (datasource) {
          
          /* To trigger implicit refresh for data repeat add action */
          pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList.push(datasource);
          // Remove from CDP
          pega.ui.TemplateEngine.invalidateDataSource(datasource);
          if (position === "INSERTLAST") {
            var response = oResponse.responseText;
            pega.ui.RDL && pega.ui.RDL.appendRow(datasource, response);
          }
          /* Update the pagination status */
          pega.desktop.DataRepeater.updatePaginationClass(datasource);
        }
      },
      cancel: function () {
        if (dlgDiv.length > 0) {
          LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "");
        }
      }
    };

    pega.u.d.processAction(localAction, "", "Rule-Obj-FlowAction", "", "", true, event, templateName, urlObj, null, null, "", callbackObj, options, false);
  },

  removeFromRepeatSource: function (dsObject) {
    var actionURL = SafeURL_createFromURL(pega.u.d.url),
        datasource = dsObject.dataSource,
        rowIndex = dsObject.rowIndex,
        domIndex = dsObject.domIndex,
        sectionContext = dsObject.sectionContext;

    actionURL.put("pyActivity", "@baseclass.pzRemoveFromRepeatSource");
    actionURL.put("PageListProperty", datasource);
    actionURL.put("Index", rowIndex);
    actionURL.put("listAction", "DELETE");
    actionURL.put("pzPrimaryPageName", datasource + "(" + rowIndex + ")");
    actionURL.put("postActivityContext", sectionContext);
    
    pega.ui.RDL && pega.ui.RDL.getAndUpdateAllRDLsForPartialRefresh(datasource,true);
    
    var dlgDiv = pega.ctx.dom.$("[data-lg-repeatsource='" + datasource + "']");
    if (dlgDiv.length > 0) {
      dlgDiv.append("<input type='hidden' name='addDeletePos' value='DEL" + rowIndex + "' />");

      LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "DEL" + rowIndex);

      var tabIndName = pega.ctx.dom.$(dlgDiv[0]).attr("data-repeat-id");
      var nTabLength = pega.ctx.dom.$("input[name='EXPANDED" + tabIndName + "']").val();
      nTabLength = !!parseInt(nTabLength) ? parseInt(nTabLength) : '';
      var activeElement = LayoutGroupModule.getActiveTabElement(dlgDiv);
      var isLastNode = activeElement && activeElement.parent() && activeElement.parent().next() && activeElement.parent().next().hasClass("layout") ? false : true;
      if (isLastNode) {
        pega.ctx.dom.$("input[name='EXPANDED" + tabIndName + "']").val(rowIndex - 1);
      }
    }

    var callbackObj = {
      success: function (responseObj) {
        if (datasource) {
          /* To trigger implicit refresh for data repeat delete action */
          pega.ui.DataRepeaterUtils.updateEntryHandles(datasource, "DELETE", domIndex);
          var errors = pega.u.d.handleErrorAfterPartialSuccess(responseObj);
          if (!errors) {
            pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList.push(datasource);
            // Remove from CDP
            pega.ui.TemplateEngine.invalidateDataSource(datasource);
            /* Update the pagination status */
            pega.desktop.DataRepeater.updatePaginationClass(datasource);
          }
        }
      },
      failure: function () {
        if (dlgDiv.length > 0) {
          dlgDiv.remove("[name='addDeletePos']");
          LayoutGroupModule.setLayoutActiveIndex(dlgDiv, "");
        }
      },
      argument: [""]
    };

    pega.u.d.asyncRequest("POST", actionURL, callbackObj);
  },

  updatePaginationClass: function (datasource) {
    var classUpdater = function (index, rdlNode) {
      var pyUniqueID = rdlNode.getAttribute("data-uniqueid");
      if (pyUniqueID && pega.ctx.RDL && pega.ctx.RDL.map && pega.ctx.RDL.map[pyUniqueID]) {
        var paginationClass = pega.ctx.RDL.map[pyUniqueID]["paginationClass"];
        if (paginationClass) {
          pega.ctx.dom.$(rdlNode).addClass(paginationClass);
        }
      }
    };
    pega.ctx.dom.$("[data-repeat-source='" + datasource + "']").each(classUpdater);
  },

  /*
  	loadMoreData
  	API: Appends more data rows fetched from server using startIndex and endIndex
  	*/
  loadMoreData: function (event) {
    var targetNode = pega.util.Event.getTarget(event);
    var paginatorGadget = pega.ctx.dom.$(targetNode).closest(".RDLPaginator").get(0);
    // setting flag when load more triggered
    if(pega.ui.RDL) {
      pega.ui.RDL.focusNewRow = false;
    }
    if(!paginatorGadget){
      paginatorGadget = pega.ctx.dom.$(event.target).closest("div.rdl-paginatorsection");
      var RDLNode = pega.ctx.dom.$(paginatorGadget).siblings("div[data-repeat-source]").get(0);
      var pageSize = parseInt(RDLNode.getAttribute("data-pagesize"));
      var startIndex = pega.ui.template.pzRDLTemplate.loadPage(pega.ui.RDL.getNextRowIndex(RDLNode), pageSize, RDLNode, event);
      return;
    }
    if(pega.u.d.ServerProxy.isDestinationRemote()){
      var methodName = paginatorGadget.getAttribute("data-methodname");
      var sectionName = pega.u.d.getSectionDiv(paginatorGadget).getAttribute("node_name");
      var RDLNode = pega.ctx.dom.$(paginatorGadget).siblings("div[data-repeat-source]").get(0);
      var listSource = RDLNode.getAttribute("data-repeat-source");
      var baseReference = pega.u.d.getBaseRef(RDLNode);

      // Read pagination config
      var startIndex, endIndex, pageSize;
      var paginationConfig = paginatorGadget.getAttribute("data-pagination-config");
      if (paginationConfig) {
        paginationConfig = JSON.parse(paginationConfig);
        if (paginationConfig.listPaginationMode == "Progressive") {
          startIndex = parseInt(paginationConfig.listStartIndex, 10);
          // BUG-223472: Compute startIndex on client to account for deletion
          //startIndex = RDLNode.children.length + 1;
          pageSize = parseInt(paginationConfig.listPageSize, 10);
          endIndex = startIndex + pageSize - 1;
        }
      }

      var callbackObj = {
        success: function (responseObj) {
          // If no results, hide load More section
          if (responseObj.responseText == "NO_MORE_RESULTS" || responseObj.responseText == "ERROR_FETCHING_RESULTS") {
            paginatorGadget.style.display = "none";
            return;
          }

          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = responseObj.responseText;

          /*BUG-304939 : Remove the AJAXCT div from response as it is already processed*/
          var lastEleId = tempDiv.lastElementChild.getAttribute("id");
          if (lastEleId && lastEleId.toUpperCase().startsWith("AJAXCT")) {
            tempDiv.removeChild(tempDiv.lastElementChild);
          }
          var len = tempDiv.children.length;
          for (var i = 0; i < len; i++) {
            //RDLNode.appendChild(tempDiv.children[0]);
            pega.u.d.loadDOMObject(RDLNode, tempDiv.children[i].outerHTML, null, { domAction: "append", domElement: RDLNode });
          }

          if (paginationConfig) {
            // Compute the new startIndex
            paginationConfig.listStartIndex = endIndex + 1;
            // Save the new values
            paginatorGadget.setAttribute("data-pagination-config", JSON.stringify(paginationConfig));
            //Hide the pagination gadget if no of rows received is less than pageSize
            if (len < pageSize) {
              paginatorGadget.style.display = "none";
            }
          }
        },

        failure: function (responseObj) {
          if (pega.ui.debug) console.log("pega.desktop.DataRepeater.loadMoreData: An error occurred while retrieveing data from Server.");
        }
      };

      // Call pzdoRDLAction activity
      var oSafeURL = SafeURL_createFromURL(pega.u.d.url);
      oSafeURL.put("pyActivity", "pzdoRDLAction");
      oSafeURL.put("baseref", baseReference);
      oSafeURL.put("pyCallStreamMethod", methodName);
      oSafeURL.put("StreamName", sectionName);
      oSafeURL.put("StreamClass", "Rule-HTML-Section");
      oSafeURL.put("listAction", "PAGINATE");
      oSafeURL.put("listPaginationMode", "Progressive");
      oSafeURL.put("listSource", listSource);
      if (startIndex) oSafeURL.put("listStartIndex", startIndex);
      if (endIndex) oSafeURL.put("listEndIndex", endIndex);
      if (pageSize) oSafeURL.put("listPageSize", pageSize);
      pega.u.d.asyncRequest("GET", oSafeURL, callbackObj);
    }

  }
};
//static-content-hash-trigger-GCC
pega.ui.template.DataRepeater.Actions = (function() {
  var _clean = function(object) {
    object.domNode = null;
    object.rowNode = null;
  };
 
  var _doListAction = function() {
    var drUtils = pega.ui.DataRepeaterUtils;
    var event = arguments[0];
    var layoutType = drUtils.getLayoutType(event);
    
    //Currently applicable when the actions are ADDITEM/REFRESHLIST
    if(Array.isArray(arguments[1]) && Array.isArray(arguments[2])){
       if(layoutType === "grid"){
         arguments = [event].concat(arguments[2]); //arguments[2] for old grid from action generation
       }
       else{
         arguments = [event].concat(arguments[1]); //arguments[1] for template grid from action generation
       }
    }
    
    /*In case where layout information is not available(section include, nested menus), 
      check the layout type and route the action to old grid */
    if(layoutType === "grid" || (!layoutType && event["cachedGridObj"])){
      nonTemplateGridAction(arguments);
      return;
    } 
    var action = arguments[1];  
    var layoutInfo = null;
    var offlineSupports = false;
    if(pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) { //offline mode
       if(action == pega.ui.tGridConstants.GRID_PAGINATE_ACTION ||
         action == pega.ui.tGridConstants.GRID_SORT_ACTION ||
         action == "REFRESHLIST" || 
         action == "SETFOCUS"){
         offlineSupports = true;
       }
     }else {
       offlineSupports = true;
     }
     if(!offlineSupports){
       alert('This feature is not supported in offline mode');
       return;
     }
    
    if(action.toUpperCase() == "SETFOCUS") {
      layoutInfo = arguments[arguments.length - 1];
      if(!layoutInfo) {/* If setFocus action is configured on a control in a grid cell then layoutInfo will be null. So get it from getClosestRepeatLayoutInfo() */
        layoutInfo = drUtils.getClosestRepeatLayoutInfo(event, true);
      }
    }else if(action.toUpperCase() == "ADDITEM" || action.toUpperCase() == "REFRESHLIST") {
      layoutInfo = drUtils.getClosestRepeatLayoutInfo(event, true);
      if(!layoutInfo) {
        layoutInfo = {};
        layoutInfo.type = drUtils.TEMPLATE_GRID;
      }
    }
    else {
      layoutInfo = drUtils.getClosestRepeatLayoutInfo(event, true);
    }
    
    if(!layoutInfo) {
      return;
    }
    
    if(layoutInfo.rowNode && layoutInfo.rowNode.className.match("cat-row")){
      pega.ui.logger.LogHelper.debug("Grid actions are not suported for categorised rows") 
      return ;
    }
    switch(layoutInfo.type) {
      case drUtils.TEMPLATE_GRID:
        switch(action.toUpperCase()) {
          case "SETFOCUS":
            var position = arguments[3];
            pega.ui.TemplateGrids.focusRow(position, layoutInfo);
            _clean(layoutInfo);
            break;
          case "EDITITEM":
            pega.ui.TemplateGrids.editrow(event, layoutInfo);
            break;
          case "DELETEITEM":
            var showConfirmBox = arguments[2];
            pega.ui.TemplateGrids.deleterow(event, layoutInfo, showConfirmBox);
            break;
          case "ADDITEM":
            var source = arguments[2]||"";
            var position = arguments[3]||"";
            var flowActionName = arguments[4]||"";
            var templateName = arguments[5]||"";
            var skipModal = arguments[6]||"false";
            var pyDataTransform = arguments[7]||"pyDefault";
            var argList = {
              event : event,
              layoutInfo : layoutInfo,
              source : source,
              position :position,
              flowActionName : flowActionName,
              templateName : templateName,
              skipModal : skipModal,
              pyDataTransform : pyDataTransform
            }
            pega.ui.TemplateGrids.composeRow(argList);            
            break;
          case "REFRESHLIST":
            var source = arguments[2]||""; //get the data page 
             if(pega.ui.TemplateGrids){//Adding checking as user may configure refresh grid even without Template Grid on the page
              pega.ui.TemplateGrids.refreshList(event,source,layoutInfo);
             }
            break;
          case "FLOWACTION":
            var flowActionName = arguments[2]||"";
            var templateName = arguments[3]["templateName"]||"";
            var paramURL = new SafeURL();
            paramURL.put("pzHarnessID",pega.ctx.pzHarnessID);
            paramURL.put("BaseReference", layoutInfo.rowRef);
            paramURL.put("InterestPage", layoutInfo.rowRef);
            if(pega.ui.TemplateGrids){
                pega.ui.TemplateGrids.performOpenLocalAction(event,layoutInfo, flowActionName, templateName, paramURL);
            }
            break;
        }
        break;
    }
  };
 
  /* For actions SETFOCUS, ADDITEM, REFRESHLIST, FLOWACTION, bifurcation(oldgrid/templategrid) is from doList function
     For actions EDITITEM, DELETEITEM, bifurcation is from removeFromRepeatSource, editRepeatItem functions */
  function nonTemplateGridAction(args){
    var action = args[1];
    if(!pega.ui.grid || !window.doGridAction){
       return;
    }
    if(action === "FLOWACTION"){
       var params = args[3];
       if(params.overrideTemplate === "false"){
         params.templateName = "pyGridModalTemplate";
       }
    }
    doGridAction.apply(null, args);
  }
  
  return {
    doListAction: _doListAction
  };
})();
//static-content-hash-trigger-GCC
pega.namespace("pega.ui.pdf");

$.extend(pega.ui.pdf, (function() {
	var fileEntries = [];
  
    // opens PDF file in PIMC, using Document Store interface
	var openPDFInPIMC = function(applicationName, pdfName) {
		var pdfHandle = applicationName + "/" + pdfName + ".pdf";
    pega.mobile.sdk.plugins.clientstore.getItems([{type:"APP-RESOURCE", handle:pdfHandle}])
      .then(function(result){
        if(result[0] && result[0].url) {  
          pega.mobile.sdk.plugins.documents.preview(result[0].url)
        } else {
          console.error("Cannot find pdf with handle " + pdfHandle);
        }
    });
	}

	// opens PDF file in the hybrid client, using app cache manifest and local storage 
	var openPDFInHC = function(applicationName, pdfName, useQuickLook) {
		var pdfUrl = applicationName + "/" + pdfName + ".pdf";
		var pdfFileName = pdfName + ".pdf";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", pdfUrl, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status == 200) {
				pega.u.d.setBusyIndicator(null, true);
				var blob = new Blob([this.response], {type: 'application/pdf'});
				// can not use the url because of the "/"
				openFileAsBlob(blob, pdfFileName, useQuickLook);
			}
		}
		xhr.send();
	};

	var openFileAsBlob = function(blob, fileName, useQuickLook) {

		// have a local copy, just display
		if (fileEntries[fileName]) {
			var fileEntryUrl;
			try {
				// will raise exception if not valid
				fileEntryUrl = fileEntries[fileName].toURL();
       if (window.launchbox.DocumentViewer){
				pega.u.d.gBusyInd.hide();
				window.launchbox.DocumentViewer.open(fileEntryUrl, {preview: useQuickLook}, {
					onSuccess: function() {},
					onFailure: function() {
						// url might be stale, becasue we were successful with this url before
						pega.u.d.setBusyIndicator(null, true);

						// otherwise, get from file system
						window.requestFileSystem(window.TEMPORARY | window.LocalFileSystem.SHARED_AMONG_USERS | window.LocalFileSystem.SHARED_AMONG_APPS, 50 * 1024 * 1024, function(fs) {
							fs.root.getFile(fileName, {create: true}, function(fileEntry) {
								fileEntry.createWriter(function(fileWriter) {
									fileWriter.onwriteend = function() {
										pega.u.d.gBusyInd.hide();
										// store as a local copy
										fileEntries[fileName] = fileEntry;
										window.launchbox.DocumentViewer.open(fileEntry.toURL(), {preview: useQuickLook}, {onSuccess: function() {}, onFailure: function() {}});
									};
									fileWriter.onerror = function(e) {
										pega.u.d.gBusyInd.hide();
										alert('Write failed with error: ' + e.toString());
									};
									fileWriter.write(blob);
								});
							});
						});
					}
				});
       } else{
         console.log("DocumentViewer is not present in window.launchbox.DocumentViewer");
       }
			} catch (e) {
				// otherwise, get from file system, because fileEntry is bad
				window.requestFileSystem(window.TEMPORARY | window.LocalFileSystem.SHARED_AMONG_USERS | window.LocalFileSystem.SHARED_AMONG_APPS, 50 * 1024 * 1024, function(fs) {
					fs.root.getFile(fileName, {create: true}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {
							fileWriter.onwriteend = function() {
								pega.u.d.gBusyInd.hide();
								// store as a local copy
								fileEntries[fileName] = fileEntry;
								window.launchbox.DocumentViewer.open(fileEntry.toURL(), {preview: useQuickLook}, {onSuccess: function() {}, onFailure: function() {}});
							};
							fileWriter.onerror = function(e) {
								pega.u.d.gBusyInd.hide();
								alert('Write failed with error: ' + e.toString());
							};
							fileWriter.write(blob);
						});
					});
				});
			}
		} else {
			// otherwise, get from file system, fileEntry cached
			window.requestFileSystem(window.TEMPORARY | window.LocalFileSystem.SHARED_AMONG_USERS | window.LocalFileSystem.SHARED_AMONG_APPS, 50 * 1024 * 1024, function(fs) {
				fs.root.getFile(fileName, {create: true}, function(fileEntry) {
					fileEntry.createWriter(function(fileWriter) {
						fileWriter.onwriteend = function() {
							pega.u.d.gBusyInd.hide();
							// store as a local copy
							fileEntries[fileName] = fileEntry;
							window.launchbox.DocumentViewer.open(fileEntry.toURL(), {preview: useQuickLook}, {onSuccess: function() {}, onFailure: function() {}});
						};
						fileWriter.onerror = function(e) {

							pega.u.d.gBusyInd.hide();
							alert('Write failed with error: ' + e.toString());
						};
						fileWriter.write(blob);
					});
				});
			});
		}
	};

    /*
    This API will download the files without 
    any new window popup for chrome and FF, for all 
    others browsers, it will open the new window to download.
    Changes are done as part of the user story ,US-155125- PDF viewer support in Client for Windows
    and related mesh document available in https://mesh.pega.com/docs/DOC-117254
    */
	var openPDFInWindow = function(applicationName, pdfName) {
		var sPdfUrl = applicationName + "/" + pdfName + ".pdf";
		var oSafeUrl = new SafeURL();
		var sUrl = oSafeUrl.toURL() + "/" + sPdfUrl;
		var sTitle = pdfName + ".pdf";
		var aTag = document.createElement('a');
		if ("download" in aTag) {
			$(aTag).attr({
				"href": sUrl,
				"target": "_target",
				"download": sTitle,
			}).hide().appendTo("body").on("click", function() {
				$(this).remove();
			});
			// Using dispatchEvent since jquery is preventing the native click events
			aTag.dispatchEvent(new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			}));
			if (!navigator.mozGetUserMedia)
				window.URL.revokeObjectURL(aTag.href);
		} else {
			openUrlInWindow(sUrl, sTitle);
		}
	};

	return {
		// function to view PDF file, both on desktop and mobile
		// applicationName - application name of R-F-Binary file (usually webwb)
		// pdfName - name of pdf (without pdf extension, this is assumed)
		view: function(applicationName, pdfName) {
			// if offline, the mobile device
			if (pega.mobile.isHybridClient) {
				openPDFInHC(applicationName, pdfName, true);
      } else if (pega.mobile.sdk) {
        openPDFInPIMC(applicationName, pdfName);
			} else {
				openPDFInWindow(applicationName, pdfName);
			}
		}
	}
})());
//static-content-hash-trigger-GCC
var harnessSizing = {
	SCROLL_ADJUSTMENT : 20,
	gCurrTotalHeight: 0,
	gDoGadgetResize: false,
	callResizeHarness:true,
	topGutter : "0px 0px 0px 0px",
	leftGutter : "0px 5px 0px 0px",
	rightGutter : "0px 0px 0px 6px",
	bottomGutter : "0px 0px 0px 0px",
	isCollapsed: 0,
	resizeTimeoutId: null,
	resizingHarness : false, /*set to true for the duration when doHarnessResizeActual is executing*/
	stretchHarness : false, /*when set to true, harness opened inside workarea gadget will fill entire space avaialable in panel*/

	/*
	@Public - internally invoked everytime when harness size changes. Controls can invoke this function to notify the harness when the control is resized.
	@param
	@return $void$
	*/
	resizeHarness: function(){
		/*When called from doOnceOnInit, we know that we are calling it at the end. So, execute it immediately. Else, do a setTimeout of 1ms.*/
		if(pega.u.d.executeResizeHarness && pega.u.d.executeResizeHarness==true) {
			pega.u.d.resizeHarnessActual();
		}else {
      clearTimeout(pega.u.d.resizeHarnessTimeoutId);
      pega.u.d.resizeHarnessTimeoutId = setTimeout(function(){
        pega.ui.statetracking.setBusy("harnessSizing.resizeHarness");
        pega.u.d.resizeHarnessActual();
        pega.ui.statetracking.setDone();
      }, 1);
		}
	},

	resizeHarnessActual: function(){
		if(pega.u.d.bModalDialogOpen && pega.u.d.bResizeModalDlg){
			pega.u.d.resizeModalDialog();
		}
      
      	if (typeof this.resizeAccordion === "function") {
			this.resizeAccordion();
        }
      
		if ((document.forms[0] != null) && (document.forms[0].name=="actionForm") && !pega.u.d.bModalDialogOpen){ /*The resizeActionIframe is called from resizeModalDialog api */
			this.resizeActionIFrame(false);
		}
		this.resizeHarnessCallback();
	},

	/* @api - Returns the height of the harness document
	   @param ignoreSetHeight, this will avoid setting harness height.
				Main usecase for this is in DC size to content case no need to fix button bar.
	   @return height
	*/
	getDocumentHeight: function(ignoreSetHeight) {
		try {
			if(window.frameElement != null && typeof(window.frameElement.PegaWebGadget) != "undefined") {
				var hcDiv = document.getElementById("HARNESS_CONTENT");
				var hbDiv = document.getElementById("HARNESS_BUTTONS");
				var hbHeight = 0;
				if(hbDiv && (hbDiv.getElementsByTagName("button").length > 0 || (hbDiv.hasChildNodes() && hbDiv.children[0].id=="HarnessFooter")) ) {
					hbHeight = hbDiv.offsetHeight;
				}

				if(typeof(window.parent.pega) != "undefined" && typeof(window.parent.pega.u) != "undefined" && typeof(window.parent.pega.u.d) != "undefined" && window.parent.pega.u.d.isPortal()) {
					if(ignoreSetHeight !== true && (this.stretchHarness || (pega.u.d.keepFixedVisible == "true" && hbDiv && ( (hbDiv.getElementsByTagName("button") && hbDiv.getElementsByTagName("button").length > 0) || (hbDiv.hasChildNodes() && hbDiv.children[0].id=="HarnessFooter") )  ))) {
						return  pega.u.d.setHarnessHeight();
					} else {
						/* below setting is needed to get scrollheight correctly */
						hcDiv.style.overflow = "auto";
						/* Setting height to auto is needed to not avoid fixing button bar in this case */
						if(hbDiv && ignoreSetHeight) {
							hcDiv.style.height = "auto";
						}

						var scrollHT=(pega.u.d.getDivScrollHeight(hcDiv)+hbHeight);
						/* style is set to hidden bcos if fixed button bar doesnt exist the scrollbar
						 will be to the  harnessview tab container not to the harnesscontent div*/
						hcDiv.style.overflow = "visible";
						return scrollHT;
					}
				} else {
					var scrollAdj = 0;
					if(hbDiv) {
						hcDiv.style.overflow = "auto";
						hcDiv.style.height = "auto";
					}
					if( pega.u.d.getDivScrollHeight(hcDiv)> hcDiv.offsetHeight){
						return (pega.u.d.getDivScrollHeight(hcDiv)+hbHeight);
					}else{
						return (hcDiv.offsetHeight+hbHeight);
					}
				}
			} else {
				if(pega.util.Event.isIE || pega.util.Event.isSafari) {
					return document.body.offsetHeight;
				} else {
					/*FF is not giving offsetHeight properly*/
					return document.body.clientHeight;
				}
			}

		}catch(e) {
			return document.body ? document.body.offsetHeight : 0;
		}
	},

	/* @api - Returns the width of the harness document
	   @return height
	*/
	getDocumentWidth : function(bIncludeScrollBarWidth) {
		var hcDiv = document.getElementById("HARNESS_CONTENT");
		if(pega.u.d.keepFixedVisible == "true") {
			if(bIncludeScrollBarWidth === true) {
				return parseInt(document.body.offsetWidth);
			}
			return parseInt(document.body.scrollWidth);
		} else if(hcDiv){
			return parseInt(hcDiv.scrollWidth);
		} else {
			return parseInt(document.body.scrollWidth);
		}
	},

	/* @api - Returns total height required for harness without scroll bar
	   @return height
	*/
	getTotalHeight : function() {
		var hbDiv = document.getElementById("HARNESS_BUTTONS");
		var hcDiv = document.getElementById("HARNESS_CONTENT");
    var hbHeight = 0;
        
 		if(hbDiv) {
			hbHeight = hbDiv.offsetHeight;
		}
		if(hcDiv){
			hcDiv.style.overflow = "auto";
			return (pega.u.d.getDivScrollHeight(hcDiv)+hbHeight);
		}else {/*if there is no harness content div, return scrollHeight*/
			return document.body.scrollHeight;
		}
	},

	getDivScrollHeight: function(divElement,addAdj) {

		var divScrollHeight = 0;
		var isGecko = (pega.env.ua.gecko > 0);

			var elOverflow = divElement.style.overflow;
			var isOverflowVisible = (elOverflow == "" || elOverflow == "visible");
			// If overflow value is default then Mozilla returns scrollHeight as clientHeight.
			// So overflow should be set to non-default value to get proper scrollHeight in Mozilla.
			if(isGecko && isOverflowVisible) {
				divElement.style.overflow = "hidden";
			}
			divScrollHeight = divElement.scrollHeight;
			if(isGecko && isOverflowVisible) {
				divElement.style.overflow = elOverflow;
			}
			if(addAdj && divElement.scrollWidth > divElement.offsetWidth) {
				divScrollHeight = divScrollHeight+pega.u.d.SCROLL_ADJUSTMENT;
			}
		return divScrollHeight;
	},

	setHarnessHeight: function () {
		try {
			   if (window.frameElement != null && typeof (window.frameElement.PegaWebGadget) != "undefined") {

			var hbDiv = document.getElementById("HARNESS_BUTTONS");
				var hcDiv = document.getElementById("HARNESS_CONTENT");

		var hbHeight;
		if (!hbDiv)
			hbHeight = 0;
		else
			hbHeight = document.getElementById("HARNESS_BUTTONS").offsetHeight;

		if (typeof (window.parent.pega.u.d) != "undefined" && window.parent.pega.u.d.isPortal()) {
			if (parseInt(window.frameElement.offsetHeight) == 0 && (!pega.util.Event.isSafari || window.frameElement.height != "100%")) {
				return;
			}

			var panel = pega.u.d.getPanelDiv();
			if(!panel) return;
			var sectionDiv = panel.getElementsByTagName("DIV");

			var sectionDivLen = sectionDiv.length;
			var index = 0;
			for (var i = 0; i < sectionDivLen; i++) {
				if (sectionDiv[i].id === "RULE_KEY") {
					index = i;
					break;
				}
			}
			var panelSectionHeight = sectionDiv[index].offsetHeight;

			var extraHeight = 0;
			var remainingContentHt = panelSectionHeight - window.frameElement.offsetHeight;
			var panelParentNode = panel.parentNode;
			var panelHt = parseInt(panelParentNode.clientHeight);

			//BUG-37963 - Start
			var computedStyle;
			var vrtclPadding;
			if (panelParentNode.currentStyle){
				computedStyle = panelParentNode.currentStyle;
				vrtclPadding = parseInt(computedStyle['paddingTop']) + parseInt(computedStyle['paddingBottom']);
			}else{
				computedStyle = window.getComputedStyle(panelParentNode,null);
				vrtclPadding = parseInt(computedStyle.getPropertyValue('padding-top')) + parseInt(computedStyle.getPropertyValue('padding-bottom'));
			}
			//BUG-37963 - End

			if (remainingContentHt > 0 && (panelHt - remainingContentHt) > 0) {
				//BUG-37963 - Commenting the following line as '15' shouldn't be hardcoded.
				//return (panelHt - remainingContentHt - 15);
				return (panelHt - remainingContentHt - vrtclPadding);
			} else if (remainingContentHt == 0) {
				//BUG-37963 - Commenting the following line as '15' shouldn't be hardcoded.
				//return (panelHt - 15);
				return (panelHt - vrtclPadding);
			} else {
				return window.frameElement.offsetHeight;
			}
		}
		}
		} catch (e) {

		}
	},

	/*
	@Private - callback for harness resizing event
	@param
	@return $void$
	*/
	resizeHarnessCallback:function(){
		// If running under pega composite manager allow it to resize the iframe inside gadget div.
		try {
			this.invokeResizeCallbacks(this.resizeFunctions);
			if (bActionIframe) {
				this.invokeResizeCallbacks(parent.pega.u.d.resizeFunctions);
			}
		} catch(e) {}

		if(document.compatMode!=="CSS1Compat"){ /*BUG-117897 Check for Quirks Mode*/
			try{
				this.handleQuirksAdjustments();
			}catch(jsEx){/*NO_ACTION*/}
		}
	},

	handleQuirksAdjustments:function(){ /* BUG-117897 */
		if(navigator.userAgent.indexOf("MSIE 8")!=-1){
			var repeatContainerElems=document.body.getElementsByTagName("table");
			for(var j=0;j<repeatContainerElems.length;j++){
				/*BUG-123665 - avoided excecuting this hack when grid is present inside row/column-repeat*/
				var gridContDiv = pega.util.Dom.getElementsById("PEGA_GRID_CONTENT",repeatContainerElems[j]);
				if((!(gridContDiv && gridContDiv[0]))&& repeatContainerElems[j].className && (repeatContainerElems[j].className.indexOf("repeatReadOnlyRowColRepeat")!=-1 || repeatContainerElems[j].className.indexOf("repeatReadWriteRowColRepeat")!=-1)){
					var allth=repeatContainerElems[j].getElementsByTagName("th");
					for(var i=0;i<allth.length;i++){
						var delem=allth[i].getElementsByTagName("div");
						if(delem && delem.length>0 && delem[0].parentNode==allth[i]){
							delem[0].style.width=delem[0].parentNode.offsetWidth+"px";
						}
					}
				}
			}
		}
	},
	/*
	@Private - Invoke callback for resize
	@param $Array with Resize Functions
	@return $void$
	*/
	invokeResizeCallbacks:function(arrCallbacks){

		// If running under pega composite manager allow it to resize the iframe inside gadget div.
		try {
			for(var i=0; i<arrCallbacks.length;i++){

				var resizeFunction = arrCallbacks[i];
				try{resizeFunction();} catch(e) {} /*wrappped in try catch so that even if one call fails the rest in the array will still be invoked*/
			}
		} catch(e) {}
	},

	/*
	 @protected Shrinks the display to fit into the clientHeight of the window.
	 @return $void$
	*/
	shrinkToFit: function() {
		var clientHeight = parseInt(document.body.clientHeight);
		var scrollHeight = parseInt(document.body.scrollHeight);
		var scrollWidth = parseInt(document.body.scrollWidth);
		var clientWidth = parseInt(document.body.clientWidth);
		var ratio = 1.0;

		if (scrollHeight > clientHeight) {
			ratio =  clientHeight/scrollHeight;
		}

		if (scrollWidth > clientWidth) {

			var widthRatio = clientWidth / scrollWidth;

			if (widthRatio < ratio) {
				ratio = widthRatio;
			}
		}

		//document.body.style.zoom = ratio;
		pega.util.Dom.setStyle(document.body,'zoom',ratio);

		document.body.style.visibility = "inherit";
	},

	/* @Handler
	@private doHarnessResize - acts as proxy to actual code to resize harness using doHarnessResizeActual function;
		while the html body resizes, IE and Safari triggers resize event multiple times within span of few milliseconds.
		Ensured that actual resizing is done only if no resize event has been triggered in last 10 milliseconds.
	@return $void$
	*/
	doHarnessResize: function() {
		if(pega.u.d.resizingHarness) {
			/* harness is already being resized */
			return;
		}
		if(pega.util.Event.isIE || pega.util.Event.isSafari || pega.Mashup) {
			clearTimeout(pega.u.d.resizeTimeoutId);
			pega.u.d.resizeTimeoutId = setTimeout(pega.u.d.doHarnessResizeActual, 10);
		}
		else
			pega.u.d.doHarnessResizeActual();
	},

    mashupResizeHandler: function(){
      clearTimeout(pega.u.d.mashupResizeHandler.resizeTimer);
      pega.u.d.mashupResizeHandler.resizeTimer = setTimeout(pega.u.d.postMashupHeight, 100);
    },

  postMashupHeight: function(){
   // BUG-492341 added !window.opener to skip the harness resize of parent on resizing child.
    if(pega && pega.Mashup && !window.opener) {

      var hcDiv = document.getElementById("HARNESS_CONTENT");
      if (!hcDiv) {
        return;
      }
      var height = 0;
      if(hcDiv.classList.contains("harness-content-workarea-view")){
        var childNodes = hcDiv.childNodes;
        for(var i=0,l=childNodes.length;i<l;i++){
          if(childNodes[i].nodeType == 1){
            if (childNodes[i].nodeName === "HEADER" || childNodes[i].nodeName === "FOOTER") continue;
            if(childNodes[i].classList.contains("workarea-view-scroll-wrapper")){
              var workAreaViewScrollWrapperDiv = childNodes[i];
              var section = workAreaViewScrollWrapperDiv.getElementsByTagName("section")[0];
              //BUG-788211 - Empty space in mashup after deleting table rows
              workAreaViewScrollWrapperDiv.style.flex = "0 1 auto";
//INC-183672 - Setting section height as auto in case of mashups, since in case of iframes,section height is getting considered as iframe height.Overriding css height of 100vh for mashups
              section.style.height='auto';
//INC-238781 - Passing workAreaViewScrollWrapperDiv to getOuterHeight instead of section to get the actual iframe height, because the getOuterHeight method is not returning the actual height of iframe because of extran margin spaces not calculating in within section.
              height += pega.u.d.getOuterHeight(workAreaViewScrollWrapperDiv, "scroll");
            }else{
              height += childNodes[i].scrollHeight;
            }
          }
        }
      } else if(hcDiv){
        height = hcDiv.scrollHeight;
      }

      var hbDiv = document.getElementById("HARNESS_BUTTONS");
      if(hbDiv && (hbDiv.getElementsByTagName("button").length > 0 || (hbDiv.hasChildNodes() && hbDiv.children[0].id=="HarnessFooter")) ) {
        height += hbDiv.offsetHeight;
      }
      if($('header').outerHeight()){
        height += $('header').outerHeight();
      }
      if($('footer').outerHeight()){
        height += $('footer').outerHeight();
      }
      //console.info("postMashupHeight: resize done");
      pega.desktop.support.doGadgetAction({name:"resizeMashup", height:height});
    }
  },
	/* @Handler
	@private Resizes harness content and button divs so that the button section always appears at bottom of page.
	@return $void$
	*/
	doHarnessResizeActual: function() {
		pega.u.d.resizingHarness = true;
		if(pega.u.d.harnessType && pega.u.d.harnessType == "layout"){pega.u.d.portal.layoutObj.resize();}

		var docBody =  document.body;

		var oFrameElement = null;
                  try {
                     oFrameElement = window.frameElement;
                  } catch(e) {}

		if(oFrameElement != null && typeof(oFrameElement.PegaWebGadget) != "undefined") {
			var actionIframe = window.frames["actionIFrame"];
			if(actionIframe && pega.u.d.gIsLoading != true && actionIframe.document.readyState == "complete") {
				if(actionIframe.pega && actionIframe.pega.u && actionIframe.pega.u.d) {
					actionIframe.pega.u.d.resizeActionIFrame(false);
				}
			}
		}

		/*GRP-17721 : Conditional call to resizeHarnessCallback iff callResizeHarness is set to true after the modal dialog mask is rendered*/
		if(pega.u.d.callResizeHarness) {
			pega.u.d.resizeHarnessCallback();
		}

		//incase of layout harness
		if(pega.u.d.isPortal()){
			pega.u.d.resizingHarness = false;
			return;
		}

		var hbDiv = document.getElementById("HARNESS_BUTTONS");
		var buttonBarPresent = (hbDiv != null);
		if(!buttonBarPresent) {
			pega.u.d.resizingHarness = false;
			return;
		}
		var hcDiv = document.getElementById("HARNESS_CONTENT");
		var buttonBarEmpty = true;
		//if(hbDiv && (hbDiv.getElementsByTagName("button").length > 0 || (hbDiv.hasChildNodes() && hbDiv.children[0].id=="HarnessFooter")) ) buttonBarEmpty = false;
		if(hbDiv && (hbDiv.getElementsByTagName("button").length > 0 || $("#HARNESS_BUTTONS #HarnessFooter td td *").length > 0)) buttonBarEmpty = false;
		if(buttonBarEmpty ) {
			hbDiv.style.display = "none";
			var fixedBBStylesBlock = document.getElementById("fixedBBStyles");
			if(fixedBBStylesBlock)
				fixedBBStylesBlock.parentNode.removeChild(fixedBBStylesBlock);
		}

		pega.u.d.resizingHarness = false;
		/*BUG-239767: trigger resize again if button bar is empty as the space taken up by the button bar should not distort the iframe*/
      	if(buttonBarEmpty ) {
      		pega.u.d.resizeHarness();
        }
	}
};
pega.lang.augmentObject(pega.ui.Doc.prototype, harnessSizing);
//static-content-hash-trigger-GCC
(function(p) {
	var pud = p.u.d;
	var desktopSupport = p.desktop.support;

	var UIActionRouter = (function() {

		var onlineReturn = function(safeURL, callback) {
			var harCtxMgr = pega.ui.HarnessContextMgr;
			var action = safeURL.get("api");

			if (action.substring(0, 8) === "openRule") {
				return;
			}

			var metaObject = sanitizeObject(safeURL);
			/*BUG-203274: To handle desktop actions from modal dialog in Noframe portal as the modal thread is purged before execution*/
			if (harCtxMgr.get("baseThreadName")) {
				pud.switchThread(harCtxMgr.get("baseThreadName"));
			}

			if (pega.u.d.isSingleMDCDoc) {
				var isDirty = pega.u.d.closeOnlyMDCDocs();
				if (isDirty) return;
			}

			// MicroDC case for targeting DC from AC top Nav dirty handling. 
			if (metaObject.mdcTarget === "dynamicContainer") {
				pega.ctxmgr.setRootDocumentContext();
				if (!pega.ctx.bIsDCSPA) {
					if (isFormDirty(metaObject)) {
						return;
					} else {
						pega.u.d.closeOnlyMDCDocs(null, true, true, true);
					}
				}
			}

			if (metaObject.mdcTarget && metaObject.mdcTarget !== "dynamicContainer") {
				if (pega.redux) {
					// AjaxContainer available in current doc
					pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
				} else if (pega.mobile && pega.mobile.support && pega.mobile.support.getPMCRedux()) {
					// PMC8 and in multi-webview mode
					var redux = pega.mobile.support.getPMCRedux();
					redux.store.dispatch(redux.actions(redux.actionTypes.ADD, metaObject));
					return;
				}
			} else if (pega.ctx.bIsDCSPA) {
				singlePageRenderer(metaObject);
			} else {
				var serverURL = finalizeNavURL(metaObject);
				pega.desktop.navigateTo(serverURL.toURL());
			}

		};

		var showRemoteUnAvailableMessage = function(msg) {
			pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton && pega.control.Actions.prototype.hideSkeleton();
			alert(msg);
		};

		var nonOscoSuccessCallback = function(dummyDiv) {
			//pega.u.d.initChangeTracker(dummyDiv);
			pega.ui.updatePegaServerAvailability(1);
			pega.ui.DCUtil.isFromNonOsco = true;
		};

		var getDummyDiv = function(res) {
			var dummyDiv = document.createElement("div");
			dummyDiv.innerHTML = res;
			var toggleIcon = $(dummyDiv).find("main.screen-layout-region-main-middle a#appview-nav-toggle-one.nav-toggle-one").get(0);
			if (toggleIcon) {
				toggleIcon.remove();
			}
			toggleIcon = $(dummyDiv).find("main.screen-layout-region-main-middle a#appview-nav-toggle-two.nav-toggle-two").get(0);
			if (toggleIcon) {
				toggleIcon.remove();
			}
			return dummyDiv;
		};

		var replacePegaHarnessContent = function(contentDiv) {
			var harnessDiv = pega.util.Dom.getElementsById("PEGA_HARNESS", contentDiv, "div");
			if (harnessDiv && harnessDiv.length > 0) {
				harnessDiv = harnessDiv[0];
				pega.ui.DCUtil.replace(harnessDiv.parentNode);
				return;
			}
			console.log("Harness not found. Invalid response from the server.");
		};

		var isFormDirty = function(metaObject, singlePageRendererCallback) {
			if (typeof metaObject == "object") {
				// For show harness replace current, don't show dirty dialog if submit is enabled.
				if (metaObject && metaObject.name === "safeURL" && metaObject.get("submitCurrent") === "Yes") {
					return false;
				}
			}
      if(pega.ctx.bIsDCSPA){
        var initialContext = pega.ctx;
        var mdcContext = pega.ctxmgr.getContextByProperty("isMDC", true);
        var contextToSet = (mdcContext) ? mdcContext : pega.ctxmgr.getDCSPAContext();
        pega.ctxmgr.setContext(contextToSet);
        var isdirty = pega.ctx.ignoreDirty !== "true" && pega.u.d.isFormDirty(true, false, null, null, singlePageRendererCallback);
        pega.ctxmgr.resetContext(initialContext);
        return isdirty;
      }
			return pega.ctx.ignoreDirty !== "true" && pega.u.d.isFormDirty(true, false, null, null, singlePageRendererCallback);
		};

		var getDCSPAThreadName = function() {
			/* This changes is for the support of new tab in Infinity Theme-Cosmos Application*/
			if (pega.desktop.infinity) {
				if (pega.desktop.infinity.isNewTab && pega.desktop.infinity.isNewTab()) {
					if(pega.ctx.pxReqURI.indexOf("DCSPA")!==-1 && pega.u.d.portalName.indexOf("autoThread")===-1){
            return  pega.u.d.portalName;
          }else if(pega.ctx.pxReqURI.indexOf("DCSPA")!==-1 && pega.u.d.portalName.indexOf("autoThread")!==-1){
            return  pud.getPortalThreadName();
          }
				}
			}
			return "DCSPA" + "_" + pega.u.d.portalName;
		};

		var singlePageRenderer = function(metaObject, postDataJson, spacallback, event) {
			//Setting historyStateIndex when state is null 
			var historyStateIndex;
			var isSPAPortalRefresh = false;
			if (event) {
				historyStateIndex = event.state ? event.state.index : 0;
			}
			var harCtxMgr = pega.ui.HarnessContextMgr;
	
    function singlePageRendererCallback(){
      if (event) {
				pega.ui.DCUtil.historyGlobalState = historyStateIndex;
			}
			var serverURL;
			if (typeof metaObject === "object" && metaObject.name === "safeURL" && metaObject.get("isURLReady") === "true") {
				serverURL = metaObject;
				if (metaObject.get("isFromHistory") !== "true") {
					// In HA use case populate pxReqURI.
					if (typeof pega.ctx.pxReqURI !== "undefined" && pega.ctx.pxReqURI !== "") {
						serverURL.put('pxReqURI', pega.ctx.pxReqURI);
					}

					isSPAPortalRefresh = (serverURL.get("pyActivity") === "ReloadHarness" && !pega.u.d.isDCSPAThread(pega.u.d.getThreadName()));

					if (pud.bIsDCSPA && (!isSPAPortalRefresh && serverURL.get("api") !== "activate") && serverURL.get("pxReqURI")) {
						var reqURI = serverURL.get("pxReqURI");
						var portalThreadName = pud.getPortalThreadName();
						var dcSPAThreadName = getDCSPAThreadName();
						reqURI = reqURI.replace(portalThreadName, dcSPAThreadName);
						serverURL.put('pxReqURI', reqURI);
					}
				}
			} else {
				harCtxMgr.set('url', harCtxMgr.get('url').replace("/PRRestService/", "/PRServlet/"));
				//BUG-492757 changes
				delete metaObject.pxReqURI;
				serverURL = finalizeNavURL(metaObject);
				reqURI = serverURL.get('pxReqURI');
				serverURL.put('pxReqURI', reqURI);
			}

			// flag as data for PDC/PAL
			pega.ui.statetracking.setPALInteraction("abc?" + serverURL.toUnencodedQueryString());
			var isActivateDoc = (serverURL.get("api") === "activate");
			// Back button click use cases.
			var isHistoryStateNull = (serverURL.get("isHistoryStateNull") === "true");
			serverURL.remove("isHistoryStateNull");

			function processCananicalElement(response) {
				var canonicalElement = document.querySelector("head link[rel='canonical']");
				if (canonicalElement) {
					canonicalElement.remove();
				}
				canonicalElement = response.querySelector("link[rel='canonical']");
				if (canonicalElement) {
					document.head.appendChild(canonicalElement);
				}
			}

			function getMainDiv() {
				var mainDiv;
				if (pega.u.d.bIsDCSPA && pega.u.d.replaceWorkArea) {
					mainDiv = document.querySelector("#workarea");
				} else {
					mainDiv = document.querySelector("main");
				}
				return mainDiv;
			}

			/*
			  Switch to either DCSPA context or portal context based on the use cases.
			*/
			function switchContext() {
				var _currentHarnessCtx;
				var harnessContextMap = pega.ctxmgr.getHarnessContextMap();
				var dcspaContext = pega.ctxmgr.getDCSPAContext();
				if (dcspaContext) {
					_currentHarnessCtx = pega.ctx;
					pega.ctxmgr.setContext(dcspaContext);
				} else if (!harnessContextMap[pega.ctx.pzHarnessID]) {
					// Activate document use case.
					_currentHarnessCtx = pega.ctx;
					var newHarnessId = Object.keys(harnessContextMap)[0];
					pega.ctxmgr.setContext(harnessContextMap[newHarnessId]);
				}
				return _currentHarnessCtx;
			}

			var callBack = {};
			callBack.preRenderer = function(response) {
				var dummyDiv = document.createElement("div");
				var overrideRootCtx;
				dummyDiv.innerHTML = response.responseText;
				var intialVars = dummyDiv.querySelector("script#harnessvars");
				// In few cases intialVars won't be available. E.g.: Toggle live editing in app studio.
				if (!intialVars) {
					dummyDiv.innerHTML = null;
					dummyDiv = undefined;
					return;
				}
				// Hide busy indicator as it is causing timeout related issues when opened from Recents.
				if (pega.u.d.gBusyInd) {
					pega.u.d.gBusyInd.hide(null, null, true);
				}
				var mainDiv = getMainDiv();
				if (mainDiv) {
					pega.u.d.cleanUpHarnessElements(null, [mainDiv]);
				}
				// If DCSPA context already exists, unload it first. E.g.: submitting a case
				var dcspaContext = pega.ctxmgr.getDCSPAContext();
				if (dcspaContext) {
					pega.ui.EventsEmitter.publishSync("onHarnessUnload");
					pega.ui.HarnessContextMgr.unloadHarnessContext(dcspaContext.pzHarnessID);
				}
				if (isActivateDoc || isHistoryStateNull || isSPAPortalRefresh) {
					overrideRootCtx = true;
					// If clicked on home remove portalThread harness context.
					var portalHarnessContext = pega.ctxmgr.getContextByThreadName(pega.u.d.getPortalThreadName());
          var targetElement = document.body;
					if (portalHarnessContext) {
						pega.ui.EventsEmitter.publishSync("onHarnessUnload");
						pega.ui.HarnessContextMgr.unloadHarnessContext(portalHarnessContext.pzHarnessID, true);
						targetElement.classList.remove(targetElement.getAttribute("data-harness-id"));
						targetElement.removeAttribute("data-harness-id");
					}
				}
				var scriptEle = document.createElement("script");
				scriptEle.innerHTML = intialVars.innerHTML;
				intialVars.parentNode.removeChild(intialVars);
				document.head.appendChild(scriptEle);
				evaluateJSONVariables(overrideRootCtx);
				deferredFieldValues();
				pega.ctx.bIsDCSPA = true;
				if (!pega.ctx.baseThreadName) {
					pega.ctx.baseThreadName = pega.u.d.getThreadName();
				}
				if (!pega.ctx.basePrimaryPageName) {
					pega.ctx.basePrimaryPageName = pega.ctx.primaryPageName;
				}
				// register for DCSPA context switching
				mainDiv = getMainDiv();
				pega.ctxmgr.registerContextSwitching(mainDiv);
				var ajaxctDIV = dummyDiv.querySelector("div#AJAXCT");
				if (ajaxctDIV) {
					pega.u.d.initChangeTracker(dummyDiv);
				}
				response.responseText = dummyDiv.innerHTML;
				dummyDiv.innerHTML = null;
				dummyDiv = undefined;
			};

			callBack.success = function(response) {

				var dummyDiv = getDummyDiv(response.responseText);
				var _currentHarnessCtx = switchContext();
				processCananicalElement(dummyDiv);
				/*BUG-304452*/
				var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", dummyDiv, "div");
				if (onlyOnceEle && onlyOnceEle[0]) {
					pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
					onlyOnceEle[0].parentNode.removeChild(onlyOnceEle[0]);
				}
				var isActivateDocument = false;
				var harnessDiv = pega.util.Dom.getElementsById("PEGA_HARNESS", dummyDiv, "div");
				if (!harnessDiv) {
					isActivateDocument = true;
					harnessDiv = dummyDiv.querySelectorAll("main div.screen-layout-region-content>div");
				}

				if (pega.u.d.modalDialog && pega.u.d.bModalDialogOpen) {
					pega.u.d.modalDialog.hide();
				}
				pega.u.d.modalDialog = null;
				var modalContainerList = document.getElementsByClassName("modal-overlay");
				if (modalContainerList.length > 0) {
					for (var i = modalContainerList.length - 1; i >= 0; i--) {
						var modalDialogDiv = modalContainerList[i];
						modalDialogDiv.remove();
					}
				}
				var modalTempalte = pega.util.Dom.getElementsById("modalOverlay", dummyDiv, "div");

				if (isActivateDocument && modalTempalte && modalTempalte.length > 0) {
					document.body.insertBefore(modalTempalte[0], document.body.firstElementChild);
				}

				if (harnessDiv && harnessDiv.length > 0) {
					function getWindowURL() {
						var windowURL = "";
						if (pega && pega.util && pega.util.Event && pega.util.Event.isIE) {
							windowURL = window.location.href;
						}
						return windowURL;
					}

					harnessDiv = harnessDiv[0];
					var scriptArray = dummyDiv.querySelectorAll("script");
					var linkArray = dummyDiv.querySelectorAll("link[rel='stylesheet']");
					var styleArray = dummyDiv.querySelectorAll("style");
					var docsRecreateInfo = dummyDiv.querySelector("textarea#docsRecreateInfo");
					var count = scriptArray.length;
					var _isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
					for (var index = 0; index < count; index++) {
						harnessDiv.appendChild(scriptArray[index]);
					}
					count = linkArray.length;
					for (index = 0; index < count; index++) {
						harnessDiv.appendChild(linkArray[index]);
					}
					count = styleArray.length;
					for (index = 0; index < count; index++) {
						harnessDiv.appendChild(styleArray[index]);
					}
					scriptArray = styleArray = linkArray = null;
					var fromHistory = serverURL.get("isFromHistory");
					var isReloaded = serverURL.get("isReloaded");
					var skipHistoryUpdation = serverURL.get("skipHistoryUpdation");
					var action = serverURL.get("action");
					//skip history updation when displayOnPage action is triggered
					if (action === "displayOnPage") {
						skipHistoryUpdation = "true";
					}
					if ( typeof newTabIsReloaded === "string" && newTabIsReloaded === "true") {
					  isReloaded = "true";
					  newTabIsReloaded = "";
					}
					var docTitle = null;
					if (_isSafari) {
						docTitle = document.title;
					}
					if ((fromHistory !== "true" || isReloaded === "true") && (skipHistoryUpdation !== "true")) {
						var historyStateObj = {
							title: document.title,
							url: serverURL.toURL(),
							index: pega.ui.DCUtil.historyGlobalState,
							isActivateDocument: isActivateDoc
						}
						if (isReloaded === "true") {
							if (history.state && history.state.page === 1) {
								historyStateObj.page = 1;
							}

							history.replaceState(historyStateObj, docTitle, getWindowURL());
							serverURL.remove("isReloaded");
						} else {
							//incrementing historyGlobalState for each pushstate and keeping it in sync with historyStateObj index
							historyStateObj.index = ++(pega.ui.DCUtil.historyGlobalState);
							history.pushState(historyStateObj, docTitle, getWindowURL());
							serverURL.remove("isFromHistory");
						}

					}
					/* To not override the document title for workspaces */
					if (pega.desktop.portalCategory !== "workspace") {
						document.title = dummyDiv.getElementsByTagName("title")[0].text.trim();
					}
					dummyDiv = document.createElement("div");
					dummyDiv.appendChild(harnessDiv);
					var leftToggleIcon = $("main.screen-layout-region-main-middle a#appview-nav-toggle-one.nav-toggle-one").get(0);
					var rightToggleIcon = $("main.screen-layout-region-main-middle a#appview-nav-toggle-two.nav-toggle-two").get(0);

					var spaRenderCallback = function(domObj) {
						var _currentHarnessCtx = switchContext();
						var harCtxMgr = pega.ui.HarnessContextMgr;
						var action = serverURL.get("action");

						pega.u.d.loadHTMLEleCallback(domObj, true);

						/*skipping history replace state in activateDoc case such that on refresh static page is displayed*/
						if (fromHistory !== "true" && (history.state !== null) && !history.state.isActivateDocument && action !== "displayOnPage" && skipHistoryUpdation !== "true") {

							var newSafeURL = pega.ui.DCUtil.rewriteURL(docsRecreateInfo);
							if (newSafeURL) {
								serverURL = newSafeURL;
							}
							var oldState = history.state;
							var newStateObj = {
								title: oldState.title,
								url: serverURL.toURL(),
								index: pega.ui.DCUtil.historyGlobalState
							};
							var docTitle = null;
							if (_isSafari) {
								docTitle = document.title;
							}

							if (history.state && history.state.page === 1) {
								newStateObj.page = 1;
							}
							history.replaceState(newStateObj, docTitle, getWindowURL());
						}
						if (leftToggleIcon) {
							var mainDiv = $(".screen-layout-region-main-middle .screen-layout-region-content").get(0);
							if (mainDiv) {
								var toggleIcon = $("main.screen-layout-region-main-middle a#appview-nav-toggle-one.nav-toggle-one").get(0);
								if (toggleIcon) {
									toggleIcon.remove();
								}
								$(mainDiv).prepend(leftToggleIcon);
							}
						}
						if (rightToggleIcon) {
							mainDiv = $(".screen-layout-region-main-middle .screen-layout-region-content").get(0);
							if (mainDiv) {
								toggleIcon = $("main.screen-layout-region-main-middle a#appview-nav-toggle-two.nav-toggle-two").get(0);
								if (toggleIcon) {
									toggleIcon.remove();
								}
								$(mainDiv).prepend(rightToggleIcon);
							}
						}
						pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
						pega.u.d.resetBusyState();
						if (postDataJson) {
							pega.ui.HarnessContextMap.set("SubmitInProgress", false);
						}
						pega.ctx.baseFrameName = SafeURL_createFromURL(harCtxMgr.get('url')).get('pzFromFrame');

						if (pega.u.d.modalDialog == null) {
							pega.u.d.modalDialogInit();
						}
						// Reset dirty status flags.
						pega.ui.HarnessContextMap.set("gSectionReloaded", null);
						if (spacallback && spacallback.success) {
							spacallback.success();
						}
						if (_currentHarnessCtx) {
							pega.ctxmgr.setContext(_currentHarnessCtx);
						}
						//BUG-512435 Explicitly invoking harness resize in SPA scenario
						if (pega && pega.Mashup && window.doHarnessResize) {
							doHarnessResize();
						}
					};
					pega.ui.DCUtil.replace(harnessDiv.parentNode, spaRenderCallback);
				}
				if (_currentHarnessCtx) {
					pega.ctxmgr.setContext(_currentHarnessCtx);
				}
			};
			callBack.failure = function() {
				if (spacallback && spacallback.failure) {
					spacallback.failure();
				}
			};

			if (pega.ctx.isUITemplatized) {
				serverURL.put("UITemplatingStatus", "Y");
			} else {
				serverURL.put("UITemplatingStatus", "N");
			}
			var postData = new SafeURL();
			if (postDataJson) {
				postData = postDataJson;
			}

			if (postData instanceof FormData) {
				postData.append("isDCSPA", "true");
			} else {
				postData.put("isDCSPA", "true");
			}

			var dcspaContext = pega.ctxmgr.getDCSPAContext();
			if (dcspaContext && (isActivateDoc || isHistoryStateNull)) {
				// Switch context and trigger close.
				pega.ctxmgr.setContext(dcspaContext);
				var closeCallback = {};
				closeCallback.success = function() {
					pega.ctxmgr.setRootDocumentContext();
					// TODO: Clean up below code, create a new method and invoke it from here and dynamiccontainer_lite
					var serverURL = SafeURL_createFromURL(pega.u.d.homeURL);
					var activity = serverURL.get("pyActivity");
					var preActivity = serverURL.get("pyPreActivity");
          var pzActivity = serverURL.get("pzActivity");
					var _location = serverURL.get("Location");

					if (("pzRunActionWrapper" === activity && "Embed-PortalLayout.RedirectAndRun" === pzActivity) || ("Embed-PortalLayout.RedirectAndRun" === activity || "Embed-PortalLayout.RedirectAndRun" === preActivity)){
            if(_location.startsWith("pyActivity%3DData-Portal.ShowSelectedPortal")) {
						  serverURL.remove("pyActivity");
						  var threadName = serverURL.get("ThreadName");
						  serverURL.remove("ThreadName");
						  var newURL = new SafeURL_createFromEncryptedURLwithQueryString(_location);
						  serverURL.remove("Location");
						  //BUG-536034 changes: replacing url threadname with proper threadname.
						  var reqURL = serverURL.get("pxReqURI").replace(pega.u.d.getThreadName({"url": serverURL.get("pxReqURI")}), threadName);
						  newURL.put("pxReqURI", reqURL);
						  serverURL = newURL;
					  }
          }
					serverURL.put("isURLReady", "true");
					serverURL.put("isDCSPA", "true");
					if (isActivateDoc) {

						_location = serverURL.get("Location");
						if (_location) {
							_location += ("&AJAXTrackID=" + pega.ui.ChangeTrackerMap.getTracker().id);
							serverURL.put("Location", _location + "&api=activate");
						} else {
							serverURL.put("api", "activate");
							if (postData instanceof FormData) {
								postData.append("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
							} else {
								postData.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
							}
						}
					}
					if (history.state === null || history.state.mspPortalInitialLoad) {

						_location = serverURL.get("Location");
						if (_location) {
							serverURL.put("Location", _location + "&isHistoryStateNull=true");
						} else {
							serverURL.put("isHistoryStateNull", "true");
						}
					}
					if (pega.ctx.isUITemplatized) {
						serverURL.put("UITemplatingStatus", "Y");
					} else {
						serverURL.put("UITemplatingStatus", "N");
					}
					pega.u.d.asyncRequest('POST', serverURL, callBack, postData);
				};
				closeCallback.failure = function() {
					console.error("Doclose request for DCSPA thread failed");
				};
				pega.u.d.doClose(null, true, closeCallback, false);
				// reset context.
				pega.ctxmgr.resetContext();
			} else {
				var pyActivity = serverURL.get("pyActivity");
				var skipHistoryUpdation = serverURL.get("skipHistoryUpdation");
				var isActionRefresh = (pyActivity === "ReloadHarness" && skipHistoryUpdation === "true");
				// BUG-486475 : Skip closeOnlyMDCDocs call in actions->refresh use case.
				if (!isActionRefresh) {
					// closeOnlyMDCDocs call is not required in activate document scenario as the mdc documents will be closed from doclose method.
					if (pega.u.d.closeOnlyMDCDocs) {
						pega.u.d.closeOnlyMDCDocs(null, true, true, true);
					}
				}
				if (isActivateDoc || isHistoryStateNull) {
					if (postData instanceof FormData) {
						postData.append("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
					} else {
						postData.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
					}
				}
				pega.u.d.asyncRequest('POST', serverURL, callBack, postData);
			}
  }
		// Show dirty dialog if there are any unsaved changes.
			// added skipDirtyCheck for bug-534280
			
      if (!metaObject.skipDirtyCheck && isFormDirty(metaObject, singlePageRendererCallback)) {
				//BUG-290081:Browser back button dirty handling.
				if (event) {
					history.go(pega.ui.DCUtil.historyGlobalState - historyStateIndex);
				}
				/*BUG-419495 */
				pega && pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton && pega.control.Actions.prototype.hideSkeleton();
				pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
				pega.ui.statetracking.setDocumentDone();
				return;
			}else{ 	
        singlePageRendererCallback();
      }
   }

		var remoteHandler = function(metaObject) {
			var harCtxMgr = pega.ui.HarnessContextMgr;
			var isServerAvailable = pega.ui.ClientCache.find("pxRequestor.pzIsPegaServerAvailable");
			if (!isServerAvailable || (isServerAvailable && isServerAvailable.getValue() === "false")) {
				var CannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");
				if (pega.ui.DCUtil.isActionFromNonOsco) {
					pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
				}
				pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
				if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
					pega.ui.DCUtil.cancelTransition();
				}

				showRemoteUnAvailableMessage(CannotPerformWhenOffline);
				if (pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
				    pega.mobile.sdk.plugins.layout.getCurrentNavigationItemStackSize().then(function(stackSize) {
				        if (stackSize === 0) {
				            pega.mobile.sdk.plugins.layout.selectLastVisitedNavigationItem();
				        }
				    })
				}
				return;
			}

			if (typeof pmcPortalConfiguration !== "undefined" && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
				metaObject.offlineEnabled = "false";
				metaObject.isRemoteCase = "true";
				metaObject.mdcTarget = pega.ctx.mdcName;
				// before dispatching we have to close the child doc 

				var Utils = pega.redux.Utils;
				var currentState = Utils.getAjaxContainerState();

				if (currentState.reference && metaObject.action === "openAssignment") {
					metaObject.recordId = currentState.reference.name;
					metaObject.reload = true;
					pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSETOCLAIM, metaObject));
					delete currentState.reference;
				} else {
					pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
				}

				return;
			}

			/**
			  If child web view call remotehandler. Keeping it aside else it become convoluted to read.
			**/
			if (pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
				var portalWindow = pega.mobile.support.getPortalWindow();
				var metaData = new SafeURL()
				for (var key in metaObject) {
					metaValue = metaObject[key];
					if (metaValue === null || metaValue === "" || metaValue === undefined) {
						continue;
					}
					metaData.put(key, metaValue);
				}
				metaData.put("offlineEnabled", "false");
				metaData.put("isRemoteCase", "true");
				portalWindow.pega.ui.EventsEmitter.publishSync("MDCAction", metaData);
				return;
			}

			if (metaObject && metaObject.action && metaObject.action.toLowerCase() !== "runflow") {
				pega.process.engine.removeTopLevelPages();
			}
			harCtxMgr.set("url", harCtxMgr.get("url").replace("/PRRestService/", "/PRServlet/"));
			// BUG-423860 : switching to NONOSCOThread.
			var trackers = pega.ui.ChangeTrackerMap.getTrackers();
			if (trackers && trackers["NONOSCOThread"]) {
				pega.u.d.switchThread('NONOSCOThread');
				pega.ui.ClientCache.init('NONOSCOThread');
			}
			var serverURL = finalizeNavURL(metaObject);

			if (pega.mobile.isSingleWebViewOfflinePegaMobileClient) {
				serverURL.put("pxReqURI", pega.ctx.pxReqURI)
			}

			var reqURI = serverURL.get('pxReqURI');
			reqURI = reqURI.replace(reqURI.substring(reqURI.indexOf('!') + 1), 'NONOSCOThread');
			serverURL.put('pxReqURI', reqURI);
			serverURL.put('isRemoteCase', 'true');
			serverURL.put("UITemplatingStatus", "Y");
			//serverURL.put('ThreadName','NONOSCOThread');
			var callBack = {};
			pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
			callBack.success = function(response) {
				if (pega.u.d.modalDialog && pega.u.d.bModalDialogOpen) {
					pega.u.d.modalDialog.hide();
				}
				var dummyDiv = getDummyDiv(response.responseText);
				nonOscoSuccessCallback(dummyDiv);
				replacePegaHarnessContent(dummyDiv);
				pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
			};
			callBack.failure = function() {
				// fix for BUG-492439 for "Empty Assignment Issue"
				if (pega.u.d.isAppOfflineEnabled()) {
					pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.LOCAL);
					pega.u.d.switchThread('STANDARD');
					pega.ui.ClientCache.init('STANDARD');

				}

				pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
				if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
					pega.ui.DCUtil.cancelTransition();
				}

				//BUG-483099: throwing proper alert with console log
				console.error(arguments[0].status + ": " + arguments[0].statusText);
				var CannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");
				showRemoteUnAvailableMessage(CannotPerformWhenOffline);
			};
			pega.u.d.asyncRequest('GET', serverURL, callBack);
		};

		var offlineReturn = function(safeURL, callback) {
			var noOp = function() {
			};

			var dirty = pega.u.d.isFormDirty(true);

			if (dirty) {
				//BusyIndicator is shown from ServerProxy before the action is dispatched
				//so call hide here. (BUG-253246)
				pega.u.d.gBusyInd.hide();
				// BUG-268484
				pega.u.d.ServerProxy.resetDestination();
				if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
					pega.ui.DCUtil.cancelTransition();
				}
				return;
			} else {
				pega.ui.HarnessContextMap.set("gDirtyOverride", null);
			}

			var accessFromServer = safeURL.get('accessFromServer');
			if (accessFromServer) {
				safeURL.remove('accessFromServer');
			}

			var metaObject = sanitizeObject(safeURL);

			/**
			   US-316101: Adding snippet to identify Ajax container in our app.
			**/
			var microDCList = pega.u.d.getAllMDCContainers();
			if (metaObject.mdcTarget && metaObject.mdcTarget !== "dynamicContainer") {
				for (var i = 0; i < microDCList.length; i++) {
					var microDCDiv = microDCList[i];
					if ($(microDCDiv).is(":visible")) {
						var microDCName = microDCDiv.getAttribute("data-mdc-id");
						safeURL.put("mdcTarget", microDCName);
					}
				}
			}

			var action = metaObject.action;
			var failureCallback = function() {remoteHandler(metaObject);};
			if (action.toLowerCase() !== "runflow" && action.toLowerCase() !== "display")
				pega.process.engine.removeTopLevelPages();

			/* BUG-396777: Some actions are bound to fail when device does not have data connection. Do not call hideDetails for those cases. */
			var MDAcceptList = {
				"runflow": ["Work-.NewCovered", "Work-.AddCovered"]
			};

			if (MDAcceptList[action.toLowerCase()] &&
				MDAcceptList[action.toLowerCase()].indexOf(metaObject.pyActivity) === -1 &&
				!pega.offline.NetworkStatus.isDataNetworkAvailable()) {
				// No operation for now
			} else {
				// Dismiss MD
				pega.ui.rdlMasterDetails && pega.ui.rdlMasterDetails.hideDetails({}, true);
			}

			var offlineEnabled;
			// This is client counterpart to doUIAction
			switch (action.toLowerCase()) {
				case "openassignment":
					var assignmentKey = metaObject.key;
					offlineEnabled = safeURL.get('offlineEnabled');
					/* Async call to processEngine api callback resides in ajaxengine */
					if (offlineEnabled === "false") {
						failureCallback();
					} else if (offlineEnabled === "true") {
						// TASK-892607: Targeting open assignment in ajax container
						if (metaObject.mdcTarget) {
							/* US-324619: In multiwebview PMC ajax conatiner based app, open the new webview for openassignment action to show the assignment */
							if (pega.mobile.isMultiWebViewPegaMobileClient) {
								pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
							} else if (pega.mobile.isSingleWebViewPegaMobileClient) {
								/* US-324619: These API calls are required for single webview PMC Ajax Container based application. Uncomment and add check for single webview when we support it. */
								// modifyContextURL(metaObject.mdcTarget);
								// createAndSwitchThread(null, metaObject.mdcTarget);
								// pega.process.engine.openAssignment(assignmentKey, noOp, noOp, metaObject);
							}
						} else {
							pega.u.d.switchThread(pega.u.d.baseThreadName);
							pega.process.engine.openAssignment(assignmentKey, noOp, failureCallback, metaObject);
						}
					} else {
						// TASK-892607: Targeting open assignment in ajax container
						if (metaObject.mdcTarget) {
							if (pega.mobile.isMultiWebViewPegaMobileClient) {
								pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
							} else if (pega.mobile.isSingleWebViewPegaMobileClient) {
								/* US-324619: These API calls are required for single webview PMC Ajax Container based application. Uncomment and add check for single webview when we support it. */
								// modifyContextURL(metaObject.mdcTarget);
								// createAndSwitchThread(null, metaObject.mdcTarget);
								// pega.process.engine.openAssignment(assignmentKey, noOp, noOp, metaObject);
							}
						} else {
							// Targeting open assignment in dynamic container
							pega.process.engine.openAssignment(assignmentKey, noOp, failureCallback, metaObject);
						}
					}
					break;
				case "display":
				case "reportdefinition":
					/**
					  US-316101: We dispatch redux action in case of ajax container.
					**/
					if (metaObject.mdcTarget && metaObject.mdcTarget !== "dynamicContainer") {
						if (pega.redux) {
							/* US-324619: In multi webview PMC ajax conatiner based app, to open harness in new webview */
							if (pega.mobile.isMultiWebViewPegaMobileClient) {
								pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
							} else if (pega.mobile.isSingleWebViewPegaMobileClient) {
								/* US-324619: These API calls are required for single webview PMC Ajax Container based application. Uncomment and add check for single webview when we support it. */
								// modifyContextURL(metaObject.mdcTarget);
								// createAndSwitchThread(null, metaObject.mdcTarget);
							}
						}
					} else {
						var harnessName = metaObject.harnessName;
						var className = metaObject.className;
						if (className) {
							if (accessFromServer === 'true' || pega.ui.DCUtil.isActionFromNonOsco) {
								failureCallback();
							} else {
								pega.process.engine.removeTopLevelPages();
								pega.u.d.ServerProxy.displayHarness(harnessName, className);
							}
						} else {
							/*Trigger delta-sync when switched from non osco to osco*/
							var bTriggerDeltaSync = safeURL.get('triggerDeltaSync');
							if (typeof bTriggerDeltaSync == "undefined") {
								bTriggerDeltaSync = "true";
							}
							if (pega.ui.DCUtil.isFromNonOsco && pega.offline && pega.offline.DataSync && bTriggerDeltaSync === "true") {
								pega.ui.DCUtil.isFromNonOsco = false;
								pega.u.d.switchThread(pega.ui.DCUtil.primaryThread);
								if (typeof pega.offline.DataSync.start === "function")
									pega.offline.DataSync.start();
							}
							//Get the stream from the cache or query the local store and get it
							//Once you have the stream then add to cache if needed and display by calling the SPcallback
							var DOMLoadCallback = {
								success: function(results) {
									pega.ui.DCUtil.replace(results.responseText);
									pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
								},
								failure: function(result) {
									pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
									if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
										pega.ui.DCUtil.cancelTransition();
									}
									console.log("DOMLoadCallback failure.");
								}
							};

							var activateOSCO = {};
							activateOSCO.offline = function(safeURL, postJSONString, mergedTemplateCallback) {

								var streamCacheCallback = {
									success: function(results) {
										pega.u.d.setPrimaryPage("pyDisplayHarness");
										mergedTemplateCallback.success(results);
									},
									failure: function(result) {
										console.log("Harness which is trying to accessed is not available in local store");
									}
								};
								// US-109057; cacheing moved within client store using rule cache
								pega.offline.clientstorehelper.getSectionStream(null, harnessName, streamCacheCallback.success, streamCacheCallback.failure);
							};
							pega.u.d.ServerProxy.doAction(new SafeURL(), new SafeURL(), activateOSCO, DOMLoadCallback);
						}
					}
					break;
				case "createnewwork":
					var isCasePackaged;
					if (pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
						var parentWindow = pega.mobile.support.getPortalWindow();
						isCasePackaged = parentWindow.pega.process.metadata.caseCache[metaObject.className];
					} else {
						isCasePackaged = pega.process.metadata.caseCache[metaObject.className];
					}

					if (isCasePackaged) {
						// Targets Ajax Container for case creation and rendering
						if (metaObject.mdcTarget) {
							/* US-324619: In multiwebview PMC ajax conatiner based app, to create case in new webview for createnewwork action */
							if (pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
								pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
							} else if (pega.mobile.isSingleWebViewOfflinePegaMobileClient) {
								/* US-324619: These API calls are required for single webview PMC Ajax Container based application. Uncomment and add check for single webview when we support it. */
								// modifyContextURL(metaObject.mdcTarget);
								// createAndSwitchThread(null, metaObject.mdcTarget);
								// pega.process.engine.createNewWorkWithParams(metaObject, noOp, noOp);
							}
						} else {
							// Targets Dynamic Container for case creation and rendering
							if (pega.u.d.baseThreadName) {
								pega.u.d.switchThread(pega.u.d.baseThreadName);
							}

							//ToDo:  flowParamNames is not comming investigate
							metaObject.flowParamNames = metaObject.flowParamNames ? metaObject.flowParamNames : "";
							pega.process.engine.createNewWorkWithParams(metaObject, noOp, noOp);
						}
					} else {
						failureCallback();
					}
					break;
				case "openworkbyhandle":
					offlineEnabled = safeURL.get('offlineEnabled');
					/* Async call to processEngine api callback resides in ajaxengine */
					if (offlineEnabled === "false") {
						failureCallback();
					} else {
						if (metaObject.mdcTarget && pega.mobile.isMultiWebViewPegaMobileClient) {
							var options = {};
							options.source = "client";
							pega.offline.clientstorehelper.getWorkItem(metaObject.key,
								function(result) {
									metaObject.offlineEnabled = "true";
									pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
								}, function(result) {
									metaObject.offlineEnabled = "false";
									failureCallback();
									// pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.ADD, metaObject));
								}, options);

						} else {
							pega.process.engine.openWorkByHandle(metaObject.key, noOp, failureCallback);
						}
					}
					break;

				//MALIA: US-86221
				case "refresh":
					pega.process.engine.refresh(noOp, noOp);
					break;
				case "runflow":
					if (metaObject.pyActivity) {
						var params;
						switch (metaObject.pyActivity) {
							case "Work-.NewCovered":
								if (metaObject.mdcTarget && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
									params = {
										flowClass: metaObject.InsClass,
										flowName: metaObject.FlowType,
										action: "createNewCoveredWork",
										source: "webview"
									};
									pega.process.engine.createNewCoveredWorkActionWithParams(params, noOp, noOp);
								} else {
									pega.process.engine.createNewCoveredWork(metaObject.InsClass, metaObject.FlowType, noOp, noOp);
								}
								break;
							case "Work-.AddCovered":
								if (metaObject.mdcTarget && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
									params = Object.assign(metaObject, {
										action: "addCoveredWork",
										source: "webview"
									});
									delete params.mdcTarget;
									pega.process.engine.addCoveredWork(params, noOp, noOp);
								} else {
									pega.process.engine.addCoveredWork(metaObject, noOp, noOp);
								}
								break;
							case "Work-.StartNewFlow":
								if (metaObject.mdcTarget && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
									// BUG-554993 : Fixing object.assign to support optional process.
									params = Object.assign(metaObject, {
										action: "startNewFlow",
										source: "webview"
									});
									delete params.mdcTarget;
									pega.process.engine.startNewFlow(metaObject, noOp, failureCallback);
								} else {
									pega.process.engine.startNewFlow(metaObject, noOp, failureCallback);
								}
								break;

							default: remoteHandler(metaObject); break;
						}
					}
					break;
				default: break;
			}

		};

		var sanitizeObject = function(actionMeta) {

			var oArgPars = {};
			var action = actionMeta.get("api");
			oArgPars.action = action;
			if (pega && pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.setActiveDocumentType) {
				pega.ui.DCUtil.setActiveDocumentType(action);
			}
			switch (action.toLowerCase()) {
				case "openassignment":
				case "openworkbyhandle":
					oArgPars.key = actionMeta.get("param");
					delete actionMeta.hashtable["param"];
					break;

				case "showharness":
				case "display":
					oArgPars.label = actionMeta.get("name");
					oArgPars.className = actionMeta.get("ClassName");
					oArgPars.harnessName = actionMeta.get("HarnessName");
					oArgPars.preActivity = actionMeta.get("preActivityName");
					oArgPars.pzPrimaryPageName = actionMeta.get("page");
					delete actionMeta.hashtable["name"];
					delete actionMeta.hashtable["ClassName"];
					delete actionMeta.hashtable["HarnessName"];
					delete actionMeta.hashtable["preActivityName"];
					delete actionMeta.hashtable["page"];
					break;

				case "createnewwork":
					oArgPars.flowClass = actionMeta.get("param");
					oArgPars.className = actionMeta.get("param");
					oArgPars.flowName = actionMeta.get("FlowType");

					delete actionMeta.hashtable["param"];
					delete actionMeta.hashtable["FlowType"];
					break;

				case "openworkitem":
					oArgPars.workID = actionMeta.get("param");

					if (actionMeta.get("workpool")) {
						oArgPars.workPool = actionMeta.get("workpool");
						delete actionMeta.hashtable["workpool"];
					} else {
						oArgPars.workPool = desktopSupport.getCurrentWorkPool();
					}
					delete actionMeta.hashtable["param"];
					break;

				case "getnextwork": break;

				case "openlanding":
					var customParam = actionMeta.get("customParam");

					oArgPars.label = actionMeta.get("Name");
					oArgPars.className = actionMeta.get("className");
					oArgPars.harnessName = actionMeta.get("harnessName");
					oArgPars.action = actionMeta.get("Action");
					oArgPars.landingAction = "openlanding";
					oArgPars.pzPrimaryPageName = actionMeta.get("page");

					delete actionMeta.hashtable["customParam"];
					delete actionMeta.hashtable["Name"];
					delete actionMeta.hashtable["className"];
					delete actionMeta.hashtable["harnessName"];
					delete actionMeta.hashtable["Action"];
					delete actionMeta.hashtable["page"];

					if (typeof (customParam) != "undefined") {
						for (var i in customParam) {
							oArgPars[i] = customParam[i];
						}
					}

					break;

				case "activate":
					oArgPars.action = "display";
					/*Reset activeDocType of standard thread to HOME*/
					var baseThreadPropList = pega.ui.ChangeTrackerMap.getTrackerByThread(pega.ui.DCUtil.primaryThread).trackedPropertiesList;
					baseThreadPropList.Declare_pyDisplay.pyDCDisplayState.pyActiveDocumentType = "HOME";

					/*This check is for online desktop case. As, pega.u.d.centerPanelHarness would be present only in HC but not in desktop.*/
					if (pega.u.d.centerPanelHarness) {
						oArgPars.harnessName = pega.u.d.centerPanelHarness;
					} else {
						oArgPars = sanitizeActivateAPI(oArgPars);
					}
					break;
				case "reportdefinition":
					customParam = actionMeta.get("ParamKeys");

					oArgPars.harnessName = "DisplayReport";
					oArgPars.className = "Code-Pega-List";
					oArgPars.pyReportClass = actionMeta.get("ReportClass");
					oArgPars.pyReportName = actionMeta.get("ReportName");
					oArgPars.pyShortcutHandle = actionMeta.get("ShortcutHandle");
					oArgPars.ReportAction = actionMeta.get("ReportAction");

					if (customParam) {
						var arrParamPair = customParam.split("&");
						for (var paramPairIndex in arrParamPair) {
							var pair = arrParamPair[paramPairIndex].split("=");
							oArgPars[pair[0]] = pair[1];
						}
						delete actionMeta.hashtable["ParamKeys"];
					}

					delete actionMeta.hashtable["ReportClass"];
					delete actionMeta.hashtable["ShortcutHandle"];
					delete actionMeta.hashtable["ReportAction"];
					delete actionMeta.hashtable["ReportName"];

					break;
			}

			for (var key in actionMeta.hashtable) {
				if (key && key !== "") {
					oArgPars[key] = actionMeta.hashtable[key];
				}
			}
			return oArgPars;
		};

		var sanitizeActivateAPI = function(oArgPars) {
			var screenLayoutMainDiv = $(".screen-layout"),
				portalHarnessInsName = "",
				className = "",
				harnessName = "";
			if (screenLayoutMainDiv && screenLayoutMainDiv.length > 0) {
				screenLayoutMainDiv = screenLayoutMainDiv[0];
				portalHarnessInsName = screenLayoutMainDiv.getAttribute("data-portalharnessinsname");
				if (portalHarnessInsName && portalHarnessInsName.indexOf("!") > -1) {
					portalHarnessInsName = portalHarnessInsName.split("!");
					className = portalHarnessInsName[0];
					harnessName = portalHarnessInsName[1];
				}
			}
			if (className === "" || harnessName === "") {
				className = window.strHarnessClass;
				harnessName = window.strHarnessPurpose
			}
			oArgPars.className = className;
			oArgPars.harnessName = harnessName;
			oArgPars.preActivity = "";
			oArgPars.pzPrimaryPageName = "";
			return oArgPars;
		};

		var finalizeNavURL = function(metaObject) {
			var metaValue,
				harCtxMgr = pega.ui.HarnessContextMgr;
			var currentURL = harCtxMgr.get('url');
			var portalThreadName = pud.getPortalThreadName();
			if (pud.bIsDCSPA && metaObject.api !== "activate") {
				var dcSPAThreadName = getDCSPAThreadName();
				currentURL = currentURL.replace(portalThreadName, dcSPAThreadName);
			}
			var oURL = new SafeURL_createFromEncryptedURL(currentURL);
			oURL.remove('pzPrimaryPageName');
			oURL.remove('pzTransactionId');
			oURL.remove('pzFromFrame');
			if (pud.bIsDCSPA) {
				oURL.remove('AJAXTrackID');
			}
			oURL.put("pyActivity", "@baseclass.doUIAction");
			oURL.put("isSDM", "true");
			var action = metaObject.action.toLowerCase();
			if (action.toLowerCase() === "display") {
				try {
					var preActivityParams = metaObject.preActivityParams;
					if (preActivityParams) {
						preActivityParams = JSON.parse(preActivityParams);
						var preActivityDynamicParams = preActivityParams.preActivityDynamicParams;
						delete preActivityParams.preActivityDynamicParams;
						metaObject.preActivityParams = JSON.stringify(preActivityParams);
						if (preActivityDynamicParams) {
							metaObject.preActivityDynamicParams = JSON.stringify(preActivityDynamicParams);
						}
					}
				} catch (e) {
					// BUG-526400 : Commented logs as throwing exceptions in console is blocking merges
					// console.error("Exception in finalizeNavURL: ", e);
				}

				try {
					var model = metaObject.model;
					if (model) {
						model = JSON.parse(model);
						var pyDataTransformDynamicParams = model.pyDataTransformDynamicParams;
						delete model.pyDataTransformDynamicParams;
						metaObject.model = JSON.stringify(model);
						if (pyDataTransformDynamicParams) {
							metaObject.pyDataTransformDynamicParams = JSON.stringify(pyDataTransformDynamicParams);
						}
					}
				} catch (e) {
					// BUG-526400 : Commented logs as throwing exceptions in console is blocking merges
					// console.error("Exception in finalizeNavURL: ", e);
				}
			}

			if (metaObject.landingAction && metaObject.landingAction === "openlanding") {
				oURL.put("landingAction", action);
			} else if (action.toLowerCase() !== "openworkbyurl") {
				oURL.put("action", action);
			}

			for (var key in metaObject) {
				metaValue = metaObject[key];
				if (metaValue === null || metaValue === "" || metaValue === undefined) {
					continue;
				}
				oURL.put(key, metaValue);
			}

			oURL.put("portalName", harCtxMgr.get('portalName'));
			oURL.put("portalThreadName", portalThreadName);
			oURL.put("tabIndex", 1);

			return oURL;
		};

		var createAndSwitchThread = function(threadName, mdcTarget) {
			if (!threadName && mdcTarget) {
				var recordId = pega.ui.MDCUtil.getActiveACDoc(mdcTarget);
				threadName = "STANDARD/" + recordId.toUpperCase();
			}

			pega.ui.ChangeTrackerMap.addTracker(threadName, new pega.ui.ChangeTracker());

			// ToDo: Check how the following properties are set in online.
			pega.ui.ChangeTrackerMap.getTrackers()["STANDARD"].isPrimary = false;
			pega.ui.ChangeTrackerMap.getTrackers()[threadName].isPrimary = true;
			pega.ui.ChangeTrackerMap.getTrackers()[threadName].threadName = threadName;
			pega.ui.ChangeTrackerMap.getTrackers()[threadName].id = pega.ui.ChangeTrackerMap.getTrackers()["STANDARD"].id + 1;
			pega.u.d.switchThread(threadName);
		};

		var modifyContextURL = function(mdcTarget) {
			var tempUrl = pega.ctx.url;
			var currentState = pega.redux.Utils.getAjaxContainerState(mdcTarget);
			if (currentState) {
				currentState.tempUrl = tempUrl;
			}
		};

		return {
			offlineHandler: offlineReturn,
			onlineHandler: onlineReturn,
			singlePageRenderer: singlePageRenderer
		};
	})();
	pud.UIActionRouter = UIActionRouter;
})(pega);
  //static-content-hash-trigger-GCC
var dynC = {
  retainLock : false,	/* whether to retain the lock on WO when closing the tab */


  cleanupForDC : function (dcCleanupCallback) {
    var pagesToRemove = "";
    if (!this.pyDeleteDocumentPgCompleted) {
      /*Remove the top level pages created for grid's filter criteria*/
      if (typeof Grids != "undefined" && Grids) {
        var gridsMap = pega.ctx.gridsMap;              
        for (var i in gridsMap) {
          if (gridsMap[i].bFilterable) {
            pagesToRemove += (pagesToRemove == "") ? gridsMap[i].gridFilterPage : "&" + gridsMap[i].gridFilterPage;
          }
          /* get SummaryReport pages bound to a tree grid */
          if (gridsMap[i].bTreegrid && gridsMap[i].RDContPage) {
            /* the page to which tree grid is bound  */
            var summaryPages = gridsMap[i].RDContPage;
            /* the page populated by executing summary report in RUF  UIEngine • populateSummaryView  */
            summaryPages += "&pgRepPg" + summaryPages.substring(6);

            pagesToRemove += (pagesToRemove == "") ? summaryPages : "&" + summaryPages;
          }
        }
      }
    }
    //if in a pop up (window == top) don't make ajax request HFIX-5207, as IE doesn't always close the ajax properly
    if (window != top || pega.ctx.bIsDCSPA) {
      var strURL = SafeURL_createFromURL(pega.u.d.url);
      var postData = new SafeURL();
      delete strURL.hashtable["pzTransactionId"];
      if (pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty('bExpressionCalculation')) {
        postData.put("pyRemCtlExpProp", "true");
      }
      var hID = document.getElementById("pzHarnessID");
      if(hID){
        postData.put("pzHarnessID", hID.value);
      }
      if (pagesToRemove != "") {
        postData.put("pyPagesToRemove", pagesToRemove);/* BUG-271051: Send "pyPagesToRemove" in post body to avoid long param values. */
        //oSafeURL.put("pyPagesToRemove", pagesToRemove);
      }
      if (pega.ui.ChangeTrackerMap.getTracker().id) {
        postData.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
      }

      postData.put("retainLock", pega.u.d.retainLock);
      if(pega.u.d.isRecentItemRemoved != undefined)
        postData.put("isRecentItemRemoved", pega.u.d.isRecentItemRemoved);
      if(pega.u.d.key!= undefined)
        postData.put("key", pega.u.d.key);
      if(pega.u.d.elementName != undefined)
        postData.put("elementName", pega.u.d.elementName);
      var dcCleanUp = "true";
      if(dcCleanupCallback){
        if(dcCleanupCallback.skipDCCleanUp){
          dcCleanUp = "false";
        }
        if(dcCleanupCallback.saveAsOnCurrentThread){
          postData.put("saveAsOnCurrentThread", dcCleanupCallback.saveAsOnCurrentThread);
        }
        if(dcCleanupCallback.clearThreadState){
          postData.put("clearThreadState", dcCleanupCallback.clearThreadState);
        }
      }
      postData.put("dcCleanup", dcCleanUp);
      postData.put("pyActivity", "DoClose");
      // invoke close call on a stable window, HFIX-5207, ENG-5564
      var oWnd = pega.desktop.support.getDesktopWindow();
      if (!oWnd) {
        oWnd = window;
      }
      if(dcCleanUp == "true" && !pega.ctx.bIsDCSPA){
        pega.u.d.skipCleanup = true;
        pega.u.d.harnessOnUnload();
        pega.u.d.onUnloads = [];
        pega.u.d.skipUnloads = true;
      }
      var strURL;
      if(oWnd.gIsMultiTenantPortal && typeof pega.u.d.getAbsoluteURL == "function"){
        strURL = pega.u.d.getAbsoluteURL(strURL);
      }else{
        strURL = strURL.toURL();
      }
      oWnd.pega.util.Connect.asyncRequest('POST', strURL, dcCleanupCallback, postData.toEncodedPostBody());

      this.pyDeleteDocumentPgCompleted = true;
    }
  },


  // 05/30/2013 GUJAS1 Added a new function to allow DC to attach CT notification callback.
  /*
	@public Registers a callback function which is invoked when CT changes are detected on the specified properties.
	@return $void$
	 */
  registerDCCTNotifyCallback : function (callback, context, data, triggerPropertyList) {
    if (typeof callback == "function") {
      if(!pega.u.d.dcctNotifyCallback){
        pega.u.d.dcctNotifyCallback = [callback];
        pega.u.d.dcctNotifyCallbackContext = [context];
        pega.u.d.dcctNotifyCallbackData = [data];
        pega.u.d.dcctNotifyTriggerPropertyList = [triggerPropertyList];
      }else{
        pega.u.d.dcctNotifyCallback[pega.u.d.dcctNotifyCallback.length] = callback;
        pega.u.d.dcctNotifyCallbackContext[pega.u.d.dcctNotifyCallbackContext.length] = context;
        pega.u.d.dcctNotifyCallbackData[pega.u.d.dcctNotifyCallbackData.length] = data;
        pega.u.d.dcctNotifyTriggerPropertyList[pega.u.d.dcctNotifyTriggerPropertyList.length] = triggerPropertyList;
      }
    }
  },

  /*
	@private If a DC CT notification callback is provided, this method invokes it.
	@return $void$
	 */
  notifyDCForCTChanges : function (ct) {
    var clearRecent = true;  
    if (typeof ct.changedPropertiesList == "object" && ct.changedPropertiesList.length > 0) {
      for (var j = 0; j < ct.changedPropertiesList.length; j++) {
        if ("Declare_pzRecentsCache.pyClearedRecentItems" == ct.changedPropertiesList[j]) {
          var recentsMetaInfo  = ct.trackedPropertiesList.Declare_pzRecentsCache.pyClearedRecentItems;
          delete ct.trackedPropertiesList.Declare_pzRecentsCache.pyClearedRecentItems;
          ct.changedPropertiesList.splice(j,1);
          pega.desktop.updateRecentList(recentsMetaInfo);
          clearRecent = false;
          break;
        }
      }
    }

    if (clearRecent && ct.currentCTJSONObj && ct.currentCTJSONObj.RequestorChangeSet) {
      var changedValues = ct.currentCTJSONObj.RequestorChangeSet.Values || [];
      var portalThreadName = pega.u.d.getPortalThreadName();
      var hasPyClearedRecentItems = false;

      for (var i = 0; i < changedValues.length; i++) {
        if (hasPyClearedRecentItems) break;
        var changeValueObj = changedValues[i];
        for (var threadName in changeValueObj) {
          if (hasPyClearedRecentItems) break;
          // check only for portal changeset in this case.
          if(threadName !== portalThreadName) continue;
          var threadObj = changeValueObj[threadName];
          for (var threadTrackerId in threadObj) {
            if (hasPyClearedRecentItems) break;
            var changedTrackerIdValues = threadObj[threadTrackerId];
            for (var key in changedTrackerIdValues) {
              var currentChangedPage = changedTrackerIdValues[key];
              if(key !== "Declare_pzRecentsCache") continue;
              if (currentChangedPage.pyClearedRecentItems) {
                pega.desktop.updateRecentList(currentChangedPage.pyClearedRecentItems);
                hasPyClearedRecentItems = true;
                break;
              }
            }
          } // TRACKERID loop
        } // THREAD loop
      }
    }

    // If no callback is registered, return.
    if (!pega.u.d.dcctNotifyCallback || !(pega.u.d.dcctNotifyCallback.length>0)) {
      return;
    }
    for(var cIndex= 0; cIndex<pega.u.d.dcctNotifyCallback.length;cIndex++){					
      // If no property list is specified, invoke callback without property list search
      if (!pega.u.d.dcctNotifyTriggerPropertyList || pega.u.d.dcctNotifyTriggerPropertyList[cIndex].length == 0) {
        // Invoke callback only if CT has changes.
        if (typeof ct.changedPropertiesList == "object" && ct.changedPropertiesList.length > 0) {
          pega.u.d.dcctNotifyCallback[cIndex].call(pega.u.d.dcctNotifyCallbackContext[cIndex], ct, pega.u.d.dcctNotifyCallbackData[cIndex]);
        }
      }
      // If property list is specified, iterate over CT changes to assure one of the properties
      // has changed and only then invoke the callback.
      if (typeof pega.u.d.dcctNotifyTriggerPropertyList[cIndex] == "object" && pega.u.d.dcctNotifyTriggerPropertyList[cIndex].length > 0) {
        if (typeof ct.changedPropertiesList == "object" && ct.changedPropertiesList.length > 0) {
          for (var i = 0; i < pega.u.d.dcctNotifyTriggerPropertyList[cIndex].length; i++) {
            for (var j = 0; j < ct.changedPropertiesList.length; j++) {
              if (pega.u.d.dcctNotifyTriggerPropertyList[cIndex][i] == ct.changedPropertiesList[j]) {
                pega.u.d.dcctNotifyCallback[cIndex].call(pega.u.d.dcctNotifyCallbackContext[cIndex], ct, pega.u.d.dcctNotifyCallbackData[cIndex]);
                break;
              }
            }
          }
        }
      }
    }
  },	
  /*
	 @api
	 It checks for #workarea and its tag data-responsiveDC
	 @return true if we find #workarea its data-responsiveDC attribute is true otherwise returns false
	 */
  _isJSResizeEnabled: function() {
    var oWorkAreaDiv = document.getElementById("workarea");
    var sJSresizeMarker = false;
    var oLayoutDiv = document.getElementById("layout-doc");
    if(oLayoutDiv  && oLayoutDiv.getAttribute('class') && oLayoutDiv.getAttribute('class').match("yui-layout-doc")){
      return false;
    }   
    if (oWorkAreaDiv){
      sJSresizeMarker = oWorkAreaDiv.getAttribute("data-responsiveDC");
    }
    sJSresizeMarker = (sJSresizeMarker=="true")?  true: false;
    return sJSresizeMarker;
  },
  /*
	 @api
	 Checks whether DC(based on element with id workarea) is there in the page or not. 
	 @return true or false
	 */
  _isDC: function(){
    return this.isDcExists();
  },
  /*
	 @api
	 Checks whether DC exists in the page or not(based on element with id workarea) is there in the page or not. 
	 @return true or false
	 */
  isDcExists: function(){

    return !!document.getElementById("workarea");
  },
  /*
	  @api
	  To get Document title of any normal iframed doc
	 */
    getDocTitle: function(gName) {
      var oWnd = pega.desktop.support.getDesktopWindow();
      var iframeId = gName + "Ifr";
      var iframeEle = oWnd.document.querySelector("#" + iframeId);
      return (iframeEle.contentDocument && iframeEle.contentDocument.title) ? iframeEle.contentDocument.title : "";
    },
  /*
  @api
  to get custom title of document loaded
  */
  getCustomTitle: function(ev, isDocLoaded) {
    if (ev.newValue && ev.newValue.GadgetName) {
      return ev.newValue.get('element').innerText;
    }
    // Tabbed case when same document is loaded
    else if (isDocLoaded) {
      if (ev.label) {
        return ev.get('element').innerText;
      }
      //Tabless DC case - negative case when gIsCustomTabHeaderEnabled is enabled
      else if (ev.GadgetName) {
        return pega.u.d.getDocTitle(ev.GadgetName);
      }
    }
    //For static section tab activation case
    else if (pega.u.d.portalDefaultTitle) {
      return pega.u.d.portalDefaultTitle;
    }     
   },
   /*
	  @api
	  Update window title to that of the active document's title
	 */
    updateWindowTitle: function(ev, isDocLoaded) {
      
      if (pega.u.d.SET_WINDOW_TITLE === false || (ev.newValue && ev.prevValue && (ev.newValue === ev.prevValue))) {
        return;
      }
      
      if (typeof updateWindowTitleWrapper !== 'undefined' && typeof updateWindowTitleWrapper === 'function' && updateWindowTitleWrapper) {
        try {
          updateWindowTitleWrapper(ev);
        } catch (e) {}
        return;
      }
      
      var oWnd = pega.desktop.support.getDesktopWindow();
      var title;
      /* When a custom tab header is configured */
      if (oWnd.gIsCustomTabHeaderEnabled) {
        title = pega.u.d.getCustomTitle(ev, isDocLoaded);
      } else {
        /*For normal tab labels and multi-doc iframed portal */
        if (ev.newValue && ev.newValue.GadgetName) {
          title = pega.u.d.getDocTitle(ev.newValue.GadgetName);
        }
        //When same document tab is re-loaded
        else if (isDocLoaded && ev.GadgetName) {
          title = pega.u.d.getDocTitle(ev.GadgetName);
        }
        //For static section tab activation case
        else if (pega.u.d.portalDefaultTitle) {
          title = pega.u.d.portalDefaultTitle;
        }
      }
      if (title)
        oWnd.document.title = title;
    }
};
pega.lang.augmentObject(pega.ui.Doc.prototype, dynC);
dynC = null;
//static-content-hash-trigger-GCC
var docDeprecated = {
	actionName : "",/*Used to store the name of the localaction used in Overlay*/
	cpm:false,  // CPM screen, allow removal of CPM overrides

	/* @public
	Functions to support the desktop RulesExplorer API
	@param $String$ actionName -Action name to be performed
	@param $SafeURL$ oParams -Other parameters
	@return $String$
	*/

	explorerFormExecuteAction:function(actionName, oParms)
	{
		switch(actionName)
	    {
		    case "FORM":
			case "SPLIT":
				return "FAILURE";
				break;
			case "ACTIVATE":
				//gToolbar.initAddAction(new Array(gToolbar.PRINT));
				break;
			case "REFRESH":
				if (!pega.u.d.isFormDirty()) {
					window.location.reload();
				}
				break;
			case "CLOSE":
				oUrl = new SafeURL("DoClose");
				oUrl.put("pzPrimaryPageName","pyWorkPage");
				//pega.u.d.harnessOnUnload();
				this.asyncRequest('POST', oUrl);
				break;
			case "PRINT":
				pega.u.d.doPrintDiv("HARNESS_CONTENT");
				break;
			case "DEACTIVATE":
				break;
			case "BUTTONACTION":
				var name =  oParms.get("name");
				var action =  oParms.get("action");
				if (name == "close") {
					// Implement R-20846
					pega.u.d.doButtonAction(name ,action);
				}
				break;
			default:
				return "FAILURE";
		}
		return "SUCCESS";
	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, docDeprecated);
//static-content-hash-trigger-GCC
var accordion = {

	panelAccorHeight : new Hashtable(),
	AccLen : new Array(),

	/*
	@Privtae - initializes all the accordian layouts present in the page
	@param
	@return $void$
	 */
	initializeAccor : function () {

		var accordionList = pega.util.Dom.getElementsById("PEGA_ACCORDION");
		if (accordionList == null)
			return;

		if (accordionList != null) {
			var accordionListLen = accordionList.length;
			for (var i = 0; i < accordionListLen; i++, pega.u.d.tabViewIndex++) {
				pega.u.d.AccLen.push(pega.u.d.tabViewIndex);
				accordionList[i].id = "PEGA_ACCORDION" + pega.u.d.tabViewIndex;
				pega.u.d.AccordionView(accordionList[i]);
			}
		}
	},


	markAccordionErrors : function () {
		var length = pega.u.d.AccLen.length;
		for (var ind = 0; ind < length; ind++) {
			var currentTabGroup = document.getElementById("PEGA_ACCORDION" + pega.u.d.AccLen[ind]);
			if (currentTabGroup) {
				var children = currentTabGroup.getElementsByTagName("ul")[0].childNodes;
				var childLen = children.length;
				for (var cnt = 0; cnt < childLen; cnt++) {
					if (children[cnt].nodeType == 1) {
						if (pega.util.Dom.getElementsById("PegaRulesErrorFlag", children[cnt])) {
							var newDivObj = document.createElement("div");
							newDivObj.style.display = "block";
							newDivObj.className = "iconErrorTabsDiv";
							newDivObj.innerHTML = "<span class='iconErrorTabs' title='The Section Contains Errors' id='PegaRULESErrorFlag'/>";
							var parentRow = children[cnt].getElementsByTagName("tr")[2];
							var targetTD = parentRow.getElementsByTagName("td")[0];
							targetTD.insertBefore(newDivObj, targetTD.getElementsByTagName("*")[0]);
						}
					}
				}
			}
		}
	},


	/*
	@Private - called to load a accordion contents
	@param $Object$  $  accordionObject, the HTMLElement(DIV) that represents the tabview.
	 */
	AccordionView : function (accordionObject) {
		var myTabs = new pega.ui.TabView(accordionObject);
		if (myTabs != null) {
			var myTabsLen = myTabs.get('tabs').length;
			var animHeight = 0;
			var accorWidth = 0;
			var hiddenElem;
			var panelType = null;
			var clickToLoadText = pega.u.d.fieldValuesList.get("CLICK_TO_LOAD_TEXT");
			var defaultIndex = accordionObject.getAttribute("defaultTab");
			var index = 0,
			defaultFound = false;
			var accordionUL = accordionObject.getElementsByTagName("ul")[0];
			myTabs._isSectionAccordion = (accordionUL && accordionUL.getAttribute("role")) ? true : false;
			if (pega.u.d && pega.u.d.portal) {
				panelType = pega.u.d.portal.getLayoutUnit(accordionObject);
			}
			if (panelType) {
				animHeight = panelType.offsetHeight - accordionObject.offsetHeight;
				pega.u.d.panelAccorHeight.put(panelType.id, animHeight);
				accorWidth = accordionObject.offsetWidth;
				hiddenElem = pega.util.Dom.getElementsById("pyCurrentSpace", accordionObject);
				this.portal.layoutObj.getUnitById(panelType.id).on('resize', pega.u.d.resizeAccordion);
				if (pega.util.Event.isIE) {
					pega.util.Dom.setStyle(accordionObject, 'width', (panelType.parentNode.offsetWidth));
				}
			}
			for (var i = myTabsLen - 1; i >= 0; i--) {
				var tab = myTabs.getTab(i);
				var tabGetContentEL = tab.get('contentEl');
				var liEl = tab.get("element");
                			if(liEl.id && myTabs._isSectionAccordion){
					pega.util.Event.addListener(liEl,"keydown",pega.u.d.accordionAccessibilityHandler);
                }
				tab.AnimHeight = 0;
				tab.labelValue = "";
				tab.panelId = null;
				if (panelType) {
					tab.AnimHeight = animHeight;
					tab.panelId = panelType.id;
					var accorTitleValue = "";
					var accorAnchTag = tab.getElementsByTagName('A');
					if (accorAnchTag) {
						accorTitleValue = accorAnchTag[0].getAttribute("accorTitle");
						if (accorTitleValue) {
							accorTitleValue = trim(accorTitleValue);
						}
						accorAnchTag[0].title = clickToLoadText + " " + accorTitleValue;
					}
					tab.labelValue = accorTitleValue;
					if (accorTitleValue && accorTitleValue.toUpperCase().indexOf("WORK") >= 0) {
						this.portal.accorIndex = i;
						this.portal.accorObj = myTabs;
					}
					tab.set('title', clickToLoadText + " " + accorTitleValue);
				} else {
					tab.set('title', pega.u.d.expandCollapseText);
				}
				tabGetContentEL.title = "";
				if (!tab.get('active')) {
					tab.get('element').className = 'unselected';
					if (tab.AnimHeight != 0) {
						pega.util.Dom.setStyle(tabGetContentEL, 'height', tab.AnimHeight);
						pega.util.Dom.setStyle(tabGetContentEL, 'width', accorWidth);
						panelType.style.overflow = 'hidden';
						panelType.isPreviousLayoutAccordion = 'true';
						tabGetContentEL.style.overflow = "auto";
						var firstChildDiv = tabGetContentEL;
						if (pega.util.Event.isIE) {
							tabGetContentEL.style.overflowX = "auto";
							if (firstChildDiv.scrollHeight < firstChildDiv.clientHeight) {
								tabGetContentEL.style.overflowY = "hidden";
							} else {
								tabGetContentEL.style.overflowY = "auto";
							}
							pega.util.Dom.setStyle(panelType.parentNode, 'overflow', 'auto');
						} else {
							tabGetContentEL.style.overflow = "auto";
						}

					}
					if (!defaultFound) {
						if (tab.get("id") == "Tab" + defaultIndex || i == 0) {
							defaultFound = true;
							index = i;
							if (tab.AnimHeight != 0 && hiddenElem) {
								hiddenElem[0].value = tab.labelValue;
								pega.util.Event.fireEvent(hiddenElem[0], 'change');
							}
							/* set height for default accordion only */
							if (pega.util.Event.isIE) {
								var elemHeight = pega.u.d.getHeight(tabGetContentEL);
								if (tab.AnimHeight == 0) {
									pega.util.Dom.setStyle(tabGetContentEL, 'height', elemHeight);
								}
							}
							/*Append Content inside the li*/
							tabGetContentEL.parentNode.removeChild(tabGetContentEL);
							tab.appendChild(tabGetContentEL);
							tab.set("contentAppended", "true");
						}
					}
				}
			}
			myTabs.addListener('activeTabChange', this.AccorActiveTabChange, {tabGrpDiv:accordionObject,tabGrp:myTabs});
			if (myTabsLen != 0) {
				var argsTmp = {
					tabGrpDiv : accordionObject,
					tabGrp : myTabs,
					secType : "accordion"
				};
				if (pega.u.d.harnessInit)
					argsTmp.focusElement = pega.u.d.initFocusOnFirstInput;

				myTabs.on('activeTabChange', this.setActiveTabIndex, argsTmp);
				myTabs.set('activeIndex', index);
			}
			pega.u.d.setAriaAttributes(myTabs, true);
			myTabs.contentTransition = this.AccorContentTransition;
		}
	},
	/*
	@Private - This is called everytime if there is active tab change and executed after content transition method
	 */
	AccorActiveTabChange : function(info,argsTmp){
		var newTab = info.newValue;
		var oldTab = info.prevValue;
		newTab.get('element').className = 'selected';

		var panelType = null;
		if (pega.u.d && pega.u.d.portal) {
			panelType = pega.u.d.portal.getLayoutUnit(argsTmp.tabGrpDiv);
		}
		if (panelType) {
			if (oldTab) {
				pega.u.d.SetAccorAnchorTitle(oldTab, true);
			}
			pega.u.d.SetAccorAnchorTitle(newTab, false);
			var tabGetContentEL = newTab.get('contentEl');
			var accordTabWidth = panelType.offsetWidth - tabGetContentEL.offsetLeft;
			pega.util.Dom.setStyle(tabGetContentEL, 'width', accordTabWidth);
		} else {
			if (oldTab) {
				oldTab.set('title', pega.u.d.expandCollapseText);
			}
			newTab.set('title', "");
		}
		pega.u.d.setAriaAttributes(argsTmp.tabGrp,true);
	},
  /*
  		TC-53223, TC-53224, TC-53225, TC-53226
  */
    accordionAccessibilityHandler : function(ev){
        var currentLi, activeStateCSSclass ;

        var LEFT = -1, RIGHT = 1;
        var LEFTARROW_KEY = '37', RIGHTARROW_KEY = '39', DOWNARROW_KEY = '40', UPARROW_KEY = '38', RETURN_KEY = '13', SPACE_KEY = '32';

        var isHandledKeyCode = function() {
            if ((ev.keyCode == LEFTARROW_KEY) ||
                    (ev.keyCode == RIGHTARROW_KEY) ||
                    (ev.keyCode == DOWNARROW_KEY) ||
                    (ev.keyCode == UPARROW_KEY) ||
                    (ev.keyCode == SPACE_KEY) ||
                    (ev.keyCode == RETURN_KEY)) {
                return true;
            }
            return false;
        }

        var getTargetSrc = function(ev) {
            currentLi = pega.util.Event.getTarget(ev);
            if(currentLi.tagName != "LI"){
                while (currentLi != null && (currentLi.id != "ACCORANCHOR")) {
                    currentLi = currentLi.parentNode;
                }
                if (currentLi&&currentLi.id == "ACCORANCHOR") currentLi = currentLi.parentNode;
            }
        };

        var moveAndFocus = function(direction) {
            var liToSet = pega.u.d.getNextOperableLi(direction, currentLi);
            if (liToSet != null) {
                liToSet.getElementsByTagName("a")[0].focus();
            }
        }

        var getDirectionToMove = function() {
            if (ev.keyCode == LEFTARROW_KEY || ev.keyCode == UPARROW_KEY) {
                return LEFT;
            }
            if (ev.keyCode == RIGHTARROW_KEY || ev.keyCode == DOWNARROW_KEY) {
                return RIGHT;
            }
            if (ev.keyCode == RETURN_KEY || ev.keyCode == SPACE_KEY) {
                return 0;
            }
            return 0; //stay put
        }

        if (!isHandledKeyCode()) {
            return;
        }

        currentLi = null;
        getTargetSrc(ev);
        if (!currentLi) {
            return;
        }

        switch (ev.type) {
            case 'keydown':
                var directionToMove = getDirectionToMove();
                if(directionToMove === 0){ //on enter and space keys select the accordion
                    currentLi.getElementsByTagName("A")[0].click();
                    pega.util.Event.preventDefault(ev);
                } else {
                    moveAndFocus(directionToMove);
                }
                break;
            default:
                break;
        }
    },
	/*
	@Private - Set title to Accordion tab anchors
	@param $Object$  tab contains the accordion value.
	@param $boolean$  bSetTitle used check whether to set title or not.
	 */
	SetAccorAnchorTitle : function (tab, bSetTitle) {
		var accorAnchTag = tab.getElementsByTagName('A');
		var clickToLoadText = pega.u.d.fieldValuesList.get("CLICK_TO_LOAD_TEXT");
		if (accorAnchTag) {
			if (bSetTitle) {
				tab.set('title', clickToLoadText + " " + tab.labelValue);
				accorAnchTag[0].title = clickToLoadText + " " + tab.labelValue;
			} else {
				tab.set('title', "");
				accorAnchTag[0].title = "";
			}
		}
	},

	/*
	@Private - Animates the accordion. collapses the oldtab , the newtab is expanded and made active
	@param $Object$  newTab contains the new accordion value.
	@param $Object$  oldTab contains the previous accordion value.
	 */
	AccorContentTransition : function (newTab, oldTab) {
		/*Retrieving attribute like this as YUI API of get() for finding the value of attribute contentAppended is not working in non IE browsers*/
		var contentAppended = newTab.get('element').getAttribute('contentAppended');
		if (!contentAppended || contentAppended == "false") {
			var tabContent = newTab.get('contentEl');
			/*BUG-102547 : STARTS*/
			var rteTextareas = {};
			var config = {};
			try {
				rteTextareas = $("#" + tabContent.id + " textarea[id^='PEGACKEDITOR']");
				if (rteTextareas) {
					for (var i = 0; i < rteTextareas.length; i++) {
						var myId = rteTextareas[i].id;
						config[i] = CKEDITOR.instances[myId].config;
						CKEDITOR.instances[myId].destroy();
					}
					/*BUG-196142 : Once the RTE is destroyed it has to be removed from HarnessElements list.*/
					var complexElements = pega.u.d.harnessElements;
					for(var i=0;i<complexElements.length;i++) {
						var ele = complexElements[i].element;
						if(ele && typeof ele.isRichTextEditor != undefined && ele.isRichTextEditor == true && ele.myEditor.status == "destroyed") {
							pega.u.d.harnessElements.splice(i,1);
							i--;//decrement loop counter as array length is reduced.
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
			/*BUG-102547 : ENDS*/

			tabContent.parentNode.removeChild(tabContent);
			newTab.appendChild(tabContent);

			/*BUG-102547 : STARTS*/
			try {
				if (rteTextareas) {
					for (i = 0; i < rteTextareas.length; i++) {
						var txtArea = rteTextareas[i];
						//CKEDITOR.replace(myId, config[i]);
						var showEditorInReadOnly = txtArea.getAttribute("showEditorInReadOnly");

						var usid = txtArea.getAttribute("usid");
						var txtNm = txtArea.getAttribute("name");
						var rteConfigs = txtArea.getAttribute("data-config");
						var rteConfigObj = pega.control.eventParser.parseJSON(rteConfigs);
						var rteAdvConfigs = txtArea.getAttribute("data-advConfig");
						var rteAdvConfigObj = pega.control.eventParser.parseJSON(rteAdvConfigs);

						pega.ui.rte = new pega.ui.RichTextEditor(txtNm, txtArea.id, usid, showEditorInReadOnly, rteConfigObj, rteAdvConfigObj);
					}
				}
			} catch (e) {
				console.log(e);
			}
			/*BUG-102547 : ENDS*/

			/*Setting value for  attribute like this as YUI API of get() for finding the value of attribute contentAppended is not working in non IE browsers*/
			newTab.get('element').setAttribute('contentAppended', 'true');

			/* set height for the accordion currently being shown */
			if (pega.util.Event.isIE) {
				var elemHeight = pega.u.d.getHeight(tabContent);
				if (newTab.AnimHeight == 0) {
					pega.util.Dom.setStyle(tabContent, 'height', elemHeight);
				}
			}
		}
		if (newTab.anim && newTab.anim.isAnimated()) {
			newTab.anim.stop(true);
		}
		if (oldTab.anim && oldTab.anim.isAnimated()) {
			oldTab.anim.stop(true);
		}
		oldTab.get('element').className = 'unselected';

		pega.u.d.AnimateAccordion(oldTab, "collapse");
		pega.u.d.AnimateAccordion(newTab, "expand");
	},

	/*
	@Private - Animates the accordion. collapses the oldtab , the newtab is expanded and made active
	called from the AccorContentTransition
	@param $Object$  tabObject contains the newTab/oldTab value.
	@param $Object$  animType contains the string "expand"/"collapse" value.
	 */
	AnimateAccordion : function (tabObject, animType) {
		var animHeight = tabObject.AnimHeight;
		if (animHeight != 0 && tabObject.panelId != null) {
			var resizeAnimHeight = pega.u.d.panelAccorHeight.get(tabObject.panelId);
			if (resizeAnimHeight != animHeight) {
				animHeight = resizeAnimHeight;
				tabObject.AnimHeight = resizeAnimHeight;
			}
		}
		var tabContentEL = tabObject.get('contentEl');
		if (!pega.util.Event.isIE) {
			var divHeight = pega.u.d.getHeight(tabContentEL);
		}

		tabObject.anim = tabObject.anim || new pega.util.Anim(tabContentEL);
		if (pega.util.Event.isIE) {
			var divHeight = pega.u.d.getHeight(tabContentEL);
		}
		if (animType == "expand") {
			tabObject.anim.onStart.subscribe(this.newTabShowContent, tabObject, tabObject);
			tabObject.anim.onComplete.subscribe(this.newTabHideContent, tabObject, tabObject);
		} else if (animType == "collapse") {
			tabObject.divHeight = divHeight;
			tabObject.anim.onComplete.subscribe(this.oldTabHideContent, tabObject, tabObject);
		}

		if (animType == "expand") {
			if (animHeight == 0) {
				tabObject.anim.attributes.height = {
					from : 0,
					to : divHeight
				};
			} else {
				tabObject.anim.attributes.height = {
					from : 0,
					to : animHeight
				};
			}
		} else if (animType == "collapse") {
			if (animHeight == 0) {
				tabObject.anim.attributes.height = {
					from : divHeight,
					to : 1
				};
			} else {
				tabObject.anim.attributes.height = {
					from : animHeight,
					to : 1
				};
			}
		}
		tabObject.anim.useSeconds = false;
		tabObject.anim.duration = pega.u.d.AccordionAnimSpeed;
		tabContentEL.style.overflow = "hidden";
		tabObject.anim.animate();
	},

	/*
	@Private - called after the animation of the new Accordion
	 */
	newTabHideContent : function () {
		var firstChildDiv = pega.u.d.getFirstChildObj(this.get('contentEl'));
		if (this.AnimHeight != 0) {
			if (pega.util.Event.isIE) {
				this.get('contentEl').style.overflowX = "auto";
				if (firstChildDiv.scrollHeight < firstChildDiv.clientHeight) {
					this.get('contentEl').style.overflowY = "hidden";
				} else {
					this.get('contentEl').style.overflowY = "auto";
				}
			} else {
				this.get('contentEl').style.overflow = "auto";
			}
		} else {
			this.get('contentEl').style.overflow = "visible";
			firstChildDiv.style.overflow = "visible";
		}
		this.anim.onComplete.unsubscribe(pega.u.d.newTabHideContent);
		if (this.AnimHeight == 0) {
			pega.u.d.resizeHarness();
		}
		if (this.AnimHeight != 0) {
			var hiddenElem = pega.util.Dom.getElementsById("pyCurrentSpace");
			if (hiddenElem) {
				hiddenElem[0].value = this.labelValue;
				pega.util.Event.fireEvent(hiddenElem[0], 'change');
			}
		}
	},
	/*
	@Private -called before the animation of the new Accordion
	 */

	newTabShowContent : function () {
		this.set('contentVisible', true);
		this.anim.onStart.unsubscribe(pega.u.d.newTabShowContent);

	},
	/*
	@Private -called after the animation of the old Accordion
	 */
	oldTabHideContent : function () {
		this.set('contentVisible', false);
		if (!pega.util.Event.isIE) {
			if (this.AnimHeight == 0) {
				pega.util.Dom.setStyle(this.get('contentEl'), 'height', this.divHeight + 'px');
			} else {
				pega.util.Dom.setStyle(this.get('contentEl'), 'height', this.AnimHeight + 'px');
			}
		}
		this.anim.onComplete.unsubscribe(pega.u.d.oldTabHideContent);
	},

	/*
	@Private - called to get the element height for accordion
	 */
	getHeight : function (elm) {
		var D = pega.util.Dom;
		var clipped = false;
		if (elm.style.display == 'none') {
			clipped = true;
			var _pos = D.getStyle(elm, 'position');
			var _vis = D.getStyle(elm, 'visiblity');
			D.setStyle(elm, 'position', 'absolute');
			D.setStyle(elm, 'visiblity', 'hidden');
			D.setStyle(elm, 'display', 'block');
			D.setStyle(elm, 'height', 'auto');
		}
		var height = elm.offsetHeight;
		if (height == 'auto') {
			D.setStyle(elm, 'zoom', '1');
			height = elm.clientHeight;
		}
		if (clipped) {
			D.setStyle(elm, 'display', 'none');
			D.setStyle(elm, 'visiblity', _vis);
			D.setStyle(elm, 'position', _pos);
		}
		return parseInt(height);
	},

	/*
	@Private - gets all the accordions and resizes the active accordion content. called by resizeharness()
	 */
	resizeAccordion : function () {
		var accordArr = new Array();
		var totalIndex = pega.u.d.tabViewIndex;
		var accordDivRef = null;
		for (var i = 0; i < totalIndex; i++) {
			accordDivRef = document.getElementById('PEGA_ACCORDION' + i);
			if (accordDivRef != null) {
				accordArr.push(accordDivRef);
			}
		}
		var accordArrLength = accordArr.length;
		var panelType = null;
		//BUG-81044 start cherj to remove overflow hidden on panel div, when it do not contain accordion layouts
		if (accordArrLength == 0 && pega.u.d && pega.u.d.portal) {
			var allLayoutUnits = pega.u.d.portal.getLUs();
			if (allLayoutUnits && allLayoutUnits.units) {
				var unitsCount = allLayoutUnits.units.length;
				for (var layoutIndex = 0; layoutIndex < unitsCount; layoutIndex++) {
					var unitDiv = document.getElementById(allLayoutUnits.units[layoutIndex].body);
					var accorDivs = unitDiv.getElementsByTagName('DIV');
					if (accorDivs && unitDiv.isPreviousLayoutAccordion == 'true') {
						for (var accorIndex = 0; accorIndex < accorDivs.length; accorIndex++) {
							if (accorDivs[accorIndex].id && accorDivs[accorIndex].id.match(/^PEGA_ACCORDION[\d]*/)) {
								break;
							} else if (accorIndex == (accorDivs.length - 1) && unitDiv.style) {
								if (unitDiv.style.overflow == 'hidden') {
									unitDiv.style.overflow = '';
									unitDiv.isPreviousLayoutAccordion = 'false';
								}
							}
						}
					}
				}
			}
		}
		//BUG-81044 END cherj to remove overflow hidden on panel div, when it do not contain accordion layouts

		for (var i = accordArrLength - 1; i >= 0; i--) {
			accordDivRef = accordArr[i];
			if (pega.u.d && pega.u.d.portal) {
				panelType = pega.u.d.portal.getLayoutUnit(accordDivRef);
			}
			if (pega.util.Event.isIE && panelType) {
				pega.util.Dom.setStyle(accordDivRef, 'width', (panelType.parentNode.offsetWidth));
			}
			var children = accordDivRef.getElementsByTagName("ul")[0].childNodes;
			var childLen = children.length;
			for (var cnt = 0; cnt < childLen; cnt++) {
				if (children[cnt].nodeType == 1 && children[cnt].tagName == 'LI') {
					var contentDivs = children[cnt].childNodes;
					for (var divcnt = 0; divcnt < contentDivs.length; divcnt++) {
						if (contentDivs[divcnt].nodeType == 1 && contentDivs[divcnt].tagName == 'DIV' && contentDivs[divcnt].style.display == 'block') {
							var activeTabDivContent = contentDivs[divcnt];
							var newHeight = 0;
							var firstChildDiv = pega.u.d.getFirstChildObj(activeTabDivContent);
							if (!pega.util.Event.isIE && !panelType) {
								newHeight = this.getHeight(firstChildDiv);
								/*BUG-98612 : Taking care of the padding while setting height only in standards mode.*/
								if (pega.u.d.inStandardsMode) {
									newHeight = newHeight + parseInt(pega.util.Dom.getStyle(activeTabDivContent, "paddingTop")) + parseInt(pega.util.Dom.getStyle(activeTabDivContent, "paddingBottom"));
								}
							}
							var activeTabAnim = new pega.util.Anim(activeTabDivContent);
              var newTabHideContent = function () {
								if (panelType) {
									if (pega.util.Event.isIE) {
										activeTabDivContent.style.overflowX = "auto";
										if (firstChildDiv.scrollHeight < firstChildDiv.clientHeight) {
											activeTabDivContent.style.overflowY = "hidden";
										} else {
											activeTabDivContent.style.overflowY = "auto";
										}
									} else {
										activeTabDivContent.style.overflow = "auto";
									}
								}
								activeTabAnim.onComplete.unsubscribe(newTabHideContent);
							};
							activeTabAnim.useSeconds = false;
							activeTabAnim.duration = pega.u.d.AccordionAnimSpeed;
							if (panelType) {
								if (pega.util.Event.isIE) {
									pega.util.Dom.setStyle(accordDivRef, 'width', (panelType.parentNode.offsetWidth));
								}
								newHeight = panelType.offsetHeight - accordDivRef.offsetHeight + activeTabDivContent.offsetHeight;
								var accordTabWidth = panelType.offsetWidth - activeTabDivContent.offsetLeft;
								pega.util.Dom.setStyle(activeTabDivContent, 'width', accordTabWidth);
							} else if (pega.util.Event.isIE && !panelType) {
								newHeight = this.getHeight(firstChildDiv);
								/*BUG-85462: Taking care of the padding while setting height only in standards mode.*/
								if (pega.u.d.inStandardsMode) {
									newHeight = newHeight + parseInt(pega.util.Dom.getStyle(activeTabDivContent, "paddingTop")) + parseInt(pega.util.Dom.getStyle(activeTabDivContent, "paddingBottom"));
								}
							}
							if (panelType && newHeight > 1) {
								pega.u.d.panelAccorHeight.put(panelType.id, newHeight);
							}
							activeTabAnim.onComplete.subscribe(newTabHideContent, activeTabAnim, activeTabAnim);
							activeTabAnim.attributes.height = {
								to : newHeight
							};
							activeTabAnim.animate();
							break;
						}
					}
				}
			}
		}
	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, accordion);
//static-content-hash-trigger-GCC
var expandC = {
  
	/*
	@protected- This function is used to toggle the expansion and collapse of sections of the screen.
	Usually the user clicks on the header.
	It will internally call expandIt it target is not of type input, select, button, anchor, image, textarea
	@param $Object$expandElement  Expand or collapse Element.
	@return $void$ -
	 */
  expandDivNode : null,
	expandHeader : function (expandElement, event, container, bFromKeyboard) {
      	event = event || window.event;
		var target = pega.util.Event.getTarget(event);

		var $headerEle = pega.ctx.dom.$(target).closest(".header");
      	var isEqualNode = ($headerEle && $headerEle.length !=0) ? $headerEle[0].isEqualNode(expandElement) : true;
      	if(!isEqualNode)
          return;

		if(bFromKeyboard && event.keyCode != 32 && event.keyCode != 13)
			return;
      	/*BUG-220963 : in case of chrome, when button is clicked target element is div whereas it is button in IE*/
        var parentEle = target;
        var i = 0;
        while(parentEle && i<=7){
          if(parentEle.tagName && parentEle.tagName.toLowerCase() == "button"){
            target = parentEle;
            break;
          }
          parentEle = parentEle.parentNode;
          i++;
        }


		if (!target.tagName.match(/^(input|select|textarea|button|a|option)$/gi)) {
			 /* Code to handle icons */
			if(target.tagName.toLowerCase() == "i" || target.tagName.toLowerCase() == "img") { /*BUG-158775: Stopping icons/controls present on the header from expanding/collapsing the header on click.*/
				if((target.getAttribute("data-ctl") && target.getAttribute("data-ctl") == "Icon") || (target.getAttribute("data-click"))) {
					return;
				}
			}

			if (container) {
				this.loadContainer(expandElement, event, container);
			} else {
				this.expandIt(expandElement, event);
			}
			this.setARIAAttributesForHeader(expandElement, event);
		}
	},
	setARIAAttributesForHeader : function(element,event) {
		var title = element.getAttribute("aria-label");
    var expandCollapseBtn ;
                if (typeof gStrClickToExpandText == 'undefined')
			gStrClickToExpandText = "";
		if (typeof gStrClickToCollapseText == 'undefined')
			gStrClickToCollapseText = "";
		if(title != null && title != ""){
			title =  title.replace(gStrClickToExpandText, "");
			title =  title.replace(gStrClickToCollapseText, "");
		}

		if(element.tagName == "TABLE")
			var expandPlusMinus=pega.util.Dom.getElementsById("EXPAND-PLUSMINUS",element)[0];
		else if(element.tagName === "DIV"){
			var expandPlusMinus = pega.util.Dom.getFirstChild(element); /* US-129487: Changing to API call so as to avoid problems with templatized UI */
      expandCollapseBtn = element.querySelector(".header-content>.header-title>.dl-accordion-btn");
    }

		if((element.tagName == "DIV" && element.parentNode.className.indexOf("Expanded") != -1)  || (element.tagName == "TABLE" && element.className.indexOf("Expanded") != -1)) {
      if(expandCollapseBtn) {
        expandCollapseBtn.setAttribute("aria-expanded",true);
        return;
      }
			element.setAttribute("aria-expanded",true);
			element.setAttribute("aria-label", gStrClickToCollapseText + title);
			if(expandPlusMinus && expandPlusMinus.title != "")
				expandPlusMinus.setAttribute("title", gStrClickToCollapseText + title);
		} else {
      if(expandCollapseBtn) {
        expandCollapseBtn.setAttribute("aria-expanded",false);
        return;
      }
			element.setAttribute("aria-expanded",false);
			element.setAttribute("aria-label", gStrClickToExpandText + title);
			if(expandPlusMinus && expandPlusMinus.title != "")
				expandPlusMinus.setAttribute("title", gStrClickToExpandText + title);
		}

		element.blur();

		var widthHolder = element.style.width;//BUG FIX FOR BUG-135075 UIReg:EGG Column repeat with Sub format is shifted to the left
		element.style.width = "100px";//BUG FIX FOR BUG-135075 UIReg:EGG Column repeat with Sub format is shifted to the left
		/*
		THE IDEA IS TO CONFINE THE ELEMENT'S DIMENSIONS WITHIN THE VISIBLE SCREEN AREA OF THE BROWSER WINDOW JUST BEFORE FOCUSING IT
		SO THAT THE BROWSER DOES NOT FEEL THE NEED TO AUTOMATICALLY SCROLL ON FOCUS. IN OTHER CASES, HEIGHT MIGHT ALSO NEED TO BE MODIFIED.
		100PX FOR WIDTH IS JUST A SMALL VALUE WHICH FIXES THIS BUG. OTHER SIMILAR SCROLL ON FOCUS CASES MIGHT NEED DIFFERENT STYLE CHANGES.
		*/
		element.focus();

		element.style.width = widthHolder;//BUG FIX FOR BUG-135075 UIReg:EGG Column repeat with Sub format is shifted to the left
	},

	/*
	@protected- This function is used to toggle the expansion and collapse of sections of the screen.
	Usually the user clicks on an "+" or "-" or an image.  This function will either start
	at the event or the given "expandElement".  This function will parse up the parent tree
	until it hits the first element named "EXPAND-OUTERFRAME". From here, it will find the
	FIRST child named "EXPAND-INNERDIV".  If this element is "display: none" it will change
	it to "display: "" " and vice versa.  As well, it will modify the "EXPAND-PLUSMINUS"
	element to reflect the appropiate symbol (+ or -).
	@param $Object$expandElement  Expand or collapse Element.
	@return $void$ -
	 */

	expandIt : function (expandElement, event) {
		event = event == undefined ? window.event : event;
		var expandDiv;
		var expandPlusMinus;
		var expandSummary;
		var localTable;
		var expandIndicator;
		var expName;
		var setStyleRef = pega.util.Dom.setStyle;

		//Added to handle toggle expansion,collapse of sections in SmartInfo - Begin
		var isSIElem = false;
		var tempExpandElement;
		//Added to handle toggle expansion,collapse of sections in SmartInfo - End

		if (expandElement == null) {
			expandElement = pega.util.Event.getTarget(event);
		}
		tempExpandElement = expandElement;

		localTable = pega.u.d.findParentTable(expandElement);

		if (expandElement != null) {
			var expandedTitleBarTableClass = expandElement.className;
			if (expandElement.id == "RULE_KEY" && expandElement.getAttribute("node_type") != null && expandElement.getAttribute("node_type") == "HEADER" && expandedTitleBarTableClass != null && expandedTitleBarTableClass.indexOf("header-bar") == -1) {
				if (expandElement.className.indexOf("titleBarBorderExpanded") >= 0) {
					expandElement.className = expandElement.className.replace("titleBarBorderExpanded", "titleBarBorderCollapsed");
				} else {
					expandElement.className = expandElement.className.replace("titleBarBorderCollapsed", "titleBarBorderExpanded");
				}
			}
		}
		while (expandElement.id != "EXPAND-OUTERFRAME") {
			expandElement = expandElement.parentNode;
			if (expandElement == null)
				return;
		}

		//To set the height of the TD in case of section embedded in
		var parentTR = expandElement;
		while (parentTR.id != "RULE_KEY") {
			parentTR = parentTR.parentNode;
			if (parentTR == null)
				break;
		}
		while (parentTR && parentTR.tagName != "TR") {
			parentTR = parentTR.parentNode;
			if (parentTR == null)
				break;
		}

		//Added to handle toggle expansion,collapse of sections in SmartInfo - Begin
		while ((tempExpandElement != null) && (tempExpandElement.id != "smartInfoBody")) {
			tempExpandElement = tempExpandElement.parentNode;
			if (tempExpandElement != null) {
				if (tempExpandElement.id == "smartInfoBody") {
					isSIElem = true;
					break;
				}
			}
		}
		//Added to handle toggle expansion,collapse of sections in SmartInfo - End

      	var $parentObj = pega.ctx.dom.$(pega.util.Event.getTarget(event));
		var $expandPlusMinus = $parentObj.closest("[id='EXPAND-PLUSMINUS']");
      	expandDiv = $expandPlusMinus.siblings("[id='EXPAND-INNERDIV']");

      	if(expandDiv && expandDiv != null && expandDiv.length != 1)
			expandDiv = pega.util.Dom.getElementsById("EXPAND-INNERDIV", expandElement);

		if (expandDiv != null) {
			// if more than one, select the first one
			if (expandDiv.length != null)
				expandDiv = expandDiv[0];
		}
		expandPlusMinus = pega.util.Dom.getElementsById("EXPAND-PLUSMINUS", expandElement);
		var expandPlusMinusClassName = null;
		if (expandPlusMinus != null) {
			if (expandPlusMinus.length != null) {
				expandPlusMinus = expandPlusMinus[0];
				expandPlusMinusClassName = expandPlusMinus.className;
			}
		}

		// find expand indicator
		expandIndicator = pega.util.Dom.getElementsById("EXPAND-INDICATOR", expandDiv);

		if (expandIndicator != null) {
			if (expandIndicator.length != null)
				expandIndicator = expandIndicator[expandIndicator.length-1];
		}

		if (!isSIElem) {
			if (pega.util.Dom.getStyle(expandDiv, "display") == "none") {
				// not expanded, so expand it

				setStyleRef(expandDiv, "display", "");

				if (parentTR) {
					var tdElements = pega.ctx.dom.getElementsByTagName("TD", parentTR);
					var tdElementsLength = tdElements.length;
					for (var i = 0; i < tdElementsLength; i++) {
						if (tdElements[i].parentNode == parentTR) {
							if (tdElements[i].getAttribute("prevHeight")) {
								setStyleRef(tdElements[i], "height", tdElements[i].getAttribute("prevHeight"));
							}
						}
					}
				}

				if (expandPlusMinus != null) {
					// if name and className are not null, use CSS class to
					// indicate open/closed state
					if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
						expandPlusMinus.className = expandPlusMinusClassName.replace(/Collapsed/gi, "Expanded");
					}
					// otherwise, use innerHTML text
					else {
						expandPlusMinus.innerHTML = "-&nbsp;";
					}
					if (typeof(pega.ui.textarea) != "undefined") {
						pega.ui.textarea.resizeAllExpandedTextAreas(true);
					}
					if (expandIndicator != null)
						expandIndicator.value = "true";
					pega.u.d.expandAllStyles(expandPlusMinus);
				}
			} else {

				// expanded, so compress it
				setStyleRef(expandDiv, "display", "none");

				if (parentTR) {
					var tdElements = pega.ctx.dom.getElementsByTagName("TD", parentTR);
					var tdElementsLength = tdElements.length;
					var expandPlusMinusHeight = pega.util.Dom.getStyle(expandPlusMinus, "height");
					for (var i = 0; i < tdElementsLength; i++) {
						var thisTdElement = tdElements[i];
						var tdElementStyleHeight = thisTdElement.style.height;
						if (thisTdElement.parentNode == parentTR && tdElementStyleHeight != "") {
							thisTdElement.setAttribute("prevHeight", tdElementStyleHeight);
							if (expandPlusMinus)
								setStyleRef(thisTdElement, "height", expandPlusMinusHeight);
						}
					}
				}

				if (expandPlusMinus != null) {
					// if name and className are not null, use CSS class to
					// indicate open/closed state
					if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
						expandPlusMinus.className = expandPlusMinusClassName.replace(/Expanded/gi, "Collapsed");
					}
					// otherwise, use innerHTML text
					else {
						expandPlusMinus.innerHTML = "+";
					}
					if (expandIndicator != null)
						expandIndicator.value = "false";
					pega.u.d.collapseAllStyles(expandPlusMinus);
				}
			}
		}
		//Added to handle toggle expansion,collapse of sections in SmartInfo - Begin
		else {
			var isInitiallyCollapsed = false;
			var isInitallyExpanded = false;
			var expandDivStyleVisibility = expandDiv.style.visibility;
			var expandDivStyleDisplay = expandDiv.style.display;

			if (expandDivStyleVisibility == "") {
				if (expandDivStyleDisplay == "none") {
					isInitiallyCollapsed = true;
				} else if (expandDivStyleDisplay == "") {
					isInitallyExpanded = true;
				}
			} else if (expandDivStyleVisibility == "visible") {
				if (expandDivStyleDisplay == "block") {
					isInitiallyCollapsed = true;
				} else {
					isInitallyExpanded = true;
				}
			} else if (expandDivStyleVisibility == "hidden") {
				if (expandDivStyleDisplay == "none") {
					isInitiallyCollapsed = true;
				} else {
					isInitallyExpanded = true;
				}
			}
			if (isInitiallyCollapsed) {
				if (expandDivStyleDisplay == "none") {
					expandDiv.style.display = "block";
					expandDiv.style.visibility = "visible";
					//get the List of TextAreas
					var txtAreas = pega.ctx.dom.getElementsByTagName("textarea", expandDiv);
					var textAreasLength = txtAreas.length;
					for (var i = 0; i < textAreasLength; i++) {
						txtAreas[i].cols = 47;
					}
					if (expandPlusMinus != null) {
						// if name and className are not null, use CSS class to
						// indicate open/closed state
						if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
							expandPlusMinus.className = expandPlusMinusClassName.replace(/Collapsed/gi, "Expanded");
						}
						// otherwise, use innerHTML text
						else {
							expandPlusMinus.innerHTML = "-&nbsp;";
						}
					}
					if (expandIndicator != null)
						expandIndicator.value = "true";
					pega.u.d.expandAllStyles(expandPlusMinus);
				} else {
					// expanded, so compress it
					expandDiv.style.visibility = "hidden";
					expandDiv.style.display = "none";
					var siBodyDiv = pega.util.Dom.getElementsById("smartInfoBody", document);
					if (siBodyDiv && siBodyDiv.length) {
						siBodyDiv = siBodyDiv[0];
					}
					setStyleRef(siBodyDiv, "overflow", "");
					if (expandPlusMinus != null)
						// if name and className are not null, use CSS class to
						// indicate open/closed state
						if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
							expandPlusMinus.className = expandPlusMinusClassName.replace(/Expanded/gi, "Collapsed");
						}
					// otherwise, use innerHTML text
					else {
						expandPlusMinus.innerHTML = "+";
					}
					if (expandIndicator != null)
						expandIndicator.value = "false";
					pega.u.d.collapseAllStyles(expandPlusMinus);
				}
			} else if (isInitallyExpanded) {
				if (expandDivStyleVisibility == "hidden") {
					expandDiv.style.visibility = "";
					expandDiv.style.display = "";
					if (expandPlusMinus != null) {
						// if name and className are not null, use CSS class to
						// indicate open/closed state
						if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
							expandPlusMinus.className = expandPlusMinusClassName.replace(/Collapsed/gi, "Expanded");
						}
						// otherwise, use innerHTML text
						else {
							expandPlusMinus.innerHTML = "-&nbsp;";
						}
					}
					if (expandIndicator != null)
						expandIndicator.value = "true";
					pega.u.d.expandAllStyles(expandPlusMinus);
				} else {
					// expanded, so compress it
					expandDiv.style.visibility = "hidden";
					expandDiv.style.display = "";
					if (expandPlusMinus != null)
						// if name and className are not null, use CSS class to
						// indicate open/closed state
						if (expandPlusMinus.getAttribute("name") != null && expandPlusMinusClassName != null) {
							expandPlusMinus.className = expandPlusMinusClassName.replace(/Expanded/gi, "Collapsed");
						}
					// otherwise, use innerHTML text
					else {
						expandPlusMinus.innerHTML = "+";
					}
					if (expandIndicator != null)
						expandIndicator.value = "false";
					pega.u.d.collapseAllStyles(expandPlusMinus);
				}
			}
		}
		//Added to handle toggle expansion,collapse of sections in SmartInfo - End

		// because EXPAND-SUMMARY-TD is in the table with the
		// "+ - ", we need to look at the localTable as the parent
		//
		expandSummary = pega.util.Dom.getElementsById("EXPAND-SUMMARY-TD", localTable);

		if (expandSummary != null) {
			// if more than one, select the first one
			if (expandSummary.length != null)
				expandSummary = expandSummary[0];
			if (pega.util.Dom.getStyle(expandSummary, "display") == "none") {
				// not expanded, so expand it
				setStyleRef(expandSummary, "display", "");
			} else {
				// expanded, so compress it
				setStyleRef(expandSummary, "display", "none");
			}
		}
		// if there is a function to be invoked after expand, invoke it
		if (window.postExpand) {
			postExpand();
		}
		pega.u.d.resizeHarness();
	},

	/*
	@Handler
	@protected Toggles the expansion/collapse of all harness sections.
	It is attached to the header bar plus/minus icons.
	@return $void$
	 */

	toggleExpandCollapse : function (event) {
		event = event == undefined ? window.event : event;
		pega.util.Event.stopEvent(event);

      	/* BUG-279015 */
      	var parentTab = pega.ctx.dom.$(event.target).parents("[class^='tabbed_']").length > 0 ? pega.ctx.dom.$(event.target).parents("[class^='tabbed_']")[0] : document;

		// get sets of elements for expansion/collapse
       	var arExpandDivs = pega.util.Dom.getElementsById("EXPAND-INNERDIV", parentTab);
        var arPlusMinus = pega.util.Dom.getElementsById("EXPAND-PLUSMINUS", parentTab);


		var ev = pega.util.Event.getTarget(event);
         /* BUG-564506: one Expand-Collapse action affects other Collapsible layouts */
         if(null !== arExpandDivs && null !== arExpandDivs.length){
            for (var i = 0; i < arExpandDivs.length; i++) {
               if(arExpandDivs[i].parentElement && arExpandDivs[i].parentElement.contains(ev)){
                arExpandDivs = arExpandDivs[i];
                break;
                }
				    }
         }
        /*BUG-205459: Expand/Collapse is not working on first click*/
        if(ev && ev.getAttribute("isExpanded") == null ){
            var isExpanded = true;
          	if (arExpandDivs != null) {
				if (arExpandDivs.length != null) {
					for (var el = 0; el < arExpandDivs.length; el++) {
						this.expandDivNode = arExpandDivs[el];
						if (pega.util.Dom.getStyle(this.expandDivNode, "display") == "none") {
							isExpanded = false;
						}
					}
				} else {
					// only one
					this.expandDivNode = arExpandDivs;
					if (pega.util.Dom.getStyle(this.expandDivNode, "display") == "none") {
						isExpanded = false;
					}
				}
		   }
          if(!isExpanded){
            ev.setAttribute("isExpanded", "false");
          }
        }
		if (event) {
			if (ev.getAttribute("isExpanded") == "false") {
				try {
					this.doExpandCollapse("expand", arExpandDivs, arPlusMinus, event);
					ev.setAttribute("isExpanded", "true");
					ev.title = gStrCollapseAllText;
					if (ev.getAttribute("isIcon") == "true" || ev.getAttribute("data-ctl") == "Icon") {
						if (pega.util.Event.isSafari && !pega.u.d.isCollapsed && pega.util.Dom.setAttribute) {
							pega.util.Dom.setAttribute(ev, "buttonclass", "iconCollapseAll");
						} else {
							ev.setAttribute("buttonClass", "iconCollapseAll");
						}
						ev.className = "iconCollapseAll";
					}
				} catch (e) {}
			} else {
				try {
					this.doExpandCollapse("collapse", arExpandDivs, arPlusMinus, event);
					ev.setAttribute("isExpanded", "false");
					ev.title = gStrExpandAllText;
					if (ev.getAttribute("isIcon") == "true" || ev.getAttribute("data-ctl") == "Icon") {
						ev.setAttribute("buttonClass", "iconExpandAll");
						ev.className = "iconExpandAll";
						pega.u.d.isCollapsed = 1;
					}
				} catch (e) {}
			}
			//			pega.desktop.support.resizeGadget();
		}
		//		pega.desktop.support.resizeGadget();
	},

	/*
	@protected This function do the Expand/Collapse all of a harness' expandable page elements
	and resets their CSS class names appropriately.
	Called from the toggleExpandCollapse()
	@param $string$sAction
	@param $Array$arExpandDivs
	@param $Array$arPlusMinus
	@return $void$
	 */

	doExpandCollapse : function (sAction, arExpandDivs, arPlusMinus, event) {
		event = (event == undefined) ? window.event : event;
		var arrowNode;
		var arrowSrc;
		var el;
		var arTextAreas = pega.util.Dom.getElementsById("CTRL_TA", document);
		// Expand all elements
		if (sAction == "expand") {
			// Expand all the DIV's
			if (arExpandDivs != null) {
				if (arExpandDivs.length != null) {
					for (el = 0; el < arExpandDivs.length; el++) {
						this.expandDivNode = arExpandDivs[el];
						if (pega.util.Dom.getStyle(this.expandDivNode, "display") == "none") {
							this.expandIt(this.expandDivNode, event);
						}
					}
				} else {
					// only one
					this.expandDivNode = arExpandDivs;
					if (pega.util.Dom.getStyle(this.expandDivNode, "display") == "none") {
						this.expandIt(this.expandDivNode, event);
					}
				}
			}
			this.handleDeferLoading(arPlusMinus);
			/*
			// Expand Textareas
			if (arTextAreas != null) {
			if (arTextAreas.length != null) {
			for (el=0; el < arTextAreas.length; el++) {
			try {
			arTextAreas[el].click();
			} catch (e) {}
			}
			} else {
			// only one
			try {
			arTextAreas[el].click();
			} catch (e) {}
			}
			}
			 */
			// Expand Textareas for controls
			this.toggleAllTextAreas(arTextAreas, "E");
			// Collapse all elements
		} else {
			if (arExpandDivs != null) {
				if (arExpandDivs.length != null) {
					for (el = 0; el < arExpandDivs.length; el++) {
						this.expandDivNode = arExpandDivs[el];
						if (pega.util.Dom.getStyle(this.expandDivNode, "display") != "none") {
							this.expandIt(this.expandDivNode, event);
						}
					}
				} else {
					// only one
					this.expandDivNode = arExpandDivs;
					if (pega.util.Dom.getStyle(this.expandDivNode, "display") != "none") {
						this.expandIt(this.expandDivNode, event);
					}
				}
			}
			/*
			// Collapse Textareas
			if (arTextAreas != null) {
			if (arTextAreas.length != null) {
			for (el=0; el < arTextAreas.length; el++) {
			try {
			arTextAreas[el].click();
			} catch (e) {}
			}
			} else {
			// only one
			try {
			arTextAreas[el].click();
			} catch (e) {}
			}
			}
			 */
			// Collapse Textareas for controls
			this.toggleAllTextAreas(arTextAreas, "C");
		}
		//		pega.desktop.support.resizeGadget();

	},

	toggleAllTextAreas : function (arTextAreas, taState) {
		var taFound = false;
		if (arTextAreas != null) {
			var arrayLength = arTextAreas.length;
			for (var i = 0; i < arrayLength; i++) {
				// BUG - 125005 starts
				if(pega.control.TextArea) {
					var taFoundTemp = pega.control.TextArea.toggle(pega.util.Dom.getLastChild(arTextAreas[i]), taState, false);
					taFound = taFound ? taFound : taFoundTemp;
				} else {
					// fix for bug # print action on a work object throws javascript error
					var _compressed = pega.util.Dom.getElementsById('COMPRESSED', arTextAreas[i])[0];
					var _expanded = pega.util.Dom.getElementsById('EXPAND', arTextAreas[i])[0];
					var _arrow = pega.util.Dom.getElementsById('ARROW', arTextAreas[i])[0];
					if(_compressed && _expanded && _arrow &&
						((taState === 'C' && _compressed.style.display == 'none')
						|| (taState === 'E' && _expanded.style.display == 'none'))){
						_arrow.click();
						taFound = true;
					}
				}
                                    // BUG - 125005 ends
				taFound = taFound ? taFound : taFoundTemp;
			}
			if (taFound) {
				pega.u.d.resizeHarness();
			}
		}
	},

	/*
	@protected Expands All Styles.
	This function is called from expandIt function in order to set the expanded styles.
	@param $Object$expandElement - The source element to be expanded
	@return $void$
	 */
	expandAllStyles : function (expandElement) {

                /*BUG-129574 : Added check as there is a change in markup (replaced tables with divs) */
		var parentTable;
		if(expandElement.tagName == "DIV" && expandElement.id == "EXPAND-PLUSMINUS"){
			parentTable = expandElement;
		}
		else{
			parentTable = expandElement.parentNode;
		while (parentTable != null) {
				if (parentTable.tagName == "TABLE" || (parentTable.tagName == "DIV" && parentTable.id == "EXPAND-OUTERFRAME")) {
					break;
				} else {
					parentTable = parentTable.parentNode;
				}
			}
		}

		if (parentTable != null) {
			var tdList = pega.ctx.dom.getElementsByTagName("TD", parentTable);
			var spanList = pega.ctx.dom.getElementsByTagName("SPAN", parentTable);
			for (var el = 0; el < tdList.length; el++) {
				var theTD = tdList[el];//removed item function as tdList is array
				if (theTD != expandElement) {
					if ((theTD.className != null) && (theTD.className != "") && (theTD.className.indexOf("data") != 0) && (theTD.className.indexOf("buttonTd") != 0) && (theTD.className.indexOf("Expanded") == -1)) {
						theTD.className = theTD.className + "Expanded";
					}
				}
			}

			for (var el = 0; el < spanList.length; el++) {
				var theSpan = spanList[el];//removed item function as tdList is array
				if ((theSpan != expandElement) &&
					(theSpan.parentNode.tagName != "BUTTON") &&
					(theSpan.parentNode.parentNode.tagName != "BUTTON")) {
					/*BUG-95835 : Added a condition (theSpan.className.indexOf("cke_") == -1) to avoid all CKEditor Span elements */
					if ((theSpan.className != null) && (theSpan.className != "") && (theSpan.className.indexOf("header-") == -1) && (theSpan.className.indexOf("Expanded") == -1) && (theSpan.className.indexOf("cke_") == -1)) {
                      if(theSpan.className.indexOf("Icon") >-1){
						theSpan.className = theSpan.className + "Expanded"; /*HFix-36307*/
                      }else{
                        theSpan.className = theSpan.className + " Expanded";
                      }
					}
				}
			}

			// special case, for sub group (h3)
			if (parentTable.className == "subGroupHead") {
				parentTable.className = parentTable.className + "Expanded";
			}

		}
	},

	/*
	@protected Collapse All Styles
	This function is called from expandIt function in order to set the collapsed styles.
	@param $Object$expandElement - The source element to be expanded
	@return $void$
	 */

	collapseAllStyles : function (expandElement) {

                /*BUG-129574 : Added check as there is a change in markup (replaced tables with divs) */

		var parentTable;
		if(expandElement.tagName == "DIV" && expandElement.id == "EXPAND-PLUSMINUS"){
			parentTable = expandElement;
		}
		else{
			parentTable = expandElement.parentNode;
			while (parentTable != null) {
				if (parentTable.tagName == "TABLE" || (parentTable.tagName == "DIV" && parentTable.id == "EXPAND-OUTERFRAME")) {
					break;
				} else {
					parentTable = parentTable.parentNode;
				}
			}
		}

		if (parentTable != null) {
			var parentTableClassName = parentTable.className;
			var tdList = pega.ctx.dom.getElementsByTagName("TD", parentTable);
			var spanList = pega.ctx.dom.getElementsByTagName("SPAN", parentTable);
			var tdListLength = tdList.length;
			var spanListLength = spanList.length;

			for (var el = 0; el < tdListLength; el++) {
				var theTD = tdList[el];
				var theTDClassName = theTD.className;
				if (theTD != expandElement) {
					if (theTDClassName != null) {
						/* theTD.className = theTD.className.replace( / ?[^ ]+Expanded/,""); */
                      	theTD.className = theTD.className.replace( /Expanded/,""); /* BUG-265071 */
					}
				}
			}
			for (var el = 0; el < spanListLength; el++) {
				var theSpan = spanList[el];
				var theSpanParentNode = theSpan.parentNode;
				var theSpanClassName = theSpan.className;
				/*BUG-95835 : Added a condition (theSpan.className.indexOf("cke_") == -1) to avoid all CKEditor Span elements */
				if ((theSpan != expandElement) && (theSpanParentNode.tagName != "BUTTON") && (theSpan.className.indexOf("header-") == -1) && (theSpanParentNode.parentNode.tagName != "BUTTON") && (theSpan.className.indexOf("cke_") == -1)) {
					if (theSpanClassName != null) {
						/* theSpan.className = theSpan.className.replace( / ?[^ ]+Expanded/,""); */
                      				theSpan.className = theSpan.className.replace( /Expanded/,"").trim(); /* BUG-265071 */
					}
				}
			}
			// special case, for sub group (h3)
			if (parentTableClassName == "subGroupHeadExpanded") {
				/* parentTable.className = parentTable.className.replace( / ?[^ ]+Expanded/,""); */
              	parentTable.className = parentTable.className.replace( /Expanded/,""); /* BUG-265071 */
			}
		}
	},

	/*
	@protected This function will make the form printer friendly,
	by doing the following, expanding all Trees (+/-), expanding all textArea (red arrows), resizing all textArea to reveal the full text with out scrolls.
	@return $void$
	 */
	makePrinterFriendly : function () {
		var outputString;
		var arrowList;
		var arrowNode;
		var arrowSrc;
		var el;

		var expandTextAreaList;
		var expandTextAreaNode;

		var expandDivList;
		var expandDivNode;

		// expand the tree

		expandDivList = pega.util.Dom.getElementsById("EXPAND-INNERDIV", document);

		if (expandDivList != null) {
			if (expandDivList.length != null) {
				for (el = 0; el < expandDivList.length; el++) {
					expandDivNode = expandDivList.item(el);
					// for details section get the inner HTML and expand all the inner DIVs
					if (expandDivNode.Name == "DetailsSection" && expandDivNode.style.display == "none")
						pega.u.d.expandAllAndGetIt(expandDivNode);
					if (expandDivNode.style.display == "none")
						pega.u.d.expandIt(expandDivNode);
				} // for
			} else {
				// only one
				expandDivNode = expandDivList;
				if (expandDivNode.style.display == "none")
					pega.u.d.expandIt(expandDivNode);
			}
		}
		// expand all the textareas
		arrowList = pega.util.Dom.getElementsById("ARROW", document);
		if (arrowList != null) {
			if (arrowList.length != 1) {
				for (el = 0; el < arrowList.length; el++) {
					arrowNode = arrowList.item(el);
					arrowSrc = arrowNode.src.toUpperCase();
					if (arrowSrc.indexOf("RPSTEPCOMPRESSED") >= 0)
						arrowNode.click();
				} // for
			} else {
				// only one
				arrowNode = arrowList;
				arrowSrc = arrowNode.src.toUpperCase();
				if (arrowSrc.indexOf("RPSTEPCOMPRESSED") >= 0)
					arrowNode.click();
			}
		}
	},

	/*
	@protected Expand All
	@param $Object$expandElement
	@return $void$
	 */
	expandAllAndGetIt : function (expandElement) {
		pega.u.d.expandIt(expandElement);
		pega.ctx.dom.getElementById("EXPAND-ALL-INDICATOR").value = "true";
		var isNewActionArea = pega.ctx.dom.getElementById('pyActionArea');
		if (isNewActionArea) {
			var newURL = SafeURL_createFromEncryptedURL(document.main.action);
			if (newURL) {
				newURL.put("pyActivity", "Show-Harness");
				document.main.action = newURL.toURL();
			}
		}
		/* Added to avoid submitting placeholder value while reloading the harness : START */
		pega.control.PlaceHolder.removePlaceHolderValues(document.main);
		/* Added to avoid submitting placeholder value while reloading the harness : END */
		pega.u.d.fixBaseThreadTxnId();
		document.main.action = document.main.submit();
	},


	/*
	@public Checks for expanded/collapsed state of containers and accordingly sets the expand/collapse icon attributes.
	@return $void$
	 */

	checkContainersExpanded : function () {
		var bExpandAll = false;
		var arExpandDivs = pega.util.Dom.getElementsById("EXPAND-INNERDIV", document);

		//Check for container states change only when expandIcon element exists.
		if (pega.ctx.dom.getElementById("expandIcon") != null) {
			var icon = pega.util.Dom.getElementsById("expandIcon", document);
			if (icon.length > 1)
				icon = icon[1];
			else
				icon = icon[0];
			if (arExpandDivs) {
				if (arExpandDivs.length != null) {
					for (var cnt = 0; cnt < arExpandDivs.length; cnt++) {
						this.expandDivNode = arExpandDivs[cnt];
						if (this.expandDivNode.style.display == "none") {
							bExpandAll = true;
						}
					}
				} else {
					// only one
					this.expandDivNode = arExpandDivs;
					if (this.expandDivNode.style.display == "none") {
						bExpandAll = true;
					}
				}
				if (bExpandAll) {
					icon.setAttribute("isExpanded", "false");
					icon.setAttribute("title", gStrExpandAllText);
					icon.setAttribute("buttonClass", "iconExpandAll");
					icon.setAttribute("className", "iconExpandAll");
				} else {
					icon.setAttribute("isExpanded", "true");
					icon.setAttribute("title", gStrCollapseAllText);
					icon.setAttribute("buttonClass", "iconCollapseAll");
					icon.setAttribute("className", "iconCollapseAll");
					icon.setAttribute("class", "iconCollapseAll");

				}
			}
			//No expand check for presence of icon object..
			//BUG-217175: The 2nd icon of type (Standard - Expand/Collapse) was being hidden when there is no collpasible header in the harness. Add additional check if it is an icon control.
			else if (typeof(icon) != "undefined" && icon.getAttribute("data-ctl")!="Icon") {
				icon.style.display = "none";
			}
		}

	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, expandC);
//static-content-hash-trigger-GCC
var docFocus = {
  focusElement:{},
  gFocusElement:null,
    gFocusTimeStamp:null,
  /*
  @Handler
  @protected Get the focus on first i/p element in any harness. This wrapper function would identify special cases(accessibility, actionarea) and just makes a call to focusFirstElement api.
  @return $void$
   */
  initFocusOnFirstInput : function () {
    /*
        bug-197033: do not block focus when accessibility is enabled.
        if (pega.u.d.isAccessible)
      return;
        */
    var actionArea = document.getElementById('pyActionArea');
    if (actionArea) {
      /*HFix-25418: Sending actionarea parent as container to restrict the focus to action area*/
      pega.u.d.focusFirstElement('pyActionArea', actionArea.parentNode, true);
    } else {
      pega.u.d.focusFirstElement(undefined, undefined, true);
    }
  },
  
  
/*
BUG-516183 - Focuses required fields for screenreaders
*/

 focusToFirstInvalidField : function(spansContainer){
    var container = spansContainer !== undefined ? spansContainer : document;
    var spans = undefined;
    var className = [];
    var parentDisplayStyle = ["", "block"];
    var iconSpans = container.querySelectorAll("span.iconError.dynamic-icon-error, span.iconError");
		var inputSpans = container.querySelectorAll("span.inputError.dynamic-icon-error");
    if(pega.u.d.fieldErrorType === "ERRORTEXT") {
      spans = inputSpans;
      className.push("inputError dynamic-icon-error");
    } else {
      spans = iconSpans;
      className.push("iconError dynamic-icon-error", "iconError ");
    }
    if(typeof(LayoutGroupModule) != "undefined"){
      LayoutGroupModule.goToNextError(container);
    }                                                 
		for(var i=0; i<spans.length; i++){ 
			if(className.includes(spans[i].getAttribute("class")) && parentDisplayStyle.includes(spans[i].parentElement.style.display)){ 
				var element = spans[i].parentNode.nextSibling;
				if(element && element.nodeType==3){element=element.nextSibling;}
				var currentElement = spans[i];
				while(currentElement && currentElement.getAttribute("class") !== "combo-box"){
					if(element){
						for(var j=0; j<element.length; j++){
							if(element[j]){
								if((element[j].tagName=="INPUT") || (element[j].tagName=="TEXTAREA") || (element[j].tagName=="SELECT")){
									if(element[j].style.display != 'none' && element[j].style.visibility!="hidden" && element[j].type!="hidden"){
                   setTimeout(function(){element[j].focus();},0) 
										return;
									}
								}
							}
						}
					}
					currentElement = currentElement.parentElement;
					if(currentElement){
							element = currentElement.getElementsByTagName("*");
					}
				}
			}
		}
	},


  /* @public
  This api would set the focus to first input element. The default behaviour is to focus the first input element(Text/TextArea/Select) in a harness.
  Can be customized to get the focus on first input element in any div.
  @param $elementID - A unique id in container from where the first element should be focused.
  @param $container - Default is document. If there is same elementID at multiple places in the document then provider a container(eg: div object).
  @param $container - Default is document. If there is same elementID at multiple places in the document then provider a container(eg: div object).
   */
  
  

  focusFirstElement : function (elementID, container, avoidRequiredField) {
      /* HFix-28330 : Pega App window focus should be configurable */
        if(pega.u.d.pyIsWindowStealFocusInIEAllowed == 'false'){
            return false;
         }
      
    /* BUG-169932 & BUG-170614: removing auto focus to first field for touchable control */
    /* BUG-592799 added check to return the execution for touchable mobile devices only*/
    if(pega.cl && pega.cl.isTouchAble() && pega.u.d.isMobile()) { return; }
    var firstElement = this.getFirstInputElement(elementID, container);
    if (firstElement && !(avoidRequiredField && firstElement.getAttribute("validationType") && firstElement.getAttribute("validationType").indexOf("required") > -1)) {
          if (pega.util.Event.isIE && pega.util.Event.isIE >= 9 && window.parent){
            window.focus();
          }
      try {
        /*BUG-149298: If the first focusable element is CKEditor, the contenteditable body of the frame should be focused.*/
        if(firstElement.className.indexOf('PEGACKEDITOR') > -1) {
          CKEDITOR.instances[firstElement.id].on('instanceReady',function(){
            this.focus();
          });
        }
        else {
          if (firstElement.type && firstElement.type == "radio") {
            pega.u.d.focusRadioElement(firstElement);
            pega.u.d.focusRadioElement(firstElement);
          } else {
            var errorTable = document.getElementById("ERRORTABLE");
            var errorList = document.getElementsByClassName("custom_errorlist_ul");
            /* focus first field in form when there will be error banner or error table */
            if((errorList && errorList.length > 0)
                   || (errorTable !== null && errorTable.style.display !== "none")) {
              var flowActionContainer = document.getElementById("pyFlowActionHTML");
              var harnessContent = document.getElementById("HARNESS_CONTENT")
              if(flowActionContainer !== null) {
                if(typeof(LayoutGroupModule) !== "undefined") {
                 LayoutGroupModule.goToNextError(document);
                }
                setTimeout(function(){
                    if(pega.ctx.dom.querySelector('.iconErrorDiv')){
                      var parEle = pega.ctx.dom.querySelector('.iconErrorDiv').parentElement;
                      var inputEle = parEle ? parEle.querySelector('input') : '';
                      if(parEle && inputEle){
                         inputEle.focus();
                      }
                    }
                },0);
              }
              if(harnessContent !== null) {
                harnessContent.querySelector("input").focus();
              }
             return;
            }
            else if(pega && pega.control && pega.control.menu){
              firstElement = pega.control.menu.getFocusableMenuItem(firstElement);  
            }
            /* end */
            firstElement.focus();
            firstElement.focus();
          }
        }
        /* BUG-108115: IE8 causing cursor blinking issue on focus first element.
        here setting cursor position to 0 in input field, to see cursor blinking */
        if (pega.util.Event.isIE) {
          if (firstElement.type == 'text' || firstElement.type == 'textarea') {
            if (firstElement.setSelectionRange) {
              firstElement.setSelectionRange(0, 0);
            } else if (firstElement.createTextRange) {
              var range = firstElement.createTextRange();
              range.collapse(true);
              range.moveEnd('character', 0);
              range.moveStart('character', 0);
              range.select();
            }
          }
        }
        /* This is not triggering implicit focus event of control, so added this to replace placeholder value */
        if (pega.control && pega.control.eventController) {
          pega.control.eventController.fireEventHandler(firstElement, "focus");
        }
        return true;
        //pega.util.Event.addListener(firstElement,"change",pega.c.ClientConditionExecutor.processEvent);

      } catch (e) {
        return false;
      }
    }
    return false;
  },
  /*
  @private This function focuses the next element after section refresh. Incase of action area would focus the first element.
  @param $String$elementName - Name of the current element
   */

  focusNextElement : function (elementName, reloadElement, pos) {
        if(pega.u.d.pyIsWindowStealFocusInIEAllowed == 'false'){ 
          return false; 
        }
    var elemArray = pega.util.Dom.getElementsById("pyActionArea", reloadElement);
    var actionArea = null;
    if (elemArray)
      actionArea = elemArray[0];
    if (actionArea != null) {
      pega.u.d.initFocusOnFirstInput();
      return;
    }
    var focusNextTrueElem = false;
    var src;
        var eleToFocus = pega.u.d.gFocusElement;
        if( !eleToFocus || (eleToFocus instanceof HTMLElement && document.body.contains(eleToFocus))){         
          //do nothing,if the element is already present in DOM,we need not have logic related to calculating next focus element     
         /*	BUG-555483 fix: setting gFocusElement to null only when value is not equal to activeElement */
          if(pega.u.d.gFocusElement != document.activeElement){
            // If focus is on loading indicator, bring back focus on previous gFocusElement - BUG-746325
            if(eleToFocus && eleToFocus.focus && document.activeElement.id === 'pega_ui_load') {
              eleToFocus.focus();
            } else {
              pega.u.d.gFocusElement = null;
            }
          }
          return;
        }
        var focusElemName = eleToFocus.name || eleToFocus.getAttribute("name");
      /*After section reload,if previously focused element which was present in the section is now not present,focusing next element*/
        var focusElement;
        if(focusElemName){
          if(document.body.contains(reloadElement)){
            focusElement = pega.util.Dom.getElementsByName(focusElemName,reloadElement);
          } else {
            focusElement = pega.util.Dom.getElementsByName(focusElemName);
          }
          if (focusElement == null){
            focusNextTrueElem = true;
          }
        } else {
          if ($(eleToFocus).data('layout-id')) {
            focusElement = $("[data-layout-id='" + $(eleToFocus).data('layout-id') + "']");
          } else if ($(eleToFocus).closest('.header').data('layout-id')) {
            focusElement = $("[data-layout-id='" + $(eleToFocus).closest('.header').data('layout-id') + "']");
          } else if ($(eleToFocus).closest("[id $= 'ANCHOR']").data('layout-id')) {
            focusElement = $("[data-layout-id='" + $(eleToFocus).closest("[id $= 'ANCHOR']").data('layout-id') + "']");
          } else {
            var focusElemId = eleToFocus.id;
            if(eleToFocus.tagName && eleToFocus.tagName.toLowerCase() == "label"){
              var labelFor = eleToFocus.getAttribute("for");
              if(labelFor){
                focusElemId = labelFor;
              }
            }
            if(focusElemId){
              focusElement = pega.util.Dom.getElementsById(focusElemId);
              if (focusElement == null){
                focusNextTrueElem = true;
              }                      
            } else {
              return;
            } 
          }
          if (focusElement == null){
            focusNextTrueElem = true;
          }
        }           
    //}
    if (focusNextTrueElem) {
      if (elementName != "")
        src = document.getElementsByName(elementName)[0];
      if (src != null) {
        if (src.type == "radio") {
          src = document.getElementsByName(elementName);
          var srcLength = src.length;
          for (var i = 0; i < srcLength; i++) {
            if (src[i].checked == true) {
              if (src[i].focus) {
                src[i].focus();
                //pega.util.Event.addListener(src[i],"change",pega.c.ClientConditionExecutor.processEvent);
              }
              break;
            }
          }
          return;
        }

        var focusElement = src;
                var elementToCheck = document.body;
                if(reloadElement.contains(src)) {
                    elementToCheck = reloadElement;
                }
                var inputElements = elementToCheck.querySelectorAll("input,select,textarea,button,a");

                  var j = 0;
          for (; j < inputElements.length; j++) {
                        if(inputElements.item(j) == src){
                           j++;
                           break;
                        }
                    };
                  for(; j < inputElements.length; j++) {
                        var inputElement = inputElements.item(j);
            
            if ( (inputElement.type != "hidden") && (inputElement.style.display != "none" && inputElement.style.visibility != "hidden")) {
              /*BUG-149298: Filtering CKEditor toolbar button anchors. They should not be focused.*/
              if(!(inputElements[j].nodeName.toUpperCase() == "A" && inputElements[j].className.indexOf('cke_') == 0)) {
                                focusElement = inputElement;
                                break;
              }
            }
          }
      }
    } else {
      var tempFocusElementsList = focusElement;
      focusElement = focusElement[0];

      /* Check for hidden fields in focusElement array */
      if (focusElement && (focusElement.type == "hidden" || focusElement.style.display == "none")) {
        for (var elemIdx = 0; elemIdx < tempFocusElementsList.length; elemIdx++) {
          if (tempFocusElementsList[elemIdx] && tempFocusElementsList[elemIdx].type != "hidden" && tempFocusElementsList[elemIdx].style.display != "none" && tempFocusElementsList[elemIdx].style.visibility != "hidden") {
            focusElement = tempFocusElementsList[elemIdx];
            break;
          }
        }
      }
    }
    try {
      if (focusElement != src) {
                /*
                * triggering the focusDomElement in setTimeout to avoid trigger of reflow.
                */
                /*BUG-334246 : Removing settimeout*/
                //setTimeout(function() {
                  pega.u.d.focusDomElement(focusElement, pos);  
                //},0);       
        //pega.util.Event.addListener(focusElement,"change",pega.c.ClientConditionExecutor.processEvent);
      }
    } catch (Exception) {}
    /* BUG-431390: Focus is missing on dropdown after selecting value using tab for the second time because 
                    gFocusElement is set to null for BUG-369192 changes. Fix: setting gFocusElement to null 
                    only if gFocusElement not equal to document.activeElement*/
    if(pega.u.d.gFocusElement != document.activeElement){
          pega.u.d.gFocusElement = null;
    }
  },
  
        getNextFocusableElement: function(element, container){
    var fields = $($(container||document).find('a[href], button, input[type!="hidden"], select, textarea, img[tabindex]').filter(":visible").toArray());
                  return fields.eq((fields.index(element) + 1) % fields.length)[0];
  },

  focusDomElement : function (focusElement, pos) {
    /* placing the focus() before setting caret position */
    try {
        /**SE-40152: Preventing maximizing window by itsels */
        var disableFocusInIE = false; 
        try{ 
            disableFocusInIE = (pega.u.d.disableFocusInIE)?pega.u.d.disableFocusInIE:false; 
         }catch (e) { 
            disableFocusInIE = false; 
        } 
      /* BUG-117594: In IE10(Standards mode), keyboard input blocking after reload section(innerHTML).
         setting focus on document body first after the actual focusElement */
      if (!disableFocusInIE && pega.util.Event.isIE && ( pega.util.Event.isIE === 11 || pega.util.Event.isIE === 10 || pega.util.Event.isIE === 9) ) {
        document.body.focus();
      }
      if (focusElement.type && focusElement.type == "radio") {
        pega.u.d.focusRadioElement(focusElement);
      } else if(focusElement.type && focusElement.type == 'textarea' && focusElement.id.indexOf('PEGACKEDITOR') >= 0) {
                /*BUG-201922: Focus CKEDITOR instance if focusElement is RTE textarea.*/
                CKEDITOR.instances[focusElement.id].on("instanceReady", function(event) {
                  this.focus();
                });
      } else {
          if(typeof focusElement.focus === 'function') {
            focusElement.focus();  
         }
      }
    } catch (e) {
      return;
    }
    if (pos != undefined && pos >= 0) {
      pega.u.d.setCaretPosition(focusElement, pos);
    }
    if (document.activeElement != focusElement) {
      /* placing the focus() before setting caret position */
      try {
        if (focusElement.type && focusElement.type == "radio") {
          pega.u.d.focusRadioElement(focusElement);
        } else {
          focusElement.focus();
        }
      } catch (e) {
        return;
      }
      if (pos != undefined && pos >= 0) {
        pega.u.d.setCaretPosition(focusElement, pos);
      }
    }
  },
  
  focusRadioElement : function (focusElement) {
    try {
      var rdbObjs = document.getElementsByName(focusElement.name);
      var srcLength = rdbObjs.length;
      var isFocused = false;
      for (var i = 0; i < srcLength; i++) {
        if (rdbObjs[i].checked == true) {
          if (rdbObjs[i].focus) {
            rdbObjs[i].focus();
            isFocused = true;
          }
          break;
        }
      }
      if (!isFocused) {
        focusElement.focus();
      }
    } catch (e) {
      focusElement.focus();
    }
  },

  /*
  @Private - attach focus to input elements, helps in focus logic
  @param $Object$  container - dom object that contains elements to attach focus
   */
  attachFocusToElements : function (container) {
    if (typeof(bClientValidation) != 'undefined' && !bClientValidation) {
      if (container == null || container.type == 'load')
        container = document;
      var focusInputTypes = new Array("input", "select", "textarea", "button", "a");
      var nTypesLength = focusInputTypes.length;
      for (var i = 0; i < nTypesLength; i++) {
        var elementList = container.getElementsByTagName(focusInputTypes[i]);
        pega.u.d.attachFocusHandler(elementList);
      }
    }
  },
  
  focusHeaderOfNavigationharness: function() {
    var headerArr = $('h1');
    if(headerArr.length){
      var headerEle = headerArr[0];
      if(headerEle){
        headerEle.setAttribute('tabindex', '-1');
        var headerText = headerEle.textContent || headerEle.innerText;
        headerEle.setAttribute('aria-label', headerText);
        headerEle.focus();
        setTimeout(function(){headerEle.focus()}, 500);
      }
    }
  },

  /*
  @Private - called by attachFocusToElements, attaches a focus handler to each input element
  @param $Object$  elementList - array of input elements to attach the focus handler
   */
  attachFocusHandler : function (elementList) {
    var nElemsLength = elementList.length;
    for (var i = 0; i < nElemsLength; i++) {
      var oElem = elementList[i];
      if (oElem.type != "hidden" && oElem.disabled != true && oElem.style.display != "none") {
        pega.util.Event.addListener(oElem, "focus", pega.u.d.setFocusElement);
      }
    }
  },

  setFocusElement : function (event) {
    if (!event)
      event = window.event;
    pega.u.d.focusElement = pega.util.Event.getTarget(event);
  },

  /* method used in runscript of the skip-to-content links in accessibility mode */
  /*
  If Dynamic Layout is configured with Search / Navigation / Main then those should get focussed.
    Special Cases -
      Search -If contentDiv does exist then focus first input field in that div.
          else fallback to document pySearchText field.
      Navigation - If Left Panel / Right Panel have any dynamic layout marked as Navigation then those would be focussed else Panel's
  */
  skipToContent : function(contentType) {
    var contentDiv;
    if(pega.u.d.focusInsideIframe){
      contentDiv = this.getFrameContentDiv(contentType);
    }
    if(!contentDiv){
      contentDiv = $("[data-skip-target='"+ contentType +"']")[0];
    }
    
    
    // BUG-520017 in app studio the search is inside the formfactoriframe so querying the element from formfactoriframe. 
    if(!contentDiv){
      var _deviceIFrame = document.getElementById("FormFactoriFrame");
      if(_deviceIFrame ){
        var _innerDoc = _deviceIFrame.contentDocument || _deviceIFrame.contentWindow.document;
        if(_innerDoc ){
          contentDiv =  _innerDoc.querySelector("[data-skip-target='"+ contentType +"']");
        }
      }
        
      }
    
    var navDiv;
    if(contentType == "search") {
      try{
       // var searchField = contentDiv ? $(contentDiv).find("input")[0] : $(document).find("input#pySearchText")[0], keyupAttr;
        // fix for BUG-364423: focusing first focusable element which is visible.
        var searchField,keyupAttr;
        if(contentDiv){
          var contentDivElements = contentDiv.getElementsByTagName("INPUT");
          var totalCount = contentDivElements.length;
          for(var i=0;i<totalCount;i++){
            var firstEle = contentDivElements[i];
            
            if(firstEle != null && 
               firstEle.type != "hidden" && 
               firstEle.style.display != "none" && 
               firstEle.offsetHeight > 0 && !firstEle.disabled && !firstEle.readOnly) {
                searchField = firstEle;
            }
            
          }//for
        }
        else{
          
          searchField= document.querySelector("input[name$='pySearchText']");
        }
        if(!searchField){
          //if searchField is undefined then focus div with tabindex attribute.
          if(contentDiv.getAttribute("tabindex")!=null) {
              searchField = contentDiv;
          }else {
            return;
          }
          
        }
        
        keyupAttr = searchField.getAttribute("data-keyup");

        if(keyupAttr){
          searchField.removeAttribute("data-keyup");
        }
        searchField.focus();
        if(keyupAttr){
          setTimeout(function(){ searchField.setAttribute("data-keyup", keyupAttr); }, 500);  
        }        
        return;
      } catch(e){ 
        if(keyupAttr) {
          searchField.setAttribute("data-keyup", keyupAttr); 
          console.log(e);
        }  
      }
    }
    if(contentDiv) {
      if(contentType == "navigation") {
        if(contentDiv.className.indexOf("screen-layout-region-main-sidebar1") > 0 || contentDiv.className.indexOf("screen-layout-region-main-sidebar2") > 0 ){
          navDiv = $(contentDiv).find("div[data-skip-target='navigation']");
          contentDiv = navDiv.length > 0 ? navDiv[0] : contentDiv;
        }
      }
      contentDiv.setAttribute('tabindex','-1');
      try{
        contentDiv.focus();
        return;
      } catch(e){console.log(e);}  
    }   
  },
  getFrameContentDiv : function(contentType){

    var contentDiv;
    var dcMode = $("#workarea").attr("data-mode");
    var activeDiv;

    if(dcMode == "Tabbed"){

      var staticActive;
      $(".dc-main .static-dc-tab").each(function(){
        if($(this).css('display') == 'block'){
          staticActive = $(this);
          return false;
        }

      });

      if(staticActive){
        activeDiv =  staticActive;
      }else{
        activeDiv = $(".dc-main .iframe-wrapper");
      }

    }else if(dcMode == "SingleView"){
      var activeContainer;
      $(".dc-main > *").each(function(){

        if($(this).css('display') != 'none'){
          activeContainer = $(this);
          return false;
        }

      });
      var container = $(activeContainer[0]);
      if(container.prop("tagName").toLowerCase() == "iframe"){
        var activeWindow = container[0].contentWindow;
        contentDiv = activeWindow.$("[data-skip-target='"+ contentType +"']")[0];

      }else{
        contentDiv = container.find("[data-skip-target='"+ contentType +"']")[0];
      }
      return contentDiv;
    }else{
      activeDiv = $("#moduleGroupDiv").children(".iframe-wrapper");
    }
    var activeFrame = activeDiv.filter(function(){
      return ($(this).css('display') == 'block');
    }).find('iframe')[0];

    if(activeFrame){
      var activeWindow = activeFrame.contentWindow;
      contentDiv = activeWindow.$("[data-skip-target='"+ contentType +"']")[0];
    }else{
      contentDiv = activeDiv.find("[data-skip-target='"+ contentType +"']")[0];
    }
    return contentDiv;
  },
  isMobile : function(){
    var navUserAgent = navigator.userAgent; 
    if(navUserAgent.match(/Android/i) || navUserAgent.match(/BlackBerry/i) || navUserAgent.match(/iPhone|iPad|iPod/i) || navUserAgent.match(/Opera Mini/i) || navUserAgent.match(/IEMobile/i) || navigator.userAgent.toLowerCase().indexOf("windows phone") > 0){
        return true;
      } else{
        return false;
      }
  },
  attachFocusHandlerForSkipLinksWrapper : function(){
    $(".skip-links-wrapper").focusin(function(event){
        $(this).removeClass("skip-links-hide").addClass("skip-links-show");
    }).focusout(function(event){
        $(this).removeClass("skip-links-show").addClass("skip-links-hide");
    });
  }
};

pega.lang.augmentObject(pega.ui.Doc.prototype, docFocus);
pega.u.d.attachOnload(pega.u.d.attachFocusHandlerForSkipLinksWrapper,false);
//static-content-hash-trigger-NON
var jsUtils = {

	/*
	Search for an element in the array
	@param $String$ token
	@param $object$ arr
	@return $boolean$
	 */
	boolArraySearch : function (token, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == token.valueOf())
				return true;
		}
		return false;
	},

	/*
	Checks for an element type in the array
	@param $String$ n
	@return $boolean$
	 */
	checkIfNumber : function (n) {
		var numArr = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
		if (this.boolArraySearch(n, numArr)) {
			return true;
		} else
			return false;
	},
	/*
	Checks for a letter in element of an array
	@param $char$ s
	@return $boolean$
	 */

	checkIfLetter : function (s) {
		var charCode = s.charCodeAt(0);
		if (charCode >= 65 && charCode <= 90)
			return true;
		if (charCode >= 97 && charCode <= 122)
			return true;
		else
			return false;
	},

	/*
	check for java identifier (letter) in an element of the array
	@param $char$ s
	@return $boolean$
	 */

	checkJavaIdentifierStart : function (s) {
		if (this.checkIfNumber(s))
			return false; // not valid identifier start
		if (this.checkIfLetter(s))
			return true;
		else
			return false;
	},

	/*
	check for java identifier in an element of the array
	@param $char$ s
	@return $boolean$
	 */

	checkJavaIdentifier : function (s) {
		if (this.checkIfNumber(s))
			return true;
		if (this.checkIfLetter(s))
			return true;
		else
			return false;
	},

	/*
	Checks whether subscript is valid or not in modaldialog
	@param $String$ sScript
	@return $boolean$
	 */

	validateSubScript : function (sScript) {
		if (sScript == "") {
			return false;
		}

		if (!this.checkJavaIdentifierStart(sScript.charAt(0)))
			return false;

		for (var k = 1; k < sScript.length; k++) {
			var c = sScript.charAt(k);
			if (!this.checkJavaIdentifier(c))
				return false;
		}
		if (this.subArr != null) {
			for (var i = 0; i < this.subArr.length; i++) {
				var tScript = this.subArr[i];
				if (tScript == sScript) {
					return false;
				}
			}
		}
		return true;

	},

	/*
	removes the empty spaces is a string
	@param $String$ sScript
	@return $String$ retStr
	 */

	trim : function (sScript) {
		var arr = sScript.split(' ');
		var retStr = '';
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] != null || arr[i] != '' || arr[i] != ' ')
				retStr += arr[i];
		}
		return retStr;

	},
	recurseJSON : function (c, e, qString, eString) {
		qString = qString ? qString : "";
		eString = eString ? eString : "";
		for (var i in c) {
			if (typeof c[i] == "string" || typeof c[i] == "boolean" || typeof c[i] == "number") {
				qString += (qString == "" ? "" : "&") + ((eString + e[i]).indexOf(".") == 0 ? "$PpyWorkPage" : "$P") + (eString + e[i]).replace(/\./g, "$p") + "=" + c[i];
			} else if (typeof c[i] == "object") {
				if (pega.lang.isArray(c[i])) {
					for (var j = 0; j < c[i].length; j++) {
						if (typeof c[i][j] == "object") {
							qString = pega.u.d.recurseJSON(c[i][j], e[i].p, qString, eString + e[i].h + "$l" + (j + 1));
						} else {
							qString += (qString == "" ? "" : "&") + ((eString + e[i]).indexOf(".") == 0 ? "$PpyWorkPage" : "$P") + (eString + e[i]).replace(/\./g, "$p") + ("$l" + (j + 1)) + "=" + c[i][j];
						}
					}
				} else {
					for (var j in c[i]) {
						if (typeof c[i][j] == "object") {
							qString = pega.u.d.recurseJSON(c[i][j], (e[i] ? e[i] : i), qString, eString + (e[i] ? e[i] : i) + ("$l" + j));
						} else {
							qString += (qString == "" ? "" : "&") + ((eString + e[i]).indexOf(".") == 0 ? "$PpyWorkPage" : "$P") + (eString + e[i]).replace(/\./g, "$p") + ("$l" + (j + 1)) + "=" + c[i][j];
						}
					}
				}
			}
		}
		return qString.replace(/\((\d*?)\)/i, "$l$1");
	},
	jsonToQuery : function (c, e) {
		return pega.u.d.recurseJSON(c, e);
	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, jsUtils);
//static-content-hash-trigger-GCC
var smartInfo = {
	gSmartInfoPopUpHarness: null,


	/*@protected This function is used by the showSmartInfoPopupHarness function to get the page property.
	@param $Object$element
	@return $Object$
	 */

	getRepeatPage : function (element, event) {
		var baseRef = "";
		var row = "";

		if (element) {
			var baseRefElement = this.getRepeatObject(element, true);			
			row = this.getRepeatRow(element);
		} else {
			var baseRefElement = this.getRepeatObject(pega.util.Event.getTarget(event), true);			
			row = this.getRepeatRow(pega.util.Event.getTarget(event));
		}
		
		/*BUG-129861 - START - Find out the active gridObj. Get PLOrPGProperty using the gridObj.*/
		if(window.Grids){
			/* BUG-185549 - START: for tree grid, always baseRefElement coming as null, getting corrent object using row index */
			if (baseRefElement == null && row != "") {
				var temp_gridObj = Grids.getActiveGrid(event);
				if (temp_gridObj && (temp_gridObj.bTreegrid || temp_gridObj.bTree)) {
					baseRefElement = temp_gridObj.getRightRow(row);
				}
			}
			/* BUG-185549 - END */
			var gridObj = window.Grids.getElementsGrid(baseRefElement);
			if(gridObj){
				var PLOrPGProperty = gridObj.getPLPGProperty();
			}
		}
		/*BUG-129861 - END*/		
		
		if (baseRefElement == null)
			return baseRef;
		
		if (baseRefElement.getAttribute("PL_PROP")) {
			if (row != undefined && row != "") {
				/*BUG-129861 - Use PLOrPGProperty variable */
				if(gridObj){
					baseRef = PLOrPGProperty + "(" + row + ")";
				}else{
					baseRef = baseRefElement.getAttribute("PL_PROP") + "(" + row + ")";
				}
			}
			/*else{
			baseRef = baseRefElement.getAttribute("PL_PROP");
			}*/

		} else if (baseRefElement.getAttribute("PG_PROP")) {
			if (row != undefined && row != "") {
				/*BUG-129861 - Use PLOrPGProperty variable */
				if(gridObj){
					baseRef = PLOrPGProperty + "(" + row + ")";
				}else{
					baseRef = baseRefElement.getAttribute("PG_PROP") + "(" + row + ")";
				}
			}
			/*else{
			baseRef = baseRefElement.getAttribute("PG_PROP");
			}*/
		}
		/*HFix-8369 start : to get baseRef or tree grid */
		if(typeof(Grids)!="undefined" && Grids && (event || window.event)){
			var grid = Grids.getActiveGrid(event);
			if(grid && !(grid.bTreegrid || grid.bTree)){
				return baseRef;
			}
			if(grid){
				var target = element? element : pega.util.Event.getTarget(event);
				var container = "";
				if(target){
					if(pega.util.Dom.isAncestor(grid.rightBodyTbl,target)) {
						container = grid.rightBodyTbl;
					}else if(pega.util.Dom.isAncestor(grid.leftBodyUL,target)) {
						container = grid.leftBodyUL;
					}
					if(container){
						grid.selectPage(event, container);
						if(grid.getLeftRow()){
							return pega.ui.property.toReference(grid.getLeftRow().id);
						}
					}
				}
			}
		}
		/*HFix-8369 end*/

		return baseRef;
	},

	/*
	@Handler
	@protected Load the mouse events to the smart info elements
	This function loads mouse events to all the elements containing the id "SI".
	@param $Object$reloadElement - Element to attach smart info
	 */

	loadSmartInfo : function (reloadElement) {
		pega.util.Event.removeListener(document, "keydown", pega.u.d.hideSmartInfoHarness);
		pega.util.Event.removeListener(document.getElementsByTagName("BODY")[0], "mousewheel", pega.u.d.hideSmartInfoHarness);

		pega.util.Event.addListener(document, "keydown", pega.u.d.hideSmartInfoHarness, pega.u.d, true);
		pega.util.Event.addListener(document.getElementsByTagName("BODY")[0], "mousewheel", pega.u.d.hideSmartInfoHarness, pega.u.d, true);

		if (reloadElement.type == "load") {
			var smartInfoElements = pega.util.Dom.getElementsById("SI", document);
		} else {
			var smartInfoElements = pega.util.Dom.getElementsById("SI", reloadElement);
		}
		if (smartInfoElements != null) {
			if (smartInfoElements.length > 0) {
				for (var i = 0; i < smartInfoElements.length; i++) {
                  	/*BUG-216970*/
                  	pega.util.Event.removeListener(smartInfoElements[i], "mouseover", pega.u.d.showSmartInfoHarness);
					pega.util.Event.removeListener(smartInfoElements[i], "mouseout", pega.u.d.hideSmartInfoHarness);
                  
					pega.util.Event.addListener(smartInfoElements[i], "mouseover", pega.u.d.showSmartInfoHarness, pega.u.d, true);
					pega.util.Event.addListener(smartInfoElements[i], "mouseout", pega.u.d.hideSmartInfoHarness, pega.u.d, true);
				}
			} else {
              	/*BUG-216970*/
                pega.util.Event.removeListener(smartInfoElements[i], "mouseover", pega.u.d.showSmartInfoHarness);
                pega.util.Event.removeListener(smartInfoElements[i], "mouseout", pega.u.d.hideSmartInfoHarness);
              
				pega.util.Event.addListener(smartInfoElements, "mouseover", pega.u.d.showSmartInfoHarness, pega.u.d, true);
				pega.util.Event.addListener(smartInfoElements, "mouseout", pega.u.d.hideSmartInfoHarness, pega.u.d, true);
			}
		}
	},

	/*
	@Handler
	@public Create the smart info object
	@return $void$
	 */
	showSmartInfoHarness : function (event) {
		event = (event == undefined) ? window.event : event;
		if (this.gSmartInfoPopUpHarness == null) {
			if (pega.ui && pega.ui.smartinfo) {
				this.gSmartInfoPopUpHarness = pega.ui.smartinfo;
			} else {
				this.gSmartInfoPopUpHarness = new SmartInfo();
			}
		}
		var smartInfoElement = pega.util.Event.getTarget(event);
		while (smartInfoElement.id != "SI") {
			smartInfoElement = smartInfoElement.parentNode;
			//Bug-9083 check for null if this loop reaches to the top html document when SI(smartinfo span) is not found
			if (smartInfoElement == null)
				return;
		}
		if (smartInfoElement.id == "SI") {
			pega.u.d.showSmartInfoPopupHarness(smartInfoElement, event);
		}
	},

	/*
	@Handler
	@protected Create the smart info popup.
	This function shows smart info popup when mouse over the element.
	@param $Object$smartInfoElement
	@return $void$
	 */
	showSmartInfoPopupHarness : function (smartInfoElement, event) {
		event = (event == undefined) ? window.event : event;
		var strSectionName = smartInfoElement.getAttribute("si_sectionname");
		var strUsingPage = smartInfoElement.getAttribute("si_usingpage");
		var strURL = SafeURL_createFromURL(pega.u.d.url);
		strURL.put("pyActivity", "ReloadSection");

		var repeatPage = pega.u.d.getRepeatPage(null, event);
		if (repeatPage && repeatPage != "" && repeatPage.charAt(0) != ".") {
			var baseRef = repeatPage;
		} else {
			var baseRef = this.getBaseRef(null, event) + repeatPage;
		}
		/* HFix-22673 - START */
		if (typeof (strSectionName) == "undefined" || strSectionName == null || strSectionName == "") {
			return;
		}
		/* HFix-22673 - END */
		strURL.put("StreamName", strSectionName);
		strURL.put("StreamClass", "Rule-HTML-Section");
		if (strUsingPage != "") {
			strURL.put("BaseReference", strUsingPage);
		} else {
			strURL.put("BaseReference", baseRef);
		}
		if (pega.ui.onlyOnce) {
			var oOSafeUrl = SafeURL_createFromURL(pega.ui.onlyOnce.getAsPostString());
			strURL.copy(oOSafeUrl);
		}

		var strHeader = smartInfoElement.getAttribute("si_headertext");
		strHeader = "<span class='smartInfostrHeaderStyle '>" + strHeader + "</span>";
		var sClickable = smartInfoElement.getAttribute("si_clickable");
		var bClickable = ((sClickable == "true") || (sClickable == "-1")) ? true : false;
		if (this.gSmartInfoPopUpHarness != null) {
			this.gSmartInfoPopUpHarness.showInfoAdvanced(smartInfoElement, strHeader, strURL.toQueryString(), true, true, bClickable, "", "", false, event);
		}
	},

	/*
	@protected Hide the smart info popup
	This function hides smart info popup when mouse out the element.
	@return $void$
	 */
	hideSmartInfoHarness : function () {
		if (this.gSmartInfoPopUpHarness != null) {
			this.gSmartInfoPopUpHarness.hideInfo();
		} else if (window.frames.actionIFrame != null && window.frames.actionIFrame.gSmartInfoPopUpHarness != null) { /// check if the smart info is in iframe
			window.frames.actionIFrame.gSmartInfoPopUpHarness.hideInfo();
		}
	},
	
	removeSmartInfoListeners: function(sectionNode){
		if(sectionNode){
			var smartInfoElements = pega.util.Dom.getElementsById("SI", sectionNode);
			if (smartInfoElements != null && smartInfoElements.length > 0) {
				for (var i = 0; i < smartInfoElements.length; i++) {
					pega.util.Event.removeListener(smartInfoElements[i], "mouseover", pega.u.d.showSmartInfoHarness);
					pega.util.Event.removeListener(smartInfoElements[i], "mouseout", pega.u.d.hideSmartInfoHarness);
				}
            } 
            smartInfoElements = null;
		}
	}
	
};
pega.lang.augmentObject(pega.ui.Doc.prototype, smartInfo);
//static-content-hash-trigger-GCC
var accessk = {
	processAccessKeysOnClient: false,

	/*
	@Handler
	@protected This function attaches access keys to the buttons/anchor tags.
	This function attaches access keys to
	Buttons
	Anchor Tags
	The access key character is identified using "&" symbol and the next character to the "&" symbol is identified.
	If the Submit Button exists and AccessKey "S" is assigned to any Local Action, Local Action access key is changed.
	Button is given the priority than the Local Actions.
	@return $void$
	 */

	attachAccessKeys : function (reloadElem) {
		if (!pega.u.d.processAccessKeysOnClient) {
			return;
		}
		/*IN FF reloadElem is comming as a number)*/
		if (typeof reloadElem == "undefined" || typeof reloadElem == "number") {
			reloadElem = document;
		}
		var buttonsList = reloadElem.getElementsByTagName("BUTTON");
		var anchorList = reloadElem.getElementsByTagName("A");
		var labelList = reloadElem.getElementsByTagName("LABEL");
		//var textAreaList = reloadElem.getElementsByTagName("TEXTAREA");
		var textAreaList = pega.util.Dom.getElementsById("EXPAND", reloadElem, "TEXTAREA");

		var labelForElements = new Array();
		var labelForElementsHash = {};
		var labelListLength = labelList.length;
		var labelElement;
		var parentAnchorEle;
		for (var i = 0; i < labelListLength; i++) {
			if (pega.u.d.isReadOnly())
				break;
			labelElement = labelList[i];
			var labelForAttribute = labelElement.getAttributeNode("for");
			if (labelElement.getAttributeNode("inAnchor")) {
				parentAnchorEle = pega.u.d.findParentAnchor(labelElement);
				if (parentAnchorEle != null) {
					labelForElements.push(labelElement);
					labelForElementsHash[labelForAttribute] = labelElement;
				}
			} else if (labelForAttribute) {
				var labelFor = labelForAttribute.value;
				if (labelFor != "") {
					labelForElements.push(labelElement);
					labelForElementsHash[labelForAttribute] = labelElement;
				}
			}
		}
		var textAreaListLength = textAreaList ? textAreaList.length : 0;
		var getAccessKeyRef = pega.u.d.getAccessKey;
		var setAccessKeyRef = pega.u.d.setAccessKey;
		for (var i = 0; i < textAreaListLength; i++) {
			var oTextArea = textAreaList[i];
			if (oTextArea.id == "EXPAND") {
				var strProperty = oTextArea.DisplayedProperty;
				if (strProperty != null) {
					if (labelForElementsHash[strProperty]) {
						var labelAccessKey = getAccessKeyRef(labelForElementsHash[strProperty]);
						if (labelAccessKey != "") {
							oTextArea.accessKey = labelAccessKey;
							oTextArea['accessKey'] = labelAccessKey;
						}
					}
				}
			}
		}

		var buttonListLength = buttonsList.length;
		var buttonElement;
		var setInnerTextRef = pega.util.Dom.setInnerText;
		var getInnerTextRef = pega.util.Dom.getInnerText;
		for (var i = 0; i < buttonListLength; i++) {
			buttonElement = buttonsList[i];
			if (!buttonElement.getAttribute("isIcon")) {
				var txt = (pega.env.ua.ie) ? buttonElement.innerText : getInnerTextRef(buttonElement);
				if (txt.search('&') != -1) {
					var btnAccessKey = getAccessKeyRef(buttonElement, txt);
					if (btnAccessKey != "") {
						setAccessKeyRef(buttonElement, btnAccessKey);
					} else if (txt.search('&&') != -1) {
						setInnerTextRef(buttonElement, txt.replace(/&&/g, '&'));
					}
				}
			}
		}

		var anchorListLength = anchorList.length;
		var anchorElement;
		for (var i = 0; i < anchorListLength; i++) {
			anchorElement = anchorList[i];
			var anchorIdTemp = anchorElement.id;
			if (anchorIdTemp != "TABANCHOR" && anchorIdTemp != "ACCORANCHOR") {
				var txt = (pega.env.ua.ie) ? anchorElement.innerText : getInnerTextRef(anchorElement);
				if (txt.search('&') != -1) {
					var anchorAccessKey = getAccessKeyRef(anchorElement, txt);
					if (anchorAccessKey != "") {
						setAccessKeyRef(anchorElement, anchorAccessKey);
					} else if (txt.search('&&') != -1) {
						setInnerTextRef(anchorElement, txt.replace(/&&/g, '&'));
					}
				}
			}
		}
		var labelListLength = labelForElements.length;
		var findParentAnchorRef = pega.u.d.findParentAnchor;
		var repaintTextRef = pega.u.d.repaintText;
		for (var i = 0; i < labelListLength; i++) {
			labelElement = labelForElements[i];
			var txt = (pega.env.ua.ie) ? labelElement.innerText : getInnerTextRef(labelElement);
			if (txt.search('&') != -1) {
				var labelAccessKey = getAccessKeyRef(labelElement, txt);
				if (labelAccessKey != "") {
					if (labelElement.getAttributeNode("inAnchor")) {
						parentAnchorEle = findParentAnchorRef(labelElement);
						if (parentAnchorEle != null) {
							if (labelAccessKey != "") {
								parentAnchorEle.accessKey = labelAccessKey;
								parentAnchorEle['accessKey'] = labelAccessKey;
								repaintTextRef(labelElement, labelAccessKey);
							}
						}
					} else if (labelElement.getAttributeNode("for")) {
						setAccessKeyRef(labelElement, labelAccessKey);
					}
				} else if (txt.search('&&') != -1) {
					setInnerTextRef(labelElement, txt.replace(/&&/g, '&'));
				}
			}
			/*if(labelElement.getAttributeNode("for")) {
			pega.u.d.removeDuplicateLabelFor(labelElement, labelElement.getAttributeNode("for").value);
			}*/
		}
	},

	/*
	Sets the current accesskey for the button/key
	@param $object$ element
	@param $String$ accKey
	@return $void$
	 */

	setAccessKey : function (element, accKey) {
		element.accessKey = accKey;
		element['accessKey'] = accKey;
		pega.u.d.repaintText(element, accKey);
	},

	/*
	Gets the current accesskey for the button/key
	@param $object$ element
	@param $String$ optional innerText
	@return $String$ - depends on the type
	 */
	getAccessKey : function (element, bText) {
		bText = bText || pega.util.Dom.getInnerText(element);
		var regEx = /(([^&]|^)&(?!(&|\s|(lt;)|(nbsp;)|(gt;))))+?/;
		var accKey;
		if (regEx.test(bText)) {
			var myArray = regEx.exec(bText);
			accKey = bText.charAt(myArray.index + myArray[0].length);
		} else {
			accKey = "";
		}
		return accKey;
	},

	/*
	Converts the '&' to '_', underline access key char
	@return $void$
	 */
	repaintText : function (element, accessKeyChar) {
		var bText = pega.util.Dom.getInnerText(element);
		var accKeyIndex;
		var temp = "&" + accessKeyChar;
		var b = true;
		var n = 0;
		while (b) {
			var tempIndex = bText.indexOf(temp, n);
			if (tempIndex != -1) {
				accKeyIndex = tempIndex;
			} else {
				b = false;
			}
			if (bText.charAt(accKeyIndex - 1) == "&") {
				n = accKeyIndex + 1;
			} else {
				b = false;
			}
		}

		var elementPreText = bText.substring(0, accKeyIndex);
		var elementPostText = bText.substring(accKeyIndex + 2);
		var innerHtml = elementPreText + "<U>" + accessKeyChar + "</U>" + elementPostText;
		element.innerHTML = innerHtml.replace(/(&&)|(&(?!(lt;)|(nbsp;)|(gt;)))/g, "&amp;");
	},

	removeDuplicateLabelFor : function (labelElement, labelFor) {
		if (labelFor && labelFor != "") {
			var labelForTargets = pega.util.Dom.getElementsById(labelFor, document);
			if (labelForTargets && labelForTargets.length > 1) {
				try {
					if (pega.util.Event.isIE) {
						labelElement.removeAttribute("htmlFor");
					} else {
						labelElement.removeAttribute("for");
					}
				} catch (e) {}
			}
		}
	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, accessk);
//static-content-hash-trigger-GCC
var errorp = {
  /*
 @protected Dispaly Error Table
 This function is called in order to display the error messages using the error text coming from the server.
 This function is called when
 Reload Section
 On screen expression calculation
 @param $String$errorText
 @return $void$
  */

  displayFormErrors: function (errorText) {
    // Check for empty error messages
    if (errorText != null && errorText != "" && pega.u.d.removeEmptyLines(errorText) != "") {
      if (pega.u.d.bModalDialogOpen == true) {
        pega.u.d.displayErrorsOnModal(errorText);
      } else if (pega.u.d.formErrorType == "FLOAT" && pega.ctx.dom.getElementById("FormErrorMarker_Div") != null) {
        pega.u.d.FloatDivInit(errorText);
      } else {
        pega.u.d.defaultErrorDivInit(errorText);
      }
    }
    // Check for error table
    else if (pega.ctx.dom.getElementById("ERRORTABLE") != null) {
      // Hide the ERRORTABLE when no error messages
      pega.ctx.dom.getElementById("ERRORTABLE").style.display = "none";
      pega.ctx.dom.getElementById("ERRORTABLE").setAttribute("aria-hidden","true");
    }
  },

  /* Incase of HARNESS_BUTTONS, causing harness_content to push down SE-24915. Making error_div absolute
  *and harness_content padding-top = height of the error div.
  */
  canErrorDivAbsolute: function () {
    var hBtn = pega.ctx.dom.$('#HARNESS_BUTTONS');
    if (hBtn.length > 0) {
      if (pega.ctx.dom.$('#FormErrorMarker_Div').parent().prop("tagName").toLowerCase() === 'body') {
        return true;
      }
    }

    return false;
  },

  /*Set the harness_content padding-top to give some space to harness buttons*/
  toggleHarnessPadding: function (offsetHeight) {
    if (offsetHeight) {
      pega.ctx.dom.$('#HARNESS_CONTENT').parent().parent().css('padding-top', offsetHeight + 'px');
    } else {
      pega.ctx.dom.$('#HARNESS_CONTENT').parent().parent().css("padding-top", '0px');
    }
  },

  removeEmptyLines: function (errorText) {
    if (errorText != null) {
      return errorText.replace(/^(\s|\n|\r)*((.|\n|\r)*?)(\s|\n|\r)*$/g, "$2");
    }
  },

  defaultErrorDivInit: function (errorText) {
    if(pega.ui && pega.ui.smartinfo && pega.ui.smartinfo.targetElememnt && (pega.ui.smartinfo.targetElememnt.__SmartInfoVisible || pega.ui.smartinfo.targetElememnt._inSmartInfo)){
      return;
    }
    var errorDiv = document.createElement("DIV");
    errorDiv.innerHTML = errorText;
    var errorDiv2 = document.createElement("DIV");
    errorDiv2.innerHTML = errorText;

    // check the existancy of ERRORTABLE
    //var errorTables = pega.util.Dom.getElementsById("ERRORTABLE", document);
    /*BUG-386603 : getting the error table for the current context*/
    var errorTables = [];
    var rootContexts = pega.ctx.dom.querySelectorAll("[data-harness-id='"+pega.ctx.pzHarnessID+"']");
    if(rootContexts.length!=0){
      rootContexts.forEach(function(rootContext){errorTables = errorTables.concat(pega.ctx.dom.querySelectorAll("#ERRORTABLE",rootContext))});
    }else{
      errorTables = pega.ctx.dom.querySelectorAll("#ERRORTABLE");
    }
    if (errorTables && errorTables.length > 0) {
      // Set the error messages to the existing ERRORTABLE

      for (var t = 0; t < errorTables.length; t++) {
        pega.util.Dom.setStyle(errorTables[t], "display", "block");
        errorTables[t].setAttribute("aria-hidden","false");
        var errorSpan = pega.util.Dom.getElementsById("ERRORMESSAGES_ALL", errorTables[t]);
        if (errorSpan && errorSpan.length > 0) {
          var msgSpan = pega.util.Dom.getElementsById("ERRORMESSAGES_ALL", errorDiv);
          if (msgSpan && msgSpan.length > 0) {
            errorSpan[0].innerHTML = msgSpan[0].innerHTML;
          } else {
            errorSpan[0].innerHTML = errorText;
          }
        }
      }
    }

    // Check the existancy of PEGA_HARNESS div tag
    else if (pega.ctx.dom.getElementById("PEGA_HARNESS") != null) {

      var isPageViewHarness = pega.ctx.dom.$("#HARNESS_CONTENT").hasClass("harness-content-workarea-view");
      var errorDivContainerDiv = isPageViewHarness ? "HARNESS_CONTENT" : "PEGA_HARNESS";
      // Set the error messages as the first element to the RULE_KEY div tag
      pega.ctx.dom.getElementById(errorDivContainerDiv).insertBefore(errorDiv, pega.ctx.dom.getElementById(errorDivContainerDiv).firstChild);
      if (pega.u.d.formErrorType != "FLOAT") {
        pega.ctx.dom.getElementById(errorDivContainerDiv).appendChild(errorDiv2);
      }
      var errorTables = pega.util.Dom.getElementsById("ERRORTABLE", document);
      if (errorTables) {
        for (var t = 0; t < errorTables.length; t++) {
          pega.util.Dom.setStyle(errorTables[t], "display", "block");
          errorTables[t].setAttribute("aria-hidden","false");
        }
      }
    }
    //Attaching error div to div with id 'FormErrorMarker_div
    else if (pega.ctx.dom.getElementById('FormErrorMarker_Div')) {
      var formErrorMarkerdiv = pega.ctx.dom.getElementById('FormErrorMarker_Div');
      formErrorMarkerdiv.insertBefore(errorDiv, formErrorMarkerdiv.firstChild);
      formErrorMarkerdiv.style.display = "block";
      pega.ctx.dom.getElementById("ERRORTABLE").style.display = "block";
      pega.ctx.dom.getElementById("ERRORTABLE").setAttribute("aria-hidden","false");
    }
    // No ERRORTABLE or RULE_KEY
    else if (pega.ctx.dom.getElementsByTagName("DIV")[0] != null) {
      // Set the error messages to the first div element of the document
      pega.ctx.dom.getElementsByTagName("DIV")[0].insertBefore(errorDiv, pega.ctx.dom.getElementsByTagName("DIV")[0].firstChild);
      pega.ctx.dom.getElementsByTagName("DIV")[0].style.display = "block";
      pega.ctx.dom.getElementById("ERRORTABLE").style.display = "block";
      pega.ctx.dom.getElementById("ERRORTABLE").setAttribute("aria-hidden","false");
    }
    if(pega.ui && pega.ui.smartinfo && pega.ui.smartinfo.targetElememnt && (pega.ui.smartinfo.targetElememnt.__SmartInfoVisible || pega.ui.smartinfo.targetElememnt._inSmartInfo)){
      return;
    }
    /*(accessibility story) focus on error table start*/
    var accessErrorTable = pega.ctx.dom.getElementById("ERRORTABLE");
    if (accessErrorTable && accessErrorTable.getAttribute("role") === "alert presentation") {
      /*BUG-162342: Adding try-catch below*/
      try {
        this.focusFirstFieldInForm()
      } catch (e) {}
    }
    /*(accessibility story) end*/
  },

  /* focus first filed in overlay and harness if ERRORTABLE is displayed */
  focusFirstFieldInForm: function() {
    var flowActionContainer = document.getElementById("pyFlowActionHTML");
    var harnessContent = document.getElementById("HARNESS_CONTENT");
    var overlayCon = document.getElementById("_popOversContainer")
    if(flowActionContainer !== null && harnessContent !== null && overlayCon === null) {
      var flowActionContainerInput = flowActionContainer.querySelector("input");
      if(flowActionContainerInput !== null) {
        flowActionContainerInput.focus();
      }
    } 
    if(harnessContent !== null && flowActionContainer === null) {
      var harnessContentInput = harnessContent.querySelector("input");
      if(harnessContentInput !== null) {
        harnessContentInput.focus();
      }
    }
    if(overlayCon !== null) {
      var overlayConInput = overlayCon.querySelector("input");
      if(overlayConInput !== null) {
        overlayConInput.focus();
      }
    }
  },

  updateErrorSection: function (node) {
    if (pega.ctx.dom.getElementById("PegaRULESErrorFlag") && this.pyCustomError == "") {
      return;
    }
    var sectionDivTags = null;
    var targetSection = null;

    if (bActionIframe) {
      sectionDivTags = pega.util.Dom.getElementsById("RULE_KEY", document);
      if (sectionDivTags) targetSection = this.getErrorSection(sectionDivTags);else return;
      if (targetSection) {
        this.copyErrorSection(node, targetSection);
      } else {
        sectionDivTags = pega.util.Dom.getElementsById("RULE_KEY", parent.document);
        if (sectionDivTags) targetSection = this.getErrorSection(sectionDivTags);else return;
        targetSection = this.getErrorSection(sectionDivTags);
        if (targetSection) {
          this.copyErrorSection(node, targetSection);
        }
      }
    } else {
      sectionDivTags = pega.ctx.dom.getElementsByClassName("sectionDivStyle  ");
      if (sectionDivTags) targetSection = this.getErrorSection(sectionDivTags);else return;
      targetSection = this.getErrorSection(sectionDivTags);
      if (targetSection) {
        this.copyErrorSection(node, targetSection);
      }
    }
  },

  getErrorSection: function (sectionDivTags) {
    if (sectionDivTags) {
      for (var i = 0; i < sectionDivTags.length; i++) {
        if (sectionDivTags[i].getAttribute("node_name") == this.pyCustomError && sectionDivTags[i].getAttribute("node_type") == "MAIN_RULE" && sectionDivTags[i].parentNode.id != "pyCustomError") {
          return sectionDivTags[i];
        }
      }
      return null;
    } else return null;
  },

  /*copyErrorSection : function (node, target) {
 	var customErrors = pega.util.Dom.getElementsById("pyCustomError", node);
 	if (customErrors) {
 		customErrors = customErrors[0];
 		this.loadDOMObject(target, customErrors.innerHTML);
        }
 	},*/

  // BUG-232352 bug fix.
  copyErrorSection: function (node, target) {
    var customErrors = pega.util.Dom.getElementsById("pyCustomError", node);
    if (customErrors && customErrors.length > 0) {
      customErrors = customErrors[customErrors.length - 1];
      this.loadDOMObject(target, customErrors.innerHTML);
    }
  },

  showhideErrorBtn: function () {
    if (this.errorBtn.getAttribute("errorStatus") == "hide") {
      this.errorDiv.show();
      this.errorBtn.setAttribute("errorStatus", "show");
    } else {
      this.errorDiv.hide();
      this.errorBtn.setAttribute("errorStatus", "hide");
    }
  },

  showhideErrorFloat: function () {
    if (event && event.type === "keyPress") {
      if (event.keyCode !== 13) {
        return;
      }
    }
    pega.u.d.toggleHarnessPadding();
    if (bActionIframe) {
      var errTable = pega.util.Dom.getElementsById("ERRORTABLE", parent.document);
      if (errTable) {
        errTable[0].style.visibility = "visible";
        errTable[0].style.display = "none";
        errTable[0].setAttribute("aria-hidden", "true");
      }
    } else {
      var errTable = pega.util.Dom.getElementsById("ERRORTABLE", pega.ctx.dom.getContextRoot());
      if (errTable) {
        errTable[0].style.visibility = "visible";
        errTable[0].style.display = "none";
        errTable[0].setAttribute("aria-hidden", "true");
        if (errTable[1]) {
          errTable[1].style.display = "none";
          errTable[1].setAttribute("aria-hidden", "true");
        }
      }
      this.overlay.hide();
    }
    var spacer = pega.ctx.dom.getElementById("ErrorTableSpacer");
    if (spacer) {
      spacer.parentNode.removeChild(spacer);
      pega.ctx.dom.getElementById("FormErrorMarker_Div").innerHTML = "";
    }
  },

  FloatDivInit: function (errorMsg) {
    var errorDiv = document.createElement("DIV");
    errorDiv.innerHTML = errorMsg;
    var formErrorMarkerAbs = pega.u.d.canErrorDivAbsolute();
    /* Build overlay based on markup, initially hidden, fixed to the top left of the viewport, and 80% wide*/
    var errorPanel;
    var doc;
    /* Build overlay based on markup, initially hidden, fixed to the top left of the viewport, and 80% wide*/
    if (bActionIframe) {
      errorPanel = pega.ctx.dom.getElementById("FormErrorMarker_Div", parent);
      doc = parent.document;
    } else {
      errorPanel = pega.ctx.dom.getElementById("FormErrorMarker_Div");
      doc = document;
    }
    this.overlay = new pega.widget.Overlay(errorPanel, {
      fixedtopleft: "true",
      visible: true,
      width: "97%"
    });
    this.overlay.cfg.setProperty("fixedtopleft", true);
    this.overlay.render();
    var errorTable = pega.util.Dom.getElementsById("ERRORTABLE", document);
    if (errorTable) {
      errorPanel.innerHTML = pega.util.Dom.getOuterHTML(errorTable[0]);
      errorPanel.style.display = "block";
      errorTable = pega.util.Dom.getElementsById("ERRORTABLE", doc); //Get the errorTables again; now the formerrormarker_div too has an error table.
      errorTable[0].style.display = "block";
      errorTable[0].setAttribute("aria-hidden","false");
      var errorMsgSpan = pega.util.Dom.getElementsById("ERRORMESSAGES_ALL", errorTable[0]);
      if (errorMsgSpan && errorMsgSpan.length > 0) {
        var msgSpan = pega.util.Dom.getElementsById("ERRORMESSAGES_ALL", errorDiv);
        if (msgSpan && msgSpan.length > 0) {
          errorMsgSpan[0].innerHTML = msgSpan[0].innerHTML;
        } else {
          errorMsgSpan[0].innerHTML = errorMsg;
        }
      }

      if (errorTable[1] && !formErrorMarkerAbs) {
        errorTable[1].style.display = "none"; /*(Display the first non floating error Table so that space	shows up.) --> This space now showing huge so hide for BUG-591325*/
        errorTable[1].setAttribute("aria-hidden","true");
        errorTable[1].style.visibility = "hidden"; // The previously first non floating error div is now hidden
      }
      if (errorTable[2] != null) {
        errorTable[2].style.display = "none"; // In case of new harness hide the bottom error table.
        errorTable[2].setAttribute("aria-hidden","true");
      }
      this.closeBtn = pega.ctx.dom.getElementById("errorClose", doc);
      if (this.closeBtn != null) {
        pega.util.Event.addListener(this.closeBtn, "click", pega.u.d.showhideErrorFloat, this, true);
        pega.util.Event.addListener(this.closeBtn, "keypress", pega.u.d.showhideErrorFloat, this, true);
      }
      if (formErrorMarkerAbs) {
        pega.ctx.dom.$(errorPanel).css("position", "absolute");
        pega.u.d.toggleHarnessPadding(errorPanel.offsetHeight);
      }
    } else if (errorTable = pega.util.Dom.getElementsById("ERRORTABLE", errorDiv)) {
      errorPanel.innerHTML = pega.util.Dom.getOuterHTML(errorTable[0]);
      this.closeBtn = pega.ctx.dom.getElementById("errorClose", doc);
      if (this.closeBtn != null) {
        pega.util.Event.addListener(this.closeBtn, "click", pega.u.d.showhideErrorFloat, this, true);
        pega.util.Event.addListener(this.closeBtn, "keypress", pega.u.d.showhideErrorFloat, this, true);
      }

      //HFix-10037/BUG-170363 Start: Changing from PEGA_HARNESS to HARNESS_CONTENT
      var harnessContentEl = pega.ctx.dom.getElementById("HARNESS_CONTENT", doc);
      if (harnessContentEl != null && !formErrorMarkerAbs) {
        var spacer = pega.ctx.dom.getElementById("ErrorTableSpacer", doc);
        if (spacer) {
          spacer.parentNode.removeChild(spacer);
        }
        errorTable[0].id = "ErrorTableSpacer";
        var harnessBodyNoHeadEls = pega.ctx.dom.querySelectorAll("div.harnessBodyNoHead", harnessContentEl);
        //Check for harnessBodyNoHeadEls. If doesnt exist render inside HARNESS_CONTENT.
        if (harnessBodyNoHeadEls.length == 1) {
          harnessBodyNoHeadEls[0].insertBefore(errorTable[0], harnessBodyNoHeadEls[0].firstChild);
        } else {
          harnessContentEl.insertBefore(errorTable[0], harnessContentEl.firstChild);
        }

        /* the errorTableSpacer is used to make space for the overlay in the harness */
        errorTable[0].style.visibility = "hidden";
        errorTable[0].style.display = "block";
        errorTable[0].setAttribute("aria-hidden", "true");
      }
      //HFix-10037/BUG-170363 End: Changing from PEGA_HARNESS to HARNESS_CONTENT

      errorPanel.style.display = "block";

      errorTable = pega.util.Dom.getElementsById("ERRORTABLE", doc);
      errorTable[0].style.display = "block";
      errorTable[0].setAttribute("aria-hidden","false");
      if (formErrorMarkerAbs) {
        pega.ctx.dom.$(errorPanel).css("position", "absolute");
        pega.u.d.toggleHarnessPadding(errorPanel.offsetHeight);
      }
    } else {
      errorPanel.style.display = "none";
      var spacer = pega.ctx.dom.getElementById("ErrorTableSpacer", doc);
      if (spacer && spacer.parentNode) {
        spacer.parentNode.removeChild(spacer);
      }
    }
    /*(accessibility story) focus on error table start*/
    var accessErrorTable = pega.ctx.dom.getElementById("ERRORTABLE");
    if (accessErrorTable && accessErrorTable.style && accessErrorTable.style.display === "block" && accessErrorTable.getAttribute("role") === "alert presentation") {
      this.focusFirstFieldInForm();
    }
    /*(accessibility story) end*/
    this.overlay.show();
  }

};
pega.lang.augmentObject(pega.ui.Doc.prototype, errorp);
//static-content-hash-trigger-GCC
var enableDisableAnypicker = function(divTag, isEnable){
    /* Added to enable/disable Anypicker control - Optimus*/
    if(divTag.classList.contains("anypicker")){
       if(isEnable && divTag.classList.contains("anypicker-disabled")){
          divTag.className = divTag.className.replace(" anypicker-disabled","");
       } 
       else if(!isEnable && !divTag.classList.contains("anypicker-disabled")){
          divTag.className += " anypicker-disabled";
       } 
    }
}

var enableD = {
	elementsDisabled : null,

	/*@protected
	DisableAllOtherButtons disables all other buttons except the passed one
	@return $void$
	 */
	disableAllOtherButtons : function (srcElement, docElement) {
		if (!docElement)
			docElement = pega.u.d.getDocumentElement();
		var buttonList = docElement.getElementsByTagName("BUTTON");
		var anchorList = docElement.getElementsByTagName("A");
		var buttonListLength = buttonList.length;
		var anchorListLength = anchorList.length;
		for (var el = 0; el < buttonListLength; el++) {
			var buttonListItem = buttonList.item(el);
			if (buttonListItem != srcElement && buttonListItem.disabled != true) {
				buttonListItem.disabled = true;
				buttonListItem.setAttribute("busyButton", "true");
				var imgEle = pega.util.Dom.getFirstChild(buttonListItem);
				if (imgEle != null && imgEle.tagName == 'IMG') {
					pega.util.Dom.setStyle(buttonListItem, 'opacity', '0.5');
				}
				if (buttonListItem.getAttribute("isIcon") == "true") {
					buttonListItem.className = buttonListItem.className + "_disabled";
				}
			}
		}
		for (var el = 0; el < anchorListLength; el++) {
			var anchorListItem = anchorList.item(el);
			if (anchorListItem != srcElement) {
				var anchor = anchorListItem;
				if(anchor.getAttribute("onclick") !== "pd(event);"){
					anchor.onclick_func = anchorListItem.getAttribute("onclick");
					anchor.setAttribute("onclick", "pd(event);");
				}
				anchor.href_new = anchorListItem.href;
				anchor.href = "#";
				anchor.className_old = anchorListItem.className;
				anchor.className = anchorListItem.className + " link_disabled";
				anchor.setAttribute("busyButton", "true");
			}
		}
	},

	/*@protected
	enableAllButtons enables all buttons and anchors
	@return $void$
	 */
	enableAllButtons : function (docElement) {
		if (!docElement)
			docElement = pega.u.d.getDocumentElement();
		var buttonList = docElement.getElementsByTagName("BUTTON");
		var anchorList = docElement.getElementsByTagName("A");
		var buttonListLength = buttonList.length;
		var anchorListLength = anchorList.length;
		for (var el = 0; el < buttonListLength; el++) {
			var buttonListItem = buttonList.item(el);
			if (buttonListItem.disabled == true && buttonListItem.getAttribute("busyButton") == "true") {
				buttonListItem.disabled = false;
        var imgEle = pega.util.Dom.getFirstChild(buttonListItem);
				if (imgEle != null && imgEle.tagName == 'IMG' && buttonListItem.style["opacity"]=='0.5') {
					pega.util.Dom.setStyle(buttonListItem, 'opacity', '1.0');
				}
				if (buttonListItem.getAttribute("isIcon") == "true") {
					buttonListItem.className = buttonListItem.className.replace("_disabled", "");
				}
			}
		}
		for (var el = 0; el < anchorListLength; el++) {
			var anchorListItem = anchorList.item(el);
			if (anchorListItem.getAttribute("busyButton") == "true") {
				var anchor = anchorListItem;
				if (anchor.onclick_func){
					if(anchor.getAttribute("onclick") === "pd(event);"){
						anchor.setAttribute("onclick",anchor.onclick_func);
					}
				}
				if (anchor.href_new){
					if(anchor.href != "#" && anchor.href !== window.location.href + '#'){
						anchor.setAttribute("href",anchor.href);
					}else{
						anchor.setAttribute("href",anchor.href_new);
					}
				}
				if(anchor.className_old){
          anchor.className = anchor.className_old;
        }
        if(anchor.className){
          anchor.className = anchor.className.replace(" link_disabled", "");
        }
       
			}
		}
	},

	/*
	@private Enable/Disable elements based on the client when condition
	@param $Object$divTag - The DIV element to be enebaled/disabled
	@param $String$index - Index value
	@param $String$srcValue - Value of the source property
	@param $String$srcIdvalue - ID value of the source property
	@param $Boolean$inRepeat - Whether the target propery is in repeat layout or not
	 */

	enableDisable : function (divTag, index, srcValue, srcIdvalue, inRepeat) {
		//Fetching only those div tags whose name is equal to the name of the source Property
		var expValue = divTag.getAttribute("DISABLE_WHEN");
		var idxValue = divTag.index;

		if (inRepeat == true) {
			idxValue = this.getRepeatRow(divTag);
		}

		if (!idxValue && !(inRepeat == true)) {
			idxValue = -1;
		}

		if (idxValue == index) {
			var returnval = this.evaluate(expValue, [srcIdvalue], [srcValue]);
			var inputTypeArray = new Array("button", "A");
			if (returnval) {
				for (var j = 0; j < inputTypeArray.length; j++) {
					var inputElement = divTag.getElementsByTagName(inputTypeArray[j])[0];
					if (inputElement != null) {
						inputElement.disabled = true;
						this.elementsDisabled[this.elementsDisabled.length] = divTag;
						if (inputElement.getAttribute("isIcon") == "true" || inputElement.getAttribute("data-ctl") == "Icon") {
							if (inputElement.className && inputElement.className.indexOf("_disabled") == -1) {
								inputElement.className = inputElement.className.replace(/(^|\s)cursordefault(\s|$)/, "");
								if (inputElement.className != "" && inputElement.className != null) {
									inputElement.className = inputElement.className + "_disabled";
								}
							}
							var tempTitle = inputElement.title;
							if (inputElement.getAttribute("tempTitle"))
								inputElement.title = inputElement.getAttribute("tempTitle");
							inputElement.setAttribute("tempTitle", tempTitle);
							/*BUG-53071 start*/
							if (inputElement.className.search(/(^|\s)cursordefault(\s|$)/) == '-1') {
								if (inputElement.className == null || inputElement.className == "") {
									inputElement.className = "cursordefault";
								} else {
									inputElement.className = "cursordefault " + inputElement.className;
								}
							}
							if (inputElement.getAttribute("IsSprite")) {
								var bgPos = inputElement.style.backgroundPosition.split(" ");
								var disabledPos = inputElement.style.height.replace("px", "");
								inputElement.style.backgroundPosition = bgPos[0] + " -" + 2 * disabledPos + 'px';
							}
							/*BUG-53071 end*/
						}
						if (inputElement.tagName == "A") {
							if(inputElement.getAttribute("fromicon")!=null){
								inputElement.setAttribute("href_original",inputElement.getAttribute("href"));
								inputElement.setAttribute("href","#");
							
							}else{
								/*BUG-49485 - Autobots*/
								inputElement.href_original = inputElement.href;
								inputElement.href = "#";
								/*BUG-49485 - Autobots*/
								inputElement.onclick_func = inputElement.onclick;
								inputElement.onclick = null;
							}
						}
						/*BUG-53030 -Autobots Start*/
						if (inputElement.tagName == "A" || inputElement.tagName == "BUTTON") {
							//inputElement.style.color = "#ACA899";
                          	pega.util.Dom.addClass(inputElement, "disabledStyle");
						}
						/*BUG-53030 -Autobots End*/
					}
				}
			} else {
				for (var j = 0; j < inputTypeArray.length; j++) {
					var inputElement = divTag.getElementsByTagName(inputTypeArray[j])[0];
					if (inputElement != null) {
						inputElement.disabled = false;
						if (inputElement.isIcon == "true" || inputElement.getAttribute("data-ctl") == "Icon") {
							inputElement.className = inputElement.className.replace("_disabled", "");
							var tempTitle = inputElement.title;
							if (inputElement.getAttribute("tempTitle"))
								inputElement.title = inputElement.getAttribute("tempTitle");
							inputElement.setAttribute("tempTitle", tempTitle);
							/*BUG-53071 start*/
							if (inputElement.className.search(/(^|\s)cursordefault(\s|$)/) != '-1' && inputElement.getAttribute("data-click")) {
								inputElement.className = inputElement.className.replace(/(^|\s)cursordefault(\s|$)/, "");
							}
							if (inputElement.getAttribute("IsSprite")) {
								var bgPos = inputElement.style.backgroundPosition.split(" ");
								inputElement.style.backgroundPosition = bgPos[0] + " " + "top";
							}
							/*BUG-53071 end*/
						}
						if (inputElement.tagName == "A") {
							if (inputElement.onclick_func != null && inputElement.onclick == null) {
								//inputElement.onclick = new Function(inputElement.getAttribute("onclick_func"));
								/*BUG-49485 - Autobots*/
								inputElement.href = inputElement.href_original;
								inputElement.href_original = "#";
								/*BUG-49485 - Autobots*/
								inputElement.onclick = inputElement.onclick_func;
							}else if(inputElement.getAttribute("fromicon")!=null){
								if(inputElement.getAttribute("href_original") != null && inputElement.getAttribute("href_original") != ""){
									inputElement.setAttribute("href",inputElement.getAttribute("href_original"));
									inputElement.setAttribute("href_original","");
								}
                            }
						}
						/*BUG-53030 -Autobots Start*/
						if (inputElement.tagName == "A" || inputElement.tagName == "BUTTON") {
							//inputElement.style.color = "";
                          	pega.util.Dom.removeClass(inputElement, "disabledStyle");
						}
						/*BUG-53030 -Autobots End*/
					}
				}
			}
		}
	},

	/* @api
	Disable all the elements based on parameters
	@param $boolean$bInput - Disable Input elements if true
	@param $boolean$bOther - Disable Other elements if true
	@param $boolean$bComplex - Disable Complex elements if true
	@return $void$
	 */

	disableElements : function (bInput, bOther, bComplex) {
		var allHarnessElements = this.getHarnessElements(bInput, bOther, bComplex);
		for (var i = 0; i < allHarnessElements.length; i++) {
			if (allHarnessElements[i].type == "complex") {
				if (allHarnessElements[i].element.disable)
					allHarnessElements[i].element.disable();
				else
					allHarnessElements[i].disabled = "true";
			} else {
				allHarnessElements[i].disabled = "true";
				if (allHarnessElements[i].getAttribute("isIcon") == "true") {
					allHarnessElements[i].className = allHarnessElements[i].className + "_disabled";
				}
				if (allHarnessElements[i].onclick) {
					allHarnessElements[i].onclick_cpy = allHarnessElements[i].onclick;
					allHarnessElements[i].onclick = null;

				}
				if (allHarnessElements[i].tagName == "A") {
					allHarnessElements[i].href = "#";
				}
			}
		}
	},

	/* @api
	Enable all the elements based on parameters
	@param $boolean$bInput - Enable Input elements if true
	@param $boolean$bOther - Enable Other elements if true
	@param $boolean$bComplex - Enable Complex elements if true
	@return $void$
	 */

	enableElements : function (bInput, bOther, bComplex) {
		var allHarnessElements = this.getHarnessElements(bInput, bOther, bComplex);
		for (var i = 0; i < allHarnessElements.length; i++) {
			if (allHarnessElements[i].type == "complex") {
				if (allHarnessElements[i].element.enable)
					allHarnessElements[i].element.enable();
				else
					allHarnessElements[i].disabled = false;
			} else {
				allHarnessElements[i].disabled = false;
				if (allHarnessElements[i].getAttribute("isIcon") == "true") {
					allHarnessElements[i].className = allHarnessElements[i].className.replace("_disabled", "");
				}
				if (allHarnessElements[i].onclick_cpy) {
					allHarnessElements[i].onclick = allHarnessElements[i].onclick_cpy;
				}

			}
		}
	},

	/* @api
	Highlight all the elements based on parameters
	@param $boolean$bInput - Highlight Input elements if true
	@param $boolean$bOther - Highlight Other elements if true
	@param $boolean$bComplex - Highlight Complex elements if true
	@param $String$className - Highlight style name
	@return $void$
	 */

	highlightElements : function (bInput, bOther, bComplex, className) {
		var allHarnessElements = this.getHarnessElements(bInput, bOther, bComplex);
		for (var i = 0; i < allHarnessElements.length; i++) {
			if (allHarnessElements[i].type == "complex") {
				if (allHarnessElements[i].element.highlight)
					allHarnessElements[i].element.highlight(className);
				else
					this.addClass(allHarnessElements[i], className);
			} else {
				this.addClass(allHarnessElements[i], className);
			}
		}
	},

	/* @api
	Unhighlight all the elements based on parameters
	@param $boolean$bInput - Unhighlight Input elements if true
	@param $boolean$bOther - Unhighlight Other elements if true
	@param $boolean$bComplex - Unhighlight Complex elements if true
	@param $String$className - Unhighlight style name
	@return $void$
	 */

	unhighlightElements : function (bInput, bOther, bComplex, className) {
		var allHarnessElements = this.getHarnessElements(bInput, bOther, bComplex);
		for (var i = 0; i < allHarnessElements.length; i++) {
			if (allHarnessElements[i].type == "complex") {
				if (allHarnessElements[i].element.unhighlight)
					allHarnessElements[i].element.unhighlight();
				else
					this.removeClass(allHarnessElements[i], className);
			} else {
				this.removeClass(allHarnessElements[i], className);
			}
		}
	},

	/* @api
	Highlight element based on the property handle
	@param $String$propertyName - Property name
	@param $String$className - Highlight style name
	@return $void$
	 */

	highlightElement : function (propertyName, className) {
		var propertyEntryHandle = pega.u.property.toHandle(propertyName, strPrimaryPage);
		var elements = pega.util.Dom.getElementsByName(propertyEntryHandle);
		var status = false;
		if (elements) {
			for (var i = 0; i < elements.length; i++) {
				this.addClass(elements[i], className);
				if (elements[i].tagName == "TEXTAREA") {
					var parentTD = elements[i].parentNode;
					var textAreas = parentTD.getElementsByTagName("TEXTAREA");
					if (textAreas && textAreas.length == 2) {
						this.addClass(textAreas[0], className);
					}
				}
				status = true;
			}
		}
		return status;
	},

	/* @api
	Disable element based on the property handle
	@param $String$propertyName - Property name
	@return $void$
	 */

	disableElement : function (propertyName) {
		var propertyEntryHandle = pega.u.property.toHandle(propertyName, strPrimaryPage);
		var elements = pega.util.Dom.getElementsByName(propertyEntryHandle);
		var status = false;
		if (elements) {
			for (var i = 0; i < elements.length; i++) {
				elements[i].disabled = true;
				status = true;
			}
		}
		return status;
	},


	controlDisabler : function (divTag) {
		var inputTypeArray = new Array("button", "A", "img", "input", "select", "textarea","i");
    enableDisableAnypicker(divTag, false);
		for (var j = 0; j < inputTypeArray.length; j++) {
			var inputElement_Arr = divTag.getElementsByTagName(inputTypeArray[j]);
			if (inputTypeArray[j] != "button" && inputTypeArray[j] != "A" && inputTypeArray[j] != "img" && inputTypeArray[j] != "i") {
				for (var i = 0; i < inputElement_Arr.length; i++) {
					var inputElement = inputElement_Arr[i];
					/*BUG-50659 - Autobots*/
					if (inputElement.disabled == true)
						return;
					/*BUG-50659 - Autobots*/
					inputElement.disabled = true;
                    /* Added to disable multiselect control - Swordfish*/
                    var isMultiselect=inputElement.className?inputElement.className.indexOf("multiselect-list"):-1;
                    if(isMultiselect>-1){
                       var msParent=inputElement.parentElement?inputElement.parentElement.className:"";
                       if(msParent!="" && msParent.indexOf("multiselect-disabled")==-1){
                         	inputElement.parentElement.className+=" multiselect-disabled";
                         	inputElement.style.display="none";
                       }
                       		
                    }
				}
			} else if (inputElement_Arr[0] != null) {
				var inputElement = inputElement_Arr[0];
				/*BUG-50659 - Autobots*/
				if (inputElement.getAttribute('disabled') == "disabled")
					return;
				/*BUG-50659 - Autobots*/
				inputElement.setAttribute('disabled','disabled');
				if (inputElement.getAttribute("isIcon") == "true" || inputElement.getAttribute("data-ctl") == "Icon") {
					if (inputElement.className && inputElement.className.indexOf("_disabled") == -1) {
						inputElement.className = inputElement.className.replace(/(^|\s)cursordefault(\s|$)/, "");
						if (inputElement.className != "" && inputElement.className != null) {
							inputElement.className = inputElement.className + "_disabled";
						}
					}
					var tempTitle = inputElement.title;
					if (inputElement.getAttribute("tempTitle"))
						inputElement.title = inputElement.getAttribute("tempTitle");
					inputElement.setAttribute("tempTitle", tempTitle);
					
					if(inputElement.getAttribute("tabindex")){
						inputElement.removeAttribute("tabindex");
					}
          
          inputElement.setAttribute("aria-disabled","true");
					/*if(inputElement.getAttribute("role")){
						inputElement.removeAttribute("role");
					}*/
					
					/*BUG-53071 start*/
					if (inputElement.className.search(/(^|\s)cursordefault(\s|$)/) == '-1') {
						if (inputElement.className == null || inputElement.className == "") {
							inputElement.className = "cursordefault";
						} else {
							inputElement.className = "cursordefault " + inputElement.className;
						}
					}
					if (inputElement.getAttribute("IsSprite")) {
						var bgPos = inputElement.style.backgroundPosition.split(" ");
						var disabledPos = inputElement.style.height.replace("px", "");
						inputElement.style.backgroundPosition = bgPos[0] + " -" + 2 * disabledPos + 'px';
					}
					/*BUG-53071 end*/
				}
				if (inputElement.tagName == "A") {
					inputElement.setAttribute("tabIndex","-1");
          	inputElement.setAttribute("aria-disabled","true");

					if(inputElement.getAttribute("fromicon")!=null){
						inputElement.setAttribute("href_original",inputElement.getAttribute("href"));
						inputElement.setAttribute("href","#");
					
					}else{
						/*BUG-49485 - Autobots*/
						inputElement.setAttribute("href_original",inputElement.getAttribute("href"));
						inputElement.setAttribute("href","#");
						/*BUG-49485 - Autobots*/
						inputElement.onclick_func = inputElement.onclick;
						inputElement.onclick = null;
					}
				}
				/*BUG-53030 -Autobots Start*/
				if (inputElement.tagName == "A" || inputElement.tagName == "BUTTON") {
					//inputElement.style.color = "#ACA899";
                  	pega.util.Dom.addClass(inputElement, "disabledStyle");
					inputElement.setAttribute("tabIndex","-1");
				}
				/*BUG-53030 -Autobots End*/

				if (inputElement.tagName.toLowerCase() == "img" && inputElement.getAttribute("data-ctl") == "[\"DatePicker\"]") {
					if (inputElement.className != "" && inputElement.className != null) {
						inputElement.className = inputElement.className + "_disabled";
					}
                  if(inputElement.previousSibling && typeof(inputElement.previousSibling.hasAttribute) === "function" && inputElement.previousSibling.hasAttribute('data-ctl') && inputElement.previousSibling.classList.contains('rdOnlySpn')){
                    inputElement.previousSibling.removeAttribute('data-ctl');
                  }
				}
			}
		}
	},

	controlEnabler : function (divTag) {
		var hasIconActions = false;
		var inputTypeArray = new Array("button", "A", "img", "input", "select", "textarea","i");
    enableDisableAnypicker(divTag, true);
		for (var j = 0; j < inputTypeArray.length; j++) {
			var inputElement_Arr = divTag.getElementsByTagName(inputTypeArray[j]);
			if (inputTypeArray[j] != "button" && inputTypeArray[j] != "A" && inputTypeArray[j] != "img" && inputTypeArray[j] != "i") {
				for (var i = 0; i < inputElement_Arr.length; i++) {
					var inputElement = inputElement_Arr[i];
					/*BUG-50659 - Autobots*/
					if (inputElement.disabled == false)
						return;
					/*BUG-50659 - Autobots*/
					inputElement.disabled = false;
                    /* Added to enable multiselect control - Swordfish*/
                    var isMultiselect=inputElement.className?inputElement.className.indexOf("multiselect-list"):-1;
                    if(isMultiselect>-1){
                       var msParent=inputElement.parentElement?inputElement.parentElement.className:"";
                       if(msParent!="" && msParent.indexOf("multiselect-disabled")>-1){
                         
                         inputElement.parentElement.className=inputElement.parentElement.className.replace(" multiselect-disabled","");
                         inputElement.style.display="block";
                         
                       }
                      
                    }
				}
			} else if (inputElement_Arr[0] != null) {
				var inputElement = inputElement_Arr[0];
				/*BUG-50659 - Autobots*/
				if (inputElement.getAttribute('disabled') == null)
					return;
				/*BUG-50659 - Autobots*/
				inputElement.removeAttribute('disabled');
				if (inputElement.isIcon == "true" || inputElement.getAttribute("data-ctl") == "Icon") {
					inputElement.className = inputElement.className.replace("_disabled", "");
					var tempTitle = inputElement.title;
					hasIconActions = inputElement.getAttribute("data-focus") || inputElement.getAttribute("data-click") || inputElement.getAttribute("data-hover") || inputElement.getAttribute("data-rightclick") || inputElement.getAttribute("data-dbclick") || inputElement.getAttribute("data-keyup");
					if(hasIconActions){
						inputElement.setAttribute("tabindex","0");
						//inputElement.setAttribute("role","link");
					}
					if (inputElement.getAttribute("tempTitle"))
						inputElement.title = inputElement.getAttribute("tempTitle");
					inputElement.setAttribute("tempTitle", tempTitle);
					/*BUG-53071 start*/
					if (inputElement.className.search(/(^|\s)cursordefault(\s|$)/) != '-1' && inputElement.getAttribute("data-click")) {
						inputElement.className = inputElement.className.replace(/(^|\s)cursordefault(\s|$)/, "");
					}
					if (inputElement.getAttribute("IsSprite")) {
						var bgPos = inputElement.style.backgroundPosition.split(" ");
						inputElement.style.backgroundPosition = bgPos[0] + " " + "top";
					}
					/*BUG-53071 end*/
          if(inputElement.hasAttribute("aria-disabled")){
            inputElement.removeAttribute("aria-disabled");
          }
				}
				if (inputElement.tagName == "A") {
					if(inputElement.getAttribute("tabindex") == "-1"){
						inputElement.removeAttribute("tabindex");
					}
          if(inputElement.hasAttribute("aria-disabled")){
            inputElement.removeAttribute("aria-disabled");
          }
					if (inputElement.onclick_func != null && inputElement.onclick == null) {
						/*BUG-49485 - Autobots*/
						inputElement.setAttribute("href",inputElement.getAttribute("href_original"));
						inputElement.setAttribute("href_original","#");
						/*BUG-49485 - Autobots*/
						inputElement.onclick = inputElement.onclick_func;
					}else if(inputElement.getAttribute("fromicon")!=null){
						if(inputElement.getAttribute("href_original") != null && inputElement.getAttribute("href_original") != ""){
							inputElement.setAttribute("href",inputElement.getAttribute("href_original"));
							inputElement.setAttribute("href_original","");
						}
						//inputElement.href = inputElement.href_original;
						//inputElement.href_original = "#";
					}
				}
				/*BUG-53030 -Autobots Start*/
				if (inputElement.tagName == "A" || inputElement.tagName == "BUTTON") {
					//inputElement.style.color = "";
                  	pega.util.Dom.removeClass(inputElement, "disabledStyle");
					if(inputElement.getAttribute("tabindex") == "-1"){
						inputElement.removeAttribute("tabindex");
					}
				}
				/*BUG-53030 -Autobots End*/
				if (inputElement.tagName.toLowerCase() == "img" && inputElement.getAttribute("data-ctl") == "[\"DatePicker\"]") {
					inputElement.className = inputElement.className.replace("_disabled", "");
				}
              if(inputElement.previousSibling && typeof(inputElement.previousSibling.hasAttribute) === "function" && !inputElement.previousSibling.hasAttribute('data-ctl') && inputElement.previousSibling.classList.contains('rdOnlySpn')){
                    inputElement.previousSibling.setAttribute('data-ctl',"[\"DatePicker\"]");
                  }
			}
		}
	}

};

pega.lang.augmentObject(pega.ui.Doc.prototype, enableD);
//static-content-hash-trigger-GCC
var lazyLoad = {

	/* queue for lazy loaded layouts and sections */
	lazyLoadManager : new pega.ui.LoadManager({
		/*
		 *function to populate lazy load queue with layouts and sections which are marked to be loaded lazily; need to load them after harness load and every AJAX refresh
		 */
		queuePopulator : function (lazyLoadQ, adpBoundSections) {
			/*
			 * since the current implementation is that in a response only one span exists with info about lazyily loaded UI which ,
			 * after reading, we remove from DOM hence no need to keep track of reloadElement and only process the document object
			 */
			var lazyLoadSpan = pega.ctx.dom.getElementById("lazyLoadInfo");
			if (!lazyLoadSpan) {
				return;
			}
			var lazyLoadInfo = lazyLoadSpan.innerHTML;
			lazyLoadInfo = lazyLoadInfo.split("~#LLDELIM#~");
			var len = lazyLoadInfo.length - 1;

			var lazyInfo = [];
			var lazyElts = {};

			for (var i = 0; i < len; i++) {
				lazyInfo = lazyLoadInfo[i].split(",");
				var lazyInfoLen = lazyInfo.length;
				var lazyParams = null;
				var lazyParam = [];

				/* the lazy load place holder div should have time stamp as its id i.e. they should be a number */
				if (lazyInfo[0] == "" || isNaN(lazyInfo[0]) || lazyInfo[0]in lazyElts || pega.ctx.dom.$("div[data-lazyloaddivid="+ lazyInfo[0] +"][class='lazyload-layout']").length != 0) {
					continue;
				} else {
					/* keep track of all the lazy portions to avoid duplicate entries in the queue */
					lazyElts[lazyInfo[0]] = 1;
				}

				var isADP = false;
				for (var j = 0; j < lazyInfoLen; j++) {
					if (lazyInfo[j].indexOf("=") > 0) {
						/* name=value pair found */
						lazyParam = lazyInfo[j].split("=");
						if (lazyParam.length == 2) {
							/* name and value both found */
							if (!lazyParams) {
								lazyParams = new SafeURL();
							}
							if (!isADP && lazyParam[0] == "isADP" && lazyParam[1] == "1") {
								isADP = true;
								continue;
								/* This field not required in request parameters */
							}
							lazyParams.put(lazyParam[0], lazyParam[1]);
						}
					}
				}

				if (isADP && adpBoundSections) {
					adpBoundSections.push({
						reloadElement : lazyInfo[0],
						layoutId : lazyInfo[1],
						qParamsSafeURL : lazyParams,
            harnessId: pega.ctx.pzHarnessID
					});
				} else {
					lazyLoadQ.enqueue({
						reloadElement : lazyInfo[0],
						layoutId : lazyInfo[1],
						qParamsSafeURL : lazyParams,
            harnessId: pega.ctx.pzHarnessID
					});
				}

			}
			lazyLoadSpan.parentNode.removeChild(lazyLoadSpan);
		}
	}),


	parseLazyLoadSpan : function (newStream) {

		var lazyLoadSpanBegin = "<span style='display:none' id='lazyLoadInfo'>";
		var len = lazyLoadSpanBegin.length;
		var lazyLoadSpanStartsAt = -1;
		var lazyLoadSpanEndsAt = -1;
		var lazyLoadInfo = "";

		lazyLoadSpanStartsAt = newStream.indexOf(lazyLoadSpanBegin, 0);
		if (lazyLoadSpanStartsAt == -1) {
			lazyLoadSpanBegin = "<SPAN style=\"DISPLAY: none\" id=lazyLoadInfo>";
			lazyLoadSpanStartsAt = newStream.indexOf(lazyLoadSpanBegin, 0);
		}

		/* When we upload file using asyncRequest we get this value from innerHTML so changed order of ID to solve issue in IE10*/
		if (lazyLoadSpanStartsAt == -1) {
			lazyLoadSpanBegin = "<SPAN id=lazyLoadInfo style=\"DISPLAY: none\">";
			lazyLoadSpanStartsAt = newStream.indexOf(lazyLoadSpanBegin, 0);
		}
		while (lazyLoadSpanStartsAt > -1) {
			lazyLoadSpanEndsAt = newStream.indexOf("</span>", lazyLoadSpanStartsAt);
			if (lazyLoadSpanEndsAt < 0) {
				lazyLoadSpanEndsAt = newStream.indexOf("</SPAN>", lazyLoadSpanStartsAt);
			}
			if (lazyLoadSpanEndsAt < 0) {
				break;
			}
			lazyLoadInfo += newStream.substring(lazyLoadSpanStartsAt + lazyLoadSpanBegin.length, lazyLoadSpanEndsAt);
			lazyLoadSpanStartsAt = newStream.indexOf(lazyLoadSpanBegin, lazyLoadSpanEndsAt);
		}
		if (lazyLoadInfo) {
			var newLazyLoadSpan = document.createElement("SPAN");
			newLazyLoadSpan.style.display = "none";
			newLazyLoadSpan.id = "lazyLoadInfo";

			newLazyLoadSpan.innerHTML = lazyLoadInfo;
			document.body.appendChild(newLazyLoadSpan);
		}
	},

	/*
	@protected Handles Defer Loading.
	This function handles defer loading when user clicks on Expand All/Collapse All buttons.
	@param $Array$arPlusMinus
	@return $void$
	 */

	handleDeferLoading : function (arPlusMinus) {
		// if there is any section that is defer loaded then we need to resubmit
		var deferLoaded = false;
		if (arPlusMinus != null) {
			if (arPlusMinus.length != null) {
				for (var el = 0; el < arPlusMinus.length; el++) {
					if (arPlusMinus[el].getAttribute("data-defer")) {
						deferLoaded = true;
						break;
					}
				}
			}
		}
		if (deferLoaded) {
			var isNewActionArea = document.getElementById('pyActionArea');
			if (isNewActionArea) {
				var newURL = SafeURL_createFromEncryptedURL(document.main.action);
				if (newURL) {
					newURL.put("pyActivity", "Show-Harness");
					newURL.put("HarnessMode", pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty('strHarnessMode'));
					document.main.action = newURL.toURL();
				}
			}
			/* Added to avoid submitting placeholder value while reloading the harness : START */
			pega.control.PlaceHolder.removePlaceHolderValues(document.main);
			/* Added to avoid submitting placeholder value while reloading the harness : END */
			try {
				var expandAllEl = document.createElement('input');
				expandAllEl.type = 'hidden';
				expandAllEl.name = 'EXPAND_ALL';
				expandAllEl.value = 'true';
				document.main.appendChild(expandAllEl);
			} catch (e) {}

			pega.u.d.fixBaseThreadTxnId();
			document.main.submit();
		}
	},

	/*
	@Handler
	@protected Loads the contents of defer loaded container
	This function is called when user tries to expand defer loaded sections.
	It gets the stream from the server and replaces the corresponding DIV tag with the newly created DIV element that was created from the new stream.
	@param $Object$expandElement
	@return $void$
	 */
	loadContainer : function (expandElement, event, container) {
		event = event === undefined ? window.event : event;
		
      	if (typeof this.expandIt === "function") {
        	// expand it
			this.expandIt(expandElement, event);
        }
		expandElement.onclick = function (e) {
			e = e || window.event;
			expandHeader(this, e);
		};
    expandElement.onkeydown = function (e) {
      e = e || window.event;
      if(e.keyCode === 13)
      expandHeader(this, e);
    }

		this.loadLayout(expandElement, event, container);
	},


	loadLayout : function(expandElement, event, container, expandInnerDiv, invokeMethod) {
		var tempExpandElement = expandElement;
		// get the parameter name for the containter
    var harnessContainer = pega.ctx.dom.getContextRoot();
		if (expandElement == null)
			var expandElement = pega.util.Event.getTarget(event);
		while (expandElement.id != "EXPAND-OUTERFRAME" && (expandElement.getAttribute("data-role") !== "tab" && expandElement.getAttribute("role") !== "tab")) {
			expandElement = expandElement.parentNode;
			if (expandElement == harnessContainer)
				return;
		}


		var innerDiv = invokeMethod ? false : true;
		var paramName = expandElement.getAttribute("PARAM_NAME");
		// get inner div
		/*expandInnerDiv = expandInnerDiv ? expandInnerDiv : pega.util.Dom.getElementsById("EXPAND-INNERDIV", expandElement);*/
		
		/* BUG-322970 --START-When there is a section include inside header and the section include has a layout which is expand collpase then wrong expandInnerDiv is being picked up.*/
		if(!expandInnerDiv){
			var $parentObj = $(pega.util.Event.getTarget(event));
			var $expandPlusMinus = $parentObj.closest("[id='EXPAND-PLUSMINUS']");
			expandInnerDiv = $expandPlusMinus.siblings("[id='EXPAND-INNERDIV']");

			if(expandInnerDiv && expandInnerDiv != null && expandInnerDiv.length != 1)
				expandInnerDiv = pega.ctx.dom.querySelector("#EXPAND-INNERDIV", expandElement);
		}
		/* BUG-322970 --END*/

		if (expandInnerDiv.length)
			expandInnerDiv = expandInnerDiv[0];
    
		var readOnly = this.getReadOnlyValue("", expandInnerDiv);
		// get the new stream display
		if (container == null || container == "harness") {
			//R-18888 Code Updated to create SafeURLs
			var strUrlSF = new SafeURL("Rule-HTML-Harness.GetContainerHTML");
			strUrlSF.put("pzPrimaryPageName", strPrimaryPage);
			strUrlSF.put("ClassName", strHarnessClass);
			strUrlSF.put("StreamName", strHarnessPurpose);
			strUrlSF.put("PrimaryPage", strPrimaryPage);
		} else {
			var reloadElement = pega.u.d.getSectionDiv(expandInnerDiv);
			if (!reloadElement) {
				return;
			}
			var baseRef = this.getBaseRef(expandInnerDiv);
			var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
			var index = expandElement.getAttribute("INDEX");
			strUrlSF.put("pyActivity", "ReloadSection");
			strUrlSF.put("StreamName", reloadElement.getAttribute("node_name"));
			strUrlSF.put("StreamClass", reloadElement.getAttribute("objclass"));
			strUrlSF.put("bClientValidation", bClientValidation);
			strUrlSF.put("BaseReference", baseRef);
			strUrlSF.put("pzKeepPageMessages", "true");
      // send the harness name and harness class, used by personalized template grid - start
      var strPHarnessClass = pega.ctx.strHarnessClass || "";
      var strPHarnessPurpose = pega.ctx.strHarnessPurpose || "";
      strUrlSF.put("strPHarnessClass", strPHarnessClass);
      strUrlSF.put("strPHarnessPurpose", strPHarnessPurpose);
      // send the harness name and harness class, used by personalized template grid - end
			var expandRL = reloadElement.getAttribute("expandRL");
			if (expandRL) {
				strUrlSF.put("expandRL", expandRL);
			}
			if (index)
				strUrlSF.put("index", index);
			strUrlSF.put("Increment", "true");
            /* BUG-264505 :Null check */
            var isTemplateEnabled = false;
            if(expandInnerDiv.firstElementChild){
              isTemplateEnabled = expandInnerDiv.firstElementChild.hasAttribute('data-template');
            }else{
              isTemplateEnabled = expandInnerDiv.hasAttribute('data-template');
            }
	       	strUrlSF.put("UITemplatingStatus", isTemplateEnabled ? "Y" : "N");
		}
		strUrlSF.put("ReadOnly", readOnly);
		invokeMethod = invokeMethod ? invokeMethod : expandInnerDiv.getAttribute("data-deferinvoke");
		if(invokeMethod) {
			strUrlSF.put("pyCallStreamMethod", invokeMethod);
            strUrlSF.put("pyLayoutMethodName", invokeMethod);/*BUG-266315: Adding pyLayoutMethodName as pyCallStreamMethod is deleted during deferload */
		} else {
			strUrlSF.put("RenderSingle", paramName);
		}

		this.setBusyIndicator(expandElement);
		var callbackArgs = new Array(expandInnerDiv, expandElement, paramName, innerDiv);
		var callback = {
			success : this.handleLoadSuccess,
			failure : this.handleLoadFail,
			scope : this,
			argument : callbackArgs
		};

		this.asyncRequest('POST', strUrlSF, callback, '');

	},

	/*
	Success handler for the AJAX call from load container
	@param $object$ responseObj
	@return $void$
	 */
	handleLoadSuccess : function (responseObj) {
		var newStream = responseObj.responseText;
		var expandInnerDiv = responseObj.argument[0];
		var expandElement = responseObj.argument[1];
		var paramName = responseObj.argument[2];
		if (responseObj.argument.length > 3)
			var innerDivExists = responseObj.argument[3];
		else
			var innerDivExists = false;
		if (responseObj.argument[8] && responseObj.argument[8].nullify) {
			responseObj.argument[8].nullify();
			var tmpHE = pega.u.d.harnessElements;
			if (tmpHE) {
				for (var heIndex = 0; heIndex < tmpHE.length; heIndex++) {
					if (tmpHE[heIndex].element === responseObj.argument[8]) {
						tmpHE.splice(heIndex, 1);
						break;
					}
				}
			}
		}
		var newElement = document.createElement("DIV");
		if (pega.util.Event.isIE) {
			newElement.innerHTML = expandInnerDiv.outerHTML;
		} else {
			var newDiv = expandInnerDiv.cloneNode(true);
			newElement.appendChild(newDiv);

		}

		if (innerDivExists) {
			var theNode = pega.util.Dom.getElementsById("EXPAND-INNERDIV", newElement);
		} else {
			var theNode = newElement;
		}
		if (pega.u.d.checkExceptions(newStream, expandInnerDiv)) {
			pega.u.d.gBusyInd.hide();
			return;
		}
		if (theNode) {
			if (innerDivExists && theNode.length > 0) {
				theNode[0].innerHTML = newStream;
				theNode = theNode[0];
			} else
				theNode.innerHTML = newStream;
		}

		// get the first div with id as EXPAND_INNERDIV
		// first get the table with the given param name
		var expandTableList = pega.util.Dom.getElementsById("EXPAND-OUTERFRAME", theNode);
		var newExpandTable = expandTableList;
        var newInnerDiv = "";
		if (expandInnerDiv.getAttribute("data-deferinvoke")) {
			$(expandElement).find(".header-left[data-defer='true']").removeAttr("data-defer");
            /* BUG-267460: Append the RDL + RDLShowDetails div + RDLPaginator div. 
             * If there is a script element, then it is laoded first else the RDL is loaded first.
             * BUG-269291: Changed $(theNode).find to $(theNode).children so only the first level of 			  * children are considered when looking for RDL.
             */
            var rdlNode = $(theNode).children(".rdlWrapperDiv").get(0);
            if(rdlNode){
              var rdlScriptNode = $(theNode).children("script").get(0);
              var bScriptFirst = false;
              if(rdlScriptNode){
                pega.u.d.loadDOMObject(expandInnerDiv, rdlScriptNode.outerHTML);
                bScriptFirst = true;
              }
              if(bScriptFirst){
	              pega.u.d.loadDOMObject(expandInnerDiv, rdlNode.outerHTML, null, {domAction:"append", domElement:expandInnerDiv});
              }else{
                pega.u.d.loadDOMObject(expandInnerDiv, rdlNode.outerHTML);
              }
            }else{
              	this.loadDOMObject(expandInnerDiv, $(theNode).children().first().prop('outerHTML'));
            }
                      
			expandInnerDiv.removeAttribute("data-deferinvoke");
		} else if (expandTableList) {
			for (var i = 0; i < expandTableList.length; i++) {
				newExpandTable = expandTableList[i];
				if (expandTableList[i].getAttribute("PARAM_NAME") == paramName) // found the right one
					break;
			}
			if (innerDivExists) {
				newInnerDiv = pega.util.Dom.getElementsById("EXPAND-INNERDIV", newExpandTable);
				if (newInnerDiv && newInnerDiv.length > 0)
					newInnerDiv = newInnerDiv[0];
			} else {

				var childNodes;
				if (newExpandTable.tagName.toUpperCase() == "TABLE") {
					childNodes = pega.util.Dom.getChildren(newExpandTable.rows[0].cells[0]);
				} else {
					// new div based container
					childNodes = pega.util.Dom.getChildren(newExpandTable);
				}
				if (childNodes && childNodes.length == 2) {
					newInnerDiv = childNodes[1];
				} else {
					newInnerDiv = childNodes[0];
				}
				if (!(pega.util.Dom.hasClass(expandInnerDiv, "expandInnerDivStyle") && pega.util.Dom.hasClass(newInnerDiv, "expandInnerDivStyle"))) {
					var gridObj = null;
					if(responseObj.argument.length >= 8) {
                        /*BUG-263151 : Changed the argument index to 7*/
						gridObj = responseObj.argument[7];
					}
					if(gridObj && gridObj.gridDiv) {/* Identify if grid */
						if(gridObj.bRefreshOnUpdate && childNodes.length == 2) {
							/* HFix-9652 :BUG-160819:  In case of grid, if bRefreshOnUpdate == true then replace header too */
							expandInnerDiv = expandInnerDiv.parentNode;
						}
						if(newInnerDiv.tagName.toUpperCase() == "DIV" && pega.util.Dom.hasClass(newInnerDiv, "layout-noheader")) {/* BUG-174836: If container format is "Default" then header has "div"s instead of table and in case of "div" based header skip this block to avoid duplicate div nodes. */
						} else {
							newInnerDiv = newInnerDiv.parentNode;
						}
					} else {
						newInnerDiv = newInnerDiv.parentNode;
					}
				}
			}
			if (responseObj.argument[8] && responseObj.argument[8].editConfig == "harness") {
				/*BUG-108448: Call clean up in case of "REFRESHLIST", Add Child, Add Item Before, Add Item After */
				this.cleanUpHarnessElements(null, [expandInnerDiv]);
			}
			this.loadDOMObject(expandInnerDiv, newInnerDiv.innerHTML);
		} else {
			this.loadDOMObject(expandInnerDiv, "&nbsp;");
		}
		/*BUG-106762:  Show the form errors when layout is reloaded*/
		if(newInnerDiv){
			newInnerDiv.innerHTML = newStream;
			this.handleFormErrors(newInnerDiv);
		}

		if (responseObj.argument[5] == "reloadRepeat") {
			try {
			if(responseObj.argument[4]['focus'] === "paginator-element") { // Set in case of a grid pagination action
				this.getFocusOnPaginatorElement(expandInnerDiv, responseObj.argument[4]['grid-action-class']);
			} else {
				var PageListProperty = responseObj.argument[4][0];
				var indexInList = responseObj.argument[4][1];
				this.getFocusOnNewRow(PageListProperty, indexInList, expandInnerDiv);
			}
			} catch (e) {}
			pega.u.d.inCall = false;
			if (pega.u.d.changeInEventsArray) {
				pega.u.d.changeInEventsArray.fire();
			}
			pega.u.d.gBusyInd.hide();
		}

		var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", theNode);
		if (onlyOnceEle && onlyOnceEle[0]) {
			this.handleOnlyOnce(onlyOnceEle[0]);
		}
		pega.u.d.gBusyInd.hide();
		/*BUG-70538 Commented the below code as ChangeTracker takes care of refreshing*/
		/*var adddDeleteArg = responseObj.argument[6];
		if(adddDeleteArg && adddDeleteArg.listName)
		pega.u.d.triggerAddDeleteRefreshSections(adddDeleteArg);*/

	},

	/*
	Fail callback hadler for the AJAX call from load container
	@param $object$ responseObj
	@return $void$
	 */

	handleLoadFail : function (responseObj) {
		pega.u.d.gBusyInd.hide();
		pega.u.d.inCall = false;
		if (pega.u.d.changeInEventsArray)
			pega.u.d.changeInEventsArray.fire();
	},

	doLazyLoad : function () {
		setTimeout(function () {
			pega.u.d.lazyLoadManager.startLoading();
		}, 10);
	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, lazyLoad);
lazyLoad = null;
//static-content-hash-trigger-GCC
var busyI = {
	gBusyInd : null,
	busyIndInterval : 2000,

	/* @Handler @api
	Set the busy indicator for form submit ,AJAX call and onloads
	@param $String$ strBusyText - Busy text for busy indicator
	@return $object$ busy indictor object which will be needed to hide in success
	 */
	setBusyIndicator : function (busyDiv, ignoreInterval, showOnlyMask) {
		if (pega.u.d.gBusyInd == null) {
			if (busyDiv !== null) {
				pega.u.d.gBusyInd = new pega.ui.busyIndicator(busyIndText, true, busyDiv, pega.u.d.busyIndInterval);
			} else if (document.frames && document.frames.name == "actionIFrame") {
				pega.u.d.gBusyInd = new parent.pega.ui.busyIndicator(busyIndText, true, parent.document.getElementById("PEGA_HARNESS"), pega.u.d.busyIndInterval);
			} else {
				pega.u.d.gBusyInd = new pega.ui.busyIndicator(busyIndText, true, document.getElementById("PEGA_HARNESS"), pega.u.d.busyIndInterval);
			}
		} else {
			if (busyDiv) {
				pega.u.d.gBusyInd.setTargetElement(busyDiv);

			} else {
				pega.u.d.gBusyInd.setTargetElement(document.getElementById("PEGA_HARNESS"));
			}
		}
		pega.u.d.gBusyInd.show(ignoreInterval, showOnlyMask);
		return pega.u.d.gBusyInd;
	},
  
    setBusyIndicatorWithDelay : function (busyDiv, delay) {
       if(pega.u.d.gBusyInd) {
          var origBusyIndInterval = pega.u.d.gBusyInd.busyIndInterval;
          pega.u.d.gBusyInd.busyIndInterval = delay;
	   } else {
          var origBusyIndInterval = pega.u.d.busyIndInterval;
          pega.u.d.busyIndInterval = delay;
	   }
	   pega.u.d.setBusyIndicator(busyDiv,false,true);
	   pega.u.d.gBusyInd.busyIndInterval = origBusyIndInterval;
    },
  
  
	/* @Handler @private
	replaces the button with busy text. For old buttons just replace the inner HTML with span.
	For new buttons added through the HTML property record replace the table.
	@param $object$ objButton
	@param $object$ strBusyText
	@return $void$
	 */
	makeButtonBusy : function (objButton, strBusyText) {
		if (pega.util.Event.isIE) {
			if (objButton) {
				if (objButton.style) {
					if (strBusyText) {
						if (objButton.getAttribute("PEGA_VERSION") == "HTMLPROPERTY") {
							var buttonTable = this.findParentTable(objButton);
							var objParent = buttonTable.parentNode;
							if (objParent) {
								objParent.removeChild(buttonTable);
								objParent.innerHTML = "<table border='0' cellspacing='0' cellpadding='0' style='width: 100%; text-align: center;'><tr><td nowrap><span class='buttonTextWorking'>" + strBusyText + "</span><span class='buttonIconWorking'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr></table>";
							}
						} else {
							objButton.innerHTML = "<span class='buttonTextWorking'>" + strBusyText + "</span><span class='buttonIconWorking'></span>";
						}
					}
					if(objButton.tagName == "BUTTON" || (objButton.tagName == "INPUT" && objButton.type == "button"))
						objButton.disabled = true;
				}
			}
		} else {
			if (objButton) {
				if (objButton.style) {
					if (strBusyText) {
						if (objButton.getAttribute("PEGA_VERSION") == "HTMLPROPERTY") {
							var buttonTable = this.findParentTable(objButton);
							buttonTable.style.display = "none";
							var objParent = buttonTable.parentNode;
							if (objParent) {
								var buttonTextTable = document.createElement("Table");
								buttonTextTable.border = 0;
								// 05/30/2011 GUJAS1 - BUG-37434 Fix Start
								if (pega.util.Event.isSafari) {
									buttonTextTable.style.display = "-webkit-inline-box";
								} else {
									buttonTextTable.style.display = "-moz-inline-box";
								}
								// 05/30/2011 GUJAS1 - BUG-37434 Fix End
								buttonTextTable.innerHTML = "<tr><td nowrap><span class='buttonTextWorking'>" + strBusyText + "</span><span class='buttonIconWorking'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>";
								objParent.appendChild(buttonTextTable);
							}
						} else {
							objButton.innerHTML = "<span class='buttonTextWorking'>" + strBusyText + "</span><span class='buttonIconWorking'></span>";
						}

					}
				}
			}
		}

	},

	setBusyState : function (objButton, strBusyText, docElement, event, fromIframe) {
		event = (event == undefined) ? window.event : event;
		if (pega.mobile && pega.mobile.sdk && pega.mobile.sdk.ui) {
		  pega.mobile.sdk.ui._isDocInBusyState = true;
		}    
		if (!docElement)
			docElement = pega.u.d.getDocumentElement();
		/* modified to diasble all button when busy BUG-58107  */
		if(pega.u.d.isAccessible){
			//In accessibility mode call makebutton busy first as jaws reads the button as unavailable.
			if (event) {
				pega.u.d.makeButtonBusy(objButton, strBusyText);
			}
			this.disableAllOtherButtons(null, docElement);
		}
		else{
			this.disableAllOtherButtons(null, docElement);
			if (event) {
				var srcButton = pega.util.Event.getTarget(event);
				window.setTimeout(function () {
					pega.u.d.makeButtonBusy(objButton, strBusyText);
				}, 0);
			}
		}		

		/*else {
		this.disableAllOtherButtons(null, docElement)
		}*/
		window.setTimeout("pega.u.d.setBusyStyle()", 10);
		if (!fromIframe && window.name == "actionIFrame") {
			this.setBusyState(objButton, null, parent.document, event, true);
		}
	},

	setBusyStyle : function () {
		try {
			this.addClass(document.body, "busyBody");

			/* CPM specific notification */
			if (pega.u.d.cpm) {
				sendEvent("pega_ui_busyIndicator", {
					"EventType" : "Busy"
				});
			}
		} catch (ex) {}
	},

	resetBusyState : function () {
		if (pega.mobile && pega.mobile.sdk && pega.mobile.sdk.ui) {
		  pega.mobile.sdk.ui._isDocInBusyState = false;
		}    
		this.enableAllButtons(document);
		this.removeClass(document.body, "busyBody");
		if (window.name == "actionIFrame") {
			var docElement = parent.document;
			this.enableAllButtons(docElement);
			this.removeClass(docElement.body, "busyBody");
		}
		/*  CPM specific notification */

		if (pega.u.d.cpm) {
			sendEvent("pega_ui_busyIndicator", {
				"EventType" : "NotBusy"
			});
		}

	}

};
pega.lang.augmentObject(pega.ui.Doc.prototype, busyI);
busyI = null;
//static-content-hash-trigger-GCC
var tabSupport = {
  tabsLen: new Array(),
  tabViewIndex: 0,
  modalTabElementsWidth: 0,
  modalTabContentWidth: 0,
  showTargetTab: false, //BUG-35894
  TAB_ELE_WIDTH_ADJUSTMENT: 100,

  //HFix-20746 - memory leak fix
  /*removeDeadTabviewFromMap: function(){
    return; //to unblock
    for (var i=0; i<pega.u.d.tabViewIndex; i++ ){
      var tview = document.getElementById('PEGA_TABBED'+i);
      if(!tview){
        pega.u.d.tabViewMap['PEGA_TABBED'+i] = null;
      }
    }
  },*/
  /*
     @Privtae - initializes all the tab layouts present in the page
     @param
     @return $void$
     */
  initializeTabs: function() {
    var tabsList = pega.util.Dom.getElementsById("PEGA_TABBED");
    if (tabsList == null)
      return;
    if (tabsList != null) {
      var leftUnitDiv = document.getElementById("PEGA_LU_L");
      if (leftUnitDiv && !pega.util.Event.isIE) {
        var tabLeft = pega.util.Dom.getElementsById("PEGA_TABBED", leftUnitDiv, "DIV");
        if (tabLeft && tabLeft.length > 0) {
          tabLeft = tabLeft[0];
          var tabContDiv = tabLeft.getElementsByClassName("tabContent", "DIV") ? tabLeft.getElementsByClassName("tabContent", "DIV")[0] : null;
          if (tabContDiv) {
            tabContDiv.style.width = tabContDiv.scrollWidth + "px";
          }
        }
      }
      var tabsListLen = tabsList.length;
      for (var i = 0; i < tabsListLen; i++, pega.u.d.tabViewIndex++) {
        var fixedDCTabs = pega.util.Dom.hasClass(tabsList[i], "with-fixed-header");
        if (fixedDCTabs) {
          pega.util.Dom.addClass(document.body, "with-fixed-header");
        }
        pega.u.d.tabsLen.push(pega.u.d.tabViewIndex);
        tabsList[i].id = "PEGA_TABBED" + pega.u.d.tabViewIndex;
        if (!pega.u.d.tabViewMap) {
          pega.u.d.tabViewMap = {};
        }
        if (!pega.u.d.modalTabViewMap) {
          pega.u.d.modalTabViewMap = {};
        }
        var tabIndexWithError;
        //We do not need to mark errors for DC tabs
        if (!fixedDCTabs) {
          tabIndexWithError = pega.u.d.markSectionTabErrors(tabsList[i]);
        }else{
          tabIndexWithError = "-1";
        }

        var tabView = new pega.ui.TabView(tabsList[i]);
        pega.u.d.setTabsContentAndContainerID(tabView, tabsList[i].getAttribute("defaultTab"));
        pega.u.d.tabViewMap["PEGA_TABBED" + pega.u.d.tabViewIndex] = tabView;
        //pega.u.d.removeDeadTabviewFromMap(); //HFix-20746 mem leak fix
        var defaultIndex = tabsList[i].getAttribute("defaultTab");
        /*trimming possible spaces in older browsers*/
        if (!String.prototype.trim) {
          String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
          }
        }
        defaultIndex = defaultIndex.trim(); //trim spaces in the response value
        var myActiveIndex = tabsList[i].getAttribute("activeWhenTab");
        if (myActiveIndex && myActiveIndex != "") {
          defaultIndex = myActiveIndex;
        }
        if (pega.u.d.bModalDialogOpen) {
          pega.u.d.modalTabViewMap["PEGA_TABBED" + pega.u.d.tabViewIndex] = tabView;
        }
        var index = 0;
        if (tabIndexWithError == "-1") {
          var tabHeaders;
          if (fixedDCTabs) {
            tabHeaders = $(".dc-header ul.tab-ul li");
          } else{
            tabHeaders = tabsList[i].getElementsByTagName("li");
          }
          //For scroll tabs correction. Scrollers are inside ol so discount them from entire headers list
          var tabElements = [];
          for (var j = 0; j < tabHeaders.length; j++) {
            if (tabHeaders[j].parentNode.tagName.toLowerCase() != "ol") {
              tabElements.push(tabHeaders[j]);
            }
          }
          if (pega.u.d.bModalDialogOpen) {
            pega.u.d.modalTabElementsWidth = pega.u.d.TAB_ELE_WIDTH_ADJUSTMENT;
          }
          var bSetIndex = true;
          for (var j = 0; j < tabElements.length; j++) {
            var ele = tabElements[j];
            if (ele.id == "Tab" + defaultIndex && bSetIndex) {
              index = j;
              bSetIndex = false;
            }
            if (pega.u.d.bModalDialogOpen && ele.id.indexOf("Tab") >= 0) { /*This varible is used while resizing the modal dialog */
              var tabElementWidth = parseInt(tabElements[j].scrollWidth);
              if (tabElementWidth == 0) {
                tabElementWidth = pega.u.d.TAB_ELE_WIDTH_ADJUSTMENT;
              }
              pega.u.d.modalTabElementsWidth += tabElementWidth;
            }
          }
        } else {
          index = tabIndexWithError;
        }
        //Last element should be disabled. It represents the right border and does not have a content div
        var tabsArr = tabView.get("tabs");
        if(tabsArr.length > 0) { // BUG-146344 - Check for the tab array length before processing further
          //Label updation for static & static nested tabs case. JAINB1
          var label = "";
          for (var k = 0; k < tabsArr.length; k++) {
            var curTabEle = tabsArr[k].get("element");
            /* BUG-514780 svg */
            var headIconElement = curTabEle.querySelector("img");
            if(headIconElement)
              pega.u.d.setSVGIcon(tabsArr,k,headIconElement);
            /* BUG-514780 svg */
            label = tabView.getTabLabelIconAndTooltip(curTabEle).label;
            if (label)
              tabsArr[k].label = label;
            //HFix-20746 perf fix
            var isDCTabAttribute = curTabEle.getAttribute("isADynamicContainer");
            if(isDCTabAttribute == "true"){
              tabView.isDCTabView = true;
            }

            if (isDCTabAttribute != "true" && curTabEle.id != "") {
              pega.util.Event.addListener(curTabEle, "keydown", pega.u.d.tabAccessibilityHandler);
              pega.util.Event.addListener(curTabEle, "keyup", pega.u.d.tabAccessibilityHandler);
            }

            /*BUG-158695: In case of rotated tabs in ie8 and ie9 as we use filters, only LIs are rotated, the anchors are not, so when you hit 'tab' key while on tab header, it tries to focus on the tab close icon which is not on the view area*/
            if(pega.env.ua.ie && pega.env.ua.ie < 10 && $(tabsList[i]).hasClass('rotatedTabs') && ($(curTabEle).parent('ul').attr('class').indexOf('-r') > -1 || $(curTabEle).parent('ul').attr('class').indexOf('-l') > -1)) {
              $(curTabEle).parent('ul').scroll(function() {
                this.scrollLeft = 0;
              });
            }
          }
          pega.u.d.setAriaAttributes(tabView, false);
          var lastTab = tabsArr[tabsArr.length - 1];
          var lastTabElement = lastTab.get("element");

          // BUG-71379 05/22/2012 GUJAS1 Rightborder Tab needs to be disabled in all browsers.
          //if(pega.util.Dom.hasClass(lastTabElement, "rightborder") && !pega.util.Event.isIE) {
          if (pega.util.Dom.hasClass(lastTabElement, "rightborder")) {
            //BUG- removing call to fixLastTab, becuase it adds an inline height which causes misalignment
            //pega.u.d.fixLastTab(lastTabElement, tabsList[i]); /* Sets the style properties of the last dummy tab element */
            // BUG-70936 05/18/2012 GUJAS1 Moved right border tab disabling code in this condition.
            lastTab.set('disabled', true);
            // BUG-71379 05/22/2012 GUJAS1 Set the disabled last tab cursor as "default"
            lastTabElement.style.cursor = "default";
          }

          // BUG-70936 05/18/2012 GUJAS1 Moved right border tab disabling code in the above condition.
          // Keeping the logic below is incorrect since #1. Only right border tab needs disabling &
          // #2. The below condition doesn't account for custom format tabs.
          /*
                     if(!pega.util.Dom.hasClass(tabsList[i], "verticalTabs") && !pega.util.Dom.hasClass(tabsList[i], "stretchedTabs") && !pega.util.Dom.hasClass(tabsList[i], "subTabbed-b") && !pega.util.Dom.hasClass(tabsList[i], "headerTabbed-b")) {
                     lastTab.set('disabled', true); 
                     }
                     */

          var argtmp = {
            tabGrpDiv: tabsList[i],
            tabGrp: tabView,
            secType: "tabbed"
          };
          if (pega.u.d.harnessInit) {
            argtmp.focusElement = pega.u.d.initFocusOnFirstInput;
          }
          //HFix-20746
          tabView.setHarnessHeaderIconsHeightWidth(); //this call needs knowledge of whether or not it is DC TabView
          tabView.on('activeTabChange', pega.u.d.setActiveTabIndex, argtmp);
          tabView.on('activeTabChange', pega.u.d.fixTabs, argtmp);
          tabView.on('activeTabChange', pega.u.d.onActivate);
          tabView.on('tabRemoved', pega.u.d.tabRemoved);
          tabView.on('tabAdded', pega.u.d.tabAdded);
          //tabView.set('activeIndex', index);
          try {
            tabView.set('activeIndex', index);
          } catch (E) {
            tabView.set('activeIndex', 0);
          }
        }
      }
      var scrollTopValue = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;  
      var hasErrors = document.getElementById("PegaRULESErrorFlag");    
      if(!hasErrors){
        window.scrollTo(0,scrollTopValue);
      }
      if (pega.u.d.fixTabsClosure)
        pega.u.d.fixTabsClosure = null;
      pega.u.d.fixTabsClosure = function() {
        for (var tabid in pega.u.d.tabViewMap) {
          var tabgrp = pega.u.d.tabViewMap[tabid];
          pega.u.d.fixTabs(null, {
            tabGrpDiv: tabgrp.get('element'),
            tabGrp: tabgrp,
            secType: "tabbed"
          });
        }
      };
      pega.u.d.registerResize(pega.u.d.fixTabsClosure);
    }
  },

  /*
     @Handler
     @protected Get all the tab groups and load the default
     @return $void$
     */
  initTabs: function() {
    if (pega.util.Dom.hasClass(document.body, "forPrinting"))
      return;
    var tabgrouplist = pega.util.Dom.getElementsById('TabGroup', document);
    if (tabgrouplist != null) {
      var tabgrouplistLength = tabgrouplist.length;
      for (var i = 0; i < tabgrouplistLength; i++) {
        pega.u.d.drawTab(tabgrouplist[i].getAttribute("defaultTab"), tabgrouplist[i]);
        var tabHeaderTable = pega.util.Dom.getElementsById("tabTable", tabgrouplist[i]);
        if(tabHeaderTable) {
          tabHeaderTable = tabHeaderTable[0];
          pega.util.Event.addListener(tabHeaderTable, "keydown", pega.u.d.harnessTabAccessibilityHandler);
          pega.util.Event.addListener(tabHeaderTable, "keyup", pega.u.d.harnessTabAccessibilityHandler);
        }
      }
    }
  },


  tabRemoved: function(e) {
    var tabs = e.tabs,
        tabCount = tabs.length,
        firstTab = (tabCount > 0) ? tabs[0] : null,
        firstTabElement = firstTab ? firstTab.get("element") : null;
    if (tabCount == 1 && firstTabElement && pega.util.Dom.hasClass(firstTabElement, "rightborder")) {
      firstTabElement.style.visibility = "hidden";
    }
  },
  /*
     Handles ALT+DEL , CTRL+PageUp, CTRL+PageDown events. TC-89606, TC-89608
     */
  tabContentAccessibilityHandler: function(ev) {
    var AccessKeyMap = pega.ui.accessibility.AccessKeyMap;
    var tabObj = arguments[1], tabPos = "Top",
        liElement = tabObj.get("element");
    var pegaTabbedDiv = liElement.parentElement;
    while (pegaTabbedDiv && pegaTabbedDiv.id.indexOf("PEGA_TABBED") < 0) {
      pegaTabbedDiv = pegaTabbedDiv.parentElement;
    }
    if (pegaTabbedDiv != null) {
      tabPos = pegaTabbedDiv.getAttribute("data-pos");
    }
    if (tabPos == "" && $("body").hasClass("screen-layout-body")) {
      pegaTabbedDiv = $(".dc-main").children().eq(0)[0];
      if (pegaTabbedDiv && pegaTabbedDiv.id.indexOf("PEGA_TABBED") >= 0) {
        tabPos = pegaTabbedDiv.getAttribute("data-pos");
      }
    }
    //BUG-159964 : Added modifier2 (ctrlKey) and check that tab should be closed only if ALT+DEL is pressed but not CTRL+ALT+DEL.
    switch (ev.type) {
      case 'keyup':
        if (ev[AccessKeyMap.CLOSE_TAB.modifier1] 
            && !ev[AccessKeyMap.CLOSE_TAB.modifier2]
            && AccessKeyMap.CLOSE_TAB.keyCode == ev.keyCode
            && tabObj.attribs && tabObj.attribs.close == 'yes') {
          pega.u.d.doClose.call(pega.u.d, arguments[0]);
        } else if (ev[AccessKeyMap.PREVIOUS_TAB_CONTENT.modifier1] && AccessKeyMap.PREVIOUS_TAB_CONTENT.keyCode == ev.keyCode) { 
          pega.util.Event.preventDefault(ev); // For handling in FF and Chrome.
          pega.util.Event.stopPropagation(ev);
          var prevLiElement = $(liElement).prev();

          if (prevLiElement.length != 0) {
            prevLiElement[0].focus();
            prevLiElement[0].click();
          } else if (prevLiElement.length == 0) {
            if (tabPos == "Top") {
              $(liElement).parent().children().eq(-2)[0].click();
            } else {
              $(liElement).parent().children().eq(-1)[0].click();
            }
          }
        } else if (ev[AccessKeyMap.NEXT_TAB_CONTENT.modifier1] && AccessKeyMap.NEXT_TAB_CONTENT.keyCode == ev.keyCode) {
          pega.util.Event.preventDefault(ev); // For handling in FF and Chrome.
          pega.util.Event.stopPropagation(ev);
          var nextLiElement = $(liElement).next();

          if (nextLiElement.length > 0 && nextLiElement[0].id != "") {
            nextLiElement[0].focus();
            nextLiElement[0].click();
          } else {
            var firstLi = $(liElement).parent().children().eq(0)[0];
            firstLi.focus();
            firstLi.click();
          }
        }
        break;
    }
  },

  /*
     This API will register keyup event on document's body Tag to handle keyboard accessibility.
     */
  registerTabContentAccessibilityHandler: function(viewHost) {
    pega.util.Event.addListener(document.body, "keyup", pega.u.d.tabContentAccessibilityHandler, viewHost);
  },

  /*
     Handles keyup and keyDown on left, right, up, down arrow keys. TC-49857, TC-49859, TC-49860, TC-49862, TC-50580, TC-50581, TC-50582, TC-50583, TC-50584, TC-50585, TC-50588, TC-50589
     */
  tabAccessibilityHandler: function(ev) {
    var AccessKeyMap = pega.ui.accessibility.AccessKeyMap;
    var targetSrc = pega.util.Event.getTarget(ev),
        tabPos = "",
        isStretched = false;

    while (targetSrc != null && targetSrc.tagName != "LI") {
      targetSrc = targetSrc.parentElement;
    }

    if (!targetSrc) return;
    var pegaTabbedDiv = targetSrc.parentElement;

    while (pegaTabbedDiv && pegaTabbedDiv.id.indexOf("PEGA_TABBED") < 0) {
      pegaTabbedDiv = pegaTabbedDiv.parentElement;
    }
    if (pegaTabbedDiv != null) {
      tabPos = pegaTabbedDiv.getAttribute("data-pos");
      /*BUG-148506 - isStretched is used to active last tab. 
                If tabs are stretched then rightBorderDisabled div won't be present.*/
      isStretched = pegaTabbedDiv.className.indexOf("stretchedTabs") > 0;
    }
    if (tabPos == "" && $("body").hasClass("screen-layout-body")) {
      pegaTabbedDiv = $(".dc-main").children().eq(0)[0];
      if (pegaTabbedDiv && pegaTabbedDiv.id.indexOf("PEGA_TABBED") >= 0) {
        tabPos = pegaTabbedDiv.getAttribute("data-pos");
      }
    }

    //TC-89624

    var getSelectedCSSClass = function(cssClass) {
      var activeCSSClass;
      if (cssClass) {
        if (cssClass.match('tab-li-t-ns-selected'))
          activeCSSClass = 'tab-li-t-ns-selected';
        else if (cssClass.match('tab-li-b-ns-selected'))
          activeCSSClass = 'tab-li-b-ns-selected';
        else if (cssClass.match('tab-li-l-ns-v-selected'))
          activeCSSClass = 'tab-li-l-ns-v-selected';
        else if (cssClass.match('tab-li-l-ns-h-selected'))
          activeCSSClass = 'tab-li-l-ns-h-selected';
        else if (cssClass.match('tab-li-r-ns-v-selected'))
          activeCSSClass = 'tab-li-r-ns-v-selected';
        else if (cssClass.match('tab-li-r-ns-h-selected'))
          activeCSSClass = 'tab-li-r-ns-h-selected';
      }
      return activeCSSClass;
    };

    switch (ev.type) {
      case 'keydown':
        if (AccessKeyMap.PREVIOUS_TAB_HORIZONTAL.keyCode == ev.keyCode ||
            AccessKeyMap.PREVIOUS_TAB_VERTICAL.keyCode == ev.keyCode) { 
          var activeCssClass = getSelectedCSSClass(targetSrc.className);
          $(targetSrc).removeClass('selected ' + activeCssClass);
          var preTabheader = targetSrc.previousSibling || targetSrc.previousElementSibling;
          if (preTabheader != null) {
            $(preTabheader).addClass('  selected ' + activeCssClass + ' ').focus();
          } else {
            if (tabPos == "Top" && !isStretched) {
              $(targetSrc).parent().children().eq(-2).addClass(' selected ' + activeCssClass + ' ').focus();
            } else {
              $(targetSrc).parent().children().eq(-1).addClass(' selected ' + activeCssClass + ' ').focus();
            }
          }
          pega.util.Event.stopPropagation(ev);
          pega.util.Event.preventDefault(ev); 
        } else if (AccessKeyMap.NEXT_TAB_HORIZONTAL.keyCode == ev.keyCode ||
                   AccessKeyMap.NEXT_TAB_VERTICAL.keyCode == ev.keyCode) { 
          var activeCssClass = getSelectedCSSClass(targetSrc.className);
          $(targetSrc).removeClass('selected ' + activeCssClass);
          var nextTabheader = targetSrc.nextSibling || targetSrc.nextElementSibling;
          if (nextTabheader != null && nextTabheader.id != "") {
            $(nextTabheader).addClass(' selected ' + activeCssClass + ' ').focus();
          } else {
            $(targetSrc).parent().children().eq(0).addClass(' selected ' + activeCssClass + ' ').focus();
          }
          pega.util.Event.stopPropagation(ev);
          pega.util.Event.preventDefault(ev);
        }else if (AccessKeyMap.CLOSE_TAB_BY_ACTIONKEY.keyCode == ev.keyCode) {
          var srcElement = pega.util.Event.getTarget(ev);
          if (srcElement.className == "iconCloseSmall") {
            pega.util.Event.stopPropagation(ev);
            pega.util.Event.preventDefault(ev);  
          }
          pega.util.Event.stopPropagation(ev);
          pega.util.Event.preventDefault(ev); 
        } 
        else if (AccessKeyMap.DELETE.keyCode == ev.keyCode || AccessKeyMap.CLOSE_TAB.keyCode == ev.keyCode) {
          var srcElement = pega.util.Event.getTarget(ev);
          if (srcElement.className == "iconCloseSmall" && srcElement.click) { 
              srcElement.click();
          } else {
              $(srcElement).find(".iconCloseSmall").trigger('click');
          }
            
          pega.util.Event.stopPropagation(ev);
          pega.util.Event.preventDefault(ev);  
        }
        break;
      case 'keyup':
        if (AccessKeyMap.PREVIOUS_TAB_HORIZONTAL.keyCode == ev.keyCode ||
            AccessKeyMap.PREVIOUS_TAB_VERTICAL.keyCode == ev.keyCode ||
            AccessKeyMap.NEXT_TAB_HORIZONTAL.keyCode == ev.keyCode ||
            AccessKeyMap.NEXT_TAB_VERTICAL.keyCode == ev.keyCode || AccessKeyMap.SPACE.keyCode == ev.keyCode ){
			/*When spacebar is pressed on the JAWS 'Select a form field' dialog, triggering a click so as to activate the tab*/
          pega.util.Event.stopPropagation(ev);
          pega.util.Event.preventDefault(ev);
          targetSrc.click();  
        }

        else if (AccessKeyMap.CLOSE_TAB_BY_ACTIONKEY.keyCode == ev.keyCode) {
          var srcElement = pega.util.Event.getTarget(ev);
          if (srcElement.className == "iconCloseSmall" && srcElement.click) {                        
            srcElement.click();
            pega.util.Event.stopPropagation(ev);
            pega.util.Event.preventDefault(ev);  
          }
        }
        break;
    }
  },

  onActivate: function(ev) {
    if (ev.prevValue == ev.newValue) {
      var skipActivationSync = true;
      if(ev.newValue && ev.newValue.activationSyncRequired){
        skipActivationSync = false;
        delete ev.newValue.activationSyncRequired;
      }
      if(skipActivationSync){
        return;
      }
    }
    var docDirty = "false",
        dirtyTab = null;

    /*

//Turning off this block of code in setTimeout as this has a side effect of BUG-135388

        //following timeout function to focus the activated tab header element
        window.setTimeout(function() {
            try {
                ev.newValue.get('element').focus();
            } catch (e) {}
        }, 0);

*/

    if (pega.web && pega.web.api && ev.prevValue) {
      var docObj = pega.web.api.doAction(ev.prevValue.GadgetName, "getUIDoc");
      if (docObj) {
        docDirty = docObj.isFormDirty(false);
      }
      dirtyTab = {
        prevContentID: ev.prevValue.elementName,
        prevRecordkey: ev.prevValue.key,
        prevFormDirty: docDirty
      };

    }
    if (ev.newValue && ev.newValue.skipNextActivationSync) {
      delete ev.newValue.skipNextActivationSync;
      return;
    }
    if (!ev.newValue.tabGroupName && !ev.newValue.docGroupName && !ev.newValue.elementName && !ev.newValue.removedTabName && !ev.newValue.removedTabsTabGroup && !ev.newValue.removedDocumentName && !ev.newValue.removedDocumentsDocumentGroup) {
      return;
    }
    if (ev.newValue) {
      if (ev.newValue.tabview && ev.newValue.tabview.isDCTabView == false) {
        return;
      }
      var isDocumentKey = "false";
      if (pega.web && pega.web.api && ev.prevValue) {
        var docObj = pega.web.api.doAction(ev.newValue.GadgetName, "getUIDoc");
        if (docObj && ev.newValue.key == docObj.documentKey) {
          isDocumentKey = "true";
        }
      }

      var curTab = {
        "dynamicContainerID": ev.newValue.tabGroupName || ev.newValue.docGroupName,
        //"contentID" : ev.newValue.elementName,
        "tabIndex": ev.newValue.tabview.getTabIndex(ev.newValue) + 1,
        //"pyStreamName" : ev.newValue.pyStreamName,
        //"threadID" : ev.newValue.ThreadId,
        //"primaryHarnessPageName" : ev.newValue.primaryHarnessPageName,       
        "label": ev.newValue.label,
        "key": ev.newValue.key,
        "iconPath": ev.newValue.iconPath,
        "isDocumentKey": isDocumentKey,
        "recentAction": ev.prevValue.recentAction
      };
      if (!curTab.dynamicContainerID && (ev.newValue.docGroupName || ev.newValue.tabGroupName)) {
        curTab.dynamicContainerID = ev.newValue.docGroupName || ev.newValue.tabGroupName;
      }
      //TASK-134746 Adding threadID, className ,primaryHarnessPageName, StreamName, Label to curTab - JAINB1.
      if (ev.newValue.actionDef && ev.newValue.actionDef != "undefined") {
        if (ev.newValue.actionDef.className && ev.newValue.actionDef.className != "undefined")
          curTab.className = ev.newValue.actionDef.className;
      }

      var removedTab = {//"contentID" : ev.newValue.removedTabName , 
        "dynamicContainerID": ev.newValue.removedTabsTabGroup || ev.newValue.removedDocumentsDocumentGroup,
        "tabIndex": ev.newValue.removedTabIndex || ev.newValue.removedDocumentIndex
      };

      ev.newValue.removedTabName = ev.newValue.removedTabsTabGroup = ev.newValue.removedTabIndex = ev.newValue.removedDocumentName = ev.newValue.removedDocumentIndex = ev.newValue.removedDocumentsDocumentGroup = null;
      docObj = docObj || pega.u.d;
      docObj.sendReqToUpdateElementModal(curTab, "ACTIVE", removedTab, dirtyTab, ev,"true");
    }
  },
  setSVGIcon : function(tabsArr, currIndex, headIconElement){
    var iconPath = headIconElement.src;
      if(iconPath.slice(-4) === ".svg") {
        tabsArr[currIndex].svgPath = iconPath;
        var xhr = new XMLHttpRequest;
        xhr.open('get',iconPath,true);
        xhr.onreadystatechange = function(){
          if (xhr.readyState !== 4) return;
          var svg = xhr.responseXML.documentElement;
          svg = document.importNode(svg,true);
          svg.style.display = "inline";
          //svg.style..marginRight = "3" + PX;
          svg.style.verticalAlign = "middle";
          headIconElement.parentNode.appendChild(svg);
          headIconElement.parentNode.removeChild(headIconElement);
      }
      xhr.send();
    }
  },
  /*
     setting ARIA attributes n tab li and content Element's. TC-50587, TC-53222, TC-53227, TC-53228, TC-53229, TC-53230, TC-53231
     */
  setAriaAttributes: function (tabViewObj, isAccordion){
    if(isAccordion && !tabViewObj._isSectionAccordion) return;
    var closeSpanEl, anchorEl;
    var tabsArr = tabViewObj.get("tabs");
    var tabsArrayLength = tabsArr.length;
    for (var tabIndex=0; tabIndex<tabsArrayLength;tabIndex++){
      var tabObj = tabsArr[tabIndex];
      var liElement = tabObj.get('element'),
          contentEle = tabObj.get('contentEl');
      //contentEle.setAttribute("aria-labelledby", liElement.getAttribute("id"));
      var strId = liElement.getAttribute("id");
      if(strId){
         contentEle.setAttribute("aria-labelledby", strId);
      }
      contentEle.setAttribute("role","tabpanel");

      if(!pega.u.d.isAccessible){
        //add class to remove focus outline
        pega.util.Dom.addClass(contentEle, "tabpanelnofocus");
      }

      if(isAccordion) {
        anchorEl = liElement.getElementsByTagName("a")[0];
        anchorEl.setAttribute("aria-selected","false");
        anchorEl.setAttribute("aria-expanded","false");
        contentEle.setAttribute("tabIndex","0");
      } else {
        liElement.setAttribute("aria-selected","false");
        liElement.setAttribute("tabIndex","-1");    
        var iframeEle = contentEle.getElementsByTagName("IFRAME");
        if(iframeEle.length){
          iframeEle[0].setAttribute("tabIndex","-1");
        } else {
          contentEle.setAttribute("tabIndex","-1");
        }
        closeSpanEl = pega.util.Dom.getElementsByClassName("iconCloseSmall", 'span', liElement);
        if (closeSpanEl.length != 0) {
          closeSpanEl[0].setAttribute("tabindex", "-1")
        }
      }
      contentEle.setAttribute("aria-hidden","true");
    }
    tabObj = tabViewObj.get("activeTab");
    if(tabObj) {
      liElement = tabObj.get('element'),
        contentEle = tabObj.get('contentEl');
      if(isAccordion) {
        anchorEl = liElement.getElementsByTagName("a")[0];
        anchorEl.setAttribute("aria-expanded","true");
        anchorEl.setAttribute("aria-selected","true");
        anchorEl.setAttribute("tabIndex","0");    
      } else {
        liElement.setAttribute("aria-selected","true");
        closeSpanEl = pega.util.Dom.getElementsByClassName("iconCloseSmall", 'span', liElement);
        if (closeSpanEl.length != 0) {
          closeSpanEl[0].setAttribute("tabindex", "0")
        }
        liElement.setAttribute("tabIndex","0");    
      }
      iframeEle = contentEle.getElementsByTagName("IFRAME");
      if(iframeEle.length){
        iframeEle[0].setAttribute("tabIndex","0");
      } else {
        contentEle.setAttribute("tabIndex","0");
      }
      contentEle.setAttribute("aria-hidden","false");
      
      // ADDED BELOW CODE FOR BUG-357104/SE-41911
      var lastTab = tabsArr[tabsArr.length - 1];
      var lastTabElement = lastTab.get("element");
      if (pega.util.Dom.hasClass(lastTabElement, "rightborder")) {
        lastTabElement.removeAttribute('aria-selected');
      }
    }
  },
  getNextOperableLi: function(direction, liElement) {
    var LEFT = -1, RIGHT = 1;
    var getLastSibling = function(elementObj) {
      var nextSibling = null;
      if (elementObj) {
        nextSibling = elementObj.nextElementSibling || elementObj.nextSibling;
      }
      while (nextSibling) {
        if (nextSibling.id == '') {
          break;
        }
        elementObj = nextSibling;
        nextSibling = elementObj.nextElementSibling || elementObj.nextSibling;
      }

      /*
            while (elementObj && (elementObj.nextElementSibling || elementObj.nextSibling)) {
                elementObj = elementObj.nextElementSibling || elementObj.nextSibling;
            }
       if (elementObj.id == '') {
          elementObj = elementObj.previousElementSibling || elementObj.previousSibling;
            }
            */

      return elementObj;
    };

    var getFirstSibling = function(elementObj) {
      while (elementObj && (elementObj.previousElementSibling || elementObj.previousSibling)) {
        elementObj = elementObj.previousElementSibling || elementObj.previousSibling;
      }
      return elementObj;
    };
    var nextLi = null;
    switch (direction) {
      case LEFT:
        nextLi = liElement.previousElementSibling || liElement.previousSibling;
        if (!nextLi) { //cyecl to right end
          nextLi = getLastSibling(liElement);
        }
        break;
      case RIGHT:
        nextLi = liElement.nextElementSibling || liElement.nextSibling;
        if (!nextLi || (nextLi && nextLi.id == '')) { //cycle to left end
          nextLi = getFirstSibling(liElement);
        }
        break;
    }
    return nextLi;
  },
  
  fireCapturedDCModelUpdate: function(){
    var desktopWind = pega.desktop.support.getDesktopWindow();
    if(desktopWind && desktopWind.pega.u.d.isDCModelCapturing && desktopWind.pega.u.d.capturedDCDataModal && desktopWind.pega.u.d.capturedDCDataModal.length > 0){
      var lastActiveTabChangeEvent = desktopWind.pega.u.d.lastActiveTabChangeEvent;
      var triggerFromCurrentWindow = true;
      if(lastActiveTabChangeEvent && pega.web && pega.web.api){            
        var tabDOCObj = pega.web.api.doAction(lastActiveTabChangeEvent.newValue.GadgetName, "getUIDoc");
        if(tabDOCObj){
          triggerFromCurrentWindow = false;
          tabDOCObj.fireCapturedDCModelUpdate();																	
        }  
      }
      if(triggerFromCurrentWindow){
        var strUrlSF = new SafeURL("@baseclass.pzUpdateCapturedDCModel");
        strUrlSF.put("CapturedModel", JSON.stringify(desktopWind.pega.u.d.capturedDCDataModal));
        strUrlSF.put("pzKeepPageMessages", "true");
        pega.u.d.asyncRequest('POST', strUrlSF, null, null);
        delete desktopWind.pega.u.d.capturedDCDataModal;
      }
      delete desktopWind.pega.u.d.isDCModelCapturing;
      delete desktopWind.pega.u.d.lastActiveTabChangeEvent;
    }
  },

  enableDCModelCapturing: function(){
    var desktopWind = pega.desktop.support.getDesktopWindow();
    if(desktopWind){
      desktopWind.pega.u.d.isDCModelCapturing = true;  
    }       
  },

  sendReqToUpdateElementModal: function(curTab, elementAction, removedTab, dirtyTab,ev,DCTabSwitch) {
    //set to root document context in DC tab switch case.
    if(DCTabSwitch){
      pega.ctxmgr.setRootDocumentContext();
    }
    var strUrlSF = new SafeURL("@baseclass.pzUpdateClipboardModels");
    var harCtxMgr = pega.ui.HarnessContextMgr;
    strUrlSF.put("elementAction", elementAction);
    if (removedTab && (removedTab.contentID || removedTab.tabIndex) && removedTab.dynamicContainerID) {
      strUrlSF.put("elementAction", "CLOSE");
    }
    if (pega.ui.hasAjaxContainer && !DCTabSwitch && curTab.mdcTarget!==undefined) {
      var state = pega.redux.Utils.getAjaxContainerState(curTab.mdcTarget);
      var activeDocs = state.activeDocs;
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
      if (elementAction == "CLOSE") {
        if(curTab.isMDC){
           strUrlSF.put("isMDC",curTab.isMDC);
           strUrlSF.put("mdcTarget", curTab.mdcTarget);
        }
        if(state.docToClose){
          strUrlSF.put("tabIndex", state.docToClose.tabIndex);
        }
        strUrlSF.put("newTabIndex", tabIndex + 1);
      } else {
        strUrlSF.put("tabIndex", tabIndex + 1);
      }
      if(state.activeDocs.length > 0){
        strUrlSF.put("mdcRecordId", curTab.mdcTarget+"_"+lastActiveIndex);
        // when max doc limit has reached we should not use mdcDoc to get the relvant document.
        // strUrlSF.put("mdcRecordId", state.mdcDocs[state.mdcDocs.length - 1].recordId);
      }
      
      if(curTab.action === "openSection") {
          strUrlSF.put("action", "openSection");
      }
      
      if(elementAction == "CLOSE" && curTab.action === "openSection") {
        strUrlSF.put("mdcRecordId", curTab.mdcRecordId);
        strUrlSF.put("mdcTarget", curTab.mdcTarget);
      }
      
      if(elementAction == "ACTIVE" && curTab.action === "openSection"){   
        strUrlSF.put("mdcRecordId", curTab.mdcTarget+"_"+lastActiveIndex);
        strUrlSF.put("mdcTarget", curTab.mdcTarget);
      }

      var parentThreadName = curTab.parentThreadName || pega.u.MDCUtil.getParentThreadName();
      if(parentThreadName) {
        strUrlSF.put("parentThreadName", parentThreadName);
      }
    }
    var sendReqInPortalThread = (pega.ctx.isAssociateReqThread && !pega.ctx.isMDC && !curTab.isMDC);
    if (sendReqInPortalThread) {
      strUrlSF.put("pxReqURI", pega.u.d.getPortalReqURI());
    } else {
      strUrlSF.put("pxReqURI", pega.ctx.pxReqURI);
    }
    if (dirtyTab) {
      if (dirtyTab.prevContentID)
        strUrlSF.put("prevContentID", dirtyTab.prevContentID);
      if (dirtyTab.prevRecordkey)
        strUrlSF.put("prevRecordkey", dirtyTab.prevRecordkey);
      if (dirtyTab.prevFormDirty)
        strUrlSF.put("prevFormDirty", dirtyTab.prevFormDirty);
      else
        strUrlSF.put("prevFormDirty", "false");
    }

    //TASK-134746 Adding threadID, className ,primaryHarnessPageName, StreamName, Label to strUrlSF safeUrl for ACTIVE and CLOSE Action - JAINB1.
    if (strUrlSF.get("elementAction") == "ACTIVE" || strUrlSF.get("elementAction") == "OPEN") {
      if (curTab.key) {
        strUrlSF.put("key", curTab.key);
      }
      if (curTab.isMDC) {
        strUrlSF.put("isMDC", curTab.isMDC);
        strUrlSF.put("mdcTarget", curTab.mdcTarget);
      }
      if (curTab.dynamicContainerID)
        strUrlSF.put("dynamicContainerID", curTab.dynamicContainerID);
      if (curTab.contentID)
        strUrlSF.put("contentID", curTab.contentID);
      if (curTab.tabIndex)
        strUrlSF.put("tabIndex", curTab.tabIndex);
      if (curTab.threadID >= 0)
        strUrlSF.put("threadID", curTab.threadID);
      if (curTab.className)
        strUrlSF.put("className", curTab.className);
      if (curTab.primaryHarnessPageName)
        strUrlSF.put("pzPrimaryHarnessPageName", curTab.primaryHarnessPageName);
      if (curTab.pyStreamName)
        strUrlSF.put("pyStreamName", curTab.pyStreamName);
      if (curTab.label)
        strUrlSF.put("label", curTab.label);
      if (curTab.iconPath)
        strUrlSF.put("iconPath", curTab.iconPath);
      if (curTab.parameters)
        strUrlSF.put("parameters", JSON.stringify(curTab.parameters));
      if (curTab.isDocumentKey)
        strUrlSF.put("isDocumentKey", curTab.isDocumentKey);
    }
    if (strUrlSF.get("elementAction") == "CLOSE") {
      if (curTab.dynamicContainerID)
        strUrlSF.put("dynamicContainerID", curTab.dynamicContainerID);
      if (curTab.isDocumentKey)
        strUrlSF.put("isDocumentKey", curTab.isDocumentKey);
      if (curTab.key)
        strUrlSF.put("key", curTab.key);
      if (curTab.contentID)
        strUrlSF.put("newContentID", curTab.contentID);
      if (curTab.tabIndex)
        strUrlSF.put("newTabIndex", curTab.tabIndex);
      //strUrlSF.put("dynamicContainerID",removedTab.dynamicContainerID);

      if (curTab.threadID >= 0)
        strUrlSF.put("threadID", curTab.threadID);
      if (curTab.className)
        strUrlSF.put("className", curTab.className);
      if (curTab.primaryHarnessPageName)
        strUrlSF.put("pzPrimaryHarnessPageName", curTab.primaryHarnessPageName);
      if (curTab.pyStreamName)
        strUrlSF.put("pyStreamName", curTab.pyStreamName);
      if (curTab.label)
        strUrlSF.put("label", curTab.label);
      if (curTab.iconPath)
        strUrlSF.put("iconPath", curTab.iconPath);

      if (removedTab) {
        if (removedTab.contentID)
          strUrlSF.put("contentID", removedTab.contentID);
        if (removedTab.tabIndex)
          strUrlSF.put("tabIndex", removedTab.tabIndex);
        if (removedTab.key)
          strUrlSF.put("closedTabKey", removedTab.key);
        if (removedTab.isActiveHost != undefined)
          strUrlSF.put("isActiveHost", removedTab.isActiveHost);
      }

      strUrlSF.put("prevFormDirty", "false");
    }
    var portalName = pega.ui.HarnessContextMgr.get("portalName");
    if (portalName && portalName != "") {
      strUrlSF.put("portalName", portalName);
    }
    strUrlSF.put("pzKeepPageMessages", "true");
    
    /* Porting of HFix-40449 */
    var desktopWind = pega.desktop.support.getDesktopWindow();
    if(desktopWind && desktopWind.pega.u.d.isDCModelCapturing === true){
      desktopWind.pega.u.d.capturedDCDataModal = desktopWind.pega.u.d.capturedDCDataModal || new desktopWind.Array();
      delete strUrlSF.hashtable.pyActivity;
      desktopWind.pega.u.d.capturedDCDataModal.push(JSON.parse(JSON.stringify(strUrlSF.hashtable)));
      desktopWind.pega.u.d.lastActiveTabChangeEvent = ev;
      return;
    }
    
    try {
      var response = null;
      if(removedTab && removedTab.fromClosingDocumentAfterF5 && pega.util.Event.isIE > 0){
        //console.log("using jquery");
        response = $.ajax({
          type: "POST",
          url: strUrlSF.toURL(),
          async: false
        });
        return;
      }
      // check this ??
      if (!desktopWind) {
        desktopWind = window;
      }
      var callbackObj = {
        success: function(){
          pega.u.d.evaluateClientConditions('TCL');
        }
      };
      if (sendReqInPortalThread) {
        if(curTab.recentAction == "ClearAllRecentItems"){
          // TODO: Check if we can remove bAsync flag here.
          response = desktopWind.pega.u.d.asyncRequest('POST', strUrlSF, callbackObj, null, {"bAsync":false}); 
        }
        else{
          response = desktopWind.pega.u.d.asyncRequest('POST', strUrlSF, callbackObj, null); 
        }
      } else {
        if(curTab.recentAction == "ClearAllRecentItems"){
          // TODO: Check if we can remove bAsync flag here.
          response = pega.u.d.asyncRequest('POST', strUrlSF, callbackObj, null, {"bAsync":false}); 
        }
        else{
          if(pega.ctx.isMDC){
            pega.ctx.activeCSRFToken = harCtxMgr.getRootDocumentContext().activeCSRFToken;
          }
          response = pega.u.d.asyncRequest('POST', strUrlSF, callbackObj, null); 
        }
      }
    } catch (e) {
      alert("Error while updating the Data Modal.");
    }
  },

  tabAdded: function(e) {
    var tabs = e.tabs,
        tabCount = tabs.length,
        secondTab = (tabCount > 1) ? tabs[1] : null,
        secondTabElement = secondTab ? secondTab.get("element") : null;
    if (tabCount == 2 && secondTabElement && pega.util.Dom.hasClass(secondTabElement, "rightborder")) {
      secondTabElement.style.visibility = "visible";
    }
  },

  fixLastTab: function(lastTabElement, tabsContainer) {
    var firstTabElement = lastTabElement.parentNode.childNodes[0];

    /* Check if there is at least one tab */
    if (firstTabElement) {
      var firstTabContent = firstTabElement.childNodes[0];
      var anchorBorderTopWidth = parseFloat(pega.util.Dom.getStyle(firstTabContent, "borderTopWidth"));
      var anchorBorderBottomWidth = parseFloat(pega.util.Dom.getStyle(firstTabContent, "borderBottomWidth"));
      var lastTabBorderBottomWidth = parseFloat(pega.util.Dom.getStyle(lastTabElement, "borderBottomWidth"));

      var height = firstTabContent && firstTabContent.clientHeight > 0 ? firstTabContent.clientHeight + anchorBorderTopWidth + anchorBorderBottomWidth - lastTabBorderBottomWidth : null;

      if (height) {
        lastTabElement.style.height = height + "px";
      }
    }

    lastTabElement.style.paddingTop = "0px";

    /* Set the margin-top of tabContent div to 0px in case of Firefox and Chrome */
    if (!pega.util.Event.isIE) {
      var tabContentDiv = tabsContainer.getElementsByClassName("tabContent", "DIV") ? tabsContainer.getElementsByClassName("tabContent", "DIV")[0] : null;
      if (tabContentDiv) {
        tabContentDiv.style.marginTop = "0px";
      }
    }
  },
  setTabsContentAndContainerID: function(tabview, defaultTabIndex) {
    if (tabview) {
      var tabs = tabview.get('tabs');
      var tabCount = tabs.length;
      for (var index = 0; index < tabCount; index++) {
        var tab = tabs[index];
        if (tab) {
          if (defaultTabIndex == (index + 1)) {
            tab.skipNextActivationSync = true;
          }
          var tabElement = tab.get('element');
          tab.elementName = tabElement.getAttribute("elementName");
          tab.docGroupName = tabElement.getAttribute("tabGroupName");
          tab.tabGroupName = tabElement.getAttribute("tabGroupName");
        }
      }
    }
  },

  fixTabs: function(ev, args) {
    var hasClass = pega.util.Dom.hasClass;

    if (args && args.secType == "tabbed") {
      var tabsArr = args.tabGrp.get("tabs");
      var lastTab = tabsArr[tabsArr.length - 1];
      var lastTabElement = lastTab.get("element");
      if (hasClass(args.tabGrpDiv, "stretchedTabs")) {
        if (args.tabGrpDiv.offsetHeight > 0) {
          pega.u.d.fixStretch(lastTabElement.parentNode, hasClass(args.tabGrpDiv, "verticalTabs"), hasClass(args.tabGrpDiv, "rotatedTabs"));
        }
      }
      if (hasClass(lastTabElement, "tab-li-l-s-v") || hasClass(lastTabElement, "tab-li-l-ns-v")) {
        if (args.tabGrpDiv.offsetHeight > 0) {
          pega.u.d.fixRotate(lastTabElement.parentNode, "LEFT", hasClass(args.tabGrpDiv, "stretchedTabs"));
        }
      } else if (hasClass(lastTabElement, "tab-li-r-s-v") || hasClass(lastTabElement, "tab-li-r-ns-v")) {
        if (args.tabGrpDiv.offsetHeight > 0) {
          pega.u.d.fixRotate(lastTabElement.parentNode, "RIGHT", hasClass(args.tabGrpDiv, "stretchedTabs"));
        }
      } else if (!hasClass(args.tabGrpDiv, "verticalTabs") && (hasClass(args.tabGrpDiv, "stretchedTabs") /*|| hasClass(args.tabGrpDiv, "subTabbed-b")*/)) {
        /* BUG-73733 : Don't resize ul or li at run time to fit tab icon */
        if (args.tabGrpDiv.offsetHeight > 0) {
          pega.u.d.fixHeights(lastTabElement.parentNode);
        }
      }
      if (pega.u.d.inStandardsMode) {
        var cssResize = pega.util.Dom.hasClass(args.tabGrpDiv, "with-fixed-header");
        if (hasClass(args.tabGrpDiv, "verticalTabs") && !cssResize && args.tabGrpDiv.parentNode && args.tabGrpDiv.parentNode.id!="workarea") {/*BUG-140874 : !workarea*/
          if (args.tabGrpDiv.offsetHeight > 0) {
            var tableContainer = pega.util.Dom.getFirstChild(args.tabGrpDiv);
            tableContainer.style.height = ""; /*BUG-165205: Resizing on tab switch in case of vertical tabs*/
            pega.util.Dom.setStyle(tableContainer, "height", tableContainer.scrollHeight + "px");
          }
        }
      }
    }
  },

  fixTabsWidth: function(theLi) {
    var hasClass = pega.util.Dom.hasClass;
    var ulElem = theLi.parentNode;
    var currentParent = theLi.parentNode;

    while (currentParent.nodeName.toUpperCase() != "DIV") {
      currentParent = currentParent.parentNode;
    }

    var divElem = currentParent;

    if (hasClass(divElem, "rotatedTabs")) {
      var lists = pega.util.Dom.getChildren(ulElem);
      var listsLen = lists ? lists.length : 0;

      for (var i = 0; i < listsLen; i++) {
        var currLi = lists[i];
        var anchoreElement = pega.util.Dom.getFirstChild(currLi);
        var spanElement = pega.util.Dom.getFirstChild(anchoreElement);
        var innerSpanElement = pega.util.Dom.getFirstChild(spanElement);
        var labelElement = pega.util.Dom.getFirstChild(innerSpanElement);

        labelElement.style.width = 'auto';
        innerSpanElement.style.width = 'auto';
        spanElement.style.width = 'auto';
        anchoreElement.style.width = 'auto';
        currLi.style.width = 'auto';
      }

      var direction = "LEFT";
      if (hasClass(theLi, "tab-li-r-s-v") || hasClass(theLi, "tab-li-r-ns-v")) {
        direction = "RIGHT"
      }

      pega.u.d.fixRotate(ulElem, direction, hasClass(divElem, "stretchedTabs"));
    }
  },



  fixHeights: function(theUL) {
    var lists = pega.util.Dom.getChildren(theUL);
    var listsLen = lists ? lists.length : 0;
    var maxHeight = 0;
    var heightChanged = false;
    for (var i = 0; i < listsLen; i++) {
      var currLi = lists[i];
      var liOH = currLi.offsetHeight;
      if (maxHeight < liOH) {
        if (maxHeight != 0) {
          heightChanged = true;
        }
        maxHeight = liOH;
      }
    }
    if (heightChanged) {
      for (var i = 0; i < listsLen; i++) {
        var currLi = lists[i];
        pega.util.Dom.getFirstChild(currLi).style.height = maxHeight + "px";
        //pega.util.Dom.getFirstChild(pega.util.Dom.getFirstChild(currLi)).style.height = maxHeight + "px";
      }
    }
  },

  get_distribution: function(N, Range) {
    var dis_arr = [];
    var width = Math.floor(Range / N),
        i;
    for (i = 0; i < N; i++) {
      dis_arr[i] = width;
    }
    var diff_arr_length = dis_arr.length;
    var diff = Range - width * N;
    var orignal_diff = diff;
    if (diff != 0) {
      var j = 0;
      for (i = 0; i < diff_arr_length / 2 && diff > 0; i++) {
        dis_arr[j]++;
        j = j + 2;
        diff--;
      }
      if (orignal_diff > N / 2) {
        for (i = 1; i < diff_arr_length && diff > 0; i += 2, diff--) {
          dis_arr[i]++;
        }
      }
    }
    return dis_arr;
  },

  fixStretch: function(theUL, isLR, isRotated) {
    if (!isLR) { /*straight forward case of top and bottom*/
      var lists = pega.util.Dom.getChildren(theUL);
      var listsLen = lists ? lists.length : 0;
      var dis_arr = pega.u.d.get_distribution(listsLen, 100),
          i;
      // BUG-76815 07/18/2012 GUJAS1 For IE in Standards mode, need to set width for the last tab as well
      //Also not puting width on last tab solves mismatch b/w right border of last tab and tab container
      var setLen = pega.u.d.inStandardsMode ? listsLen : (pega.env.ua.ie ? listsLen - 1 : listsLen); // fix: tabs wrapping in IE

      for (i = 0; i < setLen; i++) {
        lists[i].style.width = dis_arr[i] + "%";
      }
    } else { /*Side tabs*/
      if (!isRotated) {
        var lists = pega.util.Dom.getChildren(theUL);
        var listsLen = lists ? lists.length : 0;
        var dis_arr = pega.u.d.get_distribution(listsLen, 100),
            i;
        for (i = 0; i < listsLen; i++) {
          lists[i].style.height = dis_arr[i] + "%";
        }
      } else {
        var hasDeferTabs = false;
        if (theUL.getAttribute("hasDeferTabs") == "true") {
          hasDeferTabs = true;
        }
        if (hasDeferTabs) /*if rotated and deferred, do nothing*/
          return;
        else { /*if its just rotated*/
          theUL.style.display = "none";
          var parHeight = theUL.parentNode.offsetHeight;
          var lists = pega.util.Dom.getChildren(theUL);
          var listsLen = lists ? lists.length : 0;
          var dis_arr = pega.u.d.get_distribution(listsLen, parHeight),
              i;
          for (i = 0; i < listsLen; i++) {
            lists[i].style.width = dis_arr[i] + "px";
          }
          theUL.style.height = parHeight + "px";
          theUL.style.display = "block";
        }
      }
    }
  },

  fixRotate: function(theUL, direction, isStretched) {
    var lists = pega.util.Dom.getChildren(theUL);
    var listsLen = lists ? lists.length : 0;
    var maxWidth = 0;
    var maxHeight = 0;
    var totalWidth = 0;
    var totalHeight = 0;
    var uneven = false;
    if (lists && listsLen > 0) {
      if (pega.env.ua.ie && (!pega.u.d.inStandardsMode || pega.env.ua.ie < 8)) {
        for (var i = 0; i < listsLen; i++) {
          var currLi = lists[i];

          var anchorEle = pega.util.Dom.getFirstChild(currLi),
              spanEle = pega.util.Dom.getFirstChild(anchorEle);

          pega.u.d.fixTransparentBG(anchorEle);
          pega.u.d.fixTransparentBG(spanEle);

          var liOW = currLi.offsetWidth;
          var liOH = currLi.offsetHeight;
          if (!isStretched && currLi.widthSet != true) {
            currLi.style.width = liOH + "px";
            currLi.widthSet = true;
          }
          if (maxWidth < liOW) {
            if (maxWidth != 0) {
              uneven = true;
            }
            maxWidth = liOW;
          }
          if (maxHeight < liOH) {
            maxHeight = liOH;
          }
          totalWidth += liOW;
          totalHeight += liOH;
        }
      } else {
        for (var i = 0; i < listsLen; i++) {
          var currLi = lists[i];

          if (pega.env.ua.ie) {
            var anchorEle = pega.util.Dom.getFirstChild(currLi),
                spanEle = pega.util.Dom.getFirstChild(anchorEle);

            pega.u.d.fixTransparentBG(anchorEle);
            pega.u.d.fixTransparentBG(spanEle);
          }
          /*BUG-196715 - tab background color becomes black in ie9 specifically*/
          if(pega.env.ua.ie && pega.env.ua.ie == 9){
            var anchorEle = pega.util.Dom.getFirstChild(currLi);
            /*BUG-205209 : added check for transparent background*/
            var cmptBGColor = window.getComputedStyle(anchorEle,null).backgroundColor;
            if(cmptBGColor && cmptBGColor == 'transparent'){
              anchorEle.style.backgroundColor = pega.u.d.getcomputedBGColor(anchorEle);
            }
            /*BUG-205209 : fix ends*/
          }
          /*BUG-196715 - fix ends*/

          var liOW = currLi.offsetWidth;
          var liOH = currLi.offsetHeight;
          if (maxWidth < liOW) {
            if (maxWidth != 0 && pega.env.ua.ie) {
              uneven = true;
            }
            maxWidth = liOW;
          }
          if (maxHeight < liOH) {
            if (maxHeight != 0 && !pega.env.ua.ie) {
              uneven = true;
            }
            maxHeight = liOH;
          }
        }

        if (direction == "LEFT") {
          if (pega.env.ua.ie && pega.env.ua.ie < 10) {
            for (var i = 0; i < listsLen; i++) {
              var currLi = lists[i];
              var liOW = currLi.offsetWidth;
              var liOH = currLi.offsetHeight;
              currLi.style.top = totalHeight + "px";
              totalWidth += liOW;
              totalHeight += liOH;
            }
          } else {
            for (var i = listsLen - 1; i >= 0; i--) {
              var currLi = lists[i];
              var liOW = currLi.offsetWidth;
              var liOH = currLi.offsetHeight;
              currLi.style.bottom = (totalWidth - maxHeight) + "px";
              totalWidth += liOW;
              totalHeight += liOH;
            }
          }
        } else {
          for (var i = 0; i < listsLen; i++) {
            var currLi = lists[i];
            var liOW = currLi.offsetWidth;
            var liOH = currLi.offsetHeight;
            if (pega.env.ua.ie && pega.env.ua.ie < 10) {
              currLi.style.top = totalHeight + "px";
            } else {
              currLi.style.top = totalWidth + "px";
            }
            totalWidth += liOW;
            totalHeight += liOH;
          }
        }
      }
      /*
             if(uneven) {
             for(var i=listsLen-1; i>=0; i--) {
             var currLi = lists[i];
             if(pega.env.ua.ie && (!pega.u.d.inStandardsMode || pega.env.ua.ie < 8)) {
             // BUG-73733 : Don't resize li height at run time to fit tab icon 
             //pega.util.Dom.getFirstChild(currLi).style.height = maxWidth + "px";
             } else {
             if(pega.env.ua.ie) {
             pega.util.Dom.getFirstChild(currLi).style.height = maxWidth + "px";
             } else {
             pega.util.Dom.getFirstChild(currLi).style.height = maxHeight + "px";
             }
             }
             }
             }
             */

      if (pega.env.ua.ie && (!pega.u.d.inStandardsMode || pega.env.ua.ie <= 8)) {
        /* BUG-73733 : Don't resize ul width at run time to fit tab icon */
        //theUL.style.width = maxWidth + "px";
        theUL.style.height = totalHeight + "px";
      } else {
        /* BUG-73733 : Don't resize ul height at run time to fit tab icon */
        theUL.style.width = ((pega.env.ua.ie && pega.env.ua.ie <= 9) ? maxWidth : maxHeight) + "px";
        theUL.style.height = ((pega.env.ua.ie && pega.env.ua.ie <= 9) ? totalHeight : totalWidth) + "px";
      }
    }
  },

  getFileExtension: function(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
  },


  fixTransparentBG: function(ele) {
    var fileExt = pega.u.d.getFileExtension(pega.util.Dom.getStyle(ele, "background-image")).substring(0, 3);

    if (fileExt && fileExt.toLowerCase() == "png") {
      ele.style.backgroundColor = pega.u.d.getcomputedBGColor(ele);
    }
  },

  getcomputedBGColor: function(ele) {
    var computedBG = "transparent";
    if (ele) {
      while (computedBG == undefined || computedBG.toLowerCase() == "transparent" || trim(computedBG.toLowerCase()) == "") {
        computedBG = pega.util.Dom.getStyle(ele, "background-color");
        if (ele.nodeName.toLowerCase() == "body") {
          break;
        }
        ele = ele.parentNode;
      }
    }
    if (computedBG == undefined || computedBG.toLowerCase() == "transparent" || trim(computedBG.toLowerCase()) == "") {
      computedBG = "#ffffff";
    }
    return computedBG;
  },

  /*
     @Privtae - internally invoked everytime when harness size changes
     @param $Object$ Object representing the new and old tabs
     @param $Object$  args consiting of the div enclosing the tabview and reference to the tabview object.
     */
  setActiveTabIndex: function(ev, args) {
    /* Start for Benchmark Timer */
    if (typeof bRecordEvent != "undefined" && bRecordEvent) {
      if (event && event.type == "click") {
        pega.u.d.Timer.setUserStart();
      }
    }
    /* End for Benchmark Timer */
    // flag busy to perf mon
    pega.ui.statetracking.setBusy("setActiveTabIndex");	// would be nice to pick up timeStamp from original UI event

    if (!pega.util.Event.isIE) {
      //Remove hrefs for anchor tags for selected tab in  Firefox. It is causing issue when we click on header elements
      var anchorId = "TABANCHOR";
      if (args.secType == 'accordion') {
        anchorId = "ACCORANCHOR"

      }
      var newAnchor = pega.util.Dom.getElementsById(anchorId, ev.newValue.get("element"));
      if (newAnchor != null) {
        // BUG-304838 : saving active element and calling focus on it.
        var currentActiveElem = document.activeElement;
        newAnchor[0].removeAttribute("href");
        currentActiveElem.focus();
      }
      if (ev.prevValue) {
        var oldAnchor = pega.util.Dom.getElementsById(anchorId, ev.prevValue.get("element"));
        if (oldAnchor != null)
          oldAnchor[0].setAttribute("href", "#" + ev.prevValue.get("id"));
      }
    }

    var activeTabIndex = parseInt(args.tabGrp.getTabIndex(ev.newValue));
    var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + args.tabGrpDiv.getAttribute("tabGroupId"), args.tabGrpDiv);
    var tabId = ev.newValue.get("id");
    //tab id's are "Tab"+index
    var index = tabId.substring(3);
    if (tabInd != null)
      tabInd[0].value = index;
    //var tabHeaders = args.tabGrpDiv.getElementsByTagName("li");
    var activeHeaderLi = ev.newValue.get("element");
    var sectionId = activeHeaderLi.getAttribute("sectionBodyId");
    if (sectionId && sectionId != "") {
      var expandIndicator = pega.util.Dom.getElementsByName("EXPANDED" + sectionId, args.tabGrpDiv);
      if (expandIndicator != null)
        expandIndicator[0].value = "true";
    }
    if (typeof (tabClickCallback) != "undefined") {
      tabClickCallback(ev);
    }
    
    /*For CS: Publishing onTabSwitch event*/
    if(ev.newValue.ThreadName){
       try{
            var iframeEle = document.querySelector("div[pegathread='"+ev.newValue.ThreadName+"'] iframe");
         if (iframeEle.contentWindow.pega) {
           iframeEle.contentWindow.pega.ui.EventsEmitter.publishSync("onTabSwitch");
         }
          }catch(e){}
    }
    
    if (activeHeaderLi.getAttribute("refreshOnClick") == "true" && ev.prevValue && ev.prevValue.get("id") != ev.newValue.get("id")) {
      var argVars = {
        tab: ev.newValue,
        tabGrpDiv: args.tabGrpDiv,
        tabLi: activeHeaderLi,
        secType: args.secType
      }
      pega.u.d.loadTabContents(argVars);
    }/*BUG-292611 - No need to have another condition seperate . Instead moving that to else if */
    else if (activeHeaderLi.getAttribute("isLoadDeferred") == "true") {
      var argVars = {
        tab: ev.newValue,
        tabGrpDiv: args.tabGrpDiv,
        tabLi: activeHeaderLi,
        secType: args.secType
      }
      pega.u.d.loadTabContents(argVars);
      activeHeaderLi.setAttribute("isLoadDeferred", false);
    }
    // BUG-76028 : Equating ev.newValue and ev.prevValue. This solves the problem when selected element is click in modal dialog.
    if (pega.u.d.bModalDialogOpen && pega.u.d.useOldModalDialog && ev.prevValue && ev.newValue.get('element') != ev.prevValue.get('element')) {
      var modaldialogbd = document.getElementById("modaldialog_bd");
      var modaldialog = document.getElementById("modaldialog");
      if (modaldialogbd && modaldialog) {
        //BUG-106811 Commenting out resetting width and setting height to auto.
        //modaldialogbd.style.width="";
        modaldialogbd.style.height = "auto";
        modaldialogbd.style.overflow = "";
        //modaldialog.style.width="";
        modaldialog.style.height = "";
        pega.u.d.modalTabContentWidth = ev.newValue.get("contentEl").scrollWidth;
      }
    }
    //Finally resize the harness
    //perf fix - do resize only when the tab is not a DC tab.
    if (args.secType == 'tabbed') { /*BUG-106505*/
      if (pega.u.d.harnessInit) {
        pega.u.d.HeavyOperations.registerOnceOnInit("resizeHarness");
      } else {
        //HFix-20746
        if(!args.tabGrp.isDCTabView){
          pega.u.d.resizeHarness(); //If the tab is being activated and it is not harness init, we still need to do a resize, but only in the case of section tabs
        }
      }
    }

    if (args.focusElement) {
      pega.u.d.focusCount = pega.u.d.focusCount - 1;
      if (pega.u.d.focusCount == 0) {
        args.focusElement.call();
      }
    }
    /*BUG-142611: IE11 Harnes tabs are not rendering when placed in Screen Layouts */ 
    if ($("body").hasClass("screen-layout-body") && args.secType == 'tabbed') {
      var tabPos = args.tabGrpDiv.getAttribute("data-pos");
      if (pega.util.Event.isIE==11 && (tabPos == "Left" || tabPos == "Right")) {          
        var dcMainDiv = $(".dc-main");
        if(dcMainDiv && dcMainDiv[0]) {
          dcMainDiv = dcMainDiv[0];
          /*trigger browser reflow only incase of harness tabs.*/
          var tabDtlsContainer = $(args.tabGrpDiv).find("[pegagadget]");
          var toggleZoom = false;
          for(var i=0; i<tabDtlsContainer.length; i++) {
            if(tabDtlsContainer[i].style.display=="block") {
              toggleZoom = true;
              break;
            }
          }
          if(toggleZoom) {
            (dcMainDiv.style.zoom=="")?dcMainDiv.style.zoom=1:dcMainDiv.style.zoom="";
          }
        }
      }
    }
    pega.u.d.setAriaAttributes(args.tabGrp, (args.secType == 'accordion'));

    pega.ui.statetracking.setDone();
  },

  /*
     @Privtae - called to defer load a tabs contents
     @param $Object$  args consiting of the div enclosing the tabview and reference to the tabview object.
     */
  loadTabContents: function(args) {
    var harCtxMgr = pega.ui.HarnessContextMgr;
    var newTabAnim = args.tab;
    var reloadElement = args.tabGrpDiv;
    var readOnly = this.getReadOnlyValue("", args.tabLi);
    var strUrlSF;
    var sectionBodyId = '';
    if (args.tabLi.getAttribute("isHarness") == "true") {
      strUrlSF = new SafeURL("Rule-HTML-Harness.GetContainerHTML");
      strUrlSF.put("pzPrimaryPageName", strPrimaryPage);
      strUrlSF.put("ClassName", strHarnessClass);
      strUrlSF.put("StreamName", strHarnessPurpose);
      strUrlSF.put("ReadOnly", readOnly);
      sectionBodyId = args.tabLi.getAttribute("sectionBodyId");
      strUrlSF.put("RenderSingle", "EXPANDED" + sectionBodyId);
      strUrlSF.put("PrimaryPage", strPrimaryPage);
    } else {
      while ((reloadElement.id != "RULE_KEY") || (reloadElement.getAttribute("node_type") != "MAIN_RULE")) {
        reloadElement = reloadElement.parentNode;
        if (reloadElement == null) {
          break;
        }
      }
      strUrlSF = SafeURL_createFromURL(pega.u.d.url);
      strUrlSF.put("pyActivity", "ReloadSection");
      strUrlSF.put("StreamName", reloadElement.getAttribute("node_name"));
      //US-145110 Tab Group templatization 
      if( args.secType === "tabbed" && pega.ctx.isUITemplatized ) {
		strUrlSF.put("UITemplatingStatus", "Y");
	  }
      sectionBodyId = args.tabLi.getAttribute("sectionBodyId");
      if (!sectionBodyId || sectionBodyId == "")
        sectionBodyId = args.tabGrpDiv.getAttribute("sectionBodyId");

      strUrlSF.put("RenderSingle", "EXPANDED" + sectionBodyId);
      var tabbedRepeatId = args.tabLi.getAttribute("TabbedRepeatId");
      if (tabbedRepeatId && tabbedRepeatId != "") {
        strUrlSF.put("RenderSingleTR", tabbedRepeatId);
        var expandRL = reloadElement.getAttribute("expandRL");
        if (expandRL) {
          strUrlSF.put("expandRL", expandRL);
        }
        var index = reloadElement.getAttribute("INDEX");
        if (index)
          strUrlSF.put("index", index);

      }
      strUrlSF.put("StreamClass", reloadElement.getAttribute("objclass"));
      strUrlSF.put("ReadOnly", readOnly);
      var baseRef = this.getBaseRef(reloadElement);
      strUrlSF.put("BaseReference", baseRef);
      if (typeof (bClientValidation) != 'undefined') {
        strUrlSF.put("bClientValidation", bClientValidation);
      }
      strUrlSF.put("FieldError", harCtxMgr.get("fieldErrorType"));
      strUrlSF.put("FormError", harCtxMgr.get("formErrorType"));
      strUrlSF.put("pyCustomError", harCtxMgr.get("pyCustomError"));
      if (args.tabLi.getAttribute("isLoadDeferred") == "true" && pega.ctx.KeepPageMessages == "true") {
        strUrlSF.put("pzKeepPageMessages", "true");
      }
    }
    var innerDivId = sectionBodyId;
    if (tabbedRepeatId && tabbedRepeatId != "")
      innerDivId = tabbedRepeatId;
    var innerDiv = pega.util.Dom.getElementsById("INNERDIV-" + innerDivId, args.tabGrpDiv);
    /*BUG-77379 Doctype: Tab border issue on Refresh when active - removing height auto for standards mode height fix */
    /* innerDiv[0].style.height = "50px"; */
    if (args.secType == "accordion") {
      this.setBusyIndicator(args.tabGrpDiv);
    } else {
      this.setBusyIndicator(innerDiv[0]);
    }

    var callbackArgs = new Array(innerDiv[0], innerDivId);

    var callback = {
      success: function(responseObj) {
        var newStream = responseObj.responseText;
        var expandInnerDiv = responseObj.argument[0];
        var paramName = responseObj.argument[1];

        if (pega.u.d.checkExceptions(newStream, expandInnerDiv)) {
          pega.u.d.gBusyInd.hide();
          return;
        }
        var newElement = document.createElement("DIV");
        var newDiv = expandInnerDiv.cloneNode(true);
        newElement.appendChild(newDiv);
        var theNode = pega.util.Dom.getElementsById("INNERDIV-" + paramName, newElement);
        if (theNode) {
          theNode[0].innerHTML = newStream;
          theNode = theNode[0];
        }
        var newInnerDiv = pega.util.Dom.getElementsById("INNERDIV-" + paramName, theNode);
        if(!newInnerDiv) newInnerDiv = pega.util.Dom.getElementsById("INNERDIV-" + paramName); //BUG-184519
        if (newInnerDiv) newInnerDiv = newInnerDiv[0];
        newStream = newInnerDiv.innerHTML;
        var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", theNode);
        var paramsObj = {
          onlyOnceEle: onlyOnceEle,
          domObj: expandInnerDiv,
          newHTML: newStream
        };
        pega.u.d.handleDOMLoad(paramsObj);
        /*BUG-23226 Accordion height was being set to 50px which is not working in non IE browsers.
                 This value is not set by default for the accordion content.So resetting it to auto here.
                 The same issue was also seen in Tabs. */
        /*BUG-77379 Doctype: Tab border issue on Refresh when active - removing height auto for standards mode height fix */
        if (!pega.u.d.inStandardsMode) {
          expandInnerDiv.style.height = "auto";
        }
        if (this.harnessType && this.harnessType == "layout") {
          this.portal.layoutObj.resize();
        }
        if (newTabAnim.anim && args.secType == "accordion") {
          newTabAnim.anim.stop(true);
          var newTabHideContent = function() {
            if (newTabAnim.AnimHeight != 0) {
              this.get('contentEl').style.overflow = "auto";
            } else {
              this.get('contentEl').style.overflow = "visible";
            }
            this.anim.onComplete.unsubscribe(newTabHideContent);
          }
          var elemToHt = pega.u.d.getHeight(expandInnerDiv);
          var oldFromHt = newTabAnim.anim.attributes.height.to;
          newTabAnim.anim.onComplete.subscribe(newTabHideContent, newTabAnim, newTabAnim);
          if (newTabAnim.AnimHeight == 0) {
            newTabAnim.anim.attributes.height = {
              from: oldFromHt,
              to: elemToHt
            };
          } else {
            newTabAnim.anim.attributes.height = {
              from: oldFromHt,
              to: newTabAnim.AnimHeight
            };
          }
          newTabAnim.get('contentEl').style.overflow = "hidden";
          newTabAnim.anim.animate();
        }
        pega.u.d.gBusyInd.hide();
      },
      failure: function(oResponse) {
        //handle an unsuccessful request
        pega.u.d.gBusyInd.hide();

      },
      argument: callbackArgs
    }
    var request = this.asyncRequest('POST', strUrlSF, callback);
  },

  /*
     @protected This function Mark Tab errors is used to show an indicator on the tabs if the tabs contain any errors.
     and will not allow the form to get submitted.Added a for loop to find all the Tabgroups and loop all the tab groups
     @return $void$
     */
  markTabErrors: function() {
    var tabGroupObjs = pega.util.Dom.getElementsById("TabGroup", document);
    if (tabGroupObjs != null) {
      var tabGroupObjsLength = tabGroupObjs.length;
      var getElementsByIdRef = pega.util.Dom.getElementsById;
      for (var i = 0; i < tabGroupObjsLength; i++) {
        var tabgroup = tabGroupObjs[i];
        if (tabgroup != null) {
          var tabGroupDiv = getElementsByIdRef("tabContainer", tabgroup);
          if (tabGroupDiv == null) return;
          if (tabGroupDiv)
            tabGroupDiv = tabGroupDiv[0];
          var tabContentDiv = getElementsByIdRef("tabContents", tabgroup);
          if (tabContentDiv == null) return;
          if (tabContentDiv) {
            tabContentDiv = tabContentDiv[0];
            var child = tabContentDiv.childNodes;
            var childLen = child.length;
            for (var j = 0, k = 0; j < childLen; j++) {
              var thisChild = child[j];
              if (thisChild.nodeType == 1) {
                /* BUG-176298: Get the exact tab sequence id instead of following sequential logic which ignores hidden tabs */
                k = thisChild.id.replace("Content", ""); 
                var errorFlag = getElementsByIdRef("PegaRULESErrorFlag", thisChild);
              }
              if (errorFlag) {
                var idx = k;
                var spanObj = tabGroupDiv.getElementsByTagName("span");
                var spanObjLength = spanObj.length;
                for (var m = 0; m < spanObjLength; m++) {
                  var thisSpanObj = spanObj[m];
                  if (thisSpanObj.getAttribute('index') == idx) {
                    if (pega.util.Dom.getPreviousSibling(thisSpanObj)) {
                      var imgExists = getElementsByIdRef("PegaRULESErrorFlag", pega.util.Dom.getPreviousSibling(thisSpanObj));
                    } else {
                      var imgExists = false;
                    }
                    if (!imgExists) {
                      var newSpanObj = document.createElement("div");
                      var tabErrorToolTip = tabGroupDiv ? tabGroupDiv.getAttribute("data-taberror") : pega.u.d.fieldValuesList.get("TabErrorTooltip");
                      newSpanObj.style.display = "block";
                      newSpanObj.className = "iconErrorTabsDiv";
                      newSpanObj.innerHTML = "<span class='iconErrorTabs' title='"+tabErrorToolTip+"' id='PegaRULESErrorFlag'/>";
                      var parentDiv = thisSpanObj.parentNode;
                      parentDiv.insertBefore(newSpanObj, thisSpanObj);
                      m++;
                      spanObjLength++;
                    } else {
                      imgExists[0].parentNode.style.display = "block";
                    }
                  }
                }
              } else {
                idx = k;
                spanObj = tabGroupDiv.getElementsByTagName("span");
                var spanObjLength = spanObj.length;
                for (var m = 0; m < spanObjLength; m++) {
                  var thisSpanObj = spanObj[m];
                  if (thisSpanObj.getAttribute('index') == idx) {
                    if (pega.util.Dom.getPreviousSibling(thisSpanObj)) {
                      var imgExists = getElementsByIdRef("PegaRULESErrorFlag", pega.util.Dom.getPreviousSibling(thisSpanObj));
                    } else {
                      var imgExists = false;
                    }
                    if (imgExists) {
                      imgExists[0].parentNode.style.display = "none"
                    }
                  }
                }
              }
            }
          }
        }
      }
    } /*Updated error marker display and hide mechanism for BUG-37652 - banea1*/
    this.markAccordionErrors();
    //this.markSectionTabErrors();
  },

  markSectionTabErrors: function(tabDiv) {
    var tabErrorToolTip = tabDiv ? tabDiv.getAttribute("data-taberror") : pega.u.d.fieldValuesList.get("TabErrorTooltip");
    /*var length =  pega.u.d.tabsLen.length;
         for (var ind=0; ind < length; ind++)
         {*/
    /*var currentTabGroup =  document.getElementById("PEGA_TABBED"+pega.u.d.tabsLen[ind]);*/
    var ul, div;
    var currentTabGroup = tabDiv;
    var tabWithError = -1;
    var tabPosition = currentTabGroup.getAttribute("data-pos");
    if (currentTabGroup && tabPosition) {
      if (tabPosition == "Bottom" || currentTabGroup.getAttribute("data-pos") == "Top")
        var children = pega.util.Dom.getChildren(currentTabGroup);
      else { /*For side cases */
        if (pega.util.Dom.hasClass(currentTabGroup, "with-fixed-header")) {
          var table = pega.util.Dom.getChildren(currentTabGroup)[0];
          var tbody = pega.util.Dom.getChildren(table)[0];
          var tr = pega.util.Dom.getChildren(tbody)[0];
          var td = pega.util.Dom.getChildren(tr);
          if (tabPosition == "Left") {
            ul = $(".dc-left .contents .tab-ul")[0];
          } else {
            ul = $(".dc-right .contents .tab-ul")[0];
          }
          div = pega.util.Dom.getFirstChild(currentTabGroup);
        } else {
          var table = pega.util.Dom.getChildren(currentTabGroup)[0];
          var tbody = pega.util.Dom.getChildren(table)[0];
          var tr = pega.util.Dom.getChildren(tbody)[0];
          var td = pega.util.Dom.getChildren(tr);
          ul = pega.util.Dom.getChildren(td[0])[0];
          div = pega.util.Dom.getChildren(td[1])[0];
        }

        if (tabPosition == "Right")
          var children = [div, ul];
        else
          var children = [ul, div];

      }
      var childLen = children.length;
      var liElement;
      for (var cnt = 0; cnt < childLen; cnt++) {
        if (children[cnt].nodeType == 1) {
          var childDivs = pega.util.Dom.getChildren(children[cnt]);
          for (var divcnt = 0; divcnt < childDivs.length; divcnt++) {
            if (childDivs[divcnt].tagName == "DIV" || childDivs[divcnt].tagName == "TABLE") {
              if (pega.util.Dom.getElementsById("PegaRULESErrorFlag", childDivs[divcnt])) {
                if (tabPosition == "Top") {
                  /* HFix-8335 : if stretch tabs is checked then there is no div around ul li so adding a if condition*/
                  if(!pega.util.Dom.hasClass(tabDiv, "stretchedTabs") && !pega.util.Dom.hasClass(tabDiv, "repeatTabbed")){
                    try {
                      var tStrCntr = pega.util.Dom.getLastChild(children[cnt - 1]);
                      liElement = tStrCntr.getElementsByTagName("li")[divcnt];
                    } catch (e) {
                      return 0;
                    }
                  }else{
                    liElement = children[0].getElementsByTagName("li")[divcnt];
                  }   
                }
                /*BUG-95128(RAIDV): For left position, ul element comes as first element 
                                 in children array, so adding one more if.
                                 */
                else if (tabPosition == "Left" || tabPosition == "Right") {
                  liElement = children[0].getElementsByTagName("li")[divcnt];
                } else {
                  liElement = children[children.length - 1].getElementsByTagName("li")[divcnt];
                }
                var tabLabel = liElement.getAttribute('aria-label');
      			var localizedValue = pega.u.d.fieldValuesList.get('TabHasErrors'); 
		        tabLabel = localizedValue ? localizedValue.replace(/\{1\}/g,tabLabel) : tabLabel;
				liElement.setAttribute('aria-label', tabLabel);

                var newDivObj = document.createElement("div");
                newDivObj.style.display = "block";
                newDivObj.className = "iconErrorTabsDiv";
                newDivObj.innerHTML = "<span class='iconErrorTabs' title='"+tabErrorToolTip+"' id='PegaRULESErrorFlag'/>";
                var parentRow = liElement.getElementsByTagName("tr")[2];
                var targetTD;
                if (!parentRow) {
                  parentRow = liElement.getElementsByTagName("tr")[0];
                }
                if (!parentRow) {
                  parentRow = liElement.getElementsByTagName("SPAN")[0];
                  targetTD = parentRow.getElementsByTagName("span")[0];
                } else
                  targetTD = parentRow.getElementsByTagName("td")[0];

                if (targetTD && targetTD.getElementsByTagName("*").length > 0)
                  targetTD.insertBefore(newDivObj, targetTD.getElementsByTagName("*")[0]);
                else if(targetTD && targetTD.appendChild)
                  targetTD.appendChild(newDivObj);
                else {
                  try{ parentRow.insertBefore(newDivObj,parentRow.firstChild); }catch(e){}
                }

                if (tabWithError == "-1") {
                  tabWithError = divcnt;
                }
              }
            }
          }
        }
      }
    }
    /* }*/
    return tabWithError;
  },
    
  tabErrorHandler: (function(){

    var  clearErrorOnTabHeader = function(tabGrpDiv, tabContentDiv){
      if(tabGrpDiv){
        var tabId = tabContentDiv.getAttribute('aria-labelledby');
        /*var currentTabDiv = tabGrpDiv.querySelectorAll("div[aria-labelledby *= '"+tabId+"'][aria-hidden='false']")[0];*/
        var iconArray = tabContentDiv.querySelectorAll("div[class *= 'iconErrorDiv']");
        var iconArrayWithDisplayNone = tabContentDiv.querySelectorAll("div[class *= 'iconErrorDiv'][style *= 'display: none;']");
        if (iconArray.length == iconArrayWithDisplayNone.length) {
          var position = tabGrpDiv.getAttribute("data-pos");
          if(position/* && (position.toLowerCase() == 'top' || position.toLowerCase() == 'bottom')*/){
            /*BUG-293924 - Remove ErrorIcon except RepeatTabbed scenario*/
            if(!pega.util.Dom.hasClass(tabGrpDiv, "repeatTabbed")){
            	var tabHeader = tabGrpDiv.querySelector("ul[role='tablist'] li[role='tab'][id='"+tabId+"']");
            	if(position.toLowerCase() == "bottom" || position.toLowerCase() == "right"){
              		tabHeader = tabGrpDiv.querySelectorAll("ul[role='tablist'] li[role='tab'][id='"+tabId+"']");
              		tabHeader = tabHeader[tabHeader.length -1];
            		}
            removeErrorIcon(tabHeader);
            }
            clearErrorOnTabGroup(tabGrpDiv.parentNode);   
          }            
        }             
      }
    },

    removeErrorIcon = function(tabHeader){
      if(tabHeader){
        tabHeader.setAttribute('aria-label',tabHeader.getAttribute('title'));
        var ele = tabHeader.getElementsByClassName("iconErrorTabsDiv");
        //BUG-269175
        if(ele && ele.length >0){
			ele[0].style.display = "none";
        }
        //tabHeader.getElementsByClassName("iconErrorTabsDiv")[0].style.display = "none";
      }
    },

    clearErrorOnTabGroup = function(element){
      var tabContentDiv = getTabContentDiv(element);
      var classlist = tabContentDiv.getAttribute("class");
      if(classlist && classlist.match(/^\s*static-dc-tab\s+ | \s+static-dc-tab\s+/)){
            return;
      }
      var tabGrpDiv = getTabGroupDiv(tabContentDiv);
      if(tabGrpDiv && tabContentDiv){
        clearErrorOnTabHeader(tabGrpDiv, tabContentDiv);
      }
    },

    markErrorOnTabHeader = function(tabGrpDiv, tabId){
        if(tabGrpDiv){
            var position = tabGrpDiv.getAttribute("data-pos");
            if(position/* && (position.toLowerCase() == 'top' || position.toLowerCase() == 'bottom')*/){
              /*BUG-293924 - Add ErrorIcon except RepeatTabbed scenario*/
              if(!pega.util.Dom.hasClass(tabGrpDiv, "repeatTabbed")){
                var tabHeader = tabGrpDiv.querySelector("ul[role='tablist'] li[role='tab'][id='"+tabId+"']");
                if(position.toLowerCase() == "bottom" || position.toLowerCase() == "right"){
                    tabHeader = tabGrpDiv.querySelectorAll("ul[role='tablist'] li[role='tab'][id='"+tabId+"']");
                    tabHeader = tabHeader[tabHeader.length -1];
                }
                var tabErrorToolTip = tabGrpDiv ? tabGrpDiv.getAttribute("data-taberror") : pega.u.d.fieldValuesList.get("TabErrorTooltip");
                addErrorIcon(tabHeader,position,tabErrorToolTip);
              }
            }      
        }
    },

    addErrorIcon = function(tabHeader, position, tabErrorToolTip){
        if(!tabHeader){
            return;
        }
        var tabLabel = tabHeader.getAttribute('aria-label');
        var localizedValue = pega.u.d.fieldValuesList.get('TabHasErrors'); 
        tabLabel = localizedValue ? localizedValue.replace(/\{1\}/g,tabLabel) : tabLabel;
        if(!tabHeader.querySelector("span#PegaRULESTabErrorFlag")){        
            tabHeader.setAttribute('aria-label', tabLabel);
            var newDivObj = document.createElement("div");
            newDivObj.style.display = "block";
            newDivObj.className = "iconErrorTabsDiv";
            newDivObj.innerHTML = "<span class='iconErrorTabs' title='"+tabErrorToolTip+"' id='PegaRULESTabErrorFlag'/>";
            var tabSpan = tabHeader.querySelector("span#TABSPAN");
            tabSpan.children[0].insertBefore(newDivObj,tabSpan.children[0].children[0]);
        }else if(tabHeader.querySelector("span#PegaRULESTabErrorFlag").parentNode.style.display != "block") {
            tabHeader.setAttribute('aria-label', tabLabel);
            tabHeader.querySelector("span#PegaRULESTabErrorFlag").parentNode.style.display = "block";
        }
    },

     markErrorOnTabGroup = function(element){
      var tabContentDiv = getTabContentDiv(element);
      var classlist = tabContentDiv.getAttribute("class");
      if(classlist && classlist.match(/^\s*static-dc-tab\s+ | \s+static-dc-tab\s+/)){
		return;
      }
      var tabGrpDiv = getTabGroupDiv(tabContentDiv);
      if(tabGrpDiv && tabContentDiv){
        markErrorOnTabHeader(tabGrpDiv, tabContentDiv.getAttribute('aria-labelledby'));
        markErrorOnTabGroup(tabGrpDiv.parentNode);		
      }
    },

    getTabContentDiv = function(element){
        var role = element.getAttribute("role") || "";
        while(role != "tabpanel" && element.tagName.toLowerCase() != "body"){
            element = element.parentNode;
            role = element.getAttribute("role") || "";
        }
        return element;
    },

    getTabGroupDiv = function(element){
        var id = element.getAttribute("id") || "";
        var position = element.getAttribute("data-pos");
        while(!id.match(/^PEGA_TABBED/) && !position && element.tagName.toLowerCase() != "body"){
            element = element.parentNode;
            id = element.getAttribute("id") || "";
            position = element.getAttribute("data-pos") || "";
        }
        if(id.match(/^PEGA_TABBED/)){
            return element;
        }
        return null;
    },

    isElementInTab = function(element){
        if(!element){
            return false;
        }
        var elements = document.querySelectorAll("div[id^='PEGA_TABBED'] div[role='tabpanel'] "+element.tagName+"[name='"+element.name+"']");
        if(elements && elements.length > 0){
            for(var index = 0; index < elements.length; index++){
                if(elements[index] == element){
                    return true;
                }
            }
        }
        return false;
    },
        
    processError = function(element, action){
        try{
          if(isElementInTab(element)){
            if(action == "add"){
                markErrorOnTabGroup(element);
            } else if(action == "clear"){
                clearErrorOnTabGroup(element);
            }
          }      
        }catch(e){    
            if(window.console){
                console.error("Exception while setting error marker on tabheader.");
            }
        }
    };
    
    return {
        processError: processError
    };
     
  })(),

  handleErrorsInTabgroupLayout : function(element, action){      
      pega.u.d.tabErrorHandler.processError(element, action);
  },

  /*
     @Handler
     @protected Invoked Onclick on the header tabs Draws the selected tab.
     @return $void$
     */
  selectTab: function(event) {
    if (typeof (ISnsPopupHide) == "function")
      ISnsPopupHide(); /* to hide any existing smart prompt popup. */
    event = event === undefined ? window.event : event;

    var sourceElem = pega.util.Event.getTarget(event);
    var parentElem = pega.u.d.findParent(sourceElem, "TabGroup");
    var index = sourceElem.getAttribute("index");
    if (index != null && parentElem != null) {
      pega.u.d.drawTab(index, parentElem);
    }
    if (typeof pega.u.d.getPopOver == 'function') {
      pega.u.d.getPopOver().close();
    }
    pega.util.Event.stopEvent(event);
    //                            pega.desktop.support.resizeGadget();
  },

  /*
     @protected Draws tab header and content.
     Called by the selectTab() function.
     @param $Int$selIndex -Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @return $void$
     */
  drawTab: function(selIndex, tabgroup) {
    var tabHeaderTable = pega.util.Dom.getElementsById("tabTable", tabgroup);
    if (tabHeaderTable) {
      tabHeaderTable = tabHeaderTable[0];
    } else {
      return;
    }
    var tabHeaderCells = tabHeaderTable.rows[0].cells;
    var tabHeaderCellsLen = tabHeaderCells.length;
    var defaultTabFound = false;
    var indexAttrValue = null;
    var tabIndex = 1;
    for (var i = 0; i < tabHeaderCellsLen; i++) {
      var indexAttr = tabHeaderCells[i].getAttribute("index");
      if (indexAttr && indexAttr != "") {
        indexAttr = parseInt(indexAttr);
        if (indexAttr == selIndex) {
          indexAttrValue = indexAttr;
          selIndex = tabIndex;
          defaultTabFound = true;
          break;
        } else if (indexAttrValue == null) {
          indexAttrValue = indexAttr;
        }
      }
      if (tabHeaderCells[i].id == "coverTabRE") {
        tabIndex++;
      }
    }
    if (!defaultTabFound) {
      selIndex = 1;
    }
    pega.u.d.drawTabHeader(selIndex, tabHeaderTable);
    pega.u.d.drawTabContent(indexAttrValue, tabgroup);
    pega.u.d.setHarnessTabAriaAttributes(tabgroup);
  },
  setHarnessTabAriaAttributes: function(tabgroup){
    var utilDom = pega.util.Dom;
    var tabHeaderTable = pega.util.Dom.getElementsById("tabTable", tabgroup);
    if(tabHeaderTable){
      tabHeaderTable = tabHeaderTable[0];
      utilDom.getElementsBy(function(tabEl){
        return (tabEl.getAttribute("role") == "tab" && utilDom.hasClass(tabEl, "coverTabMiddle_on"));
      }, "td", tabHeaderTable, function(tabElement){
        tabElement.setAttribute("aria-selected","false");
        tabElement.setAttribute("tabIndex","-1");
      });
      utilDom.getElementsBy(function(tabEl){
        return (tabEl.getAttribute("role") == "tab" && utilDom.hasClass(tabEl, "coverTabMiddle"));
      }, "td", tabHeaderTable, function(activeTabElement){
        activeTabElement.setAttribute("aria-selected","true");
        activeTabElement.setAttribute("tabIndex","0");
        try{
          activeTabElement.focus();
        } catch(e){ }
      });
    }
    var tabContentDiv = pega.util.Dom.getElementsById("tabContents",tabgroup);
    if(tabContentDiv){
      tabContentDiv = tabContentDiv[0];
      utilDom.getElementsByClassName("containerBody", "table", tabContentDiv , function(tabContentElement){
        tabContentElement.setAttribute("role","tabpanel");
        tabContentElement.setAttribute("aria-selected",(tabContentElement.style.display == "none" ? "false" : "true"));
        tabContentElement.setAttribute("tabIndex",(tabContentElement.style.display == "none" ? "-1" : "0"));
        tabContentElement.setAttribute("aria-hidden",(tabContentElement.style.display == "none" ? "true" : "false"));
      });
    }
  },
  harnessTabAccessibilityHandler:function(ev){
    var utilDom = pega.util.Dom;
    var utilEvent = pega.util.Event;
    var targetSrc = utilEvent.getTarget(ev);
    if (!targetSrc) return;
    var targetTd, tabToFocus, tabHeaderParent;

    if(utilDom.hasClass(targetSrc, "coverTabMiddle") || utilDom.hasClass(targetSrc, "coverTabMiddle_on")){
      targetTd = targetSrc;
    } else {
      targetTd = utilDom.getAncestorBy(targetSrc, function(parentElement){
        return (parentElement.getAttribute("role") == "tab" && (utilDom.hasClass(parentElement, "coverTabMiddle") || utilDom.hasClass(parentElement, "coverTabMiddle_on")));
      });
    }
    if (!targetTd) return;
    tabHeaderParent = targetTd.parentNode;
    switch (ev.type) {
      case 'keydown':
        if (ev.keyCode == '37' || ev.keyCode == '38') { // On left arrow and up arrow focus previous tab header
          tabToFocus = utilDom.getPreviousSiblingBy(targetSrc, function(tabHeader){
            return (tabHeader.getAttribute("role") == "tab" && (utilDom.hasClass(tabHeader, "coverTabMiddle") || utilDom.hasClass(tabHeader, "coverTabMiddle_on")));
          });
          if (!tabToFocus) {
            tabToFocus = utilDom.getLastChildBy(tabHeaderParent, function(tabHeader){
              return (tabHeader.getAttribute("role") == "tab" && (utilDom.hasClass(tabHeader, "coverTabMiddle") || utilDom.hasClass(tabHeader, "coverTabMiddle_on")));
            });
          }
          if(tabToFocus) tabToFocus.focus();
        } else if (ev.keyCode == '39' || ev.keyCode == '40') { // On right arrow and down arrow focus next tab header
          tabToFocus = utilDom.getNextSiblingBy(targetSrc, function(tabHeader){
            return (tabHeader.getAttribute("role") == "tab" && (utilDom.hasClass(tabHeader, "coverTabMiddle") || utilDom.hasClass(tabHeader, "coverTabMiddle_on")));
          });
          if (!tabToFocus) {
            tabToFocus = utilDom.getFirstChildBy(tabHeaderParent, function(tabHeader){
              return (tabHeader.getAttribute("role") == "tab" && (utilDom.hasClass(tabHeader, "coverTabMiddle") || utilDom.hasClass(tabHeader, "coverTabMiddle_on")));
            });
          }
          if(tabToFocus) tabToFocus.focus();
        }
        break;
      case 'keyup':
        if (ev.keyCode == '37' || ev.keyCode == '38' || ev.keyCode == '39' || ev.keyCode == '40')
          targetSrc.click();
        break;
    }
  },

  /*
     @protected Sets the styles of the tabs when a WHEN condition is present across divs
     Called by the drawTab() function.
     @param $Object$displayDiv- Tab element displayed
     @return $void$
     */
  correctStyles: function(displayDiv) {
    var tdElements = displayDiv.getElementsByTagName("TD");

    //Correct the left and right edge for single tab case
    if (tdElements.length == 3) {
      tdElements[0].className = "coverTabLeftSolo";
      tdElements[2].className = "coverTabRightSolo";
    }

    //Correct the left and right edge of the default tab
    var tdElementsLength = tdElements.length;
    for (var i = 0; i < tdElementsLength; i++) {
      if (i > 0 && !(tdElements[i - 1].className == "coverTabMiddle")) {
        if (tdElements[i].className == "coverTabMiddle") {
          if (i == 1) {
            tdElements[i - 1].className = "coverTabLeftSolo";
          } else {
            tdElements[i - 1].className = "coverTabOverlapRight";
          }
        }
      } else {
        if ((i + 1) == (tdElements.length - 1)) {
          tdElements[i + 1].className = "coverTabRightSolo";
        }

      }
      //Set the incorrect last tab right edge when not default
      if (i == (tdElements.length - 1)) {
        if (tdElements[i - 1].className == "coverTabMiddle_on") {
          tdElements[i].className = "coverTabRight_on";
        }
      }
    }
  },



  /*
     @protected Draws tab content.
     Called by drawTab function
     @param $Int$selIndex -Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @return $void$
     */

  drawTabContent: function(selIndex, tabgroup) {
    var TabContentDiv, SelectedContent;
    TabContentDiv = pega.util.Dom.getElementsById("tabContents", tabgroup);
    if (TabContentDiv == null) return;
    if (TabContentDiv)
      TabContentDiv = TabContentDiv[0];
    var children = pega.util.Dom.getChildren(TabContentDiv);

    var content = "Content";
    var selContentWithID = content + selIndex;
    var setStyleRef = pega.util.Dom.setStyle;
    var resizeAllExpandedTextAreasRef = null;

    if (typeof (pega.ui.textarea) != "undefined") {
      resizeAllExpandedTextAreasRef = pega.ui.textarea.resizeAllExpandedTextAreas;
    }

    var thisChild;
    var childLen = children.length;
    for (var i = 0; i < childLen; i++) {
      thisChild = children[i];
      if (thisChild.id == selContentWithID) {
        SelectedContent = thisChild;
        if (thisChild.style.display != "block" && thisChild.style.display != "")
          thisChild.style.display = "";

        if (typeof (harnessTabCallback) != "undefined") {
          harnessTabCallback(selIndex, SelectedContent);
        }

        // Expand any textareas that are supposed to load expanded
        if (resizeAllExpandedTextAreasRef != null) {
          resizeAllExpandedTextAreasRef(true);
        }
        // Added below line



      } else {
        thisChild.style.display = "none";
      }
    }

    pega.u.d.setSelectedTab(selIndex, tabgroup);
    if (typeof (SelectedContent) != "undefined")
      pega.u.d.checkForDeferLoading(tabgroup, selIndex, SelectedContent);
    pega.u.d.resizeHarness();
  },



  /*
     @protected Checks if the selected tab is to be loaded now.
     @param $Int$selIndex- Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @param $Object$SelectContent- Selected content
     @return $void$

     */
  checkForDeferLoading: function(tabgroup, selIndex, SelectedContent) {
    if (SelectedContent.childNodes != null) {
      var childLen = SelectedContent.childNodes.length;
      var paramName,thisChild;
      for (var i = 0; i < childLen; i++) {
        thisChild = SelectedContent.childNodes[i];
        if (thisChild.id == "TAB-INDICATOR") {
          thisChild.value = "true";
          paramName = thisChild.name;
          break;
        }
      }
      for (var i = 0; i < childLen; i++) {
        thisChild = SelectedContent.childNodes[i];
        if (thisChild.id == "DEFER_LOAD") {
          pega.u.d.loadTabbedContainer(tabgroup, selIndex, paramName, thisChild);
          break;
        }
      }
    }
  },



  /*
     @protected Reloads the stream.
     This function reload the content for tabbed container. Called by checkForDeferLoading function
     @param $Int$selIndex- Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @param $String$paramName
     @param $Object$deferLoadDiv
     @return $void$
     */
  loadTabbedContainer: function(tabgroup, selIndex, paramName, deferLoadDiv) {
    var selContentID = "Content" + selIndex;
    //R-18888 Code updated to create SafeURLS
    var strUrl = new SafeURL("Rule-HTML-Harness.GetContainerHTML");
    strUrl.put("pzPrimaryPageName", strPrimaryPage);
    strUrl.put("ClassName", strHarnessClass);
    strUrl.put("StreamName", strHarnessPurpose);
    var readOnly = this.getReadOnlyValue("", deferLoadDiv);
    strUrl.put("ReadOnly", readOnly);
    if(paramName){
      strUrl.put("RenderSingle", paramName);
    }
    strUrl.put("PrimaryPage", strPrimaryPage);

    var callback = {
      success: function(oResponse) {
        var childLen = tabgroup.childNodes.length,thisChild;
        for (var i = 0; i < childLen; i++) {
          thisChild = tabgroup.childNodes[i];
          if (thisChild.id == "TAB-INDICATOR") {
            if (thisChild.value != selIndex) {
              pega.u.d.gBusyInd.hide();
              return;
            }
          }
        }
        var newStream = oResponse.responseText;
        if (pega.u.d.checkExceptions(newStream, deferLoadDiv)) {
          pega.u.d.gBusyInd.hide();
          return;
        }
        var documentFragment = document.createDocumentFragment();
        var newElement = document.createElement("DIV");
        newElement.style.display = "none";
        documentFragment.appendChild(newElement);

        newElement.innerHTML = newStream;
        var newTabbedTable = pega.util.Dom.getElementsById(selContentID, newElement);
        var originalDiv = pega.util.Dom.getElementsById(selContentID, tabgroup);

        if (newTabbedTable && originalDiv)
          pega.u.d.loadDOMObject(originalDiv[0], "<table cellspacing='0' cellpadding='0' style='width:100%'>" + newTabbedTable[0].innerHTML + "</table>");

        var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", newElement);
        if (onlyOnceEle && onlyOnceEle[0]) {
          pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
        }

        pega.u.d.drawTabContent(selIndex, tabgroup);
        pega.u.d.gBusyInd.hide();
      },
      failure: function(oResponse) {
        pega.u.d.gBusyInd.hide();
        //handle an unsuccessful request

      }
    }
    this.setBusyIndicator();
    var request = this.asyncRequest('POST', strUrl, callback);

    //                            pega.desktop.support.resizeGadget();
  },



  /*
     @protected Sets the parameter for selected tab.
     Called by the drawTabContent function
     @param $Int$selIndex- Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @return $void$
     */
  setSelectedTab: function(selIndex, tabgroup) {
    var childLen = tabgroup.childNodes.length,thisChild;
    for (var i = 0; i < childLen; i++) {
      thisChild = tabgroup.childNodes[i];
      if (thisChild.id == "TAB-INDICATOR") {
        thisChild.value = selIndex;
        break;
      }
    }
  },



  /*
     @protected Draws the tab header
     @param $Int$selIndex- Index of the selected Tab
     @param $Object$tabgroup- tabgroup element
     @return $void$
     */
  drawTabHeader: function(selIndex, tabHeaderTable) {
    var isJSRComp = tabHeaderTable.getAttribute("jsrcompliant") == "true" ? true : false;
    var tabClassMap = {
      TAB_LEFT_SOLO: isJSRComp ? "wpsTableHead" : "coverTabLeftSolo",
      TAB_LEFT_ON: isJSRComp ? "wpsPortletTitle" : "coverTabLeft_on",
      TAB_RIGHT_SOLO: isJSRComp ? "wpsTableHead" : "coverTabRightSolo",
      TAB_RIGHT_ON: isJSRComp ? "wpsPortletTitle" : "coverTabRight_on",
      TAB_MIDDLE: isJSRComp ? "wpsTableHead" : "coverTabMiddle",
      TAB_MIDDLE_ON: isJSRComp ? "wpsPortletTitle" : "coverTabMiddle_on",
      TAB_OVERLAP_LEFT: isJSRComp ? "wpsTableHead" : "coverTabOverlapLeft",
      TAB_OVERLAP_RIGHT: isJSRComp ? "wpsTableHead" : "coverTabOverlapRight",
      TAB_OVERLAP_LEFT_ON_RIGHT: isJSRComp ? "wpsTableHead" : "coverTabOverlapLeftOnRight",
      TAB_OVERLAP_RIGHT_ON_LEFT: isJSRComp ? "wpsTableHead" : "coverTabOverlapRightOnLeft",
      TITLE_BAR_LABEL: isJSRComp ? "wpsPortletHead" : "tabbedHeaderLabelStyle",
      TITLE_BAR_LABEL_ON: isJSRComp ? "wpsPortletHead" : "tabbedHeaderLabelStyle_on"
    };
    var tabsCountLocal = pega.util.Dom.getElementsById("coverTabRE", tabHeaderTable);
    tabsCountLocal = tabsCountLocal ? tabsCountLocal.length : 0;
    var tabHeaderCells = tabHeaderTable.rows[0].cells;
    var tabHeaderCellsLen = tabHeaderCells.length;
    if (tabHeaderCellsLen <= 1) {
      tabHeaderTable.style.display = "none";
      return;
    }
    tabHeaderTable.style.display = "none";
    var tabIndex = 1;
    for (var i = 0; i < tabHeaderCellsLen; i++) {
      var isSelected = (selIndex == tabIndex);
      var isNextSelected = (selIndex == tabIndex + 1);
      //var isPrevSelected = (selIndex == tabIndex - 1);
      var isSelectedOnRight = (selIndex > tabIndex + 1);
      //var isSelectedOnLeft = (selIndex < tabIndex - 1);
      var isLast = (tabIndex == tabsCountLocal);
      var tabCell = tabHeaderCells[i];
      if (tabHeaderCells[i].id == "coverTabLE") {
        if (isSelected) {
          tabCell.className = tabClassMap.TAB_LEFT_SOLO;
        } else {
          tabCell.className = tabClassMap.TAB_LEFT_ON;
        }
      } else if (tabCell.id == "coverTabRE") {
        if (isLast) {
          if (isSelected) {
            tabCell.className = tabClassMap.TAB_RIGHT_SOLO;
          } else {
            tabCell.className = tabClassMap.TAB_RIGHT_ON;
          }
        } else {
          if (isSelected) {
            tabCell.className = tabClassMap.TAB_OVERLAP_LEFT;
          } else if (isNextSelected) {
            tabCell.className = tabClassMap.TAB_OVERLAP_RIGHT;
          } else if (isSelectedOnRight) {
            tabCell.className = tabClassMap.TAB_OVERLAP_RIGHT_ON_LEFT;
          } else {
            tabCell.className = tabClassMap.TAB_OVERLAP_LEFT_ON_RIGHT;
          }
        }
        tabIndex++;
      } else {
        var labelSpan = pega.util.Dom.getElementsById("coverTabLabel", tabCell);
        labelSpan = labelSpan ? labelSpan[0] : null;
        if (isSelected) {
          tabCell.className = tabClassMap.TAB_MIDDLE;
          if (labelSpan) {
            labelSpan.className = tabClassMap.TITLE_BAR_LABEL;
          }
        } else {
          tabCell.className = tabClassMap.TAB_MIDDLE_ON;
          if (labelSpan) {
            labelSpan.className = tabClassMap.TITLE_BAR_LABEL_ON;
          }
        }
      }
    }
    tabHeaderTable.style.display = "block";
  },

  /*
     Select the tab When the client events cause a change in a section that is part of a tab.
     @param $String$tdElem -Show hide Element

     */
  setTargetTab: function(tdElem) {
    var parentDiv = this.findParentDiv(tdElem);
    while (parentDiv && parentDiv.className != "yui-content tabContent") {
      if (parentDiv.getAttribute("section_index"))
        var sectionIndex = parentDiv.getAttribute("section_index");
      parentDiv = this.findParentDiv(parentDiv);

    }
    while (tdElem.parentNode) {
      tdElem = tdElem.parentNode;
      if (tdElem.id) {
        if (tdElem.id.indexOf("PEGA_TABBED") != -1) {
          var tabs = pega.util.Dom.getElementsById("TABANCHOR");
          for (var j = 0; j < tabs.length; j++) {
            // 06/27/2011 GUJAS1 BUG-37535 - parentElement doesn't work in FF. Replacing with parentNode which is cross browser.
            // var parentLi=tabs[j].parentElement
            var parentLi = tabs[j].parentNode;
            var sectionIdx = parentLi.getAttribute("section_index");
            if (sectionIndex == sectionIdx) {
              pega.util.Event.fireEvent(tabs[j], 'click');
            }
          }
          break;
        }
      }
    }
  },
  /*
     * BUG-35894
     * @param $boolean$show - set showTargetTab
     */
  setShowTargetTab: function(show) {
    this.showTargetTab = show;
  }

};
pega.lang.augmentObject(pega.ui.Doc.prototype, tabSupport);
//static-content-hash-trigger-GCC
/*KeepMessages flag set to false. KeepMessages is used by end user in ProcessAction in order to cancel error clearing.*/
if (pega.u.d.KeepMessages == undefined) {
	pega.u.d.KeepMessages = "false";
}
/*KeepPageMessages flag set to false. KeepPageMessages is used to clear or retain the page messages for defer loaded section and tabs */
/* BUG-386603: setting KeepPageMessages in initialVars so that it will be updated in all the contexts */
/*if(pega.ctx.KeepPageMessages == undefined){
  pega.ctx.KeepPageMessages = "false";
}*/

if (pega.u.d.SubmitInProgress == undefined) {
	pega.u.d.SubmitInProgress = false;
}

var docSubmit = {
	gCallbackArgs: null,

	/*
	 @protected Appends work Button's action to Form's action, then reloads the Form.
	 If the source button is specified (and not an icon), disable it
	 and (optionally) replace its label with strBusyText.
	 @param $String$strAction - Content to be appended to form's action
	 @param $Object$objButton - Button element which fired this event, objButton is actually a reference to the parent of the button object
	 @param $String$strBusyText - Text with which to replace button label
	 @return $void$
	 */

	reloadForm: function(strAction, objButton, strBusyText, event) {
		if (!strAction == "") {
			// inform test and performance monitor that action in flight
			if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setNavigationBusy(strAction);

			if (objButton != null) {
				// if button's 'isIcon' value != null, it's OK
				// to disable the button and replace its label
				if (objButton.style != null) {
					if (strBusyText != null) {
						objButton.innerHTML = "<span class='buttonTextWorking'>" + strBusyText + "</span><span class='buttonIconWorking'></span>";
						/* objButton.style.width = objButton.clientWidth * 1.5 + "px"; Task-3455 - Removed to resolve the button expand issue */
					}
					objButton.disabled = true;
				}
			}
			var strHarness = document.getElementById("HarnessPurpose").value;
			window.location.href = document.forms[0].action + "&" + strAction + "&Purpose=" + strHarness;
		}
	},

	/*
	@public Process clicks on action buttons. A url is formed and submitted to
	the server to show the Flow Action with back navigation to Button flow action.
	@Handler
	@param $String$taskStatus Name of the flow action to be processed
	@param $Integer$taskIndex - Index of the flow action on newAssignPage
	@param $String$streamType - Identifies the stream type for the flowaction
	@param $String$prevTaskIndex- Index of the currently displaying flow action
	@param $String$prevTaskStatus- Name of the currently displaying flow action
	@return $void$
	*/
	/* US-265505 Added extra key isMobileFullScreen which can have value "true" or "false" to options object. 
	 animObj inside options param has been changed. Please refer to the doc DOC-15517 in AgileStudio to know the changes.
	 This animObj now has a single json object to capture all the values required for animations on both desktop and mobile, reveal and dismiss.
	 Eg 1: {"animObj":{"isCustomMobileAnim":"true","desktop":{"reveal":{"ease":"standard","effect":"anim-fade-open","speed":"0.4"},"isCustomDismiss":"true","dismiss":{"ease":"standard","effect":"reverse-anim-fade-open","speed":"0.4"}},"mobile":{"reveal":{"ease":"standard","effect":"anim-offbottom-open","speed":"0.4"},"isCustomDismiss":"true","dismiss":{"ease":"standard","effect":"reverse-anim-offbottom-open","speed":"0.4"}}}}
	  If "isCustomMobileAnim" is "false", then the reverse of desktop effects will be considered for mobile and the properties from "mobile" object are not considered.
Similarly, if "isCustomDismiss" is "false", then the reverse of reveal effect will be considered as effect of dismiss for mobile/desktop and the properties under "dismiss" are not considered.
	  Eg 2: {"animObj":{"isCustomMobileAnim":"false","desktop":{"reveal":{"ease":"standard","effect":"anim-fade-open","speed":"0.4"},"isCustomDismiss":"false"}}}
  */
	//US-79038 Disable clickaway configuration
	processAction: function(taskStatus, taskIndex, streamType, prevTaskIndex, prevTaskStatus, bIsModal, event, modalSection, urlObj, reloadElement, bCalledFromGrid, modalStyle, callbackObj, options, bIsDisableClickaway) {
		var harCtxMgr = pega.ui.HarnessContextMgr;
		/* added for US-229126 - parmn */
		var overlayLoadBehaviour;
		if (options && options.loadBehaviour) {
			overlayLoadBehaviour = options.loadBehaviour;
		}
		/*
		 BEGIN: Code to check and prevent opening of modal dialog from withing a modal dialog
		 Avoid this check if urlObj contains a parameter modelessDialog set to true (when modal dialog is used as a layout only. No other support).
		 */
		var checkForModalOpen = true;

		if (urlObj && urlObj instanceof SafeURL && urlObj.get("modelessDialog")) {
			checkForModalOpen = false;
			pega.u.d.bIsModelessDialog = true;
		}

		/* RDL Master Detail augmentaion logic - Start */

		var MDOverlayOpen = pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.isShowDetailsOpen;
		var isThreadSetup = MDOverlayOpen && pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.__RDLThreadSetup;
		var isCurrentPgContext = urlObj && urlObj instanceof SafeURL && !urlObj.get("BaseReference");
		// Check if network is available - hybrid client
		var cannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");

		var isRDLMasterDetailsOpen = pega.ctx.dom.querySelector(".RDLShowDetails.open");
		if (bIsModal != "masterdetail" && isRDLMasterDetailsOpen && !pega.u.d.ServerProxy.isBrowserClient()) { /* BUG-370724: Handle RDL edit in mobile app */
			if (pega.ui.rdlMasterDetails.getActiveRDLMetaInfo().isOnlineWOBound) {
				var threadName = pega.ui.rdlMasterDetails.getWorkProcessingThread();
				pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
				if (threadName) {
					pega.u.d.switchThread(threadName);
					pega.ui.ClientCache.init(threadName);
				}
			}
		}

		if (MDOverlayOpen && isCurrentPgContext) {
			var row = pega.ui.rdlMasterDetails.getActiveRow();
			var rowPage = row.getAttribute("base_ref");
			//var DPName = rowPage.substring(0,rowPage.indexOf("_pa"));
			var baseThreadName = pega.u.d.baseThreadName;
			var baseThreadCT = pega.u.ChangeTrackerMap.getTrackerByThread(baseThreadName);

			var rdlRow = pega.ui.rdlMasterDetails.getActiveRow();
			var rdlNode = pega.ui.rdlMasterDetails.getEnclosingRL(rdlRow);
			// Check if the RDL is WorkObject bound and update the row page with the data from the temp page
			var rdlClassFamily = pega.ui.rdlMasterDetails.getRDLClassFamily(rdlNode);
			var isWOBoundRDL = (rdlClassFamily && rdlClassFamily.toUpperCase() == "WORK") ? true : false;
			var isRDLCaseOfflinable = pega.ui.rdlMasterDetails.isRDLCaseOfflinable(rdlNode);

			if (pega.u.d.ServerProxy.isDestinationLocal()) { // OSCO - online (or) offlinable case
				/* BUG-267955: Calculating isServerAvailable using pega.offline.NetworkStatus.getServerAvailabilityStatus */
				var isServerAvailable = false;
				if (pega.offline && pega.offline.NetworkStatus.getServerAvailabilityStatus()) {
					isServerAvailable = true;
				}
				/* BUG-335068: The "augment" calls are needed when the case is offlinable */
				/* US-138315: This should happen for non work-object bound RDLs */
				if (isServerAvailable || isRDLCaseOfflinable || !isWOBoundRDL) {
					options = this.augmentOptionsForRDLDetails(options);
					/* The edit flow action is required to run on PackagedPage only when 
					 * the row page is not available or does not contain required data, 
					 * e.g. in case of work object bound RDL. For non-work object bound RDL, 
					 * row page is sufficient and no need of OSCO breakout.
					 * This was working earlier due to the fact that the value of base reference
					 * was not used anywhere. However, with the changes for US-218561 in 
					 * pzpega_ui_doc_processactionoffline JS, it started breaking */
					urlObj = isWOBoundRDL ? this.augmentUrlObjForRDLDetails(urlObj) : urlObj;
					callbackObj = this.augmentCallbackForRDLDetails(callbackObj);
				} else {
					// BUG-320349: Not the gateway to throw alert; getWorkItem() and ServerProxy would take care of showing it aptly
					// alert(cannotPerformWhenOffline);
					if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
						pega.ui.DCUtil.cancelTransition();
					}
				}

				if (!isWOBoundRDL) {
					options.contextParams = {
						packagedContext: pega.ui.DataRepeaterUtils.getPackagedPageName(),
						runtimeContext: rowPage
					};
				}
			} else if (pega.u.d.ServerProxy.isDestinationRemote() && pega.u.d.ServerProxy.isHybridClient() && pega.ui.ParametrizedDPUtils.isParametrizedDataPageInstance(rowPage, baseThreadCT)) {
				urlObj = this.augmentUrlObjForRDLDetails_Online(urlObj);
				options = this.augmentOptionsForRDLDetails(options);
				callbackObj = this.augmentCallbackForRDLDetails_HCOnline(callbackObj);
			} else if (!isThreadSetup) { // Skip augmenting during thread setup request for WO bound RDL in Desktop
				urlObj = this.augmentUrlObjForRDLDetails_Online(urlObj);
				options = this.augmentOptionsForRDLDetails_Online(options);
				callbackObj = this.augmentCallbackForRDLDetails_Online(callbackObj);
			}
		}

		/* RDL Master Detail augmentaion logic - End */

		//BUG-45446: Added condition for isAncestor
		if (pega.u.d.bModalDialogOpen && bIsModal && bIsModal != "overlay" && checkForModalOpen && event && pega.util.Dom.isAncestor(pega.u.d.modalDialog.innerElement, pega.util.Event.getTarget(event))) {
			alert(NoModalInModal);
			return;
		}

		/*
		 END: Code to check and prevent opening of modal dialog from withing a modal dialog
		 */

		if (harCtxMgr.get("bWarnBeforeChangingWindow") == true && !showDialogForWindowChange())
			return;
		event = (event == undefined) ? window.event : event;
		//pega.util.Event.stopPropagation(event);
		if (event && event != null) {
			var target = pega.util.Event.getTarget(event);
			if (!(event.type == "click" && target && target.type == "checkbox")) {
				pega.util.Event.preventDefault(event);
			}
		}
		var actionURL = new SafeURL();
		if (pega.ctx.isUITemplatized) {/*BUG-260757*/
			/* BUG-273463 - If the urlObj has UITemplatingStatus, use the same in actionURL */
			var templatingStatus = "Y";
			if (urlObj instanceof SafeURL && urlObj.get("UITemplatingStatus")) {
				templatingStatus = urlObj.get("UITemplatingStatus");
			}
			actionURL.put("UITemplatingStatus", templatingStatus);
		}
		actionURL.put("NewTaskStatus", taskStatus);
		actionURL.put("TaskIndex", taskIndex);
		actionURL.put("StreamType", streamType);
		actionURL.put("FieldError", harCtxMgr.get("fieldErrorType") ? harCtxMgr.get("fieldErrorType") : "");
		actionURL.put("FormError", harCtxMgr.get("formErrorType") ? harCtxMgr.get("formErrorType") : "");
		actionURL.put("pyCustomError", harCtxMgr.get("pyCustomError") ? harCtxMgr.get("pyCustomError") : "");
		actionURL.put("bExcludeLegacyJS", harCtxMgr.get("bExcludeLegacyJS") ? harCtxMgr.get("bExcludeLegacyJS") : "");
		if (modalSection)
			actionURL.put("ModalSection", modalSection);
		if (modalStyle) {
			actionURL.put("modalStyle", modalStyle);
		} else {
			actionURL.put("modalStyle", "");
		}
		if (prevTaskStatus)
			actionURL.put("PrevTaskStatus", prevTaskStatus);
		if (prevTaskIndex)
			actionURL.put("PrevTaskIndex", prevTaskIndex);
		if (bIsModal == "overlay")
			actionURL.put("FlowActionTarget", bIsModal);
		if (urlObj && urlObj instanceof SafeURL)
			actionURL.copy(urlObj);
		/* added for US-229126 - parmn */
		if (overlayLoadBehaviour) {
			if (options == null && typeof options == "undefined") {
				options = {};
			}
			options.loadBehaviour = overlayLoadBehaviour;
		}

		if (bIsModal) {
			//US-79038 Disable clickaway configuration
			if (bIsDisableClickaway == null || typeof (bIsDisableClickaway) == "undefined") {
				bIsDisableClickaway = false;
			}
			//Center Position Overlay
			if (options != null && (options.isCenterOverlay == null || typeof (options.isCenterOverlay) == "undefined")) {
				options.isCenterOverlay = false;
			}
			this.processActionModal(actionURL, reloadElement, event, bCalledFromGrid, callbackObj, options, bIsDisableClickaway);
		} else {
			this.processActionDefault(actionURL, event);
		}
	},

	augmentOptionsForRDLDetails: function(options) {
		if (options) {
			options.doNotRefresh = true;
		} else {
			options = {
				doNotRefresh: true
			};
		}

		return options;
	},

	augmentOptionsForRDLDetails_Online: function(options) {
		if (!options)
			options = {};
		options.doNotRefresh = false;
		return options;
	},

	augmentUrlObjForRDLDetails: function(urlObj) {

		if (pega.ui && pega.ui.DataRepeaterUtils) {
			// Packaged page name = "PackagedPage" + JAVA hashCode of "PackagedPage"
			var packagedPageName = pega.ui.DataRepeaterUtils.getPackagedPageName();
			urlObj.put("BaseReference", packagedPageName);
		}

		return urlObj;
	},

	augmentUrlObjForRDLDetails_Online: function(urlObj) {
		if (!urlObj) {
			urlObj = new SafeURL();
		}
		if (pega.ctx.RDL.masterDetailsParams && pega.ctx.RDL.masterDetailsParams.__RDLWOThreadInitialized) { // Send rowPage param only for WO bound RDL
			var row = pega.ui.rdlMasterDetails.getActiveRow();
			var rowPage = row.getAttribute("base_ref");
			urlObj.put("rowPage", rowPage);
			urlObj.put("RDLDetails", "true");
		}
		return urlObj;
	},

	augmentCallbackForRDLDetails: function(callbackObj) {
		if (callbackObj) {
			return callbackObj;
		} else {
			return {
				submit: function() {
					var packagedPageName = pega.ui.DataRepeaterUtils.getPackagedPageName();
					var isWOBoundRDL = false;
					var rdlRow = pega.ui.rdlMasterDetails.getActiveRow();
					var primaryPgName = rdlRow.getAttribute("base_ref");
					var rdlNode = pega.ui.rdlMasterDetails.getEnclosingRL(rdlRow);
					var dataSource = rdlNode ? rdlNode.getAttribute("data-repeat-source") : null;
					var rdlRowSection = rdlRow ? rdlRow.querySelector("#RULE_KEY") : null;

					// Check if the RDL is WorkObject bound and update the row page with the data from the temp page
					var rdlClassFamily = pega.ui.rdlMasterDetails.getRDLClassFamily(rdlNode);
					isWOBoundRDL = (rdlClassFamily && rdlClassFamily.toUpperCase() == "WORK") ? true : false;
					var rowPage = pega.ui.ClientCache.find(primaryPgName);
					if (isWOBoundRDL) {
						pega.ui.DataRepeaterUtils.mergePage(primaryPgName, packagedPageName);
						var actionData = new Object();
						var clientWorkPage = pega.ui.ClientCache.find(packagedPageName);

						actionData.pyWorkPage = JSON.parse(clientWorkPage.getJSON());
						var isCaseOffline = pega.ui.rdlMasterDetails.isRDLCaseOfflinable(pega.ui.rdlMasterDetails.getEnclosingRL(rdlRow));
						var eleInShowDetails = pega.ui.rdlMasterDetails.isElementInShowDetails(pega.u.d.submitModalDlgParam.associatedElement);
						/* Update the work item in client store */
						if (isCaseOffline && eleInShowDetails) {
							pega.offline.clientstorehelper.saveWorkObject(
								clientWorkPage.get("pzInsKey").getValue(),
								clientWorkPage.getJSON(),
								function() {
									pega.ui.debug && console.info(clientWorkPage.get("pzInsKey").getValue() + " updated in the client store");
								},
								function() {
									pega.ui.debug && console.info(clientWorkPage.get("pzInsKey").getValue() + " couldn't be updated in the client store");
								});
						}

						var reference = rowPage.getReference();
						var DPName = reference.substring(0, reference.indexOf("."));
						pega.ui.DataRepeaterUtils.saveDataPage(DPName, {
							success: function() {
								pega.ui.debug && console.info("Success: " + DPName + " persisted");
							},
							failure: function() {
								pega.ui.debug && console.info("Failure: " + DPName + " persist attempt failed");
							}
						});

						if (clientWorkPage.get("pyID"))
							actionData.pyID = clientWorkPage.get("pyID").getValue();

						actionData.pyWorkPage.pyTemporaryObject = "false";
						try {
							actionData.pxCreateDateTime = clientWorkPage.get("pxCreateDateTime").getValue();
							actionData.pxUpdateDateTime = clientWorkPage.get("pxUpdateDateTime").getValue();
						} catch (ex) {
							// console.warn("pxCreateDateTime and pxUpdateDateTime missing for work object.");
						}

						if (clientWorkPage.get("pxInsName"))
							actionData.pxInsName = clientWorkPage.get("pxInsName").getValue();
						if (clientWorkPage.get("pzInsKey"))
							actionData.pzInsKey = clientWorkPage.get("pzInsKey").getValue();
						if (clientWorkPage.get("pxObjClass"))
							actionData.pyWorkPage.pxObjClass = clientWorkPage.get("pxObjClass").getValue();

						// Needs to be changed when WW implements the WO save action
						var actionMetaData = {
							"action": "saveItem",
							"insHandle": actionData.pzInsKey
						};
						var isServerAvailable = pega.ui.ClientCache.find("pxRequestor.pzIsPegaServerAvailable");
						if (!isCaseOffline && (isServerAvailable && isServerAvailable.getValue() == "false")) {
							var cannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");
							alert(cannotPerformWhenOffline);
							if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
								pega.ui.DCUtil.cancelTransition();
							}
							return;
						}
						pega.offline.clientstorehelper.recordAction(pega.offline.clientstorehelper.TYPES.WORKITEM, actionData.pxInsName, actionMetaData, actionData, function() {
							// console.info("createNewWork: action recorded successfully!");
						}, function() {
							// console.error("createNewWork: action failed to record!!");
						});
					}
					pega.ui.rdlMasterDetails.invokePostMasterDetailEdit(rowPage);
					// ReloadSection successCallback to call showDetails
					var rdlDetailsCallback = function() {
						if (isWOBoundRDL) {
							//Empty the packagedPage and copy the row data into it
							var packagedPage = pega.ui.ClientCache.find(packagedPageName);
							var rowPage = pega.ui.ClientCache.find(primaryPgName);
							packagedPage && packagedPage.adoptJSON(rowPage.getJSON());
						}

						pega.clientTools.putParamValue("bRDLShowDetails", false);

						var rdlRowEvent = {
							"target": rdlRow,
							"refreshShowDetails": true
						};

						pega.ui.rdlMasterDetails.showDetails(rdlRowEvent);
					};

					pega.clientTools.putParamValue("bRDLShowDetails", true);
					pega.u.d.reloadSection(rdlRowSection, '', '', false, false, '', false, null, null, null, rdlDetailsCallback, {
						contextParams: {
							packagedContext: packagedPageName,
							runtimeContext: primaryPgName
						}
					});
				},
				cancel: function() {
				}
			};
		}
	},
	augmentCallbackForRDLDetails_Online: function(callbackObj) {
		return {
			submit: function(responseObj) {

				var response = responseObj.responseText;
				if (response.indexOf("COMMIT") == -1 || response.indexOf("RDLROWMARKUP_BEGIN") == -1 || response.indexOf("RDLROWMARKUP_END") == -1)
					return;
				// Escape
				response = response.replace(/>\s+</g, '><');
				var rowStream = response.match(/RDLROWMARKUP_BEGIN\|\|([\s\S]*)\|\|RDLROWMARKUP_END/); // BUG-283216 - Line terminators are not being considered so changed the regex to include everything.
				var resArr = response.split("||"), wojson;
				for (var i = 0; i < resArr.length; i++) {
					if (resArr[i] == "WOJSON") {
						wojson = resArr[i + 1];
						break;
					}
				}
				if (!rowStream || !rowStream[1]) /* BUG-373842: In case of server side visible when, the row markup itself will not be returned, added a null check for the same */
					return;
				rowStream = rowStream[1];
				var activeRDLMetaInfo = pega.ui.rdlMasterDetails.getActiveRDLMetaInfo();
				var rowNode = activeRDLMetaInfo.rowNode;
				var isOnlineWOBound = activeRDLMetaInfo.isOnlineWOBound;
				var RDLNode = activeRDLMetaInfo.RDLNode;

				var rdlRowEventObject = {
					"target": rowNode,
					"refreshShowDetails": true,
					"isOnlineWOBound": isOnlineWOBound
				};
				var callback = function(rdlRowEventObject) {
					return function() {
						pega.u.d.loadHTMLEleCallback(rowNode);
						pega.u.d.gBusyInd.hide();
						pega.ui.rdlMasterDetails.showDetails(rdlRowEventObject);
						if (wojson) {
							pega.u.d.upmergeRowPage(wojson);
						}
					}
				};
				/* BUG-231049: Issue with embedded list.
				START - Get the inner markup from row. Ex: <RDL_ROW_Markup> inner markup </RDL_ROW_Markup> */
				var tempDiv = document.createElement("div");
				tempDiv.innerHTML = rowStream;
				rowStream = pega.util.Dom.getFirstChild(tempDiv).innerHTML;
				/* END */
				// Bind the response
				pega.u.d.loadDOMObject(rowNode, rowStream, callback(rdlRowEventObject));
			},
			cancel: function() {
			}
		};
	},

	augmentCallbackForRDLDetails_HCOnline: function(callbackObj) {
		return {
			submit: function(responseObj) {
				/* Updating the row page in the ClientCache*/
				var packagedPageName = pega.ui.DataRepeaterUtils.getPackagedPageName();
				var isWOBoundRDL = false;
				var rdlRow = pega.ui.rdlMasterDetails.getActiveRow();
				var primaryPgName = rdlRow.getAttribute("base_ref");
				var rdlNode = pega.ui.rdlMasterDetails.getEnclosingRL(rdlRow);
				var dataSource = rdlNode ? rdlNode.getAttribute("data-repeat-source") : null;
				var rdlRowSection = rdlRow ? rdlRow.querySelector("#RULE_KEY") : null;

				// Check if the RDL is WorkObject bound and update the row page with the data from the temp page
				var rdlClassFamily = pega.ui.rdlMasterDetails.getRDLClassFamily(rdlNode);
				isWOBoundRDL = (rdlClassFamily && rdlClassFamily.toUpperCase() == "WORK") ? true : false;
				/* Refreshing the secondary details via showdetails*/
				var response = responseObj.responseText;
				response = response.replace(/>\s+</g, '><');
				var resArr = response.split("||"), wojson;
				for (var i = 0; i < resArr.length; i++) {
					if (resArr[i] == "WOJSON") {
						wojson = resArr[i + 1];
						break;
					}
				}

				var isDestinationLocal = pega.u.d.ServerProxy.isDestinationLocal();
				var currentThread = pega.u.d.getThreadName();
				var baseThreadName = pega.u.d.baseThreadName;
				if (!isDestinationLocal) {
					pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.LOCAL);
					pega.u.d.switchThread(baseThreadName);
				}

				var rowPage = pega.ui.ClientCache.find(primaryPgName);
				if (isWOBoundRDL) {
					//It is expected that the response contains the WO JSON
					var packagedPg = pega.ui.ClientCache.createPage(packagedPageName);
					packagedPg.adoptJSON(wojson);
					pega.ui.DataRepeaterUtils.mergePage(primaryPgName, packagedPageName);
					// Copy the row page onto packaged page
					packagedPg.adoptJSON(rowPage.getJSON());
				}
				pega.ui.rdlMasterDetails.invokePostMasterDetailEdit(rowPage);
				var activeRDLMetaInfo = pega.ui.rdlMasterDetails.getActiveRDLMetaInfo();
				var rowNode = activeRDLMetaInfo.rowNode;
				var isOnlineWOBound = activeRDLMetaInfo.isOnlineWOBound;

				// ReloadSection successCallback to call showDetails
				var rdlDetailsCallback = function() {
					var rdlRowEventObject = {
						"target": rowNode,
						"refreshShowDetails": true,
						"isOnlineWOBound": isOnlineWOBound
					};
					if (!isDestinationLocal) {
						pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
						pega.u.d.switchThread(currentThread);
					}
					pega.ui.rdlMasterDetails.showDetails(rdlRowEventObject);
				};
				pega.u.d.reloadSection(rdlRowSection, '', '', false, false, '', false, null, null, null, rdlDetailsCallback);
			},
			cancel: function() {
			}
		};
	},

	upmergeRowPage: function(wojson) {
		var threadName = pega.u.d.baseThreadName;
		var currThread = pega.u.d.getThreadName();
		if (pega && pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.isActionFromNonOsco) {
			threadName = "NONOSCOThread";
		}
		pega.u.d.switchThread(threadName);
		var tempPage = pega.ui.ClientCache.createPage("tempShowStreamWorkPage");
		tempPage.adoptJSON(wojson);
		var rdlRow = pega.ui.rdlMasterDetails.getActiveRow();
		var primaryPgName = rdlRow.getAttribute("base_ref");
		pega.ui.DataRepeaterUtils.mergePage(primaryPgName, "tempShowStreamWorkPage");
		pega.u.d.switchThread(currThread);
	},
	/*
	 @public wrapper for processAction and doFormSubmit.
	 */
	takeAction: function(taskStatus, taskIndex, streamType, uiRef, uiType, ele, event) {
		var typeRefSpanArray = pega.util.Dom.getElementsById("pzFlowActionUITypeRef", document, "span");
		if (typeRefSpanArray)
			var arrLength = typeRefSpanArray.length;
		var actionFound = false;
		if (typeRefSpanArray) {
			for (var index = 0; index < arrLength; index++) {
				var typeRefSpan = typeRefSpanArray[index];
				if (typeRefSpan && typeRefSpan.getAttribute("uiref") == uiRef && typeRefSpan.getAttribute("uitype") == uiType && !actionFound) {
					actionFound = true;
					/* BUG-119479 replaced next two lines from document.all to a jquery call. document.all is not supported in Firefox */
					$(document).find('[name="TaskStatus"]').val(taskStatus);
					$(document).find('[name="TaskIndex"]').val(taskIndex);
					doFormSubmit('pyActivity=FinishAssignment', ele, 'Submitting...', event);
				}
			}
		}
		if (!actionFound) {
			var actionURL = new SafeURL();
			actionURL.put("IgnoreSectionSubmit", true);
			processAction(taskStatus, taskIndex, streamType, "", "", "", event, null, actionURL);
		}
	},

	/*
	 @public Process clicks on action buttons or action links or selcting the FA from drop down. A url is formed and submitted to the server to show the Flow Action
	 @Handler
	 @param $Object$actionURL contains the parameters that are to be passed in the url.
	 @return $void$
	 */
	processActionDefault: function(actionURL, event) {
		var harCtxMgr = pega.ui.HarnessContextMgr;
		var taskStatus = actionURL.get("NewTaskStatus");
		var taskIndex = actionURL.get("TaskIndex");
		var streamType = actionURL.get("StreamType");
		var prevTaskIndex = actionURL.get("PrevTaskIndex");
		var prevTaskStatus = actionURL.get("PrevTaskStatus");

		if (typeof (actionSection) != 'undefined') {
			if (actionSection == 'ActionSection_ScreenFlow') {
				alert(LocalNotInScreen);
				return;
			}
			actionURL.put("ActionSection", actionSection);
		}

		var actionParams = actionURL.toQueryString();
		var oCloseURL = SafeURL_createFromURL(pega.u.d.url);

		if (typeof (handleResubmit) == 'function') {
			var bSubmit = true;
			actionURL = "&pyActivity=ProcessAction" + "&" + actionParams;
			if (typeof (streamClass) != 'undefined') {
				actionURL += "&StreamClass=" + streamClass;
			}
			if (typeof (bSubmitAction) != 'undefined') {
				bSubmit = bSubmitAction;
			}
			if (bSubmit) {
				if (typeof (actionSection) != 'undefined' && actionSection == "Action_Buttons_Frame") {
					if (bClientValidation && (typeof (validation_validate) == "function") && !validation_validate()) {
						alert(form_submitCantProceed);
						return;
					}
					actionURL += "&bHarnessClientVal=" + bClientValidation;
				}
				handleResubmit(taskIndex, actionURL);
			} else {
				//window.frameElement.contentWindow.navigate(strCloseUrl +actionURL)
				//window.frameElement.src = oCloseURL.toURL()  +actionURL;
				//Create a safe url by merging oCloseURL and actionURL
				oCloseURL.copy(SafeURL_createFromURL(actionURL), false);
				//Create encrypted url.
				window.frameElement.src = oCloseURL.toURL();
			}
		} else {
			// find the action section
			var actionIframe = window.frames.actionIFrame;
			// if action found invoke processAction in action section
			if (actionIframe != 'undefined' && actionIframe != null) {
				//actionIframe.processAction(taskStatus, taskIndex, streamType,event);
				actionIframe.processAction(taskStatus, taskIndex, streamType, prevTaskIndex, prevTaskStatus, false, event);
			} else {
				// may be the action is not in an iframe
				var flowActionHTML = pega.ctx.dom.getElementById("pyFlowActionHTML");
				var bSectionSubmit = true;
				//HFix-20543 : start
				if (typeof (actionSection) != 'undefined' && actionSection != "") {
					//HFix-20543 : end
					var currentDocRootDom = pega.ctx.dom.getContextRoot();
					flowActionHTML = pega.u.d.getSectionByName(actionSection, "", currentDocRootDom);
					if (pega.ctx.isMDC) {
						flowActionHTML = pega.u.d.getSectionByName(actionSection, "", currentDocRootDom);
					}
					if (typeof (bSubmitAction) != 'undefined') {
						bSectionSubmit = bSubmitAction;
					} else {
						bSectionSubmit = false;
					}
				}
				if (pega.ctx.isMDC && actionSection == "") {
					flowActionHTML = pega.ctx.dom.querySelector("div[id=pyFlowActionHTML]");
				}
				if (flowActionHTML) {// reload the entire form now because we don't know which section to reload
					actionURL.put("TaskStatus", taskStatus);
					actionURL.put("HarnessMode", harCtxMgr.get('strHarnessMode'));
					var readOnly = this.getReadOnlyValue(event);
					actionURL.put("ReadOnly", readOnly);
					if (taskIndex != "" && typeof (actionSection) == 'undefined') {
						this.reloadForm(actionURL.toQueryString(), "", "", event);
					} else {
						var newActionSection = flowActionHTML;
						var actionSectionFail = false;
						while ((newActionSection.id != "RULE_KEY") || (newActionSection.getAttribute("node_type") != "MAIN_RULE")) {
							newActionSection = newActionSection.parentNode;
							if (newActionSection == null) {
								/* If reload element is not found set the reloadFail to true to set form submit*/
								actionSectionFail = true;
								break;
							}
						}
						if (actionSectionFail == true) {
							this.reloadForm(actionURL.toQueryString(), "", "", event);
						} else {
							var strActionSection = newActionSection.getAttribute("node_name");
							var strStreamClass = newActionSection.getAttribute("objclass");
							actionURL.put("StreamClass", strStreamClass);
							actionURL.put("ActionSection", strActionSection);
							actionURL.put("NO_HTML", true);
							/*This is used in ProcessAction activity to avoid stream overriding */

							var bIgnoreSectionSubmitParam = actionURL.get("IgnoreSectionSubmit");
							// Set from the new takeAction API impl
							/* HFix-23246: added empty string check for actionSection to skip validation when we switch between flow actions */
							if (!bIgnoreSectionSubmitParam && bSectionSubmit && typeof (actionSection) != 'undefined' && actionSection != "") {
								if (bClientValidation && (typeof (validation_validate) == "function") && !validation_validate()) {
									alert(form_submitCantProceed);
									return;
								}
								actionURL.put("bHarnessClientVal", bClientValidation);
							}

							if (streamType == "NO_UI" && (bIgnoreSectionSubmitParam || bSectionSubmit) && typeof (actionSection) != 'undefined') {
								actionURL.put("pyActivity", "ProcessAction");
								actionURL.put("Submit_NOUI", true);
								try {
									if (pega && pega.ctx && pega.ctx.isMDC) {
										var formElem = pega.u.d.getFormElement();
										var strNewUrl = SafeURL_createFromEncryptedURL(formElem.action);
										strNewUrl.copy(SafeURL_createFromEncryptedURL(actionURL.toQueryString()), true);
										postSubmitData = pega.u.d.getQueryString(formElem);
										pega.ui.MDCUtil.microDCRenderer(strNewUrl, postSubmitData, true);
									} else {
										var strNewUrl = SafeURL_createFromEncryptedURL(document.main.action);
										strNewUrl.copy(SafeURL_createFromEncryptedURL(actionURL.toQueryString()), true);
										document.main.action = strNewUrl.toURL();
										/* Added to avoid submitting placeholder value while reloading the harness : START */
										pega.control.PlaceHolder.removePlaceHolderValues(document.main);
										/* Added to avoid submitting placeholder value while reloading the harness : END */
										pega.u.d.fixBaseThreadTxnId();
										pega.u.d.disableMDCFieldSets(document.main);
										 if(pega.ctx.bIsDCSPA){
                      doFormSubmit(strNewUrl, event, strSaveText, event);
                    }else{
                      document.main.submit();
                    }
									}
								} catch (e) {
								}
							} else {
								this.reloadSection(flowActionHTML, "ProcessAction", actionURL.toQueryString(), false, bSectionSubmit, "", undefined, event);
							}
						}
					}
				} else {
					// else report error
					alert(NotInAction);
				}
			}
		}
	},

	/*
	 @private ensure pre conditions to submit are met and no client error exist
	 @param $Object$ container is the DOM element under which the input element will be considered for client validation
	 @return $boolean$ true if submit can proceed otherwise false
	 */
	shouldSubmitProceed: function(event, container) {
		if (this.processOnBeforeSubmit(false, container) == false)
			return false;
		if (typeof (bClientValidation) != "undefined") {
			if (bClientValidation && (typeof (validation_validate) == "function") && !validation_validate(container)) {
         var overLay = document.getElementById("_popOversContainer");
         var modalOverlay = document.getElementById("modalOverlay");
				if (typeof (customClientErrorHandler) != "undefined") {
					var exit = customClientErrorHandler();
					if (exit) {
						if (event) {
							pega.util.Event.stopEvent(event);
              if(modalOverlay && modalOverlay.style.display !== "none") {
                  docFocus.focusToFirstInvalidField(modalOverlay);
              }
              if(overLay) {
                  docFocus.focusToFirstInvalidField(overLay);
              }
						}
						this.resetReadOnlyValues();
						return false;
					}
				} else {
					alert(form_submitCantProceed);
					if (event) {
						pega.util.Event.stopEvent(event);
            if(modalOverlay && modalOverlay.style.display !== "none") {
              docFocus.focusToFirstInvalidField(modalOverlay);
            }
            if(overLay ) {
              docFocus.focusToFirstInvalidField(overLay);
            }
					}
					this.resetReadOnlyValues();
					return false;
				}
			}
		}
		return true;
	},

	/*
	 @private -
	 @return $void$
	 */
	submitWhenFail: function(preActivity, preActivityParams, strDisplayHarnessParms, preDataTransform, preDataTransformParams, bDoNotSubmitData, actDTPage, event) {
		var hcm = pega.ui.HarnessContextMgr;
		if (hcm.get("bWarnBeforeChangingWindow") == true && !showDialogForWindowChange())
			return;
    var formElem = pega.u.d.getFormElement();	
		if (document.forms.length > 0 || pega.u.d.checkForAC(formElem)) {
			pega.u.d.setBusyIndicator();
			pega.u.d.hideBusyIndicatorForMDCRefresh = true;
			var noForms = document.forms.length;
      if(pega.u.d.checkForAC(formElem)){	
        noForms = 1;	
      }
			var harnessId = $("#pzHarnessID").attr("value");
			if (pega && pega.ui && pega.ui.HarnessContextMgr && pega.ui.HarnessContextMgr.get("isMDC")) {
				var mdcName = pega.ui.HarnessContextMgr.get("mdcName");
				harnessId = document.querySelector("div[data-mdc-id='" + mdcName + "']").getAttribute("data-harness-id");
			}
			for (var i = 0; i < noForms; i++) {
				if (formElem.getAttribute("name") == "main") {/*BUG-187157 changed document.forms[i].name to use getAttribute*/
					var strNewUrl = SafeURL_createFromEncryptedURL(formElem.action);
					strNewUrl.put("pyActivity", "ReloadHarness");
					if (!hcm.get("bIsDCSPA")) {
						if (pega.u.template && pega.u.template.utility) {
							strNewUrl.put("PagesToRemove", pega.u.template.utility.getHarnessCleanUpPages(harnessId));
						}
					}
					pega.u.d.checkAndUpdateTargetParam(strNewUrl);
					if (hcm.get("KeepPageMessages") == "true") {
						strNewUrl.put("pzKeepPageMessages", "true");
					}
					if (preDataTransform) {
						strNewUrl.put("PreDataTransform", preDataTransform);
						if (preDataTransformParams) {
							try {
								var preDataTransformParamsObj = JSON.parse(preDataTransformParams);
								var staticDTParams = "";
								var dynamicDTParams = "";
								if (preDataTransformParamsObj) {
									staticDTParams = preDataTransformParamsObj.sp;
									dynamicDTParams = preDataTransformParamsObj.dp
									if (staticDTParams) {
										strNewUrl.put("StaticDataTransformParams", encodeURIComponent(staticDTParams));
									}
									if (dynamicDTParams) {
										strNewUrl.put("DynamicDataTransformParams", encodeURIComponent(dynamicDTParams));
									}
								}
							} catch (e) {
								strNewUrl.put("DataTransformParams", encodeURIComponent(preDataTransformParams));
							}

						}
					}
					else {
						strNewUrl.put("PreDataTransform", "");
					}

					if (preActivity) {
						strNewUrl.put("PreActivity", preActivity);
						if (preActivityParams) {
							//strNewUrl.copy(SafeURL_createFromEncryptedURL( preActivityParams), true);
							if (preActivityParams) {
								try {
									var preActivityParamsObj = JSON.parse(preActivityParams);
									var staticActParams = "";
									var dynamicActParams = "";
									if (preActivityParamsObj) {
										staticActParams = preActivityParamsObj.sp;
										dynamicActParams = preActivityParamsObj.dp
										if (staticActParams) {
											strNewUrl.put("StaticActivityParams", encodeURIComponent(staticActParams));
										}
										if (dynamicActParams) {
											strNewUrl.put("DynamicActivityParams", encodeURIComponent(dynamicActParams));
										}
									}
								} catch (e) {
									strNewUrl.put("ActivityParams", encodeURIComponent(preActivityParams));
								}

							}

						}
						if (strNewUrl.get("pyActivity") == strNewUrl.get("PreActivity")) {
							strNewUrl.put("PreActivity", "");
						}
					}
					else {
						strNewUrl.put("PreActivity", "");
					}
					if (actDTPage) {
						strNewUrl.put("ActDTPage", actDTPage);
					}
					var strHarnessMode = hcm.get('strHarnessMode');
					if (strHarnessMode) {
						strNewUrl.put("HarnessMode", strHarnessMode);
					}
					if (strNewUrl.get("pzPrimaryPageName") == false) {
						strNewUrl.put("pzPrimaryPageName", hcm.get("primaryPageName"));
					}
					if (hcm.get('bIsDCSPA')) {
						strNewUrl.put("pyIsSPA", "true");
					}
          if(!(pega.offline) && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
            strNewUrl.put("isRemoteCase", "true");
          }

					// inform test and performance monitor that action in flight
					pega.ui.statetracking.setNavigationBusy("/abc?" + strNewUrl.toUnencodedQueryString());

					var complexElements = pega.u.d.getHarnessElements(false, false, true);
					var len = complexElements.length;
					for (var i = 0; i < len; i++) {
						var ele = complexElements[i].element;
						if (ele && typeof ele.isRichTextEditor != undefined && ele.isRichTextEditor == true && typeof ele.preSubmitFunction != undefined) {
							if (ele.preSubmitFunction(ele) == false)
								return false;
						}
						if (ele && ele.id != null && ele.id.substring(0, 3) == "L2L" && ele.ID_SOURCE != null && ele.ID_TARGET != null && typeof ele.doBeforeSubmit == "function") {
							ele.doBeforeSubmit(ele);
						}
						if (ele && ele._select && pega.util.Dom.get(ele._select) && (pega.util.Dom.get(ele._select).getAttribute("msid") == "select-multiple"))
							ele.doBeforeSubmit(ele);
					}

					formElem.action = strNewUrl.toURL();
					/* Added to avoid submitting placeholder value while reloading the harness : START */
					pega.control.PlaceHolder.removePlaceHolderValues(formElem);
					/* Added to avoid submitting placeholder value while reloading the harness : END */
					/* Added to avoid submitting readonly formatted values while reloading the harness : START */
					pega.u.d.removeReadOnlyFormatValues(formElem);
					/* Added to avoid submitting readonly formatted value while reloading the harness : END */
					/* Added to avoid submitting invalid value when disabled checkbox : START */
					pega.u.d.processCheckboxHiddenElements(formElem);
					/* Added to avoid submitting invalid value for disabled checkbox : END */
					pega.u.d.processCustomTimezonedDateTimeElements(formElem); /* BUG-503638 Added to update the currect date time in operating timezone, when custom timezone is configurred. */
					pega.u.d.fixBaseThreadTxnId();
					/*Added for Refresh Harness support for not submitting the form data*/
					if (bDoNotSubmitData) {
						var tempFormEle = document.createElement("FORM");
						tempFormEle.name = "TempForm";
						tempFormEle.method = "POST";
						if (pega.ctx.dom.querySelector("#PEGA_HARNESS")) {
							pega.ctx.dom.querySelector("#PEGA_HARNESS").appendChild(tempFormEle);
							var newURL = SafeURL_createFromEncryptedURL(formElem.action);
							if (newURL) {
								/*delete newURL.hashtable["pzTransactionId"];*/
								/* BUG-218280: Skip hidden elements when Refresh is called without Submit */
								var queryString = pega.u.d.getHiddenEltsAsSafeURL(document, true);
								newURL.copy(queryString);
								tempFormEle.action = newURL.toURL();
							}
							hcm.set("gDirtyOverride", false);
							if (hcm.get("isMDC")) {
								var postSubmitData = pega.u.d.getQueryString(tempFormEle);
								pega.ui.MDCUtil.microDCRenderer(newURL, postSubmitData, true);
							} else if (hcm.get("bIsDCSPA")) {
								newURL.put("isURLReady", "true");
								newURL.put("skipHistoryUpdation", "true");
								pega.u.d.UIActionRouter.singlePageRenderer(newURL);
							}
							else {
								tempFormEle.submit();
							}

						}
					} else {
						hcm.set("gDirtyOverride", false);
            /*BUG-766839*/
						if (formElem.getAttribute("name") == "main" && formElem.getAttribute("submitting") == null) {/* Bug fix for HFIX-84753 */
							if (pega.offline) {
								doFormSubmit(strNewUrl, event, strSaveText, event);
							} else {
								if (hcm.get("isMDC")) {
									var postSubmitData = pega.u.d.getQueryString(formElem);
									pega.ui.MDCUtil.microDCRenderer(strNewUrl, postSubmitData, true);
								} else if (hcm.get("bIsDCSPA")) {
									strNewUrl.put("isURLReady", "true");
									strNewUrl.put("skipHistoryUpdation", "true");
                  strNewUrl.put("skipInputFieldClientValidation", "true");
									doFormSubmit(strNewUrl, event, strSaveText, event);
									//pega.u.d.UIActionRouter.singlePageRenderer(strNewUrl);
								}
								else {
                  formElem.setAttribute("submitting", "true");
									pega.u.d.disableMDCFieldSets(formElem);
                  formElem.submit();
								}

							}
						}
					}
					break;
				} else if (formElem.name == "actionForm") {
					var strNewUrl = new SafeURL();
					if (pega.u.template && pega.u.template.utility) {
						strNewUrl.put("PagesToRemove", pega.u.template.utility.getHarnessCleanUpPages(harnessId));
					}
					/* Added to avoid submitting placeholder value while reloading the harness : START */
					pega.control.PlaceHolder.removePlaceHolderValues(document.actionForm);
					/* Added to avoid submitting placeholder value while reloading the harness : END */
					if (preDataTransform) {
						strNewUrl.put("PreDataTransform", preDataTransform);
						if (preDataTransformParams) {
							strNewUrl.put("DataTransformParams", preDataTransformParams);
						}
					}
					if (preActivity) {
						strNewUrl.put("preActivity", preActivity);
						if (preActivityParams) {
							strNewUrl.copy(SafeURL_createFromEncryptedURL(preActivityParams), true);
						}
					}
					if (strDisplayHarnessParms) {
						strNewUrl.copy(SafeURL_createFromEncryptedURL(strDisplayHarnessParms), true);
					}
					reSubmit(strNewUrl.toQueryString());
					break;
				}
			}
			//SE-26905 / BUG-240329 : Commented hide call in submitWhenFail API as it is hiding busy indicator.
			if (pega.ctx.SubmitInProgress === false || (document.main && document.main.target && document.main.target != "_self")) {
				pega.u.d.gBusyInd.hide();
				if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
					pega.ui.DCUtil.cancelTransition();
				}
			}
		}
	},
	/*
	 @protected submits the section content. after submit invoked the callback method passed as a argument
	 @param $Object$submitObject - JS object passed to this function contains parentDiv, onAfterSubmit, onAfterCancel
	 @return $void$
	 */
	submitSection: function(event, submitObject) {
		if (submitObject && submitObject.parentDiv) {
			if (!pega.u.d.shouldSubmitProceed(event, submitObject.parentDiv))
				return;
		}
		pega.util.Event.stopPropagation(event);
		pega.util.Event.preventDefault(event);
		var parentDiv = submitObject.parentDiv;
		var onAfterSubmit = submitObject.onAfterSubmit;
		var onAfterCancel = submitObject.onAfterCancel;
		var bShowAsModal = submitObject.bShowAsModal;
		var streamName = submitObject.streamName;
		var specialButtons = submitObject.specialButtons;
		var includedStreamName = submitObject.includedStreamName;
		var sectionOnly = submitObject.sectionOnly;
		var sectionParams = submitObject.sectionParams;
		var queryString = "";

		/* get the list of button(submit, cancel, specialbuttons) in the section/modaldialog and disablethem.*/
		var buttons = parentDiv.getElementsByTagName("BUTTON");
		if (buttons && buttons.length > 0) {
			var btnLen = buttons.length;
			for (var i = 0; i < btnLen; i++) {
				buttons[i].disabled = true;
			}
		}

		var oSafeURL = SafeURL_createFromURL(pega.u.d.url);
		oSafeURL.put("pyActivity", "SubmitSection");
		oSafeURL.put("FormError", pega.u.d.formErrorType);
		oSafeURL.put("FieldError", pega.u.d.fieldErrorType);
		oSafeURL.put("pyCustomError", pega.u.d.pyCustomError);
		if (sectionOnly === false)
			oSafeURL.put("WithSubmitButton", "true");
		else
			oSafeURL.put("WithSubmitButton", "false");
		if (sectionOnly)
			oSafeURL.put("sectionOnly", sectionOnly);
		oSafeURL.put("StreamName", streamName);
		if (includedStreamName)
			oSafeURL.put("includedStreamName", includedStreamName);
		if (sectionParams) {
			for (var param in sectionParams) {
				oSafeURL.put(param, sectionParams[param]);
			}
		}
		oSafeURL.put("UsingPage", "true");
		var pageName = submitObject.pageName;
		if (pageName && pageName != "") {
			oSafeURL.put("reloadPage", pageName);
		}
		if (specialButtons) {
			var length = specialButtons.length;
			var buttonLabels = "";
			var caption = "";
			for (var i = 0; i < length; i++) {
				caption = specialButtons[i].caption;
				if (caption && caption != "") {
					buttonLabels += caption + ",";
				}
			}
			oSafeURL.put("specialButtons", buttonLabels);
		}
		var reloadElement = pega.util.Dom.getElementsById("RULE_KEY", parentDiv);
		if (reloadElement && reloadElement.length > 0) {
			reloadElement = reloadElement[0];
			queryString = pega.u.d.getQueryString(reloadElement);
		} else {
			alert("section content not found to submit.");
			return;
		}
		var label = submitObject.label;
		var bClose = submitObject.bClose;
		var callback = {
			success: function(oResponse) {
				var parentDiv = oResponse.argument[0];
				var onAfterSubmit = oResponse.argument[1];
				var onAfterCancel = oResponse.argument[2];
				var bShowAsModal = oResponse.argument[3];
				var streamName = oResponse.argument[4];
				var pageName = oResponse.argument[5];
				var strResponse = oResponse.responseText;
				var label = oResponse.argument[6];
				var bClose = oResponse.argument[7];
				var specialButtons = oResponse.argument[8];
				var includedStreamName = oResponse.argument[9];
				var sectionOnly = oResponse.argument[10];
				var sectionParams = oResponse.argument[11];

				if (strResponse == "SUCCESS") {
					if (bClose) {
						parentDiv.style.display = "none";
						if (bShowAsModal) {
							if (pega.util.Event.isIE)
								pega.u.d.modalDialog.cfg.setProperty("height", "0");
							pega.u.d.removeModalBtnListeners(parentDiv);
							pega.u.d.hideModalWindow();
						}
					}
					if (onAfterSubmit)
						onAfterSubmit(label);
					pega.u.d.resizeHarness();
					pega.u.d.gBusyInd.hide();
				} else {
					var returnNode = document.createElement("DIV");
					returnNode.innerHTML = strResponse;
					pega.u.d.gCallbackArgs = {
						parentDiv: parentDiv,
						onAfterSubmit: onAfterSubmit,
						onAfterCancel: onAfterCancel,
						bShowAsModal: bShowAsModal,
						streamName: streamName,
						pageName: pageName,
						specialButtons: specialButtons,
						includedStreamName: includedStreamName,
						sectionOnly: sectionOnly,
						sectionParams: sectionParams
					}
					var callback = function() {
						var callbackArgs = pega.u.d.gCallbackArgs;
						pega.u.d.loadHTMLEleCallback(callbackArgs.domObj);
						if (callbackArgs.bShowAsModal) {
							pega.u.d.focusFirstElement(pega.u.d.modalDialog.innerElement.id);
						}
						var paramObj = {
							parentDiv: callbackArgs.parentDiv,
							onAfterSubmit: callbackArgs.onAfterSubmit,
							onAfterCancel: callbackArgs.onAfterCancel,
							bShowAsModal: callbackArgs.bShowAsModal,
							streamName: callbackArgs.streamName,
							pageName: callbackArgs.pageName,
							specialButtons: callbackArgs.specialButtons,
							label: "",
							bClose: true,
							includedStreamName: callbackArgs.includedStreamName,
							sectionOnly: callbackArgs.sectionOnly,
							sectionParams: callbackArgs.sectionParams
						};
						pega.u.d.attachModalBtnListeners({
							submitClickApi: pega.u.d.submitSection,
							cancelClickApi: pega.u.d.cancelSection
						}, paramObj);
						if (bShowAsModal) {
							pega.u.d.attachCloseBtnListeners({
								closeBtnApi: pega.u.d.cancelSection
							}, paramObj);
						}

						if (callbackArgs.specialButtons) {
							var button = null;
							var paramObj = null;
							var spButton = null;
							var length = callbackArgs.specialButtons.length
							for (var i = 0; i < length; i++) {
								spButton = callbackArgs.specialButtons[i];
								button = pega.util.Dom.getElementsById("Modal" + spButton.caption, callbackArgs.parentDiv);
								if (button && button.length > 0) {
									button = button[0];
									if (spButton.disable == true) {
										button.disabled = true;
									} else {
										button.disabled = false;
										paramObj = {
											parentDiv: callbackArgs.parentDiv,
											onAfterSubmit: callbackArgs.onAfterSubmit,
											onAfterCancel: callbackArgs.onAfterCancel,
											bShowAsModal: callbackArgs.bShowAsModal,
											streamName: callbackArgs.streamName,
											pageName: callbackArgs.pageName,
											specialButtons: callbackArgs.specialButtons,
											label: spButton.caption,
											bClose: spButton.close,
											includedStreamName: callbackArgs.includedStreamName,
											sectionOnly: callbackArgs.sectionOnly,
											sectionParams: callbackArgs.sectionParams
										};
										pega.util.Event.addListener(button, "click", pega.u.d.submitSection, paramObj, this);
									}
								}
							}
						}
						pega.u.d.gBusyInd.hide();
						if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.continueTransition) {
							pega.ui.DCUtil.continueTransition();
						}
						pega.u.d.gCallbackArgs = null;
					};
					var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", returnNode);
					if (onlyOnceEle && onlyOnceEle[0]) {
						pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
						onlyOnceEle[0].parentNode.removeChild(onlyOnceEle[0]);
					}

					if (bShowAsModal) {
						if (pega.util.Event.isIE)
							pega.u.d.modalDialog.cfg.setProperty("height", "0");
						pega.u.d.gCallbackArgs.domObj = pega.u.d.modalDialog.body;
						pega.u.d.setBusyIndicator(pega.u.d.modalDialog.body);

						var errrTableNode = pega.util.Dom.getElementsById("ERRORTABLE", returnNode);
						if (errrTableNode && errrTableNode[0]) {
							var errrTableNodeLen = errrTableNode.length;
							for (var i = 0; i < errrTableNodeLen; i++) {
								errrTableNode[i].parentNode.removeChild(errrTableNode[i]);
							}
						}
						pega.u.d.loadDOMObject(pega.u.d.modalDialog.body, returnNode.innerHTML, callback);
						returnNode.innerHTML = strResponse;
						var errorMarkers = pega.util.Dom.getElementsById("PegaRULESErrorFlag", document);

						/* Commenting out if condition for BUG-82322 */
						//if (!errorMarkers){

						this.handleFormErrors(returnNode);
						//}
					} else {
						pega.u.d.gCallbackArgs.domObj = parentDiv;
						pega.u.d.setBusyIndicator(parentDiv);
						pega.u.d.loadDOMObject(parentDiv, returnNode.innerHTML, callback);
					}
				}
			},
			failure: function(oResponse) {
			},
			scope: this,
			argument: [parentDiv, onAfterSubmit, onAfterCancel, bShowAsModal, streamName, pageName, label, bClose, specialButtons, includedStreamName, sectionOnly, sectionParams]
		};
		var request = pega.u.d.asyncRequest('POST', oSafeURL, callback, queryString);

	},

	/*
	 @protected hides the modal dialog. invoked from the cancel button on the modal dialog
	 @param $Object$cancelObject - JS object passed to this function contains parentDiv, onAfterSubmit, onAfterCancel
	 @return $void$
	 */
	cancelSection: function(event, cancelObject) {
		pega.util.Event.stopPropagation(event);
		pega.util.Event.preventDefault(event);
		var parentDiv = cancelObject.parentDiv;
		var onAfterCancel = cancelObject.onAfterCancel;
		var bShowAsModal = cancelObject.bShowAsModal;
		parentDiv.style.display = "none";
		if (bShowAsModal) {
			if (pega.util.Event.isIE)
				pega.u.d.modalDialog.cfg.setProperty("height", "0");
			pega.u.d.hideModalWindow();
		}
		if (onAfterCancel)
			onAfterCancel();
		pega.u.d.resizeHarness();
	},

	resetReadOnlyValues: function(parentDOM) {
		var inputElements = null;
		if (parentDOM == null || typeof (parentDOM) === "undefined") {
			inputElements = pega.u.d.getHarnessElements(true, false, false);
		}
		else {
			inputElements = parentDOM.getElementsByTagName("INPUT");
		}
		var len = 0;
		if (inputElements) {
			len = inputElements.length;
		}
		for (var i = 0; i < len; i++) {
			var ele = inputElements[i];
			if (ele && ele.type == "text" && ele.getAttribute("data-formatting") === "done" || ele.getAttribute("data-formatting") === "yes") {
				/*BUG-311735: If the error is there on date field itself then we shouldn't reset the field*/
				if (ele.name && typeof window.getErrorDB == 'function' && window.getErrorDB().isHavingError && window.getErrorDB().isHavingError(ele.name)) {
					continue;
				}
				//ele.setAttribute("data-formatting", "done");
				var originalValueStr = ele.getAttribute("data-value");
				var formattedValueStr = ele.getAttribute("data-display-value");
				if (originalValueStr != null && typeof (originalValueStr) != "undefined" && originalValueStr != "" && ele.value && originalValueStr == ele.value && formattedValueStr && formattedValueStr != "") {
					ele.value = formattedValueStr;
					ele.setAttribute("data-formatting", "done");
					ele.removeAttribute("data-display-value");
				}
			}
		}
	},

	/*
	 @Private - After clicking and before submitting the data this function get called
	 @return $boolean$
	 */

	processOnBeforeSubmit: function(clearAll, reloadElement, layouts2refresh) {
		var sectionIds = pega.u.d.getSectionIds(reloadElement);
		for (var i = 0; i < this.onSubmits.length; i++) {
			var onSubmitFunction = this.onSubmits[i];
			var contextObj = this.contextObjects[i];
			if (reloadElement && contextObj && contextObj.sectionId && contextObj.sectionId != "") {
				for (var j = 0; j < sectionIds.length; j++) {
					if (contextObj.sectionId == sectionIds[j]) {
						if (onSubmitFunction(contextObj) == false)
							return false;
					}
				}
			} else {
				if (onSubmitFunction(contextObj) == false)
					return false;
			}
		}
		if (clearAll == true) {
			this.onSubmits = new Array();
			this.contextObjects = new Array();
			this.gSubmitIdx = -1;
		}

		var complexElements = pega.u.d.getHarnessElements(false, false, true);
		var len = complexElements.length;
		for (var i = 0; i < len; i++) {
			var ele = complexElements[i].element;
			if (ele && typeof ele.isRichTextEditor != undefined && ele.isRichTextEditor == true && typeof ele.preSubmitFunction != undefined && (!reloadElement || $(reloadElement).has(ele.txtAreaEl).length)) {
				if (ele.preSubmitFunction(ele) == false)
					return false;
			}
		}
		var inputElements = pega.u.d.getHarnessElements(true, false, false);
		len = inputElements.length;
		for (var i = 0; i < len; i++) {
			var ele = inputElements[i];
			if (ele && ele.type == "checkbox") {
				var hiddenIpElement = pega.util.Dom.getPreviousSiblingBy(ele, function(node) {
					if (node.type == "hidden" && node.getAttribute('name') == ele.getAttribute('name')) {
						return true;
					}
					return false;
				});
				if (hiddenIpElement) {
					if (ele.checked) {
						hiddenIpElement.value = "true"
					} else {
						hiddenIpElement.value = "false";
					}
				}
			} else if ((typeof (reloadElement) == "undefined" || reloadElement == null || reloadElement == "") && ele && ele.type == "text") {
				try {
					var originalValueStr = ele.getAttribute("data-value") || ele.value;
					var customTimeZone = ele.getAttribute("data-custom-timezone");
					if (ele.getAttribute("data-formatting") === "yes" || ele.getAttribute("data-formatting") === "done") {
						if (typeof (originalValueStr) != "undefined" && originalValueStr != null) {
							if (ele.getAttribute("data-formatting") === "done") {
								ele.setAttribute("data-display-value", ele.value);
							}
							if (customTimeZone) {
								ele.value = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(originalValueStr, customTimeZone, pega.u.d.TimeZone);;
							} else {
								ele.value = originalValueStr;
							}
						}
					} else {
						if (customTimeZone && ele.value) {
              ele.setAttribute("originalValue",originalValueStr);
							ele.value = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(ele.value, customTimeZone, pega.u.d.TimeZone);;
						}
					}
				} catch (e) {
				}
			}
		}
		var elementToprocess = reloadElement;
		if (layouts2refresh) {
			elementToprocess = layouts2refresh;
		}
		if (typeof (elementToprocess) != "undefined") {
			$(elementToprocess).find('input[type="text"][data-formatting]').each(function() {
				try {
					var originalValueStr = this.getAttribute("data-value") || this.value;
					var customTimeZone = this.getAttribute("data-custom-timezone");
					if (this.getAttribute("data-formatting") === "yes" || this.getAttribute("data-formatting") === "done") {
						if (typeof (originalValueStr) != "undefined" && originalValueStr != null) {
							if (this.getAttribute("data-formatting") === "done") {
								this.setAttribute("data-display-value", this.value);
							}
							if (customTimeZone && !pega.u.d.ServerProxy.isDestinationLocal()) { // In offline case, conversion handled in convertToGMT API
								this.value = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(originalValueStr, customTimeZone, pega.u.d.TimeZone);
							} else {
								this.value = originalValueStr;
							}
						}
					}
				} catch (e) {
				}
			});
		}

		return true;
	},

	/*
	 @protected Do not do form submit for append/remove to pagelist/pagegroup
	 @return $boolean$
	 */

	submitForm: function() {
		return false;
	},

	/*
	 *  This api is used to show the FA when breadcrumb link is clicked
	 *  @param $actionParams - conatins the activity parameters
	 */
	reSubmit: function(actionParams) {
		var activityName = "";
		if (actionParams) {
			activityName = SafeURL_createFromEncryptedURL(actionParams).get("pyActivity");
		}
		if (activityName) {
			pega.u.d.submitWhenFail(activityName, actionParams);
		} else {
			pega.u.d.submitWhenFail();
		}
	},
	/* @api
	 Updates Harness Form (main) action attribute with Button/Icon/url Activity and submits Harness.  If the source is the ActionIframe the parents form is modified (main). If the source button is specified (and not an icon), disable it and (optionally) replace its label with strBusyText.
	 @param $String$strAction Content to be appended to form's action.
	 @param $Object$objButton Button element which fired this event
	 @param $String$strBusyText Replacement text for button label
	 @return $void$
	 */

	submit: function(strAction, objButton, strBusyText, event) {
		var hcm = pega.ui.HarnessContextMap;
		if (hcm.get("SubmitInProgress")) {
			return;
		}

		// Bug-269551/270924, flag to statetracker that submit in flight.  Must be set before first http call in submitwrapper. submitwrapper has many return paths, cannot easily set for only successfull path, -> set and reset
		//if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setFormsubmitBusy("  ?action="+strAction);

		var isSubmitInProgress = pega.u.d.submitWrapper(strAction, objButton, strBusyText, event);
		var formElem = pega.u.d.getFormElement();
		if (isSubmitInProgress && formElem && formElem.target == "" && !pega.offline) {
			hcm.set("SubmitInProgress", true);
		}

		// bug-338673 - do not go idle here for MD app, need to leave busy through frame doc reload. for SPA, http is busy
		//if (pega.ui.HarnessContextMgr && pega.ui.HarnessContextMgr.get('bIsDCSPA')) pega.ui.statetracking.setFormsubmitDone();
	},

	submitWrapper: function(strAction, objButton, strBusyText, event) {
		var hcm = pega.ui.HarnessContextMap;
		//Reset timeout(if applicable) everytime an AJAX call or Form Submit is done
		pega.desktop.support.restartTimeoutWarningTimer();
		if (pega.u && pega.u.NavigateTopHandler) {
			pega.u.NavigateTopHandler.formSubmit = true;
			//BUG-156346 : Updating pyFormPost to update url i.e. POST Requests url to openWorkByHandle
			var targetDocument = pega.u.d.getDocumentElement();
			if (targetDocument) {
				targetDocument.querySelector("#pyFormPost").value = "TRUE";
			}
		}

		//TADIMK : GRP-38044 modified submit api to support flow in modal
		if (pega.u.d.bModalDialogOpen) {
			var sectionTemplate = pega.util.Dom.getElementsById("RULE_KEY", pega.u.d.modalDialog.innerElement, "div");
			/*US-58245: Use flowModalTemplateName property for new templates */
			if (sectionTemplate && sectionTemplate[0] && (sectionTemplate[0].getAttribute("node_name") == "pyModalFlowTemplate" || sectionTemplate[0].getAttribute("node_name") == pega.u.d.flowModalTemplateName)) {
				return pega.u.d.launchFlow.submitModalAssignment(event);
			}
		}

		if (hcm.get("bWarnBeforeChangingWindow") == true && !showDialogForWindowChange())
			return false;
		if (typeof (strAction) == "string") {
			var oActionURL = SafeURL_createFromURL(strAction);
		} else {
			var oActionURL = strAction;
		}
		if (oActionURL.get("pzPrimaryPageName") == false) {
			oActionURL.put("pzPrimaryPageName", hcm.get("primaryPageName"));
		}

		if (pega.mobile.isMultiWebViewPegaMobileClient) {
			var wvUrl = SafeURL_createFromURL(window.location.href);
			var isRemoteCase = wvUrl.get("isRemoteCase");
			if (isRemoteCase === "true") {
				oActionURL.put("isRemoteCase", isRemoteCase);
			}
		}

		strAction = oActionURL.toQueryString();

		event = event == undefined ? window.event : event;
		//pega.util.Event.stopEvent(event);

		if (typeof (doFormSubmitCallback) != "undefined") {
			if (!doFormSubmitCallback(strAction, objButton, strBusyText)) {
				pega.util.Event.stopEvent(event);
				return false;
			}
		}
		var postFormData = true;
    if (oActionURL.get("skipInputFieldClientValidation") !== "true") {
     if (!strAction == "" && (hcm.get("bClientValidforReviewAction") || !(oActionURL.get("HarnessPurpose") && oActionURL.get("HarnessPurpose") == "Review"))) {
			//BUG-180237 : skip validation only if back button is clicked in screen flow
			if (!(oActionURL.get("pyActivity") == "GoToPreviousTask" && (oActionURL.get("previousAssignment") == "true" || oActionURL.get("previousEntryPoint") == "true" || oActionURL.get("skipValidations")))) {
				var container;
				if (pega.ctx.isMDC) {
					container = pega.u.d.getDocumentElement();
				}
				if (!pega.u.d.areInputsValid(event, container)) {
					this.resetReadOnlyValues();
					return false;
				}
			} else {
				postFormData = false;
			}
		 }   
    }

		if (this.processOnBeforeSubmit() == false)
			return false;

		//Please keep response as the last Parameter as it's being passed by pusing at the end to callbackparams by robotic automation script file
		var submitInner = function(strAction, objButton, strBusyText, event, response) {
			hcm = pega.ui.HarnessContextMap;
			if (pega.u.d.ServerProxy.isDestinationLocal()) {
				var parentElem = pega.u.d.getDocumentElement();

				$(parentElem).find('input[data-ctl="[\\\"DatePicker\\\"]"]').each(function() {
					var tempValue = this.value;
					if (!tempValue) return;
					try {

						if (this.parentNode && this.parentNode.tagName && this.parentNode.tagName.toLowerCase() == 'span' && tempValue.indexOf('GMT') == -1) { // adding check if value is already in GMT
							this.value = pega.DateTimeUtil.convertDateTimeToGMT(tempValue, this.parentNode);
						}
					} catch (e) {
						this.value = tempValue;
					}
				});
			}
			var formElement = pega.u.d.getFormElement();
			/*BUG-205704: Removed NoFrame check for setBusyState call as it was not triggering to disable buttons. Because of which on doing click before response is processed a Transaction Id mismatch was seen. */
			if (document.forms.length > 0 || pega.u.d.checkForAC(formElement)) {
				pega.u.d.setBusyState(objButton, strBusyText, null, event);
				if (pega.u.d.ServerProxy.isHybridClient()) {
					pega.u.d.setBusyIndicatorWithDelay(document.body, 300)
				} else {
					/* HFix-27599: In IE, with nested iframes case, from submit from inner adding busy indicator to outer iframes body
					which causing indefinite busy indicator(not calling hide) issue */
					if (pega.util.Event.isIE && document.frames && document.frames.name == "actionIFrame") {
						pega.u.d.setBusyIndicator(document.body);
					} else {
						pega.u.d.setBusyIndicator();
					}
				}
			}

			if (formElement && formElement.name == "actionForm") {
				oActionURL.put("HarnessMode", hcm.get("strHarnessMode"));
				oActionURL.put("TaskIndex", hcm.get("strTaskIndex"));
				oActionURL.put("HarnessPurpose", window.parent.document.getElementById("HarnessPurpose").value);
				/*HFix-20791, BUG-188703, start, check for presence of action iframe before setting the form submit target.*/
				if (!bActionIframe)
					formElement.target = "_parent";
				/*HFix-20791.BUG-188703, end*/
			}

			var formEle = formElement;
			var noOfForms = document.forms.length;
      // In ajax container use case we have fieldset, so we don't need to change form.
      if (noOfForms > 1 && !pega.ctx.isMDC) {
				var tempFormEle;
				for (var i = 0; i < noOfForms; i++) {
					tempFormEle = document.forms[i];
					if (tempFormEle.name == "main" || tempFormEle.name == "actionForm") {
						formEle = tempFormEle;
						break;
					}
				}
			}

			var strNewUrl = formEle ? SafeURL_createFromEncryptedURL(formEle.action) : "";

      if (oActionURL && strNewUrl !== "") {
        if (oActionURL.get("switchtoPOST")) {
          var oSafeReplaceCurrentURL = SafeURL_createFromURL(pega.ctx.url);
          oSafeReplaceCurrentURL.put("pyActivity", "@baseclass.pzTransformAndRun");
          strNewUrl.copy(SafeURL_createFromEncryptedURL(oSafeReplaceCurrentURL.toQueryString()), true);
        } else {
          strNewUrl.copy(oActionURL);
        }
      }

			if (formEle) {
        pega.u.d.convertToRunActivityAction(strNewUrl);
				formEle.action = strNewUrl.toURL();
				hcm.set("gDirtyOverride", false);
				try {
					if (response) {
						//var responseData = JSON.parse(response.responseText);
						var _data = response;
						var postAutomationDiv = $(formEle).find("#postAutomationMeta")[0];
						var autoPrimaryPage = postAutomationDiv.getAttribute("data-automation-primaryPage");
						for (var key in _data) {
							//postData.put(pega.u.property.toHandle(autoPrimaryPage+"." + key), _data[key]);
							var name = pega.u.property.toHandle(autoPrimaryPage + "." + key);
							$(formEle).find('[name = "' + name + '"]').val(_data[key]);
						}
					}
				} catch (e) {
					console.log("Failure in updating the DOM with automation data");
				}

				/* Added to avoid submitting placeholder value while reloading the harness : START */
				if (pega.control && pega.control.PlaceHolder) {
					pega.control.PlaceHolder.removePlaceHolderValues(formEle);
				}
				/* Added to avoid submitting placeholder value while reloading the harness : END */
				pega.u.d.fixBaseThreadTxnId();

				// details of action to perf mon
				pega.ui.statetracking.setPALInteraction(strNewUrl.toURL());

				//formEle.submit();

				var replacePegaHarnessContent = function(contentDiv) {
					var harnessDiv = pega.util.Dom.getElementsById("PEGA_HARNESS", contentDiv, "div")[0];
					if (harnessDiv) {
						pega.ui.DCUtil.replace(harnessDiv.parentNode);
					} else {
						console.log("Harness not found");
					}
				};

				var submitOSCOHandler = {
					online: function(strNewUrl, postDataJSON) {
						var action = strNewUrl.get("pyActivity");
						if (hcm.get("isMDC")) {
							pega.u.d.hideBusyIndicatorForMDCRefresh = true;
							var ajxCtr = pega.redux.Utils.getAjaxContainerState();
							if (ajxCtr && typeof ajxCtr.parentKey !== "undefined") {
								strNewUrl.put("parentKey", ajxCtr.parentKey);
							}
							pega.ui.MDCUtil.microDCRenderer(strNewUrl, postDataJSON, true);
						}
						else if (hcm.get("bIsDCSPA")) {
							strNewUrl.put("isURLReady", "true");
							pega.u.d.UIActionRouter.singlePageRenderer(strNewUrl, postDataJSON);
						}
						else {
							function closeAllMdcsCallback() {
                if (oActionURL.get("switchtoPOST")) {
                  var paramArray = oActionURL.keys();
                  for (i in paramArray) {
                    var keyParam = paramArray[i]
                    if (keyParam === "pyActivity") {
                      continue;
                    }
                    var value = oActionURL.get(keyParam);
                    if (typeof value === "undefined") {
                      value = "";
                    }
                    var input = document.createElement("input");
                    input.setAttribute("name", keyParam);
                    input.setAttribute("value", value);
                    input.setAttribute("type", "hidden");
                    formEle.appendChild(input);
                  }
                }

								pega.ui.statetracking.setFormsubmitBusy();
								if (action && action.toLowerCase() == "finishassignment") {
									pega.u.d.harnessOnBeforeUnload(event, formEle);
								} else {
									formEle.submit();
								}
							}
							if (pega.ui.hasAjaxContainer) {
								var actionObj = {
									"closeAllDocsCallback": closeAllMdcsCallback,
									"pzPrimaryPageName": strNewUrl.get("pzPrimaryPageName"),
									"forceClose": true,
									"isOuterDocClose": true
								};
								pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.CLOSEALL, actionObj));
							} else {
								closeAllMdcsCallback();
							}
						}

					},

					remote: function(strNewUrl, postDataJSON) {
						strNewUrl.put("isRemoteCase", "true");
						strNewUrl.put("UITemplatingStatus", "Y");
						var callBack = {};
						pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
						callBack.success = function(response) {
							var res = response.responseText;
							var dummyDiv = document.createElement("div");
							dummyDiv.innerHTML = res;
							pega.u.d.initChangeTracker(dummyDiv);
							pega.ui.updatePegaServerAvailability(1);
							replacePegaHarnessContent(dummyDiv);
							hcm.set("isFromNonOsco", true);
							pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
						};

						callBack.failure = function() {
							pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
							if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
								pega.ui.DCUtil.cancelTransition();
							}

							console.log("Failure in submit remote handler.");
						};

						var isServerAvailable = pega.ui.ClientCache.find("pxRequestor.pzIsPegaServerAvailable");
						if (!isServerAvailable || (isServerAvailable && isServerAvailable.getValue() == "false")) {
							var cannotPerformWhenOffline = pega.u.d.fieldValuesList.get("CannotPerformWhenOffline");
							alert(cannotPerformWhenOffline);
							pega.u.d.resetBusyState();
							pega.u.d.gBusyInd && pega.u.d.gBusyInd.hide();
							if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
								pega.ui.DCUtil.cancelTransition();
							}
							return;
						}
						if (pega.ui.HarnessContextMgr.get("isMDC")) {
							pega.ui.MDCUtil.microDCRenderer(strNewUrl, postDataJSON, true);
						} else {
							pega.u.d.asyncRequest('POST', strNewUrl, callBack, postDataJSON);
						}
					},

					offline: function(strNewUrl, postDataJSON) {
						var action = strNewUrl.get("pyActivity");
						var subAction = strNewUrl.get("Action");
						switch (action.toLowerCase()) {
							case "finishassignment":
								pega.process.engine.finishAssignment(postDataJSON, function() {}, function() {});
								break;
							case "add":
								pega.process.engine.addNewWork(postDataJSON, function() {}, function() {});
								break;
							case "open":
								switch (subAction.toLowerCase()) {
									case "review":
										pega.process.engine.cancel(postDataJSON, function() {}, function() {});
										break
								}
								break;
							// BUG-582270 
							case "pzrunactionwrapper":
                if(strNewUrl.get("pzActivity") == "GoToPreviousTask"){
                     //Needed to put TaskName and flowName into JSON but had to switch to object first
								    //Information gets passed in on action and needed to be in post data
								    var postDataObj = JSON.parse(postDataJSON);
								    postDataObj.TaskName = oActionURL.get("TaskName");
								    postDataObj.flowName = oActionURL.get("flowName");
								    postDataJSON = JSON.stringify(postDataObj);
								    pega.process.engine.goToPreviousAssignment(postDataJSON, function() {}, function() {});
                 } else {
                   console.info("Unknown offline action: " + action);
                 }
								
								break;
							case "dosave":
								pega.process.engine.doSave(postDataJSON, function() {}, function() {});
								break;
							case "saveandcontinue":
								pega.process.engine.saveAndContinue(postDataJSON, function() {}, function() {});
								break;
							default:
								console.info("Unknown offline action: " + action);

						}
					},
					scope: this
				};

				var handler = function() {
					var postSubmitData, considerFormdata = true;
					if (hcm.get("isMDC")) {
						postSubmitData = pega.u.d.getQueryString(formEle, false, false, considerFormdata);
					} else if (hcm.get("bIsDCSPA") && pega.ctx.hasFile() && pega.u.d.ServerProxy.isBrowserClient()) {
						postSubmitData = new FormData(formEle);
					} else {
						postSubmitData = pega.u.d.getQueryString(formEle, false, false, considerFormdata);
						if (!postFormData && pega.u.d.ServerProxy.isDestinationLocal()) {
							postSubmitData = new SafeURL();
						}
					}
					pega.u.d.ServerProxy.doAction(strNewUrl, postSubmitData, submitOSCOHandler);
					hcm.set("gDirtyOverride", null);
				};

				if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.startTransition) {
					pega.ui.DCUtil.startTransition(true, handler);
				} else {
					handler();
				}
			}
		};
		var hasMDC = document.querySelector("div[data-mdc-id]") ? true : false;
		// Need to check formdirty even during outer doc submit, to check if MDCs are dirty
		if (!hcm.get("isMDC") && hasMDC && !pega.u.d.isDirtyDialogOpen) {
			if (pega.u.d.ignoreDirty != "true" && pega.u.d.isFormDirty(true, false, null, true)) {
				return false;
			}
		}

		var strActionURL;
		if (typeof (strAction) == "string") {
			strActionURL = SafeURL_createFromURL(strAction);
		} else {
			strActionURL = strAction;
		}

		var action = strActionURL.get("pyActivity");
    var contextToPassToAutomation;
		if (pega.ui.roboticAutomation && pega.ui.roboticAutomation.isAutomationConfigured("submit", document)) {
          contextToPassToAutomation = document;
    var context;
    if(event && event.target)
	    context = pega.ui.HarnessContextMgr.getContextByTarget(event.target);
    if(context){
	    var contextDivRecordId = context.recordId;
      if(contextDivRecordId){
		    var contextDiv = document.querySelector("[data-mdc-recordid='"+contextDivRecordId+"']");
          if(contextDiv){
			      contextToPassToAutomation=contextDiv;
		      }	
      }        
    }
  var postAutomationDiv = pega.ui.roboticAutomation.isAutomationConfigured("submit", contextToPassToAutomation);
	//executing the automation if action is finishAssignment(to skip automation call for 'save') and when it is invoked for the first time
  if (postAutomationDiv && (action && action.toLowerCase() == "finishassignment") && pega.ui.roboticAutomation.skipAutomation(contextToPassToAutomation) == "false") {
	  pega.ui.roboticAutomation.runAutomation("submitAssignment", contextToPassToAutomation, submitInner, [strAction, objButton, strBusyText, event]);
  }
  else {
	  //setting the arrtibute to false if true for subsequent automation calls
	  if (postAutomationDiv && postAutomationDiv.getAttribute("skipAutomation") == "true"){
		  postAutomationDiv.setAttribute("skipAutomation", "false");
	  }	
	  submitInner(strAction, objButton, strBusyText, event);
  }
  }
		else {
			submitInner(strAction, objButton, strBusyText, event);
		}

		return true;
	},

	//used in robotic automation script file to get the property values from DOM
	getPropValuesFromDOM: function(props, autoPrimaryPage) {
		$.each(props, function(propName, value) {
			var propRef = pega.u.property.toHandle(autoPrimaryPage + '.' + propName);
			var propDomArr = pega.u.d.getCorrectPropertyElemFromDOM(propRef, pega.ui.ChangeTrackerMap.getTracker());
			if (propDomArr && propDomArr.length > 0 && propDomArr[0].id != 'CV') {
				var domvalue = pega.u.d.getGroupElementValue(propDomArr);
				props[propName] = domvalue;
			}
		});
		return props;
	},

	offlineSubmitCallback: function() {
		var screenLayoutMainDiv = document.getElementsByClassName("screen-layout"),
			portalHarnessInsName = "",
			className = "",
			harnessName = "";

		if (screenLayoutMainDiv && screenLayoutMainDiv.length > 0) {
			screenLayoutMainDiv = screenLayoutMainDiv[0];
			portalHarnessInsName = screenLayoutMainDiv.getAttribute("data-portalharnessinsname");
			if (portalHarnessInsName && portalHarnessInsName.indexOf("!") > -1) {
				portalHarnessInsName = portalHarnessInsName.split("!");
				className = portalHarnessInsName[0];
				harnessName = portalHarnessInsName[1];
			}
		}
		if (className != "" && harnessName != "") {
			pega.desktop.showHarness(harnessName, className, harnessName, '', '', '', '', '', '', '', '', '', 'true');
		} else {
			pega.desktop.showHarness(window.strHarnessPurpose, window.strHarnessClass, window.strHarnessPurpose, '', '', '', '', '', '', '', '', '', 'true');
			//work around!!
		}
	},

	removeReadOnlyFormatValues: function(parentDOM) {
		if (parentDOM == null || typeof (parentDOM) === "undefined")
			return;
		var inputElements = parentDOM.getElementsByTagName("INPUT");
		var len = inputElements.length;
		for (var i = 0; i < len; i++) {
			var ele = inputElements[i];
			if (ele && ele.type == "text") {
				try {
					if (ele.getAttribute("data-formatting") === "yes" || ele.getAttribute("data-formatting") === "done") {
						var originalValueStr = ele.getAttribute("data-value");
						if (typeof (originalValueStr) != "undefined" && originalValueStr != null) {
							if (!ele.getAttribute("data-display-value")) {
								ele.setAttribute("data-display-value", ele.value);
							}
							ele.value = originalValueStr;
						}
					}
				} catch (e) {
				}
			}
		}
	},
	addReadOnlyFormatValues: function(parentDOM) {
		if (parentDOM == null || typeof (parentDOM) === "undefined")
			return;
		var inputElements = parentDOM.getElementsByTagName("INPUT");
		var len = inputElements.length;
		for (var i = 0; i < len; i++) {
			var ele = inputElements[i];
			if (ele && ele.type == "text") {
				try {
					if (ele.getAttribute("data-formatting") === "yes" || ele.getAttribute("data-formatting") === "done") {
						var formattedValueStr = ele.getAttribute("data-display-value");
						if (typeof (formattedValueStr) != "undefined" && formattedValueStr != null) {
							ele.value = formattedValueStr;
							ele.removeAttribute("data-display-value");
						}
					}
				} catch (e) {
				}
			}
		}
	},
	processCheckboxHiddenElements: function(parentDOM) {
		if (parentDOM == null || typeof (parentDOM) === "undefined")
			return;
		var inputElements = parentDOM.getElementsByTagName("INPUT");
		var len = inputElements.length;
		for (var i = 0; i < len; i++) {
			var ele = inputElements[i];
			if (ele && ele.type == "checkbox" && ele.disabled) {
				var hiddenIpElement = pega.util.Dom.getPreviousSiblingBy(ele, function(node) {
					if (node.type == "hidden" && node.getAttribute('name') == ele.getAttribute('name')) {
						return true;
					}
					return false;
				});
				if (hiddenIpElement) {
					if (ele.checked) {
						hiddenIpElement.value = "true"
					} else {
						hiddenIpElement.value = "false";
					}
				}
			}
		}
	},
	processCustomTimezonedDateTimeElements: function(parentDOM) {
		if (parentDOM == null || typeof (parentDOM) === "undefined")
			return;
		var timezoneElements = parentDOM.querySelectorAll("input[data-custom-timezone]");
		for (var i = 0; i < timezoneElements.length; i++) {
			var tzElem = timezoneElements[i];
			if (tzElem.type == "text") {
				var srcValue = tzElem.hasAttribute("data-formatting") ? tzElem.getAttribute("data-value") : tzElem.value;
        var origValueStr = tzElem.getAttribute("data-value") || tzElem.value;
        tzElem.setAttribute("originalValue",origValueStr);
				tzElem.value = pega.u.d.CalendarUtil.convertDateTimeBtwnTimezones(srcValue, tzElem.getAttribute("data-custom-timezone"), pega.u.d.TimeZone);
			}
		}

	},
  checkForAC: function(formElem){
    return pega.ctx.isMDC && formElem ? true : false;
  }
};
pega.lang.augmentObject(pega.ui.Doc.prototype, docSubmit);
  //static-content-hash-trigger-GCC
var dirtyHandling = {
	ignoreDirtyState : false,
	gDirtyOverride : null,
	notifyDirtyCallBack : null,
	dirtyTimeInterval : 5000,
	dirtyTimer : null,
	
	registerNotifyDirty: function (dirtyCallback) {
		if(typeof dirtyCallback === "function"){
			this.notifyDirtyCallBack = dirtyCallback;
		}
	},
	startDirtyCheckTimer: function () {
		if(this.dirtyTimer == null){
			this.dirtyTimer = setInterval( this.notifyDirty , this.dirtyTimeInterval );
		}
	},
	notifyDirty: function () {
		if (pega.u.d.isFormDirty(false)) {
			if(pega.u.d.notifyDirtyCallBack){
				//pega.u.d.notifyDirtyCallBack(pega.u.d);
			}
			clearInterval(pega.u.d.dirtyTimer);
		}	
	},
	removeDirtyCallback: function(){
		clearInterval(this.dirtyTimer);
		this.notifyDirtyCallBack = null;
	},

	//Clearing Dirty State of all the harness elements to false.
	clearDirtyState : function(){
		var harnessElements = this.harnessElements;	
		if(pega.u.d.bRuleformHasErrors) return; // if pega.u.d.bRuleformHasErrors is True that means RuleForm Has Errors in it . So we are not resetting dirty flag of harnesses.
		if(harnessElements){
			for(var i = 0; i < harnessElements.length; i++){
				var element = harnessElements[i].element;
				if(element && element.dirty){
					harnessElements[i].element.dirty = false;	
				}
					
			}
		}
		pega.ctx.ignoreDirtyState = true;			
	},

  
  
  isInAjaxContainer: function(elem, ACDocsList) {
    if(!ACDocsList || ACDocsList.length==0) return;

    if(ACDocsList.length){
      for(var i=0; i<ACDocsList.length;i++){
        if(ACDocsList[i].contains(elem)){
          return true;
        }
      }

    }else {
      return ACDocsList.contains(elem);
    }
  },
  
  /*
  This method will be used to check if passed container element has any un saved changes.
  This method is created from doExplorerFormFieldsChanged, so noFramed and win parameters are required.
  */
  isContainerDirty: function(divContainer, params) {
    var noFramed, win;
    if (params) {
      noFramed = params.noFramed;
      win = params.win;
    }

    try {
      // else compare current values with initial ones
      var textInputs = pega.util.Dom.getElementsByAttribute("type", "text", "INPUT", divContainer);
      var numberInputs = pega.util.Dom.getElementsByAttribute("type", "number", "INPUT", divContainer);
      var checkboxInputs = pega.util.Dom.getElementsByAttribute("type", "checkbox", "INPUT", divContainer);
      var radioInputs = pega.util.Dom.getElementsByAttribute("type", "radio", "INPUT", divContainer);
      var textareas = divContainer.getElementsByTagName("TEXTAREA");
      var selects = divContainer.getElementsByTagName("SELECT");
     
      if(pega.ctx.isMDC){
       var ACDocsList = document.querySelector("div[data-mdc-id='"+pega.ctx.mdcName+"']");
      }
      else{
        var ACDocsList = document.querySelectorAll("div[data-mdc-id]");
      }
      
      for (var i = 0; i < textInputs.length; i++)
      {
        var elem = textInputs[i];
        // MultiSelect Control Handling (BUG-703897)
        var controlName = elem.getAttribute("data-ctl") || "";
        var isMultiSelect = controlName.includes("MultiSelect");
        if(isMultiSelect && elem.style.display != "none"){
          var parentElement = elem.parentElement;
          var hiddenInput = parentElement.querySelector("input[type='hidden'][name='selected-placeholder']")
          var initialValue = (hiddenInput && hiddenInput.getAttribute("data-initialvalue")) || ""
          if(hiddenInput && (hiddenInput.value != initialValue)) {
            if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
            }
            return true;
          }
        }
        if (elem.style.display != "none" && elem.value != elem.defaultValue && elem.name != "" )
        {
          if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
             
          }
          return true;
          
        }
      }
      for (var i = 0; i < numberInputs.length; i++)
      {
        var elem = numberInputs[i];
        if (elem.style.display != "none" && elem.value != elem.defaultValue && elem.name != "" )
        {
          if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
             
          }
          return true;
          
        }
      }
      for (var i = 0; i < checkboxInputs.length; i++)
      {
        var elem = checkboxInputs[i];
        if (elem.checked != elem.defaultChecked && elem.name != "")
        {
          if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
             
          }
          return true;
        }
      }
      for (var i = 0; i < radioInputs.length; i++)
      {
        var elem = radioInputs[i];
        if (elem.checked != elem.defaultChecked && elem.name != "")
        {
          if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
             
          }
          return true;
        }
      }
      for (var i = 0; i < textareas.length; i++)
      {
        var elem = textareas[i];
        if (elem.style.display != "none" && elem.value != elem.defaultValue && elem.name != "")
        {
          if(this.isInAjaxContainer(elem,ACDocsList)){
             pega.u.d.isMDCDirty = true;
             
          }
          return true;
        }
      }
      for (var i = 0; i < selects.length; i++)
      {
        var elem = selects[i];
        var control_name = elem.getAttribute("data-for") || "";
        var isDropDownDateTime = control_name.includes("DatePicker");
        if (elem.id!=="ActionOptions" && elem.id!=="ISnsSelect" && (elem.name !== "" || isDropDownDateTime))
        {
          var cOpts = elem.options;
          var iNumOpts = cOpts.length;
          var hasDefaultSelected = false;
          // check for all the elements if any of them were defaultSelected.
          for (var j = 0; j < iNumOpts; j++)
          {
            var eOpt = cOpts[j];
            //This code was not cheking for disabled controls.If a control is disabled then do nothing - BUG-116543
            if (eOpt.defaultSelected )
            {
              hasDefaultSelected = true;
              if (!eOpt.selected && !eOpt.isDisabled)
              {
                if(this.isInAjaxContainer(elem,ACDocsList)){
                  pega.u.d.isMDCDirty = true;

                }
                return true;
              }
            }
          }
          if (!hasDefaultSelected) {
            if(!cOpts[0].selected) {
              if(this.isInAjaxContainer(elem,ACDocsList)){
                pega.u.d.isMDCDirty = true;

              }
              return true;
            }
          }
        }
      }
      var sectionIds = pega.ctx.isMDC ? pega.u.d.getSectionIds(divContainer) : [];
      if(!noFramed && win){
        var complexElements = win.pega.u.d.getHarnessElements(false,false,true, sectionIds);
      }else{
        var complexElements = pega.u.d.getHarnessElements(false,false,true, sectionIds);
      }	
      var len = complexElements.length;
      for(var i=0;i<len;i++) {
        var ele = complexElements[i].element;
        if(typeof ele.isDirty != "undefined" && ele.isDirty()) {
          if (ele.gridDiv && this.isInAjaxContainer(ele.gridDiv, ACDocsList)) {
            pega.u.d.isMDCDirty = true;
          }
          return true;
        }
      }

    }catch (e) {
      return false;
    }
    return false;
  },

	/* @public
	This function returns false when form is dirty
    @param onlyMdcDocs - Flag to check if any MDCs are dirty incase of outer doc submit
	@return $boolean$
	*/

	isFormDirty:function(bPrompt, fromCloseWork, ev, onlyMdcDocs, callback){
    pega.u.d.discardActionCallback = callback;
    var harCtxMgr = pega.ui.HarnessContextMgr;
		if ((pega.u.d.explorerFormIsDirty(onlyMdcDocs) && (!pega.u.d.myDesktop || pega.u.d.myDesktop.gPortalWarnDirty)) || pega.u.d.explorerFormIsBusy()){

			var contentMsg = pega.u.d.fieldValuesList.get("DISCARD_YOUR_UNSAVED_CHANGES");
      if(pega.u.d.isMDCDirty && bPrompt){

        // confirm() or similar will be launched, freezing all js. force reset busy tracking to idle
        pega.ui.statetracking.resetBusyTotalizer();
        if (!pega.u.d.bUseNativeDirtyConfirm) {
            // If dirty dialog is opened and clicking on discard.
            if (pega.u.d.isDirtyDialogOpen) {
              pega.u.d.hideModalWindow();
              return false;
            }
            if (!pega.u.d.isDirtyDialogOpen) {
              pega.u.d.showCustomDirtyModal();
            }
            return true;
          }
        
        var bClose = confirm(contentMsg);
        if(!bClose){
          if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
            pega.ui.DCUtil.cancelTransition();
          }
        } 
        pega.u.d.isMDCDirty = false;
        return !bClose;
      }
			if (arguments.length > 0){
				if(bPrompt) {
          if (!pega.u.d.bUseNativeDirtyConfirm) {
            // If dirty dialog is opened and clicking on discard.
            if (pega.ctx.bIsDCSPA && pega.u.d.isDirtyDialogOpen) {
              pega.u.d.hideModalWindow();
              return false;
            }
            if (!pega.u.d.isDirtyDialogOpen) {
              pega.u.d.showCustomDirtyModal();
            }
            return true;
          }
					if(!ev || !fromCloseWork || pega.u.d.bUseNativeDirtyConfirm || !$("#dirty-confirm-div")[0] || (pega.u.d.bModalDialogOpen && document.getElementById("modaldialog_con_dirty") && document.getElementById("modaldialog_con_dirty").offsetHeight==0)) {
            /*
                         some window methods like alert or confirm are ignored by webkit/gecko when used with unload/beforeunload events.
                         see - https://developer.mozilla.org/en-US/docs/Web/Reference/Events/beforeunload
                         handling cases for noIframe portal refresh below.
                         4/23/2014 - kumad1
            */
            if (pega.u.NavigateTopHandler && (ev && ev.type === "beforeunload")) {  // check for portal having DC and no iframes
              var bClose = contentMsg;
              (ev || window.event).returnValue = bClose; //Gecko,IE
              return bClose; //Webkit
            } else {
              pega.ui.statetracking.resetBusyTotalizer();

						  var bClose = confirm(contentMsg);
            }

						// Bug-114202, TZ: The logic seems to be kind of confusing here. If bClose is true, then we should set the gDirtyOverride.
						//if (!bClose) {
						if (bClose) {
              if(pega && pega.ctx.bIsDCSPA !=true )
                {
                  harCtxMgr.set("gDirtyOverride",false);
                }
              
						} else {
              if (pega.ui && pega.ui.DCUtil && pega.ui.DCUtil.cancelTransition) {
                pega.ui.DCUtil.cancelTransition();
              }
            }
						return !bClose;
					} else {
						/*BUG-131287 start : if close icon span is clicked call _doOnMouseClick to clear menus and overlay before opening modal dialog*/
						if(ev){
							var srcElem=pega.util.Event.getTarget(ev);
							if(srcElem && srcElem.tagName=="SPAN" && srcElem.id=="close")
							{
								try{
									pega.d.sendEvent("DesktopMouseClick", ev, "SYNC");
									//pega.d.MouseEvent._doOnMouseClick(ev);	
								}
								catch(e){}
							}
						}
						/*BUG-131287 end*/
						try{
							if(!pega.u.d.isDirtyDialogOpen){
							  pega.u.d.queueDirtyModalAction(ev);
              }
						}
						catch(e){
							if(!pega.u.d.isDirtyDialogOpen){
							  pega.u.d.showCustomDirtyModal();
              }
						}						
						return true;
					}
				} else {
					// TZ: shouldnt' set the gDirtyOverride here.
					//pega.u.d.gDirtyOverride = false;
					return true;
				}
			}
			else {
					pega.u.d.dirtyCloseApproved = confirm(contentMsg);
					if (pega.u.d.dirtyCloseApproved) {
                      	harCtxMgr.set("gDirtyOverride",false);
					}
					return !pega.u.d.dirtyCloseApproved;
				} 
			}
		 else {
       if(pega.u.d.isDirtyDialogOpen) {
         $(".modal-overlay .modal-wrapper > .modal-content").css({'max-height': 'none', 'max-width': 'none'});
         delete pega.u.d.isDirtyDialogOpen;
       }
       return false;
     }
	},
	queueDirtyModalAction: function(ev){
		if(pega.c.actionSequencer.isQueueEmpty()){
			pega.c.actionSequencer.schedule(ev,pega.c.UIElement,[["runScript",["pega.u.d.showCustomDirtyModal()"]]]);
		}
		else{
			window.setTimeout(function(){pega.u.d.queueDirtyModalAction(ev);},1);
		}
	},
	showCustomDirtyModal: function() {
		
		pega.u.d.submitModalDlgParam = null;	
    pega.u.d.isDirtyDialogOpen = true;
    pega.u.d.processActionModal_Pre_Success();
		pega.u.d.processActionModal_Success({responseText: (document.getElementById("dirty-confirm-div").innerHTML).replace("modaldialog_hd_dirty", "modaldialog_hd")});
		/* document.getElementById("modaldialog").style.display = "block"; */
		pega.u.d.resizeModalDialog();
		var _that = this;
		setTimeout(function() {
			try{
				_that.resetBusyState();
			} catch(ex){}
		}, 0);
	},
	/*
	@protected explorerFormIsDirty
    @param onlyMdcDocs - Flag to check if any MDCs are dirty incase of outer doc submit
	@return $boolean$
	*/
	explorerFormIsDirty:function(onlyMdcDocs){
		// check for override
		var gDirtyOverride = pega.ui.HarnessContextMgr.get('gDirtyOverride');
      	if(gDirtyOverride !=null)
         {
           	return gDirtyOverride;
         }
		return pega.u.d.doExplorerFormIsDirty(window, onlyMdcDocs);
	},

	/*
	@protected - doExplorerFormIsDirty
	@param $Object$win
    @param onlyMdcDocs - Flag to check if only MDCs are dirty incase of outer doc submit
	 @return $boolean$
	*/
	doExplorerFormIsDirty:function(win, onlyMdcDocs)
	{
		if (pega.u.d.gIsLoading) {
			return false;
		}
      
      	//close case, we need to even check at outer doc level
      	if(!onlyMdcDocs) {
          if((!pega.u.NavigateTopHandler || pega.u.d.handleDirtyForFramelessPortals) && (pega.ctx.gSectionReloaded == true && !pega.ctx.ignoreDirtyState)){
              return true;
          }         
        }
    
        //close triggered from AC case
        if(pega.ctx.isMDC){
            var gSectionReloaded = pega.ctx.gSectionReloaded;
            var ignoreDirtyState = pega.ctx.ignoreDirtyState;

              if((!pega.u.NavigateTopHandler || pega.u.d.handleDirtyForFramelessPortals) && (gSectionReloaded == true && !ignoreDirtyState)){
                pega.u.d.isMDCDirty = true;
                return true;
              }
        }
      
      	else{
      	//check if reloadsection is triggered from anyof MDCs
      	var allMDCContainers = pega.u.d.getAllMDCContainers();
      	for (var i = 0; i < allMDCContainers.length; ++i) {
          var microDCDivId = allMDCContainers[i].getAttribute("data-mdc-id");
          var microDCDocs = pega.u.d.getMicroDCDocs(microDCDivId);
      	
          for(var j = 0; j < microDCDocs.length; j++) {
            var pzHarnessID = microDCDocs[j].getAttribute("data-harness-id");
            //skip if it is a dummy MDC container
            if(!pzHarnessID) continue;

            var mdcHarnessContext = pega.ui.HarnessContextMgr.getHarnessContext(pzHarnessID);
            var gSectionReloaded = mdcHarnessContext.getProperty("gSectionReloaded");
            var ignoreDirtyState = mdcHarnessContext.getProperty("ignoreDirtyState");

              if((!pega.u.NavigateTopHandler || pega.u.d.handleDirtyForFramelessPortals) && (gSectionReloaded == true && !ignoreDirtyState)){
                pega.u.d.isMDCDirty = true;
                return true;
              }
          } //for
        }
        }
      
        // case of Work-.Action area - need to use the frame window to check if section reloaded
        if(win.name == "actionIFrame"){
          if(win.pega != null && win.pega.u != null && win.pega.u.d !=null && win.pega.ctx.gSectionReloaded == true)
            return true;
        }  
    
        if(pega.ui.hasAjaxContainer){
          if (pega.u.d.doExplorerFormFieldsChanged(win, onlyMdcDocs))
				      return true;	
        }
      	
      	
      
		try {
		// if input disabled, assume not dirty
        var elem = win.document.InputEnabled;
		if ((elem != null && elem == "false" && win.frames.length == 0) ||
			(win.document.forms.length == 0 && !pega.u.d.bIsDCSPA))
		{
			return false;
		}
		// else compare current values with initial ones
		else
		{
			if (pega.u.d.doExplorerFormFieldsChanged(win, onlyMdcDocs))
				return true;	
		}
		// check for dirty children
		if (win.frames.length > 0)
		{
			for (var i = 0; i < win.frames.length; i++)
			{
				//Check if this frame is a form based RuleForm and it is dirty
				if (win.frames[i].window.gToolbarManagerAPI){
					return win.frames[i].window.gToolbarManagerAPI.isDirty;
				} else {			
					if (pega.u.d.doExplorerFormIsDirty(win.frames[i], onlyMdcDocs))
					{
						return true;
					}
				}
			}
		}
	}catch (e) {
		  return false;
	   }

		// all clean
		return false;
	},

	/*
	@protected - doExplorerFormFieldsChanged - out from doExplorerFormIsDirt. TODO: doExplorerFormIsDirty should make function call here
    @param onlyMdcDocs - Flag to check if any MDCs are dirty incase of outer doc submit
	@param $Object$win
	 @return $boolean$
	*/
	doExplorerFormFieldsChanged:function(win, onlyMdcDocs)
	{
      	
      	var documentsList = [];
		//BUG-159266 : Checking if Noframe Portal and updating win to Pega_Harness div.
		var noFramed = typeof pega.u.NavigateTopHandler !== "undefined" && typeof pega.u.NavigateTopHandler === "object";

		if(onlyMdcDocs) {
          
          var mdcFieldSets = document.querySelectorAll("fieldset.mdc-fieldset");
          Array.prototype.push.apply(documentsList, mdcFieldSets);
          
        }else {
      		if (pega.ctx.isMDC) {
                var mdcRecordDiv = document.querySelector("div[data-mdc-recordid='"+ pega.ctx.recordId +"']");
              	documentsList.push(mdcRecordDiv);
			} else {
                if(noFramed){
                  win = {};
                  // BUG-427477 : Commenting below line to ignore ac tertiary.
                  //win.document = document.getElementById("PEGA_HARNESS");
                  // If DC is configured with section we don't find "PEGA_HARNESS" id div. In such cases get main tag element.
                 // if (!win.document) {
                    win.document = document.getElementsByClassName("screen-layout-region-main-middle");
                    win.document = win.document && win.document[0];
                  //}
                }

              documentsList.push(win.document);
			}
        }
      
    var params = {
      noFramed: noFramed,
      win: win
    };
    // in case of a document with MDC, when outer doc is submitted - this will loop through all MDCs and check if they are dirty
    for(var index=0;index<documentsList.length;index++) {
      var isCurrentDocumentDirty = pega.u.d.isContainerDirty(documentsList[index], params);
      if (isCurrentDocumentDirty) return true;
    } //for
		

		// all clean
		return false;
	},
  
  discardHandler:function(){
    if(pega.u.d.discardActionCallback){
      pega.u.d.hideModalWindow();
      pega.u.d.discardActionCallback();
      pega.u.d.discardActionCallback = undefined;
      
    }else{
      pega.control.Actions.prototype.doClose(null, null, null, true);
    }
}
};
pega.lang.augmentObject(pega.ui.Doc.prototype, dirtyHandling);
dirtyHandling = null;
//static-content-hash-trigger-GCC