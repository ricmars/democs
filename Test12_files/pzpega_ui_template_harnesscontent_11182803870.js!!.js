/* pxHarnessContent template */
/*
<div id="HARNESS_CONTENT" {{getTemplateMarker}} class="harnessContent{{#if workAreaContentDivStyle}} {{workAreaContentDivStyle}}{{/if}}">
{{#each pyTemplates}}
  {{{renderChildren this}}}
{{/each}}
</div>
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxHarnessContent'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"workAreaContentDivStyle") || (depth0 != null ? lookupProperty(depth0,"workAreaContentDivStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"workAreaContentDivStyle","hash":{},"data":data,"loc":{"start":{"line":1,"column":101},"end":{"line":1,"column":128}}}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
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

  return "<div id=\"HARNESS_CONTENT\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":47}}}) : helper)))
    + " class=\"harnessContent"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"workAreaContentDivStyle") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":69},"end":{"line":1,"column":135}}})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":9}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pxHarnessContent", function(componentInfo){
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  componentInfo.workAreaContentDivStyle = componentInfo[TEMPLATE_CONSTANTS["WACONTDIVSTYLE"]];
  return pega.ui.TemplateEngine.execute("pxHarnessContent", componentInfo);
});
//static-content-hash-trigger-GCC