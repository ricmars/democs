var pega = pega || {};
pega.ui = pega.ui || {};
pega.ui.automation = pega.ui.automation || {};

/**
 * Constants module to hold any constants used in ui automation
 */
pega.ui.automation.constants = {
    COMPONENT_TYPE: "pyComponentType",
    DOM_SELECTOR: "pySelector",
    ASSERTIONS: "pyTestAssertions",
    COMPARATOR: "pyComparator",
    COMPARATOR_LIST: "pyComparatorList",
    NAVIGATORS: "pyTestNavigators",
    NAVIGATOR: "pyTestNavigator",
    NAVIGATOR_ACTION_NAME: "pyNavigatorActionName",
    NAVIGATOR_ACTION_VALUE: "pyNavigatorActionValue",
    ACTION_NAME: "pyNavigatorAction",
    IS_CUSTOM_STEP: "pyIsCustomStep",
    CUSTOM_TYPE: "pyCustomType",
    CASE_CLASS_NAME: "className",
    CASE_FLOW_NAME: "flowName",
    EVENTS: "events",

    //selector related constants
    SELECTOR: {
        NODE_NAME: "nodeName",
        PARENTS: "parents",
        INNERTEXT: "innerText",
        //List of attributes to consider while generating unique selector
        WHITELIST: ["data-test-id", "name", "node_name", "base_ref"],
        BLACKLIST: ["nodeName", "pxObjClass", "parents", "pyContainers"],
        CONTAINERS_BLACKLIST: ["[data-mdc-id='microdc']"]
    },

    STEP_RESULT: {
        STATUS: "status",
        PASSED: "passed",
        FAILED: "failed",
        FAILURE_REASON: "failureReason",
        SELECTOR: "selector",
        ACTUAL_VALUE: "actualValue",
        FAILURE_CODE: "internalFailureCode",
        FAILURE_TYPE: "failureType",
        FAILURE_CODES: {
            MACTHER: "Matcher not found",
            STEP: "Invalid step object",
            CODE: "Error in code"
        },
        FAILURE_TYPES: {
            NAVIGATOR: "Navigator",
            ASSERTOR: "Assertor",
            DOM: "Dom element not found",
            INTERNAL: "internal"
        }
    },

    STEP_TYPE: {
        IMPLICIT: "implicit",
        EXPLICIT: "explicit",
        CHANGE: "change"
    },

    ASSERTION_CUSTOM_NAME_SEPARATOR: "|",
    ASSERTION_CUSTOM_PARENT_LEVEL: ".",

    MATCHER_EQUAL: "equals",
    DATA_TEST_ID: "data-test-id",
    DATA_TEST_ID_KEY: "data_test_id",
    ATTRIBUTES: "pyAttributes",
    ACTIONS: "pyActions",
    IS_NAVIGATOR: "pyIsNavigator",
    IS_ASSERTOR: "pyIsAssertor",
    ATTRIBUTE_NAME: "pyAttributeName",
    ATTRIBUTE_VALUE: "pyAttributeValue",
    ATTRIBUTE_VALUE_LIST: "pyAttributeValueList",
    ATTRIBUTE_DESC: "pyAttributeDesc",
    EXPECTED_VALUE: "pyExpectedValue",
    OPTIONS_LENGTH: "optionlength",
    OPTION_CONTAINS: "optionshas",
    OPTIONS_DATA: "optiondata",
    COMPONENT_STEP_DATA: "componentData",
    COMPONENT_TARGET: "componentTarget",
    TEST_CASE_STEPS: "pyTestCaseSteps",
    TEST_STEP_NAME: "pyTestStepName",

    //Component names
    COMPONENT: {
        DEFAULT: "default",
        BUTTON: "pxButton",
        TEXT_INPUT: "pxTextInput",
        MENU_ITEM: "pxMenuItem",
        LABEL: "Label",
        MENUBAR: "menubar",
        DROPDOWN: "pxDropdown",
        TEXT_AREA: "pxTextArea",
        LINK: "pxLink",
        DISPLAY_TEXT: "pxDisplayText",
        CHECKBOX: "pxCheckbox",
        ICON: "pxIcon",
        AUTOCOMPLETE: "pxAutoComplete",
        RICH_TEXT_EDITOR: "pxRichTextEditor",

    },

    // Description for the custom components
    COMPONENT_DESC: {

    },

    // Component specific handlers
    HANDLER: {
        RECORDER: "recorder",
        STEP_BUILDER: "stepbuilderHandler",
        NAVIGATOR: "navigatorHandler",
        ASSERTOR: "assertorHandler",
        TRANSLATOR: "translatorHandler",
        INSPECTOR: "inspectorHandler"
    },

    IMPLICIT_ASSERTIONS: "implicitAssertions",
    IMPLICIT_NAVIGATIONS: "implicitNavigations",

    //Dom attribute notations
    ATTRIBUTE: {
        NAME: "@name",
        LABEL: "<label>",
        ERROR: ":error",
        TITLE: "@title",
        LIST: "List",
        DISABLE: "@disabled",
        REQUIRED: "@required",
        INNER_TEXT: ":contains",
        CLASS: "@class",
        VALUE: "@value",
        PLACEHOLDER: "@placeholder",
        VALIDATION: "@validationtype",
        STYLE: "@style",
        SRC: "@src",
        SMART_TIP: 'SmartTip'
    },

    ACTION_NAMES: {
        CHANGE: "change",
        CONTEXTMENU: "contextmenu"
    }
}
Object.freeze && Object.freeze(pega.ui.automation.constants);

/**
 * Utility module to hold any utility functions
 */
pega.ui.automation.utils = (function () {

    var _constants = pega.ui.automation.constants;
    /**
     *Returns the description of the component.
     *@param {String} componentName  The name of the component.
     *@return {String} componentDesc Description of the component.
     */
    function _getComponentDesc(componentName) {
        if (!componentName) {
            return "";
        }
        var componentDesc = pega.ui.automation.constants.COMPONENT_DESC[componentName];
        if (!componentDesc) {
            componentDesc = componentName;
            var prefix = componentDesc.substring(0, 2).toLowerCase();
            if (prefix === "px" || prefix === "py" || prefix === "pz") {
                componentDesc = componentDesc.slice(2);
            }
        }
        return componentDesc;
    }

    /**
     * Gets all dom elements fot the given selector object
     *
     * @param      {<type>}    selectorObj        The selector object
     * @param      {<type>}    findAccrossFrames  The find accross frames
     * @return     {Function}  All dom elements.
     */
    function _getAllDomElements(selectorObj, findAccrossFrames) {
        var selector = _constructSelector(selectorObj);
        var innerTextForSelector = selectorObj[pega.ui.automation.constants.SELECTOR.INNERTEXT];
        var domElements = null;

        var elementContextRoot = _getElementContextRootFromSelector(selectorObj);

        //domElements = elementContextRoot.querySelectorAll(selector);
        domElements = $(elementContextRoot).find(selector);

        var blacklistContainerElements = _getBlacklistContainerElements(elementContextRoot, selector);
        if (blacklistContainerElements && blacklistContainerElements.length > 0) {
            domElements = $(domElements).not(blacklistContainerElements);
        }

        /*BUG-385209 fix - need to check the node name of the element*/
        domElements = $(domElements).filter(function () { return selectorObj.nodeName ? this.nodeName == selectorObj.nodeName : true });
        if (innerTextForSelector) {
            //Inner text is present in querySelector
            //Filter elements whose innerText matches.
            domElements = $(domElements).filter(function () {
                return _getDomHTML(this) == innerTextForSelector;
            });
        }

        elementContextRoot = null;
        return domElements;
    }

    /**
     * Gets the unique dom element.
     *
     * @param      {<type>}    selectorObj  The selector object
     * @return     {Function}  The dom element.
     */
    function _getDomElement(selectorObj, switchContext) {
        var domElements = _getAllDomElements(selectorObj, true);
        var domElement = domElements ? domElements[0] : null;
        if (switchContext && domElement) {
            var context = pega.ctxmgr.getContextByTarget(domElement);
            if (context && context["pzHarnessID"]) {
                pega.ctxmgr.setCurrentHarnessContext(context["pzHarnessID"]);
            }
        }
        domElements = null;
        return domElement;
    }

    /**
     * Gets the dom element promise which internally checks for the element existance 
     * for each one second and three time max
     *
     * @param      {<type>}   selectorObj    The selector object
     * @param      {<type>}   switchContext  The switch context
     * @return     {Promise}  The dom element promise.
     */
    function _getDomElementPromise(selectorObj, switchContext) {
        var getDomElementPromise = new Promise(function (resolve, reject) {
            var domElement = _getDomElement(selectorObj, switchContext);
            if (domElement) {
                resolve(domElement);
            } else {
                var remainingTries = 2;
                var checkElementExistsInDom = setInterval(function () {
                    remainingTries--;
                    var domElement = _getDomElement(selectorObj, switchContext);
                    if (domElement || remainingTries == 0) {
                        clearInterval(checkElementExistsInDom);
                        resolve(domElement);
                    }
                }, 1000);
            }

        });

        return getDomElementPromise;
    }

    function _getElementContextRootFromSelector(selectorObj) {

        var elementContextRoot = document;

        if (selectorObj["pyContainers"]) {
            var containers = selectorObj["pyContainers"];

            for (var i = containers.length - 1; i >= 0; i--) {
                var container = containers[i];

                if (container["type"] == "iframe") {
                    elementContextRoot = _getVisiblePegaFrameDocument(elementContextRoot);
                } else if (container["type"] == "mdc") {
                    elementContextRoot = elementContextRoot.querySelector(container["querySelector"]);
                }
            }
        }

        return elementContextRoot;
    }

    function _getVisiblePegaFrameDocument(currentDocument) {

        var visibleIframes = $(currentDocument).find("iframe:visible");
        var frameDoc = null;
        for (var i = 0; i < visibleIframes.length; i++) {
            frameDoc = visibleIframes[i].contentDocument;
            if (!frameDoc.defaultView.pega) {
                //Do not consider non-pega frames
                continue;
            }
            break;
        }
        visibleIframes = null;
        return frameDoc;

    }
    /**
     * Construct dom query selector for the given selector object
     *
     * @param      {string}  selectorObj  The selector object
     * @return     {string}  { description_of_the_return_value }
     */
    function _constructSelector(selectorObj) {
        //var selector = selectorObj[pega.ui.automation.constants.SELECTOR_NODE_NAME];
        if (selectorObj && selectorObj["pyPath"]) {
            return selectorObj["pyPath"];
        }
        var selector = "";

        for (var key in selectorObj) {
            var value = selectorObj[key];
            if (key == pega.ui.automation.constants.DATA_TEST_ID_KEY) {
                key = pega.ui.automation.constants.DATA_TEST_ID;
            }
            if (pega.ui.automation.constants.SELECTOR.BLACKLIST.indexOf(key) > -1) {
                //Ignore if any blacklist keys contains in selector
                continue;
            }
            if (key == pega.ui.automation.constants.SELECTOR.INNERTEXT) {
                selector = selector + ":contains(\"" + value + "\")";
            } else {
                selector = selector + "[" + key + "=\"" + value + "\"]";
            }

        }

        var parentsSelectors = selectorObj[pega.ui.automation.constants.SELECTOR.PARENTS];
        if (parentsSelectors) {
            for (var i = 0; i < parentsSelectors.length; i++) {
                var parentObj = parentsSelectors[i];

                //var parentSelector = parentObj[pega.ui.automation.constants.SELECTOR_NODE_NAME];
                var parentSelector = "";

                for (var parentKey in parentObj) {
                    var parentValue = parentObj[parentKey];
                    if (parentKey == pega.ui.automation.constants.DATA_TEST_ID_KEY) {
                        parentKey = pega.ui.automation.constants.DATA_TEST_ID;
                    }
                    if (pega.ui.automation.constants.SELECTOR.BLACKLIST.indexOf(parentKey) > -1) {
                        continue;
                    }
                    parentSelector = parentSelector + "[" + parentKey + "=\"" + parentValue + "\"]";
                }

                selector = parentSelector + " " + selector;
            }
        }

        return selector;
    }

    /**
     * Finds element accross all iframes. 
     * If element found in visible iframe then returns it, otherwise return the first element found in invisible iframe
     **/
    function _findElementAcrossFrames(selector, innerTextForSelector, currentDocument) {
        // Two work objects opened in a case manager, verify this
        var frameDoc = null;
        currentDocument = currentDocument || _getPortalWindow().document;

        var frames = $(currentDocument).find("iframe:visible");
        var elements = null;
        for (var i = 0; i < frames.length; i++) {
            frameDoc = frames[i].contentDocument;
            if (!frameDoc || !frameDoc.defaultView.pega) {
                //Do not consider non-pega frames
                continue;
            }
            elements = $(frameDoc).find(selector + ":visible");

            if (innerTextForSelector != null && innerTextForSelector != undefined) {
                elements = $(elements).filter(function () {
                    return $(this).text() == innerTextForSelector;
                });
            }
            if (elements && elements.length > 0) {
                break;

            } else {
                elements = _findElementAcrossFrames(selector, innerTextForSelector, frameDoc);
                if (elements && elements.length > 0) {
                    break;
                }
            }
        }
        frameDoc = null;
        frames = null;
        return elements ? elements : [];
    }

    function _getPortalWindow(currentWindow) {
        currentWindow = currentWindow || window;

        if (currentWindow.pega && currentWindow.pega.u && currentWindow.pega.u.d && currentWindow.pega.u.d.isPortal && currentWindow.pega.u.d.isPortal()) {
            return currentWindow
        }
        while (currentWindow.pega && currentWindow.pega.u && currentWindow.pega.u.d && currentWindow.pega.u.d.isPortal && !currentWindow.pega.u.d.isPortal() && currentWindow != top) {
            //Iterate till current window is portal or top level
            if (currentWindow.parent.pega) {
                currentWindow = currentWindow.parent;
            } else {
                break;
            }

        }
        return currentWindow;
    }

    /**
     * Utility helper api to invoke api in async
     * First argument should contain api to be invoked
     * Other arguments are list of params that are passed to invoking api
     */
    function _invokeApi() {
        var args = Array.prototype.slice.call(arguments);
        var apiName = args.shift();

        //helper inner function to get actual reference from DOTS
        var _reduceObject = function (obj, i) {
            if (!obj) {
                return null;
            }
            return obj[i];
        };
        var functionRef = apiName.split(".").reduce(_reduceObject, window);
        if (args[3]) {
            var resumeFrom = args[3];
            args[3] = resumeFrom.split(".").reduce(_reduceObject, window);
        }
        setTimeout(function () {
            functionRef.apply(this, args);
        }, 1);
    }

    /**
     * Determines if element has given class.
     *
     * @param      {<type>}  element    The element
     * @param      {string}  className  The class name
     * @return     {string}  True if has class, False otherwise.
     */
    function _hasClass(element, className) {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    }

    /**
     * Gets the configured dom value.
     * If given attribute object has valid attribute name (either predefined or custom)
     * it returns the value by attribute name
     * 
     * else if attribute name is not present (case where user provides direct value in expectedValue or expectedValueList)
     * it gets the value from translator maps using attribute description.
     * In this, it recalculates the design options by sending the domElement and
     * returns the value against attributeDesc
     *
     * @param      {<type>}             componentName  The component name
     * @param      {<type>}             domElement     The dom element
     * @param      {string}             attrObj        The attribute object
     * @return     {(Function|string)}  The configured dom value.
     */
    function _getConfiguredDomValue(componentName, domElement, attrObj) {
        var attributeName = attrObj[pega.ui.automation.constants.ATTRIBUTE_NAME];
        var expectedValue = attrObj[pega.ui.automation.constants.EXPECTED_VALUE];
        var expectedValueList = attrObj[pega.ui.automation.constants.EXPECTED_VALUE_LIST];
        var attributeDesc = attrObj[pega.ui.automation.constants.ATTRIBUTE_DESC];
        var returnValue = "";
        if (!attributeName) {
            //Direct attribute value/list is provided
            if ((expectedValue != null && expectedValue != undefined) || (expectedValueList)) {
                configValue = pega.ui.automation.recorder.translator.getConfiguredValue(componentName, domElement, attributeDesc);
                returnValue = (configValue != null && configValue != undefined && configValue.trim) ? configValue.trim() : configValue;
            }
        } else {
            var isPredefinedAttributeName = attributeName.indexOf("@") == 0 || attributeName == pega.ui.automation.constants.ATTRIBUTE.INNER_TEXT || attributeName == pega.ui.automation.constants.ATTRIBUTE.LABEL || attributeName == pega.ui.automation.constants.ATTRIBUTE.ERROR;
            if (isPredefinedAttributeName) {
                //predefined attribute name
                returnValue = _getAttributeValue(domElement, attributeName);
            } else {
                var customAssertionNames = attributeName.split(pega.ui.automation.constants.ASSERTION_CUSTOM_NAME_SEPARATOR);
                if (customAssertionNames.length > 1) {
                    //Custom attribute name
                    returnValue = _getAssertedDomValue(domElement, attributeName);
                }
            }
        }
        return returnValue;
    }

    /**
     * Gets the attribute value for the given element and attribute name
     *
     * @param      {<type>}  domElement     The dom element
     * @param      {string}  attributeName  The attribute name
     * @return     {<type>}  The attribute value.
     */
    function _getAttributeValue(domElement, attributeName) {
        var value = attributeName;
        if (attributeName.indexOf("@") == 0) {
            value = null;
            var attributeName = attributeName.substring(1);
            if (attributeName === "value") {
                value = domUtils.getDOMElementValue(domElement);
            } else if (attributeName === "disabled") {
                value = domElement.getAttribute(attributeName) != null;
            } else if (attributeName === "required") {
                value = domElement.getAttribute("validationtype") && domElement.getAttribute("validationtype").indexOf("required") > -1;
            } else {
                value = domElement.getAttribute(attributeName);
            }
        } else if (attributeName == pega.ui.automation.constants.ATTRIBUTE.INNER_TEXT) {
            value = null;
            var attributeName = attributeName.substring(1);
            if (attributeName === "contains") {
                value = domElement.innerText;
            }
        } else if (attributeName == pega.ui.automation.constants.ATTRIBUTE.LABEL) {
            value = null;
            // Gets value from label element if the attribute name is label
            var cellElem = $(domElement).closest(".content-item")[0];
            if (cellElem) {
                if (_hasClass(cellElem, "dataLabelForRead") || _hasClass(cellElem, "dataLabelForWrite")) {
                    value = cellElem.innerText;
                } else {
                    var labelELem = cellElem.querySelector(".dataLabelForRead, .dataLabelForWrite");
                    if (labelELem) {
                        //Check if the label has a child span. If so, get the innerText of the first span element.
                        var spanElem = labelELem.getElementsByTagName("span");
                        if (spanElem && spanElem[0]) {
                            value = spanElem[0].innerText;
                        } else {
                            value = labelELem.innerText;
                        }
                    }
                }
            }
        } else if (attributeName == pega.ui.automation.constants.ATTRIBUTE.ERROR) {
            value = null;
            // Gets value from label element if the attribute name is label
            var cellElem = $(domElement).closest(".content-item")[0];
            if (cellElem) {
                errorSpan = cellElem.querySelector(".iconError");
                value = !!(errorSpan && $(errorSpan).is(":visible"));
            }
        }
        return (value != null && value != undefined && value.trim) ? value.trim() : value;

    }


    /**
     * Gets the asserted dom value for the given predefined/custom attributeName
     *
     * @param      {Function}           domElement     The dom element
     * @param      {(Function|number)}  attributeName  The attribute name
     * @return     {(Function|string)}  The asserted dom value.
     */
    function _getAssertedDomValue(domElement, attributeName) {
        if (!attributeName) {
            return "";
        }
        var currentElem = domElement;

        var customAssertionNames = attributeName.split(pega.ui.automation.constants.ASSERTION_CUSTOM_NAME_SEPARATOR);
        if (customAssertionNames.length > 1) {

            //If custom assertion name
            //Sample custom assertion name : ..|div:nth-child(1) div[class='hello'] img|@src

            //Attribute name at the end
            attributeName = customAssertionNames[customAssertionNames.length - 1];
            //Query selector in middle
            var querySelector = customAssertionNames[customAssertionNames.length - 2];
            if (customAssertionNames.length == 3) {
                //Dots stands for parents level
                var parentLevels = customAssertionNames[0].split(pega.ui.automation.constants.ASSERTION_CUSTOM_PARENT_LEVEL).length - 1;
                for (var i = 0; i < parentLevels; i++) {
                    currentElem = currentElem.parentElement;
                }
            }
            if (querySelector) {
                currentElem = currentElem.querySelector(querySelector);
            }
        }

        return currentElem ? _getAttributeValue(currentElem, attributeName) : null;
    }

    function _generateSelector(domElement, customAttributes) {
        var elementContextRoot = _getElementContextRoot(domElement);

        var selectorObj = _generateSelectorObject(domElement, customAttributes, elementContextRoot);

        elementContextRoot = null;

        if (!selectorObj) {
            return null;
        }
        var containers = _getContainersInfo(domElement);
        if (containers && containers.length > 0) {
            selectorObj["pyContainers"] = containers;
        }
        return selectorObj;

    }

    function _getDomHTML(domElement) {
        var domContent = domElement.innerHTML;
        if (domElement.tagName === "INPUT") {
            domContent = $(domElement).text();
        }
        return domContent;
    }

    function _isALeafNode(domElement) {
        return !domElement.firstElementChild;
    }

    function _generateSelectorObject(domElement, customAttributes, elementContextRoot) {

        var selector = "";
        var selectorObj = {};
        //storing node name 
        selectorObj[_constants.SELECTOR.NODE_NAME] = domElement.nodeName;

        var customInnerText = null;
        var customInnerTextSelector = null;
        var customSelectorAttributes = [];
        if (customAttributes && Array.isArray(customAttributes)) {
            customSelectorAttributes = customAttributes.slice(0);
        } else {
            console.log("Invalid custom attributes defined: ", customAttributes);
        }

        var innerTextIndex = customSelectorAttributes.indexOf(_constants.SELECTOR.INNERTEXT);
        if (innerTextIndex > -1) {
            if (_isALeafNode(domElement)) {
                //innerText is defined as custom attribute, store innerText and innerText selector to consider later part of
                //selector generation
                customSelectorAttributes.splice(innerTextIndex, 1);
                customInnerTextSelector = ":contains(\"" + _getDomHTML(domElement) + "\")";
                customInnerText = _getDomHTML(domElement);
            } else {
               console.warn("innerText won't be considered while generating unique selector as the target element is not a leaf node");
            }
    }
        

        // get all qualified attributes for generating selector object
        var qualifiedAttributesForSelector = _getFilteredElementAttributes(domElement.attributes, customSelectorAttributes);

        if (qualifiedAttributesForSelector[_constants.DATA_TEST_ID]) {
            //consider data-test-id if present
            selector = "[" + _constants.DATA_TEST_ID + "=\"" + qualifiedAttributesForSelector[_constants.DATA_TEST_ID] + "\"]";
            selectorObj[_constants.DATA_TEST_ID_KEY] = qualifiedAttributesForSelector[_constants.DATA_TEST_ID];
            //remove data-test-id entry as it is being considered already
            delete qualifiedAttributesForSelector[_constants.DATA_TEST_ID];
            if (_isUniqueSelector(selector, null, elementContextRoot)) {
                //unique selector found with data-test-id
                return selectorObj;
            }
        }

        //consider all qualified attributes - includes whitelisted attributes and custom attributes
        for(var qualifiedAttr in qualifiedAttributesForSelector) {
            if(qualifiedAttributesForSelector.hasOwnProperty(qualifiedAttr)) {
            selector = selector + "[" + qualifiedAttr + "=\"" + qualifiedAttributesForSelector[qualifiedAttr] + "\"]";
            selectorObj[qualifiedAttr] = qualifiedAttributesForSelector[qualifiedAttr];

            delete qualifiedAttributesForSelector[qualifiedAttr];

            if (_isUniqueSelector(selector, null, elementContextRoot)) {
                //unique selector found with whitelist attribute
                return selectorObj;
            }
          }
        }

        // No unique element found with qualified attributes

        //consider innerText selector from custom attributes
        if (customInnerText) {
            // consider innerText along with custom attributes
            var selectorWithInnerText = selector + customInnerTextSelector;
            if (_isUniqueSelector(selectorWithInnerText, customInnerText, elementContextRoot)) {
                //unique element found with innertext along with custom attributes
                selectorObj[_constants.SELECTOR.INNERTEXT] = customInnerText;
                return selectorObj;
            }

            // No unique element found with innerText combination as well
            // append innerText selector if there are some qualified attributes present in the dom element
            // When there are no attributes present, no use of adding innerText as we won't get the exact dom ref
            if (selector !== "") {
                //selector has some valid attributes, append customInnerTextSelector as well to them
                selector = selector + customInnerTextSelector;
            }
        }
        

        // No unique element found with attributes on the dom and innerText
        if (selector === "") {
            // no dom attributes considered to selector
            console.warn("Make sure target element has valid attributes to generate selector");
            return null;
        }

        //Still unique selector not found. Consider parent elements
        var currentElement = domElement;
        var parentElement = currentElement.parentElement;
        var uniqueSelectorFound = false;
        var filteredElementAttributes = {};
        while (parentElement != null && parentElement != document.body) {
            i = 0;
            selectorObj[_constants.SELECTOR.PARENTS] = selectorObj[_constants.SELECTOR.PARENTS] || [];
            var parentObj = {};
            parentObj[_constants.SELECTOR.NODE_NAME] = parentElement.nodeName;

            var parentSelector = "";
            //get all filtered dom attributes to consider
            filteredElementAttributes = _getFilteredElementAttributes(parentElement.attributes, customSelectorAttributes);

            for (var filteredAttr in filteredElementAttributes) {
               if(filteredElementAttributes.hasOwnProperty(filteredAttr)) {
                parentSelector = parentSelector + "[" + filteredAttr + "=\"" + filteredElementAttributes[filteredAttr] + "\"]";
                if (filteredAttr == _constants.DATA_TEST_ID) {
                    parentObj[_constants.DATA_TEST_ID_KEY] = filteredElementAttributes[filteredAttr];
                } else {
                    parentObj[filteredAttr] = filteredElementAttributes[filteredAttr];
                }

                var currentSelector = parentSelector + " " + selector;
                if (_isUniqueSelector(currentSelector, null, elementContextRoot)) {
                    uniqueSelectorFound = true;
                    break;
                }
              }
            }

            if (parentSelector) {
                // Storing current parent element attributes
                selectorObj[_constants.SELECTOR.PARENTS].push(parentObj);
                selector = parentSelector + " " + selector;
            }
            if (uniqueSelectorFound) {
                // unique selector found with current parent element.
                break;
            }

            parentElement = parentElement.parentElement;
        }
        currentElement = null;
        parentElement = null;
        filteredElementAttributes = null;

        if (uniqueSelectorFound) {
            //Unique selector found with parents element references. 
            //Optimise if parents are more than one
            if (selectorObj[_constants.SELECTOR.PARENTS].length > 1) {
                selectorObj = _optimiseSelector(selectorObj);
            }

            return selectorObj;
        }
    }

    function _getContainersInfo(domElement) {
        var containers = [];
        var continerObj = null;

        var currentElement = domElement;
        var mdcContainer = _getMicroDCRoot(currentElement);

        while (mdcContainer) {
            //element is present inside micro dc
            continerObj = {};
            continerObj["type"] = "mdc";
            continerObj["querySelector"] = "[data-mdc-recordid].show";

            containers.push(continerObj);
            currentElement = mdcContainer;

            mdcContainer = _getMicroDCRoot(currentElement.parentElement);
        }

        var portalWindow = _getPortalWindow(currentElement.ownerDocument.defaultView);

        while (currentElement && currentElement.ownerDocument.defaultView != portalWindow) {

            var frameElement = currentElement.ownerDocument.defaultView.frameElement;

            if (frameElement) {
                continerObj = {};
                continerObj["type"] = "iframe";
                //TODO : Populate any other information if needed
                containers.push(continerObj);

                currentElement = frameElement;
            }

            mdcContainer = _getMicroDCRoot(currentElement);
            while (mdcContainer) {
                //element is present inside micro dc
                continerObj = {};
                continerObj["type"] = "mdc";
                continerObj["querySelector"] = "[data-mdc-recordid].show";

                containers.push(continerObj);

                currentElement = mdcContainer;
                mdcContainer = _getMicroDCRoot(currentElement.parentElement);
            }
        }
        currentElement = null;
        return containers;
    }

    function _getMicroDCRoot(domElement) {
        if (!domElement) {
            return null;
        }
        return $(domElement).closest("[data-mdc-recordid].show")[0];
    }

    /**
     * Gets the map of filtered dom attributes and values which matches with whitelist and custom attributes
     *
     * @param      {<type>}  elementAttributes  The element attributes
     * @param      {<type>}  customAttributes  The custom attributes
     */
    function _getFilteredElementAttributes(elementAttributes, customAttributes) {

        var filteredElementAttributes = {};
        var tmpElementAttributesMap = {};

        for (var i = 0; i < elementAttributes.length; i++) {
            if (elementAttributes[i].name == "name" && elementAttributes[i].value.indexOf("_") > -1) {
                //do not consider name attribute whose value has _ in it, these are expected to change
                //mostly counters
                continue;
            }
            if (elementAttributes[i].name == "base_ref" && _isBaseRefContainsParamDP(elementAttributes[i].value)) {
                //ignoring base refs which contains param dp 
                continue;
            }
            tmpElementAttributesMap[elementAttributes[i].name] = elementAttributes[i].value;
        }
        for (i = 0; i < _constants.SELECTOR.WHITELIST.length; i++) {
            // add all whitelist attributes if they are present in the element
            var attributeName = _constants.SELECTOR.WHITELIST[i];
            if (tmpElementAttributesMap[attributeName] != undefined && tmpElementAttributesMap[attributeName] != null) {
                filteredElementAttributes[attributeName] = tmpElementAttributesMap[attributeName];
            }
        }

        if (customAttributes) {
            for (i = 0; i < customAttributes.length; i++) {
                // add all custom attributes
                var attributeName = customAttributes[i];
                if (tmpElementAttributesMap[attributeName] != undefined && tmpElementAttributesMap[attributeName] != null) {
                    filteredElementAttributes[attributeName] = tmpElementAttributesMap[attributeName];
                }
            }
        }

        tmpElementAttributesMap = null;
        return filteredElementAttributes;
    }

    function _isBaseRefContainsParamDP(baseRef) {
        return baseRef && baseRef.search(/_pa\d+pz\./g) > -1;
    }

    /**
     * Determines if in whitelisted attributes or in custom attributes
     *
     * @param      {<type>}   attributeName     The attribute name
     * @param      {string}   customAttributes  The custom attributes
     * @return     {boolean}  True if in whitelisted attributes, False otherwise.
     */
    function _isInWhitelistedAttributes(attribute, customAttributes) {
        if (attribute.name == "name" && attribute.value.indexOf("_") > -1) {
            return false;
        }
        if (_constants.SELECTOR.WHITELIST.indexOf(attribute.name) != -1 || (customAttributes && customAttributes.indexOf(attribute.name) != -1)) {
            return true;
        }
        return false;

    }

    function _getBlacklistContainerElements(elementContextRoot, selector) {

        var excludeContainersSelector = "";
        for (var i = 0; i < _constants.SELECTOR.CONTAINERS_BLACKLIST.length; i++) {
            excludeContainersSelector = excludeContainersSelector + _constants.SELECTOR.CONTAINERS_BLACKLIST[i] + " " + selector;
            if (i < _constants.SELECTOR.CONTAINERS_BLACKLIST.length - 1) {
                excludeContainersSelector = excludeContainersSelector + ",";
            }
        }
        return $(elementContextRoot).find(excludeContainersSelector);
    }

    function _getElementContextRoot(domElement) {
        var elementContextRoot = domElement.ownerDocument;
        var mdcRoot = _getMicroDCRoot(domElement);
        if (mdcRoot) {
            elementContextRoot = mdcRoot;
        }
        mdcRoot = null;
        return elementContextRoot;
    }

    function _isUniqueSelector(selector, innerText, elementContextRoot, domElement) {

        if (!selector) {
            return false;
        }
        if (domElement && !elementContextRoot) {
            elementContextRoot = _getElementContextRoot(domElement);
        }

        //var domElements = elementContextRoot.querySelectorAll(selector);
        var domElements = $(elementContextRoot).find(selector);

        var blacklistContainerElements = _getBlacklistContainerElements(elementContextRoot, selector);
        if (blacklistContainerElements && blacklistContainerElements.length > 0) {
            domElements = $(domElements).not(blacklistContainerElements);
        }

        if (innerText !== null && innerText !== undefined) {
            //If it has innerHTML, consider exact inner text
            domElements = $(domElements).filter(function () {
                return _getDomHTML(this) === innerText;
            });
        }

        if (domElements && domElements.length == 1) {
            return true;
        }
        return false;
    }


    /**
     * Determines if unique element found with current selector object
     *
     * @param      {<type>}   optimisedStepObj  The optimised step object
     * @return     {boolean}  True if unique element found, False otherwise.
     */
    function _isUniqueElementFound(optimisedStepObj) {
        var domElements = _getAllDomElements(optimisedStepObj);
        if (domElements && domElements.length == 1) {
            //Unique element found with combination
            return true;

        }
        return false;
    }

    /**
     * Optimise given selector object and returns.
     * Considers target element and top level parent along with different combination of parents 
     * exists in the parents array
     * Determine on which combination unique element is present and returns that combination
     *
     * @param      {<type>}  selectorObj  The selector object
     * @return     {<type>}  { description_of_the_return_value }
     */
    function _optimiseSelector(selectorObj) {
        //Cloning : only variables and not any functions in your object
        var optimisedStepObj = JSON.parse(JSON.stringify(selectorObj));
        optimisedStepObj[_constants.SELECTOR.PARENTS] = [];
        var parentsRefs = selectorObj[_constants.SELECTOR.PARENTS];

        //Push top level parent
        optimisedStepObj[_constants.SELECTOR.PARENTS].push(parentsRefs[parentsRefs.length - 1]);
        //Checks if unique element found with target element and top level parent element
        var isOptimisedFound = _isUniqueElementFound(optimisedStepObj);

        if (!isOptimisedFound) {
            //Multiple elements found with top level parent combination
            //So get the optimised combination
            optimisedStepObj[_constants.SELECTOR.PARENTS] = [];
            isOptimisedFound = _getOptimisedParentsCombination(optimisedStepObj, parentsRefs);
        }
        if (isOptimisedFound) {
            selectorObj = optimisedStepObj;
        }
        domElements = null;
        return selectorObj;
    }

    /**
     * Gets the optimised parents combination.
     *
     * @param      {<type>}              optimisedStepObj  The optimised step object
     * @param      {<type>}              parentsRefs       The parents references
     * @return     {(Function|boolean)}  The optimised parents combination.
     */
    function _getOptimisedParentsCombination(optimisedStepObj, parentsRefs) {
        var isFound = false;

        function isCombinationFound(start, depth, previosCombination) {
            for (var i = start; i < parentsRefs.length - 1; i++) {

                var nextCombination = previosCombination.slice(0);
                nextCombination.push(parentsRefs[i]);
                if (depth > 0) {
                    //Recursively call to get different combinations with depth
                    if (isCombinationFound(i + 1, depth - 1, nextCombination)) {
                        break;
                    }

                } else {
                    //Check if this combination gives unique element
                    //Always push top level parent
                    nextCombination.push(parentsRefs[parentsRefs.length - 1]);
                    optimisedStepObj[_constants.SELECTOR.PARENTS] = nextCombination.slice(0);
                    //console.log(nextCombination);
                    if (_isUniqueElementFound(optimisedStepObj)) {
                        isFound = true;
                        //console.log("isUniqueElementFound");
                        break;
                    }
                }
            }

            return isFound;
        }

        for (var ind = 0; ind < parentsRefs.length; ind++) {
            isFound = isCombinationFound(0, ind, []);
            if (isFound) {
                break;
            }
        }
        return isFound;
    }

    function _focusSelectedStep(evt) {
        var elems = document.querySelectorAll('[data-node-id=pyFunctionalTestStepRow]')
        for (var index = 0; index < elems.length; index++) {
            elems[index].style = "";
        }
        evt.target.closest('[data-node-id=pyFunctionalTestStepRow]').style = "background-color: #D6F1FB;";
    }

    function _makeOverlayVisible(cssclass) {
        if (cssclass && cssclass !== '') {
            var overlaydiv = $("." + cssclass).closest("div.overlayPO")[0];
            if (overlaydiv)
                overlaydiv.style.zIndex = 100000;
        }
    }

    return {
        getDomElement: _getDomElement,
        getDomElementPromise: _getDomElementPromise,
        getAllDomElements: _getAllDomElements,
        getAssertedDomValue: _getAssertedDomValue,
        getConfiguredDomValue: _getConfiguredDomValue,
        constructSelector: _constructSelector,
        generateSelector: _generateSelector,
        isUniqueSelector: _isUniqueSelector,
        getContainersInfo: _getContainersInfo,
        hasClass: _hasClass,
        findElementAcrossFrames: _findElementAcrossFrames,
        invokeApi: _invokeApi,
        getAttributeValue: _getAttributeValue,
        getComponentDesc: _getComponentDesc,
        getPortalWindow: _getPortalWindow,
        focusSelectedStep: _focusSelectedStep,
        makeOverlayVisible: _makeOverlayVisible
    }

})();
//static-content-hash-trigger-YUI
/**
 * Manager module to register and get any component specific handler
 */
pega.ui.automation.manager = (function() {

    //Map to hold all component specific handlers
    var componentConfigData = {};

    var _constants = pega.ui.automation.constants;

    //List of components supported for automation
    //Add any new component here

    componentConfigData[_constants.COMPONENT.DEFAULT] = {};
    componentConfigData[_constants.COMPONENT.BUTTON] = {};
    componentConfigData[_constants.COMPONENT.TEXT_INPUT] = {};
    componentConfigData[_constants.COMPONENT.MENU_ITEM] = {};
    componentConfigData[_constants.COMPONENT.LABEL] = {};
    componentConfigData[_constants.COMPONENT.DROPDOWN] = {};
    componentConfigData[_constants.COMPONENT.AUTOCOMPLETE] = {};
    componentConfigData[_constants.COMPONENT.RICH_TEXT_EDITOR] = {};

    function _getRecorder(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.RECORDER]) {
            return componentConfigData[componentType][_constants.HANDLER.RECORDER];
        }
        return componentConfigData[_constants.COMPONENT.DEFAULT][_constants.HANDLER.RECORDER];
    }


    function _registerRecorder(componentType, componentRecorder) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.RECORDER] = componentRecorder;
    }

    /**
     * Gets the registered navigator.
     *
     * @param      {<type>}  componentType  The component type
     * @return     {<type>}  The navigator.
     */
    function _getNavigator(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.NAVIGATOR]) {
            return componentConfigData[componentType][_constants.HANDLER.NAVIGATOR];
        }
        return componentConfigData[_constants.COMPONENT.DEFAULT][_constants.HANDLER.NAVIGATOR];
    }

    /**
     * Register navigator for the given component type
     *
     * @param      {<type>}  componentType       The component type
     * @param      {<type>}  componentNavigator  The component navigator
     */
    function _registerNavigator(componentType, componentNavigator) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.NAVIGATOR] = componentNavigator;
    }

    /**
     * Gets the registered assertor.
     *
     * @param      {<type>}  componentType  The component type
     * @return     {<type>}  The assertor.
     */
    function _getAssertor(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.ASSERTOR]) {
            return componentConfigData[componentType][_constants.HANDLER.ASSERTOR];
        }
        return componentConfigData[_constants.COMPONENT.DEFAULT][_constants.HANDLER.ASSERTOR];
    }

    /**
     * Register assertor for the given component type
     *
     * @param      {<type>}  componentType      The component type
     * @param      {<type>}  componentAssertor  The component assertor
     */
    function _registerAssertor(componentType, componentAssertor) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.ASSERTOR] = componentAssertor;

    }

    /**
     * Gets the registered stepbuilder.
     *
     * @param      {<type>}  componentType  The component type
     * @return     {<type>}  The stepbuilder.
     */
    function _getStepbuilder(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.STEP_BUILDER]) {
            return componentConfigData[componentType][_constants.HANDLER.STEP_BUILDER];
        }
        return null;
    }

    /**
     * Register stepbuilder for the given component type
     *
     * @param      {<type>}  componentType         The component type
     * @param      {<type>}  componentStepbuilder  The component stepbuilder
     */
    function _registerStepbuilder(componentType, componentStepbuilder) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.STEP_BUILDER] = componentStepbuilder;
    }

    /**
     * Gets all supported components.
     *
     * @return     {string}  All supported components.
     */
    function _getAllSupportedComponents() {
        var allComponents = Object.keys(componentConfigData);
        var defaulCompIndex = allComponents.indexOf(_constants.COMPONENT.DEFAULT);
        allComponents.splice(defaulCompIndex, 1);
        return allComponents;
    }

    /**
     * Gets the registered translator.
     *
     * @param      {<type>}  componentType  The component type
     * @return     {<type>}  The translator.
     */
    function _getTranslator(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.TRANSLATOR]) {
            return componentConfigData[componentType][_constants.HANDLER.TRANSLATOR];
        }
        return null;
    }

    /**
     * Register translator for the given component type
     *
     * @param      {<type>}  componentType        The component type
     * @param      {<type>}  componentTranslator  The component translator
     */
    function _registerTranslator(componentType, componentTranslator) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.TRANSLATOR] = componentTranslator;

    }

    function _getEvents(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.EVENTS]) {
            return componentConfigData[componentType][_constants.EVENTS];
        }
        return null;
    }

    function _getInspector(componentType) {
        if (componentConfigData[componentType] && componentConfigData[componentType][_constants.HANDLER.INSPECTOR]) {
            return componentConfigData[componentType][_constants.HANDLER.INSPECTOR];
        }
        return null;
    }

    function _registerInspector(componentType, componentInspector) {
        componentConfigData[componentType] = componentConfigData[componentType] || {};
        componentConfigData[componentType][_constants.HANDLER.INSPECTOR] = componentInspector;

    }

    function _getAllComponentInspectorConfigs() {
        var componentInspectors = [];
        for (var componentType in componentConfigData) {
            if (componentConfigData[componentType][_constants.HANDLER.INSPECTOR]) {
                componentInspectors.push(componentConfigData[componentType][_constants.HANDLER.INSPECTOR]);
            }
        }
        return componentInspectors;
    }

    function _registerComponent(componentObj) {

        var componentType = componentObj.type;
        if (!componentObj.type) {
            console.error("type not found in componenetObj ", componentObj);
            return;
        }
        componentConfigData[componentType] = {};
        // Capture events
        if (componentObj.events) {
            componentConfigData[componentType][_constants.EVENTS] = componentObj.events;
        }

        if (!componentObj.handlers) {
            return;
        }

        if (componentObj.handlers.recorder) {
            _registerRecorder(componentType, componentObj.handlers.recorder);
        }

        if (componentObj.handlers.stepbuilder) {
            _registerStepbuilder(componentType, componentObj.handlers.stepbuilder);
        }

        if (componentObj.handlers.translator) {
            _registerTranslator(componentType, componentObj.handlers.translator);
        }

        if (componentObj.handlers.navigator) {
            _registerNavigator(componentType, componentObj.handlers.navigator);
        }

        if (componentObj.handlers.asserter) {
            _registerAssertor(componentType, componentObj.handlers.asserter);
        }

        if (componentObj.handlers.inspector) {
            _registerInspector(componentType, componentObj.handlers.inspector);
        }
    }

    /**
     * Registers a sub component which is created from parent component
     * Extends all the modules from parent component type
     *
     * @param      {<type>}  subComponentType     The sub component type
     * @param      {string}  parentComponentType  The parent component type
     */
    function _registerSubComponent(subComponentType, parentComponentType) {
        if (!subComponentType || !parentComponentType) {
            return;
        }
        if (!componentConfigData[parentComponentType]) {
            console.log("No prent component type exists with :"+parentComponentType);
            return;
        }
        if (_getRecorder(parentComponentType)) {
            _registerRecorder(subComponentType, Object.create(_getRecorder(parentComponentType)));
        }
        if (_getStepbuilder(parentComponentType)) {
            _registerStepbuilder(subComponentType, Object.create(_getStepbuilder(parentComponentType)));
        }
        if (_getTranslator(parentComponentType)) {
            _registerTranslator(subComponentType, Object.create(_getTranslator(parentComponentType)));
        }
        if (_getNavigator(parentComponentType)) {
            _registerNavigator(subComponentType, Object.create(_getNavigator(parentComponentType)));
        }
        if (_getAssertor(parentComponentType)) {
            _registerAssertor(subComponentType, Object.create(_getAssertor(parentComponentType)));
        }
        if (_getInspector(parentComponentType)) {
            _registerInspector(subComponentType, Object.create(_getInspector(parentComponentType)));
        }
        
    }


  /*
    * @param type Type of the component eq., pxButton, pxLink or ModalButton etc., it will be shown as info while creating test-case.
    * @param selector Default recorder will search for data-ui-meta -> subtype
    * example:
    * {
        "type": "DialogContent",
        "subType": "DialogContent"
    }
    */
   function _registerTextComponent(type, selector) {
    var textComponentStepBuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: ":contains"
        }
    });

    var textComponent = {};
    textComponent.type = type;
    textComponent.handlers = {};
    textComponent.handlers["stepbuilder"] = textComponentStepBuilder;
    if (selector) {
        textComponent.handlers["inspector"] = {};
        textComponent.handlers["inspector"].selector = selector;
        textComponent.handlers["inspector"].selectorcb = function() {
            return {
                "type": type,
                "subType": type
            };
        };
    }
   _registerComponent(textComponent);
  }

    /**
    * 
    * @param type Type of the component eq., pxButton, pxLink or ModalButton etc., it will be shown as info while creating test-case.
    * @param selector Default recorder will search for data-ui-meta -> subtype
    * example:
    * {
        "type": "DialogContent",
        "subType": "DialogContent"
    }
    */
    function _registerButtonComponent(type, selector) {
        var btnComponentStepBuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
            implicitAssertions: {
                value: ":contains"
            }
        });

        btnComponentStepBuilder.getTargetElement = function(domElement) {
          console.log("Invoking custom button stepbuilder");
          if (domElement.nodeName === "BUTTON") {
            return domElement;
          }
        return domElement.querySelector("button");
        };
    
        var btnComponent = {};
        btnComponent.type = type;
        btnComponent.handlers = {};
        btnComponent.handlers["stepbuilder"] = btnComponentStepBuilder;
        if (selector) {
            btnComponent.handlers["inspector"] = {};
            btnComponent.handlers["inspector"].selector = selector;
            btnComponent.handlers["inspector"].selectorcb = function() {
                return {
                    "type": type,
                    "subType": type
                };
            };
        }
        _registerComponent(btnComponent);
    }
    /**
     * API to register simple custom component. Mainly used for components which have simple assertions
     * or navigations.
     *
     * @param  JSON componentConfigs  The component configs
     * JSON param object should have valid component type, selector to highlight and either assertions or actions
     */
    function _registerSimpleCustomComponent(componentConfigs) {
        if (!componentConfigs.type) {
            console.error("component type is required: ", componentConfigs);
            return;
        }
        if (!componentConfigs.highlightSelector) {
            console.error("component highlightSelector is required: ", componentConfigs);
            return;
        }
        if (!((componentConfigs.assertions && componentConfigs.assertions.length > 0) || (componentConfigs.actions && componentConfigs.actions.length > 0))) {
            console.error("component should have either assertions or actions defained: ", componentConfigs);
            return;
        }

        var simpleComponentDetails = new SimpleComponent(componentConfigs.type, componentConfigs.highlightSelector, componentConfigs.uniqueElementSelector, componentConfigs.assertions, componentConfigs.actions);

        _registerComponent(simpleComponentDetails);


    }

    function SimpleComponent(type, highlightSelector, uniqueElementSelector, assertions, actions) {
        this.type = type;
        var simpleHandlers = {};
        this.handlers = simpleHandlers;

        simpleHandlers.inspector = {};
        simpleHandlers.inspector.selector = highlightSelector;
        simpleHandlers.inspector.selectorcb = function() {
            return {
                "type": type,
                "subType": type
            }
        }

        var implAssertions = assertions && assertions.length > 0 ? Object.keys(assertions) : null;
        var implNavigation = actions && actions.length > 0 ? Object.keys(actions) : null;

        if (implAssertions || implNavigation) {
            var translator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
            translator.buildConfigs = function() {
                return assertions;
            }
            simpleHandlers.translator = translator;

            var stepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
                implicitAssertions: {
                    value: implAssertions
                },
                implicitNavigations: {
                    value: implNavigation
                }

            });
            if (uniqueElementSelector) {
                stepbuilder.customQuerySelector = uniqueElementSelector;
            }
            simpleHandlers.stepbuilder = stepbuilder;
        }

    }

    return {
        getRecorder: _getRecorder,
        registerRecorder: _registerRecorder,
        getNavigator: _getNavigator,
        registerNavigator: _registerNavigator,
        getAssertor: _getAssertor,
        registerAssertor: _registerAssertor,
        getStepbuilder: _getStepbuilder,
        registerStepbuilder: _registerStepbuilder,
        getAllSupportedComponents: _getAllSupportedComponents,
        getTranslator: _getTranslator,
        registerTranslator: _registerTranslator,
        getInspector: _getInspector,
        registerInspector: _registerInspector,
        registerComponent: _registerComponent,
        registerSubComponent: _registerSubComponent,
        registerSimpleCustomComponent: _registerSimpleCustomComponent,
        registerTextComponent: _registerTextComponent,
        registerButtonComponent: _registerButtonComponent,
        getAllComponentInspectorConfigs: _getAllComponentInspectorConfigs,
        getEvents: _getEvents
    }


})();
//static-content-hash-trigger-YUI
/*
    Store manager uses session storage to store data like current testcase, step ,
     testcase list, executor status etc..
 */
pega.ui.automation.storeManager = (function() {
    var _currentTestCaseAndStep = "currentTestCaseAndStep";
    var rerunTestCaseList = [];
    var _getTestCaseFromLocalStore = function(testCaseId) {
        if (testCaseId) {
            var testData = sessionStorage.getItem("TestCase-" + testCaseId);
            testData = JSON.parse(testData);
            return testData;
        }
        return null;
    };
    var _putTestCaseInLocalStore = function(testData) {
        if (testData && testData.id) {
            var testCaseId = testData.id;
            sessionStorage.setItem("TestCase-" + testData.id, JSON.stringify(testData));
            _setCurrentTestCase(testCaseId);
            return true;
        }
        return false;
    };

    var _updateCurrentTestCaseStep = function(index, stepObject) {
        var testCase = _getCurrentTestCase(),
            testCaseData = _getTestCaseFromLocalStore(testCase),
            testCaseSteps = testCaseData.pyTestCaseSteps;

        if(index <= testCaseSteps.length) {
            testCaseSteps.splice(index - 1, 0, stepObject);
        }
        _putTestCaseInLocalStore(testCaseData);
    };

    var _putTestSuiteInLocalStore = function(testSuiteData) {
        if (testSuiteData && testSuiteData.id) {
            var testSuiteId = testSuiteData.id;
            sessionStorage.setItem("TestSuite-" + testSuiteData.id, JSON.stringify(testSuiteData));
            _setSuiteInsKey(testSuiteId);
            if (testSuiteData.testSuiteStartTime) {
                _setSuiteStartTime(testSuiteData.testSuiteStartTime);
            }
            return true;
        }
        return false;
    };

    var _removeTestCaseFromLocalStore = function(testCaseId) {
        if (testCaseId) {
            sessionStorage.removeItem("TestCase-" + testCaseId);
            return true;
        }
        return false;
    };
    var _removeAllTestCasesFromLocalStore = function() {
        var sessionKeys = Object.keys(sessionStorage);
        for (var i in sessionKeys) {
            var key = sessionKeys[i];
            if (key.indexOf("TestCase-") == 0) {
                sessionStorage.removeItem(key);
            }
        }
    };
    var _getNextTestCaseFromLocalStore = function() {
        var testCaseList = sessionStorage.getItem("TestCaseList");
        testCaseList = JSON.parse(testCaseList);
        if (testCaseList) {
            var nextTestCase = testCaseList.shift();
            if (testCaseList.length > 0) {
                sessionStorage.setItem("TestCaseList", JSON.stringify(testCaseList));
            } else {
                sessionStorage.setItem("TestCaseList", null);
            }
            return nextTestCase;
        }
        return null;
    };
    var _putTestCasesListInLocalStore = function(testCaseList) {
        if (testCaseList instanceof Array) {
            sessionStorage.setItem("TestCaseList", JSON.stringify(testCaseList));
            return true;
        }
        return false;
    };
    var _removeTestCasesListFromLocalStore = function() {
        sessionStorage.removeItem("TestCaseList");
    };
    var _setCurrentTestCase = function(testCaseId) {
        if (testCaseId) {
            sessionStorage.setItem(_currentTestCaseAndStep, testCaseId + "$0");
            return true;
        }
        return false;
    };
    var _setCurrentStepIndex = function(stepIndex) {
        var testCaseId = _getCurrentTestCase();
        if (testCaseId && !isNaN(parseInt(stepIndex))) {
            sessionStorage.setItem(_currentTestCaseAndStep, testCaseId + "$" + stepIndex);
            return true;
        }
        return false;
    };
    var _getCurrentTestCase = function() {
        var currentTestCase = sessionStorage.getItem(_currentTestCaseAndStep);
        if (currentTestCase) {
            currentTestCase = currentTestCase.substring(0, currentTestCase.lastIndexOf('$'));
            return currentTestCase;
        }
        return null;
    };
    var _getCurrentStepIndex = function() {
        var currentStepIndex = sessionStorage.getItem(_currentTestCaseAndStep);
        if (currentStepIndex) {
            currentStepIndex = currentStepIndex.substring(currentStepIndex.lastIndexOf('$') + 1);
            return parseInt(currentStepIndex);
        }
        return null;
    };
    var _updateTestCaseStepData = function(testCaseId, stepIndex, updatedStepData) {
        var testCaseData = sessionStorage.getItem("TestCase-" + testCaseId);
        testCaseData = JSON.parse(testCaseData);
        var steps = testCaseData[pega.ui.automation.constants.TEST_CASE_STEPS];
        steps[stepIndex] = updatedStepData;
        sessionStorage.setItem("TestCase-" + testCaseId, JSON.stringify(testCaseData));
    };
    var _removeCurrentTestCaseAndStep = function() {
        sessionStorage.removeItem(_currentTestCaseAndStep);
    };
    var _setTestCaseResult = function(resultData) {
        if (resultData) {
            try {
                resultData = JSON.stringify(resultData);
                sessionStorage.setItem("TestCaseResult", resultData);
            } catch (e) {
                console.log("Exception while parsing testcase result!");
            }
        }
    };
    var _getTestCaseResult = function() {
        var resultData = sessionStorage.getItem("TestCaseResult");
        if (resultData) {
            resultData = JSON.parse(resultData);
        }
        return resultData;
    };
    var _getTestCaseStepResult = function(stepIndex) {
        var stepResult = null;
        var resultData = sessionStorage.getItem("TestCaseResult");
        if (resultData) {
            resultData = JSON.parse(resultData);
            stepResult = resultData.pyTestCaseSteps[stepIndex];
        }
        return stepResult;
    };
    var _removeTestCaseResult = function() {
        sessionStorage.removeItem("TestCaseResult");
    };
    var _setTestCaseMeta = function(testCaseMeta) {
        if (testCaseMeta) {
            try {
                testCaseMeta = JSON.stringify(testCaseMeta);
                sessionStorage.setItem("TestCaseMetaData", testCaseMeta);
            } catch (e) {
                console.log("Exception while parsing testcase metadata!");
            }
        }
    };
    var _getTestCaseMeta = function() {
        var testCaseMeta = sessionStorage.getItem("TestCaseMetaData");
        if (testCaseMeta) {
            testCaseMeta = JSON.parse(testCaseMeta);
        }
        return testCaseMeta;
    };
    var _removeTestCaseMeta = function() {
        sessionStorage.removeItem("TestCaseMetaData");
    };
    var _removeTestCaseEditData = function() {
        sessionStorage.removeItem("StartRunIndex");
        sessionStorage.removeItem("StopRunIndex");
        sessionStorage.removeItem("ExecutorMode");
    };
    var _setTestCaseStepMeta = function(stepIndex, metadata) {
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta == null) {
                _setTestCaseMeta({ pyTestCaseSteps: [] });
                tcMeta = _getTestCaseMeta();
            }
            if (!metadata) {
                metadata = {};
            }
            tcMeta.pyTestCaseSteps[stepIndex] = metadata;
            _setTestCaseMeta(tcMeta);
        }
    };
    var _getTestCaseStepMeta = function(stepIndex) {
        var stepMeta = null;
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta) {
                stepMeta = tcMeta.pyTestCaseSteps[stepIndex];
            }
        }
        return stepMeta;
    };
    var _resetTestCaseStepMeta = function(stepIndex) {
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta) {
                tcMeta.pyTestCaseSteps[stepIndex] = {};
                _setTestCaseMeta(tcMeta);
            }
        }
    };
    var _getAllTestCaseStepsMeta = function() {
        var testCaseMeta = _getTestCaseMeta();
        if (testCaseMeta) {
            return testCaseMeta.pyTestCaseSteps;
        }
    };
    var _setRecoderStepIndex = function(stepIndex) {
        if (!isNaN(stepIndex)) {
            sessionStorage.setItem("RecoderStepIndex", stepIndex);
        }
    };
    var _getRecoderStepIndex = function() {
        var recIndex = sessionStorage.getItem("RecoderStepIndex");
        return recIndex ? parseInt(recIndex) : recIndex;
    };
    var _removeRecoderStepIndex = function() {
        sessionStorage.removeItem("RecoderStepIndex");
    };
    var _setLastRunStepIndex = function(index) {
        sessionStorage.setItem("LastRunStepIndex", index);
    };
    var _getLastRunStepIndex = function() {
        return sessionStorage.getItem("LastRunStepIndex");
    };
    var _setEditStepIndex = function(index) {
        sessionStorage.setItem("EditStepIndex", index);
    };
    var _getEditStepIndex = function() {
        return sessionStorage.getItem("EditStepIndex");
    };
    var _setExecutorStatus = function(status) {
        sessionStorage.setItem("ExecutorStatus", status);
    };



    var _setSuiteInsKey = function(key) {
        sessionStorage.setItem("SuiteInsKey", key);
    };
    var _setSuiteCheckedInInsKey = function(key) {
        sessionStorage.setItem("SuiteCheckedInInsKey", key);
    };
    var _setSuiteStartTime = function(time) {
        sessionStorage.setItem("SuiteStratTime", time);
    };
    var _getSuiteInsKey = function() {
        return sessionStorage.getItem("SuiteInsKey");
    };
    var _getSuiteCheckedInInsKey = function() {
        return sessionStorage.getItem("SuiteCheckedInInsKey");
    };
    var _getSuiteStartTime = function() {
        return sessionStorage.getItem("SuiteStratTime");
    };

    var _getDocStateCaptureFlag = function() {
        return sessionStorage.getItem("DocStateCaptureFlag");
    };
    var _setDocStateCaptureFlag = function(flag) {
        sessionStorage.setItem("DocStateCaptureFlag", flag);
    };
    var _removeDocStateCaptureFlag = function() {
        return sessionStorage.removeItem("DocStateCaptureFlag");
    };

    var _getExecutorStatus = function() {
        if(sessionStorage !== undefined || sessionStorage !== null)
            return sessionStorage.getItem("ExecutorStatus");
    };
    var _setExecutorMode = function(mode) {
        sessionStorage.setItem("ExecutorMode", mode);
    };
    var _getExecutorMode = function() {
        return sessionStorage.getItem("ExecutorMode");
    };
    var _setTestCaseRunnerMessage = function(messageData, isExecutor) {
        if (messageData) {
            try {
                var messageDataQ = _getTestCaseRunnerMessageHelper(isExecutor);
                messageDataQ.push(messageData);
                var messageDataQString = JSON.stringify(messageDataQ);
                sessionStorage.setItem(_getMessageKey(isExecutor), messageDataQString);
            } catch (e) {
                console.log("Exception while parsing TestCaseRunnerMessage!");
            }
        }
    };
    var _getTestCaseRunnerMessageHelper = function(isExecutor) {
        var messageDataQString = sessionStorage.getItem(_getMessageKey(isExecutor));
        var messageDataQ = [];
        if (messageDataQString) {
            messageDataQ = JSON.parse(messageDataQString);
        }
        return messageDataQ;
    };
    var _getMessageKey = function(isExecutor) {
        return isExecutor ? "TestCaseExecutorMessage" : "TestCaseRunnerMessage";
    };
    var _getTestCaseRunnerMessage = function(isExecutor) {
        var messageDataQ = _getTestCaseRunnerMessageHelper(isExecutor);
        var returnmessage = messageDataQ.shift();
        var messageDataQString = JSON.stringify(messageDataQ);
        sessionStorage.setItem(_getMessageKey(isExecutor), messageDataQString);
        return returnmessage;
    };
    var _removeTestCaseRunnerMessage = function(isExecutor) {
        sessionStorage.removeItem(_getMessageKey(isExecutor));
    };
    var _setAutomationJobId = function(jobid) {
        sessionStorage.setItem("AutomationJobId", jobid);
    };
    var _getAutomationJobId = function() {
        return sessionStorage.getItem("AutomationJobId");
    };
    var _removeAutomationJobId = function() {
        sessionStorage.removeItem("AutomationJobId");
    };

    var _setTestCaseDynamicValueInLocalStore = function(dynamicdata) {
        if (sessionStorage) {
            sessionStorage.setItem("TestCase-dynamicvalues", JSON.stringify(dynamicdata));
            return true;
        }
        return false;
    };

    var _getTestCaseDynamicValueFromLocalStore = function() {
        if (sessionStorage) {
            var testData = sessionStorage.getItem("TestCase-dynamicvalues");
            testData = JSON.parse(testData);
            return testData;
        }
        return null;
    };

    var _removeTestCaseDynamicValueFromLocalStore = function() {
        sessionStorage.setItem("TestCase-dynamicvalues", null);
    };
    var _setTestRunSlowMode = function(millSec) {
        sessionStorage.setItem("TestCaseSlowMode", millSec);
    };
    var _getTestRunSlowMode = function() {
        return sessionStorage.getItem("TestCaseSlowMode");
    };
    var _removeTestRunSlowMode = function() {
        sessionStorage.removeItem("TestCaseSlowMode");
    };
  
    var _setIsRerunEnabeledForTestCases = function(isRerunEnabled){
        sessionStorage.setItem("TestCasesRerunEnabled",isRerunEnabled);
    };
    var _getIsRerunEnabeledForTestCases = function(){
        return sessionStorage.getItem("TestCasesRerunEnabled");
    };
    var _setTestCasesRerunCount = function(rerunCount){
         sessionStorage.setItem("TestCasesRerunCount",rerunCount);
    };
    var _getTestCasesRerunCount = function(){
        return sessionStorage.getItem("TestCasesRerunCount");
    };
    
    var _removeTestCasesRerunStatus = function(){
      sessionStorage.removeItem("TestCasesRerunEnabled");
    };
    
    var _removeTestCasesRerunCount = function(){
      sessionStorage.removeItem("TestCasesRerunCount");
    };
    
    var _addFailedTestCaseForRerun = function(failedTestCase){
      if(sessionStorage){
        var rerunTestCaseList = JSON.parse(sessionStorage.getItem("RerunTestCaseList"));
        if(!rerunTestCaseList){
          rerunTestCaseList = {"pxResults" : []};
        }
        rerunTestCaseList["pxResults"].push(failedTestCase);
        sessionStorage.setItem("RerunTestCaseList",JSON.stringify(rerunTestCaseList));
      }
    };
    
    var _getRerunTestCaseList = function(){
      return JSON.parse(sessionStorage.getItem("RerunTestCaseList"));
    };
    
    var _reSetTestCaseRerunList = function(){
      sessionStorage.removeItem("RerunTestCaseList");
    };
    
    var _getRerunInProgress = function(){
      return JSON.parse(sessionStorage.getItem("RerunInProgress"));
    };
    
    var _setRerunInProgress = function(isRerunInProgress){
      sessionStorage.setItem("RerunInProgress",isRerunInProgress);
    };
    
    var _removeRerunInProgress = function(){
      sessionStorage.removeItem("RerunInProgress");
    };
    
    var _cleanRerunVariables = function(){
      // for every fresh run from landing page/rest service reset rerun properties
     _removeTestCasesRerunStatus();
     _removeTestCasesRerunCount();
     _reSetTestCaseRerunList();
     _removeRerunInProgress();
     _removeCurrentTestCaseForRerun();
    };
  
   var _setCurrentTestCaseForRerun = function(failedTestCase){
      sessionStorage.setItem("CurrentTestCaseForRerun",JSON.stringify(failedTestCase) );
   };
  
   var _getCurrentTestCaseForRerun = function(){
     return JSON.parse(sessionStorage.getItem("CurrentTestCaseForRerun"));
   };
   
  var _removeCurrentTestCaseForRerun = function(){
    sessionStorage.removeItem("CurrentTestCaseForRerun");
  };
    
    return {
        getTestCaseFromLocalStore: _getTestCaseFromLocalStore,
        putTestCaseInLocalStore: _putTestCaseInLocalStore,
        removeTestCaseFromLocalStore: _removeTestCaseFromLocalStore,
        removeAllTestCasesFromLocalStore: _removeAllTestCasesFromLocalStore,
        getNextTestCaseFromLocalStore: _getNextTestCaseFromLocalStore,
        putTestCasesListInLocalStore: _putTestCasesListInLocalStore,
        removeTestCasesListFromLocalStore: _removeTestCasesListFromLocalStore,
        setCurrentTestCase: _setCurrentTestCase,
        setCurrentStepIndex: _setCurrentStepIndex,
        updateTestCaseStepData: _updateTestCaseStepData,
        getCurrentTestCase: _getCurrentTestCase,
        updateCurrentTestCaseStep: _updateCurrentTestCaseStep,
        getCurrentStepIndex: _getCurrentStepIndex,
        removeCurrentTestCaseAndStep: _removeCurrentTestCaseAndStep,
        setTestCaseResult: _setTestCaseResult,
        getTestCaseResult: _getTestCaseResult,
        getTestCaseStepResult: _getTestCaseStepResult,
        removeTestCaseResult: _removeTestCaseResult,
        setTestCaseMeta: _setTestCaseMeta,
        getTestCaseMeta: _getTestCaseMeta,
        removeTestCaseMeta: _removeTestCaseMeta,
        setTestCaseStepMeta: _setTestCaseStepMeta,
        getAllTestCaseStepsMeta: _getAllTestCaseStepsMeta,
        getTestCaseStepMeta: _getTestCaseStepMeta,
        resetTestCaseStepMeta: _resetTestCaseStepMeta,
        setExecutorStatus: _setExecutorStatus,
        getExecutorStatus: _getExecutorStatus,
        setExecutorMode: _setExecutorMode,
        setSuiteInsKey: _setSuiteInsKey,
        getSuiteInsKey: _getSuiteInsKey,
        setSuiteCheckedInInsKey: _setSuiteCheckedInInsKey,
        getSuiteCheckedInInsKey: _getSuiteCheckedInInsKey,
        setSuiteStartTime: _setSuiteStartTime,
        getSuiteStartTime: _getSuiteStartTime,
        putTestSuiteInLocalStore: _putTestSuiteInLocalStore,
        getDocStateCaptureFlag: _getDocStateCaptureFlag,
        setDocStateCaptureFlag: _setDocStateCaptureFlag,
        removeDocStateCaptureFlag: _removeDocStateCaptureFlag,
        getExecutorMode: _getExecutorMode,
        setRecoderStepIndex: _setRecoderStepIndex,
        getRecoderStepIndex: _getRecoderStepIndex,
        removeRecoderStepIndex: _removeRecoderStepIndex,
        setTestCaseRunnerMessage: _setTestCaseRunnerMessage,
        getTestCaseRunnerMessage: _getTestCaseRunnerMessage,
        removeTestCaseRunnerMessage: _removeTestCaseRunnerMessage,
        setAutomationJobId: _setAutomationJobId,
        getAutomationJobId: _getAutomationJobId,
        removeAutomationJobId: _removeAutomationJobId,
        getTestCaseDynamicValueFromLocalStore: _getTestCaseDynamicValueFromLocalStore,
        setTestCaseDynamicValueInLocalStore: _setTestCaseDynamicValueInLocalStore,
        removeTestCaseDynamicValueFromLocalStore: _removeTestCaseDynamicValueFromLocalStore,
        setTestRunSlowMode: _setTestRunSlowMode,
        getTestRunSlowMode: _getTestRunSlowMode,
        removeTestRunSlowMode: _removeTestRunSlowMode,
        setLastRunStepIndex: _setLastRunStepIndex,
        getLastRunStepIndex: _getLastRunStepIndex,
        setEditStepIndex: _setEditStepIndex,
        getEditStepIndex: _getEditStepIndex,
        removeTestCaseEditData: _removeTestCaseEditData,
        setIsRerunEnabeledForTestCases:_setIsRerunEnabeledForTestCases,
        getIsRerunEnabeledForTestCases:_getIsRerunEnabeledForTestCases,
        setTestCasesRerunCount:_setTestCasesRerunCount,
        getTestCasesRerunCount:_getTestCasesRerunCount,
        removeTestCasesRerunStatus:_removeTestCasesRerunStatus,
        removeTestCasesRerunCount:_removeTestCasesRerunCount,
        reSetTestCaseRerunList:_reSetTestCaseRerunList,
        addFailedTestCaseForRerun:_addFailedTestCaseForRerun,
        getRerunTestCaseList:_getRerunTestCaseList,
        getRerunInProgress:_getRerunInProgress,
        setRerunInProgress:_setRerunInProgress,
        removeRerunInProgress:_removeRerunInProgress,
        cleanRerunVariables:_cleanRerunVariables,
        setCurrentTestCaseForRerun:_setCurrentTestCaseForRerun,
        getCurrentTestCaseForRerun:_getCurrentTestCaseForRerun,
        removeCurrentTestCaseForRerun:_removeCurrentTestCaseForRerun
        
      
    };
})();
//static-content-hash-trigger-YUI
pega = pega || {};
pega.ui = pega.ui || {};
pega.ui.automation = pega.ui.automation || {};
pega.ui.automation.recorder = (function(recorder) {
    var recorderAPI = {};
    var CLICK_EVENT_TYPE = "click";
    var panel = null;
    var bPanelActive = false;
    var isRecording = false;
    var CURRENT_STEP_PAGE = null;
    var currentElement = null;
    var currentElementMetadata = null;
    var isMarkedForAssertion = false;
    var blackListedElements = ["div.runtime-recorder-panel", "div.ui-inspector", "i.mark-for-assertion", "div[node_name='pzDefaultStepBuilderWrapper']", ".autocompleteAG", "div[node_name='pyTestStepAssertions']", "div[node_name='pzRuntimeToolsTopBar']","div[node_name='pyDefaultStepView']"];

    recorderAPI.getComponentName = function(inspectorData) {
        var type = inspectorData.type;
        if (type === "section") {
            return type;
        }
        return inspectorData.subType;
    }

    _isValidFrame = function(windowObj) {
      try{
        if (windowObj.pega && windowObj.pega.ui && windowObj.pega.ui.automation) {
            return true;
        }
      }catch(e){
        
      }
      return false;
        
    }

    _getRecorder = function(windowObj) {
        if (windowObj.pega && windowObj.pega.ui && windowObj.pega.ui.automation) {
            return windowObj.pega.ui.automation.recorder;
        }
        return null;
    }

    _getinspector = function() {
        return pega.ui.ScreenInspector.getInspector("recorder");
    }

    recorderAPI.setCurrentStepPage = function(stepObj) {
        CURRENT_STEP_PAGE = stepObj;
    }

    recorderAPI.getCurrentStepPage = function() {
        return CURRENT_STEP_PAGE;
    }

    recorderAPI.clearCurrentStepPage = function() {
        CURRENT_STEP_PAGE = null;
        var popoverElem = $('.assertor-popover')[0];
        if (popoverElem && popoverElem.po) {
            popoverElem.po.close();
        }
    }

    var _updateElementEvent = function(element, event) {
        var eventValue = element.getAttribute(event) || "";
        eventValue = "pega.ui.EventsEmitter.publishSync(pega.c.eventController.ON_BEFORE_EVENT_PROCESSING, event);" + eventValue;
        element.setAttribute(event, eventValue);
    }

    var _updateElementEvents = function(element, events) {
        if (events instanceof Array) {
            var i = 0;
            for (; i < events.length; i++) {
                _updateElementEvent(element, events[i]);
            }
        } else {
            _updateElementEvent(element, events);
        }
    }

    recorderAPI.beforeElementSelection = function(element) {
        var componentName = recorderAPI.getComponentName(recorderAPI.getValidInspactableElementData(element).inspectorData);
        var events = pega.ui.automation.manager.getEvents(componentName);
        if (events) {
            var stepBuilder = pega.ui.automation.manager.getStepbuilder(componentName);
            _updateElementEvents(stepBuilder.getTargetElement(element), events);
        }
    }


    var _disableOtherPanels = function() {
        //Live-UI
        var uiInspElem = $('.ui-inspector', document);
        if (uiInspElem.length !== 0) {
            uiInspElem.find("a").attr("disabled", true).addClass("disabledStyle").children("i").attr(
                "disabled", true).addClass("disabledStyle");
            uiInspElem.find("button").attr("disabled", true).addClass("disabledStyle");
            uiInspElem.attr("disabled", true);
            liveUI_dataClick = uiInspElem.find("i").attr("data-click");
            /*Remove data click on icon when disabled so as not to enable to live ui when the agile work bench is open*/
            uiInspElem.find("i").removeAttr("data-click");
        }


        uiInspElem = [];
      
        //Agile Workbench
        var agileStudio_i = $('.gapid_icon', document);
        if (agileStudio_i && agileStudio_i.length > 0) {
            uiInspElem = agileStudio_i.closest("div");
        }
        if (uiInspElem.length !== 0) {
            uiInspElem.find("a").attr("disabled", true).addClass("disabledStyle").children("i").attr(
                "disabled", true).addClass("disabledStyle");
            uiInspElem.find("button").attr("disabled", true).addClass("disabledStyle");
            uiInspElem.attr("disabled", true);
            agileWB_dataClick = uiInspElem.find("i").attr("data-click");
            /*Remove data click on icon when disabled so as not to enable to live ui when the agile work bench is open*/
            uiInspElem.find("i").removeAttr("data-click");
        }
    }

    var _enableOtherPanels = function() {
        //Live-UI
        var uiInspElem = $('.ui-inspector', document);
        if (uiInspElem.length !== 0) {
            uiInspElem.find("a").removeAttr("disabled").removeClass("disabledStyle").children("i").removeAttr(
                "disabled").removeClass("disabledStyle");
            uiInspElem.find("button").removeAttr("disabled").removeClass("disabledStyle");
            uiInspElem.removeAttr("disabled");
            //uiInspElem.find("i").attr("data-click", "[[\"runScript\", [\"pega.ui.inspector.toggle()\"]]]");
            uiInspElem.find("i").attr("data-click", liveUI_dataClick);
            liveUI_dataClick = "";
        }
      
        uiInspElem = [];

        //Agile Workbench
        var agileStudio_i = $('.gapid_icon', document);
        if (agileStudio_i && agileStudio_i.length > 0) {
            uiInspElem = $('.gapid_icon', document).closest("div");
        }
        if (uiInspElem.length !== 0) {
            uiInspElem.find("a").removeAttr("disabled").removeClass("disabledStyle").children("i").removeAttr(
                "disabled").removeClass("disabledStyle");
            uiInspElem.find("button").removeAttr("disabled").removeClass("disabledStyle");
            uiInspElem.removeAttr("disabled");
            //uiInspElem.find("i").attr("data-click", "[[\"runScript\", [\"checkForExtension_GI()\"]],[\"runScript\", [\"pega.ui.gapidentifier.toggle()\"]],[\"runScript\", [\"cleanUpMarkers_GI()\"]]]");
            uiInspElem.find("i").attr("data-click", agileWB_dataClick);
            agileWB_dataClick = "";
        }
    }
    recorderAPI.toggle = function(callback) {
       if (window !== pega.desktop.support.getDesktopWindow() || pega.desktop.portalName === "pxExpress" 
           || window !== pega.ui.automation.utils.getPortalWindow()) {
          // do not show automation panel in other than desktop (portal) window
          return;
        }
       $(".automation-recorder").toggleClass("active");
        if (!panel) {
            panel = new EdgePanel("recorder");
            panel.setPanelSection("pxAutomationEdgePaneWrapper", {
                "className": "@baseclass"
            });
        }
      var wrapperCallback = function(){
        /*start recording if recording is in progress */
        var recordingMode = pega.ui.ClientCache.find("pxRequestor.pxAutomationRecorder.pyTestCaseDisplayMode");
        if(recordingMode){
          var displayMode = recordingMode.getValue();
          if(displayMode && displayMode === "recording"){
            pega.ui.automation.recorder.startRecording();
          }
        }
        if (callback && (typeof callback == 'function')) {
          callback.apply(null, arguments);
        }
      }

        if (panel.panelState == panel.STATES.ACTIVE) {
            panel.panelState = panel.STATES.BUSY;
            _enableOtherPanels();
            panel.hide(recorderAPI.stopRecording, recorderAPI);
            bPanelActive = false;
        } else if (panel.panelState == panel.STATES.INACTIVE) {
            panel.panelState = panel.STATES.BUSY;
            _disableOtherPanels();
            panel.show(wrapperCallback);
            bPanelActive = true;
        } else {
            //Do-Nothing
        }
    }
    
    recorderAPI.isPanelActive = function(){
      return bPanelActive;
    }

    recorderAPI.isRecording = function() {
        return isRecording;
    }
    
    recorderAPI.toggleTestActions = function(event) {
        var target = event.target || event.srcElement;
        var rowElem = $(target).parents(".pz-gap-item-row");
        if (rowElem.hasClass("visible")) {
          rowElem.removeClass("visible");
          rowElem.children(".item-2").children("div").css("right", "");
        } else {
            rowElem.parents("div[node_name='pxAutomationFunctionalTests']").find(".pz-gap-item-row.visible").each(
                function() {
                        $(this).removeClass("visible");
                        $(this).children(".item-2").children("div").css("right", "");
                    });
         rowElem.addClass("visible");
         rowElem[0].offsetHeight; // force a redraw of the element before triggering the transition
         rowElem.children(".item-2").children("div").css("right", "0");
        }
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }


    function _mouseoverHandler(e) {
        var target = e.target;
        if (isRecording && pega.c.eventController)
            pega.c.eventController.handler(e);
    }

    function _keydownHandler(e) {
    	if(isRecording && e.keyCode == 17) {
    		top.window.holdHighlight = true;
    	}
    }

    function _keyupHandler(e) {
    	if(isRecording && e.keyCode == 17) {
    		top.window.holdHighlight = false;
    	}
    }

    function _rightclickHandler(e) {
      if(isRecording) {
        top.window.holdHighlight = false;
      }
    }
    
    function _scrollToEnd(secDiv) {
        try{
          if(secDiv && secDiv.getAttribute("node_name") == "pxTestCaseDetails") {
            var testStepsNode = secDiv.querySelector("div[node_name='pyShowRecordingTestSteps']");
            var testStepsLayout = $(testStepsNode).closest(".layout");
            if(testStepsNode && testStepsLayout.length) {
                testStepsLayout.get(0).scrollTop = testStepsLayout.get(0).scrollHeight;
            }
        }
        }catch(exp){}
    }
    
    recorderAPI.startRecording = function() {
        if (isRecording) {
            return;
        }
        
        document.addEventListener("mouseover",_mouseoverHandler);
        document.addEventListener("keydown", _keydownHandler);
        document.addEventListener("keyup", _keyupHandler);
        document.addEventListener("contextmenu", _rightclickHandler);
        pega.u.d.attachOnload(_scrollToEnd, true);
        if (!pega.ui.EventsEmitter.isListenerSubscribed(pega.c.eventController.ON_BEFORE_EVENT_PROCESSING, _onBeforeEventProcessing)) {
            pega.ui.EventsEmitter.subscribe(pega.c.eventController.ON_BEFORE_EVENT_PROCESSING, _onBeforeEventProcessing);
        }
        if (window == desktopwrappersupport_getDesktopWindow()) {
            var inspector = pega.ui.ScreenInspector.getInspector("recorder");
            inspector.registerPostHighlightCallback(_markForAssertion, this);
            inspector.setBlackListedElement(blackListedElements);
            inspector.addSelector("[data-ui-meta]", function(element) {
                var selectorMetadata = null;
                var data_ui_meta = element.getAttribute("data-ui-meta");
                if (data_ui_meta) {
                    data_ui_meta = JSON.parse(data_ui_meta.replace(/'/g, "\""));
                    var subType = data_ui_meta.subType;
                    var supportedComponents = pega.ui.automation.manager.getAllSupportedComponents();
                    if(subType){
                      for (var i = 0; i < supportedComponents.length; i++) {
                        if (supportedComponents[i].toUpperCase() === subType.toUpperCase()) {
                            selectorMetadata = data_ui_meta;
                            break;
                        }
                      }
                    }
                    
                }
                return selectorMetadata;
            });

            //Get all pre-registered selectors from inspector configs to highlight elements
            var componentInspectorConfigs = pega.ui.automation.manager.getAllComponentInspectorConfigs();

            for (var i = 0; i < componentInspectorConfigs.length; i++) {
                var componentInspectorConfig = componentInspectorConfigs[i];
                if (componentInspectorConfig["selector"] && componentInspectorConfig["selectorcb"]) {
                    inspector.addSelector(componentInspectorConfig["selector"], componentInspectorConfig["selectorcb"]);
                }
            }

            inspector.enable();
        }
        isRecording = true;
        //start recording for inner iframes as well
        var framesList = window.frames;
        for (var i = 0; i < framesList.length; i++) {
            if (_isValidFrame(framesList[i])) {
                var recorder = _getRecorder(framesList[i]);
                recorder.startRecording();
            }
        }

    }

    _markForAssertion = function(element, metadata) {
        _markForExplicitAssertion(element);
        currentElement = element;
        currentElementMetadata = metadata;
    }

    _markForExplicitAssertion = function(element) {
        var elems = document.querySelectorAll('[data-recording]');
        for(var i = 0; i < elems.length; i++) {
            var ele = elems[i];
            ele.removeAttribute('data-recording');
        }
        if(element.classList.contains('menu-item') && !element.parentElement.classList.contains("menu-bar")) {
            element.setAttribute('data-recording', 'true');
        }
    }

    recorderAPI.getValidInspactableElementData = function(elem) {
        var inspector = pega.ui.ScreenInspector.getInspector("recorder");
        var selectorList = inspector._getSelectorList();
        var actualTarget = elem.closest(selectorList);

        if (actualTarget) {
            for (var i = 0; i < blackListedElements.length; i++) {
                if (actualTarget.closest(blackListedElements[i])) {
                    actualTarget = null;
                    break;
                }
            }
        }

        var inspectorData = actualTarget && inspector._closestSelectorMetadata(actualTarget);

        if (!inspectorData) {
            actualTarget = null;
        }
        return {
            "selectedElement": actualTarget,
            "inspectorData": inspectorData
        };
    }


    _isMenu = function(componentName) {
        return componentName == "pxMenu" || componentName == "pxMenuItem";
    }

    _isShowMenu = function(target, componentName) {
        return _isMenu(componentName) && $(target).closest("ul.menu-regular")[0];
    }

    /**
     * Returns true if mouseover for the element is supported by the automation recorder.
     * @method {_isMouseoverAllowed}
     * @param  {HTMLElement}    target
     * @return {bool}        
     */
    var _isMouseoverAllowed = function(target) {
        try {
            var data_hover = target.getAttribute("data-hover");
            if (data_hover && data_hover.length > 0) {
                return data_hover.includes("showSmartTip") || data_hover.includes("showSmartInfo");
            }
        } catch (e) {
            console.log("Parsing error in data-hover action string");
        }
        return false;

    }
    /**
     * Returns true if a step has to be recorded for the event, else false.
     * @method {_allowStepCreationForEvent}
     * @param  {Event}  e             
     * @param  {String} componentName 
     * @return {bool} 
     */
    var _allowStepCreationForEvent = function(e, componentName, selectedElement) {
        if(e.type === 'change' && componentName == "pxAutoComplete" && e.target && e.target.name && selectedElement){
           var targetElem = pega.ui.automation.manager.getStepbuilder(componentName).getTargetElement(selectedElement);
           if(targetElem && targetElem.name != e.target.name){
              return false;
           }
        }
        if (e.type === 'mousedown' && navigator.userAgent.lastIndexOf('Firefox/') > -1 ) {
          //SE-58307/BUG-527921 : Ignoring mousedown events in firefox when triggered from other than targeted element
          if (componentName == "pxAutoComplete" || componentName == "pxDropdown") {
            var targetElem = pega.ui.automation.manager.getStepbuilder(componentName).getTargetElement(selectedElement);
            if(targetElem && targetElem.name != e.target.name){
              return false;
            }
          }
        }
        if(e.type === 'change' && e.target){
           //Avoid step creation on lazy change, which means a change is fired later anyways.
           var lazyonchange = e.target.getAttribute("data-change-lazy");
           if (lazyonchange && lazyonchange == "true") {
              return false;
           }
        }
        if (e.type === 'change' || e.type === 'dblclick' || (e.type === 'mousedown' && e.isTrusted) || e.type === 'contextmenu') {
            return true;
        } else if (e.type === 'mouseover' && _isMouseoverAllowed(e.target)) {
            return true;
        } else {
            var componentRecorder = pega.ui.automation.manager.getRecorder(componentName);
            return componentRecorder.isSupportedStepRecord(e, selectedElement);
        }

    }
    /**
     * Recursively calls the method till the top most menu item is found, and then creates steps for each menu item
     * starting from the top menu item to the one which is clicked.
     * @method {_createMenuItemStep}
     * @param  {Element}    activeMenuItem
     * @param  {Event}      e
     */
    var _createMenuItemStep = function(activeMenuItem, eventType) {
        try {
            if (activeMenuItem) {
                var parnetMenuItem = $(activeMenuItem).parents("li.menu-item-active")[0];
                _createMenuItemStep(parnetMenuItem, "mouseover");
                var inspectableData = recorderAPI.getValidInspactableElementData(activeMenuItem);
                var selectedElement = inspectableData && inspectableData["selectedElement"];
                var componentName = "";
                if (selectedElement) {
                    componentName = recorderAPI.getComponentName(inspectableData["inspectorData"]);
                }
                pega.ui.automation.recorder.stepbuilder.buildAndSaveStep(selectedElement, componentName, eventType);
            }
        } catch (e) {
            console.error("Can not record the Menu Item path");
        }

    }

    _onBeforeEventProcessing = function(e) {
        if (e.name && e.name.startsWith('PEGACKEDITOR')) {
            e.target = e.element.$;
            e.type = 'mousedown';
            e.isTrusted = true;
        }
        var inspectableElementData = recorderAPI.getValidInspactableElementData(e.target);
        var selectedElement = inspectableElementData && inspectableElementData["selectedElement"];
        if (selectedElement) {
            var componentName = recorderAPI.getComponentName(inspectableElementData["inspectorData"]);
          if(componentName === "pxDropDown"){
            componentName = "pxDropdown";
          }
        }

        //If the event is click, check if there is a smartinfo open and close it.
        if (e.type === "click" && pega.u.smartinfo && pega.u.smartinfo.targetElememnt) {
            var smartInfoMain = $(e.target).closest(".smartInfoMain");
            //Do not close the smart info if the click is on the smart info.
            if (!(smartInfoMain && smartInfoMain.length > 0))
                pega.u.d.getPopOver(pega.u.smartinfo.targetElememnt).close();
        }

        if (selectedElement && _allowStepCreationForEvent(e, componentName, selectedElement)) {
            //If the selectedElement is menu item, and the event is click, then create steps starting from the parent menu.
            if (_isShowMenu(selectedElement, componentName)) {
                var menuItem = $(selectedElement).closest("li.menu-item-active")[0];
                if (menuItem) {
                    _createMenuItemStep(menuItem, "click");
                }
                return;
            }
            console.log("onBefore ", e.type);
            var eventType = e.type;
            if (eventType === "mousedown") {
                eventType = "click";
            }
            pega.ui.automation.recorder.stepbuilder.buildAndSaveStep(selectedElement, componentName, eventType, e.target);
        }
    }
    recorderAPI.showAssertionPanel = function(e) {
        var inspectableElementData = recorderAPI.getValidInspactableElementData(currentElement);
        var selectedElement = inspectableElementData && inspectableElementData["selectedElement"];
        if (selectedElement) {
            var eventTarget = selectedElement;
            if (e && e.target) {
                eventTarget = e.target;
            }
            var componentName = recorderAPI.getComponentName(inspectableElementData["inspectorData"]);
          
            var panelFromOverlay = $(selectedElement).closest('.overlayPO');
            if(panelFromOverlay.length > 0 && panelFromOverlay.get(0).po && panelFromOverlay.get(0).po.isActive()) {
                panelFromOverlay.addClass('has-assertion-popover');
                e.stopPropagation();
            }
          
            console.log("*** Show assertion panel ***");
            pega.ui.automation.recorder.stepbuilder.showAssertorPopover(selectedElement, componentName, CLICK_EVENT_TYPE, eventTarget);

            if(selectedElement.classList.contains("menu-item")) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

    }
    recorderAPI.markAssertion = function(e) {
        isMarkedForAssertion = true;
        var inspector = pega.ui.ScreenInspector.getInspector("recorder");
        inspector.select(currentElement);
    }

    recorderAPI.clearRecordingStore = function() {
        pega.ui.automation.recorder.stepbuilder.clearCurrentStepPage();
        pega.ui.automation.storeManager.removeRecoderStepIndex();
        // Removing stepindex attribute from dom
        $("[data-aftrecorder-index]").removeAttr("data-aftrecorder-index");
        if(pega.ui.automation.storeManager.getExecutorMode() == "edit") {
            pega.ui.automation.storeManager.setExecutorMode(null);
            pega.ui.automation.storeManager.setLastRunStepIndex(0);
        }
    }

    recorderAPI.stopRecording = function() {
        if (!isRecording) {
            var inspector = pega.ui.ScreenInspector.getInspector("recorder");
            if (inspector) {
                inspector.clearHighlight();
                inspector.disable();

            }
            return;
        }
        if (pega.ui.automation.storeManager.getExecutorMode() != "edit") {
            recorderAPI.clearRecordingStore();
        }
        pega.ui.EventsEmitter.unsubscribe(pega.c.eventController.ON_BEFORE_EVENT_PROCESSING, _onBeforeEventProcessing);

        document.removeEventListener("mouseover", _mouseoverHandler);
        document.removeEventListener("keydown", _keydownHandler);
        document.removeEventListener("keyup", _keyupHandler);
        document.removeEventListener("contextmenu", _rightclickHandler);
        
        var elems = document.querySelectorAll('[data-recording]');
        for(var i = 0; i < elems.length; i++) {
            elems[i].removeAttribute('data-recording');
        }
        
        pega.u.d.detachOnload(_scrollToEnd);

        var inspector = pega.ui.ScreenInspector.getInspector("recorder");
        inspector.disable();
        isRecording = false;
        //TODO: stop recording for inner iframes
        var framesList = window.frames;
        for (var i = 0; i < framesList.length; i++) {
            if (_isValidFrame(framesList[i])) {
                var recorder = _getRecorder(framesList[i]);
                recorder.stopRecording();
            }
        }
    }

    recorderAPI.addToBlacklistedElements = function(selector) {
        if (!blackListedElements) {
            blackListedElements = [];
        }
        blackListedElements.push(selector);
    }

    recorderAPI.cascadeRecording = function() {
        var topRecorder = _getRecorder(pega.ui.automation.utils.getPortalWindow());
        if (topRecorder && topRecorder.isRecording()) {
            recorderAPI.startRecording();
        }
    }

    function _initAutomationRecorder() {
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pxSetAutomationEdgePaneSectionName");
        strUrlSF.put("sectionName", "pxAutomationTestCasesList");

        var callback = {
            success: function(data) {
                pega.ui.automation.recorder.toggle();
            },
            failure: function(data) {
                console.log("Recorder intialization failed ", data);
            }
        };
        pega.util.Connect.asyncRequest("POST", strUrlSF.toURL(), callback);
    }

    function _handleClick() {
      if(!_isDrag)
        _initAutomationRecorder();
      else
        _isDrag = false;
    }
    var _handleSupression = function(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        return false;
    }
    var _mouseMoveCounter = 0;
    var _isDrag = false;

    function _initializeToolbar() {
        var documentRef = parent.document;
        var oDomTreeToolbar = document.createElement("DIV");
        oDomTreeToolbar.setAttribute("class", "pz-recorder-tool");
        oDomTreeToolbar.setAttribute("data-test-id", "RecorderInspectorButton");
        oDomTreeToolbar.setAttribute("tabindex", "0");
        oDomTreeToolbar.setAttribute("aria-label", "Recorder");
        oDomTreeToolbar.innerHTML = "<div unselectable='on' class='recoderid_icon'><span  unselectable='on' class='pzbtn-img'>" +
            "<img src='webwb/pxIcon_ScenarioTesting.svg'/></span>" + "Test " + " </div>";

        $(oDomTreeToolbar).appendTo(document.body);
        //Add toggle to button on click
        oDomTreeToolbar.addEventListener("click", _handleClick, true);

        var handleDrag = function(e) {
          _isDrag = true;
            _mouseMoveCounter++;
            if (_mouseMoveCounter > 5) {
                /*if (!$(oDomTreeToolbar).hasClass('noClick')) {
                    $(oDomTreeToolbar).addClass('noClick');
                }*/
                var Width = $(".pz-recorder-tool", documentRef).outerWidth();
                var Height = $(".pz-recorder-tool", documentRef).outerHeight();
                var X = e.clientX - (Width / 2);
                var Y = e.clientY - (Height / 2);
                // if toggle button is dragged outside of window, reset variables event listeners
                if (e.clientX < 0 || e.clientY < 0 || e.clientX > $(window).width() || e.clientY > $(window).height()) {
                    _mouseMoveCounter = 0;
                    $(".ui-recorder-tree-mask", documentRef).remove();
                    window.removeEventListener("mousemove", handleDrag, true);
                    $('.pz-recorder-tool', documentRef).removeClass('noClick');
                    return _handleSupression(e);
                }

                //Prevent drag off left
                if (X < 0) {
                    X = 0;
                }
                //Prevent drag off top
                if (Y < 0) {
                    Y = 0;
                }


                //Prevent drag off right
                if (X > ($(window).width() - Width)) {
                    X = ($(window).width() - Width);
                }
                //Prevent drag off bottom
                if (Y > ($(window).height() - Height)) {
                    Y = ($(window).height() - Height);
                }

                //This will set the button's position based on a % rather than set pixel cords
                //Y = (Y / $(window).height() * 100) + "%";
                //X = (X / $(window).width() * 100) + "%";

                $(".pz-recorder-tool", documentRef).css({
                    'position': 'fixed',
                    'top': Y,
                    'left': X
                });

            }

            return _handleSupression(e);
        }
        oDomTreeToolbar.addEventListener("mousedown", function(e) {
            if (!$(oDomTreeToolbar).hasClass('noClick')) {
                if ($(".ui-recorder-tree-mask", documentRef).length === 0) {
                    $(document.body, documentRef).append("<div class='ui-recorder-tree-mask'></div>");
                }

                //Add mouse move
                window.addEventListener("mousemove", handleDrag, true);
            }
            return _handleSupression(e);
        }, true)

        window.addEventListener("mouseup", function(e) {

            if ($(".ui-recorder-tree-mask", documentRef).length > 0) {
                _mouseMoveCounter = 0;
                $(".ui-recorder-tree-mask", documentRef).remove();
                window.removeEventListener("mousemove", handleDrag, true);
            }
        }, true);
        //Add resize event to the window only for the Button
        window.addEventListener("resize", function() {

            if ($(".pz-recorder-tool").css("top") !== "auto") {
                // Get button offset
                var button = $(".pz-recorder-tool");
                var buttonOffset = button.offset();
                var buttonTop = buttonOffset.top;
                var buttonLeft = buttonOffset.left;

                // Get size of window, and scroll position
                var windowHeight = $(window).height() - button.height();
                var windowWidth = $(window).width() - button.width();
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();

                // Adjust button position if needed based on window resize
                if (buttonTop < 0)
                    button.css({
                        'top': "0px"
                    });
                else if ((buttonTop - scrollTop) > windowHeight)
                    button.css({
                        'top': (windowHeight + "px")
                    });
                if (buttonLeft < 0)
                    button.css({
                        'left': "0px"
                    });
                if ((buttonLeft - scrollLeft) > windowWidth)
                    button.css({
                        'left': (windowWidth + "px")
                    });
            }
        }, true);
    }

    function _initStepStatus() {
        var testCaseStepsMeta = pega.ui.automation.storeManager.getAllTestCaseStepsMeta();
        if (testCaseStepsMeta) {
            var i = 0;
            for (; i < testCaseStepsMeta.length; i++) {
                if (testCaseStepsMeta[i] && testCaseStepsMeta[i].status) {
                    var stepPageRef = 'pxRequestor.pxAutomationRecorder.pyTestCaseSteps(' + (i + 1) + ')';
                    pega.u.d.setProperty(stepPageRef + ".pyStepRunStatus", testCaseStepsMeta[i].status);
                }
            }
        }
    }
  
  recorderAPI.initStepStatus = _initStepStatus;

    recorderAPI.initialize = function() {
        // DO initiaize
        /*var clientSessionId = pega.desktop.pxClientSession; //Do not show Test icon floater in pop-up windows.
        if (window !== top || window.name.indexOf(clientSessionId) > -1 || window.name.indexOf('pz') > -1 || window.name == "" || pega.desktop.portalName == "pxExpress" || window.opener) {
            return;
        }
        */
        var portalNames = ["pxExpress", "pxAdminStudio"]
        if (window !== pega.desktop.support.getDesktopWindow() || portalNames.includes(pega.desktop.portalName)
            || window !== pega.ui.automation.utils.getPortalWindow()) {
          // do not show icon in other than desktop (portal) window
          return;
        }
        if ($('.automation-recorder').length < 1) {
            _initializeToolbar();
        }
        // Resume the recording
        if (window.pzAutomationMode === "display" || window.pzAutomationMode === "debug" || window.pzAutomationMode === "recording") {

            var callback = function() {
                if (window.pzAutomationMode === "display" || window.pzAutomationMode === "debug") {
                    // Re-initialize step running status
                    _initStepStatus();
                }
            };

            pega.ui.automation.recorder.toggle(callback);

            // Start recording only for recording mode
            if (window.bIsAutomationRecordingOn === "true") {
                pega.ui.automation.recorder.startRecording();
            }


        }
    }
    return recorderAPI;
})();

document.addEventListener('DOMContentLoaded', function() {
    pega.ui.automation.recorder.cascadeRecording();
}, false);
window.addEventListener("load", function() {
    pega.ui.automation.recorder.initialize();
});

pega.ui.EventsEmitter.subscribe("BeforeLogOff", function() {
    /*BUG-393411 : check if recorder is in progress */
    if(!pega.ui.automation.recorder.isRecording()){
      return;
    }
    var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
    strUrlSF.put("pyActivity", "pzCancelFunctionalTestCase");
    var callback = {
        success: function(data) {
            if(pega.ui.automation.recorder.isPanelActive()){
               pega.ui.automation.recorder.toggle();
            }
        },
        failure: function(data) {
            console.log("Recorder intialization failed ", data);
        }
    };
    pega.util.Connect.asyncRequest("POST", strUrlSF.toURL(), callback);
});

/*********** Update test step status and display message************/
pega.ui.EventsEmitter.subscribe("StepResult", function(statusObj) {
    var stepPageRef = 'pxRequestor.pxAutomationRecorder.pyTestCaseSteps(' + (statusObj.currentStepIndex + 1) + ')';
    var stepIndex = statusObj.currentStepIndex;
    // Update the status in step metadata
    var stepMetaData = pega.ui.automation.storeManager.getTestCaseStepMeta(stepIndex) || {};

    if (statusObj.pyStepResult == "Passed") {
        stepMetaData["status"] = "Passed";
        pega.ctxmgr.setContext(pega.ctxmgr.getRootDocumentContext());
        top.pega.u.d.setProperty(stepPageRef + ".pyStepRunStatus", "Passed");
        pega.ctxmgr.resetContext();
    } else {
        stepMetaData["status"] = "Failed";
        pega.ctxmgr.setContext(pega.ctxmgr.getRootDocumentContext());
        top.pega.u.d.setProperty(stepPageRef + ".pyStepRunStatus", "Failed");
        top.pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyLastRunStatus", "Failed");
        pega.ctxmgr.resetContext();

        var mode = pega.ui.automation.storeManager.getExecutorMode();
        if (mode == "debug" || mode == "edit") {
            //On failure of a step, start the recorder and enable the element on the screen for changing the assertions.
            //pega.ui.automation.sequencer.resumeFrom = stepIndex+1;
            var stepObject = pega.ui.automation.sequencer.getStepAtIndex(stepIndex);
            var selector = stepObject.pySelector;
            if (selector) {
                var target = pega.ui.automation.utils.getDomElement(selector);
                var inspector = pega.ui.ScreenInspector.getInspector("recorder");
                if (!target || target.style.display == "none" || target.hidden) {
                    //To-DO When target element is not present in the DOM or on the screen, Update the current step with the new step.
                } else {
                    inspector.highlightError(target);
                }
            }

        }
    }
    pega.ui.automation.storeManager.setTestCaseStepMeta(stepIndex, stepMetaData);
});



pega.ui.automation.recorder.defaultComponent = (function() {
    function _isSupportedStepRecord(event, selectedElement) {
        return false;
    }

    return {
        isSupportedStepRecord: _isSupportedStepRecord
    }

})();

pega.ui.automation.manager.registerRecorder(pega.ui.automation.constants.COMPONENT.DEFAULT, pega.ui.automation.recorder.defaultComponent);
//static-content-hash-trigger-YUI
var EdgePanel = (function () {
    function EdgePanel(panelName, sectionName) {
        this.ANIMATION_DURATION = 333;
        this.ANIMATION_EASING = "linear";
        this.previousHarnessCSS = "";
        this.isPanelMinimized = false;
        this.BELOW351 = "runtime-body-below351 ";
        this.BELOW261 = "runtime-body-below261 ";
        this.PANEL_WIDTH = 375;
        this.STATES = {
            ACTIVE: "ACTIVE",
            INACTIVE: "INACTIVE",
            BUSY: "BUSY"
        };
        this.panelState = "INACTIVE";
        this.sectionName = sectionName;
        this.panelName = panelName;
        this.options = {};
    }
    EdgePanel.prototype.show = function (callback, callbackContext) {
        var $topHarness = document.querySelector("div[data-portalharnessinsname]");
        var panel = this.getPanel();
        var harnessTopPosition = $topHarness.getBoundingClientRect().top;
        //return if visible
        if (!panel) {
            var PANEL_TEMPLATE = "<div class='runtime-panel-tab'></div>\n                                <div class='runtime-panel-resize ui-resizable-handle ui-resizable-w'></div>\n                                <div class='runtime-panel-body'>\n                                    <div></div>\n                                </div>";
            var oControlPanel = document.createElement("DIV");
            oControlPanel.className = "edge-panel runtime-" + this.panelName + "-panel";
            oControlPanel.style.top = harnessTopPosition + "px";
            oControlPanel.innerHTML = PANEL_TEMPLATE;
            document.body.appendChild(oControlPanel);
        }
        var _this = this;
        var reloadCallback = {
            success: function () {
                if (callback && (typeof callback == 'function')) {
                    callback.apply(callbackContext, [_this.getPanel()]);
                }
            }
        };
        //load inner section
        this._loadSection(reloadCallback.success);
        //Capture the harness style.To be used later for reset during hide of the panel.
        this.previousHarnessCSS = $topHarness.getAttribute("style");
        if (typeof this.previousHarnessCSS === 'undefined')
            this.previousHarnessCSS = "";
        //Animate the panel show
        this.animateShow();
    };
    EdgePanel.prototype.hide = function (callback, callbackContext) {
        //let $topHarness: HTMLElement = this.getTopHarness();
        var panel = this.getPanel();
        if (!panel) {
            return true;
        }
        var parent = panel.parentElement;
        //Animate the panel hide.
        this.animateHide();
        //calling callback method
        if (callback && (typeof callback == 'function') && callbackContext) {
            if (callbackContext) {
                callback.apply(callbackContext, []);
            }
        }
    };
    EdgePanel.prototype.getPanelName = function () {
        return this.panelName;
    };
    EdgePanel.prototype.getPanel = function () {
        return document.querySelector("div.edge-panel.runtime-" + this.panelName + "-panel");
    };
    EdgePanel.prototype.getPanelBody = function () {
        return document.querySelector('div.runtime-panel-body');
    };
    EdgePanel.prototype._loadSection = function (callback) {
        //return if panel not loaded and section name not provided
        if (!this.getPanel() || !this.sectionName) {
            return false;
        }
        var preActivityName = this.options.preActivityName || "";
        var preActivityParams = this.options.preActivityParams || "";
        var elem = document.querySelector(".edge-panel.runtime-" + this.panelName + "-panel .runtime-panel-body > div");
        // Set default section attributes
        elem.className = "sectionDivStyle";
        elem.id = "RULE_KEY";
        elem.setAttribute("node_type", "MAIN_RULE");
        elem.setAttribute("version", "1");
        elem.setAttribute("objclass", "Rule-HTML-Section");
        if (pega.ctx.isUITemplatized === true) {
            elem.dataset.template = true;
        }
        // Set name and class
        elem.setAttribute("node_name", this.sectionName);
        elem.setAttribute("pyclassname", this.options.className || "@baseclass");
        elem.dataset.nodeId = this.sectionName;
        if (this.options.baseRef && this.options.baseRef != "") {
            elem.setAttribute("BASE_REF", this.options.baseRef);
        }
        var tempKeepPageMessages = pega.ctx.KeepPageMessages;
        pega.ctx.KeepPageMessages = true;
        pega.u.d.reloadSection(elem, preActivityName, preActivityParams, false, false, -1, false, null, null, null, callback);
        pega.ctx.KeepPageMessages = tempKeepPageMessages;
        return true;
    };
    EdgePanel.prototype.setPanelSection = function (sectionName, options) {
        this.sectionName = sectionName;
        this.options = options;
    };
    EdgePanel.prototype.getTopHarness = function () {
        return document.querySelector("div[data-portalharnessinsname]");
    };
    EdgePanel.prototype.getResizeBar = function () {
        return document.querySelector(".runtime-" + this.panelName + "-panel div.runtime-panel-resize");
    };
    EdgePanel.prototype.getTab = function () {
        return document.querySelector(".runtime-" + this.panelName + "-panel div.runtime-panel-tab");
    };
    EdgePanel.prototype.animateShow = function () {
        var $topHarness = $(this.getTopHarness());
        var panel = this.getPanel();
        var panelBody = this.getPanelBody();
        var tab = this.getTab();
        var resizeBar = this.getResizeBar();
        var panelWidth;
        var popUpObj = this;
        // When disabling the tree then make sure to add the transition override for the toolbar
        var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
        if (toolbar) {
            toolbar.classList.add("disable-slide");
        }
        //Slide in panel by reducing the width of the rest of the screen
        $topHarness.css({
            'position': 'absolute',
            'left': '0px',
            'right': '0px',
            'min-width': '0px'
        });
        //This is to prevent the panel from exceeding the size of the window itself.
        if (this.PANEL_WIDTH > $topHarness.offsetWidth) {
            panelWidth = $topHarness.offsetWidth - (100) + "px";
        }
        else if (this.PANEL_WIDTH < 10) {
            panelWidth = "10px";
        }
        else {
            panelWidth = this.PANEL_WIDTH + "px";
        }
        if (this.isPanelMinimized) {
            panelWidth = "0px";
        }
        //Unhide the panel and resize bar in the DOM.
        $(panel).removeClass("panel-hidden");
        $(tab).css('display', "");
        $(resizeBar).css('display', "");
        $(panelBody).css('display', "block");
        //Animate the Harness shrink
        $topHarness.animate({
            right: panelWidth
        }, this.ANIMATION_DURATION, this.ANIMATION_EASING, function () {
        });
        //Set the minimize or maximize option,based on the current state of the panel.
        if (this.isPanelMinimized)
            $(tab).addClass('runtime-panel-tab-min');
        else
            $(tab).addClass('runtime-panel-tab-max');
        //Animate the panel show.
        $(panel).animate({
            width: panelWidth
        }, this.ANIMATION_DURATION, this.ANIMATION_EASING, function () {
            $(panel).addClass("showing");
            if (!$(panel).hasClass("ui-resizable")) {
                popUpObj.resizeHandler();
                popUpObj.clickHandler();
            }
            popUpObj.panelState = popUpObj.STATES.ACTIVE;
        });
        if ($(".screen-layout").hasClass("flex")) {
            var isHeaderResizable, isFooterResizable, isLeftSideBarResizable, isRightSideBarResizable;
            isHeaderResizable = $('.screen-layout-region-header').hasClass('screen-layout-region-resize ui-resizable');
            isFooterResizable = $('.screen-layout-region-footer').hasClass('screen-layout-region-resize ui-resizable');
            isLeftSideBarResizable = $('.screen-layout-region-main-sidebar1').hasClass('screen-layout-region-resize ui-resizable');
            isRightSideBarResizable = $('.screen-layout-region-main-sidebar2').hasClass('screen-layout-region-resize ui-resizable');
            if (isHeaderResizable || isFooterResizable || isLeftSideBarResizable || isRightSideBarResizable) {
                this.updateScreenLayoutFlex(panelWidth);
            }
        }
    };
    /**
     * @private If screen layout is using flex, make necessary updates based on right panel size
     **/
    EdgePanel.prototype.updateScreenLayoutFlex = function (rightPanelWidth) {
        // US-152932 handling width of main middle when inspector is opened
        if ($(".screen-layout").hasClass("flex")) {
            var rightWidth, widthToBeSubtracted, leftWidth;
            var clientWidth = $(window).width();
            leftWidth = $(".screen-layout-region-main-sidebar1").outerWidth() || 0;
            rightWidth = $(".screen-layout-region-main-sidebar2").outerWidth() || 0;
            widthToBeSubtracted = leftWidth + rightWidth + parseInt(rightPanelWidth);
            $('.screen-layout-region-main-middle').css({ 'width': (clientWidth - widthToBeSubtracted) + 'px' });
        }
    };
    EdgePanel.prototype.animateHide = function () {
        var $topHarness = $(this.getTopHarness());
        var panel = this.getPanel();
        var panelBody = this.getPanelBody();
        var _this = this;
        var tab = this.getTab();
        var resizeBar = this.getResizeBar();
        var popUpObj = this;
        //Animation to set the harness to full width.
        $topHarness.animate({
            right: "0px"
        }, this.ANIMATION_DURATION, this.ANIMATION_EASING, function () {
            $topHarness.attr('style', _this.previousHarnessCSS);
        });
        //Remove the Minimise or Maximise button.
        $(tab).removeClass('runtime-panel-tab-min');
        $(tab).removeClass('runtime-panel-tab-max');
        //Removing the Automation panel, by removing the active class.
        $(panel).animate({
            width: "0px"
        }, this.ANIMATION_DURATION, this.ANIMATION_EASING, function () {
            $(panel).removeClass("showing");
            $(panel).addClass("panel-hidden");
            $(resizeBar).css('display', "none");
            $(panel).removeClass("runtime-recorder-panel-active");
            $(panelBody).css('display', "none");
            popUpObj.panelState = popUpObj.STATES.INACTIVE;
            var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
            if (toolbar) {
                toolbar.classList.remove("disable-slide");
            }
        });
        //this.updateScreenLayoutFlex(0);
    };
    EdgePanel.prototype.resizeHandler = function () {
        var $topHarness = $(this.getTopHarness());
        var popUpObj = this;
        var panel = this.getPanel();
        var tab = this.getTab();
        var recorderTab = $(".runtime-" + this.panelName + "-panel .runtime-panel-tab");
        var count = $(panel).outerWidth();
        $(panel).css({
            'right': '0px',
            'left': ''
        });
        $topHarness.css({
            'position': 'absolute',
            'left': '0px',
            'right': count + 'px',
            'min-width': '0'
        });
        //Setting the Handler for the panel resize 
        $(panel).resizable({
            handles: {
                'w': '.runtime-panel-resize'
            },
            //When the resize is perfomed.
            resize: function (event, ui) {
                var el = ui.element;
                var count = el.width();
                el.css({
                    'right': '0px',
                    'left': ''
                });
                var windowOuterWidth = $(window).outerWidth();
                //Dont allow the resize to be bigger than the screen size
                if (count > windowOuterWidth - 100) {
                    count = windowOuterWidth - 100;
                    el.css({
                        'width': count + 'px'
                    });
                }
                $(this).removeClass(popUpObj.BELOW261);
                $(this).removeClass(popUpObj.BELOW351);
                if (count < 351) {
                    $(this).addClass(popUpObj.BELOW351);
                }
                if (count < 261) {
                    $(this).addClass(popUpObj.BELOW261);
                }
                //Resize the screen to acount for width of panel
                $topHarness.css({
                    'right': count + 'px'
                });
            },
            //When the resize starts
            start: function (event, ui) {
                $topHarness.css({
                    'position': 'absolute',
                    'left': '0px',
                    'min-width': '0'
                });
                var maskEle = document.createElement("div");
                maskEle.classList = "ui-gapidentifier-tree-mask";
                document.body.append(maskEle);
            },
            //When the resize is done
            stop: function (event, ui) {
                //Capture the automation UI panel width after the resize is done.
                popUpObj.PANEL_WIDTH = $(panel).outerWidth();
                popUpObj.isPanelMinimized = false;
                document.querySelector(".ui-gapidentifier-tree-mask").remove();
            }
        });
    };
    EdgePanel.prototype.clickHandler = function () {
        var popUpObj = this;
        var $topHarness = $(this.getTopHarness());
        var panel = this.getPanel();
        var recorderTab = $(".runtime-" + this.panelName + "-panel .runtime-panel-tab");
        /**
        * @private  clickFunction           [Resizes the Harness, and then changes the view of the recorder tab.]
        */
        var clickFunction = function () {
            $topHarness.css({
                'position': 'absolute',
                'left': '0px'
            });
            //If the panel is maximized, change the css for the recorder tab to show minimize option.
            if (popUpObj.isPanelMinimized) {
                // If the current automation UI panel width is larger than the screen then adjust it back to the screen size on maximize
                if (popUpObj.PANEL_WIDTH > $(window).width() - 100) {
                    popUpObj.PANEL_WIDTH = $(window).width() - 100;
                }
                $topHarness.css('right', popUpObj.PANEL_WIDTH + "px");
                recorderTab.removeClass('runtime-panel-tab-min');
                recorderTab.addClass('runtime-panel-tab-max');
                $(panel).css('width', popUpObj.PANEL_WIDTH + "px");
                popUpObj.isPanelMinimized = false;
            }
            else {
                popUpObj.isPanelMinimized = true;
                $topHarness.css('right', 0 + "px");
                recorderTab.addClass('runtime-panel-tab-min');
                recorderTab.removeClass('runtime-panel-tab-max');
                $(panel).css('width', 0 + "px");
            }
        };
        //Onclick of the drag handle
        recorderTab.click(function () {
            clickFunction();
        });
    };
    return EdgePanel;
}());
//static-content-hash-trigger-YUI
/**
 * A class representing a screen inspector
 * @class ScreenInspector
 */
var ScreenInspector = (function () {
    /*
     * Create a ScreenInspector
     * @constructor
     * @param {String} inspectorName - The name of the screen inspector.
     */
    function ScreenInspector(inspectorName) {
        //name is exposed on the inspector object.
        this.name = inspectorName;
        //Initialise the private varibales so that they are not exposed on the object and are not undefined.
        this.listOfSelectorToHighlight = [];
        this.blackListElements = [];
        this.highlightHandler = null;
        this.inspectorHandler = null;
        this.infoBarHandler = null;
        this.lastHighlightedElement = null;
        this.preHighlightCallback = null;
        this.preHighlightCallbackContext = null;
        this.postHighlightCallback = null;
        this.postHighlightCallbackContext = null;
        this.inspectorConfig = null;
        //Set the screen inspector object and name.
        pega.ui.ScreenInspector.setInspector(this);
        //Providing a custom callback for the data-ui-meta attribute selector.
        this.addSelector("[data-ui-meta]", function (element) {
            var data_ui_meta = element.getAttribute("data-ui-meta");
            if (data_ui_meta) {
                data_ui_meta = JSON.parse(data_ui_meta.replace(/'/g, "\""));
            }
            else {
                data_ui_meta = {
                    "type": "Cell",
                    "subType": "Custom"
                };
            }
            return data_ui_meta;
        });
    }
    /*
     * Creates a div for the infoBar with the control information.
     * @private
     * @function {_getInfobarContent}
     * @param    {String} infoMessage - Message/control name displayed on the infoBar
     * @return   {String} infoBarDiv - content div for the infoBar
     */
    ScreenInspector.prototype._getInfobarContent = function (infoMessage) {
        var infoBarDiv = "<div>\n                                            <div class='idpanel-text'>\n                                              <span class='runtime-tree-prefix'>" + infoMessage + "</span>\n                                            </div>\n                                            <div class='id-recorder-icon-container'>\n                                              <img src='webwb/pxAddAssertion.png' \ntitle = " + window.gStrMarkforassertiontooltip + " id = \"addexplicitassertion\"onclick='pega.ui.automation.recorder.showAssertionPanel(event)'></i>\n                                            </div>\n                                          </div>";
        return infoBarDiv;
    };
    /*
     * Gives the dimensions and position of the element. Also considers the iframes if there are any.
     * @private
     * @function {_getElementDimensions}
     * @param    {HTMLElement} htmlElement - Element for which position and dimensions are needed.
     * @param    {Window}      toWindow    - Current window
     */
    ScreenInspector.prototype._getElementDimensions = function (htmlElement, toWindow) {
        var isInModal = $(htmlElement).closest("#modalWrapper").length > 0;
        var currentWindow = htmlElement.ownerDocument.defaultView;
        var loc = {};
        // Get location of element in context of current window
        // Now account for scrolling of top-window (when you're not in an iframe)
        var elementOffset = htmlElement.getBoundingClientRect();
        loc.left = elementOffset.left + $(currentWindow).scrollLeft();
        loc.top = elementOffset.top + $(currentWindow).scrollTop();
        loc.width = elementOffset.width;
        loc.height = elementOffset.height;
        // Loop over each parent window until coming back to current window
        while (currentWindow) {
            if ((currentWindow == window || !currentWindow.parent) || (toWindow != null && currentWindow == toWindow)) {
                break;
            }
            else {
                //Get location of window in context of parent window
                var windowOffset = currentWindow.frameElement.getBoundingClientRect();
                loc.left += windowOffset.left;
                loc.top += windowOffset.top;
                // Factor in scroll location when you are in iframes as it unintentially throws the distance off further than from the perspective of the top-window
                if (htmlElement.ownerDocument.defaultView == currentWindow && !isInModal) {
                    // Only factor in scroll for non desktopWindow frame since in the desktopWindow it is covered by offset
                    loc.top -= $(currentWindow).scrollTop();
                    loc.left -= $(currentWindow).scrollLeft();
                }
                currentWindow = currentWindow.parent;
            }
        }
        return loc;
    };
    /*
    * Retunrs true if inspector is enabled else false
    * @private
    * @function {_isEnabled}
    * @return   {bool}
    */
    ScreenInspector.prototype._isEnabled = function () {
        if (this.inspectorHandler && this.inspectorHandler.isEnabled()) {
            return true;
        }
        return false;
    };
    /*
     * Returns a list of selector for which a function is registered to get the data-ui-meta
     * @private
     * @function  {_getSelectorList}
     * @return    {Array} selectorList
     */
    ScreenInspector.prototype._getSelectorList = function () {
        var selectorList = [];
        for (var selector in this.listOfSelectorToHighlight) {
            selectorList.push(selector);
        }
        return selectorList;
    };
    /*
     * Retunrs the meta data object of the closest ancestor filtered by the given selector
     * @private
     * @function    {_closestSelectorMetadata}
     * @param       {HTMLElement} element
     * @return      {Object} selectorMetaData
     */
    ScreenInspector.prototype._closestSelectorMetadata = function (element) {
        var selectorMetaData = null;
        if (!element || top.window.holdHighlight) {
            return null;
        }
        for (var slector in this.listOfSelectorToHighlight) {
            var closest = element.closest(slector);
            if (closest == element) {
                selectorMetaData = this.listOfSelectorToHighlight[slector](element);
                break;
            }
        }
        return selectorMetaData;
    };
    /*
     * callBack from the inspector to highlight the target.
     * @private
     * @function {_highlightCallback}
     * @param    {Object} elementData
     */
    ScreenInspector.prototype._highlightCallback = function (elementData) {
        if (elementData.foundElement) {
            var ele = elementData.foundElement;
            var inspector = pega.ui.ScreenInspector.getInspector("recorder");
            inspector.highlight(ele);
        }
    };
    /*
     * Create the instances of the inspector, highligher and infoBar common components and enables the
     * inspector to start inspecting the DOM elements on the UI.
     * @public
     * @function {enable}
     */
    ScreenInspector.prototype.enable = function () {
        if (this._isEnabled()) {
            return;
        }
        //Configuration setting for the inspector.
        this.inspectorConfig = {
            elementFoundCallback: this._highlightCallback,
            selectorList: this._getSelectorList(),
            ignoreList: this.blackListElements
        };
        //Creating instances
        this.highlightHandler = new pega.ui.inspector.Highlight("automation-Element-Highlighter");
        this.inspectorHandler = new pega.ui.components.Inspector(this.inspectorConfig);
        this.infoBarHandler = new pega.ui.inspector.InfoBar("automation-Element-Infobar", null, null, {});
        //Enabling the inspector
        this.inspectorHandler.enable();
    };
    /*
    * If the inspector is enabled, cleans up highlighter, removes infoBar from DOM and disbales the inspector.
    * @public
    * @function {disable}
    */
    ScreenInspector.prototype.disable = function () {
        if (!this._isEnabled()) {
            return;
        }
        this.highlightHandler.cleanup();
        this.infoBarHandler.removeFromDom();
        this.inspectorHandler.disable();
    };
    /*
     * highlights the element with assertion error.
     * @public
     * @function {highlightError}
     * @param    {HTMLElement} target - target element for the highlighter
     */
    ScreenInspector.prototype.highlightError = function (target) {
        var data_ui_meta = this._closestSelectorMetadata(target);
        var rect = this._getElementDimensions(target, pega.ui.inspector.getDesktopWindow());
        this.highlightHandler = new pega.ui.inspector.Highlight("automation-Element-Highlighter");
        this.highlightHandler.show(rect.left, rect.top, rect.width, rect.height);
    };
    /**
     * Clear the highlight.
     * @public
     * @function {clearHighlight}
     */
    ScreenInspector.prototype.clearHighlight = function () {
        if (this.highlightHandler) {
            this.highlightHandler.cleanup();
        }
    };
    /*
     * highlights the hovered element by setting the positions of the four edges.
     * Excutes the preHighlight callback, sets the highlight rect and inforbar, then executes the postHighlight callback.
     * @public
     * @function {highlight}
     * @param    {HTMLElement} target - target element for the highlighter
     */
    ScreenInspector.prototype.highlight = function (target) {
        var data_ui_meta = this._closestSelectorMetadata(target);
        if (!data_ui_meta) {
            return false;
        }
        try {
            //Set the last highlighted element to current element.
            if (this.lastHighlightedElement == null || this.lastHighlightedElement != target) {
                this.lastHighlightedElement = target;
            }
            else {
                return false;
            }
        }
        catch (e) {
            this.lastHighlightedElement = target;
        }
        //Give a call to pre highlight callback.
        if (this.preHighlightCallback && this.preHighlightCallbackContext) {
            this.preHighlightCallback.apply(this.preHighlightCallbackContext, [target, data_ui_meta]);
        }
        //Get the dimensions if the element and show the highlight rectangle
        var highlighterEle = $(".automation-Element-Highlighter");
        if (highlighterEle.hasClass("highlighter-warning")) {
            highlighterEle.removeClass("highlighter-warning");
        }
        var rect = this._getElementDimensions(target, pega.ui.inspector.getDesktopWindow());
        this.highlightHandler.show(rect.left, rect.top, rect.width, rect.height);
        //Set the inforbar
        var infobarContent = this._getInfobarContent(data_ui_meta.subType || data_ui_meta.type);
        this.infoBarHandler.overlayElem.classList.remove("infobar-warning");
        this.infoBarHandler.setContent(infobarContent);
        this.infoBarHandler.showByPosition(rect.left, rect.top, rect.width, rect.height);
        //Give a call to the post highlight callback.
        if (this.postHighlightCallback && this.postHighlightCallbackContext) {
            this.postHighlightCallback.apply(this.postHighlightCallbackContext, [target, data_ui_meta]);
        }
    };
    /*
     * Registers the pre highlight callback and its context.
     * @public
     * @function {registerPreHighlightCallback}
     * @param    {function} callback
     * @param    {Object}   contextObject
     */
    ScreenInspector.prototype.registerPreHighlightCallback = function (callback, contextObject) {
        this.preHighlightCallback = callback;
        this.preHighlightCallbackContext = contextObject;
    };
    /*
     * Registers the post highlight callback and its context.
     * @public
     * @function {registerPostHighlightCallback}
     * @param    {function} callback
     * @param    {Object}   contextObject
     */
    ScreenInspector.prototype.registerPostHighlightCallback = function (callback, contextObject) {
        this.postHighlightCallback = callback;
        this.postHighlightCallbackContext = contextObject;
    };
    /*
     * Registers a custom function for each selector to get the data-ui-meta
     * @public
     * @function {addSelector}
     * @param    {String}   selector
     * @param    {function} selectorFunction
     */
    ScreenInspector.prototype.addSelector = function (selector, selectorFunction) {
        if (typeof selectorFunction == 'function')
            this.listOfSelectorToHighlight[selector] = selectorFunction;
    };
    /*
     * Setter for the black list elements. These elements will not be highlighted by the highlighter.
     * @public
     * @function  {setBlackListedElement}
     * @param     {Array}   elements - Array of elements to be black listed.
     */
    ScreenInspector.prototype.setBlackListedElement = function (elements) {
        this.blackListElements = elements;
    };
    return ScreenInspector;
}());
pega = pega || {};
pega.ui = pega.ui || {};
//Immediately invoked function expression to create pega.ui.ScreenInspector.
pega.ui.ScreenInspector = pega.ui.ScreenInspector || (function () {
    var _inspector = null;
    var _name = null;
    /**
     * Returns an instance of the ScreenInspector
     * @function    {_getInspector}
     * @param       {String} name - Name of the screen inspector
     * @return      {ScreenInspector}
     */
    var _getInspector = function (name) {
        var ScreenInspector = _getTopHarnessInspector();
        return ScreenInspector.getInspectorObject(name);
    };
    /**
     * Stores the ScreenInspector instance and its name
     * @function    {_setInspector}
     * @param       {ScreenInspector} inspector - Instance of the ScreenInspector
     */
    var _setInspector = function (inspector) {
        _inspector = inspector;
        _name = inspector.name;
    };
    /**
     * Returns the ScreenInspector of the harness window
     * @function    {_getTopHarnessInspector}
     * @return      {ScreenInspector} - ScreenInspector of the harness window.
     */
    var _getTopHarnessInspector = function () {
        var harnessWindow = window;
        while (harnessWindow !== desktopwrappersupport_getDesktopWindow()) {
            //while (harnessWindow.pega.u.d.topHarness !== 'yes') {
            harnessWindow = harnessWindow.parent;
        }
        return harnessWindow.pega.ui.ScreenInspector;
    };
    /**
     * @function {_getInspectorObject}
     * @param       {String} name       -  Name of the screen inspector
     * @return      {ScreenInspector}   -  Instance of the ScreenInspector
     */
    var _getInspectorObject = function (name) {
        if (!name) {
            return _inspector;
        }
        if (_inspector && _inspector.name == name) {
            return _inspector;
        }
        _inspector = new ScreenInspector(name);
        _name = name;
        return _inspector;
    };
    //Functions exposed on the pega.ui.ScreenInspector
    return {
        getInspector: _getInspector,
        setInspector: _setInspector,
        getInspectorObject: _getInspectorObject
    };
})();
//static-content-hash-trigger-YUI
/**
 * Assertor module to hold api related to performing assertions on automatable elements
 */
pega.ui.automation.assertor = (function() {
    /**
     * API to perfom assertions on given assertions in step object
     * Call component specific handler to do assertions
     *
     * @param      {<type>}  stepObj  The step object
     * @return     {<type>}  { description_of_the_return_value }
     */
    function _performAssertion(stepObj) {
      try {
        if (!stepObj) {
            console.debug("Invalid Step Page Passed");
            return;
        }

        var componentType = stepObj[pega.ui.automation.constants.COMPONENT_TYPE];

        var componentAssertor = pega.ui.automation.manager.getAssertor(componentType);

        return componentAssertor.doAssertion(stepObj);
      } catch(err) {
        console.error(err);
        pega.ui.EventsEmitter.publish("abortTestExecution", err);
      }
    }
    

    return {
        performAssertion: _performAssertion
    }
})();

/**
 * Default assertor component on which other components should extend and overrite if any
 */
pega.ui.automation.assertor.defaultComponent = (function() {
    var _constants = pega.ui.automation.constants;

    function _doAssertion(stepObj) {
        console.debug("Invoking default assertion");
        var assertionResults = [];
        var assertionResult = {};
        assertionResults.push(assertionResult);
        assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.PASSED;
        //get dom element from selector
        var assertionElemPromise = pega.ui.automation.utils.getDomElementPromise(stepObj[_constants.DOM_SELECTOR], true);
        var _this = this;
        return assertionElemPromise.then(function(assertionElem) {
            if (!assertionElem) {
                assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.FAILED;
                assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "Element not found with given selector";
                assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.DOM;

                var selector = pega.ui.automation.utils.constructSelector(stepObj[_constants.DOM_SELECTOR]);
                assertionResult[_constants.STEP_RESULT.SELECTOR] = selector;
            } else {
                var domAssertionResult = _this.doAssertionsOnDomElement(assertionElem, stepObj);
                if (domAssertionResult) {
                    assertionResults = domAssertionResult;
                }
                assertionElem = null;
            }
            return assertionResults;
        });

    }

    /**
     * Populates available assertion options in store manager
     * These options will be available when use wants to update assertion options for a step
     *
     * @param      {<type>}  assertionElem  The assertion element
     * @param      {<type>}  stepObj        The step object
     */
    function _populateAssertionOptions(assertionElem, stepObj) {
        var assertionOptionsAvailable = pega.ui.automation.recorder.translator.getConfigOptions(stepObj[_constants.COMPONENT_TYPE], assertionElem);
        if (assertionOptionsAvailable && assertionOptionsAvailable.length > 0) {
            var updatedAssertionOptions = _getUpdatedOptionsAvailable(stepObj[_constants.ATTRIBUTES], assertionOptionsAvailable);
            if (updatedAssertionOptions && updatedAssertionOptions.length > 0) {
                console.debug("New assertion options available on the dom: ", updatedAssertionOptions);
                var stepInd = pega.ui.automation.storeManager.getCurrentStepIndex();
                stepInd--;
                var stepMetaData = pega.ui.automation.storeManager.getTestCaseStepMeta(stepInd) || {};
                stepMetaData["assertionOptions"] = updatedAssertionOptions;
                delete stepMetaData["isUpdated"];
                pega.ui.automation.storeManager.setTestCaseStepMeta(stepInd, stepMetaData);
            }
        }
    }


    function _getUpdatedOptionsAvailable(savedAssertions, newAssertions) {
        if (!savedAssertions || savedAssertions.length == 0) {
            return newAssertions;
        }
        var tmpSavedAssertions = {};
        for (var i = 0; i < savedAssertions.length; i++) {
            var savedAssertionDesc = savedAssertions[i][_constants.ATTRIBUTE_DESC];
            if (!tmpSavedAssertions[savedAssertionDesc]) {
                tmpSavedAssertions[savedAssertionDesc] = savedAssertions[i];
            }
        }

        var updateOptions = 0;
        for (i = 0; i < newAssertions.length; i++) {
            var newAssertionDesc = newAssertions[i][_constants.ATTRIBUTE_DESC];
            if (tmpSavedAssertions[newAssertionDesc]) {
                if (tmpSavedAssertions[newAssertionDesc][_constants.ATTRIBUTE_NAME] != newAssertions[i][_constants.ATTRIBUTE_NAME] ||
                    tmpSavedAssertions[newAssertionDesc][_constants.ATTRIBUTE_VALUE] != newAssertions[i][_constants.ATTRIBUTE_VALUE]) {
                    updateOptions++;
                }
                //Delete from tmp map since we are returning newAssertions
                delete tmpSavedAssertions[newAssertionDesc];
            }
        }

        if (updateOptions == 0 && savedAssertions.length >= newAssertions.length) {
            //Both are same and no updated options available
            return null;
        }

        //newAssertions are available and should be merged with remaining from temp map
        for (var savedDesc in tmpSavedAssertions) {
            newAssertions.push(tmpSavedAssertions[savedDesc])
        }
        return newAssertions;
    }

    /**
     * Perform assertions on given element.
     *
     * @param      {<type>}  assertionElem  The assertion element
     * @param      {string}  stepObj        The step object
     * @return     {Array}   { description_of_the_return_value }
     */
    function _doAssertionsOnDomElement(assertionElem, stepObj) {

        var mode = pega.ui.automation.storeManager.getExecutorMode();
        if (mode == "debug") {
            _populateAssertionOptions(assertionElem, stepObj);
        }

        var assertions = stepObj[_constants.ASSERTIONS];
        if (!assertions || assertions.length <= 0) {
            return null;
        }
        var assertionResults = [];

        for (var i = assertions.length - 1; i >= 0; i--) {
            var assertionResult = {};
            var currentAssertion = assertions[i];

            //Gets the matcher
            var assertedMatcher = currentAssertion[pega.ui.automation.constants.COMPARATOR];
            var matcher = pega.ui.automation.assertor.matchers.getMatcher(assertedMatcher);

            if (!matcher) {
                console.debug("No matcher found for : " + assertedMatcher);
                assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.FAILED;
                assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "No matcher found with " + assertedMatcher;
                assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL;
                assertionResult[_constants.STEP_RESULT.FAILURE_CODE] = _constants.STEP_RESULT.FAILURE_CODES.MACTHER;
            } else {
                assertionResult = matcher.matches(currentAssertion, assertionElem, stepObj[_constants.COMPONENT_TYPE]);
                console.debug("assertionResult: " + assertionResult);
            }

            assertionResults.push(assertionResult);
        }

        return assertionResults;
    }

    return {
        doAssertion: _doAssertion,
        doAssertionsOnDomElement: _doAssertionsOnDomElement
    }

})();

pega.ui.automation.manager.registerAssertor(pega.ui.automation.constants.COMPONENT.DEFAULT, pega.ui.automation.assertor.defaultComponent);
//static-content-hash-trigger-YUI
/**
 * Matcher module to hold list of supported matchers and their handlers
 */
pega.ui.automation.assertor.matchers = (function() {
    var _constants = pega.ui.automation.constants;
    //List of matchers
    var _matchers = {
        "Is Equal": {
            matches: function(matchObj, domElement, componentName) {
                var assertionResult = {}
                var attributeName = matchObj[_constants.ATTRIBUTE_NAME];
                var attributeDesc = matchObj[_constants.ATTRIBUTE_DESC];
                var expectedValue = matchObj[_constants.EXPECTED_VALUE] || "";
                try {
                    var actualValue;
                    var portalWindow = pega.ui.automation.utils.getPortalWindow();
                     if(expectedValue.indexOf("D_pyScenerioTestData") == 0){
                       expectedValue = portalWindow.pega.ui.ClientCache.find(expectedValue).getValue();
                     }
                    actualValue = pega.ui.automation.utils.getConfiguredDomValue(componentName, domElement, matchObj);
                } catch (err) {
                    assertionResult[_constants.STEP_RESULT.STATUS] = "failed";
                    assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "Internal JS error: " + err.message;
                    assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL;
                    assertionResult[_constants.STEP_RESULT.FAILURE_CODE] = _constants.STEP_RESULT.FAILURE_CODES.CODE;
                }


                // Expected value if empty then step will not hold property so treat 
                // it as EMPTY
                

                assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.PASSED;
                assertionResult[_constants.STEP_RESULT.ACTUAL_VALUE] = actualValue;
                if (actualValue != null && actualValue != undefined) {
                    actualValue = actualValue.toString();
                }
                if (!_isEqual(actualValue, expectedValue)) {
                    assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.FAILED;
                    assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "Expected: " + expectedValue + ", but got Actual: " + actualValue;
                    assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.ASSERTOR;
                }

                return assertionResult;
            }
        },
        "Contains": {
            matches: function(matchObj, domElement, componentName) {
                console.log("Matcher called for Contains");
                var assertionResult = {}

                var expectedContent = matchObj[_constants.EXPECTED_VALUE];

                if (expectedContent.trim().length == 0) {
                    assertionResult[_constants.STEP_RESULT.STATUS] = "failed";
                    assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "Empty String is provided.";
                    assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL;
                    assertionResult[_constants.STEP_RESULT.FAILURE_CODE] = _constants.STEP_RESULT.FAILURE_CODES.CODE;
                    return assertionResult;
                }
                try {
                    var actualContent = pega.ui.automation.utils.getConfiguredDomValue(componentName, domElement, matchObj);

                } catch (err) {
                    assertionResult[_constants.STEP_RESULT.STATUS] = "failed";
                    assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = "Internal JS error: " + err.message;
                    assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL;
                    assertionResult[_constants.STEP_RESULT.FAILURE_CODE] = _constants.STEP_RESULT.FAILURE_CODES.CODE;
                    return assertionResult;
                }

                assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.PASSED;
                assertionResult[_constants.STEP_RESULT.ACTUAL_VALUE] = actualContent;

                //TODO : Once design uses multiselect expected content should be read from EXPECTED_VALUE_LIST
                // and two arrays should be compared
                if (actualContent.indexOf(expectedContent.trim()) == -1) {
                    assertionResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.FAILED;
                    assertionResult[_constants.STEP_RESULT.FAILURE_REASON] = actualContent + " does not contains " + expectedContent;
                    assertionResult[_constants.STEP_RESULT.FAILURE_TYPE] = _constants.STEP_RESULT.FAILURE_TYPES.ASSERTOR;
                }

                return assertionResult;
            }
        }

    }

    function _getMatcher(matcherType) {
        return _matchers[matcherType];
    }

    function _isEqual(actualValue, expectedValue) {
        if (expectedValue.search(/{(.*?)}/) > -1) {
            // is dynamic value : contains {}
            expectedValue = expectedValue.replace(/\$/g, "\\$");
            expectedValue = expectedValue.replace(/{(.*?)}/g, "(.*?)");
            var regEx = new RegExp(expectedValue);
            return regEx.test(actualValue);
        }
        if (expectedValue.search(/_pa\d+pz/) > -1) {
            // has param DP reference : contains _pa123pz*
            expectedValue = expectedValue.replace(/\$/g, "\\$");
            expectedValue = expectedValue.replace(/_pa\d+pz/g, "_pa(\\d+)pz");
            var regEx = new RegExp(expectedValue);
            return regEx.test(actualValue);
        }
        return actualValue == expectedValue;
    }

    return {
        getMatcher: _getMatcher
    }
})();
//static-content-hash-trigger-YUI
/**
 * Description : A self invoking function which creates public API's on pega.ui.automation.navigator to 
 * handle the events on the UI elements. These events are called navigations in a step object
 * @return {object}   Public API's to handle the event execution while executing a step.
 */
pega.ui.automation.navigator = (function() {
    var _constants = pega.ui.automation.constants;
    /**
     * [_setFailureResult]
     * Description : Sets the failure result in the navigationResult object.
     * @param {object}      navigationResult    navigationResult object
     * @param {string}      message             Failue message
     * @param {string}      type                Failure type
     * @param {string}      code                Failure code
     * @param {string}      selector            Selector of the element if element not found
     */
    function _setFailureResult(navigationResult, message, type, code, selector) {
        navigationResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.FAILED;
        navigationResult[_constants.STEP_RESULT.FAILURE_REASON] = message;
        navigationResult[_constants.STEP_RESULT.FAILURE_TYPE] = type;
        if (code) {
            navigationResult[_constants.STEP_RESULT.FAILURE_CODE] = code;
        }
        if (selector) {
            navigationResult[_constants.STEP_RESULT.SELECTOR] = selector;
        }
    }

    /**
     * [_createCase]
     * Description : Creates a case from class name and the flow name defined in the stepobj.
     * @param  {object}     stepObj     Step object of the current step under execution.
     * @return {Promise}    
     */
    function _createCase(stepObj) {
        var createCasePromise = new Promise(function(resolutionFunc) {
            var className = stepObj[_constants.CASE_CLASS_NAME];
            var flowName = stepObj[_constants.CASE_FLOW_NAME];
            var navigationResult = {};
            navigationResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.PASSED;
            try {
                /*Create the case after 3 sec wait time. This timeout is added for aiding the Dev Studio launch where 
                  the portal has to be loaded in the iframe before executing the steps. Running steps Without waiting 
                  for portal load leads to test failures.*/
                setTimeout(function() {
                    pega.desktop.createNewWork(className, null, flowName);
                    resolutionFunc([navigationResult]);
                }, 3000);
            } catch (err) {
                //In case of an exception, set the failue status in the navigation result.
              console.error(err); 
              _setFailureResult(navigationResult, "Internal JS error: " + err.message, _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL, _constants.STEP_RESULT.FAILURE_CODES.CODE);
                resolutionFunc([navigationResult]);
                pega.ui.EventsEmitter.publish("abortTestExecution", err);
            }
        });
        createCasePromise.then(function(navresult) {
            return navresult;
        });
        return createCasePromise;
    }

    /**
     * [_performAction]
     * Description : Depending on the type of the step, initiates a call to the corresponding perform action.
     * @param  {object}     stepObj         Step object of the current step under execution.
     * @return {Promise}
     */
    function _performAction(stepObj) {
      try {
        if (!stepObj) {
            console.debug("Step information unavailable");
            return;
        }
        if (stepObj[_constants.IS_CUSTOM_STEP] === "true") {
            //Handling for custom steps
            if (stepObj[_constants.CUSTOM_TYPE] === "case") {
                //Create case as step
                return _createCase(stepObj);
            }
        } else {
            return _performComponentAction(stepObj);
        }
        } catch (err) {
          console.error(err);
          pega.ui.EventsEmitter.publish("abortTestExecution", err);
        }
    }

    /**
     * [_performComponentAction]
     * Description : Performs the action which is specific to the component on which is event is generated.
     * @param  {object}     stepObj         Step object of the current step under execution.
     * @return {Promise}    
     */
    function _performComponentAction(stepObj) {
        var componentNavPromise = new Promise(function(resolutionFunc) {
            var navigationResults = [];
            var actionElemPromise = pega.ui.automation.utils.getDomElementPromise(stepObj[_constants.DOM_SELECTOR], true);
            actionElemPromise.then(function(actionElem) {
                var navigators = [];
                if (stepObj[_constants.NAVIGATORS]) {
                    navigators = stepObj[_constants.NAVIGATORS];
                } else {
                    navigators.push(stepObj[_constants.NAVIGATOR]);
                }
                //If the action element is not found in the DOM, then set the navigation failure and resolve the promise.
                if (!actionElem) {
                    //-ve case where action element is not found. Send same failure message for all the actions
                    var navigationResult = {};
                    var selector = pega.ui.automation.utils.constructSelector(stepObj[_constants.DOM_SELECTOR]);
                    _setFailureResult(navigationResult, "Element not found with given selector", _constants.STEP_RESULT.FAILURE_TYPES.DOM, null, selector);
                    for (var i = 0; i < navigators.length; i++) {
                        navigationResults.push(navigationResult);
                    }
                    resolutionFunc(navigationResults);
                } else {
                    //If the action element is found.
                    var componentType = stepObj[_constants.COMPONENT_TYPE];
                    var componentNavigator = pega.ui.automation.manager.getNavigator(componentType);
                    //If there is no navigator associated to the component, action can not be executed.
                    //Set the failure result and resolve the promise.
                    if (!componentNavigator) {
                        //-ve case where component navigator is not found. 
                        //Send same failure message for all the actions
                        var navigationResult = {};
                        console.log("No navigator found with component type : " + componentType);
                        _setFailureResult(navigationResult, "Internal Error: No navigator found for " + componentType, _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL, _constants.STEP_RESULT.FAILURE_CODES.CODE);
                        for (var i = 0; i < navigators.length; i++) {
                            navigationResults.push(navigationResult);
                        }
                        resolutionFunc(navigationResults);
                    } else {
                        $(actionElem).focus();
                        // Call actual component doaction
                        _fireComponentAction(componentType, stepObj[_constants.DOM_SELECTOR], navigators, 0, navigationResults, actionElem, resolutionFunc);
                    }
                }
            });
        });
        componentNavPromise.then(function(navresult) {
            return navresult;
        });
        return componentNavPromise;
    }

    /**
     * [_fireComponentAction]
     * Description : Fires the event on the element by call the doAction on the components navigator.
     * @param  {string}       componentType
     * @param  {string}       selector
     * @param  {Array}        navigators
     * @param  {Number}       actionIndex
     * @param  {object}       navigationResults
     * @param  {Element}      actionElem
     * @param  {Function}     promiseResolutionFunc
     */
    function _fireComponentAction(componentType, selector, navigators, actionIndex, navigationResults, actionElem, promiseResolutionFunc) {
       try {
        var navigationResult = {};
        navigationResults.push(navigationResult);
        navigationResult[_constants.STEP_RESULT.STATUS] = _constants.STEP_RESULT.PASSED;
        var actionCb = function() {};
        if (actionIndex === navigators.length - 1) {
            actionCb = function() {
                promiseResolutionFunc(navigationResults);
            };
        }
            var actionName = navigators[actionIndex][_constants.NAVIGATOR_ACTION_NAME];
            //If the action is change, 
            if (actionName === _constants.ACTION_NAMES.CHANGE) {
                //Get the value
                var actionValue = navigators[actionIndex][_constants.NAVIGATOR_ACTION_VALUE] || "";
                //If the test data is available through the data page, that takes the priority.
                if (actionValue && actionValue.indexOf("D_pyScenerioTestData") === 0) {
                    var portalWindow = pega.ui.automation.utils.getPortalWindow();
                    actionValue = portalWindow.pega.ui.ClientCache.find(actionValue).getValue();
                }
            }
            if (actionName) {
                //Fire the doAction on the navigator of the component.
                pega.ui.automation.manager.getNavigator(componentType).doAction(actionElem, actionName, actionValue, actionCb);
            } else{
                actionCb();
            }
            //If there are more actions to be fired on the same element.
            if (actionIndex < navigators.length-1) {
                //This callback gets called when the doc state tracker status sets back to idle from busy.
                //It means execution of an action is completed and next action can be fired by resuming the navigator.
                pega.ui.automation.stateManager.queueOrFireClientIdleCallback(function() {
                    var nextActionIndex = actionIndex + 1;
                    var publishData = {};
                    publishData.componentType = componentType;
                    publishData.selector = selector;
                    publishData.navigators = navigators;
                    publishData.actionIndex = nextActionIndex;
                    publishData.navigationResults = navigationResults;
                    publishData.actionElem = actionElem;
                    publishData.promiseResolutionFunc = promiseResolutionFunc;
                    pega.ui.EventsEmitter.publish("ResumeNavigatorAction", publishData);
                });
            } else {
                 actionCb();
            }
        } catch (err) {
          console.error(err);
            _setFailureResult(navigationResult, "Internal JS error: " + err.message, _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL, _constants.STEP_RESULT.FAILURE_CODES.CODE);  
            pega.ui.EventsEmitter.publish("abortTestExecution", err);
        }
    }

    /**
     * [_resumeComponentAction]
     * Description : Resumes the execution of navigations. This gets called when there are multiple navigations
     * on the same element/step. After completing each navigation, this function is called to fire the next one.
     * @param  {object}       data                        Navigations data
     *                        data.componentType          Component type of the element
     *                        data.selector               Selector for the element
     *                        data.navigators             All the navigators in the current step
     *                        data.actionIndex            Next action index. Indes in the navigators list
     *                        data.navigationResults      Results of the navigations executed in this step
     *                        data.actionElem             Action element
     *                        data.promiseResolutionFunc  Promise resolutionFunc
     */
    function _resumeComponentAction(data) {
        var actionElem = data.actionElem;
        if (actionElem && $(actionElem).is(":visible") && $(actionElem).closest('body').length > 0) {
            pega.ui.automation.navigator.fireComponentAction(data.componentType, data.selector, data.navigators, data.actionIndex, data.navigationResults, actionElem, data.promiseResolutionFunc);
            actionElem = null;
        } else {
            var actionElemPromise = pega.ui.automation.utils.getDomElementPromise(data.selector, true);
            actionElemPromise.then(function(actionElem) {
                pega.ui.automation.navigator.fireComponentAction(data.componentType, data.selector, data.navigators, data.actionIndex, data.navigationResults, actionElem, data.promiseResolutionFunc);
                actionElem = null;
            });
        }
    }

    return {
        performAction: _performAction,
        resumeComponentAction: _resumeComponentAction,
        fireComponentAction: _fireComponentAction
    }
})();
pega.ui.EventsEmitter.subscribe("ResumeNavigatorAction", pega.ui.automation.navigator.resumeComponentAction);


/**
 * A default navigator which other custom navigators can extend.
 * @return {object}   Returns the object of functions that are added on the pega.ui.automation.navigator.defaultComponent
 * namespace which can be extended for the custom navigators.
 */
pega.ui.automation.navigator.defaultComponent = (function() {
    var _constants = pega.ui.automation.constants;
    /**
     * [_doAction]
     * Triggers defined action on components target element.
     * @param      {Element}    actionElem          Element on which the action is performed
     * @param      {string}     actionName          Name of the action, like "change"
     * @param      {string}     actionValue         Value coesponding to the action
     * @param      {Function}   actionCallback      Callback to be called after performing the action.
     */
    function _doAction(actionElem, actionName, actionValue, actionCallback) {
        console.log("Invoking default component action");
        //Use setProperty instead of firing event for input elements, this internally handles all type of controls.
        if (actionName === _constants.ACTION_NAMES.CHANGE && (actionElem.type != "button" || actionElem.type != "submit")) {
            if (window === actionElem.ownerDocument.defaultView) {
                pega.u.d.setProperty(actionElem.name, actionValue);
            } else {
                actionElem.ownerDocument.defaultView.pega.u.d.setProperty(actionElem.name, actionValue);
            }
        } else {
            //If the event is contextmenu, fireTopPriorityEvent doesn't handle it.
            //Create and dispatch the event directly on the target element.
            if (actionName === _constants.ACTION_NAMES.CONTEXTMENU) {
                var contextMenuEvent = document.createEvent('Event');
                contextMenuEvent.initEvent(_constants.ACTION_NAMES.CONTEXTMENU, true, true);
                actionElem.dispatchEvent(contextMenuEvent);
            } else {
                pega.control.actionSequencer.fireTopPriorityEvent(actionElem, actionName);
            }
        }
        actionCallback && actionCallback();
    }
    return {
        doAction: _doAction
    }
})();
pega.ui.automation.manager.registerNavigator(pega.ui.automation.constants.COMPONENT.DEFAULT, pega.ui.automation.navigator.defaultComponent);
//static-content-hash-trigger-YUI
pega.ui.automation.recorder = pega.ui.automation.recorder || {};

/**
 * Stepbuilder module to hold apis related to creating a step page in clipboard
 *
 */
pega.ui.automation.recorder.stepbuilder = (function() {

    var BASE_REF = "base_ref";
    var FULL_BASE_REF = "full_base_ref";
    var PARENT_SELECTOR_ATTR = "parentSelectorAttr";
    var PARENT_SELECTOR_ELEM = "parentSelectorElem";
    var STEP_OBJ_PARAM_NAME = "stepObj";
    var EDGE_PANEL_MAIN_WRAPPER_SECTION = "pzAutomationRecorderWrapper";
    var EDGE_PANEL_WRAPPER_REFRESH_PRE_ACT = "pxCreateFunctionalTestCaseStep";
    var EDGE_PANEL_CONTENT_SELECTOR = "div.runtime-recorder-panel";
    var MOUSEOVER_EVENT_TYPE = "mouseover";

    var _constants = pega.ui.automation.constants;
    var _eventType = null;
    var _eventTarget = null;
    var CURRENT_STEP_PAGE = null;

    function _setEventData(eventType, eventTarget) {
        _eventType = eventType;
        _eventTarget = eventTarget;
    }

    function _resetEventData() {
        _eventType = null;
        _eventTarget = null;
    }

    function _getEventType() {
        return _eventType;
    }

    function _getEventTarget() {
        return _eventTarget;
    }

    function _setCurrentStepPage(stepObj) {
        var protalWindow = pega.ui.automation.utils.getPortalWindow();
        if (protalWindow != window && protalWindow.pega && protalWindow.pega.ui.automation && protalWindow.pega.ui.automation.recorder.stepbuilder) {
            protalWindow.pega.ui.automation.recorder.stepbuilder.setCurrentStepPage(stepObj);
        } else {
            CURRENT_STEP_PAGE = stepObj;
        }
        protalWindow = null;
    }

    function _getCurrentStepPage() {
        var protalWindow = pega.ui.automation.utils.getPortalWindow();
        if (protalWindow != window && protalWindow.pega && protalWindow.pega.ui.automation && protalWindow.pega.ui.automation.recorder.stepbuilder) {
            return protalWindow.pega.ui.automation.recorder.stepbuilder.getCurrentStepPage();
        } else {
            return CURRENT_STEP_PAGE
        }
        protalWindow = null;
    }

    function _clearCurrentStepPage() {
        var protalWindow = pega.ui.automation.utils.getPortalWindow();
        if (protalWindow != window && protalWindow.pega && protalWindow.pega.ui.automation && protalWindow.pega.ui.automation.recorder.stepbuilder) {
            protalWindow.pega.ui.automation.recorder.stepbuilder.clearCurrentStepPage();
        } else {
            CURRENT_STEP_PAGE = null;
            var popoverElem = $('.assertor-popover')[0];
            if (popoverElem && popoverElem.po) {
                popoverElem.po.close();
            }
        }
        protalWindow = null;

    }

    /**
     * Determines if stepbuilder overlay is already present.
     *
     * @return     {boolean}  True if stepbuilder overlay present, False otherwise.
     */
    function _isStepbuilderOverlayPresent() {
        //Update w
        var overlayPanel = pega.ui.automation.utils.findElementAcrossFrames("[node_name='pyDefaultStepBuilder'][uniqueid]");
        return !!overlayPanel.length;
    }

    function _dismissStepbuilderOverlay() {
        //Clear previous step
        _clearCurrentStepPage();
        //TODO: Code to close overlay and clear clipboard step as well
    }

    function _validateBuildStepScenario(selectedElement, componentName, isImplicitSave) {

        var valid = { "isValid": true };
        if (_isStepbuilderOverlayPresent()) {
            // Overlay is present already
            //Dismiss overlay
            _dismissStepbuilderOverlay();
            //Remove this code and allow user to create step
            //Disimissing overlay should take care of clearing clipboard step created
            console.log("Close the edge pane and proceed with any new assertion");
            if (isImplicitSave) {
                valid["isValid"] = false;
            }

        }
        return valid;
    }

    function _validateCurrentStep(currentStepObj, currentSelectedElement, componentName) {
        var valid = { "isValid": true };
        var previousStepMetaData = _getCurrentStepPage();
        if (!previousStepMetaData) {
            valid["isValid"] = false;
            return valid;
        }
        if (previousStepMetaData["doNotCreateNextStep"]) {
            console.log("Do not create this step since it is fired witin");
            valid["isValid"] = false;
            return valid;
        }

        var componentStepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        return componentStepbuilder.validateComponentCurrentStep(previousStepMetaData, currentStepObj, currentSelectedElement);
    }

    function _buildStepObject(selectedElement, componentName, isImplicitSave) {
        var stepObject = {};
        console.log("**** Creating new step ****");
        //build component step data
        var stepObject = _buildComponentStepData(selectedElement, componentName, isImplicitSave);

        return stepObject;
    }

    /**
     * Builds a component step data.
     * Calls component specific stepbuilder and build step data with assertions/navigations
     *
     * @param      {<type>}   selectedElement  The selected element
     * @param      {<type>}   componentName    The component name
     * @param      {boolean}  isImplicitSave   Indicates if implicit save
     * @return     {<type>}   The component step data.
     */
    function _buildComponentStepData(selectedElement, componentName, isImplicitSave) {
        var componentdata = {};

        componentdata[_constants.COMPONENT_TYPE] = componentName;

        if (componentName != "DYNAMICREPEATING" && _isReadOnlyComponent(selectedElement, componentName)) {
            componentName = pega.ui.automation.constants.COMPONENT.DISPLAY_TEXT;
        }

        var componentStepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        if (!componentStepbuilder) {
            return null;
        }
        var inspectableElement = componentStepbuilder.getTargetElement(selectedElement, _getEventTarget());
        if (!inspectableElement) {
            //Element is in read mode (Grid row case). Record step of parent (Grid row)
            var parentInspectableElementData = pega.ui.automation.recorder.getValidInspactableElementData(selectedElement.parentElement);
            if (parentInspectableElementData && parentInspectableElementData["inspectorData"]) {
                var parentComponentName = pega.ui.automation.recorder.getComponentName(parentInspectableElementData["inspectorData"]);
                if (parentComponentName && parentInspectableElementData["selectedElement"]) {
                    _buildAndSaveStep(parentInspectableElementData["selectedElement"], parentComponentName, _getEventType());
                    return null;
                }
            }

        }
        if (!inspectableElement) {
            _updateHighlighter("Unable to record this element as this is<br>an unsupported element or has an invalid DOM structure");
            return null;
        }

        componentStepbuilder.updateComponentSpecificData(componentdata, inspectableElement, _getEventType(), isImplicitSave, _getEventTarget());

        _buildAssertionsAndNavigations(componentdata, inspectableElement, isImplicitSave, componentName);

        var selector = _getSelectorObject(componentStepbuilder, inspectableElement);

        if (!selector) {
            _updateHighlighter(window.gStrDuplicateTestIDMsg);
            return null;
        }
        componentdata[_constants.DOM_SELECTOR] = selector;

        return componentdata;
    }

    function _getSelectorObject(componentStepbuilder, inspectableElement) {
        var selector = null;
        if (componentStepbuilder.customQuerySelector) {
            selector = { "pyPath": componentStepbuilder.customQuerySelector };
            //TODO Remove documentContext
            if (!pega.ui.automation.utils.isUniqueSelector(componentStepbuilder.customQuerySelector, null, null, inspectableElement)) {
                _updateHighlighter(window.gStrDuplicateTestIDMsg);
                return null;
            }
            var containers = pega.ui.automation.utils.getContainersInfo(inspectableElement);
            if (containers && containers.length > 0) {
                selector["pyContainers"] = containers;
            }
        } else {
            //Generate selector object
            selector = pega.ui.automation.utils.generateSelector(inspectableElement, componentStepbuilder.customSelectorAttributes);
        }

        return selector;
    }

    function _isReadOnlyComponent(selectedElement, componentName) {
        var stepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        if (stepbuilder && stepbuilder.isReadonlySupported != null) {
            return stepbuilder.isReadonlySupported;
        }
        var isReadonly = selectedElement.querySelector(".dataValueRead");
        if (!isReadonly && pega.ui.automation.utils.hasClass(selectedElement, "dataValueRead")) {
            //dataValueRead class is present on cell element
            //this case occurs in case of actionable elements (like buttons) and some datetime(as dropdown) readonly format
            //Assuming that all editable controls does not have implicitNavigations
            //In future if there is any editable control has implicit navigations, this condition should be updated
            if (stepbuilder && !stepbuilder.implicitNavigations) {
                isReadonly = true;
            }
        }
        return !!isReadonly;
    }

    function _updateHighlighter(message) {
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        var infoBarele = portalWindow.$(".automation-Element-Infobar");
        var highlighterEle = portalWindow.$(".automation-Element-Highlighter");
        //console.error("No unique selector found for selected element");
        infoBarele.addClass("infobar-warning").find(".runtime-tree-prefix").html(message);
        infoBarele.find(".id-recorder-icon-container").hide();
        highlighterEle.addClass("highlighter-warning");
        var topVal = parseInt(infoBarele.css('top'));
        infoBarele.css('top', topVal - 19);
    }

    function _setRecorderStepIndex(selectedElement) {
        var recoderStepIdex = _recordStepIndex();
        selectedElement.setAttribute("data-aftrecorder-index", recoderStepIdex);
    }
    /**
     * API to show overlay to add additional assertions
     * @param      {HTMLElement}  selectedElement  The selected element
     * @param      {String}       componentName    The component name
     * @param      {String}       eventType
     */
    function _showAssertorPopover(selectedElement, componentName, eventType, eventTarget) {
        var valid = _validateBuildStepScenario(selectedElement, componentName);
        if (valid["isValid"] == false) {
            return;
        }
        _setEventData(eventType, eventTarget);
        stepObj = _buildStepObject(selectedElement, componentName);
        _resetEventData();
        if (!stepObj) {
            return;
        }
        var strNewUrl = SafeURL_createFromEncryptedURL(pega.u.d.url);
        var postData = new SafeURL();

        var preActivity = EDGE_PANEL_WRAPPER_REFRESH_PRE_ACT;

        var validateStep = _validateCurrentStep(stepObj, selectedElement, componentName);

        if (validateStep["forceUpdateActions"] == true || validateStep["updateActions"] == true) {
            preActivity = "pxUpdateFunctionalTestCaseStep";
            _setCurrentStepPage({ "data": stepObj, "selectedELem": selectedElement, "stepType": _constants.STEP_TYPE.EXPLICIT });

        } else {
            _setRecorderStepIndex(selectedElement);
        }
        _setCurrentStepPage({ "data": stepObj, "selectedELem": selectedElement, "stepType": _constants.STEP_TYPE.EXPLICIT });
        if (typeof(strNewUrl.hashtable['pzFromFrame']) != 'undefined') {
            strNewUrl.hashtable['pzFromFrame'] = "";
        }
        strNewUrl.put("pyActivity", "reloadSection");
        strNewUrl.put("StreamName", "pzDefaultStepBuilderWrapper");
        strNewUrl.put("StreamClass", "Rule-HTML-Section");
        strNewUrl.put("BaseReference", 'pxRequestor.pxAutomationRecorder');
        strNewUrl.put("UITemplatingStatus", "N");
        strNewUrl.put("PreActivity", preActivity);
        postData.put(STEP_OBJ_PARAM_NAME, JSON.stringify(stepObj));

        strNewUrl.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);

        // Get rule page name and pass it as a parameter.
        var prXML = $.parseXML($("#PRXML").text().trim());
        var pageName = $(prXML).find("pyPageName").text();
        if (!pageName) {
            pageName = strNewUrl.get("pzPrimaryPageName");
        }
        pega.u.d.usesModalTemplate = false;

        var callback = {
            success: function(oResponse) {
                strResponse = oResponse.responseText;
                var trackersMap = pega.ui.ChangeTrackerMap.getTrackers();
                for (var threadName in trackersMap) {
                    var currentTracker = trackersMap[threadName];
                    currentTracker.parseForChangeTrackerDiv(strResponse, false);
                }
                _rtepopOver = pega.u.d.getPopOver(selectedElement);
                if (typeof _rtepopOver == "object") {

                    var myDom = $("<div>" + strResponse + "</div>")[0];
                    _rtepopOver.open({
                        content: {
                            type: 'domElement',
                            element: myDom
                        },
                        bindings: {
                            associatedElement: selectedElement
                        },
                        buttons: {
                            ok: false,
                            cancel: false
                        },
                        position: {
                            fieldAttach: 'leftBottom',
                            popOverAttach: 'leftTop'
                        },
                        visual: {
                            contentClass: 'assertor-popover'
                        },
                        callbacks: {
                            onClose: this.popoverCloseCallback
                        }
                    });
                }
            },
            failure: function(oResponse) {
                alert("Modal Dialog: Ajax Call For Modal Dialog Failure!");
            },
            scope: this
        }
        var request = pega.u.d.asyncRequest('POST', strNewUrl, callback, postData.toEncodedPostBody());
        pega.util.Connect.handleReadyState(request, callback);
        event && event.stopPropagation && event.stopPropagation();


    }


    function _refreshSteps() {
        var sURL = new SafeURL();
        var stepsSection = pega.u.automation.utils.getPortalWindow().document.querySelector("div[node_name='pxTestCaseDetails']");
        if (stepsSection) {
            var callback = null;
            if (pega.ui.automation.storeManager.getExecutorMode() == "edit") {
                callback = function() {
                    var recoderStepIdex = pega.ui.automation.storeManager.getRecoderStepIndex();
                    if (recoderStepIdex == null) {
                        recoderStepIdex = 1;
                    }
                    //TODO: Mark statuses according to test case meta
                    var noRunStatusIcons = pega.ui.automation.utils.getPortalWindow().$("[show_when*='Failed'][show_when*='Passed']");
                    var passedStatusIcons = pega.ui.automation.utils.getPortalWindow().$("[show_when*='Passed']").not("[show_when*='Failed']");
                    for(var i = 0; i < recoderStepIdex; i++) {
                        noRunStatusIcons[i].style.display = "none";
                        passedStatusIcons[i].style.display = "block";
                    }
                }
            } 
            pega.u.automation.utils.getPortalWindow().pega.u.d.reloadSection(stepsSection, "", "", false, false, -1, false, null, null, null, callback);
        }
    }

    function _recordStepIndex() {
        var recoderStepIdex = pega.ui.automation.storeManager.getRecoderStepIndex();
        if (recoderStepIdex == null) {
            //This means its a first step and the index should start with 1 as this is clipboardpage index.
            recoderStepIdex = 1;
        } else {
            recoderStepIdex++;
        }
        pega.ui.automation.storeManager.setRecoderStepIndex(recoderStepIdex);
        return recoderStepIdex;
    }

    /**
     * Implicitly builds and save step.
     *
     * @param      {HTMLElement}  selectedElement  The selected element
     * @param      {String}       componentName    The component name
     * @param      {String}       eventType
     */
    function _buildAndSaveStep(selectedElement, componentName, eventType, eventTarget) {

        if (eventType == "change") {
            _createChangeStep(selectedElement, componentName);
            return;
        }

        var valid = _validateBuildStepScenario(selectedElement, componentName, true);
        if (valid["isValid"] == false) {
            return;
        }
        //Set the event type.
        _setEventData(eventType, eventTarget);

        var stepObj = _buildStepObject(selectedElement, componentName, true);
        //Reset the event type.
        _resetEventData();
        if (!stepObj) {
            return;
        }

        var validateStep = _validateCurrentStep(stepObj, selectedElement, componentName);

        if (validateStep["forceUpdateActions"] == true || validateStep["updateActions"] == true) {

            if (!_isTargetElementDisabled(componentName, selectedElement)) {
                stepObj[_constants.IS_NAVIGATOR] = "true";
                var navigators = [];
                var navigatorObj = {};
                navigatorObj[_constants.NAVIGATOR_ACTION_NAME] = eventType;
                navigators.push(navigatorObj);

                stepObj[_constants.NAVIGATORS] = navigators;

                _updateStepInClipboard(selectedElement, stepObj, _constants.STEP_TYPE.IMPLICIT);
            }

        } else {
            _setRecorderStepIndex(selectedElement);
            _setCurrentStepPage({ "data": stepObj, "selectedELem": selectedElement, "stepType": _constants.STEP_TYPE.IMPLICIT });
            _createStepInClipboard(stepObj, selectedElement.getAttribute("data-aftrecorder-index"));


        }

    }

    function _isTargetElementDisabled(componentName, selectedElement) {
        var componentStepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        if (!componentStepbuilder) {
            return null;
        }
        var inspectableElement = componentStepbuilder.getTargetElement(selectedElement, _getEventTarget());
        return inspectableElement && inspectableElement.disabled;
    }

    function _createStepInClipboard(stepObject, recorderStepIndex) {
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        var postData = new SafeURL();
        strUrlSF.put("pyActivity", EDGE_PANEL_WRAPPER_REFRESH_PRE_ACT);

        var callback = {
            success: function(data) {
                _refreshSteps();
            },
            failure: function(data) {
                console.log("Data: ", data);
            }
        }
        postData.put("stepObj", JSON.stringify(stepObject));
        if (pega.ui.automation.storeManager.getExecutorMode() == "edit") {
            strUrlSF.put("mode", "edit");
            if (recorderStepIndex > 0) {
                strUrlSF.put("editStepIndex", recorderStepIndex);
            }
            pega.ui.automation.storeManager.setLastRunStepIndex(recorderStepIndex);
            pega.ui.automation.storeManager.updateCurrentTestCaseStep(recorderStepIndex, stepObject);
        }
        strUrlSF.put("implicitSave", "true");

        pega.u.d.asyncRequest("POST", strUrlSF, callback, postData.toEncodedPostBody());
    }

    function _updateStepInClipboard(selectedElement, stepObj, stepType, recorderStepIndex) {

        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        var postData = new SafeURL();
        strUrlSF.put("pyActivity", "pxUpdateFunctionalTestCaseStep");
        if (recorderStepIndex > 0) {
            strUrlSF.put("recorderStepIndex", recorderStepIndex);
        }
        postData.put("stepObj", JSON.stringify(stepObj));
        console.log("Updating step: ", stepObj);
        var callback = {
            success: function(data) {
                _refreshSteps();
            },
            failure: function(data) {
                console.log("Data: ", data);
            }
        }
        var previousStepMetaData = _getCurrentStepPage();
        _setCurrentStepPage({ "data": previousStepMetaData["data"], "selectedELem": previousStepMetaData["selectedELem"], "stepType": stepType });
        pega.u.d.asyncRequest("POST", strUrlSF, callback, postData.toEncodedPostBody());

    }

    function _createCaseStep(className, flowName) {

        console.log("Creating implicit case step")
        var stepObj = {};
        stepObj[_constants.IS_NAVIGATOR] = "true";
        stepObj[_constants.IS_CUSTOM_STEP] = "true";
        stepObj[_constants.CUSTOM_TYPE] = "case";
        stepObj[_constants.CUSTOM_TYPE] = "case";
        stepObj[_constants.CASE_FLOW_NAME] = flowName;
        stepObj[_constants.CASE_CLASS_NAME] = className;
        stepObj[_constants.TEST_STEP_NAME] = "Initiate " + className.substring(className.lastIndexOf("-") + 1);
        //record the step index as a new step is created
        _recordStepIndex();
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        var postData = new SafeURL();
        strUrlSF.put("pyActivity", EDGE_PANEL_WRAPPER_REFRESH_PRE_ACT);

        var callback = {
            success: function(data) {
                //var apiName = "pega.ui.automation.navigator.finishCurrentStep";
                //pega.ui.automation.utils.invokeApi(apiName, actionName, null, "true", keepHighlighting);
                _refreshSteps();
            },
            failure: function(data) {
                console.log("Data: ", data);
            }
        }
        postData.put("stepObj", JSON.stringify(stepObj));
        strUrlSF.put("implicitSave", "true");
        pega.u.d.asyncRequest("POST", strUrlSF, callback, postData.toEncodedPostBody());
    }
    /**
     * API to update previous step with navigator as change and its changed value
     * This api should be called from change event
     *
     * @param      {<type>}  selectedElement  The selected element
     * @param      {string}  componentName    The component name
     */
    function _createChangeStep(selectedElement, componentName) {

        var componentStepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        if (!componentStepbuilder) {
            return;
        }

        var stepObj = {};

        var recorderStepIndex = selectedElement.getAttribute("data-aftrecorder-index");
        if (recorderStepIndex == null || recorderStepIndex == undefined) {
            // do not record change step if there is no step already recorded on that.
            return;
        }
        console.log("Creating change step of: " + componentName);
      
        componentStepbuilder.updateComponentSpecificData(stepObj, componentStepbuilder.getTargetElement(selectedElement), "change", true, _getEventTarget());
        var changedValue = componentStepbuilder.getElementValue(componentStepbuilder.getTargetElement(selectedElement));

        stepObj[_constants.IS_NAVIGATOR] = "true";
        var navigators = [];
        var navigatorObj = {};
        navigatorObj[_constants.NAVIGATOR_ACTION_NAME] = "change";
        navigatorObj[_constants.NAVIGATOR_ACTION_VALUE] = changedValue;
        navigators.push(navigatorObj);

        stepObj[_constants.NAVIGATORS] = navigators;

        /*
        _setCurrentStepPage({ "data": stepObj, "selectedELem": selectedElement, "stepType": _constants.STEP_TYPE.CHANGE });
        _createStepInClipboard(stepObj, recorderStepIndex);
        */
        _updateStepInClipboard(selectedElement, stepObj, _constants.STEP_TYPE.CHANGE, recorderStepIndex);

    }

    function _hasAssertionsUpdated(currentStepObj) {
        var previousStepPageData = pega.ui.automation.recorder.stepbuilder.getCurrentStepPage();
        if (!previousStepPageData) {
            return true;
        }
        var previousStepData = previousStepPageData["data"];
        var previousAssertions = previousStepData[_constants.ATTRIBUTES];
        var currentAssertions = currentStepObj[_constants.ATTRIBUTES];
        if (currentAssertions.length != previousAssertions.length) {
            return true;
        }
        for (var i = 0; i < currentAssertions.length; i++) {
            if (currentAssertions[i][_constants.ATTRIBUTE_DESC] != previousAssertions[i][_constants.ATTRIBUTE_DESC] ||
                currentAssertions[i][_constants.ATTRIBUTE_NAME] != previousAssertions[i][_constants.ATTRIBUTE_NAME] ||
                currentAssertions[i][_constants.ATTRIBUTE_VALUE] != previousAssertions[i][_constants.ATTRIBUTE_VALUE]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Builds assertion options.
     *
     * @param      {<type>}   componentdata       The componentdata
     * @param      {string}   assertions          The implicit Assertions
     * @param      {<type>}   inspectableElement  The inspectable element
     * @param      {boolean}  isImplicitSave      Indicates if implicit save
     */
    function _buildAssertionOptions(componentdata, implAssertions, inspectableElement, isImplicitSave, componentName) {
        var implAssertionAttibutes = [];
        var configAssertions = pega.ui.automation.recorder.translator.getConfigOptions(componentName, inspectableElement);

        if (configAssertions && configAssertions.length > 0) {
            componentdata[_constants.ATTRIBUTES] = configAssertions;

            if (implAssertions && implAssertions.length > 0) {
                for (var i = 0; i < configAssertions.length; i++) {
                    var configAssertion = configAssertions[i];
                    var configDesc = configAssertion[_constants.ATTRIBUTE_DESC];
                    if (implAssertions.indexOf(configDesc) > -1) {
                        var implAssertion = _addAdditionalAssertionProperties(configAssertion);
                        implAssertionAttibutes.push(implAssertion);
                    }
                }
            }


            if (implAssertionAttibutes.length == 0 && !isImplicitSave) {
                //No implicit assertions present. Make first of explicit assertion as implicit assertion
                var implAssertion = _addAdditionalAssertionProperties(configAssertions[0]);
                implAssertionAttibutes.push(implAssertion);
            }
            if (implAssertionAttibutes.length > 0) {
                componentdata[_constants.ASSERTIONS] = implAssertionAttibutes;
                componentdata[_constants.IS_ASSERTOR] = "true";
            }

        }

    }

    function _addAdditionalAssertionProperties(configAssertion) {
        var implAssertion = JSON.parse(JSON.stringify(configAssertion));

        var attrComparatorList = configAssertion[_constants.COMPARATOR_LIST];
        if (attrComparatorList && attrComparatorList.length > 0) {
            implAssertion["pyComparator"] = attrComparatorList[0]["pyName"];
        }
        implAssertion["pyExpectedValue"] = configAssertion["pyAttributeValue"]
        return implAssertion;

    }

    /**
     * Helper function to build attribute object
     *
     * @param      {<type>}  inspectableElement  The inspectable element
     * @param      {<type>}  attrName            The attribute name
     * @param      {<type>}  attrDesc            The attribute description
     * @return     {<type>}  The attribute object.
     */
    function _buildAttributeObject(inspectableElement, attrName, attrDesc, sourceType) {
        var attrObj = {};

        var attrValue = pega.ui.automation.utils.getAssertedDomValue(inspectableElement, attrName);
        if (attrValue == null || attrValue == undefined) {
            return null;
        }

        attrObj[_constants.ATTRIBUTE_NAME] = attrName;
        attrObj[_constants.ATTRIBUTE_VALUE] = attrValue;
        attrObj[_constants.ATTRIBUTE_DESC] = attrDesc;


        return attrObj;

    }
    /**
     * Update component data with given navigations
     *
     * @param      {<type>}  componentdata  The componentdata
     * @param      {<type>}  navigations    The navigations
     */
    function _buildNavigationOptions(componentdata, navigations, isImplicitSave) {
        var actions = [];
        componentdata[_constants.ACTIONS] = actions;

        var navigatorActions = [];
        componentdata[_constants.NAVIGATORS] = navigatorActions;
        for (var j = 0; j < navigations.length; j++) {
            var actioName = navigations[j];

            var actionObj = {};
            // All implicit actions can have only action name and not action value
            actionObj[_constants.ATTRIBUTE_NAME] = actioName;
            actions.push(actionObj);

            var navigatorActionObj = {};
            navigatorActionObj[_constants.NAVIGATOR_ACTION_NAME] = actioName;
            if (!isImplicitSave) {
                navigatorActionObj["pyIsTempAction"] = "true";
            }
            navigatorActions.push(navigatorActionObj);
        }
    }

    /**
     * Builds assertions and navigations and updates component data
     *
     * @param      {<type>}   componentdata       The componentdata
     * @param      {<type>}   inspectableElement  The inspectable element
     * @param      {boolean}  isImplicitSave      Indicates if implicit save
     * @param      {<type>}   componentName         The componentName
     */
    function _buildAssertionsAndNavigations(componentdata, inspectableElement, isImplicitSave, componentName) {

        var assertions = [];
        var stepbuilder = pega.ui.automation.manager.getStepbuilder(componentName);
        var implAssertions = stepbuilder[_constants.IMPLICIT_ASSERTIONS];

        _buildAssertionOptions(componentdata, implAssertions, inspectableElement, isImplicitSave, componentName);

        var navigations = [];
        var currentEvent = _getEventType();
        var implNavigations = stepbuilder[_constants.IMPLICIT_NAVIGATIONS];
        if (implNavigations && implNavigations.length > 0) {
            if (implNavigations.indexOf(currentEvent) == -1) {
                navigations.push(currentEvent);
            } else {
                navigations.push.apply(navigations, implNavigations);
            }

        } else if (currentEvent == MOUSEOVER_EVENT_TYPE || (currentEvent && isImplicitSave)) {
            //add implicit navigation 
            //Case 1 : when for all implicitsaves and the it is not a navigator
            //Case 2 : when event type is focus
            navigations.push(currentEvent);
        }

        if (navigations && navigations.length > 0 && !inspectableElement.disabled) {
            componentdata[_constants.IS_NAVIGATOR] = "true";
            _buildNavigationOptions(componentdata, navigations, isImplicitSave);
        }
        if (componentdata[_constants.IS_NAVIGATOR] != "true") {
            //Making as assertor by default if its not a navigator
            componentdata[_constants.IS_ASSERTOR] = "true";
        }

    }
    return {
        buildAndSaveStep: _buildAndSaveStep,
        createCaseStep: _createCaseStep,
        refreshSteps: _refreshSteps,
        showAssertorPopover: _showAssertorPopover,
        setCurrentStepPage: _setCurrentStepPage,
        getCurrentStepPage: _getCurrentStepPage,
        clearCurrentStepPage: _clearCurrentStepPage
    }

})();

/**
 * Default stepbuilder component on which other components should extend and overrite if any
 */
pega.ui.automation.recorder.stepbuilder.defaultComponent = (function() {
    var _constants = pega.ui.automation.constants;

    function _getTargetElement(domElement, eventTarget) {
        console.log("Invoking default stepbuilder");
        return domElement;
    }

    /**
     * Update any component specific data 
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    function _updateComponentSpecificData(componentdata, inspectableElement, eventType, isImplicitSave, eventTarget) {
        var componentName = componentdata[_constants.COMPONENT_TYPE];
        var UILabel = inspectableElement && inspectableElement.innerText;
        if (!UILabel) {
            UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        }
        UILabel = UILabel.trim();
        if(UILabel.length > 10) {
          UILabel = UILabel.substr(0,10) + '...';
        }
        var UIType = pega.ui.automation.utils.getComponentDesc(componentName).trim();
        var action = "Verify ";

        var navigations = this.getNavigationActions(inspectableElement, eventType, eventTarget);
        if (isImplicitSave && navigations && navigations.length > 0) {
            eventType = navigations[0];
        }
        if (eventType === "change") {
            action = "Change ";
        } else if (eventType === "dblclick") {
            action = "DoubleClick ";
        } else if (eventType === "contextmenu") {
            action = "RightClick ";
        } else {
            action = eventType.charAt(0).toUpperCase() + eventType.slice(1) + " ";
        }
        var testStep = action + UILabel + " (" + UIType + ")";
        componentdata[_constants.TEST_STEP_NAME] = testStep;
    }

    function _getElementValue(targetElem) {
        return targetElem.value;
    }

    function _validateComponentCurrentStep(previousStepMetaData, currentStepObj, currentSelectedElement) {
        var valid = { "isValid": true };

        var previousStepObj = previousStepMetaData["data"];

        if (this.hasSameSelector(previousStepObj, currentStepObj) && this.hasSameAssertions(previousStepObj, currentStepObj, currentSelectedElement)) {
            var prevStepType = previousStepMetaData["stepType"];
            if (prevStepType != _constants.STEP_TYPE.CHANGE) {
                console.log("*** Updating action in previous step ****");
                valid["updateActions"] = true;
            }
        }
        return valid;
    }

    function _hasSameSelector(previousStepObj, currentStepObj) {
        return JSON.stringify(previousStepObj[_constants.DOM_SELECTOR]) === JSON.stringify(currentStepObj[_constants.DOM_SELECTOR]);
    }


    function _hasSameAssertions(previousStepObj, currentStepObj, currentSelectedElement) {
        var previousAssertions = previousStepObj[_constants.ATTRIBUTES];
        var currentAssertions = currentStepObj[_constants.ATTRIBUTES];
        if (!currentAssertions) {
            if (!previousAssertions) {
                return true;
            } else {
                return false;
            }

        } else if (!previousAssertions) {
            return false;
        }
        if (currentAssertions.length != previousAssertions.length) {
            return false;
        }
        for (var i = 0; i < currentAssertions.length; i++) {
            if (currentAssertions[i][_constants.ATTRIBUTE_DESC] != previousAssertions[i][_constants.ATTRIBUTE_DESC] ||
                currentAssertions[i][_constants.ATTRIBUTE_NAME] != previousAssertions[i][_constants.ATTRIBUTE_NAME] ||
                currentAssertions[i][_constants.ATTRIBUTE_VALUE] != previousAssertions[i][_constants.ATTRIBUTE_VALUE]) {
                return false;
            }
        }
        return true;
    }

    function _getNavigationActions(inspectableTargetElement, eventType, eventTarget) {
        var navigations = [];
        if (this.implicitNavigations.indexOf(eventType) == -1) {
            //If the current event is not part of implicit navigations, make current event as action
            navigations.push(eventType);
        } else {
            navigations.push.apply(navigations, this.implicitNavigations);
        }
        return navigations;
    }

    var _implicitAssertions = ["Value", "Property"];

    var _implicitNavigations = ["click"];
    var _customSelectorAttributes = null;

    return {
        getTargetElement: _getTargetElement,
        getElementValue: _getElementValue,
        updateComponentSpecificData: _updateComponentSpecificData,
        implicitAssertions: _implicitAssertions,
        implicitNavigations: _implicitNavigations,
        customSelectorAttributes: _customSelectorAttributes,
        validateComponentCurrentStep: _validateComponentCurrentStep,
        hasSameSelector: _hasSameSelector,
        hasSameAssertions: _hasSameAssertions,
        getNavigationActions: _getNavigationActions,
        //customQuerySelector : Component can overrite this to provide its own selector to get the target element
        //If this is present, infra will not generate selector, instead it creates step with overridden value
        //While executing it just executes this query selector to get the element from dom
        //Value should be a string which represents a dom query selector
        customQuerySelector: null
    }


})();

/**
 * Input text Stepbuilder
 */
pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitNavigations: {
        value: null
    }
});
pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking simple text input stepbuilder");
    return domElement.querySelector("input");

}


/**
 * Update component specific data for TextInput
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName) {
    var _constants = pega.ui.automation.constants;
    var UILabel = inspectableElement && (inspectableElement.innerText).trim();
    if (!UILabel) {
        UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = " (Text)";
    var action = "Verify ";
    var enteredText = "";
    if (actionName === "change") {
        action = "Enter ";
        enteredText = this.getElementValue(inspectableElement);
        if (enteredText.length > 20) {
            enteredText = enteredText.substring(0, 20) + "..."
        }
        enteredText = " : " + enteredText;
    } else if (actionName === "dblclick") {
        action = "DoubleClick ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + UILabel;
    }
    testStep = testStep + UIType;
    testStep = testStep + enteredText;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.TEXT_INPUT, pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder);



/**
 * Button Stepbuilder
 */
pega.ui.automation.recorder.stepbuilder.buttonStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
        value: null
    }
});
pega.ui.automation.recorder.stepbuilder.buttonStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking button stepbuilder");
    return domElement.querySelector("button");

}
/**
 * Update component specific data for Button
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.buttonStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var UILabel = inspectableElement && (inspectableElement.innerText).trim();
    if (!UILabel) {
        UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = " (Button)";
    var action = "Verify ";
    if (actionName === "click" && isImplicitSave) {
        action = "Click ";
    } else if (actionName === "dblclick") {
        action = "DoubleClick ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + UILabel;
    }
    testStep = testStep + UIType;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.BUTTON, pega.ui.automation.recorder.stepbuilder.buttonStepbuilder);

/**
 * Menu item Stepbuilder extends button since most of the configurations are same
 */
pega.ui.automation.manager.registerInspector(pega.ui.automation.constants.COMPONENT.MENU_ITEM, {
    selector: "li.menu-item",
    selectorcb: function() {
        return {
            "type": "pxMenu",
            "subType": "pxMenuItem"
        }
    }
});
pega.ui.automation.recorder.stepbuilder.menuItemStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.buttonStepbuilder, {
    implicitAssertions: {
        value: null
    },
    customSelectorAttributes: {
        //Configure custom attributes
        value: [pega.ui.automation.constants.SELECTOR.INNERTEXT, "class"]
    }
});
pega.ui.automation.recorder.stepbuilder.menuItemStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking menu item stepbuilder");
    return domElement.querySelector(".menu-item-title");

}

/**
 * Update component specific data for Menu
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.menuItemStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var UILabel = inspectableElement && (inspectableElement.innerText).trim();
    if (!UILabel) {
        UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = " (Menu)";
    var action = "Verify ";
    if (isImplicitSave) {
        action = "Select ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + UILabel;
    }
    testStep = testStep + UIType;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.MENU_ITEM, pega.ui.automation.recorder.stepbuilder.menuItemStepbuilder);

/**
 * Label Stepbuilder
 */
pega.ui.automation.recorder.stepbuilder.labelStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
        value: ["Value"]
    },
    implicitNavigations: {
        value: null
    }
});
pega.ui.automation.recorder.stepbuilder.labelStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking label stepbuilder");
    if (pega.ui.automation.utils.hasClass(domElement, "dataLabelRead") || pega.ui.automation.utils.hasClass(domElement, "dataLabelWrite")) {
        return domElement;
    }
    return domElement.querySelector(".dataLabelRead, .dataLabelWrite");
}
/**
 * Update component specific data for Label
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.labelStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var labelText = inspectableElement && (inspectableElement.innerText).trim() || "";
    if (!labelText) {
        labelText = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = "(Label)";
    var action = "Verify ";
    if (isImplicitSave) {
        action = "Check ";
    } else if (actionName === "dblclick") {
        action = "DoubleClick ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action + UIType + " : " + labelText;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.LABEL, pega.ui.automation.recorder.stepbuilder.labelStepbuilder);

/*Link*/
pega.ui.automation.recorder.stepbuilder.linkStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
        value: ["Link Caption"]
    }
});
pega.ui.automation.recorder.stepbuilder.linkStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking simple link stepbuilder");
    return domElement.querySelector("a");

}
/**
 * Update component specific data for Link
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.linkStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var UILabel = inspectableElement && (inspectableElement.innerText).trim();
    if (!UILabel) {
        UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = " (Link)";
    var action = "Verify ";
    if (actionName === "click" && isImplicitSave) {
        action = "Click ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + UILabel;
    }
    testStep = testStep + UIType;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.LINK, pega.ui.automation.recorder.stepbuilder.linkStepbuilder);
/*Icon*/
pega.ui.automation.recorder.stepbuilder.iconStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
        value: ["Icon source"]
    }
});
pega.ui.automation.recorder.stepbuilder.iconStepbuilder.getTargetElement = function(domElement) {
    console.log("Invoking Icon stepbuilder");
    return domElement.querySelector("[data-ctl='Icon']");
}
/**
 * Update component specific data for Icon
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.iconStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var UILabel = inspectableElement && (inspectableElement.innerText).trim();
    if (!UILabel) {
        UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    }
    var UIType = " (Icon)";
    var action = "Verify";
    if (actionName === "click" && isImplicitSave) {
        action = "Click";
    } else if (actionName === "dblclick") {
        action = "DoubleClick";
    } else if (actionName === "contextmenu") {
        action = "RightClick";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + " " + UILabel;
    }
    testStep = testStep + UIType;
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.ICON, pega.ui.automation.recorder.stepbuilder.iconStepbuilder);
/*display text*/
pega.ui.automation.recorder.stepbuilder.displayTextStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
        value: ["Value"]
    }
});
pega.ui.automation.recorder.stepbuilder.displayTextStepbuilder.getTargetElement = function(selectedElement) {
    console.log("Invoking display text stepbuilder");
    this.implicitNavigations = null;
    if (pega.ui.automation.utils.hasClass(selectedElement, "gridCell")) {
        //Add implicit navigation as click if its present in grid cell
        this.implicitNavigations = ["click"];
    }
    //Considering p tag in the case of fields whose values are populated using declare expressions.
    var targetElem = selectedElement.querySelector(".dataValueRead span") || selectedElement.querySelector(".dataValueRead p") || selectedElement.querySelector("span");
    if (!targetElem && pega.ui.automation.utils.hasClass(selectedElement, "dataValueRead")) {
        targetElem = selectedElement;
    }
    if (targetElem && !targetElem.getAttribute("data-test-id")) {
        var dataTestIdTarget = targetElem.querySelector("[data-test-id]");
        if (dataTestIdTarget) {
            targetElem = dataTestIdTarget;
        }
    }
    return targetElem;
}
/**
 * Update component specific data for TextInput
 * @function   {updateComponentSpecificData} 
 * @param      {JSON}                           componentdata       The componentdata
 * @param      {Element}                        inspectableElement  The inspectable element
 * @param      {String}                         actionName
 */
pega.ui.automation.recorder.stepbuilder.displayTextStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
    var _constants = pega.ui.automation.constants;
    var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
    var UIType = " (Text)";
    var action = "Verify ";
    var displayText = "";
    if (actionName === "click" && isImplicitSave) {
        displayText = inspectableElement && (inspectableElement.innerText).trim();
    } else if (actionName === "dblclick") {
        action = "DoubleClick ";
    } else if (actionName === "contextmenu") {
        action = "RightClick ";
    }
    var testStep = action;
    if (UILabel) {
        testStep = testStep + UILabel;
    }
    testStep = testStep + UIType;
    if (displayText) {
        testStep = testStep + " : " + displayText;
    }
    componentdata[_constants.TEST_STEP_NAME] = testStep;
}
pega.ui.automation.manager.registerStepbuilder(pega.ui.automation.constants.COMPONENT.DISPLAY_TEXT, pega.ui.automation.recorder.stepbuilder.displayTextStepbuilder);
//static-content-hash-trigger-YUI
pega.ui.automation.recorder = pega.ui.automation.recorder || {};

/**
 * Translator module to hold api related to get design time configurations and its values
 */
pega.ui.automation.recorder.translator = (function() {
    /**
     * Gets the configuration options for the given component
     *
     * @param      {<type>}  componentName       The component name
     * @param      {<type>}  inspectableElement  The inspectable element
     * @return     {<type>}  The configuration options.
     */
    function _getConfigOptions(componentName, inspectableElement) {
        var _constants = pega.ui.automation.constants;

        var componentTranslator = pega.ui.automation.manager.getTranslator(componentName);
        if (!componentTranslator) {
            return null;
        }
        var configAssertions = componentTranslator.buildConfigs(inspectableElement);
        var commonConfigs = componentTranslator.getCommonConfigs(inspectableElement);
        //Add the commonconfigs to the component level config object.
        if(commonConfigs){
          configAssertions.push(commonConfigs);
        }
        
        var availableConfigAssertions = [];
        if (!configAssertions) {
            return availableConfigAssertions;
        }
        for (var i = 0; i < configAssertions.length; i++) {
            if (configAssertions[i][_constants.ATTRIBUTE_VALUE] == null && !configAssertions[i][_constants.ATTRIBUTE_VALUE_LIST]) {
                var attributeValue = pega.ui.automation.utils.getAssertedDomValue(inspectableElement, configAssertions[i][_constants.ATTRIBUTE_NAME]);
                if (attributeValue == null || attributeValue == undefined) {
                    continue;
                }
                configAssertions[i][_constants.ATTRIBUTE_VALUE] = attributeValue;
            }

            if (configAssertions[i][_constants.ATTRIBUTE_VALUE_LIST]) {
                var valueList = configAssertions[i][_constants.ATTRIBUTE_VALUE_LIST];
                var valueObjList = [];
                for (var j = 0; j < valueList.length; j++) {
                    var valueObj = {};
                    valueObj["pyValue"] = valueList[j];
                    valueObjList.push(valueObj);
                }
                configAssertions[i][_constants.ATTRIBUTE_VALUE_LIST] = valueObjList;
            }

            if (!configAssertions[i][_constants.COMPARATOR_LIST]) {
                configAssertions[i][_constants.COMPARATOR_LIST] = [{ "pyName": "Is Equal" }];
            } else {
                var comparatorList = configAssertions[i][_constants.COMPARATOR_LIST];
                var comparatorObjList = [];
                for (var j = 0; j < comparatorList.length; j++) {
                    var comparatorObj = {};
                    comparatorObj["pyName"] = comparatorList[j];
                    comparatorObjList.push(comparatorObj);
                }

                configAssertions[i][_constants.COMPARATOR_LIST] = comparatorObjList;
            }
            availableConfigAssertions.push(configAssertions[i]);
        }

        return availableConfigAssertions;
    }


    function _getConfiguredValue(componentName, domElement, attrDesc) {
        var componentTranslator = pega.ui.automation.manager.getTranslator(componentName);
        if (!componentTranslator) {
            return null;
        }
        var configs = componentTranslator.buildConfigs(domElement);
        var returnValue;
        if (configs) {
            for (var i = configs.length - 1; i >= 0; i--) {
                if (configs[i][pega.ui.automation.constants.ATTRIBUTE_DESC] == attrDesc) {
                    var attributeValue = configs[i][pega.ui.automation.constants.ATTRIBUTE_VALUE];
                    if (attributeValue != null && attributeValue != undefined) {
                        returnValue = attributeValue;
                    } else {
                        returnValue = configs[i][pega.ui.automation.constants.ATTRIBUTE_VALUE_LIST];
                    }
                }
            }
        }
        return returnValue;
    }

    return {
        getConfigOptions: _getConfigOptions,
        getConfiguredValue: _getConfiguredValue
    }

})();

/**
 * Default translator component on which other components should extend and overrite if any
 */
pega.ui.automation.recorder.translator.defaultComponent = (function() {

    function _buildConfigs(inspectableElement) {
        return null;
    }

    function _getCommonConfigs(inspectableElement){
      //Smart tip is the only common config across all the components as of now.
      return _getSmartTipConfig(inspectableElement);
    }
    
    /**
     * This method creates the config object for the Smart Tip if, it is configured on a control for hover action.
     * @method [_getSmartTipConfig]
     * @param  {HTMLElement} domElement
     * @return {JSON}
     */
    function _getSmartTipConfig(domElement) {
        if (domElement.disabled) {
            return null;
        }
        var _constants = pega.ui.automation.constants;
        var dataHover = domElement.getAttribute("data-hover");
        if (dataHover != null) {
            var dataHoverArray = [];
            //eval the data-hover. For cells like checkbox data-hover is "."
            try{
              dataHoverArray = eval(dataHover);
            }catch(e){
              console.error("Data Hover of the cell can not be evaluated");
            }
            
            //If the cell has data-hover, but can not be evaluated, check for the data-hover on the parent span.
            try{
              var closestSpan = $(domElement).closest("span");
              dataHover = closestSpan.getAttribute("data-hover");
              dataHoverArray = eval(dataHover);
            }catch(e){
              console.error("Data Hover of the span can not be evaluated");
            }
          
          
            for (var i = 0; i < dataHoverArray.length; i++) {
                var actionString = dataHoverArray[i];
                if (actionString[0] === "showSmartTip") {
                    try {
                        var message = actionString[1][2];
                        var config = {};
                        config[_constants.ATTRIBUTE_DESC] = "Smart Tip";
                        config[_constants.ATTRIBUTE_VALUE] = message;
                        return config;
                    } catch (e) {
                        console.error("Explicit option for Smart Tip assertion can not be created");
                    }
                    break;
                }
            }
        }
        return null;
    }

    var returnApi = {
        buildConfigs: _buildConfigs,
        getCommonConfigs:_getCommonConfigs
    };

    return returnApi;

})();

pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.DEFAULT, pega.ui.automation.recorder.translator.defaultComponent);

/**
 * Input text translator
 */
pega.ui.automation.recorder.translator.inputTextTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.inputTextTranslator.buildConfigs = function() {
    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Value";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Property";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Tooltip";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Label";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
    configs.push(config);
  
    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Placeholder";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.PLACEHOLDER;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Disabled";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Required";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.REQUIRED;
    configs.push(config);
  
    config = {};
    config[_constants.ATTRIBUTE_DESC] = "has error";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
    configs.push(config);
    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.TEXT_INPUT, pega.ui.automation.recorder.translator.inputTextTranslator);

/**
 * Simple Button translator
 */
pega.ui.automation.recorder.translator.buttonTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.buttonTranslator.buildConfigs = function(buttonElement) {

    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Button Caption";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Tooltip";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Disabled";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
    configs.push(config);

    var imagePosition = "left";
    if (buttonElement.querySelector("img") != null) {

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = "img" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@src";
        configs.push(config);

        if (buttonElement.childNodes.length >= 2 && buttonElement.childNodes[1].tagName == "IMG") {
            imagePosition = "right";
        }

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image position";
        config[_constants.ATTRIBUTE_VALUE] = imagePosition;
        configs.push(config);


    } else if (buttonElement.querySelector("i") != null) {
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = "i" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@class";
        configs.push(config);

        if (buttonElement.childNodes.length >= 2 && buttonElement.childNodes[1].tagName == "I") {
            imagePosition = "right";
        }
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image position";
        config[_constants.ATTRIBUTE_VALUE] = imagePosition;
        configs.push(config);
    }

    return configs;
}

pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.BUTTON, pega.ui.automation.recorder.translator.buttonTranslator);

/**
 * Menu item translator
 */
pega.ui.automation.recorder.translator.menuItemTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.menuItemTranslator.buildConfigs = function(menuItemELem) {
    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Tooltip";
    config[_constants.ATTRIBUTE_NAME] = "..." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ATTRIBUTE.TITLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Label";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Description";
    config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ".menu-item-description" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ":contains";
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Badge Label";
    config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ".menu-item-badge" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ":contains";
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Badge Format";
    config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ".menu-item-badge" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@class";
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Disabled";
    config[_constants.ATTRIBUTE_NAME] = "..." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ATTRIBUTE.DISABLE;
    configs.push(config);

    var menuAchorElem = menuItemELem.parentElement.parentElement;
    if (menuAchorElem.querySelector("img") != null) {
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = ".." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "img" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@src";
        configs.push(config);
    } else if (menuAchorElem.querySelector(".menu-item-icon-imageclass") != null) {
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = ".." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ".menu-item-icon-imageclass" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@class";
        configs.push(config);
    }

    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.MENU_ITEM, pega.ui.automation.recorder.translator.menuItemTranslator);

/**
 * Label translator
 */
pega.ui.automation.recorder.translator.labelTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.labelTranslator.buildConfigs = function() {
    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Value";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
    configs.push(config);

    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.LABEL, pega.ui.automation.recorder.translator.labelTranslator);

pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.DROPDOWN, pega.ui.automation.recorder.translator.inputTextTranslator);


/**
 * Link translator
 */
pega.ui.automation.recorder.translator.linkTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.linkTranslator.buildConfigs = function(anchorElement) {

    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Link Caption";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Tooltip";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Disabled";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
    configs.push(config);

    var imagePosition = "left";
    if (anchorElement.querySelector("img") != null) {
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = "img" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@src";
        configs.push(config);

        if (anchorElement.childNodes.length >= 2 && anchorElement.childNodes[1].tagName == "IMG") {
            imagePosition = "right";
        }
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image position";
        config[_constants.ATTRIBUTE_VALUE] = imagePosition;
        configs.push(config);
    } else if (anchorElement.querySelector("i") != null) {
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image source";
        config[_constants.ATTRIBUTE_NAME] = "i" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@class";
        configs.push(config);
        if (anchorElement.childNodes.length >= 2 && anchorElement.childNodes[1].tagName == "I") {
            imagePosition = "right";
        }
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Image position";
        config[_constants.ATTRIBUTE_VALUE] = imagePosition;
        configs.push(config);
    }
    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.LINK, pega.ui.automation.recorder.translator.linkTranslator);
/*Icon*/
pega.ui.automation.recorder.translator.iconTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.iconTranslator.buildConfigs = function(iconElement) {
    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Tooltip";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Disabled";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
    configs.push(config);

    if (iconElement.tagName == "A" || iconElement.tagName == "I") {
        //standard icon or icon class
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Icon source";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.CLASS;
        configs.push(config);
    } else if (iconElement.tagName == "IMG") {
        //image or property or external url
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Icon source";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.SRC;
        configs.push(config);
        if (iconElement.getAttribute("style") && iconElement.getAttribute("style").indexOf("width") >= 0) {
            config = {};
            config[_constants.ATTRIBUTE_DESC] = "Image dimensions";
            config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.STYLE;
            configs.push(config);
        }
    }

    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.ICON, pega.ui.automation.recorder.translator.iconTranslator);
/*display text*/
pega.ui.automation.recorder.translator.displayTextTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
pega.ui.automation.recorder.translator.displayTextTranslator.buildConfigs = function(spanElement) {

    var _constants = pega.ui.automation.constants;
    var configs = [];
    var config = {};
    config[_constants.ATTRIBUTE_DESC] = "Value";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
    configs.push(config);

    config = {};
    config[_constants.ATTRIBUTE_DESC] = "Label";
    config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
    configs.push(config);
  
    return configs;
}
pega.ui.automation.manager.registerTranslator(pega.ui.automation.constants.COMPONENT.DISPLAY_TEXT, pega.ui.automation.recorder.translator.displayTextTranslator);
//static-content-hash-trigger-YUI
/*es6-promise-polyfill with MIT License*/
(function(t){function z(){for(var a=0;a<g.length;a++)g[a][0](g[a][1]);g=[];m=!1}function n(a,b){g.push([a,b]);m||(m=!0,A(z,0))}function B(a,b){function c(a){p(b,a)}function h(a){k(b,a)}try{a(c,h)}catch(d){h(d)}}function u(a){var b=a.owner,c=b.state_,b=b.data_,h=a[c];a=a.then;if("function"===typeof h){c=l;try{b=h(b)}catch(d){k(a,d)}}v(a,b)||(c===l&&p(a,b),c===q&&k(a,b))}function v(a,b){var c;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(b&&("function"===
typeof b||"object"===typeof b)){var h=b.then;if("function"===typeof h)return h.call(b,function(d){c||(c=!0,b!==d?p(a,d):w(a,d))},function(b){c||(c=!0,k(a,b))}),!0}}catch(d){return c||k(a,d),!0}return!1}function p(a,b){a!==b&&v(a,b)||w(a,b)}function w(a,b){a.state_===r&&(a.state_=x,a.data_=b,n(C,a))}function k(a,b){a.state_===r&&(a.state_=x,a.data_=b,n(D,a))}function y(a){var b=a.then_;a.then_=void 0;for(a=0;a<b.length;a++)u(b[a])}function C(a){a.state_=l;y(a)}function D(a){a.state_=q;y(a)}function e(a){if("function"!==
typeof a)throw new TypeError("Promise constructor takes a function argument");if(!1===this instanceof e)throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this.then_=[];B(a,this)}var f=t.Promise,s=f&&"resolve"in f&&"reject"in f&&"all"in f&&"race"in f&&function(){var a;new f(function(b){a=b});return"function"===typeof a}();"undefined"!==typeof exports&&exports?(exports.Promise=s?f:e,exports.Polyfill=e):"function"==
typeof define&&define.amd?define(function(){return s?f:e}):s||(t.Promise=e);var r="pending",x="sealed",l="fulfilled",q="rejected",E=function(){},A="undefined"!==typeof setImmediate?setImmediate:setTimeout,g=[],m;e.prototype={constructor:e,state_:r,then_:null,data_:void 0,then:function(a,b){var c={owner:this,then:new this.constructor(E),fulfilled:a,rejected:b};this.state_===l||this.state_===q?n(u,c):this.then_.push(c);return c.then},"catch":function(a){return this.then(null,a)}};e.all=function(a){if("[object Array]"!==
Object.prototype.toString.call(a))throw new TypeError("You must pass an array to Promise.all().");return new this(function(b,c){function h(a){e++;return function(c){d[a]=c;--e||b(d)}}for(var d=[],e=0,f=0,g;f<a.length;f++)(g=a[f])&&"function"===typeof g.then?g.then(h(f),c):d[f]=g;e||b(d)})};e.race=function(a){if("[object Array]"!==Object.prototype.toString.call(a))throw new TypeError("You must pass an array to Promise.race().");return new this(function(b,c){for(var e=0,d;e<a.length;e++)(d=a[e])&&"function"===
typeof d.then?d.then(b,c):b(d)})};e.resolve=function(a){return a&&"object"===typeof a&&a.constructor===this?a:new this(function(b){b(a)})};e.reject=function(a){return new this(function(b,c){c(a)})}})("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this);
pega.ui = pega.ui || {};
pega.ui.automation = pega.ui.automation || {};

/*
  Executor is reposible to run the testcases.
 */
pega.ui.automation.executor = (function() {
    var originalAlert = window.alert;
    var _rerecordStepIndex = -1;
    window.alert = function(msg) {
        var executorStatus = pega.ui.automation.storeManager.getExecutorStatus();
        if (executorStatus == "busy") {
            return true;
        } else {
            originalAlert(msg);
        }
    }
    /**
     * [_abortTestCaseExecution]
     * Description : Sets the failure result as there is an JS error occured and sets the status as Failed.
     *               also stops the execution of current test case.
     * @param      {<type>}  msg  (String) Hold the error message which gets publish to result page.
     */
    var _abortTestCaseExecution = function(msg, errorMsg) {
        var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase(),
            mode = pega.ui.automation.storeManager.getExecutorMode(),
            resultData = pega.ui.automation.storeManager.getTestCaseResult(),
            currentStepIndex = pega.ui.automation.storeManager.getCurrentStepIndex(); 
        if (testCaseId) {
            pega.ui.EventsEmitter.unsubscribe(pega.ui.statetracking.IDLE_EVENT, pega.ui.automation.executor.captureIdleState);
            pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Finished");
            pega.ui.automation.storeManager.setExecutorStatus("idle");
          
            if (!resultData) { resultData = {}; }

            resultData.pyTestCaseRunResult = "Failed";
            resultData.pyTestCaseFailureMessage = "JS error occured at step " + currentStepIndex +
              " : "+ msg;
            pega.ui.automation.storeManager.setTestCaseResult(resultData);
            var data = {};
            data.mode = mode;
            data.testCaseId = testCaseId;
            pega.ui.automation.resultsPublisher.publishResult(data);
            if (mode === 'landing' && pega.desktop.AFTHelper) {
                pega.desktop.AFTHelper.abortTestcases();
            }
            console.error(errorMsg);
            _cleanupTestCase();
          
            if (pega.ui.automation.storeManager.getIsRerunEnabeledForTestCases()) {
                var failedTestCase = pega.ui.automation.storeManager.getCurrentTestCaseForRerun();
                pega.ui.automation.storeManager.addFailedTestCaseForRerun(failedTestCase);
            }
        }
    }
    var originalOnError = window.onerror;
    window.onerror = function(msg, url, line, col) {
        var errorMsg = "Error caught in windown.onerror "+ msg + " at line " + line + " Column " + col + " file " + url;
        _abortTestCaseExecution(msg, errorMsg);
        originalOnError(msg);
    }
    var originalConfirm = window.confirm;
    window.confirm = function(msg) {
        var executorStatus = pega.ui.automation.storeManager.getExecutorStatus();
        if (executorStatus == "busy") {
            return true;
        } else {
            return originalConfirm(msg);
        }
    }
    var _constants = pega.ui.automation.constants;
    var _onload = function() {
        var executorStatus = pega.ui.automation.storeManager.getExecutorStatus();
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        var stateTrackerElement = portalWindow && portalWindow.document.querySelector(".document-statetracker");
        var topNavigated = "";
        if (stateTrackerElement) {
            topNavigated = stateTrackerElement.getAttribute("data-aft-reload");
        }
        if (executorStatus == "busy" && topNavigated != "NO") {
            if (pega.ui.automation.storeManager.getExecutorMode() == "single") {
                portalWindow.pega.ui.automation.recorder.toggle(function() {
                    var portalWindow = pega.ui.automation.utils.getPortalWindow();
                    portalWindow.pega.ui.automation.recorder.initStepStatus();
                });
                stateTrackerElement.setAttribute("data-aft-reload", "NO");
            }
            // we have two delays, AQD and step level delays. For each we should not resume from multiple places, instead we should wait for wait other places based on
            // value of "WaitinInprogress" and proceed for the wait and resume.
            var delay = pega.ui.automation.storeManager.getTestRunSlowMode();
            var curStepInd = pega.ui.automation.storeManager.getCurrentStepIndex();
            if (parseInt(curStepInd) > 0) {
                prevStepMetaData = pega.ui.automation.sequencer.getStepAtIndex(curStepInd - 1);
                if (prevStepMetaData && parseInt(prevStepMetaData.pyDelayInMillis) > 0)
                    delay = parseInt(prevStepMetaData.pyDelayInMillis);
            }
            var waitInProgress = sessionStorage.getItem("WaitinInprogress");
            if (!isNaN(delay) && parseInt(delay) > 0) {
                if (waitInProgress == "false") {
                    sessionStorage.setItem("WaitinInprogress", true);
                    setTimeout(function() {
                        sessionStorage.setItem("WaitinInprogress", false);
                        console.log("Calling resume on load of document with wait");
                        portalWindow.pega.ui.EventsEmitter.publish("ResumeTestCase");
                    }, parseInt(delay));
                }
            } else {
                console.log("Calling resume on load of document");
                portalWindow.pega.ui.EventsEmitter.publish("ResumeTestCase");
            }
        }
    };
    var _getTestCaseFromServer = function(testCaseName, testCaseClass, resumeFrom) {
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pzGetTestCaseData");
        strUrlSF.put("pyClassName", "Rule-Test-Functional-Case");
        strUrlSF.put("testCaseName", testCaseName);
        strUrlSF.put("testCaseClass", testCaseClass);
        var callback = {
            success: function(response) {
                try {
                    var testData = JSON.parse(response.responseText);

                    testData.id = testData.pzInsKey;
                    if (testData && testData.id) {
                        if (testData.pyIsInactive === 'true') {
                            console.log(testData.id + " is not being excuted as it is marked as disabled.");
                        } else {
                            pega.ui.automation.storeManager.putTestCaseInLocalStore(testData);
                            var testRunMode = pega.ui.automation.storeManager.getExecutorMode();
                            /* Slow mo start*/
                            pega.ui.automation.storeManager.removeTestRunSlowMode();
                            if (testData.pyEnableSlowMode && (testRunMode == "single" || testRunMode == "landing" || testRunMode == "hybrid")) {
                                if (testData.pyScenarioTestDelayInMillis > 0) {
                                    pega.ui.automation.storeManager.setTestRunSlowMode(testData.pyScenarioTestDelayInMillis);
                                }
                            } /* Slow mo end*/
                            /* Rerun code starts, Rerun should happen for all type of run modes except test cases running from portal*/
                            if ((testRunMode != "single" && testRunMode != "debug" && testRunMode != "edit") &&
                                (testData.pyEnableRerunMode === true && pega.ui.automation.storeManager.getIsRerunEnabeledForTestCases() == null) && pega.ui.automation.storeManager.getTestCasesRerunCount() == null) {
                                pega.ui.automation.storeManager.setIsRerunEnabeledForTestCases(true);
                                pega.ui.automation.storeManager.setTestCasesRerunCount(testData.pyScenarioTestRerunCount);
                            }

                            if (pega.ui.automation.storeManager.getIsRerunEnabeledForTestCases()) {
                                var failedTestCase = { "pyClassName": testData.pyClassName, "pyCategory": testData.pyCategory, "pyIsInactive": testData.pyIsInactive, "pyPurpose": testData.pyPurpose };
                                pega.ui.automation.storeManager.setCurrentTestCaseForRerun(failedTestCase);

                            }

                            _onHaveTestCase(resumeFrom);
                        }
                    }
                } catch (e) {
                    console.error("Exception while parsing test case data.", e);
                    _abortTestCaseExecution(e);
                }
            },
            failure: function(response) {
                //TODO
            }
        };
        pega.u.d.ServerProxy.doAction(strUrlSF, null, {
            online: function() {
                pega.u.d.asyncRequest("POST", strUrlSF, callback);
            },
            offline: function() {
                // Do nothing.
            }
        });
    };
    
    var _getAllTestCasesFromServer = function() {
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pzGetAllFunctionalTestCases");
        var callback = {
            success: function(response) {
                try {
                    jsonResponse = JSON.parse(response.responseText);
                    var testCaseList = jsonResponse["pxResults"];
                    if (testCaseList) {
                        pega.ui.automation.storeManager.putTestCasesListInLocalStore(testCaseList);
                        _onHaveAllTestCases();
                    }
                } catch (e) {
                    console.error("Exception while parsing test case list.", e);
                    _abortTestCaseExecution(e);
                }
            },
            failure: function(response) {
                //TODO
            }
        };
        pega.u.d.ServerProxy.doAction(strUrlSF, null, {
            online: function() {
                pega.u.d.asyncRequest("POST", strUrlSF, callback);
            },
            offline: function() {
                // Do nothing.
            }
        });
    };
  
    var _resumeTestCase = function(testCaseName, testCaseClass, type) {
        var nextStepInd = pega.ui.automation.storeManager.getCurrentStepIndex();
        var resumeFrom = nextStepInd;
        var stepMetaData = pega.ui.automation.storeManager.getTestCaseStepMeta(nextStepInd - 1);
        if (stepMetaData && stepMetaData["isUpdated"] == true) {
            resumeFrom = nextStepInd - 1;
        }
        _onHaveTestCase(resumeFrom);
    }

    var _captureIdleState = function(data) {
        _updateTestStepResultWithDocStateData(data);
    }

    var _executeTestCase = function(testCaseName, testCaseClass, type, resumeFrom) {
        try {
            console.log("********** Running Test Case: " + testCaseName + " ************");
            if (pega.ui.automation.storeManager.getDocStateCaptureFlag() == "true") {
                pega.ui.EventsEmitter.unsubscribe(pega.ui.statetracking.IDLE_EVENT, pega.ui.automation.executor
                    .captureIdleState);
                pega.ui.EventsEmitter.subscribe(pega.ui.statetracking.IDLE_EVENT, pega.ui.automation.executor
                    .captureIdleState);
            }
            if (!type || type == "single") {
                pega.ui.automation.storeManager.setExecutorMode("single");
            } else if (type == "debug") {
                pega.ui.automation.storeManager.setExecutorMode("debug");
            } else if (type == "landing") {
                pega.ui.automation.storeManager.setExecutorMode("landing");
            }
            _getTestCaseFromServer(testCaseName, testCaseClass, resumeFrom);
        } catch (e) {
            console.error("Error in executeTestCase", e);
            _abortTestCaseExecution(e);
        }
    };

    var _runAndRerecordTestCase = function(testCaseName, testCaseClass) {
        var rerecordStepIndex = _getRerecordStepIndex();
        if (rerecordStepIndex < 0 || rerecordStepIndex == null || rerecordStepIndex == undefined) {
            return;
        }
        _runAndEditTestCase(testCaseName, testCaseClass, rerecordStepIndex);
        _setRerecordStepIndex(-1);
    }

    var _getRerecordStepIndex = function() {
        return _rerecordStepIndex;
    }

    var _setRerecordStepIndex = function(index) {
        if (index == null || index == undefined) {
            index = $(event.target).closest("[node_name='pyRecordingTestStepRow']").attr("index");
        }
        if (isNaN(parseInt(index))) {
            console.log("Invalid rerecordStepIndex");
            return;
        }
        _rerecordStepIndex = index;
    }

    var _runAndEditTestCase = function(testCaseName, testCaseClass, editStepIndex) {
        if (editStepIndex == null || editStepIndex == undefined) {
            editStepIndex = $(event.target).closest("[node_name='pyRecordingTestStepRow']").attr("index");
        }
        if (isNaN(parseInt(editStepIndex))) {
            console.log("Invalid editStepIndex");
            return;
        }
        console.log("********** Running Test Case for edit " + testCaseName + " ************");
        pega.ui.automation.storeManager.setExecutorMode("edit");

        var lastRunStepIndex = pega.ui.automation.storeManager.getLastRunStepIndex();

        if (lastRunStepIndex == null || lastRunStepIndex == 'undefined' || parseInt(editStepIndex) < parseInt(lastRunStepIndex)) {
            lastRunStepIndex = 0;
        }

        pega.ui.automation.storeManager.setEditStepIndex(editStepIndex);
        var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
        var testData = pega.ui.automation.storeManager.getTestCaseFromLocalStore(testCaseId);
        if (!testData) {
            _getTestCaseFromServer(testCaseName, testCaseClass, lastRunStepIndex);
        } else {
            _onHaveTestCase(lastRunStepIndex);
        }

    };
    var _runTestCases = function(testCaseList, jobid) {
        try {
            pega.ui.automation.storeManager.setExecutorMode("hybrid");
            if (testCaseList) {
                pega.ui.automation.storeManager.setAutomationJobId(jobid);
                pega.ui.automation.storeManager.putTestCasesListInLocalStore(testCaseList);
                _onHaveAllTestCases();
            }
        } catch (e) {
            console.error("Error in runTestCases", e);
            _abortTestCaseExecution(e);
        }
    }

    /*
     * US-346422  : When suite id is paased, run the testcases belonging to the suite, testSuiteID is InsKey
     */
    var _runTestCasesOfSuite = function(jobid,testSuiteID) {  
        pega.ui.automation.storeManager.setExecutorMode("hybrid");
        pega.ui.automation.storeManager.setAutomationJobId(jobid);
        //for every fresh run, remove rerun related variables
        pega.ui.automation.storeManager.cleanRerunVariables();
            
       //invoke script to run testsuite in pzAFTInfra
       pega.desktop.AFTRunner.executeTestSuite(testSuiteID,window); 
   }
    
    var _runAllTestCases = function(jobid) {
        pega.ui.automation.storeManager.setExecutorMode("hybrid");
        pega.ui.automation.storeManager.setAutomationJobId(jobid);
        //for every fresh run, remove rerun related variables
        pega.ui.automation.storeManager.cleanRerunVariables();
        _getAllTestCasesFromServer();      
    }

    var _runAll = function() {
        pega.ui.automation.storeManager.setExecutorMode("bulk");
        _getAllTestCasesFromServer();
    };

    var _runNextTestCase = function() {
        try {
            var testCase = pega.ui.automation.storeManager.getNextTestCaseFromLocalStore();
            if (testCase) {
                _executeTestCase(testCase["pyPurpose"], testCase["pyClassName"], "bulk");
            } 
            /* Here testCase will be null */
            else if (pega.ui.automation.storeManager.getIsRerunEnabeledForTestCases() &&
                pega.ui.automation.storeManager.getTestCasesRerunCount() > 0 && pega.ui.automation.storeManager
                .getRerunTestCaseList() && pega.ui.automation.storeManager.getRerunTestCaseList().pxResults.length >
                0) {
                var rerunCount = pega.ui.automation.storeManager.getTestCasesRerunCount();
                pega.ui.automation.storeManager.setTestCasesRerunCount(--rerunCount);
                var reRunTestCaseList = pega.ui.automation.storeManager.getRerunTestCaseList();
                pega.ui.automation.storeManager.reSetTestCaseRerunList();
                pega.ui.automation.storeManager.setRerunInProgress(true);
                pega.ui.automation.storeManager.putTestCasesListInLocalStore(reRunTestCaseList["pxResults"]);
                _runNextTestCase();
            } else {
                pega.ui.automation.executor.messenger.setRunnerMessage("AllTestcasesFinished");
                pega.ui.automation.resultsPublisher.publishAllResults();
                _cleanAll();
            }
        } catch (e) {
            console.error("Error in runNextTestCase", e);
            _abortTestCaseExecution(e);
        }
    };
    var _onHaveTestCase = function(resumeFrom) {
        var stopExecution = false;
        // Initiate the "waitInProgress" just before calling the test case
        sessionStorage.setItem("WaitinInprogress", false);
        if (!isNaN(parseInt(resumeFrom))) {
            pega.ui.automation.storeManager.setCurrentStepIndex(parseInt(resumeFrom));
        } else {
            //If its not a resumeFrom then it is the testcase beginning.          
            stopExecution = _onTestCaseBegin();
        }
        if (!stopExecution) {
            try {
                _runNextStep();
            } catch (e) {
                console.error("Exception while running step", e);
                _abortTestCaseExecution(e);
            }
        }
    };
    var _onHaveAllTestCases = function() {
        _runNextTestCase();
    };
    var _runNextStep = function() {
        if (pega.ui.automation.storeManager.getExecutorMode() == "edit") {
            var editStepIndex = pega.ui.automation.storeManager.getEditStepIndex();
            if (editStepIndex != null && editStepIndex !== 'undefined' && pega.ui.automation.storeManager.getCurrentStepIndex() == editStepIndex) {
                console.log("**** Edit Mode *** stopping test case at step: ", editStepIndex);
                //stop execution and make this index and start for next run
                pega.ui.automation.storeManager.setLastRunStepIndex(editStepIndex);
                pega.ui.automation.storeManager.setExecutorStatus("idle");
                pega.ui.automation.stateManager.queueOrFireClientIdleCallback(function() {
                    pega.ui.automation.recorder.startRecording();
                    pega.ui.automation.storeManager.setRecoderStepIndex(editStepIndex);
                });
                pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Stopped");
                return;
            }
        }
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        if (portalWindow.pega.ui.ClientCache.find('D_pyScenerioTestData') == null) {
            var dvJSON = pega.ui.automation.storeManager.getTestCaseDynamicValueFromLocalStore();
            if (dvJSON != null) {
                var newtestData = JSON.stringify(dvJSON);
                var portalWindow = pega.ui.automation.utils.getPortalWindow();
                portalWindow = portalWindow || window;
                portalWindow.afttestdatacp = portalWindow.pega.ui.ClientCache.createPage("D_pyScenerioTestData");
                portalWindow.afttestdatacp.adoptJSON(newtestData);
                portalWindow.afttestdatacp = null;
            } else {
                console.log("Dynamic data not present in session store");
            }
        }
        var result = null,
            isFirstStep = false;
        var step = pega.ui.automation.sequencer.getNextStep();
        pega.ui.automation.storeManager.setExecutorStatus("busy");
        if (step) {
            var currentStepIndex = pega.ui.automation.storeManager.getCurrentStepIndex();
            console.log("*** Running test case step index: ", currentStepIndex);
            var stepBeginData = {};
            stepBeginData.currentStepIndex = currentStepIndex;
            stepBeginData.testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
            pega.ui.EventsEmitter.publish("StepBegin", stepBeginData);
            var _runnerPromise = new Promise(function(resolve, reject) {
                resolve();
            });
            _runnerPromise.then(function(result) {
                if (step[pega.ui.automation.constants.IS_ASSERTOR] !== "true") {
                    return true;
                } else {
                    var _assertorPromise = new Promise(function(resolve, reject) {
                        _callAssertor(step, resolve);
                    });
                    return _assertorPromise;
                }
            }).then(function(assertorResult) {
                if (step[pega.ui.automation.constants.IS_NAVIGATOR] !== "true") {
                    return assertorResult;
                } else {
                    var _navigatorPromise = new Promise(function(resolve, reject) {
                        _callNavigator(step, resolve, assertorResult);
                    });
                    return _navigatorPromise;
                }
            }).then(function(result) {
                //getNextStep would have already incremented the step index so decrement in the result.
                result.currentStepIndex = currentStepIndex - 1;
                var mode = pega.ui.automation.storeManager.getExecutorMode();
               console.log("*** Step Status : " + result.pyStepResult+" ***");
                if (mode == "hybrid" && result.pyStepResult == pega.ui.automation.constants.STEP_RESULT.FAILED) {
                    //Set testcase failed action message
                    var tcId = pega.ui.automation.storeManager.getCurrentTestCase();
                    pega.ui.automation.executor.messenger.setRunnerMessage("TestcaseFail", [tcId, "" + result.currentStepIndex]);
                }
                //fire step complete event; shouldn't be used outside executor. Subcribe for StepResult instead.
                console.log("*** Step Completed ***");
                pega.ui.EventsEmitter.publish("StepComplete", result);
            });
        } else if (step == null) {
            pega.ui.EventsEmitter.publish("TestCaseComplete");
        }
    };
    var _callNavigator = function(step, resolveParentPromise, assertorResult) {
        //Call navigator API
        var componentNavigatorPromise = pega.ui.automation.navigator.performAction(step);
        componentNavigatorPromise.then(function(navResults) {
            var result = {};
            result.pyStepResult = _constants.STEP_RESULT.PASSED;
            if (typeof assertorResult == "object") {
                result.assertionResults = assertorResult.assertionResults;
                result.pyStepResult = assertorResult.pyStepResult;
            }
            var mode = pega.ui.automation.storeManager.getExecutorMode();
            var resumeTC = true;
            var bNavigationsPassed = true;
            if (navResults instanceof Array) {
                for (var i in navResults) {
                    if (navResults[i][_constants.STEP_RESULT.STATUS] == _constants.STEP_RESULT.FAILED) {
                        bNavigationsPassed = false;
                        result.pyStepResult = _constants.STEP_RESULT.FAILED;
                        break;
                    }
                }
                result.navigationResults = navResults;
            } else {
                bNavigationsPassed = false;
                result.pyStepResult = _constants.STEP_RESULT.FAILED;
                console.error("Navigation returned no result!");
            }
            if ((mode == "edit" || mode == "debug" || mode == "hybrid") && (!navResults || !bNavigationsPassed || (typeof assertorResult == "object" && assertorResult.pyStepResult == _constants.STEP_RESULT.FAILED))) {
                resumeTC = false;
                pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Stopped");
            }
            if (resumeTC) {
                var slowMotionDelay = pega.ui.automation.storeManager.getTestRunSlowMode();
                var isSlowMotionEnabled = slowMotionDelay && !isNaN(slowMotionDelay) && parseInt(slowMotionDelay) > 0;
                if ((mode == "single" || mode == "landing" || mode == "hybrid") && isSlowMotionEnabled) {
                    result.customWait = slowMotionDelay;
                    console.info("slow motion delay : " + result.customWait);
                    if (mode == "single" || mode == "landing")
                        _highlightElement(step);
                }
                if (parseInt(step.pyDelayInMillis) > 0) {
                    result.customWait = parseInt(step.pyDelayInMillis);
                    console.info("custom wait :" + result.customWait);
                }
                var waitInProgress = sessionStorage.getItem("WaitinInprogress");
                if (result.customWait) {
                    if (waitInProgress == "false") {
                        //wait for specified ms
                        sessionStorage.setItem("WaitinInprogress", true);
                        setTimeout(function() {
                            sessionStorage.setItem("WaitinInprogress", false);
                            pega.ui.EventsEmitter.publish("ResumeTestCase");
                        }, result.customWait);
                    }
                } else {
                    if (result.pyStepResult == _constants.STEP_RESULT.FAILED) {
                        // don't wait for doc idle on Failures
                        console.log("Calling resume on failure");
                        pega.ui.EventsEmitter.publish("ResumeTestCase");
                    } else {
                        //wait for the doc status to be ready.
                        pega.ui.automation.stateManager.queueOrFireClientIdleCallback(function() {
                            console.log("Called from queueOrFireClientIdleCallback");
                            pega.ui.EventsEmitter.publish("ResumeTestCase");
                        });
                    }
                }
            }
            resolveParentPromise(result);
        });
    };
    var _callAssertor = function(step, resolveParentPromise) {
        //Call Asserter API
        var bAssertionsPassed = true;
        var assertionResults, result = {};
        result.pyStepResult = _constants.STEP_RESULT.PASSED;
        result.resumeOperation = true;
        var mode = pega.ui.automation.storeManager.getExecutorMode();
        var componentAssertorPromise = pega.ui.automation.assertor.performAssertion(step);
        componentAssertorPromise.then(function(assertionResults) {
            if (assertionResults instanceof Array) {
                for (var i in assertionResults) {
                    if (assertionResults[i][_constants.STEP_RESULT.STATUS] == _constants.STEP_RESULT.FAILED) {
                        bAssertionsPassed = false;
                        result.pyStepResult = _constants.STEP_RESULT.FAILED;
                        break;
                    }
                }
                result.assertionResults = assertionResults;
            } else {
                bAssertionsPassed = false;
                result.pyStepResult = _constants.STEP_RESULT.FAILED;
                console.error("Assertion returned no result!");
            }
            if ((mode == "edit" || mode == "debug" || mode == "hybrid") && (!bAssertionsPassed || !assertionResults)) {
                result.resumeOperation = false;
                pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Stopped");
            } else if (step[pega.ui.automation.constants.IS_NAVIGATOR] !== "true") {
                console.log("Called resume from Assertor");
                pega.ui.EventsEmitter.publish("ResumeTestCase");
            }
            resolveParentPromise(result);
        });

    };
    var _highlightElement = function(stepData) {
        var selector = stepData.pySelector;
        if (selector) {
            var target = pega.ui.automation.utils.getDomElement(selector);
            var inspector = pega.ui.ScreenInspector.getInspector("testExecutor");
            if (!target || target.style.display == "none" || target.hidden) {
                //Do nothing.
            } else {
                _clearHighlight();
                inspector.highlightError(target);
            }
        }
    };
    var _clearHighlight = function() {
        var inspector = pega.ui.ScreenInspector.getInspector("testExecutor");
        inspector.clearHighlight();
    }
    var _onResume = function(data) {
        pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Running");
        if (data && data.testCaseId && data.type == "resumeAndFetch") {
            // This is Resume in Debug mode
            var resumeFrom = pega.ui.automation.storeManager.getCurrentStepIndex();
            //bResumeFromCurrentStep : if the current step is updated in debug mode then run the current step again.
            if (data.bResumeFromCurrentStep == false) {
                resumeFrom++;
            }
            _executeTestCase(data.testCaseId, data.testCaseClass, "debug", resumeFrom);
        } else {
            _runNextStep();
        }
    };
    var _onTestCaseBegin = function() {
        pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Running");
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        if (pega.ui.automation.storeManager.getTestCaseDynamicValueFromLocalStore() == null) {
            var oSafeURL = new SafeURL(pega.u.d.url);
            oSafeURL.put("pyActivity", "pzGetScenerioTestDynamicValues");
            oSafeURL.put("pyClassName", "Rule-Test-Functional-Case");
            try {
                var refJSON = JSON.parse(httpRequestAsynch(oSafeURL.toURL(), null, 50, 100));
                if (refJSON) {
                    pega.ui.automation.storeManager.setTestCaseDynamicValueInLocalStore(refJSON);
                    if (portalWindow.pega.ui.ClientCache.find('D_pyScenerioTestData') == null) {
                        var dvJSON = pega.ui.automation.storeManager.getTestCaseDynamicValueFromLocalStore();
                        if (dvJSON != null) {
                            var newtestData = JSON.stringify(dvJSON);
                            var portalWindow = pega.ui.automation.utils.getPortalWindow();
                            portalWindow = portalWindow || window;
                            portalWindow.afttestdatacp = portalWindow.pega.ui.ClientCache.createPage("D_pyScenerioTestData");
                            portalWindow.afttestdatacp.adoptJSON(newtestData);
                            portalWindow.afttestdatacp = null;
                        } else {
                            console.log("Dynamic data not present in session store");
                        }
                    }
                }
            } catch (err) {
                console.error("error while fetching data from activity", err);
                _abortTestCaseExecution(err);
            }
        }
        //actions to be performed on beginning of testcase
        var stateTrackerElement = portalWindow && portalWindow.document.querySelector(".document-statetracker");
        if (stateTrackerElement) {
            stateTrackerElement.setAttribute("data-aft-reload", "NO");
        }
        if (pega.ui.automation.storeManager.getExecutorMode() == "hybrid") {
            var tcId = pega.ui.automation.storeManager.getCurrentTestCase();
            pega.ui.automation.executor.messenger.setRunnerMessage("TestcaseStart", [tcId]);
        }
        _createTestResultData();
        /*Should always be at end of testcasebegin API : Switch portal if not in same portal*/
        var _testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
        var _testData = pega.ui.automation.storeManager.getTestCaseFromLocalStore(_testCaseId);
        if (_testData["pyPortalName"] && pega.u.d.portalName && _testData["pyPortalName"] !== pega.u.d.portalName) {
            pega.ui.automation.storeManager.setExecutorStatus("busy");
            changePortal(_testData["pyPortalName"], pega.u.d.portalName);
            return true;
        }
        return false;
    };
    var _onTestCaseComplete = function() {
        console.log("********** Completed Test Case ************");
        //clear the "waitInProgress" on test case complete for the next test case to run 
        sessionStorage.setItem("WaitinInprogress", false);
        //Append failed test cases to rerun list
        var testRunMode = pega.ui.automation.storeManager.getExecutorMode();
        if (testRunMode !== "single" && testRunMode !== "debug" && testRunMode !== "edit" &&
            pega.ui.automation.storeManager.getIsRerunEnabeledForTestCases()) {
            var isTestCaseFailed = pega.ui.automation.storeManager.getTestCaseResult().pyTestCaseRunResult;
            if (isTestCaseFailed == "Failed") {
                var failedTestCase = pega.ui.automation.storeManager.getCurrentTestCaseForRerun();
                pega.ui.automation.storeManager.addFailedTestCaseForRerun(failedTestCase);
            }
        }
        pega.ui.EventsEmitter.unsubscribe(pega.ui.statetracking.IDLE_EVENT, pega.ui.automation.executor.captureIdleState);
        pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Finished");
        pega.ui.automation.storeManager.setExecutorStatus("idle");
        if (pega.ui.automation.storeManager.getDocStateCaptureFlag() == "true") {
            var testCaseResultData = pega.ui.automation.storeManager.getTestCaseResult();
            pega.ui.EventsEmitter.publish("TestCaseResultWithDocState", testCaseResultData);
        }
        var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
        if (testCaseId) {
            var data = {};
            var mode = pega.ui.automation.storeManager.getExecutorMode();
            if (mode == "edit") {
                _updateTestCaseRunResult();
                //Edit mode, do not publish result data, do the cleanup
                _cleanupTestCase();
                return;
            }
            data.mode = mode;
            data.testCaseId = testCaseId;
            if (mode == "single" || mode == "debug" || mode == "landing") {
                if (mode == "debug") {
                    _updateTestCaseRunResult();
                }
                pega.ui.automation.resultsPublisher.publishResult(data);
                _cleanupTestCase();
            } else if (mode == "bulk") {
                //publish result for current testcase and Run next testcase
                pega.ui.automation.resultsPublisher.publishResult(data);
                _runNextTestCase();
            } else if (mode == "hybrid") {
                pega.ui.automation.executor.messenger.setRunnerMessage("TestcaseFinish", [testCaseId]);
            }
        }
    };
    var _updateTestCaseRunResult = function() {
        var resultData = pega.ui.automation.storeManager.getTestCaseResult();
        var runresult = "Passed";
        for (var i in resultData.pyTestCaseSteps) {
            if (resultData.pyTestCaseSteps[i].pyStepResult == "Failed") {
                runresult = "Failed";
                break;
            }
        }
        resultData.pyTestCaseRunResult = runresult;
        pega.ui.automation.storeManager.setTestCaseResult(resultData);
    };
    var _onStepComplete = function(data) {
        //actions to be performed on completion of a step
        _updateTestResultData(data);
    };
    var _createTestResultData = function() {
        var resultData = {};
        var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
        var testData = pega.ui.automation.storeManager.getTestCaseFromLocalStore(testCaseId);
        resultData.pyPurpose = testCaseId;
        resultData.pyClassName = testData.pyClassName;
        resultData.pxObjClass = "Data-TestCaseResults-Functional";
        resultData.pyLabel = testData.pyLabel;
        resultData.pyTestCaseRunResult = "Passed";
        resultData.startTime = performance.now();
        resultData.pyTestCaseKey = testData.pxInstanceLockedKey ? testData.pxInstanceLockedKey : testData.pzInsKey;
        resultData.pyTestCaseSteps = [];
        pega.ui.automation.storeManager.setTestCaseResult(resultData);
    };

    var _updateTestStepResultWithDocStateData = function(docStateData) {
        var stepIndex = pega.ui.automation.storeManager.getCurrentStepIndex() - 1;
        var testCaseResult = pega.ui.automation.storeManager.getTestCaseResult();
        var stepResult = {};
        if (testCaseResult.pyTestCaseSteps && testCaseResult.pyTestCaseSteps[stepIndex]) {
            stepResult = testCaseResult.pyTestCaseSteps[stepIndex];
        }
        stepResult.pyDocStateData = docStateData;
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        stepResult.pyPerformanceTiming = portalWindow.performance.timing;
        stepResult.pyPaintPerformanceTiming = portalWindow.performance.getEntriesByType("paint");
        testCaseResult.pyTestCaseSteps[stepIndex] = stepResult;
        pega.ui.automation.storeManager.setTestCaseResult(testCaseResult);
    }

    var _updateTestResultData = function(result) {
        var resultData = pega.ui.automation.storeManager.getTestCaseResult();
        var stepData = pega.ui.automation.sequencer.getStepAtIndex(result.currentStepIndex);
        var stepResult = {};
        if (resultData.pyTestCaseSteps && resultData.pyTestCaseSteps[result.currentStepIndex]) {
            stepResult = resultData.pyTestCaseSteps[result.currentStepIndex];
        }
        if (stepData) {
            stepResult.pyTestStepName = stepData.pyTestStepName;
            stepResult.pyComponentType = stepData.pyComponentType;
            stepResult.pxObjClass = "Embed-Test-Steps-Result";
            if (result.pyStepResult == _constants.STEP_RESULT.PASSED) {
                stepResult.pyStepResult = "Passed";
            } else if (result.pyStepResult == _constants.STEP_RESULT.FAILED) {
                stepResult.pyStepResult = "Failed";
                if (resultData) {
                    resultData.pyTestCaseRunResult = "Failed";
                }
                if (result.assertionResults) {
                    stepResult.pyAssertionResults = [];
                    for (var i in result.assertionResults) {
                        stepResult.pyAssertionResults[i] = _setAssertOrNavResult(stepData, result.assertionResults[i], i);
                    }
                }
                if (result.navigationResults) {
                    stepResult.pyNavigationResults = _setAssertOrNavResult(stepData, result.navigationResults[0]);
                }
            }
        }
        if (resultData) {
            resultData.pyTestCaseSteps[result.currentStepIndex] = stepResult;
            pega.ui.automation.storeManager.setTestCaseResult(resultData);
        }
        stepResult.currentStepIndex = result.currentStepIndex;
        pega.ui.automation.resultsPublisher.publishStepResult(stepResult);
    };
    var _setAssertOrNavResult = function(stepData, tResult, assertionIndex) {
        var navOrAssertResult = {};
        navOrAssertResult.pxObjClass = "Embed-ExpectedResults-Functional";
        if (tResult[_constants.STEP_RESULT.STATUS] == _constants.STEP_RESULT.PASSED) {
            navOrAssertResult.pyStatus = "Passed";
            if (assertionIndex) {
                navOrAssertResult.pyAttributeDesc = stepData.pyTestAssertions[assertionIndex].pyAttributeDesc;
            }
        } else {
            navOrAssertResult.pyStatus = "Failed";
            navOrAssertResult.pyFailureReason = tResult[_constants.STEP_RESULT.FAILURE_REASON];
            if (tResult[_constants.STEP_RESULT.FAILURE_TYPE] == _constants.STEP_RESULT.FAILURE_TYPES.NAVIGATOR) {
                if (tResult[_constants.STEP_RESULT.SELECTOR]) {
                    navOrAssertResult.pyElementSelector = tResult[_constants.STEP_RESULT.SELECTOR];
                }
                navOrAssertResult.pyActionName = stepData.pyTestNavigator.pyNavigatorActionName;
            } else if (tResult[_constants.STEP_RESULT.FAILURE_TYPE] == _constants.STEP_RESULT.FAILURE_TYPES.ASSERTOR) {
                navOrAssertResult.pyExpectedValue = stepData.pyTestAssertions[assertionIndex].pyExpectedValue;
                navOrAssertResult.pyActualValue = tResult[_constants.STEP_RESULT.ACTUAL_VALUE];
                navOrAssertResult.pyComparator = stepData.pyTestAssertions[assertionIndex].pyComparator;
                navOrAssertResult.pyAttributeDesc = stepData.pyTestAssertions[assertionIndex].pyAttributeDesc;
            } else if (tResult[_constants.STEP_RESULT.FAILURE_TYPE] == _constants.STEP_RESULT.FAILURE_TYPES.DOM) {
                navOrAssertResult.pyElementSelector = tResult[_constants.STEP_RESULT.SELECTOR];
            } else if (tResult[_constants.STEP_RESULT.FAILURE_TYPE] == _constants.STEP_RESULT.FAILURE_TYPES.INTERNAL) {
                navOrAssertResult.pyFailureCode = tResult[_constants.STEP_RESULT.FAILURE_CODE];
            }
        }
        return navOrAssertResult;
    };
    var _cleanupTestCase = function(testCaseId) {
        var mode = pega.ui.automation.storeManager.getExecutorMode();
        pega.ui.automation.storeManager.removeTestCaseFromLocalStore(testCaseId);
        pega.ui.automation.storeManager.removeCurrentTestCaseAndStep();
        _clearHighlight();
        if (mode == "single" || mode == "debug" || mode == "hybrid" || mode == "edit") {
            pega.ui.automation.storeManager.removeTestCaseDynamicValueFromLocalStore();
            // code need to be added to remove D_pyScenerioTestData page from ClientCache.
            var portalWindow = pega.ui.automation.utils.getPortalWindow();
            var pyScenerioTestData = portalWindow.pega.ui.ClientCache && portalWindow.pega.ui.ClientCache.find("D_pyScenerioTestData");
            if (pyScenerioTestData) {
                pyScenerioTestData.remove();
                pyScenerioTestData = null;
            } 
          
        }
    };
    var _cleanAll = function() {
        pega.ui.automation.storeManager.removeAllTestCasesFromLocalStore();
        pega.ui.automation.storeManager.removeCurrentTestCaseAndStep();
        pega.ui.automation.storeManager.removeTestCasesListFromLocalStore();
        pega.ui.automation.storeManager.removeTestCaseDynamicValueFromLocalStore();
        var portalWindow = pega.ui.automation.utils.getPortalWindow();
        var pyScenerioTestData = portalWindow.pega.ui.ClientCache.find("D_pyScenerioTestData");
        if (pyScenerioTestData) {
            pyScenerioTestData.remove();
            pyScenerioTestData = null;
        }
    };

    return {
        onload: _onload,
        executeTestCase: _executeTestCase,
        runAll: _runAll,
        cleanAll: _cleanAll,
        onResume: _onResume,
        onTestCaseComplete: _onTestCaseComplete,
        onStepComplete: _onStepComplete,
        resumeTestCase: _resumeTestCase,
        runTestCases: _runTestCases,
        runAllTestCases: _runAllTestCases,
        runTestCasesOfSuite: _runTestCasesOfSuite,
        runNextTestCase: _runNextTestCase,
        runAndEditTestCase: _runAndEditTestCase,
        runAndRerecordTestCase: _runAndRerecordTestCase,
        setRerecordStepIndex: _setRerecordStepIndex,
        captureIdleState: _captureIdleState,
        onAbortTestExecution: _abortTestCaseExecution

    };
})();

pega.ui.EventsEmitter.subscribe("ResumeTestCase", pega.ui.automation.executor.onResume);
pega.ui.EventsEmitter.subscribe("StepComplete", pega.ui.automation.executor.onStepComplete);
pega.ui.EventsEmitter.subscribe("TestCaseComplete", pega.ui.automation.executor.onTestCaseComplete);
pega.ui.EventsEmitter.subscribe("abortTestExecution", pega.ui.automation.executor.onAbortTestExecution);
pega.u.d.attachOnload(pega.ui.automation.executor.onload);
//static-content-hash-trigger-YUI
pega.ui = pega.ui || {};
pega.ui.automation = pega.ui.automation || {};
pega.ui.automation.executor = pega.ui.automation.executor || {};

pega.ui.automation.executor.messenger = {
    /*
        This is used by the Selenium/CBT runner to read messages posted by the JS test executor.
     */
    getExecutorMessage: function() {
        var messageData = pega.ui.automation.storeManager.getTestCaseRunnerMessage(false);
        return JSON.stringify(messageData);
    },
    /*
        This is used by the Selenium/CBT runner to send messages to the JS test executor.
     */
    setExecutorMessage: function(actionName, actionArgs) {
        var messageData = {};
        messageData.actionName = actionName;
        messageData.actionArgs = actionArgs;
        pega.ui.automation.storeManager.setTestCaseRunnerMessage(messageData, true);
        this.fireExecutorAction();
        return true;
    },
    /*
        This is used by the JS test executor to send messages to the Selenium/CBT runner.
     */
    setRunnerMessage: function(actionName, actionArgs) {
        var messageData = {};
        messageData.actionName = actionName;
        messageData.actionArgs = actionArgs;
        pega.ui.automation.storeManager.setTestCaseRunnerMessage(messageData, false);
        return true;
    },
    resetMessage: function(bResetExecutorMessages) {
        pega.ui.automation.storeManager.removeTestCaseRunnerMessage(bResetExecutorMessages ? true : false);
    },
    fireExecutorAction: function() {
        var messageData = pega.ui.automation.storeManager.getTestCaseRunnerMessage(true);
        if(messageData){
            if (messageData.actionName == "Resume") {
                //should wait for doc idle???
                pega.ui.EventsEmitter.publish("ResumeTestCase");
            } else if (messageData.actionName == "UploadResult") {
                pega.ui.automation.resultsPublisher.publishResultWithScreenshots({
                    testCaseId:messageData.actionArgs[0],
                    screenshots:messageData.actionArgs[1]});
            }
        }
    }
};


/*

var testCases = [
  {
    "pyPurpose": "TC_Runner1",
    "pyClassName": "Work-"
  }
];

pega.ui.automation.executor.runTestCases(testCases);

var checkExecutorStatus = setInterval(function(){
    // do your thing
    var executorMessage = pega.ui.automation.executor.messenger.getExecutorMessage();
    console.log("executorMessage: ", executorMessage);
    if(executorMessage && executorMessage.actionName === "TestcaseFinish") {
      console.log("Test case is finished. clling upload result..");
      pega.ui.automation.executor.messenger.setExecutorMessage("UploadResult",executorMessage.actionArgs[0]);
    }else if(executorMessage && executorMessage.actionName === "AllTestcasesFinished") {
        console.log("All Test cases are finished. Stop pinging..");
        clearInterval(checkExecutorStatus);
    }
}, 500);

*/
/*
    Store manager uses session storage to store data like current testcase, step ,
     testcase list, executor status etc..
 */
pega.ui.automation.storeManager = (function() {
    var _currentTestCaseAndStep = "currentTestCaseAndStep";
    var rerunTestCaseList = [];
    var _getTestCaseFromLocalStore = function(testCaseId) {
        if (testCaseId) {
            var testData = sessionStorage.getItem("TestCase-" + testCaseId);
            testData = JSON.parse(testData);
            return testData;
        }
        return null;
    };
    var _putTestCaseInLocalStore = function(testData) {
        if (testData && testData.id) {
            var testCaseId = testData.id;
            sessionStorage.setItem("TestCase-" + testData.id, JSON.stringify(testData));
            _setCurrentTestCase(testCaseId);
            return true;
        }
        return false;
    };

    var _updateCurrentTestCaseStep = function(index, stepObject) {
        var testCase = _getCurrentTestCase(),
            testCaseData = _getTestCaseFromLocalStore(testCase),
            testCaseSteps = testCaseData.pyTestCaseSteps;

        if(index <= testCaseSteps.length) {
            testCaseSteps.splice(index - 1, 0, stepObject);
        }
        _putTestCaseInLocalStore(testCaseData);
    };

    var _putTestSuiteInLocalStore = function(testSuiteData) {
        if (testSuiteData && testSuiteData.id) {
            var testSuiteId = testSuiteData.id;
            sessionStorage.setItem("TestSuite-" + testSuiteData.id, JSON.stringify(testSuiteData));
            _setSuiteInsKey(testSuiteId);
            if (testSuiteData.testSuiteStartTime) {
                _setSuiteStartTime(testSuiteData.testSuiteStartTime);
            }
            return true;
        }
        return false;
    };

    var _removeTestCaseFromLocalStore = function(testCaseId) {
        if (testCaseId) {
            sessionStorage.removeItem("TestCase-" + testCaseId);
            return true;
        }
        return false;
    };
    var _removeAllTestCasesFromLocalStore = function() {
        var sessionKeys = Object.keys(sessionStorage);
        for (var i in sessionKeys) {
            var key = sessionKeys[i];
            if (key.indexOf("TestCase-") == 0) {
                sessionStorage.removeItem(key);
            }
        }
    };
    var _getNextTestCaseFromLocalStore = function() {
        var testCaseList = sessionStorage.getItem("TestCaseList");
        testCaseList = JSON.parse(testCaseList);
        if (testCaseList) {
            var nextTestCase = testCaseList.shift();
            if (testCaseList.length > 0) {
                sessionStorage.setItem("TestCaseList", JSON.stringify(testCaseList));
            } else {
                sessionStorage.setItem("TestCaseList", null);
            }
            return nextTestCase;
        }
        return null;
    };
    var _putTestCasesListInLocalStore = function(testCaseList) {
        if (testCaseList instanceof Array) {
            sessionStorage.setItem("TestCaseList", JSON.stringify(testCaseList));
            return true;
        }
        return false;
    };
    var _removeTestCasesListFromLocalStore = function() {
        sessionStorage.removeItem("TestCaseList");
    };
    var _setCurrentTestCase = function(testCaseId) {
        if (testCaseId) {
            sessionStorage.setItem(_currentTestCaseAndStep, testCaseId + "$0");
            return true;
        }
        return false;
    };
    var _setCurrentStepIndex = function(stepIndex) {
        var testCaseId = _getCurrentTestCase();
        if (testCaseId && !isNaN(parseInt(stepIndex))) {
            sessionStorage.setItem(_currentTestCaseAndStep, testCaseId + "$" + stepIndex);
            return true;
        }
        return false;
    };
    var _getCurrentTestCase = function() {
        var currentTestCase = sessionStorage.getItem(_currentTestCaseAndStep);
        if (currentTestCase) {
            currentTestCase = currentTestCase.substring(0, currentTestCase.lastIndexOf('$'));
            return currentTestCase;
        }
        return null;
    };
    var _getCurrentStepIndex = function() {
        var currentStepIndex = sessionStorage.getItem(_currentTestCaseAndStep);
        if (currentStepIndex) {
            currentStepIndex = currentStepIndex.substring(currentStepIndex.lastIndexOf('$') + 1);
            return parseInt(currentStepIndex);
        }
        return null;
    };
    var _updateTestCaseStepData = function(testCaseId, stepIndex, updatedStepData) {
        var testCaseData = sessionStorage.getItem("TestCase-" + testCaseId);
        testCaseData = JSON.parse(testCaseData);
        var steps = testCaseData[pega.ui.automation.constants.TEST_CASE_STEPS];
        steps[stepIndex] = updatedStepData;
        sessionStorage.setItem("TestCase-" + testCaseId, JSON.stringify(testCaseData));
    };
    var _removeCurrentTestCaseAndStep = function() {
        sessionStorage.removeItem(_currentTestCaseAndStep);
    };
    var _setTestCaseResult = function(resultData) {
        if (resultData) {
            try {
                resultData = JSON.stringify(resultData);
                sessionStorage.setItem("TestCaseResult", resultData);
            } catch (e) {
                console.log("Exception while parsing testcase result!");
            }
        }
    };
    var _getTestCaseResult = function() {
        var resultData = sessionStorage.getItem("TestCaseResult");
        if (resultData) {
            resultData = JSON.parse(resultData);
        }
        return resultData;
    };
    var _getTestCaseStepResult = function(stepIndex) {
        var stepResult = null;
        var resultData = sessionStorage.getItem("TestCaseResult");
        if (resultData) {
            resultData = JSON.parse(resultData);
            stepResult = resultData.pyTestCaseSteps[stepIndex];
        }
        return stepResult;
    };
    var _removeTestCaseResult = function() {
        sessionStorage.removeItem("TestCaseResult");
    };
    var _setTestCaseMeta = function(testCaseMeta) {
        if (testCaseMeta) {
            try {
                testCaseMeta = JSON.stringify(testCaseMeta);
                sessionStorage.setItem("TestCaseMetaData", testCaseMeta);
            } catch (e) {
                console.log("Exception while parsing testcase metadata!");
            }
        }
    };
    var _getTestCaseMeta = function() {
        var testCaseMeta = sessionStorage.getItem("TestCaseMetaData");
        if (testCaseMeta) {
            testCaseMeta = JSON.parse(testCaseMeta);
        }
        return testCaseMeta;
    };
    var _removeTestCaseMeta = function() {
        sessionStorage.removeItem("TestCaseMetaData");
    };
    var _removeTestCaseEditData = function() {
        sessionStorage.removeItem("StartRunIndex");
        sessionStorage.removeItem("StopRunIndex");
        sessionStorage.removeItem("ExecutorMode");
    };
    var _setTestCaseStepMeta = function(stepIndex, metadata) {
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta == null) {
                _setTestCaseMeta({ pyTestCaseSteps: [] });
                tcMeta = _getTestCaseMeta();
            }
            if (!metadata) {
                metadata = {};
            }
            tcMeta.pyTestCaseSteps[stepIndex] = metadata;
            _setTestCaseMeta(tcMeta);
        }
    };
    var _getTestCaseStepMeta = function(stepIndex) {
        var stepMeta = null;
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta) {
                stepMeta = tcMeta.pyTestCaseSteps[stepIndex];
            }
        }
        return stepMeta;
    };
    var _resetTestCaseStepMeta = function(stepIndex) {
        if (!isNaN(stepIndex)) {
            var tcMeta = _getTestCaseMeta();
            if (tcMeta) {
                tcMeta.pyTestCaseSteps[stepIndex] = {};
                _setTestCaseMeta(tcMeta);
            }
        }
    };
    var _getAllTestCaseStepsMeta = function() {
        var testCaseMeta = _getTestCaseMeta();
        if (testCaseMeta) {
            return testCaseMeta.pyTestCaseSteps;
        }
    };
    var _setRecoderStepIndex = function(stepIndex) {
        if (!isNaN(stepIndex)) {
            sessionStorage.setItem("RecoderStepIndex", stepIndex);
        }
    };
    var _getRecoderStepIndex = function() {
        var recIndex = sessionStorage.getItem("RecoderStepIndex");
        return recIndex ? parseInt(recIndex) : recIndex;
    };
    var _removeRecoderStepIndex = function() {
        sessionStorage.removeItem("RecoderStepIndex");
    };
    var _setLastRunStepIndex = function(index) {
        sessionStorage.setItem("LastRunStepIndex", index);
    };
    var _getLastRunStepIndex = function() {
        return sessionStorage.getItem("LastRunStepIndex");
    };
    var _setEditStepIndex = function(index) {
        sessionStorage.setItem("EditStepIndex", index);
    };
    var _getEditStepIndex = function() {
        return sessionStorage.getItem("EditStepIndex");
    };
    var _setExecutorStatus = function(status) {
        sessionStorage.setItem("ExecutorStatus", status);
    };



    var _setSuiteInsKey = function(key) {
        sessionStorage.setItem("SuiteInsKey", key);
    };
    var _setSuiteCheckedInInsKey = function(key) {
        sessionStorage.setItem("SuiteCheckedInInsKey", key);
    };
    var _setSuiteStartTime = function(time) {
        sessionStorage.setItem("SuiteStratTime", time);
    };
    var _getSuiteInsKey = function() {
        return sessionStorage.getItem("SuiteInsKey");
    };
    var _getSuiteCheckedInInsKey = function() {
        return sessionStorage.getItem("SuiteCheckedInInsKey");
    };
    var _getSuiteStartTime = function() {
        return sessionStorage.getItem("SuiteStratTime");
    };

    var _getDocStateCaptureFlag = function() {
        return sessionStorage.getItem("DocStateCaptureFlag");
    };
    var _setDocStateCaptureFlag = function(flag) {
        sessionStorage.setItem("DocStateCaptureFlag", flag);
    };
    var _removeDocStateCaptureFlag = function() {
        return sessionStorage.removeItem("DocStateCaptureFlag");
    };

    var _getExecutorStatus = function() {
        if(sessionStorage !== undefined || sessionStorage !== null)
            return sessionStorage.getItem("ExecutorStatus");
    };
    var _setExecutorMode = function(mode) {
        sessionStorage.setItem("ExecutorMode", mode);
    };
    var _getExecutorMode = function() {
        return sessionStorage.getItem("ExecutorMode");
    };
    var _setTestCaseRunnerMessage = function(messageData, isExecutor) {
        if (messageData) {
            try {
                var messageDataQ = _getTestCaseRunnerMessageHelper(isExecutor);
                messageDataQ.push(messageData);
                var messageDataQString = JSON.stringify(messageDataQ);
                sessionStorage.setItem(_getMessageKey(isExecutor), messageDataQString);
            } catch (e) {
                console.log("Exception while parsing TestCaseRunnerMessage!");
            }
        }
    };
    var _getTestCaseRunnerMessageHelper = function(isExecutor) {
        var messageDataQString = sessionStorage.getItem(_getMessageKey(isExecutor));
        var messageDataQ = [];
        if (messageDataQString) {
            messageDataQ = JSON.parse(messageDataQString);
        }
        return messageDataQ;
    };
    var _getMessageKey = function(isExecutor) {
        return isExecutor ? "TestCaseExecutorMessage" : "TestCaseRunnerMessage";
    };
    var _getTestCaseRunnerMessage = function(isExecutor) {
        var messageDataQ = _getTestCaseRunnerMessageHelper(isExecutor);
        var returnmessage = messageDataQ.shift();
        var messageDataQString = JSON.stringify(messageDataQ);
        sessionStorage.setItem(_getMessageKey(isExecutor), messageDataQString);
        return returnmessage;
    };
    var _removeTestCaseRunnerMessage = function(isExecutor) {
        sessionStorage.removeItem(_getMessageKey(isExecutor));
    };
    var _setAutomationJobId = function(jobid) {
        sessionStorage.setItem("AutomationJobId", jobid);
    };
    var _getAutomationJobId = function() {
        return sessionStorage.getItem("AutomationJobId");
    };
    var _removeAutomationJobId = function() {
        sessionStorage.removeItem("AutomationJobId");
    };

    var _setTestCaseDynamicValueInLocalStore = function(dynamicdata) {
        if (sessionStorage) {
            sessionStorage.setItem("TestCase-dynamicvalues", JSON.stringify(dynamicdata));
            return true;
        }
        return false;
    };

    var _getTestCaseDynamicValueFromLocalStore = function() {
        if (sessionStorage) {
            var testData = sessionStorage.getItem("TestCase-dynamicvalues");
            testData = JSON.parse(testData);
            return testData;
        }
        return null;
    };

    var _removeTestCaseDynamicValueFromLocalStore = function() {
        sessionStorage.setItem("TestCase-dynamicvalues", null);
    };
    var _setTestRunSlowMode = function(millSec) {
        sessionStorage.setItem("TestCaseSlowMode", millSec);
    };
    var _getTestRunSlowMode = function() {
        return sessionStorage.getItem("TestCaseSlowMode");
    };
    var _removeTestRunSlowMode = function() {
        sessionStorage.removeItem("TestCaseSlowMode");
    };
  
    var _setIsRerunEnabeledForTestCases = function(isRerunEnabled){
        sessionStorage.setItem("TestCasesRerunEnabled",isRerunEnabled);
    };
    var _getIsRerunEnabeledForTestCases = function(){
        return sessionStorage.getItem("TestCasesRerunEnabled");
    };
    var _setTestCasesRerunCount = function(rerunCount){
         sessionStorage.setItem("TestCasesRerunCount",rerunCount);
    };
    var _getTestCasesRerunCount = function(){
        return sessionStorage.getItem("TestCasesRerunCount");
    };
    
    var _removeTestCasesRerunStatus = function(){
      sessionStorage.removeItem("TestCasesRerunEnabled");
    };
    
    var _removeTestCasesRerunCount = function(){
      sessionStorage.removeItem("TestCasesRerunCount");
    };
    
    var _addFailedTestCaseForRerun = function(failedTestCase){
      if(sessionStorage){
        var rerunTestCaseList = JSON.parse(sessionStorage.getItem("RerunTestCaseList"));
        if(!rerunTestCaseList){
          rerunTestCaseList = {"pxResults" : []};
        }
        rerunTestCaseList["pxResults"].push(failedTestCase);
        sessionStorage.setItem("RerunTestCaseList",JSON.stringify(rerunTestCaseList));
      }
    };
    
    var _getRerunTestCaseList = function(){
      return JSON.parse(sessionStorage.getItem("RerunTestCaseList"));
    };
    
    var _reSetTestCaseRerunList = function(){
      sessionStorage.removeItem("RerunTestCaseList");
    };
    
    var _getRerunInProgress = function(){
      return JSON.parse(sessionStorage.getItem("RerunInProgress"));
    };
    
    var _setRerunInProgress = function(isRerunInProgress){
      sessionStorage.setItem("RerunInProgress",isRerunInProgress);
    };
    
    var _removeRerunInProgress = function(){
      sessionStorage.removeItem("RerunInProgress");
    };
    
    var _cleanRerunVariables = function(){
      // for every fresh run from landing page/rest service reset rerun properties
     _removeTestCasesRerunStatus();
     _removeTestCasesRerunCount();
     _reSetTestCaseRerunList();
     _removeRerunInProgress();
     _removeCurrentTestCaseForRerun();
    };
  
   var _setCurrentTestCaseForRerun = function(failedTestCase){
      sessionStorage.setItem("CurrentTestCaseForRerun",JSON.stringify(failedTestCase) );
   };
  
   var _getCurrentTestCaseForRerun = function(){
     return JSON.parse(sessionStorage.getItem("CurrentTestCaseForRerun"));
   };
   
  var _removeCurrentTestCaseForRerun = function(){
    sessionStorage.removeItem("CurrentTestCaseForRerun");
  };
    
    return {
        getTestCaseFromLocalStore: _getTestCaseFromLocalStore,
        putTestCaseInLocalStore: _putTestCaseInLocalStore,
        removeTestCaseFromLocalStore: _removeTestCaseFromLocalStore,
        removeAllTestCasesFromLocalStore: _removeAllTestCasesFromLocalStore,
        getNextTestCaseFromLocalStore: _getNextTestCaseFromLocalStore,
        putTestCasesListInLocalStore: _putTestCasesListInLocalStore,
        removeTestCasesListFromLocalStore: _removeTestCasesListFromLocalStore,
        setCurrentTestCase: _setCurrentTestCase,
        setCurrentStepIndex: _setCurrentStepIndex,
        updateTestCaseStepData: _updateTestCaseStepData,
        getCurrentTestCase: _getCurrentTestCase,
        updateCurrentTestCaseStep: _updateCurrentTestCaseStep,
        getCurrentStepIndex: _getCurrentStepIndex,
        removeCurrentTestCaseAndStep: _removeCurrentTestCaseAndStep,
        setTestCaseResult: _setTestCaseResult,
        getTestCaseResult: _getTestCaseResult,
        getTestCaseStepResult: _getTestCaseStepResult,
        removeTestCaseResult: _removeTestCaseResult,
        setTestCaseMeta: _setTestCaseMeta,
        getTestCaseMeta: _getTestCaseMeta,
        removeTestCaseMeta: _removeTestCaseMeta,
        setTestCaseStepMeta: _setTestCaseStepMeta,
        getAllTestCaseStepsMeta: _getAllTestCaseStepsMeta,
        getTestCaseStepMeta: _getTestCaseStepMeta,
        resetTestCaseStepMeta: _resetTestCaseStepMeta,
        setExecutorStatus: _setExecutorStatus,
        getExecutorStatus: _getExecutorStatus,
        setExecutorMode: _setExecutorMode,
        setSuiteInsKey: _setSuiteInsKey,
        getSuiteInsKey: _getSuiteInsKey,
        setSuiteCheckedInInsKey: _setSuiteCheckedInInsKey,
        getSuiteCheckedInInsKey: _getSuiteCheckedInInsKey,
        setSuiteStartTime: _setSuiteStartTime,
        getSuiteStartTime: _getSuiteStartTime,
        putTestSuiteInLocalStore: _putTestSuiteInLocalStore,
        getDocStateCaptureFlag: _getDocStateCaptureFlag,
        setDocStateCaptureFlag: _setDocStateCaptureFlag,
        removeDocStateCaptureFlag: _removeDocStateCaptureFlag,
        getExecutorMode: _getExecutorMode,
        setRecoderStepIndex: _setRecoderStepIndex,
        getRecoderStepIndex: _getRecoderStepIndex,
        removeRecoderStepIndex: _removeRecoderStepIndex,
        setTestCaseRunnerMessage: _setTestCaseRunnerMessage,
        getTestCaseRunnerMessage: _getTestCaseRunnerMessage,
        removeTestCaseRunnerMessage: _removeTestCaseRunnerMessage,
        setAutomationJobId: _setAutomationJobId,
        getAutomationJobId: _getAutomationJobId,
        removeAutomationJobId: _removeAutomationJobId,
        getTestCaseDynamicValueFromLocalStore: _getTestCaseDynamicValueFromLocalStore,
        setTestCaseDynamicValueInLocalStore: _setTestCaseDynamicValueInLocalStore,
        removeTestCaseDynamicValueFromLocalStore: _removeTestCaseDynamicValueFromLocalStore,
        setTestRunSlowMode: _setTestRunSlowMode,
        getTestRunSlowMode: _getTestRunSlowMode,
        removeTestRunSlowMode: _removeTestRunSlowMode,
        setLastRunStepIndex: _setLastRunStepIndex,
        getLastRunStepIndex: _getLastRunStepIndex,
        setEditStepIndex: _setEditStepIndex,
        getEditStepIndex: _getEditStepIndex,
        removeTestCaseEditData: _removeTestCaseEditData,
        setIsRerunEnabeledForTestCases:_setIsRerunEnabeledForTestCases,
        getIsRerunEnabeledForTestCases:_getIsRerunEnabeledForTestCases,
        setTestCasesRerunCount:_setTestCasesRerunCount,
        getTestCasesRerunCount:_getTestCasesRerunCount,
        removeTestCasesRerunStatus:_removeTestCasesRerunStatus,
        removeTestCasesRerunCount:_removeTestCasesRerunCount,
        reSetTestCaseRerunList:_reSetTestCaseRerunList,
        addFailedTestCaseForRerun:_addFailedTestCaseForRerun,
        getRerunTestCaseList:_getRerunTestCaseList,
        getRerunInProgress:_getRerunInProgress,
        setRerunInProgress:_setRerunInProgress,
        removeRerunInProgress:_removeRerunInProgress,
        cleanRerunVariables:_cleanRerunVariables,
        setCurrentTestCaseForRerun:_setCurrentTestCaseForRerun,
        getCurrentTestCaseForRerun:_getCurrentTestCaseForRerun,
        removeCurrentTestCaseForRerun:_removeCurrentTestCaseForRerun
        
      
    };
})();
//static-content-hash-trigger-YUI
/*
	Automation sequencer is responsible to sequence the steps of current testcase.
 */
pega.ui.automation.sequencer = (function() {
	var _testData = null;
	var _getNextStep = function(){
		var step = null;
		var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
		
		_testData = pega.ui.automation.storeManager.getTestCaseFromLocalStore(testCaseId);	

		if(_testData != null){
			var steps = _testData[pega.ui.automation.constants.TEST_CASE_STEPS];
			if(steps && steps instanceof Array){
				var stepIndex = pega.ui.automation.storeManager.getCurrentStepIndex();
				if(!isNaN(parseInt(stepIndex)) && stepIndex < steps.length){ // make sure the step is present
					step = steps[stepIndex];
					stepIndex++;
					//increment the current step index
					pega.ui.automation.storeManager.setCurrentStepIndex(stepIndex);
				}
			}
		}
		return step;
	};
	var _getStepAtIndex = function(stepIndex){
		var step = null;
		var testCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
		if(_testData == null && testCaseId != null){
			_testData = pega.ui.automation.storeManager.getTestCaseFromLocalStore(testCaseId);	
		}
		if(_testData != null){
			var steps = _testData[pega.ui.automation.constants.TEST_CASE_STEPS];
			if(steps && steps instanceof Array){
				if(!isNaN(parseInt(stepIndex)) && stepIndex < steps.length){ // make sure the step is present
					step = steps[stepIndex];
				}
			}
		}
		return step;
	};
	return {
		getNextStep : _getNextStep,
		getStepAtIndex : _getStepAtIndex
	};
})();
//static-content-hash-trigger-YUI
/*
    ResultsPublisher is responsible to publish the test results single/bulk
 */
pega.ui.automation.resultsPublisher = (function() {
    var _uploadResult = function(data) {
        var resultData = pega.ui.automation.storeManager.getTestCaseResult();
        resultData.pyActualElapsedTime = performance.now() - resultData.startTime;
        var jobid = pega.ui.automation.storeManager.getAutomationJobId(jobid);
        if(jobid){
            resultData.pyJobID = jobid;
        }
        var runmode = pega.ui.automation.storeManager.getExecutorMode();
        if(runmode == "hybrid"){
           resultData.pyTestRunType = "remote";
        }else{
           resultData.pyTestRunType = "local";
        }
         
        if( runmode != "single" && runmode != "debug" && runmode!= "edit" &&
           pega.ui.automation.storeManager.getRerunInProgress()== true){
        resultData.pyIsRerunResult = "true";
        }
        delete resultData["startTime"];
        var strUrlSF = new SafeURL("Data-TestCaseResults-Functional.pzSetTestCaseResult");
        strUrlSF.put("testCaseName", data.testCaseId);
        strUrlSF.put("testCaseClass", resultData.pyClassName);
                
        var SuiteKeyRetrieved = pega.ui.automation.storeManager.getSuiteInsKey();
        var SuiteCheckedInInsKeyRetrieved = pega.ui.automation.storeManager.getSuiteCheckedInInsKey();
        if(SuiteKeyRetrieved && SuiteKeyRetrieved != ''){
          var SuiteTimeRetrieved = pega.ui.automation.storeManager.getSuiteStartTime();
          console.log("From pzPega_ui_automation_resultsPublisher  : " + SuiteKeyRetrieved + " and time is " + SuiteTimeRetrieved );
          strUrlSF.put("testSuiteInsKey", SuiteKeyRetrieved);
          if(SuiteCheckedInInsKeyRetrieved){
            strUrlSF.put("testSuiteCheckedInInsKey", SuiteCheckedInInsKeyRetrieved);
          }          
          strUrlSF.put("testSuiteRunStartTime", SuiteTimeRetrieved);
          
          console.log("Sending test suite result keys to actiivty pzSetTestCaseResult  : " + SuiteKeyRetrieved + " and checked in inskey is " + SuiteCheckedInInsKeyRetrieved + " and time is " + SuiteTimeRetrieved );
        }
       
      
        var postData = new SafeURL();
        postData.put("testCaseResult", JSON.stringify(resultData));
        var callback = {
            success: function(response) {
                var resp = response.responseText;
                if (resp.indexOf("true") == -1) {
                    console.error("Test Result upload returned failed!");
                }
                pega.ui.EventsEmitter.publish("TestcaseWrapup", data.testCaseId);
                if (runmode == "hybrid") {
                    pega.ui.automation.executor.messenger.setRunnerMessage("TestcaseWrapup",[data.testCaseId]);
                    pega.ui.automation.executor.runNextTestCase();
                }
            },
            failure: function(response) {
                pega.ui.EventsEmitter.publish("TestcaseWrapup", data.testCaseId);
                if (runmode == "hybrid") {
                    pega.ui.automation.executor.messenger.setRunnerMessage("TestcaseWrapup",[data.testCaseId]);
                    pega.ui.automation.executor.runNextTestCase();
                }
            }
        };
        pega.u.d.ServerProxy.doAction(strUrlSF, postData, {
            online: function() {
                pega.u.d.asyncRequest("POST", strUrlSF, callback, postData);
            },
            offline: function() {
                // Do nothing.
            }
        });
    };
    var _publishResult = function(data) {
        if (data.mode != "debug") {
            //Upload result to server
            _uploadResult(data);
        }
        //Set right panel pass msg
        var resultData = pega.ui.automation.storeManager.getTestCaseResult();
        top.pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyLastRunStatus", resultData.pyTestCaseRunResult);
        top.pega.u.d.setProperty("pxRequestor.pxAutomationRecorder.pyTestRunStatus", "Finished");
    };
    var _publishStepResult = function(stepResult) {
        pega.ui.EventsEmitter.publish("StepResult", stepResult);
    };
    var _publishAllResults = function() {
        // To be done in next sprints for bulk mode
    };
    var _publishResultWithScreenshots = function(data){
        var tcmeta = {};
        tcmeta.testCaseId = data.testCaseId;
        var screenshots = data.screenshots;
        if(screenshots){
            var resultData = pega.ui.automation.storeManager.getTestCaseResult();
            for(var i in screenshots){
                if(!isNaN(i)){
                    resultData.pyTestCaseSteps[i].pyStepFailureScreenshot = screenshots[i];
                }
            }
            pega.ui.automation.storeManager.setTestCaseResult(resultData);
        }
        _uploadResult(tcmeta);
    };
    var _updateCurrentStep = function() {
        var stepInd = pega.ui.automation.storeManager.getCurrentStepIndex();
        stepInd--;
        var stepMetaData = pega.ui.automation.storeManager.getTestCaseStepMeta(stepInd) || {};
        stepMetaData["isUpdated"] = true;
        pega.ui.automation.storeManager.setTestCaseStepMeta(stepInd, stepMetaData);

        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pxGetUpdatedTestCaseStepData");

        var callback = {
            success: function(data) {
                if(data && data.responseText) {
                    try {
                        var updatedStepData = JSON.parse(data.responseText);
                        var currenstTestCaseId = pega.ui.automation.storeManager.getCurrentTestCase();
                        //Updating in session storage
                        pega.ui.automation.storeManager.updateTestCaseStepData(currenstTestCaseId, stepInd, updatedStepData);
                    }catch(e) {
                        console.error("Invalid step json: ", e);
                    }
                    
                }
                
            },
            failure: function(data) {
                //console.log("Data: ", data);
            }
        }
        strUrlSF.put("stepInd", stepInd+1);

        pega.util.Connect.asyncRequest("POST", strUrlSF.toURL(), callback);
    };
    var _populateStepMetaData = function(e) {
        var stepInd = _getStepIndex(e.target);
        console.log("stepInd: " + stepInd);
        var stepMetaData = pega.ui.automation.storeManager.getTestCaseStepMeta(stepInd-1);
        var assertionOptions = stepMetaData && stepMetaData["assertionOptions"];
        console.log("assertionOptions: " + assertionOptions);

        if (!assertionOptions || assertionOptions.length == 0) {
            return;
        }
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pxUpdateTestStepAssertionOptions");

        var callback = {
            success: function(data) {
                console.log("Assertion options updated");
            },
            failure: function(data) {
                //console.log("Data: ", data);
            }
        }
        strUrlSF.put("attributes", JSON.stringify(assertionOptions));
        strUrlSF.put("stepInd", stepInd);

        pega.util.Connect.asyncRequest("POST", strUrlSF.toURL(), callback);
    };
    var _getStepIndex = function(element) {
        var curElement = element;
        var baseRef = null;
        var indexRef = -1;
        var stepInd = -1;
        var matchingRef = "pxRequestor.pxAutomationRecorder.pyTestCaseSteps(";
        while (curElement != null && curElement != document.body) {
            baseRef = curElement.getAttribute("base_ref");
            if (baseRef) {
                indexRef = baseRef.indexOf(matchingRef);
            }
            if (indexRef == 0) {
                stepInd = baseRef.substring(matchingRef.length, baseRef.indexOf(")", matchingRef.length));
                break;
            }
            curElement = curElement.parentElement;
        }
        return stepInd;
    };

    var _setResultsLayoverZIndex = function(zIndex) {
        var overlay = ($(".stepResultsContent").closest("div.overlayPO"))[0];
        if(overlay){
            overlay.style.zIndex = zIndex;
        }
    };

    var _populateStepFailures = function(e) {
        var stepInd = _getStepIndex(e.target);
        var stepDescriptionDiv = $(".stepResultDescription .content-item")[0];
        stepInd--;
        var stepResult = pega.ui.automation.storeManager.getTestCaseStepResult(stepInd);
        var failureList = "<ul>"
        if (stepResult) {
            var assertionResult = stepResult.pyAssertionResults;

            if (assertionResult) {
                for (var i = 0; i < assertionResult.length; i++) {
                    var assertion = assertionResult[i];
                    if (assertion.pyStatus == "Failed") {
                        failureList += "<li style='color:red;'>" + assertion.pyFailureReason + "</li>";
                    }
                }
            }

            var navigationResult = stepResult.pyNavigationResult;
            if (navigationResult) {
                if (navigationResult.pyStatus == "Failed") {
                    failureList += "<li style='color:red;'>" + navigationResult.pyFailureReason + "</li>";
                }
            }
            failureList += "</ul>";
            
            var failureDiv = document.createElement("div");
            failureDiv.innerHTML = failureList;
            stepDescriptionDiv && stepDescriptionDiv.appendChild(failureDiv);
        }
        _setResultsLayoverZIndex("1000000");
    };
    return {
        publishResult: _publishResult,
        publishStepResult: _publishStepResult,
        publishAllResults: _publishAllResults,
        publishResultWithScreenshots: _publishResultWithScreenshots,
        populateStepMetaData: _populateStepMetaData,
        populateStepFailures: _populateStepFailures,
        updateCurrentStep: _updateCurrentStep
    };
})();
//static-content-hash-trigger-YUI
/**
 * Description : A self invoking function which creates public API's on pega.ui.automation.stateManager to 
 * subscribe to and handle the doc state tracker status changes.
 * @return {object}   Public API's to handle the doc state changes.
 */
pega.ui.automation.stateManager = (function() {
    var _clientIdleCallback = null;

    /**
     * [_isClientIdle]
     * Description : Checks if the document state tracker busy status is none.
     * @returns   {boolean}     true if the doc state tracker is idle, else false
     */
    var _isClientIdle = function(){
        var stateTrackerElement = pega.ui.statetracking.getDocumentStateTracker();
        if(stateTrackerElement && stateTrackerElement.getAttribute("data-state-busy-status") === "none"){
            return true;
        }
        return false;
    }

    /**
     * [_queueOrFireClientIdleCallback]
     * Description : Queues or fires the client idle callback.
     * @param  {Function} callback 
     */
    var _queueOrFireClientIdleCallback = function(callback){
          //If the callback is not sent return
          if (!callback || typeof callback != "function") {
            return;
          }
          //If the callback is sent. Fire it only when the document-statetracker is idle.
          if(_isClientIdle()){
              //Setting this null, so that when document-statetracker becomes idle again, 
              //it should not refire the same callback.
              _clientIdleCallback = null;
              //callback should be called only after remining code flow is done.
              setTimeout(function(){
                        callback();
                    },10);
          }else{
              //If the document-statetracker is busy queue the callback to fire it later when it state becomes idle.
              _clientIdleCallback = callback;
          }
     }
    /**
     * [_fireClientIdleCallback]
     * Description : If a scenario test is under execution, calls the callback registered for the doc state tracker idle status.
     */
    var _fireClientIdleCallback = function() {
        //No callback registered,return.
        if (!_clientIdleCallback) {
            return;
        }
        var executorStatus = pega.ui.automation.storeManager.getExecutorStatus();
        //If a test is under execution, then fire the callback.
        if (executorStatus === "busy") {
            console.log("Firing the client idle callback.");
            _clientIdleCallback();
            _clientIdleCallback = null;
        }
    };

    /**
     * [_subscribeToClientIdle]
     * Description : Subscribes to the "clientIdle" event.
     */
    var _subscribeToClientIdle = function() {
        pega.ui.EventsEmitter.unsubscribe(pega.ui.statetracking.IDLE_EVENT, _fireClientIdleCallback);
        pega.ui.EventsEmitter.subscribe(pega.ui.statetracking.IDLE_EVENT, _fireClientIdleCallback);
    };
    //Revealing the functions to be exposed on pega.ui.automation.stateManager.
    return {
        queueOrFireClientIdleCallback : _queueOrFireClientIdleCallback,
        subscribeToClientIdle: _subscribeToClientIdle,
        fireClientIdleCallback: _fireClientIdleCallback
    };
})();
pega.u.d.attachOnload(pega.ui.automation.stateManager.subscribeToClientIdle);
//static-content-hash-trigger-YUI
(function() {
    /**
     * Texarea Stepbuilder
     */
    var textAreaStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitNavigations: {
            value: null
        }
    });
    textAreaStepbuilder.getTargetElement = function(cellElement) {
        console.log("Invoking simple text area stepbuilder");
        return cellElement.querySelector("textarea");

    }

    /**
     * Update component specific data for TextInput
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    textAreaStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
        var _constants = pega.ui.automation.constants;
        var UILabel = inspectableElement && (inspectableElement.innerText).trim();
        if (!UILabel) {
            UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        }
        var UIType = " (Text)";
        var enteredText = "";
        var action = "Verify ";
        if (actionName == "change") {
            action = "Enter ";
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }
        if (actionName === "change" /*|| (actionName === "click" && isImplicitSave)*/) {
            enteredText = this.getElementValue(inspectableElement);
            if (enteredText.length > 20) {
                enteredText = enteredText.substring(0, 20) + "..."
            }
        }
        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel;
        }
        testStep = testStep + UIType;
        if (enteredText) {
            testStep = testStep + " : " + enteredText;
        }
        componentdata[_constants.TEST_STEP_NAME] = testStep;
    }

    /**
     * Texarea Translator
     */
    var textAreaTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    textAreaTranslator.buildConfigs = function() {

        var _constants = pega.ui.automation.constants;
        var configs = [];
        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Property";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Placeholder";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.PLACEHOLDER;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Label";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Tooltip";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Required";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.REQUIRED;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);
        return configs;
    }


    var textAreaComponent = {
        type: "pxTextArea",
        handlers: {
            stepbuilder: textAreaStepbuilder,
            translator: textAreaTranslator
        }
    };
    pega.ui.automation.manager.registerComponent(textAreaComponent);
})();
//static-content-hash-trigger-YUI
(function() {
    var checkboxStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitNavigations: {
            value: null
        }
    });
    checkboxStepbuilder.getTargetElement = function(domElement) {
        console.log("Invoking checkbox stepbuilder");
        return domElement.querySelector("input[type='checkbox']");
    }
    checkboxStepbuilder.getElementValue = function(targetElem) {
        return targetElem.checked;
    }
    checkboxStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName) {
        var UILabel = "";
        var labelElem = inspectableElement.parentElement.querySelector("label");
        if (labelElem != null) {
            var innerText = (labelElem.innerText).trim();
            if (innerText) {
                UILabel = innerText;
            }
        }
        var UIType = " (Checkbox)";
        var action = "Verify ";
        var state = "";
        try {
            if (actionName === "change") {
                var checked = inspectableElement.querySelector("input[type='checkbox']").checked;
                action = "Set ";
                if (checked) {
                    state = "Checked ";
                } else {
                    state = "Unchecked ";
                }
            } else if (actionName === "dblclick") {
                action = "DoubleClick ";
            } else if (actionName === "contextmenu") {
                action = "RightClick ";
            }
        } catch (e) {

        }
        var testStep = action + UILabel + UIType;
        if (state) {
            testStep = testStep + " : " + state;
        }
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }


    var checkboxTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    checkboxTranslator.buildConfigs = function(checkboxElement) {

        var _constants = pega.ui.automation.constants;
        var configs = [];
        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Property";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Tooltip";
        config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "@title";
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Checkbox Caption";
        config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "label" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ":contains";
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);
        return configs;
    }

    var checkboxNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    checkboxNavigator.doAction = function(actionElem, actionName, actionValue, actionCallback) {
        console.log("Invoking checkbox component action");

        if (actionName == "click") {
            actionCallback();
        } else {
            pega.ui.automation.navigator.defaultComponent.doAction(actionElem, actionName, actionValue, actionCallback);
        }
    }

    var checkboxComponent = {
        type: "pxCheckbox",
        handlers: {
            stepbuilder: checkboxStepbuilder,
            translator: checkboxTranslator,
            navigator: checkboxNavigator
        }
    };
    pega.ui.automation.manager.registerComponent(checkboxComponent);
})();
//static-content-hash-trigger-YUI
(function() {
    /**
     * Overlay and modal dialog buttons
     */
    var modalButtonStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.buttonStepbuilder);
    modalButtonStepbuilder.customSelectorAttributes = ['class'];

    var modalButton = {
        type: "pzModalButton",
        events: 'onclick',
        handlers: {
            stepbuilder: modalButtonStepbuilder
        }
    };
    pega.ui.automation.manager.registerComponent(modalButton);

    var gridmodalButton = {
        type: "pxGridEditModalSubmit",
        handlers: {
            stepbuilder: modalButtonStepbuilder
        }
    };
    pega.ui.automation.manager.registerComponent(gridmodalButton);

    var overlayButton = {
        type: "pzOverlayButton",
        events: 'onclick',
        handlers: {
            stepbuilder: modalButtonStepbuilder
        }
    };
    pega.ui.automation.manager.registerComponent(overlayButton);
})();
(function() {
    /**
     * pxAutoComplete
     */
    var autocompleteStepBuilder = Object.create(pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder);

    var autocompleteNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);
    var autocompleteTranslator = Object.create(pega.ui.automation.recorder.translator.inputTextTranslator);

    autocompleteNavigator.doAction = function(actionElem, actionName, actionValue, actionCallback) {
        if (window !== actionElem.ownerDocument.defaultView) {
          try{
            actionElem.ownerDocument.defaultView.pega.ui.automation.manager.getNavigator("pxAutoComplete").doAction(actionElem, actionName, actionValue, actionCallback);
            return;
          }catch(e){}
        }
        var status = true;
        if (actionValue) {
            actionElem.value = actionValue;
        }

        var _selectAutocompleteData = function() {
            var element = document.querySelector('.match-highlight') || document.querySelector('.match');
            if (!element) {
               // autocomplete results display mode as table
                element = document.querySelector(".autocompleteAG.lookupPO #PEGA_GRID_CONTENT [data-gargs]");
                if(element){
                  element = element.querySelector(".gridCell");
                }
              
            }
            if (!element) {
              // autocomplete results display mode as list
              var autoResultsAsList = document.querySelector(".autocompleteAG.lookupPO .autocomplete-main #acresults_list");
              if (autoResultsAsList) {
                element = autoResultsAsList.querySelector(".ac-primary-option:not(.ac-freeform-option)");
                
              }
            }
          element.click();
        };
        var _afterAutocompleteSet = function() {
            // No need to trigger change event and click on results will automatically trigger change
            //pega.ui.automation.navigator.defaultComponent.doAction(actionElem, actionName, actionValue, actionCallback);
            actionCallback();
        };
        if (actionName == "change") {
            pega.ui.EventsEmitter.subscribeOnce("AutoCompleteResultsOpen", _selectAutocompleteData);
            pega.ui.EventsEmitter.subscribeOnce("AutoCompleteResultsClose", _afterAutocompleteSet);

            var eventObject = {
                keyCode: 40,
                target: actionElem,
                srcElement: actionElem,
                type: "keyup"
            };
            actionElem.focus();
            pega.c.eventController.handler(eventObject);
        } else {
            pega.ui.automation.navigator.defaultComponent.doAction(actionElem, actionName, actionValue, actionCallback);
        }
    }

    var autocomplete = {
        type: "pxAutoComplete",
        handlers: {
            stepbuilder: autocompleteStepBuilder,
            navigator: autocompleteNavigator,
            translator: autocompleteTranslator
        }
    };
    pega.ui.automation.manager.registerComponent(autocomplete);
})();
//static-content-hash-trigger-YUI
(function() {
    var dateTimeStepbuilder = Object.create(pega.ui.automation.manager.getStepbuilder("pxTextInput"), {
        implicitAssertions: {
            value: ["Value"]
        },
        implicitNavigations: {
            value: null
        }
    });
    /**
     * Update component specific data for TextInput
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    dateTimeStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName) {
        var _constants = pega.ui.automation.constants;
        var enteredText = "";
        var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        var UIType = " (DateTime)";
        var action = "Verify ";
        if (actionName === "change") {
            action = "Enter ";
            enteredText = inspectableElement.value;
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }

        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel;
        }
        testStep = testStep + UIType;
        if (enteredText) {
            testStep = testStep + " : " + enteredText;
        }
        componentdata[_constants.TEST_STEP_NAME] = testStep;
    }
    
    dateTimeStepbuilder.validateComponentCurrentStep = function(previousStepMetaData, currentStepObj, currentSelectedElement) {
        var valid = { "isValid": true };

        var previousStepObj = previousStepMetaData["data"];

        if (this.hasSameSelector(previousStepObj, currentStepObj)) {
            var dateTimeDropDown = currentSelectedElement.querySelector("select");
            if (dateTimeDropDown) {
                valid["updateActions"] = true;
            } else if (this.hasSameAssertions(previousStepMetaData, currentStepObj, currentSelectedElement)){
                var prevStepType = previousStepMetaData["stepType"];
                if (prevStepType != _constants.STEP_TYPE.CHANGE) {
                    console.log("*** Updating action in previous step ****");
                    valid["updateActions"] = true;
                }
            }
            
        }
        return valid;
    }


    /**
     * Datetime Translator
     */
    var dateTimeTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    dateTimeTranslator.buildConfigs = function(targetElement) {
        var _constants = pega.ui.automation.constants;
        var configs = [];
        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Property";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Tooltip";
        var dropdownDate = targetElement.parentElement.querySelector("select");
        if (dropdownDate) {
            var selectElemToolTip = dropdownDate.getAttribute("title");
            if (selectElemToolTip) {
                config[_constants.ATTRIBUTE_VALUE] = selectElemToolTip.split(":")[0];
            }
        } else {
            config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE
        }
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Label";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Placeholder";
        if (targetElement.type == "hidden" && targetElement.value == "") {
            var placeHolderSpan = targetElement.parentElement.querySelector("span.placeholder");
            if (placeHolderSpan) {
                config[_constants.ATTRIBUTE_VALUE] = placeHolderSpan.innerText;
            }
        } else {
            config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.PLACEHOLDER;
        }
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Required";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.REQUIRED;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);
        return configs;
    }

    var dateTimeNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    dateTimeNavigator.doAction = function(actionElem, actionName, actionValue, actionCallback) {
        console.log("Invoking dateTime component action");

        //bugfix: use setProperty instead of firing event for input elements, this internally handles all type of controls.
        if (actionName == "change") {
            if (actionElem.type == "hidden") {
                var dropdownDate = actionElem.parentElement.querySelector("select");
                //Datetime as dropdown
                if (dropdownDate) {
                    var dateTime = actionValue.split(" ");
                    if (dateTime.length == 3) {
                        var date = dateTime[0].split("/");
                        var month = date[0];
                        var day = date[1];
                        var year = date[2];

                        var time = dateTime[1].split(":");
                        var hour = time[0];
                        var minute = time[1];

                        var amOrpm = dateTime[2];
                    } else if (dateTime.length == 2) {
                        var time = dateTime[0].split(":");
                        var hour = time[0];
                        var minute = time[1];

                        var amOrpm = dateTime[1];
                    } else if (dateTime.length == 1) {
                        var date = dateTime[0].split("/");
                        var month = date[0];
                        var day = date[1];
                        var year = date[2];
                    }
                    var propertyName = actionElem.name;
                    if (month != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "MoSel" + "']").value = month;
                    }
                    if (day != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "DySel" + "']").value = day;
                    }
                    if (year != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "YrSel" + "']").value = year;
                    }
                    if (hour != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "HrSel" + "']").value = hour;
                    }
                    if (minute != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "MiSel" + "']").value = parseInt(minute);
                    }
                    if (amOrpm != undefined) {
                        actionElem.parentElement.querySelector("[id='" + propertyName + "ApSel" + "']").value = amOrpm;
                    }
                }
                var inputCalendarReadonlySpan = actionElem.parentElement.querySelector(".inactvDtTmTxt");
                //Datetime as input calendar and no typing
                if (inputCalendarReadonlySpan) {
                    inputCalendarReadonlySpan.innerText = actionValue;
                }
            }

        }
      
        pega.ui.automation.navigator.defaultComponent.doAction(actionElem, actionName, actionValue, actionCallback);
    }

    var dateTimeComponent = {
        type: "pxDateTime",
        handlers: {
            stepbuilder: dateTimeStepbuilder,
            translator: dateTimeTranslator,
            navigator: dateTimeNavigator
        }
    };
    pega.ui.automation.manager.registerComponent(dateTimeComponent);
})();
//static-content-hash-trigger-YUI
(function() {

    /**
     *Paragraph Step builder
     *
     **/


    var paragraphStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {

        implicitNavigations: {
            value: null
        },
        implicitAssertions: {
            value: ["Content"]
        }


    });
    paragraphStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
        //var paragraphText = pega.ui.automation.utils.getAttributeValue(inspectableElement.parentElement, ":contains");
        var _constants = pega.ui.automation.constants;
        var paragraph = pega.ui.automation.utils.getAttributeValue(inspectableElement.parentElement, ":contains");
        var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        var UIType = "(Paragraph)";
        var action = "Verify";
        var testStep = action;
        if(UILabel){
          testStep = testStep + " "+UILabel;
        }
        testStep = testStep + " "+UIType+" : "+paragraph;
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }
    paragraphStepbuilder.getTargetElement = function(cellElement) {
        console.log("Invoking Paragraph step builder ");
        return cellElement.querySelector("span");
    }

    /**
     *Paragraph Translator
     *
     **/

    var paragraphTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    paragraphTranslator.buildConfigs = function() {

        var _constants = pega.ui.automation.constants;
        var configs = [];
        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Content";
        config[_constants.ATTRIBUTE_NAME] = "." + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + "" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + ":contains";
        configs.push(config);

        return configs;
    }

    var paragraphComponent = {

        type: "Paragraph",
        handlers: {
            stepbuilder: paragraphStepbuilder,
            translator: paragraphTranslator
        }
    };

    pega.ui.automation.manager.registerComponent(paragraphComponent);


})();
//static-content-hash-trigger-YUI
(function() {

    /* Radio group utilities*/
    function getCount(targetElement) {
        var optionsCount = -1;
        var radioGroupElements = _getRadioElements(targetElement);
        if (radioGroupElements && radioGroupElements.length) {
            optionsCount = radioGroupElements.length;
            optionsCount = optionsCount.toString();
        }

        return optionsCount;
    }

    function getOptions(targetElement) {
        var optionsContains = [];
        var radioGroupElements = _getRadioElements(targetElement);
        if (radioGroupElements) {
            for (var i = 0; i < radioGroupElements.length; i++) {
                optionsContains.push(radioGroupElements[i].value);
            }
        }
        return optionsContains;
    }

    function _getRadioElements(targetElement) {
      return targetElement.type === "radio" ? [targetElement] : targetElement.querySelectorAll("input");
    }
  
    /* End of Radio group utilities*/


    /**
     * RadioGroup Stepbuilder
     */
    var radioGroupStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitNavigations: {
            value: null
        },
        implicitAssertions: {
            value: ["Value"]
        }
    });

    radioGroupStepbuilder.getTargetElement = function(cellElement) {
        return cellElement.querySelector(".radioTable") || cellElement.querySelector("[type='radio']");

    }

    radioGroupStepbuilder.getElementValue = function(targetElement) {
        return domUtils.getDOMElementValue(_getRadioElements(targetElement)[0]);
    }

    var getOptionLabel = function(targetElement) {
        var optionLabel = "";
        if (targetElement.type === "radio") {
          return;
        }
        var DOMElement = _getRadioElements(targetElement)[0];
        var inputElt = document.getElementsByName(DOMElement.name);
        for (var i = 0; i < inputElt.length; i++) {
            if (inputElt[i].checked) {
                var span = inputElt[i].closest("span");
                if (span) {
                    optionLabel = span.innerText;
                    break;
                }
            }
        }
        return optionLabel;
    }

    radioGroupStepbuilder.updateComponentSpecificData = function(componentdata, targetElement, actionName) {
        var UILabel = pega.ui.automation.utils.getAttributeValue(targetElement, pega.ui.automation.constants.ATTRIBUTE.LABEL);
        var UIType = " (Radiobutton)";
        var action = "Verify ";
        if (actionName === "change") {
            action = "Select ";
            var optionSelected = getOptionLabel(targetElement);
            if (optionSelected) {
              if (optionSelected.length > 20) {
                optionSelected = optionSelected.substring(0, 20) + "..."
              }
              UIType = UIType + " : " + optionSelected;
            }
        }
        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel;
        }
        testStep = testStep + UIType;
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }
    /**
     * RadioGroup Translator
     */
    var radioGroupTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    radioGroupTranslator.buildConfigs = function(targetElement) {
        var _constants = pega.ui.automation.constants;
        var configs = [];

        var optionsCount = getCount(targetElement);
        var optionsContains = getOptions(targetElement);

        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_VALUE] = domUtils.getDOMElementValue(_getRadioElements(targetElement)[0]);
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Label";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = "input" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Required";
        config[_constants.ATTRIBUTE_NAME] = "input" + _constants.ASSERTION_CUSTOM_NAME_SEPARATOR + _constants.ATTRIBUTE.REQUIRED;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Count";
        config[_constants.ATTRIBUTE_VALUE] = optionsCount;

        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Options";
        config[_constants.ATTRIBUTE_VALUE_LIST] = optionsContains;
        config[_constants.COMPARATOR_LIST] = ["Contains"];
        configs.push(config);
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);

        return configs;
    }

    /**
     * RadioGroup Translator
     */
    var radioGroupNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);
    radioGroupNavigator.doAction = function(targetElement, actionName, actionValue, actionCallback) {
        console.log("Invoking RadioGroup component action");
        //If the event is click, fire click on wrapper div
        if (actionName == "change") {
            //if event is change, fire change on input
            targetElement = _getRadioElements(targetElement)[0];
        }
        pega.ui.automation.navigator.defaultComponent.doAction(targetElement, actionName, actionValue, actionCallback);

    }

    var radioGroupComponent = {
        type: "pxRadioButtons",
        handlers: {
            stepbuilder: radioGroupStepbuilder,
            translator: radioGroupTranslator,
            navigator: radioGroupNavigator

        }
    };
    pega.ui.automation.manager.registerComponent(radioGroupComponent);

})();
//static-content-hash-trigger-YUI
(function() {
    /**
     * RichTextEditor Stepbuilder
     */
    var richTextEditorStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitNavigations: {
            value: null
        }
    });
    richTextEditorStepbuilder.getTargetElement = function(cellElement) {
        console.log("Invoking RTE stepbuilder");
        return cellElement.querySelector("textarea");

    }

    /**
     * Update component specific data for TextInput
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    richTextEditorStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName) {
        var _constants = pega.ui.automation.constants;
        var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        var UIType = " (Text)";
        var enteredText = "";
        var action = "Verify ";
        if (actionName === "change") {
            action = "Enter ";
            var RTEContentElem = $(this.getElementValue(inspectableElement))[0];
            if (RTEContentElem) {
                enteredText = RTEContentElem.innerText;
            }
            if (enteredText.length > 20) {
                enteredText = enteredText.substring(0, 20) + "..."
            }
        }
        var stepName = action;
        if (UILabel) {
            stepName = stepName + UILabel;
        }
        stepName = stepName + UIType;
        if (enteredText) {
            stepName = stepName + " : " + enteredText;
        }
        componentdata[_constants.TEST_STEP_NAME] = stepName;
    }


    /**
     * RichTextEditor Translator
     */
    var richTextEditorTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    richTextEditorTranslator.buildConfigs = function(targetElement) {

        var _constants = pega.ui.automation.constants;

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Property";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Placeholder";
        var dataConfig = JSON.parse(targetElement.getAttribute('data-config'));
        var placeHolder = dataConfig && dataConfig[1].placeholder;
        if (placeHolder) {
            config[_constants.ATTRIBUTE_VALUE] = placeHolder;
        }
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Label";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Required";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.REQUIRED;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);

        return configs;
    }
    var richTextEditorNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    richTextEditorNavigator.doAction = function(actionElem, actionName, actionValue, actionCallback) {
        var status = true;
        console.log("Invoking RTE Action");
        if (actionName == "change") {
            actionElem.value = actionValue;
            var ckEditorId = actionElem.id;
            var ckEditor = actionElem.ownerDocument.defaultView.CKEDITOR;
            ckEditor.instances[ckEditorId].setData(actionValue);
            ckEditor.instances[ckEditorId].updateElement();
        }

        if (!actionElem || !actionElem) {
            status = false;
        } else {
            if (window == actionElem.ownerDocument.defaultView) {
                pega.control.actionSequencer.fireTopPriorityEvent(actionElem, actionName);
            } else {
                actionElem.ownerDocument.defaultView.pega.control.actionSequencer.fireTopPriorityEvent(actionElem, actionName);
            }
        }
        //call actioncallback at the end which resolves all promises.
        actionCallback();
    }
    pega.ui.automation.manager.registerNavigator(pega.ui.automation.constants.COMPONENT.RICH_TEXT_EDITOR, richTextEditorNavigator);
    var richTextEditorComponent = {
        type: "pxRichTextEditor",
        handlers: {
            stepbuilder: richTextEditorStepbuilder,
            translator: richTextEditorTranslator,
            navigator: richTextEditorNavigator
        }
    };
    pega.ui.automation.manager.registerComponent(richTextEditorComponent);
})();
//static-content-hash-trigger-YUI
(function() {

    /*Dropdown utilities*/
    function getCount(targetElement) {
        var optionsCount = -1;
        if (targetElement && targetElement.length) {
            if (targetElement.options[0].value.length == 0) {
                optionsCount = targetElement.length - 1;
            } else {
                optionsCount = targetElement.length;
            }
            optionsCount = optionsCount.toString();
        }
        return optionsCount;
    }

    function getOptions(targetElement) {
        var optionsContains = [];
        if (targetElement && targetElement.options) {
            var eleOptions = targetElement.options;
            for (var i = 0; i < eleOptions.length; i++) {
                if (i == 0 && targetElement.options[i].value.length == 0) {
                    continue;
                }
                optionsContains.push(eleOptions[i].innerText);
            }
        }
        return optionsContains;
    }

    function getPlaceHolder(targetElement) {
        if (targetElement && targetElement.options && targetElement.options.length > 0) {
            if (targetElement.options[0].value.length == 0) {
                return targetElement.options[0].innerText;
            }
        }
        return "";
    }

    /* End of DropDown Utilities*/

    /**
     * DropDown Stepbuilder
     */

    var automationConstants = pega.ui.automation.constants;

    var dropDownRecorder = Object.create(pega.ui.automation.recorder.defaultComponent);
    dropDownRecorder.isSupportedStepRecord = function(e, cellElement) {
        if(e.type === 'mouseover' && e.target.tagName == "SELECT" && e.target.getAttribute("data-loadmode") == "OnDemand") {
            // allowing mouseover action to recorded on dropdown in its loadmode is onhover
            return true;
        }
    };

    var dropDownStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent);
    dropDownStepbuilder.getTargetElement = function(cellElement) {
        return cellElement.querySelector("select");
    };

    dropDownStepbuilder.implicitAssertions = ["Value"];
    dropDownStepbuilder.implicitNavigations = null;

    dropDownStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName) {
        var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, pega.ui.automation.constants.ATTRIBUTE.LABEL);
        if (!UILabel) {
            UILabel = inspectableElement.getAttribute("id");
        }
        var UIType = " (Dropdown)";
        var action = "Verify ";
        var optionSelected = "";
        if (actionName === "change") {
            action = "Select ";
            optionSelected = this.getElementValue(inspectableElement);
            var valueAttribute = "[value='"+optionSelected+"']"
            var optionElement = inspectableElement.querySelector(valueAttribute);
            if(optionElement && optionElement.innerText){
              optionSelected = optionElement.innerText;
            }
            if (optionSelected.length > 20) {
                optionSelected = optionSelected.substring(0, 20) + "..."
            }
        }
        var testStep = action + UILabel + UIType;
        if (optionSelected) {
            testStep = testStep + " : " + optionSelected;
        }
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }

    /**
     * DropDown Translator
     */
    var dropDownTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    dropDownTranslator.buildConfigs = function(targetElement) {
        var _constants = pega.ui.automation.constants;

        var optionsCount = getCount(targetElement);
        var optionsContains = getOptions(targetElement);
        var placeHolderText = getPlaceHolder(targetElement);

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.VALUE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Property";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.NAME;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Placeholder";
        config[_constants.ATTRIBUTE_VALUE] = placeHolderText;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Label";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.LABEL;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Tooltip";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;

        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Disabled";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.DISABLE;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Required";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.REQUIRED;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Count";
        config[_constants.ATTRIBUTE_VALUE] = optionsCount;

        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Options";
        config[_constants.ATTRIBUTE_VALUE_LIST] = optionsContains;
        config[_constants.COMPARATOR_LIST] = ["Contains"];
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "has error";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.ERROR;
        configs.push(config);

        return configs;
    }


    var dropDownComponent = {
        type: "pxDropdown",
        handlers: {
            recorder: dropDownRecorder,
            stepbuilder: dropDownStepbuilder,
            translator: dropDownTranslator
        }
    };
    pega.ui.automation.manager.registerComponent(dropDownComponent);
})();
//static-content-hash-trigger-YUI
(function() {

    /*RDL utilities*/
    function getCount(targetElement) {
        var optionsCount = 0;
        if (targetElement) {
            var childEle = targetElement.querySelectorAll(".content-item.content-sub_section");
            if (childEle && childEle.length) {
                for (var i = 0; i < childEle.length; i++) {
                    if ($(childEle[0]).css("visibility") == "visible" || $(childEle[0]).css("display") == "block") {
                        optionsCount++;
                    }
                }
            }
        }
        return optionsCount;
    }

    var RDLStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent);
    RDLStepbuilder.getTargetElement = function(cellElement) {
        return cellElement;
    };

    RDLStepbuilder.implicitAssertions = null;
    RDLStepbuilder.implicitNavigations = null;
    RDLStepbuilder.isNotReadonlySupported = true;

    RDLStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
        var UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, pega.ui.automation.constants.ATTRIBUTE.LABEL);
        if (!UILabel) {
            UILabel = inspectableElement.getAttribute("id");
        }
        var UIType = "(RDL)";
        var action = "Verify ";
        if (actionName === "click" && isImplicitSave) {
            action = "Click ";
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }

        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel+ " ";
        }
        testStep = testStep + UIType;
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }

    /**
     * RDL Translator
     */
    var RDLTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    RDLTranslator.buildConfigs = function(targetElement) {
        var _constants = pega.ui.automation.constants;
        var visibleChildrenCount = getCount(targetElement);
        var configs = [];
        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Count";
        config[_constants.ATTRIBUTE_VALUE] = visibleChildrenCount;
        configs.push(config);
        return configs;
    }


    var RDLComponent = {
        type: "DYNAMICREPEATING",
        isRepeating: true,
        handlers: {
            stepbuilder: RDLStepbuilder,
            translator: RDLTranslator
        }
    };
    pega.ui.automation.manager.registerComponent(RDLComponent);
})();
//static-content-hash-trigger-YUI
(function() {
    var tabGroupStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: null
        }
    });

    tabGroupStepbuilder.getTargetElement = function(tabElement) {

        //Gets the current tab position in case of dynamic tabs
        var currentTabList = tabElement.parentElement.children;
        var currentTabPosition = -1;
        for (var i = 0; i < currentTabList.length; i++) {
            if (currentTabList[i] == tabElement) {
                currentTabPosition = i + 1;
                break;
            }
        }
        var ulSelector = "ul[role='tablist']";
        var ulElement = $(tabElement).closest(ulSelector)[0];
        if (ulElement.getAttribute("data-test-id")) {
            ulSelector = "ul[data-test-id='" + ulElement.getAttribute("data-test-id") + "']";
        }
        ulElement = null;
        if (currentTabPosition != -1) {
            this.customQuerySelector = ulSelector + " li:nth-child(" + currentTabPosition + ")";
        }
        return tabElement;
    }

    tabGroupStepbuilder.getNavigationActions = function(inspectableTargetElement, eventType, eventTarget) {
        var navigations = [];
        if (eventType == "click" && eventTarget && eventTarget.id == "close") {
            //Click on close icon in tab group
            navigations.push("close");
        } else if (this.implicitNavigations.indexOf(eventType) == -1) {
            //If the current event is not part of implicit navigations, make current event as action
            navigations.push(eventType);
        } else {
            navigations.push.apply(navigations, this.implicitNavigations);
        }
        return navigations;
    }


    var tabGroupNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    tabGroupNavigator.doAction = function(actionElem, actionName, actionValue, actionCallback) {
        console.log("Invoking tabgroup component action");

        var tabActionElem = actionElem;
        if (actionName == "close") {
            tabActionElem = actionElem.querySelector("#close");
        }
        pega.control.actionSequencer.fireTopPriorityEvent(tabActionElem, "click");
        tabActionElem = null;
        actionCallback();
    }

    var tabGroupComponent = {
        type: "Tab",
        handlers: {
            stepbuilder: tabGroupStepbuilder,
            navigator: tabGroupNavigator,
            inspector: {
                selector: "ul.tab-ul li.tab-li",
                selectorcb: function() {
                    return {
                        "type": "pxTabGroup",
                        "subType": "Tab"
                    }
                }
            }
        }
    };
    pega.ui.automation.manager.registerComponent(tabGroupComponent);
})();
//static-content-hash-trigger-YUI
(function() {
    var layoutGroupStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: ["Value", "Title"]
        },
        //Considering innerText in case of data-test-id is not present
        //This case comes when a direct section include in layout group
        customSelectorAttributes: {
            //Configure custom attributes
            value: [pega.ui.automation.constants.SELECTOR.INNERTEXT]
        }
    });
    layoutGroupStepbuilder.getTargetElement = function(inspectableElement) {
        var headerLabelElem = inspectableElement.querySelector('.layout-group-item-title[id^="headerlabel"]');
        if (!headerLabelElem.firstElementChild) {
          return headerLabelElem
        }
        return inspectableElement;
      
    };
    var layoutGroupTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    layoutGroupTranslator.buildConfigs = function() {

        var _constants = pega.ui.automation.constants;

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Title";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
        configs.push(config);

        return configs;
    }

    var layoutGroupNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    var layoutGroupComponent = {
        type: "LayoutGroupItem",
        handlers: {
            stepbuilder: layoutGroupStepbuilder,
            navigator: layoutGroupNavigator,
            translator: layoutGroupTranslator,
            inspector: {
                selector: "[data-lg-id] [role='tab']",
                selectorcb: function() {
                    return {
                        "type": "pxLayoutGroup",
                        "subType": "LayoutGroupItem"
                    }
                }
            }
        }
    };
    pega.ui.automation.manager.registerComponent(layoutGroupComponent);
})();
//static-content-hash-trigger-YUI
(function() {

    /*GRID utilities*/
    function getCount(targetElement) {
        var optionsCount = 0;
        if (targetElement) {
            targetElement = targetElement.querySelector('.gridTable>tbody');
            while (targetElement && !targetElement.firstChild.classList.contains("cellCont")) {
                targetElement = targetElement.querySelector('.gridTable>tbody');
            }
            var childEle = targetElement.childNodes;
            if(childEle && childEle.length) {
                childEle.forEach(function(child) {
                    if(child.id != "Grid_NoResults" && (child.classList) && (child.classList.contains("oddRow") || child.classList.contains("evenRow"))) {
                        if($(child).css("visibility") == "visible" && $(child).css("display") != "none") {
                            optionsCount++;
                        }
                    }
                });
            }

        }
        return optionsCount;
    }

    var GRIDStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent);
    GRIDStepbuilder.getTargetElement = function(cellElement) {
        return cellElement.querySelector("#gridLayoutTable");
    };

    GRIDStepbuilder.implicitAssertions = null;
    GRIDStepbuilder.implicitNavigations = null;
    GRIDStepbuilder.isReadonlySupported = false;

    GRIDStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
        var UIType = "(RepeatingGrid)";
        var UILabel = "";
        var action = "Verify ";
        if (actionName === "click" && isImplicitSave) {
            action = "Click ";
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }
        var gridTableElem = inspectableElement.querySelector("#gridLayoutTable");
        if (gridTableElem) {
            UILabel = gridTableElem.getAttribute("summary");
        }
        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel + " "
        }
        testStep = testStep + UIType;

        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }

    /**
     * GRID Translator
     */
    var GRIDTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    GRIDTranslator.buildConfigs = function(targetElement) {
        var _constants = pega.ui.automation.constants;
        var visibleChildrenCount = getCount(targetElement);
        var configs = [];
        var config = {};
        config[_constants.ATTRIBUTE_DESC] = "Count";
        config[_constants.ATTRIBUTE_VALUE] = visibleChildrenCount;
        configs.push(config);
        return configs;
    }


    var GRIDComponent = {
        type: "REPEATGRID",
        handlers: {
            stepbuilder: GRIDStepbuilder,
            translator: GRIDTranslator
        }
    };
    pega.ui.automation.manager.registerComponent(GRIDComponent);



    //Grid Row Component

    var gridRowStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: null
        }
    });
    gridRowStepbuilder.isReadonlySupported = false;
    gridRowStepbuilder.updateComponentSpecificData = function(componentdata, rowElement, actionName, isImplicitSave) {
        var UIType = "(GridRow)";
        var action = "Verify ";
        if (actionName === "click" && isImplicitSave) {
            action = "Click ";
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }
        var rowIndex = rowElement.getAttribute("pl_index");
        var testStep = action + UIType;
        if (rowIndex) {
            testStep = testStep + " : " + rowIndex;
        }
        componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = testStep;
    }

    var gridRowNavigator = Object.create(pega.ui.automation.navigator.defaultComponent);

    gridRowNavigator.doAction = function(rowElement, actionName, actionValue, actionCallback) {
        console.log("Invoking GridRow component action");

        if (pega.ui.automation.utils.hasClass(rowElement, "editMode")) {
            return;
        }
        var existingEditableRow = rowElement.parentElement.querySelector(".editMode");
        if (existingEditableRow && existingEditableRow != rowElement) {
            //Triggering mouseup on body to submit previous editable row
            var mouseupEvent = document.createEvent('Event');
            mouseupEvent.initEvent('mouseup', true, true);

            if (window == existingEditableRow.ownerDocument.defaultView) {
                document.body.dispatchEvent(mouseupEvent);
            } else {
                existingEditableRow.ownerDocument.body.dispatchEvent(mouseupEvent);
            }
            mouseupEvent = null;
        }
        if (window == rowElement.ownerDocument.defaultView) {
            pega.control.actionSequencer.fireTopPriorityEvent(rowElement.firstChild, actionName);
        } else {
            rowElement.ownerDocument.defaultView.pega.control.actionSequencer.fireTopPriorityEvent(rowElement.firstChild, actionName);
        }

        //call actioncallback at the end which resolves all promises.
        actionCallback();
    }

    var gridRowComponent = {
        type: "GridRow",
        handlers: {
            stepbuilder: gridRowStepbuilder,
            navigator: gridRowNavigator,
            inspector: {
                selector: "#PEGA_GRID_CONTENT .cellCont.oddRow,#PEGA_GRID_CONTENT .cellCont.evenRow",
                selectorcb: function() {
                    return {
                        "type": "pxRepeatingGrid",
                        "subType": "GridRow"
                    }
                }
            }
        }
    };
    pega.ui.automation.manager.registerComponent(gridRowComponent);
  
    var gridHeaderHeaderStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: ["Value", "Title"]
        }
    });
  
   /**
     * Grid Header Translator
     */
    var gridHeaderTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    gridHeaderTranslator.buildConfigs = function() {

        var _constants = pega.ui.automation.constants;

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
        configs.push(config);

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Title";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.TITLE;
        configs.push(config);

        return configs;
    }
  
  var gridHeaderLabel = {
    type: 'GridHeader',
    handlers: {
      stepbuilder: gridHeaderHeaderStepbuilder,
      translator: gridHeaderTranslator,
      inspector : {
        selector: ".gridTable [role='columnheader']",
        selectorcb: function() {
          return {
            "type": "pxRepeatingGridHeader",
            "subType": "GridHeader"
          }
        }
      }
    }
  }
  pega.ui.automation.manager.registerComponent(gridHeaderLabel);
})();
//static-content-hash-trigger-YUI
(function() {
    /**
     * Layout Header Stepbuilder
     */
    var layoutheaderStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
        implicitAssertions: {
            value: ["Value"]
        },
        customSelectorAttributes: {
            value: [pega.ui.automation.constants.SELECTOR.INNERTEXT]
        }
    });
    layoutheaderStepbuilder.getTargetElement = function(domElement) {
        console.log("Invoking layout header stepbuilder");
        return domElement.querySelector(".header-title");

    }
    
    /**
     * Update any component specific data 
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    layoutheaderStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicitSave) {
        var _constants = pega.ui.automation.constants;
        var componentName = componentdata[_constants.COMPONENT_TYPE];
        var UIType = pega.ui.automation.utils.getComponentDesc(componentName);
        var UILabel = inspectableElement && inspectableElement.innerText;
        if (!UILabel) {
            UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        }
        var action = "Verify ";
        if (actionName === "click" && isImplicitSave) {
            action = "Click ";
        }
        if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }
        var testStep = action;
        if (UILabel) {
            testStep = testStep + UILabel;
        }
        testStep = testStep + " ("+UIType+")";
        componentdata[_constants.TEST_STEP_NAME] = testStep;
    }

    /**
     * Layout Header Translator
     */
    var layoutheaderTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    layoutheaderTranslator.buildConfigs = function(targetElement) {

        var _constants = pega.ui.automation.constants;

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
        configs.push(config);

        return configs;
    }

    var layoutheaderComponent = {
        type: "pyHeaderTable",
        handlers: {
            stepbuilder: layoutheaderStepbuilder,
            translator: layoutheaderTranslator,
            inspector: {
                selector: "div[node_type='HEADER'],legend.fieldset-legend",
                selectorcb: function() {
                    return {
                        "type": "pyHeader",
                        "subType": "pyHeaderTable"
                    }
                }
            }
        }
    };
    pega.ui.automation.manager.registerComponent(layoutheaderComponent);
})();
//static-content-hash-trigger-YUI
//static-content-hash-trigger-YUI
(function(){
  
  var generateStepName = function(componentdata,labelText){
  var stepDescription = "Verify errors on";
    if(labelText){
        if (labelText.length > 20) {
        labelText = labelText.substring(0,20) + "..." 
        }
      stepDescription = stepDescription + " : " + labelText;   
     }     
     componentdata[pega.ui.automation.constants.TEST_STEP_NAME] = stepDescription;
  }
  /**
  *Step Name for field level error 
  **/
   var updateFieldLevelErrorStepName = function(componentdata,inspectableElement){
   var labelText = pega.ui.automation.utils.getAttributeValue(inspectableElement,"<label>");  
   generateStepName(componentdata,labelText);     
  }
   /**
  *Step Name for custom Error
  **/
   var updateCustomErrorStepName = function(componentdata,inspectableElement){
     var labelText = '';
     inspectableElement = inspectableElement.children;
      for(var i=0;i<inspectableElement.length;i++){
      var errorText = inspectableElement[i].getAttribute("id");
      errorText = errorText.substr(errorText.indexOf(".")+1,errorText.length);
      labelText = labelText + " "+ errorText;
     }
     generateStepName(componentdata,labelText);
     } 
   
   /**
  *Step Name for error table
  **/
   var errorTableStepName = function(componentdata,inspectableElement){
     var labelText = '';
     inspectableElement = inspectableElement.querySelectorAll("li");
     for(var i=0;i<inspectableElement.length;i++){
       var errorText = pega.ui.automation.utils.getAttributeValue(inspectableElement[i],":contains");
       errorText = errorText.substr(0,errorText.indexOf(":"));
       labelText = labelText + " "+ errorText;
     }
     generateStepName(componentdata,labelText);
   }
   
   /**
  *Step builder for field level error
  **/
   var errorFieldLevelStepBuilder= Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    
    implicitAssertions: {
    
    value: ["Value"]
  },
    implicitNavigations: {
        value: null
    },
     customSelectorAttributes: {
        value: ["id", "class"]
    }
  });
  
  errorFieldLevelStepBuilder.updateComponentSpecificData = updateFieldLevelErrorStepName;                                                                     
  /**
  *Step builder for error table 
  **/
  
  var errorTableStepBuilder= Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    
    implicitAssertions: {
    
    value: ["Value"]
  },
    implicitNavigations: {
        value: null
    }
  });
  
  /**
  *Error Table  Translator
  **/
  
    errorTableStepBuilder.getTargetElement = function(errorElement) {
    var errorTableElements = document.querySelectorAll("#ERRORTABLE");
    var errorTablePosition = 0;
    for(var i = 0; i < errorTableElements.length; i++) {
      if(errorElement === errorTableElements[i]) {
        errorTablePosition = i;
        break;
      }
    }
    this.customQuerySelector = "#ERRORTABLE:eq("+errorTablePosition+")"
    return errorElement
  }
 
  errorTableStepBuilder.updateComponentSpecificData = errorTableStepName;
  
  
   
  /**
  *Custom Error Step builder
  **/
  
  var customeErrorsStepBuilder = Object.create(pega.ui.automation.recorder.stepbuilder.defaultComponent, {
    implicitAssertions: {
      value: ["Value"]
    },
    implicitNavigations: {
        value: null
    },
    customSelectorAttributes: {
        //Configure custom attributes
        value: ["class"]
    }
    
  });
  
  /**
  *Translator for field level and custom errors
  **/
   var errorTranslator = Object.create(pega.ui.automation.recorder.translator.defaultComponent);
    errorTranslator.buildConfigs = function(targetElement) {

        var _constants = pega.ui.automation.constants;

        var configs = [];

        config = {};
        config[_constants.ATTRIBUTE_DESC] = "Value";
        config[_constants.ATTRIBUTE_NAME] = _constants.ATTRIBUTE.INNER_TEXT;
        configs.push(config);

        return configs;
    }
    
    customeErrorsStepBuilder.updateComponentSpecificData =updateCustomErrorStepName ;
  
    var fieldLevelErrorComponent = {
      type: "FieldError",
      handlers : {
        stepbuilder: errorFieldLevelStepBuilder,
        translator : errorTranslator,
        inspector: {
                selector: "#PegaRULESErrorFlag,.inputError,.iconError",
                selectorcb: function() {
                    return {
                        "type": "Errors",
                        "subType": "FieldError"
                        
                    }
                }
            }
    }
      
    };
     var errorTableComponent = {
      type: "ErrorTable",
      handlers : {
        stepbuilder: errorTableStepBuilder,
        translator : errorTranslator,
         inspector: {
                selector: "#ERRORTABLE",
                selectorcb: function() {
                    return {
                        "type": "Errors",
                      "subType": "ErrorTable"
                        
                    }
                }
            }
        
    }
      
    };
  var CustomErrorListComponent = {
      type: "CustomErrorList",
      handlers : {
        stepbuilder: customeErrorsStepBuilder,
        translator : errorTranslator,
         inspector: {
                selector: "ul.custom_errorlist_ul",
                selectorcb: function() {
                    return {
                        "type": "Errors",
                      "subType":"CustomErrorList"
                        
                    }
                }
            }
        
        
    }
  };
  
 
  
  
  pega.ui.automation.manager.registerComponent(fieldLevelErrorComponent);
  pega.ui.automation.manager.registerComponent(errorTableComponent);
  pega.ui.automation.manager.registerComponent(CustomErrorListComponent);
})();
//static-content-hash-trigger-YUI
(function() {
    //Textinput Stepbuilder
    var textInputStepbuilder = Object.create(pega.ui.automation.recorder.stepbuilder.inputTextStepbuilder);

    //Textinput Translator
    var textInputTranslator = Object.create(pega.ui.automation.recorder.translator.inputTextTranslator);
    /**
     * Update component specific data for TextInput
     * @function   {updateComponentSpecificData} 
     * @param      {JSON}                           componentdata       The componentdata
     * @param      {Element}                        inspectableElement  The inspectable element
     * @param      {String}                         actionName
     */
    textInputStepbuilder.updateComponentSpecificData = function(componentdata, inspectableElement, actionName, isImplicit) {
        var _constants = pega.ui.automation.constants;
        var UILabel = inspectableElement && (inspectableElement.innerText).trim();
        if(!UILabel){
          UILabel = pega.ui.automation.utils.getAttributeValue(inspectableElement, _constants.ATTRIBUTE.LABEL);
        }
        var componentName = componentdata[_constants.COMPONENT_TYPE];
        var UIType = pega.ui.automation.utils.getComponentDesc(componentName);
        var enteredText = "";
        var action = "Verify ";
        if (actionName === "change") {
            action = "Enter ";
        } else if (actionName === "dblclick") {
            action = "DoubleClick ";
        } else if (actionName === "contextmenu") {
            action = "RightClick ";
        }
        if(actionName === "change" /*|| (actionName === "click" && isImplicit)*/){
          enteredText = this.getElementValue(inspectableElement);
          if (enteredText.length > 20) {
            enteredText = enteredText.substring(0, 20) + "..."
          }
        }
        var stepName = action;
        if (UILabel) {
            stepName = stepName +  UILabel;
        }
        stepName = stepName +  " ("+UIType+")";
        if (enteredText) {
            stepName = stepName + " : " + enteredText;
        }
        componentdata[_constants.TEST_STEP_NAME] = stepName;
    }
    var handler = {
        stepbuilder: textInputStepbuilder,
        translator: textInputTranslator
    };

    //All the Textinput control types that will be managed by automation.
    var types = ["pxEmail", "pxPhone", "pxPassword", "pxNumber", "pxURL", "pxCurrency", "Decimal", "pxInteger","pxSlider"];

    //For each control type register a component.
    for (var index = 0; index < types.length; index++) {
        pega.ui.automation.manager.registerComponent({
            type: types[index],
            handlers: handler
        });
    }
})();
//static-content-hash-trigger-YUI