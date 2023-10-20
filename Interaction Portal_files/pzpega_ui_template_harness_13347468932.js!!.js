/*
<div id="PEGA_HARNESS" {{getTemplateMarker}} {{#if pyInspectorData}}{{{pyInspectorData}}}{{/if}} version="{{pyHTMLVersion}}" node_type="MAIN_RULE" node_name="{{pyStreamName}}" objclass="Rule-HTML-Harness" classname="{{pyClassName}}" inshandle={{pyInsHandle}} {{#if inlineStyle}}style="{{inlineStyle}}"{{/if}} data-primary-page-class="{{primarypageclass}}" {{#if CSSClass}}class="{{CSSClass}}"{{/if}} {{#if threadName}}thread_name="{{threadName}}"{{/if}}>
{{#each pyTemplates}}
  {{{renderChildren this}}}
{{/each}}    
</div>
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['Harness'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyInspectorData") || (depth0 != null ? lookupProperty(depth0,"pyInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":68},"end":{"line":1,"column":89}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "style=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"inlineStyle") || (depth0 != null ? lookupProperty(depth0,"inlineStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"inlineStyle","hash":{},"data":data,"loc":{"start":{"line":1,"column":285},"end":{"line":1,"column":300}}}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"CSSClass") || (depth0 != null ? lookupProperty(depth0,"CSSClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"CSSClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":379},"end":{"line":1,"column":391}}}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "thread_name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"threadName") || (depth0 != null ? lookupProperty(depth0,"threadName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"threadName","hash":{},"data":data,"loc":{"start":{"line":1,"column":431},"end":{"line":1,"column":445}}}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":27}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"PEGA_HARNESS\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":1,"column":23},"end":{"line":1,"column":44}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":45},"end":{"line":1,"column":96}}})) != null ? stack1 : "")
    + " version=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyHTMLVersion") || (depth0 != null ? lookupProperty(depth0,"pyHTMLVersion") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHTMLVersion","hash":{},"data":data,"loc":{"start":{"line":1,"column":106},"end":{"line":1,"column":123}}}) : helper)))
    + "\" node_type=\"MAIN_RULE\" node_name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyStreamName") || (depth0 != null ? lookupProperty(depth0,"pyStreamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStreamName","hash":{},"data":data,"loc":{"start":{"line":1,"column":158},"end":{"line":1,"column":174}}}) : helper)))
    + "\" objclass=\"Rule-HTML-Harness\" classname=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyClassName") || (depth0 != null ? lookupProperty(depth0,"pyClassName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyClassName","hash":{},"data":data,"loc":{"start":{"line":1,"column":216},"end":{"line":1,"column":231}}}) : helper)))
    + "\" inshandle="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInsHandle") || (depth0 != null ? lookupProperty(depth0,"pyInsHandle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInsHandle","hash":{},"data":data,"loc":{"start":{"line":1,"column":243},"end":{"line":1,"column":258}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"inlineStyle") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":259},"end":{"line":1,"column":308}}})) != null ? stack1 : "")
    + " data-primary-page-class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"primarypageclass") || (depth0 != null ? lookupProperty(depth0,"primarypageclass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"primarypageclass","hash":{},"data":data,"loc":{"start":{"line":1,"column":334},"end":{"line":1,"column":354}}}) : helper)))
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"CSSClass") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":356},"end":{"line":1,"column":399}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"threadName") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":400},"end":{"line":1,"column":453}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("Harness", function(componentInfo){
  componentInfo.startIndex = 0;
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  componentInfo.pyInspectorData = componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]];
  componentInfo.pyHTMLVersion = componentInfo[TEMPLATE_CONSTANTS["PYHTMLVERSION"]];
  componentInfo.pyStreamName = componentInfo[TEMPLATE_CONSTANTS["PYSTREAMNAME"]];
  componentInfo.pyClassName = componentInfo[TEMPLATE_CONSTANTS["PYCLASSNAME"]];
  componentInfo.pyInsHandle = componentInfo[TEMPLATE_CONSTANTS["PYINSHANDLE"]];
  componentInfo.primarypageclass = componentInfo[TEMPLATE_CONSTANTS["PYPRIMARYPAGECLASS"]];
  componentInfo.pyJSRCompliant = componentInfo[TEMPLATE_CONSTANTS["PYJSRCOMPLIANT"]];
  componentInfo.CSSClass = componentInfo[TEMPLATE_CONSTANTS["PYCSSCLASS"]];
  componentInfo.inlineStyle = componentInfo[TEMPLATE_CONSTANTS["PYINLINESTYLE"]];
  componentInfo.threadName = componentInfo[TEMPLATE_CONSTANTS["THREADNAME"]];

  // Push context
  var primaryPage = componentInfo["pzPrimaryPage"];
  var currentContext = pega.ui.TemplateEngine.getCurrentContext();
  if(primaryPage){
    currentContext.push(primaryPage);
  }	

  var markup = pega.ui.TemplateEngine.execute("Harness", componentInfo);

  // Cleanup
  if(primaryPage){
    currentContext.pop();
  }
  return markup;
});
//static-content-hash-trigger-GCC