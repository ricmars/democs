/*
// Workarea template starts
{{#ifCond startWrapperDiv '===' 'true'}}
    <div class={{wrapperDivClass}}>
{{/ifCond}}
{{#each pyTemplates}}
  {{#ifCond startWrapperDiv '===' 'true'}}
     <div class='{{../wrapperDivClass}}'>
  {{/ifCond}}

  {{{renderChildren this}}}

  {{#ifCond endWrapperDiv '===' 'true'}}
    </div>
  {{/ifCond}}
{{/each}}
{{#ifCond endWrapperDiv '===' 'true'}}
    </div>
{{/ifCond}}
// Workarea template ends

// Workarea header starts
<header {{#if topInspectorData}}{{{topInspectorData}}}{{/if}} class='{{finalHeaderClass}}' aria-label='{{ariaLabelTopPanel}}'>
    {{#each pyTemplates}}
        {{{renderChildren this}}}
    {{/each}}
</header>
// Workarea header ends


//pxWorkAreaLeft - LEFT panel starts
<aside {{#if leftInspectorData}}{{{leftInspectorData}}}{{/if}} class='{{wrapperDivClass}}' aria-label='{{ariaLabelLeftPanel}}' {{#if pyExpressionIdMeta}}{{{pyExpressionIdMeta}}}{{/if}} {{#if pyHide}}style='display:none' {{/if}}  data-expanded={{#ifCond isLeftExpand '===' 'true'}} 'true' {{else}} 'false'{{/ifCond}}>
    <div class='panelOverFlowClass'>
    {{#each pyTemplates}}
        {{{renderChildren this}}}
    {{/each}}
    </div>
    {{#ifCond isResizable '===' 'true'}}
      {{#ifCond isRTL '===' 'true'}}
      <div class='workarea-main-left-handle ui-resizable-handle ui-resizable-w'></div>
      {{else}}
      <div class='workarea-main-left-handle ui-resizable-handle ui-resizable-e'></div>
      {{/ifCond}}
    {{/ifCond}}
</aside>
//pxWorkAreaLeft - LEFT panel ends



// Workarea content starts
<section {{#if centerInspectorData}}{{{centerInspectorData}}}{{/if}} class='workarea-view-content {{scrollClass}}' aria-label='{{ariaLabelCenterPanel}}'>
    {{#each pyTemplates}}
        {{{renderChildren this}}}
    {{/each}}
</section>
// Workarea content ends


//pxWorkAreaRight - RIGHT panel starts
<aside {{#if rightInspectorData}}{{{rightInspectorData}}}{{/if}} class='{{wrapperDivClass}}' aria-label='{{ariaLabelRightPanel}}' {{#if pyExpressionIdMeta}}{{{pyExpressionIdMeta}}}{{/if}} {{#if pyHide}}style='display:none' {{/if}}  data-expanded={{#ifCond isRightExpand '===' 'true'}} 'true' {{else}} 'false'{{/ifCond}}>
    {{#ifCond isResizable '===' 'true'}}
      {{#ifCond isRTL '===' 'true'}}
      <div class='workarea-main-right-handle ui-resizable-handle ui-resizable-e'></div>
      {{else}}
      <div class='workarea-main-right-handle ui-resizable-handle ui-resizable-w'></div>
      {{/ifCond}}
    {{/ifCond}}
    <div class='panelOverFlowClass'>
    {{#each pyTemplates}}
        {{{renderChildren this}}}
    {{/each}}
    </div>
</aside>
//pxWorkAreaRight - RIGHT panel ends


// Workarea footer starts
<footer {{#if bottomInspectorData}}{{{bottomInspectorData}}}{{/if}} class='{{finalFooterClass}}' aria-label='{{ariaLabelBottomPanel}}'>
    {{#each pyTemplates}}
        {{{renderChildren this}}}
    {{/each}}
</footer>
// Workarea footer ends
*/

// START OF pxWorkArea
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkArea'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <div class="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"wrapperDivClass") || (depth0 != null ? lookupProperty(depth0,"wrapperDivClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wrapperDivClass","hash":{},"data":data,"loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":34}}}) : helper)))
    + ">\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"startWrapperDiv") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":7,"column":13}}})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":9,"column":27}}})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"endWrapperDiv") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":2},"end":{"line":13,"column":13}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "     <div class='"
    + container.escapeExpression(container.lambda((depths[1] != null ? lookupProperty(depths[1],"wrapperDivClass") : depths[1]), depth0))
    + "'>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "    </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"startWrapperDiv") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":14,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"endWrapperDiv") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":17,"column":11}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
})();
// END OF pxWorkArea

// START OF pxWorkAreaHeader
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkAreaHeader'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"topInspectorData") || (depth0 != null ? lookupProperty(depth0,"topInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"topInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":54}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":33}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<header "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"topInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":61}}})) != null ? stack1 : "")
    + " class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"finalHeaderClass") || (depth0 != null ? lookupProperty(depth0,"finalHeaderClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"finalHeaderClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":69},"end":{"line":1,"column":89}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelTopPanel") || (depth0 != null ? lookupProperty(depth0,"ariaLabelTopPanel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelTopPanel","hash":{},"data":data,"loc":{"start":{"line":1,"column":103},"end":{"line":1,"column":124}}}) : helper)))
    + "'>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "</header>";
},"useData":true});
})();
// END OF pxWorkAreaHeader



// START of pxWorkAreaLeft
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkAreaLeft'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"leftInspectorData") || (depth0 != null ? lookupProperty(depth0,"leftInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"leftInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":55}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":1,"column":153},"end":{"line":1,"column":177}}}) : helper))) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "style='display:none' ";
},"7":function(container,depth0,helpers,partials,data) {
    return " 'true' ";
},"9":function(container,depth0,helpers,partials,data) {
    return " 'false'";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":33}}})) != null ? stack1 : "")
    + "\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRTL") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(16, data, 0),"data":data,"loc":{"start":{"line":8,"column":6},"end":{"line":12,"column":17}}})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    return "      <div class='workarea-main-left-handle ui-resizable-handle ui-resizable-w'></div>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "      <div class='workarea-main-left-handle ui-resizable-handle ui-resizable-e'></div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<aside "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"leftInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":62}}})) != null ? stack1 : "")
    + " class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"wrapperDivClass") || (depth0 != null ? lookupProperty(depth0,"wrapperDivClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wrapperDivClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":70},"end":{"line":1,"column":89}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelLeftPanel") || (depth0 != null ? lookupProperty(depth0,"ariaLabelLeftPanel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelLeftPanel","hash":{},"data":data,"loc":{"start":{"line":1,"column":103},"end":{"line":1,"column":125}}}) : helper)))
    + "' "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":127},"end":{"line":1,"column":184}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":185},"end":{"line":1,"column":227}}})) != null ? stack1 : "")
    + "  data-expanded="
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isLeftExpand") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data,"loc":{"start":{"line":1,"column":243},"end":{"line":1,"column":315}}})) != null ? stack1 : "")
    + ">\n    <div class='panelOverFlowClass'>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":5,"column":13}}})) != null ? stack1 : "")
    + "    </div>\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isResizable") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":4},"end":{"line":13,"column":15}}})) != null ? stack1 : "")
    + "</aside>";
},"useData":true});
})();
//END of pxWorkAreaLeft


// START OF pxWorkAreaContent
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkAreaContent'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"centerInspectorData") || (depth0 != null ? lookupProperty(depth0,"centerInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"centerInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":36},"end":{"line":1,"column":61}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":33}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<section "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"centerInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":68}}})) != null ? stack1 : "")
    + " class='workarea-view-content "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"scrollClass") || (depth0 != null ? lookupProperty(depth0,"scrollClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"scrollClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":98},"end":{"line":1,"column":113}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelCenterPanel") || (depth0 != null ? lookupProperty(depth0,"ariaLabelCenterPanel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelCenterPanel","hash":{},"data":data,"loc":{"start":{"line":1,"column":127},"end":{"line":1,"column":151}}}) : helper)))
    + "'>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "</section>";
},"useData":true});
})();
// END OF pxWorkAreaContent



//START of pxWorkAreaRight
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkAreaRight'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"rightInspectorData") || (depth0 != null ? lookupProperty(depth0,"rightInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rightInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":33},"end":{"line":1,"column":57}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":1,"column":156},"end":{"line":1,"column":180}}}) : helper))) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "style='display:none' ";
},"7":function(container,depth0,helpers,partials,data) {
    return " 'true' ";
},"9":function(container,depth0,helpers,partials,data) {
    return " 'false'";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRTL") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data,"loc":{"start":{"line":3,"column":6},"end":{"line":7,"column":17}}})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data) {
    return "      <div class='workarea-main-right-handle ui-resizable-handle ui-resizable-e'></div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "      <div class='workarea-main-right-handle ui-resizable-handle ui-resizable-w'></div>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":11,"column":8},"end":{"line":11,"column":33}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<aside "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rightInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":7},"end":{"line":1,"column":64}}})) != null ? stack1 : "")
    + " class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"wrapperDivClass") || (depth0 != null ? lookupProperty(depth0,"wrapperDivClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wrapperDivClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":72},"end":{"line":1,"column":91}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelRightPanel") || (depth0 != null ? lookupProperty(depth0,"ariaLabelRightPanel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelRightPanel","hash":{},"data":data,"loc":{"start":{"line":1,"column":105},"end":{"line":1,"column":128}}}) : helper)))
    + "' "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":130},"end":{"line":1,"column":187}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":188},"end":{"line":1,"column":230}}})) != null ? stack1 : "")
    + "  data-expanded="
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRightExpand") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data,"loc":{"start":{"line":1,"column":246},"end":{"line":1,"column":319}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isResizable") : depth0),"===","true",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":8,"column":15}}})) != null ? stack1 : "")
    + "    <div class='panelOverFlowClass'>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":12,"column":13}}})) != null ? stack1 : "")
    + "    </div>\n</aside>";
},"useData":true});
})();
//END of pxWorkAreaRight


// START OF pxWorkAreaFooter
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxWorkAreaFooter'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"bottomInspectorData") || (depth0 != null ? lookupProperty(depth0,"bottomInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bottomInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":35},"end":{"line":1,"column":60}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":33}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<footer "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bottomInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":67}}})) != null ? stack1 : "")
    + " class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"finalFooterClass") || (depth0 != null ? lookupProperty(depth0,"finalFooterClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"finalFooterClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":75},"end":{"line":1,"column":95}}}) : helper)))
    + "' aria-label='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelBottomPanel") || (depth0 != null ? lookupProperty(depth0,"ariaLabelBottomPanel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelBottomPanel","hash":{},"data":data,"loc":{"start":{"line":1,"column":109},"end":{"line":1,"column":133}}}) : helper)))
    + "'>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "</footer>";
},"useData":true});
})();
// END OF pxWorkAreaFooter


// START OF template registrations
pega.ui.template.RenderingEngine.register("pxWorkArea", function(componentInfo){
  //var inspectorObj = pega.ui.TemplateEngine.mergeDefaults(componentInfo,true);
  //inspectorObj.refId = componentInfo.templatePage._ref;
  pega.ui.logger.LogHelper.debug("Rendering pxWorkArea, template location : "+componentInfo.refId);
  return pega.ui.TemplateEngine.execute('pxWorkArea', componentInfo);
});

pega.ui.template.RenderingEngine.register("pxWorkAreaHeader", function(componentInfo){
  pega.ui.logger.LogHelper.debug("Rendering pxWorkAreaHeader, template location : "+componentInfo.refId);
  return pega.ui.TemplateEngine.execute('pxWorkAreaHeader', componentInfo);
});

pega.ui.template.RenderingEngine.register("pxWorkAreaLeft", function(componentInfo){
  pega.ui.logger.LogHelper.debug("Rendering pxWorkAreaLeft, template location : "+componentInfo.refId);
  var templates = pega.ui.TemplateEngine.getTemplates(componentInfo) ? pega.ui.TemplateEngine.getTemplates(componentInfo)[0] : null;
  if(templates == null){
    return "";
  }
  var currentContext = pega.ui.TemplateEngine.getCurrentContext();
  var expression = templates["exprID"];
  if(templates["pyName"] === "pxVisible"){
    var isVisible = currentContext.getWhenResult(templates["whenId"]);
    if(!isVisible){
      return "";
    }
  }else if(expression && expression !== ""){
    componentInfo["pyExpressionIdMeta"] = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(expression);  
    var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(expression);  
    var show_when = expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];  
    componentInfo["pyHide"] = typeof show_when == 'undefined' ? false : !show_when;  
    
  }
  return pega.ui.TemplateEngine.execute('pxWorkAreaLeft', componentInfo);
});

pega.ui.template.RenderingEngine.register("pxWorkAreaContent", function(componentInfo){
  pega.ui.logger.LogHelper.debug("Rendering pxWorkAreaContent, template location : "+componentInfo.refId);
  return pega.ui.TemplateEngine.execute('pxWorkAreaContent', componentInfo);
});

pega.ui.template.RenderingEngine.register("pxWorkAreaRight", function(componentInfo){
  pega.ui.logger.LogHelper.debug("Rendering pxWorkAreaRight, template location : "+componentInfo.refId);
  var templates = pega.ui.TemplateEngine.getTemplates(componentInfo) ? pega.ui.TemplateEngine.getTemplates(componentInfo)[0] : null;
  if(templates == null){
    return "";
  }
  var currentContext = pega.ui.TemplateEngine.getCurrentContext();
  var expression = templates["exprID"];
  if(templates["pyName"] === "pxVisible"){
    var isVisible = currentContext.getWhenResult(templates["whenId"]);
    if(!isVisible){
      return "";
    }
  }else if(expression && expression !== ""){
    componentInfo["pyExpressionIdMeta"] = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(expression);  
    var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(expression);  
    var show_when = expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];  
    componentInfo["pyHide"] = typeof show_when == 'undefined' ? false : !show_when;  
  }
  return pega.ui.TemplateEngine.execute('pxWorkAreaRight', componentInfo);
});

pega.ui.template.RenderingEngine.register("pxWorkAreaFooter", function(componentInfo){
  pega.ui.logger.LogHelper.debug("Rendering pxWorkAreaFooter, template location : "+componentInfo.refId);
  return pega.ui.TemplateEngine.execute('pxWorkAreaFooter', componentInfo);
});
// END OF template registrations
//static-content-hash-trigger-GCC