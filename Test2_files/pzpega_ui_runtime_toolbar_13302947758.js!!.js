pega.namespace("pega.ui");
// The editor is a singleton class which returns its public methods.
pega.ui.runtimeToolbar = (function () {

    /////////////////////////////////////////////////////////////////////////////////
    //                                  CONSTANTS                                  //
    /////////////////////////////////////////////////////////////////////////////////
    var PROD_NAME = 'Pega Developer Tools';
    var TOOLBAR_SELECTOR = "div[data-node-id='pzRuntimeToolsTopBar']";

    /////////////////////////////////////////////////////////////////////////////////
    //                                  GLOBALS                                    //
    /////////////////////////////////////////////////////////////////////////////////
    /* -- PRIVATE GLOBALS -- */
    var _mutationObserver = null;

    /* -- PUBLIC GLOBALS -- */
    var publicAPI = {};

    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @private Called on harness load to listen for the harness to be resized by panels
     */
    function _initialize() {
        // If in app studio then add the correct class
        if (document.querySelector("body > [data-portalharnessinsname].app-studio") && document.querySelector(TOOLBAR_SELECTOR)) {
            document.querySelector(TOOLBAR_SELECTOR).classList.add("app-studio");
        }
        // If orientation is not RTL then we want to handle the right panel
        if (!pega.u.d.isOrientationRTL()) {
            _mutationObserver = new MutationObserver(_handleMutation);
            _mutationObserver.observe(document.querySelector("body > [data-portalharnessinsname]"), {
                attributes: true
            });
        }
      
        _deactivate();
    }

    /**
     * @private Called on harness unload to clean up listener
     */
    function _nullify() {
        if (!pega.u.d.isOrientationRTL()) {
            _mutationObserver.disconnect();
            _mutationObserver = null;
        }
    }
  
    /**
     * @private Handles mutation of the harness
     * @param mutationsList list of mutations
     */
    function _handleMutation(mutationsList) {
        for(var x = 0; x < mutationsList.length; x++) {
            var mutation = mutationsList[x];
            // If the harness is changing its style, and its new right value is different from the toolbar then set them equal
            if (mutation.attributeName == "style" && 
                mutation.target.style.right !== document.querySelector(TOOLBAR_SELECTOR).style.right) {
                document.querySelector(TOOLBAR_SELECTOR).style.right = mutation.target.style.right;
            }
        }
    }
  
    /**
     * @private Called from toggle when activating the toolbar
     */
    function _activate() {
        var buttonList = document.querySelectorAll("div[data-node-id='pzRuntimeToolsTopBar'] button");
        [].forEach.call(buttonList, function (el) {
            el.removeAttribute("disabled");
            el.removeAttribute("tabindex");
        });
        var warnElem = document.createElement("div");
        warnElem.innerHTML = '<div id="aria-devtoolmsg" role="alert" style="position:absolute;pointer-events=none;opacity:0">' + PROD_NAME + ' is now open. Press enter to close.</div>';
        document.body.appendChild(warnElem.firstChild);
    }

    /**
     * @private Called from toggle when deactivating the toolbar
     */
    function _deactivate() {
        var buttonList = document.querySelectorAll("div[data-node-id='pzRuntimeToolsTopBar'] button");
        [].forEach.call(buttonList, function (el) {
            if (el && !el.firstChild.classList.contains("pi-gear")) {
                el.setAttribute("disabled", "true");
                el.setAttribute("tabindex", "-1");
            }
        });
        var warnElem = document.getElementById("aria-devtoolmsg");
        if (warnElem) {
            document.body.deleteChild(warnElem);
        }
    }
    

    /////////////////////////////////////////////////////////////////////////////////
    //                                 PUBLIC API                                  //
    /////////////////////////////////////////////////////////////////////////////////
    publicAPI.toggle = function() {
        var elem = document.querySelector(TOOLBAR_SELECTOR);
        if (elem) {
            // TODO: Would be nice to figure out how to make this generic for all tools
            if (elem.querySelector('.gapid_icon.active')) return;

            elem.classList.toggle("is-active");
            var gearIcon = elem.querySelector('.pzruntime-toolbar-gear i');
            if (gearIcon) {
                gearIcon.classList.toggle("pi-gear");
                gearIcon.classList.toggle("pi-times");
            }
            
            // If there are no buttons do not toggle
            var buttonList = elem.getElementsByTagName("button");
            if (buttonList == null || buttonList.length == 0) return;
            
            if (elem.classList.contains("is-active")) {
                _activate();
            } else {
                _deactivate();
            }
        }
    }
    
    pega.u.d.attachOnload(_initialize);
    pega.u.d.attachOnUnload(_nullify);
  
    return publicAPI;
}());
//static-content-hash-trigger-YUI