(function(p) {
  var desktop = p.desktop,
      NULL = null,
      desktopSupport = desktop.support,
      webApi = NULL,
      dom = p.util.Dom,
      ui = p.u,
      pud = p.u.d,
      pue = p.util.Event,
      WORK_AREA_ID = "pxWorkArea",
      MULTI_VIEW_ATTRIB = "data-multiview",
      DIV_TAG_NAME = "div",
      SPAN_TAG_NAME = "span",
      IFRAME_TAG_NAME = "iframe",
      NODE_NAME = "node_name",
      TAB_GROUP_ID = "tabGroupId",
      GADGET_ID = "PegaWebGadget",
      TAB_THREAD = "TABTHREAD",
      PEGA_GADGET = "PWGadget",
      POS_ATTRIB = "data-pos",
      SIZING_STRETCH = "Stretch",
      ASTERISK = "*",
      WAMAXTABS = "WAMaxtabs",
      ACTIVE_TAB_CHANGE = "activeTabChange",
      DATA_STC = "data-stc",
      DATA_STL = "data-stl",
      INLINE_BLOCK = "inline-block",
      DESKTOP_ACTION = "DesktopAction",
      SYSTEM_ID = "systemID",
      APP_NAME = "appName",
      API = "api",
      OPEN_ASSIGNMENT = "openAssignment",
      OPEN_WORK_BY_HANDLE = "openWorkByHandle",
      OPEN_WORK_BY_URL = "openWorkByURL",
      CREATE_NEW_WORK = "createNewWork",
      SHOW_HARNESS = "showHarness",
      OPEN_LANDING = "openLanding",
      OPEN_WIZARD = "openWizard",
      OPEN_WORK_ITEM = "openWorkItem",
      REPORT_DEFINITION = "reportDefinition",
      CLEAR_INDICATORS = "ClearIndicators",
      CLOSE_ALL_DOCUMENTS = "CloseAllDocuments",
      UPDATE_RECENTLIST = "UpdateRecentList",
      GET_NEXT_WORK_ITEM = "getNextWorkItem",
      DISPLAY_ON_PAGE = "displayOnPage",
      SET_DOCUMENT_LABEL = "setDocumentLabel",
      SET_DOCUMENT_KEY = "setDocumentKey",
      SUBMIT_DOCUMENT_CONTENT = "submitDocumentContent",
      RELOAD = "reload",
      WORK_LOADED = "WorkLoaded",
      ACTIVATE = "activate",
      DISPLAY = "display",
      LABEL = "label",
      PARAM = "param",
      NAME = "name",
      PAGE = "page",
      MODEL = "model",
      READ_ONLY = "readOnly",
      KEY = "key",
      WORK_POOL = "workpool",
      YES = "yes",
      /* For DC, the id pzWAstrings on the markup contains the data attributes for localization.
             The Strings to be localized should be added at markup generation accordingly and handled here as below. - kumad1 12/19/2013
             */
      WASTRINGS = document.getElementById("pzWAStrings"),
      ASSIGNMENT = WASTRINGS ? WASTRINGS.getAttribute("data-s9") : "Assignment",
      WORK_ITEM = WASTRINGS ? WASTRINGS.getAttribute("data-s10") : "Work Item",
      NEW = WASTRINGS ? WASTRINGS.getAttribute("data-s11") : "New",
      NEXT_LABEL = WASTRINGS ? WASTRINGS.getAttribute("data-s15") : "Next", 
      GET_UI_DOC = "getUIDoc",
      UNDEFINED = "undefined",
      PEGA_UI_WAGADGET = "pega.ui.WorkAreaGadget.",
      PEGA_E_ON = "PegaE_on",
      TITLE = "title",
      LONG_DESC = "longdesc",
      VISIBLE = "visible",
      PX = "px",
      PERCENT100 = "100%",
      STRETCHED_TABS = "stretchedTabs",
      NEXT = "next",
      PREV = "prev",
      ID = "id",
      DATA = "data",
      CONTINUE_WORK_WARNING = "Continue_work_Warning",
      WISH_TO_CONTINUE = "Wish_to_Continue",
      PEGA_PR = "PR_",
      HIDDEN = "hidden",
      RULE_HTML_HARNESS = "rule-html-harness",
      PEGA_THREAD = "PegaThread",
      PEGA_GADGET = "PegaGadget",
      RULE_KEY = "RULE_KEY",
      NONE = "none",
      BLOCK = "block",
      CONTENT_ELEMENT = "contentEl",
      DATA_WI = "data-wi",
      IMG_TAG_NAME = "img",
      ACTIVE_TAB = "activeTab",
      ACTIVITY_PARAM_NAME = "pyActivity",
      THREAD_NAME = "threadName",
      GET_METHOD = "GET",
      REMOVE_THREAD = "removeThead",
      OPEN_RULE_BY_KEYS = "openRuleByKeys",
      OPEN_RULE_BY_CLASS_NAME = "openRuleByClassAndName",
      OPEN_RULE_SPECIFIC = "openRuleSpecific",
      STRETCH_IF_REQUIRED = "stretch-if-required",
      STRETCH_PANEL_CONTENT = "stretch-panel-content",
      RESET_STRETCH_HEIGHT = "reset-stretch-height",
      /* TASK-128496 GUJAS1 11/23/2012 Constant for "Opening..." text (UPDATED - for localization of the string - kumad1 12/19/2013)  */
      OPENING = WASTRINGS ? WASTRINGS.getAttribute("data-s12") : "Opening...",
      skipDocumentReload = false,
      hPadding = 0,
      vPadding = 0,
      hBorder = 0,
      vBorder = 0,
      newWidth = 0,
      newHeight = 0,
      hLayoutMargin = 0,
      vLayoutMargin = 0,
      activeClientTab = null,

      setActiveClientTab = function(activeDoc){
        if(activeDoc){
          this.activeClientTab = activeDoc;
        }
      },

      getActiveClientTab = function(){
        return this.activeClientTab;
      },

      /*
             @private- Proxy for document.getElementById.
             @return $Object$ -.
             */
      byID = function(id) {
        return document.getElementById(id);
      },
      /*
             @private- Proxy for pega.ui.Dom.getElementsByAttribute.
             @return $Object$ -.
             */
      domGetElementsByAttribute = function() {
        return dom.getElementsByAttribute.apply(dom, arguments);
      },

      triggerReflow = function(e){
        /*BUG-264936:This method call can be removed once the native chrome scrollbar issue resolved*/
        try{
          if(navigator.userAgent.indexOf("Chrome/") >= 0){
            var activeHost = e.newValue || this.getActiveHost();
            var activeHostContentElement = this.getHostContentElement(activeHost);
            if(activeHostContentElement){
              var frameChild = activeHostContentElement.getElementsByTagName(IFRAME_TAG_NAME);
              if (frameChild && frameChild[0]) {
                var docFrame = frameChild[0];
                var docFrameContentDoc = docFrame.contentDocument;
                var isInLiveDesignTimePreview = (docFrameContentDoc && docFrameContentDoc.getElementById('DesignModePreview'));

                /* Only reset height for live design preview if height is <= 0 */
                if(!isInLiveDesignTimePreview || (isInLiveDesignTimePreview && docFrameContentDoc.getElementById('DesignModePreview').offsetHeight <= 0)) {
                  docFrame.style.height = (docFrame.offsetHeight -1) + "px";
                  setTimeout(function(){docFrame.style.height = ""}, 1); 
                }
              }
            } 
          } 
        }catch(e){                
        }                    
      },
      /*decoder
             @return $Object$ -.
             */
      domGetElementsById = function() {
        return dom.getElementsById.apply(dom, arguments);
      },
      ModuleView = function(el, attr) {
        ModuleView.superclass.constructor.call(this, el, attr);
        this.initAttributes(attr);
      },
      ModuleElement = pega.widget.Module,
      Module = function(el) {
        Module.superclass.constructor.call(this, el);
        this.initAttributes(el);
      },
      BaseView = function() {
      },
      NoHeadDocumentView = function(viewType) {
        this.ViewType = viewType;
      },
      NoHeadProto = {
        init: function() {
          this.startTrackingMRU();
          var moduleGroupDiv = domGetElementsByAttribute("id", "moduleGroupDiv", DIV_TAG_NAME, this.WADiv);

          if (moduleGroupDiv.length <= 0) {
            return NULL;
          }

          this.moduleGroupDiv = moduleGroupDiv[0];
          var moduleGroupDivId = this.moduleGroupDiv.id;

          this.moduleView = new ModuleView(this.moduleGroupDiv, {});
          this.moduleView.on("activeModuleChange", this.onActivate, this.moduleView, this);
          this.moduleView.on("activeModuleChange", triggerReflow, this.moduleView, this);
          if(pega.u.d.SET_WINDOW_TITLE !== false) {
            this.moduleView.on("activeModuleChange", pega.u.d.updateWindowTitle, this.moduleView, this);
          }
          if (!this.moduleView) {
            return NULL;
          }

          var staticModule = new Module("staticModule");
          this.moduleView.addModule(staticModule);
          this.moduleView.set('activeIndex', 0);
          var hostLen = this.getHostsArrayLength();
          this.hostIndex = hostLen + 1;
        },
        startTrackingMRU: function() {
          this.mruCacheObj = pega.ui.mru;//new MRUCache();
        },
        onActivate: function(ev, moduleView) {
          this.updateItemMRUCache(ev);
          if (ev.prevValue == ev.newValue) {
            if(ev.newValue && ev.newValue.activationSyncRequired){
              delete ev.newValue.activationSyncRequired;
            }else if (ev.newValue && ev.newValue.skipNextActivationSync) {
              delete ev.newValue.skipNextActivationSync; 
              return;
            }
          }
          var docDirty = "false", dirtyTab = null;
          if (pega.web && pega.web.api && ev.prevValue) {
            var docObj = pega.web.api.doAction(ev.prevValue.GadgetName, "getUIDoc");
            if (docObj) {
              docDirty = docObj.isFormDirty(false);
            }
            dirtyTab = {prevContentID: ev.prevValue.elementName,
                        prevRecordkey: ev.prevValue.key,
                        prevFormDirty: docDirty
                       };
          }
          var prevIndex = moduleView.getIndex(ev.prevValue), removedTab = null, removedTabIndex;
          moduleView.set("lastActiveIndex", prevIndex);
          if (ev.newValue && ev.newValue.skipNextActivationSync) {
            delete ev.newValue.skipNextActivationSync;
            return;
          }
          if ((!ev.newValue.tabGroupName && !ev.newValue.docGroupName) && !ev.newValue.elementName && !ev.newValue.removedTabName && !ev.newValue.removedTabsTabGroup) {
            return;
          }

          //to find the closed document index
          if (prevIndex == null) {
            removedTabIndex = ev.newValue.removedDocumentIndex;
            if (!removedTabIndex)
              removedTabIndex = moduleView.get('modules') ? (moduleView.get('modules').length + 1) : null;
            removedTab = {"dynamicContainerID": ev.prevValue.tabGroupName,
                          "tabIndex": removedTabIndex
                         };
            if (!removedTab.dynamicContainerID) {
              removedTab.dynamicContainerID = ev.prevValue.docGroupName;
            }
          }

          if (ev.newValue) {
            var isDocumentKey = "false";
            if (pega.web && pega.web.api && ev.prevValue) {
              var docObj = pega.web.api.doAction(ev.newValue.GadgetName, "getUIDoc");
              if (docObj && ev.newValue.key == docObj.documentKey) {
                isDocumentKey = "true";
              }
            }
            var curTab = {"dynamicContainerID": ev.newValue.tabGroupName,
                          //"contentID" : ev.newValue.elementName,
                          "tabIndex": moduleView.getIndex(ev.newValue) + 1,
                          //"pyStreamName" : ev.newValue.pyStreamName,
                          //"threadID" : ev.newValue.ThreadId,
                          //"primaryHarnessPageName" : ev.newValue.primaryHarnessPageName,
                          "label": ev.newValue.label,
                          "key": ev.newValue.key,
                          "iconPath": ev.newValue.iconPath,
                          "isDocumentKey": isDocumentKey
                         };
            if (!curTab.dynamicContainerID && ev.newValue.docGroupName) {
              curTab.dynamicContainerID = ev.newValue.docGroupName;
            }
            //TASK-134746 Adding threadID, className ,primaryHarnessPageName, StreamName, Label to curTab - JAINB1.
            if (ev.newValue.actionDef && ev.newValue.actionDef != "undefined") {
              if (ev.newValue.actionDef.className && ev.newValue.actionDef.className != "undefined")
                curTab.className = ev.newValue.actionDef.className;
            }
            docObj = docObj || pega.u.d;
            docObj.sendReqToUpdateElementModal(curTab, "ACTIVE", removedTab, dirtyTab,ev);
          }
        },
        setWADivReference: function(eleRef) {
          this.WADiv = eleRef;
        },
        getGroupDiv: function() {
          return this.moduleGroupDiv;
        },
        getHeaderHeight: function() {
          return 0;
        },
        hasWASiblings: function() {
          return this._hasWASiblings;
        },
        getView: function() {
          return this.moduleView;
        },
        getLastActiveIndex: function() {
          return this.moduleView.get("lastActiveIndex");
        },
        attachHostHandlers: function(noScriptResize) {

        },
        attachStretchBehavior: function() {
          var staticHostArray = this.getHostsArray(),
              hostLen = this.getHostsArrayLength(),
              tabGroupDiv = this.tabGroupDiv;

          for (var i = 0; i < hostLen; i++) {
            var curHost = staticHostArray[i];
            var curHostContentElement = this.getHostContentElement(curHost);
            dom.addClass(curHostContentElement, STRETCH_IF_REQUIRED);
          }
          var tabsListCntr = dom.getChildrenBy(tabGroupDiv, function(el) {
            return dom.hasClass(el, "scrlCntr");
          })[0];
          if (tabsListCntr)
            dom.addClass(tabsListCntr, "reset-stretch-header");
          var tabsCntr = dom.getChildrenBy(tabGroupDiv, function(el) {
            return dom.hasClass(el, "yui-content");
          })[0];
          if (tabsCntr)
            dom.addClass(tabsCntr, RESET_STRETCH_HEIGHT);
        },
        attachCloseBehavior: function() {

        },
        attachCloseAllBehavior: function() {

        },
        getNextHostIndex: function() {
          return this.hostIndex++;
        },
        handleMaxHosts: function(message) {

          var candidateIndex = this.getNextCandidateIndex();
          if (candidateIndex == -1) {
            alert(message);
          }
          return candidateIndex;
        },
        getNextCandidateIndex: function() {
          var cTracker = pega.ui.ChangeTrackerMap.getTracker(),
              indicesString = cTracker.getPropertyValue("Declare_pyDisplay.pyDisplay(" + pega.u.d.portalName + ").pyCandidateIndices");

          var indices
          , docIndex
          , docsLength
          , host
          , doc
          , candidateIndex
          , gadgetName
          , returnIndex = -1;
          try {
            indices = JSON.parse(indicesString)
          }
          catch (err) {
            return returnIndex;
          }
          docsLength = indices.length;
          for (docIndex = 0; docIndex < docsLength; docIndex++) {
            candidateIndex = parseInt(indices[docIndex], 10) - 1;
            host = this.getHost(candidateIndex);
            gadgetName = host.GadgetName;
            doc = webApi.doAction(gadgetName, GET_UI_DOC);
            if (doc && !doc.isFormDirty(false)) {
              returnIndex = candidateIndex;
              break;
            }else if(!doc){
              returnIndex = candidateIndex;
              break;
            }
          }
          return returnIndex;
        },
        removeHost: function(module, removeThread) {
          this.mruCacheObj.deleteItem(module.get("element").id);
          /*RAIDV - keepActiveIndex sent as true because deferred harnesses, since they replace current tab, were firing defer action of next tab*/
          this.moduleView.removeModule(module, true);
          // Remove the content element event listeners so they do not get invoked when the "blank" action completes.
          if (module.cfg) {
            module.destroy();
          }
          module = null;
        },
        addHost: function(Name, Index, canClose, icon, tooltip, contentID, dynamicContainerID, isDeferred, closeHandler, dcCleanupCallback, removeGadget) {
          // 1. Create Tab Header and Content Elements.
          // 2. Use YUI TabView.addTab to add a new Tab.
          var doc, moduleDiv, gadgetName;
          if (!Name) {
            Name = "";
          }

          if (typeof Index == UNDEFINED) {
            Index = this.getHostsArrayLength();
          }

          // BUG-119636 GUJAS1 09/17/2013 Simplified no-tabs addHost since it is now very similar to tabs addHost.
          // It does not need to find existing viewHost since match and removal responsibility is extracted
          // into showDocumentInMultiView.
          // The earlier code of reusing existing viewHost was corrupting the ModuleView DOM as described in
          // BUG-119636.

          moduleDiv = document.createElement("div");
          moduleDiv.id = "module" + Index;
          moduleDiv.style.display = NONE;
          moduleDiv.elementName = contentID;
          moduleDiv.tabGroupName = dynamicContainerID;
          if (dom.hasClass(document.body, "with-fixed-header")) {
            dom.addClass(moduleDiv, "iframe-wrapper");
          }
          moduleDiv.innerHTML = '<div class="hd"></div><div class="bd dynamicContainer"></div><div style="display:none;" class="ft"></div>';
          var newModule = new Module(moduleDiv);
          this.moduleView.addModule(newModule, Index);

          newModule.skipNextActivationSync = true;

          return newModule;
        },
        resizeHostContent: function(e) {
          if (this.ViewType && this.ViewType == "NoHeader" && (!pega.u.d._isJSResizeEnabled() && !dom.hasClass(document.body, "with-fixed-header"))) {
            var activeHost = this.getActiveHost();
            var hostContent = this.getHostContentElement(activeHost);
            if (hostContent) {
              var element = hostContent
              while (element && element.id != "PEGA_LU_C") {
                var ht = element.style.height;
                if (ht != PERCENT100) {
                  element.style.height = PERCENT100;
                } else {
                  break;
                }
                element = element.parentElement;
              }
            }
          }
        },
        updateItemMRUCache: function(e) {
          var prevModule = e.prevValue,
              nextModule = e.newValue,
              prevModuleId = prevModule ? prevModule.get("element").id : -1;
          var nextModuleId = nextModule ? nextModule.get("element").id : -1;                          
          // BUG-69649 05/10/2012 GUJAS1 If the same tab is being switched to (happens sometimes),
          // no need to add to MRU.
          if (prevModule == nextModule || prevModuleId == -1) {
            return;
          }
          //mem leak fix, check to make sure tab is still in DOM before adding
          if(dom.inDocument(prevModule.get("element"))) {
            this.mruCacheObj.addItem(prevModuleId, prevModule);
          }
          if (nextModuleId == -1) {
            return;
          }
          /*BUG-178513 : Adding next document information to MRU object on load of document*/
          this.mruCacheObj.addItem(nextModuleId, nextModule); 
        },
        //* TAB Management API Begin *//
        /*
                 @private- Initializes and returns the header template element used to create tabs.
                 @return $Object$ - Instance of the header template Dom Element.
                 */
        _getHeaderTemplate: function() {
          //There can be many HeaderTemplate in document or in a TabGroup when static tabs have section tabs.
          //Thus, always take the last template to be the correct one. Search for template only inside a WorkArea

        },
        /*
                 @private- Initializes and returns the content template element used to create tab content.
                 @return $Object$ - Instance of the content template Dom Element.
                 */
        _getContentTemplate: function() {
          // BUG-75612 : Added byID(tabGroupDivId) as parameter. This will return the correct template.
          //
        },
        /*
                 @private- Creates and returns a Dom element used to create a new tab.
                 @param $String$isDeferred –  Indicates if the tab represents a deferred document. This ensures the close icon is hidden.
                 @param $String$label –  Label for the tab.
                 @param $Boolean$show –  If true, display the indicator, hide it otherwise.
                 @param $Boolean$canClose –  Reserved.
                 @param $String$icon –  Reserved.
                 @param $String$tooltip –  Reserved.
                 @return $Object$ - Instance of the tab header Dom element.
                 */
        _createTabHeaderElement: function(isDeferred, label, canClose, icon, tooltip, contentID, dynamicContainerID) {
          // TODO: Make use of icon and tooltip params.

          //START BUG-57354  CHERJ 12/21/2011
          // not needed
        },
        /*
                 @private- Creates and returns a Dom element used to create a new tab's content.
                 @return $Object$ - Instance of the tab content Dom element.
                 */
        _createTabContentElement: function() {
          /*var contentDiv = this.tabContentTemplate.cloneNode(true);
                     return contentDiv;*/
        },
        focusHost: function(module) {
          this.moduleView.set("activeModule", module);
          this.resizeHostContent({});
        },
        getElement: function() {
          return this.moduleView.get("element");
        },
        getHostToFocus: function(index) {
          var mruItem = this.mruCacheObj.getItem(),
              nextHost;
          // BUG-69649 05/10/2012 GUJAS1 Remove dead MRU entries while chosing the next tab to focus.
          while (mruItem) {
            if (dom.inDocument(this.getHostElement(mruItem.data))) {
              break;
            }
            this.mruCacheObj.deleteItem(mruItem.id);
            mruItem = this.mruCacheObj.getItem(mruItem);
          }
          nextHost = mruItem ? mruItem.data : this.getHost(index);
          return nextHost;
        },
        getHostIndex: function(module) {
          //console.log("Get Document Index");
          return this.moduleView.getIndex(module)
        },
        getHost: function(index) {
          return this.moduleView.getModule(index);
        },
        getActiveHost: function() {
          return this.moduleView.get("activeModule");
        },
        getHostContentElement: function(module) {
          //console.log("Get Document Content Element");
          return module.get("body").get("element");
        },
        getHostElement: function(module) {
          //console.log("Get Document Element");
          return module.get("head").get("element");
        },
        getHostsArray: function() {
          return this.moduleView.get("modules");
        },
        getHostsArrayLength: function() {
          var result = this.getHostsArray().length;
          return result;
        },
        setHostLabel: function(module, label) {
          var head = module.get("head");
          head.Label = label;
          var headElement = this.getHostElement(module),
              headLabelElement = domGetElementsByAttribute(DATA_STL, ASTERISK, SPAN_TAG_NAME, headElement),
              applyWidthFix = false;

          if (label.length > 16) {
            label = label.substring(0, 13) + "...";
            applyWidthFix = true;
          }

          if (headLabelElement.length > 0) {
            headLabelElement = headLabelElement[0];
            headLabelElement.style.cursor = "pointer";
            dom.setInnerText(headLabelElement, label);
          }
        },
        getHostLabel: function(module) {
          var head = module.get("head");
          var label = head.Label,
              headElement;
          if (!label) {
            label = "";
            headElement = this.getHostElement(module);
            var headLabel = domGetElementsByAttribute(DATA_STL, ASTERISK, SPAN_TAG_NAME, headElement);
            if (headLabel.length > 0) {
              label = dom.getInnerText(headLabel[0]);
            }
            head.Label = label;
          }
          return label;
        },
        setHostIcon: function(module, iconPath, iconTitle) {
          var head = module.get("head");
          var headElement = this.getHostElement(module),
              headIconElement = domGetElementsByAttribute(DATA_WI, ASTERISK, IMG_TAG_NAME, headElement),
              headIconStyle;
          if (headIconElement.length > 0) {
            headIconElement = headIconElement[0];
            if(iconPath.slice(-4) === ".svg") {
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
              };
              xhr.send();
            } else {
              headIconElement.src = iconPath;
              // 06/22/2012 GUJAS1 BUG-74426: Preserve icon title
              if (iconTitle) {
                headIconElement.title = headIconElement.alt = iconTitle;
              }
              headIconStyle = headIconElement.style;
              headIconStyle.display = "inline";
              //headIconStyle.marginRight = "3" + PX;
              headIconStyle.verticalAlign = "middle";
            }
            headIconStyle.iconPath = iconPath;
          }
        },
        getHostIcon: function(module) {
          var head = module.get("head");
          var headElement = this.getHostElement(module),
              headIconElement = domGetElementsByAttribute(DATA_WI, ASTERISK, IMG_TAG_NAME, headElement),
              icon = NULL;
          if (headIconElement.length > 0) {
            icon = headIconElement[0].src;
          }
          return icon;
        },
        setHostTitle: function(module, title) {
          title = title || "";
          module.get("head").set(TITLE, title);
          module.get("head").ToolTip = title;
        },
        getHostTitle: function(module) {
          return module.get("head").ToolTip;
        }
      },
      tabProto = {
        init: function() {

          this.startTrackingMRU();

          var tabGroupDiv = domGetElementsByAttribute(TAB_GROUP_ID, ASTERISK, DIV_TAG_NAME, this.WADiv);

          var tabViewMap = pud.tabViewMap;
          if (!tabViewMap) {
            return NULL;
          }

          if (tabGroupDiv.length <= 0) {
            return NULL;
          }
          this.parseDynamicContainerDefinitionTabs(tabViewMap);
          this.tabGroupDiv = tabGroupDiv[0];
          var tabGroupDivId = this.tabGroupDiv.id;
          this.tabPosition = this.tabGroupDiv.getAttribute(POS_ATTRIB);
          this.stretchedTabs = dom.hasClass(this.tabGroupDiv, STRETCHED_TABS);

          this.tabView = tabViewMap[tabGroupDivId];
          if (!this.tabView) {
            return NULL;
          }
          var staticHostArray = this.getHostsArray(),
              hostLen = this.getHostsArrayLength(),
              i,
              curHost,
              curHostContentElement;

          this.hostIndex = hostLen + 1;
          for (i = 0; i < hostLen; i++) {
            curHost = staticHostArray[i];
            var label = this.getHostLabel(curHost);
            if (label != "") {
              curHost.key = label;
            }
            this.setHostLabel(curHost, label);
            /*BUG-133117 : Added label check to be readable by JAWS and updating tile only if label is empty. */
            if (label)
              this.setHostTitle(curHost, label);
            /*
                 Registering tabContentAccessibilityHandler for static Tabs.
                 */
            var contentDocument = this.getHostContentElement(curHost);
            pega.util.Event.addListener(contentDocument, "keyup", pega.u.d.tabContentAccessibilityHandler, curHost);
            if (dom.hasClass(document.body, "with-fixed-header")) {
              if (curHostContentElement = this.getHostContentElement(curHost)) {
                var hTemp = domGetElementsByAttribute('harnessNm', ASTERISK, DIV_TAG_NAME, curHostContentElement);

                if (hTemp) {
                  hTemp = hTemp[0];

                  if (!hTemp) {
                    dom.addClass(curHostContentElement, "static-dc-tab");




                  }
                }
              }
            }
          }

          this.tabHeaderTemplate = this._getHeaderTemplate();
          this.tabContentTemplate = this._getContentTemplate();
        },
        startTrackingMRU: function() {
          this.mruCacheObj = pega.ui.mru;//new MRUCache();
        },
        parseDynamicContainerDefinitionTabs: function(tabViewMap) {
          var tabView, tabs, tabCount, tabIndex, tab, tabElement, activeTab;
          for (tabView in tabViewMap) {
            tabView = tabViewMap[tabView];
            tabs = tabView.get("tabs");
            tabCount = tabs.length;
            for (tabIndex = 0; tabIndex < tabCount; tabIndex++) {
              tab = tabs[tabIndex];
              tabElement = tab.get("element");
              if (tabElement.getAttribute("data-dcdt") == "true") {
                //BUG-75482 (RAIDV) : If Dynamic tab is default active, set first tab as default
                activeTab = tabView.get(ACTIVE_TAB);
                if (activeTab == tab) {
                  tabView.set('activeIndex', 0);
                }
                tabView.removeTab(tab, true);
                break;
              }
            }
          }
        },
        setWADivReference: function(eleRef) {
          this.WADiv = eleRef;
        },
        getGroupDiv: function() {
          return this.tabGroupDiv;
        },
        getView: function() {
          return this.tabView;
        },
        getHeaderHeight: function() {
          var tabGroupSibling, nonWALayoutHeight = 0, tabGroupDiv = this.tabGroupDiv;
          tabGroupSibling = tabGroupDiv.parentNode.parentNode.firstChild;
          while (tabGroupSibling) {
            if (tabGroupSibling.nodeType == 1 && tabGroupSibling != tabGroupDiv.parentNode) {
              nonWALayoutHeight += tabGroupSibling.offsetHeight;
              this._hasWASiblings = true;
            }
            tabGroupSibling = tabGroupSibling.nextSibling;
          }
          return nonWALayoutHeight;
        },
        hasWASiblings: function() {
          return this.hasWASiblings;
        },
        attachHostHandlers: function(noScriptResize) {
          var ACTIVE_TAB_CHANGE = "activeTabChange";
          var tabView = this.tabView;
          if (!noScriptResize) {
            tabView.on(ACTIVE_TAB_CHANGE, this.resizeHostContent, null, this);
          }
          if(pega.u.d.SET_WINDOW_TITLE !== false) {
            tabView.on(ACTIVE_TAB_CHANGE, pega.u.d.updateWindowTitle, null, this);
          }
          tabView.on(ACTIVE_TAB_CHANGE, triggerReflow, null, this);
          //tabView.on(ACTIVE_TAB_CHANGE, this.reinstateTabTitle, null, this);
          tabView.on(ACTIVE_TAB_CHANGE, this.updateItemMRUCache, null, this);
          //tabView.on('beforeActiveTabChange', this.switchCloseButton, null, this);
          //tabView.onBeforeShowMenu.subscribe(this.augmentMenuXMLObj);
        },
        /**
         Augments the dynamic container menu XML to include the dynamic container specific "Close All Tabs" functionality.
         Invoked through a custom event fired from tabview
         */
        augmentMenuXMLObj: function() {
          var xmlMenuNode = this.objMenuXML.documentElement.selectSingleNode("//Menu"),
              separatorNode, closeAllNode, waStrings, closeAllText;
          if (this.objMenuXML.createElementNS) {
            separatorNode = this.objMenuXML.createElementNS("", "Separator");
            closeAllNode = this.objMenuXML.createElementNS("", "Item");
          } else {
            separatorNode = this.objMenuXML.createNode(1, "Separator", "");
            closeAllNode = this.objMenuXML.createNode(1, "Item", "");
          }
          xmlMenuNode.appendChild(separatorNode);
          closeAllNode.setAttribute("Value", "CloseAll");
          waStrings = byID("pzWAStrings");
          if (waStrings) {
            closeAllText = waStrings.getAttribute("data-s6");
            closeAllText = closeAllText || "Close All";
          }
          closeAllNode.setAttribute("Caption", closeAllText);
          closeAllNode.setAttribute("Tooltip", closeAllText);
          closeAllNode.setAttribute("onClick", "pega.desktop.closeAllDocuments(event);");
          xmlMenuNode.appendChild(closeAllNode);
        },
        switchCloseButton: function(e) {
          var oldTab = e.prevValue,
              oldTabElement = this.getHostElement(oldTab),
              oldTabCloseIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, oldTabElement),
              newTab = e.newValue,
              newTabElement = this.getHostElement(newTab),
              newTabCloseIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, newTabElement);
          if (oldTab == newTab) {
            return;
          }
          if (newTabCloseIcon && newTabCloseIcon.length > 0) {
            newTabCloseIcon = newTabCloseIcon[0];
            newTabCloseIcon.style.visibility = VISIBLE;
            newTabCloseIcon.style.display = INLINE_BLOCK;
          }
          if (oldTabCloseIcon && oldTabCloseIcon.length > 0) {
            oldTabCloseIcon = oldTabCloseIcon[0];
            oldTabCloseIcon.style.visibility = HIDDEN;
          }
        },
        attachStretchBehavior: function() {
          var staticHostArray = this.getHostsArray(),
              hostLen = this.getHostsArrayLength(), tabGroupDiv = this.tabGroupDiv;
          for (var i = 0; i < hostLen; i++) {
            var curHost = staticHostArray[i];
            var curHostContentElement = this.getHostContentElement(curHost);
            dom.addClass(curHostContentElement, STRETCH_IF_REQUIRED);
          }
          var tabsListCntr = dom.getChildrenBy(tabGroupDiv, function(el) {
            return dom.hasClass(el, "scrlCntr");
          })[0];
          if (tabsListCntr)
            dom.addClass(tabsListCntr, "reset-stretch-header");
          var tabsCntr = dom.getChildrenBy(tabGroupDiv, function(el) {
            return dom.hasClass(el, "yui-content");
          })[0];
          if (tabsCntr)
            dom.addClass(tabsCntr, RESET_STRETCH_HEIGHT);
        },
        attachCloseBehavior: function() {
          //this.tabView.on('beforeActiveTabChange', this.switchCloseButton, null, this);
        },
        attachCloseAllBehavior: function() {
          if (this.tabView.onBeforeShowMenu) { /* BUG-129580*/
            this.tabView.onBeforeShowMenu.subscribe(this.augmentMenuXMLObj);
          }
        },
        recreateHost: function() {
          //console.log("In Recreating the document");
        },
        closeHost: function() {
          //console.log("Close the Document");
        },
        replaceTab: function() {
          //console.log("Replace Tab");
        },
        getNextHostIndex: function() {
          return this.hostIndex++;
        },
        handleMaxHosts: function(message) {
          alert(message);
          return -1;
        },
        removeHost: function(tab, removeThread) {
          //console.log("Remove Tab");
          /*
             When the tab is closed
             1.Remove the item from the Doubly Linked List if it exists
             2.Remove the ID from the MRUCache.
             */
          var tabView = this.tabView;
          this.mruCacheObj.deleteItem(this.getHostElement(tab).id);
          /*RAIDV - keepActiveIndex sent as true because deferred harnesses, since they replace current tab, were firing defer action of next tab*/
          tabView.removeTab(tab, true);
          // Remove the content element event listeners so they do not get invoked when the "blank" action completes.
          pue.purgeElement(this.getHostContentElement(tab), true);
          pue.purgeElement(this.getHostElement(tab), true);
          tab = null;
          //tabView = null;
        },
        addHost: function(tabName, tabIndex, canClose, icon, tooltip, contentID, dynamicContainerID, isDeferred, closeHandler, dcCleanupCallback, removeGadget, isStaticHarnessWithoutTableFormat, threadName) {
          //console.log("Add Tab");
          // 1. Create Tab Header and Content Elements.
          // 2. Use YUI TabView.addTab to add a new Tab.
          if (!tabName) {
            tabName = "";
          }
          var tabView = this.tabView;
          var tabHeader = this._createTabHeaderElement(isDeferred, tabName, canClose, icon, tooltip, contentID, dynamicContainerID, isStaticHarnessWithoutTableFormat, threadName),
              tabContent = this._createTabContentElement(isDeferred), tabCloseIcon, tabElement, tabLabelElement,
              newTab = new ui.Tab({labelEl: tabHeader, contentEl: tabContent});
          if (typeof tabIndex == UNDEFINED) {
            tabIndex = this.getHostsArrayLength();
          }

          pega.util.Event.addListener(tabContent, "keyup", function(e) {
            if (e.keyCode == 9 && e.shiftKey == false) {
              //Bug-608654 Start
                var cDiv = pue.getTarget(e);
                var iframeEle = cDiv.getElementsByTagName("iframe")[0];
                if(typeof pega.u.d.tabEventOnDocContent === "function"){
                   return pega.u.d.tabEventOnDocContent(iframeEle);
                }
                if(pega.u.d.focusInsideIframe){
                 if(iframeEle.contentWindow.pega){
                    iframeEle.contentWindow.pega.u.d.focusFirstElement();
                    return;
                 }
                }
                var doc = iframeEle.contentDocument;

                var bdy = doc.body;
                bdy.tabIndex = 0;
                bdy.focus();
              //Bug-608654 End
            }




          });
          //Attaching KeyDown and KeyUp events on TabHeader.
          pega.util.Event.addListener(tabHeader, "keydown", pega.u.d.tabAccessibilityHandler);
          pega.util.Event.addListener(tabHeader, "keyup", pega.u.d.tabAccessibilityHandler);
          tabView.addTab(newTab, tabIndex);
          tabElement = this.getHostElement(newTab);
          tabCloseIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, tabElement);
          if (tabCloseIcon && tabCloseIcon.length > 0) {
            if (!canClose) {
              tabCloseIcon[0].parentNode.removeChild(tabCloseIcon[0]);
            } else {
              tabCloseIcon = tabCloseIcon[0];
              tabCloseIcon.Tab = newTab;
              pue.on(tabCloseIcon, "click", closeHandler, newTab);
            }
          }

          tabLabelElement = domGetElementsByAttribute(DATA_STL, ASTERISK, SPAN_TAG_NAME, tabElement);
          if (tabLabelElement && tabLabelElement.length > 0) {
            tabLabelElement = tabLabelElement[0];
            tabLabelElement.style.display = INLINE_BLOCK;
          }
          newTab.skipNextActivationSync = true;
          //tabView = null;//to unblock
          return newTab;
        },
        resizeHostContent: function(e) {
          if (pega.util.Dom.hasClass(document.body, "with-fixed-header")){
            return;
          }
          if (!pud.portal){
            return;
          }
          // BUG-68333 05/02/2012 GUJAS1 Store active tab separately for DOM check a few steps ahead.
          var activeHost = e.newValue || this.getActiveHost(),
              activeHostContentElement = this.getHostContentElement(activeHost),
              frameChild = activeHostContentElement.getElementsByTagName(IFRAME_TAG_NAME),
              activeHostStyle = activeHostContentElement.style,
              frameChildStyle,
              tabsWidth = 0,
              tabsHeight = 0,
              tabEl = this.getHostElement(activeHost),
              tabsListEl = tabEl.parentNode,
              tabListOverflow;
          // BUG-68333 05/02/2012 GUJAS1 If active tab is not in DOM, return.
          // This happens occasionally, e.g. when a heavy harness tab is activated
          // for the first time.
          if (!dom.inDocument(tabEl)) {
            return;
          }
          if (this.tabPosition == "Left" || this.tabPosition == "Right") {
            tabsWidth = tabsListEl.offsetWidth;
          } else {
            tabListOverflow = tabsListEl.style.overflow;
            tabsListEl.style.overflow = HIDDEN;
            tabsHeight = tabsListEl.scrollHeight;
            tabsListEl.style.overflow = tabListOverflow;
          }

          activeHostStyle.overflow = "auto";
          if (parseInt(activeHostStyle.width) != (newWidth - tabsWidth - hLayoutMargin)){
            activeHostStyle.width = (newWidth - tabsWidth - hLayoutMargin) + PX;
          }
          if (parseInt(activeHostStyle.height) != (newHeight - tabsHeight)) {
            activeHostStyle.height = (newHeight - tabsHeight) + PX;
            /* If tab content height is less than the tabgroup height then there is gap between tab header and content in nonIE browsers.
                 This is because min-height is set as 100%. So making both tabcontent and tabgroup div height same. */
            if (this.tabPosition == "Bottom" && !pue.isIE) {
              this.tabGroupDiv.style.height = (newHeight - tabsHeight) + PX;
            }
          }
          if (frameChild && frameChild[0]) {
            frameChild = frameChild[0];
            frameChildStyle = frameChild.style;
            if (frameChildStyle.visibility != VISIBLE) {
              frameChildStyle.visibility = VISIBLE;
            }
          }
        },
        updateItemMRUCache: function(e) {
          var prevTab = e.prevValue,
              nextTab = e.newValue,
              prevTabId = prevTab.get("element").id,
              nextTabId = nextTab.get("element").id;
          // BUG-69649 05/10/2012 GUJAS1 If the same tab is being switched to (happens sometimes),
          // no need to add to MRU.
          if (prevTab == nextTab) {
            return;
          }
          //Memory leak fix- check to make sure the tab is till in DOM
          if(dom.inDocument(prevTab.get("element"))) {
            this.mruCacheObj.addItem(prevTabId, prevTab);
          }
          this.mruCacheObj.addItem(nextTabId, nextTab);
        },
        reinstateTabTitle: function(e) {
          var tab = e.newValue,
              toolTip = this.getHostTitle(tab) || "";
          this.setHostTitle(tab, toolTip);
        },
        //* TAB Management API Begin *//
        /*
         @private- Initializes and returns the header template element used to create tabs.
         @return $Object$ - Instance of the header template Dom Element.
         */
        _getHeaderTemplate: function() {
          //There can be many HeaderTemplate in document or in a TabGroup when static tabs have section tabs.
          //Thus, always take the last template to be the correct one. Search for template only inside a WorkArea
          var genTabTemplate = domGetElementsById("HeaderTemplateList", this.tabGroupDiv.Id);
          return genTabTemplate[genTabTemplate.length - 1].firstChild.nodeValue;
        },
        /*
         @private- Initializes and returns the content template element used to create tab content.
         @return $Object$ - Instance of the content template Dom Element.
         */
        _getContentTemplate: function() {
          // BUG-75612 : Added byID(tabGroupDivId) as parameter. This will return the correct template.
          var genContentTemplate = domGetElementsById("BodyTemplate", this.tabGroupDiv.Id),
              cntEl = genContentTemplate[genContentTemplate.length - 1].cloneNode("true");
          cntEl.id = "";
          return cntEl;
        },
        /*
         @private- Creates and returns a Dom element used to create a new tab.
         @param $String$isDeferred –  Indicates if the tab represents a deferred document. This ensures the close icon is hidden.
         @param $String$label –  Label for the tab.
         @param $Boolean$show –  If true, display the indicator, hide it otherwise.
         @param $Boolean$canClose –  Reserved.
         @param $String$icon –  Reserved.
         @param $String$tooltip –  Reserved.
         @return $Object$ - Instance of the tab header Dom element.
         */
        _createTabHeaderElement: function(isDeferred, label, canClose, icon, tooltip, contentID, dynamicContainerID, isStaticHarnessWithoutTableFormat, threadName) {
          // TODO: Make use of icon and tooltip params.

          //START BUG-57354  CHERJ 12/21/2011
          var tabInd = this.getNextHostIndex(), headerEl = this.tabHeaderTemplate, tempDiv, closeIcon;
          //END BUG-57354  CHERJ 12/21/2011
          // BUG-300525 Fix changes
          if (isStaticHarnessWithoutTableFormat === true) {
            headerEl = '<li role = "tab" aria-selected="false" aria-label="{LBL}" tabindex="-1" section_index="{IND}" id="Tab{IND}" sel_prefix="tab-li-t-ns" class="tab-li tab-li-t tab-li-t-ns " ><span tabindex="-1" role="presentation" id="TABANCHOR"><span id="TABSPAN" class="textOut tab-span tab-span-t tab-span-t-ns"><span class="textMiddle">{LBL}</span></span></span></li>';
          }
          if (contentID && contentID != "")
            headerEl = headerEl.replace(/{IND}\"/g, "{IND}\" elementName =\"" + contentID + "\"");
          if (dynamicContainerID && dynamicContainerID != "")
            headerEl = headerEl.replace(/{IND}\"/g, "{IND}\" tabGroupName =\"" + dynamicContainerID + "\"");
          headerEl = headerEl.replace(/{IND}/g, tabInd);
          headerEl = headerEl.replace(/{LBL}/g, label);
          //Created temp div because template is a string and string cannot be added as an html element directly.
          tempDiv = document.createElement(DIV_TAG_NAME);
          tempDiv.innerHTML = headerEl;
          if(pega.u.d.customTabHeaderCache && pega.u.d.customTabHeaderCache[threadName]){  
            var headerSpan = tempDiv.querySelector("span[data-stl]");
            headerSpan.innerHTML = pega.u.d.customTabHeaderCache[threadName];
          }

          if (isDeferred) {
            closeIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, tempDiv);
            if (closeIcon && closeIcon[0]) {
              closeIcon = closeIcon[0];
              // BUG-111399 GUJAS1 07/11/2013 Don't hide close icons of deferred tabs.
              //closeIcon.style.visibility = HIDDEN;
            }
          }

          return dom.getFirstChild(tempDiv);
        },
        /*
         @private- Creates and returns a Dom element used to create a new tab's content.
         @return $Object$ - Instance of the tab content Dom element.
         */
        _createTabContentElement: function() {
          var contentDiv = this.tabContentTemplate.cloneNode(true);
          return contentDiv;
        },
        focusHost: function(tab) {
          var activeTab = this.tabView.getTab(this.tabView.get('activeIndex'));
          if (activeTab && activeTab.skipNextActivationSync) {
            delete activeTab.skipNextActivationSync;
          }
          this.tabView.set(ACTIVE_TAB, tab);
          /*
        tab.get('element').focus(); //BUG-139960
        */
        },
        getElement: function() {
          return this.tabView.get("element");

        },
        getHostToFocus: function(index) {
          var mruItem = this.mruCacheObj.getItem(),
              nextTab;
          // BUG-69649 05/10/2012 GUJAS1 Remove dead MRU entries while chosing the next tab to focus.
          while (mruItem) {
            if (dom.inDocument(this.getHostElement(mruItem.data))) {
              break;
            }
            this.mruCacheObj.deleteItem(mruItem.id);
            mruItem = this.mruCacheObj.getItem(mruItem);
          }
          nextTab = mruItem ? mruItem.data : this.getHost(index);
          if (this.tabView)
            this.tabView.hideTabsMenu();
          return nextTab;
        },
        getHostIndex: function(tab) {
          //console.log("Get Document Index");
          return this.tabView.getTabIndex(tab)
        },
        getHost: function(index) {
          return this.tabView.getTab(index);
        },
        getActiveHost: function() {
          return this.tabView.get(ACTIVE_TAB);
        },
        getHostContentElement: function(tab) {
          //console.log("Get Document Content Element");
          return tab.get(CONTENT_ELEMENT);
        },
        getHostElement: function(tab) {
          //console.log("Get Document Element");
          return tab.get("element");
        },
        getHostsArray: function() {
          return this.tabView.get("tabs");
        },
        getHostsArrayLength: function() {
          var result = this.getHostsArray().length;
          if (this._extraTabPresent()) {
            result--;
          }
          return result;
        },
        _extraTabPresent: function() {
          if (this.tabPosition == "Top" && !this.stretchedTabs) {
            return true;
          }
          return false;
        },
        setHostLabel: function(tab, label) {
          tab.label = label;
          var tabElement = this.getHostElement(tab),
              tabLabelElement = domGetElementsByAttribute(DATA_STL, ASTERISK, SPAN_TAG_NAME, tabElement),
              applyWidthFix = false;
          var ariaLabel = label;
          if($(tabElement).find(".iconCloseSmall").length && pud) {
            ariaLabel = label + " " + pud.fieldValuesList.get("DeleteTab");
          }
          tabElement.setAttribute("aria-label", ariaLabel);

          if (label.length > 16) {
            label = label.substring(0, 13) + "...";
            applyWidthFix = true;
          }

          if (tabLabelElement.length > 0) {
            tabLabelElement = tabLabelElement[0];
            tabLabelElement.style.cursor = "pointer";
            dom.setInnerText(tabLabelElement, label);
            if (applyWidthFix) {
              pud.fixTabsWidth(tabElement);
            }
            if (dom.hasClass(document.body, "with-fixed-header")) {
              if (this.tabGroupDiv && dom.hasClass(this.tabGroupDiv, "rotatedTabs")) {
                pud.fixRotate(this.tabView._tabParent, this.tabPosition.toUpperCase(), dom.hasClass(this.tabGroupDiv, "stretchedTabs"));
              }
            }
          }
          if (this.tabView){
            /* this.tabView.resizeTabsScroll();  */ //removed in HFix-20746
          }
        },
        getHostLabel: function(tab) {
          var label = tab.label,
              tabElement;
          if (!label) {
            label = "";
            tabElement = this.getHostElement(tab);
            var tabLabel = domGetElementsByAttribute(DATA_STL, ASTERISK, SPAN_TAG_NAME, tabElement);
            if (tabLabel.length > 0) {
              label = dom.getInnerText(tabLabel[0]);
            }
            tab.label = label;
          }
          return label;
        },
        setHostIcon: function(tab, iconPath, iconTitle) {
          var tabElement = this.getHostElement(tab),
              tabIconElement = domGetElementsByAttribute(DATA_WI, ASTERISK, IMG_TAG_NAME, tabElement),
              tabIconStyle;
          if (tabIconElement.length > 0) {
            tabIconElement = tabIconElement[0];
            if(iconPath.slice(-4) === ".svg") {
              var xhr = new XMLHttpRequest;
              xhr.open('get',iconPath,true);
              xhr.onreadystatechange = function(){
                if (xhr.readyState !== 4) return;
                var svg = xhr.responseXML.documentElement;
                svg = document.importNode(svg,true);
                svg.style.display = "inline";
                svg.style.verticalAlign = "middle";
                svg.style.marginRight = "3" + PX;
                tabIconElement.parentNode.appendChild(svg);
                tabIconElement.parentNode.removeChild(tabIconElement);
              };
              xhr.send();
            } else {
              tabIconElement.src = iconPath;
              // 06/22/2012 GUJAS1 BUG-74426: Preserve icon title
              if (iconTitle) {
                tabIconElement.title = tabIconElement.alt = iconTitle;
              }
              tabIconStyle = tabIconElement.style;
              tabIconStyle.display = "inline";
              tabIconStyle.marginRight = "3" + PX;
              tabIconStyle.verticalAlign = "middle";
            }
            tab.iconPath = iconPath;
          }
        },
        getHostIcon: function(tab) {
          var tabElement = this.getHostElement(tab),
              tabIconElement = domGetElementsByAttribute(DATA_WI, ASTERISK, IMG_TAG_NAME, tabElement),
              icon = NULL;
          if (tabIconElement.length > 0) {
            icon = tabIconElement[0].src;
          }
          return icon;
        },
        setHostTitle: function(tab, title) {
          title = title || "";
          tab.set(TITLE, title);
          tab.ToolTip = title;
        },
        getHostTitle: function(tab) {
          return tab.ToolTip;
        },
        AddDefferredHost: function() {
          //console.log("Add Deffered Tab");
        },
        LoadDefferredHost: function() {
          //console.log("Load Deffered Tab");
        },
        GetNextHostIndex: function() {
          //console.log("Get Next Document Index");
        },
        ResizeHostContent: function() {
          //console.log("Resize Document Content");
        },
        fixTabsOnBackgroundClick: function() {
          if (this.ViewType == "Tabbed" && dom.hasClass(this.tabGroupDiv, "rotatedTabs")) {
            pud.fixRotate(this.tabView._tabParent, this.tabPosition.toUpperCase(), dom.hasClass(this.tabGroupDiv, "stretchedTabs"));
          }
        }
      },
      /* TabDocumentView Objects Start Here - SJ*/
      TabDocumentView = function(viewType) {
        this.ViewType = viewType;
        this.hostIndex = 0;
      };

  NoHeadDocumentView.prototype = new BaseView();

  pega.extend(ModuleView, pega.util.Element,
              {
    initAttributes: function(attr) {
      if (attr.element != undefined) {
        this.setAttributeConfig('element', {value: attr.element});
      }

      /**
                     * The Tabs belonging to the TabView instance.
                     * @attribute tabs
                     * @type Array
                     */
      this.setAttributeConfig('modules', {
        value: [],
        readOnly: true
      });

      this.setAttributeConfig("lastActiveIndex", {
        value: attr.lastActiveIndex,
        method: function(value) {
          attr["lastActiveIndex"] = value;
        }
      });

      /**
                     * The index of the tab currently active.
                     * @attribute activeIndex
                     * @type Int
                     */
      this.setAttributeConfig("activeIndex", {
        value: attr.activeIndex,
        method: function(value) {
          this.set('activeModule', this.getModule(value));
        }
      });

      /**
                     * The tab currently active.
                     * @attribute activeTab
                     * @type YAHOO.widget.Tab
                     */
      this.setAttributeConfig("activeModule", {
        value: attr["activeModule"],
        method: function(module) {
          var activeModule = this.get("activeModule");

          if (module && !module.get("active")) {
            module.set("active", true);
            module.configVisible(null, [true]);
          }

          if (activeModule && activeModule !== module) {

            activeModule.set("active", false);
            activeModule.configVisible(null, [false]);
          }

          if (activeModule && module !== activeModule) { // no transition if only 1
            //this.contentTransition(module, activeModule);
          } else if (module) {
            module.set('contentVisible', true);

          }
        }
      });
    },
    getModule: function(index) {
      return this.get("modules")[index];


    },
    getIndex: function(module) {
      var index = null,
          modules = this.get('modules');
      for (var i = 0, len = modules.length; i < len; ++i) {
        if (module == modules[i]) {
          index = i;
          break;
        }
      }

      return index;
    },
    addModule: function(module, index) {
      var ELEMENT = "element",
          modules = this.get('modules'),
          Parent = this.get("element"),
          contentParent = this._contentParent,
          moduleElement = module.get("element"),
          contentEl = module.get("contentEl"),
          activeIndex = this.get("activeIndex"),
          before;
      if (moduleElement.getAttribute('elementName'))
        module.elementName = moduleElement.getAttribute('elementName');
      if (moduleElement.getAttribute('tabGroupName'))
        module.tabGroupName = moduleElement.getAttribute('tabGroupName');
      if (!modules) { // not ready yet
        this._queue[this._queue.length] = ['addModule', arguments];
        return false;
      }

      before = this.getModule(index - 1);
      index = (index === undefined) ? modules.length : index;

      modules.splice(index, 0, module);

      Parent.appendChild(moduleElement);

      if (!module.get("active")) {
        module.set('contentVisible', false, true); // hide if not active
        //if (index <= activeIndex) {
        //this.set("activeIndex", activeIndex + 1, true);
        //}
      } else {
        this.set("activeModule", module, true);
      }

      this.addListener.call(this, "click", this.DOMEventHandler);
    },
    removeModule: function(module) {
      //Add code to remove Module for Tabless DC.
      var modules = this.get("modules"),
          index = this.getIndex(module);
      modules.splice(index, 1);
      return;
    },
    DOMEventHandler: function(e) {
      var target = Event.getTarget(e),
          moduleParent = this.GroupDiv,
          modules = this.get('modules'),
          module,
          moduleEl;

      if (Dom.isAncestor(moduleParent, target)) {
        for (var i = 0, len = modules.length; i < len; i++) {
          moduleEl = modules[i].get("element");


          if (target == moduleEl || Dom.isAncestor(moduleEl, target)) {
            module = modules[i];
            break; // note break
          }
        }

        if (module) {
          module.fireEvent(e.type, e);
        }
      }
    },
    deselectModule: function(index) {
      if (this.getModule(index) === this.get("activeModule")) {
        this.set("activeModule", null);
      }
    },
    /**
                 * Makes the tab at the given index the active tab
                 * @method selectTab
                 * @param {Int} index The tab index to be made active
                 */
    selectModule: function(index) {
      this.set("activeModule", this.getModule(index));
    }
  });

  //pega.augment(ModuleElement, pega.util.Element );
  pega.extend(Module, ModuleElement, {
    initAttributes: function(el) {
      this.attr = {};
      this._functionList = {};
      if (typeof el == "string") {
        el = byID(el);
      }
      this.set("element", el);
      var head = new pega.util.Element(this.header);
      var body = new pega.util.Element(this.body);
      //head.set("element",this.head);


      this.set("head", head);
      this.set("body", body);
    },
    // Event listners for supporting tabless DC refresh
    on: function(evtName, evtHandler) {
      this._functionList[evtName] = evtHandler;
    },
    set: function(s, t) {
      this.attr[s] = t;
      if (s == "active") {
        if (this._functionList["activeChange"])
          this._functionList["activeChange"].call(this, {}, this);
      } else if (s == "activeChange") {
        if (this._functionList["activeChange"])
          this._functionList["activeChange"].call(this, {}, this);
      }
    },
    get: function(s) {
      return this.attr[s];

    }
  });

  TabDocumentView.prototype = new BaseView();

  pega.lang.augmentObject(TabDocumentView.prototype, tabProto);
  pega.lang.augmentObject(NoHeadDocumentView.prototype, NoHeadProto);

  BaseView.prototype.getActiveIndex = function() {
    return this.getView().get("activeIndex");
  }
  BaseView.prototype.getHostContentElement = function(tab) {
    //console.log("Get Document Content Element");
    return tab.get(CONTENT_ELEMENT);
  };

  BaseView.prototype.getHostElement = function(tab) {
    //console.log("Get Document Element");
    return tab.get("element");
  };

  ui.WorkAreaGadget = new function() {
    this.setSkipDocumentReload = function() {
      if (arguments.length > 0) {
        skipDocumentReload = (arguments[0] == "true") ? true : false;
      } else {
        skipDocumentReload = true;
      }
    };
    var pxWorkAreaDiv = NULL,
        groupDivId = NULL,
        view = NULL,
        maxDocuments = 8,
        sizing = SIZING_STRETCH,
        docIndex = 0,
        freeThreads = [],
        usedThreads = [],
        busyIndicator = {show: function() {
        }, hide: function() {
        }},
        busyIndicatorHandle = NULL,
        groupDiv = NULL,
        tabPosition = "top",
        nonWALayoutHeight = 0,
        hasWASiblings = false,
        maxDocumentsWarning = "You have reached the maximum limit of open documents",
        conflictDialogCaption = "Work Object Already Open",
        // 01/24/2012 GUJAS1 Removed braces around ID from template, they will be added inline if ID is present.
        conflictDialogTextTemplate = pega.u.d.multiDocConflictDialogTemplate || "{0}:{1}\n\n{2}{3} {4}\n\n{5}",
        conflictDialogNoDocTextTemplate = "{0}\n\n{1}",
        unsavedWorkCloseAllTextTemplate = "{0}\n\n{1}",
        confirmDirtyMessage = "",
        docPosition = NULL,
        stretchedTabs = false,
        isMultiView = true,
        singleDocumentGadget = NULL,
        singleDocumentThreadName = "OpenPortal",
        singleDocumentRuleName = NULL,
        singleDocumentRuleClass = NULL,
        singleDocumentRuleType = NULL,
        singleDocumentUsingPage = NULL,
        singleDocumentModel = NULL,
        pudf = NULL,
        isAttached = false,
        noScriptResize = false, /* TASK-115095 GUJAS1 08/31/2012 Flag stores state of no-script based resize (true if ON) */
        keyMap = {},
        insNameMap = {},
        /*
                 @private- Finds and initializes the TabView object used by pxWorkArea.
                 @return $Object$ - Returns TabView instance or null.
                 */
        findView = function() {

          var DCMode = pxWorkAreaDiv.getAttribute("data-mode");

          if (DCMode == "Tabbed") {
            view = new TabDocumentView("Tabbed");

          } else if (DCMode == "NoHeader") {
            view = new NoHeadDocumentView("NoHeader");
            TAB_GROUP_ID = "id";
            ASTERISK = "moduleGroupDiv";
            findSingleView();
          }

          view.setWADivReference(pxWorkAreaDiv);
          view.init();

          groupDiv = domGetElementsByAttribute(TAB_GROUP_ID, ASTERISK, DIV_TAG_NAME, pxWorkAreaDiv);
          ASTERISK = "*";
          if (groupDiv != null) {
            groupDiv = groupDiv[0];
          }
          tabPosition = groupDiv.getAttribute(POS_ATTRIB);

          initHandlers();

          return view;
        },
        /*
                 @private- Returns true if TabView is present and false if it cannot be located.
                 @return $Boolean$ - .
                 */
        isViewPresent = function() {
          if (view != NULL) {
            return true;
          }
          findView();
          return (view != NULL);
        },
        /*
                 @private- Returns true if an extra tab is present in the layout, false otherwise.
                 For certain Top positioned layouts, an extra tab is added towards the end to achieve style effects.
                 This tab is excluded from the WA tab count.
                 @return $Boolean$ - .
                 */

        /*
                 @private- Initializes pxWorkArea TabView and its related/dependent entities.
                 @return $void$ - .
                 */
        initHandlers = function() {

          var label,
              waStrings,
              applicationText, itemOpenText, confirmText,
              tabGroupSibling, centerLayoutEl, objLayout,
              // BUG-73757 GUJAS1 11/08/2012 Added missing variable declaration.
              gadgetParentDiv;

          maxDocuments = getMaxDocumentCount();
          maxDocsWarning = byID(WAMAXTABS).getAttribute("data-ml");

          waStrings = byID("pzWAStrings");
          if (waStrings) {
            conflictDialogCaption = waStrings.getAttribute("data-s2");
            applicationText = waStrings.getAttribute("data-s3");
            itemOpenText = waStrings.getAttribute("data-s4");
            confirmText = waStrings.getAttribute("data-s5");
            conflictDialogTextTemplate = conflictDialogTextTemplate.replace("{0}", applicationText)
              .replace("{4}", itemOpenText)
              .replace("{5}", confirmText);
            conflictDialogNoDocTextTemplate = conflictDialogNoDocTextTemplate.replace("{0}", conflictDialogCaption)
              .replace("{1}", confirmText);
          }

          // TASK-115095 GUJAS1 08/31/2012 JS resize only if noScriptResize is false.
          if (!noScriptResize) {
            if (pud.portal) {
              //*Resize Logic start *//
              centerLayoutEl = pud.portal.layoutObj.getUnitByPosition("center").body;
              objLayout = getPaddingAndBorderValues(centerLayoutEl);
              hPadding = objLayout.paddingLeft + objLayout.paddingRight;
              vPadding = objLayout.paddingTop + objLayout.paddingBottom;
              hBorder = objLayout.borderLeft + objLayout.borderRight;
              vBorder = objLayout.borderTop + objLayout.borderBottom;
              objLayout = getPaddingAndBorderValues(view.getGroupDiv());
              hPadding += (objLayout.paddingLeft + objLayout.paddingRight);
              vPadding += (objLayout.paddingTop + objLayout.paddingBottom);
              hBorder += (objLayout.borderLeft + objLayout.borderRight);
              vBorder += (objLayout.borderTop + objLayout.borderBottom);

              // Finding the total height of nonworkarea tabs layout. i.e total height of workarea div siblings.
              // tabGroupDiv.parentNode.parentNode is workarea div parent node.

              nonWALayoutHeight = view.getHeaderHeight();
              hasWASiblings = view.hasWASiblings();


              var sizes = pud.portal.layoutObj.getSizes();
              hLayoutMargin = sizes.center.w - centerLayoutEl.offsetWidth;
              vLayoutMargin = sizes.center.h - centerLayoutEl.offsetHeight;
              pud.registerResize(setResizeWidthHeight);
              /* BUG-74495 : If any attachment is open then tabs are going up. */
              if (isMultiView && !hasWASiblings) {
                pue.addListener(centerLayoutEl, 'scroll', resetHiddenScroll, centerLayoutEl, this);
              }
              pud.portal.layoutObj.on('resize', setResizeWidthHeight, this, true);
            }
          }
          else {
            // Roll out stretch-if-required to all static tabs
            view.attachStretchBehavior();
          }

          view.attachHostHandlers(noScriptResize);

          view.attachCloseBehavior();
          view.attachCloseAllBehavior();
        },
        rollStretchToAncestors = function() {
          // Roll out stretch-if-required in all parent elements upto Panel Set (determined by the class STRETCH_PANEL_CONTENT).
          var parentNode = pxWorkAreaDiv.parentNode;
          while (parentNode
                 && (!dom.hasClass(parentNode, STRETCH_IF_REQUIRED)
                     && !dom.hasClass(parentNode, STRETCH_PANEL_CONTENT))) {
            dom.addClass(parentNode, STRETCH_IF_REQUIRED);
            parentNode = parentNode.parentNode;
          }
        },
        /*
                 @private- Resets center layout unit scroll to top
                 @param $Object$e – The Layout unit "scroll" event object.
                 @param $Object$e – The Center layout element.
                 @return $void$ - .
                 */
        resetHiddenScroll = function(e, centerLayoutEl) {
          //BUG-77916 cherj added the following if block
          if (pxWorkAreaDiv && pxWorkAreaDiv.offsetHeight == 0){
            return;
          }
          centerLayoutEl.scrollTop = 0;
        },
        /*
                 @private- Tab's title/tooltip keeps on getting overwritten by the "active" property setter code.
                 This API restores the real tooltip text by fetching it from the ToolTip shadow property.
                 @param $Object$e – The TabView "activeTabChange" event object.
                 @return $void$ - .
                 */


        /*
                 @private- Ensures that the Close button is only displayed on the "active" tab.
                 US-26228 - Close button shown on all tabs to enable single click close of tabs
                 @param $Object$e – TabView "activeTabChange" event object.
                 @return $void$ - .
                 */
        switchCloseButton = function(e) {
          var oldTab = e.prevValue,
              oldTabElement = getTabElement(oldTab),
              oldTabCloseIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, oldTabElement),
              newTab = e.newValue,
              newTabElement = getTabElement(newTab),
              newTabCloseIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, newTabElement);
          if (oldTab == newTab) {
            return;
          }
          if (newTabCloseIcon && newTabCloseIcon.length > 0) {
            newTabCloseIcon = newTabCloseIcon[0];
            newTabCloseIcon.style.visibility = VISIBLE;
            newTabCloseIcon.style.display = INLINE_BLOCK;
          }
          if (oldTabCloseIcon && oldTabCloseIcon.length > 0) {
            oldTabCloseIcon = oldTabCloseIcon[0];
            /*
                         The following line of code is commented to enable single click close of tabs
                         */
            //oldTabCloseIcon.style.visibility = HIDDEN;
          }
        },
        /*
                 @private- Returns true if the DOM hierarchy is invalid and needs rebind.
                 @return $boolean$ - true if DOM heirarchy is invalid, false otherwise.
                 */
        needRebind = function() {
          if (!dom.inDocument(pxWorkAreaDiv)) {
            return true;
          }
          if (isMultiView) {
            if (!dom.isAncestor(pxWorkAreaDiv, view.getElement())) {
              return true;
            }
          }
          else {
            if (!dom.isAncestor(pxWorkAreaDiv, singleDocumentGadget)) {
              return true;
            }
          }
          return false;
        },
        /*
                 @private- pxWorkArea initialization code, which gets executed on document "load" event.
                 This method registers the WorkAreaGadget instance as a gadget with the
                 Desktop layer.
                 @return $void$ -.
                 */
        initialize = function() {

          if (!p.web || !p.web.api) {
            return;
          }
          if(pega.u.d.SET_WINDOW_TITLE !== false && !pega.u.d.portalDefaultTitle)
            pega.u.d.portalDefaultTitle = document.title;
          /* BUG-75482 (RAIDV) : Initialize must happen after iniatializeTabs of pega.u.d is executed. First initialize call will result in early return
                     but subsequent calls will register the tabView correctly */
          if (!isAttached) {
            isAttached = true;
            pud.attachOnload(function() {
              initialize.call(that);
            }, true);
          }
          webApi = p.web.api;
          var app = desktopSupport.getDesktopApplication(),
              gadgetPool = app ? app.gadgetPool : NULL,
              objGadget;
          pudf = pud.fieldValuesList;
          if (gadgetPool) {
            objGadget = gadgetPool.findAvailableGadget();
            if (objGadget) {
              // If the registered gadget is not this instance, return.
              if (this != objGadget) {
                //BUG-71915 (RAIDV) : Although, this tabView is not a workarea, but if nested TabView contains Dynamic tab, sanitation is necessary.
                parseDynamicContainerDefinitionTabs(pud.tabViewMap);
                return;
              }
              else {
                /*If the current instance is registered, check if rebind is required.
                                If rebind is not required, return.
                                BUG-75482 (RAIDV) : nullify all the containers so that they may be re-init after refresh
                                For MRU after F5 skipping modifyHarnessIncs call as for Static Harness Tabs case mru gets updated with static tab value.*/
                if (needRebind()) {
                  view = null;
                  singleDocumentGadget = null;
                } else if (!this.onBrowserRefresh) {
                  modifyHarnessIncs();
                  if(this.onBrowserRefresh == false){
                    //this.onBrowserRefresh = true;
                  }
                  return;
                } else{
                  return;
                }
              }
            }
          }

          if (!findWorkArea()) {
            return;
          }
          isMultiView = (pxWorkAreaDiv.getAttribute(MULTI_VIEW_ATTRIB) != "0");

          if (isMultiView) {
            if (!isViewPresent()) {
              return;
            }

            initializeThreadBuckets();
            /*BUG-71758: Harness load removes tab which must trigger MRU, so the code should get executed after MRU init. Switched calls of next two lines.
                        Updated docsRecreateInfo logic to first check whether docsRecreateInfo textare is present or not if it is present then call recreateDocuments API else modofyHarnessIncs API.
                        In launch portal case there will be empty textarea so added length < 1 check.
                        */
            //startTrackingMRU();

            /*custom header*/
            var customTabInfo = document.getElementById("customTabHeaderInfo");

            if(customTabInfo){
              pega.u.d.customTabHeaderCache  = {};
              pega.u.d.customTabHeaderCache  = JSON.parse(customTabInfo.textContent);
              customTabInfo.parentNode.removeChild(customTabInfo);
            }




            var docsRecreateInfo = document.getElementById("docsRecreateInfo");
            var docsRecreateInfoJSON = {};
            initBusyIndicator();
            if(docsRecreateInfo){
              docsRecreateInfoJSON = JSON.parse(docsRecreateInfo.textContent);
            }
            var count = 0;
            var isBackCompat = false;
            if(pega.util.Event.isIE > 8){
              isBackCompat = (document.compatMode === "BackCompat");
            }
            if(pega.util.Event.isIE <= 8 || isBackCompat){ /*FIX FOR BUG-192838 : changed if condition FROM ORIGINAL : if(pega.util.Event.isIE == 8 || isBackCompat)*/
              for (var i in docsRecreateInfoJSON) { 
                if (docsRecreateInfoJSON.hasOwnProperty(i)) { 
                  count++;
                }
              }
            } else { 
              count = Object.keys(docsRecreateInfoJSON).length; 
            }
            if (count < 1) {
              modifyHarnessIncs();
            } else if (docsRecreateInfo) {
              //this.onBrowserRefresh = true;
              recreateDocuments(docsRecreateInfoJSON);
              // BUG-98516 GUJAS1 03/26/2013 After loading the "refresh persisted" documents once, this list should be deleted
              //        This prevents re-processing of stale list when the initialize method is called during partial loads.
              docsRecreateInfo.parentNode.removeChild(docsRecreateInfo);
            }
          }
          else {
            initializeSingleDocumentMode();
          }

          if (this != objGadget) {

            // Set up the first register state.

            desktop.registerDocumentGadget(this);
            desktop.registerEventListener(DESKTOP_ACTION, onPortalEvent);

            this.gadgetAvailable = true;
            this.onGadgetDomReady = sendClearIndicatorEvent;
            this.onGadgetDomLoad = handleGadgetLoad;
            this.onGadgetClose = handleGadgetClose;
            // TASK-115095 GUJAS1 08/31/2012 Attach resize event handler only if noScriptResize is false
            if (!noScriptResize) {
              this.onGadgetResize = resizeTabContent;
            }

            // BUG-126378 GUJAS1 10/08/2013 Rebind pega.ui.WorkAreaGadget with DC instance in initialize method.
            ui.WorkAreaGadget = this;
          }

          // TASK-115095 GUJAS1 08/31/2012 Attach resize event handler only if noScriptResize is false
          if (!noScriptResize) {
            setResizeWidthHeight();
          }
          else {
            rollStretchToAncestors();
          }
        },
        startTrackingMRU = function() {
          if (typeof view.startTrackingMRU == "function") {
            view.startTrackingMRU();
          }
        },
        recreateDocuments = function(docsRecreateInfo) {
          var harCtxMgr = pega.ui.HarnessContextMgr;
          var docCount = docsRecreateInfo.length, docObj, activeIndex = 0, activeObj, index, host, liElement, strThreadId, threadIdPosition,
              sortTimeStamp = [],unsortTimeStamp = [],
              staticHarnessTabsIndex = [];
          //may need optimization
          if(getDocumentsArrayLength() == 0){
            //BUG-183495- to handle section refresh which has DC
            var recreateDocuments =false;
            for (index = 0; index < docCount; index++) {
              docObj = docsRecreateInfo[index];
              if(docObj["pyIsStatic"] == "false"){
                recreateDocuments = true;
                break;
              }
            }
            if(!recreateDocuments) 
              return;
          }
          var hasActiveDoc = false;
          for (index = 0; index < docCount; index++) {
            docObj = docsRecreateInfo[index];
            if(docObj["pyIsActive"] == "true"){
              hasActiveDoc = true;
              break;
            }
          }
          if(!hasActiveDoc && docsRecreateInfo && docsRecreateInfo.length > 0){
            docsRecreateInfo[activeIndex].pyIsActive = "true";
          }
          for (index = 0; index < docCount; index++) {
            docObj = docsRecreateInfo[index];
            // 04/-2/2013 GUJAS1: If pyThreadID is string, find the numerical thread ID from the string
            if (typeof docObj["pyThreadId"] == "string") {
              strThreadId = docObj["pyThreadId"];
              threadIdPosition = strThreadId.indexOf(TAB_THREAD);
              harCtxMgr.set("portalID",strThreadId.substring(0, threadIdPosition));
              if (threadIdPosition != -1) {
                threadIdPosition = threadIdPosition + TAB_THREAD.length;
              }
              docObj["pyThreadId"] = parseInt(strThreadId.substring(threadIdPosition));
            }

            if(window.gIsCustomTabHeaderEnabled && docObj["pyIsAssociateReqThread"] == "true" && docObj.pyRecordKeyExist != "true"){
              if (!pega.u.d.customTabHeaderCache) {
                pega.u.d.customTabHeaderCache = {};
              }
              var currentThread = pega.u.d.getThreadName();
              var newURL = pega.ctx.pxReqURI.replace(currentThread,docObj.pyThreadName);
              var safeURL = SafeURL_createFromURL(newURL);
              safeURL.put("pyActivity", "ReloadSection");
              safeURL.put("StreamName", "pyCustomDCTabSection");
              safeURL.put("StreamClass", "Rule-HTML-Section");
              safeURL.put("pzPrimaryPageName", docObj.pzPrimaryHarnessPageName);
              safeURL.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
              pega.u.d.customTabHeaderCache[docObj.pyThreadName]= httpRequestAsynch(safeURL.toURL(),"");
            }
            if (docObj["pyIsActive"] == "true") {
              activeIndex = docObj["pyIndex"] - 1;
              activeObj = docObj;
            }
            /*
                            If loading tab is Static Harness Document,then based on ViewType call addDeferredDoc or modifyHarnessIncs to load the deferred document only if it is active.
                            If it is inactive then push it into array and call addDeferredDoc API for registering loadDeferredDoc API.
                        */
            if (docObj["pyIsStatic"] == "false") { 
              pega.ui.WorkAreaGadget.onBrowserRefresh = true;
              docObj.isDefferedHost = true;
              addDeferredDoc(docObj, (docObj.pyIndex - 1));
            } else if (docObj["pyType"] == "Harness") {
              if(docObj["pyIsActive"] == "true"){
                if (view.ViewType != "NoHeader") {
                  docObj.isDefferedHost = true;
                  addDeferredDoc(docObj, (docObj.pyIndex - 1));
                } else {
                  modifyHarnessIncs();
                }
              } else {
                staticHarnessTabsIndex.push(index);
              }
            }
            //Updating timeStamps to recreate MRU after F5 case.
            var timeStamp = parseFloat(docObj["pyLastActiveTimeinMS"]);
            if(isNaN(timeStamp) || timeStamp == ""){ 
              timeStamp = 0;
            }
            sortTimeStamp.push(timeStamp);
            unsortTimeStamp.push(timeStamp);
          }
          sortTimeStamp.sort();
          // 04/02/2012 GUJAS1 If active index is more than the number of tabs present, reset it to 0 (first tab would become active)
          if (activeIndex > view.getHostsArrayLength() - 1) {
            activeIndex = 0;
          }
          //Check viewType for tabs and Tabless Dc and refractor useless code in case of tabless structures.
          var activeHost = view.getHost(activeIndex);     
          focusDocument(activeHost);

          for(var staticHarnessTabIndex in staticHarnessTabsIndex){
            var docObj = docsRecreateInfo[staticHarnessTabsIndex[staticHarnessTabIndex]];
            docObj.isDefferedHost = true;
            addDeferredDoc(docObj, (docObj.pyIndex - 1));
          }
          /*Re-creating MRU cache object based on pyLastActiveTimInMS value.*/
          for(var timeStamp in sortTimeStamp){
            if(timeStamp != 0){
              var index = $.inArray(sortTimeStamp[timeStamp],unsortTimeStamp);
              if(index > -1){
                var tabObject = view.getHost(index),
                    tabId = tabObject.get("element").id;

                view.mruCacheObj.addItem(tabId,tabObject);
              }
            }
          }
        },
        addDeferredDoc = function(docObj, index) {
          var label = docObj.pyLabel,
              iconPath = docObj.pyIconPath,
              contentId = docObj.pyElementName,
              dynamicContainerID = docObj.pyTabGroupName,
              threadName = docObj.pyThreadName,
              isStaticHarness = false,
              host = null;

          if(docObj["pyIsStatic"] == "false" && (docObj["pyType"] == "Harness" || docObj.pyParameters["harnessName"])){   
            host = addDocumentHost(label, index, true, null, null, contentId, dynamicContainerID, true, null, threadName);
            if(docObj.generatedKey != "true" && docObj.replaceCurrent != "true"){
              host.key = docObj.pyKey;                      
            }else{
              host.key = docObj.pyLabel;                      
            }
          } else {
            isStaticHarness = true;
            host = view.getHost(index);
          }
          if(docObj && docObj.pyRecordKeyExist == "true" && docObj.pyIsAssociateReqThread == "true"){
            host.shouldCreateAssociateRequestor = true;
          } 
          if (!(pega.u.d.customTabHeaderCache && pega.u.d.customTabHeaderCache[threadName]) && label && !isStaticHarness)
            setDocumentLabel(host, label);
          if (!(pega.u.d.customTabHeaderCache && pega.u.d.customTabHeaderCache[threadName]) && iconPath && (pud.trim(iconPath) != ""))
            setDocumentIcon(host, iconPath);

          host.pyStreamName = docObj.pyStreamName;
          host.ThreadId = docObj.pyThreadId;
          host.ThreadName = docObj.pyThreadName;
          host.docObj = docObj,
            threadID = docObj.pyThreadId;
          updateThreadBuckets(threadID);

          /*Updating skipNextActivationSync to false for sending pzUpdateClipboardModels call on loading a deffered tab by closing active document after F5.*/
          /*if (docObj["pyIsActive"] != "true") {
                        host.skipNextActivationSync = false;
                    }*/
          //host.on("activeChange", closingDocumentAfterF5, host);
          host.on("activeChange", loadDeferredDoc, host);
        },
        updateThreadBuckets = function(threadID) {
          if (threadID != undefined) {
            var threadCnt = freeThreads.length;
            for (var index = 0; index < threadCnt; index++) {
              if (freeThreads[index] == threadID) {
                freeThreads.splice(index, 1);
                break;
              }
            }
            usedThreads[threadID] = threadID;
          }
        },
        //Updated API's to be called based on action while opening that document before refresh for HA.
        loadDeferredDoc = function(e, host) {
          if (host.pyLoaded == true)
            return;
          var docObj = host.docObj,
              action = docObj.pyAction,
              index = docObj.pyIndex,
              harness = docObj.pyStreamName,
              pageName = docObj.pzPrimaryHarnessPageName,
              pageClass = docObj.pzPrimaryHarnessPageClass,
              threadID = docObj.pyThreadId,
              contentID = docObj.pyElementName,
              dynamicContainerID = docObj.pyTabGroupName,
              isStaticHarness = false,
              paramPage = docObj.pyParameters;
          // Bug-129400 - paramPage =  has typo. Now fixing typo and sending original params, after deleting some object properties like pyActivity, streamkeys etc.
          if(paramPage){
            delete paramPage.pyActivity;
            delete paramPage.streamKeys;
            delete paramPage.streamKeys2;
            delete paramPage.prevContentID;
            delete paramPage.prevRecordkey;
            delete paramPage.contentID;
            delete paramPage.dynamicContainerID;
            delete paramPage.action; //Should we delete pzHarnessID too ?
            delete paramPage.AJAXTrackID;  //BUG-139091 : Removing AJAXTrackID from parameter page.
            delete paramPage.PRXML;   //BUG-164374 : PRXML is appened to url if it is in params
            delete paramPage.pzTransactionId;  //BUG-169996 : Removing transaction ID from the parameter page as it is causing transaction id mismatch
            delete paramPage.pxCurrentTrackerValues;
            delete paramPage.currentFunctionsMap;
            delete paramPage.pyListViewOutput;
            delete paramPage.pyListViewIsEmbedded;
          }
          /*BUG-312968 and BUG-312408, fix can be avoided if a whitelist of parameters are retained instead of all*/
          for(var pName in paramPage){
            var pVal = paramPage[pName];
            if(pVal == null || pVal == undefined || pName.indexOf("selUniqMap")!=-1 || pName.indexOf("EXPANDEDSubSection")!=-1){
              delete paramPage[pName];
            }
          }
          /*
                    Calling closingDocumentAfterF5 API for making a close call to pzUpdateClipboardModels Activity to remove the closed entry from pyDisplay.
                    If loading document is Static Harness document then set onBrowserRefresh flag to false.
                    If static harness document is not loaded after login then setting key with label as it will load in the same document instead of creating a new one.
                    */
          if(docObj && host.removedDocumentIndex){
            closingDocumentAfterF5(e, host);
          }
          if(docObj["pyIsStatic"] == "true" && docObj["pyType"] == "Harness"){
            pega.ui.WorkAreaGadget.onBrowserRefresh = false;
            if(!host.key && host.label){
              host.key = host.label;
            }
            modifyHarnessIncs();
            return;
          }
          host.pyLoaded = true;
          if (action == "display" || action == "Display") {
            var pyActionAPI = docObj.pyActionAPI,
                hostName = docObj.pyLabel,
                readOnly = pyActionAPI.pyReadOnly,
                keyValue = pyActionAPI.pyKey,
                preActivity = pyActionAPI.pyActivity,
                preActivityParams = pyActionAPI.preActivityParams,
                model = pyActionAPI.model,
                harnessClass = pyActionAPI.pyCoverClass,
                harnessName = pyActionAPI.pyHarnessName,
                isLanding = docObj.openlanding,
                params = {};
            if(model){
              if(pyActionAPI.pyDataTransformDynamicParams){
                params.pyDataTransformDynamicParams = encodeURIComponent(pyActionAPI.pyDataTransformDynamicParams);
              }
              model = encodeURIComponent(model);
            }	
            if(preActivityParams){
              if(pyActionAPI.preActivityDynamicParams){
                   params.preActivityDynamicParams = encodeURIComponent(pyActionAPI.preActivityDynamicParams);
              }
              preActivityParams = encodeURIComponent(preActivityParams);
            }	
            params.replaceCurrent = false;
            params.isWAStaticHarness = false;   

            if(docObj["pyIsStatic"] == "true" && docObj["pyType"] == "Harness"){
              pega.ui.WorkAreaGadget.onBrowserRefresh = false;
              return;
            }   

            params.skipConflictCheck = true;
            params.ThreadId = threadID;
            params.fromLoadDeferDoc = true;

            if (isLanding == "" || isLanding == null) {
              params.isSHActionReplaceCurrent = (docObj.replaceCurrent == "true")?(docObj.pyRecordKeyExist != "true"?true:false):false;
              readOnly = (("0" == readOnly  || "false" == readOnly)?"false":"true");
             
              display(harnessName, harnessClass, pageName, readOnly, model, params, "", hostName, preActivity, preActivityParams, keyValue, readOnly, contentID, dynamicContainerID);
            } else {
              var levelA = pyActionAPI.levelA || "",
                  levelB = pyActionAPI.levelB || "",
                  levelC = pyActionAPI.levelC || "",
                  paramKeys = pyActionAPI.paramKeys,
                  customParams = {};
              if (typeof paramKeys != "undefined" && paramKeys) {
                paramKeys = paramKeys.replace(/&amp;/g, '&');
                var ar_paramKeys = paramKeys.split('&');
                for (var i = 0; i < ar_paramKeys.length; i++) {
                  var value = docObj.pyActionAPI[ar_paramKeys[i]];
                  customParams[ar_paramKeys[i]] = value;
                }
              }
              openLanding(harnessName, harnessClass, pageName, readOnly, model, "Display", levelA, levelB, levelC, params, "", hostName, contentID, dynamicContainerID, customParams, paramKeys);
            }
          } else if (docObj.pyRecordKeyExist == "true") {
            var key = docObj.pyRecordKey;
            openWorkByHandle(key, paramPage, null, contentID, dynamicContainerID, host);
          } else {
            displayOnPage(harness, pageName, pageClass, threadID, paramPage, contentID, dynamicContainerID, host);
          }
        },
        /*
                    This API is called to make a request to pzUpdateClipboardModel Activity to remove closed entry from pyDisplay page after F5.
                */
        closingDocumentAfterF5 = function(e, host){ 
          var docObj = {}, curTab = {}, removedtab = {}, dirtyTab = {};
          docObj = host.docObj;
          var tabIndex = docObj.pyIndex,
              removedDocumentIndex = host.removedDocumentIndex;
          if(removedDocumentIndex < tabIndex){
            tabIndex = tabIndex -1;
          }
          curTab = {
            "dynamicContainerID": docObj.pyTabGroupName,
            "tabIndex":  tabIndex,
            "label": docObj.pyLabel,
            "key": docObj.pyKey,
            "iconPath": docObj.pyIconPath,
            "className":docObj.pyClassName,
            "isDocumentKey": false
          };
          removedTab = {
            "tabIndex": removedDocumentIndex,
            "fromClosingDocumentAfterF5":true
          };
          dirtyTab = {
            prevContentID: host.removedDocumentName,
            prevRecordkey: host.removedDocumentKey,
            prevFormDirty: false
          };
          if(removedDocumentIndex == tabIndex && !host.skipNextActivationSync){
            host.skipNextActivationSync = true;
          }
          pud.sendReqToUpdateElementModal(curTab,"CLOSE",removedTab,dirtyTab);
          delete host.removedDocumentIndex;
          delete host.removedDocumentName;
          delete host.removedDocumentKey;                    
        },                

        findWorkArea = function() {
          if (!pxWorkAreaDiv || !dom.inDocument(pxWorkAreaDiv.parentNode)) {
            pxWorkAreaDiv = domGetElementsById("workarea");
            if (!pxWorkAreaDiv || pxWorkAreaDiv.length <= 0) {
              pxWorkAreaDiv = domGetElementsByAttribute(NODE_NAME, WORK_AREA_ID, DIV_TAG_NAME);
              if (pxWorkAreaDiv.length <= 0) {
                return NULL;
              }
            }

            pxWorkAreaDiv = pxWorkAreaDiv[0];

            // TASK-115095 GUJAS1 08/31/2012 Populate noScriptResize based on the style of pxWorkAreaDiv
            noScriptResize = dom.hasClass(pxWorkAreaDiv, STRETCH_IF_REQUIRED);
            pxWorkAreaDiv.setAttribute("data-nsr", noScriptResize);
            if (dom.hasClass(pxWorkAreaDiv, "with-fixed-header")) {
              dom.addClass(document.body, "with-fixed-header");
              var DCMode = pxWorkAreaDiv.getAttribute("data-mode");
              if (DCMode == "NoHeader" || (DCMode == "SingleView")) {
                // add class which sets bottom to 0px
                $(".screen-layout-region-main-middle").addClass("dc-screen-layout-region-main-middle-notab");
              } else {
                if (dom.hasClass(pxWorkAreaDiv, "dc-wrapper-left") || dom.hasClass(pxWorkAreaDiv, "dc-wrapper-right"))
                {
                  $(".screen-layout-region-main-middle").addClass("dc-screen-layout-region-main-middle-with-left-right-tabs");
                }
                else
                {
                  var tabFormat = pxWorkAreaDiv.getAttribute("data-tabformat");
                  $(".screen-layout-region-main-middle").addClass("dc-screen-layout-region-main-middle-tab");
                  if (tabFormat) {
                    tabFormat = tabFormat.toLowerCase();
                    $(".screen-layout-region-main-middle").addClass("dc-" + tabFormat + "-tabs");
                  }
                }
              }
            }
          }

          return pxWorkAreaDiv;
        },
        /*
                 @private- Initializes single view mode properties, finds single view DOM element
                 and loads default configured harness.
                 @return $void$ -.
                 */
        initializeSingleDocumentMode = function() {
          // Initialize confirm dirty message text
          confirmDirtyMessage = pudf.get(CONTINUE_WORK_WARNING) + "\n\n" + pudf.get(WISH_TO_CONTINUE);

          findSingleView();

          // Defer load the configured harness.
          if (singleDocumentGadget != NULL && singleDocumentRuleType == RULE_HTML_HARNESS) {
            runDefaultAction();
          }
        },
        /*
                 @private- Finds and returns single view DOM element.
                 @return $Object$ - Reference to single view DOM element, or NULL.
                 */
        findSingleView = function() {
          if (singleDocumentGadget) {
            webApi.removeGadget(singleDocumentGadget.getAttribute(PEGA_GADGET));
          }
          singleDocumentGadget = $(pxWorkAreaDiv).children().first()[0];
          if (singleDocumentGadget == NULL) {
            singleDocumentGadget = document.createElement(DIV_TAG_NAME);
            pxWorkAreaDiv.appendChild(singleDocumentGadget);
          }
          // Initialize the variables to hold default document details.
          // Initialize IAC gadget with the single view DIV. This gadget is used in future WA API actions.
          // As part of the gadget initialization, add close event handler as well.

          var threadName = pxWorkAreaDiv.getAttribute("data-threadname"),
              // BUG-73757 GUJAS1 11/08/2012 Added busy indicator support to single view DC.
              gadgetParentDiv;
          if (threadName != NULL && threadName != "") {
            singleDocumentThreadName = threadName;
          }
          // BUG-75194 07/06/2012 GUJAS1 Default to DC parent's thread if no thread name is provided.
          else {
            var portalID = pega.ctx.portalID;
            if (portalID != null && portalID != "") {
              singleDocumentThreadName = portalID + TAB_THREAD+"0";
            }else {
              singleDocumentThreadName = TAB_THREAD+"0";
            }
            //singleDocumentThreadName = pud.getThreadName();
          }
          singleDocumentRuleName = pxWorkAreaDiv.getAttribute("data-documentname");
          singleDocumentRuleClass = pxWorkAreaDiv.getAttribute("data-documentclass");
          singleDocumentRuleType = pxWorkAreaDiv.getAttribute("data-documenttype").toLowerCase();
          singleDocumentUsingPage = pxWorkAreaDiv.getAttribute("data-documentusingpage");
          singleDocumentModel = pxWorkAreaDiv.getAttribute("data-documentmodel");

          /*
                     singleDocumentGadget.setAttribute("data-threadname", singleDocumentThreadName);
                     singleDocumentGadget.setAttribute("data-documentname", singleDocumentRuleName);
                     singleDocumentGadget.setAttribute("data-documentclass", singleDocumentRuleName);
                     singleDocumentGadget.setAttribute("data-documenttype", singleDocumentRuleType);
                     singleDocumentGadget.setAttribute("data-documentusingpage", singleDocumentUsingPage);
                     */
          singleDocumentGadget.setAttribute(PEGA_GADGET, PEGA_PR + singleDocumentRuleName);
          singleDocumentGadget.setAttribute("PegaResize", "fill");
          // BUG-73757 GUJAS1 11/08/2012 Invoke onload handler to clear busy indicator.
          singleDocumentGadget.setAttribute(PEGA_E_ON + "Load", PEGA_UI_WAGADGET + "onGadgetDomLoad");
          singleDocumentGadget.setAttribute(PEGA_E_ON + "Close", PEGA_UI_WAGADGET + "onGadgetClose");
          singleDocumentGadget.setAttribute("id", PEGA_PR + singleDocumentRuleName);
          // BUG-71338 06/06/2012 GUJAS1 Set Thread Name attribute always, irrespective of
          // wether a section or a harness is configured in Single Doc DC.
          singleDocumentGadget.setAttribute(PEGA_THREAD, singleDocumentThreadName);

          if (singleDocumentRuleType == RULE_HTML_HARNESS) {
            singleDocumentGadget.setAttribute("PegaA_harnessName", singleDocumentRuleName);
            singleDocumentGadget.setAttribute("PegaA_className", singleDocumentRuleClass);
          }

          // TASK-115095 GUJAS1 08/31/2012 Attach resize event handler only if noScriptResize is false
          if (!noScriptResize) {
            singleDocumentGadget.setAttribute(PEGA_E_ON + "Resize", PEGA_UI_WAGADGET + "onGadgetResize");
          }

          webApi.addGadget(singleDocumentGadget, window);
          // BUG-73757 GUJAS1 11/08/2012 Initialize busy indicator.
          var dcmode = pxWorkAreaDiv.getAttribute('data-mode');
          if (ui.busyIndicator && dcmode != "NoHeader") {
            gadgetParentDiv = singleDocumentGadget;
            busyIndicator = new ui.busyIndicator('', true, gadgetParentDiv);
          }

          return singleDocumentGadget;
        },
        /*
                 @private- Backs up the default configured section info, if any, and then triggers the webApi action.
                 @return $void$ -.
                 */
        doSingleViewAction = function() {
          // If section is configured, backup the section node if it is being replaced.
          var childNodes = dom.getChildren(singleDocumentGadget),
              childNodesLength = childNodes.length, sectionElement = NULL, iframeElement = NULL, i = 0, childNode;
          for (; i < childNodesLength; i++) {
            childNode = childNodes[i];
            if (childNode.id == RULE_KEY && childNode.getAttribute(NODE_NAME) == singleDocumentRuleName) {
              sectionElement = childNode;
              continue;
            }
            if (childNode.tagName.toLowerCase() == IFRAME_TAG_NAME) {
              iframeElement = childNode;
            }
          }
          if (sectionElement) {
            sectionElement.style.display = NONE;
          }
          if (iframeElement) {
            iframeElement.style.display = BLOCK;
          }

          // BUG-73757 GUJAS1 11/08/2012 Trigger busy indicator before invoking action.
          setBusyIndicator(true);

          webApi.doAction.apply(webApi, arguments);
        },
        parseDynamicContainerDefinitionTabs = function(tabViewMap) {
          var tabView, tabs, tabCount, tabIndex, tab, tabElement, activeTab;
          for (tabView in tabViewMap) {
            tabView = tabViewMap[tabView];
            tabs = tabView.get("tabs");
            tabCount = tabs.length;
            for (tabIndex = 0; tabIndex < tabCount; tabIndex++) {
              tab = tabs[tabIndex];
              tabElement = tab.get("element");
              if (tabElement.getAttribute("data-dcdt") == "true") {
                //BUG-75482 (RAIDV) : If Dynamic tab is default active, set first tab as default
                activeTab = tabView.get(ACTIVE_TAB);
                if (activeTab == tab) {
                  tabView.set('activeIndex', 0);
                }
                tabView.removeTab(tab, true);
                break;
              }
            }
          }
        },
        modifyHarnessIncs = function() {
          var hostArr, i = 0, tabCt, hNm, hCls, label, dTfm, params = {}, fHost, hostCt;
          try {
            if (hostArr = view.getHostsArray()) {
              for (i = 0; i < hostArr.length; i++) {
                if (hostArr[i].focusRequired == true) {
                  fHost = hostArr[i];
                }
                if (hostCt = getDocumentContentElement(hostArr[i])) {
                  var hTemp = domGetElementsByAttribute('harnessNm', ASTERISK, DIV_TAG_NAME, hostCt);
                  if (hTemp) {
                    hTemp = hTemp[0];
                    if (hTemp && hTemp.id == "HarnessTab" && !hTemp.HarnessLoaded) {
                      hNm = hTemp.getAttribute("harnessNm");
                      hCls = hTemp.getAttribute("harnessCls");
                      dTfm = hTemp.getAttribute("dataTransfm");
                      label = view.getHostLabel(hostArr[i]);
                      params.skipConflictCheck = true;
                      params.isWAStaticHarness = true;
                      params.ThreadId = hostArr[i].ThreadId;
                      hTemp.HarnessLoaded = true;
                      //desktop.showHarness(label,hCls,hNm,"","","",false,null,false,true);
                      if (!fHost) {
                        for (var j = i + 1; j < hostArr.length; j++) {
                          if (hostArr[j].focusRequired == true) {
                            fHost = hostArr[j];
                          }
                        }
                      }
                      if (!fHost) {
                        display(hNm, hCls, null, "", dTfm, params, {}, label, "", "", "", "", hostArr[i].elementName, hostArr[i].tabGroupName);
                        syncDocumentElementInfo(hostArr[i]);
                      } else {
                        delete fHost.focusRequired;
                        if (fHost) {
                          focusDocument(fHost);
                        }
                      }
                    }
                  }
                }
              }

            }
          } catch (e) {
          }

        },
        /*
                 @private- Event handler for the "DesktopAction" event.
                 @param $Object$eventObj – The event metadata object.
                 @return $Boolean$ - The return value is not used at present.
                 */
        onPortalEvent = function(eventObj) {
          if (!findWorkArea()) {
            return false;
          }
          if (isMultiView && !isViewPresent()) {
            return false;
          }

          if (!isMultiView && (!singleDocumentGadget || !dom.inDocument(singleDocumentGadget)) && !findSingleView()) {
            return false;
          }

          var configObj = {},
              params = {},
              api = eventObj.get(API),
              key,
              paramObject,
              harnessClass,
              readOnly,
              preActivity,
              preActivityParams,
              keyValue,
              landingAction,
              levelA,
              levelB,
              levelC,
              landingPageTitle,
              page,
              model,
              name,
              queryString,
              wizardLabel,
              flow,
              insClass,
              id,
              workpool,
              index,
              reportClass,
              reportName,
              shortcutHandle,
              reportDisplayMode,
              reportAction,
              contentID,
              dynamicContainerID,
              hostName,
              harnessName,
              paramKeys;
          configObj.systemID = eventObj.get(SYSTEM_ID);
          configObj.appName = eventObj.get(APP_NAME);
          configObj.thread = eventObj.get("thread");
          params.label = eventObj.get(LABEL);
          params.skipConflictCheck = eventObj.get("SkipConflictCheck");
          params.isWAStaticHarness = eventObj.get("WAStaticHarness");
          params.reload = eventObj.get("reload");
          api = eventObj.get(API) || "";

          if(eventObj.get("tenantData")) {
            configObj.tenantData = eventObj.get("tenantData");
          }

          if(eventObj.get("paramsObj")) {
            configObj.paramsObj = eventObj.get("paramsObj");
          }

          switch (api) {
            case OPEN_RULE_BY_KEYS:
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              openRuleByKeys(eventObj, configObj, paramObject, contentID, dynamicContainerID);
              break;
            case OPEN_RULE_BY_CLASS_NAME:
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              openRuleByClassAndName(eventObj, configObj, paramObject, contentID, dynamicContainerID);
              break;
            case OPEN_RULE_SPECIFIC:
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              openRuleSpecific(eventObj, configObj, paramObject, contentID, dynamicContainerID);
              break;
            case OPEN_ASSIGNMENT:
              key = eventObj.get(PARAM);
              paramObject = eventObj.get("paramObject");
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              openAssignment(key, params, configObj, paramObject, contentID, dynamicContainerID);
              break;
            case OPEN_WORK_BY_HANDLE:
              key = eventObj.get(PARAM);
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              openWorkByHandle(key, params, configObj, contentID, dynamicContainerID);
              break;
            case OPEN_WORK_BY_URL:
              //BUG-511106:Handled in DC layer to pass dynamiccontainerID and contentID parameters for OpenWorkByURL case
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              eventObj.put("dynamicContainerID", dynamicContainerID);
              openWorkByURL(eventObj, params, configObj);
              break;
            case CREATE_NEW_WORK:
              flow = eventObj.get("FlowType");
              insClass = eventObj.get(PARAM);
              var customParam = {};
              var keys = eventObj.keys();

              for (var i in keys) {
                if (keys[i] != 'className' && keys[i] != 'HarnessVersion' && keys[i] != 'flowType' && keys[i] != 'api' && keys[i] != 'param' && keys[i] != 'version' && keys[i] != 'FlowType') {
                  customParam[keys[i]] = eventObj.get(keys[i]);
                }
              }

              if (!customParam["dynamicContainerID"] || customParam["dynamicContainerID"] == "") {
                customParam["dynamicContainerID"] = getDynamicContainerIDWithDefault(eventObj);
              }

              createNewWork(insClass, flow, params, configObj, customParam);
              break;
            case DISPLAY:
            case SHOW_HARNESS:
              hostName = eventObj.get(NAME);
              harnessClass = eventObj.get("ClassName") || eventObj.get("className");
              harnessName = eventObj.get("HarnessName") || eventObj.get("harnessName");
              page = eventObj.get(PAGE);
              model = eventObj.get(MODEL);
              readOnly = eventObj.get(READ_ONLY);
              preActivity = eventObj.get("preActivityName");
              preActivityParams = eventObj.get("preActivityParams");
              keyValue = eventObj.get(KEY);
              readOnly = eventObj.get("readOnly");
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              params.preActivityDynamicParams = eventObj.get("preActivityDynamicParams");
              params.pyDataTransformDynamicParams = eventObj.get("pyDataTransformDynamicParams");
              params.replaceCurrent = eventObj.get("replaceCurrent");
              params.bSubmit = eventObj.get("bSubmit");
              params.skipReload = eventObj.get("pySkipReload");
              display(harnessName, harnessClass, page, readOnly, model, params, configObj, hostName, preActivity, preActivityParams, keyValue, readOnly, contentID, dynamicContainerID);
              break;
            case OPEN_LANDING:
              harnessClass = eventObj.get("className");
              harnessName = eventObj.get("harnessName");
              landingAction = eventObj.get("Action");
              levelA = eventObj.get("levelA");
              levelB = eventObj.get("levelB");
              levelC = eventObj.get("levelC");
              var parameters = [];
              var customParam = eventObj.get("customParam");
              landingPageTitle = eventObj.get("landingPageTitle");
              page = eventObj.get(PAGE);
              model = eventObj.get(MODEL);
              readOnly = eventObj.get(READ_ONLY);
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              paramKeys = eventObj.get("paramKeys");
              if (eventObj.get("flowName")) {
                if (typeof (customParam) == "undefined") {
                  customParam = {};
                }
                customParam["flowName"] = eventObj.get("flowName");
              }
              openLanding(harnessName, harnessClass, page, readOnly, model, landingAction, levelA, levelB, levelC, params, configObj, landingPageTitle, contentID, dynamicContainerID, customParam, paramKeys);
              break;
            case REPORT_DEFINITION:
              reportClass = eventObj.get("ReportClass");
              reportName = eventObj.get("ReportName");
              shortcutHandle = eventObj.get("ShortcutHandle");
              contentID = eventObj.get("contentID");
              reportDisplayMode = eventObj.get("pyReportDisplay");
              reportAction = eventObj.get("ReportAction");
              params.replaceCurrent = eventObj.get("replaceCurrent");
              paramKeys = eventObj.get("ParamKeys");
              page = eventObj.get(PAGE);
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              reportDefinition(eventObj,reportClass,reportName,shortcutHandle,paramKeys,reportDisplayMode,reportAction,params.replaceCurrent,configObj,contentID,dynamicContainerID);
              break;
            case OPEN_WIZARD:
              name = eventObj.get(NAME);
              queryString = eventObj.get("queryString");
              wizardLabel = eventObj.get("wizardLabel");
              contentID = eventObj.get("contentId");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              if (wizardLabel) {
                openWizard(name, queryString, wizardLabel, params, contentID, dynamicContainerID);
              } else {
                openWizard(name, queryString, undefined, params, contentID, dynamicContainerID);
              }
              break;
            case OPEN_WORK_ITEM:
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              id = eventObj.get(PARAM);
              if (eventObj.get(WORK_POOL)) {
                workpool = eventObj.get(WORK_POOL);
              } else {
                workpool = desktopSupport.getCurrentWorkPool();
              }
              openWorkItem(id, workpool, params, configObj, contentID, dynamicContainerID);
              break;
            case "getNextWork":
              contentID = eventObj.get("contentID");
              dynamicContainerID = getDynamicContainerIDWithDefault(eventObj);
              getNextWorkItem(params, configObj, contentID, dynamicContainerID);
              break;
            case "showUserWorkList":
              harnessClass = "@baseclass";
              harnessName = "ShowUserWorklist";
              params.UserID = eventObj.get(PARAM);
              display(harnessName, harnessClass, null, null, null, params, configObj);
              break;
            case "refresh":
              refresh();
              break;
            case CLEAR_INDICATORS:
              clearAllIndicators();
              break;
            case WORK_LOADED:
              // NOP
              clearAllIndicators();
              break;
            case SET_DOCUMENT_LABEL:
              setActiveDocumentLabel(params.label);
              break;
            case SET_DOCUMENT_KEY:
              setActiveDocumentKey(eventObj.get('key'));
              break;
            case SUBMIT_DOCUMENT_CONTENT:
              submitDocumentContent(eventObj.get('callbackFn'));
              break;
            case CLOSE_ALL_DOCUMENTS:
              closeAllDocuments(eventObj.get("event"));
              break;
            case ACTIVATE:
              index = eventObj.get("index");
              index = parseInt(index);
              if (isNaN(index)){
                index = 0;
              }
              activateDocument(index);
              break;
            case UPDATE_RECENTLIST:
              updateRecentList(eventObj);
              break;
            default:
              alert("The api request - \"" + api + "\" is not handled.");
              clearAllIndicators();
              break;
          }
        },
        initBusyIndicator = function() {

          // BUG-122518 GUJAS1 10/03/2013 Added null check for initialization.
          if (pega.ui.busyIndicator && busyIndicator == null) {

            //gadgetParentDiv = gadgetParentDiv[0];
            busyIndicator = new pega.ui.busyIndicator('', true, null);

          }


        },
        /*
                 @private- Returns Dynamic Container ID if present in the safeURL. Otherwise returns it from the DC view.
                 @param $Object$safeURL – A SafeURL instance which has "dynamicContainerID" key/value.
                 @return $String$ - Dynamic Container ID.
                 */
        getDynamicContainerIDWithDefault = function(safeURL) {
          var result;
          //for single view, pass NULL
          if (!isMultiView) {
            return NULL;
          }
          /*
                     // Unless multiple dynamic containers happen, always read the DCID of the DC present.
                     // This ensures that stored (in recents etc) incorrect DCIDs do not cause elemtn model corruption.
                     if (safeURL) {
                     result = safeURL.get("dynamicContainerID");
                     }
                     */

          if (!result || result == "") {
            result = view.getElement().getAttribute("docGroupName");
            if (!result || result == "") {
              result = view.getElement().getAttribute("tabGroupName");
            }
          }
          return result;
        },
        setActiveDocumentLabel = function(label) {
          if (!isMultiView) {
            return;
          }
          label = label || "";
          var host = getActiveDocument();
          /*BUG-132348 : Commented setting key on host object.
                     host.key = label;
                     if (host.attribs) {
                     host.attribs.key = label;
                     }*/

          setDocumentLabel(host, label);
        },

        setActiveDocumentKey = function (key) {
          if (!isMultiView) {
            return;
          }
          key = key || "";
          var host = getActiveDocument();
          if (host.attribs) {
            host.attribs.key = key;
            host.key = key;
          }
        },

        getActiveSingleDocumentView = function() {
          if (singleDocumentRuleType == RULE_HTML_HARNESS) {
            return singleDocumentGadget;
          }
          else {
            var childNodes = dom.getChildren(singleDocumentGadget),
                childNodesLength = childNodes.length, sectionElement = NULL, iframeElement = NULL, i = 0, childNode;
            for (; i < childNodesLength; i++) {
              childNode = childNodes[i];
              if (childNode.id == RULE_KEY && childNode.getAttribute(NODE_NAME) == singleDocumentRuleName) {
                sectionElement = childNode;
                continue;
              }
              if (childNode.tagName.toLowerCase() == IFRAME_TAG_NAME) {
                iframeElement = childNode;
              }
            }
            if (iframeElement) {
              if (iframeElement.style.display != NONE) {
                return iframeElement;
              }
            }
            if (sectionElement) {
              if (sectionElement.style.display != NONE) {
                return sectionElement;
              }
            }

            return NULL;
          }
        },
        submitDocumentContent = function(fn) {
          if (isMultiView) {
            var host = getActiveDocument(),
                hostContentEle = getDocumentContentElement(host);
            pud.postData(hostContentEle, fn);
          }
          else {
            pud.postData(getActiveSingleDocumentView(), fn);
          }
        },
        displayOnPage = function(harnessName, page, pageClass, threadID, paramPage, contentID, dynamicContainerID, viewHost) {
          if (isMultiView) {
            var hostObj = viewHost.docObj,
                hostName = hostObj.pyLabel,
                // 07/08/2013 GUJAS1 Removed redundant "var".
                key = hostObj.pyKey,
                oSafeURL = new SafeURL(), i;
            // SE-53885 MITTV2 Remove parameter page params for displayOnPage (F5 case) to avoid sending unnecessary huge no. of params
            // as part of the GET request which will cause 400 Bad Request errors due to browser URL length limitations
            /*for (i in paramPage) {
              if (paramPage[i] !== null && paramPage[i] !== undefined){
                oSafeURL.put(i, paramPage[i]);
              }                           
            }*/
            // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
            // it accepts a post document close cleanup callback and arguments.
            // Changed relevant invocations to use a callback.
            if(paramPage && paramPage.ReadOnly !== undefined){
                           oSafeURL.put("ReadOnly", paramPage.ReadOnly);
                      }
            replaceDocument(viewHost,
                            hostName,
                            {close: YES, key: key},
                            {action: DISPLAY_ON_PAGE,
                             page: page, harnessName: harnessName, parameters: oSafeURL,
                             contentID: contentID, dynamicContainerID: dynamicContainerID, threadID: threadID, className: pageClass},
                            function(newDoc, iconPath) {
              if (iconPath && (pud.trim(iconPath) != "") && !(gIsCustomTabHeaderEnabled))
                setDocumentIcon(newDoc, iconPath);
            },
                            [hostObj.pyIconPath]
                           );

          } // end of "if (isMultiView)"
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }
            // TODO: Where are the vars declared preActivity, configObj, preActivityParams, params, model, readonly, harnessClass
            doSingleViewAction(singleDocumentGadget.id, DISPLAY, harnessName, harnessClass, page, readonly, model, params, configObj, preActivity, preActivityParams, contentID, dynamicContainerID);
          }

        },
        uuidQuadruplet = function() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        uuid = function() {
          return (uuidQuadruplet() + uuidQuadruplet() + "-" + uuidQuadruplet() + "-" + uuidQuadruplet()
                  + "-" + uuidQuadruplet() + "-" + uuidQuadruplet() + uuidQuadruplet() + uuidQuadruplet());
        },
        /*
                 @private- Helper method for the "display" API request.
                 @param $String$harnessName – Name/Purpose of the harness to be displayed.
                 @param $String$harnessClass – Applies To Class of the specified harness.
                 @param $String$page – Optional, Name of the clipboard page bound with the harness if applicable.
                 @param $String$readonly – Optional, If this parameter is specified, the harness gets loaded in read-only mode.
                 @param $String$model – Optional, Name of the data-transform to be applied.
                 @param $Object$params – Optional, Applicable parameters like Label of the doc.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $String$docName – Label for the Tab displaying the specified harness.
                 @param $String$preActivity – Optional, Name of an activity to execute before processing the specified harness.
                 @param $Object$preActivityParams – Optional, Parameters for the pre-activity.
                 @param $String$keyValue – Optional, INSHANDLE value of the harness rule.
                 @param $String$readonly – Optional, If this parameter is specified, the harness gets loaded in read-only mode.
                 This redundant parameter has been retained for compatibility with the existing code.
                 @return $void$ - .
                 */
        display = function(harnessName, harnessClass, page, readonly, model, params, configObj, hostName, preActivity, preActivityParams, keyValue, readOnly, contentID, dynamicContainerID) {
          if (!page){
            page = "";
          }
          if (!readonly){
            readonly = "";
          }
          if (!model){
            model = "";
          }
          if (!contentID) {
            contentID = uuid();
          }
          if (isMultiView) {
            if (!params.replaceCurrent) {
              focusWindow();

              var key = harnessClass + "|" + harnessName + "|" + configObj.systemID,
                  viewHost,
                  result, icon, iconPath, index,
                  // 06/22/2012 GUJAS1 BUG-74426: Preserve icon title
                  iconTitle = "",
                  closable = YES;
              if (hostName) {
                key = hostName;
              }
              viewHost = checkKeyConflict(key, configObj.systemID, params.isWAStaticHarness);
              if (viewHost) {
                // Ensure a replacement document uses existing tab's close preference as default
                closable = viewHost.attribs && viewHost.attribs.close ? viewHost.attribs.close : closable;
                //Work Area static harness should not - throw dirty check, close icon and snatch focus
                if (params.isWAStaticHarness) {
                  params.skipConflictCheck = params.isWAStaticHarness;
                  closable = "no";
                  if (viewHost.getElementsByTagName)
                    iconPath = (icon = viewHost.getElementsByTagName('img')[0]) ? icon.src : null;     //Preserve the doc icon and add it when doc is replaced
                  // 06/22/2012 GUJAS1 BUG-74426: Preserve icon title
                  if(viewHost.svgPath && viewHost.svgPath != ""){
                    iconPath = viewHost.svgPath
                  }
                  iconTitle = (icon) ? icon.title : "";
                  index = view.getHostIndex(viewHost);
                } else if (params.fromLoadDeferDoc != true) {
                  /*BUG-146792 : Skipping replaceDocument call 2 times as focusDocument internally calls replaceDocument in after F5.*/
                  if (params.skipReload == 'true' || viewHost.docObj) {
                    focusDocument(viewHost);                                      
                    return;
                  }
                } else if (params.fromLoadDeferDoc == true && !params.isSHActionReplaceCurrent) {
                  params.replaceCurrent = "true";
                }

                result = showConflictDialog(viewHost, hostName, params.skipConflictCheck);
                if (result == YES) {
                  // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
                  // it accepts a post document close cleanup callback and arguments.
                  // Changed relevant invocations to use a callback.
                  
                  replaceDocument(viewHost,
                                  hostName,
                                  {close: closable, key: key},
                                  {
                    action: DISPLAY, page: page, readOnly: readonly, model: model,replaceCurrent:params.replaceCurrent,
                    harnessName: harnessName, className: harnessClass,
                    configObj: configObj, preActivity: preActivity,
                    preActivityParams: preActivityParams, key: keyValue,
                    readOnly: readOnly, hostName: hostName, contentID: contentID, dynamicContainerID: dynamicContainerID,
                    // BUG-72276: GUJAS1 05/30 Pass WA Static Harness information
                    "isWAStaticHarness": params.isWAStaticHarness, paramObject:{pyDataTransformDynamicParams:params.pyDataTransformDynamicParams,preActivityDynamicParams:params.preActivityDynamicParams}, threadID: params.ThreadId || viewHost.ThreadId /* BUG-113315 GUJAS1 07/24/13 For harnesses, send current tab thread ID */
                  },
                                  function(newDoc, iconPath, iconTitle, isStaticHarness) {
                    if (isStaticHarness && iconPath) {
                      setDocumentIcon(newDoc, iconPath, iconTitle);
                    }
                  },
                                  [iconPath, iconTitle, params.isWAStaticHarness]);
                }
                else {
                  focusDocument(viewHost); 
                  clearAllIndicators();
                }
                return;
              }
              if (!hostName) {
                hostName = NEW;
              }

              viewHost = showDocumentInMultiView(hostName,
                                                 {close: YES, key: key},
                                                 {
                action: DISPLAY, page: page, readOnly: readonly, model: model,
                harnessName: harnessName, className: harnessClass,
                configObj: configObj, preActivity: preActivity,
                preActivityParams: preActivityParams, key: keyValue,
                readOnly: readOnly, hostName: hostName, contentID: contentID, dynamicContainerID: dynamicContainerID,
                // BUG-72276: GUJAS1 05/30 Pass WA Static Harness information
                 "isWAStaticHarness": params.isWAStaticHarness, threadID: params.ThreadId,paramObject:{pyDataTransformDynamicParams:params.pyDataTransformDynamicParams,preActivityDynamicParams:params.preActivityDynamicParams}
              },
                                                 -1,
                                                 function(newDoc, iconPath, iconTitle, isStaticHarness) {
                if (isStaticHarness && iconPath) {
                  setDocumentIcon(newDoc, iconPath, iconTitle);
                }
              },
                                                 [iconPath, iconTitle, params.isWAStaticHarness]);
            } else {
              viewHost = getActiveDocument();
              if (hostName) {
                key = hostName;
              }
              // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
              // it accepts a post document close cleanup callback and arguments.
              // Changed relevant invocations to use a callback.
              replaceDocument(viewHost,
                              hostName,
                              {close: YES, key: key},
                              {
                action: DISPLAY,
                page: page, readOnly: readonly, model: model, harnessName: harnessName, className: harnessClass, configObj: configObj,
                preActivity: preActivity, preActivityParams: preActivityParams, key: keyValue, readOnly: readOnly, hostName: hostName, contentID: contentID, dynamicContainerID: dynamicContainerID,replaceCurrent:true,paramObject:{pyDataTransformDynamicParams:params.pyDataTransformDynamicParams,preActivityDynamicParams:params.preActivityDynamicParams}
              },
                              function(newDoc, label) {
                if (newDoc && label) {
                  setDocumentLabel(newDoc, label);
                }
              },
                              [params.label]);
              return;
            }
            if (viewHost && params.label) {
              setDocumentLabel(viewHost, params.label);
            }
          } // end of "if (isMultiView)"
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }
            doSingleViewAction(singleDocumentGadget.id, DISPLAY, harnessName, harnessClass, page, readonly, model, params, configObj, preActivity, preActivityParams, keyValue, readOnly, hostName, undefined, undefined, undefined, undefined, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "openRuleByKeys" API request.
                 @param $String$insHandle – INSHANDLE of the rule to open.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $Object$paramObject – Optional, Extra parameters for the open action.
                 @return $void$ - .
                 */
        openRuleByKeys = function(params, configObj, paramObject, contentID, dynamicContainerID) {
          focusWindow();

          var bOptimize = true;
          if (params.hashtable) {
            var longKey = "";
            for (var key in params.hashtable) {
              if (key.substring(0, 2) == "py" || key == "pxObjClass" || key == "Purpose") {
                //BUG-126659:Updated the openRuleByKeys API, to remove the dot from parameter value
                if (key == "pyPropertyName" && params.hashtable[key].substr(0, 1) == ".") {
                  params.put(key, params.hashtable[key].substr(1));
                }
                longKey += "&" + key + "=" + params.hashtable[key];
                continue;
              }
            }
            if (keyMap[longKey]) {
              bOptimize = false;
            } else {
              keyMap[longKey] = true;
            }
          }

          if (bOptimize && isMultiView) {
            if (params.hashtable) {
              params.hashtable["ObjClass"] = params.hashtable["pxObjClass"];
            }
            params.put("Format", "harness");

            var gadgetParams = {action: OPEN_RULE_BY_KEYS, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                result,
                viewHost,
                label;

            label = 'Rule';

            viewHost = showDocumentInMultiView(label, {close: YES, hash: params.hashtable, format: 'harness'}, gadgetParams);

          } else {

            var oSafeURL = new SafeURL("@baseclass.pzGetRuleInfo", getReqURI());
             /* BUG-430362: IE Fix */
            var hashtable = pega.util.Event.isIE ? JSON.parse(JSON.stringify(params.hashtable)) : params.hashtable;
            var JSONString = JSON.stringify(hashtable, function(key, value) {
              if (key == "api") {
                return undefined;
              }
              return value;
            });
            oSafeURL.put("JSONKeys", JSONString);
            if (oSafeURL.toQueryString() == ""){
              return false;
            }
            var strUrl = oSafeURL.toURL();
            var callback = {
              success: function(oResponse) {
                var params = oResponse.argument.params, configObj = oResponse.argument.configObj;
                var oResponseText = oResponse.responseText;
                var args = JSON.parse(oResponseText);
                var formType = args.formType;
                //var launchInPopup = formType === 'Harness' ? false : true;
                var launchInPopup = false;
                if (args.output == "ERROR")
                  return;


                //Send only the keys starting with py
                if (params.hashtable) {
                  for (var key in params.hashtable) {
                    if (key.substring(0, 2) == "py" || key == "ObjClass" || key == "Purpose") {
                      continue;
                    }
                    delete params.hashtable[key];

                  }
                }

                if (launchInPopup) {

                  var objClass = params.get("pxObjClass");
                  var theParamsString = params;
                  theParamsString.put("ObjClass", objClass);
                  theParamsString.put("pyActivity", objClass + ".WBOpen");
                  pega.desktop.openUrlInWindow(theParamsString, "Rules");
                } else {
                  params.put("Format", "harness");
                  var hostKey = args.output,
                      gadgetParams = {action: OPEN_RULE_BY_KEYS, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                      result,
                      viewHost,
                      label;

                  label = 'Rule';
                  if (isMultiView) {
                    viewHost = checkKeyConflict(hostKey, configObj.systemID);
                    if (!viewHost) {
                      if (hostKey.substring(0, 5) == "ERROR") {
                        viewHost = showDocumentInMultiView(label, {close: YES, hash: params.hashtable, format: 'harness'}, gadgetParams);
                      } else {
                        viewHost = showDocumentInMultiView(label, {close: YES, key: hostKey, format: 'harness'}, gadgetParams);
                      }
                    } else {
                      focusDocument(viewHost);
                      clearAllIndicators();
                    }
                  } else {


                    if (!confirmDirtyReplace(singleDocumentGadget.id)) {
                      return;
                    }

                    doSingleViewAction(singleDocumentGadget.id, OPEN_RULE_BY_KEYS, {close: YES, key: hostKey, format: 'Harness'}, params, configObj, contentID, dynamicContainerID);
                  }

                }

              },
              failure: function(oResponse) {
              }
            };
            callback.argument = {params: params, configObj: configObj};
            pega.util.Connect.asyncRequest('GET', strUrl, callback);
          }
        },
        /*
                 @private- Helper method for "openRuleSpecific" API request.
                 @param $String$insHandle – INSHANDLE of the rule to open.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $Object$paramObject – Optional, Extra parameters for the open action.
                 @return $void$ - .
                 */
        openRuleSpecific = function(params, configObj, paramObject, contentID, dynamicContainerID) {

          //Invoked by openruleadvanced and myrules and fav.
          focusWindow();

          var oSafeURL = new SafeURL("@baseclass.pzGetRuleInfo", getReqURI());
          var insHandle = params.get('Handle'), openSpecificVersion;
          oSafeURL.put("InsHandle", insHandle);
          openSpecificVersion = params.get('OpenSpecificVersion');
          if (openSpecificVersion == undefined)
            openSpecificVersion = "false";
          oSafeURL.put("OpenSpecificVersion", openSpecificVersion);

          if (oSafeURL.toQueryString() == ""){
            return false;
          }
          var strUrl = oSafeURL.toURL();
          if (openSpecificVersion != "false") {
            var hostKey = insHandle,
                gadgetParams = {action: OPEN_RULE_SPECIFIC, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                result,
                viewHost,
                // TASK-128496 GUJAS1 11/23/2012 Set label to "Opening..." if it is not specified.
                label = params.get('pyPurpose') ? params.get('pyPurpose') : OPENING;

            if (isMultiView) {
              viewHost = checkKeyConflict(hostKey, configObj.systemID, UNDEFINED, contentID);
              if (!viewHost) {
                viewHost = showDocumentInMultiView(label, {close: YES, key: insHandle, format: 'harness'}, gadgetParams);
              } else {
                focusDocument(viewHost);
                clearAllIndicators();
              }
            } else {
              if (!confirmDirtyReplace(singleDocumentGadget.id)) {
                return;
              }

              doSingleViewAction(singleDocumentGadget.id, OPEN_RULE_SPECIFIC, {close: YES, key: hostKey, format: 'Harness'}, params, configObj, contentID, dynamicContainerID);

            }

          } else {
            var callback = {
              success: function(oResponse) {
                var params = oResponse.argument.params, configObj = oResponse.argument.configObj;
                var oResponseText = oResponse.responseText;
                var args = JSON.parse(oResponseText);
                if (args.output == "ERROR")
                  return;

                var formType = args.formType;
                //var launchInPopup = formType === 'Harness' ? false : true;
                var launchInPopup = false;
                if (launchInPopup) {

                  var params = params, configObj = configObj;
                  var strHandle = params.get("Handle");
                  if (strHandle.length > 0) {

                    var safekey = strHandle.replace(/\W/g, '_');
                    var oSafeURL = new SafeURL("WBOpenLaunch");
                    oSafeURL.put("InsHandle", strHandle);
                    oSafeURL.put("Action", "Open");
                    pega.desktop.openUrlInWindow(oSafeURL, safekey);
                  }
                  else {

                    window.status = "Can't open rule; no key.";
                  }
                } else {

                  var hostKey = args.output,
                      insHandle = params.get("Handle"),
                      gadgetParams = {action: OPEN_RULE_SPECIFIC, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                      result,
                      viewHost,
                      // TASK-128496 GUJAS1 11/23/2012 Set label to "Opening..." if it is not specified.
                      label = params.get('pyPurpose') ? params.get('pyPurpose') : OPENING;

                  if (isMultiView) {
                    viewHost = checkKeyConflict(hostKey, configObj.systemID, UNDEFINED, contentID);
                    if (!viewHost) {
                      //Updated InsKey to hostKey as we will be getting key as response from server.
                      viewHost = showDocumentInMultiView(label, {close: YES, key: hostKey, format: 'harness'}, gadgetParams);
                    } else {
                      focusDocument(viewHost);
                      clearAllIndicators();
                    }
                  } else {
                    if (!confirmDirtyReplace(singleDocumentGadget.id)) {
                      return;
                    }

                    doSingleViewAction(singleDocumentGadget.id, OPEN_RULE_SPECIFIC, {close: YES, key: hostKey, format: 'Harness'}, params, configObj, contentID, dynamicContainerID);

                  }
                }
              },
              failure: function(oResponse) {
              }
            };
            callback.argument = {params: params, configObj: configObj};
            pega.util.Connect.asyncRequest('GET', strUrl, callback);
          }

        },
        /*
                 @private- Helper method for "openRuleByClassAndName" API request.
                 @param $String$insHandle – INSHANDLE of the rule to open.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $Object$paramObject – Optional, Extra parameters for the open action.
                 @return $void$ - .
                 */
        openRuleByClassAndName = function(params, configObj, paramObject, contentID, dynamicContainerID) {
          // Invoked by App explorer and search gadget
          focusWindow();
          var insName = "";
          var bOptimize = true;
          if (params) {
            insName = params.get('insName').replace('&amp;', encodeURIComponent('&'));
            var longKey = "&InsName=" + insName + "&ClassName=" + params.get('objClass');
            if (insNameMap[longKey]) {
              bOptimize = false;
            } else {
              insNameMap[longKey] = true;
            }
          }

          if (bOptimize && isMultiView) {
            //var insName = params.get("insName");
            var gadgetParams = {action: OPEN_RULE_BY_CLASS_NAME, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                result,
                viewHost,
                label;

            label = insName.indexOf('!') > -1 ? insName.split('!')[1] : insName;


            viewHost = showDocumentInMultiView(label, {close: YES, insName: insName, objClass: params.get("objClass"), format: 'Harness'}, gadgetParams);


          } else {
            var oSafeURL = new SafeURL("@baseclass.pzGetRuleInfo", getReqURI());
            //var insName = params.get('insName');
            oSafeURL.put("InsName", insName);
            oSafeURL.put("ClassName", params.get('objClass'));

            if (oSafeURL.toQueryString() == ""){
              return false;
            }
            var strUrl = oSafeURL.toURL();
            var callback = {
              success: function(oResponse) {
                var params = oResponse.argument.params, configObj = oResponse.argument.configObj;
                var oResponseText = oResponse.responseText;
                var args = JSON.parse(oResponseText);
                if (args.output == "ERROR")
                  return;

                var formType = args.formType;
                //var launchInPopup = formType === 'Harness' ? false : true;
                var launchInPopup = false;
                var insName = "";
                if (launchInPopup) {
                  insName = encodeURIComponent((params.get('insName')).replace('&amp;', '&'));
                  var objClass = params.get("objClass");
                  if (insName.length > 0 && objClass.length > 0) {
                    var safekey = insName.replace(/\W/g, '_');
                    var oSafeURL = new SafeURL("WBOpenLaunch");
                    oSafeURL.put("InsName", insName);
                    oSafeURL.put("Action", "Open");
                    oSafeURL.put("ObjClass", objClass);
                    pega.desktop.openUrlInWindow(oSafeURL, safekey);
                  } else {
                    window.status = "Can't open rule; no name or class.";
                  }
                } else {
                  insName = ((params.get('insName')).replace('&amp;', '&'));
                  var hostKey = args.output,
                      gadgetParams = {action: OPEN_RULE_BY_CLASS_NAME, key: params, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                      result,
                      viewHost,
                      label;

                  label = insName.indexOf('!') > -1 ? insName.split('!')[1] : insName;
                  if (isMultiView) {
                    viewHost = checkKeyConflict(hostKey, configObj.systemID);
                    if (!viewHost) {
                      viewHost = showDocumentInMultiView(label, {close: YES, insName: insName, objClass: params.get("objClass"), format: 'Harness'}, gadgetParams);
                    }
                    else {
                      focusDocument(viewHost);
                      clearAllIndicators();
                    }
                  } else {
                    if (!confirmDirtyReplace(singleDocumentGadget.id)) {
                      return;
                    }
                    doSingleViewAction(singleDocumentGadget.id, OPEN_RULE_BY_CLASS_NAME, {close: YES, insName: insName, objClass: params.get("objClass"), format: 'Harness'}, params, configObj, contentID, dynamicContainerID);
                    //doSingleViewAction(singleDocumentGadget.id,OPEN_RULE_BY_CLASS_NAME, insName, params, configObj);
                  }
                }
              },
              failure: function(oResponse) {
              }
            };
            callback.argument = {params: params, configObj: configObj};
            pega.util.Connect.asyncRequest('GET', strUrl, callback);
          }
        },
        /*
                 @private- Helper method for "openAssignment" API request.
                 @param $String$insHandle – INSHANDLE of the rule to open.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $Object$paramObject – Optional, Extra parameters for the open action.
                 @return $void$ - .
                 */
        openAssignment = function(insHandle, params, configObj, paramObject, contentID, dynamicContainerID) {
          focusWindow();

          if (isMultiView) {
            var idx_start = insHandle.indexOf(' '),
                idx_end = insHandle.indexOf('!'),
                hostKey = insHandle.substring(idx_start + 1, idx_end),
                gadgetParams = {action: OPEN_ASSIGNMENT, key: insHandle, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                result,
                viewHost;
            if (paramObject && typeof (paramObject) == "object") {
              gadgetParams.paramObject = paramObject;
            }
            viewHost = checkKeyConflict(hostKey, configObj.systemID);
            if (!viewHost) {
              viewHost = showDocumentInMultiView(ASSIGNMENT, {close: YES, key: hostKey}, gadgetParams);
            }
            else {
              focusDocument(viewHost);
              /*BUG-146792 : Skipping replaceDocument call 2 times as focusDocument internally calls replaceDocument in after F5.*/
              if (!viewHost.docObj) {
                if(params.reload == "true"){
                  params.skipConflictCheck = "true";
                }
                // GUJAS1 09/03/2013 Added conflict check skip suppport
                result = showConflictDialog(viewHost, NULL, params.skipConflictCheck == "true");
                if (result == YES) {
                  // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
                  // it accepts a post document close cleanup callback and arguments.
                  // Changed relevant invocations to use a callback.
                  replaceDocument(viewHost,
                                  ASSIGNMENT,
                                  {close: YES, key: hostKey},
                                  gadgetParams,
                                  function(newDoc) {
                    focusDocument(newDoc);
                  });
                } else {
                  clearAllIndicators();
                }
              }
            }
          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }

            doSingleViewAction(singleDocumentGadget.id, OPEN_ASSIGNMENT, insHandle, params, configObj, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "openWorkByHandle" API request.
                 @param $String$insHandle – INSHANDLE of the rule to open.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @return $void$ - .
                 */
        openWorkByHandle = function(insHandle, params, configObj, contentID, dynamicContainerID, viewHost) {
          focusWindow();
          if (isMultiView) {
            if (!viewHost) {
              viewHost = checkKeyConflict(insHandle, configObj.systemID);
              var result;
              if (viewHost) {
                focusDocument(viewHost);
                /*BUG-146792 : Skipping replaceDocument call 2 times as focusDocument internally calls replaceDocument in after F5.*/
                if (viewHost.docObj){
                  return;
                }
                var ignoreDirty;
                if(params.reload == "true"){
                  result = YES;
                }else if (params.skipConflictCheck != "true") {
                  result = showConflictDialog(viewHost);
                  ignoreDirty = "true";
                }
                if (result == YES) {
                  replaceDocument(viewHost, viewHost.label ? viewHost.label : WORK_ITEM, {close: YES, key: insHandle}, {action: OPEN_WORK_BY_HANDLE, key: insHandle, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID,ignoreDirty:ignoreDirty});
                } else {
                  clearAllIndicators();
                }
              } else {
                showDocumentInMultiView(WORK_ITEM, {close: YES, key: insHandle}, {action: OPEN_WORK_BY_HANDLE, key: insHandle, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID});
              }
            } else {
              // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
              // it accepts a post document close cleanup callback and arguments.
              // Changed relevant invocations to use a callback.
              replaceDocument(viewHost,
                              viewHost.label ? viewHost.label : WORK_ITEM,
                              {close: YES, key: insHandle},
                              {action: OPEN_WORK_BY_HANDLE, key: insHandle, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID, threadID: viewHost.ThreadId,ignoreDirty:params.reload},
                              function(newDoc) {
                var iconPath = (newDoc && newDoc.docObj) ? newDoc.docObj.pyIconPath : null;
                if (iconPath && (pud.trim(iconPath) != "")) {
                  setDocumentIcon(newDoc, iconPath);
                }
              });
            }
          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }

            doSingleViewAction(singleDocumentGadget.id, OPEN_WORK_BY_HANDLE, insHandle, params, configObj, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "openWorkItem" API request.
                 @param $String$ID – Work ID.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $String$contentID – Content ID.
                 @param $String$dynamicContainerID – Dynamic Container ID.
                 @param $Object$tab – Specific tab to be replaced with the work item.
                 @return $void$ - .
                 */
        openWorkItem = function(ID, workpool, params, configObj, contentID, dynamicContainerID, viewHost) {
          focusWindow();

          if (isMultiView) {
            var key = workpool + " " + ID,
                result;
            key = key.toUpperCase();
            // US-21598 01/15/2012 GUJAS1 Added code to replace existing tab with work item.
            if (!viewHost) {
              // No explicit tab was specified in params, proceed to check if there is a conflicting tab.
              viewHost = checkKeyConflict(key, configObj.systemID);
              if (viewHost) {
                focusDocument(viewHost);
                if (viewHost.docObj){
                  return;
                }
                var ignoreDirty;
                if(params.reload == "true"){
                  result = YES;
                }else if(params.skipConflictCheck != "true"){
                  result = showConflictDialog(viewHost);
                  ignoreDirty = "true";
                }
                if (result == YES) {
                  replaceDocument(viewHost, WORK_ITEM, {close: YES, key: key}, {action: OPEN_WORK_ITEM, workID: ID, workPool: workpool, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID});
                } else {
                  clearAllIndicators();
                  return;
                }
              }
              else {
                // No conflicting tab exists, proceed to add a new tab.
                showDocumentInMultiView(WORK_ITEM, {close: YES, key: key}, {action: OPEN_WORK_ITEM, workID: ID, workPool: workpool, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID});
              }
            }
            // US-21598 01/15/2012 GUJAS1 Added code to replace existing tab with work item.
            else {
              // A tab was specified to be replaced, replace it.
              replaceDocument(viewHost, WORK_ITEM, {close: YES, key: key}, {action: OPEN_WORK_ITEM, workID: ID, workPool: workpool, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID});
            }
          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }
            if(workpool){
              params.workPool = workpool;
            }
            doSingleViewAction(singleDocumentGadget.id, OPEN_WORK_ITEM, ID, params, configObj, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "openWorkByURL" API request.
                 @param $Object$oSafeURL – URL of the work item to open, passed as a SafeURL instance.
                 @param $Object$params – Not used, kept for compatibility.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @return $void$ - .
                 */
        openWorkByURL = function(oSafeURL, params, configObj) {
          if (isMultiView) {
            //BUG-511106:Handled in DC layer to pass dynamiccontainerID and contentID parameters for OpenWorkByURL case
            if(!oSafeURL.get("contentID")){
              oSafeURL.put("contentID",  uuid());
            }
            showDocumentInMultiView(WORK_ITEM, {close: YES}, {action: OPEN_WORK_BY_URL, url: oSafeURL, configObj: configObj});
          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }

            doSingleViewAction(singleDocumentGadget.id, OPEN_WORK_BY_URL, oSafeURL.toURL(), params, configObj);
          }
        },
        /*
                 @private- Helper method for "createNewWork" API request.
                 @param $String$className – "Applies To Class" name of the new item.
                 @param $String$flowName – Name of the new item flow.
                 @param $Object$params – Optional, Label of the tab.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @return $void$ - .
                 */
        createNewWork = function(className, flowName, params, configObj, customParam) {
          // TASK-149427: GUJAS1 Moved variable declarations to top for optimal minification
          var viewHosts, viewHost, contentID = customParam["contentID"];
          focusWindow();

          if (isMultiView) {
            // TASK-149427: GUJAS1 If skipConflictCheck has been specified, try to focus matching tab.
            if (params.skipConflictCheck) {
              viewHosts = getDocumentsArray();
              for (var i = 0; i < viewHosts.length; i++) {
                viewHost = viewHosts[i];
                // As the match is on ContentID, there are a few side effects -
                // 1. If the New tab has transitioned into a Work Item tab which has the same content ID, the tab would still come into focus.
                //                    This is NOT an issue in Recent Gadget as the "New" item is updated to the corr. Work Item as the harness changes.
                // 2. In Navigation Rules, ContentID keeps on changing every time the menus show, this would result in failed match every time.
                if (viewHost.elementName == contentID) {
                  focusDocument(viewHost);
                  return;
                }
              }
            }
            viewHost = showDocumentInMultiView(NEW, {close: YES}, {action: CREATE_NEW_WORK, className: className, flow: flowName, configObj: configObj, customParam: customParam},
                                               -1,
                                               function(viewHost, label) {
              if (viewHost && label) {
                setDocumentLabel(viewHost, label);
              }
            },
                                               [params.label]);
          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }

            doSingleViewAction(singleDocumentGadget.id, CREATE_NEW_WORK, className, flowName, params, configObj, customParam);
          }
        },

        /*
				@private- Helper method for "reportDefinition" API request.
		        @param $Object$params – 
		        @param $String$reportClass – Applies To Class of the RD
		        @param $String$reportName – RD name
		        @param $String$shortcutHandle – optional, InsKey of the shortcut used to launch this report (mostly for use in report browser).
				                                if shortcutHandle equals * then will assume this is a new report.
		        @param $String$paramKeys – Optional, Report parameters in form "ParamA=B&ParamC=D"
		        @param $String$reportDisplayMode – Optional, display mode, can be used to force a chart only display
				@param $String$reportAction - Optional.  'open', 'shortcut', 'new' (null/undefined/empty treated as open)
				@param $String$replaceCurrent - Optional.  true to replace current document with the report (null/undefined/empty treated as false)
		        @param $Object$configObj – Configuration settings(System ID, Application Name etc).
		        @param $String$contentID – Content ID
		        @param $String$dynamicContainerID – Dynamic container ID
				@return $void$ - .
				*/
        reportDefinition = function(params,reportClass,reportName,shortcutHandle,paramKeys,reportDisplayMode,reportAction,replaceCurrent,configObj,contentID,dynamicContainerID){
          focusWindow();
          params.put("Format", "harness");
          var hostKey = "",
              result,
              viewHost,
              label;
          label = "Report";
          var reportParams = {};
          if (typeof paramKeys != 'undefined' && paramKeys!=null) {
            var arrParamPair = paramKeys.split("&");
            for (var paramPairIndex in arrParamPair) {
              var pair = arrParamPair[paramPairIndex].split("=");
              reportParams[pair[0]] = pair[1];
            }
          }
          if(reportAction=='new'){
            if(typeof shortcutHandle == 'undefined' || shortcutHandle==''){
              shortcutHandle = '*'+view.getNextHostIndex();
            }
          }else if(typeof shortcutHandle == 'undefined' || reportAction == '' || reportAction=='open'){
            shortcutHandle = reportClass+"!"+reportName;
          }
          hostKey = "RunReport-"+shortcutHandle;
          if(replaceCurrent == null || typeof replaceCurrent == 'undefined' || replaceCurrent==''){replaceCurrent='false';}
          var gadgetParams = { action: REPORT_DEFINITION, key: params, configObj: configObj,
                              reportClass:reportClass,
                              reportName:reportName,
                              reportTitle:label,
                              reportParams:reportParams,
                              reportDisplayMode:reportDisplayMode,
                              shortcutHandle:shortcutHandle, 
                              reportAction:reportAction,
                              contentID: contentID, 
                              dynamicContainerID: dynamicContainerID };
          if (isMultiView) {
            if(replaceCurrent=='true'){
              viewHost = getActiveDocument();
              replaceDocument(viewHost, label, { close: YES, key: hostKey,doNotSetTitle: true}, gadgetParams);
            } else{
              viewHost = checkKeyConflict(hostKey, configObj.systemID);
              if (!viewHost) {
                viewHost = showDocumentInMultiView(label, { close: YES, key: hostKey,doNotSetTitle: true}, gadgetParams);
              } else {
                if(viewHost.actionDef && viewHost.actionDef.reportParams && reportParams) {
                  if(JSON.stringify(viewHost.actionDef.reportParams) !== JSON.stringify(reportParams)) {
                    focusDocument(viewHost);
                    replaceDocument(viewHost, label, { close: YES, key: hostKey,doNotSetTitle: true}, gadgetParams);
                    return;
                  }
                }
                focusDocument(viewHost);
                clearAllIndicators();
              }
            }
          } else {

            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }
            doSingleViewAction(singleDocumentGadget.id, REPORT_DEFINITION, { close: YES, key: hostKey },gadgetParams.configObj,
                               gadgetParams.reportClass,gadgetParams.reportName,gadgetParams.reportDisplayMode,gadgetParams.reportTitle,gadgetParams.shortcutHandle, gadgetParams.reportAction,
                               gadgetParams.reportParams,gadgetParams.contentID, gadgetParams.dynamicContainerID,gadgetParams.hostName);
          }
        },

        /*
                 @private- Helper method for "openLanding" API request.
                 @param $String$harnessName – Name/Purpose of the harness to be displayed.
                 @param $String$harnessClass – Applies To Class of the specified harness.
                 @param $String$page – Optional, Name of the clipboard page bound with the harness if applicable.
                 @param $String$readonly – Optional, If this parameter is specified, the harness gets loaded in read-only mode.
                 @param $String$model – Optional, Name of the data-transform to be applied.
                 @param $String$landingAction – Optional, Name of the landing action.
                 @param $String$levelA – Optional, Level A value.
                 @param $String$levelB – Optional, Level B value.
                 @param $String$levelC – Optional, Level C value.
                 @param $Object$params – Optional, Applicable parameters like Label of the tab.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @param $String$landingPageTitle – Label for the Tab displaying the specified harness.
                 @return $void$ - .
                 */
        openLanding = function(harnessName, harnessClass, page, readonly, model, landingAction, levelA, levelB, levelC, params, configObj, landingPageTitle, contentID, dynamicContainerID, customParam, paramKeys) {
          if (!page){
            page = "";
          }
          if (!readonly){
            readonly = "";
          }
          if (!model){
            model = "";
          }
          if (!landingPageTitle){
            landingPageTitle = "Open Landing";
          }

          if (isMultiView) {
            var key = landingPageTitle,
                viewHost, actionDef;
            viewHost = checkKeyConflict(key, configObj.systemID);
            if (viewHost) {
              // BUG-120967 GUJAS1 09/10/2013 If the Landing Page levels are same, focus the same document, otherwise a different tab should be focused,
              // for which the LP needs to be reloaded.
              actionDef = viewHost.actionDef;
              //BUG-127012 : Removed all levelA,levelB,levelC null checks.
              if (actionDef
                  && actionDef.levelA == levelA
                  && actionDef.levelB == levelB
                  && actionDef.levelC == levelC) {

                focusDocument(viewHost);
              }
              else {
                replaceDocument(viewHost, landingPageTitle, {close: YES, key: key},
                                {action: OPEN_LANDING, page: page, readOnly: readonly,
                                 model: model, harnessName: harnessName, className: harnessClass,
                                 landingAction: landingAction, levelA: levelA, levelB: levelB,
                                 levelC: levelC, configObj: configObj, hostName: landingPageTitle, contentID: contentID, dynamicContainerID: dynamicContainerID, customParam: customParam, paramKeys: paramKeys});
              }
              return;
            }
            viewHost = showDocumentInMultiView(landingPageTitle, {close: YES, key: key},
                                               {
              action: OPEN_LANDING, page: page, readOnly: readonly,
              model: model, harnessName: harnessName, className: harnessClass,
              landingAction: landingAction, levelA: levelA, levelB: levelB,
              levelC: levelC, configObj: configObj, hostName: landingPageTitle, contentID: contentID, dynamicContainerID: dynamicContainerID, customParam: customParam, paramKeys: paramKeys
            },
                                               -1,
                                               function(viewHost, label, landingPageTitle) {
              if (viewHost && label) {
                setDocumentLabel(viewHost, label);
              }

              // BUG-94611 02/14/2013 GUJAS1 Set the landing page title as the tooltip.
              // BUG-108341 06/12/2013 GUJAS1 Added null view host check.
              if (viewHost && landingPageTitle) {
                setDocumentTitle(viewHost, landingPageTitle);
              }
            },
                                               [params.label, landingPageTitle]);

          }
          else {
            if (!confirmDirtyReplace(singleDocumentGadget.id)) {
              return;
            }
            /*BUG-201490 : Removed extra label and updated OPEN_LANDING with "openlanding"*/
            delete params.label;
            doSingleViewAction(singleDocumentGadget.id, "openlanding", harnessName,
                               harnessClass, page, readonly, model, landingAction, levelA, levelB, levelC,
                               params, configObj, landingPageTitle, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "openWizard" API request.
                 @param $String$sName – Name/Purpose of the wizard.
                 @param $String$sQuery – Optional, Query parameters for the wizard.
                 @param $String$wizardLabel – Optional, Label for the wizard tab.
                 @return $void$ - .
                 */
        openWizard = function(sName, sQuery, wizardLabel, params, contentID, dynamicContainerID) {
          if (!isMultiView) {
            return;
          }
          var temp = {}, key = sName, result;
          temp.className = sName;
          temp.sQuery = sQuery;
          if (!wizardLabel)
            wizardLabel = "Open Wizard";
          key = wizardLabel;
          var viewHost = checkKeyConflict(key, undefined);
          if (viewHost) {
            focusDocument(viewHost);
            if (params.skipConflictCheck != "true") {
              result = showConflictDialog(viewHost, key);
              if (result == YES) {
                contentID = viewHost.elementName;
                replaceDocument(viewHost, wizardLabel, {close: YES, key: key}, {action: OPEN_WIZARD, key: temp, docClass: key, dynamicContainerID: dynamicContainerID, wizardLabel: wizardLabel, contentID: contentID});
              } else {
                clearAllIndicators();
              }
            }
            //return;
          } else {
            showDocumentInMultiView(wizardLabel, {close: YES, key: key}, {action: OPEN_WIZARD, key: temp, docClass: key, dynamicContainerID: dynamicContainerID, wizardLabel: wizardLabel, contentID: contentID});
          }
        },
        /*
                 @private- Helper method for "getNextWork" API request.
                 @param $String$params –  Optional, Label of the tab.
                 @param $Object$configObj – Configuration settings(System ID, Application Name etc).
                 @return $void$ - .
                 */
        getNextWorkItem = function(params, configObj, contentID, dynamicContainerID) {
          focusWindow();
          if (isMultiView) {

            var viewHost = showDocumentInMultiView(NEXT_LABEL, {close: YES},
                                                   {action: GET_NEXT_WORK_ITEM, configObj: configObj, contentID: contentID, dynamicContainerID: dynamicContainerID},
                                                   -1,
                                                   function(viewHost, label) {
              if (viewHost && label) {
                setDocumentLabel(viewHost, label);
              }
            },
                                                   [params.label]);
          }
          else {
            doSingleViewAction(singleDocumentGadget.id, GET_NEXT_WORK_ITEM, params, configObj, contentID, dynamicContainerID);
          }
        },
        /*
                 @private- Helper method for "refresh" API request.
                 @return $void$ - .
                 */
        refresh = function() {

          if (isMultiView) {
            var currentDoc = getActiveDocument(),
                gadgetName = getGadgetNameForDocument(currentDoc);
            webApi.doAction(gadgetName, RELOAD);
            clearAllIndicators();
          }
          else {
            doSingleViewAction(singleDocumentGadget.id, RELOAD);
          }
        },
        showDocumentInMultiView = function(label, attribs, gp, docIndex, callback, callbackArgs) {
          var viewHost;
          if (!view.tabView) {
            // For Tab-less, find if we need to reuse existing document and then follow replacedocument route.
            if (getDocumentsArrayLength() >= maxDocuments) {
              var index = handleMaxDocs(maxDocsWarning);
              if (index != -1) {
                viewHost = getDocument(index);
                if (viewHost) {
                  if (gp && gp.customParam && gp.customParam.saveAsThreadName == viewHost.ThreadName) {
                    gp.saveAsOnCurrentThread = true;
                  }
                  replaceDocument(viewHost,
                                  label,
                                  attribs,
                                  gp,
                                  callback,
                                  callbackArgs);

                  return viewHost;
                }
              }
              else {
                // Max documents condition hit, cannot host a new document.
                return NULL;
              }
            }
          }

          // Create a new document in tabbed mode.
          if (docIndex != -1) {
            viewHost = showDocument(label, attribs, gp, docIndex);
          }
          else {
            viewHost = showDocument(label, attribs, gp);
          }

          if (typeof callback == "function") {
            if (Object.prototype.toString.call(callbackArgs) === "[object Array]") {
              callbackArgs.unshift(viewHost);
            }
            else {
              callbackArgs = [viewHost];
            }
            callback.apply(this, callbackArgs);
          }

          return viewHost;
        },

        /*
                 @private- Adds a new Harness/normal tab and content to the pxWorkArea.
                 @param $String$label –  Optional, Label of the tab.
                 @param $Object$attribs – Additional attributes (Key is used).
                 @param $Object$gp – Gadget parameters passed on from other helper APIs.
                 @param $Number$tabIndex – Optional, Zero based index position of the new tab.
                 @return $Object$ - New Tab object instance if tab has been added, null otherwise.
                 */
        showDocument = function(label, attribs, gp, docIndex, isStaticHarnessWithoutTableFormat, threadName) {
          var tempHost = view.getHost(docIndex),
              tempDocObj,
              skipMaxDocsCheck = false;

          // BUG-104853 : JALDS 20130517 We can skip the maxDocuments check on deffered host as they are valid already.
          if (tempHost && tempHost.docObj) {
            tempDocObj = tempHost.docObj;
            if (tempDocObj && tempDocObj.isDefferedHost) {
              skipMaxDocsCheck = true;
              tempDocObj.isDefferedHost = false;
            }
          }

          // BUG-72276 GUJAS1 05/30 Skipped max tabs warning for static harness tabs.
          if (!gp.isWAStaticHarness && !skipMaxDocsCheck) {
            if (getDocumentsArrayLength() >= maxDocuments) {
              clearAllIndicators();
              var index = handleMaxDocs(maxDocsWarning);
              //alert(maxDocsWarning);
              if (index == -1) {
                try { // To focus the active tab header, once reaches to maximum docs limit
                  if (view.ViewType == 'Tabbed') {
                    view.tabView.get('activeTab').get('element').focus();
                  }
                } catch (e) {
                }
                return NULL;
              } else {
                docIndex = index;
              }
            }
          }
          if (!gp.contentID) {
            gp.contentID = uuid();
          }
          var contentID = gp.contentID,
              dynamicContainerID = gp.dynamicContainerID;

          if (gp.action == "createNewWork") {
            if (gp.customParam.contentID)
              contentID = gp.customParam.contentID;
            else
              gp.customParam.contentID = contentID;
            dynamicContainerID = gp.customParam.dynamicContainerID;
          }
          var currentHost = addDocumentHost(gp.hostName, docIndex, attribs.close != "no", null, null, contentID, dynamicContainerID, null, isStaticHarnessWithoutTableFormat, threadName),
              gadgetName,
              action = gp.action;
          if (!currentHost) {
            return NULL;
          }
          var setLabel = true;
          if (attribs) {
            currentHost.key = attribs.key;
            currentHost.attribs = attribs;
            setLabel = !attribs.doNotSetTitle;
          }
          if (label && setLabel) {
            var htmlEntityDecoder = document.createElement('div');
            var oldLabel = label;
            htmlEntityDecoder.innerHTML = label;
            label = htmlEntityDecoder.innerText || htmlEntityDecoder.textContent;
            if (attribs.insName === oldLabel) {
              attribs.insName = label;
            }
            setDocumentLabel(currentHost, label);
          }

          currentHost.actionDef = gp;
          if (gp.threadID != undefined) {
            currentHost.ThreadId = gp.threadID;
          }
          initGadget(currentHost);

          /*HFix-25574 : Updated id of currentHost with ThreadId if it is not same with id of currentHost */
          if(view.ViewType == "NoHeader" && currentHost.ThreadId >= 0 && "module"+currentHost.ThreadId !== currentHost.id){
            currentHost.element.id = "module"+currentHost.ThreadId;
            currentHost.id = "module"+currentHost.ThreadId;
          }


          //init IAC parameter object
          if (!gp.paramObject){
            gp.paramObject = {};
          }
          if (gp.workPool){
            gp.paramObject.workPool = gp.workPool;
          }
          if(gp.shouldCreateAssociateRequestor){
            gp.paramObject.shouldCreateAssociateRequestor = "true";
          }
          if (parseInt(p.d.productionLevel) < 5) {
            //gp.paramObject.UserIdentifier = p.d.pyUID;
          }

          //init IAC config object
          // BUG-90815: JALDS 24/01/2013 - passing the source node to set the mask and loading icon to the current container.
          var docContentEle = getDocumentContentElement(currentHost)
          setBusyIndicator(true, docContentEle);

          gadgetName = getGadgetNameForDocument(currentHost);
          var prevDoc, index = view.getHostIndex(currentHost) + 1;
          try {
            if (view.ViewType == "NoHeader") {
              prevDoc = view.moduleView.get('activeModule');
            } else if (view.ViewType == "Tabbed") {
              prevDoc = view.tabView.get(ACTIVE_TAB);
            }
            if (prevDoc && prevDoc.GadgetName != undefined) {
              var docObj = pega.web.api.doAction(prevDoc.GadgetName, "getUIDoc");
              if (docObj) {
                var docDirty = docObj.isFormDirty(false);
                if (gp.paramObject) {
                  gp.paramObject.prevContentID = prevDoc.elementName;
                  gp.paramObject.prevRecordkey = prevDoc.key;
                  gp.paramObject.prevFormDirty = docDirty;
                }
              }
            }

          } catch (e) {
          }
          switch (action) {
            case OPEN_RULE_BY_KEYS:
              webApi.doAction(gadgetName, OPEN_RULE_BY_KEYS, attribs, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case OPEN_RULE_BY_CLASS_NAME:
              webApi.doAction(gadgetName, OPEN_RULE_BY_CLASS_NAME, attribs, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case OPEN_RULE_SPECIFIC:
              webApi.doAction(gadgetName, OPEN_RULE_SPECIFIC, attribs, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case OPEN_ASSIGNMENT:
              webApi.doAction(gadgetName, OPEN_ASSIGNMENT, gp.key, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case OPEN_WORK_BY_HANDLE:
              webApi.doAction(gadgetName, OPEN_WORK_BY_HANDLE, gp.key, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case OPEN_WORK_BY_URL:
              /*BUG-125912 : Updated toQueryString call with params to pass multiByte characters as parameters to an activity.*/
              webApi.doAction(gadgetName, OPEN_WORK_BY_URL, gp.url.toQueryString(true, false), gp.paramObject, gp.configObj, index);
              break;
            case CREATE_NEW_WORK:
              gp.customParam.tabIndex = index;
              webApi.doAction(gadgetName, CREATE_NEW_WORK, gp.className, gp.flow, gp.paramObject, gp.configObj, gp.customParam);
              break;
            case DISPLAY:
            case SHOW_HARNESS:
 
              if(gp.pyDataTransformDynamicParams){
                gp.paramObject.pyDataTransformDynamicParams = gp.pyDataTransformDynamicParams;
              }  

              if(gp.preActivityDynamicParams){
                gp.paramObject.preActivityDynamicParams = gp.preActivityDynamicParams;
              }
              
              if (gp.pyActivity) {
                webApi.doAction(gadgetName, DISPLAY, gp.harnessName, gp.className, gp.page,
                                gp.readOnly, gp.model, gp.paramObject, gp.configObj, gp.preActivity,
                                gp.preActivityParams, gp.key, gp.readOnly, gp.hostName, gp.contentID, gp.dynamicContainerID, index,gp.replaceCurrent);
              } else {
                webApi.doAction(gadgetName, DISPLAY, gp.harnessName, gp.className,
                                gp.page, gp.readOnly, gp.model, gp.paramObject, gp.configObj,
                                gp.preActivity, gp.preActivityParams, gp.key, gp.readOnly, gp.hostName,
                                gp.pyActivity, gp.pyPreActivity, gp.page, gp.pzPrimaryPageName, gp.contentID, gp.dynamicContainerID, index, gp.replaceCurrent);
              }
              break;
            case DISPLAY_ON_PAGE:
              webApi.doAction(gadgetName, DISPLAY_ON_PAGE, gp.harnessName, gp.page, gp.parameters, gp.contentID, gp.dynamicContainerID, index, gp.className, label, attribs.key, gp.paramObject);
              break;
            case OPEN_LANDING:
              webApi.doAction(gadgetName, "openlanding", gp.harnessName, gp.className, gp.page,
                              gp.readOnly, gp.model, gp.landingAction, gp.levelA, gp.levelB, gp.levelC, gp.paramObject, gp.configObj, gp.hostName, gp.contentID, gp.dynamicContainerID, {tabIndex: index}, gp.customParam, gp.paramKeys);
              break;
            case OPEN_WIZARD:
              webApi.doAction(gadgetName, OPEN_WIZARD, gp.key, gp.paramObject, gp.configObj, index, gp.contentID, gp.dynamicContainerID, gp.wizardLabel);
              break;
            case OPEN_WORK_ITEM:
              webApi.doAction(gadgetName, OPEN_WORK_ITEM, gp.workID, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case GET_NEXT_WORK_ITEM:
              webApi.doAction(gadgetName, GET_NEXT_WORK_ITEM, gp.paramObject, gp.configObj, gp.contentID, gp.dynamicContainerID, index);
              break;
            case REPORT_DEFINITION:	
              webApi.doAction(gadgetName, REPORT_DEFINITION, gp.paramObject, gp.configObj,
                              gp.reportClass,gp.reportName,gp.reportDisplayMode,gp.reportTitle,gp.shortcutHandle, gp.reportAction,
                              gp.reportParams,gp.contentID, gp.dynamicContainerID,gp.hostName, index);
              break;
          }
          setTimeout(function() {
            /*Checking if the currentHost is available in the documents array before focusing it*/
            var documents, documentsCount;
            documents = getDocumentsArray();
            documentsCount = getDocumentsArrayLength();
            for (var i = 0; i < documentsCount; i++){
              if(documents[i] === currentHost){
                focusDocument(currentHost);
              }
            }    
          }, 0);
          //focusTab(currentTab);
          return currentHost;
        },
        /*
                 @private- Replaces an existing viewDoc with a new viewDoc.
                 @param $Object$viewDoc – Document instance to be replaced.
                 @param $String$label –  Optional, Label of the new viewDoc.
                 @param $Object$attribs – Additional attributes (Key is used).
                 @param $Object$gadgetParams – Gadget parameters passed on from other helper APIs.
                 @param $Function$cleanupCallback - Optional cleanup callback.
                 @param $Array$cleanupCallbackArgs - Optional cleanup callback arguments.
                 @return $Object$ - New Document object instance if viewDoc has been added, null otherwise.
                 */
        replaceDocument = function(viewDoc, label, attribs, gadgetParams, cleanupCallback, cleanupCallbackArgs) {
          var gadgetName = getGadgetNameForDocument(viewDoc),
              doc,
              // BUG-94023 GUJAS1 05/16/2013 Added removeThread flag.
              removeThread = false;
          if (gadgetParams) {
            if(viewDoc && viewDoc.shouldCreateAssociateRequestor){
              gadgetParams.shouldCreateAssociateRequestor = true;
            }
            // BUG-94023 GUJAS1 05/16/2013 Existing thread should be removed for Open Wizard action.
            removeThread = (gadgetParams.action == OPEN_WIZARD);
            doc = webApi.doAction(gadgetName, GET_UI_DOC);
            if (doc && viewDoc.actionDef.action.toLowerCase() != DISPLAY) {
              // 07/08/2013 GUJAS1 BUG-110928 replaceDocument is now async,
              // it accepts a post document close cleanup callback and arguments.
              //Added action for suppressing isFormDirty Call if it is openWizard.-- BUG-124788 : JAINB1
              var skipDCCleanUp = false;
              if(gadgetParams.shouldCreateAssociateRequestor == true &&  viewDoc.pyStreamName != "Perform"){
                skipDCCleanUp = true;
              }
              doc.doClose(NULL,
                          true,
                          {"success": dcCleanupCallback,
                           "argument": {"threadID": viewDoc.ThreadId,
                                        "callback": function(cb, cba, view, viewDoc, label, attribs, gadgetParams) {
                                          // Store viewDoc index, remove Document.
                                          // Invoke showDocument with the index of the removed viewDoc.
                                          var index = view.getHostIndex(viewDoc);
                                          //if (view.tabView){
                                          removeDocument(viewDoc);
                                          //}
                                          var newDoc = showDocument(label, attribs, gadgetParams, index);
                                          if(viewDoc && viewDoc.shouldCreateAssociateRequestor){
                                            newDoc.shouldCreateAssociateRequestor = true;
                                          }
                                          if (typeof cb == "function") {
                                            if (Object.prototype.toString.call(cba) === "[object Array]") {
                                              cba.unshift(newDoc);
                                            }
                                            else {
                                              cba = [newDoc];
                                            }
                                            cb.apply(this, cba);
                                          }
                                        },
                                        "callbackArgs": [cleanupCallback, cleanupCallbackArgs, view, viewDoc, label, attribs, gadgetParams]},
                           "action": gadgetParams.action, "saveAsOnCurrentThread": gadgetParams.saveAsOnCurrentThread,"skipDCCleanUp":skipDCCleanUp,"clearThreadState":"true"
                          },gadgetParams.ignoreDirty, true);
            }
            else {
              var index = view.getHostIndex(viewDoc);
              // BUG-300525 Fix changes
              var isStaticHarnessWithoutTableFormat = false;
              if (gadgetParams.isWAStaticHarness) {
                var hostElement = view.getHostElement(viewDoc);
                if (hostElement.getElementsByTagName('table').length === 0) {
                  isStaticHarnessWithoutTableFormat = true;
                }
              }
              //if (view.tabView){
              removeDocument(viewDoc);
              //}
              gadgetParams.threadID = gadgetParams.threadID || viewDoc.ThreadId;
              var newDoc = showDocument(label, attribs, gadgetParams, index, isStaticHarnessWithoutTableFormat,viewDoc.ThreadName);
              /*BUG-133117 : Updating aria-label & title if label is empty and it is a static Harness Case*/
              newDoc.docObj = viewDoc.docObj;
              if(viewDoc && viewDoc.shouldCreateAssociateRequestor){
                newDoc.shouldCreateAssociateRequestor = true;
              }
              var curActDocLi = viewDoc.get("element");
              if (curActDocLi && curActDocLi.getAttribute("iconCloseSmall") == null && label == "") {
                newDoc.get("element").setAttribute("aria-label", curActDocLi.getAttribute("aria-label"));
                newDoc.get("element").setAttribute("title", curActDocLi.getAttribute("title"));
              }
              if (typeof cleanupCallback == "function") {
                if (Object.prototype.toString.call(cleanupCallbackArgs) === "[object Array]") {
                  cleanupCallbackArgs.unshift(newDoc);
                }
                else {
                  cleanupCallbackArgs = [newDoc];
                }
                cleanupCallback.apply(this, cleanupCallbackArgs);
              }
            }
          }
        },
        /*
                 @private- Removes an existing viewDoc along with its content.
                 @param $Object$viewDoc – Document instance to be removed.
                 @param $Boolean$removeThread - If true, the viewDoc thread is deleted. Only applicable for
                 gadget docs.
                 @return $void$ -.
                 */
        removeDocument = function(viewDoc, removeThread) {
          // BUG-73005 GUJAS1 06/07/2012 Store ThreadId to aid minification.
          var currentThreadId = viewDoc.ThreadId;
          if (typeof currentThreadId == "number") {
            removeGadget(viewDoc);
            // BUG-73005 GUJAS1 06/07/2012 Remove viewDoc thread.
            if (removeThread && viewDoc.ThreadName) {
              deleteDocumentThread(viewDoc.ThreadName, viewDoc);
            }
          }
          /*RAIDV - keepActiveIndex sent as true because deferred harnesses, since they replace current viewDoc, were firing defer action of next viewDoc*/
          view.removeHost(viewDoc, true);
        },
        // BUG-73005 GUJAS1 06/07/2012 Added method to remove viewDoc thread.
        deleteDocumentThread = function(threadName, viewDoc) {
          var currentThread = pega.u.d.getThreadName();
          var newURL = pega.ctx.pxReqURI.replace(currentThread,threadName);
           try{
            if(window.gIsMultiTenantPortal && viewDoc){
              var iframeDiv = getDocumentContentElement(viewDoc);
              var iframeElem;
              if(iframeDiv && iframeDiv.getElementsByTagName('iframe') && iframeDiv.getElementsByTagName('iframe').length > 0){
                  iframeElem = iframeDiv.getElementsByTagName('iframe')[0];
              }
              if (iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.SafeURL) {
                newURL = iframeElem.contentWindow.SafeURL.prototype.toAbsoluteURL();
                threadName = newURL.substr(newURL.indexOf("/!")+2);
              }
            }
          }catch(e){}
          var safeURL = SafeURL_createFromURL(newURL);
          safeURL.put(ACTIVITY_PARAM_NAME, REMOVE_THREAD);
          safeURL.put(THREAD_NAME, threadName);
          pud.asyncRequest(GET_METHOD, safeURL);
        },
        executeDoCloseWrapper = function(docMetaData){
          if(!docMetaData) return;
          if(!docMetaData.pyThreadName || docMetaData.pyThreadName =="" || !docMetaData.pzPrimaryHarnessPageName || docMetaData.pzPrimaryHarnessPageName =="") 
            return;
          var sBaseURI  = pega.web.config.gatewayURL;
          var sThread= docMetaData.pyThreadName;
          if(pega && pega.d && pega.d.csrfToken != ""){
            sBaseURI += "!@" +pega.d.csrfToken + "!"+ sThread ; //dont add the appName
          }else{
            sBaseURI += "!"+ sThread ;
          }
          var safeURL = SafeURL_createFromURL(sBaseURI);
          safeURL.put(ACTIVITY_PARAM_NAME, "pzDoCloseWrapper");
          safeURL.put("PrimaryPageName", docMetaData.pzPrimaryHarnessPageName);
          safeURL.put("retainLock", "false");
          pud.asyncRequest(GET_METHOD, safeURL);
        }, 
        findAndCloseDocument = function(eventObj,searchKey, searchKeyValue, params) {
          var documents, tabObj, docEle, doc, documentsCount, closeIcon, dirtyState, ignoreDirty,pooledDoClose;
          if (!isMultiView) {
            if (params && params.isFirstRecentItem == "true") {
              ignoreDirty = params.ignoreDirty == 'true' ? true : false;
              var doc = pega.web.api.doAction(singleDocumentGadget.id, GET_UI_DOC);
              if (doc && !doc.isFormDirty(false)) {
                if (searchKey == 'key')
                  doc.key = searchKeyValue;
                if (searchKey == 'elementName')
                  doc.elementName = searchKeyValue;
                doc.doClose(undefined, undefined, undefined, ignoreDirty);
              }
            }
            return;
          }
          pooledDoClose = eventObj.get("pooledDoClose");
          documents = getDocumentsArray();
          documentsCount = getDocumentsArrayLength();
          dirtyState = false;
          if (searchKey == "" || searchKey == undefined)
            searchKey = 'key';
          for (var index = 0; index < documentsCount; index++) {
            tabObj = documents[index];
            if (tabObj[searchKey] == searchKeyValue) {
              var recentAction = eventObj.get('recentAction'), ajaxTrackID;
              doc = webApi.doAction(getGadgetNameForDocument(tabObj), GET_UI_DOC);
              if(doc){
                dirtyState = doc.isFormDirty(false);
                ajaxTrackID = doc.getAjaxTrackerID();
              }
              if (recentAction == 'ClearAllRecentItems' && pooledDoClose == "true") {
                var ignoreDirty = eventObj.get('ignoreDirty'),
                    isRecentItemRemoved = params.isRecentItemRemoved,
                    primaryHarnessPageName = tabObj.primaryHarnessPageName,
                    canBeRemoved = true;

                canBeRemoved = !dirtyState;
                if(ignoreDirty == "true"){
                  dirtyState = false;									
                  canBeRemoved = true;
                }
                if(canBeRemoved){
                  if(!primaryHarnessPageName && tabObj.docObj){
                    primaryHarnessPageName = tabObj.docObj.pzPrimaryHarnessPageName;
                  }
                  var docMetaData = {};
                  docMetaData.threadName = tabObj.ThreadName;
                  docMetaData.isRecentItemRemoved = isRecentItemRemoved;
                  docMetaData.pzPrimaryPageName = primaryHarnessPageName;
                  docMetaData.AJAXTrackID = ajaxTrackID +"";
                  docMetaData.dynamicContainerID = tabObj.tabGroupName || tabObj.docGroupName;
                  docMetaData.tabIndex = index + 1 + "";

                  var docsMetaData = eventObj.get("docsMetaData");
                  if(!docsMetaData){
                    docsMetaData = {"docsToClose":[]};
                    eventObj.put("docsMetaData",docsMetaData);
                  }
                  if(doc){
                    doc.skipDeleteDoumentPg = true;
                  }
                  docsMetaData.docsToClose.push(docMetaData);
                  releaseThreadId(tabObj.ThreadId);
                  removeDocument(tabObj, false);
                }
                return dirtyState;
              }

              docEle = getDocumentElement(tabObj);
              closeIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, docEle);
              if (closeIcon && closeIcon.length > 0 || (view.ViewType == 'NoHeader' && tabObj.id != "module0")) {
                tabObj.recentAction = recentAction;
                if (doc) {
                  dirtyState = doc.isFormDirty(false);
                  if (!dirtyState || (params && params.ignoreDirty == "true")) {
                    dirtyState = false;
                    doc.isRecentItemRemoved = params ? params.isRecentItemRemoved : '';
                    doc.elementName = tabObj.elementName;
                    doc.key = params ? (params.recentKey) ? (params.recentKey) : tabObj.key : tabObj.key;
                    closeDocument({}, tabObj, true, params);
                    doc.isRecentItemRemoved = "";
                    break;
                  }
                }else{
                  if(view.ViewType == 'NoHeader'){
                    releaseThreadId(tabObj.ThreadId);                                    
                    if(tabObj.docObj){
                      executeDoCloseWrapper(tabObj.docObj);
                    }else{
                      deleteDocumentThread(tabObj.ThreadName, tabObj);
                    }
                    view.removeHost(tabObj, true);
                    var activeDoc = getActiveDocument();
                    var moduleElement = view.getHostElement(tabObj).parentNode;
                    if(moduleElement && moduleElement.id != "module0"){
                      if(moduleElement.parentNode)
                        moduleElement.parentNode.removeChild(moduleElement);
                    }  
                    if(pega && pega.u && pega.u.d){
                      pega.u.d.sendReqToUpdateElementModal({"dynamicContainerID": activeDoc.tabGroupName || activeDoc.docGroupName,"tabIndex": view.getHostIndex(activeDoc) + 1,"label": activeDoc.label,"key": activeDoc.key,         "iconPath": activeDoc.iconPath},"CLOSE",{"dynamicContainerID": tabObj.tabGroupName || tabObj.docGroupName,"tabIndex": index + 1, key: tabObj.key, isActiveHost: false});
                    }
                    setActiveClientTab(view.getHostToFocus());
                    break;
                  }else{
                    closeDocument({}, tabObj, true, params);
                    break;  
                  }

                }
              }
            }
          }
          return dirtyState;
        },
        updateRecentList = function(eventObj) {

          var recentAction, ignoreDirty, isDirtyDocExists, waStrings, unsavedWorkMsg1, recentKey;

          recentAction = eventObj.get('recentAction');
          if (recentAction == 'ClearRecentItem') {
            var searchKey, isRecentItemRemoved, dirtyState, searchKeyValue, isFirstRecentItem, recentKey;
            searchKey = eventObj.get('searchKey');
            isRecentItemRemoved = eventObj.get('recentItemRemoved');
            ignoreDirty = eventObj.get('ignoreDirty');
            dirtyState = eventObj.get('dirtyState');
            isDirtyDocExists = dirtyState;
            isFirstRecentItem = eventObj.get('isFirstRecentItem');
            recentKey = eventObj.get('originalRecentKey');
            if (dirtyState != 'true' || ignoreDirty == "true") {
              searchKey = searchKey.split('=');
              if (searchKey.length >= 1) {
                searchKeyValue = searchKey[1];
                searchKey = searchKey[0];
                isDirtyDocExists = findAndCloseDocument(eventObj,searchKey, searchKeyValue, {"ignoreDirty": ignoreDirty, "isRecentItemRemoved": isRecentItemRemoved, "isFirstRecentItem": isFirstRecentItem, "recentKey": recentKey});
              }
            }
          } else if (recentAction == 'ClearAllRecentItems') {
            var recordKeys = eventObj.get('recordKeys');
            ignoreDirty = eventObj.get('ignoreDirty');
            isDirtyDocExists = eventObj.get('hasDirtyRecentItem');
            isDirtyDocExists = (isDirtyDocExists == "true") ? true : false;
            if (recordKeys.length > 2) {
              var pattStart = new RegExp("^\\[");
              var pattEnd = new RegExp("\]$");
              if (pattStart.test(recordKeys) && pattEnd.test(recordKeys)) {
                recordKeys = recordKeys.substring(1, (recordKeys.length) - 1);
                recordKeys = recordKeys.split("&");
                if (recordKeys.length > 0) {
                  for (var index = 0; index < recordKeys.length; index++) {
                    var recordKey = recordKeys[index];
                    if (recordKey.length > 0) {
                      var recentInfo = recordKey.split(";"), dirtyState;
                      if (recentInfo.length > 0) {
                        var searchKey = recentInfo[0],
                            recentItemRemoved = recentInfo[1],
                            isRecentItemDirty = recentInfo[2],
                            isFirstRecent = recentInfo[3],
                            recentKey = recentInfo[4], searchKeyValue;
                        searchKey = searchKey.split('=');
                        if (searchKey.length >= 2) {
                          searchKeyValue = searchKey[1];
                          searchKey = searchKey[0];
                          dirtyState = findAndCloseDocument(eventObj,searchKey, searchKeyValue, {"ignoreDirty": ignoreDirty, "isRecentItemRemoved": recentItemRemoved, "isFirstRecentItem": isFirstRecent, "recentKey": recentKey});
                          isDirtyDocExists = dirtyState ? dirtyState : isDirtyDocExists;
                        }
                      }

                    }
                  }
                }
              }
            }
            var docsMetaData = eventObj.get("docsMetaData");
            if(docsMetaData){
              poolCloseDocument(docsMetaData);
            }
            /*BUG-196041: focus the current active tab for F5->clearAllRecents */
            var activeDoc = getActiveClientTab();
            focusDocument(activeDoc);
          }

          if (isDirtyDocExists == "true" || isDirtyDocExists) {
            waStrings = byID("pzWAStrings");
            if (waStrings) {
              if (recentAction == 'ClearRecentItem')
                unsavedWorkMsg1 = waStrings.getAttribute("data-s13");
              if (recentAction == 'ClearAllRecentItems')
                unsavedWorkMsg1 = waStrings.getAttribute("data-s14");
            }
            if(unsavedWorkMsg1){
              alert(unsavedWorkMsg1);
            }
          }
        },
        poolCloseDocument = function(docsMetaData){
          if(!docsMetaData){
            return;
          }
          var docsToClose = docsMetaData.docsToClose;
          if(docsToClose && docsToClose.length > 0){
            var callback ={};
            var callbackFunc = function(){
              var activeDoc = this.getHostToFocus();
              activeDoc.activationSyncRequired =   true;		
              focusDocument(activeDoc);  
            }
            callback.success = callbackFunc;
            callback.failure = callbackFunc;
            callback.scope = view;		
            var strUrlSF = new SafeURL("pzRecentsPooledDoClose");
            strUrlSF.put("docsMetaData", JSON.stringify(docsMetaData));
            pud.asyncRequest('POST', strUrlSF, callback, null);
          }
        },
        /**
                 API to close all tabs
                 */
        closeAllDocuments = function(e) {
          if (!isMultiView) {
            return;
          }

          if (!view.tabView) {
            return;
          }

          var tgt = pega.util.Event.getTarget(e),
              tmpId = tgt.id,
              documents,
              documentsCount,
              documentsCount_in,
              docEle,
              closeIcon,
              doc,
              i, j,
              dirtyDocsPresent,
              waStrings, unsavedWorkMsg1, unsavedWorkMsg2;

          // Masquerade the target element id as DoClose requires the same
          tgt.id = "close";

          documents = getDocumentsArray();
          documentsCount = getDocumentsArrayLength();
          //HFix-20746: close all need not trigger offsetCalculations for each tab close
          //Intentional Global -  flag for TabView to not trigger offset Calculations for perf reasons
          gCloseAllTabsInProgress = true;
          for (i = 0; i < documentsCount; i++) {
            documentsCount_in = getDocumentsArrayLength();
            for (j = 0; j < documentsCount_in; j++) {
              docEle = getDocumentElement(documents[j]);
              closeIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, docEle);
              if (closeIcon && closeIcon.length > 0) {
                doc = webApi.doAction(getGadgetNameForDocument(documents[j]), GET_UI_DOC);
                if (!(doc && doc.isFormDirty(false))) {
                  closeDocument(e, documents[j], true);
                  break;
                }
              }
            }
          }
          gCloseAllTabsInProgress = false;

          // Revert back the id
          tgt.id = tmpId;

          //Alert for dirty documents
          dirtyDocsPresent = false;
          documentsCount = getDocumentsArrayLength();
          for (i = 0; i < documentsCount; i++) {
            docEle = getDocumentElement(documents[i]);
            closeIcon = domGetElementsByAttribute(DATA_STC, ASTERISK, SPAN_TAG_NAME, docEle);
            if (closeIcon && closeIcon.length > 0) {
              doc = webApi.doAction(getGadgetNameForDocument(documents[i]), GET_UI_DOC);
              if (doc && doc.isFormDirty(false)) {
                dirtyDocsPresent = true;
                break;
              }
            }
          }

          if (dirtyDocsPresent) {
            waStrings = byID("pzWAStrings");
            if (waStrings) {
              unsavedWorkMsg1 = waStrings.getAttribute("data-s7");
              unsavedWorkMsg2 = waStrings.getAttribute("data-s8");
              unsavedWorkCloseAllTextTemplate = unsavedWorkCloseAllTextTemplate.replace("{0}", unsavedWorkMsg1).replace("{1}", unsavedWorkMsg2);
            }
            alert(unsavedWorkCloseAllTextTemplate);
          }
        },
        /*
                 @private- Cleanup callback which is invoked on success of doClose call.
                 @param $Object$responseData – YUI Response Object.
                 */
        dcCleanupCallback = function(responseData) {
          // 07/08/2013 GUJAS1 BUG-110928 Added callback function & args support.
          var threadID = responseData.argument.threadID, callback = responseData.argument.callback, callbackArgs = responseData.argument.callbackArgs;
          if (typeof threadID == "number") {
            releaseThreadId(threadID);
          }
          if (typeof callback == "function") {
            callback.apply(this, callbackArgs);
          }
        },
        /*
                 @private- Closes the specifies viewDoc and cleans-up the content too.
                 @param $Object$viewDoc – Document instance to be replaced.
                 @param $Object$e –  Event instance, Not used.
                 @param $Object$docToClose – Document instance to close. If this is unspecified, the active viewDoc is closed.
                 @return $Boolean$ - False if unable to close the viewDoc.
                 */
        closeDocument = function(e, docToClose, removeThread, params) {
          if (e) {
            pue.stopPropagation(e);
            pue.preventDefault(e);
          }
          var isActiveHost, activeDoc = getActiveDocument(),
              viewDoc = docToClose || activeDoc,
              index, remIndex,
              nextDocument, gadgetName, doc, mruItem, ignoreDirty, notFocusmruHost,
              // BUG-73005 GUJAS1 06/08/2012 Set removeThread to true if closeDocument is invoked by
              // an event handler, not through other API.
              //BUG-73720 RAIDV 06/18/12 Other APIs may remove thread if specified explicitly
              removeThread = removeThread || !(!e),
              backgroundDocClosedOnClick =  (docToClose != activeDoc);
          if (!viewDoc) {
            return;
          }

          pega.desktop.sendEvent('DCDocumentClose', {
            id: docToClose.label,
            handle: docToClose.key,
            GadgetName: docToClose.GadgetName
          });

          remIndex = index = view.getHostIndex(viewDoc);
          if (index > 0) {
            index--;
          }
          if (params) {
            ignoreDirty = params.ignoreDirty;
            notFocusmruHost = params.notFocusmruHost;
          }

          // flag busy to test and performance logger - actions not used for close
          pega.ui.statetracking.setBusy();

          clearAllIndicators();
          isActiveHost = docToClose == activeDoc;
          gadgetName = getGadgetNameForDocument(viewDoc);
          pega.ctxmgr.setDocumentContext(viewDoc);
          doc = webApi.doAction(gadgetName, GET_UI_DOC);
          // 07/18/2013 GUJAS1 BUG-111672: Show Harness based tabs should also clean up their thread.
          if (doc /* && viewDoc.actionDef.action.toLowerCase() != DISPLAY*/) {
            if (backgroundDocClosedOnClick && doc.isFormDirty(false)) {
              focusDocument(docToClose);
              var closeTemp = closeDocument(e, docToClose, removeThread, params);
              pega.ui.statetracking.setDone();
              return closeTemp;
            }
            // 07/08/2013 GUJAS1 BUG-110928 The "argument" part is now a JSON.
            if (!doc.doClose(e, true, {"success": dcCleanupCallback,
                                       "argument": {"threadID": docToClose.ThreadId}}, ignoreDirty)) {
              pega.ui.statetracking.setDone();
              return false;
            }
          } else {
            releaseThreadId(docToClose.ThreadId);
            if(docToClose.docObj){
              executeDoCloseWrapper(docToClose.docObj);   
            }else{
             deleteDocumentThread(docToClose.ThreadName, docToClose);
            }
          }
          // SE-34968 : Providing hook which will be called before closing the tab.
          if (typeof documentOnBeforeClose !== "undefined") {
            documentOnBeforeClose(gadgetName,viewDoc);
          }
          removeDocument(viewDoc);
          nextDocument = view.getHostToFocus(index);
          /*BUG-196041: Maintain the current activeTab in separate property to hold the state irrespective of loading.*/
          setActiveClientTab(nextDocument);
          if (!backgroundDocClosedOnClick) {
            if (nextDocument) {
              nextDocument.removedDocumentName = viewDoc.elementName;
              nextDocument.removedDocumentIndex = index + 2;
              nextDocument.removedDocumentsDocumentGroup = viewDoc.docGroupName;
              nextDocument.removedDocumentKey = viewDoc.key;                            
              //To invoke pzUpdateClipmodels activity, when there is no tab to activate
              if ((nextDocument.get('element').style.VISIBILITY == 'hidden' || nextDocument.get('element').style.visibility == 'hidden') && nextDocument.elementName == undefined && nextDocument.tabGroupName == undefined) {
                pud.sendReqToUpdateElementModal({dynamicContainerID: viewDoc.docGroupName}, 'CLOSE', {dynamicContainerID: viewDoc.docGroupName, tabIndex: remIndex + 1}, {prevContentID: viewDoc.elementName, prevRecordkey: viewDoc.key, prevFormDirty: 'false', key: viewDoc.key, isActiveHost: isActiveHost});
              }
              if (!notFocusmruHost){
                focusDocument(nextDocument);
              }   
            }
          }
          else {
            if (view && view.fixTabsOnBackgroundClick) {
              view.fixTabsOnBackgroundClick();
            }
            if (pud.sendReqToUpdateElementModal) {
              try {
                var isDocumentKey = "false";
                if (pega.web && pega.web.api && e && e.prevValue) {
                  var docObj = pega.web.api.doAction(activeDoc.GadgetName, "getUIDoc");
                  if (docObj && e.newValue.key == docObj.key) {
                    isDocumentKey = "true";
                  }
                }
                pud.sendReqToUpdateElementModal({"dynamicContainerID": activeDoc.tabGroupName || activeDoc.docGroupName,
                                                 "tabIndex": view.getHostIndex(activeDoc) + 1,
                                                 "label": activeDoc.label,
                                                 "key": activeDoc.key,
                                                 "iconPath": activeDoc.iconPath,
                                                 "isDocumentKey": isDocumentKey
                                                },
                                                "CLOSE",
                                                {
                  "dynamicContainerID": viewDoc.tabGroupName || activeDoc.docGroupName,
                  "tabIndex": index + 2, key: viewDoc.key, isActiveHost: isActiveHost
                });
              }
              catch (ex) {
              }
            }
          }

          // flag done to test and performance logger - actions not used for close
          pega.ui.statetracking.setDone();
        },
        /*
                 @private- Gets the maximum number of allowed docs.
                 @return $Number$ - Maximum number of docs which can be opened in pxWorkArea.
                 */
        getMaxDocumentCount = function() {
          var maxDocumentsElement = byID(WAMAXTABS),
              maxDocumentsValue = (maxDocumentsElement) ? maxDocumentsElement.getAttribute("value") : maxDocuments;
          return parseInt(maxDocumentsValue, 10);
        },
        /*
                 @private- Finds if the current viewDoc is dirty and if it so, displays a confirm
                 prompt to the user and returns user choice.
                 @return $Boolean$ - true if the viewDoc is not dirty or user is OK to replace it, false otherwise.
                 */
        confirmDirtyReplace = function(id) {
          var doc = pega.web.api.doAction(id, GET_UI_DOC);
          return (doc && doc.explorerFormIsDirty()) ? confirm(confirmDirtyMessage) : true;
        },

        focusWindow = function(){
          if(pega.u.d.pyIsWindowStealFocusInIEAllowed == 'true'){
            try{
              window.focus();
            }catch(e){

            }
          }
        },
        /*
                 @private- Returns the viewDoc instance for the specified key if it is open, null otherwise.
                 @param $String$key –  Unique key to check against open docs.
                 @return $Object$ - Document instance for the specified key if it is open, null otherwise.
                 */
        checkKeyConflict = function(key, sysId, isWASH, contentID) {
          if (typeof key == UNDEFINED) {
            return NULL;
          }
          var docs = getDocumentsArray(), docCount = getDocumentsArrayLength(), i = 0, docKey = NULL, viewDoc = NULL, elementName = NULL, doc, docDocObj, phPageName;
          for (; i < docCount; i++) {
            doc = docs[i];
            //In case header has only image and no Title, key is not set.
            if (!doc.key && isWASH) {
              var ctEl = getDocumentContentElement(doc);
              var hTemp = domGetElementsByAttribute('harnessNm', ASTERISK, DIV_TAG_NAME, ctEl);
              if (hTemp[0]) {
                docKey = hTemp[0].getAttribute("harnessCls") + "|" + hTemp[0].getAttribute("harnessNm") + "|" + sysId;
              }
            } else {
              docKey = doc.key;
              elementName = doc.elementName;
              phPageName = doc.primaryHarnessPageName;  //PrimaryHarnessPageName for rules created but not saved.
            }
            //Checking docKey and contentID for returning doc object.
            if (docKey && contentID) {
              //If 2 rules exist one with checked out version and other is parent one then activating that document based on both dockey and contentID
              docDocObj = doc.docObj;
              if (docKey == key && contentID == elementName) {
                viewDoc = doc;
                break;
              } else if (((docDocObj && docDocObj.pzPrimaryHarnessPageName == "pyNewResults") || phPageName == "pyNewResults") && contentID == elementName) {
                //For activating rules which are created but not saved.
                viewDoc = doc;
                break;
              }
            } else if (docKey) {
              if (docKey == key) {
                //For openWorkByHandle case from RG.i.e. activating a WorkItem.
                viewDoc = doc;
                break;
              }
            }
          }
          return viewDoc;
        },
        /*
                 @private- Displays conflict dialog and returns the user choice.
                 @param $Object$viewDoc –  Instance of the viewDoc in conflict.
                 @param $String$docName –  Not used, kept for compatibility.
                 @param $Boolean$skipConflictCheck –  If true, this method does not display the dialog
                 returns "yes" as the implied user choice.
                 @return $String$ - "yes" if the user accepts the conflict, "no" otherwise.
                 */
        showConflictDialog = function(viewDoc, docName, skipConflictCheck) {
          if (skipConflictCheck) {
            return YES;
          }
          if (skipDocumentReload) {
            return "no";
          }
          var gadgetName = getGadgetNameForDocument(viewDoc),
              doc = webApi.doAction(gadgetName, GET_UI_DOC),
              application = "",
              label = "",
              id = "",
              conflictText = "",
              result = "no";
          // 01/24/2013 GUJAS1 Changed conflict dialog text to show viewDoc label in the message to make it more relevant.
          if (doc) {
            application = doc.getApplicationName();
            label = viewDoc.Label;
            if (!label) {
              label = doc.getClassLabel();              
            }
            if (!label) {
              label = viewDoc.label;
            }
            id = doc.getID();
            if (id) {
              id = "(" + id + ")";
            }
            conflictText = conflictDialogTextTemplate.replace("{1}", application || "").replace("{2}", label || "").replace("{3}", id || "");
          } else {
            conflictText = conflictDialogNoDocTextTemplate;
          }
          if (confirm(conflictText)) {
            result = YES;
          }
          return result;
        },
        /*
                 @private- Removes busy indicators if any.
                 @return $void$ - .
                 */
        clearAllIndicators = function() {
          setBusyIndicator(false);
        },
        /*
                 @private- Sends a "DesktopAction" event with "ClearIndicators" api request.
                 @return $void$ - .
                 */
        sendClearIndicatorEvent = function() {
          var oSafeURL = new SafeURL();
          oSafeURL.put(API, CLEAR_INDICATORS);
          desktop.sendEvent(DESKTOP_ACTION, oSafeURL);
        },
        /*
                 @private- Shows/hides the busy indicator based on the specified show flag value.
                 @param $Boolean$show –  If true, display the indicator, hide it otherwise.
                 @return $void$ - .
                 */
        setBusyIndicator = function(show, srcElement) {
          if (show) {
            // BUG-90815: JALDS 24/01/2013 - Set the source node upon which the mask and busy loading chould apply.
            if (srcElement != undefined && busyIndicator.setTargetElement) {
              busyIndicator.setTargetElement(srcElement);
            }
            busyIndicator.show();
            if (busyIndicatorHandle != NULL) {
              clearTimeout(busyIndicatorHandle);
            }
            busyIndicatorHandle = setTimeout(sendClearIndicatorEvent, 30000);
            return;
          }
          busyIndicator.hide();
          if (busyIndicatorHandle != NULL) {
            clearTimeout(busyIndicatorHandle);
          }
        },
        /*
                 @private- Gets the array of Document instances maintained by pxWorkArea DocumentView.
                 @return $Object$ - Array of Document instances.
                 */
        getDocumentsArray = function() {
          return view.getHostsArray();
        },
        /*
                 @private- Gets the array of Document instance for specified index.
                 @param $Number$index –  Zero based index value.
                 @return $Object$ - Document instance if found, null otherwise.
                 */
        getDocument = function(index) {
          return view.getHost(index);
        },
        /*
                 @private- Gets the array length of documents array maintained by pxWorkArea DocumentView.
                 This method takes into account the DocumentView orientation and adjusts the
                 array length accordingly. Horizontal orientation DocumentView has an extra
                 dummy Document, which is discounted from the returned count.
                 @return $Number$ - Length of the array.
                 */
        getDocumentsArrayLength = function() {
          return view.getHostsArrayLength();
        },
        /*
                 @private- Returns the active document instance.
                 @return $Object$ - Active document instance.
                 */
        getActiveDocument = function() {
          return view.getActiveHost();
        },
        handleMaxDocs = function(message) {
          return view.handleMaxHosts(message);
        },
        /*
                 @private- Adds and returns a new Document instance with the specified parameters.
                 @param $String$docName –  Label for the viewDoc.
                 @param $Number$docIndex –  Optional, Zero based index value for the new viewDoc's position in the DocumentView.
                 @param $String$canClose –  Reserved.
                 @param $Boolean$icon –  Reserved.
                 @param $Boolean$tooltip –  Reserved.
                 @return $Object$ - Instance of the new viewDoc.
                 */
        addDocumentHost = function(docName, docIndex, canClose, icon, tooltip, contentID, dynamicContainerID, isDeferred, isStaticHarnessWithoutTableFormat, threadName) {
          // 1. Create Document Header and Content Elements.
          // 2. Use YUI DocumentView.addDocument to add a new Document.
          if (!docName) {
            docName = "";
          }
          var newDocument = view.addHost(docName, docIndex, canClose, icon, tooltip, contentID, dynamicContainerID, isDeferred, closeDocument, dcCleanupCallback, removeGadget, isStaticHarnessWithoutTableFormat, threadName);
          if (!newDocument) {
            return NULL;
          }
          if (!contentID) {
            contentID = uuid();
          }
          if (contentID && contentID != "")
            newDocument.elementName = contentID;

          if (dynamicContainerID && dynamicContainerID != "") {
            newDocument.docGroupName = dynamicContainerID;
          }

          //TASK-134746 Adding HarnessName to the newDocument object:JAINB1
          newDocument.pyStreamName = ui.pyStreamName;

          //New docs are sync on onload,should skip activation sync.

          return newDocument;
        },

        activateDocument = function(index) {
          var doc = getDocument(index);
          focusDocument(doc);
        },

        /*
                 @private- Brings the specified document into focus.
                 @param $Object$viewDoc –  Document instance to focus.
                 @return $void$ - .
                 */
        focusDocument = function(viewDoc) {
          // BUG-120358 GUJAS1 09/11/2013 Added reference check before invoking focusHost.
          if (viewDoc) {
            view.focusHost(viewDoc);
          }
          delete this.activeClientTab;
        },

        testMethod = function(){

        },

        /*
                 @private- Gets the content Dom element of the specified document.
                 This is the element that hosts the content for the document.
                 @param $Object$document –  Document instance.
                 @return $Object$ - Dom element.
                 */
        getDocumentContentElement = function(viewDoc) {
          return view.getHostContentElement(viewDoc);
        },
        /*
                 @private- Gets the header Dom element of the specified document.
                 This is the element that hosts the header for the document.
                 @param $Object$document –  Document instance.
                 @return $Object$ - Dom element.
                 */
        getDocumentElement = function(viewDoc) {
          return view.getHostElement(viewDoc);
        },
        /*
                 @private- Updates the label of the specified viewDoc with the specified value.
                 @param $Object$viewDoc –  Document instance.
                 @param $String$label –  New label.
                 @return $void$ - .
                 */
        setDocumentLabel = function(viewDoc, label) {
          var tabDocObj = getGadgetDocObjFromTab(viewDoc);
          if(tabDocObj && tabDocObj.skipTabUpdate) {
            return;
          }
          view.setHostLabel(viewDoc, decodeURIComponent(label));
          /*BUG-209487 : Setting Title this will be used when setDocumentLabel / CT changes (pyDocumentTitle) is triggered.*/
          view.setHostTitle(viewDoc, decodeURIComponent(label));

        },
        /*
                 @private- Updates the icon of the specified viewDoc with the specified value.
                 @param $Object$viewDoc –  Document instance.
                 @param $String$iconPath –  URL of the new icon.
                 @param $String$iconTitle –  Title text of the new icon.
                 @return $void$ - .
                 */
        setDocumentIcon = function(viewDoc, iconPath, iconTitle) {
          var tabDocObj = getGadgetDocObjFromTab(viewDoc);
          if(tabDocObj && tabDocObj.skipTabUpdate) {
            return;
          }
          view.setHostIcon(viewDoc, iconPath, iconTitle);

        },
        /*
                 @private- Updates the tooltip of the specified viewDoc with the specified value.
                 The DocumentView overrides the tooltip value whenever the viewDoc becomes active.
                 To get around this problem, this method shadows the tooltip value in
                 a property. When the viewDoc becomes active, the reinstateDocumentTitle method
                 uses this shadow property value to restore the tooltip.
                 @param $Object$viewDoc –  Document instance.
                 @param $String$title –  New tooltip.
                 @return $void$ - .
                 */
        setDocumentTitle = function(viewDoc, title) {
          var tabDocObj = getGadgetDocObjFromTab(viewDoc);
          if(tabDocObj && tabDocObj.skipTabUpdate) {
            return;
          }
          view.setHostTitle(viewDoc, title);
        },
        /*
                 @private- Gets the label of the specified viewDoc.
                 @param $Object$viewDoc –  Document instance.
                 @return $String$ –  Document label.
                 */
        getDocumentLabel = function(viewDoc) {
          return view.getHostLabel(viewDoc);
        },
        /*
                 @private- Gets the label of the specified viewDoc.
                 @param $Object$viewDoc –  Document instance.
                 @return $String$ –  Document label.
                 */
        getDocumentIcon = function(viewDoc) {
          return view.getHostIcon(viewDoc);
        },
        /*
                 @private- Gets the tooltip of the specified viewDoc.
                 @return $String$ –  Document tooltip.
                 */
        getDocumentTitle = function(viewDoc) {
          return view.getHostTitle(viewDoc);
        },
        //* TAB Management API End *//

        // ** Thread API Begin ** //

        /*
                 @private- Gets the next applicable tab index.
                 @return $Number$ –  Next applicable tab index.
                 */
        getNextDocumentIndex = function() {
          return view.getNextHostIndex();
        },
        /*
                 @private- Reserves and returns the next free thread id. -1 if no free threads are left.
                 The thread management system removes the reserved thread id from
                 the list of available thread ids and puts them into the used slot.
                 @return $Number$ –  0..maxTabs if threads are available, -1 if no threads left.
                 */
        getFreeThreadId = function() {
          var thread = freeThreads.shift();
          if (typeof (thread) == UNDEFINED || thread.length == -1) {
            thread = -1;
          } else {
            usedThreads[thread] = thread;
          }
          return thread;

        },
        /*
                 @private- Puts the specified thread id into the available list.
                 @param $Number$id –  Thread Id to release from the used slot.
                 @return $void$ – .
                 */
        releaseThreadId = function(id) {
          freeThreads.unshift(id);
          delete usedThreads[id];
        },
        /*
                 @private- Initializes the available and used thread id lists.
                 @return $void$ – .
                 */
        initializeThreadBuckets = function() {
          for (var i = 0; i < maxDocuments; i++) {
            freeThreads.push(i);
          }
        },
        // ** Thread API End ** //

        //*IAC API start*//

        /*
                 @private- Initializes IAC specific content for the specified tab.
                 @param $Object$tab –  Tab instance.
                 @return $void$ – .
                 */
        initGadget = function(viewHost) {
          var harCtxMgr = pega.ui.HarnessContextMgr;
          var hostContentEle = getDocumentContentElement(viewHost),
              currentThreadId, gadgetName,
              gadgetId, portalID = harCtxMgr.get("portalID"), tabThreadNameTemplate, threadName;
          if (viewHost.ThreadId != undefined) {
            currentThreadId = viewHost.ThreadId;
            updateThreadBuckets(viewHost.ThreadId);
          } else {
            currentThreadId = getFreeThreadId();
          }
          gadgetId = GADGET_ID + currentThreadId;
          hostContentEle.setAttribute("id", gadgetId);
          // 04/02/2013 GUJAS1 Prepend Portal ID if available (https://mesh.pega.com/docs/DOC-38227)
          if (portalID != null && portalID != "") {
            tabThreadNameTemplate = portalID + TAB_THREAD;
          }
          else {
            tabThreadNameTemplate = TAB_THREAD;
          }
          threadName = tabThreadNameTemplate + currentThreadId;
          hostContentEle.setAttribute(PEGA_THREAD, threadName);

          gadgetName = PEGA_GADGET + currentThreadId;
          hostContentEle.setAttribute(PEGA_GADGET, gadgetName);
          hostContentEle.setAttribute(PEGA_E_ON + "DomReady", PEGA_UI_WAGADGET + "onGadgetDomReady");
          hostContentEle.setAttribute(PEGA_E_ON + "Error", PEGA_UI_WAGADGET + "onGadgetDomReady");
          hostContentEle.setAttribute(PEGA_E_ON + "Load", PEGA_UI_WAGADGET + "onGadgetDomLoad");
          hostContentEle.setAttribute(PEGA_E_ON + "Close", PEGA_UI_WAGADGET + "onGadgetClose");
          //hostContentEle.setAttribute(PEGA_E_ON + "Resize", PEGA_UI_WAGADGET + "onGadgetResize");
          // BUG-125490 GUJAS1 10/04/2013 Remove this gadget if it is already there. This happens in situations where
          // DC lies inside a section and the section is refreshed, resulting in orphan gadgets still registered in
          // PegaCompositeGadgetMgr collection.
          webApi.removeGadget(gadgetName);
          webApi.addGadget(hostContentEle, window);

          viewHost.ThreadId = currentThreadId;
          // 04/02/2013 GUJAS1 Store complete thread name as a tab property for reference when deleting the thread later.
          viewHost.ThreadName = threadName;
          viewHost.GadgetName = gadgetName;
          viewHost.GadgetId = gadgetId;
        },
        /*
                 @private- Removes the IAC specified content from the specified tab.
                 @param $Object$tab –  Tab instance.
                 @return $void$ – .
                 */
        removeGadget = function(viewHost) {
          var iframeDiv = getDocumentContentElement(viewHost);
          var iframeElem = iframeDiv.getElementsByTagName('iframe')[0];

          // Do not release thread ID inline. It will be released in the doClose success callback.
          //releaseThreadId(viewHost.ThreadId);
          var gadgetName = viewHost.GadgetName;
          // Remove the content element (and it's IFRAME's) event listeners so they do not get invoked when the "blank" action completes.

          if (iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.document && iframeElem.contentWindow.document.body) {
            iframeElem.contentWindow.document.body.onresize = null;
          }

          pue.purgeElement(iframeDiv, true);
          webApi.doAction(gadgetName, "blank");
          webApi.removeGadget(gadgetName);
        },
        /*
                 @private- Returns the tab instance catering to the specified IAC gadget name, or null.
                 @param $String$gadgetName –  IAC gadget name.
                 @return $Object$ –  Tab instance or null.
                 */
        getDocumentByGadgetName = function(gadgetName) {
          var viewHosts = getDocumentsArray(), i = 0, limit = viewHosts.length;
          for (; i < limit; i++) {
            var viewHost = viewHosts[i];
            if (viewHost.GadgetName == gadgetName) {
              return viewHost;
            }
          }

          return null;
        },
        /*
                 @private- Gets the IAC gadget name catered by the specified tab or empty string.
                 @param $Object$tab –  Tab instance.
                 @return $String$ –  IAC Gadget name catered by the tab or empty string.
                 */
        getGadgetNameForDocument = function(viewHost) {
          return viewHost.GadgetName || "";
        },

        /*
                 @private- Gets the gadget doc object catered by the specified tab or empty string.
                 @param $Object$viewHost –  Tab instance.
                 @return $Object$ –  Gadget doc object catered by the tab.
                 */
        getGadgetDocObjFromTab = function(viewHost) {
          var tabDocObject = null;
          var gadgetName = getGadgetNameForDocument(viewHost);
          if (gadgetName && gadgetName != "") {
            tabDocObject = webApi.doAction(gadgetName, GET_UI_DOC);                    
          }
          return tabDocObject;
        },


        /*
                 @private- Gets the IAC Gadget ID of the specified tab or empty string.
                 @param $Object$tab –  Tab instance.
                 @return $String$ –  IAC Gadget ID or empty string.
                 */
        getGadgetIdForDocument = function(viewHost) {
          return viewHost.GadgetId || "";
        },
        onDocumentDirty = function(doc) {
          if (doc) {
            var strUrlSF = new SafeURL("pzUpdateRecentState");
            if (doc.contentID)
              strUrlSF.put("contentID", doc.contentID);
            else
              strUrlSF.put("contentID", "");
            strUrlSF.put("recordKey", doc.getDocumentKey());
            doc.asyncRequest('POST', strUrlSF, null, null);
          }
        },
        ctCallback = function(ct, host) {
          if (host) {
            var doc = webApi.doAction(getGadgetNameForDocument(host), GET_UI_DOC),
                documentKey = ct.getPropertyValue(doc.primaryPageName + ".pzDocumentKey"),
                conflictingHost = null,
                system = doc.getSystemName();
            if (documentKey && host.attribs.key != documentKey) {
              conflictingHost = checkKeyConflict(documentKey, system);
              if (conflictingHost) {
                var staleDoc = webApi.doAction(getGadgetNameForDocument(conflictingHost), GET_UI_DOC);
                staleDoc.retainLock = true;
                staleDoc.gDirtyOverride = false;
                closeDocument(null, conflictingHost, true);
                focusDocument(host);
              }

              //Since old tab is now closed and new tab opens up, key must be set to the value of handle. Non-conflicting case will continue working as before.
              host.key = host.attribs.key = documentKey;
            }
          }
        },
        /*Change Tracking Document Title to Update TabLabel*/
        tabLabelCTCallback = function(ct, host) {
          if (host) {
            var doc = webApi.doAction(getGadgetNameForDocument(host), GET_UI_DOC),
                documentTitle = ct.getPropertyValue(doc.primaryPageName + ".pyDocumentTitle");

            if (documentTitle && host.label != documentTitle) {
              setDocumentLabel(host, documentTitle);
            }
          }
        },
        /*
                 @private- This method executes when IAC gadget content is loaded in a tab.
                 It updates the host tab with the loaded data.
                 @param $String$gadgetName –  IAC gadget name.
                 @return $void$ – .
                 */
        handleGadgetLoad = function(gadgetName) {
          clearAllIndicators();
          // BUG-73757 GUJAS1 11/08/2012 Return after clearing busy indicator if in single view DC.
          if (!isMultiView) {
            return;
          }
          var viewHost = getDocumentByGadgetName(gadgetName),
              tooltip = getDocumentTitle(viewHost),
              doc = webApi.doAction(gadgetName, GET_UI_DOC),
              workID,
              handle,
              label,
              iconPath,
              actionDef = viewHost.actionDef,
              action,
              docName,
              className,
              harnessName,
              systemID,
              docClass,
              system,
              appName,
              key,
              oSafeURL,
              gadgetId,landingAction,
              // TASK-128496 GUJAS1 11/23/2012 New variables for pzDocumentKey related code.
              documentKey = "",
              conflictingHost,
              // TASK-157648 GUJAS1 04/30/2013 Reorganiged metaXML for minif. Added docToolTip & docLabel.
              metaXML,
              docToolTip = "", docLabel = "";
          if (!doc) {
            return;
          }
          if(viewHost && viewHost.docObj){
            delete viewHost.docObj;
          }   


          /*BUG-211309 To maintain same thread name at client side in IAC case. */          
          var latestThreadName = doc.getThreadName();
          var threadName = viewHost.ThreadName;
          if(( latestThreadName != threadName) && (latestThreadName.substring(latestThreadName.length-1) == threadName.substring(threadName.length-1) )){
            viewHost.ThreadName =  latestThreadName;
          }                   
          doc.portalName = pega.u.d.portalName;
          /*
                     Attaching keyup events on iframe body tag using registerTabContentAccessibilityHandler to
                     handle CTRL+PageUp, CTRL+PageDown, ALT+DEL events.
                     */
          if (view.ViewType == 'Tabbed') {
            doc.registerTabContentAccessibilityHandler(viewHost);
          }
          // 05/30/2013 GUJAS1 Add CT callback handler
          if (typeof doc.registerDCCTNotifyCallback == "function") {
            doc.registerDCCTNotifyCallback(ctCallback, that, viewHost, [doc.primaryPageName + ".pzDocumentKey"]);
            doc.registerDCCTNotifyCallback(tabLabelCTCallback, that, viewHost, [doc.primaryPageName + ".pyDocumentTitle"]);
          }

          // TASK-157648 GUJAS1 04/30/2013 Determine document label and tooltip values.
          docLabel = doc.getDocumentTitle();
          docToolTip = doc.getDocumentTooltip();

          /*BUG-142611: IE11 Harnes tabs are not rendering when placed in Screen Layouts*/
          if (pue.isIE == 11 && (view.tabPosition == "Left" || view.tabPosition == "Right")) {
            var dcMainDiv = $(".dc-main")[0];
            if (dcMainDiv.style.zoom == "") {
              dcMainDiv.style.zoom = 1;
            } else {
              dcMainDiv.style.zoom = "";
            }
          }
          // TASK-128496 GUJAS1 11/23/2012 Load pzDocumentKey if it is present.
          //BUG-94824 get pzDocumentKey from primary page
          metaXML = doc.getProperty("PRXML");
          documentKey = doc.getDocumentKey();
          doc.contentID = viewHost.elementName;
          /*sings9: Tab Title displays junk characters(BUG-230875). 
                      Soln: Added a code to decode the Id to show proper Title.
                    */
          workID = pega.tools.Security.decodeCrossScriptingFilter(doc.getID());
          docLabel = pega.tools.Security.decodeCrossScriptingFilter(docLabel);

          label = doc.getLabel();
          /* Autobots 6.2 Sprint 11 - WorkArea Icons Story - kumar4 - Start */
          iconPath = doc.getWorkIcon();
          if (iconPath && (doc.trim(iconPath) != ""))
            setDocumentIcon(viewHost, iconPath);
          /* Autobots 6.2 Sprint 11 - WorkArea Icons Story - kumar4 - End */
          // TASK-128496 GUJAS1 11/23/2012 Added blank documentKey check along with blank Work ID check
          action = actionDef.action.toLowerCase();
          landingAction =   actionDef.landingAction;
          if (workID == "" && documentKey == "") {
            tooltip = getDocumentTitle(viewHost);
            if (tooltip == null || tooltip == "")
              tooltip = getDocumentLabel(viewHost);
            if (actionDef) {
              // TASK-128496 GUJAS1 11/23/2012 metaXML declaration and init moved earlier.
              if (typeof metaXML !== 'undefined' && metaXML !== '') {
                label = getRuleElement(metaXML, 'pyRuleName');
                tooltip = getRuleElement(metaXML, 'pyLabel');
              }
              docName = actionDef.hostName;
              className = actionDef.className;
              harnessName = actionDef.harnessName;
              if (actionDef.configObj) {
                systemID = actionDef.configObj.systemID;
              }
              docClass = actionDef.docClass;
              if (action == DISPLAY || action == "openlanding") {
                if (docName) {
                  handle = docName;
                }
                else {
                  handle = className + "|" + harnessName + "|" + systemID;
                }
              } else if (action == "openwizard") {
                handle = docClass;
              } else if (action == "openrulebykeys") {
                handle = viewHost.attribs.key;

              } else if (action == "openrulebyclassandname") {
                handle = viewHost.attribs.key;

              } else if (action == "openrulespecific") {
                handle = viewHost.attribs.key;

              } else if (action == "displayonpage") {
                handle = viewHost.attribs.key;
              }else if (action == "reportdefinition") {
                handle = viewHost.attribs.key;
              }
              else {
                handle = view.getNextHostIndex() + "T";
              }
            }
            // TASK-157648 GUJAS1 04/30/2013 If custom label and tooltip values are present, use them

            if (typeof docLabel == "string" && docLabel != "") {
              label = docLabel;
            }

            if (typeof docToolTip == "string" && docToolTip != "") {
              tooltip = docToolTip;
            }
            if (label != null && label.trim() != "") {
              setDocumentLabel(viewHost, label);
            }
            if (tooltip != null && tooltip != "") {
              setDocumentTitle(viewHost, tooltip);
            }
            //BUG-127903: Updating host's key with documentTitle if it is updated on server side for showHarness Case.
            if (action == DISPLAY || (action == "openlanding" && landingAction == "Display")) {
              if (doc.documentTitle)
                handle = doc.documentTitle;
            }
          }
          else {
            // TASK-128496 GUJAS1 11/23/2012 Call getHandle only for Work Documents.
            if (workID != "") {
              if (documentKey != "") {
                handle = documentKey;
              } else {
                handle = doc.getHandle();
              }

            }
            else {
              // No Work ID at this stage implies a valid documentKey is present,
              // set it as the handle.
              handle = documentKey;
            }
            if(!handle){
              handle = viewHost.key;
            } 
            try {
              system = doc.getSystemName();
              appName = doc.getApplicationName();
            }
            catch (e) {
            }
            // TASK-128496 GUJAS1 11/23/2012 Wrapped older key population in Work ID check.
            // This is important since when documentKey is present, the key should be set to that value.
            if (workID) {
              key = handle + " " + system;
              if ((label == null || label == "") && action != "openwizard") {
                label = workID;
              }
            }
            else {
              // TASK-128496 GUJAS1 11/23/2012 Document Key case, populate label & tooltip from metadata.
              key = handle;
              if (typeof metaXML !== 'undefined' && metaXML !== '') {
                if (!label || label.trim() === '') {
                  label = getRuleElement(metaXML, 'pyRuleName');
                  if (label == '') {
                    label = getRuleElement(metaXML, 'pyLabel');
                  }
                }
                if (!tooltip) {
                  tooltip = getRuleElement(metaXML, 'pyLabel');
                }
              }
            }

            oSafeURL = new SafeURL();
            oSafeURL.put(API, WORK_LOADED);
            if(handle){
              oSafeURL.put(KEY, handle);
            }

            if (system){
              oSafeURL.put(SYSTEM_ID, system);
            }
            if (appName){
              oSafeURL.put(APP_NAME, appName);
            }
            // TASK-128496 GUJAS1 11/23/2012 Put WorkID only when it is present
            if (workID != "") {
              oSafeURL.put("workID", workID);
            }
            // TASK-128496 GUJAS1 11/23/2012 Put label only if it is specified.
            if (label) {
              oSafeURL.put(LABEL, label);
            }

            oSafeURL.put("action", action);
            oSafeURL.put("GadgetName", gadgetName);

            desktop.sendEvent(DESKTOP_ACTION, oSafeURL);
            // TASK-128496 GUJAS1 11/23/2012 Change tooltip to mention WorkID only when WorkID is present.
            tooltip = doc.getPyLabel();
            if (workID != "") {
              tooltip = workID + ":" + tooltip;
            }

            // TASK-157648 GUJAS1 04/30/2013 If custom label and tooltip values are present, use them

            if (typeof docLabel == "string" && docLabel != "") {
              label = docLabel;
            }

            if (typeof docToolTip == "string" && docToolTip != "") {
              tooltip = docToolTip;
            }

            /* BUG-259238: Get rid of HTML character references */
            var htmlEntityDecoder = document.createElement('div'); 

            // TASK-128496 GUJAS1 11/23/2012 Update document Label only when a non-null value is available.
            if (label != null) {
              htmlEntityDecoder.innerHTML = label; 
              label = htmlEntityDecoder.innerText || htmlEntityDecoder.textContent; 
              setDocumentLabel(viewHost, label);
            }
            // TASK-128496 GUJAS1 11/23/2012 Update document tooltip only when a non-null value is available.
            if (tooltip != null) {
              htmlEntityDecoder.innerHTML = tooltip; 
              tooltip = htmlEntityDecoder.innerText || htmlEntityDecoder.textContent; 

              setDocumentTitle(viewHost, tooltip);
            }
          }
          var iframeTitle = getDocumentLabel(viewHost);
          if(!iframeTitle){
            if(viewHost.actionDef && viewHost.actionDef.action == "display"){
              iframeTitle = viewHost.actionDef.harnessName;
            }
          }
          webApi.doAction(gadgetName, "setGadgetTitle",iframeTitle);
          /*BUG-73720(RAIDV) : Fixing GetNextWork issue of opening multiple documents when get next work is invoked more than once.
                     Enhancement as part of this HFix is new document that opens up is considered fresh while old has gone stale. So close old one and open new one.
                     And bring it to focus. Old document will be closed 'silently' without dirty warnings.*/

          if (viewHost.attribs.key != handle) {
            conflictingHost = checkKeyConflict(handle, system);
            if (conflictingHost) {
              // BUG-114763 GUJAS1 08/05/2013 Landing pages should just be focused.
              if ((conflictingHost.actionDef
                   && conflictingHost.actionDef.action
                   && conflictingHost.actionDef.action.toLowerCase() == "openlanding") || (conflictingHost.docObj &&  conflictingHost.docObj.openlanding == "openlanding") ) {
                /*closeDocument(null, viewHost, true);
                                 focusDocument(conflictingHost);*/
                //BUG-124162: Added timeout to avoid script error because of onload handlers which are executed after closing of document
                window.setTimeout(function() {
                  var removedTab ={ "dynamicContainerID": viewHost.tabGroupName || viewHost.docGroupName,"tabIndex": view.getHostIndex(viewHost) + 1, key: viewHost.key, isActiveHost: false}; 
                  focusDocument(conflictingHost);
                  closeDocument(null, viewHost, true, {notFocusmruHost: true});                                    
                  var isDocumentKey = "false",docObj;
                  if (pega.web && pega.web.api && conflictingHost.GadgetName) {
                    docObj = pega.web.api.doAction(conflictingHost.GadgetName, "getUIDoc");
                    if (docObj && conflictingHost.key == docObj.key) {
                      isDocumentKey = "true";
                    }
                    docObj = docObj || pega.u.d;
                    var curTab = {"dynamicContainerID": conflictingHost.tabGroupName || conflictingHost.docGroupName,
                                  "tabIndex": view.getHostIndex(conflictingHost) + 1,
                                  "label": conflictingHost.label,
                                  "key": conflictingHost.key,
                                  "iconPath": conflictingHost.iconPath,
                                  "isDocumentKey": isDocumentKey
                                 };
                    if(docObj){
                      //docObj.sendReqToUpdateElementModal(curTab, "CLOSE", removedTab);
                    }                                        
                  }                                    
                }, 0);
              }
              else {
                var gadgetName = getGadgetNameForDocument(conflictingHost);
                if (gadgetName && gadgetName != "") {
                  var staleDoc = webApi.doAction(gadgetName, GET_UI_DOC);
                  staleDoc.retainLock = true;
                  staleDoc.gDirtyOverride = false;
                }
                //Close old document AND remove thread too but retain lock since lock is not thread specific.
                /*closeDocument(null, conflictingHost, true);
                                 focusDocument(viewHost);*/
                //BUG-124162: Added timeout to avoid script error because of onload handlers which are executed after closing of document
                window.setTimeout(function() {
                  if((conflictingHost.actionDef
                                    && conflictingHost.actionDef.action
                                    && conflictingHost.actionDef.action.toLowerCase() == "getnextworkitem")){
                                     conflictingHost = checkKeyConflict(handle, system);
                                     }
                  var removedTab ={ "dynamicContainerID": conflictingHost.tabGroupName || conflictingHost.docGroupName,"tabIndex": view.getHostIndex(conflictingHost) + 1, key: conflictingHost.key, isActiveHost: false}; 
                  closeDocument(null, conflictingHost, true, {notFocusmruHost: true});
                  focusDocument(viewHost);
                  var isDocumentKey = "false",docObj;
                  if (pega.web && pega.web.api && viewHost.GadgetName) {
                    docObj = pega.web.api.doAction(viewHost.GadgetName, "getUIDoc");
                    if (docObj && viewHost.key == docObj.key) {
                      isDocumentKey = "true";
                    }
                  }
                  docObj = docObj || pega.u.d;
                  var curTab = {"dynamicContainerID": viewHost.tabGroupName || viewHost.docGroupName,
                                "tabIndex": view.getHostIndex(viewHost) + 1,
                                "label": viewHost.label,
                                "key": viewHost.key,
                                "iconPath": viewHost.iconPath,
                                "isDocumentKey": isDocumentKey
                               };
                  if(docObj){
                    //docObj.sendReqToUpdateElementModal(curTab, "CLOSE", removedTab);
                  }
                }, 0);
              }
            }
            //Since old document is now closed and new document opens up, key must be set to the value of handle. Non-conflicting case will continue working as before.
            viewHost.key = viewHost.attribs.key = handle;
          }
          viewHost.pyStreamName = doc.pyStreamNameForGadget;
          viewHost.primaryHarnessPageName = doc.primaryPageName;     //TASK-134746 Adding primaryHarnessPageName parameter to document Object JAINB1.
          syncDocumentElementInfo(viewHost);

          gadgetId = getGadgetIdForDocument(viewHost);
          if(pega.u.d.SET_WINDOW_TITLE !== false) {
            doc.updateWindowTitle(viewHost, true);
          }
          pue.onContentReady(
            gadgetId,
            function(gadgetDivId) {
              var gadgetDiv = byID(gadgetDivId),
                  frameChild,
                  frameChildStyle;
              if (gadgetDiv) {
                frameChild = gadgetDiv.getElementsByTagName(IFRAME_TAG_NAME);
                if (frameChild && frameChild[0]) {
                  frameChild = frameChild[0];
                  frameChildStyle = frameChild.style;

                  //BUG-92800 - PULIP
                  if (pega.u.d.isAccessible && tooltip)
                    frameChild.setAttribute(TITLE, tooltip);

                  //frameChild.setAttribute(LONG_DESC, tooltip);
                  if (!pega.util.Dom.hasClass(document.body, "with-fixed-header")) {
                    if(!(pega.u.d._isDC() && pega.u.d._isJSResizeEnabled())){
                      if (frameChild.height != PERCENT100) {
                        frameChildStyle.height = frameChild.height = PERCENT100;
                      }
                    }
                    if (frameChildStyle.visibility != VISIBLE) {
                      frameChildStyle.visibility = VISIBLE;
                    }
                  }
                }
              }
            },
            gadgetId,
            true);
        },
        /*
                 @private- Syncs up the specified tab's content ID and container ID with the server clipboard model
                 @return $Object$ – tab to sync.
                 */
        syncDocumentElementInfo = function(viewHost) {
          var docGroupName = viewHost.docGroupName,
              tabIndex = view.getHostIndex(viewHost),
              label = viewHost.label,
              key = viewHost.key,
              iconPath = viewHost.iconPath;
          //TASK-134746 Adding ThreadID,ClassName,primaryHarnessPageName,StreamName and Label - JAINB1.

          if (pud.sendReqToUpdateElementModal) {
            try {
              /*pud.sendReqToUpdateElementModal({
                             "dynamicContainerID": docGroupName,
                             "tabIndex": tabIndex+1,
                             "label": label,
                             "key": key,
                             "iconPath": iconPath
                             }, "OPEN");*/
            }
            catch (ex) {
            }
          }
        },
        /*
                 @private- returns the element value if found
                 @return $String$ – .
                 */
        getRuleElement = function(xml, elem, flag) {
          var regexString = '<' + elem + '>([^<]*)<\/' + elem + '>',
              match = new RegExp(regexString).test(xml),
              elemValue;
          if (!match && typeof flag === 'undefined') {
            return getRuleElement(xml, 'pxInsName', true);
          }
          elemValue = match === true ? RegExp.$1 : '';

          return elemValue;
        },
        /*
                 @private- Handles close event on the IAC document to close the host tab.
                 @return $void$ – .
                 */
        handleGadgetClose = function(gadgetName) {
          if (isMultiView) {
            // BUG-97001 03/08/2013 GUJAS1 Fixed the incorrect closing of active tab and static tabs [
            if (!gadgetName) {
              return;
            }
            var viewHost = getDocumentByGadgetName(gadgetName);
            if (!viewHost || !viewHost.attribs || viewHost.attribs.close != "yes") {
              return;
            }
            // Close the gadget tab
            closeDocument(null, viewHost);
            /*
                         if(view && view.ViewType == "NoHeader"){
                         runDefaultActionForNoHeader();
                         }*/
            // ]BUG-97001
          }
          else {
            runDefaultAction();
          }
        },
        runDefaultActionForNoHeader = function() {
          if (singleDocumentRuleType == RULE_HTML_HARNESS) {
            display(singleDocumentRuleName, singleDocumentRuleClass, singleDocumentUsingPage, "", singleDocumentModel, {isWAStaticHarness: true}, "", "");
            return;
          }
          var childNodes = dom.getChildren(singleDocumentGadget),
              childNodesLength = childNodes.length, elementName = NULL, i = 0, j = 0, childNode;
          childNode = childNodes[0];
          var modules = dom.getChildren(childNode),
              modulesLength = modules.length;
          for (; i < modulesLength; i++) {
            module = modules[i];
            childNodes = dom.getChildren(module);
            childNodesLength = childNodes.length;
            module.style.display = NONE;
            for (j = 0; j < childNodesLength; j++) {
              childNode = childNodes[j];
              if (childNode && childNode.getAttribute("class") == "bd") {
                childNodes = dom.getChildren(childNode);
                if (childNodes && childNodes[0].id == RULE_KEY && childNodes[0].getAttribute(NODE_NAME) == singleDocumentRuleName) {
                  module.style.display = BLOCK;
                  elementName = module.elementName;
                }
              }
            }
          }
          if (elementName && moduleView) {
            modules = null;
            modules = moduleView.get('modules');
            modulesLength = modules.length;
            for (i = 0; i < modulesLength; i++) {
              module = modules[i];
              if (module.elementName == elementName) {
                moduleView.set('activeIndex', i);
              }
            }
          }
        },
        /*
                 @private- Handles close event on the IAC document in single document mode to load the default section/harness.
                 @return $void$ – .
                 */
        runDefaultAction = function() {
          if (singleDocumentRuleType == RULE_HTML_HARNESS) {
            display(singleDocumentRuleName, singleDocumentRuleClass, singleDocumentUsingPage, "", singleDocumentModel);
          }
          else {
            var childNodes = dom.getChildren(singleDocumentGadget),
                childNodesLength = childNodes.length, sectionElement = NULL, iframeElement = NULL, i = 0, childNode;
            for (; i < childNodesLength; i++) {
              childNode = childNodes[i];
              if (childNode.id == RULE_KEY && childNode.getAttribute(NODE_NAME) == singleDocumentRuleName) {
                sectionElement = childNode;
                continue;
              }
              if (childNode.tagName.toLowerCase() == IFRAME_TAG_NAME) {
                iframeElement = childNode;
              }
            }
            if (iframeElement) {
              iframeElement.style.display = NONE;
            }
            if (sectionElement) {
              sectionElement.style.display = BLOCK;
              pud.reloadSectionEncoded(sectionElement, NULL, NULL, false, true, -1, false, NULL, singleDocumentModel, NULL);
            }
          }
          // BUG-73757 GUJAS1 11/08/2012 Clear any busy indicators in action.
          clearAllIndicators();
        },
        //*IAC API end*//

        //*Resize Logic start *//
        /*
                 @private- Gets the padding and border values for the passed element.
                 @param $Object$container – The DOM object.
                 @return $Object$ - JSON object with values paddingLeft, paddingRight, paddingTop, paddingBottom,
                 borderLeft, borderRight, borderTop, borderBottom.
                 */
        getPaddingAndBorderValues = function(container) {
          var paddingLeft, paddingRight, paddingTop, paddingBottom,
              borderLeft, borderRight, borderTop, borderBottom;
          container = new p.util.Element(container);
          paddingLeft = paddingRight = paddingTop = paddingBottom = 0;
          borderLeft = borderRight = borderTop = borderBottom = 0;
          paddingLeft = parseInt(container.getStyle("padding-left"));
          paddingLeft = isNaN(paddingLeft) ? 0 : paddingLeft;
          paddingRight = parseInt(container.getStyle("padding-right"));
          paddingRight = isNaN(paddingRight) ? 0 : paddingRight;
          paddingTop = parseInt(container.getStyle("padding-top"));
          paddingTop = isNaN(paddingTop) ? 0 : paddingTop;
          paddingBottom = parseInt(container.getStyle("padding-bottom"));
          paddingBottom = isNaN(paddingBottom) ? 0 : paddingBottom;

          borderLeft = parseInt(container.getStyle("border-left-width"));
          borderLeft = isNaN(borderLeft) ? 0 : borderLeft;
          borderRight = parseInt(container.getStyle("border-right-width"));
          borderRight = isNaN(borderRight) ? 0 : borderRight;
          borderTop = parseInt(container.getStyle("border-top-width"));
          borderTop = isNaN(borderTop) ? 0 : borderTop;
          borderBottom = parseInt(container.getStyle("border-bottom-width"));
          borderBottom = isNaN(borderBottom) ? 0 : borderBottom;
          return {
            "paddingLeft": paddingLeft, "paddingRight": paddingRight, "paddingTop": paddingTop, "paddingBottom": paddingBottom,
            "borderLeft": borderLeft, "borderRight": borderRight, "borderTop": borderTop, "borderBottom": borderBottom
          };
        },
        /*
                 @private- Calculates the required width and height for the tab content based on the layout resize.
                 @return $void$ – .
                 */
        setResizeWidthHeight = function() {
          if (pega.util.Dom.hasClass(document.body, "with-fixed-header")){
            return;
          }
          if (!pud.portal){
            return;
          }
          var layoutObj = pud.portal.layoutObj,
              sizes = layoutObj.getSizes(),
              centerLayoutHeight = sizes.center.h,
              centerLayoutWidth = sizes.center.w,
              centerLayoutEl = layoutObj.getUnitByPosition("center").body;
          newWidth = centerLayoutWidth - hPadding - hBorder;
          newHeight = centerLayoutHeight - nonWALayoutHeight - vPadding - vBorder;
          if (isMultiView) {
            resizeTabContent({});
            if (pxWorkAreaDiv) {
              centerLayoutEl.style.overflow = (pxWorkAreaDiv.offsetHeight == 0 || this._hasWASiblings) ? "auto" : HIDDEN;
            }
            if (pxWorkAreaDiv.getAttribute("data-mode") == "NoHeader") {
              centerLayoutEl.style.overflow = HIDDEN;
            }
          }
        },
        /*
                 @private- Sets the width and height for the tab content.
                 @param $Object$e –  Event instance, is used to find the new tab on activeTabchange event.
                 Otherwise finds the activetab.
                 @return $void$ – .
                 */
        resizeTabContent = function(e) {
          if (pega.util.Dom.hasClass(document.body, "with-fixed-header")){
            return;
          }

          if (pxWorkAreaDiv.getAttribute("data-mode") == "NoHeader") {
            var activeHost = getActiveDocument();
            var hostContent = view.getHostContentElement(activeHost);
            if (hostContent) {
              hostContent.style.height = newHeight + PX;
              hostContent.style.overflow = "auto";
            }
            return;
          }
          if (!pud.portal){
            return;
          }
          // BUG-68333 05/02/2012 GUJAS1 Store active tab separately for DOM check a few steps ahead.
          var activeTab = e.newValue || getActiveDocument(),
              activeTabContentElement = getDocumentContentElement(activeTab),
              frameChild = activeTabContentElement.getElementsByTagName(IFRAME_TAG_NAME),
              activeTabStyle = activeTabContentElement.style,
              frameChildStyle,
              tabsWidth = 0,
              tabsHeight = 0,
              tabEl = getDocumentElement(activeTab),
              tabsListEl = tabEl.parentNode,
              tabListOverflow;
          // BUG-68333 05/02/2012 GUJAS1 If active tab is not in DOM, return.
          // This happens occasionally, e.g. when a heavy harness tab is activated
          // for the first time.
          if (!dom.inDocument(tabEl)) {
            return;
          }
          if (tabPosition == "Left" || tabPosition == "Right") {
            tabsWidth = tabsListEl.offsetWidth;
          } else {
            tabListOverflow = tabsListEl.style.overflow;
            tabsListEl.style.overflow = HIDDEN;
            tabsHeight = tabsListEl.scrollHeight;
            tabsListEl.style.overflow = tabListOverflow;
          }

          activeTabStyle.overflow = "auto";
          if (parseInt(activeTabStyle.width) != (newWidth - tabsWidth - hLayoutMargin)){
            activeTabStyle.width = (newWidth - tabsWidth - hLayoutMargin) + PX;
          }
          if (parseInt(activeTabStyle.height) != (newHeight - tabsHeight)) {
            activeTabStyle.height = (newHeight - tabsHeight) + PX;
            /* If tab content height is less than the tabgroup height then there is gap between tab header and content in nonIE browsers.
                         This is because min-height is set as 100%. So making both tabcontent and tabgroup div height same. */
            /*BUG-139968 : Updating tabGroupDiv's height when tab orientation is Botttom and Browser is not IE.*/
            var tabGroupDiv = activeTabContentElement.parentNode;
            while (tabGroupDiv && tabGroupDiv.id && tabGroupDiv.id.indexOf("PEGA_TABBED") == -1) {
              tabGroupDiv = tabGroupDiv.parentNode;
            }

            if (tabPosition == "Bottom" && !pue.isIE) {
              tabGroupDiv.style.height = (newHeight - tabsHeight) + PX;
            }
          }
          if (frameChild && frameChild[0]) {
            frameChild = frameChild[0];
            frameChildStyle = frameChild.style;
            if (frameChildStyle.visibility != VISIBLE) {
              frameChildStyle.visibility = VISIBLE;
            }
          }
        },
        //*Resize Logic end *//

        that = this;

    /*BUG-75751(RAIDV) - Changing invoke param to true. In case Single View DC is defer loaded (as opposed to refresh),
         script with invoke false wouldn't be executed when workarea renders. */
    /*BUG-76274(RAIDV) - In case scripts are still being loaded from processInlineScripts (indicating that this is a case of defer load
         where adding a file to initialOnLoads wouldn't have any effect), call initialize immediately.*/

    if (pega.u.d.gIsScriptsLoading) {
      pud.attachOnload(function() {
        isAttached = true;
        initialize.call(that);
      }, true);
    } else {
      pud.attachOnload(function() {
        initialize.call(that);
      }, false);
    }

    this.getActiveDocumentType = function(){
      var docType, page = pega.ui.ClientCache.find("Declare_pyDisplay.pyDCDisplayState.pyActiveDocumentType");
      if(page){
        docType = page.getValue();
      }
      return docType;       
    };

  };

  ui.DCUtil = new function(){
    this.getActiveDocumentType = ui.WorkAreaGadget.getActiveDocumentType;
  }
})(pega);
//static-content-hash-trigger-GCC
/*
    MRUCache is a class which maintains the history of ITEMS and returns the
    MostRecentlyUsed(MRU) item.
*/

pega.ui.mru = (function() {
  var NEXT = "next",
    PREV = "prev",
    NULL = null,
    UNDEFINED = undefined;

  /*
    DoublyLinkedList is used maintain history of items in an
    ordered way in which head.next always returns the MRU item.
  */
  function DoublyLinkedList(head,tail) {
    head[NEXT] = tail;
    head[PREV] = NULL;
    tail[NEXT] = NULL;
    tail[PREV] = head;
    this.head = head;
    this.tail = tail;
  } 
  DoublyLinkedList.prototype.getHeadItem = function() {
    return this.head[NEXT] == this.tail ? NULL : this.head[NEXT];
  };

  DoublyLinkedList.prototype.insertNode = function(newNode) {
    var head = this.head,
        tail = this.tail;
    if (newNode != NULL) {
      newNode[NEXT] = head[NEXT];
      newNode[PREV] = head;
      head[NEXT] = newNode;
      newNode[NEXT][PREV] = newNode;
    }
  };

  DoublyLinkedList.prototype.removeNode = function(node) {
    var head = this.head,
        tail = this.tail;
    if (node != NULL) {
      node[PREV][NEXT] = node[NEXT];
      node[NEXT][PREV] = node[PREV];
      node[PREV] = node[NEXT] = NULL;
      return node;
    }
  };

  DoublyLinkedList.prototype.createNode = function(id, data) {
    return {"id": id, "data": data, "next": NULL, "prev": NULL};
  };

  var dList = new DoublyLinkedList({},{}),
      mruCache = {};

  var addItem = function(id, data) {
    if (id != NULL && data != NULL) {
      var node = NULL;
      if (mruCache[id]) {
        node = mruCache[id];
        node.data = data;
        node = dList.removeNode(node);
        dList.insertNode(node);
      } else {
        node = dList.createNode(id, data);
        mruCache[id] = node;
        dList.insertNode(node);
      }
    }
  };

  var getItem = function() {
    var node = dList.getHeadItem();
    return node == NULL ? null : {"id": node.id, "data": node.data};
  };

  var deleteItem = function(id) {
    if (id != NULL) {
      var node = mruCache[id];
      dList.removeNode(node);
      node = NULL;
      mruCache[id] = null;
    }
  };
  var spExposedAPI = {
    "addItem": addItem,
    "getItem": getItem,
    "deleteItem": deleteItem
  };
  return spExposedAPI; 
})();
