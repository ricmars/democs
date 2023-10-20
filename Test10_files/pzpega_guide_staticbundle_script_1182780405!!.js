var $pNamespace = pega.namespace;
$pNamespace("pega.ui");

// The editor is a singleton class which returns its public methods.
pega.ui.guide = (function() {
  var publicAPI = {}
  // Capture context at initialization
  var documentRef = document;
  var topHarness = $("[data-ui-meta*=\"'type\':\'Harness\'\"]", documentRef).first();
  if(topHarness.length===0){
    topHarness = $("[data-portalharnessinsname]", documentRef).first();
  }
  var desktopWindow = pega.desktop.support.getDesktopWindow();

  var _guidePanelWidth = 400;
  var _isClicked = false;
  var _isPanelMinimized;
  var _mouseMoveCounter = 0;
  var ANIMATION_DURATION = 333;
  var ANIMATION_EASING = "linear";
  var PANEL_TEMPLATE = "<div class='runtime-control-guide-tab'></div>" + 
      "<div class='runtime-control-guide-resize ui-resizable-handle ui-resizable-w'></div>" + 
      "<div class='pz-guide-panel-body'><div>";

  /////////////////////////////////////////////////////////////////////////////////
  //                                  PUBLIC API                                 //
  /////////////////////////////////////////////////////////////////////////////////
  /**
     * @private Handle the click of the guide button in portals.
     */
  function _handleClick() {
    // Prevent multi-click of button to avoid rendering errors
    if (!_isClicked) {
      _isClicked = true;
      pega.ui.guide.toggle();
      setTimeout(function() {
        _isClicked = false;
      }, ANIMATION_DURATION * 2);
    }
  }


  /**
     * Initialize guide panel markup, called when window is loaded 
     **/
  publicAPI.initialize = function() {

    //Create control panel template
    var oControlPanel = document.createElement("DIV");
    oControlPanel.className = "pz-guide-panel guide-hidden";
    oControlPanel.innerHTML = PANEL_TEMPLATE;

    //Check to see if the panel already exists and if so then just replace it
    if ($(document.body).find("div.pz-guide-panel").length > 0) {
      $(document.body).find("div.pz-guide-panel").replaceWith($(oControlPanel));
    } else {
      $(oControlPanel).appendTo(document.body);
    }

    // If the runtime toolbar top is present - set the top to the height of the bar
    /*runtimeTopbar = $("div[node_name=\"pzRuntimeToolsTopBar\"]").first();
    if(runtimeTopbar.length > 0) {
      topbarHeight = runtimeTopbar.height() + "px";
      $(".pz-guide-panel").css("bottom",  topbarHeight );
      $(".pz-guide-panel").css("height", "calc(100% - " + topbarHeight + ")" );
    }*/

    return publicAPI.loadSectionIntoDom("pzApplicationGuide_Panel", "@baseclass", $(".pz-guide-panel-body > div")[0]);
  }

  /**
     * @public Adds the information to the given element and then calls reloadSection API to retrieve the markup from the server
     * this is done because reloadSection handles the PegaOnlyOnce logic that prevents duplicate libraries from being loading more than once
     *
     * @param $String$ sectionName - The name of the section to be loaded
     * @param $String$ sectionClass - The class of the section to be loaded
     * @param $HTML Element$ elem - The HTML to load the section into
     * @param $String$ baseRef - The base reference of the section to be loaded
     */
  publicAPI.loadSectionIntoDom = function(sectionName, sectionClass, elem, baseRef) {

    // Set default section attributes
    elem.className = "sectionDivStyle";
    elem.id = "RULE_KEY";
    elem.setAttribute("node_type", "MAIN_RULE");
    elem.setAttribute("version", "1");
    elem.setAttribute("objclass", "Rule-HTML-Section");

    if(pega.ctx.isUITemplatized === true) elem.setAttribute("data-template", "");
    elem.setAttribute("name", "BASE_REF");
    elem.setAttribute("id", "RULE_KEY");
    elem.setAttribute("class", "sectionDivStyle");
    elem.setAttribute("node_name", sectionName);
    elem.setAttribute("data-node-id", sectionName);
    elem.setAttribute("pyclassname", sectionClass);

    if (baseRef && baseRef !== "") {
      elem.setAttribute("BASE_REF", baseRef);
    }
  }
  /**
     * @public Handles retrieving settings information from the server then animating in the side panel
     *
     * @param $Function$ callback - Callbakc function to be called after animation is complete
     */
  publicAPI.show = function(callback) {

    if(pega && pega.ui && pega.ui.gapidentifier && pega.ui.gapidentifier.isAgileWorkBenchOpen()){
      pega.ui.gapidentifier.toggle();
    }
    var $controlPanel = $(".pz-guide-panel");
    var element = $(".pz-guide-panel-body > div");
    if (element.length !== 0) {
      pega.u.d.reloadSection(element[0], "pzInitAppGuidePanelWrapper", "", false, false, -1, false, null, null, null, callback);
    }
    $controlPanel.removeClass("guide-hidden");
    $(".pz-guide-panel-body").removeClass("guide-hidden");
    $(".runtime-control-tree").addClass("loading");
    $(".runtime-control-guide-resize").css('display', "");

    //Set all parents heights to 100%
    var currentElement = $(".runtime-control-tree");
    while (currentElement.length !== 0 && !currentElement.hasClass("pz-guide-panel")) {
      currentElement.css("height", "100%");
      currentElement = currentElement.parent();
    }
    if ($('#js-toggle-runtime-editor').length !== 0) {
      $('#js-toggle-runtime-editor').attr("disabled", true);
    }
    /*disable Live UI when Application Guides is launched*/
    var uiInspElem = $('.ui-inspector',documentRef);
    if (uiInspElem.length !== 0) {
      uiInspElem.find("a").attr("disabled", true).addClass("disabledStyle").children("i").attr("disabled", true).addClass("disabledStyle");
      uiInspElem.find("button").attr("disabled", true).addClass("disabledStyle");
      uiInspElem.attr("disabled", true);
    }
    /*disable Agile Workbench when Application Guides is  launched, added to differentiate between current work and agile workbench as current work was also getting disabled*/
    var gapInsElem = $('.gapid_icon',documentRef).filter(function(index){
      return !($(this).hasClass("no-padding"));
    });
    if (gapInsElem.length !== 0) {
      if(gapInsElem.find("a").children("i")){
        gapInsElem.find("a").attr("disabled", true).addClass("disabledStyle").children("i").attr("disabled", true).addClass("disabledStyle");
        gapInsElem.attr("disabled", true);  
        gapInsElem.find("button").attr("disabled", true).addClass("disabledStyle");
        /*Remove data click on icon when disabled so as not to enable to agile workbench when application guide is open*/
        gapInsElem.find("i").removeAttr("data-click");
      }

    }
    var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
    if (toolbar) {
      toolbar.classList.add("disable-slide");
    }
    _guidePanelWidth = 400;
    _animatePanel();
    callback();
  }

  /**
     * @public checks if the right panel is open is called from pzpega_ui_guide
     *
     */
  publicAPI.isApplicationGuideOpen = function(){
    var isOpen = false;
    var $controlPanel = $(".pz-guide-panel",documentRef);
    if($controlPanel  && $controlPanel.hasClass("showing")){
      isOpen = true;
    }
    return isOpen;
  }


  /**
     * @private Called from show to animate the panel into place
     *
     * @param $Function$ callback - Callback function passed into show to be called when animation is finished
     **/
  function _animatePanel(callback) {
    //Slide in panel by reducing the width of the rest of the screen
    topHarness.css({
      'position': 'absolute',
      'left': '0',
      'right': '0',
      'min-width': '0'
    });

    var right;
    var TempPanelWidth;
    if (_guidePanelWidth > topHarness.width()) {
      right = topHarness.width() - (100) + "px";
      TempPanelWidth = topHarness.width() - (100);
    } else if (_guidePanelWidth < 10) {
      right = "10px"
      TempPanelWidth = 10;
    } else {
      right = _guidePanelWidth + "px";
      TempPanelWidth = _guidePanelWidth;
    }

    if (_isPanelMinimized) {
      right = "0px";
      TempPanelWidth = "0";
    }
    topHarness.animate({
      right: right
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {});

    if (_isPanelMinimized)
      $('.runtime-control-guide-tab').addClass('runtime-control-guide-tab-min');
    else
      $('.runtime-control-guide-tab').addClass('runtime-control-guide-tab-max');

    $(".pz-guide-panel").animate({
      width: TempPanelWidth + "px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {
      $(".pz-guide-panel").addClass("showing");

      if (!$(".pz-guide-panel").hasClass("ui-resizable")) {
        _resizeTree();
      }

      // Add active class to the tree
      setTimeout(function() {
        $('.pz-guide-panel').addClass("pz-guide-panel-active")
      }, 250);
    });
  }
  /**
     * @private If screen layout is using flex, make necessary updates based on right panel size
     **/
  function _updateScreenLayoutFlex(rightPanelWidth) {
    // US-152932 handling width of main middle when inspector is opened
    if($(".screen-layout").hasClass("flex")) {

      var rightWidth, widthToBeSubtracted, leftWidth;
      var clientWidth = $(window).width();
      leftWidth = $(".screen-layout-region-main-sidebar1").outerWidth() || 0;
      rightWidth = $(".screen-layout-region-main-sidebar2").outerWidth() || 0;

      widthToBeSubtracted = leftWidth + rightWidth + parseInt(rightPanelWidth);

      $('.screen-layout-region-main-middle').css({ 'width': (clientWidth - widthToBeSubtracted) + 'px' });
    }        
  }
  /**
     * @public Handles animating the side panel off screen
     *
     * @param $Function$ callback - Callback function to be called after animation is complete
     */
  publicAPI.hide = function(callback) {
    if ($('#js-toggle-runtime-editor',documentRef).length !== 0) {
      $('#js-toggle-runtime-editor',documentRef).removeAttr("disabled");
    }
    $('.screen-layout-region-main-middle').css({
        'width': ''
      });
    /*enable Live UI when Application Guides is not launched*/
    var uiInspElem = $('.ui-inspector',documentRef);
    if (uiInspElem.length !== 0) {
      uiInspElem.find("a").removeAttr("disabled").removeClass("disabledStyle").children("i").removeAttr("disabled").removeClass("disabledStyle");
      uiInspElem.find("button").removeAttr("disabled").removeClass("disabledStyle");
      uiInspElem.removeAttr("disabled");
    } 
    /*enable Agile Workbench when Application Guides is not launched, added to differentiate between current work and agile workbench as current work was also getting disabled*/
    var gapInsElem = $('.gapid_icon',documentRef).filter(function(index){
      return !($(this).hasClass("no-padding"));
    });
    if (gapInsElem.length !== 0) {
      gapInsElem.find("a").removeAttr("disabled").removeClass("disabledStyle").children("i").removeAttr("disabled").removeClass("disabledStyle");
      gapInsElem.removeAttr("disabled");
      gapInsElem.find("button").removeAttr("disabled").removeClass("disabledStyle");
      gapInsElem.find("i").attr("data-click","[[\"runScript\", [\"checkForExtension_GI()\"]],[\"runScript\", [\"pega.ui.gapidentifier.toggle()\"]]]");
    }

    var $controlPanel = $(".pz-guide-panel", documentRef);
    state = false;
    topHarness.animate({
      right: "0px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {
      $controlPanel.removeClass("showing");
      $controlPanel.addClass("guide-hidden");
      $(".runtime-control-guide-resize", documentRef).css('display', "none");
      var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
      if (toolbar) {
        toolbar.classList.remove("disable-slide");
      }
    });

    $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-min');
    $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-max');

    $controlPanel.animate({
      width: "0px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {

      $('.pz-guide-panel', documentRef).removeClass("pz-guide-panel-active");

      callback();

    });
  }

  /**
     * @public Handles stopping event propagation for the given event. This is how we suppress events at the window level
     *
     * @param $Event$ e - The event object for the event
     */
  publicAPI.handleSupression = function(e) {

    if (e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    return false;
  }
  publicAPI.minimizeToggle = function() {

    if (pega.u.d.portalName === "pxExpress") {
      pega.ui.agPanelExpress.toggleOnCaptureOrRecord();
      return;
    }

    topHarness.css({
      'position': 'absolute',
      'left': '0'
    });
    if (topHarness.attr("_isPanelMinimized")==="true") {
      // If the current _guidePanelWidth is larger than the screen then
      if (_guidePanelWidth > $(window).width() - 100) {
        _guidePanelWidth = $(window).width() - 100;
      }
      topHarness.css('right', _guidePanelWidth + "px");
      $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-min');
      $('.runtime-control-guide-tab', documentRef).addClass('runtime-control-guide-tab-max');
      $(".pz-guide-panel", documentRef).css('width', _guidePanelWidth + "px");
      $(".pz-guide-panel-body", documentRef).removeClass("guide-hidden");
      topHarness.attr("_isPanelMinimized",false);

    } else {
      topHarness.attr("_isPanelMinimized",true);
      var newPanelWidth = 0;
      topHarness.css('right', newPanelWidth + "px");
      $('.runtime-control-guide-tab', documentRef).addClass('runtime-control-guide-tab-min');
      $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-max');
      $(".pz-guide-panel", documentRef).css('width', newPanelWidth + "px");
      $(".pz-guide-panel-body", documentRef).addClass("guide-hidden");
      $('.screen-layout-region-main-middle').css({
        'width': ''
      });
    }
  }

  publicAPI.maximizeToggle = function() {

    if (pega.u.d.portalName === "pxExpress") {
      pega.ui.agPanelExpress.toggleOnCaptureOrRecord();
      return;
    }

    topHarness.css({
      'position': 'absolute',
      'left': '0'
    });

    // If the current _guidePanelWidth is larger than the screen then
    if (_guidePanelWidth > $(window).width() - 100) {
      _guidePanelWidth = $(window).width() - 100;
    }
    topHarness.css('right', _guidePanelWidth + "px");
    $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-min');
    $('.runtime-control-guide-tab', documentRef).addClass('runtime-control-guide-tab-max');
    $(".pz-guide-panel", documentRef).css('width', _guidePanelWidth + "px");
    $(".pz-guide-panel-body", documentRef).removeClass("guide-hidden");
    topHarness.attr("_isPanelMinimized",false);
    _updateScreenLayoutFlex(_guidePanelWidth);
  }


  /**
     * @private Handles enabling the resize ability for the side panel
     **/
  function _resizeTree() {

    var el = $(".pz-guide-panel");
    var count = el.outerWidth();
    el.css({
      'right': '0',
      'left': ''
    });
    //Sets rest of screen to absolute so it can be positioned
    desktopWindowCSSPosition = topHarness.css('position');
    topHarness.css({
      'position': 'absolute',
      'left': '0',
      'right': count + 'px',
      'min-width': '0'
    });
    _updateScreenLayoutFlex(count);

    var tempMouseUpHandler = function(e) {
      //Remove mouse up from window
      window.removeEventListener("mouseup", tempMouseUpHandler, true);

      //  $(document).triggerHandler("mouseup");
      return;
    };

    //Add mouse up event on capture phase
    $(".runtime-control-guide-resize")[0].addEventListener("mouseup", tempMouseUpHandler, true);

    //Define jquery objects outside of the resize event. This is a performance hit as resize
    //occurs on each mouse move and there is no need to reparse the dom to find the same
    //dom element
    _windowOuterWidth = $(window).outerWidth();


    $(".pz-guide-panel").css({
      'right': '0',
      'left': ''
    });

    $(".pz-guide-panel", documentRef).resizable({
      handles: {
        'w': '.runtime-control-guide-resize'
      },
      resize: function(event, ui) {

        var el = ui.element;
        var count = el.width();
        el.css({
          'right': '0',
          'left': ''
        });
        //Dont allow the resize to be bigger than the screen size
        if (count > _windowOuterWidth - 100) {

          count = _windowOuterWidth - 100;
          el.css({
            'width': count + 'px'
          });
        }

        //resize the screen to acount for width of panel
        topHarness.css({
          'right': count + 'px'
        });
        _updateScreenLayoutFlex(count);

      },
      start: function(event, ui) {

        topHarness.css({
          'position': 'absolute',
          'left': '0',
          'min-width': '0'
        });
        $(document.body).append("<div class='ui-guide-tree-mask'></div>");

      },
      stop: function(event, ui) {
        var runtimeControlPanelElement = $(".pz-guide-panel");

        runtimeControlPanelElement.queue(function() {
          $(".pz-guide-panel").dequeue();
        });

        _guidePanelWidth = runtimeControlPanelElement.outerWidth();
        _isPanelMinimized = false;

        //Remove masking div
        $(".ui-guide-tree-mask").remove();
      }
    });




    //Onclick of the drag handle
    $(".runtime-control-guide-tab").click(function() {
      publicAPI.minimizeToggle(true);
    });
  }

  /**
     * @public Toggles guide on or off
     */
  publicAPI.toggle = function() {

    // If we are in offline mode do not toggle, return instead
    if (pega && pega.offline) {
      return;
    }

    if(pega.ui && pega.ui.composer && pega.ui.composer.isActive() && pega.ui.composer.toggleGuide) {
      window.parent.pega.ui.composer.toggleGuide();
      return;
    }

    if ($('.pz-guide-tool').hasClass('noClick')) {
      $('.pz-guide-tool').removeClass('noClick');
      return false;
    }
    var hideCallBack = function() {
      //Post Hide code can be handled here
      /*var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
            var postDataURL = new SafeURL();
            strUrlSF.put("pyActivity", "pzClearguidePages");
            var callback = function() {
                //Activity response
            }

            return pega.u.d.asyncRequest('POST', strUrlSF, callback, postDataURL);
            */
    }
    var showCallBack = function() {
      //Post Show code can be handled here

    }
    if ($(".pz-guide-panel-active", documentRef).length !== 0) {
      publicAPI.hide(hideCallBack);
    } else {
      if($(".runtime-control-panel-active",documentRef).length===0){

        publicAPI.show(showCallBack);
      }

    }
  }



  /**
     * @public Toggles guide from inside the iframe
     */
  publicAPI.toggleAGFromIframe = function() {
    if(pega.ui && pega.ui.composer && pega.ui.composer.isActive() && pega.ui.composer.toggleGuide) {
      pega.ui.composer.toggleGuide();
    } else {
      documentRef = document;
      publicAPI.toggle();
    }
  }

  /**
     * @public Toggles guide from inside the iframe
     */
  publicAPI.toggleCompleteRejectItem = function(event) {
    var target = event.target || event.srcElement;
    var rowElem = $(target).parents(".pz-guide-item-row");
    if(rowElem.hasClass("visible")) {
      rowElem.removeClass("visible");
      rowElem.children(".item-2").children("div").css("right", "");
    } else {
      rowElem.parents("div[node_name='pzAssetContent']").find(".pz-guide-item-row.visible").each( function(){
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

  return publicAPI;
})();
window.addEventListener("load", function() {
  pega.ui.guide.initialize();
});
//static-content-hash-trigger-YUI