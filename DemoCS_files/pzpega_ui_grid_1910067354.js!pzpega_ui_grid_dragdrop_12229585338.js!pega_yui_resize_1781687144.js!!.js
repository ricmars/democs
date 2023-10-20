//<script>
/*BUG-159902: Dev tip for the ENG-12590.*/

var gridSortFieldName = "";
if(typeof(pega) != "undefined"){
	/*BUG-223317 : Checking for Chrome using userAgentString instead of window.chrome */
	var userAgentString=navigator.userAgent.toLowerCase();
	if(userAgentString.indexOf("chrome")>0 && userAgentString.indexOf("edge")<0 && document.documentElement.className && document.documentElement.className.indexOf("chrome")<0){
		document.documentElement.className+=" chrome ";
	}
    if(!pega.ctx.Grid){
        pega.ctx.Grid={
          isFilterMenuItemClicked : false,
          map:{},
		      dataSourceToUId: {},
		      activeGrid: null,
      };
    }
	if(!window.Grids || (window.Grids.nodeType===1 && window.Grids.id == "Grids")) {
	window.Grids = {
		filterMap: {},
		iAttribute: "dataSource",
		/*
		 * Constants to represent cases for write operations
		 */
		INIT_GRID_TABLES: 0,
		SET_UL_HEIGHT: 1,

		/* BUG-111651 && BUG-111282 - DTSprint18 - singp1 Start*/
		EVENT_CLICK : "click",

		/* BUG-111651 && BUG-111282 - DTSprint18 - singp1 End*/

		EVENT_RIGHT_CLICK : "contextmenu", /* Taphold event which will be fired in place of contextmenu incase of touch devices. See pzpega_ui_events_infra js - Delta Touch */
		EVENT_DOUBLE_CLICK : "dblclick", /* DoubleTap event which will be fired in place of dblclick incase of touch devices. See pzpega_ui_events_infra js - Delta Touch */

		//BUG-373803: exposing the API to adjust the active/visible grids
    adjustVisibleGrids: function(parentElem){
      for (var prop in pega.ctx.Grid.map) {
        if (pega.ctx.Grid.map.hasOwnProperty(prop)) {
          var gridToBeAdjusted = parentElem.querySelector('#'+prop);
          if(gridToBeAdjusted){
            var grid = pega.ctx.Grid.map[prop];
            if(grid.bAdjusted) {
              continue;
            }
            grid.fixVisibleGrid();
            grid.bAdjusted = true;
          }
        }
      }

    },

		getGrid: function(uniqueId) {
			return pega.ctx.Grid.map[uniqueId];
		},
		getActiveGrid: function(e) {
			return this.getElementsGrid(pega.util.Event.getTarget(e));
		},
      	filterActiveGrid : function(event){
          var activeGrid = this.getActiveGrid(event);
          if(activeGrid)
          	activeGrid.menusOnProperEvent(null,event);
        },
		getElementsGrid: function(tempGridDiv) {
      if(!pega.ctx.Grid) {
				  	return null;
				}
			pega.ctx.Grid.activeGrid = null;
			if(tempGridDiv && tempGridDiv!=null) {
        var targetGridDiv = tempGridDiv;
				while(tempGridDiv && tempGridDiv.getAttribute && tempGridDiv.getAttribute("bGrid")==null && tempGridDiv.getAttribute("gridId") == null){
          if(pega.u.d.isRdlInMiddle(targetGridDiv, tempGridDiv)) {
            tempGridDiv = null;
            break;
          }
					tempGridDiv = tempGridDiv.parentNode;
				  	if(tempGridDiv == null || (tempGridDiv.tagName && tempGridDiv.tagName =="HTML")) {
						break;
					}
				}
				if(tempGridDiv && tempGridDiv!=null && tempGridDiv.tagName && tempGridDiv.tagName !="HTML") {
                    // checking for gridId attribute if event is fired from the grid details div when target for edit section is set.
                    if (tempGridDiv.getAttribute("gridId")) {
                        var gridId = tempGridDiv.getAttribute("gridId");
                        if (pega.ctx.Grid.map[gridId]) {
                            pega.ctx.Grid.activeGrid = pega.ctx.Grid.map[gridId];
                        }
                    } else {
                        for(var instance in pega.ctx.Grid.map) {
                            var div = pega.ctx.dom.getElementById(instance);
                            if(div == tempGridDiv){
                                pega.ctx.Grid.activeGrid = pega.ctx.Grid.map[instance];
                                break;
                            }
                        }
                    }
				}
			}
			return pega.ctx.Grid.activeGrid;
		},
		setActiveGrid: function(uniqueId) {
			pega.ctx.Grid.activeGrid = pega.ctx.Grid.map[uniqueId];
		},
		addGrid: function(uniqueId, gridObject) {
			pega.ctx.Grid.map[uniqueId] = gridObject;
			var gridDiv = gridObject.gridDiv;
			var dataSource = gridDiv.getAttribute("datasource") || "";
			var gridSource = gridObject.getPLPGProperty() || "";
			var gridSrcIndex = dataSource.lastIndexOf(gridSource);
			gridSrcIndex = gridSrcIndex+gridSource.length;
			dataSource = dataSource.substring(0, gridSrcIndex);
			gridObject.dataSourceRef = dataSource;
			/* check if another grid is already registered for the data source of the current grid;
			 * this may happen if same data source is bound to more than one grid, in which case do not update the mapping, or
			 * same grid is getting re-initialized may be due to some refresh section or refresh layout. Update the mapping now.
			 */
			var registeredId = pega.ctx.Grid.dataSourceToUId[dataSource];
			if(!registeredId || !pega.ctx.dom.getElementById(registeredId)) {
				pega.ctx.Grid.dataSourceToUId[dataSource] = uniqueId;
			}
			var sectionId = pega.u.d.getSectionId(pega.u.d.getSectionDiv(gridDiv));
			pega.u.d.registerAsHarnessElement(gridObject,sectionId );
		},
		deleteGrid: function(uniqueId) {
			if(pega.ctx.Grid.map[uniqueId] == pega.ctx.Grid.activeGrid) {
              pega.ctx.Grid.activeGrid = null;
            }
          	if(pega.ctx.Grid.map[uniqueId] == pega.ctx.Grid.focusedGrid) {
              pega.ctx.Grid.focusedGrid = null;
            }
          	if(pega.u.d.ClientEventAPI && pega.ctx.Grid.map[uniqueId] == pega.u.d.ClientEventAPI.srcGrid) {
              pega.u.d.ClientEventAPI.srcGrid = null;/* This is store in pega.u.d.handleClientEvent when fireACOnElem is added to executorArray  */
            }
			pega.ctx.Grid.map[uniqueId] = null;
			delete pega.ctx.Grid.map[uniqueId];
		},
      	deleteAllGridObjects: function() {
          /* clean up grids */
          try {
            if(Grids && pega.ctx.Grid) {
              for(var grid_id in pega.ctx.Grid.map) {
                pega.ctx.Grid.map[grid_id].nullify(true);
              }
              pega.ctx.Grid.map = {};
              if(!pega.ctx.isMDC){
                Grids = null;
              }
            }
          } catch(exp) {
			console.log(exp);
          }
        },
		getAllGrids: function() {
			return pega.ctx.Grid.map;
		},
		deleteAllGrids: function() {
			pega.ctx.Grid.map = {};
		},

   initGridContextObject : function(){
     if(!pega.ctx.Grid){
        pega.ctx.Grid={
          isFilterMenuItemClicked : false,
          map:{},
		      dataSourceToUId: {},
		      activeGrid: null,
      };
  }
  },
   /*cleanUpGridContextMap : function(){
    if(pega.ctx.isMDC){
      Grids.deleteAllGridObjects();
    }
  },*/
		findActiveGrid: function(e, gridDivObj) {
			e = (e == undefined)?window.event : e;
			Grids.setActiveGrid(gridDivObj.getAttribute(Grids.iAttribute));
			pega.util.Event.stopPropagation(e);
		},
		getActiveGridDetails: function(e){
          	/*BUG-313112 - Use window.event only if e is undefined*/
			e = e || window.event;
			var target = pega.util.Event.getTarget(e);
			var activeGrid = null;
			for(var instance in pega.ctx.Grid.map) {
				var grid = pega.ctx.Grid.map[instance];
				if(grid.editConfig == grid.EDIT_HARNESS) {
					if(pega.util.Dom.isAncestor(grid.gridDetailsDiv,target)){
						activeGrid = grid;
					}
				}else if(grid.editConfig == grid.EDIT_EXPANDPANE) {
					if(pega.util.Dom.isAncestor(grid.gridDiv,target)){
						activeGrid = grid;
					}
				}
			}
			return activeGrid;

		},
		/*
		@private - Stores the currently focussed element info in global 'Grids' object.
		@return $void$
		*/
		storeCurrentFocussedElem: function(e){
			if(!e){e=window.event;}
			if(!e.which){e.which=e.keyCode;}
			if(e.which!=9){ return;}
			try{
				var dSource=Grids.getActiveGrid(e).gridDiv.getAttribute("dataSource");
				var idx=Grids.getActiveTHIndex(document.activeElement);
				if(!pega.ctx.Grid.cacheInfo){
					pega.ctx.Grid.cacheInfo={};
				}
				if(idx>=0){
					if(!pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)]){
						pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)]={};
					}
					pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementIndex=""+idx;
					pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementTagName=document.activeElement.tagName;
					pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementID=document.activeElement.id;
				}
			}catch(ex){}
		},
		/*
		@private - Accepts currently focussed element as parameter to determine the index of the column.
		@return Index of the column.
		*/
		getActiveTHIndex: function(focussedElem){
			try{
				if(focussedElem.tagName != 'TH'){
					var ctr=1;
					while(focussedElem.tagName.toLowerCase()!="th" && ctr<10){
						focussedElem=focussedElem.parentNode;
						ctr++;
					}
				}
				if(focussedElem.tagName && focussedElem.tagName.toLowerCase()!="th"){
					return -1;
				}
				var pNode=focussedElem.parentNode;
				if(pNode.tagName && pNode.tagName.toLowerCase()!="tr"){
					return -2;
				}
				var allTh=pNode.getElementsByTagName("th");
				for(var i=0;i<allTh.length;i++){
					if(allTh[i].parentNode===pNode && allTh[i]===focussedElem){
						return i;
					}
				}
				return -3;
			}catch(ex){return -4;}
		},
		/*
		@private - Refocusses the previously focussed element. Accepts activeGridObj reference.
		@return $void$
		*/
		reFocusPrevFocussedElem: function(activeGridObj){
		try{
			var dSource=activeGridObj.gridDiv.getAttribute("dataSource");
			if(pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)]){
				var idx=pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementIndex;
				var elemType=pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementTagName;
				var elemID=pega.ctx.Grid.cacheInfo[encodeURIComponent(dSource)].focussedElementID;
				var focussedElem;
				var rowToSearch=activeGridObj.gridcontDiv.getElementsByTagName("th")[0].parentNode;
				if(!rowToSearch || !rowToSearch.tagName || rowToSearch.tagName.toLowerCase()!="tr"){
					return;
				}
				var allTHinSearchRow=rowToSearch.getElementsByTagName("th");
				var correctTH;
				var stopTheLoop=false;
				for(var i=0;i<allTHinSearchRow.length && !stopTheLoop;i++){
					if(allTHinSearchRow[i].parentNode===rowToSearch && i==idx){ /*Checking whether the th is a direct child of the tr and not a grand child, comparing the current th index with stored idx*/
						correctTH=allTHinSearchRow[i];
						stopTheLoop=true;
					}
				}
				if(!correctTH){
					return;
				}
				if(elemType.toLowerCase()=="th" || elemType.toLowerCase()=="div"){
					focussedElem=correctTH;
					correctTH.removeAttribute("aria-describedby");
					var spanelems=correctTH.getElementsByTagName("span");
					for(var i=0;i<spanelems.length;i++){
						if(spanelems[i].id=="sort"){
							focussedElem=spanelems[i];
						}
					}
				}else if(elemType.toLowerCase()=="span" || elemType.toLowerCase()=="a"){
					var spanelems=correctTH.getElementsByTagName(elemType);
					for(var i=0;i<spanelems.length;i++){
						if(elemID=="sort"){
							if(spanelems[i].id=="sort"){
								focussedElem=spanelems[i];
		}
						}else{
							if(spanelems[i].id=="pui_filter"){
								focussedElem=spanelems[i];
							}
						}
					}
				}
        /* BUG-820905 Below change is added to address a11y issue in report viewer (dynamic grid) */
        if(correctTH.querySelector('a#pui_colmenu') && focussedElem.id === 'sort') {
          focussedElem = correctTH.querySelector('.divCont');
        }
				if(focussedElem && focussedElem.focus){
					focussedElem.focus();
				}
			}
			}catch(ex){}
		}
	};
}
if(!window.doGridAction) {
	/*
	@api
	@This api can be used to execute any of the standard or custom action on the active grid object
	@param $Event$e - The event object. This event object is used to get reference to the active grid
	@param $String$action - The standard/custom action to be executed.
	     The standard actions are - INSERTBEFORE, INSERTAFTER, DELETE, ADDCHILD
	     The custom actions are ACTIVITY and FLOWACTION
	@param $String$customActivity - The custom activity/flow action to be exected
	@param $String$params - The parameters to be passed to the custom activity. It should be in query string format
	@param $function$callback - The js callback function to be executed after the action is completed
	@return $void$
	*/
	window.doGridAction = function(e,action,customActivity,params,callback,refreshLayout, bRunScript) {
		e = (e == undefined)?window.event : e;
		var grid = null;
		/*Hfix-6732: Don't process pagination until events queue is empty*/
		/*BUG-102075: Removed the condtion to check if queue is empty as it's not empty when grid is launched from modal dialog.*/
		if(!bRunScript && action=="PAGINATE" && ((pega.u.d.bModalDialogOpen && pega.u.d.isAjaxInProgress()) || (!pega.u.d.bModalDialogOpen && pega.c && pega.c.actionSequencer && !pega.c.actionSequencer.isQueueEmpty()))) {
			return;
		}

		if(params && params["dataSource"]) {
			var registeredId = pega.ctx.Grid.dataSourceToUId[params["dataSource"]];
			grid = pega.ctx.Grid.map[registeredId];
			if(grid && grid !== pega.ctx.Grid.activeGrid) {
				pega.ctx.Grid.activeGrid = grid;
			}
		}
		if(!grid) {
			grid = Grids.getActiveGrid(e);
		}
		/* BUG-53548 : Passing cachedGridObj using event mechanism */
		if(!grid) {
			grid = e["cachedGridObj"];
			if(!grid) {
				/* active grid could not be resolved even from cache in event */
				return;
			}
			else if(!pega.util.Dom.inDocument(grid.gridDiv, document)) {
				/* the cached grid points to an orphaned grid div;
				     use the datasource to figure out the correct grid
				 */
				var dataSource = grid.dataSourceRef;
				var registeredId = pega.ctx.Grid.dataSourceToUId[dataSource];
				grid = pega.ctx.Grid.map[registeredId];

				if(!grid) {
					/* the grid with the given data source no longer exists */
					return;
				}
			}
			if(grid && grid !== pega.ctx.Grid.activeGrid) {
				var newEventTarget = grid;

				var cachedRowId = e["cachedGridRowId"];
				if(cachedRowId) {
					var cachedRow = pega.ctx.dom.getElementById(cachedRowId);
					if(cachedRow) {
						var firstCell = pega.util.Dom.getFirstChild(cachedRow);
						grid.setActiveRow(null,null,grid.getRowIndex(firstCell));
						var cellIndex = e["cachedGridCellIndex"];
						if(cellIndex == -1 || cachedRow.tagName != "TR") {
							/* the event might have been generated from a cell other than <td/> OR
							 * the cachedRow returned a <li/>
							 */
							newEventTarget = firstCell;
						} else if(cachedRow.cells.length > cellIndex) {
							newEventTarget = cachedRow.cells[cellIndex];
						}
						else {
							newEventTarget = cachedRow;
						}
					}
				}
				if(e.target) {
					e.target = newEventTarget;
				}
				else {
					e.srcElement = newEventTarget;
				}

				pega.ctx.Grid.activeGrid = grid;
			}
		}

		var index = grid.getActiveRowIndex();
		if(!index)
			index = "";
		if(grid.editConfig == grid.EDIT_ROW && index!="" && action != "DELETE"  && action != "EDITITEM") {
			var row = grid.rightBodyTbl.rows[grid.getIndex(index)];
			if(pega.util.Dom.hasClass(row ,"editMode")) {
				var eventType = e.type;
				var target  = pega.util.Event.getTarget(e);
				var eventKeyCode = e.keyCode;
				var eventDetails = {type:eventType,target:target,keyCode: eventKeyCode ,context:grid};
				eventDetails.handler = grid.submitRow;
				eventDetails.args = grid;
				grid.pushToQueue(eventDetails);
			}
		}

		// Remove current selection when row + edit for IE8 (BUG-139339) & BUG-154862 fix.
		if(grid.editConfig == grid.EDIT_ROW && index!="" && action == "EDITITEM" && (pega.util.Event.isIE && pega.util.Event.isIE <= 8))
		{
            var row = grid.rightBodyTbl.rows[grid.getIndex(index)];
			if(!pega.util.Dom.hasClass(row ,"editMode"))
			{
				try
				{
					if(document.selection)
						document.selection.empty();
				}
				catch(e){}
			}
		}

		/* If (grid) already editable, do nothing (BUG-147587) */
		if(grid.editConfig == grid.EDIT_ROW && index!="" && action == "EDITITEM")
		{
			var row = grid.rightBodyTbl.rows[grid.getIndex(index)];
			var rowNext;
			if(grid.getIndex(index+1))
				rowNext = grid.rightBodyTbl.rows[grid.getIndex(index+1)];
			if(pega.util.Dom.hasClass(row ,"editMode") || pega.util.Dom.hasClass(rowNext ,"editMode"))
				return;
		}

		/*BUG-38756 - 'rowDeleted' is used in 'getFromServer' of expression_calculation.js*/
		if(action == "DELETE")
        {
			window.rowDeleted = true;
        }
		grid.doGridAction(e,action,customActivity,params,callback,((refreshLayout === "false")? false : refreshLayout));
	};
	/*
	@api
	@This api can be used to get text value of a property in the active row of the current active grid
	@param $String$property- The property name
	@param $Event$e - The event object. This event object is used to get reference to the active grid
	@return $String - The property Text
	*/
	window.getGridProperty = function(e, property) {
		var grid = Grids.getActiveGrid(e);
		return grid.getPropertyText(property);
	};
}

function filterDBP(gridObj) {
	this.gridObj = gridObj;
    this.po = pega.u.d.getPopOver();

	this.bind = function(){
		var clearFilterLink= pega.ctx.dom.getElementById("clearFilter");
		var level = pega.u.d.getPopOverLevel(clearFilterLink);
		if (level >= 0) {
			this.po = pega.u.d.getPopOver(level);
		}
        		pega.util.Event.addListener(clearFilterLink, Grids.EVENT_CLICK, this.onClearFilterClick, this, true);
				pega.util.Event.addListener(clearFilterLink, "keypress", this.onClearFilterClick, this, true);
	};

	this.unbind = function(){
		var clearFilterLink= pega.ctx.dom.getElementById("clearFilter");
        		pega.util.Event.removeListener(clearFilterLink, Grids.EVENT_CLICK, this.onClearFilterClick);
				pega.util.Event.removeListener(clearFilterLink, "keypress", this.onClearFilterClick);
	};
	this.onClearFilterClick= function(e){
		var eventType = e.type;
		var target  = pega.util.Event.getTarget(e);
		var eventKeyCode = e.keyCode;
		if(eventType == "click" || (eventType == "keypress" && eventKeyCode == 13)){
		this.gridObj.clearFiltering();
		this.po.close('clearFilter');
		}
	};

}
/*
@public- Initailizes all the grids.
@return $void$
*/
pega.ui.initGrids = function(grid) {
	if(pega.util.Dom.hasClass(document.body,"forPrinting"))
	{
		window.printWin = true;
		var gridarray= window.opener.pega.ctx.Grid.map;
		for(var instance in gridarray) {
			var gridEle = pega.ctx.dom.getElementById(instance);
            if(gridEle){
				/*BUG-185495 : Memory leak fix.*/
				/*Grids.addGrid(gridEle.id , new pega.ui.grid(gridEle));*/
                var tempObj = new pega.ui.grid(gridEle);
                Grids.addGrid(gridEle.id , tempObj);
            }
		}

	}else{
		if(grid && typeof grid!="undefined") {
			var gridElements = pega.util.Dom.getElementsById("PEGA_GRID",grid.gridDiv);
        }
        else {
            var gridElements = pega.ctx.dom.querySelectorAll("#PEGA_GRID");
		}
		if(!gridElements) {
			return;
		}
    if(!pega.ctx.Grid){
        pega.ctx.Grid={
          isFilterMenuItemClicked : false,
          map:{},
		      dataSourceToUId: {},
		      activeGrid: null,
      };
    }
     if(pega.ctx.isMDC){
      pega.ui.EventsEmitter.subscribeOnce("postMDCRender",Grids.initGridContextObject,null);
       /* BUG-377114 - Commented as there is no need to cleanup complex elements as MDC taking care of that*/
      //pega.ui.EventsEmitter.subscribe("onHarnessUnload",Grids.cleanUpGridContextMap ,null,null,null,false);
    }
		var len = gridElements.length;
		var gridEle = null;
		var iAttribute = "";
		for(var i = 0; i < len; i++) {
			/* add index to the id's so that these grids don't get reinitialized when some other section is refreshed */
			gridEle = gridElements[i];
      /* BUG-376951: HFix-44617 if the grid has no class attribute then do not bother with init */
      /* BUG-379779: HFix-45385 additionally check the bGrid attribute */
      if(gridEle && (!gridEle.hasAttribute("class") || !gridEle.hasAttribute("bGrid"))) continue;
			var newGridId = gridEle.id + pega.ui.gridCounter;
			gridEle.id = newGridId;
			var gridObj = new pega.ui.grid(gridEle);
            /* US-200358: Adding the Harness ID to the grid object so that on harness-related grids can be cleaned up on unload*/
            gridObj.pzHarnessID = pega.ctx.pzHarnessID;
			Grids.addGrid(newGridId , gridObj);
			pega.ui.gridCounter++;
      /*BUG-494519 : In deferload case no need to subscript to postmdcrender*/
			if(pega.ctx.isMDC && gridObj.gridDiv.offsetHeight === 0){  
        pega.ui.EventsEmitter.subscribeOnce("postMDCRender",gridObj.onPostMDCRenderFixGrid.bind(gridObj),null);
      }
			/*BUG-83172 START: If grid is present in tab, register a listener onTabActive to call onTabActiveFixGrid */ 
      /*BUG-572462 : Register only if grid is hidden in tab*/
			if(pega.u.d.tabViewMap && gridObj.gridDiv.offsetHeight === 0){  
				var temp = gridEle.parentNode;
				while(!temp.getAttribute("tabgroupid")) {
					temp = temp.parentNode;
					if(temp.id.toUpperCase() == "HARNESS_CONTENT" || temp.nodeName == "BODY") { // for tabs || for panelset
						temp = null;
						break;
					}
				}
				if(temp) {
					var tabgrp = pega.u.d.tabViewMap[temp.id];
					if(tabgrp) {
						var activeTab = tabgrp._configs.tabs.value[tabgrp.get("activeIndex")];
            /*BUG-490188 : Added null check for activetab */
            if(activeTab){
						  var activeTabContent = activeTab._configs.contentEl.value;
						  if(!pega.util.Dom.isAncestor(activeTabContent, gridObj.gridDiv)) {
							  tabgrp.on("activeTabChange", gridObj.fixVisibleGrid, null, gridObj);
						  }
            }
					}
				}
			}
			/*BUG-83172 END */
		}
	}
};

if(!pega.ui.grid) {
	(function() {
		var Dom = pega.util.Dom;
		var Event = pega.util.Event;
        /* US-200358: The following functions is no longer needed.
        var $ = function(id){
			return document.getElementById(id);
		};
		var $$ = function(id,root,tag){
			return pega.util.Dom.getElementsById(id,root,tag);
		};
        */
		pega.ui.gridCounter = 0;
		/*BUG-185495 : Memory leak fix. Declaring local variable.*/
		/*pegaUD = pega.u.d;*/
        var pegaUD = pega.u.d;

		pegaUD.inCall = false;
		pega.u.d.eventsArray = [];
		pega.u.d.changeInEventsArray = new pega.util.CustomEvent("changeInEventsArray");
		pegaUD.changeInEventsArray.subscribe(function(type, args, me) {
				pega.ui.grid.prototype.executeNextEvent();
		});
		/*
		@constructor
		@protected - Constructor description goes her
				@param $undefined$element– parameter description goes here.e.
		@return $undefined$ - return description goes here.
		*/
		pega.ui.grid = function(element) {
			this.gridDiv = element;
			this.init();
		};

		pega.ui.grid.prototype= {
			ROW_REPEAT : "row",
			COL_REPEAT : "col",
			SELECTED_CLASS : "gridCellSelected",
			EDIT_READWRITE: "readWrite",
			EDIT_ROW: "row",
			EDIT_MODAL: "modal",
			EDIT_READONLY: "readOnly",
			EDIT_HARNESS: "harness",
			EDIT_EXPANDPANE : "expandPane",
			CONTENT_DIV_ID: "PEGA_GRID_CONTENT",
			MODAL_ACTION: "",
			EDIT_ACTION : "EDITROW",
			SUBMIT_ACTION : "SUBMITROW",
			REFRESH_ROWS_ACTION : "REFRESHROWS",
      FLOW_ACTION : "FLOWACTION",
			dirty : false,
			sortType:"",
			sortProperty:"",
			DONOT_SUBMIT : false,
			widthSet: false,

			performWriteOperations: function() {
				var allWriteCases = this.writeCases;
				var allWriteCasesVars = this.writeCasesVars;
				var len = allWriteCases.length;
				var writeCase = null;

				for(var i= 0; i< len; i++) {
					writeCase = allWriteCases[i];
					switch(writeCase) {
						case Grids.INIT_GRID_TABLES:
							/*BUG-56872*/ /* TASK-113866: At generation width is set to 100% */
							/* BUG-83203: un-commented below if block and added additional check to avoid this only in case of tree. */
							if(!this.bTree && this.bTreegrid && this.fixedRow && this.leftHeaderDiv && this.leftBodyDiv && Dom.hasClass(this.gridcontDiv,"gPercent") == true){
								this.leftBodyDiv.style.width = this.leftHeaderDiv.offsetWidth + 'px';
							}
							/*BUG-57585*/
							if(this.bPXFixed && this.fixedCol && this.fixedRow){
								var leftBodyULoffsetHeight=0;
								if(this.leftBodyUL){
									leftBodyULoffsetHeight=this.leftBodyUL.offsetHeight;
								}
								if(this.leftBodyDiv && (leftBodyULoffsetHeight > 0) && (parseInt(this.leftBodyDiv.style.height) > leftBodyULoffsetHeight)){
									this.leftBodyDiv.style.height = leftBodyULoffsetHeight + 'px';
								}
							}
							var leftBodyULNewID = allWriteCasesVars.INIT_GRID_TABLES.leftBodyULNewID;
							var rightHeaderTblNewID = allWriteCasesVars.INIT_GRID_TABLES.rightHeaderTblNewID;
							if(leftBodyULNewID) {
								this.leftBodyUL.id = leftBodyULNewID;
							}
							if(rightHeaderTblNewID) {
								this.rightHeaderTbl.id = rightHeaderTblNewID;
							}
							break;

						case Grids.SET_UL_HEIGHT:
              if(this.bTreegrid || this.fixedCol){ /*BUG-388504: Added Tree Grid to the existing check in order to avoid misalignment of Left header table*/
							// TASK-115635: Misaligment in treegrid in standards mode
							var headerUl = Dom.getFirstChild(Dom.getFirstChild(this.leftBodyUL));
							var _this=this;

								var cellHeight = _this.rightBodyTbl.rows[0].cells[0].offsetHeight;
								if(headerUl && cellHeight) { // BUG-80506: In case of freeze column set height to header ul.  & BUG-82597
									headerUl.style.height = cellHeight + "px";
								}
							}
							break;

					}
				}
				this.writeCases = [];
				this.writeCasesVars = {};
			},

			/*
			@protected- Function description goes here.
			@return $undefined$ - return description goes here.
			*/
			init: function() {
				this.writeCases = [];
				this.writeCasesVars = {};
                this.gridcontDiv = pega.util.Dom.getElementsById(this.CONTENT_DIV_ID, this.gridDiv)[0];
				this.initGridConfig();
				this.initGridTables();
        this.dynamicGridHeaderA11y(); /* BUG-820905 Call this method to fix header a11y issue in report viewer (dynamic grid) */
				if (!this.bRowVisibleWhen) {
					this.removeFilteredGridAttribute();  /* BUG-58038 */
				}

				this.initPLProps();
				this.setFilterPage();
				this.selectNewRow();
				this.setRowHandleCellWidth();/* BUG-92169, BUG-91709, HFix-6565: Call this method to set row number column */
				var grid = this;
				if(window.printWin) {
					this.prepareForPrint();
				} else {
					this.initEventHandlers();
					this.initScrollbars();

          if (this.bTreegrid && !pega.u.d.DISABLE_TREEGRID_HEIGHT_ADJUSTMENT) {
            this.updateTreeGridRowHeight();
          }

					if((Dom.hasClass(this.gridcontDiv,"gPercent") == true) && !this.fixedCol && this.fixedRow) {
						var gridToResize = this;

						this.gridResizeHandler2 = function() {
							gridToResize.synchHeadersForPercent();
							gridToResize.setHeadersWidth(); /*BUG-172459: Added a call to setHeadersWidth to correct the header alignment on re-size*/
							gridToResize.updateHeaderCellsWidth();/*BUG-174960: Added a call to updateHeaderCellsWidth to correct the alignment*/
						};
						pega.u.d.registerResize(this.gridResizeHandler2);
          }
				}
        /*BUG-519179 - call grid runtime calculations when grid is hidden inside collapsable layout*/
				 var expandableDiv = grid.gridDiv.closest("#EXPAND-INNERDIV");
        if(expandableDiv && expandableDiv.style.display === "none" ){
          Event.addListener(expandableDiv.parentNode,"click",grid.onExpandFixGrid,grid,true);
        }

				/* Tabindex on first cell */
				var rows = this.rightBodyTbl.rows;
				try {
					if(rows[1] && !this.bTreegrid) {/* BUG-148429: Kept check for bTreeGrid. Set tabIndex only when it is not tree grid. In case of tree grid first cell is locking the focus when shift tab is pressed. Remove this check when tree grid is keyboard accessible. */
						var first_row = Dom.hasClass(rows[1], "grid-categorize-header") ? 2 : 1;
						if(rows[first_row] && rows[first_row].cells[0] && !rows[first_row].cells[0].classList.contains('expandPane')) {
							rows[first_row].cells[0].tabIndex = "0";
						}
					}
				} catch(e) {}

				if(this.bTreegrid){
					var LIs= Dom.getChildren(this.leftBodyUL);
					for(var i = 0; i < LIs.length; i++) {
						if(LIs[i].getAttribute("PL_INDEX")){
							/*  commenting as the same logic is implemented at server.
								this.arrangeIcons(LIs[i]);
							*/
						}
					}
					/*BUG-74379 : Updated grandTotal LI padding left */
				/*BUG-295707: Removing paddingLeft as grandTotal is no more supported in tree grid
                  if(this.bReportDefinition && !this.bFolderIcon){
						LIs[i-1].firstChild.style.paddingLeft = "36px";
					}*/
				}
				if(this.bCategorizedGrid){
					this.updateCategoryCounts();
				}
				this.setCalculationsForProgressiveLoad();
				this.autoAdjustProgressiveGridHeight();
				/*BUG-171781: This method hides the scrollHead for ipad/iphone/android and safari*/
				this.hideScrollHeadForMobile();
				/*Update left UL height when refresh happened after resizing columns of grid*/
				if(this.bTreegrid && Dom.hasClass(this.rightBodyTbl, "resizedTable")){
					var rows = this.rightBodyTbl.rows;
					var newHeight = 0;
					if(rows && rows.length > 0){
						var firstRowCells = rows[1].cells;
						if(firstRowCells && firstRowCells.length > 0)
							newHeight = firstRowCells[0].offsetHeight;
					}
					var LIs= Dom.getChildren(this.leftBodyUL);
					if(LIs && LIs.length > 0) {
						for(var i = 1; i < LIs.length; i++){
							var rowContentUL = Dom.getFirstChild(LIs[i]);
							if(rowContentUL && newHeight != 0)
								rowContentUL.style.height = newHeight + "px";
						}
					}
				}
				/*BUG-160175: Update the width of the second td in the tree grid if the first gridBodyLeftParent has a width defined in px.
				  This change ensures that the second table occupies the correct amount of width after column resizing and sorting*/
				if(this.bTreegrid && this.gridBodyLeftParent && Dom.hasClass(this.gridcontDiv,"gPercent") == true){
                    var gridLayoutTable = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
					if(this.gridBodyLeftParent.style.width != "" && gridLayoutTable && gridLayoutTable.rows && gridLayoutTable.rows[0].cells){
							gridLayoutTable.rows[0].cells[1].width = "100%";
					}
				}
				/* Update TH div.divCont height with that of cellIn Div,  when wrap text is enabled in Grid */
				var rows = this.rightBodyTbl.rows;
				if(rows){
					var headerRow = rows[0];
					var cells = headerRow.cells;
					for(var i = 0; i< cells.length; i++){
						if(pega.util.Dom.hasClass(cells[i] ,"wrapText")){
							var divContCell = Dom.getFirstChild(cells[i]);
							if(Event.isIE) {
								var cellInDiv = Dom.getNextSibling(Dom.getFirstChild(divContCell));
							}
							//BUG-95468 Headers in a Repeat Grid Standard Collpasible Layout Not shown Changes Start
							else {
								var cellInDiv = Dom.getNextSibling(Dom.getFirstChild(Dom.getFirstChild(divContCell)));
								divContCell.style.height = "auto";
							}
							/*BUG-129507 fix - Commenting out the below block. Setting to 'auto' is enough.*/
							/*if(divContCell && cellInDiv && cellInDiv.offsetHeight > 0){
								divContCell.style.height = cellInDiv.offsetHeight + "px";
							}*/
							//BUG-95468 Changes End
						}
					}
				}
				/* Update left UL height when wrap text is enabled for the tree grid headers in IE */
				if(this.bTreegrid && Event.isIE){
					var LIs= Dom.getChildren(this.leftBodyUL);
					var newHeight = 0;
					if(LIs && LIs.length > 0) {
						for(var i = 1; i < LIs.length; i++){
							if(LIs[i].getAttribute("isWrapEnabled") == "true"){
								var rowContentUL = Dom.getFirstChild(LIs[i]);
								var contentLI = Dom.getNextSibling(Dom.getFirstChild(rowContentUL));
								newHeight = Dom.getNextSibling(Dom.getFirstChild(contentLI)).offsetHeight;
								if(rowContentUL && newHeight != 0){
									rowContentUL.style.height = newHeight + "px";
									Dom.getFirstChild(rowContentUL).style.height = newHeight + "px";
									contentLI.style.height = newHeight + "px";
									var rows = this.rightBodyTbl.rows;
									for(var k = i; k < rows.length; k++){
										var cells = rows[k].cells;
										for(var j = 1; j < cells.length; j++){
											cells[j].style.height = newHeight + "px";
										}
									}
								}
							}
						}
					}
				}
				/* Update max-height to "none" for safari  for already resized column grid */
				if(pega.env.ua.webkit && Dom.hasClass(this.rightBodyTbl, "resizedTable")) {
					var contentRows = this.rightBodyTbl.rows;
					if(contentRows && contentRows.length > 0){
						for(var i = 0; i < contentRows.length; i++){
							var TDs = contentRows[i].children;
							if(TDs && TDs.length > 0) {
								for(var j = 0; j < TDs.length; j++){
									if(Dom.getFirstChild(TDs[j]) != null){
										Dom.getFirstChild(TDs[j]).style.maxHeight="none";
									}
								}
							}
						}
					}
				}
				this.setHeightForNoResults();

				var activeRow = this.gridcontDiv.getAttribute("gridActiveRow");
				/* For Filtered Grid on adding new row and REFRESHLIST (BUG-234771) action, selectrowonload is suppressed to avoid two row highlights. */
				if(activeRow || this.gridcontDiv.getAttribute("callFADetails") === "true") {
					this.bSelectRowOnLoad = false;
					this.selectRow(1,false);
				}

				if(this.gridcontDiv.getAttribute("refreshLayoutFromConfig") === "true") { /* Preserving the refreshLayoutFromConfig property value when row is added in a filtered grid (refresh layout case) */
					this.refreshLayoutFromConfig = "true";
				}
				var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if(this.bSelectRowOnLoad && !grid_noRes){
					var firstBodyRow = this.getLeftRow(1);
					var argsObj = {rowEle: firstBodyRow, refObj:this};
					this.selectPage(null, null, 1);
					/*If an Ajax is under progress, then setTopPriority action, else call the function direclty*/
					if(pega.c && pega.c.actionSequencer && !pega.u.d.gIsScriptsLoading && !pega.u.d.isAjaxInProgress()) {
						this.triggerEditInHarness(argsObj);
					}else {
						this.setTopPriorityAction(this.triggerEditInHarness, argsObj);
					}
					/* START-BUG-104422: when bSelectRowOnLoad == true, set focus to the grid */
					if (pega.ctx.Grid.focusedGrid && this != pega.ctx.Grid.focusedGrid) {
						pega.ctx.Grid.focusedGrid.focusGrid(false);
					}
					this.focusGrid(true);
					pega.ctx.Grid.focusedGrid = this;
					/* END-BUG-104422 */
				}

				if(this.gridcontDiv.getAttribute("callFADetails") === "true" || (this.gridcontDiv.getAttribute("callNextFADetails") === "true" && this.editConfig==this.EDIT_HARNESS)){
					var dummyEvent = {};
					var editRowIndex = this.gridcontDiv.getAttribute("editRowIndex");
					var editRowIndexedRow = Dom.getElementsById(editRowIndex,this.gridDiv);
					if(editRowIndexedRow) {
						editRowIndexedRow = editRowIndexedRow[0];
						dummyEvent.target = Dom.getChildren(editRowIndexedRow)[0]; /* get the first td of the row */
						dummyEvent.nodeName = "TD";
						dummyEvent.type = Grids.EVENT_CLICK; /* set any string */
						dummyEvent.skipPreProcessingActivity = true;
						if(this.gridcontDiv.getAttribute("callFADetails") === "true") {
							this.comingFromAdd = "true"; /* set this explicitly as reload makes the grid obj to lose its properties */
						}
						this.doGridAction(dummyEvent,"EDITITEM");
					}
				}

				if(document.compatMode!=="CSS1Compat" && navigator.userAgent.indexOf("MSIE 8")!=-1 && this.editConfig=="readWrite"){
					var selElems=this.gridcontDiv.getElementsByTagName("select");
					if(selElems && selElems.length>0){
						this.disableRowHovering=true;
					}
				}
				 if(this.bHideGridHdrWhenNoRows=="true"){
					this.toggleGridStylesForNoResultsCase();
				}

              	if(this.pageMode=="Progressive Load") {/* BUG-202693 */
					this.attachOnloadProgressiveGridHeightAdjust();
                }

				if(window.Grids){
					pega.util.Event.addListener(this.gridcontDiv, "keyup",Grids.storeCurrentFocussedElem, this, true);
				}
				if(window.Grids){
					Grids.reFocusPrevFocussedElem(this);
					if(gridSortFieldName != "" && !pega.ctx.Grid.isFilterMenuItemClicked){
						var els = pega.ctx.dom.getElementsByTagName('th');
						for (var i = 0; i < els.length; i++) {
							if (els[i].hasAttribute('sortfield') && els[i].getAttribute("sortfield") == gridSortFieldName) {
								//console.log(els[i].focus());
								els[i].focus();
							}
						}
						gridSortFieldName = "";
					}
				}

				// BUG-161868: If activeRow attribuite is present, select that row
				var activeRow = this.gridcontDiv.getAttribute("gridActiveRow");
				if(activeRow && !this.bSelectRowOnLoad && !grid_noRes){
					if(this.getLeftRow(activeRow)) {/* BUG-187380: Active row may not exists after refresh list action. So, check for the row existence.*/
						this.activeRow = activeRow;
						this.selectRow(activeRow, true);
					}
					// Remove activeRow attribute after focusing
					this.gridcontDiv.removeAttribute("gridActiveRow");
				}

				/*
				 * moved to end all write operations which are possible;
				 * this avoids multiple reflows due to scattered "writes followed by reads".
				 */
				this.performWriteOperations();
				pega.u.d.HeavyOperations.registerOnceOnInit("resizeHarness");

				if(this.bResponsiveGrid) {
					this.previousMode = this.getCurrentMode();
					/* In case of responsive grid below resize handler is required. */
					this.gridResizeHandler = function() {grid.callAPIsToAdjustGrid(); };
					pega.u.d.registerResize(this.gridResizeHandler);
				}
				//BUG-157898- Fix Sync of Left body table LI height to Right body TD in case of NO Results in Tree Grid
               /* BUG-335222: When bHideGridHdrWhenNoRows is true, none of right or left body table is visible; don't bother with these height calculations in that case */
				if(grid_noRes && this.bTreegrid && !this.bHideGridHdrWhenNoRows){
				   /*BUG-162317:  Null check is required before getting offsetHeight.*/
				   if(this.getLeftRow(1) != null){
				   var noResBodyHeight = parseFloat(this.getLeftRow(1).offsetHeight);
				   var contentRows = this.rightBodyTbl.rows;
					if(contentRows && contentRows.length > 0){
						var TDs = contentRows[1].children;
						if(TDs && TDs.length > 0) {
							TDs[0].style.height = noResBodyHeight + "px";
						}
					}
				}
				}

				 /* BUG-306742: The fix for BUG-162284 used to be here. But that caused wide grid to be moved. Also the fix was inappropriate as it tried to change the width of the grid which should have been handled by the browser */

				//BUG-243518: Adding a call to addHeightToFilterIcon
				if(this.bFilterable && Event.isIE) {
                    this.addHeightToFilterIcon();
                }
			},

			addHeightToFilterIcon: function(){
                /*Fix for BUG-286504*/
               var rightHeaderRow ;
                    if(this.fixedRow && this.rightHeaderTbl&&this.rightHeaderTbl.rows){
                       rightHeaderRow = this.rightHeaderTbl.rows[0];
                    }
                    else{
                      rightHeaderRow = this.rightBodyTbl.rows[0];
                    }
                var len = rightHeaderRow.cells.length;
                for (var i = 0; i < len; i++) {
                    var cell = rightHeaderRow.cells[i];
                    if (Dom.getElementsById("pui_filter", cell)) {
						var spanEl = Dom.getElementsById("pui_filter", cell, 'span');
                        var anchorEl = Dom.getElementsById("pui_filter", cell ,'a');
						            var offsetHeight = cell.offsetHeight || cell.style.height;
                        offsetHeight = typeof offsetHeight=="number" ? offsetHeight+"px" : (offsetHeight.indexOf("px") > 0 ? offsetHeight:0);


						// BUG-249668: If height is 0, leave it to browser (Ex: Grid in a defer loaded / inactive tab)
						if(offsetHeight) {
							//offsetHeight = offsetHeight + "px";
							// BUG-248545: Existence check for pui_filter
							if(spanEl && spanEl[0])
								spanEl[0].style.height = offsetHeight;
							if(anchorEl && anchorEl[0])
								anchorEl[0].style.height = offsetHeight;
						}
                    }
                }
			},

			toggleGridStylesForNoResultsCase:function(){
				var noresultsdiv=Dom.getNextSibling(this.gridcontDiv);
				if(this.rightBodyTbl && this.rightBodyTbl.rows&& this.rightBodyTbl.rows.length > 1) {
					if(pega.u.d.inStandardsMode ){
						if(pega.env.ua.ie)
							this.gridcontDiv.style.display="inline";
						else{
							if(Dom.hasClass(this.gridcontDiv,"gPercent") == true)
								this.gridcontDiv.style.display="block";
							else
								this.gridcontDiv.style.display="inline-block";
						}

					}
					else
						this.gridcontDiv.style.display="block";
					noresultsdiv.style.display="none";

				}else{
					this.gridcontDiv.style.display="none";
					noresultsdiv.style.display="block";
				}

			},

			/**
				This api is called from two places
					1. From init() method. During initialization.
					2. From callAPIsToAdjustGrid() with bFixOnlySize = true. During resize for responsive grid.
			*/
			setCalculationsForProgressiveLoad : function(bFixOnlySize) {
				if(this.pageMode=="Progressive Load" && this.totalRecords>0) {
				var grid = this;
					var firstRowIndex = 1;
					this.noOfPagesLoaded = 1;
					if (this.totalRecords > this.rangeSize && !bFixOnlySize) {
						this.noOfPagesLoaded = 2;
					}
					if(this.editConfig == this.EDIT_EXPANDPANE || this.bCategorizedGrid) {
						this.updateExpandedDtlsHeight();
					}
					/*for Progressive Load cache row height*/
					if (this.bDiscardInvisibleRows) {
						this.currentScrollTop = this.layoutWrapperDiv.scrollTop;
						this.updateTopBottomBufferHeights();
						this.originalTotalRecords = this.totalRecords; // BUG-89621
						if (this.customLoadStartIndex && this.customLoadStartIndex != "") {
							this.customLoadStartIndex = "";
						}
					}
					/*Incase of refresh layout, currentPageIndex>1 and so, position the scroll to that page*/
					if(this.currentPageIndex && this.currentPageIndex > 1) {
						if (!this.bDiscardInvisibleRows) {
							//BUG-147772 - fix checking if there are enough records considering the retained currenpageindex after refresh if not pointing always to the first record.
							if(this.totalRecords < (this.currentPageIndex * this.rangeSize )){
							this.currentPageIndex = 2;
							}
							this.noOfPagesLoaded = this.currentPageIndex;
							this.currentPageIndex = this.currentPageIndex - 1; /*reduce 1 from currentPageIndex as we always load 1 page extra for refresh Layout with Progressive Load */
							if(this.getActiveRowIndex() != "" && typeof this.getActiveRowIndex() != "undefined") {
								var currPgFirstRow = this.getLeftRow();
							} else {
								firstRowIndex = ((this.currentPageIndex - 1) * this.rangeSize) + 1;
								var currPgFirstRow = this.getLeftRow(firstRowIndex);
							}
						}
						/*Reigster before progressive load method to stop progressive load after setting scrollTop here.*/
						if(!bFixOnlySize) this.regBeforeProgressiveLoad(this.stopProgressiveLoad);
						if (!this.bDiscardInvisibleRows) {
							this.layoutWrapperDiv.scrollTop =  currPgFirstRow.offsetTop;
						} else if(window.scrollTopBeforeReorder && this.bFilteredGrid){ /* BUG-86307 */
							this.layoutWrapperDiv.scrollTop = window.scrollTopBeforeReorder;
							delete window.scrollTopBeforeReorder;
						} else {
							firstRowIndex = ((this.currentPageIndex - 1) * this.rangeSize) + 1;
							this.layoutWrapperDiv.scrollTop =  firstRowIndex * this.rowHeight;
						}
					}
					if (!this.bDiscardInvisibleRows) {
						this.rowHeight = this.getLeftRow(firstRowIndex).offsetHeight;
					}
					/*For progressive load reset the scroll top*/
					if (this.rowHeight) {
						this.layoutWrapperDiv.style.height = (Math.floor(this.rowHeight * this.rangeSize) + 2) + 'px';
					}
					if(this.shrinkHeightToContainer && !bFixOnlySize){
						var noScrollContainer = pega.u.d.noScrollContainer;
						if(noScrollContainer){
							noScrollContainer.attachOnLoads([grid.shrinkToContainer,[noScrollContainer.getContentContainerElement()],grid]);
						}
					}
				}
			},

			getCurrentMode: function() {
				return this.isInFatList() ? "fatlist" : (this.isColumnsDropped() ? "otherlist" : "normallist");
			},
			/*
			* This API registers the onload in pega.u.d for automatically invoking the autoAdjustProgressiveGridHeight API for current Grid Object.
			*/
			attachOnloadProgressiveGridHeightAdjust:function(){
				var _thisObj=this;
				this.adjustProgressiveGridSize=function(){
					setTimeout(function(){
						try{
							_thisObj.autoAdjustProgressiveGridHeight({"invokedFromAttachOnLoad":"yes"});
							/*BUG-185495 : Memory leak fix. Nulling the object.*/

						}catch(loadErr){}
            _thisObj = null;
					},300);
				};
				pega.u.d.attachOnload(this.adjustProgressiveGridSize,true);
			},
			/*
			* This is the api to to sync the header cells width with data cells width in case of fill 100% and progressive load
			*/
		updateHeaderCellsWidth: function() {
    if (this.bResponsiveGrid && this.isInFatList()) {
        return;
    }
    /*BUG-160213 : Changing the if condition to accommodate both progressive load and fixed header cases*/
    if (!this.bTree && !this.bTreegrid && (this.fixedRow || this.pageMode == "Progressive Load") && Dom.hasClass(this.gridcontDiv, "gPercent") == true && this.rightHeaderTbl) {
        var dataRow;
        var rightBdyTblRows = this.rightBodyTbl.rows;
        if (this.editConfig != this.EDIT_EXPANDPANE) {
            //dataRow = this.rightBodyTbl.rows[1];
            for (var i = 1; rightBdyTblRows && i < rightBdyTblRows.length; i++) {
                if (!Dom.hasClass(rightBdyTblRows[i], "grid-categorize-header")) { /*BUG-133084: Search for non category row*/
                    dataRow = rightBdyTblRows[i];
                    break;
                }
            }
        } else {
            /*dataRow = this.rightBodyTbl.rows[0]*/
            for (var i = 1; rightBdyTblRows && i < rightBdyTblRows.length; i++) {
                if (rightBdyTblRows[i].getAttribute("expanded") != "true" && !Dom.hasClass(rightBdyTblRows[i], "grid-categorize-header")) {
                    dataRow = rightBdyTblRows[i];
                    break;
                }
            }
        }
        /* BUG-185198: No results tr was ravaging the alignment */
        if (!dataRow || dataRow.id == "Grid_NoResults") {
            return; /*Do nothing as a data row is not found*/
        }
        /* Changes for BUG-142850 start */
        var headerRow = this.rightHeaderTbl.rows[0];
        var totalDataCellsWidth = 0;
        var totalHeaderCellsWidth = headerRow.offsetWidth;
        for (var i = 0; dataRow && dataRow.cells && i < dataRow.cells.length; i++) {
            var cell = dataRow.cells[i];
            /*BUG-290765 : Check for zero cell width before setting the value*/
            var cellOffsetWidth = cell.offsetWidth;
            if (Dom.hasClass(cell, "rowHandle") && cellOffsetWidth != 0) { /*BUG-133084: For rowHandle give width in px*/
                headerRow.cells[i].style.width = cellOffsetWidth + "px";
                rightBdyTblRows[0].cells[i].style.width = cellOffsetWidth + "px";
            }
            totalDataCellsWidth += parseFloat(cellOffsetWidth, 10); /*BUG-147831 : Changed parseInt to parseFloat to avoid rounding off of the width %*/
        }

        for (var i = 0; totalDataCellsWidth > 0 && dataRow && dataRow.cells && i < (dataRow.cells.length); i++) {
            var cell = dataRow.cells[i];
            var cellOffsetWidth = cell.offsetWidth;
            if (!Dom.hasClass(cell, "rowHandle")) {
                //BUG-124845-Fix handled the null check case where no of cells in datarow and header row are not same(cells merge case).
                if (headerRow && headerRow.cells[i]) {
                    // IE8 doesn't like invalid width arguments
                    var headerRowWidth = parseFloat(((cellOffsetWidth / totalHeaderCellsWidth) * 100), 10); /*BUG-147831 : Changed parseInt to parseFloat to avoid rounding off of the width %*/
                    if (isNaN(headerRowWidth))
                        headerRowWidth = "auto";
                    else
                        headerRowWidth = headerRowWidth + "%";

                    headerRow.cells[i].style.width = headerRowWidth;
                }
            }
            /* BUG-159951: Need to update rowHandle cell's width to the computed % */
            var rightBdyTblRowsCells = (rightBdyTblRows[0] && rightBdyTblRows[0].cells[i]);
            if (rightBdyTblRowsCells) {
                rightBdyTblRowsCells.style.width = ((cellOffsetWidth / totalDataCellsWidth) * 100) + "%";
            }
        }
        /* Changes for BUG-142850 end */
    }
},

			/*
			* This is the api to to sync the header cells alignment with data cells alignment in case of "Align column heading with column data" is set
			*/
			updateHeaderCellsAlignment: function(){

        //Hfix-41858 Added null check for rightBodyTbl
         if(!this.rightBodyTbl){
           return;
          }
				if(!this.bTree && !this.bTreegrid){
					var headerRow = null;
					var rightBdyTblRows = null;
					if(this.rightHeaderTbl){
						headerRow = this.rightHeaderTbl.rows[0];
						rightBdyTblRows=this.rightBodyTbl.rows;
					}
					else{
						headerRow = this.rightBodyTbl.rows[0];
						rightBdyTblRows = this.rightBodyTbl.rows;
					}


					if(headerRow == null || rightBdyTblRows == null){
						return; /*Do nothing as a data row is not found*/
					}


					var dataRow;
					if(this.editConfig!=this.EDIT_EXPANDPANE){
						for(var i=1;rightBdyTblRows && i<rightBdyTblRows.length;i++){
							if(!Dom.hasClass(rightBdyTblRows[i],"grid-categorize-header")){/*BUG-133084: Search for non category row*/
								dataRow=rightBdyTblRows[i];
								break;
							}
						}
					}else{
						for(var i=1;rightBdyTblRows && i<rightBdyTblRows.length;i++){
							if(rightBdyTblRows[i].getAttribute("expanded")!="true" && !Dom.hasClass(rightBdyTblRows[i],"grid-categorize-header")){
								dataRow=rightBdyTblRows[i];
								break;
							}
						}
					}



					if(!dataRow){
						return; /*Do nothing as a data row is not found*/
					}

					/* setting header alignment */
					for (var cellIdx = 0; cellIdx < headerRow.cells.length; cellIdx++) {
						var dataCell = dataRow.cells[cellIdx];
						var thElement = headerRow.cells[cellIdx].getAttribute("data-alignwithdata");
						var alignWithData = (thElement === "true");
						var headerCellObj = Dom.getElementsByClassName("divCont", "div", headerRow.cells[cellIdx]);
						if(alignWithData){
							if (dataCell && headerCellObj && headerCellObj.length == 1) {
								var rightAlignedSpan = Dom.getElementsByClassName("rightJustifyStyle", "span", dataCell);
								if (rightAlignedSpan && rightAlignedSpan.length >= 1) {
									// headerCellObj[0].style.textAlign = "right";
									headerCellObj[0].style.width = "100%";
									headerCellObj[0].className = "rightJustifyStyle "+headerCellObj[0].className;
									var filterLinkObj = Dom.getElementsById("pui_filter", headerRow.cells[cellIdx], "a");
									if (filterLinkObj && filterLinkObj.length >= 1) {
										headerCellObj[0].style.paddingRight = (parseInt(filterLinkObj[0].offsetWidth) +2) + "px";
									} else if (cellIdx < headerRow.cells.length - 1) {
										// headerCellObj[0].style.paddingRight = "20px";
									}
									if(!filterLinkObj){
										headerCellObj[0].style.paddingRight = "2px";
									}
								} else {
									var centerAlignedSpan = Dom.getElementsByClassName("centerJustifyStyle", "span", dataCell);
									if (centerAlignedSpan && centerAlignedSpan.length >= 1) {
										headerCellObj[0].style.margin = "0 auto";
										headerCellObj[0].style.width = "auto";
									}
								}
							}
						}
					}
				}
			},

			/* Sets height of no results elements */
			setHeightForNoResults: function() {
				var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if (!grid_noRes) {
					this.setHeadersWidth();
					this.updateHeaderCellsAlignment();
				} else { /* Setting Height to Grid No Results Message depending on the height of the first child(pyGridNoResultsMessage section height) */
					if(grid_noRes[0] && (this.bTreegrid || this.fixedCol) ) {
						var gridNoResFC = Dom.getElementsBy(function(node){return node.getAttribute("node_name") != "";},"div",grid_noRes[0])[0];
						if (gridNoResFC && gridNoResFC.offsetHeight) {
							grid_noRes[0].style.height = (gridNoResFC.offsetHeight + 12) + 'px';
							Dom.getFirstChild(grid_noRes[0]).style.height = (gridNoResFC.offsetHeight + 12) + 'px';
						}
						var parent = grid_noRes[0].parentNode;
						var leftBodyUlHeight = (grid_noRes[0].offsetHeight + Dom.getFirstChild(parent).offsetHeight);
						if(leftBodyUlHeight != 0) {/* BUG-172164: Don't assign 0 value. */
							parent.style.height = leftBodyUlHeight + 'px';   // setting parent node's height equal to sum of the heights of children.
						}
						/*BUG-154992 Added null check for gridNoResFC*/
						if (grid_noRes[1] && gridNoResFC) {		// setting height of the right table td in case of tree grid.
							Dom.getFirstChild(grid_noRes[1]).style.height = (gridNoResFC.offsetHeight + 12) + 'px';
						}
					}
					/*BUG-146815: To compensate for change of width in the "NoResults" case*/
					this.setHeadersWidth();
				}
			},
			/*Handle auto height adjust when number of rows is less than pagesize in case of progressive load*/
			autoAdjustProgressiveGridHeight: function(settingsObj){
				if(this.pageMode && this.pageMode=="Progressive Load" && this.gridAutoHeight && this.gridAutoHeight=="true"){
					var contentHeight=0;
					if(this.rightBodyTbl){
						contentHeight+=this.rightBodyTbl.offsetHeight;
					}
					var avgRowHeight = this.getAvgRowHeight();
					var nRowHeight = this.rowHeight;
					if(!nRowHeight){
						nRowHeight=0;
					}
					var aRowHeight = (avgRowHeight && avgRowHeight>nRowHeight)?avgRowHeight:nRowHeight;
                    /* BUG-158800: Stop hiding the scroll bar when advanced pagination activity is configured */
					if(contentHeight && !this.pyPaginateActivity && aRowHeight && contentHeight<(Math.floor(aRowHeight * this.rangeSize) + 2)){/* BUG-389568, HFix-46273: Added check on contentHeight. When this method is invoked and if grid is in hidden DOM then grid height becomes zero. */
            /* old code : this.layoutWrapperDiv.style.height = parseInt((contentHeight+2),10)+"px" */
            /* BUG-569460 : making height auto to ensure grid height to content */
						this.layoutWrapperDiv.style.height = "auto";
						this.addRemoveScrollHeadToProgressiveGrid({scrollHead:"hide"});
						this.layoutWrapperDiv.style.overflowY = "hidden";
						this.layoutWrapperDiv.style.overflowX = "hidden";
					}else if(Dom.getElementsById("Grid_NoResults",this.gridDiv)){ /*Handle no items scenario*/
						if(contentHeight != 0) {/* BUG-172164: Don't assign 0 value. */
							this.layoutWrapperDiv.style.height = parseInt((contentHeight+2),10)+"px";
						} else {
							this.layoutWrapperDiv.style.height = "auto";/* Set auto if contentHeight is zero, as layoutWrapperDiv gets height in generation and auto will solve border issues. */
						}

						this.addRemoveScrollHeadToProgressiveGrid({scrollHead:"hide",noitems:"true"});
						this.layoutWrapperDiv.style.overflowY = "hidden";
						this.layoutWrapperDiv.style.overflowX = "hidden";
					}else{
						if(settingsObj && settingsObj.expandPane && settingsObj.expandPane=="true"){
							this.layoutWrapperDiv.style.height = (Math.floor(aRowHeight * this.rangeSize) + 2) + 'px';
						}else if(settingsObj && settingsObj.afterLoadRow && settingsObj.afterLoadRow=="true" && this.layoutWrapperDiv.offsetHeight<parseInt((contentHeight+2),10) && contentHeight<(Math.floor(aRowHeight * this.rangeSize) + 2)){
							this.layoutWrapperDiv.style.height = parseInt((contentHeight+2),10)+"px";
						} else if(this.rangeSize == this.totalRecords){/* BUG-196402: In case of collapsible header which is collapsed on load and if page size is equal to total records then set height to auto to avoid scrollbar */
							this.layoutWrapperDiv.style.height = "auto";
						}
						this.addRemoveScrollHeadToProgressiveGrid({scrollHead:"show"});
						this.layoutWrapperDiv.style.overflowY = "auto";
						this.layoutWrapperDiv.style.overflowX = "hidden";
					}
					if(this.totalRecords == this.rangeSize) {/* BUG-149755: Invoke adjustLayoutWrapperWidth() to properly set width to this.layoutWrapperDiv */
						this.adjustLayoutWrapperWidth();
					}
					this.triggerBrowserReflow();
				}else if(settingsObj && settingsObj.expandPane=="true"){
					this.addRemoveScrollHeadToProgressiveGrid({scrollHead:"show"});
				}
				if(settingsObj && settingsObj.invokedFromAttachOnLoad=="yes" && this.layoutWrapperDiv.offsetHeight>5){
					pega.u.d.detachOnload(this.adjustProgressiveGridSize);
				}
			},
			/* shrink the height of the grid based on the container*/
			shrinkToContainer: function(container) {
				if(this.pageMode && this.pageMode=="Progressive Load"){
					var containerHeight = container.offsetHeight;
					var gridHeight = this.layoutWrapperDiv.offsetHeight;
					var adjHeight = 10;
					if(containerHeight < gridHeight){
						if((!pega.u.d.inStandardsMode) && Event.isIE && (container.clientWidth < container.scrollWidth && container.clientWidth!=0)){
							adjHeight += this.getScrollbarWidth();
						}
						this.layoutWrapperDiv.style.height = (containerHeight - adjHeight)+"px";
					}
				}
			},

			/* updates the count in the category header with a correct value*/
			updateCategoryCounts: function() {
				var categoryCounts = Dom.getElementsById("categoryCounts",this.gridDiv);
				if(categoryCounts && categoryCounts[0]) {
					categoryCounts = categoryCounts[0];
					var categoryCountsJSON = categoryCounts.getAttribute("categoryCountsJSON");
					if(categoryCountsJSON && categoryCountsJSON!=""){
						var categoryCountsJSONObj = JSON.parse(categoryCountsJSON);
						for(var key in categoryCountsJSONObj){
							var count = categoryCountsJSONObj[key];
							var divToUpdate = Dom.getElementsById(key,this.gridcontDiv);
							if(divToUpdate && divToUpdate[0]){
								divToUpdate[0].innerHTML = count;
							}
						}
					}
				}

			},
			/**
			* Reflow API: for IE8 / IE9
			*/
			triggerBrowserReflow:function(){
				/*This API triggers the browser reflow (repaint) in case of MSIE 8 / MSIE 9*/
				/*Warning: The API should be used in exceptional cases only.*/
				var browserAgentString=navigator.userAgent;
				var browsersRequiringReflow=["MSIE 8","MSIE 9"];
				for(var br=0;br<browsersRequiringReflow.length;br++){
					if(browserAgentString.indexOf(browsersRequiringReflow[br])!=-1){
						document.body.className=document.body.className;
						break;
					}
				}
			},
			/*Hide the scroll head for iphone/ipad/android and safari*/
			hideScrollHeadForMobile: function(){
				var userAgent = window.navigator.userAgent;
				var rightHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
				var isIpad = userAgent.match(/iPad/i);
				var isIphone = userAgent.match(/iPhone/i);
				var isAndroid = userAgent.match(/Android/i);
				var isSafari = userAgent.match(/safari/i) && !userAgent.match(/chrome/i);
				if(rightHeaderTbl){
					var scrollHeads = Dom.getElementsByClassName("scrollHead", "th", rightHeaderTbl);
					if(scrollHeads && scrollHeads.length>0){
						if (isIpad || isIphone || isAndroid) {
						   // iPad or iPhone or safari
							if(isIphone || isIpad || isAndroid){
								scrollHeads[0].parentNode.parentNode.parentNode.style.paddingRight = "1px";
							}
							scrollHeads[0].parentNode.removeChild(scrollHeads[0]);
						}else if(isSafari && !(this.getScrollbarWidth() > 1)){
							scrollHeads[0].parentNode.removeChild(scrollHeads[0]);
						}
					}
				}
			},
			/*Add or remove the scrollhead to progressive Grid in case of auto-height scenario*/
			addRemoveScrollHeadToProgressiveGrid:function(scrollHeadSettings){
				if(this.bResponsiveGrid && this.isInFatList()) {
					return;
				}
				if(!scrollHeadSettings || this.pageMode!="Progressive Load" ||  !this.rightHeaderDiv){ /* || !(this.gridAutoHeight && this.gridAutoHeight=="true")){ */
					return;
				}
				if(scrollHeadSettings.scrollHead=="show"){
					var adjustScrollHeaderWidth=false;
					if(Dom.hasClass(this.gridcontDiv,"gPercent")==false && navigator.userAgent.indexOf("MSIE")!=-1 && document.compatMode==="CSS1Compat"){
						adjustScrollHeaderWidth=true;
						try{
							if(this.layoutWrapperDiv.offsetWidth>0){
								this.rightHeaderDiv.style.width=(this.layoutWrapperDiv.offsetWidth-2)+"px";
							}
						}catch(jsEx){}
					}
					//BUG-124582 -Fix Scroll Head is missing on clearing the filter when size to content.
					var rtHdrDivElem=Dom.getFirstChild(this.rightHeaderDiv);
					var thElems=rtHdrDivElem.getElementsByTagName("th");
					var scrollHeadAvailable=false;
					for(var i=0;i<thElems.length;i++){
						if(Dom.hasClass(thElems[i],"scrollHead")){
							scrollHeadAvailable=true;
							break;
						}
					}
					if(!this.scrollHeadAdded || (navigator.userAgent.indexOf("MSIE")!=-1 && !scrollHeadAvailable)){
						var rightHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
						if(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0 && rightHeaderTbl && rightHeaderTbl.rows && rightHeaderTbl.rows[0].style.display!="none") {
							var scrollHeader = document.createElement("th");
								scrollHeader.style.width = this.getScrollbarWidth()+"px";
								Dom.addClass(scrollHeader, "cellCont");
								Dom.addClass(scrollHeader, "scrollHead");
								scrollHeader.innerHTML="&nbsp;";
							if(Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
								var gridTblHeaderRow = rightHeaderTbl.rows[0];
								gridTblHeaderRow.appendChild(scrollHeader);
								if(adjustScrollHeaderWidth && this.rightHeaderDiv.offsetWidth<gridTblHeaderRow.offsetWidth){
									this.rightHeaderDiv.style.width=gridTblHeaderRow.offsetWidth+"px";
									this.layoutWrapperDiv.style.width=gridTblHeaderRow.offsetWidth+"px";
								}
								if(this.layoutWrapperDiv.offsetWidth<this.rightHeaderDiv.offsetWidth){
									this.layoutWrapperDiv.style.width=this.rightHeaderDiv.offsetWidth+"px";
								}
								this.scrollHeadAdded = true;
							} else {
								/* BUG-142850 - Removed div generation, instead th is appended as scrollHead */
								var gridTblHeaderRow = rightHeaderTbl.rows[0];
								gridTblHeaderRow.appendChild(scrollHeader);
								this.scrollHeadAdded = true;
							}
							// BUG-83172: Moved in to if block because it gets executed on every tab active and +1 to width will cause problem
							if(pega.env.ua.webkit && !this.bTreegrid){
								var scrollHead = scrollHeader;
								if(scrollHead && scrollHead.length > 0 ) {
									scrollHead = scrollHead[0];
									scrollHead.style.width = parseInt(scrollHead.style.width) + 1 + "px";
									// TASK-121222: chrome requires minWidth
									scrollHead.style.minWidth = scrollHead.style.width;
								}
							}
						}
					}
				}else if(scrollHeadSettings.scrollHead=="hide" || scrollHeadSettings.noitems=="true"){
					if(Dom.hasClass(this.gridcontDiv,"gPercent")==false && navigator.userAgent.indexOf("MSIE")!=-1 && document.compatMode==="CSS1Compat"){
						try{
							if(this.rightHeaderDiv.offsetWidth>0){
								this.layoutWrapperDiv.style.width=this.rightHeaderDiv.offsetWidth+"px";
							}
						}catch(jsEx){}
					}
					if(this.scrollHeadAdded){
						var rightHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
						if(!(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0 && rightHeaderTbl && rightHeaderTbl.rows && rightHeaderTbl.rows[0].style.display!="none")) {
							var scrollHeads;
							if(Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
								scrollHeads = Dom.getElementsByClassName("scrollHead", "th", rightHeaderTbl);
							}else{
								scrollHeads = Dom.getElementsByClassName("scrollHead", "div", this.rightHeaderDiv);
							}
							if(scrollHeads && scrollHeads.length>0){
								scrollHeads[0].parentNode.removeChild(scrollHeads[0]);
								if(Dom.hasClass(this.gridcontDiv,"gPercent")){
									var gridHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
									gridHeaderTbl.style.width="100%";
								}
							}
						}
					this.scrollHeadAdded=false;
					}
				}
			},
			/*To set Top Priority action which needs to be called by EIS*/
			setTopPriorityAction: function(action, argsObj) {
				this.bTopPriorityActionSet = true;
				pega.c.actionSequencer.setTopPriorityAction(action, argsObj);
			},
            removeFilteredGridAttribute: function() {
                if (!this.gridDiv.getAttribute("bFilteredGrid") || this.gridDiv.getAttribute("bFilteredGrid") != "true") {
                    return;
                }
                var rightHeaderRow = this.rightBodyTbl.rows[0];
                var len = rightHeaderRow.cells.length;
                for (var i = 0; i < len; i++) {
                    var cell = rightHeaderRow.cells[i];
                    if (Dom.getElementsById("pui_filter", cell)) {
                        var anchorEl = Dom.getElementsById("pui_filter", cell)[0];
                        if (Dom.hasClass(anchorEl, "filtered")) {
                            return;
                        }
                    }
                }
                if (this.bTreegrid && this.leftBodyUL) {
                    var leftHeaderRow = Dom.getFirstChild(this.leftBodyUL);
                    if (Dom.getElementsById("pui_filter", leftHeaderRow)) {
                        var anchorEl = Dom.getElementsById("pui_filter", leftHeaderRow)[0];
                        if (Dom.hasClass(anchorEl, "filtered")) {
                            return;
                        }
                    }
                }
                if (this.gridDiv.removeAttribute("bFilteredGrid")) {
                    this.bFilteredGrid = false;
                    this.refreshLayout = false;
                }
            },
			/*
			* API which sets bDoNotFocusFADetails to true.
			* If it is bDoNotFocusFADetails = true, we don't focus the details after showing them, but instead we focus the field in the row.
			* It can be called by grids which have an editable field in the grid row and they want the focus to stay there when user clicks on the row or adds a row.
			*/
			DoNotFocusFADetails: function() {
				if(this.editConfig==this.EDIT_HARNESS) {
					this.bDoNotFocusFADetails = true;
				}
			},

			stopProgressiveLoad: function() {
				this.unregBeforeProgressiveLoad();
				return false;
			},
			/*register before function for Progressive Load*/
			regBeforeProgressiveLoad: function(beforePL) {
				this.beforeProgressiveLoadFn = beforePL;
			},
			/*unregister before function for Progressive Load*/
			unregBeforeProgressiveLoad: function() {
				this.beforeProgressiveLoadFn = "";
			},
			/*
				This method sets the width to row number column at runtime so that all the digits are visible
			*/
			setRowHandleCellWidth : function() {/*BUG-92169, BUG-91709, HFix-6565*/
				if(this.bNumberedSkin && this.bGrid) {
					if(this.rightBodyTbl.rows.length > 1) {
						var lastRowFirstCell = this.rightBodyTbl.rows[this.rightBodyTbl.rows.length-1].cells[0];
						//var span = Dom.getElementsByClassName("pageIndex","span",lastRowFirstCell);
						var span = Dom.getElementsByAttribute ("onclick", "*", "span", lastRowFirstCell);
						if(span.length > 0) {
							span = span[0];

							var cellWidth = span.offsetWidth;
                            if (!cellWidth) {
                              return; /* BUG-332967: Don't set the width if the grid is hidden in inactive tab or accordion */
                            } else {
                              cellWidth +=4;
                            }

							this.rightBodyTbl.rows[0].cells[0].style.width = cellWidth + "px";
							if(this.fixedRow && this.rightHeaderTbl){
								/*BUG-107294: In case of "Fill (100%)" grid, instead of updating the td width, update the width of div.*/
								if(Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
									/*Update td width when not "Fill (100%)"*/
									this.rightHeaderTbl.rows[0].cells[0].style.width = cellWidth + "px";
								}else if(Dom.hasClass(this.gridcontDiv,"gPercent") == true){
									/*Updated div width when "Fill (100%)"*/
									var divElems=this.rightHeaderTbl.rows[0].cells[0].getElementsByTagName("div");
									if(divElems && divElems.length>0){
										//post BUG-146408 changes -
										//divElems[0].style.width = cellWidth + "px";
									//BUG-146408 changes - In case of IE an adjustment of +2 is required while in case of chrome and Firefox an adjustment of -1 is required
										if(pega.util.Event.isIE){
											divElems[0].style.width = cellWidth + 2 + "px";
										}else{
											divElems[0].style.width = cellWidth - 1 + "px";
										}
									}
								}
							}
						}
					}
				}
			},
			selectNewRow: function() {
				if(this.gridcontDiv.getAttribute("editRowIndex")!=null && this.gridcontDiv.getAttribute("editRowIndex")!="" && Dom.getElementsById(this.gridcontDiv.getAttribute("editRowIndex"), this.rightBodyTbl)) {
					this.activeRow = Dom.getElementsById(this.gridcontDiv.getAttribute("editRowIndex"), this.rightBodyTbl)[0].rowIndex;

					if(!this.rightBodyTbl.rows[this.getIndex(this.activeRow)])
					{
						this.activeRow=this.activeRow-1;
					}
					this.editRowCallback([this, this.activeRow]);
					if(this.gridcontDiv.getAttribute("reloadSomePages")=="true") {
						this.customLoadStartIndex = this.activeRow;
					}
				}
			},

			getScrollObj: function(obj) {
				var obj = obj.parentNode;
				var currWindow = window;
				var top = 0;
				while(obj) {
					/*if this obj has scrollbar*/
					if(obj.id=="HARNESS_CONTENT" && pega.u.d.keepFixedVisible=="true")
					{	var hbDiv = pega.ctx.dom.getElementById("HARNESS_BUTTONS");
						if( hbDiv && (  (hbDiv.getElementsByTagName("button") && hbDiv.getElementsByTagName("button").length > 0) ||
                                                                       (hbDiv.hasChildNodes() && hbDiv.children[0].id=="HarnessFooter") ) ) {
							return [obj,currWindow,top];
						}
					}

					if(obj.offsetHeight < obj.scrollHeight)
						return [obj,currWindow,top];
					obj = obj.parentNode;
					if(obj == currWindow.document.body) {
						/*if this is the outermost window/frame then return;*/
						if(!currWindow.frameElement) {
							if(!Event.isIE && currWindow.document.body.offsetHeight<currWindow.document.body.scrollHeight) {
								return [currWindow.document.body, currWindow,top ];
							}else {
								return [currWindow.document.documentElement, currWindow,top ];
							}
						}
						else if(obj.offsetHeight < obj.scrollHeight) { /*if this frame has the scrollbar*/
							if(!Event.isIE && currWindow.document.body.offsetHeight<currWindow.document.body.scrollHeight) {
								return [currWindow.document.body, currWindow,top ];
							}else {
								return [currWindow.document.documentElement, currWindow,top ];
							}
							//return [obj, currWindow,top];
						}
						else {
							obj = currWindow.frameElement;
							top += this.getAbsoluteTop(obj);
                          	/*BUG-269088 - Handle Security exception*/
                          	try{
								currWindow = currWindow.parent;
                            }
                          	catch(e){}

						}
					}
				}
			},
			getAbsoluteTop:function(htmlObject) {
       				 var yPos = htmlObject.offsetTop;
       				 var temp = htmlObject.offsetParent;
       				 while (temp != null) {
           				 yPos += temp.offsetTop;
           				 temp = temp.offsetParent;
        				}
       				 return yPos;
   			},
			executeNextEvent :function(){
				if(!pegaUD.inCall &&pegaUD.eventsArray.length > 0){
					var params = pegaUD.eventsArray.shift();
					/*set pegaUD.incall to true only when partial refresh is set to true for the grid. grid object is nothing but params.context*/
					if(params.context.isPartialRefresh && params.context.isPartialRefresh=="true") {
						pegaUD.inCall=true;
					}
					params.context.refreshLayout = params["refreshLayout"]?true:false;
					if(params.type == "action") {

             if(params.gridAction){
               //overriding the variable in case if it's being reset by other events in the queue.
               //in case of INSERTAFTER
               params.context.action = params.gridAction;
             }
						params.handler.call(params.context,params.args);
					}else {
						params.handler.call(params.context, params.type,params.target,params.keyCode,params.args);
					}
   	 			}
			},
			pushToQueue : function(obj) {
				if(!this.eventQueueEnd) {
					pega.u.d.eventsArray.push(obj);
					pega.u.d.changeInEventsArray.fire();
				}
			},

			/*
			@private - releases all the memory used
			@return $void$
			*/
			nullify : function(fromHarnessUnload) {
				pega.u.d.eventsArray = [];

				try{Event.removeListener(this.gridDiv);}catch(e){}
				try{Event.removeListener(this.leftBodyUL);}catch(e){}
				try{Event.removeListener(this.rightBodyTbl);}catch(e){}
				try{Event.removeListener(this.layoutWrapperDiv);}catch(e){}


				if(this.focusEventHandler && !pega.env.ua.ie){
					this.gridDiv.removeEventListener("focus", this.focusEventHandler, true);
					this.focusEventHandler=null;
				}

        if(this.gridDetailsDiv) {
          this.gridDetailsDiv.removeEventListener("change",this.tempMarkAsDirty);
        }

				/* Event.removeListener(this.gridDiv, "keypress");
				Event.removeListener(this.gridDiv, "focusin");

				Event.removeListener(this.leftBodyUL, "dblclick");
				Event.removeListener(this.leftBodyUL, "keydown");

				Event.removeListener(this.rightBodyTbl, "dblclick");
				Event.removeListener(this.rightBodyTbl, "keydown");

				Event.removeListener(this.leftBodyUL, "mouseover");
				Event.removeListener(this.leftBodyUL, "mousedown"); */

				if(this.editConfig == this.EDIT_HARNESS && this.threadProcessing && this.gridcontDiv.getAttribute("pyTargetSection")) {
					Event.removeListener(this.gridDetailsDiv,"focusin");
					Event.removeListener(this.gridDetailsDiv,"focusout");
					Event.removeListener(this.gridDetailsDiv,"mouseover");
					Event.removeListener(this.gridDetailsDiv,"mouseout");

					if(this.tempSetExecutionThread && this.tempResetExecutionThread && !pega.env.ua.ie){
						this.gridDetailsDiv.removeEventListener("focus",this.tempSetExecutionThread,true);
						this.gridDetailsDiv.removeEventListener(Grids.EVENT_CLICK,this.tempSetExecutionThread,true);
						this.gridDetailsDiv.removeEventListener("mouseover",this.tempSetExecutionThread,true);
						this.gridDetailsDiv.removeEventListener("mouseout",this.tempResetExecutionThread,true);
					}

					try{Event.removeListener(this.gridDetailsDiv);}catch(e){}

				}

				Event.removeListener(document.body, Grids.EVENT_CLICK, this.resetExecutionThread);

				if(this.tempGridEventHandler){
					/* BUG-125493 - MLBUGS-DTSprint1 - singp1 Start*/
					if(pega && pega.capabilityList && pega.capabilityList.isTouchAble()){
						Event.removeListener(document.body, "touchstart", this.tempGridEventHandler);
					}
					/* BUG-125493 - MLBUGS-DTSprint1 - singp1 End*/
					Event.removeListener(document.body, "mouseup", this.tempGridEventHandler);

                    if(this.bInlineEditGridInModal && this.modalDetailsDiv){ /* BUG-301271: modalDetailsDiv is undefined sometimes */
                      Event.removeListener(document.body, "mousedown",this.setModalScrollLeft);
                    }
                    if(this.gridcontDiv.getAttribute("haswidth") == "true" && this.editConfig == this.EDIT_ROW){
                      Event.removeListener(document.body, "mousedown",this.setGridScrollLeft);
                	}
					this.tempGridEventHandler = null;
				}

				if(this.tempSetExecutionThread && this.tempResetExecutionThread && !pega.env.ua.ie){
						document.body.removeEventListener("blur",this.tempResetExecutionThread,true);
          // BUG-351991 : removing duplicate instance of removeEventListener
						document.body.removeEventListener(Grids.EVENT_CLICK,this.tempResetExecutionThread,true);

				}

				if(this.tempSetExecutionThread && this.tempResetExecutionThread && !pega.env.ua.ie){
					this.tempSetExecutionThread=null;
					this.tempResetExecutionThread=null;
				}
				if( this.threadProcessing && (this.editConfig == this.EDIT_HARNESS || (this.editConfig==this.EDIT_EXPANDPANE && this.expandedElem && Dom.isAncestor(this.rightBodyTbl, this.expandedElem))) && typeof(this.modalThreadContext)!="undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext ){
						var threadDeleteURL = SafeURL_createFromURL(pegaUD.url);
						threadDeleteURL.put("pyActivity","removeThead");
						threadDeleteURL.put("threadName",this.modalThreadContext);
						var request = pegaUD.asyncRequest('POST', threadDeleteURL);
				}

				var grid = this;
              	var cleanUpGrid = function() {
                  if(grid.gridResizeHandler) {
                    pega.u.d.unregisterResize(grid.gridResizeHandler);
                  }
                  if(grid.gridResizeHandler2) {
					          pega.u.d.unregisterResize(grid.gridResizeHandler2);
                  }
                  if(grid.adjustProgressiveGridSize) {
                    pega.u.d.detachOnload(grid.adjustProgressiveGridSize);
                  }
                  /*BUG-185495 : Memory leak fix.*/
                  /*this.dbp=null;*/
                  /* BUG-297364: grid.dbp can be null when the grid has already been nullified */
                  if (grid.dbp) {
                  	delete grid.dbp.gridObj;
                  	delete grid.dbp.po;
                  	delete grid.dbp;
                  }
                  Event.removeListener(grid.gridcontDiv,"keyup");
                  window.Grids.deleteGrid(grid.gridDiv.id);
                  /*BUG-185495 : Memory leak fix.*/
                  //delete grid.gridDiv;
                  //grid = null;
                };

        var cleanUpGridInTimeout = function() {
          // This method is for executing cleanUpGrid method in correct harness context.
          var actualContext = pega.ctx;

          setTimeout(function() {
            pega.ctxmgr.setContext(actualContext);
            cleanUpGrid();
            pega.ctxmgr.resetContext();
          }, 10);
        };
                
              	if(fromHarnessUnload) {
                  cleanUpGrid();
                } else {
                  /* unregister in timeout otherwise end up changing the same array of functions which is currently beinig used to invoke harness resize callback functions */
                	cleanUpGridInTimeout();
                }
			},

			/*
			@private - initializes grid properties like freezepanes, editing.
			@return $void$
			*/
			initGridConfig : function() {
				this.dbp = new filterDBP(this);
				var gridDiv = this.gridDiv;
				var gridContDiv = this.gridcontDiv;
				this.iKey = gridDiv.getAttribute("dataSource");
				this.bGrid = (gridDiv.getAttribute("bGrid") == "true");
				this.fixedRow = (gridDiv.getAttribute("fixedRow") == "true");
				this.bPXFixed = (Dom.hasClass(this.gridcontDiv,"gPXFixed") ==true);
				this.fixedCol = (gridDiv.getAttribute("fixedCol") == "true");
				this.repeatType = gridDiv.getAttribute("repeatType");
				this.bPageGroup = (gridDiv.getAttribute("bPageGroup")== "true");
				this.bValueList = (gridDiv.getAttribute("bValueList")== "true");
				this.bEditable = (gridDiv.getAttribute("bEditable")=="true");
				this.bRefreshOnUpdate = (gridDiv.getAttribute("bRefreshLayout")=="true");
				this.editConfig = gridDiv.getAttribute("editConfig");
				this.editFormat = gridDiv.getAttribute("editFormat");
				this.bShowExpandCollapseColumn = (gridDiv.getAttribute("bShowExpandCollapseColumn")=="true");
				this.bExpandMultipleRows= (gridDiv.getAttribute("bExpandMultipleRows")=="true");
				this.bTreegrid = (gridDiv.getAttribute("bTreegrid")== "true");
				this.bTreegridSingleCol = (gridContDiv.getAttribute("bTreegridSingleCol")=="true");
				this.bTree = (gridDiv.getAttribute("bTree") == "true");
				this.pageMode = gridContDiv.getAttribute("pyPageMode");
        this.returnResultCount = gridContDiv.getAttribute("pyReturnResultCount");
				this.gridAutoHeight = gridContDiv.getAttribute("pyGridAutoHeight");
				this.shrinkHeightToContainer = gridContDiv.getAttribute("pyNoScrollContainer");
				this.bDragDrop = (gridDiv.getAttribute("bDragDrop")== "true");
				this.deferLoadAct = gridDiv.getAttribute("deferLoadAct");
				this.appendAct = gridDiv.getAttribute("appendAct");
				this.deleteAct = gridDiv.getAttribute("deleteAct");
				this.bRowHovering = (gridDiv.getAttribute("bRowHovering")=="true");
				this.bNumberedSkin =gridDiv.className.indexOf('numberedgrid')!=-1;
				this.isPartialRefresh = this.gridcontDiv.getAttribute("ParitalRefresh");
				this.bOpenOnDblClick = (this.editConfig==this.EDIT_READONLY || this.editConfig==this.EDIT_HARNESS|| this.editConfig == this.EDIT_EXPANDPANE)?(gridDiv.getAttribute("openOnDblClick")=="true"):false;
				this.OAFunc = gridDiv.getAttribute("OAFunc");
				this.bSelectRowOnLoad = (this.editConfig==this.EDIT_HARNESS)?(gridDiv.getAttribute("selectRowOnLoad")=="true"):false;
				this.bSortable = (gridDiv.getAttribute("bSorting") == "true"); //property to identify that grid is sortable or not.
				this.sortProperty = this.gridcontDiv.getAttribute("sortProperty");
				this.sortType = this.gridcontDiv.getAttribute("sortType");
				this.categorizeBy = this.gridcontDiv.getAttribute("categorizeBy");
				this.bCategorizedGrid = ((this.editConfig == this.EDIT_READONLY)&&(this.gridcontDiv.getAttribute("categorizedGrid") == "true"));
				this.bResponsiveGrid = (this.gridcontDiv.className.indexOf("grid-responsive") != -1);
				/*Holds grid's popover level, if grid is not in any popover then holds -1, if grid presents in first level popover then holds 0*/
				this.gridPopoverLevel = pega.u.d.getPopOverLevel(gridDiv);
                /*BUG-221509 */
				this.bInlineEditGridInModal = (this.editConfig == this.EDIT_ROW) && pega.u.d.bModalDialogOpen;
                if(this.bInlineEditGridInModal){
                  this.modalDetailsDiv=pega.ctx.dom.getElementsByClassName("modal-scroll-panel")[0];
                  this.modalScrollLeft=0;
                }
              	if(this.gridcontDiv.getAttribute("haswidth") == "true" && this.editConfig == this.EDIT_ROW){
                	this.gridScrollLeft=0;
                }
				this.bReportDefinition = (gridDiv.getAttribute("bReportDefinition") == "true");
				this.bDataObject = (gridDiv.getAttribute("bDataObject") == "true");
				this.bCBOptimize = (gridDiv.getAttribute("bCBOptimize") == "true"); // TASK-131878

				this.gridPreActivity = gridDiv.getAttribute("grid-preactivity");
				this.gridPostActivity = gridDiv.getAttribute("grid-postactivity");

				this.bShowExpandDetails = (gridDiv.getAttribute("bShowExpandDetails") == "true");
				this.bShowExpandedAll = (this.gridcontDiv.getAttribute("showExpandedAll") == "true");
				this.threadProcessing = (this.gridcontDiv.getAttribute("threadProcessing") == "true");
				this.bAlwaysExpandRoot = (this.gridcontDiv.getAttribute("bAlwaysExpandRoot") == "true");//property to identify that tree/treegrid got AlwaysExpandRoot enabled or not.
				if(this.editConfig == this.EDIT_READONLY && this.bShowExpandDetails){
					this.bReadOnlyShowDetails = true;
					this.editConfig = this.EDIT_EXPANDPANE;
				}
				if(this.bDataObject) {
					this.hashedDPName = gridDiv.getAttribute("hashed-dp-page");
				}

				// US-58608: Get template; Fall-back in JS layer
				this.templateName = gridDiv.getAttribute("template-name") || this.getFATemplateName(null, true);

				this.RDName = "";
				this.RDAppliesToClass = "";
				if(this.bReportDefinition) {
					this.RDName = gridDiv.getAttribute("RDName");
					this.RDAppliesToClass = gridDiv.getAttribute("RDAppliesToClass");
					this.RDContPage = gridDiv.getAttribute("RDContPage");
 					this.RDPageName = gridDiv.getAttribute("RDPageName");
					this.RDParams = this.gridcontDiv.getAttribute("rdParams");
					this.gridLayoutID = gridDiv.getAttribute("gridLayoutID");
					this.dynamicColumnIndex = this.gridcontDiv.getAttribute("dynamicColumnIndex");
                  			this.bLoadActivity = gridDiv.getAttribute("bLoadActivity");
                  		}

				if(this.bDataObject) {
					this.DPParams = this.gridcontDiv.getAttribute("dpParams");
					this.DPSectionID = gridDiv.getAttribute("DPSectionID");
				}

				this.currentPageIndex = this.gridcontDiv.getAttribute("currentPageIndex");
				this.bPagingEnabled = false;
				if(this.currentPageIndex && this.currentPageIndex!="") {
					this.bPagingEnabled = true;
					this.currentPageIndex = parseInt(this.currentPageIndex);
					this.totalRecords = parseInt(this.gridcontDiv.getAttribute("totalRecords"), 10);
					this.rangeSize = parseInt(this.gridcontDiv.getAttribute("pyPageSize"), 10);
					/* if(this.pageMode == "First X Results") {
						this.currentPageIndex = this.totalRecords/this.rangeSize;
					} */
					this.pyPaginateActivity = this.gridcontDiv.getAttribute("pyPaginateActivity");
					this.pyPaginateActivity = (this.pyPaginateActivity ? this.pyPaginateActivity : "");
					this.pySortHandled = (this.gridcontDiv.getAttribute("pySortHandled") == "true");
					this.pyFilterHandled = (this.gridcontDiv.getAttribute("pyFilterHandled") == "true");
				}
				/*store the destination div here for edit in harness mode*/
				if(this.editConfig==this.EDIT_HARNESS) {
					var targetSection = this.gridcontDiv.getAttribute("pyTargetSection");
					if(targetSection == ""){
						this.gridDetailsDiv = Dom.getElementsById("PEGA_GRID_DETAILS", this.gridDiv)[0];
						this.gridDetailsDiv.innerHTML = "";
					}else{
						this.gridDetailsDiv = pegaUD.getSectionByName(targetSection);
                        if (this.gridDetailsDiv) {
                            this.gridDetailsDiv.setAttribute("gridId", this.gridDiv.id);
                        }
						if(!this.gridDetailsDiv){
							this.gridDetailsDiv = Dom.getElementsById("PEGA_GRID_DETAILS", this.gridDiv)[0];
						}

						/* window.avoidEmptyingGridDetails is a global scoped one time usage boolean variable;
						* if it is set to true, gridDetailsDiv will not be emptied and the variable will be reset to false;
						* this variable needs to be set to true before loading a grid
						*/
						/* US-41037 - START */
						if(!window.avoidEmptyingGridDetails) {
							this.gridDetailsDiv.innerHTML = "";
						} else if(!this.threadProcessing){ /* "window.avoidEmptyingGridDetails" is not honoured for threadProcessing */
							window.avoidEmptyingGridDetails = false;
							this.gridDetailsDiv.setAttribute("StaleDetails", "true");
						}
						/* US-41037 - END */
					}
				}
        /*BUG-807608 - Event handler for marking grid as dirty*/
        if(this.gridDetailsDiv) {
          this.tempMarkAsDirty = this.markAsDirty.bind(this);
          this.gridDetailsDiv.addEventListener("change", this.tempMarkAsDirty);
        }
				if((this.pageMode && this.pageMode=="Progressive Load") || (this.fixedRow && !this.fixedCol)) {
					this.layoutWrapperDiv = Dom.getElementsById("gridLayoutWrapper",this.gridDiv)[0];
					this.fixedRow = true;
				}

				//this.activeRow = -1;
				var columns = this.gridcontDiv.getAttribute("columnList") || "";
				columns = pega.lang.trim(columns);
				this.columnsList = columns.split(" ");
				this.DnD = false;
				this.contextMenuObjs = {}/*This object holds reference to the menubar manager object. Key of this hashmap is navrule+objclass*/
				this.menuRootNodes = {}/*Holds the root nodes to be used for construction of menubar*/
				this.bFilterable = (gridContDiv.getAttribute("bFiltering") == "true");
				this.bRowVisibleWhen = (gridDiv.getAttribute("bRowVisibleWhen") == "true");
				if(gridDiv.getAttribute("bFilteredGrid"))
					this.bFilteredGrid = (gridDiv.getAttribute("bFilteredGrid") == "true");
				this.refreshLayout = (this.bFilteredGrid)?true:false;
				this.bRODetails = (gridContDiv.getAttribute("bRODetails") == "true");
				this.bFocusibleGrid = (gridContDiv.getAttribute("focusibleGrid") == "true");
				if(this.editConfig == this.EDIT_HARNESS){
					this.bEditableGrid = (gridContDiv.getAttribute("editableGrid") == "true");
				}
                if((this.pageMode && this.pageMode == "Progressive Load") && (this.editConfig == this.EDIT_READONLY || this.editConfig == this.EDIT_MODAL || this.bReadOnlyShowDetails)) {
					this.bDiscardInvisibleRows = true;
                }
				this.bHideGridHdrWhenNoRows=gridContDiv.getAttribute("bHideGridHdrWhenNoRows");
			},

			/*API to calculate the expanded details height in the grid*/
			updateExpandedDtlsHeight: function(){
				this.expDetailsHeight = 0;
				this.categorizedHeadersHeight = 0;
				var tblRows = this.rightBodyTbl.rows;
				var length = tblRows.length;
				for(var i=0; i<length; i++) {
					var tblRow = tblRows[i];
					if(tblRow && tblRow.id=="") {
						if(tblRow.getAttribute("expanded")=="true") {
							this.expDetailsHeight += tblRow.offsetHeight;
						}else if(pega.util.Dom.hasClass(tblRow, "grid-categorize-header")) { /*Update groupby header rows height here*/
							this.categorizedHeadersHeight += tblRow.offsetHeight;
						}
					}
				}
			},
			/*
			@private - gets reference to the 4 tables & divs present in this grid
			@return $void$
			*/
			initGridTables : function() {

                var rightBodyDivs = pega.util.Dom.getElementsById("gridBody_right", this.gridcontDiv);
				if(this.bTreegrid || this.bTree) {
					try {
						if(rightBodyDivs && rightBodyDivs.length && rightBodyDivs.length > 1) {
							/*
							 * Getting more than one right body divs inside this Tree/ Treegrid. This happens if this grid has nested grids.
							 * In this case look for the table with id "gridLayoutTable", pick 2nd cell from 1st row and find the div with id "gridBody_right" again.
							 * This way we avoid the left part altogether to reach the right part
							 */
                             var gridLayoutTable = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
                             rightBodyDivs = pega.util.Dom.getElementsById("gridBody_right", gridLayoutTable.rows[0].cells[1]);
						}
					}catch(exception){}
				}
				if(rightBodyDivs && rightBodyDivs[0]){
					this.rightBodyDiv = rightBodyDivs[0];
				}

                var rightBodyTbls = pega.util.Dom.getElementsById("bodyTbl_right", this.gridcontDiv);
				if(this.bTreegrid || this.bTree) {
					try {
						if(rightBodyTbls && rightBodyTbls.length && rightBodyTbls.length > 1) {
							/*
							 * Getting more than one right body tables inside this Tree/ Treegrid. This happens if this grid has nested grids.
							 * In this case look for the table with id "gridLayoutTable", pick 2nd cell from 1st row and find the table with id "bodyTbl_right" again.
							 * This way we avoid the left part altogether to reach the right part
							 */
                             var gridLayoutTable = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
                             rightBodyTbls = pega.util.Dom.getElementsById("bodyTbl_right", gridLayoutTable.rows[0].cells[1]);
						}
					}catch(exception){}
				}

				 //HFIX - 41858 Added a null check for rightBodyTbls
          this.rightBodyTbl = rightBodyTbls ? rightBodyTbls[0]: "";
                /*BUG-209485: Adding a check for fixedCol*/
				if(this.bTreegrid || this.bTree || this.fixedCol) {/* BUG-169142: Added if block to avoid issues in case of nested scenarios. When Tree or TreeGrid is in a Grid layout then while executing this function for grid "this.leftBodyDiv" gets the node of the nested tree or treegrid. Due to this if(this.leftBodyDiv) checks gets evaluated to true for grid, which is wrong. */
                    this.leftBodyDiv = pega.util.Dom.getElementsById("gridBody_left", this.gridcontDiv);
                    this.gridBodyLeftParent = pega.util.Dom.getElementsById("bodyTbl_gbl", this.gridcontDiv);
				}
				var leftBodyULNewID = "";
				var rightHeaderTblNewID = "";
				if(this.gridBodyLeftParent) {
					this.gridBodyLeftParent = this.gridBodyLeftParent[0];
				}
				if(this.leftBodyDiv) {
					this.leftBodyDiv = this.leftBodyDiv[0];
				}
				/*Do not get the leftbody table for a column repeating layout without fixed row */
				if(this.leftBodyDiv && (this.repeatType == "row" || (this.repeatType == "column" && this.fixedRow == true))) {
                    var gridNodes = pega.util.Dom.getElementsById("gridNode", this.leftBodyDiv);
					if(gridNodes){
						//this.leftGridNodes = gridNodes; /* BUG-387940: leftGridNodes is not used anywhere so commented code as it leaks memory. */
						this.leftBodyUL = gridNodes[0];
						leftBodyULNewID = this.leftBodyUL.id + pega.ui.gridCounter;
					}
				}
                this.rightHeaderDiv = pega.util.Dom.getElementsById("gridHead_right", this.gridcontDiv);
				if(this.rightHeaderDiv) {
					this.rightHeaderDiv = this.rightHeaderDiv[0];
				}
                this.rightHeaderTbl = pega.util.Dom.getElementsById("headTbl_right", this.gridcontDiv) || pega.util.Dom.getElementsById("headTbl_right" + this.gridDiv.id.split("PEGA_GRID")[1], this.gridcontDiv);
				if(this.rightHeaderTbl){
					this.rightHeaderTbl = this.rightHeaderTbl[0];
					if(!pega.util.Dom.isAncestor(this.rightBodyTbl,this.rightHeaderTbl)){ /* For nested grid, don't update the right header table id of the inner grid */
	   					rightHeaderTblNewID = this.rightHeaderTbl.id + pega.ui.gridCounter;
					}
				}
                this.leftHeaderDiv = pega.util.Dom.getElementsById("gridHead_left", this.gridcontDiv);
				if(this.leftHeaderDiv) {
					this.leftHeaderDiv = this.leftHeaderDiv[0];
				}
				/*BUG-56872*/ /* TASK-113866: At generation width is set to 100% */
				/* BUG-83203: un-commented below if block and added additional check to avoid this only in case of tree. */
				if(!this.bTree && this.bTreegrid && this.fixedRow && this.leftHeaderDiv && this.leftBodyDiv
          && Dom.hasClass(this.gridcontDiv,"gPercent") == true){
					this.leftBodyDiv.style.width = this.leftHeaderDiv.offsetWidth + 'px';
				}
				/*BUG-57585*/
				if(this.bPXFixed && this.fixedCol && this.fixedRow){
					var leftBodyULoffsetHeight=0;
					if(this.leftBodyUL){
						leftBodyULoffsetHeight=this.leftBodyUL.offsetHeight;
					}
					if(this.leftBodyDiv && (leftBodyULoffsetHeight > 0) && (parseInt(this.leftBodyDiv.style.height) > leftBodyULoffsetHeight)){
						this.leftBodyDiv.style.height = leftBodyULoffsetHeight + 'px';
					}
				}
                this.leftHeaderTbl = pega.util.Dom.getElementsById("headTbl_left", this.gridcontDiv);
				if(this.leftHeaderTbl) {
					this.leftHeaderTbl = this.leftHeaderTbl[0];
				}
				if (this.bDiscardInvisibleRows) {
                    this.topBuffer = pega.util.Dom.getElementsById("grid-topBuffer", this.gridcontDiv)[0];
                    this.bottomBuffer = pega.util.Dom.getElementsById("grid-bottomBuffer", this.gridcontDiv)[0];
				}
				this.writeCasesVars.INIT_GRID_TABLES = 	{	leftBodyULNewID : leftBodyULNewID,
															rightHeaderTblNewID : rightHeaderTblNewID
														};
				this.writeCases.push(Grids.INIT_GRID_TABLES);
			},

			/*
			@private - initializes pagelist/pagegroup related properties
			@return $void$

			*/
			initPLProps : function() {
         ///HFIX - 41858 added null check for rightBodyTbl
         if(!this.rightBodyTbl){
             return;
           }
				if(!this.bPageGroup) {
					this.property = this.rightBodyTbl.getAttribute("PL_PROP");
					this.propertyClass = this.rightBodyTbl.getAttribute("PL_PROP_CLASS");
				}else {
					this.property = this.rightBodyTbl.getAttribute("PG_PROP");
					this.propertyClass = this.rightBodyTbl.getAttribute("PG_PROP_CLASS");
				}
				/*property to hold just the PL/PG name. This eliminates the extra .page incase of Page.Page.PL*/
				var plpgProperty = this.getPLPGProperty() || "";
                this.PLPGName = plpgProperty.substring(plpgProperty.lastIndexOf("."));
				var secDiv = pega.u.d.getSectionDiv(this.gridDiv);
				this.sectionName = secDiv.getAttribute("NODE_NAME");
				this.primPage = this.rightBodyTbl.getAttribute("PRIM_PAGE");
				/*This stores information of the Page in which grid is available*/
				this.gridReferencePage = this.rightBodyTbl.getAttribute("GRID_REF_PAGE");
				this.baseRef = pegaUD.getBaseRef(this.rightBodyTbl);
			},

			setFilterPage: function() {
				var strFCPageName = this.iKey;
				if(this.bDataObject && this.DPParams) { /*For DP with Params, remove hash code from Page Name */
						strFCPageName = strFCPageName.replace(this.getPLPGProperty(),this.getConfiguredPLPGProperty());
				}
				var filterpage = "pyFilterCriteria_"+strFCPageName;
				this.gridFilterPage = filterpage.replace(/[\(\.\)|\-]/g, "_");
			},

			/* TASK-145111
				API that returns Grid's data source given at Design Time.*/
			getConfiguredPLPGProperty: function() {
				return this.property;
			},
			/* TASK-145111
				API that returns Grid's data source at Run time. This is different from DT for Declare Pages with Params*/
			getPLPGProperty: function() {
				if(this.bDataObject && (this.DPParams || this.isACGrid)) {
					return this.hashedDPName;
				}else {
					return this.property;
				}
			},

			doGridAction : function(e,action,customActivity,params,callback, refreshLayout) {
				e = (e == undefined)?window.event : e;
				/*If Reordering is under progress and it fires click actions (which happens only in IE), then stop proceeding with grid actions.*/
				if(this.DDProcessing) {
					return;
				}
				/*Skip resetting refreshLayout for Filtered Grid*/
				/*BUG-155093 Fix setting refreshLayout for delete action on filtered  RD bound grid */
				if((!this.bFilteredGrid || action=="ADDCHILD") || (this.bFilteredGrid && action=="DELETE" && this.bReportDefinition )) {
					this.refreshLayout = refreshLayout!=null?refreshLayout:false;
				}

				if(this.bFilteredGrid && refreshLayout === "true") { /* If refreshLayout is true in doGridAction , then its clear that refresh List is configured in DV */
					this.refreshLayoutFromConfig = "true";
				}

				/**
				 * Finding target and using selectPage() to select the row being acted on so that getActiveRowIndex()
				 * returns the correct value. This fixes grid action behavior when grid action buttons(within grid among different rows)
				 * are pressed without first selecting any particular row
				 */
				var target  = Event.getTarget(e);
				var container;
				if(Dom.isAncestor(this.leftBodyUL,target))
					container = this.leftBodyUL;
				else if(Dom.isAncestor(this.rightBodyTbl,target))
					container = this.rightBodyTbl;

				if(action == "DELETE" && this.comingFromAdd == "true" && this.editConfig == this.EDIT_EXPANDPANE && this.threadProcessing) {
					if(this.propRef && this.propRef!=""){
						var addedRowID = pega.ui.property.toHandle(this.propRef);
						var deletedRowID = this.getRightRow()?this.getRightRow().id : null;
						if(addedRowID == deletedRowID){
							if(this.threadProcessing) {
								this.cancelModal(e);
								return false;
							} else {
								/* BUG-156350: comingFromAdd needs to be false in case of cancel */
								this.comingFromAdd = "false";
							}
						}
					}
				}
				if(container && !this.submitErrors &&(container == this.leftBodyUL || container == this.rightBodyTbl)) {
						this.selectPage(e,container);
				}

				var grid = this;
				var index = grid.getActiveRowIndex();
				/* BUG-140859, BUG-141939 and BUG-148746 fix setting last row as active row in case when no row is focused and add is performed after show when there are records */
				if((!index || index == "") && this.pageMode == "First X Results" && action=="INSERTAFTER" && this.totalRecords != 0) {
					this.activeRow = grid.getLastRowIndex();
					index = this.activeRow;
				}
				if(action == "ADDCHILD" && container){
					var cell = this.findCell(e, container);
					if(cell){
						var newIndex=this.getRowIndex(cell);
					}
					if(newIndex){
						index = newIndex;
					}
				}
				else if(action == "SETFOCUS" && params && params["focusIndex"]) {
					if(params.focusIndex=="last" || parseInt(params.focusIndex,10)>this.getExpandPaneTableLength()){
							params.focusIndex=this.getLastRowIndex();
					}
					index = params["focusIndex"];
				}
				grid.action = action;
				if(!index)
					index = "";
				if(action == "DELETE" || action == "EDITITEM" || action == "FLOWACTION" || action == "ADDCHILD" ||  action == "SETFOCUS" || action=="OPEN"){
					if(index == "" ||  index > grid.rightBodyTbl.rows.length-1) {
							//alert("Please select a row ");
            if(e.target !== this.gridDiv){  //BUG-345962
              alert(pega.u.d.fieldValuesList.get("Please_select_a_row"));
            }

							return false;
					}
				}
				if(!grid.sectionName){
					grid.sectionName = pegaUD.getSectionDiv(grid.gridDiv).getAttribute("NODE_NAME");
				}
				grid.callback = callback;
				if(action == "DELETE" || !grid.submitErrors) {

				if(grid.gridDiv.getAttribute("editConfig")==grid.EDIT_READONLY && (action=="INSERTBEFORE" || action=="INSERTAFTER" || action=="DELETE")) {
					grid.action="";
					return false;
				}
				if(action == "OPEN") {
					if(!(this.bReportDefinition && this.bTreegrid)){
						var row = grid.rightBodyTbl.rows[this.getIndex(index)];
						/* look for openAction arguments in right row */
						var OAArgs = row.getAttribute("OAArgs");
						if(!OAArgs) {
							/* look for openAction arguments in left row */
							var leftrow = Dom.getElementsById(row.id, grid.leftBodyUL)[0];
							var leftrowUL = Dom.getFirstChild(leftrow);
							OAArgs = leftrowUL.getAttribute("OAArgs");
						}
						if(OAArgs && OAArgs != "") {
							/* openAction arguments found in current row markup */
							var openAction = "";
							if(OAArgs.indexOf("open") == 0) {
								/* OAArgs itself has the openAction function name */
								openAction = OAArgs;
							}
							else {
								openAction = this.OAFunc + "('" + OAArgs + "');";
							}
							try{
								eval(openAction);
							}catch(e){}
						}else {
							return;
						}
					}else {
						var cell = null;
						if(container){
							cell = this.findCell(e, container);
						}
						grid.handleSummaryGridOpen(cell, index, e);
					}
				}if(action == "DELETE") {
					if(grid.editConfig == grid.EDIT_READONLY){
						grid.action = "";
						return false;
					}
					/*BUG-199189: In case of percent width grids the width styles are lost if there is an empty header*/
					if(index == 1){
						if(this.rightBodyTbl && this.rightBodyTbl.rows && this.rightBodyTbl.rows[0].style.display == "none" && this.rightBodyTbl.rows.length > 2){
							for(var i=1;i<this.rightBodyTbl.rows.length;i++){
								if(this.rightBodyTbl.rows[1].cells && this.rightBodyTbl.rows[1].cells.length>0){
									for(var j=0;j<this.rightBodyTbl.rows[1].cells.length;j++){
                                      	if(this.rightBodyTbl.rows[1].cells[j] && this.rightBodyTbl.rows[2].cells[j]){ /* BUG-209365: Added null check before updating style for cells */
										this.rightBodyTbl.rows[2].cells[j].style.width = this.rightBodyTbl.rows[1].cells[j].style.width;
									}
								}
							}
						}
					}
					}
                    /*BUG-207205: reseting this.comingFromAdd*/
                    if(this.comingFromAdd == "true"){
                       this.comingFromAdd = "false";
                    }
					grid.pushToQueue({type:"action",handler:grid.remove, context:grid,args:index, refreshLayout: this.refreshLayout });
				}else if(action == "INSERTBEFORE") {
					if(this.pageMode == "Progressive Load") {
						index = this.ensurePositiveIndex(index, action);
					}
					if(grid.editConfig == grid.EDIT_ROW || grid.editConfig == grid.EDIT_READWRITE || (grid.editConfig == grid.EDIT_EXPANDPANE && !grid.threadProcessing && grid.bExpandMultipleRows)){
						grid.pushToQueue({type:"action",handler:grid.insertBefore, context:grid,args:index, refreshLayout: this.refreshLayout });
					}else if(grid.editConfig == grid.EDIT_MODAL || grid.editConfig == grid.EDIT_HARNESS || (grid.editConfig == grid.EDIT_EXPANDPANE && (grid.threadProcessing || !grid.bExpandMultipleRows))){
						if(grid.bPageGroup){
							grid.appendLast(e);
						}else{
							if(index=="" && grid.getTableLength(grid.rightBodyTbl)>0 && !Dom.getElementsById("Grid_NoResults",this.gridDiv)){
								index=1;
								grid.activeRow=index;
							}
							if(index != ""){
								grid.insertBeforeModal(e);
							}else
								grid.appendLast(e);
						}
					}

				}else if(action == "INSERTAFTER") {
					if(this.pageMode == "Progressive Load") {
						index = this.ensurePositiveIndex(index, action);
					}
					if(grid.editConfig == grid.EDIT_ROW || grid.editConfig == grid.EDIT_READWRITE || (grid.editConfig == grid.EDIT_EXPANDPANE && !grid.threadProcessing && grid.bExpandMultipleRows) || !this.bGrid){
						grid.pushToQueue({type:"action",handler:grid.insert, context:grid,args:index, refreshLayout: this.refreshLayout, gridAction: grid.action });
            //passing a new variable gridAction beacause grid.action in context variable is being reset by previous events in the queue.
					}else if(grid.editConfig == grid.EDIT_MODAL || grid.editConfig == grid.EDIT_HARNESS || (grid.editConfig == grid.EDIT_EXPANDPANE && (grid.threadProcessing || !grid.bExpandMultipleRows))){
						if(index == "" && !this.bTreegrid && this.currentPageIndex && this.currentPageIndex!="" && this.pyPaginateActivity=="") {
							if(this.rightBodyTbl.rows.length > 1 && !Dom.getElementsById("Grid_NoResults",this.gridDiv)) {
								this.activeRow = this.rightBodyTbl.rows.length - 1;
								index = (this.currentPageIndex - 1 )*this.rangeSize + this.rightBodyTbl.rows.length - 1;
							}
						}
						if(index == "" || grid.bPageGroup){
							grid.appendLast(e);
						}else {
							grid.insertAfter(e);
						}
					}
				}else if(action == "ADDCHILD") {
					if(grid.editConfig == grid.EDIT_READONLY){
						grid.action = "";
						return false;
					}
					if(grid.bPageGroup) {
						alert("Insert Child is not supported for Page Group");
						return false;
					}

					grid.pushToQueue({type:"action",handler:grid.addChild, context:grid,args:index, refreshLayout: this.refreshLayout });
				}else if(action == "REFRESHLIST") {
					this.refreshList(e,params);
				}else if(action == "ACTIVITY"){
					grid.doCustomAction(index,customActivity,params,callback);
				}else if (action == "FLOWACTION") {
					var reloadElement = "";
					var target = Event.getTarget(e);
					if(!Dom.isAncestor(grid.gridDiv,target)){
						reloadElement = grid.getLeftRow();
					}
					pega.ctx.activeGrid = grid;
					var paramURL = new SafeURL();
					var leftRow = this.getLeftRow();
					var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
					if(!this.getPreviousGridRow(leftRow)){
						paramURL.put("PrevDisabled","true");
					}
					if(this.bDiscardInvisibleRows && (pageListIndex > 1)){
						paramURL.put("PrevDisabled","false");
					}
					this.isOpenLocalAction = true;
					/* TASK-118164: In case of FLOWACTION attach noThreadProcess to grid */
					this.bNoThreadProcess = params.noThreadProcess == "true";
					if(!this.getNextGridRow(leftRow)){
						paramURL.put("NextDisabled","true");
					}
					if(this.bDiscardInvisibleRows && (pageListIndex < this.totalRecords)){
						paramURL.put("NextDisabled","false");
					}
					/*BUG-177438: Previous/Next buttons should not be displayed in case of Assign-*/
					if(this.propertyClass.indexOf('Assign-')==0){
						paramURL.put("ShowOnlyOKCancel",true);
					}
					paramURL.put("pzHarnessID",pega.ctx.pzHarnessID);
					paramURL.put("activeGridObj", this);
					paramURL.put("UITemplatingStatus", "N");/* BUG-260187: Send templating status as N in case of grid for modal dialog */
          /*BUG-393549: adding keepMessages to paramURL if true*/
          if(pega.u.d.KeepMessages=="true"){
            paramURL.put("KeepMessages", pega.u.d.KeepMessages);
          }
					processAction(customActivity, "","", "", "",true,e,params.templateName || "",paramURL,reloadElement,true);
				}else if(action == "PAGINATE") {
					grid.paginateGrid(e, params);
				}else if(action == "SETFOCUS") {
					if(Dom.getElementsById("Grid_NoResults",this.gridDiv) && Dom.getElementsById("PEGA_GRID_SKIN",this.gridDiv).length == 1){/* BUG-153787: Kept second check to handle nested grid scenarios. Nested grid may have "Grid_NoResults" element. */
						return;
					}
					/*If params object has offset, then it's a prev/next.
					 * if params has index, then a specific index has to be focussed
					 */
					if(params && (params.offset || params.focusIndex)) {
						this.changeSetFocus(params.focusIndex,params.offset);
					} else {
						// executes for the grid action: click and handle list items set focus
						var srcEle = Event.getTarget(e);
						var containerEle = Dom.isAncestor(grid.rightBodyTbl, srcEle)?grid.rightBodyTbl:grid.leftBodyUL;
						var cell = this.findCell(null, containerEle, srcEle);
						if(this.bCategorizedGrid) {
							if(cell && !cell.parentNode.id) {
								return;
							}
						}
						if(cell) {
							if(containerEle==grid.rightBodyTbl) {
								grid.selectPage(e, grid.rightBodyTbl);
							}else {
								grid.selectPage(e, grid.leftBodyUL);
							}
						}else {
							grid.selectPage(null, null, this.getIndex(index));
						}
					}
					/*BUG-111178 Fix*/
					if(!pega.u.d.inStandardsMode && Event.isIE){
						this.triggerBrowserReflow();
					}
				}else if(action == "EDITITEM") {
					grid.handleEditItem(e,container,index);
				}
				else if(action == this.REFRESH_ROWS_ACTION) {
						var paramsObj = new Object();
						if(params && Object.prototype.toString.call(params)==="[object Array]"){ /*params is already an array*/
							paramsObj.rowsArray = params;
							grid.refreshRows(paramsObj);
						}else if(params && typeof params==="object" && Object.prototype.toString.call(params)!=="[object Array]"){ /*params is not an array*/
							var rowToRefresh = "0";
							if(params.offset==="0" && this.activeRow){
								rowToRefresh = this.activeRow;
							}
							else if(params.refreshIndex) {
								rowToRefresh = params.refreshIndex;
								if(rowToRefresh==="last"){
									rowToRefresh=this.getLastRowIndex();
								}else if(rowToRefresh==="active"){
									if(!this.activeRow){
										return;
									}
									rowToRefresh=this.activeRow;
								}
							}
							else {
								return;
							}
							var refreshRowsParam=[];
							refreshRowsParam.push(this.getEntryHandle(rowToRefresh));
							paramsObj.rowsArray = refreshRowsParam;
							paramsObj.disableSubmit = params.bDisableSubmit;
							grid.refreshRows(paramsObj);
						}
				}
				if(grid.editConfig == grid.EDIT_READONLY && (action=="INSERTAFTER" || action=="INSERTBEFORE")) {
					grid.action = "";
				}
				}
				/*BUG-107214: Marking element as Dirty only when action is not SETFOCUS / OPEN*/
        /* BUG-398688,BUG-405002: Do not markdirty for read-only details,pagination */
        /*BUG-807608 - Do not mark grid as dirty for Edit item action*/
				if(action!="PAGINATE" && action!="SETFOCUS" && action!="OPEN" && action != 'EDITITEM' /*&&!(action == 'EDITITEM' && (this.bRODetails || this.bReadOnlyShowDetails))*/){
					grid.markAsDirty();
				}
				if(document.compatMode!=="CSS1Compat" && navigator.userAgent.indexOf("MSIE")!=-1){
					setTimeout(function(){document.body.className=document.body.className;},200); /*BUG-113688: Browser reflow is required in case the browser is running in Quirks mode*/
				}
			},

			/*
			 * API to refresh rows;
			 * rowFullReferences : array of full references of rows to be refreshed;
			 * Example: To refresh the 3rd page in 2nd page and 5th page in 1st page, API needs to be invoked as below -
			 * refreshRows(["pyWorkPage.childItems(2).childItems(3)", "pyWorkPage.childItems(1).childItems(5)"]);
			 */

			refreshRows: function(paramsObj) {
				try {
					var rowFullReferences = paramsObj.rowsArray;
					var bDisableSubmit = (paramsObj.disableSubmit=="true");
					var strActionSF = new SafeURL();
					strActionSF.put("PageListProperty",this.getPLPGProperty());
					strActionSF.put("refreshLayout", "false");
					var rowsLength = rowFullReferences.length;
					var rowIndexes = [];
					var rowData = new SafeURL();
					for(var i = 0; i < rowsLength; i++) {
						var rowObj = {pyPropRef:rowFullReferences[i]};
						var rowId = pega.ui.property.toHandle(rowFullReferences[i]);
						var rowEle;
						if(this.fixedCol || this.bTreegrid) {
							rowEle = pega.util.Dom.getElementsById(rowId, this.leftBodyUL, "LI");
							if (!rowEle || !rowEle.length)
								continue;
							rowEle = rowEle[0];
							if(!bDisableSubmit) {
								rowData.copy(pegaUD.getQueryString(rowEle));
							}
						}
						rowEle = pega.util.Dom.getElementsById(rowId, this.rightBodyTbl);
						if (!rowEle || !rowEle.length)
							continue;
						rowEle = rowEle[0];
						if(this.bFilteredGrid) {
							 rowObj.curRowNum = rowEle.rowIndex;
							if(this.currentPageIndex && this.currentPageIndex!="" && this.pyPaginateActivity == "" && !this.bReportDefinition && !(this.pageMode == "Progressive Load" && !this.bDiscardInvisibleRows)) {
								rowObj.curRowNum = (this.currentPageIndex - 1) * this.rangeSize + rowObj.curRowNum;
							}
						}
						/*for categorized grid, pass the row class to render the proper odd/even row style in the response*/
						if(this.bCategorizedGrid) {
							rowObj.curRowClass = this.getRowClass(rowEle);
						}
						if(this.editConfig == this.EDIT_ROW && Dom.hasClass(rowEle ,"editMode")) {
							rowObj.editRow = "true";
							// making leftRowBefore and rightRowBefore null inorder to submit row even when it is non dirty.
							this.leftrowbefore = null;
							this.rightrowbefore = null;
						}
						if(!bDisableSubmit) {
							rowData.copy(pegaUD.getQueryString(rowEle));
						}
						rowIndexes.push(rowObj);
					}
					rowData.put("strIndexInList",JSON.stringify(rowIndexes));
					strActionSF.put("EditRow",'false');
				    //TASK-144049  :StartIndex Parameter Issue Start
				    if(this.bReportDefinition ||  this.pyPaginateActivity){
						var startIndex = (this.currentPageIndex - 1) * this.rangeSize + 1;
						strActionSF.put("startIndex", startIndex);
					}
				    //TASK-144049  :StartIndex Parameter Issue End

					var gridIndex= pega.u.d.getLayoutIndex(this.gridcontDiv);
					var partialParams = {
						partialTrigger : "editRow" +this.getConfiguredPLPGProperty()+gridIndex,
						domAction : "replace",
						beforeDomAction :this.loadRefreshRows,
						beforeDomActionContext:this,
						beforeParams : null,
						afterDomAction :this.refreshRowsCallback
						// afterParams : [this,this.activeRow],
					};
					partialParams.appendExtraQueryString = rowData; /*Pass the query string built from all the rows data to append to post body.*/
					var focusParams = new Array(this.getPLPGProperty(), this.activeRow);
					/*do not submit the row until client side validations are passed in the editable row*/
					// if(typeof(bClientValidation)!="undefined"){
						// if(bClientValidation &&(typeof(validation_validate) == "function")&& ((this.leftBodyUL && !validation_validate(this.leftBodyUL)) || !validation_validate(this.rightBodyTbl))){
						// this.selectRow(this.activeRow, true);
						// pega.u.d.eventsArray = new Array();
						// this.submitErrors = true;
						// // this.focusOnNewEditableRow();
						// if(typeof(customClientErrorHandler)!= "undefined"){
							// var exit = customClientErrorHandler();
							// if(exit){
								// this.callUnregDD();
								// this.resetInCall();
								// if(type!="keypress")
									// return false;
								// else
									// return true;
							// }
						// }else{
							// this.callUnregDD();
							// alert(form_submitCantProceed);
							// this.focusFirstErrorField(this.activeRow);
							// this.resetInCall();
							// if(type!="keypress")
								// return false;
							// else
								// return true;
							// }
						// }
					// }
					// this.gridcontDiv.setAttribute("editRowIndex", "");
					strActionSF.put("gridAction", this.REFRESH_ROWS_ACTION);

					if(this.gridPreActivity) {
						strActionSF.put("gridPreActivity", this.gridPreActivity);
					}
					if(this.gridPostActivity) {
						strActionSF.put("gridPostActivity", this.gridPostActivity);
					}
          /* BUG-521635: A flag to control message clearing from primary page */
          strActionSF.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');

					var reloadParams = {
						preActivity:"pzdoGridAction",
						preActivityParams:strActionSF.toQueryString(),
						event:null,
						focusParams:focusParams,
						reloadEle: this.gridDiv,
						partialParams: partialParams
					}
					pegaUD.reloadRepeatLayout(reloadParams.preActivity,reloadParams.preActivityParams,reloadParams.event,reloadParams.focusParams,reloadParams.reloadEle ,reloadParams.partialParams,true);
				}catch(e){
					this.resetInCall();
					if(console)	console.log(e);
					return false;
				}
			},

			loadRefreshRows : function(responseObj) {
				var responseText = responseObj.responseText;
				var rowsContent = responseText.split("||END||")[0];
				var reloadElement = responseObj.argument[0];
				var contentDiv = document.createElement("div");
				contentDiv.innerHTML = rowsContent;
				var rightTable = null;
				var rightTables = Dom.getElementsById("bodyTbl_right", contentDiv);
				if(rightTables && rightTables[0]){
					rightTable = rightTables[0];
				}
				var leftUL = null;
				var gridNodes = Dom.getElementsById("gridNode", contentDiv, "UL");
				if((this.fixedCol || this.bTreegrid) && gridNodes && gridNodes[0]) {
					leftUL = gridNodes[0];
				}
				var partialParams = responseObj.argument[6];
				var grid = this;
				var gridActiveRow=grid.activeRow;
				var refreshRowsLoadCallback  = function (domObj){
					if(domObj && domObj.id != "PegaOnlyOnce") {
						pega.u.d.processOnloads(domObj);
					}
					if(pega.u.d.gridLoadManager){
						pega.u.d.gridLoadManager.afterLoad();
					}
					var rightTableEl = Dom.getElementsById("bodyTbl_right", domObj);
					if (rightTableEl && rightTableEl.length) {
						rightTableEl = rightTableEl[0];
						var responseRows = rightTableEl.rows;
						var responseRowsLen = rightTableEl.rows.length;
						// var localCnt = 0;
						for(var i = 0; i < responseRowsLen; i++) {
							var responseRow = responseRows[0]; /* Row which has content .*/
							if (!responseRow || !responseRow.id)
								continue;
							var actualRow = Dom.getElementsById(responseRow.id, grid.rightBodyTbl);
							if (!actualRow || !actualRow.length)
								continue;
							actualRow = actualRow[0];
							if (Dom.hasClass(actualRow, "notFocused"))
								Dom.addClass(responseRow, "notFocused");
							// if(grid.editConfig==grid.EDIT_EXPANDPANE) {
							// 	if(rightRow.id=="" && rightRow.getAttribute("expanded")=="true") {
							// 		if(dummyRightRow && dummyRightRow.getAttribute("expanded")=="true") {
							// 			localCnt++;
							// 			continue;
							// 		}
							// 		grid.expDetailsHeight += rightRow.offsetHeight; update the expanded Rows height to the property
							// 		if(dummyRightRow){
							// 			Dom.insertBefore(rightRow, dummyRightRow);
							// 		}else if(i==newRowsLen-1){/*handling boundary condition*/
							// 			Dom.getFirstChild(grid.rightBodyTbl).appendChild(rightRow);
							// 		}
							// 		continue;
							// 	}
							// }
							/*BUG-174560: Synchronizing the display style of the actual and response rows*/
							if(actualRow.style && actualRow.style.display == "none"){
								responseRow.style.display = "none"
							}
							if(grid.bExpandMultipleRows) { /* BUG-126163: Update details postion */
								var rowDetailsDiv1 = Dom.getElementsById("rowDetail"+actualRow.id, grid.rightBodyTbl);
								var actualRowDetailsTR = null;
								if(rowDetailsDiv1 && rowDetailsDiv1[0]) {
									rowDetailsDiv1 = rowDetailsDiv1[0];
									actualRowDetailsTR = rowDetailsDiv1.parentNode.parentNode;
								}
								var responseRowDetailsTR = Dom.getNextSibling(responseRow);
								if(responseRowDetailsTR && responseRowDetailsTR.getAttribute("expanded") != null && actualRowDetailsTR) {
									actualRowDetailsTR.parentNode.replaceChild(responseRowDetailsTR, actualRowDetailsTR);
								} else if(actualRowDetailsTR && actualRowDetailsTR.getAttribute("expanded") !=null && actualRowDetailsTR.style.display == "none") {
									actualRowDetailsTR.parentNode.removeChild(actualRowDetailsTR);
								}
							}
							/*BUG-366678, BUG-378807: If the very first row of a 100% grid is refreshed using the refresh current row, performing innerHTML to replace the content of <TD> to avoid UI distortion.
              */
              if((grid.editConfig == grid.EDIT_READWRITE || grid.editConfig == grid.EDIT_READONLY) && Dom.hasClass(grid.gridcontDiv,"gPercent") && grid.activeRow == 1){
	              for (var i = 0; i < actualRow.cells.length; i++){
                  actualRow.cells[i].innerHTML = responseRow.cells[i].innerHTML;
	              }
              }else{
							  actualRow.parentNode.replaceChild(responseRow, actualRow);
              }
              /*BUG-366678, BUG-378807: Changes end*/
							/*Remove the details div for ExpandPane when only*/
							if(grid.threadProcessing || !grid.bExpandMultipleRows){
								var rowDetailsDiv = Dom.getElementsById("rowDetail"+actualRow.id, grid.rightBodyTbl);
								if(rowDetailsDiv && rowDetailsDiv[0]) {
									rowDetailsDiv = rowDetailsDiv[0];
									grid.expandedElem = null;
									var detailsTR = rowDetailsDiv.parentNode.parentNode;
									detailsTR.parentNode.removeChild(detailsTR);
								}
							}

							// localCnt++;
						}
					}
					var leftULelement = Dom.getElementsById("gridNode", domObj);
					if (leftULelement && leftULelement.length) {
						leftULelement = leftULelement[0];
						var responseLIs = Dom.getChildren(leftULelement);
						var responseLIsLen = responseLIs.length;
						for(var i = 0; i < responseLIsLen; i++) {
							var responseLI = responseLIs[i]; /* Row which has content .*/
							if (!responseLI.id)
								continue;
							var actualLI = Dom.getElementsById(responseLI.id, grid.leftBodyDiv);
							if (!actualLI || !actualLI.length)
								continue;
							actualLI = actualLI[0];
							actualLI.replaceChild(Dom.getFirstChild(responseLI), Dom.getFirstChild(actualLI));
						}
					}
					pega.u.d.gIsScriptsLoading = false;
					var tempDiv = Dom.getElementsById("refreshRowsTempDiv", grid.gridDiv);
					if(tempDiv && tempDiv.length){
						tempDiv[0].parentNode.removeChild(tempDiv[0]);
					}
					/*grid.changeSetFocus(gridActiveRow,0);*/
					grid.selectRow(grid.activeRow, true);



				};
				if(rightTable || leftUL) {
					var tempDiv = document.createElement("div");
					contentDiv.id = "refreshRowsTempDiv";
					contentDiv.style.visibility = "hidden";
					contentDiv.style.position = "absolute";
					contentDiv.style.zIndex = "-1";
					if(this.gridcontDiv.parentNode)
						this.gridcontDiv.parentNode.insertBefore(tempDiv,this.gridcontDiv);
					partialParams.domElement = tempDiv;
					pegaUD.loadDOMObject(reloadElement,contentDiv.outerHTML,refreshRowsLoadCallback,partialParams);
				}
				return false;
			},


			ensurePositiveIndex: function(index, action) {
				var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if(grid_noRes) {
					return "";
				}

				if(index && index > 0) {
					return index;
				}
				var currentPage = this.currentPageIndex ? this.currentPageIndex : 0;
				var noIndex = index ? false : true;
				if(action === "INSERTAFTER") {
					/* if index is empty, select the last row in the currently visible page */
					if(currentPage != 0) {
						if (this.bDiscardInvisibleRows) {
							index = this.getNoOfRowsLoaded();
						} else {
							index = currentPage * this.rangeSize;
						}
						var totalRows = this.getTableLength(this.rightBodyTbl);
						if(index > totalRows) {
							index = totalRows;
						}
					} else {
						index = this.rangeSize;
					}
				}
				else if(action === "INSERTBEFORE") {
					/* if index is empty, select the first row in the currently visible page */
					if (currentPage != 0 && !this.bDiscardInvisibleRows) {
						index = ((currentPage - 1) * this.rangeSize) + 1;
					} else {
						index = 1;
					}
				}
				if (this.bDiscardInvisibleRows && noIndex) {
					this.activeRow = index;
				} else {
					this.selectPage(null, null, index);
				}
				return index;
			},

			fireTopPriorityEvent: function(target, type) {
				if(target){
					pega.c.actionSequencer.fireTopPriorityEvent(target, type);
				}
			},
			focusGrid: function(focus) {
						var func = null;
						if (focus) {
								func = pega.util.Dom.removeClass;
						} else {
								func = pega.util.Dom.addClass;
						}
						if (this.bTreegrid || this.fixedCol) {
								func(this.getLeftRow(this.getActiveRowIndex()), "notFocused");
						}
						func(this.getRightRow(this.getActiveRowIndex()), "notFocused");
						if(document.compatMode!=="CSS1Compat" && navigator.userAgent.indexOf("MSIE")!=-1){
							setTimeout(function(){document.body.className=document.body.className;},100); /*BUG-113688: Browser reflow is required in case the browser is running in Quirks mode*/
						}
			},
			prepareForPrint: function() {
				if(this.rightBodyTbl) {
					this.rightBodyTbl.style.tableLayout = "auto";
					if(this.leftBodyDiv) {
						var rcRows = Dom.getElementsByClassName("rowContent", "UL", this.leftBodyDiv);
						var noULS = false;
						if(rcRows && rcRows.length == 0) {
							rcRows = Dom.getElementsByClassName("gridRow", "LI", this.leftBodyDiv);
							noULS = true;
						}
						for(var i=0; i<this.rightBodyTbl.rows.length; i++) {
							var newCell = document.createElement("td");
							if(noULS == false) {
								newCell.appendChild(rcRows[i]);
							} else {
								var newUL = document.createElement("UL");
								Dom.addClass(newUL, "gridNode");
								newUL.appendChild(rcRows[i]);
								newCell.appendChild(newUL);
							}
							this.rightBodyTbl.rows[i].insertBefore(newCell, this.rightBodyTbl.rows[i].cells[0]);
						}

						this.rightBodyTbl.rows[0].cells[0].style.width=this.leftBodyDiv.style.width;
						this.leftBodyDiv.parentNode.removeChild(this.leftBodyDiv);
					}
                    this.rightHeaderTbl = pega.util.Dom.getElementsById("headTbl_right" + this.gridDiv.id.split("PEGA_GRID")[1], this.gridcontDiv);
					if(this.rightHeaderTbl){
						this.rightHeaderTbl = this.rightHeaderTbl[0];
						this.rightBodyTbl.rows[0].parentNode.insertBefore(this.rightHeaderTbl.rows[0], this.rightBodyTbl.rows[0]);
						this.rightHeaderTbl.parentNode.removeChild(this.rightHeaderTbl);
						if(this.leftHeaderTbl) {
							this.rightBodyTbl.rows[0].insertBefore(this.leftHeaderTbl.rows[0].cells[1], this.rightBodyTbl.rows[0].cells[0]);										this.leftHeaderTbl.parentNode.removeChild(this.leftHeaderTbl);
						}
					}
				}
				if(this.rightBodyDiv) {
					this.rightBodyDiv.style.height = "auto";
					this.rightBodyDiv.style.width = "auto";
				}
				if(this.leftBodyDiv) {
					this.leftBodyDiv.parentNode.removeChild(this.leftBodyDiv);
				}
				if(this.rightHeaderDiv) {
					this.rightHeaderDiv.parentNode.removeChild(this.rightHeaderDiv);
				}
				if(this.leftHeaderDiv) {
					this.leftHeaderDiv.parentNode.removeChild(this.leftHeaderDiv);
				}
				if(this.gridcontDiv) {
					this.gridcontDiv.style.height = "auto";
					this.gridcontDiv.style.width = "auto";
				}
				if(pega.ctx.dom.getElementById("hScrollDiv")) {
					var hsDiv = pega.ctx.dom.getElementById("hScrollDiv");
					hsDiv.parentNode.removeChild(hsDiv);
				}
				if(pega.ctx.dom.getElementById("vScrollDiv")) {
					var vsDiv = pega.ctx.dom.getElementById("vScrollDiv");
					vsDiv.parentNode.removeChild(vsDiv);
				}
				this.addCSSclass("#pega_ui_load", "visibility: hidden");
				this.addCSSclass("#pega_ui_mask", "visibility: hidden");
				this.addCSSclass(".hiddenCell", "display: none");
			},
			addCSSclass : function(selector, rule) {
				if (document.all) {
					document.styleSheets[document.styleSheets.length - 1].addRule(selector, rule);
				} else if (document.getElementById) {
					document.styleSheets[document.styleSheets.length - 1].insertRule(selector + " { " + rule + " }", i+=1);
				}
			},
			isLastFocussableElement: function(content, element) {
				if(!content) {
					return;
				}
				if(content.nodeName == "LI" && Dom.hasClass(content, "gridRow")) {
					content = Dom.getFirstChild(content);
				}
				var focustags = content.getElementsByTagName("*");
				for(var len = focustags.length - 1; len >= 0 ; len--) {
					var felem = focustags[len];
					var fNodeName = felem.nodeName;
                  /* Bug-229746: Added felem.offsetWidth check. By doing this focusible element in hidden cell will be skipped.
                  		Ex: If last cell in a row is hidden then focusible element in that hidden cell is considered and row submit is not done, due to which we see unexpected call and event queue gets corrupted with actions which will never be processed. */
					if ((fNodeName == "A" || fNodeName == "BUTTON" || ((fNodeName=="TD" || fNodeName=="TH" || fNodeName=="SPAN" || fNodeName=="DIV" || fNodeName=="IMG" ||  fNodeName=="I") && felem.outerHTML.split(">")[0].toUpperCase().indexOf("TABINDEX") != -1)
						||fNodeName == "SELECT"||fNodeName == "INPUT"
						|| fNodeName ==  "TEXTAREA") && (felem.offsetWidth && felem.type != "hidden" && felem.style.display != "none" && ((felem.currentStyle && felem.currentStyle.visibility != "hidden" && felem.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(felem, "").visibility != "hidden" && window.getComputedStyle(felem, "").display != "none")))) {
            /*BUG-361140 : Handling Radio Group Scenario as tabbing not possible through options */
            var bRadioGroupElement=false;
            if(element.type == "radio" && felem.type == "radio"){
              var elementsRadioGroup=pega.ctx.dom.closest(element,"div[data-ctl='RadioGroup']");
              if(elementsRadioGroup.contains(felem)){
                bRadioGroupElement=true;
              }
            }
						if(felem == element || bRadioGroupElement) {
							try {
								felem.focus();
								felem.focus();
								if(felem.select) felem.select();
								return true;
							}catch(e){}
						} else {
							return false;
						}
					}
				}
			},
      //BUG-551847 : keyboard to open link in table doesn't work
      hasFocusableContent: function(element) {
				if(!element){
          return false;
        }
        var contentElements = element.getElementsByTagName('*');
        for(var i = 0; i < contentElements.length; i++){
          if(pega.u.d.isFocusableNode(contentElements[i])){
            return true;
          }
        }
        return false;
			},

			isFirstFocussableElement: function(content, element) {
				if(!content) {
					return;
				}
				var focustags = content.getElementsByTagName("*");
				for(var len = 0; len < focustags.length; len++) {
					var felem = focustags[len];
					var fNodeName = felem.nodeName;
					/* Bug-229746: Added felem.offsetWidth check. By doing this focusible element in hidden cell will be skipped.
                  		Ex: If first cell in a row is hidden then focusible element in that hidden cell is considered and row submit is not done, due to which we see unexpected calls and event queue gets corrupted with actions which will never be processed. */
					if ((fNodeName == "A" || fNodeName == "BUTTON" || ((fNodeName=="TD" || fNodeName=="SPAN" || fNodeName=="DIV" || fNodeName=="IMG" || fNodeName=="I") && felem.outerHTML.split(">")[0].toUpperCase().indexOf("TABINDEX") != -1)
						||fNodeName == "SELECT"||fNodeName == "INPUT"
						|| fNodeName ==  "TEXTAREA" )&& (felem.offsetWidth && felem.type != "hidden" && ((felem.currentStyle && felem.currentStyle.visibility != "hidden" && felem.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(felem, "").visibility != "hidden" && window.getComputedStyle(felem, "").display != "none")))) {
						if(felem == element) {
							try {
								felem.focus();
								felem.focus();
								if(felem.select) felem.select();
								return true;
							}catch(e){}
						} else {
							return false;
						}
					}
				}
			},

			/*
			@protected- Function description goes here.
			@param $undefined$e – parameter description goes here.
			@param $undefined$container – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			keyDownHandlerLeft : function(e,container){
				if(this.repeatType == this.COL_REPEAT) {
					return;
				}
				if(!this.activeRow || this.activeRow == -1) {
					this.selectPage(e,container);
				}
				if(e.keyCode == "9"){
					var eventType = e.type;
					var target  = Event.getTarget(e);
					var eventKeyCode = e.keyCode;
					var srcEl = Event.getTarget(e);
					var actRowIndex = this.getIndex(this.activeRow);
					var parent = srcEl.parentElement;
					var callSelectPage = true;
					while(parent) {
						if (parent.getAttribute("expanded") == "true") {
							actRowIndex = actRowIndex + 1;
							callSelectPage = false;
							break;
						} else if (parent.nodeName == "TR" && parent.id) {
							break;
						} else {
							parent = parent.parentElement;
						}
					}
					/*BUG-148385 encapsulating the code below inside try catch block so that js exception seen in case of tree grid is not seen. Functionality issue will be addressed once tree grid accessibility story is handled */
					try
					{
					if(!e.shiftKey) {
                        if (this.isLastFocussableElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[actRowIndex].id, this.leftBodyUL, "LI")[0], srcEl)) {
							if(this.focusFirstElement(this.rightBodyTbl.rows[actRowIndex])) {
								Event.preventDefault(e);
							} else {
								if(this.editConfig == this.EDIT_ROW && this.activeRow) {
									if(this.activeRow && Dom.hasClass(this.rightBodyTbl.rows[actRowIndex], "editMode")) {
										var eventDetails = {type:eventType, target:target, keyCode:eventKeyCode ,context:this};
										eventDetails.handler = this.submitRow;
										eventDetails.args = this;
										this.pushToQueue(eventDetails);
										if(this.submitErrors) { //When there are errors while submission, prevent the default behavior tab out.
											Event.preventDefault(e);
										}
									}
								}
								var nextToBeFocussedRow = Dom.getNextSiblingBy(this.rightBodyTbl.rows[actRowIndex], function(element) {
										if(element.style.display == "none") return false;
										return true;
									});
								/* BUG-168295: Don't focus the no results message */
								var nextToBeFocussedRowIndex = (nextToBeFocussedRow && nextToBeFocussedRow.id != "Grid_NoResults") ?  nextToBeFocussedRow.rowIndex : -1;
								var nextToBeFocRowActualIndex = this.getIndex(nextToBeFocussedRowIndex);
								if(!this.submitErrors && nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex]) {
									Event.preventDefault(e);
                                    if (!(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[nextToBeFocRowActualIndex].id, this.leftBodyUL, "LI") && this.focusFirstElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[nextToBeFocRowActualIndex].id, this.leftBodyUL, "LI")[0]))) {
										this.focusFirstElement(this.rightBodyTbl.rows[nextToBeFocRowActualIndex]);
									}
									this.selectPage(null,this.leftBodyUL,nextToBeFocRowActualIndex);
								}
							}
						}
                    }
                    else {
                        if ((!this.fixedCol && this.isFirstFocussableElement(this.rightBodyTbl.rows[actRowIndex], srcEl)) || (this.fixedCol && this.isFirstFocussableElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[actRowIndex].id, this.leftBodyUL, "LI")[0], srcEl))) {
							if(this.editConfig == this.EDIT_ROW && this.activeRow) {
								if(Dom.hasClass(this.rightBodyTbl.rows[actRowIndex], "editMode")) {
									var eventDetails = {type:eventType, target:target, keyCode:eventKeyCode ,context:this};
									eventDetails.handler = this.submitRow;
									eventDetails.args = this;
									this.pushToQueue(eventDetails);
									if(this.submitErrors) {
										Event.preventDefault(e);
									}
								}
							}
							var nextToBeFocussedRow = Dom.getPreviousSiblingBy(this.rightBodyTbl.rows[actRowIndex], function(element) {
										if(element.style.display == "none") return false;
										return true;
									});
							/* BUG-168295: Don't focus the no results message */
							var nextToBeFocussedRowIndex = (nextToBeFocussedRow && nextToBeFocussedRow.id != "Grid_NoResults") ?  nextToBeFocussedRow.rowIndex : -1;
							/*Commented for A11Y for proper traversal in expand pane edit mode.
							var nextToBeFocRowActualIndex = this.getIndex(nextToBeFocussedRowIndex);*/
							var nextToBeFocRowActualIndex = nextToBeFocussedRowIndex;
							if(nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex].getAttribute("expanded") == "true" && (this.rightBodyTbl.rows[nextToBeFocRowActualIndex].style.display == "none" || this.rightBodyTbl.rows[nextToBeFocRowActualIndex].offsetHeight == 0)) {
								nextToBeFocRowActualIndex = nextToBeFocRowActualIndex - 1;
							} else if (nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex] && Dom.hasClass(this.rightBodyTbl.rows[nextToBeFocRowActualIndex], "grid-categorize-header")) {
								nextToBeFocRowActualIndex = nextToBeFocRowActualIndex - 1;
							}
							if(!this.submitErrors && nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex]) {
								if(this.focusLastElement(this.rightBodyTbl.rows[nextToBeFocRowActualIndex])) {
									Event.preventDefault(e);
									if(callSelectPage && nextToBeFocRowActualIndex)
										this.selectPage(null, this.leftBodyUL, nextToBeFocRowActualIndex);
                                } else if (pega.util.Dom.getElementsById(this.rightBodyTbl.rows[nextToBeFocRowActualIndex].id, this.leftBodyUL, "LI") && this.focusLastElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[nextToBeFocRowActualIndex].id, this.leftBodyUL, "LI")[0])) {
									Event.preventDefault(e);
									this.selectPage(null,this.leftBodyUL,nextToBeFocRowActualIndex);
									this.focusLastElement(this.rightBodyTbl.rows[nextToBeFocRowActualIndex]);
								}
							}
						}
					}
					}
					catch(ex)
					{
					}
				}
			},

			keyDownHandlerRight : function(e,container){
				if(!this.bGrid) {
					return;
				}
				if(e.keyCode == "9"){
					var eventType = e.type;
					var target  = Event.getTarget(e);
					var eventKeyCode = e.keyCode;
					var srcEl = Event.getTarget(e);
					var actRowIndex = this.activeRow ? this.getIndex(this.activeRow) : 0;
					var parent = srcEl.parentElement;
					while(parent && true) {
						if (parent.getAttribute("expanded") == "true") {
							actRowIndex = actRowIndex + 1;
							break;
						} else if (parent.nodeName == "TR" && parent.id) {
							break;
						} else {
							parent = parent.parentElement;
						}
					}
					if(!e.shiftKey) {
						if(this.isLastFocussableElement(this.rightBodyTbl.rows[actRowIndex], srcEl)) {
							if(this.editConfig == this.EDIT_ROW && this.activeRow) {
								var row = this.rightBodyTbl.rows[actRowIndex];
								if(Dom.hasClass(row, "editMode")) {
									var eventDetails = {type:eventType,target:target,keyCode: eventKeyCode ,context:this};
									eventDetails.handler = this.submitRow;
									eventDetails.args = this;
									this.pushToQueue(eventDetails);
									if(this.submitErrors) {
										Event.preventDefault(e);
									}
								}
							}
							var nextToBeFocussedRow = Dom.getNextSiblingBy(this.rightBodyTbl.rows[actRowIndex], function(element) {
										if(element.style.display == "none") return false;
										return true;
									});
							/* BUG-168295: Don't focus the no results message */
							var nextToBeFocussedRowIndex = (nextToBeFocussedRow && nextToBeFocussedRow.id != "Grid_NoResults") ?  nextToBeFocussedRow.rowIndex : -1;
							/* Commented for A11Y for proper traversal in expand pane edit mode.
							var nextToBeFocRowActualIndex = this.getIndex(nextToBeFocussedRowIndex); */
							var nextToBeFocRowActualIndex = nextToBeFocussedRowIndex;
							if(nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex].getAttribute("expanded") == "true" && (this.rightBodyTbl.rows[nextToBeFocRowActualIndex].style.display == "none" || this.rightBodyTbl.rows[nextToBeFocRowActualIndex].offsetHeight == 0)) {
								nextToBeFocRowActualIndex = nextToBeFocRowActualIndex + 1;
							} else if (nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex] && Dom.hasClass(this.rightBodyTbl.rows[nextToBeFocRowActualIndex], "grid-categorize-header")) {
								nextToBeFocRowActualIndex = nextToBeFocRowActualIndex + 1;
							}
							if(!this.submitErrors && nextToBeFocussedRowIndex != -1 && this.rightBodyTbl.rows[nextToBeFocRowActualIndex]) {
								if(this.leftBodyUL) {
                                    if (this.focusFirstElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[nextToBeFocRowActualIndex].id, this.leftBodyUL, "LI")[0])) {
										Event.preventDefault(e);
										this.selectPage(null,this.leftBodyUL, nextToBeFocRowActualIndex);
									}
								}else {
									if(this.focusFirstElement(this.rightBodyTbl.rows[nextToBeFocRowActualIndex])) {
										Event.preventDefault(e);
										this.selectPage(null,this.rightBodyTbl, nextToBeFocRowActualIndex);
									}
								}
							}
						}
					} else {
						if(this.isFirstFocussableElement(this.rightBodyTbl.rows[actRowIndex], srcEl)) {
                            if (this.leftBodyUL && this.focusLastElement(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[actRowIndex].id, this.leftBodyUL, "LI")[0])) {
								Event.preventDefault(e);
							}else{/*In case of grid without freeze column it comes here.*/
								this.keyDownHandlerLeft(e,container);
							}
						}
					}
				}
			},
			isTargetComplexProperty : function(target){
                var autoCompleteDivs = pega.ctx.dom.querySelectorAll("div.autocomplete_main");
				var acLen = autoCompleteDivs.length;
				for(var i=0; i<acLen; i++) {
					if(Dom.isAncestor(autoCompleteDivs[i] ,target)) { //inside auto complete div
						return true;
					}
				}
				/*BUG-115115: check for new pxAutoComplete */
				/* AutoComplete Result selected using keyboard */
				var ctrlName = target.getAttribute("data-ctl");
				if (ctrlName != null && typeof(ctrlName) == "string" && ctrlName.toLowerCase() == "[\"autocompleteag\"]") {
					return true;
				}
				/* AutoComplete Result selected using mouse */
                autoCompleteDivs = pega.ctx.dom.querySelectorAll("div.lookupPO");
				var acLen = autoCompleteDivs.length;
				for(var i=0; i<acLen; i++) {
					if(Dom.isAncestor(autoCompleteDivs[i] ,target)) { //inside auto generated auto complete div
						return true;
					}
				}
				var dateCalendarDiv = pega.ctx.dom.getElementById("Pega_Cal_Cont");
				if(dateCalendarDiv && Dom.isAncestor(dateCalendarDiv, target)) { //inside popup div calendar
					return true;
				}
				/* menu item selected using mouse *//* BUG-157474: Moved this block from 7.2 */
                /*BUG-188953: Added check similar to old menu for new menus
                NOTE: THIS TRAVERSES THE DOM UPTO THE BODY.*/
                if ((pega.ui.menubar && pega.ui.menubar.Manager && (jQuery(target).closest(".menuitem").length > 0 || jQuery(target).closest(".menubar").length > 0)) || (pega.c.menu && pega.c.menu.isInMenu(target))) {
					return true;
				}
				/*inside smartPrompt's results popup*/
				if(typeof(OpenRuleAdvanced_isActive) == "function" && OpenRuleAdvanced_isActive()) {
					return true;
				}

				return false;
			},

			/*Method to check if the event source is inside No Results Message. Used to eat up events on No results TR. */
			isTargetNoResultsMsg : function(evtSrc){
				var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if(grid_noRes && grid_noRes[0] && Dom.isAncestor(grid_noRes[0], evtSrc)) {
					return true;
				}
				if(grid_noRes && grid_noRes[1] && Dom.isAncestor(grid_noRes[1], evtSrc)) {
					return true;
				}
				return false;
			},

			/*
				Method to check if the passed element layered above the grid's level. This API currently considers only overlay level.
			*/
			isElementLayeredAboveGrid : function(element){
				/*BUG-145271: Do not submit if srcElement inside modal dialog */
				if(this.isOpenLocalAction)
					return true;
				var targetPopoverLevel = pega.u.d.getPopOverLevel(element);
					if(this.gridPopoverLevel < targetPopoverLevel){
						return true;
					}
			},

			gridEventHandler : function (e,container) {
				var eventType = e.type;
				var target  = Event.getTarget(e);

				var eventKeyCode = e.keyCode;

				if(!eventKeyCode)
					eventKeyCode = ""
                if (eventType == "keyup") {
					/* Added to use isLastEventFromRow from pzpega_ui_events */
                    this.setIsLastEventFromRow(target);
					/* return here itself as we dont have any other handlers for keyup event */
                    return;
                }
				if(this.repeatType == this.COL_REPEAT) {
						if(eventType=="mouseup" || eventType=="touchstart")
						{
							if(this.rightHeaderTbl)
								this.rightHeaderTbl.style.position="relative";
						}
				}

				if(Dom.isAncestor(this.leftBodyUL,target))
					container = this.leftBodyUL;
				else if(Dom.isAncestor(this.rightBodyTbl,target))
					container = this.rightBodyTbl;
				/*If target is no results message, don't do anything.*/
				if(this.isTargetNoResultsMsg(target)) {
					return;
				}
				if(this.bRowHovering){
					if(eventType == "mouseover" || eventType == "mouseout") {
						var cell = this.findCell(e, container);
						// BUG-66062 : Below condition is required to prevent row hover in nested grid.
						if(!this.isElementFromSameGridContDiv(cell)) {
							return;
						}
						if( (!cell) || (pega.util.Dom.hasClass(cell,"rowHandle") || pega.util.Dom.hasClass(cell, "expandPane")) )
							return;
						var row = cell.parentNode;
						if(row && row.getAttribute("expanded") == "true"){
							row = row.previousSibling;
							while(row.nodeType!=1)
								row	= row.previousSibling;
						}
						if(this.bTreegrid || this.fixedCol){
							var rowIndex = this.getRowIndex(cell);
							row = this.rightBodyTbl.rows[this.getIndex(rowIndex)];
						}
						/*Hover class name is appended */
						if(eventType == "mouseover")
							this.onCellHover(row, true);
						/*Hover class name is removed */
						if(eventType == "mouseout")
							this.onCellHover(row, false);
					}
				}

				if(eventType == "scroll") {
					if(this.bProgressiveLoading) {
						/* rows are already being loaded */
						return;
					}
					var _this = this;

					if(_this.scrollTimer) {
						clearTimeout(_this.scrollTimer);
					}
					 /*BUG-515973 - START : set the correct context before sending request */
					var currentContext = pega.ctxmgr.getCurrentHarnessContext();
          var harnessContext = pega.ctxmgr.getContextByTarget(target);
          pega.ctxmgr.setContext(harnessContext);
					_this.scrollTimer=setTimeout(function() { _this.progressiveLoadGrid();} , 300);
          pega.ctxmgr.resetContext(currentContext);
          /* BUG-515973 - END */
				}

        // inform performance tracker of action in flight
        pega.ui.statetracking.setBusy("gridEvent");

				if(eventType == "keydown") {
          if(eventKeyCode === 32) {
            /* BUG-820905 Fix for report viewer(dynamic grid) filter that are menu button - if the key is spacebar - then simulate click to open the menu */
            if (target && target.id == "pui_colmenu") {
              Event.preventDefault(e);
              target.click();
              return;
            }
          }
					if(eventKeyCode == 9) {
						this.bringToView(e);
						/*for A11Y enable save discard on tab on the details portion*/
						if(this.editConfig==this.EDIT_EXPANDPANE || this.bShowExpandDetails) {
							if(!this.threadProcessing || (this.threadProcessing && this.comingFromAdd!="true")){
								/*invoke enabling buttons for only for editing cases of grid with WO*/
								var parent = target;
								while(true){
									parent = parent.parentNode;
									if(!parent || parent.id == this.gridDiv.id){
										break;
									}
									if(parent.id=="modaldialog_con"){
										this.selectPage(e,container);
										var cell = this.findCell(e, container);
										if(cell){
											var rowIndex = this.getRowIndex(cell);
											if(rowIndex && rowIndex != "" && rowIndex != 0){
												this.enableSaveDiscardButtons(e);
											}
										}
										break;
									}
								}
							}
						}
					}
					/* BUG-142187 Progressive Load not fetching rows on up / down arrow - start */
					var sNodeName = target.nodeName;
					/* Don't act on input elements or hidden elements */
					if(!((sNodeName == "SELECT" || sNodeName == "OPTION" ||sNodeName == "INPUT"|| sNodeName ==  "TEXTAREA")&& (target.type != "hidden" && ((target.currentStyle && target.currentStyle.visibility != "hidden" && target.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(target, "").visibility != "hidden" && window.getComputedStyle(target, "").display != "none"))))) {
						if (eventKeyCode == 40 || eventKeyCode == 9) {
							/* Down arrow */
							if(this.pageMode == "Progressive Load" && this.activeRow == this.getLastRowIndex()) {
									/* BUG-159201: Set higher value of scroll top to scroll the div down
									 * This triggers the scroll event that fetches the next set of rows
									 */
								if(this.layoutWrapperDiv.scrollTop + this.layoutWrapperDiv.clientHeight != this.layoutWrapperDiv.scrollHeight) {
									/* The active row is not the last row */
									this.layoutWrapperDiv.scrollTop += this.getAvgRowHeight();
								}
							}
						} else if (eventKeyCode == 38 || (eventKeyCode == 9 && e.shiftKey)) {
							/* Up arrow */
							if(this.pageMode == "Progressive Load" && this.activeRow == this.getFirstLoadedRowIndex()) {
									/* BUG-159201: Set lower value of scroll top to scroll the div up
									 * This triggers the scroll event that fetches the previous set of rows
									 */
								if(this.layoutWrapperDiv.scrollTop != 0) {
									/* The active row is not the first row */
									this.layoutWrapperDiv.scrollTop -= this.getAvgRowHeight();
								}
							}
						}
					}
					/* BUG-142187 Progressive Load not fetching rows on up / down arrow - start */

					if(container == this.leftBodyUL) {
						this.keyDownHandlerLeft(e,container);
					}else if(container == this.rightBodyTbl){
						this.keyDownHandlerRight(e,container);
					}
				}else if (eventType == Grids.EVENT_DOUBLE_CLICK){
					var cell = this.findCell(e, container);
					if(!cell) {
              			pega.ui.statetracking.setDone();
						return;
                    }
					var rowIndex = this.getRowIndex(cell);
					if(!rowIndex || rowIndex == "" || rowIndex == 0) {
              			pega.ui.statetracking.setDone();
						return;
                    }
					//return if row is disabled
					var row = this.rightBodyTbl.rows[rowIndex];
					if(!row) {
              			pega.ui.statetracking.setDone();
                      	return; // if row is undefined, return and ignore event
                    }
					var isDisabled = row.getAttribute("busyRow");
					if(isDisabled){
              			pega.ui.statetracking.setDone();
						return;
					}
					if(this.bReportDefinition && this.bTreegrid){
						var cellIndex = null;
						if(cell.tagName == "TD"){
							cellIndex = cell.cellIndex;
						}
						/* this change is a quick fix to provide an ability to disable drill down for tree grid
						currently DSM team uses below code in their UserWorkForm to set this property.
							function disableDD(){
								// pyRowsSubSectiontestB is the datasource page which you can get from pages & classes tab of the section where the tree grid is present.
								var uid = Grids.dataSourceToUId["pyRowsSubSectiontestB.pyGrouping"];
								var grid = pega.ctx.Grid.map[uid];
								grid.disableDD = true;
							}
							pega.ui.d.attachOnload(disableDD, true);

							In future if we introduce a design time configuration to disable drill down report then we should use the same property "disableDD" on grid object.
						*/
						if(!this.disableDD == true){
							this.openDDReport(rowIndex,cellIndex);
						}
					}
				}
        /* BUG-797485 - Do not execute this code in case of double click */
        else if(eventType == Grids.EVENT_CLICK && (!e.detail || e.detail==1)){
					/* Added to use this variable from pzpega_ui_events : START */
                    this.isLastEventFromRow = this.getIsLastEventFromRow(target);
					/* Added to use this variable from pzpega_ui_events : END */

					/* BUG-143912: Invoke filter and sort event handlers only on click */
					if(eventType == Grids.EVENT_CLICK) {
						if(this.filterOnProperEvent(container, e, target)) {
              				pega.ui.statetracking.setDone();
							return;
						}else if(this.menusOnProperEvent(container, e, target)) {
                   			pega.ui.statetracking.setDone();
							return;
						}else if(this.sortOnProperEvent(container, e, target)){
              				pega.ui.statetracking.setDone();
							return;
						}
					}

					if(!this.submitErrors &&(container == this.leftBodyUL || container == this.rightBodyTbl)) {
						if(pega.control.isActionableElement(target) || !this.bGrid) {
							/*When click is on the expand collapse node, don't update the active row as well. (backward compatibility)*/
							if(!(this.bTreegrid && target && target.tagName=="A" && target.parentNode && target.parentNode.id=="iconExpandCollapse")) {
								// BUG-66549:avoiding the execution of select row (highlighting) when a previously expandeded row
								//is collapsed in case of WO grid or bExpandMultipleRows is false as it causes flickering.
								if (this.toBeCollapsed) {
									this.setActiveRow(e,container);
								} else {
									this.selectPage(e,container);
								}
							}
						}else {
						    this.setActiveRow(e,container);
						}
						if(this.editConfig==this.EDIT_EXPANDPANE || this.bShowExpandDetails) {
							if (!this.isLastEventFromRow && this.getLeftRow() && this.getLeftRow().getAttribute("rowExpanded") == "true") {
								var detailsDiv = Dom.getElementsById("rowDetail" + this.getLeftRow().id, this.gridDiv)[0];
								// BUG-66423: Highlight the active row and enable save/disard buttons only if the target is a descendant of grid details div.
								if (Dom.isAncestor(detailsDiv, target)) {
									if (!this.threadProcessing || (this.threadProcessing && this.comingFromAdd!="true")) {
										/*invoke enabling buttons for only for editing cases of grid with WO*/
										if (this.toBeCollapsed) {
											// BUG-66549:avoiding the execution of select row (highlighting) when a previously expandeded row
											// is collapsed in case of WO grid or bExpandMultipleRows is false as it causes flickering.
											this.setActiveRow(e,container);
										} else {
											this.selectPage(e,container);
										}
										if(!this.bRODetails) { /* enable the buttons only if details are editable */
											var cell = this.findCell(e, container);
											if(cell){
												var rowIndex = this.getRowIndex(cell);
												if(rowIndex && rowIndex != "" && rowIndex != 0){
													this.enableSaveDiscardButtons(e);
												}
											}
										}
									}
								}
							}
						}
					}
					var eventDetails = {type:eventType ,target:target,keyCode : eventKeyCode,context:this, refreshLayout: this.refreshLayout };
					/* In preview of section with grid ,on clicking of insert/delete icons(even though they are disabled)  the entire preview stream was replaced with this new partial generated code
					 so not making  a call when buttons are disabled*/

					if(target && target.disabled)
						return;
					if(this.repeatType == this.ROW_REPEAT && target && target.id && target.id == "RLDel") {
						if(this.comingFromAdd == "true" && this.editConfig == this.EDIT_HARNESS){
							eventDetails.handler = this.cancelModal;
							this.pushToQueue(eventDetails);
						}
						eventDetails.handler = this.removeFromGrid;
						eventDetails.args = container;
						this.pushToQueue(eventDetails);
					}else if(this.repeatType == this.ROW_REPEAT && target && target.id && target.id == "RLAdd") {
						if(!this.editConfig || this.editConfig=="" || this.editConfig == this.EDIT_READWRITE){ //call append to grid when it is not edit modal and not read only.
							eventDetails.handler = this.appendToGrid;
							eventDetails.args = container;
							this.pushToQueue(eventDetails);
						} else {
							doGridAction(e,"INSERTAFTER");
						}
					}
					/*BUG-247316- PushTOQueue if the event is click*/
					else if(target && this.bTreegrid && eventType == Grids.EVENT_CLICK){
						if(Dom.hasClass(target, "expandNode") || Dom.hasClass(target, "collapseNode")) {
							eventDetails.handler = this.doExpandCollapse;
							eventDetails.args = this;
							this.pushToQueue(eventDetails);
						}
					}

				}else if(eventType == "keypress") {
					var eventDetails = {type:eventType ,target:target,keyCode : eventKeyCode ,context:this, refreshLayout: this.refreshLayout};
					if(eventKeyCode !=13) {
               			pega.ui.statetracking.setDone();
						return;
                    }

					if(this.repeatType == this.ROW_REPEAT  && target && target.id && target.id == "RLDel") {
						eventDetails.handler = this.removeFromGrid;
						eventDetails.args = container;
						this.pushToQueue(eventDetails);
					}else if(this.repeatType == this.ROW_REPEAT  && target && target.id && target.id == "RLAdd") {
						if(this.editConfig==this.EDIT_ROW) {
							doGridAction(e,"INSERTAFTER");
						}else {
							eventDetails.handler = this.appendToGrid;
							eventDetails.args = container;
							this.pushToQueue(eventDetails);
						}
					}else{
						/* below if cond cannot be moved to appendToGrid check details for bug-22407 and added fix for BUG-550710 */
						if( eventKeyCode==13 && target.id!="RLDel" && target.id!="RLAdd" && target.id!="pui_filter" &&
						    (target.tagName=="A" || target.tagName=="BUTTON" ||
						    target.tagName=="TEXTAREA"||(target.tagName ==="INPUT" && target.type ==="button")|| (pega.util.Event.isIE && target.tagName =="INPUT" && target.type =="text"))) {
              				pega.ui.statetracking.setDone();
							return;
						}
						/*TASK-186147 sorting and filtering fields/icons accessible for enter keypress*/
						if(this.filterOnProperEvent(container, e, target)) {
              				pega.ui.statetracking.setDone();
							return;
						}
						if(this.sortOnProperEvent(container, e, target)){
              				pega.ui.statetracking.setDone();
							return;
						}
						this.selectPage(e, container);
						if( this.repeatType == this.ROW_REPEAT && !this.bPageGroup &&
						    this.editConfig == this.EDIT_ROW ) {
							/* BUG-160200: Don't override enter keypress configured in Actions */
							if(this.gridDiv.getAttribute("data-keyup") && this.gridDiv.getAttribute("data-keyup").indexOf("enter") != -1) {
              					pega.ui.statetracking.setDone();
								return;
							} else {
								eventDetails.handler = this.submitAndAppendRow;
								eventDetails.args = container;
								this.pushToQueue(eventDetails);
							}
						}
						else if( !this.bPageGroup && this.repeatType == this.ROW_REPEAT &&
						         (!this.editConfig || this.editConfig == "")) {
								eventDetails.handler = this.appendToGrid;
								eventDetails.args = container;
								this.pushToQueue(eventDetails);
						}
					}
				}else if(eventType =="mouseup" || eventType =="touchstart"){
                    /* BUG-278141: Return if target is inside an RTE dialog */
                    if(jQuery(target) && jQuery(target).closest("div.cke_dialog_body").length > 0){
                      return;
                    }
					if(this.gridRowDDInst) {
						this.gridRowDDInst.DDM.handleMouseUp(e, this.gridRowDDInst);
						this.gridRowDDInst.unreg();
						this.gridRowDDInst = null;
					}
					if(this.activeResize && this.activeResize.isActive) {
						this.activeResize._handleMouseUp(e);
						this.activeResize = null;
            pega.ui.statetracking.setDone();
						return;
					}
					var bExpCollNode = false;
					if(this.editConfig != this.EDIT_ROW || !this.activeRow) {
            pega.ui.statetracking.setDone();
						return ;
                    }
					var row = this.rightBodyTbl.rows[this.activeRow];
					if(!Dom.hasClass(row ,"editMode")) {
            pega.ui.statetracking.setDone();
						return;
					}
					var cell = this.findCell(e, container);
					var sameRow = false;
					if(cell && (this.getRowIndex(cell) == this.getIndex(this.activeRow))) {
						sameRow = true;
					}
					if(this.bTreegrid && (Dom.hasClass(target, "expandNode") || Dom.hasClass(target, "collapseNode"))) {
						bExpCollNode = true;
						if(sameRow){
              pega.ui.statetracking.setDone();
							return;
						}
					}
					/*Don't submit row if  it is clicked on a button or anchor except for Append icon.*/
					if(target && target.tagName && ((target.tagName=="BUTTON" || target.tagName =="A")&& sameRow) && (target.id != "RLAdd" && !bExpCollNode)) {
            pega.ui.statetracking.setDone();
						return;
					}
					/*BUG-221509 */
					if(this.bInlineEditGridInModal){
            if(!this.modalDetailsDiv){ /* BUG-584039 : Sometimes modal-scroll-panel is not available on modal */
              this.modalDetailsDiv = pega.ctx.dom.getElementsByClassName("modal-scroll-panel")[0];
            }
                    	if(this.modalDetailsDiv && this.modalScrollLeft != this.modalDetailsDiv.scrollLeft){
                       		return;
                     	}
                    }

                  	if(this.gridcontDiv.getAttribute("haswidth") == "true" && this.editConfig == this.EDIT_ROW && this.gridScrollLeft != this.gridcontDiv.scrollLeft){
                      return;
                    }
					var eventDetails = {type:eventType,target:target,keyCode: eventKeyCode ,context:this};
					eventDetails.handler = this.submitRow;
					eventDetails.args = this;
					this.pushToQueue(eventDetails);
				} else if(eventType == "focusin" || eventType == "focus") {
					this.setIsLastEventFromRow(target);
					if(!this.activeRow || this.activeRow == -1) {
						this.selectPage(e, container);
					} else {
						/*  BUG-73985: Focusing on first row always without checking whether set focus is configured in grid actions or not.
						if(this.activeRow != 1 && this.getPageIndex(e, container) == 1) {
							if(this.editConfig == this.EDIT_ROW && this.activeRow) {
								if(this.activeRow && Dom.hasClass(this.rightBodyTbl.rows[this.getIndex(this.activeRow)], "editMode")) {
									var eventDetails = {type:eventType, target:target, keyCode:eventKeyCode ,context:this};
									eventDetails.handler = this.submitRow;
									eventDetails.args = this;
									this.pushToQueue(eventDetails);
									if(this.submitErrors) { //When there are errors while submission, prevent the default behavior tab out.
										Event.preventDefault(e);
									}
									if(!this.submitErrors) {
										Event.stopEvent(e);
										this.selectPage(e, null, 1);
									}
								} else {
									this.selectPage(e, null, 1);
								}
							} else {
								this.selectPage(e, null, 1);
						    }
						}
						*/
					}
				}else if(eventType == Grids.EVENT_RIGHT_CLICK) { /*for right click also, set the active row to avoid active row issues and backward compatibility.*/
					this.isLastEventFromRow = this.getIsLastEventFromRow(target);
					/*if(target.nodeName.toUpperCase() == "INPUT" || target.nodeName.toUpperCase() == "TEXTAREA") {
						Event.stopPropagation(e);
						return;
					}*/
					if(!this.submitErrors &&(container == this.leftBodyUL || container == this.rightBodyTbl)) {
						if(this.isTargetNoResultsMsg(Event.getTarget(e))) {
              pega.ui.statetracking.setDone();
							return;
						}
						this.selectPage(e,container);
					}
				}
						/* Check if the focus is coming from outside the grid. Submit the active row if it editable. */

				/*If the target is a delete or add icon, stop propagation*/
				if(target && target.id && (target.id=="RLAdd" || target.id=="RLDel")) {
					Event.stopPropagation(e);
				}
       	pega.ui.statetracking.setDone();
			},
          	/*BUG-221509 */
          	setModalScrollLeft : function(e,context){
              	this.modalScrollLeft= context.scrollLeft;
            },

          	setGridScrollLeft : function(e,context){
          		this.gridScrollLeft= context.scrollLeft;
        	},

			/* Returns true if the given element is a descendant of any row of this grid (replacement of pega.u.d.getRepeatRow) */
            getIsLastEventFromRow : function(element) {
                var parentElt = element;
                while (parentElt && (parentElt != this.gridDiv) && !parentElt.getElementById) {
                    if (parentElt.getAttribute && (parentElt.getAttribute("PL_PROP") != null || parentElt.getAttribute("PG_PROP") != null))
                        break;
                    if (parentElt.getAttribute && (parentElt.getAttribute("PL_INDEX") || parentElt.getAttribute("PG_SUBSCRIPT"))) {
                        return this.isRowFromThisGrid(parentElt);
                    }
                    parentElt = parentElt.parentNode;
                }
                return null;
            },
            isRowFromThisGrid : function(rowEl) {
                if (rowEl && rowEl.id) {
                    var reference = pega.ui.property.toReference(rowEl.id);
                    /*BUG-566747 : For nested Grid ,need to check for closest grid*/
                    var closestGridSkin = pega.ctx.dom.closest(rowEl, "div#PEGA_GRID_SKIN");
                    if(reference && closestGridSkin)
                      return  reference.indexOf(this.dataSourceRef) === 0 && closestGridSkin.parentElement === this.gridDiv;
                }
              return false;              
            },
            setIsLastEventFromRow : function(target) {
                this.isLastEventFromRow = this.getIsLastEventFromRow(target);
                // getIsLastEventFromRow returns null if target is not inside a grid row
                // hence setting it to true if target is from grid details div
                if (!this.isLastEventFromRow) {
                    this.isLastEventFromRow = this.isLastEventFromFlowAction(target);
                }
            },
            isLastEventFromFlowAction : function(target) {
                var parentElt = target;
                if (this.editConfig == this.EDIT_HARNESS) {
                    while (parentElt && !parentElt.getElementById) {
                        if (this.gridDetailsDiv == parentElt) {
                            return this.activeRow;
                        }
                        parentElt = parentElt.parentNode;
                    }
                } else if (this.editConfig == this.EDIT_EXPANDPANE) {
                    while (parentElt && !parentElt.getElementById) {
                        if (parentElt.getAttribute && parentElt.getAttribute("expanded") == "true") {
                            return this.activeRow;
                        }
                        parentElt = parentElt.parentNode;
                    }
                }
                return null;
            },
			onCellHover: function(row, bOnHover){
				if(this.disableRowHovering){
					return;
				}
				var func = null;
				if(bOnHover)
					func = Dom.addClass;
				else
					func = Dom.removeClass;
				var hasClassFunc  = pega.util.Dom.hasClass;
				if(!row) {
					return;
				}else{
					var rowid = row.id;
				}
				var cells = row.cells;
				if(!cells)
					return;
				var len = cells.length;
				var cellstart=0;
				if(this.bDragDrop ||this.bTreegrid ||this.bNumberedSkin) //in case of grid without drag drop there wont be drag handle li's
					cellstart=1;
				if(this.editConfig == this.EDIT_EXPANDPANE && !this.fixedCol && this.bShowExpandCollapseColumn) // in case of expand Pane conf, do not highlight the cell containing expandRow/collapseRow icon
					cellstart++;

				for(var j=cellstart;j<len;j++) {
					if(bOnHover){
						if(!hasClassFunc(cells[j],"cellHover")){
							func(cells[j],"cellHover");
						}
					}
					else{
						func(cells[j],"cellHover");
					}
				}
				/*Append cellHover class for UL, only for grid with freeze col or treegrid*/
				if(this.bTreegrid || this.fixedCol) {
                    row = pega.util.Dom.getElementsById(rowid, this.leftBodyUL, "LI");
					if(!row) return;
					row = row[0];
					var ul = row.getElementsByTagName("UL")[0];
					if(bOnHover){
						if(!hasClassFunc(cells[j],"cellHover")){
							func(ul,"cellHover");
						}
					}
					else{
						func(ul,"cellHover");
					}

					var cells = Dom.getChildren(ul);
					var len = cells.length;
					for(var j=cellstart;j<len;j++) {
						if(bOnHover){
							if(!hasClassFunc(cells[j],"cellHover")){
								func(cells[j],"cellHover");
							}
						}
						else{
							func(cells[j],"cellHover");
						}
					}
				}
				if(navigator.userAgent.indexOf("MSIE 8")!=-1){
					document.body.className=document.body.className;
					this.writeCases.push(Grids.SET_UL_HEIGHT);
				}
			},

			isElementFromSameGridContDiv : function(elem) {
				if(elem) {
					var node = "";
					node = elem;

					while(node.id !== "PEGA_GRID_CONTENT") {
						node = node.parentNode;
						if(!node) {
							break;
						}
					}

					if(node && node == this.gridcontDiv) {
						return true;
					}

				}
				return false;
			},

            isElementFromSameGridDiv : function(elem) {
                if (elem) {
					var node = elem;

					while (!(node.id.indexOf("PEGA_GRID") == 0 && node.getAttribute("bgrid") === "true")) {
						node = node.parentNode;
						if (!node) {
							break;
						}
					}

					if (node && node == this.gridDiv) {
						return true;
					}

				}
				return false;
			},

			/*triggers sort on the column if the event or action is appropriate to sort*/
			sortOnProperEvent : function(container, e, target) {
				if(this.bSortable) {
						if(container==this.gridDiv) {
							container=pega.ctx.dom.closest(target, "table");
						}


						// BUG-160253 first make sure we can get desktop window in case we are in a separate frame
					if(pega.desktop.support.getDesktopWindow()) {
						// BUG-155215 if UI Tree inspector is on and clicking suppressed do not sort on click event and return instead
						// BUG-174626 added additional check for pega.ui.inspector since this was throwing a null pointer in IE8
                      if (pega.ui && pega.ui.inspector && pega.ui.inspector.isClickingSuppressed)
						if(pega.desktop.support.getDesktopWindow().pega.ui && pega.desktop.support.getDesktopWindow().pega.ui.inspector && pega.desktop.support.getDesktopWindow().pega.ui.inspector.isClickingSuppressed()){return;}
					}
						var cell = this.findCell(e, container);
						if(cell && (cell.getAttribute("bSortable")=="true")) {
							// BUG 42037 : Incase of grid inside grid , sorting nested grid is propagating event to the parent grid, hence stopping event at child by calling isElementFromSameGridContDiv. ( Event.stopPropagation has some side effects. )
							if(this.isElementFromSameGridContDiv(cell)) {/* BUG-311591: Pass cell insteadof container to check for the right content div */
							var eventDetails = {type:"action",context:this };
							eventDetails.handler = this.sortGrid;
							eventDetails.args = [e,target, cell];
							this.pushToQueue(eventDetails);
							return true;
						}
					}
					}
			},

			/*opens or closes filter popover on the column if the event or action is appropriate to do so*/
			filterOnProperEvent : function(container, e, target) {
				if(this.bFilterable){
            /*BUG-537290 : Filter on the grid doesn't show value for a second click*/
            var gridRootInContext = pega.ctx.dom.closest(target, "div#PEGA_GRID_SKIN").parentElement;
            if (!gridRootInContext.contains(container)) {
              return;
            }
            /*BUG-537290*/
						if(container==this.gridDiv) {
							container=pega.ctx.dom.closest(target, "table");
						}
						var cell = this.findCell(e, container);
						if(target.id=="pui_filter") {

						// BUG-160253 first make sure we can get desktop window in case we are in a separate frame
						if(pega.desktop.support.getDesktopWindow()) {
							// BUG-155215 if UI Tree inspector is on and clicking suppressed do not sort on click event and return instead
							// BUG-174626 added additional check for pega.ui.inspector since this was throwing a null pointer in IE8
                          if (pega.ui && pega.ui.inspector && pega.ui.inspector.isClickingSuppressed)
                         	if(pega.desktop.support.getDesktopWindow().pega.ui && pega.desktop.support.getDesktopWindow().pega.ui.inspector && pega.desktop.support.getDesktopWindow().pega.ui.inspector.isClickingSuppressed()){return;}
						}
							var po = pega.u.d.getPopOver();
							var propName = cell.getAttribute("SortField");
							if(this.filteredColName && this.filteredColName == propName && po.isActive()) {
								this.dbp.po.close('cancel');
								return true;
							}
							var eventDetails = {type:"action",context:this };
							eventDetails.handler = this.openFilterGadget;
							eventDetails.args = [e,target, cell];
							this.pushToQueue(eventDetails);
							return true;
						}

					}
			},
/*Us-2333 Column Menus javascript - start*/
menusOnProperEvent: function(container, e, target) {
  var eventNode,targetNode;
  pega.ctx.Grid.isFilterMenuItemClicked = false;
  if (target && target.id == "pui_colmenu") {
    this.menuSortOnProperEvent(container, e, target);
    return true;
  }

  container = container || pega.ctx.dom.closest(e.target, "table");
  //BUG-313297 && BUG-315270
  var srcElement = e.srcElement;
  if(!srcElement && e.$ev){ //e.$ev is mouse click event directly on the target.
    srcElement = e.$ev.target;
  }
  var requiredTarget = jQuery(srcElement).closest('a');
  var dataclick = requiredTarget && requiredTarget.attr('data-click');
  if(!dataclick){
    return false;
  }
  if (dataclick.indexOf('pzGridMenuFilter') != -1) {
    eventNode = pega.ui.menubar.eventNode;
    eventNode.setAttribute("data-click", dataclick);
    targetNode = pega.util.Event.getTarget(e);
    targetNode && targetNode.appendChild(eventNode);
    target = eventNode;

    pega.ctx.Grid.isFilterMenuItemClicked = true;
    this.sortProperty = "";
    this.sortType = "";
    document.body.click();
    if (this.bFilterable) {
      target.id = "pui_filter";
      var filterType = document.createAttribute("filterType");
      var strFilterType = target.parentElement.parentElement.getAttribute("filterType");
      if(!strFilterType || strFilterType == "")strFilterType = "true";
      filterType.value = strFilterType;
      target.setAttributeNode(filterType);
      this.filterOnProperEvent(container, e, target);
      target.id = "";
    }
  }
  else {
    if(dataclick.indexOf('pzGridMenuSortAction') != -1){
      if (dataclick.indexOf('sortType=ASC') != -1) {
        this.sortType = 'ASC';
      }else if (dataclick.indexOf('sortType=DESC') != -1) {
        this.sortType = 'DESC';
      }
      return true;
    }
    else if (dataclick.indexOf('pzModalTemplateAppearance') != -1) {
      this.sortProperty = "";
      this.sortType = "";
      return true;
    }
  }
  return false;
},
menuSortOnProperEvent: function(container, e, target) {
        if (this.bSortable) {
            if (container == this.gridDiv) {
                container = pega.ctx.dom.closest(target, "table");
            }

            // BUG-160253 first make sure we can get desktop window in case we are in a separate frame
            if (pega.desktop.support.getDesktopWindow()) {
                // BUG-155215 if UI Tree inspector is on and clicking suppressed do not sort on click event and return instead
                // BUG-174626 added additional check for pega.ui.inspector since this was throwing a null pointer in IE8
              if (pega.ui && pega.ui.inspector && pega.ui.inspector.isClickingSuppressed)
				if (pega.desktop.support.getDesktopWindow().pega.ui && pega.desktop.support.getDesktopWindow().pega.ui.inspector && pega.desktop.support.getDesktopWindow().pega.ui.inspector.isClickingSuppressed()) {
                    return;
                }
            }

            var cell = this.findCell(e, container);
			gridSortFieldName = cell.getAttribute("sortfield");
            if (cell && (cell.getAttribute("bSortable") == "true")) {
                // BUG 42037 : Incase of grid inside grid , sorting nested grid is propagating event to the parent grid, hence stopping event at child by calling isElementFromSameGridContDiv. ( Event.stopPropagation has some side effects. )
                if (this.isElementFromSameGridContDiv(container)) {
                    var eventDetails = {
                        type: "action",
                        context: this
                    };
                    eventDetails.handler = this.menuSortGrid;
                    eventDetails.args = [e, target, cell];
                    this.pushToQueue(eventDetails);
                    return true;
                }
            }
        }
    },
    menuSortGrid: function(args) {
        /*Reset the call as it won't disturb other actions.*/
        this.resetInCall();
        if (this.submitErrors) {
            return;
        }
        var e = args[0];
        var target = args[1];
        var cell = args[2];
        /*On completion of resize it is firing click event. So, don't sort the column on end of resizing.*/
        if (e.type != "keypress" && target && target.tagName && (target.tagName === "TH" || target.tagName === "LI")) {
            return;
        }
        var baseRef = pega.u.d.getBaseRef(this.rightBodyTbl);
        var cellSortField = cell.getAttribute("sortField");
        /*If sorting is enabled on an empty column, don't send ajax request.*/
        if (cellSortField == "") {
            return;
        }
        var oldSortProperty = this.sortProperty;
        var oldSortType = this.sortType;
        var prevSortType = "";
        if (cellSortField == this.sortProperty) {
            prevSortType = this.sortType;
            this.sortType = (prevSortType == "DESC") ? "ASC" : "DESC";
        } else {
            this.sortType = "ASC";
            this.sortProperty = cellSortField;
        }


        var strActionSF = new SafeURL();
        strActionSF.put("gridAction", "SORT");

        if (this.gridPreActivity) {
            strActionSF.put("gridPreActivity", this.gridPreActivity);
        }
        if (this.gridPostActivity) {
            strActionSF.put("gridPostActivity", this.gridPostActivity);
        }
        var columnIndex = this.getFilteredColumnIndex(cell);
		if(columnIndex){
			strActionSF.put("columnIndex", columnIndex);
		}
        strActionSF.put("pyActivity", "pzGridHeaderMenuContext");
        if (this.pyPaginateActivity) {
            strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
            if (this.pySortHandled || this.pyFilterHandled) {
                if (this.pySortHandled) {
                    strActionSF.put("pySortHandled", this.pySortHandled);
                }
                if (this.pyFilterHandled) {
                    strActionSF.put("pyFilterHandled", this.pyFilterHandled);
                }
            } else {
                /*BUG-148787:  Check for NaN before putting in url.  Having NaN is throwing NumberFormatException on sort of the column.*/
                if (!isNaN(this.totalRecords)) {
                    strActionSF.put("totalRecords", this.totalRecords);
                }
            }
            /*BUG-97399 : Have to pass totalRecords when sortHandled is false*/
            if (!this.pySortHandled) {
                /*BUG-148787:  Check for NaN before putting in url.  Having NaN is throwing NumberFormatException on sort of the column.*/
                if (!isNaN(this.totalRecords)) {
                    strActionSF.put("totalRecords", this.totalRecords);
                }
            }
        }
		var pLPGProperty = this.getPLPGProperty()
		if(pLPGProperty){
			strActionSF.put("PageListProperty", pLPGProperty);
		}
		if(this.propertyClass)
        strActionSF.put("ClassName", this.propertyClass);

        if (this.bReportDefinition) {
            strActionSF.put("RDName", this.RDName);
            strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
            strActionSF.put("pgRepContPage", this.RDContPage);

			if(this.RDPageName){
				strActionSF.put("pyReportPageName", this.RDPageName);
			}

		    strActionSF.put("RDParamsList", this.RDParams);
            strActionSF.put("gridLayoutID", this.gridLayoutID);
			if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
			if(this.pageMode){
            strActionSF.put("pyPageMode", this.pageMode);
			}
            if (this.pageMode == "Progressive Load") {
                strActionSF.put("bCBOptimize", this.bCBOptimize);
            }
        }
        strActionSF.put("BaseReference", baseRef);
	if( this.sortProperty)
       		strActionSF.put("sortProperty", this.sortProperty);
	 if(this.sortType)
        	strActionSF.put("sortType", this.sortType);
        if (this.rangeSize) {
            strActionSF.put("pyPageSize", this.rangeSize); // to convey that paging is enabled in this grid
        }
        /*In case of filtered grid we should pass the grid's filtercriteria page in  the request */
        if (this.bFilteredGrid) {
            if (!this.bReportDefinition) {
                var gridIndex = pega.u.d.getLayoutIndex(this.gridDiv);
                var filterTrigger = "filterpopup" + this.getConfiguredPLPGProperty() + gridIndex;
				if(filterTrigger)
					strActionSF.put("sortPartialTrigger", filterTrigger);
                var secDiv = pega.u.d.getSectionDiv(this.gridDiv);
				var className = secDiv.getAttribute("pyclassname");
				var nodeName = secDiv.getAttribute("NODE_NAME");
				if(className){
					strActionSF.put("sectionClass", className);}
				if(nodeName){
					strActionSF.put("sectionName", nodeName);}

            }
            strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
        }
        if (this.editConfig == this.EDIT_EXPANDPANE) {
            strActionSF.put("showSaveDiscard", "true");
        }

        strActionSF.put("isReportDef", this.bReportDefinition);

		if(oldSortProperty)
			strActionSF.put("prevSortProperty", oldSortProperty);
		if(oldSortType)
			strActionSF.put("prevSortType", oldSortType);

        strActionSF.put("customSortActivity", "");

        if (this.categorizeBy) {
            strActionSF.put("categorizeBy", this.categorizeBy);
        }
	if(this.gridcontDiv.getAttribute("stableSort")){
            strActionSF.put("stableSort",this.gridcontDiv.getAttribute("stableSort"));
	}
		var request = pegaUD.asyncRequest('POST', strActionSF,null,"");
    },

/*US-2333 Column Menus javascript - end*/
			isCtxtMenuOpen : function() {
				for(var prop in this.contextMenuObjs) {
					var isContextMenuOpen = this.contextMenuObjs[prop].active;
					if(isContextMenuOpen === true) {
						return true
					}
				}
				return false;
			},

			resetInCall : function() {
				pega.u.d.inCall = false;
				pega.u.d.changeInEventsArray.fire();
			},
			/*
			@private - initializes the event handlers for grid
			@return $void$
			*/
			initEventHandlers : function() {
				Event.addListener(this.gridDiv,Grids.EVENT_CLICK,this.gridEventHandler,this.gridDiv,this);
				Event.addListener(this.gridDiv,"keypress",this.gridEventHandler,this.gridDiv,this);
				Event.addListener(this.gridDiv,"keyup",this.gridEventHandler,this.gridDiv,this);
                if (this.editConfig == this.EDIT_HARNESS && this.gridcontDiv.getAttribute("pyTargetSection")) {
                    Event.addListener(this.gridDetailsDiv,"keyup",function(e) {
                        /* Added to use this variable from pzpega_ui_events */
                        this.isLastEventFromRow = true;
                    },this.gridDetailsDiv,this);
                    Event.addListener(this.gridDetailsDiv,Grids.EVENT_CLICK,function(e) {
                        /* Added to use this variable from pzpega_ui_events */
                        this.isLastEventFromRow = false;
                    },this.gridDetailsDiv,this);
					Event.addListener(this.gridDetailsDiv,"focusin",function(e) {
                        /* Added to use this variable from pzpega_ui_events */
                        this.isLastEventFromRow = true;
                    },this.gridDetailsDiv,this);
                }
				if(this.bRowHovering){
					Event.addListener(this.gridDiv,"mouseover",this.gridEventHandler,this.gridDiv,this);
					Event.addListener(this.gridDiv,"mouseout",this.gridEventHandler,this.gridDiv,this);
				}
				if(this.pageMode=="Progressive Load") {
					Event.addListener(this.layoutWrapperDiv,"scroll",this.gridEventHandler,this.gridDiv,this);
				}

				var grid = this;
				/* BUG-128986 - attaching actual gridEventHandler(available on prototype) for document.body causes confusion while removing the listener when multiple grids are present. removeListener removes the first matched entry from its listeners array by comparing element and function. Hence creating anonymous function.*/
				grid.tempGridEventHandler = function(event){grid.gridEventHandler(event);};
				/*Attach event listeners on leftBodyUL only for Treegrid and grid with freeze column.*/
				if(pega.env.ua.ie) {
					if(this.bTreegrid || this.fixedCol) {
						Event.addListener(this.gridDiv,"focusin",this.gridEventHandler,this.leftBodyUL,this);
					} else {
						Event.addListener(this.gridDiv,"focusin",this.gridEventHandler,this,true);
					}
					if(this.editConfig==this.EDIT_HARNESS && this.threadProcessing){
						Event.addListener(this.gridDetailsDiv,"focusin",this.setExecutionThread,this,true);
						Event.addListener(this.gridDetailsDiv,"focusout",this.resetExecutionThread,this,true);
						Event.addListener(this.gridDetailsDiv,"mouseover",this.setExecutionThread,this,true);
						Event.addListener(this.gridDetailsDiv,"mouseout",this.resetExecutionThread,this,true);
					}
					if((this.editConfig==this.EDIT_HARNESS ||this.editConfig==this.EDIT_EXPANDPANE) && this.threadProcessing){
						Event.addListener(document.body, Grids.EVENT_CLICK, this.resetExecutionThread,this,true);
					}
				} else {
					grid.focusEventHandler=function(event){grid.gridEventHandler(event);};
					grid.tempSetExecutionThread=function(event) { grid.setExecutionThread(event); };
					grid.tempResetExecutionThread=function(event) { grid.resetExecutionThread(event); };

					this.gridDiv.addEventListener("focus", grid.focusEventHandler, true);
					if(this.editConfig==this.EDIT_HARNESS && this.threadProcessing){
						this.gridDetailsDiv.addEventListener("focus",grid.tempSetExecutionThread,true);
						this.gridDetailsDiv.addEventListener(Grids.EVENT_CLICK,grid.tempSetExecutionThread,true);
						document.body.addEventListener("blur",grid.tempResetExecutionThread,true);
						document.body.addEventListener(Grids.EVENT_CLICK,grid.tempResetExecutionThread,true);
						this.gridDetailsDiv.addEventListener("mouseover",grid.tempSetExecutionThread,true);
						this.gridDetailsDiv.addEventListener("mouseout",grid.tempResetExecutionThread,true);
					}
					if(this.editConfig==this.EDIT_EXPANDPANE && this.threadProcessing){
						document.body.addEventListener(Grids.EVENT_CLICK,grid.tempResetExecutionThread,true);
					}
				}

				if(this.bTreegrid || this.fixedCol) {
				Event.addListener(this.leftBodyUL,Grids.EVENT_DOUBLE_CLICK,this.gridEventHandler,this.leftBodyUL,this);
				Event.addListener(this.leftBodyUL,"keydown",this.gridEventHandler,this.leftBodyUL,this);
				}

				Event.addListener(this.rightBodyTbl,Grids.EVENT_DOUBLE_CLICK,this.gridEventHandler,this.rightBodyTbl,this);
				Event.addListener(this.rightBodyTbl,"keydown",this.gridEventHandler,this.rightBodyTbl,this);
				if((this.gridRowDDInst || this.activeResize || this.editConfig == this.EDIT_ROW || this.activeRow)) {
					/* BUG-125493 - MLBUGS-DTSprint1 - singp1 Start*/
					if(pega && pega.capabilityList && pega.capabilityList.isTouchAble()){
						Event.addListener(document.body,"touchstart",grid.tempGridEventHandler,document.body,this);
					}
					/* BUG-125493 - MLBUGS-DTSprint1 - singp1 End*/
					Event.addListener(document.body,"mouseup",grid.tempGridEventHandler,document.body,this);
                    /*BUG-221509 */
                  	if(this.bInlineEditGridInModal && this.modalDetailsDiv){ /* BUG-301271: modalDetailsDiv is undefined sometimes */
                   	  Event.addListener(document.body,"mousedown",this.setModalScrollLeft,this.modalDetailsDiv,this);
                	}
                  	if(this.gridcontDiv.getAttribute("haswidth") == "true" && this.editConfig == this.EDIT_ROW){
                      Event.addListener(document.body,"mousedown",this.setGridScrollLeft,this.gridcontDiv,this);
                    }
				}

				this.createResizables();
				if(this.bNumberedSkin){
					this.createFrame();
				}
				if(!this.bPageGroup && this.bDragDrop) {
					if(this.repeatType == this.ROW_REPEAT) {
						this.createFrame();
						pegaUD.harness_execute(function(){grid.unregRelatedDDTargets();},true);
						if(this.bTreegrid || this.fixedCol) {
							Event.addListener(this.leftBodyUL, "mouseover", this.initDDTarget, this, true);
							Event.addListener(this.leftBodyUL, "mousedown", this.attachDrag, this, true);
						} else {
							Event.addListener(this.rightBodyTbl, "mouseover", this.initDDTarget, this, true);
							Event.addListener(this.rightBodyTbl, "mousedown", this.attachDrag, this, true);
						}
					} else if(this.rightHeaderTbl){
						new pega.ui.gridColDD(this.rightHeaderTbl, this.rightBodyTbl,this.gridDiv,this);
					}
				}
				/*As right click event has been moved to EIS, attach listener on grid to set the active row.*/
				Event.addListener(this.gridDiv,Grids.EVENT_RIGHT_CLICK,this.gridEventHandler,this.gridDiv,this);

			},
			/*To provide proper space when expand collapse icon and tree folder icons are not there */
			arrangeIcons : function(topLINode){
				var ULNode = Dom.getChildren(topLINode);
				for(var j = 0; j < ULNode.length; j++) {
					var LINode = Dom.getChildren(ULNode[j]);
					if(LINode && LINode.length>0) {
						for(var k = 0; k < LINode.length; k++) {
							if(LINode[k].getAttribute("PL_INDEX")){
								this.arrangeIcons(LINode[k]);
								continue;
							}
							/* BUG-108209: added if k==0 condition to avoid unnecessary iterations. */
							if(k==0){
								var dragDiv = pega.util.Dom.getElementsById("dragHandle",LINode[0],"DIV");
								/*TASK-162265:Added second condition for avoiding width set for top-level LIs and also AlwaysExpandRoot is enabled , as it is taken care in the generation itself.*/
								if(dragDiv && dragDiv[0].style.display == "none" && (!this.bAlwaysExpandRoot || (this.bAlwaysExpandRoot && topLINode.parentNode != this.leftBodyUL))){
									LINode[0].style.width = "16px";
								}
							}
						}
					}
				}
			},
			getRowIndexFromPosition: function(scrollTopValue) {
				this.rowHeight = this.getAvgRowHeight();
				var scrollTopOrBottom = 0;
				if (!scrollTopValue) {
					scrollTopValue = this.layoutWrapperDiv.scrollTop;
				}
				if (this.bDiscardInvisibleRows && this.scrollDirection < 0) {
					scrollTopOrBottom = this.layoutWrapperDiv.scrollHeight - (scrollTopValue + this.layoutWrapperDiv.offsetHeight);
				} else {
					scrollTopOrBottom = scrollTopValue;
				}
				if (this.layoutWrapperDiv.offsetHeight > this.rowHeight * this.rangeSize) {
					scrollTopOrBottom = scrollTopOrBottom + (this.layoutWrapperDiv.offsetHeight - this.rowHeight * this.rangeSize);
				}
				if (!this.rowHeight) {
					this.rowHeight = this.getLeftRow(1).offsetHeight;
				}
				if (this.editConfig == this.EDIT_EXPANDPANE) {
					scrollTopOrBottom = scrollTopOrBottom - this.expDetailsHeight;
					scrollTopOrBottom = scrollTopOrBottom < 0 ? 0 : scrollTopOrBottom;
				}
				if(this.bCategorizedGrid){
					scrollTopOrBottom = scrollTopOrBottom - this.categorizedHeadersHeight;
				}
				var rowIndex = Math.round(scrollTopOrBottom/this.rowHeight);
				if (this.bDiscardInvisibleRows && this.scrollDirection < 0) {
					rowIndex = this.totalRecords - rowIndex;
				}
				/* BUG-163561: 0 is not a valid row number */
				return rowIndex == 0 ? 1 : rowIndex;
			},

			getTopLevelLeftRow: function(index) {
				var leftRow= null;
				var totalTopLevelRows= this.getTopLevelNodesLength();
				if(index< totalTopLevelRows) {
					var dataSrc= this.iKey;
					dataSrc= dataSrc.substring(0, dataSrc.indexOf("_"));
					var leftRowIndex= pega.ui.property.toHandle(dataSrc);
					leftRowIndex+= "$l" + index;
					if(leftRowIndex) {
                        leftRow = pega.util.Dom.getElementsById(leftRowIndex, this.leftBodyUL, "LI")[0];
					}
				}
				return leftRow;
			},

			/*API to know whether a row is dummy or not. Used in Progressive Load*/
			isDummyRow: function(rowIndex){
				var rowObj = this.getLeftRow(rowIndex);
				if(this.bTreegrid) {
					if(rowObj.parentNode.style.display == "none") {
					rowObj = this.getTopLevelLeftRow(rowIndex);
					}
				}
				/*As OAArgs Attribute is available on rowContent UL for tree and tree grid, update startRow and endRow to rowCont UL*/
				if(rowObj && this.bTreegrid) {
					rowObj = Dom.getFirstChild(rowObj);
				}
				if(rowObj && rowObj.getAttribute("OAArgs")!=null) {
					return false;
				}
				return true;
			},
			progressiveLoadGrid: function(pageIndex){
				if (this.bDiscardInvisibleRows) {
					this.setScrollDirection(this.layoutWrapperDiv);
				}
				if(!this.bProgressiveLoading) {
					/*Execute before ProgressiveLoad function. Before doing anything else. If it returns false, return from the function*/
					if(this.beforeProgressiveLoadFn && this.beforeProgressiveLoadFn!="") {
						var flag = this.beforeProgressiveLoadFn.call(this);
						if(!flag) {
							return;
						}
					}
					var baseRef = pega.u.d.getBaseRef(this.rightBodyTbl);
					var strActionSF = new SafeURL();
					strActionSF.put("gridAction","PAGINATE");

					/* BUG-240019 - Readonly the grid when the grid is non editable*/
					if(!this.bEditable){
						strActionSF.put("ReadOnly", "true");
					}
					if(this.gridPreActivity) {
						strActionSF.put("gridPreActivity", this.gridPreActivity);
					}
					if(this.gridPostActivity) {
						strActionSF.put("gridPostActivity", this.gridPostActivity);
					}

					strActionSF.put("gridActivity", "");
					strActionSF.put("PageListProperty",this.getPLPGProperty());
					strActionSF.put("ClassName", this.propertyClass);
					if(this.bReportDefinition) {
						strActionSF.put("isReportDef", "true");
						strActionSF.put("RDName",this.RDName);
						strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
						strActionSF.put("pgRepContPage", this.RDContPage);
						if(this.RDPageName){
					       strActionSF.put("pyReportPageName", this.RDPageName);
					    }
						strActionSF.put("RDParamsList", this.RDParams);/*TASK-133036: Pass RD params in case of progressive load*/
						strActionSF.put("gridLayoutID", this.gridLayoutID);/*Pass gridLayoutID to compute the RD param persisting fields properly*/
						strActionSF.put("bCBOptimize", this.bCBOptimize);
					}
					strActionSF.put("BaseReference", baseRef);
                    var endIndex, startIndex, pageNo;
					if(this.bCustomLoad) {
						/*This is invoked after actions like delete and drag drop. So, here get the current page records from server to fill the empty space after deletion*/
						/*If pageIndex is setn, then don't calculate it again.*/
						if(pageIndex) {
							pageNo = pageIndex;
						}else if (!this.bDiscardInvisibleRows){
							var activeRowIndex=this.getActiveRowIndex();
							startIndex = activeRowIndex;
							pageNo = Math.ceil(startIndex/this.rangeSize);
							startIndex = ((pageNo-1)*this.rangeSize)+1;
							/*if it's custom load check if the last row in the page is existing. If true, don't perform progressive Load*/
							/*current page's last row is there, but the view port may be empty if it's scrolled.*/
							var currPgLastIndex = startIndex+parseInt(this.rangeSize)-1;
							if(!this.isDummyRow(currPgLastIndex)) {
								endIndex = parseInt(activeRowIndex,10) + parseInt(this.rangeSize,10);
								var endRow = this.getLeftRow(endIndex);
								/*if the last row is also not a dummy row, return*/
								if(!endRow || !this.isDummyRow(endIndex)) {
									this.bCustomLoad = false;
									if (this.isDummyRow((this.noOfPagesLoaded)*this.rangeSize))	this.noOfPagesLoaded--;
									return;
								}
								pageNo = pageNo+1;
							}
						} else if (this.bDiscardInvisibleRows) {
							var heightUptoViewport = this.layoutWrapperDiv.scrollTop + this.layoutWrapperDiv.offsetHeight;
							var heightUptoLoadedRows;
							if(this.topBuffer.style.height=="auto"){
								heightUptoLoadedRows = this.rightBodyTbl.offsetHeight;
							}else{
								heightUptoLoadedRows = this.topBuffer.offsetHeight + this.rightBodyTbl.offsetHeight;
							}
							if (heightUptoLoadedRows > heightUptoViewport) {
								return;
							}
							if (this.activeRow)
								this.prevActivePLIndex = this.activeRow + (this.getFirstLoadedRowIndex() - 1);
							startIndex = this.getRowIndexFromPosition();
							endIndex = startIndex + parseInt(this.rangeSize,10);
							var firstLoadedRowIndex = this.getFirstLoadedRowIndex();
							var lastLoadedRowIndex = firstLoadedRowIndex + this.getNoOfRowsLoaded() - 1;
							if (endIndex <= lastLoadedRowIndex) {
								return;
							}
							this.prevVisibleStartIndex = startIndex;
							pageNo = Math.ceil(startIndex/this.rangeSize);
							this.currentPageIndex = pageNo;
							startIndex = this.getFirstLoadedRowIndex();
						}
					}else if(this.customLoadStartIndex && this.customLoadStartIndex!="") {
						pageNo = Math.ceil(this.customLoadStartIndex/this.rangeSize);
						this.currentPageIndex = pageNo;
						var startIndex = this.getRowIndexFromPosition();
						if(!this.isDummyRow(startIndex)) {
							startIndex = startIndex+parseInt(this.rangeSize,10);
						}
						endIndex = startIndex+parseInt(this.rangeSize,10);
						endIndex = Math.ceil(endIndex/this.rangeSize)*this.rangeSize;
						if(endIndex<(this.noOfPagesLoaded*this.rangeSize)) {
							endIndex = this.noOfPagesLoaded*this.rangeSize;
						}
					}else{
						if (this.bDiscardInvisibleRows) {
							var oldScrollTop = this.layoutWrapperDiv.scrollTop;
							var oldScrollHeight = this.layoutWrapperDiv.scrollHeight;
							this.updateTopBottomBufferHeights();
							var newScrollHeight = this.layoutWrapperDiv.scrollHeight;
							var scrollTopValue = parseInt((newScrollHeight / oldScrollHeight) * oldScrollTop);
						}
						startIndex = this.getRowIndexFromPosition(scrollTopValue);
						var totalRows = 0;
						if(this.bTreegrid) {
							totalRows = this.getTopLevelNodesLength();
						} else if(!this.bDiscardInvisibleRows){
							totalRows = this.getTableLength(this.rightBodyTbl);
						}else{
							totalRows = this.totalRecords;
						}

						if(startIndex > totalRows) {
							/* the rows have occupied more space than expected */
							return;
						}
						var totalPages = Math.ceil(this.totalRecords/this.rangeSize);
						var firstLoadedRowIndex;
						var lastLoadedRowIndex
						if (this.bDiscardInvisibleRows) {
							endIndex = startIndex + (this.scrollDirection) * parseInt(this.rangeSize,10);
							endIndex = endIndex < 1 ? 1 : endIndex;
							if(this.scrollDirection > 0){
								this.prevVisibleStartIndex = startIndex;
							}else{
								this.prevVisibleStartIndex = endIndex;
							}
							firstLoadedRowIndex = this.getFirstLoadedRowIndex();
							lastLoadedRowIndex = firstLoadedRowIndex + this.getNoOfRowsLoaded() - 1;
							if (this.scrollDirection > 0) {
								if (this.currentPageIndex == totalPages || this.currentPageIndex + 1 == totalPages) {
									return;
								}
								if (endIndex <= lastLoadedRowIndex) {
									return;
								}
							} else {
								if (this.currentPageIndex == 1 || this.currentPageIndex == 2) {
									return;
								}
								if (endIndex >= firstLoadedRowIndex) {
									return;
								}
							}
						} else {
							var startRow = this.getRightRow(startIndex);
							endIndex = startIndex + parseInt(this.rangeSize,10);
						}

						if(endIndex > totalRows) {
							endIndex = totalRows;
						}
						if (this.activeRow)
							this.prevActivePLIndex = this.activeRow + (this.getFirstLoadedRowIndex() - 1);
						pageNo = Math.ceil(startIndex/this.rangeSize);
						this.currentPageIndex = pageNo;
						if (!this.bDiscardInvisibleRows) {
							/*Don't allow progressive loading if a row is added and not yet submitted in Embedded and Expand pane(WO) Grids.*/
							if((this.editConfig==this.EDIT_HARNESS || (this.editConfig==this.EDIT_EXPAND_PANE && this.threadProcessing)) && this.comingFromAdd=="true" && this.gridPrevScrollTop < this.layoutWrapperDiv.scrollTop && this.currentPageIndex>=this.noOfPagesLoaded) {
								alert("Please submit/discard the new row details before loading more items");
								return;
							}
							/*row is already loaded if PL_INDEX is there for the row*/
							if((startIndex==0 && !this.isDummyRow(endIndex)) || (!this.isDummyRow(startIndex) && !this.isDummyRow(endIndex))){
								if(endIndex == totalRows) {
									this.currentPageIndex = Math.ceil(totalRows/this.rangeSize);
								}
								return;
							}

							/*Case: there are some visible rows and below that empty rows are there. so, update the start index to end index.*/
							if(startRow && !this.isDummyRow(startIndex)) {
								startIndex = endIndex;
							}
							/*if start index goes beyond the no.of rows in the table, then just return for expand pane*/
							if(this.editConfig==this.EDIT_EXPANDPANE && startIndex>this.totalRecords && startIndex>this.getExpandPaneTableLength()) {
								return;
							}
							pageNo = Math.ceil(startIndex/this.rangeSize);
							this.currentPageIndex = pageNo;
						}else{
							startIndex = this.getFirstLoadedRowIndex();
						}
					}
					if (!this.bDiscardInvisibleRows) {
						startIndex = ((this.bCustomLoad ? pageNo-1 : this.noOfPagesLoaded)*this.rangeSize)+1;
					}
					this.bProgressiveLoading = true;
                  	/*BUG-210656: In Progressive Loaded Grid with optimized clipboard,closing modal dialog when pagination happens while clicking prev/next*/
					/*if(pega.u.d.isModalLoaded() && this.bCBOptimize ){
                      var closeButton=document.getElementById("container_close");
                      if(closeButton) closeButton.click();
                    }*/
					this.currentPageIndex = pageNo;
					strActionSF.put("startIndex", startIndex);
					strActionSF.put("currentPageIndex",pageNo);
					strActionSF.put("pyPageSize",this.rangeSize);
					if (this.bDiscardInvisibleRows) {
						var recordsInCurrentPage =  this.rangeSize * 3;
						if (totalPages == this.currentPageIndex) {
							var noOfRecordsInLastPage = this.totalRecords - (totalPages - 1) * this.rangeSize;
							recordsInCurrentPage = noOfRecordsInLastPage + this.rangeSize;
						}
						if (1 == this.currentPageIndex) {
							recordsInCurrentPage = 2 * this.rangeSize;
						}
						var lastIndex = startIndex + recordsInCurrentPage - 1;
						strActionSF.put("recordsInCurrentPage", recordsInCurrentPage);
						/* fetch only records needed, don't re-fetch already loaded records */
						/* TASK-132474: Added condition !(this.bCBOptimize && this.bReportDefinition). In this case do a full refresh. */
						if(!this.pyPaginateActivity && !(this.bCBOptimize && this.bReportDefinition)){
							if( startIndex >= firstLoadedRowIndex && startIndex <= lastLoadedRowIndex ){
								var newStartIndex = lastLoadedRowIndex + 1;
								var newRecordsInCurrentPage = recordsInCurrentPage - ( newStartIndex - startIndex );
								strActionSF.put("startIndex", newStartIndex);
								strActionSF.put("recordsInCurrentPage", newRecordsInCurrentPage);
								this.insertPosition = "down";
								this.deleteRowsBeforeID = this.getRightRow(startIndex - firstLoadedRowIndex+1).id;
							}else if( lastIndex >= firstLoadedRowIndex && lastIndex <= lastLoadedRowIndex ){
								var newLastIndex = firstLoadedRowIndex - 1;
								var newRecordsInCurrentPage = recordsInCurrentPage - ( lastIndex - newLastIndex);
								strActionSF.put("recordsInCurrentPage", newRecordsInCurrentPage);
								this.insertPosition = "up";
								this.deleteRowsAfterID = this.getRightRow(lastIndex - firstLoadedRowIndex+1).id;
							}
						}
					} else {
						strActionSF.put("recordsInCurrentPage",(this.currentPageIndex-this.noOfPagesLoaded+1)*this.rangeSize);
					}
					if(this.customLoadStartIndex && this.customLoadStartIndex!="") {
						startIndex = ((pageNo-1)*this.rangeSize)+1;
						if(!this.bDiscardInvisibleRows && this.bFilteredGrid && startIndex > ((this.noOfPagesLoaded*this.rangeSize)+1)){
							this.customLoadStartIndex = "";
						}else{
							strActionSF.put("startIndex", startIndex);
							strActionSF.put("recordsInCurrentPage",(endIndex-startIndex)+1);
						}
					}
					/*In case of filtered grid we should pass the grid's filtercriteria page in  the request */
					/*BUG-158449: Send filterCriteria parameter when filter pop over is open */
					if(this.bFilteredGrid || this.isFilterPOOpen) {
						strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
					}
					if(this.bDiscardInvisibleRows) {
						if(this.pyPaginateActivity) {
							strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
						}
            //BUG-638732 on Reload per interaction configuration send the gridActivity, sort ActivityParams when
            //dataSource is DataPage
						if(this.pyPaginateActivity || (this.bCBOptimize && this.bReportDefinition) || this.bDataObject) {
							strActionSF.put("gridActivity", "pzGridSortPaginate");
							strActionSF.put("pyPageMode", "Progressive Load");
							strActionSF.put("sortProperty", this.sortProperty);
							strActionSF.put("sortType", this.sortType);
						}
					}
					var sendSectionData = (this.bReportDefinition || this.bDataObject || (this.customLoadStartIndex && this.customLoadStartIndex!=""))?"true":"false";
					var partialParams = {
								partialTrigger : "progressiveLoad",
								domAction : "replace",
								beforeDomAction :this.loadProgressiveRows ,
								beforeDomActionContext:this,
								beforeParams : null,
								bTreegrid : this.bTreeGrid,
								sendSectionData: sendSectionData
							};
					var postData = new SafeURL();
					if(this.categorizeBy) {
						postData.put("categorizeBy",this.categorizeBy);
					}
					this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(),null,null,this.gridDiv,partialParams,true,postData);
				}
			},

			setScrollDirection: function(ele) {
				if (typeof this.currentScrollTop == 'undefined') {
					// this.x=ele.scrollLeft;
					this.currentScrollTop = ele.scrollTop;
				}
				// var diffX=this.x-ele.scrollLeft;
				var diffY = this.currentScrollTop - ele.scrollTop;
				var t = 0;

				// if( diffX<0 ) {
				// t = 1;// Scroll right
				// } else if( diffX>0 ) {
				// t = -1;// Scroll left
				// } else
				if (diffY < 0) {
					t = 1;// Scroll down
				} else if (diffY > 0) {
					t = -1;// Scroll up
				} else {
				// First scroll event
				}
				// this.x=ele.scrollLeft;
				this.currentScrollTop = ele.scrollTop;
				this.scrollDirection = t;
			},

			sortGrid : function(args) {
				/*Reset the call as it won't disturb other actions.*/
				this.resetInCall();
				if(this.submitErrors) {
					return;
				}
				var e = args[0];
				var target = args[1];
				var cell = args[2];
				/*On completion of resize it is firing click event. So, don't sort the column on end of resizing.*/
				if(e.type != "keypress" && target && target.tagName && ( target.tagName === "TH" || target.tagName === "LI")){
					return;
				}
				var baseRef = pega.u.d.getBaseRef(this.rightBodyTbl);
				var cellSortField = cell.getAttribute("sortField");
				/*If sorting is enabled on an empty column, don't send ajax request.*/
				if(cellSortField=="" ) {
					return;
				}
				var oldSortProperty = this.sortProperty;
				var oldSortType = this.sortType;
				var prevSortType = "";
				if(cellSortField == this.sortProperty) {
					prevSortType = this.sortType;
					this.sortType = (prevSortType=="DESC")?"ASC":"DESC";
				}else {
					this.sortType = "ASC";
					this.sortProperty = cellSortField;
				}

				var strActionSF = new SafeURL();
				strActionSF.put("gridAction","SORT");

				if(this.gridPreActivity) {
					strActionSF.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					strActionSF.put("gridPostActivity", this.gridPostActivity);
				}

				//strActionSF.put("categorizeBy",this.categorizeBy);
				strActionSF.put("gridActivity", "pzGridSortPaginate");
				if(this.pyPaginateActivity){
					strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
					if(this.pySortHandled || this.pyFilterHandled){
						if(this.pySortHandled) {
							strActionSF.put("pySortHandled",this.pySortHandled);
						}
						if(this.pyFilterHandled) {
							strActionSF.put("pyFilterHandled",this.pyFilterHandled);
						}
					}else {
						/*BUG-148787:  Check for NaN before putting in url.  Having NaN is throwing NumberFormatException on sort of the column.*/
						if(!isNaN(this.totalRecords)){
						strActionSF.put("totalRecords",this.totalRecords);
					}
					}
					/*BUG-97399 : Have to pass totalRecords when sortHandled is false*/
					if(!this.pySortHandled) {
						/*BUG-148787:  Check for NaN before putting in url.  Having NaN is throwing NumberFormatException on sort of the column.*/
						if(!isNaN(this.totalRecords)){
						strActionSF.put("totalRecords",this.totalRecords);
					}
				}
				}

				strActionSF.put("PageListProperty",this.getPLPGProperty());
				strActionSF.put("ClassName", this.propertyClass);
				if(this.bReportDefinition) {
					strActionSF.put("RDName",this.RDName);
					strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
					strActionSF.put("pgRepContPage", this.RDContPage);
                  if(this.bLoadActivity)
                 	strActionSF.put("bLoadActivity", this.bLoadActivity);
				if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
          if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
                  if(this.pageMode){
					strActionSF.put("pyPageMode", this.pageMode);
                  }
                    if(this.RDPageName){
					strActionSF.put("pyReportPageName", this.RDPageName);
					}
					strActionSF.put("RDParamsList", this.RDParams);
					strActionSF.put("gridLayoutID", this.gridLayoutID);
					if(this.pageMode=="Progressive Load") {
						strActionSF.put("bCBOptimize", this.bCBOptimize);
						//strActionSF.put("pyPageMode", this.pageMode);
					}
				}
				strActionSF.put("BaseReference", baseRef);
                if(!this.bEditable){
                	strActionSF.put("ReadOnly", "true");
                }
				strActionSF.put("sortProperty", this.sortProperty);
				strActionSF.put("sortType", this.sortType);
				if(this.rangeSize){
					strActionSF.put("pyPageSize", this.rangeSize); // to convey that paging is enabled in this grid
				}
				/*In case of filtered grid we should pass the grid's filtercriteria page in  the request */
				if(this.bFilteredGrid) {
					if(!this.bReportDefinition){
						var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
						var filterTrigger = "filterpopup"+this.getConfiguredPLPGProperty()+ gridIndex;
						strActionSF.put("sortPartialTrigger", filterTrigger);
						var secDiv = pega.u.d.getSectionDiv(this.gridDiv);
						strActionSF.put("sectionClass", secDiv.getAttribute("pyclassname"));
						strActionSF.put("sectionName", secDiv.getAttribute("NODE_NAME"));
					}
					strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				}
				if(this.editConfig==this.EDIT_EXPANDPANE) {
					strActionSF.put("showSaveDiscard", "true");
				}
				strActionSF.put("isReportDef", this.bReportDefinition);
				strActionSF.put("prevSortProperty", oldSortProperty);
				strActionSF.put("prevSortType", oldSortType);
				strActionSF.put("customSortActivity", "");
        /* BUG-521635: A flag to control message clearing from primary page */
        strActionSF.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');

				var postData = new SafeURL();
				if(this.categorizeBy) {
					postData.put("categorizeBy",this.categorizeBy);
				}
				if(this.gridcontDiv.getAttribute("stableSort")){
                                    postData.put("stableSort",this.gridcontDiv.getAttribute("stableSort"));
	                         }
				/* BUG-284340: Make use of toUnencodedQueryString instead of toQueryString when passing preActivityParams to reloadGridLayout */
				this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(),e,null,this.gridDiv,null,true, postData);
			},
			reloadGridLayout : function(preActivity, preActivityParams, event, focusParams, reloadEle, partialParams, showOnlyMask, appendExtraQS) {
				if(reloadEle){
					var reloadElement = reloadEle;
				}else {
					var reloadElement = pega.util.Event.getTarget(event);
				}
				// BUG-69316: performing client validation while reloading the grid. Avoiding client validation when loading grid progressively.
				if (!this.bProgressiveLoading && !pegaUD.shouldSubmitProceed(event, this.gridDiv)) {
					return;
				}
				var oArgs = {
						reloadElement:reloadElement,
						preActivity:preActivity,
						preActivityParams:preActivityParams,
						event:event,
						focusParams:focusParams,
						strReloadType:'RepeatLayout',
						isResponseRO:'0',	/* Append/Delete not possible in a RO mode; thus response is expected to be editable always */
						showOnlyMask:showOnlyMask,
						partialParams:partialParams,
						oldGridObj:this
				};
				if(appendExtraQS) {
					oArgs.appendExtraQueryString = appendExtraQS;
				}
				if(partialParams) {
					if(partialParams.partialTrigger && partialParams.partialTrigger=="progressiveLoad") {
						oArgs.gridAction="progressiveLoad";
					}
					if(partialParams.sendSectionData) {
						oArgs.sendSectionData = partialParams.sendSectionData;
					}
				}
				var expandElement = oArgs.reloadElement;
				var expandElementFound = true;
				var sectionDiv = pega.u.d.getSectionDiv(this.gridDiv);
				/* In tabbed and accordion cases, the 'EXPAND-OUTERFRAME' table is never generated
				 hence fallback to the complete reload in these cases. BUG-66993 To stop climbing up until body, limit it to the sectionDiv*/
				while (expandElement.id != "EXPAND-OUTERFRAME") {
					expandElement = expandElement.parentNode;
					if (expandElement == null || expandElement==sectionDiv) {
						expandElementFound = false;
						break;
					}
				}

				if (expandElementFound == true) {
					var paramName = expandElement.getAttribute("PARAM_NAME");
					if(paramName)
						pega.u.d.refreshRepeatLayout(oArgs);
					else
						pega.u.d.reload(oArgs);
				}
				else {
					pega.u.d.reload(oArgs);
				}
			},
			paginateGrid : function(e,params){
				var whichPage = params;
				var totalPages = (this.totalRecords%this.rangeSize==0)?Math.floor(this.totalRecords/this.rangeSize):Math.ceil(this.totalRecords/this.rangeSize);
				/*If user clicks on first or previous page when the current Page is 1, then don't do anything*/
				if(this.currentPageIndex==1 &&(whichPage == "previous" || whichPage=="first")) {
					return;
				}
				/*If user clicks on next or last page link when the current Page itself is last page, then don't do anything*/
				if(this.currentPageIndex==totalPages && (whichPage == "next" || whichPage=="last")) {
					return;
				}
				var pageNo;
				switch(whichPage) {
					case "next":
						pageNo = this.currentPageIndex+1;
						break;
					case "previous":
						pageNo = this.currentPageIndex-1;
						break;
					case "first":
						pageNo = 1;
						break;
					case "last":
						pageNo = totalPages;
						break;
					case "nextbunch":
						pageNo = (this.currentPageIndex%10==0)?(this.currentPageIndex+1):((Math.ceil(this.currentPageIndex/10)*10)+1);
						break;
					case "previousbunch":
						pageNo = (this.currentPageIndex%10==0)?(this.currentPageIndex-10):Math.floor(this.currentPageIndex/10)*10;
						break;
					default:
						pageNo = this.currentPageIndex;
						break;
				}
				this.gridPaginator(e,pageNo);
			},

			handleEditItem: function(e,container,index) {
				var _thisvar=this;
				if(document.compatMode!=="CSS1Compat" && navigator.userAgent.indexOf("MSIE 8")!=-1 && this.editConfig=="row"){
					setTimeout(function(){
						var selElems=_thisvar.gridcontDiv.getElementsByTagName("select");
						if(selElems && selElems.length>0){
							_thisvar.disableRowHovering=true;
						}
					},100);
				}

				var cell = this.findCell(e, container);
				if(cell){
					var rowIndex = this.getRowIndex(cell);
				}else {
					var rowIndex = index;
				}
				if(!rowIndex || rowIndex == "" || rowIndex == 0)
					return;
				//return if row is disabled
				var row = this.rightBodyTbl.rows[rowIndex];
				var isDisabled = row.getAttribute("busyRow");
				if(isDisabled){
					return;
				}
				if(this.editConfig == this.EDIT_ROW){
					this.editRow(e,container,rowIndex);
				}else if(this.editConfig == this.EDIT_MODAL){
					this.editInModal(e,container);
				}else if(!this.submitErrors &&(container == this.leftBodyUL || container == this.rightBodyTbl)) { /* For EmbedPane and ExpandPane */
					if(this.editConfig==this.EDIT_HARNESS) {
						this.editInHarness(e, container);
					}
					else if(this.editConfig==this.EDIT_EXPANDPANE || this.bShowExpandDetails) {
						/*If expandedElem is avaialable on grid object then collapse that row befor expanding the current row and if toBeExpanded is available then exapand that row.*/
            /* BUG-590326 : Expandable Grid Features not working */
						if(((this.threadProcessing && !this.bReadOnlyShowDetails && !this.bRODetails) || !this.bExpandMultipleRows)&& (this.expandedElem || this.toBeExpanded)){
							if(this.expandedElem){
								var activeRow = this.expandedElem;
								var srcRow = this.getLeftRow(this.getActiveRowIndex());
								if(this.expandedElem!=srcRow)
									this.toBeExpanded = srcRow;
									e = {type:Grids.EVENT_CLICK,target:this.expandedElem};
							}else{
								var activeRow = this.toBeExpanded;
								var toBE = this.toBeExpanded;
									e = {type:Grids.EVENT_CLICK,target:toBE};
								this.toBeExpanded = null;
							}
						}else{
							var activeRow  = this.getLeftRow(this.getActiveRowIndex());
						}
						if(activeRow) {
								if(this.bDragDrop || this.bNumberedSkin) {
									var activeRowTD = Dom.getNextSibling(Dom.getFirstChild(activeRow));
								}
								else {
									var activeRowTD = Dom.getFirstChild(activeRow);
								}
								if(activeRowTD) {
									if(this.bShowExpandCollapseColumn){
										var expandRowAnchor = Dom.getFirstChild(activeRowTD);
									}
									else{
										var expandRowAnchor = activeRowTD;
									}
								}
						}
						if(!activeRow.getAttribute("rowExpanded")) {
							// BUG-616252 Radio button click is not working on single click in expand pane
              var ev = e, _this = this;
              ev.target.type === "radio" 
                ? setTimeout(function(){_this.expandRowDetails(ev, container, expandRowAnchor);})
                : this.expandRowDetails(ev, container, expandRowAnchor);
						}
						else if(activeRow.getAttribute("rowExpanded") && activeRow.getAttribute("rowExpanded")=="true") {
								this.collapseRowDetails(e, container, expandRowAnchor);
						}
						else if(!this.threadProcessing || (this.threadProcessing && this.comingFromAdd!="true")){
						/*invoke enabling buttons for only for editing cases of grid with WO*/
							this.selectPage(e,container);
							if(!this.bRODetails) { /* enable the buttons only if details are editable */
							var cell = this.findCell(e, container);
							if(cell){
								var rowIndex = this.getRowIndex(cell);
								if(rowIndex && rowIndex != "" && rowIndex != 0){
									this.enableSaveDiscardButtons(e);
									}
								}
							}
						}
					}
					else {
						this.selectPage(e,container);
					}
				}
			},

			handleSummaryGridOpen: function(cell,rowIndex, e){
				var cellIndex = null;
				if(cell && cell.tagName == "TD"){
					cellIndex = cell.cellIndex;
				}
				var rightcontent = this.rightBodyTbl.rows[this.getActiveRowIndex()];
				var leftcontent = Dom.getElementsById(rightcontent.id,this.leftBodyUL)[0];
				var expandNode = Dom.getElementsByClassName("expandNode","a",leftcontent); // Anchor node which has expandNode class.
				var collapseNode = Dom.getElementsByClassName("collapseNode","a",leftcontent); // Anchor node which has collapseNode class.
				var noECNode = Dom.getElementsByClassName("noEC","a",leftcontent)[0];// Anchor node which has noEC class.

				// If its a leaf node(no expand/collapse icon) . Logic : no expand /collapse nodes and has a noEC node , all conditions are manditory as it has nested markup.
				if(expandNode.length == 0 && collapseNode.length == 0 && noECNode) {
					var oSafeURL = SafeURL_createFromURL(pega.ctx.url);
					var leftRow = this.getLeftRow(rowIndex);
					oSafeURL.put("pyActivity","pzShowDrillDownReport");
					oSafeURL.put("Page",pega.ui.property.toReference(leftRow.id));
					oSafeURL.put("ReportName",this.RDName);
					oSafeURL.put("ReportClassName",this.RDAppliesToClass);
					oSafeURL.put("openWorkInNewTab","true");

					if(cellIndex){
						oSafeURL.put("columnIndex",cellIndex);
					}
					var grid = Grids.getActiveGrid(e);
					var callback = {
						success: function(response) { // Get the pzInsKey and objClass.
							var InsKeyAndObjClass = response.responseText;
							var InsKey = "" , ObjClass = "";

							if( InsKeyAndObjClass != "" && InsKeyAndObjClass != "noInsKey") {
								InsKeyAndObjClass = InsKeyAndObjClass.split("|");
								InsKey = InsKeyAndObjClass[0];
								ObjClass = InsKeyAndObjClass[1];
								if(InsKey != "") { // If leafnode a Work object , open it in a new tab.
									if(ObjClass === "Work") {
										openWorkByHandle(InsKey);
									}
									if(ObjClass === "Assign") {
										openAssignment(InsKey);
									}
								}
							}
							else {
								if(!this.disableDD == true){
									grid.openDDReport(rowIndex,cellIndex); // If leaf node is a non Work Object , then call the openDDReport.
								}
							}
						},

						failure: function(o){
							alert("AJAX call failed");
						}
					};
					var request = pegaUD.asyncRequest('POST', oSafeURL,callback,""); // Ajax call to get the pzInsKey from pzShowDrillDownReport.
				}
			},

			gridPaginator: function(e,pageNo) {
				var eventDetails = {type:"action",context:this };
				eventDetails.handler = this.gridPagination;
				eventDetails.args = [e,pageNo];
				this.pushToQueue(eventDetails);
			},
			gridPagination: function(args) {
				/*Reset the call as it won't disturb other actions.*/
				this.resetInCall();
				var startIndex="";
				var currentDisplay = "";
				if(this.submitErrors) {
					return;
				}
				var e = args[0];
				var pageNo = args[1];
				var totalPages = (this.totalRecords%this.rangeSize==0)?Math.floor(this.totalRecords/this.rangeSize):Math.ceil(this.totalRecords/this.rangeSize);
				/*if(isNaN(pageNo)) {
					alert("Please enter a valid Page Number to show");
					return;
				}*/
				if(pageNo == "First X Results"){
					pageNo = 1;
					startIndex = 1;
					currentDisplay = "First X Results";
				}else if(pageNo == "Show All"){
					currentDisplay ="Show All";
					pageNo = 1;
					startIndex = 1;
				}else{
					pageNo = parseInt(pageNo);
					if(isNaN(pageNo)) {  // don't do anything
						return;
					}
					if(pageNo<=0) { // don't do anything
						return;
					}
					if(pageNo>totalPages) {
						pageNo=totalPages;
					}
					startIndex = (pageNo-1)*this.rangeSize+1;
				}

				var strActionSF = new SafeURL();
				strActionSF.put("gridAction","PAGINATE");

				if(this.gridPreActivity) {
					strActionSF.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					strActionSF.put("gridPostActivity", this.gridPostActivity);
				}

				strActionSF.put("gridActivity", "pzGridSortPaginate");
				strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
				strActionSF.put("PageListProperty",this.getPLPGProperty());
				strActionSF.put("ClassName", this.propertyClass);
				if(this.bReportDefinition) {
					strActionSF.put("RDName",this.RDName);
                  if(this.bLoadActivity)
                  	strActionSF.put("bLoadActivity", this.bLoadActivity);
					strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
					strActionSF.put("pgRepContPage", this.RDContPage);
					if(this.RDPageName){
					strActionSF.put("pyReportPageName", this.RDPageName);
					}
					strActionSF.put("RDParamsList", this.RDParams);
					strActionSF.put("gridLayoutID", this.gridLayoutID);

					if(this.pageMode=="Progressive Load") {
						strActionSF.put("bCBOptimize", this.bCBOptimize);
					}
				}
				var baseRef = pega.u.d.getBaseRef(this.rightBodyTbl);
				strActionSF.put("BaseReference", baseRef);
                if(!this.bEditable){
                	strActionSF.put("ReadOnly", "true");
                }
				strActionSF.put("startIndex", startIndex);
				strActionSF.put("currentPageIndex",pageNo);
				if(currentDisplay!=""){
					strActionSF.put("currentDisplay",currentDisplay);
					if(currentDisplay == "Show All")//BUG-127484
						strActionSF.put("pyTotalResultCount",this.totalRecords);
				}
				if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
        if(this.pageMode){
                   strActionSF.put("pyPageMode", this.pageMode);
			    }
				strActionSF.put("pyPageSize",this.rangeSize);
				if(this.sortProperty && this.sortProperty!=null)
					strActionSF.put("sortProperty", this.sortProperty);

				if(this.sortType && this.sortType!=null)
					strActionSF.put("sortType", this.sortType);

				strActionSF.put("isReportDef", this.bReportDefinition);
				var prevStartIndex= ((this.currentPageIndex-1)*this.rangeSize)+1;
				strActionSF.put("prevStartIndex", prevStartIndex);
				if(this.bFilteredGrid){
					strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				}
				if(this.pyPaginateActivity){
					strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
					if(this.pySortHandled || this.pyFilterHandled){
						if(this.pySortHandled) {
							strActionSF.put("pySortHandled",this.pySortHandled);
						}
						if(this.pyFilterHandled) {
							strActionSF.put("pyFilterHandled",this.pyFilterHandled);
						}
					}else {
						strActionSF.put("totalRecords",this.totalRecords);
					}
				}

				if(this.editConfig==this.EDIT_EXPANDPANE) {
					strActionSF.put("showSaveDiscard", "true");
				}
				var postData = new SafeURL();
				if(this.categorizeBy) {
					postData.put("categorizeBy",this.categorizeBy);
				}

				/*prevent default to avoid triggering harness onbefore unload*/
				Event.preventDefault(e);

				/* BUG-145096: Focusing the right pagination bar */
				var actionAncestor = pega.util.Dom.getAncestorBy(pega.util.Event.getTarget(e), function(element) {
					if(element.className == "gridActionTop" || element.className == "gridActionBottom") return true;
					return false;});

				this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(), e, {"focus" : "paginator-element", "grid-action-class" : actionAncestor.className }, this.gridDiv, null, true, postData);
			},

			refreshList: function(e, params){
				var baseRef = pega.u.d.getBaseRef(this.rightBodyTbl);
				var currentPageIndex = this.currentPageIndex;
				var strActionSF = new SafeURL();
				strActionSF.put("gridAction","REFRESHLIST");

				if(this.gridPreActivity) {
					strActionSF.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					strActionSF.put("gridPostActivity", this.gridPostActivity);
				}

				// BUG-161868: Save grid activeRow state upon Refresh List
				var activeRow = this.getActiveRowIndex();
				if(this.bFocusibleGrid && activeRow) {
					strActionSF.put("gridActiveRow", activeRow);
				}

				if(params){
					var dpParams = params.dpParams;
				}
				if(this.pyPaginateActivity || (this.bReportDefinition && currentPageIndex)){
					strActionSF.put("totalRecords",this.totalRecords);
				}
				if(currentPageIndex && this.rangeSize){
					if (this.pageMode == "Progressive Load") {
						var startIndex = 1;
						if (this.bDiscardInvisibleRows) {
							strActionSF.put("bDiscardInvisibleRows", "true");
							startIndex = this.getFirstLoadedRowIndex();
							strActionSF.put("startIndex", startIndex);
							var recordsInCurrentPage =  this.rangeSize * 3;
							if (1 == this.currentPageIndex) {
								recordsInCurrentPage = 2 * this.rangeSize;
							}
							strActionSF.put("recordsInCurrentPage", recordsInCurrentPage);
						} else {
							strActionSF.put("recordsInCurrentPage", (this.currentPageIndex + 1) * this.rangeSize);
						}
					} else {
						var startIndex = (currentPageIndex - 1) * this.rangeSize + 1;
					}
					strActionSF.put("startIndex", startIndex);
					strActionSF.put("pyPageSize", this.rangeSize);
					strActionSF.put("currentPageIndex", currentPageIndex);
				}
				if(this.bFilteredGrid){
					strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				}
				if(this.bReportDefinition) {
					strActionSF.put("RDName",this.RDName);
					strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
					strActionSF.put("pgRepContPage", this.RDContPage);
					if(this.RDPageName){
					strActionSF.put("pyReportPageName", this.RDPageName);
					}
					strActionSF.put("gridLayoutID", this.gridLayoutID);
					if(this.pageMode=="Progressive Load") {
						strActionSF.put("bCBOptimize", this.bCBOptimize);
					}
				}
				strActionSF.put("BaseReference", baseRef);
				if(this.sortProperty && this.sortType) {
					strActionSF.put("sortProperty", this.sortProperty);
					strActionSF.put("sortType", this.sortType);
				}
				strActionSF.put("isReportDef", this.bReportDefinition);
				this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(),e,null,this.gridDiv,null,true, dpParams);
			},
			openFilterGadget : function(args,target1){
			   var event = args[0];
			   var cell = args[2];
			   var target = args[1];
			   var po = pega.u.d.getPopOver(target);

			   var propName = cell.getAttribute("SortField");
				 var filterType = target.getAttribute("filterType");
               if( !filterType ) {
            	var attrs = target.attributes;
           		var length = attrs.length;
            	for(var i = 0; i < length; i++)
                if(attrs[i].nodeName === "filterType")
                    filterType = attrs[i].nodeValue;
        		}
			   this.filteredColName = propName;

				 /* BUG-60169*/
				 pegaUD.fromFilterPopover = target;
//US-52836 - Start
var pyDisplaySelectedValuesFirst = this.gridcontDiv.getAttribute("pyDisplaySelectedValuesFirst");
if(pyDisplaySelectedValuesFirst === null)
{
    pyDisplaySelectedValuesFirst = "false";
}
//US-52836 - End
// US-52831 - start Support initial categorization of Grid for RD and VRD sources
var pyCellType = cell.getAttribute("pyCellType");
if(pyCellType === null)
{
    pyCellType = "static";
}
// US-52831 - End Support initial categorization of Grid for RD and VRD sources
			   var popoverArgumentObject = {	bindings:	{associatedElement:target, bindingProvider: this.dbp},
												position:{
														offsetAttach:{x:2,y:3},
														size:{
															min:{x:178, y:0},
															max:{}}
														},
												callbacks:	{onContentDisplayed:[this.filterGadgetOnShow,[],this],
												onBeforeClose:[this.checkValidInput,[propName],this],
												onClose:[this.submitFilterCriteria,[propName],this]},
											   buttons:	{ok:true,cancel:true,okText:pega.u.d.fieldValuesList.get("ApplyFilter"),cancelText:pega.u.d.fieldValuesList.get("CancelFilter")}
											};
					var parameters = {pyGridFilterCriteriaPage: this.gridFilterPage,
														PageListProperty : this.getPLPGProperty(), BaseReference: this.baseRef,
														pyColumnName:propName,ClassName:this.propertyClass,
														sortProperty:(this.sortProperty ? this.sortProperty : ""),sortType :(this.sortType ? this.sortType :""),
														pyPaginateActivity:(this.pyPaginateActivity ? this.pyPaginateActivity : ""),
														pyFilterHandled:(this.pyPaginateActivity ? this.pyFilterHandled : ""),
				  	  pyDisplaySelectedValuesFirst:pyDisplaySelectedValuesFirst,pyCellType:pyCellType
													};
					var secDiv = pega.u.d.getSectionDiv(target);
					parameters.sectionName = secDiv.getAttribute("NODE_NAME");
					parameters.sectionClass = secDiv.getAttribute("pyclassname");
					var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
					parameters.partialTrigger = "filterpopup"+this.getConfiguredPLPGProperty()+ gridIndex;
					var isFormattedControl = cell.getAttribute("bFormattedControl");
					parameters.isFormattedControl = isFormattedControl;
					var columnIndex = this.getFilteredColumnIndex(cell);
					this.filteredColIndex = columnIndex;

					parameters.columnIndex = columnIndex;
					parameters.filterType = filterType;
					//TASK-155208 Changes Start
					if (cell.getAttribute("pyShowFilterUIBy")) {
						parameters.pyShowFilterUIBy = cell.getAttribute("pyShowFilterUIBy");
					}
					//TASK-155208 Changes End
					if ((filterType == "true" || filterType == "search") && cell.getAttribute("pyRangeFiltering")) {
						parameters.pyRangeFiltering = cell.getAttribute("pyRangeFiltering");
					}
					if(cell.getAttribute("bsecinclude")){
						parameters.bsecinclude = cell.getAttribute("bsecinclude");
					}
					if(cell.getAttribute("data-dateFormat")){
						parameters.dateFormat = cell.getAttribute("data-dateFormat");
					}
					if(cell.getAttribute("data-dateTimeFormat")){
						parameters.dateTimeFormat = cell.getAttribute("data-dateTimeFormat");
					}
					if(cell.getAttribute("data-dateTimeCutoff")){
						parameters.pyDateTimeSecondCutoff = cell.getAttribute("data-dateTimeCutoff");
					}
              		if(cell.getAttribute("data-dontShowPastFuture")){
                      parameters.pyDontShowPastFuture = cell.getAttribute("data-dontShowPastFuture");
                    }
					if(this.gridDiv.getAttribute("bRangeFilterByFormat") != null){
						parameters.bRangeFilterByFormat = this.gridDiv.getAttribute("bRangeFilterByFormat");
					}
					if(this.bReportDefinition){
                      if(this.bLoadActivity)
                        parameters.bLoadActivity = this.bLoadActivity;
						parameters.isReportDef =this.bReportDefinition;
						parameters.RDName =this.RDName;
						parameters.RDAppliesToClass =this.RDAppliesToClass;
						parameters.pgRepContPage =this.RDContPage;
						if(this.RDPageName){
							parameters.pyReportPageName =this.RDPageName;
							}
						parameters.RDParamsList = this.RDParams;
						if(this.dynamicColumnIndex){
							parameters.dynamicColumnIndex = this.dynamicColumnIndex;
						}
						if(this.pageMode=="Progressive Load") {
							parameters.bCBOptimize = this.bCBOptimize;
						}
						if(this.RDParams!="") {
							var sectionID = this.gridLayoutID;
							parameters.gridLayoutID = this.gridLayoutID;
							var rdParamsArr = this.RDParams.split(",");
							for(var i=0; i<rdParamsArr.length; i++) {
								var rdParamObj = pega.ctx.dom.getElementsByName(sectionID+rdParamsArr[i])[0];
								parameters[rdParamObj.name] = rdParamObj.value;
								var dotIndex = rdParamObj.value.indexOf(".");
								if(dotIndex>0) {
									if(rdParamObj.value.substring(0,dotIndex).toUpperCase()=="PARAM") {
										var tempParamObj = pega.ctx.dom.getElementsByName(rdParamObj.value.substring(dotIndex+1))[0];
										if(tempParamObj) {
											parameters[tempParamObj.name] = tempParamObj.value;
										}
									}
								}
							}
						}
					}
					popoverArgumentObject.content =	{type:"section",
													name:"pzGridFilterPanel",
													preActivity :{name : "pzGetGridColUniqueValues",
																	page: this.primPage,
																	params :parameters
																}
													};
			   po.open(popoverArgumentObject);
			   pega.util.Event.stopPropagation(event);
			},

			filterGadgetOnShow : function(filterPopover){
				/*BUG-158449: To Determine whether filter pop over is open */
                this.isFilterPOOpen = true;
				pega.u.d.inCall = false;
				pega.u.d.changeInEventsArray.fire();
				var firstFocusElem = pega.u.d.getFirstFocusableElement(filterPopover.id);
				if(firstFocusElem){
					try{
						window.setTimeout(function(){firstFocusElem.focus();},50);
					}catch(e){
						return;
					}
					filterPopover.setAttribute("role","dialog");
					filterPopover.setAttribute("aria-labelledby","filterCriteria");
					//US-70197 && US-70203 start
					try{
					var filterPanelHeight = filterPopover.style.height.replace("px", "");
					var filterScrolllHeight = filterPopover.scrollHeight;
					var filterClientHeight = filterPopover.clientHeight;
						if(filterPanelHeight && filterScrolllHeight && filterPanelHeight < filterScrolllHeight){
							filterPopover.style.overflowX = "hidden";
						}
					}catch(Exp){ return;}
					//US-70197 && US-70203 start
				}
			},

			checkValidInput : function(){
				var reason = arguments[0];
         /*BUG-513155 : No need to run validation for clearfilter*/
				if(reason && (reason.toUpperCase() == "CANCEL" || reason.toUpperCase() == "CLICKAWAY" || reason.toUpperCase() == "CLEARFILTER" )) {
					return true;
				}

				if(arguments[2]) {
					var popOverEle = arguments[2].popOverElement;
					if(popOverEle && (typeof(validation_validate) == "function")&& !validation_validate(popOverEle)){
							return false;

					}
					//US-70197 && US-70203 start
					try{
					var checkRangeValidation = this.checkRangeFilter(popOverEle);
					if(checkRangeValidation == false){
						return false;
					}
					}catch(e){}
					//US-70197 && US-70203 End

				}

				return true;
			},

			checkRangeFilter : function(popOverEle){
			//US-70197 && US-70203 start
					var filterRangeSection = pega.util.Dom.getElementsByAttribute ("node_name", "pzGridFilterRangeSearch", "DIV", popOverEle);
						if(filterRangeSection[0] != null){
							var filterRangeValues = filterRangeSection[0].getElementsByTagName("input");
							if(filterRangeValues && filterRangeValues.length >= 2) {
								var len = filterRangeValues.length;
								var node1 = "";var node2 = "";
											for(var i=0; i< len;i++){
											node1 = filterRangeValues[0];
											node2 = filterRangeValues[1];
											}
                
                         if((node1.value && node2.value && node1.value.length && node2.value.length) && node1.name.endsWith("pyStartDate") && node2.name.endsWith("pyEndDate")){
															var value1 = new Date(pega.u.d.wrapperProcessDate(node1.value, "0"));
															var value2 = new Date(pega.u.d.wrapperProcessDate(node2.value, "0"));
                              var dateVal1 = value1.valueOf();
                              var dateVal2 = value2.valueOf();
                              var errorList = new Array();
															var successList = new Array();
															var serverErrors = new Array();
																if(isNaN(dateVal1) || isNaN(dateVal2)){
                                  if (isNaN(dateVal1)){
																	 errorList.push(display_getValidationError(node1,"", invalidDateValue));
                                  }
                                  if (isNaN(dateVal2)){
                                   errorList.push(display_getValidationError(node2,"", invalidDateValue));
                                  }
																	display_showImageErrors(errorList, successList, serverErrors);
																	return false;
																}
								          }
                
                          // validation for range Integer's values
											    if(node1.name.endsWith("pyStartInteger")&& node2.name.endsWith("pyEndInteger")){

													var value1 = parseInt(node1.value);
													var value2 = parseInt(node2.value);
														if(!isNaN(value1) && !isNaN(value2)){
														if(value1 > value2){
															var errorList = new Array();
															var successList = new Array();
															var serverErrors = new Array();
															var aPossibleError = display_getValidationError(node2,"",filterPanelRangeMsg1);
															errorList.push(aPossibleError);
															display_showImageErrors(errorList, successList, serverErrors);

														return false;
														}

														}

												}
												//Validation for range decimal values
												if(node1.name.endsWith("pyStartDecimal") && node2.name.endsWith("pyEndDecimal")){
                            /* BUG-350154: Implicitly remove , entered by user in range filters in case of decimal validation */
                            var value1 = parseFloat(node1.value.replace(/,/g, ""));
                            var value2 = parseFloat(node2.value.replace(/,/g, ""));
														if(!isNaN(value1) && !isNaN(value2)){
														if(value1 > value2){
															var errorList = new Array();
															var successList = new Array();
															var serverErrors = new Array();
															var aPossibleError = display_getValidationError(node2,"",filterPanelRangeMsg1);
															errorList.push(aPossibleError);
															display_showImageErrors(errorList, successList, serverErrors);

														return false;
														}

														}
												}
												//Validation for range Double values
												if(node1.name.endsWith("pyStartDouble") && node2.name.endsWith("pyEndDouble")){
															var value1 = parseFloat(node1.value);
															var value2 = parseFloat(node2.value);
														if(!isNaN(value1) && !isNaN(value2)){
														if(value1 > value2){
															var errorList = new Array();
															var successList = new Array();
															var serverErrors = new Array();
															var aPossibleError = display_getValidationError(node2,"",filterPanelRangeMsg1);
															errorList.push(aPossibleError);
															display_showImageErrors(errorList, successList, serverErrors);

														return false;
														}

														}
												}
												//Validation for range Date time values
												if(node1.name.endsWith("pyStartDateTime") && node2.name.endsWith("pyEndDateTime")){
															var value1 = new Date(pega.u.d.wrapperProcessDate(node1.value, "1"));
															var value2 = new Date(pega.u.d.wrapperProcessDate(node2.value, "1"));
																if(value1 && value2 && value1 > value2){
																	var errorList = new Array();
																	var successList = new Array();
																	var serverErrors = new Array();
																	var aPossibleError = display_getValidationError(node2,"", filterPanelRangeMsg2);
																	errorList.push(aPossibleError);
																	display_showImageErrors(errorList, successList, serverErrors);
																	return false;
																}
												}
												//Validation for Date values
												if(node1.name.endsWith("pyStartDate") && node2.name.endsWith("pyEndDate")){
															var value1 = new Date(pega.u.d.wrapperProcessDate(node1.value, "0"));
															var value2 = new Date(pega.u.d.wrapperProcessDate(node2.value, "0"));
																if(value1 && value2 && value1 > value2){
																	var errorList = new Array();
																	var successList = new Array();
																	var serverErrors = new Array();
																	var aPossibleError = display_getValidationError(node2,"", filterPanelRangeMsg2);
																	errorList.push(aPossibleError);
																	display_showImageErrors(errorList, successList, serverErrors);
																	return false;
																}
												}


							}
						}
						return true;
			//US-70197 && US-70203 end
			},

			/*Called for clearing filter criteria on a column.  We set the gridActivity as pzGetGridColUniqueValues for clearing filter criteria*/
			clearFiltering: function() {
				if(this.bFilteredGrid) {
					var strActionSF = this.prepareFitleringRequest();
					if(this.pyPaginateActivity || this.bReportDefinition){
						strActionSF.put("clearFilterActivity", "pzGetGridColUniqueValues");
					}else {
					/*over ride gridActivity for Non-advanced users.*/
						strActionSF.put("gridActivity", "pzGetGridColUniqueValues");
					}
					if(this.pageMode=="Progressive Load" && this.bReportDefinition) {
						strActionSF.put("bCBOptimize", this.bCBOptimize);
					}
					strActionSF.put("pyColumnName", this.filteredColName);
					strActionSF.put("columnIndex", this.filteredColIndex);
					strActionSF.put("pyClearFiltering", true);
					/* Bug-115059 - dynamicColumn index for columnSubscript computations */
					if(this.bReportDefinition && this.dynamicColumnIndex){
						strActionSF.put("dynamicColumnIndex", this.dynamicColumnIndex);
					}
					if(this.gridDiv.getAttribute("bRangeFilterByFormat") != null){
						strActionSF.put("bRangeFilterByFormat",this.gridDiv.getAttribute("bRangeFilterByFormat"));
					}
					if(this.isClearGridFiltering()) {
						strActionSF.put("pzClearGridFiltering", true);
					}
					var postData = new SafeURL();
					if(this.categorizeBy) {
						postData.put("categorizeBy",this.categorizeBy);
					}
					this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(),null,null,this.gridDiv,null,true, postData);
				}
			},
			isClearGridFiltering: function() {
				var filterdCells = Dom.getElementsByClassName("filtered","button", this.rightBodyTbl.rows[0]);
				if(filterdCells && filterdCells.length==1) {
					return true;
				}
				return false;
			},
			submitFilterCriteria: function() {
				/*BUG-158449: Removing the property when filter pop over is dismissed*/
				delete this.isFilterPOOpen;
				var reason = arguments[0];
				pegaUD.fromFilterPopover = null;
				var popOverEle = arguments[2].popOverElement;
				popOverEle.removeAttribute("role");
				popOverEle.removeAttribute("aria-labelledby");
				var propName = arguments[3];
				pega.ctx.Grid.isFilterMenuItemClicked = false;
				if(reason && (reason.toUpperCase() == "CANCEL" || reason.toUpperCase() == "CLICKAWAY" || reason.toUpperCase() == "CLEARFILTER")) {
					this.resetInCall();
					Grids.reFocusPrevFocussedElem(this);
                    /* BUG-278761: Clear the value of this.filteredColName */
                    this.filteredColName = "";

					/*Set the focus on the header if user clicked on cancel or click away
						Also set the focus in case use clicked on clear filter but Grid does not filtered yet as grid will not reload at that time.
					*/
					if((gridSortFieldName != "" && reason.toUpperCase() != "CLEARFILTER") || !this.bFilteredGrid){
						var els = pega.ctx.dom.getElementsByTagName('th');
						if(propName != ""){
							for (var i = 0; i < els.length; i++) {
								if (els[i].hasAttribute('sortfield') && els[i].getAttribute("sortfield") == propName) {
									//console.log(els[i].focus());
									els[i].focus();
								}
							}
						}
						gridSortFieldName = "";
					}
					return;
				}

				var queryString = pegaUD.getQueryString(popOverEle);

				if(this.categorizeBy) {
					queryString.put("categorizeBy",this.categorizeBy);
				}
				var strActionSF = this.prepareFitleringRequest();

				this.reloadGridLayout('pzdoGridAction',strActionSF.toQueryString(),null,null,this.gridDiv,null,true,queryString);
			},

			prepareFitleringRequest: function(){
				var strActionSF = new SafeURL();

				strActionSF.put("gridAction","FILTER");
				strActionSF.put("gridActivity", "pzGridSortPaginate");
				strActionSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				if(this.pyPaginateActivity){
					strActionSF.put("pyPaginateActivity", this.pyPaginateActivity);
					if(this.pySortHandled){
						strActionSF.put("pySortHandled",this.pySortHandled);
					}
					if(this.pyFilterHandled) {
						strActionSF.put("pyFilterHandled",this.pyFilterHandled);
					}
				}
				strActionSF.put("PageListProperty",this.getPLPGProperty());
	                       //US-53421- change starts
                               if(this.dynamicColumnIndex != null)
                               strActionSF.put("dynamicColumnIndex", this.dynamicColumnIndex);
                               //US-53421- change ends
				strActionSF.put("ClassName", this.propertyClass);
				if(this.bReportDefinition) {
					strActionSF.put("RDName",this.RDName);
					strActionSF.put("RDAppliesToClass", this.RDAppliesToClass);
					strActionSF.put("pgRepContPage", this.RDContPage);
                  if(this.bLoadActivity)
                   	strActionSF.put("bLoadActivity", this.bLoadActivity);
					if(this.RDPageName){
					strActionSF.put("pyReportPageName", this.RDPageName);
					}
					strActionSF.put("RDParamsList", this.RDParams);
					strActionSF.put("gridLayoutID", this.gridLayoutID);
					if(this.pageMode=="Progressive Load") {
						strActionSF.put("pyPageMode", this.pageMode);
						strActionSF.put("bCBOptimize", this.bCBOptimize);
					}
				}
				strActionSF.put("BaseReference", this.baseRef);
				if(this.bSortable) {
				strActionSF.put("sortProperty", this.sortProperty);
				strActionSF.put("sortType", this.sortType);
				}
				if(this.rangeSize){
					strActionSF.put("pyPageSize", this.rangeSize); // to convey that paging is enabled in this grid
				}
        if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
				if(this.pageMode){
                     strActionSF.put("pyPageMode", this.pageMode);
			      }
				strActionSF.put("isReportDef", this.bReportDefinition);

        //BUG-375435 Added parameters gridPreActivity and gridpostActivity to filter request inorder to execute custom activities configured on run after Pre/Post grid update

         if(this.gridPreActivity){
				strActionSF.put("gridPreActivity",this.gridPreActivity);
        }
        if(this.gridPostActivity){
           strActionSF.put("gridPostActivity",this.gridPostActivity);
         }

				return strActionSF;
			},

			renderContextMenu: function(id,posObj,ruleNav,objClass, paramsObj, pxMenu, event) {

				if (pxMenu) {
					/* Run the pxMenu code instead of menubar code*/
					paramsObj = paramsObj || {};
					if(posObj.usingPage && posObj.usingPage != "") {
						paramsObj.pzPrimaryPageName = posObj.usingPage;
					} else if(this.getEntryHandle()) {
						paramsObj.pzPrimaryPageName = this.getEntryHandle();
					}
					pega.control.menu.showContextMenu(paramsObj, posObj.relativeElement, event);

				} else {
				var oContextXML = pega.tools.XMLDocument.get();
				this.resetExecutionThread();
				var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
				strUrlSF.put("pyActivity", "pxMenuBarTranslator");
				strUrlSF.put("Name", ruleNav);
				strUrlSF.put("Class",objClass);
				strUrlSF.put("Page",id);
				strUrlSF.put("Refresh",true);
				strUrlSF.put("RemovePage",false);
				strUrlSF.put("gridAction","true");
				if(posObj.usingPage && posObj.usingPage != "") {
					strUrlSF.put("pzPrimaryPageName",posObj.usingPage);
				} else if(this.getEntryHandle()) {
					strUrlSF.put("pzPrimaryPageName",this.getEntryHandle());
				}
				var _this = this;

				var callback = {
					success: function(o) {
						oContextXML.loadXML(o.responseText);
						var contextMenuObj = _this.contextMenuObjs[id];
						var xmlRootNode = {};
						if(!contextMenuObj) {
							contextMenuObj = new pega.ui.menubar.Manager();

							contextMenuObj.setAlignment("horizontal");
							contextMenuObj.registerCallback(null,_this);
							_this.contextMenuObjs[id] = contextMenuObj;
						}
						//---- dummy parent change-start
						// using 'pagedata' to support multilpe parent nodes also.
						var xmlRootNode = {};
						xmlRootNode=pega.util.Dom.selectSingleNode(oContextXML,'//pagedata');

						var child = xmlRootNode.childNodes;
						var length = child.length;
						if(!pega.env.ua.ie) {
							length = 0;
							for(var i=0;i<child.length;i++){
								if(child[i].nodeType != 3)
									length++;
					}
				}
						//  using 'Menu' for backward compatibilty so that dummy parent node with children is also supported.
						var xmlFirstMenuNode=pega.util.Dom.selectSingleNode(oContextXML,'//Menu');
						var childLength=0;
						if(xmlFirstMenuNode) {
							childLength=xmlFirstMenuNode.childNodes.length;
							if(length == 1 && childLength > 0) {
								xmlRootNode=pega.util.Dom.selectSingleNode(oContextXML,'//Menu');
					}
				}

						var clonedNode = xmlRootNode.cloneNode(true);
						_this.closeContextMenus(id);

				//Autobots Sprint 12 - Show Menu Action - sending 'relativeElement'
				if(pega.env.ua.webkit) {
					contextMenuObj.doContextMenu(xmlRootNode, posObj);
				} else {
					contextMenuObj.doContextMenu(clonedNode, posObj);
				}
				contextMenuObj.active = true;
					},

					failure: function(o){
						alert("AJAX call failed");
						_this.resetInCall();
					}
				}
				var responseObj = pega.u.d.asyncRequest('POST', strUrlSF, callback);
}
			},

			getUpdatedXMLRootNode: function(id,posObj,ruleNav,objClass) {
				var oContextXML = pega.tools.XMLDocument.get();
				var strUrlSF = SafeURL_createFromURL(pega.ctx.url);

				strUrlSF.put("pyActivity", "pxMenuBarTranslator");
				strUrlSF.put("Name", ruleNav);
				strUrlSF.put("Class",objClass);
				strUrlSF.put("Page",id);
				strUrlSF.put("Refresh",true);
				strUrlSF.put("RemovePage",false);
				var _this = this;

				var callback = {
					success: function(o) {
						oContextXML.loadXML(o.responseText);
						var contextMenuObj = _this.contextMenuObjs[id];

						var xmlRootNode = _this.menuRootNodes[id];
						contextMenuObj = new pega.ui.menubar.Manager();
						contextMenuObj.setAlignment("horizontal");
						contextMenuObj.registerCallback(null,this);


				//---- dummy parent change-start
				// using 'pagedata' to support multilpe parent nodes also.

				xmlRootNode=pega.util.Dom.selectSingleNode(oContextXML,'//pagedata');

				var child = xmlRootNode.childNodes;
				var length = child.length;
				if(!pega.env.ua.ie) {
					length = 0;
					for(var i=0;i<child.length;i++){
						if(child[i].nodeType != 3)
							length++;
					}
				}
				//  using 'Menu' for backward compatibilty so that dummy parent node with children is also supported.
				var xmlFirstMenuNode=pega.util.Dom.selectSingleNode(oContextXML,'//Menu');
				var childLength=0;
				if(xmlFirstMenuNode) {
					childLength=xmlFirstMenuNode.childNodes.length;
					if(length == 1 && childLength > 0) {
						xmlRootNode=pega.util.Dom.selectSingleNode(oContextXML,'//Menu');
					}
				}
						_this.contextMenuObjs[id] = contextMenuObj;
						_this.menuRootNodes[id] = xmlRootNode;
						var clonedNode = xmlRootNode.cloneNode(true);
						_this.closeContextMenus(id);

						if(pega.env.ua.webkit) {
							contextMenuObj.doContextMenu(xmlRootNode, {x:posObj.x, y:posObj.y});
						} else {
							contextMenuObj.doContextMenu(clonedNode, {x:posObj.x, y:posObj.y});
						}
						contextMenuObj.active = true;
					},

					failure: function(o){
						alert("AJAX call failed");
						_this.resetInCall();
					}
				}
				var responseObj = pega.u.d.asyncRequest('POST', strUrlSF, callback);


			},

			closeContextMenus : function(id) {
				var allGrids = window.Grids.getAllGrids();
				for(var i in allGrids) {
					var ctxtMenus = allGrids[i].contextMenuObjs;
					if(ctxtMenus) {
						for(var prop in ctxtMenus) {
							if(allGrids[i]==this) {
								if(id != prop) {
									ctxtMenus[prop]._hideAll();
								}
							}
							else {
								ctxtMenus[prop]._hideAll();
							}
						}
					}
				}
			},

			synchHeadersForPercent : function() {
				if(this.bResponsiveGrid && this.isInFatList()) {
					return;
				}
				/* BUG-142850 As we replaced div with th in scrollHead for percentage Grids, the rightHeaderTbl should have 100% width */
				/*
				if(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0 && this.rightHeaderDiv) {
					if(Dom.getFirstChild(this.rightHeaderDiv) && Dom.getFirstChild(this.rightHeaderDiv).rows) {
						var gridHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
						var gridHeaderWidth = this.rightHeaderDiv.parentNode.offsetWidth;
						// var widthToSet = ((gridHeaderWidth-this.getScrollbarWidth())/gridHeaderWidth)*100;
						var widthToSet = 100;
						if(pega.env.ua.webkit) {/* BUG-130938: Commented below line as it is causing another issue. To fix BUG-117639 equate padding to 0 for scrollHead.
							var scrollHead = Dom.getNextSibling(gridHeaderTbl);
							if(scrollHead.className.indexOf("scrollHead") != -1) {
								scrollHead.style.padding = 0;
							}
						}
						gridHeaderTbl.style.width = widthToSet + "%";
					}
				}
				*/
				//BUG-84153: TreeGrid-100%-onresize-first col is not resized
				if(!this.bTree && this.bTreegrid && this.fixedRow && this.leftHeaderDiv && this.leftBodyDiv
          && Dom.hasClass(this.gridcontDiv,"gPercent") == true){
					this.leftBodyDiv.style.width = this.leftHeaderDiv.offsetWidth + 'px';
				}
				/*BUG-172459: Added a call to setHeadersWidth to correct the header alignment on re-size*/
				this.setHeadersWidth();
			},

			adjustLayoutWrapperWidth : function(){
				if(this.bResponsiveGrid && this.isInFatList()) {
					return;
				}
				if(!this.fixedCol && this.fixedRow) {
					if((this.layoutWrapperDiv.style.width == "" || this.layoutWrapperDiv.getAttribute("noWidth")=="true") && Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
						var scrollBarWidth = 0;
						var adjustWidth = 0;
                                                // BUG-139892 Account for scrollbar width even for IE; Now applicable to all browsers and modes
						/*if(Event.isIE || pega.u.d.inStandardsMode) */
                                                {
							if(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && (this.layoutWrapperDiv.clientHeight != 0 || pega.util.Event.isIE)){
								scrollBarWidth = this.getScrollbarWidth();
							}
							if(!this.layoutWrapperDiv.getAttribute("noHeight") || this.pageMode=="Progressive Load") {
								adjustWidth = 2;
							}
						}
						if(Dom.getFirstChild(this.layoutWrapperDiv) && Dom.getFirstChild(this.layoutWrapperDiv).offsetWidth) {
							this.layoutWrapperDiv.style.width = Dom.getFirstChild(this.layoutWrapperDiv).offsetWidth+scrollBarWidth+adjustWidth+"px";
						}

					}
				}
			},


			/*
			@private - initializes scrollbars
			@return $void$
			*/
			initScrollbars : function() {
				if(this.bResponsiveGrid && this.isInFatList()) {
					return;
				}
				if(!this.fixedCol && this.fixedRow) {
					Dom.getElementsById("gridLayoutTable",this.gridDiv)[0].style.borderWidth = 0;
					//noWidth attribute value is 'true' when there is no design time width setting to the grid.
					this.adjustLayoutWrapperWidth();
					if(this.rightHeaderDiv){
						var rightHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
					}
					// BUG-83172: Added scrollHeadAdded
          // BUG-350399: Don't generate scrollHead when there is no scrollbar
					if(!this.scrollHeadAdded && this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0 && rightHeaderTbl && rightHeaderTbl.rows && rightHeaderTbl.rows[0].style.display!="none") {
						/*Don't generate the scroll header when no. of results are equal to page size*/
						if(!(this.pageMode=="Progressive Load" && this.totalRecords<=this.rangeSize)) {

							var scrollHeader = document.createElement("th");
								scrollHeader.style.width = this.getScrollbarWidth()+"px";
								Dom.addClass(scrollHeader, "cellCont");
								Dom.addClass(scrollHeader, "scrollHead");
								scrollHeader.innerHTML="&nbsp;";
								scrollHeader.style.padding = 0;
							if(Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
								var gridTblHeaderRow = rightHeaderTbl.rows[0];
								gridTblHeaderRow.appendChild(scrollHeader);
								this.scrollHeadAdded = true;
								this.rightHeaderTbl.style.width = parseInt(this.rightHeaderTbl.style.width) + scrollHeader.offsetWidth + "px";
							}
							else if(this.bTree && this.fixedRow){ /* TASK-113866: Add TH in case of vertical scroll bar Removed TreeGrid from the condition. Should be only for Tree. BUG-79788  */
								var gridTblHeaderRow = this.leftHeaderTbl.rows[0];
								gridTblHeaderRow.appendChild(scrollHeader);
								this.scrollHeadAdded = true;
							}
							else {
								if(this.bTreegrid && this.rightHeaderTbl) {
									// BUG-80968: Horizontal scroll bar is appearing for layoutWrapperDiv. So, made overflowY to "scroll".
									this.layoutWrapperDiv.style.overflowY = "scroll";
									//BUG-80968: Scroll Head is pushed down on col resize in non IE. So kept below inline styles.
									this.rightHeaderDiv.style.height = this.rightHeaderTbl.offsetHeight + "px";
									this.rightHeaderDiv.style.overflow = "hidden";
								}
								/* BUG-142850 - Removed div generation, instead th is appended as scrollHead */
								var gridHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
								gridHeaderTbl.rows[0].appendChild(scrollHeader);
								this.scrollHeadAdded = true;
							}
							if(parseInt(scrollHeader.style.width) == 1) {
								scrollHeader.style.border = "0 none";
							}
							//BUG-124582 -Fix Scroll Head is missing onload when not size to content only in IE.
							// BUG-214737: Headers do not scroll along with content (horizontally) in a fixed header Grid in IE; Add extra cond to skip
							if(Dom.hasClass(this.gridcontDiv,"gPercent")==false && navigator.userAgent.indexOf("MSIE")!=-1 && document.compatMode==="CSS1Compat"  && (!this.bPXFixed && !this.fixedRow)){
									try{
										if(this.layoutWrapperDiv.offsetWidth>0){
											this.rightHeaderDiv.style.width=(this.layoutWrapperDiv.offsetWidth-2)+"px";
										}
									}catch(jsEx){}
								}
						}
						// BUG-83172: Moved in to if block because it gets executed on every tab active and +1 to width will cause problem
						if(pega.env.ua.webkit && !this.bTreegrid){
							var scrollHead = scrollHeader;
							if(scrollHead && scrollHead.length > 0 ) {
								scrollHead = scrollHead[0];
								scrollHead.style.width = parseInt(scrollHead.style.width) + 1 + "px";
								// TASK-121222: chrome requires minWidth
								scrollHead.style.minWidth = scrollHead.style.width;
							}
						}
					}
					/*set fixedHeight props for fixed row case here.*/
					this.bFixedHeight = (this.layoutWrapperDiv.style.height !="");

					if(this.layoutWrapperDiv.style.width != "" && this.layoutWrapperDiv.getAttribute("noWidth")!="true") {
						Event.addListener(this.layoutWrapperDiv, "scroll", this.synchScrollHeader, this, true);
					}
                  	/*BUG-254055 : Added EventListener for tabbing on Fixed size Freeze header*/
                    var headerDiv = pega.util.Dom.getElementsById("gridHeaderDiv", this.gridcontDiv);
                  	if(headerDiv && headerDiv[0].style.width != "") {
						Event.addListener(headerDiv, "scroll", this.synchScrollHeader, this, true);
					}
					/* Set layoutWrapper Height  in IE */
					if(Event.isIE && this.layoutWrapperDiv.style.width != "" && this.layoutWrapperDiv.getAttribute("noWidth")!="true" && !this.layoutWrapperDiv.getAttribute("divheight")) {
						var height = this.layoutWrapperDiv.offsetHeight;
						if(!height) {/* BUG-162050 */
							if(this.layoutWrapperDiv.style.height != "") {
								height = parseInt(this.layoutWrapperDiv.style.height.replace("px",""));
							}
						}
						if(height) {/* BUG-162050 */
							height += this.getScrollbarWidth();
							this.layoutWrapperDiv.style.height = height.toString()+"px";
							this.layoutWrapperDiv.setAttribute("divheight", height);
						}
					}

					return;
				}
				if(!this.fixedCol && !this.fixedRow  && !Dom.hasClass(this.gridcontDiv,"gPercent")) {
					this.bFixedWidth = (this.gridcontDiv.style.width != "");
					this.bFixedHeight = (this.gridcontDiv.style.height != "");
					if(this.bFixedWidth && Event.isIE && !pega.u.d.inStandardsMode) {
						var gridContDivOffsetHeight = this.gridcontDiv.offsetHeight;
						if(gridContDivOffsetHeight != 0){
							this.gridcontDiv.style.height = gridContDivOffsetHeight+this.getScrollbarWidth() + "px";
						}
					}
					if(this.bFixedHeight) {
						var gridContDivOffsetWidth = this.gridcontDiv.offsetWidth;
						if(!pega.u.d.inStandardsMode){
							if(gridContDivOffsetWidth != 0){
								/* BUG-116582 - avoided adding scrollbar width when in quirks and ie version is >= 8 */
								if((!pega.util.Event.isIE) || (pega.util.Event.isIE && pega.env.ua.ie < 8)){
									this.gridcontDiv.style.width = gridContDivOffsetWidth + this.getScrollbarWidth() + "px";
								}else{
									this.gridcontDiv.style.width = gridContDivOffsetWidth + "px";
								}
							}
						}else{ /* In Standards mode - TASK-114296: Non-IE browsers - ScrollbarWidth has to be added to gridcontDiv's width*/
							if(gridContDivOffsetWidth != 0){
								if(pega.util.Event.isIE){
									this.gridcontDiv.style.width = gridContDivOffsetWidth + "px";
								}else{
									this.gridcontDiv.style.width = gridContDivOffsetWidth + this.getScrollbarWidth() + "px";
								}
							}
						}
					}
				}
				if((this.fixedCol || this.fixedRow) && (this.rightBodyDiv.style.width != "" || this.gridcontDiv.style.width != "")) {
          /*BUG-610909 - skip appending new div incases it alreadye exists*/
          if (this.hScrollDiv) {
					 this.setHScrollDim();
          }else{
					var hScrollDiv = document.createElement("DIV");
					var hScrollCont = document.createElement("DIV");
					var hScrollDivPlaceHolder = document.createElement("DIV");
					hScrollDivPlaceHolder.style.height = "20px";
					hScrollDiv.appendChild(hScrollCont);
					if (this.fixedCol && !this.fixedRow && this.gridcontDiv.style.height != "") {
						hScrollDivPlaceHolder.style.clear = "left";
						pega.util.Dom.insertAfter(hScrollDivPlaceHolder, this.gridcontDiv);
					} else {
						this.gridcontDiv.appendChild(hScrollDivPlaceHolder);
					}
					this.gridDiv.appendChild(hScrollDiv);
					hScrollDiv.id = "hScrollDiv";
					hScrollDiv.style.height = this.getScrollbarWidth() + "px";
					hScrollCont.innerHTML = "&nbsp;";

					this.hScrollDiv = hScrollDiv;
					this.hScrollCont = hScrollCont;
					this.setHScrollDim();

					/* if hScrollDiv has width 0 px , then it means that the grid is not yet displayed on UI . In that case the horizontal scrollbar dimension has to be recalculated on harness resize  */
					if(hScrollDiv.style.width == "0px") {
						var thisGrid = this ;
						var setHScrollDimOnResize =
								function() {
									thisGrid.setHScrollDim();
									if(thisGrid.hScrollDiv.style.width != "0px") {
										/* unregister in timeout otherwise end up changing the same array of functions which is currently beinig used to invoke harness resize callback functions */
										setTimeout(function() { pega.u.d.unregisterResize(setHScrollDimOnResize);} , 10 );
									}
								}
						pega.u.d.registerResize(setHScrollDimOnResize);
					}

					Event.addListener(this.hScrollDiv, "scroll", this.synchScrollH, this, true);
					var scrollEventEle = this.rightBodyDiv.style.width != "" ? this.rightBodyDiv : this.gridcontDiv;
					Event.addListener(scrollEventEle, "scroll", this.synchScrollH, this, true);
					if(this.rightHeaderDiv) {
						Event.addListener(this.rightHeaderDiv, "scroll", this.synchScrollH, this, true);
					}
          }
				}
				if((this.fixedCol || this.fixedRow) && (this.rightBodyDiv.style.height != "" || this.gridcontDiv.style.height != "")) {
           /*BUG-610909 - skip appending new div incases it alreadye exists*/
           if (this.vScrollDiv) {
					 this.setVScrollDim();
          }else{
					var vScrollDiv = document.createElement("DIV");
					var vScrollCont = document.createElement("DIV");
					vScrollCont.id = "vScrollCont";
					vScrollDiv.appendChild(vScrollCont);
					this.gridDiv.appendChild(vScrollDiv);
					vScrollDiv.id = "vScrollDiv";
					vScrollDiv.style.width = this.getScrollbarWidth() + "px";/*BUG-83869: removed additional 2px */
					vScrollCont.innerHTML = "&nbsp;";

					vScrollCont.style.width = this.getScrollbarWidth() + "px";

					this.vScrollDiv = vScrollDiv ;
					this.vScrollCont = vScrollCont ;
					this.setVScrollDim();

					/* if vScrollDiv has height 0 px , then it means that the grid is not yet displayed on UI . In that case the vertical scrollbar dimension has to be recalculated on harness resize  */
					if(vScrollDiv.style.height == "0px") {
						var thisGrid = this ;
						var setVScrollDimOnResize =
								function() {
									thisGrid.setVScrollDim();
									if(thisGrid.vScrollDiv.style.height != "0px") {
										/* unregister in timeout otherwise end up changing the same array of functions which is currently beinig used to invoke harness resize callback functions */
										setTimeout(function() { pega.u.d.unregisterResize(setVScrollDimOnResize); } , 10 );
									}
								}
						pega.u.d.registerResize(setVScrollDimOnResize);
					}

					Event.addListener(this.vScrollDiv, "scroll", this.synchScrollV, this, true);
					var scrollEventEle = this.rightBodyDiv.style.height != "" ? this.rightBodyDiv : this.gridcontDiv;
					Event.addListener(scrollEventEle, "scroll", this.synchScrollV, this, true);
					if(this.leftBodyDiv) {
						Event.addListener(this.leftBodyDiv, "scroll", this.synchScrollV, this, true);
					}
          }
				}
				/* Do not scroll leftbodydiv horizontally on tabbing */
				if(this.leftBodyDiv) { Event.addListener(this.leftBodyDiv, "scroll", function() { this.leftBodyDiv.scrollLeft = 0; }, this, true); }
			},

			bringToView :function(e){
				var srcEl = Event.getTarget(e);
				var cell = this.findCell(e, this.rightBodyDiv, srcEl);
				if(cell) {
						/*if(cell.offsetTop + cell.offsetHeight > srcEl.offsetHeight) {
							srcEl.scrollTop += (cell.offsetTop + cell.offsetHeight) - srcEl.offsetHeight;
						} */
						if(cell.tagName=="LI")
							this.hScrollDiv.scrollLeft = 0;
						else
						{	if(this.hScrollDiv)
								this.hScrollDiv.scrollLeft=this.leftBodyDiv.offsetWidth+cell.offsetLeft+ cell.offsetWidth ;
						}
				}

			},

			createFrame : function(){
				var self=this, body=document.body;

				if (!body || !body.firstChild) {
					setTimeout( function() { self.createFrame(); }, 50 );
					return;
				}
                var div = document.getElementById("yui_ddproxy");

				if (!div) {
					div    = document.createElement("div");
					div.id = "yui_ddproxy";
					var s  = div.style;

					s.position   = "absolute";
					s.visibility = "hidden";
					s.display	 = "none";
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
						ifr.setAttribute('src', 'blank.html');
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

			synchScrollsWithModal : function()
			{

				var index=this.getActiveRowIndex();
				if(this.bFilteredGrid) {
                    var currentDOM = pega.util.Dom.getElementsById(pega.ui.property.toHandle(this.propRef), this.rightBodyTbl, "TR");
					if(currentDOM){
						var currentIndex = currentDOM[0].rowIndex;
					}
				}
				/* BUG-157597: Trigger little bit of scroll if the last loaded row is focused, ensures fetching of next set of records */
				var scrollDown = (this.getModalAction() === "NEXT" || (currentIndex && index - currentIndex === 1)) || (this.getModalAction() === "JUMP" && index == this.getLastRowIndex());
				var scrollUp = (this.getModalAction() === "PREV" || (currentIndex && index - currentIndex === -1)) || (this.getModalAction() === "JUMP" && index == this.getFirstLoadedRowIndex());

				if(index && this.rightBodyTbl){
					var srcEl = this.rightBodyTbl.rows[this.getIndex(index)];
					if(srcEl) {
						if(this.vScrollDiv) {
							if(scrollDown) {
								this.vScrollDiv.scrollTop += srcEl.offsetHeight;
							}
							else if(scrollUp) {
								this.vScrollDiv.scrollTop -= srcEl.offsetHeight;
							}

						}else if(this.bFixedHeight) {
							if(this.fixedRow) {
								if(scrollDown) {
									this.layoutWrapperDiv.scrollTop += srcEl.offsetHeight;
								}
								else if(scrollUp) {
									this.layoutWrapperDiv.scrollTop -= srcEl.offsetHeight;
								}

							}else {
								if(scrollDown) {
									this.gridcontDiv.scrollTop += srcEl.offsetHeight;
								}
								else if(scrollUp) {
									this.gridcontDiv.scrollTop -= srcEl.offsetHeight;
								}

							}
						}
					} else if (this.bDiscardInvisibleRows) {
						if (scrollDown) {
							this.layoutWrapperDiv.scrollTop += this.rowHeight;
						} else if (scrollUp) {
							this.layoutWrapperDiv.scrollTop -= this.rowHeight;
						}
					}
				}

			},
			synchScrollH : function(e) {
				/* in Safari < 4 versions scroll Events gets fired unnecessarily causing slow script Error */
				if(pega.env.ua.webkit && pega.env.ua.webkit<=525.28){ //
					if(window.scrollVEle || window.scrollHEle) {
						return;
					}
					var srcEl = Event.getTarget(e);
					window.scrollHEle = srcEl;
					setTimeout(function(){ window.scrollHEle=null;}, 0);
				}

				var srcEl = Event.getTarget(e);
				if(pega.env.ua.gecko && pega.env.ua.gecko<1.9 &&!this.fixedCol) //FF version 3 value is  1.9
					this.rightBodyDiv.style.width="auto";

				var rightEle= this.rightBodyDiv.style.width != "" ? this.rightBodyDiv : this.gridcontDiv;
				var scrollables = [rightEle, this.rightHeaderDiv, this.hScrollDiv];
				for(var i=0; i<scrollables.length; i++) {
					if(scrollables[i]) {
						if(srcEl != scrollables[i]) {
							scrollables[i].scrollLeft = srcEl.scrollLeft;
						}
					}
				}


			},
			synchScrollHeader : function(e) {
				var srcEl = Event.getTarget(e);
              	/*BUG-254055 :synch body scrollleft with header*/
              	if(e.target.id == "gridHeaderDiv"){
                  this.layoutWrapperDiv.scrollLeft=e.target.scrollLeft;
                }
                else{
                var headerDiv = pega.util.Dom.getElementsById("gridHeaderDiv", this.gridcontDiv)[0];
                headerDiv.scrollLeft = srcEl.scrollLeft;}
			},
			synchScrollV : function(e) {

				/* in Safari < 4 versions scroll Events gets fired unnecessarily causing slow script Error */
				if( pega.env.ua.webkit && pega.env.ua.webkit<=525.28){
					if(window.scrollVEle || window.scrollHEle) {
						return;
					}
					var srcEl = Event.getTarget(e);
					window.scrollVEle = srcEl;
					setTimeout(function(){ window.scrollVEle=null;}, 0);
				}

				var srcEl = Event.getTarget(e);
				var rightEle= this.rightBodyDiv.style.height != "" ? this.rightBodyDiv : this.gridcontDiv;
				var scrollables = [rightEle, this.leftBodyDiv, this.vScrollDiv];
				for(var i=0; i<scrollables.length; i++) {
					if(scrollables[i]) {
						if(srcEl != scrollables[i]) {
							scrollables[i].scrollTop = srcEl.scrollTop;
						}
					}
				}

			},

			/*
			@private - sets the dimension and position of horizontal scrollbar for the grid
			@return $void$
			*/
			setHScrollDim : function() {
				/*BUG-136755 Changed the method of finding the grid layout table to fix the issue (old method : Dom.getFirstChild(this.gridcontDiv); */
                this.gridTbl = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
				if(this.gridcontDiv.style.width != "")
					this.hScrollDiv.style.width = this.gridcontDiv.offsetWidth + "px";
				else
					this.hScrollDiv.style.width = this.gridTbl.offsetWidth + "px";

				var width = this.rightBodyDiv.scrollWidth;
				if(this.leftBodyDiv) {
				 if (this.leftBodyDiv.offsetWidth) width += this.leftBodyDiv.offsetWidth;
				 else {
				  var leftWidth = this.leftBodyDiv.style.width.split("px")[0];
				  if (leftWidth && parseInt(leftWidth)) width += parseInt(leftWidth);
				 }
				}
				this.hScrollCont.style.width = width + "px";
				if (this.fixedCol && !this.fixedRow && this.gridcontDiv.style.height != "") {
					this.hScrollDiv.style.top = (this.gridcontDiv.offsetTop + this.gridcontDiv.offsetHeight) + "px";
				} else {
					/* subtracting 20px as a dummy div with height 20px has
					   been appended to gridCont div to cover the space of custom scroll bar*/
					this.hScrollDiv.style.top = (this.gridcontDiv.offsetTop + this.gridcontDiv.offsetHeight - 20) + "px";
				}
				this.hScrollDiv.style.left = "0px";
				this.hScrollDiv.style.overflowX = (this.hScrollDiv.scrollWidth > this.hScrollDiv.offsetWidth) ? "scroll" : "auto";
			},

			/*
			@private - sets the dimension and position of vertical scrollbar for the grid
			@return $void$
			*/
			setVScrollDim : function() {
				/*BUG-136755 Changed the method of finding the grid layout table to fix the issue (old method : Dom.getFirstChild(this.gridcontDiv); */
                this.gridTbl = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
				if(this.gridcontDiv.style.height != "")
					this.vScrollDiv.style.height = this.gridcontDiv.offsetHeight + "px";
				else
					this.vScrollDiv.style.height = this.gridTbl.offsetHeight + "px";

				if(this.bTreegrid)
					var height=this.leftBodyUL.scrollHeight
				else
					var height = this.rightBodyDiv.scrollHeight;
				if(this.rightHeaderDiv)
					height += this.rightHeaderDiv.offsetHeight;
				if(this.editConfig == "harness" && !this.pyTargetSection){
					height += this.gridDetailsDiv.offsetHeight;
				}


				this.vScrollCont.style.height = height + "px";
				this.vScrollDiv.style.top =this.gridcontDiv.offsetTop + "px";

				if(this.gridcontDiv.style.width != "") {
					this.vScrollDiv.style.left =  this.gridcontDiv.offsetWidth + "px";
				} else {
					this.vScrollDiv.style.left =this.gridTbl.offsetWidth + "px";
				}
				this.vScrollDiv.style.overflowY = (this.vScrollDiv.scrollHeight > this.vScrollDiv.offsetHeight) ? "scroll" : "auto";
			},

			/*
			@private - gets invoked when content of the grid is resized. It repositions the scrollbars
			@return $void$
			*/
			gridResized : function(fromModal) {
				if(this.fixedCol) {
					if(this.rightBodyDiv.style.width != "" || this.gridcontDiv.style.width != "") {
						this.setHScrollDim();
					}
					if(this.rightBodyDiv.style.height != "" || this.gridcontDiv.style.height!= "") {
						this.setVScrollDim();
					}
				}else {
					var gridTable = Dom.getElementsById("gridLayoutTable",this.gridcontDiv);
					if(gridTable && gridTable.length > 0) {
						this.gridTbl = gridTable[0];
					}
					/*BUG-165814: HFix-9824 - Changing the if to replace "this.bFixedWidth" with (this.gridcontDiv.style.width != "") as it is not populated at this point*/
					if(this.bFixedHeight && !(this.gridcontDiv.style.width != "") && !Dom.hasClass(this.gridcontDiv,"gPercent") && this.gridTbl.offsetWidth>0) {
						// BUG-81101 - START
						var contentWidth = this.gridTbl.offsetWidth+this.getScrollbarWidth();
						/*BUG-107627: Added this.bTreegrid to condition*/
						if(this.bPXFixed && (this.bTree || this.bTreegrid) && this.layoutWrapperDiv && this.layoutWrapperDiv.style.width) {
							var wrapperWidth = parseInt(this.layoutWrapperDiv.style.width, 10);
							if(contentWidth < wrapperWidth) {
								contentWidth = wrapperWidth;
							}
						}
						// BUG-81101 - END
						if((!this.bResponsiveGrid || !this.isInFatList()) && this.pageMode!="Progressive Load") {/* BUG-146279: Added condition for "Progressive Load" */
							this.gridcontDiv.style.width = contentWidth+"px";
						}
					}
					else if(this.bFixedWidth && !this.bFixedHeight) {
						this.gridcontDiv.style.height = this.gridTbl.offsetHeight+this.getScrollbarWidth()+"px";
					}
				}
        
        if (this.bTreegrid && !pega.u.d.DISABLE_TREEGRID_HEIGHT_ADJUSTMENT) {
          this.updateTreeGridRowHeight();
        }
        
				pegaUD.resizeHarness();
				if(fromModal)
					this.synchScrollsWithModal();
			},

			/*
			@private  returns the width of scrollbars.
			@return $void$
			*/
			getScrollbarWidth : function() {
				if(!pega.ui.scrollBarWidth) {
					var scrollDimensionsCheckDiv = document.createElement("div");
					scrollDimensionsCheckDiv.style.visibility = "hidden";
					scrollDimensionsCheckDiv.style.width = "100px";
					scrollDimensionsCheckDiv.style.height = "100px";
					scrollDimensionsCheckDiv.style.overflow = "scroll";
					document.body.appendChild(scrollDimensionsCheckDiv);
					pega.ui.scrollBarWidth = scrollDimensionsCheckDiv.offsetWidth - scrollDimensionsCheckDiv.clientWidth + 1;
					document.body.removeChild(scrollDimensionsCheckDiv);
					/* BUG-143461: Proper scrollbar width calculation for Chrome custom scrollbar */
					if(pega.ui.scrollBarWidth == 1) {
						var db = document.body;
						var prevOverflow = db.style.overflow;
						db.style.overflow = 'hidden';
						var scrollBarWidth = db.clientWidth;
						db.style.overflow = 'scroll';
						scrollBarWidth -= db.clientWidth;
						if(!scrollBarWidth) { scrollBarWidth = db.offsetWidth - db.clientWidth };
						db.style.overflow = prevOverflow;
						pega.ui.scrollBarWidth = scrollBarWidth + 1;
					}
				}
				return pega.ui.scrollBarWidth;
			},

			/*
			@private initailizes row and column resize.
			@return $void$
			*/
			createResizables: function() {
				/* Enable resize only for Data-Grid for now */
				if(this.bGrid == true) {
					var bRowResize = false;
					var bColumnResize = false;
					/* intersect table is the table whose cells have both row and column resize */
					if(this.leftHeaderTbl){
					//	this.intersectTbl = this.leftHeaderTbl;
						bColumnResize = (this.rightBodyTbl.getAttribute("bColumnResize") == "true");
						if(!this.bTreegrid){
							bRowResize = (this.rightBodyTbl.getAttribute("bRowResize") == "true");
						}
					}
					else if(this.leftBodyUL){
					//	this.intersectTbl = this.leftBodyUL;
						bRowResize = (this.leftBodyUL.getAttribute("bRowResize") == "true");
						bColumnResize = (this.rightBodyTbl.getAttribute("bColumnResize") == "true");
					}
					else  if(this.rightHeaderTbl){
						//this.intersectTbl = this.rightHeaderTbl;
          }
					else {
						//this.intersectTbl = this.rightBodyTbl;
						bRowResize = (this.rightBodyTbl.getAttribute("bRowResize") == "true");
						bColumnResize = (this.rightBodyTbl.getAttribute("bColumnResize") == "true");
					}
					this.bRowResize = bRowResize;
					if(((Dom.hasClass(this.gridcontDiv,"gPercent") == false && Dom.hasClass(this.gridcontDiv,"gPXAuto") == false) || this.bTreegrid) && bRowResize ) {
						this.createRowResize();
					}
					if(bColumnResize)
						this.createColumnResize();
				}
			},

			/*
			@private attach row resize handlers.
			@return $void$
			*/
			createRowResize: function() {
				if(this.repeatType == this.COL_REPEAT) {
					if(this.leftHeaderTbl) {
						Event.addListener(this.leftHeaderTbl,"mouseover", this.intRowResize,this.leftHeaderTbl, this );
						Event.addListener(this.leftBodyUL,"mouseover", this.intRowResize, this.leftBodyUL, this );
					} else{
						if(this.rightHeaderTbl){
							Event.addListener(this.rightHeaderTbl,"mouseover", this.intRowResize, this.rightHeaderTbl, this );
						}
						Event.addListener(this.rightBodyTbl,"mouseover", this.intRowResize, this.rightBodyTbl, this);
					}
				} else  {
						if(this.fixedCol || this.bTreegrid){
							if(this.leftHeaderTbl) {
								Event.addListener(this.leftHeaderTbl, "mouseover", this.intRowResize, this.leftHeaderTbl, this);
							}
							Event.addListener(this.leftBodyUL, "mouseover", this.intRowResize, this.leftBodyUL, this);
						}else{
							if(this.rightHeaderTbl) {
								Event.addListener(this.rightHeaderTbl, "mouseover", this.intRowResize, this.rightHeaderTbl, this);
							}
							Event.addListener(this.rightBodyTbl, "mouseover", this.intRowResize, this.rightBodyTbl, this);
						}
				}
			},

			/*
			@private initializes row resize -> users YUI resize.
			@param $undefined$event– parameter description goes here.
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			intRowResize : function(event, tbl) {
				var cell = this.findCell(event,tbl);
				if(!cell) {
					return;
				}
				var eSource;
				if(this.bTreegrid && Dom.isAncestor(this.leftBodyUL, cell)) {
					cell = cell.parentNode;
					eSource = cell;
				} else {
					if(!Dom.hasClass(cell,"rowResize")) {
						return;
					}
					eSource = Dom.getFirstChild(cell);
					if(!eSource) {
						return;
					}
				}
				var cellIndex = this.getCellIndex(cell);

				/*attach row resize to the cells in the 1st column of the table whose height is > 0 */
				if(cellIndex == 0) {
					if(eSource.getAttribute("resizable") != "true" || (eSource.getAttribute("resizable")=="true" && eSource.getAttribute("resizeType") == "col")) {
						eSource.setAttribute("resizable", "true");
						if(eSource.getAttribute("resizeType") == "col") {
							eSource.setAttribute("resizeType", "both");
						} else {
							eSource.setAttribute("resizeType", "row");
						}
						this.attachRowResize(eSource,tbl);
					}
				}
			},

			/*
			@private attaches row resize
			@param $undefined$cell– parameter description goes here.
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			attachRowResize : function(cell,tbl) {
				if(pega.env.ua.ie && cell.tagName != "UL") {
					cell = cell.parentNode;
				}
				if(cell.parentNode.tagName == "LI" && cell.tagName != "UL") {
					cell = cell.parentNode;
				}
				var resize = new pega.util.Resize(cell, {
					hover: false,
					handles: ['b'],
					minHeight: 6, // This should be >= padding-top of divCont
					hiddenHandles: true,
					setSize:false
				});
				resize.on("resize",this.doRowResize, [cell, this, tbl]);
			},

			/*
			@Handler
			@private resizes the cell
			@param $undefined$eSourceEle– parameter description goes here.
			@return $void$
			*/
			doRowResize : function(e, eSourceEle) {

				var obj = eSourceEle[1];
				var tbl = eSourceEle[2];
				eSourceEle = eSourceEle[0];
				var newHeight = e.height;

				if(!pega.env.ua.ie && (eSourceEle.tagName == "TD" || eSourceEle.tagName == "TH")) {
					eSourceEle = Dom.getFirstChild(eSourceEle);
				}

				if(obj.rightBodyTbl) {//TASK-116719: Reset e.height if it is < offsetHeight
					var firstCellChild = obj.rightBodyTbl.rows[obj.getRowIndex(Dom.getFirstChild(eSourceEle))].cells[1];
					firstCellChild && (firstCellChild = firstCellChild.getElementsByTagName("nobr"));
					if(firstCellChild && firstCellChild.length > 0 && e.height < firstCellChild[0].offsetHeight + 2) {
						e.height = firstCellChild[0].offsetHeight + 2; //TASK-116722: +2 to make sure resize is always avaliable
						newHeight = e.height;
					}
				}

				if(e.target) {
					obj.activeResize = e.target;
				}

				if(!e.type) {
					eSourceEle.style.height = newHeight + "px";
				}

				if(!obj.bTreegrid && !obj.fixedCol && pega.env.ua.ie) {
					if(Dom.getFirstChild(eSourceEle)) {
						var curInd = obj.getRowIndex(Dom.getFirstChild(eSourceEle));
						if(obj.rightBodyTbl && !obj.fixedRow) {
							for(var i=0; i<obj.rightBodyTbl.rows[curInd].cells.length; i++) {
								obj.rightBodyTbl.rows[curInd].cells[i].style.height = e.height + "px";
							}
						}
					}
				} else if(obj.rightBodyTbl && Dom.isAncestor(obj.rightBodyTbl, eSourceEle)) {
					eSourceEle.parentNode.style.height = newHeight + "px";
					for(var i=0; i<eSourceEle.parentNode.parentNode.cells.length; i++) {
						eSourceEle.parentNode.parentNode.cells[i].style.height = newHeight + "px";
						if (pega.env.ua.gecko){
                                                   	eSourceEle.parentNode.parentNode.cells[i].style.lineHeight = newHeight + "px";
                                                        }
						/*if(pega.env.ua.webkit) {
							if(Dom.hasClass(Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]), "oflowDivM")) {
								Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]).style.maxHeight = newHeight + 'px';
							} else {
								Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]).style.height = newHeight + "px";
							}
						}*/
						if(pega.env.ua.webkit) {
							Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]).style.maxHeight = newHeight + "px";
						}
					}
				} else if(obj.rightHeaderTbl && Dom.isAncestor(obj.rightHeaderTbl, eSourceEle)) {
					if(!pega.env.ua.ie) {
						eSourceEle.parentNode.style.height = newHeight + "px";
						for(var i=0; i<eSourceEle.parentNode.parentNode.cells.length; i++) {
							eSourceEle.parentNode.parentNode.cells[i].style.height = newHeight + "px";
							if(pega.env.ua.webkit) {
								Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]).style.height = newHeight + "px";
							}
						}
					}
				} else if(obj.leftHeaderTbl && Dom.isAncestor(obj.leftHeaderTbl, eSourceEle)) {
					if(!pega.env.ua.ie) {
						eSourceEle.parentNode.style.height = newHeight + "px";
						for(var i=0; i<eSourceEle.parentNode.parentNode.cells.length; i++) {
							eSourceEle.parentNode.parentNode.cells[i].style.height = newHeight + "px";
							if(pega.env.ua.webkit) {
								Dom.getFirstChild(eSourceEle.parentNode.parentNode.cells[i]).style.height = newHeight + "px";
							}
						}
					} else {
						for(var i=0; i<eSourceEle.parentNode.cells.length; i++) {
							eSourceEle.parentNode.cells[i].style.height = newHeight + "px";
						}
					}
					if(obj.rightHeaderTbl) {
						for(var i=0; i<obj.rightHeaderTbl.rows[0].cells.length; i++) {
							obj.rightHeaderTbl.rows[0].cells[i].style.height = newHeight + "px";
							if(pega.env.ua.webkit) {
								Dom.getFirstChild(obj.rightHeaderTbl.rows[0].cells[i]).style.height = newHeight + "px";
							}
						}
					}
				} else if(obj.leftBodyUL && Dom.isAncestor(obj.leftBodyUL, eSourceEle)) {
					if(eSourceEle.tagName == "LI") {
						eSourceEle.parentNode.style.height = newHeight + "px";
						if(!pega.env.ua.ie) {
							Dom.getFirstChild(eSourceEle).style.height = newHeight + "px";
							if(Dom.hasClass(eSourceEle, "headerCell")) {
								Dom.getFirstChild(Dom.getFirstChild(eSourceEle)).style.height = newHeight + "px";
							}
						}
						if(Dom.getNextSibling(eSourceEle) && Dom.getNextSibling(eSourceEle).tagName == "LI") {
							Dom.getNextSibling(eSourceEle).style.height = newHeight + "px";
							if(!pega.env.ua.ie) {
								Dom.getFirstChild(Dom.getNextSibling(eSourceEle)).style.height = newHeight + "px";
								if(Dom.hasClass(eSourceEle, "headerCell")) {
									Dom.getFirstChild(Dom.getFirstChild(Dom.getNextSibling(eSourceEle))).style.height = newHeight + "px";
								}
							}
						}
						if(obj.rightBodyTbl) {
							var curInd = obj.getRowIndex(eSourceEle);
							for(var i=0; i<obj.rightBodyTbl.rows[curInd].cells.length; i++) {
								obj.rightBodyTbl.rows[curInd].cells[i].style.height = e.height + "px";
								if(pega.env.ua.webkit) {
									Dom.getFirstChild(obj.rightBodyTbl.rows[curInd].cells[i]).style.maxHeight = newHeight + "px";
								}
							}
							if(!pega.env.ua.ie) {
								if(obj.rightBodyTbl.rows[curInd].cells[0] && obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight > eSourceEle.offsetHeight) {
									for(var i=0; i<obj.rightBodyTbl.rows[curInd].cells.length; i++) {
										obj.rightBodyTbl.rows[curInd].cells[i].style.height = (e.height - (obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight - eSourceEle.offsetHeight)) + "px";
										if(pega.env.ua.webkit) {
											Dom.getFirstChild(obj.rightBodyTbl.rows[curInd].cells[i]).style.maxHeight = e.height - (obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight - eSourceEle.offsetHeight) + 'px';
										}
									}
								}
							}
							var rightHeight = obj.rightBodyTbl.rows[curInd].offsetHeight;
							var leftHeight = eSourceEle.parentNode.offsetHeight;
							if(rightHeight > leftHeight || (obj.bTreegrid && !obj.bTree)){
								if(pega.env.ua.ie && (obj.bTreegrid && !obj.bTree)){
									eSourceEle.style.height = rightHeight + "px";
								}
								eSourceEle.parentNode.style.height = rightHeight + "px";
								if(Dom.getNextSibling(eSourceEle) && Dom.getNextSibling(eSourceEle).tagName == "LI") {
									Dom.getNextSibling(eSourceEle).style.height = rightHeight + "px";
								}
							}
						}
						//return;
					}

					if(eSourceEle.tagName == "UL") {
						Dom.getFirstChild(eSourceEle).style.height = newHeight + "px";
						if(!pega.env.ua.ie) {
							Dom.getFirstChild(Dom.getFirstChild(eSourceEle)).style.height = newHeight + "px";
							if(Dom.hasClass(eSourceEle, "headerRowContent")) {
								Dom.getFirstChild(Dom.getFirstChild(Dom.getFirstChild(eSourceEle))).style.height = newHeight + "px";
							}
						}
						Dom.getNextSibling(Dom.getFirstChild(eSourceEle)).style.height = newHeight + "px";
						if(!pega.env.ua.ie) {
							Dom.getFirstChild(Dom.getNextSibling(Dom.getFirstChild(eSourceEle))).style.height = newHeight + "px";
							if(Dom.hasClass(eSourceEle, "headerRowContent")) {
								Dom.getFirstChild(Dom.getFirstChild(Dom.getNextSibling(Dom.getFirstChild(eSourceEle)))).style.height = newHeight + "px";
							}
						}
						if(obj.rightBodyTbl) {
							var curInd = obj.getRowIndex(Dom.getFirstChild(eSourceEle));
							for(var i=0; i<obj.rightBodyTbl.rows[curInd].cells.length; i++) {
								obj.rightBodyTbl.rows[curInd].cells[i].style.height = e.height + "px";
                                if(pega.env.ua.ie) {
                                	obj.rightBodyTbl.rows[curInd].cells[i].style.lineHeight = e.height + "px";
                                }
                                /*if(pega.env.ua.ie) {
									break;
								}*/
								if(pega.env.ua.webkit) {
									Dom.getFirstChild(obj.rightBodyTbl.rows[curInd].cells[i]).style.maxHeight = e.height + "px";
								}
							}
							if(!pega.env.ua.ie) {
								if(obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight > eSourceEle.offsetHeight) {
									for(var i=0; i<obj.rightBodyTbl.rows[curInd].cells.length; i++) {
										obj.rightBodyTbl.rows[curInd].cells[i].style.height = (e.height - (obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight - eSourceEle.offsetHeight)) + "px";
										if(pega.env.ua.webkit) {
											Dom.getFirstChild(obj.rightBodyTbl.rows[curInd].cells[i]).style.maxHeight = e.height - (obj.rightBodyTbl.rows[curInd].cells[0].offsetHeight - eSourceEle.offsetHeight) + 'px';
										}
									}
								}
							}
							var rightHeight = obj.rightBodyTbl.rows[curInd].offsetHeight;
							var leftHeight = Dom.getFirstChild(eSourceEle).offsetHeight;
							if(rightHeight > leftHeight || (obj.bTreegrid && !obj.bTree)){
								if(pega.env.ua.ie && (obj.bTreegrid && !obj.bTree)){
									eSourceEle.style.height = rightHeight + "px";
								}
								Dom.getFirstChild(eSourceEle).style.height = rightHeight + "px";
								Dom.getNextSibling(Dom.getFirstChild(eSourceEle)).style.height = rightHeight + "px";
							}
						}
						//return;
					}
				}

				obj.gridResized();

				return;

			},

			/*
			@private create column resize
			@return $void$
			*/
			createColumnResize: function() {
				if(this.repeatType == this.ROW_REPEAT) {
					if(this.leftHeaderTbl) {
						Event.addListener(this.leftHeaderTbl,"mouseover", this.intColResize,[this,this.leftHeaderTbl] );
						if(this.rightHeaderTbl){
							Event.addListener(this.rightHeaderTbl,"mouseover", this.intColResize,[this,this.rightHeaderTbl] ) ;
						}
					} else {
						if(this.bTreegrid || this.fixedCol) {
							Event.addListener(this.leftBodyUL,"mouseover", this.intColResize,[this,this.leftBodyUL] );
						}
						Event.addListener(this.rightBodyTbl,"mouseover", this.intColResize,[this,this.rightBodyTbl] );
					}
				} else  {
					if(this.leftHeaderTbl) {
						Event.addListener(this.leftHeaderTbl, "mouseover", this.intColResize,[this,this.leftHeaderTbl] );
					}
					if(this.rightHeaderTbl){
						Event.addListener(this.rightHeaderTbl, "mouseover", this.intColResize,[this,this.rightHeaderTbl] );
					}
				}

			},

			/*
			@private init col resize
			@param $undefined$event– parameter description goes here.
			@param $undefined$args– parameter description goes here.
			@return $void$
			*/
			intColResize : function (event, args) {

				var obj = args[0];
				var tbl = args[1];
				var cell = obj.findCell(event,tbl);
				if(!cell || !Dom.hasClass(cell,"colResize"))
					return;
				var eSource = Dom.getFirstChild(cell);
				if(!eSource)
					return;
				/*if(obj.getCellIndex(cell) == 0 )
					return;*/
				if((obj.bDragDrop || obj.bNumberedSkin) &&((typeof(cell.cellIndex) == "number" && cell.cellIndex == 0 && obj.leftHeaderTbl && Dom.isAncestor(obj.leftHeaderTbl, cell)) || (obj.getCellIndex(cell) == 0 && cell.tagName != "TD" && cell.tagName != "TH")))
					return;
				/*attach column resize to the cells in the first row and which have width > 0*/
				if(obj.getRowIndex(cell) == 0) {
					/* col resize gets called  first in case of IE then row resize its reverse in case of  FF /Safari
						so below or condition is added when first col has both col and row resized enabled */
					if(eSource.getAttribute("resizable")!="true" || (eSource.getAttribute("resizable")=="true" && eSource.getAttribute("resizeType") == "row")) {
						eSource.setAttribute("resizable", "true");
						if(eSource.getAttribute("resizeType") == "row") {
							eSource.setAttribute("resizeType", "both");
						} else {
							eSource.setAttribute("resizeType", "col");
						}
						obj.attachColResize(eSource,tbl);
					}
				}
				if(obj.leftHeaderTbl && tbl == obj.leftHeaderTbl && obj.leftHeaderTbl.rows[0].cells[0].style.width == "") {
					var origOffsetWidth = obj.leftHeaderTbl.rows[0].cells[0].offsetWidth;
					obj.leftHeaderTbl.rows[0].cells[0].style.width = obj.leftHeaderTbl.rows[0].cells[0].offsetWidth + "px";
					if(obj.leftHeaderTbl.rows[0].cells[0].offsetWidth > origOffsetWidth) {
						obj.leftHeaderTbl.rows[0].cells[0].style.width = (obj.leftHeaderTbl.rows[0].cells[0].offsetWidth - (obj.leftHeaderTbl.rows[0].cells[0].offsetWidth - origOffsetWidth)) + "px";
					}
					if(parseInt(obj.leftHeaderTbl.rows[0].cells[0].style.width)==0) {
						Dom.addClass(obj.leftHeaderTbl.rows[0].cells[0], "hiddenCell");
					}
				}
			},

			/*
			@private attach Col resize
			@param $undefined$cell– parameter description goes here.
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			attachColResize : function (cell,tbl) {
				if(pega.env.ua.ie && cell.tagName != "UL") {
					cell = cell.parentNode;
				}
				if(cell.parentNode.tagName == "LI" && cell.tagName != "UL") {
					cell = cell.parentNode;
				}
				var resize = new pega.util.Resize(cell, {
					hover: false,
					hiddenHandles: true,
					handles: ['r'],
					minWidth: 40,
					setSize:false
				});
				resize.on("resize",this.doColResize, [cell,this, tbl]);
				resize.on("endResize",this.saveColumnWidth, [cell,this]);
				resize.on("startResize",this.startColResize, [cell,this, tbl]);
			},

			saveColumnWidth: function(e, eSourceEle) {
				var obj = eSourceEle[1];
				eSourceEle = eSourceEle[0];
				var newWidth = e.width;
				var newPercentWidth = (newWidth*100)/(obj.rightBodyTbl.offsetWidth);
				if(Dom.hasClass(obj.gridcontDiv,"gPercent") == true){
					newWidth = newPercentWidth;
					obj.syncColwidthOnColResize();
				}
				var gPropIndex = obj.gridcontDiv.getAttribute("gPropIndex");
				if((obj.leftBodyUL && Dom.isAncestor(obj.leftBodyUL, eSourceEle)) || (obj.leftHeaderTbl && Dom.isAncestor(obj.leftHeaderTbl, eSourceEle))) {
                    var cwc = pega.util.Dom.getElementsById(gPropIndex + "colWidthGBL", obj.gridcontDiv, "INPUT");
					if(cwc) {
						cwc = cwc[0];
						if(Dom.hasClass(obj.gridcontDiv,"gPercent") == true)
							cwc.value = parseInt(obj.leftBodyDiv.offsetWidth);
						else
							cwc.value = parseInt(obj.leftBodyDiv.style.width);
					}
                    cwc = pega.util.Dom.getElementsById(gPropIndex + "colWidthCache" + ((obj.bTreegrid && obj.fixedRow) ? 2 : 1), obj.gridcontDiv, "INPUT");
					if(cwc) {
						cwc = cwc[0];
						cwc.value = newWidth;
					}
				} else {
                    var cwc = pega.util.Dom.getElementsById(gPropIndex + "colWidthGBR", obj.gridcontDiv, "INPUT");
					if(cwc) {
						cwc = cwc[0];
						if(Dom.hasClass(obj.gridcontDiv,"gPercent") == true)
							cwc.value = parseInt(obj.rightBodyTbl.offsetWidth);
						else
							cwc.value = parseInt(obj.rightBodyTbl.style.width);
					}
                    cwc = pega.util.Dom.getElementsById(gPropIndex + "colWidthCache" + (obj.getCellIndex((pega.env.ua.ie) ? eSourceEle : eSourceEle.parentNode) + (obj.bTreegrid ? 2 : ((obj.bDragDrop && !obj.fixedCol) ? 0 : 1))), obj.gridcontDiv, "INPUT");
					if(cwc) {
						cwc = cwc[0];
						cwc.value = newWidth;
					}
					/*TASK-116702: Save newly computed % width for all the columns*/
					if(obj.rightBodyTbl){
						var percentTable = obj.rightBodyTbl.width;
						if(percentTable == "")
							percentTable = obj.rightBodyTbl.style.width;
						var isPercentWidth = false;
						if(percentTable && percentTable.indexOf("%") != -1)
							isPercentWidth = true;
						if(isPercentWidth){
							var celIndex = obj.getCellIndex((pega.env.ua.ie)?eSourceEle:eSourceEle.parentNode);
							var firstHeaderRowCells = obj.rightBodyTbl.rows[0].cells;
							var firstHeaderRowCellsLen = firstHeaderRowCells.length;
							var averageWidthForOtherColumns = (100 - newWidth)/(firstHeaderRowCellsLen-2);
							for(var j= 1;j < firstHeaderRowCellsLen;j++) {
								if(celIndex !=j){
                                    cwc = pega.util.Dom.getElementsById(gPropIndex + "colWidthCache" + ((obj.bTreegrid ? 2 : ((obj.bDragDrop && !obj.fixedCol) ? 0 : 1)) + j), obj.gridcontDiv, "INPUT");
									if(cwc) {
										cwc = cwc[0];
										cwc.value = averageWidthForOtherColumns;
									}
								}
							}
						}
					}
				}
				obj.setHeadersWidth();
				/*BUG-80994*/
				if(!obj.fixedRow && obj.fixedCol && Dom.hasClass(obj.gridcontDiv,"gPXFixed") == true){
					var dataRowCells = obj.rightBodyTbl.rows;
					var LIs= Dom.getChildren(obj.leftBodyUL);
					for(var i = 1; i < LIs.length; i++) {
						var dataRowOffsetHeight = dataRowCells[i].cells[1].offsetHeight + "px";
						LIs[i].style.height = dataRowOffsetHeight;
						Dom.getFirstChild(LIs[i]).style.height = dataRowOffsetHeight;
						Dom.getFirstChild(Dom.getFirstChild(LIs[i])).style.height = dataRowOffsetHeight;
					}
				}
				obj.gridResized();
			},

			syncColwidthOnColResize: function() {
				/* BUG-208193- updated function to update columns width on completion of resize */
				if(Dom.hasClass(this.gridcontDiv,"gPercent") == true && this.rightBodyTbl && this.rightHeaderTbl){
					var greaterColWidths = [], i = 0;
                  	if(this.bTreegrid || this.bNumberedSkin || this.bShowExpandCollapseColumn)  i=1;
					if((this.bNumberedSkin || this.bDragDrop) && this.bShowExpandCollapseColumn) { // BUG-81102: If (rowNumbering or rowReorder) and expandPane are enabled start from 2nd col
								i = 2;
					}
					for(; i < this.rightHeaderTbl.rows[0].cells.length-1; i++) {
						this.rightBodyTbl.rows[0].cells[i].firstChild.style.width = "";
						this.rightHeaderTbl.rows[0].cells[i].firstChild.style.width = "";
						var bodyCellWidth = this.rightBodyTbl.rows[0].cells[i].offsetWidth,
						headerCellWidth = this.rightHeaderTbl.rows[0].cells[i].firstChild.offsetWidth;
						if(bodyCellWidth < headerCellWidth) {
							bodyCellWidth = headerCellWidth;
						}
						greaterColWidths[i] = bodyCellWidth;
					}
					for(var i = 0; i < this.rightHeaderTbl.rows[0].cells.length-1; i++) {
						bodyCellWidth = (greaterColWidths[i] * 100) / this.rightHeaderTbl.offsetWidth + "%";
						this.rightBodyTbl.rows[0].cells[i].style.width = bodyCellWidth;
						this.rightHeaderTbl.rows[0].cells[i].style.width = bodyCellWidth;
					}
                    if(this.scrollHeadAdded){
                    var LastColumnIndex=this.rightHeaderTbl.rows[0].cells.length-1;
                    this.rightHeaderTbl.rows[0].cells[LastColumnIndex].style.width=this.getScrollbarWidth()+"px";
                    }
				}
			},

			/**
				This method returns true if the display of this.rightBodyTbl is block. "block" is set to this.rightBodyTbl in CSS for responsive grids which turn into FatList.
			*/
			isInFatList: function() {
				if(this.bResponsiveGrid && pega.u.d.inStandardsMode){
					var displayValue = this.rightBodyTbl.currentStyle ? (this.rightBodyTbl.currentStyle.display) : (window.getComputedStyle ? (window.getComputedStyle(this.rightBodyTbl, "") ? window.getComputedStyle(this.rightBodyTbl, "").display : this.rightBodyTbl.style.display) : this.rightBodyTbl.style.display);
					return displayValue == "block";
				}else{
					return false;
				}
			},

			isColumnsDropped: function() {
				if(this.rightBodyTbl.rows.length > 1) {
					var dataRowCells = this.rightBodyTbl.rows[this.rightBodyTbl.rows.length - 1].cells;
					if(this.pageMode == "Progressive Load" && !this.bDiscardInvisibleRows) {
						for(var j = 0; j < this.rightBodyTbl.rows.length; j++) {
							if(this.rightBodyTbl.rows[j].hasAttribute("oaargs")) {
								dataRowCells = this.rightBodyTbl.rows[j].cells;
								break;
							}
						}

					}
					for(var i = 0; i < dataRowCells.length; i++) {
						var cell = dataRowCells[i];
						if(cell.getAttribute("data-importance") == "other") {
							var cellDisplay = cell.currentStyle ? cell.currentStyle.display : window.getComputedStyle ? window.getComputedStyle(cell, "").display : cell.style.display;
							if(cellDisplay == "none") {
								return true;
							}
						}
					}
				}

			},

			/**
				Depending on the mode(normallist|fatlist) of the grid required APIs are invoked to properly align grid.
			*/
			callAPIsToAdjustGrid: function() {
				if(this.getCurrentMode() != this.previousMode) {
					if(this.getCurrentMode() == "normallist" || this.getCurrentMode() == "otherlist") {
						this.setRowHandleCellWidth();
						this.initScrollbars();
                        this.updateExpandedDtlsHeight(); /* BUG-245501: Updating the expanded details height */
						this.setCalculationsForProgressiveLoad(true);
						this.autoAdjustProgressiveGridHeight();
						this.performWriteOperations();
						this.setHeadersWidth();
						this.gridResized();
					} else if(this.getCurrentMode() == "fatlist") {
						this.setCalculationsForProgressiveLoad(true);
						/* BUG-185182: If "Size grid height to content" to content is check then we have to invoke autoAdjustProgressiveGridHeight() api. */
                      	this.autoAdjustProgressiveGridHeight();
					}
					this.previousMode = this.getCurrentMode();
				}

                /* BUG-245501: Updating the expanded details height */
                if(this.editConfig == this.EDIT_EXPANDPANE){
					var oldDetailsHeight = this.expDetailsHeight;
					this.updateExpandedDtlsHeight();
                  /**SE-42315 : adjusting grid height only if it is not hidded */
					if(oldDetailsHeight != this.expDetailsHeight && this.expDetailsHeight !=0 ){
						this.updateExpandedDtlsHeight()
						this.autoAdjustProgressiveGridHeight();
						this.setHeadersWidth();
					}
				}
				/*if(this.getCurrentMode() == "fatlist" && pega.env.ua.webkit && !('ontouchstart' in window)) {
					 BUG-132835: this is required to eliminate horizontal scroll bar in case of fat list in non ie browsers
					Dom.removeClass(this.gridcontDiv, "grid-responsive-default");
					var grid = this;
					if(!this.responsiveReflowTimer) {
						this.responsiveReflowTimer = setTimeout(function(){
										Dom.addClass(grid.gridcontDiv, "grid-responsive-default");
										delete grid.responsiveReflowTimer;
										}, 300);
					}
				}*/
			},

			setHeadersWidth: function(){
				if(this.bResponsiveGrid && this.isInFatList()) {
					return;
				}
				/*For Row pane freeze - Update header THs width to align them along with content TDs */
				if (this.fixedRow && !this.fixedCol && Dom.hasClass(this.gridcontDiv,"gPXAuto") && this.rightHeaderDiv) {
					var headerTable = Dom.getFirstChild(this.rightHeaderDiv);
					if(!headerTable) return;
					var rows = headerTable.rows;
					if(!rows) return;
					var headerTableRow = rows[0];
					if(!headerTableRow) return;
					/*BUG-72064- Setting HeaderTable width to 'auto' to keep header and body in sync*/
					if(pega.env.ua.webkit){
						headerTable.style.width = "auto";
					}
					var cells = headerTableRow.cells;
					if(!cells) return;
					var dataRows = this.rightBodyTbl.rows;
					var dataRow = this.bCategorizedGrid?dataRows[2]:dataRows[1];
					/*BUG-158799 : Avoid the first column header from getting stretched causing the other headers to get distorted/hidden and aligning the header table with the 'Grid_NoResults' div*/
					if(dataRow && dataRow.id == "Grid_NoResults") {
                      /*BUG-233417: Set LayoutWrapperWidth only incase of progressive Load */
                      if(this.pageMode=="Progressive Load"){
						/* BUG-200005: IE8 objects if we assign invalid style values */
						if(headerTableRow.offsetWidth) {
							this.layoutWrapperDiv.style.width = headerTableRow.offsetWidth  + "px";
							this.rightBodyTbl.style.width = (headerTableRow.offsetWidth - 1) + "px";
						}
						}
						return;
					}
					var temp=[]; /*BUG-84152 Scrollbars appear for LayoutWrapper in IE8 Standards Mode*/
					if(dataRow && dataRow.cells && dataRow.cells.length > 0) {
						for(var i = 0; i < dataRow.cells.length; i++) {
							var cellWidth = dataRow.cells[i].offsetWidth;
							temp.push(cellWidth); /*BUG-84152 Scrollbars appear for LayoutWrapper in IE8 Standards Mode*/
							/*PerformanceImprovement - avoiding alternate read and write in a loop*/
							/*if(cellWidth) { // TASK-108398 : check for 0
								cells[i].style.width = cellWidth + "px";
							}*/
							/* BUG-72065: For grid with column resize, setting correct width for inner div element of header to fix alignment issue in chrome*/
							if( pega.env.ua.webkit && cells[i].firstElementChild && dataRow.cells[i].firstElementChild && !(pega.env.ua.webkit && (Dom.hasClass(cells[i], "expandPaneHeader") || Dom.hasClass(cells[i], "rowHandleHead")))){
								cellWidth = dataRow.cells[i].firstElementChild.offsetWidth;
								if(cellWidth) { // TASK-108398 : check for 0
									cells[i].firstElementChild.style.width = cellWidth + "px";
								}
							} else if(pega.env.ua.webkit && cells[i].firstElementChild && Dom.hasClass(cells[i], "rowHandleHead")) {/* BUG-127129: data and header cells should have same widths */
								cells[i].firstElementChild.style.width = cellWidth + "px";
							}
							/* BUG-72065: changes end */
						}
						/*PerformanceImprovement - performing all writes at once*/
						for(var i = 0; i < dataRow.cells.length; i++) {
							if(temp[i]) {/*BUG-112883: Check for 0*/
								cells[i].style.width = temp[i] + "px";
							}
						}
					}
					if (this.bTreegrid && this.leftHeaderDiv) {
						var leftheaderTable = Dom.getFirstChild(this.leftHeaderDiv);
						if(!leftheaderTable) return;
						rows = leftheaderTable.rows;
						if(!rows) return;
						headerTableRow = rows[0];
						if(!headerTableRow) return;
						cells = headerTableRow.cells;
						if(!cells) return;
						dataRows = Dom.getChildren(Dom.getFirstChild(this.leftBodyDiv));
						if(dataRows){
							for(var k=1; k < dataRows.length; k++){
								if(!this.isDummyRow(k))
									break;
							}
						}
						dataRow = Dom.getFirstChild(dataRows[k]);
						var dataRowChildren = Dom.getChildren(dataRow);
						if(dataRowChildren && dataRowChildren.length > 0) {
							var cellwidths=[];
							for(var i = 0; i < dataRowChildren.length; i++) {
								/*PerformanceImprovement - Storing all the read values in array (performing only reads)*/
								cellwidths.push(dataRowChildren[i].offsetWidth);
							}
							for(var i = 0; i < dataRowChildren.length; i++) {
								/*PerformanceImprovement - Updating the values from array into DOM (performing only writes)*/
								cells[i].style.width = cellwidths[i] + "px";
							}
						}
					}
					//TASK-100873 - In case of fixed width or height, do not touch width of gridLayoutWrapper
					if(this.layoutWrapperDiv.getAttribute("noWidth") || this.layoutWrapperDiv.getAttribute("noHeight")){
						/*BUG-84152 Scrollbars appear for LayoutWrapper in IE8 Standards Mode*/
						var tempWidthTotal=0;
						for(var twt=0;twt<temp.length;twt++){
							tempWidthTotal+=temp[twt];
						}
						if(tempWidthTotal==0){
							tempWidthTotal=headerTable.offsetWidth;
						}
						if(!Event.isIE || pega.u.d.inStandardsMode) {
							if(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0){
								tempWidthTotal += this.getScrollbarWidth();
							}
						}
						var width = leftheaderTable ? leftheaderTable.offsetWidth + tempWidthTotal : tempWidthTotal; /*BUG-84152 Scrollbars appear for LayoutWrapper in IE8 Standards Mode*/
						if(width!=0){
							var adjustWidth = 0;
							if(!Event.isIE || pega.u.d.inStandardsMode){
								if(!this.layoutWrapperDiv.getAttribute("noHeight") || this.pageMode=="Progressive Load"){
									adjustWidth = 2;
								}else if(this.pageMode=="Progressive Load" && this.totalRecords<=this.rangeSize){
									adjustWidth = 1; /*For progressive Load, add 1 px to avoid horizontal scroll bar when the results are less than page size*/
								}
							}
							if(this.layoutWrapperDiv.getAttribute("noWidth")) { // TASK-121224: Width is not required in case of "noWidth" false. So added a check.
								this.layoutWrapperDiv.style.width = width+adjustWidth+'px';
								/*BUG-136067 Additions to the width of the objects to correct the alignment and remove additional white space*/
								/*BUG-146405:Commenting out the below statement in setHeadersWidth api of pzpega_ui_grid.js as grid width was growing on click/tab of the row. */
								/*this.rightBodyTbl.style.width = this.rightBodyTbl.offsetWidth + 1 +adjustWidth+'px';*/
								this.gridcontDiv.style.width = width+adjustWidth+'px';
                                var gridLayoutTable = pega.util.Dom.getElementsById("gridLayoutTable", this.gridcontDiv)[0];
								gridLayoutTable.style.width = width+adjustWidth+'px';
								this.rightHeaderDiv.style.width=width+adjustWidth+'px';
								if(this.pageMode=="Progressive Load") {/* BUG-146279 */
									if(!this.gridAutoHeight && Dom.hasClass(this.gridcontDiv,"gPXAuto")) {/* BUG-148454: Progressive load if "Size grid height to content" is unchecked */
										this.layoutWrapperDiv.style.overflowX = "hidden";
									}
									if(pega.util.Event.isIE){
										this.rightHeaderTbl.style.width=width+ 'px';
									} else {
										this.rightHeaderTbl.style.width=width+adjustWidth-1+ 'px';
									}
								} else {
									this.rightHeaderTbl.style.width=width+adjustWidth+ 'px';
								}

							}
						}
					}
					/*BUG-172251: Set the width of the rightHeaderDiv and rightHeaderTbl to the width of the table + width of scrollbar to avoid alignment issue*/
					if(this.gridcontDiv.style.width != "" && this.rightHeaderDiv && this.rightHeaderTbl && this.rightBodyTbl){
                       /*BUG-209117- For progressive Load scrollBarAdjustment calculation is different*/
                       var scrollBarAdjustment = this.getScrollbarWidth();
                       	if(this.pageMode == "Progressive Load"){
                          scrollBarAdjustment =this.layoutWrapperDiv.offsetWidth - this.rightBodyTbl.offsetWidth -1 ;
                        }
                        var rightHeaderWidth=this.rightBodyTbl.clientWidth +scrollBarAdjustment + "px";
						this.rightHeaderDiv.style.width =rightHeaderWidth;
						this.rightHeaderTbl.style.width = rightHeaderWidth;
					}

				} else if(this.rightBodyTbl && this.rightBodyTbl.rows[0].cells[0]) {
					this.writeCases.push(Grids.SET_UL_HEIGHT);
				}

				var grid_noResMsg = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if(!grid_noResMsg){
					this.updateHeaderCellsWidth();
			    }
			},
			startColResize: function(e, eSourceEle) {
				var obj = eSourceEle[1];
				var tbl = eSourceEle[2];
				eSourceEle = eSourceEle[0];
				if(e.target) {
					obj.activeResize = e.target;
				}
				obj.currentColESource = eSourceEle;
				obj.currentColESourceP = obj.currentColESource.parentNode;
				obj.currentColESourceTables = [];
				if(obj.currentColESource.tagName == "LI") {
					obj.currentColESourcePCSSPaddingLeft = parseInt(obj.currentColESourceP.style.paddingLeft);
				}
				obj.currentColESourcePCSSPaddingLeft=isNaN(obj.currentColESourcePCSSPaddingLeft)?0:obj.currentColESourcePCSSPaddingLeft;
				if(obj.currentColESource.tagName!= "LI" && obj.currentColESource.tagName!= "TD" && obj.currentColESource.tagName!= "TH") {
					obj.currentColCellIndex = obj.getCellIndex(obj.currentColESourceP);
				} else {
					obj.currentColCellIndex = obj.getCellIndex(obj.currentColESource);
				}
				/* Set white-space "normal" to the first TD of all rows 	*/
				if(!obj.bPXFixed){
					var gridTable = eSourceEle.parentNode.parentNode.parentNode;
					if(!pega.util.Event.isIE){
						var gridTable = gridTable.parentNode;
					}
					if(gridTable && !Dom.hasClass(gridTable,"resizedTable")){
						gridTable.className += " resizedTable";
					}
					var contentTable = obj.rightBodyTbl;
					if(contentTable && !Dom.hasClass(contentTable,"resizedTable")){
						contentTable.className += " resizedTable";
					}
					if(tbl == obj.leftHeaderTbl){
						Dom.removeClass(gridTable, "resizedTable");
						Dom.removeClass(contentTable, "resizedTable");
					}
					if(pega.env.ua.webkit){
						var contentRows = gridTable.rows;
						if(contentRows && contentRows.length > 0){
							for(var i = 0; i < contentRows.length; i++){
								var TDs = contentRows[i].children;
								if(TDs && TDs.length > 0 )
									Dom.getFirstChild(TDs[obj.currentColCellIndex]).style.maxHeight="none";
							}
						}
					}
				}
			},

			/*
			@handler
			@private resizes the column
			@param $undefined$eSourceEle– parameter description goes here.
			@return $void$
			*/
			doColResize : function (e, eSourceEle) {
				var obj = eSourceEle[1];
				var tbl = eSourceEle[2];
				//eSourceEle = eSourceEle[0];
				var newWidth = e.width;
				var newWidthB = newWidth;
				var newWidthBPx = newWidthB + "px";
				var newHeight = 0;
				if(obj.fixedRow && tbl==obj.leftHeaderTbl && Dom.hasClass(obj.gridcontDiv,"gPercent") == true){
					var firstCell = tbl.rows[0].cells[0].offsetWidth;
					newWidth += parseInt(firstCell);
				}
				var treeGridFirstCellResized = false;
				if( (tbl==obj.leftBodyUL || (obj.fixedRow && tbl==obj.leftHeaderTbl)) && obj.rightBodyTbl.width.indexOf("%")!=-1){
					treeGridFirstCellResized = true;
				}
				if( (tbl==obj.leftBodyUL || (obj.fixedRow && tbl==obj.leftHeaderTbl)) && tbl.offsetWidth>newWidth && obj.rightBodyTbl.width.indexOf("%")!=-1){ /* Tree Grid - % width - first column is resized to less*/
					var diffWidth = tbl.offsetWidth - newWidth;
					var newPercent = Math.round((diffWidth/tbl.offsetWidth) * 100);
					if(parseInt(obj.rightBodyTbl.parentNode.parentNode.width) + newPercent <= 100){
						obj.rightBodyTbl.parentNode.parentNode.width = parseInt(obj.rightBodyTbl.parentNode.parentNode.width) + newPercent + "%";
					} else {
						obj.rightBodyTbl.parentNode.parentNode.width = "100%";
					}
					if(obj.fixedRow)
						obj.rightHeaderTbl.parentNode.parentNode.width = parseInt(obj.rightHeaderTbl.parentNode.parentNode.width) + newPercent + "%";
				}
				var currCol = obj.currentColESourceP;

				if(!Dom.isAncestor(obj.leftBodyUL, obj.currentColESource) && !(obj.fixedRow && obj.fixedCol && obj.leftHeaderDiv && Dom.isAncestor(obj.leftHeaderDiv, obj.currentColESource))) {
					if(!pega.env.ua.ie) {
						currCol.style.width = newWidthBPx;
					}
				} else {
					var handleWidth = 0;
					if((obj.fixedRow && obj.fixedCol && !obj.bTreeGrid) && (obj.bNumberedSkin || obj.bDragDrop)) {
						handleWidth = 27;
					}
					var newLeftBodyWidth = ((newWidthB) + obj.currentColESourcePCSSPaddingLeft + handleWidth) + "px";
					obj.leftBodyDiv.style.width = newLeftBodyWidth;
					if(obj.gridBodyLeftParent) {
						obj.gridBodyLeftParent.style.width = newLeftBodyWidth;
					}
				}

				var celIndex = obj.currentColCellIndex;

				var tables = [];
				if(tbl == obj.leftHeaderTbl) {
					tables = [obj.leftHeaderTbl];
					obj.leftHeaderTbl.rows[0].cells[celIndex].style.width = newWidthBPx;
				} else if(tbl == obj.rightHeaderTbl) {
					tables = [obj.rightHeaderTbl, obj.rightBodyTbl];
					obj.rightBodyTbl.rows[0].cells[celIndex].style.width = newWidthBPx;
					if((pega.env.ua.webkit && obj.bGrid) && (obj.bDragDrop || obj.bNumberedSkin)) { // TASK-121223
						obj.rightHeaderTbl.rows[0].cells[0].style.minWidth = obj.rightBodyTbl.rows[0].cells[0].offsetWidth + "px";
					}
				} else if(tbl == obj.leftBodyUL) {
					if(obj.rightBodyTbl.width.indexOf("%") != -1 ||(obj.bTreegrid && obj.editConfig == obj.EDIT_READWRITE )){
						tables = [obj.rightBodyTbl];
					}else{
						tables = [];
					}
				} else {
					tables = [obj.rightBodyTbl];
				}
				/* Update left UL height when wrap text is enabled for the tree grid headers in IE*/
				if(obj.bTreegrid && Event.isIE){
					var LIs= Dom.getChildren(obj.leftBodyUL);
					var newHeight = 0;
					if(LIs && LIs.length > 0) {
						for(var i = 1; i < LIs.length; i++){
							if(LIs[i].getAttribute("isWrapEnabled") == "true"){
								var rowContentUL = Dom.getFirstChild(LIs[i]);
								var iconLiHeight = Dom.getFirstChild(rowContentUL).offsetHeight;
								var contentLI = Dom.getNextSibling(Dom.getFirstChild(rowContentUL));
								var contentLiHeight = Dom.getNextSibling(Dom.getFirstChild(contentLI)).offsetHeight;
								newHeight = (contentLiHeight > iconLiHeight)?contentLiHeight:iconLiHeight;
								if(rowContentUL && newHeight != 0){
									rowContentUL.style.height = newHeight + "px";
									Dom.getFirstChild(rowContentUL).style.height = newHeight + "px";
									contentLI.style.height = newHeight + "px";
									var rows = obj.rightBodyTbl.rows;
									for(var k = i; k < rows.length; k++){
										var cells = rows[k].cells;
										for(var j = 1; j < cells.length; j++){
											cells[j].style.height = newHeight + "px";
										}
									}
								}
							}
						}
					}
				}
				/*set the table widths according to the cell widths*/
				var tabLen = tables.length;
				var leftHeaderWidth = 0,totalWidth = 0;
				for(var i=0;i<tabLen;i++) {
					if(tables[i]) {
						var firstRow = tables[i].rows[0];
						if(obj.bTreegrid){
							if(obj.leftHeaderTbl && tbl != obj.leftHeaderTbl){
								var leftHeaderTblRow = obj.leftHeaderTbl.rows[0];
								var leftHeaderCells = leftHeaderTblRow.cells;
								for(var j=0;j < leftHeaderCells.length; j++){
									leftHeaderWidth += parseInt(leftHeaderCells[j].offsetWidth);
								}
							}
						}
						if(firstRow) {
							var cells = firstRow.cells;
							var cellsLen = cells.length;
							var percentTable = tables[i].width;
							if(percentTable == "")
								percentTable = tables[i].style.width;
							var isPercentWidth = false;
							if(percentTable && percentTable.indexOf("%") != -1)
								isPercentWidth = true;
							var tableOffsetWidth = tables[i].offsetWidth;
							if(obj.bPXFixed && obj.fixedRow && tbl!= obj.leftHeaderTbl)
								cellsLen -= 1;
							for(var j =0;j<cellsLen;j++) {
								var cellStyleWidth = parseInt(cells[j].style.width);
								if(celIndex == j && isPercentWidth  && !treeGridFirstCellResized){ /* % width , set % width to column after resized */
								    cellStyleWidth = (parseInt(cellStyleWidth) * 100)/ tableOffsetWidth;
								    cells[j].style.width = cellStyleWidth + "%";
								}
								if(tbl == obj.leftHeaderTbl && obj.bPXFixed && obj.fixedRow && obj.fixedCol){
									if(cellStyleWidth != "")
										totalWidth += parseInt(cellStyleWidth);
									else
										totalWidth += cells[j].offsetWidth;
								}
								//BUG-77280: In case of TreeGrid-FreezeBoth-ColResize above and below if blocks are evaluated to true so kept "else"
								else if((obj.bTreegrid || !obj.fixedRow) || (tables[i] != obj.rightHeaderTbl && obj.fixedRow && obj.layoutWrapperDiv && obj.layoutWrapperDiv.getAttribute("noWidth")=="true")){
									if(cellStyleWidth != "")
										totalWidth += parseInt(cellStyleWidth);
									else
										totalWidth += cells[j].offsetWidth;
								}
							}
							/* BUG-77173 & TASK-108987: First Data column resize in Tree Grid causes white space after heirarchy column */
							var j=1;
							if((obj.bNumberedSkin || obj.bDragDrop) && obj.bShowExpandCollapseColumn) { // BUG-81102: If (rowNumbering or rowReorder) and expandPane are enabled start from 2nd col
								j = 2;
							}
							for(;j<cellsLen;j++) {
								var resizedColumnPercentWidth = parseInt(cells[celIndex].style.width);
								var averageWidthForOtherColumns = (100 - resizedColumnPercentWidth)/(cellsLen-2);
								if(celIndex != j && isPercentWidth){ /* Precent width grid case, set average% width to all other columns after resizing any column*/
								    cells[j].style.width = averageWidthForOtherColumns + "%";
								}
							}
							/*Tree grid - PX - Width - Row Freeze */
							if(!isPercentWidth && obj.bTreegrid && obj.fixedRow && tbl==obj.rightHeaderTbl){
									tables[i].style.width = totalWidth + "px";
									if(obj.rightBodyTbl)
										obj.rightBodyTbl.style.width = totalWidth + "px";
							}
							if(tbl != obj.leftHeaderTbl)
								totalWidth += leftHeaderWidth;

							if(tbl == obj.leftHeaderTbl && obj.bPXFixed && obj.fixedRow && obj.fixedCol){
								obj.leftHeaderTbl.style.width = totalWidth + "px";
							}
							if(!isPercentWidth){
								if(Dom.getFirstChild(obj.rightBodyDiv).getAttribute("fixedSize") != 'true' || (!obj.fixedRow && obj.gridcontDiv.getAttribute("hasWidth") != 'true')){
									if(tbl!= obj.leftHeaderTbl && !obj.bPXFixed)
										tables[i].style.width = totalWidth + "px";
								}
								if(!obj.fixedRow && (obj.layoutWrapperDiv && obj.layoutWrapperDiv.getAttribute("noHeight") =="true" && obj.layoutWrapperDiv.getAttribute("noWidth")=="true")){
									tables[i].style.width = totalWidth + "px";
								}
								// BUG-77280: In case of TreeGrid-FreezeBoth-ColResize obj.layoutWrapperDiv is null
								if(obj.fixedRow && obj.layoutWrapperDiv && obj.layoutWrapperDiv.getAttribute("noWidth")=="true" && tbl != obj.leftHeaderTbl){
									Dom.getElementsById("gridLayoutTable",obj.gridDiv)[0].parentNode.style.width = totalWidth + "px";
								}
								/*TASK-115564: This solves the problem with header mismatch*/
								if(obj.bGrid && !obj.fixedCol && obj.fixedRow && obj.layoutWrapperDiv.getAttribute("noWidth")=="true") {
									Dom.getElementsById("gridLayoutTable",obj.gridDiv)[0].parentNode.style.width = "auto";
								}
								if(!obj.bTreegrid && obj.fixedRow && obj.layoutWrapperDiv.getAttribute("noWidth")=="true"){
									tables[i].style.width = totalWidth + "px";
								}
								/* Set layoutWrapper Height for fixedRow in IE*/
								if(Event.isIE && obj.fixedRow && obj.layoutWrapperDiv && (obj.layoutWrapperDiv.getAttribute("noHeight") =="true") && (obj.layoutWrapperDiv.getAttribute("noWidth")!="true")) {
									obj.layoutWrapperDiv.style.height = Dom.getFirstChild(obj.layoutWrapperDiv).offsetHeight + obj.getScrollbarWidth()+"px";
								}
							}
							if(tables[i] == obj.leftHeaderTbl && !(obj.bTree && Dom.hasClass(obj.gridcontDiv,"gPercent") == true)) {
								obj.leftBodyDiv.style.width = totalWidth + "px";
								if(obj.gridBodyLeftParent) {
									obj.gridBodyLeftParent.style.width = totalWidth + "px";
								}
								if(obj.leftHeaderTbl)
									obj.leftHeaderTbl.style.width =  obj.leftBodyDiv.offsetWidth + 'px';
								if(obj.fixedRow && obj.layoutWrapperDiv.getAttribute("noWidth") =="true" && Dom.hasClass(obj.gridcontDiv,"gPercent") != true)
									obj.layoutWrapperDiv.style.width = Dom.getFirstChild(obj.layoutWrapperDiv).offsetWidth + obj.getScrollbarWidth()+'px';
							}
							/*Set width for the left body UL*/
							if((obj.bTreegrid || obj.fixedCol) && Dom.hasClass(obj.gridcontDiv,"gPercent") != true){
								var dataRow = tables[i].rows[1];
								if(obj.fixedRow)
									dataRow = obj.rightBodyTbl.rows[1];
								if(dataRow)
									newHeight = dataRow.cells[celIndex].offsetHeight;
								var LIs= Dom.getChildren(obj.leftBodyUL);
								if(LIs && LIs.length > 0){
									for(var i = 1; i < LIs.length; i++){
										var rowContentUL = Dom.getFirstChild(LIs[i]);
										if(rowContentUL)
											rowContentUL.style.height = newHeight + "px";
									}
								}
							}
						}
					}

				}

				obj.gridResized();

			},

			/*
			@private returns the cell Object
			@param $undefined$event– parameter description goes here.
			@param $undefined$parentTbl– parameter description goes here.
			@param $undefined$element– parameter description goes here.
			@return $void$
			*/
			findCell : function(event, parentTbl, element) {
				if(!element){
					var eSource = Event.getTarget(event);
				}else{
					var eSource = element;
				}
				var returnSourceElement = null;

				if(!eSource.nodeName) {
				  	return null;
				}
				/*If user clicks on the left side of +/- icon in tree grid, it get the target as row content UL. so, change the source to first child of UL.*/
				if(eSource.nodeName == "UL" && Dom.hasClass(eSource, "rowContent")) {
					eSource = Dom.getFirstChild(eSource);
				}
				while (eSource && eSource.nodeName != "BODY" && parentTbl && eSource.id != parentTbl.id) {
					if (eSource.nodeName == "TH" || eSource.nodeName == "TD"
					|| (eSource.nodeName == "LI" && !Dom.hasClass(eSource,"gridRow"))){
						returnSourceElement = eSource;
					}
					eSource = eSource.parentNode;
				}
				if(!eSource || eSource.nodeName == "BODY" ){
					return null;
				}

				return returnSourceElement;
			},

			/*
			@private returns the cell index
			@return $void$
			*/
			getCellIndex : function(cell) {
				/*BUG-171397:  If 'cell' is null, then return 0.*/
				if(cell == null){
					return 0;
				}
				if(cell.tagName == "TD" || cell.tagName == "TH") {
					return cell.cellIndex;
				} else {
					return (Dom.getPreviousSibling(cell)?1:0);
				}
			},

			getFilteredColumnIndex: function(cell){
				if(cell.tagName == "TD" || cell.tagName == "TH") {
					var columnIndex;
					if(this.leftHeaderTbl && Dom.isAncestor(this.leftHeaderTbl, cell)) {
						columnIndex = 1;
					}
					else {
						/*BUG-499854: intead of cell.cellIndex calculating it based on colspans*/
						columnIndex=1;
            var prevCell=cell;
            while(prevCell.previousElementSibling){
              columnIndex+=prevCell.previousElementSibling.colSpan;
              prevCell=prevCell.previousElementSibling;
              
            }
						if((!this.fixedCol && !this.bTreegrid && this.bDragDrop) || (!this.fixedCol && this.bNumberedSkin)) {
							columnIndex = columnIndex-1;
						}
						if(this.editConfig==this.EDIT_EXPANDPANE && this.bShowExpandCollapseColumn) {
							columnIndex = columnIndex-1;
						}
					}
					return columnIndex;
				}
				else {
					return 1; /*For UL/LI part*/
				}
			},

			/*
			@private returns the row index
			@param $undefined$cell– parameter description goes here.
			@return $void$
			*/
			getRowIndex : function(cell) {
              	if(!cell){ /*BUG-249430*/
					return;
				}
				if(cell.tagName == "TD" || cell.tagName == "TH") {
					return cell.parentNode.rowIndex;
				}
				else {
					var UL = cell.parentNode;
					var LI = UL.parentNode;
					var id = LI.id;
                    var rowCurr = pega.util.Dom.getElementsById(id, this.rightBodyTbl, "TR");
                    var index;
					if(rowCurr) {
						rowCurr = rowCurr[0];
						index = rowCurr.rowIndex;
					} else {
						index = 0;
					}
					return index;
				}
			},

			/*
			@private returns the last row index
			*/
			getLastRowIndex : function() {
				var lastIndex=1;
				if(this.pageMode != "Progressive Load"){
					if(!this.bTreegrid && this.rightBodyTbl.rows && this.rightBodyTbl.rows.length>0) {
						lastIndex = this.rightBodyTbl.rows[this.rightBodyTbl.rows.length-1].rowIndex;
						if(this.editConfig==this.EDIT_EXPANDPANE  || this.bCategorizedGrid){/* BUG-147871 : Added check on this.bCategorizedGrid */
							lastIndex = this.getExpandPaneTableLength();
						}
					}else if(this.bTreegrid) { /* Handle rowIndex to highlight only top level rows in case of tree */
						var leftNodes = Dom.getChildren(this.leftBodyUL);
						if(leftNodes) {
							lastIndex = this.getTopLevelIndexOnUI(leftNodes.length-1);
						}
					}
				}else{
					if (!this.bDiscardInvisibleRows) {
						if(this.noOfPagesLoaded>0 && this.rangeSize>0)
							lastIndex=this.noOfPagesLoaded*this.rangeSize;
						lastIndex =(lastIndex > this.totalRecords)?this.totalRecords:lastIndex;
					} else if(this.bDiscardInvisibleRows){
						lastIndex = this.getNoOfRowsLoaded();
					}
					/* BUG-185024: For categorized grid, getIndex is not required it seems */
					if(!this.bCategorizedGrid) {
						lastIndex = this.getIndex(lastIndex);
					}
				}
				return lastIndex;
			},

			/*
			@private returns the Page index
			@param $undefined$event– parameter description goes here.
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			getPageIndex : function(event, tbl) {
				var cell = this.findCell(event, tbl);
				if(this.repeatType== this.ROW_REPEAT)  {
					if(cell && cell.parentNode)
						return this.getRowIndex(cell);
				} else if(cell){
					var index = this.getCellIndex(cell);
					/*To handle colspans in case of column repeat. Body table has colspans
					Returns an array of [label cell index in 1st row, delete cell index in 1st row, body content cell index in other rows]*/
					if(index != -1) {
						if(!cell.getAttribute("colspan") || cell.getAttribute("colspan") == 1){
							if(index %2 == 0){
								return [index-1,index,index/2];
							} else {
								return [index,index+1,(index+1)/2];
							}
						} else if(cell.getAttribute("colspan") == 2){
							return [(index*2)-1,(index*2),index ];
						}
					}
				}
				return -1;
			},
			/* Returns the number of top-level nodes for the tree-grid */
			getTopLevelNodesLength: function(tbl) {
				var numOfRows = 0;
				numOfRows = Dom.getChildren(this.leftBodyUL).length;
				return numOfRows - 1;
				},

			/* API for tree/tree grid to get the Parent Index(TopLevelIndex) on UI for a given parent(top level) index*/
			getTopLevelIndexOnUI: function(topLevelIndex) {
				var topLevelIndexOnUI;
				var topLevelNodes = Dom.getChildren(this.leftBodyUL);
				if(topLevelNodes) {
					var topLevelLeftRowTobeFocused = topLevelNodes[topLevelIndex];
					if(topLevelLeftRowTobeFocused) {
						var topLevelRightRowTobeFocused = Dom.getElementsById(topLevelLeftRowTobeFocused.id, this.rightBodyTbl, "TR")[0];
						if(topLevelRightRowTobeFocused) {
							topLevelIndexOnUI = topLevelRightRowTobeFocused.rowIndex;
						}
					}
				}
				return topLevelIndexOnUI;
			},
			/*API to take actual row index and return activeRow index. This is reverse to getIndex API does.*/
			getActiveRowIndexFromRowIndex: function(index) {
				var rows = this.rightBodyTbl.rows;
				var expPaneCnt = 0;
				var rowObj = this.rightBodyTbl.rows[index];

                                // BUG-154885: If table is empty return index (-1)
				if(!rowObj){
					return index;
				}

				/*If the row doesn't have an id, then decrement by 1 to get the row.*/
				if(rowObj.id=="" && index>1)  {
					index--;
				}
				for(var i=1; i<index; i++) {
					rowObj = rows[i];
					/*detail row in expand pane doesn't have an ID*/
					if(rowObj.id=="") {
						expPaneCnt++;
					}
				}
				return (index-expPaneCnt);
			},
			/*API that is used to get the real rows which excludes the expanded rows.*/
			getExpandPaneTableLength: function() {
				var numOfRows = 0;
				numOfRows = this.rightBodyTbl.rows.length-1;
				if(this.editConfig==this.EDIT_EXPANDPANE || this.bCategorizedGrid) {
					numOfRows = this.getActiveRowIndexFromRowIndex(numOfRows);
				}
				if(!this.bGrid) {
					numOfRows--;
				}
				return numOfRows;
			},
			/*
			@private returns the number of data rows in this table
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			getTableLength : function(tbl) {
				var numOfRows = 0;
				if(!this.bTreegrid) {
					numOfRows = tbl.rows.length;
				}else if(tbl.id != this.leftBodyUL.id){
						numOfRows = tbl.rows.length;
				}
				else {
					numOfRows = Dom.getChildren(tbl).length;
				}
				if(this.bGrid == true)
					return numOfRows - 1;
				else
					return numOfRows - 2;
			},
			callSelectPage : function(args) {
				this.selectPage(null,args[0],args[1]);
				this.resetInCall();
			},

			/**
             * Function to set just the active Row and doesn't call selectrow which highlights the row.
             * @param preventUnhighlighting {boolean} sent as true only when called from editInHarness function
             * which prevents unhighlighting the previous active row.
             */
			setActiveRow: function(e, tbl, index, preventUnhighlighting) {
				if(e){
					if(!index)
						var rowIndex  = this.getPageIndex(e,tbl);
					else
						var rowIndex = index;
					var gridDiv = pega.util.Event.getTarget(e);
					if(!this.isElementFromSameGridContDiv(gridDiv)) {
						return;
					}
				}
				try{
					if(!index)
						var pageIndex  = this.getPageIndex(e,tbl);
					else
						var pageIndex = index;
					/*Return on click of group by row header*/
					if(this.bCategorizedGrid) {
						if(this.rightBodyTbl.rows[pageIndex] && !this.rightBodyTbl.rows[pageIndex].id) {
							return;
						}
					}
					/*Hover class name is removed */
					if(this.bRowHovering){
						var row = this.rightBodyTbl.rows[pageIndex];
						if(row && row.getAttribute("expanded") == "true"){
							row = row.previousSibling;
							while(row.nodeType!=1)
								row	= row.previousSibling;
						}
						this.onCellHover(row, false);
					}
					if(this.editConfig==this.EDIT_EXPANDPANE) {
						var row = this.rightBodyTbl.rows[pageIndex];
						if(!row.id) {
							pageIndex = pageIndex-1;
						}
					}
					if( (this.repeatType == this.ROW_REPEAT && (pageIndex == 0 || pageIndex == -1 || (this.bGrid && pageIndex > this.getTableLength(this.rightBodyTbl)) || (!this.bGrid && pageIndex > this.getTableLength(this.rightBodyTbl))))
						||(this.repeatType == this.COL_REPEAT && (pageIndex[0] == 0 || pageIndex[0] == -1 || pageIndex[0] == tbl.rows[0].cells.length-1)) ) {
							return;
					}
					if(this.activeRow && this.activeRow != -1 && this.getIndex(this.activeRow) != pageIndex) {
						if(this.repeatType ==  this.ROW_REPEAT){
                            if (!preventUnhighlighting) {
                                this.selectRow(this.activeRow, false);
                            }
							if(this.getLeftRow()){
								Dom.getFirstChild(this.getLeftRow()).removeAttribute("tabIndex");
							}
						}else{
							this.selectCol(this.activeRow, false);
						}
					}
					if(this.getIndex(this.activeRow) == pageIndex) {
						//this.getLeftRow().focus();
						if(e) {
							var srcElem = Event.getTarget(e);
							var sNodeName = srcElem.nodeName;
							if (sNodeName != "A" && sNodeName != "BUTTON" && sNodeName != "SELECT" && sNodeName != "OPTION" && sNodeName != "INPUT" && sNodeName !=  "TEXTAREA" && sNodeName !=  "IMG"&& !this.isDatePicker(srcElem)) {

								/*
								 * BUG-132517 : Determine if the event's source element can be focussed or not due to
								 * a non-negative tabIndex value. If the event's source element has a tabIndex >= 0
								 * then grid row's first child should not pull the focus.
								 * Hence execute the grid row cell focussing logic only if the event's source element has a tabIndex < 0.
								 */

								var srcElemTabIndex = srcElem.getAttribute("tabIndex");

                              	/*
                                 * BUG-312131: (HFix-35271) IE11 fires focus handler even on the elements which do not have tabIndex.
                                 * Go to parent element in such cases.
                                 */

								if(pega.env.ua.ie > 10 && srcElemTabIndex == null) {
                                    do {
                                      srcElem = srcElem.parentNode;
                                      srcElemTabIndex = srcElem.getAttribute("tabIndex");
                                    } while(!srcElemTabIndex); // getAttribute will return string. Hence, it should work in cases when tabIndex = "0".
                                }

								if(srcElemTabIndex && !isNaN(srcElemTabIndex)) {
									srcElemTabIndex = parseInt(srcElemTabIndex);
								}
								else {
									srcElemTabIndex = -1;
								}

								if(srcElemTabIndex < 0){
									/*target element on click of dropdown comes as option instead of select in case of firefox. So checking for option as well*/
									// preventing focus event on grid row to happen when target is inside the expand pane flow action
                  // BUG-758648 - Prevent focus shift inside row details pane
									if (this.editConfig == this.EDIT_EXPANDPANE && (this.getRightRow().getAttribute("rowExpanded") == "true" || this.bShowExpandedAll)) {
										var detailsDiv = Dom.getElementsById("rowDetail" + this.getLeftRow().id, this.gridDiv)[0];
										if (detailsDiv && Dom.isAncestor(detailsDiv, srcElem)) {
											return;
										}
									}
									//SE-24367 - If src is on the current elem, do not refocus on the first element of the row again
                                     if(!Dom.isAncestor(this.getLeftRow(), srcElem)){
									Dom.getFirstChild(this.getLeftRow()).focus();
									}
									//this.focusElem = null;
									//this.focusOnNewEditableRow();
								}
							}
                        }
						return;
					}
					if(this.editConfig==this.EDIT_EXPANDPANE || this.bCategorizedGrid) {
						if(!this.bPageGroup) {
							var row = this.rightBodyTbl.rows[pageIndex];
							if(row && row.id) {
								pageIndex = (this.bFilteredGrid)?this.getFilteredRowIndex(pageIndex):row.getAttribute("PL_INDEX");
								if( this.pageMode != "Progressive Load" &&
									this.currentPageIndex && this.currentPageIndex!="" && this.pyPaginateActivity=="" && !this.bReportDefinition && parseInt(pageIndex) > parseInt(this.rangeSize)) {
										pageIndex = pageIndex-((this.currentPageIndex-1)*this.rangeSize);
								} else if (this.bDiscardInvisibleRows && this.currentPageIndex && this.currentPageIndex!="") {
									pageIndex = this.getActiveRowIndexFromRowIndex(row.rowIndex);
								}
							}
						}else {
							pageIndex = this.getPGRowIndex(pageIndex);
						}
					}
					this.activeRow = pageIndex;
					/*update the tabindex of the row to "0" while updating the activeRow*/
					//this.getLeftRow().tabIndex="0";
					//this.getLeftRow().focus();
				}catch(e){}
			},
			/*
			API called when user tries do a Set Focus on Next/Previous  row.
			Highlight the applicable row and then trigger a click on the row.
			*/
			changeSetFocus: function(rowIndex, offSet) {
				var rowIndex = rowIndex ? parseInt(rowIndex,10) : 0;
				var rowTobeFocused;
				if(rowIndex == 0) {
					var offSet = parseInt(offSet,10);
					var currentLeftRow = this.getLeftRow();
					if(!currentLeftRow) {
						rowIndex = 1;
					}else {
						if(offSet>0) {
							rowTobeFocused = this.getNextGridRow(currentLeftRow);
						}else {
							rowTobeFocused = this.getPreviousGridRow(currentLeftRow);
						}
						if(rowTobeFocused && (this.bTreegrid || this.fixedCol)) {
							rowTobeFocused = Dom.getElementsById(rowTobeFocused.id, this.rightBodyTbl)[0];
						}
						rowIndex = (rowTobeFocused)?rowTobeFocused.rowIndex : 0;
					}
				}
				/*change the focus only if there is a valid next/previous row.*/
				if(rowIndex>0) {
					if(this.bTreegrid && !offSet) { /* Handle rowIndex to highlight only top level rows in case of tree */
						rowIndex = this.getTopLevelIndexOnUI(rowIndex);
					}
					/*For Inline Editing, submit the edited row before updating the activeRow by triggering mouseup.*/
					if(this.editConfig==this.EDIT_ROW) {
						var nextRow = this.rightBodyTbl.rows[rowIndex];
						if(Dom.getFirstChild(nextRow)) {
							Event.fireEvent(Dom.getFirstChild(nextRow), "mouseup");
						}
						else {
							/* BUG-168883 in case of TreeGrid with one column, the row in right side table is empty hence the first child of the TR is coming as null; Trigger mouseup on the body instead */
							Event.fireEvent(document.body, "mouseup");
						}
					}else if((this.editConfig == this.EDIT_EXPANDPANE || this.bCategorizedGrid) && !rowTobeFocused){/* BUG-147557: Added condition for this.bCategorizedGrid */
						rowIndex=this.getIndex(rowIndex);
					}
					if(this.pageMode == "Progressive Load"){
						if(!this.bDiscardInvisibleRows){
							var lastLoadedRow=this.noOfPagesLoaded*this.rangeSize;
							if(this.noOfPagesLoaded>0 && this.rangeSize>0 && rowIndex > lastLoadedRow){
								rowIndex=this.getIndex(lastLoadedRow);
							}
						}else{
							var lastLoadedRow=this.getNoOfRowsLoaded();
							if(this.rangeSize>0 && rowIndex > this.getIndex(lastLoadedRow)){
								rowIndex=this.getIndex(lastLoadedRow);
							}
						}
					}
					this.selectPage(null, null, rowIndex);
					var leftRow = this.getLeftRow();
					var argsObj = {rowEle: leftRow, refObj:this};
					if(offSet == 1 || offSet == -1) {
						/*
						 *  Here means that the NEXT/PREVIOUS action is triggered as offSet is 1 or -1.
						 */
						if(this.gridDetailsDiv && this.gridDetailsDiv.innerHTML != "") {
							/*
							 * BUG-138014 : Embedpane:Edit row happens from second row on key up/down
							 * Here means gridDetailsDiv is not empty i.e. it is hosting details of
							 * some other row; If details of some other row is already opened only then
							 * show details of the currently focussed row.
							 */
							this.setTopPriorityAction(this.triggerEditInHarness, argsObj);
						}
					} else {
						/*
						 * BUG-150714 : Irrespective of whether the gridDetailsDiv is empty or not,
						 * show details of the currently focussed row if this is not NEXT/PREVIOUS
						 * navigation actions
						 */
						this.setTopPriorityAction(this.triggerEditInHarness, argsObj);
					}
				}
			},

			/*API used to trigger edit in harness implicitly. Called for change set focus and select row onload*/
			triggerEditInHarness: function(args) {
				var rowEle = args.rowEle;
				/*call edit action for Embedded pane grid, if it's editable*/
				if(this.editConfig == this.EDIT_HARNESS && this.bEditableGrid){
					/*create a dummy event as editInHarness expects event*/
					var dummyEvent = {};
					dummyEvent.target = Dom.getChildren(rowEle)[0]; /* get the first td of the row */
                  	if(!dummyEvent.target && this.bTopPriorityActionSet){ /* BUG-229919: If the grid object is stale, just go forward in the action queue */
                      this.bTopPriorityActionSet = false;
					  pega.c.actionSequencer.resume();
                      return true;
                    }
					dummyEvent.type = Grids.EVENT_CLICK; /* set any string */
					var container = (this.bTreegrid || this.fixedCol) ? this.leftBodyUL : this.rightBodyTbl;
					this.editInHarness(dummyEvent, container);
				}else if(this.bTopPriorityActionSet){
					this.bTopPriorityActionSet = false;
					pega.c.actionSequencer.resume();
				}
			},

          	/*
            Get Parent scrollabel Element from document
            */
          	getScrollParent : function(node) {
              if (node === null) {
                return null;
              }

              if (node.scrollWidth > node.clientWidth) {
                return node;
              } else {
                return this.getScrollParent(node.parentNode);
              }
            },
			/*
			@private highlights the selcted page
			@param $undefined$tbl– parameter description goes here.
			@return $void$
			*/
			selectPage: function(e,tbl, index) {
				try{
					this.setActiveRow(e,tbl, index);
					if(this.repeatType ==  this.ROW_REPEAT){
						this.selectRow(this.activeRow, true);
					}else{
						this.selectCol(this.activeRow, true);
					}
					/* When JAWS is on, on select(enter key) a result from autocomplete results popover, Browser getting struck. */
					var isAutocompleteAction = false;
                    /* Check for horizontal scrollbar */
                  	var scrollableParent = this.getScrollParent(this.gridDiv);
	                var isHScrollbar =	false;
                  	if(scrollableParent != null && this.gridDiv.scrollWidth > scrollableParent.clientWidth){
                       isHScrollbar = true;
                    }
                  var isHScrollbarInIE = document.body.scrollWidth > document.body.clientWidth && !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
					if (pega.c.AutoCompleteAG && pega.c.AutoCompleteAG.isElementInsideAutoComPO(e , this.gridDiv)) {
						isAutocompleteAction = true;
					}
					if(e && this.repeatType ==  this.ROW_REPEAT ) {
						var srcElem = Event.getTarget(e);
						var sNodeName = srcElem.nodeName;
						if((sNodeName == "A" ||(sNodeName=="SPAN" && srcElem.className=="pageIndex")|| sNodeName == "BUTTON" ||sNodeName == "SELECT" || sNodeName == "OPTION" ||sNodeName == "INPUT"|| sNodeName ==  "TEXTAREA" )&& (srcElem.type != "hidden" && ((srcElem.currentStyle && srcElem.currentStyle.visibility != "hidden" && srcElem.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(srcElem, "").visibility != "hidden" && window.getComputedStyle(srcElem, "").display != "none")))) {
							var container = null;
							if(Dom.isAncestor(this.leftBodyUL,srcElem))
								container = this.leftBodyUL;
							else if(Dom.isAncestor(this.rightBodyTbl,srcElem))
								container = this.rightBodyTbl;
							var cell = this.findCell(e, container,srcElem);
							if(cell){
								if(container == this.leftBodyUL)
									this.focusElem ={index:this.getCellIndex(cell),tag:"LI"};
								else if(container == this.rightBodyTbl)
									this.focusElem ={index:cell.cellIndex,tag:cell.nodeName};
							}
							/*BUG-120528 - contextmenu not shown first time in Chrome and Safari browsers. Reason Focus on element is not happening in these browsers. IE and FF do the focus and then call the contextmenu*/
							if(sNodeName == "A" && pega.env.ua.webkit && e.type==Grids.EVENT_RIGHT_CLICK){
								this.focusElem = null;
								Dom.getFirstChild(this.getLeftRow()).tabIndex="0";
								Dom.getFirstChild(this.getLeftRow()).focus();
							}
						} else if (sNodeName != "A" && sNodeName != "BUTTON" && sNodeName != "SELECT" && sNodeName != "INPUT" && sNodeName !=  "TEXTAREA" && sNodeName !=  "IMG" && !this.isDatePicker(srcElem)) {

							/*
							 * BUG-132517 : Determine if the event's source element can be focussed or not due to
							 * a non-negative tabIndex value. If the event's source element has a tabIndex >= 0
							 * then grid row's first child should not pull the focus.
							 * Hence execute the grid row cell focussing logic only if the event's source element has a tabIndex < 0.
							 */

							var srcElemTabIndex = srcElem.getAttribute("tabIndex");
							if(srcElemTabIndex && !isNaN(srcElemTabIndex)) {
								srcElemTabIndex = parseInt(srcElemTabIndex);
							}
							else {
								srcElemTabIndex = -1;
							}

							if(srcElemTabIndex < 0){

								// preventing focus event on grid row to happen when target is inside the expand pane flow action
								if (this.editConfig == this.EDIT_EXPANDPANE && this.getRightRow().getAttribute("rowExpanded") == "true") {
									var detailsDiv = Dom.getElementsById("rowDetail" + this.getLeftRow().id, this.gridDiv)[0];
									if (detailsDiv && Dom.isAncestor(detailsDiv, srcElem)) {
										return;
									}
								}
								this.focusElem = null;
								//this.focusOnNewEditableRow();
								/* BUG-148729 : Stealing focus even if the activeElement resides in the row - IE */
                              //Fix for BUG- 291175
                              //Fix for BUG-324524, Adding check for contextmenu. If event type is context menu/Right click then do not focus first element
								if (!isAutocompleteAction && srcElem.getAttribute('data-click') == null && !isHScrollbarInIE && e.type!=Grids.EVENT_RIGHT_CLICK) {
									this.focusFirstElement(this.getLeftRow());
								}
							}
						}
					}else if(!isAutocompleteAction && this.repeatType ==  this.ROW_REPEAT && this.rightBodyTbl.rows[index].getAttribute("expanded") != "true") {
						/* BUG-146406 : Not stealing focus if the activeElement resides in the row */
						if(!Dom.isAncestor(this.getLeftRow(), document.activeElement)) {
							this.focusFirstElement(this.getLeftRow());
						}
					}
					//this.getLeftRow().focus();
					//this.focusOnNewEditableRow();
				}catch(e){}
			},

			isDatePicker : function(srcEle){
				if(srcEle.tagName == "SPAN"){
					var eleParent = srcEle.parentNode;
					/*BUG-176616: HFix-10253 porting*/
					if(srcEle.getAttribute("data-calendar") || eleParent.getAttribute("data-calendar")){
						return true;
					}
				}
				return false;
			},
			/*
			@private highlights/unhighlights a column
			@return $void$
			*/
			selectCol :function(index,bSelected) {
                var func;
				if(bSelected)
					func = Dom.addClass;
				else
					func = Dom.removeClass;
				if(this.rightHeaderTbl){
					var rows = this.rightHeaderTbl.rows;
					for(var j=0; j<rows.length; j++) {
						var row = rows[j];
						func(row.cells[index[0]],this.SELECTED_CLASS);
						func(row.cells[index[1]],this.SELECTED_CLASS);
					}
				}
				var rows = this.rightBodyTbl.rows;
				for(var j=0; j<rows.length; j++) {
					var row = rows[j];
					if(row.rowIndex == 0) {
						/*1st row does not have rowspan*/
						func(row.cells[index[0]],this.SELECTED_CLASS);
						func(row.cells[index[1]],this.SELECTED_CLASS);

					} else {
						/*other rows have colspan*/
						func(row.cells[index[2]],this.SELECTED_CLASS);
					}
				}
			},

			/*
			@private  higlight/unhighlight the row
			@param $undefined$index– parameter description goes here.
			@param $undefined$bSelected– parameter description goes here.
			@return $void$
			*/
			selectRow : function(index,bSelected) {
				/*for a non-focusible grid, don't set the highlighting.*/
				if(!this.bFocusibleGrid) {
					return;
				}
				var func = null;
				if(bSelected){
					func = Dom.addClass;
				}
				else{
					func = Dom.removeClass;
				}

				var row = this.rightBodyTbl.rows[this.getIndex(index)];
				if(!row) return;
				var rowid = row.id;
				if(!rowid) {
					return;
				}
				var cells = row.cells;
				var len = cells.length;
				var cellstart=0;
				if(this.bDragDrop ||this.bTreegrid ||this.bNumberedSkin) //in case of grid without drag drop there wont be drag handle li's
					cellstart=1;
				if(this.editConfig == this.EDIT_EXPANDPANE && !this.fixedCol && this.bShowExpandCollapseColumn) // in case of expand Pane conf, do not highlight the cell containing expandRow/collapseRow icon
					cellstart++;

				for(var j=cellstart;j<len;j++) {
					func(cells[j],this.SELECTED_CLASS);
				}
                if (!bSelected) {
                    Dom.removeClass(row, "notFocused");
                }
				/*update Selected class for LIs only for grid with freeze col or treegrid*/
				if(this.bTreegrid || this.fixedCol) {
                    var row = pega.util.Dom.getElementsById(rowid, this.leftBodyUL, "LI")[0];
					var ul = row.getElementsByTagName("UL")[0];
					if(this.bTreegrid) {
						func(ul ,this.SELECTED_CLASS);
					}
					var cells = Dom.getChildren(ul);
					var len = cells.length;
					cellstart=0;
					if(this.bDragDrop ||this.bTreegrid ||this.bNumberedSkin) //in case of grid without drag drop there wont be drag handle li's
						cellstart=1;
					if(this.editConfig == this.EDIT_EXPANDPANE && this.fixedCol && this.bShowExpandCollapseColumn) // in case of expand Pane conf, do not highlight the cell containing expandRow/collapseRow icon
						cellstart++;
					for(var j=cellstart;j<len;j++) {
						func(cells[j],this.SELECTED_CLASS);
					}
                    if (!bSelected) {
                        Dom.removeClass(row, "notFocused");
                    }
                }
				if(this.bTreegrid){
					var leftrow = Dom.getElementsById(row.id,this.leftBodyUL)[0];
					if(leftrow){
						/*  commenting as the same logic is implemented at server.
							this.arrangeIcons(leftrow);
						*/
					}
				}
				this.setHeadersWidth();
			},

			/*Added this API to grey out text inside inner level tags esp to override the styles given for the inner tags.
			*/
			disableInnerTags : function(ele){
				var divTags = ele.getElementsByTagName("DIV");
				var spanTags = ele.getElementsByTagName("SPAN");
				var labelTags = ele.getElementsByTagName("LABEL");
				var divLen = divTags.length;
				var spanLen = spanTags.length;
				var labelLen = labelTags.length;
				for(var i=0; i<divLen; i++){
					Dom.addClass(divTags[i], "greyedOut");
				}
				for(var i=0; i<spanLen; i++){
					Dom.addClass(spanTags[i], "greyedOut");
				}
				for(var i=0; i<labelLen; i++){
					labelTags[i].style.color = "grey";
					Dom.addClass(labelTags[i], "greyedOut");
				}
			},
			/*
			@private  disable the row
			@param $undefined$index– parameter description goes here.
			@param $undefined$bSelected– parameter description goes here.
			@return $void$
			*/

			disableRow : function(index,bSelected) {
				if(typeof(index)=="undefined"){
					index = this.getActiveRowIndex();
				}
				var row = this.rightBodyTbl.rows[this.getIndex(index)];
				row.setAttribute("busyRow","true");
				pega.u.d.disableAllOtherButtons(null,row);
				var rowid = row.id;
				var cells = row.cells;
				var len = cells.length;
				for(var j=0;j<len;j++) {
					cells[j].disabled = true;
					if(!pega.env.ua.ie) {
						Dom.addClass(cells[j], "greyedOut");
						this.disableInnerTags(cells[j]);
					}
				}
				/*update LIs only for grid with freeze col or treegrid*/
				if(this.bTreegrid || this.fixedCol){
                    var row = pega.util.Dom.getElementsById(rowid, this.leftBodyUL, "LI")[0];
					row.setAttribute("disabled","true");
					var ul = row.getElementsByTagName("UL")[0];
					if(ul) {
						ul.disabled = true;
						if(!pega.env.ua.ie) {
							Dom.addClass(ul, "greyedOut");
							this.disableInnerTags(ul);
						}
					}
					var cells = Dom.getChildren(ul);
					var len = cells.length;
					//The first LI inside rowcontent UL is the drag handle. So, don't disable that.
					for(var j=1;j<len;j++) {
						cells[j].disabled = true;
						if(!pega.env.ua.ie) {
							Dom.addClass(cells[j], "greyedOut");
							this.disableInnerTags(cells[j]);
						}
					}
				}
			},
			/*
			@private  return  the div  which is resized
			@param $undefined$element– row on which resize action was performed  description goes here.
			@return $object$	returns div with id="divcont" and container table	*/

			getResizedElement :function(element){
				var resizedElem;
				var container =this.leftBodyUL;
				if(this.bTreegrid || this.fixedCol)
                    resizedElem = Dom.getFirstChild(Dom.getFirstChild(pega.util.Dom.getElementsById(element.id, this.leftBodyUL, 'LI')[0]));
				else{
					resizedElem=Dom.getFirstChild(element);
					container=this.rightBodyTbl;
				}
				return [resizedElem,container];


			},

			/*
			@protected- Function description goes here.
			@param $undefined$responseObj – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			loadGridForEdit : function(responseObj) {
				if(responseObj.argument[6].beforeDomActionContext && !responseObj.argument[6].beforeDomActionContext.activeRow) {
					return false;
				}
				var reloadElement = responseObj.argument[0];
				var newStream = responseObj.responseText;
				var partialParams = responseObj.argument[6];
				partialParams.bTreegrid=this.bTreegrid;
				if(partialParams.leftRowBefore)
					this.leftrowbefore = partialParams.leftRowBefore;
				if(partialParams.rightRowBefore)
					this.rightrowbefore = partialParams.rightRowBefore;

                var RLInfo = new Array(this.activeRow, [this.leftBodyUL , this.rightBodyTbl], this.bPageGroup?"group":"list");
				this.loadRow(newStream, partialParams,reloadElement,RLInfo,true);

				/*@protected return false to tell handlePartialSuccess that loading of DOM objects are done here; it need not continue loading */
				return false;

			},
			getLevel : function(row) {
				var hPref = row.id;
				var arr = hPref.split("$p");
				return arr.length -1;
			},
			loadProgressiveRows: function(responseObj) {
				var reloadElement = responseObj.argument[0];
				var newStream = responseObj.responseText;
				var partialParams = responseObj.argument[6];
				partialParams.bTreegrid=this.bTreegrid;
				var documentFragment = document.createDocumentFragment();
				var tempDiv = document.createElement("div");
				documentFragment.appendChild(tempDiv);
				tempDiv.style.display = "none";
				tempDiv.innerHTML = newStream;
				/*var tableEle = Dom.getElementsById("bodyTbl_right", tempDiv)[0]; BUG-613851 */
        var tableEle = tempDiv.querySelector("#bodyTbl_right > #tempTBody").parentElement;
				if(this.bTreegrid) {
					var ULEle = Dom.getElementsById("gridNode", tempDiv, "UL")[0];
				}
				var grid = this;
				var newTblRows = tableEle.rows;
				var newRowsLen = newTblRows.length;
				if(!grid.bDiscardInvisibleRows){
					var pageStartIndex = ((this.bCustomLoad || (this.customLoadStartIndex && this.customLoadStartIndex!="")) ? this.currentPageIndex-1 : this.noOfPagesLoaded)*this.rangeSize+1;
					var startIndex = pageStartIndex;
					var dummyRightRowsArr = new Array();
					var lastRowIndex = 0;
					for(var j=0;j<newRowsLen;j++) {
						if(this.editConfig==this.EDIT_EXPANDPANE) {
							/*For expand pane, getIndex iterates through all the rows to get the actual row index. So, send the previously obtained rowIndex to avoid iterations repeatedly.*/
							dummyRightRowsArr[lastRowIndex] = grid.rightBodyTbl.rows[grid.getIndex(startIndex)+lastRowIndex];
							lastRowIndex++;
						}else {
							dummyRightRowsArr[j] = grid.getRightRow(startIndex+j);
						}
					}
				}
				var progressiveLoadCallback = function(domObj) {

					if(domObj && domObj.id != "PegaOnlyOnce") {
							pega.u.d.processOnloads(domObj);
					}
					if(!grid.bDiscardInvisibleRows) {
						var isIE = pega.util.Event.isIE;
						var tempTBody = Dom.getElementsById("tempTBody",grid.rightBodyTbl)[0];
						var tempTBodyRows = Dom.getChildren(tempTBody);
						var localCnt = 0;
						for(var i=0; i<newRowsLen; i++) {
							var rightRow = tempTBodyRows[i]; /* Row which has content .*/
							var dummyRightRow = dummyRightRowsArr[localCnt];
							var sameRowReplaced = false;
							if(grid.editConfig==grid.EDIT_EXPANDPANE) {
								if(rightRow.id=="" && rightRow.getAttribute("expanded")=="true") {
									if(dummyRightRow && dummyRightRow.getAttribute("expanded")=="true") {
										localCnt++;
										continue;
									}
									grid.expDetailsHeight += rightRow.offsetHeight; /*update the expanded Rows height to the property*/
									if(dummyRightRow){
										Dom.insertBefore(rightRow, dummyRightRow);
									}else if(i==newRowsLen-1){/*handling boundary condition*/
										Dom.getFirstChild(grid.rightBodyTbl).appendChild(rightRow);
									}
									continue;
								}
							}
							if(dummyRightRow.getAttribute("OAArgs") == null || (grid.customLoadStartIndex && grid.customLoadStartIndex!="")) { /* Replace only if its a dummy row. */
								if(grid.customLoadStartIndex && !sameRowReplaced && rightRow.id == dummyRightRow.id) { /* BUG - 59036 */
									sameRowReplaced = true;
								}
								dummyRightRow.parentNode.replaceChild(rightRow,dummyRightRow);
							}
							localCnt++;
						}

						tempTBody.parentNode.removeChild(tempTBody);
					}
					if(grid.gridcontDiv.getAttribute("reloadSomePages")=="true") {
						var tblRows = grid.rightBodyTbl.rows;
						var tblRowsLen = tblRows.length;
						/*If the new row doesn't match filter criteria(which always happens as append adds empty row), then remove the extra row from DOM only if same row is not replaced. */
						if( tblRowsLen-2 == grid.totalRecords && !sameRowReplaced ) { /* BUG - 59036 */
							var lastTblRow = tblRows[tblRowsLen-1];
							if(parseInt(grid.totalRecords) > parseInt(grid.rangeSize) ) {
								lastTblRow.parentNode.removeChild(lastTblRow);
							}
						}
					}

					if(!grid.bDiscardInvisibleRows && startIndex+newRowsLen-1==grid.getTableLength(grid.rightBodyTbl)) {
						grid.currentPageIndex = grid.noOfPagesLoaded;
					}
					if(grid.bDiscardInvisibleRows){
						if(grid.insertPosition && grid.insertPosition != ""){
							var tempTBody = Dom.getElementsById("tempTBody",grid.rightBodyTbl)[0];
							var tempTBodyRows = Dom.getChildren(tempTBody);
							for(var i=0; i<newRowsLen; i++) {
								Dom.getFirstChild(grid.rightBodyTbl).insertBefore(tempTBodyRows[i],tempTBody);
							}
							tempTBody.parentNode.removeChild(tempTBody);
							var tblRows = grid.rightBodyTbl.rows;
							var tblRowsLen = tblRows.length;
							if(grid.insertPosition=="down"){
                                var deleteRowBefore = pega.util.Dom.getElementsById(grid.deleteRowsBeforeID, grid.rightBodyTbl, "TR")[0];
								if(deleteRowBefore) {
									var indexEnd = deleteRowBefore.rowIndex;
									/*For categorized grid, don't remove the category header row.*/
									if(grid.bCategorizedGrid) {
										if(tblRows[indexEnd-1] && !tblRows[indexEnd-1].id && pega.util.Dom.hasClass(tblRows[indexEnd-1], "grid-categorize-header")) {
											indexEnd--;
										}
									}
									for(var i = 0; i < indexEnd-1; i++){
										Dom.getFirstChild(grid.rightBodyTbl).removeChild(tblRows[1]);
									}
								}
							}else if(grid.insertPosition=="up"){
                                var deleteRowAfter = pega.util.Dom.getElementsById(grid.deleteRowsAfterID, grid.rightBodyTbl, "TR")[0];
								if(deleteRowAfter) {
									var indexStart = deleteRowAfter.rowIndex;
									if(grid.editConfig==grid.EDIT_EXPANDPANE){
										indexStart = Dom.getNextSibling(tblRows[indexStart]).getAttribute("expanded")=="true" ? indexStart+1: indexStart;
									}
									var noOfRowsForDeletion = tblRowsLen - indexStart - 1;
									for(var i=0; i < noOfRowsForDeletion; i++){
										Dom.getFirstChild(grid.rightBodyTbl).removeChild(tblRows[tblRows.length-1]);
									}
								}
							}
							grid.insertPosition = null;
						}

						grid.updateTopBottomBufferHeights();
						var lowerLimit = grid.currentPageIndex == 1 ? 0 : ((grid.currentPageIndex - 2) * grid.rangeSize);
						var upperLimit = lowerLimit + grid.getNoOfRowsLoaded();
						if(!grid.avoidFocusOnProgressiveLoad){
						if (grid.prevActivePLIndex && lowerLimit < grid.prevActivePLIndex && grid.prevActivePLIndex <= upperLimit) {
							grid.selectPage(null, null, grid.getIndex(grid.prevActivePLIndex - lowerLimit));
						} else {
							grid.activeRow = null;
							grid.prevActivePLIndex = null;
						}
						}
						else{
								if(grid.AC_Index_To_Highlight){
									if(grid.AC_BCK_First_Index != grid.getFirstLoadedRowIndex()){
										grid.AC_Index_To_Highlight -= grid.getFirstLoadedRowIndex() - grid.AC_BCK_First_Index;
										if(grid.eventKeyKode===34){grid.selectRow(grid.AC_Index_To_Highlight-grid.numRows,false);}
										if(grid.eventKeyKode===33){grid.selectRow(grid.AC_Index_To_Highlight+grid.numRows,false);}
									}
									grid.setActiveRow(null,null, grid.getIndex(grid.AC_Index_To_Highlight));
									grid.selectRow(grid.AC_Index_To_Highlight, true);
								}
								else {
									if (grid.prevActivePLIndex && lowerLimit < grid.prevActivePLIndex && grid.prevActivePLIndex <= upperLimit) {
										grid.setActiveRow(null,null, grid.getIndex(grid.prevActivePLIndex - lowerLimit));
										grid.selectRow(grid.prevActivePLIndex - lowerLimit, true);
									}
								}
								grid.AC_Index_To_Highlight = null;
								grid.avoidFocusOnProgressiveLoad = false;
						}
						var newScrollTop = grid.prevVisibleStartIndex * grid.rowHeight;
						if (grid.layoutWrapperDiv.offsetHeight > grid.rowHeight * grid.rangeSize && grid.scrollDirection > 0) {
							newScrollTop = newScrollTop - (grid.layoutWrapperDiv.offsetHeight - grid.rowHeight * grid.rangeSize);
						}
						if(grid.editConfig==grid.EDIT_EXPANDPANE && grid.scrollDirection > 0) {
							var index = grid.prevVisibleStartIndex - lowerLimit;
							var rows = grid.rightBodyTbl.rows;
							var expDetailsHeight = 0;
							var iterator = 0;
							var plIndexCnt = 1;
							while (plIndexCnt <= index) {
								var row = rows[iterator];
								if(!row) {
									break;
								}
								if (row.getAttribute("expanded") == "true") {
									expDetailsHeight +=  row.offsetHeight;
								} else if (row.getAttribute("PL_INDEX") && row.getAttribute("PL_INDEX")!="") {
									plIndexCnt++;
								}
								iterator++;
							}
							newScrollTop += expDetailsHeight;
						}
            /*BUG-518033 : resetting scrollTop if prevvisiblestartindex is 1*/
            if(grid.prevVisibleStartIndex === 1){
              grid.layoutWrapperDiv.scrollTop = 0;
            } else {
              grid.layoutWrapperDiv.scrollTop = newScrollTop;
            }
					}
					pega.u.d.gIsScriptsLoading = false;
					grid.gridcontDiv.setAttribute("reloadSomePages", "");
					grid.bProgressiveLoading = false;
					grid.bCustomLoad = false;
					grid.customLoadStartIndex = "";
					grid.setHeadersWidth();
					if(!grid.scrollHeadAdded) {/* BUG-112883: When grid is in a hidden "div" scrollHead is not added in initScrollbars() due to 0 offsetHeights. So calling it here */
						grid.autoAdjustProgressiveGridHeight();
					}
          grid.setRowHandleCellWidth();/* BUG-359812: Call this method to set row number column width */
					//BUG-96190:Inline mode grid with Progressive load unable to show scroll Start
					grid.gridResized();
					//BUG-96190 End
				};

				this.noOfPagesLoaded = (this.bCustomLoad || (this.customLoadStartIndex && this.customLoadStartIndex!="")) ? this.currentPageIndex : this.currentPageIndex + 1;

				if(tableEle && tableEle.id=="bodyTbl_right") {
					if(!this.bDiscardInvisibleRows){
						var rightEle = this.getRightRow(startIndex);
						var leftEle = this.getLeftRow(startIndex);
						var temptbody = document.createElement("tbody");
						rightEle.parentNode.insertBefore(temptbody,rightEle);
						partialParams.domElement = temptbody;
						pegaUD.loadDOMObject(reloadElement,tableEle.innerHTML,progressiveLoadCallback,partialParams);
					}else{
						if(!(this.insertPosition && this.insertPosition != "")){
							/* inserting first rightBodyTbl row as first row in the response tbody before calling loadDOMObject to correct widths*/
							if(this.rightBodyTbl.rows && this.rightBodyTbl.rows[0] && tableEle.rows && tableEle.rows[0]){
								Dom.getFirstChild(tableEle).insertBefore(this.rightBodyTbl.rows[0], tableEle.rows[0]);
							}
							Dom.getFirstChild(tableEle).removeAttribute("id");
							partialParams.domElement = Dom.getFirstChild(this.rightBodyTbl);
							pegaUD.loadDOMObject(reloadElement,tableEle.innerHTML,progressiveLoadCallback,partialParams);
						} else {
							var temptbody = document.createElement("tbody");
							if(this.insertPosition == "down"){
								Dom.getFirstChild(this.rightBodyTbl).appendChild(temptbody);
							} else if(this.insertPosition == "up"){
								Dom.getFirstChild(this.rightBodyTbl).insertBefore(temptbody,this.rightBodyTbl.rows[1]);
							}
							partialParams.domElement = temptbody;
							pegaUD.loadDOMObject(reloadElement,tableEle.innerHTML,progressiveLoadCallback,partialParams);
						}
					}

				}

				return false;
			},

			/* updates top and bottom buffer div heights with correct values */
			updateTopBottomBufferHeights : function () {
				if(this.editConfig == this.EDIT_EXPANDPANE || this.bCategorizedGrid) {
					this.updateExpandedDtlsHeight();
				}
				this.rowHeight = this.getAvgRowHeight();
				var firstLoadedRowIndex = this.getFirstLoadedRowIndex();
				var topHeight = ((firstLoadedRowIndex - 1) * this.rowHeight) != 0 ? ((firstLoadedRowIndex - 1) * this.rowHeight) + "px" : "auto";
				this.topBuffer.style.height = topHeight;
				var noOfRows = this.getNoOfRowsLoaded();
				var bottomHeight = ((this.totalRecords - (firstLoadedRowIndex + noOfRows - 1)) * this.rowHeight) > 0 ? ((this.totalRecords - (firstLoadedRowIndex + noOfRows - 1)) * this.rowHeight) + "px" : "auto";
				this.bottomBuffer.style.height =  bottomHeight;

				/* BUG-89621 - START : Below code ensures that progressive load grid works when browser limits the value of scrollHeight or offsetHeight  */
				var recordsSupportedByBrowser = Math.floor(this.layoutWrapperDiv.scrollHeight/this.rowHeight);
				if(this.originalTotalRecords > recordsSupportedByBrowser) {
					this.totalRecords = recordsSupportedByBrowser;
					bottomHeight = ((this.totalRecords - (firstLoadedRowIndex + noOfRows - 1)) * this.rowHeight) > 0 ? ((this.totalRecords - (firstLoadedRowIndex + noOfRows - 1)) * this.rowHeight) + "px" : "auto";
					this.bottomBuffer.style.height =  bottomHeight;
				}
				/* BUG-89621 - END */

			},

			/* returns first loaded row index of a progressively loaded grid */
			getFirstLoadedRowIndex : function () {
				var noOfPages = Math.ceil(this.totalRecords / this.rangeSize);
				if (this.currentPageIndex == 1) {
					return 1;
				} else if (this.currentPageIndex == noOfPages) {
					/* BUG-132392 Return last two pages of records in case of last page */
					return (this.currentPageIndex - 2) * this.rangeSize + 1;
				} else {
					return (this.currentPageIndex - 2) * this.rangeSize + 1;
				}
			},

			getAvgRowHeight : function() {
				var totalHeight = this.rightBodyTbl.offsetHeight;
				/*BUG-112917: In IE 10, sometimes the totalHeight  is becoming "0" though the offsetHeight is more. So, assign it once again to fix the issue. */
				if(totalHeight === 0) {
					totalHeight = this.rightBodyTbl.offsetHeight;
				}
				if(this.editConfig==this.EDIT_EXPANDPANE) {
					totalHeight -= this.expDetailsHeight;
				}
				/* BUG-185024: categorized header height should not be considered */
                if(this.bCategorizedGrid) {
                    totalHeight -= this.categorizedHeadersHeight;
                }
				var noOfRows = this.getNoOfRowsLoaded();
				return Math.floor(totalHeight/noOfRows);
			},

			getNoOfRowsLoaded : function() {
				return this.getExpandPaneTableLength();
			},

			getActiveRowIndex : function() {
				return this.activeRow;
			},

			getPropertyValue: function(cell) {
				var cell = cell?cell:this.getActiveCell();
				var inputFound;
				var checkTags = ["input" , "textarea", "select"];
				for(var i=0; i<checkTags.length; i++)
				{
					// Navigate thru all elems found
					var inpElems = cell.getElementsByTagName(checkTags[i]);
					// Setting higher precdence to input
					if(inputFound && checkTags[i] == "select")
						return;

					for(var j=0; j<inpElems.length; j++) {
						var inpElem = inpElems[j];
						// Ignore hidden fields
						if(inpElem && inpElem.type!="hidden") {
							if(checkTags[i] == "input")
								inputFound = true;
              //BUG-659812 - For checkbox controls, returning input.checked
              if(inpElem.type=="checkbox")
                return inpElem.checked.toString();
							if(inpElem.value)
								return inpElem.value;
						}
					}
				}
				return null;
           	},

			getRowData : function(index) {
				var columnList = this.columnsList;
				var len = columnList.length;
				var row = this.rightBodyTbl.rows[index];
				var isEditable = Dom.hasClass(row,"editMode");
				var rowData = {};
				for(var i=0;i<len;i++) {
					var column = columnList[i];
					if(i == 0 && (this.bTreegrid || this.fixedCol)) {
						var row = this.rightBodyTbl.rows[index].id;
						var leftRow = Dom.getElementsById(row,this.leftBodyUL)[0];
						var cell = Dom.getFirstChild(leftRow).childNodes[1];
					} else {
						var cell = this.rightBodyTbl.rows[index].cells[i];
					}
					if(isEditable){
						rowData[column]= this.getPropertyValue(cell);
					}else {
						if(document.all)
							rowData[column]= cell.innerText;
						else
							rowData[column]= cell.textContent;
					}
				}
				return rowData;

			},
			getPropertyText : function(property) {
				var columnList = this.columnsList;
				var len = columnList.length;
				var index = this.activeRow;
				if(!index)
					return;
				var actRowIndex = this.getIndex(index);
				var row = this.rightBodyTbl.rows[actRowIndex];
				var isEditable = ((this.editConfig == this.EDIT_ROW) && Dom.hasClass(row,"editMode"));
				for(var i=0;i<len;i++) {
					var column = columnList[i];
					if(column == property) {
						if(i == 0 && (this.bTreegrid || this.fixedCol)) {
							var row = this.rightBodyTbl.rows[actRowIndex].id;
							var leftRow = Dom.getElementsById(row,this.leftBodyUL)[0];
							var cell = Dom.getChildren(Dom.getFirstChild(leftRow))[1];
						} else {
							if((this.bTreegrid || this.fixedCol))
								var cell = this.rightBodyTbl.rows[actRowIndex].cells[i];
							else
								var cell = this.rightBodyTbl.rows[actRowIndex].cells[i+1];
						}
						if(isEditable || this.editConfig == this.EDIT_READWRITE){
							return this.getPropertyValue(cell);
						}else {
							/*BUG-141829: Used Regex in IE to skip the script content.*/
							/*if(document.all)
								return cell.innerText;
							else
								return cell.textContent;
							*/
							if(pega.util.Event.isIE){
								var regExp = /<script>[^\0]+?<\/script>/gi ;
								var str = cell.outerHTML;
								str = str.replace(regExp, "");
								/* Replace <tag>#</tag> with # */
								var regExp = /<\/?[^>]+>/gi;
								str = str.replace(regExp, "");
								return str;
							}else{
								return cell.innerText;
							}
						}
					}
				}
			},

			getFirstCellVal : function() {
				var firstCellVal = this.getPropertyText(this.columnsList[0]);
				return firstCellVal?firstCellVal:"";
			},

			getLeftRow : function(index) {
				var cRowIndex = index?index:this.getActiveRowIndex();
				if(this.fixedCol || this.bTreegrid) {
					if(this.leftBodyUL && cRowIndex != -1) {
						if(this.rightBodyTbl) {
							var row = this.rightBodyTbl.rows[this.getIndex(cRowIndex)];
							if(row) {
							var leftId = this.rightBodyTbl.rows[this.getIndex(cRowIndex)].id;
							}
							if(leftId) {
                                return pega.util.Dom.getElementsById(leftId, this.leftBodyUL, "LI")[0];
							} else {
								return null;
							}
						} else {
							return null;
						}
					} else {
						return null;
					}
				}else {
					return this.rightBodyTbl.rows[this.getIndex(cRowIndex)]; /*Return the TR even from leftRow when Tree part is not there.*/
				}
			},
		getRightRow : function(index) {
				var cRowIndex = index?index:this.getActiveRowIndex();
				if(cRowIndex != -1) {
					return this.rightBodyTbl.rows[this.getIndex(cRowIndex)];
				} else {
					return null;
				}
			},
			getRow : function(index) {
				return [this.getLeftRow(index), this.getRightRow(index)];
			},

			getEntryHandle: function(index) {
				var cRowIndex = index?index:this.getActiveRowIndex();
				var rowObj = this.rightBodyTbl.rows[this.getIndex(cRowIndex)];
				if(this.rightBodyTbl && rowObj) {
					return pega.ui.property.toReference(rowObj.id);
				} else {
				}
			},

			doCustomAction : function(index, activity, params, callbackfunc) {
				var strActionSF=new SafeURL();
				strActionSF.put("pyActivity","pzdoGridAction");
				strActionSF.put("gridActivity",activity);
				if(index != "")
					strActionSF.put("pzPrimaryPageName",pega.ui.property.toReference(this.rightBodyTbl.rows[this.getIndex(index)].id));

				var postData = params;
				var oSafeUrl = SafeURL_createFromURL(postData);
				postData = oSafeUrl.toEncodedPostBody();

				var callback = {success : function(oResponse){
					var stream = oResponse.responseText;
					if(callbackfunc && typeof(callbackfunc) == "function") {
						callbackfunc.call(window,stream);
					}
				}};
				pega.u.d.asyncRequest("POST",strActionSF,callback,postData);
			},
			getObjClass : function(index){
				var objClassName;
				if(index=="" || !this.bTreegrid){
					objClassName = this.propertyClass;
				}else {
					var rowElement = this.rightBodyTbl.rows[this.getIndex(index)];
					var rowLI = Dom.getElementsById(rowElement.id, this.leftBodyUL, "LI")[0];
					var rowUL = Dom.getFirstChild(rowLI);
					objClassName = rowUL.getAttribute("objclass");
				}
				return objClassName;
			},
			append : function(pageName, index, bAppendChild,bGetSafeUrlObj){
				if(index != ""){
					var rowElement = this.rightBodyTbl.rows[this.getIndex(index)];
				}else {
					var rowElement = Dom.getFirstChild(this.rightBodyTbl);
				}
				var property = this.getPLPGProperty();
				if(pageName != "") {
					property = this.PLPGName;
					var pyPropRef = pageName + this.PLPGName;
				}else{
					var pyPropRef = this.dataSourceRef;
				}
				var objClass = this.getObjClass(index);
				if(!objClass){
					objClass = this.propertyClass;
				}
				var appendAct= this.appendAct;
				/*HFix-4590: disable partial refresh if custom append activity is there*/
				if(!this.bGrid && appendAct && appendAct!="") {
					var disablePartialRefresh = true;
				}
				if(this.bValueList && this.appendAct=="")
					appendAct="AppendToValueList";
				var params = {
					method : "append",
					grid : this,
				         listBaseRef : this.baseRef,
                                              listPrimaryPage : this.primPage,
					repeatProperty : property,
					className  : objClass,
					indexElt : index,
					pageName : pageName,
					customActivity : appendAct,
					eventOrTarget : rowElement,
					partialRefresh : this.isPartialRefresh?(this.refreshLayout?"false":"true"):"false",
					repeatType : "list",
					refreshLayout: this.refreshLayout,
					pyPropRef : pyPropRef,
					appendChild : bAppendChild
				}

				var lastRowToRetrieve = this.getLastRowToRetrieve();
				if(lastRowToRetrieve) {
					params.lastRowToRetrieve = lastRowToRetrieve;
				}

				/*HFix-4590: disable partial refresh if custom append activity is there*/
				if(disablePartialRefresh) {
					params.partialRefresh = "false";
					params.refreshLayout = true;
				}
				if(this.bTreegrid) {
					params.gridAction = this.action;
				}

				if(this.gridPreActivity) {
					params.gridPreActivity = this.gridPreActivity;
				}
				if(this.gridPostActivity) {
					params.gridPostActivity = this.gridPostActivity;
				}

				this.bGetSafeUrlObj=false;
				if(bGetSafeUrlObj){
					this.bGetSafeUrlObj=true;
					return pegaUD.append(params);

				}
                /* BUG-260252: Remove the no results message after response comes */
				// this.removeGridNoResultsMsg();
				pegaUD.append(params);
			},

			insertBefore : function(index) {
				if(this.action==""){
					this.action = "INSERTBEFORE";
				}
				if(this.bPageGroup)  /* insertbefore for page grp also behaves like insertafter */
				{	pega.ctx.gridobj = this;
					pega.u.d.ShowSubscriptPrompt(this.getPLPGProperty(), this.propertyClass, this.primPage, this.appendAct, this.gridDiv, this.refreshLayout?"false":"true");
				}else {
					if(index == "" && !Dom.getElementsById("Grid_NoResults",this.gridDiv) && this.getTableLength(this.rightBodyTbl)>0)
						index = 1;
					this.insert(index, false);
				}
			},

			insert : function(rowIndex,bAppendChild) {
				if(this.pageMode == "Progressive Load") {
					rowIndex = this.ensurePositiveIndex(rowIndex, "INSERTAFTER");
				}
				if(this.bPageGroup)  /* insertbefore for page grp also behaves like insertafter */
				{	pega.ctx.gridObj = this;
					pega.u.d.ShowSubscriptPrompt(this.getPLPGProperty(), this.propertyClass, this.primPage, this.appendAct, this.gridDiv, this.refreshLayout?"false":"true");
					return;
				}
				if(rowIndex == "") {
					var pageName = "";
				}else {
					var rightRow = this.rightBodyTbl.rows[this.getIndex(rowIndex)];
					if(bAppendChild) {
						var pageName = pega.ui.property.toReference(rightRow.id);
					}else if(this.bTreegrid){
						var leftRow = Dom.getElementsById(rightRow.id,this.leftBodyTbl,'LI')[0];
						var parentRow = leftRow.parentNode.parentNode;
						if(Dom.hasClass(parentRow,"gridRow"))
							var pageName = pega.ui.property.toReference(parentRow.id);
						else
							var pageName = "";
					}else {
						var pageName = "";
					}
				}

				this.append(pageName, rowIndex,bAppendChild);
			},

			addChild : function(index) {
				var expCollNode = this.getExpandCollNode(index);
				//Don't let the user add a child if there is not expand collapse icon displayed
				if(!expCollNode) {
					alert("You cannot add a child for this row");
					this.resetInCall();
					return;
				}
				var cell = pega.ctx.dom.closest(expCollNode,"LI");
				var gridNodeUL = Dom.getNextSibling(cell.parentNode);
				if(gridNodeUL && gridNodeUL.id=="gridNode") {
					if(expCollNode.className=="expandNode") {
						this.doExpandCollapse(null,null,null, this, expCollNode);
					}
					if(Dom.hasClass(expCollNode, "noEC")) {
						Dom.removeClass(expCollNode, "noEC");
						expCollNode.removeAttribute("tabIndex"); /* BUG-141184 */
						Dom.addClass(expCollNode, "collapseNode");
					}

					this.callAppendChild(index);
				}else {
					pega.u.d.inCall = true;
					this.doExpandCollapse(null, null,null,this, expCollNode,index);
				}
			},

			callAppendChild : function(index) {
				var rightRow = this.rightBodyTbl.rows[this.getIndex(index)];
				var rowId = rightRow.id;
				var leftLI = Dom.getElementsById(rowId, this.leftBodyUL, "LI")[0];
				var childUL = Dom.getElementsById("gridNode", leftLI, "UL");
				if(childUL)
					childUL = childUL[0];
				else {
					var ul = document.createElement("UL");
					ul.id = "gridNode";
					ul.className = "gridNode";
					leftLI.appendChild(ul);
					childUL = ul;
				}
				var childrenLI = Dom.getChildren(childUL);
				if(childrenLI.length>0) {
					var lastChildLi = childrenLI[childrenLI.length-1];
					var lastrow = Dom.getElementsById(lastChildLi.id, this.rightBodyTbl, "TR")[0];
					var lastrowIndex = lastrow.rowIndex;
					if(this.editConfig == this.EDIT_MODAL || this.editConfig == this.EDIT_HARNESS){
						this.selectRow(index,false);
						this.activeRow = lastrowIndex;
						this.insertAfter();
					}else {
						this.insert(lastrowIndex, false);
					}

				}else {
					lastrowIndex = "";
					if(this.editConfig == this.EDIT_MODAL || this.editConfig == this.EDIT_HARNESS){
						this.activeRow = index;
							this.setModalAction("ADDFIRSTCHILD");
						this.performInsertAction();
					}else {
						this.insert(index, true);
					}
				}
			},

			appendToGrid: function(type,target,keyCode, container){
				this.markAsDirty();
				if((type == "keypress" && keyCode != 13) || this.submitErrors){ //To fix issue in firefox, when submitErrors are there don't proceed.
					this.resetInCall();
					return;
				}
				if(container == this.leftBodyUL || container == this.rightBodyTbl)
					var srcElement = this.findCell(null,container,target);
				if(srcElement){
					var rowIndex = this.getRowIndex(srcElement)
				}else if(this.activeRow && this.activeRow != -1 && this.activeRow !=""){
					srcElement=this.gridDiv;
					var rowIndex = this.activeRow;
				}else {
					srcElement=this.gridDiv;
					var rowIndex = "";
				}
				if(!this.bGrid) {
					if(rowIndex == this.rightBodyTbl.rows.length -1)
						rowIndex = "";
				}
				this.action="INSERTAFTER";
				if(this.bPageGroup){
					pega.ctx.gridObj = this;
					pega.u.d.ShowSubscriptPrompt(this.getPLPGProperty(), this.propertyClass, this.primPage, this.appendAct, srcElement, "true");
				}else{
					this.insert(rowIndex);
				}
			},

			getExpandCollNode: function(rowIndex) {
				var rightRow = this.rightBodyTbl.rows[this.getIndex(rowIndex)];
				var rowId = rightRow.id;
				var leftLI = Dom.getElementsById(rowId, this.leftBodyUL, "LI")[0];
				var leftContUL = Dom.getFirstChild(leftLI);
				var iconDiv = Dom.getElementsById("iconExpandCollapse", leftContUL, "DIV");
				if(iconDiv){
					iconDiv = iconDiv[0];
				}
				return Dom.getFirstChild(iconDiv);
			},

			isNodeExpanded: function(rowIndex) {
				var expCollNode = this.getExpandCollNode(rowIndex);
				if(expCollNode.className=="collapseNode") {
					return true;
				}else{
					return false;
				}
			},

			/*Method that simulates click on the submit button of embed pane when delete is triggered on some other row.*/
			triggerSubmitOnEmbedPaneRow: function() {
				var SaveButton;
				if(this.editConfig==this.EDIT_HARNESS && this.propRef){
					SaveButton = Dom.getElementsById("ModalButtonSubmit",this.gridDetailsDiv,"BUTTON");
					if(SaveButton && SaveButton[0] && !SaveButton[0].disabled) { /*Submit the visible embed pane row details only if the Submit button is available and not disabled. Else, discard the details.*/
						var visibleEmbedPaneDtlsRowId = pega.ui.property.toHandle(this.propRef);
						var visibleEmbedPaneDtlsRowEle = Dom.getElementsById(visibleEmbedPaneDtlsRowId, this.rightBodyTbl, "TR");
						if(visibleEmbedPaneDtlsRowEle && visibleEmbedPaneDtlsRowEle[0]) {
							visibleEmbedPaneDtlsRowEle = visibleEmbedPaneDtlsRowEle[0];
							var visibleEmbedPaneDtlsRowIndex = visibleEmbedPaneDtlsRowEle.rowIndex;
							if(this.activeRow!=visibleEmbedPaneDtlsRowIndex) { /*When the deleted row is different from the expanded row.*/
								/*unhighlight the old active row again.*/
								this.selectRow(this.activeRow, false);
								this.deleteGridRow = "true";
								this.deleteGridRowIndex = this.activeRow;
								this.activeRow = visibleEmbedPaneDtlsRowIndex;
								Event.fireEvent(SaveButton[0],Grids.EVENT_CLICK); /*Find the submit button in the embed pane details section and simulate click on it.*/
								return true;
							}
						}
					}
				}
				return false;
			},
			/*function that resets the properties set for triggering delete after submitting the previous row details.*/
			resetCustomDeleteRowProps: function() {
				if(this.editConfig==this.EDIT_HARNESS && this.deleteGridRow=="true") {
					this.deleteGridRow = "";
					this.deleteGridRowIndex = "";
					this.notSubmitDetails = false;
				}
			},
			/*@private
			@param $undefined$args– parameter description goes here.
			@return $void$
			*/
			removeFromGrid: function(type,target,keyCode, container){
				this.markAsDirty();
				if((type == "keypress" && keyCode != 13) || (this.editConfig==this.EDIT_READONLY) || this.gridDiv.getAttribute("editConfig")==this.EDIT_READONLY) {
					this.resetInCall();
					return;
				}
				var index=this.getActiveRowIndex();
				if(!index || index == "") {
					this.resetInCall();
					return false;
				}
				this.action="DELETE";
				/*For edit in embedded pane, if delete is triggered on a row other than the one whose details are expanded, then submit the row details first and schedule delete action later.*/
				if(!this.notSubmitDetails && this.triggerSubmitOnEmbedPaneRow()) {
					return;
				}
				/*Reset the variables if set in triggerSubmitOnEmbedPaneRow*/
				this.resetCustomDeleteRowProps();

				if(this.bPageGroup){
					pega.ctx.gridObj = this;
					var rightRow = this.rightBodyTbl.rows[this.getIndex(index)];
					var subscript = rightRow.getAttribute("PG_SUBSCRIPT");
					pega.u.d.RemoveFromGroup(this.getPLPGProperty(),subscript, this.primPage, this.deleteAct, rightRow , this.refreshLayout?"false":"true");
				}else{
					this.remove(index);
				}
				if(this.submitErrors) {
					this.submitErrors = false;
				}
			},

			remove : function(rowIndex){
				/*For edit in embedded pane, if delete is triggered on a row other than the one whose details are expanded, then submit the row details first and schedule delete action later.*/
				if(!this.notSubmitDetails && this.triggerSubmitOnEmbedPaneRow()) {
					return;
				}
				/*Reset the variables if set in triggerSubmitOnEmbedPaneRow*/
				this.resetCustomDeleteRowProps();

				if(this.submitErrors) {
					this.submitErrors = false;
				}
				if(rowIndex ){
					var rowElement = this.rightBodyTbl.rows[this.getIndex(rowIndex)];
				}else {
					var rowElement = Dom.getFirstChild(this.rightBodyTbl);
				}
				if(this.expandedElem && this.expandedElem==rowElement){
					this.expandedElem = null;
                  	if(!this.bExpandMultipleRows){ /*BUG-228601: Adding an 'if' to change "comingFromAdd" to 'false', coz this property when 'true' it'll cause JS error like "target is not defined" onClick of a row in GRid*/
						this.comingFromAdd = false;
					}
				}
				if (this.bPageGroup) {
					pega.ctx.gridObj = this;
					var subscript = rowElement.getAttribute("PG_SUBSCRIPT");
					pega.u.d.RemoveFromGroup(this.getPLPGProperty(), subscript, this.primPage, this.deleteAct, rowElement, this.refreshLayout?"false":"true");
					if (this.editConfig == this.EDIT_EXPANDPANE) {
						var rowNum = this.getExpandPaneTableLength();
					} else {
						var rowNum = this.getTableLength(this.rightBodyTbl);
					}
					if(rowNum == 1) {
						this.refreshLayout = true;
					}
				} else {
					var rightcontent = this.rightBodyTbl.rows[this.getIndex(rowIndex)];
                                            var pageName; /* BUG-158508: The pageName global variable in RuleFormSettings Section is getting overridden, hence declared local variable here */						if (this.bTreegrid || this.fixedCol) {
						var leftcontent = pega.util.Dom.getElementsById(rightcontent.id, this.leftBodyUL)[0];
						if (leftcontent.id) {
							var parent = leftcontent.parentNode.parentNode;
							pageName = pega.ui.property.toReference(parent.id);
						}
					} else {
						// TODO -  Will the pageName be "" always for a data grid
						var parent = rightcontent.parentNode.parentNode;
						pageName = pega.ui.property.toReference(parent.id);
					}
					var property = this.getPLPGProperty();
					var pyPropRef = pageName + property;
					if(pageName != "") {
						var property = this.PLPGName;
					}
//Fix for Bug-42600. If there is a tree or treegrid we need to calculate the number of topLevel nodes only to show the no-items messages.
					var rowNum = -1;
					if(!this.bTreegrid) {
						if (this.editConfig == this.EDIT_EXPANDPANE) {
							rowNum = this.getExpandPaneTableLength();
						} else {
							rowNum = this.getTableLength(this.rightBodyTbl);
						}
					} else {
						rowNum = this.getTopLevelNodesLength(this.rightBodyTbl);
					}
					if(rowNum == 1 && pageName == ""){ // Do Refresh Layout on deleting last row for no Results message.
						this.refreshLayout = true;
						var noOfPages = Math.ceil(this.totalRecords / this.rangeSize);
						if (noOfPages == this.currentPageIndex) {
							this.currentPageIndex--;
						}
					}
					var objClass = this.getObjClass(rowIndex);
					if(!objClass){
						objClass = this.propertyClass;
					}

					var params = {
							method : "delete",
							grid : this,
						         listBaseRef : this.baseRef,
             			                           listPrimaryPage : this.primPage,
							repeatProperty : property,
							className  : objClass,
							indexElt : rowIndex !="" ? rowElement : "",
							pageName : pageName,
							customActivity : this.deleteAct,
							eventOrTarget : rowElement,
							partialRefresh : this.isPartialRefresh?(this.refreshLayout?"false":"true"):"false",
							repeatType : "list"
					}
					if(params.repeatType=="list" && params.eventOrTarget){
						var eventOrTarget =pega.util.Dom.getElementsById(params.eventOrTarget.id ,this.rightBodyTbl)[0];
						if(eventOrTarget.id==params.eventOrTarget.id)
							params.eventOrTarget=eventOrTarget
					}
					pegaUD.remove(params);
				}
			},

			updateChildHandles:function(eachChild,parentHPref , srcIndex, targetIndex, srcElId,dataSrcVal){
				/* eachChild  parameter would always be UL with  id ="gridNode"
					if id==gridNode
						hasChildren

				*/
				var children= Dom.getChildren(eachChild);
				var totchildren=children.length;
				for(var i=0;i<totchildren;i++){
					var eachNode=children[i];
					var currHPref=eachNode.id;
					var pl_property = this.getPLPGProperty();
					var dotIndex = pl_property.indexOf(".");
					if(dotIndex>=0) {
						pl_property = pl_property.substring(pl_property.lastIndexOf(".")+1);
					}
                    var currIndex, newIndex;
					if(srcElId && eachNode.id==srcElId) {
						var prevSibling = Dom.getPreviousSibling(eachNode);
						currIndex= newIndex= (prevSibling)?parseInt(prevSibling.getAttribute("PL_INDEX"))+1:1;
					}else {
						currIndex= newIndex= (i +1);
					}
                    var newHPref;
					var newId = newHPref = eachChild.parentNode.id+"$p"+pl_property+"$l"+newIndex;
					var rightRows = pega.util.Dom.getElementsById(eachNode.id ,this.rightBodyTbl);
					if(srcIndex && targetIndex && rightRows.length>1) {
						for(var rCnt = 0; rCnt<rightRows.length; rCnt++) {
							var rightrow = rightRows[rCnt];
							if(eachNode.getAttribute("rowUniqueID")==rightrow.getAttribute("rowUniqueID")) {
								break;
							}
						}
					}else {
						var rightrow=rightRows[0];
					}
					/* update left and right row handles */
					pega.u.d.updateHandles(eachNode,currHPref,newHPref, currIndex, newIndex, newId, dataSrcVal);
					pega.u.d.updateHandles(rightrow,currHPref,newHPref, currIndex, newIndex, newId, dataSrcVal);
					/* call  childhandles updation only if gridNode exists */
					if(Dom.getLastChild(children[i]).id=="gridNode") {
						var newParentHPref = newHPref;
						this.updateChildHandles(Dom.getLastChild(children[i]),newParentHPref, srcIndex, targetIndex, srcElId, dataSrcVal)
				 	}

				}
			},

			updateTreeHandlesAfterInsert :function(indexInList,args){
				var grid=this;
				if(args && args.length) {
					var leftcontent = args[0];
					var dropMode = args[1];
					var srcIndex = args[2];
					var targetIndex = args[3];
					var fromDD = true;
				}else {
					var activeIndex = grid.getActiveRowIndex();
					if(activeIndex==null) {
						activeIndex = indexInList;
					}
					var rightcontent=grid.rightBodyTbl.rows[activeIndex];
					var leftcontent=Dom.getElementsById(rightcontent.id,grid.leftBodyUL)[0];
				}

				var parentElem=leftcontent.parentNode;
				if(!parentElem|| !parentElem.id || !parentElem.parentNode) {
					return;
				}
			    var dataSrcVal=grid.dataSourceRef;
				var childrows=Dom.getChildren(parentElem);
				var totalrows=childrows.length;
				/* find the index from where the handles are to be changed*/
                var index,curr_HPref;
				for(var j=0;j<childrows.length;j++){
					if(leftcontent.id==childrows[j].id){
						index=j;
						break;
					}
				}
				if(grid.action == "INSERTBEFORE")
					index--;

				if(!fromDD) {
					curr_HPref=childrows[totalrows-1].id;
					var posValIndex = curr_HPref.search(/[0-9]*$/);
					var posVal = curr_HPref.substring(posValIndex);
				}else {
					var posVal="";
					if(totalrows>1) {
						if(parentElem == this.leftBodyUL) {
							var firstChild = childrows[1];
						}else {
							var firstChild = childrows[0];
						}
						if(firstChild==leftcontent ) {
							curr_HPref = Dom.getNextSibling(leftcontent ).id;
						}else {
							curr_HPref = firstChild.id;
						}
						var posValIndex = curr_HPref.search(/[0-9]*$/);
						posVal = ( parentElem ==this.leftBodyUL)?(totalrows-2):(totalrows-1);
					}else {
						var pl_property = this.getPLPGProperty();
						var dotIndex = pl_property.indexOf(".");
						if(dotIndex>=0) {
							pl_property = pl_property.substring(pl_property.lastIndexOf(".")+1);
						}
						curr_HPref=parentElem.parentNode.id+"$p"+pl_property+"$l"+0;
						var new_HPref = parentElem.parentNode.id+"$p"+pl_property+"$l"+1;
						var new_Index = 1;
						var currId =new_HPref;
						var new_Id=currId;
					}
				}

				if(posVal && !isNaN(posVal)) {
					posVal = (parseInt(posVal)) + 1;
					new_HPref = curr_HPref.substring(0, posValIndex) + posVal;
					new_Index = posVal;
					currId =new_HPref;
					new_Id=currId;
				}
				if(fromDD) {
					index = index -1;
				}
				/* loop over the siblings to  update  handles*/
				for(j = totalrows-1  ; j > index;j--){

					var prev_HPref=curr_HPref=childrows[j].id;
					var prev_Id=childrows[j].id;
                    var curr_Index;
					var prev_Index=curr_Index=childrows[j].getAttribute("PL_INDEX");
					/*When a top level node is dropped down as child for a sibling or dropped down as sibling for another top level node's child, all the handles are updated in updateTreeHandlesAfterDelete. So, don't update handles again here.*/
					if(fromDD && (prev_HPref==new_HPref)) {
						return;
					}
					var rightRows = pega.util.Dom.getElementsById(childrows[j].id,this.rightBodyTbl);
					if(srcIndex && targetIndex && rightRows.length>1) {
						for(var rCnt = 0; rCnt<rightRows.length; rCnt++) {
							var rightrow = rightRows[rCnt];
							if(childrows[j].getAttribute("rowUniqueID")==rightrow.getAttribute("rowUniqueID")) {
								break;
							}
						}
					}else {
						var rightrow=rightRows[0];

					}
					/* update handles left row & right row  */
					pega.u.d.updateHandles(childrows[j],curr_HPref,new_HPref, curr_Index, new_Index, new_Id,dataSrcVal);
					pega.u.d.updateHandles(rightrow,curr_HPref,new_HPref, curr_Index, new_Index, new_Id,dataSrcVal);

					/* update child handles*/
					if(Dom.getLastChild(childrows[j]).id=="gridNode") {
						/*When updating child handles here, if there are more than on TR with same id, */
						grid.updateChildHandles(Dom.getLastChild(childrows[j]),new_HPref, srcIndex, targetIndex,dataSrcVal);
					}
					new_HPref=prev_HPref;
					new_Id=prev_Id;
					new_Index=prev_Index

				}
			},

			updateTreeHandlesAfterDelete : function(args){
				var grid = this;
                var curr_HPref;
                var prev_Id, prev_Index;
				if(args && args.length && args.length == 6) {
					var leftcontent = args[0];
					var prev_HPref = args[1];
					prev_Index = args[2];
					prev_Id = args[3];
					var srcElId = args[3];
					var srcIndex = args[4];
					var targetIndex = args[5];
					var fromDD = true;
				} else {
					var rightcontent  = grid.rightBodyTbl.rows[grid.getActiveRowIndex()];
					var leftcontent = Dom.getElementsById(rightcontent.id,grid.leftBodyUL)[0];
				}
				var parentElem=leftcontent.parentNode;

              	var dataSrcVal=grid.dataSourceRef;
                var childrows=Dom.getChildren(parentElem);
				var totalrows=childrows.length;
                var index;
				for(var j=0;j<childrows.length;j++){
					if(leftcontent.id==childrows[j].id){
						index=j;
						break;
					}
				}

				if(!fromDD) {
					prev_HPref = childrows[index].id;
					prev_Index = childrows[index].getAttribute("PL_INDEX");
					prev_Id = childrows[index].id;
				}
				if(!fromDD)
					var j = (index+1);
				else
					var j = index;
				for(j;j<totalrows;j++){
					var new_HPref=prev_HPref;
					var prevHPrefParam=prev_HPref;
					var new_Id=prev_Id;
					var new_Index=prev_Index

					prev_HPref=curr_HPref=childrows[j].id;
					prev_Id=childrows[j].id;
                    var curr_Index;
					prev_Index=curr_Index=childrows[j].getAttribute("PL_INDEX");
					/*left row */

					var rightRows = pega.util.Dom.getElementsById(childrows[j].id,grid.rightBodyTbl);
					if(srcIndex && targetIndex && rightRows.length>1) {
						for(var rCnt = 0; rCnt<rightRows.length; rCnt++) {
							var rightrow = rightRows[rCnt];
							if(childrows[j].getAttribute("rowUniqueID")==rightrow.getAttribute("rowUniqueID")) {
								break;
							}
						}
					}else {
						var rightrow=rightRows[0];

					}
					pega.u.d.updateHandles(childrows[j],curr_HPref,new_HPref, curr_Index, new_Index, new_Id, dataSrcVal);
					/*rightrow */

					pega.u.d.updateHandles(rightrow,curr_HPref,new_HPref, curr_Index, new_Index, new_Id,dataSrcVal);
					if(Dom.getLastChild(childrows[j]).id=="gridNode") {
						grid.updateChildHandles(Dom.getLastChild(childrows[j]),new_HPref,srcIndex, targetIndex, srcElId, dataSrcVal);
					}

				}
			},
			/*API used to expand the collapsed nodes in a Tree/Tree grid while doing some actions on the collapsed nodes*/
			expandCollapsedNodes : function() {
				var newleftRow = this.getLeftRow();
				if(newleftRow) {
					var parentUL = newleftRow.parentNode;
					while(parentUL && parentUL!=this.leftBodyUL) {
						if(parentUL && parentUL.id=="gridNode" && parentUL.style.display=="none") {
							var rowContUL = Dom.getPreviousSibling(parentUL);
							var expCollIcon = Dom.getElementsById("iconExpandCollapse",rowContUL)[0];
							//this.expandCollapseNode(expCollIcon.parentNode.parentNode,"block");
							var expCollNode = Dom.getFirstChild(expCollIcon);
							this.doExpandCollapse(null,null,null, this, expCollNode);
							break;
						}
						parentUL = parentUL.parentNode.parentNode;
					}
				}
			},
			/*
			@private  loads the returned row content into this table
			@param $undefined$newStream– parameter description goes here.
			@param $undefined$partialParams– parameter description goes here.
			@param $undefined$reloadElement– parameter description goes here.
			@return $void$
			*/
			loadRow : function (newStream, partialParams,reloadElement,RLInfo,bFromLoadRows) {
				var partialParams = partialParams;
				if(partialParams.partialTrigger.indexOf("delete")>-1 && newStream.indexOf("ERRORTABLE")>-1 && newStream.indexOf("PEGA_GRID_DELETE||DELETE_SUCCESS||")==-1) {
					return;
				}
				var gridObject = this;
				var loadGridHTMLEleCallback = function(domObj) {
					if((partialParams.partialTrigger=="delete" && partialParams.domElement && partialParams.domElement.nodeName=="TR" && partialParams.execAfterLoadRow) || (domObj && domObj.nodeName=="TR" && bFromLoadRows)){
						gridObject.afterLoadRow(partialParams.partialTrigger,RLInfo[2],RLInfo[0],partialParams.domAction,partialParams,newStream);
                      	if(window.LayoutGroupModule) {/* BUG-272239, HFix-30179: Error messages displayed above tab group are not cleared when a row with client side errors is deleted */
                          LayoutGroupModule.checkForErrors();
                        }
					}
					if(domObj && domObj.id != "PegaOnlyOnce") {
						pega.u.d.processOnloads(domObj);
					}
					pega.u.d.gIsScriptsLoading = false;
				}
				var grid = this;
				pegaUD.activeStream = new Array();
				var tempDiv = document.createElement("div");
				/* break the newStream in left and right row markups */
				var leftRowEndsAt = newStream.indexOf("||PEGA||GRID||") ;
				var rightRowEndsAt = newStream.indexOf("||END||");
				var streams = [ newStream.substring(0, leftRowEndsAt-1),
								newStream.substring(leftRowEndsAt + 14,rightRowEndsAt-1)
							  ];
				if((!pega.env.ua.ie) || pega.u.d.inStandardsMode) {
					/*
					return false --- BUG-24277: when file upload is used,since partial refresh does not return tr in table, in FF and safari, the html returned does not have tr.
					Suppress this error for now, except in case of "delete" action
					this.refreshRows --- BUG-116085: The current response is not being handled in this case hence refreshing current row to get the latest values of the row available at the server.
					*/
					//if(partialParams.partialTrigger.indexOf("delete") < 0 && streams && streams[1] && (pega.lang.trim(streams[1]).indexOf("<tr")!= 0 && pega.lang.trim(streams[1]).indexOf("<TR")!= 0)){
					if(partialParams.partialTrigger.indexOf("delete") < 0 && streams && streams[1] && (pega.lang.trim(streams[1]).indexOf("<table")!= 0 && pega.lang.trim(streams[1]).indexOf("<TABLE")!= 0)){
						if(partialParams.domElement[0]){
							var paramObjForRefreshRows = {};
							paramObjForRefreshRows.refObj = this;
							paramObjForRefreshRows.rowsArray = [];
							paramObjForRefreshRows.rowsArray[0] = pega.ui.property.toReference(partialParams.domElement[0].id);
							this.setTopPriorityAction(this.refreshRows, paramObjForRefreshRows);
						}
						return false;
					}
				}
				/* load left and right row */
				var domElements = partialParams.domElement;
				var domActionChanged = false;
				partialParams.bTreegrid=this.bTreegrid;
        /*BUG-640742 In Hierarchical list previous collapsed item getting expanded */
        // Stop expanding the previous collapsed item when ModalAction is JUMP
				if(this.bTreegrid && !partialParams.bNotExpandRow) {
					this.expandCollapsedNodes();
				}
				if(partialParams.partialTrigger.indexOf("delete")>-1){
					for(var i = 0; i< domElements.length; i++){
                        var endIndex;
						partialParams.domElement = domElements[i];
						if(grid.bTreegrid) {
							if(i==0){
								var startLI = Dom.getElementsById(partialParams.domElement.id, grid.leftBodyUL, "LI")[0];
								var startIndex = Dom.getElementsById(startLI.id ,grid.rightBodyTbl)[0].rowIndex;
								var endLI= startLI;
								while(endLI.id!="gridBody_left"){
									temp=Dom.getNextSibling(endLI);
									if(temp==null)
										endLI=endLI.parentNode.parentNode;//go  till we find  li with id as hPref
									else {
										endLI=temp;
										break;
									}
								}
								if(endLI.id!="gridBody_left"){
									if(endLI.id==startLI.id)
										var endTR = Dom.getElementsById(endLI.id ,grid.rightBodyTbl)[1];
									else
										var endTR = Dom.getElementsById(endLI.id ,grid.rightBodyTbl)[0];
										endIndex=	endTR.rowIndex;
								}
								else
									endIndex=this.rightBodyTbl.rows.length; //we have to consider as if we have a nextSibling in this case
							}else{
								var childRowsToRemove = 0;
								if(endIndex!=startIndex)
									childRowsToRemove = endIndex-startIndex; //exclude the parent as startIndex represents parent
								for(var rIndex=1; rIndex<childRowsToRemove; rIndex++) {
									partialParams.domElement=grid.rightBodyTbl.rows[startIndex +1 ];  //startIndex + 1  would be childs rowIndex
									pegaUD.loadDOMObject(reloadElement, "" ,loadGridHTMLEleCallback, partialParams);
								}
								partialParams.domElement=domElements[i];

							}
						}
						/*B-39043 : In case of delete , !fixedCol and !bTreeGrid dont call the loadDomObject twice so continue*/

						if(i==0 && !this.bTreegrid && !this.fixedCol) {
							continue;
						}
						if(i==1 && this.editConfig==this.EDIT_EXPANDPANE) {
							var nextTR = Dom.getNextSibling(domElements[i]);
							if(nextTR) {
								var faDiv = Dom.getElementsById("rowDetail"+domElements[i].id, nextTR, "DIV");
								if(faDiv && faDiv[0])
									faDiv = faDiv[0];
							}
						}
						/*set the execAfterLoadRow to true, so that afterLoadRow gets triggered after removing the last row. This is to ensure that afterLoadRow is not called while deleting the child nodes in tree grid */
						if(i==1) {
							partialParams.execAfterLoadRow = true;
						}

						pegaUD.loadDOMObject(reloadElement, streams[i] ,loadGridHTMLEleCallback, partialParams);
						/*Remove the details row for expand pane if existing*/
						if(i==1 && this.editConfig==this.EDIT_EXPANDPANE && faDiv) {
							var faRow = faDiv.parentNode.parentNode;
							partialParams.domElement = faRow;
							/*deduct the height from grid's property*/
							if(this.pageMode=="Progressive Load") {
								this.expDetailsHeight -= faRow.offsetHeight;
							}
							pegaUD.loadDOMObject(reloadElement, "" ,loadGridHTMLEleCallback, partialParams);
						}
					}
					if (pega.ui.ChangeTrackerMap.getTracker().changedPropertiesList.length > 0) {
						/* OGRD - On Grid Row Delete */
                      	pega.u.d.preReloadEle = null;/* BUG-199018: Clear pega.u.d.preReloadEle and proceed with evaluateClientConditions() otherwise isSafeToReload() returns false and no ajax request is sent if preReloadEle == reloadElement */
						pega.u.d.evaluateClientConditions('OGRD',null,true,true);
					}
				}else{
					var origHeight = 0;
                    var result;
					if(domElements[0] && partialParams.partialTrigger.indexOf("edit") != -1 && domElements[0].id!="yui_modalrownew" ) {
						result=	this.getResizedElement(domElements[0]);
						if(result && result[0])
							origHeight = parseInt(result[0].style.height);
					}
					for(var i = 0; i< domElements.length; i++) {
					/*BUG-57355: put the values of partialParams in another object to avoid change of the properties in the second iteration.*/
						var newPartialParams = new Object();
						for(var prop in partialParams) {
							newPartialParams[prop] = partialParams[prop];
						}
						if(i==0 && !this.bTreegrid && !this.fixedCol) {
							continue;
						}
						if(i == 0 && (this.bTreegrid || this.fixedCol)) {
							/* do not allow lazy load processing while addind the left row markup in DOM;
							 * instead proceed with lazy load when loading the right row markup.
							 */

							var stopLazyLoad = function() { pega.u.d.lazyLoadManager.detachBeforeLoad(stopLazyLoad); return false;};
							pega.u.d.lazyLoadManager.attachBeforeLoad(stopLazyLoad);
						}
						newPartialParams.domElement = domElements[i];
						var temp=null;
						if(i==0 && this.bTreegrid && this.leftrowbefore){
							temp=this.leftrowbefore.cloneNode(true);
						}
						if(domActionChanged && newPartialParams.domAction =="append") {
							newPartialParams.domAction = "insert";
						}
						if((newPartialParams.domAction=="insert") && (domElements[i].tagName=="UL" || domElements[i].tagName=="TBODY")) {
							newPartialParams.domAction = "append";
							domActionChanged = true;
						}
						pegaUD.loadDOMObject(reloadElement, streams[i] ,loadGridHTMLEleCallback, newPartialParams);
						if(i==1){
							//tempDiv.innerHTML = "<table>" + streams[i] + "</table>";
							tempDiv.innerHTML = streams[i];
                            /* BUG-278141: Use jQuery to identify the row */
							//var tempRow = Dom.getOuterHTML(Dom.getFirstChild(tempDiv).rows[0]);
							//var tempTbl = document.createElement("div");
							//tempTbl.innerHTML = "<table>" + tempRow + "</table>";
							pegaUD.activeStream.push(jQuery(tempDiv).children("table").get(0).rows[0]);
						}else{
							tempDiv.innerHTML = streams[i] ;
							if(this.bTreegrid){
								var ul= Dom.getFirstChild(pega.util.Dom.getFirstChild(tempDiv));
								pegaUD.activeStream.push(ul.cloneNode(true));
							}else
								pegaUD.activeStream.push(pega.util.Dom.getFirstChild(tempDiv).cloneNode(true));
						}
						/*for expand Pane, load the details row also in append action */
						if(i==1 && this.editConfig==this.EDIT_EXPANDPANE && newPartialParams.partialTrigger.indexOf("appendTo")>=0) {
							var faRow = Dom.getFirstChild(tempDiv).rows[1];
							if(faRow) {
								var flowActionStream = Dom.getOuterHTML(faRow);
								pegaUD.loadDOMObject(reloadElement, flowActionStream ,loadGridHTMLEleCallback, newPartialParams);
							}
						}
						if(temp)
							this.leftrowbefore =temp;
					}
					if(domElements[0] && newPartialParams.partialTrigger.indexOf("edit") != -1 &&domElements[0].id!="yui_modalrownew" && this.bRowResize) {
						result=	this.getResizedElement(domElements[0]);
						if(!this.refreshLayout && !isNaN(origHeight) && origHeight!=0 && this.rightBodyTbl.rows[this.getIndex(this.activeRow)].offsetHeight != origHeight) {
							this.doRowResize({height: origHeight}, [result[0],this, result[1]]);
						}
					}
				}
				try {
					var actionIframe = window.parent.frames.actionIFrame;
					if(typeof(actionIframe)!="undefined"){
						pega.u.d.resizeActionIFrame(false);
					}
				} catch(excep){/* cross domain security issues causes exception in IAC mode */}

				if(this.editConfig==this.EDIT_MODAL && pega.u.d.bModalDialogOpen){
					pega.u.d.resizeModalDialog();
				}
				/*Remove No results message if it's there in DOM*/
				this.removeGridNoResultsMsg();
			},

			callInitGridsAndFocusRow : function() {
					pega.ui.initGrids(this);
					this.selectPage(null,null,this.activeRow); /* Setting the active row so that the key board events work: BUG-80116 */
			},

			/*
			@private   gets called before loadDOMObjec
			@param $undefined$RLInfo– parameter description goes here.
			@param $undefined$responseObj– parameter description goes here.t
			@return $void$
			*/
			loadGridRows : function(RLInfo, responseObj) {
				if(!RLInfo || !RLInfo.length || RLInfo.length < 3)
					return;
				var indexInList = RLInfo[0];
				var gridTables = RLInfo[1];
				var repeatType = RLInfo[2];

				var reloadElement = responseObj.argument[0];
				var newStream = responseObj.responseText;
				var partialParams = responseObj.argument[6];
				var domAction = partialParams.domAction;
				var partialTrigger = partialParams.partialTrigger;
				if (repeatType === "list") {
					if(domAction === "insert" && indexInList !== "" && partialTrigger.indexOf("editRow") < 0){
						if(!this.bTreegrid) {
							if(this.action=="INSERTBEFORE") {
								pega.u.d.updateHandlesAfterInsert([indexInList-1, gridTables,this]);
							}
							else {
								pega.u.d.updateHandlesAfterInsert([indexInList, gridTables,this]);
							}
						}
						else if(this.bTreegrid && partialParams.gridAddAction != "ADDCHILD") {
							this.updateTreeHandlesAfterInsert(indexInList);
						}else if(partialParams.gridAddAction == "ADDCHILD" && this.bFilteredGrid) {
							/*Reset the partial refresh to true after add child*/
							this.refreshLayout = true;
						}
					}else if(domAction === "remove" && (newStream.indexOf("ERRORTABLE")<0 || newStream.indexOf("PEGA_GRID_DELETE||DELETE_SUCCESS||")>-1)){
						if(!this.bTreegrid) {
							/*BUG-104946: Do not update the indexInList value for RD bound grid.*/
							if(this.currentPageIndex && this.currentPageIndex!="" && this.pyPaginateActivity=="" && this.pageMode!="Progressive Load" && !this.bReportDefinition) {
								/*getting some issues with deleting 1st and last row for expand pane.So, added this code only for expand pane*/
								if(this.editConfig==this.EDIT_EXPANDPANE) {
									pega.u.d.updateHandlesAfterDelete([(indexInList-((this.currentPageIndex-1)*this.rangeSize)), gridTables, this]);
								}else {
									pega.u.d.updateHandlesAfterDelete([(indexInList-((this.currentPageIndex-1)*this.rangeSize)-1), gridTables, this]);
								}
							}else {
								if(this.editConfig==this.EDIT_EXPANDPANE) {
									pega.u.d.updateHandlesAfterDelete([indexInList, gridTables, this]);
								} else if(this.pageMode == "Progressive Load" && !this.bCBOptimize && this.bDiscardInvisibleRows) {
									/* BUG-208494: Pass current row index if above condition meets. */
									pega.u.d.updateHandlesAfterDelete([this.getActiveRowIndex() - 1, gridTables, this]);
                                } else {
									/* BUG-158817: Don't update the handles for the row to be deleted */
									pega.u.d.updateHandlesAfterDelete([indexInList, gridTables, this]);
								}
							}
						}
						else
							this.updateTreeHandlesAfterDelete();
						this.triggerBrowserReflow(); /*BUG-107303*/
					}
				}

				this.loadRow(newStream, partialParams,responseObj.argument[0],RLInfo,true);
				return false;


			},
			afterLoadRow: function(partialTrigger,repeatType,indexInList,domAction,partialParams,newStream){
				if(partialTrigger.indexOf("appendTo")>=0){
					if(this.activeRow) {
						if(this.action == "INSERTBEFORE" && !this.bPageGroup) { /*for insertbefore, the active row will be same as the new row inserted. so, unhighlight the next row.*/
							this.selectRow(parseInt(this.activeRow, 10)+1, false);
						}else {
							this.selectRow(this.activeRow, false);
						}
					}
					var nextActRow = "";
					if(this.bGrid == true){
						if(repeatType=="list"){
							if(indexInList!="") {
								if(this.action && this.action=="INSERTBEFORE") {
									nextActRow = indexInList;
								}else {
									nextActRow = parseInt(indexInList) +1;
								}
							}else if(this.editConfig==this.EDIT_EXPANDPANE && (!this.threadProcessing && this.bExpandMultipleRows)){
								if(!this.rightBodyTbl.rows[this.rightBodyTbl.rows.length-1].id) {
									nextActRow = this.rightBodyTbl.rows.length-2;
								}else { /*When afterLoadRow is called after just loading the content row, then return. */
									return;
								}
								nextActRow = this.getActiveRowIndexFromRowIndex(nextActRow);
							}else {
								var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
								if(grid_noRes && grid_noRes[0]) {
									this.removeGridNoResultsMsg();
								}
								nextActRow = this.rightBodyTbl.rows.length-1;
							}
						}else{
							/*BUG-66547 : In case of page group with expand pane set (length - 2) instead of (length - 1).*/
							if(this.editConfig==this.EDIT_EXPANDPANE && (!this.threadProcessing && this.bExpandMultipleRows)) {
								if(!this.rightBodyTbl.rows[this.rightBodyTbl.rows.length-1].id) {
									nextActRow = this.rightBodyTbl.rows.length-2;
								}else { /*When afterLoadRow is called after just loading the content row, then return. */
									return;
								}
								nextActRow = this.getPGRowIndex(nextActRow);
       						}else {
        						nextActRow = this.rightBodyTbl.rows.length-1;
       						}
						}
					}else{
						nextActRow = partialParams.domElement[1].previousSibling.rowIndex;
					}
					this.activeRow = nextActRow;
					if(this.editConfig==this.EDIT_EXPANDPANE){
						var rightRow = this.getRightRow();
						if(this.threadProcessing || !this.bExpandMultipleRows){
							this.expandedElem = rightRow;
						}
						rightRow.setAttribute("rowExpanded", "true");
					}
					if(this.pageMode=="Progressive Load" && this.editConfig==this.EDIT_EXPANDPANE) {
						var dtlsRow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)+1];
						if(dtlsRow && dtlsRow.id=="" && dtlsRow.getAttribute("expanded")=="true") {
							this.expDetailsHeight += dtlsRow.offsetHeight;
							this.layoutWrapperDiv.scrollTop += this.getRightRow().offsetHeight;
						}
					}
					/*BUG-58837: Do not set focus on the added row for FA based edit modes. Pass an extra element to editRowCallback*/
					if(this.editConfig==this.EDIT_MODAL || this.editConfig==this.EDIT_HARNESS) {
						this.editRowCallback([this, this.activeRow, true]);
					}else {
						/* BUG-147007 : Setting previous focus element as null */
						this.focusElem = null;
                        /*BUG-249430*/
                      	if( this.editConfig == this.EDIT_EXPANDPANE && partialParams.afterParams.length > 2 && partialParams.afterParams[2] != null && partialParams.afterParams[2]["responseText"] ){
                            var bVar;
							this.editRowCallback([this, this.activeRow, bVar, partialParams.afterParams[2]]);
						}else{
							this.editRowCallback([this, this.activeRow]);
						}
					}
				}else{
					if (!pega.ctx.Grid.focusedGrid || pega.ctx.Grid.focusedGrid != this) {
						// BUG-64548:if pega.ctx.Grid.focusedGrid is null then focus event has been fired before the loadRow and made this grid's focus disabled.
						// Hence disabling the grid focus after loading row.
						this.focusGrid(false);
					}
					if(partialParams.partialTrigger.indexOf("delete")>-1 && newStream.indexOf("ERRORTABLE")>-1 && newStream.indexOf("PEGA_GRID_DELETE||DELETE_SUCCESS||")==-1) {
						this.action = "";
						return;
					}
					if (this.editConfig == this.EDIT_EXPANDPANE) {
						var totalRows = this.getExpandPaneTableLength();
					} else {
						var totalRows = this.getTableLength(this.rightBodyTbl);
					}
					if(totalRows>0) { //If there are still rows available in the grid, select the next row. If last row is delete, select the last but first row.
						if(this.editConfig==this.EDIT_EXPANDPANE){
							this.activeRow = this.getIndex(this.activeRow)?this.activeRow : this.activeRow-1;
						}
						if(this.activeRow>totalRows) {
							this.activeRow = this.activeRow-1;
						}
						this.selectRow(this.activeRow, true);
						if(this.editConfig == this.EDIT_HARNESS){

							if(partialTrigger!="delete") {
								this.DONOT_SUBMIT = true;
								var e;
								this.jumpToIndex(e,this.activeRow);
							}
							else if(partialTrigger=="delete" && Dom.getElementsById("pyFlowActionHTML", this.gridDetailsDiv))
							{
								var nextSelectedRow = this.getLeftRow();
								if (nextSelectedRow){
									var flowActionDiv = Dom.getElementsById("pyFlowActionHTML", this.gridDetailsDiv)[0];
									if(flowActionDiv && flowActionDiv.parentNode) {
										/*BUG-108448: Call clean up API before removing embed pane details div during DELETE */
										pegaUD.cleanUpHarnessElements(null, [flowActionDiv]);
										flowActionDiv.parentNode.removeChild(flowActionDiv);
									}
									var firstChild = Dom.getFirstChild(nextSelectedRow);
									if(firstChild == null){
										nextSelectedRow = nextSelectedRow.nextSibling;
									}
									var argsObj = {rowEle: nextSelectedRow, refObj:this};
									this.setTopPriorityAction(this.triggerEditInHarness, argsObj);
								}
							}
						}
						if (this.bDiscardInvisibleRows && partialTrigger=="delete") {
							this.totalRecords--;
						}
						/* trigger progressive load when not appending a row;
						 * do not trigger if current operation is to inline edit the row
						 */
						if(this.pageMode=="Progressive Load" && (this.editConfig != this.EDIT_ROW || partialTrigger.indexOf("editRow")== -1) && this.totalRecords>this.rangeSize) {
								this.bCustomLoad = true;
								this.progressiveLoadGrid();
						}
					}else {
						this.activeRow = null;
					}
				}

				/*@protected return false to tell handlePartialSuccess that loading of DOM objects are done here; it need not continue loading */
				if(this.callback && typeof(this.callback ) == "function") {
					this.callback.call(window,newStream);
					this.callback = null;
				}
				var dtlsRow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)+1];
				/* Don't reset this.action during grid row's afterLoadRow but reset it during details row's afterLoadRow is executed.*/
				if (this.editConfig == this.EDIT_EXPANDPANE) {
					if (dtlsRow && !dtlsRow.id) {
						this.action = "";
					}
				} else {
					this.action = "";
				}
				if(this.bDragDrop && domAction == "remove"){
					this.unregRelatedDDTargets();
				}
				if(partialTrigger=="delete" && !this.fixedCol && this.fixedRow) {
					if(this.rightHeaderDiv){
						var rightHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
					}
					if(!(this.layoutWrapperDiv.scrollHeight > this.layoutWrapperDiv.clientHeight && this.layoutWrapperDiv.clientHeight != 0 && rightHeaderTbl && rightHeaderTbl.rows && rightHeaderTbl.rows[0].style.display!="none")) {
						var scrollHeads;
						if(Dom.hasClass(this.gridcontDiv,"gPercent") == false) {
							scrollHeads = Dom.getElementsByClassName("scrollHead", "th", rightHeaderTbl);
						}else{
							scrollHeads = Dom.getElementsByClassName("scrollHead", "div", this.rightHeaderDiv);
						}
						if(scrollHeads && scrollHeads.length>0){
							scrollHeads[0].parentNode.removeChild(scrollHeads[0]);
							if(Dom.hasClass(this.gridcontDiv,"gPercent")){
								var gridHeaderTbl = Dom.getFirstChild(this.rightHeaderDiv);
								gridHeaderTbl.style.width="100%";
							}
						}
					}
				}
				this.setHeadersWidth();
				this.gridResized();
			  this.autoAdjustProgressiveGridHeight({afterLoadRow:"true"});
			},
			enableSaveDiscardButtons: function(event) {
				var rightRow = this.getRightRow();
				if(!rightRow) {
					return;
				}
				var rowDetail = Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl);
				if(!rowDetail) return;
				else rowDetail = rowDetail[0];

				var discardButton = Dom.getElementsById("RowDetailsButtonCancel", rowDetail);
				var saveButton  = Dom.getElementsById("RowDetailsButtonSubmit", rowDetail);

				if(event == null || event!=null && Dom.isAncestor(rowDetail, Event.getTarget(event))) {
					if(discardButton && discardButton[0] && saveButton && saveButton[0] ){
						discardButton[0].disabled = false; // Enabling buttons.
						saveButton[0].disabled = false;
					}
				}
			},
			submitAndAppendRow:function(type,target,keyCode, container) {
				this.markAsDirty();
				if(keyCode==13) {
					var el = target;
					//don't submit the row if enter key is pressed on an anchor or button or td (BUG-147883).
					if(el && el.tagName && (el.tagName =="A" || el.tagName =="BUTTON" || el.tagName =="TD")) {
						this.resetInCall();
						return;
					}
					this.isEnterKeyAppend = true;
					if(!this.activeRow){
						if(pegaUD.activeStream && pegaUD.activeStream.length > 2)
							this.activeRow = pegaUD.activeStream[2];
					}

					var isDirty = this.submitRow(type,target,keyCode);
                    var leftrow;
					if(isDirty === false) {
						var rightrow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)];
						if(this.bTreegrid || this.fixedCol){
                            leftrow = pega.util.Dom.getElementsById(rightrow.id, this.leftBodyUL, 'LI')[0];
						}

						this.isEnterKeyAppend = false;
						if(this.leftrowbefore) {
							if(this.bTreegrid) {
								leftrow.setAttribute("rowUniqueID", this.leftrowbefore.getAttribute("rowUniqueID"));
							}
							if(this.bTreegrid)
								leftrow.replaceChild(this.leftrowbefore.firstChild, Dom.getFirstChild(leftrow));
							else
								this.leftBodyUL.replaceChild(this.leftrowbefore ,leftrow );
						}
						var tbody=Dom.getFirstChild(this.rightBodyTbl);
						if(this.rightrowbefore) {
							tbody.replaceChild(this.rightrowbefore, rightrow );
						}
						this.action = "INSERTAFTER";
						this.leftrowbefore = this.rightrowbefore = null;
						if (this.bFilteredGrid) {
							this.refreshLayout = true;
						}
						this.insert(this.activeRow);
					}
				}else {
					this.resetInCall();
				}
			},

			/*
			@private Sets Focus in the newly edited row
			@return $void$
			*/
			focusOnNewEditableRow : function(){
				var index = this.activeRow;
				/*BUG-164582: Added null check for 'index'*/
				if(index != null){
				var actRowIndex = this.getIndex(index);
				if(this.editConfig == this.EDIT_ROW){
					/*BUG-152730: Starts*/
					if(!this.bTree && !this.bTreegrid){ /*Grid case*/
						var element;
						if (this.focusElem) {
							element = this.rightBodyTbl.rows[actRowIndex].cells[this.focusElem.index];
						} else {
							element = this.rightBodyTbl.rows[actRowIndex];
						}
						/* BUG-138024 - Adding formElementsOnly parameter as true */
						if(this.focusFirstElement(element, true)!=true) {
							if(this.bTreegrid || this.fixedCol){
                                var row = pega.util.Dom.getElementsById(this.rightBodyTbl.rows[actRowIndex].id, this.leftBodyUL, "LI")[0];
								if(!this.focusFirstElement(row)) {
									var row = this.rightBodyTbl.rows[actRowIndex];
									this.focusFirstElement(row);
								}
							} else {
								var row = this.rightBodyTbl.rows[actRowIndex];
								this.focusFirstElement(row);
							}
						}
					}else{/*Tree/Treegrid case*/
						if(this.bTreegrid || this.fixedCol){
							/*BUG-152730: If focusElem is there, get the cell index and focus it.*/
                            var row = Dom.getChildren(Dom.getFirstChild(pega.util.Dom.getElementsById(this.rightBodyTbl.rows[actRowIndex].id, this.leftBodyUL, "LI")[0]))[1];
							if(this.focusElem && this.focusElem.tag=="TD"){
								row = this.rightBodyTbl.rows[actRowIndex].cells[this.focusElem.index];
							}
							if(!this.focusFirstElement(row)) {
								this.focusFirstElement(this.rightBodyTbl.rows[actRowIndex]);
							}
						} else {
							var row = this.rightBodyTbl.rows[actRowIndex];
							if(this.focusFirstElement(row)!=true) {
								this.focusFirstElement(this.rightBodyTbl.rows[actRowIndex]);
							}
						}
					}

					this.focusElem = null;
				} else {
					var rightcontent = this.rightBodyTbl.rows[actRowIndex];
					if(!rightcontent)
						return;
					var leftContent = null;
					if(this.bTreegrid || this.fixedCol){
                        leftContent = pega.util.Dom.getElementsById(rightcontent.id, this.leftBodyUL, "LI")[0];
					}

                  /*BUG-244582 - focus first element in the second LI of LeftContent*/
                  var secondLIElement=jQuery(leftContent).find('ul>li:nth-child(2)');
                  if(!secondLIElement[0]){
                    secondLIElement[0]=leftContent;
                  }
					if(!this.focusFirstElement(secondLIElement[0], true)) {
						if(!this.focusFirstElement(rightcontent,true)) {
							this.focusFirstElement(leftContent,true);
						}
					}
				}
				}
			},


			/*
			@private Sets Focus in the first form element
			@param $parent$ The element which has to be checked
			@param $undefined$content– parameter description goes here.
			@return $boolean$ true/false
			*/
			focusFirstElement : function(content, formElementsOnly) {
				if(!content) {
					return;
				}
				/* Add tabindex to the first cell */
				if(Dom.getFirstChild(content) && Dom.getFirstChild(content).nodeName === "TD" && content.getAttribute("expanded") !== "true" && content.nodeName === "TR" && !this.hasFocusableContent(Dom.getFirstChild(content))) {
					Dom.getFirstChild(content).tabIndex="0";
				}
				var focustags = content.getElementsByTagName("*");
				for(var len =0 ; len < focustags.length; len++){
					var felem = focustags[len];
          var boundingRec = felem.getBoundingClientRect();
          var hasPositionInDOM = true;
          if(boundingRec)
              hasPositionInDOM = boundingRec.width > 0 && boundingRec.height > 0;
					if(felem.disabled || !hasPositionInDOM) {
						continue;
					}
					var fNodeName = felem.nodeName;
					if ((fNodeName === "A" || fNodeName === "BUTTON" || fNodeName === "SELECT" || fNodeName === "INPUT"|| fNodeName ===  "TEXTAREA" || ((fNodeName==="TD" || fNodeName==="TH" || fNodeName==="SPAN" || fNodeName==="DIV" || fNodeName==="IMG" || fNodeName==="I") && felem.outerHTML.split(">")[0].toUpperCase().indexOf("TABINDEX") !== -1))&& (felem.type !== "hidden" && ((felem.currentStyle && felem.currentStyle.visibility !== "hidden" && felem.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(felem, "").visibility !== "hidden" && window.getComputedStyle(felem, "").display !== "none"))) && felem.offsetWidth > 0) {
						if(formElementsOnly && (fNodeName == "TD" || fNodeName == "A" ||(fNodeName=="SPAN" && felem.className=="pageIndex"))) {
							continue;
						}
						try {
                          /* BUG-329193:(SE-37692/SE-32907) focus is happening twice on mandatory column in IE for read-write grids */
						  felem.focus();
						}catch(e){return false;}
						return true;
					}
				}
			},
			focusLastElement : function(content, formElementsOnly) {
				if(!content) {
					return;
				}
				/* Add tabindex to the first cell */
				if(Dom.getFirstChild(content) && Dom.getFirstChild(content).nodeName === "TD" && content.getAttribute("expanded") !== "true" && content.nodeName === "TR" && !this.hasFocusableContent(Dom.getFirstChild(content))) {
					Dom.getFirstChild(content).tabIndex="0";
				}
				if(content.nodeName == "LI" && Dom.hasClass(content, "gridRow")) {
					content = Dom.getFirstChild(content);
				}
				var focustags = content.getElementsByTagName("*");
				for(var len =focustags.length - 1 ; len >= 0; len--){
					var felem = focustags[len];
					if(felem.disabled) {
						continue;
					}
					var fNodeName = felem.nodeName;
					if ((fNodeName == "A" || fNodeName == "BUTTON"||fNodeName == "SELECT"||fNodeName == "INPUT"|| fNodeName ==  "TEXTAREA" || ((fNodeName=="TD" || fNodeName=="TH" || fNodeName=="SPAN" || fNodeName=="DIV" || fNodeName=="IMG" ||  fNodeName=="I") && felem.outerHTML.split(">")[0].toUpperCase().indexOf("TABINDEX") != -1))&& (felem.type != "hidden" && ((felem.currentStyle && felem.currentStyle.visibility != "hidden" && felem.currentStyle.display != "none") || (window.getComputedStyle && window.getComputedStyle(felem, "").visibility != "hidden" && window.getComputedStyle(felem, "").display != "none")))) {
						if(formElementsOnly &&( fNodeName == "A" ||(fNodeName=="SPAN" && felem.className=="pageIndex"))) {
							continue;
						}
						try {
						felem.focus();
						felem.focus();
						/*
						removed comment from the below snippet as it was not allowing selection of text in text inputs and areas
						*/
						if(felem.select) felem.select(); /*BUG-107758: Commented the code as it's selecting the text*/
						}catch(e){return false;}
						return true;
					}
				}
			},

			focusFirstErrorField: function(index) {
				if(this.bTreegrid || this.fixedCol) {
                    var errorCells = Dom.getElementsByClassName("iconErrorDiv", "DIV", pega.util.Dom.getElementsById(this.rightBodyTbl.rows[this.getIndex(index)].id, this.leftBodyUL, "LI")[0]);
					if(errorCells && errorCells.length > 0) {
						for(var i=0; i<errorCells.length; i++) {
							if(errorCells[i].style.display.toUpperCase() == "BLOCK") {
								this.focusFirstElement(errorCells[i].parentNode);
								return;
							}
						}
					}
				}
				var errorCells = Dom.getElementsByClassName("iconErrorDiv", "DIV",  this.rightBodyTbl.rows[this.getIndex(index)]);
				if(errorCells && errorCells.length > 0) {
					for(var i=0; i<errorCells.length; i++) {
						if(errorCells[i].style.display.toUpperCase() == "BLOCK") {
							this.focusFirstElement(errorCells[i].parentNode);
							return;
						}
					}
				}
			},

			editInModal : function(e,container){
				var srcElem = Event.getTarget(e);
				if (e.type=="keydown" && e.keyCode == "9")
				{
					//continue;
				}
				else if(srcElem.tagName=="A" &&  srcElem.parentNode.id=="iconExpandCollapse"){
					return;
				}
				var pageIndex = this.getActiveRowIndex(); //Use irfans helper fn to get current row num.
				if(pageIndex<=0){ /* this was added to avoid when clicked on header */
					return;
				}
				this.refreshLayout = this.bRefreshOnUpdate;

				this.callProcessAction(e, srcElem, this.templateName);
			},

			editInHarness: function(e, container) {
				var srcElem = Event.getTarget(e);
				if (e.type=="keydown" && e.keyCode == "9")
				{
					//continue;
				}
				else if(srcElem.tagName=="A" &&  srcElem.parentNode.id=="iconExpandCollapse"){
					return;
				}
				var cell = this.findCell(e, container, srcElem);
				if(typeof container != "undefined") {
					if(!cell) {
                      if(this.bTopPriorityActionSet){/* BUG-199657: Due to prior refresh, cell becomes stale and if execution comes here due to to priority action then reset state. */
							this.bTopPriorityActionSet = false;
                        	pega.c.actionSequencer.pause();
							pega.c.actionSequencer.resume();
						}
                      return;
                    }
					var selectedIndex = this.getRowIndex(cell);
				}
				else { /* If action is from outside grid (button,icon,link in actionTop/actionBottom) */
					var selectedIndex = this.getActiveRowIndex();
				}

				if(!selectedIndex || selectedIndex == "" || selectedIndex == 0)
					return;

				var bOnSameRow = false;
				if(this.propRef){
                    var currentDOM = pega.util.Dom.getElementsById(pega.ui.property.toHandle(this.propRef), this.rightBodyTbl, "TR");
					if(currentDOM){
							var currentIndex = currentDOM[0].rowIndex;
                            this.setActiveRow(null,null,currentIndex,true);
							if(selectedIndex == currentIndex){
								bOnSameRow = true;
							}
					}
				}

				if(srcElem.id == "RLDel"){
					this.selectPage(null,null,selectedIndex);
					return;
				}
				var bstaleDetails = (this.gridDetailsDiv && this.gridDetailsDiv.getAttribute("StaleDetails")== "true");

                // BUG-219397: Re-initalize if called after launchlocalaction
                var bNotRowPage = this.propRef && this.dataSourceRef && this.propRef.indexOf(this.dataSourceRef) == -1;
//Bug-133095 Fix
//Added two conditions to if for validating initialization of variables
				if(selectedIndex <=0 || ((!Dom.getElementsById("pyFlowActionHTML", this.gridDetailsDiv))|| bstaleDetails) || (!(this.modalThreadContext && this.modalThreadContext != "" )) ||(!(pegaUD.basePrimaryPageName && pegaUD.basePrimaryPageName != "")) || bNotRowPage){
					if(bstaleDetails) { /* US-41037 */
						this.gridDetailsDiv.removeAttribute("StaleDetails");
						/* Empty stale details to stop them from submitting */
						this.gridDetailsDiv.innerHTML = "";
					}
					this.selectPage(null,null,selectedIndex);
					this.refreshLayout = false;
					this.bTopPriorityActionSet = false;

					//this.callProcessAction(e, srcElem,"pyGridDetails");
					this.callProcessAction(e, srcElem, this.templateName);

					this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
				}else {
					if(bOnSameRow) {
						if(this.bTopPriorityActionSet) {
							this.bTopPriorityActionSet = false;
							/* BUG-134303: In IE, resume api executing little early before we set "_resumeScheduled" to null, because of which actions in event queue not resuming further.
								setting time out for pega.c.actionSequencer.resume call to allow "_resumeScheduled" value set to null. */
							if (pega.util.Event.isIE) {
								window.setTimeout(function() {
									pega.c.actionSequencer.resume();
								}, 0);
							} else {
							pega.c.actionSequencer.resume();
						}
						}
						return;
					}
					else {
						this.refreshLayout = false;
						this.bTopPriorityActionSet = false;
						this.jumpToIndex(e, selectedIndex);
						this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
					}
				}
				/*var eventDetails = {type:"setVScroll",context:this};
				eventDetails.handler = this.setVScrollDim;
				eventDetails.args = this;
				this.pushToQueue(eventDetails);*/

			},
			expandRowDetails: function(e, container, srcElem) {
        // BUG-713052 : Allow expand of multiple rows for readOnly details
				if(((this.threadProcessing && !this.bReadOnlyShowDetails && !this.bRODetails)|| !this.bExpandMultipleRows)&& ((this.expandedElem && Dom.isAncestor(this.rightBodyTbl, this.expandedElem)) || (!this.bFilteredGrid && this.comingFromAdd == "true"))){
					/* another row already expanded so first collapse it which will also submit the data ; then proceed with expanding the selected row */
					if(Dom.isAncestor(this.leftBodyUL,target))
						container = this.leftBodyUL;
					else if(Dom.isAncestor(this.rightBodyTbl,target))
						container = this.rightBodyTbl;
					else
						container = null;
					var cell = this.findCell(null, container,srcElem);
					this.toBeExpanded = this.getRightRow(this.getRowIndex(cell));
					Event.stopEvent(e);
					if(this.expandedElem && Dom.isAncestor(this.rightBodyTbl, this.expandedElem)){
						var evobj;
							evobj = {type:Grids.EVENT_CLICK,target:this.expandedElem};

						this.handleEditItem(evobj,null,this.getIndex(this.expandedElem.rowIndex));
						//Event.fireEvent(this.expandedElem,"click");
					}else{
					    if(this.propRef && this.propRef!=""){
							var addedRowhandle = pega.ui.property.toHandle(this.propRef);
							var addedRow = Dom.getElementsById(addedRowhandle, this.rightBodyTbl);
							if(addedRow && addedRow.length>0){
								var collapseIcon = Dom.getElementsByClassName("collapseRowDetails", "A", addedRow[0]);
								if(collapseIcon && collapseIcon.length>0){
									Event.fireEvent(collapseIcon[0],Grids.EVENT_CLICK);
									this.comingFromAdd = false;
								}
								else {
									this.comingFromAdd = false;
								}
							}
						}
					}
				}
				else {
					if(e && e.target && e.target.rowIndex){
						this.selectPage(null,null,e.target.rowIndex);
					}else{
						this.selectPage(e, container);
					}
					if(this.bShowExpandCollapseColumn){
						this.expandCollapseAnchor = srcElem;
						Dom.removeClass(srcElem, "expandRowDetails");
						Dom.addClass(srcElem, "collapseRowDetails");
						srcElem.setAttribute("alt",pega.u.d.fieldValuesList.get("enterToCollapse"));
						srcElem.setAttribute("title",pega.u.d.fieldValuesList.get("enterToCollapse"));
					}
					var rightRow = this.getRightRow();
					var rowId = rightRow.id;
					var rowDetailsDiv = null;
					var detailsRow = Dom.getNextSibling(rightRow);
					if(detailsRow) {
						rowDetailsDiv = Dom.getElementsById("rowDetail"+rowId, detailsRow);
					}
					if(rowDetailsDiv) {
						rowDetailsDiv = rowDetailsDiv[0];
					}
					rightRow.setAttribute("rowExpanded", "true");
					if(rowDetailsDiv && Dom.getElementsById("pyFlowActionHTML", rowDetailsDiv)) {
						/*BUG-118135 display block for <tr> in IE10 working similar to non-ie browsers. Hence added check for ie < 10. */
						if(pega.util.Event.isIE && pega.env.ua.ie < 10)
							detailsRow.style.display="block";
						else{
							detailsRow.style.display="table-row";
						}
						rowDetailsDiv.style.display="block";
						/*add the height to grid's property*/
						this.expDetailsHeight += rowDetailsDiv.offsetHeight;
					}else {
						this.callProcessAction(e, srcElem, this.templateName || "pyGridRowDetails");
						pegaUD.inCall = true;
					}
					if(!this.threadProcessing && this.bExpandMultipleRows){
						if(rowDetailsDiv) {
							this.updateExpandStatus(null,"true",rightRow);
						}else {
							this.pushToQueue({type:"ExpandCollapse",handler:this.updateExpandStatusQueued,context:this,args:[null,"true",rightRow]});
						}
					}
					else{
						this.expandedElem = rightRow ;
					}
				}
			    this.setHeadersWidth();
				this.gridResized();
				this.autoAdjustProgressiveGridHeight({expandPane:"true"});
			},

			collapseRowDetails: function(e, container, srcElem) {
				if(e && e.target && e.target.rowIndex){
					// BUG-66549:avoiding the execution of select row (highlighting) when a previously expandeded row
					// is collapsed in case of WO grid or bExpandMultipleRows is false as it causes flickering.
					if (this.threadProcessing || !this.bExpandMultipleRows) {
						this.setActiveRow(null,null,e.target.rowIndex,true);
					} else {
						this.selectPage(null,null,e.target.rowIndex);
					}
				} else {
					this.selectPage(e,container);
				}
				var rightRow = this.getRightRow();
				var rowId = rightRow.id;
				var rowDetailsDiv = null;
				var detailsRow = Dom.getNextSibling(rightRow);
				var rowDetailsDivArray=Dom.getElementsById("rowDetail"+rowId, detailsRow);
				if(!rowDetailsDivArray){ /*BUG-86431: Skip logic execution when the data for previously expanded row is not available*/
						this.toBeCollapsed = null;
						this.expandedElem = null;
						this.DONOT_SUBMIT = false; // BUG-45533: reset the value once the row is collapsed because work object is no longer locked.
						this.comingFromAdd = false;
						if(typeof(this.toBeExpanded)=="object" && this.toBeExpanded) {
							var toBE = this.toBeExpanded;
							var evobj;
								evobj = {type:Grids.EVENT_CLICK,target:toBE};
							this.handleEditItem(evobj,null,this.getIndex(toBE.rowIndex));
							return;
						}
					return;
				}
				var rowDetailsDiv = rowDetailsDivArray[0];
				if(!this.threadProcessing && this.bExpandMultipleRows){
					rightRow.removeAttribute("rowExpanded");
					if(this.bShowExpandCollapseColumn){
						Dom.removeClass(srcElem, "collapseRowDetails");
						Dom.addClass(srcElem, "expandRowDetails");
						srcElem.setAttribute("alt",pega.u.d.fieldValuesList.get("enterToExpand"));
						srcElem.setAttribute("title",pega.u.d.fieldValuesList.get("enterToExpand"));
					}
					/*add the height to grid's property*/
					this.expDetailsHeight -= rowDetailsDiv.offsetHeight;
					detailsRow.style.display="none";
					rowDetailsDiv.style.display="none";
					this.focusElem = null;
					// Dom.getFirstChild(this.getLeftRow()).tabIndex="0";
					// Dom.getFirstChild(this.getLeftRow()).focus();
					/* Keyboard accessibility */
					this.focusFirstElement(this.getLeftRow());
					this.updateExpandStatus(null,'false',rightRow);
				} else {
					if(!this.isLocked && !this.bRODetails) {
						var SaveButton = Dom.getElementsById("RowDetailsButtonSubmit",rowDetailsDiv,"BUTTON");
					}
					/*fire Save action only when work object is not locked and Details are not Read Only*/
					if(!this.isLocked && SaveButton && SaveButton.length>0){
						SaveButton = SaveButton[SaveButton.length-1];
						Event.stopEvent(e);
						/*If the save button is disabled, enable the buttons before firing click event*/
						if(SaveButton.disabled) {
							this.enableSaveDiscardButtons(null);
						}
						this.toBeCollapsed = srcElem;
						Event.fireEvent(SaveButton,Grids.EVENT_CLICK);
					} else {
						if(this.bShowExpandCollapseColumn){
							Dom.removeClass(srcElem, "collapseRowDetails");
							Dom.addClass(srcElem, "expandRowDetails");
							srcElem.setAttribute("alt",pega.u.d.fieldValuesList.get("enterToExpand"));
							srcElem.setAttribute("title",pega.u.d.fieldValuesList.get("enterToExpand"));
						}
						/*BUG-75200 - Focus the row when the details doesn't have save button */
						// Dom.getFirstChild(this.getLeftRow()).tabIndex="0";
						// Dom.getFirstChild(this.getLeftRow()).focus();
						/* Keyboard accessibility */
						this.focusFirstElement(this.getLeftRow());
						/*Remove the details row from Dom*/
						this.rightBodyTbl.deleteRow(detailsRow.rowIndex);
						rightRow.removeAttribute("rowExpanded"); /*Remove the attribute as here data is not submitted*/
						this.toBeCollapsed = null;
						this.expandedElem = null;
						this.DONOT_SUBMIT = false; // BUG-45533: reset the value once the row is collapsed because work object is no longer locked.
						this.comingFromAdd = false;
						if(typeof(this.toBeExpanded)=="object" && this.toBeExpanded) {
							var toBE = this.toBeExpanded;
							var evobj;
								evobj = {type:Grids.EVENT_CLICK,target:toBE};
							this.handleEditItem(evobj,null,this.getIndex(toBE.rowIndex));
							return;
						}
						// BUG-73109: bRODetails is true and single row expand enabled. Add item action when a row is expanded.
						if(this.toBeAdded && this.insertAction!="") {
							this.resetExecutionThread();
							this.setModalAction(this.insertAction);
							this.performInsertAction();
							return;
						}
					}
				}
                this.setHeadersWidth();
				this.gridResized();
				this.triggerBrowserReflow();
				this.autoAdjustProgressiveGridHeight({expandPane:"true"});
			},



			/* returns an array of all the expanded row details */
			getAllExpanded : function(startIndex) {
				if(typeof startIndex == "undefined") {
					startIndex = 0;
				}

				var detailIdPrefix = "rowDetail" ;
				var detailId = "";
				var rows = this.rightBodyTbl.rows ;
				var numOfRows = rows.length;
				var row = null;
				var rowId = null;
				var detail = null;
				var details = new Array() ;

				for(var i=startIndex ; i< numOfRows ; i++) {
					row = rows[i];
					rowId = row.id;
					detailId = detailIdPrefix + rowId ;
					detail = Dom.getElementsById(detailId, row, "DIV");

					if(detail && detail.length > 0 && (detail[0].getAttribute("expanded") === true || detail[0].getAttribute("expanded") === "true" )) {
						details.push(detail[0]);
					}
				}

				return details;
			},

			/* reposition all expanded row details starting from the startIndex ; currently implemented only for gecko
			 */

			adjustAllExpanded: function(currentRowDetail , expandCollapse, startIndex) {
				if(!pega.env.ua.gecko) {
					return;
				}
				if(typeof currentRowDetail == "undefined" || !currentRowDetail) {
					return;
				}
				if(typeof startIndex == "undefined") {
					startIndex = 0;
				}
				if(typeof expandCollapse == "undefined") {
					expandCollapse = "expand";
				}
				var doExpand = expandCollapse === "expand" ;

				var expandedRowDetails = this.getAllExpanded(startIndex);
				var len = expandedRowDetails.length;
				var delta = currentRowDetail.parentNode.offsetHeight;
				if(this.action == "DELETE") {
					delta += pega.u.d.getRepeatRow(currentRowDetail, true).offsetHeight ;
				}

				for(var i=0; i<len; i++) {
					var rowDetailWrapper = expandedRowDetails[i].parentNode;
					if(doExpand) {
						rowDetailWrapper.style.top = (rowDetailWrapper.offsetTop + delta) + 'px';
					}
					else { /* collapsing */
						rowDetailWrapper.style.top = (rowDetailWrapper.offsetTop - delta) + 'px';
					}
				}
			},

			callProcessAction: function(e, srcElem, template) {
                var harCtxMgr = pega.ui.HarnessContextMgr;
				var secDiv = pega.u.d.getSectionDiv(srcElem);
				this.sectionName = secDiv.getAttribute("NODE_NAME");
				if(typeof this.usingPage == "undefined"){
					this.usingPage = pegaUD.getBaseRef(secDiv);
				}
				/*reset the thread Name to base thread for edit in harness and expand pane*/
				if(this.threadProcessing && (this.editConfig==this.EDIT_HARNESS || this.editConfig==this.EDIT_EXPANDPANE)) {
					this.resetExecutionThread();
				}
				this.modalAction = this.gridDiv.getAttribute("editAction");
				var paramURL = new SafeURL();
				var leftRow = this.getLeftRow();
				var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
				if(!Dom.getPreviousSibling(leftRow) || Dom.getPreviousSibling(leftRow).id==""){
					paramURL.put("PrevDisabled","true");
				}
				if(this.bDiscardInvisibleRows && (pageListIndex > 1)){
				    paramURL.put("PrevDisabled","false");
				}
				if(!Dom.getNextSibling(leftRow)){
					paramURL.put("NextHide","true");
				}
				if(this.bDiscardInvisibleRows && (pageListIndex < this.totalRecords)){
				     paramURL.put("NextHide","false");
				}
				if(this.editConfig==this.EDIT_EXPANDPANE && this.bFilteredGrid && this.comingFromAdd=="true") {
					paramURL.put("showOkCancel","true");
				}
                if (e.skipPreProcessingActivity) {
                    paramURL.put("skipPreProcessingActivity", "true");
                }
				this.propRef = pega.ui.property.toReference(leftRow.id);
				paramURL.put("rowPage",this.propRef);
				/*
					If grid is being edited in expand pane or embedded pane mode, process action must be passed modelessDialog to prevent a check
					which prevents process action being run from a modal dialog. (In case this grid is running in a modal dialog.)
				*/
				if(this.editConfig && (this.editConfig==this.EDIT_HARNESS || this.editConfig==this.EDIT_EXPANDPANE)){
					paramURL.put("modelessDialog",true);
				}
				paramURL.put("pyPropRef",this.propRef);
				paramURL.put("pzHarnessID",pega.ctx.pzHarnessID);
				if(this.editConfig==this.EDIT_EXPANDPANE) {
					paramURL.put("showSaveDiscard", "true");
				}

				//if(template == "pyGridDetails" || template == "pyGridRowDetails"){
				if(this.editConfig == this.EDIT_HARNESS || this.editConfig == this.EDIT_EXPANDPANE || template == "pyGridRowDetails"){
					if(this.gridDiv.getAttribute("editConfig")==this.EDIT_READONLY && this.bShowExpandDetails){
						paramURL.put("ReadOnly","-1");
					}
				}else {
					pega.ctx.activeGrid = this;
				}
				this.setModalAction("");
				var templateName = template;
				paramURL.put("activeGridObj", this);
				if(this.bRODetails){
					paramURL.put("bRODetails","true");
				}

				paramURL.put("KeepMessages",pegaUD.KeepMessages);
				if (pega.u.d.topLevelPageErrors == true)
					paramURL.put("TopLevelPageErrors","true");
				else
					paramURL.put("TopLevelPageErrors", "false");
				/* Introduced to overcome window change confirmation dialog in accessibility mode */
				var tempAccessibilityFlag = harCtxMgr.get('bWarnBeforeChangingWindow');

				paramURL.put("UITemplatingStatus", "N");/* BUG-260187: Send templating status as N in case of grid for modal dialog */
				harCtxMgr.set('bWarnBeforeChangingWindow',false);
				if(typeof e.type == "string") {
					//if(template == "pyGridDetails"){
          //BUG-546471 : Pass event if it exits
					if(this.editConfig == this.EDIT_HARNESS){
						processAction(this.modalAction,"","","","",true,e,templateName,paramURL,srcElem,true);
					}
					else {
						processAction(this.modalAction,"","","","",true,e,templateName,paramURL,"",true);
					}
				}else  {
					processAction(this.modalAction,"","","","",true,null,templateName,paramURL,Dom.getFirstChild(this.gridDetailsDiv),true);
				}
                harCtxMgr.set('bWarnBeforeChangingWindow',tempAccessibilityFlag);
			},

			setModalAction : function(action){
				this.MODAL_ACTION = action;
			},

			getModalAction : function(action){
				return this.MODAL_ACTION;
			},

			submitModal: function(e, templateName){
				/* BUG-189878: If some other action is in progress, don't execute, a race condition might occur */
                /* BUG-263214: Added a condition to differenctiate Pzbutton and custom button */
				if(((pega.u.d.bModalDialogOpen && pega.u.d.isAjaxInProgress()) || (pega.u.d.bModalDialogOpen && pega.c && pega.c.actionSequencer && !pega.c.actionSequencer.isQueueEmpty()))&&(e.target.id=="ModalButtonSubmit"))
					return;

			/* US-58608: For Master-Detail pick template name always from grid attrib */
				if(!this.isOpenLocalAction && !this.__fromLocalAction){
					templateName = this.templateName;
				}
				/* BUG-153985: In case of server side errors, setting activeGrid takes care of initializing the modal dialog buttons with correct grid specific event handlers */
				pega.ctx.activeGrid = this;

				/*BUG-132081 start*/
				var bchildOverlayOpen = pega.u.d.closeChildOverLay(e);
				if(bchildOverlayOpen){
					return;
				}
				/*BUG-132081 end*/

				/*  BUG-183134: If the row page is not primary page, then grid doesn't need to handle the submit of modal */
				if(this.propRef && (this.propRef.length != this.propRef.lastIndexOf(")") + 1)) {
                    pega.u.d.doModalAction(pega.u.d.submitModalDlgParam,e);
                    return;
                }

        /* SE-50341: START - If templateName is undefined and pega.u.d.submitModalDlgParam.gridTemplateName has template name,
        then send the template name from pega.u.d.submitModalDlgParam.gridTemplateName */
        if(!templateName && pega.u.d.submitModalDlgParam && pega.u.d.submitModalDlgParam.gridTemplateName) {
          templateName = pega.u.d.submitModalDlgParam.gridTemplateName;
        }
        /* SE-50341: END */

				this.setModalAction("SUBMIT");
				this.performModalAction(e, templateName);
			},

			removeDummyRow : function() {
                var dummyEls = pega.util.Dom.getElementsById("yui_modalrownew", this.gridDiv); //Remove inserted dummyEls
				if(dummyEls){
					var dmLen = dummyEls.length;
					for(var i = 0; i < dmLen ; i++){
						dummyEls[i].parentNode.removeChild(dummyEls[i]);
					}
				}
			},

			cancelModal: function(e, templateName){
				/* BUG-189878: If some other action is in progress, don't execute, a race condition might occur */
                /* BUG-263214: Added a condition to differenctiate Pzbutton and custom button */
                /* BUG-286188: Changed ModalButtonSubmit to ModalButtonCancel */
				if(((pega.u.d.bModalDialogOpen && pega.u.d.isAjaxInProgress()) || (pega.u.d.bModalDialogOpen && pega.c && pega.c.actionSequencer && !pega.c.actionSequencer.isQueueEmpty()))&&(e.target.id=="ModalButtonCancel"))
					return;

				if(!this.isOpenLocalAction && !this.__fromLocalAction)
					templateName = this.templateName;

              	/* BUG-199555: For List-> Open Local Action, clearing DONOT_SUBMIT property on modal cancel as this gets set in performFlowACallback API when the flow action div contains "LOCKED" attribute */
              	if(this.isOpenLocalAction) {
					this.DONOT_SUBMIT = false;
                }

				/*BUG-132081 start*/
				var bchildOverlayOpen = pega.u.d.closeChildOverLay(e);
				if(bchildOverlayOpen){
					return;
				}
				/*BUG-132081 end*/
				if(this.comingFromAdd == "true"){
					this.setModalAction("REMOVELAST");
					this.performModalAction(e, templateName);
				}else {
					var gridTemplateName = this.getFATemplateName(templateName);

					/*
					var bEditInHarness = (gridTemplateName=="pyGridDetails");
					var bEditExpandPane = (gridTemplateName=="pyGridRowDetails");
					*/
					var bEditInHarness = (this.editConfig==this.EDIT_HARNESS && (!this.isOpenLocalAction && !this.__fromLocalAction));
					var bEditExpandPane = (this.editConfig==this.EDIT_EXPANDPANE && (!this.isOpenLocalAction && !this.__fromLocalAction));

					this.comingFromEditCancel = (this.bFilteredGrid)?true:false;
					if((this.gridDetailsDiv && bEditInHarness && (Dom.isAncestor(this.gridDetailsDiv,Event.getTarget(e)) || this.getModalAction()=='JUMP')) || bEditExpandPane) {
						this.DONOT_SUBMIT = true;
						if(bEditExpandPane) {
							this.selectPage(e, this.rightBodyTbl);
						}
						this.jumpToIndex(e,this.getActiveRowIndex(), templateName);
					}else {
                      	/* BUG-203421: When the modal dialog launched from grid contains another flow action based grid and if user takes any action like edit item on the inner grid, then pega.ctx.activegrid property will refer to the inner grid. Now when the modal is closed we actually do cleanup for the activeGrid in this case which is the inner grid. Changing the activeGrid reference to parent grid fixes the same */
                      	pega.ctx.activeGrid = this;
						var tempActionName = "";
						if(this.modalAction){
							tempActionName = this.modalAction;
						}
						this.setModalAction("CANCEL");
						/*set busy indicator wait time to zero for grid actions.*/
						pegaUD.performFlowAction("",e,"",tempActionName, "", true);
						/*reset refreshLayout to false to avoid problems in future actions*/
						if(this.refreshLayout) {
							this.refreshLayout = false;
						}
					}
				}
			},

			jumpToIndex : function(e, rowIndex, templateName) {
				if(rowIndex > 0 ){
					this.jumpIndex = rowIndex;
					/* BUG-153985: In case of server side errors, setting activeGrid takes care of initializing the modal dialog buttons with correct grid specific event handlers, BUG-184564: Commented out the changes done for BUG-153985 in jumpToIndex API */
					//pega.ctx.activegrid = this;
					this.setModalAction("JUMP");
					this.performModalAction(e, templateName);
				}
			},

			goToNext: function(e, templateName) {
				if(!this.isOpenLocalAction && !this.__fromLocalAction){
					templateName = this.templateName;
				}
				/* BUG-153985: In case of server side errors, setting activeGrid takes care of initializing the modal dialog buttons with correct grid specific event handlers */
				pega.ctx.activeGrid = this;

				/*BUG-132081 start*/
				var bchildOverlayOpen = pega.u.d.closeChildOverLay(e);
				if(bchildOverlayOpen){
					return;
				}
				/*BUG-132081 end*/

				this.refreshLayout = this.bRefreshOnUpdate;
				if(this.isLocked || this.bFilteredGrid ){
					var leftRow = this.getLeftRow();
					var currentRow = leftRow.getAttribute("PL_INDEX");
					var goToIndex;
					/* BUG-147817 : goToIndex is the proper nextIndex */
					/* BUG-158087: Retrieve the right index in case of filtered grid */
					/* BUG-166317: HFix-9854 Dev Tip:  Added "expandPane" condition below*/
					if (this.bTree || this.bTreegrid || (this.isOpenLocalAction || this.editConfig==this.EDIT_HARNESS || this.editConfig == this.EDIT_MODAL  || this.editConfig == this.EDIT_EXPANDPANE)) {
						/* BUG-150682 : In case of tree / tree grid, nextIndex cannot be calculated from PL_INDEX, hence calculating it from rightBodyTbl */
                        goToIndex = pega.util.Dom.getElementsById(this.getNextGridRow(leftRow).id, this.rightBodyTbl, "TR")[0].rowIndex;
						if(this.editConfig==this.EDIT_EXPANDPANE || this.bCategorizedGrid)	// OpenLocalAction launched from Expand Pane / Read-Only Show Details || Categorized grid
							goToIndex = this.getActiveRowIndexFromRowIndex(goToIndex);
					} else {
						goToIndex = this.getNextGridRow(leftRow).getAttribute("PL_INDEX");
					}
                    // var nextIndex = pega.util.Dom.getElementsById(this.getNextGridRow(leftRow).id,this.rightBodyTbl,"TR")[0].rowIndex;
					this.jumpToIndex(e,goToIndex, templateName);
					this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
					return;
				}
				this.setModalAction("NEXT");
				this.performModalAction(e, templateName);
				this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
			},

			goToPrevious: function(e, templateName){
				if(!this.isOpenLocalAction && !this.__fromLocalAction){
					templateName = this.templateName;
				}
				/* BUG-153985: In case of server side errors, setting activeGrid takes care of initializing the modal dialog buttons with correct grid specific event handlers */
				pega.ctx.activeGrid = this;

				/*BUG-132081 start*/
				var bchildOverlayOpen = pega.u.d.closeChildOverLay(e);
				if(bchildOverlayOpen){
					return;
				}
				/*BUG-132081 end*/

				this.refreshLayout = this.bRefreshOnUpdate;
				if(this.isLocked || this.bFilteredGrid){
					var leftRow = this.getLeftRow();
					var currentRow = leftRow.getAttribute("PL_INDEX");
					var goToIndex;
					/* BUG-147817 : goToIndex is the proper prevIndex */
					/* BUG-158087: Retrieve the right index in case of filtered grid */
					/* BUG-166317: HFix-9854 Dev Tip:  Added "expandPane" condition below*/
					if (this.bTree || this.bTreegrid || (this.isOpenLocalAction || this.editConfig==this.EDIT_HARNESS || this.editConfig == this.EDIT_MODAL  || this.editConfig == this.EDIT_EXPANDPANE)) {
						/* BUG-150682 : In case of tree / tree grid, nextIndex cannot be calculated from PL_INDEX, hence calculating it from rightBodyTbl */
                        goToIndex = pega.util.Dom.getElementsById(this.getPreviousGridRow(leftRow).id, this.rightBodyTbl, "TR")[0].rowIndex;
						if(this.editConfig==this.EDIT_EXPANDPANE || this.bCategorizedGrid)	// OpenLocalAction launched from Expand Pane / Read-Only Show Details || Categorized grid
							goToIndex = this.getActiveRowIndexFromRowIndex(goToIndex);
					} else {
						goToIndex = this.getPreviousGridRow(leftRow).getAttribute("PL_INDEX");
					}
                    // var prevIndex = pega.util.Dom.getElementsById(this.getPreviousGridRow(leftRow).id,this.rightBodyTbl,"TR")[0].rowIndex
					this.jumpToIndex(e,goToIndex, templateName);
					this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
					return;
				}
				this.setModalAction("PREV");
				this.performModalAction(e, templateName);
				this.refreshLayout = (this.bFilteredGrid)?true:this.refreshLayout;
			},

			addRow : function(e, templateName) {
				/*BUG-132081 start*/
				var bchildOverlayOpen = pega.u.d.closeChildOverLay(e);
				if(bchildOverlayOpen){
					return;
				}
				/*BUG-132081 end*/
				this.setModalAction("ADD");
				this.performModalAction(e, templateName);
			},

			insertBeforeModal : function(e){
				this.setModalAction("INSERTBEFORE");
				this.performInsertAction(e);
			},

			insertAfter : function(e){
				this.setModalAction("INSERTAFTER");
				this.performInsertAction(e);
			},

			appendLast : function(e){
				this.setModalAction("APPENDLAST");
				this.performInsertAction(e);
			},

			performInsertAction : function(event){
				if(this.editConfig==this.EDIT_MODAL && pega.u.d.bModalDialogOpen){
					alert(NoModalInModal);
					return;
				}

				// BUG-163565: Don't proceed if there are validation errors in the embed pane
				if (this.editConfig == this.EDIT_HARNESS && (this.gridDetailsDiv && !pegaUD.shouldSubmitProceed(event, this.gridDetailsDiv))) {
                    return;
                }
				// BUG-164827: Don't proceed if there are validation errors in the expand pane
				else if(this.editConfig == this.EDIT_EXPANDPANE && !this.bExpandMultipleRows) {
					var rightRow = this.getRightRow();
					if(rightRow) {
						var detailsRow = Dom.getNextSibling(rightRow);
						if(detailsRow && !pegaUD.shouldSubmitProceed(event, detailsRow))
							return;
					}
				}

				/* US-41037: Avoid submit in case of stale details. */
				var bStaleDetails = (this.gridDetailsDiv && this.gridDetailsDiv.getAttribute("StaleDetails")== "true");
				/*for Edit in embedded pane, if append icon is clicked second time submit the new row before adding another.*/
				if(((this.editConfig==this.EDIT_HARNESS && this.gridDetailsDiv && !bStaleDetails) || (this.editConfig==this.EDIT_EXPANDPANE && (this.threadProcessing || !this.bExpandMultipleRows)))  && (!this.notSubmitDetails && !this.bRODetails) ) {
					var SaveButton;
					if(this.editConfig==this.EDIT_HARNESS){
						SaveButton = Dom.getElementsById("ModalButtonSubmit",this.gridDetailsDiv,"BUTTON");
					}else {
						SaveButton = Dom.getElementsById("RowDetailsButtonSubmit",this.gridDiv,"BUTTON");
					}
					if(SaveButton && SaveButton[0] && !SaveButton[0].disabled) { /*Simulate click only when the button  is enabled, else discard the details.*/
						this.addNewRow = "true";
						this.addNewAction = this.getModalAction();
						this.addNewActiveRow = this.activeRow;
						/*BUG-106552: When Add/Add Child is triggered from context menu, then active row and visible details row are different. So, update the active row as well before triggering submit action.*/
						var visibleDetailsRowId = pega.ui.property.toHandle(this.propRef);
						var visibleDetailsRowEle = Dom.getElementsById(visibleDetailsRowId, this.rightBodyTbl, "TR");
						if(visibleDetailsRowEle && visibleDetailsRowEle[0]) {
							visibleDetailsRowEle = visibleDetailsRowEle[0];
							var visibleDetailsRowIndex = visibleDetailsRowEle.rowIndex;
							if(this.activeRow!=visibleDetailsRowIndex) { /*When the active row is different from the visible details row.*/
								this.activeRow = visibleDetailsRowIndex;
							}
						}
						Event.fireEvent(SaveButton[0],Grids.EVENT_CLICK);
            /*BUG-484920 : Returning the control from there would not add a row.*/
						/*return;*/
					}
				}

				/*when append icon is clicked second time, reset the properties after row is submitted */
				if((this.editConfig==this.EDIT_HARNESS || (this.editConfig==this.EDIT_EXPANDPANE && (this.threadProcessing || !this.bExpandMultipleRows))) && this.addNewRow == "true") {
					this.addNewRow = "";
					this.notSubmitDetails = false;
					this.selectRow(this.activeRow,false);
					this.setModalAction(this.addNewAction);
					this.action = this.addNewAction;
					this.activeRow = this.addNewActiveRow;
					if(this.addNewAction == "ADDFIRSTCHILD"){
						var leftLI = this.getLeftRow();
						var ul = document.createElement("UL");
						ul.id = "gridNode";
						ul.className = "gridNode";
						leftLI.appendChild(ul);
					}
					this.addNewAction = "";
					this.addNewActiveRow = "";
				}
				this.resetInCall();
				if(this.editConfig==this.EDIT_EXPANDPANE) {
					if((this.threadProcessing || !this.bExpandMultipleRows)&& this.expandedElem && Dom.isAncestor(this.rightBodyTbl, this.expandedElem)){
					/* another row already expanded so first collapse it which will also submit the data ; then proceed with expanding the selected row */
						this.toBeAdded = true;
						this.insertAction = this.getModalAction();
						//this.toBeExpanded = null;
						Event.stopEvent(event);
						var evobj;
							evobj = {type:Grids.EVENT_CLICK,target:this.expandedElem};
						this.handleEditItem(evobj,null,this.getIndex(this.expandedElem.rowIndex));
						//Event.fireEvent(this.expandedElem,"click");
						return;
					}
				}
				/*Reset the variable toBeAdded and insertAction to avoid future conflicts*/
				this.toBeAdded = false;
				this.insertAction = null;
				var oSafeURL = SafeURL_createFromURL(pegaUD.url);
				this.modalAction = this.gridDiv.getAttribute("editAction");
				var rtTable = this.rightBodyTbl;
				this.baseThreadContext = pegaUD.getThreadName();
				if(typeof this.usingPage == "undefined"){
					this.usingPage = pegaUD.getBaseRef(rtTable);
				}
				oSafeURL.put("BaseReference",this.usingPage);
				/* Params for pzGridModalHTML */
				if(this.getModalAction() == "APPENDLAST"){
					oSafeURL.put("PageListProperty",this.getPLPGProperty());
					if(this.bPageGroup){
						oSafeURL.put("ClassName",rtTable.getAttribute("PG_PROP_CLASS"));
					}else{
						oSafeURL.put("ClassName",rtTable.getAttribute("PL_PROP_CLASS"));
					}
					oSafeURL.put("IndexInList","");
					if(( this.getTableLength(this.rightBodyTbl)==0 )|| ( this.getTableLength(this.rightBodyTbl)==1 && Dom.getElementsById("Grid_NoResults",this.gridDiv) )) {
					oSafeURL.put("PrevDisabled","true");
					}
					oSafeURL.put("NextHide","true");
				}else{
					var leftRow = this.getLeftRow();
					if(this.getModalAction() == "ADDFIRSTCHILD"){
						oSafeURL.put("PrevDisabled","true");
						oSafeURL.put("NextHide","true");
					}else{
						var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
						if (this.getModalAction() == "INSERTBEFORE" && (!Dom.getPreviousSibling(leftRow) || Dom.getPreviousSibling(leftRow).id=="")) {
							oSafeURL.put("PrevDisabled", "true");
						}
						if (this.bDiscardInvisibleRows && this.getModalAction() == "INSERTBEFORE" && (pageListIndex > 1)) {
							oSafeURL.put("PrevDisabled", "false");
						}
						if (!Dom.getNextSibling(leftRow)) {
							if(this.getModalAction() != "INSERTBEFORE")
								oSafeURL.put("NextHide", "true");
						}
						if (this.bDiscardInvisibleRows && this.getModalAction() == "INSERTAFTER" && (pageListIndex < this.totalRecords)) {
							 oSafeURL.put("NextHide", "false");
						}
					}
					var propRef = this.getRightRow().id;
					this.propRef = pega.ui.property.toReference(propRef);
					oSafeURL.put("pyPropRef",this.propRef);
					oSafeURL.put("rowPage",this.propRef);
				}
				/*In case of filtered grid show only Ok & Cancel buttons to avoid issues with prev/Next navigation. */
				if(this.bFilteredGrid) {
					oSafeURL.put("ShowOnlyOKCancel","true");
				}

				oSafeURL.put("pyActivity","ShowStream");
				oSafeURL.put("pyTargetStream","pzGridModalHTML");
				oSafeURL.put("pyBasePage",oSafeURL.get("pzPrimaryPageName"));
				oSafeURL.put("Navigation",this.getModalAction());
				oSafeURL.put("NewTaskStatus",this.modalAction);
				oSafeURL.put("FormError",pega.u.d.formErrorType);
				oSafeURL.put("FieldError",pega.u.d.fieldErrorType);
				oSafeURL.put("pyCustomError",pega.u.d.pyCustomError);
				if(this.baseThreadContext){
					oSafeURL.put("BaseThreadContext",this.baseThreadContext);
				}
				oSafeURL.put("isModalFlowAction","true");
				/*
				if(this.editConfig == this.EDIT_HARNESS){
					oSafeURL.put("ActionSection","pyGridDetails");
					oSafeURL.put("modalSection","pyGridDetails");
				}else if (this.editConfig == this.EDIT_EXPANDPANE) {
					oSafeURL.put("ActionSection","pyGridRowDetails");
					oSafeURL.put("modalSection","pyGridRowDetails");
					oSafeURL.put("showOkCancel","true");
				}else{
					oSafeURL.put("ActionSection","pyGridModalTemplate");
					oSafeURL.put("modalSection","pyGridModalTemplate");
				}
				*/

				if(this.editConfig == this.EDIT_HARNESS){
					oSafeURL.put("ActionSection", this.templateName);
					oSafeURL.put("modalSection", this.templateName);
				}else if (this.editConfig == this.EDIT_EXPANDPANE) {
					oSafeURL.put("ActionSection", this.templateName);
					oSafeURL.put("modalSection", this.templateName);
					oSafeURL.put("showOkCancel","true");
				}else{
					oSafeURL.put("ActionSection", this.templateName);
					oSafeURL.put("modalSection", this.templateName);
				}

				/* BUG-103843: Passing "startIndex" in case of RD and advanced pagination
				 * BUG-132392: Moved this before filter block so that it doesn't override filter case */
				if((this.bReportDefinition || this.pyPaginateActivity)) {
					var startIndex;
					/* BUG-158971: In case of optimize clipboard, row numbers are getting corrupted */
					if(this.bCBOptimize) {
						startIndex = this.getFirstLoadedRowIndex();
					} else {
						startIndex = (this.currentPageIndex - 1) * this.rangeSize + 1;
					}
					oSafeURL.put("startIndex", startIndex);
				}
				/*In case of filtered grid, doing refresh layout when adding new row and passing necessary params */
                var refreshCallbackArgs;
				if(this.bFilteredGrid) {
					this.refreshLayout = true;
					oSafeURL.put("showFADetails","true");
					oSafeURL.put("pyGridFilterCriteriaPage", this.gridFilterPage);
					oSafeURL.put("refreshLayout",this.refreshLayout);
					if(this.refreshLayoutFromConfig) { /* Sending refreshLayoutFromConfig to server to make it persist on refresh layout */
						oSafeURL.put("refreshLayoutFromConfig",this.refreshLayoutFromConfig);
					}
					oSafeURL.put("partialRefresh","false");
					refreshCallbackArgs=pegaUD.getRefreshCallbackArgs(this.gridDiv);
					oSafeURL.put("RenderSingle",refreshCallbackArgs.paramName);
					if (this.currentPageIndex && this.rangeSize) {
						if (this.pageMode == "Progressive Load") {
							var startIndex = 1;
							if (this.bDiscardInvisibleRows) {
								oSafeURL.put("bDiscardInvisibleRows", "true");
								startIndex = this.getFirstLoadedRowIndex();
								oSafeURL.put("startIndex", startIndex);
								var recordsInCurrentPage =  this.rangeSize * 3;
								var noOfPages = Math.ceil(this.totalRecords / this.rangeSize);
								if (this.getModalAction() == "INSERTAFTER" && this.activeRow == this.getNoOfRowsLoaded() && this.currentPageIndex < noOfPages) {
									startIndex = startIndex + this.rangeSize;
									this.currentPageIndex = Math.ceil(startIndex / this.rangeSize) + 1;
								} else if (this.getModalAction() == "INSERTBEFORE" && this.activeRow ==  startIndex && this.currentPageIndex > 2) {
									startIndex = startIndex - this.rangeSize;
									this.currentPageIndex = Math.ceil(startIndex / this.rangeSize) + 1;
								}
								if (1 == this.currentPageIndex) {
									recordsInCurrentPage = 2 * this.rangeSize;
								}
								oSafeURL.put("recordsInCurrentPage", recordsInCurrentPage);
							} else {
								oSafeURL.put("recordsInCurrentPage", (this.currentPageIndex + 1) * this.rangeSize);
							}
						} else {
							var startIndex = (this.currentPageIndex - 1) * this.rangeSize + 1;
						}
						oSafeURL.put("startIndex", startIndex);
						oSafeURL.put("pyPageSize", this.rangeSize);if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
						if(this.pageMode){
                          oSafeURL.put("pyPageMode", this.pageMode);
			            }
						oSafeURL.put("currentPageIndex", this.currentPageIndex);
					}
				}
				if(this.appendAct){
					oSafeURL.put("customAppendActivity",this.appendAct);
				}
				if(this.bTreegrid) {
					oSafeURL.put("bTreegrid", this.bTreegrid);
				}
				if(this.bRODetails){
					oSafeURL.put("bRODetails","true");
				}
				oSafeURL.put("bIsModal","true");
				oSafeURL.put("isPageGroup",this.bPageGroup);
				oSafeURL.put("PrimaryPage",pegaUD.basePrimaryPageName);
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
				oSafeURL.put("partialTrigger", "editRow" + this.getConfiguredPLPGProperty()+gridIndex);
				oSafeURL.put("StreamName",this.sectionName);
				oSafeURL.put("StreamClass","Rule-HTML-Section");

				if(pega.ctx.strHarnessMode != "ACTION")
					oSafeURL.put("HarnessType","NEW");

				var lastRowToRetrieve = this.getLastRowToRetrieve();
				if(lastRowToRetrieve) {
					oSafeURL.put("lastRowToRetrieve", lastRowToRetrieve);
				}

				pegaUD.setBusyIndicator(null, false, true);

				var callback;
				var asyncConfigOptions;
				/*if(hasFile && typeof taskStatus != 'undefined' && taskStatus != "") {BUG-112064 : Added "typeof taskStatus != 'undefined'" as it is throwing an error when "taskStatus" is 'undefined'
					var queryString = new SafeURL();
					queryString.put("hasFile", "true");
					pega.util.Connect.setForm(oForm, true);
					asyncConfigOptions = { resetPlaceholders : true };
					callback = {upload:this.performInsertCallback, scope:this};
				} else {*/
					callback ={
						success:this.performInsertCallback,
						failure:function(oResponse){pega.u.d.gBusyInd.hide();},
						scope:this

					};
        /* BUG-553840 : In AddItem modal ,presuccess callback should be called in prerenderer */
        if(this.editConfig === this.EDIT_MODAL ){
            callback.preRenderer=pega.u.d.processActionModal_Pre_Success;
        }
				if(!this.bFilteredGrid) {
				callback.argument = [this];
				}
				else {
					callback.argument = new Array(refreshCallbackArgs.expandInnerDiv, refreshCallbackArgs.expandElement, refreshCallbackArgs.paramName,refreshCallbackArgs.innerDivExists);
				}

				pega.u.d.modalDialog.innerElement.style.display = "block";
				pega.ctx.activeGrid = this;
				var request = pegaUD.asyncRequest('POST', oSafeURL,callback,"", asyncConfigOptions);

			},

			removeGridNoResultsMsg : function() {
				var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
				if(grid_noRes) { // Code to remove the no results grid message.
					var grid_noResTemp;
					for(var i=0; i<grid_noRes.length; i++) {
						grid_noResTemp = grid_noRes[i];
					/*BUG-72474: Remove the height for leftBodyUL which is set when Nores Msg is there while removing them*/
						if((this.bTreegrid || this.fixedCol) && grid_noResTemp.parentNode.tagName =="UL") {
							grid_noResTemp.parentNode.style.height="";
					}

                      /* BUG-260252: When bHideGridHdrWhenNoRows is checked, the grid content div is sibling to the no results div */
						if(this.isElementFromSameGridContDiv(grid_noResTemp) || (this.bHideGridHdrWhenNoRows === "true" && this.isElementFromSameGridDiv(grid_noResTemp))) {
							grid_noResTemp.parentNode.removeChild(grid_noResTemp);
						}
					}

                    if(this.bHideGridHdrWhenNoRows === "true") {
                        this.toggleGridStylesForNoResultsCase();
				    }
				}
			},

			/*API used to compute the proper right row for inserting a row after in case of modal dialog */
			computeRightRow: function() {
				var children = Dom.getChildren(this.leftrowbefore);
				if(children.length == 2 ){
					var childrenExist = true;
					var childrenUL = children[1];
					var rtRowIndex;
					while(childrenExist) {
						var lastChild = Dom.getLastChild(childrenUL);
						if(!lastChild)
							break;
						if(lastChild) {
							var childLeftrow = lastChild.id;
							var childRightrow = Dom.getElementsById(childLeftrow, this.rightBodyTbl , "TR")[0];
							rtRowIndex = childRightrow.rowIndex;
							if(Dom.getChildren(lastChild).length==1) {
								childrenExist = false;
								break;
							}
							childrenUL = Dom.getChildren(lastChild)[1];
						}
					}
					this.rightrowbefore = (rtRowIndex)?this.getRightRow(rtRowIndex):this.getRightRow();
				}else{
					this.rightrowbefore = this.getRightRow();
				}
			},
			createDummyRow: function(oResponse) {
				var dummyLi = document.createElement("LI"); // We are going to create a dummy LI and TR and insertAfter current leftrow and right row.
				dummyLi.id = "yui_modalrownew";
				dummyLi.style.display = "none";

				var dummyTR = document.createElement("TR");
				dummyTR.id = "yui_modalrownew";
				dummyTR.style.display = "none";

				this.oldActiveRow = this.getActiveRowIndex();

				if(this.getModalAction() == "INSERTAFTER"){
					this.leftrowbefore = this.getLeftRow();
					if(this.bTreegrid || this.fixedCol) {
						this.computeRightRow();
						Dom.insertAfter(dummyLi,this.leftrowbefore);
					}else {
						this.rightrowbefore = this.getRightRow();
					}
					Dom.insertAfter(dummyTR,this.rightrowbefore);
					this.selectRow(this.activeRow,false);
					this.activeRow = dummyTR.rowIndex;

					this.action="INSERTAFTER";
				}else if(this.getModalAction() == "INSERTBEFORE"){
					this.action="INSERTBEFORE";
					this.selectRow(this.activeRow,false);
				}else if(this.getModalAction() == "ADDFIRSTCHILD"){
					this.action="ADDFIRSTCHILD";
					this.leftrowbefore = this.getLeftRow();
					var children = Dom.getChildren(this.leftrowbefore);
					this.rightrowbefore = this.getRightRow();
					children[1].appendChild(dummyLi);
					Dom.insertAfter(dummyTR,this.rightrowbefore);
					this.selectRow(this.activeRow,false);
					this.activeRow = dummyTR.rowIndex;
				}else {
					if(this.bTreegrid || this.fixedCol) {
						this.leftBodyUL.appendChild(dummyLi);
					}
					Dom.getFirstChild(this.rightBodyTbl).appendChild(dummyTR);
					/*For page group, deselect the row*/
					if(this.bPageGroup && this.activeRow) {
						this.selectRow(this.activeRow,false);
					}
					this.activeRow = dummyTR.rowIndex;
					this.action="APPENDLAST";
				}
				if(!this.oldActiveRow) { /*no row was selected before adding the new row; thus oldActiveRow should be row before the dummy row */
					this.oldActiveRow = dummyTR.rowIndex-1;
				}
			},
			/*Method used to remove the new row. This is invoke by performModalCallback in case of REMOVELAST.*/
			removeAppendedRow: function() {
				var indexInList = this.activeRow;
				var gridTables = [this.leftBodyUL, this.rightBodyTbl];
				if(!this.bTreegrid) {
					if(this.editConfig==this.EDIT_EXPANDPANE) {
                      	if(!this.bExpandMultipleRows){ /* BUG-228601: Passing right indexInList to updateHandles API in case of expand pane grid */
							indexInList = indexInList-1;
						}
						pega.u.d.updateHandlesAfterDelete([indexInList, gridTables, this]);
					}else {
						pega.u.d.updateHandlesAfterDelete([(indexInList-1), gridTables, this]);
					}
				}
				else {
					this.updateTreeHandlesAfterDelete();
				}
				var indexToFocus = indexInList;
				if(this.bPageGroup) {
					indexToFocus = pega.u.d.getNextRowSubscript(this.getRightRow());
				}
				if(indexToFocus) {
					var afterDomAction = this.callInitGridsAndFocusRow;
				}
				var repeatType = this.bPageGroup?"group":"list";
				var beforeParams = new Array(indexInList, gridTables, repeatType);
				var partialParams = {
					partialTrigger : "delete",
					index : indexInList,
					domElement: [this.getLeftRow(), this.getRightRow()],
					domAction : "remove",
					beforeDomAction :this.loadGridRows ,
					beforeDomActionContext:this,
					beforeParams : beforeParams,
					afterDomAction :afterDomAction
				};

				this.loadRow("", partialParams,this.gridDiv.parentNode,beforeParams,true);
			},
			/*Method used to load the new row. this is invoked by performInsertCallback which is used for grid editing bound to FA */
			loadAppendedRow : function(responseArray) {
				this.activeRow=parseInt(this.activeRow);
                /*BUG-249430*/
              	var afterParams;
				if(this.editConfig == this.EDIT_EXPANDPANE && arguments.length > 1 && arguments[1]["responseText"]){
					afterParams = [this,this.activeRow, arguments[1]];
				} else {
					afterParams = [this,this.activeRow];
				}
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
				var partialParams = {
					partialTrigger : "appendTo" +this.getConfiguredPLPGProperty()+gridIndex,
					beforeDomAction :this.loadGridForEdit ,
					beforeDomActionContext:this,
					beforeParams : null,
					afterDomAction :this.submitRowCallback ,
					afterParams :  afterParams,
					bTreegrid : this.bTreeGrid
				};
				if(this.activeRow) {
					if(this.bTreegrid) {
						if(this.getModalAction()=="INSERTBEFORE") {
							var leftEle = this.getLeftRow(this.activeRow);
							var rightEle = this.getRightRow(this.activeRow);
						}else if(this.getModalAction()=="INSERTAFTER" || this.getModalAction()=="ADD"){
							var leftEle = this.getLeftRow(this.activeRow);
							leftEle = Dom.getNextSibling(leftEle);
							/*If a row has been added at the end of the level, then pass the gridNode UL as the left Element and next TR as right Element*/
							if(!leftEle) {
								leftEle = this.getLeftRow(this.activeRow);
								var tempLeftEle = leftEle;
								if(leftEle.parentNode!=this.leftBodyUL) {
									leftEle = leftEle.parentNode;
									while(tempLeftEle) {
										var prevLeftEle = tempLeftEle.parentNode.parentNode;
										tempLeftEle = Dom.getNextSibling(prevLeftEle);
										if(tempLeftEle){
											break;
										}else {
											tempLeftEle = prevLeftEle;
											if(tempLeftEle.parentNode==this.leftBodyUL) {
												tempLeftEle = null;
												break;
											}
										}
									}
								}else {
									leftEle = null;
								}
							}
							if(leftEle && leftEle.id) {
								if(leftEle.id=="gridNode") {
									var rightEle = (tempLeftEle)?Dom.getElementsById(tempLeftEle.id, this.rightBodyTbl)[0]:Dom.getFirstChild(this.rightBodyTbl); /*get the next right row*/
								}else {
									var rightEle = Dom.getElementsById(leftEle.id, this.rightBodyTbl)[0];
								}
							}
						}else if(this.getModalAction()=="ADDFIRSTCHILD") {
							var leftEle = this.getLeftRow(this.activeRow);
							leftEle = Dom.getElementsById("gridNode", leftEle, "UL")[0];
							var rightEle = this.getRightRow(parseInt(this.activeRow,10)+1);
							if(!rightEle) {
								rightEle = Dom.getFirstChild(this.rightBodyTbl);
							}
						}
					}else {
						if(this.getModalAction()=="INSERTBEFORE") {
							var leftEle = this.getLeftRow(this.activeRow);
							var rightEle = this.getRightRow(this.activeRow);
						}else {
					var leftEle = this.getLeftRow(this.activeRow+1);
					var rightEle = this.getRightRow(this.activeRow+1);
				}
					}
				}
				if(this.getModalAction()=="APPENDLAST" || (!leftEle && !rightEle)) {
					partialParams.domElement = [this.leftBodyUL, Dom.getFirstChild(this.rightBodyTbl)];
					partialParams.domAction = "append";
				}else {
					partialParams.domElement = [leftEle, rightEle];
					partialParams.domAction = "insert";
				}
				var indexInList = "";
				if(this.activeRow) {
					indexInList = this.activeRow;
					this.leftrowbefore = this.getLeftRow();
					this.postUpdate(indexInList);
				}else {
					this.leftrowbefore = this.getLeftRow();
					this.postUpdate(indexInList);
				}
				if(this.bTreegrid && this.getModalAction()!="INSERTBEFORE") {
					indexInList = (rightEle && rightEle.parentNode!=this.rightBodyTbl)?rightEle.rowIndex-1:"";
				}
				var repeatType = this.bPageGroup?"group":"list";
				var RLInfo = new Array(indexInList, [this.leftBodyUL , this.rightBodyTbl], repeatType);
				if(this.editConfig==this.EDIT_EXPANDPANE){
					responseArray[1] = responseArray[1].replace("expandRowDetails","collapseRowDetails");
				}
				this.loadRow(responseArray[1], partialParams,this.gridDiv.parentNode,RLInfo,true);
			},
			performInsertCallback : function(oResponse){
				var responseStream = oResponse.responseText;
				var responseArray = responseStream.split("||ROWREFRESH||PEGA||PROCESSACTION||");

				if(this.refreshLayout && this.bFilteredGrid){
					this.comingFromAdd = "true";
					pegaUD.handleLoadSuccess(oResponse);
					pegaUD.gBusyInd.hide();
					return;
				}

				oResponse.responseText = responseArray[0];
				if(this.editConfig==this.EDIT_HARNESS) {
					pegaUD.processActionGridDetail_Success(oResponse);
				}else if(this.editConfig==this.EDIT_EXPANDPANE){
					/* do not allow lazy load processing while adding the row markup in DOM;
					 * instead proceed with lazy load when loading the row details markup.
					 */
					var stopLazyLoad = function() { pega.u.d.lazyLoadManager.detachBeforeLoad(stopLazyLoad); return false;};
					pega.u.d.lazyLoadManager.attachBeforeLoad(stopLazyLoad);
					this.loadAppendedRow(responseArray, oResponse);
				}else {
					pega.ctx.activeGrid.bCalledFromGrid = true;
					pegaUD.processActionModal_Success(oResponse);
				}
				if(this.editConfig==this.EDIT_HARNESS || this.editConfig == this.EDIT_MODAL) {
					this.loadAppendedRow(responseArray);
				}else if(!(this.editConfig==this.EDIT_EXPANDPANE)){
					window.setTimeout(function(){pegaUD.processActionGridDetail_Success(oResponse);},200);
				}
				this.comingFromAdd = "true";
				/*store the grid's current scroll top to stop scrolling down until the details are submitted or not.*/
				if(this.pageMode=="Progressive Load") {
					this.gridPrevScrollTop = this.layoutWrapperDiv.scrollTop;
				}
				/*BUG-107758: Set focus on the row as the activerow index is wrong when it's called form processactionGridDetail_success*/
				if(this.bDoNotFocusFADetails) {
					this.focusOnNewEditableRow();
				}
			},

			getFATemplateName: function(templateName, bFromInit) {
				if(templateName) {
					return templateName;
				}
				if(this.templateName)
					return this.templateName;

				var gridTemplateName;
				switch(this.editConfig) {
					case this.EDIT_HARNESS:
						gridTemplateName = "pyGridDetails";
						break;
					case this.EDIT_EXPANDPANE:
						gridTemplateName = "pyGridRowDetails";
						break;
					case this.EDIT_MODAL:
						gridTemplateName = "pyGridModalTemplate";
						break;
				}
				if(!bFromInit && !gridTemplateName)
					gridTemplateName = "pyGridModalTemplate";

				return gridTemplateName;
			},

			/*
			Return the grid row next to the leftRow by excluding the details row if edit mode is
			expand pane and details row is loaded in the DOM.
			@param leftRow {HTML Element}
			@return nextRow|null {HTML Element}
			*/
			getNextGridRow : function(leftRow) {
					if (!leftRow) {
						return null;
					}
					var nextRow = Dom.getNextSibling(leftRow);
					if (!nextRow) {
						return null;
					}
					if (!nextRow.id && ((this.editConfig == this.EDIT_EXPANDPANE && nextRow.getAttribute("expanded") == "true"))) {
						nextRow = Dom.getNextSibling(nextRow);
						/*BUG-141902: traverse to next row when the 'nextRow' is category header.*/
						if(this.bCategorizedGrid && pega.util.Dom.hasClass(nextRow, "grid-categorize-header")){
							nextRow = Dom.getNextSibling(nextRow);
						}
					}
					/*BUG-141902: traverse to next row when the 'nextRow' is category header.
					Introduced below condition for checking category header*/
					else if(this.bCategorizedGrid && pega.util.Dom.hasClass(nextRow, "grid-categorize-header"))	{
					    nextRow = Dom.getNextSibling(nextRow);
					}
					return nextRow;
			},
			/*
			Return the grid row previous to the leftRow by excluding the details row if edit mode is
			expand pane and details row is loaded in the DOM.
			@param leftRow {HTML Element}
			@return previousRow|null {HTML Element}
			*/
			getPreviousGridRow : function(leftRow) {
					if (!leftRow) {
						return null;
					}
					var previousRow = Dom.getPreviousSibling(leftRow);
					if (!previousRow) {
						return null;
					}
					if (!previousRow.id && ((this.editConfig == this.EDIT_EXPANDPANE &&  previousRow.getAttribute("expanded") == "true") || (this.bCategorizedGrid && pega.util.Dom.hasClass(previousRow, "grid-categorize-header")))) {
						previousRow = Dom.getPreviousSibling(previousRow);
						/*BUG-141902: traverse to next row when the 'previousRow' is a expand details row.*/
						if(previousRow.getAttribute("expanded") == "true"){
							previousRow = Dom.getPreviousSibling(previousRow);
						}
					}
					if (!previousRow.id) {
						return null;
					}
				return previousRow;
			},
			/*
			Return the row class oddRow/EvenRow
			@param rowEle {HTML Element}
			@return rowClass
			*/
			getRowClass: function(rowEle) {
				if(pega.util.Dom.hasClass(rowEle, "oddRow")) {
					return "oddRow";
				}
				return "evenRow";
			},

			performModalAction : function(event, templateName) {
				var gridTemplateName = this.getFATemplateName(templateName);

				var modalAction = this.getModalAction();
				/*
				var bEditInHarness = (gridTemplateName=="pyGridDetails");
				var bEditExpandPane = (gridTemplateName=="pyGridRowDetails");
				*/
				var bEditInHarness = (this.editConfig==this.EDIT_HARNESS && (!this.isOpenLocalAction && !this.__fromLocalAction));
				var bEditExpandPane = ((this.editConfig==this.EDIT_EXPANDPANE || gridTemplateName=="pyGridRowDetails") && (!this.isOpenLocalAction && !this.__fromLocalAction));

				if(this.comingFromEditCancel || modalAction == "NEXT" || modalAction == "PREV" || modalAction == "ADD" || modalAction == "REMOVELAST" || (modalAction == "SUBMIT" && bEditInHarness && this.pageMode!="Progressive Load" && (!this.comingFromAdd || this.comingFromAdd=="false"))) {
					this.refreshLayout = false;
				}
				if(modalAction == "REMOVELAST" && (this.bFilteredGrid || this.getExpandPaneTableLength()==1)) { /* On adding a row in a filtered grid and clicking cancel button, set refreshLayout to true */
					this.refreshLayout = true;
				}

				if(modalAction == "SUBMIT" && this.bFilteredGrid && this.refreshLayoutFromConfig !== "true") { /* Don't set refresh layout to true if save is clicked incase of filter grid (grid is reloaded already for add case) , check if refresh is configured in DV */
					this.refreshLayout = false;
				}

				var threadContext = (bEditInHarness||bEditExpandPane)?this.gridDetailsThreadContext:this.modalThreadContext;
				/*do not perform switch Thread incase of ERROR*/
				if(this.threadProcessing && modalAction != "ERROR") {
					pegaUD.switchThread(threadContext);
					pegaUD.switchPrimaryPage("pyWorkPage");
				}
				if(bEditInHarness){
					this.modalAction = this.gridDiv.getAttribute("editAction");
					/*propref becomes empty as TEMP_ASSIGN_REF attribute is empty once row is saved. So, get the propRef from activeRow in this case.*/
					if(this.propRef=="" && this.activeRow) {
						this.propRef = this.getEntryHandle(this.activeRow);
					}
					/*Don't select the row while submitting a newly added row as it is leading to errors.*/
					if(this.propRef && this.comingFromAdd != "true"){
                        var currentDOM = pega.util.Dom.getElementsById(pega.ui.property.toHandle(this.propRef), this.rightBodyTbl, "TR");
						if(currentDOM){
							var currentIndex = currentDOM[0].rowIndex;
							this.setActiveRow(null,null,currentIndex);
						}
					}
				}
        /* BUG-465259: The following have to be recalculated even for single expand reordering case */
				if(!this.NO_UI && bEditExpandPane && !this.threadProcessing && 
           (this.bExpandMultipleRows || (!this.bExpandMultipleRows && this.bDragDrop)) && 
           (modalAction=="SUBMIT"||modalAction=="CANCEL"||modalAction=="JUMP")) {
					this.selectPage(event, this.rightBodyTbl);
					this.modalAction = this.gridDiv.getAttribute("editAction");
					var rowDetailsDiv = pega.util.Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl, "DIV")[0];
					var flowActionContent = pega.util.Dom.getElementsById("pyFlowActionHTML",rowDetailsDiv,"DIV")[0];
					this.propRef = this.getEntryHandle(this.activeRow);
					this.primaryPage = flowActionContent.getAttribute("PRIM_PAGE");
					this.tempInterestPage = flowActionContent.getAttribute("TEMP_BASE_REF");
					this.modalThreadContext = flowActionContent.getAttribute("THREAD_NAME");
					this.usingPage = pegaUD.getBaseRef(this.rightBodyTbl);
				}
				if(this.refreshLayout) {
					var secDiv = pega.u.d.getSectionDiv(this.gridDiv);
					if(secDiv) {
						var queryString = pegaUD.getQueryString(secDiv);
					}
				}
				if(!this.NO_UI){
					if(bEditInHarness) {
						var modalDiv = this.gridDetailsDiv;
					}else if(bEditExpandPane){
						if(this.comingFromAdd) {
							if(!this.threadProcessing) {
								var modalDiv = Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl)[0];
							}else {
								var modalDiv =  this.rightBodyTbl.contains(this.gridDetailsDiv) ? this.gridDetailsDiv : Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl)[0]; //BUG-324966
							}
						}else {
						var modalDiv = Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl)[0];
						}
					}else {
						var modalDiv = pega.u.d.modalDialog.body;
					}
					if(this.modalAction && ((this.getModalAction() != "REMOVELAST" && !this.DONOT_SUBMIT) && !pegaUD.shouldSubmitProceed(event, modalDiv)) ){
						// BUG-66575 : Deselect the row which is selected to expand if "shouldSubmitProceed()" returns false due to validation error.
						if(((bEditInHarness && this.jumpIndex) || (bEditExpandPane && this.toBeExpanded && !this.bExpandMultipleRows)) && this.propRef ){
                            var currentDOM = pega.util.Dom.getElementsById(pega.ui.property.toHandle(this.propRef), this.rightBodyTbl, "TR");
							if(currentDOM){
								var currentIndex = currentDOM[0].rowIndex;
								if(currentIndex) {
									var index = this.jumpIndex ? this.jumpIndex : this.getActiveRowIndexFromRowIndex(parseInt(this.toBeExpanded.rowIndex, 10));
									this.selectRow(index,false);
									this.selectPage(null, null, currentIndex);
								}
							}
						}
						/*Visible embedded pane details row  cannot be submitted now. So, ignore the delete operation and reset the custom delete properties.*/
						if(bEditInHarness && this.deleteGridRow!="") {
							this.selectPage(null,null,this.activeRow);
							this.resetCustomDeleteRowProps();
							if(pega.u.d.inCall){
								this.resetInCall();
							}
						}
						return;
                   	}
                    var reloadElement = pega.util.Dom.getElementsById("RULE_KEY", modalDiv);
					if(reloadElement){
						reloadElement = reloadElement[0];
						var mdQueryString = pegaUD.getQueryString(reloadElement);
					}else{
						var mdQueryString = pegaUD.getQueryString(pega.u.d.modalDialog.body);
					}
					if(queryString){
						queryString.copy(mdQueryString);
					}else {
						var queryString = mdQueryString;
					}

				}
				event = (event == undefined)?window.event : event;
				if(event && typeof event.keyCode == "number" && event.keyCode == 13){
					pega.util.Event.stopPropagation(event);
					pega.util.Event.preventDefault(event);
				}

				var oSafeURL = SafeURL_createFromURL(pegaUD.url);
				/* Params for pzGridModalHTML  */
				if(this.bDataObject) { /* && this.DPParams - second condition is not required - BUG-102248*/
					oSafeURL.put("pyDeclarePage","true");
				}
				oSafeURL.put("pyActivity","ShowStream");
				oSafeURL.put("pyTargetStream","pzGridModalHTML");
				oSafeURL.put("pyBasePage",oSafeURL.get("pzPrimaryPageName"));/*Will be overriden incase ofGridAction */
        if (pega.ctx.bIsDCSPA || pega.ctx.isMDC) { /* BUG-600489 - Cannot Render Section displayed on UI */
          oSafeURL.put("PrimaryPage", pega.ctx.basePrimaryPageName || pega.ctx.primaryPageName /*oSafeURL.get("pzPrimaryPageName")*/);
        } else {
          oSafeURL.put("PrimaryPage",pegaUD.basePrimaryPageName/*oSafeURL.get("pzPrimaryPageName")*/);
        }
				if(this.editConfig) {
					oSafeURL.put("editMode",this.editConfig);
				}
				oSafeURL.put("KeepMessages",pegaUD.KeepMessages);

        /*BUG-252834,BUG-385966 - set pzKeepPageMessages when launching modalaction*/
        if(typeof pega.ctx.KeepPageMessages != "undefined"){
            oSafeURL.put("pzKeepPageMessages",pega.ctx.KeepPageMessages);
          }
				if (pega.u.d.topLevelPageErrors == true)
					oSafeURL.put("TopLevelPageErrors","true");
				else
					oSafeURL.put("TopLevelPageErrors", "false");
				if(this.editConfig==this.EDIT_EXPANDPANE) {
					oSafeURL.put("showSaveDiscard", "true");
				}
				if(modalAction == "REMOVELAST" && this.bFilteredGrid) {
					var nextRowToSelect = (this.editConfig==this.EDIT_EXPANDPANE)?Dom.getNextSibling(Dom.getNextSibling(this.getLeftRow())):Dom.getNextSibling(this.getLeftRow());
					var rowToSelect = nextRowToSelect;
					if(!nextRowToSelect) {
						nextRowToSelect = Dom.getPreviousSibling(this.getLeftRow());
					}
					nextRowToSelect = (nextRowToSelect)?(this.bPageGroup?nextRowToSelect.getAttribute("PG_SUBSCRIPT"):nextRowToSelect.getAttribute("PL_INDEX")):"";
					/*for Page List decrement the PL_INDEX by 1 as the new row is going to be removed. It should be done only when we highlight the next row*/
					if(rowToSelect && !this.bPageGroup && nextRowToSelect!="") {
						nextRowToSelect--;
					}
					if(nextRowToSelect) {
						oSafeURL.put("nextRowToSelect", nextRowToSelect);
					}
					if(this.bFilteredGrid && this.editConfig==this.EDIT_HARNESS) {
					oSafeURL.put("showNextFADetails","true");
				}
				}
				/* FIX : BUG-55467 */
				/* Added a param retainLock to retain lock for the WO after commit(save) */
				if(this.editConfig === "harness" && this.getModalAction() === "SUBMIT" && this.threadProcessing && !(this.isOpenLocalAction && this.bNoThreadProcess)) {
					oSafeURL.put("retainLock", "true");
				}

				/*For for part 3 of BUG-53039, Passing parameter bModalPageCancel to Embed-Rule-NavigationElement ! SubmitModalFlowAction */
				if(this.bModalPageCancel == "true"){
					oSafeURL.put("bModalPageCancel", this.bModalPageCancel);
				}
				/* End Fix */
				if(this.isGridAction){
					if(this.propertyClass.indexOf('Assign-')==0){
						oSafeURL.put("ShowOnlyOKCancel",true);
						oSafeURL.put("GridAction","true");
					}
				}
				if(this.modalThreadContext){
					oSafeURL.put("pyBasePage",this.primaryPage);
				}
				if(this.baseThreadContext){
					oSafeURL.put("BaseThreadContext",this.baseThreadContext);
                  	/*BUG-202660: Sending AJAXTrackID along with base thread context*/
                  	if(pega.ui.ChangeTrackerMap.getTrackerByThread(this.baseThreadContext)){
                  		oSafeURL.put("BaseThreadAJAXTrackID",pega.ui.ChangeTrackerMap.getTrackerByThread(this.baseThreadContext).id);
                    }
				}
				oSafeURL.put("actionName",this.modalAction);
				oSafeURL.put("ModalActionName",this.modalAction);
				if(this.tempInterestPage){
					oSafeURL.put("pyTempInterestPage",this.tempInterestPage);
				}
				oSafeURL.put("Navigation",this.getModalAction()); // rename properly
				/* Params for ProcessAction */
				/*set TaskStatus with flowAction name to render it along with row data for express actions also.*/
				if(this.editConfig==this.EDIT_EXPANDPANE || this.editConfig==this.EDIT_HARNESS) {
					oSafeURL.put("TaskStatus",this.gridDiv.getAttribute("editAction"));
				}
				oSafeURL.put("NewTaskStatus",this.modalAction);
				oSafeURL.put("FormError",pega.u.d.formErrorType);
				oSafeURL.put("FieldError",pega.u.d.fieldErrorType);
				oSafeURL.put("pyCustomError",pega.u.d.pyCustomError);
				if(modalAction == "JUMP"){
					oSafeURL.put("JumpToPage",this.getEntryHandle(this.jumpIndex));
				}
				/* Pass paging related parameters
				 * BUG-158946: Do not pass in case of Navigation JUMP
				 * BUG-175127: Pass in Optimize Clipboard case
                 * BUG-325205: Revert BUG-158946, absence of startIndex causes NumberFormatException in server, will handle BUG-158946 in server
				 */
				if(this.currentPageIndex && this.currentPageIndex!=""/* && (this.getModalAction() != "JUMP" || this.bCBOptimize)*/) {
					if(this.pyPaginateActivity=="") {
					oSafeURL.put("currentPageIndex",this.currentPageIndex);
					oSafeURL.put("pyPageSize",this.rangeSize);
					if(this.bTreegrid) {
						oSafeURL.put("currentPageSize",this.getTopLevelNodesLength());
					}else {
						oSafeURL.put("currentPageSize",this.getDataRowSize());
					}
				}
          if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
				      if(this.pageMode){
					oSafeURL.put("pageMode", this.pageMode);
					}
					/* BUG-158971: row numbers were getting messed up on next navigation */
						/* BUG-132392 Fixed: pressing cancel on modal takes to the first row of the list */
					if(this.pageMode=="Progressive Load" && (this.refreshLayout || this.bCBOptimize)) {
						oSafeURL.put("startIndex", this.getFirstLoadedRowIndex());
					}else {
						oSafeURL.put("startIndex",((parseInt(this.currentPageIndex,10)-1)*parseInt(this.rangeSize,10)+1));
					}
					oSafeURL.put("totalRecords", this.totalRecords);
				}
				if (this.pageMode == "Progressive Load" && this.bDiscardInvisibleRows) {
					oSafeURL.put("bDiscardInvisibleRows", "true");
				}
				oSafeURL.put("isModalFlowAction","true");
				if(bEditInHarness){
					oSafeURL.put("ActionSection", gridTemplateName);
					oSafeURL.put("modalSection", gridTemplateName);
					/* BUG-107535: setting "AvoidDetailsReload" parameter ensures in not getting the details portion in the response - this way we can avoid reload of details on submission. In case of server validation failures, details will still be reloaded*/
					if((this.addNewRow == "true" || this.deleteGridRow == "true") && modalAction=="SUBMIT"){
						oSafeURL.put("AvoidDetailsReload","true");
					}
				}else if(bEditExpandPane) {
					oSafeURL.put("ActionSection", gridTemplateName);
					oSafeURL.put("modalSection", gridTemplateName);
				}else{
					oSafeURL.put("ActionSection", gridTemplateName);
					oSafeURL.put("modalSection", gridTemplateName);
				}
				if(this.templateName){
						oSafeURL.put("MasterDetailTemplate", this.templateName); /* BUG-158934: When modal dialog is launched from expand pane or embed pane flow action, this template will be used by pzGridModalHTML to determine the parent's grid template */
				}
				oSafeURL.put("bIsModal","true");
				oSafeURL.put("isPageGroup",this.bPageGroup);
				oSafeURL.put("BaseReference",this.usingPage);
				oSafeURL.put("PageListProperty",this.getPLPGProperty());
				if(!this.isOpenLocalAction && !this.__fromLocalAction){
					oSafeURL.put("bRODetails",this.bRODetails);
				}
				var rightBodyTbl = this.rightBodyTbl;
				if(this.bPageGroup && rightBodyTbl){
					var rightBdTblRows = rightBodyTbl.rows;
					var activeRow = this.activeRow;
					if(activeRow-1 >= 0 && rightBdTblRows[activeRow-1] != undefined && rightBdTblRows[activeRow-1].PG_SUBSCRIPT != undefined)
							oSafeURL.put("previous",rightBdTblRows[activeRow-1].PG_SUBSCRIPT);
					if(activeRow-2 >= 0 && rightBdTblRows[activeRow-2] != undefined && rightBdTblRows[activeRow-2].PG_SUBSCRIPT != undefined)
							oSafeURL.put("setPrevDisabled",rightBdTblRows[activeRow-2].PG_SUBSCRIPT);

					if(rightBdTblRows[activeRow+1] != undefined && rightBdTblRows[activeRow+1].PG_SUBSCRIPT != undefined)
							oSafeURL.put("next",rightBdTblRows[activeRow+1].PG_SUBSCRIPT);
					if(rightBdTblRows[activeRow+2] != undefined && rightBdTblRows[activeRow+2].PG_SUBSCRIPT != undefined)
								oSafeURL.put("setNextHide",rightBdTblRows[activeRow+2].PG_SUBSCRIPT);
				}
				var leftRow = this.getLeftRow();
				//var flowActionDiv = $("FlowActionHTML");
                var NextButton = pega.util.Dom.getElementsById("ModalNext", modalDiv, "BUTTON");
				if(!NextButton){
					oSafeURL.put("NextHide","true");
				}
				if(NextButton && NextButton[0].disabled) {
					oSafeURL.put("NextDisabled", "true");
				}
				if(this.isOpenLocalAction && modalAction == "NEXT") {
				    /*Moved this logic to pyGridModalHTML to handle server side errors*/
					/*if(!this.getNextGridRow(this.getNextGridRow(leftRow))){*/
						oSafeURL.put("NextDisabled", "false");
					/*}*/
					var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
					if (this.bDiscardInvisibleRows && (pageListIndex < this.totalRecords) && !this.bReadOnlyShowDetails) {
						 oSafeURL.put("NextDisabled","false");
					}
				}
				/*For categorized grid, send the row class*/
				if(this.bCategorizedGrid) {
					oSafeURL.put("gridRowClass", this.getRowClass());
				}
				/* TASK-118164: In case of NoThreadProcess send bNoThreadProcess param */
				if(this.isOpenLocalAction && this.bNoThreadProcess && (modalAction == "NEXT" || modalAction == "PREV" || modalAction == "SUBMIT")) {
					oSafeURL.put("noThreadProcess", "true");
				}
				// BUG-59062: Next Button was disabled at the above condition when navigation reached the last row. Now we need to enable it only for that case.
				/*Moved this logic to pyGridModalHTML to handle server side errors*/
				/*if(this.isOpenLocalAction && modalAction == "PREV" && NextButton && NextButton[0].disabled) {
					oSafeURL.put("NextDisabled", "false");
				}*/
                var PrevButton = pega.util.Dom.getElementsById("ModalPrevious", modalDiv, "BUTTON");
				if(PrevButton && PrevButton[0].disabled){
					oSafeURL.put("PrevDisabled","true");
				}

				if(this.bFilteredGrid){
					if(modalAction !== "SUBMIT") { /* Added if check for BUG-57027 */
						/*get the prev/next sibling for Jump case*/
						if(modalAction=="JUMP") {
							var jumpLeftRow = this.getLeftRow(this.jumpIndex);
							if(parseInt(this.jumpIndex) > this.activeRow) {
								var nextRow = this.getNextGridRow(jumpLeftRow);
							}else {
								var prevRow = this.getPreviousGridRow(jumpLeftRow);
							}
						}
						/*get the prev to prev/ next to next for Prev/Next actions*/
						if(modalAction == "NEXT") {
							var nextRow = this.getNextGridRow(this.getNextGridRow(leftRow));
						}else if(modalAction == "PREV") {
							var prevRow = this.getPreviousGridRow(this.getPreviousGridRow(leftRow));
						}
						if(!nextRow && (modalAction == "NEXT" || (modalAction=="JUMP" && (parseInt(this.jumpIndex) > this.activeRow))) ){
							if(this.isOpenLocalAction){
								oSafeURL.put("NextDisabled","true");
							}else {
								oSafeURL.put("NextHide","true");
							}
						}else{
							oSafeURL.put("NextHide","false");
						}

						if(!prevRow && (modalAction == "PREV" || (modalAction=="JUMP" && (parseInt(this.jumpIndex) < this.activeRow))) ){
							oSafeURL.put("PrevDisabled","true");
						}else{
							oSafeURL.put("PrevDisabled","false");
						}
						if(this.isOpenLocalAction && (modalAction == "PREV" || (modalAction=="JUMP" && (parseInt(this.jumpIndex) < this.activeRow))) && NextButton && NextButton[0].disabled){
							oSafeURL.put("NextDisabled","false");
						}
						/* BUG-57027 */
						if(this.jumpIndex ==1) {
							oSafeURL.put("PrevDisabled","true");
						}
						if(this.jumpIndex == this.getExpandPaneTableLength()) {
							if(this.isOpenLocalAction){
								oSafeURL.put("NextDisabled","true");
							}else {
								oSafeURL.put("NextHide","true");
							}
						}
					}

					oSafeURL.put("curRowNum",this.getCurrentRowNum());
					oSafeURL.put("bFilteredGrid",this.bFilteredGrid);
				}
				if(modalAction=="JUMP"){ /*BUG-166317: HFix-9854: Dev Tip: In case of filtered grid, 'Next' button has to be disabled when last row is reached and enabled while traversing back.*/
					var tempNextRow = Dom.getNextSibling(Dom.getNextSibling(leftRow));
					if(!tempNextRow){
						oSafeURL.put("NextDisabled","true");
						oSafeURL.put("NextHide","false");
					}
					if((parseInt(this.jumpIndex) < this.activeRow)){
						var tempPrevRow = Dom.getPreviousSibling(leftRow);
						if(tempPrevRow){
							oSafeURL.put("NextDisabled","false");
						}
					}
					oSafeURL.put("JumpToIndex",this.jumpIndex);
					oSafeURL.put("DNSUBMIT",this.DONOT_SUBMIT);
				}
				oSafeURL.put("InterestPage",this.primaryPage);

				if(pega.ctx.strHarnessMode != "ACTION")
					oSafeURL.put("HarnessType","NEW");
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);

				/*BUG-159224: propRef is holding previous row's reference after reordering. Reset propRef with the proper value. */
				// this.propRef = pega.ui.property.toReference(leftRow.id); /* Commenting as part of solution to BUG-183134, BUG-159224 is not reproducible any more */

				/*Params for ReloadSection */
                /* BUG-271928: Section name can be empty in cases, for example, when the grid was in an overlay */
                if(this.sectionName) {
				    oSafeURL.put("StreamName",this.sectionName);
                }
				oSafeURL.put("pyPropRef",this.propRef);
				oSafeURL.put("rowPage",this.propRef);
				oSafeURL.put("StreamClass","Rule-HTML-Section");
				oSafeURL.put("gridAction","SUBMITROW");
				if(this.gridPreActivity) {
					oSafeURL.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					oSafeURL.put("gridPostActivity", this.gridPostActivity);
				}

				oSafeURL.put("partialTrigger","editRow" + this.getConfiguredPLPGProperty()+gridIndex);
				oSafeURL.put("EditRow","false");
				/*In case of filtered grid we should pass the grid's filtercriteria page in  the request */
				if(this.bFilteredGrid) {
					oSafeURL.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				}
				if(this.NO_UI){
					oSafeURL.put("NO_UI","true");
				}else {
					var modalDialogDiv = (bEditInHarness)?this.gridDetailsDiv:(bEditExpandPane?modalDiv:pega.u.d.modalDialog.innerElement);
					pega.u.d.disableAllOtherButtons(null, modalDialogDiv);
				}

				var callback;

				// BUG-235166: Only mask the Grid, not the entire harness
				//pegaUD.setBusyIndicator(null, false, true);
				pegaUD.setBusyIndicator(this.gridDiv, false, true);


				var refreshCallbackArgs=pegaUD.getRefreshCallbackArgs(this.gridDiv);
				if(this.refreshLayout) {
					oSafeURL.put("RenderSingle",refreshCallbackArgs.paramName);
					oSafeURL.put("editRowIndex", pega.ui.property.toHandle(this.propRef));
					if(this.pageMode=="Progressive Load") {
						oSafeURL.put("recordsInCurrentPage", (this.currentPageIndex+1)*this.rangeSize);
					}
				}
				oSafeURL.put("refreshLayout",this.refreshLayout);

				var lastRowToRetrieve = this.getLastRowToRetrieve();
				if(lastRowToRetrieve) {
					oSafeURL.put("lastRowToRetrieve", lastRowToRetrieve);
				}

				var callbackArgs = new Array(refreshCallbackArgs.expandInnerDiv, refreshCallbackArgs.expandElement, refreshCallbackArgs.paramName,refreshCallbackArgs.innerDivExists,null, "reloadRepeat",(bEditInHarness||bEditExpandPane), this);
				var asyncConfigOptions;
				/*if(hasFile && this.getModalAction() != "REMOVELAST" && this.DONOT_SUBMIT == false ) {
					var queryString = new SafeURL();
					queryString.put("hasFile", "true");
					pega.util.Connect.setForm(oForm, true);
					asyncConfigOptions = { resetPlaceholders : true };
					callback = {upload:this.performModalCallback, scope:this, argument:callbackArgs};
				} else {*/
					callback ={
						success:this.performModalCallback,
						failure:function(oResponse){pega.u.d.gBusyInd.hide();},
						argument:callbackArgs,
						scope:this

					};

				/*BUG-172530: For a filtered progressive loaded grid, don't disable 'Next' when next set of rows are about to be load.*/
				if(this.bFilteredGrid && modalAction=="JUMP" && this.pageMode == "Progressive Load" && parseInt(this.jumpIndex) < parseInt(this.originalTotalRecords)){
					oSafeURL.put("NextDisabled", "false");
					var loadedRecords = (this.noOfPagesLoaded * this.rangeSize);
					if(this.originalTotalRecords ==loadedRecords && (this.jumpIndex==(this.rangeSize*3))){
						oSafeURL.put("NextDisabled", "true");
					}
					if(this.bReportDefinition && (this.totalRecords ==loadedRecords-1) && (this.jumpIndex==(this.rangeSize*3-1)) ){
						oSafeURL.put("NextDisabled", "true");
					}
				}


				/*BUG-213517: Check if the bFilteredGrid attribute is present in case of JUMP as the value fo this.bFilteredGrid is not accurately set*/
                if(this.getModalAction() == "JUMP" && this.gridDiv.getAttribute("bFilteredGrid") == null){
                  this.bFilteredGrid = false;
                  oSafeURL.put("bFilteredGrid","false");
                }
        /*BUG-566277 : pzPrimaryPageName set to pyBasePage if pyActivity is ShowStream
        if(oSafeURL.get('pyActivity') === 'ShowStream' && this.threadProcessing){
          oSafeURL.put('pzPrimaryPageName', oSafeURL.get('pyBasePage'));
          oSafeURL.put('PrimaryPage', oSafeURL.get('pyBasePage'));
        }*/
				var request = pegaUD.asyncRequest('POST', oSafeURL,callback, ((this.NO_UI && !this.refreshLayout) || (this.getModalAction() == "REMOVELAST" || this.DONOT_SUBMIT == true))?"":queryString, asyncConfigOptions);
			},
			/*API to return row number in the visible order. Used in filtered grid.*/
			getCurrentRowNum: function() {
				var curRowNum = this.getActiveRowIndex();
				/*For paging enabled grids, update the curRowNum*/
				if(this.currentPageIndex && this.currentPageIndex!="" && this.pyPaginateActivity=="" && !this.bReportDefinition && !(this.pageMode == "Progressive Load" && !this.bDiscardInvisibleRows)) {
					curRowNum = (this.currentPageIndex-1)*this.rangeSize+curRowNum;
				}
				return curRowNum;
			},
			/*Function to replace the rowDetailDiv in the new row after submission of details*/
			replaceRowDetailDiv: function(rowDetailsDiv){
				var rightRow = this.getRightRow();
				var newRowDetailsDiv = Dom.getElementsById("rowDetail"+rightRow.id, rightRow)[0];
				var rowDetailsWrapper = Dom.getElementsById("rowDetailWrapper"+rightRow.id, rightRow)[0];
				rowDetailsWrapper.replaceChild(rowDetailsDiv, newRowDetailsDiv);
				rowDetailsDiv.style.display="block";
			},
			performModalCallback : function(oResponse){
				var bEditInHarness = oResponse.argument[6];
        // It will close all the overlays that are part of the previous active tab BUG-576371
        if(this.getModalAction() === "JUMP") {
          var gridDetailsResponse = oResponse.argument[7];
          pega.ui.EventsEmitter.publishSync("onUnloadOverlayClose", {inactiveTab: this.getRightRow(gridDetailsResponse.activeRow), layoutBody: gridDetailsResponse.gridDetailsDiv});
        }
				var modalAction = this.getModalAction();
				/*List Based Triggering Story - Autobots 6.2 - gujas - Start*/
				if (this.comingFromAdd == "true") {
				    this.invokeAddDeleteRefresh = true;
				}
				if(this.comingFromEditCancel) {
					this.comingFromEditCancel=false;
				}
				/*List Based Triggering Story - Autobots 6.2 - gujas - End*/
				/*Start BUG-196987: Complex elements cleanup. Adding only RTE for now, other elements can be included in the array later.*/
		                if(pega.u.d && pega.u.d.nullifyComplexElementsInModal) {
		                    pega.u.d.nullifyComplexElementsInModal(["RTE"]);
		                }
		                /*End BUG-196987*/

				/*This is done only for submit and add in modal dialog.*/
				if(this.getModalAction() == "SUBMIT" || this.getModalAction() == "ADD") {

					var grid_noRes = Dom.getElementsById("Grid_NoResults",this.gridDiv);
					if(grid_noRes && grid_noRes[0] && !hasNestedGrid_noRes) {
						var hasNestedGrid_noRes = !(this.isElementFromSameGridContDiv(grid_noRes[0])); /* BUG-54391 - It happens whenever the expand pane FA has inner grid , and that grid has Grid_noRes TR . */
						/* Fix for Grid in Grid No Results message Add scenario for Embed Pane */
						if(!hasNestedGrid_noRes && (this.editConfig != this.EDIT_HARNESS || (this.editConfig == this.EDIT_HARNESS && this.gridDetailsDiv && !Dom.isAncestor(this.gridDetailsDiv,grid_noRes[0])))) {
							this.removeGridNoResultsMsg();
							this.activeRow--;
						}
					}
				}

				var responseStream = oResponse.responseText;
				var responseArray = "";
				/* BUG-107535: Having ||ROWREFRESH||PEGA||AVOIDDETAILSRELOAD|| in respose means the detailes portion not returned in the response. Hence need to avoid reloading details.*/
				if(responseStream.indexOf("||ROWREFRESH||PEGA||AVOIDDETAILSRELOAD||")>-1){
					var bAvoidDetailsReload = true;
					responseArray = responseStream.split("||ROWREFRESH||PEGA||AVOIDDETAILSRELOAD||");
				}else{
					responseArray = responseStream.split("||ROWREFRESH||PEGA||PROCESSACTION||");// i.e Neither success nor cancel reload modal stream
				}
				if(responseArray.length == 1 && (this.getModalAction() != "REMOVELAST")){
					pegaUD.performFlowACallback(oResponse);
					// Jumping back to the previously selected row in case of errors.

					if (this.getModalAction() == "JUMP" &&  this.activeRow != this.jumpIndex){
						var prevRow = this.activeRow;
						this.activeRow = this.jumpIndex;
						this.selectPage(null,null,prevRow);
					}else if(this.deleteGridRow!="") { /*Visible embedded pane details row  cannot be submitted now. So, ignore the delete operation and reset the custom delete properties.*/
						if(this.editConfig == this.EDIT_EXPANDPANE) {/* BUG-189620, HFix-20775: If there are errors then don't do select page as the selection is already on the row on which modal is launched. */
							if(responseArray[0].indexOf("ERRORTABLE") == -1){
								this.selectPage(null,null,this.activeRow);
							}
						} else {
                          /*BUG-194933: If there are errors then don't do select page as the selection is already on the row on which modal is launched.*/
                          if(responseArray[0].indexOf("ERRORTABLE") == -1){
							this.selectPage(null,null,this.activeRow);
                          }
						}
						this.resetCustomDeleteRowProps();
						if(pega.u.d.inCall){
							this.resetInCall();
					}
					}
					this.addNewRow = "";
					return;
				}

				var actionType = "";
				if(responseArray[0].indexOf("||COMM||") > -1){
					var commitArray = responseArray[0].split("||COMM||");
                   			var tmpArray = commitArray[0].split("||");
					commitArray[0] = tmpArray[0];
			                  actionType = tmpArray[1];
					tmpArray = null;
					var newTransID = commitArray[0];
          if(newTransID) { /* BUG-655021: trim spaces form newTransID as server is complaining if there are special characters */
            newTransID = newTransID.replace(/^\s+|\s+$/g, '');
          }
					responseArray[0] = commitArray[1];
					var newurl = SafeURL_createFromURL(pega.ctx.url);
					newurl.put("pzTransactionId",newTransID);
					if(typeof bRecordEvent != "undefined") {
						var origbRecordEvent = bRecordEvent;
						bRecordEvent = false;
					}
					pega.ctx.url = newurl.toURL();
					if(pega.ctx.dom.getElementsByTagName("form")[0]){
						var url = pega.ctx.dom.getElementsByTagName("form")[0].action;
						var formURL = SafeURL_createFromURL(url);
						formURL.put("pzTransactionId",newTransID);
						pega.ctx.dom.getElementsByTagName("form")[0].action= formURL.toURL();
					}
					if(typeof bRecordEvent != "undefined") {
						bRecordEvent = origbRecordEvent;
					}
				}

				if((this.getModalAction()=="SUBMIT" || this.getModalAction()=="REMOVELAST") &&  this.refreshLayout){
					if (typeof(this.modalThreadContext) != "undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext && this.threadProcessing) {
            pegaUD.switchThread(this.baseThreadContext);
						pegaUD.switchPrimaryPage(pegaUD.basePrimaryPageName);
					}
                  /*BUG-273307 reverting the changes of BUG-263151*/
                   /*if(this.refreshLayout == true && this.bRefreshOnUpdate == true && this.MODAL_ACTION == "SUBMIT"){
                    oResponse.argument[0]= oResponse.argument[1];
                  }*/
					pegaUD.handleLoadSuccess(oResponse);
          //BUG-660180(while adding first row & cancelling, the main dialog should not close) and BUG-667451(Popup not closing)
          if(this.editConfig === this.EDIT_MODAL || this.action === this.FLOW_ACTION) {
				  	pegaUD.hideModalWindow();
					  pegaUD.processModalCallbak("CLOSE");
          }
          // END- BUG-660180 and BUG-667451
					//BUG-132080 fix emptying the modal content div in case of close and cancel of modal dailog
					var modalContentNode = document.getElementById("modalContent");
					/*BUG-212712: Handling the modal content emptying for old modal dialog */
					var modaldialog_bdNode = document.getElementById("modaldialog_bd");

					if(this.editConfig == this.EDIT_MODAL && (modalContentNode || modaldialog_bdNode)&& this.getModalAction()=="REMOVELAST"){
						modalContentNode && (modalContentNode.innerHTML="");
						modaldialog_bdNode && (modaldialog_bdNode.innerHTML="");
					}

					if(this.editConfig != this.EDIT_HARNESS && typeof(this.modalThreadContext)!="undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext && this.threadProcessing){
						 /*if(this.editConfig != this.EDIT_EXPANDPANE || !this.toBeExpanded) {*/
            pegaUD.switchThread(this.baseThreadContext);
						pegaUD.switchPrimaryPage(pegaUD.basePrimaryPageName);
						var threadDeleteURL = SafeURL_createFromURL(pegaUD.url);
						threadDeleteURL.put("pyActivity","removeThead");
						threadDeleteURL.put("threadName",this.modalThreadContext);
						var request = pegaUD.asyncRequest('POST', threadDeleteURL);
						/*}*/
					}

					pegaUD.gBusyInd.hide();

					return;
				}

				this.rightrowbefore = this.getRightRow();//If coming here from prev/next then activeRow is already updated.
				this.leftrowbefore = this.getLeftRow();
				var loadedOnce = "false";
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
				var partialParams = {
								partialTrigger : "editRow" +this.getConfiguredPLPGProperty()+gridIndex,
								domElement : [this.leftrowbefore ,this.rightrowbefore],
								domAction : "replace",
								beforeDomAction :this.loadGridForEdit ,
								beforeDomActionContext:this,
								beforeParams : null,
								afterDomAction :this.submitRowCallback ,
								afterParams : [this,this.activeRow],
								bTreegrid : this.bTreeGrid,
								sendSectionData:"true",
                bNotExpandRow: (this.getModalAction() == "JUMP") ? true : false /*BUG-640742 In Hierarchical list previous collapsed item getting expanded */
							};
				var bNoThreadProcess = this.bNoThreadProcess;
				var isOpenLocalAction = this.isOpenLocalAction;

				if(!(this.getModalAction() == "ADD" || this.getModalAction() == "PREV" || this.getModalAction() == "NEXT" || this.getModalAction() == "JUMP")){
					if(!bEditInHarness) {
					// For handling upload modal dialog in attach Content control @deltatouch
					if (pega.u.d.submitModalDlgParam && pega.u.d.submitModalDlgParam.taskStatus == 'pyAttachContent') {
						if (pega.c.activeAttachElement && pega.c.activeAttachEventObj) {
							if (typeof(pega.c.activeAttachElement.attr('data-upload')) != 'undefined') {
								pega.c.activeAttachElement.attr('data-click', pega.c.activeAttachElement.attr('data-upload'));
								pega.c.eventController.handler(pega.c.activeAttachEventObj);
							}
						}
					}
						pegaUD.hideModalWindow();
						pegaUD.processModalCallbak("CLOSE");
						//BUG-132080 fix emptying the modal content div in case of close and cancel of modal dailog
						var modalContentNode = document.getElementById("modalContent");
						/*BUG-212712: Handling the modal content emptying for old modal dialog */
						var modaldialog_bdNode = document.getElementById("modaldialog_bd");

						if(this.editConfig == this.EDIT_MODAL && (modalContentNode || modaldialog_bdNode)&& this.getModalAction()=="REMOVELAST"){
							modalContentNode && (modalContentNode.innerHTML="");
							modaldialog_bdNode && (modaldialog_bdNode.innerHTML="");
						}
					}else {
						pegaUD.enableAllButtons(this.gridDetailsDiv);
					}
					pegaUD.gBusyInd.hide();
				}
				if(loadedOnce != "true" && !(this.getModalAction() == "REMOVELAST" || this.DONOT_SUBMIT )){//This executes in case of Next,Prev,Add on existing row.// Normal cases we simply replace existing row partial refresh.
					/*for ExpandPane editing mode, cache the rowDetailDiv before replacing the TR in dom*/
					if(this.editConfig==this.EDIT_EXPANDPANE && this.getModalAction()=="SUBMIT") {
						var rightRow = this.getRightRow();
						var rowDetailsDiv = Dom.getElementsById("rowDetail"+rightRow.id, this.rightBodyTbl);
						if(rowDetailsDiv){
							rowDetailsDiv = rowDetailsDiv[0];
						}
						if(rowDetailsDiv && this.threadProcessing){
							if(pega.env.ua.ie) {
								Event.removeListener(rowDetailsDiv,"focusin",this.setExecutionThread);
								Event.removeListener(rowDetailsDiv,"focusout",this.resetExecutionThread);
							} else {
								var grid = this;
								rowDetailsDiv.removeEventListener("focus",grid.wrapperSetET,true);
								rowDetailsDiv.removeEventListener(Grids.EVENT_CLICK,grid.wrapperSetET,true);
								rowDetailsDiv.removeEventListener("blur",grid.wrapperReSetET,true);
							}
						}
					}
                    /* BUG-271928: Don't load the row if response is empty */
                    if(responseArray[0]) {
					    this.loadRow(responseArray[0], partialParams,this.gridDiv.parentNode);
                    }
					if (this.bDiscardInvisibleRows && this.getModalAction() == "SUBMIT" && this.comingFromAdd == "true") {
						this.totalRecords++;
					}
					if(this.threadProcessing || !this.bExpandMultipleRows){
						if(rowDetailsDiv) {
							this.expandedElem = null;
							var detailsTR = rowDetailsDiv.parentNode.parentNode;
							detailsTR.parentNode.removeChild(detailsTR);
						}
						if(this.toBeCollapsed && typeof(this.toBeCollapsed)=="object") {
							Dom.removeClass(this.toBeCollapsed, "collapseRowDetails");
							Dom.addClass(this.toBeCollapsed, "expandRowDetails");

							if(this.editConfig != this.EDIT_HARNESS && typeof(this.modalThreadContext)!="undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext && this.threadProcessing){
                pegaUD.switchThread(this.baseThreadContext);
								pegaUD.switchPrimaryPage(pegaUD.basePrimaryPageName);
								var threadDeleteURL = SafeURL_createFromURL(pegaUD.url);
								threadDeleteURL.put("pyActivity","removeThead");
								threadDeleteURL.put("threadName",this.modalThreadContext);
								var request = pegaUD.asyncRequest('POST', threadDeleteURL);
							}

							this.toBeCollapsed = null;
							this.expandedElem = null;
							if(!this.toBeAdded || !this.insertAction) {
								this.comingFromAdd = false;
							}
							if(typeof(this.toBeExpanded)=="object" && this.toBeExpanded) {
								var toBE = this.toBeExpanded;
								//this.toBeExpanded = null;
								var evobj;
									evobj = {type:Grids.EVENT_CLICK,target:toBE};
								this.handleEditItem(evobj,null,this.getIndex(toBE.rowIndex));
								//Event.fireEvent(toBE, "click");
								return;
							}
							if(this.toBeAdded && this.insertAction!="") {
								this.resetExecutionThread();
								this.setModalAction(this.insertAction);
								this.performInsertAction();
								return;
							}
							if(this.getModalAction() == "SUBMIT") {
								this.selectPage(null,null,this.activeRow);
							}
							this.autoAdjustProgressiveGridHeight();
							return;
						}
					}
					if(this.getModalAction() == "SUBMIT" || this.getModalAction() == "ERROR") {
                        this.selectPage(null,null,this.getIndex(this.activeRow));
						if(this.isGridAction && this.propertyClass.indexOf('Assign-')==0 && actionType=="FlowAction"){
							this.disableRow();
						}
					}
				}
				if(this.getModalAction()!="ADD" && this.comingFromAdd == "true"){ // If this action was after adding a row, we need to insert before dummy els
						this.comingFromAdd = "false"; //Next time we wont be coming from newly added row.
				}
				if(this.getModalAction() == "JUMP"){
					this.selectPage(null,null,this.getIndex(this.jumpIndex));
					this.synchScrollsWithModal();
				}else if(this.getModalAction() == "NEXT"){
					var nextNode = this.getNextGridRow(this.getLeftRow());
					if (!nextNode && this.bDiscardInvisibleRows) {
						var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
						if (pageListIndex < this.totalRecords){
							this.activeRow++;
						}
					} else {
                        var rightNode = pega.util.Dom.getElementsById(nextNode.id, this.rightBodyTbl, "TR")[0];
						this.selectPage(null,null,rightNode.rowIndex);
					}
					this.synchScrollsWithModal();
				}else if(this.getModalAction() == "PREV"){
					var prevNode = this.getPreviousGridRow(this.getLeftRow());
					if (!prevNode && this.bDiscardInvisibleRows) {
						var pageListIndex = this.activeRow + this.getFirstLoadedRowIndex() - 1;
						if (pageListIndex > 1){
							this.activeRow--;
						}
					} else {
                        var rightNode = pega.util.Dom.getElementsById(prevNode.id, this.rightBodyTbl, "TR")[0];
						this.selectPage(null,null,rightNode.rowIndex);
					}
					this.synchScrollsWithModal();
				}else if(this.getModalAction() == "ADD") {
					//We can come here in two ways: 1. either clicking add on newly created row or 2.Clicked add on an already existing row.
					var tempResponseObj = oResponse;
					var seperatorText = "||ROWREFRESH||PEGA||PROCESSACTION||";
					var tInd = oResponse.responseText.indexOf(seperatorText)+seperatorText.length;
					tempResponseObj.responseText = oResponse.responseText.substring(tInd);
					tempResponseObj.argument[0] = oResponse.argument[oResponse.argument.length-1];
					this.performInsertCallback(tempResponseObj);
					this.comingFromAdd = "true";
				}else if (this.getModalAction() == "REMOVELAST"){
				    if(this.editConfig != this.EDIT_HARNESS && typeof(this.modalThreadContext)!="undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext && this.threadProcessing){
            pegaUD.switchThread(this.baseThreadContext);
						pegaUD.switchPrimaryPage(pegaUD.basePrimaryPageName);
						var threadDeleteURL = SafeURL_createFromURL(pegaUD.url);
						threadDeleteURL.put("pyActivity","removeThead");
						threadDeleteURL.put("threadName",this.modalThreadContext);
						var request = pegaUD.asyncRequest('POST', threadDeleteURL);
					}
					if(this.editConfig==this.EDIT_EXPANDPANE) {
						var rowDetailsDiv = Dom.getElementsById("rowDetail"+this.getRightRow().id, this.rightBodyTbl)[0];
						if(this.threadProcessing || !this.bExpandMultipleRows) {
							var detailsTR = rowDetailsDiv.parentNode.parentNode;
							detailsTR.parentNode.removeChild(detailsTR);
						}
					}
					this.removeAppendedRow();
                    this.selectPage(null,null,this.activeRow);
					this.comingFromAdd = "false";

				}else if(this.getModalAction() == "SUBMIT" && !bNoThreadProcess){/* TASK-118164: Don't do remove thread processing if bNoThreadProcess is true */
					if((this.editConfig != this.EDIT_HARNESS || isOpenLocalAction) && typeof(this.modalThreadContext)!="undefined" && this.modalThreadContext != "" && this.modalThreadContext != this.baseThreadContext && this.threadProcessing){
                        /* BUG-189878: Try to empty the actionSequencer */
                        if(isOpenLocalAction || this.editConfig == this.EDIT_MODAL) {
							/* The modal dialog may still not be open,
							 * Temporarily change the flag to true
							 */
							var tempModalFlag = pega.u.d.bModalDialogOpen;
							pega.u.d.bModalDialogOpen = true;
							pega.c.actionSequencer.clearQueue();
							pega.u.d.bModalDialogOpen = tempModalFlag;
						}

						/*if(this.editConfig != this.EDIT_EXPANDPANE || !this.toBeExpanded) {*/
            /*BUG-572438 : using switchthread instead of url replace*/
            pegaUD.switchThread(this.baseThreadContext);
						pegaUD.switchPrimaryPage(pegaUD.basePrimaryPageName);
						var threadDeleteURL = SafeURL_createFromURL(pegaUD.url);
						threadDeleteURL.put("pyActivity","removeThead");
						threadDeleteURL.put("threadName",this.modalThreadContext);
						var request = pegaUD.asyncRequest('POST', threadDeleteURL);
						/*}*/
					}
					if(this.comingFromAdd == "true"){//If this action was after adding a row, we need to insert before dummy els
						if(this.editConfig==this.EDIT_EXPANDPANE) {
							var rowDetailsDiv = Dom.getElementsById("rowDetailyui_modalrownew", this.rightBodyTbl)[0];
							if(this.threadProcessing || !this.bExpandMultipleRows) {
								var detailsTR = rowDetailsDiv.parentNode.parentNode;
								detailsTR.parentNode.removeChild(detailsTR);
							}
						}
						this.removeAppendedRow();
						if(rowDetailsDiv && !this.threadProcessing && this.bExpandMultipleRows) {
							/*update the icon class if it's collapsed. This happens when user clicks on submit on a newly added row. */
							var rightRow = this.getRightRow();
							var leftRow = this.getLeftRow();
							var iconCell = this.fixedCol?Dom.getElementsByClassName("expandRowDetails", "LI", leftRow):Dom.getElementsByClassName("expandRowDetails", "TD", rightRow);
							if(iconCell && iconCell[0]) {
								Dom.removeClass(iconCell[0], "expandRowDetails");
								Dom.addClass(iconCell[0], "collapseRowDetails");
							}
							rowDetailsDiv.id = "rowDetail"+rightRow.id;
							rowDetailsDiv.parentNode.id = "rowDetailWrapper"+rightRow.id;
							this.replaceRowDetailDiv(rowDetailsDiv);
						}
                      	var indexInList = pega.ctx.indexInList;
						this.selectRow(indexInList,true);
						this.focusOnNewEditableRow();
					}

					this.action="";
					this.comingFromAdd = "false";
					this.synchScrollsWithModal();
				}
				this.action="";
                /*BUG-57380: Reset the values to empty string to avoid data corruption while adding a row in Inline grid.*/
				this.leftrowbefore = "";
				this.rightrowbefore = "";
				this.DONOT_SUBMIT = false;

				var newStream = responseArray[0];
				var documentFragment = document.createDocumentFragment();
				var newElement = document.createElement("DIV");
				newElement.style.display = "none";
				documentFragment.appendChild(newElement);
				newElement.innerHTML = newStream;
				pegaUD.handleFormErrors(newElement);

				oResponse.responseText = responseArray[1];

				if(this.getModalAction() == "ADD" || this.getModalAction() == "PREV" || this.getModalAction() == "NEXT" || this.getModalAction() == "JUMP" || (this.editConfig == this.EDIT_EXPANDPANE && (this.getModalAction() == 'SUBMIT' || this.NO_UI)) || (bEditInHarness && !bAvoidDetailsReload)){
					var bSkipLoadingDetails = (this.editConfig == this.EDIT_EXPANDPANE && (this.threadProcessing || !this.bExpandMultipleRows)&& this.getModalAction() == 'SUBMIT' )?true:false;
					bSkipLoadingDetails = (responseArray[1] == "");
					if(bEditInHarness || (this.editConfig == this.EDIT_EXPANDPANE && this.getModalAction() == 'SUBMIT')) {
						/*Do not reload details portion for expand pane with thread processing after submit*/
						/*Check for oResponse.responseText as loadDomObject fails when it's null or undefined  && oResponse.responseText*/
                        /* BUG-250988: Trim the responseText to check if its actually empty */
						if(!bSkipLoadingDetails && oResponse.responseText) {
							/*Change the argument[0] to grid so that it works find in processActionGridDetail_Success*/
							oResponse.argument[0] = this;
							pegaUD.processActionGridDetail_Success(oResponse);
						}
					}else if(this.comingFromAdd != "true") {/* BUG-153452: Kept this check to avoid duplicate invocation of pegaUD.processActionModal_Success() method. In performInsertCallback() this.comingFromAdd is set to "true". pegaUD.processActionModal_Success() is already invoked in performInsertCallback() so avoid calling it if this.comingFromAdd == "true". this.comingFromAdd is set to false at the beginning of this method if(this.getModalAction() != "ADD" && this.comingFromAdd == "true") */
						pega.ctx.activeGrid.bCalledFromGrid = true;
						pegaUD.processActionModal_Success(oResponse);
					}
				}
				if(modalAction == "REMOVELAST" && bEditInHarness && this.editConfig==this.EDIT_HARNESS){
					this.DONOT_SUBMIT = true;
					this.jumpToIndex(null,this.getActiveRowIndex()); /*first argument was initially e, but noticed that it does not have any significance. hence passing it as null*/
				}
				if(pega.u.d.inCall){
					this.resetInCall();
				}
				/*List Based Triggering Story - Autobots 6.2 - gujas - Start*/
				if (this.invokeAddDeleteRefresh && (this.getModalAction() == "SUBMIT" || this.getModalAction() == "REMOVELAST")) {
	                this.invokeAddDeleteRefresh = false;
		       var triggerAddDelArgs = {};
		       triggerAddDelArgs.listName = this.getPLPGProperty();
           	       triggerAddDelArgs.listBaseRef= this.baseRef;
           	       triggerAddDelArgs.listprimaryPage= this.primPage;
	                pega.u.d.triggerAddDeleteRefreshSections(triggerAddDelArgs);
				}
				/*List Based Triggering Story - Autobots 6.2 - gujas - End*/
				/*for Edit in embedded pane, trigger performInsertAction if append icon is clicked second time*/
				if((this.editConfig==this.EDIT_HARNESS || (this.editConfig==this.EDIT_EXPANDPANE && (this.threadProcessing || !this.bExpandMultipleRows))) && this.addNewRow=="true") {
					this.notSubmitDetails = true;
					this.performInsertAction();
				}
				if(this.editConfig==this.EDIT_HARNESS && this.deleteGridRow == "true") {
					this.notSubmitDetails = true;
					this.selectPage(null, null, this.deleteGridRowIndex);
					this.remove(this.getActiveRowIndex());
				}
				/* Accessibility - focus should return to the submitted row */
				if(modalAction == "SUBMIT" || modalAction == "ERROR") {
					this.focusFirstElement(this.rightBodyTbl.rows[this.getIndex(this.activeRow)]);
				}
				this.autoAdjustProgressiveGridHeight();
			},

			setExecutionThread : function(e){
                var flowActionDiv = pega.util.Dom.getElementsById("pyFlowActionHTML", this.gridDetailsDiv, "DIV");
				if (!flowActionDiv) {
					return;
				}
				flowActionDiv = flowActionDiv[0];
				var threadname = flowActionDiv.getAttribute("THREAD_NAME");
				pegaUD.switchThread(threadname);
				pegaUD.switchPrimaryPage("pyWorkPage");
			},

			resetExecutionThread : function(e){
				if(e) {
					var target = Event.getTarget(e);
					if((e.type == Grids.EVENT_CLICK) && (Dom.isAncestor(this.gridDetailsDiv, target) || this.isTargetComplexProperty(target))) {
						return;
					}
					else if(e.type == "blur" || e.type == "focusout" || e.type == "mouseout") {
						var ae = document.activeElement;
                          /*BUG-317660 : Start - Safari specific handling when focus goes to body*/
					    var userAgent = window.navigator.userAgent;
                        var isSafari = userAgent.match(/safari/i) && !userAgent.match(/chrome/i);
					    if(isSafari && ae && ae.tagName == "BODY") return;
                        /*BUG-317660 : End*/

						/* do not avoid resetting of execution thread when mouseout happens while the active element is still in GridDetailDiv
						 * as this is a valid scenario for onhover events when the element with focus is inside the GridDetailsDiv
						 * but the hover event is configured on elements outside.
						 * Only when one hovers on AutoComplete options while the AutoComplete is still focussed, we should avoid resetting the execution thread.
						 */
						if(e.type != "mouseout" && Dom.isAncestor(this.gridDetailsDiv, ae)) {
							return;
						}
						var autoComp = null;
						if(e.type == "mouseout") {
							autoComp = ae;
						}
						else {
							autoComp = target;
						}
						/*BUG-69631: When click happens on AutoComplete Div, blur event is fired and don't reset the thread in such case.*/
						if(autoComp && autoComp.getAttribute("data-ctl")=='["AutoComplete"]') {
							/*
							 * on mouseout from AutoComplete text box which is inside the gridDetailsDiv,
							 * do not reset the execution thread as currently auto complete options might being shown.
							 * Also on clicking an AutoComplete option, the AC div disappears.
							 * This happens when focusout or blur event is fired from AutoComplete text box.
							 * Hence avoid resetting the execution thread if options are still visible
							 */
							var acObject = autoComp.AutoComplete;
							var acOptionsDiv = acObject.div;
							if(Dom.hasClass(acOptionsDiv, "autocomplete_main") && acOptionsDiv.style.visibility == "visible") {
								return;
							}
							if(e.type != "mouseout" && this.isTargetComplexProperty(ae)) {
								return;
							}
						}
					}
				}
				/*BUG-73880 - Even if gridDetailsDiv is there, check for flowactionhtml in it so that empty details portion case when target for edit is given*/
				var FlowActionHTML = null;
				if(this.gridDetailsDiv)
                    FlowActionHTML = pega.util.Dom.getElementsById("pyFlowActionHTML", this.gridDetailsDiv, "DIV");
				if(FlowActionHTML == null){
					return;
				}
				else{
					/* In the Grid context, no need to reset the thread if it wasn't set by Grid*/
					var threadname = FlowActionHTML[0].getAttribute("THREAD_NAME");
          /* BUG-377440: HFix-44946 For IE focusout check if the document.activeElement is inside the gridDetailsDiv */
          var gridDetailsLostFocus = false;
          if(pega.env.ua.ie && e && e.type=="focusout" && document.activeElement && this.gridDetailsDiv && !Dom.isAncestor(this.gridDetailsDiv, document.activeElement)){
            gridDetailsLostFocus = true;
          }
          /* BUG-291764: Additional condition to check if the target element is inside the griddetailsdiv and
           * the threadname of the detailsdiv flowaction is the same as the current thread */
					if(threadname != pegaUD.getThreadName() || ( e && Dom.isAncestor(this.gridDetailsDiv, e.target) && threadname == pegaUD.getThreadName() && !gridDetailsLostFocus) ){
						return;
					}
				}
				/*BUG-58393/58395 : Do not change thread when Local action is launched(in modal dialog) from embedded pane*/
                if(pegaUD.insertButton){ /* BUG-283413: Additionally check that the target is inside a modal dialog */
                  /* BUG-512600 : Expanded section issue : added check for `e` */
                  if(e && Dom.isAncestor(this.gridDetailsDiv, pegaUD.insertButton) && document.getElementById("modalOverlay") && Dom.isAncestor(document.getElementById("modalOverlay"), e.target) ){
                    return;
                  }

                }

				/* BUG-60169 :  Do not change thread when Filter Popover Icon is clicked from a grid inside embedded pane(tree)*/
				if(pegaUD.fromFilterPopover && Dom.isAncestor(this.gridDetailsDiv,pegaUD.fromFilterPopover)) {
					return;
				}
        /*BUG-626399 : use basethreadcontext incase of undefined baseThreadName */
				var originalThread = pegaUD.baseThreadName;
				if (!originalThread){
         originalThread = (pega.ctx.isMDC && pega.ctx.dom.isInContext(this.gridDiv) && this.baseThreadContext) ? this.baseThreadContext : pegaUD.getThreadName();
				}
				pegaUD.switchThread(originalThread);

				var originalPrimary = pegaUD.basePrimaryPageName;
				if (!originalPrimary){
					originalPrimary = SafeURL_createFromURL(pegaUD.url).get('pzPrimaryPageName');
				}
				pegaUD.switchPrimaryPage(originalPrimary);
			},

			postUpdate : function(indexInList){

              	/* BUG-316940: (HFix-36114) In case the grid is empty, "add before" should not updateHandlesAfterInsert */
                if(indexInList == "") {
                  return;
                }

				if(this.action=="INSERTBEFORE" ||(Dom.getNextSibling(this.leftrowbefore) && this.action=="INSERTAFTER") ){
					var gridTables = [this.leftBodyUL,this.rightBodyTbl];
					if(!this.bTreegrid) {
						if(this.action=="INSERTBEFORE") {
							pega.u.d.updateHandlesAfterInsert([indexInList-1, gridTables,this]);

						}
						else {
							pega.u.d.updateHandlesAfterInsert([indexInList, gridTables,this]);
						}
					}
					else if(this.bTreegrid && this.action != "APPENDLAST" ){
						this.updateTreeHandlesAfterInsert(indexInList);
					}

				}

			},

			/*
			@protected- Function description goes here.
			@param $undefined$e – parameter description goes here.
			@param $undefined$container – parameter description goes here.
			@param $undefined$istabbedout – parameter description goes here.
			@param $undefined$pageIndex – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			editRow : function(e,container, index) {
				var srcElem = Event.getTarget(e);
				if(srcElem.tagName=="A" &&  srcElem.parentNode.id=="iconExpandCollapse"){
					return;
				}
				var pageIndex  = this.getPageIndex(e,container);
				if(!pageIndex || pageIndex==-1) {
					pageIndex = index;
				}
				if(pageIndex <= 0){ /* this was added to avoid when clicked on header */
					return;
				}
				var cell = this.findCell(e, container,srcElem);
				if(cell){
					if(container == this.leftBodyUL)
						this.focusElem ={index:this.getCellIndex(cell),tag:"LI"};
					else
						this.focusElem ={index:cell.cellIndex,tag:cell.nodeName};
				}
				var rightrow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)];
				/*don't call for edit row if it's already in editable mode */
				if(pega.util.Dom.hasClass(rightrow, "editMode"))
					return;

				/* do not proceed if another row is already editable */
				if(this.editableIndex && this.editableIndex > 0) {
					var doNotProceed = false;
					var currentEditableRow = this.rightBodyTbl.rows[this.getIndex(this.editableIndex)];
					if(currentEditableRow && pega.util.Dom.hasClass(currentEditableRow, "editMode")) {
						doNotProceed = true;
                    }
                    else if (this.bTreegrid || this.fixedCol){
                        currentEditableRow = pega.util.Dom.getElementsById(currentEditableRow.id, this.leftBodyUL, 'LI')[0];
						if(currentEditableRow && pega.util.Dom.hasClass(currentEditableRow, "editMode")) {
							doNotProceed = true;
						}
					}

					if(doNotProceed) {
						/* the row at index editableIndex is currently editable;
						 * it should be submitted first before making any other row editable; currently we do not want to that;
						 * instead we unhighlight the currently active row; then set the active row to the already editable row;
						 * then higlight and focus the already editable row.
						 */
						this.selectRow(this.activeRow, false);
						this.activeRow = this.editableIndex;
						this.selectRow(this.activeRow, true);
						this.focusOnNewEditableRow();
						return;
					}
				}

				this.rightrowbefore = rightrow;
				if(this.bTreegrid || this.fixedCol){
                    this.leftrowbefore = pega.util.Dom.getElementsById(this.rightrowbefore.id, this.leftBodyUL, 'LI')[0];
				}

				var strActionSF = new SafeURL();
				strActionSF.put("PageListProperty",this.getPLPGProperty());
				if(!this.bPageGroup){
					var plIndex = this.rightrowbefore.getAttribute("PL_INDEX");
					strActionSF.put("IndexInList",plIndex);
					strActionSF.put("strIndexInList",plIndex);
				}else{
					var subscript = this.rightrowbefore.getAttribute("PG_SUBSCRIPT") ;
					strActionSF.put("Subscript",subscript);
				}
				strActionSF.put("gridAction",this.EDIT_ACTION);

				if(this.gridPreActivity) {
					strActionSF.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					strActionSF.put("gridPostActivity", this.gridPostActivity);
				}

				strActionSF.put("pyPropRef",pega.ui.property.toReference(this.rightrowbefore.id));
				strActionSF.put("EditRow",'true');
				if(this.bFilteredGrid) {
					strActionSF.put("curRowNum",this.getCurrentRowNum());
				}
				//TASK-143236 :StartIndex Parameter Issue Start
				if(this.bReportDefinition ||  this.pyPaginateActivity){
					var startIndex = (this.currentPageIndex - 1) * this.rangeSize + 1;
					strActionSF.put("startIndex", startIndex);
                                }
				//TASK-143236 :StartIndex Parameter Issue End
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);

				var partialParams = {
					partialTrigger :  "editRow" + this.getConfiguredPLPGProperty()+gridIndex,
					domElement : [this.leftrowbefore,this.rightrowbefore],
					domAction : "replace",
					beforeDomAction :this.loadGridForEdit ,
					beforeDomActionContext:this,
					beforeParams : null,
					afterDomAction : this.editRowCallback,
					afterParams : [this,this.activeRow],
					leftRowBefore : this.leftrowbefore,
					rightRowBefore : this.rightrowbefore,
					sendSectionData : "true"
				};

				/* BUG-162698: Don't POST section data when the row state transforms from read-only to edit */
				if(this.editConfig == this.EDIT_ROW){
					delete partialParams.sendSectionData;
				}
        /* BUG-521635: A flag to control message clearing from primary page */
        strActionSF.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');

				var focusParams = new Array(this.getPLPGProperty(), pageIndex);
				var reloadParams ={
					preActivity:"pzdoGridAction",
					preActivityParams:strActionSF.toQueryString(),
					event:e,
					focusParams:focusParams,
					reloadEle:cell,
					partialParams:partialParams
				}
				pegaUD.reloadRepeatLayout(reloadParams.preActivity,reloadParams.preActivityParams,reloadParams.event,reloadParams.focusParams,reloadParams.reloadEle ,reloadParams.partialParams,true);

				this.editableIndex = this.activeRow;
			},

			/*
			@protected- Function description goes here.
			@param $undefined$grid – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			editRowCallback : function(args){
				var grid = args[0];
				var gridActiveRow = args[1]
				var bDoNotFocus = args[2];
				grid.activeRow = gridActiveRow;
				if(grid && !grid.activeRow) {
					return;
				}
				grid.selectRow(grid.activeRow, true);
				if(!bDoNotFocus) {
					grid.focusOnNewEditableRow();
				}
				/*BUG-121528: setting setbAJAXFromEditableRow property on grid object to treat the row as dirty when AJAX sent from within the row. */
				if(this.editConfig == this.EDIT_ROW){
					grid.setbAJAXFromEditableRow = function(reloadEle){
						/* BUG-160088: pega.util.Dom.isAncestor code returned inconsistent values in Chrome and IE. In one case it uses HtmlElement#contains method, in other case it skips it. The values are inconsistent when the two arguments passed to the method are same. */
						grid.bAJAXFromEditableRow = (grid.getRightRow() !== reloadEle && pega.util.Dom.isAncestor(grid.getRightRow(),reloadEle)) || (grid.getLeftRow() !== reloadEle && pega.util.Dom.isAncestor(grid.getLeftRow(),reloadEle));
					};
					pega.u.d.attachOnload(grid.setbAJAXFromEditableRow, true);
				}else if(this.editConfig == this.EDIT_EXPANDPANE && args.length == 4){
					var responseObj = args[3];
					pegaUD.processActionGridDetail_Success(responseObj);
				}
			},

			/*
			@private checks if the elements inside this parent is dirty.
			@param $parent$ The element which has to be checked
			@return $boolean$ true/false
			*/
			isElementDirty : function(parent) {
				var focustags = new Array("input" ,"textarea","select");
				for(var f = 0; f < focustags.length; f++){
					var inputtags = new Array();
					inputtags = parent.getElementsByTagName(focustags[f]);
					if(inputtags && inputtags.length > 0){
						var len = inputtags.length;
						for(var i = 0; i < len; i++){
							var elem = inputtags[i];
                          	/*BUG-217267(HFix-23975): Update the RTE control as blur of RTE is fired after submit of grid row.*/
                            if(elem.tagName == "TEXTAREA" && elem.id.indexOf("PEGACKEDITOR") == 0) {
                                if(CKEDITOR && CKEDITOR.instances[elem.id] && CKEDITOR.instances[elem.id].checkDirty()) {
                                    CKEDITOR.instances[elem.id].updateElement();
                                    return true;
                                }
                            }
                            /* BUG-250630: Additionally consider number and decimal type controls */
							if ((elem.style.display != "none") && ("text" == elem.type || "number" == elem.type || "decimal" == elem.type || "TEXTAREA" == elem.tagName)){
								if (elem.value != elem.defaultValue)
									return true;
							}else if ("checkbox" == elem.type || "radio" == elem.type){
								if (elem.checked != elem.defaultChecked)
									return true;
							}else if (("SELECT" == elem.tagName)){
								var cOpts = elem.options;
								var iNumOpts = cOpts.length;
								var hasDefaultSelected = false;
								// check for all the elements if any of them were defaultSelected.
								for (var j = 0; j < iNumOpts; j++){
									var eOpt = cOpts[j];
									if (eOpt.defaultSelected ){
										  hasDefaultSelected = true;
										  if (!eOpt.selected)
											return true;
									}
								}
								/* BUG-616710 - iNumOpts should not be equal to 0 */
								if (!hasDefaultSelected && iNumOpts>0) {
									if(!cOpts[0].selected) {
									   return true;
									}
									//This becomes true in case of fixed select. In case of fixed select only one option will be there always in the select box. So, compare with leftrowbefore or rightrowbefore value.
									if(elem.getAttribute("fixedwidth") && elem.getAttribute("fixedWidth")=="true") {
										if(this.leftrowbefore){
											var selItem = Dom.getElementsById(elem.id, this.leftrowbefore);
											if(selItem && selItem[0] && selItem[0].value!=elem.value) {
												return true;
											}
										}
										if(this.rightrowbefore){
											var selItem = Dom.getElementsById(elem.id, this.rightrowbefore);
											if(selItem && selItem[0] && selItem[0].value!=elem.value) {
												return true;
											}
										}
										return true;
									}

								}
							}
						}
					}
				}
				return false;
			},

			/*
			@private checks if the current active row is dirty.
			@return $boolean$ true/false indicating if the row is dirty
			*/
			checkRowIsDirty : function(){
				var index = this.getActiveRowIndex();
				var rightrow = this.rightBodyTbl.rows[this.getIndex(index)];
				var isRightDirty = this.isElementDirty(rightrow);
				if(isRightDirty == true) {
					return true;
				}else if(this.bTreegrid || this.fixedCol) {
                    var leftrow = pega.util.Dom.getElementsById(rightrow.id, this.leftBodyUL, 'LI')[0];
					return this.isElementDirty(leftrow);
				}
			},


			/*
			@public returns if form is dirty.
			@return $boolean$ true/false indicating if the form is dirty
			*/

			isDirty : function(){
				return this.dirty;

			},
			/*
			@private marks form dirty.
			@return void
			*/

			markAsDirty : function(){
				this.dirty = true;
			},

			callUnregDD : function(){
				if(this.gridRowDDInst) {
					this.gridRowDDInst.unreg();
					this.gridRowDDInst = null;
				}
			},

			submitRow : function(type,target,keyCode,args) {
          //BUG-658653 for inline edit, while scrolling we do NOT want to reload the grid or save the data
          if( this.editConfig === this.EDIT_ROW && target && target.scrollLeft>0) {
            // BUG-673524 reset in call flag to false as we are returning directly in case of scrolling
            this.resetInCall();
            return true;
          }
            
          // END- BUG-658653
				try {
				if(args == true)
					var fromDD = true;
				var srcEl = target;
				if(!this.activeRow){
				   this.resetInCall();
				   return true;
				}
                var container;
				if(Dom.isAncestor(this.leftBodyUL,target))
					container = this.leftBodyUL;
				else if(Dom.isAncestor(this.rightBodyTbl,target))
					container = this.rightBodyTbl;
				else
					container = null;

				if((this.hScrollDiv == srcEl || Dom.isAncestor(this.hScrollDiv,srcEl)) || (this.vScrollDiv == srcEl || Dom.isAncestor(this.vScrollDiv,srcEl))){
					this.resetInCall();
					return;
				}
				if(container && target.tagName !="BUTTON" && target.tagName !="A") {
					if(type!="keypress" && keyCode!="13") { /*If enter key is pressed on an input field, submit the row */
						/*If event is fired on a button or anchor, continue submitting the row*/
						var cell = this.findCell(null, container,target);
						if(cell){
							var rowIndex = this.getRowIndex(cell);
							if(!fromDD && rowIndex == this.activeRow && keyCode != "9") {
								this.resetInCall();
								return;
							}
						}
					}
				}
				try {
					if(this.isTargetComplexProperty(target) /*Don't submit the row if the target is inside a complex property like Date Calendar, AutoComplete or FixedSelect*/
						|| this.isElementLayeredAboveGrid(target) /* US-45575 do not submit if event target is from overlay launched from grid row. */
						){
						this.resetInCall();
						return;
					}
				}catch(e){}
				var rightrow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)];
                var leftrow;
				if(this.bTreegrid || this.fixedCol){
                    leftrow = pega.util.Dom.getElementsById(rightrow.id, this.leftBodyUL, 'LI')[0];
				}
				if((!leftrow && !rightrow) || (rightrow && !pega.util.Dom.hasClass(rightrow, "editMode"))){
					this.resetInCall();
					return;
				}

				var isDirty = (this.submitErrors)?true:this.checkRowIsDirty();
				if(this.bAJAXFromEditableRow){
					if(!isDirty){
						isDirty = true;
					}
					this.bAJAXFromEditableRow = false;
					pega.u.d.detachOnload(this.setbAJAXFromEditableRow);
				}
				if(isDirty || (!this.leftrowbefore && !this.rightrowbefore) || (this.gridcontDiv.getAttribute("editRowIndex")!=null && this.gridcontDiv.getAttribute("editRowIndex")!="")){
					this.markAsDirty();
					var strActionSF=new SafeURL();
					strActionSF.put("PageListProperty",this.getPLPGProperty());
					strActionSF.put("refreshLayout", this.bRefreshOnUpdate?"true":"false");
					if(!this.bPageGroup){
						var plIndex = this.getRightRow().getAttribute("PL_INDEX");
						strActionSF.put("IndexInList",plIndex);
						strActionSF.put("strIndexInList",plIndex);
					} else if((this.gridcontDiv.getAttribute("editRowIndex")!=null && this.gridcontDiv.getAttribute("editRowIndex")!="")) {
						var subscript = Dom.getElementsById(this.gridcontDiv.getAttribute("editRowIndex"), this.rightBodyTbl)[0].getAttribute("PG_SUBSCRIPT");
						strActionSF.put("Subscript",subscript);
					} else {
						var subscript = this.getRightRow().getAttribute("PG_SUBSCRIPT");
						strActionSF.put("Subscript",subscript);
					}
					strActionSF.put("EditRow",'false');
					strActionSF.put("pyPropRef",pega.ui.property.toReference(rightrow.id));
					if(this.bFilteredGrid) {
						strActionSF.put("curRowNum",this.getCurrentRowNum());
					}
					/*Pass paging and filtering related parameters*/
					if(this.bRefreshOnUpdate) {
						strActionSF.put("editRowIndex", this.getLeftRow().id);
						if(this.currentPageIndex && this.currentPageIndex!="") {
							strActionSF.put("currentPageIndex",this.currentPageIndex);
              if(this.returnResultCount){
                   strActionSF.put("pyReturnResultCount", this.returnResultCount);
			    }
							if(this.pageMode){
                                strActionSF.put("pyPageMode", this.pageMode);
			                   }
							strActionSF.put("pyPageSize",this.rangeSize);
							/*for progressive load, load all the pages above the current row. so, set the startindex to 1*/
							if(this.pageMode=="Progressive Load") {
								strActionSF.put("startIndex", "1");
								strActionSF.put("recordsInCurrentPage", (this.currentPageIndex+1)*this.rangeSize);
							}else {
								strActionSF.put("startIndex",((parseInt(this.currentPageIndex,10)-1)*parseInt(this.rangeSize,10)+1));
							}
						}
						if(this.bFilteredGrid){
							strActionSF.put("pyGridFilterCriteriaPage",this.gridFilterPage);
						}
					}
				    //TASK-144049  :StartIndex Parameter Issue Start
				    if(this.bReportDefinition ||  this.pyPaginateActivity){
						var startIndex = (this.currentPageIndex - 1) * this.rangeSize + 1;
						strActionSF.put("startIndex", startIndex);
                    }
				    //TASK-144049  :StartIndex Parameter Issue End

					var gridIndex= pega.u.d.getLayoutIndex(rightrow);
					var partialParams = {
						partialTrigger : "editRow" +this.getConfiguredPLPGProperty()+gridIndex,
						domElement : [ leftrow,rightrow],
						domAction : "replace",
						beforeDomAction :this.loadGridForEdit ,
						beforeDomActionContext:this,
						beforeParams : null,
						afterDomAction :this.submitRowCallback ,
						afterParams : [this,this.activeRow],
						sendSectionData:"true"
					};
					var focusParams = new Array(this.getPLPGProperty(), this.activeRow);
					/*do not submit the row until client side validations are passed in the editable row*/
					if(typeof(pega.ctx.bClientValidation)!="undefined"){
						if(pega.ctx.bClientValidation &&(typeof(validation_validate) == "function")&& ((this.leftBodyUL && !validation_validate(this.leftBodyUL)) || !validation_validate(this.rightBodyTbl))){
						this.selectRow(this.activeRow, true);
						pega.u.d.eventsArray = new Array();
						this.submitErrors = true;
						//this.focusOnNewEditableRow();
						if(typeof(customClientErrorHandler)!= "undefined"){

              var exit = false;

              if(!(pega.u.d.modalDialog.body.contains(target) && !pega.u.d.modalDialog.body.contains(this.gridDiv))) {
                exit = customClientErrorHandler();
              }

							if(exit){
								this.callUnregDD();
								this.resetInCall();
								if(type!="keypress")
									return false;
								else
									return true;
							}
						}else{
                              this.callUnregDD();
                            /* BUG-329422: HFix-37709 - Check if the target is a clickable element and not a part of the grid */
                            /* BUG-339338: Confined the alert to when the target of the click is not inside a modal dialog since IE is not							     able to pass on the click after the alert has been closed */
							if(!(pega.u.d.modalDialog.body.contains(target) && !pega.u.d.modalDialog.body.contains(this.gridDiv)))
                              alert(form_submitCantProceed);
                              this.resetInCall();
							if(type!="keypress")
								return false;
							else
								return true;
							}
						}
					}
					this.gridcontDiv.setAttribute("editRowIndex", "");
					strActionSF.put("gridAction",this.SUBMIT_ACTION);

					if(this.gridPreActivity) {
						strActionSF.put("gridPreActivity", this.gridPreActivity);
					}
					if(this.gridPostActivity) {
						strActionSF.put("gridPostActivity", this.gridPostActivity);
					}

					if(!this.isEnterKeyAppend && this.pageMode === "Progressive Load" && this.bFilteredGrid) { /* BUG-55328 - Setting refreshLayout to true to get rid of the unmatched filtered row only incase of Progressive Load and Filtering */
						strActionSF.put("partialRefresh","false");
						strActionSF.put("editRowIndex", this.getLeftRow().id);
						strActionSF.put("refreshLayout","true");
						strActionSF.put("pyGridFilterCriteriaPage",this.gridFilterPage);
						this.bRefreshOnUpdate = true;
					}
          /* BUG-521635: A flag to control message clearing from primary page */
          strActionSF.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');

					var reloadParams ={
						preActivity:"pzdoGridAction",
						preActivityParams:strActionSF.toQueryString(),
						event:null,
						focusParams:focusParams,
						reloadEle:this.bRefreshOnUpdate?this.gridDiv:rightrow,
						partialParams:this.bRefreshOnUpdate?null:partialParams
					}
					pegaUD.reloadRepeatLayout(reloadParams.preActivity,reloadParams.preActivityParams,reloadParams.event,reloadParams.focusParams,reloadParams.reloadEle ,reloadParams.partialParams,true);

					if(this.bRefreshOnUpdate) {
						this.eventQueueEnd = true;
					}


				}else if(type!="keypress"){ // Handle non dirty cases
					var origHeight = 0;
                    var result;
					if(this.leftrowbefore){
						result=this.getResizedElement(this.leftrowbefore);
						origHeight = parseInt(result[0].style.height);
						if(this.bTreegrid || this.fixedCol) {
							var leftAfter = Dom.getFirstChild(Dom.getFirstChild(leftrow));
							var leftBefore = Dom.getFirstChild(Dom.getFirstChild(this.leftrowbefore));
							//For datagrid without reorder, there will be only one LI insdie gridrow rowContent UL. So, don't do nextSibling in that scenario.
							if(this.bTreegrid || this.bDragDrop) {
								leftAfter = Dom.getNextSibling(leftAfter);
								leftBefore = Dom.getNextSibling(leftBefore);
							}
							if (this.bNumberedSkin) {
								leftAfter = Dom.getNextSibling(leftAfter);
								leftBefore = Dom.getNextSibling(leftBefore);
							}
							//Dom.getFirstChild(leftrow).replaceChild(leftBefore, leftAfter);
							var lRowParentNode = Dom.getFirstChild(leftrow);
							/*In case of tree grid, replace the rowUniqueID with old one for the LI*/
							if(this.bTreegrid) {
								leftrow.setAttribute("rowUniqueID", this.leftrowbefore.getAttribute("rowUniqueID"));
							}
							pega.util.Dom.removeClass(leftrow, "editMode");
							lRowParentNode.insertBefore(leftBefore, leftAfter);
							lRowParentNode.removeChild(leftAfter);
						}

					}
					var tbody=pega.util.Dom.getFirstChild(this.rightBodyTbl);
					if(this.rightrowbefore) {
                                			if (pega.util.Dom.hasClass(rightrow, "notFocused"))
 			                                   pega.util.Dom.addClass(this.rightrowbefore, "notFocused");
						tbody.replaceChild(this.rightrowbefore, rightrow );
					}

					if(this.leftrowbefore && this.bRowResize) {
						//we need to call it again bcos we are done replacing with original content and dom elements are changed
						result=this.getResizedElement(this.leftrowbefore);
						this.doRowResize({height: origHeight}, [result[0], this,result[1]]);
					}

					this.rightrowbefore=this.leftrowbefore=null;

					if(!cell)
						this.selectRow(this.activeRow, true);
					else /* if(this.activeRow == this.totalRecords) // Looks like the totalRecords property is not updated after deleting rows */
						this.setHeadersWidth(); /* BUG-200824: For the last row, select row was not getting called, leaving misalignments */
					pega.u.d.activeStream=null;
					/*nullify rightrowbefore and leftrowbefore after replacing readonly markup*/
					this.rightrowbefore=this.leftrowbefore=null;
					this.resetInCall();
				}else {
					pega.u.d.activeStream = null;
					this.resetInCall();
					return false;
				}
				}catch(e){
					this.resetInCall();
					return false;
				}

			},

			/*
			@protected- Function description goes here.
			@param $undefined$args – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			submitRowCallback : function(args) {
				var grid = args[0];
				var gridActiveRow = args[1];
				grid.rightrowbefore=grid.leftrowbefore=null;
				var err = pega.util.Dom.getElementsById("PegaRULESErrorFlag", grid.rightBodyTbl);
				if(!err || err.length <=0) {
					if(this.bTreegrid || this.fixedCol) {
						var err = pega.util.Dom.getElementsById("PegaRULESErrorFlag", grid.leftBodyUL);
					}
					if(!err || err.length <=0) {
						if(grid.isEnterKeyAppend) {
							pega.u.d.preReloadEle = null;
							grid.action="INSERTAFTER";
							if (grid.bFilteredGrid) {
								grid.refreshLayout = true;
							}
							grid.insert(gridActiveRow);
							grid.isEnterKeyAppend = false;
						}else if(gridActiveRow == grid.activeRow){
							grid.selectRow(gridActiveRow, true);
						}
					}
					grid.submitErrors = false;
					/*For filtered grid, reset the refreshLayout to true.*/
					if(grid.bFilteredGrid) {
						grid.refreshLayout=true;
					}
				}
				if(err && err.length>0){
					if(grid.activeRow != gridActiveRow) {
						grid.selectRow(grid.activeRow, false);
						grid.activeRow = gridActiveRow;
					}
					grid.selectRow(gridActiveRow, true);
					pega.u.d.eventsArray = new Array();
					grid.submitErrors = true;
					grid.callUnregDD();
					grid.focusOnNewEditableRow();
					if(grid.isEnterKeyAppend)
						grid.isEnterKeyAppend = false;
				}
			},

			/*
			@handler
			@private expands/collapses a tree node.
			@param $Object$e - Event
			@param $Objects$args - arguments:contains the grid object
			@return $void$
			*/
			doExpandCollapse : function(type,target,keyCode,args, icon, index) {
				var grid = args;
				if(target)
					var iconExpColl = target;
				//we get the expandcollapse icon if it is called from addChild
				if(!iconExpColl) {
					iconExpColl = icon;
				}
				if(!iconExpColl) {
					grid.resetInCall();
					return;
				}
				var cell = pega.ctx.dom.closest(iconExpColl,"LI");
				if(!cell){
					grid.resetInCall();
					return;
				}
				if(this.threadProcessing) {
					this.resetExecutionThread();
				}
				if(pega.util.Dom.hasClass(iconExpColl, "expandNode") || pega.util.Dom.hasClass(iconExpColl, "collapseNode")) {
					if(pega.util.Dom.hasClass(iconExpColl, "expandNode")) {
						pega.util.Dom.removeClass(iconExpColl, "expandNode");
						pega.util.Dom.addClass(iconExpColl, "collapseNode");
                        iconExpColl.title=pega.u.d.fieldValuesList.get("CollapseNodeTitle");
						var gridNodeUL = Dom.getNextSibling(cell.parentNode);
						if(gridNodeUL && gridNodeUL.id=="gridNode") {
							grid.expandCollapseNode(cell,"");
							grid.updateExpandStatus(cell,'true');
							grid.resetInCall();
						}else {
							if(index) {
								grid.expandNodeUsingAjax(cell,iconExpColl, index);
							}else {
								grid.expandNodeUsingAjax(cell,iconExpColl);
							}
						}
					}else {
						if(Dom.getNextSibling(cell.parentNode)){
							var children= Dom.getChildren(Dom.getNextSibling(cell.parentNode));
							if(children.length==0)
									cell.parentNode.parentNode.removeChild(Dom.getNextSibling(cell.parentNode));

						}
						pega.util.Dom.removeClass(iconExpColl, "collapseNode");
						pega.util.Dom.addClass(iconExpColl, "expandNode");
                        iconExpColl.title = pega.u.d.fieldValuesList.get("ExpandNodeTitle");
						grid.expandCollapseNode(cell,"none");
						grid.updateExpandStatus(cell,'false');
						grid.resetInCall();
					}
          /* BUG-421486: HFix-50196 Call setHeadersWidth on expand/collapse of a treegrid row */
          grid.bTreegrid && grid.fixedRow && grid.setHeadersWidth();          
				}else {
					grid.resetInCall();
					if(index && pega.util.Dom.hasClass(iconExpColl, "noEC")) {
						pega.util.Dom.removeClass(iconExpColl, "noEC");
						iconExpColl.removeAttribute("tabIndex"); /* BUG-141184 */
						pega.util.Dom.addClass(iconExpColl, "collapseNode");
						grid.callAppendChild(index);
					}
				}
			},
			/*
			@private expands/collapses a tree node at the client side.
			@param $Object$cell - cell containing the expand/collapse icon
			@param $String$display - block or "" indicating if the node has to expanded or collapsed
			@return $void$
			*/
			expandCollapseNode : function(cell,display) {
				var row = cell.parentNode.parentNode;
				var nextSib = pega.util.Dom.getNextSibling(cell.parentNode);
				if(nextSib && nextSib.id == "gridNode") {
					nextSib.style.display = display;
				}else {
					return;
				}
				var rightTab = this.rightBodyTbl;
				if(rightTab) {
					var ulChildOne = Dom.getFirstChild(nextSib);
					if(ulChildOne) {
						var ulChildLast = Dom.getLastChild(nextSib);
						while(1) {
							var nextLastChild = Dom.getLastChild((ulChildLast));
							if((nextLastChild) && (nextLastChild.id=="gridNode") && Dom.getChildren(nextLastChild).length >0) {
								ulChildLast = Dom.getLastChild(nextLastChild);
							} else {
								break;
							}
						}
					}

					var childOneId = ulChildOne.id;
					var childLastId = ulChildLast.id;

					var refRow = Dom.getElementsById(childOneId,rightTab)[0];
					var rowIndex = refRow.rowIndex;
					var refTable = refRow.parentNode;
					var refRowLast = Dom.getElementsById(childLastId,rightTab)[0];
					var rowIndexLast = refRowLast.rowIndex;
					var toBeDisplayed = [];
					for(var i=rowIndex; i<=rowIndexLast; i++) {
						var currRow = refTable.rows[i];
						if(display == "") {
							var leftRow = Dom.getElementsById(currRow.id,this.leftBodyUL,'LI')[0];
							/* Store the TR indexes that has to be made visible in toBeDisplayed array to avoid the latency during expand collapse of nodes */
							if(leftRow.offsetHeight > 0){
								toBeDisplayed.push(i);
							}
						}else{
							currRow.style.display = display;
						}
					}
					/* Loop through toBeDisplayed array and display the TR's to avoid the latency during expand collapse of nodes */
					if(display == "") {
						for(var j= 0; j< toBeDisplayed.length; j++) {
							var currRow = refTable.rows[toBeDisplayed[j]];
							currRow.style.display = "";
						}
					}
				}
				this.gridResized();
			},

			/*
			@private makes ajax call to the server to set pyExpanded on the clipboard.
			@param $Object$cell - cell containing the expand/collapse icon
			@param $boolean$bExpand -true or false indicating the expansion status
			@param $undefined$bExpanded– parameter description goes here.
			@return $void$
			*/
			updateExpandStatus : function(cell,bExpanded,row) {
				var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
				if(!row) {
					var row = cell.parentNode.parentNode;
				}
				strUrlSF.put("pyActivity", "pzupdateExpandStatus");
				strUrlSF.put("expanded", bExpanded);
				strUrlSF.put("pyPropRef", pega.ui.property.toReference(row.id));
				var _this = this;
				var callback = {
					success: function(o) {
						_this.resetInCall();
					},

					failure: function(o){
						alert("AJAX call failed");
						_this.resetInCall();
					}
				};

        /*BUG-252834, BUG-385966 - set pzKeepPageMessages while Updating ExpandStatus*/
        if(typeof pega.ctx.KeepPageMessages != "undefined"){
            strUrlSF.put("pzKeepPageMessages",pega.ctx.KeepPageMessages);
          }
				pega.u.d.asyncRequest('POST', strUrlSF, callback);

			},
			updateExpandStatusQueued : function(type,target,keyCode,args) {
				this.updateExpandStatus(args[0],args[1],args[2]);

			},

			/*
			@private makes call to the server to defer load the child items.
			@param $Object$cell - cell containing the expand/collapse icon
			@param $Object$iconExpColl - expand/collapse icon
			@return $void$
			*/
			expandNodeUsingAjax: function(cell, iconExpColl, index) {
				var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
				if(pega.u.d.inCall && index) {
					iconExpColl = this.getExpandCollNode(index);
					pega.util.Dom.removeClass(iconExpColl, "expandNode");
					pega.util.Dom.addClass(iconExpColl, "collapseNode");
					cell = pega.ctx.dom.closest(iconExpColl,"LI");
				}
				/*set thread context only for edit in Haress*/
				if(this.editConfig == "harness" && this.gridDetailsThreadContext){
					strUrlSF.put("pzThreadName",this.gridDetailsThreadContext);
				}
				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
				var section = pega.u.d.getSectionDiv(cell);
				var row = cell.parentNode.parentNode;
				strUrlSF.put("pyActivity", "pzgetChildNodes");
                if (pega.ctx.bClientValidation) {
           			strUrlSF.put("TreeGridClientVal", true);/*HFix-21527 : In case of tree grid on expand child node, using TreeGridClientVal param for validation*/
        		}
				strUrlSF.put("StreamName", section.getAttribute("node_name"));
				/* BUG-386832: Hfix-45903 Pass ReadOnly while calling pzgetChildNodes */
				var gridSection = pega.u.d.getSectionDiv(this.gridDiv);
				var sectionROState = gridSection.getAttribute("readonly");
				strUrlSF.put("ReadOnly",sectionROState);
				strUrlSF.put("BaseReference",pegaUD.getBaseRef(cell));
				strUrlSF.put("pyChildPropRef", this.getPLPGProperty());
				strUrlSF.put("layoutIndex",gridIndex);
				strUrlSF.put("pyPropRef", pega.ui.property.toReference(row.id));
				strUrlSF.put("pyCustomActivity", this.deferLoadAct);
				if(this.bSortable){
				strUrlSF.put("sortType", this.sortType);
				strUrlSF.put("sortProperty", this.sortProperty);
				}
				/*In case of filtered grid we should pass the grid's filtercriteria page in  the request */
				if(this.bFilteredGrid) {
					strUrlSF.put("pyGridFilterCriteriaPage", this.gridFilterPage);
				}
				var _this = this;
				var callbackArgs=null;

				if(this.editConfig != this.EDIT_MODAL && this.refreshLayout && !this.bFilteredGrid){
					strUrlSF.put("refreshLayout", this.refreshLayout);
					strUrlSF.put("StreamClass", "Rule-HTML-Section");
					var refreshCallbackArgs=pegaUD.getRefreshCallbackArgs(this.gridDiv);
					strUrlSF.put("RenderSingle",refreshCallbackArgs.paramName);
					callbackArgs = new Array(refreshCallbackArgs.expandInnerDiv, refreshCallbackArgs.expandElement, refreshCallbackArgs.paramName,refreshCallbackArgs.innerDivExists,null, "reloadRepeat");

					pegaUD.setBusyIndicator();
					var resultObj= this.append(pega.ui.property.toReference(row.id),"",false,true);
          /* BUG-521635: A flag to control message clearing from primary page */
          resultObj.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');
					strUrlSF.put("PreActivity" ,"pzdoGridAction");
					strUrlSF.put("ActivityParams" ,resultObj.toQueryString());
				}
				/*BUG-92181: Avoid simultaneous ajax when reload is happening*/
				if(!pegaUD.isSafeToReload(row)){
					return;
				}
				var callback = {

					success: function(o){
						var returnedContent = o.responseText;
						if(o.argument){
							pegaUD.handleLoadSuccess(o);
							return;
						}
						var markups = returnedContent.split("||PEGA||GRID||");
						var partialParams = new Object();
						partialParams.domAction = "append";
						partialParams.domElement = row;
						/* var tempDiv = document.createElement("Div");
						tempDiv.innerHTML = markups[0];
						var newUL = Dom.getFirstChild(tempDiv); */
						var newRowsLength = 0;
						var startRowIndex = 0;
						var rightTab = null;
						rightTab = _this.rightBodyTbl;
						var ldoCallBack = function(newDiv) {
							pega.u.d.loadHTMLEleCallback(newDiv);
							var Dom = pega.util.Dom;

							var avoidRightTableProcessing = (_this.bTree || _this.bTreegridSingleCol)? true : false;

							/*  commenting as the same logic is implemented at server.
								_this.arrangeIcons(row);
							*/
							if(rightTab) {
								var newDiv = document.createElement("div");
								document.body.appendChild(newDiv);

								var rightTabLdoCallBack = function(newDiv) {
									if(!avoidRightTableProcessing){
										pega.u.d.loadHTMLEleCallback(newDiv);
									}else{
										pega.u.d.gIsScriptsLoading = false;
										if (pega.c && pega.c.actionSequencer && !pega.u.d.isAjaxInProgress()) {
											pega.c.actionSequencer.resume();
										}
									}
									var Dom = pega.util.Dom;
									var newRows = Dom.getFirstChild(newDiv).rows;
									newRowsLength = newRows.length;
									var childOneId = row.id;
									var refRow = Dom.getElementsById(childOneId,rightTab)[0];
									startRowIndex = refRow.rowIndex;
									var newRowsLen = newRows.length;
									/* BUG-108209: setting display none to right table before performing appendChild/insertBefore for performance */
									var refRowParent = refRow.parentNode;
									/* currentStyle for ie , getComputedStyle for non-ie */
									var tempDisplay = refRowParent.currentStyle ? refRowParent.currentStyle.display : window.getComputedStyle ? window.getComputedStyle(refRowParent, "").display : refRowParent.style.display;
									refRowParent.style.display = "none";

                  var rightRows = [];
									for(var i=newRows.length-1; i>=0; i--) {
										var refRowSib = Dom.getNextSibling(refRow);
										if(refRowSib) {
											rightRows.push(refRowParent.insertBefore(newRows[i], refRowSib));
										} else {
											rightRows.push(refRowParent.appendChild(newRows[i]));
										}

									}
									refRowParent.style.display = tempDisplay;

                  if (!pega.u.d.DISABLE_TREEGRID_HEIGHT_ADJUSTMENT) {
                    var leftRows = [];

                    for (var i = 0; i < rightRows.length; i++) {
                      /* BUG-571690:while expanding leftrow div should be ul.rowcontent  instead of li in sync with updatetreegridrowheight function*/
                      leftRows.push(_this.leftBodyUL.querySelector('[id="' + rightRows[i].id + '"]>ul.rowContent'));
                    }

                    _this.syncLeftRightTable(leftRows, rightRows);
                  }

									if (_this.activeRow > refRow.rowIndex) {
										_this.activeRow = _this.activeRow + newRowsLen;
									}
									document.body.removeChild(newDiv);
									newDiv = null;
									pega.util.Dom.addClass(iconExpColl,"collapseNode");
									pega.util.Dom.removeClass(iconExpColl,"ExpandInProgress");
									_this.gridResized();

									_this.resetInCall();
									if(index) {
										_this.callAppendChild(index);
									}

                  /* HFix-41119: START - registering declare expression inputs */
                  if(rightTab && typeof(validation_init) === "function") {
                    validation_init(rightTab);
                  }
                  /* HFix-41119: END */
								};

								//If the response contains a PegaOnlyOnce div, split the markup and append valid markup to the DOM. This fixes expand issues in Safari.
								var splitMarkup = markups[1].split("<DIV id=\"PegaOnlyOnce\" style=\"display:none\">");
								if(splitMarkup[1]) {
									//pega.u.d.loadDOMObject(newDiv,"<table>" + splitMarkup[0] + "</table>" + "<DIV id=\"PegaOnlyOnce\" style=\"display:none\">" + splitMarkup[1] , rightTabLdoCallBack);
									pega.u.d.loadDOMObject(newDiv, splitMarkup[0] + "<DIV id=\"PegaOnlyOnce\" style=\"display:none\">" + splitMarkup[1] , rightTabLdoCallBack);
								} else {
									//pega.u.d.loadDOMObject(newDiv,"<table>" + markups[1] + "</table>" , rightTabLdoCallBack);
									pega.u.d.loadDOMObject(newDiv, markups[1] , rightTabLdoCallBack);
								}
							}
							else {
								pega.util.Dom.addClass(iconExpColl,"collapseNode");
								pega.util.Dom.removeClass(iconExpColl,"ExpandInProgress");
								_this.gridResized();
							}
							//newUL = null;
							newDiv = null;
							if(!rightTab) {
								_this.resetInCall();
								if(index) {
									_this.callAppendChild(index);
								}
							}
							_this.setHeadersWidth();
						};
						if(markups[0].indexOf("<UL") != -1 || markups[0].indexOf("<ul") != -1) {
							pega.u.d.loadDOMObject(row.parentNode, markups[0], ldoCallBack, partialParams);
						}else {
								//var rowECHandle = Dom.getFirstChild(Dom.getFirstChild(Dom.getFirstChild(Dom.getFirstChild(row))));
								pega.util.Dom.removeClass(iconExpColl,"ExpandInProgress");
								if(index) {
									Dom.addClass(iconExpColl, "collapseNode");
								}else{
									Dom.addClass(iconExpColl, "noEC");
									/* BUG-141184: Add tabIndex=-1 to not focus .noEC anchor */
									iconExpColl.setAttribute("tabIndex", "-1");
								}
								_this.resetInCall();
								if(index) {
								/* BUG-160200: When ADDCHILD is configured in enter keypress, the grid.action
								 * ("ADDCHILD" in this case) was being nullified in afterLoadRow success callback
								 * of the implicit row submission originating from the same event. Hence,
								 * reinstating the grid.action property to "ADDCHILD" here. This block will get
								 * executed only when index is present and index will be present only when this
								 * function is called from the pega.ui.grid#addChild(index) method
								 */
								if(_this.bTree && _this.editConfig == _this.EDIT_ROW && !_this.action) {
									_this.action = "ADDCHILD";
								}
									_this.callAppendChild(index);
								}
							_this.setHeadersWidth();
						}
						//tempDiv = null;
						/*BUG-58230 - In IE, Tree Grid - all widths - nofreeze, update all new rows' hiddenCell TD width to 0%*/
						if(Event.isIE && _this.bTreegrid && !_this.fixedRow && !_this.fixedCol){
							var gridBodyTbl = _this.rightBodyTbl;
							var endNode = startRowIndex + newRowsLength;
							if(gridBodyTbl.rows && gridBodyTbl.rows.length >0 && gridBodyTbl.rows[0].cells && gridBodyTbl.rows[0].cells.length > 0 && Dom.hasClass(gridBodyTbl.rows[0].cells[0],"hiddenCell")){
								for(var i = startRowIndex+1; i < endNode+1; i++){
									gridBodyTbl.rows[i].cells[0].style.width = "0%";
								}
							}
						}
						/*BUG-58230*/
					},
					failure: function(o){
						alert("AJAX call failed");
						_this.resetInCall();
					},

					argument:callbackArgs
				};
				pega.util.Dom.removeClass(iconExpColl,"collapseNode");
				pega.util.Dom.addClass(iconExpColl,"ExpandInProgress");

        /*BUG-252834 ,BUG-385966 - set pzKeepPageMessages while Expanding TreeGrid*/
        if(typeof pega.ctx.KeepPageMessages != "undefined"){
            strUrlSF.put("pzKeepPageMessages",pega.ctx.KeepPageMessages);
          }
				pega.u.d.asyncRequest('POST', strUrlSF,callback);
			},

			indexOf : function(array, elt ) {

				if(!Array.prototype.indexOf){
					var len = array.length >>> 0;
					var from = 0;

					for (; from < len; from++)
					{
					  if (from in array &&  array[from] === elt)
						return from;
					}
					return -1;
				} else {
					return array.indexOf(elt);
				}
			 },

			/*
			@protected- Function description goes here.
			@return $undefined$ - return description goes here.
			*/
			unregRelatedDDTargets : function() {
				var obj = pega.util.DragDropMgr.ids[this.gridDiv.id];
				var targets = [];
				if (obj) {
					for (var dt in obj) {
						if (! pega.util.DragDropMgr.isTypeOfDD(obj[dt])) {
							continue;
						}
						targets[targets.length] = obj[dt];
					}
				}
				var len = targets.length;
				for (var i = 0; i < len; i++){
					targets[i].unreg();
				}

			},

			/*
			@protected- Function description goes here.
			@return $undefined$ - return description goes here.
			*/
			initDDTarget : function(e) {
				/*If target is no results message, don't do anything.*/
				if(this.isTargetNoResultsMsg(Event.getTarget(e))) {
					return;
				}
				if (this.bTreegrid || this.fixedCol) {
					var dtParent = Dom.getAncestorBy(Event.getTarget(e), function(ele){
						var parentNode = ele.parentNode;
						if (parentNode && parentNode.id && parentNode.id.indexOf("gridNode") === 0)
							return true;
						return false;
					});
					if(!dtParent) {
						return;
					}
					var dt = dtParent.getElementsByTagName("ul")[0];

					if (typeof dt != "undefined") { // Added as check in case of yuimodalrow_new dummy els.
						dt.id = "ul" + dtParent.id;
						if (dt.id != "ul") {
							if (!pega.util.DragDropMgr.isDragDrop(dt.id)) {
								new pega.util.DDTarget(dt, this.gridDiv.id);
							}
						}
					}
				} else {
					var _this = this;
					var dd = Dom.getAncestorBy(Event.getTarget(e), function(ele){
						if(ele.tagName !== "TR") return false;
						var parentNode = ele.parentNode;
						if(parentNode && parentNode.parentNode == _this.rightBodyTbl) return true;
						return false;
					});
					if(dd && dd.id) { // Filter out the first row (header)
						if (!pega.util.DragDropMgr.isDragDrop(dd.id)) {
							new pega.ui.gridRowDD(dd,this);
						}
					}
				}
			},

			/*
			@protected- Function description goes here.
			@param $undefined$e – parameter description goes here.
			@return $undefined$ - return description goes here.
			*/
			attachDrag : function(e) {
				var src = Event.getTarget(e);
				if(this.bTreegrid && src && src.tagName){
					var aTag=src.tagName.toLowerCase();
					if(aTag=="select" || aTag=="input" || aTag=="textarea" || aTag=="button"){
						return;
					}
				}
				if(this.submitErrors)
					return;
				/*If target is no results message, don't do anything.*/
				if(this.isTargetNoResultsMsg(src)) {
					return;
				}
				if (this.bTreegrid || this.fixedCol) {
					if (this.bTreegrid == false) {
						while (!src.getElementById && src.id != "gridNode") {
							if (src.id == "dragHandle")
								break;
							else
								src = src.parentNode;
						}
						if (typeof src.getElementById == "object") {
							return;
						}
					}
					else {
						while (!src.getElementById && src.id.indexOf("gridNode") < 0 && src.id != "iconExpandCollapse") {
							if (src.getAttribute("PL_INDEX"))
								break;
							else
								src = src.parentNode;
						}
						if (typeof src.getElementById == "object" || src.id == "iconExpandCollapse" || src.id.indexOf("gridNode") >= 0) {
							return;
						}

					}
				} else {
					var _this = this;
					var dd = Dom.getAncestorBy(Event.getTarget(e), function(ele){
						if(ele.tagName !== "TR") return false;
						var parentNode = ele.parentNode;
						if(parentNode && parentNode.parentNode == _this.rightBodyTbl) return true;
						return false;
					});

					if(!(dd && dd.id)) { // Filter out the first row (header)
						return;
					}
					src = dd;
				}
				if(!this.scrollObjInfo) {
					this.scrollObjInfo=this.getScrollObj(this.gridDiv);
				}
				if (!pega.util.DragDropMgr.isDragDrop(src.id)) {
					this.gridRowDDInst = new pega.ui.gridRowDD(src,this);
					this.gridRowDDInst.handleMouseDown(e,this.gridRowDDInst);
				} else {
					this.gridRowDDInst = pega.util.DDM.getDDById(src.id);
				}
				this.gridRowDDInst.DDM.clickTimeThresh = 100000;

				if(typeof(attachEvent) == "undefined"){ //Fork for non ie.
					pega.d.MouseEvent._doOnMouseClick(e);//Fire desktop events to hide context menus et all.
				}
				try {
					Event.getTarget(e).focus();
				} catch(ex){}
			},

			/*
			@public- Function used to reload the sequoia row
			*/
			reloadSequoiaRow : function(){
				var rightrow = this.rightBodyTbl.rows[this.getIndex(this.activeRow)];
                var leftrow;
				if(this.bTreegrid || this.fixedCol){
					leftrow = pega.util.Dom.getElementsById(rightrow.id, this.leftBodyUL, 'LI')[0];
				}

				var strActionSF=new SafeURL();
				strActionSF.put("PageListProperty",this.getPLPGProperty());
				if(!pega.u.d.bPageGroup){
					strActionSF.put("IndexInList",this.activeRow);
					strActionSF.put("strIndexInList",this.activeRow);
				}else{
					var subscript = pega.u.d.activeStream[1].getAttribute("PG_SUBSCRIPT") ;
					strActionSF.put("Subscript",subscript);
				}
				strActionSF.put("EditRow",'false');
				if(pega.u.d.bTreegrid)
					strActionSF.put("pyPropRef",pega.ui.property.toReference(rightrow.id));// ??
				strActionSF.put("strIndexInList",this.activeRow);
				strActionSF.put("gridAction",this.SUBMIT_ACTION);

				if(this.gridPreActivity) {
					strActionSF.put("gridPreActivity", this.gridPreActivity);
				}
				if(this.gridPostActivity) {
					strActionSF.put("gridPostActivity", this.gridPostActivity);
				}

				var gridIndex=pega.u.d.getLayoutIndex(this.gridDiv);
				var partialParams = {
					partialTrigger : "editRow" +this.getConfiguredPLPGProperty()+gridIndex,
					domElement : [leftrow,rightrow],
					domAction : "replace",
					beforeDomAction :this.loadGridForEdit ,
					beforeDomActionContext:this,
					beforeParams : null,
					afterDomAction : null ,
					afterParams : null,
					sendSectionData:"true"
				};


				var focusParams = new Array(this.getPLPGProperty(), this.activeRow);

				var reloadParams ={
							preActivity:"pzdoGridAction",
							preActivityParams:strActionSF.toQueryString(),
							event:null,
							focusParams:focusParams,
							reloadEle:rightrow,
							partialParams:partialParams
				}
				pega.u.d.reloadRepeatLayout(reloadParams.preActivity,reloadParams.preActivityParams,reloadParams.event,reloadParams.focusParams,reloadParams.reloadEle ,reloadParams.partialParams,true);

			},

			 setOtherRadioToFalse : function(Obj, event){
			      var currentName = Obj.name;
		               if(typeof(Obj.id)=="undefined" || Obj.id=="")
                  		              Obj.id = currentName.replace(/[\d]/g, "");
		                var radioButtonsList = pega.util.Dom.getElementsById(Obj.id, this.gridDiv);
		                var len = radioButtonsList.length;
		                for(var i=0; i<len ; i++){
                  		              if(radioButtonsList[i]){
                                                if(radioButtonsList[i].name != currentName){
                                                                radioButtonsList[i].checked = false;
                                                }
                                	     }
		                }
			 },

			 validateGridPGSubscript: function(val){
				if(pega.u.d.validateSubScript(val)!==true)
					alert("Invalid Subscript");
			},

			checkAllIfInHeader : function(Obj, event){
				/*Check if this is in header*/
				var val = Obj.checked;
				var id = Obj.id;
				var temp = "";
				var autoGenCheckBox = false;
				if(Obj.getAttribute("data-click") || Obj.getAttribute("data-ctl")){
					autoGenCheckBox = true;
				}
                /*BUG-209485: Adding a check for LI for grids with freeze column*/
				while(!(pega.util.Dom.hasClass(Obj ,"cellCont") || pega.util.Dom.hasClass(Obj ,"gridCell"))){/* BUG-319989: Look for grid cell. Cannot depend on TH or TD or LI. */
					temp = Obj.parentNode.tagName;
					// BUG-248586: Reached document? Not a Grid checkAll checkbox, quit
					if(!temp)
						return;

					Obj = Obj.parentNode;
				}
				if(this.getRowIndex(Obj) == 0 && Dom.isAncestor(this.gridcontDiv, Obj)){/* if header*/
					var cellIndexOfHeader = this.getCellIndex(Obj);
					if(autoGenCheckBox){
						var tableLength = this.getTableLength(this.rightBodyTbl);
						var colFreeze = false;
						var leftBodyLIs = null;
						if (cellIndexOfHeader == 0 && this.bPXFixed && this.fixedCol &&
						    typeof this.leftBodyUL != "undefined" && this.leftBodyUL != null) {
						    /* ColumnPane Freeze will create a seperate UL structure for first column */
							colFreeze = true;
							leftBodyLIs = Dom.getChildren(this.leftBodyUL);
							tableLength = leftBodyLIs.length - 1;
						}
            /*BUG-564977: iterator should skip header row*/
						for(var i=1; i<=tableLength; i++){
							if(this.rightBodyTbl.rows[i] && !this.rightBodyTbl.rows[i].getAttribute("expanded")){
							   if(this.rightBodyTbl.rows[i].cells.length > cellIndexOfHeader) {
								var cellObj = null;
								if (colFreeze && leftBodyLIs[i].getAttribute("PL_INDEX")) {
									cellObj = leftBodyLIs[i];
								} else {
									cellObj = this.rightBodyTbl.rows[i].cells[cellIndexOfHeader];
								}
								if (cellObj == null) continue;
								var cellElems = cellObj.getElementsByTagName("input");
								var cellElemsLen = cellElems.length;
								for(var j =0; j<cellElemsLen;j++){
									if((cellElems[j].type).toUpperCase() == "CHECKBOX"){
										 // If checkbox is disabled, skip
                                        if (cellElems[j].disabled)
											continue;
										if(val){
											cellElems[j].checked = true;
										}else{
											cellElems[j].checked = false;
										}
									}
								}
							    }
							}
						}
					}else{
						var checkBoxesList = pega.util.Dom.getElementsById("gridCheckBox",Grids.getActiveGrid(event).gridDiv);
						for(var i=0; i <checkBoxesList.length; i++){
							temp="";
							Obj=checkBoxesList[i];
							while((temp != "TH")&&(temp != "TD")){
								temp = Obj.parentNode.tagName;
								Obj = Obj.parentNode;
							}
							if(cellIndexOfHeader == this.getCellIndex(Obj)){
								if(val && !checkBoxesList[i].disabled){
									checkBoxesList[i].checked=true;
								}
								else {
									checkBoxesList[i].checked=false;
								}
							}
						}
					}
				} else { /* if body */
					var cellIndexToChange = this.getCellIndex(Obj);
					var isAllChecked = false;
					if(val){
						isAllChecked = true;
						// if true, see if all other checkboxes
						if(autoGenCheckBox){
							var tableLength = this.getTableLength(this.rightBodyTbl);
							for(var i=1; i<=tableLength; i++){
								if(this.rightBodyTbl.rows[i] && !this.rightBodyTbl.rows[i].getAttribute("expanded")){
									var cellObj = this.rightBodyTbl.rows[i].cells[cellIndexToChange];
									if(cellObj){ /*BUG-152014: null check for cellObj.*/
									var cellElems = cellObj.getElementsByTagName("input");
									var cellElemsLen = cellElems.length;
									for(var j =0; j<cellElemsLen;j++){
										if((cellElems[j].type).toUpperCase() == "CHECKBOX"){
											isAllChecked = isAllChecked & cellElems[j].checked;
										}
										if(!isAllChecked) {
											break;
										}
									}
								}
								}
								if(!isAllChecked) {
									break;
								}
							}
						}else{
							var checkBoxesList = pega.util.Dom.getElementsById("gridCheckBox",Grids.getActiveGrid(event).gridDiv);
							for(var i=1; i <checkBoxesList.length; i++){
								temp="";
								Obj=checkBoxesList[i];
								while((temp != "TH")&&(temp != "TD")){
									temp = Obj.parentNode.tagName;
									Obj = Obj.parentNode;
								}
								if(cellIndexToChange == this.getCellIndex(Obj)){
									isAllChecked = isAllChecked & checkBoxesList[i].checked;
								}
								if(!isAllChecked) {
									break;
								}
							}
						}
					}
					// change the header cell depending on the row checkboxes
					var cellObj = null;
					/*BUG-152014: cellObj construction and null check.*/
					if(this.rightHeaderTbl != null){
						cellObj = this.rightHeaderTbl.rows[0].cells[cellIndexToChange];
					}else{
						cellObj = this.rightBodyTbl.rows[0].cells[cellIndexToChange];
					}
					if(cellObj){
					var cellElems = cellObj.getElementsByTagName("input");
					cellElemsLen = cellElems.length;
					for(var j =0; j<cellElemsLen;j++){
						if((cellElems[j].type).toUpperCase() == "CHECKBOX"){
							cellElems[j].checked = isAllChecked;
							}
						}
					}
				}
			},

			deselect : function(){
				if(this.editConfig == "harness"){
					this.gridDetailsDiv.innerHTML = "";
				}
				if(this.activeRow){
					this.selectRow(this.activeRow,false);
				}
				this.activeRow = null;
			},
			/*API to get the actual row index in the table taking the active row index as the input. Used in expand pane where extra TRs are generated for the details portion.*/
			getIndex : function(index, lastStartIndex){
				if((this.bCategorizedGrid || this.editConfig == this.EDIT_EXPANDPANE) && !this.bPageGroup){
					var rows = this.rightBodyTbl.rows;
					var expPaneCnt = 0;
					var iterator = 0;
					var plIndexCnt = 1;
					var categorizeHeaderCnt = 0;
					/*This lastStartIndex is passed in case of progressive Load callback for an expand pane grid. As PL callback is called for as many no.of times the rows are brought up, we send the previously obtained row index to minimize the no. of iterations.*/
					if(lastStartIndex && lastStartIndex!="") {
						plIndexCnt = rows[lastStartIndex].getAttribute("PL_INDEX");
						iterator = lastStartIndex;
					}
					while(plIndexCnt <= index){
						var row = rows[iterator];
						if(!row) {
							break;
						}
						(row.getAttribute("expanded") == "true")?expPaneCnt++:null;
						if(!row.id && pega.util.Dom.hasClass(row, "grid-categorize-header")) {
							categorizeHeaderCnt++;
						}
						if(row.getAttribute("PL_INDEX") && row.getAttribute("PL_INDEX")!="") {
							plIndexCnt++;
						}
						iterator++;
					}
					return (parseInt(index,10)+expPaneCnt+categorizeHeaderCnt);
				}else if(this.editConfig == this.EDIT_EXPANDPANE && this.bPageGroup){
					var rows = this.rightBodyTbl.rows;
					var expPaneCnt = 0;
					var iterator = 0;
					var plIndexCnt = 1;
					while(plIndexCnt <= index){
					var row = rows[iterator];
						if(!row) {
							break;
						}
						(row.getAttribute("expanded") == "true")?expPaneCnt++:null;
						if(row.getAttribute("PG_SUBSCRIPT") && row.getAttribute("PG_SUBSCRIPT")!="") {
							plIndexCnt++;
						}
						iterator++;
					}
					return (parseInt(index,10)+expPaneCnt);
				}else {
					return index;
				}
			},

			/*API to get the active row index which is similar to activerow. Used for Page Group grid with expand pane edit mode*/
			getPGRowIndex : function(index){
				var rowIndex = index;
				if(this.editConfig == this.EDIT_EXPANDPANE && this.bPageGroup) {
					var rows = this.rightBodyTbl.rows;
					var iterator = 0;
					rowIndex = 0;
					while(iterator<=index) {
						if(rows[iterator].getAttribute("PG_SUBSCRIPT") && rows[iterator].getAttribute("PG_SUBSCRIPT")!="") {
							rowIndex++;
						}
						iterator++;
					}
				}
				return rowIndex;
			},

			/*API to get the active row index which is similar to activerow. Used for filtered grid with expand pane edit mode*/
			getFilteredRowIndex : function(index){
				var rowIndex = index;
				if((this.bCategorizedGrid || this.editConfig == this.EDIT_EXPANDPANE) && this.bFilteredGrid) {
					var rows = this.rightBodyTbl.rows;
					var iterator = 0;
					rowIndex = 0;
					while(iterator<=index) {
						if(rows[iterator].getAttribute("PL_INDEX") && rows[iterator].getAttribute("PL_INDEX")!="") {
							rowIndex++;
						}
						iterator++;
					}
				}
				return rowIndex;
			},

			getLastRowToRetrieve : function() {
				var lastRowToRetrieve;
				if(!this.bPageGroup) {
					var rowNum = -1;
					if(!this.bTreegrid) {
						if (this.editConfig == this.EDIT_EXPANDPANE) {
							rowNum = this.getExpandPaneTableLength();
						} else {
							rowNum = this.getTableLength(this.rightBodyTbl);
						}
					} else {
						rowNum = this.getTopLevelNodesLength(this.rightBodyTbl);
					}
					if(rowNum > -1) {
						if(this.currentPageIndex && this.rangeSize) {
							if(rowNum < 3) {
								if(!Dom.getElementsById("Grid_NoResults",this.gridDiv)) {
									lastRowToRetrieve = ((this.currentPageIndex * this.rangeSize) - this.rangeSize) + (rowNum + 1);
								}
							} else {
								lastRowToRetrieve = ((this.currentPageIndex * this.rangeSize) - this.rangeSize) + (rowNum + 1);
							}
						} else { //BUG-98630
							if(rowNum < 3) {
								if(!Dom.getElementsById("Grid_NoResults",this.gridDiv)) {
									lastRowToRetrieve = rowNum + 1;
								}
							} else {
								lastRowToRetrieve = rowNum + 1;
							}
						}
					}
				}
				return lastRowToRetrieve;
			},

			openDDReport : function(rowIndex,cellIndex){
				var leftRow = this.getLeftRow(rowIndex);
				var oSafeURL = SafeURL_createFromURL(pega.tools.SUtils.trim(pega.ctx.url));
				oSafeURL.put("pyActivity","pzShowDrillDownReport");
				oSafeURL.put("Page",pega.ui.property.toReference(leftRow.id));
				if(cellIndex){
					oSafeURL.put("columnIndex",cellIndex);
				}
				oSafeURL.put("ReportName",this.RDName);
				oSafeURL.put("ReportClassName",this.RDAppliesToClass);
				openUrlInWindow(oSafeURL.toURL(),"DrillDownReport");
			},

			releaseLock : function (ref,templateName){
				var SafeURL = SafeURL_createFromURL(pega.ctx.url);
				SafeURL.put("pyActivity","pzBreakLock");
				var newRequest = pega.u.d.asyncRequest("GET",SafeURL,{ success : function(o){
					pegaUD.url = pegaUD.url.replace(this.modalThreadContext,this.baseThreadContext);
					var handle = pega.ui.property.toHandle(ref)
					if(this.bTreeGrid) {
						var refObject = Dom.getElementsById(handle,this.leftBodyUL)[0];
					}else {
						var refObject = Dom.getElementsById(handle,this.rightBodyTbl)[0];
					}

					var firstChild = Dom.getFirstChild(refObject);
					//if(templateName=="pyGridModalTemplate"){
					if(this.editConfig == this.EDIT_MODAL || this.isOpenLocalAction){
						pega.util.Event.fireEvent(Dom.getFirstChild(firstChild),Grids.EVENT_DOUBLE_CLICK);}
					else{
						/*var firstChild = pega.util.Dom.getFirstChild(refObject);
						var fireEventObject = pega.util.Dom.getFirstChild(firstChild);
						if(!fireEventObject){
							fireEventObject = pega.util.Dom.getFirstChild(pega.util.Dom.getElementsById(handle,this.rightBodyTbl)[0]);


						}
						pega.util.Event.fireEvent(fireEventObject,"click");*/
							this.jumpToIndex(null,this.getActiveRowIndex(), templateName);
						}
					}, failure : function (o) {

					},scope:this
				});
			},
			fixVisibleGrid : function(ev) { // BUG-83172: This method is called when tab changes to active state
				this.initScrollbars();
				//this.setHeadersWidth(); /* This is called from setHeightForNoResults(), so commenting call at this line. */
				/* BUG-110812: START : Call below two apis to fix alignment */
				this.setHeightForNoResults();
				this.performWriteOperations();
				/* BUG-110812: END */
				this.triggerBrowserReflow();/*BUG-126981*/
        this.autoAdjustProgressiveGridHeight();
			},

      onPostMDCRenderFixGrid : function(ev){
        	this.fixVisibleGrid(ev);
      },
			onExpandFixGrid : function(ev) {
				this.fixVisibleGrid(ev);
        Event.removeListener(ev.currentTarget,"click",this.onExpandFixGrid);
			},

			/* This API is called when response has ENGINE_ERRORS. In this method expande Icon is reset "expandRowDetails" and "rowExpanded" attribute is removed. */
			changeExpandCollapseIconState : function() {
				if(this.bShowExpandCollapseColumn && this.expandCollapseAnchor && typeof this.expandCollapseAnchor == 'object') {
					var className = this.expandCollapseAnchor.className;
					if(className.indexOf("collapseRowDetails") != -1) {
						Dom.addClass(this.expandCollapseAnchor, "expandRowDetails");
						Dom.removeClass(this.expandCollapseAnchor, "collapseRowDetails");
						var rightRow = this.getRightRow();
						rightRow.removeAttribute("rowExpanded");
					}
				}
			},
      /* Get the count of data rows in grid */
			getDataRowSize: function() {
				var rows = this.rightBodyTbl.rows;
				var dataRowCount = rows.length - 1;
				if(this.editConfig == this.EDIT_EXPANDPANE) {/* HFix-23549: In case of expand pane don't consider expanded rows. */
					for(var i = 0; i < rows.length; i++) {
						var row = rows[i];
						if(row && row.getAttribute("expanded") == "true") {
							dataRowCount--;
						}
					}
				}
				return dataRowCount;
			},

      /* BUG-416810: Tree grid misalignment fix */
      updateTreeGridRowHeight: function() {
         this.syncLeftRightTable(jQuery(this.leftBodyUL).find('ul.rowContent'), jQuery(this.rightBodyTbl).find('tr.cellCont'), 1);
      },

      syncLeftRightTable: function(leftNodes, rightNodes, startIndex) {
        startIndex = startIndex ? startIndex : 0;
        var heights = [];

        var updateLeftRowHeight = function(leftBodyRow, rightBodyTblRowHeight) {
          jQuery(leftBodyRow).height((rightBodyTblRowHeight - 1) + 'px');
          jQuery(leftBodyRow).find('.oflowDiv').height(rightBodyTblRowHeight + 'px');
          jQuery(leftBodyRow).find('li').height(rightBodyTblRowHeight + 'px');
          jQuery(leftBodyRow).find('ul').height(rightBodyTblRowHeight + 'px');
        };

        var updateRightRowHeight = function(rightBodyRow, leftBodyUlRowHeight) {
          jQuery(rightBodyRow).height(leftBodyUlRowHeight + 'px');
        };

        for (var i = startIndex; i < rightNodes.length; i++) {
          var rightBodyRow = rightNodes[i];
          var leftBodyRow = leftNodes[i];

          if (rightBodyRow && rightBodyRow.offsetWidth && leftBodyRow && (rightBodyRow.id == leftBodyRow.parentElement.id)) {
            var rightBodyTblRowHeight = rightBodyRow.offsetHeight;
            var leftBodyUlRowHeight = leftBodyRow.offsetHeight;

            if (rightBodyTblRowHeight > leftBodyUlRowHeight) {
              heights.push({
                'method': updateLeftRowHeight,
                'node': leftBodyRow,
                'height': rightBodyTblRowHeight
              });
            } else if (rightBodyTblRowHeight < leftBodyUlRowHeight) {
              heights.push({
                'method': updateRightRowHeight,
                'node': rightBodyRow,
                'height': leftBodyUlRowHeight
              });
            }
          }
        }

        for (var i = 0; i < heights.length; i++) {
          heights[i]['method'].call(this, heights[i]['node'], heights[i]['height']);
        }
      },
      
      /* BUG-820905 fix header a11y issue in report viewer(dynamic grid) */
      dynamicGridHeaderA11y : function() {
        var headers = this.gridcontDiv.querySelectorAll('th');
        headers.forEach(function(header) {
          var headerMenu = header.querySelector('a#pui_colmenu');
          if(headerMenu) {
            // set aria-label to th
            var headerCell = header.querySelector('.cellIn');
            var headerText = '';
            if(headerCell) {
              headerText = headerCell.textContent + ' ';
            }
            header.setAttribute('aria-label', headerText.trim());

            // set aria-sort on th
            var sortSpan = header.querySelector('span#sort');
            if(sortSpan) {
              if(sortSpan.classList.contains('sort-ASC')) {
                header.setAttribute('aria-sort', 'ascending');
              }
              else if(sortSpan.classList.contains('sort-DESC')) {
                header.setAttribute('aria-sort', 'descending');
              }
              else {
                header.removeAttribute('aria-sort');
              }
              // remove tabindex and title from span#sort
              sortSpan.removeAttribute('tabindex');
              sortSpan.removeAttribute('title');
              sortSpan.setAttribute('aria-hidden', 'true');
            }

            // set role and title on div having class divCont
            var divContElement = header.querySelector('.divCont');
            if(divContElement) {
              divContElement.setAttribute('role', 'button');
              var attrValue = divContElement.getAttribute('aria-describedby');
              divContElement.removeAttribute('aria-describedby');
              divContElement.querySelector('div#' + attrValue).remove();

              if(header.getAttribute('bsortable') === 'true') {
                header.removeAttribute('title');
                divContElement.setAttribute('title', 'Enter to sort');
              }
            }

            // set header menu role and title
            headerText = headerText + headerMenu.getAttribute('title');
            headerMenu.setAttribute('role', "button");
            headerMenu.setAttribute('title', headerText.trim());
          }
        });
      }
    };
  })();
}
}
//static-content-hash-trigger-GCC
//<script>
(function(){
    /*BUG-159902: Dev tip for the ENG-12590.*/
    if(typeof(pega) == "undefined"){
      return;
    }
	var Dom = pega.util.Dom;
	var Event = pega.util.Event;
	var DDM = pega.util.DDM;


	pega.ui.gridRowDD = function(el,gridObj){
		this.gridObj = gridObj;
		pega.ui.gridRowDD.superclass.constructor.call(this,el, gridObj.gridDiv.id,{dragElId : "yui_ddproxy"});
		this.leftParent = gridObj.leftBodyDiv;
		this.baseGridNode = Dom.getFirstChild(this.leftParent);
		this.assocTable = gridObj.rightBodyTbl;
		this.masterDiv = gridObj.gridDiv;
		this.clickEl = el;
		this.destEl = null;
		if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
			if (this.gridObj.bTreegrid) {
				this.clickRow = el;
			}
			else {
				this.clickRow = el.parentNode.parentNode; // The li with class gridRow.
			}
		} else {
			this.clickRow = el;
			/* Subscribing to the mouse down event and returning false from it if the event target is not a descendant of the first column of the TR
			 * Done to prevent DD actions when trying to select text in an input box inside one of the other columns of the row
			 */
			var _this = this;
			this.on('mouseDownEvent', function(e) {
		    	if(! Dom.isAncestor(_this.clickRow.cells[0], Event.getTarget(e))) {
					return false;
				}
			});
		}

	};


	pega.extend(pega.ui.gridRowDD,pega.util.DDProxy, {

		onMouseDown : function(e) {
			var el = this.getDragEl();
			el.style.left = (Event.getPageX(e) + 10) + "px";
			el.style.top = (Event.getPageY(e) + 10) + "px";
		},
		b4StartDrag : function(x,y){
			var grid = this.gridObj;
			var target = this.clickEl;
			if(grid.editConfig == grid.EDIT_ROW) {
				var row = grid.getRightRow();
				if(Dom.hasClass(row ,"editMode")) {
					var eventDetails = {type:"mousedown",target:target,context:grid,handler:grid.submitRow,args:true};
					grid.pushToQueue(eventDetails);
				}
			} else if (grid.editConfig == grid.EDIT_READWRITE) {
				/* BUG-194012: If the user was typing in a text input and clicked straight to
				 * the drag handle, the change event of the text input is not getting fired,
				 * as the text input is not losing focus. Later when the change event is fired,
				 * its subscribers are unable to find the associated element in DOM, as we replace
				 * the innerHTML of the grid cells the elements become orphan.
				 */
				if(grid.leftBodyTbl) {
					// Assuming grid.leftBodyTbl.rows exists, since user has reached this far
					$(grid.leftBodyTbl.rows[grid.activeRow]).find(document.activeElement).blur();
				} else if(grid.rightBodyTbl) {
					// Similar logic to the if block
					$(grid.rightBodyTbl.rows[grid.activeRow]).find(document.activeElement).blur();
				}
			}
			if(target && target.nodeName.toUpperCase() == "LI" && Dom.hasClass(target, "gridRow")) {
				var rowIndex = Dom.getElementsById(target.id,this.assocTable,"tr")[0].rowIndex;
				grid.pushToQueue({type:"action",handler:grid.callSelectPage, context:grid,args:[grid.leftBodyUL,rowIndex]});
			} else {
				if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
					var cell = grid.findCell(null, grid.leftBodyUL, target);
					if(cell){
						var rowIndex = grid.getRowIndex(cell);
						grid.pushToQueue({type:"action",handler:grid.callSelectPage, context:grid,args:[grid.leftBodyUL,rowIndex]});
					}
				} else {
					var rowIndex = target.rowIndex;
					grid.pushToQueue({type:"action",handler:grid.callSelectPage, context:grid,args:[grid.rightBodyTbl,rowIndex]});
				}

			}

			var dragEl = this.getDragEl();
			//this.initConstraints(x,y);
			this._resizeProxy();
			Dom.setStyle(dragEl, "visibility", "visible");
			Dom.setStyle(dragEl, "display", "block");

		},
		setDragElPos: function(iPageX, iPageY) {
			// the first time we do this, we are going to check to make sure
			// the element has css positioning

			var el = this.getDragEl();
			//this.alignElWithMouse(el, iPageX + 10, iPageY + 10);
			el.style.left = (iPageX + 10) + "px";
			el.style.top = (iPageY + 10) + "px";
		},
		adjustScrollBars : function(currentIndex, y){
			var scrTop = this.assocTable.rows[currentIndex].offsetTop;
			this.bScrollGridUp = false;
			this.bScrollGridDown = false;
			var _this = this;
      //BUG-670549: Rows reordering issue
      //When the Grid container format is 'None' get the gridOffsetTop value from the closest table element.
      _this.gridOffsetTop = _this.gridObj.gridDiv.offsetTop;
      if(_this.gridObj.gridDiv.offsetTop === 0 && _this.gridObj.gridDiv.offsetParent && _this.gridObj.gridDiv.offsetParent.tagName === "TD"){
          _this.gridOffsetTop = $(_this.gridObj.gridDiv.offsetParent).closest('table').length && $(_this.gridObj.gridDiv.offsetParent).closest('table')[0].offsetTop;
        }
			var bFixedSizeWithoutColFreeze = (!_this.gridObj.fixedCol && (_this.gridObj.gridcontDiv.style.width != "" || _this.gridObj.gridcontDiv.style.height != ""));
			var bFixedSizewithRowFreeze = (_this.gridObj.fixedRow && !_this.gridObj.fixedCol && (_this.gridObj.layoutWrapperDiv.getAttribute("noWidth") != "" || _this.gridObj.layoutWrapperDiv.getAttribute("noHeight") != ""));
			var isProgressiveLoad = (_this.gridObj.pageMode == "Progressive Load");
			if(this.gridObj.vScrollDiv){
				/*comes here only  if freeze Panes are specified and fixSize is checked in  PropertyPanel of  Grid i.e. Custom scroll bar*/
				/* check if current dragOver element's offsetTop is <  vertical scrollbar div's scrollTop then move scrollbar UP */
				var scrollDivHt=this.gridObj.rightHeaderDiv ? (this.gridObj.vScrollDiv.offsetHeight-this.gridObj.rightHeaderDiv.offsetHeight) :this.gridObj.vScrollDiv.offsetHeight;
				var rowHeight = this.assocTable.rows[currentIndex].offsetHeight;
				if((scrTop -  rowHeight ) < this.gridObj.vScrollDiv.scrollTop){
					 this.gridObj.vScrollDiv.scrollTop =scrTop-rowHeight;
				}else if(this.gridObj.vScrollDiv.scrollTop+scrollDivHt <= (scrTop + rowHeight)){

					/*@@@@ increase it only by offsetheight of current dragOver elements offsetHeight @@@@ */
					this.gridObj.vScrollDiv.scrollTop =this.gridObj.vScrollDiv.scrollTop+rowHeight;
				}
				if(_this.gridObj.vScrollDiv.scrollTop>0 && (scrTop+this.assocTable.rows[0].offsetHeight+10)>=this.gridObj.vScrollDiv.scrollTop && (scrTop-this.assocTable.rows[0].offsetHeight-10)<=this.gridObj.vScrollDiv.scrollTop){
					this.bScrollGridUp = true;
					var scrollUpID = setInterval(function() {
						_this.scrollGridUp(_this, _this.gridObj.vScrollDiv, scrollUpID, rowHeight, _this.gridObj.vScrollCont);
					}, 10);
				}
				if((_this.gridObj.vScrollDiv.scrollTop+_this.gridObj.vScrollDiv.offsetHeight<_this.gridObj.vScrollCont.offsetHeight) && (scrTop+rowHeight+20>=this.gridObj.vScrollDiv.scrollTop+scrollDivHt-this.assocTable.rows[0].offsetHeight) && (scrTop+rowHeight-20<=this.gridObj.vScrollDiv.scrollTop+scrollDivHt-this.assocTable.rows[0].offsetHeight)) {
					this.bScrollGridDown = true;
					var scrollDownID = setInterval(function() {
						_this.scrollGridDown(_this, _this.gridObj.vScrollDiv, scrollDownID, rowHeight, _this.gridObj.vScrollCont);
					}, 10);
				}
			}else if(bFixedSizeWithoutColFreeze || isProgressiveLoad || bFixedSizewithRowFreeze) {
				/*comes here only  if fixSize is checked in  PropertyPanel of  Grid without freeze panes i.e. scroll is given to gridContent div -- NO Custom Scroll bar*/
				/* check if current dragOver element's offsetTop is <  vertical scrollbar div's scrollTop then move scrollbar UP */
				if(_this.gridObj.fixedRow) { //If either Fixed Size with Row Freeze or Progressive Load.
					var divTobeScrolled = this.gridObj.layoutWrapperDiv;
					var scrollDivHt = divTobeScrolled ? (divTobeScrolled.offsetHeight) :this.gridObj.gridcontDiv.offsetHeight;
				}
				else {
					var divTobeScrolled = this.gridObj.gridcontDiv;
					var scrollDivHt=this.gridObj.rightHeaderDiv ? (divTobeScrolled.offsetHeight-this.gridObj.rightHeaderDiv.offsetHeight) :divTobeScrolled.offsetHeight;
				}
				var rowHeight = this.assocTable.rows[currentIndex].offsetHeight;
				var topBufferHeight = 0;

				if(_this.gridObj.bDiscardInvisibleRows) {/* TASK-127357 */
					if(_this.gridObj.topBuffer.style.height != "auto") { // BUG-86957
						topBufferHeight = _this.gridObj.topBuffer.offsetHeight;
					}
					scrTop += topBufferHeight;
				}
				if((scrTop -  rowHeight ) < divTobeScrolled.scrollTop){
					 if(_this.gridObj.bDiscardInvisibleRows) {/* TASK-127357 */
						if(topBufferHeight <= (scrTop -  rowHeight)) {
					 		divTobeScrolled.scrollTop =scrTop-rowHeight;
					 	}
					 } else {
						divTobeScrolled.scrollTop =scrTop-rowHeight;
					 }

				}else if(divTobeScrolled.scrollTop+scrollDivHt <= (scrTop + rowHeight)){
					divTobeScrolled.scrollTop =divTobeScrolled.scrollTop+rowHeight;
				}
				if(divTobeScrolled.scrollTop>0 && (scrTop+this.assocTable.rows[0].offsetHeight+10)>=divTobeScrolled.scrollTop && (scrTop-this.assocTable.rows[0].offsetHeight-10)<=divTobeScrolled.scrollTop){
					this.bScrollGridUp = true;
					var scrollUpID = setInterval(function() {
						_this.scrollGridUp(_this, divTobeScrolled, scrollUpID, rowHeight, _this.gridObj.gridcontDiv);
					}, 10);
				}
				if((divTobeScrolled.scrollTop+divTobeScrolled.offsetHeight<divTobeScrolled.scrollHeight) && (scrTop+rowHeight+20>=divTobeScrolled.scrollTop+scrollDivHt-this.assocTable.rows[0].offsetHeight) && (scrTop+rowHeight-20<=divTobeScrolled.scrollTop+scrollDivHt-this.assocTable.rows[0].offsetHeight)) {
					this.bScrollGridDown = true;
					var scrollDownID = setInterval(function() {
						_this.scrollGridDown(_this, divTobeScrolled, scrollDownID, rowHeight, _this.gridObj.gridcontDiv, true);
					}, 10);
				}
			}else{
				/* if  block is entered in all cases other than  Fixed button bar doesnt   */
				if(!this.gridObj.scrollObjInfo) {
					this.gridObj.scrollObjInfo = this.gridObj.getScrollObj(this.gridObj.gridDiv);
				}
				var scrollObj=this.gridObj.scrollObjInfo[0];
				var abs_top=this.gridObj.scrollObjInfo[2];
				var rowHeight=this.assocTable.rows[currentIndex].offsetHeight;
				var scrollTopValue = 5;    // BUG-675284 - const is an ES6 construct and using it breaks Preflight Optimization
				if(scrollObj.tagName=="BODY" || (scrollObj.id!=null && scrollObj.id!="HARNESS_CONTENT")){
					/* SCROLLDOWN only  if y position is  greater than offsetHeight+ scrollTop of body/div
					   SCROLLUP  only if y position is less than body's scrollTop	 */
					var yPos=y +rowHeight+abs_top;
          	 		// BUG- 627549, PREVENT SCROLL TO TOP
          			if( yPos >(scrollObj.scrollTop +scrollObj.offsetHeight)) {
						scrollObj.scrollTop= scrollObj.scrollTop + rowHeight;
					}
					/*else if(y < (scrollObj.scrollTop + rowHeight +abs_top)){
						scrollObj.scrollTop=scrollObj.scrollTop - rowHeight;
					}*/
         			if((_this.gridObj.gridDiv.offsetHeight > scrollObj.offsetHeight) && (yPos <= rowHeight+50)){
						this.bScrollGridUp = true;
						var scrollUpID = setInterval(function() {
							_this.scrollGridUp(_this, scrollObj, scrollUpID, scrollTopValue, _this.gridObj.gridDiv);
						}, 500);
					}
          			if(yPos>scrollObj.offsetHeight && (scrollObj.offsetHeight+this.assocTable.rows[0].offsetHeight)>=yPos ){
            			this.bScrollGridDown = true;
           			 	var scrollDownID2 = setInterval(function() {
              			_this.scrollGridDown(_this, scrollObj, scrollDownID2, scrollTopValue, _this.gridObj.gridDiv);
           	 			}, 500);
          			}
          			if(scrollObj.scrollTop+scrollObj.offsetHeight<_this.gridObj.gridDiv.offsetHeight && yPos>=scrollObj.scrollTop+scrollObj.offsetHeight-20 && yPos<=scrollObj.scrollTop+scrollObj.offsetHeight+20) {
						this.bScrollGridDown = true;
						var scrollDownID = setInterval(function() {
							_this.scrollGridDown(_this, scrollObj, scrollDownID, scrollTopValue, _this.gridObj.gridDiv);
						}, 500);
					}
				}else{
					/*harness has fixed button bar */
					/* SCROLLDOWN only  if y position is  greater than offsetHeight of div which has  scrollbar
					   SCROLLUP  only if y position is less than div's scrollTop	 */
					if(y +rowHeight > scrollObj.offsetHeight){
						scrollObj.scrollTop=scrollObj.scrollTop + rowHeight;
					}
					else if(y+scrollObj.scrollTop <( scrollObj.scrollTop +rowHeight)  ){
						scrollObj.scrollTop=scrollObj.scrollTop - rowHeight;
					}
					if(scrollObj.scrollTop>0 && (y-rowHeight<=0)) {
						this.bScrollGridUp = true;
						var scrollUpID = setInterval(function() {
							_this.scrollGridUp(_this, scrollObj, scrollUpID, rowHeight, _this.gridObj.gridDiv);
						}, 10);
					}
					if(y+rowHeight>=scrollObj.offsetHeight && y<=scrollObj.offsetHeight) {
						this.bScrollGridDown = true;
						var scrollDownID = setInterval(function() {
							_this.scrollGridDown(_this, scrollObj, scrollDownID, rowHeight, _this.gridObj.gridDiv);
						}, 10);
					}
				}
			}
		},

		/*API to move the scroll up while holding the mouse*/
		scrollGridUp: function(_this, scrollObj, scrollUpID, rowHeight,gridContentDiv){
      var gridOffsetTop = gridContentDiv.offsetTop;
      if(_this.gridOffsetTop){
        gridOffsetTop = _this.gridOffsetTop;
      }
			if(scrollObj.scrollTop<=gridOffsetTop) {
				_this.bScrollGridUp = false;
			}
			if(_this.gridObj.bDiscardInvisibleRows) {/* TASK-127357 */
	        	_this.bScrollGridUp = true;
				var scrollableHeight = _this.gridObj.topBuffer.offsetHeight;
				if(_this.gridObj.topBuffer.style.height == "auto") { // BUG-86957
					scrollableHeight = 0;
				}
				if((scrollObj.scrollTop - rowHeight) < scrollableHeight) {
					_this.bScrollGridUp = false;
				}
			}
			if(_this.bScrollGridUp) {
				scrollObj.scrollTop=scrollObj.scrollTop - rowHeight;
			}else {
				clearInterval(scrollUpID);
			}
		},
		/*API to move the scroll down while holding the mouse*/
		scrollGridDown: function(_this, scrollObj, scrollDownID, rowHeight, gridContentDiv, bDefaultScroll){
      var gridOffsetTop = gridContentDiv.offsetTop;
      if(_this.gridOffsetTop){
        gridOffsetTop = _this.gridOffsetTop;
      }
			if(bDefaultScroll) { /*It comes here where there is NO custom Scroll bar*/
				if(gridContentDiv.scrollTop+gridContentDiv.offsetHeight>gridContentDiv.scrollHeight) {
					_this.bScrollGridDown = false;
				}
			}else {
				if(scrollObj.scrollTop+scrollObj.offsetHeight>gridContentDiv.offsetHeight+gridOffsetTop) {
					_this.bScrollGridDown = false;
				}
			}
			if(_this.gridObj.bDiscardInvisibleRows) {/* TASK-127357 */
       		 	_this.bScrollGridDown = true;
				var scrollableHeight = _this.gridObj.topBuffer.offsetHeight;
				if(_this.gridObj.topBuffer.style.height == "auto") { // BUG-86957
					scrollableHeight = 0;
				}
				scrollableHeight = scrollableHeight + _this.gridObj.rightBodyTbl.offsetHeight - _this.gridObj.layoutWrapperDiv.offsetHeight;
				if((scrollObj.scrollTop + rowHeight) > scrollableHeight) {
					_this.bScrollGridDown = false;
				}
			}
			if(_this.bScrollGridDown) {
				scrollObj.scrollTop=scrollObj.scrollTop + rowHeight;
			}else {
				clearInterval(scrollDownID);
			}
		},
		resetConstraints : function(){
			// do nothing
		},

		startDrag : function(x,y){
			this.DDM.useCache = false;
			this.gridObj.gridDiv.style.cursor = "move";
		},

		onDragOver : function(e,id) {
			if(this.gridObj.submitErrors)
				return;
			if(id == "dragHandle"){
				return false;
			}
			var currentIndex;

			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				var destEl = pega.util.Dom.getElementsById(id, this.gridObj.leftBodyDiv)[0];
				if (id.indexOf("ul") < 0) {
					return false;
				}
				this.destEl = destEl.parentNode;
				if(this.destEl.id=="")
					return ;
				this.assocDestEl = Dom.getElementsById(this.destEl.id,this.assocTable,"tr")[0];
				currentIndex = this.assocDestEl.rowIndex;
			} else {
				var destEl = pega.util.Dom.getElementsById(id, this.gridObj.rightBodyTbl)[0];
				if (destEl.tagName.toUpperCase() !== "TR" || ! destEl.getAttribute("PL_INDEX")) {
					return false;
				}
				this.destEl = this.assocDestEl = destEl;
				currentIndex = this.assocDestEl.rowIndex;
			}
			var dragEl = this.getDragEl();
			var y = Event.getPageY(e);
			var x = Event.getPageX(e);


			var _this = this;
			if(typeof this.hoverToken != "undefined"){
				clearTimeout(this.hoverToken);
			}

			var dMode = this.getDropMode(this.clickRow, this.destEl, y);
			/*Disable hover styles on drag over*/
			this.gridObj.onCellHover(this.assocDestEl, false);

			if(dMode == "child") {
				if(this.gridObj.bTreegrid){
					var hvtgt = pega.ctx.dom.querySelector("[id='"+id+"']");
					var icon = Dom.getElementsById("iconExpandCollapse",hvtgt);
					if(icon){
						var iconAnchor = Dom.getChildren(icon[0]);
						if(iconAnchor){
							this.hoverToken = setTimeout(function(){

								if(Dom.hasClass(iconAnchor[0] ,"expandNode")){
									var eventDetails = {type:"click" ,target:iconAnchor[0],keyCode : null,context:_this };
									eventDetails.handler = _this.gridObj.doExpandCollapse;
									eventDetails.args = _this.gridObj;
									_this.gridObj.pushToQueue(eventDetails);
								}
							},3000);
						}
					}
				}
				Dom.removeClass(dragEl, "dragChild_Sibling");
				Dom.addClass(dragEl, "dragChild_Add");

				Dom.removeClass(destEl, "insertAfter");
				Dom.removeClass(destEl, "insertBefore");
				Dom.addClass(destEl, "insertChild");

				Dom.removeClass(this.assocDestEl, "insertAfter");
				Dom.removeClass(this.assocDestEl, "insertBefore");
				Dom.addClass(this.assocDestEl, "insertChild");

			} else if(dMode == "before" || dMode == "after") {
				Dom.removeClass(dragEl, "dragChild_Add");
				Dom.addClass(dragEl, "dragChild_Sibling");

				Dom.removeClass(destEl, "insertChild");

				Dom.removeClass(this.assocDestEl, "insertChild");

				if(dMode == "before") {
					Dom.removeClass(destEl, "insertAfter");
					Dom.addClass(destEl, "insertBefore");

					Dom.removeClass(this.assocDestEl, "insertAfter");
					Dom.addClass(this.assocDestEl, "insertBefore");
				} else {
					Dom.removeClass(destEl, "insertBefore");
					Dom.addClass(destEl, "insertAfter");

					Dom.removeClass(this.assocDestEl, "insertBefore");
					Dom.addClass(this.assocDestEl, "insertAfter");
				}
			} else if(dMode == "invalid") {
				Dom.removeClass(dragEl, "dragChild_Add");
				Dom.removeClass(dragEl, "dragChild_Sibling");
				Dom.removeClass(destEl, "insertAfter");
				Dom.removeClass(destEl, "insertChild");
				Dom.removeClass(destEl, "insertBefore");

				Dom.removeClass(this.assocDestEl, "insertAfter");
				Dom.removeClass(this.assocDestEl, "insertChild");
				Dom.removeClass(this.assocDestEl, "insertBefore");
			}
			if(this.lastHighlightedElements && this.lastHighlightedElements[0]!= destEl && this.lastHighlightedElements[1] != this.assocDestEl) {
				Dom.removeClass(this.lastHighlightedElements[0], "insertAfter");
				Dom.removeClass(this.lastHighlightedElements[0], "insertChild");
				Dom.removeClass(this.lastHighlightedElements[0], "insertBefore");
				Dom.removeClass(this.lastHighlightedElements[1], "insertAfter");
				Dom.removeClass(this.lastHighlightedElements[1], "insertChild");
				Dom.removeClass(this.lastHighlightedElements[1], "insertBefore");
			}
			this.lastHighlightedElements = [destEl, this.assocDestEl];
			this.adjustScrollBars(currentIndex ,y);
		},

		onDragOut: function(e, id) {
			if(this.gridObj.submitErrors)
				return;
			var destEl;
			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				destEl = Dom.getElementsById(id, this.gridObj.leftBodyDiv)[0];
			} else {
				destEl = Dom.getElementsById(id, this.gridObj.rightBodyTbl)[0];
			}
			Dom.removeClass(destEl, "insertAfter");
			Dom.removeClass(destEl, "insertChild");
			Dom.removeClass(destEl, "insertBefore");

			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				destEl = destEl.parentNode;
				if (destEl.id == "")
					return;
			} else {
				if (destEl.tagName.toUpperCase() !== "TR" || ! destEl.getAttribute("PL_INDEX")) {
					return;
				}
			}
			var assocDestElx = Dom.getElementsById(destEl.id,this.assocTable,"tr")[0];

			Dom.removeClass(assocDestElx, "insertAfter");
			Dom.removeClass(assocDestElx, "insertChild");
			Dom.removeClass(assocDestElx, "insertBefore");

			this.destEl = null;
			var dragEl = this.getDragEl();
			Dom.removeClass(dragEl, "dragChild_Add");
			Dom.removeClass(dragEl, "dragChild_Sibling");
		},
		clearSelection: function() {
			if (document.selection){
				try{document.selection.empty();}catch(selErr){/*unknown runtime error when empty selection IE8*/}
			}
			else if (window.getSelection)
				window.getSelection().removeAllRanges();
		},

		onDrag: function(e) {
			/*clear selection only for IE as it's an issue in IE only*/
			if(pega.env.ua.ie) {
				this.clearSelection();
			}

			if(this.gridObj.pageMode=="Progressive Load") {
					Event.removeListener(this.gridObj.layoutWrapperDiv,"scroll",this.gridObj.gridEventHandler);
			}

			if(this.gridObj.submitErrors)
				return;
			var x = Event.getPageX(e);
			var y = Event.getPageY(e);
			var dragEl = this.getDragEl();
			var target= Event.getTarget(e);
			/* finding the cell to adjust scrollbars  */
			var cell= this.gridObj.findCell(null,this.assocTable,target);
			if(!cell){
				var cell= this.gridObj.findCell(null ,this.gridObj.leftBodyUL,target);
				if(!cell ||  (cell&&cell.id=="dragHandle" || cell.id=="" || Dom.hasClass(cell, "headerCell")))
					return;

				this.assocDestEl = Dom.getElementsById(cell.parentNode.parentNode.id,this.assocTable,"tr")[0];
			}else{
				this.assocDestEl = cell.parentNode;
			}
			/*if a row has been dragged to a different grid, then return*/
			if(!Dom.isAncestor(this.assocTable, this.assocDestEl)) {
				return;
			}
			var currentIndex = this.assocDestEl.rowIndex;
			this.adjustScrollBars(currentIndex,y);
		},

		getDropMode : function(srcEl, targetRow, y) {
			var region = Dom.getRegion(targetRow);
			var assocEl = Dom.getElementsById(srcEl.id,this.assocTable,"tr")[0];
			var assocDestEl = Dom.getElementsById(targetRow.id,this.assocTable,"tr")[0];
			var dropMode = "";

            // BUG-235487: Send the proper row number instead of position, they are again calculating the position inside
			if(this.gridObj.pageMode=="Progressive Load" && assocDestEl) {
              		var firstRow_pl_index = parseInt(this.gridObj.rightBodyTbl.rows[1].getAttribute("pl_index"));
              		var assocDestEl_pl_index = parseInt(assocDestEl.getAttribute("pl_index"));
              		var assocDestEl_row_index = assocDestEl_pl_index - firstRow_pl_index + 1;
                    if(this.gridObj.isDummyRow(assocDestEl_row_index)) {/* BUG-242660: In case of progressive load, after paginating "pl_index" won't give correct row index. So written code to calculate assocDestEl_row_index */
                      dropMode = "invalid";
                      var firstRowIndex = 1;

                      if(this.gridObj.currentPageIndex) {
                          firstRowIndex = ((this.gridObj.currentPageIndex-1)*this.gridObj.rangeSize)+1;
                          var currPgFirstRow = this.gridObj.getLeftRow(firstRowIndex);
                          if(this.gridObj.layoutWrapperDiv.scrollTop)
                              this.gridObj.layoutWrapperDiv.scrollTop =  currPgFirstRow.offsetTop;
                          /*Incase of dropping on dummy row , scroll back to the current active page*/
                      }
                      return dropMode;
                    }
			}

			if(this.gridObj.bTreegrid == true) {
				if(Dom.isAncestor(srcEl,targetRow)) {
					dropMode = "invalid";
				}else if(y <= region.top + 5) {
					if(assocEl.rowIndex == assocDestEl.rowIndex)
						dropMode = "invalid";
					else
						dropMode = "before";
				}else if(y >= region.bottom - 5) {
					if(assocEl.rowIndex == assocDestEl.rowIndex)
						dropMode = "invalid";
					else
						dropMode = "after";
				}else {
					if(srcEl.parentNode.parentNode == targetRow)
						dropMode = "invalid";
					else if(assocDestEl.rowIndex == assocEl.rowIndex)
						dropMode = "invalid";
					else
						dropMode = "child";
				}

				var destParentId = this.destEl.parentNode.parentNode.id;
				var srcParentId = srcEl.parentNode.parentNode.id;
				/* Allow top level reordering. When src and dest are top level node and dragMode != child, do nothing */
				if(this.gridObj.bAlwaysExpandRoot && !(destParentId == "gridBody_left" && srcParentId == "gridBody_left"  && dropMode != "child")) {
					if((destParentId == "gridBody_left" || srcParentId == "gridBody_left") && dropMode != "child"){
						/* In case of bAlwaysExpandRoot
							1. don't allow child node to be dropped between top level nodes and
							2. Don't allow top level node to be dropped as child.
						*/
						dropMode = "invalid";
					} else if(srcParentId == "gridBody_left" && dropMode == "child") {
						/* Don't allow top level node to be dropped as child */
						dropMode = "invalid";
					}
				}
			}else {
				if(assocEl.rowIndex == assocDestEl.rowIndex)
						dropMode = "invalid";
				else if(y < (region.top) + (targetRow.offsetHeight/2)) {
					dropMode = "before";
				}else {
					 dropMode  = "after";
				}
			}
						return dropMode;
		},

		onDragDrop : function(e,id){
			if(this.gridObj.submitErrors)
				return;
			var button = e.which || e.button;
			if(button > 1) {
				Event.stopEvent(e);
				return;
			}
			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				if (this.gridObj.bTreegrid) {
					var _this = this;
					if (typeof this.hoverToken != "undefined") {
						clearTimeout(this.hoverToken);
					}
				}
				if (id == "dragHandle") {
					return false;
				}
				id = id.substring(2);
				this.destEl = pega.ctx.dom.querySelector("[id='"+id+"']");
			} else {
				this.destEl = pega.util.Dom.getElementsById(id, this.gridObj.rightBodyTbl)[0];
			}
			this.assocDestEl = Dom.getElementsById(this.destEl.id,this.assocTable,"tr")[0];

		},

		endDrag: function(e) {
			if(this.gridObj.submitErrors)
				return;
			if(this.gridObj.pageMode=="Progressive Load") {
				Event.addListener(this.gridObj.layoutWrapperDiv,"scroll",this.gridObj.gridEventHandler,this.gridObj.gridDiv,this.gridObj);
			}
			this.gridObj.gridDiv.style.cursor = "auto";
			if(this.gridObj.bTreegrid){
					var _this = this;
					if(typeof this.hoverToken != "undefined"){
						clearTimeout(this.hoverToken);
					}
			}
			this.DDM.refreshCache();
			clearInterval(this.timeToken);

			var srcEl = this.clickRow;
			var destEl = this.destEl;
			if(!destEl)
				return;
			/*set a variable in Grid Object to stop honoring click actions after Drag drop (IE issue).*/
			if(Event.isIE) {
				this.gridObj.DDProcessing = true;
			}
			var proxy = this.getDragEl();
			var proxyid = proxy.id;
			var y = Event.getPageY(e);
			var dropMode = this.getDropMode(srcEl,destEl,y);
			// Show the proxy element and animate it to the src element's location
			Dom.setStyle(proxy, "visibility", "hidden");
			Dom.setStyle(proxy,"display","none");
			var a = new pega.util.Motion(proxy, {points: {to: Dom.getXY(destEl)}},0.2,pega.util.Easing.easeOut);
			var _this = this;
			// Hide the proxy and show the source element when finished with the animation
			a.onComplete.subscribe(function() {
				Dom.setStyle(proxyid, "visibility", "hidden");
				if(dropMode == "invalid") {
					/* BUG-107073: Replaced "this" with _this in below line. */
					_this.gridObj.DDProcessing = false;
					return false;
				}
				if(dropMode == "child") {
					var assocDestEl = Dom.getElementsById(destEl.id,this.assocTable,"tr")[0];
					var expCollNode = _this.gridObj.getExpandCollNode(assocDestEl.rowIndex);
					if(Dom.hasClass(expCollNode,"expandNode")){
						var eventDetails = {type : "click", target:expCollNode, context: _this.gridObj, handler : _this.gridObj.doExpandCollapse, args:_this.gridObj};
						_this.gridObj.pushToQueue(eventDetails);
					}
				}
              setTimeout(function(){
                /* BUG-358776: Unnecessary add/remove of classes results in incorrect cursor pointer for expandPane icon */
                /*$(document.activeElement).closest(".gridTable").find(".cellCont.rowHandle").removeClass("draggableCell")
                $(document.activeElement).closest(".gridTable").find(".cellCont.rowHandle").addClass("draggableCell")*/
                setTimeout(function(){
                	var eventDetails = {type : "action", context: _this, handler : _this.handleDrop, args:[srcEl,destEl,dropMode]};
					_this.gridObj.pushToQueue(eventDetails);
	              }, 1);
               }, 1);
			});
			a.animate();
			if(this.gridObj.pageMode == "Progressive Load" && this.gridObj.isDummyRow(this.gridObj.rightBodyTbl.rows[parseInt(this.gridObj.getRowIndexFromPosition()+parseInt(this.gridObj.rangeSize))]))
			{
				this.gridObj.progressiveLoadGrid();
			}
		},

		handleDrop : function(args) {
			var srcEl = args[0];
			var destEl = args[1];
			var dndMode = args[2];

			var assocEl = Dom.getElementsById(srcEl.id,this.assocTable,"tr")[0];
			var assocDestEl = Dom.getElementsById(destEl.id,this.assocTable,"tr")[0];

			Dom.setStyle(srcEl, "visibility", "");
			Dom.setStyle(assocEl,"visibility","");

			var dropMode;

			//when a newly added row is DDropped, srcEl is a zombie, therefore querying for the live source element again
			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				srcEl = pega.util.Dom.getElementsById(srcEl.id, this.gridObj.leftBodyUL)[0];
			} else {
				srcEl = pega.util.Dom.getElementsById(srcEl.id, this.gridObj.rightBodyTbl)[0];
			}

			/*If source and destination parent nodes are same, then it's a re-order*/
			if(srcEl.parentNode == destEl.parentNode) {
				dropMode = "REORDER";
			}else {
				dropMode = "DND";
			}

			var baseRef = pega.u.d.getBaseRef(this.masterDiv);

			var parentRow;
			// TODO - Verify if correct
			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				parentRow = srcEl.parentNode.parentNode;
				if(Dom.hasClass(parentRow,"gridRow")){
					var pageName = pega.ui.property.toReference(parentRow.id);
				}else {
					var pageName = "";
				}
				parentRow = (dndMode == "child") ? destEl : destEl.parentNode.parentNode;
				if(Dom.hasClass(parentRow,"gridRow")) {
					var destPageName = pega.ui.property.toReference(parentRow.id);
				}else {
					var destPageName = "";
				}
			} else {
				var pageName = "";
				var destPageName = "";
			}
			var pageListProp = (pageName=="" || dropMode == "DND")?this.gridObj.getPLPGProperty():this.gridObj.PLPGName;
			var srcPLIndex = srcEl.getAttribute("PL_INDEX");
			if(dndMode == "child") {
				var targetIndex = "";
			}else {
				/* @@@@ dropMode=="REORDER" calls  ReorderPageList activity which  moves the page to the specified target index.
					so in case of mode=before, pass the previous index to 	activity .
				 dropMode=="DND" calls "PzPerformDragDrop" activity which  adds the page at the specified target index. In case of after, pass the next index @@@@ */

				/*for Filtered Grid, we should always drop below some row. So, get previous sibling of destination ele and change the dropMode to after*/
				var tempPrevSibling = Dom.getPreviousSibling(destEl);
				if(dndMode == "before" && this.gridObj.bFilteredGrid && tempPrevSibling && tempPrevSibling.id!="")  {
					if(!this.gridObj.bTreegrid || this.gridObj.bTreegrid && tempPrevSibling.id!="gridNode") {
						destEl = tempPrevSibling;
						dndMode = "after";
					}
				}

				var targetIndex = destEl.getAttribute("PL_INDEX");

				if(dndMode == "after" && dropMode!="REORDER"){
					targetIndex = parseInt(targetIndex)+1;
				}
				else if (dndMode == "before" && dropMode=="REORDER" && (parseInt(srcPLIndex)<parseInt(targetIndex))){
					targetIndex = parseInt(targetIndex)-1;
				}
			}
			/*BUG-147605 - If condition added to prevent a reload of the section and avoid an exception in case the source and destination are the same*/
			if(srcEl != destEl){/* BUG-246247: Changed condition from targetIndex!=srcPLIndex as we cannot depend on pl_index in case of tree grid. While dropping 2.2(2nd child row of 2nd row) row above 2nd row, target and source pl_index are same. So changed condition to compare DOM elements. */

				this.gridObj.markAsDirty();
				pega.u.d.registerFocusIn(srcEl);
				var url = SafeURL_createFromURL(pega.u.d.url);
				var gridIndex=pega.u.d.getLayoutIndex(this.gridObj.gridDiv);

			var partialParams = {partialTrigger : "dragdrop" + this.gridObj.getConfiguredPLPGProperty()+gridIndex,
						beforeDomAction :this.handleSuccess,
						beforeParams : [srcEl, destEl,dndMode, dropMode],
						beforeDomActionContext:this,
						afterParams: dropMode};
			if(this.gridObj.editConfig == this.gridObj.EDIT_HARNESS){
				partialParams.afterDomAction = this.refreshEmbeddedPane;
				partialParams.afterDomActionContext = this;
			}
			partialParams.domAction = "dragdrop";
			url.put("PageListProperty",pageListProp);
			var reloadEle = this.masterDiv;
			if(pageName == "") {
				url.put("BaseReference", baseRef);
			}
			if(destPageName =="") {
				url.put("DestBaseReference", baseRef);
			}
			url.put("TargetIndex",targetIndex);
			url.put("CurrentIndex",srcPLIndex);
			url.put("PageName",pageName);
			var srcPageName = pega.ui.property.toReference(srcEl.id);
			var targetPageName = pega.ui.property.toReference(destEl.id);
			url.put("sourcePageName", srcPageName);
			/*set thread context only for edit in Haress*/
			if(this.gridObj.modalThreadContext && this.gridObj.editConfig == "harness"){
				url.put("pzThreadName",this.gridObj.modalThreadContext);
			}
			if(dndMode != "child" && dropMode=="REORDER") {
				url.put("targetPageName", targetPageName);
				url.put("gridActivity", "ReorderPageList");
				url.put("gridAction", "REORDER");
				if(this.gridObj.gridPreActivity) {
					url.put("gridPreActivity", this.gridObj.gridPreActivity);
				}
				if(this.gridObj.gridPostActivity) {
					url.put("gridPostActivity", this.gridObj.gridPostActivity);
				}
				if(parseInt(srcPLIndex) > targetIndex && dndMode == "after")
					url.put("TargetIndex",parseInt(targetIndex) + 1 );
			}else {
				url.put("targetPageName", targetPageName);
				url.put("destPageName", destPageName);
				url.put("gridAction", "DRAGDROP");
				if(this.gridObj.gridPreActivity) {
					url.put("gridPreActivity", this.gridObj.gridPreActivity);
				}
				if(this.gridObj.gridPostActivity) {
					url.put("gridPostActivity", this.gridObj.gridPostActivity);
				}
				url.put("gridActivity", "pzPerformDragDrop");
			}
			if(this.gridObj.bFilteredGrid) {
				url.put("pyGridFilterCriteriaPage", this.gridObj.gridFilterPage);
				url.put("refreshLayout", "true");
				if((this.gridObj.currentPageIndex && this.gridObj.currentPageIndex!="" && this.gridObj.pyPaginateActivity=="") || this.gridObj.pageMode=="Progressive Load") {
					url.put("pyPageSize",this.gridObj.rangeSize);
					url.put("currentPageIndex",this.gridObj.currentPageIndex);
					if(this.gridObj.pageMode=="Progressive Load") {
						url.put("startIndex", 1);
						url.put("recordsInCurrentPage", (this.gridObj.currentPageIndex+1)*this.gridObj.rangeSize);
						window.scrollTopBeforeReorder = this.gridObj.layoutWrapperDiv.scrollTop; // BUG-86307
						if(this.gridObj.bDiscardInvisibleRows) { // BUG-86430
							url.put("startIndex", this.gridObj.getFirstLoadedRowIndex());
							url.put("bDiscardInvisibleRows", this.gridObj.bDiscardInvisibleRows);
							var recordsInCurrentPage = 0;
							recordsInCurrentPage = 3 * this.gridObj.rangeSize;
							if(this.gridObj.currentPageIndex == 1) { /* For the first page fetch only 20 rows */
								recordsInCurrentPage = 2 * this.gridObj.rangeSize;
							}
							url.put("recordsInCurrentPage", recordsInCurrentPage);
						}
					}else {
						url.put("startIndex", ((parseInt(this.gridObj.currentPageIndex,10)-1)*parseInt(this.gridObj.rangeSize,10)+1));
					}
				}
				partialParams =null;
			}
        /* BUG-521635: A flag to control message clearing from primary page */
        url.put('KeepGridMessages', pega.u.d.KEEP_GRID_MESSAGES === true ? 'true' : 'false');
			pega.u.d.reloadRepeatLayout('pzdoGridAction',url.toQueryString(), null,null,reloadEle ,partialParams, true);
			}
		},

		getLevel : function(row) {
			var gridDS = this.gridObj.dataSourceRef;
			var hPref = row.id;
			var arr = hPref.split("$p");
			var DSDots =  pega.ui.property.toHandle(gridDS).split("$p");
			return arr.length - (DSDots.length-1);
		},

		handleSuccess : function(args, responseObj) {
			var newStream = responseObj.responseText;
			var documentFragment = document.createDocumentFragment();
			var newElement = document.createElement("DIV");
			newElement.style.display="none";
			documentFragment.appendChild(newElement);
			newElement.innerHTML = newStream;
			/*Reset the value which is set in endDrag.*/
			this.gridObj.DDProcessing = false;
			if(newStream.indexOf("GRIDCOMMIT")>-1) {
				var commitArray = newStream.split("||GRIDCOMMIT||")[1].split("||");
				var newTransID = commitArray[0];
				var newurl = SafeURL_createFromURL(pega.u.d.url);
				newurl.put("pzTransactionId",newTransID);

				pega.u.d.url = newurl.toURL();

				if(document.forms && pega.ctx.dom.getElementsByTagName("form")[0]) {
                    var form0 = pega.ctx.dom.getElementsByTagName("form")[0];
					var url = form0.action;
					var formURL = SafeURL_createFromURL(url);
					formURL.put("pzTransactionId",newTransID);
					form0.action= formURL.toURL();
				}
			}

			if(Dom.getElementsById("ERRORTABLE",newElement)) {
				return;
			}else{
				var errorTable = pega.ctx.dom.getElementById("ERRORTABLE");
				if(errorTable && errorTable.parentNode)
					errorTable.parentNode.removeChild(errorTable);
			}
			try{
				this.gridObj.selectRow(this.gridObj.getIndex(this.gridObj.activeRow), false);
			}catch(ex){


			}
			var srcEl = args[0];
			var destEl = args[1];
			var mode = args[2];
			var dropMode = args[3];
			var assocEl = Dom.getElementsById(srcEl.id,this.assocTable,"tr")[0];
			var assocDestEl = Dom.getElementsById(destEl.id,this.assocTable,"tr")[0];
			var srcIndex = assocEl.rowIndex;
			var targetIndex = assocDestEl.rowIndex;

			var srcLevel = this.getLevel(srcEl);
			var destLevel = this.getLevel(destEl);
			if(srcLevel != 1)
				var defPadding = parseInt(Dom.getFirstChild(srcEl).style.paddingLeft) - (18*(srcLevel-1));
			else
				var defPadding = parseInt(Dom.getFirstChild(srcEl).style.paddingLeft);

			//when a newly added row is DDropped, srcEl is a zombie, therefore querying for the live source element again
			srcEl = pega.util.Dom.getElementsById(srcEl.id, this.gridObj.leftBodyUL)[0];
			destEl = pega.util.Dom.getElementsById(destEl.id, this.gridObj.leftBodyUL)[0];

			var srcNextSibling = Dom.getNextSibling(srcEl);
			var srcParentNode = srcEl.parentNode;
			if(srcParentNode && srcParentNode.id=="gridNode") {
				var totalChildren = Dom.getChildren(srcParentNode);
				if(totalChildren.length==1) {
					var removeUL = true;
				}
			}
			/*Trigger progressive load in the page if a top level node is dropped as a child within the same page*/
			if(mode=="child" && this.gridObj.pageMode=="Progressive Load"){
				if(srcLevel==1) {
					var srcPageNo = Math.ceil(srcIndex/this.gridObj.rangeSize);
				}
			}
			var assocDetailsTR = null;
			if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE) {
				var assocDetailsDiv = Dom.getElementsById("rowDetail"+assocEl.id, this.gridObj.rightBodyTbl, "DIV");
				if(assocDetailsDiv && assocDetailsDiv[0])
					assocDetailsDiv = assocDetailsDiv[0];
				/* BUG-146411 : Drag drop doesn't work when only one of the targets has details expanded */
				/* Create expand pane */
				else
				{
					assocDetailsDiv = this.createExpandPaneTR(assocEl);
				}

				if(assocDetailsDiv) {
					assocDetailsTR = assocDetailsDiv.parentNode.parentNode;
				}
			}
			if (mode == "before") {
				/*move the LI element only when UL/Lis are there */
				if(this.gridObj.bTreegrid || this.gridObj.fixedCol) {
					Dom.insertBefore(srcEl, destEl); // insert above
				}
				Dom.insertBefore(assocEl,assocDestEl);
				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE && assocDetailsTR) {
					Dom.insertBefore(assocDetailsTR, assocDestEl);
				}
				if(srcIndex <targetIndex) {
					targetIndex = targetIndex -1;
				}
			} else if(mode == "after"){
				/*move the LI element only when UL/Lis are there */
				if(this.gridObj.bTreegrid || this.gridObj.fixedCol) {
					Dom.insertAfter(srcEl, destEl); // insert after
				}
				var detailsTR = null;
				var detailsDiv = null;
				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE) {
					detailsTR = Dom.getNextSibling(assocDestEl);
					if(detailsTR) {
						detailsDiv = Dom.getElementsById("rowDetail"+assocDestEl.id, detailsTR, "DIV");
						if(detailsDiv && detailsDiv[0])
							detailsDiv = detailsDiv[0];
					}
					/* Create expand pane   */
					else
					{
						detailsDiv = this.createExpandPaneTR(assocDestEl);
						detailsTR = Dom.getNextSibling(assocDestEl);
					}
				}
				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE && detailsDiv) {
					Dom.insertAfter(assocEl,detailsTR);
				}else {
					Dom.insertAfter(assocEl,assocDestEl);
				}
				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE && assocDetailsTR) {
					Dom.insertAfter(assocDetailsTR, assocEl);
				}
				if(srcIndex > targetIndex) {
					targetIndex = targetIndex + 1;
				}
			}else if(mode == "child"){
				var treeNode = Dom.getElementsById("gridNode", destEl);
				if(treeNode && treeNode[0] && Dom.getChildren(treeNode[0]).length>0) {
					treeNode = treeNode[0];
					var childrenExist = true;
					var destEle;
					var lastChild = Dom.getLastChild(treeNode);
					Dom.insertAfter(srcEl,lastChild);
					while(childrenExist) {
						if(lastChild) {
							destEle =Dom.getElementsById(lastChild.id,this.gridObj.rightBodyTbl)[0];
							treeNode = Dom.getElementsById("gridNode", lastChild);
							if(treeNode && treeNode[0] && Dom.getChildren(treeNode[0]).length>0) {
								treeNode = treeNode[0];
								lastChild = Dom.getLastChild(treeNode);
							}else {
								childrenExist = false;
								break;
							}
						}
					}
					Dom.insertAfter(assocEl,destEle);
					var targetIndex  = destEle.rowIndex + 1;
				}else {
					if(!treeNode) {
						var treeNode = document.createElement("UL");
						treeNode.id = "gridNode";
						treeNode.className = "gridNode";
						destEl.appendChild(treeNode);
					}else {
						treeNode = treeNode[0];
					}
					treeNode.appendChild(srcEl);
					Dom.insertAfter(assocEl,assocDestEl);
					var targetIndex  = assocDestEl.rowIndex + 1;
				}
				var expCollNode = this.gridObj.getExpandCollNode(assocDestEl.rowIndex);
				if(Dom.hasClass(expCollNode,"noEC")){
					Dom.removeClass(expCollNode, "noEC");
					Dom.addClass(expCollNode, "collapseNode");
				}
				destLevel = destLevel+1;
			}
			if(removeUL){
				var assocParentEl = Dom.getElementsById(srcParentNode.parentNode.id,this.assocTable,"tr")[0];
				var parentexpColl = this.gridObj.getExpandCollNode(assocParentEl.rowIndex);
				srcParentNode.parentNode.removeChild(srcParentNode);
				if(Dom.hasClass(parentexpColl,"collapseNode")){
					Dom.removeClass(parentexpColl, "collapseNode");
					Dom.addClass(parentexpColl, "noEC");
				}
			}
			this.defPadding = defPadding;
			this.srcLevel = srcLevel;
			this.destLevel = destLevel;
			if(srcLevel != destLevel) {
				this.correctIndentation(srcEl,destLevel);
			}

			if(this.gridObj.bTreegrid) {
				this.nextTarget = assocEl;
				this.moveChildren(srcEl);
			}
			if(this.gridObj.bTreegrid){
				if(mode!="child" && dropMode=="REORDER") {
					this.updateHandlesAfterDD([srcIndex, targetIndex, mode, srcEl,destEl]);
				}else {
					if(srcNextSibling) {
						this.gridObj.updateTreeHandlesAfterDelete([srcNextSibling, srcEl.id, srcEl.getAttribute("PL_INDEX"), srcEl.id, srcIndex, targetIndex]);
					}
					this.gridObj.updateTreeHandlesAfterInsert(-1,[srcEl, mode, srcIndex, targetIndex]);
				}
			}else {
				this.updateHandlesAfterDD([srcIndex, targetIndex, mode, srcEl,destEl]);
			}
			var oTargets =this.DDM.getRelated(this,true);
			for (var i in oTargets){
				oTargets[i].unreg();
			}
			var activeRowDOM = this.gridObj.rightBodyTbl.rows[this.gridObj.getIndex(assocEl.rowIndex)];
			/*update activeRow temporarily to avoid unhighlighting of a row when rowIndex of the it is same before and after DnD.*/
			this.gridObj.activeRow = 0;
			this.gridObj.selectPage(null,null,assocEl.rowIndex);
			//this.gridObj.focusFirstElement(activeRowDOM);  BUG-70475: selectPage api in the above line focuses the grid row using tabindex. Hence this is line not required.
			/*call the process onloads after doing the Dom operations in drag and drop*/
			pega.u.d.processOnloads(srcEl);
			if(srcPageNo && this.gridObj.pageMode=="Progressive Load") {
				this.gridObj.bCustomLoad = true;
				this.gridObj.progressiveLoadGrid(srcPageNo);
			}
		},

		/* BUG-146411: Create expand pane if one doesn't exist */
		createExpandPaneTR: function(selectedRow)
		{
			var rowIndex = selectedRow.rowIndex;
			var totalCells = selectedRow.cells.length;
			if(totalCells==0 && selectedRow.id=="yui_modalrownew") {
				var prevSibling = pega.util.Dom.getPreviousSibling(selectedRow);
				totalCells = (prevSibling)?prevSibling.cells.length:1;
			}else if(totalCells==1 && (selectedRow.id=="" || selectedRow.id==null)) {
				totalCells = selectedRow.cells[0].colSpan;
			}
			var newTR = this.gridObj.rightBodyTbl.insertRow(rowIndex+1);
			newTR.setAttribute("expanded", "true");
			var newTD = newTR.insertCell(-1);
			newTD.colSpan=totalCells;
			var detailsDiv = document.createElement("DIV");
			detailsDiv.id = "rowDetail"+selectedRow.id;
			newTD.appendChild(detailsDiv);
			return detailsDiv;
		},

		refreshEmbeddedPane : function(dropMode) {
			var activeRowDOM = null;
			if(this.gridObj.bTreegrid) {
				activeRowDOM = this.gridObj.getLeftRow();
			}
			else {
				activeRowDOM = this.gridObj.getRightRow();
			}
			pega.u.d.preReloadEle = null;
			if(Dom.getElementsById("pyFlowActionHTML", this.gridObj.gridDetailsDiv)){
				this.gridObj.DONOT_SUBMIT = true;
			}
			if (dropMode == "DND") {
				// BUG-68932: When reordering the last child node of a node to its parent node level the last child's flow action details remains on the dom even
				// that node got deleted in clipboard due to reordering. Hence removing the propref and details div of that deleted node.
				this.gridObj.propRef = "";
				if (this.gridObj.gridDetailsDiv) {
					// EAS Bug Fix: added check for children before attempting to remove them. Failure to check this condition results in an unhandled exception
					//		in the navigation rule.
					if (this.gridObj.gridDetailsDiv.children.length > 0) {
						this.gridObj.gridDetailsDiv.removeChild(Dom.getFirstChild(this.gridObj.gridDetailsDiv));
					}
				}
			}
			if(this.gridObj.propRef) {
				//this.gridObj.jumpToIndex(null, this.gridObj.activeRow, "pyGridDetails");
				this.gridObj.jumpToIndex(null, this.gridObj.activeRow, this.templateName);

			}else {
				var argsObj = {rowEle: activeRowDOM};
				this.gridObj.triggerEditInHarness(argsObj);
			}
		},

		correctIndentation : function(srcEl,destLevel){
			var ul = Dom.getFirstChild(srcEl);
			ul.style.paddingLeft = (this.defPadding + (destLevel -1)*18)+"px";
			if(this.gridObj.bAlwaysExpandRoot) {
				/* When a node is dropped as a child at different level, decrement destLevel as the top level nodes doesn't have expand icon */
				destLevel = destLevel -1;
			}
			Dom.getFirstChild(ul).style.left = ((destLevel -1)*18)+"px";
		},

		moveChildren : function(srcEl) {
			var treeNode = Dom.getElementsById("gridNode", srcEl);
			if(treeNode && treeNode[0]) {
				treeNode = treeNode[0];
				var ulChildOne = Dom.getFirstChild(treeNode);
				if(ulChildOne) {
					var ulChildLast = Dom.getLastChild(treeNode);
					while(1) {
						var nextLastChild = Dom.getLastChild((ulChildLast));
						if((nextLastChild) && (nextLastChild.id=="gridNode") && Dom.getChildren(nextLastChild).length >0) {
							ulChildLast = Dom.getLastChild(nextLastChild);
						} else {
							break;
						}
					}
					var childOneId = ulChildOne.id;
					var childLastId = ulChildLast.id;

					var refRow = Dom.getElementsById(childOneId,this.gridObj.rightBodyTbl)[0];
					var rowIndex = refRow.rowIndex;

					var refRowLast = Dom.getElementsById(childLastId,this.gridObj.rightBodyTbl)[0];
					var rowIndexLast = refRowLast.rowIndex;

					var refTable = refRow.parentNode;
					var fixIndentation = false;
					if(this.srcLevel != this.destLevel) {
						fixIndentation = true;
						var correction = this.destLevel - this.srcLevel;
					}
					var rowsArr = new Array();
					for(var i=rowIndex; i<= rowIndexLast; i++) {
						rowsArr.push(refTable.rows[i]);
					}
					for(var i=0; i<rowsArr.length; i++) {
						var currRow = rowsArr[i];
						if(fixIndentation) {
							var leftRow = Dom.getElementsById(currRow.id,this.gridObj.leftBodyUL)[0];
							var level = this.getLevel(leftRow);
							level = level + correction;
							this.correctIndentation(leftRow,level);
						}
						Dom.insertAfter(currRow, this.nextTarget);
						this.nextTarget = currRow;
					}
				}
			}
		},

		updateHandlesAfterDD : function(args) {
			var srcIndex = args[0];
			var targetIndex = args[1];
			var mode=args[2];
			var srcEl = args[3];
			var destEl = args[4];
			var srcPLIndex = parseInt(srcEl.getAttribute("PL_INDEX"));
			var targetPLIndex = parseInt(destEl.getAttribute("PL_INDEX"));
            var dataSrcVal=this.gridObj.dataSourceRef;
            var tableRows = Dom.getChildrenBy(srcEl.parentNode);
			if (this.gridObj.bTreegrid || this.gridObj.fixedCol) {
				/*For the top level nodes, the first element in UL is header row. So, for all other levels start using children array with 0.*/
				if (srcEl.parentNode != this.gridObj.leftBodyUL) {
					srcPLIndex = srcPLIndex - 1;
					targetPLIndex = targetPLIndex - 1;
				}
			}
			if(srcPLIndex < targetPLIndex){
				if(mode=="before") {
					targetPLIndex = targetPLIndex-1;
				}
			}else{
				if(mode=="after") {
					targetPLIndex = parseInt(targetPLIndex)+1;
				}
			}
			var currHPref, prevHPref, newHPref, currIndex, prevIndex, newIndex, newId, prevId, newNum, prevNum = "";

			if(this.gridObj.currentPageIndex && this.gridObj.currentPageIndex!="" && this.gridObj.pyPaginateActivity=="" && this.gridObj.pageMode!="Progressive Load"
				&& !this.gridObj.bReportDefinition /*BUG-143333 : if RD bound grid, do not update the page indices based on the currentPageIndex and rangesize*/
			) {
				srcPLIndex = srcPLIndex - ((this.gridObj.currentPageIndex-1)*this.gridObj.rangeSize);
				targetPLIndex = targetPLIndex - ((this.gridObj.currentPageIndex-1)*this.gridObj.rangeSize);
			}
			if(this.gridObj.bDiscardInvisibleRows && this.gridObj.rightBodyTbl.rows.length > 1) {/* TASK-127357 */
				var first_pl_index = parseInt(this.gridObj.rightBodyTbl.rows[1].getAttribute("PL_INDEX"), 10);
				if(srcPLIndex < first_pl_index) {/* first_pl_index should be less than (srcPLIndex & targetPLIndex). If it is not assign the one(srcPLIndex OR targetPLIndex) which is less to first_pl_index */
					first_pl_index = srcPLIndex;
				}
				if(targetPLIndex < first_pl_index) {
					first_pl_index = targetPLIndex;
				}
				srcPLIndex = srcPLIndex - first_pl_index + 1;
				targetPLIndex = targetPLIndex - first_pl_index + 1;
			}
			var i = srcPLIndex;
			while(true) {
				if(!((srcPLIndex < targetPLIndex &&  i <= targetPLIndex )||(srcPLIndex > targetPLIndex && i >= targetPLIndex ))) {
					break;
				}
				if(this.gridObj.bTreegrid || this.gridObj.fixedCol) {
					var eachRow = tableRows[i];
				}
				else {
					var eachRow = tableRows[this.gridObj.getIndex(i)];
				}

				currHPref = eachRow.id;
				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE && currHPref==null) {
					continue;
				}

				var rightRows = Dom.getElementsById(eachRow.id, this.gridObj.rightBodyTbl);
				if(rightRows.length>1) {
					if(srcPLIndex <targetPLIndex)
						rightRow = rightRows[rightRows.length - 1 ];
					else
						rightRow = rightRows[0];

				}else {
					var rightRow = rightRows[0];
				}

				newHPref = prevHPref;
				prevHPref = currHPref;

				currIndex = eachRow.getAttribute("PL_INDEX");
				newIndex = prevIndex;
				prevIndex = currIndex;

				newNum = prevNum;
				prevNum = prevIndex;
				/*BUG-145723, BUG-147710 In case of pagination, discard invisible, the row number can't be calculated from the PLIndex, It must be calculated from the row number, span*/
				if(this.gridObj.pyPaginateActivity || this.gridObj.bDiscardInvisibleRows || (this.gridObj.pageMode != "Progressive Load" && parseInt(this.gridObj.currentPageIndex) > 1)) {
					/* advanced pagination activity is present hence the row number is not same as the PLIndex. Compute it from the pageIndex span */
					if(!this.gridObj.bTreegrid && this.gridObj.bNumberedSkin) {
						var prevNumEle = null;
						if(this.gridObj.fixedCol) {
							prevNumEle = pega.u.d.getNumberingElement(eachRow);
						}else {
							prevNumEle = pega.u.d.getNumberingElement(rightRow);
						}
						prevNum = prevNumEle.innerHTML;
					}
				}

				newId = prevId;
				prevId = eachRow.id;

				if(i == srcPLIndex) {
					var rowEle = null;
					if(this.gridObj.bTreegrid || this.gridObj.fixedCol) {
						rowEle = tableRows[targetPLIndex];
					}
					else {
						rowEle = tableRows[this.gridObj.getIndex(targetPLIndex)];
					}
					newHPref = rowEle.id;
					newIndex = rowEle.getAttribute("PL_INDEX");
					newId = newHPref;
					newNum = newIndex;
					/*BUG-145723, BUG-147710 In case of pagination, discard invisible, the row number can't be calculated from the PLIndex, It must be calculated from the row number, span*/
					if(this.gridObj.pyPaginateActivity || this.gridObj.bDiscardInvisibleRows || (this.gridObj.pageMode != "Progressive Load" && parseInt(this.gridObj.currentPageIndex) > 1)) {
						/* advanced pagination activity is present hence the row number is not same as the PLIndex. Compute it from the pageIndex span */
						if(!this.gridObj.bTreegrid && this.gridObj.bNumberedSkin) {
							var newNumEle = pega.u.d.getNumberingElement(rowEle);
							if(newNumEle) {
								newNum = newNumEle.innerHTML;
							}
						}
					}


				}

				if(!this.gridObj.bTreegrid && this.gridObj.bNumberedSkin) {
					if(this.gridObj.fixedCol) {
						pega.u.d.setLeftTableValues(eachRow,newNum);
					}else {
						pega.u.d.setLeftTableValues(rightRow,newNum);
					}
				}

				if(this.gridObj.editConfig==this.gridObj.EDIT_EXPANDPANE) {
					var detailsRow = Dom.getNextSibling(rightRow);
					var detailsDiv = pega.util.Dom.getElementsById("rowDetail"+currHPref, detailsRow, "DIV");
					if(detailsDiv && detailsDiv[0]) {
						if(detailsDiv.length>1) {
							if(srcPLIndex <targetPLIndex)
								detailsDiv = detailsDiv[detailsDiv.length - 1 ];
							else
								detailsDiv = detailsDiv[0];

						}else {
							detailsDiv = detailsDiv[0];
						}
					}
					if(detailsDiv){
						/* Bug-136545
						pega.u.d.updatePropertyRef(detailsDiv,prevHPref, newHPref);
						Replaced updatePropertyRef call(above) with updateInnerHTML as it does the same work again. Calling updatePropertyRef causing to loose edited input values.
						*/
						pega.u.d.updateInnerHTML(detailsDiv.parentNode.parentNode,prevHPref, newHPref);
						if(this.gridObj.propRef!="" && this.gridObj.propRef==pega.ui.property.toReference(prevHPref)){
							this.gridObj.propRef = pega.ui.property.toReference(newHPref);
						}
					}
				}
				/* Replace $ in currHPref with \$ for string replacement */
				currHPref = currHPref.replace(/\$/g, "\\$");
				/*Update LI handles for Treegrid and Grid with fixed column*/
				if(this.gridObj.bTreegrid || this.gridObj.fixedCol) {
					pega.u.d.updateHandles(eachRow,currHPref,newHPref, currIndex, newIndex, newId,dataSrcVal);
				}

					pega.u.d.updateHandles(rightRow,currHPref,newHPref, currIndex, newIndex, newId,dataSrcVal);


				var lastChild = Dom.getLastChild(eachRow);
				if(lastChild && lastChild.id=="gridNode") {
					this.gridObj.updateChildHandles(lastChild, newHPref, srcIndex, targetIndex, srcEl.id, dataSrcVal);
				}



				if(srcPLIndex < targetPLIndex)
					i++;
				else
					i--;
			}

			return false;
		},
		_resizeProxy: function() {
			if (this.resizeFrame) {
				var dragEl = this.getDragEl();
				Dom.addClass(dragEl, "dragProxy");
				dragEl.style.border = "1px solid #000000";
				dragEl.style.borderTop = "1px solid #c0c0c0";
				dragEl.style.borderLeft = "1px solid #c0c0c0";
				dragEl.style.height = "20px";
				dragEl.style.width = "auto";
				var firstCellVal = this.gridObj.getFirstCellVal();
				/*BUG-129051: used the script variable in _resizeProxy api.*/
				if(firstCellVal.indexOf("CONTROL_NOT_VISIBLE_IN_DDPROXY")!=-1){
					firstCellVal="";
				}
				dragEl.innerHTML = firstCellVal;
				dragEl.style.opacity = 0.8;
				dragEl.style.filter = 'alpha(opacity=' + 80 + ')';
			}
		},

		onMouseUp : function(e){
			if(this.lastHighlightedElements) {
				Dom.removeClass(this.lastHighlightedElements[0], "insertAfter");
				Dom.removeClass(this.lastHighlightedElements[0], "insertChild");
				Dom.removeClass(this.lastHighlightedElements[0], "insertBefore");
				Dom.removeClass(this.lastHighlightedElements[1], "insertAfter");
				Dom.removeClass(this.lastHighlightedElements[1], "insertChild");
				Dom.removeClass(this.lastHighlightedElements[1], "insertBefore");
			}
			this.bScrollGridUp = false;
			this.bScrollGridDown = false;
			this.unreg();
		}
	});




	pega.ui.gridColDD = function(id,assocId,masterDiv, gridObj){
		this.gridObj = gridObj;
		pega.ui.gridColDD.superclass.constructor.call(this,id,gridObj.gridDiv.id);
		this.masterDiv = masterDiv;
		this.goingLeft = false;
		this.lastX = 0;
		this.clickEl = null;
		this.table = id;
		this.clickIndex = 0;
		this.assocTable = assocId;
		this.assocClickIndex = 0;
		this.destIndex = 0;
		this.assocDestIndex = 0;
		this.lastDestEl = null;

	}
	pega.extend(pega.ui.gridColDD,pega.util.DDProxy, {

		findParentTD : function(srcElement){
			if(srcElement.nodeName.toLowerCase() == "td")
				return srcElement;
			var parent = srcElement.parentNode;
			while(parent && !parent.getElementById){
				if(parent.nodeName.toLowerCase() == "td" )
					return parent;
				parent = parent.parentNode;
			}
			return null;
		},

		calculateIndex : function(el){
			this.bFixedRow = (this.gridObj.fixedRow != false);
			this.bFixedColumn = (this.gridObj.fixedCol != false);
			var tableIndex = el.cellIndex;
			if(tableIndex % 2 == 0)
				return null;
			if(this.bFixedRow && this.bFixedColumn) {
				return [ [tableIndex,tableIndex],[(tableIndex+1)/2]] ;
			}else if(this.bFixedRow){
				return [[tableIndex,tableIndex],[(tableIndex+1)/2]];
			}else if(this.bFixedColumn){
				return [[tableIndex],[tableIndex,(tableIndex+1)/2]];
			}else{
				return [[tableIndex],[tableIndex,(tableIndex+1)/2]];
			}
		},

		onMouseDown : function(e) {
			this.__yui_events.mouseDownEvent.subscribe(this.onMouseDownEvent,this);
			this.fireEventsCopy = this.DDM.fireEvents;
			this.DDM.fireEvents = this.fireEventsCustom;
		},

		onMouseDownEvent : function(e){
			// make the proxy look like the source element
			var clickEl = Event.getTarget(e);
			this.clickEl = this.findParentTD(clickEl);
			clickEl = this.clickEl;
			if(!clickEl)
				return false;
			if(!Dom.isAncestor(this.table.rows[0],clickEl ))
				return false;

			var indArray = this.calculateIndex(clickEl);
			if(!indArray)
				return false;
			this.clickIndex = indArray[0][0];
			if(this.clickIndex == 0 || this.clickIndex == this.table.rows[0].cells.length - 1)
				return false;
			var aslen = indArray[1].length;
			this.assocClickIndex = indArray[1][aslen-1];
			var dragEl = this.getDragEl();
			this.initConstraints();
			this.deltaX = 0;
			this.deltaY = 0;
			this.deltaSetXY = [0,0];
			if(!this.insertIndicate.proxInitialized)
				this.insertIndicate.init(this);
		},

		insertIndicate : {

			init : function(obj){
				this.obj = obj;
				this.proxy = document.createElement("div");
				Dom.addClass(this.proxy,"col-move-up");
				document.body.insertBefore(this.proxy,document.body.firstChild);
				this.proxInitialized = true;
			},

			getEl : function(){
				return this.proxy;
			},


			show : function(){
				Dom.setStyle(this.proxy,"visibility","visible");
			},

			hide : function(){
				Dom.setStyle(this.proxy,"visibility","hidden");
			},

			setLeftTop : function(Lr,t) {
				var right = this.getEl();
				Dom.setXY(right, [Lr,t-4]);

			}

		},

		b4Drag : function(e){

			var El = Event.getTarget(e);

			var currentEl = this.findParentTD(El);
			if(Dom.isAncestor(this.table,currentEl )){
				if(currentEl)
					this.destEl = currentEl;
			}
			else{
				if(this.lastDestEl)
					this.destEl = this.lastDestEl;
			}

		},

		startDrag : function(x,y){
			//Dom.setStyle(this.clickEl, "visibility", "hidden");
		},

		initConstraints : function() {

			var gridDiv = this.table.parentNode;
			var H_CDiv =  pega.ctx.dom.getElementById('HARNESS_CONTENT');
			this.dragRegionH = gridDiv; //  The div gridHead_right region.
			var region = Dom.getRegion(this.dragRegionH);
			this.dragRegionH = this.assocTable.parentNode;
			var cells = this.table.rows[0].cells;
			this.lastCell = cells[cells.length-1];



			this.constrainX = true;
			this.minX = region.left + 5;
			this.maxX = region.right - (2* this.lastCell.offsetWidth + 15);

			this.dragRegionV = gridDiv; //  The div gridHead_right region.
			var region = Dom.getRegion(this.dragRegionV);
			this.constrainY = true;
			this.minY =  region.top;
			this.maxY = region.bottom;


		},

		_resizeProxy: function() {

			if (this.resizeFrame) {
				var el     = this.clickEl;
				var dragEl = this.getDragEl();

				var bt = parseInt( Dom.getStyle(dragEl, "borderTopWidth"    ), 10);
				var br = parseInt( Dom.getStyle(dragEl, "borderRightWidth"  ), 10);
				var bb = parseInt( Dom.getStyle(dragEl, "borderBottomWidth" ), 10);
				var bl = parseInt( Dom.getStyle(dragEl, "borderLeftWidth"   ), 10);

				if (isNaN(bt)) { bt = 0; }
				if (isNaN(br)) { br = 0; }
				if (isNaN(bb)) { bb = 0; }
				if (isNaN(bl)) { bl = 0; }

				var gridDiv = this.assocTable.parentNode;
				if(gridDiv.offsetHeight > this.assocTable.offsetHeight)
					var newHeight  = Math.max(0, this.assocTable.offsetHeight + this.table.offsetHeight - this.table.rows[0].offsetHeight);

				else
					var newHeight  = Math.max(0, gridDiv.offsetHeight - bt - bb + this.table.offsetHeight - this.table.rows[0].offsetHeight);


				Dom.setStyle( dragEl, "height",  newHeight  + "px" );
				Dom.setStyle( dragEl, "width", "42px" );
				Dom.addClass(dragEl,"dragChild");
				Dom.setStyle(dragEl,"cursor","default");

			}
		},



		onDrag: function(e) {

			// Keep track of the direction of the drag for use during onDragOver
			var x = Event.getPageX(e);
			var dragEl = this.getDragEl();

			var currentEl = this.destEl ;
			if(!currentEl)
				currentEl  = this.lastDestEl;

			if(!currentEl) return false;

			var indArray = this.calculateIndex(currentEl);
			if(!indArray) return false;
			var currentIndex = indArray[0][0];

			var aslen = indArray[1].length;
			var assocCurrentIndex = indArray[1][aslen - 1];
			//var region =  Dom.getRegion(this.dragRegion);
			var Row = this.table.rows[0];
			var assocRow = this.assocTable.rows[aslen];

			if (x < this.lastX) {
				this.goingLeft = true;
				Dom.setStyle(dragEl,"backgroundImage","url(images/pzdrag-left.png)");
			} else if (x > this.lastX) {
				this.goingLeft = false;
				Dom.setStyle(dragEl,"backgroundImage","url(images/pzdrag-right.png)");
			}

			/*
			@protected- Function description goes here.
			@return $undefined$ - return description goes here.
			*/
			function scrollingLeft(){
				if(assocCurrentIndex >= 1 && currentIndex >= 2 && !_this.stopScroll  && _this.startScroll ){

						_this.dragRegionH.scrollLeft -= assocRow.cells[assocCurrentIndex].offsetWidth;
						--assocCurrentIndex;
				}else{
					clearInterval(_this.timeToken);
				}
			}
			var cellLen = 0;
			if(assocRow) {
				cellLen = assocRow.cells.length -1;
			}
			/*
			@protected- Function description goes here.
			@return $undefined$ - return description goes here.
			*/
			function scrollingRight(){
				if(assocCurrentIndex + 1 <= cellLen && !_this.stopScroll  && _this.startScroll ){
					_this.dragRegionH.scrollLeft += assocRow.cells[assocCurrentIndex].offsetWidth;

					++assocCurrentIndex;

				}else{
					clearInterval(_this.timeToken);
				}
			}
			var _this = this;
			if (x  > this.maxX ){
					if(!this.startScroll)
						this.timeToken = setInterval(scrollingRight,200);
					this.startScroll  = true;
					this.stopScroll = false;

			}else if(x < this.minX ){
					if(!this.startScroll)
						this.timeToken =  setInterval(scrollingLeft,200);
					this.startScroll  = true;
					this.stopScroll = false;
			}else{
				this.stopScroll = true;
				this.startScroll  = false;

				if(!this.goingLeft ){
					this.applyBorder(currentIndex+1,x);
				}else if (this.goingLeft ){
					this.applyBorder(currentIndex-1,x);
				}


			}
			this.lastX = x;

		},

		applyBorder: function(index,x){
			var table = this.table;
			var firstRow = table.rows[0];

			if(index >=0){
				var currentCell = firstRow.cells[index];
				var region = Dom.getRegion(currentCell);

				if(region ){
					var dragEl = this.getDragEl();
					this.insertIndicate.setLeftTop(region.right + 4,region.top);
					this.insertIndicate.show();
					this.setDragElPos(x, region.bottom);
				}
				if(currentCell)
					this.lastDestEl = currentCell;


			}
		},
		onDragDrop: function(e, id) {
			var insert = false;
			var destEl = this.destEl;
			if(!destEl){
				return;
			}
			if (destEl && destEl.tagName && (destEl.tagName.toLowerCase() == 'td')) {
				insert = true;
				var indArray = this.calculateIndex(destEl);
				if(!indArray) return false;
				var destIndex = indArray[0][0];
				this.destIndex = destIndex;
				var aslen = indArray[1].length;
				var assocDestIndex = indArray[1][aslen - 1];
				this.assocDestIndex = assocDestIndex;
			}
			var index = this.clickIndex;

			var assocIndex = this.assocClickIndex;
			if(index == destIndex){
				return false;
			}
			for (var i = 0,len = this.assocTable.rows.length; i < len ; i++) {
				if( i < indArray[0].length) {
					if(!this.goingLeft){
						this.moveCell(this.table, i, index, destIndex+2, insert);
						if(destIndex < index )
							this.moveCell(this.table, i, index+1, destIndex+3, insert);
						else
							this.moveCell(this.table, i, index, destIndex+2, insert);
					}else if(this.goingLeft){
						this.moveCell(this.table, i, index, destIndex, insert);
						if(destIndex < index )
							this.moveCell(this.table, i, index+1, destIndex+1, insert);
						else
							this.moveCell(this.table, i, index, destIndex, insert);

					}
				}

				if(i == 0 ){
					/*if(!this.goingLeft){
						this.moveCell(this.table, i, index, destIndex+2, insert);
						if(destIndex < index )
							this.moveCell(this.table, i, index+1, destIndex+3, insert);
						else
							this.moveCell(this.table, i, index, destIndex+2, insert);
					}else if(this.goingLeft){
						this.moveCell(this.table, i, index, destIndex, insert);
						if(destIndex < index )
							this.moveCell(this.table, i, index+1, destIndex+1, insert);
						else
							this.moveCell(this.table, i, index, destIndex, insert);

					}*/
				}else{
					if(!this.goingLeft){
						this.moveCell(this.assocTable, i, assocIndex, assocDestIndex + 1, insert);
					}else if(this.goingLeft){
						this.moveCell(this.assocTable, i, assocIndex, assocDestIndex, insert);//TBD try calling only once and handle different cases.
					}
				}
			}
		},

		moveCell: function(table, i, index, newIndex, insert) {

			var moveTD = table.rows[i].cells[index];
			if (insert) {
					try{
						var toTD = table.rows[i].cells[newIndex];

						moveTD.parentNode.insertBefore(moveTD, toTD);
					}catch(e){}

			} else {
					//End of table
					setTimeout(function() {
						moveTD.parentNode.appendChild(moveTD);
						}, 0);
			}
		},

		endDrag: function(e) {
			var rows = this.assocTable.rows;

			var maxCols = rows[rows.length-1].cells.length -2;

			this.insertIndicate.hide();
			if ( this.destEl && this.destEl.nodeName.toLowerCase() == "td") {
				var baseRef = pega.u.d.getBaseRef(this.masterDiv);
				var url = SafeURL_createFromURL(pega.u.d.url);
				//url.put("PageName","");
				url.put("PageListProperty",this.assocTable.getAttribute("pl_prop"));
				url.put("BaseReference", baseRef);
				var assocDestIndex = (this.assocDestIndex == 0 ? this.assocClickIndex:this.assocDestIndex);
				if(this.assocClickIndex < this.assocDestIndex)
					if(this.goingLeft)
						assocDestIndex--;
				if(this.assocClickIndex > this.assocDestIndex)
					if(this.goingLeft)
						assocDestIndex+=0;
				if(assocDestIndex <=0 ) return false;
				if(assocDestIndex > maxCols) assocDestIndex = maxCols;
				url.put("TargetIndex",assocDestIndex);
				url.put("CurrentIndex",this.assocClickIndex);
				if(assocDestIndex == this.assocClickIndex){
					return false;
				}
				this.gridObj.markAsDirty();

				pega.u.d.reloadRepeatLayout('ReorderPageList',url.toQueryString(), e, null,this.masterDiv, null, true);

			}
		},

		onMouseUp : function(e){
			this.DDM.fireEvents = this.fireEventsCopy;

		},

		fireEventsCustom : function(e, isDrop) {
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

					if (oDD.isTarget && !oDD.isLocked() ) {
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
		}
		//this.assocEl = [];
	});
})();
//static-content-hash-trigger-YUI
/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/

/*
Changes:
1. TASK-14891: Commented out a code to fix the flickering issue in IE. This code is not present in yui 2.7
2. TASK-40549 : BUG-27518. I can't select this text in the name in order to copy and paste it. Removed the setting document onselectstart to false in the handleMouseDown API.
*/


/**
 * @description <p>Makes an element resizable</p>
 * @namespace pega.util
 * @requires pega, dom, dragdrop, element, event
 * @optional animation
 * @module resize
 * @beta
 */
(function() {
/*BUG-159902: Dev tip for the ENG-12590.*/
if(typeof(pega) == "undefined"){
     return;
}
var D = pega.util.Dom,
    Event = pega.util.Event,
    Lang = pega.lang;

    /**
     * @constructor
     * @class Resize
     * @extends pega.util.Element
     * @description <p>Makes an element resizable</p>
     * @param {String/HTMLElement} el The element to make resizable.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */

    var Resize = function(el, config) {
        var oConfig = {
            element: el,
            attributes: config || {}
        };
        Resize.superclass.constructor.call(this, oConfig.element, oConfig.attributes);    
    };

    /**
    * @private
    * @static
    * @property _instances
    * @description Internal hash table for all resize instances
    * @type Object
    */ 
    Resize._instances = {};
    /**
    * @static
    * @method getResizeById 
    * @description Get's a resize object by the HTML id of the element associated with the Resize object.
    * @return {Object} The Resize Object
    */ 
    Resize.getResizeById = function(id) {
        if (Resize._instances[id]) {
            return Resize._instances[id];
        }
        return false;
    };

    pega.extend(Resize, pega.util.Element, {
        /**
        * @private
        * @property CSS_RESIZE
        * @description Base CSS class name
        * @type String
        */ 
        CSS_RESIZE: 'yui-resize',
        /**
        * @private
        * @property CSS_DRAG
        * @description Class name added when dragging is enabled
        * @type String
        */ 
        CSS_DRAG: 'yui-draggable',
        /**
        * @private
        * @property CSS_HOVER
        * @description Class name used for hover only handles
        * @type String
        */ 
        CSS_HOVER: 'yui-resize-hover',
        /**
        * @private
        * @property CSS_PROXY
        * @description Class name given to the proxy element
        * @type String
        */ 
        CSS_PROXY: 'yui-resize-proxy',
        /**
        * @private
        * @property CSS_WRAP
        * @description Class name given to the wrap element
        * @type String
        */ 
        CSS_WRAP: 'yui-resize-wrap',
        /**
        * @private
        * @property CSS_KNOB
        * @description Class name used to make the knob style handles
        * @type String
        */ 
        CSS_KNOB: 'yui-resize-knob',
        /**
        * @private
        * @property CSS_HIDDEN
        * @description Class name given to the wrap element to make all handles hidden
        * @type String
        */ 
        CSS_HIDDEN: 'yui-resize-hidden',
        /**
        * @private
        * @property CSS_HANDLE
        * @description Class name given to all handles, used as a base for single handle names as well.. Handle "t" will get this.CSS_HANDLE + '-t' as well as this.CSS_HANDLE
        * @type String
        */ 
        CSS_HANDLE: 'yui-resize-handle',
        /**
        * @private
        * @property CSS_STATUS
        * @description Class name given to the status element
        * @type String
        */ 
        CSS_STATUS: 'yui-resize-status',
        /**
        * @private
        * @property CSS_GHOST
        * @description Class name given to the wrap element when the ghost property is active
        * @type String
        */ 
        CSS_GHOST: 'yui-resize-ghost',
        /**
        * @private
        * @property CSS_RESIZING
        * @description Class name given to the wrap element when a resize action is taking place.
        * @type String
        */ 
        CSS_RESIZING: 'yui-resize-resizing',
        /**
        * @private
        * @property _resizeEvent
        * @description The mouse event used to resize with
        * @type Event
        */ 
        _resizeEvent: null,
        /**
        * @private
        * @property dd
        * @description The <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> instance used if draggable is true
        * @type Object
        */ 
        dd: null,
        /** 
        * @private
        * @property browser
        * @description A copy of the pega.env.ua property
        * @type Object
        */
        browser: pega.env.ua,
        /** 
        * @private
        * @property _positioned
        * @description A flag to show if the element is absolutely positioned
        * @type Boolean
        */
        _positioned: null,
        /** 
        * @private
        * @property _dds
        * @description An Object containing references to all of the <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> instances used for the resize handles
        * @type Object
        */
        _dds: null,
        /** 
        * @private
        * @property _wrap
        * @description The HTML reference of the element wrapper
        * @type HTMLElement
        */
        _wrap: null,
        /** 
        * @private
        * @property _proxy
        * @description The HTML reference of the element proxy
        * @type HTMLElement
        */
        _proxy: null,
        /** 
        * @private
        * @property _handles
        * @description An object containing references to all of the resize handles.
        * @type Object
        */
        _handles: null,
        /** 
        * @private
        * @property _currentHandle
        * @description The string identifier of the currently active handle. e.g. 'r', 'br', 'tl'
        * @type String
        */
        _currentHandle: null,
        /** 
        * @private
        * @property _currentDD
        * @description A link to the currently active DD object
        * @type Object
        */
        _currentDD: null,
        /** 
        * @private
        * @property _cache
        * @description An lookup table containing key information for the element being resized. e.g. height, width, x position, y position, etc..
        * @type Object
        */
        _cache: null,
        /** 
        * @private
        * @property _active
        * @description Flag to show if the resize is active. Used for events.
        * @type Boolean
        */
        _active: null,
        /** 
        * @private
        * @method _createProxy
        * @description Creates the proxy element if the proxy config is true
        */
        _createProxy: function() {
            if (this.get('proxy')) {
                this._proxy = document.createElement('div');
                this._proxy.className = this.CSS_PROXY;
                this._proxy.style.height = this.get('element').clientHeight + 'px';
                this._proxy.style.width = this.get('element').clientWidth + 'px';
                this._wrap.parentNode.appendChild(this._proxy);
            } else {
                this.set('animate', false);
            }
        },
        /** 
        * @private
        * @method _createWrap
        * @description Creates the wrap element if the wrap config is true. It will auto wrap the following element types: img, textarea, input, iframe, select
        */
        _createWrap: function() {
            this._positioned = false;
            //Force wrap for elements that can't have children 
            switch (this.get('element').tagName.toLowerCase()) {
                case 'img':
                case 'textarea':
                case 'input':
                case 'iframe':
                case 'select':
                    this.set('wrap', true);
                    break;
            }
            if (this.get('wrap')) {
                this._wrap = document.createElement('div');
                this._wrap.id = this.get('element').id + '_wrap';
                this._wrap.className = this.CSS_WRAP;
                D.setStyle(this._wrap, 'width', this.get('width'));
                D.setStyle(this._wrap, 'height', this.get('height'));
                D.setStyle(this._wrap, 'z-index', this.getStyle('z-index'));
                this.setStyle('z-index', 0);
                var pos = D.getStyle(this.get('element'), 'position');
                D.setStyle(this._wrap, 'position', ((pos == 'static') ? 'relative' : pos));
                D.setStyle(this._wrap, 'top', D.getStyle(this.get('element'), 'top'));
                D.setStyle(this._wrap, 'left', D.getStyle(this.get('element'), 'left'));
                if (D.getStyle(this.get('element'), 'position') == 'absolute') {
                    this._positioned = true;
                    D.setStyle(this.get('element'), 'position', 'relative');
                    D.setStyle(this.get('element'), 'top', '0');
                    D.setStyle(this.get('element'), 'left', '0');
                }
                var par = this.get('element').parentNode;
                par.replaceChild(this._wrap, this.get('element'));
                this._wrap.appendChild(this.get('element'));
            } else {
                this._wrap = this.get('element');
                if (D.getStyle(this._wrap, 'position') == 'absolute') {
                    this._positioned = true;
                }
            }
            if (this.get('draggable')) {
                this._setupDragDrop();
            }
            if (this.get('hover')) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            if (this.get('knobHandles')) {
                D.addClass(this._wrap, this.CSS_KNOB);
            }
            if (this.get('hiddenHandles')) {
                D.addClass(this._wrap, this.CSS_HIDDEN);
            }
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @private
        * @method _setupDragDrop
        * @description Setup the <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> instance on the element
        */
        _setupDragDrop: function() {
            D.addClass(this._wrap, this.CSS_DRAG);
            this.dd = new pega.util.DD(this._wrap, this.get('id') + '-resize', { dragOnly: true });
            this.dd.on('dragEvent', function() {
                this.fireEvent('dragEvent', arguments);
            }, this, true);
        },
        /** 
        * @private
        * @method _createHandles
        * @description Creates the handles as specified in the config
        */
        _createHandles: function() {
            this._handles = {};
            this._dds = {};
            var h = this.get('handles');
            for (var i = 0; i < h.length; i++) {
                this._handles[h[i]] = document.createElement('div');
                this._handles[h[i]].id = D.generateId(this._handles[h[i]]);
                this._handles[h[i]].className = this.CSS_HANDLE + ' ' + this.CSS_HANDLE + '-' + h[i];
                var k = document.createElement('div');
                k.className = this.CSS_HANDLE + '-inner-' + h[i];
                this._handles[h[i]].appendChild(k);
                this._wrap.appendChild(this._handles[h[i]]);
                Event.on(this._handles[h[i]], 'mouseover', this._handleMouseOver, this, true);
                Event.on(this._handles[h[i]], 'mouseout', this._handleMouseOut, this, true);
                this._dds[h[i]] = new pega.util.DragDrop(this._handles[h[i]], this.get('id') + '-handle-' + h);
                this._dds[h[i]].setPadding(15, 15, 15, 15);
                this._dds[h[i]].on('startDragEvent', this._handleStartDrag, this._dds[h[i]], this);
                this._dds[h[i]].on('mouseDownEvent', this._handleMouseDown, this._dds[h[i]], this);
            }
            this._status = document.createElement('span');
            this._status.className = this.CSS_STATUS;
            document.body.insertBefore(this._status, document.body.firstChild);
        },
        /** 
        * @private
        * @method _ieSelectFix
        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer
        */
        _ieSelectFix: function() {
            return false;
        },
        /** 
        * @private
        * @property _ieSelectBack
        * @description We will hold a copy of the current "onselectstart" method on this property, and reset it after we are done using it.
        */
        _ieSelectBack: null,
        /** 
        * @private
        * @method _setAutoRatio
        * @param {Event} ev A mouse event.
        * @description This method checks to see if the "autoRatio" config is set. If it is, we will check to see if the "Shift Key" is pressed. If so, we will set the config ratio to true.
        */
        _setAutoRatio: function(ev) {
            if (this.get('autoRatio')) {
                if (ev && ev.shiftKey) {
                    //Shift Pressed
                    this.set('ratio', true);
                } else {
                    this.set('ratio', this._configs.ratio._initialConfig.value);
                }
            }
        },
        /** 
        * @private
        * @method _handleMouseDown
        * @param {Event} ev A mouse event.
        * @description This method preps the autoRatio on MouseDown.
        */
        _handleMouseDown: function(ev) {
            if (D.getStyle(this._wrap, 'position') == 'absolute') {
                this._positioned = true;
            }
            if (ev) {
                this._setAutoRatio(ev);
            }
            if (this.browser.ie) {
                this._ieSelectBack = document.body.onselectstart; 
            }
        },
        /** 
        * @private
        * @method _handleMouseOver
        * @param {Event} ev A mouse event.
        * @description Adds CSS class names to the handles
        */
        _handleMouseOver: function(ev) {
            //Internet Explorer needs this
            D.removeClass(this._wrap, this.CSS_RESIZE);
            if (this.get('hover')) {
                D.removeClass(this._wrap, this.CSS_HOVER);
            }
            var tar = Event.getTarget(ev);
            if (!D.hasClass(tar, this.CSS_HANDLE)) {
                tar = tar.parentNode;
            }
            if (D.hasClass(tar, this.CSS_HANDLE) && !this._active) {
                D.addClass(tar, this.CSS_HANDLE + '-active');
                for (var i in this._handles) {
                    if (Lang.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            D.addClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            break;
                        }
                    }
                }
            }

            //Internet Explorer needs this
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @private
        * @method _handleMouseOut
        * @param {Event} ev A mouse event.
        * @description Removes CSS class names to the handles
        */
        _handleMouseOut: function(ev) {
            //Internet Explorer needs this
            D.removeClass(this._wrap, this.CSS_RESIZE);
            if (this.get('hover') && !this._active) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            var tar = Event.getTarget(ev);
            if (!D.hasClass(tar, this.CSS_HANDLE)) {
                tar = tar.parentNode;
            }
            if (D.hasClass(tar, this.CSS_HANDLE) && !this._active) {
                D.removeClass(tar, this.CSS_HANDLE + '-active');
                for (var i in this._handles) {
                    if (Lang.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            D.removeClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            break;
                        }
                    }
                }
            }
            //Internet Explorer needs this
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @private
        * @method _handleStartDrag
        * @param {Object} args The args passed from the CustomEvent.
        * @param {Object} dd The <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> object we are working with.
        * @description Resizes the proxy, sets up the <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> handlers, updates the status div and preps the cache
        */
        _handleStartDrag: function(args, dd) {
            var tar = dd.getDragEl();
            if (D.hasClass(tar, this.CSS_HANDLE)) {
                if (D.getStyle(this._wrap, 'position') == 'absolute') {
                    this._positioned = true;
                }
                this._active = true;
                this._currentDD = dd;
                if (this._proxy) {
                    this._proxy.style.visibility = 'visible';
                    this._proxy.style.zIndex = '1000';
                    this._proxy.style.height = this.get('element').clientHeight + 'px';
                    this._proxy.style.width = this.get('element').clientWidth + 'px';
                }

                for (var i in this._handles) {
                    if (Lang.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            this._currentHandle = i;
                            var handle = '_handle_for_' + i;
                            D.addClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            dd.on('dragEvent', this[handle], this, true);
                            dd.on('mouseUpEvent', this._handleMouseUp, this, true);
                            break;
                        }
                    }
                }


                D.addClass(tar, this.CSS_HANDLE + '-active');

                if (this.get('proxy')) {
                    var xy = D.getXY(this.get('element'));
                    D.setXY(this._proxy, xy);
                    if (this.get('ghost')) {
                        this.addClass(this.CSS_GHOST);
                    }
                }
                D.addClass(this._wrap, this.CSS_RESIZING);
                this._setCache();
                this._updateStatus(this._cache.height, this._cache.width, this._cache.top, this._cache.left);
                this.fireEvent('startResize', { type: 'startresize', target: this});
            }
        },
        /** 
        * @private
        * @method _setCache
        * @description Sets up the this._cache hash table.
        */
        _setCache: function() {
            this._cache.xy = D.getXY(this._wrap);
            D.setXY(this._wrap, this._cache.xy);
			//BUG-106205 Need to get height without padding. Replaced with jQuery
            this._cache.height = $(this._configs.element.value).height()	//this.get('clientHeight');
            this._cache.width = $(this._configs.element.value).width();		//this.get('clientWidth');
            this._cache.start.height = this._cache.height;
            this._cache.start.width = this._cache.width;
            this._cache.start.top = this._cache.xy[1];
            this._cache.start.left = this._cache.xy[0];
            this._cache.top = this._cache.xy[1];
            this._cache.left = this._cache.xy[0];
            this.set('height', this._cache.height, true);
            this.set('width', this._cache.width, true);
        },
        /** 
        * @private
        * @method _handleMouseUp
        * @param {Event} ev A mouse event.
        * @description Cleans up listeners, hides proxy element and removes class names.
        */
        _handleMouseUp: function(ev) {
            this._active = false;

            var handle = '_handle_for_' + this._currentHandle;
            this._currentDD.unsubscribe('dragEvent', this[handle], this, true);
            this._currentDD.unsubscribe('mouseUpEvent', this._handleMouseUp, this, true);

            if (this._proxy) {
                this._proxy.style.visibility = 'hidden';
                this._proxy.style.zIndex = '-1';
                if (this.get('setSize')) {
                    this.resize(ev, this._cache.height, this._cache.width, this._cache.top, this._cache.left, true);
                } else {
                    this.fireEvent('resize', { ev: 'resize', target: this, height: this._cache.height, width: this._cache.width, top: this._cache.top, left: this._cache.left });
                }

                if (this.get('ghost')) {
                    this.removeClass(this.CSS_GHOST);
                }
            }

            if (this.get('hover')) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            if (this._status) {
                D.setStyle(this._status, 'display', 'none');
            }
            if (this.browser.ie) {
                document.body.onselectstart = this._ieSelectBack;
            }

            if (this.browser.ie) {
                D.removeClass(this._wrap, this.CSS_RESIZE);
            }

            for (var i in this._handles) {
                if (Lang.hasOwnProperty(this._handles, i)) {
                    D.removeClass(this._handles[i], this.CSS_HANDLE + '-active');
                }
            }
            if (this.get('hover') && !this._active) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            D.removeClass(this._wrap, this.CSS_RESIZING);

            D.removeClass(this._handles[this._currentHandle], this.CSS_HANDLE + '-' + this._currentHandle + '-active');
            D.removeClass(this._handles[this._currentHandle], this.CSS_HANDLE + '-active');

            if (this.browser.ie) {
                D.addClass(this._wrap, this.CSS_RESIZE);
            }

            this._resizeEvent = null;
            this._currentHandle = null;
            
            if (!this.get('animate')) {
                this.set('height', this._cache.height, true);
                this.set('width', this._cache.width, true);
            }

            this.fireEvent('endResize', { ev: 'endResize', target: this, height: this._cache.height, width: this._cache.width, top: this._cache.top, left: this._cache.left });
        },
        /** 
        * @private
        * @method _setRatio
        * @param {Number} h The height offset.
        * @param {Number} w The with offset.
        * @param {Number} t The top offset.
        * @param {Number} l The left offset.
        * @description Using the Height, Width, Top & Left, it recalcuates them based on the original element size.
        * @return {Array} The new Height, Width, Top & Left settings
        */
        _setRatio: function(h, w, t, l) {
            var oh = h, ow = w;
            if (this.get('ratio')) {
                var orgH = this._cache.height,
                    orgW = this._cache.width,
                    nh = parseInt(this.get('height'), 10),
                    nw = parseInt(this.get('width'), 10),
                    maxH = this.get('maxHeight'),
                    minH = this.get('minHeight'),
                    maxW = this.get('maxWidth'),
                    minW = this.get('minWidth');

                switch (this._currentHandle) {
                    case 'l':
                        h = nh * (w / nw);
                        h = Math.min(Math.max(minH, h), maxH);                        
                        w = nw * (h / nh);
                        t = (this._cache.start.top - (-((nh - h) / 2)));
                        l = (this._cache.start.left - (-((nw - w))));
                        break;
                    case 'r':
                        h = nh * (w / nw);
                        h = Math.min(Math.max(minH, h), maxH);                        
                        w = nw * (h / nh);
                        t = (this._cache.start.top - (-((nh - h) / 2)));
                        break;
                    case 't':
                        w = nw * (h / nh);
                        h = nh * (w / nw);
                        l = (this._cache.start.left - (-((nw - w) / 2)));
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                    case 'b':
                        w = nw * (h / nh);
                        h = nh * (w / nw);
                        l = (this._cache.start.left - (-((nw - w) / 2)));
                        break;
                    case 'bl':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left - (-((nw - w))));
                        break;
                    case 'br':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        break;
                    case 'tl':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left - (-((nw - w))));
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                    case 'tr':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left);
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                }
                oh = this._checkHeight(h);
                ow = this._checkWidth(w);
                if ((oh != h) || (ow != w)) {
                    t = 0;
                    l = 0;
                    if (oh != h) {
                        ow = this._cache.width;
                    }
                    if (ow != w) {
                        oh = this._cache.height;
                    }
                }
            }
            return [oh, ow, t, l];
        },
        /** 
        * @private
        * @method _updateStatus
        * @param {Number} h The new height setting.
        * @param {Number} w The new width setting.
        * @param {Number} t The new top setting.
        * @param {Number} l The new left setting.
        * @description Using the Height, Width, Top & Left, it updates the status element with the elements sizes.
        */
        _updateStatus: function(h, w, t, l) {
            if (this._resizeEvent && (!Lang.isString(this._resizeEvent))) {
                if (this.get('status')) {
                    D.setStyle(this._status, 'display', 'inline');
                }
                h = ((h === 0) ? this._cache.start.height : h);
                w = ((w === 0) ? this._cache.start.width : w);
                var h1 = parseInt(this.get('height'), 10),
                    w1 = parseInt(this.get('width'), 10);
                
                if (isNaN(h1)) {
                    h1 = parseInt(h, 10);
                }
                if (isNaN(w1)) {
                    w1 = parseInt(w, 10);
                }
                var diffH = (parseInt(h, 10) - h1);
                var diffW = (parseInt(w, 10) - w1);
                this._cache.offsetHeight = diffH;
                this._cache.offsetWidth = diffW;
                this._status.innerHTML = '<strong>' + parseInt(h, 10) + ' x ' + parseInt(w, 10) + '</strong><em>' + ((diffH > 0) ? '+' : '') + diffH + ' x ' + ((diffW > 0) ? '+' : '') + diffW + '</em>';
                D.setXY(this._status, [Event.getPageX(this._resizeEvent) + 12, Event.getPageY(this._resizeEvent) + 12]);
            }
        },
        /** 
        * @method reset
        * @description Resets the element to is start state.
        * @return {<a href="pega.util.Resize.html">pega.util.Resize</a>} The Resize instance
        */
        reset: function() {
            this.resize(null, this._cache.start.height, this._cache.start.width, this._cache.start.top, this._cache.start.left, true);
            return this;
        },
        /** 
        * @method resize
        * @param {Event} ev The mouse event.
        * @param {Number} h The new height setting.
        * @param {Number} w The new width setting.
        * @param {Number} t The new top setting.
        * @param {Number} l The new left setting.
        * @param {Boolean} force Resize the element (used for proxy resize).
        * @param {Boolean} silent Don't fire the beforeResize Event.
        * @description Resizes the element, wrapper or proxy based on the data from the handlers.
        * @return {<a href="pega.util.Resize.html">pega.util.Resize</a>} The Resize instance
        */
        resize: function(ev, h, w, t, l, force, silent) {
            this._resizeEvent = ev;
            var el = this._wrap, anim = this.get('animate'), set = true;
            if (this._proxy && !force) {
                el = this._proxy;
                anim = false;
            }
            this._setAutoRatio(ev);
            if (this._positioned) {
                if (this._proxy) {
                    t = this._cache.top - t;
                    l = this._cache.left - l;
                }
            }

            var ratio = this._setRatio(h, w, t, l);
            h = parseInt(ratio[0], 10);
            w = parseInt(ratio[1], 10);
            t = parseInt(ratio[2], 10);
            l = parseInt(ratio[3], 10);

            if (t == 0) {
                //No Offset, get from cache
                t = D.getY(el);
            }
            if (l == 0) {
                //No Offset, get from cache
                l = D.getX(el);
            }

            

            if (this._positioned) {
                if (this._proxy && force) {
                    if (!anim) {
                        el.style.top = this._proxy.style.top;
                        el.style.left = this._proxy.style.left;
                    } else {
                        t = this._proxy.style.top;
                        l = this._proxy.style.left;
                    }
                } else {
                    if (!this.get('ratio') && !this._proxy) {
                        t = this._cache.top + -(t);
                        l = this._cache.left + -(l);
                    }
                    if (t) {
                        if (this.get('minY')) {
                            if (t < this.get('minY')) {
                                t = this.get('minY');
                            }
                        }
                        if (this.get('maxY')) {
                            if (t > this.get('maxY')) {
                                t = this.get('maxY');
                            }
                        }
                    }
                    if (l) {
                        if (this.get('minX')) {
                            if (l < this.get('minX')) {
                                l = this.get('minX');
                            }
                        }
                        if (this.get('maxX')) {
                            if ((l + w) > this.get('maxX')) {
                                l = (this.get('maxX') - w);
                            }
                        }
                    }
                }
            }
            if (!silent) {
                var beforeReturn = this.fireEvent('beforeResize', { ev: 'beforeResize', target: this, height: h, width: w, top: t, left: l });
                if (beforeReturn === false) {
                    return false;
                }
            }

            this._updateStatus(h, w, t, l);

            if (this._positioned) {
                if (this._proxy && force) {
                    //Do nothing
                } else {
                    if (t) {
                        D.setY(el, t);
                        this._cache.top = t;
                    }
                    if (l) {
                        D.setX(el, l);
                        this._cache.left = l;
                    }
                }
            }
            if (h) {
                if (!anim) {
                    set = true;
                    if (this._proxy && force) {
                        if (!this.get('setSize')) {
                            set = false;
                        }
                    }
                    if (set) {
		      /* 
                        if (this.browser.ie > 6) {
                            if (h === this._cache.height) {
                                h = h + 1;
                            }
                        }
		      */
                        el.style.height = h + 'px';
                    }
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.get('element')) {
                            this.get('element').style.height = h + 'px';
                        }
                    }
                }
                this._cache.height = h;
            }
            if (w) {
                this._cache.width = w;
                if (!anim) {
                    set = true;
                    if (this._proxy && force) {
                        if (!this.get('setSize')) {
                            set = false;
                        }
                    }
                    if (set) {
                        el.style.width = w + 'px';
                    }
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.get('element')) {
                            this.get('element').style.width = w + 'px';
                        }
                    }
                }
            }
            if (anim) {
                if (pega.util.Anim) {
                    var _anim = new pega.util.Anim(el, {
                        height: {
                            to: this._cache.height
                        },
                        width: {
                            to: this._cache.width
                        }
                    }, this.get('animateDuration'), this.get('animateEasing'));
                    if (this._positioned) {
                        if (t) {
                            _anim.attributes.top = {
                                to: parseInt(t, 10)
                            };
                        }
                        if (l) {
                            _anim.attributes.left = {
                                to: parseInt(l, 10)
                            };
                        }
                    }

                    if (this._wrap != this.get('element')) {
                        _anim.onTween.subscribe(function() {
                            this.get('element').style.height = el.style.height;
                            this.get('element').style.width = el.style.width;
                        }, this, true);
                    }

                    _anim.onComplete.subscribe(function() {
                        this.set('height', h);
                        this.set('width', w);
                        this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w, top: t, left: l });
                    }, this, true);
                    _anim.animate();

                }
            } else {
                if (this._proxy && !force) {
                    this.fireEvent('proxyResize', { ev: 'proxyresize', target: this, height: h, width: w, top: t, left: l });
                } else {
                    this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w, top: t, left: l });
                }
            }
            return this;
        },
        /** 
        * @private
        * @method _handle_for_br
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Bottom Right handle.
        */
        _handle_for_br: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e);
            this.resize(args.e, (newH + 1), newW, 0, 0);
        },
        /** 
        * @private
        * @method _handle_for_bl
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Bottom Left handle.
        */
        _handle_for_bl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, 0, l);
        },
        /** 
        * @private
        * @method _handle_for_tl
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Top Left handle.
        */
        _handle_for_tl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, t, l);
        },
        /** 
        * @private
        * @method _handle_for_tr
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Top Right handle.
        */
        _handle_for_tr: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, newW, t, 0);
        },
        /** 
        * @private
        * @method _handle_for_r
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Right handle.
        */
        _handle_for_r: function(args) {
            this._dds.r.setYConstraint(0,0);
            var newW = this._setWidth(args.e);
            this.resize(args.e, 0, newW, 0, 0);
        },
        /** 
        * @private
        * @method _handle_for_l
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Left handle.
        */
        _handle_for_l: function(args) {
            this._dds.l.setYConstraint(0,0);
            var newW = this._setWidth(args.e, true);
            var l = (newW - this._cache.width);
            this.resize(args.e, 0, newW, 0, l);
        },
        /** 
        * @private
        * @method _handle_for_b
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Bottom handle.
        */
        _handle_for_b: function(args) {
            this._dds.b.setXConstraint(0,0);
            var newH = this._setHeight(args.e);
            this.resize(args.e, newH, 0, 0, 0);
        },
        /** 
        * @private
        * @method _handle_for_t
        * @param {Object} args The arguments from the CustomEvent.
        * @description Handles the sizes for the Top handle.
        */
        _handle_for_t: function(args) {
            this._dds.t.setXConstraint(0,0);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, 0, t, 0);
        },
        /** 
        * @private
        * @method _setWidth
        * @param {Event} ev The mouse event.
        * @param {Boolean} flip Argument to determine the direction of the movement.
        * @description Calculates the width based on the mouse event.
        * @return {Number} The new value
        */
        _setWidth: function(ev, flip) {
            var xy = this._cache.xy[0],
                w = this._cache.width,
                x = Event.getPageX(ev),
                nw = (x - xy);

                if (flip) {
                    nw = (xy - x) + parseInt(this.get('width'), 10);
                }
                
                nw = this._snapTick(nw, this.get('yTicks'));
                nw = this._checkWidth(nw);
            return nw;
        },
        /** 
        * @private
        * @method _checkWidth
        * @param {Number} w The width to check.
        * @description Checks the value passed against the maxWidth and minWidth.
        * @return {Number} the new value
        */
        _checkWidth: function(w) {
            if (this.get('minWidth')) {
                if (w <= this.get('minWidth')) {
                    w = this.get('minWidth');
                }
            }
            if (this.get('maxWidth')) {
                if (w >= this.get('maxWidth')) {
                    w = this.get('maxWidth');
                }
            }
            return w;
        },
        /** 
        * @private
        * @method _checkHeight
        * @param {Number} h The height to check.
        * @description Checks the value passed against the maxHeight and minHeight.
        * @return {Number} The new value
        */
        _checkHeight: function(h) {
            if (this.get('minHeight')) {
                if (h <= this.get('minHeight')) {
                    h = this.get('minHeight');
                }
            }
            if (this.get('maxHeight')) {
                if (h >= this.get('maxHeight')) {
                    h = this.get('maxHeight');
                }
            }
            return h;
        },
        /** 
        * @private
        * @method _setHeight
        * @param {Event} ev The mouse event.
        * @param {Boolean} flip Argument to determine the direction of the movement.
        * @description Calculated the height based on the mouse event.
        * @return {Number} The new value
        */
        _setHeight: function(ev, flip) {
            var xy = this._cache.xy[1],
                h = this._cache.height,
                y = Event.getPageY(ev),
                nh = (y - xy);

                if (flip) {
                    nh = (xy - y) + parseInt(this.get('height'), 10);
                }
                nh = this._snapTick(nh, this.get('xTicks'));
                nh = this._checkHeight(nh);
                
            return nh;
        },
        /** 
        * @private
        * @method _snapTick
        * @param {Number} size The size to tick against.
        * @param {Number} pix The tick pixels.
        * @description Adjusts the number based on the ticks used.
        * @return {Number} the new snapped position
        */
        _snapTick: function(size, pix) {
            if (!size || !pix) {
                return size;
            }
            var _s = size;
            var _x = size % pix;
            if (_x > 0) {
                if (_x > (pix / 2)) {
                    _s = size + (pix - _x);
                } else {
                    _s = size - _x;
                }
            }
            return _s;
        },
        /** 
        * @private
        * @method init
        * @description The Resize class's initialization method
        */        
        init: function(p_oElement, p_oAttributes) {
            this._cache = {
                xy: [],
                height: 0,
                width: 0,
                top: 0,
                left: 0,
                offsetHeight: 0,
                offsetWidth: 0,
                start: {
                    height: 0,
                    width: 0,
                    top: 0,
                    left: 0
                }
            };

            Resize.superclass.init.call(this, p_oElement, p_oAttributes);

            this.set('setSize', this.get('setSize'));

            if (p_oAttributes.height) {
                this.set('height', parseInt(p_oAttributes.height, 10));
            }
            if (p_oAttributes.width) {
                this.set('width', parseInt(p_oAttributes.width, 10));
            }
            
            var id = p_oElement;
            if (!Lang.isString(id)) {
                id = D.generateId(id);
            }
            Resize._instances[id] = this;

            this._active = false;
            
            this._createWrap();
            this._createProxy();
            this._createHandles();

        },
        /**
        * @method getProxyEl
        * @description Get the HTML reference for the proxy, returns null if no proxy.
        * @return {HTMLElement} The proxy element
        */      
        getProxyEl: function() {
            return this._proxy;
        },
        /**
        * @method getWrapEl
        * @description Get the HTML reference for the wrap element, returns the current element if not wrapped.
        * @return {HTMLElement} The wrap element
        */      
        getWrapEl: function() {
            return this._wrap;
        },
        /**
        * @method getStatusEl
        * @description Get the HTML reference for the status element.
        * @return {HTMLElement} The status element
        */      
        getStatusEl: function() {
            return this._status;
        },
        /**
        * @method getActiveHandleEl
        * @description Get the HTML reference for the currently active resize handle.
        * @return {HTMLElement} The handle element that is active
        */      
        getActiveHandleEl: function() {
            return this._handles[this._currentHandle];
        },
        /**
        * @method isActive
        * @description Returns true or false if a resize operation is currently active on the element.
        * @return {Boolean}
        */      
        isActive: function() {
            return ((this._active) ? true : false);
        },
        /**
        * @private
        * @method initAttributes
        * @description Initializes all of the configuration attributes used to create a resizable element.
        * @param {Object} attr Object literal specifying a set of 
        * configuration attributes used to create the utility.
        */      
        initAttributes: function(attr) {
            Resize.superclass.initAttributes.call(this, attr);

            /**
            * @attribute setSize
            * @description Set the size of the resized element, if set to false the element will not be auto resized,
            * the resize event will contain the dimensions so the end user can resize it on their own.
            * This setting will only work with proxy set to true and animate set to false.
            * @type Boolean
            */
            this.setAttributeConfig('setSize', {
                value: ((attr.setSize === false) ? false : true),
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute wrap
            * @description Should we wrap the element
            * @type Boolean
            */
            this.setAttributeConfig('wrap', {
                writeOnce: true,
                validator: pega.lang.isBoolean,
                value: attr.wrap || false
            });

            /**
            * @attribute handles
            * @description The handles to use (any combination of): 't', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr'. Defaults to: ['r', 'b', 'br'].
            * Can use a shortcut of All. Note: 8 way resizing should be done on an element that is absolutely positioned.
            * @type Array
            */
            this.setAttributeConfig('handles', {
                writeOnce: true,
                value: attr.handles || ['r', 'b', 'br'],
                validator: function(handles) {
                    if (Lang.isString(handles) && handles.toLowerCase() == 'all') {
                        handles = ['t', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr'];
                    }
                    if (!Lang.isArray(handles)) {
                        handles = handles.replace(/, /g, ',');
                        handles = handles.split(',');
                    }
                    this._configs.handles.value = handles;
                }
            });

            /**
            * @attribute width
            * @description The width of the element
            * @type Number
            */
            this.setAttributeConfig('width', {
                value: attr.width || parseInt(this.getStyle('width'), 10),
                validator: pega.lang.isNumber,
                method: function(width) {
                    width = parseInt(width, 10);
                    if (width > 0) {
                        if (this.get('setSize')) {
                            this.setStyle('width', width + 'px');
                        }
                        this._cache.width = width;
                        this._configs.width.value = width;
                    }
                }
            });

            /**
            * @attribute height
            * @description The height of the element
            * @type Number
            */
            this.setAttributeConfig('height', {
                value: attr.height || parseInt(this.getStyle('height'), 10),
                validator: pega.lang.isNumber,
                method: function(height) {
                    height = parseInt(height, 10);
                    if (height > 0) {
                        if (this.get('setSize')) {
                            this.setStyle('height', height + 'px');
                        }
                        this._cache.height = height;
                        this._configs.height.value = height;
                    }
                }
            });

            /**
            * @attribute minWidth
            * @description The minimum width of the element
            * @type Number
            */
            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || 15,
                validator: pega.lang.isNumber
            });

            /**
            * @attribute minHeight
            * @description The minimum height of the element
            * @type Number
            */
            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || 15,
                validator: pega.lang.isNumber
            });

            /**
            * @attribute maxWidth
            * @description The maximum width of the element
            * @type Number
            */
            this.setAttributeConfig('maxWidth', {
                value: attr.maxWidth || 10000,
                validator: pega.lang.isNumber
            });

            /**
            * @attribute maxHeight
            * @description The maximum height of the element
            * @type Number
            */
            this.setAttributeConfig('maxHeight', {
                value: attr.maxHeight || 10000,
                validator: pega.lang.isNumber
            });

            /**
            * @attribute minY
            * @description The minimum y coord of the element
            * @type Number
            */
            this.setAttributeConfig('minY', {
                value: attr.minY || false
            });

            /**
            * @attribute minX
            * @description The minimum x coord of the element
            * @type Number
            */
            this.setAttributeConfig('minX', {
                value: attr.minX || false
            });
            /**
            * @attribute maxY
            * @description The max y coord of the element
            * @type Number
            */
            this.setAttributeConfig('maxY', {
                value: attr.maxY || false
            });

            /**
            * @attribute maxX
            * @description The max x coord of the element
            * @type Number
            */
            this.setAttributeConfig('maxX', {
                value: attr.maxX || false
            });

            /**
            * @attribute animate
            * @description Should be use animation to resize the element (can only be used if we use proxy).
            * @type Boolean
            */
            this.setAttributeConfig('animate', {
                value: attr.animate || false,
                validator: function(value) {
                    var ret = true;
                    if (!pega.util.Anim) {
                        ret = false;
                    }
                    return ret;
                }               
            });

            /**
            * @attribute animateEasing
            * @description The Easing to apply to the animation.
            * @type Object
            */
            this.setAttributeConfig('animateEasing', {
                value: attr.animateEasing || function() {
                    var easing = false;
                    try {
                        easing = pega.util.Easing.easeOut;
                    } catch (e) {}
                    return easing;
                }()
            });

            /**
            * @attribute animateDuration
            * @description The Duration to apply to the animation.
            * @type Number
            */
            this.setAttributeConfig('animateDuration', {
                value: attr.animateDuration || 0.5
            });

            /**
            * @attribute proxy
            * @description Resize a proxy element instead of the real element.
            * @type Boolean
            */
            this.setAttributeConfig('proxy', {
                value: attr.proxy || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute ratio
            * @description Maintain the element's ratio when resizing.
            * @type Boolean
            */
            this.setAttributeConfig('ratio', {
                value: attr.ratio || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute ghost
            * @description Apply an opacity filter to the element being resized (only works with proxy).
            * @type Boolean
            */
            this.setAttributeConfig('ghost', {
                value: attr.ghost || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute draggable
            * @description A convienence method to make the element draggable
            * @type Boolean
            */
            this.setAttributeConfig('draggable', {
                value: attr.draggable || false,
                validator: pega.lang.isBoolean,
                method: function(dd) {
                    if (dd && this._wrap) {
                        this._setupDragDrop();
                    } else {
                        if (this.dd) {
                            D.removeClass(this._wrap, this.CSS_DRAG);
                            this.dd.unreg();
                        }
                    }
                }
            });

            /**
            * @attribute hover
            * @description Only show the handles when they are being moused over.
            * @type Boolean
            */
            this.setAttributeConfig('hover', {
                value: attr.hover || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute hiddenHandles
            * @description Don't show the handles, just use the cursor to the user.
            * @type Boolean
            */
            this.setAttributeConfig('hiddenHandles', {
                value: attr.hiddenHandles || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute knobHandles
            * @description Use the smaller handles, instead if the full size handles.
            * @type Boolean
            */
            this.setAttributeConfig('knobHandles', {
                value: attr.knobHandles || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute xTicks
            * @description The number of x ticks to span the resize to.
            * @type Number or False
            */
            this.setAttributeConfig('xTicks', {
                value: attr.xTicks || false
            });

            /**
            * @attribute yTicks
            * @description The number of y ticks to span the resize to.
            * @type Number or False
            */
            this.setAttributeConfig('yTicks', {
                value: attr.yTicks || false
            });

            /**
            * @attribute status
            * @description Show the status (new size) of the resize.
            * @type Boolean
            */
            this.setAttributeConfig('status', {
                value: attr.status || false,
                validator: pega.lang.isBoolean
            });

            /**
            * @attribute autoRatio
            * @description Using the shift key during a resize will toggle the ratio config.
            * @type Boolean
            */
            this.setAttributeConfig('autoRatio', {
                value: attr.autoRatio || false,
                validator: pega.lang.isBoolean
            });

        },
        /**
        * @method destroy
        * @description Destroys the resize object and all of it's elements & listeners.
        */        
        destroy: function() {
            var k =  this.get('id') + '-handle-' + this.get('handles');
            for (var h in this._handles) {
                if (Lang.hasOwnProperty(this._handles, h)) {
                    Event.purgeElement(this._handles[h]);
                     if(this._handles[h].parentNode){
                       this._handles[h].parentNode.removeChild(this._handles[h]);
                     }
                     else{
                       delete this._handles[h];
                     }
                    this._dds[h].removeFromGroup(k);
                }
            }
            if (this._proxy) {
                if(this._proxy.parentNode){
                  this._proxy.parentNode.removeChild(this._proxy);
                }
                else{
                  delete this._proxy;
                }
            }
            if (this._status) {
                if(this._status.parentNode){
                  this._status.parentNode.removeChild(this._status);
                }
                else{
                  delete this._status;
                }
            }
            if (this.dd) {
                this.dd.unreg();
                D.removeClass(this._wrap, this.CSS_DRAG);
            }
            if (this._wrap != this.get('element')) {
                this.setStyle('position', '');
                this.setStyle('top', '');
                this.setStyle('left', '');
                if(this._wrap.parentNode){
                  this._wrap.parentNode.replaceChild(this.get('element'), this._wrap);
                }
            }
            this.removeClass(this.CSS_RESIZE);

            delete pega.util.Resize._instances[this.get('id')];
            //Brutal Object Destroy
            for (var i in this) {
                if (Lang.hasOwnProperty(this, i)) {
                    this[i] = null;
                    delete this[i];
                }
            }
        },
        /**
        * @method toString
        * @description Returns a string representing the Resize Object.
        * @return {String}
        */        
        toString: function() {
            if (this.get) {
                return 'Resize (#' + this.get('id') + ')';
            }
            return 'Resize Utility';
        }
    });

    pega.util.Resize = Resize;
 
/**
* @event dragEvent
* @description Fires when the <a href="pega.util.DragDrop.html">pega.util.DragDrop</a> dragEvent is fired for the config option draggable.
* @type pega.util.CustomEvent
*/
/**
* @event startResize
* @description Fires when when a resize action is started.
* @type pega.util.CustomEvent
*/
/**
* @event endResize
* @description Fires when the mouseUp event from the Drag Instance fires.
* @type pega.util.CustomEvent
*/
/**
* @event resize
* @description Fires on every element resize (only fires once when used with proxy config setting).
* @type pega.util.CustomEvent
*/
/**
* @event beforeResize
* @description Fires before every element resize after the size calculations, returning false will stop the resize.
* @type pega.util.CustomEvent
*/
/**
* @event proxyResize
* @description Fires on every proxy resize (only fires when used with proxy config setting).
* @type pega.util.CustomEvent
*/

})();
/*BUG-159902: Dev tip for the ENG-12590.*/
if(typeof(pega) != "undefined"){
	pega.register("resize", pega.util.Resize, {version: "2.5.2", build: "1076"});
}
//static-content-hash-trigger-GCC
