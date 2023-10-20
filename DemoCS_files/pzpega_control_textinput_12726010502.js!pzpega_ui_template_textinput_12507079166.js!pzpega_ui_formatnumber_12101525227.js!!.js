window.pega && (function(p) {
    if (!p.control) {
        p.c = p.namespace("pega.control");
    } else {
        p.c = p.control;
    }
    /* ITextArea Constructor */
    p.c.ITextInput = function() {
        p.c.ITextInput.superclass.constructor.call(this, "TextInput");
    };
    /* Inherit form IUIElement */
    p.lang.extend(p.c.ITextInput, p.c.IUIElement);
    /* ITextInput Specific Attributes & Methods */
    p.c.ITextInput.prototype.focus = function(event) {
        var eventEle = pega.util.Event.getTarget(event);
        if (eventEle.nodeName.toUpperCase() === "INPUT" && eventEle.type.match(/^(text|password|number)$/gi)) { /*HFix-21475 : added number in match*/
            p.c.PlaceHolder.focusHandler(eventEle);
        }
    }
    p.c.ITextInput.prototype.blur = function(event) {
        var eventEle = pega.util.Event.getTarget(event);
        if (eventEle.nodeName.toUpperCase() === "INPUT" && eventEle.type.match(/^(text|password|number)$/gi)) { /*HFix-21475 : added number in match*/
            p.c.PlaceHolder.blurHandler(eventEle);
        }
    }
                
    p.c.ITextInput.prototype.keyup = function(event) {
            //BUG-707526 Avoiding duplicate IME keyboard event
            if(event.isComposing){
              return;
            }
            var eventEle = pega.util.Event.getTarget(event);
            /**Added below function as part of BUG-739563 Fix*/
            var validateInteger = function(validationType){
              var splitValidationType = validationType.split(",");
              for(var i=0; i< splitValidationType.length; i++){
                if(splitValidationType[i] === 'integer'){
                  return true;
                }
              }
              return false;
            };
            /**Added below code as part of BUG-690108 Fix*/
            if(eventEle.getAttribute('data-ctl') === '["TextInput"]' && eventEle.getAttribute('validationtype') && eventEle.getAttribute('validationtype').length > 0 && validateInteger(eventEle.getAttribute('validationtype')) && eventEle.value !== "" && eventEle.value.indexOf('.') !== -1){
                   eventEle.value = eventEle.value.replaceAll(".", "");
                   return false;
             }
            /**End*/
            if (eventEle.nodeName.toUpperCase() === "INPUT" && eventEle.getAttribute("data-auto-formatting") &&
                eventEle.getAttribute("data-auto-formatting") == "true") {
                /**BUG-748341 | Removed check for backspace[KEYCODE: 8] or delete[KEYCODE: 46] to update the data-value*/
                if (event.ctrlKey || event.altKey || (event.keyCode == 9) || (event.keyCode > 34 && event.keyCode < 40)) {
                    return;
                }
                var value = eventEle.value;
                var localeValue = pega.u.d.formatNumberWithOutSeparators(value);
                eventEle.setAttribute("data-value", localeValue);
                
                /**BUG-748341 | Removed check for backspace[KEYCODE: 8] or delete[KEYCODE: 46] to update the data-value*/
                if(event.keyCode === 8 || event.keyCode === 46){
                  return;  
                }
                /**BUG-748341 | end*/
              
                var initialcarpos = eventEle.selectionStart;
                var initiallength = eventEle.value.length;
                var curEndPos = eventEle.selectionEnd;
                
                var formattedValue = pega.u.d.formatNumberWithSeparators(value);
                eventEle.value = formattedValue;
                if(initialcarpos === curEndPos && initiallength != initialcarpos ){
                  var newcarpos = formattedValue.length - (initiallength-initialcarpos);
                  eventEle.setSelectionRange(newcarpos, newcarpos);
                }
                eventEle.setAttribute("data-display-value", formattedValue);
            }
        }
        /* Instantiate ITextInput */
    p.c.TextInput = new p.c.ITextInput();
})(pega);
//static-content-hash-trigger-YUI
/*
<span data-control-mode="input" {{{[pyModes].0.pyStyleNameOther}}} nowrap>
{{~#ifCond [pyModes].1.symbolPosition '==' "left"~}}
	<span class="currsymbolleft">{{[pyModes].1.symbol}}</span>
{{~/ifCond~}}
<input  style="{{{[pyModes].0.inlineStyle}}}" {{{pyRelativeMetadataPath}}} {{{[pyModes].0.pyActionStringValue}}} {{#ifCond pyAutomationId '!=' ""}} data-test-id="{{{pyAutomationId}}}" {{/ifCond}}  data-ctl='["TextInput"]' type="{{{[pyModes].0.type}}}" {{~#ifCond [pyModes].0.type '==' "password"~}} autocomplete="off" {{~/ifCond~}} id="{{{pyID}}}" {{~#if [pyModes].0.pyRequired ~}}aria-required="true"{{~/if~}}  {{{[pyModes].0.disabled}}} {{[pyModes].0.pyExpressionIdMeta}}    
{{~#ifCond [pyModes].0.pyDisplayReadOnlyFormatting '==' "true" ~}}
    data-value="{{pyInputValue}}" {{~#ifCond [pyModes].1.pyObfuscated '==' "true"~}}value="{{obfuscateText formattedValue}}"{{~/ifCond~}} {{~#ifCond [pyModes].1.pyObfuscated '!=' "true"~}}value="{{formattedValue}}"{{~/ifCond~}} data-formatting ='done' {{{[pyModes].0.pattern}}}                                                                                
{{~/ifCond~}}
{{~#ifCond [pyModes].0.pyDisplayReadOnlyFormatting '!=' "true" ~}}
   value="{{pyInputValue}}"
{{~/ifCond~}}
{{~#ifCond [pyModes].0.type '==' "number" ~}}
   step="any"
{{~/ifCond~}}
{{{[pyModes].0.inputClass}}} {{~#if [pyModes].0.pyTooltipValue ~}}{{~#ifCond [pyModes].0.pyHelperTextType '==' "tooltip"~}} title="{{[pyModes].0.pyTooltipValue}}" {{~/ifCond~}} {{~/if~}} name="{{{pyName}}}" {{{[pyModes].0.pyClientValidationAttributes}}} {{~#ifCond pyModes1.pyPlaceholderValue '!=' "" ~}} placeholder="{{[pyModes].0.pyPlaceholderValue}}" {{~/ifCond~}} {{{[pyModes].0.pyMin}}} {{{[pyModes].0.pyMax}}} aria-describedby="{{{pyName}}}Error {{{helperTextID}}}" aria-invalid="{{~#ifCond [pyModes].0.pyErrorMessageHTML '!=' "" ~}}true{{else}}false{{~/ifCond~}}" {{~#if [pyModes].1.doAutoFormatting ~}} data-auto-formatting = "true" {{~/if}}/>
{{~#ifCond [pyModes].1.symbolPosition '==' "right"~}}
	<span class="currsymbolright" style="{{{[pyModes].0.currRightStyle}}}">{{[pyModes].1.symbol}}</span>
{{~/ifCond~}}

{{~#if [pyModes].0.pyTooltipValue ~}}
	{{~#ifCond [pyModes].0.pyHelperTextType '==' "inline"~}}<div class="helper-text"  id="{{{helperTextID}}}">{{[pyModes].0.pyTooltipValue}}</div>{{~/ifCond~}}
	{{~#if (ifCond (ifCond pyHelperLabel 'eq' false) 'and' (ifCond [pyModes].0.pyHelperTextType 'eq' "icon")) ~}}
		<i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon"  id="{{{helperTextID}}}" title="{{[pyModes].0.pyTooltipValue}}" onclick="pd(event);" tabindex="-1" role="img" aria-label="{{[pyModes].0.pyTooltipValue}}"></i>
	{{~/if~}}
  {{~#if (ifCond (ifCond pyHelperLabelOnFocus 'eq' false) 'and' (ifCond [pyModes].0.pyHelperTextType 'eq' "icon_on_focus")) ~}}
  <span class="helper-icon-tooltip-parent">
		<i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon"  id="{{{helperTextID}}}" aria-label="help" data-hover="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{[pyModes].0.pyTooltipValue}}&quot;]]]" data-click="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{[pyModes].0.pyTooltipValue}}&quot;]]]"
data-keydown="[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;{{[pyModes].0.pyTooltipValue}}&quot;],,&quot;enter&quot;]]" onmouseover="pega.c.cbe.processHoverEvent(event)" role="button" tabindex="{{pyHelperTabIndex}}" ></i>
    </span>
	{{~/if~}}
{{~/if~}}
{{{[pyModes].0.pyErrorMessageHTML}}}
</span>

*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxTextInput'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"currsymbolleft\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"symbol") : stack1), depth0))
    + "</span>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":5,"column":162},"end":{"line":5,"column":182}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"5":function(container,depth0,helpers,partials,data) {
    return "autocomplete=\"off\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "aria-required=\"true\"";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInputValue") || (depth0 != null ? lookupProperty(depth0,"pyInputValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInputValue","hash":{},"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":32}}}) : helper)))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"pyObfuscated") : stack1),"==","true",{"name":"ifCond","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":34},"end":{"line":7,"column":137}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"pyObfuscated") : stack1),"!=","true",{"name":"ifCond","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":138},"end":{"line":7,"column":227}}})) != null ? stack1 : "")
    + "data-formatting ='done' "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pattern") : stack1), depth0)) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "value=\""
    + container.escapeExpression((lookupProperty(helpers,"obfuscateText")||(depth0 && lookupProperty(depth0,"obfuscateText"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"formattedValue") : depth0),{"name":"obfuscateText","hash":{},"data":data,"loc":{"start":{"line":7,"column":91},"end":{"line":7,"column":123}}}))
    + "\"";
},"12":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"formattedValue") || (depth0 != null ? lookupProperty(depth0,"formattedValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"formattedValue","hash":{},"data":data,"loc":{"start":{"line":7,"column":195},"end":{"line":7,"column":213}}}) : helper)))
    + "\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInputValue") || (depth0 != null ? lookupProperty(depth0,"pyInputValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInputValue","hash":{},"data":data,"loc":{"start":{"line":10,"column":10},"end":{"line":10,"column":26}}}) : helper)))
    + "\"";
},"16":function(container,depth0,helpers,partials,data) {
    return "step=\"any\"";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyHelperTextType") : stack1),"==","tooltip",{"name":"ifCond","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":66},"end":{"line":15,"column":176}}})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "title=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "\"";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyPlaceholderValue") : stack1), depth0))
    + "\"";
},"23":function(container,depth0,helpers,partials,data) {
    return "true";
},"25":function(container,depth0,helpers,partials,data) {
    return "false";
},"27":function(container,depth0,helpers,partials,data) {
    return "data-auto-formatting = \"true\"";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"currsymbolright\" style=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"currRightStyle") : stack1), depth0)) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"symbol") : stack1), depth0))
    + "</span>";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyHelperTextType") : stack1),"==","inline",{"name":"ifCond","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":1},"end":{"line":21,"column":156}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabel") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":16},"end":{"line":22,"column":49}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyHelperTextType") : stack1),"eq","icon",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":56},"end":{"line":22,"column":105}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":8},"end":{"line":22,"column":106}}}),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":1},"end":{"line":24,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabelOnFocus") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":25,"column":17},"end":{"line":25,"column":57}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyHelperTextType") : stack1),"eq","icon_on_focus",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":25,"column":64},"end":{"line":25,"column":122}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":25,"column":9},"end":{"line":25,"column":123}}}),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":2},"end":{"line":30,"column":10}}})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"helper-text\"  id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"helperTextID") || (depth0 != null ? lookupProperty(depth0,"helperTextID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helperTextID","hash":{},"data":data,"loc":{"start":{"line":21,"column":87},"end":{"line":21,"column":105}}}) : helper))) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "</div>";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i data-ctl=\"Icon\" class=\"icons pi pi-help pi-link helper-icon\"  id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"helperTextID") || (depth0 != null ? lookupProperty(depth0,"helperTextID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helperTextID","hash":{},"data":data,"loc":{"start":{"line":23,"column":71},"end":{"line":23,"column":89}}}) : helper))) != null ? stack1 : "")
    + "\" title=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "\" onclick=\"pd(event);\" tabindex=\"-1\" role=\"img\" aria-label=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "\"></i>";
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"helper-icon-tooltip-parent\">\n		<i data-ctl=\"Icon\" class=\"icons pi pi-help pi-link helper-icon\"  id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"helperTextID") || (depth0 != null ? lookupProperty(depth0,"helperTextID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helperTextID","hash":{},"data":data,"loc":{"start":{"line":27,"column":71},"end":{"line":27,"column":89}}}) : helper))) != null ? stack1 : "")
    + "\" aria-label=\"help\" data-hover=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "&quot;]]]\" data-click=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "&quot;]]]\"\ndata-keydown=\"[[&quot;showSmartTip&quot;,[&quot;:event&quot;,&quot;&quot;,&quot;"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1), depth0))
    + "&quot;],,&quot;enter&quot;]]\" onmouseover=\"pega.c.cbe.processHoverEvent(event)\" role=\"button\" tabindex=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyHelperTabIndex") || (depth0 != null ? lookupProperty(depth0,"pyHelperTabIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHelperTabIndex","hash":{},"data":data,"loc":{"start":{"line":28,"column":214},"end":{"line":28,"column":234}}}) : helper)))
    + "\" ></i>\n    </span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span data-control-mode=\"input\" "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyStyleNameOther") : stack1), depth0)) != null ? stack1 : "")
    + " nowrap>"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"symbolPosition") : stack1),"==","left",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "<input  style=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"inlineStyle") : stack1), depth0)) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":5,"column":46},"end":{"line":5,"column":74}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyActionStringValue") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":113},"end":{"line":5,"column":195}}})) != null ? stack1 : "")
    + "  data-ctl='[\"TextInput\"]' type=\""
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"type") : stack1), depth0)) != null ? stack1 : "")
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"type") : stack1),"==","password",{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":252},"end":{"line":5,"column":331}}})) != null ? stack1 : "")
    + "id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyID") || (depth0 != null ? lookupProperty(depth0,"pyID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyID","hash":{},"data":data,"loc":{"start":{"line":5,"column":336},"end":{"line":5,"column":346}}}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyRequired") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":348},"end":{"line":5,"column":410}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"disabled") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyExpressionIdMeta") : stack1), depth0))
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDisplayReadOnlyFormatting") : stack1),"==","true",{"name":"ifCond","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":8,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyDisplayReadOnlyFormatting") : stack1),"!=","true",{"name":"ifCond","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":0},"end":{"line":11,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"type") : stack1),"==","number",{"name":"ifCond","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"inputClass") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":29},"end":{"line":15,"column":186}}})) != null ? stack1 : "")
    + "name=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":15,"column":193},"end":{"line":15,"column":205}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyClientValidationAttributes") : stack1), depth0)) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes1") : depth0)) != null ? lookupProperty(stack1,"pyPlaceholderValue") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":254},"end":{"line":15,"column":367}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyMin") : stack1), depth0)) != null ? stack1 : "")
    + " "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyMax") : stack1), depth0)) != null ? stack1 : "")
    + " aria-describedby=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":15,"column":434},"end":{"line":15,"column":446}}}) : helper))) != null ? stack1 : "")
    + "Error "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"helperTextID") || (depth0 != null ? lookupProperty(depth0,"helperTextID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"helperTextID","hash":{},"data":data,"loc":{"start":{"line":15,"column":452},"end":{"line":15,"column":470}}}) : helper))) != null ? stack1 : "")
    + "\" aria-invalid=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1),"!=","",{"name":"ifCond","hash":{},"fn":container.program(23, data, 0),"inverse":container.program(25, data, 0),"data":data,"loc":{"start":{"line":15,"column":486},"end":{"line":15,"column":569}}})) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"doAutoFormatting") : stack1),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":571},"end":{"line":15,"column":649}}})) != null ? stack1 : "")
    + "/>"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"symbolPosition") : stack1),"==","right",{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":0},"end":{"line":18,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyTooltipValue") : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":0},"end":{"line":31,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"pyErrorMessageHTML") : stack1), depth0)) != null ? stack1 : "")
    + "\n</span>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pxTextInput", function(componentInfo) {
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    var currentContext = pega.ui.TemplateEngine.getCurrentContext();
    var ct = pega.ui.ChangeTrackerMap.getTracker();
    var pyCell = componentInfo["pyCell"];
    var ctrlProperty = pyCell.pyValue;
    pyCell.pyRelativeMetadataPath = "data-template";

     /* new infra changes -start */
    pyCell.pyAutomationId = pyCell[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]];
    pyCell["pyModes"] = pyCell[TEMPLATE_CONSTANTS["PYMODES"]];
    pyCell["pyModes"][0].pyActionStringID = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]];
    pyCell["pyModes"][0].pyTooltip = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYTOOLTIP"]];
    pyCell["pyModes"][0].pyHelperTextType = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYHELPERTEXTTYPE"]] || "tooltip";
    pyCell["pyModes"][0].pyErrorMessageHTML = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
    pyCell["pyModes"][0]["pyClientValidationAttributes"] = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYCLIENTVALIDATIONATTRIBUTES"]];
    pyCell["pyModes"][0].pyStyleNameOther = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYSTYLENAMEOTHER"]];
    pyCell["pyModes"][0].pyPlaceholder = pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYPLACEHOLDER"]];
    /*new infra changes -end */

    var pyModes1 = pyCell["pyModes"][0];
    var ignoreClientValue = false;

    if (pyModes1.disabled == "always") {
        pyModes1.disabled = "disabled";
    }
    pyCell.pyHelperTabIndex = -1;
    if(pyModes1.pyHelperTextType === 'icon_on_focus'){
      pyCell.pyHelperTabIndex = 0;
    }
    var expResults = null;
    if (pyModes1.pyExpressionId) {
        pyModes1.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(pyModes1.pyExpressionId);
        expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(pyModes1.pyExpressionId);
    }

    if (expResults != null) {
        pyModes1.disabled = expResults[pega.ui.ExpressionEvaluator.DISABLE_WHEN] ? "disabled" : "";
        var datarequired = expResults ? expResults[pega.ui.ExpressionEvaluator.REQUIRED_WHEN] ? "true" : expResults[pega.ui.ExpressionEvaluator.REQUIRED_WHEN] == undefined ? undefined : "false" : "false";
        if (datarequired == "false")
            if (pyCell["pyModes"][0]["pyClientValidationAttributes"])
                pyCell["pyModes"][0]["pyClientValidationAttributes"] = pyCell["pyModes"][0]["pyClientValidationAttributes"].replace("required", "");
    } else { /* disabled/required when or expression with run on client disabled */
        if (pyModes1.pyDisabled) {
            pyCell["pyModes"][0]["disabled"] = "disabled";
            ignoreClientValue = true;
        }
        if (pyModes1.pyRequired === false && pyModes1["pyClientValidationAttributes"]) {
            pyModes1["pyClientValidationAttributes"] = pyModes1["pyClientValidationAttributes"].replace("required", "");
        }
    }
    if (pyCell["pyModes"][0]["pyClientValidationAttributes"] && pyCell["pyModes"][0]["pyClientValidationAttributes"].search('required') > 0) {
        pyModes1.pyRequired = true;
    }
  
    /* when client-side validation is disabled, clintValidAttrs is empty*/
    if(pyModes1.required && pyModes1.required == "always") pyModes1.pyRequired = true;

    if (!pyModes1.pyClientValidationAttributes) pyModes1.pyClientValidationAttributes = "";
    if (!pyModes1.pyErrorMessageHTML) pyModes1.pyErrorMessageHTML = "";

    var originalValue = currentContext.getPropertyValue(ctrlProperty, null, null, ignoreClientValue);
    /** offline Default handeling --start */
    if ((pega && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal())) {
        if (!originalValue) {
            originalValue = (typeof originalValue =="boolean")? "false" : pyCell["pyModes"][0]["defaultValue"];
        }
    }
    /** offline Default handeling --end */
    pyCell["pyInputValue"] = originalValue;
    pyCell.pyName = currentContext.getEntryHandle(ctrlProperty);
    pyCell.pyID = currentContext.getID(ctrlProperty, componentInfo.pyName);

    if (pyModes1.pyNumberFormatForLocaleEditable) {
        pyCell["pyInputValue"] = pega.ui.Formatter.formatEditableNumber(originalValue, pyModes1.pyNumberFormatForLocaleEditable);
    }

    var isDecimalOrDouble = pyModes1.isDecimalOrDouble;
    var navUserAgent = navigator.userAgent;

    /*BUG-345945: avoiding pattern generation for decimal property on iphone  */
    var avoidPatternOnIphone = (pega.cl && pega.cl.isTouchAble() && pyModes1.pyDisplayReadOnlyFormatting && isDecimalOrDouble && navUserAgent.match(/iPhone/i));
    /*BUG-314101: avoiding pattern generation for desktop*/
  
    var isMobile =  navUserAgent.match(/Android/i) || navUserAgent.match(/BlackBerry/i) || navUserAgent.match(/iPhone|iPad|iPod/i) || navUserAgent.match(/Opera Mini/i) || navUserAgent.match(/IEMobile/i) || navUserAgent.match(/Windows Phone/i) || navUserAgent.match(/Mobile/i);
  
    if ((!isMobile && pyCell["pyModes"][0].pattern) || avoidPatternOnIphone) {
        pyCell["pyModes"][0].pattern = "";
    }
    if (pyModes1.pyDisplayReadOnlyFormatting) {
        var pyModes2 = pyCell["pyModes"][1];
        if (pyModes1.hasAttrError != "true") {
            if (pyModes1.pyDisplayReadOnlyFormatting === "true") {
                if (pyModes2.pyObfuscated == "always") {
                    pyCell["pyModes"][1]["pyObfuscated"] = "true";
                }
                if (pyModes2.pyObfuscated) {
                    pyCell["pyModes"][1]["pyObfuscated"] = "true";
                }

            }
            pyCell["formattedValue"] = pega.ui.Formatter.formatNumber(originalValue, pyModes2, true);
        } else if (pyModes1.pyDisplayReadOnlyFormatting === "true") {
            pyCell["formattedValue"] = pyCell["pyInputValue"];
        }

        pega.ui.controlMetadataMapper.mapTemplatePage(pyCell.pyName, componentInfo);
    }
    
    var doAutoFormatting = pyModes1.doAutoFormatting;
    if (doAutoFormatting) {
      var symbolPosition = "";
      var symbol = "";
      var pySymbol = pyModes2.pySymbol;
      var pySymbolFormatString;

      if (pySymbol == "currency") {
        pySymbolFormatString = pyModes2.pyCurrencySymbol;
      } else if (pySymbol == "reference" || pySymbol == "constant") {
        pySymbolFormatString = pyModes2.pyNumberSymbolValue;
      }

      if (pySymbolFormatString) {
        var symbolValues = pySymbolFormatString.split("||");
        var tempSymbolValueLeft = symbolValues[0];
        var tempSymbolValueRight = symbolValues[1];

        if (tempSymbolValueLeft != "") {
          symbolPosition = "left";
          symbol = tempSymbolValueLeft;
        } else if (tempSymbolValueRight != "") {
          symbolPosition = "right";
          symbol = tempSymbolValueRight;
        }
    }
    pyModes2.symbol = symbol;
    pyModes2.symbolPosition = symbolPosition;

    var currInputStyle = "";
    var currSymbolLength = symbol.trim().length;
    var extraCh = 1 + (currSymbolLength>2 ? 1:0);
    //using CANVAS to get the currency symbol width  
    /*var canv = document.createElement("canvas");
    var context = canv.getContext("2d");
    context.font = "14px sans-serif";
    currSymbolLength = context.measureText(symbol.trim()).width;*/
      
    if (symbolPosition == "left") {
      currInputStyle = "padding-left: " + (currSymbolLength + extraCh) + "ch;";
    }
    if (symbolPosition == "right") {
      currInputStyle = "padding-right: " + (currSymbolLength + extraCh) + "ch;";
      pyModes1.currRightStyle = "margin-left: -" + (currSymbolLength + extraCh) + "ch;";
    }
    pyModes1.currInputStyle = currInputStyle;

    var currClass = "currsymbol";
    pyModes1.pyStyleNameOther = "'" + pyModes1.pyStyleNameOther.substring(pyModes1.pyStyleNameOther.indexOf("'") + 1, (pyModes1.pyStyleNameOther.length - 1)) + " " + currClass + "'";
}

    if (pyModes1.pyStyleNameOther && pyModes1.pyStyleNameOther.indexOf('class') == -1) {
        pyModes1.pyStyleNameOther = "class = " + pyModes1.pyStyleNameOther;
    }

    if (pyModes1.pyPlaceholder) {
        var _pyPlaceholder = currentContext.getLocalizedValue(pyModes1.pyPlaceholder, "pyActionPrompt", "");
        if (!_pyPlaceholder && _pyPlaceholder != "") { /* constant values will not get localized values for currentContext */
            _pyPlaceholder = pega.clientTools.getLocalizedTextForString("pyActionPrompt", pyModes1.pyPlaceholder);
        }
        if (_pyPlaceholder) {
            /**Added below code as part of BUG-690108 Fix*/
            if(pyCell["pyModes"][0]["pyClientValidationAttributes"] && pyCell["pyModes"][0]["pyClientValidationAttributes"].search('integer') > 0){
              var splitPlaceholderValue = _pyPlaceholder.split('.');
              var placeHolderVal = "";
              for(var i=0;i<splitPlaceholderValue.length;i++){
                placeHolderVal = placeHolderVal + splitPlaceholderValue[i];
              }
              pyModes1.pyPlaceholderValue = placeHolderVal;
            }else{
              pyModes1.pyPlaceholderValue = _pyPlaceholder;
            }
          /**End*/
        } else {
            pyModes1.pyPlaceholderValue = "";
        }
    }

    if (pyModes1.pyTooltip) {
        var _pyTooltip = currentContext.getLocalizedValue(pyModes1.pyTooltip, "pyTooltip", "");
        if (!_pyTooltip) { /* constant values will not get localized values for currentContext */
            _pyTooltip = pega.clientTools.getLocalizedTextForString("pyTooltip", pyModes1.pyTooltip);
        }
        if (_pyTooltip) {
            pyModes1.pyTooltipValue = _pyTooltip;
        } else {
            pyModes1.pyTooltipValue = "";
        }
      if(pyModes1.pyHelperTextType === "inline"||(!pyCell.pyHelperLabel && pyModes1.pyHelperTextType==="icon") || (!pyCell.pyHelperLabelOnFocus && pyModes1.pyHelperTextType==="icon_on_focus"))
        pyCell.helperTextID = pyCell.pyID + "_helperText";
    }

    if (pyModes1.pyActionStringID) {
        pyModes1.pyActionStringValue = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes1.pyActionStringID);
        // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
        if (typeof(pyModes1.pyActionStringValue) === "string") {
            pyModes1.pyActionStringValue = pyModes1.pyActionStringValue.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function() {
                return "#~" + arguments[2] + "~#";
            });
        }
    }

    if (pyModes1.pyErrorMessageHTML) {
        pyModes1.inputClass = pyModes1.inputClass.substring(0, pyModes1.inputClass.lastIndexOf("'")) + " " + "ErrorShade'";
    }
    pyModes1.inlineStyle = "";
    if(pyModes1.currInputStyle && pyModes1.currInputStyle!=''){
      pyModes1.inlineStyle = pyModes1.inlineStyle + pyModes1.currInputStyle;
    }
    if(pyModes1.pyWidth && pyModes1.pyWidth!=""){
      pyModes1.inlineStyle = pyModes1.inlineStyle + "width:"+pyModes1.pyWidth;
    }
    
  
    return Handlebars.templates['pxTextInput'](pyCell);
});
//static-content-hash-trigger-GCC
pega.namespace("pega.ui.Formatter");
pega.ui.Formatter.formatNumber = function(value, modesPage, pyDisplayReadOnlyFormatting) {
  if(value == "") return "";
  if(isNaN(value)) return value;
	var scaleSymbol = "";
	var scale = modesPage.pyScale;
  if(scale!="" && scale!="none"){
	if(scale == "percentage"){
		value = value*100; 
		scaleSymbol="%";
	}else if(scale== "thousands"){
		value = value/1000; 
		scaleSymbol="K";
	}else if(scale=="millions"){
		value = value/1000000; 
		scaleSymbol="M";
	}else if(scale=="billions"){
		value = value/1000000000; 
		scaleSymbol="B";
	}else if(scale=="trillions"){
		value = value/1000000000000; 
		scaleSymbol="T";
	}
  }
  
  var roundingMethod = modesPage.pyRoundingMethod;
  var decimalPrecision = modesPage.pyDecimalPlaces;
  /*BUG-510100 SE-56448 start*/
  var currenciesWithNoDecimalPrecisions = ['JPY', 'Yen', '￥', '¥'];
  currenciesWithNoDecimalPrecisions.filter(function(item){
    if(modesPage.pySymbol == "currency" && modesPage.pyCurrencySymbol.indexOf(item) > -1){
      decimalPrecision = "0";
    }
  });/*BUG-510100 SE-56448 end */
  if(decimalPrecision == "-999"){
	if(modesPage.pySymbol=="currency") {
		decimalPrecision = "2"; 
	}else{
		decimalPrecision = "3";
	}
  }
  
  
  if(modesPage.doAutoFormatting){
    var tempCurrSymb = modesPage.pyCurrencySymbol;
    modesPage.pyCurrencySymbol = "||";
    var tempNumbSymb = modesPage.pyNumberSymbolValue;  
    modesPage.pyNumberSymbolValue = "||";
  }
  
  //BUG-482006 Processing values with large digit count(>=16) as strings as JS has some limitation in handling them
    var isValueLargeNumber = false;
    var isLargeNumNegative = false;
    if(decimalPrecision>=0){
      var roundingMethods = {"UP":0, "DOWN":1, "CEILING":2, "FLOOR":3, "HALF_UP":4, "HALF_DOWN":5, "HALF_EVEN":6};
      roundingMethod = roundingMethods[roundingMethod];
      if(isNaN(roundingMethod))
        roundingMethod = 4;
      //check if total number of digits in value (excluding '-' and '.' if present)
      if((value.toString().match(/\d/g) || []).length < 16){
        //less than 16 digits - JS can handle, so process the value as number type
        var decimal = value;
        var decimalObj = new Decimal(decimal);
        if(modesPage.pyDecimalPlaces > 0 && decimalObj.decimalPlaces() > 0 && decimalPrecision > decimalObj.decimalPlaces()) {
          Decimal.config({rounding:roundingMethod});
          value = decimalObj.toFixed(parseInt(decimalPrecision));
        } else {
          decimal = decimal* Math.pow(10,decimalPrecision);
          decimalObj = new Decimal(decimal);
          Decimal.config({rounding:roundingMethod});
          value = decimalObj.round()/Math.pow(10,decimalPrecision);
        }
      }else{
        //not less than 16 digits - JS can't handle the number type, so process as string type
        isValueLargeNumber = true;
        value = value.toString();
        var periodIndex = value.indexOf('.');
        var isLargeNumNegative = value.indexOf('-') < 0 ? false : true;//BUG-511643 includes not supported in IE
        if(!isNaN(value) && periodIndex > -1){ //if entered value is a Number and is a strict decimal, process it as string
          var decimalDigitsLength = (value.length - (periodIndex+1));
          //Append zeroes if precision to be rounded off to is greater than actual decimal digits length present in value
          if(decimalDigitsLength < decimalPrecision)
            value += '0'.repeat(decimalPrecision - decimalDigitsLength);
          var roundingOffDigits = value.substring(periodIndex+parseInt(decimalPrecision)+1);
          var actualNum = '';
          //if decimal precision is '0', skip '.' at the end of the number
          if(roundingOffDigits.length === (value.length -(periodIndex+1)))
            actualNum = value.substring(0, periodIndex+parseInt(decimalPrecision));
          else
	          actualNum = value.substring(0, periodIndex+parseInt(decimalPrecision)+1);
          var lastDigit = actualNum[actualNum.length-1];
          var nextNum = '';
          var nextNumPrefix = actualNum.substring(0, actualNum.length-1);
          var nextNumSuffix = '';
          //nextNum is prepared using this while loop - it takes care of adding the sum 10's to trailing digit until the sum is not 10
          while(!nextNum){
            if(lastDigit === '.'){ //jump over the digit if sum in one-tenth place happens to be 10 
              lastDigit = nextNumPrefix[nextNumPrefix.length-1];
              nextNumPrefix = nextNumPrefix.substring(0, nextNumPrefix.length-1);
              nextNumSuffix = '.' + nextNumSuffix;
            }else{
              if((parseInt(lastDigit)+1) === 10){
                lastDigit = nextNumPrefix[nextNumPrefix.length-1];
                nextNumPrefix = nextNumPrefix.substring(0, nextNumPrefix.length-1);
                nextNumSuffix = '0' + nextNumSuffix;
              } else if(isNaN(lastDigit)) {
                nextNum = nextNumPrefix + 1 + nextNumSuffix;
              } else{
                nextNum = nextNumPrefix + (parseInt(lastDigit)+1) + nextNumSuffix;
              }
            }
          }
          //assigns value with the number string as per the rounding method chosen
          if(roundingMethod > 3){
            var roundingOffDigitsDouble = roundingOffDigits*2;
            var nearest10sNum = Math.pow(10,roundingOffDigits.length);
            switch(roundingMethod){
              case 4: //HALF_UP
                value = (roundingOffDigitsDouble < nearest10sNum) ? actualNum : nextNum;
                break;
              case 5: //HALF_DOWN
                value = (roundingOffDigitsDouble > nearest10sNum) ? nextNum : actualNum;
                break;
              case 6: //HALF_EVEN
                value = (roundingOffDigitsDouble > nearest10sNum) ? nextNum : ((roundingOffDigitsDouble < nearest10sNum) ? actualNum : (lastDigit%2 ? nextNum : actualNum));
                break;
            }
          }else{
            switch(roundingMethod){
              case 0: //UP
                value = nextNum;
                break;
              case 1: //DOWN
                value = actualNum;
                break;
              case 2: //CEILING
                value = isLargeNumNegative ? actualNum : nextNum;
                break;
              case 3: //FLOOR
                value = isLargeNumNegative ? nextNum : actualNum;
                break;
            }
          }
        }
      }
	  }
  
  var negativeFormat = modesPage.pyNegativeFormat;
  var negativeFormatStyle = modesPage.pyNegativeFormatStyle;
  
  //check isLargeNumNegative for large number values if the number is minus or not
  if(!isValueLargeNumber && value<0){
		value = value * (-1);
		var addMinus=true;
  }else if(isLargeNumNegative){
    value = value.replace('-','');
    var addMinus=true;
  }
  //if the number if large value string, skip calling toFixed()
  if((!isValueLargeNumber) && (modesPage.pyDecimalPlaces != "-999" && modesPage.pyDecimalPlaces != "-1") || (modesPage.pyDecimalPlaces == "-999" && modesPage.pySymbol=="currency")){
  	value = Number(value).toFixed(decimalPrecision);
  }
  value = value.toString();
  var pyNumberFormatForLocale = modesPage.pyNumberFormatForLocale;
  if(pyNumberFormatForLocale!="hi_IN" && pyNumberFormatForLocale!="en_IN" && pyNumberFormatForLocale.indexOf("||")>0){
	  var pyNumberFormatForLocaleArray = modesPage.pyNumberFormatForLocale.split("||");
	  var numSeparator = pyNumberFormatForLocaleArray[0];
	  var decSeparator = pyNumberFormatForLocaleArray[1];
	  var localeDigits = pyNumberFormatForLocaleArray[2];
	  value = value.replace(".",decSeparator);
	  if(modesPage.pySeparators=="true"){
		  if(value.indexOf(decSeparator)!=-1){
			  var parts = value.toString().split(decSeparator);
			  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, numSeparator);
			  value = parts.join(decSeparator);
		  }else{
			  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, numSeparator);
		  }
	  }
	  if(localeDigits!="1234506789"){
		value = value.split("0").join(localeDigits.charAt(5));
		value = value.split("1").join(localeDigits.charAt(0));
		value = value.split("2").join(localeDigits.charAt(1));
		value = value.split("3").join(localeDigits.charAt(2));
		value = value.split("4").join(localeDigits.charAt(3));
		value = value.split("5").join(localeDigits.charAt(4));
		value = value.split("6").join(localeDigits.charAt(6));
		value = value.split("7").join(localeDigits.charAt(7));
		value = value.split("8").join(localeDigits.charAt(8));
		value = value.split("9").join(localeDigits.charAt(9));
	  }
  }else{
	if(modesPage.pySeparators=="true"){
		var afterPoint = '';
		if(value.indexOf('.') > 0){
			afterPoint = value.substring(value.indexOf('.'),value.length);
				value = Math.floor(value);
				value = value.toString();
		}
		var lastThree = value.substring(value.length-3);
		var otherNumbers = value.substring(0,value.length-3);
		if(otherNumbers != '')
			lastThree = ',' + lastThree;
		value = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	}
  }
  if(modesPage.pySymbol=="currency"){
	var currencySymbolArray = modesPage.pyCurrencySymbol.split("||");
	value = currencySymbolArray[0]+value+scaleSymbol+currencySymbolArray[1];
  }else{
	value = value+scaleSymbol;
  }
  var symbolValues = modesPage.pyNumberSymbolValue.split("||");
  var tempSymbolValueLeft = symbolValues[0];
  var tempSymbolValueRight = symbolValues[1];
  if(addMinus && negativeFormat=="none"){
			 value= "-" + value;
  }
  if(addMinus){
		if(negativeFormat.indexOf("parens") > -1){
			value = "(" + tempSymbolValueLeft + value + tempSymbolValueRight + ")";
			if(negativeFormat=="parensStyle" && !pyDisplayReadOnlyFormatting){
				value = "<span id=\"pyNegativeFormatValue\" class=\""+ negativeFormatStyle +"\">" + value + "</span>";
			}	
		}else if(negativeFormat.indexOf("minus") > -1){
			value = "-" + tempSymbolValueLeft + value + tempSymbolValueRight;
			if(negativeFormat=="minusStyle" && !pyDisplayReadOnlyFormatting){
				value = "<span id=\"pyNegativeFormatValue\" class=\""+ negativeFormatStyle +"\">" + value + "</span>";
			}
		}else if(negativeFormat=="styleref"){
			value =  tempSymbolValueLeft + value + tempSymbolValueRight;
          	if(!pyDisplayReadOnlyFormatting)
				value = "<span id=\"pyNegativeFormatValue\" class=\""+ negativeFormatStyle +"\">" + value + "</span>";
		}else{
			value =  tempSymbolValueLeft + value + tempSymbolValueRight;
		}
  }else{
		value = tempSymbolValueLeft + value + tempSymbolValueRight ;
  }
  if(modesPage.doAutoFormatting ){
     modesPage["pyCurrencySymbol"] = tempCurrSymb ;
     modesPage["pyNumberSymbolValue"] = tempNumbSymb ;  
  }
   return value;
};


pega.ui.Formatter.formatEditableNumber = function(value, numberFormatForLocaleEditable) {
  if(value == "") return "";
  if(isNaN(value)) return value;
  if(numberFormatForLocaleEditable!="hi_IN" && numberFormatForLocaleEditable!="en_IN" && numberFormatForLocaleEditable.indexOf("||")>0){
	  var numberFormatForLocaleEditableArray = numberFormatForLocaleEditable.split("||");
	  var numSeparator = numberFormatForLocaleEditableArray[0];
	  var decSeparator = numberFormatForLocaleEditableArray[1];
	  var localeDigits = numberFormatForLocaleEditableArray[2];
	  value = value.replace(".",decSeparator);
	  if(localeDigits!="1234506789"){
		value = value.split("0").join(localeDigits.charAt(5));
		value = value.split("1").join(localeDigits.charAt(0));
		value = value.split("2").join(localeDigits.charAt(1));
		value = value.split("3").join(localeDigits.charAt(2));
		value = value.split("4").join(localeDigits.charAt(3));
		value = value.split("5").join(localeDigits.charAt(4));
		value = value.split("6").join(localeDigits.charAt(6));
		value = value.split("7").join(localeDigits.charAt(7));
		value = value.split("8").join(localeDigits.charAt(8));
		value = value.split("9").join(localeDigits.charAt(9));
	  }
  }
  return value;
};
//static-content-hash-trigger-GCC
