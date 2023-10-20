/*
<span {{pyRelativeMetadataPath}}>
{{#if pyModes.[1].isFab}}<mobile-fab hidden mobile-fab-icon='{{pyModes.[1].fabIcon}}' mobile-fab-format='{{pyModes.[1].fabFormat}}' {{else}} <button {{/if}}
{{#ifCond pyAutomationId '!=' ""}} {{{pyAutomationId}}} {{/ifCond}} 
  {{~#with pyModes.[1]~}}     
        {{{pyActionString}}} {{{onLoadNavId}}} {{{pyName}}} {{{pyKey}}} {{{pyStyleName}}} type='button' {{{pyShowMenuAttr}}} data-ctl='Button' {{#ifCond pyTooltipVal '!=' ""}} title="{{pyTooltipVal}}" {{/ifCond}} {{{disabled}}} {{pyExpressionIdMeta}}>
    {{~#if IsActionImageLeft ~}}
      {{~#if IsImage~}}
        <img aria-hidden="true" {{#ifCond pyTooltipValAlt '!=' ""}} alt="{{pyTooltipValAlt}}" {{/ifCond}} src="{{{pyImageVal}}}" class="pzbtn-img pzbtn-extimg" {{{onLoadNavId}}} {{#if pyActionString}} {{{pyBehaviorsCount}}} {{/if}}/>
      {{~else~}}
        <i aria-hidden="true" class="{{{pyImageVal}}}" {{{onLoadNavId}}} {{#if pyActionString}} {{{pyBehaviorsCount}}} {{/if}}></i>
      {{~/if~}}
    {{~/if~}} {{~#if hasLineBreaks ~}} <span class='pzbtn-label' {{{onLoadNavId}}} {{#if pyActionString}} {{{pyBehaviorsCount}}} {{/if}}>{{~/if~}} {{~#if generateUTag ~}} {{{strBeforeUTag}}}<u {{{actionPath}}}>{{{accessKey}}}</u>{{{strAfterUTag}}} {{~else~}} {{{pyLabelVal}}} {{~/if~}} {{~#if hasLineBreaks ~}}</span> {{~/if~}}
      {{~#if IsActionImageRight ~}}
      {{~#if IsImage~}}
        <img aria-hidden="true" {{#ifCond pyTooltipValAlt '!=' ""}} alt="{{pyTooltipValAlt}}" {{/ifCond}} src="{{{pyImageVal}}}" class="pzbtn-img-right pzbtn-extimg" {{{onLoadNavId}}} {{#if pyActionString}} {{{pyBehaviorsCount}}} {{/if}}/>
      {{~else~}}
        <i aria-hidden="true" class="{{{pyImageVal}}}" {{{onLoadNavId}}} {{#if pyActionString}} {{{pyBehaviorsCount}}} {{/if}}></i>
      {{~/if~}}
    {{~/if~}}
  {{~/with~}}
{{#if pyModes.[1].isFab}}</mobile-fab>{{else}}</button>{{/if}}
</span>
*/
/* Start of compiled hbs */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pzpega_ui_template_button'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<mobile-fab hidden mobile-fab-icon='"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"fabIcon") : stack1), depth0))
    + "' mobile-fab-format='"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"fabFormat") : stack1), depth0))
    + "' ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <button ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":3,"column":35},"end":{"line":3,"column":55}}}) : helper))) != null ? stack1 : "")
    + " ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":28}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":5,"column":29},"end":{"line":5,"column":46}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyName") || (depth0 != null ? lookupProperty(depth0,"pyName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyName","hash":{},"data":data,"loc":{"start":{"line":5,"column":47},"end":{"line":5,"column":59}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyKey") || (depth0 != null ? lookupProperty(depth0,"pyKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyKey","hash":{},"data":data,"loc":{"start":{"line":5,"column":60},"end":{"line":5,"column":71}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyStyleName") || (depth0 != null ? lookupProperty(depth0,"pyStyleName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStyleName","hash":{},"data":data,"loc":{"start":{"line":5,"column":72},"end":{"line":5,"column":89}}}) : helper))) != null ? stack1 : "")
    + " type='button' "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyShowMenuAttr") || (depth0 != null ? lookupProperty(depth0,"pyShowMenuAttr") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyShowMenuAttr","hash":{},"data":data,"loc":{"start":{"line":5,"column":104},"end":{"line":5,"column":124}}}) : helper))) != null ? stack1 : "")
    + " data-ctl='Button' "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipVal") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":143},"end":{"line":5,"column":212}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"disabled") || (depth0 != null ? lookupProperty(depth0,"disabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disabled","hash":{},"data":data,"loc":{"start":{"line":5,"column":213},"end":{"line":5,"column":227}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":5,"column":228},"end":{"line":5,"column":250}}}) : helper)))
    + ">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsActionImageLeft") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":12,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hasLineBreaks") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":14},"end":{"line":12,"column":146}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"generateUTag") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.program(22, data, 0),"data":data,"loc":{"start":{"line":12,"column":147},"end":{"line":12,"column":285}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hasLineBreaks") : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":286},"end":{"line":12,"column":327}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsActionImageRight") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":6},"end":{"line":19,"column":13}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyTooltipVal") || (depth0 != null ? lookupProperty(depth0,"pyTooltipVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTooltipVal","hash":{},"data":data,"loc":{"start":{"line":5,"column":183},"end":{"line":5,"column":199}}}) : helper)))
    + "\" ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsImage") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(16, data, 0),"data":data,"loc":{"start":{"line":7,"column":6},"end":{"line":11,"column":15}}})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img aria-hidden=\"true\" "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":32},"end":{"line":8,"column":105}}})) != null ? stack1 : "")
    + " src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":8,"column":111},"end":{"line":8,"column":127}}}) : helper))) != null ? stack1 : "")
    + "\" class=\"pzbtn-img pzbtn-extimg\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":8,"column":160},"end":{"line":8,"column":177}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":178},"end":{"line":8,"column":231}}})) != null ? stack1 : "")
    + "/>";
},"12":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " alt=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyTooltipValAlt") || (depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTooltipValAlt","hash":{},"data":data,"loc":{"start":{"line":8,"column":73},"end":{"line":8,"column":92}}}) : helper)))
    + "\" ";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyBehaviorsCount") || (depth0 != null ? lookupProperty(depth0,"pyBehaviorsCount") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyBehaviorsCount","hash":{},"data":data,"loc":{"start":{"line":8,"column":201},"end":{"line":8,"column":223}}}) : helper))) != null ? stack1 : "")
    + " ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i aria-hidden=\"true\" class=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":10,"column":37},"end":{"line":10,"column":53}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":10,"column":55},"end":{"line":10,"column":72}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":73},"end":{"line":10,"column":126}}})) != null ? stack1 : "")
    + "></i>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='pzbtn-label' "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":12,"column":65},"end":{"line":12,"column":82}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":83},"end":{"line":12,"column":136}}})) != null ? stack1 : "")
    + ">";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"strBeforeUTag") || (depth0 != null ? lookupProperty(depth0,"strBeforeUTag") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"strBeforeUTag","hash":{},"data":data,"loc":{"start":{"line":12,"column":171},"end":{"line":12,"column":190}}}) : helper))) != null ? stack1 : "")
    + "<u "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"actionPath") || (depth0 != null ? lookupProperty(depth0,"actionPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"actionPath","hash":{},"data":data,"loc":{"start":{"line":12,"column":193},"end":{"line":12,"column":209}}}) : helper))) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"accessKey") || (depth0 != null ? lookupProperty(depth0,"accessKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"accessKey","hash":{},"data":data,"loc":{"start":{"line":12,"column":210},"end":{"line":12,"column":225}}}) : helper))) != null ? stack1 : "")
    + "</u>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"strAfterUTag") || (depth0 != null ? lookupProperty(depth0,"strAfterUTag") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"strAfterUTag","hash":{},"data":data,"loc":{"start":{"line":12,"column":229},"end":{"line":12,"column":247}}}) : helper))) != null ? stack1 : "");
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLabelVal") || (depth0 != null ? lookupProperty(depth0,"pyLabelVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelVal","hash":{},"data":data,"loc":{"start":{"line":12,"column":259},"end":{"line":12,"column":275}}}) : helper))) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    return "</span>";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsImage") : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(16, data, 0),"data":data,"loc":{"start":{"line":14,"column":6},"end":{"line":18,"column":15}}})) != null ? stack1 : "");
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<img aria-hidden=\"true\" "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTooltipValAlt") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":32},"end":{"line":15,"column":105}}})) != null ? stack1 : "")
    + " src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyImageVal") || (depth0 != null ? lookupProperty(depth0,"pyImageVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyImageVal","hash":{},"data":data,"loc":{"start":{"line":15,"column":111},"end":{"line":15,"column":127}}}) : helper))) != null ? stack1 : "")
    + "\" class=\"pzbtn-img-right pzbtn-extimg\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"onLoadNavId") || (depth0 != null ? lookupProperty(depth0,"onLoadNavId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onLoadNavId","hash":{},"data":data,"loc":{"start":{"line":15,"column":166},"end":{"line":15,"column":183}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":184},"end":{"line":15,"column":237}}})) != null ? stack1 : "")
    + "/>";
},"29":function(container,depth0,helpers,partials,data) {
    return "</mobile-fab>";
},"31":function(container,depth0,helpers,partials,data) {
    return "</button>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRelativeMetadataPath") || (depth0 != null ? lookupProperty(depth0,"pyRelativeMetadataPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativeMetadataPath","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":32}}}) : helper)))
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"isFab") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":156}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":67}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"with").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1),{"name":"with","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":20,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"pyModes") : depth0)) != null ? lookupProperty(stack1,"1") : stack1)) != null ? lookupProperty(stack1,"isFab") : stack1),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.program(31, data, 0),"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":62}}})) != null ? stack1 : "")
    + "\n</span>";
},"useData":true});
})();
/* End of compiled hbs */

pega.ui.template.RenderingEngine.register("pxButton", function(componentInfo) {
    var context = pega.ui.TemplateEngine.getCurrentContext();
    var brPat = new RegExp("<br\\s*[\/]?>", "i");
    var ct = pega.ui.ChangeTrackerMap.getTracker();
    var pyCell = componentInfo["pyCell"];
  	
  	/* new infra changes -start */
  	
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    pyCell["pyModes"] = pyCell[TEMPLATE_CONSTANTS["PYMODES"]];
    pyCell.pyAutomationId = pyCell[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]];
  	pyCell["pyModes"][1].pyActionStringID = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]];
  	pyCell["pyModes"][1].pyTooltip = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYTOOLTIP"]];
	  pyCell["pyModes"][1].pyHelperTextType = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYHELPERTEXTTYPE"]] || "tooltip";
  	pyCell["pyModes"][1].pyNavigation = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYNAVIGATION"]] ;
  	pyCell["pyModes"][1].pyName = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYNAME"]];
  	pyCell["pyModes"][1].pyKey = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYKEY"]] ;
  	pyCell["pyModes"][1].pyStyleName = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYSTYLENAME"]] ;
  	pyCell["pyModes"][1].pyShowMenu = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYSHOWMENU"]] ;
  	pyCell["pyModes"][1].pyImageSource = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYIMAGESOURCE"]] ;
  	pyCell["pyModes"][1].pyImage = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYIMAGE"]] ;
  	pyCell["pyModes"][1].pyLabel = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYLABEL"]] ;
  	pyCell["pyModes"][1].pyBehaviorsCount = pyCell["pyModes"][1][TEMPLATE_CONSTANTS["PYBEHAVIORSCOUNT"]] ;
  	/*new infra changes -end */	
  
    pyCell.pyRelativeMetadataPath = "data-template";
    var pyModes2 = pyCell["pyModes"][1];
    var pyImageVal = pyModes2.pyImage;
    var bDisabled = false;

	var privilegeRes = componentInfo.pyDisablePrivilege;
    if(privilegeRes != null && privilegeRes == false){
       bDisabled = true;
    } else if(pyModes2.disabled == "always"){
        bDisabled = true;
    } else{
      var expResults = null;
      if (pyModes2.pyExpressionId) {
          var exprIdMetaToStamp = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(pyModes2.pyExpressionId);
          expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(pyModes2.pyExpressionId);
          pyModes2.pyExpressionIdMeta = exprIdMetaToStamp;                 
      } else{
        pyModes2.pyExpressionIdMeta = "";
      }
      if(expResults && expResults[pega.ui.ExpressionEvaluator.DISABLE_WHEN]){
        bDisabled = true;
      } else{
			if(pyModes2.pyDisabled)
				bDisabled = true;
        }
      }
    if (bDisabled) {
        pyModes2.disabled = " disabled tabIndex='-1' ";
    }
    else {
        pyModes2.disabled = '';
    }

    if (pyModes2.pyShowMenu && pyModes2.pyShowMenu == 'true')
        pyModes2.pyShowMenuAttr = " role='button' aria-haspopup='true' ";
    else
        pyModes2.pyShowMenuAttr = "";

  	if((typeof pyModes2.pyStyleName != "undefined") && pyModes2.pyStyleName !== ''){
    		pyModes2.pyStyleName = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(pyModes2.pyStyleName);
    		pyModes2.pyStyleName = pyModes2.pyStyleName ? pyModes2.pyStyleName.trim() : "";
  	}
  	pyModes2.pyStyleName = " class='" + ((pyModes2.pyStyleName !== "") ? (pyModes2.pyStyleName+" "):"") + "pzhc pzbutton'";


    //pyModes2.pyTooltipVal = ct.replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(pyModes2.pyTooltip));
    //pyModes2.pyTooltipVal = pyModes2.pyTooltipVal ? " title='" + pyModes2.pyTooltipVal + "'" : "";
    pyModes2.pyTooltipVal = "";

    if(pyModes2.pyTooltip && pyModes2.pyHelperTextType != "none"){
      var tooltip = context.getLocalizedValue(pyModes2.pyTooltip, 'pyActionPrompt');
      pyModes2.pyTooltipVal = tooltip ? tooltip : "";
      pyModes2.pyTooltipValAlt = tooltip ? tooltip : "";
    }  

    if (pyModes2.pyImageSource != 'none') {
        pyModes2.IsActionImageLeft = pyModes2.pyActionImagePosition == 'left';
        pyModes2.IsActionImageRight = pyModes2.pyActionImagePosition == 'right';
    }
    else {
        pyModes2.IsActionImageLeft = false;
        pyModes2.IsActionImageRight = false;
    }

    pyModes2.IsImage = (pyModes2.pyImageSource == "image" || pyModes2.pyImageSource == "property");

    //pyModes2.pyLabelVal = ct.replaceCTTokensWithValue(pega.ui.template.DataBinder.resolveIndex(pyModes2.pyLabel));
    //pyModes2.pyLabelVal = pega.clientTools.getLocalizedTextForString(".pyButtonLabel", pyModes2.pyLabelVal);
    if(pyModes2.pyLabel) {
      var contextPushed = false;
        if(typeof(pyModes2.pyLabel.indexOf) === "function" && pyModes2.pyLabel.indexOf(".") > -1 && pyModes2.pyLabel.indexOf(".") != 0) {
        context.push(pyModes2.pyLabel.substr(0, pyModes2.pyLabel.lastIndexOf(".")));
        contextPushed = true;
        pyModes2.pyLabel = pyModes2.pyLabel.substr(pyModes2.pyLabel.lastIndexOf("."));
      }
      pyModes2.pyLabelVal = context.getLocalizedValue(pyModes2.pyLabel, 'pyButtonLabel');
      if(contextPushed) {
        context.pop();
      }
     /* if(!pyModes2.pyLabelVal || pyModes2.pyLabelVal == "") {
        pyModes2.pyLabelVal = pyModes2.pyLabel;
      }*/
    }

    pyModes2.generateUTag = false;

    if(pyModes2.pyKey!="") {
        var ampersandRegex = /(?:(?:[^&]|^)(&)(?!(?:$|[a-zA-Z]+;|#\d+;|&|\s)))+?/g;
      	/*BUG-304727: Start*/
        if(pyModes2.pyLabelVal){
         	pyModes2.pyLabelVal = pyModes2.pyLabelVal.replace(/&amp;/g,"&");
        }
        /*BUG-304727: End*/
        var obj = ampersandRegex.exec(pyModes2.pyLabelVal);
        if (obj) {
            pyModes2.generateUTag = true;
            var startIndex = obj.index;
            var ampersandIndex = (pyModes2.pyLabelVal).indexOf(obj[1], startIndex);
            pyModes2.strBeforeUTag = (pyModes2.pyLabelVal).substring(0, ampersandIndex);
            pyModes2.accessKey = (pyModes2.pyLabelVal).charAt(ampersandIndex + 1);
            if(pyModes2.accessKey && pyModes2.accessKey == " ")
              pyModes2.generateUTag = false;
            pyModes2.strAfterUTag = (pyModes2.pyLabelVal).substring(ampersandIndex + 2);
        }
    }

    pyModes2.hasLineBreaks = false;
    if (brPat.test(pyModes2.pyLabelVal)) {
        pyModes2.hasLineBreaks = true;
    }
    pyModes2.pyImageVal = pyImageVal ? context.getPropertyValue(pyImageVal): "";
	/* US-183574: START - applying XSS filter */
    if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
      pyModes2.pyImageVal = pega.ui.ControlTemplate.crossScriptingFilter(pyModes2.pyImageVal);
      var __encodeFun = pega.ui.ControlTemplate.crossScriptingFilter;
      if(pyModes2.hasLineBreaks) {
        __encodeFun = pega.ui.ControlTemplate.checkForScript;
      }
      pyModes2.pyLabelVal = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.pyLabelVal]);
      if(pyModes2.generateUTag) {
      	pyModes2.strBeforeUTag = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.strBeforeUTag]);
      	pyModes2.strAfterUTag = __encodeFun.apply(pega.ui.ControlTemplate, [pyModes2.strAfterUTag]);
      }
    }
    /* US-183574: END */
    
    if (pyModes2.pyName && pyModes2.pyName.indexOf(" name ='") != 0){
        pyModes2.pyName = pyModes2.pyName.replace("$CTX$", context.getReference());
        pyModes2.pyName = " name ='" + pyModes2.pyName + "'";
    } else {
        pyModes2.pyName = '';
    }

    pyModes2.onLoadNavId = '';
    if (pyModes2.pyNavigation) {
        pyModes2.onLoadNavId = " data-menu-nav-page='" + pyModes2.pyNavigation + "' ";
    }
     
    if(pyModes2.pyActionStringID) {
      pyModes2.pyActionString = pega.ui.TemplateEngine.getCurrentContext().getActionString(pyModes2.pyActionStringID);
    }
    if (pyModes2.pyActionString && pyModes2.pyActionString.indexOf(" data-ctl ") != 0) {
        pyModes2.pyActionString = " data-ctl " + pyModes2.pyActionString;
    }
    /* BUG-427619: Commenting out the block which replacing ^~xxxx~^ to #~xxxx~# which causing xss issue
    // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
   pyModes2.pyActionString = pyModes2.pyActionString.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function(){
               return "#~"+arguments[2]+"~#";         
        });
    */
    return pega.ui.TemplateEngine.execute('pzpega_ui_template_button', pyCell);
});
//static-content-hash-trigger-GCC