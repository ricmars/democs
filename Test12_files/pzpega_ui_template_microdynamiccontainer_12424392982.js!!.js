/* Micro DC template */
/*
<div data-mdc-id="{{pyACName}}" data-mdc-defaultview="{{pyRuleType}}" {{tourId}} data-mdc-maxdocs="{{maxDocs}}" role="{{ariaRole}}" data-maxdocs-msg="{{FVMaximumTabsAlert}}" data-mdc-dashboardinfo="{{staicContentInfo}}" class="{{pyACName}} {{#if showTabs}}mdc-tab-container{{/if}}">
{{~#if_not_eq pyRuleType "None"~}}
{{~#if_eq isHarnessInclude "false"~}}
<div data-static-section>
{{~/if_eq~}}
{{~/if_not_eq~}}
{{~#if showTabs~}}
<div class="mdc-header">
    <ul role="tablist">{{~#if_not_eq pyRuleType "None"~}}<li class="mdc-tab-item" id="Home" data-mdc-tab-id="{{pyACName}}_0" role="tab" data-click='[["runScript",["pega.ui.Tabs.loadContent(event)"]]]'>{{staticHeader}}</li>{{~/if_not_eq~}}</ul>
    <div class="underline"></div>
</div>
<a href="javascript:void(0)" class="arrow pi pi-caret-left" tabindex="-1"></a><a href="javascript:void(0)" class="arrow pi pi-caret-right" tabindex="-1"></a><a href="javascript:void(0)" tabindex="1" data-click='[["runScript",["pega.ui.Tabs.showMDCMenu(event)"]]]' class="arrow pi pi-caret-down" data-menu-config='{"usingPage":"{{pyMenuConfigUsingPage}}","datasource":"","isNavNLDeferLoaded":"false","isNavTypeCustom":"false","className":"","menuAlign":"right","format":"menu-format-standard","loadBehavior":"ondisplay","ellipsisAfter":"999","useNewMenu":"true","navPageName":"","ContextPage":"","isMobile":"{{isMobile}}"}'></a>
<div class="mdc-content-body">
    <div class="mdc-tabs">
{{~/if~}}
{{~#if_not_eq pyRuleType "None"~}}
{{#each pyTemplates}}
    {{{renderChildren this}}}
{{/each}}
{{~/if_not_eq~}}
{{~#if showTabs~}}
    </div>
</div>
{{~/if~}}
{{~#if_not_eq pyRuleType "None"~}}
{{~#if_eq isHarnessInclude "false"~}}
</div>
{{~/if_eq~}}
{{~/if_not_eq~}}
</div>
{{~#if docsJSON~}}
    <textarea data-ac-name="{{pyACName}}" style="display:none">{{{docsJSON}}}</textarea>
{{~/if~}}
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxMicroDynamicContainer'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "mdc-tab-container";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isHarnessInclude") : depth0),"false",{"name":"if_eq","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":12}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "<div data-static-section>";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"mdc-header\">\n    <ul role=\"tablist\">"
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRuleType") : depth0),"None",{"name":"if_not_eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":23},"end":{"line":9,"column":238}}})) != null ? stack1 : "")
    + "</ul>\n    <div class=\"underline\"></div>\n</div>\n<a href=\"javascript:void(0)\" class=\"arrow pi pi-caret-left\" tabindex=\"-1\"></a><a href=\"javascript:void(0)\" class=\"arrow pi pi-caret-right\" tabindex=\"-1\"></a><a href=\"javascript:void(0)\" tabindex=\"1\" data-click='[[\"runScript\",[\"pega.ui.Tabs.showMDCMenu(event)\"]]]' class=\"arrow pi pi-caret-down\" data-menu-config='{\"usingPage\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyMenuConfigUsingPage") || (depth0 != null ? lookupProperty(depth0,"pyMenuConfigUsingPage") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyMenuConfigUsingPage","hash":{},"data":data,"loc":{"start":{"line":12,"column":327},"end":{"line":12,"column":352}}}) : helper)))
    + "\",\"datasource\":\"\",\"isNavNLDeferLoaded\":\"false\",\"isNavTypeCustom\":\"false\",\"className\":\"\",\"menuAlign\":\"right\",\"format\":\"menu-format-standard\",\"loadBehavior\":\"ondisplay\",\"ellipsisAfter\":\"999\",\"useNewMenu\":\"true\",\"navPageName\":\"\",\"ContextPage\":\"\",\"isMobile\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"isMobile") || (depth0 != null ? lookupProperty(depth0,"isMobile") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"isMobile","hash":{},"data":data,"loc":{"start":{"line":12,"column":607},"end":{"line":12,"column":619}}}) : helper)))
    + "\"}'></a>\n<div class=\"mdc-content-body\">\n    <div class=\"mdc-tabs\">";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li class=\"mdc-tab-item\" id=\"Home\" data-mdc-tab-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyACName") || (depth0 != null ? lookupProperty(depth0,"pyACName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyACName","hash":{},"data":data,"loc":{"start":{"line":9,"column":109},"end":{"line":9,"column":121}}}) : helper)))
    + "_0\" role=\"tab\" data-click='[[\"runScript\",[\"pega.ui.Tabs.loadContent(event)\"]]]'>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"staticHeader") || (depth0 != null ? lookupProperty(depth0,"staticHeader") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"staticHeader","hash":{},"data":data,"loc":{"start":{"line":9,"column":201},"end":{"line":9,"column":217}}}) : helper)))
    + "</li>";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":0},"end":{"line":19,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":18,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "</div>\n</div>";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isHarnessInclude") : depth0),"false",{"name":"if_eq","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":0},"end":{"line":28,"column":12}}})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<textarea data-ac-name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyACName") || (depth0 != null ? lookupProperty(depth0,"pyACName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyACName","hash":{},"data":data,"loc":{"start":{"line":32,"column":28},"end":{"line":32,"column":40}}}) : helper)))
    + "\" style=\"display:none\">"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"docsJSON") || (depth0 != null ? lookupProperty(depth0,"docsJSON") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"docsJSON","hash":{},"data":data,"loc":{"start":{"line":32,"column":63},"end":{"line":32,"column":77}}}) : helper))) != null ? stack1 : "")
    + "</textarea>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div data-mdc-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyACName") || (depth0 != null ? lookupProperty(depth0,"pyACName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyACName","hash":{},"data":data,"loc":{"start":{"line":1,"column":18},"end":{"line":1,"column":30}}}) : helper)))
    + "\" data-mdc-defaultview=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRuleType") || (depth0 != null ? lookupProperty(depth0,"pyRuleType") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRuleType","hash":{},"data":data,"loc":{"start":{"line":1,"column":54},"end":{"line":1,"column":68}}}) : helper)))
    + "\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tourId") || (depth0 != null ? lookupProperty(depth0,"tourId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tourId","hash":{},"data":data,"loc":{"start":{"line":1,"column":70},"end":{"line":1,"column":80}}}) : helper)))
    + " data-mdc-maxdocs=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"maxDocs") || (depth0 != null ? lookupProperty(depth0,"maxDocs") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"maxDocs","hash":{},"data":data,"loc":{"start":{"line":1,"column":99},"end":{"line":1,"column":110}}}) : helper)))
    + "\" role=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaRole") || (depth0 != null ? lookupProperty(depth0,"ariaRole") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaRole","hash":{},"data":data,"loc":{"start":{"line":1,"column":118},"end":{"line":1,"column":130}}}) : helper)))
    + "\" data-maxdocs-msg=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"FVMaximumTabsAlert") || (depth0 != null ? lookupProperty(depth0,"FVMaximumTabsAlert") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"FVMaximumTabsAlert","hash":{},"data":data,"loc":{"start":{"line":1,"column":150},"end":{"line":1,"column":172}}}) : helper)))
    + "\" data-mdc-dashboardinfo=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"staicContentInfo") || (depth0 != null ? lookupProperty(depth0,"staicContentInfo") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"staicContentInfo","hash":{},"data":data,"loc":{"start":{"line":1,"column":198},"end":{"line":1,"column":218}}}) : helper)))
    + "\" class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyACName") || (depth0 != null ? lookupProperty(depth0,"pyACName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyACName","hash":{},"data":data,"loc":{"start":{"line":1,"column":227},"end":{"line":1,"column":239}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"showTabs") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":240},"end":{"line":1,"column":280}}})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRuleType") : depth0),"None",{"name":"if_not_eq","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":6,"column":16}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"showTabs") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":0},"end":{"line":15,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRuleType") : depth0),"None",{"name":"if_not_eq","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":0},"end":{"line":20,"column":16}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"showTabs") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":24,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRuleType") : depth0),"None",{"name":"if_not_eq","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":0},"end":{"line":29,"column":16}}})) != null ? stack1 : "")
    + "</div>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"docsJSON") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":0},"end":{"line":33,"column":9}}})) != null ? stack1 : "");
},"useData":true});
})();


pega.ui.template.RenderingEngine.register("pxMicroDynamicContainer", function(componentInfo){
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;

  /* showTabs only if not touch */
  
  _isTouchDevice = function() {
    return ("ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && (-1 !== navigator.userAgent.toLowerCase().indexOf("mobile") || -1 !== navigator.userAgent.toLowerCase().indexOf("tablet") && !window.MSInputMethodContext && !document.documentMode);
  }

  componentInfo.showTabs = (componentInfo.showTabs === 'true' && !_isTouchDevice());
  componentInfo.staticHeader = mdc_Home;
  var stateInfo = {};
  Object.assign(stateInfo, componentInfo);
  delete stateInfo.tourId;
  delete stateInfo.ariaRole;
  delete stateInfo.pyTemplates;
  delete stateInfo.pyName;
  delete stateInfo.docsJSON;  
  componentInfo.staicContentInfo=JSON.stringify(stateInfo);
  componentInfo.FVMaximumTabsAlert = componentInfo[TEMPLATE_CONSTANTS["FVMAXTABSALERT"]];
  var markup = pega.ui.TemplateEngine.execute("pxMicroDynamicContainer", componentInfo);
  delete componentInfo.staicContentInfo;
  return markup;
});
//static-content-hash-trigger-YUI