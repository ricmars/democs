/* LG Structure */
/*

<div {{{sInspectorLayoutData}}} {{noGestures}} {{tourID}} data-lg-id="{{LGTabGrpId}}" {{~#if AddNewTab  ~}}data-addnewtab="true"{{~/if~}} {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}} data-repeat-id="{{LGRepeatId}}" {{~#if isRepeatLayoutGroup}} data-lg-repeatSource="{{originalDataSource}}" data-methodname="{{pyMethodName}}" data-refresh="true" {{~/if~}}  {{#if_not_eq isSemanticTabLayout "true"}} role="tablist" {{/if_not_eq}} class="{{~#unless isStretchTabsEnabled~}} {{#unless isMobile}}tab-overflow{{/unless}}{{/unless}} content
    
    {{~#if isDirectChildLayoutGroup~}} "><div class=" {{~/if~}}

    {{pyLgClass}} {{pyCustomCSS}}"
    {{#if pyInlineStyle}} style="{{pyInlineStyle}}" {{/if}}
  {{#if lgOptKeys}} data-lg-options={{{lgOptKeys}}} {{/if}} data-template {{#if_eq isSemanticTabLayout "true"}} data-Semantic-tab = "true" {{/if_eq}} {{#if_eq allowScrollForTabHeaders "true"}} data-header-scrollable = "true" {{/if_eq}} {{pyExpressionIdMeta}}>{{!-- tab overflow --}}{{~#unless isStretchTabsEnabled~}}
  {{~#unless isMobile~}}
    <div class="tab-arrow left-tab-nav-controls left-arrow pi pi-caret-left" style=""></div>
   {{~/unless~}}
    <div class="right-tab-nav-controls">
      {{~#unless isMobile~}}
      {{~#if AddNewTab  ~}}
      	<div class="add-new-tab-bg pi pi-plus" tabindex="0" data-click=[["addToRepeatSource",[":event",["{{dataSource}}","{{repeatSource}}"],"INSERTLAST","","","{{pageListPropertyClass}}","","true"]]]  data-keydown=[["addToRepeatSource",[":event",["{{dataSource}}","{{repeatSource}}"],"INSERTLAST","","","{{pageListPropertyClass}}","","true"],"enter"]]></div>
        {{~/if~}}
        <div class="tab-arrow right-arrow pi pi-caret-right"></div>
        {{~/unless~}}
        <div bsimplelayout="true" data-click='[["runScript",["LayoutGroupModule.showActiveTabListMenu(event)"]]]' class="layout-group-tablist-menu" data-menu-config='{"usingPage":"{{pyMenuConfigUsingPage}}","datasource":"","isNavNLDeferLoaded":"false","isNavTypeCustom":"false","className":"","menuAlign":"right","format":"menu-format-standard","loadBehavior":"ondisplay","ellipsisAfter":"999","useNewMenu":"true","navPageName":"","ContextPage":"","isMobile":"{{isMobile}}"}'>
            {{!--menubar launchflow scripts--}}
            <a href="#" onclick="pd(event);" tabindex="-1" data-focusable="false" class="pi pi-caret-solid-down layout-group-tablist-menu-nav"></a>
            {{!--pzPega_control_menu_scripts--}}
        </div>
    </div>
    {{~#unless isMobile~}}
      <div class="tab-indicator"><div class="current-selected-tab-indicator"></div></div>
    {{~/unless~}}
   {{~/unless~}}{{!-- tab overflow end --}}<div class='layout-group-nav' tabindex='0' aria-haspopup='true' role='menuitem' aria-expanded='false'>
     <{{layoutGroupItemsHeadingLevel}} class="layout-group-nav-title"><i class="icon icon-openclose"></i>
        {{~{selectedHeaderMarkup}~}}
    </{{layoutGroupItemsHeadingLevel}}></div>{{!-- layout-group-nav --}}{{!-- DL Template Call --}}{{~> pzLGCellTemplate~}}
    {{~#if isDirectChildLayoutGroup~}} </div> {{~/if~}}

        {{~#unless isMobile~}}
        	{{~#if AddNewTab ~}}{{~#if isStretchTabsEnabled ~}}<div class="stretch-tabs-add">{{~/if~}}
            <div class="add-new-tab add-new-tab-bg pi pi-plus" tabindex="0" data-click=[["addToRepeatSource",[":event",["{{dataSource}}","{{repeatSource}}"],"INSERTLAST","","","{{pageListPropertyClass}}","","true"]]]  data-keydown=[["addToRepeatSource",[":event",["{{dataSource}}","{{repeatSource}}"],"INSERTLAST","","","{{pageListPropertyClass}}","","true"],"enter"]]  ></div>{{~#if isStretchTabsEnabled ~}}</div>{{~/if~}}
            {{~/if~}}
        {{~/unless~}}
    
    <input type="hidden" name="EXPANDED{{LGRepeatId}}" value="
    {{~#ifCond LGType '!=' "accordion" ~}}   
        {{~#ifCond indexActiveLayout '==' "" ~}}
            {{lgExpandedGrpIdHidden}}
        {{~else~}}
            {{indexActiveLayout}}
        {{~/ifCond~}}             
    {{~else~}}
        {{~#ifCond commaSeparateList '!=' "" ~}}
            {{commaSeparateList}}
        {{~else~}}
            {{lgExpandedGrpIdHidden}}
        {{~/ifCond~}}
    {{~/ifCond~}}
    "><input type="hidden" name="LGType{{LGTabGrpId}}" value="">{{~#if repeatSize}}<input type="hidden" name="LGType{{LGTabGrpId}}RepeatSize" value="{{repeatSize}}">{{~/if~}}</div>

pzpega_ui_LGTemplate
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pzpega_ui_LGTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "data-addnewtab=\"true\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "aria-label=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabel") || (depth0 != null ? lookupProperty(depth0,"ariaLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabel","hash":{},"data":data,"loc":{"start":{"line":1,"column":167},"end":{"line":1,"column":180}}}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-lg-repeatSource=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"originalDataSource") || (depth0 != null ? lookupProperty(depth0,"originalDataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"originalDataSource","hash":{},"data":data,"loc":{"start":{"line":1,"column":272},"end":{"line":1,"column":294}}}) : helper)))
    + "\" data-methodname=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyMethodName") || (depth0 != null ? lookupProperty(depth0,"pyMethodName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyMethodName","hash":{},"data":data,"loc":{"start":{"line":1,"column":313},"end":{"line":1,"column":329}}}) : helper)))
    + "\" data-refresh=\"true\"";
},"7":function(container,depth0,helpers,partials,data) {
    return " role=\"tablist\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMobile") : depth0),{"name":"unless","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":476},"end":{"line":1,"column":519}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "tab-overflow";
},"12":function(container,depth0,helpers,partials,data) {
    return "\"><div class=\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " style=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInlineStyle") || (depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInlineStyle","hash":{},"data":data,"loc":{"start":{"line":6,"column":33},"end":{"line":6,"column":50}}}) : helper)))
    + "\" ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-lg-options="
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"lgOptKeys") || (depth0 != null ? lookupProperty(depth0,"lgOptKeys") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lgOptKeys","hash":{},"data":data,"loc":{"start":{"line":7,"column":36},"end":{"line":7,"column":51}}}) : helper))) != null ? stack1 : "")
    + " ";
},"18":function(container,depth0,helpers,partials,data) {
    return " data-Semantic-tab = \"true\" ";
},"20":function(container,depth0,helpers,partials,data) {
    return " data-header-scrollable = \"true\" ";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMobile") : depth0),{"name":"unless","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":2},"end":{"line":10,"column":16}}})) != null ? stack1 : "")
    + "<div class=\"right-tab-nav-controls\">"
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMobile") : depth0),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":6},"end":{"line":17,"column":21}}})) != null ? stack1 : "")
    + "<div bsimplelayout=\"true\" data-click='[[\"runScript\",[\"LayoutGroupModule.showActiveTabListMenu(event)\"]]]' class=\"layout-group-tablist-menu\" data-menu-config='{\"usingPage\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyMenuConfigUsingPage") || (depth0 != null ? lookupProperty(depth0,"pyMenuConfigUsingPage") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyMenuConfigUsingPage","hash":{},"data":data,"loc":{"start":{"line":18,"column":180},"end":{"line":18,"column":205}}}) : helper)))
    + "\",\"datasource\":\"\",\"isNavNLDeferLoaded\":\"false\",\"isNavTypeCustom\":\"false\",\"className\":\"\",\"menuAlign\":\"right\",\"format\":\"menu-format-standard\",\"loadBehavior\":\"ondisplay\",\"ellipsisAfter\":\"999\",\"useNewMenu\":\"true\",\"navPageName\":\"\",\"ContextPage\":\"\",\"isMobile\":\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"isMobile") || (depth0 != null ? lookupProperty(depth0,"isMobile") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"isMobile","hash":{},"data":data,"loc":{"start":{"line":18,"column":460},"end":{"line":18,"column":472}}}) : helper)))
    + "\"}'>\n            <a href=\"#\" onclick=\"pd(event);\" tabindex=\"-1\" data-focusable=\"false\" class=\"pi pi-caret-solid-down layout-group-tablist-menu-nav\"></a>\n        </div>\n    </div>"
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMobile") : depth0),{"name":"unless","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":4},"end":{"line":26,"column":17}}})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    return "<div class=\"tab-arrow left-tab-nav-controls left-arrow pi pi-caret-left\" style=\"\"></div>";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"AddNewTab") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":6},"end":{"line":15,"column":17}}})) != null ? stack1 : "")
    + "<div class=\"tab-arrow right-arrow pi pi-caret-right\"></div>";
},"26":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"add-new-tab-bg pi pi-plus\" tabindex=\"0\" data-click=[[\"addToRepeatSource\",[\":event\",[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataSource") || (depth0 != null ? lookupProperty(depth0,"dataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataSource","hash":{},"data":data,"loc":{"start":{"line":14,"column":104},"end":{"line":14,"column":118}}}) : helper)))
    + "\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatSource") || (depth0 != null ? lookupProperty(depth0,"repeatSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatSource","hash":{},"data":data,"loc":{"start":{"line":14,"column":121},"end":{"line":14,"column":137}}}) : helper)))
    + "\"],\"INSERTLAST\",\"\",\"\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pageListPropertyClass") || (depth0 != null ? lookupProperty(depth0,"pageListPropertyClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageListPropertyClass","hash":{},"data":data,"loc":{"start":{"line":14,"column":160},"end":{"line":14,"column":185}}}) : helper)))
    + "\",\"\",\"true\"]]]  data-keydown=[[\"addToRepeatSource\",[\":event\",[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataSource") || (depth0 != null ? lookupProperty(depth0,"dataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataSource","hash":{},"data":data,"loc":{"start":{"line":14,"column":248},"end":{"line":14,"column":262}}}) : helper)))
    + "\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatSource") || (depth0 != null ? lookupProperty(depth0,"repeatSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatSource","hash":{},"data":data,"loc":{"start":{"line":14,"column":265},"end":{"line":14,"column":281}}}) : helper)))
    + "\"],\"INSERTLAST\",\"\",\"\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pageListPropertyClass") || (depth0 != null ? lookupProperty(depth0,"pageListPropertyClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageListPropertyClass","hash":{},"data":data,"loc":{"start":{"line":14,"column":304},"end":{"line":14,"column":329}}}) : helper)))
    + "\",\"\",\"true\"],\"enter\"]]></div>";
},"28":function(container,depth0,helpers,partials,data) {
    return "<div class=\"tab-indicator\"><div class=\"current-selected-tab-indicator\"></div></div>";
},"30":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"AddNewTab") : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":9},"end":{"line":36,"column":21}}})) != null ? stack1 : "");
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isStretchTabsEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":29},"end":{"line":34,"column":99}}})) != null ? stack1 : "")
    + "<div class=\"add-new-tab add-new-tab-bg pi pi-plus\" tabindex=\"0\" data-click=[[\"addToRepeatSource\",[\":event\",[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataSource") || (depth0 != null ? lookupProperty(depth0,"dataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataSource","hash":{},"data":data,"loc":{"start":{"line":35,"column":121},"end":{"line":35,"column":135}}}) : helper)))
    + "\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatSource") || (depth0 != null ? lookupProperty(depth0,"repeatSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatSource","hash":{},"data":data,"loc":{"start":{"line":35,"column":138},"end":{"line":35,"column":154}}}) : helper)))
    + "\"],\"INSERTLAST\",\"\",\"\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pageListPropertyClass") || (depth0 != null ? lookupProperty(depth0,"pageListPropertyClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageListPropertyClass","hash":{},"data":data,"loc":{"start":{"line":35,"column":177},"end":{"line":35,"column":202}}}) : helper)))
    + "\",\"\",\"true\"]]]  data-keydown=[[\"addToRepeatSource\",[\":event\",[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataSource") || (depth0 != null ? lookupProperty(depth0,"dataSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataSource","hash":{},"data":data,"loc":{"start":{"line":35,"column":265},"end":{"line":35,"column":279}}}) : helper)))
    + "\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatSource") || (depth0 != null ? lookupProperty(depth0,"repeatSource") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatSource","hash":{},"data":data,"loc":{"start":{"line":35,"column":282},"end":{"line":35,"column":298}}}) : helper)))
    + "\"],\"INSERTLAST\",\"\",\"\",\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pageListPropertyClass") || (depth0 != null ? lookupProperty(depth0,"pageListPropertyClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageListPropertyClass","hash":{},"data":data,"loc":{"start":{"line":35,"column":321},"end":{"line":35,"column":346}}}) : helper)))
    + "\",\"\",\"true\"],\"enter\"]]  ></div>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isStretchTabsEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":377},"end":{"line":35,"column":423}}})) != null ? stack1 : "");
},"34":function(container,depth0,helpers,partials,data) {
    return "<div class=\"stretch-tabs-add\">";
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"indexActiveLayout") : depth0),"==","",{"name":"ifCond","hash":{},"fn":container.program(37, data, 0),"inverse":container.program(39, data, 0),"data":data,"loc":{"start":{"line":41,"column":8},"end":{"line":45,"column":21}}})) != null ? stack1 : "");
},"37":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"lgExpandedGrpIdHidden") || (depth0 != null ? lookupProperty(depth0,"lgExpandedGrpIdHidden") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lgExpandedGrpIdHidden","hash":{},"data":data,"loc":{"start":{"line":42,"column":12},"end":{"line":42,"column":37}}}) : helper)));
},"39":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"indexActiveLayout") || (depth0 != null ? lookupProperty(depth0,"indexActiveLayout") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"indexActiveLayout","hash":{},"data":data,"loc":{"start":{"line":44,"column":12},"end":{"line":44,"column":33}}}) : helper)));
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"commaSeparateList") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(42, data, 0),"inverse":container.program(37, data, 0),"data":data,"loc":{"start":{"line":47,"column":8},"end":{"line":51,"column":21}}})) != null ? stack1 : "");
},"42":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"commaSeparateList") || (depth0 != null ? lookupProperty(depth0,"commaSeparateList") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"commaSeparateList","hash":{},"data":data,"loc":{"start":{"line":48,"column":12},"end":{"line":48,"column":33}}}) : helper)));
},"44":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input type=\"hidden\" name=\"LGType"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"LGTabGrpId") || (depth0 != null ? lookupProperty(depth0,"LGTabGrpId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"LGTabGrpId","hash":{},"data":data,"loc":{"start":{"line":53,"column":116},"end":{"line":53,"column":130}}}) : helper)))
    + "RepeatSize\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatSize") || (depth0 != null ? lookupProperty(depth0,"repeatSize") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatSize","hash":{},"data":data,"loc":{"start":{"line":53,"column":149},"end":{"line":53,"column":163}}}) : helper)))
    + "\">";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"sInspectorLayoutData") || (depth0 != null ? lookupProperty(depth0,"sInspectorLayoutData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sInspectorLayoutData","hash":{},"data":data,"loc":{"start":{"line":1,"column":5},"end":{"line":1,"column":31}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"noGestures") || (depth0 != null ? lookupProperty(depth0,"noGestures") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noGestures","hash":{},"data":data,"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":46}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tourID") || (depth0 != null ? lookupProperty(depth0,"tourID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tourID","hash":{},"data":data,"loc":{"start":{"line":1,"column":47},"end":{"line":1,"column":57}}}) : helper)))
    + " data-lg-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"LGTabGrpId") || (depth0 != null ? lookupProperty(depth0,"LGTabGrpId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"LGTabGrpId","hash":{},"data":data,"loc":{"start":{"line":1,"column":70},"end":{"line":1,"column":84}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"AddNewTab") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":86},"end":{"line":1,"column":137}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"ariaLabel") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":138},"end":{"line":1,"column":188}}})) != null ? stack1 : "")
    + " data-repeat-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"LGRepeatId") || (depth0 != null ? lookupProperty(depth0,"LGRepeatId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"LGRepeatId","hash":{},"data":data,"loc":{"start":{"line":1,"column":205},"end":{"line":1,"column":219}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRepeatLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":221},"end":{"line":1,"column":360}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isSemanticTabLayout") : depth0),"true",{"name":"if_not_eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":362},"end":{"line":1,"column":433}}})) != null ? stack1 : "")
    + " class=\""
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isStretchTabsEnabled") : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":441},"end":{"line":1,"column":530}}})) != null ? stack1 : "")
    + " content"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":63}}})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLgClass") || (depth0 != null ? lookupProperty(depth0,"pyLgClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLgClass","hash":{},"data":data,"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":17}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomCSS") || (depth0 != null ? lookupProperty(depth0,"pyCustomCSS") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomCSS","hash":{},"data":data,"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":33}}}) : helper)))
    + "\"\n    "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":59}}})) != null ? stack1 : "")
    + "\n  "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgOptKeys") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":59}}})) != null ? stack1 : "")
    + " data-template "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isSemanticTabLayout") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":74},"end":{"line":7,"column":149}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"allowScrollForTabHeaders") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":150},"end":{"line":7,"column":235}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":7,"column":236},"end":{"line":7,"column":258}}}) : helper)))
    + ">"
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isStretchTabsEnabled") : depth0),{"name":"unless","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":282},"end":{"line":27,"column":16}}})) != null ? stack1 : "")
    + "<div class='layout-group-nav' tabindex='0' aria-haspopup='true' role='menuitem' aria-expanded='false'>\n     <"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"layoutGroupItemsHeadingLevel") || (depth0 != null ? lookupProperty(depth0,"layoutGroupItemsHeadingLevel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"layoutGroupItemsHeadingLevel","hash":{},"data":data,"loc":{"start":{"line":28,"column":6},"end":{"line":28,"column":38}}}) : helper)))
    + " class=\"layout-group-nav-title\"><i class=\"icon icon-openclose\"></i>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"selectedHeaderMarkup") || (depth0 != null ? lookupProperty(depth0,"selectedHeaderMarkup") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"selectedHeaderMarkup","hash":{},"data":data,"loc":{"start":{"line":29,"column":8},"end":{"line":29,"column":36}}}) : helper))) != null ? stack1 : "")
    + "</"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"layoutGroupItemsHeadingLevel") || (depth0 != null ? lookupProperty(depth0,"layoutGroupItemsHeadingLevel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"layoutGroupItemsHeadingLevel","hash":{},"data":data,"loc":{"start":{"line":30,"column":6},"end":{"line":30,"column":38}}}) : helper)))
    + "></div>"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pzLGCellTemplate"),depth0,{"name":"pzLGCellTemplate","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":4},"end":{"line":31,"column":55}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMobile") : depth0),{"name":"unless","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":33,"column":8},"end":{"line":37,"column":21}}})) != null ? stack1 : "")
    + "<input type=\"hidden\" name=\"EXPANDED"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"LGRepeatId") || (depth0 != null ? lookupProperty(depth0,"LGRepeatId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"LGRepeatId","hash":{},"data":data,"loc":{"start":{"line":39,"column":39},"end":{"line":39,"column":53}}}) : helper)))
    + "\" value=\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"LGType") : depth0),"!=","accordion",{"name":"ifCond","hash":{},"fn":container.program(36, data, 0),"inverse":container.program(41, data, 0),"data":data,"loc":{"start":{"line":40,"column":4},"end":{"line":52,"column":17}}})) != null ? stack1 : "")
    + "\"><input type=\"hidden\" name=\"LGType"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"LGTabGrpId") || (depth0 != null ? lookupProperty(depth0,"LGTabGrpId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"LGTabGrpId","hash":{},"data":data,"loc":{"start":{"line":53,"column":39},"end":{"line":53,"column":53}}}) : helper)))
    + "\" value=\"\">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"repeatSize") : depth0),{"name":"if","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":64},"end":{"line":53,"column":174}}})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});
})();

  /* Dont move this variables inside */
  var addedClassForActiveTab = true;
  pega.ui.template.RenderingEngine.register("LayoutGroup", function(treeNode) {
      var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
      var lgComponentInfo = treeNode;
      var lgCellsTemplatePage = pega.ui.TemplateEngine.getTemplates(lgComponentInfo);
      var uniqueId = lgComponentInfo[TEMPLATE_CONSTANTS["PYUNIQUEID"]] || "";
      var lgNavTitle = lgComponentInfo[TEMPLATE_CONSTANTS["PYTITLE"]] || "";
      var isDirectChildLayoutGroup = lgComponentInfo[TEMPLATE_CONSTANTS["PYISPARENTLG"]] || "";
      isDirectChildLayoutGroup = isDirectChildLayoutGroup == "false" ? false : !!isDirectChildLayoutGroup;
      var isStretchTabsEnabled = lgComponentInfo[TEMPLATE_CONSTANTS["PYISSTRETCHENABLED"]] || "";
      var isNumberedAccordion = lgComponentInfo[TEMPLATE_CONSTANTS["PYNUMBEREDACCORDION"]] || "";
      var isSemanticTabLayout = lgComponentInfo["pySemanticTabLayout"] || "";
      var allowScrollForTabHeaders = lgComponentInfo["pyAllowScrollForTabHeaders"] || "";     
      var ariaLabel = lgComponentInfo[TEMPLATE_CONSTANTS["PYARIALABEL"]] || "";
      isStretchTabsEnabled = isStretchTabsEnabled == "false" ? false : !!isStretchTabsEnabled;
      var expressionIdMeta = lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]? pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]) : null;
      /* SE-38151 : in case of jsp nav-title in case of menu was not working */
      var pyIsLabelJSP = JSON.parse(lgComponentInfo[TEMPLATE_CONSTANTS["PYISLABELJSP"]] ? lgComponentInfo[TEMPLATE_CONSTANTS["PYISLABELJSP"]] : "false");
      if (pyIsLabelJSP && lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] == "menu" && treeNode.pyTemplates[0] && treeNode.pyTemplates[0].pyName == "pxNonTemplate") {
        lgNavTitle = pega.ui.template.RenderingEngine.getRenderer("pxNonTemplate").call(null, treeNode.pyTemplates[0]);
      }
      var activeLayoutIndex = lgComponentInfo[TEMPLATE_CONSTANTS["PYINDEXACTIVELAYOUT"]];
      var LGId = "LGLayoutGroup"+lgComponentInfo[TEMPLATE_CONSTANTS["PYLGTABGRPID"]];
      var LGRepeatId = LGId;
      var repeatSize = false, activeForIteration = false;
      var entryHandle = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
      var configObj = {};
      var isParentRDL = JSON.stringify(pega.ui.template.DataBinder.repeatingIndex) != JSON.stringify({});
      /* if(pega.ui.TemplateEngine && pega.ui.TemplateEngine.peekRepeatingDepth() && entryHandle && entryHandle.indexOf("(") != -1 &&  entryHandle.indexOf(")") != -1){ */
      if(pega.ui.TemplateEngine && isParentRDL && entryHandle && entryHandle.lastIndexOf("(") != -1 &&  entryHandle.lastIndexOf(")") != -1){        
        repeatSize = entryHandle.substring(entryHandle.lastIndexOf("(")+1,entryHandle.lastIndexOf(")"));
        LGRepeatId += repeatSize;	
        activeForIteration = lgComponentInfo[TEMPLATE_CONSTANTS["PYLGACTIVEINREPEATMAP"]];
        if(activeForIteration){
          activeForIteration = JSON.parse(activeForIteration);
          activeForIteration = activeForIteration[repeatSize];
        }
        configObj.isParentRepeating = isParentRDL;
      }
      var headerMetaNode = '';
      var childTemplateName = '';
      var selectedHeaderMarkup = lgNavTitle;
      var isMarkupCreated = false;
      var expressionId = lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]] : null;
      var multiAccodionList = lgComponentInfo[TEMPLATE_CONSTANTS["PYCOMMASEPARATELIST"]] || "";
        
      var expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionId);
      configObj.expResults = expResults;
      var tempActiveIndex = activeLayoutIndex;
      if(expResults && !$.isEmptyObject(expResults)){  	
        for (var key in expResults) {
          if(expResults[key]){
            activeLayoutIndex = key;
            break;
          }
        }      	      	
        if(typeof activeLayoutIndex == 'undefined' || activeLayoutIndex < 0){
          activeLayoutIndex = tempActiveIndex;
        }
      } else if(activeForIteration && typeof activeForIteration === 'string'){
        activeLayoutIndex = activeForIteration;
        tempActiveIndex = activeLayoutIndex;
      }
    
      for (var key in lgCellsTemplatePage) {
        var tempNode = lgCellsTemplatePage[key];
        /* Client + server expression for disable when */
        var disableExpressionId = tempNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYDISABLEWHENID"]] || "";
        var isClientDisableWhen = tempNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYISCLIENTDISABLEWHEN"]] || "";
        var evalResult,disExpressionIdMeta;
        tempNode.pyTemplates[0].ariaLabelledby = "headerlabel" + Math.floor((Math.random() * 10000) + 1);
        tempNode.pyTemplates[0].ariaControl = "section" + Math.floor((Math.random() * 10000) + 1);
        if(disableExpressionId){
          if(isClientDisableWhen){
            /* client side */
            if (disableExpressionId && disableExpressionId.length > 0) {
              disExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(disableExpressionId);
              tempNode[TEMPLATE_CONSTANTS["PYCELL"]].disExpressionIdMeta = disExpressionIdMeta;
              evalResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(disableExpressionId);
            }
          } else{
            /* server side */
            evalResult = pega.ui.TemplateEngine.getCurrentContext().getWhenResult(disableExpressionId);
          }
        }
        /* disable when */
    
        /* disable when */
        if(disableExpressionId){
          if((typeof evalResult == "object" && evalResult[pega.ui.ExpressionEvaluator.DISABLE_WHEN]) || (typeof evalResult == "boolean" && evalResult)){
            /* client side*/
            tempNode.isLGDisabled = true;
            configObj.expResults[parseInt(key)+1] = false;  
            if(parseInt(tempActiveIndex)-1 == parseInt(key))
              tempActiveIndex = 1;            
          }
        }
        /* disable when */
      }
    
      configObj.indexActiveLayout = activeLayoutIndex;
      configObj.hiddenFieldActiveIndex = tempActiveIndex;
      configObj.LGType = lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] || "";
      configObj.LGTabGrpId = LGId;
      configObj.LGRepeatId = LGRepeatId;
      configObj.totalItems = lgCellsTemplatePage ? lgCellsTemplatePage.length : 0;
      configObj.multiAccodionList = multiAccodionList;
      configObj.lgCellsTemplatePage = lgCellsTemplatePage;
        
      configObj.isTypeSet = false;
      if(treeNode.lgType == 'accordion' && treeNode.expandGrpId == ''){
        configObj.isTypeSet = false;
      } else if(treeNode.lgType){
        configObj.isTypeSet = true;
      }
      if(typeof(LayoutGroupModule) != "undefined") {
        LayoutGroupModule.fallBack;
        LayoutGroupModule.setActiveValue = 0;
      }
    
      var addNewTab = lgComponentInfo[TEMPLATE_CONSTANTS["PYADDNEWTAB"]]&& lgComponentInfo[TEMPLATE_CONSTANTS["PYADDNEWTAB"]] == 'true' &&(lgComponentInfo[TEMPLATE_CONSTANTS["PYFORMAT"]]==undefined || lgComponentInfo[TEMPLATE_CONSTANTS["PYFORMAT"]]=="default"||lgComponentInfo[TEMPLATE_CONSTANTS["PYFORMAT"]]=="tab") ? true : false;
    
      var lgClass =" content-layout-group "+ ((lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] != "default") ? ("layout-group-" + lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]]):"") + lgComponentInfo[TEMPLATE_CONSTANTS["PYLGCLASS"]];
      if(addNewTab)lgClass+=" lg-add-new-tab";
      
      var lgTemplateObj = {
          metadata: lgComponentInfo ,
          lgCellsTemplatePage: lgCellsTemplatePage,
          uniqueId:uniqueId,
          sInspectorLayoutData: lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]] ? (lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]).replace(/"/g, "") : "",
          indexActiveLayout: activeLayoutIndex,
          pyExpressionIdMeta : expressionIdMeta,
          pyTitle: lgNavTitle,
          pyLgClass: lgClass,
          pyCustomCSS: lgComponentInfo[TEMPLATE_CONSTANTS["PYCUSTOMCSS"]] || "",
          pyInlineStyle: lgComponentInfo[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] ||"",
          isDirectChildLayoutGroup: isDirectChildLayoutGroup,
          isStretchTabsEnabled: isStretchTabsEnabled,
          LGTabGrpId: LGId,
          LGRepeatId:LGRepeatId,
          repeatSize:repeatSize,
          layoutGroupItemsHeadingLevel: lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPITEMSHEADINGLEVEL"]] || "h2",
          selectedHeaderMarkup:selectedHeaderMarkup,
          lgOptKeys: lgComponentInfo[TEMPLATE_CONSTANTS["PYLGOPTKEYS"]] || "",
          commaSeparateList: multiAccodionList,
          lgExpandedGrpIdHidden: lgComponentInfo[TEMPLATE_CONSTANTS["PYLGEXPANDEDGRPIDHIDDEN"]] || "",
          pyMenuConfigUsingPage:  lgComponentInfo[TEMPLATE_CONSTANTS["PYMENUCONFIGUSINGPAGE"]] || "",
          isMobile:lgComponentInfo[TEMPLATE_CONSTANTS["ISMOBILE"]] || "",
          isRepeatLayoutGroup:false,
          LGType: lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] || "",
          configObj: configObj,
          ariaLabel: ariaLabel
      };
      lgTemplateObj.pyCustomCSS = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(lgTemplateObj.pyCustomCSS);
      if(isNumberedAccordion == "true"){
        lgTemplateObj.isNumberedAccordion = isNumberedAccordion;
        configObj.isNumberedAccordion = isNumberedAccordion;
        lgTemplateObj.pyLgClass += " lg-accordion-numbered";
      }
      if(isSemanticTabLayout === "true"){
        lgTemplateObj.isSemanticTabLayout = isSemanticTabLayout;
        configObj.isSemanticTabLayout = isSemanticTabLayout;
      } 
      if(allowScrollForTabHeaders === "true"){
        lgTemplateObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
        configObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
      }                                                                          
      /*BUG-333809 */
      if(lgTemplateObj["sInspectorLayoutData"]){
        var hexaSpace="&#032;";
        lgTemplateObj["sInspectorLayoutData"]=lgTemplateObj["sInspectorLayoutData"].replace(/ /g,hexaSpace);
      }
      /*BUG-333809 */ 
      return pega.ui.TemplateEngine.execute('pzpega_ui_LGTemplate', lgTemplateObj);             
  });

  if (pega.ui.gStackOrder == undefined || typeof(pega.ui.gStackOrder) == "undefined"){ pega.ui.gStackOrder = [];}
  if (pega.ui.gStackOrderForResolveIndex == undefined || typeof(pega.ui.gStackOrderForResolveIndex) == "undefined"){ pega.ui.gStackOrderForResolveIndex = [];}
  
  
  pega.ui.template.RenderingEngine.register("ContainerDynamicLayoutGroup", function(treeNode) {
      var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
      pega.ui.gStackOrder.push(0);
      pega.ui.gStackOrderForResolveIndex.push(0);
      /* Need to reset this variables */
      addedClassForActiveTab = true;
      var lgComponentInfo = treeNode;	
      var originalDataSource = "", hookToStartSection = 0, countOfSubSectionsLayout = 0;
      var lgCellsTemplatePage =  pega.ui.TemplateEngine.getTemplates(lgComponentInfo);
      var uniqueId = lgComponentInfo[TEMPLATE_CONSTANTS["PYUNIQUEID"]];
      var lgNavTitle = lgComponentInfo[TEMPLATE_CONSTANTS["PYTITLE"]];
      /*var isRepeatLayoutGroup = lgComponentInfo["pyIsRepeatLayoutGroup"];
      isRepeatLayoutGroup = isRepeatLayoutGroup == "false" ? false : !!isRepeatLayoutGroup;*/
      var isDirectChildLayoutGroup = lgComponentInfo[TEMPLATE_CONSTANTS["PYISPARENTLG"]];
      isDirectChildLayoutGroup = isDirectChildLayoutGroup == "false" ? false : !!isDirectChildLayoutGroup;
      var isStretchTabsEnabled = lgComponentInfo[TEMPLATE_CONSTANTS["PYISSTRETCHENABLED"]];
      isStretchTabsEnabled = isStretchTabsEnabled == "false" ? false : !!isStretchTabsEnabled;
      var isNumberedAccordion = lgComponentInfo[TEMPLATE_CONSTANTS["PYNUMBEREDACCORDION"]] || "";
      var isSemanticTabLayout = lgComponentInfo["pySemanticTabLayout"] || "";
      var allowScrollForTabHeaders = lgComponentInfo["pyAllowScrollForTabHeaders"] || "";
      var ariaLabel = lgComponentInfo[TEMPLATE_CONSTANTS["PYARIALABEL"]] || "";
      var expressionIdMeta = lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]? pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (lgComponentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]) : null;  
      var expressionStaticActiveWhenId = lgComponentInfo[TEMPLATE_CONSTANTS["PYSTATICDLGACTIVEWHENID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYSTATICDLGACTIVEWHENID"]] : null;
      var expStaticResults = pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionStaticActiveWhenId);
      var expDynamicResults = [];
      var expDisabledResults = [];
      var notVisibilityDynamicResults = [];
      var activeWhenOutputObj = {};
      var configObj = {};
      var activeLayoutIndex = lgComponentInfo[TEMPLATE_CONSTANTS["PYLGEXPANDEDGRPIDHIDDEN"]] || lgComponentInfo[TEMPLATE_CONSTANTS["PYINDEXACTIVELAYOUT"]];
      var LGId = lgComponentInfo[TEMPLATE_CONSTANTS["PYLGTABGRPID"]];
      var LGRepeatId = LGId;
      var repeatSize = false, activeForIteration = false;
      var bPageGroupBoundDLG = false, pageGroupBaseRef = "";
      var entryHandle = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
      if(entryHandle && entryHandle.indexOf("(") != -1 &&  entryHandle.indexOf(")") != -1){
        repeatSize = entryHandle.substring(entryHandle.indexOf("(")+1,entryHandle.indexOf(")"));
        LGRepeatId += repeatSize;	
        activeForIteration = lgComponentInfo[TEMPLATE_CONSTANTS["PYLGACTIVEINREPEATMAP"]];
        if(activeForIteration){
          activeForIteration = JSON.parse(activeForIteration);
          activeForIteration = activeForIteration[repeatSize];
        }	
      }
      var multiAccodionList = lgComponentInfo[TEMPLATE_CONSTANTS["PYCOMMASEPARATELIST"]] || "";
      var dsArr = new Array();	
      var repeatSource = lgComponentInfo[TEMPLATE_CONSTANTS["PYPAGELISTPROPERTY"]];      
      var dpName = lgComponentInfo[TEMPLATE_CONSTANTS["PYDPNAME"]];
      var sourceType = lgComponentInfo[TEMPLATE_CONSTANTS["PYSOURCETYPE"]];
      var dataSourceId = lgComponentInfo[TEMPLATE_CONSTANTS["PXDATASOURCEID"]];
      var pageListPropertyClass = lgComponentInfo[TEMPLATE_CONSTANTS["PYPAGELISTPROPERTYCLASS"]];
      var addNewTab=lgComponentInfo[TEMPLATE_CONSTANTS["PYADDNEWTAB"]]&& lgComponentInfo[TEMPLATE_CONSTANTS["PYADDNEWTAB"]] == 'true';
    
      var dataSource = sourceType && sourceType == "Property" ? repeatSource : dpName;
    
      var currentContext = pega.ui.TemplateEngine.getCurrentContext();
    
      if (dataSourceId) {
        /* BUG-439556 && BUG-302658 : Update source from context tree if PXDATASOURCEID is present in metadata */
        repeatSource = currentContext.getDataSource(dataSourceId) + ".pxResults"; //D_TestLowerDataList_pa1470071702910612pz.pxResults
      }
    
      if(currentContext.getReferencedProperty)
        repeatSource = currentContext.getReferencedProperty(repeatSource, repeatSource.startsWith('.')) || repeatSource;
  
      var datasource = pega.ui.template.DataBinder.resolveIndex(repeatSource);
      var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
      var repeatSourceSize = 0;
      if(dataSourceId) {
        dpName = pega.ui.TemplateEngine.ContextObject.getDataSource(dataSourceId);
      }
      var isLargeDP = false;
      if(dpName && dpName != "") {
        isLargeDP = pega.ui.ClientCache.isLargeDatapage(dpName);
      }
      var pyIsLabelJSP = JSON.parse(lgComponentInfo[TEMPLATE_CONSTANTS["PYISLABELJSP"]] ? lgComponentInfo[TEMPLATE_CONSTANTS["PYISLABELJSP"]] : "false");
      if(pyIsLabelJSP && lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] == "menu") {
        if(treeNode.pyTemplates[0] && treeNode.pyTemplates[0].pyName == "pxNonTemplate"){
          lgNavTitle =   pega.ui.template.RenderingEngine.getRenderer("pxNonTemplate").call(null, treeNode.pyTemplates[0]);
        }
      }
      var headerMetaNode = '';
      var selectedHeaderMarkup = lgNavTitle;
      var datapageParams = {};
      try{
          var pyDPParamsList = lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGPARAMSLIST"]];
          var isSourceParameterisedDP = false;
          if(pyDPParamsList && $.isArray(pyDPParamsList)){
            isSourceParameterisedDP = true;
            $.each(pyDPParamsList,function(index,paramItem){
              /*paramItem.pyValue will be DesignTime PropertiesPanel configuration -> the property name typed there for the parameter value*/
              /*Fix for BUG-222413 : paramItem.pyValue would no longer be a simple string. Instead, it now has the structure of {value : 'somestring', isLiteral : true/false}*/
              var currentParameterValueObject = paramItem.pyValue;

              var currentParameterValue = "";

              if(currentParameterValueObject){
                currentParameterValueObject = JSON.parse(currentParameterValueObject);

                if(/true/.test(currentParameterValueObject.isLiteral)){
                  currentParameterValue =  pega.ui.template.DataBinder.resolveIndex(currentParameterValueObject.value);
                }
                else{
                  currentParameterValue = pega.ui.ClientCache.find(pega.ui.template.DataBinder.resolveIndex(currentParameterValueObject.value));

                  if(currentParameterValue){
                    currentParameterValue = currentParameterValue.getValue();
                  } else {
                    currentParameterValue = null;/* Fix for BUG-227522 : Parameterized DP params are emptied in RDL renderer */
                    /* Earlier, this was being set to an empty string, "" . Based on the parameter values, we are setting here, CC.find(...) has started changing the original data of the hashed parameterised DP. Plus, initially, the hashed DP is now being created on the client side [with null's for DP parameters] even before RDL is invoked. And when RDL is invoked, CC.find(...) happens, which internally sees that for parameters, null has changed to "" implying that something has changed & causes the DP to be rehashed. So, now, due to this changed logic & initialisation of parameterised DP's, we have been asked to fallback to null instead of "" always. */
                  }
                }
              }
              else{
                currentParameterValue = null;/* Fix for BUG-227522 : Parameterized DP params are emptied in RDL renderer */
                /* Earlier, this was being set to an empty string, "" . Based on the parameter values, we are setting here, CC.find(...) has started changing the original data of the hashed parameterised DP. Plus, initially, the hashed DP is now being created on the client side [with null's for DP parameters] even before RDL is invoked. And when RDL is invoked, CC.find(...) happens, which internally sees that for parameters, null has changed to "" implying that something has changed & causes the DP to be rehashed. So, now, due to this changed logic & initialisation of parameterised DP's, we have been asked to fallback to null instead of "" always. */
              }

              if(pega && pega.clientTools){
                pega.clientTools.getParamPage().put(paramItem.pyName,currentParameterValue);
              }

              datapageParams[paramItem.pyName] = currentParameterValue;
            });
         }
      } catch(exception){
        if(window.console && window.console.log)
          window.console.log(" could not fetch any parameters for DLG source data page");
      }
        
      var addDeletePos;
      if(typeof LayoutGroupModule != "undefined"){
        addDeletePos = LayoutGroupModule.getLayoutActiveIndex("LGLayoutGroup"+lgComponentInfo[TEMPLATE_CONSTANTS["PYLGTABGRPID"]]);
      }
    
      var templates=TEMPLATE_CONSTANTS["PYTEMPLATES"];
      if(!isLargeDP) {
        if(repeatPath && repeatPath.startsWith('.')) {
          if(currentContext.getReference){
            datasource = currentContext.getReference();
          }
          datasource += repeatPath;
        } else {
          datasource = repeatPath;
        }
        
        datasource = currentContext.resolvePredicates(datasource);
        
        var ds = pega.ui.ClientCache.find(datasource); 
        var staticLength = 0;
        if(lgComponentInfo && lgComponentInfo[templates]){
          for(var i=0; i< (lgComponentInfo[templates]).length; i++){
            if(lgComponentInfo[templates][i] && lgComponentInfo[templates][i][TEMPLATE_CONSTANTS["PYCELL"]] && lgComponentInfo[templates][i][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYTYPE"]] == "layout"){
              var childNode = lgComponentInfo[templates][i];            
              var clonedChildNode = pega.ui.TemplateEngine.cloneMetadata(childNode);
              pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode);
              if(clonedChildNode && clonedChildNode[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy")
                notVisibilityDynamicResults.push(i+1);
              clonedChildNode = updateNodeForDisableCondition(clonedChildNode, expDisabledResults, i+1);
              dsArr.push(clonedChildNode); 
              staticLength++; 
            } else if(lgComponentInfo[templates][i] && lgComponentInfo[templates][i][templates] && lgComponentInfo[templates][i][templates][0] && lgComponentInfo[templates][i][templates][0][TEMPLATE_CONSTANTS["PYCELL"]] && lgComponentInfo.pyTemplates[i].pyTemplates[0][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYTYPE"]] == "sub_section"){
              hookToStartSection = i;
              break;
            }         	
          } 	
        } 
        
        if(currentContext.getReference)
          datasource = currentContext.getReference(); // pyWorkPage.CountriesList(1).StateList
        var originalDataSource = datasource;
  
        if(ds){
          originalDataSource = ds.getReference();
          if (ds.pxResults) {
            var childNode = lgComponentInfo[templates][hookToStartSection];
            if(childNode && childNode[templates]){
              repeatSourceSize = ds.pxResults.length;                        
              for(var i=0; i < repeatSourceSize; i++){
                var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
                if(i == 0){
                  var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
                  var repeatInfo = {
                    component: "DynamicLayoutGroup"		
                  };
                  currentContext.push(repeatPath, undefined, repeatInfo);	
                }
                currentContext.push(i);
                var expressionDynamicActiveWhenId = lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]] : null;
                var clonedChildNode2CheckVisibility = pega.ui.TemplateEngine.cloneMetadata(childNode[templates][0]);
                clonedChildNode2CheckVisibility = updateNodeForDisableCondition(clonedChildNode2CheckVisibility, expDisabledResults, hookToStartSection+i+1);
                pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode2CheckVisibility);

                if(clonedChildNode2CheckVisibility && clonedChildNode2CheckVisibility[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy"){
                  if(lgComponentInfo && (lgComponentInfo[templates]))
                    notVisibilityDynamicResults.push((lgComponentInfo[templates]).length+i+1);
                  else
                    notVisibilityDynamicResults.push(i+1);
                } else{
                  expDynamicResults.push(pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionDynamicActiveWhenId, i+1, hookToStartSection+i+1));
                }
                var clonedChildNode = clonedChildNode2CheckVisibility;
                
                currentContext.pop();
                if(i == repeatSourceSize-1){
                  currentContext.pop();
                }
                /* Clone metadata*/

                dsArr.push(clonedChildNode);
                countOfSubSectionsLayout++;
              } 
            }
          } else if(ds.iterator){
            var iter = ds.iterator();
            while(iter.hasNext()){
              dsArr.push(iter.next());
            }
          } else if(ds.type == "page"){
            var childNode = lgComponentInfo[templates][hookToStartSection];
            if(childNode && childNode[templates]){
              bPageGroupBoundDLG = true;
              var dsJSON = ds.getJSONObject();
              repeatSourceSize = Object.keys(dsJSON).length;
              var i = 0;
              for (var key in dsJSON) {
                var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
                pageGroupBaseRef = pega.ui.ClientCache.find(ds.getReference() + "(" + key + ")").getReference();
                /* BUG-483933 Accordion toggled off is still enabled */
                /* BUG-623931 Removing unreachable code */
                i++;
                //var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
                var repeatInfo = {
                  component: "DynamicLayoutGroup"                
                };
                currentContext.push(pageGroupBaseRef, undefined, repeatInfo);         
               
                var expressionDynamicActiveWhenId = lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]] : null;
                var clonedChildNode2CheckVisibility = pega.ui.TemplateEngine.cloneMetadata(childNode[templates][0]);
                clonedChildNode2CheckVisibility = updateNodeForDisableCondition(clonedChildNode2CheckVisibility, expDisabledResults, hookToStartSection+i);
                pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode2CheckVisibility);

                if(clonedChildNode2CheckVisibility && clonedChildNode2CheckVisibility[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy"){
                  if(lgComponentInfo && (lgComponentInfo[templates]))
                    notVisibilityDynamicResults.push((lgComponentInfo[templates]).length+i+1);
                  else
                    notVisibilityDynamicResults.push(i+1);
                } else{
                  expDynamicResults.push(pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionDynamicActiveWhenId, i, hookToStartSection+i, pageGroupBaseRef));
                }
                var clonedChildNode = clonedChildNode2CheckVisibility;
                currentContext.pop();
               
                
                // BUG-623931 - Commenting code as extra pop call causing issues in rendering         
                /*
                  if(i == repeatSourceSize-1){
                    currentContext.pop();
                  }
                */
                clonedChildNode.pageGroupBaseRef = pageGroupBaseRef;
                dsArr.push(clonedChildNode);
                countOfSubSectionsLayout++;
              }
            }
          } else{
            dsArr.push(ds);
          }
          hookToStartSection++;
        }	
            
        if(lgComponentInfo && lgComponentInfo[templates]){
          for(var i=hookToStartSection; i < ((lgComponentInfo[templates]).length+countOfSubSectionsLayout); i++){
            if(lgComponentInfo[templates][i] && lgComponentInfo[templates][i][TEMPLATE_CONSTANTS["PYCELL"]] && lgComponentInfo[templates][i][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYTYPE"]] =="layout"){					
              var childNode = lgComponentInfo[templates][i];
              var clonedChildNode = pega.ui.TemplateEngine.cloneMetadata(childNode);
              pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode);
              if(clonedChildNode && clonedChildNode[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy")
                notVisibilityDynamicResults.push(hookToStartSection+1);
              clonedChildNode = updateNodeForDisableCondition(clonedChildNode, expDisabledResults, i);
              dsArr.push(clonedChildNode);
            }         	
          } 	
        }		
        
        var index=0;
        if(addDeletePos&& addDeletePos!=""){
          if(addDeletePos.indexOf("ADD")==0){
            var pos =  addDeletePos.substring(3);
            if(pos=="INSERTFIRST"){
              index=0;
            }else{
              index=repeatSourceSize-1;
            }
            index +=staticLength;
          } else if(addDeletePos.indexOf("DEL")==0){
            var index =  addDeletePos.substring(3);
            index = index-1;
            if(index == repeatSourceSize){
              index= index-1;
            }
            index +=staticLength;
          }
        }

        for(var key in expStaticResults){
          if(key < hookToStartSection){
            if(expDisabledResults[key] === false){
              activeWhenOutputObj[key] = false;  
            } else{
              activeWhenOutputObj[key] = expStaticResults[key];
            }
          }
        }
        for(var j=0; j<expDynamicResults.length; j++){
          for(var key in expDynamicResults[j]){
            if(expDisabledResults[key] === false){
              activeWhenOutputObj[key] = false;  
            } else{
              activeWhenOutputObj[key] = expDynamicResults[j][key];
            }
          }              	
        }
        for(var key in expStaticResults){
          if(key > hookToStartSection){
            if(expDisabledResults[key] === false){
              activeWhenOutputObj[key] = false;  
            } else{ 
              activeWhenOutputObj[parseInt(key)+expDynamicResults.length-1] = expStaticResults[key];
            }
          }
        }
              
        var tempActiveIndex = activeLayoutIndex;
        if(activeWhenOutputObj && !$.isEmptyObject(activeWhenOutputObj)){  	
          for (var key in activeWhenOutputObj) {
            if(activeWhenOutputObj[key]){
              activeLayoutIndex = key;
              break;
            }
          }      	      	
          if(typeof activeLayoutIndex == 'undefined' || activeLayoutIndex < 0){
            activeLayoutIndex = tempActiveIndex;
          }
        } else if(activeForIteration && typeof activeForIteration === 'string'){
          activeLayoutIndex = activeForIteration;
          tempActiveIndex = activeLayoutIndex;
        }
        if(expDisabledResults[tempActiveIndex] === false){
          tempActiveIndex = 1;   
        }
        configObj.expResults = activeWhenOutputObj;
        configObj.indexActiveLayout = activeLayoutIndex;
        configObj.hiddenFieldActiveIndex = tempActiveIndex;
        configObj.LGType = lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] || "";
        configObj.LGTabGrpId = LGId;
        configObj.LGRepeatId = LGRepeatId;
        if(lgCellsTemplatePage){
          configObj.totalItems = countOfSubSectionsLayout+lgCellsTemplatePage.length-1;
        } else{
          configObj.totalItems = 0;
        }
        configObj.multiAccodionList = multiAccodionList;
        configObj.lgCellsTemplatePage = lgCellsTemplatePage;
        configObj.notVisibilityDynamicResults = notVisibilityDynamicResults;

        configObj.isTypeSet = false;
        if(treeNode.lgType == 'accordion' && treeNode.expandGrpId == ''){
          configObj.isTypeSet = false;
        } else if(treeNode.lgType){
          configObj.isTypeSet = true;
        }
        if(typeof(LayoutGroupModule) != "undefined") {
          LayoutGroupModule.fallBack;
          LayoutGroupModule.setActiveValue = 0;
        }
        for (var i = 0; i< dsArr.length ; i++){
          if(dsArr[i].pyTemplates && dsArr[i].pyTemplates[0]){
            dsArr[i].pyTemplates[0].ariaLabelledby = "headerlabel" + Math.floor((Math.random() * 10000) + 1);
            dsArr[i].pyTemplates[0].ariaControl = "section" + Math.floor((Math.random() * 10000) + 1);
          }
        }
        var lgTemplateObj = {
          metadata: lgComponentInfo ,
          lgCellsTemplatePage: lgCellsTemplatePage,
          originalDataSource: originalDataSource,
          repeatSource: repeatSource,
          rows: dsArr,              	
          repeatSourceSize: repeatSourceSize,
          uniqueId: uniqueId,
          isSourceParameterisedDP: isSourceParameterisedDP,
          sInspectorLayoutData: lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]] ? (lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]).replace(/"/g, "") : "",
          indexActiveLayout:activeLayoutIndex ,
          pyExpressionIdMeta : expressionIdMeta,
          pyTitle: lgNavTitle,
          pyLgClass:  " content-layout-group "+ ((lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] != "default") ? ("layout-group-" + lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]]):"") + lgComponentInfo[TEMPLATE_CONSTANTS["PYLGCLASS"]],
          pyCustomCSS: lgComponentInfo[TEMPLATE_CONSTANTS["PYCUSTOMCSS"]],
          pyInlineStyle: lgComponentInfo[TEMPLATE_CONSTANTS["PYINLINESTYLE"]],
          isDirectChildLayoutGroup: isDirectChildLayoutGroup,
          isStretchTabsEnabled: isStretchTabsEnabled,
          LGTabGrpId: LGId,
          LGRepeatId:LGRepeatId,
          repeatSize:repeatSize,
          layoutGroupItemsHeadingLevel: lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPITEMSHEADINGLEVEL"]] || "h2",
          selectedHeaderMarkup:selectedHeaderMarkup,
          lgOptKeys: lgComponentInfo[TEMPLATE_CONSTANTS["PYLGOPTKEYS"]],
          commaSeparateList: multiAccodionList,
          lgExpandedGrpIdHidden: lgComponentInfo[TEMPLATE_CONSTANTS["PYLGEXPANDEDGRPIDHIDDEN"]],
          pyMenuConfigUsingPage:  lgComponentInfo[TEMPLATE_CONSTANTS["PYMENUCONFIGUSINGPAGE"]],
          isMobile:lgComponentInfo[TEMPLATE_CONSTANTS["ISMOBILE"]],
          isRepeatLayoutGroup:true,
          LGType:lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]],
          pyMethodName:lgComponentInfo[TEMPLATE_CONSTANTS["PYMETHODNAME"]],
          activeIndex:index,
          AddNewTab:addNewTab,
          pageListPropertyClass: pageListPropertyClass,
          dataSource: dataSource,
          configObj: configObj,
          noGestures:lgComponentInfo[TEMPLATE_CONSTANTS["PYNOGESTURES"]],
          bPageGroupBoundDLG : bPageGroupBoundDLG,
          ariaLabel: ariaLabel
        };
        lgTemplateObj.pyCustomCSS=pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(lgTemplateObj.pyCustomCSS);
        if(isNumberedAccordion == "true"){
          lgTemplateObj.isNumberedAccordion = isNumberedAccordion;
          configObj.isNumberedAccordion = isNumberedAccordion;
          lgTemplateObj.pyLgClass += " lg-accordion-numbered";
        }
        if(isSemanticTabLayout === "true"){
          lgTemplateObj.isSemanticTabLayout = isSemanticTabLayout;
          configObj.isSemanticTabLayout = isSemanticTabLayout;
        } 
        if(allowScrollForTabHeaders === "true"){
          lgTemplateObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
          configObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
        }  
        var templateData=pega.ui.TemplateEngine.execute('pzpega_ui_LGTemplate', lgTemplateObj);
        //currentContext.pop();
        pega.ui.gStackOrder.pop();
        pega.ui.gStackOrderForResolveIndex.pop();

        return templateData;
      } else{/*is a large DP */
          var asyncStreamObj = pega.ui.TemplateEngine.newAsyncStream();        
          var onSuccess = function(data) {
          var dsArr = new Array();
          var originalDataSource = datasource;
          var ds = pega.ui.ClientCache.find(datasource);
          if(ds){
            if (ds.pxResults) {
              repeatSourceSize = ds.pxResults.length;
              for(var i=0; i < repeatSourceSize; i++){
                var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
                if(i == 0){
                  var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
                  var repeatInfo = {
                    component: "DynamicLayoutGroup"		
                  };
                  currentContext.push(repeatPath, undefined, repeatInfo);	
                }
                currentContext.push(i);

                var expressionDynamicActiveWhenId = lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]] : null;
                expDynamicResults.push(pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionDynamicActiveWhenId, i+1, hookToStartSection+i+1));

                currentContext.pop();
                if(i == repeatSourceSize-1){
                  currentContext.pop();
                }
              }	
              /* Contexting */	
              var currentContext = pega.ui.TemplateEngine.getCurrentContext();
              currentContext.push(repeatPath);
              dsArr.push(ds.pxResults[i]);
              countOfSubSectionsLayout++;               
            } else if(ds.iterator){
              var iter = ds.iterator();
              while(iter.hasNext()){
                dsArr.push(iter.next());
              }
            }  else if(ds.type == "page"){
              var childNode = lgComponentInfo[templates][hookToStartSection];
              if(childNode && childNode[templates]){
                bPageGroupBoundDLG = true;
                var dsJSON = ds.getJSONObject();
                repeatSourceSize = Object.keys(dsJSON).length;
                var i = 0;
                for (var key in dsJSON) {
                  var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
                  pageGroupBaseRef = pega.ui.ClientCache.find(ds.getReference() + "(" + key + ")").getReference();
                  /* BUG-483933 Accordion toggled off is still enabled */
                  /* BUG-623931 Removing unreachable code */
                  i++;
                  //var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
                  var repeatInfo = {
                    component: "DynamicLayoutGroup"                
                  };
                  currentContext.push(pageGroupBaseRef, undefined, repeatInfo);         
                                                                       
                  var expressionDynamicActiveWhenId = lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]]? lgComponentInfo[TEMPLATE_CONSTANTS["PYDLGACTIVEWHENID"]] : null;
                  var clonedChildNode2CheckVisibility = pega.ui.TemplateEngine.cloneMetadata(childNode[templates][0]);
                  clonedChildNode2CheckVisibility = updateNodeForDisableCondition(clonedChildNode2CheckVisibility, expDisabledResults, hookToStartSection+i); 
                  pega.ui.TemplateEngine.processMetadataPerComponent(clonedChildNode2CheckVisibility);
                  if(clonedChildNode2CheckVisibility && clonedChildNode2CheckVisibility[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy"){
                    if(lgComponentInfo && (lgComponentInfo[templates]))
                      notVisibilityDynamicResults.push((lgComponentInfo[templates]).length+i+1);
                    else
                      notVisibilityDynamicResults.push(i+1);
                  } else{
                    expDynamicResults.push(pega.ui.ExpressionEvaluator.evaluateClientExpressionsLG(expressionDynamicActiveWhenId, i, hookToStartSection+i, pageGroupBaseRef));
                  }
                  
                  var clonedChildNode = clonedChildNode2CheckVisibility;
                     
                  currentContext.pop();
               
                // BUG-623931 - Commenting code as extra pop call causing issues in rendering         
                /*
                  if(i == repeatSourceSize-1){
                    currentContext.pop();
                  }
                */
                  
                  clonedChildNode.pageGroupBaseRef = pageGroupBaseRef;
                  dsArr.push(clonedChildNode);
                  countOfSubSectionsLayout++;                          
                }
              }
            } else{
              dsArr.push(ds);
            }
            originalDataSource = ds.getReference();
          }	
            /* Contexting */	
            var currentContext = pega.ui.TemplateEngine.getCurrentContext();
            currentContext.push(repeatPath);


            for(var key in expStaticResults){
              if(key < hookToStartSection){
                if(expDisabledResults[key] === false){
                  activeWhenOutputObj[key] = false;  
                } else{
                  activeWhenOutputObj[key] = expStaticResults[key];
                }
              }
            }
            for(var j=0; j<expDynamicResults.length; j++){
              for(var key in expDynamicResults[j]){
                if(expDisabledResults[key] === false){
                  activeWhenOutputObj[key] = false;  
                } else{
                  activeWhenOutputObj[key] = expDynamicResults[j][key];
                }
              }              	
            }
            for(var key in expStaticResults){
              if(key > hookToStartSection){
                if(expDisabledResults[key] === false){
                  activeWhenOutputObj[key] = false;  
                } else{
                  activeWhenOutputObj[parseInt(key)+expDynamicResults.length-1] = expStaticResults[key];
                }
              }
            }

            var tempActiveIndex = activeLayoutIndex;
            if(activeWhenOutputObj && !$.isEmptyObject(activeWhenOutputObj)){  	
              for (var key in activeWhenOutputObj) {
                if(activeWhenOutputObj[key]){
                  activeLayoutIndex = key;
                  break;
                }
              }      	      	
              if(typeof activeLayoutIndex == 'undefined' || activeLayoutIndex < 0){
                activeLayoutIndex = tempActiveIndex;
              }
            }  else if(activeForIteration && typeof activeForIteration === 'string'){
              activeLayoutIndex = activeForIteration;
              tempActiveIndex = activeLayoutIndex;
            }
            if(expDisabledResults[tempActiveIndex] === false){
              tempActiveIndex = 1;   
            }
                
            configObj.expResults = activeWhenOutputObj;
            configObj.indexActiveLayout = activeLayoutIndex;
            configObj.hiddenFieldActiveIndex = tempActiveIndex;
            configObj.LGType = lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] || "";
            configObj.LGTabGrpId = LGId;
            configObj.LGRepeatId = LGRepeatId;
            if(lgCellsTemplatePage)
              configObj.totalItems = countOfSubSectionsLayout+lgCellsTemplatePage.length-1;
            else
              configObj.totalItems = countOfSubSectionsLayout;

            configObj.multiAccodionList = multiAccodionList;
            configObj.lgCellsTemplatePage = lgCellsTemplatePage;

            configObj.isTypeSet = false;
            if(treeNode.lgType == 'accordion' && treeNode.expandGrpId == ''){
              configObj.isTypeSet = false;
            } else if(treeNode.lgType){
              configObj.isTypeSet = true;
            }
            for (var i = 0; i< dsArr.length ; i++){
              if(dsArr[i].pyTemplates && dsArr[i].pyTemplates[0]){
                dsArr[i].pyTemplates[0].ariaLabelledby = "headerlabel" + Math.floor((Math.random() * 10000) + 1);
                dsArr[i].pyTemplates[0].ariaControl = "section" + Math.floor((Math.random() * 10000) + 1);
              }
            }
            var lgTemplateObj = {
              metadata: lgComponentInfo ,
              lgCellsTemplatePage: lgCellsTemplatePage,
              originalDataSource:originalDataSource,
              rows:dsArr,
              repeatSourceSize: repeatSourceSize,
              uniqueId:uniqueId,
              sInspectorLayoutData: lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]] ? (lgComponentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]).replace(/"/g, "") : "",
              indexActiveLayout: lgComponentInfo[TEMPLATE_CONSTANTS["PYINDEXACTIVELAYOUT"]] ,
              pyExpressionIdMeta : expressionIdMeta,
              pyTitle: lgNavTitle,
              pyLgClass: " content-layout-group "+ ((lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]] != "default") ? ("layout-group-" + lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]]):"") + lgComponentInfo[TEMPLATE_CONSTANTS["PYLGCLASS"]],
              pyCustomCSS:  lgComponentInfo[TEMPLATE_CONSTANTS["PYCUSTOMCSS"]],
              pyInlineStyle: lgComponentInfo[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] ,
              isDirectChildLayoutGroup: isDirectChildLayoutGroup,
              isStretchTabsEnabled: isStretchTabsEnabled,
              LGTabGrpId: LGId,
              LGRepeatId:LGRepeatId,
              repeatSize:repeatSize,
              layoutGroupItemsHeadingLevel: lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPITEMSHEADINGLEVEL"]] || "h2",
              selectedHeaderMarkup:selectedHeaderMarkup,
              lgOptKeys:lgComponentInfo[TEMPLATE_CONSTANTS["PYLGOPTKEYS"]],
              commaSeparateList:  multiAccodionList,
              lgExpandedGrpIdHidden:  lgComponentInfo[TEMPLATE_CONSTANTS["PYLGEXPANDEDGRPIDHIDDEN"]],
              pyMenuConfigUsingPage:  lgComponentInfo[TEMPLATE_CONSTANTS["PYMENUCONFIGUSINGPAGE"]] ,
              isMobile: lgComponentInfo[TEMPLATE_CONSTANTS["ISMOBILE"]],
              isRepeatLayoutGroup:true,
              LGType:lgComponentInfo[TEMPLATE_CONSTANTS["PYLAYOUTGROUPFORMAT"]],
              AddNewTab: addNewTab,
              pageListPropertyClass: pageListPropertyClass,
              dataSource: dataSource,
              configObj: configObj,
              bPageGroupBoundDLG : bPageGroupBoundDLG,
              ariaLabel: ariaLabel
            };
            lgTemplateObj.pyCustomCSS=pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(lgTemplateObj.pyCustomCSS);
            if(isNumberedAccordion == "true"){
              lgTemplateObj.isNumberedAccordion = isNumberedAccordion;
              configObj.isNumberedAccordion = isNumberedAccordion;
              lgTemplateObj.pyLgClass += " lg-accordion-numbered";
            }
            if(isSemanticTabLayout === "true"){
              lgTemplateObj.isSemanticTabLayout = isSemanticTabLayout;
              configObj.isSemanticTabLayout = isSemanticTabLayout;
            } 
            if(allowScrollForTabHeaders === "true"){
              lgTemplateObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
              configObj.allowScrollForTabHeaders = allowScrollForTabHeaders;
            }  
            var stream = pega.ui.TemplateEngine.execute('pzpega_ui_LGTemplate', lgTemplateObj);

            /* pop this context */
            currentContext.pop();

            asyncStreamObj.setStream(stream);

            //second argument to enable async renderer to call attachOnLoad post processing in case of async rendering
            pega.ui.TemplateEngine.renderAsyncStream(asyncStreamObj, true);

          };
          
          var onFailure = function(){
            if(window.console && window.console.log)
              window.console.log("pzpega_ui_LGTemplate.js : onFailure of pega.ui.ClientCache.findPageAsync was invoked with arguments : ", arguments);
          };
          pega.ui.ClientCache.findPageAsync(dpName, datapageParams , onSuccess,onFailure);        
            /* in large-data mode, everything is asynchronous, so, return this custom message flag string to RE, which renders a temporary Loading... message till the large data is fetched & its large markup is generated on the client */ 
          return asyncStreamObj.getPlaceholderMarkup(); 
      }
  });

function updateNodeForDisableCondition(childNode, expDisabledResults, index){
  /* Client + server expression for disable when */
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  var disableExpressionId = childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYDISABLEWHENID"]] || "";
  var isClientDisableWhen = childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYISCLIENTDISABLEWHEN"]] || "";
  var evalResult,disExpressionIdMeta;
  if(disableExpressionId){
    if(isClientDisableWhen){
      /* client side */
      if (disableExpressionId && disableExpressionId.length > 0) {
        disExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(disableExpressionId);
        childNode[TEMPLATE_CONSTANTS["PYCELL"]].disExpressionIdMeta = disExpressionIdMeta;
        evalResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(disableExpressionId);
      }
    } else{
      /* server side */
      evalResult = pega.ui.TemplateEngine.getCurrentContext().getWhenResult(disableExpressionId);
    }
  }
  /* disable when */

  /* disable when */
  if(disableExpressionId){
    if((typeof evalResult == "object" && evalResult[pega.ui.ExpressionEvaluator.DISABLE_WHEN]) || (typeof evalResult == "boolean" && evalResult)){
      /* client side*/
      //cellTemplateObj.pyLGCustomClass += " lg-disabled";
      childNode.isLGDisabled = true;
      expDisabledResults[index] = false;
    }
  }
  /* disable when */
  return childNode;
}

//static-content-hash-trigger-YUI
/*
 {{~#if isRepeatLayoutGroup~}} 
       {{#if_eq isSemanticTabLayout "true"}}
          <div class="layout-header" role="tablist">{{~#each rows~}} {{{getDLGCell ../lgCellsTemplatePage @index ../originalDataSource ../uniqueId ../isSourceParameterisedDP ../repeatSource ../repeatSourceSize ../configObj ../activeIndex ../bPageGroupBoundDLG "true"}}}{{~/each~}}</div>
          {{~#each rows~}}{{{getDLGCell ../lgCellsTemplatePage @index ../originalDataSource ../uniqueId ../isSourceParameterisedDP ../repeatSource ../repeatSourceSize ../configObj ../activeIndex ../bPageGroupBoundDLG "false"}}}{{~/each~}}
       {{~else~}}
           {{~#each rows~}}{{{getDLGCell ../lgCellsTemplatePage @index ../originalDataSource ../uniqueId ../isSourceParameterisedDP ../repeatSource ../repeatSourceSize ../configObj ../activeIndex ../bPageGroupBoundDLG}}}{{~/each~}}
        {{/if_eq}}
    {{~else~}}
       {{#if_eq isSemanticTabLayout "true"}}
       <div class="layout-header" role="tablist">{{~#each lgCellsTemplatePage~}}{{{getLGCell ../lgCellsTemplatePage ../configObj @index "true" }}}{{~/each~}}</div>
       {{~#each lgCellsTemplatePage~}}{{{getLGCell ../lgCellsTemplatePage ../configObj @index "false" }}}{{~/each~}}
       {{~else~}}
       {{~#each lgCellsTemplatePage~}}{{{getLGCell ../lgCellsTemplatePage ../configObj @index }}}{{~/each~}}
       {{/if_eq}}
    {{~/if~}}

pzpega_ui_LGCellTemplate
*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pzLGCellTemplate'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isSemanticTabLayout") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(7, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":2,"column":7},"end":{"line":7,"column":18}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <div class=\"layout-header\" role=\"tablist\">"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":52},"end":{"line":3,"column":280}}})) != null ? stack1 : "")
    + "</div>"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":238}}})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getDLGCell")||(depth0 && lookupProperty(depth0,"getDLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(data && lookupProperty(data,"index")),(depths[1] != null ? lookupProperty(depths[1],"originalDataSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"uniqueId") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"isSourceParameterisedDP") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSourceSize") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"activeIndex") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"bPageGroupBoundDLG") : depths[1]),"true",{"name":"getDLGCell","hash":{},"data":data,"loc":{"start":{"line":3,"column":69},"end":{"line":3,"column":269}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getDLGCell")||(depth0 && lookupProperty(depth0,"getDLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(data && lookupProperty(data,"index")),(depths[1] != null ? lookupProperty(depths[1],"originalDataSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"uniqueId") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"isSourceParameterisedDP") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSourceSize") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"activeIndex") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"bPageGroupBoundDLG") : depths[1]),"false",{"name":"getDLGCell","hash":{},"data":data,"loc":{"start":{"line":4,"column":26},"end":{"line":4,"column":227}}})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":231}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getDLGCell")||(depth0 && lookupProperty(depth0,"getDLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(data && lookupProperty(data,"index")),(depths[1] != null ? lookupProperty(depths[1],"originalDataSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"uniqueId") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"isSourceParameterisedDP") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSource") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"repeatSourceSize") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"activeIndex") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"bPageGroupBoundDLG") : depths[1]),{"name":"getDLGCell","hash":{},"data":data,"loc":{"start":{"line":6,"column":27},"end":{"line":6,"column":220}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isSemanticTabLayout") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.program(16, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":9,"column":7},"end":{"line":14,"column":17}}})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "       <div class=\"layout-header\" role=\"tablist\">"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgCellsTemplatePage") : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":49},"end":{"line":10,"column":157}}})) != null ? stack1 : "")
    + "</div>"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgCellsTemplatePage") : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":7},"end":{"line":11,"column":116}}})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getLGCell")||(depth0 && lookupProperty(depth0,"getLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(data && lookupProperty(data,"index")),"true",{"name":"getLGCell","hash":{},"data":data,"loc":{"start":{"line":10,"column":80},"end":{"line":10,"column":146}}})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getLGCell")||(depth0 && lookupProperty(depth0,"getLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(data && lookupProperty(data,"index")),"false",{"name":"getLGCell","hash":{},"data":data,"loc":{"start":{"line":11,"column":38},"end":{"line":11,"column":105}}})) != null ? stack1 : "");
},"16":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgCellsTemplatePage") : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":7},"end":{"line":13,"column":108}}})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getLGCell")||(depth0 && lookupProperty(depth0,"getLGCell"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"lgCellsTemplatePage") : depths[1]),(depths[1] != null ? lookupProperty(depths[1],"configObj") : depths[1]),(data && lookupProperty(data,"index")),{"name":"getLGCell","hash":{},"data":data,"loc":{"start":{"line":13,"column":38},"end":{"line":13,"column":97}}})) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRepeatLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":1,"column":1},"end":{"line":15,"column":13}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
})();

pega.ui.TemplateEngine.registerHelper("getLGCell", function (lgCellsTemplatePage, configObj, index, isOnlyHeader) {
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  if (lgCellsTemplatePage[index]) {
    var childNode = lgCellsTemplatePage[index];
    if (childNode) {
      var childTemplateName = childNode[TEMPLATE_CONSTANTS["PYNAME"]];
      if (childTemplateName) {
        if(configObj && configObj.isParentRepeating){
          var indexToActive = parseInt(configObj.indexActiveLayout);
          if(index == indexToActive-1 && childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]] && childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]]){
            childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isActiveLayout = true;
          }
        }
        if(childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]].length){
          childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isOnlyHeader = isOnlyHeader;
          if(configObj.isSemanticTabLayout) childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isSemanticTabLayout = configObj.isSemanticTabLayout;
          if(configObj.isSemanticTabLayout === "true" && childNode.pyVisibility === true && childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]].length && childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]].length ){
          childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isOnlyHeader = isOnlyHeader;
          childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0][TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isSemanticTabLayout = configObj.isSemanticTabLayout;
        }
        }
        
        if(configObj && configObj.isNumberedAccordion == "true" && childTemplateName.toLowerCase() != "dummy"){
          /* in case not a visible tab */
          if(!configObj.currentIndex){
            configObj.currentIndex = 1;
          }else {
            configObj.currentIndex++;
          }
          childNode[TEMPLATE_CONSTANTS["PYCELL"]]["currentIndex"] = configObj.currentIndex;
          /* end */
        } else if(childTemplateName.toLowerCase() == "dummy" && childNode.pyVisibility === false && (index+1) == configObj.hiddenFieldActiveIndex){
          configObj.hiddenFieldActiveIndex++;          
        }
        var out = pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null, childNode);
        out = resolvingHTMLForLayoutGroup(out, configObj, index);
        return new Handlebars.SafeString(out);
      }
    }
  }
});

function resolvingHTMLForLayoutGroup(out, configObj, index) {
  var returnHTML = "";
  if (out != "") {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = out;
    if (tempDiv && tempDiv.firstChild && tempDiv.firstChild.getAttribute) {
      var lgChildClass = tempDiv.firstChild.getAttribute("class");

      tempDiv = modifyHTMLForActive(index, configObj, tempDiv, lgChildClass);

      if (index + 1 == configObj.totalItems) {
        modifyForMenuActiveCallback(configObj);
      }
    }
    returnHTML = tempDiv.innerHTML;
  }
  return returnHTML;
}

function modifyForMenuActiveCallback(configObj) {
  setTimeout(function () {
    if (typeof LayoutGroupModule != "undefined") {
      LayoutGroupModule.setHiddenField(pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']"));
      if (configObj.LGType == "menu") {
        /*var hiddenName = pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").attr("data-lg-id");*/
        var hiddenName = configObj.LGRepeatId;
        var finalActiveMenu = pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children("[name='EXPANDED" + hiddenName + "']").val();
        var headerMarkup = pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children("[data-lg-child-id='" + finalActiveMenu + "']").children(".header").html();
        var nested = false;
        if (!headerMarkup) {
          nested = true;
          headerMarkup = pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children().children("[data-lg-child-id='" + finalActiveMenu + "']").children(".header").html();
        }
        if(headerMarkup) {
          var headerIcon;
          var isNumberedAccordion = headerMarkup.indexOf("number-accordion") != -1;
          var headerTitle,headerContent;
          if(isNumberedAccordion){
            headerTitle = pega.ctx.dom.$(pega.ctx.dom.$(headerMarkup)[1]).html();
            headerContent = pega.ctx.dom.$(headerMarkup)[2];
          }else{
            headerTitle = pega.ctx.dom.$(pega.ctx.dom.$(headerMarkup)[0]).html();
            headerContent = pega.ctx.dom.$(headerMarkup)[1];
          }

          if (pega.ctx.dom.$(pega.ctx.dom.$(headerMarkup)[0]).prop('tagName') == "SPAN") {
            headerIcon = pega.ctx.dom.$(pega.ctx.dom.$(headerMarkup)[0]);
            headerTitle = pega.ctx.dom.$(pega.ctx.dom.$(headerMarkup)[1]).html();
            headerContent = pega.ctx.dom.$(headerMarkup)[2];
          }
          if (headerIcon && headerTitle) {
            if (nested) {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children().children(".layout-group-nav").children(".layout-group-nav-title").html("<i class=\"icon icon-openclose\"></i>").append(headerIcon);
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children().children(".layout-group-nav").children(".layout-group-nav-title").append(headerTitle);
            } else {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children(".layout-group-nav").children(".layout-group-nav-title").html("<i class=\"icon icon-openclose\"></i>").append(headerIcon);
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children(".layout-group-nav").children(".layout-group-nav-title").append(headerTitle);
            }
          } else if (headerTitle) {
            if (nested) {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children().children(".layout-group-nav").children(".layout-group-nav-title").html(headerTitle);
            } else {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children(".layout-group-nav").children(".layout-group-nav-title").html(headerTitle);
            }
          }
          if (headerContent) {
            if (nested) {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children().children(".layout-group-nav").children(".layout-group-nav-title").append(headerContent);
            } else {
              pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']").children(".layout-group-nav").children(".layout-group-nav-title").append(headerContent);
            }
          }
        }
      }
      LayoutGroupModule.setHiddenField(pega.ctx.dom.$("[data-repeat-id='" + configObj.LGRepeatId + "']"));
    }
  }, 100);
}

function modifyHTMLForActive(index, configObj, tempDiv, lgChildClass, childNode) {
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  var lastKey, visibility;
  var isAriaSelected = false;
  var anyActiveItem = false,
      visibilityCell,
      keyToActive;
  for (var key in configObj.expResults) {
    lastKey = key;
    if (configObj.expResults[key]) {
      if (configObj.lgCellsTemplatePage[key - 1]) {
        visibilityCell = configObj.lgCellsTemplatePage[key - 1][TEMPLATE_CONSTANTS["PYVISIBILITY"]];
        if((configObj.lgCellsTemplatePage[key - 1].isLGDisabled) || (configObj.lgCellsTemplatePage[index] && configObj.lgCellsTemplatePage[index].isLGDisabled) || (childNode && childNode.isLGDisabled)){
          visibilityCell = false;
        }
      }
      
      if (typeof visibilityCell == "undefined") {
        var nodeExpressionId = configObj.lgCellsTemplatePage[key - 1] && configObj.lgCellsTemplatePage[key - 1][TEMPLATE_CONSTANTS["PYCELL"]] ? configObj.lgCellsTemplatePage[key - 1][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYEXPRESSIONID"]] || "" : "";

        if (nodeExpressionId && nodeExpressionId.length > 0) {
          var expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(nodeExpressionId);
          if (expResults != null && expResults[pega.ui.ExpressionEvaluator.SHOW_WHEN] == false) {
            visibilityCell = false;
          }
        }
      }
      if (visibilityCell !== false) {
        anyActiveItem = true;
        if (!keyToActive) keyToActive = key;
      }
    }
  }
  /*if(!anyActiveItem && (lastKey < index+1 || typeof(lastKey) == "undefined") && typeof(LayoutGroupModule) !="undefined" && LayoutGroupModule.setActiveValue == 0){
        LayoutGroupModule.fallBack = true;
    } */
  if (!anyActiveItem && (lastKey < index + 1 || typeof lastKey == "undefined") && typeof LayoutGroupModule != "undefined" && LayoutGroupModule.setActiveValue == 0 && configObj.notVisibilityDynamicResults && !isNaN(configObj.hiddenFieldActiveIndex) && configObj.notVisibilityDynamicResults.indexOf(parseInt(configObj.hiddenFieldActiveIndex)) == -1) {
    LayoutGroupModule.fallBack = true;
  }
  var counterItem,
      forcedNothingShownAllFalse = false;
  if (!anyActiveItem) {
    counterItem = 1;

    for (var key in configObj.expResults) {
      /*if((key != counterItem && typeof configObj.DLGNotVisibileLayout == "undefined") || (configObj.DLGNotVisibileLayout && configObj.DLGNotVisibileLayout[counterItem] !== true)){
         	break;	   
         } */
      if ((typeof configObj.notVisibilityDynamicResults == "undefined" || configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.length == 0) && key != counterItem || configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.indexOf(counterItem) == -1 && key != counterItem) {
        break;
      }
      counterItem++;
    }

    if (configObj.expResults[configObj.hiddenFieldActiveIndex] != "undefined" && configObj.expResults[configObj.hiddenFieldActiveIndex] != false || configObj.expResults[configObj.hiddenFieldActiveIndex] === false) {
      if (typeof configObj.notVisibilityDynamicResults == "undefined" || configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.length == 0 || configObj.notVisibilityDynamicResults && configObj.hiddenFieldActiveIndex && configObj.notVisibilityDynamicResults.indexOf(parseInt(configObj.hiddenFieldActiveIndex)) == -1) {
        counterItem = configObj.hiddenFieldActiveIndex;
        if (configObj.expResults[configObj.hiddenFieldActiveIndex] === false && configObj.hiddenFieldActiveIndex == index + 1) forcedNothingShownAllFalse = true;
      }
    }
  }
  var indexForNextActiveIfAllFalse;

  for (var key in configObj.lgCellsTemplatePage) {
    visibility = configObj.lgCellsTemplatePage[key][TEMPLATE_CONSTANTS["PYVISIBILITY"]];
    if (typeof visibility == "undefined") {
      var nodeExpressionId = configObj.lgCellsTemplatePage[key] && configObj.lgCellsTemplatePage[key][TEMPLATE_CONSTANTS["PYCELL"]] ? configObj.lgCellsTemplatePage[key][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYEXPRESSIONID"]] || "" : "";

      if (nodeExpressionId && nodeExpressionId.length > 0) {
        var expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(nodeExpressionId);
        if (expResults != null && expResults[pega.ui.ExpressionEvaluator.SHOW_WHEN] == false) {
          visibility = false;
        }
      }
    }
    
    if((typeof visibility == "undefined" || visibility) && (((configObj.lgCellsTemplatePage[key] && configObj.lgCellsTemplatePage[key].isLGDisabled) || (configObj.lgCellsTemplatePage[index] && configObj.lgCellsTemplatePage[index].isLGDisabled)) || (childNode && childNode.isLGDisabled))){
      visibility = false;
    }

    /* if(visibility !== false && !anyActiveItem && (typeof configObj.DLGNotVisibileLayout == "undefined" || (configObj.DLGNotVisibileLayout && configObj.DLGNotVisibileLayout[parseInt(key)+1] !== true))){ */
    if (visibility !== false && !anyActiveItem && (typeof configObj.notVisibilityDynamicResults == "undefined" || configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.length == 0 || configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.indexOf(parseInt(key) + 1) == -1)) {
      indexForNextActiveIfAllFalse = parseInt(key) + 1;
      if (configObj.notVisibilityDynamicResults && !isNaN(configObj.hiddenFieldActiveIndex) && configObj.notVisibilityDynamicResults.indexOf(parseInt(configObj.hiddenFieldActiveIndex)) != -1) {
        configObj.hiddenFieldActiveIndex = indexForNextActiveIfAllFalse;
      }
      break;
    }
  }

  var isDisabled = (configObj.lgCellsTemplatePage && (configObj.lgCellsTemplatePage[index] && configObj.lgCellsTemplatePage[index].isLGDisabled)) || (childNode && childNode.isLGDisabled);
  /* CONDITION ALGO:
      	if(A || B || C || D || E)
          	Case A: All active evaluation comes false make next visible to active.
              Case B: On submission make active based on hidden input.
              Case C: Make active based on indexActiveLayout + its active evaluation to be true
              Case D: Multipane accordion active condition
              Case E: Father of all, nothing works out go fallback mechanism, decides we need to fallback if no active found. 
      */
  /* (typeof configObj.DLGNotVisibileLayout != "undefined" && configObj.DLGNotVisibileLayout[index+1] !== true && index+1==counterItem) || */

  var A = LayoutGroupModule && (LayoutGroupModule.fallBack != false || typeof LayoutGroupModule.fallBack == "undefined") && configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.length > 0 && configObj.notVisibilityDynamicResults.indexOf(index + 1) == -1 && index + 1 == counterItem;

  var B = !anyActiveItem && index + 1 == indexForNextActiveIfAllFalse && (configObj.LGType == "accordion" && 0 == configObj.hiddenFieldActiveIndex || index + 1 == configObj.hiddenFieldActiveIndex);

  var C = anyActiveItem && index + 1 == keyToActive;

  var D = lastKey == configObj.totalItems && !anyActiveItem && index + 1 == indexForNextActiveIfAllFalse && counterItem > lastKey;

  var E = counterItem == index + 1 && (LayoutGroupModule && (LayoutGroupModule.fallBack != false || typeof LayoutGroupModule.fallBack == "undefined") || forcedNothingShownAllFalse);

  var F = configObj.indexActiveLayout == index + 1 && configObj.expResults[index + 1] != false;

  var G = configObj.expResults[index + 1] != false && configObj.multiAccodionList.split(",").indexOf(index + 1 + "") != -1;

  var H = LayoutGroupModule && LayoutGroupModule.fallBack == true && (configObj.expResults[index + 1] == true || lastKey < index + 1 && index + 1 >= configObj.hiddenFieldActiveIndex && configObj.expResults[index + 1] != false || typeof lastKey == "undefined" && !anyActiveItem && !(configObj.hiddenFieldActiveIndex != "0" || configObj.hiddenFieldActiveIndex));

  /*if(((LayoutGroupModule && (LayoutGroupModule.fallBack != false || typeof LayoutGroupModule.fallBack == "undefined")) && configObj.notVisibilityDynamicResults && configObj.notVisibilityDynamicResults.length > 0 && configObj.notVisibilityDynamicResults.indexOf(index+1) == -1 && index+1==counterItem) || (!anyActiveItem && (index+1 == indexForNextActiveIfAllFalse) && ((configObj.LGType == "accordion" && 0 == configObj.hiddenFieldActiveIndex) || (index+1 == configObj.hiddenFieldActiveIndex ))) || (anyActiveItem && (index+1 == keyToActive)) || (lastKey == configObj.totalItems && !anyActiveItem && (index+1 == indexForNextActiveIfAllFalse) && (counterItem > lastKey)) || (counterItem == index+1 && (LayoutGroupModule && (LayoutGroupModule.fallBack != false || typeof LayoutGroupModule.fallBack == "undefined"))) || (configObj.indexActiveLayout == index+1 && configObj.expResults[index+1] != false) || (configObj.expResults[index+1] != false && configObj.multiAccodionList.split(",").indexOf(index+1+"") != -1) || (LayoutGroupModule && LayoutGroupModule.fallBack == true && ((configObj.expResults[index+1] == true) || (lastKey < index+1 && index+1 >= configObj.hiddenFieldActiveIndex && configObj.expResults[index+1] != false) || (typeof lastKey == "undefined" && !anyActiveItem)))){ */
  
  if (A || B || C || D || E || F || G || H) {
    if (pega.ctx.dom.$(tempDiv).children().css("display") != "none" && !isDisabled) {
      if (typeof LayoutGroupModule != "undefined") {
        LayoutGroupModule.fallBack = false;
        LayoutGroupModule.setActiveValue = index + 1;
      }
      lgChildClass += " active multiactive ";
      isAriaSelected = true; 
    } else {
      if (typeof LayoutGroupModule != "undefined") {
        LayoutGroupModule.fallBack = true;
      }
      lgChildClass = lgChildClass.replace("active", "");     
      lgChildClass = lgChildClass.replace("multiactive", "");
    }
  } else {
    lgChildClass = lgChildClass.replace("active", "");
    lgChildClass = lgChildClass.replace("multiactive", "");
  }
  if(isDisabled){
    lgChildClass += " lg-disabled ";
  }
  if(configObj.expResults[index + 1] !== true && configObj.isTypeSet === false){
    lgChildClass += " lg-collapse ";
  } 
  
  if(tempDiv.querySelector(".header"))
    tempDiv.querySelector(".header").setAttribute("aria-selected",isAriaSelected);
  tempDiv.firstChild.setAttribute("class", lgChildClass);
  /* Added for appending data-test-id for layout group */
  if (!!configObj && !!configObj.lgCellsTemplatePage && !!configObj.lgCellsTemplatePage[index] && !!configObj.lgCellsTemplatePage[index].pyTemplates && !!configObj.lgCellsTemplatePage[index].pyTemplates[0] && !!configObj.lgCellsTemplatePage[index].pyTemplates[0].pyTemplates && !!configObj.lgCellsTemplatePage[index].pyTemplates[0].pyTemplates[1] && !!configObj.lgCellsTemplatePage[index].pyTemplates[0].pyTemplates[1].automationId) {
    var testID = configObj.lgCellsTemplatePage[index].pyTemplates[0].pyTemplates[1].automationId;
    if (testID && testID != "") {
      testID = testID.trim().replace("data-test-id=", "").replace(/[']+/g, '');
      tempDiv.firstChild.setAttribute("data-test-id", testID);
    }
  }
  /* end of data-test-id generation */
  return tempDiv;
}

function resolvingHTMLForRepeatingLayoutGroup(out, originalDataSource, index, pyLayoutType, isSourceParameterisedDP, configObj, activeIndex, childNode) {
  var returnHTML = "";
  if (out != "") {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = out;
    if (pyLayoutType == "sub_section") {
      /* Add base_ref attribute */
      if (isSourceParameterisedDP) {
        var baseRef = tempDiv.firstChild.getAttribute("base_ref");
        if (baseRef) {
          var controls = pega.ctx.dom.querySelectorAll("[data-propref]", tempDiv);
          for (var controlCount = 0; controlCount < controls.length; controlCount++) {
            controls[controlCount].setAttribute("data-propref", controls[controlCount].getAttribute("data-propref").replace(new RegExp(baseRef.substr(0, baseRef.indexOf('.')), 'g'), originalDataSource.substr(0, originalDataSource.indexOf('.'))));
          }
          baseRef = baseRef.replace(/^([^\\.]+)/, function () {
            return originalDataSource.substr(0, originalDataSource.indexOf('.'));
          });
          tempDiv.firstChild.setAttribute("base_ref", baseRef);
        }
      }
    }
    var childCount = index + 1;

    tempDiv.firstChild.setAttribute("data-lg-child-id", childCount);
    var lgChildClass = tempDiv.firstChild.getAttribute("class");
    var style = tempDiv.firstChild.getAttribute("style");
    lgChildClass = lgChildClass.replace("count-1", "count-" + childCount + " ");

    /*if(index > 0 || style.indexOf("display:none") != -1){
       	lgChildClass = lgChildClass.replace("active","");
       	lgChildClass = lgChildClass.replace("multiactive","");
    } */
    if(configObj && configObj.isNumberedAccordion == "true"){
      if((style && !(style.indexOf("display:none") != -1)) || !style){
        if(!configObj.displayCurrentIndex){
        configObj.displayCurrentIndex = 1;
      }else {
        configObj.displayCurrentIndex++;
      }
     }
    }
    if(configObj.displayCurrentIndex){
      var numCircle = tempDiv.querySelector('.number-accordion-circle');
      numCircle.setAttribute("num-index",configObj.displayCurrentIndex);
      var locNumArry;
      if(pega && pega.DateTimeUtil && pega.DateTimeUtil.Locale && pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY)
        locNumArry = pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY.replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "").split(",");
      var numberIndexTextInLng = locNumArry[configObj.displayCurrentIndex];
      numCircle.innerHTML = numberIndexTextInLng;
    }
    tempDiv = modifyHTMLForActive(index, configObj, tempDiv, lgChildClass, childNode);

    if (index + 1 == configObj.totalItems) {
      modifyForMenuActiveCallback(configObj);
    }

    returnHTML = tempDiv.innerHTML;
    
    if(style && (style.indexOf("display:none") != -1)){
      configObj && configObj.indexActiveLayout && configObj.indexActiveLayout++ ;
    }
  } else {
    configObj && configObj.indexActiveLayout && configObj.indexActiveLayout++ ;
  }
  return returnHTML;
}

pega.ui.TemplateEngine.registerHelper("getDLGCell", function (lgCellsTemplatePage, index, originalDataSource, uniqueId, isSourceParameterisedDP, repeatSource, repeatSourceSize, configObj, activeIndex, bPageGroupBoundDLG, isOnlyHeader) {
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  var childNode,
      childTemplateName,
      pyLayoutType,
      displayString = "",
      out = "";
  childNode = this;
  if (childNode) {
    childTemplateName = childNode[TEMPLATE_CONSTANTS["PYNAME"]];
    pyLayoutType = childNode && childNode[TEMPLATE_CONSTANTS["PYCELL"]] && childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYTYPE"]];
  }
  var resolveIndex = 0,
      indexForSection = 0;
  if (lgCellsTemplatePage) {
    for (var i = 0; i < lgCellsTemplatePage.length; i++) {
      if (!(lgCellsTemplatePage[i] && lgCellsTemplatePage[i][TEMPLATE_CONSTANTS["PYCELL"]])) {
        indexForSection = i;
        break;
      }
    }
  }

  if (pyLayoutType == "sub_section") {
    var ind = "i" + uniqueId;
    resolveIndex = pega.ui.gStackOrderForResolveIndex.pop();
    if (!resolveIndex) resolveIndex = 0;
    resolveIndex++;

    if(isOnlyHeader === "true" && index === repeatSourceSize - 1) pega.ui.gStackOrderForResolveIndex.push(0);
    else pega.ui.gStackOrderForResolveIndex.push(resolveIndex);
    pega.ui.template.DataBinder.repeatingIndex[ind] = resolveIndex;
  }
  if (childTemplateName) {
    if (pyLayoutType == "sub_section") {
      var currentContext = pega.ui.TemplateEngine.getCurrentContext();
      if (resolveIndex == 1) {
        var repeatPath = pega.ui.template.DataBinder.resolvePath(repeatSource);
        var repeatInfo = {
          component: "DynamicLayoutGroup"
        };
        currentContext.push(repeatPath, undefined, repeatInfo);
      }
      if(bPageGroupBoundDLG){ // For pagegroup push the current reference
        currentContext.push(childNode.pageGroupBaseRef);
      } else{ // For pagelist/datapage push the index
        currentContext.push(resolveIndex - 1);           
      }
      var currentRepeatingDepth = pega.ui.TemplateEngine.createRepeatingDepth(originalDataSource + "(" + resolveIndex + ")", resolveIndex);
      pega.ui.TemplateEngine.pushRepeatingDepth(currentRepeatingDepth);
      childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYBASEREF"]] = "NAME='BASE_REF' BASE_REF='" + pega.ui.TemplateEngine.ContextObject.getReference() + "'";
    } else if (pyLayoutType == "layout" && index == indexForSection + repeatSourceSize) {
      /*var currentContext =  pega.ui.TemplateEngine.getCurrentContext();
      currentContext.pop();*/
    }

    if(configObj && configObj.isNumberedAccordion == "true" && childTemplateName.toLowerCase() != "dummy"){
      /* in case not a visible tab */
      if(!configObj.currentIndex){
        configObj.currentIndex = 1;
      }else {
        configObj.currentIndex++;
      }
      childNode[TEMPLATE_CONSTANTS["PYCELL"]]["currentIndex"] = configObj.currentIndex;
      /* end */
    }
  
    if(childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]] && childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]].length){
      childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isOnlyHeader = isOnlyHeader;
      if(configObj.isSemanticTabLayout) childNode[TEMPLATE_CONSTANTS["PYTEMPLATES"]][0].isSemanticTabLayout = configObj.isSemanticTabLayout;
    }
    out = pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null, childNode);
    if (pyLayoutType == "sub_section") {
      var currentContext = pega.ui.TemplateEngine.getCurrentContext();
      out = pega.ui.template.DataBinder.resolveIndex(out);
      currentContext.pop();
      if (index + 1 == indexForSection + repeatSourceSize) {
        currentContext.pop();
      }
      pega.ui.TemplateEngine.popRepeatingDepth();
    }
    /*if(out == "" && configObj && configObj.expResults && configObj.expResults[index+1]){
     	if(typeof configObj.DLGNotVisibileLayout == "undefined"){
           	configObj.DLGNotVisibileLayout = {};
         } 
       	configObj.DLGNotVisibileLayout[index+1] = true;
       	delete configObj.expResults[index+1];   
     }*/
    displayString = resolvingHTMLForRepeatingLayoutGroup(out, originalDataSource, index, pyLayoutType, isSourceParameterisedDP, configObj, activeIndex, childNode);
  }

  return new Handlebars.SafeString(displayString);
});
//static-content-hash-trigger-YUI
var LayoutGroupModule = function(p) {
    /*\
    |*|
    |*| Private constants
    |*| % units are a percent of the layout group's width.
    |*|
    \*/
    // Keyboard inputs
    var KEYBOARD = {
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            HOME: 36,
            END: 35
        },
        LOGGING = false,
        // The first and last elements can be swiped to one another iff IS_CIRCULAR.
        // Must be disabled because there is a bug with how circular swipe interacts with visible when on client
        /*IS_CIRCULAR = false,*/
        // Transform properties to use for CSS
        TRANSFORM_PROP,
        TRANSITION_PROP,
        // Swipe distance in % that must be exceeded to move to the next layout regardless of swipe velocity
        IDLE_SWIPE_PERCENT = 35,
        // Swipe velocity in px/s that must be exceeded to move to the next layout.
        FAST_SWIPE_SPEED = 300,
        // Average speed in %/s the layouts should move to reseat after a swipe ends
        SLIDE_SPEED = 250,
        // enum for nextLayoutDirection
        FIRST_MOVE = 0,
        LEFT = 1,
        RIGHT = 2,
        INDICATOR_ENABLED = true,
        //INDICATOR_WAITTIME = 500,
        // The wait time is identical to the transition timeout set in pzBaseCore.
        // Half the size in pixels of the side of the scroll box.
        // The scroll box surrounds the point of the touch start event.
        // The user commits to swiping horizontally or scrolling vertically when the touch move events escape the box.
        SCROLL_BOX_RADIUS = 50,
        /*\
        |*|
        |*| Private static variables
        |*|
        \*/
        startClientX = 0,
        startClientY = 0,
        windowSize = 0,
        // If windowSize is different from 0, then we are in the middle of a swipe
        xDisplacementPrev = 0,
        startSwipeTimeInMs = 0,
        prevSwipeTimeInMs = 0,
        // Instantaneous velocity of the swipe based on xDisplacementPrev, prevSwipeTimeInMs, the current position, and the current time
        swipeVelocity = 0,
        // px/s
        nextLayoutDirection = FIRST_MOVE,
        // The layout body adjacent to selected layout that is partially visible.
        // This is equal to either null, beforeLayoutBodyIn, or afterLayoutBodyIn.
        nextLayoutBodyIn = null,
        // The layout body adjacent to selected layout that is hidden.
        // This is equal to either null, beforeLayoutBodyIn, or afterLayoutBodyIn.
        hiddenLayoutBodyIn = null,
        // The layout body that should be selected after a negative swipe
        beforeLayoutBodyIn = null,
        // The layout body that should be selected after a positive swipe
        afterLayoutBodyIn = null,
        // True if the layout group should select a different layout after the swipe
        swipeNextLayout = false,
        // True if the current scroll event has not yet escaped the scroll box
        withinScrollBox = true,
        layoutBodyHeight = 0,
        headerHeight = 0,
        beforeLayoutBodyHeight = 0,
        afterLayoutBodyHeight = 0,
        touchStart = 'touchstart',
        touchMove = 'touchmove',
        touchEnd = 'touchend',
        touchCancel = 'touchcancel',
        // If not null, this event is treated like touchCancel
        // On Microsoft Surface, the event is abandoned after firing touchOut, so touchCancel will never be fired
        touchOut = null,
        // Equal to touchMove + " " + touchEnd + " " + touchCancel + " " + touchOut in _initializeLayoutGroup
        touchBindEvents = '',
        debounceTimeout = null,
        // Testing browser prefix detection
        //browser_prefix = '',
        lastFocusedError = "",
        flagToStopEvent = true,
        defaultDeltaDistanceToShiftTabsBy = 150,
        initialMarginForArrows = 0,
        currentMarginForSection = "",
        currentTabHeight = "",
        isLayoutGroupModuleLoaded = false,
        pcd = pega.ctx.dom,
        forceResize = false,
        resizeCallDebounce;
    /*\
    |*|
    |*| Private methods
    |*|
    \*/
    _isTouchDevice = function() {
            return ("ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && (-
                1 !== navigator.userAgent.toLowerCase().indexOf("mobile") || -1 !== navigator.userAgent.toLowerCase()
                .indexOf("tablet") && !window.MSInputMethodContext && !document.documentMode);
        }, _setBrowserPrefix = function() {
            var animation = false,
                /* animationstring = 'animation', */
                /* not used */
                elm = $("body")[0],
                keyframeprefix = '',
                domPrefixes = 'Webkit Moz'.split(' '),
                pfx = '';
            if (elm.style.animationName !== undefined) {
                animation = true;
            }
            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        /* animationstring = pfx + 'Animation'; */
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }
            TRANSFORM_PROP = keyframeprefix + 'transform';
            TRANSITION_PROP = keyframeprefix + 'transition';
        },
        // Support for pagination during a swipe
        _showLayoutPagination = function(layoutgroup) {
            var paginationElem = "<div class='layout-group-selector'>";
            layoutgroup.children(".layout").each(function generateIndexSelector(index) {
                var $nThat = pcd.$(this);
                if ($nThat.css("display") != "none") {
                    paginationElem += "<i class='icon icon-selector";
                    if ($nThat.hasClass("active")) paginationElem += " active";
                    paginationElem += "'></i>";
                }
            });
            paginationElem += "</div>";
            layoutgroup.append(paginationElem);
        }, _removeLayoutPagination = function(layoutgroup) {
            layoutgroup.children(".layout-group-selector").remove();
        },
        /*
         * During a swipe, this function returns true if _swipeLayoutMove has been
         * called during this swipe event and it displaced the layout at some point.
         * This will happen once the touch pointer is moved beyond the scroll box
         * (See SCROLL_BOX_RADIUS and withinScrollBox). Notably, this will return true
         * even if the layout happens to be in the same position it started in, as long
         * as it moved in the past during the current swipe event.
         *
         * During a swipe, this function will return false if _swipeLayoutMove
         * has not displaced the layout.
         *
         * The return value is not defined if a swipe is not in progress.
         */
        _hasBeenSwiped = function() {
            return nextLayoutDirection !== FIRST_MOVE;
        },
        // enable and disable listener for touchmove and touchend once a swipe start is detected
        _enableSwipeListener = function(layoutBody) {
            // TODO: See if it's better to split this into three distinct functions
            layoutBody.on(touchBindEvents, function(e) {
                var $nThat = pcd.$(this);
                var layoutgroup = layoutBody.parent().parent().parent().parent();
                if (e.type == touchMove) {
                    return _swipeLayoutMove($nThat, e);
                } else if (e.type == touchEnd) {
                    return _swipeLayoutEnd($nThat, e);
                } else if (e.type == touchCancel) {
                    _swipeCancel($nThat.parent().parent(), $nThat);
                    // fourth parent up from child body is the layout group element
                    _queueDestroySwipeIndicators(layoutgroup);
                    return true;
                } else if (e.type == touchOut) {
                    if (!_pointIsInElement(_getTouchPoint(e), this)) {
                        _swipeCancel($nThat.parent().parent(), $nThat);
                        // fourth parent up from child body is the layout group element
                        _queueDestroySwipeIndicators(layoutgroup);
                    }
                    return true;
                }
                return false;
            });
        }, _disableSwipeListener = function(layoutBody) {
            layoutBody.off(touchBindEvents);
        }, _isSwipeAllowed = function(layoutgroup) {
            if (windowSize != 0 || layoutgroup.hasClass("swipe-enabled")) return false;
            return true;
        },
        // Cancel the swipe - restore initial conditions
        _swipeCancel = function(layoutgroup, layoutBody) {
            if (LOGGING) console.log("_swipeCancel");
            layoutBody.css(TRANSITION_PROP, '');
            layoutBody.css(TRANSFORM_PROP, '');
            if (nextLayoutBodyIn) {
                nextLayoutBodyIn.css(TRANSITION_PROP, '');
                nextLayoutBodyIn.css(TRANSFORM_PROP, '');
            }
            windowSize = 0;
            layoutgroup.removeClass('swipe-enabled');
            // Hide overflow originally set in _swipeLayoutStart
            layoutgroup.parent().css('overflow-x', '');
            layoutBody.css("margin-top", '');
            beforeLayoutBodyIn.css("margin-top", '');
            afterLayoutBodyIn.css("margin-top", '');
            layoutgroup.css("margin-bottom", "");
            _removeLayoutPagination(layoutgroup);
            if (nextLayoutBodyIn) {
                nextLayoutBodyIn.parent().removeClass("active");
            }
            _disableSwipeListener(layoutBody);
        }, _getLayoutBeforeActive = function(layoutgroup, activeLayout) {
            if (LOGGING) console.log("_getLayoutBeforeActive");
            if (activeLayout == null) {
                var layouts = pcd.$(layoutgroup[0]).children(".layout-body").children(".content-layout-group");
                if (layouts.length == 0) layouts = pcd.$(layoutgroup[0]).children(".layout-body").children(
                    ".content").children(".content-layout-group");
                activeLayout = pcd.$(layouts.children('.active')[0]);
            }
            var beforeLayout = activeLayout.prev('.layout');
            /*if (IS_CIRCULAR) {
                if (beforeLayout.length == 0)
                    beforeLayout = layoutgroup.children(".layout:last");
                if (afterLayout.length == 0)
                    afterLayout = layoutgroup.children(".layout:first");
            }*/
            while (beforeLayout.css('display') == 'none') beforeLayout = beforeLayout.prev('.layout');
            return beforeLayout;
        },
        _getLayoutAfterActive = function(layoutgroup, activeLayout) {
            if (LOGGING) console.log("_getLayoutAfterActive");
            if (activeLayout == null) {
                var layouts = pcd.$(layoutgroup[0]).children(".layout-body").children(".content-layout-group");
                if (layouts.length == 0) layouts = pcd.$(layoutgroup[0]).children(".layout-body").children(
                    ".content").children(".content-layout-group");
                activeLayout = pcd.$(layouts.children('.active')[0]);
            }
            var afterLayout = activeLayout.next('.layout');
            /*if (IS_CIRCULAR) {
                if (beforeLayout.length == 0)
                    beforeLayout = layoutgroup.children(".layout:last");
                if (afterLayout.length == 0)
                    afterLayout = layoutgroup.children(".layout:first");
            }*/
            while (afterLayout.css('display') == 'none') afterLayout = afterLayout.next('.layout');
            return afterLayout;
        },
        // Handle for touch start
        _swipeLayoutStart = function(layoutBody, e) {
            if (LOGGING) console.log("_swipeLayoutStart");
            var layoutgroup = layoutBody.parent().parent();
            // In the middle of a swipe already or Menu is opened - just return false - no bubble up
            if (!_isSwipeAllowed(layoutgroup)) return false;
            // if  - swipe is not allowed - bubble up so that vertical scrolling is allowed.
            if (layoutgroup.hasClass('layout-group-nav-open') || (e && e.target && e.target.type == "range")) return true;
            // type of layout group we're in
            var lgType = _getLayoutGroupType(layoutgroup),
                isMenu = 'menu' == lgType,
                isTab = 'tab' == lgType;
            // if - we are not in "swipeable" type of LG bubble up so that vertical scrolling is allowed.
            if (!isMenu && !isTab) return true;
            if (e.originalEvent.touches && e.originalEvent.touches[0]) {
                startClientX = e.originalEvent.touches[0].pageX;
                startClientY = e.originalEvent.touches[0].pageY;
            } else {
                startClientX = e.originalEvent.pageX;
                startClientY = e.originalEvent.pageY;
            }
            /* TODO : Need to comment, because performance is effected by reflow */
            _initializeSwipeIndicators(layoutgroup.parent().parent(), startClientY);
            windowSize = layoutBody.width();
            xDisplacementPrev = 0;
            startSwipeTimeInMs = prevSwipeTimeInMs = Date.now();
            beforeLayoutBodyHeight = 0;
            afterLayoutBodyHeight = 0;
            swipeVelocity = 0;
            nextLayoutDirection = FIRST_MOVE;
            nextLayoutBodyIn = null;
            layoutBodyHeight = layoutBody.outerHeight();
            var layout = layoutBody.parent();
            headerHeight = layoutgroup.outerHeight();
            withinScrollBox = true;
            // Find the before and after layout
            afterLayout = _getLayoutAfterActive(layoutgroup, layout);
            beforeLayout = _getLayoutBeforeActive(layoutgroup, layout);
            beforeLayoutBodyIn = beforeLayout.children(".layout-body");
            afterLayoutBodyIn = afterLayout.children(".layout-body");
            // Create space for body when transform is active
            layoutgroup.css("margin-bottom", layoutBodyHeight);
            // Override CSS margins before calculating transform or adding swipe-enabled
            layoutBody.css("margin-top", 0);
            beforeLayoutBodyIn.css("margin-top", 0);
            afterLayoutBodyIn.css("margin-top", 0);
            // Calculate top for transform when not a nested layout group
            var actualTop = layoutBody.offset().top - layoutgroup.offset().top;
            layoutBody.css("top", actualTop);
            beforeLayoutBodyIn.css("top", actualTop);
            afterLayoutBodyIn.css("top", actualTop);
            layoutgroup.addClass('swipe-enabled');
            // Don't show part of layouts that extends beyond the layout window
            layoutgroup.parent().css('overflow-x', 'hidden');
            _showLayoutPagination(layoutgroup);
            _enableSwipeListener(layoutBody);
            return true; // bubble up for vertical scroll
        },
        // Swipe move event handler
        _swipeLayoutMove = function(layoutBody, e) {
            if (LOGGING) console.log("_swipeLayoutMove");
            // Get cursor displacement from its position at _swipeLayoutStart
            var touchPosition = _getTouchPoint(e),
                xDisplacement = touchPosition.X - startClientX,
                yDisplacement = touchPosition.Y - startClientY,
                layoutgroup = layoutBody.parent().parent();
            // detection of vertical swipe
            if (withinScrollBox) {
                if (Math.abs(yDisplacement) > SCROLL_BOX_RADIUS && Math.abs(yDisplacement) > Math.abs(xDisplacement)) {
                    // vertical swipe - cancel the default behavior
                    _swipeCancel(layoutgroup, layoutBody);
                    window.setTimeout(_queueDestroySwipeIndicators, 1000, layoutgroup.parent().parent());
                    return true;
                } else if (Math.abs(xDisplacement) > SCROLL_BOX_RADIUS && Math.abs(xDisplacement) > Math.abs(
                        yDisplacement)) {
                    // horizontal swipe - continue the default behavior
                    withinScrollBox = false;
                }
            }
            // Get swipe velocity at time of release
            // Value truncated to the nearest int
            var currentSwipeTimeInMs = Date.now();
            swipeVelocity = (xDisplacement - xDisplacementPrev) * 1000 / (currentSwipeTimeInMs - prevSwipeTimeInMs) |
                0; // %/s
            // true iff we change which layout is visible
            var switchNext;
            if (xDisplacement < 0) {
                nextLayoutBodyIn = afterLayoutBodyIn;
                hiddenLayoutBodyIn = beforeLayoutBodyIn;
                switchNext = nextLayoutDirection != RIGHT;
                nextLayoutDirection = RIGHT;
            } else {
                nextLayoutBodyIn = beforeLayoutBodyIn;
                hiddenLayoutBodyIn = afterLayoutBodyIn;
                switchNext = nextLayoutDirection != LEFT;
                nextLayoutDirection = LEFT;
            }
            if (switchNext) {
                // make next layout active and adjust the layout group height accordingly
                if (nextLayoutBodyIn.length != 0) {
                    nextLayoutBodyIn.parent().addClass('active no-highlight');
                    var nextLayoutInBodyHeight = 0;
                    if (nextLayoutDirection == RIGHT) {
                        if (afterLayoutBodyHeight == 0) afterLayoutBodyHeight = nextLayoutBodyIn.outerHeight();
                        nextLayoutInBodyHeight = afterLayoutBodyHeight;
                    } else {
                        if (beforeLayoutBodyHeight == 0) beforeLayoutBodyHeight = nextLayoutBodyIn.outerHeight();
                        nextLayoutInBodyHeight = beforeLayoutBodyHeight;
                    }
                    layoutgroup.css("margin-bottom", Math.max(layoutBodyHeight, nextLayoutInBodyHeight));
                }
                // Undo all changes made while hidden layout was active
                if (hiddenLayoutBodyIn.length != 0) {
                    hiddenLayoutBodyIn.parent().removeClass('active no-highlight');
                    hiddenLayoutBodyIn.css(TRANSFORM_PROP, '');
                }
            }
            // Remember this event
            xDisplacementPrev = xDisplacement;
            prevSwipeTimeInMs = currentSwipeTimeInMs;
            // Position current and next layouts
            _transformLayouts(layoutBody);
            return false;
        },
        // May be called at the end of a swipe if _swipeCancel isn't called.
        _swipeLayoutEnd = function(layoutBody, e) {
            if (LOGGING) console.log("_swipeLayoutEnd");
            var layoutgroup = layoutBody.parent().parent();
            if (nextLayoutBodyIn === null || withinScrollBox) {
                _swipeCancel(layoutgroup, layoutBody);
                _queueDestroySwipeIndicators(layoutgroup.parent().parent());
                return true;
            }
            window.setTimeout(_queueDestroySwipeIndicators, 500, layoutgroup.parent().parent());
            // Distance the body is actually scrolled
            var percentDistance = Math.abs(100 * xDisplacementPrev / windowSize);
            // If there is no next layout, never move to it
            if (nextLayoutBodyIn.length == 0) {
                // Since we're scrolling off the edge, use _resistanceFactor to get the actual scroll distance instead of the pointer distance
                percentDistance = _resistanceFactor(percentDistance);
                swipeNextLayout = false;
            }
            // If swiping quickly to the next layout, move to it
            else if (xDisplacementPrev > 0 && swipeVelocity > FAST_SWIPE_SPEED) {
                swipeNextLayout = true;
            } else if (xDisplacementPrev < 0 && swipeVelocity < -FAST_SWIPE_SPEED) {
                swipeNextLayout = true;
            }
            // If swiped more than 50%, move to the next one
            else if (percentDistance >= IDLE_SWIPE_PERCENT) {
                swipeNextLayout = true;
            } else swipeNextLayout = false;
            var TRANSLATE_CENTER = "translate3d(0%,0,0)",
                TRANSLATE_LEFT = "translate3d(-100%,0,0)",
                TRANSLATE_RIGHT = "translate3d(100%,0,0)",
                translateLayout,
                translateNextLayout;
            // Determine direction to transition current and next layout
            if (swipeNextLayout) {
                nextLayoutBodyIn.parent().addClass('active no-highlight');
                // Transition next layout to center and current layout to the side
                if (xDisplacementPrev < 0) {
                    translateLayout = TRANSLATE_LEFT;
                    translateNextLayout = TRANSLATE_CENTER;
                } else {
                    translateLayout = TRANSLATE_RIGHT;
                    translateNextLayout = TRANSLATE_CENTER;
                }
            } else {
                // Transition current layout to center and next layout to the side
                if (xDisplacementPrev < 0) {
                    translateLayout = TRANSLATE_CENTER;
                    translateNextLayout = TRANSLATE_RIGHT;
                } else {
                    translateLayout = TRANSLATE_CENTER;
                    translateNextLayout = TRANSLATE_LEFT;
                }
            }
            // Determine transition time based on distance
            var transitionDistance = swipeNextLayout ? Math.abs(100 - percentDistance) : percentDistance,
                // %
                transitionTime = swipeNextLayout ? transitionDistance / SLIDE_SPEED : 100 / SLIDE_SPEED; // s
            // Remove inline styles and set selected element as active
            if (transitionTime > 0) {
                var coordinates = _transitionCoordinates(Math.abs(windowSize - Math.abs(xDisplacementPrev)),
                        transitionTime, Math.max(Math.abs(swipeVelocity), 800)),
                    transitionFunction = 'cubic-bezier(' + coordinates.X1 + ', ' + coordinates.Y1 + ', ' +
                    coordinates.X2 + ', ' + coordinates.Y2 + ')',
                    transitionValue = TRANSFORM_PROP + ' ' + transitionTime + 's ' + transitionFunction;
                if (LOGGING) console.log(transitionValue);
                // Transition to selected element
                // These inline styles will be removed by _transitionEndEvent
                layoutBody.css(TRANSITION_PROP, transitionValue);
                layoutBody.css(TRANSFORM_PROP, translateLayout);
                nextLayoutBodyIn.css(TRANSITION_PROP, transitionValue);
                nextLayoutBodyIn.css(TRANSFORM_PROP, translateNextLayout);
                layoutBody.on('transitionend webkitTransitionEnd', function(e) {
                    layoutBody.css(TRANSITION_PROP, '');
                    layoutBody.css(TRANSFORM_PROP, '');
                    nextLayoutBodyIn.css(TRANSITION_PROP, '');
                    nextLayoutBodyIn.css(TRANSFORM_PROP, '');
                    _transitionEnd(layoutBody);
                    layoutBody.off('transitionend webkitTransitionEnd');
                });
            } else _transitionEnd(layoutBody);
            _disableSwipeListener(layoutBody);
            return !_hasBeenSwiped();
        },
        /*
         * Return the percent displacement we should actually use when dragging
         * "off the edge", based on the percent displacement of the drag cursor.
         *
         * This function y(x) will follow these criteria:
         *     y(0) = 0
         *     y'(0) = 1
         *     y'(x) > 0 for x > 0
         *     y''(x) < 0 for x > 0
         *     y(-x) = -y(x)
         * This way, swiping off edge has diminishing returns, but y and y' are
         * continuous with a normal swipe (where y = x).
         *
         * @param percentDisplaced: The cursor's displacement, from the point the swipe
         *                          started at, along the same direction as the swipe.
         */
        _resistanceFactor = function(percentDisplaced) {
            var F = 25; // affects how close to linear this function is
            var B = Math.log(F);
            var x = Math.abs(percentDisplaced);
            var y = F * (Math.log(F + x) - B); // y'(x) = F / (F + x)
            var sign = percentDisplaced > 0 ? 1 : -1; // Math.sign(percentDisplaced)
            return sign * y;
        },
        /*
         * Returns the coordinates for a 3D bezier curve as an object { X1, Y1, X2, Y2 }
         * such that the initial speed matches the user's swipe speed.
         * In CSS, this could be used to make the transition function 'cubic-bezier(X1, Y1, X2, Y2)'.
         * @param d: The pixel distance the selected layout will travel
         * @param t: The time in seconds the selected layout will travel
         * @param v: The current speed in pixels/second the selected layout is being dragged at.
         *           Positive values point towards the final position the layout will be in when the animation finishes.
         */
        _transitionCoordinates = function(d, t, v) {
            // Get first Bezier coordinate (T1, D1) such that the slope from (0, 0) to (T1, D1) is v.
            // T1 and D1 are in fractional units of t and d respectively (e.g., (1, 1) == (t, d)).
            var N = 0.3; // first coordinate normal
            var VT = 1 / t; // percent time of 1 second
            var VD = v / d; // percent distance per second
            var VH = Math.sqrt(VD * VD + VT * VT); // absolute value of position (VD, VT)
            var C = N / VH; // conversion factor to normalize VD, VT
            var T1 = VT * C;
            var D1 = VD * C;
            var T2 = 0.5;
            var D2 = 0.95;
            return {
                X1: T1,
                Y1: D1,
                X2: T2,
                Y2: D2
            };
        }, _transitionEnd = function(layoutBody) {
            if (LOGGING) console.log("_transitionEnd");
            var layout = layoutBody.parent(),
                nextLayout = nextLayoutBodyIn.parent();
            if (swipeNextLayout) {
                layout.removeClass('active');
                _makeLayoutActive(layout.parent(), nextLayoutBodyIn.parent().children('.header'));
                var $lg = layout.parent(),
                    locTop = $lg[0].getBoundingClientRect().top,
                    sl = pcd.$(".screen-layout-region-header");
                if (sl.length > 0 && locTop < sl.height()) {
                    $lg[0].scrollIntoView();
                } else if (sl.length <= 0 && locTop < 0) {
                    $lg[0].scrollIntoView();
                }
            } else nextLayout.removeClass('active');
            nextLayout.removeClass('no-highlight');
            layoutBody.css("margin-top", '');
            beforeLayoutBodyIn.css("margin-top", '');
            afterLayoutBodyIn.css("margin-top", '');
            var layoutgroup = layout.parent();
            if (layoutgroup.hasClass('swipe-enabled')) {
                layoutgroup.removeClass('swipe-enabled');
                layoutgroup.css("margin-bottom", "");
                _removeLayoutPagination(layoutgroup);
                windowSize = 0; // Another swipe gesture is now allowed
            }
        },
        // Given the content-layout-group DIV, this function returns its layout group type.
        // The layout group types are 'accordion', 'menu', 'stacked', and 'tab'.
        _getLayoutGroupType = function(layoutgroup) {
            if (layoutgroup && layoutgroup.length == 0) return "tab"; // default it is tab case when selecting from menu
            if (layoutgroup[0]) {
                if (LOGGING) console.log("_getLayoutGroupType");
                var type = layoutgroup[0].getAttribute("data-lg-type");
                if (type) return type;
                // Content value on :after is set to the layout group type by the skin
                type = window.getComputedStyle(layoutgroup[0], ":after").getPropertyValue("content");
                // Some browsers put quotes around the type. Remove them for consistency
                if (type.length >= 2) {
                    var firstChar = type.charAt(0),
                        lastChar = type.charAt(type.length - 1);
                    if (firstChar == '"' && lastChar == '"' || firstChar == "'" && lastChar == "'") {
                        type = type.substring(1, type.length - 1);
                    }
                }
                layoutgroup[0].setAttribute("data-lg-type", type);
                return type;
            }
        },
        _isMultiExpandAccordion = function(layoutgroup) {
            if (layoutgroup[0]) {
              // Content value on :before is set to multiaccordion for multiexpand accordion layouts in the skin
              var accordionType = window.getComputedStyle(layoutgroup[0], ":before").getPropertyValue("content");
              // Some browsers put quotes around the type. Remove them for consistency
              if (accordionType.length >= 2) {
                var firstChar = accordionType.charAt(0),
                    lastChar = accordionType.charAt(accordionType.length - 1);
                if (firstChar == '"' && lastChar == '"' || firstChar == "'" && lastChar == "'") {
                  accordionType = accordionType.substring(1, accordionType.length - 1);
                }
              }
              if(accordionType === 'multiaccordion'){
                return true;
              }
            }
            return false;
        },
        _toggleAriaExpanded = function(selectedHeader) {
            var selectedbtn = selectedHeader.children('.layout-group-item-title').children();
            selectedbtn.attr('aria-expanded',selectedbtn.attr('aria-expanded')==='true'?'false':'true');    
        },
        // Applies a transform to layoutBody and nextLayoutBodyIn based on the previous mouse position stored in xDisplacementPrev.
        _transformLayouts = function(layoutBody) {
            // Amount swiped across the screen, where 0 is no displacement, -100 is completely displaced to the left, and 100 to the right
            var percentDisplaced = 100 * xDisplacementPrev / windowSize,
                // If there is no next layout, add resistance to swipe.
                nextLayoutTranslate = '';
            if (nextLayoutBodyIn.length == 0) {
                percentDisplaced = _resistanceFactor(percentDisplaced);
            }
            // Move next layout with mouse, if there is one
            else {
                // Position it next to current layout
                if (nextLayoutDirection == RIGHT) {
                    nextLayoutTranslate = percentDisplaced + 100;
                } else {
                    nextLayoutTranslate = percentDisplaced - 100;
                }
                // Move next layout with mouse
                nextLayoutBodyIn.css(TRANSFORM_PROP, 'translate3d(' + nextLayoutTranslate + '%,0,0)');
            }
            // Move current layout with mouse
            layoutBody.css(TRANSFORM_PROP, 'translate3d(' + percentDisplaced + '%,0,0)');
        }, _getTouchPoint = function(e) {
            var xPos, yPos;
            if (e.originalEvent.touches && e.originalEvent.touches[0]) {
                xPos = e.originalEvent.touches[0].pageX;
                yPos = e.originalEvent.touches[0].pageY;
            } else {
                xPos = e.originalEvent.pageX;
                yPos = e.originalEvent.pageY;
            }
            return {
                X: xPos,
                Y: yPos
            };
        }, _pointIsInElement = function(point, element) {
            var xPos = point.X,
                yPos = point.Y,
                box = element.getBoundingClientRect();
            return box.left < xPos && xPos < box.right && box.top < yPos && yPos < box.bottom;
        },
        /*
         @protected will slide the tab headings just enough to bring the selected header into full view
         @param $Object$layoutgroup   - DOM top level layout group element
         @param $Object$selectedHeader    - DOM top level of the selected header
         @return $void$
        */
        _slideEnoughToBringSelectedHeaderIntoFullView = function(layoutgroup, selectedHeader, isFromLGTreatment) {
            var type = _getLayoutGroupType(layoutgroup);
            if (type != "tab" || _toDisableSlideOnTabsClick(layoutgroup)) return;
            if(type === "tab" && layoutgroup.attr("data-header-scrollable") === "true") return;
            var $leftTabNavControls = layoutgroup.find(".left-tab-nav-controls"),
                $rightTabNavControls = layoutgroup.find(".right-tab-nav-controls"),
                $leftArrow = layoutgroup.find(".tab-arrow.left-arrow");
            //$rightArrow = layoutgroup.find(".tab-arrow.right-arrow");
            /*begin HELPERS*/
            var __isSelectedHeaderBetweenTheTwoArrows, __isSelectedHeaderCoveredByLeftArrow,
                __computeDeltaFromLeftArrow, __computeDeltaFromRightArrow;

            function __L($el) {
                /*__helper_getLeftOffsetFromParent including margin-left*/
                return (($el && parseInt($el.css("margin-left"))) || 0) + ($el ? $el.position().left : 0);
            }
            if (!$leftArrow.is(":visible")) /*we check that the left and right arrows are visible, only then, do we need to bring the half shown tab into full view*/ {
                /*mobile case = where < and > arrow buttons are not in dom and only the right side tab headings [dropdown?]menu exists*/
                __isSelectedHeaderBetweenTheTwoArrows = function() {
                    return __L(selectedHeader) >= 0 && __L(selectedHeader) + selectedHeader.outerWidth() <=
                        $rightTabNavControls.position().left;
                };
                __isSelectedHeaderCoveredByLeftArrow = function() {
                    return __L(selectedHeader) < 0;
                };
                /* not used */
                /*
                               __isSelectedHeaderCoveredByRightArrow = function() {
                                   return __L(selectedHeader) + selectedHeader.outerWidth() > $rightTabNavControls.position().left;
                               };
                               */
                __computeDeltaFromLeftArrow = function() {
                    return 0 - __L(selectedHeader);
                };
                __computeDeltaFromRightArrow = function() {
                    return __L(selectedHeader) + selectedHeader.outerWidth(true) - $rightTabNavControls.position()
                        .left;
                };
            } else {
                /*desktop case = where < and > arrow buttons and tab headings [dropdown?]menu exist*/
                __isSelectedHeaderBetweenTheTwoArrows = function() {
                    return __L(selectedHeader) >= $leftTabNavControls.position().left + $leftTabNavControls.outerWidth(
                            true) && __L(selectedHeader) + selectedHeader.outerWidth() <= $rightTabNavControls.position()
                        .left;
                };
                __isSelectedHeaderCoveredByLeftArrow = function() {
                    return __L(selectedHeader) < $leftTabNavControls.position().left + $leftTabNavControls.outerWidth(
                        true);
                };
                __computeDeltaFromLeftArrow = function() {
                    return $leftTabNavControls.position().left + $leftTabNavControls.outerWidth(true) - __L(
                        selectedHeader);
                };
                __computeDeltaFromRightArrow = function() {
                    return __L(selectedHeader) + selectedHeader.outerWidth(true) - $rightTabNavControls.position()
                        .left;
                };
            }
            /*end HELPERS*/
            if (__isSelectedHeaderBetweenTheTwoArrows()) return; /*the selected header is already in full view, nothing to do in this case*/
            else {
                var headerSelector = layoutgroup && layoutgroup[0] && layoutgroup[0].hasAttribute("data-role") ?  "[data-role='tab']" : "[role='tab']" ;
                var $LGFirstTabHeadingRef = layoutgroup.find(headerSelector+":first"),
                    deltaDistanceToShiftTabsBy = 0,
                    /* currentMargin = parseInt($LGFirstTabHeadingRef.css("margin-left")) || 0, */
                    /* anyways overridden with matrix value */
                    newMargin = 0;
                var $LGRef = layoutgroup.closest(".content-layout-group");
                var matrix = $LGFirstTabHeadingRef.css('transform').split(/[()]/)[1];
                var translateXValue = 0;
                if (matrix) {
                    translateXValue = matrix.split(',')[4];
                }
                var currentMargin = parseInt(translateXValue) || 0;
                if (__isSelectedHeaderCoveredByLeftArrow()) {
                    deltaDistanceToShiftTabsBy = __computeDeltaFromLeftArrow();
                    /*console.info("should move right by ",deltaDistanceToShiftTabsBy);*/
                    //$rightTabNavControls.find(".right-arrow").css("opacity", "1");
                    $rightTabNavControls.find(".right-arrow").removeClass("tab-arrow-inactive");
                    newMargin = currentMargin + deltaDistanceToShiftTabsBy;
                } else {
                    /* implicitly we mean : if(__isSelectedHeaderCoveredByRightArrow())*/
                    deltaDistanceToShiftTabsBy = __computeDeltaFromRightArrow();
                    /*console.info("should move left by ",deltaDistanceToShiftTabsBy);*/
                    //$leftTabNavControls.css("opacity", "1");
                    $leftTabNavControls.removeClass("tab-arrow-inactive");
                    newMargin = currentMargin - deltaDistanceToShiftTabsBy;
                }
                if (selectedHeader && !selectedHeader.parent().next().attr("data-lg-child-id")) $rightTabNavControls
                    .find(".right-arrow").addClass("tab-arrow-inactive");
                var $nLg = pcd.$(layoutgroup);
                var activeTab = _getActiveTabElement($nLg);
                if (!isFromLGTreatment) {
                    var topCalculateBeforeScroll = layoutgroup.attr("data-topCalculateBeforeScroll");
                    if (topCalculateBeforeScroll && topCalculateBeforeScroll != 0) {
                        _setSectionTransitionAttribute(activeTab, $nLg, "fromMenu");
                    }
                    // commented as it is creating problem in height calculations
                    //marginBeforeResize = newMargin;
                    layoutgroup.attr("data-marginBeforeResize", newMargin);
                    //$LGFirstTabHeadingRef.css("margin-left", newMargin + "px");
                    var dataLgId = $LGRef.attr("data-lg-id");
                    $LGRef.find(headerSelector+"div.header").each(function() {
                        var $nThat = pcd.$(this);
                        if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                        var thisObj = $nThat && $nThat[0] ? $nThat[0] : "";
                        if (thisObj && !thisObj.classList.contains("lg-transition-all-linear")) {
                            thisObj.classList.add("lg-transition-all-linear");
                            thisObj.classList.remove("lg-transition-ml-linear", "lg-transition-all-ease-out",
                                "lg-transition-none");
                        }
                        $nThat.css({
                            // "transition": "all 0.3s linear",
                            "transform": "translateX(" + newMargin + "px)"
                        });
                    });
                    if (topCalculateBeforeScroll && topCalculateBeforeScroll != 0) _resetSectionTransitionAttribute(
                        activeTab, $nLg, currentMarginForSection, currentTabHeight, $rightTabNavControls,
                        $LGFirstTabHeadingRef);
                }
            }
        },
        /*
         @protected will update the layout height based on the currently loaded tab content height <we need to do this, because of position: absolute on TabLG|div[role='tablist']>
         @param $Object$layoutgroup    - DOM layout group element
         @return $void$
        */
        _updateLayoutHeight = function(layoutgroup, selectedHeader, nestedLG, fromDOMLoad) {
            if (selectedHeader) {
                var activeSection = selectedHeader.attr("data-semantic-tab") === "true" ? layoutgroup.find("#" + selectedHeader.attr("aria-controls")) : selectedHeader.next();
                var nestedLayout = activeSection.find(".tab-overflow").length != 0 && (activeSection
                    .find(".tab-overflow").length == 1 && _getLayoutGroupType(activeSection.find(
                        ".tab-overflow").children()) == 'tab' || activeSection.find(".tab-overflow").length >
                    1 && _getLayoutGroupType([activeSection.find(".tab-overflow")[0]]) == 'tab');
                /* BUG-290587 height calculation in case of Nested Layout-Group */
                if (nestedLayout && fromDOMLoad == "undefined") {
                    var hg = activeSection.find(".layout-body:visible").outerHeight(true) + selectedHeader.outerHeight(
                        true);
                    activeSection.height(hg);
                    layoutgroup.parent().height(activeSection.outerHeight(true) + selectedHeader.outerHeight(
                        true));
                } else {
                    /* var errorhHeight = 0;
                     height calculation in case of error - need to refine logic
                    $('.errorText').each(function () {
                    errorhHeight += $(this).height();
                    }); */
                    layoutgroup.parent().height(activeSection.outerHeight(true) + selectedHeader.outerHeight(
                        true));
                }
            } else {
                if (nestedLG) {
                    var $nLg = pcd.$(layoutgroup);
                    var activeTab = _getActiveTabElement($nLg);
                    var activeSection = activeTab.attr("data-semantic-tab") === "true" ? layoutgroup.find("#" + activeTab.attr("aria-controls")) : activeTab.next();
                    layoutgroup.parent().height(activeSection.next().outerHeight(true) + activeTab.outerHeight(true));
                } else layoutgroup.parent().height((layoutgroup.initialOnLoadHeight || 0) + parseInt(layoutgroup.height()));
            }
            /* BUG-268549 */
            var layoutWidth = layoutgroup.width();
            var lgParentPosition = layoutgroup.parent().css("position");
            if (!!(layoutgroup && layoutgroup[0] && (layoutgroup[0].offsetWidth || layoutgroup[0].offsetHeight)) &&
                !layoutWidth && lgParentPosition != "static") {
                layoutgroup.parent().css("position", "static");
                layoutgroup.parent().width(0.97 * parseInt(layoutgroup.width()));
                layoutgroup.parent().css("position", lgParentPosition);
            }
        },
        /*
         @protected will set the active class and set the aria attributes on the selected header and update the menu nav
         @param $Object$layoutgroup   - DOM top level layout group element
         @param $Object$selectedHeader    - DOM top level of the selected header
         @return $void$
        */
        _setLayoutActive = function(layoutgroup, selectedHeader) {
            if (LOGGING) console.log("_setLayoutActive");
            /*US-159143 starts */
            var $nLg = pcd.$(layoutgroup);
            var type = _getLayoutGroupType(layoutgroup);
            var divWrapperLG = $nLg.closest("div[data-lg-id]");
            var tabIndName = divWrapperLG.attr("data-repeat-id");
            var isSemanticTabLayout = selectedHeader.attr("data-semantic-tab") === "true" ? true : false;
            if (!tabIndName) tabIndName = divWrapperLG.attr("data-lg-id");
            var lgType = _getLayoutGroupType(layoutgroup);
            var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + tabIndName, divWrapperLG[0]); /* hidden field element */
            //var lgType = pega.util.Dom.getElementsByName("LGType" + tabIndName, divWrapperLG[0]); /* hidden field element for type*/
            var index = _getIndexForSelectedLG(selectedHeader);
            var isClassActive = true;
            if (tabInd != null && tabInd[0].value != index && type != "stacked") {
                isClassActive = false;
            }
            /* Disabled lg */
            if (selectedHeader.parent('.lg-disabled')[0]) {
                selectedHeader.attr('tabindex', '-1');
                if(lgType === 'tab' || selectedHeader[0].getAttribute("role") === 'tab'){
                  selectedHeader.attr('aria-selected', 'false');
                } else if(lgType === 'accordion') {
                  selectedHeader.find(".accordion-btn").attr('aria-expanded', 'false');
                }
            } else {
              if(lgType === 'tab' || selectedHeader[0].getAttribute("role") === 'tab'){
                selectedHeader.attr('tabindex', '0');
                selectedHeader.attr('aria-selected', 'true');
              } else if(lgType === 'accordion'){
                if(_isMultiExpandAccordion(layoutgroup)){
                  _toggleAriaExpanded(selectedHeader);
                } else {
                  selectedHeader.find(".accordion-btn").attr('tabindex', '0');
                  selectedHeader.find(".accordion-btn").attr('aria-expanded', 'true');
                }
              } 
            }
            /*US-159143 ends */
            selectedHeader.parent().addClass('active');
            if(isSemanticTabLayout){
              layoutgroup.find("#" + selectedHeader.attr("aria-controls")).parent().addClass('active');
            }
            /* Dont toggle on first interaction */
            if (selectedHeader.parent().hasClass('multiactive') && selectedHeader.parent('.lg-collapse')[0] &&
                window.getComputedStyle(selectedHeader.parent('.lg-collapse')[0], ":after").getPropertyValue(
                    "content") != "none") {
                selectedHeader.parent('.lg-collapse').removeClass('lg-collapse');
            } else if (selectedHeader.parent('.lg-collapse')[0]) {
                selectedHeader.parent().toggleClass('multiactive');
                selectedHeader.parent('.lg-collapse').removeClass('lg-collapse');
            } else if (selectedHeader.parent().hasClass('lg-collapse') === false) {
                selectedHeader.parent().toggleClass('multiactive');
            }
            //selectedHeader.parent('.lg-collapse').removeClass('lg-collapse'); $Lg.parent('.lg-collapse').removeClass('lg-collapse');
            var groupNavElement = layoutgroup.find('> .layout-group-nav > .layout-group-nav-title');
            if (groupNavElement.length == 1) {
                var selectedTitle = pcd.$(selectedHeader).children('.layout-group-item-title:header').text();
                var prevSiblings = $('<div>').append(pcd.$(selectedHeader).children(
                    '.layout-group-item-title:header').prev().clone()).html();
                if (prevSiblings.indexOf("lg-accordion-numbered") != -1) {
                    prevSiblings = "";
                }
                var nextSiblings = $('<div>').append(pcd.$(selectedHeader).children(
                    '.layout-group-item-title:header').next().clone()).html();
                var iconOpenClose = $('<div>').append(pcd.$(groupNavElement[0]).find("> .icon-openclose").clone()).html();
                /* remove input tags from header */
                if (nextSiblings && typeof nextSiblings === 'string') {
                    nextSiblings = nextSiblings.replace(/<input.+?\/?>/gi, '');
                }
                if (pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
                    selectedTitle = pega.ui.ControlTemplate.crossScriptingFilter(selectedTitle);
                }
                pcd.$(groupNavElement[0]).html(iconOpenClose + prevSiblings + selectedTitle + nextSiblings);
            }
            if (selectedHeader.attr("data-defer") != "true" && selectedHeader.parent().attr("data-refreshOnClick") ==
                "true" && !isClassActive) {
                _refreshWhenActive(layoutgroup, selectedHeader);
            }
            if (selectedHeader.attr("data-defer") == "true") {
                var selectedBody = selectedHeader.next();
                if(isSemanticTabLayout){
                  selectedBody = layoutgroup.find("#" + selectedHeader.attr("aria-controls"));
                }
                var eventObj = null;
                if (typeof event != "undefined") {
                    eventObj = event;
                }
                pega.u.d.loadLayout(selectedHeader[0], eventObj, 'section', selectedBody[0], selectedBody.attr(
                    "data-deferinvoke"));
                selectedHeader.removeAttr("data-defer");
            }
            // Todo: research potential optimization -- _updateStretchTabWidth is smarter about counting hidden children; then this call can be removed.
            _updateStretchTabWidths(selectedHeader.parent());
            if (!_isTouchDevice()) {
                if ((layoutgroup.hasClass("tab-overflow") && !layoutgroup.hasClass("stretch-tabs") || layoutgroup.parent()
                        .hasClass("tab-overflow") && !layoutgroup.hasClass("stretch-tabs")) && window.event &&
                    window.event.type != "touchstart") {
                    //if(layoutgroup.hasClass("tab-overflow") && !layoutgroup.hasClass("stretch-tabs") && (event && event.type != "touchstart")){          
                    _slideEnoughToBringSelectedHeaderIntoFullView(layoutgroup, selectedHeader); /*TabOverflowSpike START*/
                    //_updateLayoutHeight(layoutgroup, selectedHeader);/*TabOverflowSpike END*/
                }
                // BUG-268334 : Added height only in case of tab-overflow class
                if (!layoutgroup.hasClass("stretch-tabs") && type == 'tab' && (layoutgroup.hasClass("tab-overflow") ))
                    _updateLayoutHeight(layoutgroup, selectedHeader);
            }
            if (pega.Mashup) {
                pega.u.d.doHarnessResize();
            }
            /* window resize when "resized" class is found and remove class immediately afterwards */
            //layoutgroup.hasClass("resized") && $(window).resize();
            //layoutgroup.removeClass("resized");
            //BUG-373803: Calling grid APIs to adjust the grid for the selected layout in layout group
            if (window.Grids && pega.ctx.Grid) window.Grids.adjustVisibleGrids(selectedHeader.parent()[0]);
        },
        /* US-159143 Refresh active when starts*/
        _refreshWhenActive = function(layoutgroup, selectedHeader) {
            var sections = null;
            var layouts2refresh = null;
            var isSemanticTabLayout = selectedHeader.attr("data-semantic-tab") === "true" ? true : false;
            if (selectedHeader.parent().attr('string_type') == "sub_section") {
                /* BUG-293475 only the first children-div is required */
                
                sections = selectedHeader.next().children().first();
                if(isSemanticTabLayout){
                  sections = layoutgroup.find("#" + selectedHeader.attr("aria-controls")).children().first();
                }
                
                pega.u.d.reloadSection(sections[0], '', '', false, true, '-1', false);
            } else {
                sections = layoutgroup.closest('.sectionDivStyle');
                /* BUG-293475 only the first children-div is required */
                layouts2refresh = selectedHeader.next().children().first();
                if(isSemanticTabLayout){
                  layouts2refresh = layoutgroup.find("#" + selectedHeader.attr("aria-controls")).children().first();
                }
                pega.u.d.reloadSections('', sections, '', '', null, null, undefined, undefined, undefined,
                    layouts2refresh);
            }
        },
        /* US-159143 Refresh active when ends*/
        /*
         @protected will remove the active class and change the aria attribute on the header
         @param $Object$inactiveLayout    - DOM top level layout group element
         @return $void$
        */
        _setLayoutInactive = function(inactiveLayout) {
            if(inactiveLayout && inactiveLayout.length !== 0){
              var LGType = inactiveLayout[0].parentElement.getAttribute("data-lg-type");
              inactiveLayout.removeClass('active').children('.layout-body').css("margin-top", "");
              if(LGType === "tab" || (inactiveLayout.children('.header').length && inactiveLayout.children('.header')[0].getAttribute("role") === 'tab') ){
                inactiveLayout.children('.header').attr('aria-selected', 'false');
                inactiveLayout.children('.header').attr('tabindex', '-1');
              }
              else if(LGType === "accordion") {inactiveLayout.find(".accordion-btn").attr('aria-expanded', 'false'); }
              // This will close all the overlays opened in inactive tab BUG-576371
              pega.ui.EventsEmitter.publishSync("onUnloadOverlayClose", {inactiveTab: inactiveLayout[0], layoutBody: inactiveLayout.children('.layout-body')[0]});
           }
        },
        /*
         @protected select the layout on click - set the active class on the selected header
         @param $Object$layoutgroup   - DOM top level layout group element
         @param $Object$selectedHeader    - DOM top level of the selected header
         @return $void$
        */
        _makeLayoutActive = function(layoutgroup, selectedHeader, currentActiveLayout) {
            if (LOGGING) console.log("_makeLayoutActive");
            //_queueDestroySwipeIndicators(layoutgroup);
            /* If the menu is opened and then we switch to a different type- need to remove the margin-top and remove the class */
            if (layoutgroup.hasClass('layout-group-nav-open') && layoutgroup.children('.layout-group-nav').css(
                    "display") == "none") {
                layoutgroup.toggleClass('layout-group-nav-open');
                layoutgroup.children('.layout').removeClass('selected');
                layoutgroup.find("> .layout > .layout-body").css("margin-top", "");
            }
            if (!currentActiveLayout && !_isMultiExpandAccordion(layoutgroup)) {
               _setLayoutInactive(layoutgroup.children(".layout.active"));
                if(selectedHeader.attr("data-semantic-tab")==="true"){
                  _setLayoutInactive(layoutgroup.children(".layout-header").children(".layout.active"));
                }
            }
            _setLayoutActive(layoutgroup, selectedHeader);
            /* call for setting current state of open layout group tabs to hidden field*/
            _setHiddenField(layoutgroup, selectedHeader);
            // Change the selector for the layout pagination during transition
            var groupSelector = layoutgroup.children(" .layout-group-selector");
            if (groupSelector.length != 0) {
                var layouts = layoutgroup.children('.layout'),
                    index = layouts.index(selectedHeader.parent()),
                    currentIconSelector = groupSelector.children(".icon-selector.active");
                currentIconSelector.removeClass('active');
                var selectors = groupSelector.children(".icon-selector");
                if (selectors.length >= index && selectors[index]) {
                    pcd.$(selectors[index]).addClass('active');
                }
            }
            if (layoutgroup.hasClass('layout-group-nav-open')) {
                _showHideMenu(layoutgroup);
            }
        },
        /* Used to set hidden field for maintaining current open state */
        _setHiddenField = function(layoutgroup, selectedHeader) {
            var type = _getLayoutGroupType(layoutgroup);
            var $nLg = pcd.$(layoutgroup);
            var divWrapperLG = $nLg.closest("div[data-lg-id]");
            var tabIndName = divWrapperLG.attr("data-repeat-id");
            if (!tabIndName) tabIndName = divWrapperLG.attr("data-lg-id");
            var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + tabIndName, divWrapperLG[0]); /* hidden field element */
            var lgType = pega.util.Dom.getElementsByName("LGType" + tabIndName, divWrapperLG[0]); /* hidden field element for type*/
            var index = _getIndexForSelectedLG(selectedHeader); /* index will be number and if layout type is multi accordion, number will be comma seperated 1,2,3 */
            if (type == "accordion") {
                index = _getIndexForOpenAccordians(layoutgroup);
            }
            if (tabInd != null) tabInd[0].value = index;
            if (lgType != null) lgType[0].value = type;
        },
        /* Used to get open tabs indexes for multi selected accordion */
        _getIndexForOpenAccordians = function(layoutgroup) {
            /*var selectedLayout = layoutgroup.children(".layout.multiactive");*/
            var selectedLayout = layoutgroup.find(".layout .layout-body:visible");
            var $nLg = pcd.$(layoutgroup);
            var dataLgId = $nLg.attr("data-repeat-id");
            if (!dataLgId) dataLgId = $nLg.parent().attr("data-repeat-id");
            if (!dataLgId) {
                dataLgId = $nLg.attr("data-lg-id");
                if (!dataLgId) dataLgId = $nLg.parent().attr("data-lg-id");
            }
            var arrIndex = [];
            selectedLayout.each(function() {
                var $nThat = pcd.$(this);
                if (($nThat.parents("[data-repeat-id]").length > 0 && pcd.$($nThat.parents(
                        "[data-repeat-id]")[0]).attr("data-repeat-id") == dataLgId && $nThat.closest(
                        "span.header-element").length == 0) || ($nThat.parents("[data-lg-id]").length > 0 &&
                        pcd.$($nThat.parents("[data-lg-id]")[0]).attr("data-lg-id") == dataLgId && $nThat.closest(
                            "span.header-element").length == 0)) {
                    if (arrIndex.indexOf(_getIndexForSelectedLG($nThat.parent())) == -1) {
                        arrIndex.push(_getIndexForSelectedLG($nThat.parent()));
                    }
                }
            });
            return arrIndex.join();
        },
        /* Used to get index from attr from child div */
        _getIndexForSelectedLG = function(obj) {
            /*return ($(obj).closest("div.layout").prevAll().length != -1) ? $(obj).closest("div.layout").prevAll().length : 1;*/
            return pcd.$(obj).closest("div[data-lg-child-id]").attr("data-lg-child-id") != undefined ? pcd.$(obj).closest(
                "div[data-lg-child-id]").attr("data-lg-child-id") : 1;
        },
        /*
         @protected select the layout - used when navigation menu is opened and keys are entered to navigate top/down - this is used to show a different style than the active style
         @param $Object$layoutgroup   - DOM top level layout group element
         @param $Object$selectedHeader    - DOM top level of the selected header
         @return $void$
        */
        _makeLayoutSelected = function(layoutgroup, selectedHeader) {
            layoutgroup.children('.layout').removeClass('selected');
            var listHeaders = layoutgroup.find('> .layout > .header');
            listHeaders.attr('tabindex', '-1');
            listHeaders.attr('aria-selected', 'true');
            selectedHeader.parent().addClass('selected');
            selectedHeader.attr('tabindex', '0');
        },
        /*
         @protected show any menu that is currently opened
         @return $void$
        */
        _hideAllMenus = function() {
            pcd.$(".layout-group-nav-open").each(function(index, element) {
                _showHideMenu(pcd.$(this));
            });
        },
        /*
         @protected show or hide the navigation menu on click
         @param $Object$layoutgroup   - DOM top level layout group element
         @return $void$
        */
        _showHideMenu = function(layoutgroup) {
            if (LOGGING) console.log("_showHideMenu");
            _queueDestroySwipeIndicators(layoutgroup);
            layoutgroup.toggleClass('layout-group-nav-open');
            var selectedLayout = layoutgroup.children(".layout.active");
            var navigationMenu = layoutgroup.find(".layout-group-nav")[0]
            if(navigationMenu) navigationMenu.setAttribute("aria-expanded", navigationMenu.getAttribute("aria-expanded") === "false"? "true":"false");
            if (layoutgroup.hasClass('layout-group-nav-open')) {
                /* Calculate the margin-top */
                var margintop = 0,
                    nextLayout = selectedLayout.next(".layout");
                while (nextLayout.length > 0) {
                    margintop += nextLayout.children(".header").outerHeight();
                    nextLayout = nextLayout.next(".layout");
                }
                selectedLayout.children(".layout-body").css("margin-top", margintop + "px");
            } else {
                selectedLayout.children(".layout-body").css("margin-top", "");
                layoutgroup.children('.layout').removeClass('selected');
            }
        },
        /*
         @protected handle keys to open the navigation menu
         @param $Object$e- keydown event
         @param $Object$layoutgroup   - DOM top level layout group element
         @return $boolean$ return false if the keydown event should not be bubbled up
        */
        _showNavigationMenu = function(e, layoutgroup) {
            if (LOGGING) console.log("_showNavigationMenu");
            /* Show navigation menu when entering enter, space or down arrow */
            if (e.keyCode == KEYBOARD.ENTER || e.keyCode == KEYBOARD.DOWN || e.keyCode == KEYBOARD.SPACE) {
                _showHideMenu(layoutgroup);
                if (layoutgroup.hasClass('layout-group-nav-open')) {
                    var selectedHeader = _getActiveTabElement(layoutgroup);
                    _makeLayoutSelected(layoutgroup, selectedHeader);
                    selectedHeader.focus();
                }
            } else {
                return true; // let the keydown event bubble up for tab key and other keys
            }
            return false;
        },
        /*
         @protected handle keys entered while the navigation menu is opened
         @param $Object$e- keydown event
         @param $Object$headerElement - DOM header element where the keydown event happended
         @return $boolean$ return false if the keydown event should not be bubbled up
        */
        _handleNavigationMenuKeydown = function(e, headerElement) {
            if (LOGGING) console.log("_handleNavigationMenuKeydown");
            var currentLayout, layoutgroup, nextLayout, isAddNewTabActive = false,
                btnAddNewTab;
            if ($(document.activeElement).hasClass("add-new-tab-bg")) {
                btnAddNewTab = $(document.activeElement);
                layoutgroup = btnAddNewTab.parents(".content-layout-group");
                isAddNewTabActive = true;
                //currentLayout = layoutgroup.children(".layout:visible").last();
            } else {
                currentLayout = headerElement.parent();
                layoutgroup = currentLayout.parent();
                btnAddNewTab = layoutgroup.find(".add-new-tab-bg:visible");
            }
            var $activeSelect = ".layout:visible:not(.lg-disabled)";
            var $acLayout = layoutgroup.children($activeSelect);
            var $prevLayout = currentLayout.prevAll($activeSelect);
            var $nextLayout = currentLayout.nextAll($activeSelect);
            var lgType = _getLayoutGroupType(layoutgroup);
            layoutgroup = headerElement.attr("data-semantic-tab")==="true" ? layoutgroup.parent():layoutgroup;                                                    
            if (((lgType !== "accordion" ) && e.keyCode === KEYBOARD.LEFT) || (lgType !== "tab" && e.keyCode === KEYBOARD.UP)) {
                nextLayout = isAddNewTabActive ? $acLayout.last() : $prevLayout.first();
                if (nextLayout.length == 0) nextLayout = btnAddNewTab.length ? btnAddNewTab : $acLayout.last();
            } else if (((lgType !== "accordion" ) && e.keyCode === KEYBOARD.RIGHT) || (lgType !== "tab" && e.keyCode === KEYBOARD.DOWN)) {
                nextLayout = isAddNewTabActive ? $acLayout.first() : $nextLayout.first();
                if (nextLayout.length == 0) nextLayout = btnAddNewTab.length ? btnAddNewTab : $acLayout.first();
            } else if (e.keyCode == KEYBOARD.HOME) {
                nextLayout = isAddNewTabActive ? $acLayout.first() : $prevLayout.last();
                if (nextLayout.length == 0) nextLayout = btnAddNewTab.length ? btnAddNewTab : $acLayout.first();
            } else if (e.keyCode == KEYBOARD.END) {
                nextLayout = isAddNewTabActive ? $acLayout.first() : $nextLayout.last();
                if (nextLayout.length == 0) nextLayout = btnAddNewTab.length ? btnAddNewTab : $acLayout.last();
            } else if (e.keyCode == KEYBOARD.ENTER || e.keyCode == KEYBOARD.ESCAPE || e.keyCode == KEYBOARD.TAB) {
                if (e.keyCode == KEYBOARD.ENTER && isAddNewTabActive) return true;
                if(e.keyCode === KEYBOARD.ENTER && lgType === "accordion") _makeLayoutActive(layoutgroup, headerElement);
                if (layoutgroup.hasClass('layout-group-nav-open')) {
                    if (e.keyCode == KEYBOARD.ENTER) {
                        _makeLayoutActive(layoutgroup, headerElement);
                    } else {
                        _showHideMenu(layoutgroup);
                    }
                    // it is important to set back the focus to the nav menu and not the header otherwise the next keydown event will be on the header.
                    var layoutGroupNav = layoutgroup.children(".layout-group-nav:first");
                    if (layoutGroupNav) layoutGroupNav.focus();
                }
                if (e.keyCode == KEYBOARD.TAB) return true; // bubble up the tab
            } else {
                return true; // let the keydown event bubble up for any other keys
            }
            if (nextLayout) {
                if (nextLayout == btnAddNewTab) {
                    btnAddNewTab[0].focus();
                    return false;
                }
                var selectedHeader = nextLayout.children('.header');
                if(lgType === "tab" || selectedHeader[0].getAttribute("role") === 'tab'){
                  selectedHeader[0].focus({ preventScroll: true });
                } else if(lgType==='accordion'){
                  selectedHeader.find(".accordion-btn")[0].focus();
                }
                else selectedHeader[0].focus();
                if(lgType !=='accordion' || selectedHeader[0].getAttribute('role') === 'tab' ){
                  if (!layoutgroup.hasClass('layout-group-nav-open')) {
                    _makeLayoutActive(layoutgroup, selectedHeader);
                  } else {
                    _makeLayoutSelected(layoutgroup, selectedHeader);
                  }
                }
            }
            return false;
        }, _initializeSwipeIndicators = function(layoutgroup, clientY) {
            if (LOGGING) console.log("_initializeSwipeIndicators");
            if (!_isTouchDevice() || !INDICATOR_ENABLED) return;
            // type of layout group we're in
            var lgType = _getLayoutGroupType(layoutgroup.find(" > > .content-layout-group")),
                isMenu = 'menu' == lgType,
                isTab = 'tab' == lgType;
            // if - we are not in "swipeable" type of LG bubble up so that vertical scrolling is allowed.
            if (!isMenu && !isTab) return true;
            /* BUG-400326 - parmn ; initially each place layoutgroup.children(".layout-body") now replaced with $containerForSwipe, because of optimization layout body div not generating */
            var $containerForSwipe = layoutgroup.children(".layout-body").length > 0 ? layoutgroup.children(
                ".layout-body") : layoutgroup.children();
            layoutgroup = layoutgroup.hasClass("layout-body") ? layoutgroup.parent() : layoutgroup;
            _destroySwipeIndicators(true, layoutgroup);
            var marginTop = $containerForSwipe.css("margin-top");
            marginTop = marginTop.substring(0, marginTop.length - 2);
            var headerHeight = 0;
            if ($containerForSwipe.children(".content-layout-group").length > 0) headerHeight = parseInt(
                $containerForSwipe.children(".content-layout-group").outerHeight()) + parseInt(marginTop) + 8;
            else headerHeight = parseInt($containerForSwipe.children(".content").children(".content-layout-group").outerHeight()) +
                parseInt(marginTop) + 8;
            //var layouts = pcd.$(layoutgroup[0].firstChild.lastChild);
            //activeLayout = layouts.children('.active');
            var $nLg = pcd.$(layoutgroup);
            /* BUG-400326 - parmn ; initially each place layoutgroup.children(".layout-body") now replaced with $containerForSwipe, because of optimization layout body div not generating */
            var $containerForSwipeIndicators = $nLg.children(".layout-body").length > 0 ? $nLg.children(
                ".layout-body") : $nLg.children();
            $containerForSwipeIndicators[0].style["position"] = "relative";
            if (_getLayoutBeforeActive(layoutgroup).length > 0) {
                var leftIndicator = document.createElement('div');
                leftIndicator.className = 'swipe-indicator left-swipe-indicator swipe-indicator-fadein';
                leftIndicator = $containerForSwipeIndicators[0].appendChild(leftIndicator);
                leftIndicator.style["top"] = headerHeight + "px";
                leftIndicator.classList.remove("swipe-indicator-fadein");
            }
            if (_getLayoutAfterActive(layoutgroup).length > 0) {
                var rightIndicator = document.createElement('div');
                rightIndicator.className = 'swipe-indicator right-swipe-indicator swipe-indicator-fadein';
                rightIndicator = $containerForSwipeIndicators[0].appendChild(rightIndicator);
                rightIndicator.style["top"] = headerHeight + "px";
                rightIndicator.classList.remove("swipe-indicator-fadein");
            }
        }, _queueDestroySwipeIndicators = function(layoutgroup) {
            if (LOGGING) console.log("_queueDestroySwipeIndicators");
            if (!INDICATOR_ENABLED) {
                return;
            }
            /* BUG-400326 - parmn ; initially each place layoutgroup.children(".layout-body") now replaced with $containerForSwipe, because of optimization layout body div not generating */
            var $containerForSwipe = layoutgroup.children(".layout-body").length > 0 ? layoutgroup.children(
                ".layout-body") : layoutgroup.children();
            // Set a timeout to accommodate CSS animations
            var swipeIndicators = $containerForSwipe.children(".swipe-indicator");
            if (swipeIndicators.length == 0) {
                layoutgroup = layoutgroup.parent();
                swipeIndicators = $containerForSwipe.children(".swipe-indicator");
            }
            if (swipeIndicators.length > 0) {
                var jsPID = window.setTimeout(_destroySwipeIndicators, 500, false, layoutgroup);
                var i = 0;
                while (i < swipeIndicators.length) {
                    if (swipeIndicators[i].hasAttribute('data-jspid')) {
                        var oldPID = swipeIndicators[i].getAttribute('data-jspid');
                        window.clearTimeout(oldPID);
                    }
                    swipeIndicators[i].setAttribute('data-jspid', jsPID);
                    swipeIndicators[i].classList.add("swipe-indicator-fadeaway");
                    i = i + 1;
                }
            }
        }, _destroySwipeIndicators = function(unthreaded, layoutgroup) {
            if (LOGGING) console.log("_destroySwipeIndicators");
            // remove all elements with the swipe-indicator class
            var $nLg = pcd.$(layoutgroup);
            /* BUG-400326 - parmn ; initially each place layoutgroup.children(".layout-body") now replaced with $containerForSwipe, because of optimization layout body div not generating */
            var $containerForSwipe = $nLg.children(".layout-body").length > 0 ? $nLg.children(".layout-body") : $nLg
                .children();
            var indicators = $containerForSwipe.children(".swipe-indicator");
            if (indicators.length == 0) indicators = $containerForSwipe.children(".content").children(
                ".swipe-indicator");
            var len = indicators.length;
            var i = 0;
            var numDestroyed = 0;
            while (i < len) {
                var jsPID = indicators[i].getAttribute('data-jspid');
                if (unthreaded == true && jsPID == null) {
                    indicators[i].parentNode.removeChild(indicators[i]);
                    numDestroyed = numDestroyed + 1;
                }
                if (!unthreaded && jsPID != null) {
                    window.clearTimeout(jsPID);
                    indicators[i].parentNode.removeChild(indicators[i]);
                    numDestroyed = numDestroyed + 1;
                }
                i = i + 1;
            }
            if (numDestroyed == len) {
                $containerForSwipe[0].style["position"] = "";
            }
        }, _getMainLayoutGroups = function (lgArr) {	
            function isNested(lgItem) {	
                return $(lgArr[lgItem]).parents(".content-layout-group").length === 0;	
            };	
            return lgArr.filter(isNested);	
        }, _checkForErrors = function() {
            var layoutGroupsOnPage = pcd.$(".content-layout-group");	
            var mainLayoutGroups = _getMainLayoutGroups(layoutGroupsOnPage);	
            mainLayoutGroups.each(function() {	
                var $nThat = pcd.$(this);	
                if (_hasErrors($nThat)) {	
                     var errors = $nThat.find(".iconErrorDiv, .inputErrorDiv");
                     errors = errors.filter(pega.u.d.isDisplayNone);
                    for (var i = 0; i < errors.length; i++) {	
                        _processError(errors[i], "add");	
                    }	
                } else {	
                    _clearLayoutErrorMessage($nThat);	
                }	
            });
        }, _setLGModuleToFalse = function(config) {
            isLayoutGroupModuleLoaded = false;
            forceResize = config && config.forceResize ? config.forceResize : false;
        }, _nextAccordionActive = function(event) {
            var target = pega.util.Event.getTarget(event);
            var closestLayout = target.closest(".layout.active");
            //var nextLayout = closestLayout.nextSibling;
            var nextLayouts = $(closestLayout).nextAll(".layout:visible:not(.lg-disabled)");
            if (nextLayouts.length > 0) {
                var nextLayout = nextLayouts[0];
                nextLayout.firstChild.click();
                nextLayout.querySelector(".number-accordion-circle").focus()
            }
        }, _prevAccordionActive = function(event) {
            var target = pega.util.Event.getTarget(event);
            var closestLayout = target.closest(".layout.active");
            //var prevLayout = closestLayout.previousSibling;
            var prevLayouts = $(closestLayout).prevAll(".layout:visible:not(.lg-disabled)");
            if (prevLayouts.length > 0) {
                var prevLayout = prevLayouts[0];
                prevLayout.firstChild.click();
                prevLayout.querySelector(".number-accordion-circle").focus()
            }
        }, _hasErrors = function(layout) {
            var iconErrorDivs = layout.find(".iconErrorDiv, .inputErrorDiv");
            iconErrorDivs = iconErrorDivs.filter(pega.u.d.isDisplayNone);
            return iconErrorDivs.length > 0;
        }, _addLayoutErrorMessage = function(layout) {
            var tabErrorToolTip = layout ? pega.u.d.fieldValuesList.get("TabErrorTooltip") : "";
            var newDivObj = document.createElement("div");
            newDivObj.style.display = "inline-block";
            newDivObj.style.marginLeft = "0px";
            newDivObj.style.width = "10px";
            newDivObj.style.height = "10px";
            newDivObj.className = "iconErrorTabsDiv";
            newDivObj.style.position = "relative";// added for the scroll issue icon was moving along
            newDivObj.innerHTML = "<span class='iconErrorTabs' title='" + tabErrorToolTip + "' id='PegaRULESErrorFlag'/>";
            //attach the error div to the active header
            if (!isMenuLG) {
                var tabHeader = layout.children(".header")[0];
            }
            else {
                var tabHeader = layout.children(".layout-group-nav-title")[0];
            }
            tabHeader.insertBefore(newDivObj, tabHeader.children[0]);
        }, _clearLayoutErrorMessage = function(layout) {
            var errorIconDiv = layout.find(".iconErrorTabsDiv")
            for(var i=0;i<errorIconDiv.length;i++){
              removeErrorIcon(errorIconDiv[i].closest(".header"),_getLayoutGroupType(layout));
            }
        }, _goToNextError = function(mainLayout) {
           var errorDivs = $(mainLayout).find(".iconErrorDiv, .inputErrorDiv").filter(pega.u.d.isDisplayNone);
             if(errorDivs && errorDivs[0] && errorDivs[0].closest(".content-layout-group"))
              _makeParentLayoutsActive(errorDivs[0]);
        }, _makeParentLayoutsActive = function(descendantElement) {
            var LayoutActiveArgs = [];
            //collect all the layouts
            (function CollectParentLayouts(descendantElement) {
                while (descendantElement != null) {
                    if (pcd.$(descendantElement.parentNode).hasClass("content-layout-group")) {
                        LayoutActiveArgs.push([pcd.$(descendantElement).parent(), pcd.$(descendantElement).children(
                            ".header")]);
                    }
                    descendantElement = descendantElement.parentNode;
                }
            })(descendantElement);
            $.each(LayoutActiveArgs.reverse(), function makeLayoutActiveWrapper(index, value) {
                _makeLayoutActive(value[0], value[1]);
            });
        }, _updateStretchTabWidths = function(elem) {
            // if elem is null then this function runs in the document context. Otherwise it will run in the context of elem.
            var layoutGroupsOnPage = [];
            if (elem != null) {
                if (pcd.$(elem)[0]) layoutGroupsOnPage = pcd.$(elem)[0].querySelectorAll(
                    ".content-layout-group.stretch-tabs");
            } else {
                layoutGroupsOnPage = pcd.querySelectorAll(".content-layout-group.stretch-tabs");
            }
            layoutGroupsOnPage = [].slice.call(layoutGroupsOnPage);
            layoutGroupsOnPage.forEach(function(element) {
                var $nThat = pcd.$(element);
                /* update class only if layoutgroup is visible - Dont use jQuery is visible */
                if (!!$nThat.filter(':visible').length) {
                    var childCount = $nThat.children(".layout").filter(':visible').length;
                    if ($nThat[0].className.match(/count-[0-9]+/) != null) {
                        // This regex replaces the word count-### at the beginning middle or end of the class string
                        $nThat[0].className = $nThat[0].className.replace(/\bcount-[0-9]+\b/, "count-" +
                            childCount);
                    } else {
                        $nThat[0].className += " count-" + childCount;
                    }
                }
            });
        }, _swipe = function(callback) {
            var $nThat = pcd.$(this);
            var touchDown = false,
                originalPosition = null,
                $el = $nThat;

            function swipeInfo(event) {
                var x = event.originalEvent.pageX,
                    y = event.originalEvent.pageY,
                    dx,
                    dy;
                if (typeof x == 'undefined') x = event.originalEvent.touches[0].pageX;
                if (typeof y == 'undefined') y = event.originalEvent.touches[0].pageY;
                dx = x > originalPosition.x ? "right" : "left";
                dy = y > originalPosition.y ? "down" : "up";
                return {
                    direction: {
                        x: dx,
                        y: dy
                    },
                    offset: {
                        x: x - originalPosition.x,
                        y: originalPosition.y - y
                    }
                };
            }
            $el.on("touchstart", function(event) {
                // Swipeable RDL must take precedence over layout groups
                if ($(event.target).parents('[data-swipeable=true]').length > 0) {
                    return;
                }
                // BUG-543765 : controls like address map must take precedence over layout groups
                if ($(event.target).parents('[data-nogestures=true]').length > 0) {
                    return;
                }
                touchDown = true;
                if (event.originalEvent.touches && event.originalEvent.touches[0] && typeof event.originalEvent
                    .touches[0].pageX != 'undefined') {
                    originalPosition = {
                        x: event.originalEvent.touches[0].pageX,
                        y: event.originalEvent.touches[0].pageY
                    };
                } else {
                    originalPosition = {
                        x: event.originalEvent.pageX,
                        y: event.originalEvent.pageY
                    };
                }
                $("body").on("touchmove", ".layout-body[role='tabpanel']", function(event) {
                    var $nThat = pcd.$(this);
                    if (!touchDown) {
                        return;
                    }
                    var info = swipeInfo(event);
                    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                        var elem = $nThat.parent(),
                            swipeEnabled,
                            lgoptions = elem.parent().data("lg-options");
                        if (lgoptions) {
                            swipeEnabled = lgoptions.swipe;
                        }
                        if (swipeEnabled == "true" && elem.hasClass('layout') && elem.parent().hasClass(
                                'content-layout-group')) {
                            _swipeLayoutStart($nThat, event);
                        }
                    } else {
                        $("body").off("touchmove");
                    }
                });
            });
            $el.on("touchend", function() {
                touchDown = false;
                originalPosition = null;
            });
            return true;
        },
        /*
        @This function generates the menu by obtaining a config json and data json and highlights the menu item corresponding to the currently active/open tab.
        @return $void$
        */
        _constructTabMenu = function(event) {
            var menuJSON = {};
            var nodeElements = [];
            var targetElement = pcd.$(event.target);
            /*Get the menu menu config json generated from server side */
            var configElement = targetElement.parent(".layout-group-tablist-menu").attr("data-menu-config");
            if (configElement) {
                var configJSON = JSON.parse(configElement);
            }
            var contentLGDiv = targetElement.closest(".content-layout-group");
            /*activeTabId- indicates the tab that is currently open/active */
            var activeTabId = contentLGDiv.children(".active").attr("data-lg-child-id");
            /*activeMenuItem-the menu item corresponding to the currently active tab.Conatins the count */
            var activeMenuItem = "";
            /* Forming the menu data json from the layout group elements that are currently visible.
            This excludes the layout group elements hidden by client side visible when*/
            var layoutGroupElement = contentLGDiv.attr("data-semantic-tab") === "true" ?  
       contentLGDiv.children("div.layout-header").children("[data-lg-child-id]:visible:not(.lg-disabled)") : contentLGDiv.children("[data-lg-child-id]:visible:not(.lg-disabled)");;
            layoutGroupElement.each(function(key, layoutGroupChild) {
                var childId = pcd.$(this).attr("data-lg-child-id");
                if (activeTabId == childId) {
                    activeMenuItem = key + 1;
                }
                var menuNode = {};
                //menuNode["pyCaption"]=$(layoutGroupChild).find(".layout-group-item-title").text();
                menuNode["pyCaption"] = pcd.$(layoutGroupChild).children(".header").find(
                    ".layout-group-item-title").text();
                menuNode["data-click"] = [
                    ["runScript", ["LayoutGroupModule.activateTabFromMenu(\"" + childId + "\",event)"]]
                ];
                menuNode["nodes"] = [];
                menuNode["data-tab"] = "abcde";
                /* Icons for menu items */
                var leftImg = layoutGroupChild.querySelector(".header") && layoutGroupChild.querySelector(
                    ".header").querySelector("img:not(.close)");
                if (leftImg) {
                    menuNode["pyImageSource"] = "image";
                    menuNode["pySimpleImage"] = leftImg.getAttribute("src");
                }
                nodeElements.push(menuNode);
            });
            /*Obtaining the menu id from the hidden input field that contains a unique name attribute for each layout group */
            var menuId = contentLGDiv.attr("data-repeat-id");
            if (!menuId) menuId = contentLGDiv.parent().attr("data-repeat-id");
            if (!menuId) {
                menuId = contentLGDiv.attr("data-lg-id");
                if (!menuId) menuId = contentLGDiv.parent().attr("data-lg-id");
            }
            menuJSON["menuid"] = menuId;
            menuJSON["nodes"] = nodeElements;
            /* Set the showMenuTarget to override the events target in case of action executed on a menu item.
             This is to execute the action in the context of the section.*/
            pega.control.menu.showMenuTarget = targetElement[0];
            /*Construct and render Menu*/
            var oldMenuNodeList = document.querySelectorAll("#"+ menuId);
            if (oldMenuNodeList && oldMenuNodeList.length && oldMenuNodeList.length > 0) {
              oldMenuNodeList.forEach(function(menuItem){
                menuItem.parentElement.remove();
              });
            }
            pega.control.menu.createAndRenderContextMenu(menuJSON, configJSON, targetElement, event);
            /*Highlighting the menu item that corresponds to currently active/open tab in the layout group */
            pcd.$("#" + menuId + ">li").removeClass("activeTab");
            pcd.$("#" + menuId + ">li:nth-child(" + activeMenuItem + ")").addClass("activeTab");
        },
        /*
        @This function constructs the menu and shows the menu icon in the active state.
        Also ensures that the icon goes to the inactive state when the menu is closed.
        @return $void$
        */
        _showActiveTabListMenu = function(event) {
            var targetElement = pcd.$(event.target);
            /*Construct menu from the client side */
            _constructTabMenu(event);
            /*Show the menu icon in the active state. */
            targetElement.addClass("activeTabMenuIcon");
            targetElement.parent(".layout-group-tablist-menu").addClass("activeTabMenu");
            /*Executed only once after which it is unbound. Shows the menu icon in the inactive state once the menu is hidden*/
            $(document.body).one("click.bodyone,touchend.bodyone", function() {
                targetElement.removeClass("activeTabMenuIcon");
                targetElement.parent(".layout-group-tablist-menu").removeClass("activeTabMenu");
            });
        },
        /*
        @This function ensures that the appropriate tab becomes active when a menu item is clicked upon.
        @return $void$
        */
        _activateTabFromMenu = function(tabId, event, calledFrom, oneLGRef, nestedLG) {
            if (calledFrom == "reload") {
                //var $AllLGRefs = $(".layout-group-tab[role='tablist']");
                //$AllLGRefs.each(function(i, layoutgroup){
                if (!nestedLG) var type = _getLayoutGroupType([oneLGRef]);
                else var type = _getLayoutGroupType([oneLGRef.children[0]]);
                if (type == "tab" && !_toDisableSlideOnTabsClick(oneLGRef)) {
                    //$(oneLGRef).find("[data-lg-child-id="+tabId+"]").find(".layout-group-item-title").trigger("click");
                    if (!nestedLG) pcd.$(oneLGRef).children("[data-lg-child-id='" + tabId + "']").children(".header")
                        .trigger("click");
                    else pcd.$([oneLGRef.children[0]]).children("[data-lg-child-id='" + tabId + "']").children(
                        ".header").trigger("click");
                    if (tabId == 1) {
                        if (nestedLG) pcd.$(oneLGRef).children().children(".tab-arrow.left-arrow").addClass(
                            "tab-arrow-inactive");
                        else pcd.$(oneLGRef).children(".tab-arrow.left-arrow").addClass("tab-arrow-inactive");
                        //$(oneLGRef).find(".tab-arrow.left-arrow").addClass("tab-arrow-inactive");
                        pcd.$(oneLGRef).attr("data-reachedBeginning", "true");
                    }
                }
                //});
            } else {
                var targetElement = pcd.$(event.target);
                var layoutGroupElement = targetElement.closest(".content-layout-group");
                if (tabId == 1) {
                    layoutGroupElement.find(".tab-arrow.left-arrow").addClass("tab-arrow-inactive");
                    layoutGroupElement.attr("data-reachedBeginning", "true");
                }
                var $headerSectionWrapper = layoutGroupElement.attr("data-semantic-tab") === "true" ? layoutGroupElement.children("div.layout-header").children("[data-lg-child-id=" + tabId + "]") : layoutGroupElement.children("[data-lg-child-id=" + tabId + "]");
                if (!$headerSectionWrapper.next().attr("data-lg-child-id")) {
                    layoutGroupElement.find(".tab-arrow.right-arrow").addClass("tab-arrow-inactive");
                }
                var activeTab = _getActiveTabElement(layoutGroupElement);
                activeTab.next().length && layoutGroupElement.attr("data-topCalculateBeforeScroll", activeTab.next().offset().top - $(document)
                    .scrollTop());
                //topCalculateBeforeScroll = activeTab.next().offset().top - $(document).scrollTop();
                if (_isTouchDevice()) {
                    $headerSectionWrapper.children(".header").trigger("touchstart").trigger("click");
                    //$headerSectionWrapper.find(".layout-group-item-title").trigger("touchstart").trigger("click");
                } else {
                    $headerSectionWrapper.children(".header").trigger("click");
                    //$headerSectionWrapper.find(".layout-group-item-title").trigger("click");
                }
            }
        }, _resizeActions = function() {
            if (pega.u.d.DISABLE_LG_RESIZE) {
                return;
            }
            var resizeCall = function() {
                /* BUG-366328 : restricting the call only in case of layout group */
                var $AllLGRefs = pcd.$(".content-layout-group").filter(":visible");
                //var $AllLGRefs = $(".tab-overflow");
                $AllLGRefs.each(function(i, layoutgroup) {
                    layoutgroup.setAttribute("data-lg-type", "");
                    var headerSelector = layoutgroup && layoutgroup.hasAttribute("data-role") ? "[data-role='tab']" : "[role='tab']";
                    var $nLg = pcd.$(layoutgroup);
                    /*BUG-344071 fix starts here*/
                    if (_getLayoutGroupType([layoutgroup]) == "tab" || _getLayoutGroupType([layoutgroup]) ==
                        "menu") {
                        LayoutGroupModule.setHiddenField($nLg);
                        var configObj = {};
                        configObj.LGRepeatId = $nLg.attr("data-repeat-id");
                        configObj.LGTabGrpId = $nLg.attr("data-lg-id");
                        var divWrapperLG = $nLg.closest('div[data-lg-id]');
                        var lgType = pega.util.Dom.getElementsByName("LGType" + configObj.LGTabGrpId,
                            divWrapperLG);
                        if (lgType != null) lgType = lgType[0].value;
                        configObj.LGType = lgType;
                        typeof modifyForMenuActiveCallback == "function" ? modifyForMenuActiveCallback(
                            configObj) : "";
                    }
                    if(!pega.u.d.DISABLE_LG_ACCESSIBILITY && _getLayoutGroupType([layoutgroup]) !== layoutgroup.getAttribute("data-format") ){
                          setAccessibilityAttributes(layoutgroup);
                    }
                    /*BUG-344071 fix ends here*/
                    var $nThat = pcd.$(this);
                    if (!$nLg.hasClass("stretch-tabs")) {
                        var type = _getLayoutGroupType([layoutgroup]);
                        var firstTab = _findNative($nThat, headerSelector+":first") && _findNative($nThat,
                                headerSelector+":first")[0] ? _findNative($nThat, headerSelector+":first")[0] :
                            '';
                        if($nLg.attr("data-semantic-tab") === "true" && $nLg.attr("data-header-scrollable") === "true"){
                          _toDisableSlideOnTabsClick(layoutgroup);
                          $nLg.removeClass("tab-overflow");
                        }
                        else if (type == "tab" && !_toDisableSlideOnTabsClick(layoutgroup) && !
                            _isParentOverlay($nLg)) {
                            $nThat.addClass("tab-overflow");
                            /* layout group hidden */
                            if ($nThat.css("visibility") == "hidden") $nThat.css("visibility", "visible");
                            $nThat.children(".left-tab-nav-controls").css("display", "inline-block");
                            $nThat.children(".right-tab-nav-controls").css("display", "block");
                            $nThat.children(".add-new-tab").css("display", "none");
                            /*$(this).find('div[data-lg-child-id]').find('.header').css("padding","1em 0 0 0");*/
                            //var marginBeforeResize = $nLg.attr("data-marginBeforeResize");
                            if (firstTab && !firstTab.classList.contains("lg-transition-ml-linear")) {
                                firstTab.classList.add("lg-transition-ml-linear");
                                firstTab.classList.remove("lg-transition-all-linear",
                                    "lg-transition-all-ease-out", "lg-transition-none");
                            }
                            setTimeout(function() {
                                _slideEnoughToBringSelectedHeaderIntoFullView($nThat,
                                    _getActiveTabElement($nThat));
                                var activeTab = _getActiveTabElement(pcd.$(layoutgroup));
                                /*if(!_isSelectedHeaderBetweenTheTwoArrows(activeTab, $(layoutgroup).children(".left-tab-nav-controls"), $(layoutgroup).children(".right-tab-nav-controls"))){ */
                                if (activeTab && !_isActiveTabBetweenTheTwoArrows(activeTab, pcd.$(
                                        layoutgroup).children(".right-tab-nav-controls"))) {
                                    //activeTab.next().attr('style',"margin-top:"+(currentMarginForSection+currentTabHeight)+"px !important");
                                    activeTab.next().css("margin-top", currentMarginForSection +
                                        currentTabHeight + "px !important");
                                } else {
                                    //activeTab.next().attr('style',"margin-top:"+(currentMarginForSection)+"px !important");
                                    activeTab && activeTab.next().css("margin-top", currentMarginForSection +
                                        currentTabHeight + "px !important");
                                }
                            }, 300);
                            /* BUG-267058 start */
                            LayoutGroupModule.updateLayoutHeight($nLg);
                            isLayoutGroupModuleLoaded = false;
                            //this will not work
                            //$("body").attr("data-lgclickregiestered", "").off("keydown click touchstart");
                            //$("body").attr("data-lgclickregiestered", "");
                            /* BUG-516427, comented the following line of code as it is causing to rearranging all the tabs from the first tab(in method LayoutGroupModule.initialiseLGTreatment()), due to this last tab is not visble if there are more tabs than screen size.*/
                            $nLg.attr("data-eventsAdded", "");
                            LayoutGroupModule.initialiseLGTreatment();
                            //_slideEnoughToBringSelectedHeaderIntoFullView($(layoutgroup), _getActiveTabElement($(layoutgroup)));
                            /* add resized class when window is resized */
                            //$(layoutgroup).addClass('resized');
                            /* BUG-267058 end */
                        } else if ($nThat.hasClass("tab-overflow")) {
                            $nThat.parent().removeClass("container-scroll");
                            $nThat.parent().css("height", "");
                            $nThat.parent().css("width", "");
                            $nThat.parent().css("position", "");
                            $nThat.removeClass("tab-overflow");
                            $nThat.children(".left-tab-nav-controls").css("display", "none");
                            $nThat.children(".right-tab-nav-controls").css("display", "none");
                            $nThat.children(".add-new-tab").css("display", "inline-block");
                            if (firstTab && !firstTab.classList.contains("lg-transition-none")) {
                                firstTab.classList.add("lg-transition-none", "no-padding");
                                firstTab.classList.remove("lg-transition-ml-linear",
                                    "lg-transition-all-ease-out", "lg-transition-all-linear");
                            }
                            /* BUG-504608 : revert to BUG-377764 */
                            _findNative($nThat, headerSelector).css("transform", "translateX(0px)");
                        } else {
                            (type == 'tab' && $nThat.attr("data-addnewtab") == 'true') ? $nThat.children(".add-new-tab").css(
                                "display", "inline-block") : "";
                        }
                    }
                });
            }
            if (forceResize) {
                resizeCall();
            } else {
                clearTimeout(resizeCallDebounce);
                resizeCallDebounce = setTimeout(function() {
                    resizeCall();
                }, 500);
            }
        }, _toDisableSlideOnTabsClick = function(oneLGRef) {
            if (pega.u.d.DISABLE_LG_RESIZE && !pcd.$(oneLGRef).attr("data-header-scrollable") === "true") {
                return true;
            }
            if(pcd.$(oneLGRef).attr("data-header-scrollable") === "true"){
                  pcd.$(oneLGRef).children(".layout-header").css("width","100%");
                  pcd.$(oneLGRef).children(".layout-header").css("white-space", "initial");
                  pcd.$(oneLGRef).children(".layout-header").css("overflow-x", "initial" );
            }
            var totalTabWidth = 0;
            var dataLgId = pcd.$(oneLGRef).attr("data-lg-id");
            var tabWidth = pcd.$(oneLGRef).parent().width();
            var headerSelector = oneLGRef && pcd.$(oneLGRef)[0] && pcd.$(oneLGRef)[0].hasAttribute("data-role") ?  "[data-role='tab']" :  "[role='tab']";
            if (!dataLgId) dataLgId = pcd.$(oneLGRef).parent().attr("data-lg-id");
            _findNative(pcd.$(oneLGRef), headerSelector).each(function() {
                var $nThat = pcd.$(this);
                if ($nThat.closest("[data-lg-id]").attr("data-lg-id") == dataLgId) {
                    totalTabWidth += $nThat.outerWidth(true);
                }
            });
            if (!pcd.$(oneLGRef).hasClass("tab-overflow")) {
                pcd.$(oneLGRef).find(".add-new-tab").css("float", "left");
                var btnAddNewTab = pcd.$(oneLGRef).find(".add-new-tab");
                totalTabWidth += btnAddNewTab && btnAddNewTab.length && pcd.$(btnAddNewTab).width() ? pcd.$(
                    btnAddNewTab).width() : 0;
                pcd.$(oneLGRef).find(".add-new-tab").css("float", "");
            } else if (pcd.$(oneLGRef).find(".add-new-tab.add-new-tab-bg") && pcd.$(oneLGRef).find(
                    ".add-new-tab.add-new-tab-bg").length) {
                totalTabWidth += pcd.$(oneLGRef).find(".add-new-tab.add-new-tab-bg").width();
            }
            if (parseInt(totalTabWidth) > tabWidth) {
               if(pcd.$(oneLGRef).attr("data-header-scrollable") === "true"){
                  pcd.$(oneLGRef).children(".layout-header").css("width", tabWidth === 0 ? '100%' :tabWidth);
                  pcd.$(oneLGRef).children(".layout-header").css("white-space", "nowrap");
                  pcd.$(oneLGRef).children(".layout-header").css("overflow-x", "auto");
                  pcd.$(oneLGRef).children(".layout-header").find(".layout.active > .header")[0].scrollIntoView(false);
                }
                return false;
            } else {
                return true;
            }
        }, _findNative = function(parentNodeObj, selector) {
            var resultArr = [];
            var usequerySelectorAll = selector.indexOf(":first") == -1 ? true : false;
            parentNodeObj.each(function(i, el) {
                if (usequerySelectorAll) {
                    $(el.querySelectorAll(selector)).each(function(j, item) {
                        resultArr.push(item);
                    });
                } else {
                    selector = selector.replace(":first", "");
                    $(el.querySelector(selector)).each(function(j, item) {
                        resultArr.push(item);
                    });
                }
            });
            return $(resultArr);
        }, _getActiveTabElement = function($LGRef) {
            var activeTab;
            var lgId = $LGRef.attr("data-repeat-id");  
            var headerSelector = $LGRef.attr("data-semantic-tab") === "true" ? ".content-layout-group>div>.layout>.header" : ".content-layout-group>.layout>.header";
            if (!lgId) lgId = $LGRef.parent().attr("data-repeat-id");
            _findNative($LGRef, headerSelector).each(function() {
                var $nThat = pcd.$(this);
                //if($(this).attr('tabindex') == 0){
                if ($nThat.parent().hasClass("active") && lgId == $nThat.closest("[data-repeat-id]").attr(
                        "data-repeat-id")) {
                    activeTab = $nThat;
                    return false;
                }
            });
            return activeTab;
        }, _onLoadAttachEvent = function() {
            pega.u.d.attachOnload(function() {
                if(!pega.u.d.DISABLE_LG_ACCESSIBILITY){
                  var layoutContainer;
                  if(arguments[0] && arguments[0].target) layoutContainer = arguments[0].target;
                  else if(arguments[0]) {
                    layoutContainer = arguments[0];
                    if(pcd.$(layoutContainer).hasClass("content-layout-group")) layoutContainer = layoutContainer.parentElement;
                  } 
                  var $AllLGRefsOnPage = pcd.$(layoutContainer).find(".content-layout-group>.tab-arrow:not([data-format])");
                  $AllLGRefsOnPage.each(function(i, oneLGRef) {
                    setAccessibilityAttributes(oneLGRef.parentElement);
                  });
                }
                _initialiseLGTreatment();
                if (!pega.u.d.DISABLE_ADDNEWTAB) {
                    _initialiseAddNewTab();
                }
                //_initEnterKeyNumberedAccord();
            }, true);
        },setTabAccessibilityAttributes = function(layoutgroup,lgHeaders,lgBody,$layoutGroup){
           layoutgroup.setAttribute("role", "tablist");
            for(var i=0; i < lgHeaders.length ; i++){
                if(!lgHeaders[i].hasAttribute("data-role") || lgHeaders[i].getAttribute("role") !=='tab' ){
                   lgHeaders[i].setAttribute("tabindex","-1");
                   lgHeaders[i].setAttribute("role","tab");
                   lgHeaders[i].setAttribute("data-role","tab");
                   lgHeaders[i].setAttribute("aria-selected","false");
                   lgBody[i].setAttribute("role","tabpanel");
                   lgBody[i].setAttribute("tabindex","0");
                   if(!lgBody[i].hasAttribute("aria-labelledby")){
                        lgBody[i].setAttribute("aria-labelledby", "headerlabel" + Math.floor((Math.random() * 10000) + 1));
                        lgBody[i].setAttribute("id","section" + Math.floor((Math.random() * 10000) + 1));
                    }
                    lgHeaders[i].setAttribute("id",lgBody[i].getAttribute("aria-labelledby"));
                    lgHeaders[i].setAttribute("aria-controls",lgBody[i].getAttribute("id"));
                    var tabHeading = lgHeaders[i].querySelector(".layout-group-item-title");
                    tabHeading.setAttribute("role","presentation");
                    if(lgHeaders[i].querySelector(".header>.layout-group-item-title>.accordion-btn")){
                        var accordionBtn = lgHeaders[i].querySelector(".header>.layout-group-item-title>.accordion-btn");
                        if(accordionBtn.getAttribute("aria-label")) lgHeaders[i].setAttribute("aria-label",accordionBtn.getAttribute("aria-label"));
                        var header = lgHeaders[i].querySelector(".header>:not(span).layout-group-item-title");
                        header.innerHTML = "";
                        header.innerHTML = accordionBtn.innerHTML;
                     }
                  }
              }
              var activeHeader =  $layoutGroup.find(">.layout.active>.header");
              if(activeHeader[0]) {
                 activeHeader[0].setAttribute("tabindex", "0");
                 activeHeader[0].setAttribute("aria-selected", "true");
              }
        }, setAccordionAccessibilityAttributes = function(layoutgroup,lgHeaders,lgBody,$layoutGroup){
                var headingElements =  $layoutGroup.find(">.layout>.header>:not(span).layout-group-item-title");
                layoutgroup.removeAttribute("role");
                for (var i=0; i<lgHeaders.length;i++ ){
                  if(!lgHeaders[i].hasAttribute("data-role") || !lgHeaders[i].querySelector(".header>.layout-group-item-title>.accordion-btn")){
                    var accordionBtn = document.createElement("div");
                    accordionBtn.setAttribute("role","button");
                    accordionBtn.setAttribute("tabindex","0");
                    accordionBtn.setAttribute("aria-expanded","false");
                    if(!lgBody[i].hasAttribute("aria-labelledby")){
                      lgBody[i].setAttribute("aria-labelledby", "headerlabel" + Math.floor((Math.random() * 10000) + 1));
                      lgBody[i].setAttribute("id","section" + Math.floor((Math.random() * 10000) + 1));
                    }
                    accordionBtn.setAttribute("id",lgBody[i].getAttribute("aria-labelledby"));
                    accordionBtn.setAttribute("aria-controls",lgBody[i].getAttribute("id"));
                    accordionBtn.setAttribute("aria-label",lgHeaders[i].getAttribute("aria-label"));
                    accordionBtn.classList.add("accordion-btn");
                    lgHeaders[i].removeAttribute("id");
                    lgHeaders[i].removeAttribute("aria-selected");
                    lgHeaders[i].removeAttribute("aria-controls");
                    lgHeaders[i].removeAttribute("aria-label");
                    lgHeaders[i].removeAttribute("role");
                    lgHeaders[i].removeAttribute("tabindex");
                    lgHeaders[i].setAttribute("data-role","tab");
                    lgBody[i].removeAttribute("tabindex");
                    lgBody[i].setAttribute("role","region");
                    accordionBtn.innerHTML = headingElements[i].innerHTML;
                    headingElements[i].innerHTML = "";
                    headingElements[i].appendChild(accordionBtn);
                  }
                } 
                var activeHeader =   $layoutGroup.find(">.layout.active>.header>.layout-group-item-title>.accordion-btn");
                if(activeHeader[0]) activeHeader[0].setAttribute("aria-expanded", "true");
        }, setMenuAccessibilityAttributes = function(layoutgroup,lgHeaders,lgBody,$layoutGroup){
               layoutgroup.removeAttribute("role");
               for(var i=0; i < lgHeaders.length ; i++){
                   if(!lgHeaders[i].hasAttribute("data-role") || lgHeaders[i].getAttribute("role") !=='menuitem'){
                      lgHeaders[i].setAttribute("tabindex","-1");
                      lgHeaders[i].setAttribute("role","menuitem");
                      lgHeaders[i].setAttribute("data-role","tab");
                      if(!lgBody[i].hasAttribute("aria-labelledby")){
                        lgBody[i].setAttribute("aria-labelledby", "headerlabel" + Math.floor((Math.random() * 10000) + 1));
                        lgBody[i].setAttribute("id","section" + Math.floor((Math.random() * 10000) + 1));
                      }
                      lgHeaders[i].setAttribute("id",lgBody[i].getAttribute("aria-labelledby"));
                      lgHeaders[i].setAttribute("aria-controls",lgBody[i].getAttribute("id"));
                      lgBody[i].setAttribute("tabindex","-1");
                      lgBody[i].removeAttribute("role");
                      if(lgHeaders[i].querySelector(".header>.layout-group-item-title>.accordion-btn")){
                        var accordionBtn = lgHeaders[i].querySelector(".header>.layout-group-item-title>.accordion-btn");
                        if(accordionBtn.getAttribute("aria-label")) lgHeaders[i].setAttribute("aria-label",accordionBtn.getAttribute("aria-label"));
                        var header = lgHeaders[i].querySelector(".header>:not(span).layout-group-item-title");
                        header.innerHTML = "";
                        header.innerHTML = accordionBtn.innerHTML;
                      }
                    }
                 }
                 var activeHeader =  $layoutGroup.find(">.layout.active>.header");
                 if(activeHeader[0]) activeHeader[0].setAttribute("tabindex", "0");
        }, setStackedAccessibilityAttributes = function(layoutgroup,lgHeaders,lgBody){
                layoutgroup.removeAttribute("role");
                for(var i=0; i < lgHeaders.length ; i++){
                      lgHeaders[i].setAttribute("tabindex","-1");
                      lgHeaders[i].removeAttribute("role");
                      lgHeaders[i].removeAttribute("aria-selected");
                      lgHeaders[i].setAttribute("data-role","tab");
                      if(!lgBody[i].hasAttribute("aria-labelledby")){
                        lgBody[i].setAttribute("aria-labelledby", "headerlabel" + Math.floor((Math.random() * 10000) + 1));
                        lgBody[i].setAttribute("id","section" + Math.floor((Math.random() * 10000) + 1));
                      }
                      lgHeaders[i].setAttribute("id",lgBody[i].getAttribute("aria-labelledby"));
                      lgHeaders[i].setAttribute("aria-controls",lgBody[i].getAttribute("id"));
                      lgBody[i].setAttribute("tabindex","-1");
                      lgBody[i].removeAttribute("role");
                }
        }, setAccessibilityAttributes = function(layoutgroup){
          if(layoutgroup){
                var $layoutGroup = pcd.$(layoutgroup);
                if($layoutGroup.attr("data-semantic-tab") === "true") return;
                var lgType = _getLayoutGroupType($layoutGroup); 
                var lgHeaders = $layoutGroup.attr("data-semantic-tab") === "true" ? $layoutGroup.find(".layout-header>.layout>.header") : $layoutGroup.find(">.layout>.header");
                var lgBody =  $layoutGroup.find(">.layout>.layout-body");
                layoutgroup.setAttribute("data-role", "tablist");
                if(layoutgroup.firstElementChild) layoutgroup.firstElementChild.setAttribute("data-format", lgType);
                if(lgType === 'tab'){
                  setTabAccessibilityAttributes(layoutgroup,lgHeaders,lgBody,$layoutGroup)
                } else if(lgType === 'accordion') {
                  setAccordionAccessibilityAttributes(layoutgroup,lgHeaders,lgBody,$layoutGroup);
                } else if(lgType === 'menu') {
                  setMenuAccessibilityAttributes(layoutgroup,lgHeaders,lgBody,$layoutGroup);
                } else if(lgType === 'stacked') {
                  setStackedAccessibilityAttributes(layoutgroup,lgHeaders,lgBody);
                }
            }
        }, _expandAccordionPane = function(event) {
            var target = event.target;
            if (target) {
                var header = $(target).closest(".header");
                header.click();
            }
        }, _initialiseAddNewTab = function() {
            var $AllLGRefs = pcd.$(".content-layout-group.lg-add-new-tab");
            $AllLGRefs.each(function(i, layoutgroup) {
                var $nLg = pcd.$(layoutgroup);
                if (!$nLg.hasClass("stretch-tabs")) {
                    var type = _getLayoutGroupType([layoutgroup]);
                    if (type == "tab" && !_toDisableSlideOnTabsClick(layoutgroup) && !_isParentOverlay($nLg)) {
                        var $nThat = pcd.$(this);
                        $nThat.parent().hasClass('container-scroll') ? "" : $nThat.parent().addClass(
                            'container-scroll');
                        if (typeof parentTab !== 'undefined' && pcd.$(parentTab).attr("data-lg-id") == $nLg.attr(
                                "data-lg-id")) {
                            _toggleToTabOverflow(layoutgroup);
                            var childId = $nLg.children(".layout.active").attr("data-lg-child-id");
                            var tempObj = {
                                target: parentTab
                            };
                            if (clickedAddTabEvent) {
                                clickedAddTabEvent.target = parentTab;
                                window.event = clickedAddTabEvent;
                            } else clickedAddTabEvent = tempObj;
                            LayoutGroupModule.activateTabFromMenu(childId, clickedAddTabEvent);
                            _slideEnoughToBringSelectedHeaderIntoFullView($nLg, _getActiveTabElement($nLg));
                            //If requirs, we need to call LayoutGroupModule.initialiseLGTreatment();
                            // isLayoutGroupModuleLoaded = false;
                            //$("body").attr("data-lgclickregiestered", "");
                            //$(parentTab).attr("data-eventsAdded", "");
                            //LayoutGroupModule.initialiseLGTreatment();
                            clickedAddTabEvent = "";
                            parentTab = '';
                        }
                    }
                }
            });
        }, _toggleToTabOverflow = function(oneLGRef) {
            var divWrapperLG = pcd.$(oneLGRef).closest("div[data-lg-id]");
            if (!divWrapperLG.hasClass("stretch-tabs") && !_isParentOverlay(pcd.$(oneLGRef)) && pcd.$(oneLGRef).is(
                    ":visible")) {
                "hidden" == divWrapperLG.css("visibility") && divWrapperLG.css("visibility", "visible");
                var tabIndName = divWrapperLG.attr("data-repeat-id");
                var headerSelector = oneLGRef && oneLGRef.hasAttribute("data-role") ? "[data-role='tab']" : "[role='tab']";
                tabIndName || (tabIndName = divWrapperLG.attr("data-lg-id"));
                var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + tabIndName, divWrapperLG[0]),
                    nestedLayout = pcd.$(oneLGRef).hasClass("tab-overflow") && "tab" == _getLayoutGroupType(pcd.$(
                        oneLGRef.children));
                "hidden" == divWrapperLG.css("visibility") && divWrapperLG.css("visibility", "visible");
                if (nestedLayout) {
                    divWrapperLG.parent().removeClass("container-scroll");
                    divWrapperLG.removeClass("tab-overflow");
                    divWrapperLG.addClass("container-scroll");
                    divWrapperLG.children().addClass("tab-overflow");
                    "hidden" == divWrapperLG.children().css("visibility") && divWrapperLG.children().css(
                        "visibility", "visible");
                    divWrapperLG.find(".left-tab-nav-controls").css("display", "inline-block");
                    divWrapperLG.find(".right-tab-nav-controls").css("display", "block");
                    divWrapperLG.find(".add-new-tab").css("display", "none");
                    /* BUG-504608 : revert to BUG-377764 */
                    _findNative(divWrapperLG, headerSelector).css("transform", "translateX(0px)");
                } else {
                    divWrapperLG.addClass("tab-overflow");
                    "hidden" == divWrapperLG.css("visibility") && divWrapperLG.css("visibility", "visible");
                    divWrapperLG.parent().addClass("container-scroll");
                    divWrapperLG.children(".left-tab-nav-controls").css("display", "inline-block");
                    divWrapperLG.children(".right-tab-nav-controls").css("display", "block");
                    divWrapperLG.children(".add-new-tab").css("display", "none");
                }
                if (null == tabInd || 1 == tabInd[0].value || _getActiveTabElement(pcd.$(oneLGRef)).is(":visible")) {
                    if (nestedLayout) {
                        pcd.$(oneLGRef).children().children(".tab-arrow.left-arrow").addClass("tab-arrow-inactive");
                    } else {
                        pcd.$(oneLGRef).children(".tab-arrow.left-arrow").addClass("tab-arrow-inactive");
                    }
                }
                oneLGRef.initialOnLoadHeight = parseInt(pcd.$(oneLGRef).parent().height());
                pcd.$(oneLGRef).parent().height(oneLGRef.initialOnLoadHeight);
                _updateLayoutHeight(pcd.$(oneLGRef), false, nestedLayout);
            }
        }, _initialiseLGTreatment = function() {
            var $AllLGRefsOnPage = pcd.$(".tab-overflow");
            var $allLg = pcd.$($AllLGRefsOnPage.get().reverse());
            var i = 0;
            $allLg.each(function(i, oneLGRef) {
                if (!$(oneLGRef).attr("data-eventsAdded")) {
                    $(oneLGRef).attr("data-eventsAdded", "true");
                    $(oneLGRef).find(".tab-arrow.left-arrow, .tab-arrow.right-arrow").click(
                        _toSlideTabsWrapper);
                    if (pcd.$(oneLGRef).data("lg-id")) {
                        /* closest searches from current element */
                        var headerSelector = oneLGRef && oneLGRef.hasAttribute("data-role") ? "[data-role='tab']" : "[role='tab']";
                        var divWrapperLG = pcd.$(oneLGRef);
                        /* BUG-504608 : revert to BUG-377764 */
                        if (divWrapperLG.hasClass("stretch-tabs") || _isParentOverlay(divWrapperLG) || !(
                                divWrapperLG[0].offsetWidth)) {
                            divWrapperLG.removeClass("tab-overflow");
                            divWrapperLG.children(".left-tab-nav-controls").css("display", "none");
                            divWrapperLG.children(".right-tab-nav-controls").css("display", "none");
                            divWrapperLG.parent().removeClass("container-scroll");
                            var firstTab = divWrapperLG.find(headerSelector) && divWrapperLG.find(
                                headerSelector)[0] ? divWrapperLG.find(headerSelector)[0] : "";
                            if (firstTab && !firstTab.classList.contains("lg-transition-none")) {
                                firstTab.classList.add("lg-transition-none", "no-padding");
                                firstTab.classList.remove("lg-transition-ml-linear",
                                    "lg-transition-all-ease-out", "lg-transition-all-linear");
                            }
                          if(divWrapperLG.attr("data-header-scrollable") === "true") {
                              _toDisableSlideOnTabsClick(oneLGRef)
                            }
                            /* no controls in stretch tabs */
                            //divWrapperLG.children(".left-tab-nav-controls").css("display", "none"); 
                            _findNative(divWrapperLG, headerSelector).css("transform", "translateX(0px)");
                        } else {
                            var nestedLayout = divWrapperLG.hasClass("tab-overflow") && "tab" ==
                                _getLayoutGroupType(pcd.$(oneLGRef.children));
                            if(divWrapperLG.attr("data-header-scrollable") === "true") {
                              divWrapperLG.removeClass("tab-overflow");
                              divWrapperLG.find(".left-tab-nav-controls").css("display", "none");
                              divWrapperLG.find(".right-tab-nav-controls").css("display", "none");
                              divWrapperLG.find(".add-new-tab").css("display", "inline-block");
                              _toDisableSlideOnTabsClick(oneLGRef)
                              return;
                            }
                            else if (_toDisableSlideOnTabsClick(oneLGRef) || "tab" != _getLayoutGroupType(
                                    divWrapperLG) && !nestedLayout) {
                                divWrapperLG.removeClass("tab-overflow");
                                divWrapperLG.parent().removeClass("container-scroll").css("height", "");
                                /* nested layout is false */
                                if (nestedLayout) {
                                    /* no need */
                                    divWrapperLG.find(".left-tab-nav-controls").css("display", "none");
                                    divWrapperLG.find(".right-tab-nav-controls").css("display", "none");
                                    divWrapperLG.find(".add-new-tab").css("display", "inline-block");
                                } else {
                                    divWrapperLG.children(".left-tab-nav-controls").css("display", "none");
                                    divWrapperLG.children(".right-tab-nav-controls").css("display", "none");
                                    divWrapperLG.children(".add-new-tab").css("display", "inline-block");
                                }
                                _findNative(divWrapperLG, headerSelector).css("transform", "translateX(0px)");
                            } else {
                                /* nestedLayout is true */
                                if (nestedLayout) {
                                    divWrapperLG.parent().removeClass("container-scroll");
                                    divWrapperLG.removeClass("tab-overflow").addClass("container-scroll");
                                    divWrapperLG.children('.content-layout-group').addClass("tab-overflow");
                                    "hidden" == divWrapperLG.children('.content-layout-group').css(
                                        "visibility") && divWrapperLG.children().css("visibility",
                                        "visible");
                                    divWrapperLG.find(".left-tab-nav-controls").css("display",
                                        "inline-block");
                                    divWrapperLG.find(".right-tab-nav-controls").css("display", "block");
                                    divWrapperLG.find(".add-new-tab").css("display", "none");
                                } else {
                                    /* no need */
                                    divWrapperLG.addClass("tab-overflow");
                                    "hidden" == divWrapperLG.css("visibility") && divWrapperLG.css(
                                        "visibility", "visible");
                                    divWrapperLG.parent().addClass("container-scroll");
                                    divWrapperLG.children(".left-tab-nav-controls").css("display",
                                        "inline-block");
                                    divWrapperLG.children(".right-tab-nav-controls").css("display", "block");
                                    divWrapperLG.children(".add-new-tab").css("display", "none");
                                }
                                var tabIndName = divWrapperLG.attr("data-repeat-id");
                                tabIndName || (tabIndName = divWrapperLG.attr("data-lg-id"));
                                var tabInd = pega.util.Dom.getElementsByName("EXPANDED" + tabIndName,
                                    divWrapperLG[0]);
                                var activeTab = _getActiveTabElement(divWrapperLG);
                                if (null == tabInd || 1 == tabInd[0].value || activeTab[0].offsetWidth) {
                                    _slideEnoughToBringSelectedHeaderIntoFullView(divWrapperLG, activeTab,
                                        true);
                                    /* TODO : nested cases - direct lg inside lg */
                                    /* BUG-389953 */
                                    if (divWrapperLG.children(".active").length) {
                                        if (divWrapperLG.children(".active").attr("data-lg-child-id") ==
                                            divWrapperLG.children("[data-lg-child-id]")[0].getAttribute(
                                                "data-lg-child-id")) {
                                            if (nestedLayout) {
                                                divWrapperLG.children().children(".tab-arrow.left-arrow").addClass(
                                                    "tab-arrow-inactive");
                                            } else {
                                                /* no need */
                                                divWrapperLG.children(".tab-arrow.left-arrow").addClass(
                                                    "tab-arrow-inactive");
                                            }
                                        }
                                    } else {
                                        if (divWrapperLG.children(".content-layout-group").children(
                                                ".active").attr("data-lg-child-id") == divWrapperLG.children(
                                                ".content-layout-group").children("[data-lg-child-id]")[0].getAttribute(
                                                "data-lg-child-id")) {
                                            if (nestedLayout) {
                                                divWrapperLG.children().children(".tab-arrow.left-arrow").addClass(
                                                    "tab-arrow-inactive");
                                            } else {
                                                /* no need */
                                                divWrapperLG.children(".tab-arrow.left-arrow").addClass(
                                                    "tab-arrow-inactive");
                                            }
                                        }
                                    }
                                } else {
                                    /* Trigger menu click only if tab is not in view */
                                  if($(oneLGRef).children('.right-tab-nav-controls').children('.layout-group-tablist-menu').filter(':visible').length){
                                    /* tab can only be activated from a visible menu */
                                    LayoutGroupModule.activateTabFromMenu(tabInd[0].value, window.event,"reload", oneLGRef, nestedLayout);
                                  }
                                }
                                oneLGRef.initialOnLoadHeight = parseInt(divWrapperLG.parent().height());
                                divWrapperLG.parent().height(oneLGRef.initialOnLoadHeight);
                                _updateLayoutHeight(divWrapperLG, false, nestedLayout);
                            }
                            if (0 == i) {
                                currentMarginForSection = 0;
                                /*BUG-267745 & BUG-267377-No active tab exists in this case and below line gives a JS error. */
                                currentTabHeight = activeTab ? activeTab.outerHeight(true) : 0;
                            }
                        }
                    }
                }
            });
            _initializeLayoutGroupToRemoveScrollClass();
        }, _toSlideTabsWrapper = function(evt) {
            if (flagToStopEvent) _slideTabHeadingsOnDesktop(evt);
        }, _slideTabHeadingsOnDesktop = function(evt) {
            flagToStopEvent = false;
            //var $LGRef = $(evt.target).parents("[role='tablist']");
            var $LGRef = pcd.$(evt.target).closest(".content-layout-group");
            var deltaDistanceToShiftTabsBy = defaultDeltaDistanceToShiftTabsBy;
            var $LGFirstTabHeadingRef = $LGRef.find("[role='tab']:first");
            //var $leftTabNavControls = $LGRef.find(".left-tab-nav-controls"),
            //$rightTabNavControls = $LGRef.find(".right-tab-nav-controls");   
            var $leftTabNavControls = $LGRef.children(".left-tab-nav-controls"),
                $rightTabNavControls = $LGRef.children(".right-tab-nav-controls");
            var nestedLG = false;
            if ($leftTabNavControls && $leftTabNavControls.length == 0) {
                nestedLG = true;
                $leftTabNavControls = $LGRef.find(".left-tab-nav-controls");
                $rightTabNavControls = $LGRef.find(".right-tab-nav-controls");
            }
            var viewPortWidth = parseInt($rightTabNavControls.position().left) - $leftTabNavControls.outerWidth();
            var reachedBeginning = $LGRef.attr("data-reachedBeginning") == "true" ? true : false;
            //var currentMargin = parseInt($LGFirstTabHeadingRef.css("margin-left")) || 0;
            var matrix = $LGFirstTabHeadingRef.css('transform').split(/[()]/)[1];
            var translateXValue = 0;
            if (matrix) {
                translateXValue = matrix.split(',')[4];
            }
            var currentMargin = parseInt(translateXValue) || 0;
            //if(reachedBeginning) {
            //initialMarginForArrows = parseInt($LGFirstTabHeadingRef.css("margin-left")) || 0;
            initialMarginForArrows = $leftTabNavControls.outerWidth();
            //}
            var dataLgId = $LGRef.attr("data-lg-id");
            if (pcd.$(evt.target).hasClass("right-arrow")) {
                var visibleTabLength = 0;
                if (reachedBeginning) {
                    $LGRef.find("[role='tab']").each(function() {
                        var $nThat = pcd.$(this);
                        if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                        visibleTabLength += $nThat.outerWidth(true);
                        if (visibleTabLength - initialMarginForArrows + 1 >= viewPortWidth) {
                            deltaDistanceToShiftTabsBy = visibleTabLength - viewPortWidth -
                                initialMarginForArrows;
                            return false;
                        }
                    });
                } else {
                    // visibleTabLength = Math.abs(currentMargin);
                    visibleTabLength = 0;
                    var wentInIf = false;
                    $LGRef.find("[role='tab']").each(function() {
                        var $nThat = pcd.$(this);
                        if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                        visibleTabLength += $nThat.outerWidth(true);
                        if (visibleTabLength > viewPortWidth + Math.abs(currentMargin) +
                            initialMarginForArrows) {
                            if (wentInIf || -10 < visibleTabLength - (viewPortWidth + initialMarginForArrows +
                                    Math.abs(currentMargin) + $nThat.outerWidth(true)) && visibleTabLength -
                                (viewPortWidth + initialMarginForArrows + Math.abs(currentMargin) + $nThat.outerWidth(
                                    true)) < 10) {
                                deltaDistanceToShiftTabsBy = Math.abs($nThat.outerWidth(true));
                            } else {
                                deltaDistanceToShiftTabsBy = Math.abs(visibleTabLength - Math.abs(
                                    currentMargin) - initialMarginForArrows - viewPortWidth);
                            }
                            /* special handling, code to remove minor movement */
                            if (parseInt(deltaDistanceToShiftTabsBy) < 10 && $nThat.parent().next().find(
                                    ".header").length > 0) deltaDistanceToShiftTabsBy += Math.abs($nThat.parent()
                                .next().find(".header").outerWidth(true));
                            if (!$nThat.parent().next().attr("data-lg-child-id")) $rightTabNavControls.find(
                                ".right-arrow").addClass("tab-arrow-inactive");
                            return false;
                        } else if (Math.abs(visibleTabLength) == viewPortWidth + Math.abs(currentMargin) +
                            initialMarginForArrows) {
                            wentInIf = true;
                        }
                    });
                }
                $leftTabNavControls.removeClass("tab-arrow-inactive");
                $LGRef.attr("data-reachedBeginning", "false");
            } else if (pcd.$(evt.target).hasClass("left-arrow")) {
                var hiddenTabLength = Math.abs(currentMargin);
                var prevChild = "";
                var i = 0;
                $LGRef.find("[role='tab']").each(function() {
                    var $nThat = pcd.$(this);
                    if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                    var tempH = 0;
                    if (i == 0) tempH = $nThat.outerWidth();
                    else tempH = $nThat.outerWidth(true);
                    hiddenTabLength += $nThat.outerWidth(true);
                    i++;
                    if (hiddenTabLength >= Math.abs(currentMargin) + initialMarginForArrows) {
                        if (isTabCoveredByLeftArrow($nThat, $leftTabNavControls)) {
                            deltaDistanceToShiftTabsBy = tempH - (hiddenTabLength - (Math.abs(currentMargin) +
                                initialMarginForArrows));
                        } else if (prevChild != "") {
                            deltaDistanceToShiftTabsBy = pcd.$(prevChild).outerWidth(true);
                        } else {
                            deltaDistanceToShiftTabsBy = defaultDeltaDistanceToShiftTabsBy;
                        }
                        /* special handling, code to remove minor movement */
                        if (parseInt(deltaDistanceToShiftTabsBy) < 5 && $nThat.parent().prev().find(
                                ".header")) deltaDistanceToShiftTabsBy += Math.abs($nThat.parent().prev().find(
                            ".header").outerWidth(true));
                        return false;
                    }
                    prevChild = this;
                });
                if (i == 1) {
                    /* case one only tab left hidden */
                    deltaDistanceToShiftTabsBy = $LGFirstTabHeadingRef.outerWidth() + initialMarginForArrows;
                }
                //$rightTabNavControls.find(".right-arrow").css("opacity", "1");
                $rightTabNavControls.find(".right-arrow").removeClass("tab-arrow-inactive");
            }

            function computeSafeNewMarginLeftForFirstTab(incomingComputedMargin) {
                var totalAllTabHeadingsWidth = 0;
                var dataLgId = $LGRef.attr("data-lg-id");
                $LGRef.find("[role='tab']").each(function() {
                    var $nThat = pcd.$(this);
                    if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                    totalAllTabHeadingsWidth += $nThat.outerWidth(true);
                });
                var minMarginLeft = -(totalAllTabHeadingsWidth + $leftTabNavControls.position().left +
                    $leftTabNavControls.outerWidth(true) - $rightTabNavControls.position().left +
                    $rightTabNavControls.outerWidth(true));
                var maxMarginLeft = $leftTabNavControls.outerWidth(true);
                if (minMarginLeft <= incomingComputedMargin && incomingComputedMargin <= maxMarginLeft) return incomingComputedMargin;
                else if (incomingComputedMargin < minMarginLeft) {
                    //$rightTabNavControls.find(".right-arrow").css("opacity", "0.3");
                    $rightTabNavControls.find(".right-arrow").addClass("tab-arrow-inactive");
                    return minMarginLeft;
                } else {
                    /*else if(incomingComputedMargin > maxMarginLeft)*/
                    $LGRef.attr("data-reachedBeginning", "true");
                    //$leftTabNavControls.css("opacity", "0.3");
                    $leftTabNavControls.addClass("tab-arrow-inactive");
                    return maxMarginLeft;
                }
            }

            function __L($el) {
                return (parseInt($el.css("margin-left")) || 0) + $el.position().left;
            }

            function isTabCoveredByLeftArrow(selectedHeader, $leftTabNavControls) {
                return __L(selectedHeader) + 1 < $leftTabNavControls.position().left + $leftTabNavControls.outerWidth(
                    true);
            }
            var newMargin = pcd.$(evt.target).hasClass("left-arrow") ? currentMargin + deltaDistanceToShiftTabsBy :
                currentMargin - deltaDistanceToShiftTabsBy;
            newMargin = computeSafeNewMarginLeftForFirstTab(newMargin);
            //marginBeforeResize = newMargin;
            $LGRef.attr("data-marginBeforeResize", newMargin);
            var activeTab = _getActiveTabElement($LGRef);
            if (!_isSelectedHeaderBetweenTheTwoArrows(activeTab, $leftTabNavControls, $rightTabNavControls))
                _setSectionTransitionAttribute(activeTab, $LGRef, "", nestedLG);
            //$LGFirstTabHeadingRef.css("margin-left", newMargin + "px");
            $LGRef.find("[role='tab']div.header").each(function() {
                var $nThat = pcd.$(this);
                if ($nThat.closest("[data-lg-id]").attr("data-lg-id") != dataLgId) return;
                var thisObj = $nThat && $nThat[0] ? $nThat[0] : "";
                if (thisObj && !thisObj.classList.contains("lg-transition-all-ease-out")) {
                    thisObj.classList.add("lg-transition-all-ease-out");
                    thisObj.classList.remove("lg-transition-ml-linear", "lg-transition-all-linear");
                }
                $nThat.css({
                    //"transition": "all 0.5s ease-out",
                    "transform": "translateX(" + newMargin + "px)"
                });
            });
            if (!_isSelectedHeaderBetweenTheTwoArrows(activeTab, $leftTabNavControls, $rightTabNavControls))
                _resetSectionTransitionAttribute(activeTab, $LGRef, currentMarginForSection, currentTabHeight,
                    $rightTabNavControls, $LGFirstTabHeadingRef, nestedLG);
            flagToStopEvent = true;
        }, _L = function($el) {
            return (($el && parseInt($el.css("margin-left"))) || 0) + ($el ? $el.position().left : 0);
        }, _isActiveTabBetweenTheTwoArrows = function(selectedHeader, $rightTabNavControls) {
            if (_isTabCoveredByRightArrow(selectedHeader, $rightTabNavControls)) {
                return true;
            } else if (_L(selectedHeader) > 0 && Math.abs(_L(selectedHeader)) + selectedHeader.outerWidth() <=
                $rightTabNavControls.position().left) {
                return true;
            } else if (_L(selectedHeader) <= 0 && Math.abs(_L(selectedHeader)) <= selectedHeader.outerWidth()) {
                return true;
            } else {
                return false;
            }
        }, _isTabCoveredByRightArrow = function(selectedHeader, $rightTabNavControls) {
            return _L(selectedHeader) + selectedHeader.outerWidth() > $rightTabNavControls.position().left;
        }, _isSelectedHeaderBetweenTheTwoArrows = function(selectedHeader, $leftTabNavControls, $rightTabNavControls) {
            return _L(selectedHeader) >= $leftTabNavControls.position().left + $leftTabNavControls.outerWidth(true) &&
                _L(selectedHeader) + selectedHeader.outerWidth() <= $rightTabNavControls.position().left;
        }, _setSectionTransitionAttribute = function(activeTab, $LGRef, calledFrom, nestedLG) {
            if($LGRef.attr("data-semantic-tab") === "true") return;
            if (calledFrom == "fromMenu") var topSectionDiv = $LGRef.attr("data-topCalculateBeforeScroll");
            else var topSectionDiv = activeTab.next().offset().top - $(document).scrollTop();
            var leftSectionDiv = activeTab.next().offset().left - $(document).scrollLeft(),
                widthSectionDiv = activeTab.next().width();
            activeTab.next().addClass("transition-position");
            //if(!(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1))
            activeTab.next().css({
                top: topSectionDiv + "px",
                left: leftSectionDiv + "px",
                marginTop: ""
            });
            /*else{
            activeTab.next().css({top: topSectionDiv+"px", left: leftSectionDiv+"px"});
            activeTab.next().css("margin-top","");
            }*/
            //activeTab.next().height(activeTab.next().height());
            activeTab.next().width(widthSectionDiv);
            if (!nestedLG) $LGRef.height($LGRef.parent().height());
            //$LGRef.height(parseInt(activeTab.next().css('height'))+topSectionDiv);
            $LGRef.width($LGRef.parent().width());
        }, _resetSectionTransitionAttribute = function(activeTab, $LGRef, currentMarginForSection, currentTabHeight,
            $rightTabNavControls, $LGFirstTabHeadingRef, nestedLG) {
            //setTimeout( function(){
            $LGFirstTabHeadingRef.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                //if (!_isActiveTabBetweenTheTwoArrows(activeTab, $rightTabNavControls)) {
                //activeTab.next().css("marginTop", (currentMargin+currentTabHeight)+"px");
                // activeTab.next().attr('style', "margin-top:" + (currentMarginForSection + currentTabHeight) + "px !important");
                // } else { // commenting as part of this BUG-516423
                //activeTab.next().css("marginTop", (currentMargin-currentTabHeight)+"px");
                activeTab.next().attr('style', "margin-top:" + currentMarginForSection + "px !important");
                // }
                activeTab.next().removeClass("transition-position");
                activeTab.next().css('height', '');
                activeTab.next().css('width', '');
                if (!nestedLG) $LGRef.css('height', '');
                $LGRef.css('width', '');
                //}, 300);
            });
            $LGRef.attr("data-topCalculateBeforeScroll", 0);
        }, _initializeLayoutGroupToRemoveScrollClass = function() {
            var $AllTypeLGRefsOnPage = pcd.$(".content-layout-group");
            //BUG-267736 display:none for tab-indicator
            $AllTypeLGRefsOnPage.find(".tab-indicator").css("display", "none");
            $AllTypeLGRefsOnPage.each(function(i, oneLGRef) {
                var type = _getLayoutGroupType(pcd.$(oneLGRef));
                if (type != 'tab') {
                    var headerSelector = oneLGRef && oneLGRef.hasAttribute("data-role") ? "[data-role='tab']" : "[role='tab']";
                    var divWrapperLG = pcd.$(oneLGRef).closest(".content-layout-group");
                    if (!divWrapperLG.hasClass("stretch-tabs")) {
                        divWrapperLG.removeClass("tab-overflow");
                        divWrapperLG.parent().removeClass("container-scroll").css("height", "");
                        divWrapperLG.attr("data-topCalculateBeforeScroll", 0).attr("data-marginBeforeResize",
                            0);
                        divWrapperLG.children(".left-tab-nav-controls").css("display", "none");
                        divWrapperLG.children(".right-tab-nav-controls").css("display", "none");
                        (type == "tab") && divWrapperLG.children(".add-new-tab").css("display", "inline-block");
                        /* BUG-504608 : revert to BUG-377764 */
                        _findNative(divWrapperLG, headerSelector).css("transform", "translateX(0px)");
                    } else {
                        if (divWrapperLG.css("visibility") == "hidden") divWrapperLG.css("visibility",
                            "visible");
                        divWrapperLG.parent().removeClass("container-scroll");
                        var firstTab = divWrapperLG.find(headerSelector+":first") && divWrapperLG.find(
                           headerSelector+":first")[0] ? divWrapperLG.find(headerSelector+":first")[0] : '';
                        if (firstTab && !firstTab.classList.contains("lg-transition-none")) {
                            firstTab.classList.add("lg-transition-none", "no-padding");
                            firstTab.classList.remove("lg-transition-ml-linear", "lg-transition-all-linear",
                                "lg-transition-all-ease-out");
                        }
                        //divWrapperLG.find(headerSelector+":first").css("transition", "none").css("marginLeft", "0");
                    }
                }
                if (type != 'accordion' && pcd.$(oneLGRef).hasClass("lg-accordion-numbered")) {
                    /* need to remove thenumber div */
                    var divWrapperLG = pcd.$(oneLGRef).closest(".content-layout-group");
                    var childLayout = divWrapperLG.children(".layout");
                    var hederChildLayout = childLayout.children(".header");
                    hederChildLayout.children(".number-accordion-navigation").remove();
                }
            });
        }, _isParentOverlay = function($LGRef) {
            if ($LGRef.closest("#_popOversContainer").length != 0 || $LGRef.closest("#modalOverlay").length != 0) {
                return !0;
            } else {
                return false;
            }
        },
        _processError = function (element, action) {	
            try {	
                    if (action === "add") {	
                        markErrorOnLayoutGroup(element);	
                    } else if (action === "clear") {	
                        clearErrorOnLayoutGroup(element);	
                    }	
            } catch (e) {	
                if (window.console) {	
                    console.error("Exception while setting error marker on tabheader.");	
                }	
            }	
        },	
        /* US-379050 - start */	
        markErrorOnLayoutGroup = function (element) {	
            if (element) {	
                var tabContentDiv = $(element).closest("div[data-lg-child-id]")[0];	
                var tabGrpDiv = $(element).hasClass("content-layout-group") ? $(element.parentElement).closest(".content-layout-group")[0] : $(element).closest(".content-layout-group")[0];	
                if (tabGrpDiv && tabContentDiv) {	
                    markErrorOnLayoutGroupHeader(tabGrpDiv, parseInt(tabContentDiv.getAttribute("data-lg-child-id")));	
                    markErrorOnLayoutGroup(tabGrpDiv);	
                }	
                else	
                    return;	
            }	
        },	
        markErrorOnLayoutGroupHeader = function (tabGrpDiv, tabId) {	
            if (tabGrpDiv) {		
                /* check whether LG is a menu LG then we need to add error icon to menubar also along with header */	
                var lgType = _getLayoutGroupType($(tabGrpDiv));	
                    /*BUG-293924 - Add ErrorIcon except RepeatTabbed scenario*/	
                    if (!pega.util.Dom.hasClass(tabGrpDiv, "repeatTabbed")) {	
                        var tabHeader = $(tabGrpDiv).children("[data-lg-child-id = '" + tabId + "']").children(".header")[0];
                        var tabErrorToolTip = tabGrpDiv ? pega.u.d.fieldValuesList.get("TabErrorTooltip") : "";
                        addErrorIcon(tabHeader, tabErrorToolTip, lgType);	
                        if (lgType === "menu") {	
                            var menuHeader = $(tabGrpDiv).children(".layout-group-nav").children(".layout-group-nav-title")[0];	
                            addErrorIcon(menuHeader, tabErrorToolTip, lgType);	
                        }	
                    }	
            }	
        },	
        addErrorIcon = function (tabHeader, tabErrorToolTip, lgType) {
            if (!tabHeader) {	
                return;	
            }	
            if (lgType !== "menu" ) {	
              
                var tabLabel = tabHeader.getAttribute('data-aria-label') ? tabHeader.getAttribute('data-aria-label') : tabHeader.getAttribute('aria-label');
                var localizedValue = pega.u.d.fieldValuesList.get('TabHasErrors');	
                	
                if (!tabHeader.querySelector("span#PegaRULESErrorFlag")) {	
                    if(lgType === "accordion") {
                      tabHeader = $(tabHeader).find(".accordion-btn")[0];
                      tabLabel = tabHeader.getAttribute('data-aria-label') ? tabHeader.getAttribute('data-aria-label') : tabHeader.getAttribute('aria-label');
                    }
                    tabHeader.setAttribute('data-aria-label', tabLabel);
                    tabLabel = localizedValue ? localizedValue.replace(/\{1\}/g, tabLabel) : tabLabel;
                    tabHeader.setAttribute('aria-label', tabLabel);	
                    var newDivObj = document.createElement("div");	
                    newDivObj.style.display = "inline-block";	
                    newDivObj.style.position = "relative";	
                    newDivObj.style.marginLeft = "0px";	
                    //newDivObj.style.marginBottom = "10px";	
                    newDivObj.className = "iconErrorTabsDiv";	
                    newDivObj.style.width = "10px";	
                    newDivObj.style.height = "10px";	
                    newDivObj.innerHTML = "<span class='iconErrorTabs' title='" + tabErrorToolTip + "' id='PegaRULESErrorFlag'/>";	
                    //var tabSpan = tabHeader.querySelector("span#TABSPAN");	
                    tabHeader.insertBefore(newDivObj, tabHeader.children[0]);	
                } else if (tabHeader.querySelector("span#PegaRULESErrorFlag").parentNode.style.display !== "block") {	
                    tabHeader.querySelector("span#PegaRULESErrorFlag").parentNode.style.display = "inline-block";	
                    if(lgType === "accordion") {
                      tabHeader = $(tabHeader).find(".accordion-btn")[0];
                      tabLabel = tabHeader.getAttribute('data-aria-label') ? tabHeader.getAttribute('data-aria-label') : tabHeader.getAttribute('aria-label');
                    }
                    tabHeader.setAttribute('data-aria-label', tabLabel);
                    tabLabel = localizedValue ? localizedValue.replace(/\{1\}/g, tabLabel) : tabLabel;
                    tabHeader.setAttribute('aria-label', tabLabel);	
                }	
            }	
            else {	
                /* adding the Error icon for the menu LG menu bar */	
                if (!tabHeader.querySelector("span#PegaRULESErrorFlag")) {	
                    //tabHeader.setAttribute('aria-label', tabLabel);	
                    var newDivObj = document.createElement("div");	
                    newDivObj.style.display = "inline-block";	
                    newDivObj.style.marginLeft = "0px";	
                    newDivObj.style.width = "10px";	
                    newDivObj.style.height = "10px";	
                    newDivObj.style.position = "relative";	
                    newDivObj.className = "iconErrorTabsDiv";	
                    newDivObj.innerHTML = "<span class='iconErrorTabs' title='" + tabErrorToolTip + "' id='PegaRULESErrorFlag'/>";	
                    //var tabSpan = tabHeader.querySelector("span#TABSPAN");	
                    tabHeader.insertBefore(newDivObj, tabHeader.children[0]);	
                }	
            }	
        },	
        clearErrorOnLayoutGroup = function (element) {	
            if (element) {	
                var tabContentDiv = $(element).hasClass("content-layout-group") ? $(element).children(".active")[0] : $(element).closest("div[data-lg-child-id]")[0];	
                var tabGrpDiv = $(element).hasClass("content-layout-group") ? element : $(element).closest(".content-layout-group")[0];	
                if (tabGrpDiv && tabContentDiv) {	
                    clearErrorOnLayoutGroupHeader(tabGrpDiv, tabContentDiv);	
                }	
            }	
            else	
                return;	
        },	
        clearErrorOnLayoutGroupHeader = function (tabGrpDiv, tabContentDiv) {	
            if (tabGrpDiv) {	
                var lgType = _getLayoutGroupType($(tabGrpDiv));	
                var iconArray = tabContentDiv.querySelectorAll("div[class *= 'iconErrorDiv']");	
                var iconArrayWithDisplayNone = tabContentDiv.querySelectorAll("div[class *= 'iconErrorDiv'][style *= 'display: none;']");	
                if (iconArray.length === iconArrayWithDisplayNone.length) {	
                        /*BUG-293924 - Remove ErrorIcon except RepeatTabbed scenario*/	
                        if (!pega.util.Dom.hasClass(tabGrpDiv, "repeatTabbed")) {	
                            var tabHeader = $(tabContentDiv).find(".header")[0];	
                            removeErrorIcon(tabHeader, lgType);	
                            /* in case of menu LG the icon on the menubar also should be removed */	
                            if (lgType === "menu") {	
                                var menuHeader = $(tabGrpDiv).children(".layout-group-nav").children(".layout-group-nav-title")[0];	
                                removeErrorIcon(menuHeader, lgType);	
                            }	
                        }	
                        clearErrorOnLayoutGroup($(tabGrpDiv.parentElement).closest(".content-layout-group")[0]);	
                }	
            }	
        },	
        removeErrorIcon = function (tabHeader, lgType) {	
            if (tabHeader) {
                var ele = tabHeader.getElementsByClassName("iconErrorTabsDiv");
                if (ele && ele.length > 0) {	
                    $(ele[0]).remove();	
                }	
                if(lgType === "accordion") tabHeader = $(tabHeader).find(".accordion-btn")[0];
                var ariaLabel = tabHeader.getAttribute('data-aria-label') ? tabHeader.getAttribute('data-aria-label') : tabHeader.getAttribute('aria-label');
                tabHeader.setAttribute('aria-label', ariaLabel);
            }	
        },	
        /* US-379050 - end */
        /*
         @protected Initialize the layout group handlers
         @return $void$
        */
        _initializeLayoutGroup = function() {
            if (window.$) {
                if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState ===
                    "interactive") {
                    // document has at least been parsed
                    _initializeLayoutGroupReady();
                } else {
                    $(_initializeLayoutGroupReady);
                }
            } else {
                alert("Layout group could not be initialized.");
            }
        },
        /*
         @protected ready handler - because Jquery 3.x is now calling the ready function async if the DOMContentLoaded is already called, the ready handler needs to be called outside of the handlers.
         @return $void$
        */
        _initializeLayoutGroupReady = function() {
            /* BUG-421614 */
            _updateStretchTabWidths();
            if (isLayoutGroupModuleLoaded) return;
            isLayoutGroupModuleLoaded = true;
            /* temporary function to make !tab layout to remove certain classes */
            if (!_isTouchDevice()) _initializeLayoutGroupToRemoveScrollClass();
            if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
                if (window.PointerEvent) {
                    touchStart = "pointerdown";
                    touchMove = "pointermove";
                    touchEnd = "pointerup";
                    touchCancel = "pointercancel";
                    touchOut = "pointerout";
                } else if (window.MSPointerEvent) {
                    touchStart = "MSPointerDown";
                    touchMove = "MSPointerMove";
                    touchEnd = "MSPointerUp";
                    touchCancel = "MSPointerCancel";
                    touchOut = "MSPointerOut";
                }
            }
            touchBindEvents = touchMove + " " + touchEnd + " " + touchCancel + " " + touchOut;
            _setBrowserPrefix();
            if (!$("body").attr("data-lgclickregiestered")) {
                $("body").attr("data-lgclickregiestered", "true");
                $("body").on("keydown click touchstart", function lgMainHandler(e) {
                    // flag busy to perf mon
                    pega.ui.statetracking.setBusy("lgMainHandler");
                    var rt = null; // small refactoring below would cleanup this
                    var elem = null;
                    if (e.type === "keydown") {
                      elem = pcd.$(e.target);
                      if(elem.hasClass("accordion-btn")) elem = elem.parent().parent();
                    }
                    else {
                        /* BUG-238699:Layout Group tab appears clickable but does not switch tab */
                        if (e.target.tagName.toUpperCase() == 'DIV' && e.target.className.split(' ').indexOf(
                                "header") > -1) {
                            elem = pcd.$(e.target);
                        } else {
                            /* BUG-286460 hamburger icon case set the elem */
                            if (pcd.$(e.target).parent().hasClass('layout-group-nav-title')) elem = pcd.$(e.target)
                                .parent().parent();
                            else if (pcd.$(e.target).parent().hasClass("header-element")) elem = pcd.$(e.target)
                                .parents('.layout-group-nav').length ? pcd.$(e.target).parents(
                                    '.layout-group-nav') : pcd.$(e.target).parent();
                            else { 
                              elem = pcd.$(e.target).parent();
                              if(elem.hasClass("accordion-btn")) elem = elem.parent().parent();
                            }
                        }
                    }
                    if (elem.hasClass("layout-group-item-title") || elem.hasClass("layout-group-nav-title") ||
                        elem.hasClass("header-content") || elem.hasClass("header-element") || elem.parents(
                            "span.header-element").length > 0) elem = elem.closest('.header');
                    if ((elem.hasClass('header') && elem.parent().hasClass('layout') && elem.parent().parent()
                            .hasClass('content-layout-group')) || elem.hasClass("add-new-tab-bg")) {
                        if (e.type == "keydown") {
                            rt = _handleNavigationMenuKeydown(e, elem);
                            pega.ui.statetracking.setDone();
                            return rt;
                        } else {
                            if (e.type != "touchstart") {
                                /* BUG-310434 */
                                if (!window.event) window.event = e;
                                if (!pcd.$(elem).attr("data-click") && pcd.$(elem).parents(
                                        "[data-details-flowaction]").length) {
                                    e.stopPropagation();
                                }
                                _makeLayoutActive(elem.parent().parent(), elem);
                                pega.ui.statetracking.setDone();
                            }
                            return true; /* US-104283 Actions on Layout Groups */
                        }
                    } else if ((elem.hasClass('header') && elem.parent().hasClass('layout') && elem.parent().parent().parent()
                            .hasClass('content-layout-group')) || elem.hasClass("add-new-tab-bg")) {
                      if (e.type == "keydown") {
                            rt = _handleNavigationMenuKeydown(e, elem);
                            pega.ui.statetracking.setDone();
                            return rt;
                        } else {
                       _makeLayoutActive(elem.parent().parent().parent(), elem);
                        }
                    }else if (elem.hasClass('layout-group-nav') && elem.parent().hasClass(
                            'content-layout-group')) {
                        if (e.type == "keydown") {
                            rt = _showNavigationMenu(e, elem.parent());
                            pega.ui.statetracking.setDone();
                            return rt;
                        } else {
                            if (elem.children(".layout-group-nav-title").children(".icon-openclose:visible")
                                .length > 0) {
                                /* Remove "/iPad|iPhone/.test(navigator.userAgent) ||" for BUG-365199 */
                                /* Remove etype = "touchstart" for BUG-367251, 'click' in document.documentElement && 'ontouchstart' in document.documentElement && e.type == "touchstart" */
                                if (('click' in document.documentElement && 'ontouchstart' in document.documentElement &&
                                        e.type == "click") || (!('ontouchstart' in document.documentElement) &&
                                        e.type != "touchstart")) {
                                    /* allow touchstart in case of ios device only in case of menu nav , android ( chrome/ff emulator ) calls click after touchstart causing double event trigger */
                                    _showHideMenu(elem.parent());
                                }
                            }
                            pega.ui.statetracking.setDone();
                            return false;
                        }
                    }
                    if (e.type == "click" || e.type == "touchstart") _hideAllMenus(); // for any click event that will close the menu automatically
                    pega.ui.statetracking.setDone();
                    return true;
                });
            }
            if (_isTouchDevice()) {
                _swipe();
                $("body").addClass('touchable');
                /*TabOverflowSpike START*/
                /*if (false) {
                    // Currently not needed only for desktop 
                    function __slideTabHeadings($LGRef, deltaDistanceToShiftTabsBy) {
                        var $LGFirstTabHeadingRef = $LGRef.find("[data-role='tab']:first");
                        var currentMargin = parseInt($LGFirstTabHeadingRef.css("margin-left")) || 0;
 
                        function computeSafeNewMarginLeftForFirstTab(incomingComputedMargin) {
                            var totalAllTabHeadingsWidth = 0;
                            $LGRef.find("[data-role='tab']").each(function() {
                                totalAllTabHeadingsWidth += pcd.$(this).outerWidth();
                            });
                            var minMarginLeft = -(totalAllTabHeadingsWidth - $LGRef.outerWidth(true));
                            var maxMarginLeft = 0;
                            if (minMarginLeft <= incomingComputedMargin && incomingComputedMargin <= maxMarginLeft) return incomingComputedMargin;
                            else if (incomingComputedMargin < minMarginLeft) return minMarginLeft;
                            else //else if(incomingComputedMargin > maxMarginLeft)
                              return maxMarginLeft;
                        }
                        var newMargin = currentMargin + deltaDistanceToShiftTabsBy;
                        newMargin = computeSafeNewMarginLeftForFirstTab(newMargin);
                        $LGFirstTabHeadingRef.css("margin-left", newMargin + "px");
                    }
                    $("body").on(touchStart + " " + touchMove + " " + touchEnd, ".layout-group-item-title, [data-role='tab'], [data-lg-child]", function lgTabHeadingsSwipeHandler(e) {
                        var $LGRef = pcd.$(e.target).parents("[data-role=tablist]");
                        var LGFirstTabHeading = $LGRef.find("[data-role='tab']:first").get(0);
                        var type = _getLayoutGroupType($LGRef);
                        if (type != "tab") return true;
                        var touchPos = _getTouchPoint(e);
                        if (e.type == touchStart) {
                           // /* store starting coordinates 
                            LGFirstTabHeading.xDown = touchPos.X;
                        } else if (e.type == touchMove) {
                            if (!LGFirstTabHeading.xDown) {
                                return true;
                            }
                            var xUp = touchPos.X;
                            var xDeltaDistanceToShiftTabsBy = xUp - LGFirstTabHeading.xDown;
                          //  /* console.info("lgTabHeadingsSwipeHandler : swipe on tab headings by ", xDeltaDistanceToShiftTabsBy); 
                            __slideTabHeadings($LGRef, xDeltaDistanceToShiftTabsBy);
                        } else if (e.type == touchEnd) {
                          //  /* reset coordinates after one set of [1 touchstart, multiple touchmoves and 1 touchend] occurs
                            LGFirstTabHeading.xDown = null;
                           LGFirstTabHeading.yDown = null;
                        }
                        return true;
                    });
                }*/
                /*TabOverflowSpike END*/
            }
            /* For hiddening arrows on breakpoints */
            if (!_isTouchDevice()) {
                /* window resize to be triggered only once - Similar to debounce in underscorejs */
                var sTimer;
                window.onresize = function() {
                    if (forceResize) {
                        _resizeActions();
                    }
                    clearTimeout(sTimer);
                    /* wait till resize drag/maximize/minimize is completed */
                    sTimer = setTimeout(_resizeActions, 500);
                };
                /* putting code again for BUG-319806, $(window).resize not called when open tabs.*/
                pega.u.d.registerResize(_resizeActions);
                _onLoadAttachEvent();
            }
            _checkForErrors();
        };
    /*\
    |*|
    |*| Bind event handlers and other load processes
    |*|
    \*/
    _initializeLayoutGroup();
    /*\
    |*|
    |*| Public methods
    |*| Return one anonymous object literal that would expose privileged methods.
    |*|
    \*/
    var lgmap = {};
    return {
        /*
        @public this function willset this layoutElement to active - used by visible when on client (see pzpega_ui_doc_EventsConditionsChaining.js)
        @return $void$
        */
        setLayoutActive: function(layoutElement) {
            var selectedHeader = pcd.$(layoutElement).children(".header"),
                layoutgroup = selectedHeader.attr("data-semantic-tab") === "true" ? pcd.$(layoutElement).parent().parent() : pcd.$(layoutElement).parent();
            _setLayoutActive(layoutgroup, selectedHeader);
        },
        setLayoutActiveIndex: function(layoutgroup, index) {
            var lguiqueid = pcd.$(layoutgroup).attr("data-lg-id");
            lgmap[lguiqueid] = index;
        },
        getLayoutActiveIndex: function(uid) {
            return lgmap[uid];
        },
        setLayoutInactive: function(layoutElement) {
            _setLayoutInactive(pcd.$(layoutElement));
        },
        setHiddenField: function(layoutgroup) {
            var selectedHeader = this.getActiveTabElement(layoutgroup);
            _setHiddenField(layoutgroup, selectedHeader);
        },
        checkForErrors: function(onlyCheckForError) {
          if(!onlyCheckForError)
            _initializeLayoutGroupReady();
            _checkForErrors();
        },
        nextAccordionActive: function(event) {
            _nextAccordionActive(event);
        },
        prevAccordionActive: function(event) {
            _prevAccordionActive(event);
        },
        expandAccordionPane: function(event) {
            _expandAccordionPane(event);
        },
        updateStretchTabWidths: function() {
            _initializeLayoutGroupReady();
            //_updateStretchTabWidths();
        },
        showActiveTabListMenu: function(event) {
            _showActiveTabListMenu(event);
        },
        activateTabFromMenu: function(tabId, event, calledFrom, oneLGRef, nestedLG) {
            _activateTabFromMenu(tabId, event, calledFrom, oneLGRef, nestedLG);
        },
        /* BUG-267058 Start */
        getLayoutGroupType: function(layoutgroup) {
            return _getLayoutGroupType(layoutgroup);
        },
        getActiveTabElement: function(layoutgroup) {
            return _getActiveTabElement(pcd.$(layoutgroup));
        },
        updateLayoutHeight: function(layoutgroup, fromDOMLoad) {
            _initializeLayoutGroupReady();
            /*var type = this.getLayoutGroupType(layoutgroup);              
                    if(!layoutgroup.hasClass("stretch-tabs") && type == 'tab'){*/
            var selectedHeader = this.getActiveTabElement(layoutgroup);
            _updateLayoutHeight(layoutgroup, selectedHeader, false, fromDOMLoad);
            /*}*/
        },
        initialiseLGTreatment: function() {
            _initializeLayoutGroupReady();
            _initialiseLGTreatment();
        },
        goToNextError: function (element) {	
            _goToNextError(element);	
        },	
        handleErrorsInLayoutgroupLayout: function (element, action) {	
            // US-ErrorLG	
            _processError(element, action);	
        },
        resizeActions: function() {
            _resizeActions();
        },
        setLGModuleToFalse: function(config) {
                _setLGModuleToFalse(config);
            }
            /* BUG-267058 End */
    };
}(pega);
//static-content-hash-trigger-YUI