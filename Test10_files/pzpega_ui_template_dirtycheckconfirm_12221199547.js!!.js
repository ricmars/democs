/* pyDirtyCheckConfirm template */
/*
<div id="dirty-confirm-div" style="display:none;">
	{{#each pyTemplates}}
    	{{{renderChildren this}}}
    {{/each}}
</div>
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pyDirtyCheckConfirm'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    	"
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":30}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"dirty-confirm-div\" style=\"display:none;\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":1},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pyDirtyCheckConfirm", function(componentInfo){
  //var metadata = pega.ui.TemplateEngine.mergeDefaults(componentInfo);
  return pega.ui.TemplateEngine.execute("pyDirtyCheckConfirm", componentInfo);
});
//static-content-hash-trigger-GCC