/* Container Template */

/*
<div {{getTemplateMarker}} {{#if pyContainerInspectorData}}{{{pyContainerInspectorData}}}{{/if}}>
{{~#if_not_eq pyContainerType "NOMARKUP"~}}
{{~#if_not_eq pyContainerType "STANDARD"~}}
{{#if pyIsClientWhen}}
{{#if pyContainerVisibleWhenResult}}
<div id="CT" swp="{{pyStrSWP}}" show_when="{{pyContainerVisibleWhen}}" style="display:block">
{{else}}
<div id="CT" swp="{{pyStrSWP}}" show_when="{{pyContainerVisibleWhen}}" style="display:none">
{{/if}}
{{/if}}
<table cellspacing="0" cellpadding="0" width="100%" id="harness-container" {{#if pyContainerStyle}} class="{{pyContainerStyle}}" {{else}} {{#if_eq pyContainerType "NONE"}} class="containerBody" {{/if_eq}} {{/if}}>
<tr><td><div{{#if_eq pyContainerType "NONE"}} class="harnessBodyNoHead"{{/if_eq}}>
{{~/if_not_eq~}}
{{~/if_not_eq~}}

{{~#if_eq pyContainerType "NOMARKUP"~}}
{{#if pyIsClientWhen}}
{{#if pyContainerVisibleWhenResult}}
<div id="CT" swp="{{pyStrSWP}}" show_when="{{pyContainerVisibleWhen}}" style="display:block">
{{else}}
<div id="CT" swp="{{pyStrSWP}}" show_when="{{pyContainerVisibleWhen}}" style="display:none">
{{/if}}
{{/if}}
{{~/if_eq~}}

{{#each pyTemplates}}
    {{{renderChildren this}}}
  {{/each}}

{{~#if_not_eq pyContainerType "NOMARKUP"~}}
{{~#if_not_eq pyContainerType "STANDARD"~}}
</div>
</td></tr>
</table>
{{#if pyIsClientWhen}}
</div>
{{/if}}
{{~/if_not_eq~}}
{{~/if_not_eq~}}
{{~#if_eq pyContainerType "NOMARKUP"~}}
{{#if pyIsClientWhen}}
</div>
{{/if}}
{{~/if_eq~}}
</div>
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxHarnessContainer'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyContainerInspectorData") || (depth0 != null ? lookupProperty(depth0,"pyContainerInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyContainerInspectorData","hash":{},"data":data,"loc":{"start":{"line":1,"column":59},"end":{"line":1,"column":89}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"STANDARD",{"name":"if_not_eq","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":13,"column":16}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsClientWhen") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":10,"column":7}}})) != null ? stack1 : "")
    + "<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"harness-container\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerStyle") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data,"loc":{"start":{"line":11,"column":75},"end":{"line":11,"column":212}}})) != null ? stack1 : "")
    + ">\n<tr><td><div"
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NONE",{"name":"if_eq","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":12},"end":{"line":12,"column":81}}})) != null ? stack1 : "")
    + ">";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerVisibleWhenResult") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":9,"column":7}}})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"CT\" swp=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyStrSWP") || (depth0 != null ? lookupProperty(depth0,"pyStrSWP") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStrSWP","hash":{},"data":data,"loc":{"start":{"line":6,"column":18},"end":{"line":6,"column":30}}}) : helper)))
    + "\" show_when=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyContainerVisibleWhen") || (depth0 != null ? lookupProperty(depth0,"pyContainerVisibleWhen") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyContainerVisibleWhen","hash":{},"data":data,"loc":{"start":{"line":6,"column":43},"end":{"line":6,"column":69}}}) : helper)))
    + "\" style=\"display:block\">\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"CT\" swp=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyStrSWP") || (depth0 != null ? lookupProperty(depth0,"pyStrSWP") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStrSWP","hash":{},"data":data,"loc":{"start":{"line":8,"column":18},"end":{"line":8,"column":30}}}) : helper)))
    + "\" show_when=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyContainerVisibleWhen") || (depth0 != null ? lookupProperty(depth0,"pyContainerVisibleWhen") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyContainerVisibleWhen","hash":{},"data":data,"loc":{"start":{"line":8,"column":43},"end":{"line":8,"column":69}}}) : helper)))
    + "\" style=\"display:none\">\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyContainerStyle") || (depth0 != null ? lookupProperty(depth0,"pyContainerStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyContainerStyle","hash":{},"data":data,"loc":{"start":{"line":11,"column":107},"end":{"line":11,"column":127}}}) : helper)))
    + "\" ";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NONE",{"name":"if_eq","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":138},"end":{"line":11,"column":204}}})) != null ? stack1 : "")
    + " ";
},"13":function(container,depth0,helpers,partials,data) {
    return " class=\"containerBody\" ";
},"15":function(container,depth0,helpers,partials,data) {
    return " class=\"harnessBodyNoHead\"";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsClientWhen") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":0},"end":{"line":23,"column":7}}})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":27,"column":4},"end":{"line":27,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"STANDARD",{"name":"if_not_eq","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":0},"end":{"line":38,"column":16}}})) != null ? stack1 : "");
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "</div>\n</td></tr>\n</table>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsClientWhen") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":37,"column":7}}})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    return "</div>\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsClientWhen") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":41,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":1,"column":5},"end":{"line":1,"column":26}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerInspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":96}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NOMARKUP",{"name":"if_not_eq","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":14,"column":16}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NOMARKUP",{"name":"if_eq","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":0},"end":{"line":24,"column":12}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":0},"end":{"line":28,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NOMARKUP",{"name":"if_not_eq","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":0},"end":{"line":39,"column":16}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyContainerType") : depth0),"NOMARKUP",{"name":"if_eq","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":44,"column":12}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();

function containerRenderer(componentInfo){
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  componentInfo.pyStrSWP = componentInfo[TEMPLATE_CONSTANTS["PYSTRSWP"]];
  componentInfo.pyContainerVisibleWhenResult = componentInfo[TEMPLATE_CONSTANTS["PYWHENRESULT"]];
  componentInfo.pyContainerInspectorData = componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]];
  componentInfo.pyContainerType = componentInfo[TEMPLATE_CONSTANTS["PYCONTAINERTYPE"]];

  componentInfo.pyContainerStyle = componentInfo[TEMPLATE_CONSTANTS["PYCONTAINERSTYLE"]];

  componentInfo.pyIsClientWhen = componentInfo[TEMPLATE_CONSTANTS["PYISCLIENTWHEN"]];
  componentInfo.pyContainerVisibleWhen = componentInfo[TEMPLATE_CONSTANTS["PYCONTAINERVISIBLEWHEN"]];

  return pega.ui.TemplateEngine.execute("pxHarnessContainer", componentInfo);
}
pega.ui.template.RenderingEngine.register("pxHarnessContainer", containerRenderer);
//static-content-hash-trigger-YUI