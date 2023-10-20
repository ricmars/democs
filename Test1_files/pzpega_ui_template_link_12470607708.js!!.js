/*
<span {{pyRelativeMetadataPath}} >
<a data-test-id="{{{pyAutomationId}}}" 
  {{~#with pyModes.[1]~}}     
        {{{pyActionString}}} {{{roleString}}} {{{onLoadNavId}}} href="{{hrefValue}}" href_original="{{hrefOrigValue}}" fromicon  {{{clickAttr}}}
  {{{pyName}}} {{{pyKey}}} {{{pyStyleName}}} data-ctl='Link' {{#ifCond pyTooltipVal '!=' ""}} title="{{pyTooltipVal}}" {{/ifCond}} {{{disabled}}} {{pyExpressionIdMeta}}>  
  {{~#if IsActionImageLeft ~}}
    {{~#if IsImage~}}
      <img aria-hidden="true" {{#ifCond pyTooltipValAlt '!=' ""}} alt="{{pyTooltipValAlt}}" {{/ifCond}} src="{{{pyImageVal}}}" class="pzbtn-img" {{{onLoadNavId}}} {{{pyActionString}}}>
    {{~else~}}
      <i aria-hidden="true" class="{{{pyImageVal}}}" {{{onLoadNavId}}} {{{pyActionString}}}></i>
    {{~/if~}}
  {{~/if~}} {{~#if hasLinkBreaks ~}} <span class='pzbtn-label' {{{onLoadNavId}}} {{{pyActionString}}}>{{~/if~}} {{~#if generateUTag ~}} {{{strBeforeUTag}}}<u>{{accessKey}}</u>{{{strAfterUTag}}} {{~else~}} {{{pyLabelVal}}} {{~/if~}} {{~#if hasLinkBreaks ~}}</span> {{~/if~}}
    {{~#if IsActionImageRight ~}}
    {{~#if IsImage~}}
      <img aria-hidden="true" {{#ifCond pyTooltipValAlt '!=' ""}} alt="{{pyTooltipValAlt}}" {{/ifCond}} src="{{{pyImageVal}}}" class="pzbtn-img-right" {{{onLoadNavId}}} {{{pyActionString}}}>
    {{~else}} <i aria-hidden="true" class="{{{pyImageVal}}}" {{{onLoadNavId}}} {{{pyActionString}}}></i>
    {{~/if~}}
  {{~/if~}}
{{~/with~}}
</a>
</span>
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['linktemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":28}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"roleString") || (depth0 != null ? lookupProperty(depth0,"roleString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"roleString","hash":{},"data":data,"loc":{"start":{"line":4,"column":29},"end":{"line":4,"column":45}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":4,"column":46},"end":{"line":4,"column":63}}}) : helper))) != null ? stack1 : "")
    + " href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"hrefValue") || (depth0 != null ? lookupProperty(depth0,"hrefValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"hrefValue","hash":{},"data":data,"loc":{"start":{"line":4,"column":70},"end":{"line":4,"column":83}}}) : helper)))
    + "\" href_original=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"hrefOrigValue") || (depth0 != null ? lookupProperty(depth0,"hrefOrigValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"hrefOrigValue","hash":{},"data":data,"loc":{"start":{"line":4,"column":100},"end":{"line":4,"column":117}}}) : helper)))
    + "\" fromicon  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"clickAttr") || (depth0 != null ? lookupProperty(depth0,"clickAttr") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"clickAttr","hash":{},"data":data,"loc":{"start":{"line":4,"column":129},"end":{"line":4,"column":144}}}) : helper))) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":14}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyKey") || (depth0 != null ? lookupProperty(depth0,"pyKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyKey","hash":{},"data":data,"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":26}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyStyleName") || (depth0 != null ? lookupProperty(depth0,"pyStyleName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStyleName","hash":{},"data":data,"loc":{"start":{"line":5,"column":27},"end":{"line":5,"column":44}}}) : helper))) != null ? stack1 : "")
    + " data-ctl='Link' "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipVal") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":61},"end":{"line":5,"column":130}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabled") || (depth0 != null ? lookupProperty(depth0,"disabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabled","hash":{},"data":data,"loc":{"start":{"line":5,"column":131},"end":{"line":5,"column":145}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":5,"column":146},"end":{"line":5,"column":168}}}) : helper)))
    + ">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsActionImageLeft") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":2},"end":{"line":12,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hasLinkBreaks") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":12},"end":{"line":12,"column":111}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"generateUTag") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data,"loc":{"start":{"line":12,"column":112},"end":{"line":12,"column":231}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hasLinkBreaks") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":232},"end":{"line":12,"column":273}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsActionImageRight") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":4},"end":{"line":18,"column":11}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyTooltipVal") || (depth0 != null ? lookupProperty(depth0,"pyTooltipVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTooltipVal","hash":{},"data":data,"loc":{"start":{"line":5,"column":101},"end":{"line":5,"column":117}}}) : helper)))
    + "\" ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsImage") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":7,"column":4},"end":{"line":11,"column":13}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img aria-hidden=\"true\" "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":30},"end":{"line":8,"column":103}}})) != null ? stack1 : "")
    + " src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":8,"column":109},"end":{"line":8,"column":125}}}) : helper))) != null ? stack1 : "")
    + "\" class=\"pzbtn-img\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":8,"column":145},"end":{"line":8,"column":162}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":8,"column":163},"end":{"line":8,"column":183}}}) : helper))) != null ? stack1 : "")
    + ">";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " alt=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyTooltipValAlt") || (depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTooltipValAlt","hash":{},"data":data,"loc":{"start":{"line":8,"column":71},"end":{"line":8,"column":90}}}) : helper)))
    + "\" ";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i aria-hidden=\"true\" class=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":10,"column":35},"end":{"line":10,"column":51}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":10,"column":53},"end":{"line":10,"column":70}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":10,"column":71},"end":{"line":10,"column":91}}}) : helper))) != null ? stack1 : "")
    + "></i>";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='pzbtn-label' "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":12,"column":63},"end":{"line":12,"column":80}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":12,"column":81},"end":{"line":12,"column":101}}}) : helper))) != null ? stack1 : "")
    + ">";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"strBeforeUTag") || (depth0 != null ? lookupProperty(depth0,"strBeforeUTag") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"strBeforeUTag","hash":{},"data":data,"loc":{"start":{"line":12,"column":136},"end":{"line":12,"column":155}}}) : helper))) != null ? stack1 : "")
    + "<u>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"accessKey") || (depth0 != null ? lookupProperty(depth0,"accessKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"accessKey","hash":{},"data":data,"loc":{"start":{"line":12,"column":158},"end":{"line":12,"column":171}}}) : helper)))
    + "</u>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"strAfterUTag") || (depth0 != null ? lookupProperty(depth0,"strAfterUTag") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"strAfterUTag","hash":{},"data":data,"loc":{"start":{"line":12,"column":175},"end":{"line":12,"column":193}}}) : helper))) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLabelVal") || (depth0 != null ? lookupProperty(depth0,"pyLabelVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelVal","hash":{},"data":data,"loc":{"start":{"line":12,"column":205},"end":{"line":12,"column":221}}}) : helper))) != null ? stack1 : "");
},"16":function(container,depth0,helpers,partials,data) {
    return "</span>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsImage") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.program(21, data, 0),"data":data,"loc":{"start":{"line":14,"column":4},"end":{"line":17,"column":13}}})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img aria-hidden=\"true\" "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":30},"end":{"line":15,"column":103}}})) != null ? stack1 : "")
    + " src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":15,"column":109},"end":{"line":15,"column":125}}}) : helper))) != null ? stack1 : "")
    + "\" class=\"pzbtn-img-right\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":15,"column":151},"end":{"line":15,"column":168}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":15,"column":169},"end":{"line":15,"column":189}}}) : helper))) != null ? stack1 : "")
    + ">";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " <i aria-hidden=\"true\" class=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":16,"column":43},"end":{"line":16,"column":59}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":16,"column":61},"end":{"line":16,"column":78}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":16,"column":79},"end":{"line":16,"column":99}}}) : helper))) != null ? stack1 : "")
    + "></i>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":32}}}) : helper)))
    + " >\n<a data-test-id=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":37}}}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"with").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1),{"name":"with","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":19,"column":11}}})) != null ? stack1 : "")
    + "</a>\n</span>";
},"useData":true});
})();

pega.ui.template.RenderingEngine.register("pxLink", function(componentInfo) {
    var context = pega.ui.TemplateEngine.getCurrentContext();    
    var brPat = new RegExp("<br\\s*[\/]?>", "i");
    var ct = pega.ui.ChangeTrackerMap.getTracker();
    var pyCell = componentInfo["pyCell"];
  
  	/* new infra changes -start */
    
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    pyCell["pyModes"] = pyCell[TEMPLATE_CONSTANTS["PYMODES"]];
    pyCell.pyAutomationId = pyCell[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]] ;
    pyCell["pyModes"][1].pyActionStringID = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]] ;
    pyCell["pyModes"][1].pyTooltip = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYTOOLTIP"]] ;
    pyCell["pyModes"][1].pyHelperTextType = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYHELPERTEXTTYPE"]] || "tooltip";
    pyCell["pyModes"][1].pyStyleName =  pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYSTYLENAME"]] ;
    pyCell["pyModes"][1].pyImageSource = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYIMAGESOURCE"]] ;
    pyCell["pyModes"][1].pyImage = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYIMAGE"]] ;
    pyCell["pyModes"][1].pyActionImagePosition = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYACTIONIMAGEPOSITION"]] ;
    pyCell["pyModes"][1].pyLinkButtonCaptionType = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYLINKBUTTONCAPTIONTYPE"]] ;
    /*new infra changes -end */
  
    pyCell.pyRelativeMetadataPath = "data-template";
    var pyModes2 = pyCell["pyModes"][1];
    var pyImageVal = pyModes2.pyImage;
    var localizedFormatvalue = context.getLocalizedValue(pyModes2.pyFormatValue, 'pyCaption');
    var bDisabled = false;
	
  
	
	var privilegeRes = componentInfo.pyDisablePrivilege;
    if(privilegeRes != null && privilegeRes == false){
       bDisabled = true;
    } else if(pyModes2.disabled == "always"){
       bDisabled = true;
    } else{
      var expResults = null;
      if (pyModes2.pyExpressionId) {
          var exprIdMetaToStamp = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (pyModes2.pyExpressionId);
          expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(pyModes2.pyExpressionId);
          pyModes2.pyExpressionIdMeta = exprIdMetaToStamp;           
      } else {
        pyModes2.pyExpressionIdMeta = "";
      }

	  
      if(expResults && expResults[pega.ui.ExpressionEvaluator.DISABLE_WHEN]){
        bDisabled = true;
      } else if(pyModes2.pyDisabled) {
		  bDisabled =  true;
	  }
    }
    if (!pyModes2.pyFormatTypeActionable || pyModes2.pyFormatTypeActionable == "") {
        pyModes2.pyFormatTypeActionable = "none";
    }
  if (pyModes2.pyFormatTypeActionable == "email") {
        pyModes2.pyFormatValue = "mailto:" + localizedFormatvalue;
    }
    else if (pyModes2.pyFormatTypeActionable == "tel") {
        pyModes2.pyFormatValue = "tel:" + localizedFormatvalue;
    }
    else if (pyModes2.pyFormatTypeActionable == "url") {
        pyModes2.pyFormatValue = localizedFormatvalue;
    }else{
        pyModes2.pyFormatValue = "";
    }
    if (bDisabled) {
        pyModes2.hrefValue = "#";
        pyModes2.hrefOrigValue = pyModes2.pyFormatValue;
        //pyModes2.hrefOrigValue = context.getLocalizedValue(pyModes2.hrefOrigValue, 'pyCaption');
        pyModes2.disabled = " disabled aria-disabled='true' tabindex='-1'";
    }
    else {
        pyModes2.hrefValue = pyModes2.pyFormatValue || "#";
        //pyModes2.hrefValue = context.getLocalizedValue(pyModes2.hrefValue, 'pyCaption');
        pyModes2.hrefOrigValue = "#";
        pyModes2.disabled = '';
    }
    
    pyModes2.pyStyleName = pyModes2.pyStyleName ? pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(pyModes2.pyStyleName) : "";
    if (typeof pyModes2.pyStyleName != "undefined" && pyModes2.pyStyleName.indexOf(" class='") != 0)
        pyModes2.pyStyleName = " class='" + pyModes2.pyStyleName + "'";

    //pyModes2.pyTooltipVal = ct.replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(pyModes2.pyTooltip));
    //pyModes2.pyTooltipVal = pyModes2.pyTooltipVal ? " title=\"" + pyModes2.pyTooltipVal + "\"" : "";
    pyModes2.pyTooltipVal = "";
    if(pyModes2.pyTooltip && pyModes2.pyHelperTextType != "none"){
      var tooltip = context.getLocalizedValue(pyModes2.pyTooltip, 'pyActionPrompt');
      /* BUG-304674: encoding single quote */
      pyModes2.pyTooltipVal = tooltip ? tooltip : "";
      pyModes2.pyTooltipValAlt = tooltip ? tooltip : "";
    }  

    if (pyModes2.pyImageSource != 'none') {
        pyModes2.IsActionImageLeft = (pyModes2.pyActionImagePosition == 'left');
        pyModes2.IsActionImageRight = (pyModes2.pyActionImagePosition == 'right');
    }
    else {
        pyModes2.IsActionImageLeft = false;
        pyModes2.IsActionImageRight = false;
    }
    pyModes2.IsImage = (pyModes2.pyImageSource == "image" || pyModes2.pyImageSource == "property");
    if ("#" == pyModes2.hrefValue) {
        pyModes2.clickAttr = " onclick='pd(event);' ";
    }
    if ("url" === pyModes2.pyFormatType || "url" === pyModes2.pyFormatTypeActionable || "email" === pyModes2.pyFormatType || "email" === pyModes2.pyFormatTypeActionable) {
        pyModes2.clickAttr = " target='_blank' ";
    }
    //pyModes2.pyLabelVal = ct.replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(pyModes2.pyLabel));
    //pyModes2.pyLabelVal = pega.clientTools.getLocalizedTextForString(".pyButtonLabel", pyModes2.pyLabelVal);

    if(pyModes2.pyLabel) {
      var contextPushed = false;
      if(pyModes2.pyLinkButtonCaptionType && pyModes2.pyLinkButtonCaptionType == "propertyReference" && typeof(pyModes2.pyLabel.indexOf) === "function" && pyModes2.pyLabel.indexOf(".") > -1 && pyModes2.pyLabel.indexOf(".") != 0) {
        context.push(pyModes2.pyLabel.substr(0, pyModes2.pyLabel.lastIndexOf(".")));
        contextPushed = true;
        pyModes2.pyLabel = pyModes2.pyLabel.substr(pyModes2.pyLabel.lastIndexOf("."));
      }
      pyModes2.pyLabelVal = context.getLocalizedValue(pyModes2.pyLabel, 'pyButtonLabel');
      if(contextPushed) {
        context.pop();
      }
      
      /*
      if(!pyModes2.pyLabelVal || pyModes2.pyLabelVal == "") {
        pyModes2.pyLabelVal = pyModes2.pyLabel;
      }
      */
    }

    pyModes2.generateUTag = false;
    
    if(pyModes2.pyKey && pyModes2.pyKey!="") {
      var ampersandRegex = /(?:(?:[^&]|^)(&)(?!(?:$|[a-zA-Z]+;|#\\d+;|&|\\s)))+?/g;
      if(pyModes2.pyLabelVal){
        pyModes2.pyLabelVal = pyModes2.pyLabelVal.replace(/&amp;/g,"&");
      }
      var obj = ampersandRegex.exec(pyModes2.pyLabelVal);
      if (obj) {
        pyModes2.generateUTag = true;
        var startIndex = obj.index;
        var ampersandIndex = (pyModes2.pyLabelVal).indexOf(obj[1], startIndex);
        pyModes2.strBeforeUTag = (pyModes2.pyLabelVal).substring(0, ampersandIndex);
        pyModes2.accessKey = (pyModes2.pyLabelVal).charAt(ampersandIndex + 1);
        pyModes2.strAfterUTag = (pyModes2.pyLabelVal).substring(ampersandIndex + 2);
      }
    }
    /*}*/
    pyModes2.hasLinkBreaks = false;
    if (brPat.test(pyModes2.pyLabelVal)) {
        pyModes2.hasLinkBreaks = true;
    }
    //pyModes2.pyImageVal = ct.replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(pyModes2.pyImage));
    pyModes2.pyImageVal = pyImageVal ? context.getPropertyValue(pyImageVal): "";
  	/* US-183574: START - applying XSS filter */
  	if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
    	pyModes2.pyImageVal = pega.ui.ControlTemplate.crossScriptingFilter(pyModes2.pyImageVal);
      	var __encodeFun = pega.ui.ControlTemplate.crossScriptingFilter;
      	var escapeQuote = false;
      	if(pyModes2.hasLinkBreaks || (pyModes2.pyLinkButtonCaptionType && pyModes2.pyLinkButtonCaptionType == "text")) {
           __encodeFun = pega.ui.ControlTemplate.checkForScript;
          escapeQuote = true;
        }
      	pyModes2.pyLabelVal = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.pyLabelVal, escapeQuote]);
        if(pyModes2.generateUTag) {
            pyModes2.strBeforeUTag = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.strBeforeUTag, escapeQuote]);
            pyModes2.strAfterUTag = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.strAfterUTag, escapeQuote]);
        }
    }
  	/* US-183574: END */
  
  
  
    if (pyModes2.pyName && pyModes2.pyName.indexOf(" name ='") != 0){
        pyModes2.pyName = pyModes2.pyName.replace("$CTX$", context.getReference());
        pyModes2.pyName = " name ='" + pyModes2.pyName + "'";
    }else {
        pyModes2.pyName = '';
    }

    pyModes2.onLoadNavId = '';
    if (pyModes2.pyNavigation) {
        pyModes2.onLoadNavId = " data-menu-nav-page='" + pyModes2.pyNavigation + "' ";
    }
    if(pyModes2.pyActionStringID){
      pyModes2.pyActionString = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes2.pyActionStringID);
    }
    if (pyModes2.pyActionString && pyModes2.pyActionString.indexOf(" data-ctl ") != 0) {
        pyModes2.pyActionString = " data-ctl " + pyModes2.pyActionString;
    }
   
	 /* BUG-297993: Adding role attribute if showMenu action configured */
	 /* BUG-349923: Adding role attribute if showMenu action configured */
    if (pyModes2.pyActionString && pyModes2.pyActionString.indexOf("[\"showMenu\",[") != -1) {
        pyModes2.roleString = " role='link' aria-haspopup='true' ";
    }
    /* Commenting out the block which replacing ^~xxxx~^ to #~xxxx~# which causing xss issue
    The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
  if(pyModes2.pyActionString) {
    pyModes2.pyActionString = pyModes2.pyActionString.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function(){
               return "#~"+arguments[2]+"~#";         
        });
  } */
   
    return Handlebars.templates['linktemplate'](pyCell);
});
//static-content-hash-trigger-YUI