/*
<span>
{{~#if [pyModes].0.pyGenerateATag ~}}   
<a {{{[pyModes].0.pyFormatTypeActionableValue}}} {{{[pyModes].0.hrefValue}}} tabindex='-1' {{{disabledStyle}}} {{{[pyModes].0.pyTargetBlank}}} {{{[pyModes].0.pyDisabledValue}}} fromicon >
{{~/if~}}
{{~#if [pyModes].0.pyCheckImgExturlProp ~}} 
<i class="icons" {{{ [pyModes].0.pyImageSizeValue}}} {{{ [pyModes].0.style }}} {{{ [pyModes].0.proprefAttr }}}>   
{{~/if~}}
<{{{[pyModes].0.pyGenerateStartTag}}} {{{[pyModes].0.pyfromIcon}}} {{{[pyModes].0.styleImgExturlProp}}} {{{pyRelativeMetadataPath}}} {{{[pyModes].0.hrefValue}}} {{~#if [pyModes].0.pyIsSprite ~}} issprite='true' {{~/if~}} {{~#if [pyModes].0.styleImg ~}} {{{[pyModes].0.styleImg}}} {{~/if~}} {{~#if [pyModes].0.pySetFormatTypeActionable ~}} {{{[pyModes].0.pyFormatTypeActionableValue}}} {{~/if~}} {{{[pyModes].0.pyActionStringValue}}} {{{pyAutomationId}}}  data-ctl='Icon' {{{[pyModes].0.srcValue}}}
{{{[pyModes].0.pyStyleNameValue}}} {{{[pyModes].0.pyClassNameValue}}} {{~#if [pyModes].0.pyDisabled ~}}temp{{~/if~}}{{#ifCond [pyModes].0.pyHelperTextType '!=' "none"}} {{~#if [pyModes].0.pyTooltipValue ~}} title="{{[pyModes].0.pyTooltipValue}}" aria-label="{{[pyModes].0.pyTooltipValue}}" {{~/if~}} {{/ifCond}} {{{[pyModes].0.pyClientValidationAttributes}}} {{{[pyModes].0.pyTargetBlank}}} {{{[pyModes].0.pyDisabledValue}}} {{[pyModes].0.pyExpressionIdMeta}} {{{pyName}}} {{{[pyModes].0.clickAttr}}} {{{[pyModes].0.pyTabIndexValue}}} {{{[pyModes].0.pyRole}}} {{{[pyModes].0.pyAltAttr}}}>
{{{[pyModes].0.pyGenerateEndTag}}}
{{~#if [pyModes].0.pyCheckImgExturlProp ~}} </i> {{~/if~}}
{{~#if [pyModes].0.pyGenerateATag ~}} </a> {{~/if~}}
{{{[pyModes].0.pyErrorMessageHTML }}}
</span>
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxIcon'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyFormatTypeActionableValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"hrefValue") : stack1), depth0)) != null ? stack1 : "")
    + " tabindex='-1' "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabledStyle") || (depth0 != null ? lookupProperty(depth0,"disabledStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabledStyle","hash":{},"data":data,"loc":{"start":{"line":3,"column":91},"end":{"line":3,"column":110}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTargetBlank") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDisabledValue") : stack1), depth0)) != null ? stack1 : "")
    + " fromicon >";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i class=\"icons\" "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyImageSizeValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"style") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"proprefAttr") : stack1), depth0)) != null ? stack1 : "")
    + ">";
},"5":function(container,depth0,helpers,partials,data) {
    return "issprite='true'";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"styleImg") : stack1), depth0)) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyFormatTypeActionableValue") : stack1), depth0)) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    return "temp";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":169},"end":{"line":9,"column":299}}})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "title=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "\" aria-label=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "\"";
},"16":function(container,depth0,helpers,partials,data) {
    return "</i>";
},"18":function(container,depth0,helpers,partials,data) {
    return "</a>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyGenerateATag") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyCheckImgExturlProp") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":7,"column":9}}})) != null ? stack1 : "")
    + "<"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyGenerateStartTag") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyfromIcon") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"styleImgExturlProp") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":8,"column":104},"end":{"line":8,"column":132}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"hrefValue") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyIsSprite") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":161},"end":{"line":8,"column":220}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"styleImg") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":221},"end":{"line":8,"column":289}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pySetFormatTypeActionable") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":290},"end":{"line":8,"column":394}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyActionStringValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":8,"column":433},"end":{"line":8,"column":453}}}) : helper))) != null ? stack1 : "")
    + "  data-ctl='Icon' "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"srcValue") : stack1), depth0)) != null ? stack1 : "")
    + "\n"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyStyleNameValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClassNameValue") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDisabled") : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":70},"end":{"line":9,"column":116}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyHelperTextType") : stack1),"!=","none",{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":116},"end":{"line":9,"column":311}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClientValidationAttributes") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTargetBlank") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDisabledValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyExpressionIdMeta") : stack1), depth0))
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":9,"column":460},"end":{"line":9,"column":472}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"clickAttr") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTabIndexValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyRole") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyAltAttr") : stack1), depth0)) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyGenerateEndTag") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyCheckImgExturlProp") : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":0},"end":{"line":11,"column":58}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyGenerateATag") : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":52}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1), depth0)) != null ? stack1 : "")
    + "\n</span>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pxIcon", function(componentInfo) {
    var context = pega.ui.TemplateEngine.getCurrentContext();    
    var ct = pega.ui.ChangeTrackerMap.getTracker();
    var pyCell = componentInfo["pyCell"];
  	
  	/* new infra changes -start */
  	
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    pyCell["pyModes"] = pyCell[TEMPLATE_CONSTANTS["PYMODES"]];
    pyCell.pyAutomationId = pyCell[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]];
  	pyCell["pyModes"][0].pyActionStringID = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]] ;
  	pyCell["pyModes"][0].pyTooltip = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYTOOLTIP"]] ;
    pyCell["pyModes"][0].pyHelperTextType = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYHELPERTEXTTYPE"]] || "tooltip";
  	pyCell["pyModes"][0].pyIconSource = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYICONSOURCE"]] ;
    pyCell["pyModes"][0].pyClassName = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYCUSTOMCLASS"]] ;
  	pyCell["pyModes"][0].pyHasActionConfigured = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYHASACTIONCONFIGURED"]] ;
  	pyCell["pyModes"][0].isClickBehaviorConfigured = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["ISCLICKBEHAVIORCONFIGURED"]] ;
    pyCell["pyModes"][0].pyErrorMessageHTML = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]] ;
  	pyCell["pyModes"][0]["pyClientValidationAttributes"] =  pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYCLIENTVALIDATIONATTRIBUTES"]]; 
  	
  	/*new infra changes -end */
  
    pyCell.pyRelativeMetadataPath = "data-template";
    var pyModes1 = pyCell["pyModes"][0];
  	var localizedFormatvalue = context.getLocalizedValue(pyModes1.pyFormatValue, 'pyCaption');
	var pyImageVal = pyModes1.pyImage;
	var bDisabled = false;
  	var expResults = null;
    var isSprite = (pyModes1.pyIsSprite == "true");
    pyModes1.pyIsSprite = isSprite;
    pyModes1.pyRole = "role='img'";

   if (!pyModes1.pyFormatTypeActionable || pyModes1.pyFormatTypeActionable == "") {
        pyModes1.pyFormatTypeActionable = "none";
    }
	if (pyModes1.pyFormatTypeActionable == "email") {
        pyModes1.pyFormatValue = "mailto:" + localizedFormatvalue;
    }
    else if (pyModes1.pyFormatTypeActionable == "tel") {
        pyModes1.pyFormatValue = "tel:" + localizedFormatvalue;
    }
    else if (pyModes1.pyFormatTypeActionable == "url") {
        pyModes1.pyFormatValue = localizedFormatvalue;
    }else{
      	pyModes1.pyFormatValue = "";
    }

    if (pyModes1.pyIconSource == "standardIcon" || (pyModes1.pyIconSource == "image" && isSprite)) {
        pyModes1.pyGenerateStartTag = "a";
        pyModes1.pyGenerateEndTag = "</a>";
        if (pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable != "none") {
            pyModes1.pyfromIcon = "fromicon";
        }
        if (pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable == "url") {
            pyModes1.pyTargetBlank = "target='_blank'";
        }
    }
    else if (pyModes1.pyIconSource == "image" || pyModes1.pyIconSource == "property" || pyModes1.pyIconSource == "exturl") {
        pyModes1.pyGenerateStartTag = "img";
        pyModes1.pyCheckImgExturlProp = true;
        pyModes1.pyRole = '';
    }
    else /*if (pyModes1.pyIconSource == "styleclass") */{
        pyModes1.pyGenerateStartTag = "i";
        pyModes1.pyGenerateEndTag = "</i>";
    }

    if (pyModes1.pyIconSource != "standardIcon" && pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable != "none" && !isSprite) {
        pyModes1.pyGenerateATag = true;
        if (pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable == "url") {
            pyModes1.pyTargetBlank = "target='_blank'";
        }
    }
    else {
        pyModes1.pySetFormatTypeActionable = true;
    }
  
  if (pyModes1.pyFormatTypeActionable !== 'none') pyModes1.pyRole = "role='link'";
  
  var tooltip = pyModes1.pyTooltip ? context.getLocalizedValue(pyModes1.pyTooltip, 'pyActionPrompt') : "";
  
  /*
	var privilegeRes = null;
   
    if(componentInfo.pxWhenIdentifiers && componentInfo.pxWhenIdentifiers.pyDisablePrivilegeId){
       privilegeRes = context.getPrivilegeResult(componentInfo.pxWhenIdentifiers.pyDisablePrivilegeId);
    }
	*/
    var privilegeRes = componentInfo.pyDisablePrivilege;
    if(privilegeRes != null && privilegeRes == false){
       bDisabled = true;
    } else if(pyModes1.disabled == "always"){
        bDisabled = true;
    } else {
        var expResults = null;
        if (pyModes1.pyExpressionId) {
            pyModes1.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(pyModes1.pyExpressionId);    
          	expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(pyModes1.pyExpressionId);
        } else{
          pyModes1.pyExpressionIdMeta = "";
        }
		
        if(expResults && expResults[pega.ui.ExpressionEvaluator.DISABLE_WHEN]){
          bDisabled = true;
        } else if(pyModes1.pyDisabled) {         
            bDisabled = true;
        }
     }
    if (bDisabled) {
        if (isSprite) {
            pyModes1.style = "style='overflow:hidden;background:url(" + pyModes1.src + ") no-repeat; background-position:" + pyModes1.leftOffset + "px " + pyModes1.pyIconHeight * (-2) + "px; width:" + pyModes1.pyIconWidth + "px; height:" + pyModes1.pyIconHeight + "px;'";
          if(pyModes1.pyGenerateStartTag =="a"){
            pyModes1.styleImg = pyModes1.style;
          } else {
          	pyModes1.styleImg = "style='overflow:hidden;background:url(" + pyModes1.src + ") no-repeat; background-position:" + pyModes1.leftOffset + "px " + pyModes1.pyIconHeight * (-2) + "px;'";  
          }
        }
      /** Added below code for BUG-612592 Fix*/
      if(pyModes1.pyCheckImgExturlProp){
        pyModes1.styleImgExturlProp = pyModes1.style;
      }
     /** End **/
        if (tooltip) {
            pyModes1.pyTooltipValue =  tooltip ;
        }
      	pyModes1.pyDisabled = bDisabled;
        pyModes1.pyDisabledValue = "disabled='disabled' aria-disabled='true'";
        if(pyModes1.pyIconSource == "standardIcon" || isSprite) {
          pyModes1.pyDisabledValue += "tabindex='-1'";
        }
        if (pyModes1.pyIconSource == "styleclass" && tooltip && pyModes1.pyCheckImgExturlProp) {
            pyModes1.pyAltAttr = "alt='"+ tooltip + "'" ;
        }
        if (pyModes1.pyFormatValue) {
            pyModes1.pyFormatTypeActionableValue = "href_original='" + pyModes1.pyFormatValue + "'";
        } else if (!pyModes1.pyFormatValue) {
            pyModes1.pyFormatTypeActionableValue = "href_original=''";
        }
        if (pyModes1.pyIconSource != "standardIcon") {
            if (pyModes1.pyIconSource == "property" || pyModes1.pyIconSource == "exturl" || pyModes1.pyIconSource == "image") {
                pyModes1.pyClassNameValue = "class='cursordefault'";
            }
            if (pyModes1.pyIconSource == "styleclass") {
                pyModes1.pyClassNameValue = "class='cursordefault " + context.getPropertyValue(pyModes1.pyClassName) + "_disabled'";
            }

        } else if (pyModes1.pyIconSource == "standardIcon") {
            pyModes1.pyClassNameValue = "class='cursordefault " + pyModes1.pyClassName + "_disabled'";
            pyModes1.pyExpandId = "id='expandicon'";
        }
        if (pyModes1.pyIconSource == "property" || pyModes1.pyIconSource == "exturl" || pyModes1.pyIconSource == "styleclass" || ((pyModes1.pyIconSource == "standardIcon" || isSprite) && pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable == "none")) {
            pyModes1.clickAttr = " onclick_func='pd(event);' ";
        }
        pyModes1.hrefValue = "href='#'";
        pyModes1.disabledStyle = "style='disabledStyle' ";
    } else {
        if (isSprite) {
            pyModes1.style = "style='overflow:hidden;background:url(" + pyModes1.src + ") no-repeat; background-position:" + pyModes1.leftOffset + "px top; width:" + pyModes1.pyIconWidth + "px; height:" + pyModes1.pyIconHeight + "px;'";
          if(pyModes1.pyGenerateStartTag =="a"){
            pyModes1.styleImg = pyModes1.style;
          } else {
           pyModes1.styleImg = "style='overflow:hidden;background:url(" + pyModes1.src + ") no-repeat; background-position:" + pyModes1.leftOffset + "px top;'"; 
          }
        }
      /** Added below code for BUG-612592 Fix*/
     if(pyModes1.pyCheckImgExturlProp){
        pyModes1.styleImgExturlProp = pyModes1.style;
      }
      /** End **/
        if ((pyModes1.isClickBehaviorConfigured != "true") && (pyModes1.pyIconSource == "property" || pyModes1.pyIconSource == "exturl" || pyModes1.pyIconSource == "image")) {
            pyModes1.pyClassNameValue = "class='cursordefault'";
        }
        if (pyModes1.pyIconSource == "styleclass") {
            pyModes1.pyClassNameValue = "class='";
            if (pyModes1.isClickBehaviorConfigured != "true") {
                pyModes1.pyClassNameValue += "cursordefault ";
            }
          	pyModes1.pyClassNameValue += "icons ";
          	if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
              	pyModes1.pyClassNameValue += pega.ui.ControlTemplate.crossScriptingFilter(context.getPropertyValue(pyModes1.pyClassName)) + "'";
            } else {
            	pyModes1.pyClassNameValue += context.getPropertyValue(pyModes1.pyClassName) + "'";
            }
        }
        if (pyModes1.pyIconSource == "standardIcon") {
            pyModes1.pyExpandId = "id='expandicon'";
            pyModes1.pyClassNameValue = "class='";
            if (pyModes1.isClickBehaviorConfigured != "true") {
                pyModes1.pyClassNameValue += "cursordefault ";
            }
            pyModes1.pyClassNameValue += pyModes1.pyClassName + "'";
          	pyModes1.pyFormatTypeActionableValue = "href=''";
        }
        if (tooltip) {
            pyModes1.pyTooltipValue =  tooltip ;
        }
        if (pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable != "none") {
            if (pyModes1.pyFormatValue) {
                pyModes1.pyFormatTypeActionableValue = "href='" + pyModes1.pyFormatValue + "'";
            } else if (!pyModes1.pyFormatValue) {
                pyModes1.pyFormatTypeActionableValue = "href=''";
            }
        }
        pyModes1.disabledStyle = '';
        if (pyModes1.pyIconSource == "styleclass" || (pyModes1.pyIconSource == "standardIcon" && pyModes1.pyFormatTypeActionable && pyModes1.pyFormatTypeActionable == "none")) {
            pyModes1.clickAttr = " onclick='pd(event);' ";
        }
        if (pyModes1.pyIconSource != "standardIcon" && tooltip && pyModes1.pyCheckImgExturlProp)
            pyModes1.pyAltAttr = "alt='"+ tooltip + "'" ;
    }
    if (!pyModes1.pyClientValidationAttributes) pyModes1.pyClientValidationAttributes = "";
    if (!pyModes1.pyErrorMessageHTML) pyModes1.pyErrorMessageHTML = "";
    if (pyModes1.pyStyleName) {
        pyModes1.pyStyleNameValue = pyModes1.pyStyleName;
    }
    if (pyModes1.pyIconSource == "property") {
      	if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
          	pyModes1.srcValue = "src='" + pega.ui.ControlTemplate.crossScriptingFilter(context.getPropertyValue(pyModes1.pyIconProperty)) + "'";
        } else {
        	pyModes1.srcValue = "src='" + context.getPropertyValue(pyModes1.pyIconProperty) + "'";
        }
    }
    if (pyModes1.pyIconSource == "exturl" || (pyModes1.pyIconSource == "image" && !isSprite)) {
      	/* encoding the url at server side */
        pyModes1.srcValue = "src='" + pyModes1.src + "'";
    }
    if (pyModes1.pyHasActionConfigured) {
        if (pyModes1.pyIconSource != "standardIcon" && (!isSprite || (isSprite && pyModes1.pyFormatTypeActionableValue === undefined))) {
            pyModes1.pyTabIndexValue = "tabindex='0'";
        }
      if (pyModes1.pyFormatTypeActionable === "none") pyModes1.pyRole = "role='button'";
    }
    if (pyModes1.pyFormatTypeActionable != "none") {
        pyModes1.pyActionString = null;
    }
  if(pyModes1.pyActionStringID){
    pyModes1.pyActionStringValue = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes1.pyActionStringID);
    // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
   pyModes1.pyActionStringValue= pyModes1.pyActionStringValue.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function(){
               return "#~"+arguments[2]+"~#";         
        });
  } 
  var nameAttr= "";
  if(pyModes1.generateName){
    var referenceString = context.getReference();
    if(referenceString){
      var isParamDP = context.getPropertyValue(".$isParameterized");
      if(isParamDP == "true"){
        referenceString = context.getPropertyValue(".$pzPageNameBase");
      }
    }
    var streamName = pyCell.pyStreamName;
    var cellID = pyCell.pyCellID;
    nameAttr = streamName + "_" + referenceString + "_" + cellID;
    nameAttr = "name='" + nameAttr +"'";
  }
  	pyCell.pyName = nameAttr;
    return Handlebars.templates['pxIcon'](pyCell);
});
//static-content-hash-trigger-GCC