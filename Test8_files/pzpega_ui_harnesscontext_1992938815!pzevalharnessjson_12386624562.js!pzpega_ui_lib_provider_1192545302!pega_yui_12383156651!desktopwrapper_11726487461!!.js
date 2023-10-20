pega = window.pega || {};
pega.ui = pega.ui || {};


/** EventsEmitter exposes a publisher subscriber model where users can subscribe to events that are published by controllers.
   */
pega.ui.EventsEmitterClass = function(){
  var eventsList = {};
  /** EventListener is an function that defines a listener.
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[boolean]} true to invoke synchronously
   * @param  {[boolean]} true will unsubscribe the listener after publish
   * @param  {Object} scope of the listener function to be called with
   */
  function EventListener(listener,bImmediate,bOnce,eventId,scope){
    this.listenerFn = listener;
    this.bImmediate = bImmediate;
    this.bOnce = bOnce;
    this.scope = scope;
    this.eventId = eventId;
  }
  /** _subscribeInternal is an internal function responsible to subscribe a listener for publish
   * @param  {[String]} name of the event
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[boolean]} true to invoke synchronously
   * @param  {[boolean]} true will unsubscribe the listener after publish
   * @return {Object} returns an object with remove function to unsubscribe the listener
   * @param  {Object} scope of the listener function to be called with
   */
  var _subscribeInternal = function(theEvent, listener, bImmediate, bOnce,eventId,scope, bOnlyOnce) {
    if(bOnlyOnce && eventsList.hasOwnProperty(theEvent)){
      return{};
    }
    if(!eventsList.hasOwnProperty(theEvent)){
      eventsList[theEvent] = [];
    }
    var theListener = new EventListener(listener,bImmediate?true:false,bOnce?true:false,eventId,scope);
    var indexofCurrentListener = eventsList[theEvent].push(theListener) - 1;
    return {
      remove: function() {
        /*Iterate over the listeners of the event and remove the matched.
        Donot rely on indexofCurrentListener as the array is dynamic(could be spilced)*/
        var listeners = eventsList[theEvent];
        for(var i in listeners){
          if(listeners[i].listenerFn == theListener.listenerFn){
            eventsList[theEvent].splice(i,1);
            break;
          }
        }
      }
    };
  }
  /** _subscribe is an wrapper function to _subscribeInternal
   * @param  {[String]} name of the event
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[boolean]} true to invoke the listener synchronously
   * @return {Object} returns an object with remove function to unsubscribe the listener
   * @param  {Object} scope of the listener function to be called with
   */
  var _subscribe = function(theEvent, listener,bImmediate,eventId,scope, bOnlyOnce) {
    return _subscribeInternal(theEvent,listener,bImmediate,false,eventId,scope,bOnlyOnce);
  }
  /** _subscribeOnce is same as _subscribe except that the listener is unsubscribed immediately after publish
   * @param  {[String]} name of the event
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[boolean]} true to invoke the listener synchronously
   * @return {Object} returns an object with remove function to unsubscribe the listener
   */
  var _subscribeOnce = function(theEvent, listener,bImmediate) {
    return _subscribeInternal(theEvent,listener,bImmediate,true);
  }
  /** _invokeListener will invoke the listener function by passing data as arguments
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[json object]} necessary data to be passed to listener
   * @param  {Object} scope of the listener function to be called with
   */
  var _invokeListener = function(listenerFn, data,scope) {
    if(!scope)
      listenerFn(!!data?data:{});
    else
      listenerFn.apply(scope,[!!data?data:{}]);
  }
  /** _invokeListenerAync is same as _invokeListener except that it invokes the listener asynchronously
   * @param  {[function]} listener function to be invoked on publish
   * @param  {[json object]} necessary data to be passed to listener
   */
  var _invokeListenerAync = function(listenerFn, data){
    setTimeout(function(){_invokeListener(listenerFn,data);},0);
  }
  /** _publishSync will publish all the subscribers of a given event synchronously. Could be costly if listeners are not performant.
   * @param  {[String]} name of the event
   * @param  {[json object]} necessary data to be passed to listener
   */
  var _publishSync = function (theEvent, data) {    
    if (!eventsList.hasOwnProperty(theEvent)) return;
    var listeners = eventsList[theEvent];
    var dataEventIds = (data && data[this.eventIds] || {});
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        var listenerEventId = listeners[i].eventId;
        if (listener[this.eventId] && dataEventIds[listenerEventId] || !listener[this.eventId]) {
            if (dataEventIds[listenerEventId]) {
                data = {};
                data[this.context] = dataEventIds[listenerEventId];
                data[this.eventId] = listenerEventId;
            }
            _invokeListener(listeners[i].listenerFn, data, listeners[i].scope);
            if (listeners[i] && listeners[i].bOnce) {
                eventsList[theEvent].splice(i, 1);
                i--; //decrement the loop counter since the array gets resized after splice
            }
        }
    }
  }
  /** _publish will publish all the subscribers of a given event asynchronously unless the subscriber is marked to invoke immediately.
   * @param  {[String]} name of the event
   * @param  {[json object]} necessary data to be passed to listener
   */
  var _publish = function(theEvent, data) {
    if(!eventsList.hasOwnProperty(theEvent)) return;
    var listeners = eventsList[theEvent];
    for(var i=0;i<listeners.length;i++){
      if(listeners[i].bImmediate){
        //invoke the listener synchronously if the subscriber is marked to invoke immediately.
        _invokeListener(listeners[i].listenerFn,data);
      }else{
        //invoke the listener asynchronously.
        _invokeListenerAync(listeners[i].listenerFn,data);
      }
      if(listeners[i].bOnce){
        eventsList[theEvent].splice(i,1);
        i--;//decrement the loop counter since the array gets resized after splice
      }
    }
  }
  /** _unsubscribe will remove all the listeners of a given event
   * @param  {[String]} name of the event
   * @param  {Object} scope of the listener function which has subscribed 
   */
  var _unsubscribe = function(theEvent,handler, scope){
    var listeners = eventsList[theEvent];
    if(!listeners || !handler){
      return;
    }
    for(var i=0;i<listeners.length;i++){
      if(listeners[i].listenerFn == handler){
        if(!scope || listeners[i].scope ===  scope)
         	listeners.splice(i,1);
        break;
      }
    }
  }
  /** _unsubscribeAll will remove all the listeners of all the events
   */
  var _unsubscribeAll = function(){
    eventsList = {};
  }

  var _isListenerSubscribed = function (theEvent,handler, scope) {
    var listeners = eventsList[theEvent];
    if(!listeners || !handler){
      return false;
    }
    for(var i=0;i<listeners.length;i++){
      if(listeners[i].listenerFn == handler){
        if(!scope || listeners[i].scope ===  scope) {
         	return true;
        }
      }
    }
    
    return false;
  }
  
  return {
    subscribe : _subscribe,
    subscribeOnce : _subscribeOnce,
    unsubscribe : _unsubscribe,
    unsubscribeAll : _unsubscribeAll,
    publish : _publish,
    publishSync : _publishSync,
    eventId: "eventId",
    eventIds: "eventIds",
    context:"context",
    isListenerSubscribed: _isListenerSubscribed
  };
}

pega.ui.EventsEmitter = new pega.ui.EventsEmitterClass();
//static-content-hash-trigger-GCC
pega = window.pega || {};
pega.ui = pega.ui || {};

//if this script is already loaded don't override it.
if (!pega.ui.HarnessContext) {

  pega.ui.HarnessContext = (function() {

    // HarnessContext constructor
    function HarnessContext() {

      var thisObj = this;

      //TODO MDC - THIS INITIALIZATION SHOULD BE ACTUALLY MOVED TO CORRESPONDING FILES
      // ADD EXISTING NAMESPACES INTO HARNESSCONTEXT OBJECT
      // WHICH ARE PART OF INITIALVARS, BOTTOMVARS, DEFERREDVARS
      thisObj.pega = {};
      thisObj.pega.d = {};
      thisObj.pega.desktop = {};
      thisObj.pega.u = {};
      thisObj.pega.u.d = {};
      thisObj.pega.feedback = {};
      thisObj.pega.feedback.Globals = {};
      
      //harness onloads
      //@deprecated
      //DO NOT REFER pega.ctx.onHarnessLoads
      thisObj.onHarnessLoads = [];

      
    }


    // ************************ harness properties ***********************************
    //@deprecated
    HarnessContext.prototype.setProperty = function (propName, propValue){
      this[propName] = propValue;
    };

    //@deprecated
    HarnessContext.prototype.getProperty = function (propName){
      return this[propName];
    };

    HarnessContext.prototype.setFormEncoding = function (fileEncoding){
      var hcm = pega.ui.HarnessContextMgr;
      var isModalOpen = pega.u.d.bModalDialogOpen;
      if(hcm.get("isMDC") && !isModalOpen){
        pega.ctx.hasFileEncoding = fileEncoding;
      }else if(isModalOpen){
        pega.ctx.modalHasFileEncoding = fileEncoding;
      }else{
        var oForm = document.forms[0];
        if(oForm){
           fileEncoding ? (oForm.encoding = "multipart/form-data") : (oForm.encoding = "application/x-www-form-urlencoded");
        }                
      }
    };
     HarnessContext.prototype.resetFormEncoding = function (){
       this.setFormEncoding(false);
    };
    HarnessContext.prototype.hasFile = function (){
      var result = false;
      var isModalOpen = pega.u.d.bModalDialogOpen;
      if(pega.ctx.isMDC && !isModalOpen){
        result = (pega.ctx.hasFileEncoding || false);
      }else if(pega.ctx.modalHasFileEncoding){
        result = true;
      }
      else{
        var oForm = document.forms[0];
	      result = (oForm && oForm.encoding === "multipart/form-data")?true:false;
      }
      return result;
    };
    HarnessContext.prototype.getFormElement = function (){
      return pega.ctx.isMDC ? pega.u.d.getDocumentElement(): document.forms[0];      
    };

    return HarnessContext;
  }());

}
//static-content-hash-trigger-GCC
// pega.ctxmgr is new API and alias for deprecated pega.ui.HarnessContextMap / pega.ui.HarnessContextMgr APIs which will be removed in future.

//if this script is already loaded don't override it.
if (!pega.ctxmgr) {

  pega.ctxmgr = pega.ui.HarnessContextMgr = pega.ui.HarnessContextMap = (function(){
    var DATA_HARNESS_ID = "data-harness-id";
    var contextsMap = {}; //empty object
    var baseHarnessContext; //base harness context

    var nativeWindowSetTimeout = window.setTimeout;
    var nativeWindowSetInterval = window.setInterval;

    var contextWindowSetTimeout = function(func, timeout) {
      var actualContext = pega.ctx;
      var args = Array.prototype.slice.call(arguments, 0);

      args[0] = function timeoutFunction() {
        var timeoutArgs = Array.prototype.slice.call(arguments, 0);
        //set the actual harness context
        pega.ctxmgr.setContext(actualContext);

        if (typeof func === "string") {
          eval(func);
        } else {
          func.apply(this, timeoutArgs);
        }
        //reset to current harness context
        pega.ctxmgr.resetContext();
        actualContext = null;

      }

      // BUG-332935 Fix.
      if (nativeWindowSetTimeout.apply) {
        return nativeWindowSetTimeout.apply(this, args);
      } else {
        return nativeWindowSetTimeout(func, timeout);
      }
    };

    var contextWindowSetInterval = function(func, timeout) {
      var actualContext = pega.ctx;
      var args = Array.prototype.slice.call(arguments, 0);

      args[0] = function timeoutFunction() {
        var timeoutArgs = Array.prototype.slice.call(arguments, 0);

        //set the actual harness context
        pega.ctxmgr.setContext(actualContext);

        if (typeof func === "string") {
          eval(func);
        } else {
          func.apply(this, timeoutArgs);
        }

        //reset to current harness context  
        pega.ctxmgr.resetContext();
        /*actualContext = null;*/


      }
      // BUG-332935 Fix.
      if (nativeWindowSetInterval.apply) {
        return nativeWindowSetInterval.apply(this, args);
      } else {
        return nativeWindowSetInterval(func, timeout);
      }
    };

    /**
      * - Creates instance of pega.ui.HarnessContext
      * - Sets HarnessContext instance as the current active context
      **/
    var createHarnessContext = function (){
      
      var harnessContextMap = pega.ctxmgr.getHarnessContextMap();
      var initialHarnessId = pega.ctx && initialVars && initialVars.dynamic_context && initialVars.dynamic_context.pzHarnessID;
      
      if(initialHarnessId && harnessContextMap[initialHarnessId]) {
        return harnessContextMap[initialHarnessId];        
      }

      var harnessContextObj = new pega.ui.HarnessContext();

      // make created context as active context
      setCurrentHarnessContext(harnessContextObj);
      
      // update the context specifics.
      _updateContextSpecifics();

      return harnessContextObj;
    }


    /**
      * - Loads/Adds HarnessContext instance into HarnessContextMap
      * - Sets HarnessContext instance as the current active context
      **/
    var loadHarnessContext = function(uniqueKey, harnessContextObject){
      if(!uniqueKey){
        uniqueKey = ""+Date.now();
      }

      harnessContextObject = harnessContextObject || pega.ui.HarnessContextMgr.createHarnessContext();
      harnessContextObject.pzHarnessID = uniqueKey;

      /*if(contextsMap[uniqueKey]){
        unloadHarnessContext(uniqueKey);
      }*/
      contextsMap[uniqueKey] = harnessContextObject;

      // make loaded context as active context
      setCurrentHarnessContext(harnessContextObject);
      
      // update the context specifics.
      _updateContextSpecifics();

      // fire harness renderign event
    };

    /**
      * - UnLoads/Removes HarnessContext instance from HarnessContextMap
      **/
    var unloadHarnessContext = function(uniqueKey, unloadSilently){
      if(contextsMap[uniqueKey]){
        /* Fire Unload Event : Means Execute unload event listeners */
        if(!unloadSilently){
          pega.u.d.cleanUpHarnessElements(null, document.querySelectorAll("[data-harness-id="+uniqueKey+"]"));
          setContext(contextsMap[uniqueKey]);
          pega.ui.EventsEmitter.publishSync("onHarnessUnload");
          resetContext();
          delete contextsMap[uniqueKey];
          _updateContextSpecifics();
        }else{
          delete contextsMap[uniqueKey];
        }
        
        // update the context specifics.
       
      } else {
        throw "harness context not exists";
      }
    };
    
    /*
    * @private
    * @method _updateContextSpecifics
    * 
    * Internal method to perform specifics depending on no. of harness contexts in the document.
    *
    * whenever harness context is loaded / unloaded.
    * - Updates the pega.ctxmgr.isSingleContext flag
    * - Toggles the async methods (native vs context) based on the pega.ctxmgr.isSingleContext flag.
    */
    var _updateContextSpecifics = function() {
      pega.ctxmgr.isSingleContext = (Object.keys(contextsMap).length <= 1);

      if (!(pega && pega.offline)) {
        if (pega.ctxmgr.isSingleContext) {
          window.setTimeout = nativeWindowSetTimeout;
          window.setInterval = nativeWindowSetInterval;
        } else {
          window.setTimeout = contextWindowSetTimeout;
          window.setInterval = contextWindowSetInterval;
        }
      }

    };

    // get the map for debugging
    var getHarnessContextMap = function(){
      return contextsMap;
    };

    /**
      * - Get a given HarnessContext instance from HarnessContextMap
      **/
    var getHarnessContext = function(uniqueKey){
      return contextsMap[uniqueKey];
    };
    
    /**
      * - Get a given HarnessContext instance from HarnessContextMap, based on given property and its value.
      **/
    var getContextByProperty = function(propName, propValue){
      if(!contextsMap) return;

      var harContextObj, key;
      
      for(key in contextsMap){
        harContextObj = contextsMap[key];
        
        if(harContextObj[propName]){
          if(harContextObj[propName] === propValue){
            return harContextObj;
          }
            
        }
      }
      return harContextObj;
    };
    
    /**
     * - Get DCSPA HarnessContext if present else null.
     **/
    var getDCSPAContext = function() {
      if (!contextsMap) return;

      for (var key in contextsMap) {
        var harContextObj = contextsMap[key];
        var currThreadName = pega.u.d.getThreadName(harContextObj);

        if (pega.u.d.isDCSPAThread(currThreadName) && !harContextObj.isMDC) {
          return harContextObj;
        }
      }
    };

    /**
     * - Get DCSPA ThreadName if present else null.
     **/
    var getDCSPAThreadName = function() {
      if (!contextsMap) return;

      for (var key in contextsMap) {
        var harContextObj = contextsMap[key];
        var currThreadName = pega.u.d.getThreadName(harContextObj);

        if (pega.u.d.isDCSPAThread(currThreadName)) {
          return currThreadName;
        }
      }
    };

    /**
     * - Get a given HarnessContext instance from HarnessContextMap, based on given thread name.
     **/
    var getContextByThreadName = function(threadName) {
      if (!contextsMap) return;

      for (var key in contextsMap) {
        var harContextObj = contextsMap[key];

        if (threadName === pega.u.d.getThreadName(harContextObj)) {
          return harContextObj;
        }
      }
    };

    
    /**
      * - Get a given HarnessContext instance from HarnessContextMap, based on given DOM target.
      **/
    var getContextByTarget = function(domTarget){
      if(!contextsMap || !domTarget) return;

      var targetContextElem = pega.ctx.dom.closest(domTarget, "[data-harness-id]");
      if(targetContextElem) {
        return contextsMap[targetContextElem.getAttribute("data-harness-id")];
      }
    };

    /**  @deprecated
      * - Instead use pega.ctx
      * - Get current active HarnessContext instance
      **/
    var getCurrentHarnessContext = function(){
      if (pega.ctx) {
        return pega.ctx;
      } else {
        console.warn('Current HarnessContext should be set before use.');
      }
    };

    /** 
      * - Set given HarnessContext instance as current active
      **/
    var setCurrentHarnessContext = function(harnessContext){
      //incase provided harnessContext is the key (pzHarnessID), get the context object from map
      if(typeof harnessContext === "string") {
        harnessContext = getHarnessContext(harnessContext)
      }
      // In some cases harnessContext will be undefined, E.g.: Busy Indicator scenario.
      if (!harnessContext) {
        console.info("Skip setting harnessContext to undefined");
        return;
      }
      baseHarnessContext = harnessContext;
            //pega.ctx = harnessContext;
            _ctxSetter(harnessContext);      
    };

    /** @deprecated
      * - Convenient method to get a property value from current harness context
      * - Usage: pega.ui.HarnessContextMgr.get("url")
      **/
    var getPropertyFromCurrentHarnessContext = function(propName) {
      if (!pega.ctx) {
        throw "Current HarnessContext should be set before use.";
      }
      return pega.ctx[propName];
    };

    // @deprecated
    var setPropertyToCurrentHarnessContext = function(propName, propValue) {
      if (!pega.ctx) {
        throw "Current HarnessContext should be set before use.";
      }
      pega.ctx[propName] = propValue;
    };
    
    /** 
      * @deprecated, will be removed in future
      *
      * Sets the active context in event from the current target. This is mainly used for microdc and overlay.
      * When we use pega.ctxmgr.registerContextSwitching(<<ELEMENT_OBJECT>>) it internally treats setContextInEvent as handler.
      **/
    var setContextInEvent =  function(event){
      event.harnessID = event.currentTarget.getAttribute(DATA_HARNESS_ID);
    };

    /**
     * @method registerContextSwitching
     * @param {DomElement} targetElement DOMElement to which harness context switching handler should be registered
     * @deprecated @param {Function} switchHandler Optional. Custom harness context switching, defaults to pega.ctxmgr.harnessContextSwitchHandler
     * @param {customDOMEventsToListen} custom DOMElement events to which harness context switching handler should be registered
     * 
     * @description API to register harness context switching on a DOMElement
     */
    var registerContextSwitching = function(targetElement, switchHandler, customDOMEventsToListen){
      //targetElement should be a HTMLElement or a css selector string
      if(typeof targetElement === "string") {
        targetElement = document.querySelector(targetElement);
      }

      switchHandler = switchHandler || harnessContextSwitchHandler;

      //stamping pzHarnessID on the target
      targetElement.setAttribute(DATA_HARNESS_ID, pega.ctx.pzHarnessID);
      targetElement.classList.add(pega.ctx.pzHarnessID);

      //BUG-505995 : Adding customdomeventstolisten
      if(customDOMEventsToListen){
        for(var i = 0; i < customDOMEventsToListen.length; i++){
          targetElement.removeEventListener(customDOMEventsToListen[i], switchHandler, true);
          targetElement.addEventListener(customDOMEventsToListen[i], switchHandler, true);
        }
      }
      //registration with capturing enabled
      else{
        targetElement.removeEventListener("mousedown", switchHandler, true);
        targetElement.addEventListener("mousedown", switchHandler, true);
        targetElement.removeEventListener("focusin", switchHandler, true);
        targetElement.addEventListener("focusin", switchHandler, true);
      }
      
      if(pega && pega.cl && pega.cl.isTouchAble()){
        targetElement.removeEventListener("touchend", switchHandler, true);
        targetElement.addEventListener("touchend", switchHandler, true);
      }

    };
    
    /**
     * @method unregisterContextSwitching
     * @param {DomElement} targetElement DOMElement to which harness context switching handler should be unregistered
     * @deprecated @param {Function} switchHandler Optional. The custom harness context switching handler to be unregistered, defaults to pega.ctxmgr.harnessContextSwitchHandler
     * 
     * @description API to unregister harness context switching on a DOMElement
     */
    var unregisterContextSwitching = function(targetElement, switchHandler){
      //targetElement should be a HTMLElement or a css selector string
      if(typeof targetElement === "string") {
        targetElement = document.querySelector(targetElement);
      }

      switchHandler = switchHandler || harnessContextSwitchHandler;

      //removing the context attribute
      targetElement.classList.remove(targetElement.getAttribute(DATA_HARNESS_ID));
      targetElement.removeAttribute(DATA_HARNESS_ID);
      

      //unregistration
      targetElement.removeEventListener("mousedown", switchHandler, true);
      targetElement.removeEventListener("focusin", switchHandler, true);
      targetElement.removeEventListener("change", switchHandler, true);
      
      if(pega && pega.cl && pega.cl.isTouchAble()){
        targetElement.removeEventListener("touchend", switchHandler, true);
      }
    };
    
    /**
     * @method harnessContextSwitchHandler
     * @param {Event} event The Event object
     * 
     * @description The harness context switch handler which derefers "pega.ctx" object based on the target
     */
    var harnessContextSwitchHandler = function(event){
      
      var modalDiv = document.getElementById("modalOverlay");
      if(event.skipSwitching || (pega.u.d.bModalDialogOpen && ( 
        modalDiv && modalDiv.getAttribute("data-harness-id") &&
        modalDiv.getAttribute("data-harness-id") === pega.ctx.pzHarnessID))) {
        return;
      }      

      if(event.target.classList.contains("menu-item-anchor") || event.target.classList.contains("menu-item-title")) {
        //skip only during launch menu case (and not for menubar)
        var menuWrapper = document.querySelector(".menu-panel-wrapper");
        if(menuWrapper && menuWrapper.contains(event.target)) {
          return;
        }        
      }
      
      if(event.target.classList.contains("mdc-tab-close")){
        return;
      }

      var harnessID = event.currentTarget.getAttribute(DATA_HARNESS_ID);

      if(harnessID !== pega.ctx.pzHarnessID) {
        
        //BUG-453261
        //Need to skip harness context switching due to restorefocus of dialog, if the current context is not top/portal context (pzExpressExtSlider)
        if(pega.ctxmgr.skipContextSwitching){
          //console && console.info(" --- skipping context switching --- ");
          delete pega.ctxmgr.skipContextSwitching;
          return;
        }
        
        // switch the harness context
        setCurrentHarnessContext(harnessID);

        //console && console.info(pega.u.d.getThreadName() + " - " + pega.ctx.strPyID + " - " + pega.ctx.strHarnessPurpose + " - " + event.currentTarget.tagName + " - " + event.type );
        //console.trace();
      }

    };


    /* 
     * @deprecated, will be removed in future
     *
     * Handler to skip context switching,
     * in case of modaldialog, overlay, menus
     *
     * Such components should add this handler on their container element as below,
     * pega.ctxmgr.registerContextSwitching(<<ELEMENT_OBJECT>>, pega.ctxmgr.skipHarnessContextSwitchHandler);
     */
    var skipHarnessContextSwitchHandler = function(event){
      event.skipSwitching = true;
    };
    
    /**
     * @method validateAndGetRightContext
     * Helper method to return the correct harness context in DCSPA, in case the given context is stale.
     */
    var validateAndGetRightContext = function(harnessContext){
      if(pega.ctx.bIsDCSPA) {
        
        var harnessContextMap = pega.ctxmgr.getHarnessContextMap();
        var givenHarnessId = harnessContext.pzHarnessID;
        
        if(!harnessContextMap[givenHarnessId]) {
          //if not portal harness context, get the current DCSPA context
          var portalHarnessId = document.body.getAttribute("data-harness-id");
          if(portalHarnessId !== givenHarnessId) {
            for(var harnessId in harnessContextMap) {
              if(portalHarnessId !== harnessId) {
                return harnessContextMap[harnessId];
              }
            }
          }
        }

      }
      return harnessContext;
    }
    
     var _ctxSetter = function(harnessContext) {
            var ctxChanged = pega.ctx != harnessContext;
            pega.ctx = harnessContext;
            
            if(ctxChanged && harnessContext) {
              // BUG-390747: Initialize ClientDataProvider with the new thread
              if(pega.ui.ClientDataProvider) {
                var threadName = pega.u.d.getThreadName();
                if(threadName)
                  pega.ui.ClientDataProvider.switchThread(threadName);
              }
            }
            
        };

    
    var setContext = function(harnessContext){
      if(harnessContext){
        if (!(pega && pega.offline)) {
            //pega.ctx = harnessContext;
            harnessContext = validateAndGetRightContext(harnessContext);
            _ctxSetter(harnessContext);
        }
      }
    };

    var resetContext = function(originalCtx){
      if(originalCtx){
            //pega.ctx = originalCtx;
            _ctxSetter(originalCtx);
      }
      else{
            //pega.ctx = baseHarnessContext;
            _ctxSetter(baseHarnessContext);
      }
    };   
    
    var setDocContext = function(viewDoc){
      if(viewDoc && viewDoc.GadgetId){
        var currentIframe = document.getElementById(viewDoc.GadgetId).querySelector('iframe');
        if(currentIframe && currentIframe.contentDocument && currentIframe.contentDocument.body){
          var harnessId = currentIframe.contentDocument.body.getAttribute('data-harness-id');
          if(currentIframe.contentWindow && currentIframe.contentWindow.pega && currentIframe.contentWindow.pega.ctxmgr && currentIframe.contentWindow.pega.ctxmgr.getHarnessContextMap()){
            var harCtx = currentIframe.contentWindow.pega.ctxmgr.getHarnessContext(harnessId);
            if(harCtx){
              currentIframe.contentWindow.pega.ctxmgr.setCurrentHarnessContext(harCtx);
            }
          }
        }
      }
    };

    var setRootContext = function(){
      var bodyEle = document.body;
      if(bodyEle){
        var harnessID = bodyEle.getAttribute("data-harness-id");
        if(harnessID && harnessID != ""){
          var harCtx  = pega.ctxmgr.getHarnessContext(harnessID);
          if(harCtx){
            pega.ctxmgr.setCurrentHarnessContext(harCtx);
          }
        }
      }
    };

     var getRootContext = function(){
      var bodyEle = document.body;
      if(bodyEle){
        var harnessID = bodyEle.getAttribute("data-harness-id");
        if(harnessID && harnessID != ""){
          var harCtx  = pega.ctxmgr.getHarnessContext(harnessID);
          if(harCtx){
            return harCtx;
          }
        }
      }
    };

    return {
      isSingleContext: true,
      registerContextSwitching: registerContextSwitching,
      unregisterContextSwitching: unregisterContextSwitching,
      harnessContextSwitchHandler: harnessContextSwitchHandler,
      skipHarnessContextSwitchHandler: skipHarnessContextSwitchHandler,
      setContext: setContext,
      resetContext: resetContext,
      get: getPropertyFromCurrentHarnessContext,
      set: setPropertyToCurrentHarnessContext,
      getHarnessContextMap: getHarnessContextMap,
      loadHarnessContext: loadHarnessContext,
      unloadHarnessContext: unloadHarnessContext,
      getHarnessContext: getHarnessContext,
      getContextByProperty: getContextByProperty,
      getContextByTarget: getContextByTarget,
      getDCSPAContext: getDCSPAContext,
      getDCSPAThreadName: getDCSPAThreadName,
      getContextByThreadName: getContextByThreadName,
      getCurrentHarnessContext: getCurrentHarnessContext,
      setCurrentHarnessContext: setCurrentHarnessContext,
      createHarnessContext: createHarnessContext,
      setDocumentContext: setDocContext,
      setRootDocumentContext: setRootContext,
      getRootDocumentContext: getRootContext
    };
  })();

}
//static-content-hash-trigger-YUI
pega = window.pega || {};
pega.ui = pega.ui || {};
pega.ui.HarnessContext.prototype.dom = (function(){
  
  /**
   * @private
   * 
   * @description Helper method to merge one list into another and removing DUPLICATE entries
   * @param toList   - Array into which the fromList should be merged
   * @param fromList - Array which the merged into toList
   */
  var mergeLists = function(toList, fromList){
    var finalList = [].concat(toList);
    for (var i = 0; i < fromList.length; i++) {
        if(finalList.indexOf(fromList[i]) === -1){
            finalList.push(fromList[i]);
        }
    }
    return finalList;
  };

  /*
   @public  - Function to find the closest parent element to the given element that matches the selector
   @param $HTMLElement$el - an html element from which the search should happen
   @param $string$selector - query string to match the target element
   @return{HTMLElement}| An element if matches the selector
   */
  var closest = function(el, selector) {
      var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      while (el) {
          if (matchesSelector.call(el, selector)) {
              break;
          }
          if(el.getAttribute("data-harness-id") == pega.ctx.pzHarnessID){
            return null;
          }
          el = el.parentElement;
      }
      return el;
  };

  /*
   @private  - Function to strip out the elements that are in the micro dc
   @param $Array$eleList - list of the elements
   @param $string$query - query string to get the elements
   @param.optional $HTML Element - an html element from which the search should happen
   @return{Array}| An array of elements after removing the microdc elements
   */
  var stripOutOtherCtxFields = function(eleList, query, root){
    if(!(eleList && eleList.length)) return [];
    
    if (root && root.getAttribute("data-harness-id") !== document.body.getAttribute("data-harness-id") && !pega.ui.hasAjaxContainer) {
      return Array.prototype.slice.call(eleList);
    }

    eleList = Array.prototype.slice.call(eleList); /*This is to make sure that the return type is Array everytime*/
    //strip all the elements which are not current harness.
    var otherCtxRoots = root.querySelectorAll('[data-harness-id]:not([data-harness-id="'+pega.ctx.pzHarnessID+'"])');  
    if(otherCtxRoots.length == 0 || eleList.length == 0) return eleList;
    for (var i = 0; i < otherCtxRoots.length; ++i) {
      var otherCtxRootsEle = Array.prototype.slice.call(otherCtxRoots[i].querySelectorAll(query));
      
      if(!otherCtxRootsEle.length) continue;
      
      eleList = eleList.filter(function(field) {
        return otherCtxRootsEle.indexOf(field) < 0;
      });
    }
    return eleList;
  };
  
  /*
   @private  - Function to get the root elements in the current context 
   includes modal dialogs and overlays which are opened
   @return {NodeList/Node} - Root elements that are in the current context
   */
  var getContextRootElements = function(){
      var currentHarness = pega.ctx.pzHarnessID;
      if(currentHarness){
        var harEle = null;
        harEle = document.getElementsByClassName(currentHarness);
        if(harEle.length!=0){
          if(!pega.ctx.isMDC && !pega.ctx.bIsDCSPA){
            /*To avoid duplication of elements for outer context*/
            return harEle[0];
          }else{
            return harEle;
          }
        }
      }
      return [];
  };
  

  /*
   @public  - Function to get the first html element that has the given id in its id attribute
   @param $string$id - id of the element to search for
   @return {HTMLElement} | An element that have the given id in its id attribute.
   */
  var getElementById = function(id){
    if(pega.ctxmgr.isSingleContext){
      return document.getElementById(id);
    }
    return querySelector("[id='"+id+"']");
  };

  /*
   @public  - Function to get all the html elements that have the given name in their name attribute
   @param $string$name - name of the element(s) to search for
   @return {Array} | An array of elements that have the given name in their name attribute.
   */
  var getElementsByName = function(name){
      if(pega.ctxmgr.isSingleContext){
        return Array.prototype.slice.call(document.getElementsByName(name));
      }
      return querySelectorAll("[name='"+name+"']");
  };

  /*
   @public  - Function to get all the html elements that have the given class in their class attribute
   @param $string$className - class of the element(s) to search for
   @param.optional $HTML Element - an html element from which the search should happen
   @return {Array} | An array of elements that have the given class in their class attribute.
   */
  var getElementsByClassName = function(className, root){
    
    if(pega.ctxmgr.isSingleContext){
      root = root || document;
      return Array.prototype.slice.call(root.getElementsByClassName(className));
    }
    
    if(!root){
      root = getContextRootElements();
    }else if(closest(root, "[data-harness-id='"+pega.ctx.pzHarnessID+"']") == null){
      return [];
    }
    var eleList = [];
    if(root instanceof HTMLCollection || "length" in root){
      for(var count=0;count < root.length; count++){
        var tempEleList = root[count].getElementsByClassName(className);
        tempEleList = stripOutOtherCtxFields(tempEleList, "."+className, root[count]);
        eleList = eleList.concat(tempEleList);
      }
      return eleList;
    }else{
      eleList = root.getElementsByClassName(className);
      return stripOutOtherCtxFields(eleList, "."+className, root);
    }
    
  };

  /*
   @public  - Function to get all the html elements of the given tag
   @param $string$tagName - tag name of the element(s) to search for
   @param.optional $HTML Element - an html element from which the search should happen
   @return {Array} | An array of elements of the given tag
   */
  var getElementsByTagName = function(tagName, root){
    if(pega.ctxmgr.isSingleContext){
      root = root || document;
      return Array.prototype.slice.call(root.getElementsByTagName(tagName));
    }
    if(!root){
      root = getContextRootElements();
    }else if(closest(root, "[data-harness-id='"+pega.ctx.pzHarnessID+"']") == null){
      return [];
    }

    var eleList = [];
    if(root instanceof HTMLCollection || "length" in root){
      for(var count=0;count < root.length; count++){
        var tempEleList = root[count].getElementsByTagName(tagName);
        tempEleList = stripOutOtherCtxFields(tempEleList, tagName, root[count]);
        eleList = eleList.concat(tempEleList);
      }
      return eleList;
    }else{
      eleList = root.getElementsByTagName(tagName);
      return stripOutOtherCtxFields(eleList, tagName, root);
    }
  };

  
  /*
   @public  - Function to get the first HTML element that matches the given selector
   @param $string$selector - query string of the element to search for
   @param.optional $HTML Element - an html element from which the search should happen
   @return {Array} | An element that matches the given selector.
   */
  var querySelector = function(selector, root){
    
    if(pega.ctxmgr.isSingleContext){
      root = root || document;
      return root.querySelector(selector);
    }
    
    
    if(!root){
      root = getContextRootElements();

    }else if(closest(root, "[data-harness-id='"+pega.ctx.pzHarnessID+"']") == null){
      return [];
    }
    var eleList = [];
    if(root instanceof HTMLCollection || "length" in root){
      for(var count=0; count < root.length; count++){
        var tempEleList = root[count].querySelector(selector);
        if(tempEleList) {
          tempEleList = stripOutOtherCtxFields([tempEleList], selector, root[count]);
          eleList = eleList.concat(tempEleList);
        }
      }
      
    }else{
      eleList = root.querySelector(selector);
      if(eleList) {
        eleList = stripOutOtherCtxFields([eleList], selector, root);
      }
    }    
    if(eleList && eleList.length){
      return eleList[0];
    }else{
      return null;
    }


  };

  /*
   @public  - Function to get all the html elements that match the given selector
   @param $string$selector - query string of the element(s) to search for
   @param.optional $HTML Element - an html element from which the search should happen
   @return {Array} | An array of elements that match the given selector.
   */
  var querySelectorAll = function(selector, root){
    
     if(pega.ctxmgr.isSingleContext){
      root = root || document;
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    }
    
    if(!root){
      root = getContextRootElements();

    }else if(closest(root, "[data-harness-id='"+pega.ctx.pzHarnessID+"']") == null){
      return [];
    }
    var eleList = [];
    if(root instanceof HTMLCollection || "length" in root){
      for(var count=0;count < root.length; count++){
        var tempEleList = root[count].querySelectorAll(selector);
        tempEleList = stripOutOtherCtxFields(tempEleList, selector, root[count]);
        eleList = mergeLists(eleList, tempEleList);
      }
      return eleList;
    }else{
      eleList = root.querySelectorAll(selector);
      return stripOutOtherCtxFields(eleList, selector, root);
    }
    //should be documented about the scope
  };
  
  var _getContextRoot = function(target) {
    if(target){
      var ctxDiv = pega.ctx.dom.closest(target,"[data-harness-id='" + pega.ctx.pzHarnessID + "'][data-mdc-recordid]");
    }else{
      var ctxDiv = document.querySelector("[data-harness-id='" + pega.ctx.pzHarnessID + "'][data-mdc-recordid]");
    }
    return ctxDiv || document.body;
  };
  
  var _isInContext = function(domElement) {
    var isELementExists = false;
    var rootElement = _getContextRoot();
    var curElement = domElement;
    while(curElement != null && curElement != rootElement.parentElement) {
      if(curElement == rootElement) {
        isELementExists = true;
        break;
      }
      curElement = curElement.parentElement;
    }
    rootElement = null;
    curElement = null;
    return isELementExists;
  }

  var _$StripOutOtherCtxFields = function(jqueryList, query, root){
    if(!(jqueryList && jqueryList.length)) return $();

    //strip all the elements which are not current harness.
    var otherCtxRoots = $('[data-harness-id]:not([data-harness-id="'+pega.ctx.pzHarnessID+'"])', root);
    if(otherCtxRoots.length == 0 || jqueryList.length == 0) return jqueryList;
    for (var i = 0; i < otherCtxRoots.length; ++i) {
      try {
        var otherCtxRootsEle = $(otherCtxRoots[i]).find(query);
      } catch(e) {
        // find query will fail when we try to create an element using jQuery E.g.: pega.ctx.dom.$('<div>'); - _setLayoutActive method.
        continue;
      }
      

      // if the query is directly a node
      // if the element returned is same as query node
      // do nothing
      // if(query instanceof Node) {
      //   if(otherCtxRootsEle.length == 1 && otherCtxRootsEle[0] === query) continue;
      // }
      
      if(!otherCtxRootsEle.length) continue;
      
      jqueryList = jqueryList.filter(function(idx, field) {
        return otherCtxRootsEle.index(field) < 0;
      });
      
    }
    return jqueryList;
  };
  
  
  
  var _$ = function(selector, jQueryContext){
    if(pega.ctxmgr.isSingleContext){
      return $(selector, jQueryContext);
    }
    var context = [];
    var rootElements = getContextRootElements();
    var jqueryList = $();
    if(rootElements instanceof HTMLCollection){
      context = rootElements;
    }else{
      context[0] = rootElements;
    }
    for(var count=0;count<context.length;count++){
      // if only selector is provided
      if(arguments.length == 1){
        if(typeof(arguments[0]) == "string"){

          var darguments = Array.prototype.slice.call(arguments).toString();
          $.merge(jqueryList, $(darguments, context[count]));
         
        }else{
          // if current context node is same as selector node
          // directly merge
          if(context[count] == arguments[0]){
             $.merge(jqueryList, $(arguments[0]));
          }else{
            // query the selector node in the current context node
            $.merge(jqueryList, $(context[count]).find(arguments[0]));
          }
        }
      
      } else if(arguments.length == 2){
        // if both parameters are provided
        
        // first get the provided context node from the current context node
        // and find the selector node within it
        $.merge(jqueryList, $(arguments[1], context[count]).find(arguments[0]));
      }

      //strip out other context elements
      jqueryList = _$StripOutOtherCtxFields(jqueryList, arguments[0], context[count]);
    
    } //for

    // BUG-490358 : Remove duplicates from jqueryList
    return $.unique(jqueryList);
  };

  return{
    closest: closest,
    getElementById: getElementById,
    getElementsByName: getElementsByName,
    getElementsByClassName: getElementsByClassName,
    getElementsByTagName: getElementsByTagName,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    getContextRoot: _getContextRoot,
    isInContext: _isInContext,
    $ : _$
  }
})();
//static-content-hash-trigger-GCC
/**
 * List of global identifiers and namespaced identifiers to ignore from refactoring.
 * Note: Native identifiers on the window are ignored internally and need not be explicity mentioned in the ignore list
 */
var ignoreList = [
  "pega",
  "pega.ctx.*",
  "pega.ui.HarnessContext.*",
  "pega.ui.HarnessContextMgr",
  "pega.ui.HarnessContextMap",
  "$.*",
  "$",
  "jQuery",
  "jQuery.*",
  "Handlebars.*",
  "Handlebars",
  "arguments",
  "arguments.*"
];


var transformMap = {
  "pega.u.d.SubmitInProgress": "pega.ctx.SubmitInProgress"
}
//static-content-hash-trigger-GCC
/*
Code used to extract from a JSON object, variables and evaluations to the main portal/harness.
The JSON is created in pzClientDynamicData and pzClientDynamicDataBottom.  There are 4 objects:
	initialVars
    additionaVars
    deferredVars
    bottomVars
    
initialVars is extracted at the bottom of this file, others are extracted in pzCallDeferredFieldValues.
*/
function processDynamicData(jsonObj) {
    var strEval;
    var prefix;
    var jObj;
    var clonedJsonObj;
    if (jsonObj) {
        for (var mainKey in jsonObj) {
          	clonedJsonObj = JSON.parse(JSON.stringify(jsonObj[mainKey]));
            switch (mainKey) {
                case "vars":
                case "dynamic_context":
                    JSONToValues(jsonObj[mainKey], "window.");
                	  JSONToValues(clonedJsonObj, "pega.ctx.");
                    break;
                case "equal":
                    JSONToValues(jsonObj[mainKey], "");
                    break;
                default:
                    JSONToValues(jsonObj[mainKey], mainKey + ".");
                	  JSONToValues(clonedJsonObj, "pega.ctx." + mainKey + ".");
                    break;
            }
        }
    }
}

function JSONToValues(jsonObj, prefix) {
  var strEval,strValue;
  for (var key in jsonObj) {
    if ((key.indexOf("eval") == 0) || (key.indexOf("assign_") == 0)) {
      strEval = jsonObj[key];
    } else {
      if (typeof(jsonObj[key]) == "string") {
        if (jsonObj[key].indexOf("#JSON_PARSE_TO_INT#") == 0) {
          jsonObj[key] = jsonObj[key].replace("#JSON_PARSE_TO_INT#","parseInt");
          strEval = prefix + key + "=" + jsonObj[key];
          strValue = eval(jsonObj[key]);
        } else {
          /* escape new line characters */
          jsonObj[key] = jsonObj[key].replace(/^\r+|\r+$/, '\\r');
          strEval = prefix + key + "=\"" + jsonObj[key] + "\"";
          strValue = jsonObj[key];
        }
      } else {
        strEval = prefix + key + "=" + jsonObj[key];
        strValue = jsonObj[key];
      }
      //set to harness context
      pega.ctx[key] = strValue;
    }
    try{
      if(strEval){
        strEval = strEval.replace(/[\\]/g, "\\\\");
      }
      eval(strEval);
    } catch(err){        
      console && console.log("Not valid input to eval: called from EvalHarnessJSON");
    }
  }
}
/*
Extract initial set of vars/evals.  These variables need to be at the start
*/
function evaluateJSONVariables(overrideRootContext) {

  	if(!overrideRootContext) {
      // Create HarnessContext instance.
      pega.ctx = pega.ui.HarnessContextMgr.createHarnessContext();
    }

    if(overrideRootContext) {
      // unload harness object from map for override case (SPA) before population
      //pega.ui.HarnessContextMgr.unloadHarnessContext(pega.ctx.pzHarnessID);
      var rootCtx = pega.ctxmgr.getRootDocumentContext();
      if(rootCtx){
        pega.ctx = rootCtx;
      }
    }

  	processDynamicData(initialVars);

  	// load harness object into map against pzHarnessID as key
	pega.ui.HarnessContextMgr.loadHarnessContext(pega.ctx.pzHarnessID, pega.ctx);

    var strDomainsWhiteList = pega.ctx.strDomainsWhiteList;
  	if (typeof(strDomainsWhiteList) != "undefined") {
		pega.d.domainsWhitelist = strDomainsWhiteList.split(",");
    }
}
evaluateJSONVariables();
//static-content-hash-trigger-GCC
/**
 * pega.env is used to keep track of what is known about the YUI library and
 * the browsing environment
 * @class pega.env
 * @static
 */
pega.env = pega.env || {

    /**
     * Keeps the version info for all YUI modules that have reported themselves
     * @property modules
     * @type Object[]
     */
    modules: [],
    
    /**
     * List of functions that should be executed every time a YUI module
     * reports itself.
     * @property listeners
     * @type Function[]
     */
    listeners: []
};

/**
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  pega.env.ua stores a version
 * number for the browser engine, 0 otherwise.  This value may or may not map
 * to the version number of the browser using the engine.  The value is 
 * presented as a float so that it can easily be used for boolean evaluation 
 * as well as for looking for a particular range of versions.  Because of this, 
 * some of the granularity of the version info may be lost (e.g., Gecko 1.8.0.9 
 * reports 1.8).
 * @class pega.env.ua
 * @static
 */
pega.env.ua = function() {
    var o={

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         */
        ie:0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         */
        opera:0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko 
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
         * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
         * </pre>
         * @property gecko
         * @type float
         */
        gecko:0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
         * will evaluate to 1, other browsers 0.  Example: 418.9.1
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
         *                                   and many major issues fixed).  
         * 3.x pega.com, flickr:422     <-- Safari 3.x hacks the user agent
         *                                   string when hitting pega.com and 
         *                                   flickr.com.
         * Safari 3.0.4 (523.12):523.12  <-- First Tiger release - automatic update
         *                                   from 2.x via the 10.4.11 OS patch
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   pega.com user agent hack removed.
         *                                   
         * </pre>
         * http://developer.apple.com/internet/safari/uamatrix.html
         * @property webkit
         * @type float
         */
        webkit: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.  
         * @property mobile 
         * @type string
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0

    };
    var ua=navigator.userAgent, m;

    // Modern KHTML browsers should qualify as Safari X-Grade
    if ((/KHTML/).test(ua)) {
        o.webkit=1;
    }
    // Modern WebKit browsers are at least X-Grade
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
        o.webkit=parseFloat(m[1]);

        // Mobile browser check
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"; // iPhone or iPod Touch
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
            }
        }

        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m) {
            o.air = m[0]; // Adobe AIR 1.0 or better
        }

    }

    if (!o.webkit) { // not webkit
        // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]) {
            o.opera=parseFloat(m[1]);
            m=ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }
        } else { // not opera or webkit
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
               m=ua.match(/MSIE\s([^;]*)/);
            }
            else if (navigator.appName == 'Netscape')
            {
               m=ua.match(/Trident(?:.*rv:([\w.]+))?/); // case of IE11
            }
            if (m&&m[1]) {
                o.ie=parseFloat(m[1]);
            } else { // not opera, webkit, or ie
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko=1; // Gecko detected, look for revision
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                        o.gecko=parseFloat(m[1]);
                    }
                }
            }
        }
    }
    
    return o;
}();
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
/**
 * The pega object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  pega.util, pega.widget, and pega.example are namespaces
 * created automatically for and used by the library.
 * @module pega
 * @title  pega Global
 */

/**
 * pega_config is not included as part of the library.  Instead it is an 
 * object that can be defined by the implementer immediately before 
 * including the YUI library.  The properties included in this object
 * will be used to configure global properties needed as soon as the 
 * library begins to load.
 * @class pega_config
 * @static
 */

/**
 * A reference to a function that will be executed every time a pega module
 * is loaded.  As parameter, this function will receive the version
 * information for the module. See <a href="pega.env.html#getVersion">
 * pega.env.getVersion</a> for the description of the version data structure.
 * @property listener
 * @type Function
 * @static
 * @default undefined
 */

/**
 * Set to true if the library will be dynamically loaded after window.onload.
 * Defaults to false 
 * @property injecting
 * @type boolean
 * @static
 * @default undefined
 */

/**
 * Instructs the yuiloader component to dynamically load yui components and
 * their dependencies.  See the yuiloader documentation for more information
 * about dynamic loading
 * @property load
 * @static
 * @default undefined
 * @see yuiloader
 */

/**
 * Forces the use of the supplied locale where applicable in the library
 * @property locale
 * @type string
 * @static
 * @default undefined
 */

if (typeof pega == "undefined" || !pega) {
    /**
     * The pega global namespace object.  If pega is already defined, the
     * existing pega object will not be overwritten so that defined
     * namespaces are preserved.
     * @class pega
     * @static
     */
    var pega = {};
}

/**
 * Returns the namespace specified and creates it if it doesn't exist
 * <pre>
 * pega.namespace("property.package");
 * pega.namespace("pega.property.package");
 * </pre>
 * Either of the above would create pega.property, then
 * pega.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * pega.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @method namespace
 * @static
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 */
pega.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=pega;

        // pega is implied, so it is ignored if it is included
        for (j=(d[0] == "pega") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

/**
 * Uses pega.widget.Logger to output a log message, if the widget is
 * available.
 *
 * @method log
 * @static
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @return {Boolean}      True if the log operation was successful.
 */
pega.log = function(msg, cat, src) {
    var l=pega.widget.Logger;
    if(l && l.log) {
        return l.log(msg, cat, src);
    } else {
        return false;
    }
};

/**
 * Registers a module with the pega object
 * @method register
 * @static
 * @param {String}   name    the name of the module (event, slider, etc)
 * @param {Function} mainClass a reference to class in the module.  This
 *                             class will be tagged with the version info
 *                             so that it will be possible to identify the
 *                             version that is in use when multiple versions
 *                             have loaded
 * @param {Object}   data      metadata object for the module.  Currently it
 *                             is expected to contain a "version" property
 *                             and a "build" property at minimum.
 */
pega.register = function(name, mainClass, data) {
    var mods = pega.env.modules;
    if (!mods[name]) {
        mods[name] = { versions:[], builds:[] };
    }
    var m=mods[name],v=data.version,b=data.build,ls=pega.env.listeners;
    m.name = name;
    m.version = v;
    m.build = b;
    m.versions.push(v);
    m.builds.push(b);
    m.mainClass = mainClass;
    // fire the module load listeners
    for (var i=0;i<ls.length;i=i+1) {
        ls[i](m);
    }
    // label the main class
    if (mainClass) {
        mainClass.VERSION = v;
        mainClass.BUILD = b;
    } else {
        pega.log("mainClass is undefined for module " + name, "warn");
    }
};

/**
 * pega.env is used to keep track of what is known about the YUI library and
 * the browsing environment
 * @class pega.env
 * @static
 */
pega.env = pega.env || {

    /**
     * Keeps the version info for all YUI modules that have reported themselves
     * @property modules
     * @type Object[]
     */
    modules: [],
    
    /**
     * List of functions that should be executed every time a YUI module
     * reports itself.
     * @property listeners
     * @type Function[]
     */
    listeners: []
};

/**
 * Returns the version data for the specified module:
 *      <dl>
 *      <dt>name:</dt>      <dd>The name of the module</dd>
 *      <dt>version:</dt>   <dd>The version in use</dd>
 *      <dt>build:</dt>     <dd>The build number in use</dd>
 *      <dt>versions:</dt>  <dd>All versions that were registered</dd>
 *      <dt>builds:</dt>    <dd>All builds that were registered.</dd>
 *      <dt>mainClass:</dt> <dd>An object that was was stamped with the
 *                 current version and build. If 
 *                 mainClass.VERSION != version or mainClass.BUILD != build,
 *                 multiple versions of pieces of the library have been
 *                 loaded, potentially causing issues.</dd>
 *       </dl>
 *
 * @method getVersion
 * @static
 * @param {String}  name the name of the module (event, slider, etc)
 * @return {Object} The version info
 */
pega.env.getVersion = function(name) {
    return pega.env.modules[name] || null;
};

/**
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  pega.env.ua stores a version
 * number for the browser engine, 0 otherwise.  This value may or may not map
 * to the version number of the browser using the engine.  The value is 
 * presented as a float so that it can easily be used for boolean evaluation 
 * as well as for looking for a particular range of versions.  Because of this, 
 * some of the granularity of the version info may be lost (e.g., Gecko 1.8.0.9 
 * reports 1.8).
 * @class pega.env.ua
 * @static
 */
pega.env.ua = function() {
    var o={

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         */
        ie:0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         */
        opera:0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko 
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
         * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
         * </pre>
         * @property gecko
         * @type float
         */
        gecko:0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
         * will evaluate to 1, other browsers 0.  Example: 418.9.1
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
         *                                   and many major issues fixed).  
         * 3.x pega.com, flickr:422     <-- Safari 3.x hacks the user agent
         *                                   string when hitting pega.com and 
         *                                   flickr.com.
         * Safari 3.0.4 (523.12):523.12  <-- First Tiger release - automatic update
         *                                   from 2.x via the 10.4.11 OS patch
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   pega.com user agent hack removed.
         *                                   
         * </pre>
         * http://developer.apple.com/internet/safari/uamatrix.html
         * @property webkit
         * @type float
         */
        webkit: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.  
         * @property mobile 
         * @type string
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0

    };

    var ua=navigator.userAgent, m;

    // Modern KHTML browsers should qualify as Safari X-Grade
    if ((/KHTML/).test(ua)) {
        o.webkit=1;
    }
    // Modern WebKit browsers are at least X-Grade
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
        o.webkit=parseFloat(m[1]);

        // Mobile browser check
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"; // iPhone or iPod Touch
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
            }
        }

        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m) {
            o.air = m[0]; // Adobe AIR 1.0 or better
        }

    }

    if (!o.webkit) { // not webkit
        // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]) {
            o.opera=parseFloat(m[1]);
            m=ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }
        } else { // not opera or webkit
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
               m=ua.match(/MSIE\s([^;]*)/);
            }
            else if (navigator.appName == 'Netscape')
            {
               m=ua.match(/Trident(?:.*rv:([\w.]+))?/); // case of IE11
            }
            if (m&&m[1]) {
                o.ie=parseFloat(m[1]);
            } else { // not opera, webkit, or ie
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko=1; // Gecko detected, look for revision
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                        o.gecko=parseFloat(m[1]);
                    }
                }
            }
        }
    }
    
    return o;
}();

/*
 * Initializes the global by creating the default namespaces and applying
 * any new configuration information that is detected.  This is the setup
 * for env.
 * @method init
 * @static
 * @private
 */
(function() {
    pega.namespace("util", "widget", "example");
    if ("undefined" !== typeof pega_config) {
        var l=pega_config.listener,ls=pega.env.listeners,unique=true,i;
        if (l) {
            // if pega is loaded multiple times we need to check to see if
            // this is a new config object.  If it is, add the new component
            // load listener to the stack
            for (i=0;i<ls.length;i=i+1) {
                if (ls[i]==l) {
                    unique=false;
                    break;
                }
            }
            if (unique) {
                ls.push(l);
            }
        }
    }
})();
/**
 * Provides the language utilites and extensions used by the library
 * @class pega.lang
 */
pega.lang = pega.lang || {
    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @method isArray
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isArray: function(o) { 
        if (o) {
           var l = pega.lang;
           return l.isNumber(o.length) && l.isFunction(o.splice);
        }
        return false;
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isFunction: function(o) {
        return typeof o === 'function';
    },
        
    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNull: function(o) {
        return o === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @param {any} o The object being testing
     * @return {boolean} the result
     */  
    isObject: function(o) {
return (o && (typeof o === 'object' || pega.lang.isFunction(o))) || false;
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isString: function(o) {
        return typeof o === 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isUndefined: function(o) {
        return typeof o === 'undefined';
    },
    
    /**
     * Determines whether or not the property was added
     * to the object instance.  Returns false if the property is not present
     * in the object, or was inherited from the prototype.
     * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
     * There is a discrepancy between pega.lang.hasOwnProperty and
     * Object.prototype.hasOwnProperty when the property is a primitive added to
     * both the instance AND prototype with the same value:
     * <pre>
     * var A = function() {};
     * A.prototype.foo = 'foo';
     * var a = new A();
     * a.foo = 'foo';
     * alert(a.hasOwnProperty('foo')); // true
     * alert(pega.lang.hasOwnProperty(a, 'foo')); // false when using fallback
     * </pre>
     * @method hasOwnProperty
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    hasOwnProperty: function(o, prop) {
        if (Object.prototype.hasOwnProperty) {
            return o.hasOwnProperty(prop);
        }
        
        return !pega.lang.isUndefined(o[prop]) && 
                o.constructor.prototype[prop] !== o[prop];
    },
 
    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @property _IEEnumFix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @static
     * @private
     */
    _IEEnumFix: function(r, s) {
        if (pega.env.ua.ie) {
            var add=["toString", "valueOf"], i;
            for (i=0;i<add.length;i=i+1) {
                var fname=add[i],f=s[fname];
                if (pega.lang.isFunction(f) && f!=Object.prototype[fname]) {
                    r[fname]=f;
                }
            }
        }
    },
       
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error("pega.lang.extend failed, please check that " +
                            "all dependencies are included.");
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i]=overrides[i];
            }

            pega.lang._IEEnumFix(subc.prototype, overrides);
        }
    },
   
    /**
     * Applies all properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or 
     * more methods/properties can be specified (as additional 
     * parameters).  This option will overwrite the property if receiver 
     * has it already.  If true is passed as the third parameter, all 
     * properties will be applied and _will_ overwrite properties in 
     * the receiver.
     *
     * @method augmentObject
     * @static
     * @since 2.3.0
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything
     *        in the supplier will be used unless it would
     *        overwrite an existing property in the receiver. If true
     *        is specified as the third parameter, all properties will
     *        be applied and will overwrite an existing property in
     *        the receiver
     */
    augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("Absorb failed, verify dependencies.");
        }
        var a=arguments, i, p, override=a[2];
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (override || !(p in r)) {
                    r[p] = s[p];
                }
            }
            
            pega.lang._IEEnumFix(r, s);
        }
    },
 
    /**
     * Same as pega.lang.augmentObject, except it only applies prototype properties
     * @see pega.lang.augmentObject
     * @method augmentProto
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything 
     *        in the supplier will be used unless it would overwrite an existing 
     *        property in the receiver.  if true is specified as the third 
     *        parameter, all properties will be applied and will overwrite an 
     *        existing property in the receiver
     */
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        pega.lang.augmentObject.apply(this, a);
    },

      
    /**
     * Returns a simple string representation of the object or array.
     * Other types of objects will be returned unprocessed.  Arrays
     * are expected to be indexed.  Use object notation for
     * associative arrays.
     * @method dump
     * @since 2.3.0
     * @param o {Object} The object to dump
     * @param d {int} How deep to recurse child objects, default 3
     * @return {String} the dump result
     */
    dump: function(o, d) {
        var l=pega.lang,i,len,s=[],OBJ="{...}",FUN="f(){...}",
            COMMA=', ', ARROW=' => ';

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump 
        // an element will cause an unhandled exception in FF 2.x
        if (!l.isObject(o)) {
            return o + "";
        } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
            return o;
        } else if  (l.isFunction(o)) {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (l.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (l.isArray(o)) {
            s.push("[");
            for (i=0,len=o.length;i<len;i=i+1) {
                if (l.isObject(o[i])) {
                    s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("]");
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push("{");
            for (i in o) {
                if (l.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (l.isObject(o[i])) {
                        s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("}");
        }

        return s.join("");
    },

    /**
     * Does variable substitution on a string. It scans through the string 
     * looking for expressions enclosed in { } braces. If an expression 
     * is found, it is used a key on the object.  If there is a space in
     * the key, the first word is used for the key and the rest is provided
     * to an optional function to be used to programatically determine the
     * value (the extra information might be used for this decision). If 
     * the value for the key in the object, or what is returned from the
     * function has a string value, number value, or object value, it is 
     * substituted for the bracket expression and it repeats.  If this
     * value is an object, it uses the Object's toString() if this has
     * been overridden, otherwise it does a shallow dump of the key/value
     * pairs.
     * @method substitute
     * @since 2.3.0
     * @param s {String} The string that will be modified.
     * @param o {Object} An object containing the replacement values
     * @param f {Function} An optional function that can be used to
     *                     process each match.  It receives the key,
     *                     value, and any extra metadata included with
     *                     the key inside of the braces.
     * @return {String} the substituted string
     */
    substitute: function (s, o, f) {
        var i, j, k, key, v, meta, l=pega.lang, saved=[], token, 
            DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';


        for (;;) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

            if (l.isObject(v)) {
                if (l.isArray(v)) {
                    v = l.dump(v, parseInt(meta, 10));
                } else {
                    meta = meta || "";

                    // look for the keyword 'dump', if found force obj dump
                    var dump = meta.indexOf(DUMP);
                    if (dump > -1) {
                        meta = meta.substring(4);
                    }

                    // use the toString if it is not the Object toString 
                    // and the 'dump' meta info was not found
                    if (v.toString===Object.prototype.toString||dump>-1) {
                        v = l.dump(v, parseInt(meta, 10));
                    } else {
                        v = v.toString();
                    }
                }
            } else if (!l.isString(v) && !l.isNumber(v)) {
                // This {block} has no replace string. Save it for later.
                v = "~-" + saved.length + "-~";
                saved[saved.length] = token;

                // break;
            }

            s = s.substring(0, i) + v + s.substring(j + 1);


        }

        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
        }

        return s;
    },


    /**
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @since 2.3.0
     * @param s {string} the string to trim
     * @return {string} the trimmed string
     */
    trim: function(s){
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    },

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.
     * @method merge
     * @since 2.3.0
     * @param arguments {Object*} the objects to merge
     * @return the new merged object
     */
    merge: function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            pega.lang.augmentObject(o, a[i], true);
        }
        return o;
    },

    /**
     * Executes the supplied function in the context of the supplied 
     * object 'when' milliseconds later.  Executes the function a 
     * single time unless periodic is set to true.
     * @method later
     * @since 2.4.0
     * @param when {int} the number of milliseconds to wait until the fn 
     * is executed
     * @param o the context object
     * @param fn {Function|String} the function to execute or the name of 
     * the method in the 'o' object to execute
     * @param data [Array] data that is provided to the function.  This accepts
     * either a single item or an array.  If an array is provided, the
     * function is executed with one parameter for each array item.  If
     * you need to pass a single array parameter, it needs to be wrapped in
     * an array [myarray]
     * @param periodic {boolean} if true, executes continuously at supplied 
     * interval until canceled
     * @return a timer object. Call the cancel() method on this object to 
     * stop the timer.
     */
    later: function(when, o, fn, data, periodic) {
        when = when || 0; 
        o = o || {};
        var m=fn, d=data, f, r;

        if (pega.lang.isString(fn)) {
            m = o[fn];
        }

        if (!m) {
            throw new TypeError("method undefined");
        }

        if (!pega.lang.isArray(d)) {
            d = [data];
        }

        f = function() {
            m.apply(o, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    },
    
    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values, 
     * including 0/false/''
     * @method isValue
     * @since 2.3.0
     * @param o {any} the item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    isValue: function(o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
        var l = pega.lang;
return (l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o));
    }

};

/*
 * An alias for <a href="pega.lang.html">pega.lang</a>
 * @class pega.util.Lang
 */
pega.util.Lang = pega.lang;
 
/**
 * Same as pega.lang.augmentObject, except it only applies prototype 
 * properties.  This is an alias for augmentProto.
 * @see pega.lang.augmentObject
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*|boolean}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver.  if true
 *        is specified as the third parameter, all properties will
 *        be applied and will overwrite an existing property in
 *        the receiver
 */
pega.lang.augment = pega.lang.augmentProto;

/**
 * An alias for <a href="pega.lang.html#augment">pega.lang.augment</a>
 * @for pega
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver
 */
pega.augment = pega.lang.augmentProto;
       
/**
 * An alias for <a href="pega.lang.html#extend">pega.lang.extend</a>
 * @method extend
 * @static
 * @param {Function} subc   the object to modify
 * @param {Function} superc the object to inherit
 * @param {Object} overrides  additional properties/methods to add to the
 *        subclass prototype.  These will override the
 *        matching items obtained from the superclass if present.
 */
pega.extend = pega.lang.extend;

pega.register("pega", pega, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String}  type The type of event, which is passed to the callback
 *                  when the event fires
 * @param {Object}  oScope The context the event will fire from.  "this" will
 *                  refer to this object in the callback.  Default value: 
 *                  the window object.  The listener can override this.
 * @param {boolean} silent pass true to prevent the event from writing to
 *                  the debugsystem
 * @param {int}     signature the signature that the custom event subscriber
 *                  will receive. YAHOO.util.CustomEvent.LIST or 
 *                  pega.util.CustomEvent.FLAT.  The default is
 *                  pega.util.CustomEvent.LIST.
 * @namespace YAHOO.util
 * @class CustomEvent
 * @constructor
 */

/*
TASK-20675 -- Added by goras.
This is to fix focus in event firing in case of Mozilla.Please don't remove unless this file is upgraded to YUI 2.8 version.

*/

pega.util.CustomEvent = function(type, oScope, silent, signature) {

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The scope the the event will fire from by default.  Defaults to the window 
     * obj
     * @property scope
     * @type object
     */
    this.scope = oScope || window;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = silent;

    /**
     * Custom events support two styles of arguments provided to the event
     * subscribers.  
     * <ul>
     * <li>pega.util.CustomEvent.LIST: 
     *   <ul>
     *   <li>param1: event name</li>
     *   <li>param2: array of arguments sent to fire</li>
     *   <li>param3: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * <li>pega.util.CustomEvent.FLAT
     *   <ul>
     *   <li>param1: the first argument passed to fire.  If you need to
     *           pass multiple parameters, use and array or object literal</li>
     *   <li>param2: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * </ul>
     *   @property signature
     *   @type int
     */
    this.signature = signature || pega.util.CustomEvent.LIST;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber[]
     */
    this.subscribers = [];

    if (!this.silent) {
    }

    var onsubscribeType = "_YUICEOnSubscribe";

    // Only add subscribe events for events that are not generated by 
    // CustomEvent
    if (type !== onsubscribeType) {

        /**
         * Custom events provide a custom event that fires whenever there is
         * a new subscriber to the event.  This provides an opportunity to
         * handle the case where there is a non-repeating event that has
         * already fired has a new subscriber.  
         *
         * @event subscribeEvent
         * @type pega.util.CustomEvent
         * @param {Function} fn The function to execute
         * @param {Object}   obj An object to be passed along when the event 
         *                       fires
         * @param {boolean|Object}  override If true, the obj passed in becomes 
         *                                   the execution scope of the listener.
         *                                   if an object, that object becomes the
         *                                   the execution scope.
         */
        this.subscribeEvent = 
                new pega.util.CustomEvent(onsubscribeType, this, true);

    } 


    /**
     * In order to make it possible to execute the rest of the subscriber
     * stack when one thows an exception, the subscribers exceptions are
     * caught.  The most recent exception is stored in this property
     * @property lastError
     * @type Error
     */
    this.lastError = null;
};

/**
 * Subscriber listener sigature constant.  The LIST type returns three
 * parameters: the event type, the array of args passed to fire, and
 * the optional custom object
 * @property pega.util.CustomEvent.LIST
 * @static
 * @type int
 */
pega.util.CustomEvent.LIST = 0;

/**
 * Subscriber listener sigature constant.  The FLAT type returns two
 * parameters: the first argument passed to fire and the optional 
 * custom object
 * @property pega.util.CustomEvent.FLAT
 * @static
 * @type int
 */
pega.util.CustomEvent.FLAT = 1;

pega.util.CustomEvent.prototype = {

    /**
     * Subscribes the caller to this event
     * @method subscribe
     * @param {Function} fn        The function to execute
     * @param {Object}   obj       An object to be passed along when the event 
     *                             fires
     * @param {boolean|Object}  override If true, the obj passed in becomes 
     *                                   the execution scope of the listener.
     *                                   if an object, that object becomes the
     *                                   the execution scope.
     */
    subscribe: function(fn, obj, override) {

        if (!fn) {
throw new Error("Invalid callback for subscriber to '" + this.type + "'");
        }

        if (this.subscribeEvent) {
            this.subscribeEvent.fire(fn, obj, override);
        }

        this.subscribers.push( new pega.util.Subscriber(fn, obj, override) );
    },

    /**
     * Unsubscribes subscribers.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed
     * @param {Object}   obj  The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} True if the subscriber was found and detached.
     */
    unsubscribe: function(fn, obj) {

        if (!fn) {
            return this.unsubscribeAll();
        }

        var found = false;
        for (var i=0, len=this.subscribers.length; i<len; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }

        return found;
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the scope specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * @method fire 
     * @param {Object*} arguments an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false, 
     *                   true otherwise
     */
    fire: function() {
        var len=this.subscribers.length;
        if (!len && this.silent) {
            return true;
        }

        var args=[].slice.call(arguments, 0), ret=true, i, rebuild=false;

        if (!this.silent) {
        }

        // make a copy of the subscribers so that there are
        // no index problems if one subscriber removes another.
        var subs = this.subscribers.slice();

        for (i=0; i<len; ++i) {
            var s = subs[i];
            if (!s) {
                rebuild=true;
            } else {
                if (!this.silent) {
                }

                var scope = s.getScope(this.scope);

                if (this.signature == pega.util.CustomEvent.FLAT) {
                    var param = null;
                    if (args.length > 0) {
                        param = args[0];
                    }

                    try {
                        ret = s.fn.call(scope, param, s.obj);
                    } catch(e) {
                        this.lastError = e;
                    }
                } else {
                    try {
                        ret = s.fn.call(scope, this.type, args, s.obj);
                    } catch(ex) {
                        this.lastError = ex;
                    }
                }
                if (false === ret) {
                    if (!this.silent) {
                    }

                    //break;
                    return false;
                }
            }
        }

        
        // if (rebuild) {
        //     var newlist=this.,subs=this.subscribers;
        //     for (i=0,len=subs.length; i<len; i=i+1) {
        //         // this wasn't doing anything before
        //         newlist.push(subs[i]);
        //     }
        //     this.subscribers=newlist;
        // }

        return true;
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed
     */
    unsubscribeAll: function() {
        for (var i=this.subscribers.length-1; i>-1; i--) {
            this._delete(i);
        }

        this.subscribers=[];

        return i;
    },

    /**
     * @method _delete
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }

        // this.subscribers[index]=null;
        this.subscribers.splice(index, 1);
    },

    /**
     * @method toString
     */
    toString: function() {
         return "CustomEvent: " + "'" + this.type  + "', " + 
             "scope: " + this.scope;

    }
};

/////////////////////////////////////////////////////////////////////

/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The function to execute
 * @param {Object}   obj      An object to be passed along when the event fires
 * @param {boolean}  override If true, the obj passed in becomes the execution
 *                            scope of the listener
 * @class Subscriber
 * @constructor
 */
pega.util.Subscriber = function(fn, obj, override) {

    /**
     * The callback that will be execute when the event fires
     * @property fn
     * @type function
     */
    this.fn = fn;

    /**
     * An optional custom object that will passed to the callback when
     * the event fires
     * @property obj
     * @type object
     */
    this.obj = pega.lang.isUndefined(obj) ? null : obj;

    /**
     * The default execution scope for the event listener is defined when the
     * event is created (usually the object which contains the event).
     * By setting override to true, the execution scope becomes the custom
     * object passed in by the subscriber.  If override is an object, that 
     * object becomes the scope.
     * @property override
     * @type boolean|object
     */
    this.override = override;

};

/**
 * Returns the execution scope for this listener.  If override was set to true
 * the custom obj will be the scope.  If override is an object, that is the
 * scope, otherwise the default scope will be used.
 * @method getScope
 * @param {Object} defaultScope the scope to use if this listener does not
 *                              override it.
 */
pega.util.Subscriber.prototype.getScope = function(defaultScope) {
    if (this.override) {
        if (this.override === true) {
            return this.obj;
        } else {
            return this.override;
        }
    }
    return defaultScope;
};

/**
 * Returns true if the fn and obj match this objects properties.
 * Used by the unsubscribe method to match the right subscriber.
 *
 * @method contains
 * @param {Function} fn the function to execute
 * @param {Object} obj an object to be passed along when the event fires
 * @return {boolean} true if the supplied arguments match this 
 *                   subscriber's signature.
 */
pega.util.Subscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return (this.fn == fn && this.obj == obj);
    } else {
        return (this.fn == fn);
    }
};

/**
 * @method toString
 */
pega.util.Subscriber.prototype.toString = function() {
    return "Subscriber { obj: " + this.obj  + 
           ", override: " +  (this.override || "no") + " }";
};

/**
 * The Event Utility provides utilities for managing DOM Events and tools
 * for building event systems
 *
 * @module event
 * @title Event Utility
 * @namespace pega.util
 * @requires pega
 */

// The first instance of Event will win if it is loaded more than once.
// @TODO this needs to be changed so that only the state data that needs to
// be preserved is kept, while methods are overwritten/added as needed.
// This means that the module pattern can't be used.
if (!pega.util.Event) {

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 *
 * @class Event
 * @static
 */
    pega.util.Event = function() {

        /**
         * True after the onload event has fired
         * @property loadComplete
         * @type boolean
         * @static
         * @private
         */
        var loadComplete =  false;

        /**
         * Cache of wrapped listeners
         * @property listeners
         * @type array
         * @static
         * @private
         */
        var listeners = [];

        /**
         * User-defined unload function that will be fired before all events
         * are detached
         * @property unloadListeners
         * @type array
         * @static
         * @private
         */
        var unloadListeners = [];

        /**
         * Cache of DOM0 event handlers to work around issues with DOM2 events
         * in Safari
         * @property legacyEvents
         * @static
         * @private
         */
        var legacyEvents = [];

        /**
         * Listener stack for DOM0 events
         * @property legacyHandlers
         * @static
         * @private
         */
        var legacyHandlers = [];

        /**
         * The number of times to poll after window.onload.  This number is
         * increased if additional late-bound handlers are requested after
         * the page load.
         * @property retryCount
         * @static
         * @private
         */
        var retryCount = 0;

        /**
         * onAvailable listeners
         * @property onAvailStack
         * @static
         * @private
         */
        var onAvailStack = [];

        /**
         * Lookup table for legacy events
         * @property legacyMap
         * @static
         * @private
         */
        var legacyMap = [];

        /**
         * Counter for auto id generation
         * @property counter
         * @static
         * @private
         */
        var counter = 0;
        
        /**
         * Normalized keycodes for webkit/safari
         * @property webkitKeymap
         * @type {int: int}
         * @private
         * @static
         * @final
         */
        var webkitKeymap = {
            63232: 38, // up
            63233: 40, // down
            63234: 37, // left
            63235: 39, // right
            63276: 33, // page up
            63277: 34, // page down
            25: 9      // SHIFT-TAB (Safari provides a different key code in
                       // this case, even though the shiftKey modifier is set)
        };

        return {

            /**
             * The number of times we should look for elements that are not
             * in the DOM at the time the event is requested after the document
             * has been loaded.  The default is 2000@amp;20 ms, so it will poll
             * for 40 seconds or until all outstanding handlers are bound
             * (whichever comes first).
             * @property POLL_RETRYS
             * @type int
             * @static
             * @final
             */
            POLL_RETRYS: 2000,

            /**
             * The poll interval in milliseconds
             * @property POLL_INTERVAL
             * @type int
             * @static
             * @final
             */
            POLL_INTERVAL: 20,

            /**
             * Element to bind, int constant
             * @property EL
             * @type int
             * @static
             * @final
             */
            EL: 0,

            /**
             * Type of event, int constant
             * @property TYPE
             * @type int
             * @static
             * @final
             */
            TYPE: 1,

            /**
             * Function to execute, int constant
             * @property FN
             * @type int
             * @static
             * @final
             */
            FN: 2,

            /**
             * Function wrapped for scope correction and cleanup, int constant
             * @property WFN
             * @type int
             * @static
             * @final
             */
            WFN: 3,

            /**
             * Object passed in by the user that will be returned as a 
             * parameter to the callback, int constant.  Specific to
             * unload listeners
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            UNLOAD_OBJ: 3,

            /**
             * Adjusted scope, either the element we are registering the event
             * on or the custom object passed in by the listener, int constant
             * @property ADJ_SCOPE
             * @type int
             * @static
             * @final
             */
            ADJ_SCOPE: 4,

            /**
             * The original obj passed into addListener
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            OBJ: 5,

            /**
             * The original scope parameter passed into addListener
             * @property OVERRIDE
             * @type int
             * @static
             * @final
             */
            OVERRIDE: 6,

            /**
             * addListener/removeListener can throw errors in unexpected scenarios.
             * These errors are suppressed, the method returns false, and this property
             * is set
             * @property lastError
             * @static
             * @type Error
             */
            lastError: null,

            /**
             * Safari detection
             * @property isSafari
             * @private
             * @static
             * @deprecated use pega.env.ua.webkit
             */
            isSafari: pega.env.ua.webkit,
            
            /**
             * webkit version
             * @property webkit
             * @type string
             * @private
             * @static
             * @deprecated use pega.env.ua.webkit
             */
            webkit: pega.env.ua.webkit,
            
            /**
             * IE detection 
             * @property isIE
             * @private
             * @static
             * @deprecated use pega.env.ua.ie
             */
            isIE: pega.env.ua.ie,
            
            /**
             * IE Edge detection 
             * @property isEdge
             * @private
             * @static
             */
            isEdge: /Edge/.test(navigator.userAgent) ? true : false,
          
            /**
             * poll handle
             * @property _interval
             * @static
             * @private
             */
            _interval: null,

            /**
             * document readystate poll handle
             * @property _dri
             * @static
             * @private
             */
             _dri: null,

            /**
             * True when the document is initially usable
             * @property DOMReady
             * @type boolean
             * @static
             */
            DOMReady: false,

            /**
             * @method startInterval
             * @static
             * @private
             */
            startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() { self._tryPreloadAttach(); };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                }
            },

            /**
             * Executes the supplied callback when the item with the supplied
             * id is found.  This is meant to be used to execute behavior as
             * soon as possible as the page loads.  If you use this after the
             * initial page load it will poll for a fixed time for the element.
             * The number of times it will poll and the frequency are
             * configurable.  By default it will poll for 10 seconds.
             *
             * <p>The callback is executed with a single parameter:
             * the custom object parameter, if provided.</p>
             *
             * @method onAvailable
             *
             * @param {string||string[]}   p_id the id of the element, or an array
             * of ids to look for.
             * @param {function} p_fn what to execute when the element is found.
             * @param {object}   p_obj an optional object to be passed back as
             *                   a parameter to p_fn.
             * @param {boolean|object}  p_override If set to true, p_fn will execute
             *                   in the scope of p_obj, if set to an object it
             *                   will execute in the scope of that object
             * @param checkContent {boolean} check child node readiness (onContentReady)
             * @static
             */
            onAvailable: function(p_id, p_fn, p_obj, p_override, checkContent) {

                var a = (pega.lang.isString(p_id)) ? [p_id] : p_id;

                for (var i=0; i<a.length; i=i+1) {
                    onAvailStack.push({id:         a[i], 
                                       fn:         p_fn, 
                                       obj:        p_obj, 
                                       override:   p_override, 
                                       checkReady: checkContent });
                }

                retryCount = this.POLL_RETRYS;

                this.startInterval();
            },

            /**
             * Works the same way as onAvailable, but additionally checks the
             * state of sibling elements to determine if the content of the
             * available element is safe to modify.
             *
             * <p>The callback is executed with a single parameter:
             * the custom object parameter, if provided.</p>
             *
             * @method onContentReady
             *
             * @param {string}   p_id the id of the element to look for.
             * @param {function} p_fn what to execute when the element is ready.
             * @param {object}   p_obj an optional object to be passed back as
             *                   a parameter to p_fn.
             * @param {boolean|object}  p_override If set to true, p_fn will execute
             *                   in the scope of p_obj.  If an object, p_fn will
             *                   exectute in the scope of that object
             *
             * @static
             */
            onContentReady: function(p_id, p_fn, p_obj, p_override) {
                this.onAvailable(p_id, p_fn, p_obj, p_override, true);
            },

            /**
             * Executes the supplied callback when the DOM is first usable.  This
             * will execute immediately if called after the DOMReady event has
             * fired.   @todo the DOMContentReady event does not fire when the
             * script is dynamically injected into the page.  This means the
             * DOMReady custom event will never fire in FireFox or Opera when the
             * library is injected.  It _will_ fire in Safari, and the IE 
             * implementation would allow for us to fire it if the defered script
             * is not available.  We want this to behave the same in all browsers.
             * Is there a way to identify when the script has been injected 
             * instead of included inline?  Is there a way to know whether the 
             * window onload event has fired without having had a listener attached 
             * to it when it did so?
             *
             * <p>The callback is a CustomEvent, so the signature is:</p>
             * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
             * <p>For DOMReady events, there are no fire argments, so the
             * signature is:</p>
             * <p>"DOMReady", [], obj</p>
             *
             *
             * @method onDOMReady
             *
             * @param {function} p_fn what to execute when the element is found.
             * @param {object}   p_obj an optional object to be passed back as
             *                   a parameter to p_fn.
             * @param {boolean|object}  p_scope If set to true, p_fn will execute
             *                   in the scope of p_obj, if set to an object it
             *                   will execute in the scope of that object
             *
             * @static
             */
            onDOMReady: function(p_fn, p_obj, p_override) {
                if (this.DOMReady) {
                    setTimeout(function() {
                        var s = window;
                        if (p_override) {
                            if (p_override === true) {
                                s = p_obj;
                            } else {
                                s = p_override;
                            }
                        }
                        p_fn.call(s, "DOMReady", [], p_obj);
                    }, 0);
                } else {
                    this.DOMReadyEvent.subscribe(p_fn, p_obj, p_override);
                }
            },
				/* 07/01/2011 GUJAS1 BUG-46147 - Added helper method to obtain listeners array length.
					This value is passed back as removeListener's third parameter to bypass costly lookup.
				*/
			/**
             * Returns the length of the listeners array.
             *
             * @method getListenerArrayLength
             *
             * @return {Number} -1 if listeners array is not found,
             *                  Length of the listeners array if it is found.
             * @static
             */
			getListenerArrayLength: function(){
				if (typeof listeners === "object" && typeof listeners.length == "number"){
					return listeners.length;
				}
			},

            /**
             * Appends an event handler
             *
             * @method addListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to assign the 
             *  listener to.
             * @param {String}   sType     The type of event to append
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {Boolean|object}  override  If true, the obj passed in becomes
             *                             the execution scope of the listener. If an
             *                             object, this object becomes the execution
             *                             scope.
             * @return {Boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @static
             */
            addListener: function(el, sType, fn, obj, override) {

                if (!fn || !fn.call) {
                    return false;
                }

                // The el argument can be an array of elements or element ids.
                if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0,len=el.length; i<len; ++i) {
                        ok = this.on(el[i], 
                                       sType, 
                                       fn, 
                                       obj, 
                                       override) && ok;
                    }
                    return ok;

                } else if (pega.lang.isString(el)) {
                    var oEl = this.getEl(el);
                    // If the el argument is a string, we assume it is 
                    // actually the id of the element.  If the page is loaded
                    // we convert el to the actual element, otherwise we 
                    // defer attaching the event until onload event fires

                    // check to see if we need to delay hooking up the event 
                    // until after the page loads.
                    if (oEl) {
                        el = oEl;
                    } else {
                        // defer adding the event until the element is available
                        this.onAvailable(el, function() {
                           pega.util.Event.on(el, sType, fn, obj, override);
                        });

                        return true;
                    }
                }

                // Element should be an html element or an array if we get 
                // here.
                if (!el) {
                    return false;
                }

                // we need to make sure we fire registered unload events 
                // prior to automatically unhooking them.  So we hang on to 
                // these instead of attaching them to the window and fire the
                // handles explicitly during our one unload event.
                if ("unload" == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, obj, override];
                    return true;
                }


                // if the user chooses to override the scope, we use the custom
                // object passed in, otherwise the executing scope will be the
                // HTML element that the event is registered on
                var scope = el;
                if (override) {
                    if (override === true) {
                        scope = obj;
                    } else {
                        scope = override;
                    }
                }

                // wrap the function so we can return the obj object when
                // the event fires;
                var wrappedFn = function(e) {
                        return fn.call(scope, pega.util.Event.getEvent(e, el), 
                                obj);
                    };

                var li = [el, sType, fn, wrappedFn, scope, obj, override];
                var index = listeners.length;
                // cache the listener so we can try to automatically unload
                listeners[index] = li;

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);

                    // Add a new dom0 wrapper if one is not detected for this
                    // element
                    if ( legacyIndex == -1 || 
                                el != legacyEvents[legacyIndex][0] ) {

                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;

                        // cache the signature for the DOM0 event, and 
                        // include the existing handler for the event, if any
                        legacyEvents[legacyIndex] = 
                            [el, sType, el["on" + sType]];
                        legacyHandlers[legacyIndex] = [];

                        el["on" + sType] = 
                            function(e) {
                                pega.util.Event.fireLegacyEvent(
                                    pega.util.Event.getEvent(e), legacyIndex);
                            };
                    }

                    // add a reference to the wrapped listener to our custom
                    // stack of events
                    //legacyHandlers[legacyIndex].push(index);
                    legacyHandlers[legacyIndex].push(li);

                } else {
                    try {
			// Providing for bubblable focus and blur in Firefox by using the capturing option
			if(!pega.env.ua.ie)
			{
				if(sType=="focusin")
					sType="focus";
				else if(sType=="focusout")
					sType="blur";
			}
			/* TASK-20675 BEGIN */
			var capture = ((sType == "focus" || sType == "blur") && !pega.env.ua.ie) ? true : false;		
			this._simpleAdd(el, sType, wrappedFn, capture);
			/* TASK-20675 END */
                    } catch(ex) {
                        // handle an error trying to attach an event.  If it fails
                        // we need to clean up the cache
                        this.lastError = ex;
                        this.removeListener(el, sType, fn);
                        return false;
                    }
                }

                return true;
                
            },

            /**
             * When using legacy events, the handler is routed to this object
             * so we can fire our custom listener stack.
             * @method fireLegacyEvent
             * @static
             * @private
             */
            fireLegacyEvent: function(e, legacyIndex) {
                var ok=true, le, lh, li, scope, ret;
                
                lh = legacyHandlers[legacyIndex].slice();
                for (var i=0, len=lh.length; i<len; ++i) {
                // for (var i in lh.length) {
                    li = lh[i];
                    if ( li && li[this.WFN] ) {
                        scope = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret);
                    }
                }

                // Fire the original handler if we replaced one.  We fire this
                // after the other events to keep stopPropagation/preventDefault
                // that happened in the DOM0 handler from touching our DOM2
                // substitute
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e);
                }
                
                return ok;
            },

            /**
             * Returns the legacy event index that matches the supplied 
             * signature
             * @method getLegacyIndex
             * @static
             * @private
             */
            getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == "undefined") { 
                    return -1;
                } else {
                    return legacyMap[key];
                }
            },

            /**
             * Logic that determines when we should automatically use legacy
             * events instead of DOM2 events.  Currently this is limited to old
             * Safari browsers with a broken preventDefault
             * @method useLegacyEvent
             * @static
             * @private
             */
            useLegacyEvent: function(el, sType) {
                if (this.webkit && ("click"==sType || "dblclick"==sType)) {
                    var v = parseInt(this.webkit, 10);
                    if (!isNaN(v) && v<418) {
                        return true;
                    }
                }
                return false;
            },
                    
            /**
             * Removes an event listener
             *
             * @method removeListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to remove
             *  the listener from.
             * @param {String} sType the type of event to remove.
             * @param {Function} fn the method the event invokes.  If fn is
             *  undefined, then all event handlers for the type of event are 
             *  removed.
             * @return {boolean} true if the unbind was successful, false 
             *  otherwise.
             * @static
             */
            removeListener: function(el, sType, fn) {
                var i, len, li;

                // The el argument can be a string
                if (typeof el == "string") {
                    el = this.getEl(el);
                // The el argument can be an array of elements or element ids.
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (i=el.length-1; i>-1; i--) {
                        ok = ( this.removeListener(el[i], sType, fn) && ok );
                    }
                    return ok;
                }

                if (!fn || !fn.call) {
                    //return false;
                    return this.purgeElement(el, false, sType);
                }

                if ("unload" == sType) {

                    for (i=unloadListeners.length-1; i>-1; i--) {
                        li = unloadListeners[i];
                        if (li && 
                            li[0] == el && 
                            li[1] == sType && 
                            li[2] == fn) {
                                unloadListeners.splice(i, 1);
                                // unloadListeners[i]=null;
                                return true;
                        }
                    }

                    return false;
                }

                var cacheItem = null;

                // The index is a hidden parameter; needed to remove it from
                // the method signature because it was tempting users to
                // try and take advantage of it, which is not possible.
                var index = arguments[3];
  
                if ("undefined" === typeof index) {
                    index = this._getCacheIndex(el, sType, fn);
                }

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!el || !cacheItem) {
                    return false;
                }


                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    var llist = legacyHandlers[legacyIndex];
                    if (llist) {
                        for (i=0, len=llist.length; i<len; ++i) {
                        // for (i in llist.length) {
                            li = llist[i];
                            if (li && 
                                li[this.EL] == el && 
                                li[this.TYPE] == sType && 
                                li[this.FN] == fn) {
                                    llist.splice(i, 1);
                                    // llist[i]=null;
                                    break;
                            }
                        }
                    }

                } else {
                    try {
		      var capture = ((sType == "focus" || sType == "blur") && !pega.env.ua.ie) ? true : false;
                        this._simpleRemove(el, sType, cacheItem[this.WFN], capture);
                    } catch(ex) {
                        this.lastError = ex;
                        return false;
                    }
                }

                // removed the wrapped handler
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);
                // listeners[index]=null;

                return true;

            },

            /**
             * Returns the event's target element.  Safari sometimes provides
             * a text node, and this is automatically resolved to the text
             * node's parent so that it behaves like other browsers.
             * @method getTarget
             * @param {Event} ev the event
             * @param {boolean} resolveTextNode when set to true the target's
             *                  parent will be returned if the target is a 
             *                  text node.  @deprecated, the text node is
             *                  now resolved automatically
             * @return {HTMLElement} the event's target
             * @static
             */
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },

            /**
             * In some cases, some browsers will return a text node inside
             * the actual element that was targeted.  This normalizes the
             * return value for getTarget and getRelatedTarget.
             * @method resolveTextNode
             * @param {HTMLElement} node node to resolve
             * @return {HTMLElement} the normized node
             * @static
             */
            resolveTextNode: function(n) {
                try {
                    if (n && 3 == n.nodeType) {
                        return n.parentNode;
                    }
                } catch(e) { }

                return n;
            },

            /**
             * Returns the event's pageX
             * @method getPageX
             * @param {Event} ev the event
             * @return {int} the event's pageX
             * @static
             */
            getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;

                    if ( this.isIE ) {
                        x += this._getScrollLeft();
                    }
                }

                return x;
            },

            /**
             * Returns the event's pageY
             * @method getPageY
             * @param {Event} ev the event
             * @return {int} the event's pageY
             * @static
             */
            getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;

                    if ( this.isIE ) {
                        y += this._getScrollTop();
                    }
                }


                return y;
            },

            /**
             * Returns the pageX and pageY properties as an indexed array.
             * @method getXY
             * @param {Event} ev the event
             * @return {[x, y]} the pageX and pageY properties of the event
             * @static
             */
            getXY: function(ev) {
                return [this.getPageX(ev), this.getPageY(ev)];
            },

            /**
             * Returns the event's related target 
             * @method getRelatedTarget
             * @param {Event} ev the event
             * @return {HTMLElement} the event's relatedTarget
             * @static
             */
            getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement;
                    } else if (ev.type == "mouseover") {
                        t = ev.fromElement;
                    }
                }

                return this.resolveTextNode(t);
            },

            /**
             * Returns the time of the event.  If the time is not included, the
             * event is modified using the current time.
             * @method getTime
             * @param {Event} ev the event
             * @return {Date} the time of the event
             * @static
             */
            getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch(ex) { 
                        this.lastError = ex;
                        return t;
                    }
                }

                return ev.time;
            },

            /**
             * Convenience method for stopPropagation + preventDefault
             * @method stopEvent
             * @param {Event} ev the event
             * @static
             */
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            /**
             * Stops event propagation
             * @method stopPropagation
             * @param {Event} ev the event
             * @static
             */
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            /**
             * Prevents the default behavior of the event
             * @method preventDefault
             * @param {Event} ev the event
             * @static
             */
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
             
            /**
             * Finds the event in the window object, the caller's arguments, or
             * in the arguments of another method in the callstack.  This is
             * executed automatically for events registered through the event
             * manager, so the implementer should not normally need to execute
             * this function at all.
             * @method getEvent
             * @param {Event} e the event parameter from the handler
             * @param {HTMLElement} boundEl the element the listener is attached to
             * @return {Event} the event 
             * @static
             */
            getEvent: function(e, boundEl) {
                var ev = e || window.event;

                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }

                return ev;
            },

            /**
             * Returns the charcode for an event
             * @method getCharCode
             * @param {Event} ev the event
             * @return {int} the event's charCode
             * @static
             */
            getCharCode: function(ev) {
                var code = ev.keyCode || ev.charCode || 0;

                // webkit key normalization
                if (pega.env.ua.webkit && (code in webkitKeymap)) {
                    code = webkitKeymap[code];
                }
                return code;
            },

            /**
             * Locating the saved event handler data by function ref
             *
             * @method _getCacheIndex
             * @static
             * @private
             */
            _getCacheIndex: function(el, sType, fn) {
                for (var i=0, l=listeners.length; i<l; i=i+1) {
                    var li = listeners[i];
                    if ( li                 && 
                         li[this.FN] == fn  && 
                         li[this.EL] == el  && 
                         li[this.TYPE] == sType ) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * Generates an unique ID for the element if it does not already 
             * have one.
             * @method generateId
             * @param el the element to create the id for
             * @return {string} the resulting id of the element
             * @static
             */
            generateId: function(el) {
                var id = el.id;

                if (!id) {
                    id = "yuievtautoid-" + counter;
                    ++counter;
                    el.id = id;
                }

                return id;
            },


            /**
             * We want to be able to use getElementsByTagName as a collection
             * to attach a group of events to.  Unfortunately, different 
             * browsers return different types of collections.  This function
             * tests to determine if the object is array-like.  It will also 
             * fail if the object is an array, but is empty.
             * @method _isValidCollection
             * @param o the object to test
             * @return {boolean} true if the object is array-like and populated
             * @static
             * @private
             */
            _isValidCollection: function(o) {
                try {
                    return ( o                     && // o is something
                             typeof o !== "string" && // o is not a string
                             o.length              && // o is indexed
                             !o.tagName            && // o is not an HTML element
                             !o.alert              && // o is not a window
                             typeof o[0] !== "undefined" );
                } catch(ex) {
                    return false;
                }

            },

            /**
             * @private
             * @property elCache
             * DOM element cache
             * @static
             * @deprecated Elements are not cached due to issues that arise when
             * elements are removed and re-added
             */
            elCache: {},

            /**
             * We cache elements bound by id because when the unload event 
             * fires, we can no longer use document.getElementById
             * @method getEl
             * @static
             * @private
             * @deprecated Elements are not cached any longer
             */
            getEl: function(id) {
                return (typeof id === "string") ? document.getElementById(id) : id;
            },

            /**
             * Clears the element cache
             * @deprecated Elements are not cached any longer
             * @method clearCache
             * @static
             * @private
             */
            clearCache: function() { },

            /**
             * Custom event the fires when the dom is initially usable
             * @event DOMReadyEvent
             */
            DOMReadyEvent: new pega.util.CustomEvent("DOMReady", this),

            /**
             * hook up any deferred listeners
             * @method _load
             * @static
             * @private
             */
            _load: function(e) {

                if (!loadComplete) {
                    loadComplete = true;
                    var EU = pega.util.Event;

                    // Just in case DOMReady did not go off for some reason
                    EU._ready();

                    // Available elements may not have been detected before the
                    // window load event fires. Try to find them now so that the
                    // the user is more likely to get the onAvailable notifications
                    // before the window load notification
                    EU._tryPreloadAttach();

                }
            },

            /**
             * Fires the DOMReady event listeners the first time the document is
             * usable.
             * @method _ready
             * @static
             * @private
             */
            _ready: function(e) {
                var EU = pega.util.Event;
                if (!EU.DOMReady) {
                    EU.DOMReady=true;

                    // Fire the content ready custom event
                    EU.DOMReadyEvent.fire();

                    // Remove the DOMContentLoaded (FF/Opera)
                    EU._simpleRemove(document, "DOMContentLoaded", EU._ready);
                }
            },

            /**
             * Polling function that runs before the onload event fires, 
             * attempting to attach to DOM Nodes as soon as they are 
             * available
             * @method _tryPreloadAttach
             * @static
             * @private
             */
            _tryPreloadAttach: function() {

                if (onAvailStack.length === 0) {
                    retryCount = 0;
                    clearInterval(this._interval);
                    this._interval = null;
                    return;
                }

                if (this.locked) {
                    return;
                }

                if (this.isIE) {
                    // Hold off if DOMReady has not fired and check current
                    // readyState to protect against the IE operation aborted
                    // issue.
                    if (!this.DOMReady) {
                        this.startInterval();
                        return;
                    }
                }

                this.locked = true;


                // keep trying until after the page is loaded.  We need to 
                // check the page load state prior to trying to bind the 
                // elements so that we can be certain all elements have been 
                // tested appropriately
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0 && onAvailStack.length > 0);
                }

                // onAvailable
                var notAvail = [];

                var executeItem = function (el, item) {
                    var scope = el;
                    if (item.override) {
                        if (item.override === true) {
                            scope = item.obj;
                        } else {
                            scope = item.override;
                        }
                    }
                    item.fn.call(scope, item.obj);
                };

                var i, len, item, el, ready=[];

                // onAvailable onContentReady
                for (i=0, len=onAvailStack.length; i<len; i=i+1) {
                    item = onAvailStack[i];
                    if (item) {
                        el = this.getEl(item.id);
                        if (el) {
                            if (item.checkReady) {
                                if (loadComplete || el.nextSibling || !tryAgain) {
                                    ready.push(item);
                                    onAvailStack[i] = null;
                                }
                            } else {
                                executeItem(el, item);
                                onAvailStack[i] = null;
                            }
                        } else {
                            notAvail.push(item);
                        }
                    }
                }
                
                // make sure onContentReady fires after onAvailable
                for (i=0, len=ready.length; i<len; i=i+1) {
                    item = ready[i];
                    executeItem(this.getEl(item.id), item);
                }


                retryCount--;

                if (tryAgain) {
                    for (i=onAvailStack.length-1; i>-1; i--) {
                        item = onAvailStack[i];
                        if (!item || !item.id) {
                            onAvailStack.splice(i, 1);
                        }
                    }

                    this.startInterval();
                } else {
                    clearInterval(this._interval);
                    this._interval = null;
                }

                this.locked = false;

            },

            /**
             * Removes all listeners attached to the given element via addListener.
             * Optionally, the node's children can also be purged.
             * Optionally, you can specify a specific type of event to remove.
             * @method purgeElement
             * @param {HTMLElement} el the element to purge
             * @param {boolean} recurse recursively purge this element's children
             * as well.  Use with caution.
             * @param {string} sType optional type of listener to purge. If
             * left out, all listeners will be removed
             * @static
             */
            purgeElement: function(el, recurse, sType) {
                var oEl = (pega.lang.isString(el)) ? this.getEl(el) : el;
                var elListeners = this.getListeners(oEl, sType), i, len;
                if (elListeners) {
                    for (i=elListeners.length-1; i>-1; i--) {
                        var l = elListeners[i];
                        this.removeListener(oEl, l.type, l.fn);
                    }
                }

                if (recurse && oEl && oEl.childNodes) {
                    for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                        this.purgeElement(oEl.childNodes[i], recurse, sType);
                    }
                }
            },

            /**
             * Returns all listeners attached to the given element via addListener.
             * Optionally, you can specify a specific type of event to return.
             * @method getListeners
             * @param el {HTMLElement|string} the element or element id to inspect 
             * @param sType {string} optional type of listener to return. If
             * left out, all listeners will be returned
             * @return {Object} the listener. Contains the following fields:
             * &nbsp;&nbsp;type:   (string)   the type of event
             * &nbsp;&nbsp;fn:     (function) the callback supplied to addListener
             * &nbsp;&nbsp;obj:    (object)   the custom object supplied to addListener
             * &nbsp;&nbsp;adjust: (boolean|object)  whether or not to adjust the default scope
             * &nbsp;&nbsp;scope: (boolean)  the derived scope based on the adjust parameter
             * &nbsp;&nbsp;index:  (int)      its position in the Event util listener cache
             * @static
             */           
            getListeners: function(el, sType) {
                var results=[], searchLists;
                if (!sType) {
                    searchLists = [listeners, unloadListeners];
                } else if (sType === "unload") {
                    searchLists = [unloadListeners];
                } else {
                    searchLists = [listeners];
                }

                var oEl = (pega.lang.isString(el)) ? this.getEl(el) : el;

                for (var j=0;j<searchLists.length; j=j+1) {
                    var searchList = searchLists[j];
                    if (searchList) {
                        for (var i=0,len=searchList.length; i<len ; ++i) {
                            try{
                            var l = searchList[i];
                            if ( l  && l[this.EL] === oEl && 
                                    (!sType || sType === l[this.TYPE]) ) {
                                results.push({
                                    type:   l[this.TYPE],
                                    fn:     l[this.FN],
                                    obj:    l[this.OBJ],
                                    adjust: l[this.OVERRIDE],
                                    scope:  l[this.ADJ_SCOPE],
                                    index:  i
                                });
                            }
							} catch(ex) {
							}
                        }
                    }
                }

                return (results.length) ? results : null;
            },

            /**
             * Removes all listeners registered by pe.event.  Called 
             * automatically during the unload event.
             * @method _unload
             * @static
             * @private
             */
            _unload: function(e) {

                var EU = pega.util.Event, i, j, l, len, index,
                         ul = unloadListeners.slice();

                // execute and clear stored unload listeners
                for (i=0,len=unloadListeners.length; i<len; ++i) {
                    l = ul[i];
                    if (l) {
                        var scope = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                scope = l[EU.UNLOAD_OBJ];
                            } else {
                                scope = l[EU.ADJ_SCOPE];
                            }
                        }
                        l[EU.FN].call(scope, EU.getEvent(e, l[EU.EL]), l[EU.UNLOAD_OBJ] );
                        ul[i] = null;
                        l=null;
                        scope=null;
                    }
                }

                unloadListeners = null;

                // Remove listeners to handle IE memory leaks
                //if (pega.env.ua.ie && listeners && listeners.length > 0) {
                
                // 2.5.0 listeners are removed for all browsers again.  FireFox preserves
                // at least some listeners between page refreshes, potentially causing
                // errors during page load (mouseover listeners firing before they
                // should if the user moves the mouse at the correct moment).
                if (listeners) {
                    for (j=listeners.length-1; j>-1; j--) {
                        l = listeners[j];
                        if (l) {
                            EU.removeListener(l[EU.EL], l[EU.TYPE], l[EU.FN], j);
                        } 
                    }
                    l=null;
                }

                legacyEvents = null;

                EU._simpleRemove(window, "unload", EU._unload);

            },

            /**
             * Returns scrollLeft
             * @method _getScrollLeft
             * @static
             * @private
             */
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },

            /**
             * Returns scrollTop
             * @method _getScrollTop
             * @static
             * @private
             */
            _getScrollTop: function() {
                return this._getScroll()[0];
            },

            /**
             * Returns the scrollTop and scrollLeft.  Used to calculate the 
             * pageX and pageY in Internet Explorer
             * @method _getScroll
             * @static
             * @private
             */
            _getScroll: function() {
                var dd = document.documentElement, db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            },
            
            /**
             * Used by old versions of CustomEvent, restored for backwards
             * compatibility
             * @method regCE
             * @private
             * @static
             * @deprecated still here for backwards compatibility
             */
            regCE: function() {
                // does nothing
            },

            /**
             * Adds a DOM event directly without the caching, cleanup, scope adj, etc
             *
             * @method _simpleAdd
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function(el, sType, fn, capture) {
                        if(sType == "mousewheel"){
                        el.addEventListener(sType, fn, {capture: capture, passive: true});
                      }else{
                        el.addEventListener(sType, fn, (capture));
                      }
                    };
                } else if (window.attachEvent) {
                    return function(el, sType, fn, capture) {
                        el.attachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }(),

            /**
             * Basic remove listener
             *
             * @method _simpleRemove
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleRemove: function() {
                if (window.removeEventListener) {
                    return function (el, sType, fn, capture) {
                        el.removeEventListener(sType, fn, (capture));
                    };
                } else if (window.detachEvent) {
                    return function (el, sType, fn) {
                        el.detachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }()
        };

    }();

    (function() {
        var EU = pega.util.Event;

        /**
         * pega.util.Event.on is an alias for addListener
         * @method on
         * @see addListener
         * @static
         */
        EU.on = EU.addListener;

/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (EU.isIE && document.documentElement && document.documentElement.doScroll) {

            // Process onAvailable/onContentReady items when the 
            // DOM is ready.
            pega.util.Event.onDOMReady(
                    pega.util.Event._tryPreloadAttach,
                    pega.util.Event, true);
            
            var n = document.createElement('p');  

            EU._dri = setInterval(function() {
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                    n = null;
                } catch (ex) { 
                }
            }, EU.POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (EU.webkit && EU.webkit < 525) {

            EU._dri = setInterval(function() {
                var rs=document.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                }
            }, EU.POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {

            EU._simpleAdd(document, "DOMContentLoaded", EU._ready);

        }
        /////////////////////////////////////////////////////////////


        EU._simpleAdd(window, "load", EU._load);
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach();
    })();

}
/**
 * EventProvider is designed to be used with pega.augment to wrap 
 * CustomEvents in an interface that allows events to be subscribed to 
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 *
 * @Class EventProvider
 */
pega.util.EventProvider = function() { };

pega.util.EventProvider.prototype = {

    /**
     * Private storage of custom events
     * @property __yui_events
     * @type Object[]
     * @private
     */
    __yui_events: null,

    /**
     * Private storage of custom event subscribers
     * @property __yui_subscribers
     * @type Object[]
     * @private
     */
    __yui_subscribers: null,
    
    /**
     * Subscribe to a CustomEvent by event type
     *
     * @method subscribe
     * @param p_type     {string}   the type, or name of the event
     * @param p_fn       {function} the function to exectute when the event fires
     * @param p_obj      {Object}   An object to be passed along when the event 
     *                              fires
     * @param p_override {boolean}  If true, the obj passed in becomes the 
     *                              execution scope of the listener
     */
    subscribe: function(p_type, p_fn, p_obj, p_override) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (ce) {
            ce.subscribe(p_fn, p_obj, p_override);
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var subs = this.__yui_subscribers;
            if (!subs[p_type]) {
                subs[p_type] = [];
            }
            subs[p_type].push(
                { fn: p_fn, obj: p_obj, override: p_override } );
        }
    },

    /**
     * Unsubscribes one or more listeners the from the specified event
     * @method unsubscribe
     * @param p_type {string}   The type, or name of the event.  If the type
     *                          is not specified, it will attempt to remove
     *                          the listener from all hosted events.
     * @param p_fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param p_obj  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} true if the subscriber was found and detached.
     */
    unsubscribe: function(p_type, p_fn, p_obj) {
        this.__yui_events = this.__yui_events || {};
        var evts = this.__yui_events;
        if (p_type) {
            var ce = evts[p_type];
            if (ce) {
                return ce.unsubscribe(p_fn, p_obj);
            }
        } else {
            var ret = true;
            for (var i in evts) {
                if (pega.lang.hasOwnProperty(evts, i)) {
                    ret = ret && evts[i].unsubscribe(p_fn, p_obj);
                }
            }
            return ret;
        }

        return false;
    },
    
    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param p_type {string}   The type, or name of the event
     */
    unsubscribeAll: function(p_type) {
        return this.unsubscribe(p_type);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned. 
     *
     * @method createEvent
     *
     * @param p_type {string} the type, or name of the event
     * @param p_config {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *      scope: defines the default execution scope.  If not defined
     *      the default scope will be this instance.
     *    </li>
     *    <li>
     *      silent: if true, the custom event will not generate log messages.
     *      This is false by default.
     *    </li>
     *    <li>
     *      onSubscribeCallback: specifies a callback to execute when the
     *      event has a new subscriber.  This will fire immediately for
     *      each queued subscriber if any exist prior to the creation of
     *      the event.
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    createEvent: function(p_type, p_config) {

        this.__yui_events = this.__yui_events || {};
        var opts = p_config || {};
        var events = this.__yui_events;

        if (events[p_type]) {
        } else {

            var scope  = opts.scope  || this;
            var silent = (opts.silent);

            var ce = new pega.util.CustomEvent(p_type, scope, silent,
                    pega.util.CustomEvent.FLAT);
            events[p_type] = ce;

            if (opts.onSubscribeCallback) {
                ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
            }

            this.__yui_subscribers = this.__yui_subscribers || {};
            var qs = this.__yui_subscribers[p_type];

            if (qs) {
                for (var i=0; i<qs.length; ++i) {
                    ce.subscribe(qs[i].fn, qs[i].obj, qs[i].override);
                }
            }
        }

        return events[p_type];
    },


   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the scope specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The first argument fire() was executed with</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * If the custom event has not been explicitly created, it will be
     * created now with the default config, scoped to the host object
     * @method fireEvent
     * @param p_type    {string}  the type, or name of the event
     * @param arguments {Object*} an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} the return value from CustomEvent.fire
     *                   
     */
    fireEvent: function(p_type, arg1, arg2, etc) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (!ce) {
            return null;
        }

        var args = [];
        for (var i=1; i<arguments.length; ++i) {
            args.push(arguments[i]);
        }
        return ce.fire.apply(ce, args);
    },

    /**
     * Returns true if the custom event of the provided type has been created
     * with createEvent.
     * @method hasEvent
     * @param type {string} the type, or name of the event
     */
    hasEvent: function(type) {
        if (this.__yui_events) {
            if (this.__yui_events[type]) {
                return true;
            }
        }
        return false;
    }

};

/**
* KeyListener is a utility that provides an easy interface for listening for
* keydown/keyup events fired against DOM elements.
* @namespace pega.util
* @class KeyListener
* @constructor
* @param {HTMLElement} attachTo The element or element ID to which the key 
*                               event should be attached
* @param {String}      attachTo The element or element ID to which the key
*                               event should be attached
* @param {Object}      keyData  The object literal representing the key(s) 
*                               to detect. Possible attributes are 
*                               shift(boolean), alt(boolean), ctrl(boolean) 
*                               and keys(either an int or an array of ints 
*                               representing keycodes).
* @param {Function}    handler  The CustomEvent handler to fire when the 
*                               key event is detected
* @param {Object}      handler  An object literal representing the handler. 
* @param {String}      event    Optional. The event (keydown or keyup) to 
*                               listen for. Defaults automatically to keydown.
*
* @knownissue the "keypress" event is completely broken in Safari 2.x and below.
*             the workaround is use "keydown" for key listening.  However, if
*             it is desired to prevent the default behavior of the keystroke,
*             that can only be done on the keypress event.  This makes key
*             handling quite ugly.
* @knownissue keydown is also broken in Safari 2.x and below for the ESC key.
*             There currently is no workaround other than choosing another
*             key to listen for.
*/
pega.util.KeyListener = function(attachTo, keyData, handler, event) {
    if (!attachTo) {
    } else if (!keyData) {
    } else if (!handler) {
    } 
    
    if (!event) {
        event = pega.util.KeyListener.KEYDOWN;
    }

    /**
    * The CustomEvent fired internally when a key is pressed
    * @event keyEvent
    * @private
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    var keyEvent = new pega.util.CustomEvent("keyPressed");
    
    /**
    * The CustomEvent fired when the KeyListener is enabled via the enable() 
    * function
    * @event enabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.enabledEvent = new pega.util.CustomEvent("enabled");

    /**
    * The CustomEvent fired when the KeyListener is disabled via the 
    * disable() function
    * @event disabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.disabledEvent = new pega.util.CustomEvent("disabled");

    if (typeof attachTo == 'string') {
        attachTo = document.getElementById(attachTo);
    }

    if (typeof handler == 'function') {
        keyEvent.subscribe(handler);
    } else {
        keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
    }

    /**
    * Handles the key event when a key is pressed.
    * @method handleKeyPress
    * @param {DOMEvent} e   The keypress DOM event
    * @param {Object}   obj The DOM event scope object
    * @private
    */
    function handleKeyPress(e, obj) {
        if (! keyData.shift) {  
            keyData.shift = false; 
        }
        if (! keyData.alt) {    
            keyData.alt = false;
        }
        if (! keyData.ctrl) {
            keyData.ctrl = false;
        }

        // check held down modifying keys first
        if (e.shiftKey == keyData.shift && 
            e.altKey   == keyData.alt &&
            e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match
            
            var dataItem;

            if (keyData.keys instanceof Array) {
                for (var i=0;i<keyData.keys.length;i++) {
                    dataItem = keyData.keys[i];

                    if (dataItem == e.charCode ) {
                        keyEvent.fire(e.charCode, e);
                        break;
                    } else if (dataItem == e.keyCode) {
                        keyEvent.fire(e.keyCode, e);
                        break;
                    }
                }
            } else {
                dataItem = keyData.keys;
                if (dataItem == e.charCode ) {
                    keyEvent.fire(e.charCode, e);
                } else if (dataItem == e.keyCode) {
                    keyEvent.fire(e.keyCode, e);
                }
            }
        }
    }

    /**
    * Enables the KeyListener by attaching the DOM event listeners to the 
    * target DOM element
    * @method enable
    */
    this.enable = function() {
        if (! this.enabled) {
            pega.util.Event.addListener(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData);
        }
        /**
        * Boolean indicating the enabled/disabled state of the Tooltip
        * @property enabled
        * @type Boolean
        */
        this.enabled = true;
    };

    /**
    * Disables the KeyListener by removing the DOM event listeners from the 
    * target DOM element
    * @method disable
    */
    this.disable = function() {
        if (this.enabled) {
            pega.util.Event.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData);
        }
        this.enabled = false;
    };

    /**
    * Returns a String representation of the object.
    * @method toString
    * @return {String}  The string representation of the KeyListener
    */ 
    this.toString = function() {
        return "KeyListener [" + keyData.keys + "] " + attachTo.tagName + 
                (attachTo.id ? "[" + attachTo.id + "]" : "");
    };

};

/**
* Constant representing the DOM "keydown" event.
* @property pega.util.KeyListener.KEYDOWN
* @static
* @final
* @type String
*/
pega.util.KeyListener.KEYDOWN = "keydown";

/**
* Constant representing the DOM "keyup" event.
* @property pega.util.KeyListener.KEYUP
* @static
* @final
* @type String
*/
pega.util.KeyListener.KEYUP = "keyup";

/**
 * keycode constants for a subset of the special keys
 * @property KEY
 * @static
 * @final
 */
pega.util.KeyListener.KEY = {
    ALT          : 18,
    BACK_SPACE   : 8,
    CAPS_LOCK    : 20,
    CONTROL      : 17,
    DELETE       : 46,
    DOWN         : 40,
    END          : 35,
    ENTER        : 13,
    ESCAPE       : 27,
    HOME         : 36,
    LEFT         : 37,
    META         : 224,
    NUM_LOCK     : 144,
    PAGE_DOWN    : 34,
    PAGE_UP      : 33, 
    PAUSE        : 19,
    PRINTSCREEN  : 44,
    RIGHT        : 39,
    SCROLL_LOCK  : 145,
    SHIFT        : 16,
    SPACE        : 32,
    TAB          : 9,
    UP           : 38
};
pega.register("event", pega.util.Event, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 *
 */

(function() {
    var Y = pega.util,     // internal shorthand
        getStyle,           // for load time browser branching
        setStyle,           // ditto
        propertyCache = {}, // for faster hyphen converts
        reClassNameCache = {},          // cache regexes for className
        document = window.document;     // cache for faster lookups
    
    pega.env._id_counter = pega.env._id_counter || 0;     // for use with generateId (global to save state if Dom is overwritten)

    // brower detection
    var isOpera = pega.env.ua.opera,
        isSafari = pega.env.ua.webkit, 
        isGecko = pega.env.ua.gecko,
        isIE = pega.env.ua.ie; 
    
    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
        ROOT_TAG: /^body|html$/i, // body for quirks mode, html for standards,
        OP_SCROLL:/^(?:inline|table-row)$/i
    };

    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; // no hyphens
        }
        
        if (propertyCache[property]) { // already converted
            return propertyCache[property];
        }
       
        var converted = property;
 
        while( patterns.HYPHEN.exec(converted) ) {
            converted = converted.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        
        propertyCache[property] = converted;
        return converted;
        //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
    };
    
    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };

    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        getStyle = function(el, property) {
            var value = null;
            
            if (property == 'float') { // fix reserved word
                property = 'cssFloat';
            }

            var computed = el.ownerDocument.defaultView.getComputedStyle(el, '');
            if (computed) { // test computed before touching for safari
                value = computed[toCamel(property)];
            }
            
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE) { // IE method
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity' :// IE opacity uses filter
                    var val = 100;
                    try { // will error if no DXImageTransform
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            val = el.filters('alpha').opacity;
                        } catch(e) {
                        }
                    }
                    return val / 100;
                case 'float': // fix reserved word
                    property = 'styleFloat'; // fall through
                default: 
                    // test currentStyle before touching
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { // default to inline only
        getStyle = function(el, property) { return el.style[property]; };
    }
    
    if (isIE) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( pega.lang.isString(el.style.filter) ) { // in case not appended
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; // when no layout or cant tell
                        }
                    }
		if(isIE >= 10) {
			el.style[property] = val; // alpha opacity filter doesn't work in IE10(and above?)
		}
		break;
                case 'float':
                    property = 'styleFloat';
                default:
                el.style[property] = val;
            }
        };
    } else {
        setStyle = function(el, property, val) {
            if (property == 'float') {
                property = 'cssFloat';
            }
            el.style[property] = val;
        };
    }

    var testElement = function(node, method) {
        return node && node.nodeType == 1 && ( !method || method(node) );
    };

    var dimCSSProps = ['background-position', 'border', 'border-bottom', 'border-bottom-width', 'border-left', 'border-left-width', 'border-right', 'border-right-width', 'border-top', 'border-top-width', 'border-width', 'outline', 'outline-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'box-shadow', 'height', 'max-height', 'max-width', 'min-height', 'min-width', 'width', 'font', 'font-size', 'grid-columns', 'grid-rows', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', '-moz-column-gap', '-webkit-column-gap', 'column-gap', '-moz-column-rule', '-webkit-column-rule', 'column-rule', '-moz-column-rule-width', '-webkit-column-rule-width', 'column-rule-width', '-moz-column-width', '-webkit-column-width', 'column-width', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'bottom', 'left', 'right', 'top', 'border-spacing', 'letter-spacing', 'text-indent', 'word-spacing', 'text-outline', 'text-shadow', 'perspective', '-webkit-perspective', 'outline-offset', 'vertical-align', 'background'];

    /**
     * Provides helper methods for DOM elements.
     * @namespace pega.util
     * @class Dom
     */
    pega.util.Dom = {
        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            if (el && (el.nodeType || el.item)) { // Node, or NodeList
                return el;
            }

            if (pega.lang.isString(el) || !el) { // id or null
                return document.getElementById(el);
            }
            
            if (el.length !== undefined) { // array-like 
                var c = [];
                for (var i = 0, len = el.length; i < len; ++i) {
                    c[c.length] = Y.Dom.get(el[i]);
                }
                
                return c;
            }

            return el; // some other object, just pass it back
        },
    
        /**
         * Normalizes currentStyle and ComputedStyle.
         * @method getStyle
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property whose value is returned.
         * @return {String | Array} The current value of the style property for the element(s).
         */
        getStyle: function(el, property) {
            property = toCamel(property);
            
            var f = function(element) {
                return getStyle(element, property);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
         * @method setStyle
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property to be set.
         * @param {String} val The value to apply to the given property.
         */
        setStyle: function(el, property, val) {
            try {
                var i = dimCSSProps.length;
                while (i--) {
                    if (dimCSSProps[i] == property) {
                        break;
                    }
                }
                if(i >= 0) {
                    val += '';
                    var arr = val.split(/\s+/g);
                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i].indexOf('.') < 0 && !isNaN(parseFloat(arr[i])) && isFinite(arr[i]))
                            arr[i] += 'px';
                    }
                    val = arr.join(' ');
                }
            } catch(e){console.log('e.message: ' + e.message);}

            property = toCamel(property);
            
            var f = function(element) {
                setStyle(element, property, val);
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Array} The XY position of the element(s)
         */
        getXY: function(el) {
            var f = function(el) {
                // has to be part of document to have pageXY
                if ( (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
                    return false;
                }
                
                return getXY(el);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The X position of the element(s)
         */
        getX: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[0];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The Y position of the element(s)
         */
        getY: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[1];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { // default to relative
                    this.setStyle(el, 'position', 'relative');
                    style_pos = 'relative';
                }

                var pageXY = this.getXY(el);
                if (pageXY === false) { // has to be part of doc to have pageXY
                    return false; 
                }
                
                var delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle(el, 'left'), 10 ),
                    parseInt( this.getStyle(el, 'top'), 10 )
                ];
            
                if ( isNaN(delta[0]) ) {// in case of 'auto'
                    delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                } 
                if ( isNaN(delta[1]) ) { // in case of 'auto'
                    delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
                } 
        
                if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
                if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
              
                if (!noRetry) {
                    var newXY = this.getXY(el);

                    // if retry is true, try one more time if we miss 
                   if ( (pos[0] !== null && newXY[0] != pos[0]) || 
                        (pos[1] !== null && newXY[1] != pos[1]) ) {
                       this.setXY(el, pos, true);
                   }
                }        
        
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x The value to use as the X coordinate for the element(s).
         */
        setX: function(el, x) {
            Y.Dom.setXY(el, [x, null]);
        },
        
        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x To use as the Y coordinate for the element(s).
         */
        setY: function(el, y) {
            Y.Dom.setXY(el, [null, y]);
        },
        
        /**
         * Returns the region position of the given element.
         * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
         * @method getRegion
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
         */
        getRegion: function(el) {
            var f = function(el) {
                if ( (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
                    return false;
                }

                var region = Y.Region.getRegion(el);
                return region;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns the width of the client (viewport).
         * @method getClientWidth
         * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
         * @return {Int} The width of the viewable area of the page.
         */
        getClientWidth: function() {
            return Y.Dom.getViewportWidth();
        },
        
        /**
         * Returns the height of the client (viewport).
         * @method getClientHeight
         * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
         * @return {Int} The height of the viewable area of the page.
         */
        getClientHeight: function() {
            return Y.Dom.getViewportHeight();
        },

        /**
         * Returns a array of HTMLElements with the given class.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsByClassName
         * @param {String} className The class name to match against
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @return {Array} An array of elements that have the given class name
         */
        getElementsByClassName: function(className, tag, root, apply) {
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 
            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag),
                re = getClassRegEx(className);

            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( re.test(elements[i].className) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply.call(elements[i], elements[i]);
                    }
                }
            }
            
            return nodes;
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            var re = getClassRegEx(className);

            var f = function(el) {
                return re.test(el.className);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) {
                    return false; // already present
                }
                
                
                el.className = pega.lang.trim([el.className, className].join(' '));
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(el, className) {
            var re = getClassRegEx(className);
            
            var f = function(el) {
                if (!className || !this.hasClass(el, className)) {
                    return false; // not present
                }                 

                
                var c = el.className;
                el.className = c.replace(re, ' ');
                if ( this.hasClass(el, className) ) { // in case of multiple adjacent
                    this.removeClass(el, className);
                }

                el.className = pega.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (!newClassName || oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = getClassRegEx(oldClassName);

            var f = function(el) {
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return true; // NOTE: return
                }
            
                el.className = el.className.replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.replaceClass(el, oldClassName, newClassName);
                }

                el.className = pega.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns an ID and applies it to the element "el", if provided.
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';

            var f = function(el) {
                if (el && el.id) { // do not override existing ID
                    return el.id;
                } 

                var id = prefix + pega.env._id_counter++;

                if (el) {
                    el.id = id;
                }
                
                return id;
            };

            // batch fails when no element, so just generate and return single ID
            return Y.Dom.batch(el, f, Y.Dom, true) || f.apply(Y.Dom, arguments);
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method isAncestor
         * @param {String | HTMLElement} haystack The possible ancestor
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not the haystack is an ancestor of needle
         */
        isAncestor: function(haystack, needle) {
            haystack = Y.Dom.get(haystack);
            needle = Y.Dom.get(needle);
            
            if (!haystack || !needle) {
                return false;
            }

            if (haystack.contains && needle.nodeType && !isSafari) { // safari contains is broken
                return haystack.contains(needle);
            }
            else if ( haystack.compareDocumentPosition && needle.nodeType ) {
                return !!(haystack.compareDocumentPosition(needle) & 16);
            } else if (needle.nodeType) {
                // fallback to crawling up (safari)
                return !!this.getAncestorBy(needle, function(el) {
                    return el == haystack; 
                }); 
            }
            return false;
        },
        
        /**
         * Determines whether an HTMLElement is present in the current document.
         * @method inDocument         
         * @param {String | HTMLElement} el The element to search for
         * @return {Boolean} Whether or not the element is present in the current document
         */
        inDocument: function(el) {
            return this.isAncestor(document.documentElement, el);
        },
        
        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @return {Array} Array of HTMLElements
         */
        getElementsBy: function(method, tag, root, apply) {
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 

            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply(elements[i]);
                    }
                }
            }

            
            return nodes;
        },
        
        /**
         * Runs the supplied method against each item in the Collection/Array.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} override (optional) Whether or not to override the scope of "method" with "o"
         * @return {Any | Array} The return value(s) from the supplied method
         */
        batch: function(el, method, o, override) {
            el = (el && (el.tagName || el.item)) ? el : Y.Dom.get(el); // skip get() when possible

            if (!el || !method) {
                return false;
            } 
            var scope = (override) ? o : window;
            
            if (el.tagName || el.length === undefined) { // element or not array-like 
                return method.call(scope, el, o);
            } 

            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        },
        
        /**
         * Returns the height of the document.
         * @method getDocumentHeight
         * @return {Int} The height of the actual document (which includes the body and its margin).
         */
        getDocumentHeight: function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;

            var h = Math.max(scrollHeight, Y.Dom.getViewportHeight());
            return h;
        },
        
        /**
         * Returns the width of the document.
         * @method getDocumentWidth
         * @return {Int} The width of the actual document (which includes the body and its margin).
         */
        getDocumentWidth: function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            var w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
            return w;
        },

        /**
         * Returns the current height of the viewport.
         * @method getViewportHeight
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportHeight: function() {
            var height = self.innerHeight; // Safari, Opera
            var mode = document.compatMode;
        
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
        
            return height;
        },
        
        /**
         * Returns the current width of the viewport.
         * @method getViewportWidth
         * @return {Int} The width of the viewable area of the page (excludes scrollbars).
         */
        
        getViewportWidth: function() {
            var width = self.innerWidth;  // Safari
            var mode = document.compatMode;
            
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ?
                        document.documentElement.clientWidth : // Standards
                        document.body.clientWidth; // Quirks
            }
            return width;
        },

       /**
         * Returns the nearest ancestor that passes the test applied by supplied boolean method.
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * @method getAncestorBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @return {Object} HTMLElement or null if not found
         */
        getAncestorBy: function(node, method) {
            while (node = node.parentNode) { // NOTE: assignment
                if ( testElement(node, method) ) {
                    return node;
                }
            } 

            return null;
        },
        
        /**
         * Returns the nearest ancestor with the given className.
         * @method getAncestorByClassName
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @param {String} className
         * @return {Object} HTMLElement
         */
        getAncestorByClassName: function(node, className) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) { return Y.Dom.hasClass(el, className); };
            return Y.Dom.getAncestorBy(node, method);
        },

        /**
         * Returns the nearest ancestor with the given tagName.
         * @method getAncestorByTagName
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @param {String} tagName
         * @return {Object} HTMLElement
         */
        getAncestorByTagName: function(node, tagName) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) {
                 return el.tagName && el.tagName.toUpperCase() == tagName.toUpperCase();
            };

            return Y.Dom.getAncestorBy(node, method);
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getPreviousSiblingBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getPreviousSiblingBy: function(node, method) {
            while (node) {
                node = node.previousSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the previous sibling that is an HTMLElement 
         * @method getPreviousSibling
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getPreviousSibling: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }

            return Y.Dom.getPreviousSiblingBy(node);
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getNextSiblingBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getNextSiblingBy: function(node, method) {
            while (node) {
                node = node.nextSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the next sibling that is an HTMLElement 
         * @method getNextSibling
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getNextSibling: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }

            return Y.Dom.getNextSiblingBy(node);
        }, 

        /**
         * Returns the first HTMLElement child that passes the test method. 
         * @method getFirstChildBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getFirstChildBy: function(node, method) {
            var child = ( testElement(node.firstChild, method) ) ? node.firstChild : null;
            return child || Y.Dom.getNextSiblingBy(node.firstChild, method);
        }, 

        /**
         * Returns the first HTMLElement child. 
         * @method getFirstChild
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getFirstChild: function(node, method) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            return Y.Dom.getFirstChildBy(node);
        }, 

        /**
         * Returns the last HTMLElement child that passes the test method. 
         * @method getLastChildBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getLastChildBy: function(node, method) {
            if (!node) {
                return null;
            }
            var child = ( testElement(node.lastChild, method) ) ? node.lastChild : null;
            return child || Y.Dom.getPreviousSiblingBy(node.lastChild, method);
        }, 

        /**
         * Returns the last HTMLElement child. 
         * @method getLastChild
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getLastChild: function(node) {
            node = Y.Dom.get(node);
            return Y.Dom.getLastChildBy(node);
        }, 

        /**
         * Returns an array of HTMLElement childNodes that pass the test method. 
         * @method getChildrenBy
         * @param {HTMLElement} node The HTMLElement to start from
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Array} A static array of HTMLElements
         */
        getChildrenBy: function(node, method) {
            var child = Y.Dom.getFirstChildBy(node, method);
            var children = child ? [child] : [];

            Y.Dom.getNextSiblingBy(child, function(node) {
                if ( !method || method(node) ) {
                    children[children.length] = node;
                }
                return false; // fail test to collect all children
            });

            return children;
        },
 
        /**
         * Returns an array of HTMLElement childNodes. 
         * @method getChildren
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Array} A static array of HTMLElements
         */
        getChildren: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
            }

            return Y.Dom.getChildrenBy(node);
        },
 
        /**
         * Returns the left scroll value of the document 
         * @method getDocumentScrollLeft
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the left
         */
        getDocumentScrollLeft: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        }, 

        /**
         * Returns the top scroll value of the document 
         * @method getDocumentScrollTop
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the top
         */
        getDocumentScrollTop: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },

        /**
         * Inserts the new node as the previous sibling of the reference node 
         * @method insertBefore
         * @param {String | HTMLElement} newNode The node to be inserted
         * @param {String | HTMLElement} referenceNode The node to insert the new node before 
         * @return {HTMLElement} The node that was inserted (or null if insert fails) 
         */
        insertBefore: function(newNode, referenceNode) {
            newNode = Y.Dom.get(newNode); 
            referenceNode = Y.Dom.get(referenceNode); 
            
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }       

            return referenceNode.parentNode.insertBefore(newNode, referenceNode); 
        },

        /**
         * Inserts the new node as the next sibling of the reference node 
         * @method insertAfter
         * @param {String | HTMLElement} newNode The node to be inserted
         * @param {String | HTMLElement} referenceNode The node to insert the new node after 
         * @return {HTMLElement} The node that was inserted (or null if insert fails) 
         */
        insertAfter: function(newNode, referenceNode) {
            newNode = Y.Dom.get(newNode); 
            referenceNode = Y.Dom.get(referenceNode); 
            
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }       

            if (referenceNode.nextSibling) {
                return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); 
            } else {
                return referenceNode.parentNode.appendChild(newNode);
            }
        },

        /**
         * Creates a Region based on the viewport relative to the document. 
         * @method getClientRegion
         * @return {Region} A Region object representing the viewport which accounts for document scroll
         */
        getClientRegion: function() {
            var t = Y.Dom.getDocumentScrollTop(),
                l = Y.Dom.getDocumentScrollLeft(),
                r = Y.Dom.getViewportWidth() + l,
                b = Y.Dom.getViewportHeight() + t;

            return new Y.Region(t, r, b, l);
        }
    };
    
    var getXY = function() {
        if (document.documentElement.getBoundingClientRect) { // IE
            return function(el) {
                var box = el.getBoundingClientRect();

                var rootNode = el.ownerDocument;
                return [box.left + Y.Dom.getDocumentScrollLeft(rootNode), box.top +
                        Y.Dom.getDocumentScrollTop(rootNode)];
            };
        } else {
            return function(el) { // manually calculate by crawling up offsetParents
                var pos = [el.offsetLeft, el.offsetTop];
                var parentNode = el.offsetParent;

                // safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
                var accountForBody = (isSafari &&
                        Y.Dom.getStyle(el, 'position') == 'absolute' &&
                        el.offsetParent == el.ownerDocument.body);

                if (parentNode != el) {
                    while (parentNode) {
                        pos[0] += parentNode.offsetLeft;
                        pos[1] += parentNode.offsetTop;
                        if (!accountForBody && isSafari && 
                                Y.Dom.getStyle(parentNode,'position') == 'absolute' ) { 
                            accountForBody = true;
                        }
                        parentNode = parentNode.offsetParent;
                    }
                }

                if (accountForBody) { //safari doubles in this case
                    pos[0] -= el.ownerDocument.body.offsetLeft;
                    pos[1] -= el.ownerDocument.body.offsetTop;
                } 
                parentNode = el.parentNode;

                // account for any scrolled ancestors
                while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) ) 
                {
                    if (parentNode.scrollTop || parentNode.scrollLeft) {
                        // work around opera inline/table scrollLeft/Top bug (false reports offset as scroll)
                        if (!patterns.OP_SCROLL.test(Y.Dom.getStyle(parentNode, 'display'))) { 
                            if (!isOpera || Y.Dom.getStyle(parentNode, 'overflow') !== 'visible') { // opera inline-block misreports when visible
                                pos[0] -= parentNode.scrollLeft;
                                pos[1] -= parentNode.scrollTop;
                            }
                        }
                    }
                    
                    parentNode = parentNode.parentNode; 
                }

                return pos;
            };
        }
    }() // NOTE: Executing for loadtime branching
})();
/**
 * A region is a representation of an object on a grid.  It is defined
 * by the top, right, bottom, left extents, so is rectangular by default.  If 
 * other shapes are required, this class could be extended to support it.
 * @namespace pega.util
 * @class Region
 * @param {Int} t the top extent
 * @param {Int} r the right extent
 * @param {Int} b the bottom extent
 * @param {Int} l the left extent
 * @constructor
 */
pega.util.Region = function(t, r, b, l) {

    /**
     * The region's top extent
     * @property top
     * @type Int
     */
    this.top = t;
    
    /**
     * The region's top extent as index, for symmetry with set/getXY
     * @property 1
     * @type Int
     */
    this[1] = t;

    /**
     * The region's right extent
     * @property right
     * @type int
     */
    this.right = r;

    /**
     * The region's bottom extent
     * @property bottom
     * @type Int
     */
    this.bottom = b;

    /**
     * The region's left extent
     * @property left
     * @type Int
     */
    this.left = l;
    
    /**
     * The region's left extent as index, for symmetry with set/getXY
     * @property 0
     * @type Int
     */
    this[0] = l;
};

/**
 * Returns true if this region contains the region passed in
 * @method contains
 * @param  {Region}  region The region to evaluate
 * @return {Boolean}        True if the region is contained with this region, 
 *                          else false
 */
pega.util.Region.prototype.contains = function(region) {
    return ( region.left   >= this.left   && 
             region.right  <= this.right  && 
             region.top    >= this.top    && 
             region.bottom <= this.bottom    );

};

/**
 * Returns the area of the region
 * @method getArea
 * @return {Int} the region's area
 */
pega.util.Region.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};

/**
 * Returns the region where the passed in region overlaps with this one
 * @method intersect
 * @param  {Region} region The region that intersects
 * @return {Region}        The overlap region, or null if there is no overlap
 */
pega.util.Region.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    );
    var r = Math.min( this.right,  region.right  );
    var b = Math.min( this.bottom, region.bottom );
    var l = Math.max( this.left,   region.left   );
    
    if (b >= t && r >= l) {
        return new pega.util.Region(t, r, b, l);
    } else {
        return null;
    }
};

/**
 * Returns the region representing the smallest region that can contain both
 * the passed in region and this region.
 * @method union
 * @param  {Region} region The region that to create the union with
 * @return {Region}        The union region
 */
pega.util.Region.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );

    return new pega.util.Region(t, r, b, l);
};

/**
 * toString
 * @method toString
 * @return string the region properties
 */
pega.util.Region.prototype.toString = function() {
    return ( "Region {"    +
             "top: "       + this.top    + 
             ", right: "   + this.right  + 
             ", bottom: "  + this.bottom + 
             ", left: "    + this.left   + 
             "}" );
};

/**
 * Returns a region that is occupied by the DOM element
 * @method getRegion
 * @param  {HTMLElement} el The element
 * @return {Region}         The region that the element occupies
 * @static
 */
pega.util.Region.getRegion = function(el) {
    var p = pega.util.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new pega.util.Region(t, r, b, l);
};

/////////////////////////////////////////////////////////////////////////////


/**
 * A point is a region that is special in that it represents a single point on 
 * the grid.
 * @namespace pega.util
 * @class Point
 * @param {Int} x The X position of the point
 * @param {Int} y The Y position of the point
 * @constructor
 * @extends pega.util.Region
 */
pega.util.Point = function(x, y) {
   if (pega.lang.isArray(x)) { // accept input from Dom.getXY, Event.getXY, etc.
      y = x[1]; // dont blow away x yet
      x = x[0];
   }
   
    /**
     * The X position of the point, which is also the right, left and index zero (for Dom.getXY symmetry)
     * @property x
     * @type Int
     */

    this.x = this.right = this.left = this[0] = x;
     
    /**
     * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
     * @property y
     * @type Int
     */
    this.y = this.top = this.bottom = this[1] = y;
};

pega.util.Point.prototype = new pega.util.Region();

pega.register("dom", pega.util.Dom, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
/**
 * The Connection Manager provides a simplified interface to the XMLHttpRequest
 * object.  It handles cross-browser instantiantion of XMLHttpRequest, negotiates the
 * interactive states and server response, returning the results to a pre-defined
 * callback you create.
 *
 * @namespace pega.util
 * @module connection
 * @requires pega
 * @requires event
 */
/**
 * The Connection Manager singleton provides methods for creating and managing
 * asynchronous transactions.
 *
 * @class Connect
 */
pega.util.Connect = {
    /**
     * @description Array of MSFT ActiveX ids for XMLHttpRequest.
     * @property _msxml_progid
     * @private
     * @static
     * @type array
     */
    _msxml_progid: [
        'Microsoft.XMLHTTP',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP'
    ],

    /**
     * @description Object literal of HTTP header(s)
     * @property _http_header
     * @private
     * @static
     * @type object
     */
    _http_headers: {},

    /**
     * @description Determines if HTTP headers are set.
     * @property _has_http_headers
     * @private
     * @static
     * @type boolean
     */
    _has_http_headers: false,

    /**
     * @description Determines if a default header of
     * Content-Type of 'application/x-www-form-urlencoded'
     * will be added to any client HTTP headers sent for POST
     * transactions.
     * @property _use_default_post_header
     * @private
     * @static
     * @type boolean
     */
    _use_default_post_header: true,

    /**
     * @description The default header used for POST transactions.
     * @property _default_post_header
     * @private
     * @static
     * @type boolean
     */
    _default_post_header: 'application/x-www-form-urlencoded; charset=UTF-8',

    /**
     * @description The default header used for transactions involving the
     * use of HTML forms.
     * @property _default_form_header
     * @private
     * @static
     * @type boolean
     */
    _default_form_header: 'application/x-www-form-urlencoded',

    /**
     * @description Determines if a default header of
     * 'X-Requested-With: XMLHttpRequest'
     * will be added to each transaction.
     * @property _use_default_xhr_header
     * @private
     * @static
     * @type boolean
     */
    _use_default_xhr_header: true,

    /**
     * @description The default header value for the label
     * "X-Requested-With".  This is sent with each
     * transaction, by default, to identify the
     * request as being made by YUI Connection Manager.
     * @property _default_xhr_header
     * @private
     * @static
     * @type boolean
     */
    _default_xhr_header: 'XMLHttpRequest',

    /**
     * @description Determines if custom, default headers
     * are set for each transaction.
     * @property _has_default_header
     * @private
     * @static
     * @type boolean
     */
    _has_default_headers: true,

    /**
     * @description Determines if custom, default headers
     * are set for each transaction.
     * @property _has_default_header
     * @private
     * @static
     * @type boolean
     */
    _default_headers: {},

    /**
     * @description Property modified by setForm() to determine if the data
     * should be submitted as an HTML form.
     * @property _isFormSubmit
     * @private
     * @static
     * @type boolean
     */
    _isFormSubmit: false,

    /**
     * @description Property modified by setForm() to determine if a file(s)
     * upload is expected.
     * @property _isFileUpload
     * @private
     * @static
     * @type boolean
     */
    _isFileUpload: false,

    /**
     * @description Property modified by setForm() to set a reference to the HTML
     * form node if the desired action is file upload.
     * @property _formNode
     * @private
     * @static
     * @type object
     */
    _formNode: null,

    /**
     * @description Property modified by setForm() to set the HTML form data
     * for each transaction.
     * @property _sFormData
     * @private
     * @static
     * @type string
     */
    _sFormData: null,

    /**
     * @description Collection of polling references to the polling mechanism in handleReadyState.
     * @property _poll
     * @private
     * @static
     * @type object
     */
    _poll: {},

    /**
     * @description Queue of timeout values for each transaction callback with a defined timeout value.
     * @property _timeOut
     * @private
     * @static
     * @type object
     */
    _timeOut: {},

    /**
     * @description The polling frequency, in milliseconds, for HandleReadyState.
     * when attempting to determine a transaction's XHR readyState.
     * The default is 50 milliseconds.
     * @property _polling_interval
     * @private
     * @static
     * @type int
     */
    _polling_interval: 20,

    /**
     * @description A transaction counter that increments the transaction id for each transaction.
     * @property _transaction_id
     * @private
     * @static
     * @type int
     */
    _transaction_id: 0,

    /**
     * @description Tracks the name-value pair of the "clicked" submit button if multiple submit
     * buttons are present in an HTML form; and, if pega.util.Event is available.
     * @property _submitElementValue
     * @private
     * @static
     * @type string
     */
    _submitElementValue: null,

    /**
     * @description Determines whether pega.util.Event is available and returns true or false.
     * If true, an event listener is bound at the document level to trap click events that
     * resolve to a target type of "Submit".  This listener will enable setForm() to determine
     * the clicked "Submit" value in a multi-Submit button, HTML form.
     * @property _hasSubmitListener
     * @private
     * @static
     */
    _hasSubmitListener: (function() {
        if (pega.util.Event) {
            pega.util.Event.addListener(
                document,
                'click',
                function(e) {
                    var obj = pega.util.Event.getTarget(e);
                    if (obj.nodeName.toLowerCase() == 'input' && (obj.type && obj.type.toLowerCase() == 'submit')) {
                        pega.util.Connect._submitElementValue = encodeURIComponent(obj.name) + "=" + encodeURIComponent(obj.value);
                    }
                });
            return true;
        }
        return false;
    })(),

    /**
     * @description Custom event that fires at the start of a transaction
     * @property startEvent
     * @private
     * @static
     * @type CustomEvent
     */
    startEvent: new pega.util.CustomEvent('start'),

    /**
     * @description Custom event that fires when a transaction response has completed.
     * @property completeEvent
     * @private
     * @static
     * @type CustomEvent
     */
    completeEvent: new pega.util.CustomEvent('complete'),

    /**
     * @description Custom event that fires when handleTransactionResponse() determines a
     * response in the HTTP 2xx range.
     * @property successEvent
     * @private
     * @static
     * @type CustomEvent
     */
    successEvent: new pega.util.CustomEvent('success'),

    /**
     * @description Custom event that fires when handleTransactionResponse() determines a
     * response in the HTTP 4xx/5xx range.
     * @property failureEvent
     * @private
     * @static
     * @type CustomEvent
     */
    failureEvent: new pega.util.CustomEvent('failure'),

    /**
     * @description Custom event that fires when handleTransactionResponse() determines a
     * response in the HTTP 4xx/5xx range.
     * @property failureEvent
     * @private
     * @static
     * @type CustomEvent
     */
    uploadEvent: new pega.util.CustomEvent('upload'),

    /**
     * @description Custom event that fires when a transaction is successfully aborted.
     * @property abortEvent
     * @private
     * @static
     * @type CustomEvent
     */
    abortEvent: new pega.util.CustomEvent('abort'),

    /**
     * @description A reference table that maps callback custom events members to its specific
     * event name.
     * @property _customEvents
     * @private
     * @static
     * @type object
     */
    _customEvents: {
        onStart: ['startEvent', 'start'],
        onComplete: ['completeEvent', 'complete'],
        onSuccess: ['successEvent', 'success'],
        onFailure: ['failureEvent', 'failure'],
        onUpload: ['uploadEvent', 'upload'],
        onAbort: ['abortEvent', 'abort']
    },

    /**
     * @description Member to add an ActiveX id to the existing xml_progid array.
     * In the event(unlikely) a new ActiveX id is introduced, it can be added
     * without internal code modifications.
     * @method setProgId
     * @public
     * @static
     * @param {string} id The ActiveX id to be added to initialize the XHR object.
     * @return void
     */
    setProgId: function(id) {
        this._msxml_progid.unshift(id);
    },

    /**
     * @description Member to override the default POST header.
     * @method setDefaultPostHeader
     * @public
     * @static
     * @param {boolean} b Set and use default header - true or false .
     * @return void
     */
    setDefaultPostHeader: function(b) {
        if (typeof b == 'string') {
            this._default_post_header = b;
        } else if (typeof b == 'boolean') {
            this._use_default_post_header = b;
        }
    },

    /**
     * @description Member to override the default transaction header..
     * @method setDefaultXhrHeader
     * @public
     * @static
     * @param {boolean} b Set and use default header - true or false .
     * @return void
     */
    setDefaultXhrHeader: function(b) {
        if (typeof b == 'string') {
            this._default_xhr_header = b;
        } else {
            this._use_default_xhr_header = b;
        }
    },

    /**
     * @description Member to modify the default polling interval.
     * @method setPollingInterval
     * @public
     * @static
     * @param {int} i The polling interval in milliseconds.
     * @return void
     */
    setPollingInterval: function(i) {
        if (typeof i == 'number' && isFinite(i)) {
            this._polling_interval = i;
        }
    },

    /**
     * @description Instantiates a XMLHttpRequest object and returns an object with two properties:
     * the XMLHttpRequest instance and the transaction id.
     * @method createXhrObject
     * @private
     * @static
     * @param {int} transactionId Property containing the transaction id for this transaction.
     * @return object
     */
    createXhrObject: function(transactionId) {
        var obj, http;
        try {
            // Instantiates XMLHttpRequest in non-IE browsers and assigns to http.
            http = new XMLHttpRequest();
            //  Object literal with http and tId properties
            obj = {
                conn: http,
                tId: transactionId
            };
        } catch (e) {
            for (var i = 0; i < this._msxml_progid.length; ++i) {
                try {
                    // Instantiates XMLHttpRequest for IE and assign to http
                    http = new ActiveXObject(this._msxml_progid[i]);
                    //  Object literal with conn and tId properties
                    obj = {
                        conn: http,
                        tId: transactionId
                    };
                    break;
                } catch (e) {}
            }
        } finally {
            return obj;
        }
    },

    /**
     * @description This method is called by asyncRequest to create a
     * valid connection object for the transaction.  It also passes a
     * transaction id and increments the transaction id counter.
     * @method getConnectionObject
     * @private
     * @static
     * @return {object}
     */
    getConnectionObject: function(isFileUpload) {
        var o;
        var tId = this._transaction_id;

        try {
            if (!isFileUpload) {
                o = this.createXhrObject(tId);
            } else {
                o = {};
                o.tId = tId;
                o.isUpload = true;
            }

            if (o) {
                this._transaction_id++;
            }
        } catch (e) {} finally {
            return o;
        }
    },

    /**
     * @description Method for initiating an asynchronous request via the XHR object.
     * @method asyncRequest
     * @public
     * @static
     * @param {string} method HTTP transaction method
     * @param {string} uri Fully qualified path of resource
     * @param {callback} callback User-defined callback function or object
     * @param {string} postData POST body
     * @return {object} Returns the connection object
     */
    asyncRequest: function(method, uri, callback, postData, bAsync) {
        var _async = true;
        var o = (this._isFileUpload) ? this.getConnectionObject(true) : this.getConnectionObject();
        var args = (callback && callback.argument) ? callback.argument : null;

        if (!o) {
            return null;
        } else {          
            // Intialize any transaction-specific custom events, if provided.
            if (callback && callback.customevents) {
                this.initCustomEvents(o, callback);
            }

            // setup error handler for abort/cancel (see bug-216390) - must be set before open?
            if (o.conn && o.conn.addEventListener) {
                o.conn.addEventListener("abort", function(evt) {
                    pega.util.Connect.handleError(evt, o, args, callback);
                }, false);
            }

            if (this._isFormSubmit) {
                if (this._isFileUpload) {
                    this.uploadFile(o, callback, uri, postData);
                    return o;
                }

                // If the specified HTTP method is GET, setForm() will return an
                // encoded string that is concatenated to the uri to
                // create a querystring.
                if (method.toUpperCase() == 'GET') {
                    if (this._sFormData.length !== 0) {
                        // If the URI already contains a querystring, append an ampersand
                        // and then concatenate _sFormData to the URI.
                        uri += ((uri.indexOf('?') == -1) ? '?' : '&') + this._sFormData;
                    }
                } else if (method.toUpperCase() == 'POST') {
                    // If POST data exist in addition to the HTML form data,
                    // it will be concatenated to the form data.
                    postData = postData ? this._sFormData + "&" + postData : this._sFormData;
                }
            }

            if (method.toUpperCase() == 'GET' && (callback && callback.cache === false)) {
                // If callback.cache is defined and set to false, a
                // timestamp value will be added to the querystring.
                uri += ((uri.indexOf('?') == -1) ? '?' : '&') + "rnd=" + new Date().valueOf().toString();
            }

            if (bAsync === false) {
                _async = false;
            }

            o.conn.open(method, uri, _async);

            // Each transaction will automatically include a custom header of
            // "X-Requested-With: XMLHttpRequest" to identify the request as
            // having originated from Connection Manager.
            if (this._use_default_xhr_header) {
                if (!this._default_headers['X-Requested-With']) {
                    this.initHeader('X-Requested-With', this._default_xhr_header, true);
                }
            }

            //If the transaction method is POST and the POST header value is set to true
            //or a custom value, initalize the Content-Type header to this value.
            if ((method.toUpperCase() == 'POST' && this._use_default_post_header) && this._isFormSubmit === false) {
                this.initHeader('Content-Type', this._default_post_header);

                //Bug-29567, Set the content-type to text/xml if the postData has xml in it.
                //For performance reasons, the search for xml header is performed in the first 10 characters only.

                if (postData != null) {

                    var headerSet = false;
                    if (typeof postData == "string") {
                        var headerData = postData.substring(0, 10);
                        if (headerData.indexOf("<?xml") != -1) {
                            this.initHeader('Content-Type', "text/xml");
                            headerSet = true;

                        }
                    }

                    if (!headerSet)
                        this.initHeader('Content-Type', "application/x-www-form-urlencoded");


                }

            }

            //Initialize all default and custom HTTP headers,
            if (this._has_default_headers || this._has_http_headers) {
                this.setHeader(o);
            }

            // Set timeout if any
            if (callback && callback.timeout) {
                o.conn.timeout = callback.timeout;
            }
            o.conn.ontimeout = this.abort.bind(this, o, callback, true);

            o.conn.onreadystatechange = this.handleReadyState.bind(this, o, callback);

            o.startTime = Date.now();
            if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setHttpBusy(o.tId, true);
          
            if(window.gIsMultiTenantPortal){
              o.conn.withCredentials = true;
            }
            o.conn.send(postData || '');


            // Reset the HTML form data and state properties as
            // soon as the data are submitted.
            if (this._isFormSubmit === true) {
                this.resetFormState();
            }

            // Fire global custom event -- startEvent
            this.startEvent.fire(o, args);

            if (o.startEvent) {
                // Fire transaction custom event -- startEvent
                o.startEvent.fire(o, args);
            }

            return o;
        }
    },

    /**
     * @description This method creates and subscribes custom events,
     * specific to each transaction
     * @method initCustomEvents
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callback} callback The user-defined callback object
     * @return {void}
     */
    initCustomEvents: function(o, callback) {
        // Enumerate through callback.customevents members and bind/subscribe
        // events that match in the _customEvents table.
        for (var prop in callback.customevents) {
            if (this._customEvents[prop][0]) {
                // Create the custom event
                o[this._customEvents[prop][0]] = new pega.util.CustomEvent(this._customEvents[prop][1], (callback.scope) ? callback.scope : null);

                // Subscribe the custom event
                o[this._customEvents[prop][0]].subscribe(callback.customevents[prop]);
            }
        }
    },

    /**
     * @description This method serves as a handler for abort or error exit from the transaction, see bug-216390
     * @method handleError
     */
    handleError: function(evt, o, args, callback) {
        if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setHttpDone(o.tId, Date.now() - o.startTime);

        // prevent retry
        if (pega.u && pega.u.d)
            pega.u.d.ajaxFailureSecondaryCount = -1;
        window.ajaxRequestFail = true;

        var responseObject = pega.util.Connect.createExceptionObject(o.tId, args, evt.type == "abort");
        if (callback && callback.failure) {
            if (!callback.scope) {
                callback.failure(responseObject);
            } else {
                callback.failure.apply(callback.scope, [responseObject]);
            }
        }
    },

    /**
     * @description This method binds a callback to the
     * onreadystatechange event.  Upon readyState 4, handleTransactionResponse
     * will process the response, and the timer will be cleared.
     * @method handleReadyState
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callback} callback The user-defined callback object
     * @return {void}
     */

    handleReadyState: function(o, callback) {

        var oConn = this;
        var args = (callback && callback.argument) ? callback.argument : null;

        if (o.conn.readyState == 4) {
            if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setHttpDone(o.tId, Date.now() - o.startTime);

            // Fire global custom event -- completeEvent
            oConn.completeEvent.fire(o, args);

            // Fire transaction custom event -- completeEvent
            o.completeEvent && o.completeEvent.fire(o, args);

            oConn.handleTransactionResponse(o, callback);
        }
    },

    /**
     * @description This method attempts to interpret the server response and
     * determine whether the transaction was successful, or if an error or
     * exception was encountered.
     * @method handleTransactionResponse
     * @private
     * @static
     * @param {object} o The connection object
     * @param {object} callback The user-defined callback object
     * @param {boolean} isAbort Determines if the transaction was terminated via abort().
     * @return {void}
     */
    handleTransactionResponse: function(o, callback, isAbort) {
        var httpStatus, responseObject;
        var args = (callback && callback.argument) ? callback.argument : null;

        try {
            if (o.conn.status !== undefined && o.conn.status !== 0) {
                httpStatus = o.conn.status;
            } else {
                httpStatus = 13030;
            }
        } catch (e) {

            // 13030 is a custom code to indicate the condition -- in Mozilla/FF --
            // when the XHR object's status and statusText properties are
            // unavailable, and a query attempt throws an exception.
            httpStatus = 13030;
        }

        if (httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223) {
            responseObject = this.createResponseObject(o, args);
            responseObject.httpStatus = httpStatus;
            if (callback && callback.success) {
                if (!callback.scope) {
                    callback.success(responseObject);
                } else {
                    // If a scope property is defined, the callback will be fired from
                    // the context of the object.
                    callback.success.apply(callback.scope, [responseObject]);
                }
            } else {
                /* BUG-109111: added logic for redirect to login screen in case of invalid/timedout session */
                try {
                    if (responseObject && responseObject.responseText && pega && pega.u && pega.u.d && pega.u.d.showLoginScreen) {
                        pega.u.d.showLoginScreen(responseObject.responseText);
                    }
                } catch (e) {}
            }

            // Fire global custom event -- successEvent
            this.successEvent.fire(responseObject);

            if (o.successEvent) {
                // Fire transaction custom event -- successEvent
                o.successEvent.fire(responseObject);
            }
        } else {
            switch (httpStatus) {
                // The following cases are wininet.dll error codes that may be encountered.
                case 12002: // Server timeout
                case 12029: // 12029 to 12031 correspond to dropped connections.
                case 12030:
                case 12031:
                case 12152: // Connection closed by server.
                case 13030: // See above comments for variable status.
                    responseObject = this.createExceptionObject(o.tId, args, (isAbort ? isAbort : false));
                    if (callback && callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        } else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }

                    break;
                default:
                    responseObject = this.createResponseObject(o, args);
                    if (callback && callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        } else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
            }

            // Fire global custom event -- failureEvent
            this.failureEvent.fire(responseObject);

            if (o.failureEvent) {
                // Fire transaction custom event -- failureEvent
                o.failureEvent.fire(responseObject);
            }

        }

        this.releaseObject(o);
        responseObject = null;
    },

    /**
     * @description This method evaluates the server response, creates and returns the results via
     * its properties.  Success and failure cases will differ in the response
     * object's property values.
     * @method createResponseObject
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
     * @return {object}
     */
    createResponseObject: function(o, callbackArg) {
        var obj = {};
        var headerObj = {};

        try {
            var headerStr = o.conn.getAllResponseHeaders();
            var header = headerStr.split('\n');
            for (var i = 0; i < header.length; i++) {
                var delimitPos = header[i].indexOf(':');
                if (delimitPos != -1) {
                    headerObj[header[i].substring(0, delimitPos)] = header[i].substring(delimitPos + 2);
                }
            }
        } catch (e) {}

        obj.tId = o.tId;
        // Normalize IE's response to HTTP 204 when Win error 1223.
        obj.status = (o.conn.status == 1223) ? 204 : o.conn.status;
        // Normalize IE's statusText to "No Content" instead of "Unknown".
        obj.statusText = (o.conn.status == 1223) ? "No Content" : o.conn.statusText;
        obj.getResponseHeader = headerObj;
        obj.getAllResponseHeaders = headerStr;
        obj.responseText = o.conn.responseText;
        obj.responseXML = o.conn.responseXML;

        if (callbackArg) {
            obj.argument = callbackArg;
        }

        return obj;
    },

    /**
     * @description If a transaction cannot be completed due to dropped or closed connections,
     * there may be not be enough information to build a full response object.
     * The failure callback will be fired and this specific condition can be identified
     * by a status property value of 0.
     *
     * If an abort was successful, the status property will report a value of -1.
     *
     * @method createExceptionObject
     * @private
     * @static
     * @param {int} tId The Transaction Id
     * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
     * @param {boolean} isAbort Determines if the exception case is caused by a transaction abort
     * @return {object}
     */
    createExceptionObject: function(tId, callbackArg, isAbort) {
        var COMM_CODE = 0;
        var COMM_ERROR = 'communication failure';
        var ABORT_CODE = -1;
        var ABORT_ERROR = 'transaction aborted';

        var obj = {};

        obj.tId = tId;
        if (isAbort) {
            obj.status = ABORT_CODE;
            obj.statusText = ABORT_ERROR;
        } else {
            obj.status = COMM_CODE;
            obj.statusText = COMM_ERROR;
        }

        if (callbackArg) {
            obj.argument = callbackArg;
        }

        return obj;
    },

    /**
     * @description Method that initializes the custom HTTP headers for the each transaction.
     * @method initHeader
     * @public
     * @static
     * @param {string} label The HTTP header label
     * @param {string} value The HTTP header value
     * @param {string} isDefault Determines if the specific header is a default header
     * automatically sent with each transaction.
     * @return {void}
     */
    initHeader: function(label, value, isDefault) {
        var headerObj = (isDefault) ? this._default_headers : this._http_headers;
        headerObj[label] = value;

        if (isDefault) {
            this._has_default_headers = true;
        } else {
            this._has_http_headers = true;
        }
    },


    /**
     * @description Accessor that sets the HTTP headers for each transaction.
     * @method setHeader
     * @private
     * @static
     * @param {object} o The connection object for the transaction.
     * @return {void}
     */
    setHeader: function(o) {
        if (this._has_default_headers) {
            for (var prop in this._default_headers) {
                if (pega.lang.hasOwnProperty(this._default_headers, prop)) {
                    o.conn.setRequestHeader(prop, this._default_headers[prop]);
                }
            }
        }

      if (this._has_http_headers) {
        for (var prop in this._http_headers) {
          if (pega.lang.hasOwnProperty(this._http_headers, prop)) {
            o.conn.setRequestHeader(prop, this._http_headers[prop]);
          }
        }
        delete this._http_headers;

        this._http_headers = {};
        this._has_http_headers = false;
      }

      //always add activeCSRFToken to the header
      //BUG-437497
      //US-239944 - Added parent's csrf token for MDC and DCSPA cases.
      if((pega.u.d && (pega.u.d.isFlowinModalProgress || pega.u.d.bIsFlowInModal || pega.u.d.bIsDCSPA)) || pega.ctx.isMDC){
       
        var topHarnessContext = pega.ctxmgr.getRootDocumentContext();
        if(topHarnessContext){
           o.conn.setRequestHeader("pzCTkn", topHarnessContext.activeCSRFToken);
        }
        else if(pega.ctx.activeCSRFToken){
          o.conn.setRequestHeader("pzCTkn", pega.ctx.activeCSRFToken);
        }
      }
      else{
        o.conn.setRequestHeader("pzCTkn", pega.ctx.activeCSRFToken);
      }

      o.conn.setRequestHeader("pzBFP", pega.d.browserFingerprint);
    },

    /**
     * @description Resets the default HTTP headers object
     * @method resetDefaultHeaders
     * @public
     * @static
     * @return {void}
     */
    resetDefaultHeaders: function() {
        delete this._default_headers;
        this._default_headers = {};
        this._has_default_headers = false;
    },

    /**
     * @description This method assembles the form label and value pairs and
     * constructs an encoded string.
     * asyncRequest() will automatically initialize the transaction with a
     * a HTTP header Content-Type of application/x-www-form-urlencoded.
     * @method setForm
     * @public
     * @static
     * @param {string || object} form id or name attribute, or form object.
     * @param {boolean} optional enable file upload.
     * @param {boolean} optional enable file upload over SSL in IE only.
     * @return {string} string of the HTML form field name and value pairs..
     */
    setForm: function(formId, isUpload, secureUri) {
        // reset the HTML form data and state properties
        this.resetFormState();

        var oForm;
        if (typeof formId == 'string') {
            // Determine if the argument is a form id or a form name.
            // Note form name usage is deprecated, but supported
            // here for backward compatibility.
            oForm = (document.getElementById(formId) || document.forms[formId]);
        } else if (typeof formId == 'object') {
            // Treat argument as an HTML form object.
            oForm = formId;
        } else {
            return;
        }

        // If the isUpload argument is true, setForm will call createFrame to initialize
        // an iframe as the form target.
        //
        // The argument secureURI is also required by IE in SSL environments
        // where the secureURI string is a fully qualified HTTP path, used to set the source
        // of the iframe, to a stub resource in the same domain.
        if (isUpload) {

            // Create iframe in preparation for file upload.
            var io = this.createFrame((window.location.href.toLowerCase().indexOf("https") === 0 || secureUri) ? true : false);
            // Set form reference and file upload properties to true.
            this._isFormSubmit = true;
            this._isFileUpload = true;
            this._formNode = oForm;

            return;

        }

        var oElement, oName, oValue, oDisabled;
        var hasSubmit = false;

        // Iterate over the form elements collection to construct the
        // label-value pairs.
        for (var i = 0; i < oForm.elements.length; i++) {
            oElement = oForm.elements[i];
            oDisabled = oElement.disabled;
            oName = oElement.name;
            oValue = oElement.value;

            // Do not submit fields that are disabled or
            // do not have a name attribute value.
            if (!oDisabled && oName) {
                switch (oElement.type) {
                    case 'select-one':
                    case 'select-multiple':
                        for (var j = 0; j < oElement.options.length; j++) {
                            if (oElement.options[j].selected) {
                                if (window.ActiveXObject) {
                                    this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].attributes['value'].specified ? oElement.options[j].value : oElement.options[j].text) + '&';
                                } else {
                                    this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].hasAttribute('value') ? oElement.options[j].value : oElement.options[j].text) + '&';
                                }
                            }
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (oElement.checked) {
                            this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                        }
                        break;
                    case 'file':
                        // stub case as XMLHttpRequest will only send the file path as a string.
                    case undefined:
                        // stub case for fieldset element which returns undefined.
                    case 'reset':
                        // stub case for input type reset button.
                    case 'button':
                        // stub case for input type button elements.
                        break;
                    case 'submit':
                        if (hasSubmit === false) {
                            if (this._hasSubmitListener && this._submitElementValue) {
                                this._sFormData += this._submitElementValue + '&';
                            } else {
                                this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                            }

                            hasSubmit = true;
                        }
                        break;
                    default:
                        this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
                }
            }
        }

        this._isFormSubmit = true;
        this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);


        this.initHeader('Content-Type', this._default_form_header);

        return this._sFormData;
    },

    /**
     * @description Resets HTML form properties when an HTML form or HTML form
     * with file upload transaction is sent.
     * @method resetFormState
     * @private
     * @static
     * @return {void}
     */
    resetFormState: function() {
        this._isFormSubmit = false;
        this._isFileUpload = false;
        this._formNode = null;
        this._sFormData = "";
    },

    /**
     * @description Creates an iframe to be used for form file uploads.  It is remove from the
     * document upon completion of the upload transaction.
     * @method createFrame
     * @private
     * @static
     * @param {string} optional qualified path of iframe resource for SSL in IE.
     * @return {void}
     */
    createFrame: function(secureUri) {

        // IE does not allow the setting of id and name attributes as object
        // properties via createElement().  A different iframe creation
        // pattern is required for IE.
        var frameId = 'yuiIO' + this._transaction_id;
        var dM;
        var io;
        if (window.ActiveXObject) {
            dM = document.documentMode ? document.documentMode : false;
            if (dM >= 9) {
                io = document.createElement('iframe');
                io.id = frameId;
                io.name = frameId;
            } else {
                io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
            }

            // IE will throw a security exception in an SSL environment if the
            // iframe source is undefined.
            if (typeof secureUri == 'boolean') {
                io.src = 'blank.htm';
            }
        } else {
            io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }

        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';

        document.body.appendChild(io);
    },

    /**
     * @description Parses the POST data and creates hidden form elements
     * for each key-value, and appends them to the HTML form object.
     * @method appendPostData
     * @private
     * @static
     * @param {string} postData The HTTP POST data
     * @return {array} formElements Collection of hidden fields.
     */
    appendPostData: function(postData) {
        var formElements = [];
        var postMessage = postData.split('&');
        for (var i = 0; i < postMessage.length; i++) {
            var delimitPos = postMessage[i].indexOf('=');
            if (delimitPos != -1) {
                formElements[i] = document.createElement('input');
                formElements[i].type = 'hidden';
                formElements[i].name = postMessage[i].substring(0, delimitPos);
                formElements[i].value = decodeURIComponent(postMessage[i].substring(delimitPos + 1));
                this._formNode.appendChild(formElements[i]);
            }
        }

        return formElements;
    },

    /**
     * @description Uploads HTML form, inclusive of files/attachments, using the
     * iframe created in createFrame to facilitate the transaction.
     * @method uploadFile
     * @private
     * @static
     * @param {int} id The transaction id.
     * @param {object} callback User-defined callback object.
     * @param {string} uri Fully qualified path of resource.
     * @param {string} postData POST data to be submitted in addition to HTML form.
     * @return {void}
     */
    uploadFile: function(o, callback, uri, postData) {

        // Each iframe has an id prefix of "yuiIO" followed
        // by the unique transaction id.
        var oConn = this;
        var frameId = 'yuiIO' + o.tId;
        var uploadEncoding = 'multipart/form-data';
        var io = document.getElementById(frameId);
        var args = (callback && callback.argument) ? callback.argument : null;
        var actionAttr = this._formNode.getAttribute('action');
        if (typeof(actionAttr) != 'string') {
            actionAttr = this._formNode.attributes.action ? this._formNode.attributes.action.value : '';
        }

        // Track original HTML form attribute values.
        var rawFormAttributes = {
            action: actionAttr,
            method: this._formNode.getAttribute('method'),
            target: this._formNode.getAttribute('target')
        };

        // Initialize the HTML form properties in case they are
        // not defined in the HTML form.
        this._formNode.setAttribute('action', uri);
        this._formNode.setAttribute('method', 'POST');
        this._formNode.setAttribute('target', frameId);

        if (this._formNode.encoding) {
            // IE does not respect property enctype for HTML forms.
            // Instead it uses the property - "encoding".
            this._formNode.setAttribute('encoding', uploadEncoding);
        } else {
            this._formNode.setAttribute('enctype', uploadEncoding);
        }

        if (postData) {
            var oElements = this.appendPostData(postData);
        }

        // Start file upload.
        this._formNode.submit();

        // Fire global custom event -- startEvent
        this.startEvent.fire(o, args);

        if (o.startEvent) {
            // Fire transaction custom event -- startEvent
            o.startEvent.fire(o, args);
        }

        // Start polling if a callback is present and the timeout
        // property has been defined.
        if (callback && callback.timeout) {
            this._timeOut[o.tId] = window.setTimeout(function() {
                oConn.abort(o, callback, true);
            }, callback.timeout);
        }

        // Remove HTML elements created by appendPostData
        if (oElements && oElements.length > 0) {
            for (var i = 0; i < oElements.length; i++) {
                pega.util.Dom.removeNode(oElements[i]); //BUG-172370 this._formNode.removeChild(oElements[i]);
            }
        }

        // Restore HTML form attributes to their original
        // values prior to file upload.
        for (var prop in rawFormAttributes) {
            if (pega.lang.hasOwnProperty(rawFormAttributes, prop)) {
                if (rawFormAttributes[prop]) {
                    this._formNode.setAttribute(prop, rawFormAttributes[prop]);
                } else {
                    this._formNode.removeAttribute(prop);
                }
            }
        }

        // Reset HTML form state properties.
        this.resetFormState();

        // Create the upload callback handler that fires when the iframe
        // receives the load event.  Subsequently, the event handler is detached
        // and the iframe removed from the document.
        var uploadCallback = function() {
            if (callback && callback.timeout) {
                window.clearTimeout(oConn._timeOut[o.tId]);
                delete oConn._timeOut[o.tId];
            }

            // inform test and perf monitor
            if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setHttpDone(o.tId);

            // Fire global custom event -- completeEvent
            oConn.completeEvent.fire(o, args);

            if (o.completeEvent) {
                // Fire transaction custom event -- completeEvent
                o.completeEvent.fire(o, args);
            }

            var obj = {};
            obj.tId = o.tId;
            obj.argument = callback.argument;

            try {
                // responseText and responseXML will be populated with the same data from the iframe.
                // Since the HTTP headers cannot be read from the iframe
                obj.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : io.contentWindow.document.documentElement.textContent;
                obj.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
            } catch (e) {}

            if (callback && callback.upload) {
                if (!callback.scope) {
                    callback.upload(obj);
                } else {
                    callback.upload.apply(callback.scope, [obj]);
                }
            }

            // Fire global custom event -- uploadEvent
            oConn.uploadEvent.fire(obj);

            if (o.uploadEvent) {
                // Fire transaction custom event -- uploadEvent
                o.uploadEvent.fire(obj);
            }

            pega.util.Event.removeListener(io, "load", uploadCallback);

            setTimeout(
                function() {
                    document.body.removeChild(io);
                    oConn.releaseObject(o);
                }, 100);
        };

        // Bind the onload handler to the iframe to detect the file upload response.
        pega.util.Event.addListener(io, "load", uploadCallback);
    },

    /**
     * @description Method to terminate a transaction, if it has not reached readyState 4.
     * @method abort
     * @public
     * @static
     * @param {object} o The connection object returned by asyncRequest.
     * @param {object} callback  User-defined callback object.
     * @param {string} isTimeout boolean to indicate if abort resulted from a callback timeout.
     * @return {boolean}
     */
    abort: function(o, callback, isTimeout) {
        var abortStatus;
        var args = (callback && callback.argument) ? callback.argument : null;


        if (o && o.conn) {
            if (this.isCallInProgress(o)) {
                // Issue abort request
                o.conn.abort();

				/*
                window.clearInterval(this._poll[o.tId]);
                delete this._poll[o.tId];

                if (isTimeout) {
                    window.clearTimeout(this._timeOut[o.tId]);
                    delete this._timeOut[o.tId];
                }
				*/

                abortStatus = true;
            }
        } else if (o && o.isUpload === true) {
            var frameId = 'yuiIO' + o.tId;
            var io = document.getElementById(frameId);

            if (io) {
                // Remove all listeners on the iframe prior to
                // its destruction.
                pega.util.Event.removeListener(io, "load");
                // Destroy the iframe facilitating the transaction.
                document.body.removeChild(io);

                if (isTimeout) {
                    window.clearTimeout(this._timeOut[o.tId]);
                    delete this._timeOut[o.tId];
                }

                abortStatus = true;
            }
        } else {
            abortStatus = false;
        }

        if (abortStatus === true) {
            // Fire global custom event -- abortEvent
            this.abortEvent.fire(o, args);

            if (o.abortEvent) {
                // Fire transaction custom event -- abortEvent
                o.abortEvent.fire(o, args);
            }

            this.handleTransactionResponse(o, callback, true);
        }

        return abortStatus;
    },

    /**
     * @description Determines if the transaction is still being processed.
     * @method isCallInProgress
     * @public
     * @static
     * @param {object} o The connection object returned by asyncRequest
     * @return {boolean}
     */
    isCallInProgress: function(o) {
        // if the XHR object assigned to the transaction has not been dereferenced,
        // then check its readyState status.  Otherwise, return false.
        if (o && o.conn) {
            return o.conn.readyState !== 4 && o.conn.readyState !== 0;
        } else if (o && o.isUpload === true) {
            var frameId = 'yuiIO' + o.tId;
            return document.getElementById(frameId) ? true : false;
        } else {
            return false;
        }
    },

    /**
     * @description Dereference the XHR instance and the connection object after the transaction is completed.
     * @method releaseObject
     * @private
     * @static
     * @param {object} o The connection object
     * @return {void}
     */
    releaseObject: function(o) {
        if (o && o.conn) {
            //dereference the XHR instance.
            o.conn = null;


            //dereference the connection object.
            o = null;
        }
    }
};

pega.register("connection", pega.util.Connect, {
    version: "2.5.1",
    build: "984"
});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
(function() {

var Y = pega.util;

/*
Copyright (c) 2006, pega! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.pega.net/yui/license.txt
*/

/**
 * The animation module provides allows effects to be added to HTMLElements.
 * @module animation
 * @requires pega, event, dom
 */

/**
 *
 * Base animation class that provides the interface for building animated effects.
 * <p>Usage: var myAnim = new pega.util.Anim(el, { width: { from: 10, to: 100 } }, 1, pega.util.Easing.easeOut);</p>
 * @class Anim
 * @namespace pega.util
 * @requires pega.util.AnimMgr
 * @requires pega.util.Easing
 * @requires pega.util.Dom
 * @requires pega.util.Event
 * @requires pega.util.CustomEvent
 * @constructor
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to pega.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a pega.util.Easing method)
 */

var Anim = function(el, attributes, duration, method) {
    if (!el) {
    }
    this.init(el, attributes, duration, method); 
};

Anim.NAME = 'Anim';

Anim.prototype = {
    /**
     * Provides a readable name for the Anim instance.
     * @method toString
     * @return {String}
     */
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.constructor.NAME + ': ' + id);
    },
    
    patterns: { // cached for performance
        noNegatives:        /width|height|opacity|padding/i, // keep at zero or above
        offsetAttribute:  /^((width|height)|(top|left))$/, // use offsetValue as default
        defaultUnit:        /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
        offsetUnit:         /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
    },
    
    /**
     * Returns the value computed by the animation's "method".
     * @method doMethod
     * @param {String} attr The name of the attribute.
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    
    /**
     * Applies a value to an attribute.
     * @method setAttribute
     * @param {String} attr The name of the attribute.
     * @param {Number} val The value to be applied to the attribute.
     * @param {String} unit The unit ('px', '%', etc.) of the value.
     */
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }

        Y.Dom.setStyle(this.getEl(), attr, val + unit);
    },                        
    
    /**
     * Returns current value of the attribute.
     * @method getAttribute
     * @param {String} attr The name of the attribute.
     * @return {Number} val The current value of the attribute.
     */
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Y.Dom.getStyle(el, attr);

        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); // top or left
        var box = !!( a[2] ); // width or height
        
        // use offsets for width/height and abs pos top/left
        if ( box || (Y.Dom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { // default to zero for other 'auto'
            val = 0;
        }

        return val;
    },
    
    /**
     * Returns the unit to use when none is supplied.
     * @method getDefaultUnit
     * @param {attr} attr The name of the attribute.
     * @return {String} The default unit to be used.
     */
    getDefaultUnit: function(attr) {
         if ( this.patterns.defaultUnit.test(attr) ) {
            return 'px';
         }
         
         return '';
    },
        
    /**
     * Sets the actual values to be used during the animation.  Should only be needed for subclass use.
     * @method setRuntimeAttribute
     * @param {Object} attr The attribute object
     * @private 
     */
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;

        this.runtimeAttributes[attr] = {};
        
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; // note return; nothing to animate to
        }
        
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

        // To beats by, per SMIL 2.1 spec
        if ( isset(attributes[attr]['to']) ) {
            end = attributes[attr]['to'];
        } else if ( isset(attributes[attr]['by']) ) {
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; // times 1 to cast "by" 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;

        // set units if needed
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ?
                attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },

    /**
     * Constructor for Anim instance.
     * @method init
     * @param {String | HTMLElement} el Reference to the element that will be animated
     * @param {Object} attributes The attribute(s) to be animated.  
     * Each attribute is an object with at minimum a "to" or "by" member defined.  
     * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
     * All attribute names use camelCase.
     * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
     * @param {Function} method (optional, defaults to pega.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a pega.util.Easing method)
     */ 
    init: function(el, attributes, duration, method) {
        /**
         * Whether or not the animation is running.
         * @property isAnimated
         * @private
         * @type Boolean
         */
        var isAnimated = false;
        
        /**
         * A Date object that is created when the animation begins.
         * @property startTime
         * @private
         * @type Date
         */
        var startTime = null;
        
        /**
         * The number of frames this animation was able to execute.
         * @property actualFrames
         * @private
         * @type Int
         */
        var actualFrames = 0; 

        /**
         * The element to be animated.
         * @property el
         * @private
         * @type HTMLElement
         */
        el = Y.Dom.get(el);
        
        /**
         * The collection of attributes to be animated.  
         * Each attribute must have at least a "to" or "by" defined in order to animate.  
         * If "to" is supplied, the animation will end with the attribute at that value.  
         * If "by" is supplied, the animation will end at that value plus its starting value. 
         * If both are supplied, "to" is used, and "by" is ignored. 
         * Optional additional member include "from" (the value the attribute should start animating from, defaults to current value), and "unit" (the units to apply to the values).
         * @property attributes
         * @type Object
         */
        this.attributes = attributes || {};
        
        /**
         * The length of the animation.  Defaults to "1" (second).
         * @property duration
         * @type Number
         */
        this.duration = !pega.lang.isUndefined(duration) ? duration : 1;
        
        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "pega.util.Easing.easeNone".
         * @property method
         * @type Function
         */
        this.method = method || Y.Easing.easeNone;

        /**
         * Whether or not the duration should be treated as seconds.
         * Defaults to true.
         * @property useSeconds
         * @type Boolean
         */
        this.useSeconds = true; // default to seconds
        
        /**
         * The location of the current animation on the timeline.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property currentFrame
         * @type Int
         */
        this.currentFrame = 0;
        
        /**
         * The total number of frames to be executed.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property totalFrames
         * @type Int
         */
        this.totalFrames = Y.AnimMgr.fps;
        
        /**
         * Changes the animated element
         * @method setEl
         */
        this.setEl = function(element) {
            el = Y.Dom.get(element);
        };
        
        /**
         * Returns a reference to the animated element.
         * @method getEl
         * @return {HTMLElement}
         */
        this.getEl = function() { return el; };
        
        /**
         * Checks whether the element is currently animated.
         * @method isAnimated
         * @return {Boolean} current value of isAnimated.     
         */
        this.isAnimated = function() {
            return isAnimated;
        };
        
        /**
         * Returns the animation start time.
         * @method getStartTime
         * @return {Date} current value of startTime.      
         */
        this.getStartTime = function() {
            return startTime;
        };        
        
        this.runtimeAttributes = {};
        
        
        
        /**
         * Starts the animation by registering it with the animation manager. 
         * @method animate  
         */
        this.animate = function() {
            if ( this.isAnimated() ) {
                return false;
            }
            
            this.currentFrame = 0;
            
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Y.AnimMgr.fps * this.duration) : this.duration;
    
            if (this.duration === 0 && this.useSeconds) { // jump to last frame if zero second duration 
                this.totalFrames = 1; 
            }
            Y.AnimMgr.registerElement(this);
            return true;
        };
          
        /**
         * Stops the animation.  Normally called by AnimMgr when animation completes.
         * @method stop
         * @param {Boolean} finish (optional) If true, animation will jump to final frame.
         */ 
        this.stop = function(finish) {
            if (!this.isAnimated()) { // nothing to stop
                return false;
            }

            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this._onTween.fire();
            }
            Y.AnimMgr.stop(this);
        };
        
        var onStart = function() {            
            this.onStart.fire();
            
            this.runtimeAttributes = {};
            for (var attr in this.attributes) {
                this.setRuntimeAttribute(attr);
            }
            
            isAnimated = true;
            actualFrames = 0;
            startTime = new Date(); 
        };
        
        /**
         * Feeds the starting and ending values for each animated attribute to doMethod once per frame, then applies the resulting value to the attribute(s).
         * @private
         */
         
        var onTween = function() {
            var data = {
                duration: new Date() - this.getStartTime(),
                currentFrame: this.currentFrame
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', currentFrame: ' + data.currentFrame
                );
            };
            
            this.onTween.fire(data);
            
            var runtimeAttributes = this.runtimeAttributes;
            
            for (var attr in runtimeAttributes) {
                this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
            }
            
            actualFrames += 1;
        };
        
        var onComplete = function() {
            var actual_duration = (new Date() - startTime) / 1000 ;
            
            var data = {
                duration: actual_duration,
                frames: actualFrames,
                fps: actualFrames / actual_duration
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', frames: ' + data.frames +
                    ', fps: ' + data.fps
                );
            };
            
            isAnimated = false;
            actualFrames = 0;
            this.onComplete.fire(data);
        };
        
        /**
         * Custom event that fires after onStart, useful in subclassing
         * @private
         */    
        this._onStart = new Y.CustomEvent('_start', this, true);

        /**
         * Custom event that fires when animation begins
         * Listen via subscribe method (e.g. myAnim.onStart.subscribe(someFunction)
         * @event onStart
         */    
        this.onStart = new Y.CustomEvent('start', this);
        
        /**
         * Custom event that fires between each frame
         * Listen via subscribe method (e.g. myAnim.onTween.subscribe(someFunction)
         * @event onTween
         */
        this.onTween = new Y.CustomEvent('tween', this);
        
        /**
         * Custom event that fires after onTween
         * @private
         */
        this._onTween = new Y.CustomEvent('_tween', this, true);
        
        /**
         * Custom event that fires when animation ends
         * Listen via subscribe method (e.g. myAnim.onComplete.subscribe(someFunction)
         * @event onComplete
         */
        this.onComplete = new Y.CustomEvent('complete', this);
        /**
         * Custom event that fires after onComplete
         * @private
         */
        this._onComplete = new Y.CustomEvent('_complete', this, true);

        this._onStart.subscribe(onStart);
        this._onTween.subscribe(onTween);
        this._onComplete.subscribe(onComplete);
    }
};

    Y.Anim = Anim;
})();
/**
 * Handles animation queueing and threading.
 * Used by Anim and subclasses.
 * @class AnimMgr
 * @namespace pega.util
 */
pega.util.AnimMgr = new function() {
    /** 
     * Reference to the animation Interval.
     * @property thread
     * @private
     * @type Int
     */
    var thread = null;
    
    /** 
     * The current queue of registered animation objects.
     * @property queue
     * @private
     * @type Array
     */    
    var queue = [];

    /** 
     * The number of active animations.
     * @property tweenCount
     * @private
     * @type Int
     */        
    var tweenCount = 0;

    /** 
     * Base frame rate (frames per second). 
     * Arbitrarily high for better x-browser calibration (slower browsers drop more frames).
     * @property fps
     * @type Int
     * 
     */
    this.fps = 1000;

    /** 
     * Interval delay in milliseconds, defaults to fastest possible.
     * @property delay
     * @type Int
     * 
     */
    this.delay = 1;

    /**
     * Adds an animation instance to the animation queue.
     * All animation instances must be registered in order to animate.
     * @method registerElement
     * @param {object} tween The Anim instance to be be registered
     */
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween._onStart.fire();
        this.start();
    };
    
    /**
     * removes an animation instance from the animation queue.
     * All animation instances must be registered in order to animate.
     * @method unRegister
     * @param {object} tween The Anim instance to be be registered
     * @param {Int} index The index of the Anim instance
     * @private
     */
    this.unRegister = function(tween, index) {
        index = index || getIndex(tween);
        if (!tween.isAnimated() || index == -1) {
            return false;
        }
        
        tween._onComplete.fire();
        queue.splice(index, 1);

        tweenCount -= 1;
        if (tweenCount <= 0) {
            this.stop();
        }

        return true;
    };
    
    /**
     * Starts the animation thread.
	* Only one thread can run at a time.
     * @method start
     */    
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };

    /**
     * Stops the animation thread or a specific animation instance.
     * @method stop
     * @param {object} tween A specific Anim instance to stop (optional)
     * If no instance given, Manager stops thread and all animations.
     */    
    this.stop = function(tween) {
        if (!tween) {
            clearInterval(thread);
            
            for (var i = 0, len = queue.length; i < len; ++i) {
                this.unRegister(queue[0], 0);  
            }

            queue = [];
            thread = null;
            tweenCount = 0;
        }
        else {
            this.unRegister(tween);
        }
    };
    
    /**
     * Called per Interval to handle each animation frame.
     * @method run
     */    
    this.run = function() {
        for (var i = 0, len = queue.length; i < len; ++i) {
            var tween = queue[i];
            if ( !tween || !tween.isAnimated() ) { continue; }

            if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null)
            {
                tween.currentFrame += 1;
                
                if (tween.useSeconds) {
                    correctFrame(tween);
                }
                tween._onTween.fire();          
            }
            else { pega.util.AnimMgr.stop(tween, i); }
        }
    };
    
    var getIndex = function(anim) {
        for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i] == anim) {
                return i; // note return;
            }
        }
        return -1;
    };
    
    /**
     * On the fly frame correction to keep animation on time.
     * @method correctFrame
     * @private
     * @param {Object} tween The Anim instance being corrected.
     */
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        
        if (elapsed < tween.duration * 1000) { // check if falling behind
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { // went over duration, so jump to end
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { // adjust if needed
            if (tween.currentFrame + tweak >= frames) {// dont go past last frame
                tweak = frames - (frame + 1);
            }
            
            tween.currentFrame += tweak;      
        }
    };
};
/**
 * Used to calculate Bezier splines for any number of control points.
 * @class Bezier
 * @namespace pega.util
 *
 */
pega.util.Bezier = new function() {
    /**
     * Get the current position of the animated element based on t.
     * Each point is an array of "x" and "y" values (0 = x, 1 = y)
     * At least 2 points are required (start and end).
     * First point is start. Last point is end.
     * Additional control points are optional.     
     * @method getPosition
     * @param {Array} points An array containing Bezier points
     * @param {Number} t A number between 0 and 1 which is the basis for determining current position
     * @return {Array} An array containing int x and y member data
     */
    this.getPosition = function(points, t) {  
        var n = points.length;
        var tmp = [];

        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
    
        return [ tmp[0][0], tmp[0][1] ]; 
    
    };
};
(function() {
/**
 * Anim subclass for color transitions.
 * <p>Usage: <code>var myAnim = new Y.ColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, Y.Easing.easeOut);</code> Color values can be specified with either 112233, #112233, 
 * [255,255,255], or rgb(255,255,255)</p>
 * @class ColorAnim
 * @namespace pega.util
 * @requires pega.util.Anim
 * @requires pega.util.AnimMgr
 * @requires pega.util.Easing
 * @requires pega.util.Bezier
 * @requires pega.util.Dom
 * @requires pega.util.Event
 * @constructor
 * @extends pega.util.Anim
 * @param {HTMLElement | String} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.
 * Each attribute is an object with at minimum a "to" or "by" member defined.
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to pega.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a pega.util.Easing method)
 */
    var ColorAnim = function(el, attributes, duration,  method) {
        ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };
    
    ColorAnim.NAME = 'ColorAnim';

    // shorthand
    var Y = pega.util;
    pega.extend(ColorAnim, Y.Anim);

    var superclass = ColorAnim.superclass;
    var proto = ColorAnim.prototype;
    
    proto.patterns.color = /color$/i;
    proto.patterns.rgb            = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    proto.patterns.hex            = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    proto.patterns.hex3          = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    proto.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; // need rgba for safari
    
    /**
     * Attempts to parse the given string and return a 3-tuple.
     * @method parseColor
     * @param {String} s The string to parse.
     * @return {Array} The 3-tuple of rgb values.
     */
    proto.parseColor = function(s) {
        if (s.length == 3) { return s; }
    
        var c = this.patterns.hex.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
        }
    
        c = this.patterns.rgb.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
        }
    
        c = this.patterns.hex3.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
        }
        
        return null;
    };

    proto.getAttribute = function(attr) {
        var el = this.getEl();
        if (  this.patterns.color.test(attr) ) {
            var val = pega.util.Dom.getStyle(el, attr);
            
            if (this.patterns.transparent.test(val)) { // bgcolor default
                var parent = el.parentNode; // try and get from an ancestor
                val = Y.Dom.getStyle(parent, attr);
            
                while (parent && this.patterns.transparent.test(val)) {
                    parent = parent.parentNode;
                    val = Y.Dom.getStyle(parent, attr);
                    if (parent.tagName.toUpperCase() == 'HTML') {
                        val = '#fff';
                    }
                }
            }
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };
    
    proto.doMethod = function(attr, start, end) {
        var val;
    
        if ( this.patterns.color.test(attr) ) {
            val = [];
            for (var i = 0, len = start.length; i < len; ++i) {
                val[i] = superclass.doMethod.call(this, attr, start[i], end[i]);
            }
            
            val = 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';
        }
        else {
            val = superclass.doMethod.call(this, attr, start, end);
        }

        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        superclass.setRuntimeAttribute.call(this, attr);
        
        if ( this.patterns.color.test(attr) ) {
            var attributes = this.attributes;
            var start = this.parseColor(this.runtimeAttributes[attr].start);
            var end = this.parseColor(this.runtimeAttributes[attr].end);
            // fix colors if going "by"
            if ( typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined' ) {
                end = this.parseColor(attributes[attr].by);
            
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + end[i];
                }
            }
            
            this.runtimeAttributes[attr].start = start;
            this.runtimeAttributes[attr].end = end;
        }
    };

    Y.ColorAnim = ColorAnim;
})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Singleton that determines how an animation proceeds from start to end.
 * @class Easing
 * @namespace pega.util
*/

pega.util.Easing = {

    /**
     * Uniform speed between points.
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
    	return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quadratic)
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
    	return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
    	return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quadratic)
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
    	return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quartic)
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
    	return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quartic)
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        
    	return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        
        if (!p) {
            p = d*(.3*1.5);
        }
        
    	if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
    	return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        
    	if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
    	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
    	return c - pega.util.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
    	if ((t/=d) < (1/2.75)) {
    		return c*(7.5625*t*t) + b;
    	} else if (t < (2/2.75)) {
    		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    	} else if (t < (2.5/2.75)) {
    		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    	}
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
    	if (t < d/2) {
            return pega.util.Easing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
    	return pega.util.Easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};

(function() {
/**
 * Anim subclass for moving elements along a path defined by the "points" 
 * member of "attributes".  All "points" are arrays with x, y coordinates.
 * <p>Usage: <code>var myAnim = new pega.util.Motion(el, { points: { to: [800, 800] } }, 1, pega.util.Easing.easeOut);</code></p>
 * @class Motion
 * @namespace pega.util
 * @requires pega.util.Anim
 * @requires pega.util.AnimMgr
 * @requires pega.util.Easing
 * @requires pega.util.Bezier
 * @requires pega.util.Dom
 * @requires pega.util.Event
 * @requires pega.util.CustomEvent 
 * @constructor
 * @extends pega.util.ColorAnim
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to pega.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a pega.util.Easing method)
 */
    var Motion = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using pega.extend
            Motion.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };


    Motion.NAME = 'Motion';

    // shorthand
    var Y = pega.util;
    pega.extend(Motion, Y.ColorAnim);
    
    var superclass = Motion.superclass;
    var proto = Motion.prototype;

    proto.patterns.points = /^points$/i;
    
    proto.setAttribute = function(attr, val, unit) {
        if (  this.patterns.points.test(attr) ) {
            unit = unit || 'px';
            superclass.setAttribute.call(this, 'left', val[0], unit);
            superclass.setAttribute.call(this, 'top', val[1], unit);
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };

    proto.getAttribute = function(attr) {
        if (  this.patterns.points.test(attr) ) {
            var val = [
                superclass.getAttribute.call(this, 'left'),
                superclass.getAttribute.call(this, 'top')
            ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };

    proto.doMethod = function(attr, start, end) {
        var val = null;

        if ( this.patterns.points.test(attr) ) {
            var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;				
            val = Y.Bezier.getPosition(this.runtimeAttributes[attr], t);
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            
            if (control.length > 0 && !(control[0] instanceof Array) ) { // could be single point or array of points
                control = [control];
            } else { // break reference to attributes.points.control
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }

            if (Y.Dom.getStyle(el, 'position') == 'static') { // default to relative
                Y.Dom.setStyle(el, 'position', 'relative');
            }
    
            if ( isset(attributes['points']['from']) ) {
                Y.Dom.setXY(el, attributes['points']['from']); // set position to from point
            } 
            else { Y.Dom.setXY( el, Y.Dom.getXY(el) ); } // set it to current position
            
            start = this.getAttribute('points'); // get actual top & left
            
            // TO beats BY, per SMIL 2.1 spec
            if ( isset(attributes['points']['to']) ) {
                end = translateValues.call(this, attributes['points']['to'], start);
                
                var pageXY = Y.Dom.getXY(this.getEl());
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = translateValues.call(this, control[i], start);
                }

                
            } else if ( isset(attributes['points']['by']) ) {
                end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];
                
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                }
            }

            this.runtimeAttributes[attr] = [start];
            
            if (control.length > 0) {
                this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control); 
            }

            this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
        }
        else {
            superclass.setRuntimeAttribute.call(this, attr);
        }
    };
    
    var translateValues = function(val, start) {
        var pageXY = Y.Dom.getXY(this.getEl());
        val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];

        return val; 
    };
    
    var isset = function(prop) {
        return (typeof prop !== 'undefined');
    };

    Y.Motion = Motion;
})();
(function() {
/**
 * Anim subclass for scrolling elements to a position defined by the "scroll"
 * member of "attributes".  All "scroll" members are arrays with x, y scroll positions.
 * <p>Usage: <code>var myAnim = new pega.util.Scroll(el, { scroll: { to: [0, 800] } }, 1, pega.util.Easing.easeOut);</code></p>
 * @class Scroll
 * @namespace pega.util
 * @requires pega.util.Anim
 * @requires pega.util.AnimMgr
 * @requires pega.util.Easing
 * @requires pega.util.Bezier
 * @requires pega.util.Dom
 * @requires pega.util.Event
 * @requires pega.util.CustomEvent 
 * @extends pega.util.ColorAnim
 * @constructor
 * @param {String or HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to pega.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a pega.util.Easing method)
 */
    var Scroll = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using pega.extend
            Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Scroll.NAME = 'Scroll';

    // shorthand
    var Y = pega.util;
    pega.extend(Scroll, Y.ColorAnim);
    
    var superclass = Scroll.superclass;
    var proto = Scroll.prototype;

    proto.doMethod = function(attr, start, end) {
        var val = null;
    
        if (attr == 'scroll') {
            val = [
                this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
                this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
            ];
            
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.getAttribute = function(attr) {
        var val = null;
        var el = this.getEl();
        
        if (attr == 'scroll') {
            val = [ el.scrollLeft, el.scrollTop ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }
        
        return val;
    };

    proto.setAttribute = function(attr, val, unit) {
        var el = this.getEl();
        
        if (attr == 'scroll') {
            el.scrollLeft = val[0];
            el.scrollTop = val[1];
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };

    Y.Scroll = Scroll;
})();
pega.register("animation", pega.util.Anim, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
/**
 * The drag and drop utility provides a framework for building drag and drop
 * applications.  In addition to enabling drag and drop for specific elements,
 * the drag and drop elements are tracked by the manager class, and the
 * interactions between the various elements are tracked during the drag and
 * the implementing code is notified about these important moments.
 * @module dragdrop
 * @title Drag and Drop
 * @requires pega,dom,event
 * @namespace pega.util
 */

// Only load the library once.  Rewriting the manager class would orphan
// existing drag and drop instances.
if (!pega.util.DragDropMgr) {

/**
 * DragDropMgr is a singleton that tracks the element interaction for
 * all DragDrop items in the window.  Generally, you will not call
 * this class directly, but it does have helper methods that could
 * be useful in your DragDrop implementations.
 * @class DragDropMgr
 * @static
 */
pega.util.DragDropMgr = function() {

    var Event = pega.util.Event;

    return {
        /**
         * Two dimensional Array of registered DragDrop objects.  The first
         * dimension is the DragDrop item group, the second the DragDrop
         * object.
         * @property ids
         * @type {string: string}
         * @private
         * @static
         */
        ids: {},

        /**
         * Array of element ids defined as drag handles.  Used to determine
         * if the element that generated the mousedown event is actually the
         * handle and not the html element itself.
         * @property handleIds
         * @type {string: string}
         * @private
         * @static
         */
        handleIds: {},

        /**
         * the DragDrop object that is currently being dragged
         * @property dragCurrent
         * @type DragDrop
         * @private
         * @static
         **/
        dragCurrent: null,

        /**
         * the DragDrop object(s) that are being hovered over
         * @property dragOvers
         * @type Array
         * @private
         * @static
         */
        dragOvers: {},

        /**
         * the X distance between the cursor and the object being dragged
         * @property deltaX
         * @type int
         * @private
         * @static
         */
        deltaX: 0,

        /**
         * the Y distance between the cursor and the object being dragged
         * @property deltaY
         * @type int
         * @private
         * @static
         */
        deltaY: 0,

        /**
         * Flag to determine if we should prevent the default behavior of the
         * events we define. By default this is true, but this can be set to
         * false if you need the default behavior (not recommended)
         * @property preventDefault
         * @type boolean
         * @static
         */
        preventDefault: true,

        /**
         * Flag to determine if we should stop the propagation of the events
         * we generate. This is true by default but you may want to set it to
         * false if the html element contains other features that require the
         * mouse click.
         * @property stopPropagation
         * @type boolean
         * @static
         */
        stopPropagation: true,

        /**
         * Internal flag that is set to true when drag and drop has been
         * initialized
         * @property initialized
         * @private
         * @static
         */
        initialized: false,

        /**
         * All drag and drop can be disabled.
         * @property locked
         * @private
         * @static
         */
        locked: false,

        /**
         * Provides additional information about the the current set of
         * interactions.  Can be accessed from the event handlers. It
         * contains the following properties:
         *
         *       out:       onDragOut interactions
         *       enter:     onDragEnter interactions
         *       over:      onDragOver interactions
         *       drop:      onDragDrop interactions
         *       point:     The location of the cursor
         *       draggedRegion: The location of dragged element at the time
         *                      of the interaction
         *       sourceRegion: The location of the source elemtn at the time
         *                     of the interaction
         *       validDrop: boolean
         * @property interactionInfo
         * @type object
         * @static
         */
        interactionInfo: null,

        /**
         * Called the first time an element is registered.
         * @method init
         * @private
         * @static
         */
        init: function() {
            this.initialized = true;
        },

        /**
         * In point mode, drag and drop interaction is defined by the
         * location of the cursor during the drag/drop
         * @property POINT
         * @type int
         * @static
         * @final
         */
        POINT: 0,

        /**
         * In intersect mode, drag and drop interaction is defined by the
         * cursor position or the amount of overlap of two or more drag and
         * drop objects.
         * @property INTERSECT
         * @type int
         * @static
         * @final
         */
        INTERSECT: 1,

        /**
         * In intersect mode, drag and drop interaction is defined only by the
         * overlap of two or more drag and drop objects.
         * @property STRICT_INTERSECT
         * @type int
         * @static
         * @final
         */
        STRICT_INTERSECT: 2,

        /**
         * The current drag and drop mode.  Default: POINT
         * @property mode
         * @type int
         * @static
         */
        mode: 0,

        /**
         * Runs method on all drag and drop objects
         * @method _execOnAll
         * @private
         * @static
         */
        _execOnAll: function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },

        /**
         * Drag and drop initialization.  Sets up the global event handlers
         * @method _onLoad
         * @private
         * @static
         */
        _onLoad: function() {

            this.init();


            Event.on(document, "mouseup",   this.handleMouseUp, this, true);
            Event.on(document, "mousemove", this.handleMouseMove, this, true);
            Event.on(window,   "unload",    this._onUnload, this, true);
            Event.on(window,   "resize",    this._onResize, this, true);
            // Event.on(window,   "mouseout",    this._test);

        },

        /**
         * Reset constraints on all drag and drop objs
         * @method _onResize
         * @private
         * @static
         */
        _onResize: function(e) {
            this._execOnAll("resetConstraints", []);
        },

        /**
         * Lock all drag and drop functionality
         * @method lock
         * @static
         */
        lock: function() { this.locked = true; },

        /**
         * Unlock all drag and drop functionality
         * @method unlock
         * @static
         */
        unlock: function() { this.locked = false; },

        /**
         * Is drag and drop locked?
         * @method isLocked
         * @return {boolean} True if drag and drop is locked, false otherwise.
         * @static
         */
        isLocked: function() { return this.locked; },

        /**
         * Location cache that is set for all drag drop objects when a drag is
         * initiated, cleared when the drag is finished.
         * @property locationCache
         * @private
         * @static
         */
        locationCache: {},

        /**
         * Set useCache to false if you want to force object the lookup of each
         * drag and drop linked element constantly during a drag.
         * @property useCache
         * @type boolean
         * @static
         */
        useCache: true,

        /**
         * The number of pixels that the mouse needs to move after the
         * mousedown before the drag is initiated.  Default=3;
         * @property clickPixelThresh
         * @type int
         * @static
         */
        clickPixelThresh: 3,

        /**
         * The number of milliseconds after the mousedown event to initiate the
         * drag if we don't get a mouseup event. Default=1000
         * @property clickTimeThresh
         * @type int
         * @static
         */
        clickTimeThresh: 1000,

        /**
         * Flag that indicates that either the drag pixel threshold or the
         * mousdown time threshold has been met
         * @property dragThreshMet
         * @type boolean
         * @private
         * @static
         */
        dragThreshMet: false,

        /**
         * Timeout used for the click time threshold
         * @property clickTimeout
         * @type Object
         * @private
         * @static
         */
        clickTimeout: null,

        /**
         * The X position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @property startX
         * @type int
         * @private
         * @static
         */
        startX: 0,

        /**
         * The Y position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @property startY
         * @type int
         * @private
         * @static
         */
        startY: 0,

        /**
         * Flag to determine if the drag event was fired from the click timeout and
         * not the mouse move threshold.
         * @property fromTimeout
         * @type boolean
         * @private
         * @static
         */
        fromTimeout: false,

        _shimActive : false,
		_shimState : false,
		_shim : null,


		_createShim :  function() {
			var s = document.createElement('div');
			s.id = 'yui-ddm-shim';
			if (document.body.firstChild) {
				document.body.insertBefore(s, document.body.firstChild);
			} else {
				document.body.appendChild(s);
			}
			s.style.display = 'none';
			s.style.backgroundColor = 'red';
			s.style.position = 'absolute';
			s.style.zIndex = '99999';
			Dom.setStyle(s, 'opacity', '0');
			this._shim = s;
			Event.on(s, "mouseup",   this.handleMouseUp, this, true);
			Event.on(s, "mousemove", this.handleMouseMove, this, true);
			Event.on(window, 'scroll', this._sizeShim, this, true);
		},
		_sizeShim : function() {
			if (this._shimActive) {
				var s = this._shim;
				s.style.height = Dom.getDocumentHeight() + 'px';
				s.style.width = Dom.getDocumentWidth() + 'px';
				s.style.top = '0';
				s.style.left = '0';
			}
		},
		_activateShim : function() {
			if (this.useShim) {
				if (!this._shim) {
					this._createShim();
				}
				this._shimActive = true;
				var s = this._shim,
					o = '0';
				if (this._debugShim) {
					o = '.5';
				}
				Dom.setStyle(s, 'opacity', o);
				this._sizeShim();
				s.style.display = 'block';
			}
		},
		_deactivateShim :  function() {
			this._shim.style.display = 'none';
			this._shimActive = false;
		},

        /**
         * Each DragDrop instance must be registered with the DragDropMgr.
         * This is executed in DragDrop.init()
         * @method regDragDrop
         * @param {DragDrop} oDD the DragDrop object to register
         * @param {String} sGroup the name of the group this element belongs to
         * @static
         */
        regDragDrop: function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }

            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        },

        /**
         * Removes the supplied dd instance from the supplied group. Executed
         * by DragDrop.removeFromGroup, so don't call this function directly.
         * @method removeDDFromGroup
         * @private
         * @static
         */
        removeDDFromGroup: function(oDD, sGroup) {
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }

            var obj = this.ids[sGroup];
            if (obj && obj[oDD.id]) {
                delete obj[oDD.id];
            }
        },

        /**
         * Unregisters a drag and drop item.  This is executed in
         * DragDrop.unreg, use that method instead of calling this directly.
         * @method _remove
         * @private
         * @static
         */
        _remove: function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        },

        /**
         * Each DragDrop handle element must be registered.  This is done
         * automatically when executing DragDrop.setHandleElId()
         * @method regHandle
         * @param {String} sDDId the DragDrop id this element is a handle for
         * @param {String} sHandleId the id of the element that is the drag
         * handle
         * @static
         */
        regHandle: function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop item.
         * @method isDragDrop
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop item,
         * false otherwise
         * @static
         */
        isDragDrop: function(id) {
            return ( this.getDDById(id) ) ? true : false;
        },

        /**
         * Returns the drag and drop instances that are in all groups the
         * passed in instance belongs to.
         * @method getRelated
         * @param {DragDrop} p_oDD the obj to get related data for
         * @param {boolean} bTargetsOnly if true, only return targetable objs
         * @return {DragDrop[]} the related instances
         * @static
         */
        getRelated: function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (var j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        },

        /**
         * Returns true if the specified dd target is a legal target for
         * the specifice drag obj
         * @method isLegalTarget
         * @param {DragDrop} the drag obj
         * @param {DragDrop} the target
         * @return {boolean} true if the target is a legal target for the
         * dd obj
         * @static
         */
        isLegalTarget: function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        },

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof DragDrop, and the exact subclass of DragDrop.  typeof
         * returns "object", oDD.constructor.toString() always returns
         * "DragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in DragDrop.
         * @method isTypeOfDD
         * @param {Object} the object to evaluate
         * @return {boolean} true if typeof oDD = DragDrop
         * @static
         */
        isTypeOfDD: function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        },

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop handle for the given Drag Drop object.
         * @method isHandle
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop handle, false
         * otherwise
         * @static
         */
        isHandle: function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] &&
                            this.handleIds[sDDId][sHandleId] );
        },

        /**
         * Returns the DragDrop instance for a given id
         * @method getDDById
         * @param {String} id the id of the DragDrop object
         * @return {DragDrop} the drag drop object, null if it is not found
         * @static
         */
        getDDById: function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        },

        /**
         * Fired after a registered DragDrop object gets the mousedown event.
         * Sets up the events required to track the object being dragged
         * @method handleMouseDown
         * @param {Event} e the event
         * @param oDD the DragDrop object being dragged
         * @private
         * @static
         */
        handleMouseDown: function(e, oDD) {

            this.currentTarget = pega.util.Event.getTarget(e);

            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = pega.util.Event.getPageX(e);
            this.startY = pega.util.Event.getPageY(e);

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout(
                    function() {
                        var DDM = pega.util.DDM;
                        DDM.startDrag(DDM.startX, DDM.startY);
                        DDM.fromTimeout = true;
                    },
                    this.clickTimeThresh );
        },

        /**
         * Fired when either the drag pixel threshol or the mousedown hold
         * time threshold has been met.
         * @method startDrag
         * @param x {int} the X position of the original mousedown
         * @param y {int} the Y position of the original mousedown
         * @static
         */
        startDrag: function(x, y) {
        	if (this.dragCurrent && this.dragCurrent.useShim) {
					this._shimState = this.useShim;
					this.useShim = true;
			}
			this._activateShim();
            clearTimeout(this.clickTimeout);
            var dc = this.dragCurrent;
            if (dc && dc.events.b4StartDrag) {
                dc.b4StartDrag(x, y);
                dc.fireEvent('b4StartDragEvent', { x: x, y: y });
            }
            if (dc && dc.events.startDrag) {
                dc.startDrag(x, y);
                dc.fireEvent('startDragEvent', { x: x, y: y });
            }
            this.dragThreshMet = true;
        },

        /**
         * Internal function to handle the mouseup event.  Will be invoked
         * from the context of the document.
         * @method handleMouseUp
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseUp: function(e) {
          if (this.dragCurrent){
            clearTimeout(this.clickTimeout);
	   		if (this.dragThreshMet) {
         		   if (this.fromTimeout) {
  	         	       this.fromTimeout = false;
         		       this.handleMouseMove(e);
            	   }
            	this.fromTimeout = false;
            	this.fireEvents(e, true);
        	}
            this.stopDrag(e);
            this.stopEvent(e);
		  }
        },

        /**
         * Utility to stop event propagation and event default, if these
         * features are turned on.
         * @method stopEvent
         * @param {Event} e the event as returned by this.getEvent()
         * @static
         */
        stopEvent: function(e) {
            if (this.stopPropagation) {
                pega.util.Event.stopPropagation(e);
            }

            if (this.preventDefault) {
                pega.util.Event.preventDefault(e);
            }
        },

        /**
         * Ends the current drag, cleans up the state, and fires the endDrag
         * and mouseUp events.  Called internally when a mouseup is detected
         * during the drag.  Can be fired manually during the drag by passing
         * either another event (such as the mousemove event received in onDrag)
         * or a fake event with pageX and pageY defined (so that endDrag and
         * onMouseUp have usable position data.).  Alternatively, pass true
         * for the silent parameter so that the endDrag and onMouseUp events
         * are skipped (so no event data is needed.)
         *
         * @method stopDrag
         * @param {Event} e the mouseup event, another event (or a fake event)
         *                  with pageX and pageY defined, or nothing if the
         *                  silent parameter is true
         * @param {boolean} silent skips the enddrag and mouseup events if true
         * @static
         */
        stopDrag: function(e, silent) {
            var dc = this.dragCurrent;
            // Fire the drag end event for the item that was dragged
            if (dc && !silent) {
                if (this.dragThreshMet) {
                    if (dc.events.b4EndDrag) {
                        dc.b4EndDrag(e);
                        dc.fireEvent('b4EndDragEvent', { e: e });
                    }
                    if (dc.events.endDrag) {
                        dc.endDrag(e);
                        dc.fireEvent('endDragEvent', { e: e });
                    }
                }
                if (dc.events.mouseUp) {
                    dc.onMouseUp(e);
                    dc.fireEvent('mouseUpEvent', { e: e });
                }
            }

			if (this._shimActive) {
					this._deactivateShim();
					if (this.dragCurrent && this.dragCurrent.useShim) {
						this.useShim = this._shimState;
						this._shimState = false;
					}
			}
            this.dragCurrent = null;
            this.dragOvers = {};
        },

        /**
         * Internal function to handle the mousemove event.  Will be invoked
         * from the context of the html element.
         *
         * @TODO figure out what we can do about mouse events lost when the
         * user drags objects beyond the window boundary.  Currently we can
         * detect this in internet explorer by verifying that the mouse is
         * down during the mousemove event.  Firefox doesn't give us the
         * button state on the mousemove event.
         * @method handleMouseMove
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseMove: function(e) {

            var dc = this.dragCurrent;
            if (dc) {

                // var button = e.which || e.button;

                // check for IE mouseup outside of page boundary
                // changed if condition from pega.util.Event.isIE to pega.env.ua.ie > 0 && pega.env.ua.ie < 9
                // http://yuilibrary.com/projects/yui2/ticket/2529136
                if ((pega.env.ua.ie > 0 && pega.env.ua.ie < 9)&& !e.button) {
                    this.stopEvent(e);
                    return this.handleMouseUp(e);
                } else {
                    if (e.clientX < 0 || e.clientY < 0) {
                        //This will stop the element from leaving the viewport in FF, Opera & Safari
                        //Not turned on yet
                        //this.stopEvent(e);
                        //return false;
                    }
                }

                if (!this.dragThreshMet) {
                    var diffX = Math.abs(this.startX - pega.util.Event.getPageX(e));
                    var diffY = Math.abs(this.startY - pega.util.Event.getPageY(e));
                    if (diffX > this.clickPixelThresh ||
                                diffY > this.clickPixelThresh) {
                        this.startDrag(this.startX, this.startY);
                    }
                }

                if (this.dragThreshMet) {
                    if (dc && dc.events.b4Drag) {
                        dc.b4Drag(e);
                        dc.fireEvent('b4DragEvent', { e: e});
                    }
                    if (dc && dc.events.drag) {
                        dc.onDrag(e);
                        dc.fireEvent('dragEvent', { e: e});
                    }
                    if (dc) {
                        this.fireEvents(e, false);
                    }
                }

                this.stopEvent(e);
            }
        },

        /**
         * Iterates over all of the DragDrop elements to find ones we are
         * hovering over or dropping on
         * @method fireEvents
         * @param {Event} e the event
         * @param {boolean} isDrop is this a drop op or a mouseover op?
         * @private
         * @static
         */
        fireEvents: function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could
            // get here even though we have ended the drag.
            // If the config option dragOnly is true, bail out and don't fire the events
            if (!dc || dc.isLocked() || dc.dragOnly) {
                return;
            }

            var x = pega.util.Event.getPageX(e),
                y = pega.util.Event.getPageY(e),
                pt = new pega.util.Point(x,y),
                pos = dc.getTargetCoord(pt.x, pt.y),
                el = dc.getDragEl(),
                events = ['out', 'over', 'drop', 'enter'],
                curRegion = new pega.util.Region( pos.y,
                                               pos.x + el.offsetWidth,
                                               pos.y + el.offsetHeight,
                                               pos.x ),

                oldOvers = [], // cache the previous dragOver array
                inGroupsObj  = {},
                inGroups  = [],
                data = {
                    outEvts: [],
                    overEvts: [],
                    dropEvts: [],
                    enterEvts: []
                };


            // Check to see if the object(s) we were hovering over is no longer
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }
                if (! this.isOverTarget(pt, ddo, this.mode, curRegion)) {
                    data.outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {

                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode, curRegion)) {
                            inGroupsObj[sGroup] = true;
                            // look for drop interactions
                            if (isDrop) {
                                data.dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    data.enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    data.overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            this.interactionInfo = {
                out:       data.outEvts,
                enter:     data.enterEvts,
                over:      data.overEvts,
                drop:      data.dropEvts,
                point:     pt,
                draggedRegion:    curRegion,
                sourceRegion: this.locationCache[dc.id],
                validDrop: isDrop
            };


            for (var inG in inGroupsObj) {
                inGroups.push(inG);
            }

            // notify about a drop that did not find a target
            if (isDrop && !data.dropEvts.length) {
                this.interactionInfo.validDrop = false;
                if (dc.events.invalidDrop) {
                    dc.onInvalidDrop(e);
                    dc.fireEvent('invalidDropEvent', { e: e });
                }
            }

            for (i = 0; i < events.length; i++) {
                var tmp = null;
                if (data[events[i] + 'Evts']) {
                    tmp = data[events[i] + 'Evts'];
                }
                if (tmp && tmp.length) {
                    var type = events[i].charAt(0).toUpperCase() + events[i].substr(1),
                        ev = 'onDrag' + type,
                        b4 = 'b4Drag' + type,
                        cev = 'drag' + type + 'Event',
                        check = 'drag' + type;

                    if (this.mode) {
                        if (dc.events[b4]) {
                            dc[b4](e, tmp, inGroups);
                            dc.fireEvent(b4 + 'Event', { event: e, info: tmp, group: inGroups });
                        }
                        if (dc.events[check]) {
                            dc[ev](e, tmp, inGroups);
                            dc.fireEvent(cev, { event: e, info: tmp, group: inGroups });
                        }
                    } else {
                        for (var b = 0, len = tmp.length; b < len; ++b) {
                            if (dc.events[b4]) {
                                dc[b4](e, tmp[b].id, inGroups[0]);
                                dc.fireEvent(b4 + 'Event', { event: e, info: tmp[b].id, group: inGroups[0] });
                            }
                            if (dc.events[check]) {
                                dc[ev](e, tmp[b].id, inGroups[0]);
                                dc.fireEvent(cev, { event: e, info: tmp[b].id, group: inGroups[0] });
                            }
                        }
                    }
                }
            }
        },

        /**
         * Helper function for getting the best match from the list of drag
         * and drop objects returned by the drag and drop events when we are
         * in INTERSECT mode.  It returns either the first object that the
         * cursor is over, or the object that has the greatest overlap with
         * the dragged element.
         * @method getBestMatch
         * @param  {DragDrop[]} dds The array of drag and drop objects
         * targeted
         * @return {DragDrop}       The best single match
         * @static
         */
        getBestMatch: function(dds) {
            var winner = null;

            var len = dds.length;

            if (len == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<len; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (this.mode == this.INTERSECT && dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner || !winner.overlap || (dd.overlap &&
                            winner.overlap.getArea() < dd.overlap.getArea())) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        },

        /**
         * Refreshes the cache of the top-left and bottom-right points of the
         * drag and drop objects in the specified group(s).  This is in the
         * format that is stored in the drag and drop instance, so typical
         * usage is:
         * <code>
         * pega.util.DragDropMgr.refreshCache(ddinstance.groups);
         * </code>
         * Alternatively:
         * <code>
         * pega.util.DragDropMgr.refreshCache({group1:true, group2:true});
         * </code>
         * @TODO this really should be an indexed array.  Alternatively this
         * method could accept both.
         * @method refreshCache
         * @param {Object} groups an associative array of groups to refresh
         * @static
         */
        refreshCache: function(groups) {

            // refresh everything if group array is not provided
            var g = groups || this.ids;

            for (var sGroup in g) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (var i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                        }
                    }
                }
            }
        },

        /**
         * This checks to make sure an element exists and is in the DOM.  The
         * main purpose is to handle cases where innerHTML is used to remove
         * drag and drop objects from the DOM.  IE provides an 'unspecified
         * error' when trying to access the offsetParent of such an element
         * @method verifyEl
         * @param {HTMLElement} el the element to check
         * @return {boolean} true if the element looks usable
         * @static
         */
        verifyEl: function(el) {
            try {
                if (el) {
                    var parent = el.offsetParent;
                    if (parent) {
                        return true;
                    }
                }
            } catch(e) {
            }

            return false;
        },

        /**
         * Returns a Region object containing the drag and drop element's position
         * and size, including the padding configured for it
         * @method getLocation
         * @param {DragDrop} oDD the drag and drop object to get the
         *                       location for
         * @return {pega.util.Region} a Region object representing the total area
         *                             the element occupies, including any padding
         *                             the instance is configured for.
         * @static
         */
        getLocation: function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

            try {
                pos= pega.util.Dom.getXY(el);
            } catch (e) { }

            if (!pos) {
                return null;
            }

            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;

            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];

            return new pega.util.Region( t, r, b, l );
        },

        /**
         * Checks the cursor location to see if it over the target
         * @method isOverTarget
         * @param {pega.util.Point} pt The point to evaluate
         * @param {DragDrop} oTarget the DragDrop object we are inspecting
         * @param {boolean} intersect true if we are in intersect mode
         * @param {pega.util.Region} pre-cached location of the dragged element
         * @return {boolean} true if the mouse is over the target
         * @private
         * @static
         */
        isOverTarget: function(pt, oTarget, intersect, curRegion) {
            // use cache if available
            var loc = this.locationCache[oTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;

            }

            if (!loc) {
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            // DragDrop is using this as a sanity check for the initial mousedown
            // in this case we are done.  In POINT mode, if the drag obj has no
            // contraints, we are done. Otherwise we need to evaluate the
            // region the target as occupies to determine if the dragged element
            // overlaps with it.

            var dc = this.dragCurrent;
            if (!dc || (!intersect && !dc.constrainX && !dc.constrainY)) {

                //if (oTarget.cursorIsOver) {
                //}
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;

            // Get the current location of the drag element, this is the
            // location of the mouse event less the delta that represents
            // where the original mousedown happened on the element.  We
            // need to consider constraints and ticks as well.

            if (!curRegion) {
                var pos = dc.getTargetCoord(pt.x, pt.y);
                var el = dc.getDragEl();
                curRegion = new pega.util.Region( pos.y,
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight,
                                                   pos.x );
            }

            var overlap = curRegion.intersect(loc);

            if (overlap) {
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            } else {
                return false;
            }
        },

        /**
         * unload event handler
         * @method _onUnload
         * @private
         * @static
         */
        _onUnload: function(e, me) {
            this.unregAll();
        },

        /**
         * Cleans up the drag and drop events and objects.
         * @method unregAll
         * @private
         * @static
         */
        unregAll: function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            //for (var i in this.elementCache) {
                //delete this.elementCache[i];
            //}
            //this.elementCache = {};

            this.ids = {};
        },

        /**
         * A cache of DOM elements
         * @property elementCache
         * @private
         * @static
         * @deprecated elements are not cached now
         */
        elementCache: {},

        /**
         * Get the wrapper for the DOM element specified
         * @method getElWrapper
         * @param {String} id the id of the element to get
         * @return {pega.util.DDM.ElementWrapper} the wrapped element
         * @private
         * @deprecated This wrapper isn't that useful
         * @static
         */
        getElWrapper: function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] =
                    new this.ElementWrapper(pega.util.Dom.get(id));
            }
            return oWrapper;
        },

        /**
         * Returns the actual DOM element
         * @method getElement
         * @param {String} id the id of the elment to get
         * @return {Object} The element
         * @deprecated use pega.util.Dom.get instead
         * @static
         */
        getElement: function(id) {
            return pega.util.Dom.get(id);
        },

        /**
         * Returns the style property for the DOM element (i.e.,
         * document.getElById(id).style)
         * @method getCss
         * @param {String} id the id of the elment to get
         * @return {Object} The style property of the element
         * @deprecated use pega.util.Dom instead
         * @static
         */
        getCss: function(id) {
            var el = pega.util.Dom.get(id);
            return (el) ? el.style : null;
        },

        /**
         * Inner class for cached elements
         * @class DragDropMgr.ElementWrapper
         * @for DragDropMgr
         * @private
         * @deprecated
         */
        ElementWrapper: function(el) {
                /**
                 * The element
                 * @property el
                 */
                this.el = el || null;
                /**
                 * The element id
                 * @property id
                 */
                this.id = this.el && el.id;
                /**
                 * A reference to the style property
                 * @property css
                 */
                this.css = this.el && el.style;
            },

        /**
         * Returns the X position of an html element
         * @method getPosX
         * @param el the element for which to get the position
         * @return {int} the X coordinate
         * @for DragDropMgr
         * @deprecated use pega.util.Dom.getX instead
         * @static
         */
        getPosX: function(el) {
            return pega.util.Dom.getX(el);
        },

        /**
         * Returns the Y position of an html element
         * @method getPosY
         * @param el the element for which to get the position
         * @return {int} the Y coordinate
         * @deprecated use pega.util.Dom.getY instead
         * @static
         */
        getPosY: function(el) {
            return pega.util.Dom.getY(el);
        },

        /**
         * Swap two nodes.  In IE, we use the native method, for others we
         * emulate the IE behavior
         * @method swapNode
         * @param n1 the first node to swap
         * @param n2 the other node to swap
         * @static
         */
        swapNode: function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                var p = n2.parentNode;
                var s = n2.nextSibling;

                if (s == n1) {
                    p.insertBefore(n1, n2);
                } else if (n2 == n1.nextSibling) {
                    p.insertBefore(n2, n1);
                } else {
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },

        /**
         * Returns the current scroll position
         * @method getScroll
         * @private
         * @static
         */
        getScroll: function () {
            var t, l, dde=document.documentElement, db=document.body;
            if (dde && (dde.scrollTop || dde.scrollLeft)) {
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if (db) {
                t = db.scrollTop;
                l = db.scrollLeft;
            } else {
            }
            return { top: t, left: l };
        },

        /**
         * Returns the specified element style property
         * @method getStyle
         * @param {HTMLElement} el          the element
         * @param {string}      styleProp   the style property
         * @return {string} The value of the style property
         * @deprecated use pega.util.Dom.getStyle
         * @static
         */
        getStyle: function(el, styleProp) {
            return pega.util.Dom.getStyle(el, styleProp);
        },

        /**
         * Gets the scrollTop
         * @method getScrollTop
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollTop: function () { return this.getScroll().top; },

        /**
         * Gets the scrollLeft
         * @method getScrollLeft
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollLeft: function () { return this.getScroll().left; },

        /**
         * Sets the x/y position of an element to the location of the
         * target element.
         * @method moveToEl
         * @param {HTMLElement} moveEl      The element to move
         * @param {HTMLElement} targetEl    The position reference element
         * @static
         */
        moveToEl: function (moveEl, targetEl) {
            var aCoord = pega.util.Dom.getXY(targetEl);
            pega.util.Dom.setXY(moveEl, aCoord);
        },

        /**
         * Gets the client height
         * @method getClientHeight
         * @return {int} client height in px
         * @deprecated use pega.util.Dom.getViewportHeight instead
         * @static
         */
        getClientHeight: function() {
            return pega.util.Dom.getViewportHeight();
        },

        /**
         * Gets the client width
         * @method getClientWidth
         * @return {int} client width in px
         * @deprecated use pega.util.Dom.getViewportWidth instead
         * @static
         */
        getClientWidth: function() {
            return pega.util.Dom.getViewportWidth();
        },

        /**
         * Numeric array sort function
         * @method numericSort
         * @static
         */
        numericSort: function(a, b) { return (a - b); },

        /**
         * Internal counter
         * @property _timeoutCount
         * @private
         * @static
         */
        _timeoutCount: 0,

        /**
         * Trying to make the load order less important.  Without this we get
         * an error if this file is loaded before the Event Utility.
         * @method _addListeners
         * @private
         * @static
         */
        _addListeners: function() {
            var DDM = pega.util.DDM;
            if ( pega.util.Event && document ) {
                DDM._onLoad();
            } else {
                if (DDM._timeoutCount > 2000) {
                } else {
                    setTimeout(DDM._addListeners, 10);
                    if (document && document.body) {
                        DDM._timeoutCount += 1;
                    }
                }
            }
        },

        /**
         * Recursively searches the immediate parent and all child nodes for
         * the handle element in order to determine wheter or not it was
         * clicked.
         * @method handleWasClicked
         * @param node the html element to inspect
         * @static
         */
        handleWasClicked: function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        }

    };

}();

// shorter alias, save a few bytes
pega.util.DDM = pega.util.DragDropMgr;
pega.util.DDM._addListeners();

}

(function() {

var Event=pega.util.Event;
var Dom=pega.util.Dom;

/**
 * Defines the interface and base operation of items that that can be
 * dragged or can be drop targets.  It was designed to be extended, overriding
 * the event handlers for startDrag, onDrag, onDragOver, onDragOut.
 * Up to three html elements can be associated with a DragDrop instance:
 * <ul>
 * <li>linked element: the element that is passed into the constructor.
 * This is the element which defines the boundaries for interaction with
 * other DragDrop objects.</li>
 * <li>handle element(s): The drag operation only occurs if the element that
 * was clicked matches a handle element.  By default this is the linked
 * element, but there are times that you will want only a portion of the
 * linked element to initiate the drag operation, and the setHandleElId()
 * method provides a way to define this.</li>
 * <li>drag element: this represents an the element that would be moved along
 * with the cursor during a drag operation.  By default, this is the linked
 * element itself as in {@link pega.util.DD}.  setDragElId() lets you define
 * a separate element that would be moved, as in {@link pega.util.DDProxy}
 * </li>
 * </ul>
 * This class should not be instantiated until the onload event to ensure that
 * the associated elements are available.
 * The following would define a DragDrop obj that would interact with any
 * other DragDrop obj in the "group1" group:
 * <pre>
 *  dd = new pega.util.DragDrop("div1", "group1");
 * </pre>
 * Since none of the event handlers have been implemented, nothing would
 * actually happen if you were to run the code above.  Normally you would
 * override this class or one of the default implementations, but you can
 * also override the methods you want on an instance of the class...
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *  &nbsp;&nbsp;alert("dd was dropped on " + id);
 *  }
 * </pre>
 * @namespace pega.util
 * @class DragDrop
 * @constructor
 * @param {String} id of the element that is linked to this instance
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DragDrop:
 *                    padding, isTarget, maintainOffset, primaryButtonOnly,
 */
pega.util.DragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

pega.util.DragDrop.prototype = {
    /**
     * An Object Literal containing the events that we will be using: mouseDown, b4MouseDown, mouseUp, b4StartDrag, startDrag, b4EndDrag, endDrag, mouseUp, drag, b4Drag, invalidDrop, b4DragOut, dragOut, dragEnter, b4DragOver, dragOver, b4DragDrop, dragDrop
     * By setting any of these to false, then event will not be fired.
     * @property events
     * @type object
     */
    events: null,
    /**
    * @method on
    * @description Shortcut for EventProvider.subscribe, see <a href="pega.util.EventProvider.html#subscribe">pega.util.EventProvider.subscribe</a>
    */
    on: function() {
        this.subscribe.apply(this, arguments);
    },
    /**
     * The id of the element associated with this object.  This is what we
     * refer to as the "linked element" because the size and position of
     * this element is used to determine when the drag and drop objects have
     * interacted.
     * @property id
     * @type String
     */
    id: null,

    /**
     * Configuration attributes passed into the constructor
     * @property config
     * @type object
     */
    config: null,

    /**
     * The id of the element that will be dragged.  By default this is same
     * as the linked element , but could be changed to another element. Ex:
     * pega.util.DDProxy
     * @property dragElId
     * @type String
     * @private
     */
    dragElId: null,

    /**
     * the id of the element that initiates the drag operation.  By default
     * this is the linked element, but could be changed to be a child of this
     * element.  This lets us do things like only starting the drag when the
     * header element within the linked html element is clicked.
     * @property handleElId
     * @type String
     * @private
     */
    handleElId: null,

    /**
     * An associative array of HTML tags that will be ignored if clicked.
     * @property invalidHandleTypes
     * @type {string: string}
     */
    invalidHandleTypes: null,

    /**
     * An associative array of ids for elements that will be ignored if clicked
     * @property invalidHandleIds
     * @type {string: string}
     */
    invalidHandleIds: null,

    /**
     * An indexted array of css class names for elements that will be ignored
     * if clicked.
     * @property invalidHandleClasses
     * @type string[]
     */
    invalidHandleClasses: null,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     * @property startPageX
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     * @property startPageY
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * The group defines a logical collection of DragDrop objects that are
     * related.  Instances only get events when interacting with other
     * DragDrop object in the same group.  This lets us define multiple
     * groups using a single DragDrop subclass if we want.
     * @property groups
     * @type {string: string}
     */
    groups: null,

    /**
     * Individual drag/drop instances can be locked.  This will prevent
     * onmousedown start drag.
     * @property locked
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * Lock this instance
     * @method lock
     */
    lock: function() { this.locked = true; },

    /**
     * Unlock this instace
     * @method unlock
     */
    unlock: function() { this.locked = false; },

    /**
     * By default, all instances can be a drop target.  This can be disabled by
     * setting isTarget to false.
     * @property isTarget
     * @type boolean
     */
    isTarget: true,

    /**
     * The padding configured for this drag and drop object for calculating
     * the drop zone intersection with this object.
     * @property padding
     * @type int[]
     */
    padding: null,
    /**
     * If this flag is true, do not fire drop events. The element is a drag only element (for movement not dropping)
     * @property dragOnly
     * @type Boolean
     */
    dragOnly: false,

    /**
     * Cached reference to the linked element
     * @property _domRef
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @property __ygDragDrop
     * @private
     */
    __ygDragDrop: true,

    /**
     * Set to true when horizontal contraints are applied
     * @property constrainX
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * Set to true when vertical contraints are applied
     * @property constrainY
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * The left constraint
     * @property minX
     * @type int
     * @private
     */
    minX: 0,

    /**
     * The right constraint
     * @property maxX
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * The up constraint
     * @property minY
     * @type int
     * @type int
     * @private
     */
    minY: 0,

    /**
     * The down constraint
     * @property maxY
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * The difference between the click position and the source element's location
     * @property deltaX
     * @type int
     * @private
     */
    deltaX: 0,

    /**
     * The difference between the click position and the source element's location
     * @property deltaY
     * @type int
     * @private
     */
    deltaY: 0,

    /**
     * Maintain offsets when we resetconstraints.  Set to true when you want
     * the position of the element relative to its parent to stay the same
     * when the page changes
     *
     * @property maintainOffset
     * @type boolean
     */
    maintainOffset: false,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * horizontal graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @property xTicks
     * @type int[]
     */
    xTicks: null,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * vertical graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @property yTicks
     * @type int[]
     */
    yTicks: null,

    /**
     * By default the drag and drop instance will only respond to the primary
     * button click (left button for a right-handed mouse).  Set to true to
     * allow drag and drop to start with any mouse click that is propogated
     * by the browser
     * @property primaryButtonOnly
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * The availabe property is false until the linked dom element is accessible.
     * @property available
     * @type boolean
     */
    available: false,

    /**
     * By default, drags can only be initiated if the mousedown occurs in the
     * region the linked element is.  This is done in part to work around a
     * bug in some browsers that mis-report the mousedown if the previous
     * mouseup happened outside of the window.  This property is set to true
     * if outer handles are defined.
     *
     * @property hasOuterHandles
     * @type boolean
     * @default false
     */
    hasOuterHandles: false,

    /**
     * Property that is assigned to a drag and drop object when testing to
     * see if it is being targeted by another dd object.  This property
     * can be used in intersect mode to help determine the focus of
     * the mouse interaction.  DDM.getBestMatch uses this property first to
     * determine the closest match in INTERSECT mode when multiple targets
     * are part of the same interaction.
     * @property cursorIsOver
     * @type boolean
     */
    cursorIsOver: false,

    /**
     * Property that is assigned to a drag and drop object when testing to
     * see if it is being targeted by another dd object.  This is a region
     * that represents the area the draggable element overlaps this target.
     * DDM.getBestMatch uses this property to compare the size of the overlap
     * to that of other targets in order to determine the closest match in
     * INTERSECT mode when multiple targets are part of the same interaction.
     * @property overlap
     * @type pega.util.Region
     */
    overlap: null,

    /**
     * Code that executes immediately before the startDrag event
     * @method b4StartDrag
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * Abstract method called after a drag/drop object is clicked
     * and the drag or mousedown time thresholds have beeen met.
     * @method startDrag
     * @param {int} X click location
     * @param {int} Y click location
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * Code that executes immediately before the onDrag event
     * @method b4Drag
     * @private
     */
    b4Drag: function(e) { },

    /**
     * Abstract method called during the onMouseMove event while dragging an
     * object.
     * @method onDrag
     * @param {Event} e the mousemove event
     */
    onDrag: function(e) { /* override this */ },

    /**
     * Abstract method called when this element fist begins hovering over
     * another DragDrop obj
     * @method onDragEnter
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of one or more
     * dragdrop items being hovered over.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOver event
     * @method b4DragOver
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * Abstract method called when this element is hovering over another
     * DragDrop obj
     * @method onDragOver
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of dd items
     * being hovered over.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOut event
     * @method b4DragOut
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * Abstract method called when we are no longer hovering over an element
     * @method onDragOut
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was hovering over.  In INTERSECT mode, an array of dd items
     * that the mouse is no longer over.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragDrop event
     * @method b4DragDrop
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * Abstract method called when this item is dropped on another DragDrop
     * obj
     * @method onDragDrop
     * @param {Event} e the mouseup event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was dropped on.  In INTERSECT mode, an array of dd items this
     * was dropped on.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * Abstract method called when this item is dropped on an area with no
     * drop target
     * @method onInvalidDrop
     * @param {Event} e the mouseup event
     */
    onInvalidDrop: function(e) { /* override this */ },

    /**
     * Code that executes immediately before the endDrag event
     * @method b4EndDrag
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * Fired when we are done dragging the object
     * @method endDrag
     * @param {Event} e the mouseup event
     */
    endDrag: function(e) { /* override this */ },

    /**
     * Code executed immediately before the onMouseDown event
     * @method b4MouseDown
     * @param {Event} e the mousedown event
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * Event handler that fires when a drag/drop obj gets a mousedown
     * @method onMouseDown
     * @param {Event} e the mousedown event
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * Event handler that fires when a drag/drop obj gets a mouseup
     * @method onMouseUp
     * @param {Event} e the mouseup event
     */
    onMouseUp: function(e) { /* override this */ },

    /**
     * Override the onAvailable method to do what is needed after the initial
     * position was determined.
     * @method onAvailable
     */
    onAvailable: function () {
    },

    /**
     * Returns a reference to the linked element
     * @method getEl
     * @return {HTMLElement} the html element
     */
    getEl: function() {
        if (!this._domRef) {
            this._domRef = Dom.get(this.id);
        }

        return this._domRef;
    },

    /**
     * Returns a reference to the actual element to drag.  By default this is
     * the same as the html element, but it can be assigned to another
     * element. An example of this can be found in pega.util.DDProxy
     * @method getDragEl
     * @return {HTMLElement} the html element
     */
    getDragEl: function() {
        return Dom.get(this.dragElId);
    },

    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * pega.util.DragDrop subclass
     * @method init
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Event.on(this._domRef || this.id, "mousedown",
                        this.handleMouseDown, this, true);

        // Event.on(this.id, "selectstart", Event.preventDefault);
        for (var i in this.events) {
            this.createEvent(i + 'Event');
        }

    },

    /**
     * Initializes Targeting functionality only... the object does not
     * get a mousedown handler.
     * @method initTarget
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    initTarget: function(id, sGroup, config) {

        // configuration attributes
        this.config = config || {};

        this.events = {};

        // create a local reference to the drag and drop manager
        this.DDM = pega.util.DDM;

        // initialize the groups object
        this.groups = {};

        // assume that we have an element reference instead of an id if the
        // parameter is not a string
        if (typeof id !== "string") {
            this._domRef = id;
            id = Dom.generateId(id);
        }

        // set the id
        this.id = id;

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        Event.onAvailable(id, this.handleOnAvailable, this, true);


        // the linked element is the element that gets dragged by default
        this.setDragElId(id);

        // by default, clicked anchors will not start drag operations.
        // @TODO what else should be here?  Probably form fields.
        this.invalidHandleTypes = { A: "A" };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();
    },

    /**
     * Applies the configuration parameters that were passed into the constructor.
     * This is supposed to happen at each level through the inheritance chain.  So
     * a DDProxy implentation will execute apply config on DDProxy, DD, and
     * DragDrop in order to get all of the parameters that are available in
     * each object.
     * @method applyConfig
     */
    applyConfig: function() {
        this.events = {
            mouseDown: true,
            b4MouseDown: true,
            mouseUp: true,
            b4StartDrag: true,
            startDrag: true,
            b4EndDrag: true,
            endDrag: true,
            drag: true,
            b4Drag: true,
            invalidDrop: true,
            b4DragOut: true,
            dragOut: true,
            dragEnter: true,
            b4DragOver: true,
            dragOver: true,
            b4DragDrop: true,
            dragDrop: true
        };

        if (this.config.events) {
            for (var i in this.config.events) {
                if (this.config.events[i] === false) {
                    this.events[i] = false;
                }
            }
        }


        // configurable properties:
        //    padding, isTarget, maintainOffset, primaryButtonOnly
        this.padding           = this.config.padding || [0, 0, 0, 0];
        this.isTarget          = (this.config.isTarget !== false);
        this.maintainOffset    = (this.config.maintainOffset);
        this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);
        this.dragOnly = ((this.config.dragOnly === true) ? true : false);
        this.useShim = ((this.config.useShim === true) ? true : false);
    },

    /**
     * Executed when the linked element is available
     * @method handleOnAvailable
     * @private
     */
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     /**
     * Configures the padding for the target zone in px.  Effectively expands
     * (or reduces) the virtual object size for targeting calculations.
     * Supports css-style shorthand; if only one parameter is passed, all sides
     * will have that padding, and if only two are passed, the top and bottom
     * will have the first param, the left and right the second.
     * @method setPadding
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * Stores the initial placement of the linked element.
     * @method setInitialPosition
     * @param {int} diffX   the X offset, default 0
     * @param {int} diffY   the Y offset, default 0
     * @private
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            if (el && el.style && (el.style.display == 'none')) {
            } else {
            }
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];



        this.setStartPosition(p);
    },

    /**
     * Sets the start position of the element.  This is set when the obj
     * is initialized, the reset when a drag is started.
     * @method setStartPosition
     * @param pos current position (from previous lookup)
     * @private
     */
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY(this.getEl());

        this.deltaSetXY = null;

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * Add this instance to a group of related drag/drop objects.  All
     * instances belong to at least one group, and can belong to as many
     * groups as needed.
     * @method addToGroup
     * @param sGroup {string} the name of the group
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * Remove's this instance from the supplied interaction group
     * @method removeFromGroup
     * @param {string}  sGroup  The group to drop
     */
    removeFromGroup: function(sGroup) {
        if (this.groups[sGroup]) {
            delete this.groups[sGroup];
        }

        this.DDM.removeDDFromGroup(this, sGroup);
    },

    /**
     * Allows you to specify that an element other than the linked element
     * will be moved with the cursor during a drag
     * @method setDragElId
     * @param id {string} the id of the element that will be used to initiate the drag
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * Allows you to specify a child of the linked element that should be
     * used to initiate the drag operation.  An example of this would be if
     * you have a content div with text and links.  Clicking anywhere in the
     * content area would normally start the drag operation.  Use this method
     * to specify that an element inside of the content div is the element
     * that starts the drag operation.
     * @method setHandleElId
     * @param id {string} the id of the element that will be used to
     * initiate the drag.
     */
    setHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * Allows you to set an element outside of the linked element as a drag
     * handle
     * @method setOuterHandleElId
     * @param id the id of the element that will be used to initiate the drag
     */
    setOuterHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        Event.on(id, "mousedown",
                this.handleMouseDown, this, true);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    /**
     * Remove all drag and drop hooks for this element
     * @method unreg
     */
    unreg: function() {
        Event.removeListener(this.id, "mousedown",
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    /**
     * Returns true if this instance is locked, or the drag drop mgr is locked
     * (meaning that all drag/drop is disabled on the page.)
     * @method isLocked
     * @return {boolean} true if this obj or all drag/drop is locked, else
     * false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * Fired when this object is clicked
     * @method handleMouseDown
     * @param {Event} e
     * @param {pega.util.DragDrop} oDD the clicked dd object (this dd obj)
     * @private
     */
    handleMouseDown: function(e, oDD) {

        var button = e.which || e.button;

        if (this.primaryButtonOnly && button > 1) {
            return;
        }

        if (this.isLocked()) {
            return;
        }



        // firing the mousedown events prior to calculating positions
        var b4Return = this.b4MouseDown(e);
        if (this.events.b4MouseDown) {
            b4Return = this.fireEvent('b4MouseDownEvent', e);
        }
        var mDownReturn = this.onMouseDown(e);
        if (this.events.mouseDown) {
            mDownReturn = this.fireEvent('mouseDownEvent', e);
        }

        if ((b4Return === false) || (mDownReturn === false)) {
            return;
        }

        this.DDM.refreshCache(this.groups);
        // var self = this;
        // setTimeout( function() { self.DDM.refreshCache(self.groups); }, 0);

        // Only process the event if we really clicked within the linked
        // element.  The reason we make this check is that in the case that
        // another element was moved between the clicked element and the
        // cursor in the time between the mousedown and mouseup events. When
        // this happens, the element gets the next mousedown event
        // regardless of where on the screen it happened.
        var pt = new pega.util.Point(Event.getPageX(e), Event.getPageY(e));
        if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {


                // set the initial element position
                this.setStartPosition();

                // start tracking mousemove distance and mousedown time to
                // determine when to start the actual drag
                this.DDM.handleMouseDown(e, this);

                // this mousedown is mine
                this.DDM.stopEvent(e);
            } else {


            }
        }
    },

    /**
     * @method clickValidator
     * @description Method validates that the clicked element
     * was indeed the handle or a valid child of the handle
     * @param {Event} e
     */
    clickValidator: function(e) {
        var target = pega.util.Event.getTarget(e);
        return ( this.isValidHandleChild(target) &&
                    (this.id == this.handleElId ||
                        this.DDM.handleWasClicked(target, this.id)) );
    },

    /**
     * Finds the location the element should be placed if we want to move
     * it to where the mouse location less the click offset would place us.
     * @method getTargetCoord
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     * @return an object that contains the coordinates (Object.x and Object.y)
     * @private
     */
    getTargetCoord: function(iPageX, iPageY) {


        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }

        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }

        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);


        return {x:x, y:y};
    },

    /**
     * Allows you to specify a tag name that should not start a drag operation
     * when clicked.  This is designed to facilitate embedding links within a
     * drag handle that do something other than start the drag.
     * @method addInvalidHandleType
     * @param {string} tagName the type of element to exclude
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * Lets you to specify an element id for a child of a drag handle
     * that should not initiate a drag
     * @method addInvalidHandleId
     * @param {string} id the element id of the element you wish to ignore
     */
    addInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        this.invalidHandleIds[id] = id;
    },


    /**
     * Lets you specify a css class of elements that will not initiate a drag
     * @method addInvalidHandleClass
     * @param {string} cssClass the class of the elements you wish to ignore
     */
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     * @method removeInvalidHandleType
     * @param {string} tagName the type of element to unexclude
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        // this.invalidHandleTypes[type] = null;
        delete this.invalidHandleTypes[type];
    },

    /**
     * Unsets an invalid handle id
     * @method removeInvalidHandleId
     * @param {string} id the id of the element to re-enable
     */
    removeInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        delete this.invalidHandleIds[id];
    },

    /**
     * Unsets an invalid css class
     * @method removeInvalidHandleClass
     * @param {string} cssClass the class of the element(s) you wish to
     * re-enable
     */
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    /**
     * Checks the tag exclusion list to see if this click should be ignored
     * @method isValidHandleChild
     * @param {HTMLElement} node the HTMLElement to evaluate
     * @return {boolean} true if this is a valid tag type, false if not
     */
    isValidHandleChild: function(node) {

        var valid = true;
        // var n = (node.nodeName == "#text") ? node.parentNode : node;
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];

        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }


        return valid;

    },

    /**
     * Create the array of horizontal tick marks if an interval was specified
     * in setXConstraint().
     * @method setXTicks
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * Create the array of vertical tick marks if an interval was specified in
     * setYConstraint().
     * @method setYTicks
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Use
     * this method to limit the horizontal travel of the element.  Pass in
     * 0,0 for the parameters if you want to lock the drag to the y axis.
     * @method setXConstraint
     * @param {int} iLeft the number of pixels the element can move to the left
     * @param {int} iRight the number of pixels the element can move to the
     * right
     * @param {int} iTickSize optional parameter for specifying that the
     * element
     * should move iTickSize pixels at a time.
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = parseInt(iLeft, 10);
        this.rightConstraint = parseInt(iRight, 10);

        this.minX = this.initPageX - this.leftConstraint;
        this.maxX = this.initPageX + this.rightConstraint;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * Clears any constraints applied to this instance.  Also clears ticks
     * since they can't exist independent of a constraint at this time.
     * @method clearConstraints
     */
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    /**
     * Clears any tick interval defined for this instance
     * @method clearTicks
     */
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Set
     * this to limit the vertical travel of the element.  Pass in 0,0 for the
     * parameters if you want to lock the drag to the x axis.
     * @method setYConstraint
     * @param {int} iUp the number of pixels the element can move up
     * @param {int} iDown the number of pixels the element can move down
     * @param {int} iTickSize optional parameter for specifying that the
     * element should move iTickSize pixels at a time.
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = parseInt(iUp, 10);
        this.bottomConstraint = parseInt(iDown, 10);

        this.minY = this.initPageY - this.topConstraint;
        this.maxY = this.initPageY + this.bottomConstraint;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;

    },

    /**
     * resetConstraints must be called if you manually reposition a dd element.
     * @method resetConstraints
     */
    resetConstraints: function() {


        // Maintain offsets if necessary
        if (this.initPageX || this.initPageX === 0) {
            // figure out how much this thing has moved
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        // This is the first time we have detected the element's position
        } else {
            this.setInitPosition();
        }

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint,
                                 this.rightConstraint,
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint,
                                 this.bottomConstraint,
                                 this.yTickSize         );
        }
    },

    /**
     * Normally the drag element is moved pixel by pixel, but we can specify
     * that it move a number of pixels at a time.  This method resolves the
     * location when we have it set up like this.
     * @method getTick
     * @param {int} val where we want to place the object
     * @param {int[]} tickArray sorted array of valid points
     * @return {int} the closest tick
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel,
            // so we return the value passed to us.
            return Math.ceil(val);
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString method
     * @method toString
     * @return {string} string representation of the dd obj
     */
    toString: function() {
        return ("DragDrop " + this.id);
    }

};
pega.augment(pega.util.DragDrop, pega.util.EventProvider);

/**
* @event mouseDownEvent
* @description Provides access to the mousedown event. The mousedown does not always result in a drag operation.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4MouseDownEvent
* @description Provides access to the mousedown event, before the mouseDownEvent gets fired. Returning false will cancel the drag.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event mouseUpEvent
* @description Fired from inside DragDropMgr when the drag operation is finished.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4StartDragEvent
* @description Fires before the startDragEvent, returning false will cancel the startDrag Event.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event startDragEvent
* @description Occurs after a mouse down and the drag threshold has been met. The drag threshold default is either 3 pixels of mouse movement or 1 full second of holding the mousedown.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4EndDragEvent
* @description Fires before the endDragEvent. Returning false will cancel.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event endDragEvent
* @description Fires on the mouseup event after a drag has been initiated (startDrag fired).
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragEvent
* @description Occurs every mousemove event while dragging.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragEvent
* @description Fires before the dragEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event invalidDropEvent
* @description Fires when the dragged objects is dropped in a location that contains no drop targets.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOutEvent
* @description Fires before the dragOutEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOutEvent
* @description Fires when a dragged object is no longer over an object that had the onDragEnter fire.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragEnterEvent
* @description Occurs when the dragged object first interacts with another targettable drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOverEvent
* @description Fires before the dragOverEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOverEvent
* @description Fires every mousemove event while over a drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragDropEvent
* @description Fires before the dragDropEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragDropEvent
* @description Fires when the dragged objects is dropped on another.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
})();
/**
 * A DragDrop implementation where the linked element follows the
 * mouse cursor during a drag.
 * @class DD
 * @extends pega.util.DragDrop
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DD:
 *                    scroll
 */
pega.util.DD = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

pega.extend(pega.util.DD, pega.util.DragDrop, {

    /**
     * When set to true, the utility automatically tries to scroll the browser
     * window wehn a drag and drop element is dragged near the viewport boundary.
     * Defaults to true.
     * @property scroll
     * @type boolean
     */
    scroll: true,

    /**
     * Sets the pointer offset to the distance between the linked element's top
     * left corner and the location the element was clicked
     * @method autoOffset
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     */
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    /**
     * Sets the pointer offset.  You can call this directly to force the
     * offset to be in a particular location (e.g., pass in 0,0 to set it
     * to the center of the object, as done in pega.widget.Slider)
     * @method setDelta
     * @param {int} iDeltaX the distance from the left
     * @param {int} iDeltaY the distance from the top
     */
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    /**
     * Sets the drag element to the location of the mousedown or click event,
     * maintaining the cursor location relative to the location on the element
     * that was clicked.  Override this if you want to place the element in a
     * location other than where the cursor is.
     * @method setDragElPos
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    setDragElPos: function(iPageX, iPageY) {
        // the first time we do this, we are going to check to make sure
        // the element has css positioning

        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    /**
     * Sets the element to the location of the mousedown or click event,
     * maintaining the cursor location relative to the location on the element
     * that was clicked.  Override this if you want to place the element in a
     * location other than where the cursor is.
     * @method alignElWithMouse
     * @param {HTMLElement} el the element to move
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);

        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            pega.util.Dom.setXY(el, aCoord);
            var newLeft = parseInt( pega.util.Dom.getStyle(el, "left"), 10 );
            var newTop  = parseInt( pega.util.Dom.getStyle(el, "top" ), 10 );

            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            pega.util.Dom.setStyle(el, "left", (oCoord.x + this.deltaSetXY[0]) + "px");
            pega.util.Dom.setStyle(el, "top",  (oCoord.y + this.deltaSetXY[1]) + "px");
        }

        this.cachePosition(oCoord.x, oCoord.y);
        var self = this;
        setTimeout(function() {
            self.autoScroll.call(self, oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        }, 0);
    },

    /**
     * Saves the most recent position so that we can reset the constraints and
     * tick marks on-demand.  We need to know this so that we can calculate the
     * number of pixels the element is offset from its original position.
     * @method cachePosition
     * @param iPageX the current x position (optional, this just makes it so we
     * don't have to look it up again)
     * @param iPageY the current y position (optional, this just makes it so we
     * don't have to look it up again)
     */
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = pega.util.Dom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },

    /**
     * Auto-scroll the window if the dragged object has been moved beyond the
     * visible window boundary.
     * @method autoScroll
     * @param {int} x the drag element's x position
     * @param {int} y the drag element's y position
     * @param {int} h the height of the drag element
     * @param {int} w the width of the drag element
     * @private
     */
    autoScroll: function(x, y, h, w) {

        if (this.scroll) {
            // The client height
            var clientH = this.DDM.getClientHeight();

            // The client width
            var clientW = this.DDM.getClientWidth();

            // The amt scrolled down
            var st = this.DDM.getScrollTop();

            // The amt scrolled right
            var sl = this.DDM.getScrollLeft();

            // Location of the bottom of the element
            var bot = h + y;

            // Location of the right of the element
            var right = w + x;

            // The distance from the cursor to the bottom of the visible area,
            // adjusted so that we don't scroll if the cursor is beyond the
            // element drag constraints
            var toBot = (clientH + st - y - this.deltaY);

            // The distance from the cursor to the right of the visible area
            var toRight = (clientW + sl - x - this.deltaX);


            // How close to the edge the cursor must be before we scroll
            // var thresh = (document.all) ? 100 : 40;
            var thresh = 40;

            // How many pixels to scroll per autoscroll op.  This helps to reduce
            // clunky scrolling. IE is more sensitive about this ... it needs this
            // value to be higher.
            var scrAmt = (document.all) ? 80 : 30;

            // Scroll down if we are near the bottom of the visible page and the
            // obj extends below the crease
            if ( bot > clientH && toBot < thresh ) {
                window.scrollTo(sl, st + scrAmt);
            }

            // Scroll up if the window is scrolled down and the top of the object
            // goes above the top border
            if ( y < st && st > 0 && y - st < thresh ) {
                window.scrollTo(sl, st - scrAmt);
            }

            // Scroll right if the obj is beyond the right border and the cursor is
            // near the border.
            if ( right > clientW && toRight < thresh ) {
                window.scrollTo(sl + scrAmt, st);
            }

            // Scroll left if the window has been scrolled to the right and the obj
            // extends past the left border
            if ( x < sl && sl > 0 && x - sl < thresh ) {
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    /*
     * Sets up config options specific to this class. Overrides
     * pega.util.DragDrop, but all versions of this method through the
     * inheritance chain are called
     */
    applyConfig: function() {
        pega.util.DD.superclass.applyConfig.call(this);
        this.scroll = (this.config.scroll !== false);
    },

    /*
     * Event that fires prior to the onMouseDown event.  Overrides
     * pega.util.DragDrop.
     */
    b4MouseDown: function(e) {
        this.setStartPosition();
        // this.resetConstraints();
        this.autoOffset(pega.util.Event.getPageX(e),
                            pega.util.Event.getPageY(e));
    },

    /*
     * Event that fires prior to the onDrag event.  Overrides
     * pega.util.DragDrop.
     */
    b4Drag: function(e) {
        this.setDragElPos(pega.util.Event.getPageX(e),
                            pega.util.Event.getPageY(e));
    },

    toString: function() {
        return ("DD " + this.id);
    }

    //////////////////////////////////////////////////////////////////////////
    // Debugging ygDragDrop events that can be overridden
    //////////////////////////////////////////////////////////////////////////
    /*
    startDrag: function(x, y) {
    },

    onDrag: function(e) {
    },

    onDragEnter: function(e, id) {
    },

    onDragOver: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    onDragDrop: function(e, id) {
    },

    endDrag: function(e) {
    }

    */

/**
* @event mouseDownEvent
* @description Provides access to the mousedown event. The mousedown does not always result in a drag operation.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4MouseDownEvent
* @description Provides access to the mousedown event, before the mouseDownEvent gets fired. Returning false will cancel the drag.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event mouseUpEvent
* @description Fired from inside DragDropMgr when the drag operation is finished.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4StartDragEvent
* @description Fires before the startDragEvent, returning false will cancel the startDrag Event.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event startDragEvent
* @description Occurs after a mouse down and the drag threshold has been met. The drag threshold default is either 3 pixels of mouse movement or 1 full second of holding the mousedown.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4EndDragEvent
* @description Fires before the endDragEvent. Returning false will cancel.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event endDragEvent
* @description Fires on the mouseup event after a drag has been initiated (startDrag fired).
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragEvent
* @description Occurs every mousemove event while dragging.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragEvent
* @description Fires before the dragEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event invalidDropEvent
* @description Fires when the dragged objects is dropped in a location that contains no drop targets.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOutEvent
* @description Fires before the dragOutEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOutEvent
* @description Fires when a dragged object is no longer over an object that had the onDragEnter fire.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragEnterEvent
* @description Occurs when the dragged object first interacts with another targettable drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOverEvent
* @description Fires before the dragOverEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOverEvent
* @description Fires every mousemove event while over a drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragDropEvent
* @description Fires before the dragDropEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragDropEvent
* @description Fires when the dragged objects is dropped on another.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
});
/**
 * A DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * References to the "frame" element refer to the single proxy element that
 * was created to be dragged in place of all DDProxy elements on the
 * page.
 *
 * @class DDProxy
 * @extends pega.util.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DDProxy in addition to those in DragDrop:
 *                   resizeFrame, centerFrame, dragElId
 */
pega.util.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
    }
};

/**
 * The default drag frame div id
 * @property pega.util.DDProxy.dragElId
 * @type String
 * @static
 */
pega.util.DDProxy.dragElId = "ygddfdiv";

pega.extend(pega.util.DDProxy, pega.util.DD, {

    /**
     * By default we resize the drag frame to be the same size as the element
     * we want to drag (this is to get the frame effect).  We can turn it off
     * if we want a different behavior.
     * @property resizeFrame
     * @type boolean
     */
    resizeFrame: true,

    /**
     * By default the frame is positioned exactly where the drag element is, so
     * we use the cursor offset provided by pega.util.DD.  Another option that works only if
     * you do not have constraints on the obj is to have the drag frame centered
     * around the cursor.  Set centerFrame to true for this effect.
     * @property centerFrame
     * @type boolean
     */
    centerFrame: false,

    /**
     * Creates the proxy element if it does not yet exist
     * @method createFrame
     */
    createFrame: function() {
        var self=this, body=document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div=this.getDragEl(), Dom=pega.util.Dom;

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;
            s.height     = "25px";
            s.width      = "25px";

            var _data = document.createElement('div');
            Dom.setStyle(_data, 'height', '100%');
            Dom.setStyle(_data, 'width', '100%');
            /**
            * If the proxy element has no background-color, then it is considered to the "transparent" by Internet Explorer.
            * Since it is "transparent" then the events pass through it to the iframe below.
            * So creating a "fake" div inside the proxy element and giving it a background-color, then setting it to an
            * opacity of 0, it appears to not be there, however IE still thinks that it is so the events never pass through.
            */
            Dom.setStyle(_data, 'background-color', '#ccc');
            Dom.setStyle(_data, 'opacity', '0');
            div.appendChild(_data);

            /**
            * It seems that IE will fire the mouseup event if you pass a proxy element over a select box
            * Placing the IFRAME element inside seems to stop this issue
            */
            if (pega.env.ua.ie) {
                //Only needed for Internet Explorer
                var ifr = document.createElement('iframe');
                ifr.setAttribute('src', 'blank.htm');
                ifr.setAttribute('scrolling', 'no');
                ifr.setAttribute('frameborder', '0');
                div.insertBefore(ifr, div.firstChild);
                Dom.setStyle(ifr, 'height', '100%');
                Dom.setStyle(ifr, 'width', '100%');
                Dom.setStyle(ifr, 'position', 'absolute');
                Dom.setStyle(ifr, 'top', '0');
                Dom.setStyle(ifr, 'left', '0');
                Dom.setStyle(ifr, 'opacity', '0');
                Dom.setStyle(ifr, 'zIndex', '-1');
                Dom.setStyle(ifr.nextSibling, 'zIndex', '2');
            }

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * Initialization for the drag frame element.  Must be called in the
     * constructor of all subclasses
     * @method initFrame
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        pega.util.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || pega.util.DDProxy.dragElId);
    },

    /**
     * Resizes the drag frame to the dimensions of the clicked object, positions
     * it over the object, and finally displays it
     * @method showFrame
     * @param {int} iPageX X click position
     * @param {int} iPageY Y click position
     * @private
     */
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2),
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        pega.util.Dom.setStyle(dragEl, "visibility", "visible");
    },

    /**
     * The proxy is automatically resized to the dimensions of the linked
     * element when a drag is initiated, unless resizeFrame is set to false
     * @method _resizeProxy
     * @private
     */
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var DOM    = pega.util.Dom;
            var el     = this.getEl();
            var dragEl = this.getDragEl();

            var bt = parseInt( DOM.getStyle(dragEl, "borderTopWidth"    ), 10);
            var br = parseInt( DOM.getStyle(dragEl, "borderRightWidth"  ), 10);
            var bb = parseInt( DOM.getStyle(dragEl, "borderBottomWidth" ), 10);
            var bl = parseInt( DOM.getStyle(dragEl, "borderLeftWidth"   ), 10);

            if (isNaN(bt)) { bt = 0; }
            if (isNaN(br)) { br = 0; }
            if (isNaN(bb)) { bb = 0; }
            if (isNaN(bl)) { bl = 0; }


            var newWidth  = Math.max(0, el.offsetWidth  - br - bl);
            var newHeight = Math.max(0, el.offsetHeight - bt - bb);


            DOM.setStyle( dragEl, "width",  newWidth  + "px" );
            DOM.setStyle( dragEl, "height", newHeight + "px" );
        }
    },

    // overrides pega.util.DragDrop
    b4MouseDown: function(e) {
        this.setStartPosition();
        var x = pega.util.Event.getPageX(e);
        var y = pega.util.Event.getPageY(e);
        this.autoOffset(x, y);

        // This causes the autoscroll code to kick off, which means autoscroll can
        // happen prior to the check for a valid drag handle.
        // this.setDragElPos(x, y);
    },

    // overrides pega.util.DragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.showFrame(x, y);
    },

    // overrides pega.util.DragDrop
    b4EndDrag: function(e) {
        pega.util.Dom.setStyle(this.getDragEl(), "visibility", "hidden");
    },

    // overrides pega.util.DragDrop
    // By default we try to move the element to the last location of the frame.
    // This is so that the default behavior mirrors that of pega.util.DD.
    endDrag: function(e) {
        var DOM = pega.util.Dom;
        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        // del.style.visibility = "";
        DOM.setStyle(del, "visibility", "");

        // Hide the linked element before the move to get around a Safari
        // rendering bug.
        //lel.style.visibility = "hidden";
        DOM.setStyle(lel, "visibility", "hidden");
        pega.util.DDM.moveToEl(lel, del);
        //del.style.visibility = "hidden";
        DOM.setStyle(del, "visibility", "hidden");
        //lel.style.visibility = "";
        DOM.setStyle(lel, "visibility", "");
    },

    toString: function() {
        return ("DDProxy " + this.id);
    }
/**
* @event mouseDownEvent
* @description Provides access to the mousedown event. The mousedown does not always result in a drag operation.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4MouseDownEvent
* @description Provides access to the mousedown event, before the mouseDownEvent gets fired. Returning false will cancel the drag.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event mouseUpEvent
* @description Fired from inside DragDropMgr when the drag operation is finished.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4StartDragEvent
* @description Fires before the startDragEvent, returning false will cancel the startDrag Event.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event startDragEvent
* @description Occurs after a mouse down and the drag threshold has been met. The drag threshold default is either 3 pixels of mouse movement or 1 full second of holding the mousedown.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4EndDragEvent
* @description Fires before the endDragEvent. Returning false will cancel.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event endDragEvent
* @description Fires on the mouseup event after a drag has been initiated (startDrag fired).
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragEvent
* @description Occurs every mousemove event while dragging.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragEvent
* @description Fires before the dragEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event invalidDropEvent
* @description Fires when the dragged objects is dropped in a location that contains no drop targets.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOutEvent
* @description Fires before the dragOutEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOutEvent
* @description Fires when a dragged object is no longer over an object that had the onDragEnter fire.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragEnterEvent
* @description Occurs when the dragged object first interacts with another targettable drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragOverEvent
* @description Fires before the dragOverEvent.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragOverEvent
* @description Fires every mousemove event while over a drag and drop object.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event b4DragDropEvent
* @description Fires before the dragDropEvent
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/
/**
* @event dragDropEvent
* @description Fires when the dragged objects is dropped on another.
* @type pega.util.CustomEvent See <a href="pega.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

});
/**
 * A DragDrop implementation that does not move, but can be a drop
 * target.  You would get the same result by simply omitting implementation
 * for the event callbacks, but this way we reduce the processing cost of the
 * event listener and the callbacks.
 * @class DDTarget
 * @extends pega.util.DragDrop
 * @constructor
 * @param {String} id the id of the element that is a drop target
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                 Valid properties for DDTarget in addition to those in
 *                 DragDrop:
 *                    none
 */
pega.util.DDTarget = function(id, sGroup, config) {
    if (id) {
        this.initTarget(id, sGroup, config);
    }
};

// pega.util.DDTarget.prototype = new pega.util.DragDrop();
pega.extend(pega.util.DDTarget, pega.util.DragDrop, {
    toString: function() {
        return ("DDTarget " + this.id);
    }
});
pega.register("dragdrop", pega.util.DragDropMgr, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.1
*/
/**
 * Provides Attribute configurations.
 * @namespace pega.util
 * @class Attribute
 * @constructor
 * @param hash {Object} The intial Attribute.
 * @param {pega.util.AttributeProvider} The owner of the Attribute instance.
 */

pega.util.Attribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};

pega.util.Attribute.prototype = {
	/**
     * The name of the attribute.
	 * @property name
	 * @type String
	 */
    name: undefined,
    
	/**
     * The value of the attribute.
	 * @property value
	 * @type String
	 */
    value: null,
    
	/**
     * The owner of the attribute.
	 * @property owner
	 * @type pega.util.AttributeProvider
	 */
    owner: null,
    
	/**
     * Whether or not the attribute is read only.
	 * @property readOnly
	 * @type Boolean
	 */
    readOnly: false,
    
	/**
     * Whether or not the attribute can only be written once.
	 * @property writeOnce
	 * @type Boolean
	 */
    writeOnce: false,

	/**
     * The attribute's initial configuration.
     * @private
	 * @property _initialConfig
	 * @type Object
	 */
    _initialConfig: null,
    
	/**
     * Whether or not the attribute's value has been set.
     * @private
	 * @property _written
	 * @type Boolean
	 */
    _written: false,
    
	/**
     * The method to use when setting the attribute's value.
     * The method recieves the new value as the only argument.
	 * @property method
	 * @type Function
	 */
    method: null,
    
	/**
     * The validator to use when setting the attribute's value.
	 * @property validator
	 * @type Function
     * @return Boolean
	 */
    validator: null,
    
    /**
     * Retrieves the current value of the attribute.
     * @method getValue
     * @return {any} The current value of the attribute.
     */
    getValue: function() {
        return this.value;
    },
    
    /**
     * Sets the value of the attribute and fires beforeChange and change events.
     * @method setValue
     * @param {Any} value The value to apply to the attribute.
     * @param {Boolean} silent If true the change events will not be fired.
     * @return {Boolean} Whether or not the value was set.
     */
    setValue: function(value, silent) {
        var beforeRetVal;
        var owner = this.owner;
        var name = this.name;
        
        var event = {
            type: name, 
            prevValue: this.getValue(),
            newValue: value
        };
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            return false; // write not allowed
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; // invalid value
        }

        if (!silent) {
            beforeRetVal = owner.fireBeforeChangeEvent(event);
            if (beforeRetVal === false) {
                return false;
            }
        }

        if (this.method) {
            this.method.call(owner, value);
        }
        
        this.value = value;
        this._written = true;
        
        event.type = name;
        
        if (!silent) {
            this.owner.fireChangeEvent(event);
        }
        
        return true;
    },
    
    /**
     * Allows for configuring the Attribute's properties.
     * @method configure
     * @param {Object} map A key-value map of Attribute properties.
     * @param {Boolean} init Whether or not this should become the initial config.
     */
    configure: function(map, init) {
        map = map || {};
        this._written = false; // reset writeOnce
        this._initialConfig = this._initialConfig || {};
        
        for (var key in map) {
            if ( key && pega.lang.hasOwnProperty(map, key) ) {
                this[key] = map[key];
                if (init) {
                    this._initialConfig[key] = map[key];
                }
            }
        }
    },
    
    /**
     * Resets the value to the initial config value.
     * @method resetValue
     * @return {Boolean} Whether or not the value was set.
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    
    /**
     * Resets the attribute config to the initial config state.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    
    /**
     * Resets the value to the current value.
     * Useful when values may have gotten out of sync with actual properties.
     * @method refresh
     * @return {Boolean} Whether or not the value was set.
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};

(function() {
    var Lang = pega.util.Lang;

    /*
    Copyright (c) 2006, pega! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.pega.net/yui/license.txt
    */
    
    /**
     * Provides and manages pega.util.Attribute instances
     * @namespace pega.util
     * @class AttributeProvider
     * @uses pega.util.EventProvider
     */
    pega.util.AttributeProvider = function() {};

    pega.util.AttributeProvider.prototype = {
        
        /**
         * A key-value map of Attribute configurations
         * @property _configs
         * @protected (may be used by subclasses and augmentors)
         * @private
         * @type {Object}
         */
        _configs: null,
        /**
         * Returns the current value of the attribute.
         * @method get
         * @param {String} key The attribute whose value will be returned.
         */
        get: function(key){
            this._configs = this._configs || {};
            var config = this._configs[key];
            
            if (!config) {
                return undefined;
            }
            
            return config.value;
        },
        
        /**
         * Sets the value of a config.
         * @method set
         * @param {String} key The name of the attribute
         * @param {Any} value The value to apply to the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set.
         */
        set: function(key, value, silent){
            this._configs = this._configs || {};
            var config = this._configs[key];
            
            if (!config) {
                return false;
            }
            
            return config.setValue(value, silent);
        },
    
        /**
         * Returns an array of attribute names.
         * @method getAttributeKeys
         * @return {Array} An array of attribute names.
         */
        getAttributeKeys: function(){
            this._configs = this._configs;
            var keys = [];
            var config;
            for (var key in this._configs) {
                config = this._configs[key];
                if ( Lang.hasOwnProperty(this._configs, key) && 
                        !Lang.isUndefined(config) ) {
                    keys[keys.length] = key;
                }
            }
            
            return keys;
        },
        
        /**
         * Sets multiple attribute values.
         * @method setAttributes
         * @param {Object} map  A key-value map of attributes
         * @param {Boolean} silent Whether or not to suppress change events
         */
        setAttributes: function(map, silent){
            for (var key in map) {
                if ( Lang.hasOwnProperty(map, key) ) {
                    this.set(key, map[key], silent);
                }
            }
        },
    
        /**
         * Resets the specified attribute's value to its initial value.
         * @method resetValue
         * @param {String} key The name of the attribute
         * @param {Boolean} silent Whether or not to suppress change events
         * @return {Boolean} Whether or not the value was set
         */
        resetValue: function(key, silent){
            this._configs = this._configs || {};
            if (this._configs[key]) {
                this.set(key, this._configs[key]._initialConfig.value, silent);
                return true;
            }
            return false;
        },
    
        /**
         * Sets the attribute's value to its current value.
         * @method refresh
         * @param {String | Array} key The attribute(s) to refresh
         * @param {Boolean} silent Whether or not to suppress change events
         */
        refresh: function(key, silent){
            this._configs = this._configs;
            
            key = ( ( Lang.isString(key) ) ? [key] : key ) || 
                    this.getAttributeKeys();
            
            for (var i = 0, len = key.length; i < len; ++i) { 
                if ( // only set if there is a value and not null
                    this._configs[key[i]] && 
                    ! Lang.isUndefined(this._configs[key[i]].value) &&
                    ! Lang.isNull(this._configs[key[i]].value) ) {
                    this._configs[key[i]].refresh(silent);
                }
            }
        },
    
        /**
         * Adds an Attribute to the AttributeProvider instance. 
         * @method register
         * @param {String} key The attribute's name
         * @param {Object} map A key-value map containing the
         * attribute's properties.
         * @deprecated Use setAttributeConfig
         */
        register: function(key, map) {
            this.setAttributeConfig(key, map);
        },
        
        
        /**
         * Returns the attribute's properties.
         * @method getAttributeConfig
         * @param {String} key The attribute's name
         * @private
         * @return {object} A key-value map containing all of the
         * attribute's properties.
         */
        getAttributeConfig: function(key) {
            this._configs = this._configs || {};
            var config = this._configs[key] || {};
            var map = {}; // returning a copy to prevent overrides
            
            for (key in config) {
                if ( Lang.hasOwnProperty(config, key) ) {
                    map[key] = config[key];
                }
            }
    
            return map;
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method setAttributeConfig
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         */
        setAttributeConfig: function(key, map, init) {
            this._configs = this._configs || {};
            map = map || {};
            if (!this._configs[key]) {
                map.name = key;
                this._configs[key] = this.createAttribute(map);
            } else {
                this._configs[key].configure(map, init);
            }
        },
        
        /**
         * Sets or updates an Attribute instance's properties. 
         * @method configureAttribute
         * @param {String} key The attribute's name.
         * @param {Object} map A key-value map of attribute properties
         * @param {Boolean} init Whether or not this should become the intial config.
         * @deprecated Use setAttributeConfig
         */
        configureAttribute: function(key, map, init) {
            this.setAttributeConfig(key, map, init);
        },
        
        /**
         * Resets an attribute to its intial configuration. 
         * @method resetAttributeConfig
         * @param {String} key The attribute's name.
         * @private
         */
        resetAttributeConfig: function(key){
            this._configs = this._configs || {};
            this._configs[key].resetConfig();
        },
        
        // wrapper for EventProvider.subscribe
        // to create events on the fly
        subscribe: function(type, callback) {
            this._events = this._events || {};

            if ( !(type in this._events) ) {
                this._events[type] = this.createEvent(type);
            }

            pega.util.EventProvider.prototype.subscribe.apply(this, arguments);
        },

        on: function() {
            this.subscribe.apply(this, arguments);
        },

        addListener: function() {
            this.subscribe.apply(this, arguments);
        },

        /**
         * Fires the attribute's beforeChange event. 
         * @method fireBeforeChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to handlers.
         */
        fireBeforeChangeEvent: function(e) {
            var type = 'before';
            type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
            e.type = type;
            return this.fireEvent(e.type, e);
        },
        
        /**
         * Fires the attribute's change event. 
         * @method fireChangeEvent
         * @param {String} key The attribute's name.
         * @param {Obj} e The event object to pass to the handlers.
         */
        fireChangeEvent: function(e) {
            e.type += 'Change';
            return this.fireEvent(e.type, e);
        },

        createAttribute: function(map) {
            return new pega.util.Attribute(map, this);
        }
    };
    
    pega.augment(pega.util.AttributeProvider, pega.util.EventProvider);
})();

(function() {
// internal shorthand
var Dom = pega.util.Dom,
    AttributeProvider = pega.util.AttributeProvider;

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
 * @module element
 * @namespace pega.util
 * @requires pega, dom, event
 * @beta
 */

/**
 * Element provides an wrapper object to simplify adding
 * event listeners, using dom methods, and managing attributes. 
 * @class Element
 * @uses pega.util.AttributeProvider
 * @constructor
 * @param el {HTMLElement | String} The html element that 
 * represents the Element.
 * @param {Object} map A key-value map of initial config names and values
 */
pega.util.Element = function(el, map) {
    if (arguments.length) {
        this.init(el, map);
    }
};

pega.util.Element.prototype = {
    /**
     * Dom events supported by the Element instance.
     * @property DOM_EVENTS
     * @type Object
     */
    DOM_EVENTS: null,

    /**
     * Wrapper for HTMLElement method.
     * @method appendChild
     * @param {pega.util.Element || HTMLElement} child The element to append. 
     */
    appendChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').appendChild(child);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method getElementsByTagName
     * @param {String} tag The tagName to collect
     */
    getElementsByTagName: function(tag) {
        return this.get('element').getElementsByTagName(tag);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method hasChildNodes
     * @return {Boolean} Whether or not the element has childNodes
     */
    hasChildNodes: function() {
        return this.get('element').hasChildNodes();
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method insertBefore
     * @param {HTMLElement} element The HTMLElement to insert
     * @param {HTMLElement} before The HTMLElement to insert
     * the element before.
     */
    insertBefore: function(element, before) {
        element = element.get ? element.get('element') : element;
        before = (before && before.get) ? before.get('element') : before;
        
        this.get('element').insertBefore(element, before);
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method removeChild
     * @param {HTMLElement} child The HTMLElement to remove
     */
    removeChild: function(child) {
        child = child.get ? child.get('element') : child;
        this.get('element').removeChild(child);
        return true;
    },
    
    /**
     * Wrapper for HTMLElement method.
     * @method replaceChild
     * @param {HTMLElement} newNode The HTMLElement to insert
     * @param {HTMLElement} oldNode The HTMLElement to replace
     */
    replaceChild: function(newNode, oldNode) {
        newNode = newNode.get ? newNode.get('element') : newNode;
        oldNode = oldNode.get ? oldNode.get('element') : oldNode;
        return this.get('element').replaceChild(newNode, oldNode);
    },

    
    /**
     * Registers Element specific attributes.
     * @method initAttributes
     * @param {Object} map A key-value map of initial attribute configs
     */
    initAttributes: function(map) {
    },

    /**
     * Adds a listener for the given event.  These may be DOM or 
     * customEvent listeners.  Any event that is fired via fireEvent
     * can be listened for.  All handlers receive an event object. 
     * @method addListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The handler to call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    addListener: function(type, fn, obj, scope) {
        var el = this.get('element');
        scope = scope || this;
        
        el = this.get('id') || el;
        var self = this; 
        if (!this._events[type]) { // create on the fly
            if ( this.DOM_EVENTS[type] ) {
                pega.util.Event.addListener(el, type, function(e) {
                    if (e.srcElement && !e.target) { // supplement IE with target
                        e.target = e.srcElement;
                    }
                    self.fireEvent(type, e);
                }, obj, scope);
            }
            
            this.createEvent(type, this);
        }
        
        pega.util.EventProvider.prototype.subscribe.apply(this, arguments); // notify via customEvent
    },
    
    
    /**
     * Alias for addListener
     * @method on
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    on: function() { this.addListener.apply(this, arguments); },
    
    /**
     * Alias for addListener
     * @method subscribe
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     * @param {Any} obj A variable to pass to the handler
     * @param {Object} scope The object to use for the scope of the handler 
     */
    subscribe: function() { this.addListener.apply(this, arguments); },
    
    /**
     * Remove an event listener
     * @method removeListener
     * @param {String} type The name of the event to listen for
     * @param {Function} fn The function call when the event fires
     */
    removeListener: function(type, fn) {
        this.unsubscribe.apply(this, arguments);
    },
    
    /**
     * Wrapper for Dom method.
     * @method addClass
     * @param {String} className The className to add
     */
    addClass: function(className) {
        Dom.addClass(this.get('element'), className);
    },
    
    /**
     * Wrapper for Dom method.
     * @method getElementsByClassName
     * @param {String} className The className to collect
     * @param {String} tag (optional) The tag to use in
     * conjunction with class name
     * @return {Array} Array of HTMLElements
     */
    getElementsByClassName: function(className, tag) {
        return Dom.getElementsByClassName(className, tag,
                this.get('element') );
    },
    
    /**
     * Wrapper for Dom method.
     * @method hasClass
     * @param {String} className The className to add
     * @return {Boolean} Whether or not the element has the class name
     */
    hasClass: function(className) {
        return Dom.hasClass(this.get('element'), className); 
    },
    
    /**
     * Wrapper for Dom method.
     * @method removeClass
     * @param {String} className The className to remove
     */
    removeClass: function(className) {
        return Dom.removeClass(this.get('element'), className);
    },
    
    /**
     * Wrapper for Dom method.
     * @method replaceClass
     * @param {String} oldClassName The className to replace
     * @param {String} newClassName The className to add
     */
    replaceClass: function(oldClassName, newClassName) {
        return Dom.replaceClass(this.get('element'), 
                oldClassName, newClassName);
    },
    
    /**
     * Wrapper for Dom method.
     * @method setStyle
     * @param {String} property The style property to set
     * @param {String} value The value to apply to the style property
     */
    setStyle: function(property, value) {
        var el = this.get('element');
        if (!el) {
            return this._queue[this._queue.length] = ['setStyle', arguments];
        }

        return Dom.setStyle(el,  property, value); // TODO: always queuing?
    },
    
    /**
     * Wrapper for Dom method.
     * @method getStyle
     * @param {String} property The style property to retrieve
     * @return {String} The current value of the property
     */
    getStyle: function(property) {
        return Dom.getStyle(this.get('element'),  property);
    },
    
    /**
     * Apply any queued set calls.
     * @method fireQueue
     */
    fireQueue: function() {
        var queue = this._queue;
        for (var i = 0, len = queue.length; i < len; ++i) {
            this[queue[i][0]].apply(this, queue[i][1]);
        }
    },
    
    /**
     * Appends the HTMLElement into either the supplied parentNode.
     * @method appendTo
     * @param {HTMLElement | Element} parentNode The node to append to
     * @param {HTMLElement | Element} before An optional node to insert before
     */
    appendTo: function(parent, before) {
        parent = (parent.get) ?  parent.get('element') : Dom.get(parent);
        
        this.fireEvent('beforeAppendTo', {
            type: 'beforeAppendTo',
            target: parent
        });
        
        
        before = (before && before.get) ? 
                before.get('element') : Dom.get(before);
        var element = this.get('element');
        
        if (!element) {
            return false;
        }
        
        if (!parent) {
            return false;
        }
        
        if (element.parent != parent) {
            if (before) {
                parent.insertBefore(element, before);
            } else {
                parent.appendChild(element);
            }
        }
        
        
        this.fireEvent('appendTo', {
            type: 'appendTo',
            target: parent
        });
    },
    
    get: function(key) {
        var configs = this._configs || {};
        var el = configs.element; // avoid loop due to 'element'
        if (el && !configs[key] && !pega.lang.isUndefined(el.value[key]) ) {
            return el.value[key];
        }

        return AttributeProvider.prototype.get.call(this, key);
    },

    setAttributes: function(map, silent){
        var el = this.get('element');
        for (var key in map) {
            // need to configure if setting unconfigured HTMLElement attribute 
            if ( !this._configs[key] && !pega.lang.isUndefined(el[key]) ) {
                this.setAttributeConfig(key);
            }
        }

        // set based on configOrder
        for (var i = 0, len = this._configOrder.length; i < len; ++i) {
            if (map[this._configOrder[i]] !== undefined) {
                this.set(this._configOrder[i], map[this._configOrder[i]], silent);
            }
        }
    },

    set: function(key, value, silent) {
        var el = this.get('element');
        if (!el) {
            this._queue[this._queue.length] = ['set', arguments];
            if (this._configs[key]) {
                this._configs[key].value = value; // so "get" works while queueing
            
            }
            return;
        }
        
        // set it on the element if not configured and is an HTML attribute
        if ( !this._configs[key] && !pega.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key);
        }

        return AttributeProvider.prototype.set.apply(this, arguments);
    },
    
    setAttributeConfig: function(key, map, init) {
        var el = this.get('element');

        if (el && !this._configs[key] && !pega.lang.isUndefined(el[key]) ) {
            _registerHTMLAttr.call(this, key, map);
        } else {
            AttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
        }
        this._configOrder.push(key);
    },
    
    getAttributeKeys: function() {
        var el = this.get('element');
        var keys = AttributeProvider.prototype.getAttributeKeys.call(this);
        
        //add any unconfigured element keys
        for (var key in el) {
            if (!this._configs[key]) {
                keys[key] = keys[key] || el[key];
            }
        }
        
        return keys;
    },

    createEvent: function(type, scope) {
        this._events[type] = true;
        AttributeProvider.prototype.createEvent.apply(this, arguments);
    },
    
    init: function(el, attr) {
        _initElement.apply(this, arguments); 
    }
};

var _initElement = function(el, attr) {
    this._queue = this._queue || [];
    this._events = this._events || {};
    this._configs = this._configs || {};
    this._configOrder = []; 
    attr = attr || {};
    attr.element = attr.element || el || null;

    this.DOM_EVENTS = {
        'click': true,
        'dblclick': true,
        'keydown': true,
        'keypress': true,
        'keyup': true,
        'mousedown': true,
        'mousemove': true,
        'mouseout': true, 
        'mouseover': true, 
        'mouseup': true
    };

    var isReady = false;  // to determine when to init HTMLElement and content

    if (pega.lang.isString(el) ) { // defer until available/ready
        _registerHTMLAttr.call(this, 'id', { value: attr.element });
    }

    if (Dom.get(el)) {
        isReady = true;
        _initHTMLElement.call(this, attr);
        _initContent.call(this, attr);
    } 

    pega.util.Event.onAvailable(attr.element, function() {
        if (!isReady) { // otherwise already done
            _initHTMLElement.call(this, attr);
        }

        this.fireEvent('available', { type: 'available', target: attr.element });  
    }, this, true);
    
    pega.util.Event.onContentReady(attr.element, function() {
        if (!isReady) { // otherwise already done
            _initContent.call(this, attr);
        }
        this.fireEvent('contentReady', { type: 'contentReady', target: attr.element });  
    }, this, true);
};

var _initHTMLElement = function(attr) {
    /**
     * The HTMLElement the Element instance refers to.
     * @attribute element
     * @type HTMLElement
     */
    this.setAttributeConfig('element', {
        value: Dom.get(attr.element),
        readOnly: true
     });
};

var _initContent = function(attr) {
    this.initAttributes(attr);
    this.setAttributes(attr, true);
    this.fireQueue();

};

/**
 * Sets the value of the property and fires beforeChange and change events.
 * @private
 * @method _registerHTMLAttr
 * @param {pega.util.Element} element The Element instance to
 * register the config to.
 * @param {String} key The name of the config to register
 * @param {Object} map A key-value map of the config's params
 */
var _registerHTMLAttr = function(key, map) {
    var el = this.get('element');
    map = map || {};
    map.name = key;
    map.method = map.method || function(value) {
        el[key] = value;
    };
    map.value = map.value || el[key];
    this._configs[key] = new pega.util.Attribute(map, this);
};

/**
 * Fires when the Element's HTMLElement can be retrieved by Id.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> available<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('available', handler);</code></p>
 * @event available
 */
 
/**
 * Fires when the Element's HTMLElement subtree is rendered.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> contentReady<br>
 * <code>&lt;HTMLElement&gt;
 * target</code> the HTMLElement bound to this Element instance<br>
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('contentReady', handler);</code></p>
 * @event contentReady
 */

/**
 * Fires before the Element is appended to another Element.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> beforeAppendTo<br>
 * <code>&lt;HTMLElement/Element&gt;
 * target</code> the HTMLElement/Element being appended to 
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('beforeAppendTo', handler);</code></p>
 * @event beforeAppendTo
 */

/**
 * Fires after the Element is appended to another Element.
 * <p>See: <a href="#addListener">Element.addListener</a></p>
 * <p><strong>Event fields:</strong><br>
 * <code>&lt;String&gt; type</code> appendTo<br>
 * <code>&lt;HTMLElement/Element&gt;
 * target</code> the HTMLElement/Element being appended to 
 * <p><strong>Usage:</strong><br>
 * <code>var handler = function(e) {var target = e.target};<br>
 * myTabs.addListener('appendTo', handler);</code></p>
 * @event appendTo
 */

pega.augment(pega.util.Element, AttributeProvider);
})();

pega.register("element", pega.util.Element, {version: "2.5.1", build: "984"});
//static-content-hash-trigger-GCC
var getElementsByQuery = function(root, query){
   var eleNodeList = root.querySelectorAll(query);
    if(eleNodeList.length==0) {
        return null;
    }else {
        var eleObjList = [];
        for(var i=0;i < eleNodeList.length;i++) {
            eleObjList.push(eleNodeList[i]);
        }
        return eleObjList;
    }
}

/**
 * @public This function is responsible for obtaining all of the iframes (embedded as well as siblings). It calls
 * a recursive private function above called _getFrameListHelper().
 * @param windowObj - the window to begin gathering the list of frames
 */
pega.util.Dom.getFrames = function(windowObj) {
    var _getFrameListHelper = function(windowObj, windowList) {
        if (!windowList) {
            windowList = [];
        }
        windowList.push(windowObj)

        for(var i = 0; i < windowObj.frames.length; i++) {
            var currentWindow = windowObj.frames[i];

            // Checking for cross-domain iframes
            try {
                // Checking for name to make sure it's same domain
                // Different domains would not reveal this attribute
                // 	BUG-431310 set currentWindow.name to allow try catch to remain after google CC minification 
                currentWindow.name = currentWindow.name
            } catch(e) {
                continue;
            }
            _getFrameListHelper(currentWindow, windowList);	        
        }

        return windowList;
    };

    return _getFrameListHelper(windowObj);
}

/*
 @public  - Function to get all the html elements that have the given id in their id attribute
 @param $string$id - id of the element(s) to search for
 @param $HTML Element or document$root - an html element or the document element.
 @param.optional $string$tag - The tag name of the elements being collected
 @return $array - An array of elements that have the given id in their id attribute.
 */
pega.util.Dom.getElementsById = function(id, root, tag) {
    // Not sure of the pattern followed for 'id' value (found id's starting with '$' and '_'), hence giving fix specific to BUG-271924. Need to investigate later.
  	// Previous regex: !/^[a-zA-Z$][\w:.$-]*$/ 
    if (!id || /^[0-9]/.test(id))
        return null;
    var id_uppercase = id.toUpperCase();
    if (!root) {
        root = document;
    }
    var elements = new Array();
    var bHasTag = false;
    var tagName = "";
    if (tag != null && typeof (tag) != "undefined") {
        bHasTag = true;
        if (pega.util.Event.isSafari) {
            tagName = tag.toLowerCase();
        } else {
            tagName = tag.toUpperCase();
        }
    }
    
    try{
        /*SE-21691/ BUG-197823 : This fix is purely for IPAD OS 7.0.4 version. As, querySelectorAll is returning incorrect results in this IOS version falling back to document.evaluate by throwing exception.*/
        if(navigator.userAgent.indexOf("iPad") > 0 && navigator.userAgent.indexOf("OS 7_0_4") > 0){
          if (document.evaluate) {
            var search = "";
            if (bHasTag)
              search = ".//" + tagName + "[@id]";
            else
              search = ".//*[@id]";
            var result = document.evaluate(search, root, null, 0, null);
            var elem = result.iterateNext();
            while (elem) {
              if (elem.getAttribute("id").toUpperCase() != id_uppercase) {
                elem = result.iterateNext();
                continue;
              }
              elements[elements.length] = elem;
              elem = result.iterateNext();
            }
          } 
          if (elements.length == 0)
            return null;
          return elements;
        } else if(typeof root.querySelectorAll != "undefined"){
                /* BUG-224986 - START: Below changes are made to improve performance - code in catch block is consume more time than querySelectorAll */
                var e = [];
                if(root.getElementById && !root.getElementById(id)) {/* if there is no element with id attribute, do not execute querySelectorAll to save time */
                    return null;
                }
                if(id && id.indexOf(".") == -1 && id.indexOf("$") == -1 && id.indexOf("@") == -1) {/* If id has dot(.) or dollar($) then code in if block throws error so alternate is in else block */
                    e = getElementsByQuery(root,tagName+"#"+id);
                } else {
                    e = getElementsByQuery(root,tagName+"[id='"+id+"']");
                }
                return e;
        } else throw "undefined";
    }catch(e){
        console.log("Exception caught in getElementsById");
    }
};

/*
 @param {String} | atr : A string representing the attribute node
 @param {String} | val : A string representing the value of the attribute node we're searching for
 @param {String} | tag (optional): The tag name of the elements being collected
 @param {String/HTMLElement} | root (optional): The HTMLElement or an ID to use as the starting point
 @return {Array} | An array of elements that have the given attribute/value pair match
 */

pega.util.Dom.getElementsByAttribute = function(atr, val, tag, root) {

  if (!val)
        return null;

    if (!root)
        root = document;

    var tagName = "";
    if (tag != null && typeof (tag) != "undefined") {
        if (pega.util.Event.isSafari) {
            tagName = tag.toLowerCase();
        } else {
            tagName = tag.toUpperCase();
        }
    }
    try {
        if(typeof root.querySelectorAll != "undefined"){
            var elements = [];
            if(val == "*"){
                elements = getElementsByQuery(root,tagName+"["+atr+"]");
            } else {
                elements = getElementsByQuery(root,tagName+"["+atr+"='"+val+"']");
            }
            elements = (elements == null)?[]:elements;
            return elements;
        }
    } catch(e){
        console.log("Exception caught in getElementsByAttribute");
    } 

};

/* All these functions are in the pega.util.Dom class. Usage:pega.util.Dom.getInnerText(element) etc.. */

/* Based on a similar extension that was written for Prototype */

/**
 * Gets the InnerText of the given Element.
 * @method setInnerText
 * @param {HTMLElement) An element
 * @return {text} Text content
 */
pega.util.Dom.getInnerText = function(element) {
    return element.innerText && !window.opera ? element.innerText
            : pega.util.Dom.findInnerText(element);
};

/**
 * Sets the given String as an InnerText of the given Element.
 * @method setInnerText
 * @param {HTMLElement) An element
 * @param {text) Text to be inserted as InnerText
 */

pega.util.Dom.setInnerText = function(element, text) {
    element.textContent === undefined ? element.innerText = text : element.textContent = text;
};

/**
 * Replica for getBoundingClientRect()
 * @method getCoords
 * @param {HTMLElement) An element
 * @return {object}
 */
pega.util.Dom.getCoords = function(element) {
    // Bug-115175 IE8 Standards Mode disregards the display:none. This is a fix for the issue.
    var visible = true;
    if (element.style.display == "none")
        visible = false;
    var coords = {
        left: 2,
        top: 2,
        right: element.offsetWidth,
        bottom: element.offsetHeight
    };
    while (element && typeof element.offsetParent != "unknown" && visible) {
        coords.left += element.offsetLeft;
        coords.top += element.offsetTop;
        element = element.offsetParent;
        if (element)
            visible = visible && element.style.display != "none";
    }
    if (visible) {
        coords.right += coords.left;
        coords.bottom += coords.top;
    } else {
        coords.right = coords.left;
        coords.bottom = coords.top;
    }
    return coords;
};

/**
 * Funtion to find the outerHTML of an Element
 * @method getOuterHTML
 * @param {element} HTML Element
 * @return the Inner HTML
 */
pega.util.Dom.getOuterHTML = function(element) {
    if (!pega.util.Event.isIE) {
        var _emptyTags = {
            "IMG": true,
            "BR": true,
            "INPUT": true,
            "META": true,
            "LINK": true,
            "PARAM": true,
            "HR": true
        };
        var attrs = element.attributes;
        var str = "<" + element.tagName;
        for (var i = 0; i < attrs.length; i++)
            str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
        if (_emptyTags[element.tagName])
            return str + ">";
        return str + ">" + element.innerHTML + "</" + element.tagName + ">";
    } else
        return element.outerHTML;
};

/**
 * Funtion to fire event
 * @method fireEvent
 * @param {element} HTML Element on which event has to be fired
 * @param {event} eventname eg: change
 * @return the Inner HTML
 */
pega.util.Event.fireEvent = function(control, ev, ref) {
    if (ev.substring(0, 2).toLowerCase() == "on") {
        ev = ev.substring(2);
    }
    if (control.addEventListener) {
        if (!ref) {
            ref = window;
        }

        if (ev == "click" || ev == "mousedown" || ev == "mouseup" || ev == "mouseover" || ev == "mousemove" || ev == "mouseout" || ev == "dblclick") {
            var evt = ref.document.createEvent("MouseEvents");
            evt.initMouseEvent(ev, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        } else if (ev == "focusin" || ev == "focusout") {
            var evt = ref.document.createEvent("Events");
            evt.initEvent(ev, true, true, window, null);
        } else if (ev == "load" || ev == "unload" || ev == "abort " || ev == "error" || ev == "select" || ev == "change" || ev == "submit" || ev == "reset" || ev == "resize" || ev == "scroll" || ev == "focus" || ev == "blur") {
            var evt = ref.document.createEvent("Events");
            evt.initEvent(ev, false, false)
        } else if (ev == "DOMFocusIn" || ev == "DOMFocusOut" || ev == "DOMActivate") {
            var evt = ref.document.createEvent("UIEvents");
            evt.initUIEvent(ev, false, false, window, 1)
        }
        control.dispatchEvent(evt);
    } else if (control.attachEvent) {
        control.fireEvent("on" + ev);
    }
};

/*
 @public  - Function to get all the html elements that have the given name in their name attribute
 @param $string$elemName - name of the element(s) to search for
 @param $HTML Element or document$root - an html element or the document element.
 @param.optional $string$tag - The tag name of the elements being collected
 @return $array -  An array of elements that have the given name in their name attribute.
 */
pega.util.Dom.getElementsByName = function(elemName, root, tag) {
    if (!elemName)
        return null;

    if (!root)
        root = document;

    var bHasTag = false;
    var tagName = "";
    if (tag != null && typeof (tag) != "undefined") {
        bHasTag = true;
        if (pega.util.Event.isSafari) {
            tagName = tag.toLowerCase();
        } else {
            tagName = tag.toUpperCase();
        }
    }
    try {
        if(typeof root.querySelectorAll != "undefined"){
            var elements = [];
            elements = getElementsByQuery(root,tagName+'[name="'+elemName+'"]');
            return elements;
        }
    } catch(e){
        console.log("Exception caught in getElementsByName");
    }   
};

/*
 @public  - Function to get all the html elements that have the given name in their id or name attribute.This function is equivalent to document.all
 @param $string$id - id of the element(s) to search for
 @param $HTML Element or document$root - an html element or the document element.
 @param.optional $string$tag - The tag name of the elements being collected
 @return $array -  An array of elements that have the given id in their id or name attribute.
 */
pega.util.Dom.getElementsByIdOrName = function(key, root, tag) {
    if (!key)
        return null;
    if (!root)
        root = document;

    var elements = new Array();
    var bHasTag = false;
    var tagName = "";
    if (tag != null && typeof (tag) != "undefined") {
        bHasTag = true;
        if (pega.util.Event.isSafari) {
            tagName = tag.toLowerCase();
        } else {
            tagName = tag.toUpperCase();
        }
    }
    try{
        if(typeof root.querySelectorAll != "undefined"){
            var elements = [];
          	var query = tagName+"[id='"+key+"']"+","+tagName+"[name='"+key+"']";
            elements = getElementsByQuery(root,query);
            return elements;
        } 
    } catch(e){
        console.log("Exception caught in getElementsByIdOrName");
    }
    

};


/*
 @public  - Function to get the first XmlNode that matches the XPath expression.
 @param $XML$doc - XMLDocument object
 @param $string$sXPath XPath expression.
 @return $object -   first XmlNode that matches the XPath expression.
 */

pega.util.Dom.selectSingleNode = function(doc, sXPath) {
    if (typeof XPathEvaluator == "undefined") {
        var oResult = doc.selectNodes(sXPath);
        if (oResult && oResult.length > 0)
            return oResult[0];
        else
            return null;
    } else {
        var oResult = doc.evaluate(sXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (oResult != null) {
            return oResult.singleNodeValue;
        }
    }

    return null;
};



/*
 @public  - Function that performs an in-place updation of a DOM element's style, preserving order and taking into consideration event groups
 @param $HTMLElement$element - element on which to add/remove style
 @param $String$eventType - the event type that triggers this change style call
 @param.optional $String$styleText - the style text to set
 @return $boolean - whether the operation is performed or not
 */
pega.util.Dom.changeStyle = function(element, eventType, styleText) {
    // Data structure that categorises event groups - focus/iefocus/mouse, along with their intended operation - add/remove.
    // Augment this structure appropriately instead of adding conditions
    var events = {
        "focusevent": {
            "add": "focus",
            "remove": "blur"
        },
        "iefocusevent": {
            "add": "focusin",
            "remove": "focusout"
        },
        "mouseevent": {
            "add": "mouseover",
            "remove": "mouseout"
        }
    };

    element.styleArr = element.styleArr || []; // An array instead of  an object since we want to preserve order
    // Push default style into the array
    if (element.styleArr.length == 0) {
        element.styleArr.push({
            "eventGroup": "default",
            "style": element.style.cssText
        });
    }

    var addEventType = false;
    var removeEventType = false;
    var eventGroup;
    for (eventGroup in events) {
        if (events[eventGroup].add == eventType) {
            addEventType = true;
            break;
        } else if (events[eventGroup].remove == eventType) {
            removeEventType = true;
            break;
        }
    }

    if (addEventType) {
        element.styleArr.push({
            "eventGroup": eventGroup,
            "style": styleText
        });
    } else if (removeEventType) {
        var actionIndex = -1;
        var len = element.styleArr.length;
        for (var i = 0; i < len; i++) {
            if (element.styleArr[i].eventGroup == eventGroup) {
                actionIndex = i;
                break;
            }
        }

        if (actionIndex != -1) {
            element.styleArr.splice(actionIndex, 1);
        }
    } else {
        // Neither an add nor a remove operation. Check the events data structure
        return false;
    }
    // Creating a new style string
    var styleStr = "";
    for (var i = 0; i < element.styleArr.length; i++) {
        styleStr += ";" + element.styleArr[i].style;
    }
    element.style.cssText = styleStr;
    return true;
}

/*
 @public  - Function that removes the element from the dom
 @param $HTMLElement$element - element to be removed
 */
pega.util.Dom.removeNode = function(element) {
    if (element.removeNode) {
        element.removeNode(true);
    } else {
        element.parentNode.removeChild(element);
    }
}

/*
 @public  - Function that gets data for drag/drop
 @param $event object $eventObj - drag event object
 */
pega.util.Event.getDragData = function(eventObj) {
    var dataTransferObj = eventObj.dataTransfer,
            desktopWindow = pega.desktop.support.getDesktopWindow();

    if (!dataTransferObj)
    {
        return;
    }
    var dragDataValue = dataTransferObj.getData("Text"),
            effectAllowedValue,
            dropEffectValue = dataTransferObj.dropEffect;
    
    try {
        effectAllowedValue = dataTransferObj.effectAllowed;
    } catch(ex) {}

    if (!dragDataValue)
    {
        dragDataValue = desktopWindow.dragData;
    }
    if (!effectAllowedValue || effectAllowedValue.toLowerCase() == "none")
    {
        effectAllowedValue = desktopWindow.effectAllowed;
    }
    if (!dropEffectValue || dropEffectValue.toLowerCase() == "none")
    {
        dropEffectValue = desktopWindow.dropEffect;
    }

    return {
        dragData: dragDataValue,
        effectAllowed: effectAllowedValue,
        dropEffect: dropEffectValue
    };
}

/*
 @public  - Function that sets data for drag/drop
 @param $event object $eventObj - drag-event object
 @param $object $obj - object that holds drag event data
 */
pega.util.Event.setDragData = function(eventObj, obj) {
    var dataTransferObj,
            desktopWindow = pega.desktop.support.getDesktopWindow();
    if (eventObj)
    {
        dataTransferObj = eventObj.dataTransfer;
    }
    if (!obj)
    {
        desktopWindow.dragData = null;
        desktopWindow.effectAllowed = null;
        desktopWindow.dropEffect = null;
        return;
    }
    if (!dataTransferObj)
    {
        return;
    }
    if (obj.dragData !== undefined)
    {
        dataTransferObj.setData("Text", obj.dragData);
        desktopWindow.dragData = obj.dragData;
    }
    if (obj.effectAllowed)
    {
        dataTransferObj.effectAllowed = obj.effectAllowed;
        desktopWindow.effectAllowed = obj.effectAllowed;
    }
    if (obj.dropEffect)
    {
        dataTransferObj.dropEffect = obj.dropEffect;
        desktopWindow.dropEffect = obj.dropEffect;
    }

};
//static-content-hash-trigger-GCC
pega.util.Dom.getElementsBy = function(method, tag, root, apply) {
            tag = tag || '*';

            if (typeof root == "string" || !root) { // id or null
                root = document.getElementById(root);
            }
            if (!root) {
                root = document;
            }
            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply(elements[i]);
                    }
                }
            }

            
            return nodes;
        }

/*
 @public  - Function to removae all the html elements with a given tag name.  This function wraps Dom.getElementsBy(....)
 @param method <Function> - A boolean method for testing elements which receives the element as its only argument.
 @param tag <String> (optional) The tag name of the elements being collected
 @param root <String | HTMLElement> (optional) The HTMLElement or an ID to use as the starting point
 @param apply <Function> (optional) A function to apply to each element when found
 @return $object$ Array of HTMLElements
 */
pega.util.Dom.removeElements = function(method, tag, root, apply) {

    arrEl = pega.util.Dom.getElementsBy(method, tag, root, apply);
    for (i = arrEl.length; i > 0; i--) {
        arrEl[i - 1].parentNode.removeChild(arrEl[i - 1]);
        arrEl[i - 1] = null;
    }

}

/**
 * Remove the Scripts
 * @method stripScripts
 * @param {htmlText} HTML Text
 * @return the Modified HTMLText
 */
pega.util.Dom.stripScripts = function(htmlText) {
    return htmlText.replace(new RegExp('(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)', 'img'), '');
};

/**
 * Returns the unescape HTML
 * @method unescapeHTML
 * @param {htmlTextVal} HTML Text
 * @return the unescape HTML
 */
pega.util.Dom.unescapeHTML = function(htmlTextVal) {
    var div = document.createElement('div');
    div.innerHTML = pega.util.Dom.stripTags(htmlTextVal);
    var childArray = new Array(div.childNodes);

    return div.childNodes[0] ? (div.childNodes.length > 1 ?
            pega.util.Dom.inject(childArray, '', function(memo, node) {
                return memo + node.nodeValue
            }) : div.childNodes[0].nodeValue) : '';
};

/**
 * @method stripTags
 * @param {textVal}
 * @return the HTML with out tags
 */
pega.util.Dom.stripTags = function(textVal) {
    return textVal.replace(/<\/?[^>]+>/gi, '');
};

pega.util.Dom.inject = function(childNodeArray, memo, iterator) {
    childNodeArray.each(function(value, index) {
        memo = iterator(memo, value, index);
    });
    return memo;
};

/**
 * Function to find the innerText of an Element
 * @method findInnerText
 * @param {element} HTML Element
 * @return the innerText
 */
pega.util.Dom.findInnerText = function(element) {
    var html = pega.util.Dom.stripScripts(element.innerHTML);
    var escapeHTML = pega.util.Dom.unescapeHTML(html);
    return escapeHTML.replace(/[\n\r\s]+/g, ' ');
};

pega.util.Dom.clearEvents = function(oRoot, bRecursive) {

    clearEventProps =
            function(oEl) {
                for (propName in oEl) {
                    if (propName.indexOf("on") != -1) {
                        try {
                            // set value
                            var prop = eval("oEl." + propName + "=" + value);
                        } catch (e) {
                        }
                    }
                }
            }

    innerClearEvents =
            function(root, value, bRecursive) {

                var oEls = $(root).children();
                for (var i = 0; i < oEls.length; i++) {
                    var oEl = oEls[i];
                    if (bRecursive) {
                        if ($(oEl).children().first()[0]) {
                            innerClearEvents(oEl, value, bRecursive);
                        }
                    }

                    clearEventProps(oEl);
                }
            }

    if (arguments.length < 2) {
        bRecursive = false;
    }

    if (pega.lang.isObject(oRoot.forms) && pega.lang.isObject(oRoot.anchors)) {
        oRoot = oRoot.getElementsByTagName("HTML")[0];
    }

    var oEls = $(oRoot).get();
    if (pega.lang.isArray(oEls)) {
        for (var i = 0; i < oEls.length; i++) {
            var oEl = oEls[i];
            innerClearEvents(oEl, null, bRecursive);
            clearEventProps(oEl);
        }
    } else {
        innerClearEvents(oEls, null, bRecursive);
        clearEventProps(oEls);
    }

}

/* takes an element and updated its innerHTML by brute force.
 @param Object$inputField - element whoose innerHTML has to be updated
 
 */
pega.util.Dom.updateInnerHTML = function(inputField) { // if the inputField ID string has been passed in, get the inputField object
    if (typeof inputField === "string") {
        inputField = document.getElementById(inputField);
    }
    if (inputField.type === "select-one") {
        while (inputField.options === undefined) {
            var opts = inputField.options;
        }
        var salIndex = inputField.selectedIndex;
        for (var i = 0; i < inputField.options.length; i++) {
            if (i !== salIndex && (inputField.options[i].getAttribute("selected") != null)) {
                inputField.options[i].attributes.removeNamedItem("selected");
            }
            if (i === salIndex) {
                inputField.options[salIndex].setAttribute("selected", "selected");
            }
        }
    } else if (inputField.type === "text") {
        inputField.setAttribute("value", inputField.value);
    } else if (inputField.type === "textarea") {
        /*BUG-120111: If the content inside text area has any tags, then in IE innerHTML returns errors. So, using innerText only in IE. */
        if (pega.util.Event.isIE) {
            inputField.innerText = inputField.value;
        } else {
            inputField.innerHTML = inputField.value;
        }
        //inputField.setAttribute("value",inputField.value);
    } else if ((inputField.type === "checkbox") || (inputField.type === "radio")) {
        if (inputField.checked) {
            inputField.setAttribute("checked", "checked");
        } else {
            inputField.removeAttribute("checked");
        }
    }
};

/* gets all the input,select and textarea in passed element
 updates innerHTML of all elements by brute force
 required for Firefox and Safari (IE handles this on it's own)
 @param Object$elem - element holding all input,select and textarea elements
 */

pega.util.Dom.updateInnerHTMLForFields = function(elem) {
    var inputEle = elem.getElementsByTagName('input');
    var selectEle = elem.getElementsByTagName('select');
    var textAreaEle = elem.getElementsByTagName('textarea');
    var field_sets = new Array(inputEle, selectEle, textAreaEle);
    for (var x = 0; x < field_sets.length; x++) {
        var set = field_sets[x];
        for (var y = 0; y < set.length; y++) {
            pega.util.Dom.updateInnerHTML(field_sets[x][y]);
        }
    }
};
//static-content-hash-trigger-GCC
/* @package Pega namespace declarations */
    try{
        pega.u   = pega.namespace("pega.ui"); 
        pega.t   = pega.namespace("pega.tools");
        pega.d   = pega.namespace("pega.desktop"); 
        pega.ud  = pega.namespace("pega.uidesign");
        pega.u.wp  = pega.namespace("pega.ui.WindowPane");
    }
    catch(e) {}
/****************************************************************************************
* Hashtable - 
*           - 
*****************************************************************************************/

/**
    @constructor

    This is a Javascript implementation of the Java Hashtable object.
                    
   
     Hashtable()
              Creates a new, empty hashtable
                    
    Method(s):
     void clear() 
              Clears this hashtable so that it contains no keys. 
     boolean containsKey(String key) 
              Tests if the specified object is a key in this hashtable. 
     boolean containsValue(Object value) 
              Returns true if this Hashtable maps one or more keys to this value. 
     Object get(String key) 
              Returns the value to which the specified key is mapped in this hashtable. 
     boolean isEmpty() 
              Tests if this hashtable maps no keys to values. 
     Array keys() 
              Returns an array of the keys in this hashtable. 
     void put(String key, Object value) 
              Maps the specified key to the specified value in this hashtable. A NullPointerException is thrown is the key or value is null.
     Object remove(String key) 
              Removes the key (and its corresponding value) from this hashtable. Returns the value of the key that was removed
     int size() 
              Returns the number of keys in this hashtable. 
     Array values() 
              Returns a array view of the values contained in this Hashtable. 
                            
*/

pega.namespace("pega.tools");


/*
@private - Describes hastable object.
@param assocArray - optionally use an associative array as the beginning of your hashtable.
@hide
*/

pega.tools.Hashtable = function(assocArray) {
    if (!assocArray) this.hashtable= new Object();
    else this.hashtable = assocArray;
    
    //for(var i in assocArray) {
	//this.hashtable[i] = assocArray[i];
   // }
    
};

              
/*=======Private methods for internal use only========*/
           
/*
@public - Clears the hashtable.
@return $void$
*/     
pega.tools.Hashtable.prototype.clear = function(){
    this.hashtable= new Object();
}
                
/*
@protected
@hide - Checks if hashtable contains the passed key.
@param $String$key - Specifies key.
@return $Boolean$ - True if exists, else false.
*/               
pega.tools.Hashtable.prototype.containsKey = function(key){
    var exists= false;
    for (var i in this.hashtable) {
        if (i== key && this.hashtable[i] != null) {
            exists= true;
            break;
        }
    }
    return exists;
}
                
/*
@public - Checks if hashtable contains the passed value.
@param $String$key - Specifies value.
@return $Boolean$ - True if exists, else false.
*/
pega.tools.Hashtable.prototype.containsValue = function(value){
    var contains= false;
    if (value != null) {
        for (var i in this.hashtable) {
            if (this.hashtable[i]== value) {
                contains= true;
                break;
            }
        }
    }
    return contains;
}
              
/*
@protected
@hide - Gets the hashtable entry for passed key.
@param $String$key - Specifies key.
@return $Object$ - Returns the hashtable entry.
*/               
pega.tools.Hashtable.prototype.get = function(key){
    return this.hashtable[key];
}
 
/*
@public
@hide - Checks if hashtable is empty.
@return $Boolean$ - True if empty else false.
*/               
pega.tools.Hashtable.prototype.isEmpty = function(){
    return (this.size() == 0) ? true : false;
}

/*
@private
@hide - Gets all hashtable keys.
@return $Object$ - Returns hashtable keys as an array.
*/               
pega.tools.Hashtable.prototype.keys = function(){
    var keys= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            keys.push(i);
    }
    return keys;
}

/*
@public
@hide - Adds entries (key-value) to hashtable.
@param $String$key - Specifies key.
@param $String$value - Specifies value.
@return $Object$ - True if added succesfully.
*/               
           
pega.tools.Hashtable.prototype.put = function(key, value){
	if (key== null || value== null) {

		throw "NullPointerException {" + key + "}, {" + value + "}";
	}else{
		this.hashtable[key]= value;
		return true;
	}
}
 
/*
@public
@hide - Removes the hashtable entry given the key.
@param $String$key - Specifies key.
@return $Object$ - Entry removed from hashtable.
*/               
pega.tools.Hashtable.prototype.remove = function(key){
    var rtn= this.hashtable[key];
    if(rtn != null && typeof rtn != "undefined"){
      this.hashtable[key]= null;
    }
    return rtn;
}

/*
@private
@hide - Function that calculates the hashtable size.
@return $Integer$ - Returns hashtable size.
*/                
pega.tools.Hashtable.prototype.size = function(){
    var size= 0;
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            size ++;
    }
    return size;
}
  
/*
@protected
@hide - Converts the hashtable values to string type.
@return $String$ - Returns the converted values.
*/              
pega.tools.Hashtable.prototype.toString = function(){
    var result= "";
    for (var i in this.hashtable)
    {      
        if (this.hashtable[i] != null) 
            result += "{" + i + "},{" + this.hashtable[i] + "}\n";   
    }
    return result;
}
              
/*
@protected
@hide - Function that returns hashtable values.
@return $Object$ - Returns set of values.
*/  
pega.tools.Hashtable.prototype.values = function(){
    var values= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            values.push(this.hashtable[i]);
    }
    return values;
}

/********************************************
*	LEGACY HANDLERS 		
********************************************/

var Hashtable = function() {
	Hashtable.superclass.constructor.call(this);	
}
pega.lang.extend(Hashtable, pega.tools.Hashtable);
//static-content-hash-trigger-GCC
pega.tools.SUtils=
{			
	/*
	@protected- Trims leading and trailing whitespace from a string.
	@param $String$strTrim– String to trim
	@return $String$ - returns formatted string.
	*/
	trim:function(strTrim) {

		if (typeof(strTrim) == 'string') {
	 		strTrim= strTrim.replace(/^[\s]+/g,"");      // remove leading spaces
  			strTrim= strTrim.replace(/[\s]+$/g,"");      // remove trailing spaces
		}
  		return strTrim;
    },

	/*
	@protected - Internal function to reformat a string, like replace.
	@param $String$inputString – string to be reformated.
	@param $String$key – pattern to look for to be replaced (everyone found will be replaced.)
	@param $String$substitute – pattern to be used to replace the found key(s).
	@return $String$ - string that has the substitutions.
	*/
	reformat: function(inputString, key, substitute) {
		if (inputString== null) return null;
         		var theArray= inputString.split(key);
    		var outputString= theArray.join(substitute);
    		return(outputString);
	}

}

/* For backward compatibility with global trim references */
var trim = pega.tools.SUtils.trim;
//static-content-hash-trigger-GCC
//<!-- <HTML> -->
// <SCRIPT>
//safeurl.js


/* 
@package Safe URL provides functions to assemble, encode and return URLs and Query strings.  Query string parameters are added to the Safe URL as individual name/value pairs or by parsing an existing query string.  A clone function is provided to copy a safe URL to the current window.  To avoid multiple encloding Safe URL expects all input parameters are unencoded.
*/

SafeURL.prototype= new Hashtable;	

/*
@constructor
@api - This function is used to create a safeURL object.
@param $String$ActivityName - Optional name of the activity to use when building full URL via toURL() method. The activity name should include any required class prefix.
@param $String$reqURI - Optional requestURI.
@return $void$
*/
function SafeURL(ActivityName, reqURI) {	
    this.hashtable= {};
    this.name= 'safeURL';

    if(ActivityName != undefined && ActivityName != null && ActivityName != "") {
        this.setActivityAction(ActivityName);
    }
    if(arguments.length > 1 && reqURI != "") {
        this.put("pxReqURI", reqURI);
    }
}

/* 
@api - This function will copy the name/value pairs of another SafeURL into the safeURL object.  The bClear parameter defines if the existing values in the SafeURL object are cleared before the copy.
@param $Object$oSafeURL Target SafeURL object.
@param $boolean$bClear If true clear the target SafeURL before copy.  Default is false.
@return $void$
*/
SafeURL.prototype.copy = function(oSafeURL, bClear) {
    if (arguments.length > 1 && bClear) {
        for(var i in oSafeURL.hashtable) {
			var value = oSafeURL.get(i);
			if(value != null && typeof value != "undefined") {
		        this.put(i, value);
		    }    
        }
    }
    for(var i in oSafeURL.hashtable) {
		var value = oSafeURL.get(i);
		if(value != null && typeof value != "undefined") {
			this.put(i, value);
		}	
    }
}

/*
@api - This function is used to convert the object into a string of key - value pairs(Excluding the pyActivity or pyStream). Each separated by "&" that will be used in URL concatenation and then returns the encoded result.
@return $String$ - Query String with escape.
*/
SafeURL.prototype.toQueryStringWithEscape= function(){
    return this.toQueryString(false);
}

/*
@api - This function is used to convert the object into a string with encoding.
@return $String$ - Query String with out escape.
*/
SafeURL.prototype.toQueryStringWithoutEscape= function(){
    return this.toQueryString(true);
}

/*
@api - This method is to nullify the safe url object to avoid memory leaks when value contained object references.
@return $void$
*/
SafeURL.prototype.nullify= function(){
    var size= this.size();
    var keys= this.keys();
    for(var i=0; i <size; i++){
        this.hashtable[keys[i]]= null;
    }
}

/*
@private - apply heuristic rule to find out if the string is encoded for HTTP.
@param value - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - URL string.
@return $Boolean$ - true if escaped, false otherwise.
*/
SafeURL.prototype.mayBeEscaped= function (value) {
	if(value == null || value == "")
		return false;
	if(value.indexOf("%20") != -1 
	|| value.indexOf("%22") != -1 
	|| value.indexOf("%23") != -1 
	|| value.indexOf("%24") != -1 
	|| value.indexOf("%25") != -1 
	|| value.indexOf("%26") != -1 
	|| value.indexOf("%27") != -1 
	|| value.indexOf("%2B") != -1 
	|| value.indexOf("%2C") != -1 
	|| value.indexOf("%2F") != -1 
	|| value.indexOf("%3A") != -1 
	|| value.indexOf("%3B") != -1
	|| value.indexOf("%3C") != -1
	|| value.indexOf("%3D") != -1
	|| value.indexOf("%3E") != -1
	|| value.indexOf("%3F") != -1
	|| value.indexOf("%40") != -1
	|| value.indexOf("%5B") != -1
	|| value.indexOf("%5C") != -1
	|| value.indexOf("%5D") != -1
	|| value.indexOf("%5E") != -1
	|| value.indexOf("%60") != -1
	|| value.indexOf("%7B") != -1
	|| value.indexOf("%7C") != -1
	|| value.indexOf("%7D") != -1
	|| value.indexOf("%7E") != -1
	) 
	{
		return true;
	}
	return false;
}
              
/*
@api - Convert SafeURL object into an encoded UN-encrypted string for HTTP post body.
@return $String$ - encoded un-encrypted POST body string.
*/
SafeURL.prototype.toEncodedPostBody= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(false, false);
//	return this.toQueryString(false, true);
}
              
/*
@api - Convert SafeURL object into an EN-coded UN-encrypted query string.
@return $String$ - un-encoded, un-encrypted URL string.
*/
SafeURL.prototype.toEncodedQueryString= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(false, false);
//	return this.toQueryString(false, true);
}
              
/*
@api - Convert SafeURL object into an UN-encoded UN-encrypted query string.
@return $String$ - un-encoded, un-encrypted URL string.
*/
SafeURL.prototype.toUnencodedQueryString= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toQueryString(true, false);
//	return this.toQueryString(true, true);
}

/*
@api - This function is used to convert the object into a query string. It takes a parameter that specifies to escape the result or not.
@param bDisableEscape - Boolean that specifies if the values should be escaped. The default is true.
@param bUnEscapeBefore - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - Equivalent query String of the object.
*/
SafeURL.prototype.toQueryString= function(bDisableEncode, bUnEscapeBefore){
    var result1= "";
    var result2= "";
    var bEncode= true;
    var bUnEscape= true;
    if (arguments.length > 0) {
        bEncode= !bDisableEncode;
    }
    if (arguments.length > 1) {
        bUnEscape= bUnEscapeBefore;
    }
    // ensure pzHarnessID is in the request if it's possible to obtain 
    // it from the DOM and if this request is an activity or stream request
    if (document && 
        ('pyActivity' in this.hashtable 
        || 'pyStream' in this.hashtable)) {
        var reqURI = this.hashtable["pxReqURI"];
        // insert Harness ID if no absolute external URI is specified
        if (!reqURI // no URI specified, must be local
            || reqURI[0] == ' ' || reqURI[0] == '/' // URI is relative to this host
            || (reqURI.indexOf(document.location.host) > -1)  // URI specifies this host
            ) {
            var idFromDOM = document.getElementById("pzHarnessID");
            if (idFromDOM && !this.hashtable.pzHarnessID) {
                this.hashtable.pzHarnessID = idFromDOM.value;
            }
        }
    }

    for (var i in this.hashtable) {
        if (i != "pxReqURI") {
            var value= this.hashtable[i];
            if(typeof(value)== 'string') {
// itkis, 11/24/08. unescape call commented out - was wrecking havoc with URL encryption. For
// example string %80% would get converted into %80 into %. Consequent encoding would convert it
// into %C2%80%25 - an error.
//				if(this.mayBeEscaped(value)) {
//debugger;
//				}
				if(bUnEscape) {
          //Added below code as part of BUG-664452 Fix and added unit test case for below code changes in pega_ui_template_icon_unit_test.js file
					try{
            value = decodeURIComponent(escape(unescape(value)));
          }
        catch(err){
            value = unescape(value);
          }
				}
                if (bEncode) {
                    value = encodeURIComponent(value); //all values are encoded only once
                }
            }
            if (i== "pyActivity" || i== "pyStream") {
                //result1= i + "=" + this.hashtable[i]; 
                result1= i + "=" + value; 
            }
            else if (this.hashtable[i] != null) {
                //result2 += "&" + i + "=" + this.hashtable[i];   
                if(typeof(value)== "object" && value.name== "safeURL") {
                    value= value.toURL();
                }
                result2 += "&" + i + "=" + value;   
            }
        }
    }
    if (result1== "") {
        if (result2== "" ) {
            return "";
        }
        else {
            return result2.substring(1, result2.length); //remove the leading '&'
        }
    }
    else {
        return result1 + result2;
    }
}
              
/*
@api - Convert SafeURL object into an encoded and then conditionally encrypted URL string.
@return $String$ - URL string.
*/
SafeURL.prototype.toEncryptedURL= function () {
	/* The SafeURL object's hashtable must contain only unencoded/unescaped components.
	   This method will not compensate for prior encoding by unescaping components!
	   It is responsibility of the caller to use unencoded values to the "put" method
	   used to build the SafeURL object! 
	   Violating this rule will lead to data corruption! 
	*/
	return this.toURL(false, false);
//	return this.toURL(false, true);
}
              
/*
@api - Calculate absolute URL from  document.location.href. Absolute URL is typically passed 
to ActiveX controls for use in AJAX requests by the controls or companion PRPC processes such
as MS Office applications. This method is preferred to calculating absolute URL based on 
pxRequestor and pxThread Clipboard objects properties. 
For explanation see PMF Bug-59718.
@return $String$ - Absolute URL string.
*/
SafeURL.prototype.toAbsoluteURL= function () {
	var href = document.location.href;

	// Search for ?pyActivity= or ?pyStream=
	var iAct = href.indexOf("?pyActivity=");
	var iStm = href.indexOf("?pyStream=");
	if(iAct > 0) {
		return href.substr(0, iAct);
	} else if(iStm > 0) {
		return href.substr(0, iStm);
	} else {
		// Find right-most '/' in URL
		for( var i=href.length-1; i>=0; --i) {
			if( href.charAt(i) == "/") {
				return href.substr(0, i);	
			}
		}
	}
	return "ABSOLUTE_URL_NOT_FOUND";
}

SafeURL.prototype.addEventSource = function(){
  try{
    var evObj = window.event;
    /*if(window.pega && pega.util && pega.util.Event && pega.util.Event.getEvent()){
      evObj = pega.util.Event.getEvent();
    }*/
    if(evObj && evObj.target){
        var closestSec = pega.ctx.dom.closest(evObj.target, "div[node_name][class*=sectionDivStyle]");
        if(closestSec){
          var secName = closestSec.getAttribute("pyclassname") +"."+ closestSec.getAttribute("node_name");
          if(secName){
            this.put("eventSrcSection", secName);
          }
        }
    }
  }catch(e){}
}

/*
@api - This function is used to convert the object into a string of key, value pairs(Including the pyActivity or pyStream), each separated by "&" that will be used in URL concatenation and then returns the encoded result.
@param bDisableEscape - Boolean that specifies if the values should be escaped. The default is true.
@param bUnEscapeBefore - Boolean that specifies if the values should be unescaped prior to final escaping. The default is false.
@return $String$ - URL form of the object.
*/
              
SafeURL.prototype.toURL= function (bDisableEscape, bUnEscapeBefore) {
	var bNoEscape = false;
  var bUnEscapePrior = true;
  var bEncryptURLs = window.pega && pega.ctx && pega.ctx.bEncryptURLs;
     
    if (arguments.length > 0) {
        bNoEscape= bDisableEscape;
    }
    if (arguments.length > 1) {
        bUnEscapePrior= bUnEscapeBefore;
    }
    
    if(window.pega && !pega.disableEventSource){
      this.addEventSource();
    } 
	  var reqURI= "";
    if (this.hashtable["pxReqURI"]) {
        reqURI= this.hashtable["pxReqURI"];
    }
    else if (typeof pega.ctx.pxReqURI != "undefined" && pega.ctx.pxReqURI !== "") {
       reqURI = pega.ctx.pxReqURI;
    }
    else if (typeof safeUrlRequestURI != "undefined") {
        reqURI= safeUrlRequestURI;
    }
    else if (typeof gRuleFormManager != "undefined" && 
             typeof gRuleFormManager.wrapperAPI== "object" &&
             typeof gRuleFormManager.wrapperAPI.safeUrlRequestURI != "undefined") {
        reqURI= gRuleFormManager.wrapperAPI.safeUrlRequestURI;
    }
	
    var queryString= this.toQueryString(bNoEscape, bUnEscapePrior);

    if (queryString== null || queryString== "")
        return reqURI;
    else {
	var delim = "?";
	var index = reqURI.indexOf("?");
	/*itkis, 3/24/10, protect against double ? in URL in all cases, not just the portlet case.
	if (index > -1)*/
	if (index > -1 && typeof(pega) !="undefined" && typeof(pega.d) !="undefined" && typeof(pega.d.isPortlet) !="undefined" && pega.d.isPortlet == true)
	{		
		delim = "&"; // in a portlet, the url can't have more than one "?". 
	}

        if (bEncryptURLs && (queryString.indexOf("pyActivity") > -1 || queryString.indexOf("pyStream") > -1)) {
            return reqURI + delim + URLObfuscation.encrypt(queryString);
        }
        else {
            return reqURI + delim + queryString;
        }
    }
}

/*
@api - This function is used to insert an entry in the HashTable object. 
@param $String$key  Specifies the key of the entry.
@param $String$key  Specifies the corresponding value to the key of the entry.
@return $Boolean$ - True if the value is put into hash table otherwise return false.
*/
SafeURL.prototype.put= function (key, value){
    try {
        if (key== undefined || key== null || value== undefined || value== null) {

            throw "NullPointerException in SafeURL.put(key,value) {" + key + "}, {" + value + "}";
       
        }else {//if(typeof(value)== 'string' || ( typeof(value)== 'object' && value.name== 'safeURL') ){ 
           
            this.hashtable[key]= value;
            return true;
        
        }/*else {
           
            throw "InvalidArgumentException :: SafeURL only accepts strings and SafeURL objects -  {" + key + "}, {" + value + "}"; 
        }*/
    }
    catch (exception) {

        window.alert(exception);
        return false;
    }
}

/*
@api - This function is used to get a value given a name.
@param $String$key  Specifies the key.
@param $String$key  Specifies the corresponding value to the key.
@return $Boolean$ - True if the value is put into hash table otherwise return false.
*/
SafeURL.prototype.get= function (key, value){
    return this.hashtable[key];
}


/*
@private - This function is used to insert a pyStream entry in the HashTable object.
@param $String$strStreamName  Stream name.
@return $void$
*/
SafeURL.prototype.setStreamAction= function(strStreamName) {
    this.put("pyStream", strStreamName);
}

/*
@public - This function is used to insert a pyActivity entry in the HashTable object.
@param $String$strActivityName  Activity name.
@return $void$
*/
SafeURL.prototype.setActivityAction= function (strActivityName) {
    // BUG-661513 using indexOf instead of startsWith API for IE compatibility.
    if(strActivityName.indexOf("pzuiactionzzz") === 0){
      this.put("pzuiactionzzz",strActivityName.substring(14));
    }else{
      this.put("pyActivity", strActivityName);
    }
}

/***********************************************************************************************
                    Global safeURL Functions
*/

//Removed isPureEncryptedURL as it is not used.

/*
@api - This function accepts a string URL - no escaped - and returns back a safeURL object. strURL can be of format http://ht-sdevserver:9090/prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format /prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format pyActivity=abc&param1=value1... the complete string 
or it can also be of the format http://www.yahoo.com/index.htm  and have no "?" chars at all
before the last "?" will be stored in a single element in hashtable with key "pxReqURI"
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/
function SafeURL_createFromURL(strURL) {
  	if (!strURL) { //TODO MDC
      strURL = window.pega && pega.ctx && pega.ctx.url;
    }
    
  	// Decode URL if needed
	var encryptedActivityParam = "pyactivitypzZZZ=",
		indexOfActivityParam = strURL.indexOf(encryptedActivityParam);
    if (indexOfActivityParam != -1) {
		var urlFirstPart = strURL.substr(0,indexOfActivityParam),
			urlSecondPart = strURL.substr(indexOfActivityParam+encryptedActivityParam.length),
			indexOfStar = urlSecondPart.indexOf("*"),
			urlThirdPart = urlSecondPart.substr(indexOfStar+1);
			
		urlSecondPart = URLObfuscation.decrypt(urlSecondPart.substr(0,indexOfStar));
		strURL = urlFirstPart + urlSecondPart + urlThirdPart;
    }
   /*HFix-9619:end*/
	/*RAIDV(BUG-136099) - Use indexOf instead of lastIndexOf to determine query string*/	
    var index= strURL.indexOf("?");
    var reqURI;
    var oSafeURL= new SafeURL();
    if (index > -1) {     
        reqURI= strURL.substr(0, index);
        oSafeURL.put("pxReqURI", reqURI);
    }

    var myParamArray= SafeURL_getNameValuePairsAsObject(strURL.substr(index + 1, strURL.length));
    for (var i in myParamArray ) {
        // if no name/value pairs in the entire url, just put the whole thing into pxReqURI
        if (myParamArray[i]== "NoNVFound") {
            oSafeURL.put("pxReqURI", strURL);
        }
        else {
            oSafeURL.put(i, myParamArray[i]);
        }
    }
    return oSafeURL;
}


/*
@api - This function accepts a obfuscated string URL - no escaped -decodes it and returns back a safeURL object.
@deprecated
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/
function SafeURL_createFromEncryptedURL(strURL) {
    return SafeURL_createFromURL(strURL)
}

/*
@api - This function accepts a Encrypted String URL with QueryString - no escaped - and returns back a safeURL object. strURL can be of format http://ht-sdevserver:9090/prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format /prweb/PRServlet?pyActivity=abc&param1=value1...
or it can also be of the format pyActivity=abc&param1=value1... the complete string 
or it can also be of the format http://www.yahoo.com/index.htm  and have no "?" chars at all
before the last "?" will be stored in a single element in hashtable with key "pxReqURI"
@param  $String$strUrl - URL in string form.
@return $Object$ - safeURL object.
*/

function SafeURL_createFromEncryptedURLwithQueryString(strURL) {
    var strDecodeUrl = "";
    var unEncryptedQueryString="";
    if (strURL.indexOf("pyactivitypzZZZ=") != -1) { 
        //Handling encrypted URL with query string 
        if (strURL.indexOf("*&") != -1) {
		var unencryptedindex= strURL.lastIndexOf("*&");
                   if (unencryptedindex> -1) {
                      var unEncryptedQueryString=strURL.substr(unencryptedindex+ 1, strURL.length - (unencryptedindex+ 2));
                      //handle encrypted string
                      var index= strURL.lastIndexOf("pyactivitypzZZZ=");
                      if (index > -1) {
                        strDecodeUrl = strURL.substr(index+16, unencryptedindex-(index+16));
                        strURL = URLObfuscation.decrypt(strDecodeUrl );

                      }
                   }
        
        
        }else{

        var index= strURL.lastIndexOf("=");
 	if (index > -1) {
            strURL = URLObfuscation.decrypt(strURL.substr(index + 1, strURL.length - (index + 2)));
         } 
      }      
   }

   if(unEncryptedQueryString!="")
   {
      strURL =strURL +unEncryptedQueryString;
   }
    var index= strURL.indexOf("?");
    var reqURI;
    var oSafeURL= new SafeURL();
    if (index > -1) {     
        reqURI= strURL.substr(0, index);
        oSafeURL.put("pxReqURI", reqURI);
    }

    var myParamArray= SafeURL_getNameValuePairsAsObject(strURL.substr(index + 1, strURL.length));
    for (var i in myParamArray ) {
        // if no name/value pairs in the entire url, just put the whole thing into pxReqURI
        if (myParamArray[i]== null) {
            oSafeURL.put("pxReqURI", i);
        }
        else {
            oSafeURL.put(i, myParamArray[i]);
        }
    }
    return oSafeURL;

          
}



/* 
@private - This function will return an array of parameter names from a string of Parameter/Values sent to activities.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Array Name/value pairs in the collection.
*/
function SafeURL_getParameterParamNameList(strParameterValue) {
    var arNames = new Array();
	try {
		var oPars = SafeURL_getNameValuePairsAsObject(strParameterValue);
		var i=0;
		for(var oP in oPars)
			arNames[i++] = oP;
	} catch(e) {}
	return arNames;

/* itkis, 01/16/09: old code preserved for reference  
    var paramNameArray= new Array;
    if (strParameterValue != null ){
        var separateParamArray= strParameterValue.split("&");
        var count= 0;
        for (var el=0; el < separateParamArray.length; el++) {
            if (separateParamArray[el] != "") {
                var splitArray= separateParamArray[el].split("=");
                // name is the first value
                paramNameArray[count]= splitArray[0];
                count += 1;
            }
        }
    }
    return(paramNameArray);
*/
}


/* 
@private - This function will return an array of Parameter Values from a string of Parameter/Values sent to activities.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Parameter list as an array.
*/
function SafeURL_getParameterParamValueList(strParameterValue) {
    var arVals = new Array();
	try {
		var oPars = SafeURL_getNameValuePairsAsObject(strParameterValue);
	    var i=0;
	    for(var oP in oPars)
	    	arVals[i++] = oPars[oP];
	} catch(e) {}
	return arVals;

/* itkis, 01/16/09: old code preserved for reference  
    var paramValueArray= new Array;
    if(strParameterValue != null){
        var separateParamArray= strParameterValue.split("&");
        var count= 0;
        for (var el=0; el < separateParamArray.length; el++) {
            if (separateParamArray[el] != "") {
                var splitArray= separateParamArray[el].split("=");
                // value is the second value
                paramValueArray[count]= splitArray[1];
                count += 1;
            }
        }
    }
    return(paramValueArray); 
*/
}

/* 
@private - This function will return  an Object with name and value.
@param $String$strParameterValue - Values of the form &ParamName=ParamValue.
@return $Object$ - Object which contains name and value.
*/
function SafeURL_getNameValuePairsAsObject(strParameterValue) {
	var sParV = strParameterValue;
    var oPars = new Object();
	try {
		var sN = "";
		var sV = "";
	    if(sParV == null || sParV == "")
			return oPars;
		var arPar = sParV.split("&");
		for(var i=0; i<arPar.length; ++i) {
			var sNV = arPar[i];
			if(sNV != "") {
                var seperatorIndex = sNV.indexOf("=");
				if(seperatorIndex != -1) {
					sN = sNV.substring(0, seperatorIndex);
					sV = sNV.substring(seperatorIndex+1, sNV.length);
					oPars[sN] = sV;
				}
				else if(sParV == sNV) {
					/*No name-value pairs found.*/
					/*BUG-145095: In case no name-value pairs are found, return an unique string.*/
					oPars[sNV] = "NoNVFound";
				}
				else {
					oPars[sN] = ((typeof(oPars[sN]) != "undefined") ? oPars[sN].toString() : "") + "&" + sNV;
				}
			}
			else {
				//oPars[sN] = ((typeof(oPars[sN]) != "undefined") ? oPars[sN].toString() : "") + "&";
			}
		}
	} catch(e) {}
	return oPars;

/* itkis, 01/16/09: old code preserved for reference  
    var paramObject= new Object();
    if (strParameterValue != null ){
        var separateParamArray= strParameterValue.split("&");

        for (var el=0; el < separateParamArray.length; el++) {
            if(separateParamArray[el] != "") {
                if (separateParamArray[el].indexOf("=")!=-1) {
                    var splitArray= separateParamArray[el].split("=");
                    paramObject[splitArray[0]] = splitArray[1];
                }
                else if (strParameterValue == separateParamArray[el]) {
                    paramObject[separateParamArray[el]] = null;
                }
            }
        }
    }
    return paramObject;
*/
}

/* 
@api - This function will create a clone of a safeURL. This function should be used to clone a safeURL that is passed between IE windows where the safeURL object reference is saved and the calling window closed.
@param $Object$objSafeURL - SafeURL object.
@return $Object$ - SafeURL clone object.
*/
function SafeURL_clone (objSafeURL) {

     var  myClone= new SafeURL();
     for (var i in objSafeURL.hashtable) {
       if (objSafeURL.hashtable[i] != null) {
          if(typeof(objSafeURL.hashtable[i])== "object" && objSafeURL.hashtable[i].name== "safeURL") {
             objSafeURL.hashtable[i]= SafeURL_clone(objSafeURL.hashtable[i]);
          }
          myClone.put(i, objSafeURL.hashtable[i]);
       }
     }

     return myClone;
}

/*
@api - This method serializes a safeURL object into its equivalent xml string. 
@param $Object$objSafeURL - The safeURL object to be serialized.
@return $Object$ - Serialized safe url object.
*/
function serializeSafeURL(objSafeURL) {
    var xmlString= "<SafeURL>";
    for (var i in objSafeURL.hashtable) {
        var value= objSafeURL.hashtable[i];
        if(typeof(value)== "object" && value.name== "safeURL") {
            value= serializeSafeURL(value);
            xmlString += "<param name='safeURL' key='" + i + "'>" + value + "</param>";
        } else{
            xmlString += "<param key='" + i + "'>" + value + "</param>";
        }
    }
    xmlString += "</SafeURL>";
    return xmlString;
}

/*
@api - This method deserializes an xml string into its equivalent safeURL object.
@param $String$xmlString - The xml string to be deserialized.
@return $Object$ - Safe url object.
*/
function deserializeSafeURL(xmlString) {
    var objSafeURL= new SafeURL();
	var objXmlDom= new ActiveXObject("microsoft.xmldom");
	if (objXmlDom.loadXML(xmlString)) {
        var objChildren= objXmlDom.firstChild.childNodes;
        var maxLength= objChildren.length;
        for(var i=0; i<maxLength; i++) {
            var key= objChildren[i].getAttribute("key");
            var name= objChildren[i].getAttribute("name");
            var value= objChildren[i].text;
            if(name=="safeURL") {
                value= deserializeSafeURL(objChildren[i].firstChild.xml);
            }
	   if (value != null && typeof value != "undefined"){
	            objSafeURL.put(key, value);
	   }
        }
        return objSafeURL;
    }
    return null;
}


/****************************************************************************************
* Hashtable - included with safeURL to reduce Js include 304 response latency with server
*             (Martt - 01-18-06)
*           - Any changes to this code should be reflected in hashtable.js
*****************************************************************************************/

/**
    @constructor

    This is a Javascript implementation of the Java Hashtable object.
                    
   
     Hashtable()
              Creates a new, empty hashtable
                    
    Method(s):
     void clear() 
              Clears this hashtable so that it contains no keys. 
     boolean containsKey(String key) 
              Tests if the specified object is a key in this hashtable. 
     boolean containsValue(Object value) 
              Returns true if this Hashtable maps one or more keys to this value. 
     Object get(String key) 
              Returns the value to which the specified key is mapped in this hashtable. 
     boolean isEmpty() 
              Tests if this hashtable maps no keys to values. 
     Array keys() 
              Returns an array of the keys in this hashtable. 
     void put(String key, Object value) 
              Maps the specified key to the specified value in this hashtable. A NullPointerException is thrown is the key or value is null.
     Object remove(String key) 
              Removes the key (and its corresponding value) from this hashtable. Returns the value of the key that was removed
     int size() 
              Returns the number of keys in this hashtable. 
     Array values() 
              Returns a array view of the values contained in this Hashtable. 
                            
*/
/*
@private - Describes hastable object.
@hide
*/               

function Hashtable(){
    this.clear= hashtable_clear;
    this.containsKey= hashtable_containsKey;
    this.containsValue= hashtable_containsValue;
    this.get= hashtable_get;
    this.isEmpty= hashtable_isEmpty;
    this.keys= hashtable_keys;
    this.put= hashtable_put;
    this.remove= hashtable_remove;
    this.size= hashtable_size;
    this.toString= hashtable_toString;
    this.values= hashtable_values;
    this.hashtable= new Object();
}                
/*=======Private methods for internal use only========*/
           
/*
@public - Clears the hashtable.
@return $void$
*/     
function hashtable_clear(){
    this.hashtable= new Object();
}
                
/*
@protected
@hide - Checks if hashtable contains the passed key.
@param $String$key - Specifies key.
@return $Boolean$ - True if exists, else false.
*/               
function hashtable_containsKey(key){
    var exists= false;
    for (var i in this.hashtable) {
        if (i== key && this.hashtable[i] != null) {
            exists= true;
            break;
        }
    }
    return exists;
}
                
/*
@public - Checks if hashtable contains the passed value.
@param $String$key - Specifies value.
@return $Boolean$ - True if exists, else false.
*/
function hashtable_containsValue(value){
    var contains= false;
    if (value != null) {
        for (var i in this.hashtable) {
            if (this.hashtable[i]== value) {
                contains= true;
                break;
            }
        }
    }
    return contains;
}
              
/*
@protected
@hide - Gets the hashtable entry for passed key.
@param $String$key - Specifies key.
@return $Object$ - Returns the hashtable entry.
*/               
function hashtable_get(key){
    return this.hashtable[key];
}
 
/*
@public
@hide - Checks if hashtable is empty.
@return $Boolean$ - True if empty else false.
*/               
function hashtable_isEmpty(){
    return (this.size() == 0) ? true : false;
}

/*
@private
@hide - Gets all hashtable keys.
@return $Object$ - Returns hashtable keys as an array.
*/               
function hashtable_keys(){
    var keys= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            keys.push(i);
    }
    return keys;
}

/*
@public
@hide - Adds entries (key-value) to hashtable.
@param $String$key - Specifies key.
@param $String$value - Specifies value.
@return $Object$ - True if added succesfully.
*/               
           
function hashtable_put(key, value){
	if (key== null || value== null) {

		throw "NullPointerException {" + key + "}, {" + value + "}";
	}else{
		this.hashtable[key]= value;
		return true;
	}
}
 
/*
@public
@hide - Removes the hashtable entry given the key.
@param $String$key - Specifies key.
@return $Object$ - Entry removed from hashtable.
*/               
function hashtable_remove(key){
    var rtn= this.hashtable[key];
    this.hashtable[key]= null;
    return rtn;
}

/*
@private
@hide - Function that calculates the hashtable size.
@return $Integer$ - Returns hashtable size.
*/                
function hashtable_size(){
    var size= 0;
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            size ++;
    }
    return size;
}
  
/*
@protected
@hide - Converts the hashtable values to string type.
@return $String$ - Returns the converted values.
*/              
function hashtable_toString(){
    var result= "";
    for (var i in this.hashtable)
    {      
        if (this.hashtable[i] != null) 
            result += "{" + i + "},{" + this.hashtable[i] + "}\n";   
    }
    return result;
}
              
/*
@protected
@hide - Function that returns hashtable values.
@return $Object$ - Returns set of values.
*/  
function hashtable_values(){
    var values= new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            values.push(this.hashtable[i]);
    }
    return values;
}

/**
*
*  URL encryption logic
*
**/

var URLObfuscation = {

	/* private property */
	/* tweaked to match com.pega.pegarules.util.URLObfuscation */
	_keyStr : "-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[",

	/* public method for encrypting */
	encrypt : function(input) {
	//var key = getCookie();
                   var key = getObfuscationKey();
		if (key == null) {
			return URLObfuscation.encode(input);
		}
		var bkey = stringToByteArray(key);
		var ba = rijndaelEncrypt(input, formatKey(bkey));
		var str = byteArrayToHex(ba);
		var res = "pyactivitypzZZZ=" + str + "*";
		return res;
	},
	
	/* public method for decrypting */
	decrypt : function(input) {
		//var key = getCookie();
    var key = null;
    if(input.startsWith("CXtnbH0%3D")){
      key = pega.d.globalobfuscateKey;
      input = input.substring(10);
    }else{
      key = getObfuscationKey();
    }
		if (key == null) {
			return URLObfuscation.decode(input);
		}
		var bkey = stringToByteArray(key);
		var ba = rijndaelDecrypt(hexToByteArray(input), formatKey(bkey));
	  return decodeURI(byteArrayToString(ba));
	},

	/* public method for encoding */
	encode : function (input) {
		/* alert("base64 encode: " + input); */
		if (input.indexOf("pyactivitypzZZZ=") == 0) {
			/* alert("string already encoded, returning"); */
			return input;
		}
		var xorConst=0x5a;
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = URLObfuscation._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++) ^ xorConst;
			chr2 = input.charCodeAt(i++) ^ xorConst;
			chr3 = input.charCodeAt(i++) ^ xorConst;

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			/* note that this algorithm, unlike many, does NOT
			   insert newline characters to limit the length of a line
			   to 72 characters. For our purposes, the omission of newline
			   characters is ESSENTIAL so this is a good thing! */
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		/* insert the marker used by the server to recognized obfuscated segments */
		var res = "pyactivitypzZZZ=" + output + "*";
		/* alert("URLObfuscation output: " + res); */
		return res;
	},

	/* public method for decoding */
	decode : function (input) {
		var xorConst=0x5a;
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		/* tweaked to match encoding used above */
		input = input.replace(/[^\-\_0-9a-zA-Z\[]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			chr1 ^= xorConst;
			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				chr2 ^= xorConst;
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				chr3 ^= xorConst;
				output = output + String.fromCharCode(chr3);
			}

		}

		output = URLObfuscation._utf8_decode(output);

		return output;

	},

	/* private method for UTF-8 encoding */
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	/* private method for UTF-8 decoding */
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c, c1, c2, c3;
		c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	}
}

/* 
   The following encryption logic is a modified version of the javascript copied from 

   http://javascript.about.com/library/blencrypt.htm

   which is itself a modification of the original implementation of encryption
   in javascript.

   The copyright notice from the original is shown here:

   rijndael.js      Rijndael Reference Implementation
   Copyright (c) 2001 Fritz Schneider

 This software is provided as-is, without express or implied warranty.
 Permission to use, copy, modify, distribute or sell this software, with or
 without fee, for any purpose and by any individual or organization, is hereby
 granted, provided that the above copyright notice and this paragraph appear
 in all copies. Distribution as a part of an application or binary must
 include the above copyright notice in the documentation and/or other materials
 provided with the application or distribution.

 Note that the following code is a compressed version of Fritz's code
 and is only about one third the size of his original
 compressed version courtesy of Stephen Chapman (javascript.about.com)

 */

// key size & block size, respectively
var BS=128;
var BB=128;

//RoundsArray
var RA=[,null,null,null,[,null,null,null,10,null,12,null,14],null,
						[,null,null,null,12,null,12,null,14],null,
						[,null,null,null,14,null,14,null,14]];

// ShiftOffsets
var SO=[,null,null,null,[,1,2,3],null,[,1,2,3],null,[,1,3,4]];

//Round Constants
var RC=[0x01,0x02,0x04, 0x08,0x10,0x20,0x40,0x80,0x1b,0x36,0x6c,
				0xd8,0xab,0x4d,0x9a,0x2f,0x5e,0xbc,0x63,0xc6,0x97,0x35,0x6a,0xd4,
				0xb3,0x7d,0xfa,0xef,0xc5,0x91];

//Precomputed lookup table for the SBox
var SB=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
				118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,
				114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,
				216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,
				235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,
				179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,
				190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,
				249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
				188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,
				23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,
				144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,
				6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,
				141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,
				46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,
				181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,
				248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,
				140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,
				22];
				
// Precomputed lookup table for the inverse SBox
var SBI=[82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,
				251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,
				233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,
				250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,
				109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,
				204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,
				70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,
				228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,
				193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,
				234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,
				53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,
				41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,
				198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,
				51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,
				127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,
				224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,
				23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,
				125];

// key obfuscation
var xorMask=[0xe2, 0xc8, 0xf5, 0x32, 0x5c, 0x26, 
		0xb9, 0x65, 0x37, 0x41, 0x30, 0x52, 0xf5, 0xa4, 0x89, 0xd5, 0x73, 0x16, 
		0xcc, 0x45, 0xaf, 0x8e, 0x16, 0x3f, 0xf1, 0x27, 0x1c, 0xe7, 0x86, 0x07, 
		0x3c, 0xaa, 0xde, 0x8c, 0x5c, 0xed, 0x45, 0xe4, 0xe6, 0xdc, 0x7c, 0xf0, 
		0x00, 0xf0, 0xe7, 0x01, 0x48, 0x4e, 0xf6, 0x22, 0x0f, 0xf7, 0x56, 0x11, 
		0xb9, 0xc8, 0x58, 0x90, 0xe8, 0xcf, 0xfe, 0x6b, 0xd5, 0x04, 0xb1, 0x0b, 
		0xee, 0x0e, 0x0c, 0x2d, 0x23, 0x3a, 0x64, 0x12, 0x59, 0x9b, 0x55, 0xe4, 
		0x76, 0xcc, 0x2f, 0xec, 0x15, 0xce, 0x34, 0x13, 0xc1, 0x50, 0x80, 0xe6, 
		0xf6, 0x77, 0xe9, 0x10, 0x03, 0x8e, 0xfc, 0xed, 0xe4, 0x78, 0x32, 0x43, 
		0x58, 0x27, 0x72, 0x07, 0x0a, 0x1e, 0x41, 0x99, 0x80, 0x88, 0x91, 0x31, 
		0x92, 0xd7, 0x36, 0x3a, 0xe6, 0x26, 0x0d, 0x1b, 0x95, 0x5a, 0xc2, 0x2d, 
		0x0f, 0x55, 0x20, 0x65, 0x6b, 0xd6, 0xac, 0xbc, 0xfd, 0x8a, 0x8f, 0xf0, 
		0xfb, 0x89, 0x41, 0x30, 0x89, 0xf1, 0x91, 0x83, 0x8e, 0x0a, 0xf8, 0xc2, 
		0x2a, 0x56, 0x4b, 0x01, 0x29, 0xbb, 0xda, 0xd1, 0x3e, 0x38, 0xc7, 0xff, 
		0xd1, 0x20, 0x63, 0xfd, 0x5b, 0xfc, 0x87, 0xd7, 0xf7, 0x47, 0xff, 0xb9, 
		0xe4, 0xef, 0x27, 0xe0, 0xed, 0x6e, 0x50, 0x23, 0xcc, 0xf5, 0xa7, 0x7f, 
		0xa4, 0x1b, 0xd3, 0x8a, 0xdd, 0x6d, 0x59, 0x8e, 0x1c, 0xef, 0xb2, 0x81, 
		0xd4, 0xdd, 0x8a, 0x67, 0x5e, 0xe9, 0xb8, 0xd6, 0xa6, 0x6f, 0x50, 0x5f, 
		0x92, 0x74, 0xc1, 0x7c, 0xb5, 0x09, 0x33, 0x50, 0x1f, 0x2e, 0x26, 0x5b, 
		0xa7, 0xfb, 0x88, 0x17, 0x97, 0xbf, 0xeb, 0xf8, 0xf8, 0xea, 0xac, 0x35, 
		0xcd, 0xd7, 0xbe, 0x94, 0x25, 0x7f, 0x8e, 0xef, 0xfc, 0xa2, 0x08, 0xdf, 
		0xdd, 0x92, 0x26, 0x51, 0xb8, 0xca, 0x9e, 0x00, 0x0b, 0x0c];

function cSL(TA,PO){
	var T=TA.slice(0,PO);
	TA=TA.slice(PO).concat(T);
	return TA;
}

// Cipher parameters ... do not change these
var Nk=BS/32;
var Nb=BB/32;
var Nr=RA[Nk][Nb];

// XTime
function XT(P){
	P<<=1;
	return((P&0x100) ? (P^0x11B) : (P));
}

//mult_GF256
function GF(x, y) {
	var B,R=0;
	for(B=1; B<256; B*=2,y=XT(y)) {
		if(x&B)
			R^=y;
	}
	return R;
}

// byteSub, DR=e for encrypt or DR=d for decrypt
function bS(SE,DR){
	var S;
	if(DR=="e")
		S=SB;
	else 
		S=SBI;
	for(var i=0; i<4; i++)
		for(var j=0; j<Nb; j++)
			SE[i][j]=S[SE[i][j]];
}

// shiftRow
function sR(SE,DR) {
	for(var i=1; i<4; i++)
		if (DR=="e")
			SE[i]=cSL(SE[i],SO[Nb][i]);
		else
			SE[i]=cSL(SE[i],Nb-SO[Nb][i]);
}

// mixColumn
function mC(SE,DR) {
	var b=[];
	for(var j=0; j<Nb; j++) {
		for(var i=0; i<4; i++) {
			if (DR=="e")
				b[i]=GF(SE[i][j],2)^GF(SE[(i+1)%4][j],3)^SE[(i+2)%4][j]^SE[(i+3)%4][j];
			else
				b[i]=GF(SE[i][j],0xE)^GF(SE[(i+1)%4][j],0xB)^GF(SE[(i+2)%4][j],0xD)^GF(SE[(i+3)%4][j],9);
		}
		for(var i=0; i<4; i++)
			SE[i][j]=b[i];
	}
}

// addRoundKey
function aRK(SE,RK) {
	for(var j=0; j<Nb; j++) {
		SE[0][j]^=(RK[j]&0xFF);
		SE[1][j]^=((RK[j]>>8)&0xFF);
		SE[2][j]^=((RK[j]>>16)&0xFF);
		SE[3][j]^=((RK[j]>>24)&0xFF);
	}
}

// key obfuscation
function OY(Y) {
	var numBytes = Y.length;
  var output = [];
  // process segment so that remaining length is multiple of 256 bytes
	var nOdd = numBytes % 256;
	var idx,jdx;
  for (idx = 0; idx < nOdd; idx++) {
  	output[idx] = Y[idx] ^ xorMask[idx];
  }
  // now process blocks of 256 bytes
  while (idx < numBytes) {
	 	for (jdx = 0; jdx < 256; jdx++) {
	    output[idx] = Y[idx] ^ xorMask[jdx];
	    idx++;
	  }
  }
  return output;
}

// keyExpansion
function YE(Y) {
	var EY=[];
	var T;
	Nk=BS/32;
	Nb=BB/32;
	Nr=RA[Nk][Nb];
	for(var j=0; j<Nk; j++)
		EY[j]=(Y[4*j])|(Y[4*j+1]<<8)|(Y[4*j+2]<<16)|(Y[4*j+3]<<24);
	for(j=Nk; j<Nb*(Nr+1); j++) {
		T=EY[j-1];
		if (j%Nk==0)
			T=((SB[(T>>8)&0xFF])|(SB[(T>>16)&0xFF]<<8)|(SB[(T>>24)&0xFF]<<16)|(SB[T&0xFF]<<24))^RC[Math.floor(j/Nk)-1];
		else if (Nk>6&&j%Nk==4)
			T=(SB[(T>>24)&0xFF]<<24)|(SB[(T>>16)&0xFF]<<16)|(SB[(T>>8)&0xFF]<<8)|(SB[T&0xFF]);
		EY[j]=EY[j-Nk]^T;
	}
	return EY;
}

// Round
function Rd(SE,RK) {
	bS(SE,"e");
	sR(SE,"e");
	mC(SE,"e");
	aRK(SE,RK);
}

// InverseRound
function iRd(SE,RK) {
	aRK(SE,RK);
	mC(SE,"d");
	sR(SE,"d");
	bS(SE, "d");
}

// FinalRound
function FRd(SE,RK) {
	bS(SE,"e");
	sR(SE,"e");
	aRK(SE,RK);
}

// InverseFinalRound
function iFRd(SE,RK) {
	aRK(SE,RK);
	sR(SE,"d");
	bS(SE,"d");
}

// basic encryption function
function encrypt(bk,EY) {
	var i;
	if (!bk||bk.length*8!=BB)
		return;
	if (!EY)
		return;
	bk=pB(bk);
	aRK(bk,EY);
	for(i=1; i<Nr; i++)
		Rd(bk,EY.slice(Nb*i,Nb*(i+1)));
	FRd(bk,EY.slice(Nb*Nr));
	return uPB(bk);
}

// basic decryption function
function decrypt(bk,EY) {
	var i;
	if (!bk||bk.length*8!=BB)
		return;
	if (!EY)
		return;
	bk=pB(bk);
	iFRd(bk,EY.slice(Nb*Nr));
	for(i=Nr-1; i>0; i--)
		iRd(bk,EY.slice(Nb*i,Nb*(i+1)));
	aRK(bk,EY);
	return uPB(bk);
}

// packBytes
function pB(OT) {
	var SE = [];
	if (!OT||OT.length%4)
		return;
	SE[0]=[];
	SE[1]=[];
	SE[2]=[];
	SE[3]=[];
	for(var j=0;  j<OT.length; j+=4) {
		SE[0][j/4]=OT[j];
		SE[1][j/4]=OT[j+1];
		SE[2][j/4]=OT[j+2];
		SE[3][j/4]=OT[j+3];
	}
	return SE;
}

// unpackBytes
function uPB(PK) {
	var R=[];
	for(var j=0; j<PK[0].length; j++) {
		R[R.length]=PK[0][j];
		R[R.length]=PK[1][j];
		R[R.length]=PK[2][j];
		R[R.length]=PK[3][j];
	}
	return R;
}

// formatPlaintext
function fPT(PT) {
	var bpb=BB/8;
	var i;
	if(typeof PT=="string"||PT.indexOf) {
		PT=PT.split("");
		for(i=0; i<PT.length; i++)
			PT[i]=PT[i].charCodeAt(0)&0xFF;
	}
	for(i=bpb-(PT.length%bpb); i>0&&i<bpb; i--)
		PT[PT.length]=0;
	return PT;
}

// encryption entry point
function rijndaelEncrypt(PT,Y) {
	var EY,i,abk;
	var bpb=BB/8;
	var ct;
	if(!PT||!Y)
		return;
	if(Y.length*8!=BS)
		return;
	ct=[];
	PT=fPT(PT);
	
	Y=OY(Y);
	EY=YE(Y);
	
	for (var bk=0; bk<PT.length/bpb; bk++){
		abk=PT.slice(bk*bpb,(bk+1)*bpb);
		ct=ct.concat(encrypt(abk,EY));
	}
	return ct;
}

// decryption entry point
function rijndaelDecrypt(CT,Y) {
	var EY;
	var bpb=BB/8;
	var pt=[];
	var abk;
	var bk;
	if(!CT||!Y||typeof CT=="string")
		return;
	if(Y.length*8!=BS)
		return;
	Y=OY(Y);
	EY=YE(Y);
	for(bk=(CT.length/bpb)-1; bk>0; bk--){
		abk=decrypt(CT.slice(bk*bpb,(bk+1)*bpb),EY);
		pt=abk.concat(pt);
	}
	pt=decrypt(CT.slice(0,bpb),EY).concat(pt)
	return pt
}

function stringToByteArray(st) {
	var bA=[];
	for(var i=0; i<st.length; i++)
		bA[i]=st.charCodeAt(i);
	return bA;
}

function byteArrayToString(bA) {
	var R="";
          if(!bA)
             return;
	for(var i=0; i<bA.length; i++)
	if (bA[i]!=0) 
		R+=String.fromCharCode(bA[i]);
	return R;
}
 
function byteArrayToHex(bA) {
 	var R="";
 	if(!bA)
 		return;
 	for(var i=0; i<bA.length; i++)
 		R+=((bA[i]<16)?"0":"")+bA[i].toString(16);
 	return R;
}
 
function hexToByteArray(hS) {
	var bA=[];
	if(hS.length%2)
 		return;
	if(hS.indexOf("0x")==0||hS.indexOf("0X")==0)
		hS = hS.substring(2);
	for (var i=0; i<hS.length; i+=2)
		bA[Math.floor(i/2)]=parseInt(hS.slice(i,i+2),16);
	return bA;
}

// build key in reverse order of byte array passed in
// take maximum of 'size' number of bytes
function formatKey(ba) {
	var i;
	var j = 0;
	var size = BS / 8;
	var bakey = [];
	for (i = ba.length - 1; i > -1; i--) {
		bakey[j++] = ba[i];
		if (j == size) {
			break;
		}
	}
	
	// if not big enough, append bytes to exact size
	if (j < size) {
		for (var k = j; k < size; k++) {
			bakey[k] = j + 60;
		}
	}
	return bakey;
}	

// Retrieve the value of the cookie with the specified name.  
// If operating in the GadgetManager document obtain the cookie from the gadget manager object.
// other obtain the cookie from prGatewaySESSIONID.  As a default use JSESSIONID
function getCookie() {
	try {
		var strJSESSIONID = "";
		if (typeof(pega) !="undefined" && pega && pega.web && pega.web.mgr && !pega.web.mgr._bDirectPRPC) {
			return pega.web.mgr.getCookie();
		}
		else {
			var aCookie = window.document.cookie.split("; ");
			for (var i=0; i < aCookie.length; i++) {
				// a name/value pair (a crumb) is separated by an equal sign
				var aCrumb = aCookie[i].split("=");
				if ("prGatewaySESSIONID" == aCrumb[0]) {
// itkis, 11/24/08. unescape call commented out per SOLOM.    			
//         			return unescape(aCrumb[1]).toLowerCase();
		     		return aCrumb[1].toLowerCase();
				} 
				else if ("JSESSIONID" == aCrumb[0]) {
//					strJSESSIONID = unescape(aCrumb[1]).toLowerCase();
					strJSESSIONID = aCrumb[1].toLowerCase();
				}
			}
		} 
	}
	catch(exception) {}
	return strJSESSIONID;
}


// Retrieve the value of the cookie with the specified name.  
// If operating in the GadgetManager document obtain the cookie from the gadget manager object.
// other obtain the cookie from prGatewaySESSIONID.  As a default use Pega-RULES
function getObfuscationKey() {
	try {
		var strJSESSIONID = "";
		if (typeof(pega) !="undefined" && pega && pega.web && pega.web.mgr && !pega.web.mgr._bDirectPRPC) {
			return pega.web.mgr.getCookie();
		}
		else {
			strJSESSIONID = pega.d.obfuscateKey;	
		} 
	}
	catch(exception) {}
	//This block of code is necessary when gadget is deployed without gateway
    if(strJSESSIONID==null || strJSESSIONID==""){
		var cookie = pega.web.mgr.getCookie().toLowerCase();
		strJSESSIONID = cookie;
	}
	return strJSESSIONID;
}
//static-content-hash-trigger-GCC
//<!-- <HTML> -->
// <script>


/* @package
 * This file contains methods to create and send httprequest objects, methods to handle
 * exceptions generated.
 */

//***********************************************************
//*
//* httprequestscript.js
//*
//*
//***********************************************************
/*
@protected- Create XMLHTTP object and launch ASYNC request. And open async http connection and send the request.
@param $String$sQuery – URL query String.
@param $String$sPostData – Post data.
@param $Integer$SleepInterval – Sleep Interval.
@param $Integer$SleepMaxCount – Max sleep count.
@return $String$ - returns response text.
*/
function HttpRequestAsyncCommon( sQuery, sPostData, SleepInterval, SleepMaxCount) {
    var bExpectText= true;
    var bPost= (typeof( sPostData) != "undefined" && sPostData != null);
        if( typeof( sPostData)== "undefined" || sPostData== null)
        sPostData= "";

    // Create XMLHTTP object and launch ASYNC request.
    var objXmlHttp;
    try { objXmlHttp = new XMLHttpRequest(); }
    catch (e) { try { objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    	       catch (e) { objXmlHttp = false; }
    	     }

    if (!objXmlHttp) return null;


  	// publish to perf mon ajax busy
    var startTime = Date.now();
  	pega.ui.statetracking.setHttpBusy("HRAC");

    var HttpStatus= 0;

    // Wrap the request into a 401 reauthentication loop.
    for ( var n401Cnt= 0; n401Cnt < 3; ++n401Cnt) {

        // Open async http connection and send the request.
        if(objXmlHttp.open)				
        objXmlHttp.open( bPost ? "POST" : "GET", sQuery,false);
        else				
             objXmlHttp.Open( bPost ? "POST" : "GET", sQuery,false);

		//Bug-29567, Set the content-type to text/xml if the postData has xml in it.
		//For performance reasons, the search for xml header is performed in the first 10 characters only.

		var headerSet = false;
        if(sPostData != null){

			if(typeof sPostData == "string") {

				var headerData = sPostData.substring(0,10);
				if(headerData.indexOf("<?xml")!=-1) {
					objXmlHttp.setRequestHeader("Content-Type", "text/xml");
					headerSet = true;

				}
			}

         }


        if(!headerSet) {
			objXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
      //set CSRF XMLHTTPRequest header, browserfingerprint and CSRFToken, as it is an AJAX request-fix for BUG-422325
    objXmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    objXmlHttp.setRequestHeader("pzBFP", pega.d.browserFingerprint); 
    objXmlHttp.setRequestHeader("pzCTkn", pega.ctx.activeCSRFToken);  
		objXmlHttp.send( sPostData );

        // Keep testing the readyState property in sleep increments until it is equal 4.
        for ( var nSleepCnt= 0; nSleepCnt < SleepMaxCount; ++nSleepCnt) {
            try {
                // First sleep should be very short in case the latency is very low.
                if( nSleepCnt== 0)

                // If http status is 401, break out of sleep loop to resubmit the HTTP request
                HttpStatus= 0;
                try { HttpStatus= objXmlHttp.status; } catch (e) {
                }

                // Trap the error that will be raised by the readyState function if servlet
                // is waiting for the PR server to create the server cache file.
                // Return XML object if successful. Keep waiting otherwise.
                if( objXmlHttp.readyState== 4 ) {

                    // publish to perf mon ajax complete
  					        pega.ui.statetracking.setHttpDone("HRAC", Date.now()-startTime);

                    var oRespXML= null, sRespText= "";
                    try {
                        if( HttpStatus== 401) {
                            if( nSleepCnt > 1) {
                                alert( getLocalString("pyMessageLabel", "Invalid userid or password. Session is not re-authenticated."));
                                return null;
                            }
                            else
                                break;
                        }
                        else if( HttpStatus != 200 && HttpStatus != 304 && HttpStatus != 1223) {
                            /*
                                HttpStatus "1223" isn't a HTTP response code, but rather
                                appears to be a WinInet error code, indicating a canceled
                                operation. We get that in response to a HTTP 204.
                             */
							//
                            if ( HttpStatus== 500){
								ShowServerException(objXmlHttp);
								return null;
							}
							else{
								var valueHash= new Array();
								valueHash["$(HttpStatus)"]= HttpStatus;
								alert(getLocalString("pyMessageLabel", "Server error: $(HttpStatus)", valueHash));
                            }
						}

						// This is a server interaction, so reset the timeout timer
						if (typeof(restartTimeoutWarningTimer) != 'undefined')
						{
							restartTimeoutWarningTimer();
						}

                        if( bExpectText)
                            return objXmlHttp.responseText;
                        else
                            return objXmlHttp.responseXML;
                    }
                    catch ( exception ) {
                        sRespText= objXmlHttp.responseText;
                    }
                    if (sRespText != "") {
                        return sRespText;
                    }

                    // No server connection.
                    alert(getLocalString("pyMessageLabel", "No server connection"));
                }
            }
            catch ( exception ) { ; }
        }
    }

  	// publish to test tooling ajax complete
	  pega.ui.statetracking.setHttpDone("HRAC", Date.now()-startTime);

    // User canceled out of the authentication challenge 3 times.
    if( HttpStatus== 401 ) {
        alert(getLocalString("pyMessageLabel", "User cancelled attempts to re-authenticate session."));
        return null;
    }
    // Timed out. Abort HTTP transaction.
    objXmlHttp.abort();
    alert(getLocalString("pyMessageLabel", "connectionTimedout"));
    return null;
}

// Modal HTTP request wrapper function. JScript Call Stack is unaffected after return.
// Required / recommended parameter values:
//                      sQuery - query sent to the server
//                      sPostData - null - GET, otherwise POST (Send(sPostData))
//                      SleepInterval= 50 - seems to be enough for cached content
//                      SleepMaxCount= 200 - with SleepInterval at 50 millisec, total timeout is 5 seconds.
// Returns:
//                      responseText or ""
//
/*
@protected- Modal HTTP request wrapper function. JScript Call Stack is unaffected after return.
Required / recommended parameter values:
     sQuery - query sent to the server
     sPostData - null - GET, otherwise POST (Send(sPostData))
     SleepInterval= 50 - seems to be enough for cached content
     SleepMaxCount= 200 - with SleepInterval at 50 millisec, total timeout is 5 seconds.
@param $String$sQuery – URL query String.
@param $String$sPostData – Post data.
@param $Integer$nSleepInterval – Sleep Interval.
@param $Integer$nSleepMaxCount – Max sleep count.
@return $String$ - returns server status.
*/
function httpRequestAsynch( sQuery, sPostData, nSleepInterval, nSleepMaxCount) {
    if (typeof sQuery== "object" && sQuery.name== "safeURL") {
        sQuery= sQuery.toURL();
    }

    // Set defaults
    if (arguments.length < 4)
        nSleepMaxCount= 400;
    if (arguments.length < 3)
        nSleepInterval= 50;

    // Protection code to prevent a delay which is to small
    if (nSleepMaxCount * nSleepInterval < 20000) {
        nSleepMaxCount= 400;
        nSleepInterval= 50;
    }

    // alert("sQuery= " + sQuery);
    return HttpRequestAsyncCommon( sQuery, sPostData, nSleepInterval, nSleepMaxCount);
}



//*****************************************************************
//  MSXMLHTTPAsyncCall Object
//*****************************************************************
/*
@constructor
@protected - constructor of desktopsharedscript initializes class variable.
@param $String$strUrl – URL.
@param $Object$funcCallback – Call back function.
@return $void$ -.
*/
function desktopsharedscript_MSXMLHTTPAsyncCall(strUrl, funcCallback) {
    this.url= strUrl;
    this.callbackFunction= funcCallback;
    this.XMLHTTPObject= null;

    this.getXMLHTTPObject= desktopsharedscript_MSXMLHTTPAsyncCall_getXMLHTTPObject;
    this.setUrl= desktopsharedscript_MSXMLHTTPAsyncCall_setUrl;
    this.setCallbackFunction= desktopsharedscript_MSXMLHTTPAsyncCall_setCallbackFunction;
    this.submit= desktopsharedscript_MSXMLHTTPAsyncCall_submit;
}

/*
@protected- Gets the XMLHTTPObject.
@return $Object$ - returns XMLHTTPObject.
*/
function desktopsharedscript_MSXMLHTTPAsyncCall_getXMLHTTPObject() {
    return this.XMLHTTPObject;
}

/*
@protected- Sets URL
@param $String$strUrl – URL.
@return $void$ - .
*/
function desktopsharedscript_MSXMLHTTPAsyncCall_setUrl(strUrl) {
    this.url= strUrl;
}

/*
@protected- Sets call back function.
@param $Object$funcCallback – Call back function.
@return $void$ - .
*/
function desktopsharedscript_MSXMLHTTPAsyncCall_setCallbackFunction(funcCallback) {
    this.callbackFunction= funcCallback;
}


/*
@protected- Submits XMLHTTPObject.
@return $Boolean$ - returns true of false.
*/
function desktopsharedscript_MSXMLHTTPAsyncCall_submit() {
    try {
        if (this.XMLHTTPObject== null) {
            this.XMLHTTPObject= new ActiveXObject ("Microsoft.XMLHTTP");
        }
        this.XMLHTTPObject.Open("GET", this.url, true);
        this.XMLHTTPObject.onreadystatechange= this.callbackFunction;
        this.XMLHTTPObject.Send();
        return true;
    } catch(exception) {
        return false;
    }
}

/*
@protected- Shows server exception.
@param $Object$objXmlHttp – objXmlHttp.
@return $void$ - .
*/
function ShowServerException(objXmlHttp){
try {
	try {
		pega.openUrlInModal.showModalDialog('ShowStatusModalDialog.htm', objXmlHttp, 320, 600);
	} catch(e) {
		pega.openUrlInModal.showModalDialog('ShowStatusModalDialog.htm', objXmlHttp, 320, 600);
	}
} catch( e ) {
	alert("Error in ShowServerException: " + e.description);
}
}
//*****************************************************************
//static-content-hash-trigger-YUI
// <SCRIPT>

/*@package
Desktopwrapper APIS provide client side functions for 
@asis
- Opening Rules
- Create, open and close work items and assignments
- Generating Reports
- Open URLs in a desktop space, popup or modal window
- Send and listening for desktop managed client events
- Switching workpools
@endasis
Desktopwrapper api calls provide URL formatting and generation as well as portal UI management - for instance switching to a new space or view - before the URL is sent to the server.
*/

//****************************************************************************
// Wrappers for Rules Space
//****************************************************************************


/*
 @api - This function is called from the menu options. Starts the IWM Priming Utility.
*/
function runIWM() {
	return pega.desktop.runIWM();
}

/*
@api
Given an InsHandle this function opens the rule in desktop or in a popup if a desktop rules space isn't found. If the bOpenSpecific vesion is set to false the openRule function will parse the insHandle and derive an InsName from the insHandle and open by rule resolution.
@param $String$strHandle - An insHandle key that identifies the rule to open.
@param $boolean$bOpenSpecificVersion - If true, will assume that the strHandle is a unique pxInsKey and will attempt to open that version of the rule only. The default is false.
@param $boolean$bLimitAccess – Limits the access. 
@return $void$ 
*/
function openRule(strHandle, bOpenSpecificVersion, bLimitAccess,contentID,dynamicContainerID) {
	return pega.desktop.openRule(strHandle,bOpenSpecificVersion, bLimitAccess,contentID,dynamicContainerID);
}

/*
  @api - This function is called by the various menu options that run as wizards.
  @param $String$sName - It is wizard name.
  @param $String$sQuery - Query string and should not be escaped when passed into this function.
  @return $void$
 */
function openWizard (sName, sQuery) {
	return pega.desktop.openWizard(sName, sQuery);
}

/*
@api
Opens an work assignment from the list view.
@param $String$strInsKey - The instance key of the work assignment.
@param $Object$paramObject - object literal containing additional parameters.
@return $void$
*/
function openAssignment(strInsKey,contentId,dynamicContainerID,paramObject,skipConflictCheck,offlineEnabled,configParams) {
	if(strInsKey==""){
		/*BUG-163412: Using getLocalString API instead of string for localization*/
                var msgEmptyAssignmentKey = pega.u.d.fieldValuesList.get("Empty Assignment Key");
		alert (msgEmptyAssignmentKey );    
             }
	else {           
return pega.desktop.openAssignment(strInsKey,contentId,dynamicContainerID,paramObject,skipConflictCheck,offlineEnabled,configParams);
	     }	
}

//****************************************************************************
// Wrappers for Work Space
//****************************************************************************

/* 
@api
Shows the targeted url in the list frame of the workspace.If the workspace space is not available the list is shown in a popup.
@param $String$url - URL targeting a work space compliant list.
@return $void$
*/
function showWorkList(url) {

  return pega.desktop.showWorkList(url);

}

/* 
@api
Shows the invoking operators worklist in the list frame of the workspace.If the workspace space is not available the list is shown in a popup.
@param $String$strUserId - User ID defaults to the current user if optional parameter strUserId is not present.
@return $void$
*/
function showUserWorkList(strUserId) {
    
	return pega.desktop.showUserWorkList(strUserId);   
}



/* 
@api
Shows the targeted url in the form frame of the workspace, switching the view to a form view.
@param $String$url - URL targeting a work space compliant harness / form.
@return $void$
*/
function openWorkByURL(url,event) {
	return pega.desktop.openWorkByURL(url,event);
}

/*
@api
Lists the contents of specified work basket.
@param $String$strBasketId - Id of the work basket to be shown.
@return $void$
*/
function showWorkBasket(strBasketId) {
	return pega.desktop.showWorkBasket(strBasketId);
}

/*
@api
Opens a work item that lives in a different work pool.
@param $String$key - The id of the work item.
@param $String$harnessVersion - 0 or 1, 0 is heritage (v3) harness, 1 is v4 harness.
@return $void$
*/
function openWorkByHandle(key, harnessVersion,contentID,dynamicContainerID,skipConflictCheck,reload,configParams) {
	return pega.desktop.openWorkByHandle(key, harnessVersion,contentID,dynamicContainerID,skipConflictCheck,reload,configParams);
}

/*
@api
Closes the current work item (if one is open) without changing the focus of the space.
@return $Boolean$ - True indicates successful closure and false indicates a failure to close the current work item.
*/
function closeCurrentWorkItem() {
	return pega.desktop.closeCurrentWorkItem();
}


// ***************************************************************************
// Desktop Functions
// ***************************************************************************

/* 
@api
Returns the value of pxReqURI.
@return $String$ - returns pxReqURI.
*/
function getReqURI() {
    return pega.ui.HarnessContextMgr.get("pxReqURI");
}

/* 
@api
Gets a string representing the current sessions Operator ID .
@return $String$ -  Returns an Operator ID.
*/
function getOperatorID() { 
	return pega.desktop.getOperatorID();	
}

/* 
@api
Return a string representing the class name of the current workpool as selected by the user in the NavigationPane.
@return $String$ - Class name of the currently selected application as a string.
*/
function getCurrentWorkPool() {
    return pega.desktop.getCurrentApplication();
}

/* 
 @api
Return a string representing the class name of the current appliation as selected by the user in the NavigationPane.
 @return $String$ -  Class name of the currently selected application. 
*/
function getCurrentApplication() {
    return pega.desktop.getCurrentApplication();
}

/* 
@api
Sets the current active application using the class name of the application workpool class.
@param $String$strApplicationName - Name of the application class.
@return $Boolean$ - True if the application was changed, false if the application class was not valid.
*/
function setCurrentApplication(strApplicationName) {
	return pega.desktop.setCurrentApplication(strApplicationName);
}

/* 
@api
Opens the given url in the specified space, if the space argument is omitted, blank, or null the currently active space is targeted.
@param $String$url - The url to be opened.
@param $object$space - (Optional) the space to raise/open.
@param $boolean$bringToFocus - (Optional) boolean value to indicate weather to switch to the raised space.
@return $void$
*/
function openUrlInSpace(url, space, bringToFocus) {
	return pega.desktop.support.openUrlInSpace(url, space, bringToFocus);
}

/*  
@api
Opens the given url in the dashboard space, if the space argument is omitted, blank, or null the currently active space is targeted.
* --Deprecated-- 
@param $String$url - The url to be opened.
@return $void$
*/
function openUrlInDashboard(url) {
    return pega.desktop.openUrlInDashboard(url);
}


/* 
@api
Makes the named space the active space and raises it to focus.
@param $object$space - The space to be opened.
@param $String$$sourcetype– Specifies the source type. 
@return $void$
*/
function showSpace(space, sourcetype) {
	return pega.desktop.showSpace(space,sourcetype);
}

/* 
@api
Returns the name of the default space.
@return $String$ - Default space name.
*/
function getDefaultSpaceName() {
	return pega.desktop.getDefaultSpaceName();
}
/* 
@api
Returns the name of the current space.
@return $String$ - Current space name.
*/
function getCurrentSpaceName() {
	return pega.desktop.getCurrentSpaceName();   
}

/*
 @api
This method calls registerApplicationChangeListener.
  --Deprecated--
 @param $Object$objHandler– Specifies the handler.
 @param $Object$objData– specifies the data. 
 @return $void$
*/
function registerWorkPoolChangeListener(objHandler, objData) {
  return pega.desktop.registerWorkPoolChangeListener(objHandler, objData);
}

/* 
@api
This method registers a handler that takes the objData and the new value of the application as a string as the first and second arguments respectively. The provided handler will be invoked on each change of the current application, and will be removed from the handler queue should any exception be posted to the caller.
@param $Object$objHandler - Function that takes an object as the first argument and a string representation of the application as the second argument. Does not return a value.
@param $Object$objData - The user data to be passed to the handler when it is invoked.
@return $void$
*/
function registerApplicationChangeListener(objHandler, objData) {
	return pega.desktop.registerApplicationChangeListener(objHandler, objData);
}

/* 
@api
Registers a function to be invoked whenever a named event occurs. When invoked, the function will be passed two parameters: the data about the event (supplied by sendEvent) and objData (unchanged).
@param $String$strEventName - Name of the event (matches name sent by sendEvent). To prevent name collision the name should follow a "." delimited naming convention:Company.Division.Unit.Component where Division and unit is optional and component is the facility generating the event.
@param $Object$objFunction - Callback function to invoke when event occurs.
@param $Object$objData - Data to pass along to the function (for example, the id of the div that the function will update). 
@param $Object$scope - If set invoke callback function on the scope context.
@return $void$
*/
function registerEventListener(strEventName, objFunction, objData ,scope)
{
	return pega.desktop.registerEventListener(strEventName, objFunction, objData, scope);
}

function cancelEventListener(strEventName, objFunction)
{
	return pega.desktop.cancelEventListener(strEventName, objFunction);
}

// Event Modes
 var SYNC= "SYNC";
 var ASYNC= "ASYNC";
 var ASYNC_REPLACE= "ASYNC_REPLACE";
 var ASYNC_COPY= "ASYNC_COPY";
 var ASYNC_COPY_REPLACE= "ASYNC_COPY_REPLACE";

/* 
@api
Sends an event, which causes any registered listeners to the event to be invoked. 
@param $String$strEventName - name of the event (matches name in registerEventListener).
@param $String$objEventData - data about the event that should be passed to the listening functions.
@param $String$mode - Modes are registered in DesktopEventNames, Default - ASYNC
 *     <B>SYNC</B>= Each registered listener is invoked, in time order of registration, in the current browser thread
 *     ASYNC= Each registered listener is called  in a timeout.  If ObjData is an object reference the sending
 *             must maintain the object beyond the current browser thread.
 *     ASYNC_REPLACE= Replace any in progress ASYNC events to the named event with new ObjData
 *     ASYNC_COPY= ObjData (string or object serialized to a string) is copied to the top desktop window and
 *     sent to each registered listener in a timeout.
 *     ASYNC_COPY_REPLACE= ObjData (string or object serialized to a string) is copied to the top desktop window, 
 *     any in progress ASYNC events to the named event are replaced and sent to each registered listener in a timeout.
@param $Integer$delay - delay in millisecs - default=10 millisecs.
@return $void$
*/
function sendEvent(strEventName, objEventData,mode,delay)
{
  return pega.desktop.sendEvent(strEventName, objEventData,mode,delay);

}

/*
@api
Runs the List View based on the specified parameters.
@param $Object$oClass - Mapped in ShowView activity to ViewClass. 
@param $String$sPurpose - Mapped in ShowView activity to ViewPurpose. 
@param $Boolean$bHeader - Mapped in ShowView activity to ViewHeader. 
@param $String$sAction - Mapped in ShowView activity to pyAction. 
@return $void$
*/

function showList(oClass, sPurpose, bHeader, sAction, vArgs) {
    var desktopType = pega.ui.HarnessContextMgr.get("desktopType");
    var desktopSubType = pega.ui.HarnessContextMgr.get("desktopSubType");
	if(desktopType == "Developer" && desktopSubType == "Composite") {
		pega.desktop.showNextInWindow();
	}
	return pega.desktop.showList(oClass, sPurpose, bHeader, sAction, vArgs);
}

/*
@api
Runs the ShowView / ShowViewGraph Summary View based on the specified parameters.
@param $Object$oClass - Mapped in ShowView activity to ViewClass. 
@param $String$sPurpose - Mapped in ShowView activity to ViewPurpose. 
@param $Boolean$bHeader - Mapped in ShowView activity to ViewHeader. 
@param $String$sAction - Mapped in ShowView activity to pyAction. 
@param bEmbeddedChart - Mapped in ShowViewGraph activity to ViewGraph. 
@return $void$
*/

function showSummary( oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs) {
    var desktopType = pega.ui.HarnessContextMgr.get("desktopType");
    var desktopSubType = pega.ui.HarnessContextMgr.get("desktopSubType");
	if(desktopType == "Developer" && desktopSubType == "Composite") {
		pega.desktop.showNextInWindow();
	}
	return pega.desktop.showSummary( oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs);
}

/*
@api
This function can be called after getting the URL of new form from the New dialog.
@param $String$url - URL representing the new form, created by New dialog.
@return $void$
*/
function showNewRuleForm(url) {
	return pega.desktop.showNewRuleForm(url);
	
}

/*
@api
-- deprecated -- This wrapper function will open a form in a new modal dialog. This api is no longer supported on some browsers
@param $String | Object$oUrl - Specifies the URL to open in the new dialog, or a SafeURL object.
@param $Integer$iHeight - Parameter that indicates the dialogHeight (in pixels).
@param $Integer$iWidth - Parameter that indicates the dialogWidth (in pixels).
@param $String$sFeatures - Parameter that contains features of the showModalDialog function.
@return $String$ - Null if oUrl is blank or null, or the returnValue of the modal dialog.
*/
function openUrlInDialog(oUrl, iHeight, iWidth, sFeatures, vArguments) {
    return pega.desktop.support.openUrlInDialog(oUrl, iHeight, iWidth, sFeatures, vArguments);
}

/*
@api
Runs the ListView in a new window based on the specified parameters.
@param $Object$oClass - Mapped in the activity to ViewClass.
@param $String$sPurpose - Mapped in the activity to ViewPurpose. 
@param $Boolean$bHeader - Mapped in the activity to ViewHeader. 
@param $String$sAction - Mapped in the activity to pyAction. 
@return $void$   
*/
function showListInWindow(oClass, sPurpose, bHeader, sAction, vArgs) {
     return pega.desktop.showListInWindow(oClass,sPurpose,bHeader, sAction, vArgs);
}

/*
@api
Runs the ShowView / ShowViewGraph Summary View in a new window based on the specified parameters.
@param $Object$oClass - Mapped in the activity to ViewClass.
@param $String$sPurpose - Mapped in the activity to ViewPurpose. 
@param $Boolean$bHeader - Mapped in the activity to ViewHeader. 
@param $String$sAction - Mapped in the activity to pyAction. 
@param $Boolean$bEmbeddedChart - Mapped in ShowViewGraph activity to ViewGraph.
@return $void$
*/
function showSummaryInWindow (oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs) {
	return pega.desktop.showSummaryInWindow(oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs);
}

/*
@api
Force next Desktpwrapper API command that displays HTML to target a popup.
@return $void$
*/
function showNextInWindow() {
      return pega.desktop.showNextInWindow();
}
//static-content-hash-trigger-GCC
/***************

Please Note:  This file has been deprecated as of 05-04-01.  

Use the file pega_desktop_support.js for future updates.


***************/


//<!-- <HTML> -->
// DesktopWrapperSupport.js
// <SCRIPT>
/* Pre-requisites - DesktopWrapperSupportCommons.js has to be included
 * This file contains supporting functions and variables for the desktop
 * wrappers to delegate requests to the SpacePaneAPI and/or the SpaceAPIs.
 * @package
 */

// Restart the timer that warns user before the session times out
//window.attachEvent("onload",restartTimeoutWarningTimer);
pega.util.Event.addListener(window, "load", restartTimeoutWarningTimer);


// Moved from desktopwrapper_variables to suppport caching
pega.ui.HarnessContextMgr.set("pxReqURI",pega.d.pxReqURI);
var requestURI = pega.d.pxReqURI;
var pxReqHomeURI = requestHomeURI; 
var reqProComHelpURI = pega.d.pxHelpURI;
var currentOperator = pega.d.pyUID;
var safeUrlRequestURI = pega.d.pxReqURI;
var portalVersion = 1;

var strHelpBaseURL = pega.d.pxHelpURI;
if (strHelpBaseURL) {
	if (strHelpBaseURL.lastIndexOf("/") != strHelpBaseURL.length-1) {
		strHelpBaseURL += "/";
	}
}

var strHelpDefaultPage = "procomhelpmain.htm";

function setBrowserStatusMessage (someText) {
     window.status = someText;
}

/*
@protected- Opes the rule in new window with given Key and ClassName.
@param $String$strKey – Key to pass to request URI.
@param $String$strClassName – ClassName to pass to request URI.
@return $void$ - 
*/
function openRuleRecord(strKey, strClassName)
{
           openRule(strKey);
}



/***************************************************************************************************************
*
* Functions to access Desktop, Space pane and explorere APIs
*
*/

/*
@public- Function opens the Specified space and loads the URL.
@param $String$source – Source which is the space name.
@param $String$sourceString – Source string which is the URL to be loaded in the space.
@param $String$sourceType – Source type which specifies the type of the sourceString.
@return $Boolean$ - Returns true or false.
*/
function openSpace(source, sourceString, sourceType) {
	return pega.desktop.support.openSpace(source, sourceString, sourceType);
}

/*
@private- Opening a deferred rule from out side rulesexplorer.
@param $String$pyRuleInsKey – Rule instance key.
@param $Object$pyRuleObjClass – Rule object class.
@param $String$pyFullName – Full name.
@param $String$ pyVersion – Rupe version.
@param $String$pyRuleSet – Rule set name.
@return $void$ - .
*/
function deferredOpenRule(pyRuleInsKey, pyRuleObjClass, pyFullName, pyVersion, pyRuleSet) {
	return pega.desktop.support.deferredOpenRule(pyRuleInsKey, pyRuleObjClass, pyFullName, pyVersion, pyRuleSet);
}

/*
@public- Executes the specified source type in the named space. If the space is not
   previously opened or has items queued this call returns false result. This
   method will not raise the space to visibility but will instead execute the
   specified command on the named space without changing the active space of
   the desktop.
@param $String$source – Source which is the space name.
@param $String$sourceString – Source string which is the URL to be loaded in the space.
@param $String$sourceType – Source type which specifies the type of the sourceString.
@return $Boolean$ - Returns success or failure of the operation.
*/

function execSpace(source, sourceString, sourceType) {
	return pega.desktop.support.execSpace(source, sourceString, sourceType);
}

/***************************************************************************************************************
*
* Rule space support functions
*
*/

// A delimiter added while creating a newRuleType including ruleType,
// Inheritance if added and strParams if any.
var gstrArgsDelim = "!@#$";
var gnwCount = 0;

/*
@private- This wrapper function will open a rule in form mode in the Rules Space given the URL minus the base.
@param $String$strURL – Key that identifies the rule to open.
@return $void$ - .
*/
function openRuleByURL(strURL) {
	return pega.desktop.support.openRuleByURL(strURL);
}

/*
@private- This wrapper function will open a rule in form mode in the Rules Space. If Desktop is
            not available, it opens the rule in a floating window.
@param $String$strHandle – Key that identifies the rule to open.
@param $String$strURL – URL to set the src attribute of the Rule form IFRAME.
@return $void$ - .
*/
function openRuleWithURL(strHandle,strURL){
    return pega.desktop.support.openRuleWithURL(strHandle,strURL);
}


///////////////////////////METHODS FROM DESKTOPWRAPPERSUPPORTUSER.js///////////////////////////////


/*
@private- Returns the current application name.
@return $String$ - returns application name.
*/
function desktopwrappersupport_getCurrentWorkPool() {
    return pega.desktop.support.getCurrentWorkPool();
}

///////////////////DESKTOPWRAPPERSUPPORTCOMMONS.JS//////////////////////////////////////////////////////

// DesktopWrapperSupportCommon.js
// <SCRIPT>

/*
@public- This method determines if the window is the designer desktop.
@param $Object$objTopWindow – Top window object.
@return $Boolean$ - returns true if the  desktop window, false otherwise.
*/
function desktopenvironmentscript_isWindowTheDesignerDesktop(objTopWindow) {
    return pega.desktop.support.isWindowTheDesignerDesktop(objTopWindow);
}

/*
@public- This method determines if the current window is embedded within the
   designer desktop or it is not running in the desktop
@param $Object$objWindow – Window object.
@return $Boolean$ - returns true if running within the desktop window, false if not running
           within the desktop window.
*/
function desktopenvironmentscript_isWindowOnDesignerDesktop(objWindow) {
    return pega.desktop.support.isWindowOnDesignerDesktop(objWindow);
}

/*
@public- This method determines if the session is running within the designer
   desktop by checking a session property made available by the server.
@return $Boolean$ - returns true if running within the desktop session, false if not running
         within the desktop session.
*/
function desktopenvironmentscript_isInDesignerDesktop() {
    return pega.desktop.support.isWindowTheDesignerDesktop(window.top);
}

/*
@public- This method determines if the session is running within the User
   desktop by checking a session property made available by the server.
@return $void$ - returns true if running within the User session, false if not running
          within the User session.
*/
function desktopenvironmentscript_isInUserDesktop() {
	return pega.desktop.support.isInUserDesktop();
}

/*
@public- Creates a string representing the default window dimensions to be passed
  through a window.open call.
@param $Integer$Top – Top position of the window.
@param $Integer$left – Left position of the window.
@param $Integer$height – Window height.
@param $Integer$Width – Window width.
@return $String$ - returns a string containing the top, left, height, and width parameters
          concatenated into an appropriate string.
*/
function createWindowDimensions(top, left, height, width) {
	return pega.desktop.support.createWindowDimensions(top,left,height,width);
}


/*
@public- Acquire a reference to the SpacePaneAPI of the desktop running the client
   session. This provides the users with direct access to the management API
  for the various spaces.
@return $Object$ - returns an instance of the SpacePaneAPI object.
*/
function getSpacePaneAPI() {
   return pega.desktop.support.getSpacePaneAPI();
}

/*
@public- Acquire a reference to the Application of the desktop running the client
   session. This provides the users with direct access to the management API
   for the entire desktop.
@return $Object$ -  an instance of the application object.
*/
function getDesktopApplication() {
    return pega.desktop.support.getDesktopApplication();
}

//*****************************************************************************
// General Use Wrappers
//*****************************************************************************

/*
@private- This function will open a form in a new window.
@param $String$oUrl – URL to open in the new window.
@param $String$sName – window name to use in the TARGET
                 attribute of a FORM or A tag. windowName can contain only
                 alphanumeric or underscore (_) characters.
@param $String$sOptions – A string containing a comma-separated list determining
                    whether or not to create various standard window features.
@param $Boolean$bReplace – A Boolean parameter that specifies whether the sURL
                    creates a new entry or replaces the current entry in the
                    window's history list.
@return $Object$ - returns window object.
*/
function desktopwrappersupport_openUrlInWindow(oUrl, sName, sOptions, bReplace,isAlternateUrlBase,isNoEncodingURL) {
	return pega.desktop.support.openUrlInWindow(oUrl,sName,sOptions,bReplace,isAlternateUrlBase,isNoEncodingURL);

}

/*
@private- This function will open a form in a new modal dialog.
@param $String$oUrl – A string specifying the URL to open in the new dialog, or a SafeURL object.
@param $Integer$iHeight – dialogHeight (in pixels).
@param $Integer$iWidth – dialogWidth (in pixels).
@param $String$sFeatures – A String parameter that contains features of the showModalDialog function.
@return $Object$ - returns null if oUrl is blank or null, or the returnValue of the modal dialog.
*/
function desktopwrappersupport_openUrlInDialog(oUrl, iHeight, iWidth, sFeatures) {
	return pega.desktop.support.openUrlInDialog(oUrl, iHeight,iWidth,sFeatures);
}

 /*
@private- Opens the given url in the specified space, if the space argument
   is omitted, blank, or null the currently active space is targeted.
@param $String$url – the url to be opened.
@param $String$space – (optional) the space to raise / open.
@param $Boolean$bringToFocus – (optional) boolean value to indicate weather to switch to the raised space.
@return $void$ - .
@exceptions - throws an exception if the url is blank, null or an empty
               string
*/
function desktopwrappersupport_openUrlInSpace(url, space, bringToFocus) {
	return pega.desktop.support.openUrlInSpace(url,space,bringToFocus);
}

function desktopwrappersupport_handleMultipleAG(strInsKey,fromAssignment){
	return pega.desktop.support.handleMultipleAG(strInsKey, fromAssignment);
}

/*
@private- This method gets the AccessGroup/Application for a given classname.
@return $String$ - returns list of AccessGroups as a string.
*/
function getAccessGroupForClass(strClassName){
	return pega.desktop.support.getAccessGroupForClass(strClassName);
}


/*
@private- This method gets the AccessGroup/Application next Work Object and if required opens the WO in new Accessgroup.
@return $boolean$ - returns true if open for new accessgroup.
*/
function openNextWorkWithApplication(){

    return pega.desktop.support.openNextWorkWithApplication();
}
/*
@private- This method will open the work object in .
@return $String$ - returns list of AccessGroups as a string.
*/
function openAssignmentWithApplication(strSelectedAG,strHandle,fromAssignment){

    return pega.desktop.support.openAssignmentWithApplication(strSelectedAG,strHandle,fromAssignment);
}

/*
@public- This method gets the desktop window that opened the current top, which
   may be a popup or the desktop itself.
@return $Object$ - returns reference to a window holding the desktop or null.
*/
function desktopwrappersupport_getDesktopWindow() {

    return pega.desktop.support.getDesktopWindow();

}

/*
@private- Opens a rule in a popup window given the specific pzInsKey for the rule to
   be opened.
@param $String$strKey – Required string form of the pzInsKey of the rule to open.
@param $Boolean$bOpenSpecificVersion – True if specific version needs to open otherwise false.
@param $Boolean$bLimitAccess – True if it has limited access otherwise false.
@param $String$sourceType – Source type of the rule.
@return $void$ - .
*/
function openRuleInWindow(strKey, bOpenSpecificVersion, bLimitAccess, sourceType)  {
   return pega.desktop.support.openRuleInWindow(strKey,bOpenSpecificVersion, bLimitAccess, sourceType);
}

/*
@public- Gets a reference to the explorer object for the named space.
@param $String$strSpaceName – Space pane name.
@return $Object$ - reference to explorer object if space employs an explorer,
           otherwise returns null.
*/
function getSpaceExplorer(strSpaceName) {
    return pega.desktop.support.getSpaceExplorer(strSpaceName);
}

/*
@public- Acquires a reference to the ExplorerController in the work space.
@return $Object$ - returns a reference to the ExplorerController if the space is currently
           open and has an explorer view, otherwise null.
*/
function getWorkExplorer() {
    return pega.desktop.support.getSpaceExplorer("Work");
}

 /*
@public- Acquires a reference to the Rulesexplorer.
@return $Object$ - returns a reference to the Rulesexplorer.
*/
function getRulesExplorer() {
    return pega.desktop.support.getSpaceExplorer("Rules");
}

/*
@protected-  returns the Localized string of fieldValue.
@param $String$propertyName – It will be R-O-FieldValue propertyName.  It will always be "pyMessageLabel".
@param $String$fieldValue – It will be R-O-FieldValue fieldValue. It needs to be localized.
@param $Object$valueHash – Hash Array storing the runtime values of variables.
@return $String$ - returns field value.
*/
function getLocalString(propertyName, fieldValue, valueHash) {
    return pega.desktop.support.getLocalString(propertyName,fieldValue,valueHash);
}

/*
@public-  attaches an intercept function to a spacetitlebar toolbar icon.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@param $Object$handler – Callback function intercept function invoked when the action occurs.
@return $Boolean$ - returns true if intercept attached.
*/
function attachIntercept(strAction, handler) {
   return pega.desktop.support.attachIntercept(strAction,handler);
}

/*
@public-  attaches an intercept function to a spacetitlebar toolbar icon.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@param $Object$handler – Callback function intercept function invoked when the action occurs.
@return $Boolean$ - returns true if intercept attached.
*/
function processSpaceTitleBarAction(strAction) {
	return pega.desktop.support.processSpaceTitleBarAction(strAction);
}

/*
@public-  disables a spacetitlebar toolbar icon for the current document.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@return $void$ - .
*/
function disableSpaceTitleBarAction(strAction) {
    return pega.desktop.support.disableSpaceTitleBarAction(strAction);
}

/*
@public-  enables a spacetitlebar toolbar icon for the current document.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@return $void$ - .
*/
function enableSpaceTitleBarAction(strAction) {
   return pega.desktop.support.enableSpaceTitleBarAction(strAction);
}

/*
@public-  do not add the current document to history.
@return $void$ - .
*/
function disableHistoryForDocument() {
    return pega.desktop.support.disableHistoryForDocument();
}

/*
@public-  This function will open help topic based upon url.
@param $String$strUrl – Relative URL.
@return $void$ - .
*/
function showHelpTopic(strUrl){
    return pega.desktop.support.showHelpTopic(strUrl);
}

/*
@private-  Construct the url to send to the server to acquire the work form.
@param $String$sourceString – Source string.
@param $String$sourceType – Source type.
@return $String$ - url to pass to the server to acquire the populated work form.
*/
function constructUrl(sourceString, sourceType)
{
	return pega.desktop.support.constructUrl(sourceString,sourceType);
}

/*
@private-  Restart the timer that warns user before the session times out.
@return $void$ - .
*/
function restartTimeoutWarningTimer()
{
   return pega.desktop.support.restartTimeoutWarningTimer();
}

/**
 * @public
 * This function will return true if PegaDeveloper ruleset is added in Access Group
 * else it will return false.
 * @return $boolean$true/false
 **/
function isPegaDeveloper() {
    if (typeof isAPegaDeveloper != "undefined") {
        return isAPegaDeveloper;
    } else {
        return false;
    }
}

 /* from PRWBScripts */
function clearBrowserProgressBar () {
   return pega.desktop.support.clearBrowserProgressBar();
}

function setSpaceFocus(){
    return pega.desktop.support.setSpaceFocus();
}
/* @package
Script containing client log interface functions.  Include this fragment in a stream to access logging APIs.  
*/


if(!pega.clientLog) {
	pega.clientLog = {};
}

pega.clientLog.base = null;

/* @public 
Generic detail level logging.
*/
function logDetail(strMessage, strModule, strFunction){
	log("DETAIL", strMessage, strModule, strFunction);
}   
/* @public
Generic info level logging.
*/
function logInfo(strMessage, strModule, strFunction) {
	log("INFO", strMessage, strModule, strFunction);
}

/* @public
Generic warn level logging.
*/
function logWarn(strMessage, strModule, strFunction){
	log("WARN", strMessage, strModule, strFunction);
}   
/* @public
Generic error level logging.
*/
function logError(strMessage, strModule, strFunction){
	log("ERROR", strMessage, strModule, strFunction);
}

/* @protected
Deprecated info level logging.
*/
function message(strMessage) {
        logDetail(strMessage, "", "");
}

/* @protected
Add a message to the log queue
*/
function log(type, strMessage, strModule, strFunction) {
   try {
	oBase = findClientLogBase();
   
	if (oBase && oBase.getClientLog()) {
		oBase.log(type, strMessage, strModule, strFunction);
	}
         
    } 
    catch(ex) {}
}

pega.clientLog.isActive = function () {
	var oBase = findClientLogBase();
	if (oBase && oBase.getClientLog())
		return true;
	else return false
}
				
 
/* @protected
Find log window using opener search
*/
function findClientLogBase(){
    var oLogBase = null;

    if (!pega.clientLog.base) {

    	var candidate = null;
    	try{
		for(candidate= window.top; (candidate!= null && candidate != candidate.opener); candidate = candidate.opener) {
		   /* Handle case of closed intermediate opener window that is closed */
		   if (typeof candidate.top != "object") {
			  break;
		   }

		   /* We have a valid opener window, check for log window */
		   candidate= candidate.top;
		   if (typeof(candidate.gLogBase) == "object") {
			   oLogBase = candidate.gLogBase;
			   break;
		   }
		}
   	} 
	catch(e){}
	pega.clientLog.base = oLogBase;
    }

    return pega.clientLog.base;

}
//static-content-hash-trigger-GCC
//<!-- <HTML> -->
// pega_desktop_support.js
// <SCRIPT>
/* Pre-requisites - DesktopWrapperSupportCommons.js has to be included
 * This file contains supporting functions and variables for the desktop
 * wrappers to delegate requests to the SpacePaneAPI and/or the SpaceAPIs.
 * @package
 */
/***************************************************************************************************************
 *
 * Functions to access Desktop, Space pane and explorere APIs
 *
 */
pega.d.s = pega.namespace("pega.desktop.support");
var gShowNextInWindow = false;
pega.desktop.runIWM = function() {
	var oSafeURL = new SafeURL("WBOpenLaunch");
	oSafeURL.put("pyActivity", "Assign-.IWMPrimingUtility");
	pega.desktop.openUrlInWindow(oSafeURL.toURL(), "IWM");
};
pega.desktop.support.getDesktopType = function() {
	var oWin = pega.desktop.support.getDesktopWindow();
	//HFix-5391: adding null check
	if (oWin && oWin.pega && oWin.pega.d && oWin.pega.d.desktopType) return oWin.pega.d.desktopType;
	else return null;
};
pega.desktop.support.isSpaceAvailable = function(spaceName) {
	for (var i = 0; i < pega.desktop.availableSpaces.length; i++) {
		var s = pega.desktop.availableSpaces[i];
		if (s.toLowerCase() == spaceName.toLowerCase()) return true;
	}
	return false;
};
/*  Function is replaced by pegaComposite api version when loaded in desktop window of composite portal 
 */
pega.desktop.registerDocumentGadget = function(oGadget) {
	var oWin = pega.desktop.support.getDesktopWindow();
	if (oWin) {
		oWin.pega.d.registerDocumentGadget(oGadget);
	}
};
pega.desktop.support.getMashupGadgetWindow = function() {
	/* Find top-most level window. For popups in the hierarchy use .opener property.*/
	var oWin, prevWin, curWin = window,
		bXDomainWin;
	try {
		do {
			for (oWin = curWin; oWin != null && oWin != oWin.parent; oWin = oWin.parent) {
				try {
					if (!oWin.pega.desktop.support.isSafeToAskParent()) {
						break;
					}
					//oWin.parent && oWin.parent.pega; //removed by the isSafeToAskParent
					/* Here checking for isWebMashup to identify the mashup host page in same domain gadget usecase */
					if (oWin.parent.pega && oWin.parent.pega.web && oWin.parent.pega.web.isWebMashup) {
						break;
					}
					/* Following statement for Safari browser, not throwing exception when access properties on cross domain window. It is returning undefined.*/
					if (!oWin.parent.pega) {
						break;
					}
				} catch (e) {
					break;
				}
			}
			prevWin = oWin;
			curWin = oWin.opener;
		} while (curWin && curWin != oWin && curWin.pega && curWin.pega.Mashup && curWin.pega.Mashup.isAGadgetWindow);
	} catch (e) {}
	if (prevWin && prevWin.pega && prevWin.pega.Mashup && prevWin.pega.Mashup.isAGadgetWindow) {
		if (prevWin == prevWin.opener) {
			/* Popup: If we replace the current doccument then we are getting opener as the same window */
			return undefined;
		} else if (prevWin.parent == prevWin && prevWin.opener == null) {
			/* BUG-246276: Popup Scenario: If we launch popup from gadget and replace the gadget window then we are getting the opener as null  */
			return undefined;
		} else {
			return prevWin;
		}
	} else {
		return undefined;
	}
};
pega.desktop.support.doGadgetAction = function(actionInfo) {
  if(!pega.Mashup && pega.ctx && pega.ctx.isAPopupWindow){
     return false;
  }
	/* First it needs to check whether it is mashup window or not */
	var gadgetFrame = this.getMashupGadgetWindow();
	// HFIX-83096 : Given a multi doc Tabbed DC portal loaded in a Mashup, we don't want the work objects loaded in the tabs to do Communicator send but instead follow the usual handleGadgetLoad path.
	var bSendMashupMessage = gadgetFrame && !(gadgetFrame != window && gadgetFrame.pega && gadgetFrame.pega.u && gadgetFrame.pega.u.d && gadgetFrame.pega.u.d.isPortal());
	if (bSendMashupMessage) {
		/* In IE11, somecases JSON Array is getting converted into JSONObject, to avoid exceptions converting into Object and handling in the handler */
		if (actionInfo.params) {
			var paramObj = {};
			for (var i = 0; i < actionInfo.params.length; i++) {
				paramObj["" + i] = actionInfo.params[i];
			}
			actionInfo.params = paramObj;
		}
		//console.info("doGadgetAction " +actionInfo.name );
		gadgetFrame.pega.Mashup.Communicator.send(actionInfo, {
			target: "HostPage"
		});
		return true;
	}
	var oPwg = pega.desktop.support.getPegaWebGadgetManager();
	if (oPwg != null) {
		var params = actionInfo.params || [];
		params.unshift(oPwg.oDiv, actionInfo.name);
		oPwg.oMgr.doAction.apply(oPwg.oMgr, params);
		return true;
	}
	return false;
};
/*
@public- If pega composite manager is present, perform 'close' action defined on the gadget if any.
*/
pega.desktop.support.closeGadget = function() {
	if (typeof (pegaWebGadgetExtensionPoint) == "function") {
		pegaWebGadgetExtensionPoint();
	} else {
		return pega.desktop.support.doGadgetAction({
			name: "closed"
		})
	}
	return true;
};
/*
@public- If pega composite manager is present, perform 'loaded' action defined on the gadget if any.
*/
pega.desktop.support.loadedGadget = function() {
	if (pega.Mashup && pega.Mashup.registerGadgetCallBack) {
		pega.Mashup.registerGadgetCallBack();
	}
	if (pega.Mashup) {
		pega.u.d.registerResize(pega.u.d.mashupResizeHandler);
	}
	var actionInfo = {
		name: "loaded"
	};
	if (pega.ui.pyStreamNameForGadget) {
		var oPwg = pega.desktop.support.getPegaWebGadgetManager();
		if (oPwg) {
			oPwg.oDiv.pyStreamName = pega.ui.pyStreamNameForGadget;
		} else {
			actionInfo[pyStreamName] = pega.ui.pyStreamNameForGadget;
		}
	}
	// The loaded for the gadget will be called after 0.1s in order to ensure that the iframe has been loaded successfully.
	if (pega.Mashup && pega.ctx.bIsPreGeneratedMashup) {
		pega.u.d.loadGadgetInterval = setInterval(function() {
			var result = pega.desktop.support.doGadgetAction(actionInfo);
		}, 100);
	} else {
		var result = pega.desktop.support.doGadgetAction(actionInfo);
	}

	if (pega.ui.HarnessContextMgr.get("confirm_harness_loaded")) {
		pega.desktop.support.doGadgetAction({
			name: "confirm"
		});
	}
	return result;
};
/*
@public- If pega composite manager is present, perform 'confirm' action defined on the gadget if any.
*/
pega.desktop.support.confirmGadget = function() {
	return pega.desktop.support.doGadgetAction({
		name: "confirm"
	});
};
/*
@public- If pega composite manager is present, perform 'resizing' adjustments to IFrame.
*/
pega.desktop.support.resizeGadget = function() {
	if (!(pega && pega.u && pega.u.d)) {
		return; //as pega.u.d is undefined, fail silently
	}
	return pega.desktop.support.doGadgetAction({
		name: "resize",
		height: pega.u.d.getDocumentHeight()
	});
};
/*
@private- Opens the specified space in a PegaWeb gadget if present.
@param $String$source – Source which is the space name.
@param $String$sourceString – Source string which is the URL to be loaded in the space.
@param $String$sourceType – Source type which specifies the type of the sourceString.
@return $Boolean$ - Returns true or false.
*/
pega.desktop.support.openSpaceInGadget = function(source, sourceString, sourceType) {
	if (sourceType == "spacehome") {
		var oPwg = pega.desktop.support.getPegaWebGadgetManager();
		if (oPwg && typeof (oPwg.oMgr._reloadGadget) == "function") {
			oPwg.oMgr._reloadGadget(oPwg.oDiv);
		}
		return true;
	}
	var configObj = {};
	if (sourceString.get("appName") != null) {
		configObj.appName = sourceString.get("appName");
	}
	if (sourceString.get("systemID") != null) {
		configObj.systemID = sourceString.get("systemID");
	}
	switch (sourceType.toLowerCase()) {
		case "openbyassignment":
			return pega.desktop.support.doGadgetAction({
				name: "openAssignment",
				params: [sourceString.get("param"), null, configObj]
			});
		case "openbyworkhandle":
			return pega.desktop.support.doGadgetAction({
				name: "openWorkByHandle",
				params: [sourceString.get("param"), null, configObj]
			});
		case "openbyworkitem":
			return pega.desktop.support.doGadgetAction({
				name: "openWorkItem",
				params: [sourceString.get("param"), sourceString.get("workpool"), null, configObj]
			});
    case "enternewwork":
      
		case "enternewworkfromflow":
			/*HFIX-26414 : Added custom param support for createNewWork Action when it is configured in IAC.*/
			var customParam = {};
			var keys = sourceString.keys();
			for (var i in keys) {
				if (keys[i] != 'className' && keys[i] != 'HarnessVersion' && keys[i] != 'flowType' && keys[i] !=
					'api' && keys[i] != 'param' && keys[i] != 'version' && keys[i] != 'FlowType') {
					customParam[keys[i]] = sourceString.get(keys[i]);
				}
			}
			return pega.desktop.support.doGadgetAction({
				name: "createNewWork",
        //bug fix for BUG-748909 begin
				params: [sourceString.get("param"), (sourceString.get("FlowType")||null), null, configObj,
					customParam]
        //bug fix for BUG-748909 end
			});
		case "getnextwork":
			return pega.desktop.support.doGadgetAction({
				name: "getNextWorkItem",
				params: [sourceString.get("param"), null, configObj]
			});
		default:
			return false;
	}
	return true;
};
/*
When applications are mashed up from different servers into a PRPC composite portal, the openSpace request should not be routed to the parent.
This function checks, whether the current request context is matching with the composite portal's request context, and if they match returns true
else returns false.

*/
pega.desktop.support.routeToParent = function(oWin) {
	//Let the usual processing continue, if the target window is null
	if (!oWin) return true;
  // reverting changes made for fix for BUG-681324 to fix BUG-732218
  //fix for BUG-681324
  /*
  if (typeof gIsMashupContent != "undefined" && gIsMashupContent == "true") {
		return false;
	}
  */
	try {
		if (typeof (requestHomeURI) == "undefined" || typeof (oWin.requestHomeURI) == "undefined" || requestHomeURI ==
			null || oWin.requestHomeURI == null || typeof (pega.d.pxReqURI) == "undefined" || typeof (oWin.pega.d.pxReqURI) ==
			"undefined") return true;
		if (pega.d.pxReqURI == oWin.pega.d.pxReqURI) return true;
		var requestHomeURIs = new Array();
		var requestURIs = new Array();
		requestHomeURIs[0] = oWin.requestHomeURI;
		requestHomeURIs[1] = requestHomeURI;
		if (requestHomeURIs[0] == requestHomeURIs[1]) return true;

		//return true incase of multi-tenant portal
		//TODO need to handle gracefully
		if (oWin && oWin.gIsMultiTenantPortal) {
			return true;
		}

		var queryStringStartIndex;
		var protocolIndex = -1;
		var domainNameEndIndex;
		var appContextIndex;
		for (var i = 0; i < requestHomeURIs.length; i++) {
			// Remove the appName and thread Name, and the compare
			if (requestHomeURIs[i].toUpperCase().indexOf("HTTPS://") == 0) protocolIndex = 8;
			if (protocolIndex == -1 && requestHomeURIs[i].toUpperCase().indexOf("HTTP://") == 0) protocolIndex = 7;
			if (protocolIndex == -1) protocolIndex = 1;
			if (protocolIndex != 1) domainNameEndIndex = requestHomeURIs[i].indexOf("/", protocolIndex);
			else domainNameEndIndex = 0;
			appContextIndex = requestHomeURIs[i].indexOf("/", domainNameEndIndex + 1);
			if (appContextIndex == -1) {
				queryStringStartIndex = requestHomeURIs[i].indexOf("?");
				if (queryStringStartIndex != -1) {
					requestURIs[i] = requestHomeURIs[i].substring(0, queryStringStartIndex);
				} else {
					requestURIs[i] = requestHomeURIs[i];
				}
				continue;
			}
			var servletEndIndex = requestHomeURIs[i].indexOf("/", appContextIndex + 1);
			if (servletEndIndex == -1) {
				queryStringStartIndex = requestHomeURIs[i].indexOf("?");
				if (queryStringStartIndex != -1) requestURIs[i] = requestHomeURIs[i].substring(0,
					queryStringStartIndex);
				else requestURIs[i] = requestHomeURIs[i];
			} else {
				requestURIs[i] = requestHomeURIs[i].substring(0, servletEndIndex);
			}
		}
		for (var i = 0; i < requestURIs.length; i++) {
			//Remove query string, if there is any
			if (requestURIs[i].indexOf("?") != -1) requestURIs[i] = requestURIs[i].substring(0, requestURIs[i].indexOf(
				"?"));
			// Now remove the leading and trailing slashes
			if (requestURIs[i].indexOf("/") == 0) requestURIs[i] = requestURIs[i].substring(1, requestURIs[i].length);
			if (requestURIs[i].lastIndexOf("/") == requestURIs[i].length - 1) requestURIs[i] = requestURIs[i].substring(
				0, requestURIs[i].length - 1);
		}
		// Now remove the leading and trailing slashes
		if (requestURIs[0] == requestURIs[1]) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return true;
	}
};
/*
@public- Function opens the Specified space and loads the URL.
@param $String$source – Source which is the space name.
@param $String$sourceString – Source string which is the URL to be loaded in the space.
@param $String$sourceType – Source type which specifies the type of the sourceString.
@return $Boolean$ - Returns true or false.
*/
// if target is popup don't look for / ignore AjaxContainer

pega.desktop.support.checkForAjaxContainer = function(source, sourceString, sourceType) {
	var target = sourceString.get("target");
	if (target !== "popup") {
		// BUG-350498 : In mashup we have to skip this.
		if (sourceString.get("mdcTarget") != "dynamicContainer" && !pega.Mashup && pega.u && pega.u.d && typeof pega.u.d.getAllMDCContainers == "function") {
			// If there is no DC, check and target microdc if it is present.  
			var microDCList = pega.u.d.getAllMDCContainers();
			for (var i = 0; i < microDCList.length; i++) {
				var microDCDiv = microDCList[i];
				if ($(microDCDiv).is(":visible")) {
					var microDCName = microDCDiv.getAttribute("data-mdc-id");
					sourceString.put("mdcTarget", microDCName);
					sourceString.put("api", sourceType);
					pega.ui.EventsEmitter.publishSync("MDCAction", sourceString);
					return true;
				}
			}
		}
		if (pega.mobile && pega.mobile.support && pega.mobile.support.getPMCRedux()) {
			// PMC with multi-webview mode enabled, routing action to portal window
			sourceString.put("mdcTarget", "acprimary");
			sourceString.put("api", sourceType);
			//BUG-482165 making formbyurl action to openWorkByURL in case of ajax container in PMC
			if (sourceType == "formbyurl") {
				sourceString.put("api", "openWorkByURL");
			}
			/*US-257828 : pass skeleton details configured in action*/
			if (pega && pega.mobile && pega.mobile.hybrid) {
				var skeletonName = pega.mobile.hybrid.skeletonName ? pega.mobile.hybrid.skeletonName : "";
				if (skeletonName === "") {
					sourceString.put("pyShowSkeleton", "false");
				} else {
					sourceString.put("pySkeletonName", skeletonName);
				}
			}

			var portalWindow = pega.mobile.support.getPortalWindow();
			portalWindow.pega.ui.EventsEmitter.publishSync("MDCAction", sourceString);
			return true;
		}
		return false;
	}
	return false;
};

pega.desktop.support.isTargetAjaxContainer = function(source, sourceString, sourceType) {
	// if target is popup don't look for / ignore AjaxContainer
	var target = sourceString.get("target");
	if (target !== "popup") {
		var acName = sourceString.get("mdcTarget");
		// BUG-485165 : Fix for default use case.
		if (acName && acName != "dynamicContainer") {
			var isCorrectACName = (acName.indexOf("ac") === 0);
			if (!isCorrectACName) {
				acName = null;
			}
		}
		// ISSUE-27314 : Checking if mdcTarget is already present in the sourceString
		if (!acName) {
			// If the action is triggered from microdc, then target microdc.
			if (pega.ctx.isMDC) {
				sourceString.put("mdcTarget", pega.ctx.mdcName);
			}
			// ISSUE-27303 : Changed from else if to if condition.
			if (sourceString.get("isMDC") === true && sourceString.get("recordId")) {
				sourceString.put("mdcTarget", sourceString.get("recordId").split("_")[0]);
			}
			acName = sourceString.get("mdcTarget");
		}
		if (acName && acName != "dynamicContainer") {
			acName = (acName == "microdc" ? "acprimary" : acName);
			sourceString.put("mdcTarget", acName);
			sourceString.put("api", sourceType);
			if (document.querySelector("div[data-mdc-id='" + acName + "']")) {
				//pega.ui.EventsEmitter.publishSync("MDCAction", sourceString);
				return true;
			}
			sourceString.put("api", "");
			sourceString.put("mdcTarget", "");
			return false;
		}
	}
	return false;
};

pega.desktop.support.openSpace = function(source, sourceString, sourceType) {
	if (gShowNextInWindow == true) {
		gShowNextInWindow = false;
		return false;
	}
	var target = sourceString.get("target");
	if (pega.desktop.support.isTargetAjaxContainer(source, sourceString, sourceType)) {
		pega.ui.EventsEmitter.publishSync("MDCAction", sourceString);
		return true;
	}
	if (pega.d.s.getDesktopType() == "Composite") {
		//pega.desktop.nextSpace = source;
		try {
			var oWin = pega.desktop.support.getDesktopWindow();
      var scenarioTestPortalWindow = pega.desktop.support.getSTPortalWindow(oWin);
      if (scenarioTestPortalWindow) {
        // when scenario test portal is open, perform actions on this window rather than desktop window.
        // in this case, desktop window points to top level and test executes in iframe portal window.
        oWin = scenarioTestPortalWindow;
      }
			if (pega.desktop.support.routeToParent(oWin)) {
				var hasCompositeGadget = false;
				if (typeof (oWin.pega.desktop.compositeOpenSpace) != "undefined") {
					hasCompositeGadget = oWin.pega.desktop.compositeOpenSpace(source, sourceString, sourceType);
				} else {
					hasCompositeGadget = top.pega.desktop.compositeOpenSpace(source, sourceString, sourceType);
				}
			}
		} catch (e) {}
	}
	if (hasCompositeGadget) return true;

	if (pega.desktop.support.checkForAjaxContainer(source, sourceString, sourceType)) {
		return true;
	}


	if (pega.desktop.support.openSpaceInGadget(source, sourceString, sourceType)) {
		return true;
	}
	if (sourceString && sourceString.name != 'safeURL') {
		sourceString = SafeURL_createFromURL(sourceString);
	}
	var myDesktop = pega.desktop.support.getDesktopWindow();
	if (myDesktop) {
		var app = myDesktop.application;
		try {
			var result = app.getView("SpacePane").openSpace(source, sourceString, sourceType);
			if (result == undefined || result == null) {
				result = true;
			}
			myDesktop.focus();
			return result;
		} catch (ex) {}
	}
	return false;
};
/*
@api
This function is to 
@param $String$action - “display | createNewWork”.
@param $Object$actionParams - Match IAC parameters for these IAC actions.
@param $Object$subNavigation – {levelA:”XX”, levelB:”XX”, levelC:”XX};  - support three levels of navigation.
@param $Object$optionalParams- additional params on query string.
@return $void$
*/
pega.desktop.support.openLandingPage = function(name, action, actionParams, navigation) {
	var success = false;
	var sourceString = new SafeURL();
	var cParams = actionParams.customParam;
	var paramKeys = "";
	//Adding a paramKey string to be split at server-side, so that RecentGadget can have the custom parameters also. KUMAD1 - BUG-105041
	if (cParams && cParams != '') {
		for (var key in cParams) {
			if (cParams.hasOwnProperty(key)) {
				key = key + "&";
			}
			paramKeys = paramKeys + key;
		}
		paramKeys = paramKeys.substring(0, paramKeys.lastIndexOf("&"));
	}
	if (paramKeys != "" || paramKeys != null) {
		actionParams["paramKeys"] = paramKeys;
	}
	sourceString.put("Name", name);
	sourceString.put("Action", action);
	sourceString.put("ActionParams", actionParams);
	sourceString.put("Navigation", navigation);
	if (actionParams) {
		if (actionParams.target) {
			sourceString.put("mdcTarget", actionParams.target);
		}
	}
	success = pega.desktop.support.openSpace("Rules", sourceString, "openlanding");
};
/*
  @api - This function is called by the various menu options that run as wizards.
  @param $String$sName - It is wizard name.
  @param $String$sQuery - Query string and should not be escaped when passed into this function.
  @return $void$
 */
pega.desktop.support.openWizard = function(sName, sQuery) {
	var wizardLabel = undefined,
		contentId = "",
		dynamicContainerId = "",
		skipConflictCheck = "";
	if (arguments.length > 2) {
		wizardLabel = arguments[2];
	}
	if (arguments[3]) {
		contentId = arguments[3];
	}
	if (arguments[4]) {
		dynamicContainerId = arguments[4];
	}
	if (arguments[5]) {
		skipConflictCheck = arguments[5];
	}
	if (typeof sQuery === 'object') {
		var pyActivity, className, append = true,
			modifiedActivity;
		// sQuery = sQuery.replace(reg,' ');
		// var brokenSQuery = sQuery.split('&');
		if (pega.d.s.getDesktopType() != "Composite") {
			if (sQuery.hasOwnProperty('targetActivity')) {
				pyActivity = sQuery.targetActivity;
			}
			if (pyActivity.indexOf(".") != -1) {
				append = false;
			}
			if (sQuery.hasOwnProperty('className')) {
				className = sQuery.className;
			}
			if (append) {
				modifiedActivity = className + "." + pyActivity;
				sQuery = sQuery.replace(pyActivity, modifiedActivity);
				var str = JSON.stringify(sQuery);
				str = str.replace(pyActivity, modifiedActivity);
				sQuery = JSON.parse(str);
			}
			var str = JSON.stringify(sQuery);
			str = str.replace('targetActivity', 'pyActivity');
			sQuery = JSON.parse(str);
		} else {
			// handling case for composite portal where  classname is  specified in pyActivity
			if (sQuery.hasOwnProperty('targetActivity')) {
				pyActivity = sQuery.targetActivity;
			}
			if (pyActivity.indexOf(".") == -1) { // if pyActivity does not contain className then no modification is required
				append = false;
			}
			if (append) {
				modifiedActivity = pyActivity.substring(pyActivity.indexOf(".") + 1);
				var str = JSON.stringify(sQuery);
				str = str.replace(pyActivity, modifiedActivity);
				sQuery = JSON.parse(str);
			}
		}
	} else {
		var reg = new RegExp('\'', "g");
		sQuery = sQuery.replace(reg, ' ');
		var pyActivity, className, append = true,
			modifiedActivity;
		var brokenSQuery = sQuery.split('&');
		if (pega.d.s.getDesktopType() != "Composite") {
			// handling case for non-composite portal where  classname is not specified in pyActivity
			for (var i = 0; i < brokenSQuery.length; i++) {
				if (brokenSQuery[i].indexOf('targetActivity') != -1) {
					pyActivity = brokenSQuery[i].split("=")[1];
					if (pyActivity.indexOf(".") != -1) { // if pyActivity already contains className then no modification is required
						append = false;
						break;
					}
				} else if (brokenSQuery[i].indexOf('className') != -1) {
					className = brokenSQuery[i].split("=")[1];
				}
			}
			if (append) {
				modifiedActivity = className + "." + pyActivity;
				sQuery = sQuery.replace(pyActivity, modifiedActivity);
			}
			sQuery = sQuery.replace('targetActivity', 'pyActivity');
		} else {
			// handling case for composite portal where  classname is  specified in pyActivity
			for (var i = 0; i < brokenSQuery.length; i++) {
				if (brokenSQuery[i].indexOf('targetActivity') != -1) {
					pyActivity = brokenSQuery[i].split("=")[1];
					if (pyActivity.indexOf(".") == -1) { // if pyActivity does not contain className then no modification is required
						append = false;
						break;
					}
				}
			}
			if (append) {
				modifiedActivity = pyActivity.substring(pyActivity.indexOf(".") + 1);
				sQuery = sQuery.replace(pyActivity, modifiedActivity);
			}
		}
	}
	var success = false;
	var sourceString = new SafeURL();
	sourceString.put("name", sName);
	try {
		if (typeof sQuery === 'object' || JSON.parse(sQuery)) sourceString.put("queryString", JSON.stringify(sQuery));
	} catch (e) {
		sourceString.put("queryString", sQuery);
	}
	if (wizardLabel) {
		sourceString.put("wizardLabel", wizardLabel);
	}
	sourceString.put("contentId", contentId);
	sourceString.put("dynamicContainerId", dynamicContainerId);
	sourceString.put("SkipConflictCheck", skipConflictCheck);
	success = this.openSpace("Rules", sourceString, "openwizard");
	return success;
};
/*
@private- Opening a deferred rule from out side rulesexplorer.
@param $String$pyRuleInsKey – Rule instance key.
@param $Object$pyRuleObjClass – Rule object class.
@param $String$pyFullName – Full name.
@param $String$ pyVersion – Rupe version.
@param $String$pyRuleSet – Rule set name.
@return $void$ - .
*/
pega.desktop.support.deferredOpenRule = function(pyRuleInsKey, pyRuleObjClass, pyFullName, pyVersion, pyRuleSet) {
	var source = "Rules";
	var sourceString = new SafeURL();
	if (pyRuleInsKey && pyRuleInsKey != "") {
		sourceString.put("pyRuleInsKey", pyRuleInsKey);
		sourceString.put("pyRuleObjClass", pyRuleObjClass);
		sourceString.put("pyFullName", pyFullName);
		sourceString.put("pyVersion", pyVersion);
		sourceString.put("pyRuleSet", pyRuleSet);
		sourceString.put("pxObjClass", "Embed-Preferences-Navigation-OpenRuleData");
	}
	var sourceType = "openruledeferred";
	pega.desktop.support.openSpace(source, sourceString, sourceType);
};
/*
@public- Executes the specified source type in the named space. If the space is not
   previously opened or has items queued this call returns false result. This
   method will not raise the space to visibility but will instead execute the
   specified command on the named space without changing the active space of
   the desktop.
@param $String$source – Source which is the space name.
@param $String$sourceString – Source string which is the URL to be loaded in the space.
@param $String$sourceType – Source type which specifies the type of the sourceString.
@return $Boolean$ - Returns success or failure of the operation.
*/
pega.desktop.support.execSpace = function(source, sourceString, sourceType) {
	if (gShowNextInWindow == true) {
		gShowNextInWindow = false;
		return false;
	}
	if (sourceString && sourceString.name != 'safeURL') {
		// TODO: Is strSpaceName a global variable?
		if (strSpaceName == "Rules" && typeof (sourceString) == 'string' && (sourceString.indexOf("=") < 0)) {
			sourceString = "param=" + sourceString;
		}
		sourceString = SafeURL_createFromURL(sourceString);
	}
	var myDesktop = pega.desktop.support.getDesktopWindow()
	if (myDesktop) {
		var app = myDesktop.application;
		if (app.getView("SpaceNavigation") && app.getView("SpaceNavigation").isSpace(source)) {
			var result = app.getView("SpacePane").execSpace(source, sourceString, sourceType);
			myDesktop.focus();
			return (result == 0) ? true : false;
		}
	}
	return false;
};
/***************************************************************************************************************
 *
 * Rule space support functions
 *
 */
// A delimiter added while creating a newRuleType including ruleType,
// Inheritance if added and strParams if any.
var gstrArgsDelim = "!@#$";
var gnwCount = 0;
/*
@private- This wrapper function will open a rule in form mode in the Rules Space given the URL minus the base.
@param $String$strURL – Key that identifies the rule to open.
@return $void$ - .
*/
pega.desktop.support.openRuleByURL = function(strURL) {
	if (typeof strURL == "object" && strURL.name == "safeURL") oSafeURL = strURL; // it is already passed as object
	else var oSafeURL = SafeURL_createFromURL(strURL);
	var success = pega.desktop.support.openSpace("Rules", oSafeURL, "rulebyurl");
	if (!success) {
		pega.desktop.support.openUrlInWindow(oSafeURL, "Rules");
	}
};
/*
@private- This wrapper function will open a rule in form mode in the Rules Space. If Desktop is
            not available, it opens the rule in a floating window.
@param $String$strHandle – Key that identifies the rule to open.
@param $String$strURL – URL to set the src attribute of the Rule form IFRAME.
@return $void$ - .
*/
pega.desktop.support.openRuleWithURL = function(strHandle, strURL) {
	var sourceString = new SafeURL();
	sourceString.put("Handle", strHandle);
	var safeURL = SafeURL_createFromURL(strURL);
	sourceString.put("url", safeURL);
	var success = pega.desktop.support.openSpace("Rules", sourceString, "rulecreatewithurl");
	if (!success) {
		pega.desktop.support.openRuleInWindow(sourceString, "", "", "rulecreatewithurl");
	}
};
///////////////////////////METHODS FROM DESKTOPWRAPPERSUPPORTUSER.js///////////////////////////////
/*
@private- Returns the current application name.
@return $String$ - returns application name.
*/
pega.desktop.support.getCurrentWorkPool = function() {
	var myDesktop = pega.desktop.support.getDesktopWindow();
	return (myDesktop && myDesktop.application.getUserSessionInfo().currentWorkPool);
};
///////////////////////////Migrated from gadgetsScript.js///////////////////////////////
/*
@private- Returns class name to be used by Reports.
@return $String$ - returns Class Name.
*/
pega.desktop.support.getClassForReports = function(objClass) {
	if (objClass == "Assign-") return "Assign-Worklist";
	try {
		var currentWorkPool = pega.desktop.support.getCurrentWorkPool();
	} catch (exception) {
		return objClass;
	}
	if (objClass == "Work-") return currentWorkPool;
	if (objClass == "History-Work-") return "History-" + currentWorkPool;
	return objClass;
};
///////////////////DESKTOPWRAPPERSUPPORTCOMMONS.JS//////////////////////////////////////////////////////
// DesktopWrapperSupportCommon.js
// <SCRIPT>
/*
@private- Returns reference to PegaWeb gadget manager object if present.
@return $object$ - Returns object or null.
*/
pega.desktop.support.getPegaWebGadgetManager = function() {
	//try {
	var oPwgWin = null;
	var oPwgMgr = null;
	// Find top-most level window. For popups in the hierarchy use .opener property.
	var oWin = window;
	var bMgrImplFound = false;
	try {
    try {
      if (typeof (oWin.pega.web) != "undefined" && typeof (oWin.pega.web.mgr) != "undefined" && !oWin.pega
          .web.mgr._bIsProxy) {
        bMgrImplFound = true;
      }
    } catch (e) {}
    if(!bMgrImplFound){
      do {
        for (oWin = oWin.opener != null ? oWin.opener : oWin; oWin != null && oWin != oWin.parent; oWin = oWin.parent) {
          try {
            if (typeof (oWin.pega.web) != "undefined" && typeof (oWin.pega.web.mgr) != "undefined" && !oWin.pega
                .web.mgr._bIsProxy) {
              bMgrImplFound = true;
              break;
            }
          } catch (e) {}
        }
        try {
          if (typeof (oWin) != "undefined" && typeof (oWin.pega) != "undefined") {
            if (typeof (oWin.pega.web) != "undefined" && typeof (oWin.pega.web.mgr) != "undefined" && !oWin.pega
                .web.mgr._bIsProxy) {
              bMgrImplFound = true;
              break;
            } else {
              break;
            }
          }
        } catch (e) {}
      }while (typeof (oWin.opener) != "undefined" && oWin.opener != null && !bMgrImplFound && oWin.opener != oWin);

    }

		if (oWin.pega.web && typeof (oWin.pega.web.mgr) == 'object') {
			oPwgWin = oWin;
			oPwgMgr = oWin.pega.web.mgr;
			if (oPwgMgr._bIsProxy) {
				return null;
			}
		}
	} catch (e) {}
	if (oPwgMgr == null) {
		return null;
	}
	oPwgWin = oWin;
	// Find the gadget owning window at the bottom of the window runtime hierarchy.
	var oPwgDiv = null;
	try {
		if (typeof (pega.desktop.support.getFrameElement()) != 'undefined') {
			// Bottom window is the contentWindow of the IFrame inside div
			var oFr = pega.desktop.support.getFrameElement();
			if (oFr != null && (oFr.name == "actionIFrame" || oFr.name == "QUERY")) {
				try {
					oFr = pega.desktop.support.getFrameElement(1);
					if (oFr == null || typeof (oFr.PegaWebGadget) == "undefined") {
						return null;
					}
				} catch (e) {}
			}
			try {
				for (; oFr != null && typeof (oFr.PegaWebGadget) == 'undefined'; oFr = getFrameElementForWindow(oFr.document
					.parentWindow));
			} catch (e) {}
			if (oFr != null) {
				oPwgDiv = oFr.parentNode; // found gadget's div
				if (oPwgDiv.tagName != "DIV") oPwgDiv = null;
			} else {
				var arrFrames = oPwgWin.document.getElementsByTagName("IFRAME");
				var arrLength = arrFrames.length;
				var frameEle = null;
				for (var i = 0; i < arrLength; i++) {
					frameEle = arrFrames[i];
					if (typeof (frameEle.PegaWebGadget) != 'undefined') {
						oPwgDiv = frameEle.parentNode;
						break;
					}
				}
			}
		} else {
			// Bottom window is the popup of a virtual gadget inside the opener window.
		}
		if (oPwgWin == null || oPwgDiv == null || oPwgMgr == null) {
			return null;
		} else return eval({
			oDiv: oPwgDiv,
			oMgr: oPwgMgr,
			oWin: oPwgWin
		});
	} catch (e) {}
	//===================================================
	if (window.opener != null) {
		try {
			var myDesktop = window.opener.pega.desktop.support.getDesktopWindow();
			if (myDesktop && typeof (myDesktop.pega.web.mgr) == 'object') {
				return eval({
					oDiv: window.name,
					oMgr: myDesktop.pega.web.mgr
				});
			} else return null;
		} catch (e) {
			return null;
		}
	}
	var oPwgDiv = null;
	var oPwgWin = null;
	var oPwgMgr = null;
	var oWin = window;
	var sWinName = "";
	try {
		for (; oWin != null && oWin != oWin.parent; oWin = oWin.parent) {
			if (typeof (getFrameElementForWindow(oWin)) != 'undefined') {
				var oFr = getFrameElementForWindow(oWin);
				if (oFr != null && typeof (oFr.PegaWebGadget) != 'undefined' && oPwgDiv == null) {
					oPwgDiv = oFr.parentNode; // found gadget's div
				}
			}
		}
	} catch (e) {
		return null;
	}
	try {
		if (oWin.pega.web && typeof (oWin.pega.web.mgr) == 'object') {
			oPwgWin = oWin;
			oPwgMgr = oWin.pega.web.mgr;
		}
	} catch (e) {
		return null;
	}
	if (oPwgWin == null || oPwgDiv == null || oPwgMgr == null) return null;
	else return eval({
		oDiv: oPwgDiv,
		oMgr: oPwgMgr
	});
	//} catch(e) { return null; }
};
/*
@public- This method determines if the window is the designer desktop.
@param $Object$objTopWindow – Top window object.
@return $Boolean$ - returns true if the  desktop window, false otherwise.
*/
pega.desktop.support.isWindowTheDesignerDesktop = function(objTopWindow) {
	if (typeof gIsMashupContent != "undefined" && gIsMashupContent == "true") {
		return false;
	}
	var bRetVal = false;
	try {
		if (typeof objTopWindow.application == "object") {
			bRetVal = (typeof objTopWindow.application.name == "string");
		} else {
			bRetVal = false;
		}
	} catch (e) {}
	return bRetVal;
};
/*
@public- This method determines if the current window is embedded within the
   designer desktop or it is not running in the desktop
@param $Object$objWindow – Window object.
@return $Boolean$ - returns true if running within the desktop window, false if not running
           within the desktop window.
*/
pega.desktop.support.isWindowOnDesignerDesktop = function(objWindow) {
	try {
		var myDesktop = pega.desktop.support.getDesktopFrames();
		if (myDesktop != null) return true;
	} catch (e) {}
	return false;
};
/*
@public- This method determines if the window is in a port launched from the designer desktop
   desktop by checking a session property made available by the server.
@return $Boolean$ - returns true if portal launched from the designer desktop
*/
pega.desktop.support.getAttachedDesignerDesktop = function() {
	var oAttachedWindow = null;
	// Initialize the window to the designer desktop if available
	try {
		oAttachedWindow = pega.desktop.support.getDesktopWindow();
	} catch (e) {}
	// Perform additional logic to see if there is a better candidate window to use
	try {
		var oDesktop = pega.desktop.support.getDesktopWindow();
		if (oDesktop) {
			var oOpener;
			if (oDesktop.opener) {
				oOpener = oDesktop.opener;
			} else {
				oOpener = oDesktop;
			}
			var openerDesktop = oOpener.pega.desktop.support.getDesktopWindow();
			if (openerDesktop && openerDesktop.pega.desktop.support.isWindowTheDesignerDesktop(openerDesktop)) {
				oAttachedWindow = openerDesktop;
			}
		}
	} catch (e) {}
	return oAttachedWindow;
};
/*
@public- This method determines if the session is running within the designer
   desktop by checking a session property made available by the server.
@return $Boolean$ - returns true if running within the desktop session, false if not running
         within the desktop session.
*/
pega.desktop.support.isInDesignerDesktop = function() {
	try {
		return pega.desktop.support.isWindowTheDesignerDesktop(window.top);
	} catch (e) {}
	return false;
};
/*
@public- This method determines if the session is running within the User
   desktop by checking a session property made available by the server.
@return $void$ - returns true if running within the User session, false if not running
          within the User session.
*/
pega.desktop.support.isInUserDesktop = function() {
	try {
		var windowToCheck = top;
		if (pega.desktop.support.isWindowTheDesignerDesktop(windowToCheck)) {
			var myDesktop = pega.desktop.support.getDesktopWindow();
			if (myDesktop.DesktopUserSessionInfo_gStrDesktopType == "User") {
				return true;
			}
		}
	} catch (e) {}
	return false;
};
/*
@public- Creates a string representing the default window dimensions to be passed
  through a window.open call.
@param $Integer$Top – Top position of the window.
@param $Integer$left – Left position of the window.
@param $Integer$height – Window height.
@param $Integer$Width – Window width.
@return $String$ - returns a string containing the top, left, height, and width parameters
          concatenated into an appropriate string.
*/
pega.desktop.support.createWindowDimensions = function(top, left, height, width) {
	try {
		var nWndTop = window.screen.height * top / 100;
		var nWndLeft = window.screen.width * left / 100;
		var nWndHeight = window.screen.height * height / 100;
		var nWndWidth = window.screen.width * width / 100;
		return "left=" + nWndLeft + ",top=" + nWndTop + ",height=" + nWndHeight + ",width=" + nWndWidth;
	} catch (e) {}
};
// set dimensions, in fractions of 100
var FormSize = pega.desktop.support.createWindowDimensions(0, 0, 82, 80);
var RuleFormSize = pega.desktop.support.createWindowDimensions(0, 0, 82, 80);
var QueryFormSize = pega.desktop.support.createWindowDimensions(5, 15, 75, 80);
var WorkFormSize = pega.desktop.support.createWindowDimensions(0, 0, 82, 66);
var HistoryWindowSize = pega.desktop.support.createWindowDimensions(0, 0, 82, 66) + ",resizable=yes";
var PopupWindowFeatures = "status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes";
var PopupWindowNoScrollFeatures = "status=yes,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=yes";
var Features = PopupWindowFeatures;
/*
@public- Acquire a reference to the SpacePaneAPI of the desktop running the client
   session. This provides the users with direct access to the management API
  for the various spaces.
@return $Object$ - returns an instance of the SpacePaneAPI object.
*/
pega.desktop.support.getSpacePaneAPI = function() {
	var app = pega.desktop.support.getDesktopApplication();
	if (app) {
		return app.getView("SpacePane");
	} else return null;
};
/*
@public- Acquire a reference to the Application of the desktop running the client
   session. This provides the users with direct access to the management API
   for the entire desktop.
@return $Object$ -  an instance of the application object.f
*/
pega.desktop.support.getDesktopApplication = function() {
	var myDesktop = pega.desktop.support.getDesktopWindow();
	if (myDesktop) return myDesktop.application;
	else return null;
};
//*****************************************************************************
// General Use Wrappers
//*****************************************************************************
/*
@private- This function will open a form in a new window.
@param $String$oUrl – URL to open in the new window.
@param $String$sName – window name to use in the TARGET
                 attribute of a FORM or A tag. windowName can contain only
                 alphanumeric or underscore (_) characters.
@param $String$sOptions – A string containing a comma-separated list determining
                    whether or not to create various standard window features.
@param $Boolean$bReplace – A Boolean parameter that specifies whether the sURL
                    creates a new entry or replaces the current entry in the
                    window's history list. This parameter is NO LONGER USED
@return $Object$ - returns window object.
*/
pega.desktop.support.openUrlInWindow = function(oUrl, sName, sOptions, bReplace, isAlternateUrlBase, isNoEncodingURL) {
	// flag busy to test tooling
	//pega.ui.statetracking.setBusy();
	function setPortalParameters(oSafeURL) {
		try {
			var portalWindow = pega.desktop.support.getDesktopWindow();
			var portalThreadName, portalName;
			if (portalWindow && portalWindow.pega && portalWindow.pega.u && portalWindow.pega.u.d) {
				portalThreadName = portalWindow.pega.u.d.getThreadName();
				if (pega && pega.ctx && pega.ctx.portalName) {
					portalName = pega.ctx.portalName;
				}
				if (typeof oSafeURL == "object" && oSafeURL.name == "safeURL") {
					oSafeURL.put("target", "popup");
					oSafeURL.put("portalThreadName", portalThreadName);
					if (portalName) {
						oSafeURL.put("portalName", portalName);
					}
				} else if (typeof oSafeURL == "string") {
					oSafeURL = oSafeURL + "&target=popup";
					if (portalThreadName) {
						oSafeURL = oSafeURL + "&portalThreadName=" + portalThreadName;
					}
					if (portalName) {
						oSafeURL = oSafeURL + "&portalName=" + portalName;
					}
				}
			}
		} catch (e) {}
		return oSafeURL;
	}
	var strURL = "";
	var app = pega.desktop.support.getDesktopApplication();
	if (isAlternateUrlBase != "true") {
		oUrl = setPortalParameters(oUrl);
	}
    var isDisplayAction = false;
  if (typeof oUrl == "object" && oUrl.name == "safeURL") {
    isDisplayAction = oUrl.get("action") === "display";
    
    //US-341273:If Show Harness popup case , set initial url to blank.htm
    if(isDisplayAction){
      strURL = "blank.htm";
    }
    else{
      strURL = oUrl.toURL();
    }
		
	} else {
		if (isNoEncodingURL == "true") {
			strURL = oUrl;
		} else {
			if (isAlternateUrlBase == "true" && oUrl) {
				/* changes made for BUG-260834 are reverted due to BUG-268205 */
				oUrl = SafeURL_createFromURL(oUrl);
        var resetDisableEventSource = false;
        if(!pega.disableEventSource){
          resetDisableEventSource = true;
          pega.disableEventSource = true;
        }
				oUrl = oUrl.toURL();
        if(resetDisableEventSource){
          delete pega.disableEventSource;
        }
				var quesArray = oUrl.match(/\?/g);
				if (quesArray && quesArray.length > 1) {
					var index = oUrl.indexOf("?");
					var subURI = oUrl.substring(0, index + 1);
					var urlParams = oUrl.substring(index + 1);
					urlParams = urlParams.replace(/\?/g, "&");
					oUrl = subURI + urlParams;
				}
				strURL = oUrl;
			} else {
				var oSafeURL = SafeURL_createFromURL(oUrl);
				// DATA TRANSFORM CHANGES START 
				var sPreActivity = oSafeURL.get('pyActivity');
				var sPreStream = oSafeURL.get('pyStream');
				var sPxReqUri = oSafeURL.get('pxReqURI');
				if (!sPreActivity && !sPreStream && !sPxReqUri) {
					oSafeURL.put('pyActivity', '@baseclass.pzTransformAndRun');
				}else if(!isDisplayAction && sPreActivity && sPreActivity.indexOf("baseclass.pzProcessURLInWindow") == -1){
             oSafeURL.put('pyActivity', '@baseclass.pzProcessURLInWindow');   
             oSafeURL.put('pyPreActivity', sPreActivity);   
        }
				//ETCHASKETCH DATA TRANSFORM CHANGES END
				//HFIX-21189 : Resolving prop references when encryption enabled case.
				for (var key in oSafeURL.hashtable) {
					var value = oSafeURL.get(key);
					if (value.indexOf("#~") >= 0) {
						var val = pega.u.ChangeTrackerMap.getTracker().getPropertyValue(value.substring(2, value.length -
							2));
						oSafeURL.put(key, val);
					}
				}
				//HFIX-21189 : Resolving prop references when encryption enabled case.          
				oSafeURL.put('target', 'popup');
				strURL = oSafeURL.toURL();
			}
		}
	}
	if (oUrl == "" || oUrl == null || strURL == "" || strURL == null) {
		return false;
	}
	/* For alternate domains, the protocol must be specified if we're not to open the window based off the prpc URL context */
	if (strURL != "blank.htm" && strURL.replace(/(^\s*)/, "").charAt(0) != '/') {
		/* Prepending with default http protocol, If the URL does not contains the protocol information*/
		if (!(/^([\s]*)(pega-)*(([a-z0-9]+:)|())\/\//i.test(strURL))) {
			if (pega && pega.lang) {
				strURL = pega.lang.trim(strURL);
			}
			strURL = "//" + strURL;
		}
	}
	if (sName != null) {
		var regexReplace = /[ \\\/\&=#\-\!\.\~\:\@\'\"\*\%\(\)\,]/gi;
		sName = sName.replace(regexReplace, "");
	} else {
		sName = "";
	}
	if (sOptions == null) {
		sOptions = "";
	}
	if (sOptions.indexOf("left") == -1 && sOptions.indexOf("top") == -1 && sOptions.indexOf("height") == -1 &&
		sOptions.indexOf("width") == -1) {
		if (sName == "Rules") {
			sOptions = sOptions + RuleFormSize; //createWindowDimensions( 0,  0, 82, 80);
		} else if (sName == "Work") {
			sOptions = sOptions + WorkFormSize; //createWindowDimensions( 0,  0, 82, 66);
		} else if (sName == "List") {
			sOptions = sOptions + QueryFormSize; //createWindowDimensions(5, 15, 75, 80);
		} else if (sName == "HistoryAndAttachments") {
			sOptions = sOptions + HistoryWindowSize;
		}
		//FIX for BUG-45932, PopupWindowFeatures overrides sOptions, switched the order
		sOptions = PopupWindowFeatures + ',' + sOptions;
		//sOptions = sOptions + PopupWindowFeatures;
	}
	//BUG-31144 : in safari sOptions having no values in height and width ("height=width=") opens a very small window 
	if (sOptions.indexOf("height") != -1) {
		if (sOptions.indexOf("=", sOptions.indexOf("height")) + 1 == sOptions.length) sOptions = sOptions.replace(
			"height=", "");
		else if (sOptions.charAt(sOptions.indexOf("=", sOptions.indexOf("height")) + 1) == ',') sOptions = sOptions.replace(
			"height=,", "");
	}
	if (sOptions.indexOf("width") != -1) {
		if (sOptions.indexOf("=", sOptions.indexOf("width")) + 1 == sOptions.length) sOptions = sOptions.replace(
			"width=", "");
		else if (sOptions.charAt(sOptions.indexOf("=", sOptions.indexOf("width")) + 1) == ',') sOptions = sOptions.replace(
			"width=,", "");
	}
	if (sOptions.length == 0) sOptions = "a"; // if this is empty or a space, it opens a new window instead of popup
	if (!window.pms) {
		if (sName == "Rules" || sName == "Work" || sName == "Reports" || sName == "Tools" || sName == "Dashboard")
			sName = sName + "_popup";
	}
	var newWindow = null;
	var current = self,
		windowName = sName;
	if (!window.pms) {
		if (pega.desktop.pxClientSession && windowName != "" && windowName != "_self" && windowName != "_blank" &&
			windowName != "_top" && windowName != "_parent") {
			windowName = pega.desktop.pxClientSession + "_" + windowName;
		}
	}
	/*BUG-255816 : Added bWarnBeforeChangingWindow check to show new window alert when accessibility is on.*/
	var warn = false;
	if ((pega && pega.u && pega.u.d)) {
		warn = pega.u.d.bWarnBeforeChangingWindow;
	}
	if (warn == true && !showDialogForWindowChange()) {
		return;
	}
	try {
		var hCWindow = pega.desktop.support.getDesktopWindow();
		if (hCWindow && hCWindow.launchbox && hCWindow.launchbox.Browser) {
			var extURL = strURL;
			/*In alternate domain case should not prepend with current domain*/
			if (!(/^([\s]*)(([a-z0-9]+:)|())\/\//i.test(strURL)) && isAlternateUrlBase != "true") {
				if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location
					.host;
				extURL = window.location.origin + strURL;
			}
			var listener = {
				onClosed: function(url) {},
				onLoadStarted: function(url) {},
				onLoadFinished: function(url) { /*pega.ui.statetracking.setDone();*/},
				onLoadFailure: function(url, error) {
					console.log("Browser.onLoadFailure code=" + error['code'] + " error=" + error[
						'description'] + " url='" + url + "'");
					//pega.ui.statetracking.setDone();
				}
			};
			hCWindow.launchbox.Browser.removeListener(listener);
			hCWindow.launchbox.Browser.addListener(listener);
			hCWindow.launchbox.Browser.start(extURL.replace(" ", ""));
			return null;
		} else {
			newWindow = current.open(strURL, windowName, sOptions);
		}
	} catch (ex) {
		//pega.ui.statetracking.setDone();
		return null;
	}
	// window.open() returns null for Windows Vista due to IE running in protected mode
	// do not try to use newWindow reference.
	if (!newWindow && navigator.userAgent.search("Windows NT 6") != -1) {
		//pega.ui.statetracking.setDone();
		return null;
	}
	try {
		if (newWindow && (typeof newWindow.opener == "object")) {
			//The current window is closed and opened again if the opener is not the current window::B-7171
			if (newWindow.opener != current && newWindow != current) {
				newWindow.close();
				newWindow = current.open(strURL, windowName, sOptions);
			}
			if (newWindow && (typeof newWindow.opener == "object")) {
				try {
					newWindow.focus();
					newWindow.focus(); //Call focus twice: BUG-1018
				} catch (e) { // fix cross-domain issue
					newWindow.close();
					newWindow = current.open(strURL, windowName, sOptions);
				}
        
        
        
        // US-341273 : If show harness action, create a form with safeurl data.
        if (isDisplayAction) {
          
          oUrl.put("pzCTkn", pega.ctx.activeCSRFToken);
          oUrl.put("pzBFP", pega.d.browserFingerprint);
          var baseURI = pega.ctx.url;
          var actionSafeURL = new SafeURL("@baseclass.doUIAction");
          var inner =
              "<!DOCTYPE html><html><body><scr" +
              'ipt type="text/javascript">var  form=document.createElement("form");form.setAttribute("method","post");form.setAttribute("action","' + actionSafeURL.toURL() + '");'+
              'var input=document.createElement("input");input.setAttribute("name","action");' +
              'input.setAttribute("type","hidden");input.setAttribute("value","' +
              oUrl.get("action") +
              '");form.appendChild(input); var label=document.createElement("label");label.innerText = "Loading...";label.setAttribute("aria-live","assertive");form.appendChild(label);';

          /*HFix-25608: parameters passed along with flow name should be processed to support backward compatibility */
          var flowName = oUrl.get("flowName");
          if (flowName && flowName.indexOf("&") != -1) {
            var flowParams = flowName.split("&");
            flowName = flowParams[0];
            for (var l = 1; l < flowParams.length; l++) {
              var currentParam = flowParams[l];
              if (currentParam && currentParam.indexOf("=") != -1) {
                var eqIndex = currentParam.indexOf("=");
                oUrl.put(
                  currentParam.substring(0, eqIndex),
                  currentParam.substring(eqIndex + 1)
                );
              }
            }
          }


          //Bug-136223, passing encodedPassword=true and passing UserIdentifier and Password in the body for POST method.

          var parmKeys = oUrl.keys();
          for (var i = 0; i < parmKeys.length; i++) {
            var parmKey = parmKeys[i];
            var parmValue = oUrl.get(parmKey);
            if (typeof parmValue === "undefined") {
              parmValue = "";
            }
            inner += 'var input=document.createElement("input");';
            inner += 'input.setAttribute("name","' + parmKey + '");';
            var isJSONValue = false; 
            // BUG-525291 : Fix for issue when we have nested JSON like : '{"pyModelReportDetails":"{\"ruleLabel\":\"Sales Model\"}"}'
            if (parmValue === "preActivityParams" || parmValue === "preActivityDynamicParams" || parmValue === "pyDataTransformDynamicParams") {
              isJSONValue = true;
            }

            /*
            We are intentionally using double quotes below for JSON values to work.
            decodeURIComponent is required for refresh use case
          */
            // If any exceptions occur while decoding, ignore and continue;
            try {
              parmValue = decodeURIComponent(parmValue);
            } catch(e) {}
            if (isJSONValue) {
              inner += 'input.setAttribute("value",' + JSON.stringify(parmValue) + ');';
            } else {
              inner += "input.setAttribute('value','" + parmValue + "');";
            }
            inner += 'input.setAttribute("type","hidden");';
            inner += 'form.appendChild(input);';
          }

          inner += 'document.body.appendChild(form);form.submit();</script></body></html>';
          var doc = newWindow.document;
          doc.open();
          doc.write(inner);
          doc.close();
        }
        
				if (app) {
					if ((strURL.lastIndexOf(location.origin, 0) === 0) || (strURL.lastIndexOf("/", 0) === 0) || isDisplayAction) {
						if (app.openedWindows.indexOf(newWindow) === -1) {
							app.openedWindows.push(newWindow);
						}
					} else {
						app.crossDomainPopupWindowNames = app.crossDomainPopupWindowNames || [];
						if (app.crossDomainPopupWindowNames.indexOf(windowName) === -1) {
							app.crossDomainPopupWindowNames.push(windowName);
						}

					}
				}
			} else {
				newWindow = null;
				//alert("An attempt to open a popup window failed.   A popup blocker may be enabled.");
			}
		} else {
			newWindow = null;
			//alert("An attempt to open a popup window failed.   A popup blocker may be enabled.");
		}
	} catch (ex) {
		if (!newWindow) newWindow = null;
		//alert("An attempt to open a popup window failed.   A popup blocker may be enabled.");
	}
	/*
		// flag loading complete to test tooling - when loading is complete.  anonymous func for IE9
		if (newWindow != null) {
		  window.setTimeout( function() { pega.desktop.support.pauseForWindowToLoad(newWindow, 0)}, 500 );
		}
		else {
		  pega.ui.statetracking.setDone();
		}
	  */
	return newWindow;
};



pega.desktop.support.pauseForWindowToLoad = function(newWindow, ctr) {
	// first pass through here is 500 msec in; document (initially for 'blank page') should exist.  if doc cannot be reached it is because of security limit; external website
	try {
		if (newWindow.document) {
			// arbitary choice of >0 elements; blank is zero, ListView is 1
			if (ctr > 60 || (newWindow.document.body && newWindow.document.body.children.length > 0)) {
				pega.ui.statetracking.setDone();
			} else {
				ctr++;
				window.setTimeout(function() {
					pega.desktop.support.pauseForWindowToLoad(newWindow, ctr)
				}, 500);
			}
		}
	} catch (ex) {
		pega.ui.statetracking.setDone();
	}
};
/*
@DEPRECATED - This function will open a form in a new modal dialog. this API is no longer supported on some browsers
@param $String$oUrl – A string specifying the URL to open in the new dialog, or a SafeURL object.
@param $Integer$iHeight – dialogHeight (in pixels).
@param $Integer$iWidth – dialogWidth (in pixels).
@param $String$sFeatures – A String parameter that contains features of the showModalDialog function.
@param $Object$vArguments – A String or an Array  that contains dialog arguments of the showModalDialog function.
@return $Object$ - returns null if oUrl is blank or null, or the returnValue of the modal dialog.
*/
pega.desktop.support.openUrlInDialog = function(oUrl, iHeight, iWidth, sFeatures, vArguments) {
	var strURL = "";
	var strFeatures = "resizable:yes;status:no;scroll:yes;help:no;";
	var strHeight = "";
	var strWidth = "";
	var arrDialogArgs = new Array();
	// Get the encoded Url string via SafeURL
	if (typeof oUrl == "object" && oUrl.name == "safeURL") {
		strURL = oUrl.toURL();
	} else {
		var oSafeURL = SafeURL_createFromURL(oUrl);
		strURL = oSafeURL.toURL();
	}
	if (oUrl == "" || oUrl == null || strURL == "" || strURL == null) {
		return null;
	}
	if (iHeight && iHeight != "") {
		strHeight = "dialogHeight:" + iHeight + "px;";
	}
	if (iWidth && iWidth != "") {
		strWidth = "dialogWidth:" + iWidth + "px;";
	}
	if (sFeatures && sFeatures != "") {
		strFeatures = sFeatures;
	}
	strFeatures = strHeight + strWidth + strFeatures;
	if (vArguments && vArguments != "") {
		if (typeof vArguments == "array") {
			arrDialogArgs.concat(vArguments);
		} else {
			arrDialogArgs["vArguments"] = vArguments;
		}
	}
	arrDialogArgs["opener"] = window;
	var objWin = pega.desktop.support.getDesktopWindow();
	if (!objWin) {
		objWin = window;
	}
	return objWin.showModalDialog(strURL, arrDialogArgs, strFeatures);
};
/*
@private- Opens the given url in the specified space, if the space argument
   is omitted, blank, or null the currently active space is targeted.
@param $String$url – the url to be opened.
@param $String$space – (optional) the space to raise / open.
@param $Boolean$bringToFocus – (optional) boolean value to indicate weather to switch to the raised space.
@return $void$ - .
@exceptions - throws an exception if the url is blank, null or an empty
               string
*/
pega.desktop.support.openUrlInSpace = function(url, space, bringToFocus) {
	if (typeof url == "object" && url.name == "safeURL") {
		url = SafeURL_clone(url);
	} else if ((null != url) && (url != "")) {
		var oSafeURL = SafeURL_createFromURL(url);
		url = oSafeURL;
	}
	// Use parameter space or current space
	var strSpaceName;
	if ((space == null) || (space == "")) strSpaceName = getCurrentSpaceName();
	else strSpaceName = space;
	// If raise to open parameter used
	if (arguments.length > 2) {
		var source = null;
		if ((null == url) || (url == "")) {
			var myDesktop = pega.desktop.support.getDesktopWindow();
			if (myDesktop) {
				var app = myDesktop.application;
				source = app.getView("SpacePane").getDefaultSpaceHomeURL(strSpaceName);
			}
		} else {
			source = url;
		}
		if (bringToFocus) {
			if (!pega.desktop.support.openSpace(strSpaceName, source, "spaceHomeWithUrl")) {
				pega.desktop.support.openUrlInWindow(source, strSpaceName);
			}
		} else {
			if (!execSpace(strSpaceName, source, "spaceHomeWithUrl")) {
				pega.desktop.support.openUrlInWindow(source, strSpaceName);
			}
		}
	}
	// No bring to focus parameter - pre V.42 case
	else {
		if (!pega.desktop.support.openSpace(strSpaceName, url, "spaceHomeWithUrl")) {
			pega.desktop.support.openUrlInWindow(url, strSpaceName);
		}
	}
};
/*
@private Handles resolution of access groupts.
@param $String$strInsKey - Optional The instance key of the work assignment.
@param $boolean$fromAssignment - Optional If key is assignment id then pass this as true.
@param $String$harnessVersion - Optional Legacy parameter for old harnesses.
@return $void$
*/
pega.desktop.support.handleMultipleAG = function(strInsKey, fromAssignment, harnessVersion, configParams) {
	if (pega.desktop.support.getPegaWebGadgetManager() != null) {
		return true;
	} else if (pega.d.s.getDesktopType() == "Composite" || pega.d.s.isCosmosCase()) {
		return true;
	}
	// Get ApplyTo class from handle
	var strArr = strInsKey.split(" ");
	if (fromAssignment) {
		if (strArr.length > 1) var strClassName = strArr[1];
		else var strClassName = strArr[0];
	} else {
		var strClassName = strArr[0];
	}
	/*function that calls an activity to get the accessgroup that can support a specified class. 
	   *It even opens the assignment/work object depending on the key.*/
	try {
		var strAGList = pega.desktop.support.asyncGetAccessGroupForClass(strClassName, strInsKey, fromAssignment,
			harnessVersion, configParams);
	} catch (e) {
		return false;
	}
	if (strAGList == "false") {
		return true;
	} else return false;
};
/*
@private- This method gets the AccessGroup/Application for a given classname.
@return $String$ - returns list of AccessGroups as a string.
*/
pega.desktop.support.getAccessGroupForClass = function(strClassName) {
	var myDesktop = pega.desktop.support.getDesktopWindow();
	if (myDesktop && myDesktop.gAccessGroupList.length == 1) {
		return myDesktop.gAccessGroupList[0];
	}
  var agclassurl = pega.d.agclassurl?pega.d.agclassurl:"Data-Admin-Operator-AccessGroup.getAccessGroupsForClass";
	var oSafeURL = new SafeURL(agclassurl);
	oSafeURL.put("ClassName", strClassName);
	var strAgList = httpRequestAsynch(oSafeURL.toURL(), null, 50, 100)
	return strAgList;
};
/*
@private- This method gets the AccessGroup/Application for a given classname. Passing last 2 parameters even opens the assignment/work.                   
@param $String$strInsKey - Internal. The instance key of the  assignment/handle of work object.
@param $boolean$fromAssignment - Internal. If passing instance key of assignment, pass it true. If work handle pass it false.
@return $String$ - returns list of AccessGroups as a string.
*/
pega.desktop.support.asyncGetAccessGroupForClass = function(strClassName, strInsKey, fromAssignment, harnessVersion,
	configParams) {
	var myDesktop = pega.desktop.support.getDesktopWindow();
	if (myDesktop && myDesktop.gAccessGroupList.length == 1) { //AG list found in global object. Use it and avoid AJAX call.
		pega.desktop.support.postHandleMultipleAG(myDesktop.gAccessGroupList[0], strInsKey, fromAssignment,
			harnessVersion);
		return;
	}
	var agclassurl = pega.d.agclassurl?pega.d.agclassurl:"Data-Admin-Operator-AccessGroup.getAccessGroupsForClass";
	var oSafeURL = new SafeURL(agclassurl);
	oSafeURL.put("ClassName", strClassName);
	var callbackArgs = [strInsKey, fromAssignment, harnessVersion, configParams];
	var callback = {
		success: function(responseObj) {
			pega.desktop.support.postHandleMultipleAG(responseObj);
		},
		failure: function(oResponse) {
			return false;
		},
		argument: callbackArgs
	};
	var request = pega.util.Connect.asyncRequest('GET', oSafeURL.toURL(), callback);
	pega.util.Connect.handleReadyState(request, callback);
};
/*
@private- This post processing logic for handling muliple AG resolution.
@param $String$responseObj - The Access Group list.
@return $boolean$ - returns true if open for new accessgroup.
*/
pega.desktop.support.postHandleMultipleAG = function(responseObj, key, bFromAssignment, harnessVersion, configParams) {
	if (responseObj.responseText) {
		var strAGList = responseObj.responseText;
		key = responseObj.argument[0];
		bFromAssignment = responseObj.argument[1];
		harnessVersion = responseObj.argument[2];
		configParams = responseObj.argument[3];
	} else {
		var strAGList = responseObj;
	}
	// check if desired access group matches current access group
	var strCurrentAG = pega.d.currAG.toLowerCase();;
	var bAGInList = false;
	var strAGArr = strAGList.split(",");
	for (var i = 0; i < strAGArr.length; i++) {
		if (strCurrentAG == strAGArr[i].toLowerCase()) {
			bAGInList = true;
		}
	}
	// Need to redirect in new application, desired application doesn't match current application        
	if (!bAGInList) {
		var strSelectedAG = strAGArr[0];
		pega.desktop.support.openAssignmentWithApplication(strSelectedAG, key, bFromAssignment);
	} else {
		if (bFromAssignment) pega.desktop.support.postOpenAssignment(key, undefined, configParams);
		else pega.desktop.support.postOpenWorkByHandle(key, harnessVersion, configParams);
	}
};
/*
@private- This post processing logic for openAssignment api..
@param $String$strInsKey - The instance key of the work assignment.
@param $Object$paramObject - object literal containing additional parameters.
@param $Object$URLObject - Safe URL object
@return $boolean$ - returns true if open for new accessgroup.
*/
pega.desktop.support.postOpenAssignment = function(key, paramObject, URLObject) {
	var mdcTarget = "";
	if (URLObject && typeof URLObject == "object" && URLObject.name == "safeURL") {
		var oSafeURL = SafeURL_clone(URLObject);
	} else {
		var oSafeURL = new SafeURL();
	}
	oSafeURL.put("param", key);
	if (paramObject && typeof (paramObject) == "object") {
		if (paramObject.NewTaskStatus) {
			oSafeURL.put("NewTaskStatus", paramObject.NewTaskStatus);
		}
		if (paramObject.TaskIndex) {
			oSafeURL.put("TaskIndex", paramObject.TaskIndex);
		}
		oSafeURL.put("paramObject", paramObject);
	}
	if (URLObject && typeof (URLObject) == "object") {
		mdcTarget= URLObject.mdcTarget ? URLObject.mdcTarget : (URLObject.hashtable ? URLObject.hashtable.mdcTarget : "");
		if (mdcTarget) {
			oSafeURL.put("mdcTarget", mdcTarget);
		}
	}

	function postOpenAssignmentCallback() {
		if (!openSpace("Work", oSafeURL, "openbyassignment")) {
			var strInsKey = oSafeURL.toQueryString();
			var strURL = pega.desktop.support.constructUrl(strInsKey, "openbyassignment");
			pega.desktop.openUrlInWindow(strURL, "pyWorkPage", WorkFormSize + PopupWindowFeatures);
		}
		pega && pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton && pega.control.Actions.prototype.hideSkeleton();
	}

  var isMultiWebViewPegaMobileClient = pega && pega.mobile && pega.mobile.isMultiWebViewPegaMobileClient;
	/* In case of BEGIN for nonosco case it should have offlineEnabled flag set to false */
	if (isMultiWebViewPegaMobileClient && !(pega && pega.offline)) {
		var url = SafeURL_createFromURL(window.location.href);
		var isRemoteCase = url.get("isRemoteCase");
		if (isRemoteCase === "true") {
			oSafeURL.put("offlineEnabled", "false");
			oSafeURL.put("action", "openAssignment");
			oSafeURL.put("isRemoteCase", "true");
		}
	}

	//BUG-509482 changes: added extra check i.e. if the assignment key is same as of current context key then skip doClose.
	if (((pega.ctx.isMDC && pega.ctx.acName === mdcTarget) || isMultiWebViewPegaMobileClient)
      && pega.ctx.strHarnessPurpose === "Review" && key.indexOf(pega.ctx.strPyID) !== -1) {
		oSafeURL.put("pyActivity", "DoClose");
		oSafeURL.put("pxReqURI", pega.ctx.pxReqURI);
		oSafeURL.put("isMDC", true);
		oSafeURL.put("clearThreadState", "true");
		oSafeURL.put("skipSwitchDocument", "true");
		oSafeURL.put("recordId", isMultiWebViewPegaMobileClient ? window.name : pega.ctx.recordId);
		oSafeURL.put("mdcTarget", isMultiWebViewPegaMobileClient ? "acprimary" : pega.ctx.acName);
		oSafeURL.put("closeDocCallback", function() {
			oSafeURL.remove("closeDocCallback");
			oSafeURL.remove("pyActivity");
			postOpenAssignmentCallback();
		});
		var redux = isMultiWebViewPegaMobileClient ? pega.mobile.support.getPMCRedux() : pega.redux;
		redux.store.dispatch(redux.actions(redux.actionTypes.CLOSE, oSafeURL));
	} else {
		postOpenAssignmentCallback();
	}
};
/*
@private- This post processing logic for openWorkByHandle api..
@param $String$strInsKey - The work object handle.
@param $String$harnessVersion - Harness Version
@param $Object$URLObject - safe URL
@return $boolean$ - returns true if open for new accessgroup.
*/
pega.desktop.support.postOpenWorkByHandle = function(key, harnessVersion, URLObject) {
	if (!oSafeURL) {
		var oSafeURL = new SafeURL();
	}
	var sourceString = "";
	if (key && key != "") {
		oSafeURL.put("param", key);
	}
	if (harnessVersion && harnessVersion != "") {
		oSafeURL.put("version", harnessVersion);
	}
	if (URLObject && typeof URLObject == "object" && URLObject.name == "safeURL") {
		if (URLObject.get("systemID")) oSafeURL.put("systemID", URLObject.get("systemID"));
		if (URLObject.get("appName")) oSafeURL.put("appName", URLObject.get("appName"));
		if (URLObject.get("contentID")) oSafeURL.put("contentID", URLObject.get("contentID"));
		if (URLObject.get("dynamicContainerID")) oSafeURL.put("dynamicContainerID", URLObject.get(
			"dynamicContainerID"));
		if (URLObject.get("SkipConflictCheck")) oSafeURL.put("SkipConflictCheck", URLObject.get("SkipConflictCheck"));
		if (URLObject.get("reload")) oSafeURL.put("reload", URLObject.get("reload"));
		if (URLObject.get("mdcTarget")) oSafeURL.put("mdcTarget", URLObject.get("mdcTarget"));
		if (URLObject.get("tenantData")) oSafeURL.put("tenantData", URLObject.get("tenantData"));
		if (URLObject.get("paramsObj")) oSafeURL.put("paramsObj", URLObject.get("paramsObj"));
	}

	function postOpenWorkByHandleCallback() {
		if (!pega.desktop.support.openSpace("Work", oSafeURL, "openbyworkHandle")) {
			sourceString = oSafeURL.toQueryString();
			var strURL = pega.desktop.support.constructUrl(sourceString, "openbyworkHandle");
			var paramsObj = oSafeURL.get("paramsObj");
			if (paramsObj) {
				for (var paramKey in paramsObj) {
					strURL.put(paramKey, paramsObj[paramKey]);
				}
			}
			pega.desktop.openUrlInWindow(strURL, key, WorkFormSize + PopupWindowFeatures);
		}
		pega && pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton && pega.control.Actions.prototype.hideSkeleton();
	}
	var closeAndReopen = false;
	var usesMultiWebView = typeof pmcRuntimeFeatures !== "undefined" && pmcRuntimeFeatures.pxUsesMultiWebView;
	var redux = usesMultiWebView ? pega.mobile.support.getPMCRedux() : pega.redux;
	// BUG-365780 fix
	if ((pega.ctx.isMDC || usesMultiWebView) && oSafeURL.get("mdcTarget") != "dynamicContainer" &&  pega.ctx.name ===  oSafeURL.get("mdcTarget")) {
		var state = redux.Utils.getAjaxContainerState();
		var mdcDocs = state.mdcDocs;
		for (var i = 0; i < mdcDocs.length; ++i) {
			if (mdcDocs[i].recordId === pega.ctx.recordId) {
				if ((pega.ctx.strHarnessPurpose === "Perform" || URLObject.get("reload")) && mdcDocs[i].recordKey ===
					key) {
					closeAndReopen = true;
				}
				break;
			}
		}
	}
	if (closeAndReopen) {
		oSafeURL.put("isMDC", true);
		oSafeURL.put("recordId", pega.ctx.recordId);
		oSafeURL.put("mdcTarget", pega.ctx.acName);
		oSafeURL.put("skipSwitchDocument", "true");
		oSafeURL.put("clearThreadState", "true");
		oSafeURL.put("closeDocCallback", function() {
			oSafeURL.remove("closeDocCallback");
			postOpenWorkByHandleCallback();
		});
		redux.store.dispatch(redux.actions(redux.actionTypes.CLOSE, oSafeURL));
	} else {
		postOpenWorkByHandleCallback();
	}
};
/*
@private- This method gets the AccessGroup/Application next Work Object and if required opens the WO in new Accessgroup.
@return $boolean$ - returns true if open for new accessgroup.
*/
pega.desktop.support.openNextWorkWithApplication = function() {
	var myDesktop = pega.desktop.support.getDesktopWindow();
	if (myDesktop && myDesktop.gAccessGroupList.length == 1) {
		return false;
	}
	var oSafeURL = new SafeURL("Work-.GetNextWorkAccessGroup");
	oSafeURL.put("workPage", "newWorkPage");
	var strAGName = httpRequestAsynch(oSafeURL.toURL(), null, 50, 100)
	if (strAGName == "false") {
		return false;
	}
	var strArr = strAGName.split(",");
	strAGName = strArr[0];
	var strInskey = strArr[1];
	pega.desktop.support.openAssignmentWithApplication(strAGName, strInskey, false);
	return true;
};
/*
@private- This method will open the work object in .
@return $String$ - returns list of AccessGroups as a string.
*/
pega.desktop.support.openAssignmentWithApplication = function(strSelectedAG, strHandle, fromAssignment) {
	var oSafeURL = new SafeURL();
	oSafeURL.put("param", strHandle);
	var oURL = null;
	if (fromAssignment) {
		oURL = pega.desktop.support.constructUrl(oSafeURL, "openbyassignment");
	} else {
		oURL = pega.desktop.support.constructUrl(oSafeURL, "openbyworkHandle");
	}
	var oRedirectUrl = new SafeURL("RedirectAndRun");
	oRedirectUrl.put("ThreadName", strSelectedAG); // this will be the same current existing thread name
	oRedirectUrl.put("Location", oURL.toQueryString()); // this may probably be our PRServlet location
	oRedirectUrl.put("AccessGroupName", strSelectedAG); // you may probably have to pass new AG parameter
	var newWin = pega.desktop.support.openUrlInWindow(oRedirectUrl.toURL(), strSelectedAG, WorkFormSize +
		PopupWindowFeatures);
};
pega.desktop.support.getFrameElement = function(levelCount) {
	var currentWindow = window;
	if (typeof levelCount != "undefined") {
		for (var count = 0; count < levelCount; count++) {
			if (currentWindow.pega.desktop.support.isSafeToAskParent()) {
				currentWindow = currentWindow.parent;
			} else {
				return null;
			}
		}
	}
	return getFrameElementForWindow(currentWindow);
};
var getFrameElementForWindow = function(windowObject) {
	if (windowObject.pega && windowObject.pega.desktop && windowObject.pega.desktop.support && windowObject.pega.desktop
		.support.isSafeToAskParent()) {
		/*Added try catch block so that the flow does not break for cases like outlook plugins*/
		try {
			return windowObject.frameElement;
		} catch (e) {
			return null;
		}
	}
};
pega.desktop.support.isSafeToAskParent = function() {
	var isMashupEnvironment = (typeof gIsMashupContent != "undefined" && gIsMashupContent == "true") ? true : false;
	var isGatewayEnvironment = (pxReqHomeURI.indexOf('/prgateway/') !== -1);
	// for non-mashup case (or)
	// for a legacy gateway(IAC) environment simply return true to account cross domain scenarios
	if (isGatewayEnvironment || !isMashupEnvironment) {
		return true;
	}
	//gIsSafeToAskParent is initialized to empty string.
	if (gIsSafeToAskParent == "unsafe" || gIsSafeToAskParent == "inProgress") {
		gIsSafeToAskParent = "unsafe";
		return false;
	}
	//In a web mashup isWindowLodedByPega is(iframe or popup):
	//false in mashup for the first load, and 
	//true after navigating to a different page in this window
	//For non-mashup scenarios, in an iframe the referrer would be pega window
	//For topmost window that loads pega content, referrer is empty 
	//For (popup/new tab) coming from pega content referrer is pega
	var portNumber = pxReqHomeURI.split("/")[2].split(":")[1];
	var testedURI = pxReqHomeURI;
	if (portNumber == "80" || portNumber == "443") {
		testedURI = pxReqHomeURI.replace(":" + portNumber + "/", "/");
	}
	testedURI = testedURI.split("/")[2];
	gIsSafeToAskParent = "inProgress";
	var mashupBaseReferrer;
	if (pega.desktop.support.readCookie("mashupBaseReferrer")) {
		mashupBaseReferrer = pega.desktop.support.readCookie("mashupBaseReferrer");
	} else {
		pega.desktop.support.setCookie("mashupBaseReferrer", document.referrer, 1);
		mashupBaseReferrer = document.referrer;
	}
	mashupBaseReferrer = mashupBaseReferrer.split("/")[2];
	var isWindowLodedByPega = (mashupBaseReferrer && mashupBaseReferrer.indexOf(testedURI) != -1) ? true : false;
	var isSafeToAskParent;
	if (!isWindowLodedByPega) {
		isSafeToAskParent = false;
	} else {
		try {
			var iAmpopup = (window.dialogArguments && window.dialogArguments["opener"]) ? true : false;
			var queryWindow = window.parent;
			if (iAmpopup) {
				queryWindow = window.opener;
			}
			isSafeToAskParent = queryWindow.pega;
		} catch (e) {}
	}
	gIsSafeToAskParent = isSafeToAskParent ? "safe" : "unsafe";
	return isSafeToAskParent ? true : false;
};

/**
@public- This method gets the portal window that opened to run scenario test from desktop (landing page). Takes desktop window as param and finds the scenario test portal window

@return $Object$ - returns reference to a window holding the scenario test portal window or null.
**/
pega.desktop.support.getSTPortalWindow = function(pDesktopWindow) {
  if (!pDesktopWindow || !pDesktopWindow.AFTPortal) {
    return null;
  }
  var portalIframElem = pDesktopWindow.document.querySelector('iframe#' + pDesktopWindow.AFTPortal);
  if (!portalIframElem) {
    return null;
  }
  return portalIframElem.contentWindow;
}

var gIsSafeToAskParent = "";
/*
@public- This method gets the desktop window that opened the current top, which
   may be a popup or the desktop itself.
@return $Object$ - returns reference to a window holding the desktop or null.
*/
pega.desktop.support.getDesktopWindow = function() {
	//Determing if Iam the desktopWindow
	if (window.application && window.application.name == "PegaDesktopApplicationController") {
		pega.desktop.support.desktopWindow = window;
	}
	var isMashupEnvironment = (typeof gIsMashupContent != "undefined" && gIsMashupContent == "true") ? true : false;
	//rewrite function if desktopWindow already found once. gating isSafeToAskParent for mashup cases only.
	//Need to verify why opening rules from tracer is getting this set to unsafe.
	if ((isMashupEnvironment && !pega.desktop.support.isSafeToAskParent()) || pega.desktop.support.desktopWindow) {
		pega.desktop.support.getDesktopWindow = function() {
			try {
				if (pega.desktop.support.desktopWindow && typeof pega.desktop.support.desktopWindow.application ==
					"object") {
					return pega.desktop.support.desktopWindow;
				} else {
					return null;
				}
			} catch (e) {
				pega.desktop.support.desktopWindow = null;
				return null;
			}
		}
		return pega.desktop.support.getDesktopWindow();
	}
	if (isMashupEnvironment && !pega.desktop.support.isSafeToAskParent()) {
		return null;
	}
	var iterationWindow = self;
	var windowAbove = null;
	var currentWindow = null;
	while (iterationWindow) {
		if (iterationWindow == currentWindow) {
			break;
		}
		currentWindow = iterationWindow;
		//Im a popwindow from a an iframe that hosts the mashup
		if (isMashupEnvironment && currentWindow.pega.desktop && currentWindow.pega.desktop.support && currentWindow
			.pega.desktop.support.isSafeToAskParent && currentWindow.pega.desktop.support.isSafeToAskParent()) {
			if (currentWindow.dialogArguments && window.dialogArguments["opener"]) {
				windowAbove = currentWindow.opener;
			} else {
				//iframe inside a mashup iframe
				windowAbove = currentWindow.parent;
			}
			if (windowAbove && windowAbove.application && windowAbove.application.name ==
				"PegaDesktopApplicationController") {
				pega.desktop.support.desktopWindow = windowAbove;
				break;
			} else {
				iterationWindow = windowAbove;
			}
		} else {
			break;
		}
	}
	if (isMashupEnvironment) {
		return pega.desktop.support.desktopWindow;
	}
	// Check if we are parent portal is a workspace
	try {
		var currentWin = window.parent;
		while (currentWin) {
			if (currentWin.application && currentWin.pega.desktop.portalCategory === "workspace" && currentWin.name ===
				currentWin.pega.desktop.portalName) {
				pega.desktop.support.desktopWindow = currentWin;
				return pega.desktop.support.desktopWindow;
			} else {
				if (currentWin.parent && currentWin != currentWin.parent) {
					currentWin = currentWin.parent;
				} else {
					break;
				}
			}
		}
	} catch (e) {}
	//Determine for the first time in opener or parent windows
	var myDesktop = null;
	// RMH - work around to solve bad myDesktop the second time this func is
	// called. We are sometimes getting "access denied" errors when we attempt
	// to access the opener more than once
	var candidate;
	var useThisAsTop = null;
	try {
		useThisAsTop = top;
	} catch (e) {}
	var sWin = useThisAsTop;
	if (window.dialogArguments) sWin = window.dialogArguments["opener"];
	try {
		var useThisAsSWinTop;
		useThisAsSWinTop = sWin.top;
		candidate = useThisAsSWinTop;
		var previousCandidate = {};
		do {
			if (candidate == previousCandidate) {
				break;
			}
			var useThisAsCandidateTop;
			useThisAsCandidateTop = candidate.top;
			// Handle case of closed intermediate opener window that is closed
			if (typeof useThisAsCandidateTop != "object") {
				break;
			}
			// We have a valid opener window, check for appliation object
			candidate = useThisAsCandidateTop;
			if ((typeof candidate.application == "object") && (candidate.application.name ==
				"PegaDesktopApplicationController")) {
				myDesktop = candidate;
				break;
			}
			previousCandidate = candidate;
			candidate = candidate.opener;
			// BUG-96304 03/28/2013 GUJAS1 If opener's desktopWindow is already determined, use it.
			try { //   BUG-122927 catch if candidate.pega.desktop.support.desktopWindow reference throws exception
				if (candidate.pega != null && candidate.pega.desktop.support.desktopWindow != null) {
					myDesktop = candidate.pega.desktop.support.desktopWindow;
					break;
				}
			} catch (e) {}
		} while (candidate != null);
	} catch (e) {}
	if (myDesktop == null || myDesktop.application == null) {
		myDesktop = pega.desktop.support.getDesktopFrames();
	}
	pega.desktop.support.desktopWindow = myDesktop;
	return myDesktop;
};
/*
@public- This method sets the desktop window
*/
pega.desktop.support.setDesktopWindow = function(refWindow) {
	pega.desktop.support.desktopWindow = refWindow;
};
/*
@private- A helper function for getDesktopWindow which sets myDesktop to frames
@return result;
*/
pega.desktop.support.getDesktopFrames = function() {
	var result;
	try {
		var candidate = window;
		if ((typeof candidate.application == "object") && (candidate.application.name ==
			"PegaDesktopApplicationController")) {
			return candidate;
		}
		do {
			var useThisAsSWinFrames = candidate;
			candidate = useThisAsSWinFrames.parent;
			if ((typeof candidate.application == "object") && (candidate.application.name ==
				"PegaDesktopApplicationController")) {
				result = candidate;
				break;
			}
		}
		while (candidate != null && candidate.parent != candidate)
	} catch (e) {}
	return result;
};
/*
@private- Opens a rule in a popup window given the specific pzInsKey for the rule to
 be opened.
@param $String$strKey – Required string form of the pzInsKey of the rule to open.
@param $Boolean$bOpenSpecificVersion – True if specific version needs to open otherwise false.
@param $Boolean$bLimitAccess – True if it has limited access otherwise false.
@param $String$sourceType – Source type of the rule.
@return $void$ - .
*/
pega.desktop.support.openRuleInWindow = function(strKey, bOpenSpecificVersion, bLimitAccess, sourceType) {
	// NOTE: bOpenSpecificVersion not supported
	if (strKey.length > 0) {
		var safekey = strKey.replace(/\W/g, '_');
		var oSafeURL = new SafeURL("WBOpenLaunch");
		oSafeURL.put("InsHandle", strKey);
		oSafeURL.put("Action", "Open");
		if (sourceType != undefined) {
			oSafeURL.put("SourceType", sourceType);
		}
		var url = oSafeURL;
		pega.desktop.support.openUrlInWindow(url, safekey, RuleFormSize + PopupWindowFeatures);
	} else {
		window.status = "Can't open rule; no key.";
	}
};
/*
@public- Gets a reference to the explorer object for the named space.
@param $String$strSpaceName – Space pane name.
@return $Object$ - reference to explorer object if space employs an explorer,
		 otherwise returns null.
*/
pega.desktop.support.getSpaceExplorer = function(strSpaceName) {
	if (pega.d.s.getDesktopType() == "Composite") return null;
	var result = null;
	var objSpacePaneAPI = getSpacePaneAPI();
	if (objSpacePaneAPI) {
		if (strSpaceName == "Rules" && objSpacePaneAPI.getRulesExplorerController) {
			result = objSpacePaneAPI.getRulesExplorerController();
		} else if (strSpaceName == "Work" && objSpacePaneAPI.getWorkExplorerController) {
			result = objSpacePaneAPI.getWorkExplorerController();
		}
	}
	return result;
};
/*
@public- Acquires a reference to the ExplorerController in the work space.
@return $Object$ - returns a reference to the ExplorerController if the space is currently
		 open and has an explorer view, otherwise null.
*/
pega.desktop.support.getWorkExplorer = function() {
	return getSpaceExplorer("Work");
};
/*
@public- Acquires a reference to the Rulesexplorer.
@return $Object$ - returns a reference to the Rulesexplorer.
*/
pega.desktop.support.getRulesExplorer = function() {
	return getSpaceExplorer("Rules");
};

/*
@protected-  returns the Localized string of fieldValue.
@param $String$propertyName – It will be R-O-FieldValue propertyName.  It will always be "pyMessageLabel".
@param $String$fieldValue – It will be R-O-FieldValue fieldValue. It needs to be localized.
@param $Object$valueHash – Hash Array storing the runtime values of variables.
@return $String$ - returns field value.
*/
pega.desktop.support.getLocalString = function(propertyName, fieldValue, valueHash) {
	if (pega.d.s.getDesktopType() == "Composite") return fieldValue;
	var app = getDesktopApplication();
	if (app) return app.getModel().getResourceBundle().getLocalString(propertyName, fieldValue, valueHash);
	else return fieldValue;
};
/*
@public-  attaches an intercept function to a spacetitlebar toolbar icon.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@param $Object$handler – Callback function intercept function invoked when the action occurs.
@return $Boolean$ - returns true if intercept attached.
*/
pega.desktop.support.attachIntercept = function(strAction, handler) {
	var app = getDesktopApplication();
	if (app) {
		var spaceTitleBarAPI = app.getView("SpaceTitleBar");
		// Is null for developer desktop
		if (spaceTitleBarAPI != null) {
			return spaceTitleBarAPI.attachIntercept(strAction, handler);
		}
	}
	return false;
};
/*
@public-  attaches an intercept function to a spacetitlebar toolbar icon.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@param $Object$handler – Callback function intercept function invoked when the action occurs.
@return $Boolean$ - returns true if intercept attached.
*/
pega.desktop.support.processSpaceTitleBarAction = function(strAction) {
	var app = getDesktopApplication();
	if (app) {
		var spaceTitleBarAPI = app.getView("SpaceTitleBar");
		// Is null for developer desktop
		if (spaceTitleBarAPI != null) {
			return spaceTitleBarAPI.processAction(strAction);
		}
	}
	return false;
};
/*
@public-  disables a spacetitlebar toolbar icon for the current document.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@return $void$ - .
*/
pega.desktop.support.disableSpaceTitleBarAction = function(strAction) {
	var app = getDesktopApplication();
	if (app) {
		var spaceTitleBarAPI = app.getView("SpaceTitleBar");
		// Is null for developer desktop
		if (spaceTitleBarAPI != null) {
			spaceTitleBarAPI.disableAction(strAction);
		}
	}
};
/*
@public-  enables a spacetitlebar toolbar icon for the current document.
@param $String$strAction – Name of action to intercept REFRESH | PRINT | BACK | FORWARD.
@return $void$ - .
*/
pega.desktop.support.enableSpaceTitleBarAction = function(strAction) {
	var app = getDesktopApplication();
	if (app) {
		var spaceTitleBarAPI = app.getView("SpaceTitleBar");
		// Is null for developer desktop
		if (spaceTitleBarAPI != null) {
			spaceTitleBarAPI.enableAction(strAction);
		}
	}
};
/*
@public-  do not add the current document to history.
@return $void$ - .
*/
pega.desktop.support.disableHistoryForDocument = function() {
	var app = getDesktopApplication();
	if (app) {
		var spaceTitleBarAPI = app.getView("SpaceTitleBar");
		// Is null for developer desktop
		if (spaceTitleBarAPI) {
			spaceTitleBarAPI.disableAddToHistory();
		}
	}
};
/*
@public-  This function will open help topic based upon url.
@param $String$strUrl – Relative URL.
@return $void$ - .
*/
pega.desktop.support.showHelpTopic = function(strUrl) {
	var helpWidth = 960;
	var helpHeight = 780;
	var screenWidth = window.screen.width;
	var screenHeight = window.screen.height;
	var returnCenteredLeft = screenWidth - 1000;
	var returnCenteredTop = (screenHeight / 2) - 450;
	var strFeatures = "top=" + returnCenteredTop + ",left=" + returnCenteredLeft + ",width=" + helpWidth +
		",height=" + helpHeight +
		",menubar=no,location=no,status=no,titlebar=no,toolbar=no,scrollbars=yes,resizable=yes";
	var windowPath = getReqURI();
	var helpURL = strHelpBaseURL;
	if (window.baseHelpURL) helpURL = window.baseHelpURL + "/";
	var infoURL = helpURL + strUrl;
	infoURL = SafeURL_createFromURL(infoURL);
	var objWnd = pega.desktop.support.openUrlInWindow(infoURL, "HelpWindow", strFeatures);
	try {
		objWnd.focus();
	} catch (e) {}
};
pega.desktop.support.getSystemURL = function(systemName) {
	var sourceSystems = document.all('pegaSourceSystems');
	var objSystems = sourceSystems.XMLDocument.selectNodes("/pagedata/System");
	for (var i = 0; i < objSystems.length; i++) {
		var oSystem = objSystems[i];
		if (oSystem.selectSingleNode("Name").text == systemName) {
			return objSystem.selectSingleNode("URL").text;
		}
	}
	return null;
};
/*
@private-  Construct the url to send to the server to acquire the work form.
@param $String$sourceString – Source string.
@param $String$sourceType – Source type.
@return $String$ - url to pass to the server to acquire the populated work form.
*/
pega.desktop.support.constructUrl = function(sourceString, sourceType) {
	if (sourceString && sourceString.name != 'safeURL') {
		sourceString = SafeURL_createFromURL(sourceString);
	} else {
		// Perform a copy of safeURL to prevent loss of reference if calling window closed
		sourceString = SafeURL_clone(sourceString);
	}
	//var oSafe = pega.desktop.support.getSystemURL("hello");
	var strWorkURL = new SafeURL();
	var strCurrentWorkPool = getCurrentWorkPool();
	var param = sourceString.get("param");
	var bHarnessPurpose = (sourceString.size() < 2) ? true : (sourceString.get("version") != "0");
	var strStartingFlow = (!sourceString.get("FlowType")) ? null : sourceString.get("FlowType");
	var strMethod = sourceType.toLowerCase();
	switch (strMethod) {
		case "openbyassignment":
			strWorkURL.put("pyActivity", "Assign-Worklist.ProcessAssignment");
			strWorkURL.put("ClassName", "Assign-Worklist");
			strWorkURL.put("InsHandle", param);
			break;
		case "formbyurl":
			strWorkURL = sourceString;
			break;
		case "getnextwork": // Used to take the URL - requires testing
			strWorkURL.put("pyActivity", ((strCurrentWorkPool && strCurrentWorkPool != "") ? strCurrentWorkPool :
				"Work-") + ".GetNextWork");
			strWorkURL.put("UserIdentifier", param);
			strWorkURL.put("glimpseMode", "Scripts");
			strWorkURL.put("gnwCount", (gnwCount++) + "");
			break;
		case "enternewwork": // Used to take the URL - requires testing
			strWorkURL.put("pyActivity", param + ".New");
			strWorkURL.put("InsClass", param);
			strWorkURL.put("FolderType", "pyDefault");
			if (bHarnessPurpose) strWorkURL.put("HarnessPurpose", "New");
			break;
		case "enternewworkfromflow":
			strWorkURL.put("pyActivity", param + ".NewFromFlow");
			strWorkURL.put("InsClass", param);
			strWorkURL.put("FlowType", strStartingFlow);
			strWorkURL.put("param", param);
			// BUG-82294 GUJAS1 11/08/2012 Add flow params to the SafeURL.
			var keys = sourceString.keys();
			for (var i in keys) {
				if (keys[i] != 'className' && keys[i] != 'HarnessVersion' && keys[i] != 'flowType' && keys[i] !=
					'api' && keys[i] != 'param' && keys[i] != 'version' && keys[i] != 'FlowType') {
					strWorkURL.put(keys[i], sourceString.get(keys[i]));
				}
			}
			break;
		case "openbyworkhandle":
			strWorkURL.put("pyActivity", ((strCurrentWorkPool && strCurrentWorkPool != "") ? strCurrentWorkPool :
				"Work-") + ".Open");
			strWorkURL.put("InsHandle", param);
			strWorkURL.put("Action", "Review");
			strWorkURL.put("AllowInput", "false");
			if (bHarnessPurpose) strWorkURL.put("HarnessPurpose", "Review");
			break;
		case "openbyworkitem":
			var tmpSourceString = trim(param);
			//var tmpIds = tmpSourceString.split(" ");
			//strArg0 = tmpIds[0];
			if (sourceString.get("workpool")) strCurrentWorkPool = sourceString.get("workpool");
			strWorkURL.put("pyActivity", ((strCurrentWorkPool && strCurrentWorkPool != "") ? strCurrentWorkPool :
				"Work-") + ".GetWorkByID");
			strWorkURL.put("WorkPool", strCurrentWorkPool);
			strWorkURL.put("ID", tmpSourceString);
			if (bHarnessPurpose) strWorkURL.put("HarnessPurpose", "Review");
			break;
		case "listbyuser":
			strWorkURL.put("pyActivity", "Rule-Obj-ListView.ShowView");
			strWorkURL.put("ViewClass", "Assign-Worklist");
			strWorkURL.put("ViewPurpose", "WorkList");
			strWorkURL.put("ViewOwner", "ALL");
			strWorkURL.put("pyAction", "Refresh");
			strWorkURL.put("showHeader", "false");
			strWorkURL.put("UserID", param);
			strWorkURL.put("ViewHeader", "false");
			strWorkURL.put("glimpseMode", "Scripts");
			break;
		case "listbybasket":
			strWorkURL.put("pyActivity", "Rule-Obj-ListView.ShowView");
			strWorkURL.put("ViewClass", "Assign-WorkBasket");
			strWorkURL.put("ViewPurpose", "workbasketlist");
			strWorkURL.put("ViewOwner", "ALL");
			strWorkURL.put("pyAction", "Refresh");
			strWorkURL.put("showHeader", "false");
			strWorkURL.put("WorkbasketID", sourceString.get("param"));
			strWorkURL.put("ViewHeader", "false");
			strWorkURL.put("glimpseMode", "Scripts");
			break;
		case "listbyurl":
			strWorkURL = sourceString;
			break;
		default:
			strWorkURL = sourceString;
			break;
	}
	return strWorkURL;
};
/*
@private-  Restart the timer that warns user before the session times out.
@return $void$ - .
*/
pega.desktop.support.restartTimeoutWarningTimer = function() {
	//if (pega.d.s.getDesktopType() == "Composite") return;
	var myDesktop = pega.desktop.support.getDesktopWindow() || window;
	if (myDesktop != null) {
		if (pega.d.s.getDesktopType() == "Composite" && myDesktop.desktop_restartTimeoutWarningTimer) {
			myDesktop.desktop_restartTimeoutWarningTimer();
		} else {
			//BUG-229390- adding a null check
			if (myDesktop.framesetscript_restartTimeoutWarningTimer) {
				myDesktop.framesetscript_restartTimeoutWarningTimer();
			}
		}
	}
};
// Restart the timer that warns user before the session times out
//window.attachEvent("onload",pega.desktop.restartTimeoutWarningTimer);
pega.util.Event.addListener(window, "load", pega.desktop.restartTimeoutWarningTimer);
/* from PRWBScripts */
pega.desktop.support.clearBrowserProgressBar = function() {
	try {
		var clearProgressString = null;
		var myDesktop = pega.desktop.support.getDesktopWindow();
		var clearProgressStringToCheck;
		if (myDesktop) {
			clearProgressStringToCheck = myDesktop['CLEAR_PROGRESS_STRING'];
		}
		if (null != clearProgressStringToCheck) {
			clearProgressString = clearProgressStringToCheck;
		} else {
			clearProgressString = " ";
		}
		setBrowserStatusMessage(clearProgressString);
	} catch (e) {}
};
if (null == didClearBrowserAttach) {
	if (typeof pega != "undefined") pega.util.Event.addListener(window, "load", pega.desktop.support.clearBrowserProgressBar);
	else window.attachEvent("onload", pega.desktop.support.clearBrowserProgressBar);
}
var didClearBrowserAttach = true;
pega.desktop.support.setSpaceFocus = function() {
	var framesource = pega.desktop.support.getDesktopWindow();
	if (framesource) {
		framesource.frames["SpaceTitleBar"].document.all("spaceNameHeader").focus();
		framesource.frames["RoomPane"].focus();
	}
};
/*
*  DesktopEventNames for user & Work Manager Roles -  These names are stored in one file to minimize name collision.
*/
// Desktop infrastructure and work events
var DesktopAddRecentWork = "DesktopAddRecentWork"; // Recent work event sent to left column gadget from harness
var AppChange = "AppChange"; //Fired when the work pool application changes
var DesktopSpaceChange = "DesktopSpaceChange"; //Fired when the active space is changed (From SpaceNavigationScript)
var NavPaneResizeEvent = "NavPaneResizeEvent"; //Fired when the Navigation Pane is Resized
var DesktopLoadingComplete = "DesktopLoadingComplete"; // DesktopLoadingComplete
var ViewContentLoadComplete = "ViewContentLoadComplete";
// Rule editing and test events
var RuleActivateEvent = "RuleActivateEvent"; // Fired by toolbar manager when rule is activated
var DecisionRunRuleEvent = "DecisionRunRuleEvent"; // Fired by running a decision tree from Run
var RuleHeaderUpdateEvent = "RuleHeaderUpdateEvent"; // Fired when rule form sends header data
var RuleFormOpened = "RuleFormOpened"; //Fired in my checkout rules
/**  @public JSON serialization object
*
**/
// bug-207310; JSON does not exist in all IE9
/*
if (typeof JSON !== 'undefined') {
  if (!JSON_parseFunc) {
	var JSON_parseFunc = JSON.parse;
  }
  JSON.parse = function(text, reviver, replacePairCommasWithNull) {
	if(typeof replacePairCommasWithNull === "undefined"){
	  var replacePairCommasWithNull = true;
	}
	if (text && typeof(text) === "string" && replacePairCommasWithNull) {
	  text = text.replace(/,,/g, ',null,');
	}
	return JSON_parseFunc(text, reviver);
  };
}
*/
/***********************************************************

DEPRECATED API'S

********************************************************/
/*
@DEPRECATED
This function can be called after getting the URL of new form from the New dialog.
@param $String$url - URL representing the new form, created by New dialog.
@return $void$
*/
pega.desktop.showNewRuleForm = function(url) {
	var success = openSpace("Rules", url, "rulebyurl");
	if (!success) {
		//var safekey= strHandle.replace(/\W/g, '_');
		var oSafeURL = new SafeURL("WBOpenLaunch");
		oSafeURL.put("newRuleURL", url);
		oSafeURL.put("SourceType", "rulecreatewithurl");
		pega.desktop.openUrlInWindow(oSafeURL, "", RuleFormSize + PopupWindowFeatures);
	}
};
/*
@DEPRECATED
Runs the ListView in a new window based on the specified parameters.
@param $Object$oClass - Mapped in the activity to ViewClass.
@param $String$sPurpose - Mapped in the activity to ViewPurpose.
@param $Boolean$bHeader - Mapped in the activity to ViewHeader.
@param $String$sAction - Mapped in the activity to pyAction.
@return $void$
*/
pega.desktop.showListInWindow = function(oClass, sPurpose, bHeader, sAction, vArgs) {
	pega.desktop.showNextInWindow();
	pega.desktop.showList(oClass, sPurpose, bHeader, sAction, vArgs);
};
/*
@DEPRECATED
Runs the ShowView / ShowViewGraph Summary View in a new window based on the specified parameters.
@param $Object$oClass - Mapped in the activity to ViewClass.
@param $String$sPurpose - Mapped in the activity to ViewPurpose.
@param $Boolean$bHeader - Mapped in the activity to ViewHeader.
@param $String$sAction - Mapped in the activity to pyAction.
@param $Boolean$bEmbeddedChart - Mapped in ShowViewGraph activity to ViewGraph.
@return $void$
*/
pega.desktop.showSummaryInWindow = function(oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs) {
	pega.desktop.showNextInWindow();
	pega.desktop.showSummary(oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs);
};
/*
@DEPRECATED
Return a string representing the class name of the current workpool as selected by the user in the NavigationPane.
@return $String$ - Class name of the currently selected application as a string.
*/
pega.desktop.getCurrentWorkPool = function() {
	return pega.desktop.getCurrentApplication();
};
pega.desktop.support.setCookie = function(name, value, days) {
	var date = new Date();
	days = (days == null || days == 0) ? 1 : days;
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString();
};
pega.desktop.support.readCookie = function(name) {
	var cookies = "" + document.cookie;
	var startIndex = cookies.indexOf(name);
	if (startIndex == -1 || name == "") return "";
	var endIndex = cookies.indexOf(';', startIndex);
	if (endIndex == -1) endIndex = cookies.length;
	return unescape(cookies.substring(startIndex + name.length + 1, endIndex));
};
  //static-content-hash-trigger-GCC
  
/*
@private Checks theme-cosmos is available.
@return true if cosmos is used else false.
*/
pega.desktop.support.isCosmosCase = function() {
  return (pega.desktop.infinity && pega.desktop.isCosmosCase ) ? true : false;
};
//static-content-hash-trigger-GCC
/*@package
 Desktopwrapper APIS provide client side functions for
 @asis
 - Opening Rules
 - Create, open and close work items and assignments
 - Generating Reportsmodal window
 - Send and listening for desktop managed client events
 - Switching workpools
 @endasis
 Desktopwrapper api calls provide URL formatting and generation as well as portal UI management - for instance switching to a new space or view - before the URL is sent
 - Open URLs in a desktop space, popup or to the server.
 */

//****************************************************************************
// Wrappers for Rules Space
//****************************************************************************

pega.d = pega.namespace("pega.desktop");
pega.d.recentWorkArray = new Array();

pega.desktop.windowReloadHandler = function() {
	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
	var pxClientSession = harnessContext.getProperty("pxClientSession");
	var pyRequestorToken = localStorage.getItem("pyRequestorToken" + pxClientSession);
 /* The below check is for new tab feature of Infinity Theme-cosmos application */
  if(pega.desktop.infinity){
    if(pega.desktop.infinity.isNewTab()){
       return;
     }
  }
	if (window.localStorage && pyRequestorToken && harnessContext.getProperty("pyRequestorToken") != pyRequestorToken) {
		pega.desktop.support.getDesktopWindow().MWReloading = 'true';
		pega.desktop.support.getDesktopWindow().location.reload();
	}
}

/*
 @api
 Given an InsHandle this function opens the rule in desktop or in a popup if a desktop rules space isn't found. If the bOpenSpecific vesion is set to false the openRule function will parse the insHandle and derive an InsName from the insHandle and open by rule resolution.
 @param $String$strHandle - An insHandle key that identifies the rule to open.
 @param $boolean$bOpenSpecificVersion - If true, will assume that the strHandle is a unique pxInsKey and will attempt to open that version of the rule only. The default is false.
 @param $boolean$bLimitAccess – Limits the access.
 @param $String$contentID - Content ID of the resulting document.
 @param $String$dynamicContainerID - Target Dynamic Container ID.
 @param $Boolean$skipConflictCheck - If false (default), conflict resolution is done before opening the document, if true, any exisiting document with same signature is focused.
 @return $void$
 */
pega.desktop.openRule = function(strHandle, bOpenSpecificVersion, bLimitAccess, contentID, dynamicContainerID, skipConflictCheck) {

	//Bug-67606
	if (strHandle == "")
		return;

	var success = false;
	var sourceString = new SafeURL();
	strHandle = pega.tools.SUtils.trim(strHandle);
	if (strHandle.indexOf("+") > -1) {
		strHandle = strHandle.replace(/[+]/g, " ");
	}
	sourceString.put("Handle", strHandle);
	if (arguments.length >= 2 && bOpenSpecificVersion) {
		sourceString.put("OpenSpecificVersion", bOpenSpecificVersion + "");
	}
	if (contentID && contentID != "") {
		sourceString.put("contentID", contentID);
	}
	if (dynamicContainerID && dynamicContainerID != "") {
		sourceString.put("dynamicContainerID", dynamicContainerID);
	}
	// TASK-149436 03/19/2013 GUJAS1: If skipConflictCheck has been specified, put in in the parameters.
	if (skipConflictCheck != null) {
		sourceString.put("SkipConflictCheck", skipConflictCheck);
	}

	// BUG-96304 03/28/2013 GUJAS1 -
	// This call is being made from within a modal dialog. Since Async calls on parent window are blocked till modal closes, it is
	// not safe to use openspace which is invoked in the parent window. Skip to openURLInWindow.
	var calledInModal = (window.dialogArguments && window.dialogArguments["opener"]);
	var portalWindow = pega.desktop.support.getDesktopWindow();
	if (portalWindow && portalWindow.pega && portalWindow.pega.ui && portalWindow.pega.ui.NavigateTopHandler) {
		success = false;
	} else {
		success = !calledInModal && pega.desktop.support.openSpace("Rules", sourceString, "rulespecific");
	}
	if (!success) {
		// NOTE: bOpenSpecificVersion not supported
		if (strHandle.length > 0) {
			var safekey = strHandle.replace(/\W/g, '_');
			var oSafeURL = new SafeURL("WBOpenLaunch");
			oSafeURL.put("InsHandle", strHandle);
			oSafeURL.put("Action", "Open");
			oSafeURL.put("target", "popup");
			if (contentID && contentID != "") {
				oSafeURL.put("contentID", contentID);
			}
			if (dynamicContainerID && dynamicContainerID != "") {
				oSafeURL.put("dynamicContainerID", dynamicContainerID);
			}
			pega.desktop.openUrlInWindow(oSafeURL, safekey, RuleFormSize + PopupWindowFeatures);
		} else {
			window.status = "Can't open rule; no key.";
		}
	}
}

/*
 @api - This function is called by the various menu options that run as wizards.
 @param $String$sName - It is wizard name.
 @param $String$sQuery - Query string and should not be escaped when passed into this function.
 @return $void$
 */
pega.desktop.openWizard = function(sName, sQuery) {

	// Bug-123340 Start, pass the wizardLabel value if received as the arguments[2]
	var success = false;
	if (arguments[2] != null && arguments[2] != "")
		success = pega.desktop.support.openWizard(sName, sQuery, arguments[2]);
	else
		success = pega.desktop.support.openWizard(sName, sQuery);
	//Bug-123340 End

	if (!success) {
		// Create new safe URL with activity call to redirect to thread
		var oRedirectUrl = new SafeURL("RedirectAndRun");
		oRedirectUrl.put("ThreadName", sName);
		oRedirectUrl.put("Location", sQuery);
		oRedirectUrl.put("PagesToCopy", "pyPortal");
		oRedirectUrl.put("bEncodeLocation", "true");
		//oRedirectUrl.put("AccessGroupName",strSelectedAG);
		// Create new Navigation event with server redirect call
		var redirectURL = new DesktopNavigationEvent("Rules", oRedirectUrl, "");
		var strURL = pega.desktop.support.constructUrl(redirectURL.sourceString, "openwizard");
		pega.desktop.openUrlInWindow(strURL, "pyWorkPage", WorkFormSize + PopupWindowFeatures);
	}

}

/*
 @api
 Opens an work assignment from the list view.
 @param $String$strInsKey - The instance key of the work assignment.
 @param $Object$paramObject - object literal containing additional parameters.
 @return $void$
 */
pega.desktop.openAssignment = function(strInsKey, contentID, dynamicContainerID, paramObject, skipConflictCheck, offlineEnabled, configParams) {
	var args = arguments[0];
	var oSafeURL = null;

	// inform perfmon of work in progress - triggers update to PAL on ui completion
	if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setPALInteraction("abc?&action=openAssignment&key=" + strInsKey);

	if (typeof args == "object" && args.name == "safeURL") {
		oSafeURL = SafeURL_clone(args);
		var strInsKey = oSafeURL.get("key");
		var contentID = oSafeURL.get("contentID");
		var dynamicContainerID = oSafeURL.get("dynamicContainerID");
	}
	var fromAssignment = true;
	if (!oSafeURL) {
		var oSafeURL = new SafeURL();
	}
	if (dynamicContainerID != null && dynamicContainerID != "")
		oSafeURL.put("dynamicContainerID", dynamicContainerID);

	if (contentID != null && contentID != "")
		oSafeURL.put("contentID", contentID);

	if (skipConflictCheck != null) {
		oSafeURL.put("SkipConflictCheck", skipConflictCheck);
	}

	if (offlineEnabled) {
		oSafeURL.put("offlineEnabled", offlineEnabled);
	}

	/* Sending the opener window name info to opened window as it is required to refresh the opener window. Eg: To refresh worklist */
	if (pega.mobile && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
		oSafeURL.put("openerWindowName", window.name);
	}

	//augment config params to oSafeURL
	pega.desktop.augmentConfigParams(configParams, oSafeURL);

	if (pega.desktop.support.handleMultipleAG(strInsKey, fromAssignment, undefined, oSafeURL)) {
		//        pega.desktop.support.postOpenAssignment(strInsKey,paramObject);
		pega.desktop.support.postOpenAssignment(strInsKey, paramObject, oSafeURL);

	}
}

//****************************************************************************
// Wrappers for Work Space
//****************************************************************************

/*
 @api
 Shows the targeted url in the list frame of the workspace.If the workspace space is not available the list is shown in a popup.
 @param $String$url - URL targeting a work space compliant list.
 @return $void$
 */
pega.desktop.showWorkList = function(url) {

	if (typeof url != "object" && url.name != "safeURL") {
		var oSafeURL = SafeURL_createFromURL(url);
		url = oSafeURL;
	}
	if (!openSpace("Work", url, "listbyurl")) {
		url = url.toQueryString();
		var strURL = pega.desktop.support.constructUrl(url, "listbyurl");
		// remove showheader=false parameter to show buttons and window title when in popup
		strURL.remove("ViewHeader");
		pega.desktop.openUrlInWindow(strURL, "WorkListPage", WorkFormSize + PopupWindowFeatures);
	}
}

/*
 @api
 Shows the invoking operators worklist in the list frame of the workspace.If the workspace space is not available the list is shown in a popup.
 @param $String$strUserId - User ID defaults to the current user if optional parameter strUserId is not present.
 @return $void$
 */
pega.desktop.showUserWorkList = function(strUserId) {

	var args = arguments[0];
	if (typeof args == "object" && args.name == "safeURL") {
		var oSafeURL = SafeURL_clone(args);
		var strUserId = oSafeURL.get("userID");
	}
	if (!oSafeURL) {
		var oSafeURL = new SafeURL();
	}

	oSafeURL.put("param", strUserId);

	if (!pega.desktop.support.openSpace("Work", oSafeURL, "listbyuser")) {
		strUserId = oSafeURL.toQueryString();
		var strURL = pega.desktop.support.constructUrl(strUserId, "listbyuser");
		// remove showheader=false parameter to show buttons and window title when in popup
		strURL.remove("ViewHeader");
		pega.desktop.support.openUrlInWindow(strURL, "WorkListPage", WorkFormSize + PopupWindowFeatures);
	}
}

/*
 @api
 Shows the targeted url in the form frame of the workspace, switching the view to a form view.
 @param $String$url - URL targeting a work space compliant harness / form.
 @return $void$
 */
pega.desktop.openWorkByURL = function(url, event) {

	if (typeof url != "object" && url.name != "safeURL") {
		var oSafeURL = SafeURL_createFromURL(url);
		url = oSafeURL;
	}
	if (!openSpace("Work", url, "formbyurl")) {
		url = oSafeURL.toQueryString();
		var strURL = pega.desktop.support.constructUrl(url, "formbyurl");
		pega.desktop.openUrlInWindow(strURL, "pyWorkPage", WorkFormSize + PopupWindowFeatures, null, event);
	}
}

/*
 @api
 Lists the contents of specified work basket.
 @param $String$strBasketId - Id of the work basket to be shown.
 @return $void$
 */
pega.desktop.showWorkBasket = function(strBasketId) {

	var oSafeURL = new SafeURL();
	oSafeURL.put("param", strBasketId);
	if (!pega.desktop.support.openSpace("Work", oSafeURL, "listbybasket")) {
		strBasketId = oSafeURL.toQueryString();
		var strURL = pega.desktop.support.constructUrl(strBasketId, "listbybasket");
		// remove showheader=false parameter to show buttons and window title when in popup
		strURL.remove("ViewHeader");
		pega.desktop.openUrlInWindow(strURL, "WorkListPage", WorkFormSize + PopupWindowFeatures);
	}
}

/*
 @api
 Opens a work item that lives in a different work pool.
 @param $String$key - The id of the work item.
 @param $String$harnessVersion - 0 or 1, 0 is heritage (v3) harness, 1 is v4 harness.
 @param $String$contentID - Content ID of the resulting document.
 @param $String$dynamicContainerID - Target Dynamic Container ID.
 @param $Boolean$skipConflictCheck - If false (default), conflict resolution is done before opening the document, if true, any exisiting document with same signature is focused.
 @return $void$
 */
pega.desktop.openWorkByHandleReload = function(key, harnessVersion, contentID, dynamicContainerID, skipConflictCheck) {

	var args = arguments[0];
	var oSafeURL = null;
	if (typeof args == "object" && args.name == "safeURL") {
		var oSafeURL = SafeURL_clone(args);
		var key = oSafeURL.get("key");
		var contentID = oSafeURL.get("contentID");
		var dynamicContainerID = oSafeURL.get("dynamicContainerID");
	}
	if (!oSafeURL) {
		var oSafeURL = new SafeURL();
	}
	if (contentID && contentID != "")
		oSafeURL.put("contentID", contentID);
	if (dynamicContainerID && dynamicContainerID != "")
		oSafeURL.put("dynamicContainerID", dynamicContainerID);
	// TASK-149436 03/19/2013 GUJAS1: If skipConflictCheck has been specified, put in in the parameters.
	if (skipConflictCheck == "true") {
		oSafeURL.put("SkipConflictCheck", skipConflictCheck);
	}
	oSafeURL.put("reload", "true");
	var fromAssignment = false;
	if (pega.desktop.support.handleMultipleAG(key, fromAssignment, harnessVersion)) {
		//             pega.desktop.support.postOpenWorkByHandle(key, harnessVersion);
		pega.desktop.support.postOpenWorkByHandle(key, harnessVersion, oSafeURL);

	}

}

/*
 @key : Ins Handle provided for opening a Work Item.
 */
pega.desktop.openWorkByHandle = function() {

	var args = arguments[0],
		oSafeURL = null,
		key = arguments[0] ? arguments[0] : "",
		harnessVersion = arguments[1] ? arguments[1] : "",
		contentID = arguments[2] ? arguments[2] : "",
		dynamicContainerID = arguments[3] ? arguments[3] : "",
		skipConflictCheck = arguments[4] ? arguments[4] : "",
		alwaysReload = arguments[5] ? arguments[5] : "",
		configParams = arguments[6] ? arguments[6] : "";

	// inform perfmon of work in progress - triggers update to PAL on ui completion
	if (pega && pega.ui && pega.ui.statetracking) pega.ui.statetracking.setPALInteraction("abc?&action=openWorkByHandle&key=" + key);


	if (typeof args == "object" && args.name == "safeURL") {
		oSafeURL = SafeURL_clone(args);
		key = oSafeURL.get("key");
	} else {
		oSafeURL = new SafeURL();
		oSafeURL.put("contentID", contentID);
		oSafeURL.put("dynamicContainerID", dynamicContainerID);
	}
	if (key == "") {
		/*BUG-163412: Using getLocalString API instead of string for localization*/
		//BUG-182692: correcting the fieldvalue key

		var msgEmptyWorkItemHandle = pega.u.d.fieldValuesList.get("Empty Work Item ID");
		alert(msgEmptyWorkItemHandle);
		pega && pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton(true);
		return;
	}
	// TASK-149436 03/19/2013 GUJAS1: If skipConflictCheck has been specified, put in the parameters.
	// US-58856 : Added always Reload param,if true the document gets reloaded without any warning.
	oSafeURL.put("SkipConflictCheck", skipConflictCheck);
	oSafeURL.put("reload", alwaysReload);

	/* Sending the opener window name info to opened window as it is required to refresh the opener window. Eg: To refresh worklist */
	if (pega.mobile && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
		oSafeURL.put("openerWindowName", window.name);
	}

	//augment config params to oSafeURL
	pega.desktop.augmentConfigParams(configParams, oSafeURL);

	if (pega.desktop.support.handleMultipleAG(key, false, harnessVersion, oSafeURL)) {
		pega.desktop.support.postOpenWorkByHandle(key, harnessVersion, oSafeURL);
	}
}

/*
 @api
 Closes the current work item (if one is open) without changing the focus of the space.
 @return $Boolean$ - True indicates successful closure and false indicates a failure to close the current work item.
 */
pega.desktop.closeCurrentWorkItem = function() {

	var oSafeURL = new SafeURL();
	var result = pega.desktop.support.execSpace("Work", oSafeURL, "closecurrentwork");
	return result;
}


// ***************************************************************************
// Desktop Functions
// ***************************************************************************

/*
 @api
 Returns the value of pxReqURI.
 @return $String$ - returns pxReqURI.
 */
pega.desktop.getReqURI = function() {
	return pxReqURI;
}

/*
 @api
 Gets a string representing the current sessions Operator ID .
 @return $String$ -  Returns an Operator ID.
 */
pega.desktop.getOperatorID = function() {
	var app = pega.desktop.support.getDesktopApplication();
	if (app)
		return app.getUserSessionInfo().getOperatorId();
	else
		return "";
}


/*
 @api
 Return a string representing the class name of the current appliation as selected by the user in the NavigationPane.
 @return $String$ -  Class name of the currently selected application.
 */
pega.desktop.getCurrentApplication = function() {
	var app = pega.desktop.support.getDesktopApplication();
	if (app) {
		return app.getUserSessionInfo().getCurrentWorkPool();
	} else {
		return "";
	}
}

/*
 @api
 Sets the current active application using the class name of the application workpool class.
 @param $String$strApplicationName - Name of the application class.
 @return $Boolean$ - True if the application was changed, false if the application class was not valid.
 */
pega.desktop.setCurrentApplication = function(strApplicationName) {
	var app = pega.desktop.support.getDesktopApplication();
	if (app) {
		return app.getView("PegaLogo").setCurrentApplication(strApplicationName);
	} else {
		return "";
	}
}

/*
 @api
 Opens the given url in the specified space, if the space argument is omitted, blank, or null the currently active space is targeted.
 @param $String$url - The url to be opened.
 @param $object$space - (Optional) the space to raise/open.
 @param $boolean$bringToFocus - (Optional) boolean value to indicate weather to switch to the raised space.
 @return $void$
 */
pega.desktop.openUrlInSpace = function(url, space, bringToFocus) {
	pega.desktop.support.openUrlInSpace(url, space, bringToFocus);
}

/*
 @api
 Opens the given url in the dashboard space, if the space argument is omitted, blank, or null the currently active space is targeted.
 * --Deprecated--
 @param $String$url - The url to be opened.
 @return $void$
 */
pega.desktop.openUrlInDashboard = function(url) {
	if (typeof url == "object" && url.name == "safeURL") {
		url = url.toQueryString();
	}
	else {
		var oSafeURL = SafeURL_createFromURL(url);
		url = oSafeURL.toQueryString();
	}
	pega.desktop.support.openUrlInSpace(url, "Dashboard");
}


/*
 @api
 Makes the named space the active space and raises it to focus.
 @param $object$space - The space to be opened.
 @param $String$$sourcetype– Specifies the source type.
 @return $void$
 */
pega.desktop.showSpace = function(space, sourcetype) {
	if (pega.d.s.getDesktopType() == "Composite") {
		pega.desktop.nextSpace = space;
	}
	var sourceString = new SafeURL();
	if (arguments.length == 2 && sourcetype == "spacehome") {
		if (!pega.desktop.support.openSpace(space, sourceString, sourcetype))
			window.alert(getLocalString("pyMessageLabel", "Space not configured"));
	}
	else {
		if (!pega.desktop.support.openSpace(space, sourceString, ""))
			window.alert(getLocalString("pyMessageLabel", "Space not configured"));
	}
	pega && pega.control && pega.control.Actions && pega.control.Actions.prototype.hideSkeleton();
}

/*
 @api
 Returns the name of the default space.
 @return $String$ - Default space name.
 */
pega.desktop.getDefaultSpaceName = function() {
	var myDesktop = pega.desktop.support.getDesktopApplication();
	if (myDesktop) {
		return myDesktop.getModel().getUserSessionInfo().getStartPage();
	}
	else {
		return "";
	}
}

/*
 @api
 Returns the name of the current space.
 @return $String$ - Current space name.
 */
pega.desktop.getCurrentSpaceName = function() {
	if (pega.d.s.getDesktopType() == "Composite") {
		return pega.d.s.getDesktopWindow().pega.d.activeSpaceName;
	}

	var myDesktop = pega.desktop.support.getDesktopApplication();
	if (myDesktop && myDesktop.getView("SpacePane")) {
		return myDesktop.getView("SpacePane").getActiveSpaceName();
	} else {
		return "";
	}
}

/*
 @api
 This method calls registerApplicationChangeListener.
 --Deprecated--
 @param $Object$objHandler– Specifies the handler.
 @param $Object$objData– specifies the data.
 @return $void$
 */
pega.desktop.registerWorkPoolChangeListener = function(objHandler, objData) {
	pega.desktop.registerApplicationChangeListener(objHandler, objData);
}

/*
 @api
 This method registers a handler that takes the objData and the new value of the application as a string as the first and second arguments respectively. The provided handler will be invoked on each change of the current application, and will be removed from the handler queue should any exception be posted to the caller.
 @param $Object$objHandler - Function that takes an object as the first argument and a string representation of the application as the second argument. Does not return a value.
 @param $Object$objData - The user data to be passed to the handler when it is invoked.
 @return $void$
 */
pega.desktop.registerApplicationChangeListener = function(objHandler, objData) {
	var applicationAPI = pega.desktop.support.getDesktopApplication();
	if (applicationAPI)
		applicationAPI.getEventManager().registerWorkPoolChangeListener(objHandler, objData);
}

/*
 @api
 Registers a function to be invoked whenever a named event occurs. When invoked, the function will be passed two parameters: the data about the event (supplied by sendEvent) and objData (unchanged).
 @param $String$strEventName - Name of the event (matches name sent by sendEvent). To prevent name collision the name should follow a "." delimited naming convention:Company.Division.Unit.Component where Division and unit is optional and component is the facility generating the event.
 @param $Object$objFunction - Function to invoke when event occurs.
 @param $Object$objData - Data to pass along to the function (for example, the id of the div that the function will update).
 @return $void$
 */
pega.desktop.registerEventListener = function(strEventName, objFunction, objData, scope) {

	var applicationAPI = pega.desktop.support.getDesktopApplication();
	if (applicationAPI) {
		applicationAPI.getEventManager().registerEventListener(strEventName, objFunction, objData, scope);
	}
}



/*
 @api
 Cancels a registered event listener. When invoked, the function will be passed two parameters: the name of the event and the function reference.
 @param $String$strEventName - Name of the event (matches name registered by registerEventListener).
 @param $Object$objFunction - Function that was registered.
 @return $void$
 */
pega.desktop.cancelEventListener = function(strEventName, objFunction) {
	var applicationAPI = pega.desktop.support.getDesktopApplication();
	if (applicationAPI) {
		applicationAPI.getEventManager().cancelEventListener(strEventName, objFunction);
	}
}




// Event Modes
var SYNC = "SYNC";
var ASYNC = "ASYNC";
var ASYNC_REPLACE = "ASYNC_REPLACE";
var ASYNC_COPY = "ASYNC_COPY";
var ASYNC_COPY_REPLACE = "ASYNC_COPY_REPLACE";

/*
 @api
 Sends an event, which causes any registered listeners to the event to be invoked.
 @param $String$strEventName - name of the event (matches name in registerEventListener).
 @param $String$objEventData - data about the event that should be passed to the listening functions.
 @param $String$mode - Modes are registered in DesktopEventNames, Default - ASYNC
 *     <B>SYNC</B>= Each registered listener is invoked, in time order of registration, in the current browser thread
 *     ASYNC= Each registered listener is called  in a timeout.  If ObjData is an object reference the sending
 *             must maintain the object beyond the current browser thread.
 *     ASYNC_REPLACE= Replace any in progress ASYNC events to the named event with new ObjData
 *     ASYNC_COPY= ObjData (string or object serialized to a string) is copied to the top desktop window and
 *     sent to each registered listener in a timeout.
 *     ASYNC_COPY_REPLACE= ObjData (string or object serialized to a string) is copied to the top desktop window,
 *     any in progress ASYNC events to the named event are replaced and sent to each registered listener in a timeout.
 @param $Integer$delay - delay in millisecs - default=10 millisecs.
 @return $void$
 */
pega.desktop.sendEvent = function(strEventName, objEventData, mode, delay) {
	var applicationAPI = pega.desktop.support.getDesktopApplication();
	if (applicationAPI)
		applicationAPI.getEventManager().sendEvent(strEventName, objEventData, mode, delay);
}

/*
 @api
 Runs the List View based on the specified parameters.
 @param $Object$oClass - Mapped in ShowView activity to ViewClass.
 @param $String$sPurpose - Mapped in ShowView activity to ViewPurpose.
 @param $Boolean$bHeader - Mapped in ShowView activity to ViewHeader.
 @param $String$sAction - Mapped in ShowView activity to pyAction.
 @return $void$
 */

pega.desktop.showList = function(oClass, sPurpose, bHeader, sAction, vArgs) {
	var strURL;
	var oSafeURL = null;
	if (typeof oClass == "object" && oClass.name == "safeURL") {
		oSafeURL = oClass;
	}
	else {
		// Create URL to hold URL request
		oSafeURL = new SafeURL();

		// Populate SafeURL parameters
		if (oClass != null && oClass != "") {
			oClass = pega.desktop.support.getClassForReports(oClass);
			oSafeURL.put("ViewClass", oClass);
		}
		var params = "";
		var iAmp = sPurpose.indexOf("&");
		var tempArr = [];
		if (iAmp > 0) {
			params = sPurpose.substr(iAmp + 1);
			sPurpose = sPurpose.substring(0, iAmp);
			paramsList = params.split("&");
			for (var i = 0; i < paramsList.length; i++) {
				var pos = paramsList[i].indexOf("=");
				if (pos > -1) {
					var key = "";
					var value = "";
					key = paramsList[i].substring(0, pos);
					if (pos < paramsList[i].length)
						value = paramsList[i].substring(pos + 1);
					tempArr[key] = value;
				}
			}
		}
		if (sPurpose != null && sPurpose != "") {
			oSafeURL.put("ViewPurpose", sPurpose);
		}
		else {
			oSafeURL.put("ViewPurpose", "LookupList");
			oSafeURL.put("glimpseMode", "Scripts");
		}

		if (bHeader != null && bHeader != "") {
			oSafeURL.put("ViewHeader", bHeader);
		}

		if (sAction != null && sAction != "") {
			oSafeURL.put("pyAction", sAction);
		}
		else {
			oSafeURL.put("pyAction", "Refresh");
		}
	}
	oSafeURL.put("pyActivity", "Rule-Obj-ListView.ShowView");
	var sRemovePages = oSafeURL.get("removeDataPage");
	if (sRemovePages != null && sRemovePages != "") {
		oSafeURL.put("removeDataPage", "true");
	}
	if (vArgs && vArgs != "") {
		if ((typeof vArgs == "array") || (typeof vArgs == "object")) {
			for (var i in vArgs)
				oSafeURL.put(i, vArgs[i]);
		}
	}
	if (iAmp > 0) {
		for (var j in tempArr)
			oSafeURL.put(j, tempArr[j]);
	}
	pega.desktop.support.openUrlInSpace(oSafeURL);
}

pega.desktop.showNewList = function(sClass, sPurpose, vArgs) {
	pega.desktop.showNextInWindow();
	var oSafeURL = new SafeURL();

	if (sPurpose != null && sPurpose != "") {
		oSafeURL.put("ViewPurpose", sPurpose);
	}
	if (sClass != null && sClass != "") {
		oSafeURL.put("className", sClass);
	}
	if (vArgs && vArgs != "") {
		if ((typeof vArgs == "array") || (typeof vArgs == "object")) {
			for (var i in vArgs)
				oSafeURL.put(i, vArgs[i]);
		}
	}

	oSafeURL.put("bListEdit", "true");
	oSafeURL.put("pyActivity", "@baseclass.pzDisplayListEditHarness");

	pega.desktop.support.openUrlInSpace(oSafeURL);
}

/*
 @api
 Runs the ShowView / ShowViewGraph Summary View based on the specified parameters.
 @param $Object$oClass - Mapped in ShowView activity to ViewClass.
 @param $String$sPurpose - Mapped in ShowView activity to ViewPurpose.
 @param $Boolean$bHeader - Mapped in ShowView activity to ViewHeader.
 @param $String$sAction - Mapped in ShowView activity to pyAction.
 @param bEmbeddedChart - Mapped in ShowViewGraph activity to ViewGraph.
 @return $void$
 */

pega.desktop.showSummary = function(oClass, sPurpose, bHeader, sAction, bEmbeddedChart, vArgs) {
	var strURL;
	var oSafeURL = new SafeURL();
	if (typeof oClass == "object" && oClass.name == "safeURL") {
		oSafeURL = oClass;
		if (oSafeURL.hashtable["ViewGraph"] != null && oSafeURL.hashtable["ViewGraph"] != "") {
			oSafeURL.put("pyActivity", "Rule-Obj-SummaryView.ShowViewGraph");
		}
		else {
			oSafeURL.put("pyActivity", "Rule-Obj-SummaryView.ShowView");
		}
	}
	else {
		if (oClass != null && oClass != "") {
			oClass = pega.desktop.support.getClassForReports(oClass);
			oSafeURL.put("ViewClass", oClass);
		}
		var params = "";
		var iAmp = sPurpose.indexOf("&");
		var tempArr = [];
		if (iAmp > 0) {
			params = sPurpose.substr(iAmp + 1);
			sPurpose = sPurpose.substring(0, iAmp);
			paramsList = params.split("&");
			for (var i = 0; i < paramsList.length; i++) {
				var pos = paramsList[i].indexOf("=");
				if (pos > -1) {
					var key = "";
					var value = "";
					key = paramsList[i].substring(0, pos);
					if (pos < paramsList[i].length)
						value = paramsList[i].substring(pos + 1);
					tempArr[key] = value;
				}
			}
		}
		if (sPurpose != null && sPurpose != "")
			oSafeURL.put("ViewPurpose", sPurpose);
		if (bHeader != null && bHeader != "")
			oSafeURL.put("ViewHeader", bHeader);
		if (sAction != null && sAction != "")
			oSafeURL.put("pyAction", sAction);
		if (bEmbeddedChart != null && bEmbeddedChart != "") {
			oSafeURL.put("ViewGraph", bEmbeddedChart);
			oSafeURL.put("pyActivity", "Rule-Obj-SummaryView.ShowViewGraph");
		}
		else {
			oSafeURL.put("pyActivity", "Rule-Obj-SummaryView.ShowView");
		}
		var sRemovePages = oSafeURL.get("removeDataPage");
		if (sRemovePages != null && sRemovePages != "") {
			oSafeURL.put("removeDataPage", "true");
		}
		if (vArgs && vArgs != "") {
			if ((typeof vArgs == "array") || (typeof vArgs == "object")) {
				for (var i in vArgs)
					oSafeURL.put(i, vArgs[i]);
			}
		}

		if (iAmp > 0) {
			for (var j in tempArr)
				oSafeURL.put(j, tempArr[j]);
		}
	}
	pega.desktop.support.openUrlInSpace(oSafeURL);
}



/*
 @api
 -- deprecated -- This wrapper function will open a form in a new modal dialog. This api is no longer supported on some browsers
 @param $String | Object$oUrl - Specifies the URL to open in the new dialog, or a SafeURL object.
 @param $Integer$iHeight - Parameter that indicates the dialogHeight (in pixels).
 @param $Integer$iWidth - Parameter that indicates the dialogWidth (in pixels).
 @param $String$sFeatures - Parameter that contains features of the showModalDialog function.
 @param $Object$vArguments – A String or an Array  that contains dialog arguments of the showModalDialog function.
 @return $String$ - Null if oUrl is blank or null, or the returnValue of the modal dialog.
 */
pega.desktop.openUrlInDialog = function(oUrl, iHeight, iWidth, sFeatures, vArguments) {
	return pega.desktop.support.openUrlInDialog(oUrl, iHeight, iWidth, sFeatures, vArguments);
}

/*
 @api
 Force next Desktpwrapper API command that displays HTML to target a popup.
 @return $void$
 */
pega.desktop.showNextInWindow = function() {
	pega.desktop.gShowNextInWindow = true;
	gShowNextInWindow = pega.desktop.gShowNextInWindow;
}

/*
 @api
 If pega composite manager is present, fire 'custom' event defined on the gadget if any.
 */
pega.desktop.gadgetCustomEvent = function(sToken) {
	/* This API handles CustomEvent in both Gateway and without Gateway scenarios. */
	pega.desktop.support.doGadgetAction({name: "custom", params: [sToken]});
}

/*
 @api
 This function will close all closeable dynamic container documents - in both tabbed and tabless modes
 @param $Object$event – Javascript event object that triggered this call
 @return $void$
 */
pega.desktop.closeAllDocuments = function(event) {
	var oSafeURL = new SafeURL();
	oSafeURL.put('api', 'CloseAllDocuments');
	oSafeURL.put('event', event);
	pega.desktop.sendEvent('DesktopAction', oSafeURL, 'SYNC');
}

pega.desktop.updateRecentList = function(actionInfo) {
	if (actionInfo && actionInfo.length > 0) {
		actionInfo = actionInfo.split('&');
		var oSafeURL = null;
		if (actionInfo.length > 0) {
			var action = actionInfo[0];
			if (action == "ClearRecentItem" || action == "ClearOneRecentItem") {
				oSafeURL = new SafeURL();
				var searchKey, recentItemRemoved, ignoreDirty, dirtyState;
				searchKey = actionInfo[1];
				recentItemRemoved = actionInfo[2];
				ignoreDirty = actionInfo[3];
				dirtyState = actionInfo[4];
				oSafeURL.put('api', 'UpdateRecentList');
				if (action)
					oSafeURL.put('recentAction', 'ClearRecentItem');
				if (searchKey)
					oSafeURL.put('searchKey', searchKey);
				if (recentItemRemoved)
					oSafeURL.put('recentItemRemoved', recentItemRemoved);
				if (ignoreDirty)
					oSafeURL.put('ignoreDirty', ignoreDirty);
				if (dirtyState)
					oSafeURL.put('dirtyState', dirtyState);
				if (actionInfo.length >= 5 && actionInfo[5]) {
					var originalRecentKey = actionInfo[5].split('=');
					if (originalRecentKey.length >= 2) {
						oSafeURL.put('originalRecentKey', originalRecentKey[1]);
					} else {
						oSafeURL.put('isFirstRecentItem', actionInfo[5]);
					}
				}
				if (actionInfo.length >= 6 && actionInfo[6]) {
					var originalRecentKey = actionInfo[6].split('=')[1];
					oSafeURL.put('originalRecentKey', originalRecentKey);
				}
			} else if (action == 'ClearAllRecentItems' || action == 'ClearAllRecentItemsOnce') {
				oSafeURL = new SafeURL();
				var ignoreDirty, hasDirtyRecentItem, recordKeys, pooledDoClose;
				ignoreDirty = actionInfo[1];
				hasDirtyRecentItem = actionInfo[2];
				pooledDoClose = actionInfo[3];
				recordKeys = actionInfo.slice(4).join("&");
				oSafeURL.put('api', 'UpdateRecentList');
				oSafeURL.put('recentAction', 'ClearAllRecentItems');
				if (ignoreDirty)
					oSafeURL.put('ignoreDirty', ignoreDirty);
				if (hasDirtyRecentItem)
					oSafeURL.put('hasDirtyRecentItem', hasDirtyRecentItem);
				if (recordKeys)
					oSafeURL.put('recordKeys', recordKeys);
				if (pooledDoClose)
					oSafeURL.put('pooledDoClose', pooledDoClose);
			}
			if (oSafeURL) {
				pega.desktop.sendEvent('DesktopAction', oSafeURL, 'ASYNC');
			}
		}
	}
}


pega.desktop.activateDocument = function(index, bTriggerDeltaSync, acName) {

	// For spa case:- NavigateTopHandler. pega.u.d.isDcExists() :- to check if workarea exist or not.
	// For mdc case:- pega.ctx.isMDC : to check whether mdc exists or not,
	if (pega.ctx.isMDC
		|| !(pega && pega.ui && pega.ui.NavigateTopHandler)
		&& (pega.desktop.support.getDesktopWindow() && !pega.desktop.support.getDesktopWindow().pega.u.d.isDcExists())) {
		if (typeof acName === "undefined") {
			acName = "acprimary_";
		} else {
			acName += "_";
		}
		if (pega.redux && pega.redux.store) {
			pega.redux.store.dispatch(pega.redux.actions(pega.redux.actionTypes.SWITCH, {"recordId": acName + index}));
			return;
		}
	}

	if (pega && pega.offline && index == 0) {
		if (typeof onNavigateToDashboard == "function") {
			onNavigateToDashboard();
		}
	}

	if (pega.mobile && pega.mobile.isMultiWebViewOfflinePegaMobileClient) {
		var parentWindow = pega.mobile.support.getPortalWindow();
		parentWindow.pega.offline.Utils.refreshWorkList.apply(parentWindow.pega.offline.Utils.refreshWorkList, [function() {
			window.close.apply(window);
		}, function() {
			console.info("Failed to refresh the worklist webview");
			window.close.apply(window);
		}]);
		return;
	}

	var paramType = typeof bTriggerDeltaSync;
	//Only valid parameter value is "false"/false
	if (paramType == "string" || paramType == "boolean") {
		bTriggerDeltaSync = ("false" == bTriggerDeltaSync.toString().toLowerCase()) ? "false" : "true";
	} else {
		bTriggerDeltaSync = "true"; //default to trigger sync if invalid/no values are passed
	}

	var oSafeURL = new SafeURL();
	oSafeURL.put('api', 'activate');
	oSafeURL.put('index', index);
	oSafeURL.put('triggerDeltaSync', bTriggerDeltaSync);
  
  //bug-534280 skip dirty check in case of activeDocument for SPA
  if(pega.u.d.bIsDCSPA) {
    oSafeURL.put('skipDirtyCheck', true);
  }

	pega.desktop.sendEvent('DesktopAction', oSafeURL, 'SYNC');
}

pega.desktop.setNativeTransition = function(transitionId) {
	pega.control.Actions.prototype.setMobileTransition(transitionId);
}

pega.desktop.navigateTo = function(safeURL) {
	if (typeof safeURL == "object" && safeURL.name == "safeURL") {
		safeURL = safeURL.toURL();
	}

	// inform perf mon and test tools that navigate in flight. add performance data for PAL
	var palData = null;
	if (pega && pega.ui && pega.ui.statetracking) palData = pega.ui.statetracking.setNavigationBusy(safeURL);
	if (palData) {
		if (palData.serverInteractionStart && palData.serverInteractionStart == true) safeURL += "&ClientInt=Start";
		if (palData.clientInteractionDuration && palData.clientInteractionDuration > 0) safeURL += "&ClientLoadDuration=" + palData.clientInteractionDuration;
		if (palData.clientInteractionAction && palData.clientInteractionAction != null) safeURL += "&ClientIntAction=" + palData.clientInteractionAction;
		if (palData.uiTkn && palData.uiTkn != null) safeURL += "&UsIntTkn=" + palData.uiTkn;
	}

	pega.ui.d.gBusyInd && pega.ui.d.gBusyInd.hide();
	location.href = safeURL;
};



/**
 * Helper method to augment safeURL with configParams
 * This is internal API leveraged only by desktop apis
 * 
 * @method augmentConfigParams
 * @param {Object} configParams The config parameters object
 * @param {Object} oSafeURL The SafeURL object
 */

pega.desktop.augmentConfigParams = function(configParams, oSafeURL) {

	if (!oSafeURL) return;

	configParams = configParams || {};

	// augment ajax container params to safeUrl
	if (configParams.target) {
		oSafeURL.put("mdcTarget", configParams.target);
	}
	// augment tenant data object to safeUrl
	if (configParams.tenantData) {
		oSafeURL.put("tenantData", configParams.tenantData);
	} else {
		var desktopWin = pega.desktop.support.getDesktopWindow();
		if (desktopWin && desktopWin.gIsMultiTenantPortal) {
			oSafeURL.put("tenantData", {
				tenantUrl: requestHomeURI
			});
		}
	}

	if (configParams.paramsObj) {
		oSafeURL.put("paramsObj", configParams.paramsObj);
	}

	//for openWorkItem
	if (configParams.pySkipConflictCheck) {
		oSafeURL.put("SkipConflictCheck", configParams.pySkipConflictCheck);
	}
	if (configParams.pyReloadAlways) {
		oSafeURL.put("reload", configParams.pyReloadAlways);
	}
}

//static-content-hash-trigger-GCC
//<script>
pega.namespace("pega.ui");

/*
@constructor				
@protected - Constructor for busyIndicator Control.
@param $message – parameter(String) to display the message specified by the User. Any String specified by the 		user will be displayed within the Control.
@param $visibility – parameter(Boolean) to display the busyIndicator Control along with the Masking. If set True, 			displays the busyIndicator Control along with Mask, if False, displays a transparent Mask over the Node. 
@param $sNode – parameter(Object) to specify the Node where control should be displayed. If no Node is 			specified, the Control is displayed in the parent window.
@return - void.
*/
pega.ui.busyIndicator = function(message, visibility, sNode, busyIndInterval) {
    this._message = message;
    this._sNode = sNode;
    this._visibility = true;
    this.oSpan = null;
    this.oDiv = null;
    this._showFullScreenBusyInd = false;
    this.busyIndicatorID = new Date().getTime();
    this.previousBusyIndInterval = null;
    if (typeof(busyIndInterval) == "undefined") {
        this.busyIndInterval = 2000;
    } else {
        this.busyIndInterval = busyIndInterval;
    }
    if (typeof(visibility) == "undefined")
        this._visibility = true;
    else
        this._visibility = visibility;

}

pega.ui.busyIndicator.prototype = {
    /*
    @protected - Function to Initialize the busyIndicator Control and the Mask. SPAN  and DIV elements are created dynamically for busyIndicator Control and Masking respectively.
    @return - void.
    */
    initialize: function(sourceNode) {
        var oSpanTmp = document.createElement('SPAN');
        oSpanTmp.id = 'pega_ui_load';
        oSpanTmp.className = 'pega_ui_busyIndicator';

        /*  Adding attributes for throbber readability by Assistive Technology Products (US-91120:Jaws should be notified when the progress of the page load) */
        oSpanTmp.setAttribute("role", "progressbar");
        if (pega && pega.u && pega.u.d && ("throbberLoadingText" in pega.u.d) && pega.u.d.throbberLoadingText) {
            //   BUG-752225
            oSpanTmp.setAttribute("aria-valuetext", pega.u.d.throbberLoadingText);
            oSpanTmp.setAttribute("aria-label", pega.u.d.throbberLoadingText);
        }
        oSpanTmp.setAttribute("tabindex", -1);

        this.oSpan = oSpanTmp;

        var oDivTmp = document.createElement('DIV');
        oDivTmp.id = 'pega_ui_mask';
        oDivTmp.className = 'pega_ui_masking';
        this.oDiv = oDivTmp;
        var isTable = true;
        var tagName = (this._sNode == null || this._sNode.tagName == null) ? "body" : this._sNode.tagName.toLowerCase();

        // JALDS 20/01/2013 BusyLoading icon shows an exception when the target element is table (Issue with IE).
        if (sourceNode != null) {
            while (isTable) {
                if (tagName === 'table' || tagName === 'tr' || tagName === 'tbody') {
                    sourceNode = sourceNode.parentNode;
                    tagName = sourceNode.tagName;
                } else {
                    isTable = false;
                }
            }
        }


        //BUG-90815 JALDS 24/01/2013: Setting the mask and busy loading at the container level, to avoid mask showing up on tab switching
        if (sourceNode != null) {
            //BUG-92954 JALDS 05/02/2013: Appending DIV and span so as to make sure, loading icon is on the centerr of the mask.
            this.oDiv.appendChild(this.oSpan);
            sourceNode.insertBefore(this.oDiv, sourceNode.firstChild);
        } else {
            this.oDiv.appendChild(this.oSpan);
            document.body.insertBefore(this.oDiv, document.body.firstChild);
        }

        // Incase of harness or empty node, need to mask the complete
        // harness.
        if (!sourceNode || (sourceNode.getAttribute("id") === "PEGA_HARNESS")) {
            this.oDiv.style.position = "fixed";
        } else {
            this.oDiv.style.position = "absolute";
        }
    },
    cleanup: function() {
        var parentNode = null;
        if (this.oSpan) {
            parentNode = this.oSpan.parentNode;
            if (parentNode != null) {
                parentNode.removeChild(this.oSpan);
            }
        }
        if (this.oDiv) {
            parentNode = this.oDiv.parentNode;
            if (parentNode != null) {
                parentNode.removeChild(this.oDiv);
            }
        }

        this.oSpan = null;
        this.oDiv = null;
        this._sNode = null;
    },
    busyIndTimeOut: null,
    busyManager: false
};


/*
@protected - Function to set the Message for the busyIndicator control.
@param $message – parameter(String) to display the message specified by the User. Any String specified by the user will be displayed within the Control.
@return - void.
*/
pega.ui.busyIndicator.prototype.setMessage = function(message) {
    if (typeof(message) == "undefined")
        this._message = "";
    else
        this._message = message;
}

/*
@protected - Function to set the target element where the busyIndicator control is to be displayed.
@param $sNode – parameter(Object) to specify the Node where control should be displayed. If no Node is specified, the busyIndicator control is displayed in the parent window.
@return - void.
*/
pega.ui.busyIndicator.prototype.setTargetElement = function(sNode) {
    this._sNode = sNode;
}

/*
@protected - Function to set the visibility of the busyIndicator control.
@param $visibility – parameter(Boolean) to display the busyIndicator control along with the Masking. If set True, displays the busyIndicator Control along with Mask, if False, displays a transparent Mask over the Node.
@return - void.
*/
pega.ui.busyIndicator.prototype.setVisibility = function(visibility) {
    if (typeof(visibility) == "undefined")
        this._visibility = true;
    else
        this._visibility = visibility;
}

pega.ui.busyIndicator.prototype.preventFocusOnTab = function() {
    return false; }; //Eng-13606/SR-117654/BUG-170577/BUG-173279 

/*bShowMaskImmediately - if set true, the mask is shown immediately to prevent users from clicking on the page. It will show the busy indicator image after the busyIndInterval.*/
pega.ui.busyIndicator.prototype.show = function(bIgnoreInterval, bShowMaskImmediately) {
    if (this.busyIndTimeOut != null) {
        clearTimeout(this.busyIndTimeOut);
    }
    var callScope = this;
    this.busyManager = true;



    this.createIndicatorImage();
    if (!window.event || typeof(event) == "undefined") {
        var mCaller = null;
        if (this.show.caller || typeof(this.show.caller) != "undefined") {
            mCaller = this.show.caller;
        }

        if (mCaller && mCaller.arguments[0] && mCaller.arguments[0].constructor && (window.Event == mCaller.arguments[0].constructor || window.UIEvent == mCaller.arguments[0].constructor))
            event = mCaller.arguments[0];
    }
    if (bIgnoreInterval == true) {
        callScope.showInternal();
        //pega.ctxmgr.registerContextSwitching("#pega_ui_load", pega.ctxmgr.skipHarnessContextSwitchHandler);
    } else if (bShowMaskImmediately == true || (window.event && typeof(event) != "undefined" && event.type == "scroll")) {
        /*BUG-108153: For grid related action, bShowMaskImmediately is set to true. In those cases, we will show the mask immediately to avoid data corruption issues. And show the busy indicator image with the default set time out.*/
        callScope.showInternalWithoutImage();
        var bShowIndicatorImg = callScope.bShowIndicatorImg;
        this.busyIndTimeOut = setTimeout(function() {
            callScope.showIndicatorImage(bShowIndicatorImg);
            //pega.ctxmgr.registerContextSwitching("#pega_ui_load", pega.ctxmgr.skipHarnessContextSwitchHandler);
        }, this.busyIndInterval);
    } else {
        this.busyIndTimeOut = setTimeout(function() {
            callScope.showInternal();
            //pega.ctxmgr.registerContextSwitching("#pega_ui_load", pega.ctxmgr.skipHarnessContextSwitchHandler);
        }, this.busyIndInterval);
    }
}

/*
 * API that shows the mask and creates the busy indicator image element.
 */
pega.ui.busyIndicator.prototype.showInternalWithoutImage = function() {
        //this.createIndicatorImage();
        this.showMask();
    }
    /*
    @protected - Function to Show the busyIndicator Control along with Mask based on the parameters set by the User. The Control and Mask are positioned and displayed. Event listener is added for Resize and Scroll events to recalculate the positioning.
    @return - void.
    */
pega.ui.busyIndicator.prototype.showInternal = function() {
    //this.createIndicatorImage();
  if(!this._showFullScreenBusyInd ){
     if(pega.c && pega.c.actionSequencer && ((pega.c.actionSequencer.getPendingQueueLength && (pega.c.actionSequencer.getPendingQueueLength()>0)) || !pega.c.actionSequencer.isQueueEmpty()) && pega.u.d.gBusyInd) {
        pega.u.d.gBusyInd.setTargetElement(document.getElementById("PEGA_HARNESS"));
        pega.u.d.gBusyInd.hide(null,null,true);
        this.oSpan = null;
        this.busyManager = true;
        this.createIndicatorImage();
        this._showFullScreenBusyInd = true;
        //pega.u.d.gBusyInd.setFullScreenBusyInd(true);
      
    }
    this.showMask();
    this.showIndicatorImage(this.bShowIndicatorImg);
  }
  
}

/*
 * API that show/hides the busy indicator image.
 */
pega.ui.busyIndicator.prototype.showIndicatorImage = function(bShowIndicatorImg) {
        /* Prepending statusDiv to body. Assisstive Technology Products will read out the content of this statusDiv when loading is complete */
        var oWnd = pega.desktop.support.getDesktopWindow();
        if (!oWnd) {
            oWnd = window;
        }

        var containers = oWnd.document.querySelectorAll(".iframe-wrapper");
        for (var i=0; i < containers.length; i++){
            if (containers[i].querySelector("iframe") != null && containers[i].style.display == "none"){
                var statusDiv = containers[i].querySelector("iframe").contentDocument.getElementById("statusDiv");
                if (statusDiv != null) {
                    statusDiv.parentNode.removeChild(statusDiv);
                    statusDiv = null;
                }
            }
        }
  		containers = null;
  
        /* Removing existing divs with role=status in invisible iframes */
        //$(oWnd.document.body).find("iframe:not(:visible)").contents().find("#statusDiv").remove(); /*Fix for BUG-233692 : window.top usage is causing script errors on PWM runtime, replaced window.top with getDesktopWindow()*/

        var statusDiv = $("body").find("#statusDiv");
        if ($(statusDiv).length > 0)
            $(statusDiv).text("");
        else if (!($('html').hasClass('phone') || $('html').hasClass('tablet'))) { /*BUG-221593, For mobile screen readers, we assume that we do not require this 1px div */
            $("body").prepend("<div id='statusDiv' role='status' aria-live='polite' aria-atomic='true' class='pzPegaThrobberLiveRegion'></div>"); /* BUG-225417:Pixel height is being added to "StatusDiv" */
        }
        /*bShowIndicatorImg property's value is set in the showMask API. Based on it's value, we will manage the display property of busy indicator image.*/
        if (bShowIndicatorImg) {
            if (this.oSpan) {
                this.oSpan.style.display = 'block';
                $(this.oDiv).parent().attr("aria-busy", true); /* Setting aria-busy on the masked container */
                this.refARIABusyElement = this.oDiv.parentNode; /* Storing the reference where aria-busy is set; used to remove aria-busy later */

                var that = this;
                /* Setting the focus on throbber span only if threshold is reached */
                setTimeout(function() {
                    if (that.oSpan && that.oSpan.style.display == 'block') {
                        pega.ctxmgr.registerContextSwitching(that.oSpan);
                        that.oSpan.focus(); /* Forcing the focus on the span so that it is read by screen readers */
                        that.oSpan.announcedThrobber = true;
                    }
                }, pega.u.d.throbberAnnouncementDelay);
            }
        } else {
            if (this.oSpan) { this.oSpan.style.display = 'none'; }
        }
    }
    /*
     * API that create the busy indicator image span and it's innerHTML.
     */
pega.ui.busyIndicator.prototype.createIndicatorImage = function() {
    if (this.oSpan == null)
        this.initialize(this._sNode);
    var oSpan = this.oSpan;
    var oLoading = "loading";
    if (typeof(strLoadingMsg) != "undefined" && strLoadingMsg)
        oLoading = strLoadingMsg;
    if (this._message && this._message.length > 0) oSpan.innerHTML =
      "<div class='throbber' role='progressbar' aria-valuetext='Loading content'  tabindex='0'><div class='loader'></div></div>" + this._message;
    else oSpan.innerHTML =
      "<div class='throbber' role='progressbar' aria-valuetext='Loading content'  tabindex='0'><div class='loader'></div></div>";

}


/*
@protected - Function to Show the Mask based on the parameters set by the User. The Control and Mask are positioned and mask displayed. Event listener is added for Resize and Scroll events to recalculate the positioning.
@return - void.
*/
pega.ui.busyIndicator.prototype.showMask = function() {
    if (!this.busyManager) {
        return; }
    this.busyIndTimeOut = null;

    pega.util.Event.removeListener(window, "resize", this.show);
    //pega.util.Event.removeListener(window,"scroll",this.show);
    $(window).off("scroll." + this.busyIndicatorID);

    var oDiv = this.oDiv;
    var oSpan = this.oSpan;
    oDiv.style.display = 'block';
    this.bShowIndicatorImg = true;
    //oSpan.style.display = 'block';

    var docBodyScrollTop = document.body.scrollTop;
    var docBodyScrollLeft = document.body.scrollLeft;
    if ((pega.env.ua.gecko || pega.util.Event.isIE) && document.documentElement) {
        docBodyScrollTop = document.documentElement.scrollTop;
        docBodyScrollLeft = document.documentElement.scrollLeft;
    }

    var docBodyClientHeight = document.body.clientHeight;
    var docBodyClientWidth = document.body.clientWidth;

    if (!this._sNode) {

        oDiv.style.top = docBodyScrollTop + "px";
        oDiv.style.left = docBodyScrollLeft + "px";

        oDiv.style.height = docBodyClientHeight + "px";
        oDiv.style.width = docBodyClientWidth + "px";

        if (this._visibility) {
            oSpan.style.top = (docBodyScrollTop + docBodyClientHeight / 2 - oSpan.offsetHeight / 2) + "px";
            oSpan.style.left = (docBodyScrollLeft + docBodyClientWidth / 2 - oSpan.offsetWidth / 2) + "px";
        } else {
            this.bShowIndicatorImg = false;
            //oSpan.style.display = 'none';
        }
    } else {
        /*Code Change Begins*/
        var offset1 = 0,
            offset2 = 0;
        var element = this._sNode;

        /*
        	while (element) 
        	{
        		offset1 += element.offsetTop;
        		//offset2 += element.offsetLeft;
        		try{
        			element = element.offsetParent;
        		}
        		catch(exception){
        			break;
        		}
        	}
		
        	oDiv.style.top = offset1 + "px";
        */

        //BUG-92954 JALDS 05/03/2013 : Issue with the mask being displayed at with a different offset. Aligning it to make sure it is displayed on the actual source Node
        if (element != null) {
            var xyArray = pega.util.Dom.getXY(element);
            offset1 = xyArray[1];
            if(offset1 < 0){offset1 = 0;}
            if (xyArray[1] < docBodyScrollTop && element.offsetHeight > docBodyClientHeight) {
                pega.util.Dom.setXY(this.oDiv, [xyArray[0], docBodyScrollTop]);
            } else {
                pega.util.Dom.setXY(this.oDiv, xyArray);
            }
        }

        /*Code Change Ends*/

        /*Code Comment Start
        	var offset1 = this.total_offset(this._sNode,"offsetTop");
        	oDiv.style.top= offset1;

        	var offset2 = this.total_offset(this._sNode,"offsetLeft");
        	oDiv.style.left= offset2; 
        Comment Ends*/


        if (offset1 < docBodyClientHeight) {
            if ((offset1 + this._sNode.offsetHeight) < docBodyClientHeight) {
                oDiv.style.height = this._sNode.offsetHeight + "px";
                //oDiv.style.width = this._sNode.offsetWidth;	
            } else {
                if (docBodyScrollTop < offset1) {
                    oDiv.style.height = (docBodyClientHeight - offset1 + docBodyScrollTop) + "px";
                    //oDiv.style.width = docBodyClientWidth; 
                } else {
                    //oDiv.style.top = docBodyScrollTop + "px";
                    if ((offset1 + this._sNode.offsetHeight) <= (oDiv.offsetTop + docBodyClientHeight)) {
                        if (docBodyScrollTop > (offset1 + this._sNode.offsetHeight)) {
                            oDiv.style.display = 'none';
                            this.bShowIndicatorImg = false;
                            //oSpan.style.display = 'none';
                        } else {
                            oDiv.style.display = 'block';
                            this.bShowIndicatorImg = true;
                            //oSpan.style.display = 'block';
                            oDiv.style.height = (offset1 + this._sNode.offsetHeight - docBodyScrollTop) + "px";
                            //oDiv.style.width = docBodyClientWidth;
                        }
                    } else {
                        oDiv.style.height = docBodyClientHeight + "px";
                        //oDiv.style.width = docBodyClientWidth;
                    }
                }
            }
        } else {
            if ((docBodyScrollTop + docBodyClientHeight) >= offset1) {
                if (docBodyScrollTop < offset1) {
                    if (this._sNode.offsetHeight < docBodyClientHeight) {
                        oDiv.style.height = this._sNode.offsetHeight + "px";
                        //oDiv.style.width = this._sNode.offsetWidth;
                    } else {
                        oDiv.style.height = (docBodyClientHeight - offset1 + docBodyScrollTop) + "px";
                        //oDiv.style.width = this._sNode.offsetWidth; 	
                    }
                } else {
                    //oDiv.style.top = docBodyScrollTop + "px";
                    if ((offset1 + this._sNode.offsetHeight) <= (oDiv.offsetTop + docBodyClientHeight)) {
                        if (docBodyScrollTop >= (offset1 + this._sNode.offsetHeight)) {
                            oDiv.style.display = 'none';
                            this.bShowIndicatorImg = false;
                            //oSpan.style.display = 'none';
                        } else {
                            oDiv.style.display = 'block';
                            this.bShowIndicatorImg = true;
                            //oSpan.style.display = 'block';		
                            oDiv.style.height = (offset1 + this._sNode.offsetHeight - docBodyScrollTop) + "px";
                            //oDiv.style.width = this._sNode.offsetWidth;
                        }
                    } else {
                        oDiv.style.height = docBodyClientHeight + "px";
                        //oDiv.style.width = this._sNode.offsetWidth;
                    }
                }
            } else
                oDiv.style.display = 'none';
        }

        if (offset2 < docBodyClientWidth) {
            if ((offset2 + this._sNode.offsetWidth) < docBodyClientWidth) {
                //oDiv.style.height = this._sNode.offsetHeight;
                oDiv.style.width = this._sNode.offsetWidth + "px";
            } else {
                if (docBodyScrollLeft < offset2) {
                    //oDiv.style.height = docBodyClientHeight - offset1 + docBodyScrollTop;
                    oDiv.style.width = (docBodyClientWidth - offset2 + docBodyScrollLeft) + "px";
                } else {
                    oDiv.style.left = docBodyScrollLeft + "px";
                    if ((offset2 + this._sNode.offsetWidth) <= (oDiv.offsetLeft + docBodyClientWidth)) {
                        if (docBodyScrollLeft > (offset2 + this._sNode.offsetWidth)) {
                            oDiv.style.display = 'none';
                            this.bShowIndicatorImg = false;
                            //oSpan.style.display = 'none';
                        } else {
                            oDiv.style.display = 'block';
                            this.bShowIndicatorImg = true;
                            //oSpan.style.display = 'block';
                            //oDiv.style.height = offset1 +  this._sNode.offsetHeight - docBodyScrollTop;
                            oDiv.style.width = (offset2 + this._sNode.offsetWidth - docBodyScrollLeft) + "px";
                        }
                    } else {
                        //oDiv.style.height = docBodyClientHeight;
                        oDiv.style.width = docBodyClientWidth + "px";
                    }
                }
            }
        } else {
            if ((docBodyScrollLeft + docBodyClientWidth) >= offset2) {
                if (docBodyScrollLeft < offset2) {
                    if (this._sNode.offsetWidth < docBodyClientWidth) {
                        //oDiv.style.height = this._sNode.offsetHeight;
                        oDiv.style.width = this._sNode.offsetWidth + "px";
                    } else {
                        //oDiv.style.height = docBodyClientHeight - offset1 + docBodyScrollTop;
                        oDiv.style.width = (docBodyClientWidth - offset2 + docBodyScrollLeft) + "px";
                    }
                } else {
                    oDiv.style.left = docBodyScrollLeft + "px";
                    if ((offset2 + this._sNode.offsetWidth) <= (oDiv.offsetLeft + docBodyClientWidth)) {
                        if (docBodyScrollLeft >= (offset2 + this._sNode.offsetWidth)) {
                            oDiv.style.display = 'none';
                            this.bShowIndicatorImg = false;
                            //oSpan.style.display = 'none';
                        } else {
                            oDiv.style.display = 'block';
                            this.bShowIndicatorImg = true;
                            //oSpan.style.display = 'block';		
                            //oDiv.style.height = offset1 +  this._sNode.offsetHeight - docBodyScrollTop;
                            oDiv.style.width = (offset2 + this._sNode.offsetWidth - docBodyScrollLeft) + "px";
                        }
                    } else {
                        //oDiv.style.height = docBodyClientHeight;
                        oDiv.style.width = docBodyClientWidth + "px";
                    }
                }
            } else
                oDiv.style.display = 'none';
        }

        if (!this._visibility) {
            this.bShowIndicatorImg = false;
            //oSpan.style.display = 'none';
        }
    }
    /* change loading icon according to content widht or height*/
    var throbberElem = $(oSpan).children().first();
    var divWidth = parseInt($(oDiv).width());
    var divHeight = parseInt($(oDiv).height());
    if (divWidth <= 80) {
        throbberElem.addClass("vertical");
    } else if (divHeight <= 80) {
        throbberElem.addClass("horizontal");
    }
    pega.util.Event.addListener(window, "resize", this.show, this, true);
    //pega.util.Event.addListener(window,"scroll",this.show, this, true); 
    var scrollProxy = $.proxy(this.show, this);
    $(window).on("scroll." + this.busyIndicatorID, scrollProxy);
    pega.util.Event.addListener(document.body, "keydown", this.preventFocusOnTab, this, true); //Eng-13606/SR-117654/BUG-170577/BUG-173279

};

/*
@protected - Function to Hide the busyIndicator Control along with Mask. Event listener is removed and the busyIndicator control and Mask are hidden.
@return - void.
*/
pega.ui.busyIndicator.prototype.hide = function(skipFocus, ignoreEventQueue, forceHide) {
    if (pega.c && pega.c.actionSequencer && pega.u.d.gBusyInd == this) {
        var pendingQueueLength = pega.c.actionSequencer.getPendingQueueLength();
        var isQueueEmpty = pega.c.actionSequencer.isQueueEmpty();
        if (ignoreEventQueue || (pendingQueueLength == 0 && isQueueEmpty))
            this._showFullScreenBusyInd = false;
        if (!forceHide && (!ignoreEventQueue && (pendingQueueLength > 0 || !isQueueEmpty)))
            return;
    }
  
    pega.util.Event.removeListener(window, "resize", this.show);
    //pega.util.Event.removeListener(window,"scroll",this.show);
    $(window).off("scroll." + this.busyIndicatorID);
    pega.util.Event.removeListener(document.body, "keydown", this.preventFocusOnTab); //Eng-13606/SR-117654/BUG-170577/BUG-173279	

    /* Assistive Technology Products will announce completion only if throbber appearance is announced */
    if (this.oSpan && this.oSpan.announcedThrobber) {
        if (pega && pega.u && pega.u.d && ("throbberLoadingCompletedText" in pega.u.d) && pega.u.d.throbberLoadingCompletedText)
            $("#statusDiv").text(pega.u.d.throbberLoadingCompletedText); /* Setting the text which is read by Assisstive Technology Products when loading is complete */
        this.oSpan.announcedThrobber = false;
    }

    /* Removing aria-busy from the masked container */
    if (this.refARIABusyElement) {
        this.refARIABusyElement.removeAttribute("aria-busy");
        this.refARIABusyElement = null;
    }

    /* BUG-215041:Focus is lost after expand/collapse the header */
    var focusElemInsideGrid = $(pega.u.d.focusElement).closest("table.gridTable"); /* BUG-304668 */
    if (pega && pega.u && pega.u.d && pega.u.d.focusElement && pega.u.d.focusElement.focus && document && document.activeElement && (document.activeElement !== pega.u.d.focusElement) && !skipFocus && !focusElemInsideGrid)
        pega.u.d.focusDomElement(pega.u.d.focusElement);
  
    /*BUG-496778 : setting skipContextSwitching to true to avoid context switch only for IE,
        as IE is switching focus for display style change and so trying to switch context*/
    if(pega.util.Event.isIE) { 
      pega.ctxmgr.skipContextSwitching = true;
    }
    if (this.oDiv)
        this.oDiv.style.display = 'none';
    if (this.oSpan)
        this.oSpan.style.display = 'none';
  
    if(pega.ctxmgr && typeof(pega.ctxmgr.unregisterContextSwitching) === "function" && this.oSpan) {
      pega.ctxmgr.unregisterContextSwitching(this.oSpan);
    }
    this.cleanup();
    this.busyManager = false;
    if (this.busyIndTimeOut != null) {
        clearTimeout(this.busyIndTimeOut);
    }
};

/*
@protected - Function to Hide the busyIndicator Control. Event listener is removed and the busyIndicator control is hidden.
@return - void.
*/
pega.ui.busyIndicator.prototype.hideMessage = function() {
    pega.util.Event.removeListener(window, "resize", this.show);
    //pega.util.Event.removeListener(window,"scroll",this.show);
    $(window).off("scroll." + this.busyIndicatorID);

    this.oSpan.style.display = 'none';
};

/*
@protected - Function to calculate the property (for ex. Left, Top, Width, Height etc.) for the element specified.
@param $element – parameter(Object) to specify the particular node (or)element.
@param $property – parameter(String) to specify the property pertaining to the element, whose value is returned.
@return - This function returns an integer, (i.e.) the property of the element.
*/
pega.ui.busyIndicator.prototype.total_offset = function(element, property) {
    var total = 0;
    while (element) {
        total += element[property];
        try {
            element = element.offsetParent;
        } catch (exception) {
            break;
        }
    }
    return total;
}

pega.ui.busyIndicator.prototype.nullify = function() {
    this.cleanup();
    this._sNode = null;
}

pega.ui.busyIndicator.prototype.setBusyIndInterval = function(interval) {
    this.previousBusyIndInterval = this.busyIndInterval;
    this.busyIndInterval = interval;
}

pega.ui.busyIndicator.prototype.resetBusyIndInterval = function() {
    this.busyIndInterval = this.previousBusyIndInterval;
};  


//</script>
//static-content-hash-trigger-GCC
// <script>

/* @constructor  - Hook mouse click desktop processing.  This file requires
   pega.desktop.api

*/
pega.desktop.MouseEventSingleton = function () {
	this._clickListeners = new Array();
}

pega.desktop.MouseEventSingleton.prototype = {
	
	_bEnable:true,

	/*
	 @public Enable mouse click processing
	 @return $void$ 
	*/
	enable : function() {
		this._bEnable = true;

	},

	/*
	 @public Disable mouse click processing
	 @return $void$ 
	*/
	disable : function() {
		this._bEnable = false;
	},

	/*
	 @public add the function reference to the globalarray	 
	 @return $void$ 
	*/
	registerClickListener: function(functionRef, scopeRef){
    		this._clickListeners[this._clickListeners.length] = new Array (functionRef, scopeRef);
	},
	/*
	 @public 
	 @return $void$ 
	*/
	cancelclickListener: function(functionRef){
		for(var i=0;i<this._clickListeners.length;i++){
			if(this._clickListeners[i] == functionRef ){
			    this._clickListeners[i] = null;
			    this._clickListeners.splice(i,1);
                		    break;
            		}
		}
	},

	/*
	 @protected- Handle mouse click by sending event
	 @return $void$ 
	*/
	_doOnMouseClick: function (event) {
		if (!this._bEnable) {
			return;
		}
		//BUG-113081 Firefox fires click event on right click whereas chrome and IE doesn't --DeltaTouch
		if (event.button == 2) {
			return;
		}
		//BUG-113081

		var srcElement = pega.util.Event.getTarget(event);

		var x = pega.util.Event.getPageX(event);
		var y = pega.util.Event.getPageY(event);


		var eventObj = {};
		eventObj.srcElement = srcElement;
		eventObj.window = window;
		eventObj.pageX = x;
		eventObj.pageY = y;
		
		// Send out mouse click notification, handle Rule-File-Form and Rule-Stream derived documents
		try{
			if (window.gRuleFormManager) {
				gRuleFormManager.wrapperAPI.pega.d.sendEvent("DesktopMouseClick", eventObj, "ASYNC");
			} else if(pega.desktop.support.getDesktopApplication() != null){
				pega.d.sendEvent("DesktopMouseClick", eventObj, "ASYNC");
			} else {
				this._invokeClickListeners(eventObj);
			}
		}
		catch(e) {
		}
	},

	_doOnContextMenu : function(event){
      	if (!this._bEnable) {
			return;
		}
		var srcElement = pega.util.Event.getTarget(event);

		var x = pega.util.Event.getPageX(event);
		var y = pega.util.Event.getPageY(event);


		var eventObj = {};
		eventObj.srcElement = srcElement;
		eventObj.window = window;
		eventObj.pageX = x;
		eventObj.pageY = y;

		// Send out mouse click notification, handle Rule-File-Form and Rule-Stream derived documents
		try{
			if (window.gRuleFormManager) {
				gRuleFormManager.wrapperAPI.pega.d.sendEvent("desktopRightClick", eventObj, "ASYNC");
			} else if(pega.desktop.support.getDesktopApplication() != null){
				pega.d.sendEvent("desktopRightClick", eventObj, "ASYNC");
			} 
		}
		catch(e) {
		}
      
    },
	/*
	@private-   Attaching events for Keyboard handling.
	@return $void$ 
	*/
	_doOnLoad: function() {
		if(document.URL.indexOf("Rule-Obj-ListView.pzShowLVFilters") != -1 || document.URL.indexOf("ShowCalendar") != -1) /*HFix-21022 : not adding click listener for date time filter inside search results overlay,HFix-21370 added condition of ShowCalendar for calendar popup inside search */
        		return;
		try {
				pega.util.Event.addListener(document, "click", this._doOnMouseClick, this, true);
				pega.util.Event.addListener(document, "contextmenu", this._doOnContextMenu, this, true);
    		}
	   	catch(e) {
		}
	},

	_invokeClickListeners : function (obj){
		for(var i=0;i<this._clickListeners.length;i++){
			this._clickListeners[i][0].call(this._clickListeners[i][1], obj);
		}
	}


};

/* Create a singleton object */
pega.d.MouseEvent = new pega.desktop.MouseEventSingleton();

/* Attach mouse listeners on document load */
pega.util.Event.addListener(window,"load", pega.d.MouseEvent._doOnLoad, pega.d.MouseEvent, true);



/**** MOUSE CLICK HANDLER ****/

pega.desktop.MouseEventHandler = function() {
	this.pageX;
	this.pageY;
	this.srcElement = null;
	this.window = null;
	this.alternateWindow = null;
}

pega.desktop.MouseEventHandler.prototype = {

	/** 
	e is the desktop event passed back by the desktopmouseclick event.
	*/

	check: function (e) {
		var bIgnore = false;
		try{//start try

		// get the pageX and pageY from the desktop mouse click event
		var x = e.pageX;
		var y = e.pageY;

		// get the source element 
		var el = e.srcElement;

		// only check the event if the event originated from 
		if (e.window == window  || this.alternateWindow) {

			// if we stored a pageX and pageY, check if the desktop event passes the same pageX and pageY
			// if it is the same pageX and pageY then ignore

			var bClicks = false;
			var bElem = false;

			if (this.pageX && this.pageY) {
				if (x == this.pageX && y == this.pageY) {
					bClicks= true;
				}
			}
			
			// if coordinates weren't stored, check to see if the launchelement is present
			// if the launch element is present compare with desktop event
			if (this.srcElement){
				if (el == this.srcElement) {
					bElem = true;
				}
			}	

			if (bClicks || bElem) bIgnore = true;

		}

		}//end try
		catch(e) {
			// exception may occur if the window that generated the event is closed.
		}
		return bIgnore;
	},

	/**
	ev is the browser event which is used to verify the mouse click.
	*/
	set: function(ev) {
		this.pageX = pega.util.Event.getPageX(ev);
		this.pageY = pega.util.Event.getPageY(ev);
		this.srcElement = pega.util.Event.getTarget(ev);
	},

	clear: function(e) {
		this.pageX = 0;
		this.pageY = 0;
		this.srcElement = null;
		this.window = null;
		this.alternateWindow = null;
	}
	

}
//static-content-hash-trigger-GCC
pega.namespace("pega.tools");


pega.tools.Queue = function() {
	this.queue = [];
	this.dequeueLocked = false;
};

(function() {

	var Queue = pega.tools.Queue ;

	Queue.prototype = {
		enqueue : function(ele) {
			this.queue.push(ele);
		},

		dequeue : function() {
			if(this.dequeueLocked) {
				throw new Error("Dequeue is locked");
			}
			if(this.isEmpty()) {
				throw new Error("Queue is empty");
			}
			return this.queue.shift();
		},

		lockDequeue : function() {
			if(this.dequeueLocked) {
				throw new Error("Dequeue is already locked");
			}
			this.dequeueLocked = true;
		},

		unlockDequeue : function() {
			this.dequeueLocked = false;
		},

		isDequeueLocked : function() {
			return this.dequeueLocked ;
		},

		dequeueAndLock : function() {
			try {
				var ele = this.dequeue();
				this.lockDequeue();
			}catch(e) {
				throw e;
			}
			return ele;
		},

		isEmpty : function() {
			return this.queue.length == 0 ;
		},
		
		putInFront : function(ele) {
			this.queue.unshift(ele);
		}
	};
})();
//static-content-hash-trigger-GCC
/*
* public methods called by other UI modules to indicate work is in progress.  much processing is async
*
*  setAction		- called by actions.  other operations started during life of action. short duration. flagged complete with publishEndOfQueue
*  setAjax			- called from ajaxEngine and other xhr operators.  should be called as close to xhr call as possible.  long duration.
*  setNavigation	- called from gadget mgr for DC population. very long duration
*  setDocument		- called from doc lifecycle. medium duration
*  setHttp			- called from yui_connector and navigates
*               -- also returns data required to send to server for PAL; duration, first server interaction for UI operation
*  setCSS			  - called from pzDesignerStudioWindowLoad; indicates significant CSS in flight
*  setLoadMgr		- called from LoadManager; short duration, ajaxEngine should follow
*  setScriptLoading - called from  pega_tools_evaldomscripts to indicate that script loading is in flight
*  setCallback	- called from anywhere; indicates that long callback on timeout is pending
*  setBusy			- general category
*  setProcessEngine - called from client side processEngine; long duration; indicates OSCO in action
*  setOfflineSync	  - called from client side processEngine; long duration; indicates non visible OSCO in action
*
*
* Also used as a data source for providing the total interaction duration to PAL.  Only page loads (navigate action, form submit) is provided.
*   The time for the previous interaction is returned in the following navigate or http, after going idle.
*   The 'start of interaction' flag is also provided on navigate, for server to know the initial server interaction.  PAL interaction start tracked from click (action)
*       On start-up of instance, (e.g. portal open in new window), flag set to ensure first PAL interaction (e.g. portal) not logged.
*   Data is returned to server in cookie
*   In a Single Document Mode portal, the 'in-flight' data for PAL is persisted in the session store.  Data is read back during document-busy-initialise.
*
* UI going to idle state published through DOM and event emitter support:
*   pega.ui.EventsEmitter.subscribe(pega.ui.statetracking.IDLE_EVENT, function(data){console.log("clientIdle fired, operation duration="+data.totalDuration+", action="+data.interactionAction);});
*
* Operation duration and http times for every operation published to client-performance div on going fully idle
*/
// utility class to store and return data destined to be sent to server for PAL
var PalData = (function () {
    function PalData(original) {
        this.clientInteractionAction = null;
        this.serverInteractionStart = false;
        this.clientInteractionDuration = 0;
        this.netAndServerDuration = 0;
        this.serverCallCount = 0;
        this.callDurations = [];
        this.uiTkn = 0;
        this.actionsCount = 0; // count of user clicks on counted actions, while action is still in flight - e.g. pulse has slow fetches and the user can be clicking around while fetches are still in flight - flags that data is not valid
        if (original != null) {
            this.uiTkn = original.uiTkn;
            this.clientInteractionDuration = original.clientInteractionDuration;
            this.clientInteractionAction = original.clientInteractionAction;
            this.netAndServerDuration = original.netAndServerDuration;
            this.serverCallCount = original.serverCallCount;
            var t = original.callDurations;
            for (var i = 0; i < t.length; i++) {
                this.callDurations.push(t[i]);
            }
            this.actionsCount = original.actionsCount;
        }
    }
    return PalData;
}());
var Statetracking = (function () {
    function Statetracking(dbgOn) {
        this.IDLE_EVENT = "clientIdle";
        //
        // private implementation
        //
        this.COOKIE_NAME = "Pega-Perf"; // client performance cookie
        this.debug = false;
        this.objId = Date.now();
        this.timeEnabled = true; // flag indicating if time tracking enabled
        this.divEnabled = false; // flag indicating if div publishing enabled
        this.isChrome = false;
        this.firstLoadCompleted = false; // flag indicating in first load, to avoid logging initial portal
        // discrete counters for work that is in-flight; should increment up and then back down again
        //    nav initialised to 1 - could not be here otherwise
        this.inFlightCounts = { Action: 0, Ajax: 0, ajaxPre: 0, ajaxPost: 0, Doc: 0, Nav: 1, Fmsbmt: 0, LoadMgr: 0, ScriptLd: 0, Http: 0, css: 0, procEng: 0, offSync: 0, other: 0 };
        // work pending flags; indicates that callbacks pending, but not active
        this.workPending = false;
        // user action only duration totalizer used by PAL
        this.actionTotals = {
            totalDuration: 0,
            //httpBusyTotal: 0,                                   // elapsed total - does not double dip on overlapping calls
            callDurations: [],
            interactCounts: 0 // total for http, navigate, formsubmit
        };
        this.uiTkn = 0; // ui token unique for each user operation - set of actions
        this.uiActionInFlight = null; // indictes that current UI interaction is being collected for PAL / Event publishing
        this.uiActionsCount = 0; // counter for user actions, should just be 1.  if user clicks around while long running load in flight, can have multiple actions counted until idle
        this.firstActionComplete = false; // first actions block complete - assists in user actions counting - do not count during first actions block
        this.interactionStartForPAL = false; // indicates if the startInteraction PAL signal has been sent - goes true -> false
        this.completedTransactionForPAL = null; // last completed UI interaction ready to be added to next http call or navigate response
        this.logPALImmediate = false; // send PAL value immediate on completion
        this.logToPALTransaction = false; // within explicit send to PAL; do not track
        this.logToPALTransactionId = null; // within explicit send to PAL; do not track
        // internal start times - used for getting the actual increment in work.  Also used to determine lifecycle of an 'UI interaction'
        this.startClient = { action: 0 }; //, onLoad: 0, lazyLoad: 0, ajaxPre: 0, ajaxPost: 0, procEng: 0 };
        this.startClientBusy = 0; // set / reset with fine grained busy / idle
        this.startHttpBusy = 0; // this is overall start for overlapping calls
        this.lastIdleTime = 0;
        // bug-226099; nested navigations (section / skin form); capture click setup on top navigation only
        this.startClientPending = { action: false };
        // id of callbacks; (1)reset state when DST is left hung in busy due to counter bugs (2)set state to idle
        this.hungBusy_callbackId = null;
        this.resetIdle_callbackId = null;
        this.objId = Date.now();
        if (dbgOn)
            this.debug = dbgOn;
        //this.debug = true;
        if (this.debug) {
            console.log("inside constructor for pega.ui.statetracking(" + this.objId + ")");
        }
    }
    Statetracking.prototype.setActionBusy = function (description, eventTime) { if (this.timeEnabled)
        this.setActionState(description || "busy", eventTime); };
    Statetracking.prototype.setActionDone = function () { };
    // entry points that engage PAL logging
    Statetracking.prototype.setNavigationBusy = function (url) { this.timeEnabled ? this.setNavigationState("busy", null, url) : null; }; //("busy", null, null, null, url)
    Statetracking.prototype.setNavigationDone = function (cWndw) { if (this.timeEnabled)
        this.setNavigationState("none", cWndw); };
    Statetracking.prototype.setFormsubmitBusy = function (url) { if (this.timeEnabled)
        this.setFormsubmitState("busy", url); };
    Statetracking.prototype.setFormsubmitDone = function () { if (this.timeEnabled)
        this.setFormsubmitState("none"); };
    Statetracking.prototype.setPALInteraction = function (description) { if (this.timeEnabled)
        this.setAsPALInteraction(description); };
    Statetracking.prototype.setAjaxBusy = function (description) { if (this.timeEnabled && this.isOnline())
        this.setAjaxState(description || "busy"); };
    Statetracking.prototype.setAjaxDone = function () { if (this.timeEnabled && this.isOnline())
        this.setAjaxState("none"); };
    Statetracking.prototype.setAjaxPreBusy = function (description) { if (this.timeEnabled && this.isOnline())
        this.setAjaxEngineTimes(description || "busy", 'ajaxPre'); };
    Statetracking.prototype.setAjaxPreDone = function (description) { if (this.timeEnabled && this.isOnline())
        this.setAjaxEngineTimes("none", 'ajaxPre'); };
    Statetracking.prototype.setAjaxPostBusy = function (description) { if (this.timeEnabled && this.isOnline())
        this.setAjaxEngineTimes(description || "busy", 'ajaxPost'); };
    Statetracking.prototype.setAjaxPostDone = function (description) { if (this.timeEnabled && this.isOnline())
        this.setAjaxEngineTimes("none", 'ajaxPost'); };
    Statetracking.prototype.setHttpBusy = function (tId, pC) { this.timeEnabled ? this.setHttpState("busy", tId, pC) : null; };
    Statetracking.prototype.setHttpDone = function (tId, duratn) { if (this.timeEnabled)
        this.setHttpState("none", tId, false, duratn); };
    Statetracking.prototype.setDocumentBusy = function (description) { if (this.timeEnabled)
        this.setDocumentState(description || "busy"); };
    Statetracking.prototype.setDocumentDone = function (wndw) { if (this.timeEnabled)
        this.setDocumentState("ready", wndw); };
    Statetracking.prototype.setDocumentDoneImmediate = function () { if (this.timeEnabled)
        this.setDocumentState("readyImmediate"); };
    Statetracking.prototype.setLoadMgrBusy = function (description) { if (this.timeEnabled)
        this.setLoadMgrState(description || "busy"); };
    Statetracking.prototype.setLoadMgrDone = function () { if (this.timeEnabled)
        this.setLoadMgrState("none"); };
    Statetracking.prototype.setScriptLoadingBusy = function (description) { if (this.timeEnabled)
        this.setScriptLoadingState(description || "busy"); };
    Statetracking.prototype.setScriptLoadingDone = function () { if (this.timeEnabled)
        this.setScriptLoadingState("none"); };
    Statetracking.prototype.setCSSBusy = function () { if (this.timeEnabled)
        this.setCSSState("busy"); };
    Statetracking.prototype.setCSSDone = function () { if (this.timeEnabled)
        this.setCSSState("none"); };
    Statetracking.prototype.setProcessEngineBusy = function (description) { if (this.timeEnabled)
        this.setProcEngState(description || "busy"); };
    Statetracking.prototype.setProcessEngineDone = function () { if (this.timeEnabled)
        this.setProcEngState("none"); };
    Statetracking.prototype.setOfflineSyncBusy = function (description) { this.setOfflnSyncState(description || "busy"); };
    Statetracking.prototype.setOfflineSyncDone = function () { this.setOfflnSyncState("none"); };
    // general participant in busy flagging
    Statetracking.prototype.setCallbackPending = function (cb) { if (this.timeEnabled)
        this.setWorkPending(cb, "busy"); };
    Statetracking.prototype.setCallbackDone = function (cb) { if (this.timeEnabled)
        this.setWorkPending(cb, "done"); };
    Statetracking.prototype.setBusy = function (description) { if (this.timeEnabled)
        this.setOtherState(description || "busy"); }; // used for hardcoded clicks in grid, layout, DC, tab
    Statetracking.prototype.setDone = function () { if (this.timeEnabled)
        this.setOtherState("none"); };
    // management operations
    Statetracking.prototype.resetBusyTotalizer = function () { this.resetTimers(); this.resetInFlightCounts(); this.resetBusyTotalisers(); this.updateDiv(false); this.firstLoadCompleted = true; };
    Statetracking.prototype.enableLogging = function (onOff) { if (typeof onOff === "boolean")
        this.timeEnabled = onOff; };
    Statetracking.prototype.logImmediatelyOnComplete = function (onOff) { if (this.timeEnabled)
        this.logOnComplete(onOff || false); };
    Statetracking.prototype.cleanCookieToToken = function () { this.cleanCookie(); };
    // exposes internal state for testing - DO NOT USE - subject to arbitary change
    Statetracking.prototype.getState = function () { return this.getCondition(); };
    Statetracking.prototype.getBusyTotalizer = function () { return { totalDuration: this.actionTotals.totalDuration, callDurations: this.actionTotals.callDurations }; };
    // check for single document (uses session store) and single page
    Statetracking.prototype.isSDM = function () { return (typeof pega.ui.NavigateTopHandler == 'object' && (typeof pega.u.d.bIsDCSPA == 'undefined' || pega.u.d.bIsDCSPA == false)); };
    Statetracking.prototype.isSPA = function () { return (typeof pega.ui.NavigateTopHandler == 'object' && pega.u.d.bIsDCSPA == true); };
    Statetracking.prototype.isOnline = function () { return pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationRemote(); };
    // initialisation actions - triggered in document-busy-initialise - construction completion
    Statetracking.prototype.initialise = function () {
        this.log("initialise()");
        // check to see if dst div present - used for busy/idle publishing for auto test tools
        if (this.getDocumentStateTracker())
            this.divEnabled = true;
        // this test shouldl be setup once in global utility
        if (navigator.userAgent.indexOf("Chrome/") >= 0)
            this.isChrome = true;
        // if in SDM, data for action persisted in session store over reload
        if (this.isSDM()) {
            this.log("    reading from sessionStore");
            try {
                this.startClient.action = Number(sessionStorage.getItem('docStateTracker_actionStart'));
                this.uiActionInFlight = sessionStorage.getItem('docStateTracker_actionURL');
                if (this.uiActionInFlight != null && this.uiActionInFlight.length > 0)
                    this.uiActionsCount = 1;
                var i = parseInt(sessionStorage.getItem('docStateTracker_uiTkn'), 10);
                this.uiTkn = isNaN(i) ? 0 : i;
                var durations = sessionStorage.getItem('docStateTracker_duratns');
                if (durations != null) {
                    this.actionTotals.callDurations = durations.split(",");
                    this.actionTotals.interactCounts = this.actionTotals.callDurations.length;
                }
                this.logPALdetails("    from session store: ");
                sessionStorage.removeItem('docStateTracker_actionStart');
                sessionStorage.removeItem('docStateTracker_actionURL');
                sessionStorage.removeItem('docStateTracker_uiTkn');
                sessionStorage.removeItem('docStateTracker_duratns');
            }
            catch (e) { }
        }
    };
    /*
    * entry points to state and time incrementers
    */
    Statetracking.prototype.setActionState = function (state, evtTime) {
        this.log("setActionState(" + state + ", " + evtTime + ")");
        // evtTime can be undefined, regular js time value (ms since epoch start), or high performance event timestamp: double usec relative to nav start
        //   -  see https://developers.google.com/web/updates/2016/01/high-res-timestamps?hl=en and https://github.com/majido/high-resolution-timestamp-polyfill/blob/master/translate-timeStamp.js
        //   -  only appears to be fully implemented in Chrome. Integer ms in IE, Safari.  FF is ??
        //   -  *** there a problem with the which window performance is on  ***  end of operations needs update to be relative to start  ***
        // -> just use time now
        var eTime = Date.now();
        this.log("event time:" + eTime);
        var busy = function () {
            // usual entry point to start processing; set mark for start of work
            if (this.startClient.action == 0) {
                this.startClient.action = eTime;
                // bug-226099; nested navigations, only catch action time on top navigation
                this.startClientPending.action = true;
                this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
            }
        };
        // action processor fires busy for each action, fires busy(publishEndOfQueue) for end of processing
        if (state === "publishEndOfQueue") {
            this.firstActionComplete = true;
            this.inFlightCounts.Action = 1;
            this.setState("none", "Action", null, busy);
        }
        else {
            // actions do not count up and down - endOfQ flags done -> no need to move counter.  what about resetting the hung busy timeout?
            if (this.inFlightCounts.Action == 0)
                this.setState(state, "Action", null, busy);
        }
        this.log("setActionState(" + state + ") ... done; inFlightActionC.Action=" + this.inFlightCounts.Action + ", clientBusy=" + this.startClientBusy + ", sC.action=" + this.startClient.action + ", interactionStartForPAL=" + this.interactionStartForPAL + ", firstActionComplete=" + this.firstActionComplete);
    };
    ;
    // Navigation is called from gadgetManager and doc lifecycle, reporting on the Navigate action and bottom of here
    //  - issue with multiple 'done' calls in first MultiDocContainer portal load caused by addition at bottom for child
    //  - some window perf loads can be incomplete when coming through here from inline load at bottom, need to capture on 2nd pass from doc_lifecycle init
    Statetracking.prototype.setNavigationState = function (state, wndw, url) {
        this.log("setNavigationState(" + state + ", " + (wndw != null ? wndw.location : "null") + ")");
        if (url)
            this.log("    url=" + url);
        var idle = function () {
            // multiple load patterns across MDC, SPA, mDC, frankenHarnesses, ... , can result in too many 'idle' calls
            if (this.inFlightCounts.Nav == -1) {
                this.inFlightCounts.Nav = 0;
            }
            else {
                // duration of action to navigate start.  nav start not available for IE
                // bug-226099; nested navigations, only catch action time on top navigation
                // bug-241524; nested navigations, only catch firstview time on top navigation
                if (this.startClientPending.action == true) {
                    this.startClientPending.action = false;
                }
                // clear cookie - whatever was on it has gone
                this.cleanCookie();
            }
            var http = 0;
            var navStart = null;
            this.actionTotals.interactCounts++;
            // data from window.performance.navigation object
            if (wndw && wndw.performance && wndw.performance.timing) {
                var wpt = wndw.performance.timing;
                //console.log("wpt.navigationStart="+wpt.navigationStart+", requestStart="+wpt.requestStart+", domLoading="+wpt.domLoading+", responseEnd="+wpt.responseEnd+", domContentLoadedEventEnd="+wpt.domContentLoadedEventEnd+", loadEventEnd="+wpt.loadEventEnd);
                navStart = wpt.navigationStart;
                http = wpt.responseEnd - wpt.requestStart;
                this.log("w.p.t:navigationStart=" + navStart + ", http=" + http);
            }
            else {
                // alternate terrible implementation for IE; needs timing tightening up. this execution is not necessarily close to the navigate coming off the wire - see trigger at bottom in in-line
                http = Date.now() - this.startHttpBusy;
                this.log("    duration estimate=" + http);
            }
            // for MDC portal work area content, call from in-line is too early and end is not in -> take no action
            if (http > 0) {
                //this.actionTotals.httpBusyTotal += http;
                this.actionTotals.callDurations.push(http);
                if (this.inFlightCounts.Http == 0 && this.inFlightCounts.Nav == 0)
                    this.startHttpBusy = 0;
            }
        };
        var busy = function () {
            // http and nav can be measured as in flight at the same time
            var t = Date.now();
            if (this.inFlightCounts.Nav == 1 && this.inFlightCounts.Http == 0 && this.startHttpBusy == 0)
                this.startHttpBusy = t;
            // on window load, actionStart is not set (no event), set from navStart
            if (this.startClient.action == 0) {
                this.startClient.action = t;
                this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
            }
            // set PAL logging on
            if (!url)
                url = "setNavigation() no url";
            this.initPALlogging(url);
            // write out to cookie ready for impending call
            this.updateCookie();
            // previously formsubmit busy was captured as other("formsubmit"). cleared in 'readyImmediate', called from harness unload and old popup windows.  now deprecated by explicit Fmsbmt count and setFormsubmit api
            // other("formSubmit") is used for htmlForm.formSubmit() that is part of rule creation in DesignerStudio
            if (this.inFlightCounts.other > 0)
                this.setOtherState("none", "formSubmit");
            // if called in SPA, set counter back - THIS IS A REALLY BAD LINE
            if (this.isSPA())
                this.inFlightCounts.Nav--;
        };
        this.setState(state, "Nav", idle, busy);
        //this.log("setNavigationState(" + state + ") ... done;  sC.action=" + this.startClient.action + ", startHttpB=" + this.startHttpBusy + ", aT.httpBusy=" + this.actionTotals.httpBusyTotal + ", httpDs="+this.actionTotals.callDurations.join("!")+", wptCaptured="+this.wptCaptured);
        this.log("setNavigationState(" + state + ") ... done;  sC.action=" + this.startClient.action + ", startHttpB=" + this.startHttpBusy + ", httpDs=" + this.actionTotals.callDurations.join("!"));
    };
    // Formsubmit is called for form.submit - a harness refresh without navigation - used from new/create button harnesses
    // old multi doc uses form.submit, SPA replaces with xhr, with mDC no doc load, => sets script loading fudge - cleared in doc_initialise
    Statetracking.prototype.setFormsubmitState = function (state, url) {
        this.log("setFormsubmitState(" + state + ")");
        var idle = function () {
            //this.actionTotals.interactCounts++;
            if (this.inFlightCounts.Fmsbmt < 0)
                this.inFlightCounts.Fmsbmt = 0;
            //this.setOtherState("busy", "scriptLoadingFudge");
        };
        var busy = function () {
            // set PAL logging on
            this.interactionStartForPAL = true;
            if (!url)
                url = "setFormsubmitState() no url";
            this.initPALlogging(url);
            // write out to cookie ready for impending call
            this.updateCookie();
        };
        this.setState(state, "Fmsbmt", idle, busy);
        this.log("setFormsubmitState(" + state + ") ... done; inFlightC.Nav=" + this.inFlightCounts.Nav + ", inFlightC.Doc=" + this.inFlightCounts.Doc + ", inFlightC.Fmsbmt=" + this.inFlightCounts.Fmsbmt + ", sC.action=" + this.startClient.action);
        this.logPALdetails("    ");
    };
    ;
    // Document state is called principally from doc_lifecycle, reporting on document post-creation and pre-destruction
    //    - clears 'other' on readyImmediate
    Statetracking.prototype.setDocumentState = function (docAction, wndw) {
        this.log("setDocumentState(" + docAction + ")");
        var idle = function () {
            // previously formsubmit busy was captured as other("formsubmit"). cleared in 'readyImmediate', called from harness unload and old popup windows.  now deprecated by explicit Fmsbmt count and setFormsubmit api
            if (docAction == "readyImmediate" && this.inFlightCounts.other > 0)
                this.setOtherState("none", "formSubmit");
        };
        var busy = function () {
            if (docAction == "initialising") {
                this.initialise();
                // fudge for script compile time
                if (this.inFlightCounts.other > 0)
                    this.setOtherState("none");
            }
        };
        var state = docAction;
        if (docAction == "ready")
            state = "none";
        if (docAction == "readyImmediate")
            state = "noneImmediate";
        this.setState(state, "Doc", idle, busy);
        this.log("setDocState(" + docAction + ") ... done; inFlightC.Nav=" + this.inFlightCounts.Nav + ", inFlightC.Doc=" + this.inFlightCounts.Doc + ", inFlightC.Fmsbmt=" + this.inFlightCounts.Fmsbmt + ", sC.action=" + this.startClient.action);
        //logCallbackIds();
    };
    ;
    Statetracking.prototype.setAjaxState = function (state) {
        this.log("setAjaxEngineState(" + state + ")");
        // for completeness
        var busy = function () {
            if (this.startClient.action == 0) {
                this.startClient.action = Date.now();
                this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
            }
        };
        this.setState(state, "Ajax", null, busy);
        this.log("setAjaxEngineState() ... done; inFlightC.Ajax=" + this.inFlightCounts.Ajax + ", sC.action=" + this.startClient.action);
    };
    ;
    // ajax pre and post processing is for duration counting; state blocking is covered by http
    // calls from ajax engine are simple nested linear
    Statetracking.prototype.setAjaxEngineTimes = function (state, totId) {
        this.log("setAjaxEngineTimes(" + state + ", " + totId + ")");
        var idle = function () {
            if (this.inFlightCounts[totId] == 0) {
                this.startClient[totId] = 0;
            }
        };
        var busy = function () {
            var t = Date.now();
            if (this.inFlightCounts[totId] == 1)
                this.startClient[totId] = t;
            // usual entry point to start processing is action processing; some action blocks can enter here; set mark for start of work
            if (this.startClient.action == 0) {
                this.startClient.action = t;
                this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
            }
        };
        this.setState(state, totId, idle, busy);
        this.log("setAjaxEngineTimes(" + state + ", " + totId + ") ... done; inFlightC.ajaxPre=" + this.inFlightCounts.ajaxPre + ", inFlightC.ajaxPost=" + this.inFlightCounts.ajaxPost + ", sC.action=" + this.startClient.action);
    };
    ;
    Statetracking.prototype.setHttpState = function (state, tId, palCall, duratn) {
        this.log("setHttpState(" + state + ", " + tId + ", " + palCall + ", " + duratn + ")");
        // if part of 'post to PAL now', do not track
        if (this.logToPALTransaction == true) {
            if (state == "busy") {
                this.log("sending to PAL - do not track - duration for PAL=");
                this.logToPALTransactionId = tId;
                // write out to cookie ready for impending call
                this.updateCookie();
            }
            else {
                this.log("completion sending to PAL - end do not track");
                if (this.logToPALTransactionId == tId) {
                    this.logToPALTransaction = false;
                    this.logToPALTransactionId = null;
                    // clear cookie - whatever was on it has gone
                    this.cleanCookie();
                }
                else {
                    this.logErr("mismatched log-to-PAL transaction ids " + this.logToPALTransactionId + ", " + tId);
                }
            }
        }
        else {
            var idle = function () {
                this.actionTotals.interactCounts++;
                // list used for PAL/PDC data logging captures all interactions
                if (typeof duratn == 'undefined')
                    duratn = 0;
                this.actionTotals.callDurations.push(duratn);
                // for totals, do not double dip on overlapping calls
                if (this.inFlightCounts.Http == 0) {
                    //const delta = Date.now() - this.startHttpBusy;
                    //this.log("    duration estimate="+delta);
                    //this.actionTotals.httpBusyTotal += delta;
                    if (this.inFlightCounts.Nav == 0)
                        this.startHttpBusy = 0;
                }
                // clear cookie - whatever was on it has gone
                this.cleanCookie();
            };
            var busy = function () {
                // overlapping calls start - hold first start - http and nav can be measured as in flight at the same time
                if (this.inFlightCounts.Nav == 0 && this.inFlightCounts.Http == 1 && this.startHttpBusy == 0)
                    this.startHttpBusy = Date.now();
                if (this.startClient.action == 0) {
                    //this.startClient.action = startTime;            // desktop makes some pure http calls
                    this.startClient.action = this.startHttpBusy; // desktop makes some pure http calls
                    this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
                }
                // write out to cookie ready for impending call
                this.updateCookie();
            };
            this.setState(state, "Http", idle, busy);
        }
        //this.log("setHttpState(" + state + ") ... done;  sC.action=" + this.startClient.action + ", startHttpB=" + this.startHttpBusy + ", aT.httpBusy=" + this.actionTotals.httpBusyTotal + ", httpDs="+this.actionTotals.callDurations.join("!"));
        this.log("setHttpState(" + state + ") ... done;  sC.action=" + this.startClient.action + ", startHttpB=" + this.startHttpBusy + ", httpDs=" + this.actionTotals.callDurations.join("!"));
    };
    Statetracking.prototype.setLoadMgrState = function (state) {
        this.setState(state, "LoadMgr");
        this.log("setLoadMgrState(" + state + ") ... done; inFlightC.LoadMgr=" + this.inFlightCounts.LoadMgr);
    };
    ;
    Statetracking.prototype.setScriptLoadingState = function (state) {
        this.setState(state, "ScriptLd");
        // script loader done path is not clear, can set done multiple times
        if (this.inFlightCounts.ScriptLd == -1)
            this.inFlightCounts.ScriptLd = 0;
        this.log("setScriptLoadingState(" + state + ") ... done; inFlightC.ScriptLd=" + this.inFlightCounts.ScriptLd);
    };
    ;
    Statetracking.prototype.setCSSState = function (state) {
        this.setState(state, "css");
        this.log("setCSSState(" + state + ") ... done; inFlightC.css=" + this.inFlightCounts.css);
    };
    ;
    // used internally and for hardcoded clicks in grid, layout, DC, tab
    Statetracking.prototype.setOtherState = function (state) {
        var busy = function () {
            if (this.startClient.action == 0) {
                this.startClient.action = Date.now();
                this.interactionStartForPAL = true; // is there a window for this to be set, reset, transmitted and set again?
            }
        };
        this.setState(state, "other", null, busy);
        this.log("setOtherState(" + state + ") ... done; inFlightC.other=" + this.inFlightCounts.other + ", sC.action=" + this.startClient.action);
    };
    ;
    // HC process engine
    Statetracking.prototype.setProcEngState = function (state) {
        this.setState(state, "procEng");
        this.log("setProcEngState(" + state + ") ... done; inFlightC.procEng=" + this.inFlightCounts.procEng);
    };
    ;
    Statetracking.prototype.setOfflnSyncState = function (state) {
        // on busy/idle disable/enable other capture - offline sync engine reuses ajax (->doc) processors
        // duration logged, but not setup for PAL through cookie
        this.log("setOfflnSyncState(" + state + ")");
        var busy = function () {
            if (this.startClient.action == 0) {
                this.startClient.action = Date.now();
                this.uiActionInFlight = "action:offline-sync";
            }
        };
        this.setState(state, "offSync", null, busy);
        this.log("setOfflnSyncState(" + state + ") ... done; inFlightC.offSync=" + this.inFlightCounts.offSync + ", this.uiActionInFlight=" + this.uiActionInFlight);
    };
    ;
    // mark the current set of operations as a set to be logged to PAL
    // called from desktop_api and extends PAL logging from navigate and form submit to single page actions
    // *** call order is critical; has http call that will pick up last PAL data already occured ***
    Statetracking.prototype.setAsPALInteraction = function (url) {
        this.log("setAsPALInteraction(" + url + ")");
        if (!url)
            url = "setAsPALInteraction() no url";
        this.initPALlogging(url);
        this.logPALdetails("setAsPALInteraction() ... done:  ");
    };
    /*
    * down into the engine room
    */
    Statetracking.prototype.setState = function (state, countId, idleProcessing, busyProcessing) {
        if (state == "none" || state == "noneImmediate") {
            this.inFlightCounts[countId]--;
            // additional going idle processing
            if (idleProcessing)
                idleProcessing.apply(this);
            // reset after delay to allow any other pending work to come in;  unless flagged for immediate release - used when popup window is unloading
            this.log(this.counters_s());
            if (this.isIdle()) {
                this.goingIdle((state == "noneImmediate"));
            }
        }
        else {
            this.inFlightCounts[countId]++;
            // additional going busy processing
            if (busyProcessing)
                busyProcessing.apply(this);
            this.goingBusy();
        }
    };
    ;
    // work pending is for callbacks set, but not fired.  stops main reset completing, allows idle state so that busy time does not increment
    //TODO :  needs to be increment
    //TODO :  needs to be on item basis
    Statetracking.prototype.setWorkPending = function (item, state) {
        //_log("setWorkPending("+item+", "+state+")");
        if (state == "busy" && !this.workPending) {
            this.workPending = true;
        }
        else if (state == "done" && this.workPending) {
            this.workPending = false;
            // need to reset flags if this was the only outstanding item
            if (this.isIdle())
                this.goingIdle();
        }
        this.log("setWorkPending(" + item + ", " + state + ") workPending=" + this.workPending);
    };
    ;
    // test for busy or idle;
    Statetracking.prototype.isIdle = function () { return this.isNetworkIdle() && this.isClientIdle(); };
    ;
    Statetracking.prototype.isNetworkIdle = function () { return this.inFlightCounts.Http == 0 && this.inFlightCounts.Ajax == 0 && this.inFlightCounts.Nav == 0 && this.inFlightCounts.Fmsbmt == 0; };
    ;
    Statetracking.prototype.isClientIdle = function () {
        return this.inFlightCounts.Action == 0 && this.inFlightCounts.LoadMgr == 0 && this.inFlightCounts.Doc == 0 && this.inFlightCounts.css == 0 && this.inFlightCounts.ajaxPre == 0 && this.inFlightCounts.ajaxPost == 0 && this.inFlightCounts.ScriptLd == 0 &&
            this.inFlightCounts.procEng == 0 && this.inFlightCounts.offSync == 0 && this.inFlightCounts.other == 0;
    };
    ;
    // test for work pending (structured for more complexity coming)
    Statetracking.prototype.isWorkPending = function () { return this.workPending; };
    ;
    // new changes in flight; set timer mark, update state in div, set callback to cleanup if counters buggy and incomplete in 2 min and not in adp
    Statetracking.prototype.goingBusy = function () {
        //this.log("goingBusy()");
        // start totalizer timer for this interaction; 0 implies currently idle
        if (this.startClientBusy == 0) {
            this.startClientBusy = Date.now();
            // clear here - leaving set in idle as used in tests
            //this.actionTotals.httpBusyTotal = 0;
            this.actionTotals.totalDuration = 0;
            this.actionTotals.callDurations = [];
            this.updateDiv(true);
            // update to Chrome Dev Tool, only when 'testing' flag set - NOT STANDARD W3C
            if (this.divEnabled && console.timeStamp && this.isChrome)
                console.timeStamp("dstBusy");
        }
        // clear current callback
        if (this.hungBusy_callbackId)
            clearTimeout(this.hungBusy_callbackId);
        // set callback to be triggered if DST is left busy due to counter bugs; initial 1 min
        this.hungBusy_callbackId = setTimeout(this.hungBusy_cleanup.bind(this), 70000);
        //  clear 'set idle' callback
        if (this.resetIdle_callbackId) {
            clearTimeout(this.resetIdle_callbackId);
            this.resetIdle_callbackId = null;
        }
        this.log("goingBusy() ... done;  " + this.counters_s());
        //logCallbackIds();
    };
    ;
    // on going in to idle state, (when ALL inflight counters reach 0) or (all counters 0 and workPendiing false);  published state is reset after 100 ms idle
    Statetracking.prototype.goingIdle = function (immediate) {
        //_log("goingIdle("+immediate+")");
        // set time going idle for lazyLoad completion in reset
        this.lastIdleTime = Date.now();
        this.resetTimers();
        //    increased from 50 to 110 ms as grid event handling has 100 ms delay
        if (immediate && immediate == true) {
            this.resetStateOnNoChange();
        }
        else {
            this.resetIdle_callbackId = setTimeout(this.resetStateOnNoChange.bind(this), 110);
        }
        // update to Chrome Dev Tool, only when 'testing' flag set - NOT STANDARD W3C
        if (this.divEnabled && console.timeStamp && this.isChrome)
            console.timeStamp("dstIdle");
        //this.log("goingIdle() ... done; aT.httpBusy=" + this.actionTotals.httpBusyTotal + ", lastIdle=" + this.lastIdleTime);
        this.log("goingIdle() ... done; lastIdle=" + this.lastIdleTime);
        //logCounters() ;
        //logCallbackIds();
    };
    ;
    // reset callback timers
    Statetracking.prototype.resetTimers = function () {
        //  clear hung in busy mechanism
        if (this.hungBusy_callbackId) {
            clearTimeout(this.hungBusy_callbackId);
            this.hungBusy_callbackId = null;
        }
        //  reset pending 'end of processing'
        if (this.resetIdle_callbackId) {
            clearTimeout(this.resetIdle_callbackId);
            this.resetIdle_callbackId = null;
        }
    };
    // callback triggered when DST has not returned to idle after delay - to recover from bugs in state counters
    // reset state if not in long running parallel processing - ADP
    Statetracking.prototype.hungBusy_cleanup = function () {
        this.logWarn("hungBusy_cleanup() ... forced cleanup executing");
        // update to Chrome Dev Tool, only when 'testing' flag set - NOT STANDARD W3C
        if (this.divEnabled && console.timeStamp && this.isChrome)
            console.timeStamp("dstReset");
        this.resetInFlightCounts();
        this.workPending = false;
        this.hungBusy_callbackId = null;
        this.resetIdle_callbackId = null;
        this.resetStateOnNoChange();
        this.resetBusyTotalisers();
    };
    ;
    // called after small delay to allow any pending work on other events to be queued
    //    update the document-statetracker div to ready, if no change in counters
    //    update reporting timers based on 'completion' of actions
    Statetracking.prototype.resetStateOnNoChange = function () {
        this.log("resetStateOnNoChange():");
        this.log("    " + this.counters_s());
        this.log("    " + this.totals_s());
        var lastTotalDuration = 0;
        this.resetIdle_callbackId = null;
        if (this.isIdle() && !this.isWorkPending()) {
            // perform 'gone idle' tasks
            if (!this.firstLoadCompleted)
                this.firstLoadCompleted = true;
            if (this.startClient.action == 0) {
                this.logWarn("missing startClient.action on going idle");
            }
            else {
                lastTotalDuration = this.lastIdleTime - this.startClient.action;
            }
            this.log("    lastTotalDuration=" + lastTotalDuration + ", lastIdleTime=" + this.lastIdleTime + ", startClient.action=" + this.startClient.action + ", uiActionInFlight=" + this.uiActionInFlight + ", uiActionsCount=" + this.uiActionsCount);
            this.actionTotals.totalDuration = lastTotalDuration;
            // update to Chrome Dev Tool, only when 'testing' flag set - NOT STANDARD W3C
            if (this.divEnabled && console.timeStamp && this.isChrome)
                console.timeStamp("dstIdle110");
            // update div(s) used by selenium/puppeteer browser tests and client-performance div
            this.updateDiv(false, lastTotalDuration.toString(), this.actionTotals.callDurations);
            // send to PAL, put duration and action into store to add to next interaction;  only for major operations around page load (navigate, submit, SPA page load)
            if (this.uiActionsCount > 0) {
                var pData = new PalData();
                pData.uiTkn = this.uiTkn;
                pData.clientInteractionAction = this.uiActionInFlight;
                pData.actionsCount = this.uiActionsCount;
                pData.clientInteractionDuration = lastTotalDuration;
                //pData.netAndServerDuration = this.actionTotals.httpBusyTotal;
                pData.serverCallCount = this.actionTotals.interactCounts;
                var t = this.actionTotals.callDurations;
                for (var i = 0; i < t.length; i++) {
                    pData.callDurations.push(t[i]);
                }
                this.completedTransactionForPAL = pData;
                // if PAL viewer open, post to server immediately.  asynch request handles getting value and clearing value
                if (this.logPALImmediate == true) {
                    this.log("posting to PAL: " + pData.clientInteractionDuration);
                    this.logToPALTransaction = true;
                    var safeurl = new SafeURL();
                    safeurl.put("pyActivity", "pzAmIOnline");
                    pega.util.Connect.asyncRequest("POST", safeurl.toURL(null, null));
                }
            }
            // publish idle event asynch - data must be a deep copy for async event handling - most Chrome string ops do not copy -  https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
            // bug-421108 -ve duration from first use in HC - drop it
            if (lastTotalDuration >= 0) {
                //let s: string = "";
                //for (let d of this.actionTotals.callDurations) {s += "!"+d;}
                //pega.ui.EventsEmitter.publish(this.IDLE_EVENT, {totalDuration:lastTotalDuration+0, interactionAction:(this.uiActionInFlight == null ? null : this.uiActionInFlight+''), httpd:this.actionTotals.httpBusyTotal+"!"+this.actionTotals.callDurations.join("!")});
                pega.ui.EventsEmitter.publish(this.IDLE_EVENT, { totalDuration: lastTotalDuration + 0, interactionAction: (this.uiActionInFlight == null ? null : this.uiActionInFlight + ''), httpd: this.actionTotals.callDurations.join("!") });
            }
            // set start values ready for next user action - include clearing PAL data. increment ui token
            this.resetToStart();
            this.log("     - reset executed:");
            this.log("     aTotals.totalDuration=" + this.actionTotals.totalDuration); // + ", aTotals.httpBusy=" + this.actionTotals.httpBusyTotal);
            this.logPALdetails("    ");
        }
        else {
            this.log("resetStateOnNoChange() - reset cancelled");
        }
    };
    ;
    Statetracking.prototype.updateDiv = function (busy, totalDuration, httpCallDurations) {
        if (totalDuration === void 0) { totalDuration = ""; }
        if (httpCallDurations === void 0) { httpCallDurations = []; }
        if (this.divEnabled) {
            var dstDiv = this.getDocumentStateTracker();
            if (dstDiv) {
                dstDiv.setAttribute("data-state-busy-status", busy ? "busy" : "none");
                dstDiv.setAttribute("data-dst-busy-duration", totalDuration);
                dstDiv.setAttribute("data-dst-http-durations", httpCallDurations.join(','));
                dstDiv = null;
            }
        }
    };
    /*
    * time management functions
    */
    // reset data at the end of an user interaction, ready for start of next
    Statetracking.prototype.resetToStart = function () {
        this.categoriesIter(this.startClient, function (cd, cat) { cd[cat] = 0; });
        this.uiTkn++;
        // do not clear here - used in tests - clear on start
        // this.actionTotals.totalDuration = 0;
        //this.actionTotals.httpBusyTotal = 0;
        //let t = this.actionTotals.callDurations;
        //while (t.length > 0) {t.pop();}
        this.actionTotals.interactCounts = 0;
        if (this.isSDM()) {
            try {
                sessionStorage.removeItem('docStateTracker_duratns');
            }
            catch (e) { }
        }
        this.startClientBusy = 0;
        this.startHttpBusy = 0;
        this.uiActionInFlight = null;
        this.firstActionComplete = false;
        this.uiActionsCount = 0;
    };
    ;
    Statetracking.prototype.resetInFlightCounts = function () {
        this.categoriesIter(this.inFlightCounts, function (cd, cat) { cd[cat] = 0; });
    };
    ;
    // reset busy totalizers; externally called or internal error recovery
    //  clear everything
    Statetracking.prototype.resetBusyTotalisers = function () {
        this.log("resetBusyTotalisers()");
        this.resetToStart();
        this.interactionStartForPAL = false;
        this.completedTransactionForPAL = null; // cannot be used, as state between start and here is unknown
        this.logToPALTransaction = false;
        this.logToPALTransactionId = null;
        try {
            sessionStorage.removeItem('docStateTracker_actionStart');
            sessionStorage.removeItem('docStateTracker_actionURL');
            sessionStorage.removeItem('docStateTracker_uiTkn');
            sessionStorage.removeItem('docStateTracker_duratns');
        }
        catch (e) { }
        this.deleteCookie();
        // ok as part of forced cleanup - usually reset in start phase as tests use values
        //this.actionTotals.httpBusyTotal = 0;
    };
    ;
    /**
     * if PAL timing not running, start. PAL timing only triggered for page loads: navigation, form submit and SPA page load. Do not track for PAL when in Designer Studio
     *   set flag indicating PAL logging running, based on url content
     *   save flags to sessionstore for SDM operation
     * @param  {boolean = false}  incStartFlag    flag for addition of 'interaction start' flag to returned data struct.  Only set from navigation and http
     * @param  {string}           actionUrl       url of call for page load.  parsed to build descriptive message for PAL
     * @param  {boolean = true}   returnPalData   flag for return of pal data structure only set from desktop_api
     * @return {PalData}                          Description of last PAL call.  This is held
     */
    Statetracking.prototype.initPALlogging = function (actionUrl) {
        this.log("initPALlogging(" + actionUrl + ") uiActionsCount=" + this.uiActionsCount + ", uiActionInFlight=" + this.uiActionInFlight + ", firstLoadCompleted=" + this.firstLoadCompleted + ", firstActionComplete=" + this.firstActionComplete);
        if (this.firstLoadCompleted || (typeof pmcRuntimeFeatures !== "undefined" && pmcRuntimeFeatures.pxUsesMultiWebView === "true")) {
            // if already running (user clicking around while long running action in flight), counter>1 flags data not valid
            // if in action processor, only increment counter for first action.  multiple PAL actions are valid in action processor
            if (this.firstActionComplete) {
                this.uiActionsCount++;
            }
            else if (this.uiActionsCount === 0) {
                this.uiActionsCount++;
            }
            if (this.uiActionInFlight === null) {
                // need to copy value for IE and free'd script feature
                if (actionUrl) {
                    if (typeof actionUrl === 'string') {
                        // if obfuscated url passed, deobfuscate - getting fails
                        if (actionUrl.indexOf("pyactivitypzZZZ") != -1) {
                            try {
                                var au = SafeURL_createFromEncryptedURL(actionUrl).toUnencodedQueryString();
                                if (au && au.length > 1)
                                    actionUrl = au;
                            }
                            catch (e) { }
                        }
                        // build operation description string for PAL
                        var beginQS = actionUrl.indexOf('?');
                        if (beginQS > 1) {
                            // split on &
                            var qsParams = actionUrl.substring(beginQS + 1).split('&');
                            try {
                                for (var i = 0; i < qsParams.length; i++) {
                                    var item = qsParams[i];
                                    if (item.startsWith('action') || item.startsWith('key') || item.startsWith('harnessName') || item.startsWith('className') ||
                                        item.startsWith('openHandle') || item.startsWith('insName') || item.startsWith('objClass') || item.startsWith('PreActivity') ||
                                        item.startsWith('pyActivity') || item.startsWith('pyReportName') || item.startsWith('pyReportClass') || item.startsWith('pyShortcutHandle')) {
                                        if (this.uiActionInFlight === null) {
                                            this.uiActionInFlight = "";
                                        }
                                        else {
                                            this.uiActionInFlight += "|";
                                        }
                                        // replace = with : for PDC filtering
                                        this.uiActionInFlight += (item.indexOf('=') != -1 ? item.replace('=', ':') : item);
                                    }
                                }
                                if (this.uiActionInFlight === null || this.uiActionInFlight === "") {
                                    this.uiActionInFlight = "no recognised operations on action:" + actionUrl;
                                }
                                else {
                                    this.uiActionInFlight = this.uiActionInFlight.replace('=', ':');
                                }
                            }
                            catch (e) {
                                this.uiActionInFlight = "cannot parse action:" + actionUrl;
                            }
                        }
                        else {
                            this.uiActionInFlight = "badly formed action url:" + actionUrl;
                        }
                    }
                    else {
                        var t = typeof actionUrl;
                        this.uiActionInFlight = "typeof actionURL:" + t + ", actionURL.name:" + actionUrl.name;
                    }
                }
                else {
                    this.uiActionInFlight = "actionUrl is null";
                }
                // bug-269996, use sessionStore for single document mode
                if (this.isSDM()) {
                    this.log("initPALlogging: writing to sessionStore, uiActionInFlight=" + this.uiActionInFlight + ", startClient.action=" + this.startClient.action);
                    // bug-273556 Safari in pvt does not allow local or session store
                    try {
                        sessionStorage.setItem('docStateTracker_actionStart', this.startClient.action.toString());
                        sessionStorage.setItem('docStateTracker_actionURL', this.uiActionInFlight);
                        sessionStorage.setItem('docStateTracker_uiTkn', this.uiTkn.toString());
                    }
                    catch (e) {
                        console.warn("pzpega_ui_doc_statetracking.initPALLogging() - write to session store fail");
                    }
                }
            } // end of not in flight check
        } // end of first load check
        this.log("initPALlogging(" + actionUrl + ") ... done  uiActionsCount=" + this.uiActionsCount + ", uiActionInFlight=" + this.uiActionInFlight + ", firstActionComplete=" + this.firstActionComplete);
    };
    /**
     * look at state of tracking and update cookie
     * BUG-337409: the cookie can be set during navigate->dst call, possible for http busy call to come in before navigate/http sends start/complete data:
     *        on http/navigate done, clean cookie
     *        on update here, only change itkn
     */
    Statetracking.prototype.updateCookie = function () {
        this.log("updateCookie()");
        this.logPALdetails("    ");
        //
        // *** ORDER IS IMPORTANT FOR HTTPAPI PARSING ***
        // *** DO NOT CHANGE ORDER OF token, start, completed data ***
        //
        var cookieString = null;
        var existingCookie = document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + this.COOKIE_NAME + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
        var idx = existingCookie.indexOf("&start");
        if (idx == -1)
            idx = existingCookie.indexOf("&completed");
        if (idx == -1) {
            // cookie is clean, OK to update
            cookieString = "itkn=" + this.uiTkn;
            // if first http call after operation started, set 'start of server interaction series flag'
            if (this.interactionStartForPAL) {
                cookieString += "&start";
                this.interactionStartForPAL = false;
            }
            if (this.completedTransactionForPAL != null) {
                var t = this.completedTransactionForPAL;
                var ua = "";
                if (t.actionsCount > 1) {
                    // data not good as multiple user actions intermingled
                    //cookieString += "&completed={itkn="+t.uiTkn+"&clientd="+t.clientInteractionDuration+"&action="+encodeURIComponent(t.clientInteractionAction)+"&calls="+t.serverCallCount+"&userActions="+t.actionsCount+"}";
                    ua = "&userActions=" + t.actionsCount;
                }
                //{itkn=25&clientd=12345&action=openWorkByHandle!PEGASAMPLE%20W-17&calls=3&httpd=12300!11000!1200!300}
                //cookieString += "&completed={itkn="+t.uiTkn+"&clientd="+t.clientInteractionDuration+"&action="+encodeURIComponent(t.clientInteractionAction)+ua+"&calls="+t.serverCallCount+"&httpd="+t.netAndServerDuration+"!"+t.callDurations.join("!")+"}";
                cookieString += "&completed={itkn=" + t.uiTkn + "&clientd=" + t.clientInteractionDuration + "&action=" + encodeURIComponent(t.clientInteractionAction) + ua + "&calls=" + t.serverCallCount + "&httpd=" + t.callDurations.join("!") + "}";
                this.completedTransactionForPAL = null;
            }
        }
        else {
            // start could have already been applied to cookie, but not yet sent and acknowledged; e.g form submit
            // only update interaction token, leave start and completed - an extra " is left from the regex
            cookieString = "itkn=" + this.uiTkn + existingCookie.substring(idx, existingCookie.length - 1);
        }
        // SE-53282 add security for https
        if (window.location.protocol == "https:")
            cookieString += ";secure";
        this.log("    " + cookieString);
        document.cookie = this.COOKIE_NAME + '=' + cookieString;
    };
    // remove start and completed data - leave token
    Statetracking.prototype.cleanCookie = function () {
        var cookieString = "itkn=" + this.uiTkn;
        if (window.location.protocol == "https:")
            cookieString += ";secure";
        this.log("cleanCookie() " + cookieString);
        document.cookie = this.COOKIE_NAME + '=' + cookieString;
    };
    Statetracking.prototype.deleteCookie = function () {
        this.log("deleteCookie()");
        document.cookie = this.COOKIE_NAME + "=";
    };
    /*
    * management functions
    */
    // on completion of a page loading, including adp etc., log time to server immediately
    Statetracking.prototype.logOnComplete = function (immediate) {
        this.log("logOnComplete(" + immediate + ")");
        this.logPALImmediate = immediate;
    };
    ;
    // export detailed state - for jsunit consumption only
    Statetracking.prototype.getCondition = function () {
        this.log("getCondition()");
        return { id: this.objId, busy: !(this.isIdle() && !this.isWorkPending()), counts: this.inFlightCounts, uiActionsCount: this.uiActionsCount, collectionInFlight: this.uiActionInFlight, action: this.actionTotals, logImmediate: this.logPALImmediate, completePalValue: this.completedTransactionForPAL, startClient: this.startClient };
    };
    ;
    /*
    * utilities
    */
    // iterate through and operate on properties on obj
    Statetracking.prototype.categoriesIter = function (obj, func) {
        var category;
        for (category in obj) {
            if (obj.hasOwnProperty(category) && typeof obj[category] !== 'function')
                func(obj, category);
        }
    };
    ;
    // find and return the document-statetracker div from the top window
    //	popup windows have their own document-statetracker - make life easy for Telerik
    Statetracking.prototype.getDocumentStateTracker = function () {
        var div = document.querySelector('.document-statetracker');
        if (!div) {
            this.log("pega.ui.statetracking.getDocumentStateTracker() - could not find local dst");
            var w = pega.desktop.support.getDesktopWindow();
            if (w) {
                div = w.document.querySelector('.document-statetracker');
                if (!div)
                    this.log("getDocumentStateTracker() - could not find top window dst");
            }
        }
        return div;
    };
    ;
    /*
    * Logging and debugging
    */
    Statetracking.prototype.logPALdetails = function (pre) {
        if (this.debug && window.console) {
            var lastPAL = "";
            if (this.completedTransactionForPAL != null) {
                var t = this.completedTransactionForPAL;
                lastPAL = " uiToken=" + t.uiTkn + ", duration=" + t.clientInteractionDuration + ", #actions=" + t.actionsCount + ", action=" + t.clientInteractionAction + ", net&srvr=" + t.netAndServerDuration + ", call#=" + t.serverCallCount + ", d's:";
                for (var _i = 0, _a = t.callDurations; _i < _a.length; _i++) {
                    var d = _a[_i];
                    lastPAL += " " + d;
                }
            }
            this.log(pre + "completed PAL data:" + lastPAL);
            var s = "";
            for (var _b = 0, _c = this.actionTotals.callDurations; _b < _c.length; _b++) {
                var d = _c[_b];
                s += " " + d;
            }
            //this.log(pre + "current PAL data; uiActionInFlight=" + this.uiActionInFlight + ", uiActionsCount=" + this.uiActionsCount + ",  firstActionComplete=" + this.firstActionComplete + ", interactionStartForPAL=" + this.interactionStartForPAL + ", call total="+this.actionTotals.httpBusyTotal+", durations="+s);
            this.log(pre + "current PAL data; uiActionInFlight=" + this.uiActionInFlight + ", uiActionsCount=" + this.uiActionsCount + ",  firstActionComplete=" + this.firstActionComplete + ", interactionStartForPAL=" + this.interactionStartForPAL + ", durations=" + s);
        }
    };
    ;
    Statetracking.prototype.counters_s = function () {
        return "inFlightC; Http=" + this.inFlightCounts.Http + ", ajaxPre=" + this.inFlightCounts.ajaxPre + ", ajaxPost=" + this.inFlightCounts.ajaxPost + ", Nav=" + this.inFlightCounts.Nav + ", Fmsbmt=" + this.inFlightCounts.Fmsbmt + ", Doc=" + this.inFlightCounts.Doc + ", Action=" + this.inFlightCounts.Action + ", LoadMgr=" + this.inFlightCounts.LoadMgr + ", ScriptLd=" + this.inFlightCounts.ScriptLd + ", css=" + this.inFlightCounts.css + ", other=" + this.inFlightCounts.other + ", procEng=" + this.inFlightCounts.procEng + ", offSync=" + this.inFlightCounts.offSync + ", workPending=" + this.workPending;
    };
    ;
    Statetracking.prototype.totals_s = function () {
        if (this.debug && window.console) {
            var p = " :";
            for (var _i = 0, _a = this.actionTotals.callDurations; _i < _a.length; _i++) {
                var d = _a[_i];
                p += " " + d;
            }
            //return "startClient; Busy=" + this.startClientBusy + ", Http=" + this.startHttpBusy + ", totalDuration=" + this.actionTotals.totalDuration + ", actionTotals.httpBusyTotal=" + this.actionTotals.httpBusyTotal + ", actionTotals.interactCounts=" + this.actionTotals.interactCounts + p;
            return "startClient; Busy=" + this.startClientBusy + ", Http=" + this.startHttpBusy + ", totalDuration=" + this.actionTotals.totalDuration + ", actionTotals.interactCounts=" + this.actionTotals.interactCounts + p;
        }
        else {
            return "";
        }
    };
    ;
    Statetracking.prototype.logCallbackIds = function () { if (this.debug && window.console) {
        console.log("    callbackIds; hungBusy=" + this.hungBusy_callbackId + ", resetIdle=" + this.resetIdle_callbackId);
    } };
    ;
    Statetracking.prototype.log = function (msg) { if (this.debug && window.console) {
        console.log("p.u.stk(" + this.objId + ")." + msg);
    } };
    ;
    Statetracking.prototype.logWarn = function (msg) { if (this.debug && window.console) {
        console.warn("pega.ui.statetracking(" + this.objId + ")." + msg);
    } };
    ;
    Statetracking.prototype.logErr = function (msg) { if (window.console) {
        console.error("pega.ui.statetracking(" + this.objId + ")." + msg);
    } };
    ;
    return Statetracking;
}());
//
// instancing - move out?
//
/***
statetracking should be a js singleton in root window only, with publishing div in root window only;
    bug-218279, cross-domain where-am-i makes this a bit messy, window.top crashes; if top not available, use local
    bug-230417, for popup child windows, pick up dst from desktop window

    for jsunit testing on rule form, do not want to use main browser instance. flag set in DST mock
***/
//console.log("pzpega_ui_doc_statetracking.js");
// if in jasmine under node, export constructor
if (typeof jasmineUnderNode != "undefined" && jasmineUnderNode === true) {
    module.exports = Statetracking;
}
else {
    // this line guarantues that a dst always exists. at the expense of an unecessary creation for iframes and some pop-up windows
    pega.ui.statetracking = new Statetracking();
    //console.log("created pega.ui.statetracking("+pega.ui.statetracking.getState().id+")");
    var myTopRef = {};
    myTopRef.pega = false;
    var dtw;
    if (typeof gIsMashupContent != "undefined") {
        if (gIsMashupContent != "true") {
            myTopRef = window.top;
            dtw = myTopRef.opener;
        }
    }
    else {
        myTopRef = window.top;
        dtw = myTopRef.opener; // assuming that this is NOT a mashup as the flag is not populated
    }
    try {
        if (myTopRef.pega && myTopRef.pega.ui && myTopRef.pega.ui.statetracking && (myTopRef.pega.ui.statetracking != pega.ui.statetracking)) {
            //console.warn("using pega.ui.statetracking("+myTopRef.pega.ui.statetracking.getState().id+") from window.top");
            pega.ui.statetracking = myTopRef.pega.ui.statetracking;
            // a cookie is used for sending performance data to server - needs the start action clearing - can only be here during doc load
            pega.ui.statetracking.cleanCookieToToken();
            // root dst may not be busy - but it really should be - use general category, clear in doc(initialise)
            // BUG-435996 - mDC tech uses form.submit for new/create, does not use doc load => no doc initialise to clear fudge-busy
            pega.ui.statetracking.setBusy("scriptLoadingFudge");
            // some MDC harnesses use form submit, need to clear on next harness load
            pega.ui.statetracking.setFormsubmitState("none");
        }
        if (dtw && dtw != null) {
            //console.warn("have window.opener reference");
            //if in popup window with no menubar, use parent dst, otherwise in tab (from launch in DS)
            if (myTopRef.menubar && myTopRef.menubar.visible && myTopRef.menubar.visible == false) {
                //console.warn("using pega.ui.statetracking("+dtw.pega.ui.statetracking.getState().id+") from desktop window");
                pega.ui.statetracking = dtw.pega.ui.statetracking;
            }
            else {
                // copy properties from root statetracker to this separate instance - can this path ever occur now? - flow in modal?
                if (dtw.pega.ui.statetracking != pega.ui.statetracking) {
                    //console.warn("using properties from desktop window pega.ui.statetracking("+dtw.pega.ui.statetracking.getState().id+")");
                    pega.ui.statetracking.logImmediatelyOnComplete(dtw.pega.ui.statetracking.getState().logImmediate);
                }
            }
        }
    }
    catch (ex) { }
}
//static-content-hash-trigger-GCC
