/**
 * menu-aim is a jQuery plugin for dropdown menus that can differentiate
 * between a user trying hover over a dropdown item vs trying to navigate into
 * a submenu's contents.
 *
 * menu-aim assumes that you have are using a menu with submenus that expand
 * to the menu's right. It will fire events when the user's mouse enters a new
 * dropdown item *and* when that item is being intentionally hovered over.
 *
 * __________________________
 * | Monkeys  >|   Gorilla  |
 * | Gorillas >|   Content  |
 * | Chimps   >|   Here     |
 * |___________|____________|
 *
 * In the above example, "Gorillas" is selected and its submenu content is
 * being shown on the right. Imagine that the user's cursor is hovering over
 * "Gorillas." When they move their mouse into the "Gorilla Content" area, they
 * may briefly hover over "Chimps." This shouldn't close the "Gorilla Content"
 * area.
 *
 * This problem is normally solved using timeouts and delays. menu-aim tries to
 * solve this by detecting the direction of the user's mouse movement. This can
 * make for quicker transitions when navigating up and down the menu. The
 * experience is hopefully similar to amazon.com/'s "Shop by Department"
 * dropdown.
 *
 * Use like so:
 *
 *      $("#menu").menuAim({
 *          activate: $.noop,  // fired on row activation
 *          deactivate: $.noop  // fired on row deactivation
 *      });
 *
 *  ...to receive events when a menu's row has been purposefully (de)activated.
 *
 * The following options can be passed to menuAim. All functions execute with
 * the relevant row's HTML element as the execution context ('this'):
 *
 *      .menuAim({
 *          // Function to call when a row is purposefully activated. Use this
 *          // to show a submenu's content for the activated row.
 *          activate: function() {},
 *
 *          // Function to call when a row is deactivated.
 *          deactivate: function() {},
 *
 *          // Function to call when mouse enters a menu row. Entering a row
 *          // does not mean the row has been activated, as the user may be
 *          // mousing over to a submenu.
 *          enter: function() {},
 *
 *          // Function to call when mouse exits a menu row.
 *          exit: function() {},
 *
 *          // Selector for identifying which elements in the menu are rows
 *          // that can trigger the above events. Defaults to "> li".
 *          rowSelector: "> li",
 *
 *          // You may have some menu rows that aren't submenus and therefore
 *          // shouldn't ever need to "activate." If so, filter submenu rows w/
 *          // this selector. Defaults to "*" (all elements).
 *          submenuSelector: "*",
 *
 *          // Direction the submenu opens relative to the main menu. Can be
 *          // left, right, above, or below. Defaults to "right".
 *          submenuDirection: "right"
 *      });
 *
 * https://github.com/kamens/jQuery-menu-aim
*/
(function($) {
	if(typeof($.fn.menuAim)!="undefined") return;
    $.fn.menuAim = function(opts) {
        // Initialize menu-aim for all elements in jQuery collection
        this.each(function() {
            init.call(this, opts);
        });

        return this;
    };

    function init(opts) {
        var $menu = $(this),
            activeRow = null,
            mouseLocs = [],
            lastDelayLoc = null,
            timeoutId = null,
            options = $.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,  // bigger = more forgivey when entering submenu
                enter: $.noop,
                exit: $.noop,
                activate: $.noop,
                deactivate: $.noop,
                exitMenu: $.noop
            }, opts);

        var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
            DELAY = 300;  // ms delay when user appears to be entering submenu

        /**
         * Keep track of the last few locations of the mouse.
         */
        var mousemoveDocument = function(e) {
                mouseLocs.push({x: e.pageX, y: e.pageY});

                if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                    mouseLocs.shift();
                }
            };

        /**
         * Cancel possible row activations when leaving the menu entirely
         */
        var mouseleaveMenu = function() {
                if(pega.cl && pega.cl.isTouchAble() && arguments[0] && arguments[0].originalEvent && arguments[0].originalEvent.isATriggeredEvent){
                  return;
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
          
          if(pega.cl.isTouchAble()){
             setTimeout(function(){
                // If exitMenu is supplied and returns true, deactivate the
                // currently active row on menu exit.
                if (!pega.c.menu.isFromTouchEvent && options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }
                   activeRow = null;
                }
               pega.c.menu.isFromTouchEvent = false;	
             },1);
          }
          else{
            if (!pega.c.menu.isFromTouchEvent && options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }
                   activeRow = null;
                }
               pega.c.menu.isFromTouchEvent = false;	
          }
        };

        /**
         * Trigger a possible row activation whenever entering a new row.
         */
        var mouseenterRow = function() {
                if(pega.cl && pega.cl.isTouchAble() && arguments[0] && arguments[0].originalEvent && arguments[0].originalEvent.isATriggeredEvent){
                  return;
                }
                if (timeoutId) {
                    // Cancel any previous activation delays
                    clearTimeout(timeoutId);
                }

                options.enter(this);
                possiblyActivate(this);
            },
            mouseleaveRow = function() {
              if(pega.cl && pega.cl.isTouchAble() && arguments[0] && arguments[0].originalEvent && arguments[0].originalEvent.isATriggeredEvent){
                return;
              }
                options.exit(this);
            };

        /*
         * Immediately activate a row if the user clicks on it.
         */
        var clickRow = function() {
                activate(this);
            };

        /**
         * Activate a menu row.
         */
        var activate = function(row) {
                if (row == activeRow) {
                    return;
                }

                if (activeRow) {
                    options.deactivate(activeRow);
                }

                options.activate(row);
                activeRow = row;
            };

        /**
         * Possibly activate a menu row. If mouse movement indicates that we
         * shouldn't activate yet because user may be trying to enter
         * a submenu's content, then delay and check again later.
         */
        var possiblyActivate = function(row) {
                var delay = activationDelay();

                if (delay) {
                    timeoutId = setTimeout(function() {
                        possiblyActivate(row);
                    }, delay);
                } else {
                    activate(row);
                }
            };

        /**
         * Return the amount of time that should be used as a delay before the
         * currently hovered row is activated.
         *
         * Returns 0 if the activation should happen immediately. Otherwise,
         * returns the number of milliseconds that should be delayed before
         * checking again to see if the row should be activated.
         */
        var activationDelay = function() {
                if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                    // If there is no other submenu row already active, then
                    // go ahead and activate immediately.
                    return 0;
                }

                var offset = $menu.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top - options.tolerance
                    },
                    upperRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + $menu.outerHeight() + options.tolerance
                    },
                    lowerRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: lowerLeft.y
                    },
                    loc = mouseLocs[mouseLocs.length - 1],
                    prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    // If the previous mouse location was outside of the entire
                    // menu's bounds, immediately activate.
                    return 0;
                }

                if (lastDelayLoc &&
                        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    // If the mouse hasn't moved since the last time we checked
                    // for activation status, immediately activate.
                    return 0;
                }

                // Detect if the user is moving towards the currently activated
                // submenu.
                //
                // If the mouse is heading relatively clearly towards
                // the submenu's content, we should wait and give the user more
                // time before activating a new row. If the mouse is heading
                // elsewhere, we can immediately activate a new row.
                //
                // We detect this by calculating the slope formed between the
                // current mouse location and the upper/lower right points of
                // the menu. We do the same for the previous mouse location.
                // If the current mouse location's slopes are
                // increasing/decreasing appropriately compared to the
                // previous's, we know the user is moving toward the submenu.
                //
                // Note that since the y-axis increases as the cursor moves
                // down the screen, we are looking for the slope between the
                // cursor and the upper right corner to decrease over time, not
                // increase (somewhat counterintuitively).
                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                };

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                // Our expectations for decreasing or increasing slope values
                // depends on which direction the submenu opens relative to the
                // main menu. By default, if the menu opens on the right, we
                // expect the slope between the cursor and the upper right
                // corner to decrease over time, as explained above. If the
                // submenu opens in a different direction, we change our slope
                // expectations.
                if (options.submenuDirection == "left") {
                    decreasingCorner = lowerLeft;
                    increasingCorner = upperLeft;
                } else if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft;
                } else if (options.submenuDirection == "above") {
                    decreasingCorner = upperLeft;
                    increasingCorner = upperRight;
                }

                var decreasingSlope = slope(loc, decreasingCorner),
                    increasingSlope = slope(loc, increasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope &&
                        increasingSlope > prevIncreasingSlope) {
                    // Mouse is moving from previous location towards the
                    // currently activated submenu. Delay before activating a
                    // new menu row, because user may be moving into submenu.
                    lastDelayLoc = loc;
                    return DELAY;
                }

                lastDelayLoc = null;
                return 0;
            };

        /**
         * Hook up initial menu events
         */
        $menu
            .mouseleave(mouseleaveMenu)
            .find(options.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow);
                //BUG-175166: Menu need to invoke the action on click instead of showing submenu.
                //.click(clickRow);

        $(document).mousemove(mousemoveDocument);

    };
})(jQuery);
//static-content-hash-trigger-GCC
(function(p) {
    if (p.c != undefined && typeof(p.c.menu) != "undefined") return;

    "use strict";
    
    var touchable = p.cl.isTouchAble();
    var isOrientationRTL = pega.u.d.isOrientationRTL();
    var deferLoadRequest = null;
    var duplicateIdSequencer = 1;
    var isMobile = false;
    var metadataMap = {};

    if (!p.control) {
        p.c = p.namespace("pega.control");
    } else {
        p.c = pega.control;
    }

    p.c.menu = {
        /**
         * [createMenu description]
         * @param  {string} elementId
         * @param  {JSON Object} data
         * @param  {JSON Object} metadata
         * @return {undefined}
         */

        currentActive: null,

        renderer: function(componentInfo) {
            return p.c.menu.createMenu(null, p.c.menu.constructMetadataObject(componentInfo));
        },

        constructMetadataObject: function(componentInfo) {
            var rawCCObject = componentInfo.pyCell.pyModes[0];
            var returnMetadataObject = {};
            var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
            
            var reference = pega.ui.TemplateEngine.getCurrentContext().getReference();
            var contextId = (reference === "pyDisplayHarness") ? (pega.ui.TemplateEngine.getCurrentContext().getID("pyPortalHarness") || "") : (pega.ui.TemplateEngine.getCurrentContext().getID() || "");
          /* Check if rawCCObject has one of the expected properties. */
            // old condition before UIComponentConstants changes 'rawCCObject && rawCCObject["pyNavPage"]'
            if (rawCCObject && rawCCObject[TEMPLATE_CONSTANTS.NAVPAGE]) {
                //returnMetadataObject["type"] = rawCCObject["pyMenuType"] || "vertical";
                returnMetadataObject["type"] = rawCCObject[TEMPLATE_CONSTANTS.MENUTYPE] || "vertical";
                //returnMetadataObject["format"] = rawCCObject["pyStyleNameOther"] || "menu-format-standard";
                returnMetadataObject["format"] = rawCCObject[TEMPLATE_CONSTANTS.PYSTYLENAMEOTHER] || "menu-format-standard";
                //returnMetadataObject["isMobile"] = rawCCObject["pyIsMobile"] || "false";
                returnMetadataObject["isMobile"] = rawCCObject[TEMPLATE_CONSTANTS.ISMOBILE] || "false";
                //returnMetadataObject["deferLoad"] = rawCCObject["pyNavigationDeferLoad"] || "false";
                returnMetadataObject["deferLoad"] = rawCCObject[TEMPLATE_CONSTANTS.NAVDEFERLOAD] || "false";
                //returnMetadataObject["enableCache"] = rawCCObject["pyNavigationEnableCache"] || "false";
                returnMetadataObject["enableCache"] = rawCCObject[TEMPLATE_CONSTANTS.NAVCACHE] || "false";
                //returnMetadataObject["navName"] = rawCCObject["pyNavigation"];
                returnMetadataObject["navName"] = rawCCObject[TEMPLATE_CONSTANTS.NAVIGATION];
                //returnMetadataObject["navPage"] = rawCCObject["pyNavPage"];
                var navPageName = rawCCObject[TEMPLATE_CONSTANTS.NAVPAGE];
                if(rawCCObject[TEMPLATE_CONSTANTS.NAVPAGEREF] && !pega.u.d.ServerProxy.isDestinationLocal()) {
                    navPageName = pega.ui.TemplateEngine.getCurrentContext().getDataSource(rawCCObject[TEMPLATE_CONSTANTS.NAVPAGEREF]);
                    navPageName = navPageName.split('.')[0];
                }
                returnMetadataObject["navPage"] = navPageName;
                //returnMetadataObject["usingPage"] = rawCCObject["usingPage"];//bug-292999
                returnMetadataObject["usingPage"] = rawCCObject[TEMPLATE_CONSTANTS.USINGPAGE];
                //returnMetadataObject["menuID"] = "menu-" + rawCCObject["pyNavPage"].replace("pyNavigation", "");
                returnMetadataObject["menuID"] = "menu-" + rawCCObject[TEMPLATE_CONSTANTS.NAVPAGE].replace("pyNavigation", "");
                returnMetadataObject["uniqueMenuId"] = (rawCCObject["pyUniqueMenuID"] + contextId) || "";
            }
            return returnMetadataObject;
        },

        processData: function(elementsList) {
            if (!elementsList || elementsList.length == 0) {
                return [];
            }
            var returnDataArray = [];
            for (var i = 0; i < elementsList.length; i++) {
                var ccListItem = elementsList[i];
                if (ccListItem.pyHidden && (ccListItem.pyHidden === "true" || ccListItem.pyHidden === true)) {
                    continue;
                }
                var newObj = {};
                var metaDataProps = [
                    "pyCaption", "pyAutomationID", "pyToolTip", "pySummary", "pyDeferLoad",
                    "pyBadgeProperty", "pyImageSource", "pySimpleImage",
                    "pyIconProperty", "pyIconStyle", "pyDisabled",
                    "pxEntryHandle", "pyRadio", "pyChecked", "pyIsActiveNavItem","pyExpressionId"
                ];
                $.each(metaDataProps, function(index, prop) {
                    var propVal = ccListItem[prop];
                    if (propVal) {
                        newObj[prop] = propVal;
                    }
                });

                if (ccListItem.pyBadgeFormat) {

                    var badgeClass = ccListItem.pyBadgeFormat.toLowerCase();

                    if (badgeClass == "standard (label for field)") {
                        badgeClass = "dataLabelForRead";
                    } else if (badgeClass == "standard" || badgeClass == "standard (label)") {
                        badgeClass = "dataLabelRead";
                    } else {
                        badgeClass = badgeClass.replace(' ', '_');
                        badgeClass = "dataLabelRead" + " " + badgeClass + "_" + "dataLabelRead";
                    }

                    newObj["badgeClass"] = badgeClass;

                }
                if (ccListItem.pyType) {
                    newObj["separator"] = ((ccListItem.pyType && ccListItem.pyType.toLowerCase() == "separator") ? "true" : "false");
                }
                var behaviors = ccListItem.pyBehaviors;
                /** [BUG-192862 : Menu option with FinishAssignment action does not work] starts */
                var pBehaviorsString = "";
                if (behaviors && behaviors.length > 0) {

                    for (var j = 0; j < behaviors.length; j++) {
                        if (j > 0) {
                            pBehaviorsString += ",";
                        }
                        pBehaviorsString += behaviors[j].pyActionString;
                    }
                    try{
                          newObj["data-click"] = JSON.parse("[" + pBehaviorsString + "]");
                    } catch(err){
                        pBehaviorsString = pBehaviorsString.replace(/[\\]/g, "\\\\");
                        newObj["data-click"] = JSON.parse("[" + pBehaviorsString + "]");
                    }

                }
                /** [BUG-192862 : Menu option with FinishAssignment action does not work] ends */
                newObj.nodes = p.c.menu.processData(ccListItem.pyElements);
                returnDataArray.push(newObj);
            }
            return returnDataArray;
        },

        constructDataObject: function(metadata) {
            var navPage_CT = pega.ui.ClientCache.find(metadata.navPage);
            if (navPage_CT) {
                var navPage_CTRef = navPage_CT;
                navPage_CT = JSON.parse(navPage_CT.getJSON());
                var nodesData = p.c.menu.processData(navPage_CT.pyElements);
                if (nodesData && nodesData.length == 0) {
                    nodesData = [];
                    var topLevelNavPage = navPage_CTRef.getTopLevelPage();
                    var newObj = {};
                    newObj["pyCaption"] = topLevelNavPage.get("pyNoItemsMessage").getValue();
                    nodesData.push(newObj);
                }
                return {
                    menuid: metadata.navPage,
                    menuDesc: (metadata.navPage.indexOf("pyElements") > -1 ? navPage_CT.pyCaption : navPage_CT.pyLabel),
                    nodes: nodesData
                };
            }
            return null;
        },

        createMenu: function(elementId, metadata) {
            var data = p.c.menu.constructDataObject(metadata);
            if (!data) {
                return;
            }
            $.extend(metadata, p.c.menu.getSkinConfig(metadata.format));
            if (metadata.type == "horizontal") {
                metadata.sliding = false;
            }
            /*menubar can never be fullscreen*/
            if (metadata.fullscreen) {
                metadata.fullscreen = false;
            }
            setTimeout(function() {
                if (!metadata.sliding) {
                    p.c.menu.createSubLevels(data, metadata);
                }
            }, 0);

            var menubarMarkup = p.c.menu.createBar(elementId, data, metadata);

            /*Maintain a map of menubar id and sublevels. Used in doMenuBarCleanup*/
            var menubarid = $(menubarMarkup).attr('id');
            menuIdQueue[menubarid] = [];
            $(menubarMarkup).children('li').each(function(name, val) {
                menuIdQueue[menubarid].push($(val).data('childnodesid'));
            });

            if (!elementId) {
                return menubarMarkup;
            } else {
                $(document.getElementById("div-" + elementId)).replaceWith($(menubarMarkup));
            }

        },

        /**
         * [createBar description]
         * @param  {[type]} elementId
         * @param  {[type]} data
         * @param  {[type]} metadata
         * @return {[type]}
         */
        createBar: function(elementId, data, metadata) {

          if (metadata) {
            metadata["touchable"] = touchable;
          }
          if (data.nodes.length) {
                !(data.nodes[0].pyDisabled) && (data.nodes[0].focusable = true);
            }
          /* Call function in case of active when */
          p.c.menu.setActiveIndex(data, metadata);
          var menubar = Handlebars.templates["pzPega_menubar_template"]({
            nodeParent: data,
            nodes: data.nodes,
            metadata: $.extend({
              backLabel: window.gStrBack ? window.gStrBack : "Back"
            }, metadata),
            isMenuBar: true
          });

          metadataMap[metadata.menuID] = metadata;

          return menubar;
        },
      
        cleanSubLevels: function(removedMenuBarElements) {
            for(var i = 0; i < removedMenuBarElements.length; i++) {
                var menuId = removedMenuBarElements[i].id;
                var subLevelItem = document.querySelector("[data-menuid=" + menuId +"]");
                // Remove the menu-panel-wrapper element in the body
                if(subLevelItem) {
                    document.body.removeChild(subLevelItem.parentNode);
                }
            }
        },

        /**
         * [createSublevels description]
         * @param  {[type]} data
         * @param  {[type]} metadata
         * @return {[type]}
         */
        createSubLevels: function(data, metadata) {
          
             var mutate = function (mutations, observer) {
               for(var i = 0; i<mutations.length; i++) {
                 var lenRemovedNodes = mutations[i].removedNodes.length;
                  for(var j = 0; j < lenRemovedNodes; j++) {
                   if(mutations[i].removedNodes[j].querySelectorAll){
                     pega.c.menu.cleanSubLevels(mutations[i].removedNodes[j].querySelectorAll("ul.menu-bar"));
                   }
                 }
              }
            };
            var mutationObserver = new MutationObserver(mutate);
            var targetNode = pega.u.d.getSectionDiv(document.getElementById(metadata.menuID));
            pega.ui.statetracking.setBusy("p.c.menu.createSubLevels")

            var allNodesHTML = "";
            for (var i in data.nodes) {
                allNodesHTML += p.c.menu.createSubLevel(data.nodes[i], metadata);
            }

            if (metadata.sliding) {
                allNodesHTML = "<div class=\"menu-slider " + metadata.format + (isMobile && metadata.fullscreen ? " menu-fullscreen" : " menu-slider-nofullscr") + "\">" + allNodesHTML + "</div>";
            }

            var allNodesObject = $(allNodesHTML);

            // register harness context switching
            if(allNodesObject.length) {                
                pega.ctxmgr.registerContextSwitching(allNodesObject.get(0));
            }
            $(document.body).append(allNodesObject);
            if(metadata.menuID && targetNode){
                mutationObserver.observe(targetNode, {
                childList: true,
                subtree: true
      	      });
            }

            if (!metadata.sliding) {
                p.c.menu.setupMenuAim(allNodesObject.find(".menu"));
            }

            pega.ui.statetracking.setDone()
        },

        /**
         * [createSubLevel description]
         * @param  {[type]} node
         * @param  {[type]} metadata
         * @return {[type]}
         */
        createSubLevel: function(node, metadata) {
            var nodeHTML = "";
            /* BUG-192854: Merging pyCaption in data for sublevels. */
            if (node.nodes) {
                nodeHTML = Handlebars.partials["pzPega_menu_template"]({
                    nodes: node.nodes,
                    metadata: $.extend({
                        headerText: node.menuDesc ? node.menuDesc : ""
                    }, metadata),
                    pxEntryHandle: node.pxEntryHandle ? node.pxEntryHandle : node.menuid,
                    pyCaption: node.pyCaption ? node.pyCaption : ""
                });
            }
            /*BUG-196167 :start*/
            nodeHTML = nodeHTML.replace(/&amp;amp;/gi, "&amp;");
            /*BUG-196167 :end*/
            return nodeHTML;
        },

        /**
         * [setupMenuAim description]
         * @param  {[type]} menuNode
         * @return {[type]}
         */
        setupMenuAim: function(menuNode) {
            $(menuNode).menuAim({
                rowSelector: "> .menu-item",
                activate: function(menuItem) {
                    p.c.menu.getAndShowSubLevel(menuItem);
                },
                deactivate: function(menuItem) {
                    p.c.menu.hideSubLevel(menuItem);
                },
                exitMenu: function() {
                    return true;
                }
            });
        },

        /**
         * [getAndShowSubLevel description]
         * @param  {[type]}  menuItem
         * @return {[type]}
         */
        getAndShowSubLevel: function(menuItem) {
            menuItem = $(menuItem);
            if (!menuItem.hasClass("menu-item-disabled") && !menuItem.parent().hasClass("menu-format-slidingmenu")) {
                p.c.menu.highlight(menuItem);
            }
            var menuBarNode = p.c.menu.getMenuBarNode(menuItem.parent());
            var subMenuLoaded = false;
            var fromMenuBar = menuItem.parent().hasClass("menu-bar");
            if (p.c.menu.showMenuTarget) {
                var config = $.data(p.c.menu.showMenuTarget, "config");
            }
            //var loadSubLevel = menuItem.attr("isdeferload");

            $.data(menuItem.get(0), "hideChildNode", false); //BUG-218045 fix :- hideSubLevel() is called only for ie which causing this bug. Setting the value of "hideChildNode" to false before appending the menu item will solve it.
            if (menuItem.attr("data-childnodesid")) {
                subMenuLoaded = p.c.menu.deferLoadNode(menuItem, menuBarNode, fromMenuBar);
            }
            if (subMenuLoaded) {
                p.c.menu.showSubLevel(menuItem);
            }
        },

        /**
         * [showSubLevel description]
         * @param  {[type]} menuItem
         * @return {[type]}
         */
        showSubLevel: function(menuItem) {
            menuItem = $(menuItem);
            if ($.data(menuItem.get(0), "hideChildNode")) {
                return;
            }
            if (!menuItem.hasClass("menu-item-disabled")) {
                p.c.menu.highlight(menuItem);
            }
            //BUG-195976 - to hide sublevel of other menu items
            var fromMenuBar = menuItem.parent().hasClass("menu-bar");
            if (fromMenuBar) {
                var siblingsMenuItems = menuItem.siblings('li');
                for (var i = 0; i < siblingsMenuItems.length; i++) {
                    var childnodesid = $(siblingsMenuItems[i]).attr("data-childnodesid");
                    if (typeof childnodesid === 'string' && document.getElementById(childnodesid)) {
                        $(document.getElementById(childnodesid)).hide();
                    }
                }
            }
            //BUG-195976 - end
            var subLevelNode = p.c.menu.getChildNode(menuItem);
            var orientation = "vertical";
            var menuBarParent = menuItem.parent();
            if (menuBarParent.hasClass("menu-bar") && menuBarParent.hasClass("menu-horizontal")) {
                orientation = "horizontal";
            }
            p.c.menu.renderNode(subLevelNode, menuItem, orientation);
            p.c.menu.highlight(subLevelNode.children(".menu-item-enabled").first());
        },
      
        isShowMenuTargetInTemplateGrid: function(e) {
          var src = p.c.menu.showMenuTarget.parentElement;
          return src && (pega.u.d.findParentTable(src) && pega.u.d.findParentTable(src).getAttribute("uniqueid") !== "" || src.closest("div[class='grid-toolbar-section']")!=null);
        },
      
        isCurrentActionOpeningModal: function(e) {
          var menuItem = e.target.closest('.menu-item-anchor');
          return menuItem && menuItem.getAttribute('data-click') && menuItem.getAttribute('data-click').indexOf('processAction') !== -1 ;
        },

        isMenuItemClicked: function(e){
         var tagName = e.target && e.target.tagName;
         var isMenuItemSelected = false;
         switch(tagName){
           case 'SPAN':
             if(e.target.classList.contains('menu-item-title') || e.target.classList.contains('menu-item-title-wrap')) { isMenuItemSelected = true; }
             break;
           case 'LI':
              if(e.target.classList.contains('menu-item','menu-item-enabled','menu-item-active')) { isMenuItemSelected = true; }
              break;
           case 'A':
            if(e.target.classList.contains('menu-item-anchor')) { isMenuItemSelected = true; }
             break;
           default:
            isMenuItemSelected = false;
            break;
         }
         return isMenuItemSelected
        },

        hideNode: function(e) {
            if (p.c.menu.canHide(e)) {
              var node = e.data.node;
              if(node.css('display') !== 'none' && !(p.c.menu.isShowMenuTargetInTemplateGrid(e) === true && p.c.menu.isCurrentActionOpeningModal(e) === true)){
                // focus only when the node is not already hidden otherwise it will end up stealing focus from input elements
                if(p.c.menu.isMenuItemClicked(e)) {
                  p.c.menu.showMenuTarget.focus();
                }
              }
              //If the context manager has unregisterContextSwitching function, unregister the node, as it is getting hidden or removed.
              if(pega.ctxmgr && typeof(pega.ctxmgr.unregisterContextSwitching) === "function" && (node) && (node).length > 0) {
                //Get the menu wrapper of the ul.
                var menuWrapper = (node).closest("div.menu-panel-wrapper[data-harness-id]");
                if(menuWrapper && menuWrapper.length > 0){
                  pega.ctxmgr.unregisterContextSwitching(menuWrapper.get(0));
                }
              }
                p.c.menu.detachNodeListeners(e.data.node);
                if (node.hasClass("menu-fullscreen")) {
                    p.c.menu.animateFullScreen(node, "hide");
                } else {
                    e.data.node.hide();
                    if (e.data.node.hasClass("menu-slider")) {
                        if(pega.u.d.isOrientationRTL()) {
                            e.data.node.children().first().css({
                                marginRight: 0
                            });
                        } else {
                            e.data.node.children().first().css({
                                marginLeft: 0
                            });
                        }
                        e.data.node.find(".menu-slider-item-active").removeClass("menu-slider-item-active");
                        e.data.node.find(".menu-active").removeClass("menu-active");
                    }
                }
              
                if(pega.mobile && pega.mobile.nativenav){
                    pega.mobile.nativenav.restoreCheckpoint(e.data.node.backNavId);
                    e.data.node.backNavId = "";
                }
              
            }                  
        },

        canHide: function(e) {
            var shouldHide = true;
            var userAgentVersion = /Android(?:\D*)([0-9\.]*);/g.exec(navigator.userAgent || '');
            userAgentVersion = userAgentVersion && userAgentVersion[1];
            userAgentVersion = parseFloat(userAgentVersion);
            if (e.data.node.hasClass("menu-fullscreen") && ($(e.target).hasClass("menu-item-separator") || $(e.target).hasClass("menu-fullscreen"))) {
                shouldHide = false;
                $(document.body).on("touchend.bodyone", {
                    node: e.data.node
                }, function(e) {
                        $(this).off(e);
                        p.c.menu.hideNode(e);
                    }
                );
                
            } else if (p.c.menu.dragging && ( !userAgentVersion || userAgentVersion >= 5 )){
                /* Make dragging false only when hideNode is fired for currentActive element. The order in which it is fired is in the order or its registration. */
                shouldHide = false;
                var node = e.data.node;
                //if(e.data.node[0] && e.target && $.contains(e.data.node[0],e.target)) p.c.menu.dragging = false;
                $(document.body).on("touchend.bodyone", {
                    node: e.data.node
                }, function(e) {
                        $(this).off(e);
                        p.c.menu.hideNode(e);
                    }
                );
            }
            return shouldHide;
        },

        renderNode: function(node, target, orientation, event) {
            p.c.menu.positionNode(node, target, orientation, event);

            /*BUG-189438:If the menu is launched from an overlay, create a dummy div so that the overlay doesn't dismiss when a menuitem is clicked*/
            var overlayElem = document.getElementById("_popOversContainer");
            if (overlayElem && $.contains(overlayElem, target) && !$.contains(overlayElem, document.getElementById("menuFromOverlay"))) {
                $(target).after("<div style='display:none' id='menuFromOverlay'></div>");
            }

            /*If showmenu is configured on a button in a modal, add a class so cleanup can be done after modal dismiss.*/
            if (pega && pega.u && pega.u.d && pega.u.d.modalDialog) {
                var modalElement = pega.u.d.modalDialog.body;
                if (modalElement && $.contains(modalElement, target)) {
                    //BUG-226121 : sliding menu check adding class to menu wrapping div
                    if (node.hasClass('menu-slider')) {
                        node.addClass("menu-in-modal");
                    } else {
                        node.parent().addClass("menu-in-modal");
                    }
                }
            }

            if (!$(target).hasClass("menu-item")) {
                //Native navigation
                if(pega.mobile && pega.mobile.nativenav){
                    node.backNavId = pega.mobile.nativenav.addAsCheckPoint(this.hideNode, this, {data:{node:node}});
                }
           
                $(document.body).on("click.bodyone contextmenu.bodyone", {
                    node: node
                }, function(e){
                        $(this).off(e);
                        p.c.menu.hideNode(e);
                    }
                );
                
                /*BUG-338460: Hide all open menus when browser forward or backward is clicked. */
                $(window).on("popstate", {
                    node: node
                }, function(e) {
                        $(this).off(e);
                        p.c.menu.hideNode(e);
                    }
                );
               
               $(document.body).on("touchend.bodyone", {
                    node: node
                }, function(e) {
                        $(this).off(e);
                        p.c.menu.hideNode(e);
                    }
                );
                
                if (!node.hasClass("menu-fullscreen")) {
                    var tempNode = node;
                    if (tempNode.hasClass("menu-slider")) {
                        tempNode = node.children().first();
                    }
                    p.c.menu.highlight(tempNode.children(".menu-item-enabled").first());
                }
            }
            if (node.attr("id") || (node.hasClass("menu-slider") && node.children(0).attr("id"))) {
                var nodeId = null;
                if (node.hasClass("menu-slider")) {
                    nodeId = node.children(0).attr("id");
                } else {
                    nodeId = node.attr("id");
                }
                if (!node.hasClass("menu-fullscreen")) {
                    $(window).on("resize." + nodeId.replace(/\$/ig, "_"), {
                        node: node,
                        target: target,
                        orientation: orientation
                    }, p.c.menu._positionNode);
                    //$(window).add("#PEGA_HARNESS, #HARNESS_CONTENT").on("scroll." + nodeId.replace(/\$/ig, "_"), {node: node, target: target, orientation: orientation}, p.c.menu._positionNode);
                    $(window).on("mousedown." + nodeId.replace(/\$/ig, "_"), {
                        node: node,
                        target: target,
                        orientation: orientation,
                        nodeId: nodeId
                    }, p.c.menu._handleMouseDown);
                    $(window).on("mousewheel wheel", {
                        node: node, 
                        target: target, 
                        orientation: orientation
                    } , function(e){
                            $(this).off(e);
                            p.c.menu._positionNode(e);
                        }
                    );
                    // TODO: Off
                    $(node).on("mousewheel." + nodeId.replace(/\$/ig, "_"), {
                        node: node,
                        target: target,
                        orientation: orientation
                    }, p.c.menu._positionNode);
                    //Dismiss menu on touchmove outside menu
                    //if (event && event.type == "touchend") {
                        $(window).on("touchmove", {
                            node: node,
                            target: target,
                            orientation: orientation
                        }, p.c.menu._positionNode);
                        // TODO: Off
                        $(node).on("touchmove", p.c.menu.handleTouchMove);
                        $(node).on("touchmove." + nodeId.replace(/\$/ig, "_"), {
                            node: node,
                            target: target,
                            orientation: orientation
                        }, p.c.menu._positionNode);
                    //}
                    //$(window).on("orientationchange." + node.attr("id").replace(/\$/ig, "_"), {node: node, target: target, orientation: orientation}, p.c.menu._positionNode);
                }
            }
        },

        _handleMouseDown: function(e) {
            if (e.target && e.data.nodeId && !$(e.target).hasClass("menu") && !$(e.target).hasClass("menu-slider")) { //Do not close if the scroll is in the menu
                $(e.target).on("scroll." + e.data.nodeId.replace(/\$/ig, "_"), {
                    node: e.data.node,
                    target: e.data.target,
                    orientation: e.data.orientation
                }, function(e) {
                        $(this).off(e);
                        p.c.menu._positionNode(e);
                    }
                );
            }
        },

        _positionNode: function(e) {
            if (e.originalEvent && e.originalEvent.menuMove == true)
                return;
            if (e.type == "scroll" || e.type == "mousewheel" || e.type == "touchmove" || e.type == "wheel") {
                if ($(e.currentTarget).hasClass("menu")) { // Do not hide if the wheel is moved when on menu
                    if (!(e.type == "touchmove")) //
                        e.stopImmediatePropagation(); // Also don't let event get to body.
                    else {
                        /* Reverting changes made for BUG-195704 (below) as it is acceptable for the page to scroll once the last item of the menu is reached.
                        //BUG-195704 : start , stop scrolling of background when moving the sub menus.
                        if(e.type == "touchmove" ){
                          e.preventDefault();
                        }
                        //BUG-195704 : end
                        */
                        if(e.originalEvent){
                            e.originalEvent.menuMove = true;
                        }
                    }
                } else if (pega.c.menu.dragging) {
                    if(e.originalEvent){
                        e.originalEvent.menuMove = true;
                    }
                    return;
                } else {
                    e.data.node.hide();
                }
            }

            if ($(e.data.node).get(0).offsetHeight > 0) {
                if ($(e.data.target).get(0).offsetHeight == 0) {
                    e.data.node.hide();
                    p.c.menu.detachNodeListeners(e.data.node);
                    return;
                }
                if (touchable) {
                    $(e.data.node).css({
                        top: 0,
                        left: 0
                    });
                }
                /*Donot reposition fullscreen menus*/
                if ((e.type == "resize" || e.type == "scroll") && !e.data.node.hasClass("menu-fullscreen")) {
                    if (!e.data.node.hasClass("menu-slider")) {
                        p.c.menu.positionNode(e.data.node.css("max-height", ""), e.data.target, e.data.orientation);
                    } else {
                        p.c.menu.positionNode(e.data.node, e.data.target, e.data.orientation);
                    }
                }
            } else {
                p.c.menu.detachNodeListeners(e.data.node);
            }
        },

        positionNode: function(node, target, orientation, event) {
            if (!p.c.menu.isElementInViewport(target)) {
                node.hide();
            } else if (node.length) {
                var subMenuAlignment = $.data($(node).get(0), "sub_menu_alignment"),
                    myPos = (subMenuAlignment == "right" ? "right top" : (isOrientationRTL && orientation == "vertical") ? "right top" : "left top"),
                    atPos = (subMenuAlignment == "right" ? "right bottom" : "left bottom"),
                    windowHeight = $(window).height(),
                    nodeParent = node.parent(),
                    maxHeight = (windowHeight <= (node.height() + 2)) ? (windowHeight + "px") : ""; //'+2' is the buffer while resizing.

                if (touchable) {
                    //BUG-359213 : preventing to add top style of the element is BODY
                    if(node.parent().length ==1 && node.parent()[0].tagName !== 'BODY'){
                      node.parent().css("top", "-999px");
                    }
                    maxHeight = windowHeight + "px";
                }

                node.show();
                if (node.hasClass("menu-fullscreen")) {
                    p.c.menu.animateFullScreen(node, "show");
                    return;
                }
                // If target element is an SVG element, position using the event's pageX and pageY values
                // Note that collision detection and other advanced positioning functionality will not work in this case
                if(target instanceof SVGElement) {
                  event && (node.parent().hasClass("menu-panel-wrapper") ? node.parent() : node).css({
                      top: event.pageY,
                      left: event.pageX
                  });
                } else {
                  (node.parent().hasClass("menu-panel-wrapper") ? node.parent() : node).position({
                      my: myPos,
                      at: (orientation == "horizontal" ? atPos : (isOrientationRTL) ? "left top" : "right top"),
                      of: target,
                      collision: "flipfit flipfit",
                      using: pega.c.menu.positionUsingFunc
                  });
                }
              /*
              BUG-576752: menu is not visible properly.
              When the node's height exceeds the windows height, set the top to 0
              and max-height to take window's innerHeight. 
              */
              if(node.parent().height() > windowHeight) {
                maxHeight = windowHeight - 25 + "px";
                node.parent().css("top", "0");
              }
                node.css('max-height', maxHeight);
            }
        },

      
  positionUsingFunc: function(event, ui) {
            if (!$(this).hasClass("menu-slider")) {
                var targetEl = ui.target.element.parent();

                if (targetEl.is("ul") && event.left > 0 && targetEl.get(0).scrollHeight > targetEl.height() + parseInt(targetEl.css('padding-top')) + parseInt(targetEl.css('padding-bottom')) + 2) { //'+2' is the buffer while resizing.
                    /*var borderWidth = parseInt(getComputedStyle(targetEl.get(0)).borderLeftWidth) + parseInt(getComputedStyle(targetEl.get(0)).borderRightWidth),*/
                    /*BUG-200931 : added to call p.c.menu.getComputedStyle if browser native getComputedStyles not available - starts*/
                    var borderWidth = parseInt(getComputedStyle(targetEl.get(0)).borderLeftWidth) + parseInt(getComputedStyle(targetEl.get(0)).borderRightWidth);
                   //removed BUG-200931 fix as fix was applicable for IE8
                    /*BUG-200931 : added to call p.c.menu.getComputedStyle if browser native getComputedStyles not available - ends*/
                   var parentMenu = targetEl[0].parentNode;
                  var shift = 0;
                  if(parentMenu){
                        var submenuPosition = parentMenu.offsetWidth + parentMenu.offsetLeft;
                        var availabeSpace = document.body.scrollWidth - submenuPosition;
                        
                        if(this.offsetWidth > availabeSpace){
                              shift = this.scrollWidth - availabeSpace + 5;
                        }
                    }
                    var scrollBarWidth = (targetEl.get(0).offsetWidth - targetEl.get(0).clientWidth) - borderWidth;
                   $(this).css("borderLeft", scrollBarWidth + "px solid transparent");
                    $(this).css("left", event.left - shift );
                } else {
                  
                    $(this).css("left", event.left);
                }
                if(event.top < 0 && Math.ceil((event.top*-1 - targetEl.parent().offset().top)) > 0){
                  event.top += (event.top*-1 - targetEl.parent().offset().top);
                }
                $(this).css("top", event.top);
            } else {
                $(this).css("left", event.left);
                $(this).css("top", event.top);
            }
        },

        animateFullScreen: function(node, state) {
            /*if(pega.util.Event.isIE && pega.util.Event.isIE<=9){
                if(state == "hide")
                    node.hide();
                return;
            }*/
            if (state == "show") {
                node.addClass("fullscreen-slideup");
                $(node).on(p.c.menu.getCrossBrowserAnimEvent("AnimationEnd"), function(e) {
                    $(this).off(e);
                    $(e.target).removeClass("fullscreen-slideup");
                });
            } else if (state == "hide") {
                if (node.get(0).style.display == "none") {
                    return;
                }
                node.addClass("fullscreen-slidedown");
                $(node).on(p.c.menu.getCrossBrowserAnimEvent("AnimationEnd"), function(e) {
                    $(this).off(e);
                    var node = $(e.target);
                    node.removeClass("fullscreen-slidedown");
                    node.hide();
                    if (node.hasClass("menu-slider")) {
                        node.children().first().css({
                            marginLeft: 0
                        });
                        node.find(".menu-slider-item-active").removeClass("menu-slider-item-active");
                        node.find(".menu-active").removeClass("menu-active");
                    }
                });
            }
        },

        getCrossBrowserAnimEvent: function(type) {
            if (pega && pega.env && pega.env.ua && pega.env.ua.webkit) {
                return "webkit" + type;
            } else if (pega && pega.env && pega.env.ua && pega.env.ua.opera) {
                return "o" + type;
            } else {
                return type.toLowerCase();
            }
        },

        detachNodeListeners: function(node) {
            var nodeId = null;
            if (node.hasClass("menu-slider")) {
                nodeId = node.children(0).attr("id");
            } else {
                nodeId = node.attr("id");
            }
            if (nodeId) {
                $(window).off("." + nodeId.replace(/\$/ig, "_"));
            }
        },

        /*This API is given for BUG-189292. Please striclty use other alternatives if possible as this API uses jQuery.closest() function which traverses up the DOM tree and might traverse upto the body if the intended element is not found.*/
        isInMenu: function(element) {
            return $(element).closest(".menu-item").length > 0;
        },

        /**
         * [isElementInViewport description]
         * @param  {[type]} element
         * @return {[boolean]}
         */
        isElementInViewport: function(element) {
            if (element instanceof jQuery) {
                element = element[0];
            }
            var rect = element.getBoundingClientRect();

            return (
                rect.top < $(window).height() &&
                rect.left < $(window).width() &&
                rect.bottom > 0 &&
                rect.right > 0
            );
        },

        /**
         * [hideSubLevel description]
         * @param  {[type]} menuItem
         * @return {[type]}
         */
        hideSubLevel: function(menuItem) {
            menuItem = $(menuItem);
            if(pega.u.automation && pega.u.automation.recorder && pega.u.automation.recorder.isRecording() && (menuItem.attr("data-recording") || menuItem.find('[data-recording]').length > 0)) {
                return;
            }
            //If the context manager has unregisterContextSwitching function, unregister the subMenu as it is getting hidden.
            if(pega.ctxmgr && typeof(pega.ctxmgr.unregisterContextSwitching) === "function" && menuItem.length > 0) {
                //Get the subMenu
                var subMenu = (menuItem.get(0)).querySelector("div.menu-panel-wrapper[data-harness-id]");
                if(subMenu){
                  pega.ctxmgr.unregisterContextSwitching(subMenu);
                }
            }
            /* Why menu-item-active is removed from parent menu */
            /* menuItem.removeClass("menu-item-active");*/
            menuItem.removeClass("menu-loading");
            var menuItemChildNode = p.c.menu.getChildNode(menuItem);
            $.data(menuItem.get(0), "hideChildNode", true);
            menuItemChildNode.hide();
            if (menuItemChildNode.attr("id")) {
                $(window).off("." + menuItemChildNode.attr("id").replace(/\$/ig, "_"));
            }
          
        },

        hideSubLevels: function(node) {
            var ele = $(node).find(".menu-item-active").addBack();
            $.each(ele, function() {
                if (p.c.menu.isMenuBar(this)) {
                    p.c.menu.hideSubLevel(this);
                    var childNode = p.c.menu.getChildNode(this);
                    p.c.menu.hideSubLevels(childNode);
                } else {
                    $(this).find('.menu-item-active').each(function() {
                        p.c.menu.hideSubLevel(this);
                    });
                }
            });
            $(node).find(".menu:visible").each(function() {
                $(this).hide().find(".menu-item-active").removeClass("menu-item-active").removeClass("menu-loading");
                if ($(this).attr("id")) {
                    $(window).off("." + $(this).attr("id").replace(/\$/ig, "_"));
                }
            });
        },

        /**
         * [trimData description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        trimData: function(data) {
            if (data.nodes && data.nodes.length == 1 && data.nodes[0].nodes && data.nodes[0].nodes.length > 0) {
                data.nodes = data.nodes[0].nodes ? data.nodes[0].nodes : data.nodes;
            }
            return data;
        },

        showContextMenu: function(config, target, event) {
            /*
                Set the showMenuTarget to override the events target in case of action executed on a menu item.
                This is to execute the action in the context of the section.
            */
            p.c.menu.showMenuTarget = target;
            var deferLoadNodes = $.data(p.c.menu.showMenuTarget, "deferLoadNodes");
            if (deferLoadNodes) {
                for (var i = 0; i < deferLoadNodes.length; i++) {
                    $(deferLoadNodes[i]).remove();
                }
            }
            isMobile = config.isMobile === "true" || config.isMobile === true;
            var menuid = $(target).attr("data-menuid");
            var previousConfig = $(p.c.menu.showMenuTarget).data("config");
            /*if(previousConfig && previousConfig.idSuffix && menuid && config.loadBehavior == "firstuse") {
                config.idSuffix = previousConfig.idSuffix;
            }*/
            if (!previousConfig) {
                $.data(p.c.menu.showMenuTarget, "config", config);
            }

            var skinConfig = p.c.menu.getSkinConfig(config.format);
            if (isMobile && skinConfig.fullscreen) {
                skinConfig.sliding = true;
            } else {
                skinConfig.fullscreen = false;
            }
            var nodeToRender = $("#" + menuid);
            if (skinConfig.sliding) {
                nodeToRender = nodeToRender.parent();
            }
            if (menuid && (config.loadBehavior == "firstuse" || config.loadBehavior == "screenload")) {
                p.c.menu.renderNode(nodeToRender, target, "horizontal", event);
                return;
            } else {
                if (!menuid) { /*get the menuid from the metadata's navpagename if the data-menuid on target is gone.*/
                    menuid = config.navPageName;
                    nodeToRender = $("#" + menuid);
                    if (skinConfig.sliding) {
                        nodeToRender = nodeToRender.parent();
                    }
                }
                /* Remove the created menu in case of refresh on display. */
                if (nodeToRender.parent().hasClass("menu-panel-wrapper")) {
                    nodeToRender.parent().remove();
                } else {
                    nodeToRender.remove();
                }
            }
            config.title = target.getAttribute("title");
            if (config.loadBehavior == "screenload") {
                /*Screen Load case the control no longer has a special attr. the navpage name comes from action JSON*/
                var navPageName = config.navPageName || $(target).attr("data-menu-nav-page");
                var JSONData = p.c.menu.constructDataObject({
                    navPage: navPageName,
                    navName: config.navName
                });
                p.c.menu.createAndRenderContextMenu(JSONData, config, target, event);
                return;
            }

            /* Make AJAX request in case of refresh on display. */
            var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
            strUrlSF.put("pyActivity", "pzGetMenu");
            strUrlSF.put("navName", config.dataSource);
            /*BUG-216299:Setting the pzKeepPageMessages to true to persist the error message when a menu is opened */
            strUrlSF.put("pzKeepPageMessages", "true");
            if (config.navPage) {
                strUrlSF.put("navPageName", config.navPage);
                config.idSuffix = "_" + duplicateIdSequencer++;
            }
           /*US-121032 removing the clipboard pages, if the menu is not defer loaded*/
            strUrlSF.put("removePage", config.isNavNLDeferLoaded === "false" ? true : false);
            //strUrlSF.put("removePage", false);
            if(config.isTemplatizedGrid){
              strUrlSF.put("isTemplatizedGrid", config.isTemplatizedGrid);
            }
            if(config.UITemplatingStatus ){
              strUrlSF.put("UITemplatingStatus", "Y");
            }
            if (config.ContextPage) {
                strUrlSF.put("ContextPage", config.ContextPage);
            }
            if (config.deferLoad) {
                strUrlSF.put("bDeferLoad", config.deferLoad);
            }

            if (config.pzPrimaryPageName) {
                strUrlSF.put("pzPrimaryPageName", config.pzPrimaryPageName);
            }
            strUrlSF.put("showmenucall", "true");
            if (config.navPageName) {
                strUrlSF.put("navPageName", config.navPageName);
            }
            var callback = {
                success: function(response) {
                    var JSONData = null;
                    try {
                      /*BUG-292121: replaced pega.u.d.isHybridClient with pega.offline */
                        if(pega.u.d.ServerProxy.isDestinationLocal()) {
                          JSONData = p.c.menu.constructDataObject({
                                navPage: config.navPageName
                            }); //, navName: JSONData.menuDesc});
                        } else {
                            /* Added below code to extract skeleton and pass over JSON to generate Contect Menu EPIC-30602 - Start */
                            if(response.responseText){                              
                              if(response.responseText.indexOf("class=\"skeleton\"") > 0){
                                var startIndexForSkeletonMarkup = response.responseText.indexOf("<div");
                                if(startIndexForSkeletonMarkup>0){
                                  var skeletonMarkup = response.responseText.substring(startIndexForSkeletonMarkup-4);
                                  var nodeToInsert = document.createElement("DIV");
                                  nodeToInsert.innerHTML = skeletonMarkup;
                                  var elementNode = nodeToInsert.getElementsByClassName("skeleton");
                                  if(elementNode && elementNode.length>0){
                                    var elementToInsert = "";
                                    for (var i = 0; i < elementNode.length; i++){
                                      if(!document.getElementById(elementNode[i].id))
                                        elementToInsert += elementNode[i].outerHTML;
                                    }
                                    response.responseText = response.responseText.substring(0, startIndexForSkeletonMarkup-4).trim();
                                    $('body').append(elementToInsert);
                                    elementToInsert = null;
                                  }
                                }
                              }                                                          
                            }
                            /* Added below code to extract skeleton and pass over JSON to generate Contect Menu EPIC-30602 - End */
                            JSONData = JSON.parse(response.responseText);
                        }
                    } catch (e) {
                        try{
                          JSONData = pega.c.eventParser.parseJSON(response.responseText);
                        } catch (ex){
                          if (console) {
                            console.log("Exception occured while parsing JSON");
                          }
                          return;                          
                        }
                      if (console) {
                            console.log("Exception in parsing JSON");
                        }
                        return;
                    }
                    p.c.menu.createAndRenderContextMenu(JSONData, config, target, event);
                    deferLoadRequest = null;
                },
                failure: function(response) {
                    var posObj = {
                        x: pega.util.Event.getPageX(event),
                        y: pega.util.Event.getPageY(event),
                        relativeElement: target,
                        align: config.menuAlign,
                        pyFormat: config.format,
                        maxChars: config.ellipsisAfter,
                        usingPage: config.usingPage
                    };
                    pega.u.contextMenu.renderContextMenu(posObj, config.dataSource, config.className, event);
                },
              isJSONTypeResponse: true

            };
          
            pega.u.d.ServerProxy.doAction(strUrlSF, null, {
                online: function() {
                    deferLoadRequest = pega.u.d.asyncRequest("POST", strUrlSF, callback);
                },
                offline: function() {
                    //callback.success();
                }
            });
        },

        /**
         * [createAndRenderContextMenu description]
         * @param  {[type]} JSONData
         * @param  {[type]} config
         * @param  {[type]} target
         * @return {[type]}
         */
        createAndRenderContextMenu: function(JSONData, config, target, event) {
            JSONData = p.c.menu.trimData(JSONData);
            if (JSONData.nodes && JSONData.nodes.length > 0) {

                if (pega.mobile && pega.mobile.sdk && pmcRuntimeFeatures.pxUsesActionSheets) {
                    p.c.menu.createAndRenderMobileActionSheet(JSONData.nodes, target);
                    return;
                }

                var metadata = {
                    format: config.format,
                    maxWidth: config.ellipsisAfter,
                    idSuffix: config.idSuffix,
                    title : config.title
                };

                var skinConfig = p.c.menu.getSkinConfig(config.format);
                if (isMobile && skinConfig.fullscreen) {
                    skinConfig.sliding = true;
                } else {
                    skinConfig.fullscreen = false;
                }
                $.extend(metadata, skinConfig);

                p.c.menu.createSubLevels({
                    nodes: [JSONData]
                }, $.extend({
                    contextMenuFirstLevel: true
                }, metadata));
                $.data($("#" + JSONData.menuid).get(0), "sub_menu_alignment", config.menuAlign);
                var nodeToRender = $("#" + JSONData.menuid);
                if (metadata.sliding) {
                    nodeToRender = nodeToRender.parent();
                }
                p.c.menu.renderNode(nodeToRender, target, "horizontal", event);
                $(target).attr("data-menuid", JSONData.menuid);
            }
            //removed BUG-173747 Fix as it was applicable for IE8.
        },

        /**
         * [createAndRenderMobileActionSheet description]
         * @param  {[type]} nodes
         * @return {[type]}
         */
        createAndRenderMobileActionSheet: function(nodes, target) {
            var menuItems = nodes.filter(function(node) {
                return node.separator !== "true";
            }).map(function(node) {
                return {
                    "title": node.pyCaption,
                    "userInfo": {
                        "actionString": JSON.stringify(node["data-click"]),
                        "nodes": node.nodes
                    }
                }
            });
            pega.mobile.sdk.ui.showActionSheet(menuItems).then(function(selectedUserInfo) {
                if (selectedUserInfo.nodes && selectedUserInfo.nodes.length > 0) {
                    p.c.menu.createAndRenderMobileActionSheet(selectedUserInfo.nodes, target);
                    return;
                }
                if (selectedUserInfo.actionString) {
                    var eventSource = document.createElement('a');
                    eventSource.style.display = 'none';
                    eventSource.setAttribute('data-click', selectedUserInfo.actionString);
                    eventSource.setAttribute('href', '#');
                    target.appendChild(eventSource);
                    eventSource.click();
                }
            }).catch(function(error){ 
              if (error) console.log(error.message)
            });
        },

        /**
         * [deferLoadNode description]
         * @param  {[type]}  menuItem
         * @param  {[type]}  menuBarNode
         * @return {[type]}
         */
        deferLoadNode: function(menuItem, menuBarNode, fromMenuBar) {

            var metadata = null;
            if (menuBarNode && menuBarNode.get(0)) {
                metadata = metadataMap[$(menuBarNode).attr("id")];
            } else {
                metadata = $.data(p.c.menu.showMenuTarget, "config");
                /*START: BUG-192854*/
                $.extend(metadata, p.c.menu.getSkinConfig(metadata.format));
                if (isMobile && metadata.fullscreen) {
                    metadata.sliding = true;
                } else {
                    metadata.fullscreen = false;
                }
                /* END: BUG-192854 */
            }


            /* metadata is not set on the node if it is not defer loaded. */
            if (!metadata) {
                return true;
            }
            //added standard check for offline case
            if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
                return metadata.sliding ? false : true;
            }

            var bNodeDefer = menuItem.attr("isdeferload") == "true" ? true : false;
            var bPrivDeferLoad = p.c.menu.isPrevDeferLoad(menuItem, menuBarNode);
            var subLevelNode = $(p.c.menu.getChildNode(menuItem));

            if (subLevelNode.get(0)) {
                if (!bPrivDeferLoad && bNodeDefer) {
                    if (subLevelNode.parent().hasClass("menu-panel-wrapper")) {
                        subLevelNode.parent().remove();
                    } else {
                        subLevelNode.remove();
                    }
                } else {
                    return metadata.sliding ? false : true;
                }
            }


            menuItem.addClass("menu-loading");

            var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
            strUrlSF.put("pyActivity", "pzGetMenu");
            if (metadata.navName || metadata.dataSource) {
                strUrlSF.put("navName", metadata.navName || metadata.dataSource);
            }
            if (metadata.navPage || metadata.navPageName) {
                strUrlSF.put("navPageName", metadata.navPage || metadata.navPageName);
            }
            if (metadata.ContextPage) {
                strUrlSF.put("ContextPage", metadata.ContextPage);
            }
            strUrlSF.put("removePage", false);
            if (!(menuBarNode && menuBarNode.get(0))) {
                strUrlSF.put("showmenucall", "true");
            }

            strUrlSF.put(bNodeDefer ? "bNodeDeferLoad" : "bDeferLoad", true);

            if (metadata.usingPage || metadata.pzPrimaryPageName) {
                strUrlSF.put("pzPrimaryPageName", metadata.usingPage || metadata.pzPrimaryPageName);
            }
            var handle = menuItem.attr("data-childnodesid");
            if (handle.lastIndexOf("_") != -1) {
                handle = handle.substring(0, handle.lastIndexOf("_"));
            }
            strUrlSF.put("navEntryHandle", pega.ui.property.toReference(handle));

            var callback = {
                success: function(responseObj) {
                    
                    if(responseObj && responseObj.responseText && responseObj.responseText.trim().indexOf("<div template-scripts>") == 0) {
                        var respNode = responseObj.responseText;
                        var div = document.createElement('div');
                        div.innerHTML = respNode;
                        pega.u.d.extractTemplateScripts(div, function(){});
                    }
                    
                    
                    //var origSubLevelData = JSON.parse(responseObj.responseText);
                    var subLevelData;
                    try {
                       if (pega.u.d.ServerProxy.isDestinationLocal() || (menuBarNode && menuBarNode.get(0))) {
                            subLevelData = p.c.menu.constructDataObject({
                                navPage: handle
                            }); //, navName: origSubLevelData.menuDesc});
                        } else {
                            subLevelData = JSON.parse(responseObj.responseText);
                            if (subLevelData.nodes.length == 0) {
                                //var topLevelNavPage = pega.ui.ClientCache.find(metadata.navPageName);
                                //var topLevelNavPage = navPage.getTopLevelPage();
                                var newObj = {};
                                newObj["pyCaption"] = subLevelData.menuNoItemsMessage;
                                subLevelData.nodes.push(newObj);
                            }
                        }
                    } catch (ex) {
                        if (console) {
                            console.log("Exception in parsing JSON");
                        }
                        return;
                    }

                    subLevelData.pxEntryHandle = handle;
                    subLevelData.pyCaption = subLevelData.pyCaption || subLevelData.menuDesc;

                    var nodeObject = $(p.c.menu.createSubLevel(subLevelData, metadata.sliding ? $.extend({
                        parentHeader: subLevelData.pyCaption
                    }, metadata) : metadata));
                    nodeObject = $(nodeObject);

                    // register harness context switching
                    if(nodeObject.length) {
                        pega.ctxmgr.registerContextSwitching(nodeObject.get(0));
                    }

                    $(metadata.sliding ? menuItem : (fromMenuBar ? document.body : menuItem)).append(nodeObject);

                    if (menuBarNode && menuBarNode.get(0)) {
                        if (bNodeDefer) {
                            var deferLoadNodes = $.data(menuBarNode.get(0), "deferLoadNodes");
                            if (!deferLoadNodes) {
                                deferLoadNodes = $.data(menuBarNode.get(0), "deferLoadNodes", []);
                            }
                            deferLoadNodes.push(nodeObject);
                        }
                    } else { //showmenu defer load nodes references to be deleted once menu hides
                        var deferLoadNodes = $.data(p.c.menu.showMenuTarget, "deferLoadNodes");
                        if (!deferLoadNodes) {
                            deferLoadNodes = $.data(p.c.menu.showMenuTarget, "deferLoadNodes", []);
                        }
                        deferLoadNodes.push(nodeObject);
                    }

                    deferLoadRequest = null;

                    if (!metadata.sliding) {
                        p.c.menu.setupMenuAim(nodeObject.hasClass("menu-panel-wrapper") ? nodeObject.find(".menu") : nodeObject.parent().find(".menu"));
                        p.c.menu.showSubLevel(menuItem);
                    } else {
                        p.c.menu.slideToNextLevel(menuItem);
                        p.c.menu.positionFullscreenMenuSlide(menuItem);
                        try {
                            //nodeObject.children().first().children(".menu-item-anchor").focus();
                        } catch (ex) {}
                    }

                    menuItem.removeClass("menu-loading");

                    return true;

                }
            };

            pega.u.d.ServerProxy.doAction(strUrlSF, null, {
                online: function() {
                    deferLoadRequest = pega.u.d.asyncRequest("POST", strUrlSF, callback);
                },
                offline: function() {
                    //callback.success();
                }
            });
            return false;
        },

        isPrevDeferLoad: function(menuItem, menuBarNode) {
            var deferLoadNodes;
            var childNodeId = menuItem.attr("data-childnodesid");
            if (menuBarNode && menuBarNode.get(0)) {
                deferLoadNodes = $.data(menuBarNode.get(0), "deferLoadNodes");
            } else {
                deferLoadNodes = $.data(p.c.menu.showMenuTarget, "deferLoadNodes");
            }
            if (deferLoadNodes) {
                for (var i = 0; i < deferLoadNodes.length; i++) {
                    if ($(deferLoadNodes[i]).children().attr("id") == childNodeId) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        },

        /**
         * [getMenuBarNode description]
         * @param  {[type]} node
         * @return {[type]}
         */
        getMenuBarNode: function(node) {
            if (node.hasClass("menu-bar")) {
                return node;
            } else {
                return $(document.getElementById(node.attr("data-menuid")));
            }
        },

        /**
         * [getChildNode description]
         * @param  {[type]} menuItem
         * @return {[type]}
         */
        getChildNode: function(menuItem) {
            var childNode = $(menuItem).find("[id='" + $(menuItem).attr("data-childnodesid") + "']");
            if (childNode.length > 0) {
                return childNode;
            }
            return $(document.getElementById($(menuItem).attr("data-childnodesid")));
        },
         /*BUG-219504 bug fix*/
         handleVerticalMenuItemClick: function(e) {
           if($(e.target).parents('.menu-vertical').length>0)
            {
               $(".menu-format-slidingmenu [id^='pyNavigation']").each(function(){
                 $(this).parent().css("display","none");
             }); 
              
              $(".menu-horizontal .menu-item-active").each(function(){
                 var childAttr=$(this).attr("data-childnodesid")
                 if(childAttr){
                  document.getElementById(childAttr).style.display = 'none';
                 }
                /* Why menu-item-active is removed from horizontal menu when vertical menu is clicked */
                 /* $(this).removeClass("menu-item-active"); */
             });
              var menuItem = $(e.target).closest('.menu-item');
              p.c.menu.setState(menuItem,false);
          }
        },
         /*BUG-219504 bug fix end*/

        /**
         * [handleMenuBarItemClick description]
         * @param  {[type]} e
         * @return {[type]}
         */
        handleMenuBarItemClick: function(e) {
            var menuItem = $(this).parent();
            p.c.menu.hideSubLevels(menuItem.parent());
            /*
                The timeout is to handle cases of double clicking on the same menu item.
                The previously attached handler to hide always executes and there seems to be no OOTB JQuery way to remove it for the same event.
                Will revisit later and see if timeout can be avoided.
            */
            var menuBarNode = p.c.menu.getMenuBarNode(menuItem.parent());
            menuBarNode = $(menuBarNode.get(0)).parent();
            var deferLoadNodes = $.data(menuBarNode.get(0), "deferLoadNodes");
            if (deferLoadNodes) {
                for (var i = 0; i < deferLoadNodes.length; i++) {
                    $(deferLoadNodes[i]).remove();
                }
            }
            $(menuBarNode).removeData("deferLoadNodes");
            setTimeout(function() {
                p.c.menu.getAndShowSubLevel(menuItem);
                /*if(pega.mobile && pega.mobile.nativenav){
                  menuBarNode.backNavId = pega.mobile.nativenav.addToHistoryAndBlock(pega.c.menu.killMenus, pega.c.menu, {data:{parentMenu:menuBarNode}});
                }*/
            }, 0);

            if (touchable) {
                /* Stop the event propagation if childnodes are present and hence do not execute the action. */
                if (menuItem.attr("data-childnodesid")) {
                    //BUG-195012 :start , Before stopping the event , do a sendEvent
                    if (pega && pega.desktop && pega.desktop.MouseEventSingleton) {
                        var obj = new pega.desktop.MouseEventSingleton();
                        obj._doOnMouseClick(e);
                        //pega.d.sendEvent("DesktopMouseClick", eventObj, "ASYNC");
                    }
                    //BUG-195012 : end
                  
                    //Registering for back button navigation
                    if(pega.mobile && pega.mobile.nativenav){
                        menuBarNode.backNavId = pega.mobile.nativenav.addToHistoryAndBlock(pega.c.menu.killMenus, pega.c.menu, {data:{parentMenu:menuBarNode}});
                    }
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    pega.c.menu.killMenus();
                }
            }
            $(document.body).on("click.bodyone contextmenu.bodyone", {
                    menuItem: menuItem,
                    menuBarNode : menuBarNode
                }, function(e) {
                    $(this).off(e);
                    if(!touchable){
                        p.c.menu.hideSubLevel(e.data.menuItem);
                    }else{
                        /*
                            This is to unhighlight the item with no children and hide the sublevels for items with children.
                        */
                        p.c.menu.hideSubLevelDragCheck(e);
                        //For native navigation. Removing the menu panel events from queue
                        if(pega.mobile && pega.mobile.nativenav){
                           pega.mobile.nativenav.removeFromHistory(e.data.menuBarNode.backNavId);
                        }
                    }
                });
            p.c.menu.setState(menuItem,false);
        },

        touchcount: 0,

        handleTouchStart: function(e) {
            pega.c.menu.touchcount++;
        },

        /**
         * [handleTouchEnd description]
         * @param  {[type]} e
         * @return {[type]}
         */
        handleTouchEnd: function(e) {
            pega.c.menu.isFromTouchEvent = true;
            var menuItem = p.c.menu.currentActive = $(this).parent();
            p.c.menu.hideSubLevels(menuItem.parent());
            p.c.menu.getAndShowSubLevel(menuItem);
            /* Stop the event propagation if childnodes are present and hence do not execute the action. */
            if (menuItem.attr("data-childnodesid")) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }

            $(document.body).on("touchend.bodyone", {
                menuItem: menuItem
            }, function(e) {
                /*
                    This is to unhighlight the item with no children and hide the sublevels for items with children.
                */
                $(this).off(e);
                p.c.menu.hideSubLevelDragCheck(e);
            });
            
            
          if(pega.cl.isTouchAble()){setTimeout(function(){pega.c.menu.isFromTouchEvent = false;},1);}
          p.c.menu.setState(menuItem,false);
        },

        hideSubLevelDragCheck: function(e) {
            var target = e.data.menuItem;
            if (!p.c.menu.dragging) {
                p.c.menu.hideSubLevel(e.data.menuItem);
            } else {
                /* Make dragging false only when hideNode is fired for currentActive element. The order in which it is fired is in the order of its registration. */
                if (target[0] == p.c.menu.currentActive[0]) p.c.menu.dragging = false;
                $(document.body).on("touchend.bodyone", {
                    menuItem: e.data.menuItem
                }, function(e) {
                        $(this).off(e);
                        p.c.menu.hideSubLevelDragCheck(e);
                    }
                );
            }
        },

        dragging: false,

        handleTouchMove: function(e) {
          //BUG-297955 : fix to avoid flag setting for touchmove on fullscreen menu header
          var isNonMenuItemTouchMove = $(e.target).parent().hasClass('menu-slide-back-anchor');
          if(!isNonMenuItemTouchMove)
            pega.c.menu.dragging = true;
        },
        handleRegularItemClick:function(e){
          var menuItem = $(this).parent();
          /*Do not fire menu action if dragging is true.*/
          if(pega.c.menu.dragging || (e.originalEvent && e.originalEvent.pointerType=="touch" && menuItem.attr("data-childnodesid"))){
            e.stopImmediatePropagation();
            e.preventDefault();
            if(pega.c.menu.dragging) {
              pega.c.menu.dragging = false;
            }
          }
          p.c.menu.setState(menuItem,false);
        },
        /**
         *  This method completes the sliding into next level for the supplied menu item
         */
        slideToNextLevel: function(menuItem, ev) {
            var menuNode = menuItem.parent();
          
            if(pega.mobile && pega.mobile.nativenav && ev != undefined && $("ul > li", menuItem).get(0)){
                $.data($("ul > li", menuItem).get(0), "backNavId", pega.mobile.nativenav.addToHistory(pega.c.menu.nativeSlideBack, this, menuItem));
            }
          
            if (menuNode.closest(".menu-slider").hasClass("menu-fullscreen")) {
                menuItem.siblings().find(".menu-slider-item-active").addBack().removeClass("menu-slider-item-active");
            }
            menuItem.addClass("menu-slider-item-active");
            menuNode.addClass("menu-active");
            if (isOrientationRTL) {
                $(menuItem).closest(".menu-slider").children().first().css({
                    marginRight: "-" + (($(menuItem).parentsUntil(".menu-slider > .menu-bar, .menu-slider > .menu", ".menu").length + 1) * 100) + "%"
                });
            } else {
                $(menuItem).closest(".menu-slider").children().first().css({
                    marginLeft: "-" + (($(menuItem).parentsUntil(".menu-slider > .menu-bar, .menu-slider > .menu", ".menu").length + 1) * 100) + "%"
                });
                if (ev != undefined) {
                    ev.type == "keydown" && setTimeout(function() {
                        menuItem.children('.menu').children().eq(2).addClass('menu-item-active').children('.menu-item-anchor').first().focus();
                    }, 100);
                }

            }
        },
      
      
        //Native navigation
        nativeSlideBack: function(node){
            pega.c.menu.handleMenuSlide.apply($(".menu-item-anchor.menu-slide-back-anchor",node).get(0));
        },
        //

        /**
         * [handleMenuSlide description]
         * @param  {[type]} e
         * @return {[type]}
         */
        handleMenuSlide: function(e) {
            
            var menuItem = $(this).parent();
            if (($(menuItem[0]).siblings()[0]) != undefined) {
                var menuItemWithBackNavId = $(menuItem[0]).siblings()[0];
            }
            
            if(!e){
                e = {};
            }
            
            var menuNode = menuItem.parent();

            var keyCodes = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                ESCAPE: 27,
                ENTER: 13,
                TAB: 9
            };

            var shiftKey = e.shiftKey;

            if (e.type == "keydown") {
                switch (e.keyCode) {
                    case keyCodes.UP:
                        /*Not calling p.c.menu.highlightPrevious(menuItem, true) as it was giving other errors.*/
                        var prevElement = menuItem.prevAll('.menu-item').not('.menu-item-disabled').first();
                        menuItem.hasClass('menu-item-active') && menuItem.removeClass('menu-item-active');
                        menuItem.children('.menu-item-anchor').first().prop("tabindex", "-1");
                    
                        if (prevElement.length) {
                            prevElement.addClass('menu-item-active');
                            prevElement.children('.menu-item-anchor').first().prop("tabindex", "0");
                            prevElement.children('.menu-item-anchor').first().focus();
                        } else {
                          var lastAnchorElement = menuItem.parent().children('.menu-item')
                              .not('.menu-item-disabled').last().addClass('menu-item-active')
                              .children('.menu-item-anchor').first();
                            lastAnchorElement.focus();
                            lastAnchorElement.prop("tabindex", "0");
                        }
                        e.preventDefault();
                        return;
                    case keyCodes.DOWN:
                        /*Not calling p.c.menu.highlightNext(menuItem, true) as it was giving other errors. */
                       var nextElement = menuItem.nextAll('.menu-item').not('.menu-item-disabled').first();
                        menuItem.hasClass('menu-item-active') && menuItem.removeClass('menu-item-active');
                        menuItem.children('.menu-item-anchor').first().prop("tabindex", "-1");
                        if (nextElement.length) {
                            nextElement.addClass('menu-item-active');
                            nextElement.children('.menu-item-anchor').first().prop("tabindex", "0");
                            nextElement.children('.menu-item-anchor').first().focus();
                        } else {  
                          var firstElement = menuItem.parent().children('.menu-item')
                              .not('.menu-item-disabled').first().addClass('menu-item-active')
                              .children('.menu-item-anchor').first();
                          firstElement.prop("tabindex", "0");
                          firstElement.focus();
                        }
                        e.preventDefault();
                        p.c.menu.setState(menuItem,false);
                        return;
                    case keyCodes.LEFT:
                        break;
                    case keyCodes.RIGHT:
                        break;
                    case keyCodes.TAB:
                    menuItem.hasClass('menu-item-active') && menuItem.removeClass('menu-item-active');
                    return;
                    case keyCodes.ENTER:
                        break;
                    default:
                        e.preventDefault();
                        return;
                }
            }
            if ((e.type == "click" || e.type == "keydown") || (touchable && pega.c.menu.touchcount == 1) || $.data(menuItem[0],"backNavId") || (menuItemWithBackNavId && $(menuItemWithBackNavId).data())) {
                pega.ui.statetracking.setBusy("handleMenuSlide"); // inform test tools and time tracker menus busy - big help to UIRegression portal tests

                if ($(this).hasClass("menu-slide-back-anchor")) {
                    if (e.type == "keydown" && [13, 37].indexOf(e.keyCode) < 0) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        return;
                    }
                    if (!$(e.target).hasClass("menu-full-close-icon")) {
                        if (!menuNode.closest(".menu-slider").hasClass("menu-fullscreen")) {
                            menuNode.parent().removeClass("menu-slider-item-active").removeClass('menu-item-active');
                        }
                        menuNode.parent().parent().removeClass("menu-active");
                        if (isOrientationRTL) {
                            $(menuItem).closest(".menu-slider").children().first().css({
                                marginRight: "-" + (($(this).parentsUntil(".menu-slider > .menu-bar, .menu-slider > .menu", ".menu").length - 1) * 100) + "%"
                            });
                        } else {
                            $(menuItem).closest(".menu-slider").children().first().css({
                                marginLeft: "-" + (($(this).parentsUntil(".menu-slider > .menu-bar, .menu-slider > .menu", ".menu").length - 1) * 100) + "%"
                            });
                        }
                        try {
                            /* Focus the first anchor from the parent menu. */
                            if(menuItem.hasClass('menu-item-active')) {
                              menuItem.removeClass('menu-item-active');
                              $(this).closest(".menu").parent().addClass('menu-item-active').children(".menu-item-anchor").focus();
                            }
                           /* if (e.type == "keydown") { */
                                /* $(this).closest(".menu").parent().parent().children(".menu-item-enabled").first().addClass('menu-item-active').children(".menu-item-anchor").focus(); */
                          
                          /* set focus on the parent item and make it active */
                          
                            /*}*/
                        } catch (ex) {}
                        if(e.stopImmediatePropagation){
                           e.stopImmediatePropagation();
                           e.preventDefault();  
                        }
                        p.c.menu.setState(menuItem,false,true);
                      
                        
                        if(pega.mobile && pega.mobile.nativenav){
                            pega.mobile.nativenav.removeFromHistory($.data(menuItem[0],"backNavId"));
                            $.data(menuItem[0],"backNavId","");
                        }
                    }

                } else {
                    if (pega.c.menu.dragging) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        pega.c.menu.dragging = false;
                    } else if (menuItem.attr("data-childnodesid")) {
                        if (e.type == "keydown" && [13, 39].indexOf(e.keyCode) < 0) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            return;
                        }
                        menuItem.hasClass('menu-item-active') && menuItem.removeClass('menu-item-active');
                        if (!menuItem.children(".menu").get(0)) {
                            p.c.menu.getAndShowSubLevel(menuItem);
                        } else {
                            var menuListItems = menuItem[0].querySelectorAll('.menu-item');
                            var targetMenuItem;
                            if(menuListItems !== undefined){
                              menuListItems.forEach(function(element){
                                if(element.classList.length === 1 && !(element.getAttribute('title'))){
                                  targetMenuItem = element;
                                }
                              })
                            }
                            if(targetMenuItem){
                              targetMenuItem.setAttribute('aria-hidden', 'true');
                            }
                            p.c.menu.slideToNextLevel(menuItem, e);
                            p.c.menu.positionFullscreenMenuSlide(menuItem);
                            //e.type == "keydown" && menuItem.children('.menu').children().eq(2).addClass('menu-item-active').children('.menu-item-anchor').first().focus();
                        }
                        e.stopImmediatePropagation();
                        e.preventDefault();     
                    }
                  
                    //BUG-372545 : When creating case we are removing menu item from back navigation history.
                    if (pega.mobile && pega.mobile.nativenav && !menuItem.children(".menu").get(0)) {
                        if (menuItemWithBackNavId != undefined) {
                            pega.mobile.nativenav.removeFromHistory($.data(menuItemWithBackNavId, "backNavId"));
                            $.data(menuItemWithBackNavId, "backNavId", "");
                        }
                    }
                  
                    p.c.menu.setState(menuItem,false);
                }
                //BUG-308293: if the button which launched full screen menu is behind the close icon, then do e.preventDefault
                if($(e.target).hasClass("menu-full-close-icon")) {
                    e.preventDefault();
                }
              
                pega.c.menu.touchcount = 0;
                pega.ui.statetracking.setDone();
                
              
            } else {
                if (pega.c.menu.dragging) {
                    pega.c.menu.dragging = false;
                }
                pega.c.menu.touchcount = 0;
                e.stopImmediatePropagation();
                e.preventDefault();  
                return;
            }
            

        },

        positionFullscreenMenuSlide: function(menuItem) {
            try {
                //menuItem.children(".menu").children().first().children(".menu-item-anchor").focus();
                if (menuItem.closest(".menu-slider").hasClass("menu-fullscreen")) {
                    menuItem.children(".menu").css({
                        marginTop: 0,
                        marginLeft: 0,
                        width: "auto"
                    });

                    var btw = p.c.menu.getComputedStyle(menuItem.get(0), "border-top-width");
                    btw = (btw && btw != "") ? (isNaN(parseInt(btw)) ? 0 : parseInt(btw)) : 0;
                    var brw = p.c.menu.getComputedStyle(menuItem.get(0), "border-right-width");
                    brw = (brw && brw != "") ? (isNaN(parseInt(brw)) ? 0 : parseInt(brw)) : 0;
                    var blw = p.c.menu.getComputedStyle(menuItem.get(0), "border-left-width");
                    blw = (blw && blw != "") ? (isNaN(parseInt(blw)) ? 0 : parseInt(blw)) : 0;

                    menuItem.children(".menu").css({
                        marginTop: (-1 * (menuItem.get(0).offsetTop + btw)) + "px",
                        marginLeft: brw + "px",
                        width: "calc(100% + " + (brw + blw) + "px)"
                    });
                }
            } catch (ex) {}
        },

        /**
         * [handleKeyPress description]
         * @param  {[type]} e
         * @return {[type]}
         */
        handleKeyPress: function(e) {

            var menuItem = $(this).parent();
            var menuBarNode = p.c.menu.getMenuBarNode(menuItem.parent());
            var orientation = "vertical";
            if (menuBarNode.get(0) && menuBarNode.hasClass("menu-bar") && menuBarNode.hasClass("menu-horizontal")) {
                orientation = "horizontal";
            }

            var isMenuBar = p.c.menu.isMenuBar(menuItem);

            var keyCodes = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                ESCAPE: 27,
                ENTER: 13,
                TAB: 9
            };

            var shiftKey = e.shiftKey;

            switch (e.keyCode) {
                case keyCodes.LEFT:                    
                    if (isMenuBar) {
                        if (orientation == "horizontal") {
                            p.c.menu.highlightPrevious(menuItem, true);
                        } else {
                            p.c.menu.handleRTLkeyPress(true, menuItem);
                        }
                    } else {
                        /**
                        isSubLevelOpened variable to hold value to determine whether sublevel is already opened or not. This is added as part of fix for BUG-245181
                        Sublevel was opening two times in this scenario. isSubLevelOpened check is added to prevent this. So that sublevel will open once.
                        Ideally this is not the proper fix. This is more like a workaround. Code should be refactored to handle key events for both RTL and non-RTL cases.
                        **/
                        var isSubLevelOpened = false;
                        if (orientation == "vertical" || !p.c.menu.isMenuBarItemChild(menuItem)) {
                            isSubLevelOpened = p.c.menu.handleRTLkeyPress(true, menuItem);
                        }

                        if (isOrientationRTL && !isSubLevelOpened) {
                            p.c.menu.openSubLevel(menuItem);
                        }
                    }
                    e.preventDefault();
                    break;
                case keyCodes.RIGHT:
                    if (isMenuBar) {
                        if (orientation == "horizontal") {
                            p.c.menu.highlightNext(menuItem, true);
                        } else {
                            p.c.menu.handleRTLkeyPress(false, menuItem);
                        }
                    } else {
                        var isSubLevelOpened = false;
                        if (orientation == "vertical" || !p.c.menu.isMenuBarItemChild(menuItem)) {
                            isSubLevelOpened = p.c.menu.handleRTLkeyPress(false, menuItem);
                        }

                        if (!isOrientationRTL && !isSubLevelOpened) {
                            p.c.menu.openSubLevel(menuItem);
                        }
                    }
                    e.preventDefault();
                    break;
                case keyCodes.UP:
                    if (isMenuBar) {
                        if (orientation == "horizontal") {
                            //Do nothing.
                        } else {
                            p.c.menu.highlightPrevious(menuItem, true);
                        }
                    } else {
                        if (menuItem.is(":first-child") && p.c.menu.isMenuBarItemChild(menuItem) && orientation == "horizontal") {
                            p.c.menu.closeCurrentLevel(menuItem);
                        } else {
                            p.c.menu.highlightPrevious(menuItem, true);
                        }
                    }
                    e.preventDefault();
                    break;
                case keyCodes.DOWN:
                    if (isMenuBar) {
                        if (orientation == "horizontal") {
                            p.c.menu.openSubLevel(menuItem);
                        } else {
                            p.c.menu.highlightNext(menuItem, true);
                        }
                    } else {
                        p.c.menu.highlightNext(menuItem, true);
                    }
                    e.preventDefault();
                    break;
                case keyCodes.TAB:
                    if (isMenuBar) {
                    menuItem.hasClass('menu-item-active') && menuItem.removeClass('menu-item-active');
                    return;
                    } else {
                         if (menuBarNode.get(0)) {
                        p.c.menu.hideSubLevels(menuBarNode);
                        var menuBarItem = p.c.menu.getMenuBarItem(menuItem);
                        p.c.menu.highlight(menuBarItem, false, false);
                        e.preventDefault();
                        } else {
                            if (p.c.menu.showMenuTarget) {
                                $("#" + $(p.c.menu.showMenuTarget).attr("data-menuid")).hide();
                                p.c.menu.showMenuTarget.focus();
                            }
                        }
                    }
                    break;
                case keyCodes.ESCAPE:
                    p.c.menu.closeCurrentLevel(menuItem, menuBarNode.get(0) ? false : true);
                    break;
                case keyCodes.ENTER:
                    /*
                        The setTimeout is needed to hide only after the current thread has 
                        terminated as actions do not seem to execute for hidden items.
                    */
                    setTimeout(function() {
                        if (menuBarNode.get(0)) {
                            p.c.menu.hideSubLevels(menuBarNode);
                        }
                    }, 0);
                    break;
            }
        },

        handleRTLkeyPress: function(fromLeftKey, menuItem) {
            var shouldOpen = (isOrientationRTL && fromLeftKey) || (!isOrientationRTL && !fromLeftKey);
            if (shouldOpen) {
                p.c.menu.openSubLevel(menuItem);
            } else {
                p.c.menu.closeCurrentLevel(menuItem);
            }
            return shouldOpen;
        },

        getMenuBarItem: function(menuItem) {
            while (menuItem) {
                menuItem = $(document.getElementById("menu-item-" + $(menuItem).parent().attr("id")));
                if (menuItem.parent().hasClass("menu-bar") || (menuItem[0] && menuItem[0].tagName == "BODY")) {
                    break;
                }
            }
            return menuItem;
        },

        highlight: function(menuItem, doNotFocus) {
           var isSliderMenu = menuItem.closest('.menu-slider');
           var activeMenu = menuItem.closest('.menu-bar').find('li.menu-item-active');
            menuItem.siblings().each(function(index, elem) {
                if($(elem).hasClass("menu-item-active") && !(isSliderMenu && isSliderMenu.length > 0)) {
                    pega.c.menu.hideSubLevel(elem);
                }
                $(elem).removeClass("menu-item-active");
            });
            //menuItem.siblings().removeClass("menu-item-active");
            //BUG-414702 : donot focus unless the document has focus in IE.
            if(!doNotFocus && (!pega.util.Event.isIE || (pega.util.Event.isIE && document.hasFocus()))){
              menuItem.children("a").focus();
              menuItem.children('.menu-item-anchor').prop("tabindex", "0");
            }
            
            activeMenu.removeClass('menu-item-active');
            menuItem.addClass("menu-item-active");
            
            /*BUG-349996: add the active class to the outer li as well.*/
            var isActiveSliderMenu = menuItem.closest('.menu-slider-item-active');
            if(isActiveSliderMenu.length) {
                isActiveSliderMenu.addClass('menu-item-active');
            }
        },

        unhighlight: function(menuItem) {
          p.c.menu.hideSubLevels($(menuItem));
          menuItem.children('.menu-item-anchor').prop("tabindex", "-1");
          menuItem.removeClass("menu-item-active");
        },

        highlightPrevious: function(menuItem, rotate, doNotFocus) {
            p.c.menu.unhighlight(menuItem);
            var previousItem = $(menuItem).prevAll(".menu-item-enabled");
            if (previousItem.get(0)) {
                p.c.menu.highlight(previousItem.first(), doNotFocus);
            } else if (rotate) {
                var lastItem = $(menuItem).parent().children(".menu-item-enabled").last();
                if (lastItem.get(0)) {
                    p.c.menu.highlight(lastItem, doNotFocus);
                }
            }
        },

        highlightNext: function(menuItem, rotate, doNotFocus) {
            p.c.menu.unhighlight(menuItem);
            var nextItem = $(menuItem).nextAll(".menu-item-enabled");
            if (nextItem.get(0)) {
                p.c.menu.highlight(nextItem.first(), doNotFocus);
            } else if (rotate) {
                var firstItem = $(menuItem).parent().children(".menu-item-enabled").first();
                if (firstItem.get(0)) {
                    p.c.menu.highlight(firstItem, doNotFocus);
                }
            }
        },

        openSubLevel: function(menuItem) {
            p.c.menu.getAndShowSubLevel(menuItem);
            if (menuItem.attr("id") && menuItem.attr("id") != "") {
                $(document.body).on("click." + menuItem.attr("id").replace(/\$/ig, "_") + " contextmenu." + menuItem.attr("id").replace(/\$/ig, "_"), {
                    menuItem: menuItem
                }, function(e) {
                    $(this).off(e);
                    p.c.menu.hideSubLevel(e.data.menuItem);
                });
                p.c.menu.setState(menuItem,false);
            }
        },

        closeCurrentLevel: function(menuItem, isContextMenu) {
            var parentMenuItem = document.getElementById("menu-item-" + $(menuItem).parent().attr("id"));
            if (parentMenuItem) {
                $(document.body).off("." + $(parentMenuItem).attr("id").replace(/\$/ig, "_"));
                p.c.menu.hideSubLevels($(parentMenuItem));
                p.c.menu.highlight($(parentMenuItem));
            } else if (isContextMenu) {
                if (p.c.menu.showMenuTarget) {
                    $("#" + $(p.c.menu.showMenuTarget).attr("data-menuid")).hide();
                    p.c.menu.showMenuTarget.focus();
                }
            } else {
                p.c.menu.hideSubLevels($(menuItem).parent());
                p.c.menu.highlight(menuItem);
            }
        },

        focusInHandler: function(e) {
            pega.control.menu.highlight($(this).parent(), true);
        },

        focusOutHandler: function(e) {
            var subMenu = document.getElementById($(this).parent().attr("data-childnodesid"));
            if (!subMenu || (subMenu && subMenu.offsetHeight == 0)) {
              /* Why parent menu is unhighlighted */
                /*p.c.menu.unhighlight($(this).parent());*/
            }
        },

        isMenuBar: function(menuItem) {
            return $(menuItem).parent().hasClass("menu-bar");
        },

        isMenuBarItemChild: function(menuItem) {
            var parentMenuItem = document.getElementById("menu-item-" + $(menuItem).parent().attr("id"));
            return p.c.menu.isMenuBar(parentMenuItem);
        },

        handleDesktopClick: function(e) {
            if (pega.util.Event.getTarget(e).ownerDocument !== document) {
                //if (!touchable) {
                    $(document.body).triggerHandler("click.bodyone");
                //} else {
                    if (pega.c.menu.dragging) pega.c.menu.dragging = false;
                    $(document.body).triggerHandler("touchend.bodyone");
                //}
            }
        },

        /**
         * [killMenus description Api for external access to hide all new menus]
         * @return {[type]}
         */
        killMenus: function(parentNodeInfo) {
            if(parentNodeInfo){
              if(pega.mobile && pega.mobile.nativenav){
                    pega.mobile.nativenav.removeFromHistory(parentNodeInfo.data.parentMenu.backNavId);
                    parentNodeInfo.data.parentMenu.backNavId = "";
              }
            }
            if (deferLoadRequest && deferLoadRequest.conn && deferLoadRequest.conn.abort) {
                deferLoadRequest.conn.abort();
                pega.u.d.resumeAjaxSequencer();
            }
            //if (!touchable) {
                $(document.body).triggerHandler("click.bodyone");
            //} else {
                if (pega.c.menu.dragging) pega.c.menu.dragging = false;
                $(document.body).triggerHandler("touchend.bodyone");
            //}
        },

        /**
         * [bindEvents description]
         * @return {[type]}
         */
        bindEvents: function() {
            /* Touch and Click Event Bindings */

            $(document.body).on("click", ".menu-bar-regular > .menu-item > .menu-item-anchor", p.c.menu.handleMenuBarItemClick);
            $(document.body).on("click", ".menu-vertical > .menu-item > .menu-item-anchor", p.c.menu.handleVerticalMenuItemClick);
            $(document.body).on("click", ".menu-format-slidingmenu > .menu-item > .menu-item-anchor", p.c.menu.handleVerticalMenuItemClick);
            $(document.body).on("click", ".menu-slider .menu-item > .menu-item-anchor", p.c.menu.handleMenuSlide);
            $(document.body).on("click", ".menu-regular .menu-item > .menu-item-anchor", p.c.menu.handleRegularItemClick);
            $(document.body).on("keydown", ".menu-slider .menu-item > .menu-item-anchor", p.c.menu.handleMenuSlide);

            if (touchable) {
                $(document.body).on("touchend", ".menu-bar-regular > .menu-item > .menu-item-anchor", p.c.menu.handleMenuBarItemClick);
                $(document.body).on("touchend", ".menu-vertical > .menu-item > .menu-item-anchor", p.c.menu.handleVerticalMenuItemClick);
                $(document.body).on("touchend", ".menu-format-slidingmenu > .menu-item > .menu-item-anchor", p.c.menu.handleVerticalMenuItemClick);
                $(document.body).on("touchend", ".menu-slider .menu-item > .menu-item-anchor", p.c.menu.handleMenuSlide);
                $(document.body).on("touchstart", ".menu-slider .menu-item > .menu-item-anchor", p.c.menu.handleTouchStart);
                $(document.body).on("touchend", ".menu-regular > .menu-item > .menu-item-anchor", p.c.menu.handleTouchEnd);
                //BUG-297955 : fix to avoid touchmove to fire over extra blank space in fullscreen menu
                $(document.body).on("touchmove", ".menu-panel-wrapper, .menu-fullscreen > .menu, .menu-slider > .menu", p.c.menu.handleTouchMove);
            }

            /* Keyboard Event Bindings bind always*/ 
                $(document.body).on("keydown", ".menu-bar-regular > .menu-item > .menu-item-anchor, .menu-regular > .menu-item > .menu-item-anchor", p.c.menu.handleKeyPress);
                /*BUG-331589: fire focusin event for all the sub levels to make them active in menubar. */
                $(document.body).on("focusin", ".menu-bar-regular > .menu-item-enabled > .menu-item-anchor, .menu-bar-regular > .menu-item-enabled > .menu-item-anchor, .menu-slider > .menu-bar > .menu-item-enabled > .menu-item-anchor, .menu-slider > .menu-bar > .menu-item-enabled .menu-item-anchor", p.c.menu.focusInHandler);
                $(document.body).on("focusout", ".menu-bar-regular > .menu-item > .menu-item-anchor", p.c.menu.focusOutHandler);

            if (pega && pega.desktop && pega.desktop.support && pega.desktop.support.getDesktopApplication && pega.desktop.support.getDesktopApplication() != null) {
                pega.desktop.registerEventListener("DesktopMouseClick", p.c.menu.handleDesktopClick);
                pega.desktop.registerEventListener("desktopRightClick", p.c.menu.handleDesktopClick);

            }
            //memory leak fix
            if (pega && pega.u && pega.u.d && pega.u.d.attachOnUnload) {
                pega.u.d.attachOnUnload(p.c.menu.unbindEvents);

                pega.u.d.attachOnload(p.c.menu.pxMenuManager.renderMenus, true);
            }

        },
        //Memory leak fix
        unbindEvents: function() {
            $(document.body).off();
            $(window).off();
            if (pega.desktop.support.getDesktopApplication() != null && pega.desktop.cancelEventListener) {
                pega.desktop.cancelEventListener("DesktopMouseClick", p.c.menu.handleDesktopClick);
                if(typeof DesktopMouseClick_nsSmartPrompt === "function"){
                   pega.desktop.cancelEventListener("DesktopMouseClick", DesktopMouseClick_nsSmartPrompt);
                 }
                pega.desktop.cancelEventListener("desktopRightClick", p.c.menu.handleDesktopClick);
            }

            /**
            *   unbind event handler skipHarnessContextSwitchHandler 
            */
            $('.menu-panel-wrapper').each(function(ind, val) {
                val.removeEventListener("click",pega.ctxmgr.skipHarnessContextSwitchHandler,true);
                val.removeEventListener("focusin",pega.ctxmgr.skipHarnessContextSwitchHandler,true);
            });

        },

        getComputedStyle: function(el, styleProp) {
            var computedStyleString = "";
            if (window.getComputedStyle) {
                var compStyle = document.defaultView.getComputedStyle(el, null);
                if (compStyle) {
                    computedStyleString = compStyle.getPropertyValue(styleProp);
                }
            } else if (el.currentStyle) {
                computedStyleString = el.currentStyle[styleProp];
                if (!computedStyleString && styleProp.indexOf('-') != -1) {
                    computedStyleString = el.currentStyle[styleProp.replace(/(-.)/g, function(x) {
                        return x.charAt(1).toUpperCase();
                    })];
                }
            }
            return computedStyleString;
        },
        /*In Firefox, getComputedStyle returns an empty string if the document is rendered in background (a display none iframe).
          This seems to be an expected behavior for CSS engine of firefox.
          readStyleFromSkin is the last resort to read the style from style sheets, as there seems to be no other way.
          This is used only for some edge cases in firefox.
        */
        readStyleFromSkin: function(selectorText, cssProp){
            var skinSheet,returnStyle="";
            if(cssProp && selectorText){
              try{
                  for (var i=0; i < document.styleSheets.length; i++){
                    if(document.styleSheets[i].href && document.styleSheets[i].href.indexOf("webwb/pzskinv2_")>0){
                      skinSheet = document.styleSheets[i];
                      break;
                    }
                  }
                  if(skinSheet && skinSheet.cssRules && skinSheet.cssRules.length){
                    for (var i=0; i < skinSheet.cssRules.length; i++){
                      if(skinSheet.cssRules[i].selectorText && skinSheet.cssRules[i].selectorText == selectorText){
                        if(skinSheet.cssRules[i].style && cssProp){
                          returnStyle = skinSheet.cssRules[i].style[cssProp];
                        }
                        break;
                      }
                    }
                  }
                  skinSheet = null; 
              }catch(e){}
            }
            return returnStyle;
        },

        getSkinConfig: function(format) {
            var el = $("body > .menu-skin-data");
            if (el.get(0)) {
                el.removeClass().addClass(format + " menu-skin-data");
                el = el.get(0);
            } else {
                el = document.createElement("DIV");
                el.setAttribute("class", format + " menu-skin-data");
                $(document.body).append(el);
            }
            var skinConfigMap = {};
            var styleString = p.c.menu.getComputedStyle(el, "font-family");
            if(styleString == "" && pega.util.Dom.hasClass(document.documentElement, "ff")){
               styleString = p.c.menu.readStyleFromSkin("."+format+".menu-skin-data", "font-family");
            }
            var styleStringArr = styleString.split("_");
            for (var i = 0; i < styleStringArr.length; i++) {
                skinConfigMap[styleStringArr[i].split("-")[0]] = styleStringArr[i].split("-")[1];
            }
            for (var prop in skinConfigMap) {
                skinConfigMap[prop] = (skinConfigMap[prop] === "true" ? true : (skinConfigMap[prop] === "false" ? false : skinConfigMap[prop]));
            }
            return skinConfigMap;
        },

        doMenuBarCleanup: function(reloadElement) {
            var menubarIds = pega.c.menu.pxMenuManager.getMenuIds();

            $.each(menubarIds, function(name, val) {
                if (reloadElement && $.contains(reloadElement, $("#" + name).get(0))) {
                    $.each(val, function(index, value) {
                        var elem = document.getElementById(value);
                        if (elem) $(elem).parent().remove();
                    });
                    delete menuIdQueue[name];
                }
            });
        },

        doShowMenuCleanup: function(reloadElement) {
            $(".menu-in-modal").remove();
        },

        makeNodeActive: function(data,metadata) {
          var expressionId, expressionResult,
              activeFlag = false,
              queue = [];
          for (; data && !activeFlag;) {
            if (data.nodes && data.nodes.length > 0) {
              $.each(data.nodes, function(i, innerNode) {
                var expRes = false;
                if (innerNode) {
                  if(innerNode.pyExpressionId){
                    expressionId = innerNode.pyExpressionId;
                    if(expressionId && expressionId.startsWith("EXP=")){
                        expressionResult = [];
                        expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN] = pega.ui.TemplateEngine.getCurrentContext().getWhenResult(expressionId);
                    } else{
                        expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(expressionId);
                        innerNode.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(expressionId);
                    }                   
                  }
                  if(expressionResult){
                      if(typeof expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN] == "object" && expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN][0] != 'undefined'){
                        expRes = expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN][0];
                         
                      } else{
                        expRes = expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN];     
                      }
                  }
                  
                  /*expRes = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN] ? !!expressionResult[pega.ui.ExpressionEvaluator.ACTIVE_WHEN] : false;*/
                  if (((innerNode && "true" == innerNode.pyIsActiveNavItem) || expRes) && !activeFlag) {
                    activeFlag = true;
                    data.isActiveIndex = i;
                    /*return false;*/
                  }
                  queue.push(innerNode);
                }
              });
            }
            data = queue.shift();
          }
          return activeFlag;
        },
      
        setActiveIndex : function(data,metadata) {
            var activeFlag = p.c.menu.makeNodeActive(data, metadata);
            var sessionObj = {};
            var originalMenuState;
            var keyToMenuState = metadata ? metadata["uniqueMenuId"] : undefined;
            if(localStorage.getItem("menuState")){              
                sessionObj = originalMenuState = JSON.parse(localStorage.getItem("menuState"));
            }
        },
        
        maintainState: function() {
          var parseObj,
              $menuAll = document.querySelectorAll('.content-field ul.menu, .content-field ul.menu-bar'),
              $menuItems = $($menuAll).children(".menu-item"),
              $activeMenuItems = $menuItems.filter("[data-active-menu]");
              //$nTopMenu = $('div[string_type="field"]').children("ul[data-menu-id]"),
              //$nTopSliderMenu = $('div[string_type="field"]').children().children("ul[data-menu-id]");
              
          /* Need to consider menus in old layout mode */
          //var $allTopMenu = $nTopMenu.add($nTopSliderMenu);    
          /* Make first enabled menu item active by default */
          /* Removing this because ofBUG-370750 */
        /*  $allTopMenu.each(function() {
            $(this).children("li.menu-item").not(".menu-item-disabled").first().addClass("menu-item-active");
          });*/
          /* Active When is configured */          
          $activeMenuItems.each(function(index) {
            var that = $(this);

            /* Find the trail of parent menu-items for present activeWhen */
            var parentMenus = that.parents(".menu-item", ".menu-slider");

            parentMenus.each(function() {
              var mthat = $(this);
              if (!mthat.data("active-menu")) {
                /* Set data-active-menu for parent menu trail for maintaining state */
                $(mthat).attr('data-active-menu', '');
                p.c.menu.setState(mthat, false);
              }
            });
            
            p.c.menu.setState(that, false);

          });

          if (localStorage.getItem("menuState")) {
            
            parseObj = JSON.parse(localStorage.getItem("menuState"));
            
            /* Sort the parsed object by key so that slider menu is opened in correct sequence */
            
            var sortObjectByKey = function(obj) {
              var key, keys = [], sorted_obj = {};
              for (key in obj) {
                obj.hasOwnProperty(key) && keys.push(key);
              }
              keys.sort();
              keys.forEach(function(key,i) {
                sorted_obj[key] = obj[key];
              });

              return sorted_obj;
            };
            parseObj = sortObjectByKey(parseObj);
            
            /* Get State of Menu */
            $.each(parseObj, function(menuName, val) {             
              /* Slider back Navigation State */
              var backSlide = false;
              if ("string" == typeof val && val.indexOf("-back") > 0) {
                var backSlide = true;
                val = val.replace(/-back/g, "");
                val = parseInt(val);
              }
              
              var menuItem = $($menuAll).children('ul[data-menu-id="' + menuName + '"] > li.menu-item:eq("'+ val +'")');
              
              if (menuItem.length) {
                  /* Make menu item active */
                  $menuItems.filter(menuItem).addClass("menu-item-active").siblings().toggleClass("menu-item-active", false);

                  /* Slide to next level if menu which is visible has child nodes */
                  if (menuItem.data("childnodesid") && menuItem.children("ul.menu").length && !backSlide && menuItem.filter(":visible").length) {
                      pega.control.menu.slideToNextLevel(menuItem);
                  } else if (menuItem.attr("isdeferload") == "true") {

                  }

              }
            });
          }
          $activeMenuItems.each(function(index) {
            $(this).removeAttr("data-active-menu");
          });
          
        },
        setState: function(menuItem, setVal, back) {

          var parseObj, menuState = {},
              originalMenuState = {};
          /* Menu State Object - localStorage.menuState: {pxMenu1: "8", pxMenu2: "5", pxMenu3: "6"} */
          
          /* Add new key to Menu State */
          if (!setVal) { /* Set keys in session storage only set through event */
            menuState[$(menuItem).parent().data("menu-id")] = $(menuItem).parent().children(".menu-item:not(.menu-item-separator)").index($(menuItem));

            if (localStorage.getItem("menuState")) {

              originalMenuState = JSON.parse(localStorage.getItem("menuState"));

            }

            /* Merge the newly added key to Present State */
            var mergeObj = [originalMenuState, menuState];
            
            for (var i = 1; i < mergeObj.length; i++) {
              if (mergeObj[i]) {
                for (var key in mergeObj[i]) {
                  if (mergeObj[i].hasOwnProperty(key)) {
                    originalMenuState[key] = mergeObj[i][key];
                  }
                }
              }
            }
            
            if (back && $(menuItem).parent().data("menu-id")) {
              /* Delete the present menu id and add "-back" Identifier string for parent menu */
              delete originalMenuState[$(menuItem).parent().data("menu-id")];
              var menuKey = $(menuItem).parent().parent().closest("ul[data-menu-id]").data("menu-id");
              if(menuKey !=undefined && originalMenuState[menuKey]!=undefined){
                originalMenuState[menuKey] = originalMenuState[menuKey] + "-back";
              }
            }
            /* Set merged menu state to localStorage */
            localStorage.setItem("menuState", JSON.stringify(originalMenuState));
          }
      },
      clearState: function() {
        localStorage.removeItem("menuState");
      },
      getFocusableMenuItem : function(firstElement){
        /* In case of menu item firstElement should be session storage value */
        var menuItem = $(firstElement).parent();
        if(menuItem && menuItem.length != 0){
          var menu = menuItem.parent()[0];
          if(menu && menu.hasAttribute("data-menu-id")){
            var menuId = menu.getAttribute("data-menu-id");
            if (localStorage && localStorage.getItem("menuState")) {
              parseObj = JSON.parse(localStorage.getItem("menuState"));
              if(parseObj.hasOwnProperty(menuId)){
                firstElement = $(menu).children(".menu-item-active").children()[0];
              }
            }
          }
        }
        return firstElement;
        /* end */
      },
      createStorage:function(config){
          try {
            if (!window.localStorage) throw "exception";
            localStorage.setItem("a", 1), localStorage.removeItem("a");
          } catch (e) {
            ! function() {
              var Storage = function(config) {
                function createCookie(name, value) {
                  var date, expires;
                  date = new Date();
                  date.setTime(date.getTime() + (config.expiryMS));
                  expires = "; expires=" + date.toGMTString();
                  document.cookie = name + "=" + value + expires + "; path=/";
                }

                function readCookie(name) {
                  var i, c, nameEQ = name + "=",
                      ca = document.cookie.split(";");
                  for (i = 0; i < ca.length; i++) {
                    for (c = ca[i];" " == c.charAt(0);) {
                      c = c.substring(1, c.length);
                    }
                    if (0 == c.indexOf(nameEQ)) {
                      return c.substring(nameEQ.length, c.length);
                    }
                  }
                  return null;
                }

                function setData(data) {
                  data = encodeURIComponent(JSON.stringify(data));
                  createCookie(config.name, data);
                }

                function getData() {
                  var data = readCookie(config.name);
                  return data ? JSON.parse(decodeURIComponent(data)) : {};
                }
                var data = getData();
                return {
                  length: 0,
                  getItem: function(key) {
                    return void 0 === data[key] ? null : data[key];
                  },
                  removeItem: function(key) {
                    delete data[key];
                    this.length--;
                    setData(data);
                  },
                  setItem: function(key, value) {
                    data[key] = value + "";
                    this.length++;
                    setData(data);
                  }
                };
              },
              localStorage = new Storage(config);
              window.localStorage = localStorage;
              window.localStorage.__proto__ = localStorage;
            }();
          }
        }
    };

    var menuQueue = [],
        menuIdQueue = {};
    p.c.menu.pxMenuManager = {
        schedule: function(id, metadata) {
            menuQueue.push({
                id: id,
                metadata: metadata
            });
        },
        getNext: function() {
            return menuQueue.shift();
        },
        getMenuIds: function() {
            return menuIdQueue;
        },
        queueLength: function() {
            return menuQueue.length;
        },
        renderMenus: function() {
            pega.ui.statetracking.setBusy("renderMenus"); // inform test tools and time tracker menus busy - big help to UIRegression portal tests
            var length = p.c.menu.pxMenuManager.queueLength();
            var menuObj;
            for (var i = 0; i < length; i++) {
                menuObj = p.c.menu.pxMenuManager.getNext();
                p.c.menu.createMenu(menuObj.id, menuObj.metadata);
            }
            pega.ui.statetracking.setDone();

        },
        maintainState: function() {
            return p.c.menu.maintainState();
        },
        clearState: function() {
            return p.c.menu.clearState();
        }
    };
  
    if (p.u.d.ServerProxy && p.u.d.ServerProxy.isDestinationLocal && p.u.d.ServerProxy.isDestinationLocal()) {
      $(p.c.menu.bindEvents);
    } else {
      p.c.menu.bindEvents();
    }

    if (p && p.ui && p.ui.template && p.ui.template.RenderingEngine) {
        p.ui.template.RenderingEngine.register("pxMenu", p.c.menu.renderer);
    }
    p.c.menu.createStorage({"name":"menuState", "expiryMS":(60*60*1000)});
    pega.u.d.attachOnload(p.c.menu.pxMenuManager.maintainState, true);
    
})(pega);
//static-content-hash-trigger-GCC
/*
{{~#if metadata.sliding~}}<div class="menu-slider menu-slider-nofullscr {{{metadata.format}}}">{{~/if~}}
<ul class="{{{metadata.format}}} menu-bar menu-{{{metadata.type}}} {{#if metadata.sliding}}{{else}}menu-bar-regular{{/if}}" name="{{{metadata.navUID}}}" role="menubar" id="{{{metadata.menuID}}}" data-menu-id="{{metadata.uniqueMenuId}}" >
{{~#each nodes~}}
{{#appendProperty this "metadata" ../metadata}}{{/appendProperty}}
{{#appendProperty this "isParentActiveIndex" ../nodeParent.isActiveIndex}}{{/appendProperty}}
{{#if_eq this.separator "true"}}
<li class="menu-item-separator" role="separator">&nbsp;</li>
{{else}}
<li {{getActiveWhenNav metadata isParentActiveIndex @index}} class="menu-item {{#if this.pyDisabled}}menu-item-disabled{{else}}menu-item-enabled{{/if}}" role="presentation" {{#if this.pyAutomationID}}data-test-id="{{{this.pyAutomationID}}}"{{/if}} {{#if this.pyDisabled}}aria-disabled="true" disabled="disabled"{{/if}} {{printAttributeIfNotEmpty "isDeferLoad" pyDeferLoad }} {{printAttributeIfNotEmpty "data-childnodesid" pxEntryHandle}} {{printAttributeIfNotEmptyWithPrefixAndSuffix "id" pxEntryHandle "menu-item-" ""}} {{#if this.pyToolTip}}title="{{{this.pyToolTip}}}"{{/if}} {{{pyExpressionIdMeta}}} >
{{#appendProperty this "isMenuBar" true}}{{/appendProperty}}
{{~> pzPega_menu_item_anchor_template~}}
{{#if metadata.sliding}}
{{~> pzPega_menu_template~}}
{{/if}}
</li>
{{/if_eq}}	
{{~/each~}}
</ul>
{{#if metadata.sliding}}</div>{{/if}}
{{~#if_eq metadata.media true~}}
{{~#if_eq metadata.type "horizontal"~}}<a href="#" title="menu" onclick="pd(event);" class="menu-item-responsive-icon {{{metadata.format}}}" data-ctl data-click='[["showMenu",[{"dataSource":"{{metadata.navName}}", "isNavTypeCustom":"false", "menuAlign":"left","format":"{{metadata.format}}" , "loadBehavior":"firstuse", "ellipsisAfter":"999","usingPage":"", "navPage":"{{metadata.navPage}}", "useNewMenu":"true", "isMobile":"{{metadata.isMobile}}"
{{~#if_eq metadata.deferLoad "true"~}}
, "deferLoad" : true, "enableCache" : {{~#if metadata.enableCache~}}true{{else}}false{{~/if~}}
{{~else~}}
, "deferLoad" : false
{{~/if_eq~}}
, "removePage": "false"},":event"]]]'></a>{{~/if_eq~}}
{{~/if_eq~}}
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pzPega_menubar_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"menu-slider menu-slider-nofullscr "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"format") : stack1), depth0)) != null ? stack1 : "")
    + "\">";
},"3":function(container,depth0,helpers,partials,data) {
    return "";
},"5":function(container,depth0,helpers,partials,data) {
    return "menu-bar-regular";
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"metadata",(depths[1] != null ? lookupProperty(depths[1],"metadata") : depths[1]),{"name":"appendProperty","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":66}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"isParentActiveIndex",((stack1 = (depths[1] != null ? lookupProperty(depths[1],"nodeParent") : depths[1])) != null ? lookupProperty(stack1,"isActiveIndex") : stack1),{"name":"appendProperty","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":93}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"separator") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":16,"column":10}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    return "<li class=\"menu-item-separator\" role=\"separator\">&nbsp;</li>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li "
    + container.escapeExpression((lookupProperty(helpers,"getActiveWhenNav")||(depth0 && lookupProperty(depth0,"getActiveWhenNav"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metadata") : depth0),(depth0 != null ? lookupProperty(depth0,"isParentActiveIndex") : depth0),(data && lookupProperty(data,"index")),{"name":"getActiveWhenNav","hash":{},"data":data,"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":60}}}))
    + " class=\"menu-item "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDisabled") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":9,"column":78},"end":{"line":9,"column":151}}})) != null ? stack1 : "")
    + "\" role=\"presentation\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":173},"end":{"line":9,"column":247}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDisabled") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":248},"end":{"line":9,"column":318}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmpty")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmpty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"isDeferLoad",(depth0 != null ? lookupProperty(depth0,"pyDeferLoad") : depth0),{"name":"printAttributeIfNotEmpty","hash":{},"data":data,"loc":{"start":{"line":9,"column":319},"end":{"line":9,"column":374}}}))
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmpty")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmpty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"data-childnodesid",(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),{"name":"printAttributeIfNotEmpty","hash":{},"data":data,"loc":{"start":{"line":9,"column":375},"end":{"line":9,"column":437}}}))
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmptyWithPrefixAndSuffix")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmptyWithPrefixAndSuffix"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"id",(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),"menu-item-","",{"name":"printAttributeIfNotEmptyWithPrefixAndSuffix","hash":{},"data":data,"loc":{"start":{"line":9,"column":438},"end":{"line":9,"column":520}}}))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyToolTip") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":521},"end":{"line":9,"column":578}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":9,"column":579},"end":{"line":9,"column":603}}}) : helper))) != null ? stack1 : "")
    + " >\n"
    + ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"isMenuBar",true,{"name":"appendProperty","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":60}}})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_item_anchor_template"),depth0,{"name":"pzPega_menu_item_anchor_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + "</li>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "menu-item-disabled";
},"13":function(container,depth0,helpers,partials,data) {
    return "menu-item-enabled";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-test-id=\""
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0), depth0)) != null ? stack1 : "")
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    return "aria-disabled=\"true\" disabled=\"disabled\"";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "title=\""
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyToolTip") : depth0), depth0)) != null ? stack1 : "")
    + "\"";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_template"),depth0,{"name":"pzPega_menu_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"type") : stack1),"horizontal",{"name":"if_eq","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":27,"column":54}}})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\"#\" title=\"menu\" onclick=\"pd(event);\" class=\"menu-item-responsive-icon "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"format") : stack1), depth0)) != null ? stack1 : "")
    + "\" data-ctl data-click='[[\"showMenu\",[{\"dataSource\":\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"navName") : stack1), depth0))
    + "\", \"isNavTypeCustom\":\"false\", \"menuAlign\":\"left\",\"format\":\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"format") : stack1), depth0))
    + "\" , \"loadBehavior\":\"firstuse\", \"ellipsisAfter\":\"999\",\"usingPage\":\"\", \"navPage\":\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"navPage") : stack1), depth0))
    + "\", \"useNewMenu\":\"true\", \"isMobile\":\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"isMobile") : stack1), depth0))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"deferLoad") : stack1),"true",{"name":"if_eq","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(32, data, 0),"data":data,"loc":{"start":{"line":22,"column":0},"end":{"line":26,"column":12}}})) != null ? stack1 : "")
    + ", \"removePage\": \"false\"},\":event\"]]]'></a>";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ", \"deferLoad\" : true, \"enableCache\" :"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"enableCache") : stack1),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":23,"column":38},"end":{"line":23,"column":94}}})) != null ? stack1 : "");
},"28":function(container,depth0,helpers,partials,data) {
    return "true";
},"30":function(container,depth0,helpers,partials,data) {
    return "false";
},"32":function(container,depth0,helpers,partials,data) {
    return ", \"deferLoad\" : false";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":104}}})) != null ? stack1 : "")
    + "<ul class=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"format") : stack1), depth0)) != null ? stack1 : "")
    + " menu-bar menu-"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"type") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":2,"column":67},"end":{"line":2,"column":122}}})) != null ? stack1 : "")
    + "\" name=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"navUID") : stack1), depth0)) != null ? stack1 : "")
    + "\" role=\"menubar\" id=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"menuID") : stack1), depth0)) != null ? stack1 : "")
    + "\" data-menu-id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"uniqueMenuId") : stack1), depth0))
    + "\" >"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"nodes") : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":17,"column":11}}})) != null ? stack1 : "")
    + "</ul>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(23, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":0},"end":{"line":19,"column":37}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"media") : stack1),true,{"name":"if_eq","hash":{},"fn":container.program(25, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":0},"end":{"line":28,"column":12}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true});
})();
//static-content-hash-trigger-GCC
/*
{{~#if nodes~}} {{#if_not_eq metadata.sliding true}}<div class="menu-panel-wrapper">{{/if_not_eq}} <ul class="menu {{{metadata.format}}} {{#if metadata.sliding}}{{else}}menu-regular{{/if}}" {{#if metadata.menuID}}data-menuid="{{{metadata.menuID}}}"{{/if}} role="menu" {{#if metadata.title}}aria-label="{{{metadata.title}}}" {{/if}} id="{{pxEntryHandle}}{{~#if_not_eq metadata.contextMenuFirstLevel true~}}{{metadata.idSuffix}}{{~/if_not_eq~}}" data-menu-id="{{metadata.uniqueMenuId}}-{{getMenuDepth pxEntryHandle}}"> {{#if metadata.sliding}} {{#if metadata.fullscreen}} <li class="menu-item menu-item-header" role="presentation"> <a href="#" onclick="pd(event);" class="menu-item-anchor menu-slide-back-anchor" tabindex="0" role="menuitem" data-ctl=""> <span class="menu-item-title-wrap"> <span class="menu-item-title"> {{#if metadata.deferLoad}} {{{metadata.headerText}}} {{else}} {{#if_not_eq metadata.contextMenuFirstLevel true}}{{{this.pyCaption}}}{{else}}{{{metadata.headerText}}}{{/if_not_eq}} {{/if}} </span> </span> <span class="menu-full-close-icon"></span> </a> </li> {{else}} {{#if_not_eq metadata.contextMenuFirstLevel true}} <li class="menu-item" role="presentation"> <a href="#" onclick="pd(event);" class="menu-item-anchor menu-slide-back-anchor" tabindex="0" role="menuitem" data-ctl=""> <span class="menu-item-title-wrap"> <span class="menu-item-title"> {{#if metadata.parentHeader}}{{{metadata.parentHeader}}}{{else}}{{{this.pyCaption}}}{{/if}} </span> </span> </a> </li> <li class="menu-item-separator" role="separator">&nbsp;</li> {{/if_not_eq}} {{/if}} {{/if}} {{#appendProperty this.metadata "contextMenuFirstLevel" false}}{{/appendProperty}} {{~#each nodes~}} {{#appendProperty this "metadata" ../metadata}}{{/appendProperty}} {{#appendProperty this "nestedActiveIndex" ../../this.isActiveIndex}}{{/appendProperty}} {{#if_eq this.separator "true"}} <li class="menu-item-separator" role="separator">&nbsp;</li> {{else}} <li {{{this.pyExpressionIdMeta}}} {{getActiveWhenNav metadata nestedActiveIndex @index}} class="menu-item {{#if this.pyDisabled}}menu-item-disabled{{else}}menu-item-enabled{{/if}}" role="presentation" {{#if this.pyAutomationID}}data-test-id="{{{this.pyAutomationID}}}"{{/if}} {{#if this.pyDisabled}}aria-disabled="true" disabled="disabled"{{/if}} {{printAttributeIfNotEmptyWithPrefixAndSuffix "isDeferLoad" pyDeferLoad "" ""}} {{printAttributeIfNotEmptyWithPrefixAndSuffix "data-childnodesid" pxEntryHandle "" metadata.idSuffix}} {{printAttributeIfNotEmptyWithPrefixAndSuffix "id" pxEntryHandle "menu-item-" metadata.idSuffix}} {{#if this.pyToolTip}}title="{{{this.pyToolTip}}}"{{/if}}> {{#appendProperty this "isMenuBar" false}}{{/appendProperty}} {{~> pzPega_menu_item_anchor_template~}} {{~#if nodes~}} {{~> pzPega_menu_template~}} {{~/if~}} </li> {{/if_eq}} {{~/each~}} </ul> {{#if_not_eq metadata.sliding true}}</div>{{/if_not_eq}} {{~/if~}}*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzPega_menu_template'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),true,{"name":"if_not_eq","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":98}}})) != null ? stack1 : "")
    + " <ul class=\"menu "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"format") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":1,"column":137},"end":{"line":1,"column":188}}})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"menuID") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":190},"end":{"line":1,"column":255}}})) != null ? stack1 : "")
    + " role=\"menu\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"title") : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":268},"end":{"line":1,"column":331}}})) != null ? stack1 : "")
    + " id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxEntryHandle") || (depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxEntryHandle","hash":{},"data":data,"loc":{"start":{"line":1,"column":336},"end":{"line":1,"column":353}}}) : helper)))
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"contextMenuFirstLevel") : stack1),true,{"name":"if_not_eq","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":353},"end":{"line":1,"column":442}}})) != null ? stack1 : "")
    + "\" data-menu-id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"uniqueMenuId") : stack1), depth0))
    + "-"
    + container.escapeExpression((lookupProperty(helpers,"getMenuDepth")||(depth0 && lookupProperty(depth0,"getMenuDepth"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),{"name":"getMenuDepth","hash":{},"data":data,"loc":{"start":{"line":1,"column":484},"end":{"line":1,"column":514}}}))
    + "\"> "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":517},"end":{"line":1,"column":1581}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metadata") : depth0),"contextMenuFirstLevel",false,{"name":"appendProperty","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1582},"end":{"line":1,"column":1664}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"nodes") : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1665},"end":{"line":1,"column":2815}}})) != null ? stack1 : "")
    + "</ul> "
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"sliding") : stack1),true,{"name":"if_not_eq","hash":{},"fn":container.program(43, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2822},"end":{"line":1,"column":2878}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "<div class=\"menu-panel-wrapper\">";
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    return "menu-regular";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-menuid=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"menuID") : stack1), depth0)) != null ? stack1 : "")
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "aria-label=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"title") : stack1), depth0)) != null ? stack1 : "")
    + "\" ";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"idSuffix") : stack1), depth0));
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"fullscreen") : stack1),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(23, data, 0),"data":data,"loc":{"start":{"line":1,"column":542},"end":{"line":1,"column":1573}}})) != null ? stack1 : "")
    + " ";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " <li class=\"menu-item menu-item-header\" role=\"presentation\"> <a href=\"#\" onclick=\"pd(event);\" class=\"menu-item-anchor menu-slide-back-anchor\" tabindex=\"0\" role=\"menuitem\" data-ctl=\"\"> <span class=\"menu-item-title-wrap\"> <span class=\"menu-item-title\"> "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"deferLoad") : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(18, data, 0),"data":data,"loc":{"start":{"line":1,"column":820},"end":{"line":1,"column":1007}}})) != null ? stack1 : "")
    + " </span> </span> <span class=\"menu-full-close-icon\"></span> </a> </li> ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"headerText") : stack1), depth0)) != null ? stack1 : "")
    + " ";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"contextMenuFirstLevel") : stack1),true,{"name":"if_not_eq","hash":{},"fn":container.program(19, data, 0),"inverse":container.program(21, data, 0),"data":data,"loc":{"start":{"line":1,"column":882},"end":{"line":1,"column":999}}})) != null ? stack1 : "")
    + " ";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyCaption") : depth0), depth0)) != null ? stack1 : "");
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"headerText") : stack1), depth0)) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"contextMenuFirstLevel") : stack1),true,{"name":"if_not_eq","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1087},"end":{"line":1,"column":1565}}})) != null ? stack1 : "")
    + " ";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " <li class=\"menu-item\" role=\"presentation\"> <a href=\"#\" onclick=\"pd(event);\" class=\"menu-item-anchor menu-slide-back-anchor\" tabindex=\"0\" role=\"menuitem\" data-ctl=\"\"> <span class=\"menu-item-title-wrap\"> <span class=\"menu-item-title\"> "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"parentHeader") : stack1),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":1,"column":1371},"end":{"line":1,"column":1462}}})) != null ? stack1 : "")
    + " </span> </span> </a> </li> <li class=\"menu-item-separator\" role=\"separator\">&nbsp;</li> ";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"parentHeader") : stack1), depth0)) != null ? stack1 : "");
},"27":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"metadata",(depths[1] != null ? lookupProperty(depths[1],"metadata") : depths[1]),{"name":"appendProperty","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1683},"end":{"line":1,"column":1749}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"nestedActiveIndex",(depths[2] != null ? lookupProperty(depths[2],"isActiveIndex") : depths[2]),{"name":"appendProperty","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1750},"end":{"line":1,"column":1838}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"separator") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(28, data, 0, blockParams, depths),"inverse":container.program(30, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":1,"column":1839},"end":{"line":1,"column":2803}}})) != null ? stack1 : "");
},"28":function(container,depth0,helpers,partials,data) {
    return " <li class=\"menu-item-separator\" role=\"separator\">&nbsp;</li> ";
},"30":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " <li "
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0), depth0)) != null ? stack1 : "")
    + " "
    + container.escapeExpression((lookupProperty(helpers,"getActiveWhenNav")||(depth0 && lookupProperty(depth0,"getActiveWhenNav"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metadata") : depth0),(depth0 != null ? lookupProperty(depth0,"nestedActiveIndex") : depth0),(data && lookupProperty(data,"index")),{"name":"getActiveWhenNav","hash":{},"data":data,"loc":{"start":{"line":1,"column":1976},"end":{"line":1,"column":2030}}}))
    + " class=\"menu-item "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDisabled") : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.program(33, data, 0),"data":data,"loc":{"start":{"line":1,"column":2048},"end":{"line":1,"column":2121}}})) != null ? stack1 : "")
    + "\" role=\"presentation\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2143},"end":{"line":1,"column":2217}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDisabled") : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2218},"end":{"line":1,"column":2288}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmptyWithPrefixAndSuffix")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmptyWithPrefixAndSuffix"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"isDeferLoad",(depth0 != null ? lookupProperty(depth0,"pyDeferLoad") : depth0),"","",{"name":"printAttributeIfNotEmptyWithPrefixAndSuffix","hash":{},"data":data,"loc":{"start":{"line":1,"column":2289},"end":{"line":1,"column":2368}}}))
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmptyWithPrefixAndSuffix")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmptyWithPrefixAndSuffix"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"data-childnodesid",(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),"",((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"idSuffix") : stack1),{"name":"printAttributeIfNotEmptyWithPrefixAndSuffix","hash":{},"data":data,"loc":{"start":{"line":1,"column":2369},"end":{"line":1,"column":2471}}}))
    + " "
    + container.escapeExpression((lookupProperty(helpers,"printAttributeIfNotEmptyWithPrefixAndSuffix")||(depth0 && lookupProperty(depth0,"printAttributeIfNotEmptyWithPrefixAndSuffix"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"id",(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),"menu-item-",((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"idSuffix") : stack1),{"name":"printAttributeIfNotEmptyWithPrefixAndSuffix","hash":{},"data":data,"loc":{"start":{"line":1,"column":2472},"end":{"line":1,"column":2569}}}))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyToolTip") : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2570},"end":{"line":1,"column":2627}}})) != null ? stack1 : "")
    + "> "
    + ((stack1 = (lookupProperty(helpers,"appendProperty")||(depth0 && lookupProperty(depth0,"appendProperty"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,"isMenuBar",false,{"name":"appendProperty","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2629},"end":{"line":1,"column":2690}}})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_item_anchor_template"),depth0,{"name":"pzPega_menu_item_anchor_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"nodes") : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":2732},"end":{"line":1,"column":2786}}})) != null ? stack1 : "")
    + "</li> ";
},"31":function(container,depth0,helpers,partials,data) {
    return "menu-item-disabled";
},"33":function(container,depth0,helpers,partials,data) {
    return "menu-item-enabled";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-test-id=\""
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0), depth0)) != null ? stack1 : "")
    + "\"";
},"37":function(container,depth0,helpers,partials,data) {
    return "aria-disabled=\"true\" disabled=\"disabled\"";
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "title=\""
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"pyToolTip") : depth0), depth0)) != null ? stack1 : "")
    + "\"";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_template"),depth0,{"name":"pzPega_menu_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"43":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"nodes") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":2888}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true});
})();
//static-content-hash-trigger-GCC
/*
<a href="#" onclick="pd(event);" class="menu-item-anchor {{#if this.pyDisabled}}menu-item-anchor-disabled{{/if}} {{~#if this.pxEntryHandle~}}menu-item-expand{{~/if~}}" {{#if this.focusable}}tabindex="0"{{else}}tabindex="-1" {{/if}} role="{{#if this.pyChecked}}{{#if this.pyRadio}}menuitemradio {{else}}menuitemcheckbox {{/if}}{{/if}}menuitem" {{#if metadata.touchable}}{{#if pxEntryHandle}}{{else}}{{#if this.data-click}}data-ctl data-click="{{JSONToStringInMenu this.data-click true}}"{{/if}}{{/if}}{{else}}{{#if this.data-click}}data-ctl data-click="{{JSONToStringInMenu this.data-click true}}"{{/if}}{{/if}} {{~#if this.pxEntryHandle~}}aria-haspopup="true"{{~/if~}} {{~#if_eq this.pyChecked "true"~}}aria-checked="true"{{~else~}}{{~#if_eq this.pyChecked "false"~}}aria-checked="false"{{~/if_eq~}}{{~/if_eq~}}> {{~#if_eq this.pyChecked "true"~}} <span class="menu-item-icon {{#if this.pyRadio}} menu-item-icon-radio {{else}} menu-item-icon-check {{/if}}" data-click="."></span> {{~else~}} {{~#if_eq this.pyChecked "false"~}} <span class="menu-item-icon {{#if this.pyRadio}}menu-item-icon-radio-blank{{else}}menu-item-icon-check-blank{{/if}}" data-click="."></span> {{~/if_eq~}} {{~/if_eq~}} {{~> pzPega_menu_item_icon_template~}} <span class="menu-item-title-wrap" data-click="."> {{~#if metadata.maxWidth~}} {{~#if_eq metadata.maxWidth "999"~}} <span class="menu-item-title" data-click="..">{{pyCaption}}</span> {{~else~}} <span class="menu-item-title" data-click="..">{{{addEllipsis pyCaption metadata.maxWidth}}}</span> {{~/if_eq~}} {{~else~}} <span class="menu-item-title" data-click="..">{{pyCaption}}</span> {{~/if~}} {{~#if this.pyBadgeProperty~}} <span class="menu-item-badge {{{this.badgeClass}}}" data-click="..">{{pyBadgeProperty}}</span> {{~/if~}} {{~#if this.pySummary~}} <span class="menu-item-description" data-click="..">{{pySummary}}</span> {{~/if~}} </span> {{~> pzPega_menu_item_icon_template~}} </a>
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzPega_menu_item_anchor_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "menu-item-anchor-disabled";
},"3":function(container,depth0,helpers,partials,data) {
    return "menu-item-expand";
},"5":function(container,depth0,helpers,partials,data) {
    return "tabindex=\"0\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "tabindex=\"-1\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRadio") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data,"loc":{"start":{"line":1,"column":260},"end":{"line":1,"column":326}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "menuitemradio ";
},"12":function(container,depth0,helpers,partials,data) {
    return "menuitemcheckbox ";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data,"loc":{"start":{"line":1,"column":369},"end":{"line":1,"column":500}}})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    return "";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"data-click") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":398},"end":{"line":1,"column":493}}})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-ctl data-click=\""
    + container.escapeExpression((lookupProperty(helpers,"JSONToStringInMenu")||(depth0 && lookupProperty(depth0,"JSONToStringInMenu"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"data-click") : depth0),true,{"name":"JSONToStringInMenu","hash":{},"data":data,"loc":{"start":{"line":1,"column":442},"end":{"line":1,"column":485}}}))
    + "\"";
},"20":function(container,depth0,helpers,partials,data) {
    return "aria-haspopup=\"true\"";
},"22":function(container,depth0,helpers,partials,data) {
    return "aria-checked=\"true\"";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyChecked") : depth0),"false",{"name":"if_eq","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":732},"end":{"line":1,"column":799}}})) != null ? stack1 : "");
},"25":function(container,depth0,helpers,partials,data) {
    return "aria-checked=\"false\"";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-icon "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRadio") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":1,"column":876},"end":{"line":1,"column":955}}})) != null ? stack1 : "")
    + "\" data-click=\".\"></span>";
},"28":function(container,depth0,helpers,partials,data) {
    return " menu-item-icon-radio ";
},"30":function(container,depth0,helpers,partials,data) {
    return " menu-item-icon-check ";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyChecked") : depth0),"false",{"name":"if_eq","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":991},"end":{"line":1,"column":1179}}})) != null ? stack1 : "");
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-icon "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRadio") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.program(36, data, 0),"data":data,"loc":{"start":{"line":1,"column":1055},"end":{"line":1,"column":1142}}})) != null ? stack1 : "")
    + "\" data-click=\".\"></span>";
},"34":function(container,depth0,helpers,partials,data) {
    return "menu-item-icon-radio-blank";
},"36":function(container,depth0,helpers,partials,data) {
    return "menu-item-icon-check-blank";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"maxWidth") : stack1),"999",{"name":"if_eq","hash":{},"fn":container.program(39, data, 0),"inverse":container.program(41, data, 0),"data":data,"loc":{"start":{"line":1,"column":1311},"end":{"line":1,"column":1537}}})) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-title\" data-click=\"..\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCaption") || (depth0 != null ? lookupProperty(depth0,"pyCaption") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCaption","hash":{},"data":data,"loc":{"start":{"line":1,"column":1394},"end":{"line":1,"column":1407}}}) : helper)))
    + "</span>";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-title\" data-click=\"..\">"
    + ((stack1 = (lookupProperty(helpers,"addEllipsis")||(depth0 && lookupProperty(depth0,"addEllipsis"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyCaption") : depth0),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"maxWidth") : stack1),{"name":"addEllipsis","hash":{},"data":data,"loc":{"start":{"line":1,"column":1472},"end":{"line":1,"column":1517}}})) != null ? stack1 : "")
    + "</span>";
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-badge "
    + ((stack1 = container.lambda((depth0 != null ? lookupProperty(depth0,"badgeClass") : depth0), depth0)) != null ? stack1 : "")
    + "\" data-click=\"..\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyBadgeProperty") || (depth0 != null ? lookupProperty(depth0,"pyBadgeProperty") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyBadgeProperty","hash":{},"data":data,"loc":{"start":{"line":1,"column":1725},"end":{"line":1,"column":1744}}}) : helper)))
    + "</span>";
},"45":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-description\" data-click=\"..\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pySummary") || (depth0 != null ? lookupProperty(depth0,"pySummary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pySummary","hash":{},"data":data,"loc":{"start":{"line":1,"column":1839},"end":{"line":1,"column":1852}}}) : helper)))
    + "</span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\"#\" onclick=\"pd(event);\" class=\"menu-item-anchor "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDisabled") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":57},"end":{"line":1,"column":112}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":113},"end":{"line":1,"column":166}}})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"focusable") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":1,"column":168},"end":{"line":1,"column":231}}})) != null ? stack1 : "")
    + " role=\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyChecked") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":238},"end":{"line":1,"column":333}}})) != null ? stack1 : "")
    + "menuitem\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"touchable") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(17, data, 0),"data":data,"loc":{"start":{"line":1,"column":343},"end":{"line":1,"column":610}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pxEntryHandle") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":611},"end":{"line":1,"column":668}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyChecked") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(22, data, 0),"inverse":container.program(24, data, 0),"data":data,"loc":{"start":{"line":1,"column":669},"end":{"line":1,"column":811}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyChecked") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(32, data, 0),"data":data,"loc":{"start":{"line":1,"column":813},"end":{"line":1,"column":1192}}})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_item_icon_template"),depth0,{"name":"pzPega_menu_item_icon_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "<span class=\"menu-item-title-wrap\" data-click=\".\">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"maxWidth") : stack1),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.program(39, data, 0),"data":data,"loc":{"start":{"line":1,"column":1283},"end":{"line":1,"column":1625}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyBadgeProperty") : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1626},"end":{"line":1,"column":1761}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pySummary") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":1762},"end":{"line":1,"column":1869}}})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pzPega_menu_item_icon_template"),depth0,{"name":"pzPega_menu_item_icon_template","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</a>";
},"usePartial":true,"useData":true});
})();
//static-content-hash-trigger-GCC
/*

{{~#if this.pyImageSource~}} <span class="menu-item-image-wrapper" data-click="."> {{~#if_eq this.pyImageSource "styleclass"~}} <span role="presentation" class="menu-item-icon-imageclass {{{pyIconStyle}}}" data-click=".."></span> {{~/if_eq~}} {{~#if_eq this.pyImageSource "image"~}} <img role="presentation" class="menu-item-icon-image" src="{{pySimpleImage}}" align="absmiddle" data-click=".." /> {{~/if_eq~}} {{~#if_eq this.pyImageSource "property"~}} <img role="presentation" class="menu-item-icon-image" src="{{pyIconProperty}}" align="absmiddle" data-click=".." /> {{~/if_eq~}} </span> {{~/if~}}

*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzPega_menu_item_icon_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"menu-item-image-wrapper\" data-click=\".\">"
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyImageSource") : depth0),"styleclass",{"name":"if_eq","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":83},"end":{"line":1,"column":242}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyImageSource") : depth0),"image",{"name":"if_eq","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":243},"end":{"line":1,"column":410}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyImageSource") : depth0),"property",{"name":"if_eq","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":411},"end":{"line":1,"column":582}}})) != null ? stack1 : "")
    + "</span>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span role=\"presentation\" class=\"menu-item-icon-imageclass "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyIconStyle") || (depth0 != null ? lookupProperty(depth0,"pyIconStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyIconStyle","hash":{},"data":data,"loc":{"start":{"line":1,"column":187},"end":{"line":1,"column":204}}}) : helper))) != null ? stack1 : "")
    + "\" data-click=\"..\"></span>";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img role=\"presentation\" class=\"menu-item-icon-image\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pySimpleImage") || (depth0 != null ? lookupProperty(depth0,"pySimpleImage") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pySimpleImage","hash":{},"data":data,"loc":{"start":{"line":1,"column":342},"end":{"line":1,"column":359}}}) : helper)))
    + "\" align=\"absmiddle\" data-click=\"..\" />";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img role=\"presentation\" class=\"menu-item-icon-image\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyIconProperty") || (depth0 != null ? lookupProperty(depth0,"pyIconProperty") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyIconProperty","hash":{},"data":data,"loc":{"start":{"line":1,"column":513},"end":{"line":1,"column":531}}}) : helper)))
    + "\" align=\"absmiddle\" data-click=\"..\" />";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyImageSource") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":600}}})) != null ? stack1 : "");
},"useData":true});
})();
//static-content-hash-trigger-GCC