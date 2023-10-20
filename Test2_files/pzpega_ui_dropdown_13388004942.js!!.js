(function (p) {
  if (!p.ui) {
    p.u = p.namespace("p.ui");
  } else {
    p.u = p.ui;
  }

  p.u.Dropdown_cache = new (function() {
    var _cacheObject = new  pega.tools.Hashtable();
    var _inprocessObject = new  pega.tools.Hashtable();
    this.hasCache = function(url){
      return _cacheObject.containsKey(url);
    };
    this.store = function(url, data){
      _cacheObject.put(url, data);
    },
    this.retrieve = function(url) {
      return _cacheObject.get(url);
    },
    this.storeInProgress = function(url){
      _inprocessObject.put(url, [])
    },
    this.addToPendingQ = function(url, elem) {
      var pendingQ = _inprocessObject.get(url);
      pendingQ.push(elem);
      _inprocessObject.put(url, pendingQ)
    },
    this.retrievePendingQ = function(url) {
      var pendingQ = _inprocessObject.get(url);
      _inprocessObject.remove(url);
      return pendingQ;
    },
    this.isInProgress = function(url) {
      return _inprocessObject.containsKey(url);
    };
  })();
  
  p.u.Dropdown = new (function() {
    var loadModeAttr = "data-loadmode", dataConfigAttr = "data-config";

    var constructOptions = function(elem, data, value){
      var i, l= elem.options.length, pos = 0, optData, groupby, optGroup;
      if(l> 0 && elem.options && elem.options.length >0 && elem.options[0].value == ""){
        pos = 1;
      }
      for (i = pos; i < l; i++){
        elem.remove(pos);
      }
      /*BUG-499148: removing optgroups*/
      if($(elem).find('optgroup').length > 0){
        $(elem).find('optgroup').remove();
      }
      var index = elem.options.length;
      var dataIndex = 0;
      var updateIndex = false;
      for(i=0, l=data.length;i<l;i++) {
        optData =  data[i];
        var optElem = document.createElement("option");
        optElem.appendChild(document.createTextNode(optData["caption"]));
        /* BUG-200993: when value string has leading/trailing spaces, on refresh selected value not showing in the drop down */
        try {
          optData["value"] = optData["value"].replace(/^\s+|\s+$/gm,"");
        } catch(e) { }
        optElem.value = optData["value"];
        if(optElem && optData["tooltip"]) {
          optElem.title = optData["tooltip"];
        }
        if(optData["value"]===value) {
          /* HFix-28545 Setting selected attribute using setAttribute api */
          optElem.setAttribute("selected","selected");
          /* optElem.selected = "selected"; */
          dataIndex = i;
          updateIndex = true;
        }
        if("groupby" in optData) {
          if(groupby !== optData["groupby"]) {
            if(optGroup) {
              elem.appendChild(optGroup);
            }
            groupby = optData["groupby"];
            optGroup = document.createElement("optgroup");
            optGroup.label = groupby;
          }
          optGroup.appendChild(optElem);
        } else {
          elem.appendChild(optElem);
        }
      }
      if(optGroup) {
        elem.appendChild(optGroup);
      }
      if(updateIndex){
        elem.selectedIndex = index + dataIndex;
      }  
    };
    
    var loadFromProp = function() {
      var elem = arguments[0], cacheEnabled = arguments[1], strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "Property");
      var entryHandle = elem.name;
      strUrlSF.put("Name", p.u.property.toReference(entryHandle));/*BUG-195336 : removing replace of index in pagelist in loadFromProp*/
            strUrlSF.put("EntryName", elem.name);
      processRequest(elem, strUrlSF, cacheEnabled);
    };
    
    var loadFromRD = function() {
      /* [elem,AssociatedClass,ReportDefinitionName,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,RDParams] */
      var elem = arguments[0], className = arguments[1], rdName = arguments[2], cacheEnabled = arguments[3], displayProperty = arguments[4], valueProperty = arguments[5], TooltipProperty = arguments[6], GroupByProperty = arguments[7], RDParams = arguments[8], groupByOrder=arguments[9], strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "ReportDefinition");
      strUrlSF.put("AppliedClass", className);
      strUrlSF.put("Name", rdName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
      if (RDParams != null && typeof RDParams != 'undefined') {
        separateStaticDynamicParams(RDParams,"RDParams",strUrlSF, elem);
      }
      processRequest(elem, strUrlSF, cacheEnabled);
    };

    var loadFromCB = function() {
      /*elem,Source,PreDataTransform,PreActivity,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,DTParams,ActParams] */
      var elem = arguments[0], pageName = arguments[1], preDTName = arguments[2], preActName = arguments[3], cacheEnabled = arguments[4], displayProperty = arguments[5], valueProperty = arguments[6], TooltipProperty = arguments[7], GroupByProperty = arguments[8], DTParams = arguments[9], ActParams = arguments[10], DPParams = arguments[11], groupByOrder=arguments[12];
      var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "ClipboardPage");
      strUrlSF.put("Name", pageName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("PreDT", preDTName);
      strUrlSF.put("PreActivity", preActName);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
          
      var postData = new SafeURL();
      if (DTParams != null && typeof DTParams != 'undefined') {
        separateStaticDynamicParams(DTParams,"DTParams",strUrlSF, elem);
      }
      if (ActParams != null && typeof ActParams != 'undefined') {
        separateStaticDynamicParams(ActParams,"ActParams",strUrlSF, elem);
      }
      if (DPParams != null && typeof DPParams != 'undefined') {
        separateStaticDynamicParams(DPParams,"DPParams",postData, elem);
      }
      if (preActName != null && typeof preActName != 'undefined') {
        var baseRef = pega.u.d.getBaseRef(elem);
        if(baseRef != ""){
          strUrlSF.put("BaseReference", baseRef);
        }
        if (typeof(Grids) != 'undefined') {
          var contextPage = pega.u.d.getRowAndEntryHandle(elem).rowEntryHandle;
          if(contextPage == null) {
            contextPage = "";
          }
          if(contextPage != ""){
            strUrlSF.put("ContextPage", pega.u.property.toReference(contextPage));
          }
        }
      }
      processRequest(elem, strUrlSF, cacheEnabled, postData);
    };

    var loadFromDP = function() {
      /*elem,Source,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,DPParams] */
      var elem = arguments[0], pageName = arguments[1], cacheEnabled = arguments[2], displayProperty = arguments[3], valueProperty = arguments[4], TooltipProperty = arguments[5], GroupByProperty = arguments[6], DPParams = arguments[7], groupByOrder=arguments[8];
      var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "DataPage");
      strUrlSF.put("Name", pageName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
          
            var postData = new SafeURL();
      if (DPParams != null && typeof DPParams != 'undefined') {
        separateStaticDynamicParams(DPParams,"DPParams",postData,elem);
      }
      processRequest(elem, strUrlSF, cacheEnabled, postData);
    };
    var separateStaticDynamicParams = function(params, postDataString, urlObj, elem){
        var dynamicParamsObj={};
          var staticParamsObj={};
      if(params && params.length>0){
         var paramsJson = JSON.parse(params);
          Object.keys(paramsJson).forEach(function(key) {
            if(paramsJson[key].match(/(#|\^)~([^#~\^]+)~(#|\^)/gi)){
                dynamicParamsObj[key] = replaceParamsTokens(paramsJson[key], elem);
            }
            else{
                staticParamsObj[key] = paramsJson[key];
            }
        });
        urlObj.put("dynamic"+postDataString, JSON.stringify(dynamicParamsObj));
        urlObj.put("static"+postDataString, JSON.stringify(staticParamsObj));
       }
          
    }
    var replaceParamsTokens = function(paramStr,elem){
      var gridRowRef = "";
      var locGargs = "";
      if (typeof(Grids) != 'undefined') {
        var temp_gridObj = Grids.getElementsGrid(elem);
        if(temp_gridObj){
                                        var rowDetails = pega.u.d.getRowAndEntryHandle(elem); 
          gridRowRef = p.u.property.toReference(rowDetails.rowEntryHandle);
          if(rowDetails){
            var gridRow = rowDetails.row;
            var gargs = gridRow.getAttribute('data-gargs');
            if(gargs){
              locGargs = pega.lang.trim(gargs);
              locGargs = locGargs.replace(/\'/g,"\\\'");
              locGargs = JSON.parse(locGargs);
            }
          }
        }
      }
      paramStr = pega.c.eventParser.replaceTokensWrapper(paramStr,gridRowRef, locGargs, true);
      return paramStr;
    };

    var processPendingQ = function(url) {
      if (!pega.ui.Dropdown_cache.isInProgress(url)) return;
      var pendingQ = pega.ui.Dropdown_cache.retrievePendingQ(url);
      if (pendingQ!= null && typeof pendingQ != 'undefined' && pendingQ.length >= 1) {
        for (var idx=0; idx < pendingQ.length; idx++) {
          var objSelectElem = pendingQ[idx];
          p.u.Dropdown.processDropDownElem(objSelectElem);
        }
      }
    };
    
    var processRequest = function (elem, strUrlSF, cacheEnabled, data) {
      var value;
            if(elem.hasAttribute("data-template")){
              var ccProp = pega.ui.ClientCache.find(elem.name);
              value = ccProp ? ccProp.getValue() : "";
            }else{
              value = (/^select$/i.test(elem.tagName) && elem.options && elem.options.length >0) ? elem.options[elem.selectedIndex].value : elem.value;
            }
      var url = strUrlSF.toURL();
            /* BUG-290462: Fixed issue with cache key 
               datapage parameters are part of data which causing similar strUrlSF string as cache key */
            if (data && typeof(data.toURL) === "function" && typeof(data.toURL()) === "string") {
                url += data.toURL();
            }
      var callConstructOptions = function(dataObj){
        constructOptions(elem, dataObj, value);
        var newValue = (/^select$/i.test(elem.tagName) && elem.options && elem.options.length >0) ? elem.options[elem.selectedIndex].value : elem.value;
        if(value !== newValue) {
          pega.control.eventController.fireEventHandler(elem, "change");
        }
      };

      if("true" === cacheEnabled && pega.ui.Dropdown_cache.hasCache(url)) {
        callConstructOptions(pega.ui.Dropdown_cache.retrieve(url));
        return;
      } else if ("true" === cacheEnabled && pega.ui.Dropdown_cache.isInProgress(url)) {
        pega.ui.Dropdown_cache.addToPendingQ(url, elem);
        return;
      }
      
      var onSuccess = function (responseObj) {
        var responseText = responseObj.responseText;
              //BUG-201836-Fix
        if(responseText && responseText!=null){
           var docFrag = document.createDocumentFragment();
           var newDiv = document.createElement("div");
           newDiv.innerHTML = responseText;
           docFrag.appendChild(newDiv);
           var tempDiv = pega.util.Dom.getElementsById("ddOptionsWrapperDiv",newDiv,"div");
           if(tempDiv && tempDiv.length>0){
             var jsonText = tempDiv[0].textContent || tempDiv[0].innerText;
           if(jsonText && jsonText!=null){
              responseText = jsonText;
           }
           }
                  docFrag.removeChild(newDiv);
                  docFrag=null;
           
        }
        
        
          /*if(responseText && responseText!=null){
        var beginIndex = responseText.indexOf("<div id='ddOptionsWrapperDiv'>");
              var endIndex = responseText.indexOf("</div>");
        if(beginIndex != -1 && endIndex != -1)
        {
        var jsonText = responseText.substring(beginIndex+30,endIndex);
        if(jsonText && jsonText!=null)
          {
            responseText = jsonText;
          }
        }
        } */
        try {
          var jsonObj = JSON.parse(responseText);
        } catch(e) {
          /* BUG-389224: In case response not a valid json, return from here */
          return;
        }
        var dataObj = jsonObj.Results;
        if(typeof(this.spin) == "function" && typeof(this.stop) == "function"){
          this.stop();
          if(elem.parentNode==null || elem.parentNode=='undefined'){
                      var queryElement = pega.ctx.dom.querySelectorAll( elem.tagName.toLowerCase() + "[name='"+elem.getAttribute('name')+"']");
                        if(queryElement.length ==1){
                          elem = queryElement[0];
                        }
                    }
          var target = elem.parentNode.getElementsByTagName('div')[0];           
          target.removeAttribute("style");
          if(this.mask && this.mask.style) {
            this.mask.style.display = "none";
          }
        }

        if(typeof(dataObj) == "undefined"){
          dataObj = {};
        }

        pega.ui.Dropdown_cache.store(url, dataObj);
        callConstructOptions(dataObj);
        processPendingQ(url);
      }

      var onFailure = function (response) {
        if(typeof(this.spin) == "function" && typeof(this.stop) == "function"){
          this.stop(); 
          var target = elem.parentNode.getElementsByTagName('div')[0];           
          target.removeAttribute("style");    
          if(this.mask && this.mask.style) {
            this.mask.style.display = "none";
          }
        }
        /* silently fail for now */
      };
        
      var callBack = { success: onSuccess, failure: onFailure };
      if("true" === cacheEnabled) {
        pega.ui.Dropdown_cache.storeInProgress(url);
      }
      if (p.u.Dropdown.isOnDemandDropdown(elem)) {
        var selWidth = elem.offsetWidth;
        var opts = {
          lines: 11, // The number of lines to draw
          length: 3, // The length of each line
          width: 2, // The line thickness
          radius: 3, // The radius of the inner circle
          color: 'grey', // #rbg or #rrggbb
          speed: 1, // Rounds per second
          trail: 66, // Afterglow percentage
          shadow: false // Whether to render a shadow
        };
              var target = elem.parentNode.getElementsByTagName('div')[0];
        callBack.scope = new Spinner(opts).spin(target);
        target.style.left = (selWidth - 10)+"px";
        try {
              callBack.scope.mask = elem.parentNode.childNodes[elem.parentNode.childNodes.length - 1];
          callBack.scope.mask.style.width = selWidth+"px";
          callBack.scope.mask.style.display = "block";
        } catch (e) { }
      }
      /* BUG-205442: fixed issue with page messages clrearing when drop down mode set to lazy/on hover mode */
      strUrlSF.put("pzKeepPageMessages", "true");
      pega.u.d.asyncRequest('POST', strUrlSF, callBack, data);
    };
    
    this.isLazyLoadDropdown = function(el) {
      return /^lazyload$/i.test(el.getAttribute(loadModeAttr));
    };
    this.isOnDemandDropdown = function(el) {
      return /^ondemand$/i.test(el.getAttribute(loadModeAttr));
    };
    this.isProcessedDropdown = function(el) {
      return (!!el.getAttribute("data-loaded"));
    };
    this.processODDropdown = function(el) {
      el.setAttribute("data-loaded", true);
      p.u.Dropdown.processDropDownElem(el);
    };
    this.registerDropdowns = function(reloadElement) {
      var isAJAX = (reloadElement.type !== "load");
      var objSelects = pega.util.Dom.getElementsBy(p.u.Dropdown.isLazyLoadDropdown, "SELECT", (isAJAX ? reloadElement : undefined));
      var objSelectsOnDemand = pega.util.Dom.getElementsBy(p.u.Dropdown.isOnDemandDropdown, "SELECT", (isAJAX ? reloadElement : undefined));
      if (objSelects != null && objSelects.length && objSelects.length > 0) {
        for (var i = 0; i < objSelects.length; i++) {
          var objSelectElem = objSelects[i];
          p.u.Dropdown.processDropDownElem(objSelectElem);
        }
      }
      if (objSelectsOnDemand != null && objSelectsOnDemand.length && objSelectsOnDemand.length > 0) {
        for (var i = 0; i < objSelectsOnDemand.length; i++) {
          var objSelectElem = objSelectsOnDemand[i];
          pega.util.Event.addListener(objSelectElem, "focus", p.u.Dropdown.doOnMouseOver);
          pega.util.Event.addListener(objSelectElem, "mouseover", p.u.Dropdown.doOnMouseOver);
        }
      }
    };
    
    this.doOnMouseOver = function (event) {
      var elem = pega.util.Event.getTarget(event);
      if(elem.disabled == true) return true;
      p.u.Dropdown.processDropDownElem(elem);
      pega.util.Event.removeListener(elem, "focus", p.u.Dropdown.doOnMouseOver);
      pega.util.Event.removeListener(elem, "mouseover", p.u.Dropdown.doOnMouseOver);
    };
    
    this.getDropdownEntryHandle = function (elem) {
      var ddEntryHandle = null;
      if(!elem.getAttribute("name") && elem.tagName && elem.tagName.toUpperCase() == "SELECT") {
        var elemParentNode = elem.parentNode;
        if(elemParentNode && typeof(elemParentNode.getElementsByTagName) === "function") {
          var ddInputList = elemParentNode.getElementsByTagName("INPUT");
          if(ddInputList && ddInputList.length == 0 && elemParentNode.parentNode && typeof(elemParentNode.parentNode.getElementsByTagName) === "function") {
            ddInputList = elemParentNode.parentNode.getElementsByTagName("INPUT");
          }
          if(ddInputList && ddInputList.length >= 1) {
            for (var idx=0; idx < ddInputList.length; idx++) {
              var inputObj = ddInputList[0];
              if(inputObj.type == "hidden" && typeof (inputObj.getAttribute("data-ctl")) === "string" &&
                 JSON.parse(inputObj.getAttribute('data-ctl'))[0] == "Dropdown") {
                ddEntryHandle = inputObj.name;
                break;
              }
            }
          }
        }
      }
      return ddEntryHandle;
    };

    this.processDropDownElem = function(elem, isAjax){
      if (elem == null || typeof elem == 'undefined') return;
      var dataConfig = elem.getAttribute(dataConfigAttr);
      if(!dataConfig) {
        return;
      }
      dataConfig = JSON.parse(dataConfig);
      var sType = dataConfig[0];
      /* BUG-386608: If we are showing select button in accesibility mode, name attribute will not be available on select tag
         We should set name attribute on select tag from hidden drop down input and should remove after options loaded */
      var removeNameAttr = false;
      var ctrlName = p.u.Dropdown.getDropdownEntryHandle(elem);
      if(ctrlName) {
        elem.setAttribute("name", ctrlName);
        removeNameAttr = true;
      }
      dataConfig[0] = elem;
      switch(sType){
        case "AP" :
          loadFromProp.apply(this, dataConfig);
          break;
        case "RD" :
          loadFromRD.apply(this, dataConfig);
          break;
        case "CB" :
          loadFromCB.apply(this, dataConfig);   
          break;
        case "DP" :
          loadFromDP.apply(this, dataConfig);   
          break;
        default:
          break;
      }
      if(removeNameAttr) {
         elem.removeAttribute("name");
      }
    };
  })();
  if(p.u && p.u.d) {
    p.u.d.attachOnload(p.u.Dropdown.registerDropdowns, true);
  } else {
    p.util.Event.addListener(window, "load", p.u.Dropdown.registerDropdowns);
  }
})(pega);
//static-content-hash-trigger-YUI