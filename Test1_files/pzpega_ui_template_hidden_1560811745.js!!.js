/*
<input {{{pyRelativeMetadataPath}}} {{{[pyModes].1.pyActionStringValue}}} {{#ifCond pyAutomationId '!=' ""}} data-test-id="{{{pyAutomationId}}}" {{/ifCond}} type="hidden"  id="{{{pyID}}}" 
value="{{pyInputValue}}" name="{{{pyName}}}" {{{[pyModes].0.pega_attributes}}} {{{[pyModes].0.pyClientValidationAttributes}}}/>
{{{[pyModes].0.pyErrorMessageHTML}}}
*/


(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxHidden'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":1,"column":123},"end":{"line":1,"column":143}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":35}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"pyActionStringValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":74},"end":{"line":1,"column":156}}})) != null ? stack1 : "")
    + " type=\"hidden\"  id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyID") || (depth0 != null ? lookupProperty(depth0,"pyID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyID","hash":{},"data":data,"loc":{"start":{"line":1,"column":176},"end":{"line":1,"column":186}}}) : helper))) != null ? stack1 : "")
    + "\" \nvalue=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInputValue") || (depth0 != null ? lookupProperty(depth0,"pyInputValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInputValue","hash":{},"data":data,"loc":{"start":{"line":2,"column":7},"end":{"line":2,"column":23}}}) : helper)))
    + "\" name=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":2,"column":31},"end":{"line":2,"column":43}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pega_attributes") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClientValidationAttributes") : stack1), depth0)) != null ? stack1 : "")
    + "/>\n"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1), depth0)) != null ? stack1 : "");
},"useData":true});
})();



pega.ui.template.RenderingEngine.register("pxHidden", function(componentInfo){ 
  	var currentContext = pega.ui.TemplateEngine.getCurrentContext();
	var ct = pega.ui.ChangeTrackerMap.getTracker();
	var pyCellRef = componentInfo["pyCell"];
	var pyCell = pyCellRef;
  	
  /* new infra changes -start */
  	var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    pyCell["pyModes"] = pyCell[TEMPLATE_CONSTANTS["PYMODES"]];
    pyCell.pyAutomationId = pyCell[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]];
  	pyCell["pyModes"][1].pyActionStringID = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]] ;
  	pyCell["pyModes"][1].pyErrorMessageHTML = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]] ;
  	pyCell["pyModes"][1]["pyClientValidationAttributes"] =  pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYCLIENTVALIDATIONATTRIBUTES"]] ; 
  	/*new infra changes -end */	
  
  	var ctrlProperty = pyCell.pyValue;
    pyCell.pyRelativeMetadataPath = "data-template";
  	pyCell["pyInputValue"] =  currentContext.getPropertyValue(ctrlProperty);
	  pyCell.pyName = currentContext.getEntryHandle(ctrlProperty);
    pyCell.pyID = currentContext.getID(ctrlProperty,componentInfo.pyName);
  	var pyModes1 = pyCell["pyModes"][1];
  	if(!pyModes1.pyClientValidationAttributes) pyModes1.pyClientValidationAttributes = "";
  	if(!pyModes1.pyErrorMessageHTML) pyModes1.pyErrorMessageHTML = "";
  	if(!pyModes1.pega_attributes) pyModes1.pega_attributes = "";
  
  
  if(pyModes1.pyActionStringID) {
    	pyModes1.pyActionStringValue = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes1.pyActionStringID);
    	// The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
      	if(typeof(pyModes1.pyActionStringValue) === "string") {
			pyModes1.pyActionStringValue= pyModes1.pyActionStringValue.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function(){
               return "#~"+arguments[2]+"~#";         
        	});
        }
    }	
  
return  Handlebars.templates['pxHidden'](pyCell);
});
//static-content-hash-trigger-GCC