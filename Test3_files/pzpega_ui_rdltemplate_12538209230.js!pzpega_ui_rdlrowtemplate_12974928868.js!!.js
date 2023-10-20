/*

<div {{{pyInspectorMetaData}}} {{pyRelativePath}} style='{{pyInlineStyle}}' data-uniqueid='{{pyUniqueID}}' class='{{pyCustomClass}}' data-repeat-source='{{originalDataSource}}'
data-path='{{metadata.path}}'
bsimplelayout = 'true' data-rowmethodname = '{{pyRowMethodName}}' 
{{#if pyRDLShowDetails}}
    data-details-flowaction = '{{pyRDLDetailsFlowAction}}'
  data-click = '[["editRepeatItem",[":event"]]]'
{{/if}}

{{#if pyIsRDLWOBound}}
    data-classinfo = '{"classFamily":"{{pyParentClass}}","isCaseOfflinable":"{{pyIsCaseOfflinable}}"}'
{{/if}}
{{#if pyRDLPageSize}}
    data-pagesize = '{{pyRDLPageSize}}'
{{/if}}
{{#if pyNextPageMethodName}}
  data-nextpagemethod = '{{pyNextPageMethodName}}'
{{/if}}
{{#if pyNoMoreDataSecRef}}
  data-nomoredatasection = {{pyNoMoreDataSecRef}}
{{/if}}
{{#if pyNoMoreDataFV}}
  data-nomoredatafv = "{{pyNoMoreDataFV}}"
{{/if}}
data-template

{{#ifCond pyAutomationId '!=' ""}}
  {{pyAutomationId}}
{{/ifCond}}

{{#ifCond pyEnableSwipe '==' "true"}}
  data-swipeable='true'
{{/ifCond}}

aria-describedby='summaryIdentifier-{{pyUniqueID}}'
>
{{! Invoke row partial}}

{{#if bRDLCategorized}}
{{~> pzRDLRowCategorizedTemplate~}}
{{else}}
{{~> pzRDLRowTemplate~}}
{{/if}}

</div>
<div id='summaryIdentifier-{{pyUniqueID}}' aria-label='{{summary}}' ></div>
<div role='region' id='rdlRegion-{{pyUniqueID}}' aria-live='assertive' ></div>

*/

/* Compiled Template */
/* istanbul ignore next */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzRDLTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    data-details-flowaction = '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRDLDetailsFlowAction") || (depth0 != null ? lookupProperty(depth0,"pyRDLDetailsFlowAction") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRDLDetailsFlowAction","hash":{},"data":data,"loc":{"start":{"line":5,"column":31},"end":{"line":5,"column":57}}}) : helper)))
    + "'\n  data-click = '[[\"editRepeatItem\",[\":event\"]]]'\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    data-classinfo = '{\"classFamily\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParentClass") || (depth0 != null ? lookupProperty(depth0,"pyParentClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParentClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":38},"end":{"line":10,"column":55}}}) : helper)))
    + "\",\"isCaseOfflinable\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyIsCaseOfflinable") || (depth0 != null ? lookupProperty(depth0,"pyIsCaseOfflinable") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyIsCaseOfflinable","hash":{},"data":data,"loc":{"start":{"line":10,"column":77},"end":{"line":10,"column":99}}}) : helper)))
    + "\"}'\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    data-pagesize = '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRDLPageSize") || (depth0 != null ? lookupProperty(depth0,"pyRDLPageSize") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRDLPageSize","hash":{},"data":data,"loc":{"start":{"line":13,"column":21},"end":{"line":13,"column":38}}}) : helper)))
    + "'\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  data-nextpagemethod = '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyNextPageMethodName") || (depth0 != null ? lookupProperty(depth0,"pyNextPageMethodName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyNextPageMethodName","hash":{},"data":data,"loc":{"start":{"line":16,"column":25},"end":{"line":16,"column":49}}}) : helper)))
    + "'\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  data-nomoredatasection = "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyNoMoreDataSecRef") || (depth0 != null ? lookupProperty(depth0,"pyNoMoreDataSecRef") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyNoMoreDataSecRef","hash":{},"data":data,"loc":{"start":{"line":19,"column":27},"end":{"line":19,"column":49}}}) : helper)))
    + "\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  data-nomoredatafv = \""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyNoMoreDataFV") || (depth0 != null ? lookupProperty(depth0,"pyNoMoreDataFV") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyNoMoreDataFV","hash":{},"data":data,"loc":{"start":{"line":22,"column":23},"end":{"line":22,"column":41}}}) : helper)))
    + "\"\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":27,"column":2},"end":{"line":27,"column":20}}}) : helper)))
    + "\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "  data-swipeable='true'\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pzRDLRowCategorizedTemplate"),depth0,{"name":"pzRDLRowCategorizedTemplate","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pzRDLRowTemplate"),depth0,{"name":"pzRDLRowTemplate","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyInspectorMetaData") || (depth0 != null ? lookupProperty(depth0,"pyInspectorMetaData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInspectorMetaData","hash":{},"data":data,"loc":{"start":{"line":1,"column":5},"end":{"line":1,"column":30}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRelativePath") || (depth0 != null ? lookupProperty(depth0,"pyRelativePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativePath","hash":{},"data":data,"loc":{"start":{"line":1,"column":31},"end":{"line":1,"column":49}}}) : helper)))
    + " style='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInlineStyle") || (depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInlineStyle","hash":{},"data":data,"loc":{"start":{"line":1,"column":57},"end":{"line":1,"column":74}}}) : helper)))
    + "' data-uniqueid='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":1,"column":91},"end":{"line":1,"column":105}}}) : helper)))
    + "' class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomClass") || (depth0 != null ? lookupProperty(depth0,"pyCustomClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":114},"end":{"line":1,"column":131}}}) : helper)))
    + "' data-repeat-source='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"originalDataSource") || (depth0 != null ? lookupProperty(depth0,"originalDataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"originalDataSource","hash":{},"data":data,"loc":{"start":{"line":1,"column":153},"end":{"line":1,"column":175}}}) : helper)))
    + "'\ndata-path='"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"metadata") : depth0)) != null ? lookupProperty(stack1,"path") : stack1), depth0))
    + "'\nbsimplelayout = 'true' data-rowmethodname = '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRowMethodName") || (depth0 != null ? lookupProperty(depth0,"pyRowMethodName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRowMethodName","hash":{},"data":data,"loc":{"start":{"line":3,"column":45},"end":{"line":3,"column":64}}}) : helper)))
    + "' \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRDLShowDetails") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsRDLWOBound") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRDLPageSize") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyNextPageMethodName") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":17,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyNoMoreDataSecRef") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":0},"end":{"line":20,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyNoMoreDataFV") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":23,"column":7}}})) != null ? stack1 : "")
    + "data-template\n\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":0},"end":{"line":28,"column":11}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyEnableSwipe") : depth0),"==","true",{"name":"ifCond","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":0},"end":{"line":32,"column":11}}})) != null ? stack1 : "")
    + "\naria-describedby='summaryIdentifier-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":34,"column":36},"end":{"line":34,"column":50}}}) : helper)))
    + "'\n>\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bRDLCategorized") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":38,"column":0},"end":{"line":42,"column":7}}})) != null ? stack1 : "")
    + "\n</div>\n<div id='summaryIdentifier-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":45,"column":27},"end":{"line":45,"column":41}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"summary") || (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"summary","hash":{},"data":data,"loc":{"start":{"line":45,"column":55},"end":{"line":45,"column":66}}}) : helper)))
    + "' ></div>\n<div role='region' id='rdlRegion-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":46,"column":33},"end":{"line":46,"column":47}}}) : helper)))
    + "' aria-live='assertive' ></div>\n";
},"usePartial":true,"useData":true});
})();

  /* End of RDL Template */

	pega.ui.template.pzRDLTemplate = {
		getRowArray: function(dataSource, startIndex) {
			var dsArr = new Array();
			if (dataSource.pxResults) {
				dsArr = dataSource.pxResults;
			} else if (dataSource.iterator) {
				var iter = dataSource.iterator();
				while (iter.hasNext()) {
					dsArr.push(iter.next(startIndex));
				}
			} else { /*in some cases, ClientCache.find(...) returns a single element, without being wrapped in an array*/
				dsArr.push(dataSource);
			}
			return dsArr
		},
	
		loadPage: function(startIndex, pageCount, RDLNode, event, callback,fromFetchAndAppend) {
			var dataSource = RDLNode.getAttribute('data-repeat-source');
	    var pyUniqueId = RDLNode.getAttribute('data-uniqueid');
			var isLargeDP = false;
			var dpName = dataSource.substring(0, dataSource.indexOf("."));
			var isLargeDP = pega.ui.ClientCache.isLargeDatapage(dpName);
			var endIndex;
      // get live region
      //Adding a safe check for the RDLNode.ParentElement because if it is null then querySelectory method is not available and throws an error
      var existingLiveRegion = RDLNode.parentElement && RDLNode.parentElement.querySelector('[id="rdlRegion-'+pyUniqueId+'"]');
      if(existingLiveRegion) existingLiveRegion.setAttribute('title', '');
			/* Fetch the pageList with the required set of rows. */
			/* Set the start and endIndex. */
			startIndex = parseInt(startIndex);
			pageCount = parseInt(pageCount);
			endIndex = startIndex + pageCount - 1; /* BUG-379365 */
			if(pageCount == -1) endIndex = -1;
			
			var options = {
				startIndex: startIndex,
				endIndex: endIndex,
				pageCount:pageCount
			};
			if(fromFetchAndAppend) options.fromFetchAndAppend = fromFetchAndAppend;  
			var callbackObj = {
			  success: function(responseObj){
        if(existingLiveRegion) existingLiveRegion.setAttribute('title', rdlNewRecordsMessage);
				/* Check if there are any errors and do not proceed with page rendering */
				var reloadElement = responseObj.argument[0];
				/* Check for exceptions and abort if any are found */
				if (pega.u.d.checkExceptions(responseObj.responseText, reloadElement)) {
				  pega.u.d.inCall = false;
				  if (pega.u.d.changeInEventsArray) pega.u.d.changeInEventsArray.fire();
				  pega.u.d.gBusyInd.hide();
				  return;
				}                        
				if(pega.u.d.handleErrorAfterPartialSuccess(responseObj)){
				  pega.u.d.inCall = false;
				  if (pega.u.d.changeInEventsArray) pega.u.d.changeInEventsArray.fire();
				  pega.u.d.gBusyInd.hide();
				  return;
				}
				if(!isLargeDP) {
				  pega.ui.template.pzRDLTemplate.loadNextPage(responseObj.responseText,RDLNode,callback,options);
				}
				responseObj.argument = null;
				pega.u.d.gBusyInd.hide();
			  },
			  failure: function(){
				console.log("Pagination failed");
			  }
			};
		  
		  var oArgs = {
				"strReloadType": "partial-refresh",
				"reloadElement": RDLNode,
				"bFormSubmit": false,
				"bSectionSubmit": false,
				"event" : event,
				"callback": callbackObj,
				"preActivity": "pzInvokeRDLPreProcessing" /*BUG-381209: Tagging the extension point activity to the reload infrastructure*/
			  };
		  if(pega.u.d.ServerProxy.isDestinationLocal()) {
			oArgs.partialMetadataPath = RDLNode.getAttribute("data-path"); /* partialMetadataPath is used in renderUI callback to retrive partial metadata. */
			oArgs.generateMetadataFn = function(rdlMetadata) { /* Partial metadata retrieved from partialMetadataPath is passed to this method. This method updates the metadata with next page info and keeps the metadata inline to "nextPage" renderer. */
				  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
				  rdlMetadata.pyName = "nextPage";
				  rdlMetadata[TEMPLATE_CONSTANTS["PYSTARTINDEX"]] = startIndex;
				  rdlMetadata[TEMPLATE_CONSTANTS["PYENDINDEX"]] = startIndex + pageCount - 1; /* TODO: Need to verify this after US-226992 changes tweaked the calculation */
				  if(rdlMetadata.section && 
					 rdlMetadata.section.sectionbody[0] && 
					 rdlMetadata.section.sectionbody[0][TEMPLATE_CONSTANTS["PYPAGELISTPROPERTY"]]) {
					rdlMetadata[TEMPLATE_CONSTANTS["PYPAGELISTPROPERTY"]] = rdlMetadata.section.sectionbody[0][TEMPLATE_CONSTANTS["PYPAGELISTPROPERTY"]]; /* This is needed to keep the metadata inlint to "nextPage" renderer. */
				  }
				  if(isLargeDP) { /* RDL node is used by "nextPage" renderer to load page and its reference is cleared after usage. */
					rdlMetadata.RDLNode = RDLNode;
				  }
				};
			} else {
			  var oSafeURL = new SafeURL();
			  oSafeURL.put("listAction", "PAGINATE"); /*BUG-381209: Appending necessary param for the pyPreListAction activity*/
			  oSafeURL.put("listPageSize", pageCount);
			  oSafeURL.put("pyCallStreamMethod", RDLNode.getAttribute('data-nextpagemethod'));
			  oSafeURL.put("listSource",dataSource);
			  if(startIndex)
				oSafeURL.put("listStartIndex", startIndex);
			  if(endIndex)
				oSafeURL.put("listEndIndex", endIndex);
			  oArgs.appendExtraQueryString = oSafeURL;
			}
		  
		  if (pega.u.d.isSafeToReload(RDLNode)) {
					pega.u.d.reload(oArgs);
		  } else {
			setTimeout(function() {
			  pega.ctx.RDL.isLoading = true;
			  pega.ui.template.pzRDLTemplate.loadPage(startIndex, pageCount, RDLNode, event, callback);
			}, 0);
		  }
	  },
	  loadNextPage: function(nextPage, RDLNode,callback,options){
		var tempDiv = document.createElement("DIV");
		/* Append the rows to the RDL. */
		var tempArray = [];
		if(nextPage){
			tempDiv.innerHTML = nextPage;
			var customErrorDiv = tempDiv.querySelector("#pyCustomError");
			if(customErrorDiv){
			  customErrorDiv.parentNode.removeChild(customErrorDiv);
			}
			var onlyOnceEle = pega.util.Dom.getElementsById("PegaOnlyOnce", tempDiv);
			if (onlyOnceEle && onlyOnceEle[0]) {
			  pega.u.d.handleOnlyOnce(onlyOnceEle[0]);
			  onlyOnceEle[0].parentNode.removeChild(onlyOnceEle[0]);
			}
			/* BUG-377244 : remove the skeleton div */
			var skeletonArray = tempDiv.querySelectorAll("[data-skeleton]");
			if(skeletonArray && skeletonArray.length != 0){
			  for(var i = 0; i < skeletonArray.length; i++){
				  tempDiv.removeChild(skeletonArray[i]);
			  }
			}
			for(var i=0; i<tempDiv.children.length;i++){
			  
			 var child = tempDiv.children[i];
			   if(!(child.tagName == "DIV") || (child.tagName == "DIV" && child.id.indexOf("AJAXCT")==0))
			  {
				tempDiv.removeChild(tempDiv.children[i]);i--;
			  }
			}
			var loadedRowsCount=i;
			var loadRowsCallback = function(nodeObj){
			  pega.ctx.RDL.isLoading = tempArray.length;
			  /*
			  if(options.fromFetchAndAppend){
				 pega.ctx.RDL.map && (pega.ctx.RDL.map[RDLNode.getAttribute("data-uniqueid")]["endIndex"] = options.startIndex + loadedRowsCount);
			  }else {
				pega.ctx.RDL.map[RDLNode.getAttribute("data-uniqueid")]["endIndex"] = options.startIndex + options.pageCount;
			  }
			  */
       
			  callback && callback();
			  var wrapperNode=document.createElement("div")
			  wrapperNode.innerHTML=nodeObj;
			  var processOnloadsStartIndex=RDLNode.children.length-loadedRowsCount;
			  for(var i=0;i<loadedRowsCount;i++){
				pega.u.d.processOnloads(RDLNode.children[processOnloadsStartIndex + i]);
			  }
			  pega.u.d.gIsScriptsLoading = false;
			  /* US-241741: If pagesize > loadedRowsCount then show "no more data" and hide the "load more" link */
			  if(parseInt(RDLNode.getAttribute("data-pagesize")) > loadedRowsCount|| (options.fromFetchAndAppend && options.fromFetchAndAppend.generateNoMoreDataDiv)){
        // get live region 
        var pyUniqueId = RDLNode.getAttribute('data-uniqueid');
        //Adding a safe check for the RDLNode.ParentElement because if it is null then querySelectory method is not available and throws an error
        var existingLiveRegion = RDLNode.parentElement && RDLNode.parentElement.querySelector('[id="rdlRegion-'+pyUniqueId+'"]');
	      if(existingLiveRegion) {
          if(loadedRowsCount === 0)
            existingLiveRegion.setAttribute('title', rdlNoMoreRecordsToLoad);
          else
            existingLiveRegion.setAttribute('title', allRecordsLoaded);
        }
				pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(RDLNode, tempDiv);
			  }             
			  //pega.u.d.loadHTMLEleCallback(nodeObj);
			};
			if(tempDiv.children.length > 0){
			 
			   pega.u.d.loadDOMObject(RDLNode, tempDiv.innerHTML,loadRowsCallback, {domAction:"append", domElement:RDLNode,bMultiple:true});
			   window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();      
			}else{
			  pega.ctx.RDL.isLoading = false;
			  pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(RDLNode, tempDiv);
			}
		}else {
		  pega.ctx.RDL.isLoading = false;
		  pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(RDLNode, tempDiv);
		}
	  },
	  /*loadNextPageDOM: function(startIndex, pageCount, RDLNode, options) {
		var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		var dataSource = RDLNode.getAttribute('data-repeat-source');
		var bNoMoreData = false;
		var nextPage;
		var rdlMetadataPage = pega.ctx.RDL.map[RDLNode.getAttribute("data-uniqueid")];
		var sourceList = pega.ui.ClientCache.find(dataSource, options);
		var pyRDLShowDetails = pega.ui.template.pzRDLTemplate.isRDLShowDetails(rdlMetadataPage);
		if (sourceList) {
			var rows = pega.ui.template.pzRDLTemplate.getRowArray(sourceList);
			var paginationClass = "";
			if ($(RDLNode).hasClass("progressive-bodyScroll")) {
				paginationClass = "progressive-bodyScroll";
			} else {
				paginationClass = "progressive-rdlScroll"
			}
			if (rows.length < pageCount) {
				if (paginationClass == "progressive-bodyScroll") {
					$(RDLNode).removeClass("progressive-bodyScroll");
				} else {
					$(RDLNode).removeClass("progressive-rdlScroll");
					$(RDLNode).removeClass("rdl-scrolllistener");
				}
				$(RDLNode).removeAttr("id");
				$(RDLNode).off("scroll");
				bNoMoreData = true;
			}
			var isSourceParameterisedDP = false;
			pega.ctx.RDL.map[RDLNode.getAttribute("data-uniqueid")]["paginationClass"] = paginationClass;
			pega.ctx.RDL.map[RDLNode.getAttribute("data-uniqueid")]["endIndex"] = startIndex + pageCount;
			var pyDPParamsList = rdlMetadataPage[TEMPLATE_CONSTANTS["PYSECTION"]][TEMPLATE_CONSTANTS["PYSECTIONBODY"]][0][TEMPLATE_CONSTANTS["PYRDPARAMSLIST"]];
			if (pyDPParamsList && $.isArray(pyDPParamsList)) {
				isSourceParameterisedDP = true;
			}
			var paramObj = {
				metadata: rdlMetadataPage,
				rows: rows,
				originalDataSource: dataSource,
				isSourceParameterisedDP: isSourceParameterisedDP,
				pyStartIndex: startIndex,
				pyRDLShowDetails: pyRDLShowDetails
			}
			if(rows.length > 0) {
			
				var paginationMode = (rdlMetadataPage[TEMPLATE_CONSTANTS["PYRDLPAGEMODE"]] == 2) ? "LoadOnScroll": "";
				var repeatPath = pega.ui.template.DataBinder.resolvePath(dataSource);
				var repeatInfo = {
					component: "RepeatingDynamicLayout",
					paginationMode: paginationMode
				};
		
				var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
				// Push RDL context
				currentContext.push(repeatPath, undefined, repeatInfo);
	
				nextPage = Handlebars.partials['pzRDLRowTemplate'](paramObj);
	
				// Pop context
				currentContext.pop();
			}
		}
	
		var tempDiv = document.createElement("DIV");
		// Append the rows to the RDL. 
		var tempArray = [];
		if(nextPage){
			tempDiv.innerHTML = nextPage;
			for(var i=0; i<tempDiv.children.length;i++){
			  tempArray.push(tempDiv.children[i]);
			}
			var rowAppender = function(nodeObj){
			pega.ctx.RDL.isLoading = tempArray.length;
			if(tempArray.length > 0){
			  pega.u.d.loadDOMObject(RDLNode, tempArray.shift().outerHTML, rowAppender, {domAction:"append", domElement:RDLNode});
			  window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
			}else{
			  if(bNoMoreData){
				  pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(RDLNode, tempDiv);
			  }
			}
			pega.u.d.gIsScriptsLoading = false;
			//pega.u.d.loadHTMLEleCallback(nodeObj);
		  };
		  pega.u.d.loadDOMObject(RDLNode, tempArray.shift().outerHTML, rowAppender, {domAction:"append", domElement:RDLNode});
		  window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
	
		}else if(bNoMoreData){
		  pega.ctx.RDL.isLoading = false;
		  pega.ui.template.pzRDLTemplate.loadNoMoreDataDiv(RDLNode, tempDiv);
		}
	  },*/
	
	  loadPageAsync: function(treeNode, dpName, startIndex, onSuccess, options) {
		var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		var datapageParams = this.getDataPageParams(treeNode);
		if(treeNode[TEMPLATE_CONSTANTS["PYRDLPAGESIZE"]]){
			datapageParams.pyPageSize = parseInt(treeNode[TEMPLATE_CONSTANTS["PYRDLPAGESIZE"]]);
			datapageParams.pyStartIndex = startIndex;
		}
		var onFailure = function() {
			if (window.console && window.console.error)
				window.console.error("pzpega_ui_RDLTemplate.js : onFailure of pega.ui.ClientCache.findPageAsync was invoked with arguments : ", arguments); /* BUG-251766 */
		};
		
		
		
		pega.ui.ClientCache.findPageAsync(dpName, datapageParams, onSuccess, onFailure, options);
	  },
	  getDataPageParams: function(treeNode) {
		/************* BEGIN PROCESSING ANY PARAMETERS OF THE SOURCE OF RDL *************/
		var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		var datapageParams = {};
		/*
		1.  Get info about data page parameters in RDL metadata
		2.  Before calling ClientCache find on datapage, use clientTools to set these parameter values
		*/
		try {
			//var treeNodeObject = JSON.parse(.templatePage.getJSON());
			var pyDPParamsList = treeNode[TEMPLATE_CONSTANTS["PYSECTION"]][TEMPLATE_CONSTANTS["PYSECTIONBODY"]][0][TEMPLATE_CONSTANTS["PYRDPARAMSLIST"]];
			if (pyDPParamsList && $.isArray(pyDPParamsList)) {
	
				$.each(pyDPParamsList, function(index, paramItem) {
					/*paramItem.pyValue will be DesignTime PropertiesPanel configuration -> the property name typed there for the parameter value*/
					/*Fix for BUG-222413 : paramItem.pyValue would no longer be a simple string. Instead, it now has the structure of {value : 'somestring', isLiteral : true/false}*/
					var currentParameterValueObject = paramItem.pyValue;
	
					var currentParameterValue = "";
	
					if (currentParameterValueObject) {
						  
						  if (typeof currentParameterValueObject == "string") {
							currentParameterValueObject = JSON.parse(currentParameterValueObject);
						}
	
						if (/true/.test(currentParameterValueObject.isLiteral)) {
							currentParameterValue = pega.ui.template.DataBinder.resolveIndex(currentParameterValueObject.value);
						} else {
							currentParameterValue = pega.ui.ClientCache.find(pega.ui.template.DataBinder.resolveIndex(currentParameterValueObject.value));
	
							if (currentParameterValue) {
								currentParameterValue = currentParameterValue.getValue();
							} else {
								currentParameterValue = null; /* Fix for BUG-227522 : Parameterized DP params are emptied in RDL renderer */
								/* Earlier, this was being set to an empty string, "" . Based on the parameter values, we are setting here, CC.find(...) has started changing the original data of the hashed parameterised DP. Plus, initially, the hashed DP is now being created on the client side [with null's for DP parameters] even before RDL is invoked. And when RDL is invoked, CC.find(...) happens, which internally sees that for parameters, null has changed to "" implying that something has changed & causes the DP to be rehashed. So, now, due to this changed logic & initialisation of parameterised DP's, we have been asked to fallback to null instead of "" always. */
							}
						}
					} else {
						currentParameterValue = null; /* Fix for BUG-227522 : Parameterized DP params are emptied in RDL renderer */
						/* Earlier, this was being set to an empty string, "" . Based on the parameter values, we are setting here, CC.find(...) has started changing the original data of the hashed parameterised DP. Plus, initially, the hashed DP is now being created on the client side [with null's for DP parameters] even before RDL is invoked. And when RDL is invoked, CC.find(...) happens, which internally sees that for parameters, null has changed to "" implying that something has changed & causes the DP to be rehashed. So, now, due to this changed logic & initialisation of parameterised DP's, we have been asked to fallback to null instead of "" always. */
					}
	
					if (pega && pega.clientTools) {
						pega.clientTools.getParamPage().put(paramItem.pyName, currentParameterValue);
					}
					/* BUG-266876: Set null param value to empty string */
					datapageParams[paramItem.pyName] = currentParameterValue !=null ? currentParameterValue : "";
				});
	
			}
		} catch (exc) {
			if (window.console && window.console.log)
				window.console.log("pzpega_ui_RDLTemplate.js : could not fetch any parameters for RDL source data page - POSSIBLE REASONS - probably, this is a DP with no parameters - or, paramItem.pyValue of some paramItem in pyDPParamsList of this parameterised DP has malformed JSON");
		}
	
		/************* END PROCESSING ANY PARAMETERS OF THE SOURCE OF RDL *************/
	
		return datapageParams;
	  },
	  getMasterDetailsDivForRDL: function(rdlConfig) {
		var masterDetails = "";
		var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		var RDLShowDetails = rdlConfig.RDLShowDetails;
		var showDetailsComponent = rdlConfig.showDetailsComponent;
		var currentContext = rdlConfig.currentContext;
		var treeNode = rdlConfig.treeNode;
		if(RDLShowDetails && showDetailsComponent){
		  var packagedPage = treeNode[TEMPLATE_CONSTANTS['PYDETAILSPAGE']];
		  var rowMethodName = treeNode[TEMPLATE_CONSTANTS['PYROWMETHOD']];
  
		  var layoutName = showDetailsComponent[TEMPLATE_CONSTANTS["PYNAME"]] || showDetailsComponent["pyName"];
		  var rendererMethod = pega.ui.template.RenderingEngine.getRenderer(layoutName);
		  var detailsMarkup = "";
		  if (rendererMethod) {
			/* Set bRDLShowDetails to true in the parameter page so that the controls get the data-propref attribute */
			pega.clientTools.putParamValue("bRDLShowDetails", true);
			showDetailsComponent = pega.ui.TemplateEngine.processMetadataPerComponent(showDetailsComponent, currentContext, false, true);
			detailsMarkup = rendererMethod(showDetailsComponent);
			// Reset bRDLShowDetails to false
			pega.clientTools.putParamValue("bRDLShowDetails", false);
		  }
  
		  masterDetails = "<div class='RDLShowDetails' style='display:none;' id='RULE_KEY' node_type='MAIN_RULE' name='BASE_REF' base_ref='" + packagedPage + "' data-methodname='" + rowMethodName + "'>" + detailsMarkup + "</div>";
		}
		return masterDetails;
	  },
  
	  loadNoMoreDataDiv: function(RDLNode, tempDiv){  
		tempDiv=document.createElement("div");
		 var noMoreDataSecMarkup = "",noDetailsMsg="";
		 var noMoreDataSecRef = RDLNode.getAttribute("data-nomoredatasection");
		if(noMoreDataSecRef){
		 var parentSectionContext = pega.u.d.getBaseRef(RDLNode);
		 noMoreDataSecMarkup = pega.ui.template.pzRDLTemplate.generateNoMoreDataDiv(noMoreDataSecRef, parentSectionContext);
		 tempDiv.innerHTML = noMoreDataSecMarkup;
  
		}else if( RDLNode.getAttribute("data-nomoredatafv")){
		  var currentContext = pega.ui.TemplateEngine.getCurrentContext();
		  currentContext.push("FVNoDataPage");
		  noDetailsMsg = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(RDLNode.getAttribute("data-nomoredatafv"), "pyCaption");
		  currentContext.pop();
		  var noMoreDataFieldValueWrappeDiv=document.createElement("div");
		  noMoreDataFieldValueWrappeDiv.innerHTML=noDetailsMsg;
		  tempDiv.appendChild(noMoreDataFieldValueWrappeDiv);
		}
		
		if(noMoreDataSecRef || RDLNode.getAttribute("data-nomoredatafv")){
		 $(tempDiv).children(0).addClass("rdl-nomoredatasection").attr("data-click", "");
  
		 var ldoCallback = null;
		  //BUG-358011 added check to avoid multiple no more data message.
		  if(!RDLNode.querySelector('div.rdl-nomoredatasection')){
			  $(tempDiv).children(0).addClass("rdl-nomoredatasection");
			  pega.u.d.loadDOMObject(RDLNode, tempDiv, ldoCallback, {domAction:"append", domElement:RDLNode});
		  }
		}
		  var rdlPaginator = pega.ctx.dom.$(RDLNode).siblings("div.rdl-paginatorsection");
		  if(rdlPaginator.length > 0){
			rdlPaginator.get(0).style.display = 'none';
		  }
		   RDLNode.classList.remove("progressive-bodyScroll");
		   RDLNode.classList.remove("progressive-rdlScroll");
		  window.LayoutGroupModule && LayoutGroupModule.initialiseLGTreatment();
	  },
	
	  isRDLShowDetails: function(treeNode) {
		  // TODO: Are the null checks really required?
		  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		  var sectionNode = treeNode[TEMPLATE_CONSTANTS["PYSECTION"]];
		  if(!sectionNode)
			  return;
		  var sectionBody = sectionNode[TEMPLATE_CONSTANTS["PYSECTIONBODY"]][0];
		  if(!sectionBody)
			  return;
		  return !!sectionBody[TEMPLATE_CONSTANTS["PYRDLSHOWDETAILS"]];
	  },
	
	   generateSection : function(property, parentSectionContext) {
		 var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		  var noMoreDataSecMarkup = "";
		  /* TODO: Remove the old code once the template constant changes for sections is completed */
		  var layoutMetaNode = {};
		  layoutMetaNode.pxReferencedId = property;
		  layoutMetaNode[TEMPLATE_CONSTANTS["PYNAME"]] = "pxSection";
		  layoutMetaNode[TEMPLATE_CONSTANTS["PZPRIMARYPAGE"]] = "";
  
		  var rendererMethod = pega.ui.template.RenderingEngine.getRenderer("pxSection");
		  if (rendererMethod) {
			  
			  parentSectionContext = parentSectionContext || pega.ctx.primaryPageName;
			  if(parentSectionContext)
				pega.ui.TemplateEngine.getCurrentContext().push(parentSectionContext);
			  /*BUG-397019- Updated funcion name to generatesection and moved processMetadatapercomponent call after pushing context*/
			  layoutMetaNode = pega.ui.TemplateEngine.processMetadataPerComponent(layoutMetaNode, "", false);
			  noMoreDataSecMarkup = rendererMethod(layoutMetaNode);
			
			  if(parentSectionContext)
				pega.ui.TemplateEngine.getCurrentContext().pop()
		  }
		  return noMoreDataSecMarkup; 
	   },
	  
	  // TODO:
	  generateNoMoreDataDiv: function(property, parentSectionContext) {
		 return this.generateSection(property,parentSectionContext);
	  },
	  
	  getRecordsBasedOnRowVisibility: function(rowVisibilityId, pageSize, ccList, startIndex) {/* US-182707: Return records considering row visible when */
		var pagelistSize = ccList.size(),
			count = 0,
			dsArr = [],
			list = pega.ui.template.pzRDLTemplate.getRowArray(ccList);
		while(startIndex < pagelistSize) {
		  var row = list[startIndex];
		  dsArr.push(row);
		  if(row[rowVisibilityId]) {
			count++;
		  }
		  if(count == pageSize) {
			break;
		  }
		  startIndex++;
		}
		return dsArr;
	  },
    
    /*BUG-520499: Cannot create a new case type */
    _encodeHTML: function(propValue){
      return new Option(unescape(propValue)).innerHTML;
    },
    /*BUG-520499*/
    
	  generateRDLWrapperDiv: function(rdl, rdlPaginator, masterDetails, options){
		var returnStr = "";
		var attrString = "";
		
		if(options && options.pyMethodName){
		  attrString += "data-methodname='"+ options.pyMethodName +"' ";
		}
		if(options && options.pyExpressionIdMeta){
      /* BUG-519299: Repeating dynamic layout showing RAW HTML text in UI */
		  attrString += this._encodeHTML(options.pyExpressionIdMeta + " ");
		}
		if(options && options.isRefreshWhen){
		  attrString += " data-refresh='true' "; 
		}
		
		if(options && options.pyDragDrop && !pega.u.d.ServerProxy.isDestinationLocal()) { // US-263841
		  var dataSortableRDL = {};
		  // US-263843
		  dataSortableRDL.groupName = options.pyDragDropGroupName;
  
		  // US-265366
		  dataSortableRDL.preActivity = options.pyPreActivity;        
		  dataSortableRDL.postActivity = options.pyPostActivity;
		  
		  attrString += " data-sortable-rdl='" + JSON.stringify(dataSortableRDL) +"' ";                
		}
  
		returnStr = "<div data-template "+ attrString +" class='rdlWrapperDiv'>" + rdl + rdlPaginator + masterDetails + "</div>";
		return returnStr;
	  }
	  
  };
	/*
		pyTemplates[0] -> RDL Row Section
		pyTemplates[1] -> RDL Show Details || (Load More Div)
		pyTemplates[2] -> Load more Div
		// TODO: Create separate nodes
		RDLRowSectionNode
		RDLSowDetailsNode
		RDLLoadMoreNode
	*/
  if (pega.ui.gStackOrder == undefined || typeof(pega.ui.gStackOrder) == "undefined"){ pega.ui.gStackOrder = [];}
	
	pega.ui.template.RenderingEngine.register("RepeatingDynamicLayout", function(treeNode, parentComponent, showDetailsComponent) {
		pega.ui.gStackOrder.push(0);
		var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
		var masterDetails="";
		var rdlPaginator = "";
		var rdlPaginatorContextRef = pega.ui.TemplateEngine.getCurrentContext().getReference();
		var sectionNode = treeNode[TEMPLATE_CONSTANTS["PYSECTION"]];
		var rowMethod = treeNode[TEMPLATE_CONSTANTS["PYROWMETHOD"]];
		var sectionBody = sectionNode[TEMPLATE_CONSTANTS["PYSECTIONBODY"]][0];
		var pyUniqueID;
    if(pega.ui.TemplateEngine.getCurrentContext && pega.ui.TemplateEngine.getCurrentContext().getRepeatingParentInfo && 
       pega.ui.TemplateEngine.getCurrentContext().getRepeatingParentInfo().index) {
      pyUniqueID = treeNode[TEMPLATE_CONSTANTS["PYUNIQUEID"]] +"("+ 
        pega.ui.TemplateEngine.getCurrentContext().getRepeatingParentInfo().index +")";
    } else {
      pyUniqueID = treeNode[TEMPLATE_CONSTANTS["PYUNIQUEID"]];
    }
		// Data test id comes as "data-test-id='201805030255400744423'" when test is enabled.
		var pyAutomationId = treeNode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]?(treeNode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]).replace(/'/g, ""):"";
		var pyEnableSwipe = treeNode[TEMPLATE_CONSTANTS["PYENABLESWIPE"]]?(treeNode[TEMPLATE_CONSTANTS["PYENABLESWIPE"]]):false;
		var pyDragDrop = treeNode[TEMPLATE_CONSTANTS["PYDRAGDROP"]] ? true : false; // US-263841
		var pyDragDropGroupName = treeNode[TEMPLATE_CONSTANTS["PYDRAGDROPGROUPNAME"]] ? treeNode[TEMPLATE_CONSTANTS["PYDRAGDROPGROUPNAME"]] : Date.now(); // US-263843
		var pyPreActivity = treeNode[TEMPLATE_CONSTANTS["PYPREACTIVITY"]] ? treeNode[TEMPLATE_CONSTANTS["PYPREACTIVITY"]] : ""; // US-265366
		var pyPostActivity = treeNode[TEMPLATE_CONSTANTS["PYPOSTACTIVITY"]] ? treeNode[TEMPLATE_CONSTANTS["PYPOSTACTIVITY"]] : ""; // US-265366
		var rawSource = sectionBody[TEMPLATE_CONSTANTS["PYPAGELISTPROPERTY"]];
		/* BUG-377458: HFix-44840 Correct the rawSource when RDL is inside the masterdetails of another RDL */
		if(rawSource && rawSource.startsWith("PackagedPage1709121363")){
		  rawSource = rawSource.replace("PackagedPage1709121363", '');
		}    
		var currentContext = pega.ui.TemplateEngine.getCurrentContext();
		var dataSourceId = sectionBody[TEMPLATE_CONSTANTS["PXDATASOURCEID"]];
    
    /* Accessibility changes start  */
   /* Navigation Modes available  1) arrowkeys[value] -> Arrow Keys Navigation 2) tabkey[value] -> Tab Key Navigation */
    if(treeNode[TEMPLATE_CONSTANTS["PYRDLNAVIGATIONTYPE"]] === "arrowkeys") { /* US-527723 add new property PYRDLNAVIGATIONTYPE to set table navigation & remove pyUseFormNavigation dependency added previously as part of BUG-657452 */
      if(pega.ctx.RDLUniqueIds && pega.ctx.RDLUniqueIds.length > 0){
        // check if unique id is present already
        if(!pega.ctx.RDLUniqueIds.indexOf(pyUniqueID) > -1){
          pega.ctx.RDLUniqueIds.push(pyUniqueID);
        }
      } else pega.ctx.RDLUniqueIds = [pyUniqueID];
    }
      
    /* Accessibility changes end  */
	   
  
		if(dataSourceId) {/* BUG-302658: Update source from context tree if PXDATASOURCEID is present in metadata */
		  rawSource = currentContext.getDataSource(dataSourceId) + ".pxResults";
		}
	  
		if(currentContext.getReferencedProperty)
			rawSource = currentContext.getReferencedProperty(rawSource, rawSource.startsWith(".")) || rawSource; /* BUG-303229: getReferencedProperty needs to be context aware when dereferencing the rawSource of RDL */
	
		var datasource = pega.ui.template.DataBinder.resolveIndex(rawSource);
		var RDLDetailsFlowAction = "",
			bRDLWOBound = false,
			classFamily = "",
			isCaseOfflinable = false,
			pyInlineStyle,
			rdlPageSize,
			rdlPaginationMode,
			rdlPaginationOptions,
			pyStartIndex = 0,
			bProgressiveLoad = false,
			pyCustomClass,
			pyPaginationClass="",
			pyNextPageMethodName,
			isRDLCategorized,
			rdlCategorizedBy,
			isRDLCategorizedByDatetime,
			isRDLScrubberEnabled,
			rdlCategoryHeaderRef,
			pyNoMoreDataSecRef,
			pyNoMoreDataFV,
			rdlScrubberPrefix,
			pyScrubberStyle,
			pyCategoryRowsStyle;
	
		pyCustomClass = sectionNode[TEMPLATE_CONSTANTS["PYCUSTOMCLASS"]];
		pyInlineStyle = sectionNode[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] ? sectionNode[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] : "";
		rdlPaginationMode = treeNode[TEMPLATE_CONSTANTS["PYRDLPAGEMODE"]];
		isRDLCategorized = treeNode[TEMPLATE_CONSTANTS["PYISRDLCATEGORIZED"]];
		isRDLCategorized = (isRDLCategorized === "true");
		if(isRDLCategorized){
		  rdlCategorizedBy = treeNode[TEMPLATE_CONSTANTS["PYRDLCATEGORIZEDBY"]];
		  if(rdlCategorizedBy){
			rdlCategorizedBy = rdlCategorizedBy.replace(".","");
		  }
		  isRDLCategorizedByDatetime = treeNode[TEMPLATE_CONSTANTS["PYISRDLCATEGORIZEDBYDATETIME"]];
		  isRDLCategorizedByDatetime = (isRDLCategorizedByDatetime === "true");
		  isRDLScrubberEnabled = treeNode[TEMPLATE_CONSTANTS["PYISRDLSCRUBBERENABLED"]];
		  isRDLScrubberEnabled = (isRDLScrubberEnabled === "true");
		  rdlCategoryHeaderRef = treeNode[TEMPLATE_CONSTANTS["PYRDLCATEGORYHEADERREFERENCE"]];
		  pyCategoryRowsStyle = "rdl-category-rows "+pyCustomClass;
		  pyCustomClass = "content-categorized ";
		}
		if (!pega.ctx.RDL) {
		  pega.ctx.RDL={};  
		}
	  
		var RDLShowDetails = pega.ui.template.pzRDLTemplate.isRDLShowDetails(treeNode);
		/* If the source of the RDL is empty on-load, pyTemplates will not be available in the treeNode */
		if(!treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]]){
		  treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]]=[{}];
		}
		if (RDLShowDetails) {
			treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1] = {};
			/* TODO: Remove the old code once the template constant changes for sections is completed */
			treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1] = {
				  pxReferencedId: treeNode[TEMPLATE_CONSTANTS["PYDETAILSSECTIONREFERENCE"]],
				  pyName: "pxSection",
				  pzPrimaryPage: treeNode[TEMPLATE_CONSTANTS["PYDETAILSPAGE"]]
			};
	
			
			treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1][TEMPLATE_CONSTANTS["PXREFERENCEDIF"]] = treeNode[TEMPLATE_CONSTANTS["PYDETAILSSECTIONREFERENCE"]];
			treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1][TEMPLATE_CONSTANTS["PYNAME"]] = "pxSection";
			treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1][TEMPLATE_CONSTANTS["PZPRIMARYPAGE"]] = treeNode[TEMPLATE_CONSTANTS["PYDETAILSPAGE"]];
			
		  
			showDetailsComponent = treeNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][1];
			RDLDetailsFlowAction = sectionBody[TEMPLATE_CONSTANTS["PYRDLDETAILSFLOWACTION"]];
			bRDLWOBound = (sectionBody[TEMPLATE_CONSTANTS["PYISRDLWOBOUND"]] == "true");
			if(bRDLWOBound)
				classFamily = sectionBody[TEMPLATE_CONSTANTS["PYPARENTCLASS"]];
			isCaseOfflinable = (sectionBody[TEMPLATE_CONSTANTS["PYISCASEOFFLINABLE"]] == "true");
		}
	
	
		var rdlHeight = parseInt(treeNode[TEMPLATE_CONSTANTS["PYRDLHEIGHT"]], 10);
		if (rdlHeight) {
			if(isRDLCategorized && isRDLScrubberEnabled){
			  pyScrubberStyle = "max-height:" + rdlHeight + "px;";
			}
			else{
			  pyInlineStyle += ";max-height:" + rdlHeight + "px;";
			  pyCustomClass += " layout-fixed-height ";
			}
			
		}
		
		/* RDL Pagination properties */
		// TODO: Cache metadata page
		/* BUG-269908: Ignoring the pagination modes other than on-scroll.
		 * This check needs to be removed when the load-more infra is templatized.
		 */
		if(treeNode[TEMPLATE_CONSTANTS["PYNOMOREDATAREFERENCE"]]){
		  pyNoMoreDataSecRef = treeNode[TEMPLATE_CONSTANTS["PYNOMOREDATAREFERENCE"]];
		}
		 if(treeNode[TEMPLATE_CONSTANTS["PYNOMOREDATAFIELDVALUE"]]){
		  pyNoMoreDataFV = treeNode[TEMPLATE_CONSTANTS["PYNOMOREDATAFIELDVALUE"]];
		}
		pyNextPageMethodName = treeNode[TEMPLATE_CONSTANTS["NEXTPAGEMETHODNAME"]];
		if (rdlPaginationMode) {          
			if (!pega.ctx.RDL.map) {
				pega.ctx.RDL.map={};  
			}
			pega.ctx.RDL.isLoading = false;
			//var templatePageJSON = jQuery.extend(true, {}, treeNode);
			var endIndex;
			
			rdlPageSize = parseInt(treeNode[TEMPLATE_CONSTANTS["PYRDLPAGESIZE"]]);
			//BUG-358140  Commented the code to fix the issue
			/* BUG-282027: Apparently, endIndex does not come down always */
			/*if (pega.ctx.RDL.map[pyUniqueID] && pega.ctx.RDL.map[pyUniqueID]["endIndex"]) {
				endIndex = pega.ctx.RDL.map[pyUniqueID]["endIndex"];
			} else {*/
				endIndex = rdlPageSize;
				pega.ctx.RDL.map[pyUniqueID] = {
				  "endIndex": endIndex
				}
		   // }
  
			rdlPaginationOptions = {
				startIndex: 0,
				endIndex: endIndex
			};
			/* 0 - none
			 * 1 - Progressively load on click
			 * 2 - Progressively load on scroll
			 */
			switch (rdlPaginationMode) {
				case "1":
					pyPaginationClass = "progressive-onclick ";
					break;
				case "2":
					if (rdlHeight) {
						pyPaginationClass = "progressive-rdlScroll ";               
					} else {
						pyPaginationClass = "progressive-bodyScroll ";
					}
					break;
			}
			bProgressiveLoad = true;
		}
		var dpName = sectionBody[TEMPLATE_CONSTANTS["PYDPNAME"]];
		if(dataSourceId) {
		  dpName = pega.ui.TemplateEngine.ContextObject.getDataSource(dataSourceId);
		}
	
		var isLargeDP = false;
		if (dpName && dpName != "") {
			var isLargeDP = pega.ui.ClientCache.isLargeDatapage(dpName);
		}
		var datapageParams = pega.ui.template.pzRDLTemplate.getDataPageParams(treeNode);
		/************* BEGIN RENDERING THE RDL *************/
	
		/* Refresh When attributes */
		var pyStrRefreshWhen = treeNode[TEMPLATE_CONSTANTS["PYSTRREFRESHWHEN"]] && treeNode[TEMPLATE_CONSTANTS["PYSTRREFRESHWHEN"]];
		var pyStrRWP = treeNode[TEMPLATE_CONSTANTS["PYSTRRWP"]] && treeNode[TEMPLATE_CONSTANTS["PYSTRRWP"]];
		var pyStrRWPreActivity = treeNode[TEMPLATE_CONSTANTS["PYSTRRWPREACTIVITY"]] && treeNode[TEMPLATE_CONSTANTS["PYSTRRWPREACTIVITY"]];
		var pyStrDTransform = treeNode[TEMPLATE_CONSTANTS["PYSTRDTRANSFORM"]] && treeNode[TEMPLATE_CONSTANTS["PYSTRDTRANSFORM"]];
	
		var isRefreshWhen = false;
		  // Ignore RefreshWhen in case of HC offline
	   if(treeNode[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]) {
		 var pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(treeNode[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]);
		 if(pega.u && pega.u.d && pega.u.d.ServerProxy && !pega.u.d.ServerProxy.isDestinationLocal()){
		   isRefreshWhen = true;
		 }
		 var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(treeNode[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]] );
		 var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
		 if(typeof show_when == 'undefined' ? false : !show_when){
		   pyInlineStyle +="display:none";
		 }
		}
		var pyMethodName = treeNode[TEMPLATE_CONSTANTS["PYMETHODNAME"]];
	
		var pyDPParamsList = sectionBody[TEMPLATE_CONSTANTS["PYRDPARAMSLIST"]];
		var isSourceParameterisedDP = false;
		if (pyDPParamsList && $.isArray(pyDPParamsList)) {
			isSourceParameterisedDP = true;
		}
	
	
		/* Prepare for Contexting */
		 // rawSource -> pyWorkPage.CountriesList({-{i1481746750954}-}).StateList
		//var repeatSource = pega.ui.template.DataBinder.resolveIndex(rawSource);    // pyWorkPage.CountriesList(1).StateList	 // datasource
		var repeatPath = pega.ui.template.DataBinder.resolvePath(rawSource);	   	 // pyWorkPage.CountriesList.1.StateList    // 0 based index
		
		var paginationMode = (rdlPaginationMode == 2) ? "LoadOnScroll": "";
		var repeatInfo = {
			component: "RepeatingDynamicLayout",
			paginationMode: paginationMode
		};
		
		var isHCOffline = pega.u.d.ServerProxy.isDestinationLocal();
		if(!isHCOffline && paginationMode == "LoadOnScroll"  && !pega.ctx.RDL.__streamCached) {
			var data = pega.ui.TemplateEngine.getValueFromContextTree(repeatPath);
			if(data) {
				// Check if data contains pxNonTemplates
				var hasNonTemplates = pega.ui.TemplateEngine.hasNonTemplates(data);
				// Cache the stream if requested by RDL + Load More
				if (hasNonTemplates) {
					// Cache the stream
					var div = document.createElement("div");
					var docFrag = pega.ui.template.RenderingEngine.getCurrentDocument();
	
					if(docFrag != document) {
						// Check if AJAX
						div.innerHTML = docFrag.innerHTML;	
					} else {
						 // BUG-336765: document - iframe case
						div.innerHTML = docFrag.documentElement.innerHTML;
						// In case of memory leaks due to caching the iframe document the following selective caching can be used
						/*
						  for (var i = 0; i < data.length; i++) {
							var page = data[i];
							for (var property in page) {
							  if (property == "$pxNonTemplates") {
								for(var key in page.$pxNonTemplates){
									div.appendChild(docFrag.getElementById(page.$pxNonTemplates[key]));
								}
							  }
							}
						  }
						*/
					} 
				  
					/*BUG-397032 : commenting out below code 
					if(!pega.ctx.RDL.__streamCacheObject){
					  pega.ctx.RDL.__streamCacheObject = {};
					}
					pega.ctx.RDL.__streamCacheObject[repeatPath] = div;
					pega.ctx.RDL.__streamCached = true;*/
				}
			}
		}
		if (!isLargeDP) {
			/* Contexting */
			var currentContext = pega.ui.TemplateEngine.getCurrentContext();
			
			/*BUG-596461 : Should not have repeatpath while generating datasource*/
			if(datasource && datasource.startsWith('.')) {
			  // Update datasource with full ref
        var datasourceReference="";
			  if(currentContext.getReference)
				  datasourceReference = currentContext.getReference(); // pyWorkPage.CountriesList(1).StateList
			  datasource = datasourceReference+datasource;
			}
			
			/* BUG-323034: Call resolvePredicates to handle <LAST> */
			datasource = currentContext.resolvePredicates(datasource);
		  
			var dsArr = new Array();
			var originalDataSource = datasource; // To stamp the data-repeat-source for empty RDL
			var ds;
			if (rdlPaginationOptions) {
				if(treeNode[TEMPLATE_CONSTANTS["PYROWVISIBILITYWHENID"]]) {/* US-182707: Consider server row visible when */
				  ds = pega.clientTools.find(datasource);
				} else {
				ds = pega.ui.ClientCache.find(datasource, rdlPaginationOptions);
				}
			} else {
				ds = pega.ui.ClientCache.find(datasource);
			}
			var bPageGroupBoungRDL = false;
			/* BUG-290513: If the returned object is a page then it is assumed that the source is a pagegroup.
			 * For pagegroup create the array in a custom manner.
			 * For pagelists/datapages use getRowArray.
			 */
			if (ds) {
				if (ds.type == "list") { // 
				  if(treeNode[TEMPLATE_CONSTANTS["PYROWVISIBILITYWHENID"]]) {/* US-182707: Consider server row visible when */
					dsArr = pega.ui.template.pzRDLTemplate.getRecordsBasedOnRowVisibility(treeNode[TEMPLATE_CONSTANTS["PYROWVISIBILITYWHENID"]], endIndex, ds, 0);
				  } else {
					dsArr = pega.ui.template.pzRDLTemplate.getRowArray(ds);
				  }
				} else if (ds.type == "page") {
					dsArr = [];
					var dsJSON = ds.getJSONObject();
					for (var key in dsJSON) {
						dsArr.push(pega.ui.ClientCache.find(ds.getReference() + "(" + key + ")"));
					}
					bPageGroupBoungRDL = true;
				}
				if(isRDLCategorized){
					dsArr = pega.ui.template.pzRDLTemplate.getCategorizedRowArray(dsArr,rdlCategorizedBy,isRDLCategorizedByDatetime);
				}
				originalDataSource = ds.getReference();
				currentContext.push(originalDataSource, undefined, repeatInfo);
			} else {
				currentContext.push(repeatPath, undefined, repeatInfo);
			}
			repeatInfo.size = dsArr.length;
			masterDetails = pega.ui.template.pzRDLTemplate.getMasterDetailsDivForRDL({treeNode:treeNode,showDetailsComponent:showDetailsComponent,RDLShowDetails:RDLShowDetails,currentContext:currentContext});  

			/*BUG-418442 - Loaded records should not be less than rdlpagesize in progressive scroll rdl */
			  if(rdlPaginationMode == '1' || (rdlPaginationMode == '2' && dsArr.length>=rdlPageSize)){
			   pyCustomClass+=" "+pyPaginationClass;
			   pega.ctx.RDL.map[pyUniqueID]["paginationClass"] = pyPaginationClass;
			   }	  
			  if(isRDLCategorized && isRDLScrubberEnabled){
			  rdlScrubberPrefix = originalDataSource.replace(/[\(\.\)|\-]/g, "_")+"_"+rdlCategorizedBy;
			}
			/*in non-large-data RDL mode, everything is synchronous, so, return the markup to RE*/
			var contextObj = {
				rows: dsArr,
				metadata: treeNode,
				pyInspectorMetaData: sectionNode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]],
				/*pyRelativePath: "data-rel-path=." + sectionNode.getParent().getName(),*/
				pyInlineStyle: pyInlineStyle,
				pyCustomClass: pyCustomClass,
				originalDataSource: originalDataSource,
				pyRDLShowDetails: RDLShowDetails,
				pyRDLDetailsFlowAction: RDLDetailsFlowAction,
				pyIsRDLWOBound: bRDLWOBound,
				pyParentClass: classFamily,
				pyIsCaseOfflinable: isCaseOfflinable + "",
				isSourceParameterisedDP: isSourceParameterisedDP,
				pyExpressionIdMeta: pyExpressionIdMeta,
				isRefreshWhen: isRefreshWhen,
				pyMethodName: pyMethodName,
				pyRDLPageSize: rdlPageSize,
				pyStartIndex: pyStartIndex,
				pyUniqueID: pyUniqueID,
				pyAutomationId: pyAutomationId,
				pyEnableSwipe: pyEnableSwipe,
				bPageGroupBoungRDL: bPageGroupBoungRDL,
				bProgressiveLoad: bProgressiveLoad,
				pyNextPageMethodName: pyNextPageMethodName,
				pyNoMoreDataSecRef: pyNoMoreDataSecRef,
				pyNoMoreDataFV: pyNoMoreDataFV,
				pyRowMethodName: rowMethod,
				bRDLCategorized: isRDLCategorized,
        /* accessibility attributes */
        summary: treeNode["ariaLabel"]
			};
		 
			var categorizedRDLContextObj = {
				bRDLCategorizedByDatetime: isRDLCategorizedByDatetime,
				rdlCategorizedBy: rdlCategorizedBy,
				rdlCategoryHeaderRef: rdlCategoryHeaderRef,
				bRDLScrubberEnabled: isRDLScrubberEnabled,
				rdlScrubberPrefix: rdlScrubberPrefix,
				pyScrubberStyle: pyScrubberStyle,
				pyCategoryRowsStyle :pyCategoryRowsStyle
			};
		  
			if(isRDLCategorized){
			  contextObj = $.extend(contextObj,categorizedRDLContextObj);
			} 
			var rdl = Handlebars.partials['pzRDLTemplate'](contextObj);
	
			/* pop this context */
			currentContext.pop();
			pega.ui.gStackOrder.pop();
		  
			  var newTempdiv = document.createElement("div");
			  newTempdiv.innerHTML = rdl;
			  if(pega.util && pega.util.Dom) {
			  var rdlNode = pega.util.Dom.getFirstChild(newTempdiv);
			  var childNodes = pega.util.Dom.getChildren(rdlNode);
			  var noDetailsMsg = "";
			  if(childNodes.length == 0) {/* US-182706: Add no details message */
				if(treeNode[TEMPLATE_CONSTANTS["PYRULEFORCUSTOMNOROWSRDLMSG"]] == "section") {
				  noDetailsMsg = pega.ui.template.pzRDLTemplate.generateSection(treeNode[TEMPLATE_CONSTANTS["PYNODATASECTION"]],"NoDataPage");
				} else if(treeNode[TEMPLATE_CONSTANTS["PYRULEFORCUSTOMNOROWSRDLMSG"]] == "fieldvalue") {
				  var currentContext = pega.ui.TemplateEngine.getCurrentContext();
				  currentContext.push("NoDataPage");
				  noDetailsMsg = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(treeNode[TEMPLATE_CONSTANTS["PYNODATAFIELDVALUE"]], "pyCaption");
				  currentContext.pop();
				}
				// Set loading to false
				pega.ctx.RDL.isLoading = false;
				// Remove scroll classes
				rdlNode.classList.remove("progressive-bodyScroll");
				rdlNode.classList.remove( "progressive-rdlScroll");
				rdlNode.innerHTML = noDetailsMsg;
				/* BUG-373773: Addthe class "rdlHasNoRows" to the RDLNode */
				rdlNode.classList.add("rdlHasNoRows");
				rdl = newTempdiv.innerHTML;
				newTempdiv = null;
			  }else if(childNodes.length === rdlPageSize && rdlPaginationMode === '1'){/*BUG-613680 : RDL Paginator section non needed incase of server side when on rdl section cell*/
			 var tempDiv=document.createElement("div");
			  rdlPaginator = pega.ui.template.pzRDLTemplate.generateSection(treeNode[TEMPLATE_CONSTANTS["PYRDLPAGINATOR"]],rdlPaginatorContextRef);
			  tempDiv.innerHTML=rdlPaginator;
			  $(tempDiv).children(0).addClass("rdl-paginatorsection");
			  rdlPaginator=tempDiv.innerHTML;
			}
			}
			return pega.ui.template.pzRDLTemplate.generateRDLWrapperDiv(rdl, rdlPaginator, masterDetails, {"pyMethodName":pyMethodName, "pyExpressionIdMeta": pyExpressionIdMeta, "isRefreshWhen": isRefreshWhen, "pyDragDrop": pyDragDrop, "pyDragDropGroupName": pyDragDropGroupName, "pyPreActivity": pyPreActivity, "pyPostActivity": pyPostActivity});
	
		} else { /* is a large dp */
			var asyncStreamObj = pega.ui.TemplateEngine.newAsyncStream();
			var currentContext = pega.ui.TemplateEngine.getCurrentContext();
			currentContext.push(repeatPath, undefined, repeatInfo);
			if(currentContext.getReference)
			datasource = currentContext.getReference(); // pyWorkPage.CountriesList(1).StateList
			var dsArr = new Array();
			var originalDataSource = datasource;
			var ds;
			if (rdlPaginationOptions) {
			  ds = pega.ui.ClientCache.find(datasource, rdlPaginationOptions);
			} else {
			  ds = pega.ui.ClientCache.find(datasource);
			}
			if (ds) {
			  dsArr = pega.ui.template.pzRDLTemplate.getRowArray(ds);
			  originalDataSource = ds.getReference();
			}
      
			masterDetails = pega.ui.template.pzRDLTemplate.getMasterDetailsDivForRDL({treeNode:treeNode,showDetailsComponent:showDetailsComponent,RDLShowDetails:RDLShowDetails,currentContext:currentContext});
			if(rdlPaginationMode == '1'){
			  var tempDiv=document.createElement("div");
			  rdlPaginator = pega.ui.template.pzRDLTemplate.generateSection(treeNode[TEMPLATE_CONSTANTS["PYRDLPAGINATOR"]],rdlPaginatorContextRef);
			  tempDiv.innerHTML=rdlPaginator;
			  $(tempDiv).children(0).addClass("rdl-paginatorsection");
			  rdlPaginator=tempDiv.innerHTML;
			}
		  
			currentContext.pop();
	
			var onSuccess = function(data) {
	
				/* Contexting */
				var currentContext = pega.ui.TemplateEngine.getCurrentContext();
				currentContext.push(repeatPath, undefined, repeatInfo);
	
				// Update datasource with full ref
				if(currentContext.getReference)
					datasource = currentContext.getReference(); // pyWorkPage.CountriesList(1).StateList
	
				var dsArr = new Array();
	
				var originalDataSource = datasource;
				
				//var ds = data.get("pxResults");
				var ds;
				if (rdlPaginationOptions) {
					ds = pega.ui.ClientCache.find(datasource, rdlPaginationOptions);
				} else {
					ds = pega.ui.ClientCache.find(datasource);
				}
	
				if (ds) {
					  dsArr = pega.ui.template.pzRDLTemplate.getRowArray(ds);
					originalDataSource = ds.getReference();
				}
				if(dsArr.length < rdlPageSize){
				  rdlPaginator = "";
				}
				if(rdlPaginationMode == '1' || (rdlPaginationMode == '2' && dsArr.length>=rdlPageSize)){
				   pyCustomClass+=" "+pyPaginationClass;
				   pega.ctx.RDL.map[pyUniqueID]["paginationClass"] = pyPaginationClass;
			   }            
				/* BUG-386994 : no of cell */
				repeatInfo.size = dsArr.length;
				var stream = Handlebars.partials['pzRDLTemplate']({
					rows: dsArr,
					metadata: treeNode,
					pyInspectorMetaData: sectionNode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]],
					/*pyRelativePath: "data-rel-path=." + sectionNode.getParent().getName(),*/
					pyInlineStyle: pyInlineStyle,
					pyCustomClass: pyCustomClass,
					originalDataSource: originalDataSource,
					pyRDLShowDetails: RDLShowDetails,
					pyRDLDetailsFlowAction: RDLDetailsFlowAction,
					isSourceParameterisedDP: isSourceParameterisedDP,
					pyExpressionIdMeta: pyExpressionIdMeta,
					isRefreshWhen: isRefreshWhen,
					pyMethodName: pyMethodName,
					pyRDLPageSize: rdlPageSize,
					pyStartIndex: pyStartIndex,
					pyUniqueID: pyUniqueID,
					bProgressiveLoad: bProgressiveLoad,
					pyNoMoreDataSecRef: pyNoMoreDataSecRef,
					pyNoMoreDataFV: pyNoMoreDataFV,   				
          pyEnableSwipe: pyEnableSwipe
				});
	
				/* pop this context */
				currentContext.pop();
	
				asyncStreamObj.setStream(pega.ui.template.pzRDLTemplate.generateRDLWrapperDiv(stream, rdlPaginator, masterDetails, {"pyMethodName":pyMethodName, "pyExpressionIdMeta":pyExpressionIdMeta, "isRefreshWhen":isRefreshWhen, "pyDragDrop": pyDragDrop, "pyDragDropGroupName": pyDragDropGroupName, "pyPreActivity": pyPreActivity, "pyPostActivity": pyPostActivity}));
	
				//second argument to enable async renderer to call attachOnLoad post processing in case of async rendering
				pega.ui.TemplateEngine.renderAsyncStream(asyncStreamObj, true);
			};
	
			pega.ui.template.pzRDLTemplate.loadPageAsync(treeNode, dpName, pyStartIndex, onSuccess);
	
			/* in large-data RDL mode, everything is asynchronous, so, return this custom message flag string to RE, which renders a temporary Loading... message till the large data is fetched & its large markup is generated on the client */
	
			return asyncStreamObj.getPlaceholderMarkup();
		}
	
		/************* END RENDERING THE RDL *************/
	
	});
  //static-content-hash-trigger-YUI
/*
{{~#if pyRDLShowDetails~}}
{{setParam "bRDLShowDetails" true}}
{{~/if~}}

{{~#each rows~}}
{{{getRDLCell ../metadata ../originalDataSource ../isSourceParameterisedDP @index ../pyStartIndex ../bPageGroupBoungRDL}}}
{{~/each~}}

{{~#if pyRDLShowDetails~}}
{{setParam "bRDLShowDetails" false}}
{{~/if~}}
*/

/* Compiled Template */

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzRDLRowTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression((lookupProperty(helpers,"setParam")||(depth0 && lookupProperty(depth0,"setParam"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"bRDLShowDetails",true,{"name":"setParam","hash":{},"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":35}}}));
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getRDLCell")||(depth0 && lookupProperty(depth0,"getRDLCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"metadata") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"originalDataSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"isSourceParameterisedDP") : depths[1]),(data && lookupProperty(data,"index")),(depths[1] != null ? lookupProperty(depths[1],"pyStartIndex") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"bPageGroupBoungRDL") : depths[1]),{"name":"getRDLCell","hash":{},"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":122}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression((lookupProperty(helpers,"setParam")||(depth0 && lookupProperty(depth0,"setParam"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"bRDLShowDetails",false,{"name":"setParam","hash":{},"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":36}}}));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRDLShowDetails") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":7,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRDLShowDetails") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":0},"end":{"line":11,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
})();

/* Helpers */


Handlebars.registerHelper("getRDLCell", function(metadata, originalDataSource, isSourceParameterisedDP, index, startIndex, bPageGroupBoungRDL) {
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    var indexProperty = "i" + metadata[TEMPLATE_CONSTANTS["PYUNIQUEID"]];
    index = index + 1 + parseInt(startIndex, 10);
    // Logic for data-test-id or AutomationId. Data test id comes as "data-test-id='201805030255400744423'" when test is enabled.
    var pyAutomationId = metadata[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]] ? (metadata[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]).replace(/'/g, ""):"";
    var pyRowAutomationId = pyAutomationId !== "" ? ( pyAutomationId.indexOf("=") > 0 ? pyAutomationId.split("=")[1].trim() : pyAutomationId ) : "";
    // Logic for data-test-id or AutomationId
    pega.ui.template.DataBinder.repeatingIndex[indexProperty] = index;

    var childNode = metadata[TEMPLATE_CONSTANTS["PYTEMPLATES"]] && metadata[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0];	// The section

    if (childNode) {
        var childTemplateName = childNode["pyName"] || childNode[TEMPLATE_CONSTANTS["PYNAME"]];
        if (childTemplateName) {
			

			// Get Context object
			var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
			// Push reference to current context
            if(bPageGroupBoungRDL){ // For pagegroup push the current reference
              currentContext.push(this.getReference());
            }else{ // For pagelist/datapage push the index
	            currentContext.push(index-1); // 0 based index e.g. 2              
            }
          
          if(metadata[TEMPLATE_CONSTANTS["PYROWVISIBILITYWHENID"]] && !pega.ui.TemplateEngine.getCurrentContext().getWhenResult(metadata[TEMPLATE_CONSTANTS["PYROWVISIBILITYWHENID"]])) { /* US-182707: If server row visible when is false for this record then return */
            currentContext.pop();
            return;
          }
          
          
      // Clone metadata
            var clonedChildNode = pega.ui.TemplateEngine.cloneMetadata(childNode);
            
			// Process metadata
            pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode);
            
          	clonedChildNode.pyCell.pyBaseRef = "NAME='BASE_REF' BASE_REF='" + pega.ui.TemplateEngine.ContextObject.getReference() + "'";
            // Storing Repeating Depth Level for client side expressions
            var currentRepeatingDepth = pega.ui.TemplateEngine.createRepeatingDepth(originalDataSource + "(" + index + ")", index);
            pega.ui.TemplateEngine.pushRepeatingDepth(currentRepeatingDepth);
          
			var out = pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null, clonedChildNode);
            // Removing current repeating Depth 
            pega.ui.TemplateEngine.popRepeatingDepth();
          
			currentContext.pop();

			// TODO: Skip for pure template rdl
            out = pega.ui.template.DataBinder.resolveIndex(out);
            var displayString = out;
            if (isSourceParameterisedDP) {
                /* Add base_ref attribute */
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = out;

                /*BUG-BUG-223719 In case of parameterised DP the base_ref is not same as data-repeat-source */
                var baseRef;
              	if(tempDiv.firstChild)
              		baseRef = tempDiv.firstChild.getAttribute("base_ref");

                if (baseRef) {
                    /* BUG-225357: Replacing with the parameterized hash for data-propref as well */
                    var controls = tempDiv.querySelectorAll("[data-propref]");
                    for (var controlCount = 0; controlCount < controls.length; controlCount++) {
                        controls[controlCount].setAttribute("data-propref", controls[controlCount].getAttribute("data-propref").replace(new RegExp(baseRef.substr(0, baseRef.indexOf('.')), 'g'), originalDataSource.substr(0, originalDataSource.indexOf('.'))));
                    }

                    baseRef = baseRef.replace(/^([^\\.]+)/, function() {
                        return originalDataSource.substr(0, originalDataSource.indexOf('.'));
                    });
                    tempDiv.firstChild.setAttribute("base_ref", baseRef);
                    displayString = tempDiv.innerHTML;
                }
            }
            // Logic for data-test-id or AutomationId. Inserting data-test-id for RDL row.
             if (pyRowAutomationId!=="" && displayString) {
               var tempData = document.createElement("div");
               tempData.innerHTML = displayString;
               if(tempData.firstChild) {
                 tempData.firstChild.setAttribute("data-test-id", pyRowAutomationId  + "-" + currentRepeatingDepth.getIndex() );
               }
               displayString = tempData.innerHTML;
            }
            // Logic for data-test-id or AutomationId
            return new Handlebars.SafeString(displayString);
        }
    }
});

pega.ui.template.RenderingEngine.register("RepeatingRow", function(metadata) {
  var index = metadata.index;
  pega.ui.gStackOrder.push(parseInt(index, 10) - 1);
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  
  var childNode = metadata[TEMPLATE_CONSTANTS["PYTEMPLATES"]] && metadata[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0];	// The section

  if (childNode) {
    var childTemplateName = childNode["pyName"] || childNode[TEMPLATE_CONSTANTS["PYNAME"]];
    if (childTemplateName) {
      childNode.pyCell.pyBaseRef = "NAME='BASE_REF' BASE_REF='" + pega.ui.TemplateEngine.ContextObject.getReference() + "'";
      var out = pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null, childNode);
      return out;
    }
  }
});
//static-content-hash-trigger-YUI
