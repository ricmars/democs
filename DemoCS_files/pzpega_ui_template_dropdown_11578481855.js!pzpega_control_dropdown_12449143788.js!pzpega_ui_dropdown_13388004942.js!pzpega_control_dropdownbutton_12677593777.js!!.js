/*
{{#if [pyModes].0.pySpin}}<div class="select-spin-wrapper">{{/if}}
{{~#ifCond [pyModes].0.showActionButton '==' true~}}
	<input type='hidden' data-ctl='["Dropdown"]' {{{disabled}}} name="{{{[pyModes].0.pyNameTemp}}}" {{{[pyModes].0.pyActionString}}} value="{{{accessibilityValue}}}" tabindex="-1">
{{~/ifCond~}}
<select {{{pyRelativeMetadataPath}}} {{{[pyModes].0.pyLoadMode}}} {{{[pyModes].0.pyDataConfig}}} {{~#ifCond [pyModes].0.showActionButton '==' false~}} {{{[pyModes].0.pyActionString}}} {{~/ifCond~}} {{#ifCond pyAutomationId '!=' ""}} data-test-id="{{{pyAutomationId}}}" {{/ifCond}} data-ctl='["Dropdown"]' {{~#if [pyModes].0.pyRequired ~}}aria-required="true"{{~/if~}}  aria-invalid="{{~#ifCond [pyModes].0.pyErrorMessageHTML '!=' "" ~}}true{{else}}false{{~/ifCond~}}"  id="{{{[pyModes].0.pyID}}}" {{{disabled}}} {{~#ifCond [pyModes].0.pyStyleNameOther '!=' ""~}}class="{{{[pyModes].0.pyStyleNameOther}}}"{{~/ifCond~}} {{{[pyModes].0.dpNameAttribute}}} style="width:{{{calcWidth}}}" {{~#if title ~}}{{~#ifCond pyHelperTextType '==' "tooltip"~}} title="{{title}}" {{~/ifCond~}} {{~/if~}} {{~#ifCond [pyModes].0.showActionButton '==' false~}}  name="{{{[pyModes].0.pyNameTemp}}}" {{~/ifCond~}} {{~#ifCond [pyModes].0.pyClientValidationAttributes '!=' ""~}}{{{[pyModes].0.pyClientValidationAttributes}}}{{~/ifCond~}} {{[pyModes].0.pyExpressionIdMeta}} {{#if pyCellId}}CellId="{{{pyCellId}}}"{{/if}} aria-describedby="{{{[pyModes].0.pyNameTemp}}}Error {{{helperTextID}}}" >
{{#if pyHasNoSelection}}
  <option value='' title="{{phTooltip}}">{{noSelection}}</option>
{{/if}}
{{#results}}
{{~#ifCond grpStart '==' true~}}<optgroup label="{{gp}}">{{~/ifCond~}}
  <option value="{{vp}}" title="{{tp}}"  {{~#ifCond selectedOpt '==' true~}} selected {{~/ifCond~}}>{{cp}}</option>
{{~#ifCond grpEnd '==' true~}}</optgroup>{{~/ifCond~}}
{{/results}}
{{#if [pyModes].0.pySpecifiedMode}}
  {{~#ifCond pyValue '!=' ""~}}
    <option value="{{pyValue}}" selected>{{pyValue}}</option>
    {{~/ifCond~}}
{{/if}}
</select>
{{~#ifCond [pyModes].0.showActionButton '==' true~}}
	<input {{{disabled}}} name="SB_{{{[pyModes].0.pyNameTemp}}}" type='button' data-ctl='["DropdownButton"]' value="{{{[pyModes].0.pySelectionButtonLabel}}}" style='width:auto;'>
{{~/ifCond~}}
{{#if [pyModes].0.pySpin}}<div class="spin"></div><div class="spin-overlay"></div></div>{{/if}}
{{~#if title ~}}
	{{~#ifCond pyHelperTextType '==' "inline"~}}
		<div class="helper-text" id="{{{[pyModes].0.pyID}}}_helperText">{{title}}</div>
	{{~/ifCond~}}
	{{~#if (ifCond (ifCond pyHelperLabel 'eq' false) 'and' (ifCond pyHelperTextType 'eq' "icon")) ~}}
		<i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon" id="{{{[pyModes].0.pyID}}}_helperText" title="{{title}}" onclick="pd(event);" tabindex="-1" role="img" aria-label="{{title}}"></i>
	{{~/if~}}
  {{~#if (ifCond (ifCond pyHelperLabelOnFocus 'eq' false) 'and' (ifCond pyHelperTextType 'eq' "icon_on_focus")) ~}}
  <div class="helper-icon-tooltip-parent">
		<i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon" id="{{{[pyModes].0.pyID}}}_helperText" aria-lebel="help" data-hover="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{title}}&quot;]]]" data-click="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{title}}&quot;]]]" data-keydown="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{title}}&quot;],,&quot;enter&quot;]]" onmouseover="pega.c.cbe.processHoverEvent(event)" role="button" tabindex="{{pyHelperTabIndex}}" ></i>
    </div>
	{{~/if~}}
{{~/if~}}
{{~#ifCond [pyModes].0.pyErrorMessageHTML '!=' ""~}}{{{[pyModes].0.pyErrorMessageHTML}}}{{~/ifCond~}}
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxDropdown'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<div class=\"select-spin-wrapper\">";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input type='hidden' data-ctl='[\"Dropdown\"]' "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabled") || (depth0 != null ? lookupProperty(depth0,"disabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabled","hash":{},"data":data,"loc":{"start":{"line":3,"column":46},"end":{"line":3,"column":60}}}) : helper))) != null ? stack1 : "")
    + " name=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyNameTemp") : stack1), depth0)) != null ? stack1 : "")
    + "\" "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyActionString") : stack1), depth0)) != null ? stack1 : "")
    + " value=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"accessibilityValue") || (depth0 != null ? lookupProperty(depth0,"accessibilityValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"accessibilityValue","hash":{},"data":data,"loc":{"start":{"line":3,"column":137},"end":{"line":3,"column":161}}}) : helper))) != null ? stack1 : "")
    + "\" tabindex=\"-1\">";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyActionString") : stack1), depth0)) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":5,"column":247},"end":{"line":5,"column":267}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"9":function(container,depth0,helpers,partials,data) {
    return "aria-required=\"true\"";
},"11":function(container,depth0,helpers,partials,data) {
    return "true";
},"13":function(container,depth0,helpers,partials,data) {
    return "false";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "class=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyStyleNameOther") : stack1), depth0)) != null ? stack1 : "")
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperTextType") : depth0),"==","tooltip",{"name":"ifCond","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":698},"end":{"line":5,"column":775}}})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":5,"column":751},"end":{"line":5,"column":760}}}) : helper)))
    + "\"";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyNameTemp") : stack1), depth0)) != null ? stack1 : "")
    + "\"";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClientValidationAttributes") : stack1), depth0)) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "CellId=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyCellId") || (depth0 != null ? lookupProperty(depth0,"pyCellId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCellId","hash":{},"data":data,"loc":{"start":{"line":5,"column":1072},"end":{"line":5,"column":1086}}}) : helper))) != null ? stack1 : "")
    + "\"";
},"26":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <option value='' title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"phTooltip") || (depth0 != null ? lookupProperty(depth0,"phTooltip") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"phTooltip","hash":{},"data":data,"loc":{"start":{"line":7,"column":26},"end":{"line":7,"column":39}}}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"noSelection") || (depth0 != null ? lookupProperty(depth0,"noSelection") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noSelection","hash":{},"data":data,"loc":{"start":{"line":7,"column":41},"end":{"line":7,"column":56}}}) : helper)))
    + "</option>\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"grpStart") : depth0),"==",true,{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":10,"column":70}}})) != null ? stack1 : "")
    + "<option value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"vp") || (depth0 != null ? lookupProperty(depth0,"vp") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"vp","hash":{},"data":data,"loc":{"start":{"line":11,"column":17},"end":{"line":11,"column":23}}}) : helper)))
    + "\" title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tp") || (depth0 != null ? lookupProperty(depth0,"tp") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tp","hash":{},"data":data,"loc":{"start":{"line":11,"column":32},"end":{"line":11,"column":38}}}) : helper)))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"selectedOpt") : depth0),"==",true,{"name":"ifCond","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":41},"end":{"line":11,"column":99}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cp") || (depth0 != null ? lookupProperty(depth0,"cp") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cp","hash":{},"data":data,"loc":{"start":{"line":11,"column":100},"end":{"line":11,"column":106}}}) : helper)))
    + "</option>"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"grpEnd") : depth0),"==",true,{"name":"ifCond","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":12,"column":54}}})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<optgroup label=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"gp") || (depth0 != null ? lookupProperty(depth0,"gp") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"gp","hash":{},"data":data,"loc":{"start":{"line":10,"column":49},"end":{"line":10,"column":55}}}) : helper)))
    + "\">";
},"31":function(container,depth0,helpers,partials,data) {
    return "selected";
},"33":function(container,depth0,helpers,partials,data) {
    return "</optgroup>";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyValue") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":2},"end":{"line":17,"column":17}}})) != null ? stack1 : "");
},"36":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<option value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyValue") || (depth0 != null ? lookupProperty(depth0,"pyValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyValue","hash":{},"data":data,"loc":{"start":{"line":16,"column":19},"end":{"line":16,"column":30}}}) : helper)))
    + "\" selected>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyValue") || (depth0 != null ? lookupProperty(depth0,"pyValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyValue","hash":{},"data":data,"loc":{"start":{"line":16,"column":41},"end":{"line":16,"column":52}}}) : helper)))
    + "</option>";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabled") || (depth0 != null ? lookupProperty(depth0,"disabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabled","hash":{},"data":data,"loc":{"start":{"line":21,"column":8},"end":{"line":21,"column":22}}}) : helper))) != null ? stack1 : "")
    + " name=\"SB_"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyNameTemp") : stack1), depth0)) != null ? stack1 : "")
    + "\" type='button' data-ctl='[\"DropdownButton\"]' value=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pySelectionButtonLabel") : stack1), depth0)) != null ? stack1 : "")
    + "\" style='width:auto;'>";
},"40":function(container,depth0,helpers,partials,data) {
    return "<div class=\"spin\"></div><div class=\"spin-overlay\"></div></div>";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperTextType") : depth0),"==","inline",{"name":"ifCond","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":1},"end":{"line":27,"column":14}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabel") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":28,"column":16},"end":{"line":28,"column":49}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperTextType") : depth0),"eq","icon",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":28,"column":56},"end":{"line":28,"column":93}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":28,"column":8},"end":{"line":28,"column":94}}}),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":1},"end":{"line":30,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabelOnFocus") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":31,"column":17},"end":{"line":31,"column":57}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperTextType") : depth0),"eq","icon_on_focus",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":31,"column":64},"end":{"line":31,"column":110}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":31,"column":9},"end":{"line":31,"column":111}}}),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":2},"end":{"line":35,"column":10}}})) != null ? stack1 : "");
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"helper-text\" id=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyID") : stack1), depth0)) != null ? stack1 : "")
    + "_helperText\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":26,"column":66},"end":{"line":26,"column":75}}}) : helper)))
    + "</div>";
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i data-ctl=\"Icon\" class=\"icons pi pi-help pi-link helper-icon\" id=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyID") : stack1), depth0)) != null ? stack1 : "")
    + "_helperText\" title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":29,"column":112},"end":{"line":29,"column":121}}}) : helper)))
    + "\" onclick=\"pd(event);\" tabindex=\"-1\" role=\"img\" aria-label=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":29,"column":181},"end":{"line":29,"column":190}}}) : helper)))
    + "\"></i>";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"helper-icon-tooltip-parent\">\n		<i data-ctl=\"Icon\" class=\"icons pi pi-help pi-link helper-icon\" id=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyID") : stack1), depth0)) != null ? stack1 : "")
    + "_helperText\" aria-lebel=\"help\" data-hover=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":33,"column":201},"end":{"line":33,"column":210}}}) : helper)))
    + "&quot;]]]\" data-click=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":33,"column":299},"end":{"line":33,"column":308}}}) : helper)))
    + "&quot;]]]\" data-keydown=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":33,"column":399},"end":{"line":33,"column":408}}}) : helper)))
    + "&quot;],,&quot;enter&quot;]]\" onmouseover=\"pega.c.cbe.processHoverEvent(event)\" role=\"button\" tabindex=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyHelperTabIndex") || (depth0 != null ? lookupProperty(depth0,"pyHelperTabIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHelperTabIndex","hash":{},"data":data,"loc":{"start":{"line":33,"column":512},"end":{"line":33,"column":532}}}) : helper)))
    + "\" ></i>\n    </div>";
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1), depth0)) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pySpin") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":66}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"showActionButton") : stack1),"==",true,{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "<select "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":36}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyLoadMode") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDataConfig") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"showActionButton") : stack1),"==",false,{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":97},"end":{"line":5,"column":197}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":198},"end":{"line":5,"column":280}}})) != null ? stack1 : "")
    + " data-ctl='[\"Dropdown\"]'"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyRequired") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":305},"end":{"line":5,"column":367}}})) != null ? stack1 : "")
    + "aria-invalid=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":5,"column":383},"end":{"line":5,"column":466}}})) != null ? stack1 : "")
    + "\"  id=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyID") : stack1), depth0)) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabled") || (depth0 != null ? lookupProperty(depth0,"disabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabled","hash":{},"data":data,"loc":{"start":{"line":5,"column":497},"end":{"line":5,"column":511}}}) : helper))) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyStyleNameOther") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":512},"end":{"line":5,"column":617}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"dpNameAttribute") : stack1), depth0)) != null ? stack1 : "")
    + " style=\"width:"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"calcWidth") || (depth0 != null ? lookupProperty(depth0,"calcWidth") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"calcWidth","hash":{},"data":data,"loc":{"start":{"line":5,"column":665},"end":{"line":5,"column":680}}}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":682},"end":{"line":5,"column":785}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"showActionButton") : stack1),"==",false,{"name":"ifCond","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":786},"end":{"line":5,"column":890}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClientValidationAttributes") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":891},"end":{"line":5,"column":1012}}})) != null ? stack1 : "")
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyExpressionIdMeta") : stack1), depth0))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyCellId") : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":1048},"end":{"line":5,"column":1094}}})) != null ? stack1 : "")
    + " aria-describedby=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyNameTemp") : stack1), depth0)) != null ? stack1 : "")
    + "Error "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"helperTextID") || (depth0 != null ? lookupProperty(depth0,"helperTextID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helperTextID","hash":{},"data":data,"loc":{"start":{"line":5,"column":1147},"end":{"line":5,"column":1165}}}) : helper))) != null ? stack1 : "")
    + "\" >\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHasNoSelection") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":8,"column":7}}})) != null ? stack1 : "");
  stack1 = ((helper = (helper = lookupProperty(helpers,"results") || (depth0 != null ? lookupProperty(depth0,"results") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"results","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":0},"end":{"line":13,"column":12}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"results")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pySpecifiedMode") : stack1),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "</select>"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"showActionButton") : stack1),"==",true,{"name":"ifCond","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":0},"end":{"line":22,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pySpin") : stack1),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":95}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":0},"end":{"line":36,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":0},"end":{"line":37,"column":101}}})) != null ? stack1 : "");
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pxDropdown", function(componentInfo, fromReloadCell, asyncRenderCallback) {
    var prop1 = {};
    var dataPage = {};
    var dataPageParamPage;
    var params = {};
    var templatePage = {};
    var currentContext = pega.ui.TemplateEngine.getCurrentContext();
    try {
        if (!fromReloadCell) {
            //templatePage = componentInfo.templatePage.getJSONObject();
            templatePage = componentInfo;
        } else {
            templatePage = componentInfo;
        }
        prop1 = templatePage.pyCell;

        /* new infra changes -start */

        var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
        prop1["pyModes"] = prop1[TEMPLATE_CONSTANTS["PYMODES"]];
        prop1.pyAutomationId = prop1[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]];
        prop1["pyModes"][0].pyStyleNameOther = prop1["pyModes"][0][TEMPLATE_CONSTANTS["PYSTYLENAMEOTHER"]];
        prop1["pyModes"][0].pyActionStringID = prop1["pyModes"][0][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]];
        prop1.pyTooltip = prop1[TEMPLATE_CONSTANTS["PYTOOLTIP"]];
        prop1.pyHelperTextType = prop1[TEMPLATE_CONSTANTS["PYHELPERTEXTTYPE"]] || "tooltip";
        prop1["pyModes"][0].pyTooltip = prop1["pyModes"][0][TEMPLATE_CONSTANTS["PYTOOLTIP"]];
        prop1["pyModes"][0].pyErrorMessageHTML = prop1["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
        prop1["pyModes"][0]["pyClientValidationAttributes"] = prop1["pyModes"][0][TEMPLATE_CONSTANTS["PYCLIENTVALIDATIONATTRIBUTES"]];
        /*new infra changes -end */

        var pyModes = prop1.pyModes[0];
        if (pyModes.pyActionStringID) {
            pyModes.pyActionString = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes.pyActionStringID);
            // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
            if (typeof(pyModes.pyActionString) === "string") {
                pyModes.pyActionString = pyModes.pyActionString.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function() {
                    return "#~" + arguments[2] + "~#";
                });
            }
        }
        prop1.pyHelperTabIndex = -1;
        if(prop1.pyHelperTextType === "icon_on_focus"){
          prop1.pyHelperTabIndex = 0;
        }

        if (prop1["pyModes"][0].pyErrorMessageHTML) {
            prop1["pyModes"][0].pyStyleNameOther = prop1["pyModes"][0].pyStyleNameOther + " ErrorShade";
        }
      
        var ignoreClientValue = false;
        if (prop1["pyModes"][0].disabled == "always") {
            prop1.disabled = " disabled ";
            prop1["pyModes"][0].disabled = prop1.disabled;
        }
        
        prop1["pyModes"][0].showActionButton = false;
        if(prop1["pyModes"][0].hasChangeEvent === "true" && prop1["pyModes"][0].pyUseAccessibleDropdown === "true"){
	        prop1["pyModes"][0].showActionButton = true;
        }
        
        var _pySelectionButtonLabel = prop1["pyModes"][0].pySelectionButtonLabel;
        if(_pySelectionButtonLabel == "" || _pySelectionButtonLabel == null){
	          _pySelectionButtonLabel = "Select";
         }

        var pySelectionButtonLabelLocalized = currentContext.getLocalizedValue(_pySelectionButtonLabel, "pyButtonLabel", "");
        
        if(!pySelectionButtonLabelLocalized){
	            pySelectionButtonLabelLocalized = pega.clientTools.getLocalizedTextForString("pyButtonLabel", prop1["pyModes"][0].pySelectionButtonLabel);
          }
        prop1["pyModes"][0].pySelectionButtonLabel = pySelectionButtonLabelLocalized;

        var exprId = prop1["pyModes"][0].pyExpressionId;
        var expResults = null;
        if (exprId) {
            prop1["pyModes"][0].pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(exprId);
            expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(exprId);
        }
        if (expResults != null && Object.keys(expResults).length != 0) {
            prop1.disabled = expResults[pega.ui.ExpressionEvaluator.DISABLE_WHEN] ? " disabled " : "";
            prop1["pyModes"][0].disabled = prop1.disabled;
            var datarequired = expResults ? expResults[pega.ui.ExpressionEvaluator.REQUIRED_WHEN] ? "true" : expResults[pega.ui.ExpressionEvaluator.REQUIRED_WHEN] == undefined ? undefined : "false" : "false";
            if (datarequired == "false" && prop1["pyModes"][0]["pyClientValidationAttributes"]) {
                prop1["pyModes"][0]["pyClientValidationAttributes"] = prop1["pyModes"][0]["pyClientValidationAttributes"].replace("required", "");
            }
        } else { /* disabled/required when or expression with run on client disabled */
            if (prop1["pyModes"][0].pyDisabled) {
                prop1.disabled = " disabled ";
                prop1["pyModes"][0].disabled = prop1.disabled;
                ignoreClientValue = true;
            }
            if (prop1["pyModes"][0].pyRequired === false && prop1["pyModes"][0]["pyClientValidationAttributes"]) {
                prop1["pyModes"][0]["pyClientValidationAttributes"] = prop1["pyModes"][0]["pyClientValidationAttributes"].replace("required", "");
            }
        }
        if (prop1["pyModes"][0]["pyClientValidationAttributes"] && prop1["pyModes"][0]["pyClientValidationAttributes"].search('required') > 0) {
            prop1["pyModes"][0].pyRequired = true;
        }

      /* when client-side validation is disabled, clintValidAttrs is empty*/
      if(prop1["pyModes"][0].required && prop1["pyModes"][0].required == "always") prop1["pyModes"][0].pyRequired = true;

        prop1.pyRelativeMetadataPath = "data-template";
        if (prop1.pyValueToken) {
            prop1.pyValue = prop1.pyValueToken;
        } else {
            prop1.pyValueToken = prop1.pyValue;
        }
        prop1["pyValue"] = currentContext.getPropertyValue(prop1.pyValueToken, null, null, ignoreClientValue);
        prop1["pyModes"][0].pyNameTemp = currentContext.getEntryHandle(prop1.pyValueToken);
        prop1["pyModes"][0].pyID = currentContext.getID(prop1.pyValueToken, componentInfo.pyName);

        /** offline Default handeling --start */
        if ((pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal())) {
            if (!prop1.pyValue) {
                prop1.pyValue = prop1["pyModes"][0]["defaultValue"];
            }
        }
        /** offline Default handeling --end */

        if (prop1.pyTooltip) {
            var _pyTooltip = currentContext.getLocalizedValue(prop1.pyTooltip, "pyTooltip", "");
            if (!_pyTooltip) { /* constant values will not get localized values for currentContext */
                _pyTooltip = pega.clientTools.getLocalizedTextForString("pyTooltip", prop1.pyTooltip);
            }
            if (_pyTooltip) {
                prop1.title = _pyTooltip;
            }
          if(prop1.pyHelperTextType === "inline"||(!prop1.pyHelperLabel && prop1.pyHelperTextType==="icon")){
            prop1.helperTextID = prop1["pyModes"][0].pyID + "_helperText";
          }
        }

        if (prop1["pyModes"][0].pySpecifySize == "custom") {
            prop1.calcWidth = prop1["pyModes"][0].pyWidth + prop1["pyModes"][0].pyWidthUnits;
        } else {
            prop1.calcWidth = "auto";
        }

       

        prop1["pyModes"][0].pyLoadMode = "";
        prop1["pyModes"][0].pySpin = false;
        if (prop1["pyModes"][0] && (prop1["pyModes"][0].pyControlLoadMode == 'deferload' || prop1["pyModes"][0].pyControlLoadMode == 'lazyload')) {
            var loadMode = '';
            if ("deferload" == prop1["pyModes"][0].pyControlLoadMode) { /* on user clicks */
                loadMode = "OnDemand";
                prop1["pyModes"][0].pySpin = true;
            } else if ("lazyload" == prop1["pyModes"][0].pyControlLoadMode) { /* after screen renders */
                loadMode = "LazyLoad";
            }
            prop1["pyModes"][0].pyLoadMode = "data-loadmode='" + loadMode + "'";
            prop1["pyModes"][0].pyTempText = currentContext.replaceActionStringTokens(prop1["pyModes"][0].pyTempText);
            prop1["pyModes"][0].pydataConfigText = currentContext.replaceActionStringTokens(prop1["pyModes"][0].pydataConfigText);
            prop1["pyModes"][0].pyDataConfig = "data-config='" + prop1["pyModes"][0].pydataConfigText + "'";
            prop1["pyModes"][0].pySpecifiedMode = true;

            /* BUG-311939: START */
            if (prop1["pyModes"][0].pyHasNoSelection == "true" && typeof(prop1["pyModes"][0].pyNoSelectionText) === "string") { // removed during   bug 290924: && prop1["pyModes"][0].pyNoSelectionText != ""
                var _pyNoSelectionText = currentContext.getLocalizedValue(prop1["pyModes"][0].pyNoSelectionText, "pyCaption", "");
                if (!_pyNoSelectionText && _pyNoSelectionText != "") { /* constant values will not get localized values for currentContext */
                    _pyNoSelectionText = pega.clientTools.getLocalizedTextForString("pyCaption", prop1["pyModes"][0].pyNoSelectionText);
                }
                if (_pyNoSelectionText) {
                    prop1["pyModes"][0].pyNoSelectionText = _pyNoSelectionText;
                }
	    else{
        	prop1["pyModes"][0].pyNoSelectionText ="";
      	    }
                prop1.noSelection = prop1["pyModes"][0].pyNoSelectionText;
                prop1.phTooltip = prop1["pyModes"][0].pyNoSelectionText;
                prop1.pyHasNoSelection = true;
            }
            /* BUG-311939: END */

            return Handlebars.templates['pxDropdown'](prop1);
        }
        if (prop1["pyModes"][0] && prop1["pyModes"][0].pyListDataSource && prop1["pyModes"][0].pyListDataSource.pyDataPage) {
            dataPageParamPage = prop1["pyModes"][0].pyListDataSource.pyDataPage.pyDataPageParams;
        }
        var sourceDP = prop1["pyModes"][0].pySourceName;
        if (dataPageParamPage) {
            if (!(pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal())) {
                sourceDP = prop1["pyModes"][0].pyHashedDataPage;
            }
            var paramsMap = {};
            for (var paramPage = 0; paramPage < dataPageParamPage.length; paramPage++) {
                var pyName = dataPageParamPage[paramPage]["pyName"];
                var pyValue = dataPageParamPage[paramPage]["pyValue"];
                pyValue = pega.ui.TemplateEngine.getCurrentContext().replaceActionStringTokens(pyValue);
                /*if(pyValue){
                    dataPageParamPage[paramPage]["pyValue"] = pega.ui.template.DataBinder.resolveIndex(pyValue);
                    pyValue = pega.c.eventParser.replaceTokensWrapper(dataPageParamPage[paramPage]["pyValue"], "", "", false, true);

                } else{
                  pyValue = "";
                }*/
                if (!pyValue) {
                    pyValue = "";
                }
                if (pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
                    pyValue = pega.c.eventParser.replaceTokensWrapper(pyValue, "", "", false, true);
                }
                paramsMap[pyName] = pyValue;
                if (pega.clientTools) {
                    pega.clientTools.getParamPage().put(pyName, pyValue);
                }
            }
        }


        if (sourceDP && !prop1["pyModes"][0].pyTempText) {
            if (pega.ui.ClientCache.isLargeDatapage(sourceDP)) {
                var asyncStreamObj = pega.ui.TemplateEngine.newAsyncStream();
                var asyncDone = false;
                prop1.contextForAsync = currentContext.getReference();
                var onSuccess = function(DPresults) {
                    if (DPresults) {
                        dataPage = JSON.parse(DPresults.getJSON());
                        organizeResultsforDropdown(dataPage, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell);
                        setTimeout(function() {
                            asyncStreamObj.setStream(Handlebars.templates['pxDropdown'](prop1));
                            pega.ui.TemplateEngine.renderAsyncStream(asyncStreamObj);
                            asyncDone = true;
                        }, 50);
                    }
                };
                var onFailure = function(err, errmsg) {
                    if (typeof console != "undefined" && console) {
                        console.error("Dropdown is unable to load its Source " + sourceDP + " .Error Details:- " + err + " : " + errmsg);
                    }
                };
                pega.ui.ClientCache.findPageAsync(sourceDP, paramsMap, onSuccess, onFailure);

                if (!asyncDone) {
                    return asyncStreamObj.getPlaceholderMarkup();
                } else {
                    return "$asyncDone$NoChangeRequired"
                }
            } else {
                if (prop1["pyModes"][0].pyResultsUniqueID && !(pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal())) {
                    var pageName = currentContext.getDataSource(prop1["pyModes"][0].pyResultsUniqueID);
                  if( pega.ui.dropdown && pega.ui.dropdown.stampDPName) {
                    prop1["pyModes"][0].dpNameAttribute = "data-datapage-name = '"+pageName+"'";
                  } else {
                    prop1["pyModes"][0].dpNameAttribute= "";
                  }
                    var _pxResults;
                    if (pageName.indexOf('.') == -1) {
                        currentContext.push(pageName);
                        _pxResults = currentContext.getPropertyValue("pxResults");
                        currentContext.pop();
                    } else {
                        _pxResults = currentContext.getPropertyValue(pageName);
                        if (!_pxResults.length) {
                            _pxResults = organizePageGroupList(_pxResults);
                        }
                    }
                    dataPage = {
                        "pxResults": _pxResults
                    };
                    organizeResultsforDropdown(dataPage, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell, true);
                } else {
                    var data = pega.ui.ClientCache.find(sourceDP);
                    if (data) {
                        if (data.type == 'list') {
                            dataPage = {
                                "pxResults": JSON.parse(data.getJSON())
                            };
                        } else {
                            dataPage = JSON.parse(data.getJSON());
                        }
                    } else {
                        dataPage = {
                            "pxResults": []
                        }
                    }
                    organizeResultsforDropdown(dataPage, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell, pega.u.d.ServerProxy.isDestinationLocal());
                }
                return Handlebars.templates['pxDropdown'](prop1);
            }
        } else if (prop1["pyModes"][0].pyTempText) {
            dataPage = JSON.parse(prop1["pyModes"][0].pyTempText);
            organizeResultsforDropdown(dataPage, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell, pega.u.d.ServerProxy.isDestinationLocal());
            return Handlebars.templates['pxDropdown'](prop1);
        } else if (prop1["pyModes"][0].pyResultsUniqueID) {
            var pageName = currentContext.getDataSource(prop1["pyModes"][0].pyResultsUniqueID);
            var _pxResults;
            if (pageName.indexOf('.') == -1) {
                currentContext.push(pageName);
                _pxResults = currentContext.getPropertyValue("pxResults");
                currentContext.pop();
            } else {
                _pxResults = currentContext.getPropertyValue(pageName);
                if (!_pxResults.length) {
                    _pxResults = organizePageGroupList(_pxResults);
                }
            }
            organizeResultsforDropdown({
                "pxResults": _pxResults
            }, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell, true);
            return Handlebars.templates['pxDropdown'](prop1);
        }
        //dataPage = JSON.parse(pega.ui.ClientCache.find(prop1["pyModes"][0].pySourceName).getJSON());
    } catch (e) {
        /* some thing went wrong in parsing JSON */
        return;
    }
});

function organizePageGroupList(pxResultsData) {
    var __length = 0;
    var __pxResults = {};
    for (var prop in pxResultsData) {
        __pxResults[__length + ""] = pxResultsData[prop];
        __length++;
    }
    if (__length > 0) {
        __pxResults.length = __length;
        pxResultsData = __pxResults;
    }
    return pxResultsData;
}

function organizeResultsforDropdown(dataPage, prop1, componentInfo, templatePage, dataPageParamPage, fromReloadCell, getFromContext) {
    var data = new Array();
    var currentContext = pega.ui.TemplateEngine.getCurrentContext();
    if (prop1.contextForAsync != null || prop1.contextForAsync != undefined) {
        currentContext.push(prop1.contextForAsync, undefined, undefined);
    }
    if (typeof(dataPage["pxResults"]) === "object" && dataPage["pxResults"].length && dataPage["pxResults"].length > 0) {
        for (var resultsIdx = 0; resultsIdx < dataPage["pxResults"].length; resultsIdx++) {
            data.push(dataPage["pxResults"][resultsIdx]);
        }
    }

    for (var paramProp in prop1) {
        if (typeof(prop1[paramProp]) === "string" && paramProp != "pyValueToken") {
            prop1[paramProp] = pega.ui.ChangeTrackerMap.getTracker().replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(prop1[paramProp]));
        }
    }
    if (prop1["pyModes"][0].pyName) {
        /* prop1["pyModes"][0].pyName = pega.ui.template.DataBinder.resolveIndex(prop1["pyModes"][0].pyName); */
        prop1["pyModes"][0].pyNameTemp = pega.ui.template.DataBinder.resolveIndex(prop1["pyModes"][0].pyName);
    }
    if (dataPageParamPage) {
        if (currentContext && currentContext.getEntryHandle()) {
            templatePage.pxCurrentContext = currentContext.getEntryHandle();
        }
        pega.ui.controlMetadataMapper.mapTemplatePage(prop1["pyModes"][0].pyNameTemp, templatePage);
    }

    var resultsList = new Array();
    prop1["disabled"] = prop1["pyModes"][0].disabled;
    if (!(prop1["pyModes"][0].pyPrompt)) {
        prop1["pyModes"][0].pyPrompt = prop1["pyModes"][1].pyPrompt;
    }
    var captionProp = prop1["pyModes"][0].pyPrompt.lastIndexOf(".", 0) === 0 ? prop1["pyModes"][0].pyPrompt.substring(1) : prop1["pyModes"][0].pyPrompt;
    var valueProp = prop1["pyModes"][0].pyValue.lastIndexOf(".", 0) === 0 ? prop1["pyModes"][0].pyValue.substring(1) : prop1["pyModes"][0].pyValue;
    var tooltipProp = "";
    if (prop1["pyModes"][0].pyTooltip) {
        if (prop1["pyModes"][0].pyTooltip.lastIndexOf(".", 0) === 0) {
            tooltipProp = prop1["pyModes"][0].pyTooltip.substring(1);
        } else {
            tooltipProp = prop1["pyModes"][0].pyTooltip;
        }
    }
    var groupProp = "";
    if (prop1["pyModes"][0].pyGroupLabel) {
        if (prop1["pyModes"][0].pyGroupLabel.lastIndexOf(".", 0) === 0) {
            groupProp = prop1["pyModes"][0].pyGroupLabel.substring(1);
        } else {
            groupProp = prop1["pyModes"][0].pyGroupLabel;
        }
    }
    var groupOrder = prop1["pyModes"][0].pyGroupOrder ? prop1["pyModes"][0].pyGroupOrder : "";
    if (prop1["pyModes"][0].pyEnableGrouping == "true" && typeof(prop1["pyModes"][0].pyGroupLabel) === "string" && prop1["pyModes"][0].pyGroupLabel != "") {
        data = groupResultsByCatogory(data, groupProp, groupOrder, getFromContext);
    }
    var groupName = "";
    for (var idx = 0; idx < data.length; idx++) {
        var optvalue = getOptionValueDD(data[idx], valueProp);
        var captvalue = getOptionValueDD(data[idx], captionProp, getFromContext, "pyCaption");
        if (optvalue == null || captvalue == null || (captvalue === '' && pega && pega.u && pega.u.d && pega.u.d.skipEmptyCaption)) continue;
        var result = {
            "cp": captvalue,
            "vp": optvalue
        };
        if (tooltipProp != "") {
            result["tp"] = getOptionValueDD(data[idx], tooltipProp, getFromContext, "pyTooltip");
        }
        if (optvalue == prop1.pyValue) {
            result["selectedOpt"] = true;
        }
        if (prop1["pyModes"][0].pyEnableGrouping == "true") {
            var curGroupName;
            if (groupProp != "")
                curGroupName = getOptionValueDD(data[idx], groupProp, getFromContext, "pyCaption");;
            var groupStart = groupProp && groupProp != "" && curGroupName &&  curGroupName != "" && groupName != curGroupName;
            if (groupStart) {
                result["grpStart"] = true;
                groupName = curGroupName;
            }
            if (groupProp != "") {
                result["gp"] = curGroupName
            }
            resultsList.push(result);
            if (idx != 0 && groupStart) {
                resultsList[idx - 1]["grpEnd"] = true;
            } else if (idx == data.length - 1) {
              if(resultsList[idx]) {
                resultsList[idx]["grpEnd"] = true;
              } else if(resultsList.length >= 1) {
                resultsList[resultsList.length - 1]["grpEnd"] = true;
              }
            }
        } else {
            resultsList.push(result);
        }
    }
    prop1.results = resultsList;
    if (prop1["pyModes"][0].pyHasNoSelection == "true" && typeof(prop1["pyModes"][0].pyNoSelectionText) === "string") { // removed during   bug 290924: && prop1["pyModes"][0].pyNoSelectionText != ""
        var _pyNoSelectionText = currentContext.getLocalizedValue(prop1["pyModes"][0].pyNoSelectionText, "pyCaption", "");
        if (!_pyNoSelectionText && _pyNoSelectionText!="") { /* constant values will not get localized values for currentContext */
      _pyNoSelectionText = pega.clientTools.getLocalizedTextForString("pyCaption", prop1["pyModes"][0].pyNoSelectionText);
    }
        if (_pyNoSelectionText) {
            prop1["pyModes"][0].pyNoSelectionText = _pyNoSelectionText;
        }
        else{
          prop1["pyModes"][0].pyNoSelectionText = "";
        }
        prop1.noSelection = prop1["pyModes"][0].pyNoSelectionText;
        prop1.phTooltip = prop1["pyModes"][0].pyNoSelectionText;
        prop1.pyHasNoSelection = true;
        prop1.accessibilityValue = prop1.pyValue?prop1.pyValue : "";
    }else{
    prop1.accessibilityValue = prop1.pyValue?prop1.pyValue : prop1.results[0]?prop1.results[0].vp : "";
  }
}

function getOptionValueDD(rowData, optionName, getFromContext, fieldName) {
    var optValue, optNameArray;
    var ct = pega.ui.ChangeTrackerMap.getTracker();
    var optionNameOriginal = null;
    if (!(pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal())) {
        if (getFromContext && fieldName) {
            var dotIndex = optionName.lastIndexOf("."); //If optionName is PersonInfo.pyFullName >> PersonInfo.$pxLocalized.$pyFullName$pyCaption
            var pageRef = optionName.substr(0, dotIndex);
            optionNameOriginal = optionName;
            optionName = (pageRef ? pageRef + "." : "") + "$pxLocalized.$" + optionName.substr(dotIndex + 1) + "$" + fieldName;
        }
    }
    if (optionName.indexOf(".") == -1) {
        optValue = rowData[optionName];
    } else {
        try {
            optNameArray = optionName.split(".");
            if (optNameArray.length == 2 && typeof(rowData["pxPages"]) == "object" && typeof(rowData["pxPages"][optNameArray[0]]) == "object") {
                optValue = rowData["pxPages"][optNameArray[0]][optNameArray[1]]
            } else {
                optValue = rowData;
                for (var propSplitIdx = 0; propSplitIdx < optNameArray.length; propSplitIdx++) {
                    var currentProp = optNameArray[propSplitIdx];
                    if (optValue && typeof optValue[currentProp] != 'undefined' && optValue[currentProp] != null) {
                        optValue = optValue[currentProp];
                    } else {
                        var propDetails = ct.returnListOrGroupProp(currentProp, true);
                        if (optValue && propDetails != currentProp) {
                            var index = propDetails.index;
                            var keyNew = propDetails.key;
                            if (!isNaN(index)) {
                                index -= 1;
                                optValue = optValue[keyNew] ? optValue[keyNew][index] : optValue[keyNew];
                            } else {
                                optValue = optValue[keyNew] ? optValue[keyNew][index] : optValue[keyNew];
                            }
                        } else {
                            optValue = null;
                            break;
                        }
                    }
                }
            }
        } catch (e) {}
    }

    if(optValue == null && optionNameOriginal != null) {
      optValue = rowData[optionNameOriginal];
    }

    if ((pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) && getFromContext) {
        var currentContext = pega.ui.TemplateEngine.getCurrentContext();
        optValue = currentContext.getLocalizedValue(optValue, fieldName);
    }
    return optValue;
}

function groupResultsByCatogory(dataPage, groupProp, groupOrder, getFromContext) {
    var newDataResults = {};
    var noCatogoryFieldArr = [];
    /* prepare item by catogory field */
    for (i = 0; i < dataPage.length; i++) {
        var resultRow = dataPage[i];
        var rowInserted = false;
        if (groupProp != "") {
            var groupName = getOptionValueDD(resultRow, groupProp, getFromContext, "pyCaption");
            if (groupName) {
                if (newDataResults[groupName] == undefined || newDataResults[groupName] == null) {
                    newDataResults[groupName] = new Array();
                }
                newDataResults[groupName].push(resultRow);
                rowInserted = true;
            }
        }
        if (!rowInserted) {
            /* If any results came without catogory field, it should be in final array */
            /*if (newDataResults["NO_CATOGORY_FIELD"] == undefined || newDataResults["NO_CATOGORY_FIELD"] == null) {
              newDataResults["NO_CATOGORY_FIELD"] = new Array();
            }
            newDataResults["NO_CATOGORY_FIELD"].push(resultRow);*/
            noCatogoryFieldArr.push(resultRow);
        }
    }

    /* prepare sorted results */
    var keys = new Array();
    for (var x in newDataResults) {
        keys.push(x);
    }
    // BUG-486529 ~ HFIX-53507 Sort Group by labels based on field value
    if(groupProp && (typeof pegaUtils=="object" && pegaUtils.sortGroupLabelsByFieldValue)){
      var sortByFieldValueComparator = function(a, b){
        return newDataResults[a][0][groupProp].localeCompare(newDataResults[b][0][groupProp]);
      };
      try {
        keys.sort(sortByFieldValueComparator);
      } catch(ex){
        keys.sort(); // fallback to default behaviour
      }
    } else {
      keys.sort();
    }
    var sortedResultsByCatogory = noCatogoryFieldArr;
    if (groupOrder == "desc") {
        for (var i = keys.length - 1; i >= 0; i--) {
            for (var idx = 0; idx < newDataResults[keys[i]].length; idx++) {
                sortedResultsByCatogory.push(newDataResults[keys[i]][idx]);
            }
        }

    } else {
        for (var i = 0; i < keys.length; i++) {
            for (var idx = 0; idx < newDataResults[keys[i]].length; idx++) {
                sortedResultsByCatogory.push(newDataResults[keys[i]][idx]);
            }
        }
    }

    /* sorted results and unsorted arrays length should be same
       if we found any difference, some results missed while sorting and
       we should return original results array */
    if (sortedResultsByCatogory.length == dataPage.length) {
        return sortedResultsByCatogory;
    }

    return dataPage;
}
//static-content-hash-trigger-GCC
(function(p){
	if (!p.control) {
		p.c = p.namespace("pega.control");
	} else {
		p.c = p.control;
	}

	/* IRadioGroup Constructor */
	p.c.IDropdown = function() {
		p.c.IDropdown.superclass.constructor.call(this, "Dropdown");
	};

	/* Inherit form IUIElement */
	p.lang.extend(p.c.IDropdown, p.c.IUIElement);

	/* IRadioGroup Specific Attributes & Methods */
	p.c.IDropdown.prototype.click= function(event) {
		var eventEle = p.util.Event.getTarget(event);
		if(eventEle && p.ui && p.ui.Dropdown && p.ui.Dropdown.isOnDemandDropdown(eventEle)) {
			if(!p.ui.Dropdown.isProcessedDropdown(eventEle)) {
				p.ui.Dropdown.processODDropdown(eventEle);
			}
		}
	}
	
	/* Instantiate IDropdown */
	p.c.Dropdown= new p.c.IDropdown();
})(pega);
(function (p) {
  if (!p.ui) {
    p.u = p.namespace("p.ui");
  } else {
    p.u = p.ui;
  }

  p.u.Dropdown_cache = new (function() {
    var _cacheObject = new  pega.tools.Hashtable();
    var _inprocessObject = new  pega.tools.Hashtable();
    this.hasCache = function(url){
      return _cacheObject.containsKey(url);
    };
    this.store = function(url, data){
      _cacheObject.put(url, data);
    },
    this.retrieve = function(url) {
      return _cacheObject.get(url);
    },
    this.storeInProgress = function(url){
      _inprocessObject.put(url, [])
    },
    this.addToPendingQ = function(url, elem) {
      var pendingQ = _inprocessObject.get(url);
      pendingQ.push(elem);
      _inprocessObject.put(url, pendingQ)
    },
    this.retrievePendingQ = function(url) {
      var pendingQ = _inprocessObject.get(url);
      _inprocessObject.remove(url);
      return pendingQ;
    },
    this.isInProgress = function(url) {
      return _inprocessObject.containsKey(url);
    };
  })();
  
  p.u.Dropdown = new (function() {
    var loadModeAttr = "data-loadmode", dataConfigAttr = "data-config";

    var constructOptions = function(elem, data, value){
      var i, l= elem.options.length, pos = 0, optData, groupby, optGroup;
      if(l> 0 && elem.options && elem.options.length >0 && elem.options[0].value == ""){
        pos = 1;
      }
      for (i = pos; i < l; i++){
        elem.remove(pos);
      }
      /*BUG-499148: removing optgroups*/
      if($(elem).find('optgroup').length > 0){
        $(elem).find('optgroup').remove();
      }
      var index = elem.options.length;
      var dataIndex = 0;
      var updateIndex = false;
      for(i=0, l=data.length;i<l;i++) {
        optData =  data[i];
        var optElem = document.createElement("option");
        optElem.appendChild(document.createTextNode(optData["caption"]));
        /* BUG-200993: when value string has leading/trailing spaces, on refresh selected value not showing in the drop down */
        try {
          optData["value"] = optData["value"].replace(/^\s+|\s+$/gm,"");
        } catch(e) { }
        optElem.value = optData["value"];
        if(optElem && optData["tooltip"]) {
          optElem.title = optData["tooltip"];
        }
        if(optData["value"]===value) {
          /* HFix-28545 Setting selected attribute using setAttribute api */
          optElem.setAttribute("selected","selected");
          /* optElem.selected = "selected"; */
          dataIndex = i;
          updateIndex = true;
        }
        if("groupby" in optData) {
          if(groupby !== optData["groupby"]) {
            if(optGroup) {
              elem.appendChild(optGroup);
            }
            groupby = optData["groupby"];
            optGroup = document.createElement("optgroup");
            optGroup.label = groupby;
          }
          optGroup.appendChild(optElem);
        } else {
          elem.appendChild(optElem);
        }
      }
      if(optGroup) {
        elem.appendChild(optGroup);
      }
      if(updateIndex){
        elem.selectedIndex = index + dataIndex;
      }  
    };
    
    var loadFromProp = function() {
      var elem = arguments[0], cacheEnabled = arguments[1], strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "Property");
      var entryHandle = elem.name;
      strUrlSF.put("Name", p.u.property.toReference(entryHandle));/*BUG-195336 : removing replace of index in pagelist in loadFromProp*/
            strUrlSF.put("EntryName", elem.name);
      processRequest(elem, strUrlSF, cacheEnabled);
    };
    
    var loadFromRD = function() {
      /* [elem,AssociatedClass,ReportDefinitionName,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,RDParams] */
      var elem = arguments[0], className = arguments[1], rdName = arguments[2], cacheEnabled = arguments[3], displayProperty = arguments[4], valueProperty = arguments[5], TooltipProperty = arguments[6], GroupByProperty = arguments[7], RDParams = arguments[8], groupByOrder=arguments[9], strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "ReportDefinition");
      strUrlSF.put("AppliedClass", className);
      strUrlSF.put("Name", rdName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
      if (RDParams != null && typeof RDParams != 'undefined') {
        separateStaticDynamicParams(RDParams,"RDParams",strUrlSF, elem);
      }
      processRequest(elem, strUrlSF, cacheEnabled);
    };

    var loadFromCB = function() {
      /*elem,Source,PreDataTransform,PreActivity,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,DTParams,ActParams] */
      var elem = arguments[0], pageName = arguments[1], preDTName = arguments[2], preActName = arguments[3], cacheEnabled = arguments[4], displayProperty = arguments[5], valueProperty = arguments[6], TooltipProperty = arguments[7], GroupByProperty = arguments[8], DTParams = arguments[9], ActParams = arguments[10], DPParams = arguments[11], groupByOrder=arguments[12];
      var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "ClipboardPage");
      strUrlSF.put("Name", pageName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("PreDT", preDTName);
      strUrlSF.put("PreActivity", preActName);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
          
      var postData = new SafeURL();
      if (DTParams != null && typeof DTParams != 'undefined') {
        separateStaticDynamicParams(DTParams,"DTParams",strUrlSF, elem);
      }
      if (ActParams != null && typeof ActParams != 'undefined') {
        separateStaticDynamicParams(ActParams,"ActParams",strUrlSF, elem);
      }
      if (DPParams != null && typeof DPParams != 'undefined') {
        separateStaticDynamicParams(DPParams,"DPParams",postData, elem);
      }
      if (preActName != null && typeof preActName != 'undefined') {
        var baseRef = pega.u.d.getBaseRef(elem);
        if(baseRef != ""){
          strUrlSF.put("BaseReference", baseRef);
        }
        if (typeof(Grids) != 'undefined') {
          var contextPage = pega.u.d.getRowAndEntryHandle(elem).rowEntryHandle;
          if(contextPage == null) {
            contextPage = "";
          }
          if(contextPage != ""){
            strUrlSF.put("ContextPage", pega.u.property.toReference(contextPage));
          }
        }
      }
      processRequest(elem, strUrlSF, cacheEnabled, postData);
    };

    var loadFromDP = function() {
      /*elem,Source,Cache,DisplayProperty,ValueProperty,TooltipProperty,GroupByProperty,DPParams] */
      var elem = arguments[0], pageName = arguments[1], cacheEnabled = arguments[2], displayProperty = arguments[3], valueProperty = arguments[4], TooltipProperty = arguments[5], GroupByProperty = arguments[6], DPParams = arguments[7], groupByOrder=arguments[8];
      var strUrlSF = SafeURL_createFromURL(pega.ctx.url);
      strUrlSF.put("pyActivity", "pzGetDropdownOptions");
      strUrlSF.put("Mode", "DataPage");
      strUrlSF.put("Name", pageName);
                        strUrlSF.put("EntryName", elem.name);
      strUrlSF.put("displayProperty", displayProperty);
      strUrlSF.put("valueProperty", valueProperty);
      strUrlSF.put("TooltipProperty", TooltipProperty);
      strUrlSF.put("GroupByProperty", GroupByProperty);
      if(typeof(groupByOrder) == "undefined"){
        groupByOrder = "";
      }
      strUrlSF.put("GroupByOrder", groupByOrder);
          
            var postData = new SafeURL();
      if (DPParams != null && typeof DPParams != 'undefined') {
        separateStaticDynamicParams(DPParams,"DPParams",postData,elem);
      }
      processRequest(elem, strUrlSF, cacheEnabled, postData);
    };
    var separateStaticDynamicParams = function(params, postDataString, urlObj, elem){
        var dynamicParamsObj={};
          var staticParamsObj={};
      if(params && params.length>0){
         var paramsJson = JSON.parse(params);
          Object.keys(paramsJson).forEach(function(key) {
            if(paramsJson[key].match(/(#|\^)~([^#~\^]+)~(#|\^)/gi)){
                dynamicParamsObj[key] = replaceParamsTokens(paramsJson[key], elem);
            }
            else{
                staticParamsObj[key] = paramsJson[key];
            }
        });
        urlObj.put("dynamic"+postDataString, JSON.stringify(dynamicParamsObj));
        urlObj.put("static"+postDataString, JSON.stringify(staticParamsObj));
       }
          
    }
    var replaceParamsTokens = function(paramStr,elem){
      var gridRowRef = "";
      var locGargs = "";
      if (typeof(Grids) != 'undefined') {
        var temp_gridObj = Grids.getElementsGrid(elem);
        if(temp_gridObj){
                                        var rowDetails = pega.u.d.getRowAndEntryHandle(elem); 
          gridRowRef = p.u.property.toReference(rowDetails.rowEntryHandle);
          if(rowDetails){
            var gridRow = rowDetails.row;
            var gargs = gridRow.getAttribute('data-gargs');
            if(gargs){
              locGargs = pega.lang.trim(gargs);
              locGargs = locGargs.replace(/\'/g,"\\\'");
              locGargs = JSON.parse(locGargs);
            }
          }
        }
      }
      paramStr = pega.c.eventParser.replaceTokensWrapper(paramStr,gridRowRef, locGargs, true);
      return paramStr;
    };

    var processPendingQ = function(url) {
      if (!pega.ui.Dropdown_cache.isInProgress(url)) return;
      var pendingQ = pega.ui.Dropdown_cache.retrievePendingQ(url);
      if (pendingQ!= null && typeof pendingQ != 'undefined' && pendingQ.length >= 1) {
        for (var idx=0; idx < pendingQ.length; idx++) {
          var objSelectElem = pendingQ[idx];
          p.u.Dropdown.processDropDownElem(objSelectElem);
        }
      }
    };
    
    var processRequest = function (elem, strUrlSF, cacheEnabled, data) {
      var value;
            if(elem.hasAttribute("data-template")){
              var ccProp = pega.ui.ClientCache.find(elem.name);
              value = ccProp ? ccProp.getValue() : "";
            }else{
              value = (/^select$/i.test(elem.tagName) && elem.options && elem.options.length >0) ? elem.options[elem.selectedIndex].value : elem.value;
            }
      var url = strUrlSF.toURL();
            /* BUG-290462: Fixed issue with cache key 
               datapage parameters are part of data which causing similar strUrlSF string as cache key */
            if (data && typeof(data.toURL) === "function" && typeof(data.toURL()) === "string") {
                url += data.toURL();
            }
      var callConstructOptions = function(dataObj){
        constructOptions(elem, dataObj, value);
        var newValue = (/^select$/i.test(elem.tagName) && elem.options && elem.options.length >0) ? elem.options[elem.selectedIndex].value : elem.value;
        if(value !== newValue) {
          pega.control.eventController.fireEventHandler(elem, "change");
        }
      };

      if("true" === cacheEnabled && pega.ui.Dropdown_cache.hasCache(url)) {
        callConstructOptions(pega.ui.Dropdown_cache.retrieve(url));
        return;
      } else if ("true" === cacheEnabled && pega.ui.Dropdown_cache.isInProgress(url)) {
        pega.ui.Dropdown_cache.addToPendingQ(url, elem);
        return;
      }
      
      var onSuccess = function (responseObj) {
        var responseText = responseObj.responseText;
              //BUG-201836-Fix
        if(responseText && responseText!=null){
           var docFrag = document.createDocumentFragment();
           var newDiv = document.createElement("div");
           newDiv.innerHTML = responseText;
           docFrag.appendChild(newDiv);
           var tempDiv = pega.util.Dom.getElementsById("ddOptionsWrapperDiv",newDiv,"div");
           if(tempDiv && tempDiv.length>0){
             var jsonText = tempDiv[0].textContent || tempDiv[0].innerText;
           if(jsonText && jsonText!=null){
              responseText = jsonText;
           }
           }
                  docFrag.removeChild(newDiv);
                  docFrag=null;
           
        }
        
        
          /*if(responseText && responseText!=null){
        var beginIndex = responseText.indexOf("<div id='ddOptionsWrapperDiv'>");
              var endIndex = responseText.indexOf("</div>");
        if(beginIndex != -1 && endIndex != -1)
        {
        var jsonText = responseText.substring(beginIndex+30,endIndex);
        if(jsonText && jsonText!=null)
          {
            responseText = jsonText;
          }
        }
        } */
        try {
          var jsonObj = JSON.parse(responseText);
        } catch(e) {
          /* BUG-389224: In case response not a valid json, return from here */
          return;
        }
        var dataObj = jsonObj.Results;
        if(typeof(this.spin) == "function" && typeof(this.stop) == "function"){
          this.stop();
          if(elem.parentNode==null || elem.parentNode=='undefined'){
                      var queryElement = pega.ctx.dom.querySelectorAll( elem.tagName.toLowerCase() + "[name='"+elem.getAttribute('name')+"']");
                        if(queryElement.length ==1){
                          elem = queryElement[0];
                        }
                    }
          var target = elem.parentNode.getElementsByTagName('div')[0];           
          target.removeAttribute("style");
          if(this.mask && this.mask.style) {
            this.mask.style.display = "none";
          }
        }

        if(typeof(dataObj) == "undefined"){
          dataObj = {};
        }

        pega.ui.Dropdown_cache.store(url, dataObj);
        callConstructOptions(dataObj);
        processPendingQ(url);
      }

      var onFailure = function (response) {
        if(typeof(this.spin) == "function" && typeof(this.stop) == "function"){
          this.stop(); 
          var target = elem.parentNode.getElementsByTagName('div')[0];           
          target.removeAttribute("style");    
          if(this.mask && this.mask.style) {
            this.mask.style.display = "none";
          }
        }
        /* silently fail for now */
      };
        
      var callBack = { success: onSuccess, failure: onFailure };
      if("true" === cacheEnabled) {
        pega.ui.Dropdown_cache.storeInProgress(url);
      }
      if (p.u.Dropdown.isOnDemandDropdown(elem)) {
        var selWidth = elem.offsetWidth;
        var opts = {
          lines: 11, // The number of lines to draw
          length: 3, // The length of each line
          width: 2, // The line thickness
          radius: 3, // The radius of the inner circle
          color: 'grey', // #rbg or #rrggbb
          speed: 1, // Rounds per second
          trail: 66, // Afterglow percentage
          shadow: false // Whether to render a shadow
        };
              var target = elem.parentNode.getElementsByTagName('div')[0];
        callBack.scope = new Spinner(opts).spin(target);
        target.style.left = (selWidth - 10)+"px";
        try {
              callBack.scope.mask = elem.parentNode.childNodes[elem.parentNode.childNodes.length - 1];
          callBack.scope.mask.style.width = selWidth+"px";
          callBack.scope.mask.style.display = "block";
        } catch (e) { }
      }
      /* BUG-205442: fixed issue with page messages clrearing when drop down mode set to lazy/on hover mode */
      strUrlSF.put("pzKeepPageMessages", "true");
      pega.u.d.asyncRequest('POST', strUrlSF, callBack, data);
    };
    
    this.isLazyLoadDropdown = function(el) {
      return /^lazyload$/i.test(el.getAttribute(loadModeAttr));
    };
    this.isOnDemandDropdown = function(el) {
      return /^ondemand$/i.test(el.getAttribute(loadModeAttr));
    };
    this.isProcessedDropdown = function(el) {
      return (!!el.getAttribute("data-loaded"));
    };
    this.processODDropdown = function(el) {
      el.setAttribute("data-loaded", true);
      p.u.Dropdown.processDropDownElem(el);
    };
    this.registerDropdowns = function(reloadElement) {
      var isAJAX = (reloadElement.type !== "load");
      var objSelects = pega.util.Dom.getElementsBy(p.u.Dropdown.isLazyLoadDropdown, "SELECT", (isAJAX ? reloadElement : undefined));
      var objSelectsOnDemand = pega.util.Dom.getElementsBy(p.u.Dropdown.isOnDemandDropdown, "SELECT", (isAJAX ? reloadElement : undefined));
      if (objSelects != null && objSelects.length && objSelects.length > 0) {
        for (var i = 0; i < objSelects.length; i++) {
          var objSelectElem = objSelects[i];
          p.u.Dropdown.processDropDownElem(objSelectElem);
        }
      }
      if (objSelectsOnDemand != null && objSelectsOnDemand.length && objSelectsOnDemand.length > 0) {
        for (var i = 0; i < objSelectsOnDemand.length; i++) {
          var objSelectElem = objSelectsOnDemand[i];
          pega.util.Event.addListener(objSelectElem, "focus", p.u.Dropdown.doOnMouseOver);
          pega.util.Event.addListener(objSelectElem, "mouseover", p.u.Dropdown.doOnMouseOver);
        }
      }
    };
    
    this.doOnMouseOver = function (event) {
      var elem = pega.util.Event.getTarget(event);
      if(elem.disabled == true) return true;
      p.u.Dropdown.processDropDownElem(elem);
      pega.util.Event.removeListener(elem, "focus", p.u.Dropdown.doOnMouseOver);
      pega.util.Event.removeListener(elem, "mouseover", p.u.Dropdown.doOnMouseOver);
    };
    
    this.getDropdownEntryHandle = function (elem) {
      var ddEntryHandle = null;
      if(!elem.getAttribute("name") && elem.tagName && elem.tagName.toUpperCase() == "SELECT") {
        var elemParentNode = elem.parentNode;
        if(elemParentNode && typeof(elemParentNode.getElementsByTagName) === "function") {
          var ddInputList = elemParentNode.getElementsByTagName("INPUT");
          if(ddInputList && ddInputList.length == 0 && elemParentNode.parentNode && typeof(elemParentNode.parentNode.getElementsByTagName) === "function") {
            ddInputList = elemParentNode.parentNode.getElementsByTagName("INPUT");
          }
          if(ddInputList && ddInputList.length >= 1) {
            for (var idx=0; idx < ddInputList.length; idx++) {
              var inputObj = ddInputList[0];
              if(inputObj.type == "hidden" && typeof (inputObj.getAttribute("data-ctl")) === "string" &&
                 JSON.parse(inputObj.getAttribute('data-ctl'))[0] == "Dropdown") {
                ddEntryHandle = inputObj.name;
                break;
              }
            }
          }
        }
      }
      return ddEntryHandle;
    };

    this.processDropDownElem = function(elem, isAjax){
      if (elem == null || typeof elem == 'undefined') return;
      var dataConfig = elem.getAttribute(dataConfigAttr);
      if(!dataConfig) {
        return;
      }
      dataConfig = JSON.parse(dataConfig);
      var sType = dataConfig[0];
      /* BUG-386608: If we are showing select button in accesibility mode, name attribute will not be available on select tag
         We should set name attribute on select tag from hidden drop down input and should remove after options loaded */
      var removeNameAttr = false;
      var ctrlName = p.u.Dropdown.getDropdownEntryHandle(elem);
      if(ctrlName) {
        elem.setAttribute("name", ctrlName);
        removeNameAttr = true;
      }
      dataConfig[0] = elem;
      switch(sType){
        case "AP" :
          loadFromProp.apply(this, dataConfig);
          break;
        case "RD" :
          loadFromRD.apply(this, dataConfig);
          break;
        case "CB" :
          loadFromCB.apply(this, dataConfig);   
          break;
        case "DP" :
          loadFromDP.apply(this, dataConfig);   
          break;
        default:
          break;
      }
      if(removeNameAttr) {
         elem.removeAttribute("name");
      }
    };
  })();
  if(p.u && p.u.d) {
    p.u.d.attachOnload(p.u.Dropdown.registerDropdowns, true);
  } else {
    p.util.Event.addListener(window, "load", p.u.Dropdown.registerDropdowns);
  }
})(pega);
//static-content-hash-trigger-YUI
(function(p) {
	if (!p.control) {
		p.c = p.namespace("pega.control");
	} else {
		p.c = p.control;
	}

	/* IRadioGroup Constructor */
	p.c.IDropdownButton = function() {
		p.c.IDropdownButton.superclass.constructor.call(this, "DropdownButton");
	};

	/* Inherit form IUIElement */
	p.lang.extend(p.c.IDropdownButton, p.c.IUIElement);

	/* IRadioGroup Specific Attributes & Methods */
	p.c.IDropdownButton.prototype.click = function(event) {
		var eventEle = pega.util.Event.getTarget(event);
		if (eventEle) {
			var selElem = eventEle.previousSibling;
          	var hiddenElem = selElem.previousSibling;
          	if(selElem.nodeName.toLowerCase() != "select"){
              var selElemArr = $(selElem).find("select");
              if(selElemArr.length > 0){
                selElem = selElemArr[0];
              }
            }			
            gErrorElementName = hiddenElem.name;
			validation_validateFromUIEvent(event, hiddenElem); /*BUG-174572 attaching validation function to hidden input*/

			var value = selElem.options[selElem.selectedIndex].value;
			if(hiddenElem.value != value) {
				hiddenElem.value = value;
				pega.control.eventController.fireEventHandler(hiddenElem, "change");
			}else
				pega.control.eventController.fireEventHandler(hiddenElem, "blur");
		/*SE-29790 focus next element - Reverted back by SE-31416*/
        }
	}
	/* Instantiate IDropdownButton */
	p.c.DropdownButton = new p.c.IDropdownButton();
})(pega);
