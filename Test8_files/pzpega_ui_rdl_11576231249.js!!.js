pega.ui.RDL = {
  attachScrubberEvents: function (container) {
    pega.ctx.dom.$(".rdl-scrubber").each(function (index, rdlScrubberDiv) {
      var rdlWrapperMainDiv = rdlScrubberDiv.parentNode.firstElementChild;

      /* Register the anchors for scrolling */
      pega.u.d.registerSinglePageNav(rdlScrubberDiv, rdlWrapperMainDiv);

      var $rdlWrapperMainDiv = $(rdlWrapperMainDiv);
      var $rdlScrubberDiv = $(rdlScrubberDiv);

      var $anchors = $rdlScrubberDiv.find("a[href^='#']").filter(function () {
        return this.href.match(/#[a-zA-Z]/);
      });

      var highlightAnchors = function () {
        $anchors.each(function (index, anchorElement) {
          var targetSection = $rdlWrapperMainDiv.find("a[id='" + anchorElement.hash.substring(1) + "']").first();
          /* BUG-248057: Fix for Firefox - hidden anchors have height overlapping with the previous element. Made changes in registerSinglePageNav function */
          targetSection = targetSection.next().get(0);

          if (pega.u.d.isSectionCurrentlyInView(targetSection, rdlWrapperMainDiv)) {
            $anchors.removeClass("Strong");
            $(anchorElement).addClass("Strong");
          }
        });
      };

      /* Register the highlight with scrolling */
      $rdlWrapperMainDiv.on("scroll", function () {
        highlightAnchors();
      });

      highlightAnchors();
    });
  },
  /* US-184152 : Implicitly trigerring pagination to add more rows so that pagination can be enabled on scroll */
  triggerAsyncBasedOnScrollHeight: function (bodyScrollRDL, rdlScrollParent, isContainerScroll) {
    var maxHeightForContainer = 0,
        autoScrollRequired,
        rdlNode,
        rdlScrollParentAlias;
    if (bodyScrollRDL.offsetHeight == 0) return;
    rdlNode = bodyScrollRDL;
    if (isContainerScroll) {
      maxHeightForContainer = parseInt($(rdlNode).css("max-height"), 10);
    } else {
      if (rdlScrollParent == document) {
        rdlScrollParentAlias = rdlScrollParent.body;
      } else {
        rdlScrollParentAlias = rdlScrollParent;
      }
    }
    $(".lazyload-layout").css("display", "none");
    autoScrollRequired = isContainerScroll ? rdlNode.offsetHeight < maxHeightForContainer : rdlScrollParentAlias.scrollHeight <= rdlScrollParentAlias.clientHeight;
    $(".lazyload-layout").css("display", "");
    if (autoScrollRequired) {
      var currentIndex = this.getNextRowIndex(rdlNode);
      //currentIndex = rdlNode && rdlNode.children.length;
      var pageSize = rdlNode.getAttribute("data-pagesize");
      pega.ctx.RDL.isLoading = true;
      /* Call loadPage */
      var pyUniqueID = rdlNode.getAttribute("data-uniqueid");
      setTimeout(function () {
        pega.ui.template.pzRDLTemplate.loadPage(currentIndex, pageSize, rdlNode, event, function () {
          pega.ui.RDL.triggerAsyncBasedOnScrollHeight(bodyScrollRDL, rdlScrollParent, isContainerScroll);
        });
      }, 0);
    }
  },

  attachScrollEvents: function (scrollType, container) {
    if (!container) {
      container = document;
    } else if (container.target) {
      container = container.target;
    }

    if ($(container).hasClass("progressive-bodyScroll") || $(container).hasClass("progressive-rdlScroll")) {
      /* In case of LDP container itself is RDL. So chech if RDL  */
      container = container.parentNode;
    }
    if (!scrollType || scrollType == "bodyScroll") {
      pega.ui.RDL.scrollTrigger = function (event) {
        /* For body scroll, when the height is not specified on the rdl */
        var rdlNode = pega.ctx.dom.getElementById("RDL_PAGINATE");
        /* BUG-268215: Checking if RDL is visible. Revisit this block to see if it can be moved inside timeout. */
        if (!rdlNode || !$(rdlNode).is(":visible")) {
          if (rdlNode) {
            rdlNode.removeAttribute("id");
          }
          rdlNode = $(pega.ctx.dom.getContextRoot()).find(".progressive-bodyScroll:visible");
          rdlNode = rdlNode && rdlNode.get(0);
        }
        if (rdlNode && rdlNode.classList.contains("progressive-bodyScroll")) {
          rdlNode.setAttribute("id", "RDL_PAGINATE");
          $(rdlNode).addClass("rdl-loading");
          clearTimeout($.data(this, 'scrollTimer'));
          $.data(this, 'scrollTimer', setTimeout(function () {
            if (!pega.ctx.RDL.isLoading && $(rdlNode).hasClass("progressive-bodyScroll")) {
              pega.ui.RDL.paginate(rdlNode, "bodyScroll", event);
            } else {
              $(rdlNode).removeClass("rdl-loading");
            }
          }, 250));
          window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
        }
      };
      var harnessElement = {};
      var sectionId = "";
      /* Find the scroll parent and attach the scroll event to it*/
      var bodyScrollRDL = $(container).find(".progressive-bodyScroll");
      if (bodyScrollRDL && bodyScrollRDL.get(0)) {
        bodyScrollRDL = bodyScrollRDL.get(0);
      /*BUG-387731 : Initialize layoutgroups before invoking runtime calculations for scrollbar*/
      if ($(bodyScrollRDL).css("max-height") == "none") {
        window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
      }
        var rdlScrollParent = $(bodyScrollRDL).scrollParent();
        if(rdlScrollParent.length > 0) {
          rdlScrollParent = rdlScrollParent[0];/* BUG-387940: Use single node */
        }
        /*BUG-269811 - checks whether rdlScrollParent contains scrollbar*/
        /*while(rdlScrollParent[0].tagName !="MAIN" && rdlScrollParent[0].scrollHeight <= rdlScrollParent[0].clientHeight ){
          rdlScrollParent = $(rdlScrollParent).scrollParent();
        }*/
        if (rdlScrollParent == document || rdlScrollParent.tagName == "BODY") {
          if (!$(document.body).hasClass("rdl-scrolllistener")) {
            $(window).on("scroll", pega.ui.RDL.scrollTrigger);
            $(document.body).addClass("rdl-scrolllistener");
            harnessElement.scrollElement = "window";
            sectionId = pega.u.d.getSectionId(pega.u.d.getSectionDiv(bodyScrollRDL));
          }
        } else if (!rdlScrollParent.classList.contains("rdl-scrolllistener")) {
          var rdlScrollParentJquery = $(rdlScrollParent);
          rdlScrollParentJquery.on("scroll", pega.ui.RDL.scrollTrigger);
          rdlScrollParentJquery.addClass("rdl-scrolllistener");
          harnessElement.scrollElement = rdlScrollParent; /* BUG-387940: Add correct element so that scroll event gets removed */
          sectionId = pega.u.d.getSectionId(pega.u.d.getSectionDiv(bodyScrollRDL));
        }
        if(harnessElement.scrollElement) {
          
          harnessElement.nullify = function() {
            var container, scrollElement;
            if(typeof this.scrollElement == "string" && this.scrollElement == "window") {
              container = document.body;
              scrollElement = window;
            } else if(typeof this.scrollElement == "object") {
              container = this.scrollElement;
              scrollElement = this.scrollElement;
            }
            
            $(scrollElement).off("scroll", pega.ui.RDL.scrollTrigger);
            $(container).removeClass("rdl-scrolllistener");
            this.scrollElement = null;
          };
          pega.u.d.registerAsHarnessElement(harnessElement, sectionId);
        }
        
        pega.ui.RDL.triggerAsyncBasedOnScrollHeight(bodyScrollRDL, rdlScrollParent);
      }
    }
    if (!scrollType || scrollType == "rdlScroll") {
      /* For specific rdl scroll, when the height is specified on the rdl */
      $(container).find(".progressive-rdlScroll").each(function (index, rdlNode) {
        if (!$(rdlNode).hasClass("rdl-scrolllistener")) {
          harnessElement = {};
          var maxHeight = $(rdlNode).css("max-height");
          maxHeight = parseInt(maxHeight);
          $(rdlNode).addClass("rdl-scrolllistener");
          var scrollFn = function () {
            /* Spinner should be visible only when the rdl is scrollable */
            if (maxHeight && $(rdlNode).height() == maxHeight) {
              $(rdlNode).addClass("rdl-loading");
            }
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function () {
              if (!pega.ctx.RDL.isLoading && $(rdlNode).hasClass("progressive-rdlScroll")) {
                pega.ui.RDL.paginate(rdlNode, "rdlScroll");
              } else {
                $(rdlNode).removeClass("rdl-loading");
              }
            }, 250));
            window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
          };
          $(rdlNode).on("scroll", scrollFn);
          harnessElement.scrollElement = rdlNode;
          sectionId = pega.u.d.getSectionId(pega.u.d.getSectionDiv(rdlNode));
          
          if(harnessElement.scrollElement) {
          
            harnessElement.nullify = function() {
              $(this.scrollElement).off("scroll", pega.ui.RDL.scrollTrigger);
              $(this.scrollElement).removeClass("rdl-scrolllistener");
              this.scrollElement = null;
            };
            pega.u.d.registerAsHarnessElement(harnessElement, sectionId);
          }
          pega.ui.RDL.triggerAsyncBasedOnScrollHeight(rdlNode, rdlScrollParent, true);
        }
      });
    }
  },
  
  getNextRowIndex: function(rdlNode) {
    var currentIndex = 0; /* If RDL is empty then return 1 */
    
    // BUG-434692: Due to the drag drop paradigm it is not a safe assumption to rely on lastElementChild for progressively-loaded
    // situations. Instead, obtain the max index from the child nodes of the RDL
    var maxIndex = 0;
    for(var i = 0; i < rdlNode.children.length; i++) {
        var currentChild = rdlNode.children[i];
        var base_ref = currentChild.getAttribute("base_ref");
        if(base_ref) {
            var currentBaseRefIndex = parseInt(base_ref.substring(base_ref.lastIndexOf("(") + 1, base_ref.length - 1), 10);
            if(currentBaseRefIndex > maxIndex) {
                maxIndex = currentBaseRefIndex;
            }
        }
    }
    currentIndex = maxIndex; 
    return ++currentIndex;
  },

  paginate: function (rdlNode, scrollType, event) {
    /* 
      setting correct context before making pagination call
      SE-68281
    */
    var currentContext = pega.ctxmgr.getCurrentHarnessContext();
    var harnessContext = pega.ctxmgr.getContextByTarget(rdlNode);
    pega.ctxmgr.setContext(harnessContext);
    if (pega.ui.RDL.evaluateScrollPosition(rdlNode, scrollType)) {
      /* Calculate the page index */
      // var currentIndex = rdlNode && rdlNode.children.length+1;
      var currentIndex;
      if(rdlNode) {/* US-182707: Calculate currentIndex based on base_ref as rdlNode.lastChild.length is not correct index in case of row visibility */
        currentIndex = this.getNextRowIndex(rdlNode);
      }
      /* Get the page size */
      var pageSize = rdlNode.getAttribute("data-pagesize");

      if (currentIndex < pageSize) {
        // EOF reached
        var tempDiv = document.createElement("div");
        pega.ctx.RDL.isLoading = false;
        pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(rdlNode, tempDiv, null);
        return;
      }
      pega.ctx.RDL.isLoading = true;
      
      
      /* Call loadPage */
      var pyUniqueID = rdlNode.getAttribute("data-uniqueid");
      setTimeout(function () {
        pega.ui.template.pzRDLTemplate.loadPage(currentIndex, pageSize, rdlNode, event);
        $(rdlNode).removeClass("rdl-loading");
      }, 0);
    } else {
      $(rdlNode).removeClass("rdl-loading");
      pega.ctx.RDL.isLoading = false;
    }
    pega.ctxmgr.resetContext(currentContext);
  },
  evaluateScrollPosition: function (rdlNode, scrollType) {
    var bScroll = false;
    if (scrollType == "bodyScroll") {
      var viewPortHeight = window.innerHeight;
      var rdlTop = 0;
      if (rdlNode.getClientRects()[0]) rdlTop = rdlNode.getClientRects()[0].top;
      var rdlNodeHeight = rdlNode.clientHeight;
      // Subtracting 40 for the loader
      bScroll = rdlTop + rdlNodeHeight - 40 <= viewPortHeight;
    } else {
      var rdlScrollTop = rdlNode.scrollTop;
      var rdlOffsetHeight = rdlNode.offsetHeight;
      var rdlScrollHeight = rdlNode.scrollHeight;
      // Adding 40 for the loader
      bScroll = rdlScrollTop + rdlOffsetHeight + 40 >= rdlScrollHeight;
    }
    return bScroll;
  },
  
  /* 
    User Story : US-383090
    Accessibility changes start 
  */
  
  filterHiddenElements: function(elements){
    // filtering hidden elements
    if(!elements) return [];
    elements = Array.from(elements);
    return elements.filter(function(node){
      if(!node.style || isNaN(node.offsetWidth)) return true;
      return !(node.style.display === "none" || node.style.visibility === "hidden" || node.offsetWidth === 0);
    });
  },
  
  getInnerElementsFromRDLRow: function(rdlRow){
    if(!rdlRow) return [];
    // BUG-742023 Consider the Dynamic Layout div having role and tabIndex defined as focusable children of rdlRow
    var children = rdlRow.querySelectorAll('img,i,input,a,button,textarea,select,div[bsimplelayout][role][tabIndex]');
    // Collecting nested RDLs and Grids 
    var innerRDLs = Array.from(rdlRow.querySelectorAll('[data-uniqueid*="RDL"]') || []);
    var innerGrids = Array.from(rdlRow.querySelectorAll('[id="PEGA_GRID_CONTENT"]') || []);
    if(!children) return [];
    children = Array.from(children);
    // iterating every element
    // this will internally consider case of any child element which is part of any RDL/Grid/DL or any other structure
    children = pega.ui.RDL.filterHiddenElements(children);
    innerRDLs = pega.ui.RDL.filterHiddenElements(innerRDLs);
    innerGrids = pega.ui.RDL.filterHiddenElements(innerGrids);
    // filtering all children which are part of nested Grid or RDL
    children = children.filter(function(node){
      var isPartOfRDLOrGrid = false;
      for(var i=0; i<innerRDLs.length; i++){
        if(innerRDLs[i].contains(node)){
          isPartOfRDLOrGrid = true;
          break;
        }
      }
      for(var i=0; i<innerGrids.length; i++){
        if(innerGrids[i].contains(node)){
          isPartOfRDLOrGrid = true;
          break;
        }
      }
      return !isPartOfRDLOrGrid;
    });
    // adding inner RDL or Grids 
    children = children.concat(innerRDLs);
    children = children.concat(innerGrids);
    // returned children can have controls (example : text, img) , RDLs or Grids which are child of RDL row
    return children;
  },
  
  changeElementsTabIndex: function(node, index, considerPreviousTabIndex){
    // changing tab index for elements
    var children = pega.ui.RDL.getInnerElementsFromRDLRow(node);
    if(children && children.length > 0){
      children.forEach(function(child){
        var tabIndex = child.getAttribute('tabindex');
        if(!(considerPreviousTabIndex && tabIndex === '0'))
          child.setAttribute('tabindex', index);
      });
    }
  },
  
  changeTabIndexOfRDLNodes: function(rdlNode, index){
    if(!rdlNode) return;
    var baseNodes = rdlNode.childNodes;
    baseNodes = pega.ui.RDL.getFirstLevelBaseReferences(baseNodes);
    if(baseNodes && baseNodes.length > 0){
      baseNodes.forEach(function(child){
          child.setAttribute('tabindex', index);
      });
    }
  },
  
  focusFirstFormElement: function(node){
    // placing focus on first 
    var children = pega.ui.RDL.getInnerElementsFromRDLRow(node);
    if(children && children.length > 0){
      children[0].focus();
    }
  },
  
  addARIAToAllRequiredElements:function(node, ariaAttr, value){
    // adding aria attributes to all inner elements
    var children = pega.ui.RDL.getInnerElementsFromRDLRow(node);
    if(children && children.length > 0){
      children = Array.from(children);
      children.forEach(function(child){
        child.setAttribute(ariaAttr, value);
      });
    }
  },
  
  addColIndexToAllRequiredElements: function(node){
    // adding col index to all required elements
    // case for hidden elements is considered
    var children = pega.ui.RDL.getInnerElementsFromRDLRow(node);
    if(children && children.length > 0){
      children = Array.from(children);
      var index = 0;
      children.forEach(function(child){
        child.setAttribute('aria-colindex', index+'');
        index++;
      });
    }
  },
  
  getFocusableElements: function(rdlCell){
    // returing focusable inner elements
    var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
    var focusableElementList = [];
    for(var i=0; i<children.length; i++){
      focusableElementList.push(children[i]);
    }
    return focusableElementList;
  },
  
  getFirstLevelBaseReferences: function(baseNodes){
    if(!baseNodes || baseNodes.length === 0) return [];
    baseNodes = Array.from(baseNodes);
    // filtering and getting first level base references
    return baseNodes.filter(function(node){
      if(node.getAttribute){
        if(node.style.display === "none" || node.style.visibility === "hidden") return false;
        if(node.getAttribute('data-node-id') === "pyRDLNoMoreData") return true;
        return !!node.getAttribute('base_ref');
      }
      return false;
    });
  },
  
  createRDLCellContext: function(rdlCell, uniqueId){
    if(!rdlCell) return;
    if(!pega.ctx.accessRDLCellContext) pega.ctx.accessRDLCellContext = {};
    var base_ref = rdlCell.getAttribute('base_ref');
    var previousContext = pega.ctx.accessRDLCellContext[uniqueId + base_ref];
    if(!base_ref || (previousContext && previousContext.active)) return;
    var focusableElementList = pega.ui.RDL.getFocusableElements(rdlCell);
    pega.ctx.accessRDLCellContext[uniqueId + base_ref] = {
      nodes: focusableElementList,
      currentIndex: 0,
      active: false
    };
  },
  
  getRDLNodeFromTarget: function(target){
    if(!target) return null;
    var rdlNode = target.closest("div[data-repeat-source]");
    return rdlNode;
  },
  
  getRDLCellFromTarget: function(target){
    var base_ref = null;
    var rdlCellContext = null;
    var maxLevelCount = 50;
    while(!rdlCellContext){
      // threshold limit reached, DOM is of greater complexity
      if(maxLevelCount === 0) return null;
      if(!target) return null;
      base_ref = target.getAttribute && target.getAttribute('base_ref');
      if(base_ref){
        var rdlNode = pega.ui.RDL.getRDLNodeFromTarget(target);
        var uniqueId = rdlNode && rdlNode.getAttribute('data-uniqueid');
        rdlCellContext = pega.ctx.accessRDLCellContext[uniqueId + base_ref];
      }
      if(rdlCellContext) return target;
      target = target.parentElement;
      maxLevelCount--;
    }
  },
  
  handleRDLCellEvent: function(ev){
      // get closest rdl cell and find its reference from accessRDLCellContext
      var rdlCell = pega.ui.RDL.getRDLCellFromTarget(ev.target);
      if(!rdlCell) return;
      var base_ref = rdlCell.getAttribute('base_ref');
      var rdlNode = pega.ui.RDL.getRDLNodeFromTarget(ev.target);
      var uniqueId = rdlNode.getAttribute('data-uniqueid');
      var key = uniqueId + base_ref;
      var rdlCellContext = pega.ctx.accessRDLCellContext[key];
      var nodes = pega.ui.RDL.getFocusableElements(rdlCell);
      var currentIndex = rdlCellContext.currentIndex;
      if (!nodes || nodes.length === 0) return;
      switch(ev.keyCode){
        case 27: {
          // esc key press, moving out from rdl cell
          if(ev.target)
          pega.ui.RDL.changeElementsTabIndex(rdlCell, '-1');
          pega.ctx.accessRDLCellContext[key].currentIndex = 0;
          pega.ctx.accessRDLCellContext[key].active = false;
          rdlCell.setAttribute('aria-label', rdlRowViewDetails);
          ev.stopPropagation();
          break;
        }
        case 39: {
          // right arrow press
          //ev.stopPropagation();
          if(!rdlCellContext.active) return;
          ev.stopPropagation();
          ev.preventDefault();
          if(currentIndex === nodes.length - 1) return;
          pega.ui.RDL.changeElementsTabIndex(rdlCell, '-1');
          pega.ui.RDL.addARIAToAllRequiredElements(rdlCell, 'aria-hidden', 'true');
          currentIndex++;
          nodes[currentIndex].setAttribute('tabindex','0');
          nodes[currentIndex].removeAttribute('aria-hidden');
          nodes[currentIndex].focus();
          pega.ctx.accessRDLCellContext[key].currentIndex = currentIndex;
          break;
        }  
        case 37: {
          // left arrow press
          //ev.stopPropagation();
          if(!rdlCellContext.active) return;
          ev.stopPropagation();
          ev.preventDefault();
          if(currentIndex === 0) return;
          pega.ui.RDL.changeElementsTabIndex(rdlCell, '-1');
          pega.ui.RDL.addARIAToAllRequiredElements(rdlCell, 'aria-hidden', 'true');
          currentIndex--;
          nodes[currentIndex].setAttribute('tabindex','0');
          nodes[currentIndex].removeAttribute('aria-hidden');
          nodes[currentIndex].focus();
          pega.ctx.accessRDLCellContext[key].currentIndex = currentIndex;
          break;
        }
        case 40: 
        case 38:{
          var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
          if(rdlCellContext.active && children.length !== 1) {
            ev.stopPropagation();
            return;
          };
          break;
        }
        default: {
          console.log("invalid key code given");
        }
     }      
  },
  
  addArrowKeyEventListener: function(rdlNode, id){
    if(rdlNode && rdlNode.offsetHeight > 0) {
      var _self = this;
      if(!_self.eventTracker) _self.eventTracker = {};
      else {
        // clearing all existing handlers
        var handlerObjs = _self.eventTracker[id];
        if(handlerObjs && handlerObjs.length > 0){
          handlerObjs.forEach(function(handlerObj){
            var events = Object.keys(handlerObj);
            events.forEach(function(event){
              rdlNode.removeEventListener(event, handlerObj[event]);
            });
          });
        }
      }
      // handler for keydown event
      var keyDownHandler = function(ev){
       try{
        var targetIsUserInput = (ev.target.tagName === "INPUT" && ev.target.type === "text") || ev.target.tagName === "TEXTAREA";
         
        if(targetIsUserInput) return;
        var targetIsRDLRow = ev.target === ev.target.closest("div[data-repeat-source]>div[name='BASE_REF']");
        // returning if enter key isn't pressed on RDL node
        if(!targetIsRDLRow && ev.keyCode === 13) return;
        // event target was part of any RDL present in RDL row
        var targetIsInnerRDL = (ev.target.getAttribute('data-uniqueid') && ev.target.getAttribute('data-uniqueid').indexOf('RDL') !== -1);
        if(targetIsInnerRDL){
          // focus first RDL row 
          pega.ui.RDL.attachAccessibilityEventsToAnRDLNode(ev.target);
          var baseNodes = ev.target.childNodes;
          baseNodes = pega.ui.RDL.getFirstLevelBaseReferences(baseNodes);
          baseNodes.length && baseNodes[0].focus();
          return;
        }
        var targetIsNoMoreLoadDataSection = ev.target.getAttribute('data-node-id') === "pyRDLNoMoreData";
        // if event is bubbled up from any control inside RDL row
        if(!targetIsNoMoreLoadDataSection && !targetIsRDLRow){
          pega.ui.RDL.handleRDLCellEvent(ev);
          var rdlCell = pega.ui.RDL.getRDLCellFromTarget(ev.target);
          var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
          // skipping when control is present inside a rdl cell and if one of up/right/down/left key is pressed
          if(ev.keyCode === 39 || (ev.keyCode === 40 && children.length !== 1) || ev.keyCode === 37 || (ev.keyCode === 38 && children.length !== 1)) return;
        }
        var uniqueId = id;
        var rdlContextObj = pega.ctx.visibleRDLsOnPage[uniqueId];
        var nodes = rdlContextObj.nodes;
        var currentIndex = rdlContextObj.currentIndex;
        if(!nodes || nodes.length === 0) return;
        switch(ev.keyCode){
          // right arrow key press
          case 39: {
            var rdlCell = pega.ui.RDL.getRDLCellFromTarget(ev.target);
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
            if(children.length === 1) return;
          }
          // down arrow key press
          case 40: {
            ev.stopPropagation();
            if(currentIndex === nodes.length - 1) return;
            currentIndex++;
            nodes.forEach(function(node){
              node.setAttribute('tabindex','-1');
            });
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(nodes[currentIndex]);
            if(children.length !== 1){
              nodes[currentIndex].setAttribute('tabindex','0');
              nodes[currentIndex].focus(); 
            } else {
              children[0].focus();
            }
            break;
          }
          // left arrow key press
          case 37: {
            var rdlCell = pega.ui.RDL.getRDLCellFromTarget(ev.target);
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
            if(children.length === 1) return;
          }
          // up arrow key press 
          case 38: {
            ev.stopPropagation();
            if(currentIndex === 0) return;
            currentIndex--;
            nodes.forEach(function(node){
              node.setAttribute('tabindex','-1');
            });
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(nodes[currentIndex]);
            if(children.length !== 1){
              nodes[currentIndex].setAttribute('tabindex','0');
              nodes[currentIndex].focus(); 
            } else {
              children[0].focus();
            }
            break;
          }
          // esc key press, placing focus back to rdl cell
          case 27: {
            nodes.forEach(function(node){
              node.setAttribute('tabindex','-1');
            });
            nodes[currentIndex].setAttribute('tabindex','0');
            nodes[currentIndex].focus();
            ev.stopPropagation();
            break;
          }
          // enter key press, loosing focus
          case 13: {
            if(targetIsNoMoreLoadDataSection) return;
            var rdlCell = pega.ui.RDL.getRDLCellFromTarget(ev.target);
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(rdlCell);
            if(children.length === 1) return;
            if(rdlCell) {
              // enter key press, placing focus on first element of rdl cell
              var oldTitle = rdlCell.getAttribute('title');
              var base_ref = rdlCell.getAttribute('base_ref');
              var rdlNode = pega.ui.RDL.getRDLNodeFromTarget(rdlCell);
              var uniqueId = rdlNode.getAttribute('data-uniqueid');
              var key = uniqueId + base_ref;
              var rdlCellContext = pega.ctx.accessRDLCellContext[key];
              var rdlNodes = pega.ui.RDL.getFocusableElements(rdlCell);
              var cellCurrentIndex = rdlCellContext.currentIndex;
              rdlCell.setAttribute('title', rdlRowNavigationInfo);
              // rolling back to original title afer current handler finishes execution
              setTimeout(function(){
                if(oldTitle)
                  rdlCell.setAttribute('title', oldTitle);
                else
                  rdlCell.removeAttribute('title');
              }, 300);
              pega.ui.RDL.changeElementsTabIndex(rdlCell, '-1');
              pega.ui.RDL.addARIAToAllRequiredElements(rdlCell, 'aria-hidden', 'true');
              rdlNodes[cellCurrentIndex].setAttribute('tabindex','0');
              rdlNodes[cellCurrentIndex].removeAttribute('aria-hidden');
              rdlNodes[cellCurrentIndex].focus();
              pega.ctx.accessRDLCellContext[key].active = true; 
            }
            break;
          }
          default: {
            console.log("invalid key code given");
          }
        }
        pega.ctx.visibleRDLsOnPage[uniqueId].nodes = nodes;
        pega.ctx.visibleRDLsOnPage[uniqueId].currentIndex = currentIndex;
       } catch(e){
         // Adding log for accessibility exception [disabling logs for now]
         //console.log("Accessibility Exception in key down handler", e);
       }
      };
      var keyUpHandler = function(ev){
        try{
        // keeping this handler to avoid unnecessary events to get propogated
        // current adding case for esc event only
        if(ev.keyCode === 27)
          ev.stopPropagation();
        } catch(e){
          // Adding log for accessibility exception [disabling logs for now]
          //console.log("Accessibility Exception in key up handler", e);
        }
      }
      rdlNode.addEventListener('keydown', keyDownHandler);
      rdlNode.addEventListener('keyup', keyUpHandler);
      var handlerObj = {
          keyup: keyUpHandler,
          keydown: keyDownHandler
      };
      if(!_self.eventTracker[id])
        _self.eventTracker[id] = [handlerObj];
      else
        _self.eventTracker[id].push(handlerObj);
    }
  },
  
  addAriaAttributes: function(rdlNode){
    // adding role as grid to rdl node
    rdlNode.setAttribute('role','grid');
    // total rows count isn't clear why because they are not present in DOM
    rdlNode.setAttribute('aria-rowcount','-1');
    var baseNodes = rdlNode.childNodes;
    baseNodes = pega.ui.RDL.getFirstLevelBaseReferences(baseNodes);
    rdlNode.setAttribute('aria-label',baseNodes.length+' items');
    // adding role as gridcell to all rdl cells
    baseNodes.forEach(function(node,index){
      node.setAttribute('role','row');
      node.setAttribute('aria-rowindex',index+'');
    });
  },
  
  setRDLNodeContext: function(id, rdlNode, previousTabbedRDLRowIndex/*=-1*/){
    // NOTE: Preflight Optimization's Google Closure Compiler doesn't correctly handle default arg values
    if (previousTabbedRDLRowIndex === undefined) { previousTabbedRDLRowIndex = -1; }
    
    if(!rdlNode) return;
    var baseNodes = rdlNode.childNodes;
    baseNodes = pega.ui.RDL.getFirstLevelBaseReferences(baseNodes);
    
    if(previousTabbedRDLRowIndex === -1)  previousTabbedRDLRowIndex = 0;
    var childNodes = pega.ui.RDL.getInnerElementsFromRDLRow(baseNodes[previousTabbedRDLRowIndex]);
    if(childNodes.length === 1){
      childNodes[0].setAttribute('tabindex','0');
    }
    else {
      baseNodes[previousTabbedRDLRowIndex].setAttribute('tabindex','0');
    }  
    
    pega.ctx.visibleRDLsOnPage[id] = {
      nodes: baseNodes,
      currentIndex: previousTabbedRDLRowIndex
    };
  },
  
  attachAccessibilityEventsToAnRDLNode: function(rdlNode){
      var id = rdlNode.getAttribute('data-uniqueid');
      if(!id) return;
      // add accessibility roles
      pega.ui.RDL.addAriaAttributes(rdlNode);
      // keep track of nodes and current index for every rdl
      var baseNodes = rdlNode.childNodes;
      baseNodes = pega.ui.RDL.getFirstLevelBaseReferences(baseNodes);
      if(baseNodes && baseNodes.length > 0) {
        var previousTabbedRDLRowIndex = -1;
        baseNodes = Array.from(baseNodes);
        baseNodes.forEach(function(node, index){
          if(node.getAttribute('tabindex') === "0") previousTabbedRDLRowIndex = index;
        });
        baseNodes.forEach(function(node){
          if(node.getAttribute('data-node-id') !== "pyRDLNoMoreData"){
            var children = pega.ui.RDL.getInnerElementsFromRDLRow(node);
            // add enter command only for RDL rows having more than 1 form elements
            if(children.length > 1) {
              // adding command in aria-label attribute
              node.setAttribute('aria-label', rdlRowViewDetails);
            }
          }
          node.setAttribute('tabindex','-1');
          // make tabindex of all the form elements to -1
          pega.ui.RDL.changeElementsTabIndex(node, '-1', true);
          // add role grid cell to every form element
          pega.ui.RDL.addARIAToAllRequiredElements(node, 'role', 'gridcell');
          // add role presentation to all form elements
          pega.ui.RDL.addARIAToAllRequiredElements(node, 'aria-hidden', 'true');
          // add col index to all the nodes
          pega.ui.RDL.addColIndexToAllRequiredElements(node);
          // pass unique id as well to make map unique (rdlNode)
          pega.ui.RDL.createRDLCellContext(node, id);
               
        });
        
        pega.ui.RDL.setRDLNodeContext(id, rdlNode, previousTabbedRDLRowIndex);
        pega.ui.RDL.addArrowKeyEventListener(rdlNode, id);
      }
  },
  
  attachAccessibilityEvents: function (RDLUniqueIds, container){
    
    if(!RDLUniqueIds || RDLUniqueIds.length === 0) return;
    
    // This context is used to track the RDLs opened
    if (!pega.ctx.visibleRDLsOnPage) pega.ctx.visibleRDLsOnPage = {};
    
    RDLUniqueIds.forEach(function(id){
      if(!container) {
         container = pega.ctx.dom;
      }
      // getting rdl nodes
      var rdlNodes = container.querySelectorAll("[data-uniqueid='"+id+"']");
      if(!rdlNodes) return;
      rdlNodes = Array.from(rdlNodes);
      rdlNodes.forEach(function(rdlNode){
         pega.ui.RDL.attachAccessibilityEventsToAnRDLNode(rdlNode);
      });
    });
  },
  
  /* Accessibility changes end */
  
  attachOnLoadEvents: function (container) {
    /* BUG-526862 : TypeError: container.getAttribute is not a function */
    if (container.target) {
      /* if container is event */
      container = container.target;
    }
    
    // setting flag to on attach on load
    /*if(!pega.ui.RDL.focusNewRow && container.focus){
      pega.ui.RDL.focusNewRow = true;
      if(container.tabIndex === -1)
        container.tabIndex = 0;
      container.focus();
    }*/
    
    try{
      var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // avoiding accessibility for mobile devices
      if(!isMobile && container) {
        // deferred accessibility callback
        setTimeout(function(){
          pega.ui.RDL.attachAccessibilityEvents(pega.ctx.RDLUniqueIds, container);
        }, 500);
         
      }
    } catch(e) {
      // Adding this log to differentiate Accessibility exceptions [disabling logs for now]
      //console.log("Exception in attachment of accessibility events", e);
    }
    /* BUG-526862 */
    if(pega.ctx.isMDC && container.getAttribute("data-mdc-recordid") && container.classList.contains("hide"))
    {
      if(pega.ui.EventsEmitter){  
        pega.ui.EventsEmitter.subscribeOnce("postMDCRender", function(){
          var container=pega.ctx.dom.getContextRoot();
          pega.ui.RDL.attachScrubberEvents(container);
          pega.ui.RDL.attachScrollEvents("", container);
        },null);   
      } 
    }else{  
      pega.ui.RDL.attachScrubberEvents(container);
      pega.ui.RDL.attachScrollEvents("", container);
    }
            
    // BEGIN US-263841 ("I can reorder items within a single RDL")
    // Wait until rdl is rendered to initialize sortable, so that the ui renders faster
    setTimeout(function () {
      // If the pega.ctx.RDL.sortableInstances array does not exist, create it
      if(!pega.ctx.RDL.sortableInstances) {
        pega.ctx.RDL.sortableInstances = [];  
      }

      if(!pega.ctx.RDL.noResultsHashMap) {
        pega.ctx.RDL.noResultsHashMap = {};  
      }

      var sortableList;
      if(container instanceof Node) {
        // If the container is an html element, fetch the sortable list from the contaner
        sortableList = container.querySelectorAll("[data-sortable-rdl] > .content");
      } else {
        // Otherwise, fetch the sortable list from the pega.ctx.dom
        sortableList = pega.ctx.dom.querySelectorAll("[data-sortable-rdl] > .content");
      }

      // Iterate through all sortable list items and make them draggable
      for(var i = 0; i < sortableList.length; i++) {
        var sortableOptions = {};
        sortableOptions.animation = 150;
        sortableOptions.dragClass = "draggingClass";
        sortableOptions.filter = ".no-item-section";

        var currentSortableItem = sortableList[i];
        var sortableDOMMetaData = JSON.parse($(currentSortableItem).closest("[data-sortable-rdl]")[0].dataset.sortableRdl);

        //if the parent has no items
        if(currentSortableItem.classList.contains("rdlHasNoRows")){
          //if we are displaying a section for no items
          var noSectionDiv = currentSortableItem.querySelector("div");
          if(noSectionDiv){
            //add a class to ignore this section durring drag and drop
            noSectionDiv.classList.add("no-item-section");
          }
        }
        
        var sortableInstance = new pega.ui.Sortable(currentSortableItem, pega.ctxmgr.getContextByTarget(currentSortableItem).pzHarnessID + sortableDOMMetaData.groupName, sortableOptions);

        // US-263843: Add pre and post activities
        sortableInstance.preActivity = sortableDOMMetaData.preActivity;
        sortableInstance.postActivity = sortableDOMMetaData.postActivity;      

        sortableInstance.onStart = function(dataObj) {
          // Iterate through our list of sortable instances, and if the group names match, remove no items message until done dragging
          for(var j = 0; j < pega.ctx.RDL.sortableInstances.length; j++) {          
            var currentSortable = pega.ctx.RDL.sortableInstances[j];
            if(this.group.name === currentSortable.group.name) {
              var hasNoRows = currentSortable.el.classList.contains('rdlHasNoRows');
              if(hasNoRows) {
                if(currentSortable.el.children.length > 0) { // No items Section stored off
                  var noItemsSection = currentSortable.el.children[0];
                  pega.ctx.RDL.noResultsHashMap["Sortable-" + j] = noItemsSection;
                  currentSortable.el.removeChild(noItemsSection);
                } else { // No items Field Value stored off
                  pega.ctx.RDL.noResultsHashMap["Sortable-" + j] = currentSortable.el.text;
                }
                currentSortable.el.text = null;
              }
            }
          }
        }

        sortableInstance.onMove = function(dataObj) {           
          // If our source location is empty, or if it has one child and that child is the current dragged element, nullify the source location text so the empty selector will apply        
          if(dataObj.sourceLocation.children.length == 0 || (dataObj.sourceLocation.children.length == 1 && dataObj.sourceLocation.children[0] == dataObj.draggedElement)) {
            dataObj.sourceLocation.text = null;
          }

          // Ensure that it is not possible to drag beyond the "No more data to load" section
          return !dataObj.relatedElement.classList.contains("rdl-nomoredatasection");
        }

        sortableInstance.onDrop = function(dataObj) {
          var fromFullRefToPageList = dataObj.sourceLocation.dataset.repeatSource;
          var toFullRefToPageList = dataObj.targetLocation.dataset.repeatSource;
          // Pega indexes are 1-based, so pre-increment Sortable's 0-based indices
          var fromIndex = ++dataObj.oldIndex;
          var toIndex = ++dataObj.newIndex;

          // No need to call the activity or refresh the contents if our starting and ending locations are the same
          if(dataObj.sourceLocation === dataObj.targetLocation && fromIndex === toIndex) {
            return;
          }

          // Call server to update the page values on the clipboard
          // Build up the URL for the pre-activity
          var actionURL = SafeURL_createFromURL(pega.ctx.url);
          actionURL.put("pyActivity", "@baseclass.pzRepeatingListsDropHandler");
          actionURL.put("fromFullRefToPageList", fromFullRefToPageList);
          actionURL.put("toFullRefToPageList", toFullRefToPageList);
          actionURL.put("fromIndex", fromIndex);
          actionURL.put("toIndex", toIndex);

          // US-263843: Add pre and post activities
          actionURL.put("preActivityName", this.preActivity);        
          actionURL.put("postActivityName", this.postActivity);
          /*BUG-497509 : Removing the primarypagename as it seems to open activity status error window for any expections.*/
          actionURL.remove("pzPrimaryPageName");

          pega.u.d.asyncRequest("POST", actionURL, {
            success: function(o) { 
              // publish sync needs new filter param, unique id for matching listener
              pega.ui.EventsEmitter.publishSync("RDL.DROPSUCCESS", dataObj);

              if(dataObj.sourceLocation !== dataObj.targetLocation) {
                pega.u.d.reloadSection(dataObj.sourceLocation, "", "", false, false, -1, false, null, null, null, null);                
              }
              pega.u.d.reloadSection(dataObj.targetLocation, "", "", false, false, -1, false, null, null, null, null);                                 
            },
            failure: function(o) {
              pega.ui.logger.LogHelper.debug("Unable to successfully drop");
              pega.ui.EventsEmitter.publishSync("RDL.DROPFAILURE", dataObj);
              if(dataObj.sourceLocation !== dataObj.targetLocation) {
                pega.u.d.reloadSection(dataObj.sourceLocation, "", "", false, false, -1, false, null, null, null, null);                
              }
              pega.u.d.reloadSection(dataObj.targetLocation, "", "", false, false, -1, false, null, null, null, null);
              pega.u.d.ajaxFailureSecondaryCount = -1;//This is to avoid ajax engine from retrying the reload section request.
            }
          });	
        }

        sortableInstance.onEnd = function(dataObj) {
          // Iterate through our list of sortable instances, and put back the no items message if needed
          for(var j = 0; j < pega.ctx.RDL.sortableInstances.length; j++) {
            var currentSortable = pega.ctx.RDL.sortableInstances[j];
            if(pega.ctx.RDL.noResultsHashMap["Sortable-" + j] && currentSortable.el.children.length == 0) {
              if(pega.ctx.RDL.noResultsHashMap["Sortable-" + j] instanceof Node) {
                currentSortable.el.appendChild(pega.ctx.RDL.noResultsHashMap["Sortable-" + j]);
              } else {
                currentSortable.el.text = pega.ctx.RDL.noResultsHashMap["Sortable-" + j];
              }
            }
          }
          // Reset the hash map to its initial empty state
          pega.ctx.RDL.noResultsHashMap = {};
        }

        // Store off the sortable instances for safe keeping (needed for cleaning them up within cleanUpOnUnloadEvents())
        pega.ctx.RDL.sortableInstances.push(sortableInstance);
      }
    }, 0);      
    // End of sortable set timeout wrap (sortable is wrapped in set timeout so that the ui renders faster)   
    // END US-263841
  },
  
  cleanUpOnUnloadEvents: function () {
    $(window).off("scroll", pega.ui.RDL.scrollTrigger);

    // BEGIN US-263841 ("I can reorder items within a single RDL")
    if(pega.ctx.RDL.sortableInstances) {
      // Clean up old sortable instances
      for(var i = 0; i < pega.ctx.RDL.sortableInstances.length; i++) {
        pega.ctx.RDL.sortableInstances[i].destroy();
      }

      pega.ctx.RDL.sortableInstances = [];   
    } 

    if(pega.ctx.RDL.noResultsHashMap) {
      pega.ctx.RDL.noResultsHashMap = {};
    }
    // END US-263841
  },
  /*Get all the RDLs info(pagination,catergorization,templatingstatus,RDLNode) for datasource */
  getAllRDLInfo: function(datasource) {
        if (datasource) {
            var dsObject = pega.ui.DataRepeaterUtils.getAbsoluteDataSourceFromDataSource(datasource);
            datsource = dsObject.datasource;
            if (!datasource) return [];
            var RDLNodes = pega.ctx.dom.querySelectorAll("[data-repeat-source='" + datasource + "']");
            var rdlInfo = [];
            for (var i = 0; i < RDLNodes.length; i++) {
                rdlInfo[i] = this.getRDLInfo(RDLNodes[i]);
            }
            return rdlInfo;
        }
    },
  
    getRDLInfo: function(RDLNode) {
      var rdlInfo = {};
      rdlInfo.RDLNode = RDLNode;
      rdlInfo.templatingStatus = RDLNode.hasAttribute("data-template") ? "Y" : "N";
      if (RDLNode.classList.contains("progressive-rdlScroll") || 
          RDLNode.classList.contains("progressive-bodyScroll") || 
          (RDLNode.lastElementChild && RDLNode.lastElementChild.classList.contains("rdl-nomoredatasection"))) {
        rdlInfo.paginationType = "scroll";
      } else if (RDLNode.classList.contains("progressive-useraction")) {
        rdlInfo.paginationType = "useraction";
      } else {
        rdlInfo.paginationType = "none";
      }
      rdlInfo.isCategorized = RDLNode.classList.contains("content-categorized");
      return rdlInfo;
    },
    /*For Add LastItem Performant, Need to get all the rdls info that need partial refresh*/
    getAndUpdateAllRDLsForPartialRefresh: function(datasource,revert,RDLNode) {
      var rdlRefreshAttr = ["data-expr-id", "rw"]; /* data-exp-id for template and rw for non-template */
      var rdlRefreshTempAttr = ["data-expr-id-temp", "rw-temp"];
      var fromArray = rdlRefreshAttr;
      var toArray = rdlRefreshTempAttr;
      if(revert) {
        fromArray = rdlRefreshTempAttr;
        toArray = rdlRefreshAttr;
      }
        var rdlInfo = null;
        if(RDLNode) {
          rdlInfo = [this.getRDLInfo(RDLNode)];
        } else {
          rdlInfo = this.getAllRDLInfo(datasource);
        }
        for (var i = 0; i < rdlInfo.length; i++) {
            var partialRefresh = true;
            //Skip partial refresh if all the records not loaded yet in progressive loaded rdl 
            if (rdlInfo[i].paginationType == "scroll") {
                var lastChildElement = rdlInfo[i].RDLNode.lastElementChild;
                if (lastChildElement) {
                  if(!lastChildElement.classList.contains("rdl-nomoredatasection")) {
                    partialRefresh = false;
                  }
                } 
            } else if (rdlInfo[i].paginationType == "useraction") {
                if ($(rdlInfo[i].RDLNode).siblings(".RDLPaginator:visible")[0]) {
                  partialRefresh = false;
                }
                    
            }
            if (rdlInfo[i].isCategorized) {
              partialRefresh=false;
            }
            
          
          /*Update data-expression-id to not to refresh again*/ 
          var fullRefreshRDL = rdlInfo[i].isCategorized || rdlInfo[i].RDLNode.children.length<=1; 
          if(!fullRefreshRDL){ 
            for(var j=0;j<fromArray.length;j++){
              if(rdlInfo[i].RDLNode.hasAttribute(fromArray[j])){
                 var dataExpressionId = rdlInfo[i].RDLNode.getAttribute(fromArray[j]) ; 
                 rdlInfo[i].RDLNode.setAttribute(toArray[j],dataExpressionId);
                 rdlInfo[i].RDLNode.removeAttribute(fromArray[j]);
                 break;
              }
            }
          }
          if (!partialRefresh) {
                rdlInfo.splice(i, 1);
                i--;
            }
        }
      if(!revert)
        return rdlInfo;
    },
    
    getRDLsToRefresh: function(dataSource, RDLNode) {
      var rdlNodesInfo = pega.ui.RDL.getAndUpdateAllRDLsForPartialRefresh(dataSource, false, RDLNode);
      var rdlInfo=[];
      for (var i = 0; i < rdlNodesInfo.length; i++) {
        var RDLSectionNode=pega.u.d.getSectionDiv(rdlNodesInfo[i].RDLNode);
        var RDLSectionContext = pega.u.d.getBaseRef(RDLSectionNode) || pega.u.d.primaryPageName;
        var RDLSectionName = RDLSectionNode.getAttribute("node_name");
        var templatingStatus = rdlNodesInfo[i].templatingStatus;
        var rowMethod = rdlNodesInfo[i].RDLNode.getAttribute("data-rowmethodname")||"";
        rdlInfo.push(RDLSectionContext+","+RDLSectionName+","+rowMethod+","+templatingStatus);
      }
      return rdlInfo;
    },
    appendRow: function(datasource, responseText, RDLNode) {
      var rowStreamArray = responseText.match(/\|\|RDLROWMARKUP_BEGIN\|\|([\s\S]*?)\|\|RDLROWMARKUP_END\|\|/g);
      if(!rowStreamArray || rowStreamArray.length == 0 ) {/* BUG-386006: In case of empty pagelist responseText is empty. If fetchAndAppend API is invoked by mistake then handle it to avoid JS error. */
        return;
      }
      var rdlInfo = pega.ui.RDL && pega.ui.RDL.getAndUpdateAllRDLsForPartialRefresh(datasource, false, RDLNode);
      if(rdlInfo){
        for (var i = 0;  i < rdlInfo.length; i++) {
          var refreshDomAction = rdlInfo[i].isCategorized? "replace":"append";
          var refreshDomElement = rdlInfo[i].RDLNode;
          if(rdlInfo[i].paginationType == "scroll"){
            refreshDomAction = "insert";
            refreshDomElement = rdlInfo[i].RDLNode.lastElementChild;
          }

          var fullRowStream = rowStreamArray.shift();
          var rowStream = fullRowStream.match(/\|\|RDLROWMARKUP_BEGIN\|\|([\s\S]*?)\|\|RDLROWMARKUP_END\|\|/); 
          rowStream = rowStream[1];
          if(rowStream)
            pega.u.d.loadDOMObject(rdlInfo[i].RDLNode, rowStream, null, {domAction:refreshDomAction, domElement:refreshDomElement});
        }
      }
      setTimeout(function() { /* BUG-385978: Execute getAndUpdateAllRDLsForPartialRefresh() function after evaluating client expressions. Hence added invocation in setTimeout. */
        pega.ui.RDL.getAndUpdateAllRDLsForPartialRefresh(datasource, true, RDLNode);
      }, 0);
    },
  
  /* US-264422 - RDL Pagination API's */
    loadAll : function(datasource,options){
      options = options || {};
      var rdlNode = options.rdlNode;
      options.generateNoMoreDataDiv = !0; // FetchAndAppend doesn't add NoMoreDataDiv we need separate argument to make FetchAndAppend to display NoMoreDataDiv as we need to show the showless option
      rdlNode ? datasource = rdlNode.getAttribute("data-repeat-source") : rdlNode = document.querySelector("div[data-repeat-source='" + datasource + "']");
      var paginatorGadget=rdlNode.getAttribute("data-uniqueid") ? rdlNode.parentNode.querySelector("div.rdl-paginatorsection") :rdlNode.parentNode.querySelector("div.RDLPaginator");
      paginatorGadget.style.display="none";      
      var renderedChildrenList = rdlNode.querySelectorAll(".rdlShowless");
      // resetting flag when we have rdl rows alredy present
      pega.ui.RDL.focusNewRow = false;
      if(0 < renderedChildrenList.length){
        // resetting flag when we have rdl rows alredy present
        pega.ui.RDL.focusNewRow = true;
        for(var i=0;i<renderedChildrenList.length;i++){
          renderedChildrenList[i].classList.remove("rdlShowless");
        }
        pega.ui.RDL.changeTabIndexOfRDLNodes(rdlNode, '-1');
        var tabIndex = parseInt(renderedChildrenList[0].getAttribute('aria-rowindex')) || 1;
        var id = rdlNode.getAttribute('data-uniqueid');
        pega.ui.RDL.setRDLNodeContext(id, rdlNode, tabIndex-1);
        renderedChildrenList[0].tabIndex = 0;
        renderedChildrenList[0].focus();
      }else{
        pega.ui.RDL.fetchAndAppend(datasource,options);
      }
      
    },
  
    showless : function(datasource,options){
      options = options || {};
      var rdlNode = options.rdlNode;
      rdlNode ? datasource = rdlNode.getAttribute("data-repeat-source") : rdlNode = document.querySelector("div[data-repeat-source='" + datasource + "']");
      var pageSize = parseInt(rdlNode.getAttribute("data-pagesize"));
      var paginatorGadget=rdlNode.getAttribute("data-uniqueid") ? rdlNode.parentNode.querySelector("div.rdl-paginatorsection") : rdlNode.parentNode.querySelector("div.RDLPaginator");
      paginatorGadget.style.display="block"; 
      for(var i=pageSize;i<rdlNode.children.length;i++){
        rdlNode.children[i].classList.add("rdlShowless");
      }
      pega.ui.RDL.changeTabIndexOfRDLNodes(rdlNode, '-1');
      var id = rdlNode.getAttribute('data-uniqueid');
      pega.ui.RDL.setRDLNodeContext(id, rdlNode);
      if(rdlNode.children.length > 0){
        rdlNode.children[0].tabIndex = 0;
        rdlNode.children[0].focus();
      }
    },
  
    fetchAndAppend: function(datasource,options) {
      options = options || {};
      var rdlNode = options.rdlNode;
      if(rdlNode) {/* BUG-385540 */
         datasource = rdlNode.getAttribute("data-repeat-source");
      }
      if(options.fetchLastRow){
        var rdlInfo = this.getRDLsToRefresh(datasource, rdlNode);/* BUG-385540: Added rdlNode to support trageting provided RDL DOM node. */
        var streamList = rdlInfo.join("||");
        if(streamList) {
          var harCtxMgr = pega.ui.HarnessContextMgr;
          var oSafeURL = SafeURL_createFromURL(harCtxMgr.get('url'));
          oSafeURL.put("listSource", datasource);
          oSafeURL.put("pyTargetStream", "pzGetRowMarkup"); 
          oSafeURL.put("pyActivity", "ShowStream");
          var postData = new SafeURL();
          postData.put("streamList", streamList);
          var callback = {
            success: function(oResponse) {
              pega.ui.RDL.appendRow(datasource, oResponse.responseText, rdlNode);
            },
            failure: function(oResponse) {
            }
          };
          pega.u.d.asyncRequest('POST', oSafeURL, callback, postData);
        }
      }else{
        rdlNode = rdlNode || document.querySelector("div[data-repeat-source='" + datasource + "']");
        var totalChildCount = rdlNode.children.length,startIndex=0,baseRef,recordsToFetch = typeof options.recordsToFetch !="undefined" ? options.recordsToFetch : -1;
        if(totalChildCount>0){
          //baseRef = "" != rdlNode.children[totalChildCount - 1].getAttribute("base_ref") ? rdlNode.children[totalChildCount - 1].getAttribute("base_ref") : rdlNode.children[totalChildCount - 2].getAttribute("base_ref");
          startIndex = this.getNextRowIndex(rdlNode); //baseRef.substring(baseRef.lastIndexOf("(") + 1, baseRef.lastIndexOf(")"));
        }
        pega.ui.template.pzRDLTemplate.loadPage(parseInt(startIndex), recordsToFetch, rdlNode, null, null, {
          calledFromFetchAndAppend: true,
          generateNoMoreDataDiv: options.generateNoMoreDataDiv
        });
      }
    }
 
  /* Attach onLoad RDL events */
};pega.u.d.attachOnload(pega.ui.RDL.attachOnLoadEvents, true);

/* Attach onunload RDL events */
pega.u.d.attachOnUnload(pega.ui.RDL.cleanUpOnUnloadEvents);

pega.ui.Doc.prototype.isSectionCurrentlyInView = function (element, container) {
  var $element = $(element);
  var $container = container ? $(container) : $(window);

  var containerHeight = $container.height();
  var containerScrollTop = $container.scrollTop();
  var containerOffsetTop = $container.offset().top;

  var elementOffsetTop = $element.offset().top;
  var elementHeight = $element.height();

  var isElementContainingTopOfContainer = containerOffsetTop > elementOffsetTop && elementOffsetTop + elementHeight > containerOffsetTop;
  /* BUG-248057: Firefox give offsetTop as floating point numbers */
  var isElementTopSameAsContainer = Math.floor(containerOffsetTop) == Math.floor(elementOffsetTop);
  var isElementAtBottomOfContainer = containerScrollTop + containerHeight == $container[0].scrollHeight;
  var isContainerHavingScroll = containerHeight == $container[0].scrollHeight;

  if (!isContainerHavingScroll && (isElementContainingTopOfContainer || isElementTopSameAsContainer || isElementAtBottomOfContainer)) {
    return true;
  } else {
    return false;
  }
};
//static-content-hash-trigger-YUI